import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, ChevronRight, Edit3, Camera } from 'lucide-react';
import { MyBookmarksModal } from './MyBookmarksModal';
import { MyReviewsModal } from './MyReviewsModal';
import { EditProfileModal } from './EditProfileModal';
import { DEFAULT_AVATAR } from '../../utils/avatars';

export const MyPageView: React.FC = () => {
  const { 
    bookmarkedIds, 
    comparedIds, 
    userPoints, 
    reviews,
    currentUser,
    savedSaleIds,
    setActiveTab
  } = useApp();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

  const myReviewsCount = reviews.filter(r => r.userName === currentUser.displayName).length;

  const menuItems = [
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
      
      {/* 1. Profile header */}
      <div className="bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900 px-5 pt-6 pb-16 text-white relative shadow-sm">
        <div className="flex items-center gap-3.5">
          {/* Avatar with Camera Overlay */}
          <div 
            onClick={() => setIsEditProfileOpen(true)}
            className="relative cursor-pointer group shrink-0"
            title="프로필 사진 및 닉네임 변경"
          >
            <img
              src={currentUser.photoURL || DEFAULT_AVATAR}
              alt="profile"
              className="w-14 h-14 rounded-full border-2 border-white/30 object-cover bg-slate-950 shrink-0 shadow-md transition-transform group-hover:scale-105"
            />
            <div className="absolute -bottom-0.5 -right-0.5 p-1 bg-gray-900 text-white rounded-full border border-white/40 shadow-sm group-hover:bg-amber-500 transition-colors">
              <Camera className="w-3 h-3" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[17px] font-extrabold truncate">{currentUser.displayName}</span>
              <span className="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded-full shrink-0">
                {currentUser.level}
              </span>
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="p-1 text-white/70 hover:text-white transition-colors"
                title="닉네임 / 프로필 변경"
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
            className="cursor-pointer hover:bg-gray-50 rounded-l-xl transition-colors py-0.5"
            title="내가 쓴 리뷰 보기"
          >
            <div className="text-[20px] font-black text-gray-900">{myReviewsCount}</div>
            <div className="text-[11px] text-gray-500 font-semibold mt-0.5">내가 쓴 리뷰</div>
          </div>
          <div>
            <div className="text-[20px] font-black text-amber-500">{userPoints.toLocaleString()}P</div>
            <div className="text-[11px] text-gray-400 mt-0.5">보유 포인트</div>
          </div>
          <div 
            onClick={() => setIsBookmarksOpen(true)}
            className="cursor-pointer hover:bg-gray-50 rounded-r-xl transition-colors py-0.5"
            title="찜한 제품 목록 보기"
          >
            <div className="text-[20px] font-black text-gray-900">{bookmarkedIds.length}</div>
            <div className="text-[11px] text-gray-500 font-semibold mt-0.5">찜한 제품</div>
          </div>
        </div>
      </div>

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
                <span className={`text-[13px] ${m.hi ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                  {m.sub}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Edit Profile & Nickname & Photo Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

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

