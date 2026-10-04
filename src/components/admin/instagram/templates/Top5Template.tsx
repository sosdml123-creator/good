// src/components/admin/instagram/templates/Top5Template.tsx
import React from 'react';
import { Top5Props } from '../types';
import { CarouselBadgeDark, NewBadge } from './CommonElements';
import { Crown, ArrowRight } from 'lucide-react';
import { INSTA_THEME } from '../theme';

export const Top5Template: React.FC<Top5Props> = ({
  badge = 'THIS WEEK',
  title = '이번 주 신상 TOP 5',
  subText = '지금 가장 핫한 신상만 모았어요!',
  items = [
    { rank: 1, name: '삼양 불닭볶음면 까르보', category: '라면', image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=200&auto=format&fit=crop' },
    { rank: 2, name: '오리온 초코파이 하프', category: '간식', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&auto=format&fit=crop' },
    { rank: 3, name: '메가커피 흑임자라떼', category: '음료', image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=200&auto=format&fit=crop' },
    { rank: 4, name: '풀무원 두부면', category: '식품', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop' },
    { rank: 5, name: '하리보 골든베어 젤리', category: '간식', image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=200&auto=format&fit=crop' },
  ],
}) => {
  return (
    <div className="relative w-full h-full bg-white flex flex-col justify-between p-7 select-none overflow-hidden">
      {/* 우측 상단 인스타 캐러셀 아이콘 */}
      <CarouselBadgeDark />

      <div className="w-full">
        {/* 상단 뱃지 + 왕관 */}
        <div className="flex items-center justify-between mb-2">
          <NewBadge text={badge} className="px-3 py-0.5 text-xs font-black" />
          <Crown size={22} className="text-amber-400 mr-10 stroke-[2.2]" />
        </div>

        {/* 타이틀 및 서브카피 */}
        <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight leading-tight">
          {title}
        </h2>
        {subText && (
          <p className="mt-1 text-xs sm:text-sm text-gray-500 font-semibold tracking-tight">
            {subText}
          </p>
        )}

        {/* 1~5 순위 리스트 */}
        <div className="mt-5 space-y-2.5">
          {items.slice(0, 5).map((item) => (
            <div
              key={item.rank}
              className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-gray-50/80 transition-colors"
            >
              {/* 순위 노란 원형 뱃지 */}
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs sm:text-sm text-black shrink-0 shadow-sm"
                style={{ backgroundColor: INSTA_THEME.colors.primaryYellow }}
              >
                {item.rank}
              </div>

              {/* 상품 썸네일 */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100 flex items-center justify-center">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-amber-100" />
                )}
              </div>

              {/* 상품명 + 카테고리 */}
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-xs sm:text-sm font-black text-black truncate leading-tight">
                  {item.name}
                </p>
                <p className="text-[11px] font-semibold text-gray-400 mt-0.5 leading-none">
                  {item.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 우하단 화살표 버튼 */}
      <div className="flex justify-end items-center pt-2">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 hover:bg-gray-200 cursor-pointer">
          <ArrowRight size={16} className="stroke-[2.5]" />
        </div>
      </div>
    </div>
  );
};
