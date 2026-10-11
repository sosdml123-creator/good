/**
 * 편의점 이달의 행사상품(1+1 · 2+1) 수집 (서버 전용)
 *  - CU 공식 홈페이지 행사상품
 *  - 세븐일레븐 공식 홈페이지 행사상품
 *  - 이마트24 공식 홈페이지 행사상품
 *
 * GS25 는 공식 웹의 행사상품 목록이 없어져(우리동네GS 앱 전용) 수집하지 않습니다.
 * 수집에 실패한 매장은 빈 결과가 아니라 오류로 보고하며, 값을 지어내지 않습니다.
 */

import {
  fetchText,
  hashString,
  decodeEntities,
  isFoodProduct,
  detectFoodCategory,
  detectFoodSubCategory,
  cleanStoreProductName,
  normalizeProductName,
} from './storeCrawlers.js';

/** 매장당 노출 상한 — 행사 목록은 시스템 레코드 한 건에 통째로 저장되므로 크기를 제한합니다. */
export const MAX_ITEMS_PER_STORE = 120;

export const ALCOHOL_PATTERN = /맥주|소주|와인|위스키|칵테일|하이볼|막걸리|사케|보드카|럼주|데킬라|샴페인|스파클링와인|라거|에일|IPA|필스너|청하|백세주|복분자주|매화수|이슬톡톡|츄하이|사와|진토닉/i;

const stripTags = (html) => decodeEntities(String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
const toPrice = (text) => parseInt(String(text || '').replace(/[^0-9]/g, ''), 10) || 0;
const toDealType = (text) => {
  const compact = String(text || '').replace(/\s+/g, '');
  if (compact.includes('1+1')) return '1+1';
  if (compact.includes('2+1')) return '2+1';
  return null;
};

function absoluteUrl(src, origin) {
  if (!src) return '';
  if (src.startsWith('//')) return `https:${src}`;
  if (src.startsWith('/')) return `${origin}${src}`;
  return src;
}

// ---------------------------------------------------------------------------
// CU
// ---------------------------------------------------------------------------
const CU_URL = 'https://cu.bgfretail.com/event/plus.do?category=event&depth2=1&sf=N';

async function crawlCuPage(pageIndex, searchCondition) {
  const html = await fetchText('https://cu.bgfretail.com/event/plusAjax.do', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest',
      Referer: CU_URL,
    },
    body: new URLSearchParams({ pageIndex: String(pageIndex), listType: '0', searchCondition, user_id: '' }).toString(),
  });

  return html.split(/<li[^>]*class="prod_list"[^>]*>/i).slice(1).map((chunk) => ({
    rawName: stripTags((chunk.match(/<div[^>]*class="name"[^>]*>\s*<p>([\s\S]*?)<\/p>/i) || [])[1]),
    price: toPrice((chunk.match(/<div[^>]*class="price"[^>]*>\s*<strong>([\d,]+)<\/strong>/i) || [])[1]),
    // 배지 영역에는 "2+1 / 1+1" 안내 주석이 함께 들어 있어 span 의 class(plus1 / plus2)로 판별합니다.
    dealType: { 1: '1+1', 2: '2+1' }[(chunk.match(/<span class="plus(\d)"/i) || [])[1]] || null,
    image: absoluteUrl((chunk.match(/<img[^>]*src="([^"]+)"/i) || [])[1], 'https://cu.bgfretail.com'),
  }));
}

// ---------------------------------------------------------------------------
// 세븐일레븐
// ---------------------------------------------------------------------------
const SEVEN_URL = 'https://www.7-eleven.co.kr/product/presentList.asp';

