import React from 'react';
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
  MapPin
} from 'lucide-react';
import { ReviewList } from './ReviewList';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    goBack,
    toggleCompare,
    setActiveTab,
    showToast,
    bookmarkedIds,
    toggleBookmark
  } = useApp();

  if (!selectedProduct) return null;

  const isBookmarked = bookmarkedIds.includes(selectedProduct.id);

  const metrics = selectedProduct.freshMetrics
    ? [
        { label: '당도 (Brix)', val: selectedProduct.freshMetrics.sweetness },
        { label: '신선도', val: selectedProduct.freshMetrics.freshness },
        { label: '식감', val: selectedProduct.freshMetrics.texture },
        { label: '가격 만족도', val: selectedProduct.freshMetrics.value },
      ]
    : [
        { label: '맛', val: selectedProduct.detailedRating.taste },
        { label: '가성비', val: selectedProduct.detailedRating.value },
        { label: '양', val: selectedProduct.detailedRating.portion },
        { label: '재구매 의사', val: selectedProduct.detailedRating.repurchase },
      ];

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-28">
      
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
            onClick={() => showToast('🔗 품목 링크가 복사되었습니다!')}
            className="p-1 hover:text-gray-900"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-1 hover:text-gray-900">
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
      </div>

      {/* 3. Info */}
      <div className="bg-white px-4 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-[12px] text-gray-400 mb-1">{selectedProduct.brand}</div>
          <button
            onClick={(e) => toggleBookmark(selectedProduct.id, e)}
            className="text-xs font-semibold text-gray-500 flex items-center gap-1 border border-gray-200 px-2.5 py-1 rounded-full"
          >
            <span className={isBookmarked ? 'text-rose-500' : 'text-gray-400'}>
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
        </div>

        <div className="flex items-center gap-2 mt-2">
          {selectedProduct.discountRate && selectedProduct.discountRate > 0 && (
            <span className="text-[15px] font-bold text-red-500">{selectedProduct.discountRate}%</span>
          )}
          <span className="text-[20px] font-black text-gray-900">
            {selectedProduct.itemType === 'restaurant' ? '평균 ' : ''}{selectedProduct.price.toLocaleString()}원
          </span>
          {selectedProduct.volume && (
            <span className="text-xs text-gray-400">/ {selectedProduct.volume}</span>
          )}
        </div>

        {selectedProduct.description && (
          <p className="text-xs text-gray-600 mt-2.5 bg-gray-50 p-2.5 rounded-xl leading-relaxed">
            {selectedProduct.description}
          </p>
        )}
      </div>

      {/* 4. Score breakdown (당도/신선도 or 맛/가성비) */}
      <div className="bg-white px-4 py-4 mt-2 border-b border-gray-100">
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
                  className={`h-full rounded-full ${selectedProduct.freshMetrics ? 'bg-emerald-500' : 'bg-[#0066FF]'}`} 
                  style={{ width: `${(m.val / 5) * 100}%` }}
                />
              </div>
              <span className="w-8 text-right text-[12px] font-bold text-gray-700">{m.val.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. [품목별 브랜드 랭킹] (For Fresh Food) */}
      {selectedProduct.brandRankings && selectedProduct.brandRankings.length > 0 && (
        <div className="bg-white px-4 py-4 mt-2 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-[14px] font-bold text-gray-900">
                {selectedProduct.subCategory} 브랜드·산지별 랭킹 비교
              </span>
            </div>
            <span className="text-[11px] text-gray-400">평점 높은 순</span>
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

      {/* 6. [외식 메뉴 특화: 지역별 인기 맛집 랭킹 & 인기 메뉴 변형] */}
      {selectedProduct.restaurantInfo && (
        <div className="bg-white px-4 py-4 mt-2 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#0066FF]" />
              <span className="text-[14px] font-bold text-gray-900">전국 지역별 대표 맛집 랭킹</span>
            </div>
            <span className="text-[11px] text-[#0066FF] font-bold">인기순</span>
          </div>

          {selectedProduct.restaurantInfo.popularVariations && (
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-3">
              {selectedProduct.restaurantInfo.popularVariations.map((v) => (
                <span key={v} className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-[#0066FF]">
                  #{v}
                </span>
              ))}
            </div>
          )}

          {selectedProduct.restaurantInfo.regionRankings && (
            <div className="space-y-2">
              {selectedProduct.restaurantInfo.regionRankings.map((rr) => (
                <div key={rr.restaurantName} className="p-3 rounded-xl border border-gray-100 bg-gray-50/60 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-white bg-[#0066FF] px-1.5 py-0.2 rounded">
                        {rr.region}
                      </span>
                      <span className="text-xs font-bold text-gray-900">{rr.restaurantName}</span>
                    </div>
                    <span className="text-[11px] text-gray-500 mt-0.5 block">대표: {rr.signatureMenu} ({rr.priceRange})</span>
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
      )}

      {/* 7. 3 action buttons */}
      <div className="bg-white px-4 py-3 mt-2 border-b border-gray-100 grid grid-cols-3 gap-2">
        <button
          onClick={() => setActiveTab('write')}
          className="py-3 rounded-xl border border-gray-200 text-[12px] font-semibold text-gray-700 flex flex-col items-center gap-1 hover:bg-gray-50"
        >
          <PenSquare className="w-4 h-4" />
          <span>평가 및 리뷰</span>
        </button>
        <button
          onClick={(e) => toggleCompare(selectedProduct.id, e)}
          className="py-3 rounded-xl border border-gray-200 text-[12px] font-semibold text-gray-700 flex flex-col items-center gap-1 hover:bg-gray-50"
        >
          <Scale className="w-4 h-4" />
          <span>비교함 담기</span>
        </button>
        <button
          onClick={() => setActiveTab('alert_settings')}
          className="py-3 rounded-xl border border-gray-200 text-[12px] font-semibold text-gray-700 flex flex-col items-center gap-1 hover:bg-gray-50"
        >
          <Bell className="w-4 h-4" />
          <span>제철/출시 알림</span>
        </button>
      </div>

      {/* 8. Tabs */}
      <div className="bg-white mt-2 sticky top-[48px] z-20">
        <div className="flex border-b border-gray-100">
          <button className="flex-1 py-3 text-[13px] font-bold text-[#0066FF] border-b-2 border-[#0066FF]">
            소비자 리뷰 ({selectedProduct.ratingCount})
          </button>
          <button className="flex-1 py-3 text-[13px] font-semibold text-gray-500">
            품목 정보
          </button>
          <button className="flex-1 py-3 text-[13px] font-semibold text-gray-500">
            {selectedProduct.itemType === 'restaurant' ? '맛집 위치' : '판매처'}
          </button>
        </div>
      </div>

      {/* 9. 한줄평 BEST */}
      <div className="bg-white px-4 py-4 mt-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[14px] font-bold text-gray-900">한줄평 BEST</span>
          <button className="text-[12px] text-gray-400">더보기</button>
        </div>
        <div className="space-y-2">
          {(selectedProduct.bestQuotes || ['진짜 맛있어요! 강추합니다', '품질이 기대 이상이에요']).map((q) => (
            <div key={q} className="flex items-start gap-2 py-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
              <span className="text-[13px] text-gray-700">{q}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 10. Review list */}
      <div className="bg-white px-4 py-4 mt-2">
        <ReviewList productId={selectedProduct.id} />
      </div>

    </div>
  );
};
