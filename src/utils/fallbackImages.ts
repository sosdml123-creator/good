/**
 * 상품 사진을 불러오지 못했을 때 보여 주는 카테고리별 대체 이미지.
 * 이미지는 public/fallback/ 에 있는 로컬 파일이라 네트워크가 끊겨도 앱 번들에서 바로 뜬다.
 */

export type FallbackKey =
  | 'snack'
  | 'drink'
  | 'bakery'
  | 'meal'
  | 'fastfood'
  | 'icecream'
  | 'fruit'
  | 'grocery'
  | 'meat'
  | 'etc';

const CATEGORY_TO_KEY: Record<string, FallbackKey> = {
  '과자': 'snack',
  '음료': 'drink',
  '빵·디저트': 'bakery',
  '간편식': 'meal',
  '패스트푸드': 'fastfood',
  '아이스크림': 'icecream',
  '과일': 'fruit',
  '식재료': 'grocery',
  '고기·수산': 'meat',
  '기타': 'etc',
};

// 카테고리가 없거나 '신제품'·'전체'처럼 애매할 때 상품명으로 추정
const NAME_KEYWORDS: Array<[FallbackKey, string[]]> = [
  ['icecream', ['아이스크림', '빙수', '젤라또', '파르페']],
  ['drink', ['음료', '사이다', '콜라', '커피', '라떼', '우유', '주스', '에이드', '워터', '탄산', '두유', 'ml', 'ML']],
  ['fastfood', ['버거', '치킨', '피자', '감자튀김', '너겟']],
  ['meal', ['도시락', '삼각김밥', '김밥', '라면', '컵밥', '샌드위치', '덮밥', '만두', '떡볶이']],
  ['bakery', ['빵', '케이크', '쿠키', '마카롱', '크림', '디저트', '도넛', '타르트', '푸딩']],
  ['snack', ['과자', '칩', '스낵', '젤리', '초콜릿', '사탕', '껌']],
  ['meat', ['한우', '소고기', '돼지', '삼겹살', '닭', '연어', '새우', '수산']],
  ['fruit', ['복숭아', '사과', '수박', '딸기', '포도', '귤', '바나나', '샤인머스캣']],
  ['grocery', ['계란', '달걀', '두부', '채소', '야채', '당근', '양파']],
];

export const fallbackImageUrl = (key: FallbackKey): string => `/fallback/${key}.jpg`;

export const getFallbackKey = (product?: { name?: string; category?: string }): FallbackKey => {
  const cat = product?.category || '';
  if (CATEGORY_TO_KEY[cat]) return CATEGORY_TO_KEY[cat];
  const name = product?.name || '';
  for (const [key, words] of NAME_KEYWORDS) {
    if (words.some(w => name.includes(w))) return key;
  }
  return 'etc';
};

export const getFallbackImage = (product?: { name?: string; category?: string }): string =>
  fallbackImageUrl(getFallbackKey(product));
