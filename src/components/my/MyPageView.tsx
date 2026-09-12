import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, ChevronRight, Edit3, X, Check } from 'lucide-react';
import { MyBookmarksModal } from './MyBookmarksModal';
import { MyReviewsModal } from './MyReviewsModal';

export const MyPageView: React.FC = () => {
  const { 
    bookmarkedIds, 
    comparedIds, 
    userPoints, 
    reviews,
    currentUser,
    savedSaleIds,
    updateUserNickname,
    setActiveTab,
    openLoginModal,
    loginWithApple
  } = useApp();

  const [isEditNicknameOpen, setIsEditNicknameOpen] = useState(false);
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
    ...(currentUser.isAnonymous ? [
      { label: '🔑 간편 로그인 / 계정 연동', sub: 'Apple·카카오·Google', hi: true, action: openLoginModal }
    ] : []),
    { label: '내가 쓴 리뷰', sub: `${myReviewsCount}개`, action: () => setIsReviewsOpen(true) },
    { label: '찜한 제품', sub: `${bookmarkedIds.length}개`, action: () => setIsBookmarksOpen(true) },
    { label: '비교함', sub: `${comparedIds.length}개`, action: () => setActiveTab('compare') },
    { label: '🏷️ 편의점·마트 행사소식', sub: `${savedSaleIds.length}개 찜`, hi: true, action: () => setActiveTab('calendar') },
    { label: '출시알림 설정', sub: '', action: () => setActiveTab('alert_settings') },
    { label: '포인트', sub: `${userPoints.toLocaleString()}P`, hi: true },
    { label: '⚙️ 서비스 관리자 (Admin)', sub: '배너/상품/배틀 관리', hi: true, action: () => setActiveTab('admin') },
    { label: '설정', sub: '알림·약관·계정관리', action: () => setActiveTab('settings') },
  ];

  const getProviderBadge = () => {
    if (currentUser.provider === 'apple') {
      return (
        <span className="text-[11px] bg-black/30 text-white px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
          🍎 Apple 연동
        </span>
      );
    }
    if (currentUser.provider === 'kakao') {
      return (
        <span className="text-[11px] bg-[#FEE500]/30 text-amber-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
          💬 카카오 연동
        </span>
      );
    }
    if (currentUser.provider === 'google') {
      return (
        <span className="text-[11px] bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
          🌐 Google 연동
        </span>
      );
    }
    return (
      <span className="text-[11px] bg-white/20 text-white/90 px-2 py-0.5 rounded-full font-medium">
        신상픽 회원
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
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setActiveTab('settings')}
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

      {/* 2.5 Quick Social Login / Account Link Banner */}
      {currentUser.isAnonymous && (
        <div className="px-4 mt-3">
          <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-black rounded-2xl p-4 text-white shadow-sm border border-gray-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-md">
                  간편 계정 연결
                </span>
                <h3 className="text-[14px] font-extrabold mt-1.5 leading-snug">
                  계정을 연결하고 내 활동을 안전하게 보관하세요
                </h3>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                  기기를 변경해도 리뷰, 찜 목록, 보유 포인트를 그대로 유지할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-gray-800 flex items-center gap-2">
              <button
                onClick={loginWithApple}
                className="flex-1 h-10 bg-white hover:bg-gray-100 active:scale-[0.99] text-black rounded-xl flex items-center justify-center gap-2 font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.42-6.74-10.23-11.75-21.9-15.03-35.01-3.28-13.11-4.92-25.16-4.92-36.15 0-14.36 3.69-26.06 11.07-35.1 7.38-9.04 16.74-13.68 28.08-13.91 4.79 0 10.27 1.22 16.44 3.66 6.18 2.44 10.05 3.72 11.62 3.84 2.07-.23 6.06-1.55 11.96-3.96 5.9-2.42 11.07-3.51 15.52-3.28 14.15.82 25.17 6.13 33.06 15.93-12.38 7.5-18.42 17.65-18.12 30.45.31 10.24 4.29 18.79 11.94 25.65 7.65 6.86 16.79 10.74 27.42 11.65-2.22 6.74-4.82 13.54-7.8 20.41zM119.22 32.64c0-7.39 2.67-14.33 8.01-20.82 5.34-6.49 12.01-10.66 20.02-12.51.21 1.09.32 2.12.32 3.09 0 7.39-2.73 14.48-8.19 21.26-5.46 6.78-12.18 10.9-20.16 12.36-.21-1.09-.32-2.12-.32-3.38z" />
                </svg>
                <span>Apple로 시작하기</span>
              </button>
              <button
                onClick={openLoginModal}
                className="h-10 px-3 bg-white/10 hover:bg-white/20 active:scale-[0.99] text-gray-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                더보기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Menu list */}
      <div className="mt-4 bg-white divide-y divide-gray-100 rounded-2xl mx-4 overflow-hidden border border-gray-100 shadow-sm">
        {menuItems.map((m) => (
          <div
            key={m.label}
            onClick={m.action}
            className="flex items-center justify-between px-4 py-3.5 cursor-pointer active:bg-gray-50 hover:bg-gray-50/60 transition-colors"
          >
            <span className="text-[14px] font-semibold text-gray-800">
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

