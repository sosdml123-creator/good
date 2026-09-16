import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HomeSectionConfig, HomeSectionId } from '../../types';
import { 
  Layers, 
  ArrowUp, 
  ArrowDown, 
  Edit3, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Check, 
  X, 
  Sliders, 
  Sparkles,
  Tag,
  Building2,
  TrendingUp,
  Gift,
  BookOpen,
  Swords,
  Award,
  MessageSquare,
  LayoutGrid,
  Info
} from 'lucide-react';

interface HomeSectionsManagementTabProps {
  isDark: boolean;
}

export const HomeSectionsManagementTab: React.FC<HomeSectionsManagementTabProps> = ({ isDark }) => {
  const { 
    homeSections, 
    updateHomeSection, 
    reorderHomeSections, 
    toggleHomeSectionVisibility, 
    resetHomeSections,
    showToast 
  } = useApp();

  const [editingSection, setEditingSection] = useState<HomeSectionConfig | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editBadgeText, setEditBadgeText] = useState('');
  const [editItemLimit, setEditItemLimit] = useState<number>(10);

  const sortedSections = [...homeSections].sort((a, b) => a.order - b.order);

  const activeCount = homeSections.filter(s => s.isVisible).length;
  const inactiveCount = homeSections.length - activeCount;

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedSections.length) return;

    const newSections = [...sortedSections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    reorderHomeSections(newSections);
  };

  const handleOpenEdit = (section: HomeSectionConfig) => {
    setEditingSection(section);
    setEditTitle(section.title);
    setEditSubtitle(section.subtitle || '');
    setEditBadgeText(section.badgeText || '');
    setEditItemLimit(section.itemLimit || 10);
  };

  const handleSaveEdit = () => {
    if (!editingSection) return;
    if (!editTitle.trim()) {
      showToast('구좌 타이틀을 입력해주세요.', 'error');
      return;
    }

    updateHomeSection(editingSection.id, {
      title: editTitle.trim(),
      subtitle: editSubtitle.trim(),
      badgeText: editBadgeText.trim(),
      itemLimit: editItemLimit > 0 ? editItemLimit : undefined,
    });

    setEditingSection(null);
  };

  const handleToggleAll = (visible: boolean) => {
    const updated = homeSections.map(s => ({ ...s, isVisible: visible }));
    updated.forEach(s => {
      updateHomeSection(s.id, { isVisible: visible });
    });
    showToast(`모든 구좌가 ${visible ? '활성화' : '비활성화'}되었습니다.`, 'info');
  };

  const getSectionIcon = (id: HomeSectionId) => {
    switch (id) {
      case 'banners': return <Layers className="w-4 h-4 text-indigo-500" />;
      case 'quick_menu': return <LayoutGrid className="w-4 h-4 text-emerald-500" />;
      case 'categories': return <Sliders className="w-4 h-4 text-cyan-500" />;
      case 'new_products': return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'sale_events': return <Tag className="w-4 h-4 text-rose-500" />;
      case 'brand_hub': return <Building2 className="w-4 h-4 text-blue-500" />;
      case 'search_trending': return <TrendingUp className="w-4 h-4 text-orange-500" />;
      case 'hot_events': return <Gift className="w-4 h-4 text-purple-500" />;
      case 'recipes': return <BookOpen className="w-4 h-4 text-yellow-600" />;
      case 'battle': return <Swords className="w-4 h-4 text-red-500" />;
      case 'popular_ranking': return <Award className="w-4 h-4 text-amber-600" />;
      case 'reviews': return <MessageSquare className="w-4 h-4 text-teal-500" />;
      default: return <Layers className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xs`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
                <Layers className="w-5 h-5" />
              </div>
              <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                홈 화면 구좌(섹션) 노출 및 타이틀 관리
              </h2>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              사용자 홈 탭에 노출되는 각 구좌의 노출 여부, 순서, 타이틀, 부제목 및 뱃지를 직접 컨트롤할 수 있습니다.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleToggleAll(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              전체 활성화
            </button>
            <button
              onClick={() => handleToggleAll(false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              전체 비활성화
            </button>
            <button
              onClick={() => {
                if (window.confirm('홈 구좌 설정을 기본값으로 초기화하시겠습니까?')) {
                  resetHomeSections();
                }
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              기본값 초기화
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
            <span className="text-[11px] font-bold text-slate-400 block">전체 구좌</span>
            <span className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{homeSections.length}개</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[11px] font-bold text-emerald-600 block">현재 노출 중</span>
            <span className="text-base font-black text-emerald-600">{activeCount}개</span>
          </div>
          <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
            <span className="text-[11px] font-bold text-slate-400 block">비노출 숨김</span>
            <span className={`text-base font-black ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{inactiveCount}개</span>
          </div>
        </div>
      </div>

      {/* Notice info */}
      <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
        isDark ? 'bg-blue-950/20 border-blue-800/40 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'
      }`}>
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
        <p className="leading-relaxed">
          구좌 순서를 변경하려면 우측의 <strong>위로(▲) / 아래로(▼)</strong> 버튼을 클릭하세요. 각 구좌의 문구(타이틀, 부제목, 뱃지)를 변경하려면 <strong>설정 수정</strong> 버튼을 누르시면 실시간으로 홈 화면에 반영됩니다.
        </p>
      </div>

      {/* Sections List */}
      <div className={`rounded-2xl border overflow-hidden shadow-xs ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            홈 구좌 배치 목록 (위에서부터 순서대로 노출)
          </span>
          <span className="text-xs text-slate-400 font-medium">
            총 {sortedSections.length}개 구좌
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {sortedSections.map((sec, idx) => (
            <div 
              key={sec.id}
              className={`p-4 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                !sec.isVisible ? (isDark ? 'bg-slate-900/40 opacity-60' : 'bg-slate-50/70 opacity-60') : ''
              } ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'}`}
            >
              {/* Left Info */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {/* Order Index */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                  sec.isVisible
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 shrink-0">
                      {getSectionIcon(sec.id)}
                    </div>
                    <span className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {sec.name}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      (ID: {sec.id})
                    </span>

                    {sec.badgeText && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        뱃지: {sec.badgeText}
                      </span>
                    )}

                    {sec.itemLimit && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600">
                        최대 {sec.itemLimit}개
                      </span>
                    )}

                    {sec.isVisible ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                        <Check className="w-3 h-3" /> 노출 활성
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> 숨김
                      </span>
                    )}
                  </div>

                  {/* Display Details Preview */}
                  <div className="mt-1.5 pl-7 text-xs space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-medium">화면 타이틀:</span>
                      <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {sec.title || '(타이틀 없음)'}
                      </span>
                    </div>
                    {sec.subtitle && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-medium">부제목/설명:</span>
                        <span className="text-slate-500 truncate max-w-md">
                          {sec.subtitle}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center pl-7 md:pl-0">
                {/* Move Up/Down */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent text-slate-700 dark:text-slate-300 transition-colors"
                    title="순서 위로 이동"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === sortedSections.length - 1}
                    className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent text-slate-700 dark:text-slate-300 transition-colors"
                    title="순서 아래로 이동"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => handleOpenEdit(sec)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1 ${
                    isDark 
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                  설정 수정
                </button>

                {/* Toggle Visibility */}
                <button
                  onClick={() => toggleHomeSectionVisibility(sec.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                    sec.isVisible
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {sec.isVisible ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      노출 중
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      숨김 상태
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Section Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl ${isDark ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white text-slate-900'}`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">
                    [{editingSection.name}] 구좌 문구 및 설정
                  </h3>
                  <p className="text-xs text-slate-400">ID: {editingSection.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingSection(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-4">
              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                  메인 화면 노출 타이틀 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="예: 따끈따끈 새로 나온 신제품"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                  부제목 / 설명 텍스트
                </label>
                <input
                  type="text"
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  placeholder="예: 편의점·마트 실시간 입고"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                    상단 배지(Badge) 문구
                  </label>
                  <input
                    type="text"
                    value={editBadgeText}
                    onChange={(e) => setEditBadgeText(e.target.value)}
                    placeholder="예: NEW 신상, 1+1"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                    표시 아이템 개수 (최대)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={editItemLimit}
                    onChange={(e) => setEditItemLimit(parseInt(e.target.value) || 10)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Preview Box */}
              <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[11px] font-bold text-slate-400 block mb-2">실제 노출 미리보기</span>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
                  <div className="flex items-center gap-1.5">
                    {editBadgeText && (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200">
                        {editBadgeText}
                      </span>
                    )}
                    {editSubtitle && (
                      <span className="text-[11px] text-gray-400 font-medium">{editSubtitle}</span>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-gray-900 dark:text-white mt-1">
                    {editTitle || '타이틀을 입력해주세요'}
                  </h4>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setEditingSection(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                취소
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                설정 저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
