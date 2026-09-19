import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Camera, 
  MapPin, 
  Check, 
  Sparkles, 
  Info,
  Tag,
  Zap,
  Gift
} from 'lucide-react';
import { 
  requestPushPermission, 
  checkPushPermissionStatus, 
  openDeviceSettings,
  setMarketingConsentStatus 
} from '../../services/notificationService';

export const AppPermissionModal: React.FC = () => {
  const { 
    isPermissionModalOpen, 
    setIsPermissionModalOpen,
    setIsNicknameModalOpen,
    openNotificationCenter,
    currentUser,
    showToast 
  } = useApp();

  const [notificationGranted, setNotificationGranted] = useState<boolean>(false);
  const [locationGranted, setLocationGranted] = useState<boolean>(false);
  const [cameraGranted, setCameraGranted] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Check initial permission states on mount/open
  useEffect(() => {
    if (!isPermissionModalOpen) return;

    // 1. Notification Permission Check
    checkPushPermissionStatus().then(status => {
      setNotificationGranted(status === 'granted');
    }).catch(() => {});

    // 2. Geolocation Permission Check
    if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
      navigator.permissions?.query({ name: 'geolocation' as PermissionName })
        .then(result => {
          setLocationGranted(result.state === 'granted');
        })
        .catch(() => {});
    }

    // 3. Camera Check
    if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
      navigator.permissions?.query({ name: 'camera' as PermissionName })
        .then(result => {
          setCameraGranted(result.state === 'granted');
        })
        .catch(() => {});
    }
  }, [isPermissionModalOpen]);

  if (!isPermissionModalOpen) return null;

  // Request Individual Push Permission
  const handleRequestPush = async () => {
    try {
      const granted = await requestPushPermission();
      setNotificationGranted(granted);
      setMarketingConsentStatus(granted);
      if (granted) {
        localStorage.setItem('sinsangpick_push_enabled', 'true');
        showToast('🔔 알림 수신 동의가 완료되었습니다! 신제품과 할인 소식을 보내드릴게요.', 'success');
      } else {
        showToast('스마트폰 설정에서 알림 허용이 필요합니다.', 'info');
        openDeviceSettings();
      }
    } catch (e) {
      console.warn('Push permission request error:', e);
    }
  };

  // Request Individual Location Permission
  const handleRequestLocation = async () => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationGranted(true);
          showToast('📍 위치 정보 권한이 허용되었습니다.', 'success');
        },
        (err) => {
          console.warn('Location permission denied/error:', err);
          setLocationGranted(false);
        },
        { timeout: 5000 }
      );
    }
  };

  // Request Individual Camera Permission
  const handleRequestCamera = async () => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setCameraGranted(true);
        showToast('📷 카메라 권한이 허용되었습니다.', 'success');
      } catch (err) {
        console.warn('Camera permission denied:', err);
        setCameraGranted(false);
      }
    } else {
      setCameraGranted(true);
    }
  };

  // Agree & Go to App Notification Settings
  const handleAgreeAndProceed = async () => {
    setIsProcessing(true);
    try {
      // 1. Request Push Permission (Web & Native)
      let pushOk = false;
      try {
        pushOk = await requestPushPermission();
        setNotificationGranted(pushOk);
      } catch (e) {}

      // Record Marketing & Push consent
      setMarketingConsentStatus(true);
      localStorage.setItem('sinsangpick_push_enabled', 'true');
      localStorage.setItem('sinsangpick_permissions_reviewed', 'true');

      // 2. Request Geolocation Permission quietly
      if (!locationGranted && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        await new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            () => {
              setLocationGranted(true);
              resolve();
            },
            () => resolve(),
            { timeout: 2000 }
          );
        });
      }

      if (pushOk) {
        showToast('🔔 알림 수신에 동의하셨습니다! 신제품 및 할인 정보를 빠르게 알려드릴게요.', 'success');
      } else {
        showToast('앱 알림 허용을 위해 알림 설정 화면으로 이동합니다.', 'info');
        openDeviceSettings();
      }
    } catch (err) {
      console.warn('Permission batch request error:', err);
    } finally {
      setIsProcessing(false);
      setIsPermissionModalOpen(false);

      // Navigate to "앱 알림 허용 켜는곳" (Notification Settings tab)
      openNotificationCenter('settings');

      // If user needs initial nickname setup, trigger NicknameSetupModal
      const hasSetNickname = localStorage.getItem('sinsangpick_nickname_set_' + currentUser.uid);
      if (!hasSetNickname && !currentUser.isAnonymous) {
        setIsNicknameModalOpen(true);
      }
    }
  };

  const handleSkip = () => {
    localStorage.setItem('sinsangpick_permissions_reviewed', 'true');
    setIsPermissionModalOpen(false);

    // If user needs initial nickname setup, trigger NicknameSetupModal
    const hasSetNickname = localStorage.getItem('sinsangpick_nickname_set_' + currentUser.uid);
    if (!hasSetNickname && !currentUser.isAnonymous) {
      setIsNicknameModalOpen(true);
    }
  };

  const permissionsList = [
    {
      id: 'notification',
      icon: <Bell className="w-5 h-5 text-amber-500" />,
      bgColor: 'bg-amber-50 border-amber-100',
      title: '알림 및 마케팅 정보 수신 (선택)',
      desc: '신제품 출시 소식, 1+1 / 2+1 특가 프로모션 및 깜짝 할인 혜택 알림',
      isGranted: notificationGranted,
      onAction: handleRequestPush,
      badge: '신제품·할인'
    },
    {
      id: 'location',
      icon: <MapPin className="w-5 h-5 text-rose-500" />,
      bgColor: 'bg-rose-50 border-rose-100',
      title: '위치 정보 (선택)',
      desc: '내 주변 편의점(CU, GS25, 세븐일레븐 등) 및 마트 신상 재고 탐색',
      isGranted: locationGranted,
      onAction: handleRequestLocation
    },
    {
      id: 'camera',
      icon: <Camera className="w-5 h-5 text-blue-500" />,
      bgColor: 'bg-blue-50 border-blue-100',
      title: '카메라 및 사진 (선택)',
      desc: '신제품 솔직 후기 작성 시 즉석 사진 촬영 및 영수증 인증 첨부',
      isGranted: cameraGranted,
      onAction: handleRequestCamera
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-250 border border-gray-100 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex flex-col items-center text-center space-y-2 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shadow-xs">
            <Bell className="w-6 h-6 fill-amber-500/20 stroke-[2.2]" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 bg-amber-100/70 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full mb-0.5">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>신상픽 혜택 알림 안내</span>
            </div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              마케팅 정보 &amp; 알림 수신 동의
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed max-w-[300px]">
              신제품 소식과 할인 혜택을 실시간으로 확인해보세요.
            </p>
          </div>
        </div>

        {/* Marketing Notification Benefit Announcement Card */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/80 border border-amber-200/80 rounded-2xl p-4 text-left shadow-2xs space-y-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🎁</span>
            <span className="text-xs font-black text-amber-950 tracking-tight">
              알림 수신 동의 시 받는 특별 혜택
            </span>
            <span className="text-[9px] font-extrabold bg-amber-200/80 text-amber-800 px-1.5 py-0.5 rounded-full ml-auto">
              혜택 안내
            </span>
          </div>

          <p className="text-[12px] font-bold text-gray-800 leading-snug">
            알림 수신에 동의하시면 <span className="text-amber-600 font-black underline decoration-amber-400">신제품 출시 소식</span>과 <span className="text-rose-600 font-black underline decoration-rose-300">1+1·할인 특가 정보</span>를 실시간으로 가장 먼저 얻을 수 있습니다!
          </p>

          <div className="grid grid-cols-1 gap-1.5 pt-0.5">
            <div className="flex items-center gap-2 text-[11px] text-gray-700">
              <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span><strong>실시간 신상 알림:</strong> 전국 편의점·마트 신상 매일 자동 수집</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-700">
              <Tag className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span><strong>1+1 / 2+1 할인 특가:</strong> 놓칠 수 없는 갓성비 행사 정보</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-700">
              <Gift className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span><strong>게릴라 이벤트 &amp; 쿠폰:</strong> 신제품 체험단 및 포인트 혜택</span>
            </div>
          </div>
        </div>

        {/* Permission List Items */}
        <div className="space-y-2 text-left">
          {permissionsList.map((item) => (
            <div 
              key={item.id}
              className="flex items-start gap-3 p-3 bg-gray-50/80 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${item.bgColor}`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-black text-gray-900 truncate">{item.title}</span>
                    {item.badge && (
                      <span className="text-[9px] font-extrabold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.isGranted ? (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 shrink-0 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>허용됨</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={item.onAction}
                      className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer shrink-0"
                    >
                      동의하기
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Legal Notice Box (정보통신망법 규정 준수) */}
        <div className="flex items-start gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-[10px] text-gray-500 text-left leading-relaxed">
          <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p>선택 접근 권한은 동의하지 않아도 기본 서비스 이용이 가능합니다.</p>
            <p className="text-gray-400">
              ※ 수신 동의 시 광고성 정보(신제품, 할인 혜택)가 앱 푸시로 전송되며, 알림 설정에서 언제든지 수신 동의를 변경하거나 철회할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleAgreeAndProceed}
            disabled={isProcessing}
            className="w-full h-12 bg-gray-900 hover:bg-black active:scale-[0.99] text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-md transition-all cursor-pointer disabled:bg-gray-300"
          >
            {isProcessing ? (
              <span>설정 적용 중...</span>
            ) : (
              <>
                <Bell className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>동의하기 (알림 허용 및 설정으로 이동)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="w-full py-2 text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
          >
            다음에 설정하기
          </button>
        </div>
      </div>
    </div>
  );
};

