/**
 * Vercel Serverless Function: 신제품 수집·승인 대기함
 * Endpoint: /api/pending-products
 *
 *  GET  ?status=pending|rejected          대기함 목록 (관리자)
 *  GET  ?action=cron                       매일 자동 수집 (Vercel Cron)
 *  POST { action: 'collect', source, query }   수집 실행: source = 'all' | 'stores' | 'cu' | 'seven' | 'news' | 'mfds'
 *  POST { action: 'add', items }               대기함에 직접 추가
 *  POST { action: 'update', id, patch }        대기 상품 정보 수정
 *  POST { action: 'set_status', ids, status }  반려('rejected') / 대기함 복원('pending')
 *  POST { action: 'approve', items: [{ pendingId, productId }] }  승인 → products 등록
 *
 * pending_products 테이블은 service role 키로만 접근합니다 (클라이언트 직접 접근 없음).
 */

import { verifyAdminRequest } from './_lib/adminAuth.js';
import {
  crawlCuNew,
  crawlSevenNew,
  normalizeProductName,
} from './_lib/storeCrawlers.js';
import { collectMfdsProducts } from './_lib/mfdsProducts.js';
import { attachProductImages } from './_lib/productImages.js';
import { getAiEngine } from './_lib/aiJson.js';
import { crawlStarbucksNew, crawlMegaNew, crawlPaikNew } from './_lib/cafeCrawlers.js';
import { collectSearchProducts, searchConfigured } from './_lib/intakeSearch.js';

export const config = { maxDuration: 300 };

const SYSTEM_RECORD_ID = '__sinsangpick_system_banners__';
const TABLE_MISSING_MESSAGE = 'pending_products 테이블이 아직 없습니다. Supabase SQL Editor에서 supabase/migrations/20261010_create_pending_products.sql 을 한 번 실행해주세요.';

const SOURCES = {
  starbucks: { label: '스타벅스 공식 신메뉴', run: () => crawlStarbucksNew() },
  mega: { label: '메가MGC커피 공식 신메뉴', run: () => crawlMegaNew() },
  paik: { label: '빽다방 공식 신메뉴', run: () => crawlPaikNew() },
  blog: { label: '블로그 신제품·신메뉴', run: (query, deadline) => collectSearchProducts('blog', query, deadline) },
  mfds: {
    label: '식약처 품목제조보고 (주요 식품사)',
    run: () => collectMfdsProducts({ apiKey: process.env.FOODSAFETY_API_KEY }),
  },
  cu: { label: 'CU 공식 신상품', run: () => crawlCuNew() },
  seven: { label: '세븐일레븐 공식 신상품', run: () => crawlSevenNew(60) },
  news: {
    label: '뉴스 (편의점·마트·슈퍼·식품사 전체)',
    // 키워드가 있으면 그 키워드만, 없으면 유통사 전체 기본 검색어를 돕니다.
    run: (query, deadline) => collectSearchProducts('news', query, deadline),
  },
};
const STORE_SOURCES = ['cu', 'seven', 'starbucks', 'mega', 'paik'];
const ALL_SOURCES = [...STORE_SOURCES, 'news', 'blog', 'mfds'];

const EDITABLE_COLUMNS = {
  name: 'name', brand: 'brand', category: 'category', subCategory: 'sub_category', itemType: 'item_type',
  image: 'image', releaseDate: 'release_date', price: 'price', discountRate: 'discount_rate', stores: 'stores',
  description: 'description', calories: 'calories', volume: 'volume', nutrition: 'nutrition',
  ingredients: 'ingredients', allergens: 'allergens',
};

function createDb() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  return async function db(path, init = {}) {
    const res = await fetch(`${url}/rest/v1/${path}`, {
      ...init,
      signal: AbortSignal.timeout(12000),
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        ...(init.headers || {}),
      },
    });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!res.ok) {
      const err = new Error((data && data.message) || `Supabase HTTP ${res.status}`);
      err.code = data && (data.code === 'PGRST205' || data.code === '42P01') ? 'TABLE_MISSING' : (data && data.code) || 'DB_ERROR';
      throw err;
    }
    return data;
  };
}

