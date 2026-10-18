import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft, ChevronRight, Star, Cookie, Coffee, Croissant, IceCream,
  UtensilsCrossed, Sandwich, Apple, Egg, Beef, Beer, Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BannerItem, ProductCategory } from '../types';
import { getPopularProducts, getWeeklyNewProducts } from '../utils/ranking';
import { SafeImage } from '../components/common/SafeImage';
import { BrandLogo } from '../components/brand/BrandLogo';
import { PcProductCard } from './PcProductCard';
import { PcContainer, PcSectionHeader, PcTextTabs, PcEmpty } from './PcUi';
import { PcMarketWidget } from './PcMarket';
import { PcExclusiveStrip } from './PcExtras';
import { PcCollection } from './PcCollection';

// 기획전에서 상품 상세로 갔다가 돌아오면 같은 기획전을 다시 보여줍니다.
let lastOpenCollectionId: string | null = null;

const NEW_FILTERS = ['전체', '과자·스낵', '음료', '빵·디저트', '간편식', '패스트푸드', '아이스크림', '기타'];

const CATEGORY_SHORTCUTS: { label: string; cat: ProductCategory; icon: React.ElementType; color: string }[] = [
  { label: '신제품', cat: '신제품', icon: Sparkles, color: 'text-gray-700' },
  { label: '과자', cat: '과자', icon: Cookie, color: 'text-gray-700' },
  { label: '음료', cat: '음료', icon: Coffee, color: 'text-gray-700' },
  { label: '빵·디저트', cat: '빵·디저트', icon: Croissant, color: 'text-gray-700' },
  { label: '아이스크림', cat: '아이스크림', icon: IceCream, color: 'text-gray-700' },
  { label: '간편식', cat: '간편식', icon: UtensilsCrossed, color: 'text-gray-700' },
  { label: '패스트푸드', cat: '패스트푸드', icon: Sandwich, color: 'text-gray-700' },
  { label: '과일', cat: '과일', icon: Apple, color: 'text-gray-700' },
  { label: '식재료', cat: '식재료', icon: Egg, color: 'text-gray-700' },
  { label: '고기·수산', cat: '고기·수산', icon: Beef, color: 'text-gray-700' },
  { label: '기타', cat: '기타', icon: Beer, color: 'text-gray-700' },
];

