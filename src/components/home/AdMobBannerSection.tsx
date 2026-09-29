import React, { useEffect, useRef, useState } from 'react';
import { HomeSectionConfig } from '../../types';
import { ADMOB_CONFIG, initAdMob, removeHomeBannerAd } from '../../services/admobService';
import { Megaphone, Info } from 'lucide-react';
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
  const adRef = useRef<HTMLModElement>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    // 1. Native platform: Remove bottom floating overlay banner to ensure in-feed placement
    if (Capacitor.isNativePlatform()) {
      removeHomeBannerAd().catch(() => {});
      initAdMob().catch((err) => {
        console.warn('[AdMobBannerSection] Native AdMob init notice:', err);
      });
    }

    // 2. Ensure Google Ad SDK script is loaded in document head
    if (typeof window !== 'undefined' && !document.getElementById('google-adsense-sdk')) {
      const script = document.createElement('script');
      script.id = 'google-adsense-sdk';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3878859120989916';
      document.head.appendChild(script);
    }

    // 3. Request Google AdMob Banner ad (Unit: ca-app-pub-3878859120989916/9433572199)
    try {
      if (typeof window !== 'undefined') {
        const timer = setTimeout(() => {
          try {
            if (adRef.current && !adRef.current.getAttribute('data-adsbygoogle-status')) {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
          } catch (e) {
            console.warn('[AdMobBannerSection] adsbygoogle push notice:', e);
          }
        }, 300);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn('[AdMobBannerSection] init error:', e);
    }
  }, []);

  return (
    <div key="ad_banner" className="bg-white py-3 px-4 border-b border-gray-100 transition-all duration-300">
      {/* 구좌 헤더: 명확한 광고(AD) 고지 및 Google AdMob 단위 표기 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1 border border-amber-300">
            <Megaphone className="w-3 h-3 text-amber-600" />
            {section?.badgeText || 'AD'}
          </span>
          <span className="text-[11px] text-gray-500 font-medium">
            {section?.subtitle || '신상픽 맞춤 혜택'}
          </span>
        </div>

        {/* 광고 단위 및 정보 확인 버튼 */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 hover:text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 transition-colors"
            title="광고 정보"
          >
            <span>AD</span>
            <Info className="w-2.5 h-2.5" />
          </button>
          <span className="text-[9px] font-bold text-gray-400">
            Google AdMob
          </span>
        </div>
      </div>

      {/* 광고 정보 안내 팝업 토글 */}
      {showInfo && (
        <div className="mb-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-600 flex items-center justify-between animate-fadeIn">
          <div>
            <p className="font-semibold text-gray-800">Google AdMob 공식 광고 구좌</p>
            <p className="text-[10px] text-gray-500 font-mono mt-0.5">광고 단위 ID: {ADMOB_CONFIG.bannerAdUnitId}</p>
          </div>
          <button 
            onClick={() => setShowInfo(false)}
            className="text-[10px] font-bold text-gray-600 underline ml-2 shrink-0"
          >
            닫기
          </button>
        </div>
      )}

      {/* Google AdMob 공식 배너 광고 슬롯 (단위 ID: ca-app-pub-3878859120989916/9433572199) */}
      <div
        id="admob-banner-container"
        data-ad-unit={ADMOB_CONFIG.bannerAdUnitId}
        data-ad-client="ca-pub-3878859120989916"
        data-ad-slot="9433572199"
        className="w-full flex items-center justify-center min-h-[90px] sm:min-h-[100px] rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 shadow-2xs relative"
      >
        {/* Google AdMob / AdSense 공식 ins 광고 슬롯 */}
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'center',
            margin: '0 auto',
          }}
          data-ad-client="ca-pub-3878859120989916"
          data-ad-slot="9433572199"
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
