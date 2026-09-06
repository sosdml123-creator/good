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
  requestedDate?: string
): Promise<PendingProduct[]> => {
  const dateStr = requestedDate || new Date().toISOString().split('T')[0];

  // 1. 네이버 공식 API 실시간 수집 시도
  try {
    const realProducts = await fetchDailyRealNewProducts();
    if (realProducts && realProducts.length > 0) {
      return realProducts;
    }
  } catch (err) {
    console.warn('네이버 실시간 신제품 수집 실패, 내부 DB 폴백 사용:', err);
  }

  // 2. 내부 데이터베이스 기반 안전 폴백
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);
  
  const totalItems = REAL_NEW_PRODUCTS_DATABASE.length;
  const countToPick = 4 + (positiveHash % 3);
  const startIndex = positiveHash % totalItems;
  
  const pickedItems: PendingProduct[] = [];
  for (let i = 0; i < countToPick; i++) {
    const raw = REAL_NEW_PRODUCTS_DATABASE[(startIndex + i) % totalItems];
    const timestamp = Date.now() + i * 1000;
    
    pickedItems.push({
      ...raw,
      id: `pending-${dateStr}-${i + 1}-${timestamp}`,
      crawledAt: `${dateStr} ${new Date().toLocaleTimeString('ko-KR', { hour12: false })}`,
      status: 'pending',
    });
  }

  return pickedItems;
};

/**
 * 실시간 검색 및 크롤링 (키워드/편의점명/제조사 검색)
 * 1. 네이버 공식 뉴스 + 실물 패키지 컷 + 소비자 리뷰 실시간 검색
 * 2. 매칭 결과가 없을 경우 내부 DB 검색 폴백
 */
export const searchAndCrawlNewProducts = async (query: string): Promise<PendingProduct[]> => {
  const cleanQ = query.trim();
  if (!cleanQ) return [];

  // 1. 네이버 공식 API 실시간 검색 수집
  try {
    const realResults = await searchRealNewProducts(cleanQ);
    if (realResults && realResults.length > 0) {
      return realResults;
    }
  } catch (err) {
    console.warn('네이버 실시간 검색 수집 실패, 내부 DB 폴백 사용:', err);
  }

  // 2. 내부 실제 신제품 DB에서 매칭되는 항목 찾기 (폴백)
  const lowerQ = cleanQ.toLowerCase();
  const matchedFromDB = REAL_NEW_PRODUCTS_DATABASE.filter(item => 
    item.name.toLowerCase().includes(lowerQ) ||
    item.brand.toLowerCase().includes(lowerQ) ||
    item.category.toLowerCase().includes(lowerQ) ||
    item.stores.some(s => s.toLowerCase().includes(lowerQ)) ||
    (item.subCategory && item.subCategory.toLowerCase().includes(lowerQ)) ||
    (item.description && item.description.toLowerCase().includes(lowerQ))
  );

  const dateStr = new Date().toISOString().split('T')[0];
  const nowTime = new Date().toLocaleTimeString('ko-KR', { hour12: false });
  const results: PendingProduct[] = [];

  matchedFromDB.forEach((item, idx) => {
    results.push({
      ...item,
      id: `pending-search-${Date.now()}-${idx}`,
      crawledAt: `${dateStr} ${nowTime}`,
      status: 'pending',
    });
  });

  return results;
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
