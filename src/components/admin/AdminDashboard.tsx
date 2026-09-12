import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
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
  CheckCircle2, 
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
  ArrowUpRight,
  Globe,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  Link2,
  ExternalLink,
  Gift,
  Coins,
  Users,
  MinusCircle,
  PlusCircle,
  History,
  ShieldCheck,
  Copy,
  Target,
  FolderCheck,
  ArrowUp,
  ArrowDown,
  ChevronLeft
} from 'lucide-react';
import { ProductCategory, BannerItem, BannerLinkType, Product, PendingProduct, UserProfile, NutritionInfo, StoreStockItem } from '../../types';
import { CATEGORIES } from '../../data/mockProducts';
import { 
  getShoppingInsightTrendingKeywords, 
  fetchFoodCategoryShoppingTrends, 
  TrendingKeywordInsight, 
  ShoppingInsightResponse 
} from '../../services/naverApi';
import { BrandProductAutoCollector } from './BrandProductAutoCollector';
import { ProductImageSelectorModal } from './ProductImageSelectorModal';
import { FoodNutritionSearchModal } from './FoodNutritionSearchModal';
import { FoodNutritionData } from '../../services/nutritionApi';


export type AdminTab = 
  | 'overview' 
  | 'collector'
  | 'approval' 
  | 'products' 
  | 'points'
  | 'reviews' 
  | 'analytics' 
  | 'banners' 
  | 'battle' 
  | 'data';

