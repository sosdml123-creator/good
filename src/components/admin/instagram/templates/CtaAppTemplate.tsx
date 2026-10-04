// src/components/admin/instagram/templates/CtaAppTemplate.tsx
import React from 'react';
import { CtaAppProps } from '../types';
import { CarouselBadge } from './CommonElements';
import { Sparkles } from 'lucide-react';
import { INSTA_THEME } from '../theme';

export const CtaAppTemplate: React.FC<CtaAppProps> = ({
  handwriting = '더 많은 신상이\n궁금하다면?',
  buttonText = '앱에서 만나요 →',
  mockImage,
}) => {
  return (
    <div
      className="relative w-full h-full flex items-center justify-between p-8 select-none overflow-hidden"
      style={{ backgroundColor: INSTA_THEME.colors.primaryYellow }}
    >
      {/* 우측 상단 인스타 캐러셀 아이콘 */}
      <CarouselBadge />

      {/* 좌측 카피 & CTA & new 로고 */}
      <div className="flex-1 flex flex-col justify-between h-full z-10 pr-2">
        {/* 상단 손글씨 질문 */}
        <div className="pt-4">
          <p
            className="text-2xl sm:text-3xl text-black font-bold leading-tight whitespace-pre-line transform -rotate-3"
            style={{ fontFamily: INSTA_THEME.fonts.handwritingGaegu }}
          >
            {handwriting}
          </p>
        </div>

        {/* 중앙 CTA 버튼 */}
        <div className="my-auto py-4">
          <button
            type="button"
            className="px-5 py-2.5 rounded-full bg-black text-white text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-lg hover:scale-105 transition-transform"
          >
            <span>{buttonText}</span>
          </button>
        </div>

        {/* 좌하단 new 로고 + 신상픽 */}
        <div className="pb-2">
          <h3
            className="text-4xl sm:text-5xl font-black italic tracking-tighter text-black leading-none font-sans"
            style={{ transform: 'skewX(-6deg)' }}
          >
            new
          </h3>
          <p className="text-xs sm:text-sm font-bold text-black tracking-tight mt-0.5">
            신상픽
          </p>
        </div>
      </div>

      {/* 우측 스마트폰 목업 */}
      <div className="relative w-44 sm:w-52 h-[90%] shrink-0 flex items-center justify-center transform translate-x-3 rotate-1 shadow-2xl">
        {/* 스마트폰 외곽 테두리 (아이폰 스타일) */}
        <div className="relative w-full h-full bg-black rounded-[36px] p-2.5 shadow-2xl border-[3px] border-gray-800 flex flex-col overflow-hidden">
          {/* 상단 다이나믹 아일랜드 / 스피커 */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-black rounded-full z-30 flex items-center justify-end pr-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-900/40" />
          </div>

          {/* 폰 화면 내부 */}
          <div className="relative w-full h-full bg-white rounded-[28px] overflow-hidden flex flex-col">
            {mockImage ? (
              <img
                src={mockImage}
                alt="앱 화면"
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
              />
            ) : (
              /* 신상픽 인앱 홈 화면 목업 UI */
              <div className="w-full h-full bg-white flex flex-col p-2.5 pt-6 text-[9px] font-sans">
                {/* 상단 헤더 */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-1">
                    <span className="font-black text-xs italic">new</span>
                    <span className="font-extrabold text-[10px]">신상픽</span>
                  </div>
                  <Sparkles size={12} className="text-amber-400" />
                </div>

                {/* 오늘의 신상 배너 카드 */}
                <div className="mt-2 p-2 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="font-black text-[9px] text-amber-700">👑 오늘의 신상</span>
                  <p className="font-bold text-[10px] text-gray-900 mt-0.5 leading-tight">
                    편의점 핫신상 모음
                  </p>
                </div>

                {/* 실시간 랭킹 리스트 목업 */}
                <div className="mt-2 flex-1 space-y-1.5 overflow-hidden">
                  <div className="flex items-center gap-1.5 p-1 rounded-lg bg-gray-50">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-300 font-bold text-[8px] flex items-center justify-center">1</span>
                    <div className="w-4 h-4 rounded bg-red-100" />
                    <span className="font-bold text-[8px] truncate">불닭볶음면 까르보</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 rounded-lg bg-gray-50">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-300 font-bold text-[8px] flex items-center justify-center">2</span>
                    <div className="w-4 h-4 rounded bg-amber-100" />
                    <span className="font-bold text-[8px] truncate">초코파이 하프</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 rounded-lg bg-gray-50">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-300 font-bold text-[8px] flex items-center justify-center">3</span>
                    <div className="w-4 h-4 rounded bg-gray-200" />
                    <span className="font-bold text-[8px] truncate">흑임자라떼</span>
                  </div>
                </div>

                {/* 하단 탭바 목업 */}
                <div className="pt-2 border-t border-gray-100 flex justify-around text-gray-400 text-[8px]">
                  <span className="font-bold text-blue-600">홈</span>
                  <span>신상</span>
                  <span>랭킹</span>
                  <span>마이</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
