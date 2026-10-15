import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BannerItem, ProductCategory } from '../types';
import { getPopularProducts, getWeeklyNewProducts } from '../utils/ranking';
import { formatProductPrice } from '../utils/formatters';
import { SafeImage } from '../components/common/SafeImage';
import { BrandLogo } from '../components/brand/BrandLogo';
import { PcProductCard } from './PcProductCard';

const NEW_FILTERS = ['전체', '과자·스낵', '음료', '빵·디저트', '간편식', '패스트푸드', '아이스크림', '기타'];
const QUICK_CATEGORIES: ProductCategory[] = ['과자', '음료', '빵·디저트', '간편식', '패스트푸드', '아이스크림', '과일', '식재료', '고기·수산'];

const PcSectionTitle: React.FC<{ title: string; subtitle?: string; actionLabel?: string; onAction?: () => void }> = ({
  title, subtitle, actionLabel, onAction,
}) => (
  <div className="flex items-end justify-between mb-5">
    <div>
      <h2 className="text-[22px] font-black text-gray-900 tracking-tight">{title}</h2>
      {subtitle && <p className="mt-1 text-[13px] text-gray-500">{subtitle}</p>}
    </div>
    {actionLabel && (
      <button onClick={onAction} className="text-[13px] font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-0.5 cursor-pointer">
        {actionLabel}
        <ChevronRight className="w-4 h-4" />
      </button>
    )}
  </div>
);

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
  const newProducts = useMemo(() => getWeeklyNewProducts(products, newFilter), [products, newFilter]);
  const popular = useMemo(() => getPopularProducts(products, 10, reviews), [products, reviews]);
  const popularBrands = useMemo(() => {
    const picked = brands.filter(b => b.isPopular);
    return (picked.length > 0 ? picked : brands).slice(0, 12);
  }, [brands]);
  const productById = useMemo(() => new Map(products.map(p => [p.id, p])), [products]);
  const latestReviews = useMemo(
    () => [...reviews]
      .filter(r => r.content && productById.has(r.productId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6),
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

  const handleBannerClick = (banner: BannerItem) => {
    if (banner.linkUrl && banner.linkUrl.trim()) {
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

  const banner = activeBanners[bannerIdx % Math.max(activeBanners.length, 1)];

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-8 space-y-14">
      {/* 메인 배너: 큰 이미지 + 오른쪽 배너 목록 (배너 이미지에 문구가 들어 있어 이미지만 보여줍니다) */}
      {banner && (
        <section className={`grid gap-5 ${activeBanners.length > 1 ? 'grid-cols-[1fr_320px]' : 'grid-cols-1'}`}>
          <div className="relative">
            <button
              onClick={() => handleBannerClick(banner)}
              className="block w-full aspect-[1376/768] max-h-[480px] rounded-3xl overflow-hidden bg-gray-100 cursor-pointer"
            >
              <SafeImage src={banner.image} alt={banner.title || '배너'} className="w-full h-full object-cover" />
            </button>
            {activeBanners.length > 1 && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => setBannerIdx(i => (i - 1 + activeBanners.length) % activeBanners.length)}
                  aria-label="이전 배너"
                  className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 h-9 rounded-full bg-black/50 text-white text-[12px] font-semibold flex items-center">
                  {(bannerIdx % activeBanners.length) + 1} / {activeBanners.length}
                </span>
                <button
                  onClick={() => setBannerIdx(i => (i + 1) % activeBanners.length)}
                  aria-label="다음 배너"
                  className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          {activeBanners.length > 1 && (
            <ul className="bg-white rounded-3xl border border-gray-100 p-2 overflow-y-auto max-h-[480px] space-y-1">
              {activeBanners.map((b, i) => {
                const isCurrent = i === bannerIdx % activeBanners.length;
                return (
                  <li key={b.id}>
                    <button
                      onMouseEnter={() => setBannerIdx(i)}
                      onClick={() => handleBannerClick(b)}
                      className={`w-full flex items-center gap-3 p-2 rounded-2xl text-left cursor-pointer ${isCurrent ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                    >
                      <SafeImage src={b.image} alt="" className="w-20 aspect-[1376/768] rounded-lg object-cover bg-gray-100 shrink-0" loading="lazy" />
                      <span className="min-w-0 flex-1">
                        {b.badge && <span className="block text-[11px] font-bold text-violet-600 truncate">{b.badge}</span>}
                        <span className={`block text-[13px] truncate ${isCurrent ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                          {b.title || b.subtitle || '이벤트'}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      {/* 카테고리 바로가기 */}
      <section className="flex flex-wrap gap-2.5">
        {QUICK_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => goCategory(cat)}
            className="px-5 h-11 rounded-full bg-white border border-gray-200 text-[14px] font-semibold text-gray-700 hover:border-gray-900 hover:text-gray-900 cursor-pointer"
          >
            {cat}
          </button>
        ))}
      </section>

      {/* 이번 주 신상 + 인기 랭킹 */}
      <section className="grid grid-cols-[1fr_320px] gap-10">
        <div>
          <PcSectionTitle
            title="이번 주 신상"
            subtitle="출시 7일 이내 신제품, 최신순"
            actionLabel="신제품 전체보기"
            onAction={() => goCategory('신제품')}
          />
          <div className="flex flex-wrap gap-2 mb-6">
            {NEW_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setNewFilter(f)}
                className={`px-4 h-9 rounded-full text-[13px] font-semibold cursor-pointer ${
                  newFilter === f ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {newProducts.length > 0 ? (
            <div className="grid grid-cols-4 gap-x-5 gap-y-8">
              {newProducts.slice(0, 12).map(p => <PcProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <p className="py-16 text-center text-[14px] text-gray-400">이번 주에 등록된 신상이 아직 없어요.</p>
          )}
        </div>

        <aside>
          <PcSectionTitle title="인기 랭킹" actionLabel="전체" onAction={() => setActiveTab('ranking')} />
          <ol className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
            {popular.map((p, i) => (
              <li key={p.id}>
                <button onClick={() => openProductDetail(p.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 cursor-pointer">
                  <span className={`w-5 text-[15px] font-black ${i < 3 ? 'text-violet-600' : 'text-gray-400'}`}>{i + 1}</span>
                  <SafeImage
                    src={p.image}
                    alt={p.name}
                    fallbackCategory={p.category}
                    fallbackName={p.name}
                    className="w-11 h-11 rounded-lg object-cover bg-gray-50 shrink-0"
                    loading="lazy"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] text-gray-400 truncate">{p.brand}</span>
                    <span className="block text-[13px] font-semibold text-gray-900 truncate">{p.name}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      {/* 브랜드 */}
      {popularBrands.length > 0 && (
        <section>
          <PcSectionTitle title="브랜드별 모아보기" actionLabel="전체 브랜드" onAction={() => setActiveTab('brand')} />
          <div className="grid grid-cols-6 gap-4">
            {popularBrands.map(b => (
              <button
                key={b.id}
                onClick={() => openBrandDetail(b.name)}
                className="bg-white rounded-2xl border border-gray-100 hover:border-gray-300 p-4 flex flex-col items-center gap-2 cursor-pointer"
              >
                <BrandLogo brandName={b.name} logoUrl={b.logo} size="md" />
                <span className="text-[13px] font-semibold text-gray-800 truncate max-w-full">{b.name}</span>
                <span className="text-[11px] text-gray-400">{products.filter(p => p.brand === b.name).length}개 제품</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 최신 리뷰 */}
      {latestReviews.length > 0 && (
        <section>
          <PcSectionTitle title="방금 올라온 리뷰" subtitle="먹어본 사람들의 솔직한 평가" />
          <div className="grid grid-cols-3 gap-5">
            {latestReviews.map(r => {
              const p = productById.get(r.productId)!;
              return (
                <button
                  key={r.id}
                  onClick={() => openProductDetail(p.id)}
                  className="bg-white rounded-2xl border border-gray-100 hover:border-gray-300 p-5 text-left flex gap-4 cursor-pointer"
                >
                  <SafeImage
                    src={p.image}
                    alt={p.name}
                    fallbackCategory={p.category}
                    fallbackName={p.name}
                    className="w-16 h-16 rounded-xl object-cover bg-gray-50 shrink-0"
                    loading="lazy"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-bold text-gray-900 truncate">{p.name}</span>
                    <span className="mt-0.5 flex items-center gap-1 text-[12px] text-gray-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {r.rating.toFixed(1)} · {r.userName}
                    </span>
                    <span className="mt-2 block text-[13px] text-gray-600 leading-relaxed line-clamp-2">{r.content}</span>
                    <span className="mt-2 block text-[12px] text-gray-400">{formatProductPrice(p.price)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
