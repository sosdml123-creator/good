import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, 
  Search, 
  Star, 
  Heart, 
  Sparkles, 
  Flame, 
  SlidersHorizontal,
  ChevronRight,
  Store,
  Bell,
  User,
  Gift,
  Check
} from 'lucide-react';
import { getAggregatedBrands, getBrandLogo, ProcessedBrand } from '../../utils/brandData';
import { BrandLogo } from './BrandLogo';
import { Product } from '../../types';
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll';

type SortOption = 'popular' | 'rating' | 'newest' | 'price_asc' | 'price_desc';

const SORT_LABELS: Record<SortOption, string> = {
  popular: '인기순',
  rating: '평점 높은순',
  newest: '최신 신상품순',
  price_asc: '낮은 가격순',
  price_desc: '높은 가격순',
};

const BRAND_CATEGORIES = ['전체', '편의점', '패스트푸드', '커피·음료', '과자·스낵', '베이커리·디저트', '라면·간편식'];

export const BrandView: React.FC = () => {
  const {
    products,
    brands,
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
  const brandCategoryScroll = useHorizontalScroll<HTMLDivElement>();
  const [selectedSubCategory, setSelectedSubCategory] = useState('전체');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // All aggregated brands from actual product catalogue + custom configured brands
  const allBrands = useMemo(() => getAggregatedBrands(products, brands), [products, brands]);

  // Current active brand profile if in detail mode
  const currentBrand = useMemo(() => {
    if (!selectedBrand) return null;
    const found = allBrands.find(b => b.name.toLowerCase() === selectedBrand.toLowerCase());
    if (found) return found;

    const brandProducts = products.filter(p => p.brand === selectedBrand);
    return {
      name: selectedBrand,
      logo: getBrandLogo(selectedBrand),
      bannerImage: brandProducts[0]?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80',
      category: brandProducts[0]?.category || '공식 브랜드',
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
        (selectedCategoryTab === '편의점' && (
          brand.category.includes('편의점') || 
          ['CU', 'GS25', '세븐일레븐', '이마트24'].includes(brand.name)
        )) ||
        (selectedCategoryTab === '패스트푸드' && (brand.category.includes('패스트푸드') || ['맥도날드', '버거킹', '맘스터치', '롯데리아', 'KFC'].includes(brand.name))) ||
        (selectedCategoryTab === '커피·음료' && (brand.category.includes('음료') || brand.category.includes('커피'))) ||
        (selectedCategoryTab === '과자·스낵' && (brand.category.includes('과자') || brand.category.includes('스낵') || brand.name === '노브랜드')) ||
        (selectedCategoryTab === '베이커리·디저트' && (
          brand.category.includes('빵') || 
          brand.category.includes('디저트') || 
          brand.category.includes('베이커리') ||
          ['파리바게뜨', '파리바게트', '뚜레쥬르', '성심당', '런던베이글뮤지엄', '노티드', '삼송빵집', '태극당', '배스킨라빈스', '베스킨라빈스'].includes(brand.name)
        )) ||
        (selectedCategoryTab === '라면·간편식' && (brand.category.includes('간편식') || brand.category.includes('식재료') || brand.name === '노브랜드'));

      return matchSearch && matchCategory;
    });
  }, [allBrands, directorySearchQuery, selectedCategoryTab]);

  // Brand subcategories (e.g. 냉동/간편식, 스낵/과자, 식품, 음료/차 등)
  const brandSubCategories = useMemo(() => {
    if (!currentBrand) return ['전체'];
    const subSet = new Set<string>();
    currentBrand.products.forEach(p => {
      if (p.subCategory) subSet.add(p.subCategory);
      else if (p.category) subSet.add(p.category);
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
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (selectedSubCategory !== '전체') {
      list = list.filter(p => p.subCategory === selectedSubCategory || p.category === selectedSubCategory);
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

  // Count new product entries for stats card
  const newProductCount = useMemo(() => {
    if (!currentBrand) return 0;
    return currentBrand.products.filter(p => p.isToday || p.isHot).length;
  }, [currentBrand]);

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
            <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-gray-700 transition-colors">
              {p.name}
            </h3>
          </div>

          <div className="pt-1 border-t border-gray-50 flex items-center justify-between">
            <div className="text-xs font-black text-gray-900">
              {p.price.toLocaleString()}원
            </div>
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 stroke-none" />
              <span>{p.overallRating?.toFixed(1) || '4.5'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // VIEW 1: BRAND DETAIL SHOWCASE (특정 브랜드 전용관 - 깔끔한 신규 UI)
  // =========================================================================
  if (selectedBrand && currentBrand) {
    return (
      <div className="pb-24 bg-[#F8F9FA] min-h-full">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
            <Bell className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. Top Navbar Header */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 py-2.5 shadow-2xs">
          <button
            onClick={goBack}
            className="p-1 -ml-1 text-gray-700 hover:text-gray-900 flex items-center gap-1 font-bold text-xs active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
            <span>뒤로가기</span>
          </button>

          <div className="flex items-center gap-2 truncate max-w-[190px]">
            <BrandLogo 
              brandName={currentBrand.name} 
              logoUrl={currentBrand.logo} 
              size="xs" 
              roundedClassName="rounded-md" 
            />
            <span className="text-sm font-black text-gray-900 truncate">
              {currentBrand.name}
            </span>
          </div>

          <button
            onClick={() => {
              setSelectedBrand(null);
              setBrandItemSearchQuery('');
              setSelectedSubCategory('전체');
            }}
            className="text-xs text-gray-500 font-semibold hover:text-gray-900"
          >
            전체 브랜드
          </button>
        </div>

        {/* 2. Hero Header Banner Section */}
        <div className="relative bg-gray-900 text-white overflow-hidden">
          {/* Cover Background Image */}
          <div className="h-44 sm:h-52 w-full relative overflow-hidden">
            <img
              src={currentBrand.bannerImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80'}
              alt={currentBrand.name}
              className="w-full h-full object-cover opacity-75 transform scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
            
            {/* Top Right "알림받기" Glassmorphism Button */}
            <button
              onClick={() => {
                const nextState = !isAlarmActive;
                setIsAlarmActive(nextState);
                showToast(nextState ? `${currentBrand.name} 신상품 알림이 설정되었습니다.` : `${currentBrand.name} 알림이 해제되었습니다.`);
              }}
              className={`absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-md ${
                isAlarmActive
                  ? 'bg-amber-500 text-white border border-amber-400'
                  : 'bg-black/30 border border-white/30 text-white hover:bg-black/50'
              }`}
            >
              <Bell className={`w-3.5 h-3.5 ${isAlarmActive ? 'fill-white' : ''}`} />
              <span>{isAlarmActive ? '알림 설정됨' : '알림받기'}</span>
            </button>
          </div>

          {/* Overlay Brand Info (Logo, Badges, Name, Slogan) */}
          <div className="px-4 pb-8 -mt-20 relative z-10 flex items-end gap-3.5">
            {/* Large Logo Container */}
            <div className="bg-white p-1 rounded-2xl shadow-xl border border-white/20 shrink-0">
              <BrandLogo
                brandName={currentBrand.name}
                logoUrl={currentBrand.logo}
                size="xl"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl"
                showBorder={false}
              />
            </div>

            {/* Brand Title and Meta */}
            <div className="flex-1 space-y-1 pb-0.5">
              {/* Badges */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-gray-950 shadow-2xs">
                  {currentBrand.badge || '국민가성비 1등 PB'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800/80 text-gray-200 border border-white/10 backdrop-blur-xs">
                  공식브랜드
                </span>
              </div>

              {/* Brand Title */}
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-1.5 drop-shadow-md">
                <span>{currentBrand.name}</span>
                {currentBrand.engName && (
                  <span className="text-xs font-normal text-gray-300 font-sans">
                    ({currentBrand.engName})
                  </span>
                )}
              </h1>

              {/* Slogan */}
              <p className="text-xs text-gray-200 font-medium line-clamp-1 drop-shadow-sm leading-tight">
                {currentBrand.slogan}
              </p>
            </div>
          </div>
        </div>

        {/* 3. White Floating Summary Card (Stats Row) */}
        <div className="px-4 -mt-5 relative z-20">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-3.5 grid grid-cols-3 divide-x divide-gray-100 text-center">
            {/* Col 1: 등록 상품 */}
            <div className="px-1 space-y-0.5">
              <div className="text-[11px] sm:text-xs text-gray-500 font-semibold flex items-center justify-center gap-1">
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span>등록 상품</span>
              </div>
              <div className="text-base sm:text-lg font-black text-gray-900">
                {currentBrand.productCount}개
              </div>
            </div>

            {/* Col 2: 평균 평점 */}
            <div className="px-1 space-y-0.5">
              <div className="text-[11px] sm:text-xs text-gray-500 font-semibold flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>평균 평점</span>
              </div>
              <div className="text-base sm:text-lg font-black text-gray-900 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{currentBrand.avgRating}</span>
              </div>
            </div>

            {/* Col 3: 신규 입점 */}
            <div className="px-1 space-y-0.5">
              <div className="text-[11px] sm:text-xs text-gray-500 font-semibold flex items-center justify-center gap-1">
                <Gift className="w-3.5 h-3.5 text-slate-500" />
                <span>신규 입점</span>
              </div>
              <div className="text-base sm:text-lg font-black text-gray-900">
                {newProductCount}개
              </div>
            </div>
          </div>
        </div>

        {/* 4. In-Brand Product Search Input */}
        <div className="px-4 mt-4">
          <div className="bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900 rounded-full px-4 py-2.5 flex items-center gap-2.5 transition-all shadow-2xs border border-transparent focus-within:border-slate-900">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={brandItemSearchQuery}
              onChange={(e) => setBrandItemSearchQuery(e.target.value)}
              placeholder="브랜드 내 상품 검색하기"
              className="bg-transparent text-xs sm:text-sm text-gray-900 placeholder-gray-400 outline-none w-full font-medium"
            />
            {brandItemSearchQuery && (
              <button 
                onClick={() => setBrandItemSearchQuery('')} 
                className="text-xs text-gray-400 hover:text-gray-600 bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center shrink-0"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 5. SubCategory Filter Pills & Filter Button Row */}
        <div className="px-4 mt-3 flex items-center justify-between gap-2">
          {/* Subcategory Pills Row */}
          <div className="flex-1 flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {brandSubCategories.map(subCat => {
              const count = subCat === '전체' 
                ? currentBrand.products.length 
                : currentBrand.products.filter(p => p.subCategory === subCat || p.category === subCat).length;
              const isActive = selectedSubCategory === subCat;

              return (
                <button
                  key={subCat}
                  onClick={() => setSelectedSubCategory(subCat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{subCat}</span>
                  <span className={`text-[11px] ${isActive ? 'text-gray-300 font-mono' : 'text-gray-400 font-mono'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filter / Sort Button */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="bg-white border border-gray-200 text-gray-800 font-bold px-3 py-1.5 rounded-full text-xs shrink-0 flex items-center gap-1 shadow-2xs hover:bg-gray-50 active:scale-95 transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-700" />
              <span>필터</span>
            </button>

            {/* Sort Options Modal Dropdown */}
            {isSortOpen && (
              <div className="absolute right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-2xl py-1.5 w-36 z-40 animate-in fade-in duration-150">
                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 border-b border-gray-100 mb-1">
                  정렬 기준 선택
                </div>
                {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSortBy(opt);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                      sortBy === opt ? 'bg-slate-900 text-white font-bold' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{SORT_LABELS[opt]}</span>
                    {sortBy === opt && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 6. Brand Products Grid */}
        <div className="p-4">
          {displayedBrandProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 space-y-2 my-4">
              <Store className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm font-bold text-gray-700">검색 조건에 맞는 메뉴가 없습니다.</p>
              <p className="text-xs text-gray-400">다른 검색어나 카테고리를 선택해보세요.</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                  <span>{selectedSubCategory !== '전체' ? `${selectedSubCategory} 메뉴` : `${currentBrand.name} 전체 상품`}</span>
                  <span className="text-gray-500 font-mono">({displayedBrandProducts.length})</span>
                </h2>
                <span className="text-[11px] text-gray-400 font-medium">정렬: {SORT_LABELS[sortBy]}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {displayedBrandProducts.map(p => renderProductCard(p))}
              </div>
            </div>
          )}
        </div>

        {/* 7. Related Brands Section */}
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
                  <div className="text-xs font-bold text-gray-900 truncate group-hover:text-gray-700 transition-colors">
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
    <div className="pb-20 bg-[#F8F9FA] min-h-full">
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
        <div className="relative group/bcat border-t border-gray-50 bg-white">
          {brandCategoryScroll.canScrollLeft && (
            <button
              type="button"
              onClick={() => brandCategoryScroll.scrollToLeft(140)}
              className="absolute left-0 top-0 bottom-0 z-10 w-7 flex items-center justify-center bg-gradient-to-r from-white via-white/95 to-transparent text-gray-500 hover:text-gray-900"
              aria-label="이전 카테고리"
            >
              <ChevronLeft className="w-4 h-4 drop-shadow-xs" />
            </button>
          )}

          <div
            ref={brandCategoryScroll.scrollRef}
            className="flex overflow-x-auto no-scrollbar px-2 pb-0.5 scroll-smooth cursor-grab active:cursor-grabbing select-none"
          >
            {BRAND_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={(e) => {
                  setSelectedCategoryTab(cat);
                  e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }}
                className={`shrink-0 px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap transition-colors ${
                  selectedCategoryTab === cat
                    ? 'text-gray-900 border-b-2 border-gray-900 font-bold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {brandCategoryScroll.canScrollRight && (
            <button
              type="button"
              onClick={() => brandCategoryScroll.scrollToRight(140)}
              className="absolute right-0 top-0 bottom-0 z-10 w-7 flex items-center justify-center bg-gradient-to-l from-white via-white/95 to-transparent text-gray-500 hover:text-gray-900"
              aria-label="다음 카테고리"
            >
              <ChevronRight className="w-4 h-4 drop-shadow-xs" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Top Banner: Brand Zone Intro */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 text-white p-5 m-4 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-1 max-w-[280px]">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-gray-200">
            🏢 BRAND HUB
          </span>
          <h1 className="text-base font-black tracking-tight text-white leading-snug">
            좋아하는 브랜드의<br />모든 제품을 한눈에 모아보세요
          </h1>
          <p className="text-[11px] text-gray-300 font-medium pt-0.5">
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
          {(brands.filter(b => b.isPopular).length > 0 ? brands.filter(b => b.isPopular) : brands).slice(0, 10).map((pb) => {
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
                    <div className="text-xs font-bold text-gray-900 truncate group-hover:text-gray-700 transition-colors">
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
                  <span className="text-gray-700 font-bold flex items-center">
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
            <span className="text-gray-700 font-mono">({filteredBrands.length})</span>
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
                        <h3 className="text-sm font-black text-gray-900 group-hover:text-gray-700 transition-colors">
                          {b.name}
                        </h3>
                        {b.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-700 border border-gray-200">
                            {b.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 font-medium">
                        {b.category} · 등록 상품 {b.productCount}개 · 평점 ★ {b.avgRating}
                      </p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 group-hover:text-gray-900 flex items-center justify-center transition-colors">
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900" />
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
