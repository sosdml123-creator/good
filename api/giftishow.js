/**
 * Vercel Serverless Function for the e쿠폰 point shop (기프티쇼 비즈 API, KT alpha)
 * Endpoint: /api/giftishow
 *
 *  GET  ?action=goods            판매중 상품 목록 (공개, CDN 캐시)
 *  GET  ?action=detail&code=...  상품 상세 설명 (공개, CDN 캐시)
 *  GET  ?action=my               내 교환 쿠폰 + 포인트 잔액 (로그인 필요)
 *  POST { action: 'exchange', goodsCode }       포인트 차감 후 쿠폰 발급 (로그인 필요)
 *  POST { action: 'use', trId, isUsed }         내 쿠폰 사용완료 표시 (로그인 필요)
 *  GET  ?action=status           비즈머니 잔액 / 설정 상태 (관리자)
 *
 * 인증키는 서버 환경변수에만 둡니다. 기프티쇼 비즈 약관상 현금(PG) 결제 판매는 금지이며
 * 리워드 포인트 교환만 허용되므로, 결제 수단은 포인트뿐입니다.
 */

import { randomBytes } from 'node:crypto';
import { verifyAdminRequest } from './_lib/adminAuth.js';

export const config = { maxDuration: 60 };

const BIZ_API = 'https://bizapi.giftishow.com/bizApi';
const SEND_TIMEOUT_MS = 15000;
const CATALOG_TTL_MS = 30 * 60 * 1000;

const AUTH_CODE = process.env.GIFTISHOW_AUTH_CODE;
const AUTH_TOKEN = process.env.GIFTISHOW_AUTH_TOKEN;
const BIZ_USER_ID = process.env.GIFTISHOW_USER_ID;
const CALLBACK_NO = String(process.env.GIFTISHOW_CALLBACK_NO || '').replace(/\D/g, '');

// 포인트 위변조·오남용 시 비즈머니 손실을 제한하는 안전장치 (1P = 1원)
const MAX_PRICE = Number(process.env.GIFTISHOW_MAX_PRICE) || 30000;
const USER_DAILY_LIMIT = Number(process.env.GIFTISHOW_USER_DAILY_LIMIT) || 30000;
const GLOBAL_DAILY_LIMIT = Number(process.env.GIFTISHOW_GLOBAL_DAILY_LIMIT) || 300000;

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const isCatalogConfigured = () => Boolean(AUTH_CODE && AUTH_TOKEN);
const isExchangeConfigured = () =>
  Boolean(isCatalogConfigured() && BIZ_USER_ID && CALLBACK_NO && supabaseUrl && serviceKey);

