import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  Review, 
  CommunityPost, 
  ActiveTab, 
  ProductCategory, 
  DetailedRating, 
  ToastMessage,
  UserProfile,
  ReviewComment,
  PostComment,
  BannerItem,
  BattleConfig,
  PendingProduct,
  PromotionEvent,
  AppNotification,
  PointTransaction,
  ReleaseCalendarItem,
  SalePromotionItem,
  RecipePost,
  WriteRecipeInput
} from '../types';
import type { ReviewExtraData } from '../types';
import { INITIAL_PRODUCTS, INITIAL_BANNERS, INITIAL_BATTLE_CONFIG, INITIAL_EVENTS, INITIAL_NOTIFICATIONS } from '../data/mockProducts';
import { INITIAL_CALENDAR_ITEMS } from '../data/mockCalendar';
import { INITIAL_SALE_PROMOTIONS } from '../data/mockSalePromotions';
import { INITIAL_RECIPES } from '../data/mockRecipes';
import { INITIAL_REVIEWS } from '../data/mockReviews';
import { INITIAL_COMMUNITY_POSTS } from '../data/mockCommunity';
import {
  fetchDailyNewProducts,
  searchAndCrawlNewProducts,
  isDailyCrawlNeeded,
  markDailyCrawlDone,
  PENDING_PRODUCTS_STORAGE_KEY,
  LAST_CRAWL_STORAGE_KEY
} from '../services/productCrawler';
import { revalidatePendingProductList } from '../services/naverApi';
import {
  supabase,
  isSupabaseConfigured,
  ensureSupabaseAuth,
  signInWithGoogle as supabaseSignInWithGoogle,
  signInWithApple as supabaseSignInWithApple,
  signInWithKakao as supabaseSignInWithKakao,
  signOutSupabase,
  DBProduct,
  DBReview,
  DBCommunityPost,
  DBReviewComment,
  DBPostComment
} from '../services/supabase';
import { getSearchInfluxCount } from '../utils/ranking';
import { isAgriMarineProduct, getProductIllustration } from '../utils/productIllustrations';

interface AppContextType {
  products: Product[];
  reviews: Review[];
  communityPosts: CommunityPost[];
  banners: BannerItem[];
  battleConfig: BattleConfig;
  battleChoice: 'A' | 'B' | null;
  voteBattle: (choice: 'A' | 'B') => void;
  events: PromotionEvent[];
  selectedEventId: string;
  selectedEvent: PromotionEvent;
  notifications: AppNotification[];
  unreadNotificationCount: number;
  incomingPush: AppNotification | null;
  activeTab: ActiveTab;
  previousTab: ActiveTab;
  selectedCategory: ProductCategory;
  selectedBrand: string | null;
  selectedProduct: Product;
  selectedProductId: string;
  bookmarkedIds: string[];
  comparedIds: string[];
  alertCategories: string[];
  searchQuery: string;
  recentSearches: string[];
  userPoints: number;
  toasts: ToastMessage[];
  currentUser: UserProfile;
  isSupabaseConnected: boolean;

  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  goBack: () => void;
  setSelectedCategory: (cat: ProductCategory) => void;
  setSelectedBrand: (brand: string | null) => void;
  openBrandDetail: (brand: string) => void;
  openProductDetail: (productId: string) => void;
  openEventDetail: (eventId: string) => void;
  toggleBookmark: (productId: string, e?: React.MouseEvent) => void;
  toggleCompare: (productId: string, e?: React.MouseEvent) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  toggleAlertCategory: (cat: string) => void;
  setSearchQuery: (q: string) => void;
  addRecentSearch: (keyword: string) => void;
  removeRecentSearch: (keyword: string) => void;
  clearRecentSearches: () => void;
  recordSearchInflux: (productId: string) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  updateUserNickname: (newName: string) => Promise<void>;
  loginWithApple: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithKakao: () => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  openLoginModal: () => void;

  // Events & Push Notifications Actions
  addEvent: (eventData: Omit<PromotionEvent, 'id' | 'createdAt' | 'participantsCount' | 'isParticipated'>) => void;
  updateEvent: (id: string, updated: Partial<PromotionEvent>) => void;
  deleteEvent: (id: string) => void;
  participateInEvent: (eventId: string) => void;
  sendPushNotification: (notif: { title: string; body: string; type: 'event' | 'product' | 'notice'; targetId: string; imageUrl?: string; badge?: string }) => void;
  dismissIncomingPush: () => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Admin Banner Actions
  addBanner: (banner: Omit<BannerItem, 'id' | 'order'>, targetOrder?: number) => void;
  updateBanner: (id: string, updated: Partial<BannerItem>) => void;
  deleteBanner: (id: string) => void;
  toggleBannerActive: (id: string) => void;
  moveBannerOrder: (id: string, direction: 'up' | 'down') => void;
  setBannerOrder: (id: string, targetOrder: number) => void;
  duplicateBanner: (id: string) => void;
  reorderBanners: (newBanners: BannerItem[]) => void;

  // Admin Product Actions
  addProduct: (product: Partial<Product> & { name: string; brand: string; category: ProductCategory; price: number }) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductToday: (id: string) => void;
  toggleProductHot: (id: string) => void;

  // Admin Battle Actions
  updateBattleConfig: (config: Partial<BattleConfig>) => void;

  // Admin Pending Products / Daily Crawler Actions
  pendingProducts: PendingProduct[];
  pendingCount: number;
  isCrawling: boolean;
  lastCrawledDate: string | null;
  runDailyCrawler: (force?: boolean) => Promise<{ count: number }>;
  searchAndCollect: (query: string) => Promise<{ count: number }>;
  approvePendingProduct: (pendingId: string, customData?: Partial<Product>) => void;
  approveAllPending: () => void;
  rejectPendingProduct: (pendingId: string) => void;
  rejectAllPending: () => void;
  revokeApprovedProduct: (productId: string) => void;
  revokeAllApprovedProducts: (ids?: string[]) => void;
  removeDuplicatePending: () => { removedCount: number };
  revalidateAllPending: () => void;
  updatePendingProduct: (pendingId: string, updated: Partial<PendingProduct>) => void;
  clearAllPendingProducts: () => void;
  addPendingProduct: (item: PendingProduct) => void;

  // Admin Reset Action
  resetAllDataToDefaults: () => void;

  // Interactions
  submitReview: (
    productId: string,
    rating: number,
    detailedRating: DetailedRating,
    content: string,
    images?: string[],
    tags?: string[],
    extra?: ReviewExtraData
  ) => Promise<void>;
  toggleLikeReview: (reviewId: string) => Promise<void>;
  addReviewComment: (reviewId: string, text: string) => Promise<void>;

  addCommunityPost: (
    category: '인기글' | '자유게시판' | '질문/답변' | '이벤트',
    title: string,
    content: string,
    images?: string[]
  ) => Promise<void>;
  toggleLikePost: (postId: string) => Promise<void>;
  addPostComment: (postId: string, text: string) => Promise<void>;

  // Admin Moderation Actions
  deleteReview: (reviewId: string) => Promise<void>;
  deleteCommunityPost: (postId: string) => Promise<void>;

  // User & Points Management (Admin & App)
  allProfiles: UserProfile[];
  pointTransactions: PointTransaction[];
  grantUserPoints: (userId: string, amount: number, reason: string, memo?: string) => Promise<void>;
  revokeUserPoints: (userId: string, amount: number, reason: string, memo?: string) => Promise<void>;
  batchGrantPoints: (userIds: string[], amount: number, reason: string, memo?: string) => Promise<void>;
  batchRevokePoints: (userIds: string[], amount: number, reason: string, memo?: string) => Promise<void>;
  fetchAllProfiles: () => Promise<void>;

  // Calendar & Recipes
  calendarItems: ReleaseCalendarItem[];
  calendarReminders: string[];
  toggleCalendarReminder: (calendarItemId: string) => void;

  // 🏷️ Sale Promotions (1+1 & 할인특가 행사소식)
  salePromotions: SalePromotionItem[];
  savedSaleIds: string[];
  toggleSaveSale: (saleId: string) => void;

