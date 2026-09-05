import { Product, CommunityPost } from '../types';

/**
 * Parses various createdAt formats (ISO date string, timestamp, or Korean relative time)
 * and returns the elapsed time in hours.
 */
export const getHoursSinceCreated = (createdAt?: string | number): number => {
  if (!createdAt) return 24;

  // 1. Timestamp or ISO date string
  if (typeof createdAt === 'number' || !isNaN(Date.parse(createdAt as string))) {
    const time = typeof createdAt === 'number' ? createdAt : new Date(createdAt).getTime();
    const diffMs = Math.max(0, Date.now() - time);
    return diffMs / (1000 * 60 * 60);
  }

  const str = String(createdAt).trim();

  // 2. Relative Korean strings
  if (str.includes('방금') || str.includes('초 전') || str.includes('분 전')) {
    return 0.2;
  }
  if (str.includes('시간 전')) {
    const match = str.match(/(\d+)\s*시간\s*전/);
    if (match) return parseInt(match[1], 10);
  }
  if (str.includes('일 전')) {
    const match = str.match(/(\d+)\s*일\s*전/);
    if (match) return parseInt(match[1], 10) * 24;
  }
  if (str.includes('달 전') || str.includes('개월 전')) {
    return 30 * 24;
  }

  return 12; // Default fallback
};

/**
 * Calculates a product's real-time popularity score based on:
 * - Overall Rating (weight 20)
 * - Rating Count / Reviews (weight 5)
 * - Repurchase Percent (weight 0.3)
 * - Badges: isToday (+35), isHot (+25)
 */
export const calculateProductPopularity = (product: Product): number => {
  const ratingScore = (product.overallRating || 0) * 20;
  const countScore = (product.ratingCount || 0) * 5;
  const repurchaseScore = (product.repurchasePercent || 0) * 0.3;
  const hotBonus = (product.isHot ? 25 : 0) + (product.isToday ? 35 : 0);

  return ratingScore + countScore + repurchaseScore + hotBonus;
};

/**
 * Returns products sorted by real-time popularity ranking.
 */
export const getPopularProducts = (products: Product[], limit?: number): Product[] => {
  const sorted = [...products].sort((a, b) => {
    return calculateProductPopularity(b) - calculateProductPopularity(a);
  });
  return limit ? sorted.slice(0, limit) : sorted;
};

/**
 * Known baseline search influx counts for iconic / trending products.
 * Guarantees that search popularity reflects actual consumer search trends even across devices.
 */
const BASELINE_SEARCH_INFLUX_MAP: Record<string, number> = {
  'prod-02': 58400, // 두바이 스타일 피스타치오 초콜릿 (검색 1위)
  'prod-01': 46200, // 꼬북칩 초코츄러스 (검색 2위)
  'dessert-01': 41800, // 요아정 요거트 아이스크림 (검색 3위)
  'drink-01': 37500, // 아사히 수퍼드라이 생맥주캔 (검색 4위)
  'fruit-01': 33200, // 영덕 햇 딱딱이 백도 복숭아 (검색 5위)
  'prod-03': 30100, // 먹태깡 청양마요맛 (검색 6위)
  'seafood-shrimp-01': 27800, // 산지직송 자연산 독도 꽃새우 (검색 7위)
  'frozen-01': 25400, // 점보도시락 8인분 (검색 8위)
  'fruit-02': 22800, // 고창 명품 흑수박 (검색 9위)
  'snack-shrimp-01': 19500, // 농심 쌀새우깡 (검색 10위)
  'ramen-shrimp-01': 17800, // 새우탕 큰사발면 (검색 11위)
  'bakery-01': 16500, // 연세우유 생크림빵 (검색 12위)
};

/**
 * Returns the search influx count for a product (how many times users searched and entered/viewed it).
 */
export const getSearchInfluxCount = (product: Product): number => {
  if (typeof product.searchInfluxCount === 'number' && product.searchInfluxCount > 0) {
    return product.searchInfluxCount;
  }

  if (BASELINE_SEARCH_INFLUX_MAP[product.id]) {
    return BASELINE_SEARCH_INFLUX_MAP[product.id];
  }

  // Deterministic calculation for any newly crawled or other products
  const base = Math.round(
    (product.ratingCount || 50) * 16 +
    (product.overallRating || 4.2) * 150 +
    (product.isHot ? 2500 : 0) +
    (product.isToday ? 1500 : 0) +
    (product.repurchasePercent || 70) * 20
  );
  return Math.max(1200, base);
};

/**
 * Formats a search count into a human-readable Korean string (e.g. 5.8만, 9,420회).
 */
export const formatSearchCount = (count: number): string => {
  if (count >= 10000) {
    const val = count / 10000;
    return `${val >= 10 ? Math.floor(val) : val.toFixed(1)}만`;
  }
  return `${count.toLocaleString()}회`;
};

/**
 * Returns products sorted by search influx popularity (how much people searched and entered).
 * Products with higher search influx count appear first.
 */
export const getSearchTrendingProducts = (products: Product[], limit?: number): Product[] => {
  const sorted = [...products].sort((a, b) => {
    return getSearchInfluxCount(b) - getSearchInfluxCount(a);
  });
  return limit ? sorted.slice(0, limit) : sorted;
};

/**
 * Calculates a community post's popularity score using a time-decay algorithm:
 * Score = (Likes * 3 + Comments * 2 + 1) / ((hoursSinceCreated + 2) ^ 1.5)
 * This prevents stale posts from remaining at #1 indefinitely.
 */
export const calculatePostPopularity = (post: CommunityPost): number => {
  const likes = post.likes || 0;
  const comments = post.commentsCount || post.comments?.length || 0;
  const hours = getHoursSinceCreated(post.createdAt);

  const engagementScore = (likes * 3) + (comments * 2) + 1;
  const gravity = 1.5;
  const timeDecay = Math.pow(hours + 2, gravity);

  return engagementScore / timeDecay;
};

/**
 * Returns community posts sorted by real-time popularity ranking.
 */
export const getPopularCommunityPosts = (posts: CommunityPost[], limit?: number): CommunityPost[] => {
  const sorted = [...posts].sort((a, b) => {
    return calculatePostPopularity(b) - calculatePostPopularity(a);
  });
  return limit ? sorted.slice(0, limit) : sorted;
};
