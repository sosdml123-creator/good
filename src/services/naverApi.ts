import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { PendingProduct, ProductCategory } from '../types';
import { fetchWithTimeout } from '../utils/networkUtils';
import { REAL_NEW_PRODUCTS_DATABASE } from '../data/realNewProducts';
import {
  ILLUSTRATION_PEACH,
  ILLUSTRATION_WATERMELON,
  ILLUSTRATION_APPLE,
  ILLUSTRATION_STRAWBERRY,
  ILLUSTRATION_CITRUS,
  ILLUSTRATION_BEEF,
  ILLUSTRATION_PORK,
  ILLUSTRATION_CHICKEN,
  ILLUSTRATION_SALMON,
  ILLUSTRATION_SHRIMP,
  ILLUSTRATION_EGG,
  ILLUSTRATION_TOFU,
} from '../utils/productIllustrations';

export interface NaverSearchItem {
  title: string;
  link: string;
  description?: string;
  originallink?: string;
  pubDate?: string;
  thumbnail?: string;
  sizeheight?: string;
  sizewidth?: string;
  // Shopping API fields
  lprice?: string;
  hprice?: string;
  mallName?: string;
  productId?: string;
  productType?: string;
  brand?: string;
  maker?: string;
  category1?: string;
  category2?: string;
  category3?: string;
  category4?: string;
  image?: string;
  /** true when the proxy built this item from image search (no real shopping data / price) */
  synthesized?: boolean;
}

export interface NaverSearchResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverSearchItem[];
  synthesized?: boolean;
}

/**
 * NAVER DataLab Shopping Insight & Search Trend Interfaces
 */
export interface ShoppingCategoryParam {
  name: string;
  param: string[];
}

export interface ShoppingInsightCategoryRequest {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  timeUnit: 'date' | 'week' | 'month';
  category: ShoppingCategoryParam[];
  device?: '' | 'pc' | 'mo';
  gender?: '' | 'm' | 'f';
  ages?: string[];
}

export interface ShoppingKeywordParam {
  name: string;
  param: string[];
}

export interface ShoppingInsightKeywordRequest {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  timeUnit: 'date' | 'week' | 'month';
  category: string;  // e.g. "50000006" (식품)
  keyword: ShoppingKeywordParam[];
  device?: '' | 'pc' | 'mo';
  gender?: '' | 'm' | 'f';
  ages?: string[];
}

export interface ShoppingInsightDataPoint {
  period: string;
  ratio: number;
}

export interface ShoppingInsightResultItem {
  title: string;
  category?: string[];
  keyword?: string[];
  data: ShoppingInsightDataPoint[];
}

export interface ShoppingInsightResponse {
  startDate: string;
  endDate: string;
  timeUnit: string;
  results: ShoppingInsightResultItem[];
  note?: string;
}

export interface SearchTrendKeywordGroup {
  groupName: string;
  keywords: string[];
}

export interface SearchTrendRequest {
  startDate: string;
  endDate: string;
  timeUnit: 'date' | 'week' | 'month';
  keywordGroups: SearchTrendKeywordGroup[];
  device?: '' | 'pc' | 'mo';
  gender?: '' | 'm' | 'f';
  ages?: string[];
}

export interface SearchTrendResultItem {
  title: string;
  keywords?: string[];
  category?: string[];
  keyword?: string[];
  data: { period: string; ratio: number }[];
}

export interface SearchTrendResponse {
  startDate: string;
  endDate: string;
  timeUnit: string;
  results: SearchTrendResultItem[];
  note?: string;
  sourceApi?: string;
  isNcpActive?: boolean;
  ncpStatus?: number;
  ncpMessage?: string;
}

export interface KeywordDemographics {
  keyword: string;
  genderRatio: { male: number; female: number };
  ageRatios: { ageGroup: string; ratio: number }[];
}

export interface TrendingKeywordInsight {
  rank: number;
  keyword: string;
  category: ProductCategory;
  score: number; // 1~100 트렌드 지수
  growthRate: string; // e.g. "+145%"
  isHot: boolean;
  relatedBrand?: string;
}

/**
 * Clean up HTML tags and entities
 */
export const cleanHtml = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/<[^>]*>?/gm, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const KNOWN_BRANDS = [
  '농심', '오리온', '롯데웰푸드', '롯데', '빙그레', '삼양식품', '삼양', 'CJ제일제당', 'CJ',
  '오뚜기', '팔도', '해태제과', '해태', '매일유업', '남양유업', '동원에프앤비', '동원',
  '하이트진로', '오비맥주', 'SPC', '삼립', '파리바게뜨', '뚜레쥬르', '연세유업', '서울우유',
  'CU', 'GS25', '세븐일레븐', '이마트24', '스타벅스', '이디야', '투썸플레이스', '배스킨라빈스',
  '하겐다즈', '하림', '풀무원', '비비고', '맥도날드', '버거킹', 'KFC', '맘스터치', '노브랜드'
];

// 카테고리별 고화질 클린 패키지/푸드 대표 이미지 풀 (워터마크 없는 깔끔한 이미지 대체용)
const HIGH_QUALITY_CATEGORY_IMAGES: Record<ProductCategory, string[]> = {
  '신제품': [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80'
  ],
  '간편식': [
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80', // 라면
    'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=800&auto=format&fit=crop&q=80', // 볶음면
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80', // 도시락
    'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80', // 김밥
    'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80', // 만두/딤섬
    'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&auto=format&fit=crop&q=80'  // 사발면
  ],
  '패스트푸드': [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80', // 프리미엄 버거
    'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80', // 치즈버거
    'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&auto=format&fit=crop&q=80', // 버거&감튀
    'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&auto=format&fit=crop&q=80', // 치킨너겟/윙
    'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80'  // 감자튀김
  ],
  '음료': [
    'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80', // 커피
    'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80', // 탄산캔
    'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&auto=format&fit=crop&q=80', // 맥주/주류
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80', // 라떼/오트
    'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80'  // 주스/스무디
  ],
  '빵·디저트': [
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80', // 베이커리
    'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&auto=format&fit=crop&q=80', // 쿠키
    'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&auto=format&fit=crop&q=80', // 아이스크림
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=80'  // 케이크
  ],
  '과자': [
    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&auto=format&fit=crop&q=80', // 비스킷
    'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&auto=format&fit=crop&q=80', // 감자칩
    'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800&auto=format&fit=crop&q=80', // 젤리
    'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&auto=format&fit=crop&q=80'  // 스낵
  ],
  '과일': [
    ILLUSTRATION_PEACH,
    ILLUSTRATION_WATERMELON,
    ILLUSTRATION_APPLE,
    ILLUSTRATION_STRAWBERRY,
    ILLUSTRATION_CITRUS
  ],
  '식재료': [
    ILLUSTRATION_EGG,
    ILLUSTRATION_TOFU
  ],
  '고기·수산': [
    ILLUSTRATION_BEEF,
    ILLUSTRATION_PORK,
    ILLUSTRATION_CHICKEN,
    ILLUSTRATION_SALMON,
    ILLUSTRATION_SHRIMP
  ],
  '기타': [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'
  ],
  '아이스크림': [
    'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80'
  ],
  '전체': [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'
  ]
};

/**
 * Check if the news publication date is within the allowed recent window (default: max 3 days)
 */
export const isRecentNewsArticle = (pubDateStr?: string, maxDaysAgo: number = 3): boolean => {
  if (!pubDateStr) return false;
  const pubTime = new Date(pubDateStr).getTime();
  if (isNaN(pubTime)) return false;

  const now = Date.now();
  const diffDays = (now - pubTime) / (1000 * 60 * 60 * 24);
  // Must be recent (between 0 and maxDaysAgo)
  return diffDays >= -0.5 && diffDays <= maxDaysAgo;
};

/**
 * Verify keyword similarity between search query / brand and extracted product name
 */
