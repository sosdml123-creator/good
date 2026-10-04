// src/components/admin/instagram/templates/RatingDetailTemplate.tsx
import React from 'react';
import { RatingDetailProps } from '../types';
import { CarouselBadgeDark, NewBadge, InstagramActionBar, StarRatingDisplay } from './CommonElements';

export const RatingDetailTemplate: React.FC<RatingDetailProps> = ({
  badge = 'NEW',
  brand = '메가커피',
  productName = '흑임자라떼',
  ratings = [
    { label: '맛', score: 4.5 },
    { label: '가성비', score: 4.0 },
    { label: '식감', score: 4.0 },
  ],
  quote = '“고소하고 달달해서\n흑임자 좋아하는 사람은 무조건!”',
  productImage = 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop',
}) => {
  return (
    <div className="relative w-full h-full bg-white flex flex-col justify-between p-7 select-none overflow-hidden">
      {/* 우측 상단 인스타 캐러셀 아이콘 */}
      <CarouselBadgeDark />

      <div className="w-full">
        {/* 상단 뱃지 + 브랜드 */}
        <div className="flex items-center gap-2 mb-2">
          <NewBadge text={badge} />
          {brand && (
            <span className="text-xs sm:text-sm font-bold text-gray-700 tracking-tight">
              {brand}
            </span>
          )}
        </div>

        {/* 상단 상품명 및 레이아웃 */}
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight leading-tight">
              {productName}
            </h2>

            {/* 3대 지표 별점 상세 리스트 */}
            <div className="mt-5 space-y-2.5">
              {ratings.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-12 text-xs sm:text-sm font-bold text-gray-800">
                    {item.label}
                  </span>
                  <StarRatingDisplay score={item.score} size={16} />
                  <span className="text-xs sm:text-sm font-black text-black ml-1">
                    {item.score.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>

            {/* 한줄평 박스 */}
            {quote && (
              <div className="mt-6">
                <span className="text-xs font-black text-gray-900 tracking-tight flex items-center gap-0.5">
                  한줄평 &gt;
                </span>
                <p className="mt-1 text-xs sm:text-sm font-semibold text-gray-700 leading-snug whitespace-pre-line">
                  {quote}
                </p>
              </div>
            )}
          </div>

          {/* 우측 상품 이미지 & 효과 */}
          <div className="relative shrink-0 w-32 sm:w-36 flex items-center justify-center pt-2">
            {/* 우상단 방사선 효과 2~3개 */}
            <div className="absolute -top-1 -right-1 flex gap-1 transform rotate-12">
              <span className="w-1 h-3.5 bg-black/70 rounded-full transform -rotate-12" />
              <span className="w-1 h-4 bg-black/70 rounded-full" />
              <span className="w-1 h-3.5 bg-black/70 rounded-full transform rotate-12" />
            </div>

            {productImage && (
              <div className="w-28 h-36 sm:w-32 sm:h-44 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center shadow-sm">
                <img
                  src={productImage}
                  alt={productName}
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 하단 인스타 UI 바 */}
      <InstagramActionBar className="mt-4" />
    </div>
  );
};