  recipes: RecipePost[];
  selectedRecipe: RecipePost | null;
  isRecipeDetailOpen: boolean;
  openRecipeDetail: (recipeId: string) => void;
  closeRecipeDetail: () => void;
  isWriteRecipeOpen: boolean;
  openWriteRecipe: () => void;
  closeWriteRecipe: () => void;
  toggleRecipeLike: (recipeId: string) => void;
  addRecipePost: (recipeData: WriteRecipeInput) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper for calculating user level based on points
export const calculateLevel = (points: number): string => {
  const levelNum = Math.max(1, Math.min(10, Math.floor(points / 200) + 1));
  return `Lv.${levelNum}`;
};

export const INITIAL_USER_PROFILES: UserProfile[] = [
  {
    uid: 'user_minji_01',
    displayName: '신상탐험가_민지',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    level: 'Lv.5',
    points: 850,
    email: 'minji.snack@gmail.com',
    provider: 'apple',
    createdAt: '2025.01.10'
  },
  {
    uid: 'user_junho_02',
    displayName: '편의점고수_준호',
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    level: 'Lv.7',
    points: 1340,
    email: 'junho_cu@kakao.com',
    provider: 'kakao',
    createdAt: '2025.01.05'
  },
  {
    uid: 'user_dessert_03',
    displayName: '디저트요정',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    level: 'Lv.3',
    points: 520,
    email: 'sweet_fairy@naver.com',
    provider: 'google',
    createdAt: '2025.01.18'
  },
  {
    uid: 'user_taeyang_04',
    displayName: '야식러버_태양',
    photoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    level: 'Lv.5',
    points: 980,
    email: 'sun_night@gmail.com',
    provider: 'google',
    createdAt: '2025.01.22'
  },
  {
    uid: 'user_jiwoo_05',
    displayName: '스낵마니아_지우',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    level: 'Lv.2',
    points: 310,
    email: 'jiwoo.snack@gmail.com',
    provider: 'apple',
    createdAt: '2025.02.01'
  },
  {
    uid: 'user_donghyun_06',
    displayName: '맛집탐험대_동현',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    level: 'Lv.9',
    points: 1620,
    email: 'donghyun@daum.net',
    provider: 'kakao',
    createdAt: '2024.12.15'
  },
  {
    uid: 'user_hyejin_07',
    displayName: '매운맛도전자_혜진',
    photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80',
    level: 'Lv.4',
    points: 730,
    email: 'spicy_queen@gmail.com',
    provider: 'google',
    createdAt: '2025.01.29'
  },
  {
    uid: 'user_suho_08',
    displayName: '헬린이식단_수호',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    level: 'Lv.3',
    points: 440,
    email: 'suho_fit@gmail.com',
    provider: 'apple',
    createdAt: '2025.02.10'
  },
  {
    uid: 'user_seoyeon_09',
    displayName: '과자박사_서연',
    photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    level: 'Lv.10',
    points: 1950,
    email: 'seoyeon_snack@naver.com',
    provider: 'kakao',
    createdAt: '2024.11.20'
  }
];

export const INITIAL_POINT_TRANSACTIONS: PointTransaction[] = [
  {
    id: 'tx-01',
    userId: 'user_seoyeon_09',
    userName: '과자박사_서연',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    type: 'grant',
    amount: 500,
    balanceAfter: 1950,
    reason: '우수 리뷰어 베스트 픽 선정 보상',
    createdAt: '2026.03.06 18:30',
    adminMemo: '3월 1주차 베스트 신상 리뷰 1등 포상'
  },
  {
    id: 'tx-02',
    userId: 'user_junho_02',
    userName: '편의점고수_준호',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    type: 'grant',
    amount: 300,
    balanceAfter: 1340,
    reason: '체험단 성실 리뷰 작성 보너스',
    createdAt: '2026.03.05 14:15',
    adminMemo: '신라면 똠얌 체험단 미션 완수'
  },
  {
    id: 'tx-03',
    userId: 'user_minji_01',
    userName: '신상탐험가_민지',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    type: 'grant',
    amount: 200,
    balanceAfter: 850,
    reason: '신규 상품 제보 채택 보상',
    createdAt: '2026.03.04 11:00',
    adminMemo: '편의점 단독 출시 신상 제보 반영'
  },
  {
    id: 'tx-04',
    userId: 'user_jiwoo_05',
    userName: '스낵마니아_지우',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    type: 'revoke',
    amount: -100,
    balanceAfter: 310,
    reason: '어뷰징/중복 작성 리뷰 삭제로 인한 포인트 회수',
    createdAt: '2026.03.02 09:40',
    adminMemo: '동일 내용 단순 복사 도배 적발'
  },
  {
    id: 'tx-05',
    userId: 'user_taeyang_04',
    userName: '야식러버_태양',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    type: 'grant',
    amount: 150,
    balanceAfter: 980,
    reason: '출석체크 연속 7일 달성 보너스',
    createdAt: '2026.03.01 16:20',
    adminMemo: '2월 출석 이벤트'
  }
];

// Initial User Profile
const createInitialUser = (): UserProfile => {
  const cachedUid = localStorage.getItem('sinsangpick_uid');
  const cachedName = localStorage.getItem('sinsangpick_name');
  const cachedPoints = localStorage.getItem('sinsangpick_points');

  const uid = cachedUid || `anon_${Math.random().toString(36).substring(2, 9)}`;
  if (!cachedUid) localStorage.setItem('sinsangpick_uid', uid);

  const points = cachedPoints ? parseInt(cachedPoints, 10) : 100;
  const displayName = cachedName || `신상러버_${uid.slice(-4)}`;

  return {
    uid,
    displayName,
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    level: calculateLevel(points),
    points,
    isAnonymous: true,
  };
};

// Converters from DB types to App types
const mapDBProductToProduct = (dbP: DBProduct): Product => {
  const isAgri = isAgriMarineProduct({
    id: dbP.id,
    name: dbP.name,
    category: dbP.category,
    subCategory: dbP.sub_category,
    itemType: dbP.item_type,
  });
  const rawImage = dbP.image;
  const image = isAgri && (!rawImage || rawImage.includes('unsplash') || !rawImage.startsWith('data:image/svg+xml'))
    ? getProductIllustration({ id: dbP.id, name: dbP.name, category: dbP.category, subCategory: dbP.sub_category, itemType: dbP.item_type })
    : (rawImage || '');

  return {
    id: dbP.id,
    name: dbP.name,
    brand: dbP.brand,
    category: dbP.category as ProductCategory,
    subCategory: dbP.sub_category,
    itemType: dbP.item_type,
    image,
    releaseDate: dbP.release_date || '',
    price: dbP.price,
    discountRate: undefined,
    overallRating: Number(dbP.overall_rating) || 0,
  ratingCount: dbP.rating_count || 0,
  detailedRating: dbP.detailed_rating || { taste: 5, value: 5, portion: 5, repurchase: 5 },
  freshMetrics: dbP.fresh_metrics,
  brandRankings: dbP.brand_rankings,
  restaurantInfo: dbP.restaurant_info,
  description: dbP.description,
  bestQuotes: dbP.best_quotes,
  stores: dbP.stores,
  repurchasePercent: dbP.repurchase_percent,
  calories: dbP.calories,
  volume: dbP.volume,
  isToday: dbP.is_today,
  isHot: dbP.is_hot,
  nutrition: dbP.nutrition,
  ingredients: dbP.ingredients,
  allergens: dbP.allergens,
  origin: dbP.origin,
  manufacturer: dbP.manufacturer,
  storageMethod: dbP.storage_method,
  shelfLife: dbP.shelf_life,
  precautions: dbP.precautions,
  storeStocks: dbP.store_stocks,
  searchInfluxCount: (dbP as any).search_influx_count || undefined,
  produceDetails: (dbP as any).produce_details || (dbP as any).produceDetails || undefined,
  };
};

const mapDBReviewToReview = (dbR: DBReview, isLiked: boolean, comments: ReviewComment[]): Review => ({
  id: dbR.id,
  productId: dbR.product_id,
  productName: dbR.product_name,
  productImage: dbR.product_image,
  userName: dbR.user_name,
  userAvatar: dbR.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  userLevel: dbR.user_level || 'Lv.1',
  rating: Number(dbR.rating),
  detailedRating: dbR.detailed_rating,
  freshMetrics: dbR.fresh_metrics,
  content: dbR.content,
  images: dbR.images || [],
  likes: dbR.likes_count || 0,
  isLiked,
  commentsCount: dbR.comments_count || comments.length,
  comments,
  createdAt: dbR.created_at,
  tags: dbR.tags || [],
});

const mapDBCommunityPostToPost = (dbP: DBCommunityPost, isLiked: boolean, comments: PostComment[]): CommunityPost => ({
  id: dbP.id,
  category: dbP.category,
  title: dbP.title,
  content: dbP.content,
  author: dbP.author_name,
  authorAvatar: dbP.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  authorLevel: dbP.author_level || 'Lv.1',
  likes: dbP.likes_count || 0,
  isLiked,
  commentsCount: dbP.comments_count || comments.length,
  comments,
  createdAt: dbP.created_at,
  images: dbP.images || [],
});

export const normalizeBanners = (bannerList: BannerItem[]): BannerItem[] => {
  const sorted = [...bannerList].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return sorted.map((b, idx) => ({ ...b, order: idx + 1 }));
};

const DATA_VERSION = 'v22_20260912_clear_store_links';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(createInitialUser);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const openLoginModal = () => setIsLoginModalOpen(true);

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const currentVer = localStorage.getItem('sinsangpick_data_version');
      if (currentVer !== DATA_VERSION) {
        localStorage.setItem('sinsangpick_data_version', DATA_VERSION);
        localStorage.setItem('sinsangpick_products', JSON.stringify(INITIAL_PRODUCTS));
        localStorage.setItem('sinsangpick_reviews', JSON.stringify(INITIAL_REVIEWS));
        localStorage.setItem('sinsangpick_banners', JSON.stringify(normalizeBanners(INITIAL_BANNERS)));
        localStorage.setItem('sinsangpick_battle_config', JSON.stringify(INITIAL_BATTLE_CONFIG));
        return INITIAL_PRODUCTS;
      }
      const stored = localStorage.getItem('sinsangpick_products');
      if (stored) {
        const parsed: Product[] = JSON.parse(stored);
        const existingIds = new Set(parsed.map(p => p.id));
        const missing = INITIAL_PRODUCTS.filter(p => !existingIds.has(p.id));
        return missing.length > 0 ? [...parsed, ...missing] : parsed;
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_reviews');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);

  const [banners, setBanners] = useState<BannerItem[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_banners');
      if (stored) {
        const parsed: BannerItem[] = JSON.parse(stored);
        const hasCoupang = parsed.some(b => b.id === 'banner-coupang-fresh');
        if (!hasCoupang) {
          const coupangBanner = INITIAL_BANNERS.find(b => b.id === 'banner-coupang-fresh');
          if (coupangBanner) {
            return normalizeBanners([coupangBanner, ...parsed]);
          }
        }
        return normalizeBanners(parsed);
      }
      return normalizeBanners(INITIAL_BANNERS);
    } catch {
      return normalizeBanners(INITIAL_BANNERS);
    }
  });

  const [battleConfig, setBattleConfig] = useState<BattleConfig>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_battle_config');
      return stored ? JSON.parse(stored) : INITIAL_BATTLE_CONFIG;
    } catch {
      return INITIAL_BATTLE_CONFIG;
    }
  });

  const [battleChoice, setBattleChoice] = useState<'A' | 'B' | null>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_battle_choice');
      return stored === 'A' || stored === 'B' ? stored : null;
    } catch {
      return null;
    }
  });

  const voteBattle = (choice: 'A' | 'B') => {
    setBattleChoice(choice);
    try {
      localStorage.setItem('sinsangpick_battle_choice', choice);
    } catch (e) {
      console.warn(e);
    }
    showToast('투표해주셔서 감사해요! 결과는 주말에 공개됩니다 🎉', 'success');
  };

  const [likedReviewIds, setLikedReviewIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_review_likes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [likedPostIds, setLikedPostIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_post_likes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTabState] = useState<ActiveTab>('home');
  const [previousTab, setPreviousTab] = useState<ActiveTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('전체');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>('snack-01');

  const [events, setEvents] = useState<PromotionEvent[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_events');
      return stored ? JSON.parse(stored) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });
  const [selectedEventId, setSelectedEventId] = useState<string>('event-01');

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_notifications');
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });
  const [incomingPush, setIncomingPush] = useState<AppNotification | null>(null);

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_bookmarks');
      return stored ? JSON.parse(stored) : ['snack-01', 'meal-01', 'fruit-01'];
    } catch {
      return ['snack-01', 'meal-01', 'fruit-01'];
    }
  });

  const [comparedIds, setComparedIds] = useState<string[]>(['snack-01', 'snack-03']);
  const [alertCategories, setAlertCategories] = useState<string[]>(['과자', '음료', '빵·디저트', '간편식']);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    '꼬북칩',
    '피스타치오',
    '두바이 초콜릿',
    '신라면 똠얌',
  ]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // 📅 New Product Drop Calendar State
  const [calendarItems] = useState<ReleaseCalendarItem[]>(INITIAL_CALENDAR_ITEMS);
  const [calendarReminders, setCalendarReminders] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_calendar_reminders');
      return stored ? JSON.parse(stored) : ['cal-02'];
    } catch {
      return ['cal-02'];
    }
  });

  // 🏷️ 편의점/마트 1+1 & 할인특가 행사소식 State
  const [salePromotions] = useState<SalePromotionItem[]>(INITIAL_SALE_PROMOTIONS);
  const [savedSaleIds, setSavedSaleIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_saved_sales');
      return stored ? JSON.parse(stored) : ['sale-01', 'sale-04'];
    } catch {
      return ['sale-01', 'sale-04'];
    }
  });

  // 🥪 New Product Recipe / Combination State
  const [recipes, setRecipes] = useState<RecipePost[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_recipes');
      return stored ? JSON.parse(stored) : INITIAL_RECIPES;
    } catch {
      return INITIAL_RECIPES;
    }
  });
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [isRecipeDetailOpen, setIsRecipeDetailOpen] = useState(false);
  const [isWriteRecipeOpen, setIsWriteRecipeOpen] = useState(false);

  // All Profiles & Point Transactions for Admin & User Management
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_all_profiles');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_USER_PROFILES;
  });

  const [pointTransactions, setPointTransactions] = useState<PointTransaction[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_point_transactions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_POINT_TRANSACTIONS;
  });

  // Pending Products (승인 대기 신제품) states - Sanitized with strict product name validation & verified healing
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>(() => {
    try {
      const stored = localStorage.getItem(PENDING_PRODUCTS_STORAGE_KEY);
      const parsed: PendingProduct[] = stored ? JSON.parse(stored) : [];
      const healed = revalidatePendingProductList(parsed);
      try {
        localStorage.setItem(PENDING_PRODUCTS_STORAGE_KEY, JSON.stringify(healed));
      } catch (e) {
        // ignore
      }
      return healed;
    } catch {
      return [];
    }
  });

  const [isCrawling, setIsCrawling] = useState<boolean>(false);
  const [lastCrawledDate, setLastCrawledDate] = useState<string | null>(() => {
    return localStorage.getItem(LAST_CRAWL_STORAGE_KEY);
  });

  // Sync allProfiles & pointTransactions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sinsangpick_all_profiles', JSON.stringify(allProfiles));
    } catch (e) {
      // ignore
    }
  }, [allProfiles]);

  useEffect(() => {
    try {
      localStorage.setItem('sinsangpick_point_transactions', JSON.stringify(pointTransactions));
    } catch (e) {
      // ignore
    }
  }, [pointTransactions]);

  // Sync pending products to localStorage
  useEffect(() => {
    localStorage.setItem(PENDING_PRODUCTS_STORAGE_KEY, JSON.stringify(pendingProducts));
  }, [pendingProducts]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('sinsangpick_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sinsangpick_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('sinsangpick_battle_config', JSON.stringify(battleConfig));
  }, [battleConfig]);

  useEffect(() => {
    localStorage.setItem('sinsangpick_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('sinsangpick_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('sinsangpick_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('sinsangpick_review_likes', JSON.stringify(likedReviewIds));
  }, [likedReviewIds]);

  useEffect(() => {
    localStorage.setItem('sinsangpick_post_likes', JSON.stringify(likedPostIds));
  }, [likedPostIds]);

  useEffect(() => {
    localStorage.setItem('sinsangpick_bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  useEffect(() => {
    localStorage.setItem('sinsangpick_points', currentUser.points.toString());
    localStorage.setItem('sinsangpick_name', currentUser.displayName);
  }, [currentUser]);

  // Auto-fetch daily new products on app start if today hasn't crawled or pending is empty
  useEffect(() => {
    const checkAndAutoCrawl = async () => {
      const today = new Date().toISOString().split('T')[0];
      const needsCrawl = isDailyCrawlNeeded();
      const isEmpty = pendingProducts.length === 0;

      if (needsCrawl || isEmpty) {
        try {
          const crawled = await fetchDailyNewProducts(today);
          setPendingProducts(prev => {
            const existingNames = new Set(prev.map(p => p.name.trim()));
            const newItems = crawled.filter(item => !existingNames.has(item.name.trim()));
            return newItems.length > 0 ? [...newItems, ...prev] : prev;
          });
          markDailyCrawlDone();
          setLastCrawledDate(today);
        } catch (e) {
          console.warn('[Auto Crawler Init Warning]', e);
        }
      }
    };
    checkAndAutoCrawl();
  }, []);

  // Fetch all initial data from Supabase
  const loadSupabaseData = async (uid: string) => {
    if (!supabase) return;

    try {
      // 1. Fetch Products
      const { data: dbProducts, error: prodErr } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (prodErr) throw prodErr;

      if (!dbProducts || dbProducts.length === 0) {
        setProducts(INITIAL_PRODUCTS);
      } else {
        // Create lookup map of DB products
        const dbProductMap = new Map<string, DBProduct>();
        dbProducts.forEach(p => {
          if (p.id) dbProductMap.set(p.id, p);
        });

        // Always preserve all 100 INITIAL_PRODUCTS, merging DB fields where applicable
        const mergedInitial = INITIAL_PRODUCTS.map(initial => {
          const dbP = dbProductMap.get(initial.id);
          if (dbP) {
            const mapped = mapDBProductToProduct(dbP);
            return {
              ...initial,
              ...mapped,
              discountRate: undefined,
              image: isAgriMarineProduct(initial) ? initial.image : (mapped.image && !mapped.image.includes('unsplash') ? mapped.image : initial.image),
              nutrition: mapped.nutrition || initial.nutrition,
              ingredients: mapped.ingredients || initial.ingredients,
              allergens: mapped.allergens || initial.allergens,
              origin: mapped.origin || initial.origin,
              manufacturer: mapped.manufacturer || initial.manufacturer,
              storageMethod: mapped.storageMethod || initial.storageMethod,
              shelfLife: mapped.shelfLife || initial.shelfLife,
              precautions: mapped.precautions || initial.precautions,
              storeStocks: mapped.storeStocks && mapped.storeStocks.length > 0 ? mapped.storeStocks : initial.storeStocks,
            };
          }
          return initial;
        });

        // Also append any extra custom products from Supabase that are not in INITIAL_PRODUCTS
        const initialIdSet = new Set(INITIAL_PRODUCTS.map(p => p.id));
        const extraDbProducts = dbProducts
          .filter(dbP => dbP.id && !initialIdSet.has(dbP.id))
          .map(dbP => mapDBProductToProduct(dbP));

        setProducts([...mergedInitial, ...extraDbProducts]);
      }

      // 2. Fetch User Likes
      const { data: revLikes } = await supabase
        .from('review_likes')
        .select('review_id')
        .eq('user_id', uid);
      const userRevLikes = revLikes ? revLikes.map(r => r.review_id) : [];
      setLikedReviewIds(userRevLikes);

      const { data: pLikes } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', uid);
      const userPostLikes = pLikes ? pLikes.map(p => p.post_id) : [];
      setLikedPostIds(userPostLikes);

      // 3. Fetch Reviews with Comments
      const { data: dbReviews, error: revErr } = await supabase
        .from('reviews')
        .select('*, review_comments(*)')
        .order('created_at', { ascending: false });

      if (!revErr && dbReviews) {
        const parsedReviews: Review[] = dbReviews.map((r: any) => {
          const isLiked = userRevLikes.includes(r.id);
          const comments: ReviewComment[] = (r.review_comments || []).map((c: DBReviewComment) => ({
            id: c.id,
            userName: c.user_name,
            userAvatar: c.user_avatar || '',
            userLevel: c.user_level || 'Lv.1',
            content: c.content,
            createdAt: c.created_at,
          }));
          return mapDBReviewToReview(r, isLiked, comments);
        });
        setReviews(parsedReviews);
      }

      // 4. Fetch Community Posts with Comments
      const { data: dbPosts, error: postErr } = await supabase
        .from('community_posts')
        .select('*, post_comments(*)')
        .order('created_at', { ascending: false });

      if (!postErr && dbPosts) {
        const parsedPosts: CommunityPost[] = dbPosts.map((p: any) => {
          const isLiked = userPostLikes.includes(p.id);
          const comments: PostComment[] = (p.post_comments || []).map((c: DBPostComment) => ({
            id: c.id,
            userName: c.user_name,
            userAvatar: c.user_avatar || '',
            userLevel: c.user_level || 'Lv.1',
            content: c.content,
            createdAt: c.created_at,
          }));
          return mapDBCommunityPostToPost(p, isLiked, comments);
        });
        setCommunityPosts(parsedPosts);
      }

      // 5. Fetch Current User Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();

      if (profile) {
        setCurrentUser(prev => ({
          ...prev,
          displayName: profile.display_name || prev.displayName,
          photoURL: profile.avatar_url || prev.photoURL,
          points: profile.points ?? prev.points,
          level: calculateLevel(profile.points ?? prev.points),
        }));
      }

      // 6. Fetch All Profiles (for Admin Points & Member Management)
      const { data: dbAllProfiles } = await supabase
        .from('profiles')
        .select('*')
        .order('points', { ascending: false });

      if (dbAllProfiles && dbAllProfiles.length > 0) {
        setAllProfiles(prev => {
          const dbMap = new Map<string, any>();
          dbAllProfiles.forEach(p => dbMap.set(p.id, p));

          const updated = prev.map(p => {
            const dbP = dbMap.get(p.uid);
            if (dbP) {
              return {
                ...p,
                displayName: dbP.display_name || p.displayName,
                photoURL: dbP.avatar_url || p.photoURL,
                points: dbP.points ?? p.points,
                level: calculateLevel(dbP.points ?? p.points),
                createdAt: dbP.created_at ? new Date(dbP.created_at).toLocaleDateString('ko-KR') : p.createdAt
              };
            }
            return p;
          });

          const existingUids = new Set(prev.map(p => p.uid));
          const extraUsers: UserProfile[] = dbAllProfiles
            .filter(p => !existingUids.has(p.id))
            .map(p => ({
              uid: p.id,
              displayName: p.display_name || '신상러버',
              photoURL: p.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
              level: calculateLevel(p.points ?? 100),
              points: p.points ?? 100,
              email: p.email || undefined,
              createdAt: p.created_at ? new Date(p.created_at).toLocaleDateString('ko-KR') : '2025.01.01'
            }));

          return [...updated, ...extraUsers];
        });
      }

    } catch (err) {
      console.warn('[Supabase] Failed to load data:', err);
    }
  };

  // Initialize Supabase & Realtime Subscriptions
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      console.info('[Supabase] Running in local/offline state mode (Supabase not configured in .env).');
      return;
    }

    const client = supabase;
    let isMounted = true;

    const init = async () => {
      const { user } = await ensureSupabaseAuth();
      if (!isMounted || !user) return;

      setIsSupabaseConnected(true);
      const uid = user.id;

      setCurrentUser(prev => ({
        ...prev,
        uid,
        displayName: user.user_metadata?.full_name || prev.displayName,
        photoURL: user.user_metadata?.avatar_url || prev.photoURL,
        isAnonymous: user.is_anonymous || false,
      }));

      await loadSupabaseData(uid);

      // Subscribe to Realtime Postgres Changes
      const channel = client.channel('public:db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
          loadSupabaseData(uid);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => {
          loadSupabaseData(uid);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, () => {
          loadSupabaseData(uid);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'review_likes' }, () => {
          loadSupabaseData(uid);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes' }, () => {
          loadSupabaseData(uid);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'review_comments' }, () => {
          loadSupabaseData(uid);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
          loadSupabaseData(uid);
        })
      // 6. Listen for Auth State Changes (Apple / Google / Kakao OAuth redirect)
      const { data: { subscription: authSub } } = client.auth.onAuthStateChange(async (event, session) => {
        if (session?.user && isMounted) {
          const u = session.user;
          const providerName = (u.app_metadata?.provider || 'apple') as 'apple' | 'google' | 'kakao' | 'anonymous';
          const displayName = u.user_metadata?.full_name || u.user_metadata?.name || (u.email ? u.email.split('@')[0] : '신상러버');
          const photoURL = u.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
          
          setCurrentUser(prev => ({
            ...prev,
            uid: u.id,
            displayName: prev.displayName && !prev.displayName.startsWith('신상러버_') ? prev.displayName : displayName,
            photoURL: photoURL || prev.photoURL,
            isAnonymous: false,
            email: u.email,
            provider: providerName,
          }));

          localStorage.setItem('sinsangpick_uid', u.id);
          localStorage.setItem('sinsangpick_name', displayName);
          setIsLoginModalOpen(false);

          if (event === 'SIGNED_IN') {
            const providerMsg = providerName === 'apple' ? '🍎 Apple 계정으로 로그인되었습니다!' : '✨ 소셜 계정으로 로그인되었습니다!';
            showToast(providerMsg, 'success');
            if (window.location.hash.includes('access_token=') || window.location.search.includes('code=')) {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }

          try {
            await client.from('profiles').upsert({
              id: u.id,
              display_name: displayName,
              avatar_url: photoURL,
            }, { onConflict: 'id' });
          } catch (e) {
            console.warn('[Supabase Profile Upsert Error]', e);
          }

          loadSupabaseData(u.id);
        }
      });

      return () => {
        client.removeChannel(channel);
        authSub.unsubscribe();
      };
    };

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  // Recalculate isLiked states when local like lists change
  useEffect(() => {
    setReviews(prev => prev.map(r => ({
      ...r,
      isLiked: likedReviewIds.includes(r.id),
    })));
  }, [likedReviewIds]);

  useEffect(() => {
    setCommunityPosts(prev => prev.map(p => ({
      ...p,
      isLiked: likedPostIds.includes(p.id),
    })));
  }, [likedPostIds]);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0] || INITIAL_PRODUCTS[0];
  const selectedEvent = events.find(e => e.id === selectedEventId) || events[0] || INITIAL_EVENTS[0];
  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  const setActiveTab = (tab: ActiveTab) => {
    setPreviousTab(activeTab);
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openBrandDetail = (brand: string) => {
    setSelectedBrand(brand);
    setPreviousTab(activeTab);
    setActiveTabState('brand');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (activeTab === 'brand') {
      if (selectedBrand) {
        setSelectedBrand(null);
        return;
      }
      setActiveTabState(previousTab === activeTab ? 'home' : previousTab);
      return;
    }

    if (
      activeTab === 'detail' || 
      activeTab === 'event_detail' || 
      activeTab === 'search' || 
      activeTab === 'alert_settings' || 
      activeTab === 'settings' || 
      activeTab === 'compare' || 
      activeTab === 'write' ||
      activeTab === 'calendar'
    ) {
      setActiveTabState(previousTab === activeTab ? 'home' : previousTab);
    } else {
      setActiveTabState('home');
    }
  };

  // 📅 Calendar Handlers
  const toggleCalendarReminder = (id: string) => {
    const item = calendarItems.find(c => c.id === id);
    const isAlready = calendarReminders.includes(id);
    let updated: string[];
    if (isAlready) {
      updated = calendarReminders.filter(rId => rId !== id);
      showToast(`🔕 [${item?.name || '신상'}] 출시 알림이 해제되었습니다.`, 'info');
    } else {
      updated = [...calendarReminders, id];
      showToast(`🔔 [${item?.name || '신상'}] 출시 알림이 예약되었습니다!`, 'success');
      if (item) {
        sendPushNotification({
          title: `🔔 [출시알림 예약 완료] ${item.brand} ${item.name}`,
          body: `${item.releaseDateFormatted} 편의점/매장 출시 당일 오전 9시에 가장 먼저 알려드릴게요!`,
          type: 'notice',
          targetId: item.productId || item.id,
          imageUrl: item.image,
          badge: item.dDay
        });
      }
    }
    setCalendarReminders(updated);
    try {
      localStorage.setItem('sinsangpick_calendar_reminders', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  // 🏷️ Sale Promotion Handlers
  const toggleSaveSale = (id: string) => {
    const item = salePromotions.find(s => s.id === id);
    const isAlready = savedSaleIds.includes(id);
    let updated: string[];
    if (isAlready) {
      updated = savedSaleIds.filter(sId => sId !== id);
      showToast(`🤍 [${item?.title || '행사'}] 관심 행사에서 제외되었습니다.`, 'info');
    } else {
      updated = [...savedSaleIds, id];
      showToast(`❤️ [${item?.title || '행사'}] 관심 행사로 저장되었습니다!`, 'success');
      if (item) {
        sendPushNotification({
          title: `🏷️ [행사 찜 완료] ${item.store} ${item.badgeText} 특가`,
          body: `${item.title} - ${item.unitPriceDescription} (${item.period}까지)`,
          type: 'event',
          targetId: item.productId || item.id,
          imageUrl: item.image,
          badge: item.badgeText
        });
      }
    }
    setSavedSaleIds(updated);
    try {
      localStorage.setItem('sinsangpick_saved_sales', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  // 🥪 Recipe Handlers
  const selectedRecipe = recipes.find(r => r.id === selectedRecipeId) || null;

  const openRecipeDetail = (id: string) => {
    setSelectedRecipeId(id);
    setIsRecipeDetailOpen(true);
  };

  const closeRecipeDetail = () => {
    setIsRecipeDetailOpen(false);
    setSelectedRecipeId(null);
  };

  const openWriteRecipe = () => setIsWriteRecipeOpen(true);
  const closeWriteRecipe = () => setIsWriteRecipeOpen(false);

  const toggleRecipeLike = (recipeId: string) => {
    setRecipes(prev => {
      const next = prev.map(r => {
        if (r.id === recipeId) {
          const isLiked = !r.isLiked;
          return {
            ...r,
            isLiked,
            likes: isLiked ? r.likes + 1 : Math.max(0, r.likes - 1)
          };
        }
        return r;
      });
      try {
        localStorage.setItem('sinsangpick_recipes', JSON.stringify(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  const addRecipePost = async (recipeData: WriteRecipeInput) => {
    const newRecipe: RecipePost = {
      ...recipeData,
      id: `recipe_${Date.now()}`,
      author: currentUser.displayName,
      authorAvatar: currentUser.photoURL,
      authorLevel: currentUser.level,
      likes: 1,
      isLiked: true,
      commentsCount: 0,
      createdAt: '방금 전'
    };
    const next = [newRecipe, ...recipes];
    setRecipes(next);
    try {
      localStorage.setItem('sinsangpick_recipes', JSON.stringify(next));
    } catch (e) {
      // ignore
    }
    showToast('🥪 나만의 신상 꿀조합 레시피가 등록되었습니다! (+50P)', 'success');
    await grantUserPoints(currentUser.uid, 50, '꿀조합 레시피 등록 보너스');
  };

  const openProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    setPreviousTab(activeTab);
    setActiveTabState('detail');
  };

  const openEventDetail = (eventId: string) => {
    setSelectedEventId(eventId);
    setPreviousTab(activeTab);
    setActiveTabState('event_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = 't-' + Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2800);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleBookmark = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isBookmarked = bookmarkedIds.includes(productId);
    if (isBookmarked) {
      setBookmarkedIds(prev => prev.filter(id => id !== productId));
      showToast('찜 목록에서 제거되었습니다.', 'info');
    } else {
      setBookmarkedIds(prev => [...prev, productId]);
      showToast('💖 찜 목록에 저장되었습니다!', 'success');
    }
  };

  const toggleCompare = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isCompared = comparedIds.includes(productId);
    if (isCompared) {
      setComparedIds(prev => prev.filter(id => id !== productId));
      showToast('비교함에서 제외되었습니다.', 'info');
    } else {
      if (comparedIds.length >= 3) {
        showToast('비교함에는 최대 3개까지 담을 수 있습니다.', 'error');
        return;
      }
      setComparedIds(prev => [...prev, productId]);
      showToast('⚖️ 비교함에 담겼습니다!', 'success');
    }
  };

  const removeFromCompare = (productId: string) => {
    setComparedIds(prev => prev.filter(id => id !== productId));
    showToast('비교함에서 삭제되었습니다.', 'info');
  };

  const clearCompare = () => {
    setComparedIds([]);
    showToast('비교함이 모두 비워졌습니다.', 'info');
  };

  const toggleAlertCategory = (cat: string) => {
    if (alertCategories.includes(cat)) {
      setAlertCategories(prev => prev.filter(c => c !== cat));
      showToast(`'${cat}' 알림이 해제되었습니다.`, 'info');
    } else {
      setAlertCategories(prev => [...prev, cat]);
      showToast(`'${cat}' 신제품 출시 알림이 켜졌습니다! 🔔`, 'success');
    }
  };

  const addRecentSearch = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    setRecentSearches(prev => [trimmed, ...prev.filter(k => k !== trimmed)].slice(0, 8));
  };

  const removeRecentSearch = (keyword: string) => {
    setRecentSearches(prev => prev.filter(k => k !== keyword));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    showToast('최근 검색어가 삭제되었습니다.', 'info');
  };

  const recordSearchInflux = (productId: string) => {
    setProducts(prev => {
      const next = prev.map(p => {
        if (p.id === productId) {
          const current = p.searchInfluxCount ?? getSearchInfluxCount(p);
          return { ...p, searchInfluxCount: current + 1 };
        }
        return p;
      });
      try {
        localStorage.setItem('sinsangpick_products', JSON.stringify(next));
      } catch (err) {
        // ignore quota error
      }
      return next;
    });
  };

  const updateUserNickname = async (newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setCurrentUser(prev => ({ ...prev, displayName: trimmed }));

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase
          .from('profiles')
          .update({ display_name: trimmed })
          .eq('id', currentUser.uid);
      } catch (err) {
        console.warn('[Supabase] Failed to update user nickname:', err);
      }
    }
    showToast('닉네임이 성공적으로 변경되었습니다.', 'success');
  };

  const loginWithApple = async () => {
    try {
      if (!supabase || !isSupabaseConfigured) {
        const demoUid = 'apple_' + Math.random().toString(36).substring(2, 9);
        const demoUser: UserProfile = {
          uid: demoUid,
          displayName: 'Apple 사용자',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          level: 'Lv.2',
          points: 250,
          isAnonymous: false,
          provider: 'apple',
          email: 'user@icloud.com',
        };
        setCurrentUser(demoUser);
        localStorage.setItem('sinsangpick_uid', demoUid);
        localStorage.setItem('sinsangpick_name', demoUser.displayName);
        localStorage.setItem('sinsangpick_points', '250');
        showToast('🍎 Apple 계정으로 로그인되었습니다!', 'success');
        return;
      }
      await supabaseSignInWithApple();
    } catch (err) {
      console.error('Apple login error:', err);
      showToast('Apple 로그인 중 오류가 발생했습니다.', 'error');
    }
  };

  const loginWithGoogle = async () => {
    try {
      if (!supabase || !isSupabaseConfigured) {
        const demoUid = 'google_' + Math.random().toString(36).substring(2, 9);
        const demoUser: UserProfile = {
          uid: demoUid,
          displayName: 'Google 사용자',
          photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
          level: 'Lv.2',
          points: 250,
          isAnonymous: false,
          provider: 'google',
          email: 'user@gmail.com',
        };
        setCurrentUser(demoUser);
        localStorage.setItem('sinsangpick_uid', demoUid);
        localStorage.setItem('sinsangpick_name', demoUser.displayName);
        localStorage.setItem('sinsangpick_points', '250');
        showToast('🌐 Google 계정으로 로그인되었습니다!', 'success');
        return;
      }
      await supabaseSignInWithGoogle();
    } catch (err) {
      console.error('Google login error:', err);
      showToast('로그인 처리 중 오류가 발생했습니다.', 'error');
    }
  };

  const loginWithKakao = async () => {
    try {
      if (!supabase || !isSupabaseConfigured) {
        const demoUid = 'kakao_' + Math.random().toString(36).substring(2, 9);
        const demoUser: UserProfile = {
          uid: demoUid,
          displayName: '카카오 사용자',
          photoURL: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
          level: 'Lv.2',
          points: 250,
          isAnonymous: false,
          provider: 'kakao',
          email: 'user@kakao.com',
        };
        setCurrentUser(demoUser);
        localStorage.setItem('sinsangpick_uid', demoUid);
        localStorage.setItem('sinsangpick_name', demoUser.displayName);
        localStorage.setItem('sinsangpick_points', '250');
        showToast('💬 카카오 계정으로 로그인되었습니다!', 'success');
        return;
      }
      await supabaseSignInWithKakao();
    } catch (err) {
      console.error('Kakao login error:', err);
      showToast('카카오 로그인 중 오류가 발생했습니다.', 'error');
    }
  };

  const logout = async () => {
    try {
      if (supabase && isSupabaseConfigured) {
        await signOutSupabase();
      }
      localStorage.removeItem('sinsangpick_uid');
      localStorage.removeItem('sinsangpick_name');
      localStorage.removeItem('sinsangpick_points');
      const initialUser = createInitialUser();
      setCurrentUser(initialUser);
      showToast('로그아웃 되었습니다.', 'info');
    } catch (err) {
      console.error('Logout error:', err);
      showToast('로그아웃 중 오류가 발생했습니다.', 'error');
    }
  };

  const deleteAccount = async () => {
    try {
      if (supabase && isSupabaseConfigured) {
        try {
          await supabase.from('profiles').delete().eq('id', currentUser.uid);
          await signOutSupabase();
        } catch (err) {
          console.warn('[Supabase] Failed to delete user profile from DB:', err);
        }
      }
      // 로컬 스토리지에 저장된 사용자 고유 데이터 일괄 영구 파기
      localStorage.removeItem('sinsangpick_uid');
      localStorage.removeItem('sinsangpick_name');
      localStorage.removeItem('sinsangpick_points');
      localStorage.removeItem('sinsangpick_bookmarks');
      localStorage.removeItem('sinsangpick_compared');
      localStorage.removeItem('sinsangpick_recent_searches');
      localStorage.removeItem('sinsangpick_alert_cats');

      // 상태 초기화
      const initialUser = createInitialUser();
      setCurrentUser(initialUser);
      setBookmarkedIds([]);
      setComparedIds([]);
      setActiveTabState('home');
      showToast('회원 탈퇴 및 계정 삭제가 정상적으로 완료되었습니다.', 'info');
    } catch (err) {
      console.error('Delete account error:', err);
      showToast('계정 삭제 중 오류가 발생했습니다.', 'error');
    }
  };

  // Submit Review
  const submitReview = async (
    productId: string,
    rating: number,
    detailedRating: DetailedRating,
    content: string,
    images?: string[],
    tags?: string[],
    extra?: ReviewExtraData
  ) => {
    const targetProduct = products.find(p => p.id === productId) || selectedProduct;
    const reviewId = 'rev-' + Date.now();
    const createdAt = new Date().toISOString();

    const newReview: Review = {
      id: reviewId,
      productId: targetProduct.id,
      productName: targetProduct.name,
      productImage: targetProduct.image,
      userName: currentUser.displayName,
      userAvatar: currentUser.photoURL,
      userLevel: currentUser.level,
      rating,
      detailedRating,
      content: content || '맛있게 잘 먹었습니다! 적극 추천합니다.',
      images: images && images.length > 0 ? images : [targetProduct.image],
      likes: 0,
      isLiked: false,
      commentsCount: 0,
      comments: [],
      createdAt,
      tags: tags && tags.length > 0 ? tags : ['#신상후기', '#내돈내산'],
      ...(extra || {}),
    };

    // Optimistic rating & count calculation
    const newCount = (targetProduct.ratingCount || 0) + 1;
    const currentTotal = (targetProduct.overallRating || 0) * (targetProduct.ratingCount || 0);
    const newRating = Number(((currentTotal + rating) / newCount).toFixed(1));

    // Calculate dynamic points (Base 50P + Photo bonus 30P + Length bonus 20P)
    let earnedPoints = 50;
    if (images && images.length > 0) earnedPoints += 30;
    if (content && content.trim().length >= 30) earnedPoints += 20;

    // 1. Optimistic Updates
    setReviews(prev => [newReview, ...prev]);
    setProducts(prev => prev.map(p => {
      if (p.id === targetProduct.id) {
        return {
          ...p,
          ratingCount: newCount,
          overallRating: newRating,
        };
      }
      return p;
    }));

    const nextPoints = currentUser.points + earnedPoints;
    setCurrentUser(prev => ({
      ...prev,
      points: nextPoints,
      level: calculateLevel(nextPoints),
    }));

    showToast(`🎉 정성 가득 리뷰 등록 완료! (+${earnedPoints}P 적립)`, 'success');
    setActiveTabState('detail');

    // 2. Supabase Insert (Server-side Trigger automatically updates products.overall_rating & rating_count!)
    if (supabase && isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('reviews').insert({
          id: reviewId,
          product_id: targetProduct.id,
          product_name: targetProduct.name,
          product_image: targetProduct.image,
          user_id: currentUser.uid,
          user_name: currentUser.displayName,
          user_avatar: currentUser.photoURL,
          user_level: currentUser.level,
          rating,
          detailed_rating: detailedRating,
          content: newReview.content,
          images: newReview.images,
          tags: newReview.tags,
          created_at: createdAt,
        });

        if (error) throw error;

        // Update profile points
        await supabase
          .from('profiles')
          .update({ points: nextPoints, level: calculateLevel(nextPoints) })
          .eq('id', currentUser.uid);

      } catch (err) {
        console.error('[Supabase] Review submission error:', err);
      }
    }
  };

  // Toggle Like Review (Duplicate prevention via review_likes PK)
  const toggleLikeReview = async (reviewId: string) => {
    const isCurrentlyLiked = likedReviewIds.includes(reviewId);

    // Optimistic update
    if (isCurrentlyLiked) {
      setLikedReviewIds(prev => prev.filter(id => id !== reviewId));
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, isLiked: false, likes: Math.max(0, r.likes - 1) } : r));
    } else {
      setLikedReviewIds(prev => [...prev, reviewId]);
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, isLiked: true, likes: r.likes + 1 } : r));
    }

    if (supabase && isSupabaseConfigured) {
      try {
        if (isCurrentlyLiked) {
          await supabase
            .from('review_likes')
            .delete()
            .match({ review_id: reviewId, user_id: currentUser.uid });
        } else {
          await supabase
            .from('review_likes')
            .insert({ review_id: reviewId, user_id: currentUser.uid });
        }
      } catch (err) {
        console.error('[Supabase] Toggle like review error:', err);
      }
    }
  };

  // Add Comment to Review
  const addReviewComment = async (reviewId: string, text: string) => {
    if (!text.trim()) return;
    const commentId = 'rc-' + Date.now();
    const createdAt = new Date().toISOString();

    const newComment: ReviewComment = {
      id: commentId,
      userName: currentUser.displayName,
      userAvatar: currentUser.photoURL,
      userLevel: currentUser.level,
      content: text.trim(),
      createdAt: '방금 전',
    };

    // Optimistic update
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          commentsCount: (r.commentsCount || 0) + 1,
          comments: [...(r.comments || []), newComment],
        };
      }
      return r;
    }));
    showToast('댓글이 등록되었습니다.', 'success');

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('review_comments').insert({
          id: commentId,
          review_id: reviewId,
          user_id: currentUser.uid,
          user_name: currentUser.displayName,
          user_avatar: currentUser.photoURL,
          user_level: currentUser.level,
          content: text.trim(),
          created_at: createdAt,
        });
      } catch (err) {
        console.error('[Supabase] Add review comment error:', err);
      }
    }
  };

  // Add Community Post
  const addCommunityPost = async (
    category: '인기글' | '자유게시판' | '질문/답변' | '이벤트',
    title: string,
    content: string,
    images?: string[]
  ) => {
    const postId = 'post-' + Date.now();
    const createdAt = new Date().toISOString();

    const newPost: CommunityPost = {
      id: postId,
      category,
      title: title.trim(),
      content: content.trim(),
      author: currentUser.displayName,
      authorAvatar: currentUser.photoURL,
      authorLevel: currentUser.level,
      likes: 0,
      isLiked: false,
      commentsCount: 0,
      createdAt,
      comments: [],
      images: images || [],
    };

    // Optimistic update
    setCommunityPosts(prev => [newPost, ...prev]);
    const nextPoints = currentUser.points + 20;
    setCurrentUser(prev => ({
      ...prev,
      points: nextPoints,
      level: calculateLevel(nextPoints),
    }));

    showToast('💬 게시글이 등록되었습니다! (+20P 적립)', 'success');

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('community_posts').insert({
          id: postId,
          category,
          title: title.trim(),
          content: content.trim(),
          author_id: currentUser.uid,
          author_name: currentUser.displayName,
          author_avatar: currentUser.photoURL,
          author_level: currentUser.level,
          images: newPost.images,
          created_at: createdAt,
        });

        await supabase
          .from('profiles')
          .update({ points: nextPoints, level: calculateLevel(nextPoints) })
          .eq('id', currentUser.uid);

      } catch (err) {
        console.error('[Supabase] Add community post error:', err);
      }
    }
  };

  // Toggle Like Post (Duplicate prevention via post_likes PK)
  const toggleLikePost = async (postId: string) => {
    const isCurrentlyLiked = likedPostIds.includes(postId);

    // Optimistic update
    if (isCurrentlyLiked) {
      setLikedPostIds(prev => prev.filter(id => id !== postId));
      setCommunityPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked: false, likes: Math.max(0, p.likes - 1) } : p));
    } else {
      setLikedPostIds(prev => [...prev, postId]);
      setCommunityPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked: true, likes: p.likes + 1 } : p));
    }

    if (supabase && isSupabaseConfigured) {
      try {
        if (isCurrentlyLiked) {
          await supabase
            .from('post_likes')
            .delete()
            .match({ post_id: postId, user_id: currentUser.uid });
        } else {
          await supabase
            .from('post_likes')
            .insert({ post_id: postId, user_id: currentUser.uid });
        }
      } catch (err) {
        console.error('[Supabase] Toggle like post error:', err);
      }
    }
  };

  // Add Comment to Community Post
  const addPostComment = async (postId: string, text: string) => {
    if (!text.trim()) return;
    const commentId = 'pc-' + Date.now();
    const createdAt = new Date().toISOString();

    const newComment: PostComment = {
      id: commentId,
      userName: currentUser.displayName,
      userAvatar: currentUser.photoURL,
      userLevel: currentUser.level,
      content: text.trim(),
      createdAt: '방금 전',
    };

    // Optimistic update
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: (p.commentsCount || 0) + 1,
          comments: [...(p.comments || []), newComment],
        };
      }
      return p;
    }));
    showToast('댓글이 등록되었습니다.', 'success');

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('post_comments').insert({
          id: commentId,
          post_id: postId,
          user_id: currentUser.uid,
          user_name: currentUser.displayName,
          user_avatar: currentUser.photoURL,
          user_level: currentUser.level,
          content: text.trim(),
          created_at: createdAt,
        });
      } catch (err) {
        console.error('[Supabase] Add post comment error:', err);
      }
    }
  };

  // ================= ADMIN MODERATION FUNCTIONS =================
  // Delete Review
  const deleteReview = async (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    showToast('리뷰가 정상적으로 삭제되었습니다.', 'info');
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('reviews').delete().eq('id', reviewId);
      } catch (err) {
        console.error('[Supabase] Delete review error:', err);
      }
    }
  };

  // Delete Community Post
  const deleteCommunityPost = async (postId: string) => {
    setCommunityPosts(prev => prev.filter(p => p.id !== postId));
    showToast('커뮤니티 게시글이 삭제되었습니다.', 'info');
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('community_posts').delete().eq('id', postId);
      } catch (err) {
        console.error('[Supabase] Delete post error:', err);
      }
    }
  };

  // ================= EVENTS & PUSH NOTIFICATIONS =================
  // Add Event
  const addEvent = (eventData: Omit<PromotionEvent, 'id' | 'createdAt' | 'participantsCount' | 'isParticipated'>) => {
    const newEvent: PromotionEvent = {
      ...eventData,
      id: 'event-' + Date.now(),
      participantsCount: 0,
      isParticipated: false,
      createdAt: new Date().toISOString(),
    };
    setEvents(prev => [newEvent, ...prev]);
    showToast(`🎉 '${newEvent.title}' 이벤트가 성공적으로 등록되었습니다!`, 'success');
  };

  // Update Event
  const updateEvent = (id: string, updated: Partial<PromotionEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
    showToast('이벤트 정보가 수정되었습니다.', 'success');
  };

  // Delete Event
  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    showToast('이벤트가 삭제되었습니다.', 'info');
  };

  // Participate in Event
  const participateInEvent = (eventId: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          isParticipated: true,
          participantsCount: (e.participantsCount || 0) + 1,
        };
      }
      return e;
    }));
    const nextPoints = currentUser.points + 50;
    setCurrentUser(prev => ({
      ...prev,
      points: nextPoints,
      level: calculateLevel(nextPoints),
    }));
    showToast('🎁 이벤트 신청이 완료되었습니다! (+50P 적립)', 'success');
  };

  // Send Push Notification
  const sendPushNotification = (notif: {
    title: string;
    body: string;
    type: 'event' | 'product' | 'notice';
    targetId: string;
    imageUrl?: string;
    badge?: string;
  }) => {
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title: notif.title,
      body: notif.body,
      type: notif.type,
      targetId: notif.targetId,
      imageUrl: notif.imageUrl,
      timestamp: '방금 전',
      isRead: false,
      badge: notif.badge || (notif.type === 'event' ? '이벤트' : '알림'),
    };

    setNotifications(prev => [newNotif, ...prev]);
    setIncomingPush(newNotif);

    // Native Browser Notification Trigger if supported & granted
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          const sysNotif = new Notification(newNotif.title, {
            body: newNotif.body,
            icon: newNotif.imageUrl || 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=128&auto=format&fit=crop&q=80',
          });
          sysNotif.onclick = () => {
            window.focus();
            if (newNotif.type === 'event') {
              openEventDetail(newNotif.targetId);
            } else if (newNotif.type === 'product') {
              openProductDetail(newNotif.targetId);
            }
          };
        } catch (e) {
          console.warn('[Push Notification] System dispatch warning:', e);
        }
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }

    showToast(`📢 전체 회원 대상 앱 푸시 알림이 발송되었습니다!`, 'success');
  };

  const dismissIncomingPush = () => {
    setIncomingPush(null);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast('알림 내역이 모두 삭제되었습니다.', 'info');
  };

  // ================= ADMIN FUNCTIONS =================
  // Add Banner (특정 구좌 순서 지정 지원)
  const addBanner = (bannerData: Omit<BannerItem, 'id' | 'order'>, targetOrder?: number) => {
    const newBanner: BannerItem = {
      ...bannerData,
      id: 'banner-' + Date.now(),
      order: targetOrder ?? (banners.length + 1),
    };
    setBanners(prev => {
      let list = [...prev];
      if (typeof targetOrder === 'number' && targetOrder >= 1 && targetOrder <= list.length) {
        list.splice(targetOrder - 1, 0, newBanner);
      } else {
        list.push(newBanner);
      }
      return normalizeBanners(list);
    });
    showToast('🎉 새 배너 구좌가 성공적으로 등록되었습니다!', 'success');
  };

  // Update Banner
  const updateBanner = (id: string, updated: Partial<BannerItem>) => {
    setBanners(prev => {
      let next = prev.map(b => b.id === id ? { ...b, ...updated } : b);
      if (typeof updated.order === 'number') {
        const itemIdx = next.findIndex(b => b.id === id);
        if (itemIdx !== -1) {
          const [item] = next.splice(itemIdx, 1);
          const insertIdx = Math.max(0, Math.min(next.length, updated.order - 1));
          next.splice(insertIdx, 0, item);
        }
      }
      return normalizeBanners(next);
    });
    showToast('배너 구좌 정보가 수정되었습니다.', 'success');
  };

  // Delete Banner (남은 구좌 번호 1부터 자동 재배열)
  const deleteBanner = (id: string) => {
    setBanners(prev => normalizeBanners(prev.filter(b => b.id !== id)));
    showToast('배너 구좌가 삭제되었습니다.', 'info');
  };

  // Toggle Banner Active
  const toggleBannerActive = (id: string) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
  };

  // Move Banner Order (▲ 위로 / ▼ 아래로 한 단계 이동)
  const moveBannerOrder = (id: string, direction: 'up' | 'down') => {
    setBanners(prev => {
      const sorted = normalizeBanners(prev);
      const index = sorted.findIndex(b => b.id === id);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= sorted.length) return prev;
      
      const newBanners = [...sorted];
      const temp = newBanners[index];
      newBanners[index] = newBanners[targetIndex];
      newBanners[targetIndex] = temp;
      
      return normalizeBanners(newBanners);
    });
    showToast(`배너 구좌 순서가 ${direction === 'up' ? '상위' : '하위'}로 변경되었습니다.`, 'info');
  };

  // Set Banner Order (특정 구좌 번호로 바로 이동)
  const setBannerOrder = (id: string, targetOrder: number) => {
    setBanners(prev => {
      const sorted = normalizeBanners(prev);
      const index = sorted.findIndex(b => b.id === id);
      if (index === -1) return prev;
      
      const [item] = sorted.splice(index, 1);
      const insertIndex = Math.max(0, Math.min(sorted.length, targetOrder - 1));
      sorted.splice(insertIndex, 0, item);
      
      return normalizeBanners(sorted);
    });
    showToast(`배너가 ${targetOrder}구좌로 이동되었습니다.`, 'success');
  };

  // Duplicate Banner (기존 구좌 복제하여 다음 순서에 추가)
  const duplicateBanner = (id: string) => {
    setBanners(prev => {
      const sorted = normalizeBanners(prev);
      const target = sorted.find(b => b.id === id);
      if (!target) return prev;
      
      const duplicated: BannerItem = {
        ...target,
        id: 'banner-' + Date.now(),
        title: `${target.title} (복사본)`,
        order: target.order + 1,
      };
      
      const targetIndex = sorted.findIndex(b => b.id === id);
      sorted.splice(targetIndex + 1, 0, duplicated);
      return normalizeBanners(sorted);
    });
    showToast('배너 구좌가 성공적으로 복제되었습니다!', 'success');
  };

  // Reorder Banners (일괄 순서 저장)
  const reorderBanners = (newBanners: BannerItem[]) => {
    setBanners(normalizeBanners(newBanners));
    showToast('배너 구좌 순서가 저장되었습니다.', 'success');
  };

  // Add Product
  const addProduct = (productData: Partial<Product> & { name: string; brand: string; category: ProductCategory; price: number }) => {
    const isAgri = isAgriMarineProduct(productData);
    const rawImage = productData.image;
    const finalImage = isAgri && (!rawImage || rawImage.includes('unsplash') || !rawImage.startsWith('data:image/svg+xml'))
      ? getProductIllustration(productData)
      : (rawImage || 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80');

    const newProduct: Product = {
      id: 'prod-' + Date.now(),
      name: productData.name,
      brand: productData.brand,
      category: productData.category,
      subCategory: productData.subCategory,
      itemType: productData.itemType || (isAgri ? 'fresh' : 'packaged'),
      image: finalImage,
      releaseDate: productData.releaseDate || new Date().toLocaleDateString('ko-KR') + ' 출시',
      price: productData.price || 0,
      discountRate: productData.discountRate || 0,
      overallRating: 5.0,
      ratingCount: 1,
      detailedRating: { taste: 5, value: 5, portion: 5, repurchase: 5 },
      description: productData.description || '',
      stores: productData.stores || ['CU', 'GS25'],
      repurchasePercent: 95,
      calories: productData.calories,
      volume: productData.volume,
      isToday: productData.isToday ?? true,
      isHot: productData.isHot ?? false,
    };
    setProducts(prev => [newProduct, ...prev]);
    showToast(`📦 '${newProduct.name}' 상품이 등록되었습니다!`, 'success');
  };

  // Update Product
  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    showToast('상품 정보가 수정되었습니다.', 'success');
  };

  // Delete Product
  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('상품이 삭제되었습니다.', 'info');
  };

  // Toggle Product Today
  const toggleProductToday = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isToday: !p.isToday } : p));
    showToast('오늘의 신상 상태가 변경되었습니다.', 'info');
  };

  // Toggle Product Hot
  const toggleProductHot = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isHot: !p.isHot } : p));
    showToast('인기 상품 상태가 변경되었습니다.', 'info');
  };

  // Update Battle Config
  const updateBattleConfig = (config: Partial<BattleConfig>) => {
    setBattleConfig(prev => ({ ...prev, ...config }));
    showToast('🥊 신상 배틀 설정이 업데이트되었습니다!', 'success');
  };

  // --- Admin Pending Products & Crawler Actions ---

  // 1. 오늘의 실제 신제품 일일 크롤링 실행
  const runDailyCrawler = async (force: boolean = false): Promise<{ count: number }> => {
    setIsCrawling(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const crawled = await fetchDailyNewProducts(today);
      
      // 기존 대기목록 및 이미 출시된 제품(이름 기준) 중복 필터링
      const existingProductNames = new Set(products.map(p => p.name.trim()));
      const existingPendingNames = new Set(pendingProducts.map(p => p.name.trim()));

      const uniqueNewItems = crawled.filter(item => 
        !existingProductNames.has(item.name.trim()) &&
        !existingPendingNames.has(item.name.trim())
      );

      if (uniqueNewItems.length > 0) {
        setPendingProducts(prev => [...uniqueNewItems, ...prev]);
        markDailyCrawlDone();
        setLastCrawledDate(today);
        showToast(`✨ 오늘의 실제 신제품 ${uniqueNewItems.length}건이 수집되어 승인 대기함에 등록되었습니다!`, 'success');
        return { count: uniqueNewItems.length };
      } else {
        if (force) {
          // 강제 수집인 경우 타임스탬프를 갱신하여 추가
          const forcedItems = crawled.slice(0, 3).map((item, i) => ({
            ...item,
            id: `pending-forced-${Date.now()}-${i}`,
            crawledAt: `${today} ${new Date().toLocaleTimeString('ko-KR', { hour12: false })}`,
            status: 'pending' as const
          }));
          setPendingProducts(prev => [...forcedItems, ...prev]);
          showToast(`⚡ 새로운 실제 신제품 ${forcedItems.length}건을 즉시 수집했습니다!`, 'success');
          return { count: forcedItems.length };
        }
        showToast('이미 오늘의 최신 신제품이 모두 수집되었습니다.', 'info');
        return { count: 0 };
      }
    } catch (err) {
      console.error('[Product Crawler Error]', err);
      showToast('신제품 수집 중 오류가 발생했습니다.', 'error');
      return { count: 0 };
    } finally {
      setIsCrawling(false);
    }
  };

  // 2. 키워드/편의점 기반 실제 신제품 즉시 검색 수집
  const searchAndCollect = async (query: string): Promise<{ count: number }> => {
    if (!query.trim()) return { count: 0 };
    setIsCrawling(true);
    try {
      const results = await searchAndCrawlNewProducts(query);
      const existingPendingNames = new Set(pendingProducts.map(p => p.name.trim()));
      const newItems = results.filter(item => !existingPendingNames.has(item.name.trim()));

      if (newItems.length > 0) {
        setPendingProducts(prev => [...newItems, ...prev]);
        showToast(`🔍 '${query}' 관련 실제 신제품 ${newItems.length}건을 수집하여 승인 대기함에 추가했습니다!`, 'success');
        return { count: newItems.length };
      } else {
        showToast(`'${query}'에 해당하는 신제품이 이미 대기함에 있습니다.`, 'info');
        return { count: 0 };
      }
    } catch (err) {
      console.error('[Search Collect Error]', err);
      showToast('검색 수집 중 오류가 발생했습니다.', 'error');
      return { count: 0 };
    } finally {
      setIsCrawling(false);
    }
  };

  // 3. 신제품 개별 승인 (정식 products 등록 및 전체 사용자에게 즉시 발행)
  const approvePendingProduct = (pendingId: string, customData?: Partial<Product>) => {
    const pendingItem = pendingProducts.find(p => p.id === pendingId);
    if (!pendingItem) return;

    const isAgri = isAgriMarineProduct({
      name: customData?.name || pendingItem.name,
      category: customData?.category || pendingItem.category,
      subCategory: customData?.subCategory || pendingItem.subCategory,
      itemType: customData?.itemType || pendingItem.itemType,
    });
    const rawImg = customData?.image || pendingItem.image;
    const finalImg = isAgri && (!rawImg || rawImg.includes('unsplash') || !rawImg.startsWith('data:image/svg+xml'))
      ? getProductIllustration({
          name: customData?.name || pendingItem.name,
          category: customData?.category || pendingItem.category,
          subCategory: customData?.subCategory || pendingItem.subCategory,
          itemType: customData?.itemType || pendingItem.itemType,
        })
      : (rawImg || 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80');

    const newProduct: Product = {
      id: `prod-appr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: customData?.name || pendingItem.name,
      brand: customData?.brand || pendingItem.brand,
      category: customData?.category || pendingItem.category,
      subCategory: customData?.subCategory || pendingItem.subCategory,
      itemType: customData?.itemType || pendingItem.itemType || (isAgri ? 'fresh' : 'packaged'),
      image: finalImg,
      releaseDate: customData?.releaseDate || pendingItem.releaseDate || new Date().toLocaleDateString('ko-KR') + ' 출시',
      price: customData?.price !== undefined ? customData.price : pendingItem.price,
      discountRate: customData?.discountRate ?? pendingItem.discountRate ?? 0,
      overallRating: 5.0,
      ratingCount: 1,
      detailedRating: { taste: 5, value: 5, portion: 5, repurchase: 5 },
      description: customData?.description || pendingItem.description,
      stores: customData?.stores || pendingItem.stores,
      repurchasePercent: 96,
      calories: customData?.calories || pendingItem.calories,
      volume: customData?.volume || pendingItem.volume,
      isToday: customData?.isToday ?? true,
      isHot: customData?.isHot ?? false,
      nutrition: pendingItem.nutrition,
      ingredients: pendingItem.ingredients,
      allergens: pendingItem.allergens,
      origin: pendingItem.origin,
      manufacturer: pendingItem.manufacturer,
      storageMethod: pendingItem.storageMethod,
      shelfLife: pendingItem.shelfLife,
      bestQuotes: pendingItem.bestQuotes || ['새로 나온 신상 먹어봤는데 완전 추천해요!'],
      storeStocks: pendingItem.storeStocks || pendingItem.stores.map(st => ({
        store: st,
        status: '입고완료' as const,
        stockCount: 6,
        price: customData?.price !== undefined ? customData.price : pendingItem.price,
        eventBadge: '신규입고',
        deliveryTime: '매장 즉시 픽업'
      })),
    };

    // 정식 제품 등록
    setProducts(prev => [newProduct, ...prev]);

    // 승인 대기 목록에서 제거
    setPendingProducts(prev => prev.filter(p => p.id !== pendingId));

    // Supabase DB 연결 시에도 비동기 백그라운드 등록
    if (supabase) {
      supabase.from('products').upsert({
        id: newProduct.id,
        name: newProduct.name,
        brand: newProduct.brand,
        category: newProduct.category,
        sub_category: newProduct.subCategory,
        item_type: newProduct.itemType,
        image: newProduct.image,
        release_date: newProduct.releaseDate,
        price: newProduct.price,
        discount_rate: newProduct.discountRate,
        overall_rating: newProduct.overallRating,
        rating_count: newProduct.ratingCount,
        description: newProduct.description,
        stores: newProduct.stores,
        calories: newProduct.calories,
        volume: newProduct.volume,
        is_today: newProduct.isToday,
        is_hot: newProduct.isHot,
      }, { onConflict: 'id' }).then(({ error }) => {
        if (error) console.warn('[Supabase Product Insert Warning]', error.message);
      });
    }

    showToast(`🚀 [${newProduct.name}] 신제품이 승인되어 서비스에 즉시 업로드되었습니다!`, 'success');
  };

  // 4. 대기 중인 모든 신제품 일괄 승인
  const approveAllPending = () => {
    const pendingList = pendingProducts.filter(p => p.status === 'pending');
    if (pendingList.length === 0) {
      showToast('승인 대기 중인 신제품이 없습니다.', 'info');
      return;
    }

    const approvedList: Product[] = pendingList.map((item, idx) => {
      const isAgri = isAgriMarineProduct(item);
      const rawImg = item.image;
      const finalImg = isAgri && (!rawImg || rawImg.includes('unsplash') || !rawImg.startsWith('data:image/svg+xml'))
        ? getProductIllustration(item)
        : (rawImg || 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80');

      return {
        id: `prod-bulk-${Date.now()}-${idx}`,
        name: item.name,
        brand: item.brand,
        category: item.category,
        subCategory: item.subCategory,
        itemType: item.itemType || (isAgri ? 'fresh' : 'packaged'),
        image: finalImg,
      releaseDate: item.releaseDate,
      price: item.price,
      discountRate: item.discountRate || 0,
      overallRating: 5.0,
      ratingCount: 1,
      detailedRating: { taste: 5, value: 5, portion: 5, repurchase: 5 },
      description: item.description,
      stores: item.stores,
      repurchasePercent: 95,
      calories: item.calories,
      volume: item.volume,
      isToday: true,
      isHot: false,
      nutrition: item.nutrition,
      ingredients: item.ingredients,
      allergens: item.allergens,
      origin: item.origin,
      manufacturer: item.manufacturer,
      storageMethod: item.storageMethod,
      shelfLife: item.shelfLife,
      bestQuotes: item.bestQuotes || ['신상품으로 적극 추천합니다.'],
      storeStocks: item.stores.map(st => ({
        store: st,
        status: '입고완료' as const,
        stockCount: 5,
        price: item.price,
        eventBadge: '신규입고',
        deliveryTime: '매장 즉시 픽업'
      })),
    };
  });

    setProducts(prev => [...approvedList, ...prev]);
    setPendingProducts([]);
    showToast(`🎉 총 ${approvedList.length}건의 실제 신제품이 일괄 승인되어 서비스에 업로드되었습니다!`, 'success');
  };

  // 5. 신제품 반려(거절)
  const rejectPendingProduct = (pendingId: string) => {
    const item = pendingProducts.find(p => p.id === pendingId);
    setPendingProducts(prev => prev.filter(p => p.id !== pendingId));
    showToast(`'${item?.name || '상품'}'이(가) 반려되었습니다.`, 'info');
  };

  // 5-1. 대기 중인 모든 신제품 일괄 승인 취소 (일괄 반려)
  const rejectAllPending = () => {
    const count = pendingProducts.length;
    if (count === 0) {
      showToast('대기 중인 신제품이 없습니다.', 'info');
      return;
    }
    setPendingProducts([]);
    showToast(`총 ${count}건의 대기 상품이 일괄 승인 취소(반려)되었습니다.`, 'info');
  };

  // 5-2. 이미 승인된 개별 상품 승인 취소 (products에서 제거 후 pendingProducts 대기함으로 복원)
  const revokeApprovedProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Remove from products
    setProducts(prev => prev.filter(p => p.id !== productId));

    // Restore to pendingProducts
    const restoredPending: PendingProduct = {
      id: `pending-revoked-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: product.name,
      brand: product.brand,
      category: product.category,
      subCategory: product.subCategory,
      itemType: product.itemType || 'packaged',
      image: product.image,
      price: product.price,
      discountRate: product.discountRate || 0,
      releaseDate: product.releaseDate,
      stores: product.stores || ['CU', 'GS25'],
      description: product.description || '',
      sourceName: '승인 취소 상품 (관리자 복원)',
      crawledAt: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString('ko-KR', { hour12: false })}`,
      status: 'pending',
      calories: product.calories,
      volume: product.volume,
      nutrition: product.nutrition,
      ingredients: product.ingredients,
      allergens: product.allergens,
      origin: product.origin,
      manufacturer: product.manufacturer,
      storageMethod: product.storageMethod,
      shelfLife: product.shelfLife,
      bestQuotes: product.bestQuotes,
      storeStocks: product.storeStocks,
    };

    setPendingProducts(prev => [restoredPending, ...prev]);

    if (supabase) {
      supabase.from('products').delete().eq('id', productId).then(({ error }) => {
        if (error) console.warn('[Supabase Delete on Revoke Warning]', error.message);
      });
    }

    showToast(`↩️ [${product.name}] 승인이 취소되어 다시 승인 대기함으로 이동되었습니다.`, 'info');
  };

  // 5-3. 승인된 상품들 일괄 승인 취소 (선택된 ID들 또는 최근 승인된 상품들 대기함으로 복원)
  const revokeAllApprovedProducts = (ids?: string[]) => {
    const targetIds = ids && ids.length > 0 
      ? ids 
      : products.slice(0, 10).map(p => p.id); // Default to latest 10 products

    if (targetIds.length === 0) {
      showToast('승인 취소할 상품이 없습니다.', 'info');
      return;
    }

    const revokedProducts = products.filter(p => targetIds.includes(p.id));
    setProducts(prev => prev.filter(p => !targetIds.includes(p.id)));

    const dateStr = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('ko-KR', { hour12: false });

    const restoredList: PendingProduct[] = revokedProducts.map((product, idx) => ({
      id: `pending-bulk-revoked-${Date.now()}-${idx}`,
      name: product.name,
      brand: product.brand,
      category: product.category,
      subCategory: product.subCategory,
      itemType: product.itemType || 'packaged',
      image: product.image,
      price: product.price,
      discountRate: product.discountRate || 0,
      releaseDate: product.releaseDate,
      stores: product.stores || ['CU', 'GS25'],
      description: product.description || '',
      sourceName: '일괄 승인 취소 (관리자 복원)',
      crawledAt: `${dateStr} ${nowTime}`,
      status: 'pending',
      calories: product.calories,
      volume: product.volume,
      nutrition: product.nutrition,
      ingredients: product.ingredients,
      allergens: product.allergens,
      origin: product.origin,
      manufacturer: product.manufacturer,
      storageMethod: product.storageMethod,
      shelfLife: product.shelfLife,
      bestQuotes: product.bestQuotes,
      storeStocks: product.storeStocks,
    }));

    setPendingProducts(prev => [...restoredList, ...prev]);

    const client = supabase;
    if (client) {
      targetIds.forEach(id => {
        client.from('products').delete().eq('id', id).then(({ error }) => {
          if (error) console.warn('[Supabase Delete on Bulk Revoke Warning]', error.message);
        });
      });
    }

    showToast(`↩️ 총 ${revokedProducts.length}건의 상품이 일괄 승인 취소되어 대기함으로 복원되었습니다!`, 'success');
  };

  // 5-4. 대기 목록 내 중복 항목 및 기존 등록 상품과의 중복 자동 정리
  const removeDuplicatePending = (): { removedCount: number } => {
    const registeredNames = new Set(
      products.map(p => p.name.replace(/\s+/g, '').toLowerCase())
    );

    const seenPending = new Set<string>();
    const cleanedPending: PendingProduct[] = [];
    let duplicateCount = 0;

    for (const item of pendingProducts) {
      const normName = item.name.replace(/\s+/g, '').toLowerCase();
      if (registeredNames.has(normName) || seenPending.has(normName)) {
        duplicateCount++;
      } else {
        seenPending.add(normName);
        cleanedPending.push(item);
      }
    }

    setPendingProducts(cleanedPending);
    if (duplicateCount > 0) {
      showToast(`🧹 중복 감지된 ${duplicateCount}개 신제품이 정리되었습니다.`, 'success');
    } else {
      showToast('중복된 신제품이 없습니다.', 'info');
    }
    return { removedCount: duplicateCount };
  };

  // 5-5. 대기 목록 정제 및 재검증 (헤드라인성 문구 걸러내기 및 실물 쇼핑 패키지/가격 정상화)
  const revalidateAllPending = () => {
    setPendingProducts(prev => {
      const updated = revalidatePendingProductList(prev);
      try {
        localStorage.setItem(PENDING_PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      showToast(`✨ 대기 상품 ${updated.length}건 모두 실물 쇼핑 정품 데이터로 정상화 완료!`, 'success');
      return updated;
    });
  };


  // 6. 대기 상품 정보 수정
  const updatePendingProduct = (pendingId: string, updated: Partial<PendingProduct>) => {
    setPendingProducts(prev => prev.map(p => p.id === pendingId ? { ...p, ...updated } : p));
    showToast('대기 상품 정보가 수정되었습니다.', 'success');
  };

  // 7. 대기 목록 전체 삭제
  const clearAllPendingProducts = () => {
    setPendingProducts([]);
    showToast('승인 대기 목록이 모두 비워졌습니다.', 'info');
  };

  // 8. 개별 신제품 대기함 직접 추가
  const addPendingProduct = (item: PendingProduct) => {
    setPendingProducts(prev => [item, ...prev.filter(p => p.id !== item.id)]);
    showToast(`'${item.name}' 상품이 승인 대기함에 추가되었습니다.`, 'info');
  };

  // User & Points Management Actions (Admin)
  const fetchAllProfiles = async () => {
    if (!supabase || !isSupabaseConfigured) return;
    try {
      const { data: dbAllProfiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('points', { ascending: false });

      if (!error && dbAllProfiles) {
        setAllProfiles(prev => {
          const dbMap = new Map<string, any>();
          dbAllProfiles.forEach(p => dbMap.set(p.id, p));

          const updated = prev.map(p => {
            const dbP = dbMap.get(p.uid);
            if (dbP) {
              return {
                ...p,
                displayName: dbP.display_name || p.displayName,
                photoURL: dbP.avatar_url || p.photoURL,
                points: dbP.points ?? p.points,
                level: calculateLevel(dbP.points ?? p.points),
                createdAt: dbP.created_at ? new Date(dbP.created_at).toLocaleDateString('ko-KR') : p.createdAt
              };
            }
            return p;
          });

          const existingUids = new Set(prev.map(p => p.uid));
          const extraUsers: UserProfile[] = dbAllProfiles
            .filter(p => !existingUids.has(p.id))
            .map(p => ({
              uid: p.id,
              displayName: p.display_name || '신상러버',
              photoURL: p.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
              level: calculateLevel(p.points ?? 100),
              points: p.points ?? 100,
              email: p.email || undefined,
              createdAt: p.created_at ? new Date(p.created_at).toLocaleDateString('ko-KR') : '2025.01.01'
            }));

          return [...updated, ...extraUsers];
        });
      }
    } catch (e) {
      console.warn('[Supabase fetchAllProfiles error]', e);
    }
  };

  const grantUserPoints = async (userId: string, amount: number, reason: string, memo?: string) => {
    if (amount <= 0) {
      showToast('지급할 포인트를 1P 이상 입력해주세요.', 'error');
      return;
    }

    const targetUser = allProfiles.find(u => u.uid === userId);
    const userName = targetUser ? targetUser.displayName : '회원';
    const userAvatar = targetUser?.photoURL;
    let newBalance = amount;

    setAllProfiles(prev => {
      return prev.map(u => {
        if (u.uid === userId) {
          const updatedPoints = (u.points || 0) + amount;
          newBalance = updatedPoints;
          return {
            ...u,
            points: updatedPoints,
            level: calculateLevel(updatedPoints)
          };
        }
        return u;
      });
    });

    if (currentUser.uid === userId) {
      setCurrentUser(prev => {
        const nextPoints = (prev.points || 0) + amount;
        return {
          ...prev,
          points: nextPoints,
          level: calculateLevel(nextPoints)
        };
      });
    }

    const newTx: PointTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId,
      userName,
      userAvatar,
      type: 'grant',
      amount: Math.abs(amount),
      balanceAfter: newBalance,
      reason: reason || '관리자 포인트 특별 지급',
      createdAt: new Date().toLocaleString('ko-KR', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      adminMemo: memo
    };

    setPointTransactions(prev => [newTx, ...prev]);

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase
          .from('profiles')
          .update({ 
            points: newBalance,
            level: calculateLevel(newBalance)
          })
          .eq('id', userId);
      } catch (err) {
        console.warn('[Supabase Points Update Error]', err);
      }
    }

    showToast(`🎁 ${userName}님께 +${amount.toLocaleString()}P가 지급되었습니다!`, 'success');
  };

  const revokeUserPoints = async (userId: string, amount: number, reason: string, memo?: string) => {
    if (amount <= 0) {
      showToast('회수할 포인트를 1P 이상 입력해주세요.', 'error');
      return;
    }

    const targetUser = allProfiles.find(u => u.uid === userId);
    if (!targetUser) return;
    const currentPoints = targetUser.points || 0;
    const actualDeduct = Math.min(currentPoints, amount);
    const newBalance = Math.max(0, currentPoints - amount);
    const userName = targetUser.displayName;
    const userAvatar = targetUser.photoURL;

    setAllProfiles(prev => {
      return prev.map(u => {
        if (u.uid === userId) {
          return {
            ...u,
            points: newBalance,
            level: calculateLevel(newBalance)
          };
        }
        return u;
      });
    });

    if (currentUser.uid === userId) {
      setCurrentUser(prev => ({
        ...prev,
        points: newBalance,
        level: calculateLevel(newBalance)
      }));
    }

    const newTx: PointTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId,
      userName,
      userAvatar,
      type: 'revoke',
      amount: -actualDeduct,
      balanceAfter: newBalance,
      reason: reason || '관리자 포인트 회수/차감',
      createdAt: new Date().toLocaleString('ko-KR', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      adminMemo: memo
    };

    setPointTransactions(prev => [newTx, ...prev]);

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase
          .from('profiles')
          .update({ 
            points: newBalance,
            level: calculateLevel(newBalance)
          })
          .eq('id', userId);
      } catch (err) {
        console.warn('[Supabase Points Update Error]', err);
      }
    }

    showToast(`🔻 ${userName}님의 -${actualDeduct.toLocaleString()}P가 회수되었습니다.`, 'info');
  };

  const batchGrantPoints = async (userIds: string[], amount: number, reason: string, memo?: string) => {
    if (userIds.length === 0) {
      showToast('지급할 회원을 선택해주세요.', 'error');
      return;
    }
    if (amount <= 0) {
      showToast('지급할 포인트를 1P 이상 입력해주세요.', 'error');
      return;
    }

    const targetSet = new Set(userIds);
    const nowStr = new Date().toLocaleString('ko-KR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });

    const newTransactions: PointTransaction[] = [];

    setAllProfiles(prev => {
      return prev.map(u => {
        if (targetSet.has(u.uid)) {
          const updatedPoints = (u.points || 0) + amount;
          newTransactions.push({
            id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            userId: u.uid,
            userName: u.displayName,
            userAvatar: u.photoURL,
            type: 'grant',
            amount: Math.abs(amount),
            balanceAfter: updatedPoints,
            reason: reason || '관리자 일괄 포인트 지급',
            createdAt: nowStr,
            adminMemo: memo
          });
          return {
            ...u,
            points: updatedPoints,
            level: calculateLevel(updatedPoints)
          };
        }
        return u;
      });
    });

    if (targetSet.has(currentUser.uid)) {
      setCurrentUser(prev => {
        const nextPoints = (prev.points || 0) + amount;
        return {
          ...prev,
          points: nextPoints,
          level: calculateLevel(nextPoints)
        };
      });
    }

    setPointTransactions(prev => [...newTransactions, ...prev]);

    if (supabase && isSupabaseConfigured) {
      for (const uid of userIds) {
        const u = allProfiles.find(p => p.uid === uid);
        const updatedPoints = (u?.points || 0) + amount;
        supabase.from('profiles').update({
          points: updatedPoints,
          level: calculateLevel(updatedPoints)
        }).eq('id', uid).then();
      }
    }

    showToast(`🎉 총 ${userIds.length}명의 회원에게 각 +${amount.toLocaleString()}P가 일괄 지급되었습니다!`, 'success');
  };

  const batchRevokePoints = async (userIds: string[], amount: number, reason: string, memo?: string) => {
    if (userIds.length === 0) {
      showToast('회수할 회원을 선택해주세요.', 'error');
      return;
    }
    if (amount <= 0) {
      showToast('회수할 포인트를 1P 이상 입력해주세요.', 'error');
      return;
    }

    const targetSet = new Set(userIds);
    const nowStr = new Date().toLocaleString('ko-KR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });

    const newTransactions: PointTransaction[] = [];

    setAllProfiles(prev => {
      return prev.map(u => {
        if (targetSet.has(u.uid)) {
          const currentPoints = u.points || 0;
          const actualDeduct = Math.min(currentPoints, amount);
          const newBalance = Math.max(0, currentPoints - amount);

          newTransactions.push({
            id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            userId: u.uid,
            userName: u.displayName,
            userAvatar: u.photoURL,
            type: 'revoke',
            amount: -actualDeduct,
            balanceAfter: newBalance,
            reason: reason || '관리자 일괄 포인트 회수',
            createdAt: nowStr,
            adminMemo: memo
          });

          return {
            ...u,
            points: newBalance,
            level: calculateLevel(newBalance)
          };
        }
        return u;
      });
    });

    if (targetSet.has(currentUser.uid)) {
      setCurrentUser(prev => {
        const newBalance = Math.max(0, (prev.points || 0) - amount);
        return {
          ...prev,
          points: newBalance,
          level: calculateLevel(newBalance)
        };
      });
    }

    setPointTransactions(prev => [...newTransactions, ...prev]);

    if (supabase && isSupabaseConfigured) {
      for (const uid of userIds) {
        const u = allProfiles.find(p => p.uid === uid);
        const newBalance = Math.max(0, (u?.points || 0) - amount);
        supabase.from('profiles').update({
          points: newBalance,
          level: calculateLevel(newBalance)
        }).eq('id', uid).then();
      }
    }

    showToast(`🔻 총 ${userIds.length}명의 회원으로부터 각 -${amount.toLocaleString()}P가 일괄 회수되었습니다.`, 'info');
  };

  // Reset All to Defaults
  const resetAllDataToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setBanners(INITIAL_BANNERS);
    setBattleConfig(INITIAL_BATTLE_CONFIG);
    setEvents(INITIAL_EVENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAllProfiles(INITIAL_USER_PROFILES);
    setPointTransactions(INITIAL_POINT_TRANSACTIONS);
    setPendingProducts([]);
    localStorage.removeItem('sinsangpick_products');
    localStorage.removeItem('sinsangpick_banners');
    localStorage.removeItem('sinsangpick_battle_config');
    localStorage.removeItem('sinsangpick_events');
    localStorage.removeItem('sinsangpick_notifications');
    localStorage.removeItem('sinsangpick_all_profiles');
    localStorage.removeItem('sinsangpick_point_transactions');
    localStorage.removeItem(PENDING_PRODUCTS_STORAGE_KEY);
    localStorage.removeItem(LAST_CRAWL_STORAGE_KEY);
    showToast('🔄 모든 데이터가 기본값으로 초기화되었습니다.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        products,
        reviews,
        communityPosts,
        banners,
        battleConfig,
        battleChoice,
        voteBattle,
        events,
        selectedEventId,
        selectedEvent,
        notifications,
        unreadNotificationCount,
        incomingPush,
        activeTab,
        previousTab,
        selectedCategory,
        selectedBrand,
        selectedProduct,
        selectedProductId,
        bookmarkedIds,
        comparedIds,
        alertCategories,
        searchQuery,
        recentSearches,
        userPoints: currentUser.points,
        toasts,
        currentUser,
        isSupabaseConnected,

        setActiveTab,
        goBack,
        setSelectedCategory,
        setSelectedBrand,
        openBrandDetail,
        openProductDetail,
        openEventDetail,
        toggleBookmark,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        toggleAlertCategory,
        setSearchQuery,
        addRecentSearch,
        removeRecentSearch,
        clearRecentSearches,
        recordSearchInflux,
        showToast,
        removeToast,
        updateUserNickname,
        loginWithApple,
        loginWithGoogle,
        loginWithKakao,
        logout,
        deleteAccount,
        isLoginModalOpen,
        setIsLoginModalOpen,
        openLoginModal,

        // Events & Push Notifications
        addEvent,
        updateEvent,
        deleteEvent,
        participateInEvent,
        sendPushNotification,
        dismissIncomingPush,
        markNotificationAsRead,
        clearAllNotifications,

        // Admin Actions
        addBanner,
        updateBanner,
        deleteBanner,
        toggleBannerActive,
        moveBannerOrder,
        setBannerOrder,
        duplicateBanner,
        reorderBanners,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductToday,
        toggleProductHot,
        updateBattleConfig,
        resetAllDataToDefaults,

        // Admin Pending Products & Crawler Actions
        pendingProducts,
        pendingCount: pendingProducts.filter(p => p.status === 'pending').length,
        isCrawling,
        lastCrawledDate,
        runDailyCrawler,
        searchAndCollect,
        approvePendingProduct,
        approveAllPending,
        rejectPendingProduct,
        rejectAllPending,
        revokeApprovedProduct,
        revokeAllApprovedProducts,
        removeDuplicatePending,
        revalidateAllPending,
        updatePendingProduct,
        clearAllPendingProducts,
        addPendingProduct,

        // User & Points Management
        allProfiles,
        pointTransactions,
        grantUserPoints,
        revokeUserPoints,
        batchGrantPoints,
        batchRevokePoints,
        fetchAllProfiles,

        submitReview,
        toggleLikeReview,
        addReviewComment,
        addCommunityPost,
        toggleLikePost,
        addPostComment,
        deleteReview,
        deleteCommunityPost,

        // 📅 Calendar & 🏷️ Sale Promotions & 🥪 Recipes
        calendarItems,
        calendarReminders,
        toggleCalendarReminder,
        salePromotions,
        savedSaleIds,
        toggleSaveSale,
        recipes,
        selectedRecipe,
        isRecipeDetailOpen,
        openRecipeDetail,
        closeRecipeDetail,
        isWriteRecipeOpen,
        openWriteRecipe,
        closeWriteRecipe,
        toggleRecipeLike,
        addRecipePost,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
