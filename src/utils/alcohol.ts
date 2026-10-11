import { Product } from '../types';

const ALCOHOL_SUBCATEGORY = /주류|맥주|소주|와인|위스키|막걸리|하이볼|전통주|사케|칵테일|리큐르|양주/;

// 술 종류를 가리키는 일반 명칭
const ALCOHOL_TYPE_NAME = /맥주|소주|하이볼|와인|위스키|막걸리|전통주|사케|츄하이|보드카|리큐르|럼주|브랜디|꼬냑|코냑|데킬라|샴페인|고량주|과실주|복분자주|매실주|담금주|약주|라거|필스너|스타우트/;

// 이름에 술 종류가 드러나지 않는 주류 제품·브랜드명 (DB 표기 오타 '캪틴큐' 포함)
const ALCOHOL_BRAND_NAME = /캡틴\s*큐|캪틴\s*큐|나폴레온|참이슬|처음처럼|진로이즈백|일품진로|좋은데이|순하리|에이슬|이슬톡톡|청하|매화수|백세주|산사춘|설중매|화요|연태|이과두주|카스(?!테라|타드)|하이트(?!진로)|켈리|크러시|필라이트|필굿|호가든|버드와이저|하이네켄|칭따오|아사히|기린이치방|삿포로|산토리|기네스|조니워커|짐빔|잭다니엘|앱솔루트|예거마이스터/;

// 주류만 만드는 제조사
const ALCOHOL_ONLY_BRAND = /오비맥주|골든블루|페르노리카|디아지오|국순당|보해양조|무학|금복주|배상면주가/;

// 이름에 술 이름이 들어가지만 술이 아닌 음료 (와인에이드, 맥주효모 음료 등)
const NOT_ALCOHOL_NAME = /에이드|효모|안주/;

/** 주류 상품 여부 (청소년 보호를 위해 판매처·구매 유도 UI를 숨기는 기준) */
export const isAlcoholProduct = (product: Pick<Product, 'name' | 'brand' | 'category' | 'subCategory'>): boolean => {
  if (product.subCategory && ALCOHOL_SUBCATEGORY.test(product.subCategory)) return true;
  // 이름·브랜드 매칭은 음료 카테고리로 한정 (맥주 안주 과자, 와인빵 등 오탐 방지)
  if (product.category !== '음료') return false;
  if (NOT_ALCOHOL_NAME.test(product.name)) return false;
  return (
    ALCOHOL_TYPE_NAME.test(product.name) ||
    ALCOHOL_BRAND_NAME.test(product.name) ||
    ALCOHOL_ONLY_BRAND.test(product.brand || '')
  );
};
