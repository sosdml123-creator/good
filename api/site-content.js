/**
 * Vercel Serverless Function for Synchronizing Banners, Products, and Home Sections
 * Endpoint: /api/site-content
 *
 * GET  : 공개 콘텐츠(배너·홈 구좌·행사·브랜드·판매처·캘린더·상품) 조회
 * POST : 관리자 전용 쓰기. 모든 쓰기는 service role 로 실행하고, 실패하면 실패로 응답합니다.
 */

import { verifyAdminRequest } from './_lib/adminAuth.js';

const SYSTEM_RECORD_ID = '__sinsangpick_system_banners__';

// 시스템 레코드(products.nutrition JSON)에 통째로 저장하는 관리자 설정 키
const CONTENT_KEYS = [
  'banners', 'homeSections', 'salePromotions', 'events',
  'brands', 'storeChannels', 'calendarItems', 'battleConfig', 'adminLocalSyncedAt', 'pointPolicy',
];

// 포인트 정책 허용 범위 (supabase/migrations/20261012_point_policy_settings.sql 의 상한과 맞춥니다)
const POINT_POLICY_MAX = {
  signup: 10000, review: 1000, reviewDailyLimit: 100, dailyCap: 10000,
  adReward: 1000, adDailyLimit: 100, couponUserDailyLimit: 1000000,
};

function sanitizePointPolicy(input) {
  const policy = {};
  for (const [key, max] of Object.entries(POINT_POLICY_MAX)) {
    const value = Number(input?.[key]);
    if (Number.isFinite(value)) policy[key] = Math.min(max, Math.max(0, Math.trunc(value)));
  }
  return policy;
}
const DELETED_KEYS = ['deletedProductIds', 'deletedBannerIds', 'deletedEventIds', 'deletedSaleIds'];

// products 테이블 기본 컬럼 (camelCase → snake_case)
const PRODUCT_COLUMNS = {
  name: 'name', brand: 'brand', category: 'category', subCategory: 'sub_category',
  itemType: 'item_type', image: 'image', releaseDate: 'release_date', price: 'price',
  discountRate: 'discount_rate', description: 'description', stores: 'stores',
  storeStocks: 'store_stocks', calories: 'calories', volume: 'volume',
  isToday: 'is_today', isHot: 'is_hot', nutrition: 'nutrition',
  freshMetrics: 'fresh_metrics', brandRankings: 'brand_rankings', restaurantInfo: 'restaurant_info',
};
// 20261011_admin_moderation.sql 마이그레이션으로 추가되는 상세 정보 컬럼
const PRODUCT_EXTRA_COLUMNS = {
  code: 'code', ingredients: 'ingredients', allergens: 'allergens', origin: 'origin',
  manufacturer: 'manufacturer', storageMethod: 'storage_method', shelfLife: 'shelf_life',
  precautions: 'precautions', spiciness: 'spiciness', buyLink: 'buy_link',
  sourceName: 'source_name', sourceUrl: 'source_url', produceDetails: 'produce_details',
};

const REVIEW_COLUMNS = {
  content: 'content', rating: 'rating', detailedRating: 'detailed_rating', images: 'images', tags: 'tags',
};
const POST_COLUMNS = { title: 'title', content: 'content', category: 'category', images: 'images' };

class DbError extends Error {
  constructor(status, body) {
    let parsed = null;
    try { parsed = JSON.parse(body); } catch { /* plain text */ }
    super(parsed?.message || body || `Database error (${status})`);
    this.status = status;
    this.code = parsed?.code || '';
  }
  get tableMissing() { return this.code === 'PGRST205' || this.code === '42P01'; }
  get columnMissing() { return this.code === 'PGRST204' || this.code === '42703'; }
}

const inList = (ids) => `in.(${ids.map((t) => `"${encodeURIComponent(String(t).replace(/"/g, ''))}"`).join(',')})`;
const toIds = (ids, id) => (Array.isArray(ids) ? ids : id ? [id] : []).filter(Boolean).map(String);

function pickColumns(source, columnMap) {
  const row = {};
  for (const [key, column] of Object.entries(columnMap)) {
    const value = source[key] !== undefined ? source[key] : source[column];
    if (value !== undefined) row[column] = value;
  }
  return row;
}

