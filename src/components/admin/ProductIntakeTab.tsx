import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Clock,
  Edit3,
  ExternalLink,
  Image as ImageIcon,
  Inbox,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PendingProduct, ProductCategory } from '../../types';
import { CATEGORIES } from '../../data/mockProducts';
import {
  CollectReport,
  CollectSource,
  fetchPendingProducts,
  setPendingStatus,
} from '../../services/pendingProductsService';
import { FoodNutritionData } from '../../services/nutritionApi';
import { ProductImageSelectorModal } from './ProductImageSelectorModal';
import { FoodNutritionSearchModal } from './FoodNutritionSearchModal';

interface ProductIntakeTabProps {
  isDark: boolean;
}

const PAGE_SIZE = 60;

/** 대기함 필터용 판매처 이름 (편의점·마트·브랜드) */
const getSourceKey = (item: PendingProduct): string => item.stores[0] || '기타';

const formatDate = (value: string) => {
  const date = new Date(value);
  return isNaN(date.getTime()) ? value : date.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
};

/**
 * 신제품 수집·승인 (통합 화면)
 * 수집 → 대기함 검토 → 승인/반려를 한 화면에서 처리합니다.
 */
export const ProductIntakeTab: React.FC<ProductIntakeTabProps> = ({ isDark }) => {
  const {
    products,
    pendingProducts,
    pendingSetupError,
    isNaverCollectAvailable,
    refreshPendingProducts,
    collectNewProducts,
    approvePendingProducts,
    rejectPendingProducts,
    updatePendingProduct,
    showToast,
  } = useApp();

  const [view, setView] = useState<'pending' | 'rejected'>('pending');
  const [collecting, setCollecting] = useState<CollectSource | null>(null);
  const [reports, setReports] = useState<CollectReport[]>([]);
  const [newsQuery, setNewsQuery] = useState('');

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | '전체'>('전체');
  const [sourceFilter, setSourceFilter] = useState<string>('전체');
  const [onlyMissingImage, setOnlyMissingImage] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const [rejectedItems, setRejectedItems] = useState<PendingProduct[]>([]);
  const [isLoadingRejected, setIsLoadingRejected] = useState(false);

  const [editing, setEditing] = useState<PendingProduct | null>(null);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [isNutritionSearchOpen, setIsNutritionSearchOpen] = useState(false);
  const [zoomed, setZoomed] = useState<{ src: string; name: string } | null>(null);

  const cardBg = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-xs';
  const inputBg = isDark
    ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-500'
    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white';
  const subtleBtn = isDark
    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200';
  const titleText = isDark ? 'text-white' : 'text-slate-900';

  useEffect(() => {
    refreshPendingProducts();
  }, []);

  const loadRejected = async () => {
    setIsLoadingRejected(true);
    try {
      const { items } = await fetchPendingProducts('rejected');
      setRejectedItems(items);
    } catch (err) {
      showToast(err instanceof Error ? err.message : '반려 목록을 불러오지 못했습니다.', 'error');
    } finally {
      setIsLoadingRejected(false);
    }
  };

  useEffect(() => {
    if (view === 'rejected') loadRejected();
  }, [view]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, categoryFilter, sourceFilter, onlyMissingImage]);

  // 판매처별 건수 (많은 순)
  const sourceCounts = useMemo(() => {
    const counts = new Map<string, number>();
    pendingProducts.forEach((item) => {
      const key = getSourceKey(item);
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [pendingProducts]);

  const missingImageCount = useMemo(() => pendingProducts.filter((p) => !p.image).length, [pendingProducts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pendingProducts.filter((item) => {
      if (categoryFilter !== '전체' && item.category !== categoryFilter) return false;
      if (sourceFilter !== '전체' && getSourceKey(item) !== sourceFilter) return false;
      if (onlyMissingImage && item.image) return false;
      if (q && !`${item.name} ${item.brand}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [pendingProducts, search, categoryFilter, sourceFilter, onlyMissingImage]);

  const visible = filtered.slice(0, visibleCount);
  const filteredIds = useMemo(() => filtered.map((p) => p.id), [filtered]);
  const selectedInView = selectedIds.filter((id) => filteredIds.includes(id));
  const isAllSelected = filtered.length > 0 && selectedInView.length === filtered.length;

  const registeredNames = useMemo(
    () => new Set(products.map((p) => p.name.replace(/\s+/g, '').toLowerCase())),
    [products]
  );
  const isAlreadyRegistered = (name: string) => registeredNames.has(name.replace(/\s+/g, '').toLowerCase());

  const handleCollect = async (source: CollectSource, query?: string) => {
    setCollecting(source);
    setReports([]);
    try {
      const result = await collectNewProducts(source, query);
      setReports(result);
      const inserted = result.reduce((sum, r) => sum + r.inserted, 0);
      if (result.length > 0) {
        showToast(
          inserted > 0 ? `새 상품 ${inserted}건을 대기함에 담았습니다.` : result.some(r => !r.ok)
            ? '일부 수집에 실패했습니다. 아래 소스별 오류를 확인해주세요.' : '추가된 상품이 없습니다. 중복·사진 검수 결과를 확인해주세요.',
          inserted > 0 ? 'success' : result.some(r => !r.ok) ? 'error' : 'info'
        );
      }
    } finally {
      setCollecting(null);
    }
  };

  const handleApprove = async (ids: string[]) => {
    if (ids.length === 0 || busy) return;
    setBusy(true);
    try {
      const approved = await approvePendingProducts(ids);
      if (approved > 0) setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async (ids: string[]) => {
    if (ids.length === 0 || busy) return;
    if (ids.length > 1 && !confirm(`선택한 ${ids.length}건을 반려할까요? 반려한 상품은 다시 수집되지 않습니다.`)) return;
    setBusy(true);
    try {
      await rejectPendingProducts(ids);
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    } finally {
      setBusy(false);
    }
  };

  const handleRestore = async (item: PendingProduct) => {
    try {
      await setPendingStatus([item.id], 'pending');
      setRejectedItems((prev) => prev.filter((p) => p.id !== item.id));
      await refreshPendingProducts();
      showToast(`'${item.name}'을(를) 대기함으로 되돌렸습니다.`, 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : '복원에 실패했습니다.', 'error');
    }
  };

  const saveEditing = async (approveAfter: boolean) => {
    if (!editing || busy) return;
    if (!editing.name.trim() || !editing.brand.trim()) {
      showToast('상품명과 브랜드를 입력해주세요.', 'info');
      return;
    }
    if (approveAfter && !editing.image) {
      showToast('승인하려면 상품 이미지가 필요합니다.', 'info');
      return;
    }
    setBusy(true);
    try {
      const saved = await updatePendingProduct(editing.id, {
        name: editing.name.trim(),
        brand: editing.brand.trim(),
        category: editing.category,
        price: editing.price || 0,
        releaseDate: editing.releaseDate,
        stores: editing.stores,
        image: editing.image,
        description: editing.description,
        volume: editing.volume || undefined,
        calories: editing.calories || undefined,
        nutrition: editing.nutrition,
      });
      if (!saved) return;
      if (approveAfter) {
        if (!(await approvePendingProducts([editing.id]))) return;
      } else showToast('대기 상품 정보를 저장했습니다.', 'success');
      setEditing(null);
    } finally {
      setBusy(false);
    }
  };

  const pill = (active: boolean) =>
    `px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${
      active
        ? 'bg-indigo-600 text-white border-indigo-600'
        : isDark
          ? 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
          : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
    }`;

  return (
    <div className="space-y-5">
      {pendingSetupError && (
        <div className="p-4 rounded-2xl border border-rose-300 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">대기함 저장소가 아직 준비되지 않았습니다.</p>
            <p>{pendingSetupError}</p>
          </div>
        </div>
      )}

      {/* 1. 수집 (공식 사이트 + 뉴스 통합) */}
      <div className={`p-5 rounded-2xl border space-y-4 ${cardBg}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h2 className={`text-base font-black ${titleText}`}>신제품 수집</h2>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>매일 오전 9시에 자동으로 수집됩니다. 지금 바로 가져오려면 아래 버튼을 누르세요.</span>
            </p>
          </div>
          <button
            onClick={() => refreshPendingProducts()}
            className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${subtleBtn}`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>새로고침</span>
          </button>
        </div>

        <button
          onClick={() => handleCollect('all')}
          disabled={collecting !== null}
          className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${collecting === 'all' ? 'animate-spin' : ''}`} />
          <span>{collecting === 'all' ? '공식 홈페이지·뉴스·블로그 수집 및 사진 검수 중... (최대 5분)' : '신제품 전체 가져오기'}</span>
        </button>

        <div className={`p-3 rounded-xl border text-[11px] space-y-1 ${isDark ? 'border-slate-800 bg-slate-950/50 text-slate-400' : 'border-slate-200 bg-slate-50/70 text-slate-500'}`}>
          <p>
            <strong className={titleText}>공식 홈페이지</strong> — CU·세븐일레븐 신상품, 스타벅스·메가MGC커피·빽다방 신메뉴에서 상품명과 제품 사진을 가져옵니다. 가격은 공식 표기가 있을 때만 입력됩니다.
          </p>
          <p>
            <strong className={titleText}>뉴스·블로그</strong> — GS25, 이마트24, 이마트, 트레이더스, 노브랜드, 홈플러스, 롯데마트, 롯데슈퍼, GS더프레시, 코스트코와
            식품사·카페·외식 브랜드의 최근 30일 출시 소식을 찾습니다. 블로그 후보는 출시 여부를 원문에서 검토해주세요. 확인되지 않은 가격·출시일은 비워 둡니다.
          </p>
          <p>
            <strong className={titleText}>사진</strong> — 제품 사진이 확인된 상품만 담습니다. 사진이 없거나 사람이 나온 사진뿐인 상품은 제외하고 다음 수집 때 다시 찾습니다.
          </p>
          {!isNaverCollectAvailable && !pendingSetupError && (
            <p className="text-amber-600 dark:text-amber-400">
              네이버 검색 API 키가 없어 뉴스·블로그를 수집할 수 없습니다. 공식 홈페이지 수집은 가능합니다.
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {([['stores', '공식 홈페이지만'], ['news', '뉴스'], ['blog', '블로그']] as [CollectSource, string][]).map(([source, label]) => (
            <button key={source} onClick={() => handleCollect(source, source === 'stores' ? undefined : newsQuery)}
              disabled={collecting !== null || (source !== 'stores' && !isNaverCollectAvailable)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border disabled:opacity-50 ${subtleBtn}`}>
              {collecting === source ? `${label} 수집 중...` : label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newsQuery}
            onChange={(e) => setNewsQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && newsQuery.trim() && collecting === null && handleCollect('news', newsQuery)}
            placeholder="특정 브랜드·상품만 찾기 (예: 홈플러스, 스타벅스, 두바이 초콜릿)"
            className={`flex-1 min-w-0 px-3 py-2 rounded-xl text-xs border focus:outline-none ${inputBg}`}
          />
          <button
            onClick={() => handleCollect('news', newsQuery)}
            disabled={collecting !== null || !newsQuery.trim() || !isNaverCollectAvailable}
            className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 disabled:opacity-50 shrink-0 ${subtleBtn}`}
          >
            <Search className={`w-3.5 h-3.5 ${collecting === 'news' ? 'animate-pulse' : ''}`} />
            <span>{collecting === 'news' ? '찾는 중...' : '이 키워드로 찾기'}</span>
          </button>
        </div>

        {reports.length > 0 && (
          <div className="space-y-1">
            {reports.map((r) => (
              <p key={r.source} className={`text-xs flex items-center gap-1.5 ${r.ok ? 'text-slate-500' : 'text-rose-500'}`}>
                {r.ok ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                <span>
                  <strong>{r.label}</strong>:{' '}
                  {r.ok
                    ? `${r.found}건 확인 → 새 상품 ${r.inserted}건 추가 (이미 있는 ${r.duplicates}건${r.noImage ? `, 제품 사진 없는 ${r.noImage}건` : ''} 제외)`
                    : `수집 실패 — ${r.error}`}
                  {r.ok && r.warning && <span className="text-amber-600 dark:text-amber-400"> · {r.warning}</span>}
                </span>
              </p>
            ))}
          </div>
        )}
      </div>

      {/* 2. 대기함 */}
      <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
        <div className={`p-4 border-b space-y-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <button onClick={() => setView('pending')} className={pill(view === 'pending')}>
                승인 대기 {pendingProducts.length}
              </button>
              <button onClick={() => setView('rejected')} className={pill(view === 'rejected')}>
                반려 목록
              </button>
            </div>

            {view === 'pending' && (
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="상품명·브랜드 검색"
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border focus:outline-none ${inputBg}`}
                />
              </div>
            )}
          </div>

          {view === 'pending' && pendingProducts.length > 0 && (
            <>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button onClick={() => setSourceFilter('전체')} className={pill(sourceFilter === '전체')}>전체 판매처</button>
                {sourceCounts.map(([key, count]) => (
                  <button key={key} onClick={() => setSourceFilter(key)} className={pill(sourceFilter === key)}>
                    {key} {count}
                  </button>
                ))}
                <span className={`w-px h-4 mx-1 shrink-0 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as ProductCategory | '전체')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none ${inputBg}`}
                >
                  <option value="전체">전체 카테고리</option>
                  {CATEGORIES.filter((c) => c !== '전체' && c !== '신제품').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {missingImageCount > 0 && (
                  <button onClick={() => setOnlyMissingImage((v) => !v)} className={pill(onlyMissingImage)}>
                    이미지 없음 {missingImageCount}
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className={`flex items-center gap-2 text-xs font-semibold cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={() => setSelectedIds(isAllSelected ? [] : filteredIds)}
                    className="rounded border-slate-300 w-4 h-4 cursor-pointer"
                  />
                  <span>전체 선택 ({selectedInView.length}/{filtered.length})</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(selectedInView)}
                    disabled={selectedInView.length === 0 || busy}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 disabled:opacity-40"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>선택 {selectedInView.length}건 승인</span>
                  </button>
                  <button
                    onClick={() => handleReject(selectedInView)}
                    disabled={selectedInView.length === 0 || busy}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 disabled:opacity-40"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>선택 반려</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {view === 'pending' && (
          filtered.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Inbox className="w-8 h-8 mx-auto text-slate-300" />
              <h3 className={`text-sm font-bold ${titleText}`}>
                {pendingProducts.length === 0 ? '승인 대기 중인 신제품이 없습니다' : '조건에 맞는 상품이 없습니다'}
              </h3>
              {pendingProducts.length === 0 && (
                <p className="text-xs text-slate-500">위의 [신제품 전체 가져오기]를 누르면 새로 나온 상품이 여기에 쌓입니다.</p>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`font-bold text-[11px] border-b ${isDark ? 'bg-slate-950/80 text-slate-400 border-slate-800' : 'bg-slate-100/70 text-slate-600 border-slate-200'}`}>
                    <tr>
                      <th className="py-3 px-4 w-10" />
                      <th className="py-3 px-4">상품</th>
                      <th className="py-3 px-4">카테고리</th>
                      <th className="py-3 px-4">가격</th>
                      <th className="py-3 px-4">출처</th>
                      <th className="py-3 px-4">수집일</th>
                      <th className="py-3 px-4 text-right">작업</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-100'}`}>
                    {visible.map((item) => {
                      const isSelected = selectedIds.includes(item.id);
                      return (
                        <tr key={item.id} className={isSelected ? (isDark ? 'bg-indigo-950/20' : 'bg-indigo-50/60') : ''}>
                          <td className="py-3 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => setSelectedIds((prev) => prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id])}
                              className="rounded border-slate-300 w-4 h-4 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => (item.image ? setZoomed({ src: item.image, name: item.name }) : setEditing(item))}
                                className={`w-12 h-12 rounded-lg border overflow-hidden shrink-0 flex items-center justify-center ${item.image ? 'cursor-zoom-in' : ''} ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}
                                title={item.image ? '클릭하여 크게 보기' : '클릭하여 이미지 등록'}
                              >
                                {item.image
                                  ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                                  : <ImageIcon className="w-4 h-4 text-slate-400" />}
                              </button>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <button
                                    onClick={() => setEditing(item)}
                                    className={`font-bold text-xs text-left hover:underline ${titleText}`}
                                  >
                                    {item.name}
                                  </button>
                                  {!item.image && (
                                    <span className="px-1.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 border border-amber-500/30">이미지 필요</span>
                                  )}
                                  {isAlreadyRegistered(item.name) && (
                                    <span className="px-1.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-600 border border-rose-500/30">이미 등록됨</span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-400">
                                  {item.brand}
                                  {item.volume ? ` · ${item.volume}` : ''}
                                  {item.stores.length > 0 ? ` · ${item.stores.join(', ')}` : ''}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className={`py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.category}</td>
                          <td className={`py-3 px-4 font-mono font-bold ${titleText}`}>
                            {item.price > 0
                              ? `${item.price.toLocaleString()}원`
                              : <span className="text-[11px] font-sans font-bold text-amber-600">미정</span>}
                          </td>
                          <td className="py-3 px-4">
                            {item.sourceUrl ? (
                              <a
                                href={item.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 max-w-[220px]"
                                title={item.sourceName}
                              >
                                <span className="truncate">{item.sourceName || '출처'}</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                            ) : (
                              <span className="text-[11px] text-slate-400">{item.sourceName || '-'}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">{formatDate(item.crawledAt)}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => (item.image ? handleApprove([item.id]) : setEditing(item))}
                                disabled={busy}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold flex items-center gap-1 disabled:opacity-50"
                                title={item.image ? '승인하여 앱에 등록' : '이미지를 먼저 등록해주세요'}
                              >
                                <Check className="w-3 h-3" />
                                <span>승인</span>
                              </button>
                              <button
                                onClick={() => setEditing(item)}
                                className={`px-2.5 py-1 rounded text-[11px] font-bold border flex items-center gap-1 ${subtleBtn}`}
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>수정</span>
                              </button>
                              <button
                                onClick={() => handleReject([item.id])}
                                disabled={busy}
                                className="px-2.5 py-1 rounded text-[11px] font-bold border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 flex items-center gap-1 disabled:opacity-50"
                              >
                                <X className="w-3 h-3" />
                                <span>반려</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filtered.length > visibleCount && (
                <div className={`p-3 text-center border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <button
                    onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border ${subtleBtn}`}
                  >
                    더 보기 ({visibleCount}/{filtered.length})
                  </button>
                </div>
              )}
            </>
          )
        )}

        {view === 'rejected' && (
          isLoadingRejected ? (
            <div className="p-10 text-center text-xs text-slate-500">불러오는 중...</div>
          ) : rejectedItems.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Inbox className="w-8 h-8 mx-auto text-slate-300" />
              <h3 className={`text-sm font-bold ${titleText}`}>반려한 상품이 없습니다</h3>
            </div>
          ) : (
            <div className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-100'}`}>
              <p className="px-4 py-2.5 text-[11px] text-slate-500">반려한 상품은 자동 수집에서 제외됩니다. 잘못 반려했다면 대기함으로 되돌릴 수 있습니다.</p>
              {rejectedItems.map((item) => (
                <div key={item.id} className="px-4 py-2.5 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg border overflow-hidden shrink-0 flex items-center justify-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                    {item.image
                      ? <img src={item.image} alt={item.name} onClick={() => setZoomed({ src: item.image, name: item.name })} title="클릭하여 크게 보기" style={{ cursor: 'zoom-in' }} className="w-full h-full object-cover" loading="lazy" />
                      : <ImageIcon className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`font-bold text-xs truncate ${titleText}`}>{item.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{item.brand} · {item.sourceName || '-'}</p>
                  </div>
                  <button
                    onClick={() => handleRestore(item)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold border flex items-center gap-1 shrink-0 ${subtleBtn}`}
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>대기함으로</span>
                  </button>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* 3. 수정 모달 */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div
            className={`w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border p-5 space-y-4 text-xs ${cardBg}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-black ${titleText}`}>수집 상품 확인·수정</h3>
              <button onClick={() => setEditing(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
              <span className="text-slate-500 truncate">출처: {editing.sourceName || '-'}</span>
              {editing.sourceUrl && (
                <a href={editing.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold inline-flex items-center gap-1 shrink-0">
                  <span>원문 보기</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block font-bold text-slate-500 mb-1">상품명</label>
                <input type="text" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={`w-full p-2.5 rounded-xl border ${inputBg}`} />
              </div>
              <div>
                <label className="block font-bold text-slate-500 mb-1">브랜드</label>
                <input type="text" value={editing.brand} onChange={(e) => setEditing({ ...editing, brand: e.target.value })} className={`w-full p-2.5 rounded-xl border ${inputBg}`} />
              </div>
              <div>
                <label className="block font-bold text-slate-500 mb-1">카테고리</label>
                <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as ProductCategory })} className={`w-full p-2.5 rounded-xl border ${inputBg}`}>
                  {CATEGORIES.filter((c) => c !== '전체' && c !== '신제품').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-500 mb-1">가격 (원)</label>
                <input type="number" value={editing.price || ''} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} placeholder="미정" className={`w-full p-2.5 rounded-xl border ${inputBg}`} />
              </div>
              <div>
                <label className="block font-bold text-slate-500 mb-1">출시일</label>
                <input type="text" value={editing.releaseDate} onChange={(e) => setEditing({ ...editing, releaseDate: e.target.value })} className={`w-full p-2.5 rounded-xl border ${inputBg}`} />
              </div>
              <div className="col-span-2">
                <label className="block font-bold text-slate-500 mb-1">판매처 (쉼표로 구분)</label>
                <input
                  type="text"
                  value={editing.stores.join(', ')}
                  onChange={(e) => setEditing({ ...editing, stores: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                  placeholder="예: CU, GS25"
                  className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-500">상품 이미지</label>
                <button onClick={() => setIsImageSearchOpen(true)} className="text-indigo-600 dark:text-indigo-400 font-bold inline-flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  <span>이미지 검색</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-11 h-11 rounded-lg border overflow-hidden shrink-0 flex items-center justify-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                  {editing.image
                    ? <img src={editing.image} alt={editing.name} onClick={() => setZoomed({ src: editing.image, name: editing.name })} title="클릭하여 크게 보기" style={{ cursor: 'zoom-in' }} className="w-full h-full object-cover" />
                    : <ImageIcon className="w-4 h-4 text-slate-400" />}
                </div>
                <input type="text" value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value.trim() })} placeholder="이미지 주소(URL)" className={`flex-1 min-w-0 p-2.5 rounded-xl border ${inputBg}`} />
              </div>
            </div>

            <div className={`p-3 rounded-xl border space-y-2.5 ${isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center justify-between">
                <span className={`font-bold flex items-center gap-1.5 ${titleText}`}>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>용량·영양성분 (선택)</span>
                </span>
                <button onClick={() => setIsNutritionSearchOpen(true)} className="text-emerald-600 dark:text-emerald-400 font-bold inline-flex items-center gap-1">
                  <Search className="w-3 h-3" />
                  <span>식약처 영양성분 조회</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" value={editing.volume || ''} onChange={(e) => setEditing({ ...editing, volume: e.target.value })} placeholder="용량 (예: 80g)" className={`w-full p-2 rounded-xl border ${inputBg}`} />
                <input type="number" value={editing.calories || ''} onChange={(e) => setEditing({ ...editing, calories: Number(e.target.value) || undefined })} placeholder="칼로리 (kcal)" className={`w-full p-2 rounded-xl border ${inputBg}`} />
              </div>
              {editing.nutrition && (
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                  영양표시 연동됨 — 탄수 {editing.nutrition.carbs || '-'} · 당류 {editing.nutrition.sugar || '-'} · 단백질 {editing.nutrition.protein || '-'} · 지방 {editing.nutrition.fat || '-'} · 나트륨 {editing.nutrition.sodium || '-'}
                </p>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-500 mb-1">상품 설명</label>
              <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className={`w-full p-2.5 rounded-xl border ${inputBg}`} />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button onClick={() => saveEditing(false)} disabled={busy} className={`px-4 py-2.5 rounded-xl font-bold border disabled:opacity-50 ${subtleBtn}`}>
                저장
              </button>
              <button onClick={() => saveEditing(true)} disabled={busy} className="px-4 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 disabled:opacity-50">
                <Check className="w-3.5 h-3.5" />
                <span>저장 후 승인</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. 이미지 크게 보기 */}
      {zoomed && (
        <div className="fixed inset-0 z-[70] bg-black/80 flex flex-col items-center justify-center gap-3 p-4 cursor-zoom-out" onClick={() => setZoomed(null)}>
          <button onClick={() => setZoomed(null)} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white" title="닫기">
            <X className="w-5 h-5" />
          </button>
          <img src={zoomed.src} alt={zoomed.name} className="max-w-full max-h-[80vh] rounded-xl bg-white object-contain shadow-2xl" />
          <p className="text-white text-sm font-bold text-center">{zoomed.name}</p>
        </div>
      )}

      {editing && isImageSearchOpen && (
        <ProductImageSelectorModal
          isOpen
          onClose={() => setIsImageSearchOpen(false)}
          brand={editing.brand}
          productName={editing.name}
          currentImage={editing.image}
          onSelectImage={(newUrl: string) => {
            setEditing((prev) => (prev ? { ...prev, image: newUrl } : prev));
            setIsImageSearchOpen(false);
          }}
          isDark={isDark}
        />
      )}

      {editing && isNutritionSearchOpen && (
        <FoodNutritionSearchModal
          isOpen
          onClose={() => setIsNutritionSearchOpen(false)}
          initialQuery={editing.name || editing.brand}
          brand={editing.brand}
          onSelect={(data: FoodNutritionData) => {
            setEditing((prev) => (prev ? {
              ...prev,
              calories: data.calories || prev.calories,
              volume: data.totalWeight || data.servingSize || prev.volume,
              nutrition: data.nutrition,
            } : prev));
            setIsNutritionSearchOpen(false);
          }}
        />
      )}
    </div>
  );
};
