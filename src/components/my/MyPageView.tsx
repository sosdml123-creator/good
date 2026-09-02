import React from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, ChevronRight } from 'lucide-react';

export const MyPageView: React.FC = () => {
  const { 
    bookmarkedIds, 
    comparedIds, 
    userPoints, 
    setActiveTab, 
    setSelectedCategory 
  } = useApp();

  const menuItems = [
    { label: '내가 쓴 리뷰', sub: '128개', action: () => { setSelectedCategory('전체'); setActiveTab('category'); } },
    { label: '찜한 제품', sub: `${bookmarkedIds.length}개`, action: () => { setSelectedCategory('전체'); setActiveTab('category'); } },
    { label: '비교함', sub: `${comparedIds.length}개`, action: () => setActiveTab('compare') },
    { label: '출시알림 설정', sub: '', action: () => setActiveTab('alert_settings') },
    { label: '포인트', sub: `${userPoints.toLocaleString()}P`, hi: true },
    { label: '설정', sub: '', action: () => setActiveTab('alert_settings') },
  ];

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-28">
      
      {/* 1. Blue profile header */}
      <div className="bg-[#0066FF] px-5 pt-5 pb-14 text-white">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop&q=80"
            alt="profile"
            className="w-14 h-14 rounded-full border-2 border-white/50 object-cover"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[16px] font-bold">신상러버</span>
              <span className="text-[10px] font-semibold bg-white/25 px-1.5 py-0.5 rounded-full">Lv.6</span>
            </div>
            <span className="text-[12px] text-white/70">신상 탐험이 내 취미!</span>
          </div>
          <button className="ml-auto p-1.5 hover:text-white/80">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Stats card */}
      <div className="px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 grid grid-cols-3 divide-x divide-gray-100 py-3 text-center">
          <div><div className="text-[20px] font-black text-gray-900">128</div><div className="text-[11px] text-gray-400 mt-0.5">리뷰</div></div>
          <div><div className="text-[20px] font-black text-gray-900">356</div><div className="text-[11px] text-gray-400 mt-0.5">팔로잉</div></div>
          <div><div className="text-[20px] font-black text-gray-900">{bookmarkedIds.length}</div><div className="text-[11px] text-gray-400 mt-0.5">찜한 제품</div></div>
        </div>
      </div>

      {/* 3. Menu list */}
      <div className="mt-4 bg-white divide-y divide-gray-100">
        {menuItems.map((m) => (
          <div
            key={m.label}
            onClick={m.action}
            className="flex items-center justify-between px-4 py-3.5 cursor-pointer active:bg-gray-50 hover:bg-gray-50/60"
          >
            <span className="text-[14px] font-semibold text-gray-800">{m.label}</span>
            <div className="flex items-center gap-2">
              {m.sub && (
                <span className={`text-[13px] ${m.hi ? 'text-[#0066FF] font-bold' : 'text-gray-400'}`}>
                  {m.sub}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
