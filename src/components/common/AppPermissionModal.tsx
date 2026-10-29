import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Tag, Sparkles } from 'lucide-react';
import {
  requestPushPermission,
  checkPushPermissionStatus,
  openDeviceSettings,
  setMarketingConsentStatus,
  shouldShowPushPrompt,
  snoozePushPrompt,
  completePushPrompt,
  syncDeviceConsent
} from '../../services/notificationService';

type DevicePermission = 'granted' | 'denied' | 'prompt';

export const AppPermissionModal: React.FC = () => {
  const {
    isPermissionModalOpen,
    setIsPermissionModalOpen,
    setIsNicknameModalOpen,
    currentUser,
    showToast
  } = useApp();

  const [devicePermission, setDevicePermission] = useState<DevicePermission>('prompt');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // 앱 진입 후(로그인 여부와 무관) 알림 동의 안내를 자동으로 띄웁니다.
  // 이미 허용했거나 기기에서 거부한 사용자는 건너뛰고, "나중에"를 누른 사용자는 며칠 뒤 다시 안내합니다.
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!shouldShowPushPrompt()) return;
      const status = await checkPushPermissionStatus().catch(() => 'prompt' as DevicePermission);
      if (status === 'granted') {
        // 마케팅 동의는 '알림 받기'를 직접 눌렀을 때만 기록합니다 (OS 권한이 이미 있다고 동의로 보지 않습니다)
        completePushPrompt();
        return;
      }
      if (status === 'denied') {
        completePushPrompt();
        return;
      }
      setIsPermissionModalOpen(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isPermissionModalOpen) return;
    checkPushPermissionStatus().then(setDevicePermission).catch(() => {});
  }, [isPermissionModalOpen]);

  if (!isPermissionModalOpen) return null;

  const finish = () => {
    setIsPermissionModalOpen(false);
    const hasSetNickname = localStorage.getItem('sinsangpick_nickname_set_' + currentUser.uid);
    if (!hasSetNickname && !currentUser.isAnonymous) {
      setIsNicknameModalOpen(true);
    }
  };

  const handleAllow = async () => {
    if (devicePermission === 'denied') {
      // 기기에서 이미 거부된 상태: 설정 화면으로 안내
      openDeviceSettings();
      showToast('기기 설정에서 알림을 켜주세요.', 'info');
      return;
    }
    setIsProcessing(true);
    try {
      const granted = await requestPushPermission();
      setMarketingConsentStatus(granted);
      localStorage.setItem('sinsangpick_push_enabled', String(granted));
      await syncDeviceConsent();
      if (granted) {
        completePushPrompt();
        showToast('🔔 알림이 켜졌어요. 신상·행사 소식을 가장 먼저 알려드릴게요!', 'success');
      } else {
        // 기기 권한창에서 거부 → 다시 묻지 않고 설정 화면에서 켤 수 있게 둡니다.
        completePushPrompt();
        showToast('알림이 꺼져 있어요. 마이 > 설정에서 언제든 켤 수 있어요.', 'info');
      }
    } catch (e) {
      console.warn('Push permission request error:', e);
    } finally {
      setIsProcessing(false);
      finish();
    }
  };

  const handleLater = () => {
    snoozePushPrompt();
    finish();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl px-6 pt-7 pb-6 shadow-2xl animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-amber-500 fill-amber-500/20 stroke-[2]" />
          </div>
          <h2 className="text-[19px] font-black text-gray-900 tracking-tight leading-snug">
            신상·행사 소식,<br />가장 먼저 받아볼까요?
          </h2>
          <p className="text-[13px] text-gray-500 leading-relaxed mt-2">
            편의점 신상 출시와 1+1·2+1 행사를<br />놓치지 않게 알림으로 알려드려요.
          </p>

          <div className="flex gap-2 mt-4">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3 h-3" /> 신상 출시
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full">
              <Tag className="w-3 h-3" /> 1+1·할인 행사
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-1">
          <button
            type="button"
            onClick={handleAllow}
            disabled={isProcessing}
            className="w-full h-12 bg-gray-900 hover:bg-black active:scale-[0.99] text-white rounded-2xl font-bold text-[15px] transition-all cursor-pointer disabled:bg-gray-300"
          >
            {isProcessing ? '잠시만요...' : devicePermission === 'denied' ? '기기 설정에서 알림 켜기' : '알림 받기'}
          </button>
          <button
            type="button"
            onClick={handleLater}
            className="w-full py-2.5 text-[13px] font-semibold text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
          >
            나중에
          </button>
        </div>

        <p className="text-[10px] text-gray-400 text-center leading-relaxed mt-1">
          광고성 정보 수신(선택)에 동의하는 것으로, 동의하지 않아도 서비스를 이용할 수 있어요.<br />
          마이 &gt; 설정에서 언제든 변경·철회할 수 있어요.
        </p>
      </div>
    </div>
  );
};
