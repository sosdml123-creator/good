import React, { useState, useEffect } from 'react';
import { UserX, X, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BlockedUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlockedUsersModal: React.FC<BlockedUsersModalProps> = ({
  isOpen,
  onClose
}) => {
  const { showToast } = useApp();
  const [blockedList, setBlockedList] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      try {
        const list = JSON.parse(localStorage.getItem('sinsangpick_blocked_users') || '[]');
        setBlockedList(list);
      } catch {
        setBlockedList([]);
      }
    }
  }, [isOpen]);

  const handleUnblock = (userName: string) => {
    const updated = blockedList.filter(u => u !== userName);
    setBlockedList(updated);
    try {
      localStorage.setItem('sinsangpick_blocked_users', JSON.stringify(updated));
    } catch {
      // ignore
    }
    showToast(`'${userName}' 님의 차단이 해제되었습니다.`, 'info');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 text-gray-900">
            <UserX className="w-5 h-5 text-gray-700" />
            <h3 className="font-bold text-sm">차단한 사용자 관리</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto divide-y divide-gray-100">
          {blockedList.length > 0 ? (
            blockedList.map((user) => (
              <div key={user} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                    {user[0] || 'U'}
                  </div>
                  <span className="text-xs font-bold text-gray-800 truncate">{user}</span>
                </div>
                <button
                  onClick={() => handleUnblock(user)}
                  className="px-2.5 py-1 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-600 hover:bg-gray-50 flex items-center gap-1 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>차단 해제</span>
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-gray-400 space-y-1">
              <div className="text-2xl">🛡️</div>
              <p>현재 차단된 사용자가 없습니다.</p>
              <p className="text-[11px] text-gray-300">부적절한 글이나 리뷰 발견 시 언제든 차단할 수 있습니다.</p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  );
};
