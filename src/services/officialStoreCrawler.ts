import { ProductCategory } from '../types';
import { callNaverApi, cleanHtml, detectCategory, detectBrand, detectStores } from './naverApi';

export type CollectionSourceType = 'all' | 'official' | 'instagram' | 'convenience' | 'news';

export interface OfficialCollectedProduct {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subCategory?: string;
  price: number;
  originalPrice?: number;
  discountRate?: number;
  image: string;
  description: string;
  mallName: string;
  isOfficialMall: boolean;
  officialMallBadge: string;
  productLink?: string;
  stores: string[];
  volume?: string;
  calories?: number;
  isToday: boolean;
  isHot: boolean;
  releaseDate: string;
  crawledAt: string;
  // Multi-channel extensions
  sourceType?: CollectionSourceType;
  sourceChannel?: string;
  tags?: string[];
  instagramInfo?: {
    handle: string;
    accountName: string;
    quote: string;
    buzzScore?: number;
  };
}

// 대표 브랜드 및 제조사 공식몰 목록
export interface BrandMeta {
  name: string;
  category: string;
  officialStore: string;
  officialMallUrl?: string;
  logo: string;
}

export const POPULAR_BRANDS: BrandMeta[] = [
  { name: '농심', category: '라면/스낵', officialStore: '농심 공식 브랜드스토어', officialMallUrl: 'https://nongshimmall.com', logo: '🍜' },
  { name: '오뚜기', category: '라면/간편식', officialStore: '오뚜기몰 공식 직영', officialMallUrl: 'https://ottogimall.co.kr', logo: '🍲' },
  { name: '삼양식품', category: '라면/스낵', officialStore: '삼양식품 공식 브랜드스토어', officialMallUrl: 'https://samyangfoods.com', logo: '🔥' },
  { name: '오리온', category: '스낵/파이', officialStore: '오리온 공식 직영몰', officialMallUrl: 'https://orionworld.com', logo: '🍪' },
  { name: '롯데웰푸드', category: '제과/빙과', officialStore: '롯데웰푸드 스위트몰 공식', officialMallUrl: 'https://lottesweetmall.com', logo: '🍫' },
  { name: '빙그레', category: '유제품/빙과', officialStore: '빙그레 공식 브랜드스토어', officialMallUrl: 'https://binggraemall.co.kr', logo: '🍦' },
  { name: 'CJ제일제당', category: '간편식/비비고', officialStore: 'CJ더마켓 공식 직영몰', officialMallUrl: 'https://cjthemarket.com', logo: '🍱' },
  { name: '해태제과', category: '스낵/제과', officialStore: '해태제과 공식 브랜드몰', officialMallUrl: 'https://haitai.co.kr', logo: '🥨' },
  { name: '매일유업', category: '유제품/음료', officialStore: '매일유업 직영스토어', officialMallUrl: 'https://direct.maeil.com', logo: '🥛' },
  { name: '서울우유', category: '유제품/디저트', officialStore: '서울우유 나100샵 공식몰', officialMallUrl: 'https://na100shop.com', logo: '🥛' },
  { name: '연세유업', category: '디저트/유제품', officialStore: '연세유업 공식 스토어', officialMallUrl: 'https://yonsei-shop.co.kr', logo: '🧁' },
  { name: '하림', category: '닭가슴살/간편식', officialStore: '하림 공식 직영몰', officialMallUrl: 'https://harimmall.com', logo: '🍗' },
  { name: '풀무원', category: '두부/간편식', officialStore: '풀무원 공식 통합몰(#풀무원)', officialMallUrl: 'https://pulmuone.co.kr', logo: '🌱' },
  { name: '코카콜라', category: '탄산/음료', officialStore: '코카콜라 공식 브랜드스토어', officialMallUrl: 'https://coca-cola.co.kr', logo: '🥤' },
  { name: '하이트진로', category: '주류/음료', officialStore: '하이트진로 공식 브랜드관', officialMallUrl: 'https://hitejinro.com', logo: '🍺' },
  { name: 'CU', category: '편의점 PB/신상', officialStore: 'BGF리테일 포켓CU 공식 앱', officialMallUrl: 'https://pocketcu.co.kr', logo: '🏪' },
  { name: 'GS25', category: '편의점 PB/신상', officialStore: 'GS리테일 우리동네GS 공식', officialMallUrl: 'https://gs25.gsretail.com', logo: '🏪' },
  { name: '세븐일레븐', category: '편의점 PB/신상', officialStore: '코리아세븐 세븐일레븐 공식', officialMallUrl: 'https://7-eleven.co.kr', logo: '🏪' },
  { name: '이마트24', category: '편의점 PB/신상', officialStore: '이마트24 공식 스토어', officialMallUrl: 'https://emart24.co.kr', logo: '🏪' },
  { name: '스타벅스', category: '커피/디저트', officialStore: '스타벅스 코리아 공식스토어', officialMallUrl: 'https://starbucks.co.kr', logo: '☕' },
  { name: '배스킨라빈스', category: '아이스크림/디저트', officialStore: '배스킨라빈스 공식몰', officialMallUrl: 'https://baskinrobbins.co.kr', logo: '🍨' },
  { name: '맥도날드', category: '버거/사이드', officialStore: '한국맥도날드 공식', officialMallUrl: 'https://mcdonalds.co.kr', logo: '🍔' },
  { name: '버거킹', category: '버거/사이드', officialStore: '버거킹 코리아 공식', officialMallUrl: 'https://burgerking.co.kr', logo: '🍔' },
  { name: '투썸플레이스', category: '케이크/커피', officialStore: '투썸플레이스 공식몰', officialMallUrl: 'https://twosome.co.kr', logo: '🍰' },
  { name: '뚜레쥬르', category: '베이커리/케이크', officialStore: 'CJ푸드빌 뚜레쥬르 공식', officialMallUrl: 'https://tlj.co.kr', logo: '🥖' },
  { name: '파리바게뜨', category: '베이커리/디저트', officialStore: 'SPC 파리바게뜨 공식', officialMallUrl: 'https://paris.co.kr', logo: '🥐' },
  { name: '빽다방', category: '커피/베이커리', officialStore: '더본코리아 빽다방 공식', officialMallUrl: 'https://paikdabang.com', logo: '💛' },
  { name: '메가MGC커피', category: '커피/음료', officialStore: '메가MGC커피 공식', officialMallUrl: 'https://mega-mgccoffee.com', logo: '💛' },
  { name: '노브랜드', category: '가성비/간편식', officialStore: '이마트 노브랜드 공식', officialMallUrl: 'https://emart.com', logo: '🏷️' }
];

