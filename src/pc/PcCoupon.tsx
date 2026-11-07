import React, { useEffect, useMemo, useState } from 'react';
import { Check, CheckCircle2, Copy, Loader2, RefreshCw, Search, Smartphone, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ECouponDetail, ECouponItem, PurchasedECoupon } from '../types';
import { couponImageSrc, couponThumbSrc, fetchCouponCatalog, fetchCouponDetail, getStoredCouponCatalog } from '../services/couponApi';
import { PcContainer, PcEmpty } from './PcUi';
import { buildSearchMatcher } from '../utils/searchAlias';

const PAGE_SIZE = 40;
const MAIN_CATEGORIES = ['커피/음료', '편의점', '베이커리/도넛', '치킨', '버거', '피자', '아이스크림', '외식'];
const SORT_OPTIONS = [
  { id: 'default', label: '추천순' },
  { id: 'low', label: '낮은 포인트순' },
  { id: 'high', label: '높은 포인트순' },
] as const;
type SortId = typeof SORT_OPTIONS[number]['id'];

const formatDate = (value?: string) => (value ? value.slice(0, 10).replace(/-/g, '.') : '');

/** PC e쿠폰: 왼쪽 카테고리 + 5열 상품, 내 쿠폰함은 탭으로 (모바일 e쿠폰과 별도) */
export const PcCoupon: React.FC = () => {
  const { purchasedCoupons, refreshPurchasedCoupons, purchaseCoupon, useCoupon, userPoints } = useApp();

  const [tab, setTab] = useState<'shop' | 'mine'>('shop');
  const [goods, setGoods] = useState<ECouponItem[]>([]);
  const [exchangeEnabled, setExchangeEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [category, setCategory] = useState('전체');
  const [brand, setBrand] = useState('전체');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortId>('default');
  const [onlyAffordable, setOnlyAffordable] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [selectedGoods, setSelectedGoods] = useState<ECouponItem | null>(null);
  const [goodsDetail, setGoodsDetail] = useState<ECouponDetail | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isExchanging, setIsExchanging] = useState(false);
  const [selectedUserCoupon, setSelectedUserCoupon] = useState<PurchasedECoupon | null>(null);
  const [copiedBarcode, setCopiedBarcode] = useState(false);

  const unusedCount = purchasedCoupons.filter(c => !c.isUsed).length;

  const loadGoods = async (force = false) => {
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
  }, []);

  useEffect(() => setVisibleCount(PAGE_SIZE), [category, brand, query, sort, onlyAffordable]);

  const inCategory = useMemo(() => {
    if (category === '전체') return goods;
    if (category === '기타') return goods.filter(g => !MAIN_CATEGORIES.includes(g.category));
    return goods.filter(g => g.category === category);
  }, [goods, category]);

  const brands = useMemo(() => {
    const counts = new Map<string, number>();
    inCategory.forEach(g => counts.set(g.brand, (counts.get(g.brand) || 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).map(([name]) => name);
  }, [inCategory]);

  const filtered = useMemo(() => {
    const matcher = buildSearchMatcher(query);
    let list = inCategory.filter(g =>
      (brand === '전체' || g.brand === brand) &&
      (!onlyAffordable || g.price <= userPoints) &&
      (!matcher || matcher([g.name, g.brand])));
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [inCategory, brand, query, sort, onlyAffordable, userPoints]);

  const openGoods = (item: ECouponItem) => {
    setSelectedGoods(item);
    setGoodsDetail(null);
    setIsConfirming(false);
    fetchCouponDetail(item.code).then(setGoodsDetail).catch(() => {});
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

  const shortage = selectedGoods ? selectedGoods.price - userPoints : 0;
  const detail = goodsDetail && selectedGoods && goodsDetail.code === selectedGoods.code ? goodsDetail : null;

  return (
    <div className="bg-white">
      <PcContainer className="py-12">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">e쿠폰</h1>
            <p className="mt-1.5 text-[14px] text-gray-500">신상픽 활동으로 모은 포인트를 커피·편의점 e쿠폰으로 바꿔 보세요.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-12 px-5 rounded-xl bg-violet-50 flex items-center gap-3">
              <span className="text-[14px] text-violet-900">내 포인트</span>
              <span className="text-[20px] font-bold text-violet-700">{userPoints.toLocaleString()}P</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-8 border-b border-gray-200">
          {([['shop', 'e쿠폰 상점'], ['mine', `내 쿠폰함 ${unusedCount > 0 ? unusedCount : ''}`]] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`relative h-12 text-[16px] cursor-pointer ${tab === id ? 'font-bold text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {label}
              {tab === id && <span className="absolute left-0 right-0 bottom-0 h-[3px] bg-gray-900" />}
            </button>
          ))}
        </div>

        {tab === 'mine' ? (
          purchasedCoupons.length === 0 ? <PcEmpty message="아직 교환한 e쿠폰이 없습니다." /> : (
            <div className="mt-8 grid grid-cols-3 gap-5">
              {purchasedCoupons.map(coupon => (
                <button
                  key={coupon.id}
                  onClick={() => setSelectedUserCoupon(coupon)}
                  className={`p-5 rounded-2xl border flex gap-4 text-left cursor-pointer hover:shadow-md transition-shadow ${coupon.isUsed ? 'border-gray-200 bg-gray-50 opacity-60' : 'border-gray-200 bg-white'}`}
                >
                  <img src={coupon.imageUrl} alt="" className="w-20 h-20 rounded-xl object-cover bg-gray-100 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-gray-500">{coupon.brand}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${coupon.isUsed ? 'bg-gray-200 text-gray-600' : 'bg-emerald-500 text-white'}`}>
                        {coupon.isUsed ? '사용 완료' : '사용 가능'}
                      </span>
                    </div>
                    <p className="mt-1 text-[15px] font-semibold text-gray-900 line-clamp-2 leading-snug">{coupon.name}</p>
                    <p className="mt-1.5 text-[12px] text-gray-400">~ {formatDate(coupon.expiresAt)} · 바코드 보기</p>
                  </div>
                </button>
              ))}
            </div>
          )
        ) : (
          <div className="mt-8 grid grid-cols-[200px_1fr] gap-10 items-start">
            <aside className="sticky top-6">
              <p className="text-[15px] font-bold text-gray-900 pb-3 border-b border-gray-900">카테고리</p>
              <ul className="mt-2">
                {['전체', ...MAIN_CATEGORIES, '기타'].map(c => (
                  <li key={c}>
                    <button
                      onClick={() => { setCategory(c); setBrand('전체'); }}
                      className={`w-full text-left py-2.5 text-[14px] cursor-pointer ${category === c ? 'font-bold text-violet-700' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-xl bg-gray-50 p-4 text-[13px] text-gray-600 leading-relaxed">
                <Smartphone className="w-5 h-5 text-gray-500 mb-2" />
                광고 보고 포인트 받기는 <strong className="text-gray-900">신상픽 앱</strong>에서 할 수 있어요.
              </div>
            </aside>

            <div className="min-w-0">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-[360px]">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="브랜드, 상품명 검색"
                    className="w-full h-10 pl-10 pr-9 rounded-full border border-gray-200 text-[14px] outline-none focus:border-gray-900"
                  />
                  {query && (
                    <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" aria-label="지우기">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <label className="flex items-center gap-2 text-[14px] text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={onlyAffordable} onChange={e => setOnlyAffordable(e.target.checked)} className="w-4 h-4 accent-violet-600" />
                  내 포인트로 교환 가능한 상품만
                </label>
              </div>

              {brands.length > 1 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {['전체', ...brands].map(b => (
                    <button
                      key={b}
                      onClick={() => setBrand(b)}
                      className={`h-8 px-3.5 rounded-full border text-[13px] cursor-pointer ${
                        brand === b ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {b === '전체' ? '브랜드 전체' : b}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-6 pb-4 border-b border-gray-200 flex items-center justify-between text-[14px]">
                <p className="text-gray-500">총 <strong className="text-gray-900">{filtered.length.toLocaleString()}</strong>개</p>
                <div className="flex items-center gap-4">
                  {SORT_OPTIONS.map(o => (
                    <button key={o.id} onClick={() => setSort(o.id)} className={`cursor-pointer ${sort === o.id ? 'font-bold text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {isLoading ? (
                <div className="py-28 flex justify-center text-gray-400"><Loader2 className="w-7 h-7 animate-spin" /></div>
              ) : loadError ? (
                <div className="py-28 text-center">
                  <p className="text-[14px] text-gray-500">{loadError}</p>
                  <button onClick={() => loadGoods(true)} className="mt-4 h-10 px-5 rounded-full bg-gray-900 text-white text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer">
                    <RefreshCw className="w-4 h-4" />
                    다시 시도
                  </button>
                </div>
              ) : filtered.length === 0 ? (
                <PcEmpty message="조건에 맞는 e쿠폰이 없습니다." />
              ) : (
                <>
                  <div className="mt-6 grid grid-cols-5 gap-x-4 gap-y-8">
                    {filtered.slice(0, visibleCount).map(item => (
                      <button key={item.code} onClick={() => openGoods(item)} className="text-left group cursor-pointer">
                        <div className="aspect-square rounded-xl bg-gray-50 border border-gray-100 overflow-hidden">
                          <img
                            src={couponThumbSrc(item.image)}
                            alt={item.name}
                            loading="lazy"
                            decoding="async"
                            onError={e => { if (e.currentTarget.src !== item.image) e.currentTarget.src = item.image; }}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <p className="mt-3 text-[12px] text-gray-500 truncate">{item.brand}</p>
                        <p className="mt-0.5 text-[14px] text-gray-900 line-clamp-2 leading-snug min-h-[2.6em]">{item.name}</p>
                        <p className={`mt-1 text-[16px] font-bold ${item.price <= userPoints ? 'text-violet-700' : 'text-gray-900'}`}>
                          {item.price.toLocaleString()}P
                        </p>
                      </button>
                    ))}
                  </div>
                  {visibleCount < filtered.length && (
                    <div className="mt-10 flex justify-center">
                      <button
                        onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
                        className="h-12 px-10 rounded-full border border-gray-300 text-[14px] text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        더보기 ({visibleCount.toLocaleString()} / {filtered.length.toLocaleString()})
                      </button>
                    </div>
                  )}
                </>
              )}

              <p className="mt-10 text-[12px] text-gray-400 leading-relaxed">
                e쿠폰은 신상픽 활동으로 적립한 포인트로만 교환할 수 있습니다. 교환한 쿠폰은 유효기간 연장·환불 및 포인트 재적립이 불가합니다.
                상품공급자: 주식회사 케이티알파 / 발행: 신상픽
              </p>
            </div>
          </div>
        )}
      </PcContainer>

      {/* 상품 상세 · 교환 */}
      {selectedGoods && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6" onClick={closeGoods}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-[820px] max-h-[86vh] bg-white rounded-2xl shadow-2xl flex overflow-hidden">
            <div className="w-[340px] shrink-0 bg-gray-50 flex items-center justify-center p-8">
              <img src={detail?.imageLarge || selectedGoods.image} alt="" className="w-full aspect-square object-contain" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="px-8 pt-7 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] text-gray-500">{selectedGoods.brand}</p>
                  <h2 className="mt-1 text-[22px] font-bold text-gray-900 leading-snug">{selectedGoods.name}</h2>
                  <p className="mt-2 flex items-baseline gap-2">
                    <span className="text-[26px] font-bold text-violet-700">{selectedGoods.price.toLocaleString()}P</span>
                    {selectedGoods.salePrice > selectedGoods.price && (
                      <span className="text-[14px] text-gray-400 line-through">{selectedGoods.salePrice.toLocaleString()}원</span>
                    )}
                  </p>
                </div>
                <button onClick={closeGoods} className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer" aria-label="닫기">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-8 py-5">
                <dl className="rounded-xl bg-gray-50 p-4 text-[13px] text-gray-600 space-y-1.5">
                  <div>유효기간: 교환일로부터 <strong className="text-gray-900">{selectedGoods.limitDay}일</strong></div>
                  {detail?.affiliate && <div>사용처: {detail.affiliate}</div>}
                  <div>유효기간 연장 및 환불이 불가한 프로모션용 쿠폰입니다.</div>
                  <div>상품공급자: 주식회사 케이티알파 / 발행: 신상픽</div>
                </dl>
                {detail ? (
                  <p className="mt-4 text-[13px] text-gray-500 leading-relaxed whitespace-pre-line">
                    {[detail.content, detail.contentAddDesc].filter(Boolean).join('\n\n')}
                  </p>
                ) : (
                  <div className="mt-6 flex justify-center text-gray-300"><Loader2 className="w-5 h-5 animate-spin" /></div>
                )}
              </div>
              <div className="px-8 py-5 border-t border-gray-100">
                {!exchangeEnabled ? (
                  <p className="h-12 rounded-xl bg-gray-100 text-[14px] font-semibold text-gray-400 flex items-center justify-center">교환이 일시 중지되었습니다</p>
                ) : shortage > 0 ? (
                  <p className="h-12 rounded-xl bg-gray-100 text-[14px] font-semibold text-gray-400 flex items-center justify-center">{shortage.toLocaleString()}P가 더 필요해요</p>
                ) : isConfirming ? (
                  <div className="flex items-center gap-3">
                    <p className="flex-1 text-[13px] text-gray-600">
                      <strong className="text-gray-900">{selectedGoods.price.toLocaleString()}P</strong>를 사용해 교환할까요? 교환 후에는 취소할 수 없습니다.
                    </p>
                    <button onClick={() => setIsConfirming(false)} disabled={isExchanging} className="h-12 px-6 rounded-xl bg-gray-100 text-[14px] font-semibold text-gray-700 cursor-pointer">취소</button>
                    <button onClick={handleExchange} disabled={isExchanging} className="h-12 px-6 rounded-xl bg-violet-600 text-white text-[14px] font-bold flex items-center gap-1.5 disabled:opacity-70 cursor-pointer">
                      {isExchanging && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isExchanging ? '발급 중...' : '교환 확정'}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setIsConfirming(true)} className="w-full h-12 rounded-xl bg-gray-900 hover:bg-black text-white text-[15px] font-bold cursor-pointer">
                    {selectedGoods.price.toLocaleString()}P로 교환하기
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 교환한 쿠폰 (바코드) */}
      {selectedUserCoupon && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6" onClick={() => setSelectedUserCoupon(null)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-[440px] max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl relative">
            <button onClick={() => setSelectedUserCoupon(null)} className="absolute top-4 right-4 p-1 text-white/80 hover:text-white cursor-pointer" aria-label="닫기">
              <X className="w-6 h-6" />
            </button>
            <div className="bg-gray-900 px-8 pt-8 pb-6 text-white text-center">
              <p className="text-[13px] text-white/70">{selectedUserCoupon.brand}</p>
              <h3 className="mt-1 text-[19px] font-bold">{selectedUserCoupon.name}</h3>
              <p className="mt-1 text-[12px] text-white/60">유효기간 ~ {formatDate(selectedUserCoupon.expiresAt)}</p>
            </div>
            <div className="p-8 text-center space-y-4">
              {selectedUserCoupon.isUsed && (
                <p className="rounded-xl bg-rose-50 border border-rose-200 text-rose-600 py-2 text-[13px] font-semibold">
                  사용 완료로 표시한 쿠폰 ({formatDate(selectedUserCoupon.usedAt) || '사용완료'})
                </p>
              )}
              <div className={`rounded-xl border border-gray-200 p-4 ${selectedUserCoupon.isUsed ? 'grayscale opacity-40' : ''}`}>
                {selectedUserCoupon.couponImgUrl && (
                  <img src={couponImageSrc(selectedUserCoupon.couponImgUrl)} alt="쿠폰 바코드" className="w-full rounded-lg" />
                )}
                {selectedUserCoupon.barcodeNumber && (
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span className="font-mono text-[17px] font-bold tracking-widest text-gray-900">{selectedUserCoupon.barcodeNumber}</span>
                    <button onClick={() => handleCopyBarcode(selectedUserCoupon.barcodeNumber)} className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer" title="쿠폰번호 복사">
                      {copiedBarcode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>
              <p className="text-[13px] text-gray-500">매장 결제 시 바코드를 직원에게 보여 주거나 키오스크에 스캔하세요.</p>
              <button
                onClick={() => {
                  useCoupon(selectedUserCoupon.id);
                  setSelectedUserCoupon(prev => (prev ? { ...prev, isUsed: !prev.isUsed, usedAt: prev.isUsed ? undefined : new Date().toISOString() } : null));
                }}
                className={`w-full h-12 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedUserCoupon.isUsed ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {selectedUserCoupon.isUsed ? '미사용으로 되돌리기' : '사용 완료로 표시하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
