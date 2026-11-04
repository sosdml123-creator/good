import { Capacitor } from '@capacitor/core';
import { isPcSite } from '../pc/isPcSite';

type VaEvent = { type: 'pageview' | 'event'; url: string };

declare global {
  interface Window {
    va?: (...args: unknown[]) => void;
    vaq?: unknown[][];
  }
}

const PC_VISITOR_KEY = 'sinsangpick_pc_visitor';

/** PC 사이트 방문 1건을 Supabase pc_visits에 남깁니다 (관리자 대시보드 PC 방문자 카드용). */
const recordPcVisit = async (): Promise<void> => {
  try {
    let visitorId = localStorage.getItem(PC_VISITOR_KEY);
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem(PC_VISITOR_KEY, visitorId);
    }
    const { supabase } = await import('../services/supabase');
    await supabase?.from('pc_visits').insert({ visitor_id: visitorId, path: window.location.pathname.slice(0, 300) });
  } catch {
    // 기록 실패는 화면에 영향을 주지 않습니다.
  }
};

/**
 * Vercel Web Analytics 연결 (웹 운영 배포에서만).
 * PC 주소(pc.sinsangpick.kr)로 들어온 방문은 경로 앞에 /pc를 붙여 기록해서
 * 대시보드·API에서 requestPath가 /pc로 시작하는 것만 세면 PC 방문자 수가 됩니다.
 */
export const initWebAnalytics = (): void => {
  if (import.meta.env.DEV || Capacitor.isNativePlatform()) return;

  window.va = window.va || ((...args: unknown[]) => { (window.vaq = window.vaq || []).push(args); });

  if (isPcSite()) {
    window.va('beforeSend', (event: VaEvent) => {
      const url = new URL(event.url);
      url.pathname = url.pathname === '/' ? '/pc' : `/pc${url.pathname}`;
      return { ...event, url: url.toString() };
    });
  }

  if (isPcSite()) recordPcVisit();

  const script = document.createElement('script');
  script.src = '/_vercel/insights/script.js';
  script.defer = true;
  document.head.appendChild(script);
};
