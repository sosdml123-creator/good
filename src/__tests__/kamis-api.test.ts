import { describe, it, expect } from 'vitest';
import { 
  parseKamisPrice, 
  mapToKamisPriceInfo, 
  matchProductToKamisPrice, 
  applyKamisPricesToProducts, 
  RawKamisItem 
} from '../services/kamisApi';
import { Product } from '../types';

describe('KAMIS API & Produce Price Fluctuation Service', () => {
  it('parseKamisPrice should properly extract integer prices and strip commas and special characters', () => {
    expect(parseKamisPrice('22,936')).toBe(22936);
    expect(parseKamisPrice('1,500원')).toBe(1500);
    expect(parseKamisPrice('-')).toBe(0);
    expect(parseKamisPrice('')).toBe(0);
    expect(parseKamisPrice(35000)).toBe(35000);
  });

  it('mapToKamisPriceInfo should calculate priceChange, changeRate, and trend accurately', () => {
    const rawApple: RawKamisItem = {
      item_name: '사과',
      item_code: '411',
      kind_name: '홍로(10개)',
      kind_code: '07',
      rank: '상품',
      unit: '10개',
      day1: '당일 (09/18)',
      dpr1: '22,936',
      day2: '1일전 (09/17)',
      dpr2: '23,120',
      day3: '1주일전 (09/11)',
      dpr3: '22,976',
      day5: '1개월전',
      dpr5: '30,232'
    };

    const info = mapToKamisPriceInfo(rawApple, '2026-09-18');
    expect(info.itemName).toBe('사과');
    expect(info.todayPrice).toBe(22936);
    expect(info.prevDayPrice).toBe(23120);
    expect(info.priceChange).toBe(-184);
    expect(info.changeRate).toBe(-0.8);
    expect(info.trend).toBe('down');
    expect(info.monthAgoPrice).toBe(30232);
    expect(info.monthAgoChangeRate).toBe(-24.1);
    expect(info.trends.length).toBeGreaterThanOrEqual(4);
    expect(info.trends[info.trends.length - 1].period).toBe('당일');
    expect(info.trends[0].period).toBe('1개월전');
  });

  it('matchProductToKamisPrice should match apple, beef, and seafood products to respective KAMIS items', () => {
    const kamisItems: RawKamisItem[] = [
      {
        item_name: '사과',
        item_code: '411',
        kind_name: '홍로(10개)',
        rank: '상품',
        unit: '10개',
        dpr1: '22,936',
        dpr2: '23,120'
      },
      {
        item_name: '소',
        item_code: '512',
        kind_name: '등심',
        rank: '1++등급',
        unit: '100g',
        dpr1: '16,447',
        dpr2: '16,200'
      },
      {
        item_name: '고등어',
        item_code: '611',
        kind_name: '국산(염장)(1손)',
        rank: '상품',
        unit: '1손',
        dpr1: '5,301',
        dpr2: '5,301'
      }
    ];

    const appleProduct: Product = {
      id: 'agri-fruit-01',
      name: '경북 고당도 꿀사과',
      brand: '과일꾼',
      category: '과일',
      subCategory: '사과',
      itemType: 'fresh',
      image: 'test.jpg',
      releaseDate: '2026',
      price: 28400,
      overallRating: 4.8,
      ratingCount: 100,
      detailedRating: { taste: 5, value: 5, portion: 5, repurchase: 5 }
    };

    const matchedApple = matchProductToKamisPrice(appleProduct, kamisItems, '2026-09-18');
    expect(matchedApple).not.toBeNull();
    expect(matchedApple?.itemName).toBe('사과');
    expect(matchedApple?.todayPrice).toBe(22936);

    const beefProduct: Product = {
      id: 'agri-meat-10',
      name: '1++ No.9 투뿔한우 꽃등심 구이용',
      brand: '마장동',
      category: '고기·수산',
      subCategory: '소고기',
      itemType: 'fresh',
      image: 'test.jpg',
      releaseDate: '2026',
      price: 18900,
      overallRating: 4.9,
      ratingCount: 200,
      detailedRating: { taste: 5, value: 5, portion: 5, repurchase: 5 }
    };

    const matchedBeef = matchProductToKamisPrice(beefProduct, kamisItems, '2026-09-18');
    expect(matchedBeef).not.toBeNull();
    expect(matchedBeef?.itemName).toBe('소');
    expect(matchedBeef?.todayPrice).toBe(16447);
  });

  it('applyKamisPricesToProducts should update multiple products in batch', () => {
    const sampleProducts: Product[] = [
      {
        id: 'agri-fruit-01',
        name: '경북 고당도 꿀사과',
        brand: '과일꾼',
        category: '과일',
        subCategory: '사과',
        itemType: 'fresh',
        image: 'test.jpg',
        releaseDate: '2026',
        price: 28400,
        overallRating: 4.8,
        ratingCount: 100,
        detailedRating: { taste: 5, value: 5, portion: 5, repurchase: 5 }
      },
      {
        id: 'packaged-snack-01',
        name: '포카칩',
        brand: '오리온',
        category: '과자',
        itemType: 'packaged',
        image: 'test.jpg',
        releaseDate: '2026',
        price: 1500,
        overallRating: 4.5,
        ratingCount: 50,
        detailedRating: { taste: 5, value: 5, portion: 5, repurchase: 5 }
      }
    ];

    const kamisItems: RawKamisItem[] = [
      {
        item_name: '사과',
        item_code: '411',
        kind_name: '홍로(10개)',
        rank: '상품',
        unit: '10개',
        dpr1: '22,936',
        dpr2: '23,120'
      }
    ];

    const { updatedProducts, updatedCount } = applyKamisPricesToProducts(sampleProducts, kamisItems, '2026-09-18');
    expect(updatedCount).toBe(1);
    expect(updatedProducts[0].kamisPriceInfo).toBeDefined();
    expect(updatedProducts[0].kamisPriceInfo?.todayPrice).toBe(22936);
    expect(updatedProducts[1].kamisPriceInfo).toBeUndefined();
  });
});
