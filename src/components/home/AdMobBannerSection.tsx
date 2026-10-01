import React, { useEffect, useRef, useState } from 'react';
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

// ─────────────────────────────────────────────────────────────────
// AdMob 배너 구좌 컴포넌트
// 위치: 카테고리 섹션 아래 / 신제품 섹션 위
//
// [네이티브 iOS/Android]
//   App.tsx에서 showBanner()를 앱 초기화 시 1회 호출 →
//   하단 탭바 위(BOTTOM_CENTER)에 ADAPTIVE_BANNER 고정 표시.
//   이 컴포넌트는 카테고리-신제품 사이에 "AD" 레이블 구분선 역할.
//
// [웹]
//   AdSense <ins> 태그를 렌더링하여 인라인 배너 표시.
//   unfilled(광고 없음) 판정 시에는 2초 유예 후 컴포넌트 숨김(AdMob 정책 준수).
// ─────────────────────────────────────────────────────────────────
export const AdMobBannerSection: React.FC<AdMobBannerSectionProps> = ({ section }) => {
  const isNative = Capacitor.isNativePlatform();

  // 웹 전용 상태
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);
  const [webAdVisible, setWebAdVisible] = useState(true); // 기본 표시, unfilled 시 숨김

  // ─── 웹: AdSense SDK 로드 + push + 상태 감지 ─────────────────
  useEffect(() => {
    if (isNative) return;

    // SDK 스크립트 1회 로드
    if (!document.getElementById('google-adsense-sdk')) {
      const s = document.createElement('script');
      s.id = 'google-adsense-sdk';
      s.async = true;
      s.crossOrigin = 'anonymous';
      s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3878859120989916';
      document.head.appendChild(s);
    }

    // SDK 로드 후 push
    const pushTimer = setTimeout(() => {
      try {
        if (adRef.current && !pushedRef.current) {
          if (!adRef.current.getAttribute('data-adsbygoogle-status')) {
            pushedRef.current = true;
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        }
      } catch (e) {
        console.warn('[AdMob] push error:', e);
      }
    }, 400);

    // 광고 채워짐 여부 감지
    let unfilledTimer: ReturnType<typeof setTimeout> | null = null;
    const observer = new MutationObserver(() => {
      const status = adRef.current?.getAttribute('data-ad-status');
      if (status === 'filled') {
        if (unfilledTimer) { clearTimeout(unfilledTimer); unfilledTimer = null; }
        setWebAdVisible(true);
      } else if (status === 'unfilled') {
        // 즉시 숨기면 깜빡임 발생 → 2초 유예
        if (!unfilledTimer) {
          unfilledTimer = setTimeout(() => setWebAdVisible(false), 2000);
        }
      }
    });

    if (adRef.current) {
      observer.observe(adRef.current, {
        attributes: true,
        attributeFilter: ['data-ad-status', 'data-adsbygoogle-status'],
      });
    }

    return () => {
      clearTimeout(pushTimer);
      if (unfilledTimer) clearTimeout(unfilledTimer);
      observer.disconnect();
    };
  }, [isNative]);

  // ─── 네이티브: 구분선 + AD 레이블만 표시 ────────────────────
  // 실제 광고는 App.tsx → showBanner() → BOTTOM_CENTER에 고정 표시됨
  if (isNative) {
    return (
      <div className="w-full bg-white border-b border-gray-100 flex items-center justify-center py-1">
        <span className="text-[9px] font-bold text-gray-400 tracking-widest">
          {section?.badgeText || 'AD'}
        </span>
      </div>
    );
  }

  // ─── 웹: unfilled → 컴포넌트 숨김 ───────────────────────────
  if (!webAdVisible) return null;

  // ─── 웹: AdSense 배너 렌더링 ─────────────────────────────────
  return (
    <div className="bg-white py-2.5 px-4 border-b border-gray-100">
      {/* AD 레이블 */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
          {section?.badgeText || 'AD'}
        </span>
        <span className="text-[11px] text-gray-400 font-medium">
          {section?.subtitle || '스폰서'}
        </span>
      </div>

      {/* Google AdSense 배너 슬롯 */}
      <div className="w-full overflow-hidden rounded-xl" style={{ minHeight: 50 }}>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: 50 }}
          data-ad-client="ca-pub-3878859120989916"
          data-ad-slot="9433572199"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
