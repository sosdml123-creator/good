// src/components/admin/instagram/templates/CoverNewTemplate.tsx
import React from 'react';
import { CoverNewProps } from '../types';
import { CarouselBadge } from './CommonElements';
import { INSTA_THEME } from '../theme';

export const CoverNewTemplate: React.FC<CoverNewProps> = ({
  title1 = '지금, 가장 새로운 맛',
  title2 = '신상픽',
  handwriting = '새로운\n맛을\n만나다',
}) => {
  return (
    <div
      className="relative w-full h-full flex flex-col justify-between p-10 overflow-hidden select-none"
      style={{ backgroundColor: INSTA_THEME.colors.primaryYellow }}
    >
      {/* 우측 상단 인스타 캐러셀 아이콘 */}
      <CarouselBadge />

      {/* 상단 여백 보정 */}
      <div className="w-full flex justify-between items-start">
        <span className="text-xs tracking-wider font-extrabold text-black/60 uppercase">
          SINSANGPICK CURATION
        </span>
      </div>

      {/* 중앙 메인: 굵은 이탤릭 new 로고 + 방사선 + 서브카피 */}
      <div className="flex flex-col items-center justify-center text-center my-auto -mt-6">
        <div className="relative inline-block">
          {/* 우상단 방사형 효과선 3개 */}
          <div className="absolute -top-3 -right-6 flex gap-1 transform rotate-12">
            <span className="w-1.5 h-6 bg-black rounded-full transform -rotate-25 origin-bottom" />
            <span className="w-1.5 h-7 bg-black rounded-full transform rotate-0 origin-bottom" />
            <span className="w-1.5 h-6 bg-black rounded-full transform rotate-25 origin-bottom" />
          </div>

          <h1
            className="text-[96px] sm:text-[112px] font-black italic tracking-tighter text-black leading-none font-sans"
            style={{
              textShadow: '0 2px 0 rgba(0,0,0,0.05)',
              transform: 'skewX(-6deg)',
            }}
          >
            new
          </h1>
        </div>

        <div className="mt-6 flex flex-col items-center">
          <p className="text-xl sm:text-2xl font-bold text-black tracking-tight leading-snug">
            {title1}
          </p>
          <p className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-0.5">
            {title2}
          </p>
        </div>
      </div>

      {/* 우측 하단: 감성 손글씨 문구 */}
      <div className="w-full flex justify-end items-end">
        <div
          className="font-gaegu text-2xl sm:text-3xl text-black font-bold leading-tight text-right whitespace-pre-line transform -rotate-6"
          style={{ fontFamily: INSTA_THEME.fonts.handwritingGaegu }}
        >
          {handwriting}
        </div>
      </div>
    </div>
  );
};
