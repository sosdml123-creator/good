import React, { useEffect, useRef, useState } from 'react';
import { HomeSectionConfig } from '../../types';
import { ADMOB_CONFIG, initAdMob } from '../../services/admobService';
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
  const [adStatus, setAdStatus] = useState<'loading' | 'filled' | 'unfilled'>('loading');
  const pushedRef = useRef<boolean>(false);

  useEffect(() => {
    // 1. Native platform (iOS/Android): AdMob SDK initialization
    if (Capacitor.isNativePlatform()) {
      initAdMob().catch((err) => {
        console.warn('[AdMobBannerSection] Native AdMob init notice:', err);
      });
    }

    // 2. Load Google Ad SDK script if not already present
    if (typeof window !== 'undefined' && !document.getElementById('google-adsense-sdk')) {
      const script = document.createElement('script');
      script.id = 'google-adsense-sdk';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3878859120989916';
      document.head.appendChild(script);
    }

    // 3. Push ad request safely after mount
    const timer = setTimeout(() => {
      try {
        if (adRef.current && !pushedRef.current) {
          const existingStatus = adRef.current.getAttribute('data-adsbygoogle-status');
          if (!existingStatus) {
            pushedRef.current = true;
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        }
      } catch (e) {
        console.warn('[AdMobBannerSection] adsbygoogle push notice:', e);
      }
    }, 250);

    // 4. Observe ad slot status to handle filled/unfilled states without empty gaps
    let observer: MutationObserver | null = null;
    if (adRef.current && typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver(() => {
        if (!adRef.current) return;
        const status = adRef.current.getAttribute('data-ad-status');
        if (status === 'filled') {
          setAdStatus('filled');
        } else if (status === 'unfilled') {
          setAdStatus('unfilled');
        }
      });
      observer.observe(adRef.current, {
        attributes: true,
        attributeFilter: ['data-ad-status', 'data-adsbygoogle-status'],
      });
    }

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, []);

  // Google AdMob 정책 준수: 광고 미로드(unfilled) 시 빈 공백/깨진 상자를 노출하지 않고 영역 자동 축소
  if (adStatus === 'unfilled') {
    return null;
  }

  return (
    <div key="ad_banner" className="bg-white py-2.5 px-4 border-b border-gray-100 transition-all duration-300">
      {/* 구좌 헤더: 표준 광고(AD) 고지 (정책 준수: 불필요한 홍보/유도 문구 제거) */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
            {section?.badgeText || 'AD'}
          </span>
          <span className="text-[11px] text-gray-400 font-medium">
            {section?.subtitle || '스폰서'}
          </span>
        </div>
      </div>

      {/* Google AdMob / AdSense 공식 배너 광고 슬롯 */}
      <div
        id="admob-banner-container"
        data-ad-unit={ADMOB_CONFIG.bannerAdUnitId}
        data-ad-client="ca-pub-3878859120989916"
        data-ad-slot="9433572199"
        className="w-full flex items-center justify-center min-h-[50px] sm:min-h-[90px] rounded-xl overflow-hidden bg-transparent relative"
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
