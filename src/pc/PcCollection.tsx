import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { BannerItem } from '../types';
import { PcProductCard } from './PcProductCard';
import { PcBreadcrumb, PcContainer, PcEmpty } from './PcUi';
import { WEEKLY_NEW_BANNER_ID } from '../constants/homeBanner';
import { getWeeklyNewProducts } from '../utils/ranking';

const WEEKLY_FILTERS = ['전체', '과자·스낵', '음료', '빵·디저트', '간편식', '패스트푸드', '아이스크림', '기타'];

const SORT_LABELS = { curated: '기획전순', popular: '인기순', priceLow: '낮은 가격순', priceHigh: '높은 가격순' } as const;
type SortOption = keyof typeof SORT_LABELS;

/** PC 전용 기획전 화면 (모바일은 components/home/CollectionModal) */
export const PcCollection: React.FC<{ banner: BannerItem; onClose: () => void }> = ({ banner, onClose }) => {
  const { products } = useApp();
  const [sortBy, setSortBy] = useState<SortOption>('curated');
  const isWeekly = banner.id === WEEKLY_NEW_BANNER_ID;
  const [filter, setFilter] = useState('전체');
  const weeklyAll = useMemo(() => (isWeekly ? getWeeklyNewProducts(products, '전체') : []), [isWeekly, products]);

  // PC 는 main 이 스크롤 영역이라 화면 맨 위로 올려 줍니다.
  const topRef = useRef<HTMLDivElement>(null);
  useEffect(() => { topRef.current?.scrollIntoView({ block: 'start' }); }, [banner.id]);

  // 관리자가 지정한 순서를 기본으로 하고, 삭제된 상품은 빠집니다.
  const items = useMemo(() => {
    const byId = new Map(products.map(p => [p.id, p]));
    const list = isWeekly
      ? getWeeklyNewProducts(products, filter)
      : (banner.linkProductIds || []).map(id => byId.get(id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
    if (sortBy === 'popular') return [...list].sort((a, b) => (b.ratingCount || 0) - (a.ratingCount || 0));
    if (sortBy === 'priceLow') return [...list].sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
    if (sortBy === 'priceHigh') return [...list].sort((a, b) => (b.price || 0) - (a.price || 0));
    return list;
  }, [products, banner.linkProductIds, sortBy, isWeekly, filter]);

  return (
    <div ref={topRef} className="pb-24">
      <PcContainer className="pt-6">
        <PcBreadcrumb items={[{ label: '홈', onClick: onClose }, { label: '기획전' }, { label: banner.title || '기획전' }]} />
      </PcContainer>

      <PcContainer className="mt-5">
        <div className="relative w-full aspect-[1200/360] rounded-2xl overflow-hidden bg-gray-900">
          <img src={banner.image} alt={banner.title || '기획전'} className="absolute inset-0 w-full h-full object-cover" />
        </div>

        <div className="mt-10 flex items-end justify-between border-b border-gray-200 pb-5">
          <div>
            {banner.badge && (
              <span className="inline-block text-[12px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 mb-2">{banner.badge}</span>
            )}
            <h1 className="text-[30px] font-bold text-gray-900 tracking-tight">{banner.title || '기획전'}</h1>
            {banner.subtitle && <p className="mt-2 text-[15px] text-gray-500">{banner.subtitle}</p>}
          </div>
          <div className="flex items-center gap-6 text-[14px]">
            <span className="text-gray-500">총 <b className="text-gray-900">{items.length}</b>개</span>
            <div className="flex items-center">
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
        </div>

        {isWeekly && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {WEEKLY_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`h-9 px-4 rounded-full text-[14px] font-bold cursor-pointer ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {f}
              </button>
            ))}
            <span className="ml-auto text-[13px] text-gray-400">이번 주 신상 총 {weeklyAll.length}개</span>
          </div>
        )}

        {items.length > 0 ? (
          <div className="mt-10 grid grid-cols-5 gap-x-5 gap-y-12">
            {items.map(p => <PcProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <PcEmpty message={isWeekly ? '이번 주 등록된 신상이 아직 없어요.' : '등록된 기획전 상품이 없습니다.'} />
        )}
      </PcContainer>
    </div>
  );
};