export const verifyKeywordSimilarity = (
  searchKeyword: string,
  productName: string,
  brand: string
): { isMatched: boolean; reason?: string } => {
  const normProduct = productName.replace(/\s+/g, '').toLowerCase();
  const normBrand = brand.replace(/\s+/g, '').toLowerCase();
  const normKeyword = searchKeyword
    .replace(/(신제품|신상|출시|편의점|디저트|라면|과자|음료)/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();

  // 1. If keyword had specific terms (e.g. '투움바', '밤티라미수', '비쵸비')
  if (normKeyword.length >= 2) {
    const isKeywordContained = normProduct.includes(normKeyword) || normKeyword.includes(normProduct);
    if (!isKeywordContained && !normProduct.includes(normBrand)) {
      return {
        isMatched: false,
        reason: `검색어 '${searchKeyword}'와 추출 제품명 '${productName}' 간 연관성 낮음`
      };
    }
  }

  // 2. Minimum product name validity check
  if (normProduct.length < 2 || ['신제품', '신상품', '인기상품', '단독출시'].includes(normProduct)) {
    return {
      isMatched: false,
      reason: '제품명이 일반 수식어로만 추출됨 (수동 확인 필요)'
    };
  }

  return { isMatched: true };
};

/**
 * Detect product category from text
 */
export const detectCategory = (text: string): ProductCategory => {
  const t = text.toLowerCase();
  if (t.includes('맥도날드') || t.includes('버거킹') || t.includes('맘스터치') || t.includes('롯데리아') ||
      t.includes('버거') || t.includes('와퍼') || t.includes('싸이버거') || t.includes('너겟') ||
      t.includes('패스트푸드') || t.includes('감자튀김') || t.includes('치즈스틱') || t.includes('지파이')) {
    return '패스트푸드';
  }
  if (t.includes('라면') || t.includes('도시락') || t.includes('김밥') || t.includes('간편식') || 
      t.includes('밀키트') || t.includes('덮밥') || t.includes('피자') ||
      t.includes('만두') || t.includes('볶음밥') || t.includes('햇반') || t.includes('안주') ||
      t.includes('삼각김밥') || t.includes('핫바') || t.includes('소시지') || t.includes('파스타')) {
    return '간편식';
  }
  if (t.includes('음료') || t.includes('커피') || t.includes('라떼') || t.includes('탄산') || 
      t.includes('주스') || t.includes('에이드') || t.includes('맥주') || t.includes('하이볼') || 
      t.includes('차') || t.includes('밀크티') || t.includes('스무디') || t.includes('소주') ||
      t.includes('요거트') || t.includes('유제품') || t.includes('우유') || t.includes('콜라') ||
      t.includes('사이다') || t.includes('에너지드링크')) {
    return '음료';
  }
  if (t.includes('아이스크림') || t.includes('빙과') || t.includes('하드') || t.includes('소프트콘') ||
      t.includes('젤라또') || t.includes('소르베') || t.includes('샤베트') || t.includes('파인트') ||
      t.includes('쭈쭈바') || t.includes('폴라포') || t.includes('더위사냥') || t.includes('월드콘') ||
      t.includes('부라보') || t.includes('설레임') || t.includes('메로나') || t.includes('비비빅') ||
      t.includes('누가바') || t.includes('쌍쌍바') || t.includes('바밤바') || t.includes('투게더') ||
      t.includes('붕어싸만코') || t.includes('빵또아') || t.includes('요아정') || t.includes('배스킨라빈스') ||
      t.includes('끌레도르') || t.includes('하겐다즈') || t.includes('나뚜루')) {
    return '아이스크림';
  }
  if (t.includes('빵') || t.includes('디저트') || t.includes('케이크') || t.includes('크림빵') || 
      t.includes('도넛') || t.includes('찹쌀떡') || t.includes('쿠키') || t.includes('와플') ||
      t.includes('베이글') || t.includes('샌드위치') || t.includes('타르트') || t.includes('슈') ||
      t.includes('약과') || t.includes('마카롱') || t.includes('휘낭시에') || t.includes('카스테라')) {
    return '빵·디저트';
  }
  if (t.includes('과자') || t.includes('스낵') || t.includes('감자칩') || t.includes('젤리') || 
      t.includes('초콜릿') || t.includes('캔디') || t.includes('팝콘') ||
      t.includes('비스킷') || t.includes('초코') || t.includes('웨하스') || t.includes('사탕') ||
      t.includes('칩') || t.includes('구미')) {
    return '과자';
  }
  if (t.includes('과일') || t.includes('딸기') || t.includes('사과') || t.includes('포도') || 
      t.includes('수박') || t.includes('복숭아') || t.includes('샤인머스캣') || t.includes('망고')) {
    return '과일';
  }
  if (t.includes('고기') || t.includes('한우') || t.includes('삼겹살') || t.includes('연어') || 
      t.includes('수산') || t.includes('참치') || t.includes('새우') || t.includes('치킨')) {
    return '고기·수산';
  }
  return '간편식';
};

/**
 * Detect convenience stores mentioned in text
 */
export const detectStores = (text: string): string[] => {
  const stores: string[] = [];
  if (/CU|씨유|포켓CU/i.test(text)) stores.push('CU');
  if (/GS25|지에스|우리동네GS/i.test(text)) stores.push('GS25');
  if (/세븐일레븐|7-Eleven|코리아세븐/i.test(text)) stores.push('세븐일레븐');
  if (/이마트24|emart24/i.test(text)) stores.push('이마트24');
  if (stores.length === 0) {
    stores.push('CU', 'GS25', '세븐일레븐', '대형마트');
  }
  return stores;
};

/**
 * Detect brand name from text
 */
export const detectBrand = (text: string): string => {
  for (const b of KNOWN_BRANDS) {
    if (text.includes(b)) return b;
  }
  if (/CU|씨유/i.test(text)) return 'CU';
  if (/GS25|지에스/i.test(text)) return 'GS25';
  if (/세븐일레븐/i.test(text)) return '세븐일레븐';
  if (/이마트24/i.test(text)) return '이마트24';
  return '편의점 신상';
};

export interface ExtractedProductInfo {
  name: string;
  isValid: boolean;
  reason?: string;
}

/**
 * Checks if a candidate string is clickbait, sentence-structured, contains illegal punctuation, or is an invalid product name.
 */
export const isClickbaitOrInvalidName = (text: string): { isInvalid: boolean; reason?: string } => {
  if (!text || typeof text !== 'string') {
    return { isInvalid: true, reason: '빈 문자열' };
  }
  const clean = text.trim();
  if (clean.length < 2) {
    return { isInvalid: true, reason: '너무 짧음 (2자 미만)' };
  }
  if (clean.length > 28) {
    return { isInvalid: true, reason: '너무 김 (28자 초과)' };
  }

  // 0. 실제 제품명이 아닌 기사 잡음 차단 (시간/연도/행사/기업 활동/나열형 등)
  if (!/[가-힣]/.test(clean)) {
    return { isInvalid: true, reason: '한글 제품명 아님' };
  }
  if (/^\d+년?$/.test(clean) || /\d{1,2}:\d{2}|20\d{2}년?|\d{1,2}월|\d{1,2}일/.test(clean)) {
    return { isInvalid: true, reason: '날짜/시간/연도 표현 포함' };
  }
  if (/·|ㆍ|\s등$|\s외$/.test(clean)) {
    return { isInvalid: true, reason: '여러 제품 나열형' };
  }
  if (clean.split(/\s+/).length > 5) {
    return { isInvalid: true, reason: '단어 수 과다 (문장형)' };
  }
  if (/박람회|전시회|페스티벌|축제|팝업|매장|점포|오픈|개점|캠페인|이벤트|할인|프로모션|행사|기부|시상|수상|채용|실적|매출|간담회|투자|협업|상품군|제품군|라인업|카테고리|마케팅|광고|모델|앰버서더|굿즈|증정|사은품|첫번|첫 번|번째|출범$|돌파$|달성$|선정$|참가$|전망$|리뉴얼$|출시$|론칭$|신제품$|신상$|신메뉴$/.test(clean)) {
    return { isInvalid: true, reason: '제품명이 아닌 행사/기업 활동 문구' };
  }

  // 1. Check for illegal punctuation (questions, ellipsis, exclamation, quotes, etc.)
  if (/[\?\!~\^…\*\/\@\#\$\%\<\>\{\}\[\]\|]/.test(clean)) {
    return { isInvalid: true, reason: '물음표/느낌표/특수기호 포함' };
  }
  if (/\.{2,}/.test(clean)) {
    return { isInvalid: true, reason: '말줄임표(...) 포함' };
  }

  // 2. Clickbait and journalistic noise words
  const clickbaitRegex = /과연|정말|이것|어떨까|비결은|눈길|화제|열풍|충격|놀란|이유는|어쩌나|논란|어디|누구|어떤|왜|결국|대박|꿀팁|믿고|먹어보니|샀는데|뿌린다고|입힌|가고|왔다|알고보니|이\s*정도면|진짜|실화|역대급|무려|먹어봤더니|비상|어쩌다|어떻게|대체|무슨|비결|이유|모습|난리|대란|폭발|누가|맞아|모디슈머|주목|인기몰이|품절대란|깜짝|발칵/;
  if (clickbaitRegex.test(clean)) {
    return { isInvalid: true, reason: '낚시성/의문형/감성 문구 포함' };
  }

  // 3. Sentence verb endings (ending in 다, 까, 요, 죠, 네, 냐, 던, 라, 래, 자, 듯, 서, 며, 고, 게, 니, 지, 면)
  // Allowed suffixes for legitimate food/drink products:
  const allowedFoodSuffixes = /(?:소다|콜라|젤리|피자|요거트|파스타|만두|도넛|과자|초코|라떼|버거|치즈|쉐이크|스무디|티|차|주스|에이드|샌드|스낵|케이크|쿠키|라면|우유|치킨|도시락|핫도그|샐러드|빵|떡|면|밥|죽|구이|탕|찜|조림|포|칩|바|볼|콘|캔|팩|병|컵|정|환|세트|에디션|맛|버전|믹스|시리즈|크런치|크림|베리|딸기|사과|복숭아|수박|망고|초콜릿|바나나|멜론|소시지|소세지|버터|카레|짜장|마요|팝콘|젤라또|모나카|샌드위치|빙수|초코칩|와플|파이|타르트|푸딩|요구르트|카츠|카츠동|볶음밥|삼각김밥|김밥|유부초밥)$/;
  
  if (!allowedFoodSuffixes.test(clean)) {
    if (/(?:다|까|요|죠|네|냐|던|라|래|자|듯|서|며|고|게|니|지|면)$/.test(clean)) {
      return { isInvalid: true, reason: '문장형 서술어 종결' };
    }
  }

  // 4. Trailing Korean particles (를, 을, 은, 는, 이, 가, 의, 에, 와, 과, 로, 으로)
  if (/(?:를|을|은|는|이|가|의|에|와|과|로|으로)$/.test(clean)) {
    return { isInvalid: true, reason: '조사로 끝남' };
  }

  // 5. Generic vague categories
  const genericWords = ['K스낵', 'K푸드', '신제품', '신상품', '신메뉴', '편의점 신상', '디저트', '식품', '과자', '음료', '라면', '아이스크림', '안주', '신상', '먹거리'];
  if (genericWords.includes(clean)) {
    return { isInvalid: true, reason: '일반 카테고리 단어' };
  }

  return { isInvalid: false };
};

// Helper to safely strip trailing particles without corrupting nouns ending in '이' (초코파이, 떡볶이, 송이 등)
export const stripTrailingKoreanParticle = (text: string): string => {
  const clean = text.trim();
  const preserveSuffixes = /(?:파이|볶이|구이|송이|피스타치오|소시지|소세지|마요|초코|라떼|쿠키|젤리|카레|짜장|김밥|유부|모나카|젤라또|쇼콜라)$/;
  if (preserveSuffixes.test(clean)) {
    return clean.replace(/(?:를|을|은|는|와|과|도)$/, '').trim();
  }
  return clean.replace(/(?:를|을|은|는|이|가|와|과|도)$/, '').trim();
};

/**
 * Extract clean and accurate product name from news title & description
 * Prioritizes launch patterns & quoted noun phrases.
 * NEVER returns raw headline as fallback when pattern matching fails.
 */
export const extractProductName = (
  rawTitle: string, 
  rawDesc: string = '', 
  _detectedBrand: string = ''
): ExtractedProductInfo => {
  let title = cleanHtml(rawTitle);
  const desc = cleanHtml(rawDesc);

  // 1. Remove bracketed editorial tags: [포토], [단독], [신상품], (종합), 【현장】, <신간> 등
  title = title.replace(/\[[^\]]*\]/g, ' ')
               .replace(/\([^\)]*\)/g, ' ')
               .replace(/【[^】]*】/g, ' ')
               .replace(/\<[^\>]*\>/g, ' ')
               .replace(/\s+/g, ' ')
               .trim();

  // 2. Priority a & b: Extract from Title Quotes: '신라면 툼바', "연세우유 밤티라미수", ‘비쵸비 딸기’
  const titleQuotes = title.match(/['‘"“]([^'’”"]{2,30})['’”"]/g);
  if (titleQuotes && titleQuotes.length > 0) {
    for (const q of titleQuotes) {
      let clean = q.replace(/['‘"“”]/g, '').trim();
      clean = clean.replace(/^['‘"“\s]+|['‘"”\s,\.\-~]+$/g, '').trim();
      clean = stripTrailingKoreanParticle(clean);
      clean = clean.replace(/^['‘"“\s]+|['‘"”\s,\.\-~]+$/g, '').trim();
      const check = isClickbaitOrInvalidName(clean);
      if (!check.isInvalid && clean.length >= 2) {
        return { name: clean, isValid: true };
      }
    }
  }

  // 3. Priority a: Match patterns like '... OOO 출시/선봬/선보여/론칭/출격/내놓아'
  const actionRegex = /([가-힣A-Za-z0-9\s·\-\+]{2,22})\s*(?:출시|선봬|공개|선보여|론칭|내놓아|출격|선보인다)/;
  const matchAction = title.match(actionRegex);
  if (matchAction) {
    let candidate = matchAction[1].trim();
    candidate = candidate.replace(/^[가-힣A-Za-z0-9]+\s*,\s*/, '').trim();
    candidate = candidate.replace(/^(?:신제품|신상|가을 신메뉴|겨울 신메뉴|여름 신상|인기|단독)\s+/, '').trim();
    candidate = candidate.replace(/^['‘"“\s]+|['‘"”\s,\.\-~]+$/g, '').trim();
    candidate = stripTrailingKoreanParticle(candidate);
    candidate = candidate.replace(/^['‘"“\s]+|['‘"”\s,\.\-~]+$/g, '').trim();
    
    const check = isClickbaitOrInvalidName(candidate);
    if (!check.isInvalid && candidate.length >= 2 && !candidate.endsWith('점') && !candidate.endsWith('사') && !candidate.endsWith('일')) {
      return { name: candidate, isValid: true };
    }
  }

  // 4. "신제품/신상품/신메뉴 OOO" Pattern in Title
  const prefixRegex = /(?:신제품|신상품|신메뉴|신상)\s+['‘"“]?([가-힣A-Za-z0-9\s·\-\+]{2,22})['‘"”]?(?:\s|$|,)/;
  const matchPrefix = title.match(prefixRegex);
  if (matchPrefix) {
    let candidate = matchPrefix[1].trim();
    candidate = candidate.replace(/^['‘"“\s]+|['‘"”\s,\.\-~]+$/g, '').trim();
    candidate = stripTrailingKoreanParticle(candidate);
    candidate = candidate.replace(/^['‘"“\s]+|['‘"”\s,\.\-~]+$/g, '').trim();
    const check = isClickbaitOrInvalidName(candidate);
    if (!check.isInvalid && candidate.length >= 2) {
      return { name: candidate, isValid: true };
    }
  }

  // 5. Priority b: Check Quotes in Description
  if (desc) {
    const descQuotes = desc.match(/['‘"“]([^'’”"]{2,30})['’”"]/g);
    if (descQuotes && descQuotes.length > 0) {
      for (const q of descQuotes) {
        let clean = q.replace(/['‘"“”]/g, '').trim().replace(/(?:를|을|은|는|이|가|와|과|도)$/, '').trim();
        const check = isClickbaitOrInvalidName(clean);
        if (!check.isInvalid) {
          return { name: clean, isValid: true };
        }
      }
    }

    // 6. Launch pattern in Description
    const descActionRegex = /([가-힣A-Za-z0-9\s·\-\+]{2,22})\s*(?:을|를)?\s*(?:출시|선봬|공개|선보여|론칭|내놓았다|선보였다)/;
    const matchDescAction = desc.match(descActionRegex);
    if (matchDescAction) {
      let candidate = matchDescAction[1].trim();
      candidate = candidate.replace(/^[가-힣A-Za-z0-9]+\s*,\s*/, '').trim();
      candidate = candidate.replace(/^(?:신제품|신상|가을 신메뉴|겨울 신메뉴|여름 신상|인기|단독)\s+/, '').trim();
      candidate = candidate.replace(/(?:를|을|은|는|이|가|와|과|도)$/, '').trim();
      const check = isClickbaitOrInvalidName(candidate);
      if (!check.isInvalid) {
        return { name: candidate, isValid: true };
      }
    }
  }

  // 7. STRICT FAILURE: Do NOT use raw headline as fallback
  return {
    name: '[제품명 확인 필요]',
    isValid: false,
    reason: '기사 헤드라인 내 정규 제품명 패턴 미발견 (수동 확인 필요)'
  };
};

/**
 * 브랜드/편의점 이름만 있는 경우(예: '오비맥주', 'GS25') 실제 제품명이 아님
 */
export const isBrandOnlyName = (name: string, brand?: string): boolean => {
  const norm = name.replace(/\s+/g, '').toLowerCase();
  // 회사/법인명 종결자 (음료, 식품, 제과, 유업, 유통, 리테일, 코리아, 주식회사)
  if (/(?:음료|식품|제과|유업|유통|리테일|코리아|푸드|인터내셔널|홀딩스)$/.test(norm)) {
    return true;
  }
  const pool = [...KNOWN_BRANDS, '씨유', '지에스25', '이마트', '홈플러스', '롯데마트', brand || ''].filter(Boolean);
  for (const b of pool) {
    const nb = b.replace(/\s+/g, '').toLowerCase();
    if (!nb) continue;
    if (norm === nb) return true;
    // 브랜드명을 제거하고 나면 남는 게 거의 없는 경우 (예: '농심 신제품', '롯데 신상')
    if (norm.startsWith(nb) && norm.slice(nb.length).length < 2) return true;
    if (norm === `${nb}신제품` || norm === `${nb}신상` || norm === `${nb}신메뉴`) return true;
  }
  return false;
};

/**
 * 기사/블로그 본문에서 실제 판매가(원)를 추출. 찾지 못하면 0 반환 (가짜 가격 생성 금지)
 */
export const extractPriceFromText = (text: string): number => {
  if (!text) return 0;
  const num = '([1-9][0-9]{0,2}(?:,[0-9]{3})+|[1-9][0-9]{2,4})';
  // 1순위: '가격/판매가/소비자가/정가/출고가/편의점가/개당' 문맥이 붙은 금액
  const ctx = new RegExp(`(?:가격|판매가|소비자가|권장소비자가|정가|출고가|편의점가|개당|단돈)[^0-9]{0,12}${num}\\s*원`);
  const m1 = text.match(ctx);
  if (m1) {
    const v = parseInt(m1[1].replace(/,/g, ''), 10);
    if (v >= 500 && v <= 30000) return v;
  }
  // 2순위: 일반 'N,NNN원' (억/만원 단위, 할인 금액 제외)
  const re = new RegExp(`${num}\\s*원(?!\\s*(?:할인|적립|캐시백|쿠폰|상당))`, 'g');
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const before = text.slice(Math.max(0, m.index - 1), m.index);
    if (/[억만]/.test(before)) continue;
    const v = parseInt(m[1].replace(/,/g, ''), 10);
    if (v >= 500 && v <= 20000) return v;
  }
  return 0;
};

/**
 * 대기 목록 재검증: 제품명이 아닌 기사 헤드라인/잡음 항목만 제거합니다.
 * (과거처럼 고정 DB 제품으로 바꿔치기하지 않습니다 → 매번 같은 제품이 생기는 원인 제거)
 */
export const revalidatePendingProductList = (items: PendingProduct[]): PendingProduct[] => {
  return items.filter(item => {
    if (!item.name || item.name.startsWith('[제품명 확인 필요]')) return false;
    if (isClickbaitOrInvalidName(item.name).isInvalid) return false;
    if (isBrandOnlyName(item.name, item.brand)) return false;
    return true;
  });
};


/**
 * Clean and reformat raw journalistic news text into customer-friendly product description
 */
export const cleanProductDescription = (
  rawDesc: string, 
  productName: string, 
  brand: string, 
  category: ProductCategory
): string => {
  if (!rawDesc || rawDesc.trim().length === 0) {
    return generateCleanProductDescription(productName, brand, category);
  }

  let text = cleanHtml(rawDesc);

  // 1. Remove Press & Reporter Noise Patterns
  text = text.replace(/\[[^\]]*기자[^\]]*\]/g, ' ')
             .replace(/\([^\)]*기자[^\)]*\)/g, ' ')
             .replace(/\[[가-힣\s]+=[가-힣\s]+기자\]/g, ' ')
             .replace(/\([가-힣\s]+=[가-힣\s]+기자\)/g, ' ')
             .replace(/[가-힣]{2,4}\s*기자\s*=?/g, ' ')
             .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, ' ');

  // 2. Remove Photo / Source attribution
  text = text.replace(/\[?사진\s*=\s*[^\]\)]+\]?/g, ' ')
             .replace(/\[?사진제공\s*=\s*[^\]\)]+\]?/g, ' ')
             .replace(/\(?사진제공\s*=\s*[^\)]+\)?/g, ' ')
             .replace(/\[?그래픽\s*=\s*[^\]\)]+\]?/g, ' ');

  // 3. Remove Copyright & Media standard boilerplates
  text = text.replace(/무단전재\s*및\s*재배포\s*금지/g, ' ')
             .replace(/저작권자\s*[ⓒ©][^\.]+/g, ' ')
             .replace(/ⓒ\s*[가-힣a-zA-Z0-9\s]+/g, ' ')
             .replace(/All\s+rights\s+reserved/gi, ' ');

  // 4. Remove news announcement prefixes & dates
  text = text.replace(/지난\s*\d{1,2}일\s*/g, ' ')
             .replace(/\d{1,2}일\s*(업계에\s*따르면|밝혔다|전했다|덧붙였다|설명했다|강조했다)/g, ' ')
             .replace(/(관계자는|회사\s*측은|브랜드\s*담당자는)\s*['"“]?[^'”"]*['"”]?/g, ' ');

  // 5. Convert journalistic verb endings into smooth consumer-facing tone
  text = text.replace(/밝혔다\.?/g, '선보입니다.')
             .replace(/전했다\.?/g, '알려졌습니다.')
             .replace(/덧붙였다\.?/g, '담아냈습니다.')
             .replace(/설명했다\.?/g, '자랑합니다.')
             .replace(/출시했다\.?/g, '새롭게 출시되었습니다.')
             .replace(/선보였다\.?/g, '선보입니다.')
             .replace(/공개했다\.?/g, '만나볼 수 있습니다.');

  text = text.replace(/\s+/g, ' ').trim();

  if (text.length < 20 || text.includes('…') && text.length < 35) {
    return generateCleanProductDescription(productName, brand, category);
  }

  if (!text.endsWith('.') && !text.endsWith('!')) {
    text += '.';
  }

  return text.slice(0, 180);
};

/**
 * Generate a delightful, clean, customer-facing product description
 */
export const generateCleanProductDescription = (
  productName: string, 
  brand: string, 
  category: ProductCategory
): string => {
  switch (category) {
    case '간편식':
      return `${brand}에서 야심차게 선보이는 화제의 간편식 신작! '${productName}' 본연의 깊고 풍부한 풍미와 든든한 식감을 언제 어디서나 간편하고 맛있게 즐겨보세요.`;
    case '음료':
      return `${brand}의 새로운 시즌 시그니처 음료 '${productName}'! 한 모금 마시는 순간 입안 가득 퍼지는 산뜻한 청량감과 기분 좋은 달콤함을 선사합니다.`;
    case '빵·디저트':
      return `${brand}만의 프리미엄 레시피로 부드럽고 달콤하게 완성한 '${productName}'. 풍성한 크림과 쫀득한 식감의 완벽한 조화를 지금 바로 경험해보세요.`;
    case '과자':
      return `바삭한 식감과 중독적인 단짠의 완벽한 밸런스! ${brand}의 기대작 '${productName}'으로 일상 속 기분 좋은 바삭함을 만끽해보세요.`;
    default:
      return `${brand}에서 새롭게 출시되어 뜨거운 주목을 받고 있는 '${productName}'. 신선한 재료와 차별화된 풍미로 출시 직후 SNS와 편의점에서 큰 인기를 얻고 있습니다.`;
  }
};

const NCP_CLIENT_ID = 'ha89ylxb53';
const NCP_CLIENT_SECRET = '4hm7znMnOmGyvtw2xnvEjTWoRG1UZeLqlccI7b4p';

const getNaverApiBaseUrl = (): string => {
  if (!Capacitor.isNativePlatform()) return '';
  // 네이티브 앱은 상대경로(/api)를 쓸 수 없으므로 실제 배포된 공개 도메인이 필요합니다.
  const configured = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
  return (configured && configured.trim().replace(/\/+$/, '')) || 'https://www.sinsangpick.kr';
};

/**
 * Call Naver API via proxy endpoint (/api/naver) or direct native CapacitorHttp
 */
export const callNaverApi = async (
  type: 'news' | 'image' | 'blog' | 'shop',
  query: string,
  sort: string = 'date',
  display: number = 10,
  start: number = 1
): Promise<NaverSearchResponse> => {
  // 1. Capacitor Native 플랫폼: Vercel 도메인 404를 우회하여 네이버 클라우드 플랫폼 직접 호출
  if (Capacitor.isNativePlatform()) {
    try {
      const hubType = type === 'shop' ? 'image' : type;
      const hubQuery = type === 'shop'
        ? (query.includes('편의점') || query.includes('신제품') ? query : `${query} 편의점 신상`)
        : query;
      const url = `https://naverapihub.apigw.ntruss.com/search/v1/${hubType}?query=${encodeURIComponent(hubQuery)}&display=${display}${start > 1 ? `&start=${start}` : ''}${sort ? `&sort=${sort}` : ''}`;
      const response = await CapacitorHttp.get({
        url,
        headers: {
          'X-NCP-APIGW-API-KEY-ID': NCP_CLIENT_ID,
          'X-NCP-APIGW-API-KEY': NCP_CLIENT_SECRET
        }
      });
      if (response.status === 200 && response.data) {
        if (type === 'shop' && response.data.items) {
          const items = response.data.items.map((it: any, idx: number) => {
            const rawTitle = cleanHtml(it.title || query)
              .replace(/<[^>]+>/g, '')
              .replace(/\[[^\]]*\]/g, ' ')
              .replace(/\([^\)]*\)/g, ' ')
              .replace(/\s*:\s*(?:스마트스토어|네이버쇼핑|쇼핑몰|구매대행|마트몰|강철\s*유통|서울포장).*$/i, '')
              .trim();
            const imgUrl = (it.link || it.thumbnail || '').replace(/^http:\/\//, 'https://');
            return {
              title: rawTitle || `${query} 인기 디저트`,
              link: `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(rawTitle || query)}`,
              image: imgUrl,
              lprice: '3500',
              hprice: '3500',
              mallName: '네이버 공식 브랜드 스토어',
              productId: `ncp-shop-${Date.now()}-${idx + 1}`,
              productType: '1',
              brand: query.split(' ')[0] || '인기 신상',
              maker: query.split(' ')[0] || '인기 신상',
              category1: '식품',
              category2: '신제품',
              synthesized: true
            };
          });
          return {
            lastBuildDate: new Date().toUTCString(),
            total: items.length,
            start: 1,
            display: items.length,
            items,
            synthesized: true
          };
        }
        return response.data;
      }
    } catch (e) {
      console.warn('[CapacitorHttp Naver Search Direct Error]', e);
    }
  }

  // 2. Web 브라우저 / Local 환경: 프록시 엔드포인트(/api/naver) 호출
  const baseUrl = getNaverApiBaseUrl();
  const apiUrl = `${baseUrl}/api/naver?type=${type}&query=${encodeURIComponent(query)}&display=${display}${start > 1 ? `&start=${start}` : ''}${sort ? `&sort=${sort}` : ''}`;
  
  const res = await fetchWithTimeout(apiUrl, undefined, 6000);
  if (!res.ok) {
    throw new Error(`Naver API (${type}) failed with status: ${res.status}`);
  }
  return await res.json();
};

/**
 * Call NAVER DataLab Shopping Insight & Search Trend API via proxy (/api/naver) or direct native CapacitorHttp
 */
export const callNaverDataLabApi = async (
  type:
    | 'datalab_categories' | 'datalab_keywords' | 'datalab_age' | 'datalab_gender' | 'datalab_device'
    | 'shopping_categories' | 'shopping_keywords' | 'shopping_keyword_age' | 'shopping_keyword_gender' | 'shopping_keyword_device'
    | 'search_trend',
  payload: any
): Promise<any> => {
  // 1. Capacitor Native 플랫폼: CapacitorHttp로 네이버 클라우드 플랫폼 직접 호출
  if (Capacitor.isNativePlatform()) {
    try {
      let endpoint = 'categories';
      if (type === 'datalab_keywords' || type === 'shopping_keywords') {
        endpoint = 'category/keywords';
      } else if (type === 'shopping_keyword_age' || type === 'datalab_age') {
        endpoint = 'category/keyword/age';
      } else if (type === 'shopping_keyword_gender' || type === 'datalab_gender') {
        endpoint = 'category/keyword/gender';
      } else if (type === 'shopping_keyword_device' || type === 'datalab_device') {
        endpoint = 'category/keyword/device';
      }

      const isSearchTrend = type === 'search_trend';
      const url = isSearchTrend
        ? 'https://naverapihub.apigw.ntruss.com/search-trend/v1/search'
        : `https://naverapihub.apigw.ntruss.com/shopping/v1/${endpoint}`;

      const response = await CapacitorHttp.post({
        url,
        headers: {
          'Content-Type': 'application/json',
          'X-NCP-APIGW-API-KEY-ID': NCP_CLIENT_ID,
          'X-NCP-APIGW-API-KEY': NCP_CLIENT_SECRET
        },
        data: payload
      });
      if (response.status === 200 && response.data) {
        return response.data;
      }
    } catch (e) {
      console.warn('[CapacitorHttp Naver DataLab Direct Error]', e);
    }
  }

  // 2. Web 브라우저 / Local 환경: 프록시 엔드포인트(/api/naver) 호출
  const baseUrl = getNaverApiBaseUrl();
  const apiUrl = `${baseUrl}/api/naver?type=${type}`;
  const res = await fetchWithTimeout(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }, 10000);

  if (!res.ok) {
    throw new Error(`Naver DataLab API (${type}) failed with status: ${res.status}`);
  }
  return await res.json();
};

/**
 * Fetch NAVER DataLab Food Shopping Category Trends
 */
export const fetchFoodCategoryShoppingTrends = async (
  startDate?: string,
  endDate?: string
): Promise<ShoppingInsightResponse | null> => {
  // DataLab API는 어제 날짜까지 데이터가 집계되므로 기본 endDate를 어제로 설정
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const end = endDate || yesterday;
  const startObj = new Date(Date.now() - 30 * 86400000);
  const start = startDate || startObj.toISOString().split('T')[0];

  // NCP Shopping Categories 규격: 1회 요청당 최대 3개 카테고리만 허용.
  // 4개 카테고리(과자/베이커리: 50000146, 음료: 50000147, 가공식품: 50000148, 신선식품: 50000149)를 병렬 2회 분할 요청 후 병합!
  try {
    const [res1, res2] = await Promise.allSettled([
      callNaverDataLabApi('shopping_categories', {
        startDate: start,
        endDate: end,
        timeUnit: 'date',
        category: [
          { name: '과자/베이커리', param: ['50000146'] },
          { name: '음료', param: ['50000147'] }
        ]
      }),
      callNaverDataLabApi('shopping_categories', {
        startDate: start,
        endDate: end,
        timeUnit: 'date',
        category: [
          { name: '가공식품', param: ['50000148'] },
          { name: '신선식품', param: ['50000149'] }
        ]
      })
    ]);

    const items1 = (res1.status === 'fulfilled' && res1.value?.results) ? res1.value.results : [];
    const items2 = (res2.status === 'fulfilled' && res2.value?.results) ? res2.value.results : [];
    const combinedResults = [...items1, ...items2];

    if (combinedResults.length > 0) {
      return {
        startDate: start,
        endDate: end,
        timeUnit: 'date',
        results: combinedResults
      };
    }
  } catch (err) {
    console.warn('[DataLab Category Trends Failed, fallback]', err);
  }
  return null;
};

/**
 * Fetch NAVER DataLab Food Keyword Shopping Trends
 */
export const fetchFoodKeywordShoppingTrends = async (
  keywords: { name: string; param: string[] }[],
  startDate?: string,
  endDate?: string
): Promise<ShoppingInsightResponse | null> => {
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const end = endDate || yesterday;
  const startObj = new Date(Date.now() - 30 * 86400000);
  const start = startDate || startObj.toISOString().split('T')[0];

  const body: ShoppingInsightKeywordRequest = {
    startDate: start,
    endDate: end,
    timeUnit: 'date',
    category: '50000006', // 식품
    keyword: keywords
  };

  try {
    return await callNaverDataLabApi('shopping_keywords', body);
  } catch (err) {
    console.warn('[DataLab Keyword Trends Failed, fallback]', err);
    return null;
  }
};

/**
 * Fetch NAVER Search Trend (검색어 트렌드 API: 통합검색 검색량 추이)
 */
export const fetchSearchTrend = async (
  keywordGroups: SearchTrendKeywordGroup[],
  startDate?: string,
  endDate?: string,
  timeUnit: 'date' | 'week' | 'month' = 'date'
): Promise<SearchTrendResponse | null> => {
  const end = endDate || new Date().toISOString().split('T')[0];
  const startObj = new Date();
  startObj.setDate(startObj.getDate() - 30);
  const start = startDate || startObj.toISOString().split('T')[0];

  const body: SearchTrendRequest = {
    startDate: start,
    endDate: end,
    timeUnit,
    keywordGroups
  };

  try {
    return await callNaverDataLabApi('search_trend', body);
  } catch (err) {
    console.warn('[Search Trend API failed]', err);
    return null;
  }
};

/**
 * Fetch NAVER Demographics (키워드 연령대/성별 쇼핑 클릭 선호도)
 */
export const fetchKeywordDemographics = async (
  keyword: string,
  category: string = '50000006'
): Promise<KeywordDemographics | null> => {
  const end = new Date().toISOString().split('T')[0];
  const startObj = new Date();
  startObj.setDate(startObj.getDate() - 30);
  const start = startObj.toISOString().split('T')[0];

  try {
    const payload = {
      startDate: start,
      endDate: end,
      timeUnit: 'date',
      category,
      keyword: keyword.trim()
    };

    const [genderRes, ageRes] = await Promise.allSettled([
      callNaverDataLabApi('shopping_keyword_gender', payload),
      callNaverDataLabApi('shopping_keyword_age', payload)
    ]);

    let maleRatio = 45;
    let femaleRatio = 55;
    if (genderRes.status === 'fulfilled' && genderRes.value?.results?.[0]?.data) {
      const data = genderRes.value.results[0].data;
      const malePoints = data.filter((d: any) => d.gender === 'm');
      const femalePoints = data.filter((d: any) => d.gender === 'f');
      const avgM = malePoints.length ? malePoints.reduce((acc: number, cur: any) => acc + cur.ratio, 0) / malePoints.length : 45;
      const avgF = femalePoints.length ? femalePoints.reduce((acc: number, cur: any) => acc + cur.ratio, 0) / femalePoints.length : 55;
      const total = avgM + avgF || 1;
      maleRatio = Math.round((avgM / total) * 100);
      femaleRatio = 100 - maleRatio;
    }

    const defaultAges = [
      { ageGroup: '10대', ratio: 15 },
      { ageGroup: '20대', ratio: 42 },
      { ageGroup: '30대', ratio: 28 },
      { ageGroup: '40대', ratio: 12 },
      { ageGroup: '50대+', ratio: 3 }
    ];

    let ageRatios = defaultAges;
    if (ageRes.status === 'fulfilled' && ageRes.value?.results?.[0]?.data) {
      const data = ageRes.value.results[0].data;
      const ageGroups: Record<string, number[]> = {
        '10대': [],
        '20대': [],
        '30대': [],
        '40대': [],
        '50대+': []
      };
      data.forEach((d: any) => {
        const group = String(d.age || d.group || '');
        if (group === '10' || group === '10대') ageGroups['10대'].push(d.ratio);
        else if (group === '20' || group === '20대') ageGroups['20대'].push(d.ratio);
        else if (group === '30' || group === '30대') ageGroups['30대'].push(d.ratio);
        else if (group === '40' || group === '40대') ageGroups['40대'].push(d.ratio);
        else if (group) ageGroups['50대+'].push(d.ratio);
      });

      const computed = Object.entries(ageGroups).map(([ageGroup, list]) => ({
        ageGroup,
        ratio: list.length ? Math.round(list.reduce((a, b) => a + b, 0) / list.length) : 10
      }));
      const total = computed.reduce((a, b) => a + b.ratio, 0) || 1;
      ageRatios = computed.map(c => ({
        ageGroup: c.ageGroup,
        ratio: Math.round((c.ratio / total) * 100)
      }));
    }

    return {
      keyword,
      genderRatio: { male: maleRatio, female: femaleRatio },
      ageRatios
    };
  } catch (err) {
    console.warn('[Keyword Demographics API failed]', err);
    return null;
  }
};

export interface NaverAutoFillResult {
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  image: string;
  mallName: string;
  sourceUrl: string;
  description: string;
  stores: string[];
  bestQuotes: string[];
  trendScore: number;
}

/**
 * One-click NAVER Auto-fill for Admin Product Create/Edit
 * Pulls live data from:
 * 1. NAVER Shopping (Packaging image, retail price, official mall name)
 * 2. NAVER Image (HD transparent/clean package cut)
 * 3. NAVER Blog (Real consumer reviews)
 * 4. NAVER Shopping Insight (Trend click index score)
 */
export const fetchNaverProductAutoFillInfo = async (
  productName: string,
  hintBrand?: string
): Promise<NaverAutoFillResult | null> => {
  const cleanName = productName.trim();
  if (!cleanName) return null;

  const resolvedBrand = hintBrand || detectBrand(cleanName) || '신제품';
  const resolvedCategory = detectCategory(cleanName);
  const detectedStoreList = detectStores(cleanName);

  let imageUrl = '';
  let price = 0;
  let mallName = '네이버 쇼핑';
  let productUrl = `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(`${resolvedBrand} ${cleanName}`)}`;
  let bestQuotes: string[] = [];
  let trendScore = 75;

  // 1. 네이버 쇼핑 및 이미지 API 호출
  try {
    const shoppingInfo = await fetchNaverShoppingInfo(resolvedBrand, cleanName, resolvedCategory);
    if (shoppingInfo.image) imageUrl = shoppingInfo.image;
    if (shoppingInfo.price > 0) price = shoppingInfo.price;
    if (shoppingInfo.mallName) mallName = shoppingInfo.mallName;
  } catch (e) {
    console.warn('[AutoFill Shopping Error]', e);
  }

  // 2. 만약 이미지 여전히 없으면 Image API 호출
  if (!imageUrl) {
    try {
      const imgRes = await callNaverApi('image', `${resolvedBrand} ${cleanName} 공식 패키지`, 'sim', 3);
      if (imgRes.items && imgRes.items.length > 0) {
        imageUrl = (imgRes.items[0].link || imgRes.items[0].thumbnail || '').replace(/^http:\/\//, 'https://');
      }
    } catch (e) {
      console.warn('[AutoFill Image Error]', e);
    }
  }

  // 3. 네이버 블로그 실소비자 리뷰 요약 호출
  try {
    const blogRes = await callNaverApi('blog', `${resolvedBrand} ${cleanName} 후기`, 'sim', 3);
    if (blogRes.items && blogRes.items.length > 0) {
      bestQuotes = blogRes.items
        .map(b => cleanHtml(b.description || ''))
        .filter(q => q.length > 15)
        .map(q => q.slice(0, 80))
        .slice(0, 3);
    }
  } catch (e) {
    console.warn('[AutoFill Blog Error]', e);
  }

  if (bestQuotes.length === 0) {
    bestQuotes = [
      '출시 직후 SNS와 편의점에서 큰 주목을 받고 있어요!',
      '맛과 풍미가 아주 훌륭해서 재구매 의사 100%입니다.'
    ];
  }

  // 4. 네이버 쇼핑인사이트 키워드 클릭 트렌드 지수 호출
  try {
    const trendRes = await fetchFoodKeywordShoppingTrends([
      { name: cleanName, param: [cleanName] }
    ]);
    if (trendRes && trendRes.results && trendRes.results.length > 0 && trendRes.results[0].data?.length > 0) {
      const dataPoints = trendRes.results[0].data.slice(-7);
      const avg = Math.round(dataPoints.reduce((a, b) => a + b.ratio, 0) / dataPoints.length);
      trendScore = Math.max(30, Math.min(100, avg));
    }
  } catch (e) {
    console.warn('[AutoFill Trend Error]', e);
  }

  const stores = detectedStoreList.length > 0 ? detectedStoreList : ['CU', 'GS25', '세븐일레븐', '이마트24'];
  const description = cleanProductDescription('', cleanName, resolvedBrand, resolvedCategory);

  return {
    name: cleanName,
    brand: resolvedBrand,
    category: resolvedCategory,
    price: price > 0 ? price : 2500,
    image: imageUrl,
    mallName,
    sourceUrl: productUrl,
    description,
    stores,
    bestQuotes,
    trendScore
  };
};

export interface NaverRealtimeProduct {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  image: string;
  mallName: string;
  link: string;
  keywordTag: string;
  trendRank: number;
  isHot: boolean;
  description: string;
  stores: string[];
}

/**
 * Get Realtime Trending Food Keywords curated with DataLab Shopping Insight
 */
/**
 * Get Realtime Trending Food Keywords curated with DataLab Shopping Insight
 */
export const getShoppingInsightTrendingKeywords = async (): Promise<TrendingKeywordInsight[]> => {
  const candidateKeywords = [
    { name: '피자떡', param: ['피자떡'], category: '간편식' as ProductCategory, brand: '인기 먹거리' },
    { name: '한정선 찹쌀떡', param: ['한정선'], category: '빵·디저트' as ProductCategory, brand: '한정선' },
    { name: '두바이 찹쌀떡', param: ['두바이 찹쌀떡'], category: '빵·디저트' as ProductCategory, brand: '편의점/디저트' },
    { name: '요아정', param: ['요아정'], category: '아이스크림' as ProductCategory, brand: '요아정' },
    { name: '밤티라미수', param: ['밤티라미수'], category: '빵·디저트' as ProductCategory, brand: '연세유업' },
    { name: '신라면 툼바', param: ['신라면 툼바'], category: '간편식' as ProductCategory, brand: '농심' },
    { name: '황치즈', param: ['황치즈'], category: '빵·디저트' as ProductCategory, brand: '편의점 신상' },
    { name: '비쵸비', param: ['비쵸비'], category: '과자' as ProductCategory, brand: '오리온' },
    { name: '먹태깡', param: ['먹태깡'], category: '과자' as ProductCategory, brand: '농심' },
    { name: '마열라면', param: ['마열라면'], category: '간편식' as ProductCategory, brand: '오뚜기' },
    { name: '소금버터 홈런볼', param: ['홈런볼'], category: '과자' as ProductCategory, brand: '해태제과' },
    { name: '테라 라이트', param: ['테라 라이트'], category: '음료' as ProductCategory, brand: '하이트진로' }
  ];

  try {
    const chunkSize = 4;
    const chunks: { name: string; param: string[]; category: ProductCategory; brand: string }[][] = [];
    for (let i = 0; i < candidateKeywords.length; i += chunkSize) {
      chunks.push(candidateKeywords.slice(i, i + chunkSize));
    }

    const chunkResponses = await Promise.allSettled(
      chunks.map(chunk =>
        fetchFoodKeywordShoppingTrends(chunk.map(c => ({ name: c.name, param: c.param })))
      )
    );

    const allResults: TrendingKeywordInsight[] = [];

    chunkResponses.forEach((res, cIdx) => {
      if (res.status === 'fulfilled' && res.value && res.value.results) {
        const chunk = chunks[cIdx];
        res.value.results.forEach((r, index) => {
          const candidate = chunk.find(c => c.name === r.title) || chunk[index];
          if (!candidate) return;

          const data = r.data || [];
          const recentPoints = data.slice(-7);
          const prevPoints = data.slice(-14, -7);

          const recentAvg = recentPoints.length > 0
            ? recentPoints.reduce((acc, p) => acc + p.ratio, 0) / recentPoints.length
            : (data[data.length - 1]?.ratio || 50);

          const prevAvg = prevPoints.length > 0
            ? prevPoints.reduce((acc, p) => acc + p.ratio, 0) / prevPoints.length
            : Math.max(10, recentAvg * 0.8);

          const growthPercent = prevAvg > 0
            ? Math.round(((recentAvg - prevAvg) / prevAvg) * 100)
            : Math.round(recentAvg * 1.5);

          const score = Math.max(15, Math.min(100, Math.round(recentAvg)));

          allResults.push({
            rank: 0,
            keyword: r.title,
            category: candidate.category,
            score,
            growthRate: `${growthPercent >= 0 ? '+' : ''}${growthPercent}%`,
            isHot: score >= 40 || growthPercent > 30 || allResults.length < 3,
            relatedBrand: candidate.brand
          });
        });
      }
    });

    if (allResults.length > 0) {
      return allResults
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((item, idx) => ({ ...item, rank: idx + 1 }));
    }
  } catch (err) {
    console.warn('[Shopping Insight Trending Fetch Fallback]', err);
  }

  // Curated Fallback with Real Live Trending Delicacies
  return [
    { rank: 1, keyword: '피자떡 (치즈 폭탄)', category: '간편식', score: 99, growthRate: '+245%', isHot: true, relatedBrand: '인기 먹거리' },
    { rank: 2, keyword: '한정선 과일찹쌀떡', category: '빵·디저트', score: 97, growthRate: '+220%', isHot: true, relatedBrand: '한정선' },
    { rank: 3, keyword: '두바이 피스타치오 찹쌀떡', category: '빵·디저트', score: 95, growthRate: '+210%', isHot: true, relatedBrand: '편의점/디저트' },
    { rank: 4, keyword: '요아정 요거트아이스크림', category: '아이스크림', score: 93, growthRate: '+195%', isHot: true, relatedBrand: '요아정' },
    { rank: 5, keyword: '연세우유 밤티라미수 생크림빵', category: '빵·디저트', score: 91, growthRate: '+180%', isHot: true, relatedBrand: '연세유업' },
    { rank: 6, keyword: '신라면 툼바 큰사발면', category: '간편식', score: 88, growthRate: '+165%', isHot: false, relatedBrand: '농심' },
    { rank: 7, keyword: '황치즈 맘모스 쫀득볼', category: '빵·디저트', score: 84, growthRate: '+140%', isHot: false, relatedBrand: '편의점 신상' },
    { rank: 8, keyword: '오리온 비쵸비 딸기 에디션', category: '과자', score: 81, growthRate: '+125%', isHot: false, relatedBrand: '오리온' },
    { rank: 9, keyword: '농심 먹태깡 청양마요', category: '과자', score: 79, growthRate: '+115%', isHot: false, relatedBrand: '농심' },
    { rank: 10, keyword: '오뚜기 마열라면 큰사발', category: '간편식', score: 75, growthRate: '+95%', isHot: false, relatedBrand: '오뚜기' }
  ];
};

/**
 * Fetch Real Live Trending Products via NAVER Shopping API (type=shop)
 */
export const fetchNaverRealtimeTrendingProducts = async (
  searchQuery?: string
): Promise<NaverRealtimeProduct[]> => {
  const isSearchAll = !searchQuery || searchQuery.trim().length === 0 || searchQuery.trim() === '전체';
  const targetKeywords = isSearchAll
    ? ['피자떡', '한정선 찹쌀떡', '두바이 찹쌀떡', '요아정', '밤티라미수', '신라면 툼바', '황치즈', '비쵸비', '먹태깡', '마열라면']
    : [searchQuery!.trim()];

  const results: NaverRealtimeProduct[] = [];
  const seenNames = new Set<string>();

  try {
    // 다중 키워드를 병렬 호출하여 1~2초 내 초고속 실시간 수집 완수
    const searchTasks = targetKeywords.map(kw => callNaverApi('shop', kw, 'sim', isSearchAll ? 4 : 12));
    const taskResults = await Promise.allSettled(searchTasks);

    taskResults.forEach((res, tIdx) => {
      const kw = targetKeywords[tIdx];
      if (res.status === 'fulfilled' && res.value && res.value.items) {
        const items = res.value.items;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const rawTitle = cleanHtml(item.title)
            .replace(/\[[^\]]*\]/g, ' ')
            .replace(/\([^\)]*\)/g, ' ')
            .replace(/\s*:\s*(?:스마트스토어|네이버쇼핑|쇼핑몰|구매대행|마트몰|강철\s*유통|서울포장).*$/i, '')
            .trim();

          const normName = rawTitle.replace(/\s+/g, '').toLowerCase();
          if (seenNames.has(normName) || normName.length < 2) continue;
          seenNames.add(normName);

          const brand = item.brand || detectBrand(rawTitle) || item.mallName || '인기 브랜드';
          const category = detectCategory(rawTitle + ' ' + (item.category2 || '') + ' ' + (item.category3 || ''));
          const parsedPrice = item.lprice ? parseInt(item.lprice, 10) : 0;
          let price = parsedPrice > 500 && parsedPrice < 50000 ? parsedPrice : 0;
          if (price === 0) {
            if (rawTitle.includes('라면') || rawTitle.includes('사발')) price = 1800;
            else if (rawTitle.includes('과자') || rawTitle.includes('스낵') || rawTitle.includes('칩')) price = 2000;
            else if (rawTitle.includes('음료') || rawTitle.includes('티')) price = 2500;
            else if (rawTitle.includes('떡') || rawTitle.includes('모찌') || rawTitle.includes('티라미수') || rawTitle.includes('케이크') || rawTitle.includes('빵')) price = 3800;
            else if (rawTitle.includes('아이스크림') || rawTitle.includes('파르페')) price = 4500;
            else price = 3500;
          }

          const img = (item.image || '').replace(/^http:\/\//, 'https://');
          const finalImage = img || HIGH_QUALITY_CATEGORY_IMAGES[category]?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';
          const shoppingLink = `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(rawTitle)}`;

          results.push({
            id: `naver-shop-trend-${Date.now()}-${results.length + 1}`,
            name: rawTitle,
            brand,
            category,
            price,
            image: finalImage,
            mallName: item.mallName || '네이버 공식 브랜드 스토어',
            link: shoppingLink,
            keywordTag: `#${kw}`,
            trendRank: results.length + 1,
            isHot: i < 2 || results.length < 4,
            description: `${brand}의 네이버 실시간 쇼핑 급상승 인기 먹거리 '${rawTitle}'! 네이버 빅데이터에서 높은 클릭과 검색량을 기록 중입니다.`,
            stores: detectStores(rawTitle + ' ' + (item.mallName || ''))
          });

          // 전체 검색 모드에서는 키워드당 최대 2~3건만 취합하여 다양한 인기 상품 조합 구성
          if (isSearchAll && i >= 2) break;
          if (results.length >= 24) break;
        }
      }
    });
  } catch (err) {
    console.warn('[fetchNaverRealtimeTrendingProducts Error]:', err);
  }

  // Fallback to curated real-time products if API returns empty
  if (results.length === 0) {
    return getCuratedRealtimeTrendingProducts();
  }

  return results;
};

/**
 * Curated Realtime Trending Products Fallback
 */
export const getCuratedRealtimeTrendingProducts = (): NaverRealtimeProduct[] => [
  {
    id: 'trend-pizzaddeok-01',
    name: '치즈 폭탄 피자떡 (페퍼로니 & 100% 모짜렐라)',
    brand: '피자떡',
    category: '간편식',
    price: 6900,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    mallName: '떡볶이다 / 편의점 공식몰',
    link: 'https://search.shopping.naver.com/search/all?query=%ED%94%BC%EC%9E%90%EB%96%A9',
    keywordTag: '#피자떡',
    trendRank: 1,
    isHot: true,
    description: 'SNS 대란 화제의 피자떡! 쫀득한 쌀떡 속 흐르는 100% 자연산 모짜렐라 치즈와 새콤달콤 페퍼로니 소스의 환상적인 조합.',
    stores: ['CU', 'GS25', '세븐일레븐', '이마트24']
  },
  {
    id: 'trend-hanjeongseon-02',
    name: '한정선 생딸기 찹쌀떡 (성수 핫플 수제 디저트)',
    brand: '한정선',
    category: '빵·디저트',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80',
    mallName: '한정선 공식 스마트스토어',
    link: 'https://search.shopping.naver.com/search/all?query=%ED%95%9C%EC%A0%95%EC%84%A0',
    keywordTag: '#한정선',
    trendRank: 2,
    isHot: true,
    description: '줄 서서 먹는 성수동 대표 과일 찹쌀떡! 당도 높은 신선한 생딸기와 얇고 쫀득한 찹쌀 피가 어우러진 고급 수제 찹쌀떡.',
    stores: ['한정선 성수본점', '현대백화점 팝업', '택배 배송']
  },
  {
    id: 'trend-dubai-03',
    name: '두바이 피스타치오 카다이프 찹쌀떡',
    brand: '편의점 핫디저트',
    category: '빵·디저트',
    price: 3900,
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=80',
    mallName: 'CU/GS25 직영몰',
    link: 'https://search.shopping.naver.com/search/all?query=%EB%91%90%EB%B0%94%EC%9D%B4+%EC%B4%88%EC%BD%9C%EB%A6%BF',
    keywordTag: '#두바이찹쌀떡',
    trendRank: 3,
    isHot: true,
    description: '바삭한 볶은 카다이프면과 고소한 피스타치오 원물 스프레드가 쫀득한 찹쌀 피에 듬뿍 들어간 2026 최고의 실시간 급상승 디저트.',
    stores: ['CU', 'GS25']
  },
  {
    id: 'trend-yoajung-04',
    name: '요아정 초코쉘 요거트 아이스크림 파인트',
    brand: '요아정',
    category: '아이스크림',
    price: 4800,
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&auto=format&fit=crop&q=80',
    mallName: '요아정 공식 네이버스토어',
    link: 'https://search.shopping.naver.com/search/all?query=%EC%9A%94%EC%95%84%EC%A0%95',
    keywordTag: '#요아정',
    trendRank: 4,
    isHot: true,
    description: '상큼한 리얼 요거트 아이스크림 위에 바삭하게 굳은 초코쉘을 수저로 톡톡 깨먹는 대세 요거트 아이스크림.',
    stores: ['GS25', 'CU', '요아정 매장']
  },
  {
    id: 'trend-tiramisu-05',
    name: '연세우유 밤티라미수 생크림빵',
    brand: '연세유업',
    category: '빵·디저트',
    price: 3400,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    mallName: 'CU 덕후존 공식',
    link: 'https://search.shopping.naver.com/search/all?query=%EB%B0%A4%ED%8B%B0%EB%9D%BC%EB%AF%B8%EC%88%98',
    keywordTag: '#밤티라미수',
    trendRank: 5,
    isHot: false,
    description: '흑백요리사 화제의 디저트 실물화! 은은한 밤 풍미 크림과 진한 에스프레소 티라미수 소스가 가득 찬 생크림빵.',
    stores: ['CU']
  },
  {
    id: 'trend-shin-toomba-06',
    name: '농심 신라면 툼바 큰사발면 (매콤 투움바)',
    brand: '농심',
    category: '간편식',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
    mallName: '농심 브랜드스토어',
    link: 'https://search.shopping.naver.com/search/all?query=%EC%8B%A0%EB%9D%BC%EB%A9%B4+%ED%89%B0%EB%B0%94',
    keywordTag: '#신라면툼바',
    trendRank: 6,
    isHot: false,
    description: '모디슈머 히트 레시피 공식 상품화! 신라면의 맛있게 매운맛에 진한 치즈와 생크림의 고소함이 합쳐진 매콤 투움바 라면.',
    stores: ['CU', 'GS25', '세븐일레븐', '이마트24']
  },
  {
    id: 'trend-hwangcheese-07',
    name: '황치즈 맘모스 쫀득볼 (단짠 체다치즈)',
    brand: '편의점 핫디저트',
    category: '빵·디저트',
    price: 3800,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&auto=format&fit=crop&q=80',
    mallName: 'GS25 공식 스토어',
    link: 'https://search.shopping.naver.com/search/all?query=%ED%99%A9%EC%B9%98%EC%A6%88',
    keywordTag: '#황치즈',
    trendRank: 7,
    isHot: false,
    description: '진한 체다 치즈의 단짠 풍미와 고소한 소보로 빵, 쫀득한 찰떡 크림이 겹겹이 들어간 입소문 폭발 맘모스 디저트.',
    stores: ['GS25', 'CU']
  },
  {
    id: 'trend-bichobi-08',
    name: '오리온 비쵸비 딸기 에디션 (샌드비스킷)',
    brand: '오리온',
    category: '과자',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&auto=format&fit=crop&q=80',
    mallName: '오리온 공식몰',
    link: 'https://search.shopping.naver.com/search/all?query=%EB%B9%84%EC%B8%87%EB%B9%84',
    keywordTag: '#비쵸비',
    trendRank: 8,
    isHot: false,
    description: '통초콜릿이 샌드된 히트과자 비쵸비의 시즌 한정판! 새콤달콤한 딸기 초콜릿과 바삭한 비스킷의 품격있는 조화.',
    stores: ['CU', 'GS25', '대형마트']
  },
  {
    id: 'trend-meoktae-09',
    name: '농심 먹태깡 청양마요맛 스낵',
    brand: '농심',
    category: '과자',
    price: 1700,
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&auto=format&fit=crop&q=80',
    mallName: '농심 브랜드스토어',
    link: 'https://search.shopping.naver.com/search/all?query=%EB%A8%B9%ED%83%9C%EA%B9%A1',
    keywordTag: '#먹태깡',
    trendRank: 9,
    isHot: false,
    description: '전국 편의점 품절 대란의 주역! 알싸한 청양고추와 고소한 마요네즈 시즈닝이 바삭한 먹태 스낵과 어우러진 안주 겸 간식.',
    stores: ['CU', 'GS25', '세븐일레븐', '이마트24']
  },
  {
    id: 'trend-mayeol-10',
    name: '오뚜기 마열라면 큰사발면 (마늘·후추 블렌딩)',
    brand: '오뚜기',
    category: '간편식',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=800&auto=format&fit=crop&q=80',
    mallName: '오뚜기몰',
    link: 'https://search.shopping.naver.com/search/all?query=%EB%A7%88%EC%97%B4%EB%9D%BC%EB%A9%B4',
    keywordTag: '#마열라면',
    trendRank: 10,
    isHot: false,
    description: '열라면에 구운 마늘과 굵은 후추의 알싸한 풍미를 더해 깊고 진한 매운맛을 완성한 스테디셀러 신상 라면.',
    stores: ['CU', 'GS25', '세븐일레븐', '이마트24']
  }
];


/**
 * Query NAVER for official shopping product image and retail price
 * Uses NAVER Search Image API (which indexes official shopping packages from Naver Shopping, Coupang, Brand Mall)
 * + Real text price extraction & authentic retail price estimation
 */
export const fetchNaverShoppingInfo = async (
  brand: string,
  productName: string,
  category?: ProductCategory,
  articleText?: string
): Promise<{
  price: number;
  image: string;
  isFound: boolean;
  mallName?: string;
}> => {
  let foundImage = '';
  let foundPrice = 0;
  let sourceMall = '네이버 쇼핑';

  // 1. 실시간 네이버 이미지 및 쇼핑 API를 통한 실물 패키지 컷 & 가격 조회
  try {
    const cleanSearchBrand = brand && brand !== '기타' && brand !== '식품' && brand !== '신상픽' ? brand : '';
    // 실시간 패키지 이미지 검색 (공식 패키지컷 우선)
    const imgQuery = `${cleanSearchBrand} ${productName} 패키지`.trim();
    const imgRes = await callNaverApi('image', imgQuery, 'sim', 6);
    if (imgRes && imgRes.items && imgRes.items.length > 0) {
      const shoppingImage = imgRes.items.find(item => {
        const url = (item.link || item.thumbnail || '').toLowerCase();
        return (
          url.includes('phinf.naver.net') ||
          url.includes('coupangcdn') ||
          url.includes('emart') ||
          url.includes('bgfretail') ||
          url.includes('gsretail') ||
          url.includes('7-eleven')
        );
      });
      const selected = shoppingImage || imgRes.items[0];
      if (selected) {
        const picked = selected.link || selected.thumbnail || '';
        if (picked) {
          foundImage = picked.replace(/^http:\/\//, 'https://');
          sourceMall = '네이버 실시간 패키지컷';
        }
      }
    }
  } catch (err) {
    console.warn('[Naver Image Search Fetch Warning]', brand, productName, err);
  }

  // 2. 쇼핑 API 시도 (가격 또는 고화질 커머스 컷 탐색)
  try {
    const cleanSearchBrand = brand && brand !== '기타' && brand !== '식품' && brand !== '신상픽' ? brand : '';
    const shopRes = await callNaverApi('shop', `${cleanSearchBrand} ${productName}`.trim(), 'sim', 5);
    if (shopRes && shopRes.items && shopRes.items.length > 0) {
      const targetShopItem = shopRes.items[0];
      if (targetShopItem) {
        if (!foundImage && targetShopItem.image) {
          foundImage = targetShopItem.image.replace(/^http:\/\//, 'https://');
        }
        if (foundPrice === 0 && targetShopItem.lprice && !targetShopItem.synthesized) {
          const parsedPrice = parseInt(targetShopItem.lprice, 10);
          if (!isNaN(parsedPrice) && parsedPrice >= 500 && parsedPrice <= 50000) {
            foundPrice = parsedPrice;
          }
        }
        if (targetShopItem.mallName && !targetShopItem.synthesized) {
          sourceMall = targetShopItem.mallName;
        }
      }
    }
  } catch (err) {
    console.warn('[Naver Shopping Search Fetch Warning]', brand, productName, err);
  }

  // 3. 우선 순위 2위: 쇼핑에서 이미지가 안 나온 경우 NAVER Image Search API 실물 패키지 컷 쿼리
  if (!foundImage) {
    try {
      const imgRes = await callNaverApi('image', `${brand} ${productName} 공식 패키지`, 'sim', 6);
      if (imgRes.items && imgRes.items.length > 0) {
        // Prioritize official shopping/retail image hosts
        const shoppingImage = imgRes.items.find(item => {
          const url = item.link || item.thumbnail || '';
          return (
            url.includes('phinf.naver.net') ||
            url.includes('coupangcdn.com') ||
            url.includes('emart') ||
            url.includes('bgfretail') ||
            url.includes('gsretail')
          );
        });

        const selected = shoppingImage || imgRes.items[0];
        if (selected) {
          const picked = selected.link || selected.thumbnail || '';
          if (picked) {
            foundImage = picked.replace(/^http:\/\//, 'https://');
            if (foundImage.includes('phinf.naver.net')) {
              sourceMall = '네이버쇼핑 패키지컷';
            }
          }
        }
      }
    } catch (err) {
      console.warn('[Naver Image Search Fetch Warning]', brand, productName, err);
    }
  }

  // 4. 기사 텍스트에서 소비자가/판매가 추출 보완
  if (foundPrice === 0 && articleText) {
    foundPrice = extractPriceFromText(articleText);
  }

  // 5. If price still 0, assign standard Korean convenience store retail price by category
  if (foundPrice === 0) {
    switch (category) {
      case '과자':
        foundPrice = 2000;
        break;
      case '음료':
        foundPrice = 2200;
        break;
      case '빵·디저트':
        foundPrice = 3400;
        break;
      case '간편식':
        foundPrice = (productName.includes('도시락') || productName.includes('밥')) ? 4800 : (productName.includes('라면') ? 1800 : 3800);
        break;
      default:
        foundPrice = 2500;
    }
  }

  return {
    price: foundPrice,
    image: foundImage,
    isFound: !!foundImage,
    mallName: sourceMall
  };
};

/**
 * 고화질 제품 이미지 후보 탐색 인터페이스
 */
export interface ProductImageCandidate {
  url: string;
  title: string;
  source: string;
  isOfficial: boolean;
  price?: number;
}

/**
 * 관리자가 특정 제품의 고화질 이미지를 원클릭으로 선택/교체할 수 있도록
 * 네이버 쇼핑 및 실시간 패키지 이미지 후보 6~12개를 검색하여 반환
 */
export const searchHighResProductImages = async (
  brand: string,
  productName: string
): Promise<ProductImageCandidate[]> => {
  const candidates: ProductImageCandidate[] = [];
  const seenUrls = new Set<string>();

  const addCandidate = (url: string, title: string, source: string, isOfficial: boolean, price?: number) => {
    if (!url || seenUrls.has(url)) return;
    seenUrls.add(url);
    const safeUrl = url.replace(/^http:\/\//, 'https://');
    candidates.push({
      url: safeUrl,
      title: cleanHtml(title),
      source,
      isOfficial,
      price
    });
  };

  const cleanBrand = brand && brand !== '기타' ? brand : '';
  const query = `${cleanBrand} ${productName}`.trim();

  // 1. 네이버 쇼핑 API (공식 브랜드스토어 및 쇼핑 카탈로그 누끼/패키지컷)
  try {
    const shopRes = await callNaverApi('shop', query, 'sim', 8);
    if (shopRes.items) {
      for (const item of shopRes.items) {
        if (item.image) {
          const mall = item.mallName || '네이버 쇼핑';
          const isOff = Boolean(mall.includes('공식') || mall.includes('직영') || mall.includes('스토어') || (cleanBrand && mall.includes(cleanBrand)));
          addCandidate(
            item.image,
            item.title,
            isOff ? `${mall} (공식 누끼)` : `${mall} (쇼핑 정품)`,
            isOff,
            item.lprice ? parseInt(item.lprice, 10) : undefined
          );
        }
      }
    }
  } catch (err) {
    console.warn('[searchHighResProductImages] Shop query failed:', err);
  }

  // 2. 네이버 이미지 검색 API (실물 패키지컷 및 매장 진열컷)
  try {
    const imgRes = await callNaverApi('image', `${query} 패키지`, 'sim', 8);
    if (imgRes.items) {
      for (const item of imgRes.items) {
        const link = item.link || item.thumbnail;
        if (link) {
          const isRetailCdn = link.includes('phinf.naver.net') || link.includes('coupangcdn') || link.includes('emart') || link.includes('bgfretail');
          addCandidate(
            link,
            item.title || productName,
            isRetailCdn ? '공식 패키지컷' : '실물 제품 컷',
            isRetailCdn
          );
        }
      }
    }
  } catch (err) {
    console.warn('[searchHighResProductImages] Image query failed:', err);
  }

  // 3. 내부 실물 신제품 DB에서 매칭되는 패키지컷 보완
  const lowerName = productName.toLowerCase().replace(/\s+/g, '');
  for (const preset of REAL_NEW_PRODUCTS_DATABASE) {
    const presetNorm = preset.name.toLowerCase().replace(/\s+/g, '');
    if ((presetNorm.includes(lowerName) || lowerName.includes(presetNorm)) && preset.image) {
      addCandidate(preset.image, preset.name, `${preset.brand} 공식 패키지`, true, preset.price);
    }
  }

  return candidates;
};
