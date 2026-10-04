import React, { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { BANNER_HEIGHT, BANNER_WIDTH, hideBanner, resumeBanner, showBannerAt } from '../../services/admobService';


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

      // 스크롤 최상단(0) 기준 슬롯의 절대 상단 y좌표 (헤더 + 메인배너 265px + 퀵메뉴 + 카테고리 높이 합산)
      const absoluteTop = rect.top + currentScrollTop;

      // [핵심 가드] 상단 메인 배너(265px) 및 카테고리가 완전히 펼쳐지지 않은 조기 렌더링(450px 미만) 상태에서는
      // 배너를 잘못된 상단 위치에 생성하지 않고 정상 높이까지 대기합니다.
      if (absoluteTop < 450) {
        return;
      }

      // 사용자가 홈 상단 영역(카테고리 구좌 ~ 신제품 구좌 사이 슬롯)을 보고 있을 때 (스크롤 35px 이내)
      // 네이티브 배너를 해당 슬롯에 정확히 1:1로 고정하여 안착시킵니다.
      const isAtRestHeaderArea = currentScrollTop <= 35;

      if (isAtRestHeaderArea) {
        const hasPlaced = lastPlacedTopRef.current !== null;
        const positionShifted = hasPlaced && Math.abs((lastPlacedTopRef.current || 0) - absoluteTop) > 10;

        if (!hasPlaced || positionShifted) {
          lastPlacedTopRef.current = absoluteTop;
          showBannerAt(absoluteTop);
        } else {
          resumeBanner();
        }
      } else {
        // 스크롤을 내려 신제품 목록 및 아래 콘텐츠를 탐색할 때는
        // 화면 오버레이인 네이티브 배너가 신제품 콘텐츠를 가리지 않도록 숨김 처리
        hideBanner();
      }
    };

    const onScrollOrResize = () => {
      if (!raf) raf = requestAnimationFrame(checkAndPositionBanner);
    };

    // 상단 메인 배너 및 비동기 요소 로딩 완료 단계별 순차 안정화 타이머
    const timers = [
      setTimeout(checkAndPositionBanner, 250),
      setTimeout(checkAndPositionBanner, 550),
      setTimeout(checkAndPositionBanner, 1000),
      setTimeout(checkAndPositionBanner, 1600),
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
