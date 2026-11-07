import React from 'react';
import type { Product } from '../../types';

export const PURCHASE_PLACES = ['대형마트', '전통시장', '동네 마트', '온라인몰', '산지 직송', '기타'];

/** 농수산물(과일·식재료·고기·수산, 시세 품목) 후기만 구매 가격·구매처를 받습니다. */
export const asksPurchaseInfo = (p: Product | null | undefined) =>
  Boolean(p) && (p!.itemType === 'fresh' || ['과일', '식재료', '고기·수산'].includes(p!.category as string) || p!.id.startsWith('kamis-'));

/** 숫자만 남긴 구매 가격 → 저장값 (비었거나 범위를 벗어나면 저장하지 않음) */
export const toPurchasePrice = (raw: string): number | undefined => {
  const n = Number(raw.replace(/[^\d]/g, ''));
  return n > 0 && n < 100000000 ? n : undefined;
};

/** 구매 가격 · 구매처 입력 (선택) */
export const PurchaseInfoFields: React.FC<{
  price: string;
  onPrice: (v: string) => void;
  place: string;
  onPlace: (v: string) => void;
  unitHint?: string;
}> = ({ price, onPrice, place, onPlace, unitHint }) => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-xs font-black text-gray-900">구매 정보</span>
      <span className="text-[10px] text-gray-400 font-medium">선택 · 다른 분들의 장보기에 도움이 돼요</span>
    </div>
    <label className="block">
      <span className="text-[11px] font-bold text-gray-500">구매 가격{unitHint ? ` (${unitHint} 기준이면 비교하기 좋아요)` : ''}</span>
      <span className="mt-1.5 flex items-center gap-2">
        <input
          inputMode="numeric"
          value={price ? Number(price).toLocaleString('ko-KR') : ''}
          onChange={e => onPrice(e.target.value.replace(/[^\d]/g, '').slice(0, 8))}
          placeholder="예: 12,900"
          aria-label="구매 가격"
          className="w-36 h-10 px-3 rounded-lg border border-gray-200 text-sm tabular-nums outline-none focus:border-gray-900"
        />
        <span className="text-sm text-gray-600">원</span>
      </span>
    </label>
    <div>
      <span className="text-[11px] font-bold text-gray-500">구매처</span>
      <div className="mt-1.5 flex flex-wrap gap-1.5" role="group" aria-label="구매처">
        {PURCHASE_PLACES.map(pl => (
          <button
            type="button"
            key={pl}
            onClick={() => onPlace(place === pl ? '' : pl)}
            aria-pressed={place === pl}
            className={`h-8 px-3 rounded-lg text-xs border ${place === pl ? 'border-gray-900 bg-gray-900 text-white font-bold' : 'border-gray-200 text-gray-600'}`}
          >
            {pl}
          </button>
        ))}
      </div>
    </div>
  </div>
);
