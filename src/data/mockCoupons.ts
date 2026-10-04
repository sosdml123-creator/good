import { ECouponItem } from '../types';

export const INITIAL_ECOUPONS: ECouponItem[] = [
  // 편의점/마트
  {
    id: 'coupon-cu-3000',
    brand: 'CU',
    name: 'CU 모바일 금액권 3,000원',
    price: 3000,
    originalPrice: 3000,
    imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&q=80',
    category: '편의점/마트',
    description: '전국 CU 편의점에서 신상품, 과자, 삼각김밥, 음료 등 원하는 상품을 현금처럼 자유롭게 결제할 수 있는 모바일 금액권입니다.',
    exchangeGuide: '전국 CU 매장에서 결제 시 바코드 제시 (특수 점포 제외)',
    expiryDays: 93,
    notices: [
      '본 상품권은 전국 CU 편의점 매장에서 사용 가능합니다.',
      '권면가액 범위 내에서 분할 사용이 가능하며 잔액은 자동 저장됩니다.',
      '담배, 복권, 택배 등 일부 대행 수수료 서비스 품목은 결제가 제한될 수 있습니다.'
    ]
  },
  {
    id: 'coupon-gs25-3000',
    brand: 'GS25',
    name: 'GS25 모바일 금액권 3,000원',
    price: 3000,
    originalPrice: 3000,
    imageUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&q=80',
    category: '편의점/마트',
    description: '전국 GS25 편의점에서 신제품 간식과 도시락, 커피 등을 결제할 수 있는 모바일 금액권입니다.',
    exchangeGuide: '전국 GS25 편의점 카운터 바코드 결제',
    expiryDays: 93,
    notices: [
      '전국 GS25 매장에서 자유롭게 분할 결제가 가능합니다.',
      '통신사 할인 및 1+1, 2+1 행사 상품에도 함께 적용 가능합니다.'
    ]
  },
  {
    id: 'coupon-cu-5000',
    brand: 'CU',
    name: 'CU 모바일 금액권 5,000원',
    price: 5000,
    originalPrice: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&q=80',
    category: '편의점/마트',
    description: '전국 CU 매장에서 넉넉하게 신상 쇼핑을 즐길 수 있는 5,000원 모바일 상품권입니다.',
    exchangeGuide: '전국 CU 매장에서 사용 가능',
    expiryDays: 93,
    notices: [
      '전국 CU 매장에서 잔액 분할 사용 가능합니다.',
      '행사 상품(1+1, 2+1) 구매 시에도 정상 결제됩니다.'
    ]
  },
  {
    id: 'coupon-gs25-5000',
    brand: 'GS25',
    name: 'GS25 모바일 금액권 5,000원',
    price: 5000,
    originalPrice: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&q=80',
    category: '편의점/마트',
    description: '전국 GS25 매장에서 신제품 도시락, 간식, 음료 결제 시 사용할 수 있는 5,000원 모바일 상품권입니다.',
    exchangeGuide: '전국 GS25 매장 결제 시 바코드 제시',
    expiryDays: 93,
    notices: [
      '전국 GS25 매장에서 분할 사용 가능합니다.'
    ]
  },

  // 카페/음료
  {
    id: 'coupon-mega-ame',
    brand: '메가MGC커피',
    name: '(ICE) 아메리카노',
    price: 2000,
    originalPrice: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&q=80',
    category: '카페/음료',
    description: '깊고 부드러운 풍미의 프리미엄 대용량 아이스 아메리카노입니다.',
    exchangeGuide: '전국 메가MGC커피 매장 (메가오더 앱 등록 가능)',
    expiryDays: 93,
    notices: [
      '매장 키오스크 및 카운터, 메가오더 앱에서 사용 가능합니다.',
      '동일 가격 이상의 타 메뉴로 변경 가능하며 차액 결제 시 사용됩니다.'
    ]
  },
  {
    id: 'coupon-compose-ame',
    brand: '컴포즈커피',
    name: '아이스 아메리카노',
    price: 1500,
    originalPrice: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
    category: '카페/음료',
    description: '고품질 비터홀릭 블렌딩으로 완성한 가성비 최고의 시원한 아이스 아메리카노입니다.',
    exchangeGuide: '전국 컴포즈커피 매장',
    expiryDays: 93,
    notices: [
      '전국 컴포즈커피 매장에서 바코드 스캔으로 이용 가능합니다.'
    ]
  },
  {
    id: 'coupon-starbucks-ame',
    brand: '스타벅스',
    name: '아이스 카페 아메리카노 T',
    price: 4500,
    originalPrice: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80',
    category: '카페/음료',
    description: '진한 에스프레소와 시원한 정수물, 얼음이 어우러져 깔끔하고 시원한 스타벅스 대표 시그니처 음료입니다.',
    exchangeGuide: '전국 스타벅스 매장 (사이렌 오더 등록 가능)',
    expiryDays: 93,
    notices: [
      '본 모바일 e쿠폰은 매장 주문 시 카운터에 바코드를 제시하여 결제합니다.',
      '동일 가격 이상의 타 음료로 변경 가능하며 차액은 추가 결제하실 수 있습니다.',
      '사이렌 오더 주문 시에도 모바일 상품권 번호를 등록하여 사용 가능합니다.'
    ]
  },
  {
    id: 'coupon-paik-ame',
    brand: '빽다방',
    name: '앗!메리카노 (ICED)',
    price: 2000,
    originalPrice: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600&q=80',
    category: '카페/음료',
    description: '100% 아라비카 고급 블렌딩 원두의 묵직한 바디감과 시원한 간얼음이 매력적인 빽다방 대표 아메리카노입니다.',
    exchangeGuide: '전국 빽다방 매장 (빽다방 멤버십 등록 가능)',
    expiryDays: 93,
    notices: [
      '전국 빽다방 매장에서 카운터 또는 키오스크 바코드 스캔 후 사용 가능합니다.'
    ]
  },

  // 베이커리/디저트
  {
    id: 'coupon-baskin-single',
    brand: '배스킨라빈스',
    name: '싱글레귤러',
    price: 3900,
    originalPrice: 3900,
    imageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&q=80',
    category: '베이커리/디저트',
    description: '배스킨라빈스 이달의 맛과 다양한 인기 아이스크림 중 1스쿱을 콘 또는 컵으로 즐기는 싱글레귤러 교환권입니다.',
    exchangeGuide: '전국 배스킨라빈스 매장 (키오스크 및 포스 결제)',
    expiryDays: 93,
    notices: [
      '전국 배스킨라빈스 매장에서 사용 가능합니다.',
      '추가 금액 결제 시 싱글킹 또는 파인트 등으로 업그레이드 가능합니다.'
    ]
  },
  {
    id: 'coupon-paris-5000',
    brand: '파리바게뜨',
    name: '파리바게뜨 모바일 상품권 5,000원',
    price: 5000,
    originalPrice: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
    category: '베이커리/디저트',
    description: '갓 구운 빵과 신상 샌드위치, 케이크를 구매할 수 있는 파리바게뜨 5,000원 모바일 상품권입니다.',
    exchangeGuide: '전국 파리바게뜨 매장 결제',
    expiryDays: 93,
    notices: [
      '전국 파리바게뜨 매장에서 분할 사용 가능합니다.'
    ]
  },

  // 패스트푸드
  {
    id: 'coupon-mcd-bulgogi',
    brand: '맥도날드',
    name: '불고기 버거 세트',
    price: 4900,
    originalPrice: 4900,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
    category: '패스트푸드',
    description: '한국인의 입맛에 딱 맞춘 달콤 짭조름한 불고기 소스와 두툼한 패티, 감자튀김과 음료가 포함된 세트 교환권입니다.',
    exchangeGuide: '전국 맥도날드 매장 카운터 및 키오스크 (맥딜리버리 제외)',
    expiryDays: 93,
    notices: [
      '전국 맥도날드 매장에서 키오스크 모바일 쿠폰 스캔 후 결제 가능합니다.'
    ]
  },
  {
    id: 'coupon-mom-thigh',
    brand: '맘스터치',
    name: '싸이버거 단품',
    price: 4900,
    originalPrice: 4900,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80',
    category: '패스트푸드',
    description: '두툼한 통다리살 패티가 통째로 들어간 맘스터치 부동의 1위 대표 시그니처 싸이버거 교환권입니다.',
    exchangeGuide: '전국 맘스터치 매장 카운터 및 키오스크',
    expiryDays: 93,
    notices: [
      '전국 맘스터치 매장에서 사용 가능합니다. 세트 업그레이드 시 차액 결제로 이용할 수 있습니다.'
    ]
  }
];