export const PcHome: React.FC = () => {
  const {
    products,
    reviews,
    banners,
    brands,
    setActiveTab,
    setSelectedCategory,
    openProductDetail,
    openEventDetail,
    openBrandDetail,
  } = useApp();

  const [newFilter, setNewFilter] = useState('전체');
  const [bannerIdx, setBannerIdx] = useState(0);

  const activeBanners = useMemo(
    () => [...banners].filter(b => b.isActive).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [banners]
  );
  const weeklyAll = useMemo(() => getWeeklyNewProducts(products, '전체'), [products]);
  const newProducts = useMemo(() => getWeeklyNewProducts(products, newFilter), [products, newFilter]);
  const popular = useMemo(() => getPopularProducts(products, 10, reviews), [products, reviews]);
  const popularBrands = useMemo(() => {
    const picked = brands.filter(b => b.isPopular);
    return (picked.length > 0 ? picked : brands).slice(0, 8);
  }, [brands]);
  const productById = useMemo(() => new Map(products.map(p => [p.id, p])), [products]);
  const latestReviews = useMemo(
    () => [...reviews]
      .filter(r => r.content && productById.has(r.productId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4),
    [reviews, productById]
  );

  useEffect(() => {
    if (activeBanners.length < 2) return;
    const timer = setInterval(() => setBannerIdx(i => (i + 1) % activeBanners.length), 5000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const goCategory = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setActiveTab('category');
  };

  const [openCollectionId, setOpenCollectionIdState] = useState<string | null>(lastOpenCollectionId);
  const setOpenCollection = (b: BannerItem | null) => {
    lastOpenCollectionId = b ? b.id : null;
    setOpenCollectionIdState(lastOpenCollectionId);
  };
  const openCollection = openCollectionId ? banners.find(b => b.id === openCollectionId) : undefined;

  const handleBannerClick = (banner: BannerItem) => {
    if (banner.linkType === 'none') return;
    if (banner.linkType === 'collection' && banner.linkProductIds?.length) {
      setOpenCollection(banner);
    } else if (banner.linkUrl && banner.linkUrl.trim()) {
      const raw = banner.linkUrl.trim();
      window.open(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`, '_blank', 'noopener,noreferrer');
    } else if (banner.linkEventId) {
      openEventDetail(banner.linkEventId);
    } else if (banner.linkProductId) {
      openProductDetail(banner.linkProductId);
    } else {
      goCategory(banner.linkCategory || '신제품');
    }
  };

  const banner = activeBanners.length > 0 ? activeBanners[bannerIdx % activeBanners.length] : null;

  if (openCollection) return <PcCollection banner={openCollection} onClose={() => setOpenCollection(null)} />;

  return (
    <div className="bg-white pb-24">
      {/* 상단 비주얼: 배너(이미지 전체 노출) + 이번 주 신상 요약 카드 */}
      <section className="bg-white">
        <PcContainer className="py-8 grid grid-cols-[1fr_340px] gap-6">
          {banner ? (
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[1376/768]">
              <button onClick={() => handleBannerClick(banner)} className="block w-full h-full cursor-pointer">
                <SafeImage src={banner.image} alt={banner.title || '배너'} className="w-full h-full object-cover" />
              </button>
              {activeBanners.length > 1 && (
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
                  <button
                    onClick={() => setBannerIdx(i => (i - 1 + activeBanners.length) % activeBanners.length)}
                    aria-label="이전 배너"
                    className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 h-8 rounded-full bg-black/40 text-white text-[12px] font-medium flex items-center tabular-nums">
                    {(bannerIdx % activeBanners.length) + 1} / {activeBanners.length}
                  </span>
                  <button
                    onClick={() => setBannerIdx(i => (i + 1) % activeBanners.length)}
                    aria-label="다음 배너"
                    className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl bg-white aspect-[1376/768]" />
          )}

          <div className="rounded-2xl bg-[#F5F5F7] text-gray-900 p-7 flex flex-col">
            <p className="text-[13px] font-semibold text-violet-600">THIS WEEK</p>
            <p className="mt-2 text-[26px] leading-snug font-bold">
              이번 주 새로 나온<br />신상 {weeklyAll.length}개
            </p>
            <p className="mt-3 text-[14px] text-gray-500 leading-relaxed">
              편의점·카페·마트 신제품을<br />먹어본 사람들의 평가와 함께 확인하세요.
            </p>
            <div className="mt-auto flex -space-x-3">
              {weeklyAll.slice(0, 4).map(p => (
                <SafeImage
                  key={p.id}
                  src={p.image}
                  alt=""
                  fallbackCategory={p.category}
                  fallbackName={p.name}
                  className="w-14 h-14 rounded-full object-cover bg-white border-2 border-[#F5F5F7]"
                />
              ))}
            </div>
            <button
              onClick={() => goCategory('신제품')}
              className="mt-5 h-12 rounded-xl bg-gray-900 text-white text-[15px] font-bold hover:bg-black cursor-pointer"
            >
              신상 보러가기
            </button>
          </div>
        </PcContainer>
      </section>

      {/* 카테고리 바로가기 */}
      <PcContainer className="pt-10">
        <div className="grid grid-cols-11 gap-2">
          {CATEGORY_SHORTCUTS.map(({ label, cat, icon: Icon, color }) => (
            <button key={label} onClick={() => goCategory(cat)} className="group flex flex-col items-center gap-2.5 cursor-pointer">
              <span className="w-16 h-16 rounded-full bg-[#F5F5F7] flex items-center justify-center transition-colors group-hover:bg-gray-200">
                <Icon className={`w-7 h-7 stroke-[1.5] ${color}`} />
              </span>
              <span className="text-[13px] text-gray-700 group-hover:text-gray-900">{label}</span>
            </button>
          ))}
        </div>
      </PcContainer>

      {/* PC 전용 기능 소개 */}
      <PcContainer className="pt-12">
        <PcExclusiveStrip />
      </PcContainer>

      {/* 이번 주 신상 */}
      <PcContainer className="pt-16">
        <PcSectionHeader
          title="이번 주 신상"
          subtitle="출시 7일 이내 신제품을 최신순으로 모았어요"
          actionLabel="전체보기"
          onAction={() => goCategory('신제품')}
        />
        <div className="mb-7">
          <PcTextTabs items={NEW_FILTERS} value={newFilter} onChange={setNewFilter} />
        </div>
        {newProducts.length > 0 ? (
          <div className="grid grid-cols-5 gap-x-5 gap-y-10">
            {newProducts.slice(0, 10).map(p => <PcProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <PcEmpty message="이번 주에 등록된 신상이 아직 없어요." />
        )}
      </PcContainer>

      {/* 인기 랭킹 */}
      {popular.length > 0 && (
        <section className="mt-20 py-16 bg-[#F8F8FA]">
          <PcContainer>
            <PcSectionHeader
              title="지금 인기 있는 신상"
              subtitle="리뷰와 관심도를 바탕으로 실시간 집계해요"
              actionLabel="랭킹 전체보기"
              onAction={() => setActiveTab('ranking')}
            />
            <div className="grid grid-cols-5 gap-x-5 gap-y-10">
              {popular.map((p, i) => <PcProductCard key={p.id} product={p} rank={i + 1} />)}
            </div>
          </PcContainer>
        </section>
      )}

      {/* 오늘의 장바구니 시세 (PC 전용) */}
      <PcContainer className="pt-20">
        <PcMarketWidget />
      </PcContainer>

      {/* 브랜드관 */}
      {popularBrands.length > 0 && (
        <PcContainer className="pt-20">
          <PcSectionHeader title="브랜드관" subtitle="좋아하는 브랜드의 신제품만 모아보세요" actionLabel="전체 브랜드" onAction={() => setActiveTab('brand')} />
          <div className="grid grid-cols-8 gap-4">
            {popularBrands.map(b => (
              <button key={b.id} onClick={() => openBrandDetail(b.name)} className="group flex flex-col items-center gap-3 cursor-pointer">
                <span className="w-24 h-24 rounded-full border border-gray-200 bg-white flex items-center justify-center overflow-hidden transition-colors group-hover:border-gray-900">
                  <BrandLogo brandName={b.name} logoUrl={b.logo} size="lg" />
                </span>
                <span className="text-[14px] text-gray-800 truncate max-w-full">{b.name}</span>
              </button>
            ))}
          </div>
        </PcContainer>
      )}

      {/* 최신 리뷰 */}
      {latestReviews.length > 0 && (
        <PcContainer className="pt-20">
          <PcSectionHeader title="방금 올라온 리뷰" subtitle="먹어본 사람들의 솔직한 평가" />
          <div className="grid grid-cols-4 gap-5">
            {latestReviews.map(r => {
              const p = productById.get(r.productId)!;
              return (
                <button
                  key={r.id}
                  onClick={() => openProductDetail(p.id)}
                  className="text-left rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                    <SafeImage
                      src={p.image}
                      alt={p.name}
                      fallbackCategory={p.category}
                      fallbackName={p.name}
                      className="w-12 h-12 rounded-lg object-cover bg-[#F7F7F8] shrink-0"
                      loading="lazy"
                    />
                    <span className="min-w-0">
                      <span className="block text-[12px] text-gray-500 truncate">{p.brand}</span>
                      <span className="block text-[14px] font-semibold text-gray-900 truncate">{p.name}</span>
                    </span>
                  </div>
                  <div className="p-4">
                    <span className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(n => (
                        <Star key={n} className={`w-3.5 h-3.5 ${n <= Math.round(r.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                      ))}
                      <span className="ml-1.5 text-[12px] text-gray-400">{r.userName}</span>
                    </span>
                    <span className="mt-2.5 block text-[14px] text-gray-700 leading-relaxed line-clamp-3">{r.content}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </PcContainer>
      )}

    </div>
  );
};
