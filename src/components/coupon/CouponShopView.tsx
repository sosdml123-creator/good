import React, { useState } from 'react';
import { 
  Gift, 
  Coins, 
  Sparkles, 
  Copy, 
  Check, 
  ChevronRight, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  PlusCircle, 
  Tag 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ECouponItem, PurchasedECoupon } from '../../types';
import { PointHistoryModal } from '../my/PointHistoryModal';

export const CouponShopView: React.FC = () => {
  const { 
    coupons, 
    purchasedCoupons, 
    purchaseCoupon, 
    useCoupon, 
    userPoints, 
    addTestPoints, 
    setActiveTab, 
    setSelectedCategory 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'store' | 'myCoupons'>('store');
  const [selectedCategory, setSelectedCouponCategory] = useState<string>('전체');
  
  // 모달 상태
  const [selectedProduct, setSelectedProduct] = useState<ECouponItem | null>(null);
  const [selectedUserCoupon, setSelectedUserCoupon] = useState<PurchasedECoupon | null>(null);
  const [isPointHistoryOpen, setIsPointHistoryOpen] = useState(false);
  const [copiedBarcode, setCopiedBarcode] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // 내 쿠폰함 필터 ('unused' | 'used')
  const [couponStatusFilter, setCouponStatusFilter] = useState<'unused' | 'used'>('unused');

  const categories = ['전체', '카페/음료', '편의점/마트', '베이커리/디저트', '패스트푸드'];

  const filteredCoupons = coupons.filter(c => {
    if (selectedCategory === '전체') return true;
    return c.category === selectedCategory;
  });

  const filteredMyCoupons = purchasedCoupons.filter(c => {
    if (couponStatusFilter === 'unused') return !c.isUsed;
    return c.isUsed;
  });

  const unusedCount = purchasedCoupons.filter(c => !c.isUsed).length;

  const handlePurchase = async (coupon: ECouponItem) => {
    setIsPurchasing(true);
    try {
      const success = await purchaseCoupon(coupon);
      if (success) {
        setSelectedProduct(null);
        setActiveSubTab('myCoupons');
        setCouponStatusFilter('unused');
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleCopyBarcode = (barcode: string) => {
    navigator.clipboard.writeText(barcode.replace(/-/g, ''));
    setCopiedBarcode(true);
    setTimeout(() => setCopiedBarcode(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8F9FA] min-h-screen pb-24 select-none">
      {/* 1. Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 font-bold">
            <Gift className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-[17px] font-black text-gray-900 tracking-tight">e쿠폰 스토어</h1>
            <p className="text-[11px] text-gray-400 font-medium">포인트로 맛있는 e쿠폰 교환</p>
          </div>
        </div>

        {/* 내 포인트 버튼 */}
        <button
          onClick={() => setIsPointHistoryOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 rounded-full transition-colors active:scale-95"
          title="포인트 적립·사용 내역"
        >
          <Coins className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[13px] font-extrabold text-amber-700">
            {userPoints.toLocaleString()}
          </span>
          <span className="text-[11px] font-bold text-amber-600">P</span>
        </button>
      </header>

      {/* 2. Point Banner & Fast Test Charge Banner */}
      <div className="px-4 pt-3">
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-4 text-white shadow-sm shadow-amber-500/10 relative overflow-hidden">
          <div className="absolute right-[-10px] bottom-[-15px] opacity-15 pointer-events-none">
            <Gift className="w-28 h-28" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-100 flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full backdrop-blur-xs">
                <Sparkles className="w-3 h-3 text-amber-200" />
                신상픽 리워드 혜택
              </span>
              <button
                onClick={() => addTestPoints(5000)}
                className="text-[11px] font-bold bg-white text-amber-700 px-2.5 py-1 rounded-full shadow-xs hover:bg-amber-50 active:scale-95 transition-all flex items-center gap-1"
                title="테스트를 위한 무료 5,000P 즉시 충전"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>+5,000P 받기</span>
              </button>
            </div>

            <div className="mt-2.5 flex items-baseline justify-between">
              <div>
                <p className="text-[12px] text-amber-100 font-medium">나의 보유 포인트</p>
                <p className="text-2xl font-black tracking-tight flex items-baseline gap-1 mt-0.5">
                  {userPoints.toLocaleString()} <span className="text-base font-bold">P</span>
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory('신제품');
                  setActiveTab('category');
                }}
                className="text-[11px] text-white/90 hover:text-white flex items-center gap-0.5 font-semibold bg-white/10 px-2.5 py-1.5 rounded-xl backdrop-blur-xs"
              >
                리뷰 쓰고 모으기 <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Switch Tabs (스토어 vs 내 쿠폰함) */}
      <div className="px-4 pt-4">
        <div className="flex bg-gray-200/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('store')}
            className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'store'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Gift className="w-4 h-4 stroke-[2]" />
            <span>e쿠폰 구매</span>
          </button>
          <button
            onClick={() => setActiveSubTab('myCoupons')}
            className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 relative ${
              activeSubTab === 'myCoupons'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>내 쿠폰함</span>
            {unusedCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-extrabold bg-rose-500 text-white rounded-full">
                {unusedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 4. Sub Content Area */}
      {activeSubTab === 'store' ? (
        <div className="px-4 pt-4 space-y-3">
          {/* Category Pill Filters */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCouponCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* eCoupon Items Grid / List */}
          <div className="grid grid-cols-1 gap-3 pt-1">
            {filteredCoupons.map((coupon) => {
              const canAfford = userPoints >= coupon.price;
              const pointShortage = coupon.price - userPoints;

              return (
                <div
                  key={coupon.id}
                  onClick={() => setSelectedProduct(coupon)}
                  className="bg-white rounded-2xl border border-gray-100 p-3.5 shadow-xs hover:border-amber-200 hover:shadow-md transition-all cursor-pointer flex gap-3.5 group"
                >
                  {/* Thumbnail Image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 relative">
                    <img
                      src={coupon.imageUrl}
                      alt={coupon.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur-xs text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                      {coupon.brand}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-bold text-gray-400">{coupon.category}</span>
                        {canAfford ? (
                          <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                            교환 가능
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            {pointShortage.toLocaleString()}P 부족
                          </span>
                        )}
                      </div>
                      <h3 className="text-[14px] font-bold text-gray-900 line-clamp-1 mt-0.5">
                        {coupon.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                        {coupon.description}
                      </p>
                    </div>

                    <div className="flex items-end justify-between mt-2 pt-2 border-t border-gray-50">
                      <div>
                        <span className="text-[10px] text-gray-400">교환 포인트</span>
                        <div className="text-[15px] font-black text-amber-600 flex items-baseline gap-0.5 leading-none">
                          <span>{coupon.price.toLocaleString()}</span>
                          <span className="text-[12px] font-bold">P</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(coupon);
                        }}
                        className={`text-[12px] font-bold px-3 py-1.5 rounded-xl transition-all ${
                          canAfford
                            ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs active:scale-95'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        교환하기
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 안내 카드 */}
          <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-3.5 text-[11px] text-amber-800 space-y-1 mt-4">
            <div className="font-bold flex items-center gap-1 text-amber-900">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <span>e쿠폰 이용 유의사항</span>
            </div>
            <p>• 신상픽에서 적립된 포인트로 전국 매장에서 실사용 가능한 모바일 e쿠폰을 교환하실 수 있습니다.</p>
            <p>• 교환 완료 즉시 <strong>[내 쿠폰함]</strong>에서 16자리 바코드가 발급되며 매장 결제 시 제시하여 사용합니다.</p>
            <p>• 상품의 유효기간 및 세부 교환 조건은 상품 상세페이지를 참조해 주세요.</p>
          </div>
        </div>
      ) : (
        /* 내 쿠폰함 뷰 */
        <div className="px-4 pt-4 space-y-3">
          {/* Unused vs Used Sub Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCouponStatusFilter('unused')}
              className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-colors ${
                couponStatusFilter === 'unused'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-500 border border-gray-200'
              }`}
            >
              사용 가능 ({purchasedCoupons.filter(c => !c.isUsed).length})
            </button>
            <button
              onClick={() => setCouponStatusFilter('used')}
              className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-colors ${
                couponStatusFilter === 'used'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-500 border border-gray-200'
              }`}
            >
              사용 완료 ({purchasedCoupons.filter(c => c.isUsed).length})
            </button>
          </div>

          {/* Coupon List */}
          {filteredMyCoupons.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center my-6">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
                <Gift className="w-6 h-6" />
              </div>
              <h4 className="text-[15px] font-bold text-gray-800">
                {couponStatusFilter === 'unused' ? '보관 중인 e쿠폰이 없습니다.' : '사용 완료된 e쿠폰이 없습니다.'}
              </h4>
              <p className="text-[12px] text-gray-400 mt-1">
                {couponStatusFilter === 'unused' 
                  ? '스토어에서 모은 포인트로 원하는 e쿠폰을 교환해보세요!' 
                  : '매장에서 사용한 e쿠폰 내역이 이곳에 표시됩니다.'}
              </p>
              {couponStatusFilter === 'unused' && (
                <button
                  onClick={() => setActiveSubTab('store')}
                  className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[12px] rounded-xl shadow-xs"
                >
                  e쿠폰 둘러보기
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMyCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  onClick={() => setSelectedUserCoupon(coupon)}
                  className={`bg-white rounded-2xl border p-4 shadow-xs transition-all cursor-pointer relative overflow-hidden ${
                    coupon.isUsed ? 'border-gray-200 opacity-60 bg-gray-50/80' : 'border-amber-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                      <img src={coupon.imageUrl} alt={coupon.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                          {coupon.brand}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          coupon.isUsed 
                            ? 'bg-gray-200 text-gray-600' 
                            : 'bg-emerald-500 text-white'
                        }`}>
                          {coupon.isUsed ? '사용 완료' : '사용 가능'}
                        </span>
                      </div>

                      <h4 className="text-[14px] font-bold text-gray-900 mt-1 truncate">
                        {coupon.name}
                      </h4>

                      <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-2">
                        <span>유효기간: ~ {coupon.expiresAt}</span>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] text-amber-600 font-bold">
                          {coupon.price.toLocaleString()}P 교환
                        </span>
                        <span className="text-[11px] font-bold text-gray-700 flex items-center gap-0.5 hover:text-amber-600">
                          바코드 보기 <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. e쿠폰 구매(교환) 확인 모달 */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          <div 
            className="w-full max-w-[430px] bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            <div className="relative h-56 bg-gray-100 shrink-0">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center font-bold text-sm hover:bg-black/70 transition-colors"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-4 bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                {selectedProduct.brand}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 flex-1">
              <div>
                <span className="text-[11px] font-bold text-amber-600">{selectedProduct.category}</span>
                <h3 className="text-[18px] font-black text-gray-900 mt-0.5">
                  {selectedProduct.name}
                </h3>
                <p className="text-[13px] text-gray-600 mt-1 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              {/* 교환 조건 카드 */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2.5">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-gray-500 font-medium">내 보유 포인트</span>
                  <span className="font-extrabold text-gray-900">{userPoints.toLocaleString()} P</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-gray-500 font-medium">필요 포인트</span>
                  <span className="font-extrabold text-amber-600">-{selectedProduct.price.toLocaleString()} P</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[14px]">
                  <span className="text-gray-700 font-bold">교환 후 잔여 포인트</span>
                  <span className={`font-black ${userPoints >= selectedProduct.price ? 'text-gray-900' : 'text-rose-500'}`}>
                    {(userPoints - selectedProduct.price).toLocaleString()} P
                  </span>
                </div>
              </div>

              {/* 상세 정보 */}
              <div className="space-y-2 text-[12px] text-gray-600 bg-amber-50/50 p-3.5 rounded-xl border border-amber-100">
                <div className="flex items-start gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 font-bold">교환처:</strong> {selectedProduct.exchangeGuide}
                  </div>
                </div>
                <div className="flex items-start gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 font-bold">유효기간:</strong> 교환일로부터 {selectedProduct.expiryDays}일
                  </div>
                </div>
              </div>

              {/* 유의사항 */}
              <div>
                <h4 className="text-[12px] font-bold text-gray-700 mb-1.5">이용 유의사항</h4>
                <ul className="text-[11px] text-gray-500 space-y-1 list-disc list-inside">
                  {selectedProduct.notices.map((n, idx) => (
                    <li key={idx}>{n}</li>
                  ))}
                </ul>
              </div>

              {/* 포인트 부족 시 충전 유도 */}
              {userPoints < selectedProduct.price && (
                <div className="bg-rose-50 border border-rose-200/60 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="text-[11px] font-bold text-rose-700">
                      포인트가 {(selectedProduct.price - userPoints).toLocaleString()}P 부족합니다.
                    </span>
                  </div>
                  <button
                    onClick={() => addTestPoints(5000)}
                    className="text-[11px] font-bold bg-rose-500 hover:bg-rose-600 text-white px-2.5 py-1 rounded-lg shrink-0 shadow-xs"
                  >
                    +5,000P 받기
                  </button>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                <button
                  disabled={isPurchasing || userPoints < selectedProduct.price}
                  onClick={() => handlePurchase(selectedProduct)}
                  className={`w-full py-3.5 rounded-xl font-extrabold text-[15px] transition-all flex items-center justify-center gap-2 shadow-sm ${
                    userPoints >= selectedProduct.price
                      ? 'bg-amber-500 hover:bg-amber-600 text-white active:scale-98'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isPurchasing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{selectedProduct.price.toLocaleString()}P로 즉시 교환하기</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. 내 쿠폰 바코드 상세 모달 (매장 사용 화면) */}
      {selectedUserCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div 
            className="w-full max-w-[380px] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col relative"
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
              <p className="text-[11px] text-gray-300 mt-0.5">유효기간: ~ {selectedUserCoupon.expiresAt}</p>
            </div>

            {/* Barcode Display Area */}
            <div className="p-6 text-center space-y-4">
              {/* Used Status Stamp */}
              {selectedUserCoupon.isUsed && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 rounded-xl py-2 px-3 text-[12px] font-black flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>이미 사용 완료된 쿠폰입니다 ({selectedUserCoupon.usedAt || '사용완료'})</span>
                </div>
              )}

              {/* Visual Simulated Barcode */}
              <div className={`bg-[#F8F9FA] p-5 rounded-2xl border border-gray-200 flex flex-col items-center justify-center ${
                selectedUserCoupon.isUsed ? 'grayscale opacity-40' : ''
              }`}>
                {/* CSS/SVG Barcode Lines */}
                <div className="h-16 w-56 flex items-center justify-between px-2 overflow-hidden">
                  <div className="w-1.5 h-full bg-black"></div>
                  <div className="w-0.5 h-full bg-black"></div>
                  <div className="w-2 h-full bg-black"></div>
                  <div className="w-1 h-full bg-black"></div>
                  <div className="w-0.5 h-full bg-black"></div>
                  <div className="w-3 h-full bg-black"></div>
                  <div className="w-1.5 h-full bg-black"></div>
                  <div className="w-0.5 h-full bg-black"></div>
                  <div className="w-2.5 h-full bg-black"></div>
                  <div className="w-1 h-full bg-black"></div>
                  <div className="w-3 h-full bg-black"></div>
                  <div className="w-0.5 h-full bg-black"></div>
                  <div className="w-2 h-full bg-black"></div>
                  <div className="w-1.5 h-full bg-black"></div>
                  <div className="w-0.5 h-full bg-black"></div>
                  <div className="w-2 h-full bg-black"></div>
                  <div className="w-1 h-full bg-black"></div>
                  <div className="w-2.5 h-full bg-black"></div>
                  <div className="w-0.5 h-full bg-black"></div>
                  <div className="w-1.5 h-full bg-black"></div>
                </div>

                {/* Barcode Number & Copy */}
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="font-mono text-[16px] font-black tracking-widest text-gray-900">
                    {selectedUserCoupon.barcodeNumber}
                  </span>
                  <button
                    onClick={() => handleCopyBarcode(selectedUserCoupon.barcodeNumber)}
                    className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
                    title="바코드 번호 복사"
                  >
                    {copiedBarcode ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {selectedUserCoupon.pinNumber && (
                  <div className="text-[11px] text-gray-400 mt-1 font-mono">
                    PIN 번호: <strong className="text-gray-700">{selectedUserCoupon.pinNumber}</strong>
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
                    setSelectedUserCoupon(prev => prev ? { ...prev, isUsed: !prev.isUsed } : null);
                  }}
                  className={`flex-1 py-3 rounded-xl font-bold text-[13px] transition-all flex items-center justify-center gap-1.5 ${
                    selectedUserCoupon.isUsed
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{selectedUserCoupon.isUsed ? '사용 취소 (미사용으로 변경)' : '매장에서 사용 완료하기'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. 포인트 적립/사용 내역 모달 */}
      <PointHistoryModal
        isOpen={isPointHistoryOpen}
        onClose={() => setIsPointHistoryOpen(false)}
      />
    </div>
  );
};
