import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, 
  Bell, 
  BellRing, 
  Calendar as CalendarIcon, 
  Sparkles, 
  ChevronRight 
} from 'lucide-react';

type FilterPeriod = 'all' | 'this_week' | 'reserved';

export const CalendarView: React.FC = () => {
  const { 
    calendarItems, 
    calendarReminders, 
    toggleCalendarReminder, 
    openProductDetail,
    goBack, 
    showToast 
  } = useApp();

  const [period, setPeriod] = useState<FilterPeriod>('all');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('전체');

  const brandOptions = ['전체', 'CU', 'GS25', '스타벅스', '맥도날드', '배스킨라빈스', '오리온', '롯데웰푸드'];

  // Filter items
  const filteredItems = calendarItems.filter((item) => {
    // 1. Period Filter
    if (period === 'reserved' && !calendarReminders.includes(item.id)) {
      return false;
    }
    if (period === 'this_week' && !['cal-01', 'cal-02', 'cal-03', 'cal-04'].includes(item.id)) {
      return false;
    }

    // 2. Brand/Store Filter
    if (selectedBrandFilter !== '전체') {
      const matchBrand = item.brand.includes(selectedBrandFilter);
      const matchStore = item.stores.some(s => s.includes(selectedBrandFilter));
      if (!matchBrand && !matchStore) return false;
    }

    return true;
  });

  return (
    <div className="bg-[#F8F9FA] min-h-full pb-16">
      {/* 1. Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-2xs">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={goBack} 
            className="p-1 -ml-1 text-gray-700 hover:text-gray-900 active:scale-95 transition-transform"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
          
          <div className="flex items-center gap-1.5 font-black text-gray-900 text-base">
            <CalendarIcon className="w-5 h-5 text-[#0066FF]" />
            <span>신상 드롭 캘린더</span>
            <span className="text-[10px] font-extrabold bg-blue-50 text-[#0066FF] px-2 py-0.5 rounded-full border border-blue-100">
              2026 가을
            </span>
          </div>

          <div className="w-6" />
        </div>

        {/* Period Segment Tabs */}
        <div className="flex border-t border-gray-100 bg-white">
          <button
            onClick={() => setPeriod('all')}
            className={`flex-1 py-2.5 text-xs font-bold transition-all relative ${
              period === 'all' ? 'text-[#0066FF]' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            전체 일정 ({calendarItems.length})
            {period === 'all' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0066FF]" />}
          </button>
          <button
            onClick={() => setPeriod('this_week')}
            className={`flex-1 py-2.5 text-xs font-bold transition-all relative ${
              period === 'this_week' ? 'text-[#0066FF]' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            ⚡ 이번 주 출시
            {period === 'this_week' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0066FF]" />}
          </button>
          <button
            onClick={() => setPeriod('reserved')}
            className={`flex-1 py-2.5 text-xs font-bold transition-all relative ${
              period === 'reserved' ? 'text-[#0066FF]' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            🔔 알림 예약 ({calendarReminders.length})
            {period === 'reserved' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0066FF]" />}
          </button>
        </div>

        {/* Brand Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-4 py-2 bg-gray-50/70 border-t border-gray-100">
          {brandOptions.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBrandFilter(b)}
              className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                selectedBrandFilter === b
                  ? 'bg-[#0066FF] text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Top Banner Card */}
      <div className="p-4">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-1.5">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>실시간 신상 입고 타임라인</span>
            </div>
            <h2 className="text-base font-black leading-tight">
              놓치면 품절! 편의점 & 브랜드 신상<br />
              출시일에 맞춰 가장 먼저 알려드려요 🔔
            </h2>
            <p className="text-[11px] text-blue-100 mt-1">
              종 아이콘을 누르면 출시 당일 아침 9시에 알림을 보내드려요.
            </p>
          </div>
          <div className="absolute right-[-15px] bottom-[-20px] text-7xl opacity-20 select-none">
            📅
          </div>
        </div>
      </div>

      {/* 3. Timeline Items List */}
      <div className="px-4 space-y-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isReserved = calendarReminders.includes(item.id);

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-4 border transition-all shadow-2xs hover:shadow-xs ${
                  item.isToday ? 'border-blue-400 ring-2 ring-blue-500/10' : 'border-gray-200/80'
                }`}
              >
                {/* Header: Date + D-Day + Alarm Toggle */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className={`text-[12px] font-black px-2.5 py-0.5 rounded-full shadow-2xs ${
                      item.isToday 
                        ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white animate-pulse'
                        : 'bg-blue-50 text-[#0066FF] border border-blue-200'
                    }`}>
                      {item.dDay}
                    </span>
                    <span className="text-[13px] font-bold text-gray-800">
                      {item.releaseDateFormatted}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleCalendarReminder(item.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                      isReserved
                        ? 'bg-blue-50 text-[#0066FF] border border-blue-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isReserved ? (
                      <>
                        <BellRing className="w-3.5 h-3.5 fill-[#0066FF] text-[#0066FF]" />
                        <span>예약완료</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5 text-gray-500" />
                        <span>알림예약</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Body Content */}
                <div 
                  onClick={() => {
                    if (item.productId) {
                      openProductDetail(item.productId);
                    } else {
                      showToast(`✨ ${item.brand} ${item.name} 출시 예정 정보입니다.`, 'info');
                    }
                  }}
                  className="flex gap-3.5 mt-3 cursor-pointer group"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    {item.eventBadge && (
                      <span className="absolute bottom-1 left-1 text-[9px] font-black bg-black/75 text-amber-300 px-1.5 py-0.2 rounded backdrop-blur-xs">
                        {item.eventBadge}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 font-semibold truncate">
                        <span>{item.brand}</span>
                        <span>·</span>
                        <span>{item.category}</span>
                      </div>
                      <h4 className="text-[13px] font-bold text-gray-900 leading-snug group-hover:text-[#0066FF] transition-colors line-clamp-1 mt-0.5">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                        {item.highlight}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-black text-gray-900">
                          {item.price.toLocaleString()}원
                        </span>
                        <div className="flex gap-1">
                          {item.stores.slice(0, 2).map((s) => (
                            <span key={s} className="text-[9px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center text-[10px] text-gray-400 font-medium">
                        <span>{item.notificationCount || 100}명 예약중</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:translate-x-0.5 transition-transform ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center bg-white rounded-2xl border border-gray-100 p-6">
            <div className="text-3xl mb-2">🔔</div>
            <h4 className="text-sm font-bold text-gray-800">
              {period === 'reserved' ? '알림 예약한 신상품이 없습니다' : '해당 조건의 신상 일정이 없습니다'}
            </h4>
            <p className="text-xs text-gray-400 mt-1">
              {period === 'reserved'
                ? '관심 있는 신상품에 [알림예약]을 눌러보세요!'
                : '다른 브랜드나 필터를 선택해보세요.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
