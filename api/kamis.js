/**
 * Vercel Serverless Function Proxy for KAMIS (농수산물유통정보 - aT 한국농수산식품유통공사)
 * Endpoint: https://www.kamis.or.kr/service/price/xml.do?action=dailyPriceByCategoryList
 */

const DEFAULT_KEY = '48af112d-8ebb-484b-8ecb-a836c3976152';
const DEFAULT_ID = 'sinsangpick';

// Major produce categories: 100(식량작물), 200(채소류), 400(과일류), 500(축산물), 600(수산물)
const MAJOR_CATEGORIES = ['100', '200', '400', '500', '600'];

/**
 * Format Date to YYYY-MM-DD
 */
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Fetch one category from KAMIS API for a specific date
 */
async function fetchCategory(categoryCode, dateStr, certKey, certId, productClsCode = '01') {
  const url = `https://www.kamis.or.kr/service/price/xml.do?action=dailyPriceByCategoryList&p_product_cls_code=${productClsCode}&p_convert_kg_yn=N&p_item_category_code=${categoryCode}&p_regday=${dateStr}&p_cert_key=${certKey}&p_cert_id=${certId}&p_returntype=json`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return { ok: false, items: [] };

    const json = await res.json();
    if (json?.data?.error_code === '000' && Array.isArray(json?.data?.item) && json.data.item.length > 0) {
      const hasValidPrice = json.data.item.some(i => i.dpr1 && i.dpr1 !== '-' && i.dpr1 !== '0');
      return { ok: true, items: json.data.item, date: dateStr, hasValidPrice };
    }
    return { ok: false, items: [], hasValidPrice: false };
  } catch (err) {
    clearTimeout(timeoutId);
    return { ok: false, items: [], hasValidPrice: false };
  }
}

/**
 * 따뜻한 인스턴스에서 재사용하는 메모리 캐시 (최신 공시일 · 카테고리별 응답)
 */
const MEMO_MS = 10 * 60 * 1000;
const memo = new Map();
function memoGet(key) {
  const hit = memo.get(key);
  return hit && Date.now() - hit.at < MEMO_MS ? hit.value : null;
}
function memoSet(key, value) {
  memo.set(key, { at: Date.now(), value });
}

/**
 * Find the latest available date for KAMIS by checking up to 7 days back.
 * 8일치를 한꺼번에 병렬 조회하고, 시세(dpr1)가 있는 가장 최근 날짜를 고릅니다.
 * 조회한 과일류(400) 결과는 본 요청에서 다시 쓰도록 함께 돌려줍니다.
 */
async function findLatestAvailableDate(certKey, certId, productClsCode = '01') {
  const cached = memoGet(`date:${productClsCode}`);
  if (cached) return cached;

  const now = new Date();
  const dates = Array.from({ length: 8 }, (_, i) => formatDate(new Date(now.getTime() - i * 86400000)));
  const results = await Promise.all(dates.map(d => fetchCategory('400', d, certKey, certId, productClsCode)));
  const best = results.find(r => r.ok && r.hasValidPrice) || results.find(r => r.ok && r.items.length > 0);
  if (!best) return { date: dates[1], probe: null };
  const found = { date: best.date, probe: best };
  memoSet(`date:${productClsCode}`, found);
  return found;
}

/**
 * 품목 하나의 기간별 소매가 (전국 평균) — KAMIS periodProductList
 * 응답: { success, points: [{ date: 'YYYY-MM-DD', price }] } (오래된 날짜 → 최근 순)
 */
