import React from 'react';
import { Globe } from 'lucide-react';
import { LANGUAGES, setLang, useLang } from '../../i18n';

/** 언어 선택 버튼 묶음. compact면 로그인 화면용 한 줄 형태로 보여 줍니다. */
export const LanguageSwitcher: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const lang = useLang();
  return (
    <div className={`flex items-center ${compact ? 'justify-center gap-1.5 flex-wrap' : 'gap-2 flex-wrap'}`}>
      {compact && <Globe className="w-3.5 h-3.5 text-gray-400" />}
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${
            lang === l.code
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};
