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
  BellRing,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Sparkles,
  Calendar,
  Eye,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

interface EventManagementTabProps {
  isDark: boolean;
}

// 고화질 추천 배너 이미지 프리셋
const BANNER_PRESETS = [
  { name: '피자', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop&q=80' },
  { name: '버거', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&auto=format&fit=crop&q=80' },
  { name: '스낵·과자', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80' },
  { name: '치킨', url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=1000&auto=format&fit=crop&q=80' },
  { name: '베이커리·디저트', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop&q=80' },
  { name: '음료·커피', url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=1000&auto=format&fit=crop&q=80' },
  { name: '아이스크림', url: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=1000&auto=format&fit=crop&q=80' }
];

export const EventManagementTab: React.FC<EventManagementTabProps> = ({ isDark }) => {
  const { 
    events, 
    addEvent, 
    updateEvent, 
    deleteEvent,
    reorderEvents,
    sendPushNotification,
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [showLivePreview, setShowLivePreview] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<PromotionEvent, 'id' | 'createdAt' | 'isParticipated'> & { id?: string }>({
    id: '',
    title: '',
    subtitle: '',
    badge: '체험단 100명',
    category: '체험단',
    bannerImage: BANNER_PRESETS[0].url,
    startDate: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
    endDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10).replace(/-/g, '.'),
    dDay: 'D-14',
    status: 'ongoing',
    description: '',
    reward: '신제품 정품 1박스 무료 체험 (총 100명)',
    externalLink: '',
    actionButtonText: '무료 체험단 즉시 신청하기',
    participantsCount: 0
  });

  const categories: PromotionEvent['category'][] = ['체험단', '프로모션', '할인특가', '이벤트'];

  // 카테고리별 카운트 계산
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { '전체': events.length };
    categories.forEach(c => {
      counts[c] = events.filter(e => e.category === c).length;
    });
    return counts;
  }, [events]);

  // 통계 계산
  const totalExperienceCount = useMemo(() => events.filter(e => e.category === '체험단').length, [events]);
  const ongoingCount = useMemo(() => events.filter(e => e.status === 'ongoing').length, [events]);
  const totalParticipants = useMemo(() => events.reduce((sum, e) => sum + (e.participantsCount || 0), 0), [events]);

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

  // 순서 이동 (Up / Down)
  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= events.length) return;

    const newEvents = [...events];
    const temp = newEvents[index];
    newEvents[index] = newEvents[targetIndex];
    newEvents[targetIndex] = temp;

    if (reorderEvents) {
      reorderEvents(newEvents);
    }
  };

  // 신규 체험단 구좌 등록 모달 열기
  const handleOpenNewExperienceModal = () => {
    setEditingEventId(null);
    setFormData({
      id: '',
      title: '',
      subtitle: '',
      badge: '체험단 100명',
      category: '체험단',
      bannerImage: BANNER_PRESETS[0].url,
      startDate: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      endDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10).replace(/-/g, '.'),
      dDay: 'D-14',
      status: 'ongoing',
      description: '[신제품 시식 체험단 오픈!]\n새롭게 출시된 신제품을 가장 먼저 무료로 체험해보고 솔직한 후기를 남겨보세요!',
      reward: '신제품 정품 1박스 (총 100명 무료 증정)',
      externalLink: '',
      actionButtonText: '무료 체험단 즉시 신청하기',
      participantsCount: 0
    });
    setIsModalOpen(true);
  };

  // 일반 이벤트 등록 모달 열기
  const handleOpenNewEventModal = () => {
    setEditingEventId(null);
    setFormData({
      id: '',
      title: '',
      subtitle: '',
      badge: '선착순 증정',
      category: '프로모션',
      bannerImage: BANNER_PRESETS[2].url,
      startDate: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      endDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10).replace(/-/g, '.'),
      dDay: 'D-7',
      status: 'ongoing',
      description: '신상픽 단독 프로모션 이벤트 안내입니다.',
      reward: '모바일 할인 쿠폰 증정',
      externalLink: '',
      actionButtonText: '이벤트 참여하기',
      participantsCount: 0
    });
    setIsModalOpen(true);
  };

  // 구좌 정보 수정 모달 열기
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
      participantsCount: ev.participantsCount || 0
    });
    setIsModalOpen(true);
  };

  // 푸시 알림 발송
  const handleSendPushForEvent = (ev: PromotionEvent) => {
    sendPushNotification({
      title: `🎁 [신상픽 체험단] ${ev.title}`,
      body: `${ev.badge} - ${ev.reward}! 지금 바로 신청하세요.`,
      type: 'event',
      targetId: ev.id,
      imageUrl: ev.bannerImage,
      badge: ev.badge
    });
    showToast(`📢 '${ev.title}' 체험단 푸시 알림이 발송되었습니다!`, 'success');
  };

  // 저장 (신규 등록 및 수정)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('체험단 구좌 제목을 입력해주세요.', 'error');
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
        actionButtonText: formData.actionButtonText.trim(),
        participantsCount: Number(formData.participantsCount) || 0
      });
      showToast('체험단 구좌 정보가 성공적으로 수정되었습니다.', 'success');
    } else {
      addEvent({
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
        badge: formData.badge.trim() || '체험단 100명',
        category: formData.category,
        bannerImage: formData.bannerImage.trim() || BANNER_PRESETS[0].url,
        startDate: formData.startDate.trim(),
        endDate: formData.endDate.trim(),
        dDay: formData.dDay.trim() || '진행중',
        status: formData.status,
        description: formData.description.trim(),
        reward: formData.reward.trim(),
        externalLink: formData.externalLink?.trim(),
        actionButtonText: formData.actionButtonText.trim() || '무료 체험단 신청하기'
      });
      showToast('새 체험단 구좌가 등록되었습니다.', 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteEvent(id);
    setDeleteConfirmId(null);
    showToast('체험단 구좌가 삭제되었습니다.', 'info');
  };

  const cardBg = isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900';
  const subCardBg = isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50/80 border-slate-100';
  const inputBg = isDark ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white';

  return (
    <div className="space-y-6">
      
      {/* 1. 상단 타이틀 & 주요 액션 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold shadow-xs">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  체험단 구좌 & 이벤트 관리
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white shadow-xs">
                  홈 메인 노출 구좌
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                앱 홈 화면의 <strong>'진행 중인 핫 이벤트 & 체험단'</strong> 가로 스크롤 구좌와 상단 퀵메뉴 체험단 콘텐츠를 직접 등록·수정·배치합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              showLivePreview 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                : isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showLivePreview ? '홈 미리보기 닫기' : '홈 노출 미리보기'}</span>
          </button>

          <button
            onClick={handleOpenNewExperienceModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ 새 체험단 구좌 등록</span>
          </button>

          <button
            onClick={handleOpenNewEventModal}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ 일반 이벤트</span>
          </button>
        </div>
      </div>

      {/* 2. 구좌 통계 현황 대시보드 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
            <span>전체 노출 구좌</span>
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black mt-1.5 tracking-tight">
            {events.length}<span className="text-xs font-normal text-slate-400 ml-1">개</span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <div className="text-[11px] font-bold text-emerald-500 flex items-center justify-between">
            <span>체험단 구좌</span>
            <Gift className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-2xl font-black mt-1.5 tracking-tight text-emerald-600">
            {totalExperienceCount}<span className="text-xs font-normal text-slate-400 ml-1">개</span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <div className="text-[11px] font-bold text-amber-500 flex items-center justify-between">
            <span>진행 중 (Ongoing)</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-black mt-1.5 tracking-tight text-amber-600">
            {ongoingCount}<span className="text-xs font-normal text-slate-400 ml-1">개</span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
            <span>누적 신청·참여자</span>
            <Users className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-black mt-1.5 tracking-tight text-indigo-600">
            {totalParticipants.toLocaleString()}<span className="text-xs font-normal text-slate-400 ml-1">명</span>
          </div>
        </div>
      </div>

      {/* 3. 라이브 홈 화면 노출 미리보기 (접기/펼치기) */}
      {showLivePreview && (
        <div className={`p-5 rounded-3xl border ${isDark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-indigo-50/50 border-indigo-100'} shadow-sm space-y-3 animate-in fade-in duration-200`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                📱 사용자 앱 홈 화면 실제 노출 뷰 (가로 스크롤 미리보기)
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              * 왼쪽 구좌부터 앱 메인 상단에 1순위로 노출됩니다.
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
            {events.map((ev, idx) => (
              <div
                key={ev.id}
                className="shrink-0 w-[240px] bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex flex-col"
              >
                <div className="relative aspect-[16/9] bg-gray-900 overflow-hidden">
                  <img
                    src={ev.bannerImage}
                    alt={ev.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  
                  <span className="absolute top-2 left-2 text-[10px] font-black text-white bg-emerald-600 px-2 py-0.5 rounded-full shadow-xs">
                    #{idx + 1} {ev.badge}
                  </span>

                  <span className="absolute top-2 right-2 text-[10px] font-bold text-amber-300 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full border border-amber-400/40">
                    {ev.dDay}
                  </span>

                  <div className="absolute bottom-1.5 left-2 right-2 text-[10px] text-white/90 font-medium truncate">
                    {ev.startDate} ~ {ev.endDate}
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 line-clamp-1 leading-snug">
                      {ev.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                      {ev.subtitle}
                    </p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[130px]">
                      {ev.reward}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium shrink-0">
                      {ev.participantsCount}명 참여
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. 검색 & 카테고리 필터 바 */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-3 ${cardBg}`}>
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="체험단 구좌명, 혜택, 부제목 검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs border focus:outline-none focus:border-emerald-500 ${inputBg}`}
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                selectedCategory === cat 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{cat === '체험단' ? '🎁 체험단 구좌' : cat}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-black/10 text-slate-500'
              }`}>
                {categoryCounts[cat] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. 체험단 구좌 카드 리스트 (정밀 수정 및 순서 배치) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((ev) => {
          const originalIndex = events.findIndex(e => e.id === ev.id);
          const isFirst = originalIndex === 0;
          const isLast = originalIndex === events.length - 1;

          return (
            <div 
              key={ev.id} 
              className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all hover:border-emerald-500/50 group shadow-xs ${cardBg}`}
            >
              <div>
                {/* 상단 순위 헤더 바 */}
                <div className={`px-3.5 py-2 border-b flex items-center justify-between text-xs ${subCardBg}`}>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-white dark:bg-slate-700 text-[10px] font-mono font-black flex items-center justify-center">
                      #{originalIndex + 1}
                    </span>
                    <span className="font-bold text-[11px] text-slate-500">
                      홈 화면 노출 {originalIndex + 1}순위 구좌
                    </span>
                  </div>

                  {/* 노출 순서 이동 버튼 (위/아래) */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveOrder(originalIndex, 'up')}
                      disabled={isFirst}
                      title="홈 화면 노출 순서 위로 이동"
                      className={`p-1 rounded-md text-xs transition-colors ${
                        isFirst 
                          ? 'opacity-30 cursor-not-allowed text-slate-400' 
                          : 'hover:bg-emerald-500/20 text-slate-600 dark:text-slate-300 hover:text-emerald-500'
                      }`}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(originalIndex, 'down')}
                      disabled={isLast}
                      title="홈 화면 노출 순서 아래로 이동"
                      className={`p-1 rounded-md text-xs transition-colors ${
                        isLast 
                          ? 'opacity-30 cursor-not-allowed text-slate-400' 
                          : 'hover:bg-emerald-500/20 text-slate-600 dark:text-slate-300 hover:text-emerald-500'
                      }`}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Banner Thumbnail */}
                <div className="h-36 relative overflow-hidden bg-slate-900">
                  <img 
                    src={ev.bannerImage} 
                    alt={ev.title} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white shadow-xs">
                      {ev.badge}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                      {ev.category}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-300 bg-black/70 backdrop-blur-xs border border-amber-400/30">
                      {ev.dDay}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3">
                    <h3 className="text-white font-bold text-sm line-clamp-1 leading-snug drop-shadow-xs">{ev.title}</h3>
                    <p className="text-slate-200 text-xs line-clamp-1 mt-0.5 opacity-90">{ev.subtitle}</p>
                  </div>
                </div>

                {/* Info Body */}
                <div className="p-4 space-y-2.5">
                  <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 text-xs">
                    <span className="font-bold text-emerald-900 dark:text-emerald-300">🎁 제공 리워드 / 혜택:</span>
                    <p className="text-slate-700 dark:text-slate-300 font-semibold mt-0.5 line-clamp-1">{ev.reward}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ev.startDate} ~ {ev.endDate}</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ev.status === 'ongoing' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {ev.status === 'ongoing' ? '진행중' : ev.status === 'upcoming' ? '예정' : '마감'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-indigo-500" />
                      <span>신청자: <strong>{(ev.participantsCount || 0).toLocaleString()}</strong>명</span>
                    </span>

                    {ev.externalLink ? (
                      <a 
                        href={ev.externalLink} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[11px] text-indigo-500 hover:underline flex items-center gap-1"
                      >
                        <span>신청폼 링크</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400">앱 내 신청</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer: 크고 명확한 [체험단 구좌 수정] 버튼 */}
              <div className={`p-3 border-t flex items-center justify-between gap-2 ${subCardBg}`}>
                <button
                  onClick={() => handleSendPushForEvent(ev)}
                  className="px-2.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1 transition-all"
                  title="이 체험단으로 앱 푸시알림 발송"
                >
                  <BellRing className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">푸시 발송</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(ev)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                    title="체험단 구좌 정보 수정"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>구좌 수정</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(ev.id)}
                    className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                    title="구좌 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================
          MODAL: ADD / EDIT EXPERIENCE SLOT (체험단 구좌 정밀 수정)
         ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border ${cardBg}`}>
            {/* Header */}
            <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    {editingEventId ? '체험단 구좌 정보 수정' : '새 체험단 구좌 등록'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    홈 화면 핫 체험단 섹션에 노출되는 정보를 편집합니다.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body Form */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* 1. 제목 */}
              <div>
                <label className="block text-xs font-bold mb-1">
                  체험단 구좌 제목 (Title) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 🍕 대표 피자 브랜드 시식 체험단 100인 모집"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                />
              </div>

              {/* 2. 카테고리 & 뱃지 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">구좌 카테고리</label>
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
                    placeholder="예: 체험단 100명, 선착순 50명, 1+1 특가"
                    value={formData.badge}
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
              </div>

              {/* 3. 부제목 (서브 카피) */}
              <div>
                <label className="block text-xs font-bold mb-1">부제목 (서브 카피 / 한 줄 요약)</label>
                <input
                  type="text"
                  placeholder="예: 가장 먼저 신메뉴를 맛보고 솔직한 먹방 후기를 남겨주세요."
                  value={formData.subtitle}
                  onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                  className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                />
              </div>

              {/* 4. 리워드 / 혜택 & 참여자 수 */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold mb-1">
                    제공 리워드 / 경품 혜택 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="예: 신제품 정품 1박스 모바일 교환권 (총 100명)"
                    value={formData.reward}
                    onChange={e => setFormData({ ...formData, reward: e.target.value })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">누적 신청자(명)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="예: 820"
                    value={formData.participantsCount ?? 0}
                    onChange={e => setFormData({ ...formData, participantsCount: parseInt(e.target.value) || 0 })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
              </div>

              {/* 5. 배너 이미지 및 프리셋 버튼 */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold">배너 이미지 URL</label>
                  <span className="text-[11px] text-slate-400">16:9 가로형 이미지 권장</span>
                </div>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... (또는 외부 이미지 주소)"
                  value={formData.bannerImage}
                  onChange={e => setFormData({ ...formData, bannerImage: e.target.value })}
                  className={`w-full p-2.5 rounded-xl text-xs border font-mono ${inputBg}`}
                />

                {/* 이미지 프리셋 빠른 선택 */}
                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" /> 추천 이미지:
                  </span>
                  {BANNER_PRESETS.map(preset => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, bannerImage: preset.url })}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. 일정 및 D-Day */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">시작일</label>
                  <input
                    type="text"
                    placeholder="2026.09.01"
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
                  <label className="block text-xs font-bold mb-1">D-Day 표시 문구</label>
                  <input
                    type="text"
                    placeholder="D-14, 오늘마감, 상시"
                    value={formData.dDay}
                    onChange={e => setFormData({ ...formData, dDay: e.target.value })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
              </div>

              {/* 7. 신청 버튼 & 진행 상태 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">신청/참여 버튼 문구</label>
                  <input
                    type="text"
                    placeholder="예: 무료 체험단 즉시 신청하기"
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

              {/* 8. 외부 참여/신청 링크 */}
              <div>
                <label className="block text-xs font-bold mb-1">외부 참여/신청 링크 (선택)</label>
                <input
                  type="url"
                  placeholder="예: https://forms.gle/... 또는 인스타그램 신청 링크 (비워둘 시 앱 내 신청)"
                  value={formData.externalLink}
                  onChange={e => setFormData({ ...formData, externalLink: e.target.value })}
                  className={`w-full p-2.5 rounded-xl text-xs border font-mono ${inputBg}`}
                />
              </div>

              {/* 9. 상세 안내 */}
              <div>
                <label className="block text-xs font-bold mb-1">체험단 상세 안내 및 미션 가이드</label>
                <textarea
                  rows={4}
                  placeholder="참여 방법, 발표 일자, 리뷰 작성 미션 등 상세 안내 사항을 입력하세요."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                />
              </div>

              {/* Footer */}
              <div className="pt-4 border-t flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                >
                  {editingEventId ? '구좌 수정사항 저장' : '체험단 구좌 등록 완료'}
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
              <h4 className="font-bold text-sm">체험단 구좌를 삭제하시겠습니까?</h4>
              <p className="text-xs text-slate-400 mt-1">홈 화면 및 이벤트 목록에서 즉시 제거됩니다.</p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-500"
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
