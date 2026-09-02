import React from 'react';
import { useApp } from './context/AppContext';
import { DeviceFrame } from './components/common/DeviceFrame';
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
import { ToastContainer } from './components/common/Toast';

export const App: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <DeviceFrame>
      <ToastContainer />

      <main className="flex-1 bg-[#F8F9FA] flex flex-col min-h-screen">
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

      {/* Fixed Bottom Navigation */}
      <BottomNav />
    </DeviceFrame>
  );
};

export default App;
