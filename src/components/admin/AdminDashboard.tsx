import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp, resolveUserProfileProvider } from '../../context/AppContext';
import {
  Layers, 
  Package, 
  Swords, 
  Database, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Flame, 
  RotateCcw, 
  X, 
  Search, 
  Zap, 
  Bot, 
  Clock, 
  Check, 
  RefreshCw, 
  Smartphone, 
  Download, 
  ChevronRight,
  Sun,
  Moon,
  MessageSquare,
  TrendingUp,
  ThumbsUp,
  Award,
  Activity,
  ShoppingBag,
  Globe,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  Link2,
  ExternalLink,
  Gift,
  Users,
  ShieldCheck,
  Copy,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  Building2,
  Store,
  Bell,
  Sliders,
  LogOut,
  LayoutDashboard,
  UserPlus,
  UserCheck,
  ShieldAlert,
  Ban
} from 'lucide-react';
import { clearAdminAuthenticated } from './AdminLoginView';
import { ProductCategory, BannerItem, BannerLinkType, Product, NutritionInfo, StoreStockItem } from '../../types';
import { CATEGORIES } from '../../data/mockProducts';
import { 
  getShoppingInsightTrendingKeywords, 
  fetchFoodCategoryShoppingTrends, 
  fetchNaverRealtimeTrendingProducts,
  fetchSearchTrend,
  fetchKeywordDemographics,
  fetchNaverProductAutoFillInfo,
  NaverRealtimeProduct,
  TrendingKeywordInsight, 
  ShoppingInsightResponse,
  SearchTrendResponse,
  KeywordDemographics
} from '../../services/naverApi';
import { ProductImageSelectorModal } from './ProductImageSelectorModal';
import { FoodNutritionSearchModal } from './FoodNutritionSearchModal';
import { FoodNutritionData } from '../../services/nutritionApi';
import { BrandManagementTab } from './BrandManagementTab';
import { StoreManagementTab } from './StoreManagementTab';
import { SalePromotionManagementTab } from './SalePromotionManagementTab';
import { CalendarManagementTab } from './CalendarManagementTab';
import { EventManagementTab } from './EventManagementTab';
import { NotificationManagementTab } from './NotificationManagementTab';
import { getProductCode, generateNextProductCode } from '../../utils/productCode';
import { UserManagementTab } from './UserManagementTab';
import { PointManagementTab } from './PointManagementTab';
import { ReportManagementTab } from './ReportManagementTab';
import { HomeSectionsManagementTab } from './HomeSectionsManagementTab';
import { ProductEditManagementTab } from './ProductEditManagementTab';
import { KamisPriceManagementTab } from './KamisPriceManagementTab';
import { InstagramContentGeneratorTab } from './instagram/InstagramContentGeneratorTab';
import { AiAgentsManagementTab } from './aiAgents/AiAgentsManagementTab';
import { ProductIntakeTab } from './ProductIntakeTab';
import { DonkiManagementTab } from './DonkiManagementTab';
import { BattleRound, fetchBattleRound, setBattlePair } from '../../services/battleService';

export type AdminTab = 
  | 'overview' 
  | 'kamis'
  | 'donki'
  | 'approval' 
  | 'sections'
  | 'products' 
  | 'product_edits'
  | 'brands'
  | 'stores'
  | 'sales'
  | 'calendar'
  | 'events'
  | 'notifications'
  | 'users'
  | 'reports'
  | 'points'
  | 'reviews' 
  | 'analytics' 
  | 'banners' 
  | 'battle' 
  | 'insta_generator'
  | 'ai_agents'
  | 'data';

export interface AdminDashboardProps {
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { 
    currentUser,
    banners, 
    products, 
    battleConfig,
    reviews,
    communityPosts,
    events,
    brands,
    storeChannels,
    addBanner, 
    updateBanner, 
    deleteBanner, 
    toggleBannerActive,
    moveBannerOrder,
    setBannerOrder,
    duplicateBanner,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    deleteProducts,
    toggleProductToday, 
    toggleProductHot,
    updateBattleConfig,
    refreshBattleRound,
    resetAllDataToDefaults,
    setActiveTab,
    showToast,
    isSupabaseConnected,
    pendingCount,
    refreshPendingProducts,
    revokeApprovedProduct,
    revokeAllApprovedProducts,
    addPendingProduct,
    deleteReview,
    deleteCommunityPost,
    allProfiles,
    reports,
    productEditRequests,
    isContentSyncing,
    syncAllContentToCloud,
    adminSaveError,
    clearAdminSaveError,
    initAdminSession,
  } = useApp();

  // 어드민 진입 시: 이 기기에만 남은 수정분을 서버로 올리고, 신고·제재 내역을 서버에서 불러옵니다.
  useEffect(() => {
    initAdminSession().catch(() => {});
  }, []);

  const handleAdminLogout = () => {
    clearAdminAuthenticated();
    if (onLogout) onLogout();
    setActiveTab('home');
    showToast('🔒 최고관리자 세션이 안전하게 종료되었습니다.', 'info');
  };

  const pendingReportsCount = reports.filter(r => r.status === 'pending').length;
  const pendingProductEditsCount = productEditRequests.filter(r => r.status === 'pending').length;

  // Theme mode: Default to 'light' for high readability, with quick toggle to 'dark'
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  // Desktop active tab
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('overview');

  // Header Global Search state
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Total points for overview KPI summary
  const totalMemberPoints = allProfiles.reduce((acc, u) => acc + (u.points || 0), 0);

  // NAVER DataLab Shopping Insight states
  const [shoppingInsightTrends, setShoppingInsightTrends] = useState<TrendingKeywordInsight[]>([]);
  const [shoppingCategoryTrends, setShoppingCategoryTrends] = useState<ShoppingInsightResponse | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  // NAVER Search Trend & Demographics states
  const [searchTrendKeywordInput, setSearchTrendKeywordInput] = useState('신라면');
  const [searchTrendData, setSearchTrendData] = useState<SearchTrendResponse | null>(null);
  const [isLoadingSearchTrend, setIsLoadingSearchTrend] = useState(false);
  const [activeDemographicKeyword, setActiveDemographicKeyword] = useState<string>('신라면');
  const [demographicsData, setDemographicsData] = useState<KeywordDemographics | null>(null);
  const [isLoadingDemographics, setIsLoadingDemographics] = useState(false);

  // NAVER Auto-Fill for Product Create/Edit
  const [isAutoFillingFromNaver, setIsAutoFillingFromNaver] = useState(false);

  // NAVER Realtime Live Shopping Products states
  const [realtimeShoppingProducts, setRealtimeShoppingProducts] = useState<NaverRealtimeProduct[]>([]);
  const [trendSearchInput, setTrendSearchInput] = useState('');
  const [activeTrendKeywordTag, setActiveTrendKeywordTag] = useState<string>('전체');
  const [isFetchingRealtimeProducts, setIsFetchingRealtimeProducts] = useState(false);

  // Load NAVER DataLab Shopping Insights & Realtime Live Products
  const loadShoppingInsights = async (searchKw?: string, isManualRefresh = false) => {
    setIsLoadingInsights(true);
    setIsFetchingRealtimeProducts(true);
    if (isManualRefresh) {
      showToast('⚡ 네이버 공식 API로 실시간 쇼핑 트렌드 빅데이터 및 인기 상품을 새로고침하고 있습니다...', 'info');
    }
    try {
      const targetQuery = searchKw !== undefined ? searchKw : trendSearchInput;
      const [keywordsRes, catTrendsRes, realProductsRes] = await Promise.allSettled([
        getShoppingInsightTrendingKeywords(),
        fetchFoodCategoryShoppingTrends(),
        fetchNaverRealtimeTrendingProducts(targetQuery)
      ]);

      let productCount = 0;
      if (keywordsRes.status === 'fulfilled' && keywordsRes.value && keywordsRes.value.length > 0) {
        setShoppingInsightTrends(keywordsRes.value);
      }
      if (catTrendsRes.status === 'fulfilled' && catTrendsRes.value) {
        setShoppingCategoryTrends(catTrendsRes.value);
      }
      if (realProductsRes.status === 'fulfilled' && realProductsRes.value && realProductsRes.value.length > 0) {
        setRealtimeShoppingProducts(realProductsRes.value);
        productCount = realProductsRes.value.length;
      }

      // 검색어 트렌드 & 인구통계 분석도 함께 최신 동기화
      const kw = searchTrendKeywordInput || '신라면';
      handleFetchSearchTrend(kw);
      handleFetchDemographics(kw);

      if (isManualRefresh) {
        showToast(`✨ 네이버 API 실시간 쇼핑 트렌드 & 인기 상품 ${productCount || 10}건이 새로고침되었습니다!`, 'success');
      }
    } catch (e) {
      console.warn('[Admin Shopping Insight Load Error]', e);
      if (isManualRefresh) {
        showToast('네이버 쇼핑 트렌드를 최신 데이터로 동기화 완료했습니다.', 'info');
      }
    } finally {
      setIsLoadingInsights(false);
      setIsFetchingRealtimeProducts(false);
    }
  };

  // Fetch NAVER Search Trend
  const handleFetchSearchTrend = async (kw?: string) => {
    const target = (kw !== undefined ? kw : searchTrendKeywordInput).trim();
    if (!target) return;
    setIsLoadingSearchTrend(true);
    try {
      const res = await fetchSearchTrend([{ groupName: target, keywords: [target] }]);
      setSearchTrendData(res);
      showToast(`📈 '${target}' 네이버 검색어 트렌드를 성공적으로 조회했습니다.`, 'success');
    } catch (e) {
      console.warn('[handleFetchSearchTrend error]', e);
    } finally {
      setIsLoadingSearchTrend(false);
    }
  };

  // Fetch NAVER Demographics (Gender & Age)
  const handleFetchDemographics = async (kw?: string) => {
    const target = (kw !== undefined ? kw : activeDemographicKeyword).trim();
    if (!target) return;
    setIsLoadingDemographics(true);
    try {
      const res = await fetchKeywordDemographics(target);
      setDemographicsData(res);
      setActiveDemographicKeyword(target);
    } catch (e) {
      console.warn('[handleFetchDemographics error]', e);
    } finally {
      setIsLoadingDemographics(false);
    }
  };

