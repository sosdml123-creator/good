/**
 * 상품 상세 페이지 HTML 미리 생성 (검색엔진·링크 미리보기용)
 * Endpoint: /product/:id (vercel.json rewrite → /api/site-content?page=product&id=:id)
 *
 * 빌드된 index.html 에 상품별 제목·설명·Open Graph·구조화 데이터(Product)와
 * 상품 정보·리뷰 본문을 넣어 내려줍니다. 본문은 #root 안에 들어가므로
 * 브라우저에서는 React 앱이 뜨면서 그대로 교체되고, 수집 로봇은 본문을 읽습니다.
 *
 * 대표 주소(canonical)는 PC 주소(pc.sinsangpick.kr), 모바일 주소(www)는 alternate 로 연결합니다.
 * PC 주소로 들어온 휴대폰 방문자는 같은 상품의 www 주소로 보냅니다.
 */

const SYSTEM_RECORD_ID = '__sinsangpick_system_banners__';
const PC_ORIGIN = 'https://pc.sinsangpick.kr';
const MOBILE_ORIGIN = 'https://www.sinsangpick.kr';
const ALLOWED_HOSTS = new Set(['www.sinsangpick.kr', 'pc.sinsangpick.kr']);
const TEMPLATE_TTL_MS = 5 * 60 * 1000;
const MOBILE_UA = /iPhone|iPod|Android.*Mobile|Mobile.*Android|Windows Phone|BlackBerry|Opera Mini/i;

const templateCache = new Map();

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// JSON-LD 를 <script> 안에 안전하게 넣기 위해 '<' 를 이스케이프합니다.
const jsonLd = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');

const formatPrice = (price) => (typeof price === 'number' && price > 0 ? `${price.toLocaleString('ko-KR')}원` : '');

const formatDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

const truncate = (text, max) => {
  const s = String(text || '').replace(/\s+/g, ' ').trim();
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
};

async function loadTemplate(origin) {
  const cached = templateCache.get(origin);
  if (cached && Date.now() - cached.at < TEMPLATE_TTL_MS) return cached.html;
  const r = await fetch(`${origin}/index.html`, { headers: { 'x-sinsangpick-template': '1' } });
  if (!r.ok) throw new Error(`template fetch failed: ${r.status}`);
  const html = await r.text();
  templateCache.set(origin, { html, at: Date.now() });
  return html;
}

