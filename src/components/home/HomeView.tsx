import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, Heart, Sparkles, ChevronRight } from 'lucide-react';
import { ProductCategory, Product } from '../../types';
import { getPopularProducts } from '../../utils/ranking';

export const HomeView: React.FC = () => {
  const { 
    products, 
    reviews, 
    banners,
    battleConfig,
    setActiveTab, 
    setSelectedCategory, 
    openProductDetail, 
    toggleBookmark, 
    bookmarkedIds,
    showToast 
  } = useApp();

  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const [battleChoice, setBattleChoice] = useState<'A' | 'B' | null>(null);
  const [newProductCategoryFilter, setNewProductCategoryFilter] = useState<string>('전체');

  const newProductFilterCategories = ['전체', '과자·스낵', '음료', '빵·디저트', '간편식', '기타'];

  const isProductNew = (p: Product) =>
    Boolean(
      p.isToday ||
      p.isHot ||
      p.category === '신제품' ||
      (p.releaseDate && (p.releaseDate.includes('출시') || p.releaseDate.includes('신상') || p.releaseDate.includes('2026') || p.releaseDate.includes('2025')))
    );

  const allNewProducts = products.filter(isProductNew);
  const baseNewProducts = allNewProducts.length > 0 ? allNewProducts : products.slice(0, 10);

  const displayedNewProducts = baseNewProducts.filter((p) => {
    if (newProductCategoryFilter === '전체') return true;
    if (newProductCategoryFilter === '과자·스낵') return p.category === '과자' || p.subCategory === '스낵';
    if (newProductCategoryFilter === '음료') return p.category === '음료';
    if (newProductCategoryFilter === '빵·디저트') return p.category === '빵·디저트';
    if (newProductCategoryFilter === '간편식') return p.category === '간편식';
    if (newProductCategoryFilter === '기타') return !['과자', '음료', '빵·디저트', '간편식'].includes(p.category);
    return p.category === newProductCategoryFilter;
  });

  const activeBanners = banners.filter(b => b.isActive);
  const currentBanner = activeBanners[currentBannerIdx] || activeBanners[0] || {
    id: 'default',
    image: 'https://images.unsplash.com/photo-1595158364153-23961fa633df?w=600&auto=format&fit=crop&q=80',
    badge: '먹거리 전체 탐색 & 평가',
    title: '신제품부터 산지직송 제철 먹거리까지',
    subtitle: '솔직한 먹거리 품목별 랭킹',
    buttonText: '인기 품목 둘러보기',
    linkCategory: '과일' as ProductCategory,
    isActive: true,
    order: 1,
  };

  const percentA = battleChoice === 'A' ? 62 : battleChoice === 'B' ? 48 : (battleConfig.percentA || 55);
  const percentB = 100 - percentA;

  const quickIcons = [
    { label: '오늘신상', icon: '⚡', color: 'bg-amber-50 text-amber-600', cat: '신제품' as ProductCategory },
    { label: '과자·스낵', icon: '🍪', color: 'bg-orange-50 text-orange-500', cat: '과자' as ProductCategory },
    { label: '간편·밀키트', icon: '🍲', color: 'bg-red-50 text-red-500', cat: '간편식' as ProductCategory },
    { label: '신상배틀', icon: '⚔️', color: 'bg-purple-50 text-purple-600', action: 'compare' },
    { label: '체험단', icon: '🎁', color: 'bg-green-50 text-green-600', action: 'event' },
  ];

  const categoryIcons: { label: string; icon: string; cat: ProductCategory }[] = [
    { label: '과자', icon: '🍪', cat: '과자' },
    { label: '음료', icon: '🥤', cat: '음료' },
    { label: '빵·디저트', icon: '🥐', cat: '빵·디저트' },
    { label: '간편식', icon: '🍲', cat: '간편식' },
    { label: '과일', icon: '🍑', cat: '과일' },
    { label: '식재료', icon: '🥚', cat: '식재료' },
    { label: '고기·수산', icon: '🥩', cat: '고기·수산' },
    { label: '기타', icon: '🍺', cat: '기타' },
  ];

  const handleCategoryClick = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setActiveTab('category');
  };

  const handleBannerButtonClick = () => {
    if (currentBanner.linkCategory) {
      setSelectedCategory(currentBanner.linkCategory);
      setActiveTab('category');
    } else if (currentBanner.linkProductId) {
      openProductDetail(currentBanner.linkProductId);
    } else {
      setSelectedCategory('전체');
      setActiveTab('category');
    }
  };

  return (
    <div className="pb-12 bg-[#F5F5F5] min-h-full">
      
      {/* 1. Main Banner (Dynamic from Admin) */}
      <div className="relative bg-gray-900 overflow-hidden" style={{ height: '220px' }}>
        <img
          src={currentBanner.image}
          alt={currentBanner.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="text-xs font-bold text-white bg-[#0066FF] px-2 py-0.5 rounded shadow-xs">
            {currentBanner.badge}
          </span>
          <div className="text-white font-black text-xl mt-1.5 leading-tight">
            {currentBanner.title}<br />
            <span className="font-semibold text-base opacity-90">{currentBanner.subtitle}</span>
          </div>
          <button
            onClick={handleBannerButtonClick}
            className="mt-2.5 text-xs font-bold text-white bg-white/20 backdrop-blur-xs rounded-full px-3.5 py-1.5 border border-white/30 hover:bg-white/30 transition-colors"
          >
            {currentBanner.buttonText || '자세히 보기'}
          </button>
        </div>
        {/* Dots */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-3 right-4 flex gap-1 z-10">
            {activeBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBannerIdx(i)}
                className={`h-1 rounded-full transition-all ${
                  i === currentBannerIdx ? 'w-4 bg-white' : 'w-1 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. Quick Icon Menus */}
      <div className="bg-white py-4 px-4 border-b border-gray-100">
        <div className="grid grid-cols-5 gap-2">
          {quickIcons.map((m) => (
            <button
              key={m.label}
              onClick={() => {
                if (m.action === 'compare') {
                  setActiveTab('compare');
                } else if (m.action === 'event') {
                  setActiveTab('community');
                  showToast('🎁 신상 무료 체험단 모집 & 이벤트에 참여해보세요!');
                } else if (m.action === 'my') {
                  setActiveTab('my');
                } else {
                  handleCategoryClick(m.cat || '전체');
                }
              }}
              className="flex flex-col items-center gap-1.5 group focus:outline-none"
            >
              <div className={`w-12 h-12 rounded-[14px] ${m.color} flex items-center justify-center text-xl group-hover:scale-105 transition-transform`}>
                {m.icon}
              </div>
              <span className="text-[11px] text-gray-600 font-medium">
                {m.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Extended Food Category Scroll Icons */}
      <div className="bg-white py-3 px-4 border-b border-gray-100">
        <div className="flex gap-4 overflow-x-auto no-scrollbar">
          {categoryIcons.map((c) => (
            <button
              key={c.label}
              onClick={() => handleCategoryClick(c.cat)}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl group-hover:bg-gray-200 transition-colors">
                {c.icon}
              </div>
              <span className="text-[11px] text-gray-600 font-medium">
                {c.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Section: ⚡ 따끈따끈 새로 나온 신제품 구좌 */}
      <div className="bg-white mt-2 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between px-4 mb-2.5">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold text-[#0066FF] bg-blue-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> NEW 신상
              </span>
              <span className="text-[11px] text-gray-400 font-medium">편의점·마트 실시간 입고</span>
            </div>
            <h3 className="text-[16px] font-black text-gray-900 mt-1 flex items-center gap-1.5">
              ⚡ 따끈따끈 새로 나온 신제품
            </h3>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('신제품');
              setActiveTab('category');
            }}
            className="text-[12px] text-gray-400 font-medium hover:text-[#0066FF] flex items-center gap-0.5 transition-colors"
          >
            <span>전체보기</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Subcategory Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-4 mb-3.5">
          {newProductFilterCategories.map((cat) => {
            const isSelected = newProductCategoryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setNewProductCategoryFilter(cat)}
                className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#0066FF] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Horizontal Scroll Cards */}
        {displayedNewProducts.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
            {displayedNewProducts.map((p) => {
              const isBookmarked = bookmarkedIds.includes(p.id);

              return (
                <div
                  key={p.id}
                  onClick={() => openProductDetail(p.id)}
                  className="shrink-0 w-[138px] cursor-pointer group"
                >
                  <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-square shadow-2xs">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Badges */}
                    <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 items-start">
                      {p.isToday ? (
                        <span className="text-[10px] font-black bg-amber-500 text-white px-1.5 py-0.5 rounded-md shadow-xs">
                          ⚡ 오늘신상
                        </span>
                      ) : (
                        <span className="text-[10px] font-black bg-[#0066FF] text-white px-1.5 py-0.5 rounded-md shadow-xs">
                          NEW
                        </span>
                      )}
                      {p.discountRate && p.discountRate > 0 && (
                        <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-md shadow-xs">
                          {p.discountRate}%
                        </span>
                      )}
                    </div>

                    {/* Store or SubCategory Pill */}
                    <div className="absolute bottom-1.5 left-1.5 flex gap-1">
                      {p.stores && p.stores.length > 0 ? (
                        <span className="text-[9px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded backdrop-blur-xs">
                          {p.stores[0]}
                        </span>
                      ) : p.subCategory ? (
                        <span className="text-[9px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded backdrop-blur-xs">
                          {p.subCategory}
                        </span>
                      ) : null}
                    </div>

                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => toggleBookmark(p.id, e)}
                      className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs transition-transform active:scale-90"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isBookmarked ? 'fill-rose-500 text-rose-500' : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="mt-2">
                    <div className="text-[11px] text-gray-400 font-medium truncate">{p.brand}</div>
                    <div className="text-[12px] font-bold text-gray-900 leading-snug line-clamp-2 mt-0.5 group-hover:text-[#0066FF] transition-colors">
                      {p.name}
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mt-1 text-[12px] font-semibold text-gray-800">
                      <Star className="w-3 h-3 fill-[#FFC107] text-[#FFC107]" />
                      <span>{p.overallRating.toFixed(1)}</span>
                      <span className="text-[11px] text-gray-400 font-normal">({p.ratingCount})</span>
                    </div>

                    {/* Price & Discount */}
                    <div className="flex items-center gap-1 mt-0.5">
                      {p.discountRate && p.discountRate > 0 && (
                        <span className="text-[12px] font-bold text-red-500">{p.discountRate}%</span>
                      )}
                      <span className="text-[13px] font-black text-gray-900">{p.price.toLocaleString()}원</span>
                    </div>

                    {/* Release Date info tag */}
                    {p.releaseDate && (
                      <div className="text-[10px] text-[#0066FF] font-medium mt-1 bg-blue-50/80 px-1.5 py-0.5 rounded w-fit">
                        {p.releaseDate}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-400 text-xs bg-gray-50/50 mx-4 rounded-xl">
            선택하신 카테고리의 새로운 신상품을 준비 중입니다 ✨
          </div>
        )}
      </div>

      {/* 5. Section: 요즘 주목받는 먹거리 (가로 스크롤 카드) */}
      <div className="bg-white mt-2 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between px-4 mb-3">
          <span className="text-[15px] font-bold text-gray-900">요즘 주목받는 먹거리</span>
          <button
            onClick={() => setActiveTab('category')}
            className="text-[13px] text-gray-400 font-medium hover:text-gray-700"
          >
            전체보기
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
          {products.map((p) => {
            const isBookmarked = bookmarkedIds.includes(p.id);

            return (
              <div
                key={p.id}
                onClick={() => openProductDetail(p.id)}
                className="shrink-0 w-[130px] cursor-pointer group"
              >
                <div className="relative rounded-xl overflow-hidden bg-gray-100" style={{ height: '130px' }}>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  {p.discountRate && p.discountRate > 0 && (
                    <span className="absolute top-1.5 left-1.5 text-[11px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-md">
                      {p.discountRate}%
                    </span>
                  )}
                  {p.subCategory && (
                    <span className="absolute bottom-1.5 left-1.5 text-[10px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                      {p.subCategory}
                    </span>
                  )}
                  <button
                    onClick={(e) => toggleBookmark(p.id, e)}
                    className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-xs text-sm"
                  >
                    {isBookmarked ? '♥' : '♡'}
                  </button>
                </div>

                <div className="mt-2">
                  <div className="text-[11px] text-gray-400 font-medium">{p.brand}</div>
                  <div className="text-[12px] font-semibold text-gray-900 leading-snug mt-0.5 line-clamp-2">
                    {p.name}
                  </div>
                  
                  {/* Yellow Star Rating */}
                  <div className="flex items-center gap-1 mt-1 text-[12px] font-semibold text-gray-800">
                    <Star className="w-3 h-3 fill-[#FFC107] text-[#FFC107]" />
                    <span>{p.overallRating.toFixed(1)}</span>
                    <span className="text-[11px] text-gray-400 font-normal">({p.ratingCount})</span>
                  </div>

                  <div className="flex items-center gap-1 mt-0.5">
                    {p.discountRate && p.discountRate > 0 && (
                      <span className="text-[12px] font-bold text-red-500">{p.discountRate}%</span>
                    )}
                    <span className="text-[13px] font-bold text-gray-900">{p.price.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Section: 신상 배틀 VS (Dynamic from Admin) */}
      <div className="mt-2 bg-white py-4 px-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-gray-900">{battleConfig.title}</span>
            <span className="text-[11px] font-bold text-white bg-[#0066FF] px-2 py-0.5 rounded-full">VS</span>
          </div>
          <button
            onClick={() => setActiveTab('compare')}
            className="text-[13px] text-gray-400 font-medium hover:text-[#0066FF]"
          >
            비교표 보기
          </button>
        </div>

        {battleConfig.subtitle && (
          <p className="text-[12px] text-gray-500 -mt-1.5 mb-3">{battleConfig.subtitle}</p>
        )}

        {(() => {
          const prodA = products.find(p => p.id === battleConfig.productAId) || products[0];
          const prodB = products.find(p => p.id === battleConfig.productBId) || products[1] || products[0];

          return (
            <div className="flex items-center gap-3">
              {/* Fighter A */}
              <div
                onClick={() => {
                  setBattleChoice('A');
                  showToast('투표해주셔서 감사해요! 결과는 주말에 공개됩니다 🎉', 'success');
                }}
                className={`flex-1 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                  battleChoice === 'A' ? 'border-[#0066FF] bg-blue-50/20' : 'border-gray-200'
                }`}
              >
                <img src={prodA.image} alt={prodA.name} className="w-full aspect-square object-cover" />
                <div className="p-2.5">
                  <div className="text-[11px] text-[#0066FF] font-bold">{battleConfig.labelA || `${prodA.category} 1위`}</div>
                  <div className="text-[12px] font-semibold text-gray-900 line-clamp-1">{prodA.name}</div>
                  <div className="mt-1.5 flex items-center gap-1">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#0066FF] h-full rounded-full transition-all" style={{ width: `${percentA}%` }}></div>
                    </div>
                    <span className="text-[11px] font-bold text-[#0066FF]">{percentA}%</span>
                  </div>
                </div>
              </div>

              <div className="text-gray-300 font-black text-xl">VS</div>

              {/* Fighter B */}
              <div
                onClick={() => {
                  setBattleChoice('B');
                  showToast('투표해주셔서 감사해요! 결과는 주말에 공개됩니다 🎉', 'success');
                }}
                className={`flex-1 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                  battleChoice === 'B' ? 'border-orange-500 bg-orange-50/20' : 'border-gray-200'
                }`}
              >
                <img src={prodB.image} alt={prodB.name} className="w-full aspect-square object-cover" />
                <div className="p-2.5">
                  <div className="text-[11px] text-orange-500 font-bold">{battleConfig.labelB || `${prodB.category} 1위`}</div>
                  <div className="text-[12px] font-semibold text-gray-900 line-clamp-1">{prodB.name}</div>
                  <div className="mt-1.5 flex items-center gap-1">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-orange-400 h-full rounded-full transition-all" style={{ width: `${percentB}%` }}></div>
                    </div>
                    <span className="text-[11px] font-bold text-orange-400">{percentB}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        <p className="text-center text-[12px] text-gray-400 mt-2.5">
          {battleChoice ? '투표해주셔서 감사해요! 결과는 주말에 공개됩니다 🎉' : '눌러서 투표해보세요'}
        </p>
      </div>

      {/* 7. Section: 🔥 실시간 품목별 인기 랭킹 */}
      <div className="mt-2 bg-white py-4 px-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[15px] font-bold text-gray-900">🔥 실시간 인기 품목 랭킹</span>
          <button onClick={() => setActiveTab('category')} className="text-[13px] text-gray-400">전체보기</button>
        </div>

        <div className="space-y-4">
          {getPopularProducts(products, 5).map((p, i) => (
            <div
              key={p.id}
              onClick={() => openProductDetail(p.id)}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1 rounded-xl transition-colors"
            >
              <span className={`w-5 text-[13px] font-black ${i === 0 ? 'text-[#0066FF]' : i === 1 ? 'text-gray-700' : 'text-gray-400'}`}>
                {i + 1}
              </span>
              <img src={p.image} alt={p.name} className="w-14 h-14 rounded-xl object-cover bg-gray-100 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-gray-400">{p.brand} {p.subCategory ? `· ${p.subCategory}` : ''}</div>
                <div className="text-[13px] font-semibold text-gray-900 truncate">{p.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-0.5 text-[11px] font-semibold text-gray-700">
                    <Star className="w-3 h-3 fill-[#FFC107] text-[#FFC107]" />
                    <span>{p.overallRating.toFixed(1)}</span>
                  </div>
                  <span className="text-[11px] text-gray-400">({p.ratingCount})</span>
                </div>
              </div>

              <button
                onClick={(e) => toggleBookmark(p.id, e)}
                className="p-1 text-gray-300 hover:text-rose-500"
              >
                <Heart className={`w-4 h-4 ${bookmarkedIds.includes(p.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Section: 이번 주 인기 리뷰 */}
      <div className="mt-2 bg-white py-4 px-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[15px] font-bold text-gray-900">이번 주 실시간 솔직 후기</span>
          <button onClick={() => setActiveTab('category')} className="text-[13px] text-gray-400">더보기</button>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.slice(0, 2).map((r) => (
              <div
                key={r.id}
                onClick={() => openProductDetail(r.productId)}
                className="cursor-pointer space-y-2 pb-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <img src={r.userAvatar} alt={r.userName} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-semibold text-gray-900">{r.userName}</span>
                      <span className="text-[10px] text-white bg-gray-400 px-1.5 py-0.2 rounded font-semibold">{r.userLevel}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-[#FFC107] text-[#FFC107]" />
                        <span className="font-semibold text-gray-700">{r.rating.toFixed(1)}</span>
                      </div>
                      <span>· {r.createdAt}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-semibold text-[#0066FF] bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                  {r.productName}
                </span>

                <p className="text-[13px] text-gray-700 leading-relaxed">
                  {r.content}
                </p>

                {r.images && r.images.length > 0 && (
                  <img src={r.images[0]} alt="review" className="mt-2 w-full rounded-xl object-cover" style={{ height: '160px' }} />
                )}

                <div className="flex items-center gap-4 mt-2 text-[12px] text-gray-400">
                  <span>♡ 도움돼요 {r.likes}</span>
                  <span>💬 댓글 {r.commentsCount || 0}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-2xl p-4">
            <p className="text-[13px] font-semibold text-gray-700">아직 등록된 후기가 없습니다 ✨</p>
            <p className="text-[11px] text-gray-400 mt-1">맛있는 신상을 맛보고 첫 번째 솔직 후기를 남겨보세요!</p>
            <button
              onClick={() => setActiveTab('write')}
              className="mt-3 px-4 py-1.5 bg-[#0066FF] text-white text-xs font-bold rounded-full shadow-xs hover:bg-blue-600 transition-colors"
            >
              리뷰 작성하러 가기
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