export default async function handler(req, res) {
  // Enable CORS for web and Capacitor native apps (capacitor://localhost, ionic://localhost, etc.)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey, x-admin-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseKey = serviceKey || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ success: false, error: 'Database credentials not configured in environment.' });
  }

  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
  };

  const db = async (path, init = {}) => {
    const r = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
      ...init,
      headers: { ...headers, ...(init.headers || {}) },
    });
    const text = await r.text();
    if (!r.ok) throw new DbError(r.status, text);
    return text ? JSON.parse(text) : null;
  };

  // 없는 테이블(마이그레이션 미적용)은 null 로 돌려 호출부가 구분할 수 있게 합니다.
  const dbOptional = async (path, init) => {
    try {
      return (await db(path, init)) ?? [];
    } catch (err) {
      if (err instanceof DbError && err.tableMissing) return null;
      throw err;
    }
  };

  const readSystemNutrition = async () => {
    const rows = await db(`products?id=eq.${SYSTEM_RECORD_ID}&select=nutrition,updated_at`);
    return { nutrition: rows?.[0]?.nutrition || {}, updatedAt: rows?.[0]?.updated_at || null };
  };

  const writeSystemNutrition = async (nutrition) => {
    const now = new Date().toISOString();
    await db('products?on_conflict=id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({
        id: SYSTEM_RECORD_ID,
        name: 'SYSTEM_SETTINGS_CONTAINER',
        brand: '신상픽_시스템',
        category: '시스템',
        price: 0,
        image: '',
        description: '신상픽 배너 및 홈 섹션 글로벌 동기화 컨테이너',
        is_today: false,
        is_hot: false,
        nutrition: { ...nutrition, updatedAt: now },
        updated_at: now,
      }),
    });
  };

  // GET: Fetch latest remote banners, homeSections, and custom products
  if (req.method === 'GET') {
    try {
      const { nutrition, updatedAt } = await readSystemNutrition();
      const body = { success: true };
      for (const key of [...CONTENT_KEYS, ...DELETED_KEYS]) body[key] = nutrition[key] ?? null;

      const products = await db(`products?id=neq.${SYSTEM_RECORD_ID}&select=*&order=created_at.desc`);

      return res.status(200).json({
        ...body,
        products: products || [],
        lastUpdated: updatedAt,
        serverTime: new Date().toISOString(),
      });
    } catch (err) {
      console.error('[site-content GET error]', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use GET or POST.' });
  }

  // POST: 관리자 전용
  const auth = await verifyAdminRequest(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ success: false, error: auth.error });
  }
  if (!serviceKey) {
    return res.status(500).json({
      success: false,
      error: '서버에 SUPABASE_SERVICE_ROLE_KEY 가 설정되지 않아 저장할 수 없습니다. (Vercel 환경변수 확인)',
    });
  }

  const body = req.body || {};
  const { action } = body;
  const ids = toIds(body.ids, body.id);
  const now = new Date().toISOString();
  const result = { success: true, timestamp: now };

  const upsertProducts = async (products) => {
    const post = (payload) => db('products?on_conflict=id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify(payload),
    });

    // PostgREST 일괄 upsert 는 모든 행의 키가 같아야 하므로 한 건씩 저장합니다.
    for (const product of products) {
      if (!product || !product.id || !product.name || product.id === SYSTEM_RECORD_ID) continue;
      const row = { id: String(product.id), ...pickColumns(product, PRODUCT_COLUMNS), updated_at: now };
      // INT 컬럼: 소수·문자열이 섞여 들어오면 행 전체가 거부되므로 정수로 맞춥니다.
      for (const column of ['price', 'discount_rate', 'calories']) {
        if (row[column] === undefined) continue;
        const n = Number(row[column]);
        row[column] = Number.isFinite(n) ? Math.round(n) : (column === 'calories' ? null : 0);
      }
      if (row.image === null) row.image = '';
      const extras = pickColumns(product, PRODUCT_EXTRA_COLUMNS);
      try {
        await post({ ...row, ...extras });
      } catch (err) {
        // 상세 컬럼 마이그레이션 전이면 기본 컬럼만 저장
        if (!(err instanceof DbError && err.columnMissing) || Object.keys(extras).length === 0) throw err;
        await post(row);
        result.partial = true;
      }
    }
  };

  const mergeSystemRecord = async (changes, deletedAdds = {}) => {
    const { nutrition } = await readSystemNutrition();
    const next = { ...nutrition, ...changes };
    for (const key of DELETED_KEYS) {
      next[key] = Array.from(new Set([...(nutrition[key] || []), ...(deletedAdds[key] || [])]));
    }
    if (Array.isArray(next.events) && next.deletedEventIds.length > 0) {
      const gone = new Set(next.deletedEventIds);
      next.events = next.events.filter((e) => e && !gone.has(e.id));
    }
    await writeSystemNutrition(next);
  };

  try {
    switch (action) {
      case 'upsert_products': {
        await upsertProducts(Array.isArray(body.products) ? body.products : []);
        break;
      }

      case 'delete_product':
      case 'delete_products': {
        if (ids.length > 0) {
          await db(`products?id=${inList(ids)}`, { method: 'DELETE' });
          await mergeSystemRecord({}, { deletedProductIds: ids });
        }
        break;
      }

      case 'delete_review': {
        if (ids.length > 0) await db(`reviews?id=${inList(ids)}`, { method: 'DELETE' });
        break;
      }

      case 'delete_post': {
        if (ids.length > 0) await db(`community_posts?id=${inList(ids)}`, { method: 'DELETE' });
        break;
      }

      case 'update_review':
      case 'update_post': {
        const isReview = action === 'update_review';
        const updates = pickColumns(body.updates || {}, isReview ? REVIEW_COLUMNS : POST_COLUMNS);
        if (ids.length === 0 || Object.keys(updates).length === 0) break;
        await db(`${isReview ? 'reviews' : 'community_posts'}?id=${inList(ids)}`, {
          method: 'PATCH',
          headers: { Prefer: 'return=minimal' },
          body: JSON.stringify(updates),
        });
        break;
      }

      case 'delete_event': {
        await mergeSystemRecord({}, { deletedEventIds: ids });
        break;
      }

      case 'delete_notification': {
        if (ids.length > 0) await db(`notifications?id=${inList(ids)}`, { method: 'DELETE' });
        break;
      }

      // 포인트 지급(+)/회수(-). 잔액은 서버의 현재 값 기준으로 계산합니다.
      case 'adjust_points': {
        const delta = Math.trunc(Number(body.delta) || 0);
        if (ids.length === 0 || delta === 0) break;
        const profiles = await db(`profiles?id=${inList(ids)}&select=id,points`);
        result.balances = [];
        for (const profile of profiles) {
          const before = Number(profile.points) || 0;
          const after = Math.max(0, before + delta);
          await db(`profiles?id=eq.${encodeURIComponent(profile.id)}`, {
            method: 'PATCH',
            headers: { Prefer: 'return=minimal' },
            body: JSON.stringify({ points: after, updated_at: now }),
          });
          result.balances.push({ userId: profile.id, before, after });
        }
        if (result.balances.length > 0) {
          const logged = await dbOptional('point_transactions', {
            method: 'POST',
            headers: { Prefer: 'return=minimal' },
            body: JSON.stringify(result.balances.map((b, idx) => ({
              id: `tx_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 8)}`,
              user_id: b.userId,
              type: delta > 0 ? 'grant' : 'revoke',
              amount: b.after - b.before,
              balance_after: b.after,
              reason: String(body.reason || ''),
              admin_memo: body.memo ? String(body.memo) : null,
              created_at: now,
            }))),
          });
          if (logged === null) result.partial = true;
        }
        break;
      }

      // 회원 강제 삭제: 작성 콘텐츠·프로필·로그인 계정까지 삭제
      case 'delete_users': {
        if (ids.length === 0) break;
        if (auth.userId && ids.includes(auth.userId)) {
          return res.status(400).json({ success: false, error: '현재 로그인한 관리자 계정은 삭제할 수 없습니다.' });
        }
        const admins = await db(`profiles?id=${inList(ids)}&is_admin=is.true&select=id`);
        if (admins.length > 0) {
          return res.status(400).json({ success: false, error: '관리자 계정은 삭제할 수 없습니다.' });
        }
        const owned = [
          ['device_tokens', 'user_id'], ['review_likes', 'user_id'], ['post_likes', 'user_id'],
          ['review_comments', 'user_id'], ['post_comments', 'user_id'], ['point_transactions', 'user_id'],
          ['user_sanctions', 'user_id'], ['reviews', 'user_id'], ['community_posts', 'author_id'],
        ];
        for (const [table, column] of owned) {
          await dbOptional(`${table}?${column}=${inList(ids)}`, { method: 'DELETE' });
        }
        await db(`profiles?id=${inList(ids)}`, { method: 'DELETE' });
        for (const userId of ids) {
          const r = await fetch(`${supabaseUrl}/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
            method: 'DELETE',
            headers,
          });
          if (!r.ok && r.status !== 404) throw new DbError(r.status, await r.text());
        }
        break;
      }

      // 회원 제재 상태 (정상 / 경고 / 정지 / 영구정지)
      case 'set_user_status': {
        if (ids.length === 0) break;
        const existing = await db(`user_sanctions?user_id=${inList(ids)}&select=user_id,warning_count`);
        const warnings = new Map(existing.map((row) => [row.user_id, Number(row.warning_count) || 0]));
        const status = String(body.status || 'active');
        const rows = ids.map((userId) => ({
          user_id: userId,
          status,
          warning_count: status === 'active' && body.warningDelta === undefined
            ? 0
            : Math.max(0, (warnings.get(userId) || 0) + (Number(body.warningDelta) || 0)),
          suspended_until: status === 'active' ? null : (body.suspendedUntil || null),
          reason: status === 'active' ? null : (body.reason || null),
          updated_at: now,
        }));
        await db('user_sanctions?on_conflict=user_id', {
          method: 'POST',
          headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
          body: JSON.stringify(rows),
        });
        result.sanctions = rows;
        break;
      }

      // 신고 / 제품 수정 요청 처리
      case 'update_report':
      case 'update_edit_request': {
        const table = action === 'update_report' ? 'reports' : 'product_edit_requests';
        if (ids.length === 0) break;
        const rows = await db(`${table}?id=${inList(ids)}&select=id,data`);
        for (const row of rows) {
          const data = { ...(row.data || {}), ...(body.updates || {}) };
          await db(`${table}?id=eq.${encodeURIComponent(row.id)}`, {
            method: 'PATCH',
            headers: { Prefer: 'return=minimal' },
            body: JSON.stringify({ data, status: data.status || 'pending', updated_at: now }),
          });
        }
        break;
      }

      case 'delete_report':
      case 'delete_edit_request': {
        const table = action === 'delete_report' ? 'reports' : 'product_edit_requests';
        if (ids.length > 0) await db(`${table}?id=${inList(ids)}`, { method: 'DELETE' });
        break;
      }

      // 관리자 화면용 조회 (없는 테이블은 null → 화면에서 설정 안내)
      case 'list_moderation': {
        const [reports, editRequests, sanctions, pointTransactions] = await Promise.all([
          dbOptional('reports?select=*&order=created_at.desc&limit=500'),
          dbOptional('product_edit_requests?select=*&order=created_at.desc&limit=500'),
          dbOptional('user_sanctions?select=*'),
          dbOptional('point_transactions?select=*&order=created_at.desc&limit=500'),
        ]);
        Object.assign(result, { reports, editRequests, sanctions, pointTransactions });
        break;
      }

      // 기본: 배너·홈 구좌·행사·브랜드·판매처·캘린더 등 설정 저장
      default: {
        if (action && action !== 'save_content') {
          return res.status(400).json({ success: false, error: `Unknown action: ${action}` });
        }
        const changes = {};
        for (const key of CONTENT_KEYS) {
          if (body[key] !== undefined) changes[key] = key === 'pointPolicy' ? sanitizePointPolicy(body[key]) : body[key];
        }
        const deletedAdds = {};
        for (const key of DELETED_KEYS) {
          if (Array.isArray(body[key])) deletedAdds[key] = body[key];
        }
        if (Object.keys(changes).length > 0 || Object.keys(deletedAdds).length > 0) {
          await mergeSystemRecord(changes, deletedAdds);
        }
        if (Array.isArray(body.products) && body.products.length > 0) {
          await upsertProducts(body.products);
        }
      }
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error('[site-content POST error]', action || 'save_content', err);
    if (err instanceof DbError && err.tableMissing) {
      return res.status(503).json({
        success: false,
        code: 'TABLE_MISSING',
        error: 'DB 테이블이 아직 없습니다. supabase/migrations/20261011_admin_moderation.sql 을 Supabase SQL Editor 에서 실행해주세요.',
      });
    }
    return res.status(500).json({ success: false, error: err.message || '저장에 실패했습니다.' });
  }
}
