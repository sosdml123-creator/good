import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Bell, PenLine, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';
import { NetworkStatusBar } from '../components/common/NetworkStatusBar';
import { ToastContainer } from '../components/common/Toast';
import { PushBanner } from '../components/common/PushBanner';
import { AuthCallbackBridge } from '../components/auth/AuthCallbackBridge';
import { PcHome } from './PcHome';
import { PcProductList } from './PcProductList';

const Views = {
  BrandView: lazy(() => import('../components/brand/BrandView').then(m => ({ default: m.BrandView }))),
  CommunityView: lazy(() => import('../components/community/CommunityView').then(m => ({ default: m.CommunityView }))),
  MyPageView: lazy(() => import('../components/my/MyPageView').then(m => ({ default: m.MyPageView }))),
  WriteReviewModal: lazy(() => import('../components/review/WriteReviewModal').then(m => ({ default: m.WriteReviewModal }))),
  CompareModal: lazy(() => import('../components/compare/CompareModal').then(m => ({ default: m.CompareModal }))),
  NotificationModal: lazy(() => import('../components/notification/NotificationModal').then(m => ({ default: m.NotificationModal }))),
  ProductDetailModal: lazy(() => import('../components/detail/ProductDetailModal').then(m => ({ default: m.ProductDetailModal }))),
  SearchModal: lazy(() => import('../components/search/SearchModal').then(m => ({ default: m.SearchModal }))),
  EventDetailModal: lazy(() => import('../components/event/EventDetailModal').then(m => ({ default: m.EventDetailModal }))),
  SettingsView: lazy(() => import('../components/settings/SettingsView').then(m => ({ default: m.SettingsView }))),
  SaleNewsView: lazy(() => import('../components/sale/SaleNewsView').then(m => ({ default: m.SaleNewsView }))),
  RankingView: lazy(() => import('../components/ranking/RankingView').then(m => ({ default: m.RankingView }))),
  CouponShopView: lazy(() => import('../components/coupon/CouponShopView').then(m => ({ default: m.CouponShopView }))),
};
const RecipeDetailModal = lazy(() => import('../components/recipe/RecipeDetailModal').then(m => ({ default: m.RecipeDetailModal })));
const WriteRecipeModal = lazy(() => import('../components/recipe/WriteRecipeModal').then(m => ({ default: m.WriteRecipeModal })));
const LoginModal = lazy(() => import('../components/common/LoginModal').then(m => ({ default: m.LoginModal })));
const NicknameSetupModal = lazy(() => import('../components/auth/NicknameSetupModal').then(m => ({ default: m.NicknameSetupModal })));

const Spinner = () => (
  <div className="py-32 flex items-center justify-center">
    <div className="w-7 h-7 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
  </div>
);

type NavItem = { label: string; tab: ActiveTab; match: ActiveTab[] };

const NAV_ITEMS: NavItem[] = [
  { label: '홈', tab: 'home', match: ['home'] },
  { label: '신제품', tab: 'category', match: ['category'] },
  { label: '랭킹', tab: 'ranking', match: ['ranking'] },
  { label: '브랜드', tab: 'brand', match: ['brand'] },
  { label: '세일·행사', tab: 'calendar', match: ['calendar'] },
  { label: '수다방', tab: 'community', match: ['community'] },
  { label: 'e쿠폰', tab: 'coupon', match: ['coupon'] },
];

