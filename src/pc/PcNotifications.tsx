import React from 'react';
import { Bell, ChevronRight, Smartphone, Sparkles, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppNotification } from '../types';
import { formatRelativeTime, isNotificationVisible } from '../services/notificationService';
import { PcContainer } from './PcUi';

/**
 * PC 알림함 (모바일 알림 센터와 별도).
 * 출시알림 카테고리·푸시 설정은 기기(푸시 토큰)별로 저장되므로 PC에서는 앱 안내만 보여줍니다.
 */
export const PcNotifications: React.FC = () => {
  const { notifications, markNotificationAsRead, clearAllNotifications, openEventDetail, openProductDetail } = useApp();

  const visible = notifications.filter(isNotificationVisible);
  const unread = visible.filter(n => !n.isRead).length;

  const handleClick = (n: AppNotification) => {
    markNotificationAsRead(n.id);
    if (n.type === 'event' && n.targetId) openEventDetail(n.targetId);
    else if (n.type === 'product' && n.targetId) openProductDetail(n.targetId);
  };

  return (
    <div className="bg-white">
      <PcContainer className="py-12">
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">알림</h1>

        <div className="mt-8 grid grid-cols-[1fr_300px] gap-10 items-start">
          <div className="min-w-0">
            <div className="pb-4 border-b border-gray-900 flex items-center justify-between text-[14px]">
              <span className="text-gray-500">
                받은 알림 <strong className="text-gray-900">{visible.length}</strong>
                {unread > 0 && <span className="ml-2 text-rose-500">안 읽음 {unread}</span>}
              </span>
              {visible.length > 0 && (
                <button onClick={clearAllNotifications} className="flex items-center gap-1 text-gray-400 hover:text-rose-500 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                  전체 삭제
                </button>
              )}
            </div>
            {visible.length === 0 ? (
              <div className="py-28 text-center">
                <Bell className="w-10 h-10 text-gray-300 mx-auto" />
                <p className="mt-4 text-[15px] text-gray-500">새로운 알림이 없습니다.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {visible.map(n => (
                  <li key={n.id}>
                    <button
                      onClick={() => handleClick(n)}
                      className={`w-full px-4 py-5 flex items-center gap-5 text-left hover:bg-gray-50 cursor-pointer ${!n.isRead ? 'bg-violet-50/40' : ''}`}
                    >
                      {n.imageUrl ? (
                        <img src={n.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0" />
                      ) : (
                        <span className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                          <Sparkles className="w-6 h-6 text-gray-500" />
                        </span>
                      )}
                      <span className="flex-1 min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="text-[12px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{n.badge || '알림'}</span>
                          {!n.isRead && <span className="w-2 h-2 rounded-full bg-rose-500" />}
                        </span>
                        <span className="mt-1.5 block text-[16px] font-semibold text-gray-900 line-clamp-1">{n.title}</span>
                        <span className="mt-0.5 block text-[14px] text-gray-500 line-clamp-2">{n.body}</span>
                      </span>
                      <span className="text-[13px] text-gray-400 shrink-0">{formatRelativeTime(n.createdAt || n.timestamp, n.id)}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="rounded-2xl bg-gray-50 p-6">
            <Smartphone className="w-7 h-7 text-gray-600" />
            <p className="mt-3 text-[16px] font-bold text-gray-900">출시 알림은 앱에서 받아요</p>
            <p className="mt-2 text-[14px] text-gray-600 leading-relaxed">
              관심 카테고리 출시 알림, 푸시·야간 혜택 알림은 신상픽 앱의 알림 설정에서 켜고 끌 수 있어요.
            </p>
          </aside>
        </div>
      </PcContainer>
    </div>
  );
};
