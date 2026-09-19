import { Product, ProductCategory } from '../types';

/**
 * 카테고리별 고유 2자리 숫자 코드 (CC)
 */
export const CATEGORY_NUMERIC_CODES: Record<ProductCategory, string> = {
  '신제품': '10',
  '과자': '11',
  '음료': '12',
  '빵·디저트': '13',
  '간편식': '14',
  '패스트푸드': '15',
  '아이스크림': '16',
  '과일': '21',
  '식재료': '22',
  '고기·수산': '23',
  '전체': '90',
  '기타': '99',
};

/**
 * 주요 브랜드별 고유 3자리 숫자 코드 (BBB)
 */
export const BRAND_NUMERIC_CODES: Record<string, string> = {
  // 식품/제과 제조사 (101 ~ 199)
  '농심': '101',
  '오리온': '102',
  '삼양': '103',
  '삼양식품': '103',
  '롯데': '104',
  '롯데제과': '104',
  '롯데웰푸드': '104',
  '롯데칠성': '104',
  '빙그레': '105',
  'CJ': '106',
  'CJ제일제당': '106',
  '비비고': '106',
  '오뚜기': '107',
  '동원': '108',
  '동원F&B': '108',
  '해태': '109',
  '해태제과': '109',
  '팔도': '110',
  '삼립': '111',
  'SPC': '111',
  '서울우유': '112',
  '매일유업': '113',
  '남양유업': '114',
  '풀무원': '115',
  '하림': '116',
  '코카콜라': '117',
  '칠성': '118',
  '연세우유': '119',
  '연세유업': '119',
  '농협': '120',
  '청정원': '121',
  '대상': '121',
  '크라운': '122',
  '크라운제과': '122',

  // 편의점 & 유통 채널 (201 ~ 299)
  'CU': '201',
  'GS25': '202',
  '세븐일레븐': '203',
  '7-ELEVEN': '203',
  '이마트24': '204',
  '노브랜드': '205',
  '이마트': '205',
  '마켓컬리': '206',
  '컬리': '206',
  '쿠팡': '207',
  '쿠팡프레시': '207',
  '홈플러스': '208',
  '롯데마트': '209',

  // 카페 & 음료 프랜차이즈 (301 ~ 399)
  '스타벅스': '301',
  '메가커피': '302',
  '메가MGC커피': '302',
  '컴포즈커피': '303',
  '컴포즈': '303',
  '빽다방': '304',
  '더벤티': '305',
  '매머드커피': '306',
  '이디야': '307',
  '이디야커피': '307',
  '투썸플레이스': '308',
  '투썸': '308',
  '할리스': '309',
  '폴바셋': '310',
  '공차': '311',
  '달콤커피': '312',
  '파스쿠찌': '313',

  // 패스트푸드 & 외식 프랜차이즈 (401 ~ 499)
  '맥도날드': '401',
  '롯데리아': '402',
  '버거킹': '403',
  'KFC': '404',
  '맘스터치': '405',
  '도미노피자': '406',
  '도미노': '406',
  '피자헛': '407',
  '파파존스': '408',
  '서브웨이': '409',
  '써브웨이': '409',
  '배스킨라빈스': '410',
  '베스킨라빈스': '410',
  '교촌치킨': '411',
  'BHC': '412',
  'BBQ': '413',
  '굽네치킨': '414',
  '처갓집': '415',

  // 베이커리 & 디저트 전문점 (501 ~ 599)
  '뚜레쥬르': '501',
  '성심당': '502',
  '삼송빵집': '503',
  '런던베이글뮤지엄': '504',
  '런던베이글': '504',
  '노티드': '505',
  '파리바게뜨': '506',
  '태극당': '507',
  '이성당': '508',
  '옵스': '509',
};

/**
 * 브랜드명으로부터 3자리 숫자 브랜드 코드를 가져옵니다.
 * 등록되지 않은 브랜드는 브랜드명의 일관된 해시를 통해 600~999 번호를 자동 부여합니다.
 */
