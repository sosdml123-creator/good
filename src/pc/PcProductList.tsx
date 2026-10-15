import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, SUBCATEGORIES_MAP } from '../data/mockProducts';
import { getCategoryReviewRankedProducts } from '../utils/ranking';
import { PcProductCard } from './PcProductCard';
import { PcBreadcrumb, PcContainer, PcEmpty } from './PcUi';

type SortOption = 'review_rank' | 'rating' | 'review_count' | 'newest';

const SORT_LABELS: Record<SortOption, string> = {
  review_rank: '추천순',
  newest: '신상품순',
  rating: '별점 높은순',
  review_count: '리뷰 많은순',
};

const PAGE_SIZE = 40;

/** PC 카테고리 목록: 왼쪽 카테고리 메뉴 + 정렬 바 + 4열 상품 그리드 */
export const PcProductList: React.FC = () => {
  const { products, reviews, selectedCategory, setSelectedCategory, setActiveTab } = useApp();
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
  const subCats = (SUBCATEGORIES_MAP[selectedCategory] || []).filter(s => s !== '전체');

  return (
    <div className="bg-white pb-24">
      <PcContainer className="pt-6">
        <PcBreadcrumb items={[{ label: '홈', onClick: () => setActiveTab('home') }, { label: selectedCategory }]} />
        <h1 className="mt-4 text-[30px] font-bold text-gray-900 tracking-tight text-center">{selectedCategory}</h1>

        {subCats.length > 0 && (
          <div className="mt-7 border border-gray-200 rounded-xl px-6 py-4 flex flex-wrap gap-x-7 gap-y-3">
            {['전체', ...subCats].map(sub => (
              <button
                key={sub}
                onClick={() => setSubCategory(sub)}
                className={`text-[14px] cursor-pointer ${subCategory === sub ? 'font-bold text-violet-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        <div className="mt-10 grid grid-cols-[180px_1fr] gap-12">
          <aside className="self-start">
            <p className="pb-3 mb-2 text-[15px] font-bold text-gray-900 border-b border-gray-900">카테고리</p>
            <ul>
              {CATEGORIES.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left py-2 text-[14px] cursor-pointer ${
                      selectedCategory === cat ? 'font-bold text-violet-700' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="min-w-0">
            <div className="flex items-center justify-between pb-4 mb-7 border-b border-gray-200">
              <p className="text-[14px] text-gray-600">
                총 <span className="font-bold text-gray-900">{ranked.length.toLocaleString()}</span>개
              </p>
              <div className="flex items-center text-[14px]">
                {(Object.keys(SORT_LABELS) as SortOption[]).map((key, i) => (
                  <React.Fragment key={key}>
                    {i > 0 && <span className="mx-3 w-px h-3 bg-gray-300" />}
                    <button
                      onClick={() => setSortBy(key)}
                      className={`cursor-pointer ${sortBy === key ? 'font-bold text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
                    >
                      {SORT_LABELS[key]}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {ranked.length > 0 ? (
              <>
                <div className="grid grid-cols-4 gap-x-5 gap-y-12">
                  {ranked.slice(0, limit).map(item => (
                    <PcProductCard
                      key={item.product.id}
                      product={item.product}
                      rating={item.effectiveRating}
                      reviewCount={item.totalReviewCount}
                    />
                  ))}
                </div>
                {limit < ranked.length && (
                  <div className="mt-16 flex justify-center">
                    <button
                      onClick={() => setLimit(l => l + PAGE_SIZE)}
                      className="w-[320px] h-12 rounded-lg border border-gray-300 text-[14px] font-semibold text-gray-800 hover:border-gray-900 cursor-pointer"
                    >
                      더보기 <span className="text-gray-400 font-normal">({Math.min(limit, ranked.length)} / {ranked.length})</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <PcEmpty message="이 카테고리에 등록된 제품이 아직 없어요." />
            )}
          </div>
        </div>
      </PcContainer>
    </div>
  );
};
