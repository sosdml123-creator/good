import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Star, 
  Heart, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Tag,
  Zap,
  Building2,
  Swords,
  Gift,
  Clock,
  Cookie,
  Coffee,
  Croissant,
  UtensilsCrossed,
  Sandwich,
  Apple,
  Egg,
  Beef,
  Beer,
  IceCream,
  Plus,
  ShoppingBag
} from 'lucide-react';
import { ProductCategory, BannerItem, HomeSectionConfig } from '../../types';
import { 
  getPopularProducts, 
  getWeeklyNewProducts
} from '../../utils/ranking';
import { COUPANG_HOME_BANNER, HOME_BANNERS, WEEKLY_NEW_BANNER_ID } from '../../constants/homeBanner';
import { useHomeBanners } from '../../hooks/useHomeBanners';
import { DEFAULT_AVATAR } from '../../utils/avatars';
import { BrandLogo } from '../brand/BrandLogo';
import { SafeImage } from '../common/SafeImage';
import { AdMobBannerSection } from './AdMobBannerSection';
import { CollectionModal } from './CollectionModal';
import { useFoodTrendRanking } from '../../hooks/useFoodTrendRanking';
import { getBattlePercents } from '../../services/battleService';
import { formatProductPrice } from '../../utils/formatters';
import { useT } from '../../i18n';

// 홈 구좌 공통 헤더 — 제목 16px / 배지 10px / 보조 문구 12px / 우측 액션 12px로 통일
// 기획전에서 상품 상세로 갔다가 돌아오면 같은 기획전을 다시 열어 둡니다.
let lastOpenCollectionId: string | null = null;

const SectionHeader: React.FC<{
  title: string;
  titleSuffix?: React.ReactNode;
  badge?: React.ReactNode;
  badgeClassName?: string;
  subtitle?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  trailing?: React.ReactNode;
  padded?: boolean;
}> = ({
  title,
  titleSuffix,
  badge,
  badgeClassName = 'bg-gray-100 text-gray-700 border border-gray-200',
  subtitle,
  actionLabel,
  onAction,
  trailing,
  padded = true,
}) => {
  const t = useT();
  return (
  <div className={`mb-3 ${padded ? 'px-4' : ''}`}>
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 min-w-0">
        <h3 className="text-[16px] font-bold text-gray-900 leading-snug truncate">{t(title)}</h3>
        {titleSuffix}
      </div>
      {actionLabel ? (
        <button
          onClick={onAction}
          className="shrink-0 text-[12px] text-gray-400 font-medium hover:text-gray-700 flex items-center gap-0.5 transition-colors"
        >
          <span>{t(actionLabel)}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      ) : trailing ? (
        <span className="shrink-0 text-[12px] text-gray-400 font-medium">{trailing}</span>
      ) : null}
    </div>
    {(badge || subtitle) && (
      <p className="text-[12px] text-gray-400 leading-relaxed mt-1">
        {badge && (
          <span className={`inline-flex items-center gap-1 align-middle text-[10px] font-bold px-2 py-0.5 rounded-full mr-1.5 ${badgeClassName}`}>
            {typeof badge === 'string' ? t(badge) : badge}
          </span>
        )}
        {typeof subtitle === 'string' ? t(subtitle) : subtitle}
      </p>
    )}
  </div>
  );
};

