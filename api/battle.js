/**
 * Vercel Serverless Function for 신상 배틀 (주간 투표)
 * Endpoint: /api/battle
 *
 * 한 주(월~일, KST)가 한 라운드입니다.
 *  - 월~금: 투표 (득표수는 공개하지 않음)
 *  - 토·일: 투표 마감, 결과 공개
 *  - 월요일: 최근 대결에 나오지 않은 신상품으로 새 대결 자동 편성
 *
 * GET  : 현재 라운드 조회 (로그인 토큰이 있으면 내 투표 포함)
 * POST : { choice: 'A' | 'B' } 투표 (로그인 필요)
 *        { action: 'set_pair', productAId, productBId } 이번 주 대결 상품 직접 지정 (관리자)
 */

import { verifyAdminRequest } from './_lib/adminAuth.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const RECENT_ROUNDS_TO_AVOID = 8;
const CANDIDATE_POOL_SIZE = 40;
const FRESH_CATEGORIES = new Set(['과일', '식재료', '고기·수산']);
const PRODUCT_FIELDS = 'id,name,brand,category,image';

class TableMissingError extends Error {}

export function getRoundInfo(now = Date.now()) {
  const kst = new Date(now + KST_OFFSET_MS);
  const daysFromMonday = (kst.getUTCDay() + 6) % 7; // 월=0 … 일=6
  const mondayAsUtc = Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate() - daysFromMonday);
  const startMs = mondayAsUtc - KST_OFFSET_MS;
  const dateKey = (ms) => new Date(ms).toISOString().slice(0, 10);
  return {
    weekKey: dateKey(mondayAsUtc),
    previousWeekKey: dateKey(mondayAsUtc - 7 * DAY_MS),
    phase: daysFromMonday >= 5 ? 'result' : 'voting',
    resultAt: new Date(startMs + 5 * DAY_MS).toISOString(),
    nextRoundAt: new Date(startMs + 7 * DAY_MS).toISOString(),
  };
}

function launchTime(product) {
  const full = String(product.release_date || '').match(/(20\d{2})\s*[.\-/년]\s*(\d{1,2})\s*[.\-/월]\s*(\d{1,2})/);
  if (full) return Date.UTC(Number(full[1]), Number(full[2]) - 1, Number(full[3]));
  const created = Date.parse(product.created_at || '');
  return Number.isNaN(created) ? 0 : created;
}

