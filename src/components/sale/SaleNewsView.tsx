import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  Search,
  Heart,
  Clock,
  X,
  Share2
} from 'lucide-react';
import { SaleStoreType, SalePromotionItem } from '../../types';
import { SafeImage } from '../common/SafeImage';

type FilterType = 'all' | '1+1' | '2+1' | 'discount' | 'saved';
type SortOption = 'popular' | 'discount' | 'urgent';

export const SaleNewsView: React.FC = () => {
  const {
    salePromotions,
    savedSaleIds,
    toggleSaveSale,
    openProductDetail,
    goBack,
    showToast
  } = useApp();

  const [dealTab, setDealTab] = useState<FilterType>('all');
  const [storeFilter, setStoreFilter] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('popular');

  const storeChips = ['전체', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'];

  // Filter & Sort promotions
  const filteredPromotions = useMemo(() => {
    let list = salePromotions.filter((item) => {
      // 1. Deal Tab Filter
      if (dealTab === 'saved') {
        if (!savedSaleIds.includes(item.id)) return false;
      } else if (dealTab === '1+1') {
        if (item.dealType !== '1+1') return false;
      } else if (dealTab === '2+1') {
        if (item.dealType !== '2+1') return false;
      } else if (dealTab === 'discount') {
        if (item.dealType !== '할인특가' && item.dealType !== '콤보할인') return false;
      }

      // 2. Store Filter
      if (storeFilter !== '전체') {
        if (storeFilter === '대형마트') {
          const isMart = item.store === '이마트' || item.store === '홈플러스' || (item.stores && item.stores.some(s => s === '이마트' || s === '홈플러스'));
          if (!isMart) return false;
        } else {
          const matchStore = item.store === storeFilter || (item.stores && item.stores.includes(storeFilter as SaleStoreType));
          if (!matchStore) return false;
        }
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchBrand = item.brand.toLowerCase().includes(query);
        const matchTag = item.benefitTag?.toLowerCase().includes(query) || false;
        if (!matchTitle && !matchBrand && !matchTag) return false;
      }

      return true;
    });

    // Sort
    return list.sort((a, b) => {
      if (sortOption === 'popular') {
        return (b.likeCount + (b.isHot ? 1000 : 0)) - (a.likeCount + (a.isHot ? 1000 : 0));
      } else if (sortOption === 'discount') {
        return (b.discountRate || 0) - (a.discountRate || 0);
      } else if (sortOption === 'urgent') {
        const aUrgent = a.dDay.includes('마감') || a.dDay.includes('D-') ? 1 : 0;
        const bUrgent = b.dDay.includes('마감') || b.dDay.includes('D-') ? 1 : 0;
        return bUrgent - aUrgent;
      }
      return 0;
    });
  }, [salePromotions, dealTab, storeFilter, searchQuery, sortOption, savedSaleIds]);

  const handleShare = (item: SalePromotionItem) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`[신상픽 행사소식] ${item.store} ${item.badgeText} 특가!\n${item.title} - ${item.unitPriceDescription}`);
      showToast('📋 행사 정보가 클립보드에 복사되었습니다!', 'success');
    } else {
      showToast('행사 정보 링크가 복사되었습니다.', 'info');
    }
  };

  const getStoreBadge = (storeName: string) => {
    switch (storeName) {
      case 'CU':
        return 'bg-purple-100 text-[#652D90] border-purple-200';
      case 'GS25':
        return 'bg-sky-100 text-[#007AC1] border-sky-200';
      case '세븐일레븐':
        return 'bg-emerald-100 text-[#008060] border-emerald-200';
      case '이마트24':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case '이마트':
      case '홈플러스':
      case '대형마트':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDealBadgeClass = (dealType: string) => {
    switch (dealType) {
      case '1+1':
        return 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-xs';
      case '2+1':
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs';
      case '할인특가':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs';
      case '콤보할인':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xs';
      default:
        return 'bg-gray-800 text-white';
    }
  };

  return (
    <div className="bg-[#F8F9FA] min-h-full pb-20 select-none">
      {/* 1. Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-2xs">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={goBack}
            className="p-1 -ml-1 text-gray-700 hover:text-gray-900 active:scale-95 transition-transform"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
          </button>

          <div className="flex items-center gap-1.5 font-black text-gray-900 text-base">
            <span className="text-xl">🏷️</span>
            <span>편의점·마트 행사소식</span>
            <span className="text-[10px] font-black bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full border border-rose-100">
              1+1 & 할인
            </span>
          </div>

          <div className="w-6" />
        </div>

        {/* Deal Category Tabs */}
        <div className="flex border-t border-gray-100 bg-white">
          <button
            onClick={() => setDealTab('all')}
            className={`flex-1 py-2.5 text-xs font-bold transition-all relative ${
              dealTab === 'all' ? 'text-rose-600' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            전체 ({salePromotions.length})
            {dealTab === 'all' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600" />}
          </button>
          <button
            onClick={() => setDealTab('1+1')}
            className={`flex-1 py-2.5 text-xs font-bold transition-all relative ${
              dealTab === '1+1' ? 'text-rose-600' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            🔥 1+1 특가
            {dealTab === '1+1' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600" />}
          </button>
          <button
            onClick={() => setDealTab('2+1')}
            className={`flex-1 py-2.5 text-xs font-bold transition-all relative ${
              dealTab === '2+1' ? 'text-rose-600' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            ✨ 2+1 혜택
            {dealTab === '2+1' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600" />}
          </button>
          <button
            onClick={() => setDealTab('discount')}
            className={`flex-1 py-2.5 text-xs font-bold transition-all relative ${
              dealTab === 'discount' ? 'text-rose-600' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            📉 할인특가
            {dealTab === 'discount' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600" />}
          </button>
          <button
            onClick={() => setDealTab('saved')}
            className={`flex-1 py-2.5 text-xs font-bold transition-all relative ${
              dealTab === 'saved' ? 'text-rose-600' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            ❤️ 찜 ({savedSaleIds.length})
            {dealTab === 'saved' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600" />}
          </button>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white px-4 py-2.5 border-b border-gray-100 flex flex-col gap-2">
        {/* Search input */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="행사 상품명, 브랜드 검색 (예: 코카콜라, 하겐다즈)"
            className="w-full pl-9 pr-8 py-2 bg-gray-100/90 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:bg-white border border-transparent focus:border-rose-300 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Store selector chips & Sort selector */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {storeChips.map((chip) => (
              <button
                key={chip}
                onClick={() => setStoreFilter(chip)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 transition-all ${
                  storeFilter === chip
                    ? 'bg-gray-900 text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="text-[11px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-lg border-0 focus:outline-none shrink-0"
          >
            <option value="popular">🔥 인기순</option>
            <option value="discount">📉 할인율순</option>
            <option value="urgent">⏰ 마감임박순</option>
          </select>
        </div>
      </div>

      {/* 3. Event Tips Banner */}
      <div className="mx-4 mt-3 bg-gradient-to-r from-rose-50/90 via-orange-50/70 to-amber-50/90 border border-rose-100 rounded-2xl p-3 flex items-start gap-2.5 shadow-2xs">
        <span className="text-base mt-0.5">💡</span>
        <div className="text-[11px] text-gray-700 leading-relaxed">
          <span className="font-bold text-rose-700">편의점 1+1 꿀팁!</span> 교차 증정 태그가 있는 상품은 동일 가격대의 다른 맛으로 교차 선택할 수 있어요.
        </div>
      </div>

      {/* 4. Promotions Count Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between text-xs text-gray-500 font-medium">
        <span>총 <strong className="text-gray-900 font-black">{filteredPromotions.length}</strong>개의 진행 중인 행사</span>
        {dealTab === 'saved' && (
          <span className="text-[11px] text-rose-600 font-semibold">저장된 관심 행사 목록</span>
        )}
      </div>

      {/* 5. Promotion Items List */}
      <div className="px-4 space-y-3">
        {filteredPromotions.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-gray-100 mt-2">
            <span className="text-3xl block mb-2">🏷️</span>
            <div className="text-sm font-bold text-gray-800">해당하는 행사 상품이 없습니다</div>
            <p className="text-xs text-gray-400 mt-1">검색어나 필터를 변경해 보세요</p>
            {(searchQuery || storeFilter !== '전체' || dealTab !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStoreFilter('전체');
                  setDealTab('all');
                }}
                className="mt-3 text-xs text-rose-600 font-bold bg-rose-50 px-3 py-1.5 rounded-full hover:bg-rose-100 transition-colors"
              >
                필터 초기화
              </button>
            )}
          </div>
        ) : (
          filteredPromotions.map((item) => {
            const isSaved = savedSaleIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between relative group"
              >
                {/* Card Top: Badges & Buttons */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Deal Badge (1+1, 2+1, 할인 등) */}
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${getDealBadgeClass(item.dealType)}`}>
                      {item.badgeText}
                    </span>

                    {/* Store Badge */}
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${getStoreBadge(item.store)}`}>
                      {item.store}
                    </span>

                    {/* D-Day Tag */}
                    <span className="text-[10px] font-extrabold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5 text-gray-400" />
                      {item.dDay}
                    </span>
                  </div>

                  {/* Actions: Bookmark & Share */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleShare(item)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 active:scale-90 transition-transform rounded-full hover:bg-gray-100"
                      title="행사 공유하기"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleSaveSale(item.id)}
                      className={`p-1.5 rounded-full transition-all active:scale-90 ${
                        isSaved ? 'text-rose-500 bg-rose-50' : 'text-gray-400 hover:text-rose-500 hover:bg-gray-100'
                      }`}
                      title="관심 행사 찜하기"
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Card Body: Image + Info */}
                <div
                  onClick={() => {
                    if (item.productId) {
                      openProductDetail(item.productId);
                    }
                  }}
                  className={`flex gap-3 items-center ${item.productId ? 'cursor-pointer' : ''}`}
                >
                  <div className="relative shrink-0 overflow-hidden rounded-xl bg-gray-100 w-20 h-20 border border-gray-100">
                    <SafeImage
                      src={item.image}
                      alt={item.title}
                      fallbackName={item.title}
                      fallbackCategory="과자"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.isHot && (
                      <span className="absolute bottom-1 left-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-2xs">
                        인기
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] text-gray-400 font-semibold">{item.brand}</div>
                    <h4 className="text-xs font-bold text-gray-900 leading-snug line-clamp-1 group-hover:text-rose-600 transition-colors">
                      {item.title}
                    </h4>

                    {/* Price & Effective Deal Price */}
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-sm font-black text-rose-600">
                        {item.unitPriceDescription}
                      </span>
                      {item.originalPrice > 0 && (
                        <span className="text-[10px] text-gray-400 line-through">
                          정가 {item.originalPrice.toLocaleString()}원
                        </span>
                      )}
                    </div>

                    {/* Benefit Tag */}
                    {item.benefitTag && (
                      <div className="mt-1 flex items-center gap-1">
                        <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50/80 px-2 py-0.5 rounded-md border border-indigo-100 line-clamp-1">
                          ✨ {item.benefitTag}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer: Description & Period */}
                <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500 line-clamp-1 flex-1 pr-2">
                    {item.description}
                  </span>
                  <span className="text-gray-400 text-[10px] shrink-0 font-medium">
                    {item.period}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
