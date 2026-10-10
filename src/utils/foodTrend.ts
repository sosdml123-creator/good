import { Product } from '../types';
import { calculateProductPopularity, isRealNewProduct } from './ranking';

/**
 * "요즘 주목받는 먹거리" 실시간 순위 계산
 *
 * 서버(/api/naver?type=food_trend)가 키워드별로 내려주는 네이버 신호 3종
 * (통합검색 검색량 · 식품 쇼핑 클릭량 · 최근 블로그 글 수)과 검색량 급상승 여부를 종합해 점수를 매깁니다.
 */

export interface FoodTrendSignal {
  search: number | null;   // 통합검색 검색량 (기준 키워드 대비 배율, 최근 7일)
  momentum: number | null; // 이전 기간 대비 최근 3일 검색량 배율 (1 = 변동 없음)
  shopping: number | null; // 식품 쇼핑 클릭량 (기준 키워드 대비 배율, 최근 7일)
  blog: number | null;     // 최근 7일 하루 평균 블로그 글 수
}

export interface FoodTrendKeyword {
  key: string; // 검색 키워드 (서버 응답의 key와 동일)
  alt: string; // 브랜드를 뺀 표기 (없으면 빈 문자열)
}

export const FOOD_TREND_BATCH_SIZE = 4;
const POPULAR_POOL_SIZE = 24;
const BUZZ_POOL_SIZE = 24;
const DISCOVERY_POOL_SIZE = 12;
const POPULAR_BRAND_CAP = 4;
const ROTATING_BRAND_CAP = 2;
const MAX_KEY_LENGTH = 36;

const SCORE_WEIGHTS = { search: 0.4, blog: 0.25, shopping: 0.2, momentum: 0.15 };

const BRAND_ALIASES: Record<string, string> = {
  '메가MGC커피': '메가커피',
};

// 제품명 맨 앞에 붙는 제조사명: 사람들은 보통 제조사를 빼고 검색합니다 (농심 먹태깡 → 먹태깡)
const MAKER_PREFIXES = new Set([
  '농심', '오리온', '롯데', '롯데웰푸드', '롯데칠성', '해태', '해태제과', '해태아이스', '크라운', '삼양', '삼양식품',
  '오뚜기', '팔도', '빙그레', 'CJ', '동원', '풀무원', '매일', '매일유업', '남양', '남양유업', '서울우유', '동서', '대상',
  '청정원', '하림', '샘표', '웅진', '광동', '코카콜라',
]);

const compact = (value: string) => value.replace(/\s+/g, '');

