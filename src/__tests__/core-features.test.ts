import { describe, it, expect, beforeEach } from 'vitest';
import { INITIAL_PRODUCTS } from '../data/mockProducts';
import { calculateReviewScore, getCategoryReviewRankedProducts, getPopularProducts, isRealNewProduct } from '../utils/ranking';
import { getProductCode, findProductByCodeOrId } from '../utils/productCode';
import { safeJsonParse, safeLocalStorageGet, safeLocalStorageSet, sanitizeInput } from '../utils/safeStorage';
import { Product, Review } from '../types';

describe('User Flow 2 & 3: Core Features (홈 탐색 → 상품 상세 → 검색 → 북마크 → 비교하기 → 리뷰)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('1. 상품 검색 & 필터 (Search Flow)', () => {
    const searchProducts = (query: string, list: Product[]): Product[] => {
      if (!query || typeof query !== 'string') return [];
      const clean = query.trim().toLowerCase();
      if (!clean) return [];

      return list.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(clean);
        const brandMatch = p.brand?.toLowerCase().includes(clean);
        const catMatch = p.category?.toLowerCase().includes(clean);
        const tagMatch = p.tags?.some((t) => t.toLowerCase().includes(clean));
        return nameMatch || brandMatch || catMatch || tagMatch;
      });
    };

    it('[정상] 일반 키워드 검색 (상품명, 브랜드, 카테고리)', () => {
      const results = searchProducts('과자', INITIAL_PRODUCTS);
      expect(results.length).toBeGreaterThan(0);
    });

    it('[엣지] 빈 검색어, 공백만 입력 시 빈 결과 반환 (크래시 없음)', () => {
      expect(searchProducts('', INITIAL_PRODUCTS)).toEqual([]);
      expect(searchProducts('     ', INITIAL_PRODUCTS)).toEqual([]);
    });

    it('[엣지] 10,000자 초장문 검색어 입력 시 크래시 없이 안전 처리', () => {
      const ultraLongQuery = '맛있는 신상품 '.repeat(2000);
      const results = searchProducts(ultraLongQuery, INITIAL_PRODUCTS);
      expect(results).toEqual([]);
    });

    it('[엣지] 특수문자 및 정규식 메타문자 검색 (*, +, ?, (, ), [, ], {, }, ^, $, |)', () => {
      const regexSpam = '.*+?^${}()|[]\\';
      expect(() => searchProducts(regexSpam, INITIAL_PRODUCTS)).not.toThrow();
      expect(searchProducts(regexSpam, INITIAL_PRODUCTS)).toEqual([]);
    });

    it('[엣지] 이모지 검색 (🍕, 🔥, 🍫, 🥤)', () => {
      expect(() => searchProducts('🍕🔥🍫', INITIAL_PRODUCTS)).not.toThrow();
    });

    it('[엣지] 최근 검색어 저장/삭제/전체삭제 시 로컬스토리지 정합성', () => {
      const recentKey = 'sinsangpick_recent_searches';
      const searches = ['먹태깡', '두바이초콜릿', '제로콜라'];
      safeLocalStorageSet(recentKey, searches);

      const retrieved = safeLocalStorageGet<string[]>(recentKey, []);
      expect(retrieved).toEqual(searches);

      // Remove one item
      const updated = retrieved.filter((s) => s !== '먹태깡');
      safeLocalStorageSet(recentKey, updated);
      expect(safeLocalStorageGet<string[]>(recentKey, [])).toEqual(['두바이초콜릿', '제로콜라']);

      // Clear all
      safeLocalStorageSet(recentKey, []);
      expect(safeLocalStorageGet<string[]>(recentKey, [])).toEqual([]);
    });
  });

  describe('2. 상품 상세 & 상품 코드 조회 (Product Detail & Deep Link)', () => {
    it('[정상] 유효한 ID 및 상품 코드로 상품 조회', () => {
      const prod = INITIAL_PRODUCTS[0];
      const code = getProductCode(prod);
      expect(code).toBeDefined();

      const foundByCode = findProductByCodeOrId(INITIAL_PRODUCTS, code);
      expect(foundByCode?.id).toBe(prod.id);

      const foundById = findProductByCodeOrId(INITIAL_PRODUCTS, prod.id);
      expect(foundById?.id).toBe(prod.id);
    });

    it('[엣지] 존재하지 않는 상품 ID 또는 null/undefined 조회 시 크래시 방어', () => {
      expect(findProductByCodeOrId(INITIAL_PRODUCTS, 'non_existent_id_99999')).toBeUndefined();
      expect(findProductByCodeOrId([], 'any_id')).toBeUndefined();
      expect(findProductByCodeOrId(INITIAL_PRODUCTS, '')).toBeUndefined();
    });

    it('[엣지] 영양성분 데이터가 null/undefined인 신선식품/농수산물 처리', () => {
      const freshProd: Product = {
        ...INITIAL_PRODUCTS[0],
        itemType: 'fresh',
        category: '과일',
        nutrition: undefined,
        freshMetrics: {
          sweetness: 9,
          freshness: 10,
          texture: 8,
          value: 9,
        },
      };

      const scoreResult = calculateReviewScore(freshProd, []);
      expect(scoreResult.reviewScore).toBeGreaterThan(0);
      expect(Number.isNaN(scoreResult.reviewScore)).toBe(false);
    });
  });

  describe('3. 북마크 & 비교함 (Bookmark & Compare Tray)', () => {
    it('[정상] 북마크 추가 및 토글 해제', () => {
      const key = 'sinsangpick_bookmarks';
      let bookmarks: string[] = [];

      // Add
      bookmarks.push('prod-1');
      safeLocalStorageSet(key, bookmarks);
      expect(safeLocalStorageGet<string[]>(key, [])).toContain('prod-1');

      // Toggle off
      bookmarks = bookmarks.filter((id) => id !== 'prod-1');
      safeLocalStorageSet(key, bookmarks);
      expect(safeLocalStorageGet<string[]>(key, [])).not.toContain('prod-1');
    });

    it('[엣지] 북마크 중복 연타(Rapid Double Click) 시 중복 ID 삽입 방어', () => {
      let bookmarks: string[] = [];
      const toggle = (id: string) => {
        if (bookmarks.includes(id)) {
          bookmarks = bookmarks.filter((b) => b !== id);
        } else {
          bookmarks = Array.from(new Set([...bookmarks, id]));
        }
      };

      toggle('prod-1');
      toggle('prod-1'); // Rapid toggle off
      expect(bookmarks).toEqual([]);

      toggle('prod-1');
      toggle('prod-2');
      toggle('prod-1'); // Toggle off prod-1
      expect(bookmarks).toEqual(['prod-2']);
    });

    it('[엣지] 비교함 최대 개수(최대 3개) 제한 및 0개일 때 크래시 없음', () => {
      let compared: string[] = [];
      const addCompare = (id: string) => {
        if (compared.includes(id)) return;
        if (compared.length >= 3) {
          compared = [compared[1], compared[2], id]; // Shift oldest
        } else {
          compared = [...compared, id];
        }
      };

      addCompare('p1');
      addCompare('p2');
      addCompare('p3');
      addCompare('p4');
      expect(compared).toEqual(['p2', 'p3', 'p4']);
      expect(compared.length).toBe(3);
    });
  });

  describe('4. 리뷰 작성 및 랭킹 산출 (Review & Scoring Flow)', () => {
    it('[정상] 리뷰 평점 및 가중치 점수 산출', () => {
      const prod = INITIAL_PRODUCTS[0];
      const mockReviews: Review[] = [
        {
          id: 'rev-1',
          productId: prod.id,
          productName: prod.name,
          userId: 'user-1',
          userName: '신상러버',
          userAvatar: '',
          userLevel: 'Lv.2',
          rating: 5,
          detailedRating: { taste: 5, value: 4, portion: 5, repurchase: 5 },
          content: '너무 맛있어요!',
          images: [],
          tags: ['#맛도리', '#바삭함'],
          likes: 3,
          isLiked: false,
          commentsCount: 1,
          comments: [],
          createdAt: '2026-09-20',
        },
      ];

      const res = calculateReviewScore(prod, mockReviews);
      expect(res.reviewScore).toBeGreaterThan(0);
      expect(res.effectiveRating).toBeGreaterThanOrEqual(1);
      expect(res.effectiveRating).toBeLessThanOrEqual(5);
      expect(res.topKeyword).toBe('맛도리');
    });

    it('[엣지] 리뷰 0개 및 평점 null 상품의 안전한 랭킹 계산 (0으로 나누기 방어)', () => {
      const emptyProd: Product = {
        ...INITIAL_PRODUCTS[0],
        overallRating: 0,
        reviewCount: 0,
        detailedRating: undefined,
        freshMetrics: undefined,
      };

      const res = calculateReviewScore(emptyProd, []);
      expect(res.reviewScore).toBeGreaterThanOrEqual(0);
      expect(Number.isNaN(res.reviewScore)).toBe(false);
      expect(Number.isFinite(res.reviewScore)).toBe(true);
    });

    it('[신제품] 출시 7일 이내 상품만 오늘신상으로 선별하고 농수산물은 제외', () => {
      const base = INITIAL_PRODUCTS.find(p => p.category === '과자') || INITIAL_PRODUCTS[0];
      const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
      const make = (id: string, extra: Partial<Product>): Product => ({
        ...base, id, category: '과자', itemType: 'packaged', produceDetails: undefined, isToday: true, releaseDate: '', createdAt: undefined, ...extra,
      });

      const fresh = make('t-fresh', { createdAt: daysAgo(2) });
      const expired = make('t-expired', { createdAt: daysAgo(9) });
      const undated = make('t-undated', {});
      const switchedOff = make('t-off', { createdAt: daysAgo(1), isToday: false });
      const oldMonth = make('t-old-month', { createdAt: daysAgo(1), releaseDate: '2020.01 신메뉴' });
      const fruit = make('t-fruit', { createdAt: daysAgo(1), category: '과일' });

      expect(isRealNewProduct(fresh)).toBe(true);
      expect(isRealNewProduct(expired)).toBe(false);
      expect(isRealNewProduct(undated)).toBe(false);
      expect(isRealNewProduct(switchedOff)).toBe(false);
      expect(isRealNewProduct(oldMonth)).toBe(false);
      expect(isRealNewProduct(fruit)).toBe(false);

      const newer = make('t-newer', { createdAt: daysAgo(0) });
      const list = [expired, fresh, undated, newer, fruit];
      const rankedNew = getCategoryReviewRankedProducts(list, [], '신제품');
      expect(rankedNew.map(item => item.product.id)).toEqual(['t-newer', 't-fresh']);
      // 순서는 호출할 때마다 동일해야 함 (랜덤 셔플 없음)
      expect(getCategoryReviewRankedProducts(list, [], '신제품').map(item => item.product.id)).toEqual(['t-newer', 't-fresh']);
    });
  });
});
