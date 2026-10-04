import { ECouponItem } from '../types';

export const INITIAL_ECOUPONS: ECouponItem[] = [
  {
    id: 'coupon-starbucks-ame',
    brand: '스타벅스',
    name: '아이스 카페 아메리카노 T',
    price: 4500,
    originalPrice: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&q=80',
    category: '카페/음료',
    description: '진한 에스프레소와 시원한 정수물, 얼음이 어우러져 깔끔하고 시원한 스타벅스 대표 시그니처 음료입니다.',
    exchangeGuide: '전국 스타벅스 매장에서 사용 가능 (일부 공항, 백화점 등 특수 매장 제외)',
    expiryDays: 93,
    notices: [
      '본 모바일 e쿠폰은 매장 주문 시 카운터에 바코드를 제시하여 결제합니다.',
      '동일 가격 이상의 타 음료로 변경 가능하며 차액은 추가 결제하실 수 있습니다.',
      '유효기간 만료 시 연장 및 환불 규정은 고객센터 정책에 따릅니다.',
      '사이렌 오더 주문 시에도 모바일 상품권 번호를 등록하여 사용 가능합니다.'
    ]
  }
];