export const HomeView: React.FC = () => {
  const { 
    products, 
    reviews, 
    banners,
    brands,
    battleConfig,
    battleRound,
    battleChoice,
    battleVoteError,
    voteBattle,
    events,
    salePromotions,
    savedSaleIds,
    toggleSaveSale,
    recipes,
    openRecipeDetail,
    setActiveTab, 
    setSelectedCategory, 
    openBrandDetail, 
    openProductDetail, 
    openEventDetail,
    toggleBookmark, 
    bookmarkedIds,
    showToast,
    homeSections = []
  } = useApp();
  const t = useT();

  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const [openCollectionId, setOpenCollectionIdState] = useState<string | null>(lastOpenCollectionId);
  const setOpenCollectionId = (id: string | null) => {
    lastOpenCollectionId = id;
    setOpenCollectionIdState(id);
  };
  const [newProductCategoryFilter, setNewProductCategoryFilter] = useState<string>('전체');
  const [isPaused, setIsPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartX = useRef<number | null>(null);
  const dragStartY = useRef<number | null>(null);
  const isHorizontalSwipe = useRef<boolean | null>(null);
  const hasMovedSignificantly = useRef(false);
  const newProductsScrollRef = useRef<HTMLDivElement>(null);

  const newProductFilterCategories = ['전체', '과자·스낵', '음료', '빵·디저트', '간편식', '패스트푸드', '아이스크림', '기타'];

  // 이번 주(출시 7일 이내) 신상만, 출시 최신순으로 고정 노출
  const displayedNewProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return getWeeklyNewProducts(products, newProductCategoryFilter);
  }, [products, newProductCategoryFilter]);

  const displayBanners = useHomeBanners();
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

  // Clean, modern Lucide SVG icons instead of emojis
  const quickIcons = [
    { label: '오늘신상', icon: <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />, color: 'bg-amber-50 text-amber-600', cat: '신제품' as ProductCategory },
    { label: '행사소식', icon: <Tag className="w-5 h-5 text-rose-500" />, color: 'bg-rose-50 text-rose-600', action: 'calendar' },
    { label: '브랜드관', icon: <Building2 className="w-5 h-5 text-slate-700" />, color: 'bg-slate-100 text-slate-700', action: 'brand' },
    { label: '신상배틀', icon: <Swords className="w-5 h-5 text-purple-600" />, color: 'bg-purple-50 text-purple-600', action: 'compare' },
    { label: '체험단', icon: <Gift className="w-5 h-5 text-emerald-600" />, color: 'bg-emerald-50 text-emerald-600', action: 'event' },
    // 두 번째 줄 첫 칸 = 오늘신상 바로 아래
    { label: '돈키호테', icon: <ShoppingBag className="w-5 h-5 text-yellow-600" />, color: 'bg-yellow-50 text-yellow-700', action: 'donki' },
    { label: '떡집', icon: <span className="text-[18px] leading-none">🍡</span>, color: 'bg-rose-50 text-rose-600', action: 'tteok' },
    { label: '농수산물', icon: <span className="text-[18px] leading-none">🥬</span>, color: 'bg-emerald-50 text-emerald-600', action: 'agri' },
  ];

  const categoryIcons: { label: string; icon: React.ReactNode; cat: ProductCategory }[] = [
    { label: '과자', icon: <Cookie className="w-5 h-5 text-amber-700" />, cat: '과자' },
    { label: '음료', icon: <Coffee className="w-5 h-5 text-cyan-600" />, cat: '음료' },
    { label: '빵·디저트', icon: <Croissant className="w-5 h-5 text-orange-600" />, cat: '빵·디저트' },
    { label: '아이스크림', icon: <IceCream className="w-5 h-5 text-pink-500" />, cat: '아이스크림' },
    { label: '간편식', icon: <UtensilsCrossed className="w-5 h-5 text-rose-600" />, cat: '간편식' },
    { label: '패스트푸드', icon: <Sandwich className="w-5 h-5 text-yellow-600" />, cat: '패스트푸드' },
    { label: '과일', icon: <Apple className="w-5 h-5 text-red-500" />, cat: '과일' },
    { label: '식재료', icon: <Egg className="w-5 h-5 text-amber-500" />, cat: '식재료' },
    { label: '고기·수산', icon: <Beef className="w-5 h-5 text-rose-700" />, cat: '고기·수산' },
    { label: '기타', icon: <Beer className="w-5 h-5 text-slate-600" />, cat: '기타' },
  ];

  const handleCategoryClick = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setActiveTab('category');
  };

  const handleBannerClick = (banner?: BannerItem) => {
    const target = banner || displayBanners[currentBannerIdx] || displayBanners[0];
    if (!target) return;

    if (target.linkType === 'none') return;

    if (target.linkType === 'collection' && (target.id === WEEKLY_NEW_BANNER_ID || target.linkProductIds?.length)) {
      setOpenCollectionId(target.id);
      return;
    }

    if (target.linkUrl && target.linkUrl.trim()) {
      const rawUrl = target.linkUrl.trim();
      const targetUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    if (target.linkEventId) {
      openEventDetail(target.linkEventId);
      return;
    }

    if (target.linkProductId) {
      openProductDetail(target.linkProductId);
      return;
    }

    if (target.linkCategory) {
      setSelectedCategory(target.linkCategory);
      setActiveTab('category');
      return;
    }

    setSelectedCategory('신제품');
    setActiveTab('category');
  };

  // Sort sections by admin configured order, guaranteeing banners & ad_banner is always active and present
  const defaultBannerSection: HomeSectionConfig = { id: 'banners', name: '메인 롤링 배너', isVisible: true, order: 1, title: '', subtitle: '', badgeText: '' };
  const defaultAdSection: HomeSectionConfig = { id: 'ad_banner', name: '스폰서드 광고 구좌', isVisible: true, order: 4, title: '스폰서드 맞춤 혜택', subtitle: '광고', badgeText: 'AD' };

  const baseSections: HomeSectionConfig[] = homeSections.length > 0 ? homeSections : [defaultBannerSection, defaultAdSection];
  const hasBannerSection = baseSections.some(s => s.id === 'banners');
  const hasAdSection = baseSections.some(s => s.id === 'ad_banner');

  let workingSections = hasBannerSection 
    ? baseSections.map(s => s.id === 'banners' ? { ...s, isVisible: true } : s)
    : [defaultBannerSection, ...baseSections];

  const categorySection = baseSections.find(s => s.id === 'categories');
  const adOrder = categorySection ? categorySection.order + 0.5 : 3.5;

  if (!hasAdSection) {
    // 카테고리 바로 뒤에 고정 배치
    workingSections = [...workingSections, { ...defaultAdSection, order: adOrder }];
  } else {
    // 사용자가 요청한 위치: 카테고리 바로 뒤에 항상 위치하도록 order 보장
    workingSections = workingSections.map(s => s.id === 'ad_banner' ? { ...s, isVisible: true, order: adOrder } : s);
  }

  const sortedHomeSections = [...workingSections].sort((a, b) => a.order - b.order);

  // Render individual sections dynamically
  const searchTrendingSection = workingSections.find(s => s.id === 'search_trending' && s.isVisible);
  const searchTrending = useFoodTrendRanking(products, searchTrendingSection?.itemLimit || 12, Boolean(searchTrendingSection));

  const renderSection = (section: HomeSectionConfig) => {
    if (!section.isVisible) return null;

    switch (section.id) {
      // 1. 메인 롤링 배너
      case 'banners':
        return (
          <div key="banners" className="relative w-full">
            <div
              className="relative w-full h-[265px] min-h-[265px] sm:h-[285px] sm:min-h-[285px] bg-black overflow-hidden flex cursor-grab active:cursor-grabbing select-none"
              style={{ width: '100%', height: '265px', minHeight: '265px' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex w-full h-full transition-transform ease-out"
                style={{
                  transform: `translateX(calc(-${currentBannerIdx * 100}% + ${dragOffset}px))`,
                  transitionDuration: isDragging ? '0ms' : '400ms',
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
                    className="w-full shrink-0 h-full relative cursor-pointer group select-none overflow-hidden"
                  >
                    <img
                      src={banner.image}
                      alt={banner.title || '메인 배너'}
                      draggable={false}
                      onError={(e) => {
                        e.currentTarget.onerror = null; e.currentTarget.src = COUPANG_HOME_BANNER.image;
                      }}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 pointer-events-none select-none"
                    />
                    {(banner.disclaimer || (banner.linkUrl && banner.linkUrl.includes('coupang.com'))) && (
                      <div className="absolute bottom-2 left-2.5 right-2.5 z-10 pointer-events-none select-none">
                        <p className="text-[10px] text-amber-200 font-medium tracking-tight bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded max-w-fit shadow-xs">
                          ※ {banner.disclaimer || '이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.'}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

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
          </div>
        );

      // 2. 퀵 메뉴 바로가기
      case 'quick_menu':
        return (
          <div key="quick_menu" className="bg-white py-4 px-4 border-b border-gray-100">
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
                      const targetEvent = events.find(e => e.category === '체험단') || events[0];
                      if (targetEvent && targetEvent.id) {
                        openEventDetail(targetEvent.id);
                      } else {
                        showToast(t('현재 모집 중인 체험단 구좌가 없습니다.'), 'info');
                      }
                    } else if (m.action === 'donki') {
                      setActiveTab('donki');
                    } else if (m.action === 'tteok') {
                      setActiveTab('tteok');
                    } else if (m.action === 'agri') {
                      setActiveTab('agri');
                    } else if (m.action === 'my') {
                      setActiveTab('my');
                    } else {
                      handleCategoryClick(m.cat || '전체');
                    }
                  }}
                  className="flex flex-col items-center gap-1.5 group focus:outline-none"
                >
                  <div className={`w-12 h-12 rounded-[14px] ${m.color} flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs`}>
                    {m.icon}
                  </div>
                  <span className="text-[11px] text-gray-600 font-medium">
                    {t(m.label)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );

      // 3. 카테고리 스크롤
      case 'categories':
        return (
          <div key="categories" className="bg-white py-3 px-4 border-b border-gray-100">
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
              {categoryIcons.map((c) => (
                <button
                  key={c.label}
                  onClick={() => handleCategoryClick(c.cat)}
                  className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors shadow-2xs">
                    {c.icon}
                  </div>
                  <span className="text-[11px] text-gray-600 font-medium">
                    {t(c.label)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );

      // 카테고리 구좌와 신제품 구좌 사이: 공식 스폰서드 광고 구좌
      case 'ad_banner':
        return (
          <div key="ad_banner" className="w-full">
            <AdMobBannerSection />
          </div>
        );

      // 4. 따끈따끈 새로 나온 신제품 구좌
      case 'new_products':
        return (
          <div key="new_products" className="bg-white mt-2 py-4 border-b border-gray-100">
            <SectionHeader
              title={section.title || '따끈따끈 새로 나온 신제품'}
              badge={<><Sparkles className="w-3 h-3 text-amber-500" /> {t(section.badgeText || 'NEW 신상')}</>}
              subtitle={section.subtitle || '편의점·마트 실시간 입고'}
              actionLabel="전체보기"
              onAction={() => {
                setSelectedCategory('신제품');
                setActiveTab('category');
              }}
            />

            {/* Subcategory Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-4 mb-3">
              {newProductFilterCategories.map((cat) => {
                const isSelected = newProductCategoryFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={(e) => {
                      setNewProductCategoryFilter(cat);
                      if (newProductsScrollRef.current) {
                        newProductsScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                      }
                      e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                    }}
                    className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                      isSelected
                        ? 'bg-gray-900 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t(cat)}
                  </button>
                );
              })}
            </div>

            {/* Horizontal Scroll Cards */}
            {displayedNewProducts.length > 0 ? (
              <div
                ref={newProductsScrollRef}
                className="flex gap-3 overflow-x-auto no-scrollbar px-4"
              >
                {displayedNewProducts.slice(0, section.itemLimit || 12).map((p) => {
                  const isBookmarked = bookmarkedIds.includes(p.id);

                  return (
                    <div
                      key={p.id}
                      onClick={() => openProductDetail(p.id)}
                      className="shrink-0 w-[138px] cursor-pointer group"
                    >
                      <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-square shadow-2xs">
                        <SafeImage
                          src={p.image}
                          alt={p.name}
                          fallbackName={p.name}
                          fallbackCategory={p.category}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Badges - Only show today's new item badge if applicable */}
                        {p.isToday && (
                          <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 items-start">
                            <span className="text-[10px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                              <Zap className="w-2.5 h-2.5 fill-current" /> {t('오늘신상')}
                            </span>
                          </div>
                        )}

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
                        <div className="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2 mt-0.5 group-hover:text-gray-700 transition-colors">
                          {p.name}
                        </div>

                        {/* Star Rating */}
                        {p.ratingCount > 0 && p.overallRating > 0 ? (
                          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-gray-700">
                            <Star className="w-3 h-3 fill-[#FFC107] text-[#FFC107]" />
                            <span>{p.overallRating.toFixed(1)}</span>
                            <span className="text-[11px] text-gray-400 font-normal">({p.ratingCount})</span>
                          </div>
                        ) : null}

                        {/* Price */}
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[13px] font-bold text-gray-900">{formatProductPrice(p.price)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400 text-[12px] bg-gray-50/50 mx-4 rounded-xl">
                {t('이번 주에 새로 나온 신상품이 아직 없어요.')}
              </div>
            )}
          </div>
        );

      // 5. 놓치면 손해! 이달의 행사소식
      case 'sale_events':
        return (
          <div key="sale_events" className="bg-white mt-2 py-4 border-b border-gray-100">
            <SectionHeader
              title={section.title || '놓치면 손해! 이달의 행사소식'}
              badge={<><Tag className="w-3 h-3" /> {t(section.badgeText || '1+1 · 할인특가')}</>}
              badgeClassName="bg-rose-50 text-rose-600 border border-rose-100"
              subtitle={section.subtitle || '편의점·마트 실속 혜택'}
              actionLabel="전체보기"
              onAction={() => setActiveTab('calendar')}
            />

            {/* Horizontal Sale Cards */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
              {salePromotions.slice(0, section.itemLimit || 8).map((item) => {
                const isSaved = savedSaleIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className="shrink-0 w-[220px] bg-[#F8F9FB] hover:bg-rose-50/30 rounded-2xl p-3 border border-gray-200/80 transition-all flex flex-col justify-between shadow-2xs hover:border-rose-200"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            item.dealType === '1+1'
                              ? 'bg-red-500 text-white animate-pulse'
                              : item.dealType === '2+1'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-amber-500 text-white'
                          }`}>
                            {item.badgeText}
                          </span>
                          <span className="text-[10px] font-bold text-gray-600 bg-gray-200/70 px-1.5 py-0.5 rounded-md">
                            {item.store}
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveSale(item.id);
                          }}
                          className={`p-1.5 rounded-full transition-all active:scale-90 ${
                            isSaved ? 'text-rose-500 bg-white shadow-2xs' : 'text-gray-400 hover:text-rose-500'
                          }`}
                          aria-label="관심 행사 찜하기"
                        >
                          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
                        </button>
                      </div>

                      <div 
                        onClick={() => {
                          if (item.productId) openProductDetail(item.productId);
                          else setActiveTab('calendar');
                        }}
                        className="flex gap-2.5 cursor-pointer group"
                      >
                        <SafeImage 
                          src={item.image} 
                          alt={item.title} 
                          fallbackName={item.title}
                          fallbackCategory="과자"
                          className="w-14 h-14 rounded-xl object-cover bg-gray-200 shrink-0 group-hover:scale-105 transition-transform" 
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] text-gray-400 font-medium truncate">{item.brand}</div>
                          <div className="text-[13px] font-semibold text-gray-900 line-clamp-1 group-hover:text-rose-600 transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[11px] font-bold text-rose-600 mt-0.5">
                            {item.unitPriceDescription}
                          </div>
                          {item.originalPrice > 0 && (
                            <div className="text-[11px] text-gray-400 line-through">
                              {item.originalPrice.toLocaleString()}원
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-gray-500 font-medium truncate max-w-[120px]">
                        {item.benefitTag || item.description}
                      </span>
                      <span className="text-rose-600 font-bold shrink-0">{item.dDay}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      // 6. 인기 대표 브랜드관
      case 'brand_hub':
        return (
          <div key="brand_hub" className="bg-white mt-2 py-4 border-b border-gray-100">
            <SectionHeader
              title={section.title || '인기 대표 브랜드관'}
              badge={t(section.badgeText || '전용관')}
              subtitle={section.subtitle || '스타벅스, 컴포즈, 빽다방, 이디야, 투썸, 맥도날드 등 브랜드별 제품 모아보기'}
              actionLabel="전체 브랜드"
              onAction={() => setActiveTab('brand')}
            />

            <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
              {(brands.filter(b => b.isPopular).length > 0 ? brands.filter(b => b.isPopular) : brands).map((b) => {
                const count = products.filter(p => p.brand === b.name).length;
                return (
                  <div
                    key={b.id}
                    onClick={() => openBrandDetail(b.name)}
                    className="w-32 shrink-0 bg-[#F8F9FA] hover:bg-gray-100 rounded-2xl p-3 border border-gray-100 hover:border-gray-300 transition-all cursor-pointer text-center group flex flex-col items-center justify-between space-y-1.5 active:scale-95"
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
                      <div className="text-[13px] font-semibold text-gray-900 truncate max-w-[100px] group-hover:text-gray-700 transition-colors">
                        {b.name}
                      </div>
                      <div className="text-[11px] text-gray-400 font-medium">
                        {count > 0 ? t('{n}개 메뉴', { n: count }) : t(b.category)}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-700 bg-white px-2 py-0.5 rounded-full shadow-2xs border border-gray-200">
                      {t('모아보기')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      // 7. 요즘 주목받는 먹거리 (네이버 검색량 기준)
      case 'search_trending':
        return (
          <div key="search_trending" className="bg-white mt-2 py-4 border-b border-gray-100">
            <SectionHeader
              title={section.title || '요즘 주목받는 먹거리'}
              subtitle={[
                section.subtitle,
                searchTrending.isLive
                  ? `네이버 검색량·쇼핑·블로그 종합 · ${new Date(searchTrending.updatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 기준`
                  : '',
              ].filter(Boolean).join(' · ')}
              actionLabel="전체보기"
              onAction={() => setActiveTab('category')}
            />

            <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
              {searchTrending.products.map((p, index) => {
                const isBookmarked = bookmarkedIds.includes(p.id);
                const rank = index + 1;

                return (
                  <div
                    key={p.id}
                    onClick={() => openProductDetail(p.id)}
                    className="shrink-0 w-[130px] cursor-pointer group"
                  >
                    <div className="relative rounded-xl overflow-hidden bg-gray-100" style={{ height: '130px' }}>
                      <SafeImage
                        src={p.image}
                        alt={p.name}
                        fallbackName={p.name}
                        fallbackCategory={p.category}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      
                      {/* Rank Badge without emojis */}
                      <div className="absolute top-1.5 left-1.5">
                        {rank === 1 && (
                          <span className="text-[10px] font-bold bg-gradient-to-r from-[#03C75A] to-emerald-600 text-white px-1.5 py-0.5 rounded-md shadow-xs">
                            {t('{n}위', { n: 1 })}
                          </span>
                        )}
                        {rank === 2 && (
                          <span className="text-[10px] font-bold bg-slate-800 text-white px-1.5 py-0.5 rounded-md shadow-xs">
                            {t('{n}위', { n: 2 })}
                          </span>
                        )}
                        {rank === 3 && (
                          <span className="text-[10px] font-bold bg-amber-700 text-white px-1.5 py-0.5 rounded-md shadow-xs">
                            {t('{n}위', { n: 3 })}
                          </span>
                        )}
                        {rank > 3 && (
                          <span className="text-[10px] font-bold bg-black/65 text-white px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                            {t('{n}위', { n: rank })}
                          </span>
                        )}
                      </div>

                      {p.subCategory && (
                        <span className="absolute bottom-1.5 left-1.5 text-[10px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded-md backdrop-blur-xs">
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
                      <div className="text-[13px] font-semibold text-gray-900 leading-snug mt-0.5 line-clamp-2 group-hover:text-gray-700 transition-colors">
                        {p.name}
                      </div>

                      {/* Yellow Star Rating */}
                      {p.ratingCount > 0 && p.overallRating > 0 ? (
                        <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-gray-700">
                          <Star className="w-3 h-3 fill-[#FFC107] text-[#FFC107]" />
                          <span>{p.overallRating.toFixed(1)}</span>
                          <span className="text-[11px] text-gray-400 font-normal">({p.ratingCount})</span>
                        </div>
                      ) : null}

                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[13px] font-bold text-gray-900">{formatProductPrice(p.price)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      // 8. 실시간 핫 이벤트 & 프로모션
      case 'hot_events':
        return events.length > 0 ? (
          <div key="hot_events" id="section-hot-events" className="mt-2 bg-white py-4 border-b border-gray-100">
            <SectionHeader
              title={section.title || '진행 중인 핫 이벤트 & 체험단'}
              titleSuffix={<span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>}
              subtitle={section.subtitle}
              trailing={t('{n}개 진행중', { n: events.length })}
            />

            <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => openEventDetail(ev.id)}
                  className="shrink-0 w-[240px] bg-gradient-to-b from-gray-50 to-white rounded-2xl overflow-hidden border border-gray-200/80 cursor-pointer group shadow-2xs hover:shadow-xs transition-all flex flex-col"
                >
                  <div className="relative aspect-[16/9] bg-gray-900 overflow-hidden">
                    <img
                      src={ev.bannerImage}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    
                    <span className="absolute top-2 left-2 text-[10px] font-bold text-white bg-gray-900 px-2 py-0.5 rounded-full shadow-xs">
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
                      <h4 className="text-[13px] font-semibold text-gray-900 line-clamp-1 leading-snug">
                        {ev.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                        {ev.subtitle}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded">
                        {ev.reward.length > 14 ? ev.reward.slice(0, 14) + '...' : ev.reward}
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">
                        {t('{n}명 참여', { n: ev.participantsCount })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      // 9. 화제의 편의점 꿀조합 레시피
      case 'recipes':
        return (
          <div key="recipes" className="mt-2 bg-white py-4 border-b border-gray-100">
            <SectionHeader
              title={section.title || '화제의 편의점 꿀조합'}
              badge={t(section.badgeText || '맛잘알 추천')}
              badgeClassName="bg-amber-50 text-amber-700 border border-amber-200"
              subtitle={section.subtitle || '신상과 편의점 음식의 기막힌 만남! 클릭해서 조리법과 재료를 확인해보세요.'}
              actionLabel="수다방 레시피"
              onAction={() => setActiveTab('community')}
            />

            <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => openRecipeDetail(recipe.id)}
                  className="shrink-0 w-[220px] bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:border-gray-300 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className="text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" /> {recipe.prepTime}
                        </span>
                        <span className="text-[10px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-full shadow-xs">
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
                      <h4 className="text-[13px] font-semibold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-1 leading-snug">
                        {recipe.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                        {recipe.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-3 pb-3 pt-1 border-t border-gray-50 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-gray-900">
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
        );

      // 10. 신상 배틀 VS
      case 'battle': {
        if (!battleRound) return null;

        const isResult = battleRound.phase === 'result';
        const percents = getBattlePercents(battleRound.counts);
        const winner = !isResult || !battleRound.counts || battleRound.counts.A === battleRound.counts.B
          ? null
          : battleRound.counts.A > battleRound.counts.B ? 'A' : 'B';
        const previous = battleRound.previous;
        const previousPercents = getBattlePercents(previous?.counts);

        const fighters = ([
          { side: 'A', info: battleRound.productA, configId: battleConfig.productAId, configLabel: battleConfig.labelA, fallbackLabel: '인기' },
          { side: 'B', info: battleRound.productB, configId: battleConfig.productBId, configLabel: battleConfig.labelB, fallbackLabel: '대세' },
        ] as const).map(f => ({
          side: f.side,
          product: products.find(p => p.id === f.info.id) || f.info,
          // 관리자가 직접 지정한 대결일 때만 지정 라벨을 씁니다.
          label: (f.configId === f.info.id && f.configLabel) || `${f.info.category || f.fallbackLabel} 신상`,
        }));

        let hint: string;
        if (battleVoteError) {
          hint = battleVoteError;
        } else if (isResult) {
          hint = percents
            ? `투표 결과 · 총 ${battleRound.totalVotes.toLocaleString()}표 · 월요일에 새 대결이 시작돼요`
            : '이번 주 투표가 마감됐어요 · 월요일에 새 대결이 시작돼요';
        } else if (battleChoice) {
          hint = `투표 완료! 결과는 토요일에 공개돼요 · ${battleRound.totalVotes.toLocaleString()}명 참여 중`;
        } else {
          hint = '눌러서 투표해보세요 · 결과는 토요일에 공개돼요';
        }

        return (
          <div key="battle" className="mt-2 bg-white py-4 px-4 border-b border-gray-100">
            <SectionHeader
              padded={false}
              title={section.title || battleConfig.title}
              badge="VS"
              badgeClassName="text-white bg-gradient-to-r from-gray-900 to-slate-800"
              subtitle={isResult ? '이번 주 투표 결과가 나왔어요' : (section.subtitle || battleConfig.subtitle)}
              actionLabel="비교표 보기"
              onAction={() => setActiveTab('compare')}
            />

            <div className="flex items-center gap-3">
              {fighters.map((f, idx) => {
                const isA = f.side === 'A';
                const isMine = battleChoice === f.side;
                const isWinner = winner === f.side;
                const percent = percents ? percents[f.side] : null;
                return (
                  <React.Fragment key={f.side}>
                    {idx === 1 && <div className="text-gray-300 font-black text-xl">VS</div>}
                    {/* 투표 기간에는 눌러서 투표, 결과 기간에는 상품 상세로 이동 */}
                    <div
                      onClick={() => (isResult ? openProductDetail(f.product.id) : voteBattle(f.side))}
                      className={`flex-1 min-w-0 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all relative ${
                        (isResult ? isWinner : isMine)
                          ? (isA ? 'border-slate-800 bg-slate-50/40 shadow-xs' : 'border-orange-500 bg-orange-50/20 shadow-xs')
                          : 'border-gray-200'
                      }`}
                    >
                      {isWinner && (
                        <span className={`absolute top-2 left-2 z-10 text-[11px] font-black text-white px-2 py-0.5 rounded-full ${isA ? 'bg-slate-800' : 'bg-orange-500'}`}>
                          {t('승리')}
                        </span>
                      )}
                      <SafeImage
                        src={f.product.image}
                        alt={f.product.name}
                        fallbackName={f.product.name}
                        fallbackCategory={f.product.category}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="p-2.5">
                        <div className={`text-[11px] font-bold ${isA ? 'text-slate-800' : 'text-orange-500'}`}>{f.label}</div>
                        <div className="text-[13px] font-semibold text-gray-900 line-clamp-1">{f.product.name}</div>
                        {percent !== null ? (
                          <div className="mt-1.5 flex items-center gap-1">
                            <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                              <div className={`h-full rounded-full transition-all ${isA ? 'bg-slate-800' : 'bg-orange-400'}`} style={{ width: `${percent}%` }}></div>
                            </div>
                            <span className={`text-[11px] font-bold ${isA ? 'text-slate-800' : 'text-orange-400'}`}>{percent}%</span>
                          </div>
                        ) : (
                          <div className={`mt-1.5 text-[11px] font-bold ${isMine ? (isA ? 'text-slate-800' : 'text-orange-500') : 'text-gray-400'}`}>
                            {isMine ? t('✓ 내 선택') : isResult ? t('투표 마감') : t('투표하기')}
                          </div>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            <p className={`text-center text-[12px] mt-2.5 ${battleVoteError ? 'text-rose-500' : 'text-gray-400'}`}>{hint}</p>

            {!isResult && previous && previousPercents && (
              <p className="text-center text-[12px] text-gray-500 mt-1">
                {previousPercents.A === previousPercents.B
                  ? `지난주 결과: ${previous.productA.name} vs ${previous.productB.name} 무승부`
                  : `지난주 승자: ${(previousPercents.A > previousPercents.B ? previous.productA : previous.productB).name} (${Math.max(previousPercents.A, previousPercents.B)}%)`}
              </p>
            )}
          </div>
        );
      }

      // 11. 실시간 품목별 인기 랭킹
      case 'popular_ranking':
        return (
          <div key="popular_ranking" className="mt-2 bg-white py-4 px-4 border-b border-gray-100">
            <SectionHeader
              padded={false}
              title={section.title || '실시간 인기 품목 랭킹'}
              subtitle={section.subtitle}
              actionLabel="전체보기"
              onAction={() => setActiveTab('ranking')}
            />

            <div className="space-y-4">
              {getPopularProducts(products, section.itemLimit || 5, reviews).map((p, i) => (
                <div
                  key={p.id}
                  onClick={() => openProductDetail(p.id)}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1 rounded-xl transition-colors"
                >
                  <span className={`w-5 text-[13px] font-black ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-gray-700' : 'text-gray-400'}`}>
                    {i + 1}
                  </span>
                  <SafeImage
                    src={p.image}
                    alt={p.name}
                    fallbackName={p.name}
                    fallbackCategory={p.category}
                    className="w-14 h-14 rounded-xl object-cover bg-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-gray-400 font-medium truncate">{p.brand} {p.subCategory ? `· ${p.subCategory}` : ''}</div>
                    <div className="text-[13px] font-semibold text-gray-900 truncate">{p.name}</div>
                    {p.ratingCount > 0 && p.overallRating > 0 ? (
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-0.5 text-[11px] font-semibold text-gray-700">
                          <Star className="w-3 h-3 fill-[#FFC107] text-[#FFC107]" />
                          <span>{p.overallRating.toFixed(1)}</span>
                        </div>
                        <span className="text-[11px] text-gray-400">({p.ratingCount})</span>
                      </div>
                    ) : null}
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
        );

      // 12. 이번 주 실시간 솔직 후기
      case 'reviews':
        return (
          <div key="reviews" className="mt-2 bg-white py-4 px-4">
            <SectionHeader
              padded={false}
              title={section.title || '이번 주 실시간 솔직 후기'}
              subtitle={section.subtitle}
              actionLabel="더보기"
              onAction={() => setActiveTab('category')}
            />

            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.slice(0, section.itemLimit || 2).map((r) => (
                  <div
                    key={r.id}
                    onClick={() => openProductDetail(r.productId)}
                    className="cursor-pointer space-y-2 pb-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={r.userAvatar || DEFAULT_AVATAR}
                        alt={r.userName}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_AVATAR;
                        }}
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-semibold text-gray-900">{r.userName}</span>
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

                    <span className="text-[11px] font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md inline-block">
                      {r.productName}
                    </span>

                    <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap break-words break-all [overflow-wrap:anywhere]">
                      {r.content}
                    </p>

                    {r.images && r.images.length > 0 && (
                      <SafeImage
                        src={r.images[0]}
                        alt="review"
                        fallbackName={r.productName || '리뷰 사진'}
                        className="mt-2 w-full rounded-xl object-cover"
                        style={{ height: '160px' }}
                      />
                    )}

                    <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-400">
                      <span>♡ {t('도움돼요')} {r.likes}</span>
                      <span>💬 {t('댓글')} {r.commentsCount || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-2xl p-4">
                <p className="text-[13px] font-semibold text-gray-700">{t('아직 등록된 후기가 없습니다')}</p>
                <p className="text-[11px] text-gray-400 mt-1">{t('맛있는 신상을 맛보고 첫 번째 솔직 후기를 남겨보세요!')}</p>
                <button
                  onClick={() => setActiveTab('write')}
                  className="mt-3 px-4 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-full shadow-xs transition-colors"
                >
                  {t('리뷰 작성하러 가기')}
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-[#F6F7F9] min-h-screen pb-20 select-none relative">
      {sortedHomeSections.map((section) => renderSection(section))}

      {/* 6. Floating Action Button (+) for Instant Review Writing */}
      <button
        type="button"
        onClick={() => setActiveTab('write')}
        className="fixed bottom-20 right-5 z-40 w-13 h-13 bg-gray-900 hover:bg-black text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all active:scale-90 border-2 border-white/20 group"
        title="신상 리뷰 바로 작성하기"
        aria-label="리뷰 작성"
      >
        <Plus className="w-7 h-7 stroke-[2.8] text-white group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {(() => {
        const collection = openCollectionId ? [...HOME_BANNERS, ...banners].find(b => b.id === openCollectionId) : undefined;
        return collection ? <CollectionModal banner={collection} onClose={() => setOpenCollectionId(null)} /> : null;
      })()}
    </div>
  );
};
