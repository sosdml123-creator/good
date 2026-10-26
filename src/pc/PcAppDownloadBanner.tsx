import React, { useEffect, useState } from 'react';
import { Smartphone, X } from 'lucide-react';

const DISMISS_KEY = 'pc_app_banner_dismissed_until';
const DISMISS_MS = 24 * 60 * 60 * 1000;

const STORE_LINKS = [
  { label: 'App Store', href: 'https://apps.apple.com/kr/search?term=%EC%8B%A0%EC%83%81%ED%94%BD' },
  { label: 'Google Play', href: 'https://play.google.com/store/search?q=%EC%8B%A0%EC%83%81%ED%94%BD&c=apps' },
];

/** PC 화면 오른쪽에 떠서 둥실둥실 움직이며 모바일 앱 다운로드를 안내하는 배너 */
export const PcAppDownloadBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const until = Number(localStorage.getItem(DISMISS_KEY) || 0);
      setVisible(Date.now() > until);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const close = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_MS));
    } catch {
      /* 저장 불가 환경에서는 이번 방문에서만 숨김 */
    }
  };

  return (
    <aside
      className="fixed right-6 top-1/2 -translate-y-1/2 z-30 w-[168px] rounded-2xl bg-white border border-violet-200 shadow-xl p-4 text-center"
      style={{ animation: 'pcBannerFloat 3s ease-in-out infinite' }}
      aria-label="모바일 앱 다운로드 안내"
    >
      <style>{`@keyframes pcBannerFloat { 0%,100% { transform: translateY(-50%) translateY(-8px); } 50% { transform: translateY(-50%) translateY(8px); } }`}</style>
      <button onClick={close} aria-label="닫기" className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer">
        <X className="w-4 h-4" />
      </button>
      <div className="mx-auto w-12 h-12 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
        <Smartphone className="w-6 h-6" />
      </div>
      <p className="mt-3 text-[14px] font-bold text-gray-900 leading-snug">
        모바일에서<br />더 편하게!
      </p>
      <p className="mt-1.5 text-[12px] text-gray-500 leading-snug">
        신상픽 앱을 다운로드하고<br />신제품 알림을 받아보세요
      </p>
      <div className="mt-3 space-y-1.5">
        {STORE_LINKS.map(s => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[12px] font-semibold py-2"
          >
            {s.label}
          </a>
        ))}
      </div>
    </aside>
  );
};
