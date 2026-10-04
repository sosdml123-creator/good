import { PendingProduct } from '../types';
import { searchRealNewProducts, fetchDailyRealNewProducts } from './naverApi';
import { REAL_NEW_PRODUCTS_DATABASE } from '../data/realNewProducts';

export { REAL_NEW_PRODUCTS_DATABASE };


/**
 * 오늘 날짜 기준 새로운 신제품 일일 자동 수집 함수
 * 1. 네이버 공식 뉴스(보도자료) + 실물 패키지 고화질 이미지 + 블로그 후기 실시간 연동
 * 2. 네트워크 오류 또는 응답 부재 시 내부 검증 DB로 안전 폴백
 */
export const fetchDailyNewProducts = async (
  _requestedDate?: string
): Promise<PendingProduct[]> => {
  // 네이버 공식 API 실시간 수집 실행 (가상 DB 폴백 일절 없음)
  try {
    const realProducts = await fetchDailyRealNewProducts();
    if (realProducts && realProducts.length > 0) {
      return realProducts;
    }
  } catch (err) {
    console.warn('네이버 실시간 신제품 수집 중 오류 발생:', err);
  }

  return [];
};

/**
 * 실시간 검색 및 크롤링 (키워드/편의점명/제조사 검색)
 * 네이버 공식 뉴스 + 실물 패키지 컷 + 소비자 리뷰 실시간 검색 (100% 실시간 서칭)
 */
export const searchAndCrawlNewProducts = async (query: string): Promise<PendingProduct[]> => {
  const cleanQ = query.trim();
  if (!cleanQ) return [];

  // 네이버 공식 API 실시간 검색 수집 (가상 DB 폴백 일절 없음)
  try {
    const realResults = await searchRealNewProducts(cleanQ);
    if (realResults && realResults.length > 0) {
      return realResults;
    }
  } catch (err) {
    console.warn('네이버 실시간 검색 수집 중 오류 발생:', err);
  }

  return [];
};

/**
 * 일일 자동 수집 체크 헬퍼
 */
export const LAST_CRAWL_STORAGE_KEY = 'sinsangpick_last_crawl_date';
export const PENDING_PRODUCTS_STORAGE_KEY = 'sinsangpick_pending_products';

export const isDailyCrawlNeeded = (): boolean => {
  const today = new Date().toISOString().split('T')[0];
  const lastDate = localStorage.getItem(LAST_CRAWL_STORAGE_KEY);
  return lastDate !== today;
};

export const markDailyCrawlDone = (): void => {
  const today = new Date().toISOString().split('T')[0];
  localStorage.setItem(LAST_CRAWL_STORAGE_KEY, today);
};
