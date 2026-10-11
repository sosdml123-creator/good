/**
 * 대형마트 주간 전단 행사상품 수집 (서버 전용)
 *  - 이마트   : 공식 전단 페이지의 면별 설명 글 → AI 가 상품 단위로 정리
 *  - 롯데마트 : 롯데마트GO 전단 API 의 면별 설명 글 → AI 가 상품 단위로 정리
 *  - 홈플러스 : 전단이 이미지뿐이라 AI 가 이미지를 직접 판독
 *
 * AI 가 지어낸 값이 노출되지 않도록 검증합니다.
 *  - 글 기반(이마트·롯데마트): 상품명과 행사가가 원문에 그대로 있을 때만 채택
 *  - 이미지 기반(홈플러스): 같은 면을 두 번 따로 읽어 상품명·가격이 일치한 것만 채택
 * 전단이 바뀌지 않았으면(서명 동일) AI 를 다시 호출하지 않습니다.
 */

import { fetchText, hashString, decodeEntities, isFoodProduct, detectFoodCategory, detectFoodSubCategory } from './storeCrawlers.js';
import { ALCOHOL_PATTERN, MAX_ITEMS_PER_STORE, kstToday } from './saleCrawlers.js';
import { getAiEngine, askAiForJson } from './aiJson.js';

const pad = (n) => String(n).padStart(2, '0');
const compact = (text) => String(text || '').replace(/\s+/g, '').toLowerCase();
const stripTags = (html) => decodeEntities(String(html || '').replace(/<[^>]+>/g, ' ').replace(/[ \t]+/g, ' '));

/** "10.8", "10/8", "2026. 10. 8" → YYYY-MM-DD (연도가 없으면 오늘과 가장 가까운 해) */
function toIsoDate(text, today = kstToday()) {
  const m = String(text || '').match(/(?:(\d{4})\s*[.\-/]\s*)?(\d{1,2})\s*[.\-/]\s*(\d{1,2})/);
  if (!m) return null;
  if (m[1]) return `${m[1]}-${pad(m[2])}-${pad(m[3])}`;
  const thisYear = Number(today.slice(0, 4));
  return [thisYear - 1, thisYear, thisYear + 1]
    .map((year) => `${year}-${pad(m[2])}-${pad(m[3])}`)
    .sort((a, b) => Math.abs(Date.parse(a) - Date.parse(today)) - Math.abs(Date.parse(b) - Date.parse(today)))[0];
}

/** "10.8(목) - 10.14(수)" 같은 기간 표기에서 시작·종료일을 읽습니다. */
function parsePeriod(text) {
  const parts = String(text || '').split(/\s*[~\-–]\s*(?=\d)/);
  if (parts.length < 2) return null;
  const startDate = toIsoDate(parts[0]);
  // 종료일에 월이 생략된 경우("10/8~14")는 지원하지 않고 null 처리합니다.
  const endDate = toIsoDate(parts[parts.length - 1]);
  return startDate && endDate && startDate <= endDate ? { startDate, endDate } : null;
}

// ---------------------------------------------------------------------------
// 전단 가져오기: { sourceUrl, startDate, endDate, pages: [{ image, text? }] }
// ---------------------------------------------------------------------------
const EMART_URL = 'https://eapp.emart.com/leaflet/leafletView_EL.do';

