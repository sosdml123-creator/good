import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, ChevronRight, Edit3, LogIn, X, Check } from 'lucide-react';

export const MyPageView: React.FC = () => {
  const { 
    bookmarkedIds, 
    comparedIds, 
    userPoints, 
    reviews,
    currentUser,
    updateUserNickname,
    loginWithGoogle,
    setActiveTab, 
    setSelectedCategory 
  } = useApp();

  const [isEditNicknameOpen, setIsEditNicknameOpen] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(currentUser.displayName);

  const myReviewsCount = reviews.filter(r => r.userName === currentUser.displayName).length;

  const handleSaveNickname = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicknameInput.trim()) return;
    updateUserNickname(nicknameInput.trim());
    setIsEditNicknameOpen(false);
  };

  const menuItems = [
    { label: '내가 쓴 리뷰', sub: `${myReviewsCount}개`, action: () => { setSelectedCategory('전체'); setActiveTab('category'); } },
    { label: '찜한 제품', sub: `${bookmarkedIds.length}개`, action: () => { setSelectedCategory('전체'); setActiveTab('category'); } },
    { label: '비교함', sub: `${comparedIds.length}개`, action: () => setActiveTab('compare') },
    { label: '출시알림 설정', sub: '', action: () => setActiveTab('alert_settings') },
    { label: '포인트', sub: `${userPoints.toLocaleString()}P`, hi: true },
    { label: '설정', sub: '', action: () => setActiveTab('alert_settings') },
  ];

  return (
    <div className="bg-[#F5F5F5] min-h-full pb-12">
      
      {/* 1. Blue profile header */}
      <div className="bg-[#0066FF] px-5 pt-5 pb-14 text-white relative">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop&q=80'}
            alt="profile"
            className="w-14 h-14 rounded-full border-2 border-white/50 object-cover bg-white/20"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[16px] font-bold truncate">{currentUser.displayName}</span>
              <span className="text-[10px] font-semibold bg-white/25 px-1.5 py-0.5 rounded-full shrink-0">
                {currentUser.level}
              </span>
              <button
                onClick={() => {
                  setNicknameInput(currentUser.displayName);
                  setIsEditNicknameOpen(true);
                }}
                className="p-1 text-white/80 hover:text-white"
                title="닉네임 변경"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[12px] text-white/80">
                {currentUser.isAnonymous ? '게스트 모드로 이용 중' : '소셜 로그인 완료'}
              </span>
              {currentUser.isAnonymous && (
                <button
                  onClick={loginWithGoogle}
                  className="text-[11px] bg-white/20 hover:bg-white/30 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Google 연동</span>
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('alert_settings')}
            className="p-1.5 hover:text-white/80 shrink-0"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Stats card */}
      <div className="px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 grid grid-cols-3 divide-x divide-gray-100 py-3 text-center">
          <div>
            <div className="text-[20px] font-black text-gray-900">{myReviewsCount}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">내가 쓴 리뷰</div>
          </div>
          <div>
            <div className="text-[20px] font-black text-gray-900">{userPoints.toLocaleString()}P</div>
            <div className="text-[11px] text-gray-400 mt-0.5">보유 포인트</div>
          </div>
          <div>
            <div className="text-[20px] font-black text-gray-900">{bookmarkedIds.length}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">찜한 제품</div>
          </div>
        </div>
      </div>

      {/* 3. Menu list */}
      <div className="mt-4 bg-white divide-y divide-gray-100">
        {menuItems.map((m) => (
          <div
            key={m.label}
            onClick={m.action}
            className="flex items-center justify-between px-4 py-3.5 cursor-pointer active:bg-gray-50 hover:bg-gray-50/60 transition-colors"
          >
            <span className="text-[14px] font-semibold text-gray-800">{m.label}</span>
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

      {/* 4. Edit Nickname Modal */}
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

    </div>
  );
};