async function callBiz(path, apiCode, params = {}, timeoutMs = 20000) {
  const body = new URLSearchParams({
    api_code: apiCode,
    custom_auth_code: AUTH_CODE,
    custom_auth_token: AUTH_TOKEN,
    dev_yn: 'N',
    ...params,
  });
  const res = await fetch(`${BIZ_API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    signal: AbortSignal.timeout(timeoutMs),
  });
  return res.json();
}

// ───────────────────────── 상품 카탈로그 ─────────────────────────

let catalogCache = null; // { at, byCode: Map<goodsCode, raw goods> }

function isSellable(g, now) {
  if (g.goodsStateCd !== 'SALE') return false;
  // 현금성 상품권은 취급하지 않음
  if (g.goodsTypeNm === '상품권') return false;
  if (!(g.realPrice > 0) || g.realPrice > MAX_PRICE) return false;
  if (g.saleDateFlag === 'Y' && g.saleLimitEdDate && new Date(g.saleLimitEdDate).getTime() < now) return false;
  if (g.endDate && new Date(g.endDate).getTime() < now) return false;
  return true;
}

async function loadCatalog() {
  if (catalogCache && Date.now() - catalogCache.at < CATALOG_TTL_MS) return catalogCache;

  const byCode = new Map();
  const now = Date.now();
  const size = 3000;
  for (let page = 1; page <= 10; page++) {
    const json = await callBiz('/goods', '0101', { start: String(page), size: String(size) });
    if (json?.code !== '0000') {
      throw new Error(`기프티쇼 상품 조회 실패: ${json?.code || 'unknown'} ${json?.message || ''}`);
    }
    const list = json.result?.goodsList || [];
    for (const g of list) {
      if (isSellable(g, now)) byCode.set(g.goodsCode, g);
    }
    if (list.length < size) break;
  }

  catalogCache = { at: Date.now(), byCode };
  return catalogCache;
}

const toListItem = (g) => ({
  code: g.goodsCode,
  name: g.goodsName,
  brand: g.brandName,
  brandIcon: g.brandIconImg,
  image: g.goodsImgS || g.goodsImgB,
  price: g.realPrice,
  salePrice: g.salePrice,
  limitDay: g.limitDay,
  category: g.goodsTypeDtlNm,
});

// ───────────────────────── Supabase helpers ─────────────────────────

const serviceHeaders = () => ({
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  'Content-Type': 'application/json',
});

async function getUser(req) {
  const authHeader = String(req.headers['authorization'] || '');
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : '';
  if (!bearer || !supabaseUrl) return null;
  try {
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: anonKey || serviceKey, Authorization: `Bearer ${bearer}` },
    });
    if (!userRes.ok) return null;
    const user = await userRes.json();
    if (!user?.id || user.is_anonymous) return null;
    return user;
  } catch {
    return null;
  }
}

async function rpc(name, args) {
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: serviceHeaders(),
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error(`${name} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function updateOrder(trId, patch) {
  const res = await fetch(`${supabaseUrl}/rest/v1/coupon_orders?tr_id=eq.${encodeURIComponent(trId)}`, {
    method: 'PATCH',
    headers: { ...serviceHeaders(), Prefer: 'return=representation' },
    body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(`coupon_orders update failed: ${res.status} ${await res.text()}`);
  const rows = await res.json();
  return rows[0] || null;
}

async function getBalance(userId) {
  const res = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}&select=points`, {
    headers: serviceHeaders(),
  });
  const rows = res.ok ? await res.json() : [];
  return typeof rows[0]?.points === 'number' ? rows[0].points : null;
}

const toClientOrder = (o) => ({
  id: o.tr_id,
  couponId: o.goods_code,
  brand: o.brand_name || '',
  name: o.goods_name,
  imageUrl: o.goods_image || '',
  price: o.points,
  barcodeNumber: o.pin_no || '',
  couponImgUrl: o.coupon_img_url || undefined,
  purchasedAt: o.created_at,
  expiresAt: o.expires_at || '',
  isUsed: o.is_used,
  usedAt: o.used_at || undefined,
  status: o.status,
});

// ───────────────────────── 쿠폰 발급 ─────────────────────────

const kstDate = (offsetDays = 0) => {
  const d = new Date(Date.now() + 9 * 3600 * 1000 + offsetDays * 86400 * 1000);
  return d.toISOString().slice(0, 10);
};

const LIMIT_MESSAGES = {
  no_profile: '회원 정보를 찾을 수 없습니다. 다시 로그인해 주세요.',
  insufficient: '포인트가 부족합니다.',
  user_limit: `하루에 교환할 수 있는 한도(${USER_DAILY_LIMIT.toLocaleString()}P)를 넘었습니다. 내일 다시 시도해 주세요.`,
  global_limit: '오늘 준비된 e쿠폰 수량이 모두 소진되었습니다. 내일 다시 시도해 주세요.',
  invalid: '교환할 수 없는 상품입니다.',
};

async function exchange(user, goodsCode) {
  const catalog = await loadCatalog();
  const goods = catalog.byCode.get(String(goodsCode || ''));
  if (!goods) {
    return { status: 404, body: { success: false, error: '현재 교환할 수 없는 상품입니다.' } };
  }

  const points = goods.realPrice;
  const trId = `ssp_${kstDate().replace(/-/g, '')}_${randomBytes(5).toString('hex')}`;
  const expires = kstDate(Number(goods.limitDay) || 30);

  const begin = await rpc('coupon_exchange_begin', {
    p_user: user.id,
    p_tr_id: trId,
    p_goods_code: goods.goodsCode,
    p_goods_name: goods.goodsName,
    p_brand_name: goods.brandName,
    p_goods_image: goods.goodsImgS || goods.goodsImgB,
    p_points: points,
    p_cost: goods.discountPrice,
    p_expires: expires,
    p_user_daily_limit: USER_DAILY_LIMIT,
    p_global_daily_limit: GLOBAL_DAILY_LIMIT,
  });
  if (!begin?.ok) {
    return {
      status: 409,
      body: {
        success: false,
        reason: begin?.reason,
        error: LIMIT_MESSAGES[begin?.reason] || '교환을 진행할 수 없습니다.',
        balance: begin?.balance,
      },
    };
  }

  const refund = async (error) => {
    const r = await rpc('coupon_exchange_refund', { p_tr_id: trId, p_error: String(error).slice(0, 500) });
    return r?.balance ?? (await getBalance(user.id));
  };
  const failed = (balance) => ({
    status: 502,
    body: {
      success: false,
      error: '쿠폰 발급에 실패해 포인트를 돌려드렸습니다. 잠시 후 다시 시도해 주세요.',
      balance,
    },
  });

  // 포인트 차감에 성공한 뒤에만 발송 요청 (gubun=I: MMS 없이 바코드 이미지 + 핀번호 수신)
  let send;
  try {
    send = await callBiz('/send', '0204', {
      goods_code: goods.goodsCode,
      mms_title: '신상픽',
      mms_msg: '신상픽 포인트 교환 e쿠폰',
      callback_no: CALLBACK_NO,
      phone_no: CALLBACK_NO,
      tr_id: trId,
      user_id: BIZ_USER_ID,
      gubun: 'I',
    }, SEND_TIMEOUT_MS);
  } catch (err) {
    // 응답을 못 받은 경우 기프티쇼 쪽에는 발행되었을 수 있으므로 같은 TR_ID로 취소 요청
    console.error('[giftishow send timeout/error]', trId, err);
    let cancelCode = null;
    try {
      const cancel = await callBiz('/cancel', '0202', { tr_id: trId, user_id: BIZ_USER_ID });
      cancelCode = cancel?.code || null;
    } catch (cancelErr) {
      console.error('[giftishow cancel error]', trId, cancelErr);
    }
    // 취소 완료 / 이미 취소 / 해당 TR_ID 없음(미발행) 이면 환불
    if (['0000', 'ERR0808', 'COUPON.0008', 'ERR0214', 'COUPON.0004'].includes(cancelCode)) {
      return failed(await refund(`send no response; cancel=${cancelCode}`));
    }
    await updateOrder(trId, { status: 'unknown', error: `send no response; cancel=${cancelCode}` });
    return {
      status: 502,
      body: {
        success: false,
        error: '쿠폰 발급 결과를 확인하지 못했습니다. 확인 후 쿠폰 지급 또는 포인트 환불을 해드리겠습니다.',
        balance: begin.balance,
      },
    };
  }

  // 최상위 코드 실패: API 호출 실패 (비즈머니 미차감)
  if (send?.code !== '0000') {
    console.error('[giftishow send failed]', trId, send?.code, send?.message);
    return failed(await refund(`${send?.code} ${send?.message || ''}`));
  }

  const inner = send.result || {};
  const detail = inner.result || {};
  const failCode = inner.code && inner.code !== '0000' ? inner.code : detail.code;

  // 최상위는 정상이나 상세 결과가 실패: 비즈머니만 차감되고 핀 미발행 → 발송실패 취소 API
  if (failCode && failCode !== '0000') {
    console.error('[giftishow send-fail]', trId, failCode, detail.message || inner.message);
    let failCancel = null;
    try {
      const r = await callBiz('/sendFail/cancel', '0205', { tr_id: trId, user_id: BIZ_USER_ID });
      failCancel = r?.result?.code || r?.code || null;
    } catch (cancelErr) {
      console.error('[giftishow sendFail cancel error]', trId, cancelErr);
    }
    return failed(await refund(`${failCode} ${detail.message || inner.message || ''}; sendFailCancel=${failCancel}`));
  }

  if (!detail.pinNo && !detail.couponImgUrl) {
    await updateOrder(trId, { status: 'unknown', order_no: detail.orderNo || null, error: 'no pin in response' });
    return {
      status: 502,
      body: {
        success: false,
        error: '쿠폰 발급 결과를 확인하지 못했습니다. 확인 후 쿠폰 지급 또는 포인트 환불을 해드리겠습니다.',
        balance: begin.balance,
      },
    };
  }

  // 실제 유효기간 조회 (실패해도 발급은 유효)
  let expiresAt = expires;
  try {
    const info = await callBiz('/coupons', '0201', { tr_id: trId }, 8000);
    const end = info?.result?.[0]?.couponInfoList?.[0]?.validPrdEndDt;
    if (/^\d{8}/.test(String(end || ''))) {
      expiresAt = `${end.slice(0, 4)}-${end.slice(4, 6)}-${end.slice(6, 8)}`;
    }
  } catch {
    // ignore
  }

  const issued = {
    status: 'issued',
    order_no: detail.orderNo || null,
    pin_no: detail.pinNo || null,
    coupon_img_url: detail.couponImgUrl || null,
    expires_at: expiresAt,
  };
  let order;
  try {
    order = await updateOrder(trId, issued);
  } catch (err) {
    // 쿠폰은 이미 발행됨: 한 번 더 저장 시도, 그래도 실패하면 TR_ID로 수동 복구할 수 있게 기록
    console.error('[giftishow issued-save retry]', trId, detail.orderNo, err);
    order = await updateOrder(trId, issued);
  }

  return { status: 200, body: { success: true, coupon: toClientOrder(order), balance: begin.balance } };
}

// ───────────────────────── handler ─────────────────────────

export default async function handler(req, res) {
  // Enable CORS for web and Capacitor native apps (capacitor://localhost, https://localhost)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey, x-admin-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = String((req.method === 'GET' ? req.query?.action : req.body?.action) || '');

  try {
    if (req.method === 'GET' && (action === 'goods' || action === 'detail')) {
      if (!isCatalogConfigured()) {
        return res.status(503).json({ success: false, error: 'e쿠폰 상점을 여는 중입니다. 잠시 후 다시 확인해 주세요.' });
      }
      const catalog = await loadCatalog();
      res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400');

      if (action === 'goods') {
        return res.status(200).json({
          success: true,
          exchangeEnabled: isExchangeConfigured(),
          userDailyLimit: USER_DAILY_LIMIT,
          goods: Array.from(catalog.byCode.values(), toListItem),
        });
      }

      const g = catalog.byCode.get(String(req.query?.code || ''));
      if (!g) return res.status(404).json({ success: false, error: '상품을 찾을 수 없습니다.' });
      return res.status(200).json({
        success: true,
        detail: {
          ...toListItem(g),
          imageLarge: g.goodsImgB || g.goodsImgS,
          content: g.content || '',
          contentAddDesc: g.contentAddDesc || '',
          affiliate: g.affiliate || '',
          goodsType: g.goodsTypeNm || '',
        },
      });
    }

    if (req.method === 'GET' && action === 'status') {
      const auth = await verifyAdminRequest(req);
      if (!auth.ok) return res.status(auth.status).json({ success: false, error: auth.error });
      let bizmoney = null;
      if (isCatalogConfigured() && BIZ_USER_ID) {
        const r = await callBiz('/bizmoney', '0301', { user_id: BIZ_USER_ID });
        bizmoney = r?.code === '0000' ? Number(r.result?.balance ?? r.balance) : `${r?.code} ${r?.message || ''}`;
      }
      return res.status(200).json({
        success: true,
        catalogConfigured: isCatalogConfigured(),
        exchangeConfigured: isExchangeConfigured(),
        hasUserId: Boolean(BIZ_USER_ID),
        hasCallbackNo: Boolean(CALLBACK_NO),
        limits: { maxPrice: MAX_PRICE, userDaily: USER_DAILY_LIMIT, globalDaily: GLOBAL_DAILY_LIMIT },
        bizmoney,
      });
    }

    // 이하 로그인 필요
    if (!supabaseUrl || !serviceKey) {
      return res.status(503).json({ success: false, error: 'e쿠폰 서비스가 설정되지 않았습니다.' });
    }
    const user = await getUser(req);
    if (!user) {
      return res.status(401).json({ success: false, error: '로그인이 필요합니다.' });
    }

    if (req.method === 'GET' && action === 'my') {
      const listRes = await fetch(
        `${supabaseUrl}/rest/v1/coupon_orders?user_id=eq.${encodeURIComponent(user.id)}&status=eq.issued&select=*&order=created_at.desc&limit=200`,
        { headers: serviceHeaders() }
      );
      if (!listRes.ok) throw new Error(`coupon_orders select failed: ${listRes.status} ${await listRes.text()}`);
      const rows = await listRes.json();
      return res.status(200).json({
        success: true,
        coupons: rows.map(toClientOrder),
        balance: await getBalance(user.id),
      });
    }

    if (req.method === 'POST' && action === 'exchange') {
      if (!isExchangeConfigured()) {
        return res.status(503).json({ success: false, error: 'e쿠폰 교환이 일시 중지되었습니다. 잠시 후 다시 시도해 주세요.' });
      }
      const result = await exchange(user, req.body?.goodsCode);
      return res.status(result.status).json(result.body);
    }

    if (req.method === 'POST' && action === 'use') {
      const isUsed = req.body?.isUsed === true;
      const useRes = await fetch(
        `${supabaseUrl}/rest/v1/coupon_orders?tr_id=eq.${encodeURIComponent(String(req.body?.trId || ''))}&user_id=eq.${encodeURIComponent(user.id)}&status=eq.issued`,
        {
          method: 'PATCH',
          headers: { ...serviceHeaders(), Prefer: 'return=representation' },
          body: JSON.stringify({ is_used: isUsed, used_at: isUsed ? new Date().toISOString() : null }),
        }
      );
      const rows = useRes.ok ? await useRes.json() : [];
      if (!rows[0]) return res.status(404).json({ success: false, error: '쿠폰을 찾을 수 없습니다.' });
      return res.status(200).json({ success: true, coupon: toClientOrder(rows[0]) });
    }

    return res.status(400).json({ success: false, error: 'Unknown action.' });
  } catch (err) {
    console.error('[giftishow error]', action, err);
    return res.status(500).json({ success: false, error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' });
  }
}
