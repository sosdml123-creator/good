import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, Heart, Star, ChevronDown, Check } from 'lucide-react';
import { CATEGORIES, SUBCATEGORIES_MAP } from '../../data/mockProducts';
import { ProductCategory, Product } from '../../types';
import { getCategoryReviewRankedProducts } from '../../utils/ranking';
import { SafeImage } from '../common/SafeImage';
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll';
import { formatProductPrice } from '../../utils/formatters';
import { useT } from '../../i18n';

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
  const t = useT();

  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('전체');
  const [sortBy, setSortBy] = useState<SortOption>('review_rank');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState<boolean>(false);
  const [displayLimit, setDisplayLimit] = useState<number>(30);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const subCats = SUBCATEGORIES_MAP[selectedCategory] || [];

  const categoryScroll = useHorizontalScroll<HTMLDivElement>();
  const subCategoryScroll = useHorizontalScroll<HTMLDivElement>();
  const categoryBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Auto-scroll active category button into view when selectedCategory changes
  useEffect(() => {
    const activeBtn = categoryBtnRefs.current[selectedCategory];
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [selectedCategory]);

  // Reset displayLimit on category or filter change
  useEffect(() => {
    setDisplayLimit(30);
  }, [selectedCategory, selectedSubCategory, sortBy]);

  // Review-based ranked products with useMemo
  const rankedItems = useMemo(() => {
    return getCategoryReviewRankedProducts(
      products,
      reviews,
      selectedCategory,
      selectedSubCategory,
      sortBy
    );
  }, [products, reviews, selectedCategory, selectedSubCategory, sortBy]);

  // Top 3 ranked items based on review evaluation
  const top3Ranked = useMemo(() => rankedItems.slice(0, 3), [rankedItems]);
  const visibleRankedItems = useMemo(() => rankedItems.slice(0, displayLimit), [rankedItems, displayLimit]);

  // Infinite scroll observer
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || displayLimit >= rankedItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setDisplayLimit((prev) => Math.min(prev + 30, rankedItems.length));
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rankedItems.length, displayLimit]);

  const isProduce = (p: Product) =>
    p.category === '과일' ||
    p.category === '식재료' ||
    p.category === '고기·수산' ||
    p.itemType === 'fresh' ||
    Boolean(p.produceDetails);

  return (
    <div className="pb-20 bg-white min-h-full">
      
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
            <span className="text-sm text-gray-400">{t('신상품, 먹거리, 브랜드 검색')}</span>
          </div>

          <button 
            onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
            className="p-1 text-gray-700 hover:text-gray-900"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* 1차 Category horizontal scroll tabs */}
        <div className="relative group/cat border-b border-gray-100 bg-white">
          {categoryScroll.canScrollLeft && (
            <button
              type="button"
              onClick={() => categoryScroll.scrollToLeft(160)}
              className="absolute left-0 top-0 bottom-0 z-10 w-7 flex items-center justify-center bg-gradient-to-r from-white via-white/95 to-transparent text-gray-500 hover:text-gray-900 transition-opacity"
              aria-label="이전 카테고리"
            >
              <ChevronLeft className="w-4 h-4 drop-shadow-xs" />
            </button>
          )}

          <div
            ref={categoryScroll.scrollRef}
            className="flex overflow-x-auto no-scrollbar px-2 pb-0.5 scroll-smooth cursor-grab active:cursor-grabbing select-none"
          >
            {CATEGORIES.map((c) => (
              <button
                key={c}
                ref={(el) => { categoryBtnRefs.current[c] = el; }}
                onClick={(e) => {
                  setSelectedCategory(c as ProductCategory);
                  setSelectedSubCategory('전체');
                  e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }}
                className={`shrink-0 px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === c
                    ? 'text-gray-900 border-b-2 border-gray-900 font-bold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {t(c)}
              </button>
            ))}
          </div>

          {categoryScroll.canScrollRight && (
            <button
              type="button"
              onClick={() => categoryScroll.scrollToRight(160)}
              className="absolute right-0 top-0 bottom-0 z-10 w-7 flex items-center justify-center bg-gradient-to-l from-white via-white/95 to-transparent text-gray-500 hover:text-gray-900 transition-opacity"
              aria-label="다음 카테고리"
            >
              <ChevronRight className="w-4 h-4 drop-shadow-xs" />
            </button>
          )}
        </div>

        {/* 2차 Subcategory horizontal scroll pills (if available) */}
        {subCats.length > 0 && (
          <div className="relative group/sub border-b border-gray-100 bg-gray-50/70">
            {subCategoryScroll.canScrollLeft && (
              <button
                type="button"
                onClick={() => subCategoryScroll.scrollToLeft(140)}
                className="absolute left-0 top-0 bottom-0 z-10 w-6 flex items-center justify-center bg-gradient-to-r from-gray-50 via-gray-50/95 to-transparent text-gray-500 hover:text-gray-900"
                aria-label="이전 서브카테고리"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}

            <div
              ref={subCategoryScroll.scrollRef}
              className="flex overflow-x-auto no-scrollbar px-3 py-2 gap-1.5 scroll-smooth cursor-grab active:cursor-grabbing select-none"
            >
              {subCats.map((sub) => {
                const isSelected = selectedSubCategory === sub;
                return (
                  <button
                    key={sub}
                    onClick={(e) => {
                      setSelectedSubCategory(sub);
                      e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                    }}
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-gray-900 text-white shadow-xs'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {t(sub)}
                  </button>
                );
              })}
            </div>

            {subCategoryScroll.canScrollRight && (
              <button
                type="button"
                onClick={() => subCategoryScroll.scrollToRight(140)}
                className="absolute right-0 top-0 bottom-0 z-10 w-6 flex items-center justify-center bg-gradient-to-l from-gray-50 via-gray-50/95 to-transparent text-gray-500 hover:text-gray-900"
                aria-label="다음 서브카테고리"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}


        {/* Result count & interactive sorting dropdown */}
        <div className="relative px-4 py-2 flex items-center justify-between text-[12px] bg-white">
          <span className="text-gray-500">
            {selectedSubCategory !== '전체' ? `${t(selectedSubCategory)} · ` : ''}
            {t('총 {n}개 발견', { n: rankedItems.length })}
          </span>
          
          <button
            onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
            className="flex items-center gap-1 text-gray-700 font-bold px-2 py-1 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <span>{t(SORT_LABELS[sortBy])}</span>
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
                    sortBy === opt ? 'font-bold text-gray-900 bg-gray-100' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{t(SORT_LABELS[opt])}</span>
                  {sortBy === opt && <Check className="w-3.5 h-3.5 text-gray-900" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Highlight: 게시된 리뷰 반영 실시간 랭킹 TOP 3 */}
      {top3Ranked.length > 0 && (
        <div className="pt-4 pb-3 border-b border-gray-100">
          <div className="flex items-baseline justify-between px-4 mb-2.5">
            <h2 className="text-[15px] font-bold text-gray-900">
              {selectedCategory === '전체' ? '지금' : selectedCategory} 리뷰 좋은 신상
            </h2>
            <span className="text-[11px] text-gray-400">리뷰 기준 TOP 3</span>
          </div>

          <div className="flex gap-3 overflow-x-auto px-4 pb-1 snap-x" style={{ scrollbarWidth: 'none' }}>
            {top3Ranked.map((item) => {
              const p = item.product;
              return (
                <div
                  key={p.id}
                  onClick={() => openProductDetail(p.id)}
                  className="w-[132px] shrink-0 snap-start cursor-pointer active:opacity-80"
                >
                  <div className="relative w-[132px] h-[132px] rounded-2xl overflow-hidden bg-gray-100">
                    <SafeImage
                      src={p.image}
                      alt={p.name}
                      fallbackCategory={p.category}
                      fallbackName={p.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute left-0 top-0 bg-gray-900/85 text-white text-[12px] font-bold px-2.5 py-1 rounded-br-xl">
                      {item.reviewRank}
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-gray-400 truncate">{p.brand}</div>
                  <div className="text-[13px] font-medium text-gray-900 leading-snug line-clamp-2">{p.name}</div>
                  {item.totalReviewCount > 0 && item.effectiveRating > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-[#FFC107] text-[#FFC107]" />
                      <span className="text-[12px] font-semibold text-gray-900">{item.effectiveRating.toFixed(1)}</span>
                      <span className="text-[11px] text-gray-400">({item.totalReviewCount})</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Product & Item List */}
      <div className="bg-white divide-y divide-gray-100">
        {rankedItems.length > 0 ? (
          <>
            {visibleRankedItems.map((item) => {
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
                    <SafeImage
                      src={p.image}
                      alt={p.name}
                      fallbackCategory={p.category}
                      fallbackName={p.name}
                      className="w-full h-full object-cover"
                    />
                    
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
                    {item.totalReviewCount > 0 && item.effectiveRating > 0 ? (
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
                          <span className="text-[12px] font-black text-gray-800">{item.effectiveRating.toFixed(1)}</span>
                        </div>
                        <span className="text-[11px] text-gray-400">({item.totalReviewCount}명 리뷰)</span>

                        {/* 실시간 리뷰 반영 점수 배지 */}
                        {item.reviewScore > 0 && (
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                            점수 {item.reviewScore}점
                          </span>
                        )}
                      </div>
                    ) : null}

                    {/* 📐 농수산물 전용: 사이즈 평균 & 당도 배지 */}
                    {isProduce(p) && (
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {p.produceDetails?.sizeGrade && (
                          <span className="text-[10px] font-bold text-gray-700 bg-gray-100 border border-gray-200 px-1.5 py-0.2 rounded flex items-center gap-0.5">
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

                    {/* Price & KAMIS Trend */}
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="text-[13px] font-bold text-gray-900">
                        {p.itemType === 'restaurant' && p.price ? '평균 ' : ''}{formatProductPrice(p.price)}
                      </span>

                      {p.kamisPriceInfo && (
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                          p.kamisPriceInfo.trend === 'up' 
                            ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                            : p.kamisPriceInfo.trend === 'down' 
                            ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <span>KAMIS</span>
                          <span>
                            {p.kamisPriceInfo.trend === 'up' ? '▲' : p.kamisPriceInfo.trend === 'down' ? '▼' : '-'} 
                            {p.kamisPriceInfo.changeRate !== 0 ? `${Math.abs(p.kamisPriceInfo.changeRate)}%` : '보합'}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bookmark */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => toggleBookmark(p.id, e)}
                      className="text-xl p-1 text-gray-300 hover:text-rose-500 transition-colors"
                    >
                      <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-rose-500 text-rose-500' : 'text-gray-300'}`} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Scroll Trigger Sensor */}
            {displayLimit < rankedItems.length && (
              <div ref={loadMoreRef} className="py-4 flex items-center justify-center bg-gray-50/50">
                <button
                  onClick={() => setDisplayLimit((prev) => prev + 30)}
                  className="text-xs font-bold text-gray-500 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-2xs hover:bg-gray-50 active:scale-95 transition-all"
                >
                  {t('신제품 더보기')} ({visibleRankedItems.length} / {rankedItems.length})
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 px-4 space-y-2 text-gray-400">
            <span className="text-3xl block">🍽️</span>
            <p className="text-xs font-bold text-gray-700">{selectedCategory === '신제품' ? t('이번 주에 새로 나온 신상품이 아직 없어요.') : t('해당 카테고리의 상품이 없습니다.')}</p>
            <p className="text-[11px]">{selectedCategory === '신제품' ? t('신상은 출시 후 일주일 동안만 이곳에 보여요.') : t('다른 카테고리나 하위 품목을 선택해보세요.')}</p>
          </div>
        )}
      </div>

    </div>
  );
};

