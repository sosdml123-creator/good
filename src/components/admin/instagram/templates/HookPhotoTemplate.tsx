// src/components/admin/instagram/templates/HookPhotoTemplate.tsx
import React from 'react';
import { HookPhotoProps } from '../types';
import { CarouselBadge, NewBadge, SinSangPickTag } from './CommonElements';

export const HookPhotoTemplate: React.FC<HookPhotoProps> = ({
  badge = 'NEW',
  hookTitle = '편의점에\n이거 나왔어요!',
  subText = '치즈덕후들 주목!\n이 조합 못 참지..',
  tag = '신상픽',
  pageIndicator = '1/3',
  bgImage = 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop',
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-gray-100 flex flex-col justify-between p-8">
      {/* 배경 사진 */}
      {bgImage && (
        <img
          src={bgImage}
          alt="배경 상품"
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
      )}

      {/* 부드러운 상단/하단 가독성 그라디언트 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-black/20 z-0 pointer-events-none" />

      {/* 우측 상단 인스타 요소들 */}
      <CarouselBadge />
      <div className="absolute top-7 right-16 z-10">
        <SinSangPickTag text={tag} />
      </div>

      {/* 좌측 상단: NEW 뱃지 + 큰 후크 문구 */}
      <div className="relative z-10 flex flex-col items-start pt-2">
        <NewBadge text={badge} className="px-3 py-1 text-sm font-black mb-3" />
        <h2 className="text-3xl sm:text-4xl font-black text-black leading-tight tracking-tight whitespace-pre-line text-left">
          {hookTitle}
        </h2>
        {subText && (
          <p className="mt-3 text-base sm:text-lg font-bold text-gray-800 leading-snug tracking-tight whitespace-pre-line text-left">
            {subText}
          </p>
        )}
      </div>

      {/* 좌측 하단: 페이지 인디케이터 알약 */}
      <div className="relative z-10 flex items-center justify-between w-full">
        {pageIndicator && (
          <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold tracking-wider shadow-sm">
            {pageIndicator}
          </div>
        )}
      </div>
    </div>
  );
};
