export type ProductCategory = 
  | '전체'
  | '신제품'
  | '과자'
  | '음료'
  | '빵·디저트'
  | '간편식'
  | '과일'
  | '식재료'
  | '고기·수산'
  | '기타';

export interface DetailedRating {
  taste: number;
  value: number;
  portion: number;
  repurchase: number;
}

export interface FreshMetrics {
  sweetness: number;  // 당도 (Brix / 5점 척도)
  freshness: number;  // 신선도
  texture: number;    // 식감
  value: number;      // 가성비
}

export interface BrandRankingItem {
  rank: number;
  name: string;
  brand: string;
  rating: number;
  ratingCount: number;
  price?: number;
  tag?: string;
  image?: string;
  tasteScore?: number;        // 맛/당도 평점 (e.g. 4.9)
  brix?: string;              // 당도 (e.g. "14.2 Brix")
  tasteDescription?: string;  // 맛 특장점 (e.g. "과즙이 가장 풍부하고 꿀당도가 일정함")
  bestReview?: string;        // 소비자 실측 맛 후기
  buyLink?: string;           // 바로가기 / 구매 링크
  deliveryBadge?: string;     // 배송 배지 (e.g. "새벽도착 🚀")
}

export interface ProduceNutritionDetail {
  brixGrade?: string;          // 당도 등급 (e.g. "13.5 ~ 15 Brix 특당도 선별")
  waterContent?: string;       // 수분율 (e.g. "89%")
  keyNutrients: { name: string; value: string; desc: string }[]; // 주요 영양소 (e.g. 비타민 C, 펙틴)
  healthBenefits: string[];    // 건강 효능 (e.g. 피로 회복, 노폐물 배출)
  seasonalPeak?: string;       // 제철 시기 (e.g. "7월 ~ 8월 제철")
  tasteTip?: string;           // 가장 맛있게 먹는 법 / 보관 팁
  sweetnessScore?: number;     // 당도 지수 (5점 만점)
  juicinessScore?: number;     // 과즙/수분 지수 (5점 만점)
  textureScore?: number;       // 식감 지수 (5점 만점)
}

export interface RegionRankingItem {
  rank: number;
  restaurantName: string;
  region: string;
  rating: number;
  reviewCount: number;
  signatureMenu: string;
  priceRange?: string;
  image?: string;
}

export interface RestaurantInfo {
  restaurantName?: string;
  region?: string;
  address?: string;
  popularVariations?: string[]; // e.g. ['평양냉면', '함흥냉면', '비빔냉면', '물냉면']
  regionRankings?: RegionRankingItem[];
}

export interface NutritionInfo {
  calories?: number;
  sodium?: string;        // e.g. "280mg (14%)"
  carbs?: string;         // e.g. "48g (15%)"
  sugar?: string;         // e.g. "18g (18%)"
  fat?: string;           // e.g. "22g (41%)"
  transFat?: string;      // e.g. "0g"
  satFat?: string;        // e.g. "10g (67%)"
  cholesterol?: string;   // e.g. "5mg (2%)"
  protein?: string;       // e.g. "5g (9%)"
}

export interface StoreStockItem {
  store: 'CU' | 'GS25' | '세븐일레븐' | '이마트24' | '대형마트' | '마켓컬리' | '쿠팡프레시' | string;
  status: '입고완료' | '품절임박' | '예약가능' | '행사진행' | '일시품절';
  stockCount: number;
  price: number;
  discountPrice?: number;
  eventBadge?: string;    // '1+1', '2+1', '샛별배송', '새벽도착', '특가할인'
  appLink?: string;       // Direct official app/web link
  deliveryTime?: string;  // '매장 즉시 픽업', '새벽 7시 전 도착'
}

export interface NearbyStore {
  id: string;
  brand: 'CU' | 'GS25' | '세븐일레븐' | '이마트24' | '대형마트';
  name: string;          // e.g. "CU 역삼타워점"
  distance: string;      // e.g. "150m"
  address: string;       // e.g. "서울 강남구 테헤란로 152"
  phone: string;         // e.g. "02-555-1234"
  stockCount: number;    // e.g. 7
  stockStatus: '여유' | '품절임박' | '일시품절' | '예약가능';
  badge?: string;        // '1+1 행사'
  isOpen24h: boolean;
}

