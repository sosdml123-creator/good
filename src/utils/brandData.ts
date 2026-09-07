import { BrandInfo, Product } from '../types';
import { OFFICIAL_BRAND_LOGOS, BRAND_SVG_LOGOS, BRAND_ALIASES } from './brandLogos';

export const BRAND_LOGOS_MAP: Record<string, string> = {
  ...BRAND_SVG_LOGOS,
  ...OFFICIAL_BRAND_LOGOS,
};

export const getBrandLogo = (brandName: string, fallbackImage?: string): string => {
  const norm = (brandName || '').trim();
  const alias = BRAND_ALIASES[norm] || norm;

  // 1. Official saved brand logo file (from official brand sites / brand repositories)
  if (OFFICIAL_BRAND_LOGOS[alias]) return OFFICIAL_BRAND_LOGOS[alias];
  if (OFFICIAL_BRAND_LOGOS[norm]) return OFFICIAL_BRAND_LOGOS[norm];

  // 2. Direct Map match
  if (BRAND_LOGOS_MAP[alias]) return BRAND_LOGOS_MAP[alias];
  if (BRAND_LOGOS_MAP[norm]) return BRAND_LOGOS_MAP[norm];

  // 3. Direct SVG Vector Logo match
  if (BRAND_SVG_LOGOS[alias]) return BRAND_SVG_LOGOS[alias];
  if (BRAND_SVG_LOGOS[norm]) return BRAND_SVG_LOGOS[norm];
  
  // 4. Substring match
  for (const [key, url] of Object.entries(OFFICIAL_BRAND_LOGOS)) {
    if (norm.includes(key) || key.includes(norm)) {
      return url;
    }
  }

  for (const [key, url] of Object.entries(BRAND_LOGOS_MAP)) {
    if (norm.includes(key) || key.includes(norm)) {
      return url;
    }
  }

  return fallbackImage || BRAND_SVG_LOGOS['DEFAULT'];
};

