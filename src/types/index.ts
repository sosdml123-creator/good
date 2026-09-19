export type ProductCategory = 
  | '전체'
  | '신제품'
  | '과자'
  | '음료'
  | '빵·디저트'
  | '간편식'
  | '패스트푸드'
  | '과일'
  | '식재료'
  | '고기·수산'
  | '아이스크림'
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
  sizeGrade?: string;          // 사이즈 선별 등급 (e.g. "개당 280g ~ 340g (대과·특과 선별)", "마리당 450~550g (특대)")
  averageSize?: string;        // 사이즈 평균 규격/직경 (e.g. "직경 약 8.5~9.0cm / 평균 과중 320g", "전장 약 18~20cm")
  brixGrade?: string;          // 당도 등급 (e.g. "13.5 ~ 15 Brix 특당도 선별")
  sugarAcidRatio?: string;     // 당산비 / 산도 (e.g. "산도 0.35% 미만 황금 당산비")
  freshnessGrade?: string;     // 신선도 및 선별 기준 (e.g. "비파괴 광센서 당도선별 1등급", "당일 조업 해수 빙장 쿨링")
  fleshYield?: string;         // 수율 및 과육 비율 (e.g. "과육 비율 92% 이상", "살코기 수율 85% 이상")
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
  saturatedFat?: string;  // e.g. "10g (67%)"
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
  distance?: string;
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
  code?: string; // 고유 상품 코드 (e.g. 'SP-001', 'SP-2026-0001')
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
  isBest?: boolean;
  nutrition?: NutritionInfo;
  ingredients?: string;       // 원재료명 및 함량
  allergens?: string[];       // 알레르기 유발물질 e.g. ['밀', '대두', '우유']
  origin?: string;            // 원산지 / 생산지
  manufacturer?: string;      // 제조원 / 유통판매원
  storageMethod?: string;     // 보관방법
  shelfLife?: string;         // 유통/소비기한
  precautions?: string;       // 섭취 시 주의사항
  spiciness?: string;        // 맵기 단계 (e.g. '안 매워요', '신라면급', '불닭급')
  produceDetails?: ProduceNutritionDetail; // 자연 원물(과일, 채소, 생물 수산물) 영양 성분 & 특성 상세
  searchInfluxCount?: number; // 검색 유입수 (검색 후 상세 방문 및 유입 클릭 수)
  buyLink?: string;           // 공식 판매처 / 바로구매 링크 (네이버쇼핑/스마트스토어 등)
  sourceName?: string;
  sourceUrl?: string;
}

export interface ReviewComment {
  id: string;
  userName: string;
  userAvatar: string;
  userLevel: string;
  content: string;
  createdAt: string;
}

export interface ReviewFlavorProfile {
  sweetness?: string; // e.g. '안 달아요' | '은은한 단맛' | '적당한 달콤함' | '아주 달아요'
  spiciness?: string; // e.g. '안 매워요' | '살짝 매콤' | '신라면급' | '불닭급'
  texture?: string;   // e.g. '바삭바삭' | '쫀득/꾸덕' | '부드러움' | '아삭아삭' | '촉촉함'
}

export interface ReviewExtraData {
  purchasePlace?: string;      // e.g. 'GS25' | 'CU' | '세븐일레븐' | '이마트24' | '마켓컬리' | '쿠팡' | '대형마트' | '동네슈퍼' | '기타'
  purchaseEvent?: string;      // e.g. '정가 구매' | '1+1 행사' | '2+1 행사' | '할인특가' | '선물/나눔'
  purchasePrice?: number;      // 실제 구매 금액
  repurchaseIntent?: string;   // e.g. '무조건 또 사먹어요!' | '행사/할인 시 구매' | '한 번으로 만족' | '아쉬워요' | '비추천'
  headline?: string;           // 한 줄 핵심 요약평
  flavorProfile?: ReviewFlavorProfile;
  recommendTargets?: string[]; // e.g. ['#단짠러버', '#야식혼술', '#다이어터', '#가성비족']
  isReceiptVerified?: boolean; // 내돈내산 영수증 인증 여부
}

