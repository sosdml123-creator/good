// src/components/admin/instagram/templates/CommonElements.tsx
import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, Star } from 'lucide-react';
import { INSTA_THEME } from '../theme';

/** 우측 상단 인스타그램 캐러셀(다중 이미지) 아이콘 */
export const CarouselBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute top-6 right-6 z-20 flex items-center justify-center ${className}`}>
    <div className="relative w-6 h-6">
      {/* 뒤쪽 겹친 사각형 */}
      <div className="absolute top-0 right-0 w-4 h-4 rounded-[4px] border-[2px] border-white/80 bg-white/20 shadow-sm" />
      {/* 앞쪽 사각형 */}
      <div className="absolute bottom-0 left-0 w-4 h-4 rounded-[4px] border-[2px] border-white/90 bg-white/90 shadow-sm" />
    </div>
  </div>
);

/** 어두운 배경/흰 배경 대비 캐러셀 아이콘 */
export const CarouselBadgeDark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute top-6 right-6 z-20 flex items-center justify-center ${className}`}>
    <div className="relative w-6 h-6">
      <div className="absolute top-0 right-0 w-4 h-4 rounded-[4px] border-[2px] border-gray-400 bg-gray-100/50 shadow-sm" />
      <div className="absolute bottom-0 left-0 w-4 h-4 rounded-[4px] border-[2px] border-gray-800 bg-gray-800/80 shadow-sm" />
    </div>
  </div>
);

/** 노란색 시그니처 NEW 뱃지 */
export const NewBadge: React.FC<{ text?: string; className?: string }> = ({
  text = 'NEW',
  className = '',
}) => (
  <span
    className={`inline-flex items-center justify-center font-black tracking-tight text-black px-2.5 py-0.5 rounded-full text-xs shadow-sm ${className}`}
    style={{ backgroundColor: INSTA_THEME.colors.primaryYellow }}
  >
    {text}
  </span>
);

/** 신상픽 라운드 테두리 반투명 태그 */
export const SinSangPickTag: React.FC<{ text?: string; className?: string }> = ({
  text = '신상픽',
  className = '',
}) => (
  <div
    className={`px-3 py-1 rounded-full text-xs font-bold tracking-tight bg-white/85 text-black backdrop-blur-sm shadow-sm border border-black/10 flex items-center gap-1 ${className}`}
  >
    <span>{text}</span>
  </div>
);

/** 별점 5점 평가 렌더러 */
export const StarRatingDisplay: React.FC<{ score: number; max?: number; size?: number }> = ({
  score,
  max = 5,
  size = 18,
}) => {
  return (
    <div className="inline-flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const isFilled = i + 1 <= Math.round(score);
        return (
          <Star
            key={i}
            size={size}
            className={`${isFilled ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-100'}`}
          />
        );
      })}
    </div>
  );
};

/** 하단 인스타그램 인터랙션 바 (좋아요, 댓글, 비행기, 저장) */
export const InstagramActionBar: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-between text-gray-800 pt-3 border-t border-gray-100/80 ${className}`}>
    <div className="flex items-center gap-4 text-xs font-semibold text-gray-700">
      <div className="flex items-center gap-1 hover:text-red-500 cursor-pointer transition-colors">
        <Heart size={18} className="stroke-[2.2]" />
        <span>좋아요</span>
      </div>
      <div className="flex items-center gap-1 hover:text-blue-500 cursor-pointer transition-colors">
        <MessageCircle size={18} className="stroke-[2.2]" />
        <span>댓글</span>
      </div>
      <div className="flex items-center gap-1 hover:text-gray-900 cursor-pointer transition-colors">
        <Send size={18} className="stroke-[2.2]" />
      </div>
    </div>
    <div className="text-gray-700 hover:text-black cursor-pointer">
      <Bookmark size={18} className="stroke-[2.2]" />
    </div>
  </div>
);