export const POPULAR_BRANDS: BrandInfo[] = [
  {
    id: 'nobrand',
    name: '노브랜드',
    engName: 'No Brand',
    logo: BRAND_LOGOS_MAP['노브랜드'],
    bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80',
    category: '간편식·스낵',
    slogan: '브랜드가 아니다. 소비자다 - 최적의 품질과 압도적 가성비',
    description: '숯불데리야끼 닭꼬치, 초코칩쿠키, 칠리새우, 자색고구마칩 등 대한민국 1등 PB 노브랜드 대표 먹거리 총집합.',
    officialUrl: 'https://emart.ssg.com',
    badge: '국민 가성비 1등 PB',
    isPopular: true
  },
  {
    id: 'mcdonalds',
    name: '맥도날드',
    engName: "McDonald's",
    logo: BRAND_LOGOS_MAP['맥도날드'],
    bannerImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&auto=format&fit=crop&q=80',
    category: '패스트푸드',
    slogan: "I'm lovin' it! 전 세계가 사랑하는 버거와 감자튀김",
    description: '100% 순 쇠고기 패티의 빅맥, 바삭한 맥스파이시 상하이 버거, 바삭한 후렌치 후라이까지!',
    officialUrl: 'https://www.mcdonalds.co.kr',
    badge: '글로벌 No.1 버거',
    isPopular: true
  },
  {
    id: 'burgerking',
    name: '버거킹',
    engName: 'Burger King',
    logo: BRAND_LOGOS_MAP['버거킹'],
    bannerImage: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1000&auto=format&fit=crop&q=80',
    category: '패스트푸드',
    slogan: 'TASTE IS KING! 직화로 구워 불맛 가득한 와퍼',
    description: '불맛 가득 직화 패티와 신선한 야채의 묵직한 조화, 콰트로치즈와퍼와 몬스터와퍼의 성지.',
    officialUrl: 'https://www.burgerking.co.kr',
    badge: '직화 패티 와퍼의 제왕',
    isPopular: true
  },
  {
    id: 'momstouch',
    name: '맘스터치',
    engName: "Mom's Touch",
    logo: BRAND_LOGOS_MAP['맘스터치'],
    bannerImage: 'https://images.unsplash.com/photo-1619881590738-a111d176d906?w=1000&auto=format&fit=crop&q=80',
    category: '패스트푸드',
    slogan: '빠르게보다 ALL 바르게! 두툼한 통다리살 치킨버거',
    description: '육즙 가득 바삭한 통다리살 싸이버거와 중독성 넘치는 케이준 양념감자.',
    officialUrl: 'https://www.momstouch.co.kr',
    badge: '치킨버거 압도적 1위',
    isPopular: true
  },
  {
    id: 'lotteria',
    name: '롯데리아',
    engName: 'Lotteria',
    logo: BRAND_LOGOS_MAP['롯데리아'],
    bannerImage: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=1000&auto=format&fit=crop&q=80',
    category: '패스트푸드',
    slogan: '맛있는 즐거움! 대한민국 최초의 K-버거',
    description: '30년 전통의 리아 불고기와 리아 새우, 치즈 폭포 모짜렐라인더버거와 한우불고기버거.',
    officialUrl: 'https://www.lotteeats.com',
    badge: '대한민국 K-버거 원조',
    isPopular: true
  },
  {
    id: 'kfc',
    name: 'KFC',
    engName: 'KFC',
    logo: BRAND_LOGOS_MAP['KFC'],
    bannerImage: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=1000&auto=format&fit=crop&q=80',
    category: '패스트푸드',
    slogan: 'Original Recipe! 커넬 샌더스의 70년 전통 치킨 & 버거',
    description: '매콤바삭 통가슴살 징거버거, 해시브라운 타워버거, 바삭한 핫크리스피 치킨의 대명사.',
    officialUrl: 'https://www.kfckorea.com',
    badge: '치킨 & 버거 원조 맛집',
    isPopular: true
  },
  {
    id: 'starbucks',
    name: '스타벅스',
    engName: 'Starbucks',
    logo: BRAND_LOGOS_MAP['스타벅스'],
    bannerImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&auto=format&fit=crop&q=80',
    category: '커피·음료',
    slogan: 'Inspiring and nurturing the human spirit',
    description: '에스프레소 기반의 스페셜티 커피와 시즌 한정 프로모션 음료, 프리미엄 베이커리.',
    officialUrl: 'https://www.starbucks.co.kr',
    badge: '글로벌 커피 No.1',
    isPopular: true
  },
  {
    id: 'megacoffee',
    name: '메가MGC커피',
    engName: 'Mega Coffee',
    logo: BRAND_LOGOS_MAP['메가MGC커피'],
    bannerImage: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=1000&auto=format&fit=crop&q=80',
    category: '커피·음료',
    slogan: '가성비와 트렌디한 메뉴의 만남, 즐거움이 가득한 메가',
    description: '합리적인 가격의 대용량 아메리카노와 시즌별 화려한 신메뉴 음료 라인업.',
    officialUrl: 'https://www.mega-mgccoffee.com',
    badge: '대용량 가성비 카페',
    isPopular: true
  },
  {
    id: 'composecoffee',
    name: '컴포즈커피',
    engName: 'Compose Coffee',
    logo: BRAND_LOGOS_MAP['컴포즈커피'],
    bannerImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1000&auto=format&fit=crop&q=80',
    category: '커피·음료',
    slogan: '신선한 고품질 커피를 합리적인 가격에 즐기는 컴포즈커피',
    description: '1A등급 프리미엄 원유와 자체 로스팅 공장에서 갓 볶은 스페셜티 아라비카 원두로 완성한 대용량 커피 & 시그니처 음료 라인업.',
    officialUrl: 'https://composecoffee.com',
    badge: '대한민국 대표 대용량 스페셜티',
    isPopular: true
  },
  {
    id: 'paikdabang',
    name: '빽다방',
    engName: "Paik's Coffee",
    logo: BRAND_LOGOS_MAP['빽다방'],
    bannerImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&auto=format&fit=crop&q=80',
    category: '커피·음료',
    slogan: '싸다! 크다! 맛있다! 백종원의 원조 커피',
    description: '부담 없는 착한 가격과 압도적인 용량! 원조커피부터 완전딸기빽스치노까지 온 가족이 즐기는 국민 카페.',
    officialUrl: 'https://paikdabang.com',
    badge: '국민 가성비 원조 카페',
    isPopular: true
  },
  {
    id: 'ediya',
    name: '이디야커피',
    engName: 'Ediya Coffee',
    logo: BRAND_LOGOS_MAP['이디야커피'],
    bannerImage: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1000&auto=format&fit=crop&q=80',
    category: '커피·음료',
    slogan: '언제나 우리 곁에 있는 대한민국 대표 커피 브랜드',
    description: '국내 3,000호점을 돌파한 No.1 커피 프랜차이즈. 토피 넛 라떼부터 달콤한 플랫치노까지 친근하고 편안한 맛.',
    officialUrl: 'https://www.ediya.com',
    badge: '국내 최다 매장 국민 커피',
    isPopular: true
  },
  {
    id: 'twosome',
    name: '투썸플레이스',
    engName: 'A Twosome Place',
    logo: BRAND_LOGOS_MAP['투썸플레이스'],
    bannerImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1000&auto=format&fit=crop&q=80',
    category: '커피·음료',
    slogan: 'PREMIUM DESSERT CAFE, 나만의 즐거운 힐링 공간',
    description: '원두의 개성을 살린 스페셜티 블렌드와 프리미엄 디저트 페어링. 신촌커피, 스트로베리 피치 프라페 등 감각적인 프리미엄 음료.',
    officialUrl: 'https://www.twosome.co.kr',
    badge: '프리미엄 디저트 카페 No.1',
    isPopular: true
  },
  {
    id: 'paulbassett',
    name: '폴바셋',
    engName: 'Paul Bassett',
    logo: BRAND_LOGOS_MAP['폴바셋'],
    bannerImage: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1000&auto=format&fit=crop&q=80',
    category: '커피·음료',
    slogan: '월드 바리스타 챔피언 폴 바셋의 프리미엄 스페셜티',
    description: '엄선된 스페셜티 생두와 상하목장 프리미엄 원유가 선사하는 극상의 부드러움. 시그니처 룽고와 아이스크림 라떼의 독보적 풍미.',
    officialUrl: 'https://www.baristapaulbassett.co.kr',
    badge: '월드 챔피언 스페셜티',
    isPopular: true
  },
  {
    id: 'theventi',
    name: '더벤티',
    engName: 'The Venti',
    logo: BRAND_LOGOS_MAP['더벤티'],
    bannerImage: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=1000&auto=format&fit=crop&q=80',
    category: '커피·음료',
    slogan: '가장 대중적이고 압도적인 벤티 사이즈의 감동',
    description: '오직 벤티 사이즈로만 승부하는 대용량 전문 음료 브랜드! 진한 다크 로스팅 커피부터 멜팅초코, 과일 주스까지 다채로운 맛.',
    officialUrl: 'https://www.theventi.co.kr',
    badge: '오리지널 대용량 전문 카페',
    isPopular: true
  },
  {
    id: 'mammoth',
    name: '매머드커피',
    engName: 'Mammoth Coffee',
    logo: BRAND_LOGOS_MAP['매머드커피'],
    bannerImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1000&auto=format&fit=crop&q=80',
    category: '커피·음료',
    slogan: '매일 마시는 커피, 더 스마트하고 합리적이게',
    description: '합리적인 가격의 3가지 사이즈 선택과 간편한 모바일 오더로 즐기는 도심형 실속 카페.',
    officialUrl: 'https://www.mmthcoffee.com',
    badge: '스마트 가성비 카페',
    isPopular: true
  },
  {
    id: 'orion',
    name: '오리온',
    engName: 'Orion',
    logo: BRAND_LOGOS_MAP['오리온'],
    bannerImage: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1000&auto=format&fit=crop&q=80',
    category: '과자·스낵',
    slogan: '정(情)을 나누는 국민 스낵 & 파이 명가',
    description: '초코파이, 꼬북칩, 포카칩, 스윙칩 등 전 세대가 사랑하는 바삭달콤한 스낵.',
    officialUrl: 'https://www.orionworld.com',
    badge: '국민 스낵 명가',
    isPopular: true
  },
  {
    id: 'nongshim',
    name: '농심',
    engName: 'Nongshim',
    logo: BRAND_LOGOS_MAP['농심'],
    bannerImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1000&auto=format&fit=crop&q=80',
    category: '라면·간편식',
    slogan: '인생을 맛있게! 농심',
    description: '신라면 툼바, 짜파게티, 안성탕면, 새우깡 등 한국인의 입맛을 사로잡은 라면과 스낵.',
    officialUrl: 'https://www.nongshim.com',
    badge: 'K-라면 대표 브랜드',
    isPopular: true
  },
  {
    id: 'yonsei',
    name: '연세유업',
    engName: 'Yonsei Dairy',
    logo: BRAND_LOGOS_MAP['연세유업'],
    bannerImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop&q=80',
    category: '베이커리·디저트',
    slogan: '생크림 가득 프리미엄 디저트의 기준',
    description: '연세우유 생크림빵, 밤티라미수, 말차 등 편의점 디저트 열풍을 주도하는 크림빵 신화.',
    officialUrl: 'https://www.yonseidairy.com',
    badge: '크림빵 디저트 신화',
    isPopular: true
  },
  {
    id: 'binggrae',
    name: '빙그레',
    engName: 'Binggrae',
    logo: BRAND_LOGOS_MAP['빙그레'],
    bannerImage: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1000&auto=format&fit=crop&q=80',
    category: '아이스크림·디저트',
    slogan: '맛있는 건강과 밝은 미소를 선물하는 국민 브랜드',
    description: '메로나, 투게더, 붕어싸만코, 요맘때, 엑설런트, 더위사냥, 비비빅 등 전 세대가 사랑하는 대한민국 1등 빙과 명가.',
    officialUrl: 'https://www.bing.co.kr',
    badge: '대한민국 대표 국민 아이스크림',
    isPopular: true
  },
  {
    id: 'haitaiice',
    name: '해태아이스',
    engName: 'Haitai Icecream',
    logo: BRAND_LOGOS_MAP['해태아이스'],
    bannerImage: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=1000&auto=format&fit=crop&q=80',
    category: '아이스크림·디저트',
    slogan: '12시에 만나요 부라보콘! 대한민국 빙과 역사의 산실',
    description: '부라보콘, 바밤바, 누가바, 쌍쌍바, 탱크보이, 폴라포 등 온 국민의 추억과 현재를 함께하는 스테디셀러 아이스크림.',
    officialUrl: 'https://www.bing.co.kr/product/list?type=1',
    badge: '국민 콘&바 헤리티지',
    isPopular: true
  },
  {
    id: 'baskinrobbins',
    name: '배스킨라빈스',
    engName: 'Baskin Robbins',
    logo: BRAND_LOGOS_MAP['배스킨라빈스'],
    bannerImage: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=1000&auto=format&fit=crop&q=80',
    category: '베이커리·디저트',
    slogan: '골라 먹는 31가지 즐거움, 프리미엄 아이스크림 No.1',
    description: '엄마는 외계인, 아몬드 봉봉, 민트 초콜릿 칩, 이달의 맛 도쿄바나나 크렘브륄레까지 매일 새로운 행복을 전하는 글로벌 No.1 아이스크림 브랜드.',
    officialUrl: 'https://www.baskinrobbins.co.kr',
    badge: '국민 No.1 아이스크림',
    isPopular: true
  },
  {
    id: 'lottewellfood',
    name: '롯데웰푸드',
    engName: 'Lotte Wellfood',
    logo: BRAND_LOGOS_MAP['롯데웰푸드'],
    bannerImage: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=1000&auto=format&fit=crop&q=80',
    category: '제과·빙과',
    slogan: '달콤한 순간을 선물하는 종합 제과·빙과 브랜드',
    description: '월드콘, 설레임, 돼지바, 빠삐코, 찰떡아이스, 빵빠레, 티코, 구구콘, 빼빼로 등 대한민국 1등 제과 & 빙과 라인업.',
    officialUrl: 'https://www.lottewellfood.com',
    badge: '종합 제과·빙과 리더',
    isPopular: true
  },
  {
    id: 'haitai',
    name: '해태제과',
    engName: 'Haitai',
    logo: BRAND_LOGOS_MAP['해태제과'],
    bannerImage: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=1000&auto=format&fit=crop&q=80',
    category: '과자·스낵',
    slogan: '맛있는 과자, 행복한 미소',
    description: '홈런볼, 허니버터칩, 맛동산, 에이스 등 오랫동안 사랑받는 스테디셀러 스낵.',
    officialUrl: 'https://www.ht.co.kr',
    badge: '스테디셀러 스낵',
    isPopular: true
  },
  {
    id: 'samyang',
    name: '삼양식품',
    engName: 'Samyang Foods',
    logo: BRAND_LOGOS_MAP['삼양식품'],
    bannerImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1000&auto=format&fit=crop&q=80',
    category: '라면·간편식',
    slogan: '맛있는 즐거움! K-스파이시 불닭 & 원조 삼양라면',
    description: '전 세계를 사로잡은 매운맛 불닭볶음면 시리즈와 60년 전통 삼양라면.',
    officialUrl: 'https://www.samyangfoods.com',
    badge: '글로벌 K-매운맛',
    isPopular: true
  },
  {
    id: 'ottogi',
    name: '오뚜기',
    engName: 'Ottogi',
    logo: BRAND_LOGOS_MAP['오뚜기'],
    bannerImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&auto=format&fit=crop&q=80',
    category: '라면·간편식',
    slogan: '스위트홈 오뚜기, 더 맛있고 즐거운 식탁',
    description: '진라면, 열라면, 참깨라면부터 오뚜기 카레와 마요네스까지 국민 밥상의 든든한 동반자.',
    officialUrl: 'https://www.ottogi.co.kr',
    badge: '국민 든든 한끼',
    isPopular: true
  },
  {
    id: 'cj',
    name: 'CJ제일제당',
    engName: 'CJ CheilJedang',
    logo: BRAND_LOGOS_MAP['CJ제일제당'],
    bannerImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&auto=format&fit=crop&q=80',
    category: '라면·간편식',
    slogan: '비비고·햇반·고메가 전하는 K-푸드의 기준',
    description: '믿고 먹는 한식 대표 비비고 만두, 갓 지은 밥맛 햇반, 프리미엄 미식 고메.',
    officialUrl: 'https://www.cj.co.kr',
    badge: 'K-푸드 대표 브랜드',
    isPopular: true
  },
  {
    id: 'bibigo',
    name: '비비고',
    engName: 'bibigo',
    logo: BRAND_LOGOS_MAP['비비고'],
    bannerImage: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=1000&auto=format&fit=crop&q=80',
    category: '라면·간편식',
    slogan: '정성으로 빚은 한식의 자부심, 글로벌 No.1 K-푸드',
    description: '왕교자부터 맑고 깊은 국물요리, 김치까지 대한민국을 넘어 전 세계의 식탁을 사로잡은 비비고.',
    officialUrl: 'https://www.cjthemarket.com',
    badge: '글로벌 K-푸드 1위',
    isPopular: true
  },
  {
    id: 'binggrae',
    name: '빙그레',
    engName: 'Binggrae',
    logo: BRAND_LOGOS_MAP['빙그레'],
    bannerImage: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=1000&auto=format&fit=crop&q=80',
    category: '베이커리·디저트',
    slogan: '맛있는 미소, 건강하고 달콤한 행복',
    description: '단지우유 바나나맛우유, 요플레, 투게더, 붕어싸만코, 더위사냥 등 추억과 행복의 디저트.',
    officialUrl: 'https://www.bing.co.kr',
    badge: '국민 디저트·유제품',
    isPopular: true
  },
  {
    id: 'cocacola',
    name: '코카콜라',
    engName: 'Coca-Cola',
    logo: BRAND_LOGOS_MAP['코카콜라'],
    bannerImage: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=1000&auto=format&fit=crop&q=80',
    category: '커피·음료',
    slogan: 'Real Magic! 짜릿한 탄산의 오리지널',
    description: '코카-콜라 오리지널, 제로 슈거, 스프라이트, 토레타 등 일상을 깨우는 상쾌함.',
    officialUrl: 'https://www.coca-cola.com/kr/ko',
    badge: '글로벌 No.1 음료',
    isPopular: true
  },
  {
    id: 'gs25',
    name: 'GS25',
    engName: 'GS25',
    logo: BRAND_LOGOS_MAP['GS25'],
    bannerImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&auto=format&fit=crop&q=80',
    category: '라면·간편식',
    slogan: '라이프스타일 플랫폼 GS25의 트렌디 신상',
    description: '혜자로운 집밥 도시락, 점보 도시락라면, 넷플릭스 콜라보 스낵 등 트렌디 편의점 신상.',
    officialUrl: 'https://gs25.gsretail.com',
    badge: '트렌드 1등 편의점',
    isPopular: true
  },
  {
    id: 'cu',
    name: 'CU',
    engName: 'CU',
    logo: BRAND_LOGOS_MAP['CU'],
    bannerImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop&q=80',
    category: '베이커리·디저트',
    slogan: '좋은 친구 같은 편의점, 매일 새로운 즐거움 CU',
    description: '연세우유 생크림빵, HEYROO 스낵, 백종원 간편식 등 품절 대란 편의점 핫아이템.',
    officialUrl: 'https://cu.bgfretail.com',
    badge: '디저트 맛집 편의점',
    isPopular: true
  },
  {
    id: 'maeil',
    name: '매일유업',
    engName: 'Maeil',
    logo: BRAND_LOGOS_MAP['매일유업'],
    bannerImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop&q=80',
    category: '베이커리·디저트',
    slogan: '매일 더 건강하게, 신선함을 전하는 유제품',
    description: '아몬드브리즈, 어메이징 오트, 소화가 잘되는 우유, 바리스타룰스 프리미엄 음료.',
    officialUrl: 'https://www.maeil.com',
    badge: '건강 유제품 명가',
    isPopular: true
  },
  {
    id: 'parisbaguette',
    name: '파리바게뜨',
    engName: 'Paris Baguette',
    logo: BRAND_LOGOS_MAP['파리바게뜨'],
    bannerImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop&q=80',
    category: '베이커리·디저트',
    slogan: '매일 아침 구워내는 신선하고 따뜻한 빵의 즐거움',
    description: '대한민국 No.1 베이커리. 그대로토스트, 실키롤케익, 인생크림빵부터 시즌 한정 케이크까지!',
    officialUrl: 'https://www.paris.co.kr',
    badge: '국민 1위 베이커리',
    isPopular: true
  },
  {
    id: 'touslesjours',
    name: '뚜레쥬르',
    engName: 'Tous Les Jours',
    logo: BRAND_LOGOS_MAP['뚜레쥬르'],
    bannerImage: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1000&auto=format&fit=crop&q=80',
    category: '베이커리·디저트',
    slogan: '매일매일 신선하게, 건강하고 맛있는 프리미엄 베이커리',
    description: '자연에서 온 좋은 재료로 정성을 다해 구워내는 순진우유롤, 치즈방앗간, 진한 초코 케이크의 명가.',
    officialUrl: 'https://www.tlj.co.kr',
    badge: '프리미엄 데일리 베이커리',
    isPopular: true
  },
  {
    id: 'sungsimdang',
    name: '성심당',
    engName: 'Sungsimdang',
    logo: BRAND_LOGOS_MAP['성심당'],
    bannerImage: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=1000&auto=format&fit=crop&q=80',
    category: '베이커리·디저트',
    slogan: '모든 이가 다 좋게 여기는 일을 하십시오 (Since 1956)',
    description: '전국 빵지순례 1위 성지! 바삭한 튀김소보로, 향긋한 판타롱부추빵, 명란바게트, 생딸기 가득 딸기시루까지.',
    officialUrl: 'https://www.sungsimdang.co.kr',
    badge: '전국 빵지순례 1위 성지',
    isPopular: true
  },
  {
    id: 'londonbagel',
    name: '런던베이글뮤지엄',
    engName: 'London Bagel Museum',
    logo: BRAND_LOGOS_MAP['런던베이글뮤지엄'],
    bannerImage: 'https://images.unsplash.com/photo-1550950158-d0d960dff51b?w=1000&auto=format&fit=crop&q=80',
    category: '베이커리·디저트',
    slogan: '세상에서 가장 따뜻하고 쫄깃한 브리티시 베이글',
    description: '대한민국 베이글 열풍의 주역. 쪽파 프레첼 베이글, 포테이토 치즈, 브릭레인 샌드위치 등 오픈런 명소.',
    officialUrl: 'https://www.instagram.com/london.bagel.museum',
    badge: '줄서서 먹는 베이글 성지',
    isPopular: true
  },
  {
    id: 'knotted',
    name: '노티드',
    engName: 'Knotted',
    logo: BRAND_LOGOS_MAP['노티드'],
    bannerImage: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=1000&auto=format&fit=crop&q=80',
    category: '베이커리·디저트',
    slogan: '기분 좋은 달콤함과 스마일이 가득한 프리미엄 디저트',
    description: '입안 가득 차오르는 부드러운 우유 생크림 도넛, 클래식 바닐라, 얼그레이 크림 도넛의 신드롬.',
    officialUrl: 'https://knotted-donut.com',
    badge: '크림도넛 트렌드 리더',
    isPopular: true
  },
  {
    id: 'samsong',
    name: '삼송빵집',
    engName: 'Samsong Bakery',
    logo: BRAND_LOGOS_MAP['삼송빵집'],
    bannerImage: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=1000&auto=format&fit=crop&q=80',
    category: '베이커리·디저트',
    slogan: '달콤톡톡 중독적인 대구 명물 원조 마약옥수수빵 (Since 1957)',
    description: '3대를 이어온 전통의 맛! 톡톡 터지는 통옥수수와 부드러운 특제 소스의 통옥수수빵과 오븐에 구운 수제 고로케.',
    officialUrl: 'http://www.samsongbread.com',
    badge: '3대 전통 원조 마약빵',
    isPopular: true
  },
  {
    id: 'taegeukdang',
    name: '태극당',
    engName: 'Taegeukdang',
    logo: BRAND_LOGOS_MAP['태극당'],
    bannerImage: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1000&auto=format&fit=crop&q=80',
    category: '베이커리·디저트',
    slogan: '서울에서 가장 오래된 빵집 (Since 1946)',
    description: '바삭하고 쫀득한 수제 모나카 아이스크림, 묵직하고 신선한 옛날 야채 사라다빵, 70년 전통 단팥빵.',
    officialUrl: 'https://taegeukdang.com',
    badge: '서울 최고(最古) 빵집 명가',
    isPopular: true
  },
  {
    id: 'tteokbokkida',
    name: '떡볶이다',
    engName: 'Tteokbokkida',
    logo: BRAND_LOGOS_MAP['떡볶이다'],
    bannerImage: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=1000&auto=format&fit=crop&q=80',
    category: '간편식·분식',
    slogan: '대한민국 1등 떡볶이 전문 브랜드, 진짜 맛있는 떡볶이다!',
    description: '오리지널 국물떡볶이부터 매콤 꾸덕 로제, 직화 불맛 차돌, 쫀득 치즈 폭탄까지! 떡볶이의 모든 즐거움을 선사하는 프리미엄 분식 대표 브랜드.',
    badge: 'K-떡볶이 대표 브랜드',
    isPopular: true
  }
];

