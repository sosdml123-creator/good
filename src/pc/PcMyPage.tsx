import React, { useRef, useState } from 'react';
import {
  Bell, Camera, ChevronRight, Gift, Heart, Loader2, MessageSquareText, Pencil, Scale, Settings, ShieldCheck, Tag, Wallet,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MyBookmarksModal } from '../components/my/MyBookmarksModal';
import { MyReviewsModal } from '../components/my/MyReviewsModal';
import { PointHistoryModal } from '../components/my/PointHistoryModal';
import { EditNicknameModal } from '../components/my/EditNicknameModal';
import { DEFAULT_AVATAR, compressImageFile } from '../utils/avatars';
import { PcContainer } from './PcUi';

const PROVIDER_LABEL: Record<string, string> = {
  apple: 'Apple 계정 연동',
  kakao: '카카오 계정 연동',
  google: 'Google 계정 연동',
};

/** PC 마이페이지: 왼쪽 프로필 · 오른쪽 활동/혜택/설정 (모바일 마이 화면과 별도) */
export const PcMyPage: React.FC = () => {
  const {
    bookmarkedIds, comparedIds, userPoints, reviews, currentUser, savedSaleIds, purchasedCoupons,
    setActiveTab, openPermissionModal, openNotificationCenter, updateUserProfile,
  } = useApp();

  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isPointHistoryOpen, setIsPointHistoryOpen] = useState(false);
  const [isEditNicknameOpen, setIsEditNicknameOpen] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const myReviewsCount = reviews.filter(r => (r.userId ? r.userId === currentUser.uid : r.userName === currentUser.displayName)).length;
  const unusedCoupons = purchasedCoupons.filter(c => !c.isUsed).length;

  const handleOpenAlbum = () => {
    if (!isProcessingImage) fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 선택할 수 있습니다.');
      return;
    }
    try {
      setIsProcessingImage(true);
      const compressed = await compressImageFile(file, 360, 0.85);
      await updateUserProfile({ photoURL: compressed });
    } catch (err) {
      console.error('Profile photo upload error:', err);
      alert('이미지를 불러오는데 실패했습니다.');
    } finally {
      setIsProcessingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const stats = [
    { label: '내가 쓴 리뷰', value: `${myReviewsCount}`, unit: '개', icon: MessageSquareText, action: () => setIsReviewsOpen(true) },
    { label: '찜한 제품', value: `${bookmarkedIds.length}`, unit: '개', icon: Heart, action: () => setIsBookmarksOpen(true) },
    { label: '비교함', value: `${comparedIds.length}`, unit: '개', icon: Scale, action: () => setActiveTab('compare') },
    { label: '보유 포인트', value: userPoints.toLocaleString(), unit: 'P', icon: Wallet, action: () => setIsPointHistoryOpen(true), accent: true },
  ];

  const groups: { title: string; items: { label: string; sub?: string; icon: React.ElementType; action: () => void }[] }[] = [
    {
      title: '혜택 · 소식',
      items: [
        { label: 'e쿠폰 상점 · 내 쿠폰함', sub: unusedCoupons > 0 ? `${unusedCoupons}개 보유` : '포인트로 교환하기', icon: Gift, action: () => setActiveTab('coupon') },
        { label: '포인트 적립 · 사용 내역', sub: `${userPoints.toLocaleString()}P`, icon: Wallet, action: () => setIsPointHistoryOpen(true) },
        { label: '편의점·마트 행사소식', sub: `${savedSaleIds.length}개 찜`, icon: Tag, action: () => setActiveTab('calendar') },
      ],
    },
    {
      title: '계정 · 설정',
      items: [
        { label: '닉네임 수정', sub: currentUser.displayName, icon: Pencil, action: () => setIsEditNicknameOpen(true) },
        { label: '알림함', icon: Bell, action: () => openNotificationCenter('inbox') },
        { label: '알림 & 권한 안내', sub: '마케팅·신제품·위치', icon: ShieldCheck, action: () => openPermissionModal() },
        { label: '설정', sub: '알림·약관·계정관리', icon: Settings, action: () => setActiveTab('settings') },
      ],
    },
  ];

  return (
    <div className="bg-[#F5F5F7] py-12">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      <PcContainer>
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight mb-8">마이페이지</h1>

        <div className="grid grid-cols-[300px_1fr] gap-8 items-start">
          {/* 프로필 */}
          <aside className="bg-white rounded-2xl border border-gray-200 p-7 text-center">
            <button onClick={handleOpenAlbum} className="relative mx-auto block group cursor-pointer" title="프로필 사진 변경">
              <img
                src={currentUser.photoURL || DEFAULT_AVATAR}
                alt=""
                className="w-24 h-24 rounded-full object-cover bg-gray-100 border border-gray-200"
              />
              {isProcessingImage ? (
                <span className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </span>
              ) : (
                <span className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gray-900 text-white border-2 border-white flex items-center justify-center group-hover:bg-violet-600 transition-colors">
                  <Camera className="w-4 h-4" />
                </span>
              )}
            </button>
            <div className="mt-4 flex items-center justify-center gap-1.5">
              <p className="text-[20px] font-bold text-gray-900 truncate">{currentUser.displayName}</p>
              <button
                onClick={() => setIsEditNicknameOpen(true)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                aria-label="닉네임 수정"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-1 text-[13px] text-gray-500">{PROVIDER_LABEL[currentUser.provider ?? ''] ?? '신상픽 회원'}</p>

            <button
              onClick={() => setIsPointHistoryOpen(true)}
              className="mt-6 w-full rounded-xl bg-violet-50 px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-violet-100 transition-colors"
            >
              <span className="text-[14px] font-medium text-violet-900">보유 포인트</span>
              <span className="text-[20px] font-bold text-violet-700">{userPoints.toLocaleString()}P</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className="mt-3 w-full h-11 rounded-xl border border-gray-200 text-[14px] text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              설정
            </button>
          </aside>

          <div className="space-y-8 min-w-0">
            {/* 활동 요약 */}
            <section>
              <h2 className="text-[18px] font-bold text-gray-900 mb-4">나의 활동</h2>
              <div className="grid grid-cols-4 gap-4">
                {stats.map(s => (
                  <button
                    key={s.label}
                    onClick={s.action}
                    className="bg-white rounded-2xl border border-gray-200 p-6 text-left hover:border-gray-400 transition-colors cursor-pointer"
                  >
                    <s.icon className={`w-6 h-6 ${s.accent ? 'text-violet-600' : 'text-gray-500'}`} />
                    <p className="mt-5 text-[14px] text-gray-500">{s.label}</p>
                    <p className="mt-1 text-[26px] font-bold text-gray-900">
                      {s.value}
                      <span className="ml-0.5 text-[15px] font-medium text-gray-500">{s.unit}</span>
                    </p>
                  </button>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-2 gap-6">
              {groups.map(g => (
                <section key={g.title}>
                  <h2 className="text-[18px] font-bold text-gray-900 mb-4">{g.title}</h2>
                  <ul className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
                    {g.items.map(item => (
                      <li key={item.label}>
                        <button
                          onClick={item.action}
                          className="w-full px-5 h-16 flex items-center gap-3 text-left hover:bg-gray-50 cursor-pointer"
                        >
                          <item.icon className="w-5 h-5 text-gray-500 shrink-0" />
                          <span className="flex-1 text-[15px] font-medium text-gray-900">{item.label}</span>
                          {item.sub && <span className="text-[13px] text-gray-500 truncate max-w-[160px]">{item.sub}</span>}
                          <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>
      </PcContainer>

      <MyBookmarksModal isOpen={isBookmarksOpen} onClose={() => setIsBookmarksOpen(false)} />
      <MyReviewsModal isOpen={isReviewsOpen} onClose={() => setIsReviewsOpen(false)} />
      <PointHistoryModal isOpen={isPointHistoryOpen} onClose={() => setIsPointHistoryOpen(false)} />
      <EditNicknameModal isOpen={isEditNicknameOpen} onClose={() => setIsEditNicknameOpen(false)} />
    </div>
  );
};