export type StoreStock = StoreStockItem;

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subCategory?: string; // e.g. '스낵', '초콜릿', '복숭아', '소고기' 등
  itemType?: 'packaged' | 'fresh' | 'restaurant';
  image: string;
  releaseDate: string;
  price: number;
  discountRate?: number;
  overallRating: number;
  ratingCount: number;
  detailedRating: DetailedRating;
  freshMetrics?: FreshMetrics;
  brandRankings?: BrandRankingItem[];
  restaurantInfo?: RestaurantInfo;
  bestQuotes?: string[];
  description?: string;
  calories?: number;
  volume?: string;
  stores?: string[];
  storeStocks?: StoreStockItem[];
  repurchasePercent?: number;
  isToday?: boolean;
  isHot?: boolean;
  nutrition?: NutritionInfo;
  ingredients?: string;       // 원재료명 및 함량
  allergens?: string[];       // 알레르기 유발물질 e.g. ['밀', '대두', '우유']
  origin?: string;            // 원산지 / 생산지
  manufacturer?: string;      // 제조원 / 유통판매원
  storageMethod?: string;     // 보관방법
  shelfLife?: string;         // 유통/소비기한
  precautions?: string;       // 섭취 시 주의사항
  produceDetails?: ProduceNutritionDetail; // 자연 원물(과일, 채소, 생물 수산물) 영양 성분 & 특성 상세
  searchInfluxCount?: number; // 검색 유입수 (검색 후 상세 방문 및 유입 클릭 수)
}

export interface ReviewComment {
  id: string;
  userName: string;
  userAvatar: string;
  userLevel: string;
  content: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  userName: string;
  userAvatar: string;
  userLevel: string;
  rating: number;
  detailedRating?: DetailedRating;
  freshMetrics?: FreshMetrics;
  content: string;
  images?: string[];
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  comments?: ReviewComment[];
  createdAt: string;
  tags?: string[];
}

export interface PostComment {
  id: string;
  userName: string;
  userAvatar: string;
  userLevel: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  category: '인기글' | '자유게시판' | '질문/답변' | '이벤트';
  title: string;
  content: string;
  author: string;
  authorAvatar?: string;
  authorLevel?: string;
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  comments?: PostComment[];
  createdAt: string;
  images?: string[];
}

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  level: string;
  points: number;
  isAnonymous?: boolean;
  email?: string;
  provider?: 'apple' | 'google' | 'kakao' | 'anonymous';
}

export interface BannerItem {
  id: string;
  image: string;
  badge: string;
  title: string;
  subtitle: string;
  buttonText: string;
  linkCategory?: ProductCategory;
  linkProductId?: string;
  isActive: boolean;
  order: number;
}

export interface BattleConfig {
  title: string;
  subtitle: string;
  productAId: string;
  labelA: string;
  productBId: string;
  labelB: string;
  percentA: number;
}

export type ActiveTab = 
  | 'home' 
  | 'category' 
  | 'write' 
  | 'community' 
  | 'my' 
  | 'detail' 
  | 'compare' 
  | 'alert_settings' 
  | 'search'
  | 'admin'
  | 'event_detail';

export interface PromotionEvent {
  id: string;
  title: string;
  subtitle: string;
  badge: string; // e.g. '체험단 100명', '1+1 특가', '선착순 증정', '타임딜', '포인트 2배'
  category: '체험단' | '프로모션' | '할인특가' | '이벤트';
  bannerImage: string;
  startDate: string;
  endDate: string;
  dDay: string; // e.g. 'D-5', '오늘마감', '상시'
  status: 'ongoing' | 'ended' | 'upcoming';
  description: string;
  reward: string; // e.g. '꼬북칩 신제품 정품 1박스 (100명)'
  targetProductId?: string; // 연관 상품 ID
  externalLink?: string;
  actionButtonText: string; // e.g. '무료 체험단 신청하기', '쿠폰 즉시 받기'
  participantsCount: number;
  isParticipated?: boolean;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'event' | 'product' | 'notice';
  targetId: string; // eventId or productId
  imageUrl?: string;
  timestamp: string;
  isRead: boolean;
  badge?: string;
}

export interface PendingProduct {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subCategory?: string;
  itemType?: 'packaged' | 'fresh' | 'restaurant';
  image: string;
  price: number;
  discountRate?: number;
  releaseDate: string;
  stores: string[];
  description: string;
  sourceName: string;
  sourceUrl?: string;
  crawledAt: string;
  status: 'pending' | 'approved' | 'rejected';
  calories?: number;
  volume?: string;
  ingredients?: string;
  allergens?: string[];
  origin?: string;
  manufacturer?: string;
  storageMethod?: string;
  shelfLife?: string;
  nutrition?: NutritionInfo;
  storeStocks?: StoreStockItem[];
  bestQuotes?: string[];
  reviewedAt?: string;
}

