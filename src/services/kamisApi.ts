import { Product, KamisPriceInfo, KamisPriceTrendItem } from '../types';
import { fetchWithTimeout } from '../utils/networkUtils';

export const KAMIS_DEFAULT_KEY = '48af112d-8ebb-484b-8ecb-a836c3976152';
export const KAMIS_DEFAULT_ID = 'sinsangpick';

const STORAGE_CACHE_KEY = 'sinsangpick_kamis_cache_v2';
const STORAGE_LAST_UPDATE_KEY = 'sinsangpick_kamis_last_update';

export interface RawKamisItem {
  item_name: string;
  item_code: string;
  kind_name: string;
  kind_code?: string;
  rank: string;
  rank_code?: string;
  unit: string;
  day1?: string;
  dpr1?: string;
  day2?: string;
  dpr2?: string;
  day3?: string;
  dpr3?: string;
  day4?: string;
  dpr4?: string;
  day5?: string;
  dpr5?: string;
  day6?: string;
  dpr6?: string;
  day7?: string;
  dpr7?: string;
}

export interface KamisApiResponse {
  success: boolean;
  latestDate: string;
  count: number;
  items: RawKamisItem[];
  categories?: string[];
  productClsCode?: string;
  error?: string;
}

/**
 * 숫자 파싱 헬퍼 (쉼표, 대시 제거)
 */
export function parseKamisPrice(val?: string | number): number {
  if (!val) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const cleaned = String(val).replace(/,/g, '').replace(/[^\d]/g, '').trim();
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 0 : num;
}

/**
 * 날짜를 YYYY-MM-DD 형태로 변환
 */
function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * 원본 KAMIS item 객체를 앱 표준 KamisPriceInfo 로 변환
 */
export function mapToKamisPriceInfo(item: RawKamisItem, latestDateStr?: string): KamisPriceInfo {
  // dpr1이 유효하지 않고(주말 공시 등) dpr2가 있는 경우의 대비
  let todayPrice = parseKamisPrice(item.dpr1);
  let prevDayPrice = parseKamisPrice(item.dpr2);
  let weekAgoPrice = parseKamisPrice(item.dpr3);
  let twoWeeksAgoPrice = parseKamisPrice(item.dpr4);
  let monthAgoPrice = parseKamisPrice(item.dpr5);
  let yearAgoPrice = parseKamisPrice(item.dpr6);
  let averageYearPrice = parseKamisPrice(item.dpr7);

  // 만약 dpr1이 비어있고 dpr2가 있다면 dpr2를 최신가로 간주
  if (todayPrice === 0 && prevDayPrice > 0) {
    todayPrice = prevDayPrice;
    prevDayPrice = weekAgoPrice > 0 ? weekAgoPrice : prevDayPrice;
  }

  const priceChange = prevDayPrice > 0 ? (todayPrice - prevDayPrice) : 0;
  const changeRate = prevDayPrice > 0 
    ? Math.round(((todayPrice - prevDayPrice) / prevDayPrice) * 1000) / 10 
    : 0;

  const monthAgoChangeRate = monthAgoPrice > 0
    ? Math.round(((todayPrice - monthAgoPrice) / monthAgoPrice) * 1000) / 10
    : undefined;

  const trend: 'up' | 'down' | 'same' = priceChange > 0 ? 'up' : priceChange < 0 ? 'down' : 'same';

  const trends: KamisPriceTrendItem[] = [
    { period: '당일', dateLabel: item.day1 || '당일', price: todayPrice },
    { period: '1일전', dateLabel: item.day2 || '1일전', price: prevDayPrice },
    { period: '1주일전', dateLabel: item.day3 || '1주일전', price: weekAgoPrice },
    { period: '2주일전', dateLabel: item.day4 || '2주일전', price: twoWeeksAgoPrice },
    { period: '1개월전', dateLabel: item.day5 || '1달전', price: monthAgoPrice },
    { period: '1년전', dateLabel: item.day6 || '1년전', price: yearAgoPrice },
    { period: '평년', dateLabel: item.day7 || '평년', price: averageYearPrice }
  ].filter(t => t.price > 0);

  return {
    itemCode: item.item_code,
    itemName: item.item_name,
    kindCode: item.kind_code,
    kindName: item.kind_name,
    rank: item.rank,
    unit: item.unit,
    todayPrice,
    prevDayPrice,
    priceChange,
    changeRate,
    trend,
    monthAgoPrice: monthAgoPrice > 0 ? monthAgoPrice : undefined,
    monthAgoChangeRate,
    yearAgoPrice: yearAgoPrice > 0 ? yearAgoPrice : undefined,
    averageYearPrice: averageYearPrice > 0 ? averageYearPrice : undefined,
    latestDate: latestDateStr || getTodayDateString(),
    trends,
    marketType: '소매',
    updatedAt: new Date().toISOString()
  };
}

