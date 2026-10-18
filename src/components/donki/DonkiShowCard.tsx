import React, { useEffect } from 'react';
import { X, Volume2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { speakJapanese } from '../../data/donkiGuide';

export interface ShowCardContent {
  ja: string;           // 크게 보여줄 일본어
  ko: string;           // 한국어 뜻 (작게)
  sub?: string;         // 함께 보여줄 일본어 문장 (예: これはどこにありますか？)
  subKo?: string;
  image?: string | null;
}

/** 점원·택시 기사에게 화면을 그대로 보여주는 전체 화면 카드 (모바일·PC 공용) */
export const DonkiShowCard: React.FC<{ content: ShowCardContent; onClose: () => void }> = ({ content, onClose }) => {
  const { showToast } = useApp();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const speak = () => {
    if (!speakJapanese(content.sub ? `${content.ja}。${content.sub}` : content.ja)) {
      showToast('이 기기에서는 일본어 음성을 지원하지 않아요. 화면을 보여주세요.', 'info');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-[#FFE600] flex flex-col"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      onClick={onClose}
    >
      <div className="flex justify-between items-center px-4 h-14 shrink-0">
        <span className="text-[12px] font-bold text-black/60">점원에게 이 화면을 보여주세요</span>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center" aria-label="닫기">
          <X className="w-5 h-5 text-black" />
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-5" onClick={e => e.stopPropagation()}>
        {content.image && (
          <div className="w-44 h-44 rounded-3xl bg-white overflow-hidden shadow-lg">
            <img src={content.image} alt="" className="w-full h-full object-contain" />
          </div>
        )}
        <p className="text-[34px] sm:text-[48px] leading-tight font-black text-black break-keep">{content.ja}</p>
        {content.sub && <p className="text-[24px] sm:text-[32px] leading-snug font-bold text-black">{content.sub}</p>}
        <p className="text-[14px] text-black/60 font-medium">
          {content.ko}{content.subKo ? ` · ${content.subKo}` : ''}
        </p>
        <button onClick={speak} className="mt-2 px-5 py-3 rounded-full bg-black text-[#FFE600] text-[14px] font-bold flex items-center gap-2">
          <Volume2 className="w-4 h-4" /> 일본어로 읽어주기
        </button>
      </div>
    </div>
  );
};
