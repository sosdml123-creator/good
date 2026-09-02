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