/** <head> 의 공통 메타를 상품용으로 바꾸고, 새 태그를 </head> 앞에 넣습니다. */
function buildHead(template, { title, description, image, canonical, alternate, ld }) {
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace(/<meta property="og:type"[^>]*>/, '<meta property="og:type" content="product" />')
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${escapeHtml(description)}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${escapeHtml(canonical)}" />`)
    .replace(/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${escapeHtml(image)}" />`)
    .replace(/<meta name="twitter:card"[^>]*>/, '<meta name="twitter:card" content="summary_large_image" />');

  const extra = [
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<link rel="alternate" media="only screen and (max-width: 640px)" href="${escapeHtml(alternate)}" />`,
    ld && `<script type="application/ld+json">${jsonLd(ld)}</script>`,
  ].filter(Boolean).join('\n    ');
  return html.replace('</head>', `    ${extra}\n  </head>`);
}

/** 상품 DB 필드만으로 만든 소개 문장 (리뷰가 없어도 읽을 글이 있도록). 없는 값은 건너뜁니다. */
function buildSummary(p, reviews) {
  const stores = Array.isArray(p.stores) ? p.stores.filter(Boolean) : [];
  const price = formatPrice(p.price);
  return [
    `${p.brand} ${p.name}은(는) ${p.category ? `${p.category} 분야의 ` : ''}신제품이에요.`,
    p.release_date ? `${p.release_date}에 출시됐어요.` : '',
    price ? `가격은 ${price}${p.volume ? `(${p.volume})` : ''}이에요.` : (p.volume ? `용량은 ${p.volume}이에요.` : ''),
    p.calories ? `열량은 ${p.calories}kcal예요.` : '',
    stores.length > 0 ? `${stores.join(', ')}에서 만나볼 수 있어요.` : '',
    reviews.length > 0
      ? `신상픽에서는 먹어본 사람들의 리뷰 ${reviews.length}개를 볼 수 있어요.`
      : '신상픽에서 먹어본 사람들의 별점과 솔직한 후기를 모아볼 수 있어요.',
  ].filter(Boolean).join(' ');
}

function buildBody(p, reviews, related, sameBrand, origin) {
  const price = formatPrice(p.price);
  const info = [
    ['브랜드', p.brand],
    ['카테고리', [p.category, p.sub_category].filter(Boolean).join(' > ')],
    ['판매처', Array.isArray(p.stores) ? p.stores.join(', ') : ''],
    ['출시일', p.release_date],
    ['용량', p.volume],
    ['열량', p.calories ? `${p.calories}kcal` : ''],
    ['제조원', p.manufacturer],
    ['원재료', p.ingredients],
  ].filter(([, v]) => v && String(v).trim());

  const reviewItems = reviews.slice(0, 20).map(r => `
        <li>
          <p><strong>${escapeHtml(r.user_name || '신상러')}</strong> · 별점 ${Number(r.rating || 0).toFixed(1)} · ${escapeHtml(formatDate(r.created_at))}</p>
          <p>${escapeHtml(truncate(r.content, 500))}</p>
        </li>`).join('');

  const brandItems = sameBrand.map(x => `
        <li><a href="${origin}/product/${encodeURIComponent(x.id)}">${escapeHtml(x.brand)} ${escapeHtml(x.name)}</a></li>`).join('');

  const relatedItems = related.map(x => `
        <li><a href="${origin}/product/${encodeURIComponent(x.id)}">${escapeHtml(x.brand)} ${escapeHtml(x.name)}</a></li>`).join('');

  return `
    <main id="ssr-product" style="max-width:960px;margin:0 auto;padding:24px;font-family:sans-serif;color:#111">
      <nav><a href="${origin}/">신상픽 홈</a> &gt; <a href="${origin}/?tab=category&amp;cat=${encodeURIComponent(p.category || '')}">${escapeHtml(p.category)}</a> &gt; ${escapeHtml(p.name)}</nav>
      <article>
        <img src="${escapeHtml(p.image)}" alt="${escapeHtml(`${p.brand} ${p.name}`)}" width="400" height="400" style="max-width:100%;height:auto" />
        <h1>${escapeHtml(p.name)}</h1>
        <p>${escapeHtml(p.brand)}${price ? ` · ${price}` : ''}</p>
        ${p.description ? `<p>${escapeHtml(p.description)}</p>` : ''}
        <p>${escapeHtml(buildSummary(p, reviews))}</p>
        <dl>${info.map(([k, v]) => `<dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd>`).join('')}</dl>
        <section>
          <h2>${escapeHtml(p.name)} 리뷰 ${reviews.length}개</h2>
          ${reviews.length > 0 ? `<ul>${reviewItems}\n      </ul>` : '<p>아직 등록된 리뷰가 없어요. 신상픽에서 첫 리뷰를 남겨보세요.</p>'}
        </section>
        ${brandItems ? `<section><h2>${escapeHtml(p.brand)} 다른 신상</h2><ul>${brandItems}\n      </ul></section>` : ''}
        ${relatedItems ? `<section><h2>함께 보면 좋은 ${escapeHtml(p.category)}</h2><ul>${relatedItems}\n      </ul></section>` : ''}
      </article>
    </main>`;
}

export async function sendProductPage(req, res, { supabaseUrl, supabaseKey }) {
  const id = String(req.query?.id || '').trim();
  const host = String(req.headers?.['x-forwarded-host'] || req.headers?.host || '').toLowerCase();
  const origin = ALLOWED_HOSTS.has(host) ? `https://${host}` : MOBILE_ORIGIN;
  const ua = String(req.headers?.['user-agent'] || '');

  // PC 주소로 들어온 휴대폰 방문자는 같은 상품의 모바일(www) 주소로 보냅니다.
  if (origin === PC_ORIGIN && MOBILE_UA.test(ua) && id) {
    res.setHeader('Cache-Control', 'private, no-store');
    return res.redirect(302, `${MOBILE_ORIGIN}/product/${encodeURIComponent(id)}`);
  }

  let template;
  try {
    template = await loadTemplate(origin);
  } catch (err) {
    console.error('[product-page] template error:', err);
    return res.redirect(302, `${origin}/?p=${encodeURIComponent(id)}`);
  }

  const sendPlain = (status = 200) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', origin === PC_ORIGIN ? 'private, max-age=0' : 'public, s-maxage=300, stale-while-revalidate=3600');
    res.status(status).send(template);
  };

  if (!id || id === SYSTEM_RECORD_ID || !supabaseUrl || !supabaseKey) return sendPlain();

  const headers = { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` };
  let product = null;
  let reviews = [];
  let related = [];
  let sameBrand = [];
  try {
    const [prodRes, revRes, sysRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/products?select=*&id=eq.${encodeURIComponent(id)}&limit=1`, { headers }),
      fetch(`${supabaseUrl}/rest/v1/reviews?select=id,rating,content,user_name,created_at&product_id=eq.${encodeURIComponent(id)}&order=created_at.desc&limit=50`, { headers }),
      fetch(`${supabaseUrl}/rest/v1/products?select=nutrition&id=eq.${encodeURIComponent(SYSTEM_RECORD_ID)}`, { headers }),
    ]);
    const rows = prodRes.ok ? await prodRes.json() : [];
    product = rows?.[0] || null;
    if (sysRes.ok) {
      const deleted = (await sysRes.json())?.[0]?.nutrition?.deletedProductIds;
      if (Array.isArray(deleted) && deleted.map(String).includes(id)) product = null;
    }
    if (revRes.ok) {
      reviews = (await revRes.json()).filter(r => r.content && r.user_name !== '탈퇴한 회원' && r.user_name !== '탈퇴회원');
    }
    if (product?.category) {
      const relRes = await fetch(
        `${supabaseUrl}/rest/v1/products?select=id,name,brand&category=eq.${encodeURIComponent(product.category)}&id=neq.${encodeURIComponent(id)}&order=created_at.desc&limit=8`,
        { headers }
      );
      if (relRes.ok) related = await relRes.json();
    }
    if (product?.brand) {
      const brandRes = await fetch(
        `${supabaseUrl}/rest/v1/products?select=id,name,brand&brand=eq.${encodeURIComponent(product.brand)}&id=neq.${encodeURIComponent(id)}&order=created_at.desc&limit=8`,
        { headers }
      );
      if (brandRes.ok) sameBrand = await brandRes.json();
    }
  } catch (err) {
    console.error('[product-page] data error:', err);
  }

  // DB에 없는 상품(삭제됨 등)은 앱이 직접 처리하도록 기본 화면을 내려줍니다.
  if (!product) return sendPlain();

  const price = formatPrice(product.price);
  const avg = reviews.length > 0 ? reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length : 0;
  const title = `${product.name} - ${product.brand} 리뷰·가격 | 신상픽`;
  const description = truncate(
    [
      `${product.brand} ${product.name}${price ? ` ${price}` : ''}.`,
      reviews.length > 0 ? `리뷰 ${reviews.length}개, 평균 별점 ${avg.toFixed(1)}.` : '',
      product.description || `${product.category} 신제품 정보와 먹어본 사람들의 솔직한 리뷰를 신상픽에서 확인하세요.`,
    ].filter(Boolean).join(' '),
    155
  );
  const path = `/product/${encodeURIComponent(product.id)}`;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: { '@type': 'Brand', name: product.brand },
    category: product.category,
    image: product.image ? [product.image] : undefined,
    description: product.description || undefined,
    url: `${PC_ORIGIN}${path}`,
  };
  if (typeof product.price === 'number' && product.price > 0) {
    ld.offers = { '@type': 'Offer', price: product.price, priceCurrency: 'KRW', availability: 'https://schema.org/InStock', url: `${PC_ORIGIN}${path}` };
  }
  // 별점은 실제 등록된 리뷰가 있을 때만 넣습니다 (가짜 평점 노출 금지).
  if (reviews.length > 0) {
    ld.aggregateRating = { '@type': 'AggregateRating', ratingValue: Number(avg.toFixed(1)), reviewCount: reviews.length, bestRating: 5, worstRating: 1 };
    ld.review = reviews.slice(0, 5).map(r => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.user_name || '신상러' },
      datePublished: String(r.created_at || '').slice(0, 10),
      reviewRating: { '@type': 'Rating', ratingValue: Number(r.rating || 0), bestRating: 5, worstRating: 1 },
      reviewBody: truncate(r.content, 300),
    }));
  }

  // 구글 제품 스니펫은 가격(offers)·별점(aggregateRating)·리뷰(review) 중 하나가 있어야 합니다.
  // 셋 다 없는 상품(가격 없음 + 리뷰 없음)은 조건을 못 채우는 Product 마크업이 되므로 넣지 않습니다.
  const hasProductSignal = Boolean(ld.offers || ld.aggregateRating);
  let html = buildHead(template, {
    title,
    description,
    image: product.image || `${MOBILE_ORIGIN}/logo.png`,
    canonical: `${PC_ORIGIN}${path}`,
    alternate: `${MOBILE_ORIGIN}${path}`,
    ld: hasProductSignal ? ld : null,
  });
  html = html.replace(/<div id="root"><\/div>/, `<div id="root">${buildBody(product, reviews, related, sameBrand, origin)}\n    </div>`);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // PC 주소는 휴대폰 방문자를 www 로 보내야 해서 CDN 에 캐시하지 않습니다.
  res.setHeader('Cache-Control', origin === PC_ORIGIN ? 'private, max-age=0' : 'public, s-maxage=600, stale-while-revalidate=86400');
  res.status(200).send(html);
}
