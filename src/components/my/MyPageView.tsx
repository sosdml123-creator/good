import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, ChevronRight, Edit3, LogIn, LogOut, X, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { MyBookmarksModal } from './MyBookmarksModal';
import { MyReviewsModal } from './MyReviewsModal';

export const MyPageView: React.FC = () => {
  const { 
    bookmarkedIds, 
    comparedIds, 
    userPoints, 
    reviews,
    currentUser,
    updateUserNickname,
    loginWithApple,
    loginWithGoogle,
    loginWithKakao,
    logout,
    setActiveTab
  } = useApp();

  const [isEditNicknameOpen, setIsEditNicknameOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(currentUser.displayName);

  const myReviewsCount = reviews.filter(r => r.userName === currentUser.displayName).length;

  const handleSaveNickname = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicknameInput.trim()) return;
    updateUserNickname(nicknameInput.trim());
    setIsEditNicknameOpen(false);
  };

  const menuItems = [
    { label: '내가 쓴 리뷰', sub: `${myReviewsCount}개`, action: () => setIsReviewsOpen(true) },
    { label: '찜한 제품', sub: `${bookmarkedIds.length}개`, action: () => setIsBookmarksOpen(true) },
    { label: '비교함', sub: `${comparedIds.length}개`, action: () => setActiveTab('compare') },
    { label: '출시알림 설정', sub: '', action: () => setActiveTab('alert_settings') },
    { label: '포인트', sub: `${userPoints.toLocaleString()}P`, hi: true },
    { label: '⚙️ 서비스 관리자 (Admin)', sub: '배너/상품/배틀 관리', hi: true, action: () => setActiveTab('admin') },
    { label: '설정', sub: '', action: () => setActiveTab('alert_settings') },
    ...(!currentUser.isAnonymous ? [
      { label: '로그아웃', sub: '', action: logout, isLogout: true }
    ] : [])
  ];

  const getProviderBadge = () => {
    if (currentUser.isAnonymous) {
      return (
        <span className="text-[11px] bg-white/20 text-white/90 px-2 py-0.5 rounded-full font-medium">
          게스트 모드
        </span>
      );
    }
    if (currentUser.provider === 'apple') {
      return (
        <span className="text-[11px] bg-black/30 text-white px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
          🍎 Apple 연동 완료
        </span>
      );
    }
    if (currentUser.provider === 'kakao') {
      return (
        <span className="text-[11px] bg-[#FEE500]/30 text-amber-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
          💬 카카오 연동 완료
        </span>
      );
    }
    return (
      <span className="text-[11px] bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
        🌐 Google 연동 완료
      </span>
    );
  };

  return (
    <div className="bg-[#F5F5F5] min-h-full pb-14">
      
      {/* 1. Blue profile header */}
      <div className="bg-[#0066FF] px-5 pt-6 pb-16 text-white relative">
        <div className="flex items-center gap-3.5">
          <img
            src={currentUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop&q=80'}
            alt="profile"
            className="w-14 h-14 rounded-full border-2 border-white/50 object-cover bg-white/20 shrink-0 shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[17px] font-extrabold truncate">{currentUser.displayName}</span>
              <span className="text-[10px] font-bold bg-white/25 px-1.5 py-0.5 rounded-full shrink-0">
                {currentUser.level}
              </span>
              <button
                onClick={() => {
                  setNicknameInput(currentUser.displayName);
                  setIsEditNicknameOpen(true);
                }}
                className="p-1 text-white/80 hover:text-white transition-colors"
                title="닉네임 변경"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {getProviderBadge()}
              
              {currentUser.isAnonymous && (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-[11px] bg-white text-[#0066FF] hover:bg-white/90 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-all shadow-sm active:scale-95"
                >
                  <LogIn className="w-3 h-3" />
                  <span>로그인 / 연동</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {!currentUser.isAnonymous && (
              <button
                onClick={logout}
                className="p-1.5 text-white/80 hover:text-white"
                title="로그아웃"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setActiveTab('alert_settings')}
              className="p-1.5 text-white/80 hover:text-white"
              title="설정"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Stats card */}
      <div className="px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 grid grid-cols-3 divide-x divide-gray-100 py-3.5 text-center">
          <div 
            onClick={() => setIsReviewsOpen(true)}
            className="cursor-pointer hover:bg-blue-50/40 rounded-l-xl transition-colors py-0.5"
            title="내가 쓴 리뷰 보기"
          >
            <div className="text-[20px] font-black text-gray-900">{myReviewsCount}</div>
            <div className="text-[11px] text-gray-500 font-semibold mt-0.5">내가 쓴 리뷰</div>
          </div>
          <div>
            <div className="text-[20px] font-black text-[#0066FF]">{userPoints.toLocaleString()}P</div>
            <div className="text-[11px] text-gray-400 mt-0.5">보유 포인트</div>
          </div>
          <div 
            onClick={() => setIsBookmarksOpen(true)}
            className="cursor-pointer hover:bg-rose-50/40 rounded-r-xl transition-colors py-0.5"
            title="찜한 제품 목록 보기"
          >
            <div className="text-[20px] font-black text-gray-900">{bookmarkedIds.length}</div>
            <div className="text-[11px] text-gray-500 font-semibold mt-0.5">찜한 제품</div>
          </div>
        </div>
      </div>

      {/* 3. Guest Login Callout Banner (if anonymous) */}
      {currentUser.isAnonymous && (
        <div className="px-4 mt-3">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-4 text-white shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>로그인 혜택</span>
                </div>
                <h4 className="font-extrabold text-[15px] leading-snug">
                  아이폰 / 소셜 계정으로 로그인하기
                </h4>
                <p className="text-[11px] text-slate-300 mt-1">
                  작성한 리뷰와 찜 목록이 안전하게 보관되고 +150P가 지급됩니다.
                </p>
              </div>
            </div>

            {/* Quick Apple & Social Login Buttons */}
            <div className="mt-3.5 space-y-2">
              {/* Apple Sign-In Button (Primary for iPhone users) */}
              <button
                onClick={loginWithApple}
                className="w-full bg-black hover:bg-black/90 active:scale-[0.99] text-white border border-white/20 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.66-7.87-11.88-14.36-5.83-8.91-10.36-18.9-13.58-29.98-3.23-11.07-4.84-21.84-4.84-32.31 0-14.07 3.52-25.75 10.57-35.03 7.05-9.28 16.03-13.98 26.94-14.09 5.37 0 11.13 1.48 17.28 4.43 6.15 2.95 10.05 4.5 11.7 4.67 1.47-.17 5.56-1.78 12.28-4.84 6.72-3.05 12.44-4.37 17.16-3.95 12.59 1.06 22.39 5.86 29.39 14.4-11.07 6.72-16.48 16.08-16.23 28.09.25 9.49 3.86 17.38 10.84 23.68 5.48 5.04 11.96 8.35 19.45 9.94-2.58 7.73-5.74 15.54-9.48 23.43zm-27.17-111.45c0 7.42-2.73 14.15-8.19 20.2-5.91 6.46-13.06 10.31-21.46 11.55-.26-1.18-.39-2.27-.39-3.27 0-7.33 2.87-14.31 8.61-20.94 2.86-3.32 6.4-6.03 10.6-8.13 4.2-2.1 8.16-3.24 11.88-3.41.34 1.34.51 2.68.51 4z" />
                </svg>
                <span>Apple로 계속하기 (아이폰 추천)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                {/* Google Sign-In */}
                <button
                  onClick={loginWithGoogle}
                  className="bg-white hover:bg-gray-50 active:scale-[0.99] text-gray-800 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>Google</span>
                </button>

                {/* Kakao Sign-In */}
                <button
                  onClick={loginWithKakao}
                  className="bg-[#FEE500] hover:bg-[#FADA0A] active:scale-[0.99] text-[#3C1E1E] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <svg className="w-3.5 h-3.5 fill-[#3C1E1E]" viewBox="0 0 24 24">
                    <path d="M12 3C6.477 3 2 6.477 2 10.764c0 2.76 1.875 5.177 4.708 6.494l-1.197 4.388c-.105.386.326.697.662.473l5.22-3.468c.2-.008.403-.016.607-.016 5.523 0 10-3.477 10-7.764C22 6.477 17.523 3 12 3z"/>
                  </svg>
                  <span>카카오</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Menu list */}
      <div className="mt-4 bg-white divide-y divide-gray-100 rounded-2xl mx-4 overflow-hidden border border-gray-100 shadow-sm">
        {menuItems.map((m) => (
          <div
            key={m.label}
            onClick={m.action}
            className={`flex items-center justify-between px-4 py-3.5 cursor-pointer active:bg-gray-50 hover:bg-gray-50/60 transition-colors ${
              (m as any).isLogout ? 'text-red-500' : ''
            }`}
          >
            <span className={`text-[14px] font-semibold ${(m as any).isLogout ? 'text-red-500 font-bold' : 'text-gray-800'}`}>
              {m.label}
            </span>
            <div className="flex items-center gap-2">
              {m.sub && (
                <span className={`text-[13px] ${m.hi ? 'text-[#0066FF] font-bold' : 'text-gray-400'}`}>
                  {m.sub}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </div>
        ))}
      </div>

      {/* 5. Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0066FF]" />
                <span className="text-base font-bold text-gray-900">간편 로그인</span>
              </div>
              <button 
                onClick={() => setIsLoginModalOpen(false)} 
                className="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-2">
              <h3 className="text-lg font-black text-gray-900">신상픽에 오신 것을 환영합니다</h3>
              <p className="text-xs text-gray-500 mt-1">
                로그인하고 나만의 신상 리뷰와 찜 목록을 관리해보세요.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {/* Apple Login */}
              <button
                onClick={() => {
                  setIsLoginModalOpen(false);
                  loginWithApple();
                }}
                className="w-full bg-black hover:bg-gray-900 active:scale-[0.99] text-white py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.66-7.87-11.88-14.36-5.83-8.91-10.36-18.9-13.58-29.98-3.23-11.07-4.84-21.84-4.84-32.31 0-14.07 3.52-25.75 10.57-35.03 7.05-9.28 16.03-13.98 26.94-14.09 5.37 0 11.13 1.48 17.28 4.43 6.15 2.95 10.05 4.5 11.7 4.67 1.47-.17 5.56-1.78 12.28-4.84 6.72-3.05 12.44-4.37 17.16-3.95 12.59 1.06 22.39 5.86 29.39 14.4-11.07 6.72-16.48 16.08-16.23 28.09.25 9.49 3.86 17.38 10.84 23.68 5.48 5.04 11.96 8.35 19.45 9.94-2.58 7.73-5.74 15.54-9.48 23.43zm-27.17-111.45c0 7.42-2.73 14.15-8.19 20.2-5.91 6.46-13.06 10.31-21.46 11.55-.26-1.18-.39-2.27-.39-3.27 0-7.33 2.87-14.31 8.61-20.94 2.86-3.32 6.4-6.03 10.6-8.13 4.2-2.1 8.16-3.24 11.88-3.41.34 1.34.51 2.68.51 4z" />
                </svg>
                <span>Apple로 계속하기 (아이폰)</span>
              </button>

              {/* Google Login */}
              <button
                onClick={() => {
                  setIsLoginModalOpen(false);
                  loginWithGoogle();
                }}
                className="w-full bg-white hover:bg-gray-50 active:scale-[0.99] text-gray-800 border border-gray-200 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Google로 계속하기</span>
              </button>

              {/* Kakao Login */}
              <button
                onClick={() => {
                  setIsLoginModalOpen(false);
                  loginWithKakao();
                }}
                className="w-full bg-[#FEE500] hover:bg-[#FADA0A] active:scale-[0.99] text-[#3C1E1E] py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <svg className="w-4 h-4 fill-[#3C1E1E]" viewBox="0 0 24 24">
                  <path d="M12 3C6.477 3 2 6.477 2 10.764c0 2.76 1.875 5.177 4.708 6.494l-1.197 4.388c-.105.386.326.697.662.473l5.22-3.468c.2-.008.403-.016.607-.016 5.523 0 10-3.477 10-7.764C22 6.477 17.523 3 12 3z"/>
                </svg>
                <span>카카오로 계속하기</span>
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
                다음에 할게요 (게스트 모드 유지)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Edit Nickname Modal */}
      {isEditNicknameOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">닉네임 변경</span>
              <button onClick={() => setIsEditNicknameOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNickname} className="space-y-3">
              <input
                type="text"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                maxLength={15}
                autoFocus
                placeholder="새로운 닉네임을 입력하세요"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-[#0066FF]"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditNicknameOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#0066FF] text-white text-xs font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>변경완료</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* My Bookmarks & My Reviews Modals */}
      <MyBookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
      />

      <MyReviewsModal
        isOpen={isReviewsOpen}
        onClose={() => setIsReviewsOpen(false)}
      />

    </div>
  );
};