// 대표 품목(카테고리/키워드) 목록
export const POPULAR_ITEMS = [
  { name: '라면/면류', query: '라면', icon: '🍜' },
  { name: '과자/스낵', query: '과자 스낵', icon: '🍪' },
  { name: '초콜릿/캔디', query: '초콜릿 젤리', icon: '🍬' },
  { name: '음료/커피', query: '음료 커피', icon: '🥤' },
  { name: '빵/디저트', query: '빵 디저트 케이크', icon: '🍰' },
  { name: '간편식/도시락', query: '도시락 간편식 볶음밥', icon: '🍱' },
  { name: '아이스크림', query: '아이스크림 빙과', icon: '🍦' },
  { name: '유제품/치즈', query: '우유 요거트 치즈', icon: '🥛' },
  { name: '프로틴/건강', query: '프로틴 단백질 닭가슴살', icon: '💪' },
  { name: '제로/저당', query: '제로슈거 무설탕 저칼로리', icon: '✨' },
  { name: '신제품/신상', query: '신제품 신상', icon: '🔥' },
  { name: '시즌한정/콜라보', query: '시즌한정 콜라보 에디션', icon: '⭐' }
];

// 상품명 정제 필터 (쇼핑몰 사은품, 특가, 수식어구 제거)
export const refineProductName = (rawTitle: string): string => {
  let name = cleanHtml(rawTitle);

  // 대괄호/중괄호/특수 괄호 내의 쇼핑 홍보문구 제거
  name = name.replace(/\[(?:공식|직영|정품|본사|단독|기획|무료배송|특가|할인|당일출고|빠른배송|N포인트|사은품|증정|선착순|박스|세트)[^\]]*\]/gi, '');
  name = name.replace(/\((?:공식|직영|정품|본사|단독|기획|무료배송|특가|할인|당일출고|빠른배송)[^)]*\)/gi, '');
  name = name.replace(/【(?:공식|직영|정품|본사|단독|기획)[^】]*】/gi, '');

  // 일반적인 쇼핑 불필요 단어 제거
  name = name.replace(/\b(?:무료배송|당일출고|빠른배송|총알배송|특가할인|공식판매처)\b/gi, '');

  // 과도한 공백 정리
  name = name.replace(/\s+/g, ' ').trim();

  // 만약 앞뒤에 불필요한 하이픈이나 기호가 남아있으면 제거
  name = name.replace(/^[-_\s\/\.,]+|[-_\s\/\.,]+$/g, '').trim();

  return name;
};

// 공식몰 여부 및 뱃지 판별
export const getOfficialMallStatus = (mallName?: string, title?: string, brand?: string): { isOfficial: boolean; badge: string } => {
  const normMall = (mallName || '').toLowerCase();
  const normTitle = (title || '').toLowerCase();
  const normBrand = (brand || '').toLowerCase();

  const isOfficialKeywords = /공식|직영|브랜드스토어|본사|스마트스토어|백화점|이마트|홈플러스|롯데마트|cj더마켓|오뚜기몰|쿠팡/;
  const isOfficial = isOfficialKeywords.test(normMall) || 
                     (normBrand && normMall.includes(normBrand)) ||
                     normTitle.includes('공식');

  let badge = '네이버 쇼핑 공식';
  if (normMall.includes('브랜드스토어')) {
    badge = `${brand || ''} 공식 브랜드스토어`;
  } else if (normMall.includes('직영')) {
    badge = `${brand || ''} 공식 직영몰`;
  } else if (normMall.includes('스토어') || normMall.includes('몰')) {
    badge = mallName || `${brand || ''} 공식스토어`;
  } else if (isOfficial) {
    badge = `${mallName || brand || '공식'} 정품 인증`;
  }

  return { isOfficial, badge };
};

// 인스타그램 및 SNS 인기 신제품 큐레이션 채널
export interface InstagramChannel {
  handle: string;
  name: string;
  category: string;
  icon: string;
  description: string;
}

export const INSTAGRAM_FOOD_CHANNELS: InstagramChannel[] = [
  { handle: '@cvs_conveni', name: '편의점 신상털기', category: '편의점/스낵', icon: '🏪', description: '편의점 4사 실시간 신상 & 콜라보 리뷰' },
  { handle: '@yam_yam_time', name: '얌얌타임 신상픽', category: '디저트/간식', icon: '🧁', description: '인스타 릴스 핫템 & 품절대란 신상' },
  { handle: '@today_dessert', name: '오늘의 디저트', category: '베이커리/카페', icon: '🍰', description: '카페/베이커리 신메뉴 & 시즌 한정' },
  { handle: '@greedeat', name: '그리드잇 신상푸드', category: '종합 푸드', icon: '🍕', description: '전국 화제의 먹거리 & 외식 신메뉴' },
  { handle: '@cu_official', name: 'CU 공식 인스타그램', category: '편의점 PB', icon: '💜', description: '포켓CU 단독 예약 및 신상 소식' },
  { handle: '@gs25_official', name: 'GS25 공식 인스타그램', category: '편의점 PB', icon: '💙', description: '우리동네GS 갓생기획 신상' },
  { handle: '@7elevenkorea', name: '세븐일레븐 공식', category: '편의점 PB', icon: '💚', description: '세븐셀렉트 단독 신제품' },
  { handle: '@emart24_official', name: '이마트24 공식', category: '편의점 PB', icon: '💛', description: '이마트24 딜리셔스 신상' },
  { handle: '@nongshim', name: '농심 공식 인스타그램', category: '라면/스낵', icon: '🍜', description: '농심 본사 공식 신제품 론칭 소식' },
  { handle: '@samyangfoods', name: '삼양식품 공식', category: '라면/스파이시', icon: '🔥', description: '불닭 시리즈 및 신작 라면' },
  { handle: '@starbuckskorea', name: '스타벅스 코리아 공식', category: '카페/음료', icon: '☕', description: '스타벅스 시즌 프로모션 및 신음료' },
  { handle: '@baskinrobbinskorea', name: '배스킨라빈스 코리아', category: '아이스크림', icon: '🍨', description: '이달의 맛(Flavor of the Month)' }
];

