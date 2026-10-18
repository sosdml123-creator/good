import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Bell, Heart, Menu, PenLine, Search, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveTab, ProductCategory } from '../types';
import { CATEGORIES } from '../data/mockProducts';
import { NetworkStatusBar } from '../components/common/NetworkStatusBar';
import { ToastContainer } from '../components/common/Toast';
import { PushBanner } from '../components/common/PushBanner';
import { AuthCallbackBridge } from '../components/auth/AuthCallbackBridge';
import { PcHome } from './PcHome';
import { PcProductList } from './PcProductList';
import { PcProductDetail } from './PcProductDetail';
import { PcRanking, PcSearch, PcBrand } from './PcPages';
import { PcMarket } from './PcMarket';
import { PcStores } from './PcExtras';
import { PcDonki } from './PcDonki';
import { PcContainer } from './PcUi';

// PC 전용 화면이 없는 기능은 앱 화면을 가운데 카드 안에 그대로 보여줍니다.
const Views = {
  CommunityView: lazy(() => import('../components/community/CommunityView').then(m => ({ default: m.CommunityView }))),
  MyPageView: lazy(() => import('../components/my/MyPageView').then(m => ({ default: m.MyPageView }))),
  WriteReviewModal: lazy(() => import('../components/review/WriteReviewModal').then(m => ({ default: m.WriteReviewModal }))),
  CompareModal: lazy(() => import('../components/compare/CompareModal').then(m => ({ default: m.CompareModal }))),
  NotificationModal: lazy(() => import('../components/notification/NotificationModal').then(m => ({ default: m.NotificationModal }))),
  EventDetailModal: lazy(() => import('../components/event/EventDetailModal').then(m => ({ default: m.EventDetailModal }))),
  SettingsView: lazy(() => import('../components/settings/SettingsView').then(m => ({ default: m.SettingsView }))),
  SaleNewsView: lazy(() => import('../components/sale/SaleNewsView').then(m => ({ default: m.SaleNewsView }))),
  CouponShopView: lazy(() => import('../components/coupon/CouponShopView').then(m => ({ default: m.CouponShopView }))),
};
const RecipeDetailModal = lazy(() => import('../components/recipe/RecipeDetailModal').then(m => ({ default: m.RecipeDetailModal })));
const WriteRecipeModal = lazy(() => import('../components/recipe/WriteRecipeModal').then(m => ({ default: m.WriteRecipeModal })));
const LoginModal = lazy(() => import('../components/common/LoginModal').then(m => ({ default: m.LoginModal })));
const NicknameSetupModal = lazy(() => import('../components/auth/NicknameSetupModal').then(m => ({ default: m.NicknameSetupModal })));

const Spinner = () => (
  <div className="py-40 flex items-center justify-center">
    <div className="w-7 h-7 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
  </div>
);

type NavItem = { label: string; tab: ActiveTab };

const NAV_ITEMS: NavItem[] = [
  { label: '신상품', tab: 'category' },
  { label: '랭킹', tab: 'ranking' },
  { label: '브랜드관', tab: 'brand' },
  { label: '오늘의 시세', tab: 'market' },
  { label: '돈키호테', tab: 'donki' },
  { label: '편의점 비교', tab: 'stores' },
  { label: '행사·할인', tab: 'calendar' },
  { label: '수다방', tab: 'community' },
];

const HeaderIconButton: React.FC<{ label: string; onClick: () => void; badge?: number; children: React.ReactNode }> = ({
  label, onClick, badge, children,
}) => (
  <button onClick={onClick} className="relative flex flex-col items-center gap-1 w-14 text-gray-800 hover:text-gray-900 cursor-pointer">
    {children}
    <span className="text-[11px]">{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className="absolute -top-1 right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center">
        {badge > 99 ? '99+' : badge}
      </span>
    )}
  </button>
);