async function fetchEmartFlyer() {
  const html = await fetchText(EMART_URL, {}, 12000);
  const images = [...html.matchAll(/<img[^>]*data-src="([^"]*news_leaflet[^"]+)"[^>]*alt="전단[^"]*면[^"]*"/gi)].map((m) => m[1]);
  const texts = [...html.matchAll(/<p>\s*(\[[\s\S]*?)<\/p>/gi)].map((m) => stripTags(m[1]).trim()).filter((t) => t.length > 50);
  const period = parsePeriod((texts.join(' ').match(/행사기간\s*:\s*([^※\[]{5,40})/) || [])[1]);
  if (texts.length === 0 || !period) throw new Error('이마트 전단 글 또는 행사기간을 읽지 못했습니다 (사이트 구조 변경 가능성)');
  return {
    sourceUrl: EMART_URL,
    ...period,
    pages: texts.map((text, i) => ({ text, image: (images.length === texts.length ? images[i] : images[0]) || '' })),
  };
}

const LOTTE_URL = 'https://www.mlotte.net/leaflet?rst1=HYPER';

async function fetchLotteFlyer() {
  const body = await fetchText('https://www.lottemartgo.com/apis/fo/product/leaflet/plate/select', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-ssp-gateway-service-id': 'PRODUCT',
      Origin: 'https://www.mlotte.net',
      Referer: 'https://www.mlotte.net/',
    },
    body: JSON.stringify({ str_cd: '', rst1: 'HYPER', is_group: '0' }),
  }, 12000);
  const leaflet = JSON.parse(body)?.data?.plate_leaflet_list?.[0];
  const pages = (leaflet?.leaflet_img_list || [])
    .filter((p) => p.img_url && String(p.img_desc || '').length > 50)
    .map((p) => ({ image: p.img_url, text: String(p.img_desc) }));
  const startDate = String(leaflet?.post_start_dt || '').slice(0, 10);
  const endDate = String(leaflet?.post_end_dt || '').slice(0, 10);
  if (pages.length === 0 || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) throw new Error('롯데마트 전단을 읽지 못했습니다 (API 변경 가능성)');
  return { sourceUrl: LOTTE_URL, startDate, endDate, pages };
}

const HOMEPLUS_URL = 'https://my.homeplus.co.kr/leaflet';

