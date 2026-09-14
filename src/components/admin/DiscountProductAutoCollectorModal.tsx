import React, { useState, useMemo } from 'react';
import { 
  X, 
  Zap, 
  Search, 
  Check, 
  ExternalLink, 
  RotateCcw, 
  CheckCircle2, 
  Plus, 
  ShieldCheck, 
  Utensils, 
  Sparkles,
  Edit3
} from 'lucide-react';
import { SalePromotionItem, SaleDealType, SaleStoreType, ProductCategory } from '../../types';
import { 
  CVS_STORE_PRESETS, 
  CollectedDiscountProduct, 
  DiscountCrawlResult, 
  crawlDiscountProducts
} from '../../services/discountCrawler';

interface DiscountProductAutoCollectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  existingSales: SalePromotionItem[];
  onBatchAddSales: (items: SalePromotionItem[]) => void;
  onAddSingleSale: (item: SalePromotionItem) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const DiscountProductAutoCollectorModal: React.FC<DiscountProductAutoCollectorModalProps> = ({
  isOpen,
  onClose,
  isDark,
  existingSales,
  onBatchAddSales,
  onAddSingleSale,
  showToast
}) => {
  if (!isOpen) return null;

  // Selected Store & URL
  const [selectedStore, setSelectedStore] = useState<SaleStoreType>('CU');
  const [targetUrl, setTargetUrl] = useState<string>(
    'https://cu.bgfretail.com/event/plus.do?category=event&depth2=1&sf=N'
  );
  const [isCustomUrl, setIsCustomUrl] = useState<boolean>(false);

  // Crawler options
  const [selectedDealType, setSelectedDealType] = useState<string>('전체');
  const [onlyFood, setOnlyFood] = useState<boolean>(true);
  const [pageCount, setPageCount] = useState<number>(1);

  // Crawler states
  const [isCrawling, setIsCrawling] = useState<boolean>(false);
  const [crawlResult, setCrawlResult] = useState<DiscountCrawlResult | null>(null);
  const [collectedItems, setCollectedItems] = useState<CollectedDiscountProduct[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());

  // Quick Edit Modal State
  const [editingItem, setEditingItem] = useState<CollectedDiscountProduct | null>(null);

  // Existing names set for fast duplicate detection
  const existingNamesSet = useMemo(() => {
    return new Set(
      existingSales.map(s => s.title.replace(/\s+/g, '').toLowerCase())
    );
  }, [existingSales]);

  // Handle store change
  const handleStoreChange = (store: SaleStoreType) => {
    setSelectedStore(store);
    setIsCustomUrl(false);
    const preset = CVS_STORE_PRESETS.find(p => p.key === store);
    if (preset) {
      setTargetUrl(preset.url);
    }
  };

  // Run Crawler
  const handleStartCrawl = async () => {
    setIsCrawling(true);
    showToast(`🔍 [${selectedStore}] 행사상품 및 할인 데이터를 수집 중입니다...`, 'info');

    try {
      const result = await crawlDiscountProducts({
        store: selectedStore,
        customUrl: targetUrl,
        page: pageCount,
        onlyFood: onlyFood,
        dealType: selectedDealType
      });

      setCrawlResult(result);
      setCollectedItems(result.items);

      // Default select all non-registered items
      const newSelected = result.items
        .filter(item => {
          const norm = item.title.replace(/\s+/g, '').toLowerCase();
          return !existingNamesSet.has(norm);
        })
        .map(i => i.id);

      setSelectedIds(newSelected);
      setRegisteredIds(new Set());

      if (result.items.length > 0) {
        showToast(
          `✨ [${selectedStore}] ${result.foodCount}개 음식 상품 수집 완료! (${result.excludedCount}개 비식품 자동 제외)`,
          'success'
        );
      } else {
        showToast('조건에 맞는 행사 상품을 찾지 못했습니다.', 'info');
      }
    } catch (err) {
      console.error('Crawl Error:', err);
      showToast('행사상품 수집 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
    } finally {
      setIsCrawling(false);
    }
  };

  // Toggle single item selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Toggle select all
  const handleToggleSelectAll = () => {
    if (selectedIds.length === collectedItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(collectedItems.map(i => i.id));
    }
  };

  // Single Add
  const handleAddSingle = (item: CollectedDiscountProduct) => {
    onAddSingleSale(item);
    setRegisteredIds(prev => new Set(prev).add(item.id));
    showToast(`✅ '${item.title}' (${item.badgeText}) 세일 피드에 등록 완료!`, 'success');
  };

  // Batch Add
  const handleBatchAdd = () => {
    const toAdd = collectedItems.filter(
      item => selectedIds.includes(item.id) && !registeredIds.has(item.id)
    );

    if (toAdd.length === 0) {
      showToast('등록할 상품을 선택해주세요.', 'info');
      return;
    }

    onBatchAddSales(toAdd);
    setRegisteredIds(prev => {
      const next = new Set(prev);
      toAdd.forEach(i => next.add(i.id));
      return next;
    });

    showToast(`🎉 선택한 ${toAdd.length}개 행사 상품이 세일 피드에 일괄 등록되었습니다!`, 'success');
  };

  // Save quick edit
  const handleSaveQuickEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setCollectedItems(prev =>
      prev.map(i => (i.id === editingItem.id ? editingItem : i))
    );
    showToast(`수정사항이 반영되었습니다.`, 'success');
    setEditingItem(null);
  };

  const cardBg = isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900';
  const subCardBg = isDark ? 'bg-slate-850 border-slate-800' : 'bg-slate-50 border-slate-200';
  const inputBg = isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className={`rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border ${cardBg}`}>
        
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-rose-500/20">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base">편의점 할인 행사상품 자동 수집기</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                  실시간 연동 & 식품 전용
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                편의점 공식 사이트에서 1+1, 2+1 행사상품을 탐색하고, 비식품을 제외한 순수 음식 제품만 자동 선별합니다.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* 1. Store Preset Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              1. 수집 대상 편의점 브랜드 선택
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CVS_STORE_PRESETS.map(preset => {
                const isSelected = selectedStore === preset.key && !isCustomUrl;
                return (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => handleStoreChange(preset.key)}
                    className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 shadow-sm ring-1 ring-rose-500'
                        : `${subCardBg} hover:border-slate-300 dark:hover:border-slate-700`
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-lg">{preset.logo}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${preset.badgeBg}`}>
                        {preset.key}
                      </span>
                    </div>
                    <div className="font-bold text-xs">{preset.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">{preset.badgeText}</div>
                    {isSelected && (
                      <div className="absolute right-2 bottom-2 text-rose-500">
                        <CheckCircle2 className="w-4 h-4 fill-current" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Target URL Configuration */}
          <div className={`p-4 rounded-2xl border space-y-3 ${subCardBg}`}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-rose-500" />
                <span>2. 실시간 크롤링 대상 공식 URL</span>
                {selectedStore === 'CU' && (
                  <span className="px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                    CU 지정 URL 연동됨
                  </span>
                )}
              </label>

              <a
                href={targetUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-bold"
              >
                <span>웹사이트 원본 열기</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="url"
                value={targetUrl}
                onChange={e => {
                  setTargetUrl(e.target.value);
                  setIsCustomUrl(true);
                }}
                placeholder="https://... 편의점 행사 페이지 주소"
                className={`flex-1 p-2.5 rounded-xl text-xs border font-mono ${inputBg}`}
              />
              <button
                type="button"
                onClick={() => {
                  const preset = CVS_STORE_PRESETS.find(p => p.key === selectedStore);
                  if (preset) setTargetUrl(preset.url);
                  setIsCustomUrl(false);
                  showToast('기본 공식 URL로 재설정되었습니다.', 'info');
                }}
                className="px-3 py-2.5 rounded-xl text-xs font-bold text-slate-500 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="기본 URL 초기화"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3. Filter Options & Strict Food Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Deal Type Filter */}
            <div className={`p-3.5 rounded-2xl border ${cardBg}`}>
              <label className="block text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                행사 유형 필터
              </label>
              <select
                value={selectedDealType}
                onChange={e => setSelectedDealType(e.target.value)}
                className={`w-full p-2 rounded-xl text-xs border font-bold ${inputBg}`}
              >
                <option value="전체">전체 행사 (1+1 & 2+1 & 특가)</option>
                <option value="1+1">1+1 행사만</option>
                <option value="2+1">2+1 행사만</option>
                <option value="할인특가">할인특가만</option>
              </select>
            </div>

            {/* Page Count Filter */}
            <div className={`p-3.5 rounded-2xl border ${cardBg}`}>
              <label className="block text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                수집 페이지 범위
              </label>
              <select
                value={pageCount}
                onChange={e => setPageCount(Number(e.target.value))}
                className={`w-full p-2 rounded-xl text-xs border font-bold ${inputBg}`}
              >
                <option value={1}>1페이지 (약 40개 상품 탐색)</option>
                <option value={2}>2페이지 (약 80개 상품 탐색)</option>
                <option value={3}>3페이지 (약 120개 상품 탐색)</option>
              </select>
            </div>

            {/* Strict Food Filter Toggle */}
            <div className={`p-3.5 rounded-2xl border flex flex-col justify-between ${
              onlyFood ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/40' : cardBg
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Utensils className={`w-4 h-4 ${onlyFood ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold">음식 제품만 수집</span>
                </div>
                <input
                  type="checkbox"
                  id="onlyFoodCheckbox"
                  checked={onlyFood}
                  onChange={e => setOnlyFood(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 w-4 h-4 cursor-pointer"
                />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                칫솔·치약·생리대·샴푸·세제 등 비식품 100% 자동 제외
              </p>
            </div>
          </div>

          {/* Crawl Trigger Button */}
          <div className="flex items-center justify-center pt-1">
            <button
              type="button"
              onClick={handleStartCrawl}
              disabled={isCrawling}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25 active:scale-95 transition-all"
            >
              {isCrawling ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>실시간 행사상품 탐색 및 필터링 중...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>[{selectedStore}] 실시간 할인 행사상품 수집 시작</span>
                </>
              )}
            </button>
          </div>

          {/* 4. Results Section */}
          {crawlResult && (
            <div className="space-y-3 pt-2">
              {/* Stats & Actions Bar */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${subCardBg}`}>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
                  <div className="flex items-center gap-1 font-bold">
                    <Sparkles className="w-4 h-4 text-rose-500" />
                    <span>총 탐색: <strong className="font-mono">{crawlResult.totalParsed}</strong>개</span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-700">&middot;</span>
                  <div className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                    <Utensils className="w-3.5 h-3.5" />
                    <span>선별된 음식: <strong className="font-mono">{crawlResult.foodCount}</strong>개</span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-700">&middot;</span>
                  <div className="flex items-center gap-1 font-bold text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>비식품 자동제외: <strong className="font-mono">{crawlResult.excludedCount}</strong>개</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                  >
                    {selectedIds.length === collectedItems.length ? '전체 해제' : '전체 선택'}
                  </button>
                  <span className="text-xs font-bold text-slate-500">
                    {selectedIds.length}개 선택됨
                  </span>
                </div>
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {collectedItems.map(item => {
                  const isSelected = selectedIds.includes(item.id);
                  const isRegistered = registeredIds.has(item.id);
                  const norm = item.title.replace(/\s+/g, '').toLowerCase();
                  const isAlreadyInApp = existingNamesSet.has(norm);

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleToggleSelect(item.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 shadow-sm ring-1 ring-rose-500'
                          : `${cardBg} hover:border-slate-300 dark:hover:border-slate-700`
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Checkbox */}
                        <div className="pt-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // Controlled by parent card click
                            className="rounded border-slate-300 text-rose-600 w-4 h-4 cursor-pointer"
                          />
                        </div>

                        {/* Image */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600';
                            }}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white ${
                              item.dealType === '1+1' ? 'bg-rose-500' :
                              item.dealType === '2+1' ? 'bg-orange-500' : 'bg-emerald-600'
                            }`}>
                              {item.badgeText}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                              {item.category}
                            </span>
                            {isAlreadyInApp && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[9px] font-bold">
                                앱에 등록됨
                              </span>
                            )}
                          </div>

                          <h4 className="font-bold text-xs truncate" title={item.title}>
                            {item.title}
                          </h4>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {item.brand} &middot; {item.store}
                          </div>

                          <div className="mt-1.5 flex items-baseline gap-1.5">
                            <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                              {item.salePrice.toLocaleString()}원
                            </span>
                            <span className="text-[10px] text-rose-500 font-bold">
                              {item.unitPriceDescription}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions Footer */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-[10px] font-mono text-slate-400">
                          {item.period} ({item.dDay})
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingItem(item);
                            }}
                            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            title="상품정보 미세조정"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {isRegistered ? (
                            <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-[10px] flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              등록완료
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddSingle(item);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] flex items-center gap-1 active:scale-95"
                            >
                              <Plus className="w-3 h-3" />
                              즉시등록
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Bottom Fixed Action Bar */}
        <div className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${subCardBg}`}>
          <div className="text-xs text-slate-500">
            {collectedItems.length > 0 ? (
              <span>
                수집된 상품 <strong>{collectedItems.length}</strong>개 중 <strong>{selectedIds.length}</strong>개 선택됨
              </span>
            ) : (
              <span>수집을 시작하려면 상단의 '행사상품 수집 시작' 버튼을 클릭하세요.</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            >
              닫기
            </button>
            <button
              type="button"
              onClick={handleBatchAdd}
              disabled={selectedIds.length === 0}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>선택한 {selectedIds.length}개 행사상품 일괄 등록</span>
            </button>
          </div>
        </div>

      </div>

      {/* Quick Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-2xl p-5 max-w-md w-full border shadow-2xl space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-sm">상품 정보 미세조정</h4>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1">상품명</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                  className={`w-full p-2 rounded-xl text-xs border ${inputBg}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">제조사 / 브랜드</label>
                  <input
                    type="text"
                    required
                    value={editingItem.brand}
                    onChange={e => setEditingItem({ ...editingItem, brand: e.target.value })}
                    className={`w-full p-2 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">식품 카테고리</label>
                  <select
                    value={editingItem.category}
                    onChange={e => setEditingItem({ ...editingItem, category: e.target.value as ProductCategory })}
                    className={`w-full p-2 rounded-xl text-xs border ${inputBg}`}
                  >
                    <option value="간편식">간편식</option>
                    <option value="음료">음료</option>
                    <option value="과자">과자</option>
                    <option value="빵·디저트">빵·디저트</option>
                    <option value="아이스크림">아이스크림</option>
                    <option value="신제품">신제품</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">행사 유형</label>
                  <select
                    value={editingItem.dealType}
                    onChange={e => setEditingItem({ ...editingItem, dealType: e.target.value as SaleDealType, badgeText: e.target.value })}
                    className={`w-full p-2 rounded-xl text-xs border ${inputBg}`}
                  >
                    <option value="1+1">1+1</option>
                    <option value="2+1">2+1</option>
                    <option value="할인특가">할인특가</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">행사가격 (원)</label>
                  <input
                    type="number"
                    value={editingItem.salePrice}
                    onChange={e => {
                      const sp = Number(e.target.value);
                      let orig = sp;
                      let unitDesc = '';
                      if (editingItem.dealType === '1+1') {
                        orig = sp * 2;
                        unitDesc = `개당 ${Math.round(sp / 2).toLocaleString()}원 꼴`;
                      } else if (editingItem.dealType === '2+1') {
                        orig = sp * 3;
                        unitDesc = `개당 ${Math.round((sp * 2) / 3).toLocaleString()}원 꼴`;
                      }
                      setEditingItem({
                        ...editingItem,
                        salePrice: sp,
                        originalPrice: orig,
                        unitPriceDescription: unitDesc
                      });
                    }}
                    className={`w-full p-2 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">이미지 URL</label>
                <input
                  type="url"
                  value={editingItem.image}
                  onChange={e => setEditingItem({ ...editingItem, image: e.target.value })}
                  className={`w-full p-2 rounded-xl text-xs border font-mono ${inputBg}`}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
