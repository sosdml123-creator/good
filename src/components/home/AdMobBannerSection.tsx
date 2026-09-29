import React, { useEffect, useRef, useState } from 'react';
import { HomeSectionConfig } from '../../types';
import { ADMOB_CONFIG, showHomeBannerAd } from '../../services/admobService';
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
  const [adStatus, setAdStatus] = useState<'loading' | 'filled' | 'unfilled'>('loading');
  const pushedRef = useRef<boolean>(false);

  useEffect(() => {
    // 1. Native platform (iOS/Android): Show official AdMob Banner as per iOS guide
    if (isNative) {
      showHomeBannerAd().catch((err) => {
        console.warn('[AdMobBannerSection] Native AdMob show notice:', err);
      });
      return;
    }

    // 2. Web platform: Load Google Ad SDK script if not already present
    if (typeof window !== 'undefined' && !document.getElementById('google-adsense-sdk')) {
      const script = document.createElement('script');
      script.id = 'google-adsense-sdk';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3878859120989916';
      document.head.appendChild(script);
    }

    // 3. Push web ad request safely after mount
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

    // 4. Observe ad slot status
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
  }, [isNative]);

  // On Native iOS: The official GADBannerView anchored banner is displayed natively.
  // Returning null here prevents empty/duplicate gaps in the scrollable feed.
  if (isNative) {
    return null;
  }

  // Google AdMob/AdSense 정책 준수: 미로드 시 빈 박스 방지
  if (adStatus === 'unfilled') {
    return null;
  }

  return (
    <div key="ad_banner" className="bg-white py-2.5 px-4 border-b border-gray-100 transition-all duration-300">
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
