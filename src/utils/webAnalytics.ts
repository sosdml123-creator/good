import { Capacitor } from '@capacitor/core';
import { isPcSite } from '../pc/isPcSite';

type VaEvent = { type: 'pageview' | 'event'; url: string };

declare global {
  interface Window {
    va?: (...args: unknown[]) => void;
    vaq?: unknown[][];
  }
}

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

  const script = document.createElement('script');
  script.src = '/_vercel/insights/script.js';
  script.defer = true;
  document.head.appendChild(script);
};
