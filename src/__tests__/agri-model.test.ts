import { describe, it, expect, beforeEach } from 'vitest';
import type { MarketPriceRow } from '../pc/useMarketPrices';
import {
  alertHit, buildItems, isChainStore, itemSpec, judgePrice, loadWatches, marketLabel, seafoodState, summarizeRegions,
} from '../components/agri/agriModel';

const row = (p: Partial<MarketPriceRow>): MarketPriceRow => ({
  key: 'k', category: '과일류', categoryCode: '400', itemCode: '411', kindCode: '05', rankCode: '04',
  itemName: '사과', kindName: '후지', rank: '상품', unit: '10개', today: 10000, dayAgo: 10000, weekAgo: null,
  monthAgo: null, yearAgo: null, normal: null, changeRate: 0, changeLabel: '전일 대비', ...p,
});

beforeEach(() => localStorage.clear());

describe('장보기 시세 모델', () => {
  it('같은 품목·품종·단위는 한 줄로 묶고 상품(또는 中) 등급을 대표로 쓴다', () => {
    const items = buildItems([
      row({ key: 'a', rank: '중품', today: 8000 }),
      row({ key: 'b', rank: '상품' }),
      row({ key: 'c', category: '수산물', itemCode: '611', itemName: '고등어', kindName: '국산(신선 냉장)', rank: '大', unit: '1마리' }),
      row({ key: 'd', category: '수산물', itemCode: '611', itemName: '고등어', kindName: '국산(신선 냉장)', rank: '中', unit: '1마리' }),
    ]);
    expect(items).toHaveLength(2);
    expect(items[0].rep.key).toBe('b');
    expect(items[1].rep.key).toBe('d');
    expect(itemSpec(items[1].rep)).toBe('국산 · 신선 냉장 · 크기 중');
    expect(seafoodState(items[1].rep)).toBe('선어(냉장)');
  });

  it('평년 → 1년 전 → 1개월 전 순으로 기준을 잡아 ±5% 밖이면 싸다/비싸다고 판단한다', () => {
    expect(judgePrice(row({ today: 9000, normal: 10000 }))?.tone).toBe('cheap');
    expect(judgePrice(row({ today: 10300, normal: 10000 }))?.tone).toBe('normal');
    const v = judgePrice(row({ today: 12000, yearAgo: 10000 }));
    expect(v?.baseLabel).toBe('1년 전');
    expect(v?.tone).toBe('pricey');
    expect(judgePrice(row({}))).toBeNull();
  });

  it('익명 유통업체와 전통시장을 나눠 지역별 평균을 낸다', () => {
    expect(isChainStore('E-유통')).toBe(true);
    expect(isChainStore('부전')).toBe(false);
    expect(marketLabel('B`-유통')).toBe('대형유통 B');
    expect(marketLabel('부전')).toBe('부전시장');
    const [seoul] = summarizeRegions([
      { region: '서울', market: '복조리', price: 4600 },
      { region: '서울', market: 'E-유통', price: 4000 },
      { region: '서울', market: 'C-유통', price: 3000 },
    ]);
    expect(seoul).toMatchObject({ traditional: 4600, chain: 3500, count: 3, min: 3000 });
  });

  it('관심 등록 때보다 내려가거나 목표가 이하일 때만 알린다', () => {
    const w = { key: 'b', savedPrice: 10000, savedAt: '', alertBelow: null, alertOn: true };
    expect(alertHit(w, row({ today: 9900 }))).toBe(true);
    expect(alertHit(w, row({ today: 10000 }))).toBe(false);
    expect(alertHit({ ...w, alertBelow: 9000 }, row({ today: 9500 }))).toBe(false);
    expect(alertHit({ ...w, alertOn: false }, row({ today: 1 }))).toBe(false);
  });

  it('이전 장보기 도우미의 관심 품목을 옮겨 온다', () => {
    localStorage.setItem('sinsangpick-market-favorites-v1', JSON.stringify(['a', 'b']));
    expect(loadWatches().map(w => w.key)).toEqual(['a', 'b']);
  });
});
