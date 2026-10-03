import React, { useEffect, useRef } from 'react';
import { HomeSectionConfig } from '../../types';
import { Capacitor } from '@capacitor/core';

interface AdMobBannerSectionProps {
  section?: HomeSectionConfig;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const AdMobBannerSection: React.FC<AdMobBannerSectionProps> = ({ section }) => {
  const isNative = Capacitor.isNativePlatform();
  const adRef = useRef<HTMLModElement>(null);
  const requestedRef = useRef<boolean>(false);

  useEffect(() => {
    // 1. 네이티브 앱(iOS/Android) 환경인 경우
    if (isNative) {
      // 네이티브는 admobService/Capacitor AdMob SDK를 통해 처리
      return;
    }

    // 2. 웹 환경: Google AdSense/AdMob 스크립트 주입 (1회)
    if (typeof window !== 'undefined' && !document.getElementById('google-adsense-sdk')) {
      const script = document.createElement('script');
      script.id = 'google-adsense-sdk';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3878859120989916';
      document.head.appendChild(script);
    }

    // 3. 광고 요청 push (중복 실행 방지)
    const timer = setTimeout(() => {
      try {
        if (adRef.current && !requestedRef.current) {
          const status = adRef.current.getAttribute('data-adsbygoogle-status');
          if (!status) {
            requestedRef.current = true;
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        }
      } catch (e) {
        console.warn('[AdMob] adsbygoogle push error:', e);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [isNative]);

  return (
    <div 
      key="ad_banner" 
      className="bg-white py-2 px-4 border-b border-gray-100 transition-all duration-200"
    >
      {/* AdMob 정책 준수: 상단 명확한 AD 표기 */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
            {section?.badgeText || 'AD'}
          </span>
          <span className="text-[11px] text-gray-400 font-medium">
            {section?.subtitle || '스폰서'}
          </span>
        </div>
      </div>

      {/* 구글 공식 광고 슬롯 (임의의 더미 배너 없이 오직 구글 공식 광고만 렌더링) */}
      <div 
        className="w-full flex items-center justify-center min-h-[50px] sm:min-h-[90px] rounded-xl overflow-hidden bg-gray-50/50"
      >
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'center',
            margin: '0 auto',
            minHeight: '50px',
          }}
          data-ad-client="ca-pub-3878859120989916"
          data-ad-slot="9433572199"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