const cleanProductName = (name: string): string =>
  name
    .replace(/\[[^\]]*\]|\([^)]*\)/g, ' ')
    .replace(/\d+(\.\d+)?\s?(kg|g|ml|l|L|개입|입|인분|매|봉|팩|캔|병)(?![가-힣A-Za-z])/g, ' ')
    .replace(/[^0-9A-Za-z가-힣ㄱ-ㅎ .&+%-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const truncateAtWord = (value: string): string => {
  if (value.length <= MAX_KEY_LENGTH) return value;
  const cut = value.slice(0, MAX_KEY_LENGTH + 1);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut.slice(0, MAX_KEY_LENGTH)).trim();
};

/**
 * 제품을 네이버에서 실제로 검색될 법한 키워드로 변환
 */
export const buildFoodTrendKeyword = (product: Product): FoodTrendKeyword | null => {
  let name = cleanProductName(product.name || '');
  if (compact(name).length < 2) return null;

  const brand = (product.brand || '').trim();
  const brandAlias = BRAND_ALIASES[brand] || brand;

  if (product.itemType === 'restaurant' && brand) {
    // 매장 메뉴는 브랜드 없이 검색하면 일반명사(바닐라 라떼)가 되어버리므로 브랜드를 반드시 포함
    const flatName = compact(name).toLowerCase();
    const brandStems = [brand, brandAlias, brand.replace(/커피$/, '')].map((b) => compact(b).toLowerCase()).filter((b) => b.length >= 2);
    if (!brandStems.some((stem) => flatName.includes(stem))) {
      name = `${brandAlias} ${name}`;
    }
    return { key: truncateAtWord(name), alt: '' };
  }

  const key = truncateAtWord(name);
  const [first, ...rest] = key.split(' ');
  const remainder = rest.join(' ');
  // 유통사 PB(노브랜드 꼬치어묵 등)는 브랜드를 빼면 일반명사가 되므로 제조사명만 생략 대상으로 봅니다
  return { key, alt: MAKER_PREFIXES.has(first) && compact(remainder).length >= 3 ? remainder : '' };
};

const hashString = (value: string): number => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const takeWithBrandCap = (sorted: Product[], size: number, cap: number, usedKeys: Set<string>, out: Map<string, FoodTrendKeyword>) => {
  const perBrand = new Map<string, number>();
  let taken = 0;
  for (const product of sorted) {
    if (taken >= size) break;
    const keyword = buildFoodTrendKeyword(product);
    if (!keyword || usedKeys.has(keyword.key)) continue;
    const brandCount = perBrand.get(product.brand) || 0;
    if (brandCount >= cap) continue;
    perBrand.set(product.brand, brandCount + 1);
    usedKeys.add(keyword.key);
    out.set(product.id, keyword);
    taken += 1;
  }
};

/**
 * 네이버에 조회할 후보 제품을 고릅니다 (1,000개가 넘는 전 제품을 매번 조회할 수는 없으므로).
 *  - 인기 후보: 앱 내 인기 점수 상위 제품 (브랜드 편중 방지)
 *  - 화제 후보: HOT·신제품으로 표시된 제품 중 날짜별로 바뀌는 일부
 *  - 발굴 후보: 나머지 제품 중 날짜별로 바뀌는 일부 — 표시가 없어도 실제로 뜨는 제품이 진입할 기회
 * 같은 날 같은 제품 목록이면 모든 사용자가 동일한 후보를 얻어 서버 캐시를 공유합니다.
 */
export const selectFoodTrendCandidates = (products: Product[], dateKey: string): Map<string, FoodTrendKeyword> => {
  const candidates = new Map<string, FoodTrendKeyword>();
  const usedKeys = new Set<string>();

  const scored = products.map((product) => ({ product, popularity: calculateProductPopularity(product) }));
  scored.sort((a, b) => b.popularity - a.popularity || a.product.id.localeCompare(b.product.id));
  takeWithBrandCap(scored.map((s) => s.product), POPULAR_POOL_SIZE, POPULAR_BRAND_CAP, usedKeys, candidates);

  const rotateByDate = (pool: Product[]) => pool
    .filter((product) => !candidates.has(product.id))
    .map((product) => ({ product, order: hashString(`${dateKey}:${product.id}`) }))
    .sort((a, b) => a.order - b.order || a.product.id.localeCompare(b.product.id))
    .map((entry) => entry.product);

  const buzzing = products.filter((product) => product.isHot || product.isToday || isRealNewProduct(product));
  takeWithBrandCap(rotateByDate(buzzing), BUZZ_POOL_SIZE, ROTATING_BRAND_CAP, usedKeys, candidates);
  takeWithBrandCap(rotateByDate(products), DISCOVERY_POOL_SIZE, ROTATING_BRAND_CAP, usedKeys, candidates);

  return candidates;
};

/**
 * 후보 키워드를 서버 요청 단위(kw 파라미터)로 묶습니다. 정렬 후 묶어 요청 URL이 사용자마다 같아지게 합니다.
 */
export const buildFoodTrendBatches = (keywords: FoodTrendKeyword[]): string[] => {
  const sorted = [...keywords].sort((a, b) => a.key.localeCompare(b.key));
  const batches: string[] = [];
  for (let i = 0; i < sorted.length; i += FOOD_TREND_BATCH_SIZE) {
    batches.push(sorted.slice(i, i + FOOD_TREND_BATCH_SIZE).map((k) => (k.alt ? `${k.key}~${k.alt}` : k.key)).join('|'));
  }
  return batches;
};

/**
 * 키워드별 종합 점수(0~1). 신호별 규모 차이가 커서 로그 스케일로 정규화한 뒤 가중합합니다.
 * 특정 신호를 전혀 받지 못한 경우(해당 API 장애) 그 신호는 빼고 나머지 가중치로 환산합니다.
 */
export const scoreFoodTrendSignals = (signals: Record<string, FoodTrendSignal>): Record<string, number> => {
  const keys = Object.keys(signals);
  const normalize = (pick: (s: FoodTrendSignal) => number | null, scale: number) => {
    const logs = keys.map((key) => {
      const value = pick(signals[key]);
      return value === null ? null : Math.log1p(Math.max(0, value) * scale);
    });
    const max = Math.max(0, ...logs.map((v) => v ?? 0));
    const available = logs.some((v) => v !== null) && max > 0;
    return { available, values: logs.map((v) => (available && v !== null ? v / max : 0)) };
  };

  const search = normalize((s) => s.search, 100);
  const shopping = normalize((s) => s.shopping, 100);
  const blog = normalize((s) => s.blog, 1);

  const totalWeight =
    (search.available ? SCORE_WEIGHTS.search + SCORE_WEIGHTS.momentum : 0) +
    (shopping.available ? SCORE_WEIGHTS.shopping : 0) +
    (blog.available ? SCORE_WEIGHTS.blog : 0);

  const scores: Record<string, number> = {};
  keys.forEach((key, i) => {
    if (totalWeight === 0) {
      scores[key] = 0;
      return;
    }
    // 급상승 가점: 검색량이 미미한 키워드의 우연한 변동이 과대평가되지 않도록 검색량 수준에 비례시킵니다
    const rising = Math.min(1.5, Math.max(0, (signals[key].momentum ?? 1) - 1)) / 1.5;
    const momentumScore = rising * Math.sqrt(search.values[i]);
    scores[key] = (
      SCORE_WEIGHTS.search * search.values[i] +
      SCORE_WEIGHTS.momentum * momentumScore +
      SCORE_WEIGHTS.shopping * shopping.values[i] +
      SCORE_WEIGHTS.blog * blog.values[i]
    ) / totalWeight;
  });
  return scores;
};

/**
 * 네이버 신호가 수집된 후보 제품을 종합 점수순으로 정렬해 반환합니다.
 */
export const rankFoodTrendProducts = (
  products: Product[],
  candidates: Map<string, FoodTrendKeyword>,
  signals: Record<string, FoodTrendSignal>
): Product[] => {
  const pooled: Record<string, FoodTrendSignal> = {};
  candidates.forEach(({ key }) => {
    if (signals[key]) pooled[key] = signals[key];
  });
  const scores = scoreFoodTrendSignals(pooled);

  return products
    .filter((product) => {
      const keyword = candidates.get(product.id);
      return keyword ? scores[keyword.key] !== undefined : false;
    })
    .map((product) => ({ product, score: scores[candidates.get(product.id)!.key] }))
    .sort((a, b) => b.score - a.score || a.product.id.localeCompare(b.product.id))
    .map((entry) => entry.product);
};
