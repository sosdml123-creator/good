import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';
import './index.css';

import { ErrorBoundary } from './components/common/ErrorBoundary';
import { initWebHorizontalScroll } from './utils/webScrollHelper';

// Enable mouse wheel to horizontal scroll across all desktop web horizontal scroll containers
initWebHorizontalScroll();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <App />
      </AppProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
