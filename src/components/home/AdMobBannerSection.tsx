import React, { useEffect, useRef } from 'react';
import { HomeSectionConfig } from '../../types';
import { initAdMob, showHomeBannerAd } from '../../services/admobService';
import { Capacitor } from '@capacitor/core';

interface AdMobBannerSectionProps {
  section?: HomeSectionConfig;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const AdMobBannerSection: React.FC<AdMobBannerSectionProps> = () => {
  const adRef = useRef<HTMLModElement>(null);
  const isRequestedRef = useRef(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Native iOS / Android: Initialize AdMob & Show Native Banner
      const timer = setTimeout(() => {
        initAdMob()
          .then(() => showHomeBannerAd())
          .catch((err) => {
            console.warn('[AdMobBannerSection] Native AdMob banner notice:', err);
          });
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // Web / Browser: Push Google AdSense/AdMob ad request
      if (!isRequestedRef.current && typeof window !== 'undefined') {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          isRequestedRef.current = true;
        } catch (e) {
          console.warn('[AdMobBannerSection] Web ad notice:', e);
        }
      }
    }
  }, []);

  return (
    <div key="ad_banner" className="bg-white py-2 px-4 border-b border-gray-100 flex flex-col items-center justify-center overflow-hidden">
      {/* Google AdMob 배너 광고 슬롯 (광고 단위 ID: ca-app-pub-3878859120989916/6084323850) */}
      <div className="w-full flex justify-center items-center min-h-[50px]">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', maxWidth: '360px', height: '50px', textAlign: 'center' }}
          data-ad-client="ca-pub-3878859120989916"
          data-ad-slot="6084323850"
          data-ad-format="horizontal"
          data-full-width-responsive="false"
        />
      </div>
    </div>
  );
};
