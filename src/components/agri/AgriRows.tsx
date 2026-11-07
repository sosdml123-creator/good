import React from 'react';
import { Heart } from 'lucide-react';
import type { Review } from '../../types';
import { useAgri } from './AgriContext';
import { Item, itemSpec, itemTitle, relTime, seafoodState } from './agriModel';
import { Change, Stars, Thumb } from './AgriUi';

/** 시세 한 줄: 사진 · 품목/규격 · 현재가 · 등락률 · 관심 */
export const ItemRow: React.FC<{ item: Item; rank?: number; showWatch?: boolean; right?: React.ReactNode }> = ({ item, rank, showWatch = true, right }) => {
  const { photo, openItem, isWatched, toggleWatch } = useAgri();
  const r = item.rep;
  const watched = isWatched(item.id);
  const state = seafoodState(r);
  const spec = itemSpec(r);
  return (
    <div className="flex items-center pl-4 pr-1.5 border-b border-[#F1F2F4] last:border-b-0">
      <button onClick={() => openItem(item.id)} className="flex-1 min-w-0 flex items-center gap-3 py-2.5 text-left active:bg-[#F7F8F9]">
        {rank !== undefined && <span className="w-4 shrink-0 text-[14px] font-semibold text-[#5A626B] tabular-nums">{rank}</span>}
        <Thumb src={photo(r.itemName)} name={r.itemName} size={40} />
        <span className="flex-1 min-w-0">
          <span className="flex items-center gap-1.5">
            <span className="truncate text-[15px] font-semibold text-[#191C20]">{itemTitle(r)}</span>
            {state && <span className="shrink-0 px-1 h-[18px] leading-[18px] rounded-[3px] bg-[#F1F2F4] text-[11px] text-[#5A626B]">{state}</span>}
          </span>
          <span className="block truncate text-[12px] text-[#8A929A] mt-0.5">{[spec, r.unit].filter(Boolean).join(' · ')}</span>
        </span>
        <span className="shrink-0 text-right">
          <span className="block text-[15px] font-bold text-[#191C20] tabular-nums">{r.today?.toLocaleString('ko-KR')}<span className="text-[12px] font-normal text-[#5A626B]">원</span></span>
          <span className="block mt-0.5">{right ?? <Change rate={r.changeRate} label={r.changeLabel && r.changeLabel !== '전일 대비' ? r.changeLabel.replace(' 대비', '') : undefined} />}</span>
        </span>
      </button>
      {showWatch && (
        <button
          onClick={() => toggleWatch(item)}
          aria-label={`${itemTitle(r)} 관심 품목${watched ? ' 해제' : ' 담기'}`}
          aria-pressed={watched}
          className="w-9 h-11 flex items-center justify-center"
        >
          <Heart className="w-[18px] h-[18px]" strokeWidth={1.8} color={watched ? '#1F6B62' : '#C3C8CD'} fill={watched ? '#1F6B62' : 'none'} />
        </button>
      )}
    </div>
  );
};

/** 후기 요약 한 줄 (홈 · 품목 상세) */
export const ReviewLine: React.FC<{ review: Review }> = ({ review }) => {
  const { openReview } = useAgri();
  const img = review.images?.[0];
  return (
    <button onClick={() => openReview(review.id)} className="w-full flex gap-3 px-4 py-3.5 text-left border-b border-[#F1F2F4] last:border-b-0 active:bg-[#F7F8F9]">
      <span className="flex-1 min-w-0">
        <span className="block truncate text-[12px] text-[#5A626B]">
          {review.productName}
          {review.purchasePrice ? ` · ${review.purchasePrice.toLocaleString('ko-KR')}원` : ''}
          {review.purchasePlace ? ` · ${review.purchasePlace}` : ''}
        </span>
        <span className="block mt-1 text-[14px] leading-[1.45] text-[#191C20] line-clamp-2">{review.headline || review.content}</span>
        <span className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-[#8A929A]">
          <Stars value={review.rating} size={11} />
          <span>{review.userName}</span>
          <span>·</span>
          <span>{relTime(review.createdAt)}</span>
        </span>
      </span>
      {img && <img src={img} alt="" loading="lazy" className="w-[68px] h-[68px] shrink-0 rounded-[6px] object-cover bg-[#F1F2F4]" />}
    </button>
  );
};