/**
 * KAMIS 오픈 API 시세 조회 (Proxy 1차 -> 직접 호출 2차)
 */
export async function fetchKamisDailyPrices(forceRefresh: boolean = false): Promise<KamisApiResponse> {
  const todayStr = getTodayDateString();

  // 1. 캐시 확인 (오늘 이미 조회했고 강제 새로고침이 아니면 캐시 사용)
  if (!forceRefresh && typeof localStorage !== 'undefined') {
    try {
      const cachedRaw = localStorage.getItem(STORAGE_CACHE_KEY);
      if (cachedRaw) {
        const parsed = JSON.parse(cachedRaw);
        if (parsed?.date === todayStr && Array.isArray(parsed?.items) && parsed.items.length > 0) {
          return {
            success: true,
            latestDate: parsed.latestDate || todayStr,
            count: parsed.items.length,
            items: parsed.items
          };
        }
      }
    } catch {}
  }

  // 2. 1차 시도: Vercel Serverless Function Proxy (/api/kamis?category=all)
  if (typeof window !== 'undefined') {
    try {
      const proxyUrl = `/api/kamis?category=all`;
      const res = await fetchWithTimeout(proxyUrl, undefined, 12000);
      if (res.ok) {
        const json: KamisApiResponse = await res.json();
        if (json.success && Array.isArray(json.items) && json.items.length > 0) {
          saveToCache(todayStr, json.latestDate, json.items);
          return json;
        }
      }
    } catch (proxyError) {
      console.warn('[KAMIS API] Proxy fetch failed, falling back to direct:', proxyError);
    }
  }

  // 3. 2차 시도: Direct Call (모바일/Capacitor 환경 등)
  const certKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_KAMIS_API_KEY) ||
                  (typeof process !== 'undefined' && (process.env?.VITE_KAMIS_API_KEY || process.env?.KAMIS_API_KEY)) ||
                  KAMIS_DEFAULT_KEY;
  const certId = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_KAMIS_API_ID) ||
                 (typeof process !== 'undefined' && (process.env?.VITE_KAMIS_API_ID || process.env?.KAMIS_API_ID)) ||
                 KAMIS_DEFAULT_ID;

  try {
    const categories = ['100', '200', '400', '500', '600'];
    const allItems: RawKamisItem[] = [];
    let detectedLatestDate = todayStr;

    for (const cat of categories) {
      // Direct request to KAMIS
      const url = `https://www.kamis.or.kr/service/price/xml.do?action=dailyPriceByCategoryList&p_product_cls_code=01&p_convert_kg_yn=N&p_item_category_code=${cat}&p_cert_key=${certKey}&p_cert_id=${certId}&p_returntype=json`;
      const res = await fetchWithTimeout(url, undefined, 7000);
      if (res.ok) {
        const json = await res.json();
        if (json?.data?.error_code === '000' && Array.isArray(json?.data?.item)) {
          allItems.push(...json.data.item);
        }
      }
    }

    if (allItems.length > 0) {
      saveToCache(todayStr, detectedLatestDate, allItems);
      return {
        success: true,
        latestDate: detectedLatestDate,
        count: allItems.length,
        items: allItems
      };
    }
  } catch (directError) {
    console.error('[KAMIS API] Direct fetch failed:', directError);
  }

  // 캐시가 있다면 오래되었더라도 반환
  if (typeof localStorage !== 'undefined') {
    try {
      const cachedRaw = localStorage.getItem(STORAGE_CACHE_KEY);
      if (cachedRaw) {
        const parsed = JSON.parse(cachedRaw);
        if (Array.isArray(parsed?.items) && parsed.items.length > 0) {
          return {
            success: true,
            latestDate: parsed.latestDate || todayStr,
            count: parsed.items.length,
            items: parsed.items
          };
        }
      }
    } catch {}
  }

  return {
    success: false,
    latestDate: todayStr,
    count: 0,
    items: [],
    error: '시세 데이터를 불러올 수 없습니다.'
  };
}

