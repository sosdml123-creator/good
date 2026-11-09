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
const NO_TRACK_KEY = 'sinsangpick_no_track';
const ADMIN_CHECKED_KEY = 'sinsangpick_admin_checked';

let trackingExcluded = false;

const safeGet = (key: string): string | null => {
  try { return localStorage.getItem(key); } catch { return null; }
};
const safeSet = (key: string, value: string | null): void => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch { /* 저장 불가 브라우저는 무시 */ }
};

/**
 * 본인(운영자) 방문 제외 여부.
 * - 주소 뒤에 ?notrack=1 을 붙여 한 번 열면 이 브라우저는 계속 제외, ?notrack=0 이면 해제
 * - 관리자 계정으로 로그인한 브라우저는 자동으로 제외
 */
const resolveExcludedFromUrl = (): boolean => {
  try {
    const param = new URLSearchParams(window.location.search).get('notrack');
    if (param === '1') safeSet(NO_TRACK_KEY, '1');
    if (param === '0') safeSet(NO_TRACK_KEY, null);
  } catch { /* 무시 */ }
  return safeGet(NO_TRACK_KEY) === '1';
};

/** 로그인한 계정이 관리자면 이 브라우저를 제외 목록에 올립니다 (계정당 한 번만 조회). */
const markAdminBrowser = async (): Promise<void> => {
  try {
    const { supabase } = await import('../services/supabase');
    const { data } = (await supabase?.auth.getSession()) ?? { data: null };
    const userId = data?.session?.user?.id;
    if (!userId || safeGet(ADMIN_CHECKED_KEY) === userId) return;
    const { isAdminSession } = await import('../services/adminAuth');
    if (await isAdminSession()) {
      safeSet(NO_TRACK_KEY, '1');
      trackingExcluded = true;
    }
    safeSet(ADMIN_CHECKED_KEY, userId);
  } catch {
    // 확인 실패는 화면에 영향을 주지 않습니다.
  }
};

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

  trackingExcluded = resolveExcludedFromUrl();
  if (!trackingExcluded) markAdminBrowser();

  window.va = window.va || ((...args: unknown[]) => { (window.vaq = window.vaq || []).push(args); });

  const pcSite = isPcSite();
  window.va('beforeSend', (event: VaEvent) => {
    if (trackingExcluded) return null;
    if (!pcSite) return event;
    const url = new URL(event.url);
    url.pathname = url.pathname === '/' ? '/pc' : `/pc${url.pathname}`;
    return { ...event, url: url.toString() };
  });

  if (pcSite && !trackingExcluded) recordPcVisit();

  const script = document.createElement('script');
  script.src = '/_vercel/insights/script.js';
  script.defer = true;
  document.head.appendChild(script);
};