export interface Review extends ReviewExtraData {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  userId?: string; // 리뷰 작성자 식별 UID
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
  isReported?: boolean;
  isHidden?: boolean;
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

export interface PointTransaction {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: 'grant' | 'revoke' | 'reward' | 'use';
  amount: number; // + or -
  balanceAfter: number;
  reason: string;
  createdAt: string;
  adminMemo?: string;
}

export type UserAccountStatus = 'active' | 'warned' | 'suspended' | 'banned';

export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  level: string;
  points: number;
  isAnonymous?: boolean;
  email?: string;
  provider?: 'apple' | 'google' | 'kakao' | 'anonymous';
  createdAt?: string;
  // 회원 계정 관리 및 제재 상태
  status?: UserAccountStatus; // 'active'(정상) | 'warned'(경고) | 'suspended'(일시정지) | 'banned'(영구정지)
  warningCount?: number;      // 누적 경고 횟수
  suspendedUntil?: string;    // 정지 만료 일시 (ISO format) 또는 'permanent'
  statusReason?: string;      // 제재 / 경고 사유
  statusUpdatedAt?: string;   // 최근 상태 변경 일시
  role?: 'admin' | 'user';    // 관리자 권한 여부
}

// 🚨 신고 시스템 (Report System)
export type ReportTargetType = 'review' | 'user' | 'comment' | 'community_post';

export type ReportReason = 
  | 'spam'           // 스팸 / 도배 / 상업적 홍보
  | 'abuse'          // 욕설 / 비하 / 혐오 발언
  | 'inappropriate'  // 음란 / 청소년 유해 내용
  | 'fraud'          // 허위 정보 / 사기 / 낚시성 후기
  | 'copyright'      // 저작권 침해 / 명예훼손
  | 'other';         // 기타 사유

export type ReportStatus = 'pending' | 'resolved' | 'dismissed';

export type ReportAction = 
  | 'none' 
  | 'warning' 
  | 'suspend_7d' 
  | 'suspend_30d' 
  | 'permanent_ban' 
  | 'delete_review';

export interface ReportItem {
  id: string;
  targetType: ReportTargetType;
  targetId: string;           // 신고 대상 ID (e.g. reviewId)
  targetContent: string;      // 신고 당시 대상 내용 (리뷰 본문)
  targetProductId?: string;   // 연관 상품 ID
  targetProductName?: string; // 연관 상품명
  targetUserId?: string;      // 피신고자 UID
  targetUserName: string;     // 피신고자 닉네임
  reporterId: string;         // 신고자 UID
  reporterName: string;       // 신고자 닉네임
  reason: ReportReason;
  reasonDetail?: string;      // 구체적 신고 사유 입력 내용
  status: ReportStatus;       // pending(대기중) | resolved(조치완료) | dismissed(반려/이상없음)
  actionTaken?: ReportAction; // 관리자가 취한 조치
  actionReason?: string;      // 조치 사유
  adminMemo?: string;         // 관리자 내부 메모
  createdAt: string;          // 신고 접수 일시
  resolvedAt?: string;        // 조치 처리 일시
}

// ✏️ 제품 정보 수정 요청 시스템 (Product Edit Request System)
export type ProductEditType = 
  | 'price'          // 가격 오류 (정가/할인가)
  | 'store_event'    // 판매처 및 1+1/2+1 행사 추가/수정
  | 'nutrition'      // 영양성분, 칼로리, 알레르기 성분 오류
  | 'name_brand'     // 상품명, 제조사/브랜드 명칭 오류
  | 'image'          // 대표 상품 이미지 교체 요청
  | 'discontinued'   // 단종 또는 판매 중단 제보
  | 'other';         // 기타 상세 정보 수정

export type ProductEditStatus = 'pending' | 'approved' | 'rejected';

export interface ProductEditRequest {
  id: string;
  productId: string;
  productName: string;
  productBrand: string;
  productImage?: string;
  requestType: ProductEditType;
  content: string;            // 상세 수정 요청 내용
  suggestedValue?: string;    // 정정 희망 내용/값 (예: 올바른 가격, 신규 판매처 등)
  sourceUrl?: string;         // 참고 출처 / 링크
  requesterId: string;        // 요청자 UID
  requesterName: string;      // 요청자 닉네임
  status: ProductEditStatus;  // pending(대기중) | approved(반영완료) | rejected(반려)
  adminMemo?: string;         // 관리자 처리 메모
  createdAt: string;          // 요청 접수 일시
  processedAt?: string;       // 처리 일시
}

