import { describe, it, expect } from 'vitest';
import { Product } from '../types';
import {
  buildFoodTrendBatches,
  buildFoodTrendKeyword,
  findMentionedProductIds,
  rankFoodTrendProducts,
  scoreFoodTrendSignals,
  selectFoodTrendCandidates,
} from '../utils/foodTrend';

const product = (overrides: Partial<Product>): Product => ({
  id: 'p1',
  name: '테스트',
  brand: '테스트',
  category: '과자',
  image: '',
  releaseDate: '',
  price: 1000,
  overallRating: 0,
  ratingCount: 0,
  detailedRating: {} as Product['detailedRating'],
  ...overrides,
});

describe('요즘 주목받는 먹거리 - 네이버 신호 순위', () => {
  it('제품명을 실제 검색 키워드로 정리한다', () => {
    expect(buildFoodTrendKeyword(product({ name: '농심 먹태깡 청양마요맛 (60g)', brand: '농심', itemType: 'packaged' })))
      .toEqual({ key: '농심 먹태깡 청양마요맛', alt: '먹태깡 청양마요맛' });
    expect(buildFoodTrendKeyword(product({ name: '[ICE] 큐브라떼', brand: '메가MGC커피', itemType: 'restaurant' })))
      .toEqual({ key: '메가커피 큐브라떼', alt: '' });
    expect(buildFoodTrendKeyword(product({ name: '스타벅스 바닐라 라떼', brand: '스타벅스', itemType: 'restaurant' })))
      .toEqual({ key: '스타벅스 바닐라 라떼', alt: '' });
    // 유통사 PB는 브랜드를 빼면 일반명사가 되므로 별칭을 만들지 않는다
    expect(buildFoodTrendKeyword(product({ name: '노브랜드 꼬치어묵', brand: '노브랜드', itemType: 'packaged' }))?.alt).toBe('');
  });

  it('후보와 요청 묶음은 같은 날 같은 제품이면 항상 동일하다', () => {
    const products = Array.from({ length: 200 }, (_, i) => product({ id: `p${i}`, name: `제품${i} 스낵`, brand: `브랜드${i % 47}`, isHot: i % 3 === 0 }));
    const first = selectFoodTrendCandidates(products, '2026-10-10');
    const second = selectFoodTrendCandidates([...products].reverse(), '2026-10-10');
    expect(first.size).toBe(60);
    expect(buildFoodTrendBatches([...first.values()])).toEqual(buildFoodTrendBatches([...second.values()]));
    expect(buildFoodTrendBatches([...first.values()]).every((batch) => batch.split('|').length <= 4)).toBe(true);
    // 날짜가 바뀌면 순환 후보가 달라진다
    const nextDay = selectFoodTrendCandidates(products, '2026-10-11');
    expect([...nextDay.keys()].sort()).not.toEqual([...first.keys()].sort());
  });

  it('네이버 최신 글에 언급된 등록 제품을 먼저 찾아 후보 맨 앞에 올린다', () => {
    const products = [
      ...Array.from({ length: 100 }, (_, i) => product({ id: `p${i}`, name: `제품${i} 스낵`, brand: `브랜드${i % 47}`, overallRating: 5, ratingCount: 10 })),
      product({ id: 'new-snack', name: '오리온 미쯔 황치즈', brand: '오리온', itemType: 'packaged' }),
      product({ id: 'new-menu', name: '스타벅스 블랙 글레이즈드 라떼', brand: '스타벅스', itemType: 'restaurant' }),
      product({ id: 'generic-menu', name: '컴포즈커피 바닐라 라떼', brand: '컴포즈커피', itemType: 'restaurant' }),
    ];
    const texts = [
      '편의점신상미쯔황치즈먹어본후기',
      '미쯔황치즈진짜맛있네요',
      '스타벅스신메뉴블랙글레이즈드라떼후기',
      '집에서만든바닐라라떼레시피', // 브랜드가 없으므로 컴포즈커피 메뉴로 보지 않는다
    ];
    expect(findMentionedProductIds(products, texts)).toEqual(['new-snack', 'new-menu']);

    const candidates = selectFoodTrendCandidates(products, '2026-10-10', ['new-snack', 'new-menu']);
    expect([...candidates.keys()].slice(0, 2)).toEqual(['new-snack', 'new-menu']);
    expect(candidates.size).toBe(60);
  });

  it('검색량·쇼핑·블로그·급상승을 종합해 순위를 매긴다', () => {
    const signals = {
      '조용한제품': { search: 0.01, momentum: 1, shopping: 0.01, blog: 0.5 },
      '꾸준한인기': { search: 1, momentum: 1, shopping: 0.8, blog: 30 },
      '급상승제품': { search: 1, momentum: 2.5, shopping: 0.8, blog: 30 },
    };
    const scores = scoreFoodTrendSignals(signals);
    expect(scores['급상승제품']).toBeGreaterThan(scores['꾸준한인기']);
    expect(scores['꾸준한인기']).toBeGreaterThan(scores['조용한제품']);

    const products = [
      product({ id: 'a', name: '조용한제품' }),
      product({ id: 'b', name: '꾸준한인기' }),
      product({ id: 'c', name: '급상승제품' }),
      product({ id: 'd', name: '신호없는제품' }),
    ];
    const candidates = selectFoodTrendCandidates(products, '2026-10-10');
    expect(rankFoodTrendProducts(products, candidates, signals).map((p) => p.id)).toEqual(['c', 'b', 'a']);
  });

  it('특정 신호가 통째로 빠져도(API 장애) 나머지 신호로 순위를 낸다', () => {
    const scores = scoreFoodTrendSignals({
      'A': { search: null, momentum: null, shopping: null, blog: 40 },
      'B': { search: null, momentum: null, shopping: null, blog: 2 },
    });
    expect(scores['A']).toBe(1);
    expect(scores['B']).toBeLessThan(scores['A']);
  });
});
