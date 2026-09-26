import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, 
  Check, 
  Bell, 
  Sparkles, 
  Trash2, 
  ChevronRight, 
  Inbox, 
  SlidersHorizontal,
  Moon,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { AppNotification } from '../../types';
import { 
  checkPushPermissionStatus, 
  openDeviceSettings,
  setMarketingConsentStatus,
  formatRelativeTime
} from '../../services/notificationService';
import { Capacitor } from '@capacitor/core';

export const NotificationModal: React.FC = () => {
  const { 
    alertCategories, 
    toggleAlertCategory, 
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    openEventDetail,
    openProductDetail,
    goBack,
    alertCenterSubTab,
    setAlertCenterSubTab,
    requestPushPermission,
    showToast
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'inbox' | 'settings'>(alertCenterSubTab || 'inbox');

  // Push notification toggles & status
  const [pushEnabled, setPushEnabled] = useState<boolean>(() => {
    return localStorage.getItem('sinsangpick_push_enabled') !== 'false';
  });
  const [nightPushEnabled, setNightPushEnabled] = useState<boolean>(() => {
    return localStorage.getItem('sinsangpick_night_push') === 'true';
  });
  const [devicePermission, setDevicePermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  // Check device push permission on mount & on subtab change
  useEffect(() => {
    checkPushPermissionStatus().then(status => {
      setDevicePermission(status);
    }).catch(() => {});
  }, [activeSubTab]);

  // Sync with global alertCenterSubTab state
  useEffect(() => {
    if (alertCenterSubTab) {
      setActiveSubTab(alertCenterSubTab);
    }
  }, [alertCenterSubTab]);

  const handleSubTabChange = (tab: 'inbox' | 'settings') => {
    setActiveSubTab(tab);
    setAlertCenterSubTab(tab);
  };

  const handleTogglePush = async () => {
    const next = !pushEnabled;
    setPushEnabled(next);
    localStorage.setItem('sinsangpick_push_enabled', String(next));
    setMarketingConsentStatus(next);

    if (next) {
      const ok = await requestPushPermission();
      if (ok) {
        setDevicePermission('granted');
        showToast('🔔 푸시 알림 허용이 켜졌습니다. 신제품과 할인 정보를 받아보세요!', 'success');
      } else {
        checkPushPermissionStatus().then(status => setDevicePermission(status)).catch(() => {});
        showToast('스마트폰 기기 설정에서 알림 허용이 필요합니다.', 'info');
      }
    } else {
      showToast('푸시 알림 수신이 비활성화되었습니다.', 'info');
    }
  };

  const handleToggleNightPush = () => {
    const next = !nightPushEnabled;
    setNightPushEnabled(next);
    localStorage.setItem('sinsangpick_night_push', String(next));
    if (next) {
      showToast('🌙 야간 혜택 알림(21시~08시)이 허용되었습니다.', 'success');
    } else {
      showToast('야간 혜택 알림이 비활성화되었습니다.', 'info');
    }
  };

  const handleOpenDeviceSettings = () => {
    if (Capacitor.isNativePlatform()) {
      openDeviceSettings();
      showToast('📱 기기 설정 화면으로 이동합니다.', 'info');
    } else {
      showToast('브라우저 주소창 좌측의 자물쇠/설정 아이콘에서 알림을 허용해주세요.', 'info');
    }
  };

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
          className="text-xs font-black text-gray-900 hover:opacity-80 px-2 py-1"
        >
          완료
        </button>
      </div>

      {/* 2. Sub Tabs (Inbox / Settings) */}
      <div className="bg-white border-b border-gray-100 flex">
        <button
          onClick={() => handleSubTabChange('inbox')}
          className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors relative ${
            activeSubTab === 'inbox'
              ? 'text-gray-900 border-b-2 border-gray-900'
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
          onClick={() => handleSubTabChange('settings')}
          className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
            activeSubTab === 'settings'
              ? 'text-gray-900 border-b-2 border-gray-900'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>알림 및 권한 설정</span>
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
                      ? 'bg-gray-50/80 border-gray-300 hover:bg-gray-100/70'
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
                    <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  )}

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
                          {n.badge || '알림'}
                        </span>
                        {!n.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {formatRelativeTime(n.createdAt || n.timestamp, n.id)}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-gray-900 line-clamp-1 mt-0.5">
                      {n.title}
                    </h4>
                    <p className="text-[11px] text-gray-600 line-clamp-2 mt-0.5 leading-relaxed">
                      {n.body}
                    </p>

                    <div className="flex items-center gap-0.5 text-[10px] font-bold text-gray-900 mt-1.5">
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
        /* Settings Tab (앱 알림 허용 켜는곳 & 카테고리 설정) */
        <div className="p-4 space-y-4">
          {/* Section 1: Main App Push Toggle (신제품 및 할인정보 안내) */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 mt-0.5">
                  <Bell className="w-5 h-5 fill-amber-500/20" />
                </div>
                <div>
                  <div className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                    <span>신상픽 앱 푸시 알림 허용</span>
                    <span className="text-[9px] font-extrabold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                      신제품·할인
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    실시간 신제품 출시 소식과 1+1 · 2+1 특가 할인, 프로모션 혜택을 푸시로 알려드립니다.
                  </p>
                </div>
              </div>

              {/* Master Toggle Switch */}
              <button
                onClick={handleTogglePush}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 cursor-pointer ${
                  pushEnabled ? 'bg-gray-900' : 'bg-gray-200'
                }`}
                aria-label="푸시 알림 허용 토글"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    pushEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Quick Benefits Highlight */}
            <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-2.5 text-[11px] text-amber-900 flex items-center gap-2">
              <span className="text-sm shrink-0">💡</span>
              <span className="font-medium">
                알림을 켜두시면 전국 편의점·마트 신상 소식과 특가 할인 행사를 가장 먼저 확인하실 수 있습니다.
              </span>
            </div>
          </div>

          {/* Section 2: Device Permission Status & System Settings Link */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gray-700" />
                <span className="text-xs font-bold text-gray-900">스마트폰 기기 알림 권한</span>
              </div>

              {devicePermission === 'granted' ? (
                <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>기기 알림 허용됨</span>
                </span>
              ) : (
                <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>기기 알림 권한 필요</span>
                </span>
              )}
            </div>

            <p className="text-[11px] text-gray-500 leading-relaxed">
              {devicePermission === 'granted'
                ? '스마트폰 시스템 알림이 정상적으로 켜져 있어 신제품 및 할인 혜택 푸시를 바로 받으실 수 있습니다.'
                : '스마트폰 OS 설정에서 신상픽 알림이 차단되어 있으면 푸시 알림을 수신할 수 없습니다.'}
            </p>

            {devicePermission !== 'granted' && (
              <button
                type="button"
                onClick={handleOpenDeviceSettings}
                className="w-full mt-1 py-2 px-3 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <span>⚙️ 스마트폰 설정에서 알림 허용 켜기</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Section 3: Night Push Toggle */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">야간 혜택 알림 허용</div>
                <div className="text-[11px] text-gray-400">밤 9시 ~ 아침 8시 사이 특가/체험단 알림</div>
              </div>
            </div>
            <button
              onClick={handleToggleNightPush}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                nightPushEnabled ? 'bg-gray-900' : 'bg-gray-200'
              }`}
              aria-label="야간 알림 토글"
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  nightPushEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Section 4: Interest Categories Selection */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs space-y-3">
            <div className="text-left">
              <h3 className="text-xs font-bold text-gray-900">
                관심 카테고리 출시알림 설정
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                선택한 카테고리의 신제품이 등록되면 즉시 푸시로 알려드립니다
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {categories.map((cat) => {
                const isSelected = alertCategories.includes(cat.id);

                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleAlertCategory(cat.id)}
                    className={`relative aspect-square p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all focus:outline-none shadow-2xs cursor-pointer ${
                      isSelected
                        ? 'border-gray-900 bg-gray-50 shadow-xs ring-1 ring-gray-900'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl mb-1">{cat.icon}</span>
                    <span className="text-xs font-bold text-gray-900">{cat.label}</span>

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-gray-900 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


