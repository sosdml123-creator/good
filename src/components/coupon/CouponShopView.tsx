import React, { useState } from 'react';
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
  ExternalLink,
  Ticket,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ECouponItem, PurchasedECoupon } from '../../types';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

interface PartnerShopInfo {
  id: 'coupang' | 'toss';
  name: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  accentColor: string;
  logo: React.ReactNode;
  summary: string;
  benefitTag: string;
  externalUrl: string;
  modal: {
    title: string;
    subTitle: string;
    description: string;
    steps: { step: string; title: string; desc: string }[];
    benefits: string[];
    cautions: string[];
    buttonText: string;
    buttonBg: string;
  };
}

export const CouponShopView: React.FC = () => {
  const { 
    coupons, 
    purchasedCoupons, 
    purchaseCoupon, 
    useCoupon, 
    userPoints 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'store' | 'recharge'>('store');
  const [selectedCategory, setSelectedCouponCategory] = useState<string>('전체');
  
  // 모달 상태
  const [selectedProduct, setSelectedProduct] = useState<ECouponItem | null>(null);
  const [selectedUserCoupon, setSelectedUserCoupon] = useState<PurchasedECoupon | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<PartnerShopInfo | null>(null);
  const [isRecentCouponsOpen, setIsRecentCouponsOpen] = useState(false);
  const [copiedBarcode, setCopiedBarcode] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const categories = ['전체', '카페/음료', '편의점/마트', '베이커리/디저트', '패스트푸드'];

  const filteredCoupons = coupons.filter(c => {
    if (selectedCategory === '전체') return true;
    return c.category === selectedCategory;
  });

  const unusedCount = purchasedCoupons.filter(c => !c.isUsed).length;

  // 제휴 쇼핑 파트너 데이터 (쿠팡 & 토스쇼핑)
  const partnerShops: PartnerShopInfo[] = [
    {
      id: 'coupang',
      name: '쿠팡 (Coupang)',
      badge: '로켓배송 적립',
      badgeBg: 'bg-red-50 border-red-200/60',
      badgeText: 'text-red-700',
      accentColor: '#E1251B',
      benefitTag: '쇼핑 결제 리워드 적립',
      summary: '필요한 생필품, 신상 간식, 먹거리를 로켓배송으로 쇼핑하고 신상픽 포인트를 적립받아보세요!',
      externalUrl: 'https://www.coupang.com',
      logo: (
        <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-gray-100 flex items-center justify-center p-2.5 shrink-0 overflow-hidden">
          <img
            src="/brands/coupang_logo.svg"
            alt="쿠팡 로고"
            className="w-full h-auto object-contain max-h-7"
          />
        </div>
      ),
      modal: {
        title: '쿠팡 로켓쇼핑 적립 안내',
        subTitle: '쿠팡에서 쇼핑하고 신상픽 e쿠폰 교환 포인트 적립받기',
        description: '쿠팡에서 평소처럼 필요한 물건을 쇼핑하시면, 구매 실적에 따라 신상픽 리워드 포인트가 적립되어 원하는 스타벅스, 편의점 e쿠폰으로 즉시 교환하실 수 있습니다.',
        steps: [
          {
            step: '01',
            title: '쿠팡으로 이동하기',
            desc: '아래 [쿠팡 쇼핑하러 가기] 버튼을 눌러 공식 쿠팡 웹 또는 앱으로 접속합니다.'
          },
          {
            step: '02',
            title: '원하는 상품 쇼핑 & 결제',
            desc: '생필품, 신상 먹거리, 가전 등 원하는 상품을 장바구니에 담고 결제합니다.'
          },
          {
            step: '03',
            title: '신상픽 포인트 적립 확인',
            desc: '구매 확정 후 신상픽 포인트로 적립되어 다양한 e쿠폰을 교환할 수 있습니다.'
          }
        ],
        benefits: [
          '로켓배송 & 로켓프레시 등 쿠팡의 모든 상품 적립 대상',
          '오늘 주문하면 내일 새벽 도착하는 빠른 배송 혜택 그대로',
          '차곡차곡 모은 포인트로 e쿠폰 스토어에서 즉시 기프티콘 교환'
        ],
        cautions: [
          '반드시 신상픽에서 제공하는 연결 링크를 통해 접속하셔야 적립 대상에 포함됩니다.',
          '장바구니에 미리 담아둔 상품의 경우 연결 추적이 누락될 수 있으니, 링크 접속 후 상품을 담아 결제해 주세요.',
          '주문 취소 또는 반품 시 적립 포인트는 지급되지 않거나 회수 처리됩니다.'
        ],
        buttonText: '쿠팡 쇼핑하러 이동하기',
        buttonBg: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500'
      }
    },
    {
      id: 'toss',
      name: '토스쇼핑 (Toss)',
      badge: '공동구매 특가 적립',
      badgeBg: 'bg-blue-50 border-blue-200/60',
      badgeText: 'text-blue-700',
      accentColor: '#0064FF',
      benefitTag: '최저가 쇼핑 + 포인트 적립',
      summary: '1개만 사도 100% 무료배송! 파격적인 할인가의 공동구매 특가를 누리고 포인트도 충전하세요!',
      externalUrl: 'https://toss.im',
      logo: (
        <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-gray-100 flex items-center justify-center p-2 shrink-0 overflow-hidden">
          <img
            src="/brands/toss_symbol.png"
            alt="토스 로고"
            className="w-10 h-10 object-contain"
          />
        </div>
      ),
      modal: {
        title: '토스쇼핑 공동구매 적립 안내',
        subTitle: '1개만 사도 무료배송 & 공동구매 특가 쇼핑 혜택',
        description: '토스쇼핑에서 인기 간식, 신선식품, 생활용품을 파격적인 할인가에 구매하고 신상픽 리워드 포인트도 함께 챙겨보세요.',
        steps: [
          {
            step: '01',
            title: '토스쇼핑으로 이동하기',
            desc: '아래 [토스쇼핑으로 이동하기] 버튼을 눌러 토스쇼핑 페이지 또는 토스 앱으로 이동합니다.'
          },
          {
            step: '02',
            title: '공동구매 특가 상품 선택',
            desc: '매일 업데이트되는 인기 식품 및 특가 상품을 고르고 결제를 완료합니다.'
          },
          {
            step: '03',
            title: '포인트 적립 & 무료배송',
            desc: '1개만 구매해도 전 상품 무료배송 혜택과 함께 신상픽 포인트가 적립됩니다.'
          }
        ],
        benefits: [
          '단 1개만 사도 배송비 0원, 전 상품 무료배송 혜택',
          '시중가 대비 최대 80% 할인되는 토스 인기 공동구매 특가',
          '신상픽 포인트 추가 적립으로 맛있는 e쿠폰 교환 기회'
        ],
        cautions: [
          '신상픽 앱 내 링크를 통해 이동 후 24시간 이내 구매 완료 건에 한해 인정됩니다.',
          '스마트폰에 토스 앱이 설치되어 있는 경우 토스 앱으로 자동 연결될 수 있습니다.',
          '구매 취소 및 환불 시 포인트 지급 대상에서 제외됩니다.'
        ],
        buttonText: '토스쇼핑으로 이동하기',
        buttonBg: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500'
      }
    }
  ];

  // 외부 링크 열기
  const openExternalLink = async (url: string) => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Browser.open({ url });
        return;
      } catch {}
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // e쿠폰 구매 처리
  const handlePurchase = async (coupon: ECouponItem) => {
    setIsPurchasing(true);
    try {
      const purchased = await purchaseCoupon(coupon);
      if (purchased) {
        setSelectedProduct(null);
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

        {/* 보유 쿠폰 빠른 보기 버튼 */}
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

          {/* 포인트 충전 안내 배너 */}
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
                <div className="text-[11px] text-amber-700">쿠팡 & 토스쇼핑에서 쇼핑하고 포인트 채우기</div>
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
        /* [⚡ 포인트 충전함 탭] - 쿠팡 & 토스쇼핑 2개 구좌 */
        <div className="px-4 pt-3 space-y-3.5">
          {/* 상단 안내 메시지 */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-[14px] font-extrabold text-gray-900">쇼핑하고 포인트 충전하기</h3>
            </div>
            <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
              제휴 쇼핑몰을 통해 원하는 상품을 쇼핑하시면 신상픽 리워드 포인트가 적립됩니다.
            </p>
          </div>

          {/* 파트너 카드 목록 (쿠팡, 토스쇼핑) */}
          <div className="space-y-3">
            {partnerShops.map((partner) => (
              <div
                key={partner.id}
                onClick={() => setSelectedPartner(partner)}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs hover:border-amber-200 hover:shadow-md transition-all cursor-pointer flex flex-col gap-3 group active:scale-99"
              >
                {/* 상단 헤더: 로고 + 타이틀 + 배지 */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {partner.logo}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-[15px] font-black text-gray-900 group-hover:text-amber-600 transition-colors">
                          {partner.name}
                        </h4>
                      </div>
                      <span className={`inline-block mt-0.5 text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${partner.badgeBg} ${partner.badgeText}`}>
                        {partner.badge}
                      </span>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-amber-50 group-hover:text-amber-600 flex items-center justify-center text-gray-400 transition-colors shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* 설명 및 혜택 요약 */}
                <p className="text-[12px] text-gray-600 leading-relaxed">
                  {partner.summary}
                </p>

                {/* 하단 적립 태그 바 */}
                <div className="pt-2.5 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{partner.benefitTag}</span>
                  </span>
                  <span className="text-[11px] font-bold text-gray-500 group-hover:text-gray-900 flex items-center gap-0.5">
                    안내 및 바로가기 <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 안전 적립 안내 */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3.5 text-[11px] text-slate-600 space-y-1 mt-2">
            <div className="font-bold flex items-center gap-1 text-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>포인트 적립 유의사항</span>
            </div>
            <p>• 각 제휴 쇼핑 카드를 터치하여 상세 이용 가이드를 확인하신 후 쇼핑을 진행해 주세요.</p>
            <p>• 신상픽 연결 링크를 통해 접속하셔야 구매 실적이 정상 집계됩니다.</p>
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

              {/* 포인트 부족 시 충전함 유도 */}
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

      {/* 5. 제휴 서비스 상세 안내 & 외부 링크 연결 모달 (쿠팡 / 토스쇼핑) */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          <div 
            className="w-full max-w-[430px] bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                {selectedPartner.logo}
                <div>
                  <h3 className="text-[16px] font-black text-gray-900">{selectedPartner.name}</h3>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.2 rounded-full border ${selectedPartner.badgeBg} ${selectedPartner.badgeText}`}>
                    {selectedPartner.badge}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedPartner(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 space-y-5">
              {/* Hero Title */}
              <div>
                <h4 className="text-[17px] font-black text-gray-900 leading-snug">
                  {selectedPartner.modal.title}
                </h4>
                <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
                  {selectedPartner.modal.subTitle}
                </p>
                <div className="mt-3 bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 text-[12px] text-amber-900 leading-relaxed font-medium">
                  {selectedPartner.modal.description}
                </div>
              </div>

              {/* Steps Guide */}
              <div>
                <h5 className="text-[13px] font-extrabold text-gray-900 mb-2.5 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                  <span>적립 진행 방법</span>
                </h5>
                <div className="space-y-2">
                  {selectedPartner.modal.steps.map((st, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-3 flex gap-3 items-start border border-gray-100">
                      <span className="w-6 h-6 rounded-lg bg-gray-900 text-white text-[11px] font-black flex items-center justify-center shrink-0">
                        {st.step}
                      </span>
                      <div>
                        <div className="text-[13px] font-bold text-gray-900">{st.title}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{st.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h5 className="text-[13px] font-extrabold text-gray-900 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>주요 쇼핑 혜택</span>
                </h5>
                <ul className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1.5 text-[11px] text-slate-700">
                  {selectedPartner.modal.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cautions */}
              <div>
                <h5 className="text-[12px] font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                  <span>이용 시 꼭 확인해주세요</span>
                </h5>
                <ul className="space-y-1 text-[11px] text-gray-400 list-disc list-inside">
                  {selectedPartner.modal.cautions.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>

              {/* External Link Action Button */}
              <div className="pt-2 sticky bottom-0 bg-white pb-1">
                <button
                  onClick={() => openExternalLink(selectedPartner.externalUrl)}
                  className={`w-full py-3.5 text-white font-extrabold text-[15px] rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all ${selectedPartner.modal.buttonBg}`}
                >
                  <span>{selectedPartner.modal.buttonText}</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. 바코드 상세 모달 (구매 완료 즉시 또는 내 쿠폰 터치 시 오픈) */}
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

      {/* 7. 최근 구매한 e쿠폰 목록 팝업 */}
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
