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
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const requestedRef = useRef(false);

  useEffect(() => {
    // 1. Native platform: Ensure any bottom overlay banner is removed (no bottom sticking)
    if (Capacitor.isNativePlatform()) {
      removeHomeBannerAd().catch(() => {});
      initAdMob().catch((err) => {
        console.warn('[AdMobBannerSection] Native AdMob init notice:', err);
      });
    }

    // 2. Load Google AdMob / AdSense SDK script if not already present
    if (typeof window !== 'undefined' && !document.getElementById('admob-sdk-script')) {
      const script = document.createElement('script');
      script.id = 'admob-sdk-script';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3878859120989916';
      document.head.appendChild(script);
    }

    // 3. Request AdMob ad slot fill (Ad Unit: ca-app-pub-3878859120989916/6084323850)
    if (!requestedRef.current && typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          requestedRef.current = true;
        } catch (e) {
          console.warn('[AdMobBannerSection] adsbygoogle request notice:', e);
          setAdError(true);
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, []);

  // Monitor ins element for ad load
  useEffect(() => {
    const el = adRef.current;
    if (!el) return;

    const observer = new MutationObserver(() => {
      if (el.getAttribute('data-ad-status') === 'filled' || el.children.length > 0) {
        setIsAdLoaded(true);
      }
      if (el.getAttribute('data-ad-status') === 'unfilled') {
        setAdError(true);
      }
    });

    observer.observe(el, { attributes: true, childList: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div key="ad_banner" className="bg-white py-3 px-4 border-b border-gray-100 transition-all duration-300">
      {/* 구좌 헤더: 명확한 광고(AD) 고지 및 AdMob 단위 표기 */}
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

      {/* Google AdMob 공식 광고 슬롯 컨테이너 (단위 ID: ca-app-pub-3878859120989916/6084323850) */}
      <div
        id="admob-banner-container"
        data-ad-unit={ADMOB_CONFIG.bannerAdUnitId}
        data-ad-client="ca-pub-3878859120989916"
        data-ad-slot="6084323850"
        className="w-full flex flex-col items-center justify-center min-h-[90px] rounded-xl overflow-hidden bg-slate-50/80 border border-dashed border-gray-200 relative"
      >
        {/* Google AdMob / AdSense ins 광고 슬롯 */}
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '100%',
            minWidth: '300px',
            maxWidth: '360px',
            height: '90px',
            textAlign: 'center',
            margin: '0 auto',
          }}
          data-ad-client="ca-pub-3878859120989916"
          data-ad-slot="6084323850"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />

        {/* 광고 로딩 전 / 미노출 시 보여주는 공식 AdMob 구좌 안내 카드 */}
        {(!isAdLoaded || adError) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center pointer-events-none bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-amber-500/5">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[9px] font-black text-white bg-amber-600 px-1.5 py-0.2 rounded">
                AD
              </span>
              <span className="text-[11px] font-bold text-gray-700">
                Google AdMob 스폰서 구좌
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono">
              단위: {ADMOB_CONFIG.bannerAdUnitId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
