import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bell, ChevronRight } from 'lucide-react';

export const PushBanner: React.FC = () => {
  const { 
    incomingPush, 
    dismissIncomingPush, 
    openEventDetail, 
    openProductDetail, 
    markNotificationAsRead 
  } = useApp();

  useEffect(() => {
    if (!incomingPush) return;
    // Auto dismiss after 6 seconds
    const timer = setTimeout(() => {
      dismissIncomingPush();
    }, 6000);

    return () => clearTimeout(timer);
  }, [incomingPush, dismissIncomingPush]);

  if (!incomingPush) return null;

  const handleClick = () => {
    markNotificationAsRead(incomingPush.id);
    dismissIncomingPush();

    if (incomingPush.type === 'event' && incomingPush.targetId) {
      openEventDetail(incomingPush.targetId);
    } else if (incomingPush.type === 'product' && incomingPush.targetId) {
      openProductDetail(incomingPush.targetId);
    }
  };

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] z-50 animate-in slide-in-from-top-4 fade-in duration-300">
      <div 
        onClick={handleClick}
        className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100/80 p-3.5 flex items-start gap-3 cursor-pointer hover:bg-white transition-all active:scale-[0.98] ring-1 ring-black/5"
      >
        {/* App / Notification Icon or Thumbnail */}
        {incomingPush.imageUrl ? (
          <img 
            src={incomingPush.imageUrl} 
            alt="알림" 
            className="w-11 h-11 rounded-xl object-cover border border-gray-100 shrink-0 bg-gray-50"
          />
        ) : (
          <div className="w-11 h-11 rounded-xl bg-[#0066FF] text-white flex items-center justify-center shrink-0 shadow-md">
            <Bell className="w-5 h-5" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[10px] font-black tracking-wide text-[#0066FF] bg-blue-50 px-1.5 py-0.5 rounded">
                신상픽 {incomingPush.badge || '알림'}
              </span>
              <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                {incomingPush.timestamp}
              </span>
            </div>
          </div>

          <h4 className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-1">
            {incomingPush.title}
          </h4>
          <p className="text-[11px] text-gray-600 line-clamp-2 mt-0.5 leading-relaxed">
            {incomingPush.body}
          </p>
          
          <div className="flex items-center gap-0.5 text-[10px] font-bold text-[#0066FF] mt-1.5">
            <span>눌러서 자세히 보기</span>
            <ChevronRight className="w-3 h-3 stroke-[2.5]" />
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            dismissIncomingPush();
          }}
          className="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors -mr-1 -mt-1"
          aria-label="닫기"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
