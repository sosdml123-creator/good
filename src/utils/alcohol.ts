import { Product } from '../types';

const ALCOHOL_SUBCATEGORY = /주류|맥주|소주|와인|위스키|막걸리|하이볼|전통주|사케|칵테일|리큐르/;
const ALCOHOL_NAME = /맥주|소주|하이볼|와인|위스키|막걸리|전통주|사케|츄하이|보드카|리큐르|청하|매화수|이슬톡톡/;
// 이름에 술 이름이 들어가지만 술이 아닌 음료 (와인에이드, 맥주효모 음료 등)
const NOT_ALCOHOL_NAME = /에이드|효모|안주/;

/** 주류 상품 여부 (청소년 보호를 위해 판매처·구매 유도 UI를 숨기는 기준) */
export const isAlcoholProduct = (product: Pick<Product, 'name' | 'category' | 'subCategory'>): boolean => {
  if (product.subCategory && ALCOHOL_SUBCATEGORY.test(product.subCategory)) return true;
  // 이름 매칭은 음료 카테고리로 한정 (맥주 안주 과자, 와인빵 등 오탐 방지)
  if (product.category !== '음료') return false;
  return ALCOHOL_NAME.test(product.name) && !NOT_ALCOHOL_NAME.test(product.name);
};
