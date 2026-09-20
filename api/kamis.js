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
 * Find the latest available date for KAMIS by checking up to 7 days back.
 * Prioritizes dates that have active trading price quotes (dpr1 !== '-').
 */
async function findLatestAvailableDate(certKey, certId, productClsCode = '01') {
  const now = new Date();
  let fallbackDate = null;
  for (let i = 0; i <= 7; i++) {
    const d = new Date(now.getTime() - i * 86400000);
    const dateStr = formatDate(d);
    // Test with category 400 (과일류)
    const result = await fetchCategory('400', dateStr, certKey, certId, productClsCode);
    if (result.ok && result.items.length > 0) {
      if (result.hasValidPrice) {
        return dateStr;
      }
      if (!fallbackDate) {
        fallbackDate = dateStr;
      }
    }
  }
  return fallbackDate || formatDate(new Date(now.getTime() - 86400000));
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

  try {
    let targetDate = regday;
    if (!targetDate) {
      targetDate = await findLatestAvailableDate(certKey, certId, productClsCode);
    }

    const categoriesToFetch = category === 'all' 
      ? MAJOR_CATEGORIES 
      : (MAJOR_CATEGORIES.includes(category) ? [category] : ['400']);

    const fetchPromises = categoriesToFetch.map(cat => 
      fetchCategory(cat, targetDate, certKey, certId, productClsCode)
    );

    const results = await Promise.all(fetchPromises);
    const allItems = [];
    for (const r of results) {
      if (r.ok && Array.isArray(r.items)) {
        allItems.push(...r.items);
      }
    }

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
