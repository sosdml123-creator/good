import { describe, it, expect, beforeEach } from 'vitest';
import { safeJsonParse, safeLocalStorageGet, safeLocalStorageSet, safeLocalStorageRemove, sanitizeInput } from '../utils/safeStorage';
import { formatPrice, formatCount, formatRating } from '../utils/formatters';
import { getProductIllustration, isAgriMarineProduct } from '../utils/productIllustrations';
import { INITIAL_PRODUCTS } from '../data/mockProducts';
import { calculateReviewScore, getCategoryReviewRankedProducts } from '../utils/ranking';
import { Product } from '../types';

describe('Crash Resilience & Edge Case Defensive Auditing (예외/Null/깨진 데이터 방어 검증)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('1. safeJsonParse & safeLocalStorage', () => {
    it('[방어] 완전히 깨진 JSON 문자열 파싱 시 폴백 반환', () => {
      const fallback = { status: 'default' };
      expect(safeJsonParse('{bad_json: true,', fallback)).toEqual(fallback);
      expect(safeJsonParse('undefined', fallback)).toEqual(fallback);
      expect(safeJsonParse('', fallback)).toEqual(fallback);
      expect(safeJsonParse(null, fallback)).toEqual(fallback);
      expect(safeJsonParse(undefined, fallback)).toEqual(fallback);
    });

    it('[방어] 유효한 JSON 문자열은 정상 파싱', () => {
      const data = { id: 'test-1', count: 42, valid: true };
      const raw = JSON.stringify(data);
      expect(safeJsonParse(raw, {})).toEqual(data);
    });

    it('[방어] localStorage 예외 상황(QuotaExceeded / SecurityError) 시에도 크래시 없이 false 반환', () => {
      expect(safeLocalStorageSet('test_key', 'test_value')).toBe(true);
      expect(safeLocalStorageGet('test_key', '')).toBe('test_value');
      expect(safeLocalStorageRemove('test_key')).toBe(true);
    });
  });

  describe('2. sanitizeInput', () => {
    it('[방어] null/undefined/비문자열 입력 시 빈 문자열 반환', () => {
      expect(sanitizeInput(null as any)).toBe('');
      expect(sanitizeInput(undefined as any)).toBe('');
      expect(sanitizeInput(12345 as any)).toBe('');
    });

    it('[방어] 최대 길이 제한(maxLength) 및 앞뒤 공백 제거', () => {
      const input = '   안녕하세요 신상픽입니다   ';
      expect(sanitizeInput(input, 5)).toBe('안녕하세요');
    });
  });

  describe('3. formatters (formatPrice, formatCount, formatRating)', () => {
    it('[방어] NaN, null, undefined, 음수 값에 대한 안전한 가격 포맷', () => {
      expect(formatPrice(1000)).toBe('1,000원');
      expect(formatPrice(NaN as any)).toBe('0원');
      expect(formatPrice(undefined as any)).toBe('0원');
      expect(formatPrice(null as any)).toBe('0원');
    });

    it('[방어] NaN, null, undefined 값에 대한 안전한 평점 포맷', () => {
      expect(formatRating(4.55)).toBe('4.5');
      expect(formatRating(NaN as any)).toBe('0.0');
      expect(formatRating(null as any)).toBe('0.0');
    });

    it('[방어] 대규모 카운트 포맷 (천, 만 단위 변환 및 NaN 방어)', () => {
      expect(formatCount(950)).toBe('950');
      expect(formatCount(3500)).toBe('3.5천');
      expect(formatCount(25000)).toBe('2.5만');
      expect(formatCount(NaN as any)).toBe('0');
    });
  });

  describe('4. productIllustrations & 농수산물 감지 방어', () => {
    it('[방어] null 또는 빈 product 객체 전달 시 기본 일러스트 반환', () => {
      expect(isAgriMarineProduct(null as any)).toBe(false);
      expect(isAgriMarineProduct(undefined as any)).toBe(false);

      const illustration = getProductIllustration(null as any);
      expect(typeof illustration).toBe('string');
      expect(illustration.length).toBeGreaterThan(0);
    });

    it('[방어] 카테고리가 과일/농수산물인 상품 판별', () => {
      const fruitProduct: Partial<Product> = {
        name: '제주 고당도 하우스 감귤',
        category: '과일',
        itemType: 'fresh',
      };
      expect(isAgriMarineProduct(fruitProduct as Product)).toBe(true);
    });
  });

  describe('5. 랭킹 계산 알고리즘 NaN 및 제로 디비전 방어', () => {
    it('[방어] 상품의 모든 수치(rating, reviews, freshMetrics)가 누락되거나 0일 때도 정상 점수 산출', () => {
      const brokenProduct: Product = {
        id: 'broken-1',
        name: '비정상 상품',
        brand: '테스트',
        category: '스낵',
        price: 0,
        originalPrice: 0,
        image: '',
        releaseDate: '2026-09-20',
        overallRating: 0,
        reviewCount: 0,
        tags: [],
        repurchasePercent: 0,
        isHot: false,
        isToday: false,
      };

      const result = calculateReviewScore(brokenProduct, []);
      expect(result.reviewScore).toBeGreaterThanOrEqual(0);
      expect(Number.isNaN(result.reviewScore)).toBe(false);
      expect(Number.isFinite(result.reviewScore)).toBe(true);
    });

    it('[방어] 카테고리별 랭킹 정렬 시 크래시 없이 배열 반환', () => {
      const ranked = getCategoryReviewRankedProducts(INITIAL_PRODUCTS, [], '전체');
      expect(ranked.length).toBe(INITIAL_PRODUCTS.length);
      expect(ranked[0].reviewScore).toBeGreaterThanOrEqual(ranked[ranked.length - 1].reviewScore);
    });
  });
});
