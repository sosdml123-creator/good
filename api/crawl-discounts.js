/**
 * Vercel Serverless Function: 편의점 이달의 행사상품 수집
 * Endpoint: /api/crawl-discounts
 *
 *  GET ?store=CU|세븐일레븐|이마트24&dealType=전체|1+1|2+1&onlyFood=true   한 매장 미리보기 (저장하지 않음)
 *  GET ?action=cron    전 매장 수집 → 종료된 행사 제거 → 서버 저장 (Vercel Cron 매일 / 관리자 수동 실행)
 *
 * 수집에 실패하면 실패로 응답하며, 대체용 가짜 상품을 돌려주지 않습니다.
 */

import { verifyAdminRequest } from './_lib/adminAuth.js';
import {
  SALE_STORES,
  resolveSaleStore,
  crawlStoreSales,
  mergeSalePromotions,
  currentSalePeriod,
  kstToday,
} from './_lib/saleCrawlers.js';

export const config = { maxDuration: 60 };

const SYSTEM_RECORD_ID = '__sinsangpick_system_banners__';

function createDb() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  return async function db(path, init = {}) {
    const res = await fetch(`${url}/rest/v1/${path}`, {
      ...init,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        ...(init.headers || {}),
      },
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`Supabase HTTP ${res.status}: ${text.slice(0, 200)}`);
    return text ? JSON.parse(text) : null;
  };
}

async function isRunAuthorized(req, lastRunAt) {
  const secret = process.env.CRON_SECRET;
  const auth = String(req.headers['authorization'] || '');
  if (secret && auth === `Bearer ${secret}`) return true;

  // CRON_SECRET 미설정 시: Vercel Cron 요청만 받고, 1시간 내 재실행은 건너뜁니다.
  if (!secret && String(req.headers['user-agent'] || '').includes('vercel-cron')) {
    return Date.now() - (lastRunAt ? new Date(lastRunAt).getTime() : 0) > 60 * 60 * 1000;
  }

  return (await verifyAdminRequest(req)).ok;
}

async function runScheduledCollect(req, res) {
  const db = createDb();
  if (!db) {
    return res.status(500).json({ success: false, error: 'SUPABASE_SERVICE_ROLE_KEY 가 서버 환경변수에 설정되어 있지 않습니다.' });
  }

  const readNutrition = async () => {
    const rows = await db(`products?id=eq.${SYSTEM_RECORD_ID}&select=nutrition`);
    return rows && rows[0] ? rows[0].nutrition || {} : null;
  };

  const before = await readNutrition();
  if (!before) return res.status(500).json({ success: false, error: '시스템 설정 레코드가 없습니다.' });
  if (!(await isRunAuthorized(req, before.saleCrawledAt))) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const reports = await Promise.all(Object.keys(SALE_STORES).map(async (store) => {
    try {
      const result = await crawlStoreSales(store);
      return { store, ok: true, items: result.items };
    } catch (err) {
      console.error(`[crawl-discounts] ${store} 수집 실패:`, err.message);
      return { store, ok: false, items: [], error: err.message };
    }
  }));

  // 수집하는 동안 관리자가 저장했을 수 있으므로 최신 값을 다시 읽어 병합합니다.
  const nutrition = (await readNutrition()) || before;
  const today = kstToday();
  const { monthKey } = currentSalePeriod(today);
  // 자동 수집 id 에는 월이 들어가므로, 지난 달 삭제 기록은 더 이상 필요 없습니다.
  const deletedSaleIds = (nutrition.deletedSaleIds || []).filter((id) => String(id).includes(`-${monthKey}-`));
  const previous = Array.isArray(nutrition.salePromotions) ? nutrition.salePromotions : [];
  const salePromotions = mergeSalePromotions(previous, reports, deletedSaleIds, today);
  const now = new Date().toISOString();

  await db(`products?id=eq.${SYSTEM_RECORD_ID}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      nutrition: { ...nutrition, salePromotions, deletedSaleIds, saleCrawledAt: now, updatedAt: now },
      updated_at: now,
    }),
  });

  const keptIds = new Set(salePromotions.map((item) => item.id));
  return res.status(200).json({
    success: true,
    total: salePromotions.length,
    removed: previous.filter((item) => item && !keptIds.has(item.id)).length,
    stores: reports.map((r) => ({ store: r.store, ok: r.ok, count: r.items.length, error: r.error })),
    salePromotions,
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = req.query || {};

  try {
    if (query.action === 'cron') return await runScheduledCollect(req, res);

    const store = resolveSaleStore(query.store || 'CU');
    if (!store) {
      return res.status(400).json({
        success: false,
        error: `'${query.store}' 은(는) 공식 웹에 행사상품 목록이 없어 자동 수집할 수 없습니다. (지원: ${Object.keys(SALE_STORES).join(', ')})`,
      });
    }

    const onlyFood = query.onlyFood !== 'false';
    const result = await crawlStoreSales(store, { onlyFood, dealType: query.dealType || '전체' });

    return res.status(200).json({
      success: true,
      store,
      sourceUrl: result.sourceUrl,
      page: 1,
      onlyFood,
      totalParsed: result.totalParsed,
      foodCount: result.totalParsed - result.excludedCount,
      excludedCount: result.excludedCount,
      count: result.items.length,
      items: result.items,
    });
  } catch (err) {
    console.error('[crawl-discounts] error:', err);
    return res.status(502).json({ success: false, error: err.message || '행사상품 수집에 실패했습니다.' });
  }
}
