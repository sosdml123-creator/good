import React, { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { X, Star, Gift, Bell, Sparkles } from 'lucide-react';

// 스토어 링크. Play 스토어는 공개 출시 전이라 비워둡니다 (공개되면 URL을 넣으면 안드로이드에도 배너가 뜹니다).
export const APP_STORE_URL = 'https://apps.apple.com/kr/app/id6807645349';
export const PLAY_STORE_URL = '';

const BANNER_DISMISS_KEY = 'sinsangpick_app_banner_dismissed_at';
const BANNER_SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;

const getMobileStoreUrl = (): string => {
  if (typeof navigator === 'undefined') return '';
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua));
  if (isIOS) return APP_STORE_URL;
  if (/Android/i.test(ua)) return PLAY_STORE_URL;
  return '';
};

/** 모바일 웹 상단 앱 설치 띠 배너. 화면 흐름 안에 들어가며(오버레이 아님) 닫으면 7일간 숨깁니다. */
export const AppInstallBanner: React.FC = () => {
  const [visible, setVisible] = useState(() => {
    if (Capacitor.isNativePlatform() || !getMobileStoreUrl()) return false;
    try {
      const dismissedAt = Number(localStorage.getItem(BANNER_DISMISS_KEY) || 0);
      return Date.now() - dismissedAt > BANNER_SNOOZE_MS;
    } catch {
      return true;
    }
  });

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try { localStorage.setItem(BANNER_DISMISS_KEY, String(Date.now())); } catch {}
  };

  return (
    <div className="shrink-0 flex items-center gap-2.5 px-3 py-2 bg-white border-b border-gray-100">
      <button onClick={dismiss} aria-label="앱 설치 안내 닫기" className="p-1 -ml-1 text-gray-400 hover:text-gray-600 cursor-pointer">
        <X className="w-4 h-4" />
      </button>
      <img src="/app-icon.png" alt="" className="w-9 h-9 rounded-[10px] border border-gray-100" />
      <div className="flex-1 min-w-0 leading-tight">
        <p className="text-[13px] font-bold text-gray-900 truncate">신상픽 앱</p>
        <p className="text-[11px] text-gray-500 truncate">신상 알림 · 리뷰 포인트 · e쿠폰 교환</p>
      </div>
      <a
        href={getMobileStoreUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 px-3.5 py-1.5 rounded-full bg-violet-600 text-white text-[12px] font-bold"
      >
        앱 받기
      </a>
    </div>
  );
};

const FEATURES = [
  { icon: Sparkles, title: '매일 업데이트되는 신상', desc: '편의점·카페·마트 신제품을 한곳에서' },
  { icon: Star, title: '먹어본 사람들의 솔직 리뷰', desc: '사기 전에 맛·가격 평가 확인' },
  { icon: Gift, title: '리뷰 쓰고 포인트 적립', desc: '모은 포인트로 e쿠폰 교환' },
  { icon: Bell, title: '관심 신상 출시 알림', desc: '좋아하는 브랜드 신제품을 바로 (앱 전용)' },
];

/** PC(넓은 화면) 왼쪽: 서비스 소개 */
export const DesktopIntroPanel: React.FC = () => (
  <aside className="hidden xl:flex w-[340px] shrink-0 h-[100dvh] sticky top-0 flex-col justify-center gap-8 select-none">
    <div className="flex items-center gap-3">
      <img src="/app-icon.png" alt="신상픽" className="w-14 h-14 rounded-2xl shadow-sm" />
      <div>
        <p className="text-2xl font-black text-gray-900 tracking-tight">신상픽</p>
        <p className="text-sm text-gray-500">식음료 신제품 발견 & 솔직 리뷰</p>
      </div>
    </div>
    <h1 className="text-[28px] leading-snug font-black text-gray-900 tracking-tight">
      새로 나온 먹거리,<br />
      <span className="text-violet-600">먹어보기 전에</span> 먼저 확인하세요
    </h1>
    <ul className="space-y-4">
      {FEATURES.map(({ icon: Icon, title, desc }) => (
        <li key={title} className="flex items-start gap-3">
          <span className="w-9 h-9 shrink-0 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <Icon className="w-[18px] h-[18px]" />
          </span>
          <div>
            <p className="text-[15px] font-bold text-gray-900">{title}</p>
            <p className="text-[13px] text-gray-500">{desc}</p>
          </div>
        </li>
      ))}
    </ul>
  </aside>
);

/** PC(넓은 화면) 오른쪽: 앱 설치 QR */
export const DesktopDownloadPanel: React.FC = () => (
  <aside className="hidden xl:flex w-[340px] shrink-0 h-[100dvh] sticky top-0 flex-col justify-center items-start select-none">
    <div className="w-[260px] rounded-3xl bg-white p-6 shadow-sm border border-gray-100 text-center">
      <p className="text-[15px] font-bold text-gray-900">앱에서 더 편하게</p>
      <p className="mt-1 text-[12px] text-gray-500">휴대폰 카메라로 QR을 스캔하세요</p>
      <img src="/qr-app-store.png" alt="신상픽 App Store QR 코드" className="mx-auto mt-4 w-40 h-40" />
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center h-11 rounded-xl bg-gray-900 text-white text-[13px] font-bold hover:bg-black"
      >
        App Store에서 받기
      </a>
      {PLAY_STORE_URL ? (
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center justify-center h-11 rounded-xl border border-gray-200 text-gray-900 text-[13px] font-bold hover:bg-gray-50"
        >
          Google Play에서 받기
        </a>
      ) : (
        <p className="mt-3 text-[11px] text-gray-400">Android 앱은 준비 중이에요</p>
      )}
    </div>
  </aside>
);
