import React, { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getPopularProducts } from '../utils/ranking';
import { getAggregatedBrands } from '../utils/brandData';
import { BrandLogo } from '../components/brand/BrandLogo';
import { PcProductCard } from './PcProductCard';
import { PcBreadcrumb, PcContainer, PcEmpty, PcTextTabs } from './PcUi';

const RANKING_CATEGORIES = ['전체', '과자', '음료', '빵·디저트', '간편식', '패스트푸드', '아이스크림', '과일', '기타'];

/** PC 랭킹: 카테고리 탭 + 5열 순위 그리드 */
export const PcRanking: React.FC = () => {
  const { products, reviews, setActiveTab } = useApp();
  const [category, setCategory] = useState('전체');

  const ranked = useMemo(() => {
    const pool = category === '전체' ? products : products.filter(p => p.category === category);
    return getPopularProducts(pool, 50, reviews);
  }, [products, reviews, category]);

  return (
    <div className="bg-white pb-24">
      <PcContainer className="pt-6">
        <PcBreadcrumb items={[{ label: '홈', onClick: () => setActiveTab('home') }, { label: '랭킹' }]} />
        <h1 className="mt-4 text-[30px] font-bold text-gray-900 tracking-tight text-center">신상 랭킹</h1>
        <p className="mt-2 text-[14px] text-gray-500 text-center">소비자 리뷰와 관심도를 실시간으로 집계한 순위예요</p>
        <div className="mt-8 mb-10 flex justify-center">
          <PcTextTabs items={RANKING_CATEGORIES} value={category} onChange={setCategory} />
        </div>
        {ranked.length > 0 ? (
          <div className="grid grid-cols-5 gap-x-5 gap-y-12">
            {ranked.map((p, i) => <PcProductCard key={p.id} product={p} rank={i + 1} />)}
          </div>
        ) : (
          <PcEmpty message="이 카테고리에 순위가 집계된 제품이 아직 없어요." />
        )}
      </PcContainer>
    </div>
  );
};