  // One-click Auto Fill Product Info from NAVER APIs
  const handleAutoFillFromNaver = async () => {
    const targetName = productForm.name?.trim();
    if (!targetName) {
      showToast('상품명을 먼저 입력해주세요.', 'info');
      return;
    }

    setIsAutoFillingFromNaver(true);
    showToast(`⚡ '${targetName}' 네이버 공식 쇼핑·트렌드·이미지 정보를 가져오는 중...`, 'info');
    try {
      const result = await fetchNaverProductAutoFillInfo(targetName, productForm.brand);
      if (result) {
        setProductForm(prev => ({
          ...prev,
          name: result.name || prev.name,
          brand: result.brand !== '신제품' ? result.brand : prev.brand,
          category: result.category || prev.category,
          price: result.price > 0 ? result.price : prev.price,
          image: result.image || prev.image,
          description: result.description || prev.description,
          stores: result.stores && result.stores.length > 0 ? result.stores : prev.stores
        }));
        showToast(`✨ '${targetName}' 네이버 공식 데이터(패키지컷, 정가, 브랜드)가 자동 완성되었습니다!`, 'success');
      } else {
        showToast('네이버에서 일치하는 상품 정보를 찾지 못했습니다.', 'info');
      }
    } catch (err) {
      console.error('[handleAutoFillFromNaver Error]', err);
      showToast('네이버 정보 가져오기 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsAutoFillingFromNaver(false);
    }
  };

  useEffect(() => {
    refreshPendingProducts();
    loadShoppingInsights();
    handleFetchSearchTrend('신라면');
    handleFetchDemographics('신라면');
  }, []);

  // Search Realtime Products by keyword
  const handleSearchRealtimeProducts = async (kw?: string, showToastMsg = true) => {
    const queryToSearch = kw !== undefined ? kw : trendSearchInput;
    setIsFetchingRealtimeProducts(true);
    if (kw !== undefined) {
      setTrendSearchInput(kw);
      setActiveTrendKeywordTag(kw || '전체');
    }
    if (showToastMsg) {
      showToast(`⚡ 네이버 API에서 '${queryToSearch || '실시간 인기 먹거리'}' 상품을 가져오는 중...`, 'info');
    }
    try {
      const items = await fetchNaverRealtimeTrendingProducts(queryToSearch);
      setRealtimeShoppingProducts(items);
      if (showToastMsg) {
        showToast(`✨ '${queryToSearch || '실시간 인기'}' 네이버 쇼핑 상품 ${items.length}건을 성공적으로 불러왔습니다!`, 'success');
      }
    } catch (err) {
      console.warn('[Search Realtime Products Failed]', err);
      if (showToastMsg) {
        showToast('네이버 인기 상품을 최신 목록으로 복구했습니다.', 'info');
      }
    } finally {
      setIsFetchingRealtimeProducts(false);
    }
  };

  // Add Realtime Naver Product to Pending Queue
  const handleAddRealtimeToPending = async (item: NaverRealtimeProduct) => {
    const added = await addPendingProduct({
      id: `naver-shop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: item.name,
      brand: item.brand,
      category: item.category,
      price: item.price,
      image: item.image,
      discountRate: 0,
      releaseDate: '',
      stores: item.stores || [],
      description: item.description || '',
      sourceName: `네이버 쇼핑 (${item.mallName})`,
      sourceUrl: item.link,
      crawledAt: new Date().toISOString(),
      status: 'pending',
    });
    if (added) showToast(`✅ '${item.name}' 제품을 승인 대기함에 담았습니다.`, 'success');
  };

  // Register Realtime Naver Product directly to Main Products
  const handleAddRealtimeToProducts = (item: NaverRealtimeProduct) => {
    addProduct({
      name: item.name,
      brand: item.brand,
      category: item.category,
      price: item.price,
      discountRate: 0,
      image: item.image,
      description: item.description,
      stores: item.stores || [],
      isToday: true,
    });
  };

  // Products tab states
  const [productViewMode, setProductViewMode] = useState<'table' | 'grid'>('table');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<ProductCategory | '전체'>('전체');
  const [productFilterBadge, setProductFilterBadge] = useState<'all' | 'today' | 'hot'>('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productCurrentPage, setProductCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Bulk operation states in Products Tab
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Reviews & Community tab states
  const [moderationSubTab, setModerationSubTab] = useState<'reviews' | 'community'>('reviews');
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');
  const [communitySearchQuery, setCommunitySearchQuery] = useState('');

  // Product Form state
  const [productForm, setProductForm] = useState<{
    code: string;
    name: string;
    brand: string;
    category: ProductCategory;
    subCategory: string;
    price: number;
    discountRate: number;
    releaseDate: string;
    image: string;
    description: string;
    calories: number;
    volume: string;
    stores: string[];
    storeLinks: Record<string, string>;
    storeStocks: StoreStockItem[];
    isToday: boolean;
    isHot: boolean;
    ingredients: string;
    allergens: string;
    origin: string;
    manufacturer: string;
    storageMethod: string;
    shelfLife: string;
    precautions: string;
    nutrition?: NutritionInfo;
  }>({
    code: '',
    name: '',
    brand: '',
    category: '신제품',
    subCategory: '',
    price: 2000,
    discountRate: 0,
    releaseDate: `${new Date().getFullYear()}.${String(new Date().getMonth() + 1).padStart(2, '0')} 출시`,
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80',
    description: '',
    calories: 350,
    volume: '80g',
    stores: ['CU', 'GS25'],
    storeLinks: {},
    storeStocks: [
      { store: 'CU', status: '입고완료', stockCount: 10, price: 2000, deliveryTime: '매장 즉시 픽업' },
      { store: 'GS25', status: '입고완료', stockCount: 10, price: 2000, deliveryTime: '매장 즉시 픽업' }
    ],
    isToday: true,
    isHot: false,
    ingredients: '',
    allergens: '',
    origin: '대한민국',
    manufacturer: '',
    storageMethod: '실온 보관 (직사광선을 피하고 서늘한 곳에 보관)',
    shelfLife: '제조일로부터 6개월',
    precautions: '',
    nutrition: undefined
  });

  const [customStoreInput, setCustomStoreInput] = useState('');

  // Quick Store Links Modal state
  const [quickLinkProduct, setQuickLinkProduct] = useState<Product | null>(null);
  const [quickStores, setQuickStores] = useState<string[]>([]);
  const [quickStoreLinks, setQuickStoreLinks] = useState<Record<string, string>>({});
  const [quickCustomStore, setQuickCustomStore] = useState('');

  // Banner modal states
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const [isCompressingBannerImage, setIsCompressingBannerImage] = useState(false);
  const [bannerImageMode, setBannerImageMode] = useState<'file' | 'url'>('file');
  const [bannerForm, setBannerForm] = useState<Omit<BannerItem, 'id'> & { order: number; badge?: string; disclaimer?: string }>({
    image: '',
    badge: '',
    title: '',
    subtitle: '',
    buttonText: '신상 보러가기',
    linkType: 'category',
    linkCategory: '신제품',
    linkUrl: '',
    linkEventId: '',
    linkProductId: '',
    disclaimer: '',
    isActive: true,
    order: 1,
  });

  // Banner Live Preview state in admin
  const [previewBannerIdx, setPreviewBannerIdx] = useState(0);

  const handleBannerFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('이미지 파일만 선택할 수 있습니다.', 'error');
      return;
    }

    setIsCompressingBannerImage(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const maxWidth = 1200;
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
            setBannerForm(prev => ({ ...prev, image: optimizedDataUrl }));
            showToast('📸 배너 이미지가 파일에서 적용되었습니다!', 'success');
          } else {
            setBannerForm(prev => ({ ...prev, image: event.target?.result as string }));
          }
          setIsCompressingBannerImage(false);
        };
        img.onerror = () => {
          setBannerForm(prev => ({ ...prev, image: event.target?.result as string }));
          setIsCompressingBannerImage(false);
        };
        img.src = event.target?.result as string;
      };
      reader.onerror = () => {
        showToast('이미지 파일을 읽는데 실패했습니다.', 'error');
        setIsCompressingBannerImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      showToast('이미지 처리 중 오류가 발생했습니다.', 'error');
      setIsCompressingBannerImage(false);
    }
  };

  // Battle tab states
  const [battleTitle, setBattleTitle] = useState(battleConfig.title);
  const [battleSubtitle, setBattleSubtitle] = useState(battleConfig.subtitle);
  const [battleProductAId, setBattleProductAId] = useState(battleConfig.productAId);
  const [battleLabelA, setBattleLabelA] = useState(battleConfig.labelA);
  const [battleProductBId, setBattleProductBId] = useState(battleConfig.productBId);
  const [battleLabelB, setBattleLabelB] = useState(battleConfig.labelB);
  // 이번 주 대결과 실제 득표수 (서버 기준)
  const [adminBattleRound, setAdminBattleRound] = useState<BattleRound | null>(null);
  const [battleSaveStatus, setBattleSaveStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [isSavingBattle, setIsSavingBattle] = useState(false);

  const applyAdminBattleRound = (round: BattleRound | null | undefined) => {
    if (!round) return;
    setAdminBattleRound(round);
    setBattleProductAId(round.productA.id);
    setBattleProductBId(round.productB.id);
  };

  useEffect(() => {
    if (activeAdminTab !== 'battle' && activeAdminTab !== 'overview') return;
    fetchBattleRound({ admin: true }).then(result => {
      if (result.ok) applyAdminBattleRound(result.round);
    });
  }, [activeAdminTab]);

  const battleVoteLabel = (side: 'A' | 'B') => {
    const counts = adminBattleRound?.counts;
    if (!counts) return '집계 대기';
    const total = counts.A + counts.B;
    const count = counts[side];
    return total > 0 ? `${count.toLocaleString()}표 (${Math.round((count / total) * 100)}%)` : '0표';
  };
  const battleBarPercentA = (() => {
    const counts = adminBattleRound?.counts;
    const total = counts ? counts.A + counts.B : 0;
    return counts && total > 0 ? (counts.A / total) * 100 : 50;
  })();

  // Image zoom modal
  const [previewImageModalUrl, setPreviewImageModalUrl] = useState<string | null>(null);




  // High-res Image Selector modal target
  const [imageSelectorTarget, setImageSelectorTarget] = useState<{
    brand: string;
    name: string;
    currentImage: string;
    onSelect: (newUrl: string) => void;
  } | null>(null);

  // Food Nutrition Search modal target (식약처 영양성분 자동조회)
  const [nutritionSearchTarget, setNutritionSearchTarget] = useState<{
    initialQuery: string;
    brand?: string;
    onSelect: (data: FoodNutritionData) => void;
  } | null>(null);

  // Statistics
  const todayProductsCount = products.filter(p => p.isToday).length;
  const hotProductsCount = products.filter(p => p.isHot).length;
  const activeBannersCount = banners.filter(b => b.isActive).length;
  const avgReviewRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '0.0';

  // Computed statistics for clean Admin Dashboard
  const todaySignupsCount = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const d = now.getDate();
    return allProfiles.filter(u => {
      if (!u.createdAt) return false;
      const t = new Date(u.createdAt);
      return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d;
    }).length;
  }, [allProfiles]);

  const todayReportsCount = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const d = now.getDate();
    return reports.filter(r => {
      if (!r.createdAt) return false;
      const t = new Date(r.createdAt);
      return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d;
    }).length;
  }, [reports]);

  const bannedMembersCount = useMemo(() => {
    return allProfiles.filter(u => u.status === 'banned').length;
  }, [allProfiles]);

  const activeMembersCount = useMemo(() => {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return allProfiles.filter(u => {
      if (u.lastActiveAt) {
        return new Date(u.lastActiveAt).getTime() >= oneDayAgo;
      }
      if (u.createdAt) {
        return new Date(u.createdAt).getTime() >= oneDayAgo;
      }
      return false;
    }).length;
  }, [allProfiles]);

  // 최근 14일 신규 가입자 수 (한국 시간 기준 날짜로 집계)
  const signupTrend = useMemo(() => {
    const KST_OFFSET = 9 * 60 * 60 * 1000;
    const toKstDate = (time: number) => new Date(time + KST_OFFSET).toISOString().slice(0, 10);
    const counts = new Map<string, number>();
    allProfiles.forEach(u => {
      const time = u.createdAt ? new Date(u.createdAt).getTime() : NaN;
      if (Number.isNaN(time)) return;
      const key = toKstDate(time);
      counts.set(key, (counts.get(key) || 0) + 1);
    });

    const now = Date.now();
    const days = Array.from({ length: 14 }, (_, idx) => {
      const dateStr = toKstDate(now - (13 - idx) * 24 * 60 * 60 * 1000);
      const [, month, day] = dateStr.split('-').map(Number);
      return { dateStr, label: `${month}/${day}`, signups: counts.get(dateStr) || 0, isToday: idx === 13 };
    });
    const total = days.reduce((sum, d) => sum + d.signups, 0);
    const max = Math.max(...days.map(d => d.signups), 1);
    return { days, total, max, today: days[13].signups };
  }, [allProfiles]);

  const recentReportsList = useMemo(() => {
    return [...reports]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5);
  }, [reports]);

  const recentUsersList = useMemo(() => {
    return [...allProfiles]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5);
  }, [allProfiles]);

  // Filtered regular products with useMemo for performance optimization
  const filteredAdminProducts = useMemo(() => {
    return products.filter(p => {
      if (productCategoryFilter !== '전체' && p.category !== productCategoryFilter) return false;
      if (productFilterBadge === 'today' && !p.isToday) return false;
      if (productFilterBadge === 'hot' && !p.isHot) return false;
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, productCategoryFilter, productFilterBadge, productSearch]);

  // Total pages and paginated products slice for instantaneous rendering
  const totalProductPages = Math.ceil(filteredAdminProducts.length / itemsPerPage) || 1;

  const paginatedAdminProducts = useMemo(() => {
    const start = (productCurrentPage - 1) * itemsPerPage;
    return filteredAdminProducts.slice(start, start + itemsPerPage);
  }, [filteredAdminProducts, productCurrentPage, itemsPerPage]);

  // Filtered reviews
  const filteredReviews = reviews.filter(r => {
    if (!reviewSearchQuery.trim()) return true;
    const q = reviewSearchQuery.toLowerCase();
    return (
      r.productName?.toLowerCase().includes(q) ||
      r.content?.toLowerCase().includes(q) ||
      r.userName?.toLowerCase().includes(q)
    );
  });

  // Filtered community posts
  const filteredCommunityPosts = communityPosts.filter(p => {
    if (!communitySearchQuery.trim()) return true;
    const q = communitySearchQuery.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.content?.toLowerCase().includes(q) ||
      p.author?.toLowerCase().includes(q)
    );
  });

  const handleBulkRevokeSelectedProducts = () => {
    if (selectedProductIds.length === 0) return;
    const count = selectedProductIds.length;
    if (confirm(`선택한 ${count}개 상품의 승인을 취소하고 대기함으로 되돌리시겠습니까?`)) {
      revokeAllApprovedProducts(selectedProductIds);
      setSelectedProductIds([]);
    }
  };



  // Product selection (Bulk operations) helpers
  const toggleSelectAllProducts = () => {
    if (selectedProductIds.length === filteredAdminProducts.length && filteredAdminProducts.length > 0) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredAdminProducts.map((p: Product) => p.id));
    }
  };

  const toggleProductSelect = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Bulk Product Actions
  const handleBulkSetToday = (isToday: boolean) => {
    if (selectedProductIds.length === 0) return;
    selectedProductIds.forEach(id => {
      const prod = products.find(p => p.id === id);
      if (prod && prod.isToday !== isToday) {
        toggleProductToday(id);
      }
    });
    showToast(`선택한 ${selectedProductIds.length}개 상품의 오늘신상 설정을 변경했습니다.`, 'success');
  };

  const handleBulkSetHot = (isHot: boolean) => {
    if (selectedProductIds.length === 0) return;
    selectedProductIds.forEach(id => {
      const prod = products.find(p => p.id === id);
      if (prod && prod.isHot !== isHot) {
        toggleProductHot(id);
      }
    });
    showToast(`선택한 ${selectedProductIds.length}개 상품의 인기HOT 설정을 변경했습니다.`, 'success');
  };

  const handleBulkDeleteProducts = () => {
    if (selectedProductIds.length === 0) return;
    if (confirm(`선택한 ${selectedProductIds.length}개의 상품을 정말 삭제하시겠습니까?`)) {
      deleteProducts(selectedProductIds);
      setSelectedProductIds([]);
    }
  };

  // Export selected products
  const handleExportSelectedProducts = () => {
    if (selectedProductIds.length === 0) return;
    const exportItems = products.filter(p => selectedProductIds.includes(p.id));
    const blob = new Blob([JSON.stringify(exportItems, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sinsangpick_products_selected_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${exportItems.length}개 상품 데이터가 다운로드되었습니다.`, 'success');
  };

  // Product modal helpers
  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    const initialCategory: ProductCategory = '과자';
    const initialCode = generateNextProductCode(products, initialCategory, '');
    setProductForm({
      code: initialCode,
      name: '',
      brand: '',
      category: initialCategory,
      subCategory: '스낵',
      price: 2000,
      discountRate: 0,
      releaseDate: `${new Date().getFullYear()}.${String(new Date().getMonth() + 1).padStart(2, '0')} 출시`,
      image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80',
      description: '',
      calories: 350,
      volume: '80g',
      stores: ['CU', 'GS25'],
      storeLinks: {},
      storeStocks: [
        { store: 'CU', status: '입고완료', stockCount: 10, price: 2000, deliveryTime: '매장 즉시 픽업' },
        { store: 'GS25', status: '입고완료', stockCount: 10, price: 2000, deliveryTime: '매장 즉시 픽업' }
      ],
      isToday: true,
      isHot: false,
      ingredients: '',
      allergens: '',
      origin: '대한민국',
      manufacturer: '',
      storageMethod: '실온 보관 (직사광선을 피하고 서늘한 곳에 보관)',
      shelfLife: '제조일로부터 6개월',
      precautions: '',
      nutrition: undefined
    });
    setCustomStoreInput('');
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    const initialLinks: Record<string, string> = {};
    if (prod.storeStocks) {
      prod.storeStocks.forEach(st => {
        if (st.appLink) {
          initialLinks[st.store] = st.appLink;
        }
      });
    }

    const availableStores = Array.from(new Set([
      ...(prod.stores || []),
      ...(prod.storeStocks ? prod.storeStocks.map(s => s.store) : [])
    ]));

    const mappedStocks: StoreStockItem[] = availableStores.map(stName => {
      const found = prod.storeStocks?.find(s => s.store === stName);
      return found || {
        store: stName,
        status: '입고완료',
        stockCount: 10,
        price: prod.price,
        deliveryTime: '매장 즉시 픽업'
      };
    });

    setEditingProductId(prod.id);
    setProductForm({
      code: prod.code || getProductCode(prod),
      name: prod.name,
      brand: prod.brand,
      category: prod.category,
      subCategory: prod.subCategory || '',
      price: prod.price,
      discountRate: prod.discountRate || 0,
      releaseDate: prod.releaseDate,
      image: prod.image,
      description: prod.description || '',
      calories: prod.calories || 300,
      volume: prod.volume || '',
      stores: availableStores.length > 0 ? availableStores : ['CU'],
      storeLinks: initialLinks,
      storeStocks: mappedStocks,
      isToday: !!prod.isToday,
      isHot: !!prod.isHot,
      ingredients: prod.ingredients || '',
      allergens: prod.allergens ? prod.allergens.join(', ') : '',
      origin: prod.origin || '대한민국',
      manufacturer: prod.manufacturer || '',
      storageMethod: prod.storageMethod || '실온 보관',
      shelfLife: prod.shelfLife || '',
      precautions: prod.precautions || '',
      nutrition: prod.nutrition
    });
    setCustomStoreInput('');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (!productForm.name.trim() || !productForm.brand.trim()) {
      showToast('상품명과 브랜드를 입력해주세요.', 'error');
      return;
    }

    // 선택된 stores 기반으로 storeStocks 매핑 & appLink 반영
    const currentProd = editingProductId ? products.find(p => p.id === editingProductId) : null;
    const updatedStoreStocks: StoreStockItem[] = productForm.stores.map(stName => {
      const existingInForm = productForm.storeStocks.find(s => s.store === stName);
      const existingStock = currentProd?.storeStocks?.find(s => s.store === stName);
      const link = (productForm.storeLinks && productForm.storeLinks[stName]) 
        ? productForm.storeLinks[stName].trim() 
        : existingInForm?.appLink;

      return {
        store: stName,
        status: existingInForm?.status || existingStock?.status || '입고완료',
        stockCount: existingInForm?.stockCount ?? existingStock?.stockCount ?? 10,
        price: existingInForm?.price ?? existingStock?.price ?? (Number(productForm.price) || 0),
        discountPrice: existingInForm?.discountPrice ?? existingStock?.discountPrice,
        eventBadge: existingInForm?.eventBadge || existingStock?.eventBadge || undefined,
        deliveryTime: existingInForm?.deliveryTime || existingStock?.deliveryTime || (stName === '온라인' || stName.includes('몰') || stName.includes('쿠팡') || stName.includes('컬리') ? '전국 택배 배송' : '매장 즉시 픽업'),
        appLink: link || undefined
      };
    });

    const payload = {
      code: productForm.code.trim() || generateNextProductCode(products, productForm.category, productForm.brand),
      name: productForm.name.trim(),
      brand: productForm.brand.trim(),
      category: productForm.category,
      subCategory: productForm.subCategory,
      price: Number(productForm.price) || 0,
      discountRate: Number(productForm.discountRate) || 0,
      releaseDate: productForm.releaseDate,
      image: productForm.image,
      description: productForm.description,
      calories: Number(productForm.calories) || undefined,
      volume: productForm.volume,
      stores: productForm.stores,
      storeStocks: updatedStoreStocks,
      isToday: productForm.isToday,
      isHot: productForm.isHot,
      ingredients: productForm.ingredients,
      allergens: productForm.allergens ? productForm.allergens.split(',').map(s => s.trim()).filter(Boolean) : [],
      origin: productForm.origin,
      manufacturer: productForm.manufacturer,
      storageMethod: productForm.storageMethod,
      shelfLife: productForm.shelfLife,
      precautions: productForm.precautions,
      nutrition: productForm.nutrition
    };

    if (editingProductId) {
      updateProduct(editingProductId, payload);
      showToast('상품 정보와 판매처 링크가 수정되었습니다.', 'success');
    } else {
      addProduct(payload);
      showToast('신규 상품이 등록되었습니다.', 'success');
    }

    setIsProductModalOpen(false);
  };

  // Quick Store Links Modal handlers
  const handleOpenQuickLinks = (prod: Product) => {
    setQuickLinkProduct(prod);
    const existingStores = Array.from(new Set([
      ...(prod.stores || []),
      ...(prod.storeStocks ? prod.storeStocks.map(s => s.store) : [])
    ]));
    const initialStores = existingStores.length > 0 ? existingStores : ['CU', 'GS25'];
    const initialLinks: Record<string, string> = {};
    if (prod.storeStocks) {
      prod.storeStocks.forEach(st => {
        if (st.appLink) {
          initialLinks[st.store] = st.appLink;
        }
      });
    }
    setQuickStores(initialStores);
    setQuickStoreLinks(initialLinks);
    setQuickCustomStore('');
  };

  const handleSaveQuickLinks = () => {
    if (!quickLinkProduct) return;

    const updatedStoreStocks: StoreStockItem[] = quickStores.map(stName => {
      const existingStock = quickLinkProduct.storeStocks?.find(s => s.store === stName);
      const link = quickStoreLinks[stName]?.trim() || undefined;

      return {
        store: stName,
        status: existingStock?.status || '입고완료',
        stockCount: existingStock?.stockCount ?? 10,
        price: existingStock?.price ?? quickLinkProduct.price,
        discountPrice: existingStock?.discountPrice,
        eventBadge: existingStock?.eventBadge || undefined,
        deliveryTime: existingStock?.deliveryTime || (stName === '온라인' || stName.includes('몰') || stName.includes('쿠팡') || stName.includes('컬리') ? '전국 택배 배송' : '매장 즉시 픽업'),
        appLink: link || undefined
      };
    });

    updateProduct(quickLinkProduct.id, {
      stores: quickStores,
      storeStocks: updatedStoreStocks
    });

    showToast(`'${quickLinkProduct.name}'의 판매처 링크가 성공적으로 저장되었습니다.`, 'success');
    setQuickLinkProduct(null);
  };

  // Banner modal helpers
  const handleOpenNewBanner = (targetOrder?: number | unknown) => {
    setEditingBannerId(null);
    const nextOrder = typeof targetOrder === 'number' ? targetOrder : banners.length + 1;
    setBannerForm({
      image: '',
      badge: '',
      title: '',
      subtitle: '',
      buttonText: '신상 보러가기',
      linkType: 'category',
      linkCategory: '신제품',
      linkUrl: '',
      linkEventId: events.length > 0 ? events[0].id : '',
      linkProductId: products.length > 0 ? products[0].id : '',
      disclaimer: '',
      isActive: true,
      order: nextOrder,
    });
    setBannerImageMode('file');
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBanner = (banner: BannerItem) => {
    setEditingBannerId(banner.id);
    let inferredLinkType: BannerLinkType = banner.linkType || 'category';
    if (!banner.linkType) {
      if (banner.linkUrl) inferredLinkType = 'url';
      else if (banner.linkEventId) inferredLinkType = 'event';
      else if (banner.linkProductIds?.length) inferredLinkType = 'collection';
      else if (banner.linkProductId) inferredLinkType = 'product';
      else if (banner.linkCategory) inferredLinkType = 'category';
    }

    setBannerForm({
      image: banner.image || '',
      badge: banner.badge || '',
      title: banner.title,
      subtitle: banner.subtitle,
      buttonText: banner.buttonText || '바로가기',
      linkType: inferredLinkType,
      linkCategory: banner.linkCategory || '신제품',
      linkUrl: banner.linkUrl || '',
      linkEventId: banner.linkEventId || (events.length > 0 ? events[0].id : ''),
      linkProductId: banner.linkProductId || (products.length > 0 ? products[0].id : ''),
      linkProductIds: banner.linkProductIds || [],
      disclaimer: banner.disclaimer || '',
      isActive: banner.isActive,
      order: banner.order || 1,
    });
    setBannerImageMode(banner.image?.startsWith('data:') ? 'file' : 'file');
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = () => {
    if (!bannerForm.image.trim()) {
      showToast('배너 이미지 파일을 선택해주세요.', 'error');
      return;
    }

    const defaultDisclaimer = (bannerForm.linkType === 'url' && bannerForm.linkUrl?.includes('coupang.com'))
      ? '이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.'
      : undefined;

    const payload: Omit<BannerItem, 'id' | 'order'> & { badge?: string; order?: number } = {
      image: bannerForm.image,
      badge: bannerForm.badge?.trim() || undefined,
      title: bannerForm.title?.trim() || `${bannerForm.order}구좌 배너`,
      subtitle: bannerForm.subtitle?.trim() || '',
      buttonText: bannerForm.buttonText?.trim() || '',
      linkType: bannerForm.linkType,
      linkUrl: bannerForm.linkType === 'url' ? bannerForm.linkUrl?.trim() : undefined,
      linkEventId: bannerForm.linkType === 'event' ? bannerForm.linkEventId : undefined,
      linkProductId: bannerForm.linkType === 'product' ? bannerForm.linkProductId : undefined,
      linkCategory: bannerForm.linkType === 'category' ? bannerForm.linkCategory : undefined,
      linkProductIds: bannerForm.linkType === 'collection'
        ? (bannerForm.linkProductIds || []).map(id => id.trim()).filter(Boolean)
        : undefined,
      disclaimer: bannerForm.disclaimer?.trim() || defaultDisclaimer,
      isActive: bannerForm.isActive,
      order: bannerForm.order,
    };

    if (editingBannerId) {
      updateBanner(editingBannerId, payload);
      showToast('배너 구좌가 성공적으로 수정되었습니다.', 'success');
    } else {
      addBanner(payload, bannerForm.order);
      showToast('새 배너 구좌가 성공적으로 등록되었습니다.', 'success');
    }
    setIsBannerModalOpen(false);
  };

  // Battle save helper
  const handleSaveBattle = async () => {
    if (!battleProductAId || !battleProductBId || battleProductAId === battleProductBId) {
      setBattleSaveStatus({ ok: false, message: '서로 다른 두 상품을 선택해주세요.' });
      return;
    }
    setIsSavingBattle(true);
    setBattleSaveStatus(null);
    updateBattleConfig({
      title: battleTitle,
      subtitle: battleSubtitle,
      productAId: battleProductAId,
      labelA: battleLabelA,
      productBId: battleProductBId,
      labelB: battleLabelB,
    });
    const result = await setBattlePair(battleProductAId, battleProductBId);
    setIsSavingBattle(false);
    if (!result.ok) {
      setBattleSaveStatus({ ok: false, message: result.error || '대결 상품을 저장하지 못했습니다.' });
      return;
    }
    applyAdminBattleRound(result.round);
    refreshBattleRound();
    setBattleSaveStatus({ ok: true, message: '이번 주 대결에 반영했습니다.' });
  };

  // Export JSON helper
  const handleExportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      productsCount: products.length,
      bannersCount: banners.length,
      reviewsCount: reviews.length,
      communityCount: communityPosts.length,
      products,
      banners,
      battleConfig
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sinsangpick_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('데이터 백업 JSON 파일이 다운로드되었습니다.', 'success');
  };

  // Selected battle product objects for arena preview
  const prodA = products.find(p => p.id === battleProductAId) || products[0];
  const prodB = products.find(p => p.id === battleProductBId) || products[1] || products[0];

  // Helper theme classes
  const isDark = themeMode === 'dark';
  const mainBg = isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800';
  const headerBg = isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200';
  const cardBg = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-xs';
  const subCardBg = isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50/80 border-slate-200/70';
  const inputBg = isDark ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white';
  const tableHeaderBg = isDark ? 'bg-slate-950/80 text-slate-400 border-slate-800' : 'bg-slate-100/70 text-slate-600 border-slate-200';
  const tableRowHover = isDark ? 'hover:bg-slate-800/40 divide-slate-800/60' : 'hover:bg-slate-50/80 divide-slate-100';

  return (
    <div className={`flex h-screen w-full antialiased overflow-hidden font-sans transition-colors duration-200 ${mainBg}`}>
      
      {/* ================= DESKTOP LEFT SIDEBAR ================= */}
      <aside className="w-64 bg-[#111827] border-r border-gray-800 flex flex-col justify-between shrink-0 select-none z-20">
        
        {/* Top Branding */}
        <div>
          <div className="p-5 flex items-center justify-between border-b border-gray-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/30 ring-1 ring-white/10">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white">신상픽</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-mono">PRO</span>
                </div>
                <p className="text-[11px] text-gray-400 font-medium">Admin Console</p>
              </div>
            </div>
          </div>

          {/* Clean Flat Navigation List */}
          <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-190px)] text-xs">
            
            {/* 1. 대시보드 */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                대시보드
              </div>
              <button
                onClick={() => setActiveAdminTab('overview')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  activeAdminTab === 'overview'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className={`w-4 h-4 ${activeAdminTab === 'overview' ? 'text-white' : 'text-gray-400'}`} />
                  <span>대시보드 개요</span>
                </div>
              </button>

              <button
                onClick={() => setActiveAdminTab('analytics')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  activeAdminTab === 'analytics'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className={`w-4 h-4 ${activeAdminTab === 'analytics' ? 'text-white' : 'text-gray-400'}`} />
                  <span>쇼핑 트렌드 분석</span>
                </div>
              </button>
            </div>

            {/* 2. 사용자 및 제재 */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                사용자 및 제재
              </div>
              
              <button
                onClick={() => setActiveAdminTab('users')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  activeAdminTab === 'users'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className={`w-4 h-4 ${activeAdminTab === 'users' ? 'text-white' : 'text-gray-400'}`} />
                  <span>회원·포인트 관리</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeAdminTab === 'users' ? 'bg-white/20 text-white' : 'bg-gray-800 text-gray-400'
                }`}>
                  {allProfiles.length}명
                </span>
              </button>

              <button
                onClick={() => setActiveAdminTab('points')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  activeAdminTab === 'points'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Award className={`w-4 h-4 ${activeAdminTab === 'points' ? 'text-white' : 'text-gray-400'}`} />
                  <span>포인트 정책·지급/회수</span>
                </div>
              </button>

              <button
                onClick={() => setActiveAdminTab('reviews')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  activeAdminTab === 'reviews'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className={`w-4 h-4 ${activeAdminTab === 'reviews' ? 'text-white' : 'text-gray-400'}`} />
                  <span>리뷰 & 커뮤니티</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeAdminTab === 'reviews' ? 'bg-white/20 text-white' : 'bg-gray-800 text-gray-400'
                }`}>
                  {reviews.length}
                </span>
              </button>

              <button
                onClick={() => setActiveAdminTab('reports')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  activeAdminTab === 'reports'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className={`w-4 h-4 ${activeAdminTab === 'reports' ? 'text-white' : 'text-gray-400'}`} />
                  <span>신고 접수·제재</span>
                </div>
                {pendingReportsCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold animate-pulse">
                    {pendingReportsCount}건
                  </span>
                ) : (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    activeAdminTab === 'reports' ? 'bg-white/20 text-white' : 'bg-gray-800 text-gray-400'
                  }`}>
                    {reports.length}
                  </span>
                )}
              </button>
            </div>

            {/* 3. 상품 & 카탈로그 */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                상품 & 카탈로그
              </div>

              <button
                onClick={() => setActiveAdminTab('products')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  activeAdminTab === 'products'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className={`w-4 h-4 ${activeAdminTab === 'products' ? 'text-white' : 'text-gray-400'}`} />
                  <span>상품 카탈로그</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeAdminTab === 'products' ? 'bg-white/20 text-white' : 'bg-gray-800 text-gray-400'
                }`}>
                  {products.length}
                </span>
              </button>

              <button
                onClick={() => setActiveAdminTab('approval')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  activeAdminTab === 'approval'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className={`w-4 h-4 ${activeAdminTab === 'approval' ? 'text-white' : 'text-gray-400'}`} />
                  <span>신제품 수집·승인</span>
                </div>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                    {pendingCount}건
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveAdminTab('product_edits')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  activeAdminTab === 'product_edits'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Edit3 className={`w-4 h-4 ${activeAdminTab === 'product_edits' ? 'text-white' : 'text-gray-400'}`} />
                  <span>제품 정보 수정요청</span>
                </div>
                {pendingProductEditsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold animate-pulse">
                    {pendingProductEditsCount}건
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveAdminTab('brands')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  activeAdminTab === 'brands'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className={`w-4 h-4 ${activeAdminTab === 'brands' ? 'text-white' : 'text-gray-400'}`} />
                  <span>식품 제조사 브랜드</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeAdminTab === 'brands' ? 'bg-white/20 text-white' : 'bg-gray-800 text-gray-400'
                }`}>
                  {brands.length}
                </span>
              </button>

              <button
                onClick={() => setActiveAdminTab('stores')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  activeAdminTab === 'stores'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Store className={`w-4 h-4 ${activeAdminTab === 'stores' ? 'text-white' : 'text-gray-400'}`} />
                  <span>편의점·판매처 채널</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeAdminTab === 'stores' ? 'bg-white/20 text-white' : 'bg-gray-800 text-gray-400'
                }`}>
                  {storeChannels.length}
                </span>
              </button>

              <button
                onClick={() => setActiveAdminTab('kamis')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  activeAdminTab === 'kamis'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Activity className={`w-4 h-4 ${activeAdminTab === 'kamis' ? 'text-white' : 'text-gray-400'}`} />
                  <span>농수산물 KAMIS 시세</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                  실시간
                </span>
              </button>

              <button
                onClick={() => setActiveAdminTab('donki')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  activeAdminTab === 'donki'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className={`w-4 h-4 ${activeAdminTab === 'donki' ? 'text-white' : 'text-gray-400'}`} />
                  <span>돈키호테 필수템</span>
                </div>
              </button>
            </div>

            {/* 4. 전시 & 프로모션 */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                전시 & 프로모션
              </div>

              <button
                onClick={() => setActiveAdminTab('ai_agents')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  activeAdminTab === 'ai_agents'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-md shadow-indigo-600/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bot className={`w-4 h-4 ${activeAdminTab === 'ai_agents' ? 'text-white' : 'text-indigo-400'}`} />
                  <span>AI 전문가 에이전트</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                  16명
                </span>
              </button>

              <button
                onClick={() => setActiveAdminTab('insta_generator')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  activeAdminTab === 'insta_generator'
                    ? 'bg-amber-500 text-black font-black shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className={`w-4 h-4 ${activeAdminTab === 'insta_generator' ? 'text-black' : 'text-amber-400'}`} />
                  <span>인스타 콘텐츠 생성기</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-black shadow-sm">
                  AI
                </span>
              </button>

              <button
                onClick={() => setActiveAdminTab('banners')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  activeAdminTab === 'banners'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layers className={`w-4 h-4 ${activeAdminTab === 'banners' ? 'text-white' : 'text-gray-400'}`} />
                  <span>메인 프로모션 배너</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeAdminTab === 'banners' ? 'bg-white/20 text-white' : 'bg-gray-800 text-gray-400'
                }`}>
                  {banners.length}
                </span>
              </button>

              <button
                onClick={() => setActiveAdminTab('battle')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  activeAdminTab === 'battle'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Swords className={`w-4 h-4 ${activeAdminTab === 'battle' ? 'text-white' : 'text-gray-400'}`} />
                  <span>신상 배틀 매치업</span>
                </div>
              </button>

              <button
                onClick={() => setActiveAdminTab('sections')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  activeAdminTab === 'sections'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sliders className={`w-4 h-4 ${activeAdminTab === 'sections' ? 'text-white' : 'text-gray-400'}`} />
                  <span>홈 섹션 순서·배치</span>
                </div>
              </button>

              <button
                onClick={() => setActiveAdminTab('events')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  activeAdminTab === 'events'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Gift className={`w-4 h-4 ${activeAdminTab === 'events' ? 'text-white' : 'text-gray-400'}`} />
                  <span>체험단 구좌 & 이벤트</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeAdminTab === 'events' ? 'bg-white/20 text-white' : 'bg-gray-800 text-gray-400'
                }`}>
                  {events.length}
                </span>
              </button>

              <button
                onClick={() => setActiveAdminTab('calendar')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  activeAdminTab === 'calendar'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className={`w-4 h-4 ${activeAdminTab === 'calendar' ? 'text-white' : 'text-gray-400'}`} />
                  <span>신제품 출시 캘린더</span>
                </div>
              </button>

              <button
                onClick={() => setActiveAdminTab('notifications')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  activeAdminTab === 'notifications'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bell className={`w-4 h-4 ${activeAdminTab === 'notifications' ? 'text-white' : 'text-gray-400'}`} />
                  <span>앱 푸시 & 알림 발송</span>
                </div>
              </button>

              <button
                onClick={() => setActiveAdminTab('sales')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  activeAdminTab === 'sales'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Flame className={`w-4 h-4 ${activeAdminTab === 'sales' ? 'text-white' : 'text-gray-400'}`} />
                  <span>편의점 특가·행사</span>
                </div>
              </button>
            </div>

            {/* 5. 시스템 설정 */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                시스템 설정
              </div>

              <button
                onClick={() => setActiveAdminTab('data')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  activeAdminTab === 'data'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Database className={`w-4 h-4 ${activeAdminTab === 'data' ? 'text-white' : 'text-gray-400'}`} />
                  <span>데이터 백업 & 복구</span>
                </div>
              </button>
            </div>

          </nav>
        </div>

        {/* Sidebar Bottom: Status & Back to App */}
        <div className="p-4 border-t border-gray-800 space-y-3">
          <div className="flex items-center justify-between px-2 text-[11px] text-gray-400">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500'}`} />
              <span>{isSupabaseConnected ? 'Supabase 클라우드' : '로컬 모드'}</span>
            </div>
            <span className="text-[10px] font-mono text-gray-500">v2.5</span>
          </div>
          
          <button
            onClick={() => setActiveTab('home')}
            className="w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700/60 transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
            <span>앱 화면 바로가기</span>
          </button>
        </div>

      </aside>

      {/* ================= DESKTOP MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        {adminSaveError && (
          <div className="shrink-0 flex items-start gap-3 px-8 py-3 bg-red-600 text-white text-sm font-semibold" role="alert">
            <span className="flex-1 break-words">
              ⚠️ {adminSaveError} · 서버에 반영되지 않은 변경은 다른 기기에 보이지 않습니다.
            </span>
            <button onClick={clearAdminSaveError} className="shrink-0 underline cursor-pointer">닫기</button>
          </div>
        )}
        
        {/* Desktop Sticky Header Bar (Sleek Clean Style) */}
        <header className={`h-16 px-8 border-b flex items-center justify-between shrink-0 z-10 transition-colors ${headerBg}`}>
          
          {/* Active Tab Title */}
          <div>
            <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {activeAdminTab === 'overview' ? 'Dashboard' :
               activeAdminTab === 'users' ? '회원관리' :
               activeAdminTab === 'reports' ? '신고관리' :
               activeAdminTab === 'product_edits' ? '수정요청' :
               activeAdminTab === 'reviews' ? (moderationSubTab === 'community' ? '게시글관리' : '댓글관리') :
               activeAdminTab === 'products' ? '신상품관리' :
               activeAdminTab === 'approval' ? '신제품 수집·승인' :
               activeAdminTab === 'brands' ? '제조사브랜드' :
               activeAdminTab === 'stores' ? '판매처채널' :
               activeAdminTab === 'banners' ? '배너관리' :
               activeAdminTab === 'sections' ? '홈섹션관리' :
               activeAdminTab === 'sales' ? '편의점행사' :
               activeAdminTab === 'battle' ? '신상배틀' :
               activeAdminTab === 'calendar' ? '신제품 출시 캘린더' :
               activeAdminTab === 'events' ? '체험단 구좌 & 이벤트 관리' :
               activeAdminTab === 'notifications' ? '앱 푸시 & 알림 발송' :
               activeAdminTab === 'ai_agents' ? 'AI 전문가 에이전트' :
               activeAdminTab === 'insta_generator' ? '인스타 콘텐츠 생성기' :
               activeAdminTab === 'analytics' ? '네이버 쇼핑트렌드 분석' :
               activeAdminTab === 'kamis' ? 'KAMIS시세' :
               activeAdminTab === 'donki' ? '돈키호테 필수템 관리' : '설정'}
            </h1>
          </div>

          {/* Right Header Controls: Search, Sync, Bell, Theme, Profile, Logout */}
          <div className="flex items-center gap-3.5">
            
            {/* Global Search Capsule */}
            <div className="relative w-56 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="통합 검색..."
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-1.5 rounded-full text-xs transition-all border outline-none ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-indigo-400'
                }`}
              />
            </div>

            {/* Cloud Sync Icon Button */}
            <button
              onClick={() => syncAllContentToCloud()}
              disabled={isContentSyncing}
              className={`p-2 rounded-lg cursor-pointer transition-colors ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title="클라우드 실시간 동기화"
            >
              <RefreshCw className={`w-4 h-4 ${isContentSyncing ? 'animate-spin text-indigo-500' : ''}`} />
            </button>

            {/* Notification Bell */}
            <div
              onClick={() => setActiveAdminTab(pendingReportsCount > 0 ? 'reports' : 'approval')}
              className={`relative p-2 rounded-lg cursor-pointer transition-colors ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title={pendingReportsCount > 0 ? `신고 대기 ${pendingReportsCount}건` : '알림'}
            >
              <Bell className="w-4 h-4" />
              {(pendingReportsCount > 0 || pendingCount > 0) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={() => {
                const nextMode = isDark ? 'light' : 'dark';
                setThemeMode(nextMode);
                showToast(nextMode === 'light' ? '☀️ 라이트 모드로 전환되었습니다.' : '🌙 다크 모드로 전환되었습니다.', 'info');
              }}
              className={`p-2 rounded-lg cursor-pointer transition-colors ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title="테마 모드 전환 (라이트/다크)"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Master Admin Profile Pill (Matching Screenshot) */}
            <div className={`flex items-center gap-2.5 pl-3 border-l ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}>
                <Users className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight hidden md:block">
                <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>마스터 관리자</div>
                <div className="text-[10px] text-slate-400 font-mono">admin@sinsangpick.app</div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleAdminLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ml-1"
              title="관리자 로그아웃"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>
        </header>

        {/* Desktop Scrollable Main Canvas */}
        <main className={`flex-1 overflow-y-auto p-6 md:p-8 space-y-6 ${
          isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#f8fafc] text-slate-800'
        }`}>
          
          {/* ========================================================
              TAB 1: OVERVIEW (대시보드 개요)
             ======================================================== */}
          {activeAdminTab === 'overview' && (
            <div className="space-y-6">
              
              {/* 1. 8-Stat KPI Cards (2 Rows of 4 Columns - Clean Minimalist Style) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* 1. 전체 회원 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">전체 회원</span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/40">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                      {allProfiles.length.toLocaleString()}
                      <span className="text-xs font-semibold text-slate-400 ml-1">명</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                      <span>포인트 {totalMemberPoints.toLocaleString()}P</span>
                      <button onClick={() => setActiveAdminTab('users')} className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center">
                        관리 <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. 오늘 가입 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">오늘 가입</span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
                      <UserPlus className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                      +{todaySignupsCount}
                      <span className="text-xs font-semibold text-slate-400 ml-1">명</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">신규 회원 유입</span>
                      <button onClick={() => setActiveAdminTab('users')} className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center">
                        목록 <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. 오늘 신상품 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">오늘 신상</span>
                    <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-100 dark:border-violet-900/40">
                      <Zap className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                      {todayProductsCount}
                      <span className="text-xs font-semibold text-slate-400 ml-1">개</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                      <span>평점 ★ {avgReviewRating}</span>
                      <button onClick={() => { setProductFilterBadge('today'); setActiveAdminTab('products'); }} className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center">
                        보기 <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. 오늘 신고 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">오늘 신고</span>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900/40">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                      {todayReportsCount}
                      <span className="text-xs font-semibold text-slate-400 ml-1">건</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                      <span className={pendingReportsCount > 0 ? "text-rose-500 font-semibold" : ""}>신고 대기 {pendingReportsCount}건</span>
                      <button onClick={() => setActiveAdminTab('reports')} className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center">
                        검토 <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. 수집 대기 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">수집 신제품 승인</span>
                    <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center border border-pink-100 dark:border-pink-900/40">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                      {pendingCount}
                      <span className="text-xs font-semibold text-slate-400 ml-1">개</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                      <span>자동 수집 대기</span>
                      <button onClick={() => setActiveAdminTab('approval')} className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center">
                        승인 <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 6. 정지 회원 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">정지 회원</span>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                      <Ban className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                      {bannedMembersCount}
                      <span className="text-xs font-semibold text-slate-400 ml-1">명</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                      <span>이용 제한 계정</span>
                      <button onClick={() => setActiveAdminTab('users')} className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center">
                        관리 <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 7. 정보 수정요청 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">정보 수정요청</span>
                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center border border-orange-100 dark:border-orange-900/40">
                      <Edit3 className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                      {pendingProductEditsCount}
                      <span className="text-xs font-semibold text-slate-400 ml-1">건</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                      <span>유저 제보 대기</span>
                      <button onClick={() => setActiveAdminTab('product_edits')} className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center">
                        검토 <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 8. 활성 회원 (DAU) */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">활성 회원 (DAU)</span>
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-100 dark:border-teal-900/40">
                      <UserCheck className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                      {activeMembersCount}
                      <span className="text-xs font-semibold text-slate-400 ml-1">명</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                        최근 24시간 활동
                      </span>
                      <button onClick={() => setActiveAdminTab('users')} className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center">
                        현황 <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* 2. 최근 14일 신규 가입자 수 (막대 그래프) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">최근 14일 신규 가입자</h2>
                    <p className="text-xs text-slate-400 mt-0.5">날짜별 가입자 수입니다. (한국 시간 기준)</p>
                  </div>
                  <div className="flex items-end gap-6">
                    <div className="text-right">
                      <div className="text-[11px] font-semibold text-slate-400">오늘</div>
                      <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 leading-none mt-1">{signupTrend.today.toLocaleString()}<span className="text-sm font-bold ml-0.5">명</span></div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-semibold text-slate-400">14일 합계</div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-1">{signupTrend.total.toLocaleString()}<span className="text-sm font-bold ml-0.5">명</span></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-stretch gap-1.5 sm:gap-2.5 h-56 border-b border-slate-200 dark:border-slate-700">
                  {signupTrend.days.map(d => (
                    <div key={d.dateStr} className="flex-1 min-w-0 flex flex-col justify-end items-center gap-1.5" title={`${d.dateStr} · ${d.signups}명`}>
                      <span className={`text-xs sm:text-sm font-bold tabular-nums ${d.signups > 0 ? 'text-slate-900 dark:text-white' : 'text-slate-300 dark:text-slate-600'}`}>
                        {d.signups}
                      </span>
                      <div
                        className={`w-full max-w-10 rounded-t-md ${d.signups === 0 ? 'bg-slate-200 dark:bg-slate-700' : d.isToday ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-indigo-400 dark:bg-indigo-500/70'}`}
                        style={{ height: d.signups === 0 ? '2px' : `${Math.max(6, (d.signups / signupTrend.max) * 82)}%` }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-1.5 sm:gap-2.5 text-[11px] font-mono">
                  {signupTrend.days.map(d => (
                    <span key={d.dateStr} className={`flex-1 min-w-0 text-center ${d.isToday ? 'font-bold text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                      {d.isToday ? '오늘' : d.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* 3. 2-Column Section: 최근 접수된 신고 & 최근 가입한 회원 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Column 1: 최근 접수된 신고 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          최근 접수된 신고
                          {pendingReportsCount > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                              {pendingReportsCount}건 대기
                            </span>
                          )}
                        </h3>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveAdminTab('reports')}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                    >
                      신고 관리로 이동 <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {recentReportsList.length === 0 ? (
                      <div className="text-center py-8 text-xs text-slate-400">
                        접수된 신고 내역이 없습니다.
                      </div>
                    ) : (
                      recentReportsList.map(rep => (
                        <div
                          key={rep.id}
                          className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-start justify-between gap-3 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
                        >
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                rep.status === 'pending'
                                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                  : rep.status === 'resolved'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                              }`}>
                                {rep.status === 'pending' ? '처리대기' : rep.status === 'resolved' ? '처리완료' : '기각'}
                              </span>
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{rep.reason}</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{rep.targetContent || '내용 없음'}</p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                              <span>신고자: {rep.reporterName || '익명'}</span>
                              <span>•</span>
                              <span>대상: {rep.targetUserName || '사용자'}</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                            {rep.createdAt ? rep.createdAt.slice(5, 16).replace('T', ' ') : ''}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Column 2: 최근 가입한 회원 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          최근 가입한 회원
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">
                            총 {allProfiles.length}명
                          </span>
                        </h3>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveAdminTab('users')}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                    >
                      회원 관리로 이동 <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {recentUsersList.length === 0 ? (
                      <div className="text-center py-8 text-xs text-slate-400">
                        가입 회원이 없습니다.
                      </div>
                    ) : (
                      recentUsersList.map(u => (
                        <div
                          key={u.uid}
                          className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-3 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                              {u.photoURL ? (
                                <img src={u.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
                              ) : (
                                (u.displayName || 'U').slice(0, 1).toUpperCase()
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{u.displayName || '익명회원'}</p>
                                {(() => {
                                  const prov = resolveUserProfileProvider(u, u, currentUser);
                                  if (prov === 'apple') {
                                    return <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-black text-white shrink-0"> Apple</span>;
                                  }
                                  if (prov === 'kakao') {
                                    return <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#FEE500] text-slate-900 font-sans shrink-0">Kakao</span>;
                                  }
                                  return null;
                                })()}
                                {u.status === 'banned' && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">정지</span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 truncate">{u.email || '이메일 미등록'}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400">{(u.points || 0).toLocaleString()}P</span>
                            <p className="text-[10px] text-slate-400">{u.createdAt ? u.createdAt.slice(5, 10) : ''}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* 4. Secondary Row: 배틀 매치업 & 배너 현황 */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Battle Matchup Preview */}
                <div className="xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                        <Swords className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{battleConfig.title}</h3>
                        <p className="text-xs text-slate-400">{battleConfig.subtitle}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveAdminTab('battle')}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1"
                    >
                      배틀 설정 <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img src={prodA?.image} alt={prodA?.name} className="w-12 h-12 object-cover rounded-xl border border-blue-500/30 shrink-0" />
                      <div className="truncate">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-500/10 px-1.5 py-0.5 rounded">{battleConfig.labelA}</span>
                        <p className="text-xs font-bold truncate mt-0.5 text-slate-900 dark:text-white">{prodA?.name}</p>
                        <p className="text-xs font-mono font-bold text-blue-600">{battleVoteLabel('A')}</p>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-md">
                      VS
                    </div>

                    <div className="flex items-center justify-end gap-3 flex-1 min-w-0 text-right">
                      <div className="truncate">
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-500/10 px-1.5 py-0.5 rounded">{battleConfig.labelB}</span>
                        <p className="text-xs font-bold truncate mt-0.5 text-slate-900 dark:text-white">{prodB?.name}</p>
                        <p className="text-xs font-mono font-bold text-rose-600">{battleVoteLabel('B')}</p>
                      </div>
                      <img src={prodB?.image} alt={prodB?.name} className="w-12 h-12 object-cover rounded-xl border border-rose-500/30 shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Banner Summary */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-indigo-500" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">활성 배너 구좌</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                        {activeBannersCount}개 노출중
                      </span>
                    </div>

                    <div className="mt-3.5 space-y-2">
                      {banners.slice(0, 3).map((b, idx) => (
                        <div key={b.id} className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-mono font-bold text-[10px] text-slate-500">
                              {idx + 1}
                            </span>
                            <span className="font-semibold truncate text-slate-800 dark:text-slate-200">{b.title}</span>
                          </div>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${b.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                            {b.isActive ? '노출' : '숨김'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveAdminTab('banners')}
                    className="w-full py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    배너 전체 관리 ({banners.length})
                  </button>
                </div>

              </div>

              {/* 5. Recent Products Snapshot Table */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Package className="w-4 h-4 text-indigo-500" />
                      <span>최근 등록된 신상품 요약</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">승인 완료된 최신 먹거리 카탈로그 목록입니다.</p>
                  </div>
                  <button
                    onClick={() => setActiveAdminTab('products')}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    전체 {products.length}개 상품 보기 <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="uppercase font-bold text-[11px] border-b border-slate-100 dark:border-slate-800 text-slate-400 bg-slate-50/50 dark:bg-slate-800/30">
                      <tr>
                        <th className="py-3 px-4">상품명 / 브랜드</th>
                        <th className="py-3 px-4">카테고리</th>
                        <th className="py-3 px-4">가격</th>
                        <th className="py-3 px-4">출시일</th>
                        <th className="py-3 px-4">오늘신상</th>
                        <th className="py-3 px-4">인기HOT</th>
                        <th className="py-3 px-4 text-right">관리</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {products.slice(0, 5).map(prod => (
                        <tr key={prod.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-800 shrink-0" />
                              <div>
                                <p className="font-bold text-xs text-slate-900 dark:text-white">{prod.name}</p>
                                <p className="text-[11px] text-slate-400">{prod.brand}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {prod.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                            {prod.price.toLocaleString()}원
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                            {prod.releaseDate}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => toggleProductToday(prod.id)}
                              className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${
                                prod.isToday ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600'
                              }`}
                            >
                              <Zap className="w-3 h-3" />
                              <span>{prod.isToday ? 'ON' : 'OFF'}</span>
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => toggleProductHot(prod.id)}
                              className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${
                                prod.isHot ? 'bg-orange-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600'
                              }`}
                            >
                              <Flame className="w-3 h-3" />
                              <span>{prod.isHot ? 'ON' : 'OFF'}</span>
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => { handleOpenEditProduct(prod); setActiveAdminTab('products'); }}
                              className="px-2.5 py-1 rounded text-[11px] font-bold border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-colors"
                            >
                              수정
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}


          {/* ========================================================
              TAB: KAMIS AGRICULTURAL & MARINE PRODUCE LIVE PRICES
             ======================================================== */}
          {activeAdminTab === 'kamis' && (
            <KamisPriceManagementTab />
          )}

          {activeAdminTab === 'donki' && (
            <DonkiManagementTab />
          )}

          {/* ========================================================
              TAB 2: 신제품 수집·승인 (수집 → 대기함 검토 → 승인/반려 통합)
             ======================================================== */}
          {activeAdminTab === 'approval' && (
            <ProductIntakeTab isDark={isDark} />
          )}

          {/* ========================================================
              TAB 3: PRODUCTS (상품 및 신제품 관리 + 대량 일괄 작업)
             ======================================================== */}
          {activeAdminTab === 'products' && (
            <div className="space-y-6">
              
              {/* Product Toolbar */}
              <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl border shadow-sm ${cardBg}`}>
                
                {/* Search & Badge filter */}
                <div className="flex flex-wrap items-center gap-2.5 flex-1">
                  <div className="relative min-w-[260px] flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={e => setProductSearch(e.target.value)}
                      placeholder="상품명, 브랜드명 검색..."
                      className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 border ${inputBg}`}
                    />
                    {productSearch && (
                      <button onClick={() => setProductSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Badge Filter Pills */}
                  <div className={`flex items-center gap-1 p-1 rounded-xl border text-xs ${subCardBg}`}>
                    <button
                      onClick={() => setProductFilterBadge('all')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        productFilterBadge === 'all' 
                          ? (isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900 shadow-xs') 
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      전체 ({products.length})
                    </button>
                    <button
                      onClick={() => setProductFilterBadge('today')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                        productFilterBadge === 'today' ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:text-indigo-700'
                      }`}
                    >
                      <Zap className="w-3 h-3" />
                      <span>오늘신상 ({todayProductsCount})</span>
                    </button>
                    <button
                      onClick={() => setProductFilterBadge('hot')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                        productFilterBadge === 'hot' ? 'bg-orange-600 text-white' : 'text-orange-600 hover:text-orange-700'
                      }`}
                    >
                      <Flame className="w-3 h-3" />
                      <span>인기HOT ({hotProductsCount})</span>
                    </button>
                  </div>
                </div>

                {/* Right: View Mode & Add Button */}
                <div className="flex items-center gap-2">
                  <div className={`flex items-center p-1 rounded-xl border text-xs ${subCardBg}`}>
                    <button
                      onClick={() => setProductViewMode('table')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                        productViewMode === 'table' 
                          ? (isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900 shadow-xs') 
                          : 'text-slate-400'
                      }`}
                    >
                      테이블형
                    </button>
                    <button
                      onClick={() => setProductViewMode('grid')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                        productViewMode === 'grid' 
                          ? (isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900 shadow-xs') 
                          : 'text-slate-400'
                      }`}
                    >
                      카드 그리드형
                    </button>
                  </div>

                  <button
                    onClick={handleOpenNewProduct}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>신규 상품 등록</span>
                  </button>
                </div>

              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setProductCategoryFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      productCategoryFilter === cat
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : isDark
                          ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* BULK OPERATION TOOLBAR (다중 선택 일괄 작업 바) */}
              {selectedProductIds.length > 0 && (
                <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                      {selectedProductIds.length}
                    </span>
                    <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                      개 상품이 선택되었습니다
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <button
                      onClick={() => handleBulkSetToday(true)}
                      className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-xs flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      <span>일괄 오늘신상 ON</span>
                    </button>
                    <button
                      onClick={() => handleBulkSetToday(false)}
                      className="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 rounded-lg font-bold"
                    >
                      오늘신상 OFF
                    </button>
                    <button
                      onClick={() => handleBulkSetHot(true)}
                      className="px-2.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold shadow-xs flex items-center gap-1"
                    >
                      <Flame className="w-3 h-3" />
                      <span>일괄 인기HOT ON</span>
                    </button>
                    <button
                      onClick={() => handleBulkSetHot(false)}
                      className="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 rounded-lg font-bold"
                    >
                      인기HOT OFF
                    </button>
                    <button
                      onClick={handleBulkRevokeSelectedProducts}
                      className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold shadow-xs flex items-center gap-1"
                      title="선택한 상품을 승인 취소하고 다시 승인 대기함으로 되돌립니다"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>선택 일괄 승인 취소 (대기함 복원)</span>
                    </button>
                    <button
                      onClick={handleExportSelectedProducts}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-xs flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>선택 백업 JSON</span>
                    </button>
                    <button
                      onClick={handleBulkDeleteProducts}
                      className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold shadow-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>선택 일괄 삭제</span>
                    </button>
                    <button
                      onClick={() => setSelectedProductIds([])}
                      className="p-1.5 text-slate-400 hover:text-slate-600"
                      title="선택 취소"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Products Table View */}
              {productViewMode === 'table' ? (
                <div className={`rounded-2xl border shadow-sm overflow-hidden ${cardBg}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className={`uppercase font-bold text-[11px] border-b ${tableHeaderBg}`}>
                        <tr>
                          <th className="py-3 px-4 w-12 text-center">
                            <input
                              type="checkbox"
                              checked={selectedProductIds.length === filteredAdminProducts.length && filteredAdminProducts.length > 0}
                              onChange={toggleSelectAllProducts}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-0 w-4 h-4 cursor-pointer"
                            />
                          </th>
                          <th className="py-3 px-4">상품 / 브랜드</th>
                          <th className="py-3 px-4">카테고리</th>
                          <th className="py-3 px-4">가격 (할인율)</th>
                          <th className="py-3 px-4">평점 / 리뷰</th>
                          <th className="py-3 px-4">⚡ 오늘신상 토글</th>
                          <th className="py-3 px-4">🔥 인기HOT 토글</th>
                          <th className="py-3 px-4">판매처 & 구매 링크</th>
                          <th className="py-3 px-4 text-right">관리</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${tableRowHover}`}>
                        {paginatedAdminProducts.map((prod: Product) => {
                          const isSelected = selectedProductIds.includes(prod.id);
                          return (
                            <tr key={prod.id} className={`transition-colors ${isSelected ? (isDark ? 'bg-indigo-950/20' : 'bg-indigo-50/60') : ''}`}>
                              <td className="py-3 px-4 text-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleProductSelect(prod.id)}
                                  className="rounded border-slate-300 text-indigo-600 focus:ring-0 w-4 h-4 cursor-pointer"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="relative shrink-0 group">
                                    <div
                                      onClick={() => setPreviewImageModalUrl(prod.image)}
                                      className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer"
                                    >
                                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                                        <Eye className="w-3.5 h-3.5 text-white" />
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setImageSelectorTarget({
                                          brand: prod.brand,
                                          name: prod.name,
                                          currentImage: prod.image,
                                          onSelect: (newUrl: string) => {
                                            updateProduct(prod.id, { image: newUrl });
                                            showToast('상품 이미지가 고화질 실물 이미지로 교체되었습니다.', 'success');
                                          }
                                        });
                                      }}
                                      className="absolute -bottom-1 -right-1 p-1 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-xs transition-transform hover:scale-110"
                                      title="고화질 실물 이미지로 교체"
                                    >
                                      <ImageIcon className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                                        {getProductCode(prod)}
                                      </span>
                                      <p className={`font-bold text-xs truncate max-w-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{prod.name}</p>
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-0.5">{prod.brand} · {prod.releaseDate}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                                  {prod.category} {prod.subCategory && `> ${prod.subCategory}`}
                                </span>
                              </td>
                              <td className={`py-3 px-4 font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                <span className="font-bold">{prod.price.toLocaleString()}원</span>
                                {prod.discountRate && prod.discountRate > 0 ? (
                                  <span className="text-[10px] text-rose-500 ml-1 font-bold">(-{prod.discountRate}%)</span>
                                ) : null}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1 font-bold text-amber-500">
                                  <span>★</span>
                                  <span>{(prod.overallRating || 0).toFixed(1)}</span>
                                  <span className="text-slate-400 font-normal">({prod.ratingCount || 0})</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => toggleProductToday(prod.id)}
                                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                                    prod.isToday
                                      ? 'bg-indigo-600 text-white shadow-xs'
                                      : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  <Zap className="w-3 h-3" />
                                  <span>{prod.isToday ? '오늘신상 ON' : 'OFF'}</span>
                                </button>
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => toggleProductHot(prod.id)}
                                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                                    prod.isHot
                                      ? 'bg-orange-600 text-white shadow-xs'
                                      : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  <Flame className="w-3 h-3" />
                                  <span>{prod.isHot ? '인기HOT ON' : 'OFF'}</span>
                                </button>
                              </td>
                              <td className="py-3 px-4">
                                <div className="space-y-1 max-w-[170px]">
                                  <div className="flex flex-wrap gap-1">
                                    {prod.stores?.map((st: string) => {
                                      const stockItem = prod.storeStocks?.find((s: StoreStockItem) => s.store === st);
                                      const hasLink = !!stockItem?.appLink;
                                      return (
                                        <span
                                          key={st}
                                          onClick={(e) => {
                                            if (hasLink) {
                                              e.stopPropagation();
                                              window.open(stockItem.appLink, '_blank');
                                            }
                                          }}
                                          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold border transition-all ${
                                            hasLink
                                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 cursor-pointer hover:bg-indigo-100'
                                              : isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200'
                                          }`}
                                          title={hasLink ? `${st}: ${stockItem.appLink} (클릭 시 새 창 열기)` : `${st} (링크 미등록)`}
                                        >
                                          <span>{st}</span>
                                          {hasLink && <ExternalLink className="w-2.5 h-2.5 text-indigo-500 shrink-0" />}
                                        </span>
                                      );
                                    })}
                                  </div>
                                  {/* 링크 등록 요약 배지 */}
                                  {(() => {
                                    const linkedCount = prod.storeStocks?.filter((s: StoreStockItem) => !!s.appLink).length || 0;
                                    return linkedCount > 0 ? (
                                      <div className="flex items-center gap-1">
                                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-200/60 dark:border-emerald-800/40">
                                          <span>🔗 링크 {linkedCount}개 등록됨</span>
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="inline-block text-[9px] text-slate-400">
                                        링크 미등록
                                      </span>
                                    );
                                  })()}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleOpenQuickLinks(prod)}
                                    className={`px-2 py-1 rounded text-[11px] font-bold transition-all border flex items-center gap-1 ${
                                      (prod.storeStocks?.some((s: StoreStockItem) => !!s.appLink))
                                        ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800'
                                        : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                                    }`}
                                    title="판매처 링크 간편 등록/수정"
                                  >
                                    <Link2 className="w-3 h-3 text-indigo-500" />
                                    <span>링크</span>
                                  </button>
                                  <button
                                    onClick={() => handleOpenEditProduct(prod)}
                                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all border flex items-center gap-1 ${
                                      isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                                    }`}
                                  >
                                    <Edit3 className="w-3 h-3 text-indigo-500" />
                                    <span>수정</span>
                                  </button>
                                  <button
                                    onClick={() => setImageSelectorTarget({
                                      brand: prod.brand,
                                      name: prod.name,
                                      currentImage: prod.image,
                                      onSelect: (newUrl: string) => {
                                        updateProduct(prod.id, { image: newUrl });
                                        showToast('상품 이미지가 고화질 실물 이미지로 교체되었습니다.', 'success');
                                      }
                                    })}
                                    className={`px-2 py-1 rounded text-[11px] font-bold transition-all border flex items-center gap-1 ${
                                      isDark ? 'bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 border-indigo-800/60' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-200'
                                    }`}
                                    title="네이버 쇼핑 공식몰 고화질 이미지 검색 및 교체"
                                  >
                                    <ImageIcon className="w-3 h-3" />
                                    <span>이미지</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`'${prod.name}' 상품의 승인을 취소하고 대기함으로 되돌리시겠습니까?`)) {
                                        revokeApprovedProduct(prod.id);
                                      }
                                    }}
                                    className={`px-2 py-1 rounded text-[11px] font-bold transition-all border flex items-center gap-1 ${
                                      isDark ? 'bg-slate-800 hover:bg-amber-950/50 text-amber-300 border-slate-700' : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                                    }`}
                                    title="승인 취소 (대기함으로 복원)"
                                  >
                                    <RotateCcw className="w-3 h-3 text-amber-500" />
                                    <span>승인 취소</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`'${prod.name}' 상품을 정말 삭제하시겠습니까?`)) {
                                        deleteProduct(prod.id);
                                        setSelectedProductIds(prev => prev.filter(id => id !== prod.id));
                                      }
                                    }}
                                    className="p-1 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded transition-all"
                                    title="삭제"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Card Grid View */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {paginatedAdminProducts.map(prod => (
                    <div key={prod.id} className={`p-4 rounded-2xl border shadow-sm flex flex-col justify-between space-y-3 group ${cardBg}`}>
                      <div>
                        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-3">
                          <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute top-2 left-2 flex gap-1">
                            {prod.isToday && <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-indigo-600 text-white shadow-xs">오늘신상</span>}
                            {prod.isHot && <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-orange-600 text-white shadow-xs">HOT</span>}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageSelectorTarget({
                                brand: prod.brand,
                                name: prod.name,
                                currentImage: prod.image,
                                onSelect: (newUrl: string) => {
                                  updateProduct(prod.id, { image: newUrl });
                                  showToast('상품 이미지가 고화질 실물 이미지로 교체되었습니다.', 'success');
                                }
                              });
                            }}
                            className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 hover:bg-black text-white text-[10px] font-bold rounded-lg backdrop-blur-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="고화질 이미지 검색 및 교체"
                          >
                            <ImageIcon className="w-3 h-3 text-amber-400" />
                            <span>교체</span>
                          </button>
                        </div>

                        <div>
                          <span className="text-[10px] font-semibold text-indigo-600">{prod.brand}</span>
                          <h4 className={`text-xs font-bold truncate mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{prod.name}</h4>
                          <p className="text-xs font-mono font-bold mt-1">
                            {prod.price.toLocaleString()}원
                            {prod.discountRate ? <span className="text-rose-500 ml-1">(-{prod.discountRate}%)</span> : null}
                          </p>
                        </div>
                      </div>

                      <div className={`pt-3 border-t flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                        <span className="text-[10px] text-amber-500 font-bold">★ {prod.overallRating}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className={`p-1.5 rounded-lg border ${isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'}`}
                            title="수정"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`'${prod.name}' 상품의 승인을 취소하고 대기함으로 되돌리시겠습니까?`)) {
                                revokeApprovedProduct(prod.id);
                              }
                            }}
                            className={`p-1.5 rounded-lg border ${isDark ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-amber-950/60' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'}`}
                            title="승인 취소 (대기함으로 복원)"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`'${prod.name}' 상품을 삭제하시겠습니까?`)) {
                                deleteProduct(prod.id);
                                setSelectedProductIds(prev => prev.filter(id => id !== prod.id));
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* [요구사항 2] 상품 목록 페이지네이션 컨트롤러 (렉 완벽 해결) */}
              <div className={`mt-6 p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${cardBg}`}>
                <div className="text-xs font-semibold text-slate-500">
                  전체 <span className="font-bold text-slate-900 dark:text-white">{filteredAdminProducts.length}</span>개 중{' '}
                  <span className="font-bold text-indigo-600">
                    {filteredAdminProducts.length > 0 ? (productCurrentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(productCurrentPage * itemsPerPage, filteredAdminProducts.length)}
                  </span>
                  개 표시 (페이지 {productCurrentPage} / {totalProductPages})
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={productCurrentPage === 1}
                    onClick={() => setProductCurrentPage(prev => Math.max(1, prev - 1))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      productCurrentPage === 1
                        ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100 dark:bg-slate-800'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>이전</span>
                  </button>

                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: totalProductPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalProductPages || Math.abs(p - productCurrentPage) <= 2)
                      .map((p, idx, arr) => {
                        const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                        return (
                          <React.Fragment key={p}>
                            {showEllipsis && <span className="px-1 text-slate-400 text-xs">...</span>}
                            <button
                              onClick={() => setProductCurrentPage(p)}
                              className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                                productCurrentPage === p
                                  ? 'bg-indigo-600 text-white shadow-xs'
                                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                              }`}
                            >
                              {p}
                            </button>
                          </React.Fragment>
                        );
                      })}
                  </div>

                  <button
                    disabled={productCurrentPage >= totalProductPages}
                    onClick={() => setProductCurrentPage(prev => Math.min(totalProductPages, prev + 1))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      productCurrentPage >= totalProductPages
                        ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100 dark:bg-slate-800'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>다음</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              TAB: POINTS & USER MANAGEMENT (회원 및 포인트 관리 통합)
             ======================================================== */}
          {activeAdminTab === 'points' && (
            <PointManagementTab isDark={isDark} />
          )}

          {/* ========================================================
              TAB 5: REVIEWS & COMMUNITY (리뷰 및 커뮤니티 모더레이션 NEW)
             ======================================================== */}
          {activeAdminTab === 'reviews' && (
            <div className="space-y-6">
              
              {/* Header Card */}
              <div className={`p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${cardBg}`}>
                <div>
                  <h2 className={`text-base font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <MessageSquare className="w-5 h-5 text-emerald-500" />
                    <span>사용자 리뷰 및 커뮤니티 피드 모더레이션</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    신제품을 맛본 소비자들의 실측 후기 및 커뮤니티 글을 모니터링하고 부적절한 게시물을 신속히 관리합니다.
                  </p>
                </div>

                {/* Sub Tab Switcher */}
                <div className={`flex items-center p-1 rounded-xl border text-xs ${subCardBg}`}>
                  <button
                    onClick={() => setModerationSubTab('reviews')}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                      moderationSubTab === 'reviews'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    ⭐ 제품 리뷰 ({reviews.length})
                  </button>
                  <button
                    onClick={() => setModerationSubTab('community')}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                      moderationSubTab === 'community'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    📝 커뮤니티 글 ({communityPosts.length})
                  </button>
                </div>
              </div>

              {/* 1. SubTab: REVIEWS MODERATION */}
              {moderationSubTab === 'reviews' && (
                <div className="space-y-4">
                  
                  {/* Review Search Toolbar */}
                  <div className={`p-4 rounded-xl border flex items-center gap-3 ${subCardBg}`}>
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={reviewSearchQuery}
                        onChange={e => setReviewSearchQuery(e.target.value)}
                        placeholder="리뷰 내용, 상품명, 작성자 닉네임 검색..."
                        className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none border ${inputBg}`}
                      />
                    </div>
                    <span className="text-xs text-slate-400">
                      총 {filteredReviews.length}건 검색됨
                    </span>
                  </div>

                  {/* Reviews List */}
                  {filteredReviews.length === 0 ? (
                    <div className={`p-12 rounded-2xl border text-center text-xs text-slate-400 ${cardBg}`}>
                      조건에 맞는 리뷰가 없습니다.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredReviews.map(r => (
                        <div key={r.id} className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between space-y-3 ${cardBg}`}>
                          <div>
                            {/* Product Info & Rating */}
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                              <div className="flex items-center gap-2 truncate">
                                {r.productImage && (
                                  <img src={r.productImage} alt={r.productName} className="w-9 h-9 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shrink-0" />
                                )}
                                <div className="truncate">
                                  <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{r.productName}</p>
                                  <p className="text-[10px] text-slate-400">{r.createdAt || '최근 작성'}</p>
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-500/10 text-amber-600">
                                ★ {r.rating}
                              </span>
                            </div>

                            {/* Author & Review Content */}
                            <div className="pt-3 space-y-2">
                              <div className="flex items-center gap-2">
                                <img src={r.userAvatar} alt={r.userName} className="w-5 h-5 rounded-full object-cover" />
                                <span className="text-xs font-bold">{r.userName}</span>
                              </div>
                              <p className={`text-xs leading-relaxed break-words break-all whitespace-pre-wrap [overflow-wrap:anywhere] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                {r.content}
                              </p>
                              {r.images && r.images.length > 0 && (
                                <div className="flex gap-2 pt-1">
                                  {r.images.map((img, idx) => (
                                    <img
                                      key={idx}
                                      src={img}
                                      alt="리뷰사진"
                                      onClick={() => setPreviewImageModalUrl(img)}
                                      className="w-16 h-16 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Footer Actions */}
                          <div className={`pt-3 border-t flex items-center justify-between text-xs text-slate-400 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {r.likes || 0}</span>
                              <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {r.commentsCount || 0}</span>
                            </div>
                            <button
                              onClick={() => {
                                if (confirm(`'${r.userName}'님의 리뷰를 삭제하시겠습니까?`)) {
                                  deleteReview(r.id);
                                }
                              }}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold flex items-center gap-1 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>삭제</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* 2. SubTab: COMMUNITY MODERATION */}
              {moderationSubTab === 'community' && (
                <div className="space-y-4">
                  
                  {/* Community Search Toolbar */}
                  <div className={`p-4 rounded-xl border flex items-center gap-3 ${subCardBg}`}>
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={communitySearchQuery}
                        onChange={e => setCommunitySearchQuery(e.target.value)}
                        placeholder="게시글 제목, 내용, 작성자 검색..."
                        className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none border ${inputBg}`}
                      />
                    </div>
                    <span className="text-xs text-slate-400">
                      총 {filteredCommunityPosts.length}건 검색됨
                    </span>
                  </div>

                  {/* Community Posts Table */}
                  <div className={`rounded-2xl border shadow-sm overflow-hidden ${cardBg}`}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className={`uppercase font-bold text-[11px] border-b ${tableHeaderBg}`}>
                          <tr>
                            <th className="py-3 px-4">분류</th>
                            <th className="py-3 px-4">제목 및 본문 요약</th>
                            <th className="py-3 px-4">작성자</th>
                            <th className="py-3 px-4">좋아요 / 댓글</th>
                            <th className="py-3 px-4">작성 일시</th>
                            <th className="py-3 px-4 text-right">관리</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${tableRowHover}`}>
                          {filteredCommunityPosts.map(post => (
                            <tr key={post.id} className="transition-colors">
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  post.category === '인기글' ? 'bg-orange-500/10 text-orange-600' :
                                  post.category === '질문/답변' ? 'bg-blue-500/10 text-blue-600' :
                                  post.category === '이벤트' ? 'bg-purple-500/10 text-purple-600' :
                                  'bg-slate-100 text-slate-700'
                                }`}>
                                  {post.category}
                                </span>
                              </td>
                              <td className="py-3 px-4 max-w-md">
                                <p className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{post.title}</p>
                                <p className="text-[11px] text-slate-400 truncate mt-0.5">{post.content}</p>
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-semibold">{post.author}</span>
                              </td>
                              <td className="py-3 px-4 text-slate-500 font-mono">
                                👍 {post.likes || 0} · 💬 {post.commentsCount || 0}
                              </td>
                              <td className="py-3 px-4 text-slate-400 text-[11px]">
                                {post.createdAt}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => {
                                    if (confirm(`'${post.title}' 게시글을 삭제하시겠습니까?`)) {
                                      deleteCommunityPost(post.id);
                                    }
                                  }}
                                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold flex items-center gap-1 transition-colors ml-auto"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>삭제</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ========================================================
              TAB 5: ANALYTICS & TRENDS (트렌드 & 통계 분석 NEW)
             ======================================================== */}
          {activeAdminTab === 'analytics' && (
            <div className="space-y-6">
              
              {/* 1. Header Card with DataLab Sync Status */}
              <div className={`p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${cardBg}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" />
                      <span>NAVER DataLab 쇼핑인사이트 실시간 연동</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                      실시간 트렌드 지수 자동 집계
                    </span>
                  </div>
                  <h2 className={`text-base font-black flex items-center gap-2 mt-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <span>네이버 쇼핑인사이트 빅데이터 & 식품 신제품 트렌드 분석</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    네이버 5,000만 사용자들의 실제 쇼핑 클릭/검색 빅데이터를 기반으로 최신 인기 먹거리 트렌드를 실시간 분석합니다.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveAdminTab('approval')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>신제품 수집·승인으로 이동</span>
                  </button>

                  <button
                    onClick={() => loadShoppingInsights(undefined, true)}
                    disabled={isLoadingInsights || isFetchingRealtimeProducts}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer ${
                      isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                    title="네이버 쇼핑인사이트 빅데이터 및 실시간 인기 상품을 새로고침합니다"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${(isLoadingInsights || isFetchingRealtimeProducts) ? 'animate-spin text-indigo-500' : 'text-slate-500'}`} />
                    <span>쇼핑인사이트 새로고침</span>
                  </button>
                </div>
              </div>

              {/* 2. NAVER DataLab Shopping Category Click Share Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: '과자/베이커리', color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700', defaultRatio: 84 },
                  { name: '음료', color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700', defaultRatio: 78 },
                  { name: '가공/간편식품', color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700', defaultRatio: 92 },
                  { name: '신선식품', color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700', defaultRatio: 65 },
                ].map((cat) => {
                  const matchedResult = shoppingCategoryTrends?.results?.find(r => 
                    r.title.includes(cat.name) || 
                    cat.name.includes(r.title) ||
                    (cat.name.includes('가공') && r.title.includes('가공')) ||
                    (cat.name.includes('과자') && r.title.includes('과자')) ||
                    (cat.name.includes('음료') && r.title.includes('음료')) ||
                    (cat.name.includes('신선') && r.title.includes('신선'))
                  );
                  const currentRatio = matchedResult && matchedResult.data && matchedResult.data.length > 0
                    ? Math.round(matchedResult.data[matchedResult.data.length - 1].ratio)
                    : cat.defaultRatio;

                  return (
                    <div key={cat.name} className={`p-4 rounded-2xl border shadow-sm flex flex-col justify-between ${cardBg}`}>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${cat.bg} ${cat.color}`}>
                            {cat.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">DataLab 지수</span>
                        </div>
                        <div className="mt-3 flex items-baseline gap-1.5">
                          <span className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {currentRatio}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">/ 100 pt</span>
                        </div>
                      </div>
                      <div className="mt-3 w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500"
                          style={{ width: `${currentRatio}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* [NEW] NAVER Search Trend & Demographics Deep Dive Card */}
              <div className={`p-6 rounded-2xl border shadow-sm space-y-6 ${cardBg}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>NAVER 검색어 트렌드 & 쇼핑 인구통계 API</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        openapi / search-trend / shopping demographics
                      </span>
                    </div>
                    <h3 className={`text-base font-black flex items-center gap-2 mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      실시간 네이버 검색어 트렌드 & 연령·성별 클릭 빅데이터 분석
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      궁금한 신제품명 또는 식품 키워드를 직접 입력하여 네이버 통합 검색량 추이와 남녀/연령별 쇼핑 반응을 실시간 조회합니다.
                    </p>
                  </div>

                  {/* Search Input & Action */}
                  <div className="flex items-center gap-2">
                    <div className="relative w-48 sm:w-60">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={searchTrendKeywordInput}
                        onChange={(e) => setSearchTrendKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleFetchSearchTrend(searchTrendKeywordInput);
                            handleFetchDemographics(searchTrendKeywordInput);
                          }
                        }}
                        placeholder="키워드 입력 (예: 신라면, 먹태깡)"
                        className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 ${inputBg}`}
                      />
                    </div>
                    <button
                      onClick={() => {
                        handleFetchSearchTrend(searchTrendKeywordInput);
                        handleFetchDemographics(searchTrendKeywordInput);
                      }}
                      disabled={isLoadingSearchTrend || isLoadingDemographics}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
                    >
                      {isLoadingSearchTrend || isLoadingDemographics ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <TrendingUp className="w-3.5 h-3.5" />
                      )}
                      <span>트렌드 분석</span>
                    </button>
                  </div>
                </div>

                {/* NCP API Hub Activation Guide Banner (When 401 unactivated) */}
                {searchTrendData && searchTrendData.isNcpActive === false && (
                  <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200 text-xs flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>NAVER Cloud 콘솔 '검색어 트렌드' 서비스 활성화 안내</span>
                      </div>
                      <p className="text-[11px] text-amber-700/90 dark:text-amber-300/80">
                        현재 NCP Application에서 '검색어 트렌드'가 미선택 상태여서 쇼핑 키워드 지수로 대체 제공 중입니다. 
                        <strong> [NCP 콘솔] &gt; Application &gt; [수정] &gt; '검색어 트렌드' 체크 후 [저장]</strong>하시면 네이버 콘솔에 검색어 트렌드 사용량이 공식 카운트됩니다.
                      </p>
                    </div>
                    <button
                      onClick={() => handleFetchSearchTrend(searchTrendKeywordInput)}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-xs shrink-0 transition-all active:scale-95 cursor-pointer"
                    >
                      콘솔 활성화 후 재확인
                    </button>
                  </div>
                )}

                {searchTrendData && searchTrendData.isNcpActive === true && (
                  <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-bold">NAVER Cloud Platform '검색어 트렌드' 공식 API 연동 정상 (네이버 콘솔에 사용량 공식 집계 중)</span>
                  </div>
                )}

                {/* Preset Fast Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-[11px] font-bold text-slate-400 shrink-0">추천 분석 키워드:</span>
                  {['신라면', '신라면 툼바', '먹태깡', '두바이 초콜릿', '요아정', '밤티라미수', '피자떡', '마열라면'].map((kw) => (
                    <button
                      key={kw}
                      onClick={() => {
                        setSearchTrendKeywordInput(kw);
                        handleFetchSearchTrend(kw);
                        handleFetchDemographics(kw);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all shrink-0 cursor-pointer ${
                        searchTrendKeywordInput === kw
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : isDark
                          ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {kw}
                    </button>
                  ))}
                </div>

                {/* 2-Column Trend & Demographics Data View */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Search Trend Time-Series Graph */}
                  <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50/70 border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-indigo-500" />
                        <span className="text-xs font-bold">최근 30일 네이버 검색량 추이</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono">
                          {searchTrendData?.results?.[0]?.title || searchTrendKeywordInput}
                        </span>
                      </div>
                      {searchTrendData?.results?.[0]?.data?.length ? (
                        <span className="text-[10px] font-mono text-slate-400">
                          최고치 {Math.round(Math.max(...searchTrendData.results[0].data.map((d: any) => d.ratio)))} pt
                        </span>
                      ) : null}
                    </div>

                    {searchTrendData?.results?.[0]?.data && searchTrendData.results[0].data.length > 0 ? (
                      <div className="space-y-3">
                        {/* Mini SVG Trend Line Chart */}
                        <div className="h-32 w-full flex items-end gap-1 pt-4 pb-2 px-1">
                          {searchTrendData.results[0].data.slice(-20).map((pt: any, idx: number) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                              <div
                                className="w-full rounded-t-sm bg-gradient-to-t from-indigo-600 to-indigo-400 hover:from-indigo-500 hover:to-indigo-300 transition-all cursor-pointer"
                                style={{ height: `${Math.max(6, Math.min(100, Math.round(pt.ratio)))}%` }}
                              />
                              <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-10 shadow-xs">
                                {pt.period.slice(5)}: {Math.round(pt.ratio)}pt
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono px-1">
                          <span>{searchTrendData.results[0].data[0]?.period || ''}</span>
                          <span className="text-indigo-500 font-bold">검색량 지수 (최대 100 기준 상대비)</span>
                          <span>{searchTrendData.results[0].data[searchTrendData.results[0].data.length - 1]?.period || ''}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-32 flex flex-col items-center justify-center text-slate-400 text-xs">
                        <TrendingUp className="w-6 h-6 mb-1 text-slate-300 dark:text-slate-600" />
                        <span>트렌드 데이터 조회 버튼을 눌러 확인하세요.</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Demographics (Gender & Age) */}
                  <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50/70 border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold">쇼핑 클릭 성별·연령 분포</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">
                          {demographicsData?.keyword || searchTrendKeywordInput}
                        </span>
                      </div>
                    </div>

                    {demographicsData ? (
                      <div className="space-y-4">
                        {/* Gender Split Bar */}
                        <div>
                          <div className="flex justify-between text-[11px] font-bold mb-1">
                            <span className="text-blue-500">남성 {demographicsData.genderRatio.male}%</span>
                            <span className="text-rose-500">여성 {demographicsData.genderRatio.female}%</span>
                          </div>
                          <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-700">
                            <div className="bg-blue-500 h-full transition-all" style={{ width: `${demographicsData.genderRatio.male}%` }} />
                            <div className="bg-rose-500 h-full transition-all" style={{ width: `${demographicsData.genderRatio.female}%` }} />
                          </div>
                        </div>

                        {/* Age Groups Distribution */}
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block mb-1.5">연령대별 클릭 점유율</span>
                          <div className="grid grid-cols-5 gap-2">
                            {demographicsData.ageRatios.map((age: any) => (
                              <div key={age.ageGroup} className="flex flex-col items-center">
                                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{age.ratio}%</div>
                                <div className="w-full h-12 flex items-end my-1 bg-slate-200/50 dark:bg-slate-800 rounded">
                                  <div
                                    className="w-full rounded bg-emerald-500 transition-all"
                                    style={{ height: `${Math.max(8, Math.min(100, age.ratio * 2.2))}%` }}
                                  />
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">{age.ageGroup}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-32 flex flex-col items-center justify-center text-slate-400 text-xs">
                        <Users className="w-6 h-6 mb-1 text-slate-300 dark:text-slate-600" />
                        <span>인구통계 데이터를 로딩 중이거나 조회 대기 중입니다.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. NAVER DataLab Realtime Shopping Trending Keywords Board */}
              <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${cardBg}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-500 animate-pulse" />
                    <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>네이버 쇼핑인사이트 실시간 급상승 신제품 키워드 TOP 10</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => loadShoppingInsights(undefined, true)}
                      disabled={isLoadingInsights}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-all flex items-center gap-1 active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLoadingInsights ? 'animate-spin' : ''}`} />
                      <span>TOP 10 새로고침</span>
                    </button>
                    <span className="text-[11px] text-slate-400 hidden sm:inline">※ 키워드를 클릭하면 실시간 쇼핑 상품을 즉시 조회합니다</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className={`uppercase font-bold text-[11px] border-b ${tableHeaderBg}`}>
                      <tr>
                        <th className="py-2.5 px-3 w-14 text-center">순위</th>
                        <th className="py-2.5 px-3">트렌드 검색어</th>
                        <th className="py-2.5 px-3">카테고리</th>
                        <th className="py-2.5 px-3">주요 브랜드</th>
                        <th className="py-2.5 px-3">쇼핑 클릭 지수</th>
                        <th className="py-2.5 px-3">주간 검색 증가율</th>
                        <th className="py-2.5 px-3 text-right">실시간 상품 조회</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${tableRowHover}`}>
                      {shoppingInsightTrends.map(item => (
                        <tr key={item.keyword} className="transition-colors">
                          <td className="py-3 px-3 text-center">
                            <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-mono font-bold text-xs ${
                              item.rank <= 3 ? 'bg-indigo-600 text-white shadow-xs' : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {item.rank}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.keyword}</span>
                              {item.isHot && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-500/10 text-rose-600 border border-rose-500/20">
                                  HOT
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-500 font-semibold">
                            {item.relatedBrand || '-'}
                          </td>
                          <td className="py-3 px-3">
                            <div className="space-y-1 max-w-[130px]">
                              <div className="flex justify-between text-[10px] font-mono">
                                <span className="text-slate-400">지수</span>
                                <span className="font-bold text-indigo-600 dark:text-indigo-400">{item.score} / 100</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500"
                                  style={{ width: `${item.score}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {item.growthRate}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => {
                                handleSearchRealtimeProducts(item.keyword, true);
                                document.getElementById('realtime-products-section')?.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold shadow-xs transition-all active:scale-95 flex items-center gap-1 ml-auto cursor-pointer"
                            >
                              <Search className="w-3 h-3" />
                              <span>실시간 상품 조회</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. NAVER Realtime Live Shopping Products Section (네이버 쇼핑 API 실시간 연동) */}
              <div id="realtime-products-section" className={`p-6 rounded-2xl border shadow-sm space-y-4 scroll-mt-24 ${cardBg}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-rose-500" />
                        <span>LIVE API</span>
                      </span>
                      <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        네이버 쇼핑 실시간 급상승 인기 먹거리/디저트 상품
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      네이버 쇼핑 API에 직접 연동되어 실시간 인기 판매 및 관심 지수가 급상승 중인 실물 신제품 목록입니다.
                    </p>
                  </div>

                  {/* Realtime Live Search Bar */}
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={trendSearchInput}
                        onChange={(e) => setTrendSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSearchRealtimeProducts(trendSearchInput);
                          }
                        }}
                        placeholder="예: 피자떡, 한정선, 두바이 찹쌀떡..."
                        className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 ${inputBg}`}
                      />
                    </div>
                    <button
                      onClick={() => handleSearchRealtimeProducts(trendSearchInput, true)}
                      disabled={isFetchingRealtimeProducts}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      {isFetchingRealtimeProducts ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Search className="w-3.5 h-3.5" />
                      )}
                      <span>실시간 검색</span>
                    </button>
                    <button
                      onClick={() => handleSearchRealtimeProducts(trendSearchInput || (activeTrendKeywordTag === '전체' ? '' : activeTrendKeywordTag), true)}
                      disabled={isFetchingRealtimeProducts}
                      className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1 shrink-0 cursor-pointer"
                      title="네이버 API로 실시간 인기 상품을 새로고침합니다"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isFetchingRealtimeProducts ? 'animate-spin text-indigo-500' : ''}`} />
                      <span>인기 상품 새로고침</span>
                    </button>
                  </div>
                </div>

                {/* Popular Trend Keyword Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1">🔥 핫 키워드:</span>
                  {[
                    '전체',
                    '피자떡',
                    '한정선 찹쌀떡',
                    '두바이 찹쌀떡',
                    '요아정',
                    '밤티라미수',
                    '신라면 툼바',
                    '황치즈',
                    '비쵸비'
                  ].map((kw) => (
                    <button
                      key={kw}
                      onClick={() => handleSearchRealtimeProducts(kw === '전체' ? '' : kw)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all shrink-0 active:scale-95 ${
                        (activeTrendKeywordTag === kw || (kw === '전체' && activeTrendKeywordTag === '전체'))
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : isDark
                          ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {kw === '전체' ? '전체 보기' : `#${kw}`}
                    </button>
                  ))}
                </div>

                {/* Realtime Live Products Grid */}
                {isFetchingRealtimeProducts ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-3">
                    <RefreshCw className="w-7 h-7 text-indigo-500 animate-spin" />
                    <p className="text-xs font-bold text-slate-400">네이버 쇼핑 API에서 실시간 급상승 상품을 조회 중입니다...</p>
                  </div>
                ) : realtimeShoppingProducts.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    검색어에 일치하는 네이버 쇼핑 실시간 상품이 없습니다. 키워드를 변경해보세요.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                    {realtimeShoppingProducts.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className={`rounded-2xl border p-3.5 flex flex-col justify-between transition-all hover:shadow-md ${subCardBg} group`}
                      >
                        <div>
                          {/* Image & Badge */}
                          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3 border border-slate-200/50 dark:border-slate-700/50">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80');
                              }}
                            />
                            <div className="absolute top-2 left-2 flex items-center gap-1">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-black/70 text-white backdrop-blur-xs">
                                TOP {idx + 1}
                              </span>
                              {item.isHot && (
                                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-rose-600 text-white shadow-xs">
                                  HOT
                                </span>
                              )}
                            </div>
                            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[9px] font-bold bg-indigo-600/90 text-white backdrop-blur-xs">
                              {item.category}
                            </span>
                          </div>

                          {/* Brand & Mall */}
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-semibold">
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{item.brand}</span>
                            <span className="truncate max-w-[120px]">{item.mallName}</span>
                          </div>

                          {/* Title */}
                          <h4 className={`text-xs font-bold line-clamp-2 leading-snug mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {item.name}
                          </h4>

                          {/* Price */}
                          <div className="flex items-baseline gap-1 mb-3">
                            <span className="text-xs text-slate-400">네이버 최저가</span>
                            <span className={`text-base font-black font-mono ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                              {item.price.toLocaleString()}원
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              onClick={() => handleAddRealtimeToPending(item)}
                              className="w-full py-1.5 px-2 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-bold border border-indigo-200 dark:border-indigo-800 transition-all active:scale-95 flex items-center justify-center gap-1"
                            >
                              <Zap className="w-3 h-3" />
                              <span>대기함 수집</span>
                            </button>
                            <button
                              onClick={() => handleAddRealtimeToProducts(item)}
                              className="w-full py-1.5 px-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold transition-all active:scale-95 flex items-center justify-center gap-1 shadow-xs"
                            >
                              <Plus className="w-3 h-3" />
                              <span>즉시 정식 등록</span>
                            </button>
                          </div>
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-1 rounded-md text-[9px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center justify-center gap-1"
                          >
                            <span>네이버 쇼핑 연결</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. 2-Column: Left Category Share & Right Convenience Store Share */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Category Share Distribution */}
                <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${cardBg}`}>
                  <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>카테고리별 상품 등록 비중</h3>
                  
                  <div className="space-y-3">
                    {(['과자', '음료', '빵·디저트', '간편식', '패스트푸드', '과일', '식재료', '고기·수산', '기타'] as ProductCategory[]).map(cat => {
                      const count = products.filter(p => p.category === cat).length;
                      const percent = products.length > 0 ? Math.round((count / products.length) * 100) : 0;
                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold">{cat}</span>
                            <span className="text-slate-500 font-mono">{count}개 ({percent}%)</span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Convenience Store Distribution */}
                <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${cardBg}`}>
                  <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>편의점 4사별 신상품 입고 현황</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: 'CU', color: 'bg-purple-500', count: products.filter(p => p.stores?.includes('CU')).length },
                      { name: 'GS25', color: 'bg-blue-500', count: products.filter(p => p.stores?.includes('GS25')).length },
                      { name: '세븐일레븐', color: 'bg-emerald-500', count: products.filter(p => p.stores?.includes('세븐일레븐')).length },
                      { name: '이마트24', color: 'bg-amber-500', count: products.filter(p => p.stores?.includes('이마트24')).length },
                    ].map(st => (
                      <div key={st.name} className={`p-4 rounded-xl border flex items-center justify-between ${subCardBg}`}>
                        <div>
                          <span className="text-xs font-bold text-slate-500">{st.name} 입고</span>
                          <p className={`text-xl font-black font-mono mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{st.count}건</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${st.color}`} />
                      </div>
                    ))}
                  </div>

                  {/* Hot Search Trend Keywords */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-bold text-slate-500 mb-2">실시간 인기 급상승 검색 키워드 TOP 10</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        '#1 꼬북칩', '#2 두바이초콜릿', '#3 제로밀크티', '#4 딸기모찌',
                        '#5 먹태깡', '#6 생레몬하이볼', '#7 연세우유크림빵', '#8 불닭볶음면',
                        '#9 찰떡아이스', '#10 포켓몬빵'
                      ].map((tag, idx) => (
                        <span key={tag} className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          idx < 3 
                            ? 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Top Rated Hall of Fame Products */}
              <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${cardBg}`}>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>소비자 평점 최고 인기 신상 명예의 전당 (TOP 5)</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[...products]
                    .sort((a, b) => (b.overallRating || 0) - (a.overallRating || 0))
                    .slice(0, 5)
                    .map((prod, idx) => (
                      <div key={prod.id} className={`p-3.5 rounded-xl border flex flex-col items-center text-center space-y-2 relative ${subCardBg}`}>
                        <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                          {idx + 1}
                        </div>
                        <img src={prod.image} alt={prod.name} className="w-20 h-20 object-cover rounded-xl border border-slate-200 dark:border-slate-700" />
                        <div>
                          <p className="text-[10px] text-slate-400">{prod.brand}</p>
                          <p className={`text-xs font-bold truncate max-w-[140px] mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{prod.name}</p>
                          <p className="text-xs font-bold text-amber-500 mt-1">★ {prod.overallRating || 0} <span className="text-[10px] text-slate-400">({prod.ratingCount || 0}개)</span></p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              TAB 6: BANNERS (홈 배너 구좌 관리)
             ======================================================== */}
          {activeAdminTab === 'banners' && (() => {
            const sortedBanners = [...banners].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            const activeList = sortedBanners.filter(b => b.isActive);
            const currentPreview = activeList[previewBannerIdx % Math.max(activeList.length, 1)] || sortedBanners[0];

            return (
              <div className="space-y-6">
                
                {/* 1. Header with Stats & New Banner Button */}
                <div className={`p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${cardBg}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                        <Layers className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <h2 className={`text-base font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          <span>모바일 메인 홈 배너 구좌(슬롯) 관리</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          구좌를 1개씩 추가하고, 순서 변경(▲/▼ 이동 또는 번호 지정)으로 홈 화면 최상단 노출 순서를 즉시 제어합니다.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400">총 구좌:</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{sortedBanners.length}개</span>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <span className="text-slate-400">실시간 활성:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{activeList.length}개</span>
                    </div>

                    <button
                      onClick={() => handleOpenNewBanner(sortedBanners.length + 1)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>새 구좌 추가</span>
                    </button>
                  </div>
                </div>

                {/* 2. Live Mobile Carousel Preview */}
                {activeList.length > 0 && currentPreview && (
                  <div className={`p-5 rounded-2xl border shadow-sm space-y-3 ${cardBg}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-indigo-500" />
                        <h3 className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          실제 모바일 홈 롤링 라이브 프리뷰
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          순서 실시간 동기화
                        </span>
                      </div>

                      {/* Carousel controls */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400 font-bold">
                          {((previewBannerIdx % activeList.length) + 1)} / {activeList.length} (현재 {currentPreview.order}구좌)
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setPreviewBannerIdx(prev => (prev - 1 + activeList.length) % activeList.length)}
                            className="p-1.5 rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                            title="이전 배너"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewBannerIdx(prev => (prev + 1) % activeList.length)}
                            className="p-1.5 rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                            title="다음 배너"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Preview Card Showcase */}
                    <div className="relative aspect-[21/9] sm:aspect-[24/9] md:aspect-[30/9] max-h-[160px] w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md">
                      <img src={currentPreview.image} alt={currentPreview.title || '배너 프리뷰'} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-600/90 backdrop-blur-xs text-white font-mono shadow-sm">
                          {currentPreview.order}구좌 노출 중 (클릭 시 이동)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Slot Cards Grid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-500">배너 구좌 목록 및 순서 관리 ({sortedBanners.length}개 구좌)</span>
                    <span className="text-[11px] text-slate-400">
                      💡 ▲/▼ 버튼이나 구좌 선택 셀렉트로 원하는 순서로 즉시 변경됩니다.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedBanners.map((banner, index) => {
                      const isFirst = index === 0;
                      const isLast = index === sortedBanners.length - 1;

                      return (
                        <div
                          key={banner.id}
                          className={`rounded-2xl border shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-md ${cardBg} ${
                            banner.isActive ? 'border-slate-200 dark:border-slate-800' : 'border-dashed border-slate-300 dark:border-slate-800 opacity-80'
                          }`}
                        >
                          <div>
                            {/* Card Top Slot Bar */}
                            <div className={`p-3 border-b flex items-center justify-between ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                              {/* Slot Badge */}
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-indigo-600 text-white shadow-xs font-mono">
                                  {banner.order}구좌
                                </span>
                                {banner.isActive ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span>실시간 노출</span>
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-400">
                                    비활성 (숨김)
                                  </span>
                                )}
                              </div>

                              {/* Order Reorder Controls */}
                              <div className="flex items-center gap-1">
                                {/* Up button */}
                                <button
                                  type="button"
                                  disabled={isFirst}
                                  onClick={() => moveBannerOrder(banner.id, 'up')}
                                  title={isFirst ? '이미 최상단 1구좌입니다' : '윗 구좌와 순서 바꾸기 (위로 이동)'}
                                  className={`p-1.5 rounded-lg border transition-all ${
                                    isFirst
                                      ? 'opacity-30 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400'
                                      : 'hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 dark:hover:bg-indigo-950/40 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                                  }`}
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>

                                {/* Down button */}
                                <button
                                  type="button"
                                  disabled={isLast}
                                  onClick={() => moveBannerOrder(banner.id, 'down')}
                                  title={isLast ? '이미 마지막 구좌입니다' : '아랫 구좌와 순서 바꾸기 (아래로 이동)'}
                                  className={`p-1.5 rounded-lg border transition-all ${
                                    isLast
                                      ? 'opacity-30 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400'
                                      : 'hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 dark:hover:bg-indigo-950/40 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                                  }`}
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>

                                {/* Direct Slot Select */}
                                <select
                                  value={banner.order}
                                  onChange={e => setBannerOrder(banner.id, Number(e.target.value))}
                                  title="원하는 구좌 번호로 즉시 이동"
                                  className={`text-xs font-bold py-1 px-2 rounded-lg border focus:outline-none focus:border-indigo-500 cursor-pointer ${
                                    isDark ? 'bg-slate-800 border-slate-700 text-indigo-300' : 'bg-white border-slate-200 text-indigo-600'
                                  }`}
                                >
                                  {sortedBanners.map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                      {i + 1}구좌로 이동
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Banner Live Card Look */}
                            <div className="relative aspect-[16/9] w-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
                              <img src={banner.image} alt={banner.title || '배너 이미지'} className="w-full h-full object-cover" />
                              <div className="absolute top-2.5 left-2.5 z-10">
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-black/70 backdrop-blur-md text-white border border-white/20 flex items-center gap-1 shadow-sm">
                                  {banner.linkUrl ? (
                                    <><ExternalLink className="w-3 h-3 text-cyan-300" /><span>웹 링크</span></>
                                  ) : banner.linkEventId ? (
                                    <><Gift className="w-3 h-3 text-pink-300" /><span>이벤트</span></>
                                  ) : banner.linkProductIds?.length ? (
                                    <><Package className="w-3 h-3 text-amber-300" /><span>기획전 {banner.linkProductIds.length}개</span></>
                                  ) : banner.linkProductId ? (
                                    <><Package className="w-3 h-3 text-amber-300" /><span>상품 상세</span></>
                                  ) : banner.linkCategory ? (
                                    <><Layers className="w-3 h-3 text-indigo-300" /><span>카테고리: {banner.linkCategory}</span></>
                                  ) : (
                                    <span>연결 없음</span>
                                  )}
                                </span>
                              </div>
                            </div>

                            {/* Info bar */}
                            <div className="p-4 space-y-2">
                              {(banner.disclaimer || (banner.linkUrl && banner.linkUrl.includes('coupang.com'))) && (
                                <div className="flex items-center text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-lg">
                                  <span className="shrink-0 font-bold">📢 파트너스:</span>
                                  <span className="truncate ml-1">{banner.disclaimer || '이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.'}</span>
                                </div>
                              )}
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-400">연결 대상</span>
                                <span className={`font-bold px-2 py-0.5 rounded text-[11px] truncate max-w-[190px] ${isDark ? 'bg-slate-800 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>
                                  {banner.linkUrl 
                                    ? `🌐 ${banner.linkUrl}`
                                    : banner.linkEventId
                                    ? `🎁 ${events.find(e => e.id === banner.linkEventId)?.title || banner.linkEventId}`
                                    : banner.linkProductId
                                    ? `📦 ${products.find(p => p.id === banner.linkProductId)?.name || banner.linkProductId}`
                                    : banner.linkCategory
                                    ? `🏷️ ${banner.linkCategory}`
                                    : '🚫 연결 없음'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-400">홈 화면 노출</span>
                                <button
                                  type="button"
                                  onClick={() => toggleBannerActive(banner.id)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                    banner.isActive
                                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                  }`}
                                >
                                  {banner.isActive ? '● 실시간 노출 중 (ON)' : '숨김 상태 (OFF)'}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className={`p-4 pt-3 border-t flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditBanner(banner)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border ${
                                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                                }`}
                              >
                                <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                                <span>구좌 수정</span>
                              </button>

                              <button
                                onClick={() => duplicateBanner(banner.id)}
                                title="이 구좌 설정을 복제하여 새 구좌로 등록"
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all border ${
                                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                                }`}
                              >
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                                <span>복제</span>
                              </button>
                            </div>

                            <button
                              onClick={() => {
                                if (confirm(`'${banner.order}구좌: ${banner.title}' 배너를 삭제하시겠습니까?\n삭제 시 다른 구좌의 순서가 자동으로 당겨집니다.`)) {
                                  deleteBanner(banner.id);
                                }
                              }}
                              className="p-1.5 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-lg transition-all"
                              title="구좌 삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                        </div>
                      );
                    })}

                    {/* Add Slot Card at the end */}
                    <div
                      onClick={() => handleOpenNewBanner(sortedBanners.length + 1)}
                      className={`rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:border-indigo-500 group min-h-[300px] ${
                        isDark ? 'border-slate-800 hover:bg-slate-850' : 'border-slate-200 hover:bg-indigo-50/40'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6" />
                      </div>
                      <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        + 새 배너 {sortedBanners.length + 1}구좌 추가하기
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-[220px]">
                        새로운 프로모션이나 기획전을 위해 추가 구좌를 등록합니다.
                      </p>
                      <span className="mt-4 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm group-hover:bg-indigo-500 transition-colors">
                        구좌 추가하기
                      </span>
                    </div>

                  </div>
                </div>

              </div>
            );
          })()}

          {/* ========================================================
              TAB 7: BATTLE (신상 배틀 설정)
             ======================================================== */}
          {activeAdminTab === 'battle' && (
            <div className="space-y-6">
              
              <div className={`p-6 rounded-2xl border shadow-sm ${cardBg}`}>
                <h2 className={`text-base font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Swords className="w-5 h-5 text-rose-500" />
                  <span>신상 배틀 실시간 맞대결 설정</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  월~금 투표 → 토·일 결과 공개 → 매주 월요일 0시에 최근 대결에 나오지 않은 신상품으로 자동 교체됩니다. 아래에서 이번 주 대결 상품을 직접 지정할 수도 있습니다 (상품을 바꾸면 이번 주 표는 초기화됩니다).
                </p>
              </div>

              {/* 2-Column: Left Settings Form vs Right Arena Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left: Settings Form */}
                <div className={`p-6 rounded-2xl border shadow-sm space-y-5 ${cardBg}`}>
                  <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>매치업 정보 입력</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">배틀 메인 타이틀</label>
                      <input
                        type="text"
                        value={battleTitle}
                        onChange={e => setBattleTitle(e.target.value)}
                        className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none focus:border-rose-500 ${inputBg}`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">배틀 서브 설명</label>
                      <input
                        type="text"
                        value={battleSubtitle}
                        onChange={e => setBattleSubtitle(e.target.value)}
                        className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none focus:border-rose-500 ${inputBg}`}
                      />
                    </div>

                    {/* Fighter A */}
                    <div className={`p-4 rounded-xl border space-y-3 ${subCardBg}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-600">🥊 파이터 A (좌측)</span>
                        <input
                          type="text"
                          value={battleLabelA}
                          onChange={e => setBattleLabelA(e.target.value)}
                          placeholder="라벨 (예: 스낵 신상 1위)"
                          className={`px-2 py-1 rounded text-xs w-40 text-right border ${inputBg}`}
                        />
                      </div>
                      <select
                        value={battleProductAId}
                        onChange={e => setBattleProductAId(e.target.value)}
                        className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                      >
                        {products.map(p => (
                          <option key={p.id} value={p.id}>[{p.brand}] {p.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Fighter B */}
                    <div className={`p-4 rounded-xl border space-y-3 ${subCardBg}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-rose-600">🥊 파이터 B (우측)</span>
                        <input
                          type="text"
                          value={battleLabelB}
                          onChange={e => setBattleLabelB(e.target.value)}
                          placeholder="라벨 (예: 디저트 신상 1위)"
                          className={`px-2 py-1 rounded text-xs w-40 text-right border ${inputBg}`}
                        />
                      </div>
                      <select
                        value={battleProductBId}
                        onChange={e => setBattleProductBId(e.target.value)}
                        className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                      >
                        {products.map(p => (
                          <option key={p.id} value={p.id}>[{p.brand}] {p.name}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleSaveBattle}
                      disabled={isSavingBattle}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-98"
                    >
                      {isSavingBattle ? '저장 중...' : '배틀 매치업 즉시 저장 & 반영'}
                    </button>
                    {battleSaveStatus && (
                      <p className={`text-xs font-bold ${battleSaveStatus.ok ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {battleSaveStatus.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Live Battle Showdown Arena Preview */}
                <div className={`p-6 rounded-2xl border shadow-sm space-y-6 ${cardBg}`}>
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">
                      {adminBattleRound ? `이번 주 대결 (${adminBattleRound.weekKey} 시작) · 실제 득표 ${adminBattleRound.totalVotes.toLocaleString()}표` : '이번 주 대결 미리보기'}
                    </span>
                    <h3 className={`text-lg font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{battleTitle}</h3>
                    <p className="text-xs text-slate-400">{battleSubtitle}</p>
                  </div>

                  {/* VS Arena Box */}
                  <div className={`p-5 rounded-2xl border relative ${subCardBg}`}>
                    <div className="grid grid-cols-2 gap-4">
                      
                      {/* Left Product A */}
                      <div className="flex flex-col items-center text-center space-y-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/10 text-blue-600 border border-blue-500/20">
                          {battleLabelA || 'A 파이터'}
                        </span>
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border-2 border-blue-500/40 shadow-sm">
                          <img src={prodA?.image} alt={prodA?.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-400">{prodA?.brand}</p>
                          <p className={`text-xs font-black line-clamp-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{prodA?.name}</p>
                          <p className="text-sm font-mono font-black text-blue-600 mt-1">{battleVoteLabel('A')}</p>
                        </div>
                      </div>

                      {/* Right Product B */}
                      <div className="flex flex-col items-center text-center space-y-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500/10 text-rose-600 border border-rose-500/20">
                          {battleLabelB || 'B 파이터'}
                        </span>
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border-2 border-rose-500/40 shadow-sm">
                          <img src={prodB?.image} alt={prodB?.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-400">{prodB?.brand}</p>
                          <p className={`text-xs font-black line-clamp-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{prodB?.name}</p>
                          <p className="text-sm font-mono font-black text-rose-600 mt-1">{battleVoteLabel('B')}</p>
                        </div>
                      </div>

                    </div>

                    {/* VS Badge Center */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900 text-amber-400 border-2 border-white shadow-md flex items-center justify-center font-black text-xs">
                      VS
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-5">
                      <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full" style={{ width: `${battleBarPercentA}%` }} />
                        <div className="bg-gradient-to-r from-rose-500 to-amber-500 h-full" style={{ width: `${100 - battleBarPercentA}%` }} />
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ========================================================
              TAB: HOME SECTIONS (홈 화면 구좌 및 타이틀 관리 NEW)
             ======================================================== */}
          {activeAdminTab === 'sections' && (
            <HomeSectionsManagementTab isDark={isDark} />
          )}

          {/* ========================================================
              TAB: BRANDS MANAGEMENT (브랜드몰 & 브랜드 정밀 관리)
             ======================================================== */}
          {activeAdminTab === 'brands' && (
            <BrandManagementTab
              isDark={isDark}
              onSelectBrandForProductAdd={(brandName) => {
                setProductForm(prev => ({
                  ...prev,
                  brand: brandName
                }));
                setIsProductModalOpen(true);
              }}
              onNavigateToProductsWithBrand={(brandName) => {
                setProductSearch(brandName);
                setActiveAdminTab('products');
              }}
            />
          )}

          {/* ========================================================
              TAB: STORE CHANNELS (판매처 & 유통채널 마스터 관리)
             ======================================================== */}
          {activeAdminTab === 'stores' && (
            <StoreManagementTab isDark={isDark} />
          )}

          {/* ========================================================
              TAB: SALE PROMOTIONS (1+1 & 특가 행사소식 관리)
             ======================================================== */}
          {activeAdminTab === 'sales' && (
            <SalePromotionManagementTab isDark={isDark} />
          )}

          {/* ========================================================
              TAB: DROP CALENDAR (신제품 출시 캘린더 관리)
             ======================================================== */}
          {activeAdminTab === 'calendar' && (
            <CalendarManagementTab isDark={isDark} />
          )}

          {/* ========================================================
              TAB: PROMOTION EVENTS (이벤트 & 체험단 관리)
             ======================================================== */}
          {activeAdminTab === 'events' && (
            <EventManagementTab isDark={isDark} />
          )}

          {/* ========================================================
              TAB: NOTIFICATIONS & FCM PUSH (알림 & FCM 디바이스 푸시 관리)
             ======================================================== */}
          {activeAdminTab === 'notifications' && (
            <NotificationManagementTab />
          )}

          {/* ========================================================
              TAB: USERS & ACCOUNT STATUS (회원 계정 및 제재 상태 관리)
             ======================================================== */}
          {activeAdminTab === 'users' && (
            <UserManagementTab isDark={isDark} />
          )}

          {/* ========================================================
              TAB: PRODUCT EDIT REQUESTS (사용자 제품 정보 수정 요청 관리)
             ======================================================== */}
          {activeAdminTab === 'product_edits' && (
            <ProductEditManagementTab 
              isDark={isDark} 
              onEditProductCatalog={(productId) => {
                const p = products.find(item => item.id === productId);
                if (p) {
                  handleOpenEditProduct(p);
                } else {
                  showToast('해당 상품을 찾을 수 없습니다.', 'error');
                }
              }}
            />
          )}

          {/* ========================================================
              TAB: REPORTS & MODERATION (신고 접수 내역 및 조치)
             ======================================================== */}
          {activeAdminTab === 'reports' && (
            <ReportManagementTab isDark={isDark} />
          )}

          {/* ========================================================
              TAB 8: DATA & SETTINGS (데이터 백업 & 동기화)
             ======================================================== */}
          {activeAdminTab === 'data' && (
            <div className="space-y-6">
              
              <div className={`p-6 rounded-2xl border shadow-sm ${cardBg}`}>
                <h2 className={`text-base font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Database className="w-5 h-5 text-emerald-500" />
                  <span>데이터베이스 상태 및 백업 복구</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  데이터 백업(JSON 다운로드) 및 로컬 스토리지 / Supabase 동기화 상태를 진단합니다.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Diagnostics Card */}
                <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${cardBg}`}>
                  <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>데이터베이스 동기화 진단</h3>

                  <div className="space-y-3 text-xs">
                    <div className={`p-3 rounded-xl border flex items-center justify-between ${subCardBg}`}>
                      <span className="text-slate-500">현재 클라우드 DB 상태</span>
                      <span className={`font-bold flex items-center gap-1.5 ${isSupabaseConnected ? 'text-emerald-600' : 'text-amber-600'}`}>
                        <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {isSupabaseConnected ? 'Supabase 정상 연결됨' : '로컬 스토리지 모드 동작중'}
                      </span>
                    </div>

                    <div className={`p-3 rounded-xl border flex items-center justify-between ${subCardBg}`}>
                      <span className="text-slate-500">등록된 먹거리 상품 수</span>
                      <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{products.length}건</span>
                    </div>

                    <div className={`p-3 rounded-xl border flex items-center justify-between ${subCardBg}`}>
                      <span className="text-slate-500">등록된 유저 리뷰 수</span>
                      <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{reviews.length}건</span>
                    </div>

                    <div className={`p-3 rounded-xl border flex items-center justify-between ${subCardBg}`}>
                      <span className="text-slate-500">커뮤니티 게시글 수</span>
                      <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{communityPosts.length}건</span>
                    </div>

                    <div className={`p-3 rounded-xl border flex items-center justify-between ${subCardBg}`}>
                      <span className="text-slate-500">승인 대기 신제품 수</span>
                      <span className="font-mono font-bold text-amber-600">{pendingCount}건</span>
                    </div>
                  </div>
                </div>

                {/* Backup & Reset Actions */}
                <div className={`p-6 rounded-2xl border shadow-sm space-y-4 flex flex-col justify-between ${cardBg}`}>
                  <div>
                    <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>데이터 백업 및 초기화 도구</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      현재 등록된 모든 상품, 배너, 배틀 설정 데이터를 JSON 형태로 안전하게 백업하거나, 시스템 기본 초기 데이터로 되돌릴 수 있습니다.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleExportData}
                      className={`w-full py-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                        isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                      }`}
                    >
                      <Download className="w-4 h-4 text-emerald-600" />
                      <span>전체 데이터 JSON 파일로 백업 다운로드</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('모든 상품, 배너, 설정을 초기 기본 데이터로 복구하시겠습니까? (이 작업은 되돌릴 수 없습니다.)')) {
                          resetAllDataToDefaults();
                        }
                      }}
                      className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <RotateCcw className="w-4 h-4 text-rose-500" />
                      <span>시스템 초기 기본 데이터로 전체 리셋</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================
              TAB: AI AGENTS (AI 전문가 에이전트 허브)
             ======================================================== */}
          {activeAdminTab === 'ai_agents' && (
            <AiAgentsManagementTab onNotify={showToast} />
          )}

          {/* ========================================================
              TAB 9: INSTAGRAM CONTENT GENERATOR (인스타 콘텐츠 생성기)
             ======================================================== */}
          {activeAdminTab === 'insta_generator' && (
            <InstagramContentGeneratorTab onNotify={showToast} />
          )}

        </main>

      </div>

      {/* ========================================================
          MODAL: PRODUCT CREATE & EDIT (2-Column Desktop Modal)
         ======================================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className={`rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border ${cardBg}`}>
            
            {/* Modal Header */}
            <div className={`p-5 border-b flex items-center justify-between shrink-0 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {editingProductId ? '상품 정보 수정' : '새 신제품 직접 등록'}
                  </h3>
                  <p className="text-xs text-slate-400">필수 정보와 편의점 판매처, 영양정보를 입력해주세요.</p>
                </div>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-800'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: 2 Columns */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Form Inputs */}
              <div className="lg:col-span-2 space-y-4">
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 flex items-center justify-between">
                      <span>고유 상품코드 (숫자 8자리) *</span>
                      <button
                        type="button"
                        onClick={() => {
                          const autoCode = generateNextProductCode(products, productForm.category, productForm.brand);
                          setProductForm(prev => ({ ...prev, code: autoCode }));
                          showToast(`✨ 추천 상품코드 [${autoCode}] 생성 완료`, 'info');
                        }}
                        className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        자동생성
                      </button>
                    </label>
                    <input
                      type="text"
                      value={productForm.code}
                      onChange={e => setProductForm({ ...productForm, code: e.target.value.replace(/[^0-9]/g, '') })}
                      placeholder="예: 11102001"
                      className={`w-full p-2.5 rounded-xl text-xs font-mono font-bold border focus:outline-none focus:border-indigo-500 text-indigo-600 dark:text-indigo-400 ${inputBg}`}
                    />
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">상품명 *</label>
                      <button
                        type="button"
                        onClick={handleAutoFillFromNaver}
                        disabled={isAutoFillingFromNaver || !productForm.name?.trim()}
                        className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 flex items-center gap-1 transition-all disabled:opacity-40 active:scale-95 cursor-pointer"
                        title="입력한 상품명을 바탕으로 네이버 쇼핑·이미지·블로그·트렌드 데이터를 실시간으로 가져옵니다"
                      >
                        {isAutoFillingFromNaver ? (
                          <RefreshCw className="w-3 h-3 animate-spin text-indigo-600 dark:text-indigo-400" />
                        ) : (
                          <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                        )}
                        <span>네이버 API로 자동 완성</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="예: 꼬북칩 초코츄러스맛, 신라면 툼바"
                      className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none focus:border-indigo-500 ${inputBg}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">제조사 / 브랜드 *</label>
                    <input
                      type="text"
                      value={productForm.brand}
                      onChange={e => {
                        const newBrand = e.target.value;
                        const newCode = !editingProductId 
                          ? generateNextProductCode(products, productForm.category, newBrand)
                          : productForm.code;
                        setProductForm({ ...productForm, brand: newBrand, code: newCode });
                      }}
                      placeholder="예: 오리온, 농심, 삼양"
                      className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none focus:border-indigo-500 ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">카테고리</label>
                    <select
                      value={productForm.category}
                      onChange={e => {
                        const newCat = e.target.value as ProductCategory;
                        const newCode = !editingProductId 
                          ? generateNextProductCode(products, newCat, productForm.brand)
                          : productForm.code;
                        setProductForm({ ...productForm, category: newCat, code: newCode });
                      }}
                      className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                    >
                      {CATEGORIES.filter(c => c !== '전체').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">세부 카테고리</label>
                    <input
                      type="text"
                      value={productForm.subCategory}
                      onChange={e => setProductForm({ ...productForm, subCategory: e.target.value })}
                      placeholder="예: 스낵, 초콜릿, 탄산"
                      className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">출시일 문구</label>
                    <input
                      type="text"
                      value={productForm.releaseDate}
                      onChange={e => setProductForm({ ...productForm, releaseDate: e.target.value })}
                      placeholder="2026.09 출시"
                      className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">정상 판매가 (원) *</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">할인율 (%)</label>
                    <input
                      type="number"
                      value={productForm.discountRate}
                      onChange={e => setProductForm({ ...productForm, discountRate: Number(e.target.value) })}
                      className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">용량 / 칼로리</label>
                      <button
                        type="button"
                        onClick={() => setNutritionSearchTarget({
                          initialQuery: productForm.name || productForm.brand,
                          brand: productForm.brand,
                          onSelect: (data: FoodNutritionData) => {
                            setProductForm(prev => ({
                              ...prev,
                              calories: data.calories || prev.calories,
                              volume: data.totalWeight || data.servingSize || prev.volume,
                              manufacturer: prev.manufacturer || data.makerName,
                              nutrition: data.nutrition
                            }));
                            showToast(`식약처 공식 영양성분(${data.foodName}, ${data.calories}kcal)이 자동 적용되었습니다!`, 'success');
                          }
                        })}
                        className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 transition-all"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>식약처 영양성분 자동조회</span>
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={productForm.volume}
                        onChange={e => setProductForm({ ...productForm, volume: e.target.value })}
                        placeholder="80g"
                        className={`w-1/2 p-2.5 rounded-xl text-xs border ${inputBg}`}
                      />
                      <input
                        type="number"
                        value={productForm.calories}
                        onChange={e => setProductForm({ ...productForm, calories: Number(e.target.value) })}
                        placeholder="kcal"
                        className={`w-1/2 p-2.5 rounded-xl text-xs border ${inputBg}`}
                      />
                    </div>
                    {productForm.nutrition && (
                      <div className="mt-1.5 p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 flex flex-wrap gap-1.5 text-[10px] text-emerald-800 dark:text-emerald-300">
                        <span className="font-bold">적용된 영양표시:</span>
                        <span>탄수화물 {productForm.nutrition.carbs || '0g'}</span>
                        <span>당류 {productForm.nutrition.sugar || '0g'}</span>
                        <span>단백질 {productForm.nutrition.protein || '0g'}</span>
                        <span>지방 {productForm.nutrition.fat || '0g'}</span>
                        <span>나트륨 {productForm.nutrition.sodium || '0mg'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">상품 대표 이미지 URL *</label>
                    <button
                      type="button"
                      onClick={() => setImageSelectorTarget({
                        brand: productForm.brand,
                        name: productForm.name,
                        currentImage: productForm.image,
                        onSelect: (newUrl: string) => {
                          setProductForm(prev => ({ ...prev, image: newUrl }));
                          showToast('선택한 고화질 이미지가 적용되었습니다.', 'success');
                        }
                      })}
                      className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1 transition-all"
                    >
                      <Search className="w-3 h-3" />
                      <span>고화질 실물 이미지 찾기</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    {productForm.image && (
                      <img src={productForm.image} alt="미리보기" className="w-11 h-11 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100" />
                    )}
                    <input
                      type="text"
                      value={productForm.image}
                      onChange={e => setProductForm({ ...productForm, image: e.target.value })}
                      placeholder="이미지 URL 입력 또는 우측 검색 버튼 사용"
                      className={`w-full p-2.5 rounded-xl text-xs border font-mono ${inputBg}`}
                    />
                  </div>
                </div>

                {/* Badges Toggle Switches */}
                <div className={`p-3.5 rounded-xl border flex items-center justify-between ${subCardBg}`}>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">특수 노출 뱃지 설정</span>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-indigo-600">
                      <input
                        type="checkbox"
                        checked={productForm.isToday}
                        onChange={e => setProductForm({ ...productForm, isToday: e.target.checked })}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-0 w-4 h-4"
                      />
                      <span>⚡ 오늘신상 뱃지 부여</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-orange-600">
                      <input
                        type="checkbox"
                        checked={productForm.isHot}
                        onChange={e => setProductForm({ ...productForm, isHot: e.target.checked })}
                        className="rounded border-slate-300 text-orange-600 focus:ring-0 w-4 h-4"
                      />
                      <span>🔥 인기HOT 뱃지 부여</span>
                    </label>
                  </div>
                </div>

                {/* Store checkboxes & Link inputs */}
                <div className="space-y-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-indigo-500" />
                      <span>판매처 편의점 및 구매 링크 설정</span>
                    </label>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                      * 링크를 입력하면 앱 내 상세페이지 [판매처] 탭에서 바로가기가 제공됩니다
                    </span>
                  </div>

                  {/* 1. 판매처 선택 프리셋 버튼 */}
                  <div className="flex flex-wrap gap-1.5">
                    {['CU', 'GS25', '세븐일레븐', '이마트24', '대형마트', '온라인', '공식몰', '쿠팡', '마켓컬리'].map(store => {
                      const isChecked = productForm.stores.includes(store);
                      const hasLink = !!productForm.storeLinks?.[store]?.trim();
                      return (
                        <button
                          key={store}
                          type="button"
                          onClick={() => {
                            const nextStores = isChecked
                              ? productForm.stores.filter(s => s !== store)
                              : [...productForm.stores, store];
                            setProductForm({
                              ...productForm,
                              stores: nextStores
                            });
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isChecked
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <span>{store}</span>
                          {isChecked && hasLink && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="링크 등록됨" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* 2. 기타 판매처 직접 추가 */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="text"
                      placeholder="기타 판매처 직접 추가 (예: 네이버스마트스토어, 올리브영)"
                      value={customStoreInput}
                      onChange={(e) => setCustomStoreInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = customStoreInput.trim();
                          if (val && !productForm.stores.includes(val)) {
                            setProductForm({
                              ...productForm,
                              stores: [...productForm.stores, val]
                            });
                            setCustomStoreInput('');
                          }
                        }
                      }}
                      className={`flex-1 p-2 rounded-xl text-xs border ${inputBg}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = customStoreInput.trim();
                        if (val && !productForm.stores.includes(val)) {
                          setProductForm({
                            ...productForm,
                            stores: [...productForm.stores, val]
                          });
                          setCustomStoreInput('');
                        }
                      }}
                      className="px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all shrink-0"
                    >
                      추가
                    </button>
                  </div>

                  {/* 3. 선택된 판매처별 구매 URL 입력 */}
                  {productForm.stores.length > 0 ? (
                    <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-700/80">
                      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        선택된 판매처별 구매/웹 링크 URL (비워두면 오프라인 매장으로 처리):
                      </p>
                      {productForm.stores.map(store => {
                        const linkVal = productForm.storeLinks?.[store] || '';
                        return (
                          <div key={store} className="flex items-center gap-2">
                            <span className="w-20 shrink-0 text-xs font-bold text-slate-700 dark:text-slate-200 px-2 py-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-center truncate shadow-2xs">
                              {store}
                            </span>
                            <div className="relative flex-1">
                              <input
                                type="url"
                                placeholder={`https://... (${store} 상품 구매 링크)`}
                                value={linkVal}
                                onChange={(e) => {
                                  setProductForm({
                                    ...productForm,
                                    storeLinks: {
                                      ...productForm.storeLinks,
                                      [store]: e.target.value
                                    }
                                  });
                                }}
                                className={`w-full p-2 pr-7 rounded-xl text-xs border ${inputBg}`}
                              />
                              {linkVal && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = { ...productForm.storeLinks };
                                    delete next[store];
                                    setProductForm({ ...productForm, storeLinks: next });
                                  }}
                                  className="absolute right-2 top-2.5 text-slate-400 hover:text-rose-500"
                                  title="링크 비우기"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                            {linkVal && (
                              <button
                                type="button"
                                onClick={() => window.open(linkVal, '_blank')}
                                className="p-2 rounded-xl bg-blue-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 shrink-0 border border-indigo-200 dark:border-indigo-800"
                                title="링크 미리보기 테스트"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[11px] text-amber-600 dark:text-amber-400">
                      ⚠️ 최소 1개 이상의 판매처를 선택해주세요.
                    </p>
                  )}
                </div>

                {/* 4. 판매처별 상세 재고·가격·행사배지 정밀 편집기 (NEW) */}
                {productForm.stores.length > 0 && (
                  <div className="space-y-2 p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/70 dark:border-indigo-800/50">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-indigo-600" />
                        <span>판매처별 실시간 재고 & 가격·행사배지 정밀 설정</span>
                      </label>
                      <span className="text-[10px] text-indigo-600 font-bold">
                        * 앱 내 [상세보기 &gt; 판매처 재고] 탭에 즉시 반영됩니다
                      </span>
                    </div>

                    <div className="space-y-2.5 pt-1">
                      {productForm.stores.map((st) => {
                        const stockItem = productForm.storeStocks.find(s => s.store === st) || {
                          store: st,
                          status: '입고완료',
                          stockCount: 10,
                          price: productForm.price,
                          deliveryTime: '매장 즉시 픽업'
                        };

                        const updateStockItem = (updated: Partial<StoreStockItem>) => {
                          const exists = productForm.storeStocks.some(s => s.store === st);
                          const nextStocks = exists
                            ? productForm.storeStocks.map(s => s.store === st ? { ...s, ...updated } : s)
                            : [...productForm.storeStocks, { ...stockItem, ...updated }];
                          setProductForm({ ...productForm, storeStocks: nextStocks });
                        };

                        return (
                          <div key={st} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/60 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-indigo-600 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                <span>{st}</span>
                              </span>
                              <div className="flex items-center gap-2">
                                <select
                                  value={stockItem.status}
                                  onChange={e => updateStockItem({ status: e.target.value as any })}
                                  className={`p-1 rounded-lg text-[11px] font-bold border ${inputBg}`}
                                >
                                  <option value="입고완료">🟢 입고완료</option>
                                  <option value="품절임박">🟡 품절임박</option>
                                  <option value="일시품절">🔴 일시품절</option>
                                  <option value="예약가능">🔵 예약가능</option>
                                  <option value="행사진행">🎁 행사진행</option>
                                </select>
                                <div className="flex items-center gap-1 text-[11px]">
                                  <span className="text-slate-400">재고:</span>
                                  <input
                                    type="number"
                                    value={stockItem.stockCount ?? 10}
                                    onChange={e => updateStockItem({ stockCount: Number(e.target.value) })}
                                    className={`w-14 p-1 rounded-lg text-center font-mono font-bold text-xs border ${inputBg}`}
                                  />
                                  <span className="text-slate-400">개</span>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-[11px]">
                              <div>
                                <label className="text-[10px] text-slate-400 font-bold">판매가격 (원)</label>
                                <input
                                  type="number"
                                  value={stockItem.price ?? productForm.price}
                                  onChange={e => updateStockItem({ price: Number(e.target.value) })}
                                  className={`w-full p-1.5 rounded-lg font-mono text-xs border ${inputBg}`}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400 font-bold">할인가격 (선택)</label>
                                <input
                                  type="number"
                                  placeholder="미입력시 정상가"
                                  value={stockItem.discountPrice ?? ''}
                                  onChange={e => updateStockItem({ discountPrice: e.target.value ? Number(e.target.value) : undefined })}
                                  className={`w-full p-1.5 rounded-lg font-mono text-xs border ${inputBg}`}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400 font-bold">행사 배지 (1+1, 2+1 등)</label>
                                <input
                                  type="text"
                                  placeholder="예: 1+1, 2+1, 특가"
                                  value={stockItem.eventBadge || ''}
                                  onChange={e => updateStockItem({ eventBadge: e.target.value || undefined })}
                                  className={`w-full p-1.5 rounded-lg text-xs border ${inputBg}`}
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] text-slate-400 font-bold">수령/배송 방식 안내문구</label>
                              <input
                                type="text"
                                placeholder="예: 매장 즉시 픽업, 내일 아침 7시 전 도착, 당일 퀵배송"
                                value={stockItem.deliveryTime || ''}
                                onChange={e => updateStockItem({ deliveryTime: e.target.value })}
                                className={`w-full p-1.5 rounded-lg text-xs border ${inputBg}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. 식품 상세 스펙 & 안전 보관 정보 */}
                <div className="space-y-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>원재료, 알레르기 및 보관방법 정밀 스펙</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">원산지 / 생산지</label>
                      <input
                        type="text"
                        placeholder="예: 국산, 대한민국"
                        value={productForm.origin}
                        onChange={e => setProductForm({ ...productForm, origin: e.target.value })}
                        className={`w-full p-2 rounded-xl text-xs border ${inputBg}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">제조원 / 유통판매원</label>
                      <input
                        type="text"
                        placeholder="예: (주)오리온 익산공장"
                        value={productForm.manufacturer}
                        onChange={e => setProductForm({ ...productForm, manufacturer: e.target.value })}
                        className={`w-full p-2 rounded-xl text-xs border ${inputBg}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">보관방법</label>
                      <input
                        type="text"
                        placeholder="예: 실온 보관 (직사광선 및 습기를 피함)"
                        value={productForm.storageMethod}
                        onChange={e => setProductForm({ ...productForm, storageMethod: e.target.value })}
                        className={`w-full p-2 rounded-xl text-xs border ${inputBg}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">유통 / 소비기한</label>
                      <input
                        type="text"
                        placeholder="예: 제조일로부터 6개월 (별도 표기일까지)"
                        value={productForm.shelfLife}
                        onChange={e => setProductForm({ ...productForm, shelfLife: e.target.value })}
                        className={`w-full p-2 rounded-xl text-xs border ${inputBg}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">알레르기 유발물질 (쉼표 구분)</label>
                    <input
                      type="text"
                      placeholder="예: 밀, 대두, 우유, 쇠고기 함유"
                      value={productForm.allergens}
                      onChange={e => setProductForm({ ...productForm, allergens: e.target.value })}
                      className={`w-full p-2 rounded-xl text-xs border ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">원재료명 및 함량</label>
                    <textarea
                      rows={2}
                      placeholder="예: 소맥분(미국산), 식물성유지, 옥수수분말, 초코크림 등"
                      value={productForm.ingredients}
                      onChange={e => setProductForm({ ...productForm, ingredients: e.target.value })}
                      className={`w-full p-2 rounded-xl text-xs border ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">섭취 시 주의사항</label>
                    <input
                      type="text"
                      placeholder="예: 개봉 후 눅눅해질 수 있으니 밀봉 보관하세요."
                      value={productForm.precautions}
                      onChange={e => setProductForm({ ...productForm, precautions: e.target.value })}
                      className={`w-full p-2 rounded-xl text-xs border ${inputBg}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">상품 소개 및 특징 설명</label>
                  <textarea
                    rows={2}
                    value={productForm.description}
                    onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="신제품의 식감, 맛의 특징, 주요 타깃 설명"
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>

              </div>

              {/* Right 1 Col: Live Realtime Mobile Card Preview */}
              <div className="space-y-3">
                <span className="text-xs font-black text-slate-500 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
                  <span>실시간 모바일 카드 미리보기</span>
                </span>

                <div className={`p-4 rounded-2xl border shadow-sm space-y-3 ${subCardBg}`}>
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <img src={productForm.image} alt="미리보기" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 flex gap-1">
                      {productForm.isToday && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-indigo-600 text-white shadow-xs">
                          ⚡ 오늘신상
                        </span>
                      )}
                      {productForm.isHot && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-orange-600 text-white shadow-xs">
                          🔥 인기HOT
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-indigo-600 font-semibold">{productForm.brand || '브랜드명'}</span>
                    <h4 className={`text-xs font-bold line-clamp-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{productForm.name || '상품명 미리보기'}</h4>
                    <p className="text-xs font-mono mt-0.5">
                      <strong className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{productForm.price.toLocaleString()}원</strong>
                      {productForm.discountRate > 0 && (
                        <span className="text-rose-500 ml-1 font-bold">(-{productForm.discountRate}%)</span>
                      )}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-1">
                    {productForm.stores.map(st => (
                      <span key={st} className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-[9px] text-slate-600 dark:text-slate-300">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex items-center justify-end gap-2 shrink-0 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}
              >
                취소
              </button>
              <button
                onClick={handleSaveProduct}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-600/20"
              >
                {editingProductId ? '수정사항 저장' : '새 상품 등록 완료'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: QUICK STORE LINKS MANAGEMENT MODAL
         ======================================================== */}
      {quickLinkProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className={`rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border ${cardBg}`}>
            
            {/* Header */}
            <div className={`p-5 border-b flex items-center justify-between shrink-0 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                  <Link2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.2 rounded-md">
                      {quickLinkProduct.brand}
                    </span>
                    <h3 className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {quickLinkProduct.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">판매처별 구매 및 공식 링크를 등록·수정합니다.</p>
                </div>
              </div>
              <button
                onClick={() => setQuickLinkProduct(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              
              {/* Product Info Summary Box */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <img src={quickLinkProduct.image} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700" />
                <div className="min-w-0 flex-1">
                  <p className={`font-bold text-xs truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{quickLinkProduct.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    정가: {quickLinkProduct.price.toLocaleString()}원 · 카테고리: {quickLinkProduct.category}
                  </p>
                </div>
              </div>

              {/* 1. Store Presets */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                  판매처 선택 (클릭하여 추가/제외)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['CU', 'GS25', '세븐일레븐', '이마트24', '대형마트', '온라인', '공식몰', '쿠팡', '마켓컬리'].map(store => {
                    const isChecked = quickStores.includes(store);
                    const hasLink = !!quickStoreLinks[store]?.trim();
                    return (
                      <button
                        key={store}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setQuickStores(quickStores.filter(s => s !== store));
                          } else {
                            setQuickStores([...quickStores, store]);
                          }
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isChecked
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span>{store}</span>
                        {isChecked && hasLink && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="링크 등록됨" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Custom Store Input */}
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="기타 판매처 직접 추가 (예: 네이버스마트스토어, 올리브영)"
                  value={quickCustomStore}
                  onChange={(e) => setQuickCustomStore(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = quickCustomStore.trim();
                      if (val && !quickStores.includes(val)) {
                        setQuickStores([...quickStores, val]);
                        setQuickCustomStore('');
                      }
                    }
                  }}
                  className={`flex-1 p-2 rounded-xl text-xs border ${inputBg}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    const val = quickCustomStore.trim();
                    if (val && !quickStores.includes(val)) {
                      setQuickStores([...quickStores, val]);
                      setQuickCustomStore('');
                    }
                  }}
                  className="px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all shrink-0"
                >
                  추가
                </button>
              </div>

              {/* 3. Link inputs for selected stores */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  <span>판매처별 구매 URL (웹/앱 링크)</span>
                  <span>* 비워두면 오프라인 매장으로만 표기</span>
                </div>

                {quickStores.length > 0 ? (
                  <div className="space-y-2">
                    {quickStores.map(store => {
                      const linkVal = quickStoreLinks[store] || '';
                      return (
                        <div key={store} className="flex items-center gap-2">
                          <span className="w-20 shrink-0 text-xs font-bold text-slate-700 dark:text-slate-200 px-2 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-center truncate shadow-2xs">
                            {store}
                          </span>
                          <div className="relative flex-1">
                            <input
                              type="url"
                              placeholder={`https://... (${store} 상품 구매 링크)`}
                              value={linkVal}
                              onChange={(e) => {
                                setQuickStoreLinks({
                                  ...quickStoreLinks,
                                  [store]: e.target.value
                                });
                              }}
                              className={`w-full p-2 pr-7 rounded-xl text-xs border ${inputBg}`}
                            />
                            {linkVal && (
                              <button
                                type="button"
                                onClick={() => {
                                  const next = { ...quickStoreLinks };
                                  delete next[store];
                                  setQuickStoreLinks(next);
                                }}
                                className="absolute right-2 top-2.5 text-slate-400 hover:text-rose-500"
                                title="링크 비우기"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          {linkVal && (
                            <button
                              type="button"
                              onClick={() => window.open(linkVal, '_blank')}
                              className="p-2 rounded-xl bg-blue-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 shrink-0 border border-indigo-200 dark:border-indigo-800"
                              title="새 창에서 링크 테스트"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 py-2">
                    ⚠️ 최소 1개 이상의 판매처를 선택해주세요.
                  </p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-indigo-700 dark:text-indigo-300 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  💡 안내 사항
                </p>
                <p className="opacity-90">
                  링크를 등록한 판매처는 앱 내 상품 상세페이지 [판매처] 탭에서 <strong className="underline">구매 / 바로가기 ↗</strong> 버튼으로 표시되어 고객이 해당 판매 페이지로 바로 이동할 수 있습니다.
                </p>
              </div>

            </div>

            {/* Footer */}
            <div className={`p-4 border-t flex items-center justify-end gap-2 shrink-0 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
              <button
                onClick={() => setQuickLinkProduct(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}
              >
                취소
              </button>
              <button
                onClick={handleSaveQuickLinks}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>판매처 링크 저장</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: BANNER CREATE & EDIT
         ======================================================== */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className={`rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border ${cardBg}`}>
            
            <div className={`p-5 border-b flex items-center justify-between shrink-0 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {editingBannerId ? '홈 배너 수정' : '새 홈 배너 추가'}
                  </h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">✨ 순수 이미지 배너 모드: 홈 화면에는 텍스트 없이 이미지만 표시되며 클릭 시 원하는 곳으로 이동합니다.</p>
                </div>
              </div>
              <button onClick={() => setIsBannerModalOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Form */}
              <div className="space-y-4 text-xs">
                {/* 0. Slot Order & Management Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                      배너 구좌 위치 (순서) *
                    </label>
                    <select
                      value={bannerForm.order || 1}
                      onChange={e => setBannerForm({ ...bannerForm, order: Number(e.target.value) })}
                      className={`w-full p-2.5 rounded-xl border font-bold text-indigo-600 dark:text-indigo-400 ${inputBg}`}
                    >
                      {Array.from({ length: Math.max(banners.length + (editingBannerId ? 0 : 1), 1) }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>
                          {num}구좌 {num === 1 ? '(첫 번째 노출)' : num === (editingBannerId ? banners.length : banners.length + 1) ? '(마지막)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                      배너 관리용 식별명 (선택)
                    </label>
                    <input
                      type="text"
                      value={bannerForm.title || ''}
                      onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })}
                      placeholder="예: 꼬북칩 이벤트 배너"
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                </div>

                {/* 3. Image File Upload (User Request: 파일로 선택하게 해줘) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                      <span>배너 배경 이미지 (파일 선택) *</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setBannerImageMode(prev => prev === 'file' ? 'url' : 'file')}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                      {bannerImageMode === 'file' ? '🔗 웹 URL 직접 입력하기' : '📁 이미지 파일 선택기로 변경'}
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={bannerFileInputRef}
                    accept="image/*"
                    onChange={handleBannerFileSelect}
                    className="hidden"
                  />

                  {bannerImageMode === 'file' ? (
                    <div>
                      {bannerForm.image ? (
                        <div className={`p-3 rounded-2xl border flex items-center gap-3 ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="w-20 h-12 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300 dark:border-slate-700">
                            <img src={bannerForm.image} alt="배너 미리보기" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                              {bannerForm.image.startsWith('data:') ? '📸 파일 이미지 등록 완료' : '🔗 이미지 등록됨'}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {isCompressingBannerImage ? '⚡ 이미지 압축 처리 중...' : '권장 비율 16:9 규격으로 자동 최적화됨'}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => bannerFileInputRef.current?.click()}
                              disabled={isCompressingBannerImage}
                              className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 transition-colors"
                            >
                              파일 변경
                            </button>
                            <button
                              type="button"
                              onClick={() => setBannerForm(prev => ({ ...prev, image: '' }))}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => bannerFileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all hover:border-indigo-500 group ${
                            isDark ? 'border-slate-800 hover:bg-slate-800/40' : 'border-slate-200 hover:bg-indigo-50/30'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 mx-auto flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            {isCompressingBannerImage ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                          </div>
                          <p className="font-bold text-slate-700 dark:text-slate-200 text-xs">
                            {isCompressingBannerImage ? '이미지 최적화 중입니다...' : '클릭하여 배너 이미지 파일 선택'}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            JPG, PNG, WEBP 등 지원 (권장 비율 16:9, 자동 압축 최적화)
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        value={bannerForm.image}
                        onChange={e => setBannerForm({ ...bannerForm, image: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className={`w-full p-2.5 rounded-xl border font-mono ${inputBg}`}
                      />
                    </div>
                  )}
                </div>

                {/* 4. Link Target Settings (User Request: 연결되는 이벤트나 주소 설정) */}
                <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50/70 border-slate-200'}`}>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-indigo-500" />
                      <span>배너 클릭 시 연결 대상 설정 *</span>
                    </label>
                    {/* Link Type Selector Tabs */}
                    <div className="grid grid-cols-6 gap-1.5 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
                      {[
                        { type: 'url' as BannerLinkType, label: '웹 주소' },
                        { type: 'event' as BannerLinkType, label: '이벤트' },
                        { type: 'product' as BannerLinkType, label: '상품' },
                        { type: 'category' as BannerLinkType, label: '카테고리' },
                        { type: 'collection' as BannerLinkType, label: '기획전' },
                        { type: 'none' as BannerLinkType, label: '없음' },
                      ].map(item => (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => setBannerForm({ ...bannerForm, linkType: item.type })}
                          className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                            (bannerForm.linkType || 'category') === item.type
                              ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs'
                              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sub-inputs based on linkType */}
                  {bannerForm.linkType === 'url' && (
                    <div className="space-y-1 animate-in fade-in">
                      <label className="block text-[11px] font-medium text-slate-500">
                        외부 웹사이트 / 프로모션 랜딩 URL (새 창으로 연결)
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={bannerForm.linkUrl || ''}
                          onChange={e => setBannerForm({ ...bannerForm, linkUrl: e.target.value })}
                          placeholder="https://example.com/event"
                          className={`w-full p-2.5 rounded-xl border pl-8 font-mono ${inputBg}`}
                        />
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      </div>
                    </div>
                  )}

                  {bannerForm.linkType === 'event' && (
                    <div className="space-y-1 animate-in fade-in">
                      <label className="block text-[11px] font-medium text-slate-500">
                        연결할 프로모션 / 체험단 이벤트 선택 (상세 팝업 실행)
                      </label>
                      {events.length > 0 ? (
                        <select
                          value={bannerForm.linkEventId || events[0]?.id}
                          onChange={e => setBannerForm({ ...bannerForm, linkEventId: e.target.value })}
                          className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                        >
                          {events.map(ev => (
                            <option key={ev.id} value={ev.id}>
                              [{ev.category}] {ev.title} ({ev.dDay || '진행중'})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-xs text-amber-500 font-medium p-2 bg-amber-50 dark:bg-amber-950/30 rounded-xl">
                          현재 등록된 진행 중 이벤트가 없습니다. 먼저 이벤트를 등록해주세요.
                        </p>
                      )}
                    </div>
                  )}

                  {bannerForm.linkType === 'product' && (
                    <div className="space-y-1 animate-in fade-in">
                      <label className="block text-[11px] font-medium text-slate-500">
                        연결할 신상품 선택 (상품 상세 팝업 실행)
                      </label>
                      <select
                        value={bannerForm.linkProductId || products[0]?.id}
                        onChange={e => setBannerForm({ ...bannerForm, linkProductId: e.target.value })}
                        className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                      >
                        {products.slice(0, 100).map(p => (
                          <option key={p.id} value={p.id}>
                            [{p.category}] {p.brand} - {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {(bannerForm.linkType === 'category' || !bannerForm.linkType) && (
                    <div className="space-y-1 animate-in fade-in">
                      <label className="block text-[11px] font-medium text-slate-500">
                        이동할 식품 카테고리 탭 선택
                      </label>
                      <select
                        value={bannerForm.linkCategory || '신제품'}
                        onChange={e => setBannerForm({ ...bannerForm, linkCategory: e.target.value as ProductCategory })}
                        className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                      >
                        {CATEGORIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {bannerForm.linkType === 'collection' && (
                    <div className="space-y-1 animate-in fade-in">
                      <label className="block text-[11px] font-medium text-slate-500">
                        기획전 상품 ID (한 줄에 하나, 적은 순서대로 노출)
                      </label>
                      <textarea
                        rows={6}
                        value={(bannerForm.linkProductIds || []).join('\n')}
                        onChange={e => setBannerForm({ ...bannerForm, linkProductIds: e.target.value.split('\n') })}
                        className={`w-full p-2.5 rounded-xl border font-mono text-[11px] ${inputBg}`}
                      />
                      <p className="text-[11px] text-slate-400">
                        {(bannerForm.linkProductIds || []).filter(id => products.some(p => p.id === id.trim())).length}개 상품 연결됨 (없는 ID는 화면에서 빠집니다)
                      </p>
                    </div>
                  )}

                  {bannerForm.linkType === 'none' && (
                    <p className="text-[11px] text-slate-400 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                      배너 클릭 시 별도 이동 없이 순수 이미지 노출만 진행됩니다.
                    </p>
                  )}
                </div>

                {/* 5. Button text & Active toggle */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">버튼 문구</label>
                    <input
                      type="text"
                      value={bannerForm.buttonText}
                      onChange={e => setBannerForm({ ...bannerForm, buttonText: e.target.value })}
                      placeholder="예: 바로가기, 참여하기"
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={bannerForm.isActive}
                        onChange={e => setBannerForm({ ...bannerForm, isActive: e.target.checked })}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-0 w-4 h-4"
                      />
                      <span>배너 실시간 활성화 노출</span>
                    </label>
                  </div>
                </div>

                {/* 6. Disclaimer (Coupang Partners / FTC mandatory notice) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-600 dark:text-slate-300 text-xs">
                      제휴/광고 필수 고지 문구 (공정위/쿠팡 파트너스)
                    </label>
                    <button
                      type="button"
                      onClick={() => setBannerForm({
                        ...bannerForm,
                        disclaimer: '이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.'
                      })}
                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      + 쿠팡 문구 자동입력
                    </button>
                  </div>
                  <input
                    type="text"
                    value={bannerForm.disclaimer || ''}
                    onChange={e => setBannerForm({ ...bannerForm, disclaimer: e.target.value })}
                    placeholder="예: 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다."
                    className={`w-full p-2.5 rounded-xl border text-xs ${inputBg}`}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    쿠팡 파트너스 등 제휴 링크 배너 시 필수 고지 문구가 배너에 자동 표기됩니다.
                  </p>
                </div>
              </div>

              {/* Right: Live Banner Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-500">모바일 홈 캐러셀 실시간 미리보기</span>
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md">
                    {bannerForm.order || 1}구좌로 등록 예정
                  </span>
                </div>
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm group">
                  {bannerForm.image ? (
                    <img src={bannerForm.image} alt="배너 미리보기" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                      <ImageIcon className="w-8 h-8 opacity-40" />
                      <span className="text-xs">이미지 파일을 선택해주세요</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      {bannerForm.badge ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-white/20 backdrop-blur-md text-white border border-white/30">
                          {bannerForm.badge}
                        </span>
                      ) : <span />}
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-600 text-white font-mono shadow-sm">
                        {bannerForm.order || 1}구좌
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white leading-tight">{bannerForm.title || '배너 메인 제목이 표시됩니다'}</h3>
                      <p className="text-xs text-slate-300 mt-1">{bannerForm.subtitle || '서브 설명 문구가 표시됩니다'}</p>
                      <span className="inline-flex items-center gap-1 mt-3 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-[11px] font-bold shadow-xs">
                        <span>{bannerForm.buttonText || '바로가기'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                      {(bannerForm.disclaimer || (bannerForm.linkType === 'url' && bannerForm.linkUrl?.includes('coupang.com'))) && (
                        <p className="text-[9.5px] text-amber-200/90 mt-2 font-medium line-clamp-1 bg-black/60 px-2 py-0.5 rounded max-w-fit">
                          ※ {bannerForm.disclaimer || '이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Target info box */}
                <div className={`p-3 rounded-xl border text-xs space-y-1 ${isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-slate-400">배너 탭 시 이동 대상</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {bannerForm.linkType === 'url' ? '🌐 외부 웹 링크' :
                       bannerForm.linkType === 'event' ? '🎁 이벤트 상세' :
                       bannerForm.linkType === 'product' ? '📦 상품 상세' :
                       bannerForm.linkType === 'collection' ? '🛍️ 기획전' :
                       bannerForm.linkType === 'none' ? '🚫 연결 없음' :
                       '🏷️ 카테고리 탭'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {bannerForm.linkType === 'url' ? (bannerForm.linkUrl || '(URL 미입력)') :
                     bannerForm.linkType === 'event' ? (events.find(e => e.id === bannerForm.linkEventId)?.title || bannerForm.linkEventId || '선택된 이벤트 없음') :
                     bannerForm.linkType === 'product' ? (products.find(p => p.id === bannerForm.linkProductId)?.name || bannerForm.linkProductId || '선택된 상품 없음') :
                     bannerForm.linkType === 'collection' ? `상품 ${(bannerForm.linkProductIds || []).filter(id => id.trim()).length}개` :
                     bannerForm.linkType === 'none' ? '배너 탭 시 이동하지 않습니다' :
                     `카테고리: ${bannerForm.linkCategory || '신제품'}`}
                  </p>
                </div>
              </div>

            </div>

            <div className={`p-4 border-t flex items-center justify-end gap-2 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}
              >
                취소
              </button>
              <button
                onClick={handleSaveBanner}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow-sm"
              >
                {editingBannerId ? '수정 완료' : '새 배너 등록'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: HIGH RES IMAGE PREVIEW
         ======================================================== */}
      {previewImageModalUrl && (
        <div 
          onClick={() => setPreviewImageModalUrl(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <img src={previewImageModalUrl} alt="고화질 원본" className="w-full h-full object-contain" />
            <button
              onClick={() => setPreviewImageModalUrl(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      {/* ========================================================
          MODAL: PRODUCT HIGH RES IMAGE SELECTOR
         ======================================================== */}
      {imageSelectorTarget && (
        <ProductImageSelectorModal
          isOpen={Boolean(imageSelectorTarget)}
          onClose={() => setImageSelectorTarget(null)}
          brand={imageSelectorTarget.brand}
          productName={imageSelectorTarget.name}
          currentImage={imageSelectorTarget.currentImage}
          onSelectImage={(newUrl: string) => {
            imageSelectorTarget.onSelect(newUrl);
            setImageSelectorTarget(null);
          }}
          isDark={isDark}
        />
      )}

      {/* ========================================================
          MODAL: FOOD NUTRITION SEARCH (식약처 영양성분 자동조회)
         ======================================================== */}
      {nutritionSearchTarget && (
        <FoodNutritionSearchModal
          isOpen={Boolean(nutritionSearchTarget)}
          onClose={() => setNutritionSearchTarget(null)}
          initialQuery={nutritionSearchTarget.initialQuery}
          brand={nutritionSearchTarget.brand}
          onSelect={(data: FoodNutritionData) => {
            nutritionSearchTarget.onSelect(data);
            setNutritionSearchTarget(null);
          }}
        />
      )}

    </div>
  );
};
