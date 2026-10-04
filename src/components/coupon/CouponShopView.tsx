import React, { useState } from 'react';
import { 
  Gift, 
  Copy, 
  Check, 
  ChevronRight, 
  Clock, 
  Ticket, 
  Sparkles, 
  CheckCircle2,
  Compass,
  Home
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PurchasedECoupon } from '../../types';

export const CouponShopView: React.FC = () => {
  const { 
    purchasedCoupons, 
    useCoupon, 
    userPoints,
    setActiveTab,
    setSelectedCategory
  } = useApp();

  // 모달 상태
  const [selectedUserCoupon, setSelectedUserCoupon] = useState<PurchasedECoupon | null>(null);
  const [isRecentCouponsOpen, setIsRecentCouponsOpen] = useState(false);
  const [copiedBarcode, setCopiedBarcode] = useState(false);

  const unusedCount = purchasedCoupons.filter(c => !c.isUsed).length;

  const handleCopyBarcode = (barcode: string) => {
    navigator.clipboard.writeText(barcode.replace(/-/g, ''));
    setCopiedBarcode(true);
    setTimeout(() => setCopiedBarcode(false), 2000);
  };

  const upcomingBrands = [
    '스타벅스',
    'CU 편의점',
    'GS25 편의점',
    '메가MGC커피',
    '배스킨라빈스',
    '파리바게뜨',
    '맥도날드',
    '맘스터치'
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F8F9FA] min-h-screen pb-24 select-none">
      {/* 1. Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 font-bold">
            <Gift className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-[17px] font-black text-gray-900 tracking-tight">e쿠폰</h1>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                준비중
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">포인트 모바일 쿠폰 교환</p>
          </div>
        </div>

        {/* 기존에 교환했던 쿠폰이 있는 경우 확인 버튼 */}
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

      {/* 2. 전체 준비중 메인 화면 (Full Under Preparation View) */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 text-center">
        {/* 아이콘 그래픽 */}
        <div className="relative mb-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-lg shadow-amber-500/25">
            <Gift className="w-10 h-10 stroke-[2]" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center">
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
        </div>

        {/* 준비중 배지 */}
        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200/80 mb-3">
          <Sparkles className="w-3 h-3 text-amber-600" />
          <span>서비스 오픈 준비 중</span>
        </span>

        {/* 타이틀 및 상세 설명 */}
        <h2 className="text-[20px] font-black text-gray-900 leading-snug tracking-tight">
          e쿠폰 상점을<br />정성껏 준비하고 있습니다
        </h2>

        <p className="text-[13px] text-gray-500 mt-2.5 leading-relaxed max-w-xs">
          회원님들께 더 다양하고 풍성한 모바일 쿠폰 혜택을 제공해드리기 위해 제휴사 시스템 연동을 준비 중입니다. 조금만 기다려 주세요!
        </p>

        {/* 내 포인트 안전 보관 카드 */}
        <div className="w-full max-w-sm bg-white rounded-2xl p-4 border border-gray-100 shadow-xs mt-6 text-left">
          <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
            <span className="text-[11px] font-bold text-gray-500">내 보유 포인트</span>
            <div className="text-[16px] font-black text-amber-600 flex items-baseline gap-0.5">
              <span>{userPoints.toLocaleString()}</span>
              <span className="text-[12px] font-bold">P</span>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
            🌟 신상픽 리뷰 및 이벤트로 모으신 포인트는 안전하게 보관되며, e쿠폰 상점 오픈 시 기프티콘으로 즉시 교환하실 수 있습니다.
          </p>
        </div>

        {/* 오픈 예정 브랜드 칩 */}
        <div className="w-full max-w-sm mt-5 text-left">
          <span className="text-[11px] font-extrabold text-gray-400 block mb-2 px-1">
            입점 예정 브랜드
          </span>
          <div className="flex flex-wrap gap-1.5">
            {upcomingBrands.map((b) => (
              <span
                key={b}
                className="text-[11px] font-bold bg-white text-gray-600 px-2.5 py-1 rounded-lg border border-gray-200/80 shadow-2xs"
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* 둘러보기 버튼 액션 */}
        <div className="w-full max-w-sm grid grid-cols-2 gap-2.5 mt-6">
          <button
            onClick={() => {
              setSelectedCategory('신제품');
              setActiveTab('category');
            }}
            className="py-3 px-3 bg-gray-900 hover:bg-black text-white font-black text-[13px] rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors active:scale-98"
          >
            <Compass className="w-4 h-4" />
            <span>신제품 둘러보기</span>
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className="py-3 px-3 bg-white hover:bg-gray-50 text-gray-700 font-bold text-[13px] rounded-xl border border-gray-200 flex items-center justify-center gap-1.5 shadow-2xs transition-colors active:scale-98"
          >
            <Home className="w-4 h-4 text-gray-500" />
            <span>홈으로 가기</span>
          </button>
        </div>
      </div>

      {/* 3. 바코드 상세 모달 (보유한 쿠폰이 있을 때 터치 시 오픈) */}
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

      {/* 4. 최근 구매한 e쿠폰 목록 팝업 */}
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