/** PC 검색 결과: 헤더 검색창에서 넘어온 검색어 기준 */
export const PcSearch: React.FC = () => {
  const { products, searchQuery, setSearchQuery, recentSearches, addRecentSearch, removeRecentSearch, setActiveTab } = useApp();
  const [input, setInput] = useState(searchQuery);

  useEffect(() => {
    setInput(searchQuery);
  }, [searchQuery]);

  const query = searchQuery.trim().toLowerCase();
  const results = useMemo(() => {
    if (!query) return [];
    return products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(query)) ||
      (p.ingredients && p.ingredients.toLowerCase().includes(query)) ||
      (p.description && p.description.toLowerCase().includes(query))
    );
  }, [products, query]);

  const run = (q: string) => {
    const v = q.trim();
    if (!v) return;
    addRecentSearch(v);
    setSearchQuery(v);
  };

  return (
    <div className="bg-white pb-24">
      <PcContainer className="pt-6">
        <PcBreadcrumb items={[{ label: '홈', onClick: () => setActiveTab('home') }, { label: '검색' }]} />
        <form
          onSubmit={(e) => { e.preventDefault(); run(input); }}
          className="mt-8 mx-auto max-w-[560px] h-14 rounded-full border-2 border-gray-900 flex items-center px-5 gap-3"
        >
          <Search className="w-5 h-5 text-gray-900 shrink-0" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="상품명, 브랜드, 카테고리로 검색"
            className="flex-1 min-w-0 text-[16px] outline-none bg-transparent"
            autoFocus
          />
        </form>

        {recentSearches.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {recentSearches.slice(0, 10).map(k => (
              <span key={k} className="inline-flex items-center gap-1 pl-3.5 pr-2 h-8 rounded-full border border-gray-200 text-[13px] text-gray-700">
                <button onClick={() => run(k)} className="cursor-pointer">{k}</button>
                <button onClick={() => removeRecentSearch(k)} aria-label={`${k} 삭제`} className="p-0.5 text-gray-400 hover:text-gray-700 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {query ? (
          <>
            <p className="mt-12 pb-4 mb-8 border-b border-gray-200 text-[16px] text-gray-700">
              <span className="font-bold text-gray-900">'{searchQuery}'</span> 검색 결과 <span className="font-bold text-gray-900">{results.length.toLocaleString()}</span>개
            </p>
            {results.length > 0 ? (
              <div className="grid grid-cols-5 gap-x-5 gap-y-12">
                {results.slice(0, 100).map(p => <PcProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <PcEmpty message="검색 결과가 없어요. 다른 검색어로 찾아보세요." />
            )}
          </>
        ) : (
          <PcEmpty message="찾고 싶은 신상을 검색해 보세요." />
        )}
      </PcContainer>
    </div>
  );
};

/** PC 브랜드: 선택 전에는 전체 브랜드 목록, 선택 후에는 브랜드관 */
export const PcBrand: React.FC = () => {
  const { products, brands, selectedBrand, setSelectedBrand, openBrandDetail, setActiveTab } = useApp();
  const allBrands = useMemo(
    () => getAggregatedBrands(products, brands).filter(b => b.productCount > 0).sort((a, b) => b.productCount - a.productCount),
    [products, brands]
  );
  const [sort, setSort] = useState('신상품순');
  const [limit, setLimit] = useState(40);

  useEffect(() => {
    setLimit(40);
  }, [selectedBrand, sort]);

  if (!selectedBrand) {
    return (
      <div className="bg-white pb-24">
        <PcContainer className="pt-6">
          <PcBreadcrumb items={[{ label: '홈', onClick: () => setActiveTab('home') }, { label: '브랜드' }]} />
          <h1 className="mt-4 text-[30px] font-bold text-gray-900 tracking-tight text-center">브랜드관</h1>
          <p className="mt-2 text-[14px] text-gray-500 text-center">{allBrands.length}개 브랜드의 제품을 모아봤어요</p>
          <div className="mt-12 grid grid-cols-6 gap-x-5 gap-y-10">
            {allBrands.map(b => (
              <button key={b.name} onClick={() => openBrandDetail(b.name)} className="group flex flex-col items-center gap-3 cursor-pointer">
                <span className="w-28 h-28 rounded-full border border-gray-200 bg-white flex items-center justify-center overflow-hidden transition-colors group-hover:border-gray-900">
                  <BrandLogo brandName={b.name} logoUrl={b.logo} size="xl" />
                </span>
                <span className="text-center">
                  <span className="block text-[15px] font-semibold text-gray-900">{b.name}</span>
                  <span className="block text-[12px] text-gray-400">제품 {b.productCount}개</span>
                </span>
              </button>
            ))}
          </div>
        </PcContainer>
      </div>
    );
  }

  const info = allBrands.find(b => b.name.toLowerCase() === selectedBrand.toLowerCase());
  const brandProducts = products.filter(p => p.brand === selectedBrand);
  const sorted = [...brandProducts].sort((a, b) => {
    if (sort === '별점 높은순') return b.overallRating - a.overallRating;
    if (sort === '리뷰 많은순') return b.ratingCount - a.ratingCount;
    return (b.releaseDate || '').localeCompare(a.releaseDate || '');
  });

  return (
    <div className="bg-white pb-24">
      <PcContainer className="pt-6">
        <PcBreadcrumb
          items={[
            { label: '홈', onClick: () => setActiveTab('home') },
            { label: '브랜드', onClick: () => setSelectedBrand(null) },
            { label: selectedBrand },
          ]}
        />
        <div className="mt-6 rounded-2xl bg-[#F8F8FA] px-10 py-9 flex items-center gap-7">
          <span className="w-24 h-24 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
            <BrandLogo brandName={selectedBrand} logoUrl={info?.logo} size="xl" />
          </span>
          <div className="min-w-0">
            <h1 className="text-[28px] font-bold text-gray-900">{selectedBrand}</h1>
            {info?.slogan && <p className="mt-1 text-[15px] text-gray-600">{info.slogan}</p>}
            <p className="mt-2 text-[13px] text-gray-400">
              제품 {brandProducts.length}개{info && info.totalReviews > 0 ? ` · 리뷰 ${info.totalReviews.toLocaleString()}개 · 평균 ★${info.avgRating.toFixed(1)}` : ''}
            </p>
          </div>
        </div>

        <div className="mt-10 mb-8 flex items-center justify-between">
          <p className="text-[14px] text-gray-600">총 <span className="font-bold text-gray-900">{brandProducts.length}</span>개</p>
          <PcTextTabs items={['신상품순', '별점 높은순', '리뷰 많은순']} value={sort} onChange={setSort} />
        </div>
        {sorted.length > 0 ? (
          <div className="grid grid-cols-5 gap-x-5 gap-y-12">
            {sorted.slice(0, limit).map(p => <PcProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <PcEmpty message="이 브랜드에 등록된 제품이 아직 없어요." />
        )}
        {limit < sorted.length && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={() => setLimit(l => l + 40)}
              className="w-[320px] h-12 rounded-lg border border-gray-300 text-[14px] font-semibold text-gray-800 hover:border-gray-900 cursor-pointer"
            >
              더보기 <span className="text-gray-400 font-normal">({limit} / {sorted.length})</span>
            </button>
          </div>
        )}
      </PcContainer>
    </div>
  );
};

