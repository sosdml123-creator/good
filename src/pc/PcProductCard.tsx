import React from 'react';
import { Heart, Star } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { SafeImage } from '../components/common/SafeImage';
import { formatProductPrice } from '../utils/formatters';

interface PcProductCardProps {
  product: Product;
  rating?: number;
  reviewCount?: number;
  rank?: number;
}

export const PcProductCard: React.FC<PcProductCardProps> = ({ product, rating, reviewCount, rank }) => {
  const { openProductDetail, toggleBookmark, bookmarkedIds } = useApp();
  const isBookmarked = bookmarkedIds.includes(product.id);
  const shownRating = rating ?? product.overallRating;
  const shownCount = reviewCount ?? product.ratingCount;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => openProductDetail(product.id)}
      onKeyDown={(e) => { if (e.key === 'Enter') openProductDetail(product.id); }}
      className="group text-left cursor-pointer"
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
        <SafeImage
          src={product.image}
          alt={product.name}
          fallbackCategory={product.category}
          fallbackName={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {rank !== undefined && (
          <span className="absolute top-2.5 left-2.5 min-w-7 h-7 px-1.5 rounded-lg bg-gray-900/85 text-white text-[13px] font-black flex items-center justify-center">
            {rank}
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); toggleBookmark(product.id, e); }}
          aria-label={isBookmarked ? '찜 해제' : '찜하기'}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-rose-500 text-rose-500' : 'text-gray-500'}`} />
        </button>
      </div>
      <div className="pt-3 px-0.5">
        <p className="text-[12px] text-gray-500 truncate">{product.brand}</p>
        <p className="mt-0.5 text-[14px] font-semibold text-gray-900 leading-snug line-clamp-2 min-h-[2.6em] group-hover:underline">
          {product.name}
        </p>
        <p className="mt-1 text-[15px] font-bold text-gray-900">{formatProductPrice(product.price)}</p>
        <p className="mt-1 flex items-center gap-1 text-[12px] text-gray-500">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          {shownCount > 0 ? (
            <>
              <span className="font-semibold text-gray-800">{shownRating.toFixed(1)}</span>
              <span>({shownCount.toLocaleString()})</span>
            </>
          ) : (
            <span>아직 리뷰가 없어요</span>
          )}
        </p>
      </div>
    </div>
  );
};
