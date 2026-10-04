// src/components/admin/aiAgents/PromptExportModal.tsx
import React, { useState } from 'react';
import { AgentPersona } from './types';
import {
  Copy,
  Check,
  X,
  ExternalLink,
  Sparkles,
  Layers,
  Terminal,
  Code2,
  FileText
} from 'lucide-react';

interface PromptExportModalProps {
  persona: AgentPersona | null;
  isOpen: boolean;
  onClose: () => void;
  appContext?: {
    totalProducts?: number;
    sampleProducts?: Array<{ name: string; brand: string; category: string }>;
  };
}

export const PromptExportModal: React.FC<PromptExportModalProps> = ({
  persona,
  isOpen,
  onClose,
  appContext,
}) => {
  const [includeContext, setIncludeContext] = useState(true);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<'claude' | 'chatgpt' | 'cursor' | 'copilot'>('claude');

  if (!isOpen || !persona) return null;

  // 컨텍스트 조합
  const contextSnippet = includeContext
    ? `\n\n[프로젝트 실시간 컨텍스트: 신상픽(SinSangPick)]
- 서비스: 대한민국 1등 식음료 신제품 큐레이션 및 편의점 행사 플랫폼
- 기술 스택: React(TypeScript), Tailwind CSS, Vite, Supabase, Capacitor 모바일 하이브리드 앱
- 등록된 신상품 수: ${appContext?.totalProducts || 120}개
- 주요 카테고리: 간식, 음료, 디저트, 간편식, 빵/베이커리`
    : '';

  // 도구별 완성형 프롬프트 생성
  const getPromptForTool = (tool: 'claude' | 'chatgpt' | 'cursor' | 'copilot') => {
    switch (tool) {
      case 'claude':
        return `당신은 ${persona.koreanName} (${persona.name})입니다.
${persona.role}

${persona.systemPrompt}${contextSnippet}

[작업 지시]
이 페르소나 그대로 100% 몰입하여 한국어로 답해줘.
실무에서 바로 쓸 수 있는 전문적이고 디테일한 결과물을 도출해줘.`;

      case 'chatgpt':
        return `당신은 이제부터 전문 [${persona.koreanName} (${persona.name})]로 행동합니다.
역할: ${persona.role}

[시스템 프롬프트]
${persona.systemPrompt}${contextSnippet}

위 페르소나와 원칙을 완벽히 지키며, 한국어로 프로페셔널하게 답변해주세요.`;

      case 'cursor':
        return `# .cursor/rules/${persona.id}.md
---
description: ${persona.koreanName} (${persona.role})
globs: *
---

${persona.systemPrompt}${contextSnippet}

When invoked with @${persona.id}, act strictly according to this persona in Korean. Provide clean, actionable, production-ready outputs.`;

      case 'copilot':
        return `<!-- .github/copilot-instructions.md -->
## Persona: ${persona.koreanName} (${persona.name})
Role: ${persona.role}

${persona.systemPrompt}${contextSnippet}

Always respond in Korean as this expert persona with practical examples.`;
    }
  };

  const handleCopy = (tool: 'claude' | 'chatgpt' | 'cursor' | 'copilot') => {
    const text = getPromptForTool(tool);
    navigator.clipboard.writeText(text);
    setCopiedType(tool);
    setTimeout(() => setCopiedType(null), 1800);
  };

  const currentPromptText = getPromptForTool(selectedTool);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{persona.avatarIcon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  {persona.koreanName} 페르소나 복사
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300">
                  {persona.categoryLabel}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{persona.role}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Bar */}
        <div className="py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 shrink-0">
          {/* Tool Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => setSelectedTool('claude')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedTool === 'claude'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Claude.ai (강추)</span>
            </button>
            <button
              onClick={() => setSelectedTool('chatgpt')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedTool === 'chatgpt'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>ChatGPT</span>
            </button>
            <button
              onClick={() => setSelectedTool('cursor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedTool === 'cursor'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Cursor</span>
            </button>
            <button
              onClick={() => setSelectedTool('copilot')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedTool === 'copilot'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>GitHub Copilot</span>
            </button>
          </div>

          {/* Context Injection Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300">
            <input
              type="checkbox"
              checked={includeContext}
              onChange={(e) => setIncludeContext(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
            />
            <span>신상픽 서비스 데이터 포함</span>
          </label>
        </div>

        {/* Step Guide Banner */}
        <div className="my-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-300 font-bold flex items-center justify-center text-[11px]">
              1
            </span>
            <span>
              {selectedTool === 'claude'
                ? '아래 프롬프트를 복사하여 Claude.ai 채팅창에 그대로 붙여넣고 작업을 지시하세요.'
                : selectedTool === 'chatgpt'
                ? '복사한 뒤 ChatGPT 새 대화창에 붙여넣고 질문하시면 됩니다.'
                : selectedTool === 'cursor'
                ? '복사하여 .cursor/rules 폴더 내 파일로 저장하거나 채팅창에 붙여넣으세요.'
                : '복사하여 .github/copilot-instructions.md 파일에 추가하세요.'}
            </span>
          </div>
          {selectedTool === 'claude' && (
            <a
              href="https://claude.ai"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[11px] text-amber-400 hover:underline shrink-0 ml-2"
            >
              <span>Claude 열기</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Code/Prompt Preview Box */}
        <div className="flex-1 min-h-[220px] overflow-hidden rounded-xl bg-slate-950 border border-slate-800 relative group">
          <textarea
            readOnly
            value={currentPromptText}
            className="w-full h-full p-4 bg-transparent text-slate-300 font-mono text-xs resize-none outline-none overflow-y-auto leading-relaxed select-all"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800 shrink-0">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>총 {currentPromptText.length.toLocaleString()}자</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              닫기
            </button>
            <button
              onClick={() => handleCopy(selectedTool)}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
            >
              {copiedType === selectedTool ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>복사되었습니다!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>원클릭 프롬프트 복사</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
