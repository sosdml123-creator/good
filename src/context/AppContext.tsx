import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { POINT_POLICY, claimDailyReward } from '../constants/pointPolicy';
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
  WriteRecipeInput,
  BrandInfo,
  StoreChannelInfo,
  ReportItem,
  ReportAction,
  UserAccountStatus,
  HomeSectionConfig,
  HomeSectionId,
  ProductEditRequest,
  PurchasedECoupon
} from '../types';
import type { ReviewExtraData } from '../types';
import { BattleRound, fetchBattleRound, submitBattleVote } from '../services/battleService';
import { INITIAL_PRODUCTS, INITIAL_BANNERS, INITIAL_BATTLE_CONFIG, INITIAL_EVENTS, INITIAL_NOTIFICATIONS, INITIAL_HOME_SECTIONS } from '../data/mockProducts';
import { OFFICIAL_MENU_PRODUCTS } from '../data/officialMenuProducts';
import { INITIAL_CALENDAR_ITEMS } from '../data/mockCalendar';
import { INITIAL_STORE_CHANNELS } from '../data/mockStores';
import { INITIAL_RECIPES } from '../data/mockRecipes';
import { INITIAL_REVIEWS } from '../data/mockReviews';
import { INITIAL_COMMUNITY_POSTS } from '../data/mockCommunity';
import { INITIAL_REPORTS } from '../data/mockReports';
import { INITIAL_PRODUCT_EDIT_REQUESTS } from '../data/mockProductEdits';
import { exchangeCoupon, fetchMyCoupons, setCouponUsed } from '../services/couponApi';
import { POPULAR_BRANDS } from '../utils/brandData';
import {
  fetchPendingProducts,
  collectPendingProducts,
  addPendingItems,
  updatePendingItem,
  setPendingStatus,
  approvePendingItems,
  PendingApiError,
  CollectSource,
  CollectReport
} from '../services/pendingProductsService';
import { fetchKamisDailyPrices, applyKamisPricesToProducts } from '../services/kamisApi';
import {
  supabase,
  isSupabaseConfigured,
  ensureSupabaseAuth,
  signInWithGoogle as supabaseSignInWithGoogle,
  signInWithApple as supabaseSignInWithApple,
  signInWithKakao as supabaseSignInWithKakao,
  signOutSupabase,
  deleteCurrentUserAccount,
  handleAuthCallbackUrl,
  DBProduct,
  DBReview,
  DBCommunityPost,
  DBReviewComment,
  DBPostComment
} from '../services/supabase';
import {
  fetchRemoteContent,
  adminApi,
  AdminApiResult,
  saveRemoteContent,
  saveRemoteProducts,
  deleteRemoteProducts,
  deleteRemoteReview,
  deleteRemoteCommunityPost,
  updateRemoteReview,
  updateRemoteCommunityPost,
  SYSTEM_BANNER_RECORD_ID
} from '../services/siteContentService';
import { isAdminSession, getAdminAuthHeaders } from '../services/adminAuth';
import { getActiveSalePromotions } from '../utils/salePeriod';
import { App as CapacitorApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { 
  requestPushPermission as requestPushPermissionService,
  initPushNotifications,
  subscribeToNotifications,
  fetchNotificationsFromSupabase,
  sendAdminPushNotification,
  deleteDeviceToken
} from '../services/notificationService';

import { getSearchInfluxCount } from '../utils/ranking';
import { isAgriMarineProduct, getProductIllustration } from '../utils/productIllustrations';
import { DEFAULT_AVATAR, isValidCustomPhoto, isKakaoOrSocialRawAvatar, extractProviderFromAvatar, getProviderLogoUrl } from '../utils/avatars';
import { getProductCode, findProductByCodeOrId, generateNextProductCode } from '../utils/productCode';
import { withTimeout, parseNetworkError } from '../utils/networkUtils';

interface AppContextType {
  products: Product[];
  reviews: Review[];
  communityPosts: CommunityPost[];
  banners: BannerItem[];
  battleConfig: BattleConfig;
  /** 이번 주 신상 배틀 (서버 기준). 불러오기 전이거나 대결이 없으면 null */
  battleRound: BattleRound | null;
  battleChoice: 'A' | 'B' | null;
  battleVoteError: string | null;
  voteBattle: (choice: 'A' | 'B') => void;
  refreshBattleRound: () => Promise<void>;
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
  networkError: string | null;
  isDataLoading: boolean;
  retrySync: () => Promise<void>;

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
  updateUserPhoto: (newPhotoURL: string) => Promise<void>;
  updateUserProfile: (updates: { displayName?: string; photoURL?: string }) => Promise<void>;
  loginWithApple: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithKakao: () => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  openLoginModal: () => void;
  isGuestBrowse: boolean;
  setIsGuestBrowse: (val: boolean) => void;
  isNicknameModalOpen: boolean;
  setIsNicknameModalOpen: (open: boolean) => void;
  completeNicknameSetup: (newNickname: string) => Promise<void>;
  isPermissionModalOpen: boolean;
  setIsPermissionModalOpen: (open: boolean) => void;
  openPermissionModal: () => void;

  // Events & Push Notifications Actions
  pushPermissionStatus: 'granted' | 'denied' | 'prompt';
  requestPushPermission: () => Promise<boolean>;
  refreshNotifications: () => Promise<void>;
  deleteNotification: (id: string) => void;
  addEvent: (eventData: Omit<PromotionEvent, 'id' | 'createdAt' | 'participantsCount' | 'isParticipated'>) => void;
  updateEvent: (id: string, updated: Partial<PromotionEvent>) => void;
  deleteEvent: (id: string) => void;
  reorderEvents: (newEvents: PromotionEvent[]) => void;
  participateInEvent: (eventId: string) => void;
  sendPushNotification: (notif: { title: string; body: string; type: 'event' | 'product' | 'notice'; targetId: string; imageUrl?: string; badge?: string; tokens?: string[] }) => void;
  dismissIncomingPush: () => void;
  alertCenterSubTab: 'inbox' | 'settings';
  setAlertCenterSubTab: (tab: 'inbox' | 'settings') => void;
  openNotificationCenter: (tab?: 'inbox' | 'settings') => void;
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
  deleteProducts: (ids: string[]) => void;
  deletedProductIds: string[];
  toggleProductToday: (id: string) => void;
  toggleProductHot: (id: string) => void;

  // Admin Battle Actions
  updateBattleConfig: (config: Partial<BattleConfig>) => void;

  // Admin Home Sections Actions
  homeSections: HomeSectionConfig[];
  updateHomeSection: (id: HomeSectionId, updates: Partial<HomeSectionConfig>) => void;
  reorderHomeSections: (sections: HomeSectionConfig[]) => void;
  toggleHomeSectionVisibility: (id: HomeSectionId) => void;
  resetHomeSections: () => void;

  // 신제품 수집·승인 대기함 (Admin)
  pendingProducts: PendingProduct[];
  pendingCount: number;
  pendingSetupError: string | null;
  isNaverCollectAvailable: boolean;
  refreshPendingProducts: () => Promise<void>;
  collectNewProducts: (source: CollectSource, query?: string) => Promise<CollectReport[]>;
  approvePendingProducts: (pendingIds: string[]) => Promise<number>;
  rejectPendingProducts: (pendingIds: string[]) => Promise<void>;
  updatePendingProduct: (pendingId: string, updated: Partial<PendingProduct>) => Promise<boolean>;
  addPendingProduct: (item: PendingProduct) => Promise<boolean>;
  revokeApprovedProduct: (productId: string) => Promise<void>;
  revokeAllApprovedProducts: (ids: string[]) => Promise<void>;

  // KAMIS Agricultural & Marine Product Live Prices Actions
  kamisPriceStatus: {
    lastUpdated: string | null;
    isUpdating: boolean;
    count: number;
    latestDate: string | null;
  };
  refreshKamisPrices: (force?: boolean) => Promise<{ count: number; latestDate: string }>;

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

  // User & Moderation Actions
  updateReview: (reviewId: string, updatedData: Partial<Review>) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  updateCommunityPost: (postId: string, updatedData: Partial<CommunityPost>) => Promise<void>;
  deleteCommunityPost: (postId: string) => Promise<void>;

  // User & Points Management (Admin & App)
  allProfiles: UserProfile[];
  pointTransactions: PointTransaction[];
  grantUserPoints: (userId: string, amount: number, reason: string, memo?: string) => Promise<void>;
  revokeUserPoints: (userId: string, amount: number, reason: string, memo?: string) => Promise<void>;
  batchGrantPoints: (userIds: string[], amount: number, reason: string, memo?: string) => Promise<void>;
  batchRevokePoints: (userIds: string[], amount: number, reason: string, memo?: string) => Promise<void>;
  fetchAllProfiles: () => Promise<void>;
  recordUserActivity: (uid?: string) => void;
  deleteUserByAdmin: (userId: string) => Promise<void>;
  batchDeleteUsersByAdmin: (userIds: string[]) => Promise<void>;
  isNicknameTaken: (nickname: string, excludeUid?: string) => boolean;
  updateUserStatus: (
    userId: string,
    newStatus: UserAccountStatus,
    options?: { warningDelta?: number; suspendDays?: number; reason?: string; adminMemo?: string }
  ) => Promise<void>;
  batchUpdateUserStatus: (
    userIds: string[],
    newStatus: UserAccountStatus,
    options?: { warningDelta?: number; suspendDays?: number; reason?: string; adminMemo?: string }
  ) => Promise<void>;
  isCurrentUserSuspended: () => { isSuspended: boolean; reason: string; until?: string };

  // 🚨 Reports & Moderation
  reports: ReportItem[];
  submitReport: (reportData: Omit<ReportItem, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  resolveReport: (
    reportId: string, 
    action: ReportAction, 
    actionReason?: string, 
    adminMemo?: string
  ) => Promise<void>;
  dismissReport: (reportId: string, reason?: string, adminMemo?: string) => Promise<void>;
  deleteReport: (reportId: string) => Promise<void>;

  // ✏️ Product Edit Requests (제품 수정 요청)
  productEditRequests: ProductEditRequest[];
  submitProductEditRequest: (
    requestData: Omit<ProductEditRequest, 'id' | 'createdAt' | 'status'>
  ) => Promise<boolean>;
  resolveProductEditRequest: (
    requestId: string,
    adminMemo?: string
  ) => Promise<void>;
  rejectProductEditRequest: (
    requestId: string,
    adminMemo?: string
  ) => Promise<void>;
  deleteProductEditRequest: (requestId: string) => Promise<void>;

  // 🏢 Brands Management (Admin & App)
  brands: BrandInfo[];
  addBrand: (brand: Omit<BrandInfo, 'id'> & { id?: string }) => void;
  updateBrand: (id: string, updated: Partial<BrandInfo>) => void;
  deleteBrand: (id: string) => void;
  toggleBrandPopular: (id: string) => void;

  // 🏪 Store Channels Master Management (Admin & App)
  storeChannels: StoreChannelInfo[];
  addStoreChannel: (store: Omit<StoreChannelInfo, 'id' | 'order'> & { id?: string; order?: number }) => void;
  updateStoreChannel: (id: string, updated: Partial<StoreChannelInfo>) => void;
  deleteStoreChannel: (id: string) => void;
  toggleStoreChannelActive: (id: string) => void;

  // 📅 Calendar
  calendarItems: ReleaseCalendarItem[];
  calendarReminders: string[];
  toggleCalendarReminder: (calendarItemId: string) => void;
  addCalendarItem: (item: Omit<ReleaseCalendarItem, 'id'> & { id?: string }) => void;
  updateCalendarItem: (id: string, updated: Partial<ReleaseCalendarItem>) => void;
  deleteCalendarItem: (id: string) => void;

  // 🏷️ Sale Promotions (1+1 & 할인특가 행사소식)
  salePromotions: SalePromotionItem[];
  savedSaleIds: string[];
  toggleSaveSale: (saleId: string) => void;
  addSalePromotion: (item: Omit<SalePromotionItem, 'id' | 'likeCount'> & { id?: string; likeCount?: number }) => void;
  addSalePromotionsBatch: (items: SalePromotionItem[]) => void;
  updateSalePromotion: (id: string, updated: Partial<SalePromotionItem>) => void;
  deleteSalePromotion: (id: string) => void;
  toggleSaleHot: (id: string) => void;
  /** 편의점 공식 행사상품을 지금 다시 수집해 서버 목록을 갱신 (종료된 행사 정리 포함) */
  refreshSalePromotionsFromStores: () => Promise<void>;

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

  // Global Remote Content Sync
  isContentSyncing: boolean;
  syncAllContentToCloud: () => Promise<void>;
  adminSaveError: string | null;
  clearAdminSaveError: () => void;
  initAdminSession: () => Promise<void>;
  refreshRemoteContent: () => Promise<void>;

  // 🎁 e쿠폰 스토어 (Point Shop)
  purchasedCoupons: PurchasedECoupon[];
  refreshPurchasedCoupons: () => Promise<void>;
  purchaseCoupon: (goodsCode: string) => Promise<PurchasedECoupon | null>;
  applyServerPoints: (balance?: number | null) => void;
  useCoupon: (purchasedCouponId: string) => Promise<void>;
  addTestPoints: (amount?: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper for calculating user level based on points
export const calculateLevel = (points: number): string => {
  const levelNum = Math.max(1, Math.min(10, Math.floor(points / 200) + 1));
  return `Lv.${levelNum}`;
};

/**
 * 유저의 로그인 제공자(Provider)를 스마트하게 판별하는 헬퍼 함수
 */
export const inferUserProvider = (user?: { 
  provider?: string; 
  email?: string; 
  uid?: string; 
  id?: string; 
  app_metadata?: any;
  user_metadata?: any;
  identities?: any[];
  is_anonymous?: boolean;
  avatar_url?: string;
  photoURL?: string;
  displayName?: string;
  display_name?: string;
} | null): 'apple' | 'google' | 'kakao' | 'email' | 'anonymous' => {
  if (!user) return 'anonymous';

  // 0. avatar_url / photoURL 내 ?prov=apple, ?prov=kakao 힌트 확인 (DB 스키마 독립적 최우선 판별)
  const avatarProv = extractProviderFromAvatar((user as any)?.avatar_url || (user as any)?.photoURL);
  if (avatarProv) return avatarProv;

  // 1. 이미 명확한 소셜/이메일 프로바이더가 지정되어 있는 경우 (anonymous 제외 우선 판별)
  if (user.provider && ['apple', 'google', 'kakao', 'email'].includes(user.provider)) {
    return user.provider as any;
  }

  // 2. app_metadata 확인
  const appProvider = user.app_metadata?.provider;
  if (appProvider && ['apple', 'google', 'kakao', 'email'].includes(appProvider)) {
    return appProvider as any;
  }
  const appProviders = user.app_metadata?.providers;
  if (Array.isArray(appProviders)) {
    if (appProviders.includes('kakao')) return 'kakao';
    if (appProviders.includes('apple')) return 'apple';
    if (appProviders.includes('google')) return 'google';
    if (appProviders.includes('email')) return 'email';
  }

  // 3. identities 확인 (Supabase OAuth identities)
  if (Array.isArray(user.identities) && user.identities.length > 0) {
    const identProviders = user.identities.map(i => (i.provider || '').toLowerCase());
    if (identProviders.some(p => p.includes('kakao'))) return 'kakao';
    if (identProviders.some(p => p.includes('apple'))) return 'apple';
    if (identProviders.some(p => p.includes('google'))) return 'google';
    if (identProviders.some(p => p.includes('email'))) return 'email';
  }

  // 4. user_metadata 확인 (OAuth 제공자 식별자 및 issuer)
  const userMeta = user.user_metadata;
  if (userMeta) {
    const metaProvider = (userMeta.provider || userMeta.iss || '').toLowerCase();
    if (metaProvider.includes('kakao')) return 'kakao';
    if (metaProvider.includes('apple')) return 'apple';
    if (metaProvider.includes('google')) return 'google';
    if (userMeta.kakao_account || (userMeta.avatar_url && String(userMeta.avatar_url).includes('kakaocdn.net'))) return 'kakao';
  }

  // 5. 이메일 주소 도메인 분석
  const email = (user.email || '').toLowerCase();
  if (email.includes('privaterelay.appleid.com') || email.includes('@apple.') || email.includes('appleid')) return 'apple';
  if (email.includes('kakao.com') || email.includes('daum.net') || email.includes('kakao')) return 'kakao';
  if (email.includes('gmail.com') || email.includes('google')) return 'google';
  if (email.includes('@')) return 'email';

  // 6. ID 접두사 분석 (apple_xxx, kakao_xxx, google_xxx 등)
  const idStr = (user.uid || user.id || '').toLowerCase();
  if (idStr.startsWith('apple_') || idStr.includes('apple')) return 'apple';
  if (idStr.startsWith('kakao_') || idStr.includes('kakao')) return 'kakao';
  if (idStr.startsWith('google_') || idStr.includes('google')) return 'google';

  // 7. 기존 DB 레코드 특성(과거 카카오 연동 시 실명("서현정", "이예진") 및 Unsplash 더미 사진이 등록된 계정)
  const nameVal = (user as any)?.display_name || (user as any)?.displayName || '';
  if (nameVal === '서현정' || nameVal === '이예진') return 'kakao';

  // 8. Explicit Anonymous user
  if (user.is_anonymous === true || user.provider === 'anonymous') {
    return 'anonymous';
  }

  return 'anonymous';
};

/**
 * DB profiles 레코드와 기존 메모리 상태, 현재 로그인 유저 상태를 종합하여
 * 정확한 Provider를 도출하는 헬퍼 함수
 */
export const resolveUserProfileProvider = (
  dbItem: any,
  prevProfile?: UserProfile,
  currentLoggedInUser?: UserProfile
): 'apple' | 'google' | 'kakao' | 'email' | 'anonymous' => {
  const targetUid = dbItem?.id || dbItem?.uid || prevProfile?.uid;

  // 1. 현재 로그인 세션 사용자 본인이고, 소셜 로그인이 되어 있는 경우 최우선 보장
  if (currentLoggedInUser && currentLoggedInUser.uid === targetUid) {
    if (currentLoggedInUser.provider && ['apple', 'kakao', 'google', 'email'].includes(currentLoggedInUser.provider)) {
      return currentLoggedInUser.provider as any;
    }
  }

  // 2. avatar_url 내 ?prov=apple, ?prov=kakao 힌트 확인 (DB 스키마 독립적)
  const avatarProv = extractProviderFromAvatar(dbItem?.avatar_url || prevProfile?.photoURL);
  if (avatarProv) return avatarProv;

  // 3. DB 레코드의 provider가 소셜/이메일 프로바이더인 경우
  if (dbItem?.provider && ['apple', 'kakao', 'google', 'email'].includes(dbItem.provider)) {
    return dbItem.provider as any;
  }

  // 4. 기존 allProfiles 메모리에 유효한 소셜 프로바이더가 기록되어 있던 경우 (DB 기본값 anonymous로 인한 덮어씌움 방지)
  if (prevProfile?.provider && ['apple', 'kakao', 'google', 'email'].includes(prevProfile.provider)) {
    return prevProfile.provider as any;
  }

  // 5. dbItem 객체에 포함된 단서(이메일, id 접두사 등)로 스마트 추론
  const inferredFromDb = inferUserProvider(dbItem);
  if (inferredFromDb && inferredFromDb !== 'anonymous') {
    return inferredFromDb;
  }

  // 6. prevProfile 객체에 포함된 단서로 스마트 추론
  // 7. 실명("서현정", "이예진") 등 과거 카카오 연동 흔적 확인
  const nameVal = dbItem?.display_name || prevProfile?.displayName || '';
  if (nameVal === '서현정' || nameVal === '이예진') return 'kakao';

  // 8. DB profiles 테이블의 실제 UUID 레코드 판별
  // 게스트는 profiles 테이블에 레코드가 존재하지 않으므로, profiles의 UUID 레코드는 100% 소셜 가입 회원입니다.
  const idStr = String(targetUid || '').toLowerCase();
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(idStr)) {
    const av = String(dbItem?.avatar_url || prevProfile?.photoURL || '').toLowerCase();
    if (av.includes('kakaocdn') || av.includes('kakao') || av.includes('unsplash')) {
      return 'kakao';
    }
    // 기본 로고나 신상러버 닉네임으로 등록된 레코드는 Apple 로그인
    return 'apple';
  }

  return 'anonymous';
};

/**
 * DB에 provider나 email 컬럼이 없어도 400 에러 없이
 * id, display_name, avatar_url을 100% 안전하게 저장하고,
 * avatar_url에 ?prov=kakao / ?prov=apple 메타를 심어 스키마 독립적으로 provider를 영구 보존하는 헬퍼
 */
export const safeUpsertProfile = async (
  client: any,
  profileData: {
    id: string;
    display_name: string;
    avatar_url: string;
    points?: number;
    level?: string;
    provider?: string;
    email?: string;
  }
): Promise<boolean> => {
  if (!client) return false;

  // 1. avatar_url에 provider 힌트 안전하게 합성 (예: /logo.png?prov=kakao)
  let enrichedAvatar = profileData.avatar_url || DEFAULT_AVATAR;
  if (profileData.provider && ['apple', 'kakao', 'google'].includes(profileData.provider)) {
    if (!enrichedAvatar.includes('prov=')) {
      const sep = enrichedAvatar.includes('?') ? '&' : '?';
      enrichedAvatar = `${enrichedAvatar}${sep}prov=${profileData.provider}`;
    }
  }

  // 2. DB에 100% 존재하는 기본 컬럼만으로 100% 확실한 1차 upsert 수행
  const basePayload: any = {
    id: profileData.id,
    display_name: profileData.display_name,
    avatar_url: enrichedAvatar,
    updated_at: new Date().toISOString(),
  };
  if (typeof profileData.points === 'number') basePayload.points = profileData.points;
  if (profileData.level) basePayload.level = profileData.level;

  let success = false;
  try {
    const { error } = await client.from('profiles').upsert(basePayload, { onConflict: 'id' });
    if (!error) success = true;
    else console.warn('[safeUpsertProfile] base upsert warning:', error.message);
  } catch (e) {
    console.warn('[safeUpsertProfile] base upsert exception:', e);
  }

  // 3. 만약 DB에 provider 또는 email 컬럼이 추가된 환경이라면 확장 필드도 조용히 update 시도
  if (profileData.provider || profileData.email) {
    try {
      const extraPayload: any = {};
      if (profileData.provider) extraPayload.provider = profileData.provider;
      if (profileData.email) extraPayload.email = profileData.email;
      Promise.resolve(client.from('profiles').update(extraPayload).eq('id', profileData.id)).catch(() => {});
    } catch {
      // DB 컬럼 미존재 시 무시 (400 방어)
    }
  }

  return success;
};

// 실제 회원 프로필 및 포인트 거래 내역만 Supabase profiles DB 및 실제 사용자 활동에 의해 동적으로 적립/기록됩니다.
export const INITIAL_USER_PROFILES: UserProfile[] = [];

export const INITIAL_POINT_TRANSACTIONS: PointTransaction[] = [];


/**
 * Synchronously resolves or generates an initial sequential unique nickname for instant boot
 */
const getInitialSequentialNicknameSync = (): string => {
  const cachedName = localStorage.getItem('sinsangpick_name');
  if (
    cachedName &&
    !cachedName.includes('사용자') &&
    cachedName !== '신상러버' &&
    !/^신상러버_[a-z0-9]{4}$/i.test(cachedName)
  ) {
    return cachedName;
  }

  const existingNumbers = new Set<number>();
  try {
    const lastCounter = localStorage.getItem('sinsangpick_last_nickname_seq');
    if (lastCounter) {
      const num = parseInt(lastCounter, 10);
      if (!isNaN(num)) existingNumbers.add(num);
    }
    const raw = localStorage.getItem('sinsangpick_all_profiles');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const p of parsed) {
          const name = p.displayName || p.display_name;
          if (name) {
            const match = String(name).match(/^신상러버_(\d+)$/);
            if (match) {
              const num = parseInt(match[1], 10);
              if (!isNaN(num)) existingNumbers.add(num);
            }
          }
        }
      }
    }
  } catch {}

  let nextNum = 1;
  if (existingNumbers.size > 0) {
    nextNum = Math.max(...Array.from(existingNumbers)) + 1;
  }
  while (existingNumbers.has(nextNum)) {
    nextNum++;
  }

  localStorage.setItem('sinsangpick_last_nickname_seq', String(nextNum));
  const formattedSeq = String(nextNum).padStart(3, '0');
  const name = `신상러버_${formattedSeq}`;
  localStorage.setItem('sinsangpick_name', name);
  return name;
};

/**
 * Generates the next sequential, strictly unique nickname (신상러버_001, 신상러버_002, ...)
 * Scans DB profiles, in-memory profiles, and localStorage to guarantee zero duplication.
 */
