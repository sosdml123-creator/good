import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, 
  Share2, 
  MoreVertical, 
  Star, 
  PenSquare, 
  Scale, 
  Bell, 
  CheckCircle2, 
  Award, 
  MapPin,
  Store,
  ExternalLink,
  Info,
  ShieldCheck,
  Sparkles,
  Flame,
  Layers,
  AlertTriangle,
  Check
} from 'lucide-react';
import { StoreStockItem } from '../../types';
import { ReviewList } from './ReviewList';
import { NearbyStoreStockModal } from './NearbyStoreStockModal';
import { ProductStockAlertModal } from './ProductStockAlertModal';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    goBack,
    toggleCompare,
    setActiveTab,
    showToast,
    bookmarkedIds,
    toggleBookmark,
    comparedIds
  } = useApp();

  const [detailTab, setDetailTab] = useState<'reviews' | 'info' | 'stores'>('reviews');
  const [showAllQuotes, setShowAllQuotes] = useState(false);
  const [isNearbyModalOpen, setIsNearbyModalOpen] = useState(false);
  const [isStockAlertModalOpen, setIsStockAlertModalOpen] = useState(false);

  if (!selectedProduct) return null;

  const isBookmarked = bookmarkedIds.includes(selectedProduct.id);
  const isCompared = comparedIds.includes(selectedProduct.id);

  const metrics = selectedProduct.freshMetrics
    ? [
        { label: '당도 (Brix)', val: selectedProduct.freshMetrics.sweetness },
        { label: '신선도', val: selectedProduct.freshMetrics.freshness },
        { label: '식감', val: selectedProduct.freshMetrics.texture },
        { label: '가격 만족도', val: selectedProduct.freshMetrics.value },
      ]
    : [
        { label: '맛', val: selectedProduct.detailedRating?.taste || 5 },
        { label: '가성비', val: selectedProduct.detailedRating?.value || 5 },
        { label: '양', val: selectedProduct.detailedRating?.portion || 4.5 },
        { label: '재구매 의사', val: selectedProduct.detailedRating?.repurchase || 4.8 },
      ];

  // Default stores if none specified
  const storeList = selectedProduct.stores && selectedProduct.stores.length > 0
    ? selectedProduct.stores
    : selectedProduct.itemType === 'fresh'
      ? ['마켓컬리', '쿠팡프레시', '대형마트']
      : ['CU', 'GS25', '세븐일레븐', '대형마트'];

  const getStoreBadge = (storeName: string) => {
    switch (storeName) {
      case 'CU':
        return { text: '1+1 행사중', color: 'bg-purple-50 text-purple-600 border-purple-200' };
      case 'GS25':
        return { text: '재고여유', color: 'bg-blue-50 text-blue-600 border-blue-200' };
      case '세븐일레븐':
        return { text: '입고완료', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
      case '이마트24':
        return { text: '2+1 행사중', color: 'bg-amber-50 text-amber-600 border-amber-200' };
      case '마켓컬리':
        return { text: '샛별배송 🚀', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case '쿠팡프레시':
        return { text: '새벽도착 🚀', color: 'bg-sky-50 text-sky-700 border-sky-200' };
      default:
        return { text: '판매중', color: 'bg-gray-50 text-gray-700 border-gray-200' };
    }
  };

  const getStoreIcon = (storeName: string) => {
    if (['CU', 'GS25', '세븐일레븐', '이마트24'].includes(storeName)) return '🏪';
    if (['마켓컬리', '쿠팡프레시'].includes(storeName)) return '📦';
    if (['대형마트', '이마트', '홈플러스', '롯데마트'].includes(storeName)) return '🛒';
    return '🏬';
  };

  const quotes = selectedProduct.bestQuotes && selectedProduct.bestQuotes.length > 0
    ? selectedProduct.bestQuotes
    : ['진짜 맛있어요! 강력 추천합니다 👍', '품질이 기대 이상이라 만족스러워요', '재구매 의사 100% 입니다!'];

  const displayedQuotes = showAllQuotes ? quotes : quotes.slice(0, 3);

  return (
    <div className="bg-[#F5F5F5] min-h-full pb-16">
      
      {/* 1. Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-2.5 shadow-2xs">
        <button
          onClick={goBack}
          className="p-1 -ml-1 text-gray-700 hover:text-gray-900"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        <span className="text-sm font-bold text-gray-800 truncate max-w-[200px]">
          {selectedProduct.subCategory ? `${selectedProduct.subCategory} 탐색` : selectedProduct.name}
        </span>

        <div className="flex items-center gap-2 text-gray-700">
          <button 
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
              }
              showToast('🔗 품목 링크가 복사되었습니다!');
            }}
            className="p-1 hover:text-[#0066FF] transition-colors"
            title="공유하기"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => showToast('품목 알림 및 공유 옵션을 확인하세요.')}
            className="p-1 hover:text-gray-900"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Product image */}
      <div className="bg-white py-6 flex justify-center border-b border-gray-50 relative">
        <img
          src={selectedProduct.image}
          alt={selectedProduct.name}
          className="w-64 h-64 object-cover rounded-2xl shadow-xs"
        />
        {selectedProduct.subCategory && (
          <span className="absolute top-4 left-4 bg-black/70 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
            {selectedProduct.category} · {selectedProduct.subCategory}
          </span>
        )}
        {selectedProduct.isHot && (
          <span className="absolute top-4 right-4 bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
            <Flame className="w-3 h-3" /> 인기 급상승
          </span>
        )}
      </div>

      {/* 3. Info Header Card */}
      <div className="bg-white px-4 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-[12px] text-gray-400 mb-1">{selectedProduct.brand}</div>
          <button
            onClick={(e) => toggleBookmark(selectedProduct.id, e)}
            className={`text-xs font-semibold flex items-center gap-1 border px-2.5 py-1 rounded-full transition-all ${
              isBookmarked 
                ? 'border-rose-200 bg-rose-50 text-rose-600' 
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            <span className={isBookmarked ? 'text-rose-500 font-black' : 'text-gray-400'}>
              {isBookmarked ? '♥' : '♡'}
            </span>
            <span>{isBookmarked ? '찜완료' : '찜하기'}</span>
          </button>
        </div>

        <div className="text-[18px] font-bold text-gray-900 leading-snug">{selectedProduct.name}</div>
        
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-0.5">
            <Star className="w-4 h-4 fill-[#FFC107] text-[#FFC107]" />
          </div>
          <span className="text-[15px] font-bold text-gray-800">{selectedProduct.overallRating.toFixed(1)}</span>
          <span className="text-[12px] text-gray-400">({selectedProduct.ratingCount}명 평가)</span>
          {selectedProduct.repurchasePercent && (
            <span className="text-[11px] text-[#0066FF] font-bold bg-blue-50 px-2 py-0.5 rounded-md ml-auto">
              재구매율 {selectedProduct.repurchasePercent}%
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2">
          {selectedProduct.discountRate && selectedProduct.discountRate > 0 && (
            <span className="text-[16px] font-black text-red-500">{selectedProduct.discountRate}%</span>
          )}
          <span className="text-[20px] font-black text-gray-900">
            {selectedProduct.itemType === 'restaurant' ? '평균 ' : ''}{selectedProduct.price.toLocaleString()}원
          </span>
          {selectedProduct.volume && (
            <span className="text-xs text-gray-400">/ {selectedProduct.volume}</span>
          )}
        </div>

        {selectedProduct.description && (
          <p className="text-xs text-gray-600 mt-2.5 bg-gray-50 p-3 rounded-xl leading-relaxed border border-gray-100">
            {selectedProduct.description}
          </p>
        )}
      </div>

      {/* 4. Top 3 Action Buttons */}
      <div className="bg-white px-4 py-3 mt-2 border-b border-gray-100 grid grid-cols-3 gap-2">
        <button
          onClick={() => setActiveTab('write')}
          className="py-3 rounded-xl border border-gray-200 text-[12px] font-bold text-gray-700 flex flex-col items-center gap-1 hover:border-[#0066FF] hover:bg-blue-50/30 transition-all active:scale-98"
        >
          <PenSquare className="w-4 h-4 text-[#0066FF]" />
          <span>평가 및 리뷰</span>
        </button>
        <button
          onClick={(e) => toggleCompare(selectedProduct.id, e)}
          className={`py-3 rounded-xl border text-[12px] font-bold flex flex-col items-center gap-1 transition-all active:scale-98 ${
            isCompared
              ? 'border-[#0066FF] bg-blue-50 text-[#0066FF]'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Scale className={`w-4 h-4 ${isCompared ? 'text-[#0066FF]' : 'text-gray-600'}`} />
          <span>{isCompared ? '비교함 담김' : '비교함 담기'}</span>
        </button>
        <button
          onClick={() => setActiveTab('alert_settings')}
          className="py-3 rounded-xl border border-gray-200 text-[12px] font-bold text-gray-700 flex flex-col items-center gap-1 hover:border-[#0066FF] hover:bg-blue-50/30 transition-all active:scale-98"
        >
          <Bell className="w-4 h-4 text-amber-500" />
          <span>제철/출시 알림</span>
        </button>
      </div>

      {/* 5. Sticky Navigation Tabs (소비자 리뷰 / 품목 정보 / 판매처) */}
      <div className="bg-white mt-2 sticky top-[48px] z-20 border-b border-gray-100 shadow-2xs">
        <div className="flex">
          <button 
            onClick={() => setDetailTab('reviews')}
            className={`flex-1 py-3 text-[13px] font-bold transition-all relative ${
              detailTab === 'reviews' 
                ? 'text-[#0066FF]' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            소비자 리뷰 ({selectedProduct.ratingCount})
            {detailTab === 'reviews' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0066FF]" />
            )}
          </button>
          
          <button 
            onClick={() => setDetailTab('info')}
            className={`flex-1 py-3 text-[13px] font-bold transition-all relative ${
              detailTab === 'info' 
                ? 'text-[#0066FF]' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            품목 정보
            {detailTab === 'info' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0066FF]" />
            )}
          </button>

          <button 
            onClick={() => setDetailTab('stores')}
            className={`flex-1 py-3 text-[13px] font-bold transition-all relative ${
              detailTab === 'stores' 
                ? 'text-[#0066FF]' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {selectedProduct.itemType === 'restaurant' ? '맛집 위치' : '판매처'}
            {detailTab === 'stores' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0066FF]" />
            )}
          </button>
        </div>
      </div>

      {/* 6. TAB CONTENT 1: 소비자 리뷰 (Reviews) */}
      {detailTab === 'reviews' && (
        <div className="space-y-2 animate-in fade-in duration-200">
          
          {/* Score breakdown */}
          <div className="bg-white px-4 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] font-bold text-gray-900">
                {selectedProduct.freshMetrics ? '🍎 신선식품 품질 평가 지표' : '세부 평점 지표'}
              </span>
              {selectedProduct.freshMetrics && (
                <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                  소비자 실측 기준
                </span>
              )}
            </div>

            <div className="space-y-3">
              {metrics.map((m) => (
                <div key={m.label} className="flex items-center gap-3">
                  <span className="w-24 text-[12px] text-gray-600 font-medium shrink-0">{m.label}</span>
                  <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${selectedProduct.freshMetrics ? 'bg-emerald-500' : 'bg-[#0066FF]'}`} 
                      style={{ width: `${(m.val / 5) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[12px] font-bold text-gray-700">{m.val.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 한줄평 BEST */}
          <div className="bg-white px-4 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-[14px] font-bold text-gray-900">한줄평 BEST</span>
              </div>
              {quotes.length > 2 && (
                <button 
                  onClick={() => setShowAllQuotes(!showAllQuotes)}
                  className="text-[12px] text-[#0066FF] font-semibold hover:underline"
                >
                  {showAllQuotes ? '접기' : '더보기'}
                </button>
              )}
            </div>
            <div className="space-y-2">
              {displayedQuotes.map((q, idx) => (
                <div key={idx} className="flex items-start gap-2 py-1.5 bg-gray-50/70 px-3 rounded-xl border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
                  <span className="text-[13px] text-gray-700 font-medium">{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Write Review Banner Button */}
          <div className="bg-white px-4 py-3 border-b border-gray-100">
            <div 
              onClick={() => setActiveTab('write')}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-between cursor-pointer hover:border-[#0066FF] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0066FF] text-white flex items-center justify-center font-bold">
                  <PenSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">이 먹거리 직접 맛보셨나요?</div>
                  <div className="text-[11px] text-[#0066FF] font-semibold mt-0.5">솔직한 후기 남기고 +50P 적립받기</div>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-[#0066FF] text-white text-xs font-bold rounded-full shadow-xs">
                쓰기
              </button>
            </div>
          </div>

          {/* Full Review List with sorting and comments */}
          <div className="bg-white px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] font-bold text-gray-900">전체 리뷰 목록</span>
              <span className="text-[12px] text-gray-400">총 {selectedProduct.ratingCount}개</span>
            </div>
            <ReviewList productId={selectedProduct.id} />
          </div>

        </div>
      )}

      {/* 7. TAB CONTENT 2: 품목 정보 (Product Info) */}
      {detailTab === 'info' && (
        <div className="space-y-2 animate-in fade-in duration-200">
          
          {/* 1. Detailed Product Specs Table */}
          <div className="bg-white px-4 py-4 border-b border-gray-100">
            <div className="flex items-center gap-1.5 mb-3">
              <Info className="w-4 h-4 text-[#0066FF]" />
              <span className="text-[14px] font-bold text-gray-900">품목 기본 정보</span>
            </div>

            <div className="rounded-xl border border-gray-100 divide-y divide-gray-100 text-xs overflow-hidden">
              <div className="flex py-2.5 px-3 bg-gray-50/60">
                <span className="w-24 text-gray-500 font-semibold shrink-0">품목 / 분류</span>
                <span className="text-gray-900 font-bold">{selectedProduct.category} {selectedProduct.subCategory ? `> ${selectedProduct.subCategory}` : ''}</span>
              </div>
              <div className="flex py-2.5 px-3">
                <span className="w-24 text-gray-500 font-semibold shrink-0">브랜드 / 생산자</span>
                <span className="text-gray-900 font-bold">{selectedProduct.brand}</span>
              </div>
              <div className="flex py-2.5 px-3 bg-gray-50/60">
                <span className="w-24 text-gray-500 font-semibold shrink-0">원산지 / 생산지</span>
                <span className="text-gray-900 font-medium">{selectedProduct.origin || (selectedProduct.itemType === 'fresh' ? '국내산 산지직송' : '대한민국')}</span>
              </div>
              <div className="flex py-2.5 px-3">
                <span className="w-24 text-gray-500 font-semibold shrink-0">제조원 / 유통원</span>
                <span className="text-gray-900">{selectedProduct.manufacturer || `${selectedProduct.brand} 공식 파트너`}</span>
              </div>
              <div className="flex py-2.5 px-3 bg-gray-50/60">
                <span className="w-24 text-gray-500 font-semibold shrink-0">출시 / 제철</span>
                <span className="text-gray-900">{selectedProduct.releaseDate || '상시 판매'}</span>
              </div>
              <div className="flex py-2.5 px-3">
                <span className="w-24 text-gray-500 font-semibold shrink-0">규격 / 내용량</span>
                <span className="text-gray-900">{selectedProduct.volume || '상세 규격 참조'}</span>
              </div>
              <div className="flex py-2.5 px-3 bg-gray-50/60">
                <span className="w-24 text-gray-500 font-semibold shrink-0">총 열량(칼로리)</span>
                <span className="text-gray-900 font-bold text-[#0066FF]">
                  {selectedProduct.calories ? `${selectedProduct.calories} kcal` : (selectedProduct.itemType === 'fresh' ? '신선 자연식품' : '상세 표기 참조')}
                </span>
              </div>
              <div className="flex py-2.5 px-3">
                <span className="w-24 text-gray-500 font-semibold shrink-0">보관 방법</span>
                <span className="text-gray-900">
                  {selectedProduct.storageMethod || (
                    selectedProduct.category === '과일' || selectedProduct.category === '고기·수산' 
                      ? '0~5℃ 신선 냉장보관 권장' 
                      : selectedProduct.category === '간편식' 
                        ? '-18℃ 이하 냉동보관 또는 냉장' 
                        : '직사광선을 피해 서늘하고 건조한 실온보관'
                  )}
                </span>
              </div>
              <div className="flex py-2.5 px-3 bg-gray-50/60">
                <span className="w-24 text-gray-500 font-semibold shrink-0">소비 / 유통기한</span>
                <span className="text-gray-900">{selectedProduct.shelfLife || '제품 후면 별도 표기일까지'}</span>
              </div>
              <div className="flex py-2.5 px-3">
                <span className="w-24 text-gray-500 font-semibold shrink-0">소비자 재구매율</span>
                <span className="text-[#0066FF] font-black">{selectedProduct.repurchasePercent || 95}% 추천</span>
              </div>
            </div>
          </div>

          {/* 2. Nutrition Facts or Fresh Metrics */}
          <div className="bg-white px-4 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#0066FF]" />
                <span className="text-[14px] font-bold text-gray-900">
                  {selectedProduct.freshMetrics ? '신선 먹거리 품질 지표' : '영양 성분 분석표 (식약처 기준)'}
                </span>
              </div>
              {!selectedProduct.freshMetrics && (
                <span className="text-[10px] text-gray-400">1일 영양성분 기준치 비율(%)</span>
              )}
            </div>

            {selectedProduct.freshMetrics ? (
              <div className="grid grid-cols-2 gap-2.5 text-center">
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <div className="text-[11px] text-emerald-700 font-bold">당도 (Brix)</div>
                  <div className="text-base font-black text-emerald-800 mt-0.5">{selectedProduct.freshMetrics.sweetness} / 5.0</div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">비파괴 고당도 선별</div>
                </div>
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                  <div className="text-[11px] text-blue-700 font-bold">신선도 등급</div>
                  <div className="text-base font-black text-blue-800 mt-0.5">{selectedProduct.freshMetrics.freshness} / 5.0</div>
                  <div className="text-[10px] text-blue-600 mt-0.5">산지직송 콜드체인</div>
                </div>
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
                  <div className="text-[11px] text-amber-700 font-bold">식감 만족도</div>
                  <div className="text-base font-black text-amber-800 mt-0.5">{selectedProduct.freshMetrics.texture} / 5.0</div>
                  <div className="text-[10px] text-amber-600 mt-0.5">탱글하고 아삭한 식감</div>
                </div>
                <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100">
                  <div className="text-[11px] text-purple-700 font-bold">가격 가성비</div>
                  <div className="text-base font-black text-purple-800 mt-0.5">{selectedProduct.freshMetrics.value} / 5.0</div>
                  <div className="text-[10px] text-purple-600 mt-0.5">소비자 체감 평점</div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-100 divide-y divide-gray-100 text-xs overflow-hidden">
                <div className="flex justify-between items-center py-2.5 px-3 bg-gray-50/70 font-bold">
                  <span className="text-gray-700">열량 (칼로리)</span>
                  <span className="text-gray-900">{selectedProduct.calories ? `${selectedProduct.calories} kcal` : '상세 표기 참조'}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3">
                  <span className="text-gray-600">나트륨</span>
                  <span className="font-semibold text-gray-900">{selectedProduct.nutrition?.sodium || '표기 기준 준수'}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50/40">
                  <span className="text-gray-600">탄수화물 / 당류</span>
                  <span className="font-semibold text-gray-900">
                    {selectedProduct.nutrition?.carbs || '균형 함유'} {selectedProduct.nutrition?.sugar ? `(당류 ${selectedProduct.nutrition.sugar})` : ''}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 px-3">
                  <span className="text-gray-600">지방 / 트랜스지방</span>
                  <span className="font-semibold text-gray-900">
                    {selectedProduct.nutrition?.fat || '균형 함유'} {selectedProduct.nutrition?.transFat ? `(트랜스 ${selectedProduct.nutrition.transFat})` : ''}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50/40">
                  <span className="text-gray-600">포화지방 / 콜레스테롤</span>
                  <span className="font-semibold text-gray-900">
                    {selectedProduct.nutrition?.satFat ? `포화 ${selectedProduct.nutrition.satFat}` : '0g'} {selectedProduct.nutrition?.cholesterol ? `· 콜레스테롤 ${selectedProduct.nutrition.cholesterol}` : ''}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 px-3">
                  <span className="text-gray-600">단백질</span>
                  <span className="font-bold text-[#0066FF]">{selectedProduct.nutrition?.protein || '균형 함유'}</span>
                </div>
              </div>
            )}

            <p className="text-[10px] text-gray-400 mt-2">
              * 1일 영양성분 기준치(2,000 kcal)에 대한 비율(%)이며, 개인의 필요 열량에 따라 다를 수 있습니다.
            </p>
          </div>

          {/* 3. Ingredients & Allergen Warning */}
          <div className="bg-white px-4 py-4 border-b border-gray-100 space-y-3">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-[14px] font-bold text-gray-900">원재료명 및 알레르기 유발물질</span>
            </div>

            {/* Allergen Badges */}
            <div>
              <span className="text-[11px] font-bold text-gray-600 block mb-1.5">알레르기 유발 물질 안내</span>
              {selectedProduct.allergens && selectedProduct.allergens.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.allergens.map((alg) => (
                    <span 
                      key={alg} 
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1"
                    >
                      <span>⚠️</span>
                      <span>{alg} 함유</span>
                    </span>
                  ))}
                </div>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Check className="w-3.5 h-3.5" />
                  주요 알레르기 유발물질 없음 (순수 원물)
                </span>
              )}
            </div>

            {/* Ingredients full text */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
              <span className="font-bold text-gray-700 block mb-1">원재료명 및 함량</span>
              <p className="text-gray-600 leading-relaxed">
                {selectedProduct.ingredients || `${selectedProduct.name} 고유 성분 및 원재료 (제품 후면 표기 참조)`}
              </p>
            </div>

            {selectedProduct.precautions && (
              <div className="p-2.5 bg-rose-50/50 rounded-xl border border-rose-100 text-[11px] text-rose-800">
                <span className="font-bold">섭취 시 주의사항: </span>
                <span>{selectedProduct.precautions}</span>
              </div>
            )}
          </div>

          {/* 4. Certification / Safety Standards */}
          <div className="bg-white px-4 py-4 border-b border-gray-100">
            <div className="flex items-center gap-1.5 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-[14px] font-bold text-gray-900">안심 인증 및 검증</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50">
                <span className="text-lg block">🏅</span>
                <span className="font-bold text-gray-800 block mt-1">HACCP 인증</span>
                <span className="text-[10px] text-gray-400">위생안전 검증</span>
              </div>
              <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50">
                <span className="text-lg block">🌱</span>
                <span className="font-bold text-gray-800 block mt-1">품질보증</span>
                <span className="text-[10px] text-gray-400">엄선된 원재료</span>
              </div>
              <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50">
                <span className="text-lg block">❄️</span>
                <span className="font-bold text-gray-800 block mt-1">콜드체인</span>
                <span className="text-[10px] text-gray-400">신선온도 유지</span>
              </div>
            </div>
          </div>

          {/* 5. Brand Rankings (if available) */}
          {selectedProduct.brandRankings && selectedProduct.brandRankings.length > 0 && (
            <div className="bg-white px-4 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="text-[14px] font-bold text-gray-900">
                    {selectedProduct.subCategory} 브랜드·산지별 랭킹 비교
                  </span>
                </div>
                <span className="text-[11px] text-gray-400">평점 순</span>
              </div>

              <div className="space-y-2">
                {selectedProduct.brandRankings.map((br) => (
                  <div key={br.name} className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center ${
                        br.rank === 1 ? 'bg-amber-500 text-white' : br.rank === 2 ? 'bg-gray-400 text-white' : 'bg-orange-300 text-white'
                      }`}>
                        {br.rank}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-gray-900">{br.name}</span>
                        <span className="text-[10px] text-gray-400 block">{br.brand}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {br.tag && (
                        <span className="text-[10px] font-bold text-[#0066FF] bg-blue-50 px-1.5 py-0.5 rounded">
                          {br.tag}
                        </span>
                      )}
                      <div className="flex items-center gap-0.5 text-xs font-bold text-gray-800">
                        <Star className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
                        <span>{br.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* 8. TAB CONTENT 3: 판매처 & 맛집 위치 (Stores & Places) */}
      {detailTab === 'stores' && (
        <div className="space-y-2 animate-in fade-in duration-200">
          
          {selectedProduct.itemType === 'restaurant' || selectedProduct.restaurantInfo ? (
            /* Restaurant Location & Ranking View */
            <div className="bg-white px-4 py-4 border-b border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#0066FF]" />
                  <span className="text-[14px] font-bold text-gray-900">전국 대표 맛집 위치 및 랭킹</span>
                </div>
                <span className="text-[11px] text-[#0066FF] font-bold">인기순</span>
              </div>

              {selectedProduct.restaurantInfo?.popularVariations && (
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                  {selectedProduct.restaurantInfo.popularVariations.map((v) => (
                    <span key={v} className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-[#0066FF]">
                      #{v}
                    </span>
                  ))}
                </div>
              )}

              {selectedProduct.restaurantInfo?.regionRankings && (
                <div className="space-y-2.5">
                  {selectedProduct.restaurantInfo.regionRankings.map((rr) => (
                    <div key={rr.restaurantName} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/60 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-white bg-[#0066FF] px-1.5 py-0.2 rounded">
                            {rr.region}
                          </span>
                          <span className="text-xs font-bold text-gray-900">{rr.restaurantName}</span>
                        </div>
                        <span className="text-[11px] text-gray-500 mt-1 block">대표: {rr.signatureMenu} ({rr.priceRange})</span>
                        <button
                          onClick={() => {
                            const url = `https://map.naver.com/v5/search/${encodeURIComponent(rr.restaurantName + ' ' + (rr.region || ''))}`;
                            window.open(url, '_blank');
                          }}
                          className="mt-2 text-[11px] font-bold text-[#0066FF] flex items-center gap-1 hover:underline"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>네이버 지도 길찾기</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-0.5 text-xs font-bold text-gray-900 justify-end">
                          <Star className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
                          <span>{rr.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-[10px] text-gray-400">리뷰 {rr.reviewCount}개</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Retailers / Convenience Stores / Online Marts */
            <div className="space-y-2">
              
              {/* Stores List Card with Real Stock Data */}
              <div className="bg-white px-4 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-[#0066FF]" />
                    <span className="text-[14px] font-bold text-gray-900">판매처별 실시간 입고 & 재고 현황</span>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">실시간 연동</span>
                </div>

                <div className="space-y-2.5">
                  {(selectedProduct.storeStocks && selectedProduct.storeStocks.length > 0 ? selectedProduct.storeStocks : storeList.map((st): StoreStockItem => ({
                    store: st,
                    status: '입고완료',
                    stockCount: 6,
                    price: selectedProduct.price,
                    discountPrice: selectedProduct.price,
                    eventBadge: getStoreBadge(st).text,
                    deliveryTime: '매장 즉시 픽업'
                  }))).map((stItem) => {
                    const icon = getStoreIcon(stItem.store);
                    const defaultBadge = getStoreBadge(stItem.store);

                    return (
                      <div 
                        key={stItem.store}
                        className="p-3.5 rounded-2xl border border-gray-100 bg-white hover:border-blue-200 transition-all flex items-center justify-between shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-2xl shrink-0 border border-gray-100">
                            {icon}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-gray-900">{stItem.store}</span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                                stItem.eventBadge ? 'bg-purple-50 text-purple-700 border-purple-200' : defaultBadge.color
                              }`}>
                                {stItem.eventBadge || defaultBadge.text}
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                stItem.stockCount > 2 
                                  ? 'bg-emerald-50 text-emerald-700' 
                                  : stItem.stockCount > 0 
                                    ? 'bg-amber-50 text-amber-700' 
                                    : 'bg-gray-100 text-gray-500'
                              }`}>
                                {stItem.stockCount > 0 ? `재고 ${stItem.stockCount}개` : '일시품절'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-black text-gray-900">
                                {(stItem.discountPrice || stItem.price || selectedProduct.price).toLocaleString()}원
                              </span>
                              {stItem.deliveryTime && (
                                <span className="text-[11px] text-gray-400">· {stItem.deliveryTime}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (stItem.appLink) {
                              window.open(stItem.appLink, '_blank');
                            } else {
                              setIsNearbyModalOpen(true);
                            }
                          }}
                          className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-[#0066FF] hover:bg-[#0066FF] hover:text-white transition-colors flex items-center gap-1 shrink-0 ml-2 shadow-2xs"
                        >
                          <span>구매 / 확인</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Nearby Store Finder Banner (Now Opens NearbyStoreStockModal!) */}
              <div className="bg-white px-4 py-4 border-b border-gray-100">
                <div 
                  onClick={() => setIsNearbyModalOpen(true)}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between cursor-pointer hover:border-emerald-400 hover:shadow-xs transition-all active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-sm">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        <span>내 주변 매장 실시간 재고 찾기</span>
                        <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-black">클릭</span>
                      </div>
                      <div className="text-[11px] text-emerald-700 mt-0.5">반경 1km 편의점/마트 재고와 거리를 바로 확인해보세요</div>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsNearbyModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full shadow-xs shrink-0"
                  >
                    찾기
                  </button>
                </div>
              </div>

              {/* Stock Alert Subscription (Now Opens ProductStockAlertModal!) */}
              <div className="bg-white px-4 py-4">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-800 block">원하는 매장에 아직 재고가 없나요?</span>
                    <span className="text-[11px] text-gray-400">입고 즉시 푸시 알림과 알림톡을 보내드립니다.</span>
                  </div>
                  <button
                    onClick={() => setIsStockAlertModalOpen(true)}
                    className="px-3 py-1.5 rounded-full border border-[#0066FF] text-[#0066FF] font-bold text-xs hover:bg-blue-50 transition-colors shrink-0 ml-2"
                  >
                    입고 알림 설정
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* Modals for Nearby Store Stock & Stock Alert */}
      <NearbyStoreStockModal
        product={selectedProduct}
        isOpen={isNearbyModalOpen}
        onClose={() => setIsNearbyModalOpen(false)}
      />

      <ProductStockAlertModal
        product={selectedProduct}
        isOpen={isStockAlertModalOpen}
        onClose={() => setIsStockAlertModalOpen(false)}
      />

    </div>
  );
};