export const AdminDashboard: React.FC = () => {
  const { 
    banners, 
    products, 
    battleConfig,
    reviews,
    communityPosts,
    events,
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
    toggleProductToday, 
    toggleProductHot,
    updateBattleConfig,
    resetAllDataToDefaults,
    setActiveTab,
    showToast,
    isSupabaseConnected,
    pendingProducts,
    pendingCount,
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
    deleteReview,
    deleteCommunityPost,
    allProfiles,
    pointTransactions,
    grantUserPoints,
    revokeUserPoints,
    batchGrantPoints,
    batchRevokePoints,
    fetchAllProfiles,
    currentUser,
  } = useApp();

  // Theme mode: Default to 'light' for high readability, with quick toggle to 'dark'
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  // Desktop active tab
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('overview');

  // Points Management states
  const [pointsSubTab, setPointsSubTab] = useState<'users' | 'history'>('users');
  const [pointUserSearch, setPointUserSearch] = useState('');
  const [pointLevelFilter, setPointLevelFilter] = useState<string>('전체');
  const [pointSortBy, setPointSortBy] = useState<'points_desc' | 'points_asc' | 'name' | 'newest'>('points_desc');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Modal states for Points
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [isUserDetailModalOpen, setIsUserDetailModalOpen] = useState(false);
  const [targetPointUser, setTargetPointUser] = useState<UserProfile | null>(null);
  const [isBatchMode, setIsBatchMode] = useState(false);

  // Form states for Grant / Revoke
  const [pointAmountInput, setPointAmountInput] = useState<number>(500);
  const [pointReasonPreset, setPointReasonPreset] = useState<string>('우수 리뷰어 베스트 픽 선정 보상');
  const [pointReasonCustom, setPointReasonCustom] = useState<string>('');
  const [pointAdminMemo, setPointAdminMemo] = useState<string>('');

  // History Tab states
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyTypeFilter, setHistoryTypeFilter] = useState<'all' | 'grant' | 'revoke'>('all');

  // Approval / Crawler tab states
  const [crawlerSearchQuery, setCrawlerSearchQuery] = useState('');
  const [selectedPendingIds, setSelectedPendingIds] = useState<string[]>([]);
  const [pendingCategoryFilter, setPendingCategoryFilter] = useState<ProductCategory | '전체'>('전체');
  const [pendingSourceFilter, setPendingSourceFilter] = useState<string>('전체');
  const [isEditingPendingModalOpen, setIsEditingPendingModalOpen] = useState(false);
  const [editingPendingItem, setEditingPendingItem] = useState<PendingProduct | null>(null);

  // NAVER DataLab Shopping Insight states
  const [shoppingInsightTrends, setShoppingInsightTrends] = useState<TrendingKeywordInsight[]>([]);
  const [shoppingCategoryTrends, setShoppingCategoryTrends] = useState<ShoppingInsightResponse | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  // Load NAVER DataLab Shopping Insights
  const loadShoppingInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const [keywords, catTrends] = await Promise.all([
        getShoppingInsightTrendingKeywords(),
        fetchFoodCategoryShoppingTrends()
      ]);
      setShoppingInsightTrends(keywords);
      setShoppingCategoryTrends(catTrends);
    } catch (e) {
      console.warn('[Admin Shopping Insight Load Error]', e);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  useEffect(() => {
    loadShoppingInsights();
  }, []);

  // Collect Products based on Shopping Insight Keyword
  const handleCollectByInsightKeyword = async (kw: string) => {
    showToast(`🔥 네이버 쇼핑인사이트 급상승 '${kw}' 신제품을 수집합니다...`, 'info');
    const res = await searchAndCollect(`${kw} 신제품`);
    setActiveAdminTab('approval');
    showToast(`'${kw}' 관련 ${res.count}개 신제품이 승인 대기함에 추가되었습니다!`, 'success');
  };

  // Products tab states
  const [productViewMode, setProductViewMode] = useState<'table' | 'grid'>('table');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<ProductCategory | '전체'>('전체');
  const [productFilterBadge, setProductFilterBadge] = useState<'all' | 'today' | 'hot'>('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Bulk operation states in Products Tab
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Reviews & Community tab states
  const [moderationSubTab, setModerationSubTab] = useState<'reviews' | 'community'>('reviews');
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');
  const [communitySearchQuery, setCommunitySearchQuery] = useState('');

  // Product Form state
  const [productForm, setProductForm] = useState<{
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
    isToday: boolean;
    isHot: boolean;
    ingredients: string;
    allergens: string;
    origin: string;
    manufacturer: string;
    nutrition?: NutritionInfo;
  }>({
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
    isToday: true,
    isHot: false,
    ingredients: '',
    allergens: '',
    origin: '대한민국',
    manufacturer: '',
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
  const [battlePercentA, setBattlePercentA] = useState(battleConfig.percentA);

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

  // Filtered pending products
  const filteredPendingProducts = pendingProducts.filter(item => {
    if (item.status !== 'pending') return false;
    if (pendingCategoryFilter !== '전체' && item.category !== pendingCategoryFilter) return false;
    if (pendingSourceFilter !== '전체') {
      if (pendingSourceFilter === '공식몰') {
        if (!item.sourceName.includes('공식') && !item.sourceName.includes('몰') && !item.sourceName.includes('스토어') && !item.sourceName.includes('마켓')) return false;
      } else if (pendingSourceFilter === '인스타그램') {
        if (!item.sourceName.includes('인스타') && !item.sourceName.includes('@')) return false;
      } else if (pendingSourceFilter === '보도자료') {
        if (!item.sourceName.includes('뉴스') && !item.sourceName.includes('보도자료') && !item.sourceName.includes('발표')) return false;
      } else if (!item.sourceName.includes(pendingSourceFilter)) {
        return false;
      }
    }
    if (crawlerSearchQuery.trim()) {
      const q = crawlerSearchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.brand.toLowerCase().includes(q);
    }
    return true;
  });

  // Filtered regular products
  const filteredAdminProducts = products.filter(p => {
    if (productCategoryFilter !== '전체' && p.category !== productCategoryFilter) return false;
    if (productFilterBadge === 'today' && !p.isToday) return false;
    if (productFilterBadge === 'hot' && !p.isHot) return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    }
    return true;
  });

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

  // Pending selection helpers
  const toggleSelectAllPending = () => {
    if (selectedPendingIds.length === filteredPendingProducts.length) {
      setSelectedPendingIds([]);
    } else {
      setSelectedPendingIds(filteredPendingProducts.map(p => p.id));
    }
  };

  const togglePendingSelect = (id: string) => {
    setSelectedPendingIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkApproveSelected = () => {
    if (selectedPendingIds.length === 0) return;
    const count = selectedPendingIds.length;
    selectedPendingIds.forEach(id => approvePendingProduct(id));
    setSelectedPendingIds([]);
    showToast(`${count}개 상품이 승인 등록되었습니다!`, 'success');
  };

  const handleBulkRejectSelected = () => {
    if (selectedPendingIds.length === 0) return;
    const count = selectedPendingIds.length;
    selectedPendingIds.forEach(id => rejectPendingProduct(id));
    setSelectedPendingIds([]);
    showToast(`${count}개 대기 상품이 승인 취소(반려)되었습니다.`, 'info');
  };

  const handleBulkRevokeSelectedProducts = () => {
    if (selectedProductIds.length === 0) return;
    const count = selectedProductIds.length;
    if (confirm(`선택한 ${count}개 상품의 승인을 취소하고 대기함으로 되돌리시겠습니까?`)) {
      revokeAllApprovedProducts(selectedProductIds);
      setSelectedProductIds([]);
    }
  };

  // Points Management Helpers & Handlers
  const handleOpenGrantModal = (user: UserProfile) => {
    setTargetPointUser(user);
    setIsBatchMode(false);
    setPointAmountInput(500);
    setPointReasonPreset('우수 리뷰어 베스트 픽 선정 보상');
    setPointReasonCustom('');
    setPointAdminMemo('');
    setIsGrantModalOpen(true);
  };

  const handleOpenBatchGrantModal = () => {
    if (selectedUserIds.length === 0) {
      showToast('포인트를 지급할 회원을 1명 이상 선택해주세요.', 'error');
      return;
    }
    setTargetPointUser(null);
    setIsBatchMode(true);
    setPointAmountInput(500);
    setPointReasonPreset('이벤트 당첨 특별 포인트 보상');
    setPointReasonCustom('');
    setPointAdminMemo('');
    setIsGrantModalOpen(true);
  };

  const handleOpenRevokeModal = (user: UserProfile) => {
    setTargetPointUser(user);
    setIsBatchMode(false);
    setPointAmountInput(100);
    setPointReasonPreset('어뷰징/중복 도배 리뷰 삭제로 인한 포인트 회수');
    setPointReasonCustom('');
    setPointAdminMemo('');
    setIsRevokeModalOpen(true);
  };

  const handleOpenBatchRevokeModal = () => {
    if (selectedUserIds.length === 0) {
      showToast('포인트를 회수할 회원을 1명 이상 선택해주세요.', 'error');
      return;
    }
    setTargetPointUser(null);
    setIsBatchMode(true);
    setPointAmountInput(100);
    setPointReasonPreset('어뷰징/중복 도배 리뷰 삭제로 인한 포인트 회수');
    setPointReasonCustom('');
    setPointAdminMemo('');
    setIsRevokeModalOpen(true);
  };

  const handleOpenUserDetailModal = (user: UserProfile) => {
    setTargetPointUser(user);
    setIsUserDetailModalOpen(true);
  };

  const handleConfirmGrant = async () => {
    const finalReason = pointReasonPreset === '직접 입력' 
      ? (pointReasonCustom.trim() || '관리자 포인트 특별 지급') 
      : pointReasonPreset;

    if (pointAmountInput <= 0) {
      showToast('1P 이상의 포인트를 입력해주세요.', 'error');
      return;
    }

    if (isBatchMode) {
      await batchGrantPoints(selectedUserIds, pointAmountInput, finalReason, pointAdminMemo.trim() || undefined);
      setSelectedUserIds([]);
    } else if (targetPointUser) {
      await grantUserPoints(targetPointUser.uid, pointAmountInput, finalReason, pointAdminMemo.trim() || undefined);
    }

    setIsGrantModalOpen(false);
  };

  const handleConfirmRevoke = async () => {
    const finalReason = pointReasonPreset === '직접 입력' 
      ? (pointReasonCustom.trim() || '관리자 포인트 회수/차감') 
      : pointReasonPreset;

    if (pointAmountInput <= 0) {
      showToast('1P 이상의 포인트를 입력해주세요.', 'error');
      return;
    }

    if (isBatchMode) {
      await batchRevokePoints(selectedUserIds, pointAmountInput, finalReason, pointAdminMemo.trim() || undefined);
      setSelectedUserIds([]);
    } else if (targetPointUser) {
      await revokeUserPoints(targetPointUser.uid, pointAmountInput, finalReason, pointAdminMemo.trim() || undefined);
    }

    setIsRevokeModalOpen(false);
  };

  // User list filtering & sorting for Points Tab
  const filteredPointUsers = allProfiles.filter(u => {
    if (pointLevelFilter !== '전체' && u.level !== pointLevelFilter) return false;
    if (pointUserSearch.trim()) {
      const q = pointUserSearch.toLowerCase();
      const name = (u.displayName || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const uid = (u.uid || '').toLowerCase();
      return name.includes(q) || email.includes(q) || uid.includes(q);
    }
    return true;
  }).sort((a, b) => {
    if (pointSortBy === 'points_desc') return (b.points || 0) - (a.points || 0);
    if (pointSortBy === 'points_asc') return (a.points || 0) - (b.points || 0);
    if (pointSortBy === 'name') return (a.displayName || '').localeCompare(b.displayName || '');
    if (pointSortBy === 'newest') return (b.createdAt || '').localeCompare(a.createdAt || '');
    return 0;
  });

  // History filtering
  const filteredPointTransactions = pointTransactions.filter(tx => {
    if (historyTypeFilter !== 'all' && tx.type !== historyTypeFilter) return false;
    if (historySearchQuery.trim()) {
      const q = historySearchQuery.toLowerCase();
      return (
        (tx.userName || '').toLowerCase().includes(q) ||
        (tx.reason || '').toLowerCase().includes(q) ||
        (tx.adminMemo || '').toLowerCase().includes(q) ||
        (tx.userId || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate Point Statistics
  const totalMemberPoints = allProfiles.reduce((acc, u) => acc + (u.points || 0), 0);
  const avgMemberPoints = allProfiles.length > 0 ? Math.round(totalMemberPoints / allProfiles.length) : 0;
  const totalGrantedPoints = pointTransactions
    .filter(tx => tx.type === 'grant' || (tx.amount > 0))
    .reduce((acc, tx) => acc + Math.abs(tx.amount), 0);
  const totalRevokedPoints = pointTransactions
    .filter(tx => tx.type === 'revoke' || (tx.amount < 0))
    .reduce((acc, tx) => acc + Math.abs(tx.amount), 0);

  const toggleSelectAllUsers = () => {
    if (selectedUserIds.length === filteredPointUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredPointUsers.map(u => u.uid));
    }
  };

  const toggleSelectUser = (uid: string) => {
    setSelectedUserIds(prev => 
      prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
    );
  };

  const handleExportTransactionsJson = () => {
    const blob = new Blob([JSON.stringify(pointTransactions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sinsangpick_point_transactions_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📜 포인트 거래 내역이 JSON 파일로 다운로드되었습니다.', 'success');
  };

  // Helper to check if a pending product is a duplicate of an existing approved product
  const isDuplicateItem = (name: string): boolean => {
    const cleanName = name.replace(/\s+/g, '').toLowerCase();
    return products.some(p => p.name.replace(/\s+/g, '').toLowerCase() === cleanName);
  };

  const handleSearchCollect = async () => {
    if (!crawlerSearchQuery.trim()) {
      showToast('검색어를 입력해주세요.', 'info');
      return;
    }
    const res = await searchAndCollect(crawlerSearchQuery);
    showToast(`'${crawlerSearchQuery}' 관련 ${res.count}개 신제품을 수집했습니다.`, 'success');
  };

  const openEditPending = (item: PendingProduct) => {
    setEditingPendingItem(item);
    setIsEditingPendingModalOpen(true);
  };

  // Product selection (Bulk operations) helpers
  const toggleSelectAllProducts = () => {
    if (selectedProductIds.length === filteredAdminProducts.length && filteredAdminProducts.length > 0) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredAdminProducts.map(p => p.id));
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
      selectedProductIds.forEach(id => deleteProduct(id));
      setSelectedProductIds([]);
      showToast('선택한 상품이 모두 삭제되었습니다.', 'info');
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
    setProductForm({
      name: '',
      brand: '',
      category: '신제품',
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
      isToday: true,
      isHot: false,
      ingredients: '',
      allergens: '',
      origin: '대한민국',
      manufacturer: '',
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

    setEditingProductId(prod.id);
    setProductForm({
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
      isToday: !!prod.isToday,
      isHot: !!prod.isHot,
      ingredients: prod.ingredients || '',
      allergens: prod.allergens ? prod.allergens.join(', ') : '',
      origin: prod.origin || '대한민국',
      manufacturer: prod.manufacturer || '',
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
      const existingStock = currentProd?.storeStocks?.find(s => s.store === stName);
      const link = (productForm.storeLinks && productForm.storeLinks[stName]) ? productForm.storeLinks[stName].trim() : undefined;

      return {
        store: stName,
        status: existingStock?.status || '입고완료',
        stockCount: existingStock?.stockCount ?? 10,
        price: existingStock?.price ?? (Number(productForm.price) || 0),
        discountPrice: existingStock?.discountPrice,
        eventBadge: existingStock?.eventBadge || undefined,
        deliveryTime: existingStock?.deliveryTime || (stName === '온라인' || stName.includes('몰') || stName.includes('쿠팡') || stName.includes('컬리') ? '전국 택배 배송' : '매장 즉시 픽업'),
        appLink: link || undefined
      };
    });

    const payload = {
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
      disclaimer: banner.disclaimer || '',
      isActive: banner.isActive,
      order: banner.order || 1,
    });
    setBannerImageMode(banner.image?.startsWith('data:') ? 'file' : 'file');
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = () => {
    if (!bannerForm.title.trim()) {
      showToast('배너 제목을 입력해주세요.', 'error');
      return;
    }
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
      title: bannerForm.title.trim(),
      subtitle: bannerForm.subtitle.trim(),
      buttonText: bannerForm.buttonText.trim() || '바로가기',
      linkType: bannerForm.linkType,
      linkUrl: bannerForm.linkType === 'url' ? bannerForm.linkUrl?.trim() : undefined,
      linkEventId: bannerForm.linkType === 'event' ? bannerForm.linkEventId : undefined,
      linkProductId: bannerForm.linkType === 'product' ? bannerForm.linkProductId : undefined,
      linkCategory: bannerForm.linkType === 'category' ? bannerForm.linkCategory : undefined,
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
  const handleSaveBattle = () => {
    updateBattleConfig({
      title: battleTitle,
      subtitle: battleSubtitle,
      productAId: battleProductAId,
      labelA: battleLabelA,
      productBId: battleProductBId,
      labelB: battleLabelB,
      percentA: battlePercentA
    });
    showToast('신상 배틀 설정이 저장되었습니다.', 'success');
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
  const sidebarBg = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const headerBg = isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200';
  const cardBg = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-xs';
  const subCardBg = isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50/80 border-slate-200/70';
  const inputBg = isDark ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white';
  const tableHeaderBg = isDark ? 'bg-slate-950/80 text-slate-400 border-slate-800' : 'bg-slate-100/70 text-slate-600 border-slate-200';
  const tableRowHover = isDark ? 'hover:bg-slate-800/40 divide-slate-800/60' : 'hover:bg-slate-50/80 divide-slate-100';
  const modalBg = isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-2xl';

  return (
    <div className={`flex h-screen w-full antialiased overflow-hidden font-sans transition-colors duration-200 ${mainBg}`}>
      
      {/* ================= DESKTOP LEFT SIDEBAR ================= */}
      <aside className={`w-64 border-r flex flex-col justify-between shrink-0 select-none z-20 transition-colors ${sidebarBg}`}>
        
        {/* Top Branding & Nav */}
        <div>
          <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 ring-1 ring-white/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className={`font-black text-sm tracking-tight flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  신상픽 <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 uppercase font-mono font-bold">Admin Pro</span>
                </h1>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>통합 관리자 콘솔</p>
              </div>
            </div>
          </div>

          {/* Database Connection Status Card */}
          <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-800/80 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'}`} />
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {isSupabaseConnected ? 'Supabase 실시간 클라우드' : '로컬 스토리지 모드'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">v2.5</span>
            </div>
          </div>

          {/* Main Navigation Tabs */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
            
            {/* 1. Overview */}
            <button
              onClick={() => setActiveAdminTab('overview')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : isDark 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4" />
                <span>대시보드 개요</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeAdminTab === 'overview' ? 'rotate-90 text-white' : 'text-slate-400'}`} />
            </button>

            {/* 2. Official Brand/Item Collector (NEW) */}
            <button
              onClick={() => setActiveAdminTab('collector')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === 'collector'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20'
                  : isDark 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Target className="w-4 h-4 text-amber-500" />
                <span>브랜드·품목 공식 수집</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500/20 text-amber-500 border border-amber-500/30">
                NEW
              </span>
            </button>

            {/* 3. Approval / Crawler Inbox */}
            <button
              onClick={() => setActiveAdminTab('approval')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === 'approval'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : isDark 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>신제품 수집·승인</span>
              </div>
              {pendingCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                  {pendingCount}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-mono">0</span>
              )}
            </button>

            {/* 3. Products Management */}
            <button
              onClick={() => setActiveAdminTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === 'products'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : isDark 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>상품 및 신상 관리</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600 font-bold'}`}>
                {products.length}
              </span>
            </button>

            {/* 4. Points & User Management (NEW) */}
            <button
              onClick={() => setActiveAdminTab('points')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === 'points'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20'
                  : isDark 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>회원·포인트 관리</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                activeAdminTab === 'points' 
                  ? 'bg-white/20 text-white font-bold' 
                  : isDark ? 'bg-slate-800 text-amber-300' : 'bg-amber-50 text-amber-700 font-bold'
              }`}>
                {allProfiles.length}명
              </span>
            </button>

            {/* 5. Reviews & Community Moderation (NEW) */}
            <button
              onClick={() => setActiveAdminTab('reviews')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === 'reviews'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : isDark 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                <span>리뷰·커뮤니티 관리</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600 font-bold'}`}>
                {reviews.length + communityPosts.length}
              </span>
            </button>

            {/* 5. Analytics & Trends (NEW) */}
            <button
              onClick={() => setActiveAdminTab('analytics')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : isDark 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span>트렌드·통계 분석</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-600 font-bold">HOT</span>
            </button>

            {/* 6. Banners */}
            <button
              onClick={() => setActiveAdminTab('banners')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === 'banners'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : isDark 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>홈 배너 관리</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600 font-bold'}`}>
                {banners.length}
              </span>
            </button>

            {/* 7. Battle Matchup */}
            <button
              onClick={() => setActiveAdminTab('battle')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === 'battle'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : isDark 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Swords className="w-4 h-4 text-rose-500" />
                <span>신상 배틀 설정</span>
              </div>
            </button>

            {/* 8. Data & Settings */}
            <button
              onClick={() => setActiveAdminTab('data')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === 'data'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : isDark 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-emerald-500" />
                <span>데이터 & 백업</span>
              </div>
            </button>

          </nav>
        </div>

        {/* Sidebar Bottom: Return to Mobile Service & Theme Switcher */}
        <div className={`p-4 border-t space-y-3 ${isDark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-slate-50/70'}`}>
          
          {/* Direct Switcher back to User Mobile App View */}
          <button
            onClick={() => setActiveTab('home')}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-98 ${
              isDark 
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30' 
                : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
            }`}
          >
            <Smartphone className="w-4 h-4 text-indigo-500" />
            <span>📱 모바일 앱 화면으로 이동</span>
          </button>

          {/* Admin User Info */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5 truncate">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-black text-xs ${isDark ? 'bg-slate-800 border-slate-700 text-indigo-400' : 'bg-indigo-100 border-indigo-200 text-indigo-600'}`}>
                AD
              </div>
              <div className="truncate">
                <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>신상픽 최고관리자</p>
                <p className="text-[10px] text-slate-400 truncate">master@sinsangpick.com</p>
              </div>
            </div>
          </div>
        </div>

      </aside>

      {/* ================= DESKTOP MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Desktop Sticky Header Bar */}
        <header className={`h-16 px-8 border-b backdrop-blur-md flex items-center justify-between shrink-0 z-10 transition-colors ${headerBg}`}>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>신상픽 관리자 콘솔</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {activeAdminTab === 'overview' && '📊 대시보드 개요 및 실시간 종합 지표'}
              {activeAdminTab === 'collector' && '🎯 브랜드 & 품목 공식홈페이지 제품 자동수집기'}
              {activeAdminTab === 'approval' && '⚡ 신제품 자동 수집 파이프라인 & 승인함'}
              {activeAdminTab === 'products' && '📦 상품 및 신제품 전체 데이터베이스'}
              {activeAdminTab === 'points' && '🪙 회원 관리 및 포인트 지급·회수 콘솔'}
              {activeAdminTab === 'reviews' && '💬 사용자 리뷰 및 커뮤니티 피드 모더레이션'}
              {activeAdminTab === 'analytics' && '📈 신상 검색 트렌드 및 카테고리 분석'}
              {activeAdminTab === 'banners' && '🖼️ 모바일 메인 홈 배너 관리'}
              {activeAdminTab === 'battle' && '🥊 신상 배틀 실시간 맞대결 설정'}
              {activeAdminTab === 'data' && '💾 데이터 백업 및 데이터베이스 설정'}
            </span>
          </div>

          {/* Quick Metrics Bar, Theme Switcher & Actions */}
          <div className="flex items-center gap-3">
            
            {/* Live Stats Chips */}
            <div className="hidden xl:flex items-center gap-2 text-xs">
              <span className={`px-2.5 py-1 rounded-lg border font-medium ${isDark ? 'bg-slate-800/80 border-slate-700/60 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                총 상품 <strong className={`font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{products.length}</strong>
              </span>
              <span className={`px-2.5 py-1 rounded-lg border font-medium ${isDark ? 'bg-indigo-950/60 border-indigo-800/50 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'}`}>
                오늘신상 <strong className="font-mono">{todayProductsCount}</strong>
              </span>
              <span className={`px-2.5 py-1 rounded-lg border font-medium ${isDark ? 'bg-orange-950/60 border-orange-800/50 text-orange-300' : 'bg-orange-50 border-orange-200 text-orange-700'}`}>
                인기HOT <strong className="font-mono">{hotProductsCount}</strong>
              </span>
              {pendingCount > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-rose-500 text-white animate-pulse font-bold">
                  승인대기 <strong className="font-mono">{pendingCount}</strong>
                </span>
              )}
            </div>

            {/* ☀️ / 🌙 THEME TOGGLE BUTTON */}
            <button
              onClick={() => {
                const nextMode = isDark ? 'light' : 'dark';
                setThemeMode(nextMode);
                showToast(nextMode === 'light' ? '☀️ 밝고 보기 편한 라이트 모드로 전환되었습니다.' : '🌙 다크 모드로 전환되었습니다.', 'info');
              }}
              className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="테마 모드 전환 (라이트/다크)"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              <span className="hidden sm:inline">{isDark ? '라이트 모드' : '다크 모드'}</span>
            </button>

            {/* Quick Action Button */}
            {activeAdminTab === 'products' ? (
              <button
                onClick={handleOpenNewProduct}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>상품 직접 등록</span>
              </button>
            ) : activeAdminTab === 'banners' ? (
              <button
                onClick={() => handleOpenNewBanner()}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>새 배너 구좌 추가</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
                <span>앱 화면 미리보기</span>
              </button>
            )}

          </div>
        </header>

        {/* Desktop Scrollable Main Canvas */}
        <main className="flex-1 overflow-y-auto p-8 max-w-[1700px] w-full mx-auto space-y-8">
          
          {/* ========================================================
              TAB 1: OVERVIEW (대시보드 개요)
             ======================================================== */}
          {activeAdminTab === 'overview' && (
            <div className="space-y-8">
              
              {/* 1. 6-Column Large KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                
                {/* Total Products */}
                <div className={`p-4 rounded-2xl border transition-all hover:shadow-md ${cardBg}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">전체 등록 상품</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-500/20">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-baseline gap-1.5">
                    <span className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{products.length}</span>
                    <span className="text-xs text-slate-400">개 등록</span>
                  </div>
                  <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                    <span>식품사 카탈로그</span>
                    <button onClick={() => setActiveAdminTab('products')} className="text-indigo-600 hover:underline flex items-center gap-0.5 font-semibold">
                      관리 <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Today's New Products */}
                <div className={`p-4 rounded-2xl border transition-all hover:shadow-md ${cardBg}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider">오늘의 출시 신상</span>
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center border border-indigo-500/20">
                      <Zap className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-baseline gap-1.5">
                    <span className={`text-2xl font-black font-mono ${isDark ? 'text-indigo-200' : 'text-indigo-600'}`}>{todayProductsCount}</span>
                    <span className="text-xs text-indigo-500">개 활성</span>
                  </div>
                  <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                    <span>홈 피드 노출</span>
                    <button onClick={() => { setProductFilterBadge('today'); setActiveAdminTab('products'); }} className="text-indigo-600 hover:underline flex items-center gap-0.5 font-semibold">
                      보기 <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Hot Products */}
                <div className={`p-4 rounded-2xl border transition-all hover:shadow-md ${cardBg}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-orange-500 uppercase tracking-wider">인기 HOT 신상</span>
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center border border-orange-500/20">
                      <Flame className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-baseline gap-1.5">
                    <span className={`text-2xl font-black font-mono ${isDark ? 'text-orange-200' : 'text-orange-600'}`}>{hotProductsCount}</span>
                    <span className="text-xs text-orange-500">개</span>
                  </div>
                  <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                    <span>평점 우수 먹거리</span>
                    <button onClick={() => { setProductFilterBadge('hot'); setActiveAdminTab('products'); }} className="text-orange-600 hover:underline flex items-center gap-0.5 font-semibold">
                      보기 <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Reviews & Satisfaction */}
                <div className={`p-4 rounded-2xl border transition-all hover:shadow-md ${cardBg}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">누적 리뷰</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-baseline gap-1.5">
                    <span className={`text-2xl font-black font-mono ${isDark ? 'text-emerald-200' : 'text-emerald-600'}`}>{reviews.length}</span>
                    <span className="text-xs text-emerald-600 font-bold">★ {avgReviewRating}</span>
                  </div>
                  <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                    <span>커뮤니티 {communityPosts.length}건</span>
                    <button onClick={() => setActiveAdminTab('reviews')} className="text-emerald-600 hover:underline flex items-center gap-0.5 font-semibold">
                      검토 <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Pending Approval */}
                <div className={`p-4 rounded-2xl border transition-all hover:shadow-md ${cardBg}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">신제품 수집 대기</span>
                    <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center border border-rose-500/20">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-baseline gap-1.5">
                    <span className={`text-2xl font-black font-mono ${isDark ? 'text-rose-200' : 'text-rose-600'}`}>{pendingCount}</span>
                    <span className="text-xs text-rose-500 font-semibold">개 대기</span>
                  </div>
                  <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                    <span>크롤러 수집함</span>
                    <button onClick={() => setActiveAdminTab('approval')} className="text-rose-600 hover:underline flex items-center gap-0.5 font-bold">
                      승인 <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* NEW: 6. Members & Total Points */}
                <div className={`p-4 rounded-2xl border transition-all hover:shadow-md ${cardBg}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">회원 & 포인트</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
                      <Coins className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-baseline gap-1.5">
                    <span className={`text-2xl font-black font-mono ${isDark ? 'text-amber-200' : 'text-amber-600'}`}>{allProfiles.length}</span>
                    <span className="text-xs text-amber-500 font-bold">명 / {totalMemberPoints.toLocaleString()}P</span>
                  </div>
                  <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                    <span>포인트 지급·회수</span>
                    <button onClick={() => setActiveAdminTab('points')} className="text-amber-600 hover:underline flex items-center gap-0.5 font-bold">
                      관리 <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>

              {/* 2. Middle Row: Battle Arena Live Card + Pending Quick Action */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Battle Matchup Status Card */}
                <div className={`xl:col-span-2 p-6 rounded-2xl border shadow-sm space-y-4 ${cardBg}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                        <Swords className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{battleConfig.title}</h2>
                        <p className="text-xs text-slate-400">{battleConfig.subtitle}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveAdminTab('battle')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1 transition-colors ${
                        isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                    >
                      배틀 매치업 수정 <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* VS Preview Mini */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${subCardBg}`}>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img src={prodA?.image} alt={prodA?.name} className="w-12 h-12 object-cover rounded-xl border border-blue-500/30 shrink-0" />
                      <div className="truncate">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-500/10 px-1.5 py-0.5 rounded">{battleConfig.labelA}</span>
                        <p className={`text-xs font-bold truncate mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{prodA?.name}</p>
                        <p className="text-xs font-mono font-bold text-blue-600">{battlePercentA}%</p>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-md">
                      VS
                    </div>

                    <div className="flex items-center justify-end gap-3 flex-1 min-w-0 text-right">
                      <div className="truncate">
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-500/10 px-1.5 py-0.5 rounded">{battleConfig.labelB}</span>
                        <p className={`text-xs font-bold truncate mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{prodB?.name}</p>
                        <p className="text-xs font-mono font-bold text-rose-600">{100 - battlePercentA}%</p>
                      </div>
                      <img src={prodB?.image} alt={prodB?.name} className="w-12 h-12 object-cover rounded-xl border border-rose-500/30 shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Quick Banner Status Card */}
                <div className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between space-y-4 ${cardBg}`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-indigo-500" />
                        <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>활성 프로모션 배너</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                        {activeBannersCount}개 노출중
                      </span>
                    </div>

                    <div className="mt-4 space-y-2">
                      {banners.slice(0, 3).map((b, idx) => (
                        <div key={b.id} className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${subCardBg}`}>
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-5 h-5 rounded bg-slate-200/60 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-[10px] text-slate-500">
                              {idx + 1}
                            </span>
                            <span className={`font-semibold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{b.title}</span>
                          </div>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${b.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                            {b.isActive ? '노출중' : '숨김'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveAdminTab('banners')}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    배너 관리로 이동 ({banners.length})
                  </button>
                </div>

              </div>

              {/* 3. Recent Products Snapshot Table */}
              <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${cardBg}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-sm font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Package className="w-4 h-4 text-indigo-500" />
                      <span>최근 등록된 신상품 요약</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">새로 입고되었거나 관리자가 승인한 최신 먹거리 목록입니다.</p>
                  </div>
                  <button
                    onClick={() => setActiveAdminTab('products')}
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    전체 {products.length}개 상품 관리로 이동 <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className={`uppercase font-bold text-[11px] border-b ${tableHeaderBg}`}>
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
                    <tbody className={`divide-y ${tableRowHover}`}>
                      {products.slice(0, 5).map(prod => (
                        <tr key={prod.id} className="transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-800 shrink-0" />
                              <div>
                                <p className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{prod.name}</p>
                                <p className="text-[11px] text-slate-400">{prod.brand}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                              {prod.category}
                            </span>
                          </td>
                          <td className={`py-3 px-4 font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
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
                              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all border ${
                                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                              }`}
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
              TAB: OFFICIAL COLLECTOR (브랜드 & 품목 공식몰 제품 자동 수집 등록기)
             ======================================================== */}
          {activeAdminTab === 'collector' && (
            <BrandProductAutoCollector
              isDark={isDark}
              onAddProduct={addProduct}
              onAddToPending={addPendingProduct}
              showToast={showToast}
            />
          )}

          {/* ========================================================
              TAB 2: APPROVAL / CRAWLER INBOX (신제품 수집 & 승인함)
             ======================================================== */}
          {activeAdminTab === 'approval' && (
            <div className="space-y-6">
              
              {/* Header & Crawler Controller Banner */}
              <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${cardBg}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1">
                        <Bot className="w-3.5 h-3.5" />
                        <span>AI 신제품 자동 수집 파이프라인</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                        <Clock className="w-3 h-3" />
                        <span>마지막 수집: {lastCrawledDate || '금일 미수집'}</span>
                      </span>
                    </div>
                    <h2 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>편의점 4사 및 주요 식품사 실시간 신제품 승인함</h2>
                    <p className="text-xs text-slate-500">
                      CU, GS25, 세븐일레븐, 이마트24, 농심, 오리온 등에서 출시된 신제품을 수집하여 검토 후 승인 시 즉시 사용자 앱에 반영됩니다.
                    </p>
                  </div>

                  {/* Crawler Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setActiveAdminTab('collector')}
                      className="px-3.5 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all active:scale-95"
                    >
                      <Target className="w-4 h-4" />
                      <span>🎯 브랜드·품목 맞춤 공식 수집기 열기</span>
                    </button>

                    <button
                      onClick={() => runDailyCrawler(true)}
                      disabled={isCrawling}
                      className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isCrawling ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>신제품 수집 진행 중...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          <span>오늘 신제품 즉시 수집</span>
                        </>
                      )}
                    </button>

                    {filteredPendingProducts.length > 0 && (
                      <>
                        <button
                          onClick={handleBulkApproveSelected}
                          disabled={selectedPendingIds.length === 0}
                          className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-40 flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>선택 {selectedPendingIds.length}개 일괄 승인</span>
                        </button>
                        <button
                          onClick={approveAllPending}
                          className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>전체 일괄 승인</span>
                        </button>
                        <button
                          onClick={handleBulkRejectSelected}
                          disabled={selectedPendingIds.length === 0}
                          className="px-3 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-40 flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>선택 일괄 승인 취소</span>
                        </button>
                        <button
                          onClick={rejectAllPending}
                          className="px-3 py-2.5 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>전체 일괄 승인 취소</span>
                        </button>
                        <button
                          onClick={removeDuplicatePending}
                          className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 ${
                            isDark ? 'bg-slate-800 hover:bg-amber-950/60 text-amber-300 border-slate-700' : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                          }`}
                          title="이미 등록된 상품 및 중복 수집된 항목 자동 정리"
                        >
                          <span>⚠️ 중복 항목 자동 정리</span>
                        </button>
                        <button
                          onClick={revalidateAllPending}
                          className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 shadow-xs ${
                            isDark ? 'bg-slate-800 hover:bg-indigo-950/60 text-indigo-300 border-indigo-700/60' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                          }`}
                          title="네이버 쇼핑 실물 패키지 및 실제 판매가로 100% 정상화"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                          <span>✨ 쇼핑·신제품 고화질 정상화 ({filteredPendingProducts.length}건)</span>
                        </button>

                        <button
                          onClick={clearAllPendingProducts}
                          className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                            isDark ? 'bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border-slate-700' : 'bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border-slate-200'
                          }`}
                        >
                          대기함 비우기
                        </button>
                      </>
                    )}

                    {/* 최근 승인된 상품 대기함으로 복원 (승인 취소) */}
                    <button
                      onClick={() => {
                        if (confirm('최근 승인된 상품들을 다시 승인 대기함으로 되돌리시겠습니까?')) {
                          revokeAllApprovedProducts();
                        }
                      }}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                        isDark ? 'bg-slate-800 hover:bg-indigo-950/60 text-indigo-300 border-slate-700' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                      }`}
                      title="최근 승인된 상품들을 대기함으로 다시 복원합니다"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>최근 승인 일괄 취소 (대기함 복원)</span>
                    </button>
                  </div>
                </div>

                {/* Keyword Search Crawler Bar & Shopping Insight Recommendation Chips */}
                <div className={`pt-3 border-t space-y-2.5 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative flex-1 min-w-[280px]">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={crawlerSearchQuery}
                        onChange={e => setCrawlerSearchQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearchCollect()}
                        placeholder="특정 상품명이나 브랜드 검색 수집 (예: 꼬북칩, 제로밀크티, 찰떡아이스)"
                        className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 border ${inputBg}`}
                      />
                    </div>
                    <button
                      onClick={handleSearchCollect}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                        isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Search className="w-3.5 h-3.5 text-amber-500" />
                      <span>키워드 맞춤 수집</span>
                    </button>
                  </div>

                  {/* Realtime DataLab Shopping Insight Quick Trigger Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap text-xs">
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Activity className="w-3 h-3 animate-pulse" />
                      <span>네이버 쇼핑인사이트 실시간 인기 키워드:</span>
                    </span>
                    {shoppingInsightTrends.slice(0, 6).map((item) => (
                      <button
                        key={item.keyword}
                        onClick={() => handleCollectByInsightKeyword(item.keyword)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1 group ${
                          isDark 
                            ? 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-amber-950/60 hover:text-amber-300 hover:border-amber-700' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 shadow-2xs'
                        }`}
                        title="클릭 시 이 키워드로 실시간 신제품을 자동 수집합니다"
                      >
                        <span className="font-mono text-amber-500 text-[10px]">#{item.rank}</span>
                        <span>{item.keyword}</span>
                        <span className="text-[9px] text-emerald-500 font-mono font-black">{item.growthRate}</span>
                        <ArrowUpRight className="w-2.5 h-2.5 opacity-50 group-hover:opacity-100 text-amber-500" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filters & Count Bar */}
              <div className={`flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border ${subCardBg}`}>
                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {(['전체', '과자', '음료', '빵·디저트', '간편식', '기타'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setPendingCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        pendingCategoryFilter === cat
                          ? 'bg-amber-500 text-white shadow-xs'
                          : isDark 
                            ? 'bg-slate-800 text-slate-400 hover:text-slate-200' 
                            : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Source Filter Pills */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto no-scrollbar">
                  <span className="font-semibold shrink-0">출처:</span>
                  {(['전체', 'CU', 'GS25', '세븐일레븐', '이마트24', '공식몰', '인스타그램', '보도자료'] as const).map(src => (
                    <button
                      key={src}
                      onClick={() => setPendingSourceFilter(src)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all whitespace-nowrap ${
                        pendingSourceFilter === src
                          ? 'bg-slate-700 text-white font-bold'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {src}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pending Products Desktop Table */}
              {filteredPendingProducts.length === 0 ? (
                <div className={`p-12 rounded-2xl border border-dashed text-center space-y-3 ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white'}`}>
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>승인 대기 중인 신제품이 없습니다</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    위의 <strong className="text-amber-600 font-bold">[오늘 신제품 즉시 수집]</strong> 버튼을 누르시면 편의점 및 식품사의 따끈따끈한 신제품을 자동으로 가져옵니다.
                  </p>
                </div>
              ) : (
                <div className={`rounded-2xl border shadow-sm overflow-hidden ${cardBg}`}>
                  <div className={`p-4 border-b flex items-center justify-between text-xs ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedPendingIds.length === filteredPendingProducts.length && filteredPendingProducts.length > 0}
                        onChange={toggleSelectAllPending}
                        className="rounded border-slate-300 text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                      />
                      <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        전체 선택 ({selectedPendingIds.length}/{filteredPendingProducts.length}개)
                      </span>
                    </div>
                    <span>※ 승인된 상품은 즉시 메인 홈 및 신제품 피드에 정식 등록됩니다.</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className={`uppercase font-bold text-[11px] border-b ${tableHeaderBg}`}>
                        <tr>
                          <th className="py-3 px-4 w-12 text-center">선택</th>
                          <th className="py-3 px-4">신제품 / 브랜드 (클릭 시 출처 확인)</th>
                          <th className="py-3 px-4">저장 카테고리</th>
                          <th className="py-3 px-4">가격</th>
                          <th className="py-3 px-4">판매처 편의점</th>
                          <th className="py-3 px-4">수집 출처</th>
                          <th className="py-3 px-4">수집 일시</th>
                          <th className="py-3 px-4 text-right">작업</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${tableRowHover}`}>
                        {filteredPendingProducts.map(item => {
                          const isSelected = selectedPendingIds.includes(item.id);
                          const isDupl = isDuplicateItem(item.name);
                          return (
                            <tr key={item.id} className={`transition-colors ${isDupl ? (isDark ? 'bg-amber-950/30' : 'bg-amber-50/80') : isSelected ? (isDark ? 'bg-indigo-950/20' : 'bg-indigo-50/60') : ''}`}>
                              <td className="py-3 px-4 text-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => togglePendingSelect(item.id)}
                                  className="rounded border-slate-300 text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="relative shrink-0 group">
                                    <div
                                      onClick={() => setPreviewImageModalUrl(item.image)}
                                      className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer"
                                    >
                                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                                        <Eye className="w-3.5 h-3.5 text-white" />
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setImageSelectorTarget({
                                          brand: item.brand,
                                          name: item.name,
                                          currentImage: item.image,
                                          onSelect: (newUrl: string) => {
                                            updatePendingProduct(item.id, { image: newUrl });
                                            showToast('신제품 이미지가 고화질 실물 이미지로 교체되었습니다.', 'success');
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
                                      <p 
                                        onClick={() => openEditPending(item)}
                                        className={`font-bold text-xs truncate max-w-xs cursor-pointer hover:underline ${isDark ? 'text-white hover:text-amber-400' : 'text-slate-900 hover:text-amber-600'}`}
                                        title="클릭하여 수집 출처 및 저장될 카테고리 확인/수정"
                                      >
                                        {item.name}
                                      </p>
                                      {isDupl && (
                                        <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-amber-500/20 text-amber-600 border border-amber-500/40 animate-pulse">
                                          ⚠️ 이미 등록됨
                                        </span>
                                      )}
                                      {item.needsReview && (
                                        <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center gap-0.5" title={item.reviewReason || '수동 검증 필요'}>
                                          <AlertTriangle className="w-2.5 h-2.5" />
                                          <span>검증 필요{item.reviewReason ? ` (${item.reviewReason})` : ''}</span>
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-slate-400">{item.brand} · {item.releaseDate}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span 
                                  onClick={() => openEditPending(item)}
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer hover:ring-1 hover:ring-indigo-400 transition-all ${isDark ? 'bg-indigo-950/40 text-indigo-300 border border-indigo-800/50' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'}`}
                                  title={`승인 시 [${item.category}] 카테고리에 저장됩니다. 클릭 시 변경 가능`}
                                >
                                  📁 {item.category}
                                </span>
                              </td>
                              <td className={`py-3 px-4 font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {item.price > 0 ? (
                                  `${item.price.toLocaleString()}원`
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                                    가격 미정 (직접 입력)
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex flex-wrap gap-1">
                                  {item.stores.map(st => (
                                    <span key={st} className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                      {st}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span 
                                  onClick={() => openEditPending(item)}
                                  className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[10px] font-bold cursor-pointer hover:bg-amber-500/20 transition-colors inline-flex items-center gap-1"
                                  title={`어디서 수집되었는지: ${item.sourceName}`}
                                >
                                  <span>📍 {item.sourceName}</span>
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-400 font-mono text-[10px]">
                                {isNaN(new Date(item.crawledAt).getTime()) ? item.crawledAt : new Date(item.crawledAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => approvePendingProduct(item.id)}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold transition-all shadow-xs flex items-center gap-1"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>승인</span>
                                  </button>
                                  <button
                                    onClick={() => openEditPending(item)}
                                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all border ${
                                      isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                                    }`}
                                  >
                                    수정
                                  </button>
                                  <button
                                    onClick={() => setImageSelectorTarget({
                                      brand: item.brand,
                                      name: item.name,
                                      currentImage: item.image,
                                      onSelect: (newUrl: string) => {
                                        updatePendingProduct(item.id, { image: newUrl });
                                        showToast('고화질 실물 이미지로 교체되었습니다.', 'success');
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
                                    onClick={() => rejectPendingProduct(item.id)}
                                    className="px-2 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 rounded text-[11px] font-semibold border border-rose-200 dark:border-rose-900/60 transition-all flex items-center gap-0.5"
                                    title="승인 취소 (반려)"
                                  >
                                    <X className="w-3 h-3" />
                                    <span>취소</span>
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
              )}

            </div>
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
                        {filteredAdminProducts.map(prod => {
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
                                    <p className={`font-bold text-xs truncate max-w-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{prod.name}</p>
                                    <p className="text-[11px] text-slate-400">{prod.brand} · {prod.releaseDate}</p>
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
                                <div className="flex items-center gap-1 text-[11px]">
                                  <span className="text-amber-500 font-bold">★ {prod.overallRating || 0}</span>
                                  <span className="text-slate-400">({prod.ratingCount || 0})</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => toggleProductToday(prod.id)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all ${
                                    prod.isToday
                                      ? 'bg-indigo-600 text-white shadow-xs'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600'
                                  }`}
                                >
                                  <Zap className="w-3 h-3" />
                                  <span>{prod.isToday ? '오늘신상 ON' : 'OFF'}</span>
                                </button>
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => toggleProductHot(prod.id)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all ${
                                    prod.isHot
                                      ? 'bg-orange-600 text-white shadow-xs'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600'
                                  }`}
                                >
                                  <Flame className="w-3 h-3" />
                                  <span>{prod.isHot ? '인기HOT ON' : 'OFF'}</span>
                                </button>
                              </td>
                              <td className="py-3 px-4">
                                <div className="space-y-1 max-w-[170px]">
                                  <div className="flex flex-wrap gap-1">
                                    {prod.stores?.map(st => {
                                      const stockItem = prod.storeStocks?.find(s => s.store === st);
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
                                    const linkedCount = prod.storeStocks?.filter(s => !!s.appLink).length || 0;
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
                                      (prod.storeStocks?.some(s => !!s.appLink))
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
                  {filteredAdminProducts.map(prod => (
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

            </div>
          )}

          {/* ========================================================
              TAB: POINTS & USER MANAGEMENT (회원 및 포인트 관리 NEW)
             ======================================================== */}
          {activeAdminTab === 'points' && (
            <div className="space-y-6">
              
              {/* Header Card */}
              <div className={`p-6 rounded-2xl border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${cardBg}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className={`text-base font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        회원 관리 및 포인트 지급·회수 콘솔
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 font-mono font-bold">
                          POINTS PRO
                        </span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        회원별 실시간 보유 포인트를 조회하고, 리뷰 포상/이벤트 보너스 지급 및 어뷰징 회수를 안전하게 관리합니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sub Tab Switcher & Quick Refresh */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className={`flex items-center p-1 rounded-xl border text-xs ${subCardBg}`}>
                    <button
                      onClick={() => setPointsSubTab('users')}
                      className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                        pointsSubTab === 'users'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>회원별 포인트 관리 ({allProfiles.length})</span>
                    </button>
                    <button
                      onClick={() => setPointsSubTab('history')}
                      className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                        pointsSubTab === 'history'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>지급·회수 로그 ({pointTransactions.length})</span>
                    </button>
                  </div>

                  <button
                    onClick={async () => {
                      await fetchAllProfiles();
                      showToast('🔄 회원 목록 및 포인트 정보를 최신 상태로 동기화했습니다.', 'info');
                    }}
                    className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-semibold transition-all ${
                      isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                    title="회원 목록 새로고침"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 4-Column Point KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Total Members */}
                <div className={`p-4 rounded-2xl border shadow-xs flex items-center justify-between ${cardBg}`}>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">전체 등록 회원</span>
                    <div className="mt-1.5 flex items-baseline gap-1.5">
                      <span className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{allProfiles.length}</span>
                      <span className="text-xs text-slate-400">명</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">평균 보유: {avgMemberPoints.toLocaleString()}P</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-500/20">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                {/* 2. Total System Points */}
                <div className={`p-4 rounded-2xl border shadow-xs flex items-center justify-between ${cardBg}`}>
                  <div>
                    <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">총 보유 포인트 잔액</span>
                    <div className="mt-1.5 flex items-baseline gap-1.5">
                      <span className={`text-2xl font-black font-mono ${isDark ? 'text-amber-200' : 'text-amber-600'}`}>
                        {totalMemberPoints.toLocaleString()}
                      </span>
                      <span className="text-xs text-amber-500 font-bold">P</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">회원 보유 총 자산</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
                    <Coins className="w-5 h-5" />
                  </div>
                </div>

                {/* 3. Total Points Granted */}
                <div className={`p-4 rounded-2xl border shadow-xs flex items-center justify-between ${cardBg}`}>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">누적 지급 포인트</span>
                    <div className="mt-1.5 flex items-baseline gap-1.5">
                      <span className={`text-2xl font-black font-mono ${isDark ? 'text-emerald-200' : 'text-emerald-600'}`}>
                        +{totalGrantedPoints.toLocaleString()}
                      </span>
                      <span className="text-xs text-emerald-500 font-bold">P</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                      리뷰/이벤트/관리자 특별지급
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                </div>

                {/* 4. Total Points Revoked */}
                <div className={`p-4 rounded-2xl border shadow-xs flex items-center justify-between ${cardBg}`}>
                  <div>
                    <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">누적 회수 포인트</span>
                    <div className="mt-1.5 flex items-baseline gap-1.5">
                      <span className={`text-2xl font-black font-mono ${isDark ? 'text-rose-200' : 'text-rose-600'}`}>
                        -{totalRevokedPoints.toLocaleString()}
                      </span>
                      <span className="text-xs text-rose-500 font-bold">P</span>
                    </div>
                    <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                      어뷰징/오지급 정정 회수
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center border border-rose-500/20">
                    <MinusCircle className="w-5 h-5" />
                  </div>
                </div>

              </div>

              {/* ----------------------------------------------------
                  SUB-TAB 1: USERS POINT MANAGEMENT (회원별 포인트 관리)
                 ---------------------------------------------------- */}
              {pointsSubTab === 'users' && (
                <div className="space-y-4">
                  
                  {/* Toolbar & Filter */}
                  <div className={`p-4 rounded-2xl border shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 ${subCardBg}`}>
                    
                    {/* Left: Search input */}
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={pointUserSearch}
                        onChange={e => setPointUserSearch(e.target.value)}
                        placeholder="회원 닉네임, 이메일, UID 검색..."
                        className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none border ${inputBg}`}
                      />
                    </div>

                    {/* Right: Filters & Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      
                      {/* Level Filter */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-400">등급:</span>
                        <select
                          value={pointLevelFilter}
                          onChange={e => setPointLevelFilter(e.target.value)}
                          className={`px-3 py-2 rounded-xl text-xs border font-semibold ${inputBg}`}
                        >
                          <option value="전체">전체 등급</option>
                          <option value="Lv.1">Lv.1 (0~199P)</option>
                          <option value="Lv.2">Lv.2 (200~399P)</option>
                          <option value="Lv.3">Lv.3 (400~599P)</option>
                          <option value="Lv.4">Lv.4 (600~799P)</option>
                          <option value="Lv.5">Lv.5 (800~999P)</option>
                          <option value="Lv.6">Lv.6 (1,000~1,199P)</option>
                          <option value="Lv.7">Lv.7 (1,200~1,399P)</option>
                          <option value="Lv.8">Lv.8 (1,400~1,599P)</option>
                          <option value="Lv.9">Lv.9 (1,600~1,799P)</option>
                          <option value="Lv.10">Lv.10 (1,800P+)</option>
                        </select>
                      </div>

                      {/* Sort Order */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-400">정렬:</span>
                        <select
                          value={pointSortBy}
                          onChange={e => setPointSortBy(e.target.value as any)}
                          className={`px-3 py-2 rounded-xl text-xs border font-semibold ${inputBg}`}
                        >
                          <option value="points_desc">포인트 높은순 🪙</option>
                          <option value="points_asc">포인트 낮은순 🔻</option>
                          <option value="name">닉네임 가나다순</option>
                          <option value="newest">최근 가입순</option>
                        </select>
                      </div>

                    </div>
                  </div>

                  {/* Bulk Actions Floating Bar (When items are selected) */}
                  {selectedUserIds.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-indigo-600 text-white shadow-lg flex items-center justify-between animate-in slide-in-from-top-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span className="text-xs font-black">
                          {selectedUserIds.length}명의 회원이 선택되었습니다.
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleOpenBatchGrantModal}
                          className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-all active:scale-95"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>선택 회원 일괄 지급</span>
                        </button>
                        <button
                          onClick={handleOpenBatchRevokeModal}
                          className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-400 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-all active:scale-95"
                        >
                          <MinusCircle className="w-3.5 h-3.5" />
                          <span>선택 회원 일괄 회수</span>
                        </button>
                        <button
                          onClick={() => setSelectedUserIds([])}
                          className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-semibold"
                        >
                          선택 해제
                        </button>
                      </div>
                    </div>
                  )}

                  {/* User List Table */}
                  <div className={`rounded-2xl border shadow-sm overflow-hidden ${cardBg}`}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/80 text-slate-400' : 'border-slate-100 bg-slate-50/80 text-slate-500'}`}>
                            <th className="p-3.5 w-10 text-center">
                              <input
                                type="checkbox"
                                checked={filteredPointUsers.length > 0 && selectedUserIds.length === filteredPointUsers.length}
                                onChange={toggleSelectAllUsers}
                                className="rounded border-slate-300 text-indigo-600 focus:ring-0 w-4 h-4 cursor-pointer"
                              />
                            </th>
                            <th className="p-3.5 font-bold">회원 정보</th>
                            <th className="p-3.5 font-bold">회원 고유 ID (UID)</th>
                            <th className="p-3.5 font-bold text-center">등급 (Level)</th>
                            <th className="p-3.5 font-bold text-right">보유 포인트</th>
                            <th className="p-3.5 font-bold text-center">가입일</th>
                            <th className="p-3.5 font-bold text-center w-52">포인트 관리 액션</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                          {filteredPointUsers.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="p-12 text-center text-slate-400">
                                검색 조건에 해당하는 회원이 없습니다.
                              </td>
                            </tr>
                          ) : (
                            filteredPointUsers.map(user => {
                              const isSelected = selectedUserIds.includes(user.uid);
                              const isCurrentAdmin = user.uid === currentUser.uid;

                              return (
                                <tr 
                                  key={user.uid}
                                  className={`transition-colors ${
                                    isSelected 
                                      ? isDark ? 'bg-indigo-950/40' : 'bg-indigo-50/60' 
                                      : isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/60'
                                  }`}
                                >
                                  {/* Checkbox */}
                                  <td className="p-3.5 text-center">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => toggleSelectUser(user.uid)}
                                      className="rounded border-slate-300 text-indigo-600 focus:ring-0 w-4 h-4 cursor-pointer"
                                    />
                                  </td>

                                  {/* User Profile Info */}
                                  <td className="p-3.5">
                                    <div className="flex items-center gap-3">
                                      <img
                                        src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                                        alt={user.displayName}
                                        className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                      />
                                      <div>
                                        <div className="flex items-center gap-1.5">
                                          <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {user.displayName}
                                          </span>
                                          {isCurrentAdmin && (
                                            <span className="px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 text-[10px] font-bold">
                                              현재 계정
                                            </span>
                                          )}
                                        </div>
                                        <span className="text-[11px] text-slate-400 block truncate max-w-[200px]">
                                          {user.email || (user.provider ? `${user.provider} 간편회원` : '신상픽 회원')}
                                        </span>
                                      </div>
                                    </div>
                                  </td>

                                  {/* UID with copy button */}
                                  <td className="p-3.5">
                                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                                      <span className="truncate max-w-[130px]" title={user.uid}>{user.uid}</span>
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(user.uid);
                                          showToast('📋 회원 UID가 복사되었습니다.', 'info');
                                        }}
                                        className="p-1 hover:text-slate-600 dark:hover:text-slate-200"
                                        title="UID 복사"
                                      >
                                        <Copy className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </td>

                                  {/* Level */}
                                  <td className="p-3.5 text-center">
                                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                                      {user.level || 'Lv.1'}
                                    </span>
                                  </td>

                                  {/* Points */}
                                  <td className="p-3.5 text-right">
                                    <div className="inline-flex items-baseline gap-1">
                                      <span className={`text-base font-black font-mono ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>
                                        {(user.points || 0).toLocaleString()}
                                      </span>
                                      <span className="text-[11px] font-bold text-amber-500">P</span>
                                    </div>
                                  </td>

                                  {/* Created At */}
                                  <td className="p-3.5 text-center text-slate-400 text-[11px]">
                                    {user.createdAt || '2025.01.01'}
                                  </td>

                                  {/* Actions: Grant, Revoke, Details */}
                                  <td className="p-3.5 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                      
                                      {/* Grant Button */}
                                      <button
                                        onClick={() => handleOpenGrantModal(user)}
                                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 font-bold text-xs flex items-center gap-1 transition-all"
                                        title="포인트 지급하기"
                                      >
                                        <Plus className="w-3 h-3" />
                                        <span>지급</span>
                                      </button>

                                      {/* Revoke Button */}
                                      <button
                                        onClick={() => handleOpenRevokeModal(user)}
                                        className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 font-bold text-xs flex items-center gap-1 transition-all"
                                        title="포인트 회수하기"
                                      >
                                        <MinusCircle className="w-3 h-3" />
                                        <span>회수</span>
                                      </button>

                                      {/* History / Detail Button */}
                                      <button
                                        onClick={() => handleOpenUserDetailModal(user)}
                                        className={`p-1.5 rounded-lg border text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ${
                                          isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'
                                        }`}
                                        title="회원 상세 및 포인트 내역"
                                      >
                                        <History className="w-3.5 h-3.5" />
                                      </button>

                                    </div>
                                  </td>

                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* ----------------------------------------------------
                  SUB-TAB 2: POINT TRANSACTION HISTORY (지급·회수 로그)
                 ---------------------------------------------------- */}
              {pointsSubTab === 'history' && (
                <div className="space-y-4">
                  
                  {/* History Toolbar */}
                  <div className={`p-4 rounded-2xl border shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 ${subCardBg}`}>
                    
                    {/* Search input */}
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={historySearchQuery}
                        onChange={e => setHistorySearchQuery(e.target.value)}
                        placeholder="회원명, 사유, 관리자 메모 검색..."
                        className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none border ${inputBg}`}
                      />
                    </div>

                    {/* Filter by Type & JSON Download */}
                    <div className="flex items-center gap-2 flex-wrap">
                      
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-400">구분:</span>
                        <select
                          value={historyTypeFilter}
                          onChange={e => setHistoryTypeFilter(e.target.value as any)}
                          className={`px-3 py-2 rounded-xl text-xs border font-semibold ${inputBg}`}
                        >
                          <option value="all">전체 내역 ({pointTransactions.length})</option>
                          <option value="grant">🎁 포인트 지급</option>
                          <option value="revoke">🔻 포인트 회수</option>
                        </select>
                      </div>

                      <button
                        onClick={handleExportTransactionsJson}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                          isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>내역 백업 (JSON)</span>
                      </button>

                    </div>
                  </div>

                  {/* History List Table */}
                  <div className={`rounded-2xl border shadow-sm overflow-hidden ${cardBg}`}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/80 text-slate-400' : 'border-slate-100 bg-slate-50/80 text-slate-500'}`}>
                            <th className="p-3.5 font-bold w-36">거래 일시</th>
                            <th className="p-3.5 font-bold">대상 회원</th>
                            <th className="p-3.5 font-bold text-center w-28">변동 구분</th>
                            <th className="p-3.5 font-bold text-right w-32">변동 포인트</th>
                            <th className="p-3.5 font-bold text-right w-32">변동 후 잔액</th>
                            <th className="p-3.5 font-bold">지급·회수 사유</th>
                            <th className="p-3.5 font-bold">관리자 메모</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                          {filteredPointTransactions.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="p-12 text-center text-slate-400">
                                기록된 포인트 변동 내역이 없습니다.
                              </td>
                            </tr>
                          ) : (
                            filteredPointTransactions.map(tx => {
                              const isGrant = tx.type === 'grant' || tx.amount > 0;

                              return (
                                <tr key={tx.id} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/60'}>
                                  
                                  {/* Date */}
                                  <td className="p-3.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                                    {tx.createdAt}
                                  </td>

                                  {/* Target User */}
                                  <td className="p-3.5">
                                    <div className="flex items-center gap-2">
                                      {tx.userAvatar ? (
                                        <img src={tx.userAvatar} alt="" className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                                      ) : (
                                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                                          {tx.userName.slice(0, 1)}
                                        </div>
                                      )}
                                      <div>
                                        <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>{tx.userName}</span>
                                        <span className="text-[10px] text-slate-400 font-mono">{tx.userId}</span>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Type Badge */}
                                  <td className="p-3.5 text-center">
                                    {isGrant ? (
                                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                                        <Plus className="w-3 h-3" />
                                        <span>지급 완료</span>
                                      </span>
                                    ) : (
                                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 inline-flex items-center gap-1">
                                        <MinusCircle className="w-3 h-3" />
                                        <span>회수 완료</span>
                                      </span>
                                    )}
                                  </td>

                                  {/* Amount */}
                                  <td className="p-3.5 text-right font-mono font-black text-sm whitespace-nowrap">
                                    <span className={isGrant ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                                      {isGrant ? `+${Math.abs(tx.amount).toLocaleString()}` : `-${Math.abs(tx.amount).toLocaleString()}`} P
                                    </span>
                                  </td>

                                  {/* Balance After */}
                                  <td className="p-3.5 text-right font-mono text-slate-500 dark:text-slate-400 font-bold whitespace-nowrap">
                                    {tx.balanceAfter.toLocaleString()} P
                                  </td>

                                  {/* Reason */}
                                  <td className={`p-3.5 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                    {tx.reason}
                                  </td>

                                  {/* Admin Memo */}
                                  <td className="p-3.5 text-slate-400 text-[11px] italic">
                                    {tx.adminMemo || '-'}
                                  </td>

                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

            </div>
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
                                <span className="text-[10px] text-indigo-500 font-semibold">{r.userLevel}</span>
                              </div>
                              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
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

                <button
                  onClick={loadShoppingInsights}
                  disabled={isLoadingInsights}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50 ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingInsights ? 'animate-spin text-indigo-500' : 'text-slate-500'}`} />
                  <span>쇼핑인사이트 데이터 새로고침</span>
                </button>
              </div>

              {/* 2. NAVER DataLab Shopping Category Click Share Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: '과자/베이커리', color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20', defaultRatio: 84 },
                  { name: '음료', color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20', defaultRatio: 78 },
                  { name: '가공/간편식품', color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20', defaultRatio: 92 },
                  { name: '신선식품', color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20', defaultRatio: 65 },
                ].map((cat) => {
                  const matchedResult = shoppingCategoryTrends?.results?.find(r => r.title.includes(cat.name) || cat.name.includes(r.title));
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
                          className={`h-full rounded-full bg-gradient-to-r from-indigo-500 to-amber-500`}
                          style={{ width: `${currentRatio}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 3. NAVER DataLab Realtime Shopping Trending Keywords Board */}
              <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${cardBg}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
                    <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>네이버 쇼핑인사이트 실시간 급상승 신제품 키워드 TOP 8</h3>
                  </div>
                  <span className="text-[11px] text-slate-400">※ 키워드를 클릭하면 즉시 신제품을 자동 수집합니다</span>
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
                        <th className="py-2.5 px-3 text-right">수집 작업</th>
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
                                <span className="font-bold text-indigo-500">{item.score} / 100</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                                  style={{ width: `${item.score}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-emerald-500">
                            {item.growthRate}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleCollectByInsightKeyword(item.keyword)}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-white rounded-lg text-[11px] font-bold shadow-xs transition-all active:scale-95 flex items-center gap-1 ml-auto"
                            >
                              <Zap className="w-3 h-3" />
                              <span>신제품 자동 수집</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
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
                          <p className="text-xs font-bold text-amber-500 mt-1">★ {prod.overallRating || 0} <span className="text-[10px] text-slate-400">({prod.ratingCount}개)</span></p>
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
                      <img src={currentPreview.image} alt={currentPreview.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent p-5 flex flex-col justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-600 text-white font-mono shadow-sm">
                            {currentPreview.order}구좌 노출 중
                          </span>
                          {currentPreview.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/30">
                              {currentPreview.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <h4 className="text-sm md:text-base font-black text-white leading-tight">{currentPreview.title}</h4>
                            <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">{currentPreview.subtitle}</p>
                          </div>
                          <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-bold shrink-0 shadow-sm">
                            {currentPreview.buttonText} →
                          </span>
                        </div>
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
                              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center gap-1">
                                    {banner.linkUrl ? (
                                      <><ExternalLink className="w-3 h-3 text-cyan-300" /><span>웹 링크</span></>
                                    ) : banner.linkEventId ? (
                                      <><Gift className="w-3 h-3 text-pink-300" /><span>이벤트</span></>
                                    ) : banner.linkProductId ? (
                                      <><Package className="w-3 h-3 text-amber-300" /><span>상품 상세</span></>
                                    ) : banner.linkCategory ? (
                                      <><Layers className="w-3 h-3 text-indigo-300" /><span>카테고리: {banner.linkCategory}</span></>
                                    ) : (
                                      <span>기본 배너</span>
                                    )}
                                  </span>

                                  {banner.badge && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/80 text-white">
                                      {banner.badge}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <h3 className="text-sm font-black text-white leading-tight">{banner.title}</h3>
                                  <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">{banner.subtitle}</p>
                                  <span className="inline-block mt-2 px-3 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-bold">
                                    {banner.buttonText} →
                                  </span>
                                  {(banner.disclaimer || (banner.linkUrl && banner.linkUrl.includes('coupang.com'))) && (
                                    <p className="mt-1.5 text-[9px] text-amber-200/90 font-medium tracking-tight bg-black/60 px-2 py-0.5 rounded max-w-fit line-clamp-1">
                                      ※ {banner.disclaimer || '이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.'}
                                    </p>
                                  )}
                                </div>
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
                  모바일 홈 화면 하단에 노출되는 대형 투표 위젯입니다. 두 개의 라이벌 신제품을 골라 실시간 투표를 유도할 수 있습니다.
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

                    {/* Vote Percent Slider */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                        <span>A 파이터 기준 득표율 설정: <strong className="text-blue-600">{battlePercentA}%</strong></span>
                        <span>B 파이터: <strong className="text-rose-600">{100 - battlePercentA}%</strong></span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="99"
                        value={battlePercentA}
                        onChange={e => setBattlePercentA(Number(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                    </div>

                    <button
                      onClick={handleSaveBattle}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-rose-600 hover:from-blue-500 hover:to-rose-500 text-white rounded-xl text-xs font-black shadow-md transition-all active:scale-98"
                    >
                      배틀 매치업 즉시 저장 & 반영
                    </button>
                  </div>
                </div>

                {/* Right: Live Battle Showdown Arena Preview */}
                <div className={`p-6 rounded-2xl border shadow-sm space-y-6 ${cardBg}`}>
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">실시간 모바일 렌더링 미리보기</span>
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
                          <p className="text-sm font-mono font-black text-blue-600 mt-1">{battlePercentA}%</p>
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
                          <p className="text-sm font-mono font-black text-rose-600 mt-1">{100 - battlePercentA}%</p>
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
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full" style={{ width: `${battlePercentA}%` }} />
                        <div className="bg-gradient-to-r from-rose-500 to-amber-500 h-full" style={{ width: `${100 - battlePercentA}%` }} />
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">상품명 *</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="예: 꼬북칩 초코츄러스맛"
                      className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none focus:border-indigo-500 ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">제조사 / 브랜드 *</label>
                    <input
                      type="text"
                      value={productForm.brand}
                      onChange={e => setProductForm({ ...productForm, brand: e.target.value })}
                      placeholder="예: 오리온, 농심, 삼양"
                      className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none focus:border-indigo-500 ${inputBg}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">카테고리</label>
                    <select
                      value={productForm.category}
                      onChange={e => setProductForm({ ...productForm, category: e.target.value as ProductCategory })}
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
          MODAL: EDIT PENDING PRODUCT MODAL
         ======================================================== */}
      {isEditingPendingModalOpen && editingPendingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className={`rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border ${cardBg}`}>
            
            <div className={`p-5 border-b flex items-center justify-between shrink-0 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>수집된 신제품 정보 수정 후 승인</h3>
                  <p className="text-xs text-slate-400">수정 후 승인하면 정식 상품으로 즉시 등록됩니다.</p>
                </div>
              </div>
              <button onClick={() => setIsEditingPendingModalOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {(editingPendingItem.needsReview || editingPendingItem.price === 0) && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-xs">수동 확인이 필요한 수집 항목입니다 ({editingPendingItem.reviewReason || '정보 불완전'})</p>
                    <p className="text-[11px] opacity-90 mt-0.5">네이버 쇼핑 자동 매칭 및 키워드 검증 과정에서 확인이 필요한 항목입니다. 상품명, 브랜드, 실제 판매 가격(정가), 이미지를 확인하고 수정 후 승인해주세요.</p>
                  </div>
                </div>
              )}

              {/* Source & Destination Category Guide Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 border border-amber-500/30 space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📍</span>
                    <span className="text-xs font-black text-amber-800 dark:text-amber-300">
                      어디서 가져왔나요? (수집 출처):
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                      {editingPendingItem.sourceName || '공식 채널'}
                    </span>
                  </div>
                  {editingPendingItem.sourceUrl && (
                    <a
                      href={editingPendingItem.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>출처 원본 링크</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <FolderCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    어디 카테고리에 저장되나요?: 승인 시 앱의 <strong className="text-indigo-600 dark:text-indigo-400 underline font-black">[{editingPendingItem.category}]</strong> 카테고리 탭 및 메인 홈에 등록됩니다. (아래 선택창에서 변경 가능)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">상품명 *</label>
                  <input
                    type="text"
                    value={editingPendingItem.name}
                    onChange={e => setEditingPendingItem({ ...editingPendingItem, name: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">제조사 / 브랜드 *</label>
                  <input
                    type="text"
                    value={editingPendingItem.brand}
                    onChange={e => setEditingPendingItem({ ...editingPendingItem, brand: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">카테고리</label>
                  <select
                    value={editingPendingItem.category}
                    onChange={e => setEditingPendingItem({ ...editingPendingItem, category: e.target.value as ProductCategory })}
                    className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                  >
                    {CATEGORIES.filter(c => c !== '전체').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">가격 (원) {editingPendingItem.price === 0 && <span className="text-amber-600 text-[10px] font-bold">⚠️ 가격 입력 필요</span>}</label>
                  <input
                    type="number"
                    value={editingPendingItem.price}
                    onChange={e => setEditingPendingItem({ ...editingPendingItem, price: Number(e.target.value) })}
                    placeholder="실제 판매가 입력"
                    className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">출시일</label>
                  <input
                    type="text"
                    value={editingPendingItem.releaseDate}
                    onChange={e => setEditingPendingItem({ ...editingPendingItem, releaseDate: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                  />
                </div>
              </div>

              {/* 용량 / 칼로리 / 식약처 영양성분 자동조회 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-200 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>영양성분 및 규격 정보</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setNutritionSearchTarget({
                      initialQuery: editingPendingItem.name || editingPendingItem.brand,
                      brand: editingPendingItem.brand,
                      onSelect: (data: FoodNutritionData) => {
                        setEditingPendingItem(prev => prev ? ({
                          ...prev,
                          calories: data.calories || prev.calories,
                          volume: data.totalWeight || data.servingSize || prev.volume,
                          manufacturer: prev.manufacturer || data.makerName,
                          nutrition: data.nutrition
                        }) : null);
                        showToast(`식약처 공식 영양성분(${data.foodName}, ${data.calories}kcal)이 자동 적용되었습니다!`, 'success');
                      }
                    })}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 transition-all"
                  >
                    <Search className="w-3 h-3" />
                    <span>식약처 영양성분 자동조회</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">용량 (g/ml)</label>
                    <input
                      type="text"
                      value={editingPendingItem.volume || ''}
                      onChange={e => setEditingPendingItem({ ...editingPendingItem, volume: e.target.value })}
                      placeholder="예: 80g"
                      className={`w-full p-2 rounded-xl border text-xs ${inputBg}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">칼로리 (kcal)</label>
                    <input
                      type="number"
                      value={editingPendingItem.calories || ''}
                      onChange={e => setEditingPendingItem({ ...editingPendingItem, calories: Number(e.target.value) })}
                      placeholder="예: 350"
                      className={`w-full p-2 rounded-xl border text-xs ${inputBg}`}
                    />
                  </div>
                </div>

                {editingPendingItem.nutrition && (
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex flex-wrap gap-2 text-[10px] text-emerald-800 dark:text-emerald-300">
                    <span className="font-bold">연동된 영양표시:</span>
                    <span>탄수 {editingPendingItem.nutrition.carbs || '0g'}</span>
                    <span>당류 {editingPendingItem.nutrition.sugar || '0g'}</span>
                    <span>단백질 {editingPendingItem.nutrition.protein || '0g'}</span>
                    <span>지방 {editingPendingItem.nutrition.fat || '0g'}</span>
                    <span>나트륨 {editingPendingItem.nutrition.sodium || '0mg'}</span>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-600 dark:text-slate-300">이미지 URL</label>
                  <button
                    type="button"
                    onClick={() => setImageSelectorTarget({
                      brand: editingPendingItem.brand,
                      name: editingPendingItem.name,
                      currentImage: editingPendingItem.image,
                      onSelect: (newUrl: string) => {
                        setEditingPendingItem({ ...editingPendingItem, image: newUrl });
                        showToast('선택한 고화질 이미지가 적용되었습니다.', 'success');
                      }
                    })}
                    className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1 transition-all"
                  >
                    <Search className="w-3 h-3" />
                    <span>네이버 쇼핑/공식몰 고화질 이미지 찾기</span>
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  {editingPendingItem.image && (
                    <img src={editingPendingItem.image} alt={editingPendingItem.name} className="w-11 h-11 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100" />
                  )}
                  <input
                    type="text"
                    value={editingPendingItem.image}
                    onChange={e => setEditingPendingItem({ ...editingPendingItem, image: e.target.value })}
                    placeholder="이미지 URL 입력 또는 우측 검색 버튼 사용"
                    className={`w-full p-2.5 rounded-xl border font-mono ${inputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">상품 설명</label>
                <textarea
                  rows={2}
                  value={editingPendingItem.description}
                  onChange={e => setEditingPendingItem({ ...editingPendingItem, description: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                />
              </div>
            </div>

            <div className={`p-4 border-t flex items-center justify-end gap-2 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <button
                onClick={() => setIsEditingPendingModalOpen(false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}
              >
                취소
              </button>
              <button
                onClick={() => {
                  updatePendingProduct(editingPendingItem.id, {
                    ...editingPendingItem,
                    needsReview: false,
                    reviewReason: undefined
                  });
                  setIsEditingPendingModalOpen(false);
                  showToast('대기 항목 수정사항이 저장되었습니다.', 'info');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                수정 저장 (대기 유지)
              </button>
              <button
                onClick={() => {
                  const cleanedItem = {
                    ...editingPendingItem,
                    needsReview: false,
                    reviewReason: undefined
                  };
                  updatePendingProduct(editingPendingItem.id, cleanedItem);
                  approvePendingProduct(editingPendingItem.id);
                  setIsEditingPendingModalOpen(false);
                  showToast(`'${editingPendingItem.name}' 상품이 승인되었습니다.`, 'success');
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-sm"
              >
                수정 완료 및 즉시 승인
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
                  <p className="text-xs text-slate-400">모바일 홈 화면 상단 캐러셀에 표시될 배너 콘텐츠입니다.</p>
                </div>
              </div>
              <button onClick={() => setIsBannerModalOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Form */}
              <div className="space-y-4 text-xs">
                {/* 0. Slot Order & Badge */}
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
                      상단 뱃지 문구 (선택)
                    </label>
                    <input
                      type="text"
                      value={bannerForm.badge || ''}
                      onChange={e => setBannerForm({ ...bannerForm, badge: e.target.value })}
                      placeholder="예: 🥖 빵지순례 오픈"
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                </div>

                {/* 1. Title */}
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">배너 메인 제목 *</label>
                  <input
                    type="text"
                    value={bannerForm.title}
                    onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })}
                    placeholder="예: 꼬북칩 신상 100인 체험단 모집"
                    className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                  />
                </div>

                {/* 2. Subtitle */}
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">서브 설명 문구</label>
                  <input
                    type="text"
                    value={bannerForm.subtitle}
                    onChange={e => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                    placeholder="예: 벨기에산 리얼 초콜릿의 깊고 진한 맛을 가장 먼저 만나보세요"
                    className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                  />
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
                    <div className="grid grid-cols-5 gap-1.5 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
                      {[
                        { type: 'url' as BannerLinkType, label: '웹 주소' },
                        { type: 'event' as BannerLinkType, label: '이벤트' },
                        { type: 'product' as BannerLinkType, label: '상품' },
                        { type: 'category' as BannerLinkType, label: '카테고리' },
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
                       bannerForm.linkType === 'none' ? '🚫 연결 없음' :
                       '🏷️ 카테고리 탭'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {bannerForm.linkType === 'url' ? (bannerForm.linkUrl || '(URL 미입력)') :
                     bannerForm.linkType === 'event' ? (events.find(e => e.id === bannerForm.linkEventId)?.title || bannerForm.linkEventId || '선택된 이벤트 없음') :
                     bannerForm.linkType === 'product' ? (products.find(p => p.id === bannerForm.linkProductId)?.name || bannerForm.linkProductId || '선택된 상품 없음') :
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
          MODAL 1: POINT GRANT MODAL (포인트 지급 모달)
         ======================================================== */}
      {isGrantModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden my-8 ${modalBg}`}>
            
            {/* Modal Header */}
            <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-100 bg-emerald-50/50'}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-sm font-black flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    포인트 지급 (Grant Points)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isBatchMode 
                      ? `선택된 ${selectedUserIds.length}명의 회원에게 일괄 포인트를 지급합니다.`
                      : `${targetPointUser?.displayName} 회원님께 포인트를 직접 지급합니다.`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsGrantModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              
              {/* Target User Info Banner */}
              {!isBatchMode && targetPointUser ? (
                <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2.5">
                    <img
                      src={targetPointUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">{targetPointUser.displayName}</span>
                        <span className="px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 text-[10px] font-bold">
                          {targetPointUser.level || 'Lv.1'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{targetPointUser.uid}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">현재 잔액</span>
                    <span className="font-mono font-black text-sm text-amber-500">
                      {(targetPointUser.points || 0).toLocaleString()} P
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Users className="w-4 h-4 shrink-0" />
                  <span className="font-bold">
                    선택된 총 {selectedUserIds.length}명 회원 모두에게 동일한 포인트가 각각 지급됩니다.
                  </span>
                </div>
              )}

              {/* Amount Input & Quick Chips */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  지급할 포인트 금액 (P) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    step={10}
                    value={pointAmountInput || ''}
                    onChange={e => setPointAmountInput(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    placeholder="예: 500"
                    className={`w-full p-3 rounded-2xl border font-mono font-black text-base text-emerald-600 dark:text-emerald-400 pl-4 pr-10 ${inputBg}`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">P</span>
                </div>

                {/* Quick Preset Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {[100, 300, 500, 1000, 3000, 5000, 10000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setPointAmountInput(amt)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                        pointAmountInput === amt
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : isDark
                            ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      +{amt.toLocaleString()}P
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason Preset Selection */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  지급 사유 선택 *
                </label>
                <select
                  value={pointReasonPreset}
                  onChange={e => setPointReasonPreset(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border font-medium ${inputBg}`}
                >
                  <option value="우수 리뷰어 베스트 픽 선정 보상">⭐ 우수 리뷰어 베스트 픽 선정 보상</option>
                  <option value="체험단 성실 리뷰 미션 완수 포상">🎁 체험단 성실 리뷰 미션 완수 포상</option>
                  <option value="신제품 제보 채택 감사 보너스">🔍 신제품 제보 채택 감사 보너스</option>
                  <option value="이벤트 당첨 특별 포인트 보상">🎉 이벤트 당첨 특별 포인트 보상</option>
                  <option value="출석체크/미션 달성 보너스">📅 출석체크 / 미션 달성 보너스</option>
                  <option value="시스템 오류/장애 보상 지급">🛠️ 시스템 오류/장애 보상 지급</option>
                  <option value="직접 입력">✍️ 직접 입력</option>
                </select>

                {pointReasonPreset === '직접 입력' && (
                  <input
                    type="text"
                    value={pointReasonCustom}
                    onChange={e => setPointReasonCustom(e.target.value)}
                    placeholder="지급 사유를 직접 입력해주세요..."
                    className={`w-full p-2.5 rounded-xl border mt-2 ${inputBg}`}
                  />
                )}
              </div>

              {/* Admin Internal Memo */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  관리자 내부 메모 (선택사항)
                </label>
                <input
                  type="text"
                  value={pointAdminMemo}
                  onChange={e => setPointAdminMemo(e.target.value)}
                  placeholder="예: 3월 1주차 프로모션 이벤트 당첨자 지급 건"
                  className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                />
              </div>

              {/* Live Preview Box */}
              {!isBatchMode && targetPointUser && (
                <div className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${isDark ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' : 'bg-emerald-50/70 border-emerald-200 text-emerald-800'}`}>
                  <span className="font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>지급 후 예상 잔액</span>
                  </span>
                  <div className="flex items-center justify-between font-mono pt-1">
                    <span className="text-slate-500">현재 {(targetPointUser.points || 0).toLocaleString()} P</span>
                    <span>➡️</span>
                    <span className="font-black text-sm text-emerald-600 dark:text-emerald-300">
                      {((targetPointUser.points || 0) + (pointAmountInput || 0)).toLocaleString()} P
                    </span>
                    <span className="font-bold text-[10px] text-emerald-500">(+{pointAmountInput.toLocaleString()}P)</span>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Actions */}
            <div className={`p-4 border-t flex items-center justify-end gap-2 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'}`}>
              <button
                type="button"
                onClick={() => setIsGrantModalOpen(false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmGrant}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{pointAmountInput.toLocaleString()}P 지급 확정</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: POINT REVOKE MODAL (포인트 회수 모달)
         ======================================================== */}
      {isRevokeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden my-8 ${modalBg}`}>
            
            {/* Modal Header */}
            <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-100 bg-rose-50/50'}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center border border-rose-500/20">
                  <MinusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-sm font-black flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    포인트 회수·차감 (Revoke Points)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isBatchMode 
                      ? `선택된 ${selectedUserIds.length}명의 회원으로부터 일괄 포인트를 회수합니다.`
                      : `${targetPointUser?.displayName} 회원님의 포인트를 안전하게 차감/회수합니다.`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRevokeModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              
              {/* Target User Info Banner */}
              {!isBatchMode && targetPointUser ? (
                <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2.5">
                    <img
                      src={targetPointUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">{targetPointUser.displayName}</span>
                        <span className="px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 text-[10px] font-bold">
                          {targetPointUser.level || 'Lv.1'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{targetPointUser.uid}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">현재 잔액</span>
                    <span className="font-mono font-black text-sm text-amber-500">
                      {(targetPointUser.points || 0).toLocaleString()} P
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span className="font-bold">
                    선택된 총 {selectedUserIds.length}명 회원 각자로부터 해당 포인트가 차감됩니다 (최대 보유한도 내).
                  </span>
                </div>
              )}

              {/* Amount Input & Quick Chips */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  회수할 포인트 금액 (P) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    step={10}
                    value={pointAmountInput || ''}
                    onChange={e => setPointAmountInput(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    placeholder="예: 100"
                    className={`w-full p-3 rounded-2xl border font-mono font-black text-base text-rose-600 dark:text-rose-400 pl-4 pr-10 ${inputBg}`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">P</span>
                </div>

                {/* Quick Preset Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {[100, 300, 500, 1000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setPointAmountInput(amt)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                        pointAmountInput === amt
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : isDark
                            ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      -{amt.toLocaleString()}P
                    </button>
                  ))}
                  {!isBatchMode && targetPointUser && (
                    <button
                      type="button"
                      onClick={() => setPointAmountInput(targetPointUser.points || 0)}
                      className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-rose-500/10 border border-rose-500/20 text-rose-600 hover:bg-rose-500 hover:text-white transition-all"
                    >
                      전액 회수 ({(targetPointUser.points || 0).toLocaleString()}P)
                    </button>
                  )}
                </div>
              </div>

              {/* Reason Preset Selection */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  회수 사유 선택 *
                </label>
                <select
                  value={pointReasonPreset}
                  onChange={e => setPointReasonPreset(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border font-medium ${inputBg}`}
                >
                  <option value="어뷰징/중복 도배 리뷰 삭제로 인한 포인트 회수">🚫 어뷰징/중복 도배 리뷰 삭제로 인한 포인트 회수</option>
                  <option value="주문/체험단 신청 취소에 따른 포인트 회수">📦 주문/체험단 신청 취소에 따른 포인트 회수</option>
                  <option value="오지급 포인트 정정 회수">🔧 오지급 포인트 정정 회수</option>
                  <option value="부정 활동/비정상 행위 제재 차감">⚠️ 부정 활동/비정상 행위 제재 차감</option>
                  <option value="직접 입력">✍️ 직접 입력</option>
                </select>

                {pointReasonPreset === '직접 입력' && (
                  <input
                    type="text"
                    value={pointReasonCustom}
                    onChange={e => setPointReasonCustom(e.target.value)}
                    placeholder="회수 사유를 직접 입력해주세요..."
                    className={`w-full p-2.5 rounded-xl border mt-2 ${inputBg}`}
                  />
                )}
              </div>

              {/* Admin Internal Memo */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  관리자 내부 메모 (선택사항)
                </label>
                <input
                  type="text"
                  value={pointAdminMemo}
                  onChange={e => setPointAdminMemo(e.target.value)}
                  placeholder="예: 어뷰징 도배 게시글 3건 삭제 처리 후 회수"
                  className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                />
              </div>

              {/* Live Preview Box */}
              {!isBatchMode && targetPointUser && (
                <div className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${isDark ? 'bg-rose-950/20 border-rose-900/40 text-rose-300' : 'bg-rose-50/70 border-rose-200 text-rose-800'}`}>
                  <span className="font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                    <span>회수 후 예상 잔액 (마이너스 방지 보호)</span>
                  </span>
                  <div className="flex items-center justify-between font-mono pt-1">
                    <span className="text-slate-500">현재 {(targetPointUser.points || 0).toLocaleString()} P</span>
                    <span>➡️</span>
                    <span className="font-black text-sm text-rose-600 dark:text-rose-300">
                      {Math.max(0, (targetPointUser.points || 0) - (pointAmountInput || 0)).toLocaleString()} P
                    </span>
                    <span className="font-bold text-[10px] text-rose-500">
                      (-{Math.min(targetPointUser.points || 0, pointAmountInput || 0).toLocaleString()}P)
                    </span>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Actions */}
            <div className={`p-4 border-t flex items-center justify-end gap-2 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'}`}>
              <button
                type="button"
                onClick={() => setIsRevokeModalOpen(false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-all active:scale-95"
              >
                <MinusCircle className="w-4 h-4" />
                <span>{pointAmountInput.toLocaleString()}P 회수 확정</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: USER DETAIL & TRANSACTION HISTORY MODAL (회원 상세 내역)
         ======================================================== */}
      {isUserDetailModalOpen && targetPointUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden my-8 ${modalBg}`}>
            
            {/* Modal Header */}
            <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-100 bg-slate-50/50'}`}>
              <div className="flex items-center gap-3">
                <img
                  src={targetPointUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt=""
                  className="w-11 h-11 rounded-full object-cover border-2 border-indigo-500/30 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {targetPointUser.displayName}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 text-xs font-bold border border-indigo-500/20">
                      {targetPointUser.level || 'Lv.1'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{targetPointUser.uid}</span>
                </div>
              </div>
              <button
                onClick={() => setIsUserDetailModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              
              {/* Profile Summary Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className={`p-3.5 rounded-2xl border text-center ${cardBg}`}>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">현재 보유 잔액</span>
                  <span className="text-lg font-black font-mono text-amber-500 mt-1 block">
                    {(targetPointUser.points || 0).toLocaleString()} P
                  </span>
                </div>
                <div className={`p-3.5 rounded-2xl border text-center ${cardBg}`}>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">계정 종류</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1.5 block truncate">
                    {targetPointUser.email || (targetPointUser.provider ? `${targetPointUser.provider} 계정` : '일반 회원')}
                  </span>
                </div>
                <div className={`p-3.5 rounded-2xl border text-center ${cardBg}`}>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">가입 일자</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1.5 block">
                    {targetPointUser.createdAt || '2025.01.01'}
                  </span>
                </div>
              </div>

              {/* Action Buttons for this user */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsUserDetailModalOpen(false);
                    handleOpenGrantModal(targetPointUser);
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>이 회원에게 포인트 지급</span>
                </button>
                <button
                  onClick={() => {
                    setIsUserDetailModalOpen(false);
                    handleOpenRevokeModal(targetPointUser);
                  }}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
                >
                  <MinusCircle className="w-4 h-4" />
                  <span>이 회원에게서 포인트 회수</span>
                </button>
              </div>

              {/* Timeline of User's Point Transactions */}
              <div className="space-y-3">
                <h4 className="font-black text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-indigo-500" />
                  <span>개인 포인트 변동 타임라인</span>
                </h4>

                {pointTransactions.filter(tx => tx.userId === targetPointUser.uid).length === 0 ? (
                  <div className={`p-8 rounded-2xl border text-center text-slate-400 ${cardBg}`}>
                    기록된 개별 거래 내역이 없습니다.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pointTransactions
                      .filter(tx => tx.userId === targetPointUser.uid)
                      .map(tx => {
                        const isGrant = tx.type === 'grant' || tx.amount > 0;

                        return (
                          <div
                            key={tx.id}
                            className={`p-3 rounded-2xl border flex items-center justify-between ${cardBg}`}
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.2 rounded-md text-[10px] font-bold ${
                                  isGrant 
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                }`}>
                                  {isGrant ? '지급' : '회수'}
                                </span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{tx.reason}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 block">{tx.createdAt} {tx.adminMemo ? `• ${tx.adminMemo}` : ''}</span>
                            </div>

                            <div className="text-right font-mono">
                              <span className={`text-sm font-black block ${
                                isGrant ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                              }`}>
                                {isGrant ? `+${Math.abs(tx.amount).toLocaleString()}` : `-${Math.abs(tx.amount).toLocaleString()}`} P
                              </span>
                              <span className="text-[10px] text-slate-400">잔여: {tx.balanceAfter.toLocaleString()}P</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex items-center justify-end ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'}`}>
              <button
                onClick={() => setIsUserDetailModalOpen(false)}
                className={`px-5 py-2 rounded-xl text-xs font-bold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}
              >
                닫기
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