function saveToCache(todayStr: string, latestDate: string, items: RawKamisItem[]) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify({
      date: todayStr,
      latestDate,
      timestamp: Date.now(),
      items
    }));
    localStorage.setItem(STORAGE_LAST_UPDATE_KEY, new Date().toISOString());
  } catch (e) {
    console.warn('[KAMIS API] Failed to save cache:', e);
  }
}

/**
 * 품목명 매핑 규칙 사전
 */
interface ProductMatchRule {
  targetItemName: string;
  kindKeywords?: string[];
  rankKeywords?: string[];
}

const PRODUCE_MAPPING: Record<string, ProductMatchRule> = {
  // 과일
  '사과': { targetItemName: '사과', kindKeywords: ['홍로', '후지', '부사'] },
  '배': { targetItemName: '배', kindKeywords: ['신고'] },
  '복숭아': { targetItemName: '복숭아', kindKeywords: ['백도', '황도'] },
  '딸기': { targetItemName: '딸기' },
  '수박': { targetItemName: '수박' },
  '참외': { targetItemName: '참외' },
  '감귤': { targetItemName: '감귤' },
  '귤': { targetItemName: '감귤' },
  '포도': { targetItemName: '포도', kindKeywords: ['캠벨', '샤인', '거봉'] },
  '샤인머스캣': { targetItemName: '포도', kindKeywords: ['샤인', '캠벨'] },
  '바나나': { targetItemName: '바나나' },
  '토마토': { targetItemName: '토마토' },
  '방울토마토': { targetItemName: '방울토마토' },
  // 육류 및 축산
  '소고기': { targetItemName: '소', kindKeywords: ['안심', '등심'], rankKeywords: ['1++등급', '1+등급', '1등급'] },
  '한우': { targetItemName: '소', kindKeywords: ['등심', '안심'] },
  '돼지고기': { targetItemName: '돼지', kindKeywords: ['삼겹살', '앞다리', '목심'] },
  '삼겹살': { targetItemName: '돼지', kindKeywords: ['삼겹살'] },
  '닭고기': { targetItemName: '닭' },
  '생닭': { targetItemName: '닭' },
  '오리고기': { targetItemName: '오리' },
  '계란': { targetItemName: '계란', kindKeywords: ['특란', '일반란'] },
  '유정란': { targetItemName: '계란' },
  // 식재료 및 곡물
  '두부': { targetItemName: '콩' },
  '감자': { targetItemName: '감자', kindKeywords: ['수미'] },
  '고구마': { targetItemName: '고구마', kindKeywords: ['밤', '호박'] },
  '양파': { targetItemName: '양파' },
  '대파': { targetItemName: '파' },
  '마늘': { targetItemName: '깐마늘(국산)' },
  '쌀': { targetItemName: '쌀', kindKeywords: ['20kg', '10kg', '일반계'] },
  '쌀·잡곡': { targetItemName: '쌀', kindKeywords: ['20kg', '10kg'] },
  '백미': { targetItemName: '쌀' },
  // 수산물
  '고등어': { targetItemName: '고등어' },
  '갈치': { targetItemName: '갈치' },
  '오징어': { targetItemName: '물오징어' },
  '물오징어': { targetItemName: '물오징어' },
  '전복': { targetItemName: '전복' },
  '새우': { targetItemName: '새우' },
  '꽃게': { targetItemName: '꽃게' },
  '조기': { targetItemName: '조기' },
  '멸치': { targetItemName: '마른멸치' },
  '김': { targetItemName: '김' },
  '미역': { targetItemName: '마른미역' }
};

