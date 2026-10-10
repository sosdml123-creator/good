// src/components/admin/instagram/templates/ReviewCardTemplate.tsx
import React from 'react';
import { ReviewCardProps } from '../types';
import { CarouselBadgeDark, NewBadge, InstagramActionBar } from './CommonElements';
import { Star, Check } from 'lucide-react';
import { INSTA_THEME } from '../theme';

export const ReviewCardTemplate: React.FC<ReviewCardProps> = ({
  badge = 'NEW',
  brand = '삼양',
  productName = '불닭볶음면 까르보',
  rating = 4.3,
  reviewCount = '1,245',
  description = '매콤한 불닭에 부드러운\n크림이 더해진 중독성 있는 맛!',
  recommendationTitle = '이런 분께 추천해요',
  recommendations = [
    '매운맛도 좋아하고 크림도 좋아하는 분',
    '불닭 시리즈를 좋아하는 분',
    '색다른 라면을 찾는 분',
  ],
  productImage = 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop',
  handwriting = '이 조합\n진짜 맛있다!',
}) => {
  return (
    <div className="relative w-full h-full bg-white flex flex-col justify-between p-7 select-none overflow-hidden">
      {/* 우측 상단 인스타 캐러셀 아이콘 */}
      <CarouselBadgeDark />

      <div className="w-full">
        {/* 상단: NEW 뱃지 + 브랜드 + 상품 이미지 상단 배치 */}
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <NewBadge text={badge} />
              {brand && (
                <span className="text-xs sm:text-sm font-bold text-gray-700 tracking-tight">
                  {brand}
                </span>
              )}
            </div>

            {/* 상품명 */}
            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight leading-tight">
              {productName}
            </h2>

            {/* 별점 & 리뷰수 */}
            {rating != null && (
              <div className="flex items-center gap-1.5 mt-2">
                <Star size={18} className="text-amber-400 fill-amber-400" />
                <span className="text-base sm:text-lg font-black text-black">
                  {typeof rating === 'number' ? rating.toFixed(1) : rating}
                </span>
                {reviewCount && (
                  <span className="text-xs sm:text-sm font-medium text-gray-400">
                    ({reviewCount})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 우측 상단 상품 썸네일 & 손글씨 */}
          <div className="flex flex-col items-center justify-center shrink-0 w-32 sm:w-36">
            {productImage && (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-50 p-1 flex items-center justify-center shadow-sm border border-gray-100">
                <img
                  src={productImage}
                  alt={productName}
                  crossOrigin="anonymous"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            {handwriting && (
              <p
                className="mt-2 text-xs sm:text-sm text-black font-bold text-center leading-tight whitespace-pre-line transform -rotate-3"
                style={{ fontFamily: INSTA_THEME.fonts.handwritingGaegu }}
              >
                {handwriting}
              </p>
            )}
          </div>
        </div>

        {/* 한줄설명 */}
        {description && (
          <p className="mt-3 text-xs sm:text-sm text-gray-700 font-semibold leading-relaxed whitespace-pre-line">
            {description}
          </p>
        )}

        {/* '이런 분께 추천해요' 체크리스트 박스 */}
        <div className="mt-5 p-4 rounded-2xl bg-gray-50/90 border border-gray-100">
          <p className="text-xs sm:text-sm font-black text-black mb-2.5">
            {recommendationTitle}
          </p>
          <ul className="space-y-1.5">
            {recommendations.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-800 font-medium leading-snug">
                <Check size={14} className="text-black stroke-[3] mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 하단 인스타 UI 바 */}
      <InstagramActionBar className="mt-4" />
    </div>
  );
};
