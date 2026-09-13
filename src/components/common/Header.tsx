import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Bell, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  const { setActiveTab, unreadNotificationCount } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-2xs">
      {/* 1. Top Search Bar & Action Icons */}
      <div className="flex items-center gap-2 px-3.5 py-2.5">
        {/* SinSangPick N Brand Logo */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-1.5 shrink-0 hover:opacity-90 active:scale-95 transition-all text-left group"
          title="신상픽 홈으로 이동"
        >
          <div className="w-8 h-8 rounded-xl overflow-hidden shadow-xs border border-gray-200 shrink-0">
            <img 
              src="/logo.png" 
              alt="신상픽" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
            />
          </div>
          <span className="text-[15px] font-black tracking-tight text-gray-900 hidden min-[370px]:inline">
            신상픽
          </span>
        </button>

        <button
          onClick={() => setActiveTab('search')}
          className="flex-1 flex items-center gap-2 bg-gray-100/90 rounded-full px-3 py-1.5 hover:bg-gray-200/70 transition-colors text-left"
        >
          <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="text-xs text-gray-400 font-medium truncate">
            신상품, 브랜드 검색
          </span>
        </button>

        <button
          onClick={() => setActiveTab('alert_settings')}
          className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
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

