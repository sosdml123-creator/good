import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NetworkStatusBar: React.FC = () => {
  const { networkError, isDataLoading, retrySync, showToast } = useApp();
  const [isOnline, setIsOnline] = useState<boolean>(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [wasOffline, setWasOffline] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        showToast('🟢 네트워크가 다시 연결되었습니다. 최신 데이터를 동기화합니다.', 'success');
        retrySync?.();
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      showToast('⚠️ 인터넷 연결이 끊어졌습니다. 오프라인 캐시 모드로 작동합니다.', 'info');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline, retrySync, showToast]);

  const handleRetry = async () => {
    if (isRetrying) return;
    setIsRetrying(true);

    try {
      // Check online via ping/navigator
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        showToast('⚠️ 기기가 여전히 오프라인 상태입니다. Wi-Fi 또는 데이터를 확인해 주세요.', 'error');
        return;
      }

      await retrySync?.();
      showToast('✨ 최신 데이터를 성공적으로 불러왔습니다!', 'success');
    } catch (e: any) {
      showToast(e?.message || '다시 연결하는 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsRetrying(false);
    }
  };

  // If fully online and no server network error, don't show bar
  if (isOnline && !networkError) {
    return null;
  }

  return (
    <div className="w-full z-40 bg-amber-500 text-white px-3.5 py-1.5 shadow-md flex items-center justify-between text-xs font-medium animate-in slide-in-from-top duration-200">
      <div className="flex items-center gap-2 min-w-0 pr-2">
        {!isOnline ? (
          <WifiOff className="w-4 h-4 shrink-0 text-amber-100 animate-pulse" />
        ) : (
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-100" />
        )}
        <span className="truncate text-[11px] sm:text-xs">
          {!isOnline
            ? '오프라인 상태입니다. 저장된 캐시 데이터로 표시 중입니다.'
            : (networkError || '서버 통신이 원활하지 않습니다.')}
        </span>
      </div>

      <button
        onClick={handleRetry}
        disabled={isRetrying || isDataLoading}
        className="shrink-0 bg-white/20 hover:bg-white/30 active:scale-95 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
      >
        <RefreshCw className={`w-3 h-3 ${isRetrying || isDataLoading ? 'animate-spin' : ''}`} />
        <span>{isRetrying || isDataLoading ? '연결중' : '다시 시도'}</span>
      </button>
    </div>
  );
};
