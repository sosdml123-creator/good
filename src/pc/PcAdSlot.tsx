import React, { useEffect, useRef } from 'react';
import { ADMOB_CLIENT_ID, ADSENSE_PC_SLOT_ID } from '../services/admobService';

/**
 * PC 사이트(pc.sinsangpick.kr) 전용 애드센스 반응형 디스플레이 광고 구좌.
 * 본문 흐름 안에 들어가는 일반 구좌라 화면을 덮지 않습니다.
 * 화면을 옮길 때마다 새 구좌로 다시 그리려면 부모에서 key를 바꿔 주세요.
 */
export const PcAdSlot: React.FC<{ className?: string }> = ({ className = '' }) => {
  const pushedRef = useRef(false);
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // 구좌 너비가 0일 때 push하면 "No slot size for availableWidth=0" 오류로 광고가 영영 안 뜨므로, 너비가 생길 때까지 기다립니다.
    let tries = 0;
    let timer: number | undefined;
    const tryPush = () => {
      if (pushedRef.current) return;
      if ((insRef.current?.offsetWidth ?? 0) === 0 && tries++ < 50) {
        timer = window.setTimeout(tryPush, 200);
        return;
      }
      pushedRef.current = true;
      try {
        const w = window as unknown as { adsbygoogle?: unknown[] };
        (w.adsbygoogle = w.adsbygoogle || []).push({});
      } catch (e) {
        console.warn('[PcAdSlot] adsbygoogle push failed:', e);
      }
    };
    tryPush();
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <p className="mb-1 text-[11px] text-gray-400 text-right">광고</p>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block', minHeight: 90 }}
        data-ad-client={ADMOB_CLIENT_ID}
        data-ad-slot={ADSENSE_PC_SLOT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
