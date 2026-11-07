import { describe, it, expect } from 'vitest';
import { asksPurchaseInfo, toPurchasePrice } from '../components/review/PurchaseInfoFields';

describe('농수산물 후기 구매 정보', () => {
  it('농수산물 상품에서만 구매 가격·구매처를 묻는다', () => {
    expect(asksPurchaseInfo({ id: 'kamis-611', category: '고기·수산' } as never)).toBe(true);
    expect(asksPurchaseInfo({ id: 'p1', category: '과일' } as never)).toBe(true);
    expect(asksPurchaseInfo({ id: 'p2', category: '과자', itemType: 'packaged' } as never)).toBe(false);
    expect(asksPurchaseInfo(null)).toBe(false);
  });
  it('구매 가격은 숫자만 남기고, 비거나 범위 밖이면 저장하지 않는다', () => {
    expect(toPurchasePrice('12,900')).toBe(12900);
    expect(toPurchasePrice('')).toBeUndefined();
    expect(toPurchasePrice('0')).toBeUndefined();
    expect(toPurchasePrice('999999999')).toBeUndefined();
  });
});
