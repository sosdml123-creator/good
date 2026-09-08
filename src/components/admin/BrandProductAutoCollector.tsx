import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Check,
  Zap,
  Edit3,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Store,
  Tag,
  Layers,
  ShoppingBag,
  X,
  Globe,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { ProductCategory, Product, PendingProduct } from '../../types';
import {
  OfficialCollectedProduct,
  CollectionSourceType,
  POPULAR_BRANDS,
  POPULAR_ITEMS,
  INSTAGRAM_FOOD_CHANNELS,
  crawlOfficialProductsByBrandAndCategory
} from '../../services/officialStoreCrawler';
import { ProductImageSelectorModal } from './ProductImageSelectorModal';

interface BrandProductAutoCollectorProps {
  isDark?: boolean;
  onAddProduct: (productData: Partial<Product> & { name: string; brand: string; category: ProductCategory; price: number }) => void;
  onAddToPending: (item: PendingProduct) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const BrandProductAutoCollector: React.FC<BrandProductAutoCollectorProps> = ({
  isDark = false,
  onAddProduct,
  onAddToPending,
  showToast
}) => {
  // Multi-source Channel Selection State
  const [activeSourceType, setActiveSourceType] = useState<CollectionSourceType>('all');

  // Brand & Category Selection States
  const [selectedBrand, setSelectedBrand] = useState<string>('농심');
  const [customBrandInput, setCustomBrandInput] = useState<string>('');
  const [selectedItemCategory, setSelectedItemCategory] = useState<string>('라면/면류');
  const [customItemInput, setCustomItemInput] = useState<string>('');

  // Crawler Action States
  const [isCrawling, setIsCrawling] = useState<boolean>(false);
  const [collectedProducts, setCollectedProducts] = useState<OfficialCollectedProduct[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<OfficialCollectedProduct | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  // High-Res Image Selector Modal State
  const [imageModalTarget, setImageModalTarget] = useState<{ id: string; brand: string; name: string; currentImage: string } | null>(null);

  // Styling helpers
  const cardBg = isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200';
  const subCardBg = isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200/80';
  const inputBg = isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400';

  // Active brand to query
  const effectiveBrand = (customBrandInput.trim() || selectedBrand).trim();
  // Active category/keyword to query
  const effectiveItem = (customItemInput.trim() || selectedItemCategory).trim();

  // Run Crawl
  const handleRunCrawl = async () => {
    setIsCrawling(true);

    const sourceLabel = 
      activeSourceType === 'official' ? '제조사 공식 홈페이지/직영몰' :
      activeSourceType === 'instagram' ? '인스타그램 & SNS 핫신상' :
      activeSourceType === 'convenience' ? '편의점 4사 공식 앱' :
      activeSourceType === 'news' ? '공식 론칭 보도자료' : '전체 채널 통합';

    showToast(`🔍 [${sourceLabel}] ${effectiveBrand || '전체'} ${effectiveItem || ''} 실물 패키지 및 제품을 수집 중입니다...`, 'info');

    try {
      const results = await crawlOfficialProductsByBrandAndCategory(effectiveBrand, effectiveItem, activeSourceType, 24);
      setCollectedProducts(results);
      setSelectedIds(results.map(r => r.id)); // 기본 전체 선택
      setRegisteredIds(new Set());

      if (results.length > 0) {
        showToast(`✨ [${sourceLabel}]에서 ${results.length}개의 정품 제품과 고화질 이미지를 수집했습니다!`, 'success');
      } else {
        showToast('검색 조건에 맞는 공식 제품을 찾지 못했습니다. 키워드를 변경해보세요.', 'info');
      }
    } catch (err) {
      console.error('Crawl Error:', err);
      showToast('제품 수집 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
    } finally {
      setIsCrawling(false);
    }
  };

  // Image Selector Callback
  const handleSelectImageForTarget = (newImageUrl: string) => {
    if (!imageModalTarget) return;
    const targetId = imageModalTarget.id;
    setCollectedProducts(prev =>
      prev.map(p => p.id === targetId ? { ...p, image: newImageUrl } : p)
    );
    if (editingItem && editingItem.id === targetId) {
      setEditingItem(prev => prev ? { ...prev, image: newImageUrl } : null);
    }
    showToast('제품 이미지가 고화질 패키지컷으로 변경되었습니다!', 'success');
    setImageModalTarget(null);
  };

  // Toggle single selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Select all / Deselect all
  const handleToggleSelectAll = () => {
    if (selectedIds.length === collectedProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(collectedProducts.map(p => p.id));
    }
  };

  // Register single product directly to main products
  const handleRegisterProduct = (item: OfficialCollectedProduct) => {
    onAddProduct({
      name: item.name,
      brand: item.brand,
      category: item.category,
      subCategory: item.subCategory,
      price: item.price,
      discountRate: item.discountRate || 0,
      image: item.image,
      description: item.description,
      stores: item.stores,
      volume: item.volume,
      calories: item.calories,
      isToday: item.isToday,
      isHot: item.isHot,
      releaseDate: item.releaseDate
    });

    setRegisteredIds(prev => new Set(prev).add(item.id));
    showToast(`✅ '${item.name}' 상품이 앱에 즉시 정식 등록되었습니다!`, 'success');
  };

  // Add single product to pending queue
  const handleAddToPending = (item: OfficialCollectedProduct) => {
    const pendingItem: PendingProduct = {
      id: `pending-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: item.name,
      brand: item.brand,
      category: item.category,
      subCategory: item.subCategory,
      price: item.price,
      image: item.image,
      description: item.description,
      stores: item.stores,
      releaseDate: item.releaseDate || `${new Date().toISOString().split('T')[0]} 공식 등록`,
      crawledAt: item.crawledAt,
      status: 'pending',
      sourceName: item.mallName,
      sourceUrl: item.productLink
    };

    onAddToPending(pendingItem);
    setRegisteredIds(prev => new Set(prev).add(item.id));
    showToast(`📥 '${item.name}' 상품이 승인 대기함으로 전송되었습니다!`, 'info');
  };

  // Bulk Register Selected Products directly
  const handleBulkRegisterSelected = () => {
    const selectedItems = collectedProducts.filter(p => selectedIds.includes(p.id) && !registeredIds.has(p.id));
    if (selectedItems.length === 0) {
      showToast('등록할 미등록 상품을 선택해주세요.', 'info');
      return;
    }

    selectedItems.forEach(item => {
      onAddProduct({
        name: item.name,
        brand: item.brand,
        category: item.category,
        subCategory: item.subCategory,
        price: item.price,
        discountRate: item.discountRate || 0,
        image: item.image,
        description: item.description,
        stores: item.stores,
        volume: item.volume,
        calories: item.calories,
        isToday: item.isToday,
        isHot: item.isHot,
        releaseDate: item.releaseDate
      });
    });

    setRegisteredIds(prev => {
      const next = new Set(prev);
      selectedItems.forEach(i => next.add(i.id));
      return next;
    });

    showToast(`🎉 선택한 ${selectedItems.length}개의 상품이 앱에 즉시 정식 등록되었습니다!`, 'success');
  };

  // Bulk Add Selected Products to Pending Queue
  const handleBulkAddToPendingSelected = () => {
    const selectedItems = collectedProducts.filter(p => selectedIds.includes(p.id) && !registeredIds.has(p.id));
    if (selectedItems.length === 0) {
      showToast('전송할 미등록 상품을 선택해주세요.', 'info');
      return;
    }

    selectedItems.forEach(item => {
      const pendingItem: PendingProduct = {
        id: `pending-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: item.name,
        brand: item.brand,
        category: item.category,
        subCategory: item.subCategory,
        price: item.price,
        image: item.image,
        description: item.description,
        stores: item.stores,
        releaseDate: item.releaseDate || `${new Date().toISOString().split('T')[0]} 공식 등록`,
        crawledAt: item.crawledAt,
        status: 'pending',
        sourceName: item.mallName,
        sourceUrl: item.productLink
      };
      onAddToPending(pendingItem);
    });

    setRegisteredIds(prev => {
      const next = new Set(prev);
      selectedItems.forEach(i => next.add(i.id));
      return next;
    });

    showToast(`📥 선택한 ${selectedItems.length}개의 상품이 승인 대기함으로 일괄 전송되었습니다!`, 'info');
  };

  // Delete product from collected list
  const handleDeleteFromCollected = (id: string) => {
    setCollectedProducts(prev => prev.filter(p => p.id !== id));
    setSelectedIds(prev => prev.filter(i => i !== id));
  };

  // Save edited product
  const handleSaveEdit = () => {
    if (!editingItem) return;
    setCollectedProducts(prev =>
      prev.map(p => (p.id === editingItem.id ? editingItem : p))
    );
    setIsEditModalOpen(false);
    showToast('상품 정보가 성공적으로 수정되었습니다.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className={`p-6 rounded-2xl border shadow-sm space-y-3 ${cardBg}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>공식몰·홈페이지 실시간 신제품 자동수집기</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                <Store className="w-3 h-3 text-indigo-500" />
                <span>공식 패키지컷 & 실시간 정가 추출</span>
              </span>
            </div>
            <h2 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              브랜드 & 품목 지정 공식 제품 자동 수집 및 등록
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
              원하는 <strong>브랜드(농심, 오뚜기, 스타벅스, CU 등)</strong>나 <strong>품목(라면, 스낵, 음료, 디저트 등)</strong>을 선택하거나 말씀하시면, 각사 공식 쇼핑몰 및 홈페이지에 등록된 정품 제품명, 고화질 패키지 이미지, 실제 판매 가격을 실시간으로 가져옵니다.
            </p>
          </div>

          <button
            onClick={handleRunCrawl}
            disabled={isCrawling}
            className="px-5 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:via-orange-400 hover:to-rose-400 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 min-w-[190px]"
          >
            {isCrawling ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>공식 데이터 수집 중...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current text-yellow-200" />
                <span>공식 제품 실시간 자동 수집</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Channel Selector Bar (수집 출처 채널 선택) */}
      <div className={`p-5 rounded-2xl border shadow-sm ${cardBg} space-y-3`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-black flex items-center justify-center shadow-xs">
              <Globe className="w-3 h-3" />
            </span>
            <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              신제품 수집 출처 채널 선택
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            원하는 수집 소스를 선택하면 해당 채널에 특화된 신제품과 패키지컷을 가져옵니다.
          </span>
        </div>

        {/* Channel Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          <button
            onClick={() => setActiveSourceType('all')}
            className={`p-3 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1.5 border ${
              activeSourceType === 'all'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-600 shadow-md ring-2 ring-amber-500/20'
                : isDark ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <span className="text-base">🌟</span>
            <span>전체 채널 통합</span>
          </button>

          <button
            onClick={() => setActiveSourceType('official')}
            className={`p-3 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1.5 border ${
              activeSourceType === 'official'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-700 shadow-md ring-2 ring-blue-500/20'
                : isDark ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <span className="text-base">🏢</span>
            <span>제조사 공식몰·홈페이지</span>
          </button>

          <button
            onClick={() => setActiveSourceType('instagram')}
            className={`p-3 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1.5 border ${
              activeSourceType === 'instagram'
                ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white border-rose-600 shadow-md ring-2 ring-rose-500/20'
                : isDark ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <span className="text-base">📸</span>
            <span>인스타그램 & SNS 핫신상</span>
          </button>

          <button
            onClick={() => setActiveSourceType('convenience')}
            className={`p-3 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1.5 border ${
              activeSourceType === 'convenience'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/20'
                : isDark ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <span className="text-base">🏪</span>
            <span>편의점 4사 공식 앱</span>
          </button>

          <button
            onClick={() => setActiveSourceType('news')}
            className={`p-3 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1.5 border ${
              activeSourceType === 'news'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-700 shadow-md ring-2 ring-purple-500/20'
                : isDark ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <span className="text-base">📰</span>
            <span>공식 론칭 보도자료</span>
          </button>
        </div>

        {/* Channel Special Assist Banner */}
        {activeSourceType === 'official' && (
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 shrink-0" />
              <span>
                <strong>농심몰, 오뚜기몰, CJ더마켓, 롯데스위트몰, 삼양몰, 서울우유 나100샵</strong> 등 각 제조사 본사 공식 홈페이지 및 직영 브랜드스토어에 정식 출시된 정품 정보를 수집합니다.
              </span>
            </div>
          </div>
        )}

        {activeSourceType === 'instagram' && (
          <div className="p-3 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs text-rose-600 dark:text-rose-400">
              <span className="font-bold flex items-center gap-1.5">
                <Camera className="w-4 h-4" />
                <span>인기 인스타그램 신제품 큐레이션 채널 빠른 타겟팅:</span>
              </span>
              <span className="text-[11px] text-slate-400">클릭 시 해당 채널 타겟팅</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {INSTAGRAM_FOOD_CHANNELS.map(ch => (
                <button
                  key={ch.handle}
                  onClick={() => {
                    setCustomBrandInput(ch.handle.replace('@', ''));
                    setCustomItemInput('');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1 shadow-2xs ${
                    customBrandInput === ch.handle.replace('@', '')
                      ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                      : isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                  }`}
                  title={ch.description}
                >
                  <span>{ch.icon}</span>
                  <span>{ch.name}</span>
                  <span className="text-[10px] opacity-70">({ch.handle})</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Brand & Item Selection Panel */}
      <div className={`p-6 rounded-2xl border shadow-sm space-y-5 ${cardBg}`}>
        {/* Step 1: Brand Selection */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[11px] font-black flex items-center justify-center">1</span>
              <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                브랜드 선택 또는 직접 입력
              </h3>
              <span className="text-[11px] text-slate-400 font-normal">
                (현재 선택: <strong className="text-amber-600 font-bold">{effectiveBrand || '미선택'}</strong>)
              </span>
            </div>

            {/* Direct Brand Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customBrandInput}
                onChange={e => setCustomBrandInput(e.target.value)}
                placeholder="브랜드 직접 입력 (예: 하림, 런던베이글)"
                className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 border ${inputBg}`}
              />
            </div>
          </div>

          {/* Brand Quick Chips */}
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1 no-scrollbar">
            {POPULAR_BRANDS.map(brand => {
              const isSelected = !customBrandInput && selectedBrand === brand.name;
              return (
                <button
                  key={brand.name}
                  onClick={() => {
                    setSelectedBrand(brand.name);
                    setCustomBrandInput('');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-2xs ${
                    isSelected
                      ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-500/20'
                      : isDark
                      ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                      : 'bg-white hover:bg-amber-50/70 text-slate-700 border-slate-200'
                  }`}
                >
                  <span>{brand.logo}</span>
                  <span>{brand.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={`border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`} />

        {/* Step 2: Category / Item Selection */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[11px] font-black flex items-center justify-center">2</span>
              <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                품목 및 제품군 선택 또는 검색어 입력
              </h3>
              <span className="text-[11px] text-slate-400 font-normal">
                (현재 품목: <strong className="text-orange-600 font-bold">{effectiveItem || '전체 신제품'}</strong>)
              </span>
            </div>

            {/* Direct Item/Keyword Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customItemInput}
                onChange={e => setCustomItemInput(e.target.value)}
                placeholder="품목/키워드 직접 입력 (예: 제로 탄산, 샌드위치)"
                className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/30 border ${inputBg}`}
              />
            </div>
          </div>

          {/* Item Quick Chips */}
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_ITEMS.map(item => {
              const isSelected = !customItemInput && selectedItemCategory === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setSelectedItemCategory(item.name);
                    setCustomItemInput('');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-2xs ${
                    isSelected
                      ? 'bg-orange-500 text-white border-orange-600 ring-2 ring-orange-500/20'
                      : isDark
                      ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                      : 'bg-white hover:bg-orange-50/70 text-slate-700 border-slate-200'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Query Target Summary Banner */}
        <div className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${subCardBg}`}>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-400">수집 타겟:</span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20 flex items-center gap-1">
              <Store className="w-3 h-3" />
              {effectiveBrand || '전체 브랜드'}
            </span>
            <span className="text-slate-400">×</span>
            <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold border border-orange-500/20 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {effectiveItem || '전체 품목'}
            </span>
            <span className="text-slate-400 text-[11px]">→ 공식 홈페이지 및 브랜드 스토어 정품 정보 실시간 연동</span>
          </div>

          <button
            onClick={handleRunCrawl}
            disabled={isCrawling}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
          >
            {isCrawling ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>이 조건으로 수집하기</span>
          </button>
        </div>
      </div>

      {/* 3. Collected Products Management & Bulk Action Bar */}
      {collectedProducts.length > 0 && (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${cardBg}`}>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedIds.length === collectedProducts.length && collectedProducts.length > 0}
                onChange={handleToggleSelectAll}
                className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-0 cursor-pointer"
              />
              <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                전체 선택 ({selectedIds.length}/{collectedProducts.length}개)
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                등록 완료: {registeredIds.size}개
              </span>
            </div>

            {/* Bulk Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleBulkRegisterSelected}
                disabled={selectedIds.length === 0}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-40"
              >
                <Check className="w-3.5 h-3.5" />
                <span>선택 {selectedIds.length}개 앱에 즉시 정식 등록</span>
              </button>

              <button
                onClick={handleBulkAddToPendingSelected}
                disabled={selectedIds.length === 0}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-40"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>선택 {selectedIds.length}개 승인 대기함 전송</span>
              </button>

              <button
                onClick={() => {
                  setCollectedProducts([]);
                  setSelectedIds([]);
                  setRegisteredIds(new Set());
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                }`}
              >
                목록 비우기
              </button>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collectedProducts.map(product => {
              const isSelected = selectedIds.includes(product.id);
              const isRegistered = registeredIds.has(product.id);

              return (
                <div
                  key={product.id}
                  className={`rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected ? (isDark ? 'ring-2 ring-amber-500/40 border-amber-500/50' : 'ring-2 ring-amber-500 border-amber-400') : ''
                  } ${isRegistered ? 'opacity-70 bg-emerald-500/5' : ''} ${cardBg}`}
                >
                  {/* Card Header & Checkbox */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      {/* Checkbox */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(product.id)}
                          className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-0 cursor-pointer mt-0.5"
                        />
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          {product.officialMallBadge}
                        </span>
                      </div>

                      {isRegistered && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>등록완료</span>
                        </span>
                      )}
                    </div>

                    {/* Product Image & Info Split */}
                    <div className="flex gap-3">
                      {/* Product Official Image with Hover Overlay */}
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 overflow-hidden shrink-0 relative group">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain object-center transition-transform group-hover:scale-105 p-1"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://shopping-phinf.pstatic.net/main_4187063/41870638618.20230814143219.jpg';
                          }}
                        />
                        {product.isOfficialMall && (
                          <span className="absolute bottom-1 right-1 bg-slate-950/80 text-white text-[9px] font-black px-1.5 py-0.5 rounded backdrop-blur-xs">
                            정품
                          </span>
                        )}

                        {/* Image Swap Quick Overlay */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageModalTarget({
                              id: product.id,
                              brand: product.brand,
                              name: product.name,
                              currentImage: product.image
                            });
                          }}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white text-[10px] font-bold cursor-pointer"
                          title="고화질 이미지 검색 및 교체"
                        >
                          <ImageIcon className="w-4 h-4 text-amber-400" />
                          <span>이미지 교체</span>
                        </button>
                      </div>

                      {/* Info */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                          <span>{product.brand}</span>
                          <span>•</span>
                          <span className="text-amber-500 font-semibold">{product.category}</span>
                        </div>

                        <h4 className={`text-xs font-black line-clamp-2 leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`} title={product.name}>
                          {product.name}
                        </h4>

                        {/* Price Display */}
                        <div className="flex items-baseline gap-1.5 pt-0.5">
                          <span className="text-base font-black text-rose-600 dark:text-rose-400 font-mono">
                            {product.price.toLocaleString()}원
                          </span>
                          <span className="text-[10px] text-slate-400">공식 판매가</span>
                        </div>

                        {/* Stores Tag */}
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {product.stores.map(s => (
                            <span key={s} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Instagram Hashtags or Channel Tags */}
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {product.tags.map((t, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Instagram influencer quote if present */}
                    {product.instagramInfo?.quote && (
                      <p className="text-[11px] text-pink-600 dark:text-pink-300 italic bg-pink-50 dark:bg-pink-950/30 p-2 rounded-lg border border-pink-100 dark:border-pink-900/40">
                        💬 "{product.instagramInfo.quote}"
                      </p>
                    )}

                    {/* Short Description */}
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                      {product.description}
                    </p>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className={`p-3 border-t flex items-center justify-between gap-1.5 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'}`}>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setImageModalTarget({
                          id: product.id,
                          brand: product.brand,
                          name: product.name,
                          currentImage: product.image
                        })}
                        className={`p-1.5 rounded-lg border text-slate-500 hover:text-amber-600 transition-colors ${
                          isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
                        }`}
                        title="고화질 정품 패키지 이미지 교체"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                      </button>

                      <button
                        onClick={() => {
                          setEditingItem(product);
                          setIsEditModalOpen(true);
                        }}
                        className={`p-1.5 rounded-lg border text-slate-500 hover:text-indigo-600 transition-colors ${
                          isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
                        }`}
                        title="상품 정보 수정"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteFromCollected(product.id)}
                        className={`p-1.5 rounded-lg border text-slate-400 hover:text-rose-500 transition-colors ${
                          isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
                        }`}
                        title="목록에서 제거"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleAddToPending(product)}
                        disabled={isRegistered}
                        className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/60 rounded-xl text-[11px] font-bold transition-all disabled:opacity-40"
                      >
                        대기함 전송
                      </button>

                      <button
                        onClick={() => handleRegisterProduct(product)}
                        disabled={isRegistered}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-black shadow-xs transition-all flex items-center gap-1 disabled:opacity-40"
                      >
                        <Check className="w-3 h-3" />
                        <span>즉시 정식 등록</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State when no items crawled yet */}
      {collectedProducts.length === 0 && !isCrawling && (
        <div className={`p-12 rounded-2xl border border-dashed text-center space-y-4 ${isDark ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-white'}`}>
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              원하는 브랜드와 품목을 선택하여 공식 제품을 수집해보세요
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              상단의 브랜드(예: 농심, 스타벅스, CU 등)와 품목(예: 라면, 음료, 디저트 등)을 클릭한 후 <strong>[공식 제품 실시간 자동 수집]</strong> 버튼을 누르면 고화질 패키지컷과 정확한 가격이 포함된 최신 제품 리스트가 생성됩니다.
            </p>
          </div>
          <button
            onClick={handleRunCrawl}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded-xl text-xs font-black shadow-sm inline-flex items-center gap-1.5 transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>현재 설정({effectiveBrand} × {effectiveItem})으로 즉시 수집</span>
          </button>
        </div>
      )}

      {/* 4. Edit Product Modal */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${cardBg}`}>
            {/* Modal Header */}
            <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-500" />
                <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  수집 제품 정보 수정
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto">
              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">제품명</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl text-xs border ${inputBg}`}
                />
              </div>

              {/* Brand & Category & Price Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">브랜드</label>
                  <input
                    type="text"
                    value={editingItem.brand}
                    onChange={e => setEditingItem({ ...editingItem, brand: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">카테고리</label>
                  <select
                    value={editingItem.category}
                    onChange={e => setEditingItem({ ...editingItem, category: e.target.value as ProductCategory })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${inputBg}`}
                  >
                    <option value="신제품">신제품</option>
                    <option value="과자">과자</option>
                    <option value="음료">음료</option>
                    <option value="빵·디저트">빵·디저트</option>
                    <option value="간편식">간편식</option>
                    <option value="기타">기타</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">판매 가격 (원)</label>
                  <input
                    type="number"
                    value={editingItem.price}
                    onChange={e => setEditingItem({ ...editingItem, price: parseInt(e.target.value, 10) || 0 })}
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">제품 대표 이미지 URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingItem.image}
                    onChange={e => setEditingItem({ ...editingItem, image: e.target.value })}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs border ${inputBg}`}
                  />
                  <button
                    type="button"
                    onClick={() => setImageModalTarget({
                      id: editingItem.id,
                      brand: editingItem.brand,
                      name: editingItem.name,
                      currentImage: editingItem.image
                    })}
                    className="px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>고화질 검색</span>
                  </button>
                  <div className="w-10 h-10 rounded-lg overflow-hidden border shrink-0 bg-white p-0.5">
                    <img src={editingItem.image} alt="preview" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">제품 설명</label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl text-xs border ${inputBg}`}
                />
              </div>

              {/* Volume & Calories */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">용량/중량</label>
                  <input
                    type="text"
                    value={editingItem.volume || ''}
                    onChange={e => setEditingItem({ ...editingItem, volume: e.target.value })}
                    placeholder="예: 120g, 350ml"
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">칼로리 (kcal)</label>
                  <input
                    type="number"
                    value={editingItem.calories || ''}
                    onChange={e => setEditingItem({ ...editingItem, calories: parseInt(e.target.value, 10) || undefined })}
                    placeholder="예: 450"
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex items-center justify-end gap-2 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'}`}>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
                  isDark ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-700'
                }`}
              >
                취소
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                수정 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. High-Res Image Selector Modal */}
      {imageModalTarget && (
        <ProductImageSelectorModal
          isOpen={!!imageModalTarget}
          onClose={() => setImageModalTarget(null)}
          brand={imageModalTarget.brand}
          productName={imageModalTarget.name}
          currentImage={imageModalTarget.currentImage}
          onSelectImage={handleSelectImageForTarget}
          isDark={isDark}
        />
      )}
    </div>
  );
};