async function sendPeriodPrices(req, res, certKey, certId, productClsCode) {
  const pick = (v, re) => (re.test(String(v || '')) ? String(v) : '');
  const category = pick(req.query.category, /^\d{3}$/);
  const item = pick(req.query.item, /^\d{3}$/);
  const kind = pick(req.query.kind, /^\d{2}$/);
  const rank = pick(req.query.rank, /^\d{2}$/);
  const days = Math.min(365, Math.max(7, Number(req.query.days) || 90));
  if (!category || !item || !kind || !rank) {
    return res.status(400).json({ success: false, error: 'category, item, kind, rank are required' });
  }

  const end = new Date();
  const start = new Date(end.getTime() - days * 86400000);
  const url = `https://www.kamis.or.kr/service/price/xml.do?action=periodProductList&p_productclscode=${productClsCode}&p_startday=${formatDate(start)}&p_endday=${formatDate(end)}&p_itemcategorycode=${category}&p_itemcode=${item}&p_kindcode=${kind}&p_productrankcode=${rank}&p_convert_kg_yn=N&p_cert_key=${certKey}&p_cert_id=${certId}&p_returntype=json`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);
  try {
    const r = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    const json = r.ok ? await r.json() : null;
    const rows = Array.isArray(json?.data?.item) ? json.data.item : [];
    const points = [];
    for (const row of rows) {
      // 지역별 행 중 전국 '평균' 행만 씁니다.
      if (row.countyname && row.countyname !== '평균') continue;
      const price = Number(String(row.price || '').replace(/,/g, ''));
      const md = String(row.regday || '').match(/(\d{1,2})\/(\d{1,2})/);
      if (!Number.isFinite(price) || price <= 0 || !md || !row.yyyy) continue;
      points.push({ date: `${row.yyyy}-${md[1].padStart(2, '0')}-${md[2].padStart(2, '0')}`, price });
    }
    points.sort((a, b) => a.date.localeCompare(b.date));
    return res.status(200).json({ success: points.length > 0, points });
  } catch (err) {
    clearTimeout(timeoutId);
    return res.status(200).json({ success: false, points: [], error: err.message || 'period fetch failed' });
  }
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Set Cache-Control: Cache at edge for 1 hour, stale-while-revalidate for 1 day
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  const certKey = process.env.KAMIS_API_KEY || process.env.VITE_KAMIS_API_KEY || DEFAULT_KEY;
  const certId = process.env.KAMIS_API_ID || process.env.VITE_KAMIS_API_ID || DEFAULT_ID;

  const {
    category = 'all', // '100', '200', '400', '500', '600', or 'all'
    regday = '',
    productClsCode = '01' // 01: retail, 02: wholesale
  } = req.query;

  // 품목별 기간 시세 (그래프용): /api/kamis?action=period&category=200&item=246&kind=00&rank=04&days=90
  if (req.query.action === 'period') {
    return sendPeriodPrices(req, res, certKey, certId, productClsCode);
  }

  try {
    let targetDate = regday;
    let probe = null;
    if (!targetDate) {
      ({ date: targetDate, probe } = await findLatestAvailableDate(certKey, certId, productClsCode));
    }

    const categoriesToFetch = category === 'all'
      ? MAJOR_CATEGORIES
      : (MAJOR_CATEGORIES.includes(category) ? [category] : ['400']);

    const results = await Promise.all(categoriesToFetch.map(async cat => {
      if (cat === '400' && probe) return probe;
      const key = `cat:${productClsCode}:${cat}:${targetDate}`;
      const hit = memoGet(key);
      if (hit) return hit;
      const r = await fetchCategory(cat, targetDate, certKey, certId, productClsCode);
      if (r.ok) memoSet(key, r);
      return r;
    }));
    const allItems = [];
    results.forEach((r, i) => {
      if (r.ok && Array.isArray(r.items)) {
        // 화면에서 카테고리별로 나눌 수 있도록 카테고리 코드를 붙입니다.
        allItems.push(...r.items.map(item => ({ ...item, category_code: categoriesToFetch[i] })));
      }
    });

    return res.status(200).json({
      success: true,
      latestDate: targetDate,
      count: allItems.length,
      items: allItems,
      categories: categoriesToFetch,
      productClsCode
    });
  } catch (error) {
    console.error('KAMIS API Proxy Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error while querying KAMIS API'
    });
  }
}
