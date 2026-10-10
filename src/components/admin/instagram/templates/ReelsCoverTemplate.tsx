// src/components/admin/instagram/templates/ReelsCoverTemplate.tsx
import React from 'react';
import { ReelsCoverProps } from '../types';
import { CarouselBadge } from './CommonElements';
import { Clapperboard, Play } from 'lucide-react';
import { INSTA_THEME } from '../theme';

export const ReelsCoverTemplate: React.FC<ReelsCoverProps> = ({
  stickerText = '어거\n오늘 처음 봤어요!',
  bgImage = 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&auto=format&fit=crop',
  stickerTag = '신상픽',
  viewsCount = '12.5만',
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-gray-900 flex flex-col justify-between p-7">
      {/* 배경 사진 */}
      {bgImage && (
        <img
          src={bgImage}
          alt="릴스 썸네일"
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
      )}

      {/* 부드러운 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 z-0 pointer-events-none" />

      {/* 좌상단 릴스 아이콘 & 우상단 캐러셀 아이콘 */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white">
          <Clapperboard size={18} className="stroke-[2.2]" />
        </div>
      </div>
      <CarouselBadge />

      {/* 상단 스티커형 노란 말풍선 */}
      <div className="relative z-10 flex justify-center -mt-8">
        <div
          className="px-5 py-2.5 rounded-2xl shadow-xl transform -rotate-3 text-center border-2 border-white/40"
          style={{ backgroundColor: INSTA_THEME.colors.primaryYellow }}
        >
          <span
            className="text-lg sm:text-2xl font-black text-black tracking-tight whitespace-pre-line leading-tight"
            style={{ fontFamily: INSTA_THEME.fonts.handwritingGaegu }}
          >
            {stickerText}
          </span>
        </div>
      </div>

      {/* 중앙 집중선 및 상품 강조 효과 */}
      <div className="relative z-0 my-auto pointer-events-none">
        {/* 방사형 집중 라인들 */}
        <div className="absolute top-1/2 left-4 w-6 h-0.5 bg-white/70 rounded-full transform -rotate-12" />
        <div className="absolute top-1/2 left-5 -mt-3 w-5 h-0.5 bg-white/70 rounded-full transform -rotate-25" />
        <div className="absolute top-1/2 left-5 mt-3 w-5 h-0.5 bg-white/70 rounded-full transform rotate-12" />
      </div>

      {/* 하단 정보들: 좌측 조회수 알약 + 우측 신상픽 스티커 */}
      <div className="relative z-10 flex items-end justify-between w-full pb-1">
        {/* 좌하단 조회수 알약 */}
        {viewsCount ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold shadow-md">
            <Play size={12} className="fill-white" />
            <span>{viewsCount}</span>
          </div>
        ) : (
          <span />
        )}

        {/* 우하단 신상픽 노란 타원 스티커 */}
        <div
          className="px-4 py-1.5 rounded-full shadow-lg transform rotate-6 text-center border-2 border-white/60"
          style={{ backgroundColor: INSTA_THEME.colors.primaryYellow }}
        >
          <span className="text-xs sm:text-sm font-black text-black tracking-tight">
            {stickerTag}
          </span>
        </div>
      </div>
    </div>
  );
};
