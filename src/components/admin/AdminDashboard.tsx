import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Flame, 
  RotateCcw, 
  Layers, 
  Package, 
  Swords, 
  Database, 
  X, 
  Search,
  ExternalLink
} from 'lucide-react';
import { ProductCategory, BannerItem, Product } from '../../types';
import { CATEGORIES, SUBCATEGORIES_MAP } from '../../data/mockProducts';

export const AdminDashboard: React.FC = () => {
  const { 
    banners, 
    products, 
    battleConfig,
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
    showToast
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'banners' | 'products' | 'battle' | 'data'>('banners');

  // Banner modal states
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

  // Product modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<ProductCategory>('전체');
  const [productForm, setProductForm] = useState<{
    name: string;
    brand: string;
    category: ProductCategory;
    subCategory: string;
    price: number;
    discountRate: number;
    image: string;
    description: string;
    stores: string[];
    isToday: boolean;
    isHot: boolean;
  }>({
    name: '',
    brand: '',
    category: '과자',
    subCategory: '스낵',
    price: 2000,
    discountRate: 0,
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80',
    description: '',
    stores: ['CU', 'GS25'],
    isToday: true,
    isHot: false,
  });

  // Battle form states
  const [battleForm, setBattleForm] = useState({
    title: battleConfig.title,
    subtitle: battleConfig.subtitle,
    productAId: battleConfig.productAId,
    labelA: battleConfig.labelA,
    productBId: battleConfig.productBId,
    labelB: battleConfig.labelB,
  });

  // Presets for quick banner images
  const bannerImagePresets = [
    { label: '과일/신선', url: 'https://images.unsplash.com/photo-1595158364153-23961fa633df?w=800&auto=format&fit=crop&q=80' },
    { label: '과자/스낵', url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&auto=format&fit=crop&q=80' },
    { label: '디저트/베이커리', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80' },
    { label: '음료/카페', url: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&auto=format&fit=crop&q=80' },
    { label: '간편식/밀키트', url: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=800&auto=format&fit=crop&q=80' },
  ];

  // Open banner edit
  const openEditBanner = (banner: BannerItem) => {
    setEditingBannerId(banner.id);
    setBannerForm({
      image: banner.image,
      badge: banner.badge,
      title: banner.title,
      subtitle: banner.subtitle,
      buttonText: banner.buttonText,
      linkCategory: banner.linkCategory || '전체',
      isActive: banner.isActive,
    });
    setIsBannerModalOpen(true);
  };

  // Submit banner
  const handleBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.title.trim()) {
      showToast('배너 제목을 입력해주세요.', 'error');
      return;
    }

    if (editingBannerId) {
      updateBanner(editingBannerId, bannerForm);
    } else {
      addBanner(bannerForm);
    }
    setIsBannerModalOpen(false);
    setEditingBannerId(null);
  };

  // Open product edit
  const openEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProductForm({
      name: p.name,
      brand: p.brand,
      category: p.category,
      subCategory: p.subCategory || (SUBCATEGORIES_MAP[p.category]?.[1] || '전체'),
      price: p.price,
      discountRate: p.discountRate || 0,
      image: p.image,
      description: p.description || '',
      stores: p.stores || ['CU', 'GS25'],
      isToday: !!p.isToday,
      isHot: !!p.isHot,
    });
    setIsProductModalOpen(true);
  };

  // Submit product
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.brand.trim()) {
      showToast('상품명과 브랜드를 입력해주세요.', 'error');
      return;
    }

    if (editingProductId) {
      updateProduct(editingProductId, productForm);
    } else {
      addProduct(productForm);
    }
    setIsProductModalOpen(false);
    setEditingProductId(null);
  };

  // Save battle config
  const handleBattleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBattleConfig(battleForm);
  };

  // Filtered products for admin list
  const filteredAdminProducts = products.filter(p => {
    if (productCategoryFilter !== '전체' && p.category !== productCategoryFilter) return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="bg-[#F8F9FA] min-h-full pb-16">
      
      {/* 1. Admin Header */}
      <div className="sticky top-0 z-30 bg-gray-900 text-white px-4 py-3 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('home')} 
            className="p-1.5 -ml-1 text-gray-300 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            title="앱 화면으로 복귀"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <h1 className="text-[15px] font-black tracking-tight">서비스 관리자 (Admin)</h1>
            </div>
            <p className="text-[10px] text-gray-400">실시간 데이터 관리 & 배포</p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('home')}
          className="text-xs font-bold text-white bg-[#0066FF] hover:bg-blue-600 px-3 py-1.5 rounded-lg shadow-sm transition-colors flex items-center gap-1"
        >
          <span>앱 보기</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Admin Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-2 flex overflow-x-auto no-scrollbar shadow-2xs">
        <button
          onClick={() => setActiveAdminTab('approval')}
          className={`flex items-center gap-1.5 px-3.5 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeAdminTab === 'approval'
              ? 'border-amber-500 text-amber-600 bg-amber-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>신제품 수집·승인</span>
          {pendingCount > 0 ? (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-xs animate-pulse">
              {pendingCount}
            </span>
          ) : (
            <span className="text-[10px] text-gray-400">0</span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('banners')}
          className={`flex items-center gap-1.5 px-3.5 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeAdminTab === 'banners'
              ? 'border-[#0066FF] text-[#0066FF]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>홈 배너 관리 ({banners.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('products')}
          className={`flex items-center gap-1.5 px-3.5 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeAdminTab === 'products'
              ? 'border-[#0066FF] text-[#0066FF]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>상품 & 신제품 ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('battle')}
          className={`flex items-center gap-1.5 px-3.5 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeAdminTab === 'battle'
              ? 'border-[#0066FF] text-[#0066FF]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>신상 배틀 설정</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('data')}
          className={`flex items-center gap-1.5 px-3.5 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeAdminTab === 'data'
              ? 'border-[#0066FF] text-[#0066FF]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>데이터 설정</span>
        </button>
      </div>

      {/* ================= TAB 0: APPROVAL (신제품 일일 수집 & 승인) ================= */}
      {activeAdminTab === 'approval' && (
        <div className="p-4 space-y-4">
          
          {/* 1. Header & Live Controller */}
          <div className="bg-gradient-to-r from-gray-900 via-slate-800 to-indigo-950 p-4 rounded-2xl text-white shadow-md border border-slate-700/60 relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>AI 신제품 자동 수집 파이프라인</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-300 rounded-full flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-slate-400" />
                  <span>마지막 수집: {lastCrawledDate || '오늘 미수집'}</span>
                </span>
              </div>

              <div>
                <h2 className="text-base font-black text-white">매일 수집된 실제 신제품 검토 및 승인</h2>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  편의점(CU, GS25, 세븐일레븐, 이마트24) 및 대형 식품사에서 출시된 <strong className="text-amber-300 font-bold">진짜 실물 신제품과 고화질 사진</strong>을 가져옵니다. 승인(Approve)해야 전체 사용자에게 업로드됩니다.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => runDailyCrawler(true)}
                  disabled={isCrawling}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 transition-all active:scale-98 disabled:opacity-50"
                >
                  {isCrawling ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>신제품 수집 중...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 fill-white" />
                      <span>오늘의 실제 신제품 수집하기</span>
                    </>
                  )}
                </button>

                {pendingCount > 0 && (
                  <>
                    <button
                      onClick={approveAllPending}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 transition-all active:scale-98"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>전체 일괄 승인 ({pendingCount})</span>
                    </button>

                    {selectedPendingIds.length > 0 && (
                      <button
                        onClick={handleBulkApproveSelected}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 transition-all active:scale-98"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>선택 {selectedPendingIds.length}개 승인</span>
                      </button>
                    )}

                    <button
                      onClick={clearAllPendingProducts}
                      className="px-2.5 py-2 bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>비우기</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 2. On-Demand Keyword Web Crawler Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-amber-500" />
                <span>키워드·편의점 신제품 즉시 수집기</span>
              </span>
              <span className="text-[10px] text-gray-500">실시간 웹 검색/크롤링</span>
            </div>

            <form onSubmit={handleSearchCollect} className="flex gap-1.5">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={crawlerSearchQuery}
                  onChange={(e) => setCrawlerSearchQuery(e.target.value)}
                  placeholder="예: CU 신상, GS25 혜자, 농심 툼바, 연세우유, 비쵸비"
                  className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={isCrawling || !crawlerSearchQuery.trim()}
                className="px-3.5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 whitespace-nowrap"
              >
                <span>수집 실행</span>
              </button>
            </form>

            {/* Quick preset tags */}
            <div className="flex flex-wrap items-center gap-1 pt-0.5">
              <span className="text-[10px] font-bold text-gray-400 mr-0.5">추천:</span>
              {[
                { label: '🏪 CU 단독 신상', q: 'CU' },
                { label: '🏪 GS25 신상품', q: 'GS25' },
                { label: '🏪 세븐일레븐 맛장우', q: '세븐일레븐' },
                { label: '🍜 농심 신라면 툼바', q: '농심 신라면 툼바' },
                { label: '🥖 연세우유 생크림빵', q: '연세우유' },
                { label: '🍪 오리온 비쵸비 딸기', q: '오리온 비쵸비' },
                { label: '🍺 테라 라이트', q: '하이트진로' }
              ].map(tag => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => searchAndCollect(tag.q)}
                  className="px-2 py-0.5 bg-gray-100 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 border border-gray-200 text-gray-600 rounded-md text-[10px] font-semibold transition-all"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Filter Bar */}
          <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[11px] font-bold text-gray-400 mr-1">분류:</span>
                {(['전체', '과자', '음료', '빵·디저트', '간편식'] as (ProductCategory | '전체')[]).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setPendingCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      pendingCategoryFilter === cat
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {filteredPendingProducts.length > 0 && (
                <button
                  onClick={toggleSelectAllPending}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-bold transition-all border border-gray-200 whitespace-nowrap"
                >
                  {selectedPendingIds.length === filteredPendingProducts.length
                    ? '전체 해제'
                    : '전체 선택'}
                </button>
              )}
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <span>대기 중인 신상품 <strong>{filteredPendingProducts.length}</strong>개</span>
              <span className="text-[10px] text-amber-600 font-bold">* [승인] 시 사용자 앱에 즉시 공개</span>
            </div>
          </div>

          {/* 4. Pending Cards List */}
          {filteredPendingProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-900">승인 대기 중인 신제품이 없습니다</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  오늘자 크롤링을 실행하여 실제 신제품들을 가져오세요.
                </p>
              </div>
              <button
                onClick={() => runDailyCrawler(true)}
                disabled={isCrawling}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-xs font-black shadow-sm inline-flex items-center gap-1 active:scale-98"
              >
                <Zap className="w-3 h-3 fill-white" />
                <span>지금 오늘의 신제품 수집하기</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPendingProducts.map(item => {
                const isSelected = selectedPendingIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-2xs ${
                      isSelected
                        ? 'border-amber-500 ring-2 ring-amber-500/20'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="p-3.5 flex gap-3">
                      {/* Image */}
                      <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100 relative border border-gray-200 group">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewImageModalUrl(item.image)}
                          className="absolute bottom-1 right-1 p-1 bg-black/60 text-white rounded text-[9px] font-bold flex items-center gap-0.5"
                          title="실제 사진 확대"
                        >
                          <Camera className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-gray-900 text-white">
                              {item.category}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500 text-white flex items-center gap-0.5">
                              <Sparkles className="w-2 h-2" />
                              실물사진
                            </span>
                            <span className="text-[10px] text-blue-600 font-bold">{item.brand}</span>
                          </div>
                          <span className="text-[9px] text-gray-400 font-medium">{item.sourceName || '공식'}</span>
                        </div>

                        <h4 className="font-extrabold text-gray-900 text-xs truncate" title={item.name}>
                          {item.name}
                        </h4>

                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs font-black text-gray-900">
                            {item.price.toLocaleString()}원
                          </span>
                          {item.calories && (
                            <span className="text-[10px] text-gray-400">
                              {item.calories}kcal {item.volume && `(${item.volume})`}
                            </span>
                          )}
                          <span className="text-[10px] text-gray-400 font-medium">· {item.releaseDate}</span>
                        </div>

                        <p className="text-[11px] text-gray-500 line-clamp-1 leading-snug">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-1 pt-0.5">
                          {item.stores.map(st => (
                            <span key={st} className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-gray-100 text-gray-600">
                              🏪 {st}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="px-3.5 py-2.5 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-2">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => togglePendingSelect(item.id)}
                          className="rounded text-amber-500 focus:ring-amber-400 w-3.5 h-3.5"
                        />
                        <span className="text-[11px]">선택</span>
                      </label>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditPending(item)}
                          className="px-2.5 py-1.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                          title="수정 후 승인"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>수정</span>
                        </button>

                        <button
                          onClick={() => rejectPendingProduct(item.id)}
                          className="p-1.5 bg-white hover:bg-rose-50 text-gray-400 hover:text-rose-600 border border-gray-200 rounded-lg text-xs transition-colors"
                          title="반려"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => approvePendingProduct(item.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black shadow-xs flex items-center gap-1 transition-all active:scale-95"
                          title="승인 및 즉시 업로드"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>승인 및 업로드</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ================= TAB 1: BANNERS ================= */}
      {activeAdminTab === 'banners' && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-gray-900">홈 메인 배너 목록</h2>
              <p className="text-xs text-gray-500">홈 화면 상단에 노출되는 슬라이드 배너입니다.</p>
            </div>
            <button
              onClick={() => {
                setEditingBannerId(null);
                setBannerForm({
                  image: 'https://images.unsplash.com/photo-1595158364153-23961fa633df?w=800&auto=format&fit=crop&q=80',
                  badge: '신규 프로모션',
                  title: '새로운 신제품 발견하기',
                  subtitle: '솔직한 먹거리 품목별 랭킹',
                  buttonText: '둘러보기',
                  linkCategory: '과자',
                  isActive: true,
                });
                setIsBannerModalOpen(true);
              }}
              className="flex items-center gap-1 text-xs font-bold text-white bg-[#0066FF] hover:bg-blue-600 px-3 py-2 rounded-xl shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>새 배너 등록</span>
            </button>
          </div>

          {/* Banner Cards List */}
          <div className="space-y-3">
            {banners.map((b) => (
              <div 
                key={b.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs transition-all hover:border-blue-300"
              >
                {/* Banner Preview image */}
                <div className="relative h-28 bg-gray-900 overflow-hidden">
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold bg-[#0066FF] px-1.5 py-0.5 rounded">
                      {b.badge}
                    </span>
                    <h3 className="text-xs font-black mt-1 line-clamp-1">{b.title}</h3>
                    <p className="text-[10px] opacity-80 line-clamp-1">{b.subtitle}</p>
                  </div>

                  {/* Status Badge */}
                  <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    b.isActive ? 'bg-emerald-500 text-white' : 'bg-gray-600 text-gray-200'
                  }`}>
                    {b.isActive ? '노출중' : '비활성'}
                  </span>
                </div>

                {/* Banner Controls */}
                <div className="p-3 flex items-center justify-between text-xs bg-gray-50/50">
                  <div className="text-gray-500 font-medium">
                    링크: <span className="font-bold text-gray-800">{b.linkCategory || '전체'}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleBannerActive(b.id)}
                      className={`p-1.5 rounded-lg border text-xs font-bold transition-colors ${
                        b.isActive
                          ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      }`}
                      title={b.isActive ? '노출 끄기' : '노출 켜기'}
                    >
                      {b.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => openEditBanner(b)}
                      className="p-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors"
                      title="수정"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`'${b.title}' 배너를 삭제하시겠습니까?`)) {
                          deleteBanner(b.id);
                        }
                      }}
                      className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: PRODUCTS ================= */}
      {activeAdminTab === 'products' && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-gray-900">상품 & 신제품 관리</h2>
              <p className="text-xs text-gray-500">등록된 먹거리 목록 및 신상 뱃지 관리</p>
            </div>
            <button
              onClick={() => {
                setEditingProductId(null);
                setProductForm({
                  name: '',
                  brand: '',
                  category: '과자',
                  subCategory: '스낵',
                  price: 2000,
                  discountRate: 0,
                  image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80',
                  description: '',
                  stores: ['CU', 'GS25'],
                  isToday: true,
                  isHot: false,
                });
                setIsProductModalOpen(true);
              }}
              className="flex items-center gap-1 text-xs font-bold text-white bg-[#0066FF] hover:bg-blue-600 px-3 py-2 rounded-xl shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>새 상품 등록</span>
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="상품명 또는 브랜드 검색..."
                className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 outline-none focus:border-[#0066FF]"
              />
            </div>

            <div className="flex overflow-x-auto no-scrollbar gap-1.5 pb-1">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setProductCategoryFilter(c)}
                  className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                    productCategoryFilter === c
                      ? 'bg-[#0066FF] text-white shadow-xs'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Product Items List */}
          <div className="space-y-2.5">
            <div className="text-xs text-gray-500 font-medium">
              총 {filteredAdminProducts.length}개 상품
            </div>

            {filteredAdminProducts.map(p => (
              <div
                key={p.id}
                className="bg-white p-3 rounded-2xl border border-gray-200 shadow-2xs flex items-center gap-3 hover:border-blue-200 transition-all"
              >
                <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-gray-400">{p.brand}</span>
                    <span className="text-[10px] font-semibold text-[#0066FF] bg-blue-50 px-1.5 py-0.2 rounded">
                      {p.category} · {p.subCategory}
                    </span>
                  </div>
                  
                  <h4 className="text-xs font-bold text-gray-900 truncate mt-0.5">{p.name}</h4>
                  <div className="text-xs font-black text-gray-900 mt-1">
                    {p.price.toLocaleString()}원
                    {p.discountRate ? <span className="text-red-500 text-[11px] ml-1 font-bold">{p.discountRate}% 할인</span> : null}
                  </div>

                  {/* Badges toggles */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <button
                      onClick={() => toggleProductToday(p.id)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-0.5 transition-colors ${
                        p.isToday
                          ? 'bg-amber-100 text-amber-700 border border-amber-300'
                          : 'bg-gray-100 text-gray-400 border border-gray-200'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>오늘신상</span>
                    </button>

                    <button
                      onClick={() => toggleProductHot(p.id)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-0.5 transition-colors ${
                        p.isHot
                          ? 'bg-rose-100 text-rose-700 border border-rose-300'
                          : 'bg-gray-100 text-gray-400 border border-gray-200'
                      }`}
                    >
                      <Flame className="w-3 h-3" />
                      <span>인기HOT</span>
                    </button>
                  </div>
                </div>

                {/* Edit & Delete */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => openEditProduct(p)}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                    title="상품 수정"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`'${p.name}' 상품을 삭제하시겠습니까?`)) {
                        deleteProduct(p.id);
                      }
                    }}
                    className="p-2 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    title="상품 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: BATTLE CONFIG ================= */}
      {activeAdminTab === 'battle' && (
        <div className="p-4 space-y-4">
          <div>
            <h2 className="text-sm font-black text-gray-900">홈 화면 '신상 배틀' 매치업 설정</h2>
            <p className="text-xs text-gray-500">홈 화면에서 사용자들이 투표할 A vs B 대결 상품을 지정합니다.</p>
          </div>

          <form onSubmit={handleBattleSave} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
            {/* Battle Title */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">배틀 메인 타이틀</label>
              <input
                type="text"
                value={battleForm.title}
                onChange={(e) => setBattleForm({ ...battleForm, title: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 outline-none focus:border-[#0066FF]"
                placeholder="예: 🥊 신상 배틀 투표"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">배틀 부제목</label>
              <input
                type="text"
                value={battleForm.subtitle}
                onChange={(e) => setBattleForm({ ...battleForm, subtitle: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 outline-none focus:border-[#0066FF]"
                placeholder="예: 지금 가장 핫한 대결! 당신의 선택은?"
              />
            </div>

            {/* Fighter A selection */}
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
              <span className="text-xs font-black text-[#0066FF]">🔵 Fighter A 선택</span>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">매치 상품</label>
                <select
                  value={battleForm.productAId}
                  onChange={(e) => setBattleForm({ ...battleForm, productAId: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-900 font-bold"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>[{p.category}] {p.name} ({p.brand})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Fighter A 뱃지 라벨</label>
                <input
                  type="text"
                  value={battleForm.labelA}
                  onChange={(e) => setBattleForm({ ...battleForm, labelA: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                  placeholder="예: 제철과일 1위"
                />
              </div>
            </div>

            {/* Fighter B selection */}
            <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-100 space-y-2">
              <span className="text-xs font-black text-orange-600">🟠 Fighter B 선택</span>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">매치 상품</label>
                <select
                  value={battleForm.productBId}
                  onChange={(e) => setBattleForm({ ...battleForm, productBId: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-900 font-bold"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>[{p.category}] {p.name} ({p.brand})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Fighter B 뱃지 라벨</label>
                <input
                  type="text"
                  value={battleForm.labelB}
                  onChange={(e) => setBattleForm({ ...battleForm, labelB: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                  placeholder="예: 간편식 랭킹 1위"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-black rounded-xl shadow-sm transition-colors"
            >
              배틀 매치업 저장하기
            </button>
          </form>
        </div>
      )}

      {/* ================= TAB 4: DATA RESET ================= */}
      {activeAdminTab === 'data' && (
        <div className="p-4 space-y-4">
          <div>
            <h2 className="text-sm font-black text-gray-900">데이터 백업 & 전체 복원</h2>
            <p className="text-xs text-gray-500">데이터 상태 확인 및 기본 Mock 데이터로 초기화</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-gray-800">📊 현재 보관 데이터 현황</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-400 block text-[11px]">배너 개수</span>
                <span className="text-base font-black text-gray-900">{banners.length}개</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-400 block text-[11px]">총 상품 개수</span>
                <span className="text-base font-black text-gray-900">{products.length}개</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-400 block text-[11px]">오늘의 신상</span>
                <span className="text-base font-black text-amber-600">{products.filter(p=>p.isToday).length}개</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-400 block text-[11px]">인기 상품(HOT)</span>
                <span className="text-base font-black text-rose-600">{products.filter(p=>p.isHot).length}개</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-red-100 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-red-600 flex items-center gap-1">
              <RotateCcw className="w-4 h-4" />
              <span>기본 샘플 데이터로 전체 초기화 (Reset)</span>
            </h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              테스트 중 추가/수정/삭제한 배너, 상품, 배틀 설정을 모두 지우고 최초 기본 샘플 상태로 원복합니다.
            </p>
            <button
              onClick={() => {
                if (confirm('정말로 모든 데이터를 기본값으로 초기화하시겠습니까? (되돌릴 수 없습니다)')) {
                  resetAllDataToDefaults();
                }
              }}
              className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-black rounded-xl transition-colors"
            >
              초기 데이터로 리셋하기
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: BANNER FORM ================= */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900">
                {editingBannerId ? '배너 정보 수정' : '새 메인 배너 등록'}
              </h3>
              <button onClick={() => setIsBannerModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBannerSubmit} className="p-4 overflow-y-auto space-y-3 text-xs flex-1">
              <div>
                <label className="block font-bold text-gray-700 mb-1">뱃지 문구</label>
                <input
                  type="text"
                  value={bannerForm.badge}
                  onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#0066FF]"
                  placeholder="예: ⚡ 오늘 출시 따끈한 신상"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">메인 타이틀</label>
                <input
                  type="text"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#0066FF]"
                  placeholder="예: 편의점 & 마트 신제품 솔직 후기"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">서브 타이틀</label>
                <input
                  type="text"
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#0066FF]"
                  placeholder="예: 먹어본 사람들의 진짜 별점"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">버튼 문구</label>
                <input
                  type="text"
                  value={bannerForm.buttonText}
                  onChange={(e) => setBannerForm({ ...bannerForm, buttonText: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#0066FF]"
                  placeholder="예: 보러가기"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">클릭 시 이동할 카테고리</label>
                <select
                  value={bannerForm.linkCategory}
                  onChange={(e) => setBannerForm({ ...bannerForm, linkCategory: e.target.value as ProductCategory })}
                  className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#0066FF] font-bold"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">배너 배경 이미지 URL</label>
                <input
                  type="text"
                  value={bannerForm.image}
                  onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#0066FF]"
                  placeholder="https://..."
                  required
                />
                {/* Image Presets */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {bannerImagePresets.map(p => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setBannerForm({ ...bannerForm, image: p.url })}
                      className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md font-semibold"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#0066FF] hover:bg-blue-600 text-white font-black rounded-xl shadow-sm transition-colors"
                >
                  {editingBannerId ? '수정 완료' : '배너 등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: PRODUCT FORM ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900">
                {editingProductId ? '상품 정보 수정' : '새 상품 등록'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="p-4 overflow-y-auto space-y-3 text-xs flex-1">
              <div>
                <label className="block font-bold text-gray-700 mb-1">상품명</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#0066FF]"
                  placeholder="예: 꼬북칩 바닐라맛 에디션"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">제조사 / 브랜드</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#0066FF]"
                    placeholder="예: 오리온"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">메인 카테고리</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => {
                      const newCat = e.target.value as ProductCategory;
                      setProductForm({ 
                        ...productForm, 
                        category: newCat,
                        subCategory: SUBCATEGORIES_MAP[newCat]?.[1] || '전체'
                      });
                    }}
                    className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#0066FF] font-bold"
                  >
                    {CATEGORIES.filter(c => c !== '전체' && c !== '신제품').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">세부 카테고리</label>
                <select
                  value={productForm.subCategory}
                  onChange={(e) => setProductForm({ ...productForm, subCategory: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#0066FF] font-bold"
                >
                  {(SUBCATEGORIES_MAP[productForm.category] || []).filter(s => s !== '전체').map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">가격 (원)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#0066FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">할인율 (%)</label>
                  <input
                    type="number"
                    value={productForm.discountRate}
                    onChange={(e) => setProductForm({ ...productForm, discountRate: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">상품 이미지 URL</label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#0066FF]"
                  placeholder="https://..."
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">상품 설명 / 한줄 요약</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#0066FF] resize-none"
                  placeholder="맛과 풍미에 대한 설명..."
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isToday}
                    onChange={(e) => setProductForm({ ...productForm, isToday: e.target.checked })}
                    className="rounded text-[#0066FF] w-4 h-4"
                  />
                  <span className="font-bold text-amber-700">⚡ 오늘의 신상으로 지정</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isHot}
                    onChange={(e) => setProductForm({ ...productForm, isHot: e.target.checked })}
                    className="rounded text-rose-500 w-4 h-4"
                  />
                  <span className="font-bold text-rose-600">🔥 인기 상품(HOT)</span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#0066FF] hover:bg-blue-600 text-white font-black rounded-xl shadow-sm transition-colors"
                >
                  {editingProductId ? '수정 완료' : '상품 등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
