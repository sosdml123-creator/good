// src/components/admin/aiAgents/AgentDetailChatView.tsx
import React, { useState, useRef, useEffect } from 'react';
import { AgentPersona, ChatMessage } from './types';
import { sendAgentMessage } from './aiAgentService';
import {
  ArrowLeft,
  Send,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Share2
} from 'lucide-react';

interface AgentDetailChatViewProps {
  persona: AgentPersona;
  onBack: () => void;
  onOpenExportModal: () => void;
  appContext?: {
    totalProducts?: number;
    sampleProducts?: Array<{ name: string; brand: string; category: string }>;
  };
  onNotify?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const AgentDetailChatView: React.FC<AgentDetailChatViewProps> = ({
  persona,
  onBack,
  onOpenExportModal,
  appContext,
  onNotify,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // 초기 환영 메시지
    return [
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `안녕하세요! **${persona.koreanName} (${persona.name})**입니다.
${persona.role}를 담당하고 있습니다.

어떤 작업을 도와드릴까요? 아래 추천 질문을 클릭하시거나, 원하시는 업무를 편하게 말씀해 주세요!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentId: persona.id,
        agentName: persona.koreanName,
      },
    ];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [includeContext, setIncludeContext] = useState(true);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const replyText = await sendAgentMessage({
        persona,
        userMessage: text,
        history: [...messages, userMsg],
        includeAppContext: includeContext,
        appContext,
      });

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentId: persona.id,
        agentName: persona.koreanName,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      if (onNotify) onNotify(`답변 생성 실패: ${err.message || '네트워크 오류'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 1500);
  };

  const handleClearHistory = () => {
    if (window.confirm('대화 내역을 모두 초기화할까요?')) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          content: `대화가 초기화되었습니다. **${persona.koreanName}**에게 새로운 작업을 지시해 주세요.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agentId: persona.id,
          agentName: persona.koreanName,
        },
      ]);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Bar */}
      <div className="h-16 px-6 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="전문가 목록으로"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <span className="text-3xl">{persona.avatarIcon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white leading-tight">
                  {persona.koreanName}
                </h2>
                <span className="text-xs text-slate-400 font-normal">
                  ({persona.name})
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${persona.themeColor.badge}`}>
                  {persona.categoryLabel}
                </span>
              </div>
              <p className="text-xs text-slate-400">{persona.role}</p>
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Context toggle */}
          <label className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeContext}
              onChange={(e) => setIncludeContext(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-indigo-500 bg-slate-900 border-slate-700"
            />
            <span>신상픽 데이터 연결</span>
          </label>

          {/* Export to external tool button */}
          <button
            onClick={onOpenExportModal}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 transition-all"
            title="Claude / ChatGPT용 프롬프트 복사"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">프롬프트 내보내기</span>
          </button>

          {/* Clear history */}
          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="대화 내역 비우기"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        
        {/* Profile Card Banner */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>전문가 핵심 역량 & 스킬셋</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              {persona.description}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {persona.keySkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-700/60"
                >
                  #{skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="space-y-5">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shrink-0 shadow-sm">
                    {persona.avatarIcon}
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* Sender Name & Time */}
                  <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-400">
                    <span className="font-semibold">{isUser ? '관리자 (나)' : persona.koreanName}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`relative p-4 rounded-2xl text-xs leading-relaxed shadow-md group ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                    }`}
                  >
                    {/* Render Content */}
                    <div className="whitespace-pre-wrap break-words font-sans">
                      {msg.content}
                    </div>

                    {/* Copy Button */}
                    {!isUser && (
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="absolute right-2 top-2 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="답변 복사"
                      >
                        {copiedMsgId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start animate-in fade-in">
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shrink-0">
                {persona.avatarIcon}
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 rounded-tl-none flex items-center gap-2.5 text-xs text-slate-400">
                <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
                <span>{persona.koreanName} 전문가가 심도 깊은 답변을 작성하고 있습니다...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-6 py-2 bg-slate-900/40 border-t border-slate-800/60 overflow-x-auto shrink-0 flex items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> 추천 작업:
        </span>
        {persona.samplePrompts.map((sp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(sp.prompt)}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-indigo-600/20 hover:border-indigo-500/50 border border-slate-700/60 text-xs text-slate-300 hover:text-indigo-300 shrink-0 transition-all flex items-center gap-1.5"
          >
            <span>{sp.title}</span>
          </button>
        ))}
      </div>

      {/* Bottom Input Box */}
      <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/80 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative rounded-2xl bg-slate-950 border border-slate-800 focus-within:border-indigo-500 transition-all overflow-hidden flex flex-col"
        >
          <textarea
            ref={textareaRef}
            rows={3}
            placeholder={`${persona.koreanName}에게 지시할 작업을 입력하세요... (Shift+Enter 줄바꿈, Enter 전송)`}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
            className="w-full p-3.5 bg-transparent text-slate-200 placeholder:text-slate-500 text-xs resize-none outline-none"
          />

          <div className="px-3.5 pb-2.5 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Shift + Enter 줄바꿈 · Enter 전송
            </span>

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
            >
              <span>실행 요청</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
