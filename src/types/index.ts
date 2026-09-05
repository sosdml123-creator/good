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
  | 'admin';

