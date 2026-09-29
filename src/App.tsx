import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { useApp } from './context/AppContext';
import { NetworkStatusBar } from './components/common/NetworkStatusBar';
import { ToastContainer } from './components/common/Toast';

// Always-present small components (no lazy loading needed)
import { BottomNav } from './components/common/BottomNav';
import { PushBanner } from './components/common/PushBanner';
import { AuthCallbackBridge } from './components/auth/AuthCallbackBridge';

// Lazy-loaded view components (code split per route)
const Header = lazy(() => import('./components/common/Header').then(m => ({ default: m.Header })));
const HomeView = lazy(() => import('./components/home/HomeView').then(m => ({ default: m.HomeView })));
const DiscoverView = lazy(() => import('./components/discover/DiscoverView').then(m => ({ default: m.DiscoverView })));
const CommunityView = lazy(() => import('./components/community/CommunityView').then(m => ({ default: m.CommunityView })));
const MyPageView = lazy(() => import('./components/my/MyPageView').then(m => ({ default: m.MyPageView })));
const WriteReviewModal = lazy(() => import('./components/review/WriteReviewModal').then(m => ({ default: m.WriteReviewModal })));
const CompareModal = lazy(() => import('./components/compare/CompareModal').then(m => ({ default: m.CompareModal })));
const NotificationModal = lazy(() => import('./components/notification/NotificationModal').then(m => ({ default: m.NotificationModal })));
const ProductDetailModal = lazy(() => import('./components/detail/ProductDetailModal').then(m => ({ default: m.ProductDetailModal })));
const SearchModal = lazy(() => import('./components/search/SearchModal').then(m => ({ default: m.SearchModal })));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminLoginView = lazy(() => import('./components/admin/AdminLoginView').then(m => ({ default: m.AdminLoginView })));
const EventDetailModal = lazy(() => import('./components/event/EventDetailModal').then(m => ({ default: m.EventDetailModal })));
const BrandView = lazy(() => import('./components/brand/BrandView').then(m => ({ default: m.BrandView })));
const SettingsView = lazy(() => import('./components/settings/SettingsView').then(m => ({ default: m.SettingsView })));
const WebPolicyPage = lazy(() => import('./components/settings/WebPolicyPage').then(m => ({ default: m.WebPolicyPage })));
const SaleNewsView = lazy(() => import('./components/sale/SaleNewsView').then(m => ({ default: m.SaleNewsView })));
const RecipeDetailModal = lazy(() => import('./components/recipe/RecipeDetailModal').then(m => ({ default: m.RecipeDetailModal })));
const WriteRecipeModal = lazy(() => import('./components/recipe/WriteRecipeModal').then(m => ({ default: m.WriteRecipeModal })));
const RankingView = lazy(() => import('./components/ranking/RankingView').then(m => ({ default: m.RankingView })));
const LoginModal = lazy(() => import('./components/common/LoginModal').then(m => ({ default: m.LoginModal })));
const AuthOnboardingView = lazy(() => import('./components/auth/AuthOnboardingView').then(m => ({ default: m.AuthOnboardingView })));
const NicknameSetupModal = lazy(() => import('./components/auth/NicknameSetupModal').then(m => ({ default: m.NicknameSetupModal })));
const AppPermissionModal = lazy(() => import('./components/common/AppPermissionModal').then(m => ({ default: m.AppPermissionModal })));

import { checkIsAdminAuthenticated } from './components/admin/AdminLoginView';
import { initAdMob } from './services/admobService';

// Minimal fallback spinner shown during lazy load
const TabFallback = () => (
  <div className="flex-1 flex items-center justify-center bg-[#F8F9FA]">
    <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
  </div>
);

