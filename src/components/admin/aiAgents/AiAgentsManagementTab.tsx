// src/components/admin/aiAgents/AiAgentsManagementTab.tsx
import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { AI_AGENT_PERSONAS, AGENT_CATEGORIES } from './agentData';
import { AgentCategoryId, AgentPersona } from './types';
import { AgentDetailChatView } from './AgentDetailChatView';
import { MultiAgentCollaborationView } from './MultiAgentCollaborationView';
import { PromptExportModal } from './PromptExportModal';
import { ApiKeyModal } from './ApiKeyModal';
import {
  Users,
  Search,
  Sparkles,
  MessageSquare,
  Copy,
  Key,
  Zap,
  ArrowRight
} from 'lucide-react';

interface AiAgentsManagementTabProps {
  onNotify?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const AiAgentsManagementTab: React.FC<AiAgentsManagementTabProps> = ({ onNotify }) => {
  const { products, showToast } = useApp();

  // 활성 탭 모드: 'gallery' (전문가 목록) | 'chat' (1:1 대화) | 'collab' (멀티 에이전트 동시 협업)
  const [activeView, setActiveView] = useState<'gallery' | 'chat' | 'collab'>('gallery');
  
  // 선택된 1:1 대화 대상 전문가
  const [activeChatPersona, setActiveChatPersona] = useState<AgentPersona | null>(null);

  // 카테고리 필터 & 검색
  const [selectedCategory, setSelectedCategory] = useState<AgentCategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 모달 상태
  const [exportModalPersona, setExportModalPersona] = useState<AgentPersona | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // 신상픽 실시간 앱 컨텍스트 데이터
  const appContext = useMemo(() => {
    return {
      totalProducts: products.length,
      sampleProducts: products.slice(0, 10).map((p) => ({
        name: p.name,
        brand: p.brand,
        category: p.category,
      })),
    };
  }, [products]);

  // 카테고리 및 검색 필터링된 전문가 목록
  const filteredPersonas = useMemo(() => {
    return AI_AGENT_PERSONAS.filter((agent) => {
      const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        agent.koreanName.toLowerCase().includes(q) ||
        agent.name.toLowerCase().includes(q) ||
        agent.role.toLowerCase().includes(q) ||
        agent.summary.toLowerCase().includes(q) ||
        agent.keySkills.some((s) => s.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleStartChat = (persona: AgentPersona) => {
    setActiveChatPersona(persona);
    setActiveView('chat');
  };

  const handleOpenExport = (persona: AgentPersona) => {
    setExportModalPersona(persona);
  };

  // 1:1 대화 뷰
  if (activeView === 'chat' && activeChatPersona) {
    return (
      <AgentDetailChatView
        persona={activeChatPersona}
        onBack={() => setActiveView('gallery')}
        onOpenExportModal={() => setExportModalPersona(activeChatPersona)}
        appContext={appContext}
        onNotify={onNotify || showToast}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto">
      
      {/* Top Main Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🤖</span>
            <h1 className="text-xl font-bold text-white tracking-tight">
              AI 전문가 에이전트 (Agency Agents)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> 16인 정예 전문가
            </span>
          </div>
          <p className="text-xs text-slate-400">
            개발자, 디자이너, 광고, 영업, 마케팅, 기획, PM — 실무에 바로 투입되는 AI 전문가를 호출하고 협업시키세요.
          </p>
        </div>

        {/* Right Action Controls: Tab Switcher & API Key */}
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setActiveView('gallery')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeView === 'gallery'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>전문가 목록</span>
            </button>
            <button
              onClick={() => setActiveView('collab')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeView === 'collab'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>동시 협업 모드</span>
            </button>
          </div>

          {/* API Key Modal Button */}
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            title="본인 AI API Key 설정 (Claude, OpenAI)"
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">API Key 설정</span>
          </button>
        </div>
      </div>

      {/* View Switch */}
      {activeView === 'collab' ? (
        <MultiAgentCollaborationView
          allPersonas={AI_AGENT_PERSONAS}
          appContext={appContext}
          onNotify={onNotify || showToast}
        />
      ) : (
        <div className="p-6 space-y-6 flex-1">
          
          {/* Quick Notice Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xl shrink-0">
                ✨
              </div>
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  <span>원하는 AI 전문가와 1초 만에 업무를 시작하세요</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">100% 무료</span>
                </div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  앱 내에서 바로 1:1 대화하거나, [프롬프트 복사] 버튼으로 본인이 쓰는 Claude.ai / ChatGPT / Cursor에 붙여넣어 사용할 수 있습니다.
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveView('collab')}
              className="px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <span>4명 동시 협업 실행하기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="space-y-3">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="전문가 이름, 스킬, 역할 검색 (예: React, ROAS, 인스타)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 text-slate-200 placeholder:text-slate-500 text-xs outline-none transition-colors"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {AGENT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Persona Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPersonas.map((agent) => (
              <div
                key={agent.id}
                className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-950/30 transition-all duration-300 flex flex-col overflow-hidden relative"
              >
                {/* Card Top Pill */}
                <div className="p-4 pb-3 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                      {agent.avatarIcon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors leading-tight">
                        {agent.koreanName}
                      </h3>
                      <div className="text-[10px] text-slate-400 font-mono">
                        @{agent.id}
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${agent.themeColor.badge}`}>
                    {agent.categoryLabel}
                  </span>
                </div>

                {/* Role & Summary */}
                <div className="px-4 pb-3 space-y-1.5 flex-1">
                  <div className="text-xs font-semibold text-slate-200">
                    {agent.role}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {agent.summary}
                  </p>
                </div>

                {/* Key Skills */}
                <div className="px-4 pb-3 flex flex-wrap gap-1">
                  {agent.keySkills.slice(0, 3).map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 text-[10px] font-mono border border-slate-700/50"
                    >
                      {skill}
                    </span>
                  ))}
                  {agent.keySkills.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded-lg bg-slate-800/40 text-slate-500 text-[10px]">
                      +{agent.keySkills.length - 3}
                    </span>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-2">
                  <button
                    onClick={() => handleStartChat(agent)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/20 transition-all active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>실시간 대화</span>
                  </button>

                  <button
                    onClick={() => handleOpenExport(agent)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center gap-1 transition-colors"
                    title="Claude / ChatGPT용 프롬프트 복사"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">복사</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredPersonas.length === 0 && (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <Users className="w-10 h-10 mx-auto opacity-40" />
              <div className="text-sm font-semibold">검색 조건에 맞는 전문가가 없습니다.</div>
              <div className="text-xs">검색어를 지우거나 다른 카테고리를 선택해 보세요.</div>
            </div>
          )}

        </div>
      )}

      {/* Export Prompt Modal */}
      <PromptExportModal
        persona={exportModalPersona}
        isOpen={!!exportModalPersona}
        onClose={() => setExportModalPersona(null)}
        appContext={appContext}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSaved={() => {
          if (onNotify) onNotify('AI API Key 설정이 성공적으로 저장되었습니다.', 'success');
        }}
      />

    </div>
  );
};
