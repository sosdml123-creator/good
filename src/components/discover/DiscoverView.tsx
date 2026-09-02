import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, Search, SlidersHorizontal, Heart, Star, Award, MapPin } from 'lucide-react';
import { CATEGORIES, SUBCATEGORIES_MAP } from '../../data/mockProducts';
import { ProductCategory } from '../../types';

export const DiscoverView: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    openProductDetail,
    toggleBookmark,
    bookmarkedIds,
    goBack,
    setActiveTab,
  } = useApp();

  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('전체');

  const subCats = SUBCATEGORIES_MAP[selectedCategory] || [];

  const filtered = products.filter((p) => {
    // 1. Category check
    if (selectedCategory !== '전체') {
      if (selectedCategory === '신제품') {
        if (!p.isToday && !p.isHot) return false;
      } else if (p.category !== selectedCategory) {
        return false;
      }
    }
    // 2. SubCategory check
    if (selectedSubCategory !== '전체') {
      if (p.subCategory !== selectedSubCategory) return false;
    }
    return true;
  });

  // Find a product that has brand rankings or restaurant rankings for the current view
  const featuredItem = filtered.find(p => (p.brandRankings && p.brandRankings.length > 0) || (p.restaurantInfo && p.restaurantInfo.regionRankings));

  return (
    <div className="pb-28 bg-white min-h-screen">
      
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
            <span className="text-sm text-gray-400">품목, 브랜드, 외식 메뉴 검색</span>
          </div>

          <button className="p-1 text-gray-700">
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

        {/* Result count & sorting */}
        <div className="px-4 py-2 flex items-center justify-between text-[12px] bg-white">
          <span className="text-gray-500">
            {selectedSubCategory !== '전체' ? `${selectedSubCategory} · ` : ''}
            총 {filtered.length}개 발견
          </span>
          <div className="flex items-center gap-1 text-gray-600 font-medium">
            <span>인기 랭킹순</span>
            <span>▼</span>
          </div>
        </div>
      </div>

      {/* 2. Highlight: 품목별 브랜드 랭킹 or 외식 메뉴 지역별 맛집 랭킹 (Featured Card) */}
      {featuredItem && featuredItem.brandRankings && (
        <div className="mx-4 my-3 p-3.5 bg-gradient-to-br from-amber-50/80 to-orange-50/40 rounded-2xl border border-amber-200/60 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-gray-900">
                {featuredItem.subCategory || featuredItem.category} 브랜드별 소비자 평가 랭킹
              </span>
            </div>
            <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-1.5 py-0.5 rounded">실시간 집계</span>
          </div>

          <div className="space-y-1.5">
            {featuredItem.brandRankings.map((br) => (
              <div
                key={br.name}
                onClick={() => openProductDetail(featuredItem.id)}
                className="bg-white p-2 rounded-xl border border-amber-100 flex items-center justify-between cursor-pointer hover:bg-amber-50/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                    br.rank === 1 ? 'bg-amber-500 text-white' : br.rank === 2 ? 'bg-gray-400 text-white' : 'bg-orange-300 text-white'
                  }`}>
                    {br.rank}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-gray-900 mr-1.5">{br.name}</span>
                    <span className="text-[10px] text-gray-400">{br.brand}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {br.tag && (
                    <span className="text-[10px] font-bold text-[#0066FF] bg-blue-50 px-1.5 py-0.5 rounded">
                      {br.tag}
                    </span>
                  )}
                  <div className="flex items-center gap-0.5 text-xs font-bold text-gray-800">
                    <Star className="w-3 h-3 fill-[#FFC107] text-[#FFC107]" />
                    <span>{br.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {featuredItem && featuredItem.restaurantInfo?.regionRankings && (
        <div className="mx-4 my-3 p-3.5 bg-gradient-to-br from-blue-50/80 to-indigo-50/40 rounded-2xl border border-blue-200/60 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#0066FF]" />
              <span className="text-xs font-bold text-gray-900">
                {featuredItem.subCategory || featuredItem.name} 전국 지역별 인기 맛집
              </span>
            </div>
            <span className="text-[10px] text-[#0066FF] font-bold bg-blue-100 px-1.5 py-0.5 rounded">방문자 평점 1위</span>
          </div>

          <div className="space-y-1.5">
            {featuredItem.restaurantInfo.regionRankings.slice(0, 3).map((rr) => (
              <div
                key={rr.restaurantName}
                onClick={() => openProductDetail(featuredItem.id)}
                className="bg-white p-2.5 rounded-xl border border-blue-100 flex items-center justify-between cursor-pointer hover:bg-blue-50/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-[#0066FF] bg-blue-50 px-1.5 py-0.2 rounded">
                      {rr.region}
                    </span>
                    <span className="text-xs font-bold text-gray-900">{rr.restaurantName}</span>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-0.5 block">대표: {rr.signatureMenu}</span>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-gray-800">
                  <Star className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
                  <span>{rr.rating.toFixed(1)}</span>
                  <span className="text-[10px] text-gray-400 font-normal">({rr.reviewCount})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Product & Item List */}
      <div className="bg-white divide-y divide-gray-100">
        {filtered.map((p) => {
          const isBookmarked = bookmarkedIds.includes(p.id);

          return (
            <div
              key={p.id}
              onClick={() => openProductDetail(p.id)}
              className="flex items-center gap-3 px-4 py-3.5 cursor-pointer active:bg-gray-50 hover:bg-gray-50/60 transition-colors"
            >
              <div className="relative shrink-0 w-[84px] h-[84px] rounded-xl overflow-hidden bg-gray-100">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                {p.discountRate && p.discountRate > 0 && (
                  <span className="absolute top-1 left-1 text-[10px] font-bold bg-red-500 text-white px-1 py-0.2 rounded">
                    {p.discountRate}%
                  </span>
                )}
                {p.subCategory && (
                  <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-black/60 text-white px-1.5 py-0.2 rounded backdrop-blur-xs">
                    {p.subCategory}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-gray-400">{p.brand}</div>
                <div className="text-[13px] font-semibold text-gray-900 leading-snug truncate">
                  {p.name}
                </div>

                {/* Rating & Fresh Metrics Preview */}
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 fill-[#FFC107] text-[#FFC107]" />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-700">{p.overallRating.toFixed(1)}</span>
                  <span className="text-[11px] text-gray-400">({p.ratingCount})</span>

                  {p.freshMetrics && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded ml-1">
                      당도 {p.freshMetrics.sweetness} / 신선 {p.freshMetrics.freshness}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 mt-0.5">
                  {p.discountRate && p.discountRate > 0 && (
                    <span className="text-[12px] font-bold text-red-500">{p.discountRate}%</span>
                  )}
                  <span className="text-[13px] font-bold text-gray-900">
                    {p.itemType === 'restaurant' ? '평균 ' : ''}{p.price.toLocaleString()}원
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => toggleBookmark(p.id, e)}
                className="text-xl p-1 shrink-0 text-gray-300 hover:text-rose-500 transition-colors"
              >
                <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-rose-500 text-rose-500' : 'text-gray-300'}`} />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