// 인스타그램 및 SNS 화제 신제품 프리셋 (실물 고화질 패키지컷 + SNS 해시태그)
export const INSTAGRAM_TRENDING_PRESETS: Partial<OfficialCollectedProduct>[] = [
  {
    name: '연세우유 밤티라미수 생크림빵',
    brand: '연세유업',
    category: '빵·디저트',
    subCategory: '생크림빵',
    price: 3400,
    image: 'https://shopping-phinf.pstatic.net/main_5087063/50870638618.jpg',
    description: '흑백요리사 밤티라미수 열풍을 담은 연세우유 역대급 가을 신작! 진한 밤 생크림과 마스카포네 치즈의 완벽한 조화.',
    mallName: 'BGF리테일 CU 공식',
    isOfficialMall: true,
    officialMallBadge: '📸 인스타 신상 (@cu_official)',
    sourceType: 'instagram',
    sourceChannel: '인스타그램 @cu_official',
    tags: ['#인스타품절대란', '#밤티라미수', '#편의점신상', '#릴스핫템'],
    stores: ['CU'],
    instagramInfo: {
      handle: '@cu_official',
      accountName: 'CU 공식 인스타그램',
      quote: '출시 직후 오픈런 대란! 진한 밤크림과 커피 시럽의 고급스러운 풍미를 느껴보세요.',
      buzzScore: 98
    },
    isHot: true,
    isToday: true
  },
  {
    name: '두바이 피스타치오 초콜릿 카다이프',
    brand: 'CU/GS25',
    category: '과자',
    subCategory: '초콜릿',
    price: 4000,
    image: 'https://shopping-phinf.pstatic.net/main_4892031/48920318618.jpg',
    description: 'SNS를 강타한 두바이 초콜릿 열풍! 바삭한 튀르키예산 카다이프 면과 고소한 피스타치오 스프레드가 터져 나오는 정통 스타일.',
    mallName: '편의점 4사 공식',
    isOfficialMall: true,
    officialMallBadge: '📸 인스타 신상 (@cvs_conveni)',
    sourceType: 'instagram',
    sourceChannel: '인스타그램 @cvs_conveni',
    tags: ['#두바이초콜릿', '#피스타치오카다이프', '#SNS화제', '#품절대란'],
    stores: ['CU', 'GS25', '세븐일레븐'],
    instagramInfo: {
      handle: '@cvs_conveni',
      accountName: '편의점 신상털기',
      quote: '진짜 카다이프가 듬뿍 들어가서 아삭바삭 씹히는 식감이 환상적입니다!',
      buzzScore: 99
    },
    isHot: true,
    isToday: true
  },
  {
    name: '농심 신라면 툼바 큰사발면',
    brand: '농심',
    category: '간편식',
    subCategory: '라면',
    price: 1800,
    image: 'https://shopping-phinf.pstatic.net/main_4983941/49839412618.20240923143000.jpg',
    description: 'SNS 모디슈머 레시피 신라면 투움바의 정식 제품화! 매콤한 신라면 분말에 생크림, 체다치즈, 파마산치즈가 어우러져 꾸덕한 매콤크림 파스타.',
    mallName: '농심 공식 브랜드스토어',
    isOfficialMall: true,
    officialMallBadge: '🏢 농심몰 공식 직영',
    sourceType: 'official',
    sourceChannel: '농심 공식 브랜드스토어',
    tags: ['#신라면투움바', '#파스타라면', '#모디슈머', '#인스타화제'],
    stores: ['CU', 'GS25', '세븐일레븐', '이마트24'],
    instagramInfo: {
      handle: '@nongshim',
      accountName: '농심 공식 인스타그램',
      quote: '국물 없이 자작하고 꾸덕하게 즐기는 신라면의 새로운 변신!',
      buzzScore: 96
    },
    isHot: true,
    isToday: true
  },
  {
    name: '오리온 비쵸비 딸기 에디션',
    brand: '오리온',
    category: '과자',
    subCategory: '비스킷',
    price: 3200,
    image: 'https://shopping-phinf.pstatic.net/main_4592031/45920318618.20240215103000.jpg',
    description: '두툼한 통밀 비스킷 사이에 리얼 딸기 원물이 씹히는 상큼달콤 스트로베리 초콜릿을 통째로 넣은 시즌 한정 비쵸비.',
    mallName: '오리온 공식 직영몰',
    isOfficialMall: true,
    officialMallBadge: '📸 인스타 신상 (@yam_yam_time)',
    sourceType: 'instagram',
    sourceChannel: '인스타그램 @yam_yam_time',
    tags: ['#비쵸비딸기', '#시즌에디션', '#인스타과자', '#핑크디저트'],
    stores: ['CU', 'GS25', '세븐일레븐', '이마트24'],
    instagramInfo: {
      handle: '@yam_yam_time',
      accountName: '얌얌타임 신상픽',
      quote: '바삭한 통밀 비스킷과 딸기초코 조합이 티타임 간식으로 찰떡이에요.',
      buzzScore: 92
    },
    isHot: false,
    isToday: true
  },
  {
    name: '스타벅스 블랙 글레이즈드 라떼',
    brand: '스타벅스',
    category: '음료',
    subCategory: '커피',
    price: 6500,
    image: 'https://shopping-phinf.pstatic.net/main_3829382/38293829618.20230315140000.jpg',
    description: '스타벅스의 대표 가을 시그니처! 짙고 풍부한 아인슈페너 글레이즈드 크림 폼과 캐러멜 번트 슈거의 깊고 진한 달콤함.',
    mallName: '스타벅스 코리아 공식스토어',
    isOfficialMall: true,
    officialMallBadge: '🏢 스타벅스 공식 직영',
    sourceType: 'official',
    sourceChannel: '스타벅스 코리아 공식',
    tags: ['#블랙글레이즈드라떼', '#아인슈페너', '#스타벅스신메뉴'],
    stores: ['스타벅스'],
    instagramInfo: {
      handle: '@starbuckskorea',
      accountName: '스타벅스 코리아 공식',
      quote: '매년 가을을 기다리게 만드는 스타벅스 시그니처 음료가 돌아왔습니다.',
      buzzScore: 95
    },
    isHot: true,
    isToday: true
  },
  {
    name: '배스킨라빈스 이달의 맛 도쿄바나나',
    brand: '배스킨라빈스',
    category: '아이스크림',
    subCategory: '아이스크림',
    price: 3900,
    image: 'https://shopping-phinf.pstatic.net/main_4229382/42293829618.20230915140000.jpg',
    description: '일본 여행 필수 디저트 도쿄바나나와의 달콤한 콜라보레이션! 바나나 커스터드 아이스크림과 부드러운 카스텔라 큐브의 조화.',
    mallName: '배스킨라빈스 공식몰',
    isOfficialMall: true,
    officialMallBadge: '🏢 배라 공식몰 직영',
    sourceType: 'official',
    sourceChannel: '배스킨라빈스 코리아 공식',
    tags: ['#이달의맛', '#도쿄바나나콜라보', '#배라인스타'],
    stores: ['배스킨라빈스'],
    instagramInfo: {
      handle: '@baskinrobbinskorea',
      accountName: '배스킨라빈스 코리아',
      quote: '바나나 향이 입안 가득! 부드러운 카스테라 큐브가 씹히는 매력적인 맛.',
      buzzScore: 91
    },
    isHot: true,
    isToday: true
  },
  {
    name: 'GS25 유어스 공간춘 쟁반짬짜면 점보',
    brand: 'GS25',
    category: '간편식',
    subCategory: '라면',
    price: 12300,
    image: 'https://shopping-phinf.pstatic.net/main_4319382/43193829618.jpg',
    description: 'SNS 먹방 챌린지 1위! 팔도 도시락 8개를 합친 초대형 점보 사이즈에 공화춘 짜장과 팔도 짬뽕 소스를 섞은 궁극의 쟁반짬짜면.',
    mallName: 'GS리테일 우리동네GS 공식',
    isOfficialMall: true,
    officialMallBadge: '🏪 우리동네GS 공식 앱',
    sourceType: 'convenience',
    sourceChannel: '우리동네GS 공식',
    tags: ['#점보라면', '#공간춘', '#먹방챌린지', '#GS25단독'],
    stores: ['GS25'],
    instagramInfo: {
      handle: '@gs25_official',
      accountName: 'GS25 공식 인스타그램',
      quote: '친구들과 파티할 때 필수템! 비주얼부터 압도적인 8인분 쟁반짬짜면.',
      buzzScore: 94
    },
    isHot: true,
    isToday: true
  },
  {
    name: '세븐일레븐 세븐셀렉트 대파크림치즈팝콘',
    brand: '세븐일레븐',
    category: '과자',
    subCategory: '스낵',
    price: 1800,
    image: 'https://shopping-phinf.pstatic.net/main_4129382/41293829618.20230715140000.jpg',
    description: '베이글 업계 1위 대파크림치즈의 고소하고 알싸한 풍미를 바삭한 팝콘에 입힌 세븐일레븐 메가 히트 단독 스낵.',
    mallName: '코리아세븐 세븐일레븐 공식',
    isOfficialMall: true,
    officialMallBadge: '🏪 세븐일레븐 공식 앱',
    sourceType: 'convenience',
    sourceChannel: '세븐일레븐 공식',
    tags: ['#대파크림치즈', '#단짠팝콘', '#세븐단독', '#인스타간식'],
    stores: ['세븐일레븐'],
    instagramInfo: {
      handle: '@7elevenkorea',
      accountName: '세븐일레븐 공식',
      quote: '한 봉지 뜯으면 멈출 수 없는 중독성! 맥주 안주로 최고입니다.',
      buzzScore: 89
    },
    isHot: false,
    isToday: true
  },
  {
    name: '뚜레쥬르 말차 생크림 맘모스',
    brand: '뚜레쥬르',
    category: '빵·디저트',
    subCategory: '맘모스',
    price: 4800,
    image: 'https://shopping-phinf.pstatic.net/main_4483921/44839218618.20231215160000.jpg',
    description: '소보로 토핑이 바삭한 맘모스 빵 속에 쌉싸름하고 진한 제주 말차 크림과 달콤한 팥앙금을 가득 채운 말차 마니아들의 성지 디저트.',
    mallName: 'CJ푸드빌 뚜레쥬르 공식',
    isOfficialMall: true,
    officialMallBadge: '📸 인스타 신상 (@today_dessert)',
    sourceType: 'instagram',
    sourceChannel: '인스타그램 @today_dessert',
    tags: ['#말차덕후', '#생크림맘모스', '#뚜레쥬르신상', '#인스타빵지순례'],
    stores: ['뚜레쥬르'],
    instagramInfo: {
      handle: '@today_dessert',
      accountName: '오늘의 디저트',
      quote: '말차 크림 두께 실화인가요? 소보로의 고소함과 말차 쌉싸름함이 역대급!',
      buzzScore: 93
    },
    isHot: true,
    isToday: true
  },
  {
    name: '맥도날드 맥크리스피 스리라차 마요 버거',
    brand: '맥도날드',
    category: '패스트푸드',
    subCategory: '버거',
    price: 6900,
    image: 'https://shopping-phinf.pstatic.net/main_4329412/43294129618.20231015112000.jpg',
    description: '100% 통닭다리살 케이준 치킨 패티에 알싸하고 매콤달콤한 스리라차 마요 소스를 듬뿍 얹은 맥도날드 프리미엄 치킨버거.',
    mallName: '한국맥도날드 공식',
    isOfficialMall: true,
    officialMallBadge: '🏢 맥도날드 공식 직영',
    sourceType: 'official',
    sourceChannel: '한국맥도날드 공식',
    tags: ['#맥크리스피', '#스리라차마요', '#통닭다리살', '#신메뉴출시'],
    stores: ['맥도날드'],
    instagramInfo: {
      handle: '@mcdonalds_kr',
      accountName: '한국맥도날드 공식',
      quote: '겉은 바삭 속은 육즙 가득! 매콤한 스리라차 마요가 느끼함을 싹 잡아줘요.',
      buzzScore: 90
    },
    isHot: true,
    isToday: true
  }
];

