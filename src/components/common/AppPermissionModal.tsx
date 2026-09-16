import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Camera, 
  Image as ImageIcon, 
  MapPin, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Info
} from 'lucide-react';
import { requestPushPermission, checkPushPermissionStatus } from '../../services/notificationService';

export const AppPermissionModal: React.FC = () => {
  const { 
    isPermissionModalOpen, 
    setIsPermissionModalOpen,
    setIsNicknameModalOpen,
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
      if (granted) {
        showToast('🔔 알림 권한이 허용되었습니다.', 'success');
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

  // Allow All Permissions & Proceed
  const handleAllowAllAndProceed = async () => {
    setIsProcessing(true);
    try {
      // 1. Request Push Permission
      if (!notificationGranted) {
        try {
          const pushOk = await requestPushPermission();
          setNotificationGranted(pushOk);
        } catch (e) {}
      }

      // 2. Request Geolocation Permission
      if (!locationGranted && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        await new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            () => {
              setLocationGranted(true);
              resolve();
            },
            () => {
              resolve();
            },
            { timeout: 3000 }
          );
        });
      }

      // Mark permission modal as reviewed
      localStorage.setItem('sinsangpick_permissions_reviewed', 'true');
      showToast('앱 권한 설정이 완료되었습니다!', 'success');
    } catch (err) {
      console.warn('Permission batch request error:', err);
    } finally {
      setIsProcessing(false);
      setIsPermissionModalOpen(false);

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
      title: '알림 (선택)',
      desc: '신제품 출시 소식, 1+1 / 2+1 특가 프로모션 및 내 글 반응 알림 수신',
      isGranted: notificationGranted,
      onAction: handleRequestPush,
      badge: '추천'
    },
    {
      id: 'camera',
      icon: <Camera className="w-5 h-5 text-blue-500" />,
      bgColor: 'bg-blue-50 border-blue-100',
      title: '카메라 (선택)',
      desc: '신제품 솔직 후기 작성 시 즉석 사진 촬영 및 영수증 인증 첨부',
      isGranted: cameraGranted,
      onAction: handleRequestCamera
    },
    {
      id: 'photo',
      icon: <ImageIcon className="w-5 h-5 text-emerald-500" />,
      bgColor: 'bg-emerald-50 border-emerald-100',
      title: '사진 보관함 (선택)',
      desc: '보관 중인 신제품 사진 리뷰 등록 및 사진 저장',
      isGranted: true,
      onAction: () => showToast('사진 첨부 시 보관함에 접근합니다.', 'info')
    },
    {
      id: 'location',
      icon: <MapPin className="w-5 h-5 text-rose-500" />,
      bgColor: 'bg-rose-50 border-rose-100',
      title: '위치 정보 (선택)',
      desc: '내 주변 편의점(CU, GS25, 세븐일레븐 등) 및 마트 신상 재고 탐색',
      isGranted: locationGranted,
      onAction: handleRequestLocation
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-5 animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-250 border border-gray-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex flex-col items-center text-center space-y-2 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shadow-xs">
            <Sparkles className="w-6 h-6 fill-amber-500/20" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              앱 접근 권한 안내
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed max-w-[280px]">
              신상픽 서비스를 더 편리하고 쾌적하게 이용하기 위해 아래 권한에 동의해 주세요.
            </p>
          </div>
        </div>

        {/* Permission List Items */}
        <div className="space-y-2.5 pt-1 text-left">
          {permissionsList.map((item) => (
            <div 
              key={item.id}
              className="flex items-start gap-3 p-3 bg-gray-50/80 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${item.bgColor}`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-gray-900">{item.title}</span>
                    {item.badge && (
                      <span className="text-[9px] font-extrabold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
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
                      className="text-[11px] font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 px-2 py-0.5 rounded-full transition-colors cursor-pointer shrink-0"
                    >
                      허용하기
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Legal Guideline Box */}
        <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 text-[11px] text-gray-500 text-left leading-relaxed">
          <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <span>
            선택 접근 권한은 허용하지 않아도 기본 서비스를 이용하실 수 있습니다. 설정 &gt; 앱 접근권한에서 언제든 변경 가능합니다.
          </span>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleAllowAllAndProceed}
            disabled={isProcessing}
            className="w-full h-12 bg-gray-900 hover:bg-black active:scale-[0.99] text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-md transition-all cursor-pointer disabled:bg-gray-300"
          >
            {isProcessing ? (
              <span>권한 확인 중...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>권한 허용하고 시작하기</span>
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
