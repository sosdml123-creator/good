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
  | '외식'
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

export interface StoreStock {
  store: 'CU' | 'GS25' | '세븐일레븐' | '이마트24' | '대형마트' | '마켓컬리' | '쿠팡프레시';
  status: '입고완료' | '품절임박' | '예약가능' | '행사진행';
  price: number;
  eventBadge?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subCategory?: string; // e.g. '복숭아', '토마토', '한우 소고기', '생연어', '냉면', '삼겹살' 등
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
  storeStocks?: StoreStock[];
  repurchasePercent?: number;
  isToday?: boolean;
  isHot?: boolean;
  nutrition?: {
    sodium: string;
    carbs: string;
    sugar: string;
    fat: string;
    protein: string;
  };
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
  | 'search';

