import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, SUBCATEGORIES_MAP } from '../data/mockProducts';
import { getCategoryReviewRankedProducts } from '../utils/ranking';
import { PcProductCard } from './PcProductCard';

type SortOption = 'review_rank' | 'rating' | 'review_count' | 'newest';

const SORT_LABELS: Record<SortOption, string> = {
  review_rank: '리뷰 평가순',
  rating: '별점 높은순',
  review_count: '리뷰 많은순',
  newest: '최신순',
};

const PAGE_SIZE = 40;

/** PC 신제품·카테고리 목록: 왼쪽 카테고리 메뉴 + 넓은 상품 그리드 */
export const PcProductList: React.FC = () => {
  const { products, reviews, selectedCategory, setSelectedCategory } = useApp();
  const [subCategory, setSubCategory] = useState('전체');
  const [sortBy, setSortBy] = useState<SortOption>('review_rank');
  const [limit, setLimit] = useState(PAGE_SIZE);

  useEffect(() => {
    setSubCategory('전체');
  }, [selectedCategory]);

  useEffect(() => {
    setLimit(PAGE_SIZE);
  }, [selectedCategory, subCategory, sortBy]);

  const ranked = useMemo(
    () => getCategoryReviewRankedProducts(products, reviews, selectedCategory, subCategory, sortBy),
    [products, reviews, selectedCategory, subCategory, sortBy]
  );
  const subCats = SUBCATEGORIES_MAP[selectedCategory] || [];

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-8 grid grid-cols-[200px_1fr] gap-10">
      <nav className="self-start sticky top-6">
        <p className="px-3 mb-2 text-[12px] font-bold text-gray-400">카테고리</p>
        <ul className="space-y-0.5">
          {CATEGORIES.map(cat => (
            <li key={cat}>
              <button
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-[14px] cursor-pointer ${
                  selectedCategory === cat ? 'bg-gray-900 text-white font-bold' : 'text-gray-700 hover:bg-white'
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h1 className="text-[26px] font-black text-gray-900 tracking-tight">{selectedCategory}</h1>
            <p className="mt-1 text-[13px] text-gray-500">총 {ranked.length.toLocaleString()}개 제품</p>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-[13px] font-semibold text-gray-700 cursor-pointer"
            aria-label="정렬"
          >
            {(Object.keys(SORT_LABELS) as SortOption[]).map(key => (
              <option key={key} value={key}>{SORT_LABELS[key]}</option>
            ))}
          </select>
        </div>

        {subCats.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-7">
            {['전체', ...subCats.filter(s => s !== '전체')].map(sub => (
              <button
                key={sub}
                onClick={() => setSubCategory(sub)}
                className={`px-4 h-9 rounded-full text-[13px] font-semibold cursor-pointer ${
                  subCategory === sub ? 'bg-violet-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {ranked.length > 0 ? (
          <>
            <div className="grid grid-cols-4 2xl:grid-cols-5 gap-x-5 gap-y-9">
              {ranked.slice(0, limit).map((item, i) => (
                <PcProductCard
                  key={item.product.id}
                  product={item.product}
                  rating={item.effectiveRating}
                  reviewCount={item.totalReviewCount}
                  rank={sortBy === 'review_rank' && i < 10 ? i + 1 : undefined}
                />
              ))}
            </div>
            {limit < ranked.length && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setLimit(l => l + PAGE_SIZE)}
                  className="px-8 h-12 rounded-full border border-gray-300 bg-white text-[14px] font-bold text-gray-800 hover:border-gray-900 cursor-pointer"
                >
                  더 보기 ({Math.min(limit, ranked.length)} / {ranked.length})
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="py-24 text-center text-[14px] text-gray-400">이 카테고리에 등록된 제품이 아직 없어요.</p>
        )}
      </div>
    </div>
  );
};