function inList(ids) {
  return `in.(${ids.map((id) => `"${String(id).replace(/"/g, '')}"`).join(',')})`;
}

/**
 * 이미 등록된 상품 + 대기/승인/반려 이력 전체를 기준으로 새 항목만 골라 저장.
 * 확인된 제품 사진이 없는 항목은 저장하지 않습니다 (다음 수집 때 다시 시도).
 */
export async function insertNewRows(db, rows, imageOptions) {
  if (rows.length === 0) return { inserted: 0, duplicates: 0, noImage: 0, aiErrors: 0 };

  const [products, pending] = await Promise.all([
    readAll(db, `products?select=name,brand&id=neq.${SYSTEM_RECORD_ID}&order=id.asc`),
    readAll(db, 'pending_products?select=id,name,brand&order=id.asc'),
  ]);

  const knownIds = new Set(pending.map((p) => p.id));
  const identity = p => `${normalizeProductName(p.brand)}|${normalizeProductName(p.name)}`;
  const knownNames = new Set([...products, ...pending].map(identity));

  const now = new Date().toISOString();
  const fresh = [];
  for (const row of rows) {
    const key = identity(row);
    if (!key || knownIds.has(row.id) || knownNames.has(key)) continue;
    knownIds.add(row.id);
    knownNames.add(key);
    // 구형 DB의 source_url UNIQUE 인덱스와 호환: 하나의 기사에 여러 상품이 있어도 저장합니다.
    // URL fragment는 서버에 전송되지 않으므로 원문 링크는 그대로 열립니다.
    const sourceUrl = row.source_url ? `${row.source_url.split('#')[0]}#product=${encodeURIComponent(row.id)}` : null;
    fresh.push({ ...row, source_url: sourceUrl, status: 'pending', crawled_at: now });
  }

  const { aiErrors } = await attachProductImages(fresh, imageOptions);
  const ready = fresh.filter((row) => row.image);

  let saved = [];
  if (ready.length > 0) {
    saved = await db('pending_products?on_conflict=id', {
      method: 'POST',
      headers: { Prefer: 'resolution=ignore-duplicates,return=representation' },
      body: JSON.stringify(ready),
    });
  }
  return {
    inserted: saved.length,
    duplicates: rows.length - fresh.length + ready.length - saved.length,
    noImage: fresh.length - ready.length,
    aiErrors,
  };
}

async function readAll(db, path) {
  const rows = [];
  for (let offset = 0; ; offset += 1000) {
    const page = await db(`${path}&limit=1000&offset=${offset}`);
    rows.push(...page);
    if (page.length < 1000) return rows;
  }
}

async function runCollect(db, sourceKeys, query, deadline) {
  const imageOptions = {
    deadline,
    naver: { clientId: process.env.NAVER_CLIENT_ID, clientSecret: process.env.NAVER_CLIENT_SECRET },
    engine: getAiEngine(),
  };

  // 테이블이 없으면 외부 사이트를 긁기 전에 바로 알려줍니다.
  await db('pending_products?select=id&limit=1');

  const reports = [];
  // 느린 검색 소스를 기다리는 동안 준비된 공식 상품부터 검수·저장합니다.
  const settled = sourceKeys.map(key => Promise.resolve().then(() => SOURCES[key].run(query, Math.min(deadline - 60000, Date.now() + 100000)))
    .then(value => ({ status: 'fulfilled', value }), reason => ({ status: 'rejected', reason })));
  for (let i = 0; i < sourceKeys.length; i++) {
    const key = sourceKeys[i];
    const result = await settled[i];
    if (result.status === 'rejected') {
      reports.push({
        source: key,
        label: SOURCES[key].label,
        ok: false,
        found: 0,
        inserted: 0,
        duplicates: 0,
        noImage: 0,
        error: result.reason?.name === 'AbortError' ? '응답 시간 초과' : (result.reason?.message || '수집 실패'),
        code: result.reason?.code,
      });
      continue;
    }
    // 소스 간 이름 중복이 있을 수 있으므로 순서대로 저장합니다.
    try {
    const { inserted, duplicates, noImage, aiErrors } = await insertNewRows(db, result.value, {
      ...imageOptions, deadline: Math.min(deadline, Date.now() + (STORE_SOURCES.includes(key) ? 15000 : 45000)),
    });
    reports.push({
      source: key,
      label: SOURCES[key].label,
      ok: true,
      found: result.value.length,
      inserted,
      duplicates,
      noImage,
      warning: [result.value.warning, !imageOptions.engine && !STORE_SOURCES.includes(key)
        ? 'AI 키가 없어 사진을 검수할 수 없습니다. 뉴스·블로그 사진은 검수 후에만 저장합니다.'
        : aiErrors > 0 ? `사진 검수 실패 ${aiErrors}회` : '', Date.now() >= deadline ? '시간 제한으로 남은 상품은 다음 수집 때 재시도합니다.' : ''].filter(Boolean).join(' · '),
    });
    } catch (err) {
      reports.push({ source: key, label: SOURCES[key].label, ok: false, found: result.value.length,
        inserted: 0, duplicates: 0, error: `저장 실패: ${err.message}`, code: err.code });
    }
  }
  return reports;
}

