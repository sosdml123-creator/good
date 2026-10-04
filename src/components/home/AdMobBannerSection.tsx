import React, { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { BANNER_HEIGHT, BANNER_WIDTH, hideBanner, resumeBanner, showBannerAt } from '../../services/admobService';

/**
 * iOS 노치 / 다이내믹 아일랜드 Safe Area Inset Top 측정 (pt 단위)
 */
const getSafeAreaTop = (): number => {
  try {
    const testEl = document.createElement('div');
    testEl.style.paddingTop = 'env(safe-area-inset-top, 0px)';
    testEl.style.position = 'fixed';
    testEl.style.top = '0';
    testEl.style.left = '0';
    testEl.style.visibility = 'hidden';
    testEl.style.pointerEvents = 'none';
    document.body.appendChild(testEl);
    const sat = parseFloat(window.getComputedStyle(testEl).paddingTop) || 0;
    document.body.removeChild(testEl);
    return sat > 0 ? sat : (Capacitor.getPlatform() === 'ios' ? 47 : 0);
  } catch {
    return Capacitor.getPlatform() === 'ios' ? 47 : 0;
  }
};

/**
 * 카테고리 구좌와 신제품 구좌 사이 공식 AdMob 배너 광고 구좌 (iOS / Android 네이티브 SDK)
 *
 * - 광고 단위 ID: ca-app-pub-3878859120989916/9433572199
 * - 규격: 320x50 표준 배너 (BANNER_WIDTH x BANNER_HEIGHT)
 * - 핵심 로직:
 *   1) 상단 메인 배너 및 카테고리가 완전히 렌더링된 후의 정확한 슬롯 y좌표를 측정하여 안착시킵니다.
 *   2) 비동기 데이터(배너 이미지 등) 로딩으로 슬롯 위치가 변경되면 자동으로 새 위치를 재측정하여 오차를 보정합니다.
 *   3) 스크롤 시 카테고리/신제품 사이 슬롯이 뷰포트에 있을 때 안정적으로 노출하고, 상단 밖으로 벗어나면 숨깁니다.
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
      const currentScrollTop = scroller?.scrollTop || 0;

      // 스크롤 최상단(0) 기준 슬롯의 절대적인 상단 y좌표 (헤더 + 메인배너 + 퀵메뉴 + 카테고리 높이 합산)
      const absoluteTop = rect.top + currentScrollTop;

      // 슬롯이 화면 헤더 아래(대략 50px)부터 화면 하단 사이에 가시 상태인지 검사
      const isVisibleInViewport = rect.bottom > 50 && rect.top < window.innerHeight - 50;

      if (isVisibleInViewport) {
        // 상단 배너 등이 렌더링되기 전(300px 미만)이면 성급하게 띄우지 않고 안정화될 때까지 대기
        // 정상적인 카테고리 하단 위치는 최소 350px 이상
        const sat = getSafeAreaTop();
        const hasPlaced = lastPlacedTopRef.current !== null;
        const positionShifted = hasPlaced && Math.abs((lastPlacedTopRef.current || 0) - absoluteTop) > 12;

        if (!hasPlaced || positionShifted) {
          // 최초 생성 또는 상단 요소 로딩으로 위치가 밀려난 경우 정확한 위치로 재배치
          lastPlacedTopRef.current = absoluteTop;
          showBannerAt(absoluteTop, sat);
        } else {
          // 이미 정확한 위치에 있으면 resume만 실행
          resumeBanner();
        }
      } else {
        // 스크롤을 내려 카테고리 구좌가 화면 위로 벗어나면 신제품/랭킹 콘텐츠 가림 방지를 위해 숨김
        hideBanner();
      }
    };

    const onScrollOrResize = () => {
      if (!raf) raf = requestAnimationFrame(checkAndPositionBanner);
    };

    // 상단 메인 배너 및 비동기 이미지 로딩 단계별 다단계 위치 안정화 (150ms, 450ms, 900ms, 1500ms)
    const timers = [
      setTimeout(checkAndPositionBanner, 150),
      setTimeout(checkAndPositionBanner, 450),
      setTimeout(checkAndPositionBanner, 900),
      setTimeout(checkAndPositionBanner, 1500),
    ];

    scroller?.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    // 상단 엘리먼트 크기 변화 실시간 감지
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
      window.removeEventListener('resize', onScrollOrResize);
      resizeObserver.disconnect();
      hideBanner(); // 다른 탭 이동 시 즉시 숨김
    };
  }, [isNative]);

  return (
    <div className="bg-white border-b border-gray-100 flex justify-center py-2.5 px-4 my-1">
      {/* 카테고리 구좌와 신제품 구좌 사이에 정확히 맞춘 320x50 규격 슬롯 컨테이너 */}
      <div
        ref={slotRef}
        style={{ width: BANNER_WIDTH, height: BANNER_HEIGHT }}
        className="rounded-xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden shadow-2xs"
      >
        <div className="flex items-center gap-1.5 text-gray-400 select-none pointer-events-none">
          <span className="text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-300 px-1 py-0.5 rounded leading-none">
            AD
          </span>
          <span className="text-[11px] font-semibold text-gray-500">
            신상픽 추천 스폰서드
          </span>
        </div>
      </div>
    </div>
  );
};
