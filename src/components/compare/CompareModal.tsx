import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, Star } from 'lucide-react';

export const CompareModal: React.FC = () => {
  const { 
    products, 
    comparedIds, 
    clearCompare, 
    openProductDetail, 
    goBack 
  } = useApp();

  const compared = products.filter(p => comparedIds.includes(p.id));
  const showList = compared.length >= 2 ? compared : [products[0], products[2]];

  const p1 = showList[0];
  const p2 = showList[1] || showList[0];

  return (
    <div className="bg-white min-h-screen pb-28">
      
      {/* 1. Exact Screen 6 Top Bar */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between z-30 shadow-2xs">
        <button
          onClick={goBack}
          className="p-1 -ml-1 text-gray-800 hover:text-gray-900"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <h1 className="text-base font-black text-gray-900">비교함</h1>

        <button
          onClick={clearCompare}
          className="text-xs font-bold text-[#0066FF] hover:opacity-80 px-2 py-1"
        >
          편집
        </button>
      </div>

      {/* 2. 전체 삭제 Link */}
      <div className="px-5 pt-3 pb-1">
        <button
          onClick={clearCompare}
          className="text-xs font-bold text-[#0066FF] hover:underline"
        >
          전체 삭제
        </button>
      </div>

      {/* 3. 2 Products Side-by-Side with Center VS */}
      <div className="p-5 flex items-center justify-between gap-3 text-center bg-white border-b border-gray-100">
        {/* Product 1 */}
        <div className="flex-1 min-w-0">
          <img
            src={p1.image}
            alt={p1.name}
            className="w-24 h-24 rounded-2xl object-cover mx-auto border border-gray-100 shadow-2xs mb-2"
          />
          <h3 className="text-xs font-bold text-gray-900 truncate">{p1.name}</h3>
          <span className="text-[10px] text-gray-400 block mt-0.5">{p1.brand}</span>
          <div className="flex items-center justify-center gap-0.5 text-xs font-bold text-[#0066FF] mt-1">
            <Star className="w-3 h-3 fill-[#0066FF]" />
            <span>{p1.overallRating.toFixed(1)}</span>
            <span className="text-gray-400 font-normal">({p1.ratingCount})</span>
          </div>
        </div>

        {/* Center VS Circle */}
        <div className="w-8 h-8 rounded-full bg-gray-100 text-[10px] font-black flex items-center justify-center text-gray-400 shrink-0">
          VS
        </div>

        {/* Product 2 */}
        <div className="flex-1 min-w-0">
          <img
            src={p2.image}
            alt={p2.name}
            className="w-24 h-24 rounded-2xl object-cover mx-auto border border-gray-100 shadow-2xs mb-2"
          />
          <h3 className="text-xs font-bold text-gray-900 truncate">{p2.name}</h3>
          <span className="text-[10px] text-gray-400 block mt-0.5">{p2.brand}</span>
          <div className="flex items-center justify-center gap-0.5 text-xs font-bold text-[#0066FF] mt-1">
            <Star className="w-3 h-3 fill-[#0066FF]" />
            <span>{p2.overallRating.toFixed(1)}</span>
            <span className="text-gray-400 font-normal">({p2.ratingCount})</span>
          </div>
        </div>
      </div>

      {/* 4. Comparison Bars (Blue on Left vs Light Green on Right) matching Screen 6 */}
      <div className="p-5 space-y-4 text-xs font-bold bg-white border-b border-gray-100">
        {/* 맛 */}
        <div className="flex items-center">
          <span className="w-16 text-gray-700">맛</span>
          <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden flex justify-end mr-1">
            <div className="bg-[#0066FF] h-full" style={{ width: `${(p1.detailedRating.taste / 5) * 100}%` }} />
          </div>
          <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden flex justify-start ml-1">
            <div className="bg-[#84CC16] h-full" style={{ width: `${(p2.detailedRating.taste / 5) * 100}%` }} />
          </div>
          <span className="w-8 text-right font-black text-gray-900">{p2.detailedRating.taste.toFixed(1)}</span>
        </div>

        {/* 가성비 */}
        <div className="flex items-center">
          <span className="w-16 text-gray-700">가성비</span>
          <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden flex justify-end mr-1">
            <div className="bg-[#0066FF] h-full" style={{ width: `${(p1.detailedRating.value / 5) * 100}%` }} />
          </div>
          <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden flex justify-start ml-1">
            <div className="bg-[#84CC16] h-full" style={{ width: `${(p2.detailedRating.value / 5) * 100}%` }} />
          </div>
          <span className="w-8 text-right font-black text-gray-900">{p2.detailedRating.value.toFixed(1)}</span>
        </div>

        {/* 양 */}
        <div className="flex items-center">
          <span className="w-16 text-gray-700">양</span>
          <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden flex justify-end mr-1">
            <div className="bg-[#0066FF] h-full" style={{ width: `${(p1.detailedRating.portion / 5) * 100}%` }} />
          </div>
          <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden flex justify-start ml-1">
            <div className="bg-[#84CC16] h-full" style={{ width: `${(p2.detailedRating.portion / 5) * 100}%` }} />
          </div>
          <span className="w-8 text-right font-black text-gray-900">{p2.detailedRating.portion.toFixed(1)}</span>
        </div>

        {/* 재구매 의사 */}
        <div className="flex items-center">
          <span className="w-16 text-gray-700">재구매 의사</span>
          <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden flex justify-end mr-1">
            <div className="bg-[#0066FF] h-full" style={{ width: `${(p1.detailedRating.repurchase / 5) * 100}%` }} />
          </div>
          <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden flex justify-start ml-1">
            <div className="bg-[#84CC16] h-full" style={{ width: `${(p2.detailedRating.repurchase / 5) * 100}%` }} />
          </div>
          <span className="w-8 text-right font-black text-gray-900">{p2.detailedRating.repurchase.toFixed(1)}</span>
        </div>
      </div>

      {/* 5. Bottom 2 Action Buttons matching Screen 6 */}
      <div className="p-5 flex gap-3 text-xs font-bold">
        <button
          onClick={() => openProductDetail(p1.id)}
          className="flex-1 py-3.5 rounded-2xl border border-gray-200 hover:border-[#0066FF] text-gray-800 font-bold shadow-2xs transition-colors text-center"
        >
          리뷰 보기
        </button>

        <button
          onClick={() => openProductDetail(p2.id)}
          className="flex-1 py-3.5 rounded-2xl border border-gray-200 hover:border-[#0066FF] text-gray-800 font-bold shadow-2xs transition-colors text-center"
        >
          리뷰 보기
        </button>
      </div>

    </div>
  );
};
