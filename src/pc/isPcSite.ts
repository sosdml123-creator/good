import { Capacitor } from '@capacitor/core';

const PC_PREVIEW_KEY = 'sinsangpick_pc_preview';

/**
 * PC 버전 여부. 운영에서는 pc.sinsangpick.kr 주소로 접속했을 때만 PC 레이아웃을 씁니다.
 * 로컬 개발에서는 `?pc=1`로 미리보기를 켜고 `?pc=0`으로 끕니다.
 */
export const isPcSite = (): boolean => {
  if (typeof window === 'undefined' || Capacitor.isNativePlatform()) return false;
  if (window.location.hostname.startsWith('pc.')) return true;
  if (!import.meta.env.DEV) return false;

  try {
    const param = new URLSearchParams(window.location.search).get('pc');
    if (param === '1') sessionStorage.setItem(PC_PREVIEW_KEY, '1');
    if (param === '0') sessionStorage.removeItem(PC_PREVIEW_KEY);
    return sessionStorage.getItem(PC_PREVIEW_KEY) === '1';
  } catch {
    return false;
  }
};
