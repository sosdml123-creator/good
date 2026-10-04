import React, { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  BANNER_HEIGHT,
  BANNER_WIDTH,
  hideBanner,
  resumeBanner,
  showBannerAt,
  getSafeAreaTop,
} from '../../services/admobService';

/**
 * 카테고리 구좌와 신제품 구좌 사이 공식 AdMob 배너 광고 구좌 (320x50 표준 규격)
 *
 * - Google AdMob 공식 앱 ID: ca-app-pub-3878859120989916~2898554632
 * - 배너 광고 단위 ID: ca-app-pub-3878859120989916/9433572199
 * - 규격: 320x50 표준 배너 (BANNER_WIDTH x BANNER_HEIGHT)
 *
 * [핵심 기능]
 * 1) 슬롯 컨테이너의 화면 기준 Y좌표(rect.top)와 iOS Safe Area Inset을 측정하여
 *    AdMob SDK AutoLayout Margin(-(rect.top - safeAreaTop))으로 슬롯 위치에 1:1로 안착
 * 2) 홈 상단 영역(카테고리 구좌 ~ 신제품 구좌 사이 슬롯) 가시 상태(스크롤 35px 이내)일 때 320x50 배너 노출
 * 3) 아래 신제품 목록으로 스크롤 시 hideBanner()로 즉시 숨겨 하단 메뉴나 다른 콘텐츠를 가리지 않음
 */
export const AdMobBannerSection: React.FC = () => {
  const isNative = Capacitor.isNativePlatform();
  const slotRef = useRef<HTMLDivElement>(null);
  const lastPlacedTopRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isNative || !slotRef.current) return;

    const slot = slotRef.current;
    const scroller = slot.closest('main') as HTMLElement | null;
    let raf = 0;

    const checkAndPositionBanner = () => {
      raf = 0;
      if (!slotRef.current) return;

      const rect = slotRef.current.getBoundingClientRect();
      const currentScrollTop = scroller?.scrollTop ?? (typeof window !== 'undefined' ? window.scrollY : 0);

      // 스크롤 최상단(0) 기준 슬롯의 절대 상단 y좌표 (헤더 + 메인배너 265px + 퀵메뉴 + 카테고리 높이 합산)
      const absoluteTop = rect.top + currentScrollTop;

      // 상단 메인 배너(265px) 및 카테고리가 완전히 펼쳐지기 전(350px 미만)에는 엉뚱한 위치에 띄우지 않고 대기
      if (absoluteTop < 350) {
        return;
      }

      // 사용자가 홈 상단 영역(카테고리 구좌 ~ 신제품 구좌 사이)을 보고 있을 때
      const isAtRestHeaderArea = currentScrollTop <= 35;

      if (isAtRestHeaderArea) {
        const safeAreaTop = getSafeAreaTop();
        const hasPlaced = lastPlacedTopRef.current !== null;
        const positionShifted = hasPlaced && Math.abs((lastPlacedTopRef.current || 0) - absoluteTop) > 6;

        if (!hasPlaced || positionShifted) {
          lastPlacedTopRef.current = absoluteTop;
          showBannerAt(absoluteTop, safeAreaTop);
        } else {
          resumeBanner();
        }
      } else {
        // 스크롤을 내려 신제품 목록 및 아래 콘텐츠를 탐색할 때는 하단 메뉴 및 본문 가림 방지를 위해 숨김
        hideBanner();
      }
    };

    const onScrollOrResize = () => {
      if (!raf) raf = requestAnimationFrame(checkAndPositionBanner);
    };

    // 상단 배너 이미지 로딩 및 뷰 렌더링 단계별 순차 안정화 타이머
    const timers = [
      setTimeout(checkAndPositionBanner, 150),
      setTimeout(checkAndPositionBanner, 450),
      setTimeout(checkAndPositionBanner, 900),
      setTimeout(checkAndPositionBanner, 1600),
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
      hideBanner(); // 다른 탭 이동 시 즉시 숨김
    };
  }, [isNative]);

  return (
    <div className="bg-white border-b border-gray-100 flex flex-col items-center py-2 px-4 my-1">
      {/* 1. 구좌 헤더 라벨 */}
      <div className="w-[320px] max-w-full flex items-center justify-between mb-1.5 px-0.5">
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

      {/* 2. 320x50 정밀 규격 광고 구좌 컨테이너 */}
      <div
        ref={slotRef}
        style={{ width: BANNER_WIDTH, height: BANNER_HEIGHT }}
        className="rounded-xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden shadow-2xs"
      >
        <div className="flex items-center gap-1.5 text-gray-400 select-none pointer-events-none">
          <span className="text-[11px] font-semibold text-gray-400">
            신상픽 추천 스폰서드
          </span>
        </div>
      </div>
    </div>
  );
};
