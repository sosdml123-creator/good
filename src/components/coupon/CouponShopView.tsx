import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  Copy, 
  Check, 
  ChevronRight, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  Tag,
  Zap,
  ShoppingBag,
  ExternalLink,
  CalendarCheck,
  PenLine,
  UtensilsCrossed,
  Sparkles,
  Ticket
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ECouponItem, PurchasedECoupon } from '../../types';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

export const CouponShopView: React.FC = () => {
  const { 
    coupons, 
    purchasedCoupons, 
    purchaseCoupon, 
    useCoupon, 
    userPoints, 
    addTestPoints,
    setActiveTab,
    setSelectedCategory,
    openWriteRecipe
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'store' | 'recharge'>('store');
  const [selectedCategory, setSelectedCouponCategory] = useState<string>('전체');
  
  // 모달 상태
  const [selectedProduct, setSelectedProduct] = useState<ECouponItem | null>(null);
  const [selectedUserCoupon, setSelectedUserCoupon] = useState<PurchasedECoupon | null>(null);
  const [isRecentCouponsOpen, setIsRecentCouponsOpen] = useState(false);
  const [copiedBarcode, setCopiedBarcode] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // 일일 출석체크 상태 (localStorage 기반)
  const [isCheckedToday, setIsCheckedToday] = useState(false);

  useEffect(() => {
    try {
      const todayStr = new Date().toDateString();
      const lastCheck = localStorage.getItem('sinsangpick_last_attendance_date');
      if (lastCheck === todayStr) {
        setIsCheckedToday(true);
      }
    } catch {}
  }, []);

  const categories = ['전체', '카페/음료', '편의점/마트', '베이커리/디저트', '패스트푸드'];

  const filteredCoupons = coupons.filter(c => {
    if (selectedCategory === '전체') return true;
    return c.category === selectedCategory;
  });

  const unusedCount = purchasedCoupons.filter(c => !c.isUsed).length;

  // 외부 링크 열기 (쿠팡 등)
  const openExternalLink = async (url: string, rewardPoints?: number) => {
    if (rewardPoints && rewardPoints > 0) {
      addTestPoints(rewardPoints);
    }
    if (Capacitor.isNativePlatform()) {
      try {
        await Browser.open({ url });
        return;
      } catch {}
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 출석체크 처리
  const handleDailyAttendance = () => {
    if (isCheckedToday) return;
    const todayStr = new Date().toDateString();
    try {
      localStorage.setItem('sinsangpick_last_attendance_date', todayStr);
    } catch {}
    setIsCheckedToday(true);
    addTestPoints(20);
  };

  // e쿠폰 구매 처리
  const handlePurchase = async (coupon: ECouponItem) => {
    setIsPurchasing(true);
    try {
      const purchased = await purchaseCoupon(coupon);
      if (purchased) {
        setSelectedProduct(null);
        // 구매 성공 즉시 발급된 모바일 바코드 모달 팝업 열기
        setSelectedUserCoupon(purchased);
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

        {/* 보유 쿠폰이 있을 경우 빠른 보기 버튼 */}
        {purchasedCoupons.length > 0 && (
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
        )}
      </header>

      {/* 2. Main Switch Tabs (e쿠폰 구매 vs 포인트 충전함) */}
      <div className="px-4 pt-3">
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
            onClick={() => setActiveSubTab('recharge')}
            className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'recharge'
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>포인트 충전함</span>
          </button>
        </div>
      </div>

      {/* 3. Sub Content Area */}
      {activeSubTab === 'store' ? (
        /* [e쿠폰 구매 탭] */
        <div className="px-4 pt-3 space-y-3">
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

          {/* eCoupon Items Grid (1줄에 2개씩) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {filteredCoupons.map((coupon) => {
              const canAfford = userPoints >= coupon.price;

              return (
                <div
                  key={coupon.id}
                  onClick={() => setSelectedProduct(coupon)}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:border-amber-200 hover:shadow-md transition-all cursor-pointer flex flex-col group"
                >
                  {/* Thumbnail Image (정방형 1:1) */}
                  <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
                    <img
                      src={coupon.imageUrl}
                      alt={coupon.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {coupon.brand}
                    </div>
                    {canAfford && (
                      <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                        교환 가능
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400">{coupon.category}</span>
                      <h3 className="text-[13px] font-bold text-gray-900 line-clamp-2 mt-0.5 leading-tight min-h-[34px]">
                        {coupon.name}
                      </h3>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-50 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-gray-400 block leading-none">필요 포인트</span>
                        <div className="text-[14px] font-black text-amber-600 flex items-baseline gap-0.5 mt-0.5">
                          <span>{coupon.price.toLocaleString()}</span>
                          <span className="text-[11px] font-bold">P</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(coupon);
                        }}
                        className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl transition-all ${
                          canAfford
                            ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs active:scale-95'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        교환
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 포인트 부족 안내 & 충전함 유도 카드 */}
          <div 
            onClick={() => setActiveSubTab('recharge')}
            className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/70 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-amber-100/60 transition-colors shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <div>
                <div className="text-[12px] font-extrabold text-amber-900">포인트가 부족하신가요?</div>
                <div className="text-[11px] text-amber-700">쿠팡 쇼핑 & 미션으로 포인트 무료 충전하기</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-600" />
          </div>

          {/* 이용 안내 카드 */}
          <div className="bg-white border border-gray-100 rounded-2xl p-3.5 text-[11px] text-gray-500 space-y-1">
            <div className="font-bold flex items-center gap-1 text-gray-700">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <span>e쿠폰 이용 유의사항</span>
            </div>
            <p>• 적립된 포인트로 전국 매장에서 실사용 가능한 모바일 e쿠폰을 교환하실 수 있습니다.</p>
            <p>• 교환 완료 즉시 16자리 바코드가 발급되며 매장 결제 시 제시하여 사용합니다.</p>
          </div>
        </div>
      ) : (
        /* [⚡ 포인트 충전함 탭] */
        <div className="px-4 pt-3 space-y-3.5">
          {/* 보유 포인트 상태 헤더 바 */}
          <div className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400">현재 보유 포인트</span>
              <span className="text-[15px] font-black text-amber-600">{userPoints.toLocaleString()} P</span>
            </div>
            <div className="text-[11px] text-gray-400 font-medium">
              충전 즉시 e쿠폰 교환 가능
            </div>
          </div>

          {/* 1. 쿠팡 로켓쇼핑 적립 구좌 (메인 제휴) */}
          <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
            <div className="absolute right-[-15px] bottom-[-15px] opacity-10 pointer-events-none">
              <ShoppingBag className="w-32 h-32" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-black bg-[#C62828] text-white px-2 py-0.5 rounded-md">
                    쿠팡
                  </span>
                  <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                    인기 충전 구좌 🔥
                  </span>
                </div>
                <span className="text-[11px] font-extrabold text-amber-400">+50P 적립</span>
              </div>

              <h3 className="text-[16px] font-black mt-2 leading-tight">
                쿠팡 로켓쇼핑하고 포인트 적립
              </h3>
              <p className="text-[12px] text-slate-300 mt-1 leading-relaxed">
                생필품, 신상 먹거리, 간식 등 쿠팡에서 쇼핑하고 신상픽 포인트를 채워보세요!
              </p>

              <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">방문 시 리워드 즉시 지급</span>
                <button
                  onClick={() => openExternalLink('https://www.coupang.com', 50)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-[12px] font-extrabold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                >
                  <span>쿠팡 쇼핑하러 가기</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 2. 제휴 쇼핑 적립 리스트 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs space-y-3">
            <h4 className="text-[13px] font-extrabold text-gray-900 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              <span>제휴 쇼핑몰 둘러보기</span>
            </h4>

            {/* 네이버 쇼핑 */}
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 font-black flex items-center justify-center text-xs">
                  N
                </div>
                <div>
                  <div className="text-[13px] font-bold text-gray-900">네이버 스마트스토어</div>
                  <div className="text-[11px] text-gray-400">신제품 특가 쇼핑하고 포인트 받기</div>
                </div>
              </div>
              <button
                onClick={() => openExternalLink('https://shopping.naver.com', 30)}
                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[11px] font-bold flex items-center gap-0.5 transition-colors"
              >
                +30P 가기
              </button>
            </div>

            {/* 마켓컬리 */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 font-black flex items-center justify-center text-xs">
                  Kurly
                </div>
                <div>
                  <div className="text-[13px] font-bold text-gray-900">마켓컬리 신선특가</div>
                  <div className="text-[11px] text-gray-400">새벽배송 신제품 & 디저트 장보기</div>
                </div>
              </div>
              <button
                onClick={() => openExternalLink('https://www.kurly.com', 30)}
                className="px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-[11px] font-bold flex items-center gap-0.5 transition-colors"
              >
                +30P 가기
              </button>
            </div>
          </div>

          {/* 3. 신상픽 무료 미션으로 모으기 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs space-y-3">
            <h4 className="text-[13px] font-extrabold text-gray-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>신상픽 무료 미션 적립</span>
            </h4>

            {/* 일일 출석체크 */}
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-gray-900">오늘의 출석체크</div>
                  <div className="text-[11px] text-gray-400">매일 터치 1번으로 즉시 충전</div>
                </div>
              </div>
              <button
                onClick={handleDailyAttendance}
                disabled={isCheckedToday}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                  isCheckedToday
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs active:scale-95'
                }`}
              >
                {isCheckedToday ? '오늘 완료 ✓' : '+20P 받기'}
              </button>
            </div>

            {/* 신제품 리뷰 작성 */}
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <PenLine className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-gray-900">신제품 솔직 리뷰 작성</div>
                  <div className="text-[11px] text-gray-400">사진 첨부 시 1건당 최대 100P</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('신제품');
                  setActiveTab('category');
                }}
                className="px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-[11px] font-bold flex items-center gap-0.5 transition-colors"
              >
                리뷰 쓰기 ↗
              </button>
            </div>

            {/* 꿀조합 레시피 공유 */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-gray-900">먹조합 레시피 등록</div>
                  <div className="text-[11px] text-gray-400">나만의 편의점 먹조합 공유 시</div>
                </div>
              </div>
              <button
                onClick={() => openWriteRecipe()}
                className="px-2.5 py-1.5 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-xl text-[11px] font-bold flex items-center gap-0.5 transition-colors"
              >
                +50P 등록 ↗
              </button>
            </div>
          </div>

          {/* 4. [테스트/체험 지원] 빠른 포인트 무료 충전 */}
          <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-4 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-extrabold text-amber-900">🧪 테스트 포인트 즉시 충전</span>
              <span className="text-[11px] text-amber-600 font-medium">체험용 무료 지원</span>
            </div>
            <p className="text-[11px] text-amber-700">
              e쿠폰 교환 테스트를 위해 원하는 금액을 즉시 충전해보세요.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => addTestPoints(1000)}
                className="flex-1 py-2 bg-white hover:bg-amber-100/50 border border-amber-200 rounded-xl text-[12px] font-bold text-amber-800 active:scale-95 transition-all shadow-2xs"
              >
                +1,000P 충전
              </button>
              <button
                onClick={() => addTestPoints(5000)}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[12px] font-bold active:scale-95 transition-all shadow-xs"
              >
                +5,000P 충전
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. e쿠폰 구매(교환) 확인 모달 */}
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
                      {(selectedProduct.price - userPoints).toLocaleString()}P가 부족합니다.
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      setActiveSubTab('recharge');
                    }}
                    className="text-[11px] font-bold bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1 rounded-lg shrink-0 shadow-xs active:scale-95 transition-all"
                  >
                    포인트 충전하러 가기
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

      {/* 5. 바코드 상세 모달 (구매 완료 즉시 또는 내 쿠폰 터치 시 오픈) */}
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
                  <span>사용 완료된 쿠폰 ({selectedUserCoupon.usedAt || '사용완료'})</span>
                </div>
              )}

              {/* Visual Simulated Barcode */}
              <div className={`bg-[#F8F9FA] p-5 rounded-2xl border border-gray-200 flex flex-col items-center justify-center ${
                selectedUserCoupon.isUsed ? 'grayscale opacity-40' : ''
              }`}>
                {/* CSS Barcode Lines */}
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

      {/* 6. 최근 구매한 e쿠폰 목록 팝업 */}
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
                      <span>~ {coupon.expiresAt}</span>
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
