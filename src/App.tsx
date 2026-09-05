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
import { ToastContainer } from './components/common/Toast';

export const App: React.FC = () => {
  const { activeTab } = useApp();

  // PC Admin Dashboard Layout (Full Desktop View without mobile BottomNav)
  if (activeTab === 'admin') {
    return (
      <div className="h-screen w-full bg-slate-900 text-slate-100 flex flex-col overflow-hidden antialiased">
        <ToastContainer />
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-[#F8F9FA] overflow-hidden">
      <ToastContainer />

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
        {activeTab === 'write' && <WriteReviewModal />}
        {activeTab === 'community' && <CommunityView />}
        {activeTab === 'my' && <MyPageView />}
        {activeTab === 'detail' && <ProductDetailModal />}
        {activeTab === 'compare' && <CompareModal />}
        {activeTab === 'alert_settings' && <NotificationModal />}
        {activeTab === 'search' && <SearchModal />}
      </main>

      {/* Fixed Bottom Navigation (Always pinned to bottom for mobile app screens) */}
      <BottomNav />
    </div>
  );
};

export default App;
