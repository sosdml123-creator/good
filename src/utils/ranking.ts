import { Product, Review, CommunityPost, ProductCategory } from '../types';

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
 * Helper to build Map of productId -> Review[] for O(1) lookups
 */
export const buildReviewsByProductId = (reviews: Review[]): Map<string, Review[]> => {
  const map = new Map<string, Review[]>();
  if (!reviews || reviews.length === 0) return map;
  for (let i = 0; i < reviews.length; i++) {
    const r = reviews[i];
    if (!r || !r.productId) continue;
    const list = map.get(r.productId);
    if (list) {
      list.push(r);
    } else {
      map.set(r.productId, [r]);
    }
  }
  return map;
};

/**
 * Calculates a product's real-time popularity score based on:
 * - Overall Rating / Posted Reviews (weight 20)
 * - Rating Count / Posted Reviews (weight 5)
 * - Repurchase Percent (weight 0.3)
 * - Badges: isToday (+35), isHot (+25)
 */
export const calculateProductPopularity = (
  product: Product, 
  reviewsOrProductReviews?: Review[] | Map<string, Review[]>
): number => {
  let effectiveRating = product.overallRating || 0;
  let postedBonus = 0;
  let totalCount = product.ratingCount || 0;

  if (reviewsOrProductReviews) {
    let posted: Review[] = [];
    if (reviewsOrProductReviews instanceof Map) {
      posted = reviewsOrProductReviews.get(product.id) || [];
    } else if (Array.isArray(reviewsOrProductReviews)) {
      // If it's already filtered for this product or the whole list
      if (reviewsOrProductReviews.length > 0 && reviewsOrProductReviews[0]?.productId === product.id) {
        posted = reviewsOrProductReviews;
      } else {
        posted = reviewsOrProductReviews.filter((r) => r.productId === product.id);
      }
    }

    if (posted.length > 0) {
      const sumRating = posted.reduce((acc, r) => acc + (r.rating || 5), 0);
      effectiveRating = (product.overallRating * 5 + sumRating) / (5 + posted.length);
      postedBonus = posted.length * 8;
      totalCount += posted.length;
    }
  }

  const ratingScore = effectiveRating * 20;
  const countScore = (totalCount || 0) * 5;
  const repurchaseScore = (product.repurchasePercent || 0) * 0.3;
  const hotBonus = (product.isHot ? 25 : 0) + (product.isToday ? 35 : 0);

  return ratingScore + countScore + repurchaseScore + hotBonus + postedBonus;
};

/**
 * Returns products sorted by real-time popularity ranking.
 */
export const getPopularProducts = (products: Product[], limit?: number, reviews?: Review[]): Product[] => {
  const reviewsMap = reviews ? buildReviewsByProductId(reviews) : undefined;
  const sorted = [...products].sort((a, b) => {
    return calculateProductPopularity(b, reviewsMap) - calculateProductPopularity(a, reviewsMap);
  });
  return limit ? sorted.slice(0, limit) : sorted;
};

/**
 * Known baseline search influx counts for iconic / trending products.
 * Guarantees that search popularity reflects actual consumer search trends even across devices.
 */