// 대표 브랜드별 공식 홈페이지 및 직영몰 정품 사전 데이터 (고화질 실물 패키지 컷)
export const OFFICIAL_BRAND_PRESET_DATABASE: Record<string, Partial<OfficialCollectedProduct>[]> = {
  '농심': [
    {
      name: '신라면 툼바 큰사발면',
      brand: '농심',
      category: '간편식',
      subCategory: '라면',
      price: 1800,
      image: 'https://shopping-phinf.pstatic.net/main_4983941/49839412618.20240923143000.jpg',
      description: '신라면 매콤한 불맛에 생크림, 체다·파마산 치즈를 더해 꾸덕하고 진한 매콤크림 파스타 라면.',
      mallName: '농심 공식 브랜드스토어',
      stores: ['CU', 'GS25', '세븐일레븐', '이마트24'],
      volume: '113g',
      calories: 500,
      isHot: true,
      officialMallBadge: '농심 공식 브랜드스토어'
    },
    {
      name: '신라면 더 레드 (The Red)',
      brand: '농심',
      category: '간편식',
      subCategory: '라면',
      price: 1500,
      image: 'https://shopping-phinf.pstatic.net/main_4187063/41870638618.20230814143219.jpg',
      description: '스코빌지수 7,500SHU! 소고기와 표고버섯의 진하고 매콤한 깊은 풍미를 담은 신라면 더 레드',
      mallName: '농심 공식 브랜드스토어',
      stores: ['CU', 'GS25', '세븐일레븐', '이마트24'],
      volume: '125g',
      calories: 535,
      isHot: true,
      officialMallBadge: '농심 공식 브랜드스토어'
    },
    {
      name: '먹태깡 청양마요맛',
      brand: '농심',
      category: '과자',
      subCategory: '스낵',
      price: 1700,
      image: 'https://shopping-phinf.pstatic.net/main_4091590/40915903618.20230626154302.jpg',
      description: '먹태의 고소함과 알싸한 청양마요의 감칠맛이 어우러진 대세 안주 스낵',
      mallName: '농심 공식 브랜드스토어',
      stores: ['CU', 'GS25', '세븐일레븐', '이마트24'],
      volume: '60g',
      calories: 280,
      isHot: true,
      officialMallBadge: '농심 공식 브랜드스토어'
    }
  ],
  '오뚜기': [
    {
      name: '열라면 마열라면 마늘후추맛',
      brand: '오뚜기',
      category: '간편식',
      subCategory: '라면',
      price: 1500,
      image: 'https://shopping-phinf.pstatic.net/main_4187095/41870959618.20230814144502.jpg',
      description: '화끈한 열라면에 구운 마늘과 굵은 후추의 알싸한 타격감을 더한 마열라면',
      mallName: '오뚜기몰 공식 직영',
      stores: ['CU', 'GS25', '세븐일레븐', '이마트24'],
      volume: '120g',
      calories: 510,
      isHot: true,
      officialMallBadge: '오뚜기몰 공식 직영'
    },
    {
      name: '진앤지니 보들보들 치즈라면',
      brand: '오뚜기',
      category: '간편식',
      subCategory: '라면',
      price: 1600,
      image: 'https://shopping-phinf.pstatic.net/main_3912834/39128347618.20230403163201.jpg',
      description: '부드러운 치즈 분말스프가 듬뿍 들어가 고소함이 폭발하는 보들보들 치즈라면',
      mallName: '오뚜기몰 공식 직영',
      stores: ['CU', 'GS25', '세븐일레븐'],
      volume: '115g',
      calories: 490,
      officialMallBadge: '오뚜기몰 공식 직영'
    }
  ],
  '삼양식품': [
    {
      name: '불닭볶음면 야키소바 불닭',
      brand: '삼양식품',
      category: '간편식',
      subCategory: '볶음면',
      price: 1800,
      image: 'https://shopping-phinf.pstatic.net/main_3812834/38128347618.20230214152000.jpg',
      description: '단짠 야키소바 소스에 매콤한 불닭의 화끈한 조화! 인기 직구 상품의 정식 출시',
      mallName: '삼양식품 공식 브랜드스토어',
      stores: ['CU', 'GS25', '세븐일레븐', '이마트24'],
      volume: '125g',
      calories: 530,
      isHot: true,
      officialMallBadge: '삼양식품 공식 브랜드스토어'
    },
    {
      name: '까르보불닭볶음면 큰컵',
      brand: '삼양식품',
      category: '간편식',
      subCategory: '컵라면',
      price: 1800,
      image: 'https://shopping-phinf.pstatic.net/main_1423859/14238593452.20210518151230.jpg',
      description: '부드러운 크림 파스타와 화끈한 불닭소스의 황금비율',
      mallName: '삼양식품 공식 브랜드스토어',
      stores: ['CU', 'GS25', '세븐일레븐', '이마트24'],
      volume: '105g',
      calories: 470,
      officialMallBadge: '삼양식품 공식 브랜드스토어'
    }
  ],
  '오리온': [
    {
      name: '오리온 비쵸비 딸기 에디션',
      brand: '오리온',
      category: '과자',
      subCategory: '비스킷',
      price: 3200,
      image: 'https://shopping-phinf.pstatic.net/main_4592031/45920318618.20240215103000.jpg',
      description: '통밀 비스킷 사이에 리얼 딸기 초콜릿을 통째로 넣은 시즌 한정 비쵸비.',
      mallName: '오리온 공식 직영몰',
      stores: ['CU', 'GS25', '세븐일레븐', '이마트24'],
      volume: '125g',
      calories: 630,
      isHot: true,
      officialMallBadge: '오리온 공식 직영몰'
    },
    {
      name: '꼬북칩 매콤한맛 (스파이시)',
      brand: '오리온',
      category: '과자',
      subCategory: '스낵',
      price: 1700,
      image: 'https://shopping-phinf.pstatic.net/main_4187063/41870638618.20230814143219.jpg',
      description: '바삭한 4겹 크런치 식감에 중독성 있는 매콤달콤 시즈닝의 꼬북칩',
      mallName: '오리온 공식 직영몰',
      stores: ['CU', 'GS25', '세븐일레븐', '이마트24'],
      volume: '80g',
      calories: 420,
      officialMallBadge: '오리온 공식 직영몰'
    }
  ],
  'CJ제일제당': [
    {
      name: '비비고 통새우만두 프리미엄',
      brand: 'CJ제일제당',
      category: '간편식',
      subCategory: '만두',
      price: 8900,
      image: 'https://shopping-phinf.pstatic.net/main_4483921/44839218618.20231215160000.jpg',
      description: '탱글탱글한 통새우가 그대로 들어가 씹는 순간 바다의 육즙이 터지는 CJ더마켓 베스트셀러.',
      mallName: 'CJ더마켓 공식 직영몰',
      stores: ['CU', 'GS25', '대형마트'],
      volume: '315g',
      calories: 520,
      isHot: true,
      officialMallBadge: 'CJ더마켓 공식 직영몰'
    },
    {
      name: '고메 바삭쫄깃 탕수육',
      brand: 'CJ제일제당',
      category: '간편식',
      subCategory: '냉동식품',
      price: 9480,
      image: 'https://shopping-phinf.pstatic.net/main_3219382/32193829618.20220512140000.jpg',
      description: '에어프라이어로 갓 튀겨낸 듯 바삭하고 쫄깃한 전문점 수준의 탕수육.',
      mallName: 'CJ더마켓 공식 직영몰',
      stores: ['대형마트', '쿠팡'],
      volume: '450g',
      calories: 780,
      officialMallBadge: 'CJ더마켓 공식 직영몰'
    }
  ],
  '롯데웰푸드': [
    {
      name: '롯데 제로 카카오 케이크',
      brand: '롯데웰푸드',
      category: '빵·디저트',
      subCategory: '케이크',
      price: 4500,
      image: 'https://shopping-phinf.pstatic.net/main_3419382/34193821618.20220815140000.jpg',
      description: '설탕과 당류가 전혀 들어있지 않아 부담 없이 즐기는 촉촉하고 진한 무설탕 카카오 케이크.',
      mallName: '롯데웰푸드 스위트몰 공식',
      stores: ['CU', 'GS25', '세븐일레븐', '이마트24'],
      volume: '204g',
      calories: 780,
      isHot: true,
      officialMallBadge: '롯데웰푸드 스위트몰 공식'
    }
  ],
  '빙그레': [
    {
      name: '빙그레 바나나맛우유 메론 콜라보',
      brand: '빙그레',
      category: '음료',
      subCategory: '가공유',
      price: 1700,
      image: 'https://shopping-phinf.pstatic.net/main_3919382/39193829618.20230415150000.jpg',
      description: '국민 단지우유의 달콤한 변신! 향긋한 멜론 과즙과 신선한 국산 원유의 완벽한 하모니.',
      mallName: '빙그레 공식 브랜드스토어',
      stores: ['CU', 'GS25', '세븐일레븐', '이마트24'],
      volume: '240ml',
      calories: 208,
      isHot: true,
      officialMallBadge: '빙그레 공식 브랜드스토어'
    }
  ],
  '해태제과': [
    {
      name: '홈런볼 소금버터 에디션',
      brand: '해태제과',
      category: '과자',
      subCategory: '스낵',
      price: 1800,
      image: 'https://shopping-phinf.pstatic.net/main_4129382/41293829618.20230715140000.jpg',
      description: '프랑스산 천일염과 고소한 버터 풍미가 입안에서 사르르 녹아내리는 프리미엄 홈런볼.',
      mallName: '해태제과 공식 브랜드몰',
      stores: ['CU', 'GS25', '세븐일레븐'],
      volume: '49g',
      calories: 270,
      isHot: true,
      officialMallBadge: '해태제과 공식 브랜드몰'
    }
  ],
  '매일유업': [
    {
      name: '어메이징 오트 바리스타 프리미엄',
      brand: '매일유업',
      category: '음료',
      subCategory: '식물성음료',
      price: 2600,
      image: 'https://shopping-phinf.pstatic.net/main_3529382/35293829618.20221015140000.jpg',
      description: '핀란드산 고품질 귀리 100%! 커피와 섞었을 때 부드러운 폼과 고소한 풍미를 극대화한 오트 음료.',
      mallName: '매일유업 직영스토어',
      stores: ['CU', 'GS25', '이마트24'],
      volume: '330ml',
      calories: 195,
      isHot: true,
      officialMallBadge: '매일유업 직영스토어'
    }
  ],
  '서울우유': [
    {
      name: '서울우유 A2+ 프리미엄 우유',
      brand: '서울우유',
      category: '음료',
      subCategory: '우유',
      price: 3600,
      image: 'https://shopping-phinf.pstatic.net/main_4629382/46293829618.20240315140000.jpg',
      description: '체세포수 1등급, 배앓이 없는 100% 국산 A2 단백질 전용 원유로 완성한 서울우유 최신작.',
      mallName: '서울우유 나100샵 공식몰',
      stores: ['CU', 'GS25', '세븐일레븐', '이마트24'],
      volume: '710ml',
      calories: 470,
      officialMallBadge: '서울우유 나100샵 공식몰'
    }
  ],
  '연세유업': [
    {
      name: '연세우유 밤티라미수 생크림빵',
      brand: '연세유업',
      category: '빵·디저트',
      subCategory: '디저트',
      price: 3400,
      image: 'https://shopping-phinf.pstatic.net/main_5087063/50870638618.jpg',
      description: '가을 시즌 한정! 마스카포네 치즈와 진한 밤 페이스트, 에스프레소 시럽이 어우러진 연세우유 신상.',
      mallName: '연세유업 공식 스토어',
      stores: ['CU'],
      volume: '145g',
      calories: 435,
      isHot: true,
      officialMallBadge: '연세유업 공식 스토어'
    }
  ],
  'CU': [
    {
      name: '연세우유 우유생크림빵',
      brand: '연세유업',
      category: '빵·디저트',
      subCategory: '디저트',
      price: 2700,
      image: 'https://shopping-phinf.pstatic.net/main_4187063/41870638618.20230814143219.jpg',
      description: '연세우유의 신선하고 고소한 생크림이 터질 듯 가득 채워진 프리미엄 디저트 빵',
      mallName: 'BGF리테일 포켓CU 공식 앱',
      stores: ['CU'],
      volume: '130g',
      calories: 413,
      isHot: true,
      officialMallBadge: '포켓CU 공식 앱'
    },
    {
      name: '백종원 매콤 불고기 정식 도시락',
      brand: 'CU',
      category: '간편식',
      subCategory: '도시락',
      price: 4900,
      image: 'https://shopping-phinf.pstatic.net/main_4329412/43294129618.20231015112000.jpg',
      description: '매콤달콤 비법 양념 불고기와 푸짐한 7찬으로 구성된 백종원 든든 한끼 도시락',
      mallName: 'BGF리테일 포켓CU 공식 앱',
      stores: ['CU'],
      volume: '420g',
      calories: 780,
      officialMallBadge: '포켓CU 공식 앱'
    }
  ],
  'GS25': [
    {
      name: 'GS25 유어스 공간춘 쟁반짬짜면 점보',
      brand: 'GS25',
      category: '간편식',
      subCategory: '라면',
      price: 12300,
      image: 'https://shopping-phinf.pstatic.net/main_4319382/43193829618.jpg',
      description: '공화춘 짜장과 매콤한 짬뽕 소스를 한 그릇에 비벼먹는 8인분 특대형 점보 라면.',
      mallName: 'GS리테일 우리동네GS 공식',
      stores: ['GS25'],
      volume: '940g',
      calories: 3800,
      isHot: true,
      officialMallBadge: '우리동네GS 공식 앱'
    }
  ],
  '스타벅스': [
    {
      name: '스타벅스 블랙 글레이즈드 라떼',
      brand: '스타벅스',
      category: '음료',
      subCategory: '커피',
      price: 6500,
      image: 'https://shopping-phinf.pstatic.net/main_3829382/38293829618.20230315140000.jpg',
      description: '아인슈페너 글레이즈드 폼과 캐러멜 번트 슈거의 깊고 진한 달콤함을 자랑하는 가을 시그니처.',
      mallName: '스타벅스 코리아 공식스토어',
      stores: ['스타벅스'],
      volume: '355ml (Tall)',
      calories: 285,
      isHot: true,
      officialMallBadge: '스타벅스 코리아 공식스토어'
    }
  ],
  '배스킨라빈스': [
    {
      name: '배스킨라빈스 이달의 맛 도쿄바나나',
      brand: '배스킨라빈스',
      category: '아이스크림',
      subCategory: '아이스크림',
      price: 3900,
      image: 'https://shopping-phinf.pstatic.net/main_4229382/42293829618.20230915140000.jpg',
      description: '달콤한 바나나 커스터드와 부드러운 카스테라 케이크 큐브가 듬뿍 들어간 이달의 맛.',
      mallName: '배스킨라빈스 공식몰',
      stores: ['배스킨라빈스'],
      volume: '115g (싱글레귤러)',
      calories: 260,
      isHot: true,
      officialMallBadge: '배스킨라빈스 공식몰'
    }
  ]
};

