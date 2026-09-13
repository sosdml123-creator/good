import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, loginWithApple, loginWithGoogle, loginWithKakao } = useApp();

  if (!isLoginModalOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={() => setIsLoginModalOpen(false)}
    >
      <div 
        className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-5 animate-in slide-in-from-bottom-5 duration-250 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="신상픽" 
              className="w-5 h-5 rounded-lg object-cover shadow-xs border border-gray-200" 
            />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Sinsangpick Login</span>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title & Description */}
        <div className="space-y-1 text-left">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            신상픽 간편 로그인
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            간편 로그인하고 기기를 변경해도 리뷰, 찜 목록, 보유 포인트를 안전하게 보관하세요.
          </p>
        </div>

        {/* Social Login Buttons (Apple HIG & Store Compliance) */}
        <div className="space-y-2.5 pt-1">
          {/* 1. Sign in with Apple (HIG Compliant Black Button) */}
          <button
            onClick={() => {
              setIsLoginModalOpen(false);
              loginWithApple();
            }}
            className="w-full h-12 bg-black hover:bg-neutral-900 active:scale-[0.99] text-white rounded-2xl flex items-center justify-center gap-2.5 font-semibold text-[14px] shadow-sm transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.42-6.74-10.23-11.75-21.9-15.03-35.01-3.28-13.11-4.92-25.16-4.92-36.15 0-14.36 3.69-26.06 11.07-35.1 7.38-9.04 16.74-13.68 28.08-13.91 4.79 0 10.27 1.22 16.44 3.66 6.18 2.44 10.05 3.72 11.62 3.84 2.07-.23 6.06-1.55 11.96-3.96 5.9-2.42 11.07-3.51 15.52-3.28 14.15.82 25.17 6.13 33.06 15.93-12.38 7.5-18.42 17.65-18.12 30.45.31 10.24 4.29 18.79 11.94 25.65 7.65 6.86 16.79 10.74 27.42 11.65-2.22 6.74-4.82 13.54-7.8 20.41zM119.22 32.64c0-7.39 2.67-14.33 8.01-20.82 5.34-6.49 12.01-10.66 20.02-12.51.21 1.09.32 2.12.32 3.09 0 7.39-2.73 14.48-8.19 21.26-5.46 6.78-12.18 10.9-20.16 12.36-.21-1.09-.32-2.12-.32-3.38z" />
            </svg>
            <span>Apple로 계속하기</span>
          </button>

          {/* 2. Kakao Login */}
          <button
            onClick={() => {
              setIsLoginModalOpen(false);
              loginWithKakao();
            }}
            className="w-full h-12 bg-[#FEE500] hover:bg-[#FADA0A] active:scale-[0.99] text-[#191919] rounded-2xl flex items-center justify-center gap-2.5 font-semibold text-[14px] shadow-sm transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.868 1.865 5.385 4.674 6.756l-.973 3.61c-.085.316.273.57.544.385l4.316-2.915c.471.054.951.084 1.439.084 5.523 0 10-3.582 10-8s-4.477-8-10-8z" />
            </svg>
            <span>카카오로 계속하기</span>
          </button>

          {/* 3. Google Login */}
          <button
            onClick={() => {
              setIsLoginModalOpen(false);
              loginWithGoogle();
            }}
            className="w-full h-12 bg-white hover:bg-gray-50 active:scale-[0.99] text-gray-700 border border-gray-200 rounded-2xl flex items-center justify-center gap-2.5 font-semibold text-[14px] shadow-2xs transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Google로 계속하기</span>
          </button>
        </div>

        {/* Security & Legal Notice */}
        <div className="pt-2 border-t border-gray-100 flex flex-col items-center gap-1.5 text-center">
          <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>개인정보는 안전하게 암호화되어 보호됩니다</span>
          </div>
          <p className="text-[10px] text-gray-400 leading-tight">
            로그인 시 신상픽의 <a href="/terms" target="_blank" rel="noreferrer" className="underline hover:text-gray-600">이용약관</a> 및{' '}
            <a href="/privacy" target="_blank" rel="noreferrer" className="underline hover:text-gray-600">개인정보처리방침</a>에 동의합니다.
          </p>
        </div>
      </div>
    </div>
  );
};