const PcHeader: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedCategory,
    setSelectedCategory,
    setSelectedBrand,
    setSearchQuery,
    addRecentSearch,
    currentUser,
    openLoginModal,
    unreadNotificationCount,
    openNotificationCenter,
    bookmarkedIds,
  } = useApp();
  const [query, setQuery] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const isLoggedIn = !currentUser.isAnonymous;

  const goCategory = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setActiveTab('category');
    setIsCategoryOpen(false);
  };

  const handleNav = (item: NavItem) => {
    if (item.tab === 'category') {
      goCategory('신제품');
      return;
    }
    if (item.tab === 'brand') setSelectedBrand(null);
    setActiveTab(item.tab);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    addRecentSearch(q);
    setSearchQuery(q);
    setActiveTab('search');
    setQuery('');
  };

  const isNavActive = (item: NavItem) =>
    item.tab === 'category' ? activeTab === 'category' && selectedCategory === '신제품' : activeTab === item.tab;

  return (
    <header className="shrink-0 bg-white z-40 border-b border-gray-200">
      {/* 상단 유틸 */}
      <PcContainer className="h-9 flex items-center justify-end gap-4 text-[12px] text-gray-500">
        {isLoggedIn ? (
          <button onClick={() => setActiveTab('my')} className="hover:text-gray-900 cursor-pointer">
            <span className="font-semibold text-gray-900">{currentUser.displayName}</span>님
          </button>
        ) : (
          <button onClick={openLoginModal} className="hover:text-gray-900 cursor-pointer">로그인 · 회원가입</button>
        )}
        <span className="w-px h-2.5 bg-gray-300" />
        <button onClick={() => setActiveTab('coupon')} className="hover:text-gray-900 cursor-pointer">e쿠폰</button>
        <span className="w-px h-2.5 bg-gray-300" />
        <button onClick={() => setActiveTab('settings')} className="hover:text-gray-900 cursor-pointer">고객센터</button>
      </PcContainer>

      {/* 로고 · 검색 · 아이콘 */}
      <PcContainer className="h-[84px] flex items-center gap-10">
        <button onClick={() => setActiveTab('home')} className="flex items-center gap-2.5 shrink-0 cursor-pointer" aria-label="신상픽 홈">
          <img src="/logo.png" alt="" className="w-10 h-10 rounded-xl border border-gray-200" />
          <span className="text-[26px] font-black text-gray-900 tracking-tight">신상픽</span>
        </button>

        <form onSubmit={submitSearch} className="flex-1 max-w-[460px] h-12 rounded-full border-2 border-violet-600 flex items-center pl-5 pr-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="신상품, 브랜드를 검색해 보세요"
            className="flex-1 min-w-0 text-[15px] text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
          />
          <button type="submit" aria-label="검색" className="w-9 h-9 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-50 cursor-pointer">
            <Search className="w-5 h-5" />
          </button>
        </form>

        <div className="ml-auto flex items-center gap-1">
          <HeaderIconButton label="리뷰쓰기" onClick={() => setActiveTab('write')}>
            <PenLine className="w-6 h-6 stroke-[1.6]" />
          </HeaderIconButton>
          <HeaderIconButton label="알림" onClick={() => openNotificationCenter('inbox')} badge={unreadNotificationCount}>
            <Bell className="w-6 h-6 stroke-[1.6]" />
          </HeaderIconButton>
          <HeaderIconButton label="찜" onClick={() => setActiveTab('my')} badge={bookmarkedIds.length}>
            <Heart className="w-6 h-6 stroke-[1.6]" />
          </HeaderIconButton>
          <HeaderIconButton label={isLoggedIn ? '마이' : '로그인'} onClick={() => (isLoggedIn ? setActiveTab('my') : openLoginModal())}>
            {isLoggedIn ? (
              <img src={currentUser.photoURL} alt="" className="w-6 h-6 rounded-full object-cover bg-gray-100" />
            ) : (
              <User className="w-6 h-6 stroke-[1.6]" />
            )}
          </HeaderIconButton>
        </div>
      </PcContainer>

      {/* 카테고리 · 메뉴 */}
      <PcContainer className="h-14 flex items-center gap-10 relative">
        <div className="relative h-full" onMouseEnter={() => setIsCategoryOpen(true)} onMouseLeave={() => setIsCategoryOpen(false)}>
          <button
            onClick={() => setIsCategoryOpen(v => !v)}
            className="h-full flex items-center gap-2 text-[16px] font-semibold text-gray-900 hover:text-gray-900 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
            카테고리
          </button>
          {isCategoryOpen && (
            <ul className="absolute left-0 top-full w-56 py-2 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50">
              {CATEGORIES.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => goCategory(cat)}
                    className="w-full text-left px-5 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <nav className="flex items-center h-full gap-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.label}
              onClick={() => handleNav(item)}
              className={`relative h-full px-4 text-[16px] cursor-pointer ${
                isNavActive(item) ? 'font-bold text-violet-700' : 'font-medium text-gray-800 hover:text-violet-700'
              }`}
            >
              {item.label}
              {isNavActive(item) && <span className="absolute left-4 right-4 bottom-0 h-[3px] bg-violet-600" />}
            </button>
          ))}
        </nav>
      </PcContainer>
    </header>
  );
};

