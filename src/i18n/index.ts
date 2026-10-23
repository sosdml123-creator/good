import { useSyncExternalStore } from 'react';
import { dictionaries } from './dict';

export type Lang = 'ko' | 'en' | 'ja' | 'zh';

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
];

const STORAGE_KEY = 'sinsangpick_lang';

function detectLang(): Lang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'ko' || saved === 'en' || saved === 'ja' || saved === 'zh') return saved;
  } catch {
    /* storage 접근 불가 시 기기 언어로 판단 */
  }
  const nav = (typeof navigator !== 'undefined' ? navigator.language : 'ko').toLowerCase();
  if (nav.startsWith('ko')) return 'ko';
  if (nav.startsWith('ja')) return 'ja';
  if (nav.startsWith('zh')) return 'zh';
  return 'en';
}

let current: Lang = typeof window === 'undefined' ? 'ko' : detectLang();
const listeners = new Set<() => void>();

function applyDocLang() {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = current === 'zh' ? 'zh-CN' : current;
  }
}
applyDocLang();

export function getLang(): Lang {
  return current;
}

export function setLang(lang: Lang) {
  if (lang === current) return;
  current = lang;
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* 저장 실패해도 현재 세션에는 적용 */
  }
  applyDocLang();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** 한국어 원문을 키로 번역합니다. 번역이 없으면 원문을 그대로 보여 줍니다. {name} 형태의 값 치환을 지원합니다. */
export function t(ko: string, vars?: Record<string, string | number>): string {
  const text = (current !== 'ko' && dictionaries[current]?.[ko]) || ko;
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

/** 언어가 바뀌면 컴포넌트가 다시 그려지도록 구독하는 훅. */
export function useT() {
  useSyncExternalStore(subscribe, getLang, getLang);
  return t;
}

export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getLang, getLang);
}