async function fetchHomeplusFlyer() {
  const html = await fetchText(HOMEPLUS_URL, {}, 12000);
  const images = [...new Set([...html.matchAll(/<img src="([^"]+)" alt="[^"]*전단[^"]*"/gi)].map((m) => m[1]))];
  const period = parsePeriod((html.match(/id="leafletDateText" value="([^"]+)"/) || [])[1]);
  if (images.length === 0 || !period) throw new Error('홈플러스 전단 이미지 또는 행사기간을 읽지 못했습니다 (사이트 구조 변경 가능성)');
  return { sourceUrl: HOMEPLUS_URL, ...period, pages: images.slice(0, 6).map((image) => ({ image })) };
}

export const MART_STORES = {
  이마트: { key: 'emart', fetchFlyer: fetchEmartFlyer },
  롯데마트: { key: 'lottemart', fetchFlyer: fetchLotteFlyer },
  홈플러스: { key: 'homeplus', fetchFlyer: fetchHomeplusFlyer },
};

// ---------------------------------------------------------------------------
// AI 정리
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `당신은 한국 대형마트 전단에서 "식품 행사상품"만 골라 구조화하는 도구입니다.
전단에 적힌 사실만 옮기고, 적혀 있지 않은 값은 절대 추측하거나 지어내지 않습니다.

다음 JSON 만 출력합니다:
{"items":[{"name":"","spec":"","dealType":"1+1|2+1|할인","originalPrice":0,"salePrice":0,"condition":"","period":""}]}

규칙:
- 아래 조건을 만족하는 식품(신선·가공식품, 음료)만 담습니다. 주류, 생활용품, 가전, 의류, 카드·포인트·상품권 안내는 제외합니다.
  - "1+1" 또는 "2+1" 로 표기되고 판매가가 적힌 상품 → dealType 은 "1+1"/"2+1", salePrice 는 적힌 판매가, originalPrice 는 0
  - "정상가 → 행사가"처럼 할인 전·후 가격이 모두 적힌 상품 → dealType "할인", originalPrice 는 할인 전, salePrice 는 할인 후 가격
- 가격이 하나만 적혀 있고 1+1·2+1 도 아닌 상품, 가격이 없는 상품, "~% 할인"만 있고 금액이 없는 상품은 담지 않습니다.
- name 은 전단에 적힌 상품명을 글자 그대로 옮깁니다 (괄호 속 규격·원산지는 빼서 spec 에 넣습니다).
- 가격은 원 단위 정수입니다. "4,280/4,980→2,996/3,486원"처럼 여러 규격이 묶여 있으면 첫 번째 규격의 가격만 씁니다.
- condition 에는 그 가격을 받기 위한 조건을 전단 표현 그대로 짧게 적습니다 (예: "신세계포인트 적립 시", "행사카드 결제 시", "L.POINT 회원"). 없으면 "".
- period 에는 그 상품에만 따로 적힌 행사 기간이 있을 때만 전단 표기 그대로 적습니다 (예: "10/9(금)~10/11(일)"). 없으면 "".
- 해당하는 상품이 없으면 {"items":[]} 를 출력합니다.`;

function normalizeAiItem(raw) {
  const name = String(raw?.name || '').replace(/\s+/g, ' ').trim();
  const dealType = raw?.dealType === '1+1' || raw?.dealType === '2+1' ? raw.dealType : raw?.dealType === '할인' ? '할인특가' : null;
  const salePrice = Math.round(Number(raw?.salePrice) || 0);
  const originalPrice = Math.round(Number(raw?.originalPrice) || 0);
  if (!name || name.length > 60 || !dealType || salePrice < 100) return null;
  if (dealType === '할인특가' && !(originalPrice > salePrice)) return null;
  return {
    name,
    spec: String(raw?.spec || '').trim().slice(0, 60),
    dealType,
    originalPrice,
    salePrice,
    condition: String(raw?.condition || '').trim().slice(0, 40),
    period: String(raw?.period || '').trim(),
  };
}

const itemKey = (item) => `${compact(item.name)}|${item.dealType}|${item.salePrice}|${item.originalPrice}`;

/** 글 기반 면: 상품명과 가격이 원문에 그대로 있는 것만 채택 */
async function readTextPage(engine, page) {
  const result = await askAiForJson(engine, { system: SYSTEM_PROMPT, text: `전단 한 면의 내용입니다.\n\n${page.text}` });
  const source = compact(page.text);
  const hasPrice = (price) => source.includes(price.toLocaleString('ko-KR')) || source.includes(String(price));
  return (Array.isArray(result?.items) ? result.items : [])
    .map(normalizeAiItem)
    .filter((item) => item
      && source.includes(compact(item.name))
      && hasPrice(item.salePrice)
      && (item.dealType !== '할인특가' || hasPrice(item.originalPrice)));
}

/** 이미지 기반 면: 두 번 따로 읽어 일치한 것만 채택 */
async function readImagePage(engine, page) {
  const res = await fetch(page.image, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`전단 이미지 HTTP ${res.status}`);
  const image = {
    mediaType: (res.headers.get('content-type') || 'image/jpeg').split(';')[0],
    base64: Buffer.from(await res.arrayBuffer()).toString('base64'),
  };
  const read = async () => {
    const result = await askAiForJson(engine, { system: SYSTEM_PROMPT, text: '전단 한 면의 이미지입니다. 글자가 또렷하게 읽히는 상품만 담습니다.', image });
    return (Array.isArray(result?.items) ? result.items : []).map(normalizeAiItem).filter(Boolean);
  };
  const [first, second] = await Promise.all([read(), read()]);
  const agreed = new Set(second.map(itemKey));
  return first.filter((item) => agreed.has(itemKey(item)));
}

function toSaleItem(item, store, config, flyer, page) {
  const own = item.period ? parsePeriod(item.period) : null;
  // 상품별 기간은 전단 기간 안에 있을 때만 인정합니다.
  const period = own && own.startDate >= flyer.startDate && own.endDate <= flyer.endDate ? own : flyer;
  const isBundle = item.dealType !== '할인특가';
  const getCount = item.dealType === '1+1' ? 2 : 3;
  const payCount = getCount - 1;
  const originalPrice = isBundle ? item.salePrice * getCount : item.originalPrice;
  const salePrice = isBundle ? item.salePrice * payCount : item.salePrice;
  const discountRate = Math.round((1 - salePrice / originalPrice) * 100);
  const title = item.spec ? `${item.name} (${item.spec})` : item.name;
  const category = detectFoodCategory(item.name);
  const md = (iso) => `${iso.slice(5, 7)}.${iso.slice(8, 10)}`;

  return {
    id: `sale-auto-${config.key}-${flyer.endDate.replace(/-/g, '')}-${hashString(itemKey(item))}`,
    title,
    brand: store,
    category,
    subCategory: detectFoodSubCategory(item.name, category),
    store,
    dealType: item.dealType,
    badgeText: item.dealType === '할인특가' ? `${discountRate}% 할인` : item.dealType,
    originalPrice,
    salePrice,
    unitPriceDescription: isBundle
      ? `개당 ${Math.round(salePrice / getCount).toLocaleString('ko-KR')}원 꼴`
      : `${(originalPrice - salePrice).toLocaleString('ko-KR')}원 할인`,
    discountRate,
    image: page.image,
    period: `${md(period.startDate)} ~ ${md(period.endDate)}`,
    startDate: period.startDate,
    endDate: period.endDate,
    dDay: '',
    benefitTag: item.condition || `${store} 이번 주 전단`,
    description: `[${store} 전단] ${title} ${item.dealType === '할인특가' ? '할인' : item.dealType} 행사${item.condition ? ` (${item.condition})` : ''}. 점포별로 행사 내용이 다를 수 있습니다.`,
    isHot: false,
    likeCount: 0,
    sourceUrl: flyer.sourceUrl,
    crawledAt: new Date().toISOString(),
  };
}

/**
 * 한 마트의 이번 주 전단 행사상품을 수집합니다.
 * @param previousSignature 지난 수집 때의 전단 서명 — 같으면 AI 호출 없이 { unchanged: true } 를 돌려줍니다.
 * @returns {{ store, signature, unchanged?: boolean, items }} 실패 시 예외를 던집니다.
 */
export async function crawlMartSales(store, previousSignature) {
  const config = MART_STORES[store];
  if (!config) throw new Error(`지원하지 않는 매장입니다: ${store}`);

  const flyer = await config.fetchFlyer();
  const signature = hashString(`${flyer.endDate}|${flyer.pages.map((p) => `${p.image}|${p.text || ''}`).join('|')}`);
  if (flyer.endDate < kstToday()) return { store, signature, items: [] };
  if (signature === previousSignature) return { store, signature, unchanged: true, items: [] };

  const engine = getAiEngine();
  if (!engine) throw new Error('전단을 정리할 AI 키(ANTHROPIC_API_KEY 또는 GEMINI_API_KEY)가 서버 환경변수에 없습니다.');

  // 한 면이라도 읽지 못하면 실패로 처리해, 다음 수집 때 전단 전체를 다시 읽게 합니다.
  const perPage = await Promise.all(flyer.pages.map(async (page) => ({
    page,
    items: page.text ? await readTextPage(engine, page) : await readImagePage(engine, page),
  })));

  const seen = new Set();
  const items = [];
  for (const { page, items: pageItems } of perPage) {
    for (const item of pageItems) {
      if (ALCOHOL_PATTERN.test(item.name) || !isFoodProduct(item.name)) continue;
      const sale = toSaleItem(item, store, config, flyer, page);
      if (seen.has(sale.id) || sale.endDate < kstToday()) continue;
      seen.add(sale.id);
      items.push(sale);
    }
  }

  return { store, signature, items: items.slice(0, MAX_ITEMS_PER_STORE) };
}