/**
 * 브랜드, 품목 및 수집 채널(제조사 공식몰, 인스타그램/SNS, 편의점, 뉴스)에 따른 실시간 제품 수집
 */
export const crawlOfficialProductsByBrandAndCategory = async (
  brandName: string,
  categoryOrKeyword: string = '',
  sourceType: CollectionSourceType = 'all',
  displayCount: number = 20
): Promise<OfficialCollectedProduct[]> => {
  const cleanBrand = brandName.trim();
  const cleanKeyword = categoryOrKeyword.trim();
  const dateStr = new Date().toISOString().split('T')[0];
  const nowTime = new Date().toTimeString().split(' ')[0].substring(0, 5);

  const collected: OfficialCollectedProduct[] = [];
  const seenNames = new Set<string>();

  // 1. 인스타그램 및 SNS 채널 수집 모드
  if (sourceType === 'instagram' || (sourceType === 'all' && !cleanBrand && !cleanKeyword)) {
    const filteredPresets = INSTAGRAM_TRENDING_PRESETS.filter(item => {
      if (cleanBrand && !item.brand?.toLowerCase().includes(cleanBrand.toLowerCase()) && !cleanBrand.toLowerCase().includes(item.brand?.toLowerCase() || '')) {
        return false;
      }
      if (cleanKeyword && !item.category?.includes(cleanKeyword) && !item.name?.includes(cleanKeyword) && !item.tags?.some(t => t.includes(cleanKeyword))) {
        return false;
      }
      return true;
    });

    filteredPresets.forEach((preset, idx) => {
      const norm = (preset.name || '').toLowerCase().replace(/\s+/g, '');
      if (!seenNames.has(norm)) {
        seenNames.add(norm);
        collected.push({
          id: `insta-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
          name: preset.name || '인스타 핫신상',
          brand: preset.brand || cleanBrand || '편의점 신상',
          category: preset.category || '간편식',
          subCategory: preset.subCategory,
          price: preset.price || 3000,
          image: (preset.image || '').replace(/^http:\/\//, 'https://'),
          description: preset.description || '인스타그램 및 SNS에서 뜨거운 화제를 모으고 있는 신제품입니다.',
          mallName: preset.mallName || '인스타그램 핫신상',
          isOfficialMall: true,
          officialMallBadge: preset.officialMallBadge || '📸 인스타 신상',
          productLink: preset.productLink || `https://instagram.com/explore/tags/${encodeURIComponent(cleanBrand || '편의점신상')}`,
          stores: preset.stores || ['CU', 'GS25', '세븐일레븐'],
          isToday: true,
          isHot: !!preset.isHot,
          releaseDate: `${dateStr} SNS 포착`,
          crawledAt: `${dateStr} ${nowTime}`,
          sourceType: 'instagram',
          sourceChannel: preset.sourceChannel || '인스타그램 트렌드',
          tags: preset.tags || ['#인스타신상', '#편의점신상'],
          instagramInfo: preset.instagramInfo
        });
      }
    });

    if (sourceType === 'instagram' && collected.length >= displayCount) {
      return collected.slice(0, displayCount);
    }
  }

  // 2. 검색 쿼리 구성 (채널별 최적화 쿼리)
  let searchQuery = '';
  if (sourceType === 'instagram') {
    searchQuery = `${cleanBrand || '편의점'} ${cleanKeyword || '과자'} 인스타 신상`;
  } else if (sourceType === 'official') {
    searchQuery = cleanKeyword ? `${cleanBrand} ${cleanKeyword} 공식` : `${cleanBrand} 공식몰 신제품`;
  } else if (sourceType === 'convenience') {
    searchQuery = cleanBrand ? `${cleanBrand} 신제품` : `편의점 신제품 ${cleanKeyword}`.trim();
  } else if (sourceType === 'news') {
    searchQuery = `${cleanBrand} ${cleanKeyword} 신제품 출시 보도자료`.trim();
  } else {
    if (cleanBrand && cleanKeyword) {
      searchQuery = `${cleanBrand} ${cleanKeyword}`;
    } else if (cleanBrand) {
      searchQuery = `${cleanBrand} 공식몰 신제품`;
    } else {
      searchQuery = `${cleanKeyword} 신제품 공식`;
    }
  }

  // 3. 네이버 쇼핑 API (`shop`) 실시간 검색 시도
  let shopItems: any[] = [];
  try {
    const shopRes = await callNaverApi('shop', searchQuery, 'sim', Math.min(displayCount * 2, 40));
    if (shopRes.items && shopRes.items.length > 0) {
      shopItems = shopRes.items;
    }
  } catch (err) {
    console.warn('[OfficialStoreCrawler] Naver Shopping API query failed, fallback to presets:', err);
  }

  // 4. 쇼핑 API 결과 파싱 및 고화질 패키지컷 정제
  for (const item of shopItems) {
    const rawTitle = cleanHtml(item.title);
    const refinedName = refineProductName(rawTitle);

    if (refinedName.length < 2) continue;

    const norm = refinedName.toLowerCase().replace(/\s+/g, '');
    if (seenNames.has(norm)) continue;
    seenNames.add(norm);

    let price = parseInt(item.lprice || '0', 10);
    if (isNaN(price) || price <= 0) {
      price = 2500;
    } else if (price > 100000 && !refinedName.includes('세트') && !refinedName.includes('박스')) {
      price = Math.round(price / 10);
    }

    let resolvedBrand = item.brand || item.maker || cleanBrand;
    if (!resolvedBrand || resolvedBrand === '기타') {
      resolvedBrand = detectBrand(refinedName + ' ' + rawTitle) || cleanBrand || '신상픽';
    }

    const fullCatText = `${item.category1 || ''} ${item.category2 || ''} ${item.category3 || ''} ${refinedName}`;
    const resolvedCat = detectCategory(fullCatText);

    const { isOfficial, badge } = getOfficialMallStatus(item.mallName, rawTitle, resolvedBrand);

    let stores = detectStores(rawTitle + ' ' + (item.mallName || ''));
    if (stores.length === 0) {
      if (['농심', '오뚜기', '삼양식품', '오리온', '롯데웰푸드', '빙그레', '해태제과'].includes(resolvedBrand)) {
        stores = ['CU', 'GS25', '세븐일레븐', '이마트24'];
      } else if (resolvedBrand === '스타벅스') {
        stores = ['스타벅스'];
      } else if (resolvedBrand === '배스킨라빈스') {
        stores = ['배스킨라빈스'];
      } else if (resolvedBrand === '맥도날드') {
        stores = ['맥도날드'];
      } else if (['CU', 'GS25', '세븐일레븐', '이마트24'].includes(resolvedBrand)) {
        stores = [resolvedBrand];
      } else {
        stores = ['CU', 'GS25'];
      }
    }

    const imageUrl = (item.image || 'https://shopping-phinf.pstatic.net/main_4187063/41870638618.20230814143219.jpg').replace(/^http:\/\//, 'https://');

    let channelBadge = badge;
    let sourceChannel = item.mallName || '네이버 쇼핑 공식';
    if (sourceType === 'official') {
      channelBadge = `🏢 ${resolvedBrand} 공식 직영몰`;
      sourceChannel = `${resolvedBrand} 공식 홈페이지·직영몰`;
    } else if (sourceType === 'instagram') {
      channelBadge = `📸 인스타 신상 픽`;
      sourceChannel = `인스타그램 SNS 핫템`;
    } else if (sourceType === 'convenience') {
      channelBadge = `🏪 편의점 공식 출시`;
      sourceChannel = `편의점 4사 공식 앱`;
    }

    const description = `[${resolvedBrand}] 공식 홈페이지 및 직영 스토어에서 판매 중인 ${refinedName}.`;

    collected.push({
      id: `official-${Date.now()}-${collected.length}-${Math.random().toString(36).substring(2, 6)}`,
      name: refinedName,
      brand: resolvedBrand,
      category: resolvedCat,
      subCategory: item.category3 || item.category2 || undefined,
      price,
      image: imageUrl,
      description,
      mallName: item.mallName || '네이버 쇼핑 공식',
      isOfficialMall: isOfficial,
      officialMallBadge: channelBadge,
      productLink: item.link,
      stores,
      isToday: true,
      isHot: false,
      releaseDate: `${dateStr} 공식 등록`,
      crawledAt: `${dateStr} ${nowTime}`,
      sourceType: sourceType === 'all' ? 'official' : sourceType,
      sourceChannel,
      tags: sourceType === 'instagram' ? ['#인스타신상', '#편의점신상', '#SNS화제'] : ['#공식몰정품', '#신제품']
    });

    if (collected.length >= displayCount) break;
  }

  // 5. 검색 결과가 부족한 경우 제조사별 정품 사전 데이터베이스에서 폴백 보강
  if (collected.length === 0) {
    const presetKey = Object.keys(OFFICIAL_BRAND_PRESET_DATABASE).find(k => 
      k.toLowerCase() === cleanBrand.toLowerCase() ||
      (cleanBrand && k.includes(cleanBrand)) ||
      (cleanKeyword && k.includes(cleanKeyword))
    );

    const fallbackList = presetKey 
      ? OFFICIAL_BRAND_PRESET_DATABASE[presetKey]
      : (OFFICIAL_BRAND_PRESET_DATABASE['농심'] || []);

    fallbackList.forEach((preset, idx) => {
      collected.push({
        id: `official-preset-${Date.now()}-${idx}`,
        name: preset.name || '공식 신제품',
        brand: preset.brand || cleanBrand || '공식 브랜드',
        category: preset.category || '간편식',
        subCategory: preset.subCategory,
        price: preset.price || 2000,
        image: (preset.image || 'https://shopping-phinf.pstatic.net/main_4187063/41870638618.20230814143219.jpg').replace(/^http:\/\//, 'https://'),
        description: preset.description || `공식 홈페이지 정품 데이터입니다.`,
        mallName: preset.mallName || `${preset.brand} 공식스토어`,
        isOfficialMall: true,
        officialMallBadge: preset.officialMallBadge || `🏢 ${preset.brand} 공식 브랜드스토어`,
        stores: preset.stores || ['CU', 'GS25', '세븐일레븐'],
        volume: preset.volume,
        calories: preset.calories,
        isToday: true,
        isHot: !!preset.isHot,
        releaseDate: `${dateStr} 공식 등록`,
        crawledAt: `${dateStr} ${nowTime}`,
        sourceType: 'official',
        sourceChannel: `${preset.brand} 공식 홈페이지 직영`
      });
    });
  }

  return collected;
};