export interface ProcessedBrand {
  name: string;
  engName?: string;
  logo: string;
  bannerImage?: string;
  category: string;
  slogan: string;
  description?: string;
  officialUrl?: string;
  badge?: string;
  isPopular?: boolean;
  productCount: number;
  avgRating: number;
  totalReviews: number;
  products: Product[];
}

/**
 * Extract all unique brands from products list and augment with metadata
 */
export const getAggregatedBrands = (products: Product[]): ProcessedBrand[] => {
  const brandMap = new Map<string, Product[]>();

  // Group products by brand
  products.forEach((p) => {
    if (!p.brand) return;
    const brandName = p.brand.trim();
    if (!brandName) return;

    if (!brandMap.has(brandName)) {
      brandMap.set(brandName, []);
    }
    brandMap.get(brandName)!.push(p);
  });

  const result: ProcessedBrand[] = [];

  brandMap.forEach((brandProducts, brandName) => {
    const knownMeta = POPULAR_BRANDS.find(
      (b) => b.name === brandName || brandName.includes(b.name) || b.name.includes(brandName)
    );

    // Calculate rating and review counts
    const totalRating = brandProducts.reduce((acc, curr) => acc + (curr.overallRating || 4.5), 0);
    const avgRating = Number((totalRating / (brandProducts.length || 1)).toFixed(1));
    const totalReviews = brandProducts.reduce((acc, curr) => acc + (curr.ratingCount || 0), 0);

    // Derive category
    const mainCategory = brandProducts[0]?.category || '기타';

    // Logo resolution
    const brandLogo = knownMeta?.logo || getBrandLogo(brandName);
    const defaultBanner = brandProducts[0]?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';

    result.push({
      name: brandName,
      engName: knownMeta?.engName,
      logo: brandLogo,
      bannerImage: knownMeta?.bannerImage || defaultBanner,
      category: knownMeta?.category || mainCategory,
      slogan: knownMeta?.slogan || `${brandName}의 공식 인기 메뉴 및 신제품 라인업`,
      description: knownMeta?.description || `${brandName}에서 판매 중인 다양한 상품과 실시간 리뷰를 확인해보세요.`,
      officialUrl: knownMeta?.officialUrl,
      badge: knownMeta?.badge || (brandProducts.length >= 4 ? '인기 브랜드' : '공식 입점'),
      isPopular: knownMeta?.isPopular || brandProducts.length >= 3,
      productCount: brandProducts.length,
      avgRating,
      totalReviews,
      products: brandProducts
    });
  });

  // Sort by popular first, then by product count
  return result.sort((a, b) => {
    if (a.isPopular && !b.isPopular) return -1;
    if (!a.isPopular && b.isPopular) return 1;
    return b.productCount - a.productCount;
  });
};
