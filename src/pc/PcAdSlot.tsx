import React, { useEffect, useRef } from 'react';
import { ADMOB_CLIENT_ID, ADMOB_HOME_SLOT_ID } from '../services/admobService';

/**
 * PC 사이트(pc.sinsangpick.kr) 전용 애드센스 반응형 디스플레이 광고 구좌.
 * 본문 흐름 안에 들어가는 일반 구좌라 화면을 덮지 않습니다.
 * 화면을 옮길 때마다 새 구좌로 다시 그리려면 부모에서 key를 바꿔 주세요.
 */
export const PcAdSlot: React.FC<{ className?: string }> = ({ className = '' }) => {
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;
    pushedRef.current = true;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch (e) {
      console.warn('[PcAdSlot] adsbygoogle push failed:', e);
    }
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <p className="mb-1 text-[11px] text-gray-400 text-right">광고</p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: 90 }}
        data-ad-client={ADMOB_CLIENT_ID}
        data-ad-slot={ADMOB_HOME_SLOT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
