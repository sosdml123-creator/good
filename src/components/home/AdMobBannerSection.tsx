import React, { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  BANNER_HEIGHT,
  BANNER_WIDTH,
  getSafeAreaTop,
  hideBanner,
  resumeBanner,
  showBannerAt,
} from '../../services/admobService';

/**
 * 카테고리 구좌와 신제품 구좌 사이 공식 AdMob 광고 구좌
 *
 * 1) PC(웹): 애드몹 광고가 없으므로 어떠한 텍스트나 박스도 없는 완전한 빈칸(null) 반환
 * 2) 앱(iOS/Android): "신상픽 추천 스폰서드" 텍스트 없이 실제 애드몹 배너(320x50)만 카테고리 아래 정위치에 고정
 *    신제품 탐색 시 스크롤 내려가면 숨겨서 본문을 가리지 않고, 상단 복귀 시 원래 자리에 재노출
 */
export const AdMobBannerSection: React.FC = () => {
  const isNative = Capacitor.isNativePlatform();
  const slotRef = useRef<HTMLDivElement>(null);
  const isPlacedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isNative || !slotRef.current) return;

    const slot = slotRef.current;
    const scroller = slot.closest('main') as HTMLElement | null;
    let raf = 0;

    const syncBannerPosition = () => {
      raf = 0;
      if (!slotRef.current) return;

      const rect = slotRef.current.getBoundingClientRect();
      const currentScrollTop = scroller?.scrollTop ?? (typeof window !== 'undefined' ? window.scrollY : 0);

      // 상단 홈 카테고리 영역(스크롤 40px 이내)에 있을 때만 카테고리 아래 슬롯 위치에 배너 노출
      const isAtHeaderArea = currentScrollTop <= 40;

      if (isAtHeaderArea) {
        // 스크롤 최상단 기준 슬롯 Y좌표
        const absoluteTop = rect.top + currentScrollTop;
        const safeAreaTop = getSafeAreaTop();

        // 메인 배너 및 카테고리가 렌더링된 정상 높이(280px 이상)일 때 안착
        if (absoluteTop >= 280) {
          if (!isPlacedRef.current) {
            isPlacedRef.current = true;
            showBannerAt(absoluteTop, safeAreaTop);
          } else {
            resumeBanner();
          }
        }
      } else {
        // 스크롤을 내려 신제품 목록 및 아래 콘텐츠를 볼 때는 본문 가림 방지를 위해 숨김
        hideBanner();
      }
    };

    const onScrollOrResize = () => {
      if (!raf) raf = requestAnimationFrame(syncBannerPosition);
    };

    // 상단 롤링 배너 및 카테고리 이미지 렌더링 완료 타이밍에 맞춰 위치 정밀 측정
    const timers = [
      setTimeout(syncBannerPosition, 100),
      setTimeout(syncBannerPosition, 300),
      setTimeout(syncBannerPosition, 650),
      setTimeout(syncBannerPosition, 1200),
    ];

    scroller?.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    const resizeObserver = new ResizeObserver(() => {
      onScrollOrResize();
    });
    if (slot.parentElement) {
      resizeObserver.observe(slot.parentElement);
    }

    return () => {
      timers.forEach(clearTimeout);
      if (raf) cancelAnimationFrame(raf);
      scroller?.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      resizeObserver.disconnect();
      hideBanner();
    };
  }, [isNative]);

  // 1. PC 웹 환경: 어떠한 텍스트나 공간도 남기지 않는 완전한 빈칸
  if (!isNative) {
    return null;
  }

  // 2. 모바일 앱 환경: "신상픽 추천 스폰서드" 텍스트 없이 순수 320x50 애드몹 광고 슬롯 영역만 확보
  return (
    <div className="w-full flex flex-col items-center justify-center my-1">
      <div
        ref={slotRef}
        style={{ width: `${BANNER_WIDTH}px`, height: `${BANNER_HEIGHT}px` }}
        className="w-[320px] max-w-full h-[50px] min-h-[50px] bg-transparent flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
};





