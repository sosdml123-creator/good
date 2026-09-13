import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Trophy, 
  Crown, 
  Star, 
  Heart, 
  Search, 
  Sparkles, 
  Flame, 
  ThumbsUp, 
  PenLine, 
  ArrowUp
} from 'lucide-react';
import { Product } from '../../types';
import { calculateProductPopularity } from '../../utils/ranking';

type RankingSortType = 'popular' | 'rating' | 'reviews' | 'repurchase';

interface SortTabItem {
  id: RankingSortType;
  label: string;
  icon: React.ReactNode;
}

export const RankingView: React.FC = () => {
  const {
    products,
    reviews,
    openProductDetail,
    toggleBookmark,
    bookmarkedIds,
    setActiveTab,
  } = useApp();

  const [sortType, setSortType] = useState<RankingSortType>('popular');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [selectedStore, setSelectedStore] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const sortTabs: SortTabItem[] = [
    { id: 'popular', label: '실시간 급상승', icon: <Flame className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'rating', label: '평점 TOP', icon: <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> },
    { id: 'reviews', label: '리뷰 많은순', icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'repurchase', label: '재구매 1위', icon: <ThumbsUp className="w-3.5 h-3.5 text-green-500" /> },
  ];

  const categories = [
    '전체',
    '과자',
    '음료',
    '빵·디저트',
    '간편식',
    '패스트푸드',
    '아이스크림',
    '기타',
  ];

  const stores = ['전체', 'CU', 'GS25', '세븐일레븐', '이마트24'];

  // Calculate sorted rankings
  const rankedItems = useMemo(() => {
    let list = [...products];

    // 1. Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // 2. Store filter
    if (selectedStore !== '전체') {
      list = list.filter((p) => {
        if (p.stores && p.stores.includes(selectedStore as any)) return true;
        if (p.brand.toLowerCase().includes(selectedStore.toLowerCase())) return true;
        if (p.storeStocks && p.storeStocks.some((s) => s.store.includes(selectedStore))) return true;
        return false;
      });
    }

    // 3. Category filter
    if (selectedCategory !== '전체') {
      list = list.filter((p) => {
        if (selectedCategory === '과자') return p.category === '과자' || p.subCategory === '스낵';
        return p.category === selectedCategory || p.subCategory === selectedCategory;
      });
    }

    // 4. Calculate metrics and sort
    const mapped = list.map((product) => {
      const prodReviews = reviews.filter((r) => r.productId === product.id);
      const totalReviews = (product.ratingCount || 0) + prodReviews.length;
      
      let effectiveRating = product.overallRating || 4.5;
      if (prodReviews.length > 0) {
        const sumR = prodReviews.reduce((acc, r) => acc + (r.rating || 5), 0);
        effectiveRating = Number(((product.overallRating * 5 + sumR) / (5 + prodReviews.length)).toFixed(1));
      }

      const popularityScore = calculateProductPopularity(product, reviews);
      const repurchaseScore = product.repurchasePercent || 85;

      return {
        product,
        effectiveRating,
        totalReviews,
        popularityScore,
        repurchaseScore,
      };
    });

    mapped.sort((a, b) => {
      if (sortType === 'popular') {
        return b.popularityScore - a.popularityScore;
      }
      if (sortType === 'rating') {
        if (b.effectiveRating !== a.effectiveRating) {
          return b.effectiveRating - a.effectiveRating;
        }
        return b.totalReviews - a.totalReviews;
      }
      if (sortType === 'reviews') {
        return b.totalReviews - a.totalReviews;
      }
      if (sortType === 'repurchase') {
        if (b.repurchaseScore !== a.repurchaseScore) {
          return b.repurchaseScore - a.repurchaseScore;
        }
        return b.effectiveRating - a.effectiveRating;
      }
      return 0;
    });

    return mapped.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [products, reviews, sortType, selectedCategory, selectedStore, searchQuery]);

  const top3 = rankedItems.slice(0, 3);
  const others = rankedItems.slice(3);

  return (
    <div className="flex-1 flex flex-col bg-[#F8F9FA] pb-20 select-none">
      {/* 1. Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-sm">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-black tracking-tight text-gray-900">신상 랭킹</h1>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 tracking-wide">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium leading-none mt-0.5">
                소비자 리뷰와 인기도를 실시간 집계합니다
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="랭킹 검색"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Expandable Search Input */}
        {isSearchOpen && (
          <div className="mt-2.5 pt-2 border-t border-gray-100">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="찾고 싶은 신제품이나 브랜드 검색..."
                className="w-full bg-gray-100 text-sm rounded-xl pl-9 pr-8 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
                autoFocus
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-xs text-gray-400 hover:text-gray-600"
                >
                  지우기
                </button>
              )}
            </div>
          </div>
        )}

        {/* 2. Sort Standard Tabs */}
        <div className="flex items-center gap-1.5 mt-3 pt-1 overflow-x-auto no-scrollbar">
          {sortTabs.map((tab) => {
            const isSelected = sortType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSortType(tab.id)}
                className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all focus:outline-none ${
                  isSelected
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Category & Store Chips */}
        <div className="flex flex-col gap-1.5 mt-2.5">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors focus:outline-none ${
                    active
                      ? 'bg-gray-900 text-white font-semibold shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Store Chips */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[10px] text-gray-400 font-bold px-1 shrink-0">편의점:</span>
            {stores.map((st) => {
              const active = selectedStore === st;
              return (
                <button
                  key={st}
                  onClick={() => setSelectedStore(st)}
                  className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-medium transition-colors focus:outline-none ${
                    active
                      ? 'bg-amber-500 text-white font-bold'
                      : 'bg-gray-50 border border-gray-150 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="px-4 pt-4 flex-1">
        {rankedItems.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-3">
              🔍
            </div>
            <p className="text-sm font-semibold text-gray-700">해당 조건의 랭킹 상품이 없습니다</p>
            <p className="text-xs text-gray-400 mt-1">검색어나 카테고리 필터를 변경해보세요.</p>
          </div>
        ) : (
          <>
            {/* 🏆 Top 3 Podium (시상대 명예의 전당) */}
            {top3.length > 0 && (
              <div className="mb-6 bg-gradient-to-b from-amber-500/10 via-yellow-400/5 to-transparent rounded-2xl p-3 border border-amber-200/50 shadow-xs">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span className="text-xs font-bold text-gray-800">
                      {selectedCategory === '전체' ? '종합' : selectedCategory} TOP 3 명예의 전당
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">실시간 만족도 순위</span>
                </div>

                <div className="grid grid-cols-3 gap-2 items-end">
                  {/* 2nd Place (Silver) */}
                  {top3[1] && (
                    <PodiumCard
                      item={top3[1]}
                      rank={2}
                      badgeBg="bg-slate-200 text-slate-700 border-slate-300"
                      crownColor="text-slate-400"
                      height="h-[180px]"
                      isBookmarked={bookmarkedIds.includes(top3[1].product.id)}
                      onToggleBookmark={() => toggleBookmark(top3[1].product.id)}
                      onClick={() => openProductDetail(top3[1].product.id)}
                    />
                  )}

                  {/* 1st Place (Gold - Centered & Elevated) */}
                  {top3[0] && (
                    <PodiumCard
                      item={top3[0]}
                      rank={1}
                      badgeBg="bg-gradient-to-r from-amber-400 to-yellow-500 text-white border-amber-300 shadow-md"
                      crownColor="text-amber-500 fill-amber-400"
                      height="h-[204px]"
                      isFirst
                      isBookmarked={bookmarkedIds.includes(top3[0].product.id)}
                      onToggleBookmark={() => toggleBookmark(top3[0].product.id)}
                      onClick={() => openProductDetail(top3[0].product.id)}
                    />
                  )}

                  {/* 3rd Place (Bronze) */}
                  {top3[2] && (
                    <PodiumCard
                      item={top3[2]}
                      rank={3}
                      badgeBg="bg-amber-100 text-amber-800 border-amber-300"
                      crownColor="text-amber-700"
                      height="h-[170px]"
                      isBookmarked={bookmarkedIds.includes(top3[2].product.id)}
                      onToggleBookmark={() => toggleBookmark(top3[2].product.id)}
                      onClick={() => openProductDetail(top3[2].product.id)}
                    />
                  )}
                </div>
              </div>
            )}

            {/* 4위 이하 랭킹 리스트 */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-gray-700">
                  전체 순위 ({rankedItems.length}개)
                </span>
                <span className="text-[11px] text-gray-400">
                  {sortType === 'popular' && '인기도 집계순'}
                  {sortType === 'rating' && '평점 높은순'}
                  {sortType === 'reviews' && '리뷰 많은순'}
                  {sortType === 'repurchase' && '재구매율순'}
                </span>
              </div>

              {others.map((item) => {
                const isBookmarked = bookmarkedIds.includes(item.product.id);
                return (
                  <div
                    key={item.product.id}
                    onClick={() => openProductDetail(item.product.id)}
                    className="bg-white rounded-xl p-3 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-gray-200 transition-all flex items-center gap-3 cursor-pointer group active:scale-[0.99]"
                  >
                    {/* Rank Badge */}
                    <div className="w-7 flex flex-col items-center justify-center shrink-0">
                      <span className="text-base font-black text-gray-700 group-hover:text-[#0066FF] transition-colors">
                        {item.rank}
                      </span>
                      <span className="text-[9px] text-emerald-500 font-bold flex items-center">
                        <ArrowUp className="w-2.5 h-2.5" />
                      </span>
                    </div>

                    {/* Product Thumbnail */}
                    <div className="relative w-16 h-16 rounded-lg bg-gray-50 shrink-0 overflow-hidden border border-gray-100">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=80';
                        }}
                      />
                      {item.product.stores && item.product.stores[0] && (
                        <span className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xs text-[8px] font-bold text-white text-center py-0.5">
                          {item.product.stores[0]}
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-gray-400 truncate">
                          {item.product.brand}
                        </span>
                        {item.product.isToday && (
                          <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1 rounded">
                            오늘신상
                          </span>
                        )}
                        {item.product.isHot && (
                          <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1 rounded">
                            HOT
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs font-bold text-gray-900 truncate mt-0.5 group-hover:text-[#0066FF] transition-colors">
                        {item.product.name}
                      </h3>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-gray-900">
                          {item.product.price ? `${item.product.price.toLocaleString()}원` : '가격문의'}
                        </span>
                        <div className="flex items-center gap-0.5 text-amber-500 text-[11px] font-bold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{item.effectiveRating}</span>
                          <span className="text-gray-400 text-[10px] font-normal">
                            ({item.totalReviews})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        {item.repurchaseScore > 0 && (
                          <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium">
                            재구매의사 {item.repurchaseScore}%
                          </span>
                        )}
                        {item.product.bestQuotes && item.product.bestQuotes[0] && (
                          <span className="text-[10px] text-gray-400 truncate hidden xs:inline">
                            "{item.product.bestQuotes[0]}"
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bookmark Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(item.product.id);
                      }}
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-rose-500 transition-colors focus:outline-none shrink-0"
                      aria-label="찜하기"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isBookmarked ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ✍️ Bottom Floating Review Induction Banner */}
        <div className="mt-8 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-white shadow-md flex items-center justify-between">
          <div className="flex-1 pr-3">
            <div className="flex items-center gap-1.5 text-blue-100 text-[11px] font-bold mb-0.5">
              <PenLine className="w-3.5 h-3.5" />
              <span>신상 랭킹은 여러분의 손으로!</span>
            </div>
            <h4 className="text-xs font-bold leading-snug">
              먹어본 신제품이 있으신가요?<br />
              솔직한 리뷰 남기고 랭킹을 바꿔보세요!
            </h4>
          </div>
          <button
            onClick={() => setActiveTab('write')}
            className="shrink-0 bg-white text-[#0066FF] hover:bg-blue-50 px-3 py-2 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all"
          >
            리뷰 작성 ✍️
          </button>
        </div>
      </div>
    </div>
  );
};

interface PodiumCardProps {
  item: {
    product: Product;
    effectiveRating: number;
    totalReviews: number;
    rank: number;
    repurchaseScore: number;
  };
  rank: number;
  badgeBg: string;
  crownColor: string;
  height: string;
  isFirst?: boolean;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onClick: () => void;
}

const PodiumCard: React.FC<PodiumCardProps> = ({
  item,
  rank,
  badgeBg,
  crownColor,
  height,
  isFirst = false,
  isBookmarked,
  onToggleBookmark,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-xl border border-amber-200/80 p-2 flex flex-col justify-between shadow-sm cursor-pointer group hover:shadow-md hover:border-amber-300 transition-all ${height} ${
        isFirst ? 'ring-2 ring-amber-400 ring-offset-1 z-10' : ''
      }`}
    >
      {/* Crown / Rank Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span
            className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-black border ${badgeBg}`}
          >
            {rank}
          </span>
          <Crown className={`w-3.5 h-3.5 ${crownColor}`} />
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark();
          }}
          className="text-gray-300 hover:text-rose-500 transition-colors focus:outline-none"
        >
          <Heart
            className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-rose-500 text-rose-500' : ''}`}
          />
        </button>
      </div>

      {/* Image */}
      <div className="relative w-full aspect-square my-1 rounded-lg overflow-hidden bg-gray-50">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=80';
          }}
        />
        {item.product.stores && item.product.stores[0] && (
          <span className="absolute top-1 left-1 bg-black/60 backdrop-blur-xs text-[8px] font-bold text-white px-1 py-0.5 rounded">
            {item.product.stores[0]}
          </span>
        )}
      </div>

      {/* Title & Info */}
      <div className="min-w-0">
        <span className="text-[9px] text-gray-400 block truncate font-medium">
          {item.product.brand}
        </span>
        <h4 className="text-[11px] font-bold text-gray-900 truncate group-hover:text-[#0066FF] transition-colors leading-tight">
          {item.product.name}
        </h4>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] font-bold text-gray-800">
            {item.product.price ? `${item.product.price.toLocaleString()}원` : ''}
          </span>
          <div className="flex items-center gap-0.5 text-[10px] text-amber-500 font-bold">
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            <span>{item.effectiveRating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
