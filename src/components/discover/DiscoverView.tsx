import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, Search, SlidersHorizontal, Heart, Star, Award, ChevronDown, Check } from 'lucide-react';
import { CATEGORIES, SUBCATEGORIES_MAP } from '../../data/mockProducts';
import { ProductCategory, Product } from '../../types';
import { getCategoryReviewRankedProducts } from '../../utils/ranking';

type SortOption = 'review_rank' | 'rating' | 'review_count' | 'newest';

const SORT_LABELS: Record<SortOption, string> = {
  review_rank: '리뷰 평가 랭킹순',
  rating: '평점 높은순',
  review_count: '리뷰 많은순',
  newest: '최신 신상품순',
};

export const DiscoverView: React.FC = () => {
  const {
    products,
    reviews,
    selectedCategory,
    setSelectedCategory,
    openProductDetail,
    toggleBookmark,
    bookmarkedIds,
    goBack,
    setActiveTab,
  } = useApp();

  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('전체');
  const [sortBy, setSortBy] = useState<SortOption>('review_rank');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState<boolean>(false);
  const [promoFilter, setPromoFilter] = useState<'all' | '1+1' | '2+1'>('all');

  const subCats = SUBCATEGORIES_MAP[selectedCategory] || [];

  // Review-based ranked products
  const baseRankedItems = getCategoryReviewRankedProducts(
    products,
    reviews,
    selectedCategory,
    selectedSubCategory,
    sortBy
  );

  const rankedItems = baseRankedItems.filter(item => {
    const p = item.product;
    if (promoFilter === 'all') return true;
    if (promoFilter === '1+1') {
      return (
        p.storeStocks?.some(s => s.eventBadge?.includes('1+1')) ||
        p.name.includes('1+1') ||
        (p.stores && p.stores.includes('CU') && (p.price <= 2000 || p.isHot))
      );
    }
    if (promoFilter === '2+1') {
      return (
        p.storeStocks?.some(s => s.eventBadge?.includes('2+1')) ||
        p.name.includes('2+1') ||
        (p.stores && p.stores.includes('GS25') && (p.price > 1500 || p.isToday))
      );
    }
    return true;
  });

  // Top 3 ranked items based on review evaluation
  const top3Ranked = rankedItems.slice(0, 3);

  const isProduce = (p: Product) =>
    p.category === '과일' ||
    p.category === '식재료' ||
    p.category === '고기·수산' ||
    p.itemType === 'fresh' ||
    Boolean(p.produceDetails);

  return (
    <div className="pb-12 bg-white min-h-full">
      
      {/* 1. Header with Search Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-2xs">
        <div className="flex items-center gap-2 px-4 py-2.5">
          <button
            onClick={goBack}
            className="p-1 text-gray-700 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          <div
            onClick={() => setActiveTab('search')}
            className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-3.5 py-2 cursor-pointer"
          >
            <Search className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">신상품, 먹거리, 브랜드 검색</span>
          </div>

          <button 
            onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
            className="p-1 text-gray-700 hover:text-gray-900"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* 1차 Category horizontal scroll tabs */}
        <div className="flex overflow-x-auto no-scrollbar px-2 pb-0.5 border-b border-gray-100">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                setSelectedCategory(c as ProductCategory);
                setSelectedSubCategory('전체');
              }}
              className={`shrink-0 px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === c
                  ? 'text-[#0066FF] border-b-2 border-[#0066FF]'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* 2차 Subcategory horizontal scroll pills (if available) */}
        {subCats.length > 0 && (
          <div className="flex overflow-x-auto no-scrollbar px-3 py-2 gap-1.5 bg-gray-50/70 border-b border-gray-100">
            {subCats.map((sub) => {
              const isSelected = selectedSubCategory === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubCategory(sub)}
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#0066FF] text-white shadow-xs'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        )}

        {/* 편의점 행사 필터 칩 (1+1 / 2+1 행사 신상 모아보기) */}
        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-white border-b border-gray-100 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-black text-gray-400 shrink-0">행사혜택:</span>
          {(['all', '1+1', '2+1'] as const).map((pf) => (
            <button
              key={pf}
              onClick={() => setPromoFilter(pf)}
              className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                promoFilter === pf
                  ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {pf === 'all' ? '전체' : `${pf} 행사`}
            </button>
          ))}
        </div>

        {/* Result count & interactive sorting dropdown */}
        <div className="relative px-4 py-2 flex items-center justify-between text-[12px] bg-white">
          <span className="text-gray-500">
            {selectedSubCategory !== '전체' ? `${selectedSubCategory} · ` : ''}
            총 <span className="font-bold text-gray-800">{rankedItems.length}</span>개 발견
          </span>
          
          <button
            onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
            className="flex items-center gap-1 text-gray-700 font-bold px-2 py-1 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <span>{SORT_LABELS[sortBy]}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </button>

          {/* Sort Dropdown Menu */}
          {isSortMenuOpen && (
            <div className="absolute right-4 top-10 z-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-40 animate-in fade-in zoom-in-95 duration-150">
              {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setSortBy(opt);
                    setIsSortMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                    sortBy === opt ? 'font-bold text-[#0066FF] bg-blue-50/60' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{SORT_LABELS[opt]}</span>
                  {sortBy === opt && <Check className="w-3.5 h-3.5 text-[#0066FF]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Highlight: 게시된 리뷰 반영 실시간 랭킹 TOP 3 */}
      {top3Ranked.length > 0 && (
        <div className="mx-4 my-3 p-3.5 bg-gradient-to-br from-amber-50/90 via-blue-50/50 to-indigo-50/40 rounded-2xl border border-amber-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-black text-gray-900">
                👑 {selectedCategory === '전체' ? '전체' : selectedCategory} 실시간 리뷰 평가 랭킹 TOP 3
              </span>
            </div>
            <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
              실제 리뷰 반영
            </span>
          </div>

          <div className="space-y-2">
            {top3Ranked.map((item) => {
              const p = item.product;
              const isFirst = item.reviewRank === 1;
              const isSecond = item.reviewRank === 2;

              return (
                <div
                  key={p.id}
                  onClick={() => openProductDetail(p.id)}
                  className={`bg-white p-2.5 rounded-xl border transition-all cursor-pointer shadow-2xs hover:shadow-xs flex items-center justify-between ${
                    isFirst ? 'border-amber-300 ring-1 ring-amber-200/50' : isSecond ? 'border-blue-200' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 shadow-2xs ${
                      isFirst
                        ? 'bg-amber-500 text-white'
                        : isSecond
                        ? 'bg-slate-400 text-white'
                        : 'bg-amber-700 text-white'
                    }`}>
                      {item.reviewRank}
                    </span>

                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0" />
                    
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-gray-900 truncate">{p.name}</div>
                      
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-[10px] text-gray-400">{p.brand}</span>
                        {item.topKeyword && (
                          <span className="text-[9px] font-bold text-[#0066FF] bg-blue-50 px-1.5 py-0.2 rounded">
                            #{item.topKeyword}
                          </span>
                        )}
                        {/* 농수산물 사이즈 / 당도 배지 */}
                        {p.produceDetails?.sizeGrade && (
                          <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                            📐 {p.produceDetails.sizeGrade.split(' ')[0]}
                          </span>
                        )}
                        {p.produceDetails?.brixGrade && (
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                            🍯 {p.produceDetails.brixGrade.split(' ')[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 ml-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
                      <span className="text-xs font-black text-gray-900">{item.effectiveRating.toFixed(1)}</span>
                      <span className="text-[10px] text-gray-400">({item.totalReviewCount})</span>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded mt-0.5">
                      리뷰점수 {item.reviewScore}점
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Product & Item List */}
      <div className="bg-white divide-y divide-gray-100">
        {rankedItems.length > 0 ? (
          rankedItems.map((item) => {
            const p = item.product;
            const isBookmarked = bookmarkedIds.includes(p.id);

            return (
              <div
                key={p.id}
                onClick={() => openProductDetail(p.id)}
                className="flex items-center gap-3 px-4 py-3.5 cursor-pointer active:bg-gray-50 hover:bg-gray-50/60 transition-colors"
              >
                {/* Image & Rank Badge */}
                <div className="relative shrink-0 w-[84px] h-[84px] rounded-xl overflow-hidden bg-gray-100 shadow-2xs">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  
                  {/* 순위 뱃지 */}
                  <span className={`absolute top-1 left-1 w-5 h-5 rounded-md text-[11px] font-black flex items-center justify-center shadow-xs ${
                    item.reviewRank === 1
                      ? 'bg-amber-500 text-white'
                      : item.reviewRank === 2
                      ? 'bg-slate-400 text-white'
                      : item.reviewRank === 3
                      ? 'bg-amber-700 text-white'
                      : 'bg-black/60 text-white backdrop-blur-xs'
                  }`}>
                    {item.reviewRank}
                  </span>

                  {p.subCategory && (
                    <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-black/60 text-white px-1.5 py-0.2 rounded backdrop-blur-xs">
                      {p.subCategory}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-gray-400">{p.brand}</span>
                    {item.reviewRank === 1 && (
                      <span className="text-[9px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                        리뷰 1위 👑
                      </span>
                    )}
                  </div>

                  <div className="text-[13px] font-semibold text-gray-900 leading-snug truncate mt-0.5">
                    {p.name}
                  </div>

                  {/* Rating & Review Score Preview */}
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
                      <span className="text-[12px] font-black text-gray-800">{item.effectiveRating.toFixed(1)}</span>
                    </div>
                    <span className="text-[11px] text-gray-400">({item.totalReviewCount}명 리뷰)</span>

                    {/* 실시간 리뷰 반영 점수 배지 */}
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                      점수 {item.reviewScore}점
                    </span>
                  </div>

                  {/* 📐 농수산물 전용: 사이즈 평균 & 당도 배지 */}
                  {isProduce(p) && (
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {p.produceDetails?.sizeGrade && (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                          <span>📐</span>
                          <span>{p.produceDetails.sizeGrade.split(' ')[0]}</span>
                        </span>
                      )}
                      {p.produceDetails?.brixGrade && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                          <span>🍯</span>
                          <span>{p.produceDetails.brixGrade.split(' ')[0]}</span>
                        </span>
                      )}
                      {p.freshMetrics && !p.produceDetails?.brixGrade && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                          당도 {p.freshMetrics.sweetness} / 신선 {p.freshMetrics.freshness}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[13px] font-bold text-gray-900">
                      {p.itemType === 'restaurant' ? '평균 ' : ''}{p.price.toLocaleString()}원
                    </span>
                    {p.volume && (
                      <span className="text-[10px] text-gray-400">({p.volume})</span>
                    )}
                  </div>
                </div>

                {/* Bookmark Button */}
                <button
                  onClick={(e) => toggleBookmark(p.id, e)}
                  className="text-xl p-1 shrink-0 text-gray-300 hover:text-rose-500 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-rose-500 text-rose-500' : 'text-gray-300'}`} />
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 px-4 space-y-2 text-gray-400">
            <span className="text-3xl block">🍽️</span>
            <p className="text-xs font-bold text-gray-700">해당 카테고리의 상품이 없습니다.</p>
            <p className="text-[11px]">다른 카테고리나 하위 품목을 선택해보세요.</p>
          </div>
        )}
      </div>

    </div>
  );
};