export type BannerLinkType = 'url' | 'event' | 'product' | 'category' | 'none';

export interface BannerItem {
  id: string;
  image: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  linkType?: BannerLinkType;
  linkUrl?: string;
  linkEventId?: string;
  linkCategory?: ProductCategory;
  linkProductId?: string;
  isActive: boolean;
  order: number;
  disclaimer?: string;
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

export type HomeSectionId = 
  | 'banners'
  | 'quick_menu'
  | 'categories'
  | 'ad_banner'
  | 'new_products'
  | 'sale_events'
  | 'brand_hub'
  | 'search_trending'
  | 'hot_events'
  | 'recipes'
  | 'battle'
  | 'popular_ranking'
  | 'reviews';

export interface HomeSectionConfig {
  id: HomeSectionId;
  name: string;
  title: string;
  subtitle?: string;
  badgeText?: string;
  description?: string;
  isVisible: boolean;
  order: number;
  itemLimit?: number;
}

export type ActiveTab = 
  | 'home' 
  | 'category' 
  | 'brand'
  | 'write' 
  | 'community' 
  | 'my' 
  | 'detail' 
  | 'compare' 
  | 'alert_settings' 
  | 'settings'
  | 'search'
  | 'admin'
  | 'event_detail'
  | 'calendar'
  | 'ranking';

export interface BrandInfo {
  id: string;
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
}

export type StoreChannelType = 'convenience' | 'mart' | 'online' | 'official' | 'specialty';

export interface StoreChannelInfo {
  id: string;
  name: string;
  category: StoreChannelType;
  logo?: string;
  defaultLink?: string;
  deliveryBadge?: string;
  color?: string;
  isActive: boolean;
  order: number;
}

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
  sourceName?: string;
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
  needsReview?: boolean; // ⚠️ 검증 필요 상태 (쇼핑 API 가격/이미지 미매칭 또는 유사도 낮음)
  reviewReason?: string; // 검증 필요 사유 (e.g. "가격 확인 불가", "키워드 유사도 불일치", "쇼핑몰 미등록")
}

export type SaleDealType = '1+1' | '2+1' | '할인특가' | '콤보할인' | '증정행사';
export type SaleStoreType = 'CU' | 'GS25' | '세븐일레븐' | '이마트24' | '이마트' | '홈플러스' | '전체';

export interface SalePromotionItem {
  id: string;
  productId?: string;
  title: string;
  brand: string;
  category: ProductCategory;
  subCategory?: string;
  store: SaleStoreType;
  stores?: string[];
  dealType: SaleDealType;
  badgeText: string;
  originalPrice: number;
  salePrice: number;
  unitPriceDescription: string;
  discountRate?: number;
  image: string;
  period: string;
  dDay: string;
  benefitTag?: string;
  description: string;
  isHot?: boolean;
  likeCount: number;
}

export interface ReleaseCalendarItem {
  id: string;
  productId?: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subCategory?: string;
  image: string;
  price: number;
  stores: string[];
  releaseDate: string; // "2026.09.11"
  releaseDateFormatted: string; // "9월 11일 (금)"
  dayOfWeek: string; // "금"
  dDay: string; // "D-2", "오늘출시", "D-5"
  isToday?: boolean;
  isUpcoming: boolean;
  highlight: string;
  eventBadge?: string; // "1+1 행사", "한정판", "사전예약"
  notificationCount?: number;
}

export interface RecipeIngredient {
  name: string;
  store?: string;
  price?: number;
  productId?: string;
  amount?: string;
  isKeyItem?: boolean;
}

export interface RecipePost {
  id: string;
  title: string;
  description: string;
  image: string;
  author: string;
  authorAvatar?: string;
  authorLevel?: string;
  prepTime: string; // "3분", "5분"
  difficulty: '초간단' | '쉬움' | '보통';
  totalCost: number;
  ingredients: RecipeIngredient[];
  steps: string[];
  tips?: string;
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  tags: string[];
  createdAt: string;
}

export type WriteRecipeInput = Omit<RecipePost, 'id' | 'likes' | 'commentsCount' | 'createdAt' | 'author' | 'authorAvatar' | 'authorLevel' | 'isLiked'>;