/**
 * 특정 상품에 가장 잘 맞는 KAMIS 공시 품목 매칭
 */
export function matchProductToKamisPrice(
  product: Product, 
  kamisItems: RawKamisItem[], 
  latestDateStr?: string
): KamisPriceInfo | null {
  if (!kamisItems || kamisItems.length === 0) return null;

  const name = product.name.toLowerCase();
  const subCategory = (product.subCategory || '').toLowerCase();
  const brand = (product.brand || '').toLowerCase();

  // 매핑 테이블에서 키워드 탐색
  let bestRule: ProductMatchRule | null = null;

  for (const [key, rule] of Object.entries(PRODUCE_MAPPING)) {
    const k = key.toLowerCase();
    if (subCategory.includes(k) || name.includes(k) || brand.includes(k)) {
      bestRule = rule;
      break;
    }
  }

  if (!bestRule) {
    // 상품 카테고리가 농수산물이 아니거나 매칭 룰이 없는 경우
    return null;
  }

  // 1. item_name 일치하는 항목들 필터링
  const candidates = kamisItems.filter(item => 
    item.item_name === bestRule!.targetItemName ||
    item.item_name.includes(bestRule!.targetItemName)
  );

  if (candidates.length === 0) return null;

  // 2. kind_name 및 rank 조건으로 우선순위 정렬
  let selected = candidates[0];

  if (bestRule.kindKeywords && bestRule.kindKeywords.length > 0) {
    const matchedKind = candidates.find(c => 
      bestRule!.kindKeywords!.some(kw => c.kind_name.includes(kw))
    );
    if (matchedKind) selected = matchedKind;
  }

  if (bestRule.rankKeywords && bestRule.rankKeywords.length > 0) {
    const matchedRank = candidates.find(c => 
      bestRule!.rankKeywords!.some(rk => (c.rank || '').includes(rk))
    );
    if (matchedRank) selected = matchedRank;
  }

  // 유효 가격이 있는 후보 우선 선택
  const withValidPrice = candidates.filter(c => parseKamisPrice(c.dpr1) > 0 || parseKamisPrice(c.dpr2) > 0);
  if (withValidPrice.length > 0) {
    if (!withValidPrice.includes(selected)) {
      selected = withValidPrice[0];
    }
  }

  return mapToKamisPriceInfo(selected, latestDateStr);
}

/**
 * 전체 상품 목록에 최신 KAMIS 시세 주입 및 가격 정합성 동기화
 */
export function applyKamisPricesToProducts(
  products: Product[], 
  kamisItems: RawKamisItem[], 
  latestDateStr?: string
): { updatedProducts: Product[]; updatedCount: number } {
  if (!products || products.length === 0 || !kamisItems || kamisItems.length === 0) {
    return { updatedProducts: products, updatedCount: 0 };
  }

  let updatedCount = 0;
  const updatedProducts = products.map(prod => {
    // 신선식품, 과일, 식재료, 고기·수산 대상
    const isTarget = prod.itemType === 'fresh' || 
                     ['과일', '식재료', '고기·수산'].includes(prod.category) ||
                     Boolean(prod.produceDetails);

    if (!isTarget) return prod;

    const priceInfo = matchProductToKamisPrice(prod, kamisItems, latestDateStr);
    if (!priceInfo) return prod;

    updatedCount++;

    // 상품 객체에 kamisPriceInfo 삽입
    return {
      ...prod,
      kamisPriceInfo: priceInfo
    };
  });

  return { updatedProducts, updatedCount };
}
