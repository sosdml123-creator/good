import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, Heart, Sparkles, ChevronRight, ChevronLeft, Search, Flame, Calendar as CalendarIcon, Bell, BellRing } from 'lucide-react';
import { ProductCategory, Product, BannerItem } from '../../types';
import { 
  getPopularProducts, 
  getSearchTrendingProducts, 
  getSearchInfluxCount, 
  formatSearchCount 
} from '../../utils/ranking';
import { ILLUSTRATION_FRUIT_BANNER } from '../../utils/productIllustrations';
import { POPULAR_BRANDS } from '../../utils/brandData';
import { BrandLogo } from '../brand/BrandLogo';

export const HomeView: React.FC = () => {
  const { 
    products, 
    reviews, 
    banners,
    battleConfig,
    battleChoice,
    voteBattle,
    events,
    calendarItems,
    calendarReminders,
    toggleCalendarReminder,
    recipes,
    openRecipeDetail,
    setActiveTab, 
    setSelectedCategory, 
    openBrandDetail, 
    openProductDetail, 
    openEventDetail,
    toggleBookmark, 
    bookmarkedIds
  } = useApp();

  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const [newProductCategoryFilter, setNewProductCategoryFilter] = useState<string>('전체');
  const [isPaused, setIsPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartX = useRef<number | null>(null);
  const dragStartY = useRef<number | null>(null);
  const isHorizontalSwipe = useRef<boolean | null>(null);
  const hasMovedSignificantly = useRef(false);

  const newProductFilterCategories = ['전체', '과자·스낵', '음료', '빵·디저트', '간편식', '패스트푸드', '기타'];

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
    if (newProductCategoryFilter === '패스트푸드') return p.category === '패스트푸드';
    if (newProductCategoryFilter === '기타') return !['과자', '음료', '빵·디저트', '간편식', '패스트푸드'].includes(p.category);
    return p.category === newProductCategoryFilter;
  });

  const activeBanners = banners.filter(b => b.isActive);
  const displayBanners = activeBanners.length > 0 ? activeBanners : [{
    id: 'default',
    image: ILLUSTRATION_FRUIT_BANNER,
    badge: '먹거리 전체 탐색 & 평가',
    title: '신제품부터 산지직송 제철 먹거리까지',
    subtitle: '솔직한 먹거리 품목별 랭킹',
    buttonText: '인기 품목 둘러보기',
    linkCategory: '과일' as ProductCategory,
    isActive: true,
    order: 1,
  }];
  const totalBanners = displayBanners.length;

  // Safe current index clamp
  useEffect(() => {
    if (currentBannerIdx >= totalBanners) {
      setCurrentBannerIdx(0);
    }
  }, [totalBanners, currentBannerIdx]);

  const handlePrevBanner = useCallback(() => {
    setCurrentBannerIdx(prev => (prev - 1 + totalBanners) % totalBanners);
  }, [totalBanners]);

  const handleNextBanner = useCallback(() => {
    setCurrentBannerIdx(prev => (prev + 1) % totalBanners);
  }, [totalBanners]);

  // Auto-play timer (rolls every 4 seconds)
  useEffect(() => {
    if (totalBanners <= 1 || isPaused || isDragging) return;

    const timer = setInterval(() => {
      setCurrentBannerIdx(prev => (prev + 1) % totalBanners);
    }, 4000);

    return () => clearInterval(timer);
  }, [totalBanners, isPaused, isDragging, currentBannerIdx]);

  // Touch Handlers for Mobile Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
    dragStartY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = null;
    hasMovedSignificantly.current = false;
    setIsDragging(true);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartX.current === null || dragStartY.current === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - dragStartX.current;
    const deltaY = currentY - dragStartY.current;

    // Check if horizontal swipe vs vertical scroll
    if (isHorizontalSwipe.current === null) {
      if (Math.abs(deltaX) > 7 || Math.abs(deltaY) > 7) {
        isHorizontalSwipe.current = Math.abs(deltaX) >= Math.abs(deltaY);
      }
    }

    if (isHorizontalSwipe.current && totalBanners > 1) {
      setDragOffset(deltaX);
      if (Math.abs(deltaX) > 10) {
        hasMovedSignificantly.current = true;
      }
    }
  };

  const handleTouchEnd = () => {
    if (totalBanners > 1 && isHorizontalSwipe.current) {
      if (dragOffset < -45) {
        handleNextBanner();
      } else if (dragOffset > 45) {
        handlePrevBanner();
      }
    }
    setDragOffset(0);
    setIsDragging(false);
    dragStartX.current = null;
    dragStartY.current = null;
    isHorizontalSwipe.current = null;
    setTimeout(() => {
      hasMovedSignificantly.current = false;
      setIsPaused(false);
    }, 150);
  };

  // Mouse Handlers for Desktop Drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    hasMovedSignificantly.current = false;
    setIsDragging(true);
    setIsPaused(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartX.current === null || !isDragging) return;
    const deltaX = e.clientX - dragStartX.current;
    if (totalBanners > 1) {
      setDragOffset(deltaX);
      if (Math.abs(deltaX) > 10) {
        hasMovedSignificantly.current = true;
      }
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    if (totalBanners > 1) {
      if (dragOffset < -45) {
        handleNextBanner();
      } else if (dragOffset > 45) {
        handlePrevBanner();
      }
    }
    setDragOffset(0);
    setIsDragging(false);
    dragStartX.current = null;
    dragStartY.current = null;
    setTimeout(() => {
      hasMovedSignificantly.current = false;
      setIsPaused(false);
    }, 150);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
    setIsPaused(false);
  };

  const percentA = battleChoice === 'A' ? 62 : battleChoice === 'B' ? 48 : (battleConfig.percentA || 55);
  const percentB = 100 - percentA;

  const quickIcons = [
    { label: '오늘신상', icon: '⚡', color: 'bg-amber-50 text-amber-600', cat: '신제품' as ProductCategory },
    { label: '드롭캘린더', icon: '📅', color: 'bg-indigo-50 text-indigo-600', action: 'calendar' },
    { label: '브랜드관', icon: '🏢', color: 'bg-blue-50 text-[#0066FF]', action: 'brand' },
    { label: '신상배틀', icon: '⚔️', color: 'bg-purple-50 text-purple-600', action: 'compare' },
    { label: '체험단', icon: '🎁', color: 'bg-green-50 text-green-600', action: 'event' },
  ];

  const categoryIcons: { label: string; icon: string; cat: ProductCategory }[] = [
    { label: '과자', icon: '🍪', cat: '과자' },
    { label: '음료', icon: '🥤', cat: '음료' },
    { label: '빵·디저트', icon: '🥐', cat: '빵·디저트' },
    { label: '간편식', icon: '🍲', cat: '간편식' },
    { label: '패스트푸드', icon: '🍔', cat: '패스트푸드' },
    { label: '과일', icon: '🍑', cat: '과일' },
    { label: '식재료', icon: '🥚', cat: '식재료' },
    { label: '고기·수산', icon: '🥩', cat: '고기·수산' },
    { label: '기타', icon: '🍺', cat: '기타' },
  ];

  const handleCategoryClick = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setActiveTab('category');
  };

  const handleBannerClick = (banner?: BannerItem) => {
    const target = banner || displayBanners[currentBannerIdx] || displayBanners[0];
    if (!target) return;

    // 1. 외부 URL 웹링크
    if (target.linkUrl && target.linkUrl.trim()) {
      const rawUrl = target.linkUrl.trim();
      const targetUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // 2. 이벤트 연결
    if (target.linkEventId) {
      openEventDetail(target.linkEventId);
      return;
    }

    // 3. 상품 연결
    if (target.linkProductId) {
      openProductDetail(target.linkProductId);
      return;
    }

    // 4. 카테고리 이동
    if (target.linkCategory) {
      setSelectedCategory(target.linkCategory);
      setActiveTab('category');
      return;
    }

    // 5. 기본: 전체 카테고리 탐색
    setSelectedCategory('전체');
    setActiveTab('category');
  };

  return (
    <div className="pb-12 bg-[#F5F5F5] min-h-full">
      
      {/* 1. Main Banner (Dynamic from Admin + Auto-rolling + Touch/Mouse Swiping) */}
      <div 
        className="relative bg-gray-900 overflow-hidden select-none touch-pan-y" 
        style={{ height: '220px' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div 
          className="flex h-full w-full will-change-transform"
          style={{
            transform: `translateX(calc(-${currentBannerIdx * 100}% + ${dragOffset}px))`,
            transition: isDragging ? 'none' : 'transform 450ms cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        >
          {displayBanners.map((banner, idx) => (
            <div
              key={banner.id || idx}
              onClick={() => {
                if (!hasMovedSignificantly.current) {
                  handleBannerClick(banner);
                }
              }}
              className="w-full shrink-0 h-full relative cursor-pointer group select-none"
            >
              <img
                src={banner.image}
                alt={banner.title}
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover:scale-105 transition-all duration-500 pointer-events-none select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
                {banner.badge && (
                  <div className="inline-block text-[11px] font-bold text-amber-300 bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full mb-1.5 border border-amber-300/30">
                    {banner.badge}
                  </div>
                )}
                <div className="text-white font-black text-xl leading-tight drop-shadow-sm">
                  {banner.title}<br />
                  <span className="font-medium text-base text-gray-200">{banner.subtitle}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!hasMovedSignificantly.current) {
                      handleBannerClick(banner);
                    }
                  }}
                  className="mt-2.5 text-xs font-bold text-white bg-white/20 backdrop-blur-xs rounded-full px-3.5 py-1.5 border border-white/30 hover:bg-white/30 transition-colors inline-flex items-center gap-1 pointer-events-auto"
                >
                  <span>{banner.buttonText || '자세히 보기'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Left & Right Arrow Navigation (인간이 직접 넘길 수 있는 버튼) */}
        {totalBanners > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevBanner();
              }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/35 hover:bg-black/65 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 hover:opacity-100 z-20 shadow-md active:scale-90"
              aria-label="이전 배너"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextBanner();
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/35 hover:bg-black/65 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 hover:opacity-100 z-20 shadow-md active:scale-90"
              aria-label="다음 배너"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Page Counter & Dots Pagination */}
        {totalBanners > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-20">
            <div className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold tracking-wider">
              {currentBannerIdx + 1} / {totalBanners}
            </div>
            <div className="flex gap-1 items-center bg-black/40 backdrop-blur-xs px-1.5 py-1 rounded-full">
              {displayBanners.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentBannerIdx(i);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentBannerIdx ? 'w-3.5 bg-amber-400' : 'w-1.5 bg-white/40 hover:bg-white/80'
                  }`}
                  aria-label={`배너 ${i + 1}번으로 이동`}
                />
              ))}
            </div>
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
                if (m.action === 'calendar') {
                  setActiveTab('calendar');
                } else if (m.action === 'brand') {
                  setActiveTab('brand');
                } else if (m.action === 'compare') {
                  setActiveTab('compare');
                } else if (m.action === 'event') {
                  if (events.length > 0) {
                    openEventDetail(events[0].id);
                  } else {
                    setActiveTab('alert_settings');
                  }
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

      {/* 3.5 Section: 📅 이번 주 신상 드롭 캘린더 (Drop Calendar Preview) */}
      <div className="bg-white mt-2 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between px-4 mb-2.5">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1 border border-indigo-100">
                <CalendarIcon className="w-3 h-3" /> 드롭 캘린더
              </span>
              <span className="text-[11px] text-gray-400 font-medium">놓치면 품절! 출시 예정</span>
            </div>
            <h3 className="text-[16px] font-black text-gray-900 mt-1 flex items-center gap-1.5">
              📅 이번 주 신상 드롭 캘린더
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('calendar')}
            className="text-[12px] text-indigo-600 font-bold hover:underline flex items-center gap-0.5 transition-colors"
          >
            <span>전체일정</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Calendar Cards */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
          {calendarItems.slice(0, 6).map((item) => {
            const isReserved = calendarReminders.includes(item.id);

            return (
              <div
                key={item.id}
                className="shrink-0 w-[210px] bg-[#F8F9FB] hover:bg-indigo-50/40 rounded-2xl p-3 border border-gray-200/80 transition-all flex flex-col justify-between shadow-2xs hover:border-indigo-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                      item.isToday ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {item.dDay}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCalendarReminder(item.id);
                      }}
                      className={`p-1.5 rounded-full transition-all active:scale-90 ${
                        isReserved ? 'text-indigo-600 bg-white shadow-2xs' : 'text-gray-400 hover:text-indigo-500'
                      }`}
                      title="알림예약 토글"
                    >
                      {isReserved ? (
                        <BellRing className="w-4 h-4 fill-indigo-600" />
                      ) : (
                        <Bell className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div 
                    onClick={() => {
                      if (item.productId) openProductDetail(item.productId);
                      else setActiveTab('calendar');
                    }}
                    className="flex gap-2.5 cursor-pointer group"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-14 h-14 rounded-xl object-cover bg-gray-200 shrink-0 group-hover:scale-105 transition-transform" 
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] text-gray-400 font-medium truncate">{item.brand}</div>
                      <div className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {item.name}
                      </div>
                      <div className="text-[11px] font-black text-gray-800 mt-0.5">
                        {item.price.toLocaleString()}원
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[10px]">
                  <span className="text-indigo-600 font-bold">{item.releaseDateFormatted}</span>
                  <span className="text-gray-500 font-medium">{item.stores[0] || '편의점'}</span>
                </div>
              </div>
            );
          })}
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

                    {/* Price */}
                    <div className="flex items-center gap-1 mt-0.5">
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

      {/* 4.5 Section: 🏢 인기 대표 브랜드관 (Spotlight Brand Hub) */}
      <div className="bg-white mt-2 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between px-4 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-bold text-gray-900">🏢 인기 대표 브랜드관</span>
            <span className="text-[10px] font-bold bg-blue-50 text-[#0066FF] px-2 py-0.5 rounded-full border border-blue-100">
              전용관
            </span>
          </div>
          <button
            onClick={() => setActiveTab('brand')}
            className="text-[13px] text-[#0066FF] font-semibold hover:underline flex items-center"
          >
            전체 브랜드 <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <p className="px-4 text-[11px] text-gray-400 mb-3">
          스타벅스, 컴포즈, 빽다방, 이디야, 투썸, 맥도날드 등 브랜드별 제품 모아보기
        </p>

        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
          {POPULAR_BRANDS.map((b) => {
            const count = products.filter(p => p.brand === b.name).length;
            return (
              <div
                key={b.id}
                onClick={() => openBrandDetail(b.name)}
                className="w-32 shrink-0 bg-[#F8F9FA] hover:bg-blue-50/50 rounded-2xl p-3 border border-gray-100 hover:border-blue-200 transition-all cursor-pointer text-center group flex flex-col items-center justify-between space-y-1.5 active:scale-95"
              >
                <div className="flex justify-center">
                  <BrandLogo 
                    brandName={b.name} 
                    logoUrl={b.logo} 
                    size="md" 
                    className="group-hover:scale-105 transition-transform" 
                  />
                </div>
                <div>
                  <div className="text-xs font-black text-gray-900 truncate max-w-[100px] group-hover:text-[#0066FF] transition-colors">
                    {b.name}
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium">
                    {count > 0 ? `${count}개 메뉴` : b.category}
                  </div>
                </div>
                <span className="text-[9px] font-bold text-[#0066FF] bg-white px-2 py-0.5 rounded-full shadow-2xs border border-blue-50">
                  모아보기
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Section: 요즘 주목받는 먹거리 (검색 유입 순위 랭킹) */}
      <div className="bg-white mt-2 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between px-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-bold text-gray-900">요즘 주목받는 먹거리</span>
            <span className="text-[10px] font-black bg-gradient-to-r from-red-500 to-amber-500 text-white px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
              <Flame className="w-3 h-3 fill-current" />
              검색 유입 랭킹
            </span>
          </div>
          <button
            onClick={() => setActiveTab('category')}
            className="text-[13px] text-gray-400 font-medium hover:text-gray-700"
          >
            전체보기
          </button>
        </div>

        <p className="px-4 text-[11px] text-gray-400 mb-3 flex items-center gap-1">
          <Search className="w-3 h-3 text-[#0066FF] shrink-0" />
          사람들이 검색창에서 가장 많이 찾아보고 들어온 인기 순위예요
        </p>

        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
          {getSearchTrendingProducts(products, 12).map((p, index) => {
            const isBookmarked = bookmarkedIds.includes(p.id);
            const rank = index + 1;
            const searchInflux = getSearchInfluxCount(p);

            return (
              <div
                key={p.id}
                onClick={() => openProductDetail(p.id)}
                className="shrink-0 w-[130px] cursor-pointer group"
              >
                <div className="relative rounded-xl overflow-hidden bg-gray-100" style={{ height: '130px' }}>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  
                  {/* Rank Badge */}
                  <div className="absolute top-1.5 left-1.5">
                    {rank === 1 && (
                      <span className="text-[10px] font-black bg-gradient-to-r from-amber-500 to-rose-500 text-white px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                        🥇 1위
                      </span>
                    )}
                    {rank === 2 && (
                      <span className="text-[10px] font-black bg-slate-800 text-white px-1.5 py-0.5 rounded-md shadow-xs">
                        🥈 2위
                      </span>
                    )}
                    {rank === 3 && (
                      <span className="text-[10px] font-black bg-amber-700 text-white px-1.5 py-0.5 rounded-md shadow-xs">
                        🥉 3위
                      </span>
                    )}
                    {rank > 3 && (
                      <span className="text-[10px] font-black bg-black/65 text-white px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                        {rank}위
                      </span>
                    )}
                  </div>

                  {p.subCategory && (
                    <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                      {p.subCategory}
                    </span>
                  )}
                  <button
                    onClick={(e) => toggleBookmark(p.id, e)}
                    className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-xs text-sm active:scale-90 transition-transform"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
                  </button>
                </div>

                <div className="mt-2">
                  <div className="text-[11px] text-gray-400 font-medium truncate">{p.brand}</div>
                  <div className="text-[12px] font-semibold text-gray-900 leading-snug mt-0.5 line-clamp-2 group-hover:text-[#0066FF] transition-colors">
                    {p.name}
                  </div>

                  {/* Search Influx Volume Tag */}
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-[#0066FF] font-bold bg-blue-50/90 px-1.5 py-0.5 rounded w-fit">
                    <Search className="w-2.5 h-2.5 stroke-[2.5]" />
                    <span>검색 유입 {formatSearchCount(searchInflux)}</span>
                  </div>

                  {/* Yellow Star Rating */}
                  <div className="flex items-center gap-1 mt-1 text-[12px] font-semibold text-gray-800">
                    <Star className="w-3 h-3 fill-[#FFC107] text-[#FFC107]" />
                    <span>{p.overallRating.toFixed(1)}</span>
                    <span className="text-[11px] text-gray-400 font-normal">({p.ratingCount})</span>
                  </div>

                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[13px] font-bold text-gray-900">{p.price.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5.5 Section: 실시간 핫 이벤트 & 프로모션 */}
      {events.length > 0 && (
        <div className="mt-2 bg-white py-4 border-b border-gray-100">
          <div className="flex items-center justify-between px-4 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-black text-gray-900">🎁 진행 중인 핫 이벤트 & 체험단</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            </div>
            <span className="text-[11px] text-[#0066FF] font-bold">
              {events.length}개 진행중
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
            {events.map((ev) => (
              <div
                key={ev.id}
                onClick={() => openEventDetail(ev.id)}
                className="shrink-0 w-[240px] bg-gradient-to-b from-gray-50 to-white rounded-2xl overflow-hidden border border-gray-200/80 cursor-pointer group shadow-2xs hover:shadow-xs transition-all flex flex-col"
              >
                <div className="relative aspect-16/9 bg-gray-900 overflow-hidden">
                  <img
                    src={ev.bannerImage}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  
                  <span className="absolute top-2 left-2 text-[10px] font-black text-white bg-[#0066FF] px-2 py-0.5 rounded-full shadow-xs">
                    {ev.badge}
                  </span>

                  <span className="absolute top-2 right-2 text-[10px] font-bold text-amber-300 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full border border-amber-400/40">
                    {ev.dDay}
                  </span>

                  <div className="absolute bottom-1.5 left-2 right-2 text-[10px] text-white/90 font-medium truncate">
                    {ev.startDate} ~ {ev.endDate}
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 line-clamp-1 leading-snug">
                      {ev.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                      {ev.subtitle}
                    </p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#0066FF] bg-blue-50 px-1.5 py-0.5 rounded">
                      {ev.reward.length > 14 ? ev.reward.slice(0, 14) + '...' : ev.reward}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {ev.participantsCount}명 참여
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5.8 Section: 🥪 SNS 화제의 편의점 꿀조합 레시피 */}
      <div className="mt-2 bg-white py-4 border-b border-gray-100">
        <div className="flex items-center justify-between px-4 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-black text-gray-900">🥪 화제의 편의점 꿀조합</span>
            <span className="text-[10px] font-extrabold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
              맛잘알 추천
            </span>
          </div>
          <button
            onClick={() => setActiveTab('community')}
            className="text-[13px] text-[#0066FF] font-semibold hover:underline flex items-center"
          >
            수다방 레시피 <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <p className="px-4 text-[11px] text-gray-400 mb-3">
          신상과 편의점 음식의 기막힌 만남! 클릭해서 조리법과 재료를 확인해보세요.
        </p>

        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => openRecipeDetail(recipe.id)}
              className="shrink-0 w-[220px] bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between shadow-2xs"
            >
              <div>
                <div className="relative aspect-16/10 bg-gray-100 overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="text-[9px] font-black bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-xs">
                      ⏱️ {recipe.prepTime}
                    </span>
                    <span className="text-[9px] font-black bg-amber-500 text-white px-1.5 py-0.5 rounded-full shadow-xs">
                      {recipe.difficulty}
                    </span>
                  </div>

                  <div className="absolute bottom-1.5 left-2 right-2 text-white">
                    <span className="text-[10px] font-bold opacity-90 truncate block">
                      {recipe.tags[0] || '#꿀조합'}
                    </span>
                  </div>
                </div>

                <div className="p-3">
                  <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors line-clamp-1 leading-snug">
                    {recipe.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                    {recipe.description}
                  </p>
                </div>
              </div>

              <div className="px-3 pb-3 pt-1 border-t border-gray-50 flex items-center justify-between text-[11px]">
                <span className="font-extrabold text-gray-900">
                  약 {recipe.totalCost.toLocaleString()}원
                </span>
                <span className="text-gray-400 font-medium flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                  <span>{recipe.likes}</span>
                </span>
              </div>
            </div>
          ))}
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
                onClick={() => voteBattle('A')}
                className={`flex-1 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                  battleChoice === 'A' ? 'border-[#0066FF] bg-blue-50/20 shadow-xs' : 'border-gray-200'
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
                onClick={() => voteBattle('B')}
                className={`flex-1 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                  battleChoice === 'B' ? 'border-orange-500 bg-orange-50/20 shadow-xs' : 'border-gray-200'
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
          {getPopularProducts(products, 5, reviews).map((p, i) => (
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