export function getBrandNumericCode(brandName: string): string {
  if (!brandName) return '999';
  const clean = brandName.trim();

  // 1. 직접 매핑
  if (BRAND_NUMERIC_CODES[clean]) {
    return BRAND_NUMERIC_CODES[clean];
  }

  // 2. 부분 일치 검색 (예: "오리온제과" -> "오리온")
  for (const [key, code] of Object.entries(BRAND_NUMERIC_CODES)) {
    if (clean.includes(key) || key.includes(clean)) {
      return code;
    }
  }

  // 3. 해시 기반 3자리 숫자 생성 (600 ~ 999)
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  const codeNum = 600 + (Math.abs(hash) % 400);
  return String(codeNum);
}

/**
 * 카테고리로부터 2자리 숫자 카테고리 코드를 가져옵니다.
 */
export function getCategoryNumericCode(category?: ProductCategory | string): string {
  if (!category) return '99';
  const match = CATEGORY_NUMERIC_CODES[category as ProductCategory];
  if (match) return match;
  return '99';
}

/**
 * 상품 객체로부터 고유 8자리 숫자 상품 코드(Product Code)를 계산/반환합니다.
 * 포맷: [카테고리 2자리][브랜드 3자리][일련번호 3자리] (예: 11102001)
 */
export function getProductCode(product?: Partial<Product> | { id: string; code?: string; category?: any; brand?: string; name?: string } | null): string {
  if (!product) return '';

  // 이미 순수 숫자로 된 유효한 코드가 부여되어 있는 경우
  if (product.code && /^\d{6,10}$/.test(product.code.trim())) {
    return product.code.trim();
  }

  const catCode = getCategoryNumericCode(product.category as ProductCategory);
  const brandCode = getBrandNumericCode(product.brand || '');

  // ID 또는 상품명 기반으로 일관된 3자리 시퀀스 번호(001 ~ 999) 생성
  let seq = 1;
  const idStr = String(product.id || product.name || '').trim();
  const numMatch = idStr.match(/\d+/);
  if (numMatch) {
    seq = (parseInt(numMatch[0], 10) % 999) || 1;
  } else {
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) {
      hash = (hash << 5) - hash + idStr.charCodeAt(i);
      hash |= 0;
    }
    seq = (Math.abs(hash) % 999) + 1;
  }

  const seqStr = String(seq).padStart(3, '0').slice(-3);
  return `${catCode}${brandCode}${seqStr}`;
}

/**
 * 신규 상품 추가 시 해당 카테고리와 브랜드에 맞추어 중복되지 않는 다음 8자리 숫자 코드를 자동 발급합니다.
 */
export function generateNextProductCode(
  existingProducts: Product[],
  category?: ProductCategory | string,
  brand?: string
): string {
  const catCode = getCategoryNumericCode(category as ProductCategory);
  const brandCode = getBrandNumericCode(brand || '');
  const prefix = `${catCode}${brandCode}`;

  let maxSeq = 0;
  existingProducts.forEach((p) => {
    const code = getProductCode(p);
    if (code.startsWith(prefix) && code.length >= 8) {
      const seqPart = parseInt(code.slice(5), 10);
      if (!isNaN(seqPart) && seqPart > maxSeq) {
        maxSeq = seqPart;
      }
    }
  });

  const nextSeq = String(maxSeq + 1).padStart(3, '0');
  return `${prefix}${nextSeq}`;
}

/**
 * ID 또는 8자리 숫자 상품 코드로 상품 목록에서 상품을 검색합니다.
 */
export function findProductByCodeOrId(products: Product[], codeOrId: string): Product | undefined {
  if (!codeOrId) return undefined;
  const target = codeOrId.trim().toUpperCase().replace(/^SP-/, ''); // 레거시 SP- 접두사 호환 지원

  return products.find((p) => {
    if (String(p.id).toUpperCase() === target) return true;
    if (p.code && p.code.trim() === target) return true;
    const pCode = getProductCode(p);
    if (pCode === target) return true;
    if (pCode.replace(/^SP-/, '') === target) return true;
    return false;
  });
}

/**
 * 상품 공유 및 딥링크용 정규 URL을 생성합니다. (예: https://www.sinsangpick.kr/?p=11102001)
 */
export function getProductShareUrl(product: Product): string {
  const code = getProductCode(product);
  const baseUrl = window.location.origin;
  return `${baseUrl}/?p=${encodeURIComponent(code)}`;
}
