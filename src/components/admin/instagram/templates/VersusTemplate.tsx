// src/components/admin/instagram/templates/VersusTemplate.tsx
import React from 'react';
import { VersusProps } from '../types';
import { CarouselBadgeDark, NewBadge } from './CommonElements';
import { INSTA_THEME } from '../theme';

export const VersusTemplate: React.FC<VersusProps> = ({
  badge = '신상 비교',
  question = '두 가지 맛,\n어떤 게 더 맛있을까?',
  product1 = {
    name: '포카칩\n오리지널',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&auto=format&fit=crop',
  },
  product2 = {
    name: '포카칩\n어니언버터',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&auto=format&fit=crop',
  },
  buttonText = '지금 바로 확인하기 →',
}) => {
  return (
    <div className="relative w-full h-full bg-white flex flex-col justify-between p-7 select-none overflow-hidden">
      {/* 우측 상단 인스타 캐러셀 아이콘 */}
      <CarouselBadgeDark />

      <div className="w-full">
        {/* 상단 뱃지 */}
        <div className="mb-2">
          <NewBadge text={badge} className="px-3 py-0.5 text-xs font-black" />
        </div>

        {/* 질문형 제목 */}
        <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight leading-tight whitespace-pre-line">
          {question}
        </h2>

        {/* 중앙 VS 비교 레이아웃 */}
        <div className="relative mt-8 flex items-center justify-between px-2">
          {/* 상품 1 */}
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center p-2 border border-gray-100 shadow-sm">
              {product1.image && (
                <img
                  src={product1.image}
                  alt={product1.name}
                  crossOrigin="anonymous"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <p className="mt-3 text-xs sm:text-sm font-black text-black leading-tight whitespace-pre-line">
              {product1.name}
            </p>
          </div>

          {/* 중앙 VS 뱃지 (노란 원 + 미니 날개) */}
          <div className="relative shrink-0 mx-2 flex items-center justify-center">
            {/* 좌우 미니 데코 */}
            <div className="absolute -left-2 w-2 h-2 rounded-full bg-amber-300 opacity-60" />
            <div className="absolute -right-2 w-2 h-2 rounded-full bg-amber-300 opacity-60" />

            <div
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-black text-sm sm:text-base text-black shadow-md z-10 border-2 border-white"
              style={{ backgroundColor: INSTA_THEME.colors.primaryYellow }}
            >
              VS
            </div>
          </div>

          {/* 상품 2 */}
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center p-2 border border-gray-100 shadow-sm">
              {product2.image && (
                <img
                  src={product2.image}
                  alt={product2.name}
                  crossOrigin="anonymous"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <p className="mt-3 text-xs sm:text-sm font-black text-black leading-tight whitespace-pre-line">
              {product2.name}
            </p>
          </div>
        </div>
      </div>

      {/* 하단 중앙 확인하기 버튼 */}
      <div className="w-full flex justify-center pb-2">
        <button
          type="button"
          className="px-6 py-2.5 rounded-full border border-gray-200 text-xs sm:text-sm font-black text-gray-800 shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-1.5"
        >
          <span>{buttonText}</span>
        </button>
      </div>
    </div>
  );
};
