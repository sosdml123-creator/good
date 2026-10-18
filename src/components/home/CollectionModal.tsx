import React, { useEffect, useMemo } from 'react';
import { ChevronLeft, Heart, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BannerItem } from '../../types';
import { SafeImage } from '../common/SafeImage';
import { formatProductPrice } from '../../utils/formatters';

// 기획전 배너(linkType: 'collection')를 탭하면 뜨는 상품 목록 화면
export const CollectionModal: React.FC<{ banner: BannerItem; onClose: () => void }> = ({ banner, onClose }) => {
  const { products, openProductDetail, toggleBookmark, bookmarkedIds } = useApp();

  // 관리자가 지정한 순서를 유지하고, 삭제된 상품은 빠집니다.
  const items = useMemo(() => {
    const byId = new Map(products.map(p => [p.id, p]));
    return (banner.linkProductIds || []).map(id => byId.get(id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  }, [products, banner.linkProductIds]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in duration-200"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex items-center gap-2 px-2 h-12 border-b border-gray-100 shrink-0">
        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full active:bg-gray-100" aria-label="닫기">
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h2 className="text-[16px] font-bold text-gray-900 truncate max-w-5xl">{banner.title || '기획전'}</h2>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 96px)' }}>
        <div className="max-w-5xl mx-auto">
        <div className="relative w-full aspect-[16/9] sm:aspect-[3/1] bg-gray-900 overflow-hidden">
          <img src={banner.image} alt={banner.title || '기획전'} className="absolute inset-0 w-full h-full object-cover" />
        </div>

        <div className="px-4 pt-4 pb-2">
          {banner.badge && (
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 mb-1.5">{banner.badge}</span>
          )}
          {banner.subtitle && <p className="text-[13px] text-gray-500 leading-relaxed">{banner.subtitle}</p>}
          <p className="text-[12px] text-gray-400 mt-1">총 {items.length}개 상품</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-3 gap-y-5 px-4 pt-2">
          {items.map(p => {
            const isBookmarked = bookmarkedIds.includes(p.id);
            return (
              <div key={p.id} onClick={() => openProductDetail(p.id)} className="cursor-pointer group min-w-0">
                <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-square shadow-2xs">
                  <SafeImage
                    src={p.image}
                    alt={p.name}
                    fallbackName={p.name}
                    fallbackCategory={p.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => toggleBookmark(p.id, e)}
                    className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs transition-transform active:scale-90"
                    aria-label="찜하기"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
                  </button>
                </div>
                <div className="mt-2">
                  <div className="text-[11px] text-gray-400 font-medium truncate">{p.brand}</div>
                  <div className="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2 mt-0.5">{p.name}</div>
                  {p.ratingCount > 0 && p.overallRating > 0 && (
                    <div className="flex items-center gap-0.5 mt-1 text-[11px] text-gray-500">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-gray-700">{p.overallRating.toFixed(1)}</span>
                      <span>({p.ratingCount})</span>
                    </div>
                  )}
                  <div className="text-[14px] font-bold text-gray-900 mt-1">{formatProductPrice(p.price)}</div>
                </div>
              </div>
            );
          })}
        </div>

        {items.length === 0 && (
          <p className="text-center text-[13px] text-gray-400 py-16">등록된 기획전 상품이 없습니다.</p>
        )}
        </div>
      </div>
    </div>
  );
};
