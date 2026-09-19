import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight } from 'lucide-react';

export const AuthOnboardingView: React.FC = () => {
  const { loginWithApple, loginWithKakao, setIsGuestBrowse, openPermissionModal } = useApp();

  const handleGuestBrowse = () => {
    setIsGuestBrowse(true);
    const reviewed = localStorage.getItem('sinsangpick_permissions_reviewed');
    if (!reviewed) {
      openPermissionModal();
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#F2F4F7]">
      <div className="w-full max-w-[430px] min-h-[100dvh] bg-white flex flex-col justify-between p-6 sm:p-8 relative overflow-hidden shadow-sm">
        
        {/* Subtle Decorative Ambient Glow */}
        <div className="absolute -top-24 -left-20 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-70 pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 w-60 h-60 bg-amber-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

        {/* Spacer for Top Balance */}
        <div className="h-4" />

        {/* Center Section: Logo & 2 Login Buttons */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full my-auto py-8">
          {/* Centered Logo & Title */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-xl shadow-blue-500/10 border border-gray-100 bg-white p-1 mb-4">
              <img 
                src="/logo.png" 
                alt="신상픽" 
                className="w-full h-full object-cover rounded-[20px]" 
              />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">
              신상픽
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-1">
              신제품 실시간 탐색 & 솔직 리뷰
            </p>
          </div>

          {/* Centered 2 Login Buttons (Apple & Kakao) */}
          <div className="w-full max-w-[320px] space-y-3">
            {/* Apple Login */}
            <button
              onClick={loginWithApple}
              className="w-full h-12 bg-black hover:bg-neutral-900 active:scale-[0.99] text-white rounded-2xl flex items-center justify-center gap-2.5 font-bold text-[14px] shadow-sm transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current shrink-0 -mt-0.5" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.93.04-2.02.63-2.66 1.38-.56.65-1.06 1.71-.93 2.74 1.04.08 2.07-.5 2.67-1.25z" />
              </svg>
              <span>Apple로 계속하기</span>
            </button>

            {/* Kakao Login */}
            <button
              onClick={loginWithKakao}
              className="w-full h-12 bg-[#FEE500] hover:bg-[#FADA0A] active:scale-[0.99] text-[#191919] rounded-2xl flex items-center justify-center gap-2.5 font-bold text-[14px] shadow-sm transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.868 1.865 5.385 4.674 6.756l-.973 3.61c-.085.316.273.57.544.385l4.316-2.915c.471.054.951.084 1.439.084 5.523 0 10-3.582 10-8s-4.477-8-10-8z" />
              </svg>
              <span>카카오로 시작하기</span>
            </button>

            {/* Guest Browse Option */}
            <div className="pt-2 text-center">
              <button
                onClick={handleGuestBrowse}
                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors py-1 cursor-pointer"
              >
                <span>로그인 없이 둘러보기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal Notice */}
        <div className="relative z-10 pb-2 text-center">
          <p className="text-[11px] text-gray-400 leading-tight">
            시작 시 <a href="/terms" target="_blank" rel="noreferrer" className="underline hover:text-gray-600">이용약관</a> 및 <a href="/privacy" target="_blank" rel="noreferrer" className="underline hover:text-gray-600">개인정보처리방침</a>에 동의합니다.
          </p>
        </div>

      </div>
    </div>
  );
};
