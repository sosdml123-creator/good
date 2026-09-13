import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PromotionEvent } from '../../types';
import { 
  Gift, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Users,
  BellRing
} from 'lucide-react';

interface EventManagementTabProps {
  isDark: boolean;
}

export const EventManagementTab: React.FC<EventManagementTabProps> = ({ isDark }) => {
  const { 
    events, 
    addEvent, 
    updateEvent, 
    deleteEvent,
    sendPushNotification,
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<PromotionEvent, 'id' | 'createdAt' | 'participantsCount' | 'isParticipated'> & { id?: string; participantsCount?: number }>({
    id: '',
    title: '',
    subtitle: '',
    badge: '체험단 100명 모집',
    category: '체험단',
    bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80',
    startDate: '2026.09.15',
    endDate: '2026.09.30',
    dDay: 'D-15',
    status: 'ongoing',
    description: '',
    reward: '신제품 정품 1박스 무료 체험 (100명)',
    externalLink: '',
    actionButtonText: '무료 체험단 신청하기'
  });

  const categories: PromotionEvent['category'][] = ['체험단', '프로모션', '할인특가', '이벤트'];

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter(ev => {
      const matchSearch = !searchQuery.trim() ||
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.reward.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = selectedCategory === '전체' || ev.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [events, searchQuery, selectedCategory]);

  // Open modal for new
  const handleOpenNewModal = () => {
    setEditingEventId(null);
    setFormData({
      id: '',
      title: '',
      subtitle: '',
      badge: '선착순 증정',
      category: '체험단',
      bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80',
      startDate: '2026.09.15',
      endDate: '2026.09.30',
      dDay: 'D-15',
      status: 'ongoing',
      description: '',
      reward: '신제품 1박스 (100명 증정)',
      externalLink: '',
      actionButtonText: '무료 체험단 신청하기'
    });
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEditModal = (ev: PromotionEvent) => {
    setEditingEventId(ev.id);
    setFormData({
      id: ev.id,
      title: ev.title,
      subtitle: ev.subtitle,
      badge: ev.badge,
      category: ev.category,
      bannerImage: ev.bannerImage,
      startDate: ev.startDate,
      endDate: ev.endDate,
      dDay: ev.dDay,
      status: ev.status,
      description: ev.description,
      reward: ev.reward,
      externalLink: ev.externalLink || '',
      actionButtonText: ev.actionButtonText,
      participantsCount: ev.participantsCount
    });
    setIsModalOpen(true);
  };

  // Quick push notification trigger
  const handleSendPushForEvent = (ev: PromotionEvent) => {
    sendPushNotification({
      title: `🎁 [신상픽 이벤트] ${ev.title}`,
      body: `${ev.badge} - ${ev.reward}! 지금 바로 신청하세요.`,
      type: 'event',
      targetId: ev.id,
      imageUrl: ev.bannerImage,
      badge: ev.badge
    });
    showToast(`📢 '${ev.title}' 이벤트 푸시 알림이 발송되었습니다!`, 'success');
  };

  // Submit save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('이벤트 제목을 입력해주세요.', 'error');
      return;
    }

    if (editingEventId) {
      updateEvent(editingEventId, {
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
        badge: formData.badge.trim(),
        category: formData.category,
        bannerImage: formData.bannerImage.trim(),
        startDate: formData.startDate.trim(),
        endDate: formData.endDate.trim(),
        dDay: formData.dDay.trim(),
        status: formData.status,
        description: formData.description.trim(),
        reward: formData.reward.trim(),
        externalLink: formData.externalLink?.trim(),
        actionButtonText: formData.actionButtonText.trim()
      });
      showToast('이벤트가 수정되었습니다.', 'success');
    } else {
      addEvent({
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
        badge: formData.badge.trim() || '신규이벤트',
        category: formData.category,
        bannerImage: formData.bannerImage.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000',
        startDate: formData.startDate.trim(),
        endDate: formData.endDate.trim(),
        dDay: formData.dDay.trim() || '진행중',
        status: formData.status,
        description: formData.description.trim(),
        reward: formData.reward.trim(),
        externalLink: formData.externalLink?.trim(),
        actionButtonText: formData.actionButtonText.trim() || '이벤트 참여하기'
      });
      showToast('새 이벤트가 등록되었습니다.', 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteEvent(id);
    setDeleteConfirmId(null);
    showToast('이벤트가 삭제되었습니다.', 'info');
  };

  const cardBg = isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900';
  const subCardBg = isDark ? 'bg-slate-850 border-slate-800' : 'bg-slate-50 border-slate-200';
  const inputBg = isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-600/10 text-amber-600 flex items-center justify-center font-bold">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              이벤트 & 무료 체험단 정밀 관리
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              신제품 시식 체험단, 게릴라 경품 이벤트 및 쿠폰 프로모션을 등록하고 관리합니다.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenNewModal}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md shadow-amber-600/20 active:scale-95 transition-all self-start lg:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>새 이벤트 등록</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-3 ${cardBg}`}>
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="이벤트명, 혜택, 설명 검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs border focus:outline-none focus:border-amber-500 ${inputBg}`}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto">
          {['전체', '체험단', '프로모션', '할인특가', '이벤트'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map(ev => (
          <div key={ev.id} className={`rounded-2xl border overflow-hidden flex flex-col justify-between ${cardBg}`}>
            <div>
              {/* Banner */}
              <div className="h-32 relative overflow-hidden bg-slate-800">
                <img src={ev.bannerImage} alt={ev.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500 text-white shadow-xs">
                    {ev.badge}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                    {ev.category}
                  </span>
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <h3 className="text-white font-bold text-sm line-clamp-1">{ev.title}</h3>
                  <p className="text-slate-200 text-xs line-clamp-1">{ev.subtitle}</p>
                </div>
              </div>

              {/* Info Body */}
              <div className="p-4 space-y-2.5">
                <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 text-xs">
                  <span className="font-bold text-amber-900 dark:text-amber-300">경품/혜택:</span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">{ev.reward}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>기간: {ev.startDate} ~ {ev.endDate}</span>
                  <span className="font-bold text-amber-600">{ev.dDay}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    <span>참여자: <strong>{ev.participantsCount || 0}</strong>명</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ev.status === 'ongoing' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {ev.status === 'ongoing' ? '진행중' : '마감'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`p-3 border-t flex items-center justify-between gap-2 ${subCardBg}`}>
              <button
                onClick={() => handleSendPushForEvent(ev)}
                className="px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1 transition-all"
                title="이 이벤트로 앱 푸시알림 발송"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>푸시알림 발송</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEditModal(ev)}
                  className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                  title="수정"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(ev.id)}
                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                  title="삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================
          MODAL: ADD / EDIT EVENT
         ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border ${cardBg}`}>
            {/* Header */}
            <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm">
                  {editingEventId ? '이벤트 수정' : '새 이벤트 등록'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">이벤트 제목 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 꼬북칩 매콤치즈맛 출시기념 100인 체험단"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">카테고리</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as PromotionEvent['category'] })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">상단 뱃지 문구</label>
                  <input
                    type="text"
                    placeholder="예: 체험단 100명, 1+1 특가"
                    value={formData.badge}
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">부제목 (서브 카피)</label>
                <input
                  type="text"
                  placeholder="예: 바삭함의 끝판왕! 지금 바로 정품 무료 체험 기회를 잡으세요."
                  value={formData.subtitle}
                  onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                  className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">제공 혜택 및 리워드 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 꼬북칩 매콤치즈맛 정품 1박스 (12봉입, 총 100명)"
                  value={formData.reward}
                  onChange={e => setFormData({ ...formData, reward: e.target.value })}
                  className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">배너 이미지 URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... (가로형 고화질 이미지 권장)"
                  value={formData.bannerImage}
                  onChange={e => setFormData({ ...formData, bannerImage: e.target.value })}
                  className={`w-full p-2.5 rounded-xl text-xs border font-mono ${inputBg}`}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">시작일</label>
                  <input
                    type="text"
                    placeholder="2026.09.15"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">종료일</label>
                  <input
                    type="text"
                    placeholder="2026.09.30"
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">D-Day 표시</label>
                  <input
                    type="text"
                    placeholder="D-15, 오늘마감"
                    value={formData.dDay}
                    onChange={e => setFormData({ ...formData, dDay: e.target.value })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">신청/참여 버튼 문구</label>
                  <input
                    type="text"
                    placeholder="예: 무료 체험단 신청하기"
                    value={formData.actionButtonText}
                    onChange={e => setFormData({ ...formData, actionButtonText: e.target.value })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">진행 상태</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as PromotionEvent['status'] })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  >
                    <option value="ongoing">진행중 (ongoing)</option>
                    <option value="upcoming">예정 (upcoming)</option>
                    <option value="ended">마감 (ended)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">외부 참여/신청 링크 (선택)</label>
                <input
                  type="url"
                  placeholder="예: https://forms.gle/... 또는 인스타그램 신청 링크"
                  value={formData.externalLink}
                  onChange={e => setFormData({ ...formData, externalLink: e.target.value })}
                  className={`w-full p-2.5 rounded-xl text-xs border font-mono ${inputBg}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">이벤트 상세 안내</label>
                <textarea
                  rows={3}
                  placeholder="참여 방법, 발표 일자, 필수 미션 가이드 등"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                />
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
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black shadow-md shadow-amber-600/20"
                >
                  {editingEventId ? '수정사항 저장' : '이벤트 등록 완료'}
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
              <h4 className="font-bold text-sm">이벤트를 삭제하시겠습니까?</h4>
              <p className="text-xs text-slate-400 mt-1">앱 내 이벤트 목록에서 제거됩니다.</p>
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
