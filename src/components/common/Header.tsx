import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Bell, Share2 } from 'lucide-react';
import { CATEGORIES } from '../../data/mockProducts';

export const Header: React.FC = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    setActiveTab 
  } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-2xs">
      {/* 1. Top Search Bar & Icons */}
      <div className="flex items-center gap-2 px-4 py-2.5">
        <button
          onClick={() => setActiveTab('search')}
          className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-3.5 py-2 hover:bg-gray-200/70 transition-colors text-left"
        >
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="text-xs text-gray-400 font-medium truncate">
            신상품, 먹거리, 브랜드 검색
          </span>
        </button>

        <button
          onClick={() => setActiveTab('alert_settings')}
          className="relative p-2 text-gray-700 hover:text-[#0066FF] transition-colors"
          title="출시 알림"
        >
          <Bell className="w-5 h-5 stroke-[2]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button
          onClick={() => setActiveTab('category')}
          className="p-2 text-gray-700 hover:text-[#0066FF] transition-colors"
          title="전체 카테고리 보기"
        >
          <Share2 className="w-5 h-5 stroke-[2]" />
        </button>
      </div>

      {/* 2. Horizontal Category Tabs (All 11+ Categories) */}
      <div className="flex overflow-x-auto no-scrollbar border-t border-gray-100 px-1">
        {CATEGORIES.map((c) => {
          const isActive = selectedCategory === c;
          return (
            <button
              key={c}
              onClick={() => {
                setSelectedCategory(c);
                if (c !== '전체') {
                  setActiveTab('category');
                }
              }}
              className={`shrink-0 px-3.5 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'text-[#0066FF] border-b-2 border-[#0066FF]'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>
    </header>
  );
};
