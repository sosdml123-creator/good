import React, { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { ProductCategory, BannerItem, Product, PendingProduct } from '../../types';
import { CATEGORIES } from '../../data/mockProducts';

type AdminTab = 'overview' | 'approval' | 'products' | 'banners' | 'battle' | 'data';

export const AdminDashboard: React.FC = () => {
  const { 
    banners, 
    products, 
    battleConfig,
    reviews,
    communityPosts,
    addBanner, 
    updateBanner, 
    deleteBanner, 
    toggleBannerActive,
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
    updatePendingProduct,
    clearAllPendingProducts
  } = useApp();

  // Desktop active tab
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('overview');

  // Approval / Crawler tab states
  const [crawlerSearchQuery, setCrawlerSearchQuery] = useState('');
  const [selectedPendingIds, setSelectedPendingIds] = useState<string[]>([]);
  const [pendingCategoryFilter, setPendingCategoryFilter] = useState<ProductCategory | '전체'>('전체');
  const [pendingSourceFilter, setPendingSourceFilter] = useState<string>('전체');
  const [isEditingPendingModalOpen, setIsEditingPendingModalOpen] = useState(false);
  const [editingPendingItem, setEditingPendingItem] = useState<PendingProduct | null>(null);

  // Products tab states
  const [productViewMode, setProductViewMode] = useState<'table' | 'grid'>('table');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<ProductCategory | '전체'>('전체');
  const [productFilterBadge, setProductFilterBadge] = useState<'all' | 'today' | 'hot'>('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
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
    isToday: boolean;
    isHot: boolean;
    ingredients: string;
    allergens: string;
    origin: string;
    manufacturer: string;
  }>({
    name: '',
    brand: '',
    category: '신제품',
    subCategory: '',
    price: 2000,
    discountRate: 0,
    releaseDate: '2026.09 출시',
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80',
    description: '',
    calories: 350,
    volume: '80g',
    stores: ['CU', 'GS25'],
    isToday: true,
    isHot: false,
    ingredients: '',
    allergens: '',
    origin: '대한민국',
    manufacturer: ''
  });

  // Banners tab states
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerForm, setBannerForm] = useState<{
    image: string;
    badge: string;
    title: string;
    subtitle: string;
    buttonText: string;
    linkCategory: ProductCategory;
    isActive: boolean;
  }>({
    image: 'https://images.unsplash.com/photo-1595158364153-23961fa633df?w=800&auto=format&fit=crop&q=80',
    badge: '먹거리 전체 탐색 & 평가',
    title: '신제품부터 산지직송 제철 먹거리까지',
    subtitle: '솔직한 먹거리 품목별 랭킹',
    buttonText: '인기 품목 둘러보기',
    linkCategory: '과일',
    isActive: true,
  });

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

  // Statistics
  const todayProductsCount = products.filter(p => p.isToday).length;
  const hotProductsCount = products.filter(p => p.isHot).length;
  const activeBannersCount = banners.filter(b => b.isActive).length;

  // Filtered pending products
  const filteredPendingProducts = pendingProducts.filter(item => {
    if (item.status !== 'pending') return false;
    if (pendingCategoryFilter !== '전체' && item.category !== pendingCategoryFilter) return false;
    if (pendingSourceFilter !== '전체' && !item.sourceName.includes(pendingSourceFilter)) return false;
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
    selectedPendingIds.forEach(id => approvePendingProduct(id));
    setSelectedPendingIds([]);
    showToast(`${selectedPendingIds.length}개 상품이 승인 등록되었습니다!`, 'success');
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
      isToday: true,
      isHot: false,
      ingredients: '',
      allergens: '',
      origin: '대한민국',
      manufacturer: ''
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
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
      stores: prod.stores || ['CU'],
      isToday: !!prod.isToday,
      isHot: !!prod.isHot,
      ingredients: prod.ingredients || '',
      allergens: prod.allergens ? prod.allergens.join(', ') : '',
      origin: prod.origin || '대한민국',
      manufacturer: prod.manufacturer || ''
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (!productForm.name.trim() || !productForm.brand.trim()) {
      showToast('상품명과 브랜드를 입력해주세요.', 'error');
      return;
    }

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
      isToday: productForm.isToday,
      isHot: productForm.isHot,
      ingredients: productForm.ingredients,
      allergens: productForm.allergens ? productForm.allergens.split(',').map(s => s.trim()).filter(Boolean) : [],
      origin: productForm.origin,
      manufacturer: productForm.manufacturer
    };

    if (editingProductId) {
      updateProduct(editingProductId, payload);
      showToast('상품 정보가 성공적으로 수정되었습니다.', 'success');
    } else {
      addProduct(payload);
      showToast('새 상품이 성공적으로 등록되었습니다.', 'success');
    }
    setIsProductModalOpen(false);
  };

  // Banner modal helpers
  const handleOpenNewBanner = () => {
    setEditingBannerId(null);
    setBannerForm({
      image: 'https://images.unsplash.com/photo-1595158364153-23961fa633df?w=800&auto=format&fit=crop&q=80',
      badge: '⚡ 신상 기획전',
      title: '이번 주 신제품 모아보기',
      subtitle: '새로나온 핫아이템 총집합',
      buttonText: '바로가기',
      linkCategory: '신제품',
      isActive: true,
    });
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBanner = (banner: BannerItem) => {
    setEditingBannerId(banner.id);
    setBannerForm({
      image: banner.image,
      badge: banner.badge,
      title: banner.title,
      subtitle: banner.subtitle,
      buttonText: banner.buttonText,
      linkCategory: banner.linkCategory || '신제품',
      isActive: banner.isActive,
    });
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = () => {
    if (!bannerForm.title.trim()) {
      showToast('배너 제목을 입력해주세요.', 'error');
      return;
    }
    if (editingBannerId) {
      updateBanner(editingBannerId, bannerForm);
      showToast('배너가 수정되었습니다.', 'success');
    } else {
      addBanner(bannerForm);
      showToast('새 배너가 추가되었습니다.', 'success');
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

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 antialiased overflow-hidden font-sans">
      
      {/* ================= DESKTOP LEFT SIDEBAR ================= */}
      <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none z-20">
        
        {/* Top Branding */}
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-black text-sm tracking-tight text-white flex items-center gap-1.5">
                  신상픽 <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 uppercase font-mono">PC SaaS</span>
                </h1>
                <p className="text-[11px] text-slate-400">통합 관리자 콘솔</p>
              </div>
            </div>
          </div>

          {/* Database Connection Status Card */}
          <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'}`} />
                <span className="text-xs font-semibold text-slate-300">
                  {isSupabaseConnected ? 'Supabase 실시간 동기화' : '로컬 브라우저 저장소'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">v2.4 Pro</span>
            </div>
          </div>

          {/* Main Navigation Tabs */}
          <nav className="p-3 space-y-1">
            
            {/* 1. Overview */}
            <button
              onClick={() => setActiveAdminTab('overview')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === 'overview'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4" />
                <span>대시보드 개요</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeAdminTab === 'overview' ? 'rotate-90 text-white' : 'text-slate-600'}`} />
            </button>

            {/* 2. Approval / Crawler Inbox */}
            <button
              onClick={() => setActiveAdminTab('approval')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === 'approval'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>신제품 수집·승인</span>
              </div>
              {pendingCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                  {pendingCount}
                </span>
              ) : (
                <span className="text-[10px] text-slate-600">0</span>
              )}
            </button>

            {/* 3. Products Management */}
            <button
              onClick={() => setActiveAdminTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === 'products'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>상품 및 신상 관리</span>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-300 font-mono">
                {products.length}
              </span>
            </button>

            {/* 4. Banners */}
            <button
              onClick={() => setActiveAdminTab('banners')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === 'banners'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>홈 배너 관리</span>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-300 font-mono">
                {banners.length}
              </span>
            </button>

            {/* 5. Battle Matchup */}
            <button
              onClick={() => setActiveAdminTab('battle')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === 'battle'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Swords className="w-4 h-4 text-rose-400" />
                <span>신상 배틀 설정</span>
              </div>
            </button>

            {/* 6. Data & Settings */}
            <button
              onClick={() => setActiveAdminTab('data')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === 'data'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>데이터 & 동기화</span>
              </div>
            </button>

          </nav>
        </div>

        {/* Sidebar Bottom: Return to Mobile Service & Profile */}
        <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-900/70">
          {/* Direct Switcher back to User Mobile App View */}
          <button
            onClick={() => setActiveTab('home')}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 hover:from-indigo-500/30 hover:to-blue-500/30 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-indigo-500/10 active:scale-98"
          >
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <span>📱 모바일 앱 화면으로 전환</span>
          </button>

          {/* Admin User Info */}
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-xs text-indigo-400">
              AD
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">최고관리자 (Admin)</p>
              <p className="text-[10px] text-slate-500 truncate">master@sinsangpick.com</p>
            </div>
          </div>
        </div>

      </aside>

      {/* ================= DESKTOP MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-950">
        
        {/* Desktop Sticky Header Bar */}
        <header className="h-16 px-8 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex items-center justify-between shrink-0 z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">신상픽 관리자</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="font-bold text-white">
              {activeAdminTab === 'overview' && '📊 대시보드 개요 및 핵심 지표'}
              {activeAdminTab === 'approval' && '⚡ 신제품 자동 수집 파이프라인 & 승인함'}
              {activeAdminTab === 'products' && '📦 상품 및 신제품 전체 데이터베이스'}
              {activeAdminTab === 'banners' && '🖼️ 모바일 메인 홈 배너 관리'}
              {activeAdminTab === 'battle' && '🥊 신상 배틀 실시간 맞대결 설정'}
              {activeAdminTab === 'data' && '💾 데이터 백업 및 데이터베이스 설정'}
            </span>
          </div>

          {/* Quick Metrics Bar & Top Actions */}
          <div className="flex items-center gap-4">
            
            {/* Live Stats Chips */}
            <div className="hidden lg:flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
                총 상품 <strong className="text-white font-mono">{products.length}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800/50 text-indigo-300">
                오늘신상 <strong className="text-indigo-200 font-mono">{todayProductsCount}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-orange-950/60 border border-orange-800/50 text-orange-300">
                인기HOT <strong className="text-orange-200 font-mono">{hotProductsCount}</strong>
              </span>
              {pendingCount > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-300 animate-pulse font-bold">
                  승인대기 <strong className="text-rose-200 font-mono">{pendingCount}</strong>
                </span>
              )}
            </div>

            {/* Quick Action Button */}
            {activeAdminTab === 'products' ? (
              <button
                onClick={handleOpenNewProduct}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>상품 직접 등록</span>
              </button>
            ) : activeAdminTab === 'banners' ? (
              <button
                onClick={handleOpenNewBanner}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>새 배너 추가</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('home')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
              >
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
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
              
              {/* 1. 4-Column Large KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                
                {/* Total Products */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">전체 등록 상품</span>
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                      <Package className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white font-mono">{products.length}</span>
                    <span className="text-xs text-slate-400">개 등록됨</span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>편의점·식품사 통합 카탈로그</span>
                    <button onClick={() => setActiveAdminTab('products')} className="text-blue-400 hover:underline flex items-center gap-0.5">
                      관리하기 <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Today's New Products */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-slate-900/60 border border-indigo-800/40 shadow-xl relative overflow-hidden group hover:border-indigo-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">오늘의 출시 신상</span>
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                      <Zap className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-indigo-200 font-mono">{todayProductsCount}</span>
                    <span className="text-xs text-indigo-300">개 활성 노출 중</span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-indigo-900/40 flex items-center justify-between text-xs text-indigo-300">
                    <span>홈 화면 상단 & 신제품 탭 노출</span>
                    <button onClick={() => { setProductFilterBadge('today'); setActiveAdminTab('products'); }} className="text-indigo-400 hover:underline flex items-center gap-0.5">
                      보기 <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Hot Products */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-orange-950/40 to-slate-900/60 border border-orange-800/40 shadow-xl relative overflow-hidden group hover:border-orange-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-300 uppercase tracking-wider">인기 HOT 급상승</span>
                    <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
                      <Flame className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-orange-200 font-mono">{hotProductsCount}</span>
                    <span className="text-xs text-orange-300">개 상품</span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-orange-900/40 flex items-center justify-between text-xs text-orange-300">
                    <span>리뷰·평점 우수 먹거리</span>
                    <button onClick={() => { setProductFilterBadge('hot'); setActiveAdminTab('products'); }} className="text-orange-400 hover:underline flex items-center gap-0.5">
                      보기 <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Pending Approval */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-950/40 to-slate-900/60 border border-amber-800/40 shadow-xl relative overflow-hidden group hover:border-amber-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">신제품 승인 대기함</span>
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-amber-200 font-mono">{pendingCount}</span>
                    <span className="text-xs text-amber-300">개 검토 필요</span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-amber-900/40 flex items-center justify-between text-xs text-amber-300">
                    <span>자동 크롤러 수집 데이터</span>
                    <button onClick={() => setActiveAdminTab('approval')} className="text-amber-400 hover:underline flex items-center gap-0.5 font-bold">
                      검토·승인하기 <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>

              {/* 2. Middle Row: Battle Arena Live Card + Pending Quick Action */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Battle Matchup Status Card */}
                <div className="xl:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                        <Swords className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-sm font-black text-white">{battleConfig.title}</h2>
                        <p className="text-xs text-slate-400">{battleConfig.subtitle}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveAdminTab('battle')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 border border-slate-700 flex items-center gap-1"
                    >
                      배틀 매치업 수정 <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Arena Preview */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    {/* Contender A */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
                      <img src={prodA?.image} alt={prodA?.name} className="w-14 h-14 object-cover rounded-lg shrink-0 border border-slate-700" />
                      <div className="min-w-0">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {battleConfig.labelA}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate mt-1">{prodA?.name}</h4>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">{battleConfig.percentA}% 득표율</p>
                      </div>
                    </div>

                    {/* Contender B */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
                      <img src={prodB?.image} alt={prodB?.name} className="w-14 h-14 object-cover rounded-lg shrink-0 border border-slate-700" />
                      <div className="min-w-0">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {battleConfig.labelB}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate mt-1">{prodB?.name}</h4>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">{100 - battleConfig.percentA}% 득표율</p>
                      </div>
                    </div>
                  </div>

                  {/* Gauge Bar */}
                  <div className="pt-2">
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full transition-all" style={{ width: `${battleConfig.percentA}%` }} />
                      <div className="bg-gradient-to-r from-rose-500 to-amber-500 h-full transition-all" style={{ width: `${100 - battleConfig.percentA}%` }} />
                    </div>
                  </div>
                </div>

                {/* Banner & Sync Quick Card */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-400" />
                        <span>메인 홈 배너 현황</span>
                      </h3>
                      <span className="text-xs text-slate-400">{activeBannersCount}개 활성 중</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">모바일 첫 화면 상단 캐러셀에 실시간 노출되는 프로모션 배너입니다.</p>

                    <div className="mt-4 space-y-2">
                      {banners.slice(0, 3).map((b, idx) => (
                        <div key={b.id} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center font-mono font-bold text-[10px] text-slate-400">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-slate-200 truncate">{b.title}</span>
                          </div>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${b.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'}`}>
                            {b.isActive ? '노출중' : '비활성'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveAdminTab('banners')}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700"
                  >
                    배너 전체 관리 ({banners.length})
                  </button>
                </div>

              </div>

              {/* 3. Recent Products Snapshot Table */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Package className="w-4 h-4 text-indigo-400" />
                      <span>최근 등록된 신상품 요약</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">새로 입고되었거나 관리자가 추가한 최신 먹거리 목록입니다.</p>
                  </div>
                  <button
                    onClick={() => setActiveAdminTab('products')}
                    className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1"
                  >
                    전체 {products.length}개 상품 관리로 이동 <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/60 text-slate-400 uppercase font-bold text-[11px] border-b border-slate-800">
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
                    <tbody className="divide-y divide-slate-800/60">
                      {products.slice(0, 5).map(prod => (
                        <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-lg border border-slate-800 shrink-0" />
                              <div>
                                <p className="font-bold text-white text-xs">{prod.name}</p>
                                <p className="text-[11px] text-slate-400">{prod.brand}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold">
                              {prod.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-white">
                            {prod.price.toLocaleString()}원
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                            {prod.releaseDate}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => toggleProductToday(prod.id)}
                              className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${
                                prod.isToday ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500 hover:text-slate-300'
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
                                prod.isHot ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              <Flame className="w-3 h-3" />
                              <span>{prod.isHot ? 'ON' : 'OFF'}</span>
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => { handleOpenEditProduct(prod); setActiveAdminTab('products'); }}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-bold transition-all"
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
              TAB 2: APPROVAL / CRAWLER INBOX (신제품 수집 & 승인함)
             ======================================================== */}
          {activeAdminTab === 'approval' && (
            <div className="space-y-6">
              
              {/* Header & Crawler Controller Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Bot className="w-3.5 h-3.5 text-amber-400" />
                        <span>AI 신제품 자동 수집 파이프라인</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>마지막 수집: {lastCrawledDate || '금일 미수집'}</span>
                      </span>
                    </div>
                    <h2 className="text-base font-black text-white">편의점 4사 및 주요 식품사 실시간 신제품 승인함</h2>
                    <p className="text-xs text-slate-400">
                      CU, GS25, 세븐일레븐, 이마트24, 농심, 오리온 등에서 출시된 신제품을 수집하여 검토 후 승인 시 즉시 사용자 앱에 반영됩니다.
                    </p>
                  </div>

                  {/* Crawler Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => runDailyCrawler(true)}
                      disabled={isCrawling}
                      className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl text-xs font-black shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
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
                          className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-40"
                        >
                          선택 {selectedPendingIds.length}개 일괄 승인
                        </button>
                        <button
                          onClick={approveAllPending}
                          className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
                        >
                          전체 일괄 승인
                        </button>
                        <button
                          onClick={clearAllPendingProducts}
                          className="px-3 py-2.5 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
                        >
                          대기함 비우기
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Keyword Search Crawler Bar */}
                <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2">
                  <div className="relative flex-1 min-w-[280px]">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={crawlerSearchQuery}
                      onChange={e => setCrawlerSearchQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSearchCollect()}
                      placeholder="특정 상품명이나 브랜드 검색 수집 (예: 꼬북칩, 제로밀크티, 찰떡아이스)"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <button
                    onClick={handleSearchCollect}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Search className="w-3.5 h-3.5 text-amber-400" />
                    <span>키워드 맞춤 수집</span>
                  </button>
                </div>
              </div>

              {/* Filters & Count Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {(['전체', '과자', '음료', '빵·디저트', '간편식', '기타'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setPendingCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        pendingCategoryFilter === cat
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Source Filter Pills */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="font-semibold text-slate-500">출처:</span>
                  {(['전체', 'CU', 'GS25', '세븐일레븐', '이마트24'] as const).map(src => (
                    <button
                      key={src}
                      onClick={() => setPendingSourceFilter(src)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                        pendingSourceFilter === src
                          ? 'bg-slate-700 text-white font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {src}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pending Products Desktop Table */}
              {filteredPendingProducts.length === 0 ? (
                <div className="p-12 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white">승인 대기 중인 신제품이 없습니다</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    위의 <strong className="text-amber-400">[오늘 신제품 즉시 수집]</strong> 버튼을 누르시면 편의점 및 식품사의 따끈따끈한 신제품을 자동으로 가져옵니다.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedPendingIds.length === filteredPendingProducts.length && filteredPendingProducts.length > 0}
                        onChange={toggleSelectAllPending}
                        className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                      />
                      <span className="font-semibold text-slate-300">
                        전체 선택 ({selectedPendingIds.length}/{filteredPendingProducts.length}개)
                      </span>
                    </div>
                    <span>※ 승인된 상품은 즉시 메인 홈 및 신제품 피드에 등록됩니다.</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold text-[11px] border-b border-slate-800">
                        <tr>
                          <th className="py-3 px-4 w-12 text-center">선택</th>
                          <th className="py-3 px-4">신제품 / 브랜드</th>
                          <th className="py-3 px-4">카테고리</th>
                          <th className="py-3 px-4">가격</th>
                          <th className="py-3 px-4">판매처 편의점</th>
                          <th className="py-3 px-4">수집 출처</th>
                          <th className="py-3 px-4">수집 일시</th>
                          <th className="py-3 px-4 text-right">작업</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredPendingProducts.map(item => {
                          const isSelected = selectedPendingIds.includes(item.id);
                          return (
                            <tr key={item.id} className={`hover:bg-slate-800/40 transition-colors ${isSelected ? 'bg-amber-950/20' : ''}`}>
                              <td className="py-3 px-4 text-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => togglePendingSelect(item.id)}
                                  className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    onClick={() => setPreviewImageModalUrl(item.image)}
                                    className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden shrink-0 cursor-pointer relative group"
                                  >
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                      <Eye className="w-3.5 h-3.5 text-white" />
                                    </div>
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold text-white text-xs truncate max-w-xs">{item.name}</p>
                                    <p className="text-[11px] text-slate-400">{item.brand} · {item.releaseDate}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold">
                                  {item.category}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono font-bold text-white">
                                {item.price > 0 ? `${item.price.toLocaleString()}원` : '가격정보없음'}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex flex-wrap gap-1">
                                  {item.stores.map(st => (
                                    <span key={st} className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] font-semibold text-slate-300 border border-slate-700">
                                      {st}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-slate-400 text-[11px]">
                                <span className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-900/50 text-[10px] font-bold">
                                  {item.sourceName}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-500 font-mono text-[10px]">
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
                                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-bold transition-all border border-slate-700"
                                  >
                                    수정
                                  </button>
                                  <button
                                    onClick={() => rejectPendingProduct(item.id)}
                                    className="p-1 hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 rounded transition-all"
                                    title="거절"
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
              )}

            </div>
          )}

          {/* ========================================================
              TAB 3: PRODUCTS (상품 및 신제품 관리)
             ======================================================== */}
          {activeAdminTab === 'products' && (
            <div className="space-y-6">
              
              {/* Product Toolbar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                
                {/* Search & Badge filter */}
                <div className="flex flex-wrap items-center gap-2.5 flex-1">
                  <div className="relative min-w-[260px] flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={e => setProductSearch(e.target.value)}
                      placeholder="상품명, 브랜드명 검색..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    {productSearch && (
                      <button onClick={() => setProductSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Badge Filter Pills */}
                  <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-xs">
                    <button
                      onClick={() => setProductFilterBadge('all')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        productFilterBadge === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      전체 ({products.length})
                    </button>
                    <button
                      onClick={() => setProductFilterBadge('today')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                        productFilterBadge === 'today' ? 'bg-indigo-600 text-white' : 'text-indigo-400 hover:text-white'
                      }`}
                    >
                      <Zap className="w-3 h-3" />
                      <span>오늘신상 ({todayProductsCount})</span>
                    </button>
                    <button
                      onClick={() => setProductFilterBadge('hot')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                        productFilterBadge === 'hot' ? 'bg-orange-600 text-white' : 'text-orange-400 hover:text-white'
                      }`}
                    >
                      <Flame className="w-3 h-3" />
                      <span>인기HOT ({hotProductsCount})</span>
                    </button>
                  </div>
                </div>

                {/* Right: View Mode & Add Button */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-xs">
                    <button
                      onClick={() => setProductViewMode('table')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                        productViewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400'
                      }`}
                    >
                      테이블형
                    </button>
                    <button
                      onClick={() => setProductViewMode('grid')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                        productViewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400'
                      }`}
                    >
                      카드 그리드형
                    </button>
                  </div>

                  <button
                    onClick={handleOpenNewProduct}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
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
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Products Table View */}
              {productViewMode === 'table' ? (
                <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold text-[11px] border-b border-slate-800">
                        <tr>
                          <th className="py-3 px-4">상품 / 브랜드</th>
                          <th className="py-3 px-4">카테고리</th>
                          <th className="py-3 px-4">가격 (할인율)</th>
                          <th className="py-3 px-4">평점 / 리뷰</th>
                          <th className="py-3 px-4">⚡ 오늘신상 토글</th>
                          <th className="py-3 px-4">🔥 인기HOT 토글</th>
                          <th className="py-3 px-4">판매처 편의점</th>
                          <th className="py-3 px-4 text-right">관리</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredAdminProducts.map(prod => (
                          <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div
                                  onClick={() => setPreviewImageModalUrl(prod.image)}
                                  className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden shrink-0 cursor-pointer relative group"
                                >
                                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Eye className="w-3.5 h-3.5 text-white" />
                                  </div>
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-white text-xs truncate max-w-xs">{prod.name}</p>
                                  <p className="text-[11px] text-slate-400">{prod.brand} · {prod.releaseDate}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold">
                                {prod.category} {prod.subCategory && `> ${prod.subCategory}`}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono">
                              <span className="font-bold text-white">{prod.price.toLocaleString()}원</span>
                              {prod.discountRate && prod.discountRate > 0 ? (
                                <span className="text-[10px] text-rose-400 ml-1 font-bold">(-{prod.discountRate}%)</span>
                              ) : null}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1 text-[11px]">
                                <span className="text-amber-400 font-bold">★ {prod.overallRating || 0}</span>
                                <span className="text-slate-500">({prod.ratingCount || 0})</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => toggleProductToday(prod.id)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all ${
                                  prod.isToday
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-slate-800 text-slate-500 hover:text-slate-300'
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
                                    ? 'bg-orange-600 text-white shadow-sm'
                                    : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                                }`}
                              >
                                <Flame className="w-3 h-3" />
                                <span>{prod.isHot ? '인기HOT ON' : 'OFF'}</span>
                              </button>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1 max-w-[140px]">
                                {prod.stores?.map(st => (
                                  <span key={st} className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] font-semibold text-slate-300 border border-slate-700">
                                    {st}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditProduct(prod)}
                                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-bold transition-all border border-slate-700 flex items-center gap-1"
                                >
                                  <Edit3 className="w-3 h-3 text-blue-400" />
                                  <span>수정</span>
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`'${prod.name}' 상품을 정말 삭제하시겠습니까?`)) {
                                      deleteProduct(prod.id);
                                    }
                                  }}
                                  className="p-1 hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 rounded transition-all"
                                  title="삭제"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredAdminProducts.map(prod => (
                    <div key={prod.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-950 border border-slate-800">
                          <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                          <div className="absolute top-2 left-2 flex gap-1">
                            {prod.isToday && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-indigo-600 text-white shadow-xs">
                                ⚡ 오늘신상
                              </span>
                            )}
                            {prod.isHot && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-orange-600 text-white shadow-xs">
                                🔥 인기HOT
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-indigo-400 font-semibold">{prod.brand}</span>
                          <h4 className="text-xs font-bold text-white truncate">{prod.name}</h4>
                          <p className="text-xs font-mono font-bold text-slate-300 mt-1">{prod.price.toLocaleString()}원</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleProductToday(prod.id)}
                            className={`p-1.5 rounded-lg text-xs font-bold ${prod.isToday ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'}`}
                            title="오늘신상 토글"
                          >
                            <Zap className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleProductHot(prod.id)}
                            className={`p-1.5 rounded-lg text-xs font-bold ${prod.isHot ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-500'}`}
                            title="인기HOT 토글"
                          >
                            <Flame className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-bold transition-all border border-slate-700"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`'${prod.name}' 상품을 삭제하시겠습니까?`)) {
                                deleteProduct(prod.id);
                              }
                            }}
                            className="p-1 hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 rounded transition-all"
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
              TAB 4: BANNERS (홈 배너 관리)
             ======================================================== */}
          {activeAdminTab === 'banners' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                <div>
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-400" />
                    <span>모바일 메인 홈 배너 관리 ({banners.length}개)</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    사용자가 앱을 열었을 때 가장 먼저 마주치는 캐러셀 배너입니다. 이미지와 타이틀, 클릭 시 이동할 카테고리를 설정할 수 있습니다.
                  </p>
                </div>
                <button
                  onClick={handleOpenNewBanner}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>새 배너 추가</span>
                </button>
              </div>

              {/* 3-Column Wide Desktop Banner Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {banners.map((banner, index) => (
                  <div key={banner.id} className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between">
                    
                    {/* Banner Live Card Look */}
                    <div>
                      <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
                        <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-white/20 backdrop-blur-md text-white border border-white/30">
                              {banner.badge}
                            </span>
                            <span className="w-6 h-6 rounded-full bg-black/60 text-white font-mono text-xs flex items-center justify-center font-bold">
                              #{index + 1}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-white leading-tight">{banner.title}</h3>
                            <p className="text-xs text-slate-300 mt-0.5">{banner.subtitle}</p>
                            <span className="inline-block mt-2 px-3 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-bold">
                              {banner.buttonText} →
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Info bar */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">연결 카테고리</span>
                          <span className="font-bold text-white px-2 py-0.5 rounded bg-slate-800">
                            {banner.linkCategory || '미설정'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">노출 상태</span>
                          <button
                            onClick={() => toggleBannerActive(banner.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                              banner.isActive
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {banner.isActive ? '● 실시간 노출 중' : '비활성 (숨김)'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 pt-0 border-t border-slate-800/80 flex items-center justify-between">
                      <button
                        onClick={() => handleOpenEditBanner(banner)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-700"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                        <span>수정</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`'${banner.title}' 배너를 삭제하시겠습니까?`)) {
                            deleteBanner(banner.id);
                          }
                        }}
                        className="p-1.5 hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================
              TAB 5: BATTLE (신상 배틀 설정)
             ======================================================== */}
          {activeAdminTab === 'battle' && (
            <div className="space-y-6">
              
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Swords className="w-5 h-5 text-rose-400" />
                  <span>신상 배틀 실시간 맞대결 설정</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  모바일 홈 화면 하단에 노출되는 대형 투표 위젯입니다. 두 개의 라이벌 신제품을 골라 실시간 투표를 유도할 수 있습니다.
                </p>
              </div>

              {/* 2-Column: Left Settings Form vs Right Arena Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left: Settings Form */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
                  <h3 className="text-sm font-black text-white">매치업 정보 입력</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">배틀 메인 타이틀</label>
                      <input
                        type="text"
                        value={battleTitle}
                        onChange={e => setBattleTitle(e.target.value)}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">배틀 서브 설명</label>
                      <input
                        type="text"
                        value={battleSubtitle}
                        onChange={e => setBattleSubtitle(e.target.value)}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    {/* Fighter A */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-400">🥊 파이터 A (좌측)</span>
                        <input
                          type="text"
                          value={battleLabelA}
                          onChange={e => setBattleLabelA(e.target.value)}
                          placeholder="라벨 (예: 스낵 신상 1위)"
                          className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white w-40 text-right"
                        />
                      </div>
                      <select
                        value={battleProductAId}
                        onChange={e => setBattleProductAId(e.target.value)}
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                      >
                        {products.map(p => (
                          <option key={p.id} value={p.id}>[{p.brand}] {p.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Fighter B */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-rose-400">🥊 파이터 B (우측)</span>
                        <input
                          type="text"
                          value={battleLabelB}
                          onChange={e => setBattleLabelB(e.target.value)}
                          placeholder="라벨 (예: 디저트 신상 1위)"
                          className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white w-40 text-right"
                        />
                      </div>
                      <select
                        value={battleProductBId}
                        onChange={e => setBattleProductBId(e.target.value)}
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                      >
                        {products.map(p => (
                          <option key={p.id} value={p.id}>[{p.brand}] {p.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Vote Percent Slider */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                        <span>A 파이터 기준 득표율 설정: <strong className="text-blue-400">{battlePercentA}%</strong></span>
                        <span>B 파이터: <strong className="text-rose-400">{100 - battlePercentA}%</strong></span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="99"
                        value={battlePercentA}
                        onChange={e => setBattlePercentA(Number(e.target.value))}
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                    </div>

                    <button
                      onClick={handleSaveBattle}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-rose-600 hover:from-blue-500 hover:to-rose-500 text-white rounded-xl text-xs font-black shadow-lg transition-all active:scale-98"
                    >
                      배틀 매치업 즉시 저장 & 반영
                    </button>
                  </div>
                </div>

                {/* Right: Live Battle Showdown Arena Preview */}
                <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-6">
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">실시간 모바일 렌더링 미리보기</span>
                    <h3 className="text-lg font-black text-white mt-1">{battleTitle}</h3>
                    <p className="text-xs text-slate-400">{battleSubtitle}</p>
                  </div>

                  {/* VS Arena Box */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 relative">
                    <div className="grid grid-cols-2 gap-4">
                      
                      {/* Left Product A */}
                      <div className="flex flex-col items-center text-center space-y-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/40">
                          {battleLabelA || 'A 파이터'}
                        </span>
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-900 border-2 border-blue-500/40 shadow-lg">
                          <img src={prodA?.image} alt={prodA?.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-400">{prodA?.brand}</p>
                          <p className="text-xs font-black text-white line-clamp-1">{prodA?.name}</p>
                          <p className="text-sm font-mono font-black text-blue-400 mt-1">{battlePercentA}%</p>
                        </div>
                      </div>

                      {/* Right Product B */}
                      <div className="flex flex-col items-center text-center space-y-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          {battleLabelB || 'B 파이터'}
                        </span>
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-900 border-2 border-rose-500/40 shadow-lg">
                          <img src={prodB?.image} alt={prodB?.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-400">{prodB?.brand}</p>
                          <p className="text-xs font-black text-white line-clamp-1">{prodB?.name}</p>
                          <p className="text-sm font-mono font-black text-rose-400 mt-1">{100 - battlePercentA}%</p>
                        </div>
                      </div>

                    </div>

                    {/* VS Badge Center */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900 border-2 border-slate-700 shadow-xl flex items-center justify-center font-black text-xs text-amber-400">
                      VS
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-5">
                      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
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
              TAB 6: DATA & SETTINGS (데이터 백업 & 동기화)
             ======================================================== */}
          {activeAdminTab === 'data' && (
            <div className="space-y-6">
              
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <span>데이터베이스 상태 및 백업 복구</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  데이터 백업(JSON 다운로드) 및 로컬 스토리지 / Supabase 동기화 상태를 진단합니다.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Diagnostics Card */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                  <h3 className="text-sm font-black text-white">데이터베이스 동기화 진단</h3>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400">현재 클라우드 DB 상태</span>
                      <span className={`font-bold flex items-center gap-1.5 ${isSupabaseConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        {isSupabaseConnected ? 'Supabase 정상 연결됨' : '로컬 스토리지 모드 동작중'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400">등록된 먹거리 상품 수</span>
                      <span className="font-mono font-bold text-white">{products.length}건</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400">등록된 유저 리뷰 수</span>
                      <span className="font-mono font-bold text-white">{reviews.length}건</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400">커뮤니티 게시글 수</span>
                      <span className="font-mono font-bold text-white">{communityPosts.length}건</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400">승인 대기 신제품 수</span>
                      <span className="font-mono font-bold text-amber-400">{pendingCount}건</span>
                    </div>
                  </div>
                </div>

                {/* Backup & Reset Actions */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white">데이터 백업 및 초기화 도구</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      현재 등록된 모든 상품, 배너, 배틀 설정 데이터를 JSON 형태로 안전하게 백업하거나, 시스템 기본 초기 데이터로 되돌릴 수 있습니다.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleExportData}
                      className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 transition-all"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>전체 데이터 JSON 파일로 백업 다운로드</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('모든 상품, 배너, 설정을 초기 기본 데이터로 복구하시겠습니까? (이 작업은 되돌릴 수 없습니다.)')) {
                          resetAllDataToDefaults();
                        }
                      }}
                      className="w-full py-3 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <RotateCcw className="w-4 h-4 text-rose-400" />
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {editingProductId ? '상품 정보 수정' : '새 신제품 직접 등록'}
                  </h3>
                  <p className="text-xs text-slate-400">필수 정보와 편의점 판매처, 영양정보를 입력해주세요.</p>
                </div>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
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
                    <label className="block text-xs font-bold text-slate-300 mb-1">상품명 *</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="예: 꼬북칩 초코츄러스맛"
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">제조사 / 브랜드 *</label>
                    <input
                      type="text"
                      value={productForm.brand}
                      onChange={e => setProductForm({ ...productForm, brand: e.target.value })}
                      placeholder="예: 오리온, 농심, 삼양"
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">카테고리</label>
                    <select
                      value={productForm.category}
                      onChange={e => setProductForm({ ...productForm, category: e.target.value as ProductCategory })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                    >
                      {CATEGORIES.filter(c => c !== '전체').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">세부 카테고리</label>
                    <input
                      type="text"
                      value={productForm.subCategory}
                      onChange={e => setProductForm({ ...productForm, subCategory: e.target.value })}
                      placeholder="예: 스낵, 초콜릿, 탄산"
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">출시일 문구</label>
                    <input
                      type="text"
                      value={productForm.releaseDate}
                      onChange={e => setProductForm({ ...productForm, releaseDate: e.target.value })}
                      placeholder="2026.09 출시"
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">정상 판매가 (원) *</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">할인율 (%)</label>
                    <input
                      type="number"
                      value={productForm.discountRate}
                      onChange={e => setProductForm({ ...productForm, discountRate: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">용량 / 칼로리</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={productForm.volume}
                        onChange={e => setProductForm({ ...productForm, volume: e.target.value })}
                        placeholder="80g"
                        className="w-1/2 p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                      />
                      <input
                        type="number"
                        value={productForm.calories}
                        onChange={e => setProductForm({ ...productForm, calories: Number(e.target.value) })}
                        placeholder="kcal"
                        className="w-1/2 p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">상품 대표 이미지 URL *</label>
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={e => setProductForm({ ...productForm, image: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  />
                </div>

                {/* Badges Toggle Switches */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">특수 노출 뱃지 설정</span>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-indigo-300">
                      <input
                        type="checkbox"
                        checked={productForm.isToday}
                        onChange={e => setProductForm({ ...productForm, isToday: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0 w-4 h-4"
                      />
                      <span>⚡ 오늘신상 뱃지 부여</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-orange-300">
                      <input
                        type="checkbox"
                        checked={productForm.isHot}
                        onChange={e => setProductForm({ ...productForm, isHot: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-800 text-orange-600 focus:ring-0 w-4 h-4"
                      />
                      <span>🔥 인기HOT 뱃지 부여</span>
                    </label>
                  </div>
                </div>

                {/* Store checkboxes */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">판매처 편의점 및 유통처</label>
                  <div className="flex flex-wrap gap-2">
                    {['CU', 'GS25', '세븐일레븐', '이마트24', '대형마트', '온라인'].map(store => {
                      const isChecked = productForm.stores.includes(store);
                      return (
                        <button
                          key={store}
                          type="button"
                          onClick={() => {
                            setProductForm({
                              ...productForm,
                              stores: isChecked
                                ? productForm.stores.filter(s => s !== store)
                                : [...productForm.stores, store]
                            });
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            isChecked
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-950 border border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          {store}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">상품 소개 및 특징 설명</label>
                  <textarea
                    rows={2}
                    value={productForm.description}
                    onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="신제품의 식감, 맛의 특징, 주요 타깃 설명"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

              </div>

              {/* Right 1 Col: Live Realtime Mobile Card Preview */}
              <div className="space-y-3">
                <span className="text-xs font-black text-slate-400 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>실시간 모바일 카드 미리보기</span>
                </span>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-3">
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
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
                    <span className="text-[10px] text-indigo-400 font-semibold">{productForm.brand || '브랜드명'}</span>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{productForm.name || '상품명 미리보기'}</h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      <strong className="text-white font-bold">{productForm.price.toLocaleString()}원</strong>
                      {productForm.discountRate > 0 && (
                        <span className="text-rose-400 ml-1 font-bold">(-{productForm.discountRate}%)</span>
                      )}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-1">
                    {productForm.stores.map(st => (
                      <span key={st} className="px-1.5 py-0.2 rounded bg-slate-800 text-[9px] text-slate-300">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 flex items-center justify-end gap-2 shrink-0 bg-slate-900/80">
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
              >
                취소
              </button>
              <button
                onClick={handleSaveProduct}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-600/20"
              >
                {editingProductId ? '수정사항 저장' : '새 상품 등록 완료'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: EDIT PENDING PRODUCT MODAL
         ======================================================== */}
      {isEditingPendingModalOpen && editingPendingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">수집된 신제품 정보 수정 후 승인</h3>
                  <p className="text-xs text-slate-400">수정 후 승인하면 정식 상품으로 즉시 업로드됩니다.</p>
                </div>
              </div>
              <button onClick={() => setIsEditingPendingModalOpen(false)} className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">상품명</label>
                  <input
                    type="text"
                    value={editingPendingItem.name}
                    onChange={e => setEditingPendingItem({ ...editingPendingItem, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">제조사 / 브랜드</label>
                  <input
                    type="text"
                    value={editingPendingItem.brand}
                    onChange={e => setEditingPendingItem({ ...editingPendingItem, brand: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">카테고리</label>
                  <select
                    value={editingPendingItem.category}
                    onChange={e => setEditingPendingItem({ ...editingPendingItem, category: e.target.value as ProductCategory })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  >
                    {CATEGORIES.filter(c => c !== '전체').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">가격 (원)</label>
                  <input
                    type="number"
                    value={editingPendingItem.price}
                    onChange={e => setEditingPendingItem({ ...editingPendingItem, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">출시일</label>
                  <input
                    type="text"
                    value={editingPendingItem.releaseDate}
                    onChange={e => setEditingPendingItem({ ...editingPendingItem, releaseDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">이미지 URL</label>
                <input
                  type="text"
                  value={editingPendingItem.image}
                  onChange={e => setEditingPendingItem({ ...editingPendingItem, image: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">상품 설명</label>
                <textarea
                  rows={2}
                  value={editingPendingItem.description}
                  onChange={e => setEditingPendingItem({ ...editingPendingItem, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsEditingPendingModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                취소
              </button>
              <button
                onClick={() => {
                  updatePendingProduct(editingPendingItem.id, editingPendingItem);
                  approvePendingProduct(editingPendingItem.id);
                  setIsEditingPendingModalOpen(false);
                  showToast(`'${editingPendingItem.name}' 상품이 승인되었습니다.`, 'success');
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {editingBannerId ? '홈 배너 수정' : '새 홈 배너 추가'}
                  </h3>
                  <p className="text-xs text-slate-400">모바일 홈 화면 상단 캐러셀에 표시될 배너 콘텐츠입니다.</p>
                </div>
              </div>
              <button onClick={() => setIsBannerModalOpen(false)} className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Form */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">배너 메인 제목 *</label>
                  <input
                    type="text"
                    value={bannerForm.title}
                    onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">서브 설명 문구</label>
                  <input
                    type="text"
                    value={bannerForm.subtitle}
                    onChange={e => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">상단 뱃지 텍스트</label>
                    <input
                      type="text"
                      value={bannerForm.badge}
                      onChange={e => setBannerForm({ ...bannerForm, badge: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">버튼 문구</label>
                    <input
                      type="text"
                      value={bannerForm.buttonText}
                      onChange={e => setBannerForm({ ...bannerForm, buttonText: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">클릭 시 이동 카테고리</label>
                    <select
                      value={bannerForm.linkCategory}
                      onChange={e => setBannerForm({ ...bannerForm, linkCategory: e.target.value as ProductCategory })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-300">
                      <input
                        type="checkbox"
                        checked={bannerForm.isActive}
                        onChange={e => setBannerForm({ ...bannerForm, isActive: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0 w-4 h-4"
                      />
                      <span>배너 실시간 활성화 노출</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">배너 배경 이미지 URL *</label>
                  <input
                    type="text"
                    value={bannerForm.image}
                    onChange={e => setBannerForm({ ...bannerForm, image: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              {/* Right: Live Banner Preview */}
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-400">모바일 홈 캐러셀 미리보기</span>
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
                  <img src={bannerForm.image} alt="배너 미리보기" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 flex flex-col justify-between">
                    <div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-white/20 backdrop-blur-md text-white border border-white/30">
                        {bannerForm.badge || '뱃지 텍스트'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white leading-tight">{bannerForm.title || '배너 제목'}</h3>
                      <p className="text-xs text-slate-300 mt-1">{bannerForm.subtitle || '서브 설명'}</p>
                      <span className="inline-block mt-3 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-[11px] font-bold shadow-md">
                        {bannerForm.buttonText || '바로가기'} →
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-4 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                취소
              </button>
              <button
                onClick={handleSaveBanner}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-md"
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
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
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

    </div>
  );
};
