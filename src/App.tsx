import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { HomeView } from './components/home/HomeView';
import { DiscoverView } from './components/discover/DiscoverView';
import { CommunityView } from './components/community/CommunityView';
import { MyPageView } from './components/my/MyPageView';
import { WriteReviewModal } from './components/review/WriteReviewModal';
import { CompareModal } from './components/compare/CompareModal';
import { NotificationModal } from './components/notification/NotificationModal';
import { ProductDetailModal } from './components/detail/ProductDetailModal';
import { SearchModal } from './components/search/SearchModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { EventDetailModal } from './components/event/EventDetailModal';
import { BrandView } from './components/brand/BrandView';
import { SettingsView } from './components/settings/SettingsView';
import { WebPolicyPage } from './components/settings/WebPolicyPage';
import { PushBanner } from './components/common/PushBanner';
import { ToastContainer } from './components/common/Toast';

export const App: React.FC = () => {
  const { activeTab } = useApp();

  // Check URL parameters or pathname for public web policy viewer (Store Review Requirement)
  const urlParams = new URLSearchParams(window.location.search);
  const policyParam = urlParams.get('policy') || urlParams.get('page');
  const path = window.location.pathname.replace('/', '').toLowerCase();

  if (policyParam) {
    return <WebPolicyPage initialPolicyId={policyParam} />;
  }

  if (path === 'privacy' || path === 'terms' || path === 'location' || path === 'delete-account') {
    return <WebPolicyPage initialPolicyId={path} />;
  }

  // PC Admin Dashboard Layout (Full Desktop View without mobile BottomNav)
  if (activeTab === 'admin') {
    return (
      <div className="h-screen w-full bg-slate-900 text-slate-100 flex flex-col overflow-hidden antialiased">
        <ToastContainer />
        <PushBanner />
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#F2F4F7]">
      <div className="w-full max-w-[430px] h-[100dvh] bg-white flex flex-col relative overflow-hidden shadow-sm">
        <ToastContainer />
        {/* Floating Top In-App Push Notification Banner */}
        <PushBanner />

        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col bg-[#F8F9FA]">
          {/* Dynamic Route/Tab Display */}
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
        </main>

        {/* Fixed Bottom Navigation (Always pinned to bottom for mobile app screens) */}
        <BottomNav />
      </div>
    </div>
  );
};

export default App;