// 최근 출시 순으로, 같은 카테고리의 다른 브랜드끼리 먼저 맞붙입니다.
export function pickPair(products, recentlyUsedIds) {
  const eligible = products
    .filter((p) => p && p.id && p.name && !String(p.id).startsWith('__') && p.category !== '시스템')
    .filter((p) => !FRESH_CATEGORIES.has(p.category) && p.item_type !== 'fresh')
    .sort((a, b) => launchTime(b) - launchTime(a));

  const unused = eligible.filter((p) => !recentlyUsedIds.has(p.id));
  const pool = (unused.length >= 2 ? unused : eligible).slice(0, CANDIDATE_POOL_SIZE);
  if (pool.length < 2) return null;

  const rivalOf = (a) =>
    pool.find((b) => b.id !== a.id && b.category === a.category && b.sub_category === a.sub_category && b.brand !== a.brand)
    || pool.find((b) => b.id !== a.id && b.category === a.category && b.brand !== a.brand)
    || pool.find((b) => b.id !== a.id && b.category === a.category);

  for (const a of pool) {
    const b = rivalOf(a);
    if (b) return [a.id, b.id];
  }
  return [pool[0].id, pool[1].id];
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey, x-admin-key');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use GET or POST.' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ success: false, error: 'Database credentials not configured in environment.' });
  }

  const request = async (path, init = {}) => {
    const r = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
      ...init,
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        ...(init.headers || {}),
      },
    });
    if (!r.ok) {
      const text = await r.text();
      let code = '';
      try { code = JSON.parse(text)?.code || ''; } catch { /* plain text */ }
      if (code === 'PGRST205' || code === '42P01') throw new TableMissingError(text);
      throw new Error(text || `Database error (${r.status})`);
    }
    return r;
  };

  const db = async (path, init) => {
    const text = await (await request(path, init)).text();
    return text ? JSON.parse(text) : null;
  };

  const countVotes = async (weekKey, choice) => {
    const r = await request(`battle_votes?week_key=eq.${weekKey}&choice=eq.${choice}&select=user_id`, {
      method: 'HEAD',
      headers: { Prefer: 'count=exact', Range: '0-0' },
    });
    return Number(String(r.headers.get('content-range') || '').split('/')[1]) || 0;
  };

  const getCounts = async (weekKey) => {
    const [A, B] = await Promise.all([countVotes(weekKey, 'A'), countVotes(weekKey, 'B')]);
    return { A, B };
  };

  const getRound = async (weekKey) =>
    (await db(`battle_rounds?week_key=eq.${weekKey}&select=week_key,product_a_id,product_b_id`))?.[0] || null;

  const getProducts = async (ids) => {
    const unique = Array.from(new Set(ids.filter(Boolean).map(String)));
    if (unique.length === 0) return new Map();
    const list = unique.map((id) => `"${encodeURIComponent(id.replace(/"/g, ''))}"`).join(',');
    const rows = await db(`products?id=in.(${list})&select=${PRODUCT_FIELDS}`);
    return new Map((rows || []).map((p) => [p.id, p]));
  };

  // 이번 주 라운드가 없으면 새로 편성합니다. 동시에 요청이 와도 먼저 저장된 한 건만 남습니다.
  const ensureRound = async (weekKey) => {
    const existing = await getRound(weekKey);
    if (existing) return existing;

    const [products, recentRounds] = await Promise.all([
      // 이미지 없는 상품은 제외 (image 컬럼은 용량이 클 수 있어 목록 조회에서는 받지 않음)
      db('products?image=neq.&select=id,name,brand,category,sub_category,item_type,release_date,created_at&order=created_at.desc&limit=1000'),
      db(`battle_rounds?select=product_a_id,product_b_id&order=week_key.desc&limit=${RECENT_ROUNDS_TO_AVOID}`),
    ]);
    const recentlyUsed = new Set((recentRounds || []).flatMap((r) => [r.product_a_id, r.product_b_id]));
    const pair = pickPair(products || [], recentlyUsed);
    if (!pair) return null;

    await db('battle_rounds?on_conflict=week_key', {
      method: 'POST',
      headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
      body: JSON.stringify({ week_key: weekKey, product_a_id: pair[0], product_b_id: pair[1] }),
    });
    return getRound(weekKey);
  };

  const getUserId = async () => {
    const authHeader = String(req.headers['authorization'] || '');
    const bearer = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : '';
    if (!bearer || bearer === serviceKey) return null;
    try {
      const r = await fetch(`${supabaseUrl}/auth/v1/user`, {
        headers: { apikey: anonKey || serviceKey, Authorization: `Bearer ${bearer}` },
      });
      if (!r.ok) return null;
      const user = await r.json();
      return user?.id && !user.is_anonymous ? String(user.id) : null;
    } catch {
      return null;
    }
  };

  const buildState = async (info, userId, revealCounts) => {
    const round = await ensureRound(info.weekKey);
    if (!round) return null;

    const [counts, myVote, previousRound] = await Promise.all([
      getCounts(info.weekKey),
      userId
        ? db(`battle_votes?week_key=eq.${info.weekKey}&user_id=eq.${encodeURIComponent(userId)}&select=choice`)
        : null,
      getRound(info.previousWeekKey),
    ]);
    const [productMap, previousCounts] = await Promise.all([
      getProducts([round.product_a_id, round.product_b_id, previousRound?.product_a_id, previousRound?.product_b_id]),
      previousRound ? getCounts(info.previousWeekKey) : null,
    ]);

    const productA = productMap.get(round.product_a_id);
    const productB = productMap.get(round.product_b_id);
    if (!productA || !productB) return null;

    let previous = null;
    if (previousRound && previousCounts.A + previousCounts.B > 0) {
      const prevA = productMap.get(previousRound.product_a_id);
      const prevB = productMap.get(previousRound.product_b_id);
      if (prevA && prevB) {
        previous = { weekKey: info.previousWeekKey, productA: prevA, productB: prevB, counts: previousCounts };
      }
    }

    return {
      weekKey: info.weekKey,
      phase: info.phase,
      resultAt: info.resultAt,
      nextRoundAt: info.nextRoundAt,
      productA,
      productB,
      myChoice: myVote?.[0]?.choice || null,
      totalVotes: counts.A + counts.B,
      counts: revealCounts || info.phase === 'result' ? counts : null,
      previous,
    };
  };

  const info = getRoundInfo();

  try {
    if (req.method === 'GET') {
      const wantsAdminView = String(req.query?.admin || '') === '1';
      const isAdmin = wantsAdminView ? (await verifyAdminRequest(req)).ok : false;
      const state = await buildState(info, await getUserId(), isAdmin);
      if (!state) return res.status(200).json({ success: true, round: null });
      return res.status(200).json({ success: true, round: state });
    }

    const body = req.body || {};

    if (body.action === 'set_pair') {
      const auth = await verifyAdminRequest(req);
      if (!auth.ok) return res.status(auth.status).json({ success: false, error: auth.error });

      const productAId = String(body.productAId || '');
      const productBId = String(body.productBId || '');
      if (!productAId || !productBId || productAId === productBId) {
        return res.status(400).json({ success: false, error: '서로 다른 두 상품을 선택해주세요.' });
      }
      const found = await getProducts([productAId, productBId]);
      if (found.size !== 2) {
        return res.status(400).json({ success: false, error: '선택한 상품을 찾을 수 없습니다.' });
      }

      const current = await getRound(info.weekKey);
      const changed = !current || current.product_a_id !== productAId || current.product_b_id !== productBId;
      if (changed) {
        await db('battle_rounds?on_conflict=week_key', {
          method: 'POST',
          headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
          body: JSON.stringify({ week_key: info.weekKey, product_a_id: productAId, product_b_id: productBId }),
        });
        // 대결 상품이 바뀌면 기존 표는 의미가 없으므로 비웁니다.
        await db(`battle_votes?week_key=eq.${info.weekKey}`, { method: 'DELETE' });
      }
      const state = await buildState(info, auth.userId || null, true);
      return res.status(200).json({ success: true, round: state, votesReset: changed && Boolean(current) });
    }

    const choice = body.choice;
    if (choice !== 'A' && choice !== 'B') {
      return res.status(400).json({ success: false, error: 'choice must be "A" or "B".' });
    }
    const userId = await getUserId();
    if (!userId) {
      return res.status(401).json({ success: false, code: 'SIGNED_OUT', error: '로그인 후 투표할 수 있어요.' });
    }
    if (info.phase !== 'voting') {
      return res.status(409).json({ success: false, code: 'CLOSED', error: '이번 주 투표는 마감됐어요.' });
    }
    if (!(await ensureRound(info.weekKey))) {
      return res.status(409).json({ success: false, code: 'NO_ROUND', error: '진행 중인 대결이 없습니다.' });
    }

    await db('battle_votes?on_conflict=week_key,user_id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ week_key: info.weekKey, user_id: userId, choice, updated_at: new Date().toISOString() }),
    });

    return res.status(200).json({ success: true, round: await buildState(info, userId, false) });
  } catch (err) {
    if (err instanceof TableMissingError) {
      return res.status(503).json({
        success: false,
        code: 'TABLE_MISSING',
        error: 'DB 테이블이 아직 없습니다. supabase/migrations/20261011_battle_votes.sql 을 Supabase SQL Editor 에서 실행해주세요.',
      });
    }
    console.error('[battle error]', err);
    return res.status(500).json({ success: false, error: err.message || '요청을 처리하지 못했습니다.' });
  }
}
