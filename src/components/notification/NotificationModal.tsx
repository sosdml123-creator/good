import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, 
  Check, 
  Bell, 
  Sparkles, 
  Trash2, 
  ChevronRight, 
  Inbox, 
  SlidersHorizontal 
} from 'lucide-react';
import { AppNotification } from '../../types';

export const NotificationModal: React.FC = () => {
  const { 
    alertCategories, 
    toggleAlertCategory, 
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    openEventDetail,
    openProductDetail,
    goBack 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'inbox' | 'settings'>('inbox');

  const categories = [
    { id: '전체', label: '전체', icon: '🎯' },
    { id: '신제품', label: '신제품', icon: '⚡' },
    { id: '과자', label: '과자', icon: '🍿' },
    { id: '음료', label: '음료', icon: '🥤' },
    { id: '빵·디저트', label: '빵·디저트', icon: '🥐' },
    { id: '간편식', label: '간편식', icon: '🍲' },
    { id: '과일', label: '과일', icon: '🍑' },
    { id: '식재료', label: '식재료', icon: '🥚' },
    { id: '고기·수산', label: '고기·수산', icon: '🥩' },
    { id: '기타', label: '기타', icon: '🍺' },
  ];

  const handleNotificationClick = (n: AppNotification) => {
    markNotificationAsRead(n.id);
    if (n.type === 'event' && n.targetId) {
      openEventDetail(n.targetId);
    } else if (n.type === 'product' && n.targetId) {
      openProductDetail(n.targetId);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="bg-[#F8F9FA] min-h-full pb-16">
      {/* 1. Header Bar */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between z-30 shadow-2xs">
        <button
          onClick={goBack}
          className="p-1 -ml-1 text-gray-800 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <h1 className="text-base font-black text-gray-900">알림 센터</h1>

        <button
          onClick={goBack}
          className="text-xs font-black text-[#0066FF] hover:opacity-80 px-2 py-1"
        >
          완료
        </button>
      </div>

      {/* 2. Sub Tabs (Inbox / Settings) */}
      <div className="bg-white border-b border-gray-100 flex">
        <button
          onClick={() => setActiveSubTab('inbox')}
          className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors relative ${
            activeSubTab === 'inbox'
              ? 'text-[#0066FF] border-b-2 border-[#0066FF]'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>알림함</span>
          {unreadCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('settings')}
          className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
            activeSubTab === 'settings'
              ? 'text-[#0066FF] border-b-2 border-[#0066FF]'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>출시알림 설정</span>
        </button>
      </div>

      {/* 3. Subtab Content */}
      {activeSubTab === 'inbox' ? (
        <div className="p-4 space-y-3">
          {/* Inbox Header Actions */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-gray-500 font-medium">
              받은 알림 ({notifications.length})
            </span>
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-[11px] text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>전체 삭제</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 mt-2 shadow-2xs">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-gray-800">새로운 알림이 없습니다</p>
              <p className="text-[11px] text-gray-400 mt-1">신제품 출시 및 프로모션 소식을 바로 알려드릴게요</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 shadow-2xs ${
                    !n.isRead
                      ? 'bg-blue-50/40 border-blue-200 hover:bg-blue-50/70'
                      : 'bg-white border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {/* Thumbnail or Icon */}
                  {n.imageUrl ? (
                    <img
                      src={n.imageUrl}
                      alt="알림 이미지"
                      className="w-12 h-12 rounded-xl object-cover border border-gray-200 bg-white shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0066FF] flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  )}

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-[#0066FF] bg-blue-100/70 px-1.5 py-0.5 rounded">
                          {n.badge || '알림'}
                        </span>
                        {!n.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">{n.timestamp}</span>
                    </div>

                    <h4 className="text-xs font-bold text-gray-900 line-clamp-1 mt-0.5">
                      {n.title}
                    </h4>
                    <p className="text-[11px] text-gray-600 line-clamp-2 mt-0.5 leading-relaxed">
                      {n.body}
                    </p>

                    <div className="flex items-center gap-0.5 text-[10px] font-bold text-[#0066FF] mt-1.5">
                      <span>바로 확인하기</span>
                      <ChevronRight className="w-3 h-3 stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Settings Tab (3x3 Grid) */
        <div className="p-5">
          <div className="pb-4 text-center">
            <p className="text-xs text-gray-700 font-bold">
              알림을 받고 싶은 신제품 카테고리를 선택하세요
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              관심 카테고리의 신상이 등록되면 즉시 푸시로 알려드립니다
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => {
              const isSelected = alertCategories.includes(cat.id);

              return (
                <button
                  key={cat.id}
                  onClick={() => toggleAlertCategory(cat.id)}
                  className={`relative aspect-square p-3 rounded-2xl border flex flex-col items-center justify-center transition-all focus:outline-none shadow-2xs ${
                    isSelected
                      ? 'border-[#0066FF] bg-blue-50/50 shadow-xs ring-1 ring-[#0066FF]/30'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className="text-3xl mb-1">{cat.icon}</span>
                  <span className="text-xs font-bold text-gray-900">{cat.label}</span>

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#0066FF] text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