function toPendingRow(item) {
  const id = String(item.id || `manual-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  return {
    id,
    name: String(item.name || '').trim(),
    brand: String(item.brand || '').trim() || '기타',
    category: item.category || '기타',
    sub_category: item.subCategory || null,
    item_type: item.itemType || 'packaged',
    image: item.image || '',
    release_date: item.releaseDate || null,
    price: Number(item.price) || 0,
    discount_rate: Number(item.discountRate) || 0,
    stores: Array.isArray(item.stores) ? item.stores : [],
    description: item.description || '',
    source_name: item.sourceName || '관리자 직접 추가',
    source_url: item.sourceUrl || null,
    calories: item.calories || null,
    volume: item.volume || null,
    nutrition: item.nutrition || null,
    ingredients: item.ingredients || null,
    allergens: item.allergens || null,
    best_quotes: null,
    status: 'pending',
    crawled_at: new Date().toISOString(),
  };
}

function toProductRow(pending, productId) {
  return {
    id: productId,
    name: pending.name,
    brand: pending.brand,
    category: pending.category,
    sub_category: pending.sub_category,
    item_type: pending.item_type || 'packaged',
    image: pending.image,
    release_date: pending.release_date,
    price: pending.price || 0,
    discount_rate: pending.discount_rate || 0,
    // 평점은 실제 사용자 리뷰로만 계산됩니다.
    overall_rating: 0,
    rating_count: 0,
    description: pending.description || '',
    stores: pending.stores || [],
    calories: pending.calories,
    volume: pending.volume,
    nutrition: pending.nutrition,
    is_today: true,
    is_hot: false,
    updated_at: new Date().toISOString(),
  };
}

async function isCronAuthorized(req, db) {
  const secret = process.env.CRON_SECRET;
  const auth = String(req.headers['authorization'] || '');
  if (secret) return auth === `Bearer ${secret}`;

  // CRON_SECRET 미설정 시: Vercel Cron 요청만 받고, 1시간 내 재실행은 건너뜁니다.
  if (!String(req.headers['user-agent'] || '').includes('vercel-cron')) return false;
  const recent = await db('pending_products?select=crawled_at&or=(id.like.cu-*,id.like.seven-*)&order=crawled_at.desc&limit=1');
  const last = recent[0] ? new Date(recent[0].crawled_at).getTime() : 0;
  return Date.now() - last > 60 * 60 * 1000;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-key');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // 공식 소스와 뉴스·블로그의 사진 검수 시간을 확보하고, 저장·응답용 여유를 남깁니다.
  const deadline = Date.now() + 260000;

  const db = createDb();
  if (!db) {
    return res.status(500).json({ success: false, error: 'SUPABASE_SERVICE_ROLE_KEY 가 서버 환경변수에 설정되어 있지 않습니다.' });
  }

  const naverConfigured = searchConfigured();

  try {
    // 매일 자동 수집 (Vercel Cron)
    if (req.method === 'GET' && req.query?.action === 'cron') {
      if (!(await isCronAuthorized(req, db))) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }
      const sources = [...STORE_SOURCES];
      if (naverConfigured) sources.push('news', 'blog');
      if (process.env.FOODSAFETY_API_KEY) sources.push('mfds');
      const reports = await runCollect(db, sources, '', deadline);
      return res.status(200).json({ success: true, reports });
    }

    const auth = await verifyAdminRequest(req);
    if (!auth.ok) return res.status(auth.status).json({ success: false, error: auth.error });

    if (req.method === 'GET') {
      const status = req.query?.status === 'rejected' ? 'rejected' : 'pending';
      const items = await readAll(db, `pending_products?select=*&status=eq.${status}&order=crawled_at.desc,id.asc`);
      return res.status(200).json({ success: true, items, naverConfigured });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { action } = body;

    if (action === 'collect') {
      const source = String(body.source || 'all');
      const sources = source === 'all' ? ALL_SOURCES.filter(key => key !== 'mfds' || process.env.FOODSAFETY_API_KEY) : source === 'stores' ? STORE_SOURCES : [source];
      if (!sources.every((key) => SOURCES[key])) {
        return res.status(400).json({ success: false, error: `알 수 없는 수집 소스: ${source}` });
      }
      const reports = await runCollect(db, sources, String(body.query || '').trim().slice(0, 60), deadline);
      return res.status(200).json({ success: true, reports, naverConfigured });
    }

    if (action === 'add') {
      const rows = (Array.isArray(body.items) ? body.items : []).map(toPendingRow).filter((row) => row.name);
      if (rows.length === 0) return res.status(400).json({ success: false, error: '추가할 상품이 없습니다.' });
      await db('pending_products?on_conflict=id', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify(rows),
      });
      return res.status(200).json({ success: true, count: rows.length });
    }

    if (action === 'update') {
      const patch = {};
      for (const [field, column] of Object.entries(EDITABLE_COLUMNS)) {
        if (body.patch && body.patch[field] !== undefined) patch[column] = body.patch[field];
      }
      if (!body.id || Object.keys(patch).length === 0) {
        return res.status(400).json({ success: false, error: '수정할 내용이 없습니다.' });
      }
      await db(`pending_products?id=eq.${encodeURIComponent(body.id)}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify(patch),
      });
      return res.status(200).json({ success: true });
    }

    if (action === 'set_status') {
      const ids = Array.isArray(body.ids) ? body.ids : [];
      if (ids.length === 0 || !['pending', 'rejected'].includes(body.status)) {
        return res.status(400).json({ success: false, error: '잘못된 요청입니다.' });
      }
      await db(`pending_products?id=${inList(ids)}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ status: body.status }),
      });
      return res.status(200).json({ success: true, count: ids.length });
    }

    if (action === 'approve') {
      const pairs = [...new Map((Array.isArray(body.items) ? body.items : []).filter(p => p && typeof p.pendingId === 'string')
        .map(p => [p.pendingId, { pendingId: p.pendingId, productId: `prod-intake-${p.pendingId}` }])).values()];
      if (pairs.length === 0) return res.status(400).json({ success: false, error: '승인할 상품이 없습니다.' });

      const pendingRows = await db(`pending_products?select=*&status=eq.pending&id=${inList(pairs.map((p) => p.pendingId))}`);
      const byId = new Map(pendingRows.map((row) => [row.id, row]));
      const approvable = pairs.filter((p) => byId.has(p.pendingId) && byId.get(p.pendingId).image);
      if (approvable.length === 0) {
        return res.status(400).json({ success: false, error: '승인할 수 있는 상품이 없습니다. (이미 처리되었거나 이미지가 없습니다)' });
      }

      await db('products?on_conflict=id', {
        method: 'POST',
        headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
        body: JSON.stringify(approvable.map((p) => toProductRow(byId.get(p.pendingId), p.productId))),
      });
      await db(`pending_products?id=${inList(approvable.map((p) => p.pendingId))}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ status: 'approved' }),
      });

      return res.status(200).json({ success: true, approved: approvable });
    }

    return res.status(400).json({ success: false, error: `알 수 없는 action: ${action}` });
  } catch (err) {
    if (err.code === 'TABLE_MISSING') {
      return res.status(503).json({ success: false, code: 'TABLE_MISSING', error: TABLE_MISSING_MESSAGE });
    }
    console.error('[pending-products] error', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
  }
}