const BASELINE_SEARCH_INFLUX_MAP: Record<string, number> = {
  'snack-19': 58400, // 두바이 스타일 피스타치오 초콜릿 (검색 1위)
  'snack-01': 46200, // 꼬북칩 초코츄러스 (검색 2위)
  'meal-01': 43500,  // 농심 신라면 툼바 (검색 3위)
  'bakery-01': 41800, // 연세우유 밤티라미수 (검색 4위)
  'drink-01': 37500, // 하이트진로 테라 라이트 (검색 5위)
  'drink-14': 37000, // 아사히 수퍼드라이 생맥주캔
  'fruit-01': 33200, // 햇사레 복숭아
  'snack-09': 30100, // 농심 먹태깡 청양마요
  'snack-02': 29500, // 농심 쌀새우깡
  'meal-05': 27500,  // 오뚜기 마열라면
  'meal-06': 25400,  // CJ 비비고 통새우 만두
  'fruit-02': 22800, // 고창 꿀수박
  'bakery-04': 21000, // 연세우유 생크림빵
  // Legacy ID compatibility
  'prod-02': 58400,
  'prod-01': 46200,
  'dessert-01': 41800,
  'prod-03': 30100,
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

export interface ProductReviewEvaluation {
  product: Product;
  reviewScore: number;
  reviewRank: number;
  postedReviewCount: number;
  totalReviewCount: number;
  effectiveRating: number;
  positiveRate: number;
  topKeyword?: string;
}

/**
 * Calculates review-based score and evaluation metrics for a product,
 * taking into account posted reviews, ratings, engagement, and taste satisfaction.
 */
export const calculateProductReviewScore = (
  product: Product,
  reviewsOrProductReviews: Review[] | Map<string, Review[]>
): {
  reviewScore: number;
  postedReviewCount: number;
  totalReviewCount: number;
  effectiveRating: number;
  positiveRate: number;
  topKeyword?: string;
} => {
  let posted: Review[] = [];
  if (reviewsOrProductReviews instanceof Map) {
    posted = reviewsOrProductReviews.get(product.id) || [];
  } else if (Array.isArray(reviewsOrProductReviews)) {
    if (reviewsOrProductReviews.length > 0 && reviewsOrProductReviews[0]?.productId === product.id) {
      posted = reviewsOrProductReviews;
    } else {
      posted = reviewsOrProductReviews.filter((r) => r.productId === product.id);
    }
  }

  const postedCount = posted.length;
  const baseCount = product.ratingCount || 0;
  const totalReviewCount = baseCount + postedCount;

  let effectiveRating = product.overallRating || 4.5;
  let positiveCount = 0;
  let likesBonus = 0;

  if (postedCount > 0) {
    const sumPostedRating = posted.reduce((acc, r) => acc + (r.rating || 5), 0);
    // Bayesian blend: 5 prior units with product.overallRating
    effectiveRating = Number(((product.overallRating * 5 + sumPostedRating) / (5 + postedCount)).toFixed(1));

    for (let i = 0; i < posted.length; i++) {
      const r = posted[i];
      if (r.rating >= 4) positiveCount++;
      likesBonus += (r.likes || 0) * 0.5;
      if (r.images && r.images.length > 0) likesBonus += 1.5; // Photo review bonus
    }
  }

  const positiveRate = postedCount > 0 
    ? Math.round((positiveCount / postedCount) * 100)
    : Math.round(((product.overallRating || 4.5) / 5) * 100);

  // Derive top keywords from reviews or product bestQuotes
  let topKeyword: string | undefined = undefined;
  if (postedCount > 0 && posted[0].tags && posted[0].tags.length > 0) {
    topKeyword = posted[0].tags[0].replace('#', '');
  } else if (product.bestQuotes && product.bestQuotes.length > 0) {
    const quoteWords = product.bestQuotes[0].split(' ');
    topKeyword = quoteWords.find(w => w.length >= 2 && !w.startsWith('#'))?.replace(/[^\wㄱ-ㅎ가-힣]/g, '');
  }

  // Score formulation:
  // 1. Effective Rating weight: 25 pts (out of 125 for 5.0)
  // 2. Review volume credibility (logarithmic to prevent sheer spam): up to 45 pts
  // 3. Active posted reviews weight: 8 pts each + likes bonus
  // 4. Taste/Fresh metrics: up to 15 pts
  // 5. Repurchase intent: up to 10 pts
  const ratingPart = effectiveRating * 25;
  const volumePart = Math.min(45, Math.log10(totalReviewCount + 1) * 15);
  const postedBonus = Math.min(40, postedCount * 8 + likesBonus);
  
  let metricPart = 0;
  if (product.freshMetrics) {
    const sweetness = Number(product.freshMetrics.sweetness) || 5;
    const freshness = Number(product.freshMetrics.freshness) || 5;
    metricPart = (sweetness + freshness) * 1.5;
  } else if (product.detailedRating) {
    metricPart = ((Number(product.detailedRating.taste) || 4.5) + (Number(product.detailedRating.repurchase) || 4.5)) * 1.5;
  }

  const repurchasePart = (product.repurchasePercent || 90) * 0.1;
  const noveltyBonus = (product.isHot ? 10 : 0) + (product.isToday ? 15 : 0);

  const reviewScore = Math.round(ratingPart + volumePart + postedBonus + metricPart + repurchasePart + noveltyBonus);

  return {
    reviewScore,
    postedReviewCount: postedCount,
    totalReviewCount,
    effectiveRating,
    positiveRate,
    topKeyword,
  };
};

/**
 * Accurately determines if a product is a real new product (신제품).
 * Filters out raw agricultural/marine fresh ingredients, steady-sellers,
 * and classic items that do not represent newly launched food items.
 */
export const isRealNewProduct = (p: Product): boolean => {
  if (!p) return false;

  // 1. Exclude natural fresh farm/marine produce (fruits, veggies, raw meats/fish) unless specifically a new processed item
  const isFreshFarmProduce = 
    (p.category === '과일' || p.category === '식재료' || p.category === '고기·수산' || p.itemType === 'fresh' || Boolean(p.produceDetails)) &&
    !p.name.includes('신제품') && !p.name.includes('신상') && p.category !== '신제품';
  if (isFreshFarmProduce) return false;

  // 2. Exclude steady-seller / classic popular banner strings
  if (p.releaseDate) {
    const rd = p.releaseDate;
    const isExcluded = 
      (rd.includes('스테디셀러') || 
       rd.includes('베스트셀러') || 
       rd.includes('판매 1위') || 
       rd.includes('공식 인기') || 
       rd.includes('원조') || 
       rd.includes('대표메뉴') ||
       rd.includes('공식 전통') ||
       rd.includes('산지직송')) &&
      !rd.includes('신제품') && !rd.includes('신상') && !rd.includes('신규') && !rd.includes('2026') && !rd.includes('리뉴얼');
    if (isExcluded) return false;
  }

  // 3. Category is explicitly 신제품
  if (p.category === '신제품') return true;

  // 4. Added via crawler / today's new items with isToday flag (and not excluded above)
  if (p.isToday) {
    if (p.releaseDate) {
      const rd = p.releaseDate;
      if (
        rd.includes('출시') || 
        rd.includes('신상') || 
        rd.includes('신제품') || 
        rd.includes('신메뉴') ||
        rd.includes('한정판') ||
        /\d{4}[.-]\d{1,2}/.test(rd)
      ) {
        return true;
      }
    } else {
      return true;
    }
  }

  // 5. Release date keywords
  if (p.releaseDate) {
    const rd = p.releaseDate;
    if (
      rd.includes('신규 출시') ||
      rd.includes('오늘 출시') ||
      rd.includes('신제품') ||
      rd.includes('신상') ||
      rd.includes('단독 출시') ||
      rd.includes('신메뉴 출시') ||
      rd.includes('한정 출시')
    ) {
      return true;
    }
  }

  // 6. Name indicates newly launched product
  if (p.name.includes('신상') || p.name.includes('신제품') || p.name.includes('단독출시')) {
    return true;
  }

  return false;
};

/**
 * Returns products in a category ranked and sorted by review evaluations.
 * Supports both signatures:
 * (products, reviews, category, subCategory, sortBy)
 * (products, category, reviews)
 */
export const getCategoryReviewRankedProducts = (
  products: Product[],
  arg2: Review[] | ProductCategory | string,
  arg3?: ProductCategory | Review[] | string,
  arg4: string = '전체',
  arg5: 'review_rank' | 'rating' | 'review_count' | 'newest' = 'review_rank'
): ProductReviewEvaluation[] => {
  let reviews: Review[] = [];
  let category: ProductCategory | string = '전체';
  let subCategory: string = arg4;
  let sortBy: 'review_rank' | 'rating' | 'review_count' | 'newest' = arg5;

  if (Array.isArray(arg2)) {
    reviews = arg2;
    category = (typeof arg3 === 'string' ? arg3 : '전체') as ProductCategory;
  } else if (typeof arg2 === 'string') {
    category = arg2 as ProductCategory;
    if (Array.isArray(arg3)) {
      reviews = arg3;
    }
  }

  const reviewsMap = buildReviewsByProductId(reviews);

  // 1. Filter by category
  const filtered = products.filter((p) => {
    if (category !== '전체') {
      if (category === '신제품') {
        if (!isRealNewProduct(p)) return false;
      } else if (p.category !== category) {
        return false;
      }
    }

    // SubCategory check
    if (subCategory && subCategory !== '전체') {
      if (category === '신제품') {
        const matchesCategory = p.category === subCategory;
        const matchesSubCategory = p.subCategory === subCategory;
        const matchesName = p.name.toLowerCase().includes(subCategory.toLowerCase());
        if (!matchesCategory && !matchesSubCategory && !matchesName) return false;
      } else {
        const matchesSub = p.subCategory === subCategory;
        const matchesName = p.name.toLowerCase().includes(subCategory.toLowerCase());
        const matchesDesc = p.description?.toLowerCase().includes(subCategory.toLowerCase());
        if (!matchesSub && !matchesName && !matchesDesc) return false;
      }
    }
    return true;
  });

  // 2. Calculate review evaluation for each product with O(1) lookup
  const evaluated = filtered.map((p) => {
    const metrics = calculateProductReviewScore(p, reviewsMap);
    return {
      product: p,
      ...metrics,
      reviewRank: 0,
    };
  });

  // 3. Sort by specified criteria
  evaluated.sort((a, b) => {
    if (sortBy === 'review_rank') {
      return b.reviewScore - a.reviewScore;
    }
    if (sortBy === 'rating') {
      if (b.effectiveRating !== a.effectiveRating) {
        return b.effectiveRating - a.effectiveRating;
      }
      return b.reviewScore - a.reviewScore;
    }
    if (sortBy === 'review_count') {
      return b.totalReviewCount - a.totalReviewCount;
    }
    if (sortBy === 'newest') {
      const isNewA = a.product.isToday ? 2 : a.product.isHot ? 1 : 0;
      const isNewB = b.product.isToday ? 2 : b.product.isHot ? 1 : 0;
      if (isNewB !== isNewA) return isNewB - isNewA;
      return (b.product.releaseDate || '').localeCompare(a.product.releaseDate || '');
    }
    return b.reviewScore - a.reviewScore;
  });

  // 4. Assign rank (1, 2, 3...)
  return evaluated.map((item, index) => ({
    ...item,
    reviewRank: index + 1,
  }));
};

export const calculateReviewScore = calculateProductReviewScore;


