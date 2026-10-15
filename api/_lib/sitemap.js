/**
 * 검색엔진용 사이트맵 (Hobby 요금제 함수 12개 한도 때문에 /api/site-content 안에서 처리)
 * Endpoint: /sitemap.xml (vercel.json rewrite → /api/site-content?sitemap=1)
 *
 * 주요 페이지와 실제 DB에 등록된 상품 상세 주소(/?p=<id>)를 내보냅니다.
 * 관리자가 삭제한 상품(시스템 레코드의 deletedProductIds)은 제외합니다.
 */

const SITE_URL = 'https://www.sinsangpick.kr';
const SYSTEM_RECORD_ID = '__sinsangpick_system_banners__';
const MAX_PRODUCTS = 45000; // 사이트맵 한 파일 상한(5만 URL) 이내

const STATIC_PAGES = [
  { loc: `${SITE_URL}/`, changefreq: 'daily', priority: '1.0' },
  { loc: `${SITE_URL}/?tab=category&cat=${encodeURIComponent('신제품')}`, changefreq: 'daily', priority: '0.9' },
  { loc: `${SITE_URL}/?tab=ranking`, changefreq: 'daily', priority: '0.8' },
  { loc: `${SITE_URL}/?tab=sale`, changefreq: 'daily', priority: '0.7' },
  { loc: `${SITE_URL}/?tab=community`, changefreq: 'daily', priority: '0.6' },
];

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const toDate = (value) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
};

export async function sendSitemap(req, res) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  let products = [];
  let deletedIds = new Set();

  if (supabaseUrl && supabaseKey) {
    const headers = { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` };
    try {
      const [productRes, systemRes] = await Promise.all([
        fetch(
          `${supabaseUrl}/rest/v1/products?select=id,created_at,updated_at&id=neq.${encodeURIComponent(SYSTEM_RECORD_ID)}&order=created_at.desc&limit=${MAX_PRODUCTS}`,
          { headers }
        ),
        fetch(`${supabaseUrl}/rest/v1/products?select=nutrition&id=eq.${encodeURIComponent(SYSTEM_RECORD_ID)}`, { headers }),
      ]);
      if (productRes.ok) products = await productRes.json();
      if (systemRes.ok) {
        const rows = await systemRes.json();
        const ids = rows?.[0]?.nutrition?.deletedProductIds;
        if (Array.isArray(ids)) deletedIds = new Set(ids.map(String));
      }
    } catch (err) {
      console.error('[sitemap] product fetch failed:', err);
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const urls = STATIC_PAGES.map(p =>
    `  <url><loc>${escapeXml(p.loc)}</loc><lastmod>${today}</lastmod><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`
  );

  for (const p of products) {
    if (!p?.id || deletedIds.has(String(p.id))) continue;
    const lastmod = toDate(p.updated_at) || toDate(p.created_at) || today;
    urls.push(
      `  <url><loc>${escapeXml(`${SITE_URL}/?p=${encodeURIComponent(p.id)}`)}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(xml);
}