export const App: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, isGuestBrowse } = useApp();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => checkIsAdminAuthenticated());
  const mainRef = useRef<HTMLElement>(null);

  // App Mount: Initialize AdMob in background
  useEffect(() => {
    initAdMob().catch((err) => {
      console.warn('[App] AdMob initialization notice:', err);
    });
  }, []);

  // 탭 변경 시 main 스크롤 컨테이너를 맨 위로 리셋하여 빈 화면 노출 방지
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [activeTab]);

  // Check URL parameters or pathname for public web policy viewer (Store Review Requirement)
  const urlParams = new URLSearchParams(window.location.search);
  const policyParam = urlParams.get('policy') || urlParams.get('page');
  const path = window.location.pathname.replace('/', '').toLowerCase();

  if (policyParam) {
    return (
      <>
        <AuthCallbackBridge />
        <Suspense fallback={<TabFallback />}>
          <WebPolicyPage initialPolicyId={policyParam} />
        </Suspense>
      </>
    );
  }

  if (path === 'privacy' || path === 'terms' || path === 'location' || path === 'delete-account') {
    return (
      <>
        <AuthCallbackBridge />
        <Suspense fallback={<TabFallback />}>
          <WebPolicyPage initialPolicyId={path} />
        </Suspense>
      </>
    );
  }

  // PC Admin Dashboard Layout (Protected by Admin Auth Guard)
  if (activeTab === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <div className="h-screen w-full bg-slate-950 flex flex-col justify-center items-center overflow-hidden antialiased">
          <AuthCallbackBridge />
          <NetworkStatusBar />
          <ToastContainer />
          <Suspense fallback={<TabFallback />}>
            <AdminLoginView
              onSuccess={() => setIsAdminAuthenticated(true)}
              onCancel={() => setActiveTab('home')}
            />
          </Suspense>
        </div>
      );
    }

    return (
      <div className="h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col overflow-hidden antialiased">
        <AuthCallbackBridge />
        <NetworkStatusBar />
        <ToastContainer />
        <PushBanner />
        <Suspense fallback={<TabFallback />}>
          <AdminDashboard onLogout={() => setIsAdminAuthenticated(false)} />
        </Suspense>
      </div>
    );
  }

  // First-time Launch / Unauthenticated Onboarding Auth View
  if (currentUser.isAnonymous && !isGuestBrowse) {
    return (
      <>
        <AuthCallbackBridge />
        <NetworkStatusBar />
        <ToastContainer />
        <Suspense fallback={<TabFallback />}>
          <AuthOnboardingView />
        </Suspense>
      </>
    );
  }

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#F2F4F7]">
      <AuthCallbackBridge />
      <div className="w-full max-w-[430px] h-[100dvh] bg-white flex flex-col relative overflow-hidden shadow-sm">

        <NetworkStatusBar />
        <ToastContainer />
        {/* Floating Top In-App Push Notification Banner */}
        <PushBanner />

        {/* Scrollable Main Content Area */}
        <main ref={mainRef} className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col bg-[#F8F9FA]">
          {/* Dynamic Route/Tab Display - each tab is independently lazy loaded */}
          <Suspense fallback={<TabFallback />}>
            {activeTab === 'home' && (
              <>
                <Header />
                <HomeView />
              </>
            )}
            {activeTab === 'category' && <DiscoverView />}
            {activeTab === 'brand' && <BrandView />}
            {activeTab === 'write' && <WriteReviewModal />}
            {activeTab === 'community' && <CommunityView />}
            {activeTab === 'my' && <MyPageView />}
            {activeTab === 'detail' && <ProductDetailModal />}
            {activeTab === 'event_detail' && <EventDetailModal />}
            {activeTab === 'compare' && <CompareModal />}
            {activeTab === 'alert_settings' && <NotificationModal />}
            {activeTab === 'settings' && <SettingsView />}
            {activeTab === 'search' && <SearchModal />}
            {activeTab === 'ranking' && <RankingView />}
            {(activeTab === 'calendar' || (activeTab as string) === 'sale') && <SaleNewsView />}
          </Suspense>
        </main>

        {/* Modals (Floating Global Modals) - lazy loaded, rendered on demand */}
        <Suspense fallback={null}>
          <RecipeDetailModal />
          <WriteRecipeModal />
          <LoginModal />
          <AppPermissionModal />
          <NicknameSetupModal />
        </Suspense>

        {/* Fixed Bottom Navigation (Always pinned to bottom for mobile app screens) */}
        <BottomNav />
      </div>
    </div>
  );
};

export default App;
