import { SalePromotionItem, SaleStoreType, ProductCategory } from '../types';

export interface CvsStorePreset {
  key: SaleStoreType;
  name: string;
  url: string;
  logo: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

export const CVS_STORE_PRESETS: CvsStorePreset[] = [
  {
    key: 'CU',
    name: 'CU 편의점 (BGF리테일)',
    url: 'https://cu.bgfretail.com/event/plus.do?category=event&depth2=1&sf=N',
    logo: '💜',
    badgeBg: 'bg-purple-600 text-white',
    badgeText: 'CU 공식 1+1/2+1',
    description: 'CU 공식 웹사이트 행사상품(1+1, 2+1, 아침애 등) 실시간 연동'
  },
  {
    key: '세븐일레븐',
    name: '세븐일레븐 (코리아세븐)',
    url: 'https://www.7-eleven.co.kr/product/presentList.asp',
    logo: '💚',
    badgeBg: 'bg-emerald-600 text-white',
    badgeText: '세븐일레븐 증정행사',
    description: '세븐일레븐 공식 1+1/2+1 증정 행사상품 연동'
  },
  {
    key: '이마트24',
    name: '이마트24',
    url: 'https://emart24.co.kr/goods/event',
    logo: '💛',
    badgeBg: 'bg-amber-500 text-slate-900',
    badgeText: '이마트24 행사',
    description: '이마트24 딜리셔스 이달의 행사상품 연동'
  }
];

export interface CollectedDiscountProduct extends SalePromotionItem {
  rawName?: string;
  crawledAt?: string;
}

export interface DiscountCrawlResult {
  success: boolean;
  store: string;
  sourceUrl: string;
  page: number;
  onlyFood: boolean;
  totalParsed: number;
  foodCount: number;
  excludedCount: number;
  count: number;
  items: CollectedDiscountProduct[];
}

/**
 * Non-food negative keywords (Strict filter to guarantee only FOOD items are collected)
 */
export const NON_FOOD_KEYWORDS = [
  // Oral Care
  '칫솔', '치약', '가글', '리스테린', '치실', '구강', '초극세모', '미세모', '미니모', '탄력모', '페리오', '2080', '메디안', '오랄비', '크리오', '죽염', '46cm',
  // Hair & Body Care
  '샴푸', '린스', '트리트먼트', '바디워시', '비누', '핸드워시', '클렌징', '폼클렌징', '스킨', '로션', '선크림', '선블록', '립밤', '수분크림', '마스크팩', '헤어팩', '에센스', '토너',
  '면도기', '면도날', '쉐이빙', '왁스', '하드왁스', '헤어왁스', '염색약', '염색제', '헤어젤', '스프레이', '헤어스프레이', '미스트',
  '미쟝센', '엘라스틴', '엘라)', '리엔', '케라시스', '도브',
  // Feminine Care
  '생리대', '팬티라이너', '롱라이너', '오버나이트', '탐폰', '순면프레쉬', '내몸에순한면', '볼록맞춤', '울날', '슬날', '수퍼롱', '슈퍼롱', '날개형',
  '쏘피', '귀애랑', '바디피트', '좋은느낌', '화이트', '시크릿데이',
  // Household / Detergents
  '세탁세제', '섬유유연제', '주방세제', '퐁퐁', '락스', '페브리즈', '탈취제', '방향제', '제습제', '모기약', '에프킬라', '살충제', '홈키파', '세제',
  '테크', '스파크', '피죤', '샤프란', '비트',
  // Batteries & Electronics
  '건전지', '배터리', '충전기', '케이블', '이어폰', '보조배터리', '라이터', '부탄가스',
  // Sanitary Paper & Tissues & Kitchenware
  '물티슈', '롤화장지', '키친타올', '화장지', '미용티슈', '각티슈', '위생팩', '지퍼백', '크린랩', '호일', '종이컵', '수세미', '고무장갑', '쓰레기봉투', '종량제',
  // Medical & Misc Living
  '스타킹', '양말', '우산', '우의', '핫팩', '손난로', '마스크', '대일밴드', '반창고', '붕대', '파스',
  '테이프', '커터칼', '딱풀', '물풀', '목공풀', '접착제', '본드', '볼펜', '노트'
];

/**
 * Checks whether a product name is food
 */
export function isFoodProduct(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  const cleanName = name.replace(/\s+/g, '').toLowerCase();

  for (const bad of NON_FOOD_KEYWORDS) {
    if (cleanName.includes(bad.toLowerCase())) {
      return false;
    }
  }
  return true;
}

/**
 * Detect Food Category based on product title
 */
export function detectFoodCategory(name: string): ProductCategory {
  const lower = name.toLowerCase();
  if (/아이스크림|빙과|하드|콘|설레임|더위사냥|월드콘|부라보|바나나맛|폴라포|스크류바|파르페|젤라또/.test(lower)) {
    return '아이스크림';
  }
  if (/음료|커피|우유|라떼|에이드|주스|콜라|스프라이트|사이다|탄산|워터|차|티|수|드링크|맥콜|헛개|블랙보리|파워에이드|토레타|밀크티|스무디/.test(lower)) {
    return '음료';
  }
  if (/빵|디저트|케이크|베이커리|샌드|롤|크림빵|마카롱|도넛|와플|카스테라|타르트/.test(lower)) {
    return '빵·디저트';
  }
  if (/과자|스낵|쿠키|초코|캔디|사탕|젤리|칩|껌|카라멜|파이|리콜라|비스킷|팝콘/.test(lower)) {
    return '과자';
  }
  if (/도시락|김밥|삼각|버거|핫바|소시지|맥스봉|만두|볶음밥|햇반|죽|탕|국|찌개|라면|우동|짬뽕|짜장|간편|치킨|피자|떡볶이|닭가슴살/.test(lower)) {
    return '간편식';
  }
  return '간편식';
}

/**
 * Detect Food Sub-Category
 */
export function detectFoodSubCategory(name: string, category: ProductCategory): string {
  const lower = name.toLowerCase();
  if (category === '간편식') {
    if (/라면|면|우동|짬뽕|짜장/.test(lower)) return '라면/면류';
    if (/도시락|덮밥|볶음밥|햇반|죽/.test(lower)) return '도시락/밥류';
    if (/핫바|소시지|맥스봉|후랑크/.test(lower)) return '핫바/육가공';
    if (/김밥|삼각|버거|샌드위치/.test(lower)) return '삼각김밥/버거';
    if (/만두|피자|치킨|떡볶이/.test(lower)) return '간식/냉동';
    if (/닭가슴살|프로틴/.test(lower)) return '단백질/헬스';
    return '간편식';
  }
  if (category === '음료') {
    if (/커피|라떼|아메리카노|에스프|콜드브루/.test(lower)) return '커피';
    if (/우유|두유|요거트|액티비아/.test(lower)) return '유제품';
    if (/콜라|사이다|스프라이트|탄산/.test(lower)) return '탄산음료';
    if (/차|티|보리|헛개/.test(lower)) return '차음료';
    if (/주스|에이드|워터/.test(lower)) return '주스/워터';
    return '음료';
  }
  if (category === '과자') {
    if (/초코|카카오/.test(lower)) return '초콜릿';
    if (/캔디|사탕|젤리|구미/.test(lower)) return '캔디/젤리';
    if (/칩|스낵|나초|팝콘/.test(lower)) return '스낵';
    if (/쿠키|비스킷|파이/.test(lower)) return '비스킷/파이';
    return '스낵';
  }
  if (category === '아이스크림') {
    if (/콘|와플|부라보|월드콘|슈퍼콘|구구콘/.test(lower)) return '콘·와플';
    if (/컵|파인트|투게더|미니컵|빙수/.test(lower)) return '컵·파인트';
    if (/튜브|쭈쭈바|폴라포|더위사냥|탱크보이|뽕따|빠삐코|설레임/.test(lower)) return '튜브·쭈쭈바';
    if (/모나카|샌드|싸만코|빵또아|시모나|찰떡/.test(lower)) return '모나카·샌드';
    if (/마카롱|엑설런트|티코|팽이팽이|디저트/.test(lower)) return '디저트·마카롱';
    return '바·하드';
  }
  return category;
}

/**
 * 편의점 공식 행사상품 미리보기 수집. 실패하면 예외를 던집니다 (대체용 가짜 상품 없음).
 */
export async function crawlDiscountProducts(params: {
  store?: SaleStoreType;
  customUrl?: string;
  page?: number;
  onlyFood?: boolean;
  dealType?: string;
}): Promise<DiscountCrawlResult> {
  const queryParams = new URLSearchParams({
    store: params.store || 'CU',
    onlyFood: String(params.onlyFood !== false),
    dealType: params.dealType || '전체'
  });

  const response = await fetch(`/api/crawl-discounts?${queryParams.toString()}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success) {
    throw new Error(data?.error || `행사상품 수집 실패 (HTTP ${response.status})`);
  }
  return data as DiscountCrawlResult;
}
