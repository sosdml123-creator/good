// src/components/admin/aiAgents/ApiKeyModal.tsx
import React, { useState } from 'react';
import { Key, X, Check, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { getAiApiSettings, saveAiApiSettings, AiApiSettings } from './aiAgentService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSaved }) => {
  const currentSettings = getAiApiSettings();
  const [anthropicKey, setAnthropicKey] = useState(currentSettings.anthropicKey);
  const [openaiKey, setOpenaiKey] = useState(currentSettings.openaiKey);
  const [geminiKey, setGeminiKey] = useState(currentSettings.geminiKey);
  const [activeProvider, setActiveProvider] = useState<AiApiSettings['activeProvider']>(currentSettings.activeProvider);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    saveAiApiSettings({
      anthropicKey: anthropicKey.trim(),
      openaiKey: openaiKey.trim(),
      geminiKey: geminiKey.trim(),
      activeProvider,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onSaved();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                AI API Key 설정
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
              <p className="text-xs text-slate-400">
                본인의 API 키를 입력하면 최신 AI 모델과 직접 무제한 대화할 수 있습니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Note */}
        <div className="my-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-emerald-400">안전 보장:</span> 입력하신 API 키는 서버에 저장되지 않으며, 관리자 본인의 브라우저 로컬 저장소(LocalStorage)에만 안전하게 보관됩니다.
          </div>
        </div>

        {/* Priority AI Provider Selector */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            우선 사용할 AI 엔진:
          </label>
          <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
            {(['auto', 'anthropic', 'openai', 'gemini'] as const).map((prov) => (
              <button
                key={prov}
                type="button"
                onClick={() => setActiveProvider(prov)}
                className={`py-1.5 rounded-lg font-semibold capitalize transition-all ${
                  activeProvider === prov
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {prov === 'auto' ? '자동 선택' : prov}
              </button>
            ))}
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4 text-xs">
          {/* Anthropic Claude */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Anthropic API Key (Claude 3.5 Sonnet 권장)
              </label>
              <span className="text-[10px] text-amber-400/80 font-mono">sk-ant-...</span>
            </div>
            <input
              type="password"
              placeholder="sk-ant-api03-..."
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-200 placeholder:text-slate-600 outline-none font-mono text-xs"
            />
          </div>

          {/* OpenAI */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                OpenAI API Key (GPT-4o)
              </label>
              <span className="text-[10px] text-emerald-400/80 font-mono">sk-...</span>
            </div>
            <input
              type="password"
              placeholder="sk-proj-..."
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-200 placeholder:text-slate-600 outline-none font-mono text-xs"
            />
          </div>

          {/* Gemini */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Google Gemini API Key
              </label>
              <span className="text-[10px] text-blue-400/80 font-mono">AIzaSy...</span>
            </div>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-200 placeholder:text-slate-600 outline-none font-mono text-xs"
            />
          </div>
        </div>

        {/* Tip info */}
        <div className="mt-4 p-3 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-[11px] text-indigo-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>키를 입력하지 않아도 내장된 고성능 실무 시뮬레이션 엔진으로 자유롭게 테스트할 수 있습니다.</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>저장 완료!</span>
              </>
            ) : (
              <span>설정 저장하기</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
