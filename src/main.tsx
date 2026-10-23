import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';
import './index.css';
const BeautyApp = React.lazy(() => import('./beauty/BeautyApp'));

import { ErrorBoundary } from './components/common/ErrorBoundary';
import { initWebHorizontalScroll } from './utils/webScrollHelper';

// Enable mouse wheel to horizontal scroll across all desktop web horizontal scroll containers
initWebHorizontalScroll();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      {window.location.pathname.replace(/\/$/, '') === '/beauty' ? <React.Suspense fallback={<div style={{ padding: 40 }}>뷰티 인사이트를 불러오는 중입니다.</div>}><BeautyApp /></React.Suspense> : <AppProvider>
        <App />
      </AppProvider>}
    </ErrorBoundary>
  </React.StrictMode>
);
