// src/components/admin/aiAgents/MultiAgentCollaborationView.tsx
import React, { useState } from 'react';
import { AgentPersona, MultiAgentTaskResult } from './types';
import { executeMultiAgentTask } from './aiAgentService';
import {
  Play,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface MultiAgentCollaborationViewProps {
  allPersonas: AgentPersona[];
  appContext?: {
    totalProducts?: number;
    sampleProducts?: Array<{ name: string; brand: string; category: string }>;
  };
  onNotify?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const MultiAgentCollaborationView: React.FC<MultiAgentCollaborationViewProps> = ({
  allPersonas,
  appContext,
  onNotify,
}) => {
  // 기본 선택된 4인 전문가: 종합 마케터, 카피라이터, 브랜드 디자이너, 퍼포먼스 마케터
  const defaultSelectedIds = ['general-marketer', 'content-copywriter', 'brand-designer', 'performance-marketer'];
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>(defaultSelectedIds);
  const [taskPrompt, setTaskPrompt] = useState(
    '신상픽 2024 가을 시즌 한정 신제품(밤/고구마 디저트) 런칭을 위한 각 분야별 전략과 산출물을 작성해주세요.'
  );
  const [includeContext, setIncludeContext] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState<MultiAgentTaskResult[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedAgentId, setCopiedAgentId] = useState<string | null>(null);

  // 팀 프리셋
  const presets = [
    {
      name: '🚀 신제품 런칭 마케팅 팀',
      description: '종합 마케터 + 카피라이터 + 브랜드 디자이너 + 퍼포먼스 마케터',
      ids: ['general-marketer', 'content-copywriter', 'brand-designer', 'performance-marketer'],
    },
    {
      name: '💻 풀스택 & UI/UX 테크 스쿼드',
      description: '프론트엔드 + 백엔드 + 모바일 + UI/UX 디자이너',
      ids: ['frontend-developer', 'backend-developer', 'mobile-developer', 'ui-ux-designer'],
    },
    {
      name: '💼 B2B 입점 & 세일즈 올스타',
      description: 'B2B 전문가 + 세일즈 전문가 + 광고 전략가 + PM',
      ids: ['b2b-specialist', 'sales-specialist', 'ad-strategist', 'product-manager'],
    },
    {
      name: '📝 제품 기획 & 프로젝트 관리 팀',
      description: '서비스 기획자 + PM + 프로젝트 매니저 + AI 엔지니어',
      ids: ['product-planner', 'product-manager', 'project-manager', 'ai-engineer'],
    },
  ];

  const handleToggleAgent = (id: string) => {
    if (selectedAgentIds.includes(id)) {
      if (selectedAgentIds.length <= 1) {
        if (onNotify) onNotify('최소 1명 이상의 전문가를 선택해야 합니다.', 'info');
        return;
      }
      setSelectedAgentIds(selectedAgentIds.filter((item) => item !== id));
    } else {
      if (selectedAgentIds.length >= 6) {
        if (onNotify) onNotify('원활한 협업을 위해 최대 6명까지 선택할 수 있습니다.', 'info');
        return;
      }
      setSelectedAgentIds([...selectedAgentIds, id]);
    }
  };

  const handleApplyPreset = (ids: string[]) => {
    setSelectedAgentIds(ids);
  };

  const handleExecute = async () => {
    if (!taskPrompt.trim() || isExecuting) return;

    const selectedPersonas = allPersonas.filter((p) => selectedAgentIds.includes(p.id));
    if (selectedPersonas.length === 0) return;

    setIsExecuting(true);
    // 초기 로딩 카드 상태 설정
    const initialResults: MultiAgentTaskResult[] = selectedPersonas.map((p) => ({
      agentId: p.id,
      agentName: p.koreanName,
      role: p.role,
      avatarIcon: p.avatarIcon,
      color: p.themeColor.gradient,
      output: '',
      isLoading: true,
    }));
    setResults(initialResults);

    try {
      const finalResults = await executeMultiAgentTask(
        selectedPersonas,
        taskPrompt,
        includeContext,
        appContext,
        (agentId, updatedResult) => {
          setResults((prev) =>
            prev.map((r) => (r.agentId === agentId ? updatedResult : r))
          );
        }
      );
      setResults(finalResults);
      if (onNotify) onNotify(`${selectedPersonas.length}명의 전문가가 동시 협업 보고서를 완성했습니다!`, 'success');
    } catch (err: any) {
      if (onNotify) onNotify(`협업 실행 실패: ${err.message}`, 'error');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopyAll = () => {
    if (results.length === 0) return;

    const combinedText = `# 🚀 신상픽 AI 전문가 ${results.length}인 동시 협업 종합 보고서

[공통 과제]: ${taskPrompt}

${results
  .map(
    (r, i) => `
========================================
[전문가 ${i + 1}] ${r.avatarIcon} ${r.agentName} (${r.role})
========================================
${r.output}
`
  )
  .join('\n\n')}
`;

    navigator.clipboard.writeText(combinedText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopySingle = (agentId: string, output: string) => {
    navigator.clipboard.writeText(output);
    setCopiedAgentId(agentId);
    setTimeout(() => setCopiedAgentId(null), 1500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto p-4 sm:p-6 space-y-6">
      
      {/* Top Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/50 border border-indigo-900/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>멀티 에이전트 동시 협업 모드 (Parallel Agents)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            원하는 전문가 4명을 골라 과제를 던지면, 각자 동시에 일하고 결과를 보고합니다.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            마케터는 카피를, 디자이너는 비주얼 컨셉을, 개발자는 기술 스펙을, PM은 마일스톤을 실시간 병렬로 산출합니다.
          </p>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>추천 팀 프리셋 (원클릭 구성):</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset.ids)}
              className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/50 text-left transition-all group"
            >
              <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                {preset.name}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Agent Selector Chips */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">
            협업 참여 전문가 선택 ({selectedAgentIds.length}명 선택됨)
          </span>
          <span className="text-[11px] text-slate-500">클릭하여 선택/해제</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {allPersonas.map((persona) => {
            const isSelected = selectedAgentIds.includes(persona.id);
            return (
              <button
                key={persona.id}
                onClick={() => handleToggleAgent(persona.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/60'
                }`}
              >
                <span className="text-sm">{persona.avatarIcon}</span>
                <span>{persona.koreanName}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Task Input Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <span>공통 협업 과제 및 프로젝트 지시사항</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeContext}
              onChange={(e) => setIncludeContext(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-indigo-500 bg-slate-950 border-slate-700"
            />
            <span>신상픽 DB 컨텍스트 연결</span>
          </label>
        </div>

        <textarea
          rows={3}
          value={taskPrompt}
          onChange={(e) => setTaskPrompt(e.target.value)}
          placeholder="예: 신상픽 2024 가을 시즌 한정 신제품(밤/고구마 디저트) 런칭을 위한 각 분야별 전략과 산출물을 작성해주세요."
          disabled={isExecuting}
          className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-200 text-xs resize-none outline-none"
        />

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500">
              선택된 {selectedAgentIds.length}명의 전문가에게 동시에 지시문이 전달됩니다.
            </span>
          </div>

          <button
            onClick={handleExecute}
            disabled={isExecuting || !taskPrompt.trim()}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            {isExecuting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>전문가들이 병렬 협업 중...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>동시 협업 실행 ({selectedAgentIds.length}명)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Header with Copy All Button */}
      {results.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                전문가별 동시 보고서 결과 ({results.length}건)
              </h3>
            </div>

            <button
              onClick={handleCopyAll}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>전체 보고서 복사됨!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>전체 보고서 통합 복사</span>
                </>
              )}
            </button>
          </div>

          {/* Grid of Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((item) => (
              <div
                key={item.agentId}
                className="rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col overflow-hidden relative"
              >
                {/* Result Card Header */}
                <div className="p-3.5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{item.avatarIcon}</span>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {item.agentName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.role}
                      </div>
                    </div>
                  </div>

                  {!item.isLoading && (
                    <button
                      onClick={() => handleCopySingle(item.agentId, item.output)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      title="이 전문가의 답변만 복사"
                    >
                      {copiedAgentId === item.agentId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Result Card Body */}
                <div className="p-4 flex-1 text-xs leading-relaxed overflow-y-auto max-h-[380px] font-sans whitespace-pre-wrap text-slate-300">
                  {item.isLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                      <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
                      <span className="text-xs">전문 분야 분석 보고서 작성 중...</span>
                    </div>
                  ) : (
                    item.output
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
