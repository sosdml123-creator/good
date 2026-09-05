import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Compass, Plus, MessageSquare, User } from 'lucide-react';
import { ActiveTab } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'home' as ActiveTab, label: '홈', icon: <Home className="w-5 h-5 stroke-[2]" /> },
    { id: 'category' as ActiveTab, label: '신제품', icon: <Compass className="w-5 h-5 stroke-[2]" /> },
    { id: 'write' as ActiveTab, label: '리뷰쓰기', isAction: true },
    { id: 'community' as ActiveTab, label: '수다방', icon: <MessageSquare className="w-5 h-5 stroke-[2]" /> },
    { id: 'my' as ActiveTab, label: '마이', icon: <User className="w-5 h-5 stroke-[2]" /> },
  ];

  return (
    <nav className="w-full shrink-0 z-40 bg-white border-t border-gray-200 select-none pb-1">
      <div className="w-full px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          if (item.isAction) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab('write')}
                className="flex flex-col items-center -top-2 relative group focus:outline-none"
              >
                <div className="w-12 h-12 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform">
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-semibold text-gray-400 mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          }

          const isActive = 
            activeTab === item.id || 
            (item.id === 'home' && activeTab === 'home') ||
            (item.id === 'category' && activeTab === 'category') ||
            (item.id === 'community' && activeTab === 'community') ||
            (item.id === 'my' && activeTab === 'my');

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-3 transition-colors focus:outline-none ${
                isActive ? 'text-[#0066FF] font-semibold' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div>{item.icon}</div>
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
