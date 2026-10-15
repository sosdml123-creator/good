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

/** 이커머스형 상품 카드: 정사각 이미지 · 브랜드 · 상품명 · 가격 · 별점 */
export const PcProductCard: React.FC<PcProductCardProps> = ({ product, rating, reviewCount, rank }) => {
  const { openProductDetail, toggleBookmark, bookmarkedIds } = useApp();
  const isBookmarked = bookmarkedIds.includes(product.id);
  const shownRating = rating ?? product.overallRating;
  const shownCount = reviewCount ?? product.ratingCount;

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => openProductDetail(product.id)}
      onKeyDown={(e) => { if (e.key === 'Enter') openProductDetail(product.id); }}
      className="group min-w-0 cursor-pointer"
    >
      <div className="relative aspect-square rounded-xl overflow-hidden bg-[#F7F7F8]">
        <SafeImage
          src={product.image}
          alt={product.name}
          fallbackCategory={product.category}
          fallbackName={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
        {rank !== undefined && (
          <span
            className={`absolute top-0 left-0 w-8 h-8 flex items-center justify-center text-[14px] font-black text-white rounded-br-xl ${
              rank <= 3 ? 'bg-violet-600' : 'bg-gray-900/80'
            }`}
          >
            {rank}
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); toggleBookmark(product.id, e); }}
          aria-label={isBookmarked ? '찜 해제' : '찜하기'}
          className={`absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center cursor-pointer transition-opacity ${
            isBookmarked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart className={`w-[18px] h-[18px] ${isBookmarked ? 'fill-rose-500 text-rose-500' : 'text-gray-700'}`} />
        </button>
      </div>
      <div className="pt-3">
        <p className="text-[13px] text-gray-500 truncate">{product.brand}</p>
        <p className="mt-1 text-[15px] text-gray-900 leading-[1.4] line-clamp-2 min-h-[42px]">{product.name}</p>
        <p className="mt-1.5 text-[16px] font-bold text-gray-900">{formatProductPrice(product.price)}</p>
        <p className="mt-1.5 flex items-center gap-1 text-[12px] text-gray-400">
          {shownCount > 0 ? (
            <>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-gray-700">{shownRating.toFixed(1)}</span>
              <span>리뷰 {shownCount.toLocaleString()}</span>
            </>
          ) : (
            <span>첫 리뷰를 기다려요</span>
          )}
        </p>
      </div>
    </div>
  );
};
