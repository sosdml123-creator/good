// src/components/admin/instagram/templates/PhotoDessertTemplate.tsx
import React from 'react';
import { PhotoDessertProps } from '../types';
import { CarouselBadge, NewBadge } from './CommonElements';
import { ArrowRight } from 'lucide-react';
import { INSTA_THEME } from '../theme';

export const PhotoDessertTemplate: React.FC<PhotoDessertProps> = ({
  handwriting = '달콤한\n신상 디저트',
  badge = 'NEW',
  title = '설빙 딸기모찌',
  description = '지금 전국 설빙 매장에서 만나보세요!',
  bgImage = 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop',
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-gray-900 flex flex-col justify-between p-8">
      {/* 배경 사진 */}
      {bgImage && (
        <img
          src={bgImage}
          alt={title}
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
      )}

      {/* 부드러운 하단 어두운 그라디언트 (텍스트 가독성) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 z-0 pointer-events-none" />

      {/* 우측 상단 인스타 캐러셀 아이콘 */}
      <CarouselBadge />

      {/* 좌상단 감성 손글씨 문구 */}
      <div className="relative z-10">
        {handwriting && (
          <p
            className="text-2xl sm:text-3xl text-white font-bold leading-tight whitespace-pre-line tracking-wide drop-shadow-md"
            style={{ fontFamily: INSTA_THEME.fonts.handwritingGaegu }}
          >
            {handwriting}
          </p>
        )}
      </div>

      {/* 좌하단 정보 및 버튼 */}
      <div className="relative z-10 flex flex-col items-start pb-2">
        <NewBadge text={badge} className="px-3 py-0.5 text-xs font-black mb-3" />
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-xs sm:text-sm font-medium text-white/90 tracking-tight leading-snug drop-shadow-sm">
            {description}
          </p>
        )}

        {/* 흰색 원형 화살표 버튼 */}
        <div className="mt-5 w-9 h-9 rounded-full bg-white flex items-center justify-center text-black shadow-lg hover:scale-105 transition-transform cursor-pointer">
          <ArrowRight size={18} className="stroke-[2.5]" />
        </div>
      </div>
    </div>
  );
};
