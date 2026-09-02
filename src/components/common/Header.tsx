import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Bell, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-2xs">
      {/* 1. Top Search Bar & Action Icons */}
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
          onClick={() => setActiveTab('admin')}
          className="p-2 text-gray-700 hover:text-[#0066FF] transition-colors"
          title="서비스 관리자 (Admin)"
        >
          <Settings className="w-5 h-5 stroke-[2]" />
        </button>
      </div>
    </header>
  );
};