const PcFooter: React.FC = () => {
  const { setActiveTab } = useApp();
  return (
    <footer className="border-t border-gray-200 bg-white">
      <PcContainer className="py-12 flex justify-between gap-10">
        <div>
          <p className="text-[18px] font-black text-gray-900">신상픽</p>
          <p className="mt-3 text-[13px] text-gray-500 leading-relaxed">
            새로 나온 먹거리를 가장 먼저 발견하고,<br />먹어본 사람들의 솔직한 평가를 확인하세요.
          </p>
          <p className="mt-6 text-[12px] text-gray-400">© 신상픽. All rights reserved.</p>
        </div>
        <div className="flex gap-16 text-[13px]">
          <div className="space-y-2.5">
            <p className="font-semibold text-gray-900">서비스</p>
            <button onClick={() => setActiveTab('ranking')} className="block text-gray-500 hover:text-gray-900 cursor-pointer">신상 랭킹</button>
            <button onClick={() => setActiveTab('community')} className="block text-gray-500 hover:text-gray-900 cursor-pointer">수다방</button>
            <button onClick={() => setActiveTab('coupon')} className="block text-gray-500 hover:text-gray-900 cursor-pointer">e쿠폰</button>
          </div>
          <div className="space-y-2.5">
            <p className="font-semibold text-gray-900">약관 및 정책</p>
            <a href="/terms" target="_blank" rel="noreferrer" className="block text-gray-500 hover:text-gray-900">이용약관</a>
            <a href="/privacy" target="_blank" rel="noreferrer" className="block font-semibold text-gray-700 hover:text-gray-900">개인정보처리방침</a>
            <a href="/location" target="_blank" rel="noreferrer" className="block text-gray-500 hover:text-gray-900">위치기반서비스 약관</a>
          </div>
        </div>
      </PcContainer>
    </footer>
  );
};

/** 앱 화면을 PC 가운데 카드로 보여주는 영역 (수다방·마이·e쿠폰 등) */
const PcAppPanel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-[#F5F5F7] py-10">
    <div className="w-full max-w-[640px] mx-auto bg-white rounded-2xl border border-gray-200 overflow-hidden min-h-[640px] flex flex-col [&>*]:shrink-0">
      {children}
    </div>
  </div>
);

export const PcApp: React.FC = () => {
  const { activeTab } = useApp();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [activeTab]);

  // 상품 상세는 PcProductDetail 이 상품별 제목을 정합니다.
  useEffect(() => {
    if (activeTab !== 'detail') document.title = '신상픽 - 편의점·카페 신제품 발견 & 솔직 리뷰';
  }, [activeTab]);

  // PC 버전은 로그인 없이 둘러보고, 리뷰 쓰기·찜 등 필요한 순간에만 로그인 창을 띄웁니다.
  const V = Views;
  const pcPage =
    activeTab === 'home' ? <PcHome /> :
    activeTab === 'category' ? <PcProductList /> :
    activeTab === 'detail' ? <PcProductDetail /> :
    activeTab === 'ranking' ? <PcRanking /> :
    activeTab === 'search' ? <PcSearch /> :
    activeTab === 'brand' ? <PcBrand /> :
    activeTab === 'market' ? <PcMarket /> :
    activeTab === 'stores' ? <PcStores /> :
    activeTab === 'donki' ? <PcDonki /> :
    activeTab === 'releases' ? <PcHome /> : // 출시 캘린더는 삭제됨: 예전 주소는 홈으로
    null;

  return (
    <div className="h-screen w-full flex flex-col bg-white text-gray-900 antialiased">
      <AuthCallbackBridge />
      <NetworkStatusBar />
      <ToastContainer />
      <PushBanner />
      <PcHeader />

      <main ref={mainRef} className="flex-1 min-h-0 overflow-y-auto flex flex-col">
        <Suspense fallback={<Spinner />}>
          <div className="flex-1">
            {pcPage ?? (
              <PcAppPanel>
                {activeTab === 'write' && <V.WriteReviewModal />}
                {activeTab === 'community' && <V.CommunityView />}
                {activeTab === 'my' && <V.MyPageView />}
                {activeTab === 'event_detail' && <V.EventDetailModal />}
                {activeTab === 'compare' && <V.CompareModal />}
                {activeTab === 'alert_settings' && <V.NotificationModal />}
                {activeTab === 'settings' && <V.SettingsView />}
                {activeTab === 'coupon' && <V.CouponShopView />}
                {(activeTab === 'calendar' || (activeTab as string) === 'sale') && <V.SaleNewsView />}
              </PcAppPanel>
            )}
          </div>
          <PcFooter />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <RecipeDetailModal />
        <WriteRecipeModal />
        <LoginModal />
        <NicknameSetupModal />
      </Suspense>
    </div>
  );
};
