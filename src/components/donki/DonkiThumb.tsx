import React from 'react';
import { DonkiItem } from '../../services/donkiService';

const POP_STYLE: Record<string, string> = {
  '의약품': 'bg-sky-50 text-sky-900',
  '화장품': 'bg-pink-50 text-pink-900',
  '과자·식품': 'bg-amber-50 text-amber-900',
  '생활용품': 'bg-emerald-50 text-emerald-900',
};

/**
 * 상품 사진 (모바일·PC·상세 공용).
 * 사진이 아직 없는 상품은 매장 가격표처럼 일본어 상품명을 크게 보여줘서 매대에서 찾기 쉽게 합니다.
 */
export const DonkiThumb: React.FC<{ item: DonkiItem; className?: string; pad?: string; big?: boolean }> = ({
  item, className = 'w-full h-full', pad = 'p-2', big = false,
}) => {
  if (item.imageUrl) {
    return (
      <div className={`${className} bg-white flex items-center justify-center overflow-hidden`}>
        <img src={item.imageUrl} alt={item.name} className={`w-full h-full object-contain ${pad}`} loading="lazy" />
      </div>
    );
  }
  return (
    <div className={`${className} ${POP_STYLE[item.category] || POP_STYLE['생활용품']} flex flex-col items-center justify-center text-center overflow-hidden px-2`}>
      <span className={`${big ? 'text-[13px] px-2.5 py-1' : 'text-[9.5px] px-1.5 py-0.5'} rounded-md bg-[#FFE600] text-black font-black`}>{item.brand}</span>
      <p className={`${big ? 'mt-3 text-[22px]' : 'mt-1.5 text-[13px]'} font-black leading-tight break-keep line-clamp-3`}>{item.nameJa || item.name}</p>
      <p className={`${big ? 'mt-2 text-[13px]' : 'mt-1 text-[9.5px]'} opacity-60 line-clamp-1`}>{item.name}</p>
    </div>
  );
};
