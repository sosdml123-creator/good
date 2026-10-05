import React, { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  ADMOB_CLIENT_ID,
  ADMOB_SLOT_ID,
  BANNER_HEIGHT,
  BANNER_WIDTH,
  initAdMob,
  removeBanner,
} from '../../services/admobService';

/**
 * 카테고리 구좌와 신제품 구좌 사이 공식 AdMob 배너 광고 구좌 (320x50 인라인 고정)
 *
 * - Google AdMob 공식 앱 ID: ca-app-pub-3878859120989916~2898554632
 * - 클라이언트 ID: ca-pub-3878859120989916
 * - 배너 광고 슬롯 ID: 9433572199
 *
 * [원칙]
 * 1) PC(웹 브라우저): 불필요한 더미/텍스트 없이 깔끔한 빈 공간으로 유지.
 * 2) 모바일 앱(iOS/Android): WKWebView Google Mobile Ads SDK를 통해 카테고리와 신제품 사이 슬롯에 1:1로 완벽히 인라인 고정.
 */
export const AdMobBannerSection: React.FC = () => {
  const isNative = Capacitor.isNativePlatform();
  const adContainerRef = useRef<HTMLDivElement>(null);
  const isAdPushedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isNative) return;

    // 네이티브 SDK 초기화 및 하단 플로팅 배너 오버레이 완전 제거
    initAdMob().catch(() => {});
    removeBanner().catch(() => {});

    // 인라인 Google AdMob 광고 슬롯 초기화
    if (!isAdPushedRef.current) {
      try {
        if (typeof window !== 'undefined') {
          const adsbygoogle = ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
            (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []);
          adsbygoogle.push({});
          isAdPushedRef.current = true;
        }
      } catch (e) {
        console.warn('[AdMob Banner] In-line banner push notice:', e);
      }
    }
  }, [isNative]);

  // 1. PC 및 웹 환경: 더미 UI 없이 깔끔한 빈 공간으로 유지
  if (!isNative) {
    return <div className="w-full h-1" aria-hidden="true" />;
  }

  // 2. 모바일 앱 환경: 카테고리 구좌 아래 ~ 신제품 구좌 바로 위에 정확히 인라인 고정
  return (
    <div className="w-full bg-white border-b border-gray-100 flex flex-col items-center py-2 px-4 my-1">
      {/* 320x50 정밀 규격 인라인 배너 슬롯 */}
      <div
        ref={adContainerRef}
        style={{ width: `${BANNER_WIDTH}px`, height: `${BANNER_HEIGHT}px` }}
        className="w-[320px] max-w-full h-[50px] min-h-[50px] flex items-center justify-center overflow-hidden bg-transparent"
      >
        <ins
          className="adsbygoogle"
          style={{
            display: 'inline-block',
            width: `${BANNER_WIDTH}px`,
            height: `${BANNER_HEIGHT}px`,
          }}
          data-ad-client={ADMOB_CLIENT_ID}
          data-ad-slot={ADMOB_SLOT_ID}
        />
      </div>
    </div>
  );
};


