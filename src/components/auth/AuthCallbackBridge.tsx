import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Smartphone, CheckCircle2, ArrowRight } from 'lucide-react';

export const AuthCallbackBridge: React.FC = () => {
  const [shouldShow, setShouldShow] = useState(false);
  const [deepLinkUrl, setDeepLinkUrl] = useState('');

  useEffect(() => {
    // If running inside the native Capacitor app, native listener handles it.
    if (Capacitor.isNativePlatform()) {
      return;
    }

    const hash = window.location.hash || '';
    const search = window.location.search || '';

    const hasAuthPayload = 
      hash.includes('access_token=') || 
      search.includes('code=') ||
      search.includes('app_redirect=') ||
      window.location.pathname.includes('auth-callback');

    if (!hasAuthPayload) {
      return;
    }

    // Check if user is on mobile (iOS or Android)
    const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints > 1 && /Macintosh/i.test(navigator.userAgent)); // iPadOS

    const fullTarget = `sinsangpick://auth-callback${search}${hash}`;
    setDeepLinkUrl(fullTarget);

    if (isMobileDevice) {
      setShouldShow(true);

      // Attempt immediate redirection to the native app scheme
      const timer = setTimeout(() => {
        try {
          window.location.href = fullTarget;
        } catch (e) {
          console.warn('Failed auto-redirect to native app:', e);
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!shouldShow) {
    return null;
  }

  const handleOpenApp = () => {
    if (deepLinkUrl) {
      window.location.href = deepLinkUrl;
    }
  };

  const handleStayOnWeb = () => {
    setShouldShow(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-[360px] w-full shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* App Icon / Graphic */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gray-100 text-gray-900 flex items-center justify-center shadow-inner">
          <Smartphone className="w-8 h-8 animate-bounce" />
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>로그인 인증 완료</span>
          </div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            신상픽 앱으로 이동 중...
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            아이폰 로그인이 완료되었습니다.<br />
            신상픽 앱으로 돌아가 서비스를 계속 이용하세요.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={handleOpenApp}
            className="w-full h-12 bg-gray-900 hover:bg-black active:scale-[0.98] text-white font-bold text-[14px] rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <span>신상픽 앱 열기</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleStayOnWeb}
            className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors cursor-pointer"
          >
            웹 브라우저에서 계속 이용하기
          </button>
        </div>

        <div className="text-[10px] text-gray-400">
          앱이 자동으로 열리지 않으면 <strong>[신상픽 앱 열기]</strong>를 탭해주세요.
        </div>
      </div>
    </div>
  );
};
