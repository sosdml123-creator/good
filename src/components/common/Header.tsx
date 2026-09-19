import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Bell, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  const { setActiveTab, openNotificationCenter, unreadNotificationCount } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-2xs">
      {/* 1. Top Search Bar & Action Icons */}
      <div className="flex items-center gap-2 px-3.5 py-2.5">
        <button
          onClick={() => setActiveTab('search')}
          className="flex-1 flex items-center gap-2.5 bg-gray-100/90 hover:bg-gray-200/80 rounded-2xl px-3.5 py-2 transition-all text-left shadow-2xs group cursor-pointer"
        >
          <Search className="w-4 h-4 text-gray-400 group-hover:text-gray-600 shrink-0 transition-colors" />
          <span className="text-xs text-gray-500 font-medium truncate">
            신상품, 편의점 행사, 브랜드 검색...
          </span>
        </button>

        <button
          onClick={() => openNotificationCenter('inbox')}
          className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
          title="알림 센터"
        >
          <Bell className="w-5 h-5 stroke-[2]" />
          {unreadNotificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('admin')}
          className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
          title="서비스 관리자 (Admin)"
        >
          <Settings className="w-5 h-5 stroke-[2]" />
        </button>
      </div>
    </header>
  );
};