export const getNextSequentialNickname = async (
  supabaseClient?: any,
  localProfiles?: UserProfile[]
): Promise<string> => {
  const existingNumbers = new Set<number>();

  // 1. In-memory profile check
  if (localProfiles && localProfiles.length > 0) {
    for (const p of localProfiles) {
      if (p.displayName) {
        const match = p.displayName.match(/^신상러버_(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num)) existingNumbers.add(num);
        }
      }
    }
  }

  // 2. localStorage check
  try {
    const raw = localStorage.getItem('sinsangpick_all_profiles');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const p of parsed) {
          const name = p.displayName || p.display_name;
          if (name) {
            const match = String(name).match(/^신상러버_(\d+)$/);
            if (match) {
              const num = parseInt(match[1], 10);
              if (!isNaN(num)) existingNumbers.add(num);
            }
          }
        }
      }
    }
    const lastCounter = localStorage.getItem('sinsangpick_last_nickname_seq');
    if (lastCounter) {
      const num = parseInt(lastCounter, 10);
      if (!isNaN(num)) existingNumbers.add(num);
    }
  } catch {}

  // 3. Supabase profiles DB query
  if (supabaseClient) {
    try {
      const { data: dbProfiles } = await supabaseClient
        .from('profiles')
        .select('display_name');
      if (dbProfiles && Array.isArray(dbProfiles)) {
        for (const p of dbProfiles) {
          if (p.display_name) {
            const match = String(p.display_name).match(/^신상러버_(\d+)$/);
            if (match) {
              const num = parseInt(match[1], 10);
              if (!isNaN(num)) existingNumbers.add(num);
            }
          }
        }
      }
    } catch (e) {
      console.warn('[Supabase Profile Nickname Query Error]', e);
    }
  }

  // 4. Calculate next strictly unique number
  let nextNum = 1;
  if (existingNumbers.size > 0) {
    nextNum = Math.max(...Array.from(existingNumbers)) + 1;
  }
  while (existingNumbers.has(nextNum)) {
    nextNum++;
  }

  localStorage.setItem('sinsangpick_last_nickname_seq', String(nextNum));
  const formattedSeq = String(nextNum).padStart(3, '0');
  return `신상러버_${formattedSeq}`;
};

/**
 * Extracts all potential real names/nicknames provided by OAuth (Kakao, Google, etc.)
 * to prevent real name leakage and enforce random nicknames like Apple login
 */
export const getSocialRealNames = (user: any): string[] => {
  if (!user) return [];
  const meta = user.user_metadata || {};
  return [
    meta.full_name,
    meta.name,
    meta.nickname,
    meta.preferred_username,
    meta.user_name,
    user.email ? user.email.split('@')[0] : null,
  ].filter((n): n is string => Boolean(n && typeof n === 'string' && n.trim().length > 0));
};

/**
 * Checks if a nickname is invalid, a social real name, or an unformatted fallback
 */
export const isInvalidOrSocialRealName = (displayName?: string | null, user?: any): boolean => {
  if (!displayName || typeof displayName !== 'string') return true;
  const trimmed = displayName.trim();
  if (trimmed.length === 0) return true;
  if (
    trimmed.includes('사용자') ||
    trimmed === '신상러버' ||
    trimmed === '서현정' ||
    trimmed === '이예진' ||
    /^신상러버_[a-z0-9]{4}$/i.test(trimmed)
  ) {
    return true;
  }
  if (user) {
    const socialNames = getSocialRealNames(user);
    if (socialNames.includes(trimmed)) return true;
  }
  return false;
};

/**
 * Checks if a given avatar URL originates from Kakao CDN or is a Kakao social profile image
 */
export const isKakaoAvatarUrl = (url?: string | null): boolean => {
  if (!url || typeof url !== 'string') return false;
  return /kakaocdn\.net|kakao\.com|daumcdn\.net/i.test(url);
};

// Initial User Profile
const createInitialUser = (): UserProfile => {
  const cachedUid = localStorage.getItem('sinsangpick_uid');
  const cachedPoints = localStorage.getItem('sinsangpick_points');
  const cachedPhoto = localStorage.getItem('sinsangpick_photo');
  const cachedName = localStorage.getItem('sinsangpick_name');

  const uid = cachedUid || `anon_${Math.random().toString(36).substring(2, 9)}`;
  if (!cachedUid) localStorage.setItem('sinsangpick_uid', uid);

  const points = cachedPoints ? parseInt(cachedPoints, 10) : 100;
  const displayName = cachedName || getInitialSequentialNicknameSync();
  const photoURL = (cachedPhoto && isValidCustomPhoto(cachedPhoto, cachedUid)) ? cachedPhoto : DEFAULT_AVATAR;

  return {
    uid,
    displayName,
    photoURL,
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
    createdAt: dbP.created_at,
    price: dbP.price,
    // 0 은 DB 기본값이라 "할인 없음"과 구분되지 않으므로 값이 있을 때만 사용
    discountRate: dbP.discount_rate ? dbP.discount_rate : undefined,
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
  code: (dbP as any).code || undefined,
  spiciness: (dbP as any).spiciness || undefined,
  buyLink: (dbP as any).buy_link || undefined,
  sourceName: (dbP as any).source_name || undefined,
  sourceUrl: (dbP as any).source_url || undefined,
  searchInfluxCount: (dbP as any).search_influx_count || undefined,
  produceDetails: (dbP as any).produce_details || (dbP as any).produceDetails || undefined,
  };
};

// DB 에 값이 없는 항목(null/빈 문자열)이 기본 상품 정보를 지우지 않도록 걸러냅니다.
const definedOnly = <T extends object>(obj: T): Partial<T> =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ) as Partial<T>;

// 관리자가 어드민에서 고칠 수 있는 상품 항목 (기기에만 남은 수정분을 찾을 때 비교)
const ADMIN_EDITABLE_PRODUCT_FIELDS: (keyof Product)[] = [
  'name', 'brand', 'category', 'subCategory', 'itemType', 'price', 'discountRate', 'description',
  'stores', 'calories', 'volume', 'isToday', 'isHot', 'releaseDate', 'image', 'nutrition',
  'ingredients', 'allergens', 'origin', 'manufacturer', 'storageMethod', 'shelfLife', 'precautions', 'buyLink',
];

// DB(JSONB)는 객체 키 순서를 바꿔 돌려주므로 키를 정렬해 비교합니다.
const sortKeysDeep = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== undefined && v !== null)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, sortKeysDeep(v)])
    );
  }
  return value;
};

const normalizeForDiff = (value: unknown): string => {
  if (value === undefined || value === null || value === '' || value === 0 || value === false) return '';
  if (Array.isArray(value) && value.length === 0) return '';
  return typeof value === 'object' ? JSON.stringify(sortKeysDeep(value)) : String(value);
};

export const hasAdminEditDiff = (local: Product, base: Product): boolean =>
  ADMIN_EDITABLE_PRODUCT_FIELDS.some(field => {
    if (field === 'image' && isAgriMarineProduct(local)) return false;
    return normalizeForDiff(local[field]) !== normalizeForDiff(base[field]);
  });

