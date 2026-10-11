import { describe, it, expect } from 'vitest';
import { isAlcoholProduct } from '../utils/alcohol';

const drink = (name: string, brand = '', subCategory?: string) =>
  isAlcoholProduct({ name, brand, category: '음료', subCategory });

describe('isAlcoholProduct', () => {
  it('서브카테고리나 술 종류 이름으로 주류를 판별한다', () => {
    expect(drink('하이트진로 테라 라이트 (제로 슈거)', '하이트진로', '주류/맥주')).toBe(true);
    expect(drink('생레몬 하이볼 500ml')).toBe(true);
  });

  it('이름에 술 종류가 없는 주류 제품·주류 전문 제조사도 판별한다', () => {
    expect(drink('캪틴큐', '롯데칠성음료')).toBe(true);
    expect(drink('캡틴큐')).toBe(true);
    expect(drink('카스 프레시 500ml', '오비맥주')).toBe(true);
  });

  it('술 이름이 섞인 일반 식품은 주류로 보지 않는다', () => {
    expect(drink('카스테라 라떼')).toBe(false);
    expect(drink('하이트진로 토닉워터', '하이트진로')).toBe(false);
    expect(drink('샤인머스캣 와인에이드')).toBe(false);
    expect(isAlcoholProduct({ name: '맥주 안주 먹태깡', brand: '농심', category: '과자' })).toBe(false);
  });
});
