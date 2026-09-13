import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Compass, Trophy, MessageSquare, User } from 'lucide-react';
import { ActiveTab } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'home' as ActiveTab, label: '홈', icon: <Home className="w-5 h-5 stroke-[2]" /> },
    { id: 'category' as ActiveTab, label: '신제품', icon: <Compass className="w-5 h-5 stroke-[2]" /> },
    { id: 'ranking' as ActiveTab, label: '랭킹', icon: <Trophy className="w-5 h-5 stroke-[2]" /> },
    { id: 'community' as ActiveTab, label: '수다방', icon: <MessageSquare className="w-5 h-5 stroke-[2]" /> },
    { id: 'my' as ActiveTab, label: '마이', icon: <User className="w-5 h-5 stroke-[2]" /> },
  ];

  return (
    <nav className="w-full shrink-0 z-40 bg-white border-t border-gray-200 select-none pb-1">
      <div className="w-full px-2 py-1 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center py-1 transition-colors focus:outline-none ${
                isActive ? 'text-gray-900 font-bold' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="transition-transform active:scale-90">{item.icon}</div>
              <span className="text-[10px] font-semibold mt-0.5">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
