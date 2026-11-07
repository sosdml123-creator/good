import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Gift,
  Copy,
  Check,
  ChevronRight,
  Ticket,
  CheckCircle2,
  Search,
  Loader2,
  PlayCircle,
  RefreshCw,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ECouponDetail, ECouponItem, PurchasedECoupon } from '../../types';
import { AdRewardStatus, couponImageSrc, couponThumbSrc, fetchAdRewardStatus, fetchCouponCatalog, fetchCouponDetail, getStoredCouponCatalog } from '../../services/couponApi';
import { isNative, lastRewardedAdError, showRewardedAd } from '../../services/admobService';

const PAGE_SIZE = 20;
const MAIN_CATEGORIES = ['커피/음료', '편의점', '베이커리/도넛', '치킨', '버거', '피자', '아이스크림', '외식'];
const SORT_OPTIONS = [
  { id: 'default', label: '추천순' },
  { id: 'low', label: '낮은 포인트순' },
  { id: 'high', label: '높은 포인트순' },
] as const;
type SortId = typeof SORT_OPTIONS[number]['id'];

const formatDate = (value?: string) => (value ? value.slice(0, 10).replace(/-/g, '.') : '');

export const CouponShopView: React.FC = () => {
  const {
    purchasedCoupons,
    refreshPurchasedCoupons,
    purchaseCoupon,
    useCoupon,
    userPoints,
    applyServerPoints,
    openLoginModal
  } = useApp();

  // 광고 보고 포인트 받기 (보상형 광고는 앱에서만 지원)
  const [tab, setTab] = useState<'shop' | 'charge'>('shop');
  const [adStatus, setAdStatus] = useState<AdRewardStatus | null>(null);
  const [isAdBusy, setIsAdBusy] = useState(false);
  const [adMessage, setAdMessage] = useState('');

  const loadAdStatus = async () => {
    try {
      const status = await fetchAdRewardStatus();
      setAdStatus(status);
      return status;
    } catch {
      return null;
    }
  };

  const watchAd = async () => {
    if (isAdBusy) return;
    if (!isNative()) return setAdMessage('광고 적립은 신상픽 앱에서만 가능합니다.');
    setAdMessage('');
    setIsAdBusy(true);
    try {
      let before: AdRewardStatus | null;
      try {
        before = await fetchAdRewardStatus();
      } catch {
        return setAdMessage('적립 정보를 불러오지 못했습니다. 네트워크 연결을 확인한 뒤 다시 눌러 주세요.');
      }
      setAdStatus(before);
      if (!before) {
        setAdMessage('로그인한 뒤 이용할 수 있습니다.');
        return openLoginModal();
      }
      if (!before.enabled) return setAdMessage('광고 적립을 준비 중입니다. 곧 열릴 예정이에요.');
      if (before.today >= before.dailyLimit) return setAdMessage('오늘 받을 수 있는 횟수를 모두 채웠어요. 내일 다시 받아 보세요.');

      const result = await showRewardedAd(before.userId);
      if (result === 'unavailable') {
        return setAdMessage(`지금은 볼 수 있는 광고가 없습니다. 잠시 후 다시 시도해 주세요.${lastRewardedAdError ? ` (${lastRewardedAdError})` : ''}`);
      }
      if (result === 'dismissed') return setAdMessage('광고를 끝까지 보면 포인트가 적립됩니다.');

      // 적립은 Google 서버가 우리 서버로 따로 알려 준 뒤 반영되므로 잠시 확인
      for (let i = 0; i < 6; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const after = await loadAdStatus();
        if (after && after.today > before.today) {
          applyServerPoints(after.balance);
          return setAdMessage(`${before.points}P가 적립되었습니다.`);
        }
      }
      setAdMessage('적립이 조금 늦어지고 있어요. 잠시 후 포인트에 반영됩니다.');
    } finally {
      setIsAdBusy(false);
    }
  };

  // 상품 목록
  const [goods, setGoods] = useState<ECouponItem[]>([]);
  const [exchangeEnabled, setExchangeEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 필터
  const [category, setCategory] = useState('전체');
  const [brand, setBrand] = useState('전체');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortId>('default');
  const [onlyAffordable, setOnlyAffordable] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // 모달 상태
  const [selectedGoods, setSelectedGoods] = useState<ECouponItem | null>(null);
  const [goodsDetail, setGoodsDetail] = useState<ECouponDetail | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isExchanging, setIsExchanging] = useState(false);
  const [selectedUserCoupon, setSelectedUserCoupon] = useState<PurchasedECoupon | null>(null);
  const [isRecentCouponsOpen, setIsRecentCouponsOpen] = useState(false);
  const [copiedBarcode, setCopiedBarcode] = useState(false);

  const unusedCount = purchasedCoupons.filter(c => !c.isUsed).length;

  const loadGoods = async (force = false) => {
    // 지난번에 받아 둔 목록이 있으면 먼저 보여 주고 뒤에서 최신 목록으로 교체
    const stored = force ? null : getStoredCouponCatalog();
    if (stored) {
      setGoods(stored.goods);
      setExchangeEnabled(stored.exchangeEnabled);
    }
    setIsLoading(!stored);
    setLoadError(null);
    try {
      const catalog = await fetchCouponCatalog(force);
      setGoods(catalog.goods);
      setExchangeEnabled(catalog.exchangeEnabled);
    } catch (e: any) {
      if (!stored) setLoadError(e?.message || 'e쿠폰 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGoods();
    refreshPurchasedCoupons();
    loadAdStatus();
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [category, brand, query, sort, onlyAffordable]);

  const inCategory = useMemo(() => {
    if (category === '전체') return goods;
    if (category === '기타') return goods.filter(g => !MAIN_CATEGORIES.includes(g.category));
    return goods.filter(g => g.category === category);
  }, [goods, category]);

  // 선택한 카테고리 안에서 상품 수가 많은 브랜드 순
  const brands = useMemo(() => {
    const counts = new Map<string, number>();
    inCategory.forEach(g => counts.set(g.brand, (counts.get(g.brand) || 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).map(([name]) => name);
  }, [inCategory]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = inCategory.filter(g =>
      (brand === '전체' || g.brand === brand) &&
      (!onlyAffordable || g.price <= userPoints) &&
      (!q || g.name.toLowerCase().includes(q) || g.brand.toLowerCase().includes(q))
    );
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [inCategory, brand, query, sort, onlyAffordable, userPoints]);

  // 목록 끝이 화면에 들어오면 다음 묶음을 이어서 표시
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const hasMore = visibleCount < filtered.length;
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) setVisibleCount(v => v + PAGE_SIZE);
    }, { rootMargin: '600px 0px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, visibleCount]);

  const openGoods = (item: ECouponItem) => {
    setSelectedGoods(item);
    setGoodsDetail(null);
    setIsConfirming(false);
    fetchCouponDetail(item.code)
      .then(detail => setGoodsDetail(detail))
      .catch(() => {});
  };

  const closeGoods = () => {
    if (isExchanging) return;
    setSelectedGoods(null);
    setGoodsDetail(null);
    setIsConfirming(false);
  };

  const handleExchange = async () => {
    if (!selectedGoods || isExchanging) return;
    setIsExchanging(true);
    const issued = await purchaseCoupon(selectedGoods.code);
    setIsExchanging(false);
    setIsConfirming(false);
    if (issued) {
      setSelectedGoods(null);
      setGoodsDetail(null);
      setSelectedUserCoupon(issued);
    }
  };

  const handleCopyBarcode = (barcode: string) => {
    navigator.clipboard.writeText(barcode.replace(/-/g, ''));
    setCopiedBarcode(true);
    setTimeout(() => setCopiedBarcode(false), 2000);
  };

  const chipClass = (active: boolean) =>
    `shrink-0 text-[12px] font-bold px-3 py-1.5 rounded-full border transition-colors ${
      active ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'
    }`;

  const shortage = selectedGoods ? selectedGoods.price - userPoints : 0;
  // 다른 상품을 연 뒤 늦게 도착한 상세 응답은 무시
  const detail = goodsDetail && selectedGoods && goodsDetail.code === selectedGoods.code ? goodsDetail : null;

  return (
    <div className="flex-1 flex flex-col bg-[#F8F9FA] min-h-screen pb-24 select-none">
      {/* 1. Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 font-bold">
            <Gift className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-[17px] font-black text-gray-900 tracking-tight">e쿠폰</h1>
            <p className="text-[11px] text-gray-400 font-medium">
              내 포인트 <strong className="text-amber-600 font-black">{userPoints.toLocaleString()}P</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsRecentCouponsOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-[11px] font-bold transition-colors"
          title="교환한 e쿠폰 보기"
        >
          <Ticket className="w-3.5 h-3.5 text-amber-600" />
          <span>내 쿠폰</span>
          {unusedCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-black">
              {unusedCount}
            </span>
          )}
        </button>
      </header>

      <div className="bg-white border-b border-gray-100 px-4 flex">
        {([['shop', 'e쿠폰'], ['charge', '충전소']] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 py-2.5 text-[13px] font-black border-b-2 transition-colors ${
              tab === id ? 'text-gray-900 border-gray-900' : 'text-gray-400 border-transparent'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'charge' && (
        <div className="px-4 pt-3">
          <p className="text-[11px] font-bold text-gray-400 mb-2">포인트를 모아 e쿠폰으로 교환해 보세요</p>
          <button
            onClick={watchAd}
            disabled={isAdBusy}
            className="w-full flex items-center gap-3 bg-white border border-amber-200 rounded-2xl px-3.5 py-3 text-left disabled:opacity-60"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
              {isAdBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-black text-gray-900">
                광고 보고 포인트 받기
                {adStatus && adStatus.points > 0 && <span className="text-amber-600"> +{adStatus.points}P</span>}
              </div>
              <div className="text-[11px] text-gray-400 font-medium truncate">
                {isAdBusy
                  ? '광고를 불러오는 중입니다...'
                  : adStatus
                    ? `오늘 ${adStatus.today}/${adStatus.dailyLimit}회 · 광고를 끝까지 보면 적립됩니다`
                    : '광고를 끝까지 보면 포인트가 적립됩니다'}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
          </button>
          {adMessage && (
            <div className="mt-2 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[12px] font-bold text-amber-800 leading-snug">
              {adMessage}
            </div>
          )}
          <p className="text-[10px] text-gray-400 leading-relaxed mt-3">
            광고 적립은 신상픽 앱에서 하루 정해진 횟수까지 가능하며, 광고를 끝까지 시청해야 적립됩니다.
          </p>
        </div>
      )}

      {tab === 'shop' && (<>
      {/* 2. 검색 & 필터 */}
      <div className="bg-white border-b border-gray-100 pt-3 pb-2.5 space-y-2.5">
        <div className="px-4">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="브랜드, 상품명 검색"
              className="flex-1 bg-transparent text-[13px] text-gray-900 placeholder-gray-400 outline-none select-text"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-gray-400">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-4">
          {['전체', ...MAIN_CATEGORIES, '기타'].map(c => (
            <button
              key={c}
              onClick={() => {
                setCategory(c);
                setBrand('전체');
              }}
              className={chipClass(category === c)}
            >
              {c}
            </button>
          ))}
        </div>

        {brands.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-4">
            {['전체', ...brands].map(b => (
              <button
                key={b}
                onClick={() => setBrand(b)}
                className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                  brand === b ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-white text-gray-500 border-gray-200'
                }`}
              >
                {b === '전체' ? '브랜드 전체' : b}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between px-4">
          <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600">
            <input
              type="checkbox"
              checked={onlyAffordable}
              onChange={(e) => setOnlyAffordable(e.target.checked)}
              className="accent-amber-500"
            />
            <span>내 포인트로 교환 가능한 상품만</span>
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortId)}
            className="text-[11px] font-bold text-gray-600 bg-transparent outline-none"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. 상품 목록 */}
      <div className="flex-1 px-4 py-3">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center text-gray-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-[12px] font-medium">e쿠폰을 불러오는 중...</span>
          </div>
        ) : loadError ? (
          <div className="py-20 flex flex-col items-center text-center gap-3">
            <p className="text-[13px] text-gray-500">{loadError}</p>
            <button
              onClick={() => loadGoods(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-[12px] font-bold rounded-xl"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>다시 시도</span>
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-[13px] text-gray-400">조건에 맞는 e쿠폰이 없습니다.</div>
        ) : (
          <>
            <div className="text-[11px] font-bold text-gray-400 mb-2">총 {filtered.length.toLocaleString()}개</div>
            <div className="grid grid-cols-2 gap-2.5">
              {filtered.slice(0, visibleCount).map(item => (
                <button
                  key={item.code}
                  onClick={() => openGoods(item)}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden text-left active:scale-98 transition-transform"
                >
                  <div className="aspect-square bg-gray-50">
                    <img
                      src={couponThumbSrc(item.image)}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        if (e.currentTarget.src !== item.image) e.currentTarget.src = item.image;
                      }}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-2.5">
                    <div className="text-[10px] font-bold text-gray-400 truncate">{item.brand}</div>
                    <div className="text-[12px] font-bold text-gray-900 leading-snug line-clamp-2 min-h-[2.4em] mt-0.5">
                      {item.name}
                    </div>
                    <div className={`text-[14px] font-black mt-1 ${item.price <= userPoints ? 'text-amber-600' : 'text-gray-900'}`}>
                      {item.price.toLocaleString()}<span className="text-[11px] font-bold">P</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {hasMore && (
              <div ref={loadMoreRef} className="py-5 flex justify-center text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            )}
          </>
        )}

        <p className="text-[10px] text-gray-400 leading-relaxed mt-5">
          e쿠폰은 신상픽 활동으로 적립한 포인트로만 교환할 수 있습니다. 교환한 쿠폰은 유효기간 연장·환불 및 포인트 재적립이 불가합니다.
          상품공급자: 주식회사 케이티알파 / 발행: 신상픽
        </p>
      </div>
      </>)}

      {/* 4. 상품 상세 & 교환 시트 */}
      {selectedGoods && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={closeGoods}
        >
          <div
            className="w-full max-w-[430px] bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <span className="text-[12px] font-bold text-gray-400">{selectedGoods.brand}</span>
              <button
                onClick={closeGoods}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4">
              <div className="w-44 h-44 mx-auto bg-gray-50 rounded-2xl overflow-hidden">
                <img
                  src={detail?.imageLarge || selectedGoods.image}
                  alt={selectedGoods.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-[16px] font-black text-gray-900 mt-3 leading-snug">{selectedGoods.name}</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-[20px] font-black text-amber-600">{selectedGoods.price.toLocaleString()}P</span>
                {selectedGoods.salePrice > selectedGoods.price && (
                  <span className="text-[12px] text-gray-400 line-through">{selectedGoods.salePrice.toLocaleString()}원</span>
                )}
              </div>

              <div className="mt-3 bg-gray-50 rounded-xl p-3 text-[11px] text-gray-600 space-y-1">
                <div>유효기간: 교환일로부터 <strong className="text-gray-900">{selectedGoods.limitDay}일</strong></div>
                {detail?.affiliate && <div>사용처: {detail.affiliate}</div>}
                <div>유효기간 연장 및 환불이 불가한 프로모션용 쿠폰입니다.</div>
                <div>상품공급자: 주식회사 케이티알파 / 발행: 신상픽</div>
              </div>

              {detail ? (
                <p className="mt-3 text-[11px] text-gray-500 leading-relaxed whitespace-pre-line select-text">
                  {[detail.content, detail.contentAddDesc].filter(Boolean).join('\n\n')}
                </p>
              ) : (
                <div className="mt-4 flex justify-center text-gray-300">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              )}
            </div>

            <div className="px-5 pt-3 pb-[max(env(safe-area-inset-bottom),16px)] border-t border-gray-100">
              {!exchangeEnabled ? (
                <div className="py-3 text-center text-[13px] font-bold text-gray-400 bg-gray-100 rounded-xl">
                  교환이 일시 중지되었습니다
                </div>
              ) : shortage > 0 ? (
                <div className="py-3 text-center text-[13px] font-bold text-gray-400 bg-gray-100 rounded-xl">
                  {shortage.toLocaleString()}P가 더 필요해요
                </div>
              ) : isConfirming ? (
                <div className="space-y-2">
                  <p className="text-[12px] text-gray-600 text-center">
                    <strong className="text-gray-900">{selectedGoods.price.toLocaleString()}P</strong>를 사용해 교환할까요? 교환 후에는 취소할 수 없습니다.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setIsConfirming(false)}
                      disabled={isExchanging}
                      className="py-3 bg-gray-100 text-gray-700 font-bold text-[13px] rounded-xl"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleExchange}
                      disabled={isExchanging}
                      className="py-3 bg-amber-500 text-white font-black text-[13px] rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-70"
                    >
                      {isExchanging && <Loader2 className="w-4 h-4 animate-spin" />}
                      <span>{isExchanging ? '발급 중...' : '교환 확정'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsConfirming(true)}
                  className="w-full py-3 bg-gray-900 hover:bg-black text-white font-black text-[14px] rounded-xl"
                >
                  {selectedGoods.price.toLocaleString()}P로 교환하기
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. 교환한 쿠폰 상세 모달 (바코드 이미지 / 쿠폰번호) */}
      {selectedUserCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-[380px] max-h-[90vh] bg-white rounded-3xl overflow-y-auto no-scrollbar shadow-2xl flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedUserCoupon(null)}
              className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm hover:bg-gray-200 transition-colors z-10"
            >
              ✕
            </button>

            {/* Top Brand Banner */}
            <div className="bg-gradient-to-r from-gray-900 to-slate-800 p-5 text-white text-center pt-7">
              <span className="text-[11px] font-extrabold bg-white/20 px-2.5 py-0.5 rounded-full">
                {selectedUserCoupon.brand}
              </span>
              <h3 className="text-[16px] font-black mt-2">{selectedUserCoupon.name}</h3>
              <p className="text-[11px] text-gray-300 mt-0.5">유효기간: ~ {formatDate(selectedUserCoupon.expiresAt)}</p>
            </div>

            <div className="p-6 text-center space-y-4">
              {/* Used Status Stamp */}
              {selectedUserCoupon.isUsed && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 rounded-xl py-2 px-3 text-[12px] font-black flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>사용 완료로 표시한 쿠폰 ({formatDate(selectedUserCoupon.usedAt) || '사용완료'})</span>
                </div>
              )}

              <div className={`bg-[#F8F9FA] p-4 rounded-2xl border border-gray-200 flex flex-col items-center justify-center ${
                selectedUserCoupon.isUsed ? 'grayscale opacity-40' : ''
              }`}>
                {selectedUserCoupon.couponImgUrl && (
                  <img
                    src={couponImageSrc(selectedUserCoupon.couponImgUrl)}
                    alt="쿠폰 바코드"
                    className="w-full rounded-xl bg-white"
                  />
                )}

                {selectedUserCoupon.barcodeNumber && (
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span className="font-mono text-[16px] font-black tracking-widest text-gray-900 select-text">
                      {selectedUserCoupon.barcodeNumber}
                    </span>
                    <button
                      onClick={() => handleCopyBarcode(selectedUserCoupon.barcodeNumber)}
                      className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
                      title="쿠폰번호 복사"
                    >
                      {copiedBarcode ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-gray-500">
                매장 결제 시 위 바코드를 직원에게 제시하거나 키오스크에 스캔하세요.
              </p>

              {/* Toggle Used Status Button */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    useCoupon(selectedUserCoupon.id);
                    setSelectedUserCoupon(prev => prev ? { ...prev, isUsed: !prev.isUsed, usedAt: prev.isUsed ? undefined : new Date().toISOString() } : null);
                  }}
                  className={`flex-1 py-3 rounded-xl font-bold text-[13px] transition-all flex items-center justify-center gap-1.5 ${
                    selectedUserCoupon.isUsed
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{selectedUserCoupon.isUsed ? '미사용으로 되돌리기' : '사용 완료로 표시하기'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. 내가 교환한 e쿠폰 목록 팝업 */}
      {isRecentCouponsOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-[430px] bg-white rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl flex flex-col p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-[16px] font-black text-gray-900 flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-amber-600" />
                <span>내가 교환한 e쿠폰 목록</span>
              </h3>
              <button
                onClick={() => setIsRecentCouponsOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 pt-3">
              {purchasedCoupons.length === 0 && (
                <p className="py-10 text-center text-[13px] text-gray-400">아직 교환한 e쿠폰이 없습니다.</p>
              )}
              {purchasedCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  onClick={() => {
                    setIsRecentCouponsOpen(false);
                    setSelectedUserCoupon(coupon);
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                    coupon.isUsed ? 'border-gray-200 opacity-60 bg-gray-50' : 'border-amber-200 bg-white hover:shadow-sm'
                  }`}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                    <img src={coupon.imageUrl} alt={coupon.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        {coupon.brand}
                      </span>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                        coupon.isUsed ? 'bg-gray-200 text-gray-600' : 'bg-emerald-500 text-white'
                      }`}>
                        {coupon.isUsed ? '사용 완료' : '사용 가능'}
                      </span>
                    </div>
                    <div className="text-[13px] font-bold text-gray-900 truncate mt-0.5">{coupon.name}</div>
                    <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-between">
                      <span>~ {formatDate(coupon.expiresAt)}</span>
                      <span className="font-bold text-gray-700 flex items-center">
                        바코드 보기 <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
