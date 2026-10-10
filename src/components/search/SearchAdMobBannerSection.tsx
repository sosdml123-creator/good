import React, { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  ADMOB_CLIENT_ID,
  ADMOB_SEARCH_BANNER_UNIT_ID,
  ADMOB_SEARCH_SLOT_ID,
  BANNER_HEIGHT,
  BANNER_WIDTH,
  getSafeAreaTop,
  showBannerAt,
  removeBanner,
  supportsInlineBanner,
  trackInlineBanner,
} from '../../services/admobService';

/**
 * 검색창 내부 AdMob 배너 광고 구좌
 * - 단위 ID: ca-app-pub-3878859120989916/1040251860
 * - 스크롤할 때마다 화면을 따라다니지 않고, 검색창 상단 슬롯 위치에 안정적으로 1회 안착
 * - 검색 결과 화면으로 이동하거나 모달 종료 시 즉시 안전 제거
 */
export const SearchAdMobBannerSection: React.FC = () => {
  const isNative = Capacitor.isNativePlatform();
  const useInlineBanner = supportsInlineBanner();
  const slotRef = useRef<HTMLDivElement>(null);
  const isPlacedRef = useRef<boolean>(false);
  const isWebPushedRef = useRef<boolean>(false);

  useEffect(() => {
    // 0. iOS 앱: 구좌 위치에 네이티브 배너를 붙여 본문과 함께 스크롤
    if (useInlineBanner) {
      if (!slotRef.current) return;
      return trackInlineBanner('search', ADMOB_SEARCH_BANNER_UNIT_ID, slotRef.current);
    }

    // 1. 모바일 앱 환경: 구좌 위치에 실제 애드몹 배너를 단 1회 안정적으로 안착
    if (isNative) {
      const placeBanner = () => {
        if (isPlacedRef.current || !slotRef.current) return;
        isPlacedRef.current = true;

        const rect = slotRef.current.getBoundingClientRect();
        const safeAreaTop = getSafeAreaTop();
        // 상단 헤더 바로 아래 슬롯 Y좌표
        const slotTop = rect.top > 0 ? rect.top : 54;

        showBannerAt(slotTop, safeAreaTop, ADMOB_SEARCH_BANNER_UNIT_ID);
      };

      // 렌더링 타이밍을 고려하여 슬롯 위치에 안정적으로 1회 표시
      const timer = setTimeout(placeBanner, 150);

      return () => {
        clearTimeout(timer);
        // 검색창을 나가거나 검색 결과 모드로 전환될 때 배너 완전 제거
        removeBanner().catch(() => {});
      };
    }

    // 2. 웹 브라우저 환경: 인라인 광고 푸시
    if (!isNative && !isWebPushedRef.current) {
      isWebPushedRef.current = true;
      try {
        if (typeof window !== 'undefined') {
          const ads = ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
            (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []);
          ads.push({});
        }
      } catch (e) {
        console.warn('[SearchAdMobBanner] Web ad push notice:', e);
      }
    }
  }, [isNative, useInlineBanner]);

  // 모바일 앱 환경: 네이티브 배너가 올라올 320x50 크기의 1개 정규 구좌 공간 확보
  if (isNative) {
    return (
      <div className="w-full flex flex-col items-center justify-center my-1">
        <div
          ref={slotRef}
          style={{ width: `${BANNER_WIDTH}px`, height: `${BANNER_HEIGHT}px` }}
          className="w-[320px] max-w-full h-[50px] min-h-[50px] bg-transparent flex items-center justify-center"
          aria-hidden="true"
        />
      </div>
    );
  }

  // PC / 웹 환경: 빈 흰 화면이 되지 않도록 정돈된 1개 광고 구좌 UI 제공
  return (
    <div className="w-full flex flex-col items-center justify-center my-1">
      <div className="w-[320px] max-w-full flex items-center justify-between mb-1.5 px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-300 px-1 py-0.5 rounded leading-none shadow-2xs">
            AD
          </span>
          <span className="text-[12px] font-bold text-gray-800 tracking-tight">
            신상픽 추천 스폰서드
          </span>
        </div>
        <span className="text-[10px] text-gray-400 font-medium">
          맞춤 제휴 혜택
        </span>
      </div>

      <div
        ref={slotRef}
        style={{ width: `${BANNER_WIDTH}px`, height: `${BANNER_HEIGHT}px` }}
        className="w-[320px] max-w-full h-[50px] min-h-[50px] rounded-xl bg-gradient-to-r from-amber-50/40 via-orange-50/30 to-amber-50/40 border border-dashed border-amber-200/80 flex items-center justify-center overflow-hidden relative shadow-2xs"
      >
        <ins
          className="adsbygoogle"
          style={{
            display: 'inline-block',
            width: `${BANNER_WIDTH}px`,
            height: `${BANNER_HEIGHT}px`,
          }}
          data-ad-client={ADMOB_CLIENT_ID}
          data-ad-slot={ADMOB_SEARCH_SLOT_ID}
        />
      </div>
    </div>
  );
};