const mapDBReviewToReview = (dbR: DBReview, isLiked: boolean, comments: ReviewComment[]): Review => ({
  id: dbR.id,
  productId: dbR.product_id,
  productName: dbR.product_name,
  productImage: dbR.product_image,
  userName: dbR.user_name,
  userAvatar: dbR.user_avatar || DEFAULT_AVATAR,
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
  authorAvatar: dbP.author_avatar || DEFAULT_AVATAR,
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

/**
 * Smart merge function for banners:
 * When remote/stored banners exist (from server DB or admin action), they represent the single source of truth.
 * INITIAL_BANNERS is only used as an offline/first-install fallback when no stored banners exist.
 */
export const smartMergeBanners = (
  storedBanners: BannerItem[] | null,
  initialBanners: BannerItem[],
  deletedBannerIds: string[] = []
): BannerItem[] => {
  const deletedSet = new Set(deletedBannerIds);

  // If storedBanners is explicitly provided (from server DB or user admin), that is the source of truth!
  if (storedBanners && Array.isArray(storedBanners)) {
    const validStored = storedBanners.filter(b => !deletedSet.has(b.id));
    return normalizeBanners(validStored);
  }

  // Fallback: only when there is no remote/stored banners at all (pure initial offline state)
  const validInitial = initialBanners.filter(b => !deletedSet.has(b.id));
  return normalizeBanners(validInitial);
};

/**
 * Synchronize product overallRating, ratingCount, detailedRating, and metrics with actual consumer reviews.
 * Products with 0 reviews will strictly have ratingCount = 0, overallRating = 0, detailedRating = all 0s, and bestQuotes = [].
 * Products with reviews will have their ratings, counts, and detailed categories computed dynamically from real user submissions.
 */
export const syncProductRatingsWithReviews = (prods: Product[], revs: Review[]): Product[] => {
  if (!prods || prods.length === 0) return prods;
  const statsMap = new Map<string, {
    count: number;
    totalRating: number;
    tasteTotal: number;
    valueTotal: number;
    portionTotal: number;
    repurchaseTotal: number;
    positiveCount: number;
    quotes: string[];
  }>();

  for (const r of (revs || [])) {
    if (!r || !r.productId) continue;
    const cur = statsMap.get(r.productId) || {
      count: 0,
      totalRating: 0,
      tasteTotal: 0,
      valueTotal: 0,
      portionTotal: 0,
      repurchaseTotal: 0,
      positiveCount: 0,
      quotes: [],
    };
    const ratingVal = typeof r.rating === 'number' && !isNaN(r.rating) ? r.rating : 5;
    cur.count += 1;
    cur.totalRating += ratingVal;

    // Detailed rating aggregation from review
    const dTaste = (r.detailedRating && typeof r.detailedRating.taste === 'number') ? r.detailedRating.taste : ratingVal;
    const dValue = (r.detailedRating && typeof r.detailedRating.value === 'number') ? r.detailedRating.value : ratingVal;
    const dPortion = (r.detailedRating && typeof r.detailedRating.portion === 'number') ? r.detailedRating.portion : ratingVal;
    const dRepurchase = (r.detailedRating && typeof r.detailedRating.repurchase === 'number') ? r.detailedRating.repurchase : ratingVal;

    cur.tasteTotal += dTaste;
    cur.valueTotal += dValue;
    cur.portionTotal += dPortion;
    cur.repurchaseTotal += dRepurchase;

    if (
      ratingVal >= 4 ||
      r.repurchaseIntent === '무조건 또 사먹어요!' ||
      r.repurchaseIntent === '행사/할인하면 살래요'
    ) {
      cur.positiveCount += 1;
    }

    if (r.content && r.content.trim().length >= 4 && cur.quotes.length < 5) {
      cur.quotes.push(r.content.trim());
    }

    statsMap.set(r.productId, cur);
  }

  let hasChanged = false;
  const updated = prods.map(p => {
    const stats = statsMap.get(p.id);
    const count = stats ? stats.count : 0;
    const rating = count > 0 ? Number((stats!.totalRating / count).toFixed(1)) : 0;
    const detailed = count > 0 ? {
      taste: Number((stats!.tasteTotal / count).toFixed(1)),
      value: Number((stats!.valueTotal / count).toFixed(1)),
      portion: Number((stats!.portionTotal / count).toFixed(1)),
      repurchase: Number((stats!.repurchaseTotal / count).toFixed(1)),
    } : {
      taste: 0,
      value: 0,
      portion: 0,
      repurchase: 0,
    };
    const repPercent = count > 0 ? Math.round((stats!.positiveCount / count) * 100) : 0;
    const quotes = count > 0 ? stats!.quotes : [];

    const curDetailed = p.detailedRating || { taste: 0, value: 0, portion: 0, repurchase: 0 };
    const isSame = 
      (p.ratingCount ?? 0) === count &&
      (p.overallRating ?? 0) === rating &&
      (p.repurchasePercent ?? 0) === repPercent &&
      (curDetailed.taste ?? 0) === detailed.taste &&
      (curDetailed.value ?? 0) === detailed.value &&
      (curDetailed.portion ?? 0) === detailed.portion &&
      (curDetailed.repurchase ?? 0) === detailed.repurchase &&
      JSON.stringify(p.bestQuotes || []) === JSON.stringify(quotes);

    if (isSame) {
      return p;
    }

    hasChanged = true;
    return {
      ...p,
      ratingCount: count,
      overallRating: rating,
      detailedRating: detailed,
      repurchasePercent: repPercent,
      bestQuotes: quotes,
    };
  });
  return hasChanged ? updated : prods;
};

/**
 * Smart merge function for products:
 * Guarantees that official INITIAL_PRODUCTS are always up-to-date with latest metadata
 * (image, price, releaseDate, description, stores, calories, volume, nutrition, isToday, isHot),
 * while initializing all ratings/scores to 0 (unless real reviews are attached).
 */
export const smartMergeProducts = (
  storedProducts: Product[] | null,
  initialProducts: Product[],
  deletedProductIds: string[] = [],
  // 서버(DB)에 있는 상품 ID. 넘기면 해당 상품은 기기에 저장된 값이 아니라 서버 값을 그대로 씁니다.
  serverProductIds?: Set<string>
): Product[] => {
  const deletedSet = new Set(deletedProductIds);
  const validInitial = initialProducts.filter(p => !deletedSet.has(p.id));

  const resetProductRatings = (p: Product): Product => ({
    ...p,
    overallRating: 0,
    ratingCount: 0,
    detailedRating: { taste: 0, value: 0, portion: 0, repurchase: 0 },
    repurchasePercent: 0,
    bestQuotes: [],
  });

  if (!storedProducts || !Array.isArray(storedProducts) || storedProducts.length === 0) {
    return validInitial.map(resetProductRatings);
  }

  const initialMap = new Map<string, Product>();
  validInitial.forEach(p => initialMap.set(p.id, p));

  const storedMap = new Map<string, Product>();
  storedProducts.filter(p => !deletedSet.has(p.id)).forEach(p => storedMap.set(p.id, p));

  // 1. Merge official products preserving admin modifications (name, price, image, stores, nutrition, isToday, isHot, etc.)
  const mergedOfficial: Product[] = validInitial.map(initP => {
    const stored = storedMap.get(initP.id);
    if (stored && serverProductIds?.has(initP.id)) {
      return resetProductRatings({
        ...initP,
        kamisPriceInfo: stored.kamisPriceInfo || initP.kamisPriceInfo,
      });
    }
    if (stored) {
      return resetProductRatings({
        ...initP,
        ...stored,
        // Keep KAMIS price info if available
        kamisPriceInfo: stored.kamisPriceInfo || initP.kamisPriceInfo,
      });
    }
    return resetProductRatings(initP);
  });

  // 2. Keep any custom products added by admin (IDs not in INITIAL_PRODUCTS and not deleted)
  // 서버 기준 모드에서는 서버에 없는(저장되지 않은) 기기 전용 상품을 남기지 않습니다.
  const customProducts = serverProductIds
    ? []
    : storedProducts
        .filter(p => !initialMap.has(p.id) && !deletedSet.has(p.id))
        .map(resetProductRatings);

  return [...customProducts, ...mergedOfficial];
};

const OFFICIAL_MENU_BY_ID = new Map(OFFICIAL_MENU_PRODUCTS.map(p => [p.id, p]));

/**
 * 기기 저장용 상품 목록. 공식 메뉴 상품(수천 건) 중 손대지 않은 것은 번들 데이터에서 그대로 복원되므로
 * 저장에서 빼 localStorage 용량 한도(iOS 약 5MB)를 넘지 않게 합니다.
 */
export const serializeProductsForStorage = (products: Product[]): string =>
  JSON.stringify(products.filter(p => {
    const official = OFFICIAL_MENU_BY_ID.get(p.id);
    if (!official) return true;
    return !(
      p.name === official.name && p.price === official.price && p.image === official.image &&
      p.description === official.description && p.category === official.category &&
      p.subCategory === official.subCategory && !p.isToday && !p.isHot && !p.discountRate &&
      p.searchInfluxCount === undefined && !p.kamisPriceInfo
    );
  }));

/**
 * Smart merge function for home sections
 * Preserves admin custom titles, subtitles, badge texts, item limits, and visibility states!
 */
export const smartMergeHomeSections = (
  storedSections: HomeSectionConfig[] | null,
  initialSections: HomeSectionConfig[]
): HomeSectionConfig[] => {
  if (!storedSections || !Array.isArray(storedSections) || storedSections.length === 0) {
    return initialSections;
  }

  const initialMap = new Map<string, HomeSectionConfig>();
  initialSections.forEach(s => initialMap.set(s.id, s));

  const merged: HomeSectionConfig[] = [];
  storedSections.forEach(stored => {
    const init = initialMap.get(stored.id);
    if (init) {
      const isLegacyAdSubtitle = stored.id === 'ad_banner' && (stored.subtitle?.includes('애드몹') || stored.name?.includes('애드몹'));
      merged.push({
        ...init,
        ...stored,
        name: isLegacyAdSubtitle ? init.name : (stored.name || init.name),
        title: stored.title || init.title,
        subtitle: isLegacyAdSubtitle ? '' : (stored.subtitle !== undefined ? stored.subtitle : init.subtitle),
        badgeText: stored.badgeText !== undefined ? stored.badgeText : init.badgeText,
        itemLimit: stored.itemLimit !== undefined ? stored.itemLimit : init.itemLimit,
        isVisible: stored.isVisible !== undefined ? stored.isVisible : init.isVisible,
      });
    } else {
      merged.push(stored);
    }
  });

  // Append any genuinely missing initial sections (e.g., brand-new sections added in app updates)
  initialSections.forEach(init => {
    if (!merged.some(m => m.id === init.id)) {
      merged.push(init);
    }
  });

  return merged.map((s, idx) => ({ ...s, order: idx + 1 }));
};

export const DATA_VERSION = 'v25_20260920_sync_engine';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(createInitialUser);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const openLoginModal = () => setIsLoginModalOpen(true);
  const [isGuestBrowse, setIsGuestBrowseState] = useState<boolean>(() => localStorage.getItem('sinsangpick_guest_browse') === 'true');
  const setIsGuestBrowse = (val: boolean) => {
    setIsGuestBrowseState(val);
    localStorage.setItem('sinsangpick_guest_browse', String(val));
  };
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState<boolean>(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState<boolean>(false);
  const openPermissionModal = () => setIsPermissionModalOpen(true);

  // Notification Center SubTab Navigation ('inbox' | 'settings')
  const [alertCenterSubTab, setAlertCenterSubTab] = useState<'inbox' | 'settings'>('inbox');
  const openNotificationCenter = (subTab: 'inbox' | 'settings' = 'inbox') => {
    setAlertCenterSubTab(subTab);
    setActiveTabState('alert_settings');
  };

  const checkAndOpenPostLoginModals = (uid: string) => {
    const hasReviewedPermissions = localStorage.getItem('sinsangpick_permissions_reviewed') === 'true';
    if (!hasReviewedPermissions) {
      setIsPermissionModalOpen(true);
    } else {
      const hasSetNickname = localStorage.getItem('sinsangpick_nickname_set_' + uid) === 'true';
      if (!hasSetNickname) {
        setIsNicknameModalOpen(true);
      }
    }
  };

  const completeNicknameSetup = async (newNickname: string) => {
    const uid = currentUser.uid;
    const bonus = POINT_POLICY.nicknameBonus;
    const nextPoints = currentUser.points + bonus;
    localStorage.setItem('sinsangpick_points', nextPoints.toString());
    localStorage.setItem('sinsangpick_nickname_set_' + uid, 'true');
    localStorage.setItem('sinsangpick_custom_nickname_' + uid, 'true');
    localStorage.setItem('sinsangpick_name', newNickname);

    setCurrentUser(prev => ({
      ...prev,
      displayName: newNickname,
      points: nextPoints,
      level: calculateLevel(nextPoints),
    }));

    const newTx: PointTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId: uid,
      userName: newNickname,
      userAvatar: currentUser.photoURL,
      type: 'reward',
      amount: bonus,
      balanceAfter: nextPoints,
      reason: '신규 가입 & 닉네임 설정 웰컴 보너스',
      createdAt: new Date().toLocaleString('ko-KR', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      adminMemo: '신규 회원 닉네임 설정 보너스'
    };
    if (bonus > 0) setPointTransactions(prev => [newTx, ...prev]);

    setIsNicknameModalOpen(false);
    setIsGuestBrowse(true);
    showToast(bonus > 0 ? `🎉 닉네임이 설정되었습니다! 웰컴 ${bonus}P가 지급되었어요!` : '🎉 닉네임이 설정되었습니다!', 'success');

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('profiles').upsert({
          id: uid,
          display_name: newNickname,
          points: nextPoints,
        }, { onConflict: 'id' });
      } catch (err) {
        console.warn('Failed to update profile nickname in Supabase:', err);
      }
    }
  };

  const [isContentSyncing, setIsContentSyncing] = useState<boolean>(false);

  // 관리자 저장 실패 안내 — 토스트가 꺼져 있어 어드민 화면 상단 배너로 알립니다.
  const [adminSaveError, setAdminSaveError] = useState<string | null>(null);
  const clearAdminSaveError = () => setAdminSaveError(null);
  const reportSave = (result: AdminApiResult, label: string): boolean => {
    if (result.ok) return true;
    setAdminSaveError(`[${label}] 서버 반영 실패 — ${result.error || '알 수 없는 오류'}`);
    return false;
  };
  const persistContent = (changes: Parameters<typeof saveRemoteContent>[0], label = '설정') =>
    saveRemoteContent(changes).then(r => reportSave(r, label));
  const persistProducts = (list: Product[]) =>
    saveRemoteProducts(list).then(r => reportSave(r, '상품'));
  const persistProductDelete = (ids: string[]) =>
    deleteRemoteProducts(ids).then(r => reportSave(r, '상품 삭제'));
  const persistAdmin = (action: string, payload: Record<string, unknown>, label: string) =>
    adminApi(action, payload).then(r => reportSave(r, label));
  const sanctionsRef = useRef<Map<string, any>>(new Map());

  // 1. Deleted Product IDs Master Tracking
  const [deletedProductIds, setDeletedProductIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_deleted_products');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const deletedProductIdsRef = useRef<string[]>(deletedProductIds);
  useEffect(() => {
    deletedProductIdsRef.current = deletedProductIds;
  }, [deletedProductIds]);

  // 2. Deleted Banner IDs Master Tracking
  const [deletedBannerIds, setDeletedBannerIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_deleted_banners');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const deletedBannerIdsRef = useRef<string[]>(deletedBannerIds);
  useEffect(() => {
    deletedBannerIdsRef.current = deletedBannerIds;
  }, [deletedBannerIds]);

  // 3. Deleted Reviews & Posts Tracking (Prevents Supabase Realtime resurrection)
  const [deletedReviewIds, setDeletedReviewIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_deleted_reviews');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [deletedPostIds, setDeletedPostIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_deleted_posts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // 4. Deleted Events Tracking (체험단 구좌 & 이벤트 삭제 추적 - 부활 완전 방지)
  const [deletedEventIds, setDeletedEventIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_deleted_events');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const deletedEventIdsRef = React.useRef<string[]>(deletedEventIds);
  useEffect(() => {
    deletedEventIdsRef.current = deletedEventIds;
  }, [deletedEventIds]);




  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const storedDel = localStorage.getItem('sinsangpick_deleted_reviews');
      const delSet = new Set(storedDel ? JSON.parse(storedDel) : []);
      const stored = localStorage.getItem('sinsangpick_reviews');
      if (stored) {
        const parsed: Review[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mockPrefixes = ['rev-fruit', 'rev-meat', 'rev-ing', 'rev-orion', 'rev-coffee', 'rev-paris', 'rev-nobrand', 'rev-bibigo', 'rev-tlj', 'rev-pb', 'rev-snack'];
          const valid = parsed.filter(r => !delSet.has(r.id) && r.userName !== '탈퇴한 회원' && r.userName !== '탈퇴회원' && !mockPrefixes.some(prefix => r.id.startsWith(prefix)));
          return valid;
        }
      }
      return INITIAL_REVIEWS.filter(r => !delSet.has(r.id) && r.userName !== '탈퇴한 회원' && r.userName !== '탈퇴회원');
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const storedDel = localStorage.getItem('sinsangpick_deleted_products');
      const parsedDel: string[] = storedDel ? JSON.parse(storedDel) : [];
      const stored = localStorage.getItem('sinsangpick_products');
      const parsed: Product[] | null = stored ? JSON.parse(stored) : null;
      const initialDelRev = localStorage.getItem('sinsangpick_deleted_reviews');
      const delRevSet = new Set(initialDelRev ? JSON.parse(initialDelRev) : []);
      let initialRevs: Review[] = [];
      const storedRevs = localStorage.getItem('sinsangpick_reviews');
      if (storedRevs) {
        const parsedR: Review[] = JSON.parse(storedRevs);
        if (Array.isArray(parsedR)) {
          const mockPrefixes = ['rev-fruit', 'rev-meat', 'rev-ing', 'rev-orion', 'rev-coffee', 'rev-paris', 'rev-nobrand', 'rev-bibigo', 'rev-tlj', 'rev-pb', 'rev-snack'];
          initialRevs = parsedR.filter(r => !delRevSet.has(r.id) && r.userName !== '탈퇴한 회원' && r.userName !== '탈퇴회원' && !mockPrefixes.some(prefix => r.id.startsWith(prefix)));
        }
      }
      const merged = smartMergeProducts(parsed, INITIAL_PRODUCTS, parsedDel);
      return syncProductRatingsWithReviews(merged, initialRevs);
    } catch {
      return syncProductRatingsWithReviews(smartMergeProducts(null, INITIAL_PRODUCTS, []), []);
    }
  });

  // KAMIS Agricultural & Marine Product Live Prices Status
  const [kamisPriceStatus, setKamisPriceStatus] = useState<{
    lastUpdated: string | null;
    isUpdating: boolean;
    count: number;
    latestDate: string | null;
  }>(() => {
    try {
      const storedLast = localStorage.getItem('sinsangpick_kamis_last_update');
      const storedCache = localStorage.getItem('sinsangpick_kamis_cache_v2');
      const parsed = storedCache ? JSON.parse(storedCache) : null;
      return {
        lastUpdated: storedLast || null,
        isUpdating: false,
        count: Array.isArray(parsed?.items) ? parsed.items.length : 0,
        latestDate: parsed?.latestDate || null
      };
    } catch {
      return { lastUpdated: null, isUpdating: false, count: 0, latestDate: null };
    }
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    try {
      const storedDel = localStorage.getItem('sinsangpick_deleted_posts');
      const delSet = new Set(storedDel ? JSON.parse(storedDel) : []);
      return INITIAL_COMMUNITY_POSTS.filter(p => !delSet.has(p.id) && p.author !== '탈퇴한 회원' && p.author !== '탈퇴회원');
    } catch {
      return INITIAL_COMMUNITY_POSTS;
    }
  });

  const [banners, setBanners] = useState<BannerItem[]>(() => {
    try {
      const storedDel = localStorage.getItem('sinsangpick_deleted_banners');
      const parsedDel: string[] = storedDel ? JSON.parse(storedDel) : [];
      const stored = localStorage.getItem('sinsangpick_banners');
      const parsed: BannerItem[] | null = stored ? JSON.parse(stored) : null;
      return smartMergeBanners(parsed, INITIAL_BANNERS, parsedDel);
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

  const [homeSections, setHomeSections] = useState<HomeSectionConfig[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_home_sections');
      const parsed: HomeSectionConfig[] | null = stored ? JSON.parse(stored) : null;
      return smartMergeHomeSections(parsed, INITIAL_HOME_SECTIONS);
    } catch {
      return INITIAL_HOME_SECTIONS;
    }
  });

  // 신상 배틀: 대결 상품·투표·결과는 모두 서버(/api/battle) 값이 기준입니다.
  const [battleRound, setBattleRound] = useState<BattleRound | null>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_battle_round');
      const parsed: BattleRound | null = stored ? JSON.parse(stored) : null;
      // 다음 대결이 이미 시작된 뒤라면 지난 캐시는 쓰지 않습니다.
      return parsed && Date.parse(parsed.nextRoundAt) > Date.now() ? parsed : null;
    } catch {
      return null;
    }
  });
  const [battleVoteError, setBattleVoteError] = useState<string | null>(null);
  const battleChoice = battleRound?.myChoice ?? null;

  const applyBattleRound = (round: BattleRound | null) => {
    setBattleRound(round);
    try {
      if (round) safeSetItem('sinsangpick_battle_round', JSON.stringify(round));
      else localStorage.removeItem('sinsangpick_battle_round');
    } catch (e) {
      console.warn(e);
    }
  };

  const refreshBattleRound = async () => {
    const result = await fetchBattleRound();
    if (result.ok) applyBattleRound(result.round ?? null);
  };

  const voteBattle = async (choice: 'A' | 'B') => {
    if (!battleRound || battleRound.phase !== 'voting' || battleRound.myChoice === choice) return;
    const before = battleRound;
    setBattleVoteError(null);
    setBattleRound({
      ...before,
      myChoice: choice,
      totalVotes: before.totalVotes + (before.myChoice ? 0 : 1),
    });

    const result = await submitBattleVote(choice);
    if (result.ok && result.round) {
      applyBattleRound(result.round);
      return;
    }
    setBattleRound(before);
    if (result.code === 'SIGNED_OUT') {
      openLoginModal();
      return;
    }
    setBattleVoteError(result.error || '투표를 저장하지 못했어요. 잠시 후 다시 시도해주세요.');
    if (result.code === 'CLOSED' || result.code === 'NO_ROUND') refreshBattleRound();
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

  // Initial URL Query Param Parsing for Web Deep Linking
  const initialUrlParams = React.useMemo(() => {
    if (typeof window === 'undefined') return {};
    const params = new URLSearchParams(window.location.search);
    const p = params.get('p') || params.get('product') || params.get('pid') || params.get('code');
    const tab = params.get('tab') as ActiveTab | null;
    const cat = params.get('cat') || params.get('category');
    const brand = params.get('b') || params.get('brand');
    const event = params.get('event') || params.get('eventId');
    const search = params.get('search') || params.get('q');
    return { p, tab, cat, brand, event, search };
  }, []);

  const [activeTab, setActiveTabState] = useState<ActiveTab>(() => {
    if (initialUrlParams.p) return 'detail';
    if (initialUrlParams.event) return 'event_detail';
    if (initialUrlParams.search) return 'search';
    if (initialUrlParams.tab) {
      if ((initialUrlParams.tab as string) === 'sale') return 'calendar';
      return initialUrlParams.tab;
    }
    return 'home';
  });

  const [previousTab, setPreviousTab] = useState<ActiveTab>('home');
  const [selectedCategory, setSelectedCategoryState] = useState<ProductCategory>(() => {
    if (initialUrlParams.cat) return initialUrlParams.cat as ProductCategory;
    return '신제품';
  });

  const [selectedBrand, setSelectedBrandState] = useState<string | null>(() => {
    return initialUrlParams.brand || null;
  });

  const [selectedProductId, setSelectedProductId] = useState<string>(() => {
    if (initialUrlParams.p) {
      const match = findProductByCodeOrId(INITIAL_PRODUCTS, initialUrlParams.p);
      return match ? match.id : initialUrlParams.p;
    }
    return 'snack-01';
  });

  const [events, setEvents] = useState<PromotionEvent[]>(() => {
    try {
      const storedDel = localStorage.getItem('sinsangpick_deleted_events');
      const delSet = new Set(storedDel ? JSON.parse(storedDel) : []);
      const FAKE_EVENT_IDS = new Set(['event-dessert-01', 'event-ramen-01']);

      const stored = localStorage.getItem('sinsangpick_events');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter(e => e && e.id && !delSet.has(e.id) && !FAKE_EVENT_IDS.has(e.id));
        }
      }
      return INITIAL_EVENTS.filter(e => e && e.id && !delSet.has(e.id) && !FAKE_EVENT_IDS.has(e.id));
    } catch {
      return [];
    }
  });
  const [selectedEventId, setSelectedEventId] = useState<string>(() => {
    return initialUrlParams.event || 'event-01';
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_notifications');
      if (stored !== null) {
        return JSON.parse(stored);
      }
      return INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });
  const [incomingPush, setIncomingPush] = useState<AppNotification | null>(null);
  const [pushPermissionStatus, setPushPermissionStatus] = useState<'granted' | 'denied' | 'prompt'>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') return 'granted';
      if (Notification.permission === 'denied') return 'denied';
    }
    return 'prompt';
  });

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
  const toasts: ToastMessage[] = [];

  // 🏢 Brands Management State
  const [brands, setBrands] = useState<BrandInfo[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_brands_v1');
      if (stored !== null) {
        return JSON.parse(stored);
      }
      return POPULAR_BRANDS;
    } catch {
      return POPULAR_BRANDS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sinsangpick_brands_v1', JSON.stringify(brands));
    } catch (e) {
      console.error('Failed to save brands to localStorage', e);
    }
  }, [brands]);

  // 🏪 Store Channels Master State
  const [storeChannels, setStoreChannels] = useState<StoreChannelInfo[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_stores_v1');
      if (stored !== null) {
        return JSON.parse(stored);
      }
      return INITIAL_STORE_CHANNELS;
    } catch {
      return INITIAL_STORE_CHANNELS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sinsangpick_stores_v1', JSON.stringify(storeChannels));
    } catch (e) {
      console.error('Failed to save stores to localStorage', e);
    }
  }, [storeChannels]);

  // 📅 New Product Drop Calendar State
  const [calendarItems, setCalendarItems] = useState<ReleaseCalendarItem[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_calendar_v1');
      if (stored !== null) {
        return JSON.parse(stored);
      }
      return INITIAL_CALENDAR_ITEMS;
    } catch {
      return INITIAL_CALENDAR_ITEMS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sinsangpick_calendar_v1', JSON.stringify(calendarItems));
    } catch (e) {
      console.error('Failed to save calendar items to localStorage', e);
    }
  }, [calendarItems]);

  const [calendarReminders, setCalendarReminders] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_calendar_reminders');
      return stored ? JSON.parse(stored) : ['cal-02'];
    } catch {
      return ['cal-02'];
    }
  });

  // 🏷️ 편의점/마트 1+1 & 할인특가 행사소식 State
  const [salePromotions, setSalePromotions] = useState<SalePromotionItem[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_sales_v1');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sinsangpick_sales_v1', JSON.stringify(salePromotions));
    } catch (e) {
      console.error('Failed to save sale promotions to localStorage', e);
    }
  }, [salePromotions]);

  // 화면에는 종료일이 지나지 않은 행사만, D-day 는 오늘 기준으로 계산해 보여줍니다.
  const activeSalePromotions = React.useMemo(() => getActiveSalePromotions(salePromotions), [salePromotions]);

  const [savedSaleIds, setSavedSaleIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_saved_sales');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // 🥪 New Product Recipe / Combination State
  const [recipes, setRecipes] = useState<RecipePost[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_recipes');
      if (stored !== null) {
        return JSON.parse(stored);
      }
      return INITIAL_RECIPES;
    } catch {
      return INITIAL_RECIPES;
    }
  });
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [isRecipeDetailOpen, setIsRecipeDetailOpen] = useState(false);
  const [isWriteRecipeOpen, setIsWriteRecipeOpen] = useState(false);

  // 🎁 e쿠폰 스토어 상태 (교환 내역은 서버 coupon_orders 가 원본)
  const [purchasedCoupons, setPurchasedCoupons] = useState<PurchasedECoupon[]>([]);

  const FAKE_USER_UIDS = new Set([
    'user_minji_01', 'user_junho_02', 'user_dessert_03', 'user_taeyang_04',
    'user_jiwoo_05', 'user_donghyun_06', 'user_hyejin_07', 'user_suho_08',
    'user_seoyeon_09', 'user_random_99'
  ]);

  // All Profiles & Point Transactions for Admin & User Management
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_all_profiles');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(p => !FAKE_USER_UIDS.has(p.uid));
          return cleaned;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_USER_PROFILES;
  });

  const [pointTransactions, setPointTransactions] = useState<PointTransaction[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_point_transactions');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(t => !t.id?.startsWith('tx-0') && !FAKE_USER_UIDS.has(t.userId));
          return cleaned;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_POINT_TRANSACTIONS;
  });

  // Reports (신고 접수 및 처리 내역) state
  const [reports, setReports] = useState<ReportItem[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_reports');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(r => !r.id?.startsWith('rep-10'));
          return cleaned;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_REPORTS;
  });

  // Product Edit Requests (제품 수정 요청) state
  const [productEditRequests, setProductEditRequests] = useState<ProductEditRequest[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_product_edit_requests');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(r => !r.id?.startsWith('edit-req-10'));
          return cleaned;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_PRODUCT_EDIT_REQUESTS;
  });

  // 신제품 수집·승인 대기함 — 원본은 서버(/api/pending-products → pending_products 테이블)
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([]);
  const [pendingSetupError, setPendingSetupError] = useState<string | null>(null);
  const [isNaverCollectAvailable, setIsNaverCollectAvailable] = useState<boolean>(false);

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

  useEffect(() => {
    try {
      localStorage.setItem('sinsangpick_reports', JSON.stringify(reports));
    } catch (e) {
      // ignore
    }
  }, [reports]);

  useEffect(() => {
    try {
      localStorage.setItem('sinsangpick_product_edit_requests', JSON.stringify(productEditRequests));
    } catch (e) {
      // ignore
    }
  }, [productEditRequests]);

  // Sync pending products to localStorage
  // Safe localStorage helper to prevent QuotaExceededError crashes
  const safeSetItem = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`[LocalStorage Quota Exceeded] Failed to save key: ${key}`, e);
    }
  };

  // Pending products are synced with Supabase pending_products table

  // Sync state to localStorage
  useEffect(() => {
    safeSetItem('sinsangpick_products', serializeProductsForStorage(products));
  }, [products]);

  useEffect(() => {
    safeSetItem('sinsangpick_deleted_products', JSON.stringify(deletedProductIds));
  }, [deletedProductIds]);

  useEffect(() => {
    safeSetItem('sinsangpick_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    safeSetItem('sinsangpick_battle_config', JSON.stringify(battleConfig));
  }, [battleConfig]);

  useEffect(() => {
    safeSetItem('sinsangpick_home_sections', JSON.stringify(homeSections));
  }, [homeSections]);

  useEffect(() => {
    safeSetItem('sinsangpick_reviews', JSON.stringify(reviews));
    setProducts(prev => syncProductRatingsWithReviews(prev, reviews));
  }, [reviews]);

  useEffect(() => {
    safeSetItem('sinsangpick_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    safeSetItem('sinsangpick_deleted_events', JSON.stringify(deletedEventIds));
  }, [deletedEventIds]);

  useEffect(() => {
    safeSetItem('sinsangpick_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    safeSetItem('sinsangpick_recipes', JSON.stringify(recipes));
  }, [recipes]);

  // Sync state to localStorage
  useEffect(() => {
    safeSetItem('sinsangpick_review_likes', JSON.stringify(likedReviewIds));
  }, [likedReviewIds]);

  useEffect(() => {
    safeSetItem('sinsangpick_post_likes', JSON.stringify(likedPostIds));
  }, [likedPostIds]);

  useEffect(() => {
    safeSetItem('sinsangpick_bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  useEffect(() => {
    safeSetItem('sinsangpick_points', currentUser.points.toString());
    safeSetItem('sinsangpick_name', currentUser.displayName);
  }, [currentUser]);

  // KAMIS Agricultural & Marine Produce Live Prices Sync Handler
  const refreshKamisPrices = async (force: boolean = false): Promise<{ count: number; latestDate: string }> => {
    setKamisPriceStatus(prev => ({ ...prev, isUpdating: true }));
    try {
      const res = await fetchKamisDailyPrices(force);
      if (res.success && res.items.length > 0) {
        setProducts(prevProducts => {
          const { updatedProducts } = applyKamisPricesToProducts(prevProducts, res.items, res.latestDate);
          safeSetItem('sinsangpick_products', JSON.stringify(updatedProducts));
          return updatedProducts;
        });

        const nowIso = new Date().toISOString();
        const todayStr = nowIso.split('T')[0];
        safeSetItem('sinsangpick_kamis_last_daily_sync', todayStr);

        setKamisPriceStatus({
          lastUpdated: nowIso,
          isUpdating: false,
          count: res.count,
          latestDate: res.latestDate
        });

        return { count: res.count, latestDate: res.latestDate };
      }
    } catch (err) {
      console.warn('[KAMIS Produce Price Sync Warning]', err);
    } finally {
      setKamisPriceStatus(prev => ({ ...prev, isUpdating: false }));
    }
    return { count: 0, latestDate: '' };
  };

  // Daily auto-refresh of KAMIS produce prices
  useEffect(() => {
    let timerId: any = null;
    const checkAndSyncKamis = async () => {
      const todayStr = new Date().toISOString().split('T')[0];
      const lastSync = localStorage.getItem('sinsangpick_kamis_last_daily_sync');

      // 1. If cache exists in localStorage, immediately apply it to in-memory products on startup
      try {
        const cachedRaw = localStorage.getItem('sinsangpick_kamis_cache_v2');
        if (cachedRaw) {
          const parsed = JSON.parse(cachedRaw);
          if (Array.isArray(parsed?.items) && parsed.items.length > 0) {
            setProducts(prev => {
              const hasAny = prev.some(p => p.kamisPriceInfo);
              if (!hasAny) {
                const { updatedProducts } = applyKamisPricesToProducts(prev, parsed.items, parsed.latestDate);
                return updatedProducts;
              }
              return prev;
            });
          }
        }
      } catch {}

      // 2. If daily sync hasn't run today, fetch latest KAMIS prices in background
      if (lastSync !== todayStr) {
        timerId = setTimeout(() => {
          refreshKamisPrices(false);
        }, 2000);
      }
    };

    checkAndSyncKamis();
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  // 로그인한 회원 본인의 제재 상태(경고/정지)를 서버에서 불러와 이용 제한에 반영합니다.
  useEffect(() => {
    const uid = currentUser.uid;
    if (!supabase || !isSupabaseConfigured || !uid || currentUser.isAnonymous) return;
    let cancelled = false;
    Promise.resolve(supabase.from('user_sanctions').select('*').eq('user_id', uid).maybeSingle())
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        const fields = {
          status: data.status || 'active',
          warningCount: Number(data.warning_count) || 0,
          suspendedUntil: data.suspended_until || undefined,
          statusReason: data.reason || undefined,
          statusUpdatedAt: data.updated_at || undefined,
        };
        setCurrentUser(prev => (prev.uid === uid ? { ...prev, ...fields } : prev));
        setAllProfiles(prev => prev.map(u => (u.uid === uid ? { ...u, ...fields } : u)));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [currentUser.uid]);

  // 신상 배틀: 시작·로그인 계정 변경·앱 복귀 때 다시 불러오고, 결과 공개(토)·새 대결(월) 시각에 맞춰 갱신합니다.
  useEffect(() => {
    refreshBattleRound();
    const handleVisible = () => {
      if (document.visibilityState === 'visible') refreshBattleRound();
    };
    document.addEventListener('visibilitychange', handleVisible);
    return () => document.removeEventListener('visibilitychange', handleVisible);
  }, [currentUser.uid]);

  useEffect(() => {
    if (!battleRound) return;
    const nextChangeAt = Date.parse(battleRound.phase === 'voting' ? battleRound.resultAt : battleRound.nextRoundAt);
    if (isNaN(nextChangeAt)) return;
    const timer = setTimeout(refreshBattleRound, Math.max(nextChangeAt - Date.now(), 0) + 2000);
    return () => clearTimeout(timer);
  }, [battleRound?.weekKey, battleRound?.phase]);

  // 관리자 설정 목록(브랜드·판매처·출시 캘린더·배틀)은 서버에 저장된 값이 있으면 그 값을 씁니다.
  const applyRemoteAdminLists = (remote: { brands?: any; storeChannels?: any; calendarItems?: any; battleConfig?: any } | null | undefined) => {
    if (!remote) return;
    if (Array.isArray(remote.brands)) setBrands(remote.brands);
    if (Array.isArray(remote.storeChannels)) setStoreChannels(remote.storeChannels);
    if (Array.isArray(remote.calendarItems)) setCalendarItems(remote.calendarItems);
    if (remote.battleConfig && typeof remote.battleConfig === 'object') {
      setBattleConfig(prev => ({ ...prev, ...remote.battleConfig }));
    }
  };

  // Global Remote Content Sync Handlers
  const refreshRemoteContent = async () => {
    setIsContentSyncing(true);
    try {
      const remote = await fetchRemoteContent();
      let curDeletedBanners = deletedBannerIdsRef.current;
      if (remote.deletedBannerIds && Array.isArray(remote.deletedBannerIds)) {
        curDeletedBanners = Array.from(new Set([...curDeletedBanners, ...remote.deletedBannerIds]));
        deletedBannerIdsRef.current = curDeletedBanners;
        setDeletedBannerIds(curDeletedBanners);
        safeSetItem('sinsangpick_deleted_banners', JSON.stringify(curDeletedBanners));
      }
      if (remote.banners !== null && Array.isArray(remote.banners)) {
        const mergedBanners = smartMergeBanners(remote.banners, INITIAL_BANNERS, curDeletedBanners);
        setBanners(mergedBanners);
        safeSetItem('sinsangpick_banners', JSON.stringify(mergedBanners));
      }
      if (remote.homeSections !== null && Array.isArray(remote.homeSections)) {
        const mergedSections = smartMergeHomeSections(remote.homeSections, INITIAL_HOME_SECTIONS);
        setHomeSections(mergedSections);
        safeSetItem('sinsangpick_home_sections', JSON.stringify(mergedSections));
      }
      if (remote.salePromotions !== null && Array.isArray(remote.salePromotions)) {
        setSalePromotions(remote.salePromotions);
        safeSetItem('sinsangpick_sales_v1', JSON.stringify(remote.salePromotions));
      }
      applyRemoteAdminLists(remote);
      let curDeletedEvents = deletedEventIdsRef.current;
      if (remote.deletedEventIds && Array.isArray(remote.deletedEventIds)) {
        curDeletedEvents = Array.from(new Set([...curDeletedEvents, ...remote.deletedEventIds]));
        deletedEventIdsRef.current = curDeletedEvents;
        setDeletedEventIds(curDeletedEvents);
        safeSetItem('sinsangpick_deleted_events', JSON.stringify(curDeletedEvents));
      }
      if (remote.events !== null && Array.isArray(remote.events)) {
        const delEventSet = new Set(curDeletedEvents);
        const FAKE_EVENT_IDS = new Set(['event-dessert-01', 'event-ramen-01']);
        const validEvents = remote.events.filter(e => e && e.id && !delEventSet.has(e.id) && !FAKE_EVENT_IDS.has(e.id));
        setEvents(validEvents);
        safeSetItem('sinsangpick_events', JSON.stringify(validEvents));
      }
      if (remote.deletedProductIds && Array.isArray(remote.deletedProductIds)) {
        const nextDel = Array.from(new Set([...deletedProductIdsRef.current, ...remote.deletedProductIds]));
        deletedProductIdsRef.current = nextDel;
        setDeletedProductIds(nextDel);
        safeSetItem('sinsangpick_deleted_products', JSON.stringify(nextDel));
        const remoteDelSet = new Set(nextDel);
        setProducts(prev => prev.filter(p => !remoteDelSet.has(p.id)));
      }
    } catch (e) {
      console.warn('[refreshRemoteContent Warning]', e);
    } finally {
      setIsContentSyncing(false);
    }
  };

  const syncAllContentToCloud = async () => {
    setIsContentSyncing(true);
    try {
      const ok = await persistContent({
        banners, homeSections, salePromotions, events, brands, storeChannels, calendarItems, battleConfig,
        deletedProductIds: deletedProductIdsRef.current,
        deletedBannerIds: deletedBannerIdsRef.current,
        deletedEventIds: deletedEventIdsRef.current,
      }, '전체 설정');
      if (ok) setAdminSaveError(null);
    } finally {
      setIsContentSyncing(false);
    }
  };

  // Fetch all initial data from Supabase
  const loadSupabaseData = async (uid: string) => {
    if (!supabase) return;

    setIsDataLoading(true);
    try {
      // 1. Fetch Products & System Records with timeout
      const { data: dbProducts, error: prodErr } = await withTimeout(
        supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false }),
        8000,
        { data: null, error: null } as any
      );

      if (prodErr) throw prodErr;

      // Reset network error on successful retrieval
      setNetworkError(null);

      // Create lookup map of DB products
      const dbProductMap = new Map<string, DBProduct>();
      if (dbProducts) {
        dbProducts.forEach((p: any) => {
          if (p.id) dbProductMap.set(p.id, p);
        });
      }

      // Check for system banner/settings record
      let remoteDeleted: string[] = [];
      let remoteDeletedBanners: string[] = [];
      const systemBannerRecord = dbProductMap.get(SYSTEM_BANNER_RECORD_ID);
      if (systemBannerRecord && systemBannerRecord.nutrition) {
        if (Array.isArray(systemBannerRecord.nutrition.deletedBannerIds)) {
          remoteDeletedBanners = systemBannerRecord.nutrition.deletedBannerIds;
          const mergedDeletedBanners = Array.from(new Set([...deletedBannerIdsRef.current, ...remoteDeletedBanners]));
          deletedBannerIdsRef.current = mergedDeletedBanners;
          setDeletedBannerIds(mergedDeletedBanners);
          safeSetItem('sinsangpick_deleted_banners', JSON.stringify(mergedDeletedBanners));
        }
        if (systemBannerRecord.nutrition.banners !== undefined && Array.isArray(systemBannerRecord.nutrition.banners)) {
          const merged = smartMergeBanners(systemBannerRecord.nutrition.banners, INITIAL_BANNERS, deletedBannerIdsRef.current);
          setBanners(merged);
          safeSetItem('sinsangpick_banners', JSON.stringify(merged));
        }
        if (systemBannerRecord.nutrition.homeSections !== undefined && Array.isArray(systemBannerRecord.nutrition.homeSections)) {
          const mergedSec = smartMergeHomeSections(systemBannerRecord.nutrition.homeSections, INITIAL_HOME_SECTIONS);
          setHomeSections(mergedSec);
          safeSetItem('sinsangpick_home_sections', JSON.stringify(mergedSec));
        }
        if (systemBannerRecord.nutrition.salePromotions !== undefined && Array.isArray(systemBannerRecord.nutrition.salePromotions)) {
          setSalePromotions(systemBannerRecord.nutrition.salePromotions);
          safeSetItem('sinsangpick_sales_v1', JSON.stringify(systemBannerRecord.nutrition.salePromotions));
        }
        applyRemoteAdminLists(systemBannerRecord.nutrition);
        if (Array.isArray(systemBannerRecord.nutrition.deletedEventIds)) {
          const mergedDeletedEvents = Array.from(new Set([...deletedEventIdsRef.current, ...systemBannerRecord.nutrition.deletedEventIds]));
          deletedEventIdsRef.current = mergedDeletedEvents;
          setDeletedEventIds(mergedDeletedEvents);
          safeSetItem('sinsangpick_deleted_events', JSON.stringify(mergedDeletedEvents));
        }
        if (systemBannerRecord.nutrition.events !== undefined && Array.isArray(systemBannerRecord.nutrition.events)) {
          const delEventSet = new Set(deletedEventIdsRef.current);
          const FAKE_EVENT_IDS = new Set(['event-dessert-01', 'event-ramen-01']);
          const validEvents = systemBannerRecord.nutrition.events.filter((e: any) => e && e.id && !delEventSet.has(e.id) && !FAKE_EVENT_IDS.has(e.id));
          setEvents(validEvents);
          safeSetItem('sinsangpick_events', JSON.stringify(validEvents));
        }
        if (Array.isArray(systemBannerRecord.nutrition.deletedProductIds)) {
          remoteDeleted = systemBannerRecord.nutrition.deletedProductIds;
        }
      }

      // Merge deleted product IDs safely using ref and localStorage to avoid race conditions
      let localDel: string[] = [];
      try {
        const s = localStorage.getItem('sinsangpick_deleted_products');
        if (s) localDel = JSON.parse(s);
      } catch {}
      const mergedDeletedIds = Array.from(new Set([
        ...deletedProductIdsRef.current,
        ...localDel,
        ...remoteDeleted
      ]));
      deletedProductIdsRef.current = mergedDeletedIds;
      setDeletedProductIds(mergedDeletedIds);
      safeSetItem('sinsangpick_deleted_products', JSON.stringify(mergedDeletedIds));
      const deletedSet = new Set(mergedDeletedIds);

      // Fetch stored local products to preserve any local edits
      let storedLocalProducts: Product[] | null = null;
      try {
        const s = localStorage.getItem('sinsangpick_products');
        if (s) storedLocalProducts = JSON.parse(s);
      } catch {}

      if (!dbProducts || dbProducts.length === 0) {
        const baseInitial = smartMergeProducts(storedLocalProducts, INITIAL_PRODUCTS.filter(p => !deletedSet.has(p.id)), mergedDeletedIds);
        setProducts(syncProductRatingsWithReviews(baseInitial, reviews));
      } else {
        // Filter INITIAL_PRODUCTS by deletedSet and merge DB fields
        const mergedInitial = INITIAL_PRODUCTS
          .filter(initial => !deletedSet.has(initial.id))
          .map(initial => {
            const dbP = dbProductMap.get(initial.id);
            if (dbP) {
              const mapped = definedOnly(mapDBProductToProduct(dbP)) as Product;
              return {
                ...initial,
                ...mapped,
                discountRate: mapped.discountRate !== undefined ? mapped.discountRate : initial.discountRate,
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

        // Also append any extra custom products from Supabase (excluding system container & deleted products)
        const initialIdSet = new Set(INITIAL_PRODUCTS.map(p => p.id));
        const extraDbProducts = dbProducts
          .filter((dbP: any) => dbP.id && !initialIdSet.has(dbP.id) && dbP.id !== SYSTEM_BANNER_RECORD_ID && !deletedSet.has(dbP.id))
          .map((dbP: any) => mapDBProductToProduct(dbP));

        // 서버 값이 기준입니다. 단, 관리자 기기에 남은 미저장 수정분을 서버로 올리기(initAdminSession) 전까지는
        // 그 기기에서만 기존처럼 기기 값을 유지해 수정분이 사라지지 않게 합니다.
        const serverIsSourceOfTruth = Boolean(systemBannerRecord?.nutrition?.adminLocalSyncedAt) || !(await isAdminSession());
        const combinedProducts = smartMergeProducts(
          storedLocalProducts,
          [...mergedInitial, ...extraDbProducts],
          mergedDeletedIds,
          serverIsSourceOfTruth ? new Set(dbProductMap.keys()) : undefined
        );
        setProducts(syncProductRatingsWithReviews(combinedProducts, reviews));
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

      // 3. Fetch Reviews with Comments (Respecting admin deleted reviews)
      let localDelRev: string[] = [];
      try {
        const s = localStorage.getItem('sinsangpick_deleted_reviews');
        if (s) localDelRev = JSON.parse(s);
      } catch {}
      const delRevSet = new Set([...deletedReviewIds, ...localDelRev]);

      const { data: dbReviews, error: revErr } = await supabase
        .from('reviews')
        .select('*, review_comments(*)')
        .order('created_at', { ascending: false });

      if (!revErr && dbReviews) {
        const parsedReviews: Review[] = dbReviews
          .filter((r: any) => !delRevSet.has(r.id) && r.user_name !== '탈퇴한 회원' && r.user_name !== '탈퇴회원')
          .map((r: any) => {
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
        setProducts(prev => syncProductRatingsWithReviews(prev, parsedReviews));
      }

      // 4. Fetch Community Posts with Comments (Respecting admin deleted posts)
      let localDelPost: string[] = [];
      try {
        const s = localStorage.getItem('sinsangpick_deleted_posts');
        if (s) localDelPost = JSON.parse(s);
      } catch {}
      const delPostSet = new Set([...deletedPostIds, ...localDelPost]);

      const { data: dbPosts, error: postErr } = await supabase
        .from('community_posts')
        .select('*, post_comments(*)')
        .order('created_at', { ascending: false });

      if (!postErr && dbPosts) {
        const parsedPosts: CommunityPost[] = dbPosts
          .filter((p: any) => !delPostSet.has(p.id) && p.author_name !== '탈퇴한 회원' && p.author_name !== '탈퇴회원')
          .map((p: any) => {
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
      const isWithdrawn = (() => {
        try {
          const list = JSON.parse(localStorage.getItem('sinsangpick_withdrawn_uids') || '[]');
          return list.includes(uid) || localStorage.getItem('sinsangpick_withdrawn_uid_' + uid) === 'true';
        } catch { return false; }
      })();

      const { data: profile } = isWithdrawn ? { data: null } : await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .maybeSingle();

      if (profile) {
        setCurrentUser(prev => {
          const isCustomizedName = localStorage.getItem('sinsangpick_custom_nickname_' + uid) === 'true';
          const hasCustomPhoto = localStorage.getItem('sinsangpick_custom_photo_' + uid) === 'true';
          let finalDisplayName = prev.displayName;
          let finalPhotoURL = prev.photoURL;

          // 닉네임 결정: 사용자가 직접 변경한 닉네임이거나 순번 닉네임(^신상러버_\d+$)인 경우만 유지
          // 실명("서현정", "이예진" 등)이나 '사용자', '신상러버' 단독 텍스트는 순번 닉네임으로 강제 교체
          if (profile.display_name && !profile.display_name.includes('사용자') && profile.display_name !== '신상러버' && profile.display_name !== '서현정' && profile.display_name !== '이예진') {
            if (isCustomizedName || /^신상러버_\d+$/.test(profile.display_name)) {
              finalDisplayName = profile.display_name;
            }
          }

          // 프로필 사진 결정:
          // 1) 사용자가 직접 설정한 커스텀 아바타 또는 프리셋인 경우 유지
          // 2) 카카오/소셜 원본 사진이거나 더미 Unsplash인 경우 공식 로고(제공자 메타 포함)로 통일
          if (hasCustomPhoto && profile.avatar_url && isValidCustomPhoto(profile.avatar_url, uid)) {
            finalPhotoURL = profile.avatar_url;
            localStorage.setItem('sinsangpick_photo', finalPhotoURL);
          } else {
            finalPhotoURL = getProviderLogoUrl(prev.provider);
            localStorage.setItem('sinsangpick_photo', finalPhotoURL);
          }

          const userPoints = typeof profile.points === 'number' ? profile.points : 100;
          return {
            ...prev,
            displayName: finalDisplayName,
            photoURL: finalPhotoURL,
            points: userPoints,
            level: calculateLevel(userPoints),
          };
        });
      } else {
        // 프로필이 없는 경우 (탈퇴 후 재가입 / 신규 가입)
        setCurrentUser(prev => ({
          ...prev,
          points: 100,
          level: 'Lv.1',
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

          const sanitizeProfileData = (dbP: any, existingP?: UserProfile, defaultIdx = 1) => {
            const inferredProv = resolveUserProfileProvider(dbP, existingP, currentUser);

            // 닉네임 정제: 실명("서현정", "이예진") 또는 누락값은 무조건 신상러버_XXX로 변환
            let dName = dbP.display_name || existingP?.displayName || '';
            if (dName === '서현정') dName = '신상러버_002';
            else if (dName === '이예진') dName = '신상러버_003';
            else if (!dName || dName === '신상러버' || dName.includes('사용자')) {
              dName = existingP?.displayName || `신상러버_${String(defaultIdx).padStart(3, '0')}`;
            }

            // 프로필 사진 정제: 커스텀 업로드가 아니거나 unsplash/소셜 원본이면 getProviderLogoUrl 적용
            let pUrl = dbP.avatar_url || existingP?.photoURL || '';
            if (!pUrl || !isValidCustomPhoto(pUrl, dbP.id) || pUrl === DEFAULT_AVATAR) {
              pUrl = getProviderLogoUrl(inferredProv);
            }

            return { dName, pUrl, inferredProv };
          };

          const updated = prev.map((p, idx) => {
            const dbP = dbMap.get(p.uid);
            if (dbP) {
              const { dName, pUrl, inferredProv } = sanitizeProfileData(dbP, p, idx + 1);
              return {
                ...p,
                displayName: dName,
                photoURL: pUrl,
                points: dbP.points ?? p.points,
                level: calculateLevel(dbP.points ?? p.points),
                email: dbP.email || p.email,
                provider: inferredProv,
                createdAt: dbP.created_at || p.createdAt,
                lastActiveAt: dbP.last_active_at || dbP.updated_at || p.lastActiveAt,
              };
            }
            return p;
          });

          const existingUids = new Set(prev.map(p => p.uid));
          const extraUsers: UserProfile[] = dbAllProfiles
            .filter(p => !existingUids.has(p.id))
            .map((p, idx) => {
              const { dName, pUrl, inferredProv } = sanitizeProfileData(p, undefined, prev.length + idx + 1);
              return {
                uid: p.id,
                displayName: dName,
                photoURL: pUrl,
                level: calculateLevel(p.points ?? 100),
                points: p.points ?? 100,
                email: p.email || undefined,
                provider: inferredProv,
                createdAt: p.created_at || new Date().toISOString(),
                lastActiveAt: p.last_active_at || p.updated_at || undefined,
                status: 'active',
                warningCount: 0,
                role: 'user'
              };
            });

          return [...updated, ...extraUsers];
        });

        // 🩺 Self-Healing: 현재 로그인 세션이 소셜(Apple/Kakao)인데 DB에 anonymous로 남아있다면 DB provider 즉시 자동 보정
        if (currentUser?.uid && ['apple', 'kakao', 'google'].includes(currentUser.provider || '')) {
          safeUpsertProfile(supabase, {
            id: currentUser.uid,
            display_name: currentUser.displayName,
            avatar_url: currentUser.photoURL,
            provider: currentUser.provider,
            email: currentUser.email || undefined,
          }).catch(() => {});
        }
      }

    } catch (err: any) {
      console.warn('[Supabase] Failed to load data:', err);
      const parsed = parseNetworkError(err);
      setNetworkError(parsed.message);
    } finally {
      setIsDataLoading(false);
    }
  };

  // Comprehensive retry sync for user or network status recovery
  const retrySync = async () => {
    setIsDataLoading(true);
    setNetworkError(null);
    try {
      await Promise.allSettled([
        loadSupabaseData(currentUser.uid),
        refreshRemoteContent()
      ]);
    } finally {
      setIsDataLoading(false);
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
      // 1. Process OAuth callback if returning from web OAuth redirect (Kakao, Google, etc.)
      const isMobileDevice = typeof navigator !== 'undefined' && (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
        (navigator.maxTouchPoints > 1 && /Macintosh/i.test(navigator.userAgent)));

      const currentUrl = window.location.href;
      if (!Capacitor.isNativePlatform() && (currentUrl.includes('code=') || currentUrl.includes('access_token=') || currentUrl.includes('error='))) {
        try {
          await handleAuthCallbackUrl(currentUrl);
          // On mobile, keep URL params for AuthCallbackBridge to hand off to native scheme, clean up on desktop
          if (!isMobileDevice && (window.location.search.includes('code=') || window.location.hash.includes('access_token=') || window.location.search.includes('error='))) {
            window.history.replaceState(null, '', window.location.pathname);
          }
        } catch (e) {
          console.warn('[Web Auth Callback] Exception processing URL callback:', e);
        }
      }

      // Fetch remote banners and sections immediately without waiting for auth
      refreshRemoteContent().catch(() => {});

      const { user } = await ensureSupabaseAuth();
      if (!isMounted || !user) return;

      setIsSupabaseConnected(true);
      const uid = user.id;
      const providerName = inferUserProvider(user);

      // Check if user has withdrawn previously
      const isWithdrawn = (() => {
        try {
          const list = JSON.parse(localStorage.getItem('sinsangpick_withdrawn_uids') || '[]');
          return list.includes(uid) || localStorage.getItem('sinsangpick_withdrawn_uid_' + uid) === 'true';
        } catch { return false; }
      })();

      // Fetch DB profile to check if valid profile already exists
      let dbProfile: any = null;
      if (!isWithdrawn) {
        try {
          const { data } = await client
            .from('profiles')
            .select('*')
            .eq('id', uid)
            .maybeSingle();
          dbProfile = data;
        } catch (e) {
          console.warn('[Supabase Profile Init Query Error]', e);
        }
      } else {
        // 탈퇴 후 재가입: 기존 잔존 DB 프로필 무시 및 플래그 정리
        localStorage.removeItem('sinsangpick_withdrawn_uid_' + uid);
        try {
          const list = JSON.parse(localStorage.getItem('sinsangpick_withdrawn_uids') || '[]');
          const filtered = list.filter((id: string) => id !== uid);
          localStorage.setItem('sinsangpick_withdrawn_uids', JSON.stringify(filtered));
        } catch {}
      }

      let resolvedDisplayName: string | null = null;
      let resolvedPhotoURL: string = getProviderLogoUrl(providerName);

      if (dbProfile) {
        if (dbProfile.display_name && !isInvalidOrSocialRealName(dbProfile.display_name, user)) {
          resolvedDisplayName = dbProfile.display_name;
        } else {
          resolvedDisplayName = await getNextSequentialNickname(client, allProfiles);
        }

        if (dbProfile.avatar_url && isValidCustomPhoto(dbProfile.avatar_url, uid)) {
          resolvedPhotoURL = dbProfile.avatar_url;
        }
      } else {
        resolvedDisplayName = await getNextSequentialNickname(client, allProfiles);
      }

      localStorage.setItem('sinsangpick_uid', uid);
      localStorage.setItem('sinsangpick_name', resolvedDisplayName!);
      localStorage.setItem('sinsangpick_photo', resolvedPhotoURL);
      const initialPoints = isWithdrawn ? 100 : (dbProfile?.points ?? currentUser.points ?? 100);

      setCurrentUser(prev => ({
        ...prev,
        uid,
        displayName: resolvedDisplayName!,
        photoURL: resolvedPhotoURL,
        isAnonymous: user.is_anonymous || false,
        provider: providerName,
        email: user.email || prev.email,
        points: initialPoints,
        level: calculateLevel(initialPoints),
      }));

      // Update DB profile safely without overwriting established custom attributes
      if (providerName && ['apple', 'kakao', 'google'].includes(providerName)) {
        safeUpsertProfile(client, {
          id: uid,
          display_name: resolvedDisplayName!,
          avatar_url: resolvedPhotoURL,
          provider: providerName,
          email: user.email || undefined,
          points: isWithdrawn ? 100 : (dbProfile?.points ?? undefined),
          level: isWithdrawn ? 'Lv.1' : (dbProfile?.level ?? undefined),
        }).catch(() => {});

        setAllProfiles(prev => {
          const exists = prev.some(p => p.uid === uid);
          if (exists) {
            return prev.map(p => p.uid === uid ? {
              ...p,
              displayName: resolvedDisplayName!,
              photoURL: resolvedPhotoURL,
              provider: providerName,
              email: user.email || p.email,
              lastActiveAt: new Date().toISOString(),
            } : p);
          }
          return prev;
        });
      }

      await loadSupabaseData(uid);

      // Subscribe to Realtime Postgres Changes
      const channel = client.channel('public:db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
          loadSupabaseData(uid);
          refreshRemoteContent();
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
        .subscribe((status) => {
          console.info('[Supabase Realtime] Channel status:', status);
        });
      // 6. Listen for Auth State Changes (Apple / Google / Kakao OAuth redirect)
      const { data: { subscription: authSub } } = client.auth.onAuthStateChange(async (event, session) => {
        if (session?.user && isMounted) {
          const u = session.user;
          const providerName = inferUserProvider(u);

          // Check if user has withdrawn previously
          const isWithdrawn = (() => {
            try {
              const list = JSON.parse(localStorage.getItem('sinsangpick_withdrawn_uids') || '[]');
              return list.includes(u.id) || localStorage.getItem('sinsangpick_withdrawn_uid_' + u.id) === 'true';
            } catch { return false; }
          })();

          // Fetch DB profile to check if established custom profile already exists
          let dbProfileData: any = null;
          if (!isWithdrawn) {
            try {
              const { data: profileData } = await client
                .from('profiles')
                .select('*')
                .eq('id', u.id)
                .maybeSingle();
              dbProfileData = profileData;
            } catch (e) {
              console.warn('[Supabase Profile Check Error]', e);
            }
          } else {
            // 탈퇴 후 재가입: 기존 잔존 DB 프로필 무시 및 플래그 정리
            localStorage.removeItem('sinsangpick_withdrawn_uid_' + u.id);
            try {
              const list = JSON.parse(localStorage.getItem('sinsangpick_withdrawn_uids') || '[]');
              const filtered = list.filter((id: string) => id !== u.id);
              localStorage.setItem('sinsangpick_withdrawn_uids', JSON.stringify(filtered));
            } catch {}
          }

          let displayName: string | null = null;
          let photoURL: string = getProviderLogoUrl(providerName);

          if (dbProfileData) {
            if (dbProfileData.display_name && !isInvalidOrSocialRealName(dbProfileData.display_name, u)) {
              displayName = dbProfileData.display_name;
            } else {
              displayName = await getNextSequentialNickname(client, allProfiles);
            }

            if (dbProfileData.avatar_url && isValidCustomPhoto(dbProfileData.avatar_url, u.id)) {
              photoURL = dbProfileData.avatar_url;
            }
          } else {
            displayName = await getNextSequentialNickname(client, allProfiles);
          }

          // 소셜 원본 프로필 사진(개인 실명/얼굴 사진)인 경우에만 기본 아바타로 안전하게 동기화
          if (dbProfileData?.avatar_url && isKakaoOrSocialRawAvatar(dbProfileData.avatar_url) && client) {
            client.from('profiles').update({ avatar_url: getProviderLogoUrl(providerName) }).eq('id', u.id).then(() => {});
          }

          const targetPoints = isWithdrawn ? 100 : (dbProfileData?.points ?? 100);

          localStorage.setItem('sinsangpick_photo', photoURL);
          localStorage.setItem('sinsangpick_uid', u.id);
          localStorage.setItem('sinsangpick_name', displayName!);
          localStorage.setItem('sinsangpick_points', String(targetPoints));
          localStorage.setItem('sinsangpick_nickname_set_' + u.id, 'true');
          setIsLoginModalOpen(false);
          setIsGuestBrowse(true);
          checkAndOpenPostLoginModals(u.id);

          setCurrentUser(prev => ({
            ...prev,
            uid: u.id,
            displayName: displayName!,
            photoURL: photoURL,
            points: targetPoints,
            level: calculateLevel(targetPoints),
            isAnonymous: false,
            provider: providerName,
            email: u.email || prev.email,
          }));

          if (event === 'SIGNED_IN') {
            const providerMsg = providerName === 'apple' 
              ? '🍎 Apple 계정으로 로그인되었습니다!' 
              : providerName === 'kakao'
              ? '💬 카카오 계정으로 로그인되었습니다!'
              : '🌐 Google 계정으로 로그인되었습니다!';
            showToast(providerMsg, 'success');
            if (window.location.hash.includes('access_token=') || window.location.search.includes('code=')) {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }

          await safeUpsertProfile(client, {
            id: u.id,
            display_name: displayName!,
            avatar_url: photoURL,
            provider: providerName,
            email: u.email || undefined,
            points: isWithdrawn ? 100 : (dbProfileData?.points ?? undefined),
            level: isWithdrawn ? 'Lv.1' : (dbProfileData?.level ?? undefined),
          });

          // allProfiles 메모리 상태에도 즉시 provider 동기화
          setAllProfiles(prev => {
            const exists = prev.some(p => p.uid === u.id);
            if (exists) {
              return prev.map(p => p.uid === u.id ? {
                ...p,
                displayName: displayName!,
                photoURL: photoURL,
                provider: providerName,
                email: u.email || p.email,
                lastActiveAt: new Date().toISOString(),
              } : p);
            }
            return [{
              uid: u.id,
              displayName: displayName!,
              photoURL: photoURL,
              level: calculateLevel(dbProfileData?.points ?? 100),
              points: dbProfileData?.points ?? 100,
              isAnonymous: false,
              provider: providerName,
              email: u.email || undefined,
              createdAt: new Date().toISOString(),
              lastActiveAt: new Date().toISOString(),
              status: 'active',
              warningCount: 0,
              role: 'user',
            }, ...prev];
          });

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

  // 🔗 Immediate Deep Link Listener (Capacitor Native: sinsangpick://auth-callback)
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let appUrlSub: any = null;
    CapacitorApp.addListener('appUrlOpen', async (data) => {
      console.log('[Capacitor App] Deep link received:', data?.url);
      if (!data?.url) return;

      if (
        data.url.includes('auth-callback') ||
        data.url.includes('access_token') ||
        data.url.includes('code=')
      ) {
        try {
          const success = await handleAuthCallbackUrl(data.url);
          // Always ensure in-app browser sheet is closed
          await Browser.close().catch(() => {});

          if (success) {
            setIsLoginModalOpen(false);
            setIsGuestBrowse(true);
            showToast('💬 카카오 계정으로 로그인되었습니다!', 'success');

            // Sync user data & provider
            if (supabase) {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                const pName = inferUserProvider(user) || 'kakao';
                const isCustom = localStorage.getItem('sinsangpick_custom_nickname_' + user.id) === 'true';
                let dName = localStorage.getItem('sinsangpick_name');
                if (!dName || !isCustom || dName.includes('사용자') || dName === '신상러버' || dName === '서현정' || dName === '이예진') {
                  dName = await getNextSequentialNickname(supabase, allProfiles);
                  localStorage.setItem('sinsangpick_name', dName);
                }
                const photoURL = getProviderLogoUrl(pName);
                localStorage.setItem('sinsangpick_photo', photoURL);

                setCurrentUser(prev => ({
                  ...prev,
                  uid: user.id,
                  displayName: dName!,
                  photoURL: photoURL,
                  provider: pName,
                  email: user.email || prev.email,
                  isAnonymous: false,
                }));

                await safeUpsertProfile(supabase, {
                  id: user.id,
                  display_name: dName!,
                  avatar_url: photoURL,
                  provider: pName,
                  email: user.email || undefined,
                });

                setAllProfiles(prev => prev.map(p => p.uid === user.id ? {
                  ...p,
                  displayName: dName!,
                  photoURL: photoURL,
                  provider: pName,
                  email: user.email || p.email,
                  lastActiveAt: new Date().toISOString(),
                } : p));

                await loadSupabaseData(user.id);
              }
            }
          }
        } catch (err) {
          console.warn('[Capacitor App] Error processing deep link:', err);
        }
      }
    }).then(sub => {
      appUrlSub = sub;
    }).catch(err => {
      console.warn('[Capacitor App] addListener appUrlOpen error:', err);
    });

    return () => {
      if (appUrlSub && typeof appUrlSub.remove === 'function') {
        appUrlSub.remove();
      }
    };
  }, []);

  // 🔄 Automatic Remote Content Sync on Mount & App Foreground Resume
  useEffect(() => {
    refreshRemoteContent();

    let stateSub: any = null;
    if (Capacitor.isNativePlatform()) {
      CapacitorApp.addListener('appStateChange', async ({ isActive }) => {
        if (isActive) {
          refreshRemoteContent();

          // Check if user authenticated while in browser sheet
          if (supabase && isSupabaseConfigured) {
            try {
              const { data: { session } } = await supabase.auth.getSession();
              if (session?.user && !session.user.is_anonymous && session.user.id !== currentUser.uid) {
                await Browser.close().catch(() => {});
                setIsLoginModalOpen(false);
                setIsGuestBrowse(true);
                showToast('💬 카카오 계정으로 로그인되었습니다!', 'success');
                await loadSupabaseData(session.user.id);
              }
            } catch (e) {}
          }

          if (currentUser.uid) {
            loadSupabaseData(currentUser.uid);
          }
        }
      }).then(sub => {
        stateSub = sub;
      }).catch(() => {});
    }

    const handleFocus = () => {
      refreshRemoteContent();
      if (currentUser.uid) {
        loadSupabaseData(currentUser.uid);
      }
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        handleFocus();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (stateSub && typeof stateSub.remove === 'function') {
        stateSub.remove();
      }
    };
  }, [currentUser.uid]);

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
  const DEFAULT_EMPTY_EVENT: PromotionEvent = {
    id: '',
    title: '진행 중인 이벤트가 없습니다.',
    subtitle: '',
    badge: '이벤트',
    category: '이벤트',
    bannerImage: '',
    startDate: '',
    endDate: '',
    dDay: '',
    status: 'ended',
    description: '',
    reward: '',
    actionButtonText: '확인',
    participantsCount: 0,
    isParticipated: false,
    createdAt: ''
  };
  const selectedEvent = events.find(e => e.id === selectedEventId) || events[0] || DEFAULT_EMPTY_EVENT;
  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  const isPopStateRef = React.useRef(false);

  // URL Browser History Sync Helper
  const updateBrowserUrl = (
    tab: ActiveTab,
    prodId?: string,
    category?: ProductCategory,
    brand?: string | null,
    eventId?: string | null,
    replace: boolean = false
  ) => {
    if (typeof window === 'undefined') return;
    if (isPopStateRef.current) {
      isPopStateRef.current = false;
      return;
    }

    // Preserve policy / legal paths like /privacy
    const currentPath = window.location.pathname;
    if (currentPath !== '/' && currentPath !== '' && currentPath !== '/index.html') {
      return;
    }

    const params = new URLSearchParams();

    if (tab === 'detail' && prodId) {
      const prod = findProductByCodeOrId(products, prodId);
      const code = prod ? getProductCode(prod) : prodId;
      params.set('p', code);
    } else if (tab === 'event_detail' && eventId) {
      params.set('event', eventId);
    } else if (tab === 'brand') {
      params.set('tab', 'brand');
      if (brand) params.set('b', brand);
    } else if (tab === 'category') {
      params.set('tab', 'category');
      if (category && category !== '전체') params.set('cat', category);
    } else if (tab === 'ranking') {
      params.set('tab', 'ranking');
    } else if (tab === 'coupon') {
      params.set('tab', 'coupon');
    } else if (tab === 'calendar' || (tab as string) === 'sale') {
      params.set('tab', 'sale');
    } else if (tab === 'community') {
      params.set('tab', 'community');
    } else if (tab === 'my') {
      params.set('tab', 'my');
    } else if (tab === 'search') {
      params.set('tab', 'search');
    } else if (tab === 'alert_settings') {
      params.set('tab', 'alert_settings');
    } else if (tab === 'settings') {
      params.set('tab', 'settings');
    } else if (tab === 'compare') {
      params.set('tab', 'compare');
    } else if (tab === 'write') {
      params.set('tab', 'write');
    } else if (tab === 'admin') {
      params.set('tab', 'admin');
    } else {
      // Home tab - clean URL
    }

    const query = params.toString();
    const targetUrl = query ? `${currentPath || '/'}?${query}` : (currentPath || '/');
    const currentFull = window.location.pathname + window.location.search;

    if (currentFull !== targetUrl) {
      if (replace) {
        window.history.replaceState({ tab, prodId, category, brand, eventId }, '', targetUrl);
      } else {
        window.history.pushState({ tab, prodId, category, brand, eventId }, '', targetUrl);
      }
    }
  };

  // Listen to browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      isPopStateRef.current = true;
      const params = new URLSearchParams(window.location.search);
      const p = params.get('p') || params.get('product') || params.get('code');
      const tab = params.get('tab') as ActiveTab | null;
      const cat = params.get('cat') || params.get('category');
      const brand = params.get('b') || params.get('brand');
      const event = params.get('event') || params.get('eventId');

      if (p) {
        const matched = findProductByCodeOrId(products, p);
        if (matched) {
          setSelectedProductId(matched.id);
        } else {
          setSelectedProductId(p);
        }
        setActiveTabState('detail');
      } else if (event) {
        setSelectedEventId(event);
        setActiveTabState('event_detail');
      } else if (tab) {
        if (tab === 'brand') {
          setSelectedBrandState(brand || null);
        }
        if (tab === 'category') {
          setSelectedCategoryState((cat as ProductCategory) || '전체');
        }
        setActiveTabState((tab as string) === 'sale' ? 'calendar' : tab);
      } else {
        setActiveTabState('home');
        setSelectedBrandState(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products]);

  // Initial URL deep link resolution on products load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const p = params.get('p') || params.get('product') || params.get('code');
    if (p && products.length > 0) {
      const matched = findProductByCodeOrId(products, p);
      if (matched && matched.id !== selectedProductId) {
        setSelectedProductId(matched.id);
      }
    }
  }, [products]);

  const setActiveTab = (tab: ActiveTab) => {
    setPreviousTab(activeTab);
    setActiveTabState(tab);
    updateBrowserUrl(tab, undefined, selectedCategory, selectedBrand, selectedEventId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setSelectedCategory = (cat: ProductCategory) => {
    setSelectedCategoryState(cat);
    if (activeTab === 'category') {
      updateBrowserUrl('category', undefined, cat, selectedBrand, selectedEventId);
    }
  };

  const setSelectedBrand = (brand: string | null) => {
    setSelectedBrandState(brand);
    if (activeTab === 'brand') {
      updateBrowserUrl('brand', undefined, selectedCategory, brand, selectedEventId);
    }
  };

  const openBrandDetail = (brand: string) => {
    setSelectedBrandState(brand);
    setPreviousTab(activeTab);
    setActiveTabState('brand');
    updateBrowserUrl('brand', undefined, selectedCategory, brand, selectedEventId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (activeTab === 'brand') {
      if (selectedBrand) {
        setSelectedBrandState(null);
        updateBrowserUrl('brand', undefined, selectedCategory, null, selectedEventId);
        return;
      }
      const target = previousTab === activeTab ? 'home' : previousTab;
      setActiveTabState(target);
      updateBrowserUrl(target, undefined, selectedCategory, null, selectedEventId);
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
      const target = previousTab === activeTab ? 'home' : previousTab;
      setActiveTabState(target);
      updateBrowserUrl(target, undefined, selectedCategory, selectedBrand, null);
    } else {
      setActiveTabState('home');
      updateBrowserUrl('home', undefined, selectedCategory, selectedBrand, null);
    }
  };

  // 📅 Calendar Handlers
  const toggleCalendarReminder = (id: string) => {
    const isAlready = calendarReminders.includes(id);
    let updated: string[];
    if (isAlready) {
      updated = calendarReminders.filter(rId => rId !== id);
    } else {
      updated = [...calendarReminders, id];
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
    const isAlready = savedSaleIds.includes(id);
    let updated: string[];
    if (isAlready) {
      updated = savedSaleIds.filter(sId => sId !== id);
    } else {
      updated = [...savedSaleIds, id];
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
    showToast('🥪 나만의 신상 꿀조합 레시피가 등록되었습니다!', 'success');
  };

  const openProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    setPreviousTab(activeTab);
    setActiveTabState('detail');
    updateBrowserUrl('detail', productId, selectedCategory, selectedBrand, selectedEventId);
  };

  const openEventDetail = (eventId: string) => {
    setSelectedEventId(eventId);
    setPreviousTab(activeTab);
    setActiveTabState('event_detail');
    updateBrowserUrl('event_detail', undefined, selectedCategory, selectedBrand, eventId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (_message: string, _type: 'success' | 'info' | 'error' = 'success') => {
    // Disabled all popup notification texts per user request
  };

  const removeToast = (_id: string) => {
    // No-op
  };

  const toggleBookmark = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isBookmarked = bookmarkedIds.includes(productId);
    if (isBookmarked) {
      setBookmarkedIds(prev => prev.filter(id => id !== productId));
    } else {
      setBookmarkedIds(prev => [...prev, productId]);
    }
  };

  const toggleCompare = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isCompared = comparedIds.includes(productId);
    if (isCompared) {
      setComparedIds(prev => prev.filter(id => id !== productId));
    } else {
      if (comparedIds.length >= 3) {
        showToast('비교함에는 최대 3개까지 담을 수 있습니다.', 'error');
        return;
      }
      setComparedIds(prev => [...prev, productId]);
    }
  };

  const removeFromCompare = (productId: string) => {
    setComparedIds(prev => prev.filter(id => id !== productId));
  };

  const clearCompare = () => {
    setComparedIds([]);
  };

  const toggleAlertCategory = (cat: string) => {
    if (alertCategories.includes(cat)) {
      setAlertCategories(prev => prev.filter(c => c !== cat));
    } else {
      setAlertCategories(prev => [...prev, cat]);
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

  // 닉네임 중복 여부 확인
  const isNicknameTaken = (nickname: string, excludeUid?: string): boolean => {
    const trimmed = nickname.trim().toLowerCase();
    if (!trimmed) return false;
    return allProfiles.some(
      p => p.uid !== excludeUid && (p.displayName || '').trim().toLowerCase() === trimmed
    );
  };

  const updateUserProfile = async (updates: { displayName?: string; photoURL?: string }) => {
    const trimmed = updates.displayName?.trim();
    const photo = updates.photoURL;

    // 닉네임 중복 체크 (자기 자신 제외)
    if (trimmed && isNicknameTaken(trimmed, currentUser.uid)) {
      throw new Error('이미 다른 회원이 사용 중인 닉네임입니다.');
    }

    setCurrentUser(prev => ({
      ...prev,
      displayName: trimmed || prev.displayName,
      photoURL: photo !== undefined ? photo : prev.photoURL,
    }));

    // Synchronize local reviews and community posts with updated profile
    if (trimmed || photo !== undefined) {
      setReviews(prev => prev.map(r => {
        const isMine = (r.userId && r.userId === currentUser.uid) || (r.userName === currentUser.displayName);
        if (isMine) {
          return {
            ...r,
            userName: trimmed || r.userName,
            userAvatar: photo !== undefined ? photo : r.userAvatar,
          };
        }
        return r;
      }));

      setCommunityPosts(prev => prev.map(p => {
        const isMine = ((p as any).userId && (p as any).userId === currentUser.uid) || (p.author === currentUser.displayName);
        if (isMine) {
          return {
            ...p,
            author: trimmed || p.author,
            authorAvatar: photo !== undefined ? photo : p.authorAvatar,
          };
        }
        return p;
      }));
    }

    if (trimmed) {
      try {
        localStorage.setItem('sinsangpick_name', trimmed);
        localStorage.setItem('sinsangpick_custom_nickname_' + currentUser.uid, 'true');
      } catch (e) {
        console.warn('Failed to save nickname to localStorage', e);
      }
    }

    if (photo !== undefined) {
      try {
        localStorage.setItem('sinsangpick_photo', photo);
        if (photo === DEFAULT_AVATAR || photo === '/logo.png') {
          localStorage.removeItem('sinsangpick_custom_photo_' + currentUser.uid);
        } else {
          localStorage.setItem('sinsangpick_custom_photo_' + currentUser.uid, 'true');
        }
      } catch (e) {
        console.warn('Failed to save photo to localStorage', e);
      }
    }

    if (supabase && isSupabaseConfigured) {
      try {
        const dbUpdates: any = {};
        if (trimmed) dbUpdates.display_name = trimmed;
        if (photo !== undefined) dbUpdates.avatar_url = photo;
        await supabase
          .from('profiles')
          .update(dbUpdates)
          .eq('id', currentUser.uid);

        if (trimmed) {
          await supabase
            .from('reviews')
            .update({ user_name: trimmed })
            .eq('user_id', currentUser.uid);

          await supabase
            .from('community_posts')
            .update({ author: trimmed })
            .eq('author_id', currentUser.uid);
        }
      } catch (err) {
        console.warn('[Supabase] Failed to update profile:', err);
      }
    }

    setAllProfiles(prev =>
      prev.map(p => {
        if (p.uid === currentUser.uid) {
          return {
            ...p,
            ...(trimmed ? { displayName: trimmed } : {}),
            ...(photo !== undefined ? { photoURL: photo } : {}),
          };
        }
        return p;
      })
    );

    if (trimmed && photo === undefined) {
      showToast('닉네임이 성공적으로 변경되었습니다.', 'success');
    } else if (photo !== undefined && !trimmed) {
      showToast('프로필 사진이 성공적으로 변경되었습니다.', 'success');
    } else {
      showToast('프로필이 성공적으로 변경되었습니다.', 'success');
    }
  };

  const updateUserNickname = async (newName: string) => {
    await updateUserProfile({ displayName: newName });
  };

  const updateUserPhoto = async (newPhotoURL: string) => {
    await updateUserProfile({ photoURL: newPhotoURL });
  };

  const loginWithApple = async () => {
    try {
      if (!supabase || !isSupabaseConfigured) {
        const demoUid = 'apple_' + Math.random().toString(36).substring(2, 9);
        const nextNickname = await getNextSequentialNickname(supabase, allProfiles);
        const demoUser: UserProfile = {
          uid: demoUid,
          displayName: nextNickname,
          photoURL: DEFAULT_AVATAR,
          level: 'Lv.1',
          points: 100,
          isAnonymous: false,
          provider: 'apple',
          email: 'user@icloud.com',
        };
        setCurrentUser(demoUser);
        localStorage.setItem('sinsangpick_uid', demoUid);
        localStorage.setItem('sinsangpick_name', demoUser.displayName);
        localStorage.setItem('sinsangpick_points', '100');
        localStorage.setItem('sinsangpick_nickname_set_' + demoUid, 'true');
        setAllProfiles(prev => [demoUser, ...prev.filter(p => p.uid !== demoUid)]);
        setIsLoginModalOpen(false);
        setIsGuestBrowse(true);
        checkAndOpenPostLoginModals(demoUid);
        showToast('🍎 Apple 계정으로 로그인되었습니다!', 'success');
        return;
      }

      const res: any = await supabaseSignInWithApple();

      if (res && res.user) {
        const u = res.user;
        const uid = u.id || u.uid;

        const isWithdrawn = (() => {
          try {
            const list = JSON.parse(localStorage.getItem('sinsangpick_withdrawn_uids') || '[]');
            return list.includes(uid) || localStorage.getItem('sinsangpick_withdrawn_uid_' + uid) === 'true';
          } catch { return false; }
        })();

        if (isWithdrawn) {
          localStorage.removeItem('sinsangpick_name');
          localStorage.removeItem('sinsangpick_points');
          localStorage.removeItem('sinsangpick_withdrawn_uid_' + uid);
          try {
            const list = JSON.parse(localStorage.getItem('sinsangpick_withdrawn_uids') || '[]');
            const filtered = list.filter((id: string) => id !== uid);
            localStorage.setItem('sinsangpick_withdrawn_uids', JSON.stringify(filtered));
          } catch {}
        }

        // Check if user already has an established custom nickname
        let assignedName = isWithdrawn ? null : localStorage.getItem('sinsangpick_name');
        if (
          !assignedName ||
          assignedName.includes('사용자') ||
          assignedName === '신상러버' ||
          /^신상러버_[a-z0-9]{4}$/i.test(assignedName)
        ) {
          try {
            const { data: dbProfile } = !isWithdrawn ? await supabase
              .from('profiles')
              .select('display_name')
              .eq('id', uid)
              .maybeSingle() : { data: null };
            if (
              dbProfile?.display_name &&
              !dbProfile.display_name.includes('사용자') &&
              dbProfile.display_name !== '신상러버'
            ) {
              assignedName = dbProfile.display_name;
            } else {
              assignedName = await getNextSequentialNickname(supabase, allProfiles);
            }
          } catch {
            assignedName = await getNextSequentialNickname(supabase, allProfiles);
          }
        }

        const photoURL = getProviderLogoUrl('apple');

        setCurrentUser(prev => ({
          ...prev,
          uid,
          displayName: assignedName!,
          photoURL: photoURL,
          level: 'Lv.1',
          points: 100,
          isAnonymous: false,
          email: u.email,
          provider: 'apple',
        }));

        localStorage.setItem('sinsangpick_uid', uid);
        localStorage.setItem('sinsangpick_name', assignedName!);
        localStorage.setItem('sinsangpick_points', '100');
        localStorage.setItem('sinsangpick_photo', photoURL);
        localStorage.setItem('sinsangpick_nickname_set_' + uid, 'true');
        setIsLoginModalOpen(false);
        setIsGuestBrowse(true);
        checkAndOpenPostLoginModals(uid);
        showToast('🍎 Apple 계정으로 로그인되었습니다!', 'success');

        await safeUpsertProfile(supabase, {
          id: uid,
          display_name: assignedName!,
          avatar_url: photoURL,
          provider: 'apple',
          email: u.email || undefined,
          points: 100,
          level: 'Lv.1',
        });

        setAllProfiles(prev => {
          const exists = prev.some(p => p.uid === uid);
          if (exists) {
            return prev.map(p => p.uid === uid ? {
              ...p,
              displayName: assignedName!,
              photoURL: photoURL,
              provider: 'apple',
              email: u.email || p.email,
              lastActiveAt: new Date().toISOString(),
            } : p);
          }
          return [{
            uid,
            displayName: assignedName!,
            photoURL: photoURL,
            level: 'Lv.1',
            points: 100,
            isAnonymous: false,
            provider: 'apple',
            email: u.email || undefined,
            createdAt: new Date().toISOString(),
            lastActiveAt: new Date().toISOString(),
            status: 'active',
            warningCount: 0,
            role: 'user',
          }, ...prev];
        });

        loadSupabaseData(uid);
      }
    } catch (err: any) {
      const errMsg = err?.message || String(err || '');
      if (
        errMsg.includes('1001') ||
        errMsg.toLowerCase().includes('cancel') ||
        errMsg.toLowerCase().includes('canceled') ||
        errMsg.toLowerCase().includes('cancelled')
      ) {
        console.log('[Auth] Apple login canceled by user');
        return;
      }
      console.error('Apple login error:', err);
      showToast('Apple 로그인 중 오류가 발생했습니다.', 'error');
    }
  };

  const loginWithGoogle = async () => {
    try {
      if (!supabase || !isSupabaseConfigured) {
        const demoUid = 'google_' + Math.random().toString(36).substring(2, 9);
        const nextNickname = await getNextSequentialNickname(supabase, allProfiles);
        const demoUser: UserProfile = {
          uid: demoUid,
          displayName: nextNickname,
          photoURL: DEFAULT_AVATAR,
          level: 'Lv.1',
          points: 100,
          isAnonymous: false,
          provider: 'google',
          email: 'user@gmail.com',
        };
        setCurrentUser(demoUser);
        localStorage.setItem('sinsangpick_uid', demoUid);
        localStorage.setItem('sinsangpick_name', demoUser.displayName);
        localStorage.setItem('sinsangpick_points', '100');
        localStorage.setItem('sinsangpick_nickname_set_' + demoUid, 'true');
        setIsLoginModalOpen(false);
        setIsGuestBrowse(true);
        checkAndOpenPostLoginModals(demoUid);
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
        const nextNickname = await getNextSequentialNickname(supabase, allProfiles);
        const demoUser: UserProfile = {
          uid: demoUid,
          displayName: nextNickname,
          photoURL: getProviderLogoUrl('kakao'),
          level: 'Lv.1',
          points: 100,
          isAnonymous: false,
          provider: 'kakao',
          email: 'user@kakao.com',
        };
        setCurrentUser(demoUser);
        localStorage.setItem('sinsangpick_uid', demoUid);
        localStorage.setItem('sinsangpick_name', demoUser.displayName);
        localStorage.setItem('sinsangpick_points', '100');
        localStorage.setItem('sinsangpick_nickname_set_' + demoUid, 'true');
        setAllProfiles(prev => [demoUser, ...prev.filter(p => p.uid !== demoUid)]);
        setIsLoginModalOpen(false);
        setIsGuestBrowse(true);
        checkAndOpenPostLoginModals(demoUid);
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
      deleteDeviceToken().catch(() => {});
      localStorage.removeItem('sinsangpick_uid');
      localStorage.removeItem('sinsangpick_name');
      localStorage.removeItem('sinsangpick_points');
      localStorage.removeItem('sinsangpick_photo');
      localStorage.removeItem('sinsangpick_user_profile');
      localStorage.removeItem('sinsangpick_guest_browse');
      setIsGuestBrowseState(false);
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
      const uidToDelete = currentUser.uid;

      // 0. 탈퇴 대상 UID를 로컬에 기록하여 재로그인 시 과거 캐시나 잔존 DB 프로필 복원 원천 차단
      try {
        localStorage.setItem('sinsangpick_withdrawn_uid_' + uidToDelete, 'true');
        const withdrawnList = JSON.parse(localStorage.getItem('sinsangpick_withdrawn_uids') || '[]');
        if (!withdrawnList.includes(uidToDelete)) {
          withdrawnList.push(uidToDelete);
          localStorage.setItem('sinsangpick_withdrawn_uids', JSON.stringify(withdrawnList));
        }
      } catch {}

      // 1. Supabase 원격 DB 및 Auth 사용자 영구 삭제 (테이블 직접 삭제 + 익명화 + Fallback Reset + RPC)
      if (supabase && isSupabaseConfigured) {
        try {
          // A. 사용자 부가 데이터 테이블 영구 삭제
          try { await supabase.from('device_tokens').delete().eq('user_id', uidToDelete); } catch {}
          try { await supabase.from('review_likes').delete().eq('user_id', uidToDelete); } catch {}
          try { await supabase.from('post_likes').delete().eq('user_id', uidToDelete); } catch {}
          try { await supabase.from('review_comments').delete().eq('user_id', uidToDelete); } catch {}
          try { await supabase.from('post_comments').delete().eq('user_id', uidToDelete); } catch {}
          try { await supabase.from('point_transactions').delete().eq('user_id', uidToDelete); } catch {}
          try { await supabase.from('bookmarks').delete().eq('user_id', uidToDelete); } catch {}

          // B. 작성한 리뷰 & 커뮤니티 게시글 일괄 영구 삭제
          try {
            await supabase.from('reviews').delete().eq('user_id', uidToDelete);
          } catch {}

          try {
            await supabase.from('community_posts').delete().eq('author_id', uidToDelete);
          } catch {}

          // C. 프로필 행 완전 삭제 시도
          try {
            const { error: delErr } = await supabase.from('profiles').delete().eq('id', uidToDelete);
            if (delErr) {
              console.warn('[Supabase] Profiles delete error:', delErr.message);
            }
          } catch {}

          // D. Fallback Reset (2중 방어): RLS 정책이나 외래키로 행이 완전히 삭제되지 않고 남아있더라도
          // 보유 포인트는 100P로 강제 초기화하고 닉네임/프로필 정보를 완전 백지화
          try {
            await supabase.from('profiles').update({
              display_name: '신상러버_' + Math.floor(100 + Math.random() * 900),
              avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
              points: 100,
              level: 'Lv.1',
              email: null,
              provider: 'anonymous',
              updated_at: new Date().toISOString(),
            }).eq('id', uidToDelete);
          } catch {}

          // E. Supabase Auth 사용자 영구 삭제 RPC 및 전역 로그아웃 실행
          await deleteCurrentUserAccount();
        } catch (err) {
          console.warn('[Supabase] Failed to delete user profile from DB:', err);
        }
      }

      // 디바이스 푸시 토큰 레코드 및 로컬 저장소 완전 파기
      try {
        await deleteDeviceToken();
      } catch {}

      // 2. 로컬 스토리지에 저장된 사용자 고유 데이터 및 캐시 일괄 영구 파기
      localStorage.removeItem('sinsangpick_uid');
      localStorage.removeItem('sinsangpick_name');
      localStorage.removeItem('sinsangpick_points');
      localStorage.removeItem('sinsangpick_photo');
      localStorage.removeItem('sinsangpick_user_profile');
      localStorage.removeItem('sinsangpick_bookmarks');
      localStorage.removeItem('sinsangpick_compared');
      localStorage.removeItem('sinsangpick_recent_searches');
      localStorage.removeItem('sinsangpick_alert_cats');
      localStorage.removeItem('sinsangpick_guest_browse');
      localStorage.removeItem('sinsangpick_permissions_reviewed');
      localStorage.removeItem('sinsangpick_battle_choice');
      localStorage.removeItem('sinsangpick_battle_round');
      localStorage.removeItem('sinsangpick_review_likes');
      localStorage.removeItem('sinsangpick_post_likes');
      localStorage.removeItem('sinsangpick_push_enabled');
      localStorage.removeItem('sinsangpick_marketing_agreed');
      localStorage.removeItem('sinsangpick_marketing_agreed_date');
      localStorage.removeItem('sinsangpick_nickname_onboarded');

      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (
            k &&
            (k.includes(uidToDelete) ||
              k.endsWith(`_${uidToDelete}`) ||
              k.startsWith('sb-') ||
              k.startsWith('sinsangpick_attendance_') ||
              k.startsWith('sinsangpick_wheel_spins_') ||
              k.startsWith('sinsangpick_scratch_cards_') ||
              k.startsWith('sinsangpick_custom_') ||
              k.startsWith('sinsangpick_nickname_set_') ||
              k.startsWith('sinsangpick_suspension_') ||
              k.startsWith('sinsangpick_points_tx_'))
          ) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
      } catch (e) {
        // ignore
      }

      // 3. allProfiles 및 pointTransactions 목록에서 탈퇴 유저 제거 및 로컬 스토리지 동기화
      setAllProfiles(prev => {
        const updated = prev.filter(p => p.uid !== uidToDelete);
        try {
          localStorage.setItem('sinsangpick_all_profiles', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      setPointTransactions(prev => {
        const updated = prev.filter(t => t.userId !== uidToDelete);
        try {
          localStorage.setItem('sinsangpick_point_transactions', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      // 탈퇴 회원이 작성한 모든 리뷰 및 커뮤니티 게시글 로컬 상태/스토리지에서 즉시 완전 삭제
      setReviews(prev => {
        const updated = prev.filter(r => r.userId !== uidToDelete && r.userName !== currentUser.displayName && r.userName !== '탈퇴한 회원');
        try {
          localStorage.setItem('sinsangpick_reviews', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      setCommunityPosts(prev => {
        const updated = prev.filter(p => (p as any).userId !== uidToDelete && p.author !== currentUser.displayName && p.author !== '탈퇴한 회원');
        try {
          localStorage.setItem('sinsangpick_posts', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      // 4. 앱 내부 상태 완전 초기화 (새로운 익명 유저, 기본 100P)
      setIsGuestBrowseState(false);
      const initialUser = createInitialUser();
      setCurrentUser(initialUser);
      setBookmarkedIds([]);
      setComparedIds([]);
      setRecentSearches([]);
      setAlertCategories([]);
      setLikedReviewIds([]);
      setLikedPostIds([]);
      setActiveTabState('home');
      showToast('회원 탈퇴 및 계정 삭제가 정상적으로 완료되었습니다.', 'info');
    } catch (err) {
      console.error('Delete account error:', err);
      showToast('계정 삭제 중 오류가 발생했습니다.', 'error');
      throw err;
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
    // 🚨 활동 정지 계정 검사
    const suspension = isCurrentUserSuspended();
    if (suspension.isSuspended) {
      showToast(`🚨 활동이 제한된 계정입니다. (${suspension.reason} / 기한: ${suspension.until})`, 'error');
      return;
    }

    const targetProduct = products.find(p => p.id === productId) || selectedProduct;
    const reviewId = 'rev-' + Date.now();
    const createdAt = new Date().toISOString();

    const newReview: Review = {
      id: reviewId,
      productId: targetProduct.id,
      productName: targetProduct.name,
      productImage: targetProduct.image,
      userId: currentUser.uid,
      userName: currentUser.displayName,
      userAvatar: currentUser.photoURL,
      userLevel: currentUser.level,
      rating,
      detailedRating,
      content: content ? content.slice(0, 300) : '맛있게 잘 먹었습니다! 적극 추천합니다.',
      images: images && images.length > 0 ? images : [],
      likes: 0,
      isLiked: false,
      commentsCount: 0,
      comments: [],
      createdAt,
      tags: tags && tags.length > 0 ? tags : ['#신상후기', '#내돈내산'],
      ...(extra || {}),
    };

    // 상품당 1회, 하루 한도 안에서만 적립 (사진·글자 수와 무관하게 동일)
    const alreadyReviewed = reviews.some(r => r.userId === currentUser.uid && r.productId === targetProduct.id);
    const earnedPoints = alreadyReviewed ? 0 : claimDailyReward(currentUser.uid, 'review', POINT_POLICY.review);

    // 1. Optimistic Updates
    const nextReviews = [newReview, ...reviews];
    setReviews(nextReviews);
    setProducts(prev => syncProductRatingsWithReviews(prev, nextReviews));

    const nextPoints = currentUser.points + earnedPoints;
    setCurrentUser(prev => ({
      ...prev,
      points: nextPoints,
      level: calculateLevel(nextPoints),
    }));

    const newTx: PointTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId: currentUser.uid,
      userName: currentUser.displayName,
      userAvatar: currentUser.photoURL,
      type: 'reward',
      amount: earnedPoints,
      balanceAfter: nextPoints,
      reason: `신제품 리뷰 작성 보너스 (${targetProduct.name})`,
      createdAt: new Date().toLocaleString('ko-KR', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      adminMemo: `리뷰 작성 (${rating}점${images && images.length > 0 ? ', 사진 포함' : ''})`
    };
    if (earnedPoints > 0) setPointTransactions(prev => [newTx, ...prev]);

    showToast(
      earnedPoints > 0
        ? `🎉 정성 가득 리뷰 등록 완료! (+${earnedPoints}P 적립)`
        : alreadyReviewed
          ? '🎉 리뷰 등록 완료! (포인트는 상품당 1회만 적립돼요)'
          : '🎉 리뷰 등록 완료! (오늘 적립 한도를 모두 채웠어요)',
      'success'
    );
    setSelectedProductId(targetProduct.id);
    setPreviousTab(activeTab);
    setActiveTabState('detail');
    updateBrowserUrl('detail', targetProduct.id, selectedCategory, selectedBrand, selectedEventId);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

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
    // 🚨 활동 정지 계정 검사
    const suspension = isCurrentUserSuspended();
    if (suspension.isSuspended) {
      showToast(`🚨 활동이 제한된 계정입니다. (${suspension.reason} / 기한: ${suspension.until})`, 'error');
      return;
    }

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
    showToast('💬 게시글이 등록되었습니다!', 'success');

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

  // ================= USER & ADMIN MODERATION FUNCTIONS =================
  // Update Review
  const updateReview = async (reviewId: string, updatedData: Partial<Review>) => {
    // 1. Local state update & product rating recalculation
    const updatedReviews = reviews.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          ...updatedData,
        };
      }
      return r;
    });
    setReviews(updatedReviews);
    setProducts(prev => syncProductRatingsWithReviews(prev, updatedReviews));

    // 3. Supabase update
    if (supabase && isSupabaseConfigured) {
      try {
        const dbUpdates: any = {};
        if (updatedData.content !== undefined) dbUpdates.content = updatedData.content;
        if (updatedData.rating !== undefined) dbUpdates.rating = updatedData.rating;
        if (updatedData.detailedRating !== undefined) dbUpdates.detailed_rating = updatedData.detailedRating;
        if (updatedData.images !== undefined) dbUpdates.images = updatedData.images;
        if (updatedData.tags !== undefined) dbUpdates.tags = updatedData.tags;

        // reviews 테이블에 없는 컬럼을 함께 보내면 수정 전체가 거부되므로 위 항목만 보냅니다.
        if (Object.keys(dbUpdates).length > 0) {
          reportSave(await updateRemoteReview(reviewId, dbUpdates), '리뷰 수정');
        }
      } catch (err) {
        console.warn('[Supabase] Review update error:', err);
      }
    }

    showToast('리뷰가 성공적으로 수정되었습니다.', 'success');
  };

  // Delete Review
  const deleteReview = async (reviewId: string) => {
    setDeletedReviewIds(prev => {
      const next = Array.from(new Set([...prev, reviewId]));
      safeSetItem('sinsangpick_deleted_reviews', JSON.stringify(next));
      return next;
    });
    const filteredReviews = reviews.filter(r => r.id !== reviewId);
    setReviews(filteredReviews);
    setProducts(prev => syncProductRatingsWithReviews(prev, filteredReviews));

    deleteRemoteReview(reviewId).then(r => reportSave(r, '리뷰 삭제'));
    showToast('리뷰가 정상적으로 삭제되었습니다.', 'info');
  };

  // Update Community Post
  const updateCommunityPost = async (postId: string, updatedData: Partial<CommunityPost>) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, ...updatedData };
      }
      return p;
    }));

    if (supabase && isSupabaseConfigured) {
      try {
        const dbUpdates: any = {};
        if (updatedData.title !== undefined) dbUpdates.title = updatedData.title;
        if (updatedData.content !== undefined) dbUpdates.content = updatedData.content;
        if (updatedData.category !== undefined) dbUpdates.category = updatedData.category;
        if (Object.keys(dbUpdates).length > 0) {
          reportSave(await updateRemoteCommunityPost(postId, dbUpdates), '게시글 수정');
        }
      } catch (err) {
        console.warn('[Supabase] Community post update error:', err);
      }
    }
    showToast('게시글이 성공적으로 수정되었습니다.', 'success');
  };

  // Delete Community Post
  const deleteCommunityPost = async (postId: string) => {
    setDeletedPostIds(prev => {
      const next = Array.from(new Set([...prev, postId]));
      safeSetItem('sinsangpick_deleted_posts', JSON.stringify(next));
      return next;
    });
    setCommunityPosts(prev => prev.filter(p => p.id !== postId));
    deleteRemoteCommunityPost(postId).then(r => reportSave(r, '게시글 삭제'));
    showToast('커뮤니티 게시글이 삭제되었습니다.', 'info');
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
    setEvents(prev => {
      const next = [newEvent, ...prev];
      safeSetItem('sinsangpick_events', JSON.stringify(next));
      // Supabase & 클라우드 API 영구 저장
      persistContent({ events: next, deletedEventIds: deletedEventIdsRef.current }, '체험단·이벤트');
      return next;
    });
    showToast(`🎉 '${newEvent.title}' 체험단 구좌가 성공적으로 등록되었습니다!`, 'success');
  };

  // Update Event
  const updateEvent = (id: string, updated: Partial<PromotionEvent>) => {
    setEvents(prev => {
      const next = prev.map(e => e.id === id ? { ...e, ...updated } : e);
      safeSetItem('sinsangpick_events', JSON.stringify(next));
      // Supabase & 클라우드 API 영구 저장
      persistContent({ events: next, deletedEventIds: deletedEventIdsRef.current }, '체험단·이벤트');
      return next;
    });
    showToast('체험단 구좌 정보가 수정되었습니다.', 'success');
  };

  // Delete Event
  const deleteEvent = (id: string) => {
    const nextDeleted = Array.from(new Set([...deletedEventIdsRef.current, id]));
    deletedEventIdsRef.current = nextDeleted;
    setDeletedEventIds(nextDeleted);
    safeSetItem('sinsangpick_deleted_events', JSON.stringify(nextDeleted));

    setEvents(prev => {
      const next = prev.filter(e => e.id !== id);
      safeSetItem('sinsangpick_events', JSON.stringify(next));
      // Supabase & 클라우드 API 영구 삭제 동기화
      persistContent({ events: next, deletedEventIds: nextDeleted }, '체험단·이벤트');
      return next;
    });
    showToast('체험단 구좌가 성공적으로 삭제되었습니다.', 'info');
  };

  // Reorder Events (체험단 구좌 노출 순서 변경)
  const reorderEvents = (newEvents: PromotionEvent[]) => {
    setEvents(newEvents);
    safeSetItem('sinsangpick_events', JSON.stringify(newEvents));
    // Supabase & 클라우드 API 영구 저장
    persistContent({ events: newEvents, deletedEventIds: deletedEventIdsRef.current }, '체험단·이벤트');
    showToast('체험단 구좌 노출 순서가 변경되었습니다.', 'info');
  };

  // Participate in Event
  const participateInEvent = (eventId: string) => {
    setEvents(prev => {
      const next = prev.map(e => {
        if (e.id === eventId) {
          return {
            ...e,
            isParticipated: true,
            participantsCount: (e.participantsCount || 0) + 1,
          };
        }
        return e;
      });
      safeSetItem('sinsangpick_events', JSON.stringify(next));
      return next;
    });
    showToast('🎁 이벤트 신청이 완료되었습니다!', 'success');
  };

  // Send Push Notification (Dispatches to Supabase Realtime & Device Push)
  const sendPushNotification = async (notif: {
    title: string;
    body: string;
    type: 'event' | 'product' | 'notice';
    targetId: string;
    imageUrl?: string;
    badge?: string;
    tokens?: string[];
  }) => {
    const nowIso = new Date().toISOString();
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title: notif.title,
      body: notif.body,
      type: notif.type,
      targetId: notif.targetId,
      imageUrl: notif.imageUrl,
      timestamp: nowIso,
      createdAt: nowIso,
      isRead: false,
      badge: notif.badge || (notif.type === 'event' ? '이벤트' : notif.type === 'product' ? '신제품' : '알림'),
    };

    // 로컬 상태 즉시 반영 (관리자 본인 화면에 즉각 표시)
    setNotifications(prev => {
      const next = [newNotif, ...prev];
      safeSetItem('sinsangpick_notifications', JSON.stringify(next));
      return next;
    });
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

    // 🚀 Supabase Realtime 및 디바이스 푸시로 전체 기기 브로드캐스트 전송
    try {
      const res = await sendAdminPushNotification({
        title: notif.title,
        body: notif.body,
        type: notif.type,
        targetId: notif.targetId,
        imageUrl: notif.imageUrl,
        badge: newNotif.badge,
        tokens: notif.tokens
      });
      if (res && res.success) {
        showToast('📢 푸시 알림이 모든 사용자 기기로 실시간 발송되었습니다!', 'success');
      } else {
        reportSave({ ok: false, error: res?.error }, '푸시 알림 발송');
      }
    } catch (err) {
      console.warn('[AppContext] sendPushNotification broadcast warning:', err);
    }
  };

  const dismissIncomingPush = () => {
    setIncomingPush(null);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => {
      const next = prev.map(n => n.id === id ? { ...n, isRead: true } : n);
      safeSetItem('sinsangpick_notifications', JSON.stringify(next));
      return next;
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => {
      const next = prev.filter(n => n.id !== id);
      safeSetItem('sinsangpick_notifications', JSON.stringify(next));
      return next;
    });
    // 서버에서도 지워야 다른 기기의 알림함에서 사라집니다.
    persistAdmin('delete_notification', { id }, '알림 삭제');
    showToast('알림 항목이 삭제되었습니다.', 'info');
  };

  const refreshNotifications = async () => {
    try {
      const remote = await fetchNotificationsFromSupabase();
      if (remote && remote.length > 0) {
        setNotifications(remote);
        localStorage.setItem('sinsangpick_notifications', JSON.stringify(remote));
        return;
      }
      const stored = localStorage.getItem('sinsangpick_notifications');
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    } catch {
      // fallback
    }
  };

  // 🔔 Supabase Realtime 알림 구독 및 디바이스 푸시 등록 초기화
  useEffect(() => {
    let channel: any = null;

    // 1. Supabase에서 최신 알림 내역 동기화
    fetchNotificationsFromSupabase().then(remoteNotifs => {
      if (remoteNotifs && remoteNotifs.length > 0) {
        setNotifications(prev => {
          const existingIds = new Set(prev.map(n => n.id));
          const newOnes = remoteNotifs.filter(n => !existingIds.has(n.id));
          return newOnes.length > 0 ? [...newOnes, ...prev] : prev;
        });
      }
    }).catch(err => {
      console.warn('[AppContext] fetchNotificationsFromSupabase warning:', err);
    });

    // 2. Supabase Realtime 채널 구독 (다른 기기나 관리자가 보낸 알림을 실시간 수신)
    channel = subscribeToNotifications((newNotif) => {
      console.log('[AppContext] Realtime notification received:', newNotif);
      setNotifications(prev => {
        if (prev.some(n => n.id === newNotif.id)) return prev;
        return [newNotif, ...prev];
      });
      setIncomingPush(newNotif);

      // 모바일 진동 햅틱 지원 시 실행
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([100, 50, 100]);
        } catch {}
      }
    });

    // 3. 디바이스 푸시 초기화 (권한 확인, APNs/FCM 토큰 발급 및 Supabase device_tokens 저장)
    initPushNotifications({
      userId: currentUser?.uid,
      userName: currentUser?.displayName,
      onNotificationReceived: (notif) => {
        console.log('[AppContext] Push notification received foreground:', notif);
        setNotifications(prev => {
          if (prev.some(n => n.id === notif.id)) return prev;
          return [notif, ...prev];
        });
        setIncomingPush(notif);
      },
      onNotificationActionPerformed: (targetId, type) => {
        if (type === 'event') {
          openEventDetail(targetId);
        } else if (type === 'product') {
          openProductDetail(targetId);
        }
      }
    });

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [currentUser?.uid, currentUser?.displayName]);

  const requestPushPermission = async (): Promise<boolean> => {
    try {
      const ok = await requestPushPermissionService();
      if (ok) {
        setPushPermissionStatus('granted');
        localStorage.setItem('sinsangpick_push_enabled', 'true');
        showToast('🔔 알림 수신이 허용되었습니다!', 'success');
        return true;
      } else {
        setPushPermissionStatus('denied');
        showToast('기기 알림 허용이 필요합니다.', 'info');
        return false;
      }
    } catch {
      return false;
    }
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
      const normalized = normalizeBanners(list);
      safeSetItem('sinsangpick_banners', JSON.stringify(normalized));
      // Cloud sync
      persistContent({ banners: normalized }, '배너');
      return normalized;
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
      const normalized = normalizeBanners(next);
      safeSetItem('sinsangpick_banners', JSON.stringify(normalized));
      // Cloud sync
      persistContent({ banners: normalized }, '배너');
      return normalized;
    });
    showToast('배너 구좌 정보가 수정되었습니다.', 'success');
  };

  // Delete Banner (남은 구좌 번호 1부터 자동 재배열 및 즉시 영구 저장, deletedBannerIds 등록)
  const deleteBanner = (id: string) => {
    const nextDeletedBanners = Array.from(new Set([...deletedBannerIdsRef.current, id]));
    deletedBannerIdsRef.current = nextDeletedBanners;
    setDeletedBannerIds(nextDeletedBanners);
    safeSetItem('sinsangpick_deleted_banners', JSON.stringify(nextDeletedBanners));

    setBanners(prev => {
      const normalized = normalizeBanners(prev.filter(b => b.id !== id));
      safeSetItem('sinsangpick_banners', JSON.stringify(normalized));
      // Cloud sync with both deletedProductIds and deletedBannerIds
      persistContent({ banners: normalized, deletedBannerIds: nextDeletedBanners }, '배너 삭제');
      return normalized;
    });
    showToast('배너 구좌가 삭제되었습니다.', 'info');
  };

  // Toggle Banner Active
  const toggleBannerActive = (id: string) => {
    setBanners(prev => {
      const next = prev.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b);
      const normalized = normalizeBanners(next);
      safeSetItem('sinsangpick_banners', JSON.stringify(normalized));
      // Cloud sync
      persistContent({ banners: normalized }, '배너');
      return normalized;
    });
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
      
      const normalized = normalizeBanners(newBanners);
      safeSetItem('sinsangpick_banners', JSON.stringify(normalized));
      // Cloud sync
      persistContent({ banners: normalized }, '배너');
      return normalized;
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
      
      const normalized = normalizeBanners(sorted);
      safeSetItem('sinsangpick_banners', JSON.stringify(normalized));
      // Cloud sync
      persistContent({ banners: normalized }, '배너');
      return normalized;
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
      const normalized = normalizeBanners(sorted);
      safeSetItem('sinsangpick_banners', JSON.stringify(normalized));
      // Cloud sync
      persistContent({ banners: normalized }, '배너');
      return normalized;
    });
    showToast('배너 구좌가 성공적으로 복제되었습니다!', 'success');
  };

  // Reorder Banners (일괄 순서 저장)
  const reorderBanners = (newBanners: BannerItem[]) => {
    const normalized = normalizeBanners(newBanners);
    safeSetItem('sinsangpick_banners', JSON.stringify(normalized));
    setBanners(normalized);
    // Cloud sync
    persistContent({ banners: normalized }, '배너');
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
      code: productData.code || generateNextProductCode(products, productData.category, productData.brand),
      name: productData.name,
      brand: productData.brand,
      category: productData.category,
      subCategory: productData.subCategory,
      itemType: productData.itemType || (isAgri ? 'fresh' : 'packaged'),
      image: finalImage,
      releaseDate: productData.releaseDate || new Date().toLocaleDateString('ko-KR') + ' 출시',
      createdAt: new Date().toISOString(),
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
    persistProducts([newProduct]);
    showToast(`📦 '${newProduct.name}' 상품이 등록되었습니다!`, 'success');
  };

  // Update Product
  const updateProduct = (id: string, updated: Partial<Product>) => {
    const current = products.find(p => p.id === id);
    if (!current) return;
    // 상태 업데이트 함수는 나중에 실행될 수 있어, 서버로 보낼 값은 여기서 바로 만듭니다.
    const updatedTarget: Product = { ...current, ...updated };
    setProducts(prev => {
      const next = prev.map(p => (p.id === id ? { ...p, ...updated } : p));
      safeSetItem('sinsangpick_products', JSON.stringify(next));
      return next;
    });
    persistProducts([updatedTarget]);
    showToast('상품 정보가 수정되었습니다.', 'success');
  };

  // Delete Product (Race-condition proof via ref and immediate cloud sync)
  const deleteProduct = (id: string) => {
    const nextDeleted = Array.from(new Set([...deletedProductIdsRef.current, id]));
    deletedProductIdsRef.current = nextDeleted;
    setDeletedProductIds(nextDeleted);
    safeSetItem('sinsangpick_deleted_products', JSON.stringify(nextDeleted));

    setProducts(prev => {
      const next = prev.filter(p => p.id !== id);
      safeSetItem('sinsangpick_products', JSON.stringify(next));
      return next;
    });
    persistProductDelete([id]);
    showToast('상품이 삭제되었습니다.', 'info');
  };

  // Bulk Delete Products
  const deleteProducts = (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    const nextDeleted = Array.from(new Set([...deletedProductIdsRef.current, ...ids]));
    deletedProductIdsRef.current = nextDeleted;
    setDeletedProductIds(nextDeleted);
    safeSetItem('sinsangpick_deleted_products', JSON.stringify(nextDeleted));

    const idSet = new Set(ids);
    setProducts(prev => {
      const next = prev.filter(p => !idSet.has(p.id));
      safeSetItem('sinsangpick_products', JSON.stringify(next));
      return next;
    });
    persistProductDelete(ids);
    showToast(`선택한 ${ids.length}개의 상품이 삭제되었습니다.`, 'info');
  };

  // Toggle Product Today
  const toggleProductToday = (id: string) => {
    setProducts(prev => {
      const next = prev.map(p => {
        if (p.id === id) {
          const nextToday = !p.isToday;
          const updated = { ...p, isToday: nextToday };
          persistProducts([updated]);
          return updated;
        }
        return p;
      });
      safeSetItem('sinsangpick_products', JSON.stringify(next));
      return next;
    });
    showToast('오늘의 신상 상태가 변경되었습니다.', 'info');
  };

  // Toggle Product Hot
  const toggleProductHot = (id: string) => {
    setProducts(prev => {
      const next = prev.map(p => {
        if (p.id === id) {
          const nextHot = !p.isHot;
          const updated = { ...p, isHot: nextHot };
          persistProducts([updated]);
          return updated;
        }
        return p;
      });
      safeSetItem('sinsangpick_products', JSON.stringify(next));
      return next;
    });
    showToast('인기 상품 상태가 변경되었습니다.', 'info');
  };

  // Update Battle Config
  const updateBattleConfig = (config: Partial<BattleConfig>) => {
    setBattleConfig(prev => {
      const next = { ...prev, ...config };
      safeSetItem('sinsangpick_battle_config', JSON.stringify(next));
      persistContent({ battleConfig: next }, '신상 배틀');
      return next;
    });
    showToast('신상 배틀 설정이 업데이트되었습니다.', 'success');
  };

  // Home Sections Management
  const updateHomeSection = (id: HomeSectionId, updates: Partial<HomeSectionConfig>) => {
    setHomeSections(prev => {
      const next = prev.map(sec => sec.id === id ? { ...sec, ...updates } : sec);
      safeSetItem('sinsangpick_home_sections', JSON.stringify(next));
      persistContent({ homeSections: next }, '홈 구좌');
      return next;
    });
    showToast('홈 구좌 설정이 업데이트되었습니다.', 'success');
  };

  const toggleHomeSectionVisibility = (id: HomeSectionId) => {
    setHomeSections(prev => {
      const next = prev.map(sec => {
        if (sec.id === id) {
          const nextState = !sec.isVisible;
          showToast(`'${sec.name}' 구좌가 ${nextState ? '활성화' : '비활성화'}되었습니다.`, 'info');
          return { ...sec, isVisible: nextState };
        }
        return sec;
      });
      safeSetItem('sinsangpick_home_sections', JSON.stringify(next));
      persistContent({ homeSections: next }, '홈 구좌');
      return next;
    });
  };

  const reorderHomeSections = (sections: HomeSectionConfig[]) => {
    const updated = sections.map((s, idx) => ({ ...s, order: idx + 1 }));
    setHomeSections(updated);
    safeSetItem('sinsangpick_home_sections', JSON.stringify(updated));
    persistContent({ homeSections: updated }, '홈 구좌');
    showToast('홈 구좌 순서가 변경되었습니다.', 'success');
  };

  const resetHomeSections = () => {
    setHomeSections(INITIAL_HOME_SECTIONS);
    safeSetItem('sinsangpick_home_sections', JSON.stringify(INITIAL_HOME_SECTIONS));
    persistContent({ homeSections: INITIAL_HOME_SECTIONS }, '홈 구좌');
    showToast('홈 구좌 설정이 기본값으로 초기화되었습니다.', 'info');
  };

  // --- Admin Brand Actions ---
  const addBrand = (brandData: Omit<BrandInfo, 'id'> & { id?: string }) => {
    const newId = brandData.id?.trim() || `brand_${Date.now()}`;
    const newBrand: BrandInfo = {
      ...brandData,
      id: newId,
      name: brandData.name.trim(),
      category: brandData.category || '간편식·스낵',
      slogan: brandData.slogan || '',
      logo: brandData.logo || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80',
      isPopular: brandData.isPopular ?? false,
    };
    setBrands(prev => {
      const next = [newBrand, ...prev];
      safeSetItem('sinsangpick_brands_v1', JSON.stringify(next));
      persistContent({ brands: next }, '브랜드');
      return next;
    });
    showToast(`🏢 '${newBrand.name}' 브랜드가 등록되었습니다.`, 'success');
  };

  const updateBrand = (id: string, updated: Partial<BrandInfo>) => {
    setBrands(prev => {
      const next = prev.map(b => b.id === id ? { ...b, ...updated } : b);
      safeSetItem('sinsangpick_brands_v1', JSON.stringify(next));
      persistContent({ brands: next }, '브랜드');
      return next;
    });
    showToast('🏢 브랜드 정보가 업데이트되었습니다.', 'success');
  };

  const deleteBrand = (id: string) => {
    const target = brands.find(b => b.id === id);
    setBrands(prev => {
      const next = prev.filter(b => b.id !== id);
      safeSetItem('sinsangpick_brands_v1', JSON.stringify(next));
      persistContent({ brands: next }, '브랜드');
      return next;
    });
    showToast(`🏢 '${target?.name || ''}' 브랜드가 삭제되었습니다.`, 'info');
  };

  const toggleBrandPopular = (id: string) => {
    setBrands(prev => {
      const next = prev.map(b => b.id === id ? { ...b, isPopular: !b.isPopular } : b);
      safeSetItem('sinsangpick_brands_v1', JSON.stringify(next));
      persistContent({ brands: next }, '브랜드');
      return next;
    });
    showToast('인기 브랜드 상태가 변경되었습니다.', 'info');
  };

  // --- Admin Store Channel Actions ---
  const addStoreChannel = (storeData: Omit<StoreChannelInfo, 'id' | 'order'> & { id?: string; order?: number }) => {
    const newId = storeData.id?.trim() || `store_${Date.now()}`;
    const newStore: StoreChannelInfo = {
      ...storeData,
      id: newId,
      name: storeData.name.trim(),
      category: storeData.category || 'convenience',
      isActive: storeData.isActive ?? true,
      order: storeData.order ?? (storeChannels.length + 1),
    };
    setStoreChannels(prev => {
      const next = [...prev, newStore];
      safeSetItem('sinsangpick_stores_v1', JSON.stringify(next));
      persistContent({ storeChannels: next }, '판매처');
      return next;
    });
    showToast(`🏪 '${newStore.name}' 판매처가 등록되었습니다.`, 'success');
  };

  const updateStoreChannel = (id: string, updated: Partial<StoreChannelInfo>) => {
    setStoreChannels(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...updated } : s);
      safeSetItem('sinsangpick_stores_v1', JSON.stringify(next));
      persistContent({ storeChannels: next }, '판매처');
      return next;
    });
    showToast('🏪 판매처 정보가 업데이트되었습니다.', 'success');
  };

  const deleteStoreChannel = (id: string) => {
    const target = storeChannels.find(s => s.id === id);
    setStoreChannels(prev => {
      const next = prev.filter(s => s.id !== id);
      safeSetItem('sinsangpick_stores_v1', JSON.stringify(next));
      persistContent({ storeChannels: next }, '판매처');
      return next;
    });
    showToast(`🏪 '${target?.name || ''}' 판매처가 삭제되었습니다.`, 'info');
  };

  const toggleStoreChannelActive = (id: string) => {
    setStoreChannels(prev => {
      const next = prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s);
      safeSetItem('sinsangpick_stores_v1', JSON.stringify(next));
      persistContent({ storeChannels: next }, '판매처');
      return next;
    });
    showToast('판매처 노출 상태가 변경되었습니다.', 'info');
  };

  // --- Admin Sale Promotion Actions (with Cloud Sync) ---
  const addSalePromotion = (itemData: Omit<SalePromotionItem, 'id' | 'likeCount'> & { id?: string; likeCount?: number }) => {
    const newId = itemData.id?.trim() || `sale_${Date.now()}`;
    const newSale: SalePromotionItem = {
      ...itemData,
      id: newId,
      likeCount: itemData.likeCount ?? 0,
      badgeText: itemData.badgeText || itemData.dealType,
      dDay: itemData.dDay || '상시',
      description: itemData.description || '',
    };
    const next = [newSale, ...salePromotions];
    setSalePromotions(next);
    safeSetItem('sinsangpick_sales_v1', JSON.stringify(next));
    persistContent({ salePromotions: next }, '행사 소식');
    showToast(`🏷️ '${newSale.title}' 행사 소식이 등록되었습니다.`, 'success');
  };

  const addSalePromotionsBatch = (newItems: SalePromotionItem[]) => {
    if (!newItems || newItems.length === 0) return;
    const existingIds = new Set(salePromotions.map(s => s.id));
    const toAdd = newItems.filter(item => !existingIds.has(item.id));
    const next = [...toAdd, ...salePromotions];
    setSalePromotions(next);
    safeSetItem('sinsangpick_sales_v1', JSON.stringify(next));
    persistContent({ salePromotions: next }, '행사 소식');
    showToast(`🏷️ 총 ${toAdd.length}건의 행사가 클라우드에 일괄 등록되었습니다.`, 'success');
  };

  const updateSalePromotion = (id: string, updated: Partial<SalePromotionItem>) => {
    const next = salePromotions.map(s => s.id === id ? { ...s, ...updated } : s);
    setSalePromotions(next);
    safeSetItem('sinsangpick_sales_v1', JSON.stringify(next));
    persistContent({ salePromotions: next }, '행사 소식');
    showToast('🏷️ 행사 소식이 업데이트되었습니다.', 'success');
  };

  const deleteSalePromotion = (id: string) => {
    const target = salePromotions.find(s => s.id === id);
    const next = salePromotions.filter(s => s.id !== id);
    setSalePromotions(next);
    safeSetItem('sinsangpick_sales_v1', JSON.stringify(next));
    // 자동 수집분은 삭제 기록을 남겨 다음 수집 때 되살아나지 않게 합니다.
    persistContent({ salePromotions: next, ...(id.startsWith('sale-auto-') ? { deletedSaleIds: [id] } : {}) }, '행사 소식');
    showToast(`🏷️ '${target?.title || ''}' 행사가 삭제되었습니다.`, 'info');
  };

  const toggleSaleHot = (id: string) => {
    const next = salePromotions.map(s => s.id === id ? { ...s, isHot: !s.isHot } : s);
    setSalePromotions(next);
    safeSetItem('sinsangpick_sales_v1', JSON.stringify(next));
    persistContent({ salePromotions: next }, '행사 소식');
    showToast('🔥 핫딜 상태가 변경되었습니다.', 'info');
  };

  const refreshSalePromotionsFromStores = async () => {
    try {
      const res = await fetch('/api/crawl-discounts?action=cron', { headers: await getAdminAuthHeaders() });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success || !Array.isArray(json.salePromotions)) {
        throw new Error(json?.error || `HTTP ${res.status}`);
      }
      setSalePromotions(json.salePromotions);
      safeSetItem('sinsangpick_sales_v1', JSON.stringify(json.salePromotions));
      const summary = (json.stores as { store: string; ok: boolean; count: number }[])
        .map(s => `${s.store} ${s.ok ? `${s.count}건` : '실패'}`).join(' · ');
      showToast(`🏷️ 행사상품 수집 완료 — ${summary} (종료 ${json.removed}건 정리)`, 'success');
    } catch (e) {
      setAdminSaveError(`[행사 자동 수집] 실패 — ${e instanceof Error ? e.message : '알 수 없는 오류'}`);
    }
  };

  // --- Admin Calendar Actions ---
  const addCalendarItem = (itemData: Omit<ReleaseCalendarItem, 'id'> & { id?: string }) => {
    const newId = itemData.id?.trim() || `cal_${Date.now()}`;
    const newCalendar: ReleaseCalendarItem = {
      ...itemData,
      id: newId,
      stores: itemData.stores && itemData.stores.length > 0 ? itemData.stores : ['전국 편의점'],
      highlight: itemData.highlight || '',
      isUpcoming: itemData.isUpcoming ?? true,
    };
    setCalendarItems(prev => {
      const next = [newCalendar, ...prev];
      safeSetItem('sinsangpick_calendar_v1', JSON.stringify(next));
      persistContent({ calendarItems: next }, '출시 캘린더');
      return next;
    });
    showToast(`📅 '${newCalendar.name}' 출시 일정이 등록되었습니다.`, 'success');
  };

  const updateCalendarItem = (id: string, updated: Partial<ReleaseCalendarItem>) => {
    setCalendarItems(prev => {
      const next = prev.map(c => c.id === id ? { ...c, ...updated } : c);
      safeSetItem('sinsangpick_calendar_v1', JSON.stringify(next));
      persistContent({ calendarItems: next }, '출시 캘린더');
      return next;
    });
    showToast('📅 출시 일정이 업데이트되었습니다.', 'success');
  };

  const deleteCalendarItem = (id: string) => {
    const target = calendarItems.find(c => c.id === id);
    setCalendarItems(prev => {
      const next = prev.filter(c => c.id !== id);
      safeSetItem('sinsangpick_calendar_v1', JSON.stringify(next));
      persistContent({ calendarItems: next }, '출시 캘린더');
      return next;
    });
    showToast(`📅 '${target?.name || ''}' 일정이 삭제되었습니다.`, 'info');
  };

  // --- 신제품 수집·승인 대기함 (Admin) ---

  const handlePendingError = (err: unknown, fallback: string) => {
    const message = err instanceof Error && err.message ? err.message : fallback;
    if (err instanceof PendingApiError && err.code === 'TABLE_MISSING') setPendingSetupError(message);
    showToast(message, 'error');
  };

  // 1. 대기함 목록 새로고침
  const refreshPendingProducts = async () => {
    try {
      const { items, naverConfigured } = await fetchPendingProducts('pending');
      setPendingProducts(items);
      setIsNaverCollectAvailable(naverConfigured);
      setPendingSetupError(null);
    } catch (err) {
      if (err instanceof PendingApiError && err.code === 'TABLE_MISSING') setPendingSetupError(err.message);
      else console.warn('[Pending Products] 목록 조회 실패:', err);
    }
  };

  // 2. 수집 실행 (편의점 공식 신상품 / 네이버 뉴스) — 서버가 중복을 걸러 새 항목만 대기함에 저장
  const collectNewProducts = async (source: CollectSource, query?: string): Promise<CollectReport[]> => {
    try {
      const reports = await collectPendingProducts(source, query);
      await refreshPendingProducts();
      return reports;
    } catch (err) {
      handlePendingError(err, '신제품 수집에 실패했습니다.');
      return [];
    }
  };

  // 3. 승인 — 서버가 products 테이블에 등록하고 대기 상태를 approved로 바꾼 뒤 화면에 반영
  const approvePendingProducts = async (pendingIds: string[]): Promise<number> => {
    const targets = pendingProducts.filter(p => pendingIds.includes(p.id) && p.image);
    if (targets.length === 0) {
      showToast('승인할 수 있는 상품이 없습니다. 이미지가 없는 상품은 먼저 이미지를 등록해주세요.', 'info');
      return 0;
    }

    const stamp = Date.now();
    try {
      const approved = await approvePendingItems(
        targets.map((p, idx) => ({ pendingId: p.id, productId: `prod-appr-${stamp}-${idx}` }))
      );
      const productIdByPending = new Map(approved.map(a => [a.pendingId, a.productId]));

      // 평점·후기는 실제 사용자 리뷰로만 채워집니다.
      const newProducts: Product[] = targets
        .filter(p => productIdByPending.has(p.id))
        .map(p => ({
          id: productIdByPending.get(p.id)!,
          name: p.name,
          brand: p.brand,
          category: p.category,
          subCategory: p.subCategory,
          itemType: p.itemType || 'packaged',
          image: p.image,
          releaseDate: p.releaseDate,
          createdAt: new Date().toISOString(),
          price: p.price,
          discountRate: p.discountRate || 0,
          overallRating: 0,
          ratingCount: 0,
          detailedRating: { taste: 0, value: 0, portion: 0, repurchase: 0 },
          description: p.description,
          stores: p.stores,
          calories: p.calories,
          volume: p.volume,
          nutrition: p.nutrition,
          ingredients: p.ingredients,
          allergens: p.allergens,
          isToday: true,
          isHot: false,
          sourceName: p.sourceName,
          sourceUrl: p.sourceUrl,
        }));

      setProducts(prev => [...newProducts, ...prev]);
      setPendingProducts(prev => prev.filter(p => !productIdByPending.has(p.id)));

      const skipped = pendingIds.length - newProducts.length;
      showToast(
        `✅ ${newProducts.length}건을 승인해 앱에 등록했습니다.${skipped > 0 ? ` (이미지 없음 등 ${skipped}건 제외)` : ''}`,
        'success'
      );
      return newProducts.length;
    } catch (err) {
      handlePendingError(err, '승인 처리에 실패했습니다.');
      return 0;
    }
  };

  // 4. 반려 — 반려 이력이 남아 같은 상품이 다시 수집되지 않음
  const rejectPendingProducts = async (pendingIds: string[]): Promise<void> => {
    if (pendingIds.length === 0) return;
    try {
      await setPendingStatus(pendingIds, 'rejected');
      setPendingProducts(prev => prev.filter(p => !pendingIds.includes(p.id)));
      showToast(`${pendingIds.length}건을 반려했습니다. 반려한 상품은 다시 수집되지 않습니다.`, 'info');
    } catch (err) {
      handlePendingError(err, '반려 처리에 실패했습니다.');
    }
  };

  // 5. 대기 상품 정보 수정
  const updatePendingProduct = async (pendingId: string, updated: Partial<PendingProduct>): Promise<boolean> => {
    try {
      await updatePendingItem(pendingId, updated);
      setPendingProducts(prev => prev.map(p => p.id === pendingId ? { ...p, ...updated } : p));
      return true;
    } catch (err) {
      handlePendingError(err, '대기 상품 수정에 실패했습니다.');
      return false;
    }
  };

  // 6. 대기함에 직접 추가
  const addPendingProduct = async (item: PendingProduct): Promise<boolean> => {
    try {
      await addPendingItems([item]);
      await refreshPendingProducts();
      return true;
    } catch (err) {
      handlePendingError(err, '대기함에 추가하지 못했습니다.');
      return false;
    }
  };

  // 7. 승인 취소 — 등록된 상품을 앱에서 내리고 대기함으로 되돌림
  const revokeAllApprovedProducts = async (ids: string[]): Promise<void> => {
    const targets = products.filter(p => ids.includes(p.id));
    if (targets.length === 0) {
      showToast('승인 취소할 상품이 없습니다.', 'info');
      return;
    }

    const stamp = Date.now();
    const restored: PendingProduct[] = targets.map((product, idx) => ({
      id: `revoked-${stamp}-${idx}`,
      name: product.name,
      brand: product.brand,
      category: product.category,
      subCategory: product.subCategory,
      itemType: product.itemType || 'packaged',
      image: product.image,
      price: product.price,
      discountRate: product.discountRate || 0,
      releaseDate: product.releaseDate,
      stores: product.stores || [],
      description: product.description || '',
      sourceName: '승인 취소 (관리자)',
      sourceUrl: product.sourceUrl,
      crawledAt: new Date().toISOString(),
      status: 'pending',
      calories: product.calories,
      volume: product.volume,
      nutrition: product.nutrition,
      ingredients: product.ingredients,
      allergens: product.allergens,
    }));

    try {
      await addPendingItems(restored);
    } catch (err) {
      handlePendingError(err, '승인 취소에 실패했습니다.');
      return;
    }

    // 클라우드 재동기화로 상품이 되살아나지 않도록 삭제 목록에 기록
    const targetIds = targets.map(p => p.id);
    const nextDeleted = Array.from(new Set([...deletedProductIdsRef.current, ...targetIds]));
    deletedProductIdsRef.current = nextDeleted;
    setDeletedProductIds(nextDeleted);
    safeSetItem('sinsangpick_deleted_products', JSON.stringify(nextDeleted));

    setProducts(prev => prev.filter(p => !targetIds.includes(p.id)));
    persistProductDelete(targetIds);
    setPendingProducts(prev => [...restored, ...prev]);
    showToast(`↩️ ${targets.length}건의 승인을 취소하고 대기함으로 되돌렸습니다.`, 'info');
  };

  const revokeApprovedProduct = (productId: string) => revokeAllApprovedProducts([productId]);

  // 서버에 저장된 제재 상태 → 회원 프로필 필드
  const sanctionFields = (sanction: any, existingP?: UserProfile) => sanction
    ? {
        status: (sanction.status || 'active') as UserAccountStatus,
        warningCount: Number(sanction.warning_count) || 0,
        suspendedUntil: sanction.suspended_until || undefined,
        statusReason: sanction.reason || undefined,
        statusUpdatedAt: sanction.updated_at || undefined,
      }
    : { status: existingP?.status || ('active' as UserAccountStatus), warningCount: existingP?.warningCount || 0 };

  // 신고·제품 수정 요청·회원 제재·포인트 내역을 서버에서 불러옵니다. (테이블이 아직 없으면 기기 값 유지)
  const refreshModeration = async () => {
    const result = await adminApi('list_moderation');
    if (!result.ok) {
      if (result.code !== 'SIGNED_OUT' && result.code !== 'UNAUTHORIZED') reportSave(result, '신고·제재 내역 조회');
      return;
    }
    const { reports: reportRows, editRequests, sanctions, pointTransactions: txRows } = result.data || {};

    if (Array.isArray(reportRows)) {
      setReports(reportRows.map((row: any) => ({ ...row.data, id: row.id, status: row.status })));
    }
    if (Array.isArray(editRequests)) {
      setProductEditRequests(editRequests.map((row: any) => ({ ...row.data, id: row.id, status: row.status })));
    }
    if (Array.isArray(sanctions)) {
      sanctionsRef.current = new Map(sanctions.map((row: any) => [row.user_id, row]));
      setAllProfiles(prev => prev.map(u => {
        const sanction = sanctionsRef.current.get(u.uid);
        return sanction ? { ...u, ...sanctionFields(sanction, u) } : u;
      }));
    }
    if (Array.isArray(txRows)) {
      const serverIds = new Set(txRows.map((row: any) => row.id));
      setPointTransactions(prev => {
        const names = new Map(allProfiles.map(u => [u.uid, u]));
        const fromServer: PointTransaction[] = txRows.map((row: any) => ({
          id: row.id,
          userId: row.user_id,
          userName: names.get(row.user_id)?.displayName || '회원',
          userAvatar: names.get(row.user_id)?.photoURL,
          type: row.type,
          amount: row.amount,
          balanceAfter: row.balance_after,
          reason: row.reason || '',
          createdAt: new Date(row.created_at).toLocaleString('ko-KR', {
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
          }),
          adminMemo: row.admin_memo || undefined,
        }));
        // 관리자 지급/회수 내역은 서버가 원본, 그 외(본인 적립 등)는 기기 내역 유지
        const localOnly = prev.filter(t => !serverIds.has(t.id) && t.type !== 'grant' && t.type !== 'revoke');
        return [...fromServer, ...localOnly];
      });
    }
  };

  // 서버 저장이 막혀 있던 동안 이 기기에만 남은 관리자 수정분(상품·삭제 목록·브랜드 등)을 한 번 서버로 올립니다.
  const publishLocalAdminEdits = async () => {
    if (!supabase || !isSupabaseConfigured) return;
    const { data: sysRow, error: sysErr } = await supabase
      .from('products')
      .select('nutrition')
      .eq('id', SYSTEM_BANNER_RECORD_ID)
      .maybeSingle();
    if (sysErr) return;
    const remote = sysRow?.nutrition || {};
    if (remote.adminLocalSyncedAt) return;

    const { data: dbRows, error } = await supabase.from('products').select('*').neq('id', SYSTEM_BANNER_RECORD_ID);
    if (error || !dbRows) return;

    // 다른 기기(서버 기준)에서 보이는 값과 다른 상품만 올립니다.
    const initialMap = new Map(INITIAL_PRODUCTS.map(p => [p.id, p]));
    const serverView = new Map<string, Product>();
    dbRows.forEach((row: any) => {
      const mapped = definedOnly(mapDBProductToProduct(row)) as Product;
      const initial = initialMap.get(row.id);
      // loadSupabaseData 와 같은 규칙: 임시(unsplash) 이미지는 기본 상품 이미지로 대체되어 보입니다.
      const image = mapped.image && !mapped.image.includes('unsplash') ? mapped.image : (initial?.image || mapped.image);
      serverView.set(row.id, { ...(initial || {}), ...mapped, image } as Product);
    });
    const changed = products.filter(p => {
      const base = serverView.get(p.id) || initialMap.get(p.id);
      return !base || hasAdminEditDiff(p, base);
    });

    for (let i = 0; i < changed.length; i += 15) {
      const result = await saveRemoteProducts(changed.slice(i, i + 15));
      if (!reportSave(result, '기존 상품 수정분 올리기')) return;
    }

    await persistContent({
      ...(Array.isArray(remote.brands) ? {} : { brands }),
      ...(Array.isArray(remote.storeChannels) ? {} : { storeChannels }),
      ...(Array.isArray(remote.calendarItems) ? {} : { calendarItems }),
      ...(remote.battleConfig ? {} : { battleConfig }),
      ...(Array.isArray(remote.events) ? {} : { events }),
      deletedProductIds: deletedProductIdsRef.current,
      deletedBannerIds: deletedBannerIdsRef.current,
      deletedEventIds: deletedEventIdsRef.current,
      adminLocalSyncedAt: new Date().toISOString(),
    }, '기존 수정분 올리기');
  };

  // 어드민 화면 진입 시 1회 실행
  const initAdminSession = async () => {
    if (!(await isAdminSession())) return;
    await publishLocalAdminEdits();
    await refreshModeration();
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

          const sanitizeProfileData = (dbP: any, existingP?: UserProfile, defaultIdx = 1) => {
            const inferredProv = resolveUserProfileProvider(dbP, existingP, currentUser);

            // 닉네임 정제: 실명("서현정", "이예진") 또는 누락값은 무조건 신상러버_XXX로 변환
            let dName = dbP.display_name || existingP?.displayName || '';
            if (dName === '서현정') dName = '신상러버_002';
            else if (dName === '이예진') dName = '신상러버_003';
            else if (!dName || dName === '신상러버' || dName.includes('사용자')) {
              dName = existingP?.displayName || `신상러버_${String(defaultIdx).padStart(3, '0')}`;
            }

            // 프로필 사진 정제: 커스텀 업로드가 아니거나 unsplash/소셜 원본이면 getProviderLogoUrl 적용
            let pUrl = dbP.avatar_url || existingP?.photoURL || '';
            if (!pUrl || !isValidCustomPhoto(pUrl, dbP.id) || pUrl === DEFAULT_AVATAR) {
              pUrl = getProviderLogoUrl(inferredProv);
            }

            return { dName, pUrl, inferredProv };
          };

          // DB에 실제로 등록된 회원들만 매핑하여 순수 실제 회원 목록 구성
          const realUsers: UserProfile[] = dbAllProfiles
            .filter(p => !FAKE_USER_UIDS.has(p.id))
            .map((p, idx) => {
              const existingP = prev.find(ep => ep.uid === p.id);
              const { dName, pUrl, inferredProv } = sanitizeProfileData(p, existingP, idx + 1);
              return {
                uid: p.id,
                displayName: dName,
                photoURL: pUrl,
                points: p.points ?? existingP?.points ?? 100,
                level: calculateLevel(p.points ?? existingP?.points ?? 100),
                email: p.email || existingP?.email || undefined,
                provider: inferredProv,
                createdAt: p.created_at || existingP?.createdAt || new Date().toISOString(),
                lastActiveAt: p.last_active_at || p.updated_at || existingP?.lastActiveAt || undefined,
                ...sanctionFields(sanctionsRef.current.get(p.id), existingP),
                role: p.is_admin ? 'admin' : 'user'
              };
            });

          return realUsers;
        });

        // 🩺 Self-Healing: 어드민에서 유저 목록 조회 시, 현재 로그인된 세션이 소셜인데 DB에 anonymous로 남아있다면 DB provider 즉시 자동 보정
        if (currentUser?.uid && ['apple', 'kakao', 'google'].includes(currentUser.provider || '')) {
          safeUpsertProfile(supabase, {
            id: currentUser.uid,
            display_name: currentUser.displayName,
            avatar_url: currentUser.photoURL,
            provider: currentUser.provider,
            email: currentUser.email || undefined,
          }).catch(() => {});
        }
      }
    } catch (e) {
      console.warn('[Supabase fetchAllProfiles error]', e);
    }
  };

  // 사용자 최근 활동/접속 일시 갱신 (DAU 및 최근 활동 통계)
  const recordUserActivity = (uid?: string) => {
    const targetUid = uid || currentUser.uid;
    if (!targetUid || targetUid === 'guest_anonymous') return;
    const nowIso = new Date().toISOString();
    setAllProfiles(prev => prev.map(p => p.uid === targetUid ? { ...p, lastActiveAt: nowIso } : p));
    if (currentUser.uid === targetUid) {
      setCurrentUser(prev => ({ ...prev, lastActiveAt: nowIso }));
    }
    try {
      localStorage.setItem('sinsangpick_last_active_' + targetUid, nowIso);
    } catch {}
    if (supabase && isSupabaseConfigured) {
      Promise.resolve(supabase.from('profiles').update({ last_active_at: nowIso, updated_at: nowIso }).eq('id', targetUid)).catch(() => {});
    }
  };

  // 포인트 지급(+)/회수(-): 서버가 현재 잔액 기준으로 계산해 저장한 결과만 화면에 반영합니다.
  const adjustPointsByAdmin = async (
    userIds: string[],
    delta: number,
    reason: string,
    memo: string | undefined
  ): Promise<{ userId: string; before: number; after: number }[] | null> => {
    const result = await adminApi('adjust_points', { ids: userIds, delta, reason, memo });
    if (!reportSave(result, delta > 0 ? '포인트 지급' : '포인트 회수')) return null;

    const balances: { userId: string; before: number; after: number }[] = result.data?.balances || [];
    const balanceMap = new Map(balances.map(b => [b.userId, b]));
    const nowStr = new Date().toLocaleString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
    });

    setAllProfiles(prev => prev.map(u => {
      const b = balanceMap.get(u.uid);
      return b ? { ...u, points: b.after, level: calculateLevel(b.after) } : u;
    }));

    const own = balanceMap.get(currentUser.uid);
    if (own) {
      setCurrentUser(prev => ({ ...prev, points: own.after, level: calculateLevel(own.after) }));
    }

    setPointTransactions(prev => [
      ...balances.map((b, idx): PointTransaction => {
        const target = allProfiles.find(u => u.uid === b.userId);
        return {
          id: `tx_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 8)}`,
          userId: b.userId,
          userName: target?.displayName || '회원',
          userAvatar: target?.photoURL,
          type: delta > 0 ? 'grant' : 'revoke',
          amount: b.after - b.before,
          balanceAfter: b.after,
          reason,
          createdAt: nowStr,
          adminMemo: memo,
        };
      }),
      ...prev,
    ]);

    return balances;
  };

  const grantUserPoints = async (userId: string, amount: number, reason: string, memo?: string) => {
    if (amount <= 0) {
      showToast('지급할 포인트를 1P 이상 입력해주세요.', 'error');
      return;
    }
    await adjustPointsByAdmin([userId], Math.abs(amount), reason || '관리자 포인트 특별 지급', memo);
  };

  const revokeUserPoints = async (userId: string, amount: number, reason: string, memo?: string) => {
    if (amount <= 0) {
      showToast('회수할 포인트를 1P 이상 입력해주세요.', 'error');
      return;
    }
    await adjustPointsByAdmin([userId], -Math.abs(amount), reason || '관리자 포인트 회수/차감', memo);
  };

  const batchGrantPoints = async (userIds: string[], amount: number, reason: string, memo?: string) => {
    if (userIds.length === 0 || amount <= 0) {
      showToast('지급할 회원과 1P 이상의 포인트를 입력해주세요.', 'error');
      return;
    }
    await adjustPointsByAdmin(userIds, Math.abs(amount), reason || '관리자 일괄 포인트 지급', memo);
  };

  const batchRevokePoints = async (userIds: string[], amount: number, reason: string, memo?: string) => {
    if (userIds.length === 0 || amount <= 0) {
      showToast('회수할 회원과 1P 이상의 포인트를 입력해주세요.', 'error');
      return;
    }
    await adjustPointsByAdmin(userIds, -Math.abs(amount), reason || '관리자 일괄 포인트 회수', memo);
  };

  // 🚨 회원 상태 관리 (정상 / 경고 / 기간정지 / 영구정지)
  const updateUserStatus = async (
    userId: string,
    newStatus: UserAccountStatus,
    options?: { warningDelta?: number; suspendDays?: number; reason?: string; adminMemo?: string }
  ): Promise<void> => {
    const now = new Date();
    let suspendedUntil: string | undefined = undefined;

    if (newStatus === 'suspended') {
      const days = options?.suspendDays || 7;
      const untilDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      suspendedUntil = untilDate.toISOString();
    } else if (newStatus === 'banned') {
      suspendedUntil = 'permanent';
    } else if (newStatus === 'active') {
      suspendedUntil = undefined;
    }

    setAllProfiles(prev => prev.map(u => {
      if (u.uid === userId) {
        const nextWarningCount = Math.max(0, (u.warningCount || 0) + (options?.warningDelta || 0));
        return {
          ...u,
          status: newStatus,
          warningCount: newStatus === 'active' && options?.warningDelta === undefined ? 0 : nextWarningCount,
          suspendedUntil: newStatus === 'active' ? undefined : (suspendedUntil || u.suspendedUntil),
          statusReason: options?.reason || u.statusReason || (newStatus === 'active' ? undefined : '관리자 제재 조치'),
          statusUpdatedAt: now.toISOString(),
        };
      }
      return u;
    }));

    if (currentUser.uid === userId) {
      setCurrentUser(prev => ({
        ...prev,
        status: newStatus,
        warningCount: newStatus === 'active' && options?.warningDelta === undefined ? 0 : Math.max(0, (prev.warningCount || 0) + (options?.warningDelta || 0)),
        suspendedUntil: newStatus === 'active' ? undefined : (suspendedUntil || prev.suspendedUntil),
        statusReason: options?.reason || prev.statusReason,
        statusUpdatedAt: now.toISOString(),
      }));
    }

    persistAdmin('set_user_status', {
      ids: [userId],
      status: newStatus,
      warningDelta: options?.warningDelta,
      suspendedUntil,
      reason: options?.reason || (newStatus === 'active' ? undefined : '관리자 제재 조치'),
    }, '회원 상태');

    const statusLabel = 
      newStatus === 'active' ? '정상 복원' :
      newStatus === 'warned' ? '경고 부여' :
      newStatus === 'suspended' ? `${options?.suspendDays || 7}일 이용 정지` : '영구 이용 정지';
    
    showToast(`회원 상태를 [${statusLabel}]으로 업데이트했습니다.`, 'success');
  };

  const batchUpdateUserStatus = async (
    userIds: string[],
    newStatus: UserAccountStatus,
    options?: { warningDelta?: number; suspendDays?: number; reason?: string; adminMemo?: string }
  ): Promise<void> => {
    for (const uid of userIds) {
      await updateUserStatus(uid, newStatus, options);
    }
    showToast(`총 ${userIds.length}명의 회원 상태를 [${newStatus}]으로 일괄 변경했습니다.`, 'info');
  };

  // 현재 로그인 회원의 제재/정지 여부 조회
  const isCurrentUserSuspended = (): { isSuspended: boolean; reason: string; until?: string } => {
    const prof = allProfiles.find(u => u.uid === currentUser.uid) || currentUser;
    if (prof.status === 'banned') {
      return {
        isSuspended: true,
        reason: prof.statusReason || '운영 정책 위반으로 인한 영구 정지',
        until: '영구 제한'
      };
    }
    if (prof.status === 'suspended') {
      if (prof.suspendedUntil && prof.suspendedUntil !== 'permanent') {
        const untilDate = new Date(prof.suspendedUntil).getTime();
        if (Date.now() < untilDate) {
          return {
            isSuspended: true,
            reason: prof.statusReason || '운영 정책 위반으로 인한 일시 정지',
            until: new Date(prof.suspendedUntil).toLocaleDateString('ko-KR')
          };
        }
      } else {
        return {
          isSuspended: true,
          reason: prof.statusReason || '운영 정책 위반으로 인한 이용 정지',
          until: '관리자 해제 시까지'
        };
      }
    }
    return { isSuspended: false, reason: '' };
  };

  // 🗑️ 관리자 회원 강제 삭제 — 서버가 작성 글·프로필·로그인 계정을 지운 뒤에만 목록에서 뺍니다.
  const batchDeleteUsersByAdmin = async (userIds: string[]): Promise<void> => {
    if (!userIds || userIds.length === 0) {
      showToast('삭제할 회원을 선택해주세요.', 'error');
      return;
    }
    const ok = await persistAdmin('delete_users', { ids: userIds }, '회원 삭제');
    if (!ok) return;

    const idSet = new Set(userIds);
    setAllProfiles(prev => prev.filter(p => !idSet.has(p.uid)));
    setPointTransactions(prev => prev.filter(t => !idSet.has(t.userId)));
    showToast(`총 ${userIds.length}명의 회원이 삭제되었습니다.`, 'info');
  };

  const deleteUserByAdmin = (userId: string): Promise<void> => batchDeleteUsersByAdmin([userId]);

  // 🚨 신고 접수 액션
  const submitReport = async (reportData: Omit<ReportItem, 'id' | 'createdAt' | 'status'>): Promise<boolean> => {
    if (reportData.targetUserId && reportData.targetUserId === currentUser.uid) {
      showToast('⚠️ 본인이 작성한 콘텐츠는 신고할 수 없습니다.', 'error');
      return false;
    }

    const alreadyReported = reports.some(
      r => r.reporterId === currentUser.uid && r.targetId === reportData.targetId && r.status === 'pending'
    );
    if (alreadyReported) {
      showToast('ℹ️ 이미 접수되어 관리자 검토 대기 중인 신고입니다.', 'info');
      return false;
    }

    const newReport: ReportItem = {
      ...reportData,
      id: 'rep-' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setReports(prev => {
      const next = [newReport, ...prev];
      safeSetItem('sinsangpick_reports', JSON.stringify(next));
      return next;
    });

    if (reportData.targetType === 'review') {
      setReviews(prev => prev.map(r => r.id === reportData.targetId ? { ...r, isReported: true } : r));
    }

    // 관리자 신고함으로 전달 (reports 테이블)
    if (supabase && isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('reports').insert({
          id: newReport.id,
          status: 'pending',
          data: newReport,
          created_at: newReport.createdAt,
        });
        if (error) console.warn('[Supabase] report insert warning:', error.message);
      } catch (dbErr) {
        console.warn('[Supabase] report insert error:', dbErr);
      }
    }

    showToast('🚨 신고가 정상 접수되었습니다. 관리자 검토 후 신속히 조치됩니다.', 'success');
    return true;
  };

  // 🚨 관리자 신고 조치 (제재 및 리뷰 삭제 연동)
  const resolveReport = async (
    reportId: string, 
    action: ReportAction, 
    actionReason?: string, 
    adminMemo?: string
  ): Promise<void> => {
    const targetReport = reports.find(r => r.id === reportId);
    if (!targetReport) return;

    const resolvedAt = new Date().toISOString();

    setReports(prev => {
      const next = prev.map(r => {
        if (r.id === reportId) {
          return {
            ...r,
            status: 'resolved' as const,
            actionTaken: action,
            actionReason: actionReason || '운영 규정 위반 제재',
            adminMemo: adminMemo || r.adminMemo,
            resolvedAt,
          };
        }
        return r;
      });
      safeSetItem('sinsangpick_reports', JSON.stringify(next));
      return next;
    });

    persistAdmin('update_report', {
      id: reportId,
      updates: {
        status: 'resolved',
        actionTaken: action,
        actionReason: actionReason || '운영 규정 위반 제재',
        adminMemo: adminMemo || targetReport.adminMemo,
        resolvedAt,
      },
    }, '신고 처리');

    // 피신고자 제재 자동 적용
    if (targetReport.targetUserId) {
      const uid = targetReport.targetUserId;
      if (action === 'warning') {
        await updateUserStatus(uid, 'warned', {
          warningDelta: 1,
          reason: actionReason || `신고 접수([${targetReport.reason}])에 따른 경고 조치`,
          adminMemo: `신고 ${reportId} 처리`
        });
      } else if (action === 'suspend_7d') {
        await updateUserStatus(uid, 'suspended', {
          suspendDays: 7,
          reason: actionReason || `신고 접수([${targetReport.reason}])에 따른 7일 이용 정지`,
          adminMemo: `신고 ${reportId} 처리`
        });
      } else if (action === 'suspend_30d') {
        await updateUserStatus(uid, 'suspended', {
          suspendDays: 30,
          reason: actionReason || `신고 접수([${targetReport.reason}])에 따른 30일 이용 정지`,
          adminMemo: `신고 ${reportId} 처리`
        });
      } else if (action === 'permanent_ban') {
        await updateUserStatus(uid, 'banned', {
          reason: actionReason || `중대 운영 규정 위반으로 인한 영구 정지`,
          adminMemo: `신고 ${reportId} 처리`
        });
      }
    }

    // 제재 시 또는 delete_review 액션일 때 해당 리뷰 삭제/숨김
    if (targetReport.targetType === 'review' && action !== 'none') {
      await deleteReview(targetReport.targetId);
    }

    showToast('신고 건을 처리 완료하고 제재 조치를 적용했습니다.', 'success');
  };

  const dismissReport = async (reportId: string, reason?: string, adminMemo?: string): Promise<void> => {
    setReports(prev => {
      const next = prev.map(r => {
        if (r.id === reportId) {
          return {
            ...r,
            status: 'dismissed' as const,
            actionTaken: 'none' as const,
            actionReason: reason || '검토 결과 이상 없음 (정상 판정)',
            adminMemo: adminMemo || r.adminMemo,
            resolvedAt: new Date().toISOString(),
          };
        }
        return r;
      });
      safeSetItem('sinsangpick_reports', JSON.stringify(next));
      return next;
    });
    persistAdmin('update_report', {
      id: reportId,
      updates: {
        status: 'dismissed',
        actionTaken: 'none',
        actionReason: reason || '검토 결과 이상 없음 (정상 판정)',
        ...(adminMemo ? { adminMemo } : {}),
        resolvedAt: new Date().toISOString(),
      },
    }, '신고 반려');
    showToast('신고 건을 반려(이상 없음) 처리했습니다.', 'info');
  };

  const deleteReport = async (reportId: string): Promise<void> => {
    setReports(prev => {
      const next = prev.filter(r => r.id !== reportId);
      safeSetItem('sinsangpick_reports', JSON.stringify(next));
      return next;
    });
    persistAdmin('delete_report', { id: reportId }, '신고 삭제');
    showToast('신고 내역을 삭제했습니다.', 'info');
  };

  // ✏️ 제품 정보 수정 요청 접수
  const submitProductEditRequest = async (
    requestData: Omit<ProductEditRequest, 'id' | 'createdAt' | 'status'>
  ): Promise<boolean> => {
    try {
      const newRequest: ProductEditRequest = {
        ...requestData,
        id: 'edit-req-' + Date.now(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      setProductEditRequests(prev => {
        const next = [newRequest, ...prev];
        safeSetItem('sinsangpick_product_edit_requests', JSON.stringify(next));
        return next;
      });

      if (supabase && isSupabaseConfigured) {
        try {
          const { error } = await supabase.from('product_edit_requests').insert({
            id: newRequest.id,
            status: 'pending',
            data: newRequest,
            created_at: newRequest.createdAt
          });
          if (error) console.warn('Supabase product_edit_requests insert warning:', error.message);
        } catch (dbErr) {
          console.warn('Supabase product_edit_requests insert error:', dbErr);
        }
      }

      showToast('✨ 제품 정보 수정 요청이 관리자에게 접수되었습니다! 검토 후 신속히 반영하겠습니다.', 'success');
      return true;
    } catch (e) {
      showToast('수정 요청 접수 중 오류가 발생했습니다. 다시 시도해 주세요.', 'error');
      return false;
    }
  };

  // ✏️ 제품 수정 요청 승인 / 반영완료
  const resolveProductEditRequest = async (requestId: string, adminMemo?: string): Promise<void> => {
    const processedAt = new Date().toISOString();
    setProductEditRequests(prev => {
      const next = prev.map(req => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'approved' as const,
            adminMemo: adminMemo || req.adminMemo || '관리자 확인 및 상품 정보 반영 완료',
            processedAt
          };
        }
        return req;
      });
      safeSetItem('sinsangpick_product_edit_requests', JSON.stringify(next));
      return next;
    });
    persistAdmin('update_edit_request', {
      id: requestId,
      updates: { status: 'approved', adminMemo: adminMemo || '관리자 확인 및 상품 정보 반영 완료', processedAt },
    }, '수정 요청 처리');
    showToast('✅ 수정 요청을 [반영 완료]로 승인 처리했습니다.', 'success');
  };

  // ✏️ 제품 수정 요청 반려
  const rejectProductEditRequest = async (requestId: string, adminMemo?: string): Promise<void> => {
    const processedAt = new Date().toISOString();
    setProductEditRequests(prev => {
      const next = prev.map(req => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'rejected' as const,
            adminMemo: adminMemo || req.adminMemo || '확인 결과 기존 정보가 정확함 (반려)',
            processedAt
          };
        }
        return req;
      });
      safeSetItem('sinsangpick_product_edit_requests', JSON.stringify(next));
      return next;
    });
    persistAdmin('update_edit_request', {
      id: requestId,
      updates: { status: 'rejected', adminMemo: adminMemo || '확인 결과 기존 정보가 정확함 (반려)', processedAt },
    }, '수정 요청 반려');
    showToast('ℹ️ 수정 요청을 [반려] 처리했습니다.', 'info');
  };

  // ✏️ 제품 수정 요청 삭제
  const deleteProductEditRequest = async (requestId: string): Promise<void> => {
    setProductEditRequests(prev => {
      const next = prev.filter(req => req.id !== requestId);
      safeSetItem('sinsangpick_product_edit_requests', JSON.stringify(next));
      return next;
    });
    showToast('수정 요청 내역을 삭제했습니다.', 'info');
  };

  // 서버가 내려준 포인트 잔액을 로컬 상태에 반영 (교환 직후 예전 잔액으로 덮어쓰지 않도록)
  const applyServerPoints = (balance?: number | null) => {
    if (typeof balance !== 'number') return;
    setCurrentUser(prev => ({ ...prev, points: balance, level: calculateLevel(balance) }));
  };

  // 🎁 내가 교환한 e쿠폰 목록 불러오기
  const refreshPurchasedCoupons = async () => {
    try {
      const mine = await fetchMyCoupons();
      setPurchasedCoupons(mine ? mine.coupons : []);
    } catch (e) {
      console.warn('[coupon] 내 쿠폰 조회 실패:', e);
    }
  };

  // 🎁 e쿠폰 포인트 교환 (서버에서 포인트 차감 후 기프티쇼 쿠폰 발급)
  const purchaseCoupon = async (goodsCode: string): Promise<PurchasedECoupon | null> => {
    try {
      const result = await exchangeCoupon(goodsCode);
      applyServerPoints(result.balance);
      if (result.needLogin) {
        openLoginModal();
        return null;
      }
      if (!result.success || !result.coupon) {
        showToast(result.error || '쿠폰 교환에 실패했습니다.', 'error');
        return null;
      }
      const issued = result.coupon;
      setPurchasedCoupons(prev => [issued, ...prev]);
      showToast('🎁 e쿠폰 교환이 완료되었습니다!', 'success');
      return issued;
    } catch (e) {
      console.warn('[coupon] 교환 요청 실패:', e);
      showToast('네트워크 오류로 교환 결과를 확인하지 못했습니다. 내 쿠폰함을 확인해 주세요.', 'error');
      refreshPurchasedCoupons();
      return null;
    }
  };

  // 🎁 e쿠폰 사용 완료 처리 토글
  const useCoupon = async (purchasedCouponId: string) => {
    const target = purchasedCoupons.find(c => c.id === purchasedCouponId);
    if (!target) return;
    try {
      const updated = await setCouponUsed(purchasedCouponId, !target.isUsed);
      if (updated) {
        setPurchasedCoupons(prev => prev.map(c => (c.id === purchasedCouponId ? updated : c)));
      }
    } catch (e) {
      console.warn('[coupon] 사용 상태 변경 실패:', e);
      showToast('사용 상태를 변경하지 못했습니다.', 'error');
    }
  };

  useEffect(() => {
    refreshPurchasedCoupons();
  }, [currentUser.uid]);

  // 🎁 활동 리워드 포인트 지급 편의 함수
  const addTestPoints = (amount: number = 5000) => {
    const nextPoints = (currentUser.points || 0) + amount;
    setCurrentUser(prev => ({
      ...prev,
      points: nextPoints,
      level: calculateLevel(nextPoints),
    }));

    const nowStr = new Date().toLocaleString('ko-KR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });

    const newTx: PointTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId: currentUser.uid,
      userName: currentUser.displayName,
      userAvatar: currentUser.photoURL,
      type: 'reward',
      amount: amount,
      balanceAfter: nextPoints,
      reason: '신상픽 활동 리워드 보너스 포인트',
      createdAt: nowStr
    };
    setPointTransactions(prev => [newTx, ...prev]);
    showToast(`✨ 활동 리워드 포인트 +${amount.toLocaleString()}P가 적립되었습니다!`, 'success');
  };

  // Reset All to Defaults
  const resetAllDataToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setBanners(INITIAL_BANNERS);
    setBattleConfig(INITIAL_BATTLE_CONFIG);
    setEvents(INITIAL_EVENTS);
    setDeletedEventIds([]);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAllProfiles(INITIAL_USER_PROFILES);
    setPointTransactions(INITIAL_POINT_TRANSACTIONS);
    setReports(INITIAL_REPORTS);
    setPendingProducts([]);
    setBrands(POPULAR_BRANDS);
    setStoreChannels(INITIAL_STORE_CHANNELS);
    setSalePromotions([]);
    setCalendarItems(INITIAL_CALENDAR_ITEMS);
    setHomeSections(INITIAL_HOME_SECTIONS);
    setPurchasedCoupons([]);
    localStorage.removeItem('sinsangpick_coupons_v1');
    localStorage.removeItem('sinsangpick_user_coupons_v1');
    localStorage.removeItem('sinsangpick_products');
    localStorage.removeItem('sinsangpick_banners');
    localStorage.removeItem('sinsangpick_battle_config');
    localStorage.removeItem('sinsangpick_home_sections');
    localStorage.removeItem('sinsangpick_events');
    localStorage.removeItem('sinsangpick_deleted_events');
    localStorage.removeItem('sinsangpick_notifications');
    localStorage.removeItem('sinsangpick_all_profiles');
    localStorage.removeItem('sinsangpick_point_transactions');
    localStorage.removeItem('sinsangpick_brands_v1');
    localStorage.removeItem('sinsangpick_stores_v1');
    localStorage.removeItem('sinsangpick_sales_v1');
    localStorage.removeItem('sinsangpick_calendar_v1');
    localStorage.removeItem('sinsangpick_pending_products');
    localStorage.removeItem('sinsangpick_last_crawl_date');
    showToast('모든 데이터가 기본값으로 초기화되었습니다.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        products,
        reviews,
        communityPosts,
        banners,
        battleConfig,
        battleRound,
        battleChoice,
        battleVoteError,
        voteBattle,
        refreshBattleRound,
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
        networkError,
        isDataLoading,
        retrySync,

        // Home Sections
        homeSections,
        updateHomeSection,
        reorderHomeSections,
        toggleHomeSectionVisibility,
        resetHomeSections,

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
        updateUserPhoto,
        updateUserProfile,
        loginWithApple,
        loginWithGoogle,
        loginWithKakao,
        logout,
        deleteAccount,
        isLoginModalOpen,
        setIsLoginModalOpen,
        openLoginModal,
        isGuestBrowse,
        setIsGuestBrowse,
        isNicknameModalOpen,
        setIsNicknameModalOpen,
        completeNicknameSetup,
        isPermissionModalOpen,
        setIsPermissionModalOpen,
        openPermissionModal,

        // Events & Push Notifications
        pushPermissionStatus,
        requestPushPermission,
        refreshNotifications,
        deleteNotification,
        addEvent,
        updateEvent,
        deleteEvent,
        reorderEvents,
        participateInEvent,
        sendPushNotification,
        dismissIncomingPush,
        alertCenterSubTab,
        setAlertCenterSubTab,
        openNotificationCenter,
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
        deleteProducts,
        deletedProductIds,
        toggleProductToday,
        toggleProductHot,
        updateBattleConfig,
        resetAllDataToDefaults,

        // 🏢 Brands Management
        brands,
        addBrand,
        updateBrand,
        deleteBrand,
        toggleBrandPopular,

        // 🏪 Store Channels Master Management
        storeChannels,
        addStoreChannel,
        updateStoreChannel,
        deleteStoreChannel,
        toggleStoreChannelActive,

        // 신제품 수집·승인 대기함 (Admin)
        pendingProducts,
        pendingCount: pendingProducts.length,
        pendingSetupError,
        isNaverCollectAvailable,
        refreshPendingProducts,
        collectNewProducts,
        approvePendingProducts,
        rejectPendingProducts,
        updatePendingProduct,
        addPendingProduct,
        revokeApprovedProduct,
        revokeAllApprovedProducts,

        // User & Points Management
        allProfiles,
        pointTransactions,
        grantUserPoints,
        revokeUserPoints,
        batchGrantPoints,
        batchRevokePoints,
        fetchAllProfiles,
        recordUserActivity,
        deleteUserByAdmin,
        batchDeleteUsersByAdmin,
        isNicknameTaken,
        updateUserStatus,
        batchUpdateUserStatus,
        isCurrentUserSuspended,

        // 🚨 Reports & Moderation
        reports,
        submitReport,
        resolveReport,
        dismissReport,
        deleteReport,

        // ✏️ Product Edit Requests
        productEditRequests,
        submitProductEditRequest,
        resolveProductEditRequest,
        rejectProductEditRequest,
        deleteProductEditRequest,

        submitReview,
        updateReview,
        toggleLikeReview,
        addReviewComment,
        addCommunityPost,
        updateCommunityPost,
        toggleLikePost,
        addPostComment,
        deleteReview,
        deleteCommunityPost,

        // 📅 Calendar & 🏷️ Sale Promotions & 🥪 Recipes
        calendarItems,
        calendarReminders,
        toggleCalendarReminder,
        addCalendarItem,
        updateCalendarItem,
        deleteCalendarItem,

        salePromotions: activeSalePromotions,
        savedSaleIds,
        toggleSaveSale,
        addSalePromotion,
        addSalePromotionsBatch,
        updateSalePromotion,
        deleteSalePromotion,
        toggleSaleHot,
        refreshSalePromotionsFromStores,

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

        // Global Remote Content Sync
        isContentSyncing,
        syncAllContentToCloud,
        adminSaveError,
        clearAdminSaveError,
        initAdminSession,
        refreshRemoteContent,

        // KAMIS Agricultural & Marine Product Live Prices
        kamisPriceStatus,
        refreshKamisPrices,

        // 🎁 e쿠폰 스토어
        purchasedCoupons,
        refreshPurchasedCoupons,
        purchaseCoupon,
        applyServerPoints,
        useCoupon,
        addTestPoints,
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
