import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, 
  Search, 
  Star, 
  Heart, 
  ExternalLink, 
  Sparkles, 
  Flame, 
  SlidersHorizontal,
  ChevronRight,
  Store
} from 'lucide-react';
import { getAggregatedBrands, getBrandLogo, POPULAR_BRANDS, ProcessedBrand } from '../../utils/brandData';
import { BrandLogo } from './BrandLogo';
import { Product } from '../../types';

type SortOption = 'popular' | 'rating' | 'newest' | 'price_asc' | 'price_desc';

const SORT_LABELS: Record<SortOption, string> = {
  popular: '인기순',
  rating: '평점 높은순',
  newest: '최신 신상품순',
  price_asc: '낮은 가격순',
  price_desc: '높은 가격순',
};

const BRAND_CATEGORIES = ['전체', '패스트푸드', '커피·음료', '과자·스낵', '베이커리·디저트', '라면·간편식'];

export const BrandView: React.FC = () => {
  const {
    products,
    selectedBrand,
    setSelectedBrand,
    openBrandDetail,
    openProductDetail,
    toggleBookmark,
    bookmarkedIds,
    goBack,
  } = useApp();

  const [directorySearchQuery, setDirectorySearchQuery] = useState('');
  const [brandItemSearchQuery, setBrandItemSearchQuery] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('전체');
  const [selectedSubCategory, setSelectedSubCategory] = useState('전체');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // All aggregated brands from actual product catalogue
  const allBrands = useMemo(() => getAggregatedBrands(products), [products]);

  // Current active brand profile if in detail mode
  const currentBrand = useMemo(() => {
    if (!selectedBrand) return null;
    const found = allBrands.find(b => b.name.toLowerCase() === selectedBrand.toLowerCase());
    if (found) return found;

    const brandProducts = products.filter(p => p.brand === selectedBrand);
    return {
      name: selectedBrand,
      logo: getBrandLogo(selectedBrand),
      bannerImage: brandProducts[0]?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&auto=format&fit=crop&q=80',
      category: brandProducts[0]?.category || '브랜드관',
      slogan: `${selectedBrand} 공식 브랜드관`,
      description: `${selectedBrand}에서 판매 중인 대표 메뉴와 신제품을 한 곳에서 모아보세요.`,
      badge: '공식 브랜드',
      isPopular: false,
      productCount: brandProducts.length,
      avgRating: 4.8,
      totalReviews: 120,
      products: brandProducts
    } as ProcessedBrand;
  }, [selectedBrand, allBrands, products]);

  // Filtered brands in Directory mode
  const filteredBrands = useMemo(() => {
    return allBrands.filter(brand => {
      const matchSearch = directorySearchQuery.trim() === '' || 
        brand.name.toLowerCase().includes(directorySearchQuery.toLowerCase()) ||
        (brand.engName && brand.engName.toLowerCase().includes(directorySearchQuery.toLowerCase())) ||
        brand.category.toLowerCase().includes(directorySearchQuery.toLowerCase());

      const matchCategory = selectedCategoryTab === '전체' || 
        brand.category.includes(selectedCategoryTab) ||
        (selectedCategoryTab === '패스트푸드' && (brand.category.includes('패스트푸드') || ['맥도날드', '버거킹', '맘스터치', '롯데리아', 'KFC'].includes(brand.name))) ||
        (selectedCategoryTab === '커피·음료' && (brand.category.includes('음료') || brand.category.includes('커피'))) ||
        (selectedCategoryTab === '과자·스낵' && brand.category.includes('과자')) ||
        (selectedCategoryTab === '베이커리·디저트' && (
          brand.category.includes('빵') || 
          brand.category.includes('디저트') || 
          brand.category.includes('베이커리') ||
          ['파리바게뜨', '파리바게트', '뚜레쥬르', '성심당', '런던베이글뮤지엄', '노티드', '삼송빵집', '태극당'].includes(brand.name)
        )) ||
        (selectedCategoryTab === '라면·간편식' && (brand.category.includes('간편식') || brand.category.includes('식재료')));

      return matchSearch && matchCategory;
    });
  }, [allBrands, directorySearchQuery, selectedCategoryTab]);

  // Brand subcategories (e.g. 버거, 치킨, 사이드, 음료 등)
  const brandSubCategories = useMemo(() => {
    if (!currentBrand) return ['전체'];
    const subSet = new Set<string>();
    currentBrand.products.forEach(p => {
      if (p.subCategory) subSet.add(p.subCategory);
    });
    return ['전체', ...Array.from(subSet)];
  }, [currentBrand]);

  // Brand products filtered & sorted
  const displayedBrandProducts = useMemo(() => {
    if (!currentBrand) return [];
    let list = [...currentBrand.products];

    // In-brand search query filter
    if (brandItemSearchQuery.trim() !== '') {
      const q = brandItemSearchQuery.trim().toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (selectedSubCategory !== '전체') {
      list = list.filter(p => p.subCategory === selectedSubCategory);
    }

    switch (sortBy) {
      case 'popular':
        return list.sort((a, b) => (b.searchInfluxCount || 0) - (a.searchInfluxCount || 0));
      case 'rating':
        return list.sort((a, b) => (b.overallRating || 0) - (a.overallRating || 0));
      case 'newest':
        return list.sort((a, b) => (b.isToday ? 1 : 0) - (a.isToday ? 1 : 0));
      case 'price_asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return list.sort((a, b) => b.price - a.price);
      default:
        return list;
    }
  }, [currentBrand, selectedSubCategory, brandItemSearchQuery, sortBy]);

  // Group products by subCategory for category-divided view
  const categorizedProducts = useMemo(() => {
    if (!currentBrand || selectedSubCategory !== '전체' || brandItemSearchQuery.trim() !== '') {
      return null;
    }

    const groups: { categoryName: string; items: Product[] }[] = [];
    const map = new Map<string, Product[]>();

    displayedBrandProducts.forEach(p => {
      const catKey = p.subCategory || p.category || '기타 메뉴';
      if (!map.has(catKey)) {
        map.set(catKey, []);
      }
      map.get(catKey)!.push(p);
    });

    map.forEach((items, categoryName) => {
      groups.push({ categoryName, items });
    });

    return groups.length > 1 ? groups : null;
  }, [currentBrand, selectedSubCategory, brandItemSearchQuery, displayedBrandProducts]);

  // Related brands when in Detail mode
  const relatedBrands = useMemo(() => {
    if (!currentBrand) return [];
    return allBrands
      .filter(b => b.name !== currentBrand.name && (b.category === currentBrand.category || b.isPopular))
      .slice(0, 5);
  }, [allBrands, currentBrand]);

  // Helper for rendering product card
  const renderProductCard = (p: Product) => {
    const isBookmarked = bookmarkedIds.includes(p.id);
    return (
      <div
        key={p.id}
        onClick={() => openProductDetail(p.id)}
        className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-2xs hover:shadow-md transition-all flex flex-col group cursor-pointer active:scale-[0.98]"
      >
        {/* Thumbnail & Badges */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          
          {p.isToday && (
            <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-2xs">
              NEW
            </span>
          )}

          {p.isHot && !p.isToday && (
            <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-2xs flex items-center gap-0.5">
              <Flame className="w-2.5 h-2.5" /> HOT
            </span>
          )}

          {/* Bookmark Heart Button */}
          <button
            onClick={(e) => toggleBookmark(p.id, e)}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors shadow-2xs"
          >
            <Heart
              className={`w-4 h-4 ${
                isBookmarked ? 'fill-rose-500 text-rose-500' : 'stroke-[2]'
              }`}
            />
          </button>

          {p.subCategory && (
            <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-medium px-2 py-0.5 rounded-full">
              {p.subCategory}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
          <div className="space-y-1">
            <div className="text-[10px] text-gray-400 font-semibold">{p.brand}</div>
            <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#0066FF] transition-colors">
              {p.name}
            </h3>
          </div>

          <div className="pt-1 border-t border-gray-50 flex items-center justify-between">
            <div className="text-xs font-black text-gray-900">
              {p.price.toLocaleString()}원
            </div>
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 stroke-none" />
              <span>{p.overallRating?.toFixed(1) || '4.8'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // VIEW 1: BRAND DETAIL SHOWCASE (특정 브랜드 제품 모아보기)
  // =========================================================================
  if (selectedBrand && currentBrand) {
    return (
      <div className="pb-16 bg-[#F8F9FA] min-h-full">
        {/* 1. Sticky Header */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 py-2.5 shadow-2xs">
          <button
            onClick={goBack}
            className="p-1 -ml-1 text-gray-700 hover:text-gray-900 flex items-center gap-1 font-semibold text-xs"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
            <span>브랜드 목록</span>
          </button>

          <div className="flex items-center gap-2 truncate max-w-[190px]">
            <BrandLogo 
              brandName={currentBrand.name} 
              logoUrl={currentBrand.logo} 
              size="xs" 
              roundedClassName="rounded-md" 
            />
            <span className="text-sm font-bold text-gray-900 truncate">
              {currentBrand.name} 브랜드관
            </span>
          </div>

          <button
            onClick={() => {
              setSelectedBrand(null);
              setBrandItemSearchQuery('');
              setSelectedSubCategory('전체');
            }}
            className="text-xs text-[#0066FF] font-semibold hover:underline"
          >
            전체 브랜드
          </button>
        </div>

        {/* 2. Brand Visual Hero Banner & Profile Card */}
        <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 text-white">
          <div className="h-36 w-full relative overflow-hidden opacity-50">
            <img
              src={currentBrand.bannerImage || currentBrand.logo}
              alt={currentBrand.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          </div>

          <div className="px-4 pb-5 -mt-12 relative z-10">
            <div className="flex items-end justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Clean Brand Logo Container */}
                <BrandLogo
                  brandName={currentBrand.name}
                  logoUrl={currentBrand.logo}
                  size="xl"
                  className="shadow-xl border-2 border-white ring-2 ring-black/10"
                  roundedClassName="rounded-3xl"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    {currentBrand.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-2xs">
                        {currentBrand.badge}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-300 font-medium">
                      {currentBrand.category}
                    </span>
                  </div>
                  <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                    {currentBrand.name}
                    {currentBrand.engName && (
                      <span className="text-xs font-normal text-gray-300 font-sans">
                        ({currentBrand.engName})
                      </span>
                    )}
                  </h1>
                </div>
              </div>

              {currentBrand.officialUrl && (
                <a
                  href={currentBrand.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20 flex items-center gap-1 transition-all shrink-0 active:scale-95"
                >
                  <span>공식몰</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <p className="text-xs text-gray-200 mt-3 font-medium leading-relaxed bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
              {currentBrand.slogan}
            </p>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2 border border-white/5">
                <div className="text-[10px] text-gray-300">등록 상품</div>
                <div className="text-sm font-black text-white">{currentBrand.productCount}개</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2 border border-white/5">
                <div className="text-[10px] text-gray-300">평균 평점</div>
                <div className="text-sm font-black text-amber-300 flex items-center justify-center gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-300 stroke-none" />
                  <span>{currentBrand.avgRating}</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2 border border-white/5">
                <div className="text-[10px] text-gray-300">실시간 리뷰</div>
                <div className="text-sm font-black text-blue-300">
                  {currentBrand.totalReviews > 1000 ? `${(currentBrand.totalReviews / 1000).toFixed(1)}k+` : currentBrand.totalReviews}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. In-Brand Menu Search Bar & Category Tabs */}
        <div className="sticky top-[45px] z-20 bg-white border-b border-gray-100 shadow-2xs space-y-2 py-2 px-4">
          {/* Menu Search Box inside Brand */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={brandItemSearchQuery}
              onChange={(e) => setBrandItemSearchQuery(e.target.value)}
              placeholder={`${currentBrand.name} 메뉴 검색 (예: 빅맥, 와퍼, 감자튀김...)...`}
              className="bg-transparent text-xs text-gray-800 placeholder-gray-400 outline-none w-full font-medium"
            />
            {brandItemSearchQuery && (
              <button 
                onClick={() => setBrandItemSearchQuery('')} 
                className="text-xs text-gray-400 hover:text-gray-600 bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* SubCategory Horizontal Scroll Tabs & Sort */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5 flex-1 mr-2">
              {brandSubCategories.map(subCat => {
                const count = subCat === '전체' 
                  ? currentBrand.products.length 
                  : currentBrand.products.filter(p => p.subCategory === subCat).length;
                return (
                  <button
                    key={subCat}
                    onClick={() => setSelectedSubCategory(subCat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                      selectedSubCategory === subCat
                        ? 'bg-[#0066FF] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{subCat}</span>
                    <span className={`text-[10px] ${selectedSubCategory === subCat ? 'text-blue-100' : 'text-gray-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sort Menu Button */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-1 text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-full hover:bg-gray-100"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>{SORT_LABELS[sortBy]}</span>
              </button>

              {isSortOpen && (
                <div className="absolute right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl py-1 w-32 z-40">
                  {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSortBy(opt);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                        sortBy === opt ? 'bg-blue-50 text-[#0066FF] font-bold' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {SORT_LABELS[opt]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. Brand Products Grid (Categorized Sections or Filtered Grid) */}
        <div className="p-4 space-y-6">
          {displayedBrandProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 space-y-2">
              <Store className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm font-bold text-gray-700">검색 조건에 맞는 메뉴가 없습니다.</p>
              <p className="text-xs text-gray-400">다른 검색어나 카테고리를 선택해보세요.</p>
            </div>
          ) : categorizedProducts ? (
            /* Category-Divided Sections View */
            categorizedProducts.map((group) => (
              <div key={group.categoryName} className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0066FF]" />
                    <span>{group.categoryName}</span>
                    <span className="text-xs text-[#0066FF] font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                      {group.items.length}
                    </span>
                  </h3>
                  <button
                    onClick={() => setSelectedSubCategory(group.categoryName)}
                    className="text-xs text-gray-400 hover:text-[#0066FF] font-medium"
                  >
                    이 카테고리만 보기 →
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {group.items.map(p => renderProductCard(p))}
                </div>
              </div>
            ))
          ) : (
            /* Flat Grid View (when filtered by subcategory or search query) */
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                  <span>{selectedSubCategory !== '전체' ? `${selectedSubCategory} 메뉴` : `${currentBrand.name} 검색 결과`}</span>
                  <span className="text-[#0066FF] font-mono">({displayedBrandProducts.length})</span>
                </h2>
                <span className="text-[11px] text-gray-400">클릭 시 상세정보 확인</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {displayedBrandProducts.map(p => renderProductCard(p))}
              </div>
            </div>
          )}
        </div>

        {/* 5. Related Brands Section */}
        {relatedBrands.length > 0 && (
          <div className="mt-4 px-4 pt-6 pb-2 border-t border-gray-200">
            <h3 className="text-xs font-black text-gray-900 mb-3 flex items-center gap-1.5">
              <span>다른 인기 브랜드관 둘러보기</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </h3>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {relatedBrands.map((b) => (
                <div
                  key={b.name}
                  onClick={() => {
                    setSelectedSubCategory('전체');
                    setBrandItemSearchQuery('');
                    openBrandDetail(b.name);
                  }}
                  className="w-32 shrink-0 bg-white rounded-2xl p-3 border border-gray-100 shadow-2xs hover:shadow-md transition-all cursor-pointer text-center group active:scale-95"
                >
                  <div className="mx-auto mb-2 flex justify-center">
                    <BrandLogo 
                      brandName={b.name} 
                      logoUrl={b.logo} 
                      size="md" 
                      className="group-hover:scale-105 transition-transform" 
                    />
                  </div>
                  <div className="text-xs font-bold text-gray-900 truncate group-hover:text-[#0066FF] transition-colors">
                    {b.name}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {b.productCount}개 상품
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: BRAND DIRECTORY & SHOWCASE (브랜드관 메인 둘러보기)
  // =========================================================================
  return (
    <div className="pb-16 bg-[#F8F9FA] min-h-full">
      {/* 1. Sticky Header with Search */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-2xs">
        <div className="flex items-center gap-2 px-4 py-2.5">
          <button
            onClick={goBack}
            className="p-1 -ml-1 text-gray-700 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-3.5 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={directorySearchQuery}
              onChange={(e) => setDirectorySearchQuery(e.target.value)}
              placeholder="브랜드명 검색 (맥도날드, 버거킹, 스타벅스...)"
              className="bg-transparent text-xs text-gray-800 placeholder-gray-400 outline-none w-full font-medium"
            />
            {directorySearchQuery && (
              <button onClick={() => setDirectorySearchQuery('')} className="text-xs text-gray-400 hover:text-gray-600">
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Brand Category Filter Tabs */}
        <div className="flex overflow-x-auto no-scrollbar px-2 pb-0.5 border-t border-gray-50">
          {BRAND_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryTab(cat)}
              className={`shrink-0 px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap transition-colors ${
                selectedCategoryTab === cat
                  ? 'text-[#0066FF] border-b-2 border-[#0066FF]'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Top Banner: Brand Zone Intro */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 m-4 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-1 max-w-[280px]">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-blue-100">
            🏢 BRAND HUB
          </span>
          <h1 className="text-base font-black tracking-tight text-white leading-snug">
            좋아하는 브랜드의<br />모든 제품을 한눈에 모아보세요
          </h1>
          <p className="text-[11px] text-blue-100 font-medium pt-0.5">
            맥도날드, 버거킹, 스타벅스부터 오리온, 농심까지
          </p>
        </div>
        <div className="absolute -bottom-6 -right-6 text-7xl opacity-20 select-none">
          🍔
        </div>
      </div>

      {/* 3. 🔥 Popular Spotlight Brands (가로 스크롤) */}
      <div className="px-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black text-gray-900 flex items-center gap-1.5">
            <span>🔥 인기 대표 브랜드관</span>
            <span className="text-[10px] font-normal text-gray-400">BEST</span>
          </h2>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {POPULAR_BRANDS.slice(0, 8).map((pb) => {
            const brandProductCount = products.filter(p => p.brand === pb.name).length;
            return (
              <div
                key={pb.id}
                onClick={() => openBrandDetail(pb.name)}
                className="w-44 shrink-0 bg-white rounded-2xl p-3.5 border border-gray-100 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-2 active:scale-98"
              >
                <div className="flex items-center gap-2.5">
                  <BrandLogo 
                    brandName={pb.name} 
                    logoUrl={pb.logo} 
                    size="md" 
                    className="group-hover:scale-105 transition-transform" 
                  />
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-gray-900 truncate group-hover:text-[#0066FF] transition-colors">
                      {pb.name}
                    </div>
                    <div className="text-[10px] text-gray-400 truncate">
                      {pb.category}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-gray-600 font-medium line-clamp-1 bg-gray-50 p-1.5 rounded-lg">
                  {pb.badge || pb.slogan}
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-gray-50">
                  <span className="font-semibold text-gray-700">{brandProductCount > 0 ? `${brandProductCount}개 메뉴` : '공식 메뉴'}</span>
                  <span className="text-[#0066FF] font-bold flex items-center">
                    전용관 <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. All Brands Grid / Showcase */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black text-gray-900 flex items-center gap-1.5">
            <span>전체 브랜드 리스트</span>
            <span className="text-[#0066FF] font-mono">({filteredBrands.length})</span>
          </h2>
          <span className="text-[11px] text-gray-400">브랜드 터치 시 상품 모아보기</span>
        </div>

        {filteredBrands.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 space-y-2">
            <Search className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-sm font-bold text-gray-700">검색된 브랜드가 없습니다.</p>
            <p className="text-xs text-gray-400">다른 검색어나 카테고리를 선택해보세요.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBrands.map((b) => (
              <div
                key={b.name}
                onClick={() => openBrandDetail(b.name)}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs hover:shadow-md transition-all cursor-pointer group active:scale-[0.99] space-y-3"
              >
                {/* Brand Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BrandLogo 
                      brandName={b.name} 
                      logoUrl={b.logo} 
                      size="md" 
                      className="group-hover:scale-105 transition-transform" 
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-black text-gray-900 group-hover:text-[#0066FF] transition-colors">
                          {b.name}
                        </h3>
                        {b.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-[#0066FF] border border-blue-100">
                            {b.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 font-medium">
                        {b.category} · 등록 상품 {b.productCount}개 · 평점 ★ {b.avgRating}
                      </p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-blue-50 group-hover:text-[#0066FF] flex items-center justify-center transition-colors">
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#0066FF]" />
                  </div>
                </div>

                {/* Slogan */}
                <p className="text-xs text-gray-600 font-medium line-clamp-1 bg-gray-50/80 px-3 py-1.5 rounded-xl">
                  {b.slogan}
                </p>

                {/* Mini Products Preview (Max 3 thumbnails) */}
                {b.products.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-50">
                    {b.products.slice(0, 3).map((p) => (
                      <div
                        key={p.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          openProductDetail(p.id);
                        }}
                        className="bg-gray-50 rounded-xl p-1.5 flex items-center gap-2 hover:bg-gray-100 transition-colors"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-8 h-8 rounded-lg object-cover shrink-0"
                        />
                        <div className="overflow-hidden">
                          <div className="text-[10px] font-bold text-gray-800 truncate">{p.name}</div>
                          <div className="text-[9px] text-gray-400">{p.price.toLocaleString()}원</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
