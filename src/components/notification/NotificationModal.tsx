import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, Check } from 'lucide-react';

export const NotificationModal: React.FC = () => {
  const { alertCategories, toggleAlertCategory, goBack } = useApp();

  const categories = [
    { id: '전체', label: '전체', icon: '🎯' },
    { id: '신제품', label: '신제품', icon: '⚡' },
    { id: '과자', label: '과자', icon: '🍿' },
    { id: '음료', label: '음료', icon: '🥤' },
    { id: '빵·디저트', label: '빵·디저트', icon: '🥐' },
    { id: '간편식', label: '간편식', icon: '🍲' },
    { id: '과일', label: '과일', icon: '🍑' },
    { id: '식재료', label: '식재료', icon: '🥚' },
    { id: '고기·수산', label: '고기·수산', icon: '🥩' },
    { id: '기타', label: '기타', icon: '🍺' },
  ];

  return (
    <div className="bg-white min-h-full pb-12">
      
      {/* 1. Exact Screen 8 Top Bar */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between z-30 shadow-2xs">
        <button
          onClick={goBack}
          className="p-1 -ml-1 text-gray-800 hover:text-gray-900"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <h1 className="text-base font-black text-gray-900">출시알림 설정</h1>

        <button
          onClick={goBack}
          className="text-xs font-black text-[#0066FF] hover:opacity-80 px-2 py-1"
        >
          완료
        </button>
      </div>

      {/* 2. Subtitle matching Screen 8 */}
      <div className="px-5 pt-6 pb-2 text-center">
        <p className="text-xs text-gray-700 font-bold">
          알림을 받고 싶은 카테고리를 선택하세요
        </p>
      </div>

      {/* 3. 3x3 Grid matching Screen 8 */}
      <div className="p-5 grid grid-cols-3 gap-3">
        {categories.map((cat) => {
          const isSelected = alertCategories.includes(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => toggleAlertCategory(cat.id)}
              className={`relative aspect-square p-3 rounded-2xl border flex flex-col items-center justify-center transition-all focus:outline-none ${
                isSelected
                  ? 'border-[#0066FF] bg-blue-50/30 shadow-xs'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <span className="text-3xl mb-1">{cat.icon}</span>
              <span className="text-xs font-bold text-gray-900">{cat.label}</span>

              {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#0066FF] text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
};
