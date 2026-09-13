import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ReleaseCalendarItem, ProductCategory } from '../../types';
import { CATEGORIES } from '../../data/mockProducts';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X
} from 'lucide-react';

interface CalendarManagementTabProps {
  isDark: boolean;
}

export const CalendarManagementTab: React.FC<CalendarManagementTabProps> = ({ isDark }) => {
  const { 
    calendarItems, 
    addCalendarItem, 
    updateCalendarItem, 
    deleteCalendarItem,
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCalendarId, setEditingCalendarId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<ReleaseCalendarItem, 'id'> & { id?: string }>({
    id: '',
    name: '',
    brand: '',
    category: '과자',
    subCategory: '',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    price: 2500,
    stores: ['CU', 'GS25'],
    releaseDate: '2026.09.20',
    releaseDateFormatted: '9월 20일 (일)',
    dayOfWeek: '일',
    dDay: 'D-7',
    isToday: false,
    isUpcoming: true,
    highlight: '전국 편의점 한정 신규 출시',
    eventBadge: '단독출시'
  });

  const [storesInput, setStoresInput] = useState('CU, GS25');

  // Filtered items
  const filteredItems = useMemo(() => {
    return calendarItems.filter(item => {
      const matchSearch = !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.highlight.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = selectedCategory === '전체' || item.category === selectedCategory;

      return matchSearch && matchCategory;
    }).sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
  }, [calendarItems, searchQuery, selectedCategory]);

  // Open modal for new
  const handleOpenNewModal = () => {
    setEditingCalendarId(null);
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}.${month}.${day}`;

    setFormData({
      id: '',
      name: '',
      brand: '',
      category: '과자',
      subCategory: '',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
      price: 2500,
      stores: ['CU', 'GS25'],
      releaseDate: dateStr,
      releaseDateFormatted: `${Number(month)}월 ${Number(day)}일`,
      dayOfWeek: '오늘',
      dDay: '오늘출시',
      isToday: true,
      isUpcoming: false,
      highlight: '전국 편의점 신규 라인업',
      eventBadge: '신제품'
    });
    setStoresInput('CU, GS25');
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEditModal = (item: ReleaseCalendarItem) => {
    setEditingCalendarId(item.id);
    setFormData({
      id: item.id,
      name: item.name,
      brand: item.brand,
      category: item.category,
      subCategory: item.subCategory || '',
      image: item.image,
      price: item.price,
      stores: item.stores || ['전국 편의점'],
      releaseDate: item.releaseDate,
      releaseDateFormatted: item.releaseDateFormatted,
      dayOfWeek: item.dayOfWeek,
      dDay: item.dDay,
      isToday: item.isToday ?? false,
      isUpcoming: item.isUpcoming ?? true,
      highlight: item.highlight || '',
      eventBadge: item.eventBadge || ''
    });
    setStoresInput((item.stores || []).join(', '));
    setIsModalOpen(true);
  };

  // Auto calculate day of week and formatted date from YYYY.MM.DD
  const handleDateChange = (val: string) => {
    let dayOfWeek = '미정';
    let formatted = val;
    let dDayStr = 'D-Day';
    let isToday = false;

    try {
      const parts = val.split(/[.\-/]/);
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        dayOfWeek = days[d.getDay()];
        formatted = `${Number(parts[1])}월 ${Number(parts[2])}일 (${dayOfWeek})`;

        const now = new Date();
        now.setHours(0, 0, 0, 0);
        d.setHours(0, 0, 0, 0);
        const diffDays = Math.round((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          dDayStr = '오늘출시';
          isToday = true;
        } else if (diffDays > 0) {
          dDayStr = `D-${diffDays}`;
          isToday = false;
        } else {
          dDayStr = `출시완료 (${Math.abs(diffDays)}일 전)`;
          isToday = false;
        }
      }
    } catch {
      // ignore
    }

    setFormData(prev => ({
      ...prev,
      releaseDate: val,
      releaseDateFormatted: formatted,
      dayOfWeek,
      dDay: dDayStr,
      isToday,
      isUpcoming: !isToday
    }));
  };

  // Submit save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('출시 상품명을 입력해주세요.', 'error');
      return;
    }

    const parsedStores = storesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingCalendarId) {
      updateCalendarItem(editingCalendarId, {
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        category: formData.category,
        subCategory: formData.subCategory?.trim(),
        image: formData.image.trim(),
        price: Number(formData.price) || 0,
        stores: parsedStores.length > 0 ? parsedStores : ['전국 편의점'],
        releaseDate: formData.releaseDate.trim(),
        releaseDateFormatted: formData.releaseDateFormatted.trim(),
        dayOfWeek: formData.dayOfWeek.trim(),
        dDay: formData.dDay.trim(),
        isToday: formData.isToday,
        isUpcoming: formData.isUpcoming,
        highlight: formData.highlight.trim(),
        eventBadge: formData.eventBadge?.trim()
      });
    } else {
      addCalendarItem({
        id: formData.id?.trim() || `cal_${Date.now()}`,
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        category: formData.category,
        subCategory: formData.subCategory?.trim(),
        image: formData.image.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',
        price: Number(formData.price) || 0,
        stores: parsedStores.length > 0 ? parsedStores : ['전국 편의점'],
        releaseDate: formData.releaseDate.trim(),
        releaseDateFormatted: formData.releaseDateFormatted.trim(),
        dayOfWeek: formData.dayOfWeek.trim(),
        dDay: formData.dDay.trim() || 'D-Day',
        isToday: formData.isToday,
        isUpcoming: formData.isUpcoming,
        highlight: formData.highlight.trim(),
        eventBadge: formData.eventBadge?.trim()
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteCalendarItem(id);
    setDeleteConfirmId(null);
  };

  const cardBg = isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900';
  const inputBg = isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-purple-600/10 text-purple-600 flex items-center justify-center font-bold">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              신제품 출시 캘린더 정밀 관리
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              날짜별 신제품 릴리즈 일정, D-Day 카운트다운 및 사전 알림 등록 아이템을 관리합니다.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenNewModal}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md shadow-purple-600/20 active:scale-95 transition-all self-start lg:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>새 출시일정 등록</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <div className="text-xs text-slate-500">총 등록된 일정</div>
          <div className="mt-2 text-2xl font-black font-mono">{calendarItems.length}건</div>
        </div>
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <div className="text-xs text-slate-500">⚡ 오늘 출시 상품</div>
          <div className="mt-2 text-2xl font-black font-mono text-purple-600">
            {calendarItems.filter(c => c.isToday).length}건
          </div>
        </div>
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <div className="text-xs text-slate-500">🚀 출시 예정 (D-Day)</div>
          <div className="mt-2 text-2xl font-black font-mono text-indigo-600">
            {calendarItems.filter(c => c.isUpcoming).length}건
          </div>
        </div>
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <div className="text-xs text-slate-500">단독/기획전 뱃지</div>
          <div className="mt-2 text-2xl font-black font-mono text-emerald-600">
            {calendarItems.filter(c => !!c.eventBadge).length}건
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-3 ${cardBg}`}>
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="출시 상품명, 브랜드, 하이라이트 검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs border focus:outline-none focus:border-purple-500 ${inputBg}`}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto">
          {['전체', '신제품', '과자', '음료', '빵·디저트', '간편식', '패스트푸드'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-2xl border overflow-hidden shadow-xs ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b font-bold ${isDark ? 'bg-slate-800/80 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
              <tr>
                <th className="p-3.5 w-14 text-center">이미지</th>
                <th className="p-3.5">출시일자 & D-Day</th>
                <th className="p-3.5">상품명 / 브랜드</th>
                <th className="p-3.5">카테고리</th>
                <th className="p-3.5">출시 판매처</th>
                <th className="p-3.5">가격</th>
                <th className="p-3.5">하이라이트 & 뱃지</th>
                <th className="p-3.5 text-right w-24">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 text-center">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-10 h-10 rounded-lg object-cover mx-auto border border-slate-200 bg-slate-100" 
                    />
                  </td>
                  <td className="p-3">
                    <div className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{item.releaseDateFormatted || item.releaseDate}</span>
                    </div>
                    <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-black mt-0.5 ${
                      item.isToday ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {item.dDay}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.brand}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 font-bold">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {(item.stores || []).map(st => (
                        <span key={st} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                          {st}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 font-mono font-bold">
                    {item.price > 0 ? `${item.price.toLocaleString()}원` : '가격미정'}
                  </td>
                  <td className="p-3 max-w-xs">
                    <div className="truncate text-slate-600 dark:text-slate-300 text-[11px]">
                      {item.highlight || '-'}
                    </div>
                    {item.eventBadge && (
                      <span className="inline-block px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold mt-0.5">
                        {item.eventBadge}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                        title="수정"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================
          MODAL: ADD / EDIT CALENDAR ITEM
         ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border ${cardBg}`}>
            {/* Header */}
            <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-sm">
                  {editingCalendarId ? '출시 일정 수정' : '새 출시일정 등록'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">출시 상품명 *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 배스킨라빈스 두바이 초코볼"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">브랜드 / 제조사 *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: SPC 배스킨라빈스"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
              </div>

              {/* Date Input with Auto-Calculations */}
              <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 space-y-2">
                <label className="block text-xs font-bold text-purple-900 dark:text-purple-300">출시 예정일 (YYYY.MM.DD) *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 2026.09.25"
                  value={formData.releaseDate}
                  onChange={e => handleDateChange(e.target.value)}
                  className={`w-full p-2.5 rounded-xl text-xs font-mono border ${inputBg}`}
                />
                <div className="flex items-center justify-between text-[11px] text-purple-700 dark:text-purple-400 font-medium">
                  <span>표시 문구: <strong>{formData.releaseDateFormatted}</strong></span>
                  <span>상태: <strong>{formData.dDay}</strong></span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">카테고리</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  >
                    {CATEGORIES.filter(c => c !== '전체').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">예상 판매가 (원)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">출시 판매처 (쉼표로 구분)</label>
                <input
                  type="text"
                  placeholder="예: CU, GS25, 세븐일레븐, 배민B마트"
                  value={storesInput}
                  onChange={e => setStoresInput(e.target.value)}
                  className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">상품 이미지 URL</label>
                <div className="flex items-center gap-3">
                  {formData.image && (
                    <img src={formData.image} alt="미리보기" className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                  )}
                  <input
                    type="url"
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://... 이미지 URL"
                    className={`flex-1 p-2.5 rounded-xl text-xs border font-mono ${inputBg}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">출시 하이라이트 문구</label>
                  <input
                    type="text"
                    placeholder="예: 진한 피스타치오와 크런치 카다이프의 환상 조합"
                    value={formData.highlight}
                    onChange={e => setFormData({ ...formData, highlight: e.target.value })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">출시/행사 뱃지 (선택)</label>
                  <input
                    type="text"
                    placeholder="예: 단독출시, 사전예약, 1+1 행사"
                    value={formData.eventBadge}
                    onChange={e => setFormData({ ...formData, eventBadge: e.target.value })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black shadow-md shadow-purple-600/20"
                >
                  {editingCalendarId ? '수정사항 저장' : '일정 등록 완료'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-2xl p-5 max-w-sm w-full border shadow-2xl space-y-4 ${cardBg}`}>
            <div className="text-center">
              <h4 className="font-bold text-sm">출시 일정을 삭제하시겠습니까?</h4>
              <p className="text-xs text-slate-400 mt-1">출시 캘린더에서 제거됩니다.</p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl text-xs font-bold border border-slate-200"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