const PcHeader: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setSelectedCategory,
    setSelectedBrand,
    setSearchQuery,
    addRecentSearch,
    currentUser,
    openLoginModal,
    unreadNotificationCount,
    openNotificationCenter,
  } = useApp();
  const [query, setQuery] = useState('');

  const handleNav = (item: NavItem) => {
    if (item.tab === 'category') setSelectedCategory('신제품');
    if (item.tab === 'brand') setSelectedBrand(null);
    setActiveTab(item.tab);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    addRecentSearch(q);
    setSearchQuery(q);
    setQuery('');
    // 같은 검색 화면에서 다시 검색해도 새 검색어로 시작하도록 화면을 다시 엽니다.
    if (activeTab === 'search') setActiveTab('home');
    setTimeout(() => setActiveTab('search'), 0);
  };

  const isLoggedIn = !currentUser.isAnonymous;

  return (
    <header className="shrink-0 bg-white border-b border-gray-200 z-40">
      <div className="max-w-[1200px] mx-auto px-8 h-[72px] flex items-center gap-8">
        <button onClick={() => setActiveTab('home')} className="flex items-center gap-2.5 shrink-0 cursor-pointer">
          <img src="/app-icon.png" alt="" className="w-9 h-9 rounded-xl" />
          <span className="text-[20px] font-black text-gray-900 tracking-tight">신상픽</span>
        </button>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(item => {
            const active = item.match.includes(activeTab);
            return (
              <button
                key={item.label}
                onClick={() => handleNav(item)}
                className={`px-3.5 h-10 rounded-xl text-[15px] cursor-pointer ${
                  active ? 'font-bold text-gray-900 bg-gray-100' : 'font-medium text-gray-500 hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <form onSubmit={submitSearch} className="flex-1 min-w-[180px] max-w-[300px] ml-auto relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="신상품, 브랜드 검색"
            className="w-full h-10 pl-10 pr-4 rounded-full bg-gray-100 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:ring-2 focus:ring-gray-900"
          />
        </form>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('write')}
            className="h-10 px-4 rounded-full bg-gray-900 text-white text-[13px] font-bold flex items-center gap-1.5 hover:bg-black cursor-pointer"
          >
            <PenLine className="w-4 h-4" />
            리뷰 쓰기
          </button>
          <button
            onClick={() => openNotificationCenter('inbox')}
            aria-label="알림"
            className="relative w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer"
          >
            <Bell className="w-5 h-5 text-gray-700" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
              </span>
            )}
          </button>
          {isLoggedIn ? (
            <button
              onClick={() => setActiveTab('my')}
              className={`h-10 pl-1 pr-3 rounded-full flex items-center gap-2 cursor-pointer ${activeTab === 'my' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
            >
              <img src={currentUser.photoURL} alt="" className="w-8 h-8 rounded-full object-cover bg-gray-100" />
              <span className="text-[13px] font-semibold text-gray-800 max-w-[96px] truncate">{currentUser.displayName}</span>
            </button>
          ) : (
            <button onClick={openLoginModal} className="h-10 px-4 rounded-full border border-gray-300 text-[13px] font-bold text-gray-800 hover:border-gray-900 cursor-pointer">
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

const PcFooter: React.FC = () => (
  <footer className="mt-auto border-t border-gray-200 bg-white">
    <div className="max-w-[1200px] mx-auto px-8 py-10 flex items-start justify-between gap-10 text-[12px] text-gray-500">
      <div className="space-y-2">
        <p className="text-[15px] font-black text-gray-900">신상픽</p>
        <p>새로 나온 먹거리를 가장 먼저 발견하고, 먹어본 사람들의 솔직한 평가를 확인하세요.</p>
        <p className="text-gray-400">© 신상픽. All rights reserved.</p>
      </div>
      <div className="flex gap-5 shrink-0">
        <a href="/terms" target="_blank" rel="noreferrer" className="hover:text-gray-900">이용약관</a>
        <a href="/privacy" target="_blank" rel="noreferrer" className="font-bold text-gray-700 hover:text-gray-900">개인정보처리방침</a>
        <a href="/location" target="_blank" rel="noreferrer" className="hover:text-gray-900">위치기반서비스 약관</a>
      </div>
    </div>
  </footer>
);

/** 앱 화면을 PC 가운데 칸에 그대로 보여주는 영역 (상세·마이·수다방 등) */
const PcContentColumn: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full max-w-[720px] mx-auto bg-white min-h-full border-x border-gray-100 flex flex-col [&>*]:shrink-0">
    {children}
  </div>
);

export const PcApp: React.FC = () => {
  const { activeTab } = useApp();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [activeTab]);

  useEffect(() => {
    document.title = '신상픽 PC - 식음료 신제품 발견 & 솔직 리뷰';
  }, []);

  // PC 버전은 로그인 없이 둘러보고, 리뷰 쓰기·찜 등 필요한 순간에만 로그인 창을 띄웁니다.

  const V = Views;
  const isWidePage = activeTab === 'home' || activeTab === 'category';

  return (
    <div className="h-screen w-full flex flex-col bg-[#F4F5F7] text-gray-900 antialiased">
      <AuthCallbackBridge />
      <NetworkStatusBar />
      <ToastContainer />
      <PushBanner />
      <PcHeader />

      <main ref={mainRef} className="flex-1 min-h-0 overflow-y-auto flex flex-col">
        <Suspense fallback={<Spinner />}>
          {isWidePage ? (
            <>
              {activeTab === 'home' && <PcHome />}
              {activeTab === 'category' && <PcProductList />}
              <PcFooter />
            </>
          ) : (
            <PcContentColumn>
              {activeTab === 'brand' && <V.BrandView />}
              {activeTab === 'write' && <V.WriteReviewModal />}
              {activeTab === 'community' && <V.CommunityView />}
              {activeTab === 'my' && <V.MyPageView />}
              {activeTab === 'detail' && <V.ProductDetailModal />}
              {activeTab === 'event_detail' && <V.EventDetailModal />}
              {activeTab === 'compare' && <V.CompareModal />}
              {activeTab === 'alert_settings' && <V.NotificationModal />}
              {activeTab === 'settings' && <V.SettingsView />}
              {activeTab === 'search' && <V.SearchModal />}
              {activeTab === 'ranking' && <V.RankingView />}
              {activeTab === 'coupon' && <V.CouponShopView />}
              {(activeTab === 'calendar' || (activeTab as string) === 'sale') && <V.SaleNewsView />}
            </PcContentColumn>
          )}
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