async function crawlSevenPage(page, tab) {
  const html = await fetchText('https://www.7-eleven.co.kr/product/listMoreAjax.asp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Referer: SEVEN_URL },
    body: new URLSearchParams({ intPageSize: '10', intCurrPage: String(page), pTab: String(tab) }).toString(),
  });

  return html.split(/<ul class="tag_list_01">/i).slice(1).map((chunk) => ({
    rawName: stripTags((chunk.match(/<div class=['"]name['"][^>]*>([\s\S]*?)<\/div>/i) || [])[1]),
    price: toPrice((chunk.match(/<div class=['"]price['"][^>]*>\s*<span>([\d,]+)<\/span>/i) || [])[1]),
    dealType: toDealType(stripTags((chunk.match(/^([\s\S]*?)<\/ul>/i) || [])[1])),
    image: absoluteUrl((chunk.match(/<img[^>]*src="([^"]+)"/i) || [])[1], 'https://www.7-eleven.co.kr'),
  }));
}

// ---------------------------------------------------------------------------
// 이마트24
// ---------------------------------------------------------------------------
const EMART24_URL = 'https://emart24.co.kr/goods/event';

async function crawlEmart24Page(page, benefitSeq) {
  const html = await fetchText(`${EMART24_URL}?search=&page=${page}&category_seq=${benefitSeq}&base_category_seq=&align=`);

  return html.split(/<div class="itemWrap">/i).slice(1).map((chunk) => ({
    rawName: stripTags((chunk.match(/<div class="itemtitle"[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i) || [])[1]),
    price: toPrice((chunk.match(/class="price"[^>]*>\s*([\d,]+)/i) || [])[1]),
    dealType: toDealType((chunk.match(/floatR">([^<]*)</i) || [])[1]),
    image: absoluteUrl((chunk.match(/<img[^>]*\ssrc="([^"]+)"/i) || [])[1], 'https://emart24.co.kr'),
  }));
}

/**
 * 매장별 수집 설정. deals 의 각 항목은 (페이지) => 원본 상품 배열 을 돌려줍니다.
 * pages 는 혜택 종류(1+1 / 2+1)별로 가져올 페이지 수입니다.
 */
export const SALE_STORES = {
  CU: {
    key: 'cu',
    sourceUrl: CU_URL,
    pages: 3,
    deals: [(page) => crawlCuPage(page, '23'), (page) => crawlCuPage(page, '24')],
  },
  세븐일레븐: {
    key: 'seven',
    sourceUrl: SEVEN_URL,
    pages: 8,
    deals: [(page) => crawlSevenPage(page, 1), (page) => crawlSevenPage(page, 2)],
  },
  이마트24: {
    key: 'emart24',
    sourceUrl: EMART24_URL,
    pages: 5,
    deals: [(page) => crawlEmart24Page(page, 1), (page) => crawlEmart24Page(page, 2)],
  },
};

/** 'CU' / '7-ELEVEN' / 'emart24' 등 다양한 표기를 SALE_STORES 키로 맞춥니다. */
export function resolveSaleStore(input) {
  const text = String(input || '').replace(/\s+/g, '').toUpperCase();
  if (text === 'CU') return 'CU';
  if (text === '7-ELEVEN' || text === 'SEVEN' || text === '세븐일레븐') return '세븐일레븐';
  if (text === 'EMART24' || text === '이마트24') return '이마트24';
  return null;
}

export function kstToday() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];
}

/** 편의점 행사는 월 단위로 운영되므로 행사기간은 이번 달 1일 ~ 말일(KST)입니다. */
export function currentSalePeriod(today = kstToday()) {
  const [year, month] = today.split('-').map(Number);
  const mm = String(month).padStart(2, '0');
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return {
    monthKey: `${year}${mm}`,
    startDate: `${year}-${mm}-01`,
    endDate: `${year}-${mm}-${String(lastDay).padStart(2, '0')}`,
    period: `${mm}.01 ~ ${mm}.${String(lastDay).padStart(2, '0')}`,
  };
}

/**
 * 종료일(YYYY-MM-DD). endDate 가 없는 예전·수동 등록 행사는 period("10.01 ~ 10.31")의 끝 날짜로 추정하고,
 * 날짜를 알 수 없으면('상시' 등) null 을 돌려 만료시키지 않습니다.
 */
export function getSaleEndDate(item, today = kstToday()) {
  if (item && /^\d{4}-\d{2}-\d{2}$/.test(item.endDate || '')) return item.endDate;
  const tail = String((item && item.period) || '').split('~').pop();
  const m = tail.match(/(?:(\d{4})[.\-/]\s*)?(\d{1,2})[.\-/]\s*(\d{1,2})/);
  if (!m) return null;
  const pad = (n) => String(n).padStart(2, '0');
  if (m[1]) return `${m[1]}-${pad(m[2])}-${pad(m[3])}`;
  // 연도가 없으면 작년·올해·내년 중 오늘과 가장 가까운 날짜로 봅니다 (연말·연초 행사 대응).
  const thisYear = Number(today.slice(0, 4));
  return [thisYear - 1, thisYear, thisYear + 1]
    .map((year) => `${year}-${pad(m[2])}-${pad(m[3])}`)
    .sort((a, b) => Math.abs(Date.parse(a) - Date.parse(today)) - Math.abs(Date.parse(b) - Date.parse(today)))[0];
}

export function isSaleExpired(item, today = kstToday()) {
  const endDate = getSaleEndDate(item, today);
  return Boolean(endDate) && endDate < today;
}

function toSaleItem(raw, store, config, period) {
  const { brand, name } = cleanStoreProductName(raw.rawName, store);
  const category = detectFoodCategory(raw.rawName);
  const isOnePlusOne = raw.dealType === '1+1';
  const payCount = isOnePlusOne ? 1 : 2;
  const getCount = isOnePlusOne ? 2 : 3;

  return {
    // 같은 달에는 같은 상품이 같은 id 를 갖도록 해 찜·삭제 상태가 매일 수집에도 유지됩니다.
    id: `sale-auto-${config.key}-${period.monthKey}-${hashString(`${normalizeProductName(raw.rawName)}|${raw.dealType}`)}`,
    title: name,
    brand,
    category,
    subCategory: detectFoodSubCategory(raw.rawName, category),
    store,
    dealType: raw.dealType,
    badgeText: raw.dealType,
    originalPrice: raw.price * getCount,
    salePrice: raw.price * payCount,
    unitPriceDescription: `개당 ${Math.round((raw.price * payCount) / getCount).toLocaleString('ko-KR')}원 꼴`,
    discountRate: isOnePlusOne ? 50 : 33,
    image: raw.image,
    period: period.period,
    startDate: period.startDate,
    endDate: period.endDate,
    dDay: '',
    benefitTag: `${store} 이달의 행사상품`,
    description: `[${store}] ${name} ${raw.dealType} 행사 상품입니다.`,
    isHot: false,
    likeCount: 0,
    sourceUrl: config.sourceUrl,
    crawledAt: new Date().toISOString(),
  };
}

/**
 * 한 매장의 이달 행사상품을 수집합니다.
 * @returns {{ store, sourceUrl, totalParsed, excludedCount, items }} 실패 시 예외를 던집니다.
 */
export async function crawlStoreSales(store, { onlyFood = true, dealType = '전체', limit = MAX_ITEMS_PER_STORE } = {}) {
  const config = SALE_STORES[store];
  if (!config) throw new Error(`지원하지 않는 매장입니다: ${store}`);
  const period = currentSalePeriod();

  // 혜택 종류(1+1 / 2+1)별 페이지를 한꺼번에 요청합니다. 일부 페이지 실패는 건너뛰고, 전부 실패하면 아래에서 오류 처리합니다.
  const pageNumbers = Array.from({ length: config.pages }, (_, i) => i + 1);
  const perDeal = await Promise.all(config.deals.map(async (fetchPage) => {
    const pages = await Promise.all(pageNumbers.map((page) => fetchPage(page).catch(() => [])));
    return pages.flat().filter((r) => r.rawName && r.price > 0 && r.dealType);
  }));

  // 1+1 과 2+1 이 고르게 섞이도록 번갈아 담습니다.
  const merged = [];
  for (let i = 0; perDeal.some((rows) => i < rows.length); i++) {
    for (const rows of perDeal) if (rows[i]) merged.push(rows[i]);
  }
  if (merged.length === 0) throw new Error('행사상품을 한 건도 읽지 못했습니다 (사이트 구조 변경 가능성)');

  const seenIds = new Set();
  const items = [];
  let excludedCount = 0;
  for (const raw of merged) {
    if (ALCOHOL_PATTERN.test(raw.rawName) || (onlyFood && !isFoodProduct(raw.rawName))) {
      excludedCount++;
      continue;
    }
    if (dealType !== '전체' && raw.dealType !== dealType) continue;
    const item = toSaleItem(raw, store, config, period);
    if (seenIds.has(item.id)) continue;
    seenIds.add(item.id);
    items.push(item);
  }

  return {
    store,
    sourceUrl: config.sourceUrl,
    totalParsed: merged.length,
    excludedCount,
    items: items.slice(0, limit),
  };
}

/**
 * 저장된 행사 목록에 새 수집 결과를 반영합니다.
 *  - 종료일이 지난 행사는 제거
 *  - 수집에 성공한 매장의 자동 수집분은 새 결과로 교체 (실패했거나 전단이 그대로인 매장은 기존 것을 유지)
 *  - 관리자가 직접 등록한 행사는 그대로 두고, 관리자가 지운 자동 수집분은 되살리지 않음
 */
export function mergeSalePromotions(existing, reports, deletedIds = [], today = kstToday()) {
  const deleted = new Set(deletedIds);
  const replaced = reports.filter((r) => r.ok && !r.unchanged);
  const okStores = new Set(replaced.map((r) => r.store));
  const alive = (Array.isArray(existing) ? existing : []).filter((item) => item && item.id && !isSaleExpired(item, today));
  const previous = new Map(alive.map((item) => [item.id, item]));
  const isAuto = (item) => String(item.id).startsWith('sale-auto-');

  const manual = alive.filter((item) => !isAuto(item));
  const keptAuto = alive.filter((item) => isAuto(item) && !okStores.has(item.store));

  const freshByStore = replaced.map((r) => r.items
    .filter((item) => !deleted.has(item.id))
    .map((item) => {
      const before = previous.get(item.id);
      return before ? { ...item, isHot: Boolean(before.isHot), likeCount: before.likeCount || 0 } : item;
    }));

  // 홈 구좌 앞쪽에 한 매장만 몰리지 않도록 매장별로 번갈아 배치합니다.
  const fresh = [];
  for (let i = 0; freshByStore.some((rows) => i < rows.length); i++) {
    for (const rows of freshByStore) if (rows[i]) fresh.push(rows[i]);
  }

  return [...manual, ...fresh, ...keptAuto];
}
