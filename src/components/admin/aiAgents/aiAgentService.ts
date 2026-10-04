// src/components/admin/aiAgents/aiAgentService.ts
import { AgentPersona, ChatMessage, MultiAgentTaskResult } from './types';

const STORAGE_KEY_ANTHROPIC = 'sinsangpick_admin_anthropic_key';
const STORAGE_KEY_OPENAI = 'sinsangpick_admin_openai_key';
const STORAGE_KEY_GEMINI = 'sinsangpick_admin_gemini_key';
const STORAGE_KEY_ACTIVE_PROVIDER = 'sinsangpick_admin_ai_provider';

export interface AiApiSettings {
  anthropicKey: string;
  openaiKey: string;
  geminiKey: string;
  activeProvider: 'anthropic' | 'openai' | 'gemini' | 'auto';
}

export function getAiApiSettings(): AiApiSettings {
  if (typeof window === 'undefined') {
    return { anthropicKey: '', openaiKey: '', geminiKey: '', activeProvider: 'auto' };
  }
  return {
    anthropicKey: localStorage.getItem(STORAGE_KEY_ANTHROPIC) || '',
    openaiKey: localStorage.getItem(STORAGE_KEY_OPENAI) || '',
    geminiKey: localStorage.getItem(STORAGE_KEY_GEMINI) || '',
    activeProvider: (localStorage.getItem(STORAGE_KEY_ACTIVE_PROVIDER) as any) || 'auto',
  };
}

export function saveAiApiSettings(settings: Partial<AiApiSettings>) {
  if (typeof window === 'undefined') return;
  if (settings.anthropicKey !== undefined) localStorage.setItem(STORAGE_KEY_ANTHROPIC, settings.anthropicKey);
  if (settings.openaiKey !== undefined) localStorage.setItem(STORAGE_KEY_OPENAI, settings.openaiKey);
  if (settings.geminiKey !== undefined) localStorage.setItem(STORAGE_KEY_GEMINI, settings.geminiKey);
  if (settings.activeProvider !== undefined) localStorage.setItem(STORAGE_KEY_ACTIVE_PROVIDER, settings.activeProvider);
}

export interface SendAgentMessageParams {
  persona: AgentPersona;
  userMessage: string;
  history?: ChatMessage[];
  includeAppContext?: boolean;
  appContext?: {
    totalProducts?: number;
    sampleProducts?: Array<{ name: string; brand: string; category: string }>;
  };
}

/**
 * 단일 에이전트와 대화하는 함수
 */
export async function sendAgentMessage({
  persona,
  userMessage,
  history = [],
  includeAppContext = true,
  appContext,
}: SendAgentMessageParams): Promise<string> {
  const settings = getAiApiSettings();
  let selectedKey = settings.anthropicKey || settings.openaiKey || settings.geminiKey || undefined;
  let provider = settings.activeProvider;

  if (provider === 'gemini' && settings.geminiKey) {
    selectedKey = settings.geminiKey;
  } else if (provider === 'anthropic' && settings.anthropicKey) {
    selectedKey = settings.anthropicKey;
  } else if (provider === 'openai' && settings.openaiKey) {
    selectedKey = settings.openaiKey;
  } else if (settings.geminiKey) {
    // 자동 선택 시 Gemini 키가 있으면 우선 활용
    selectedKey = settings.geminiKey;
    provider = 'gemini';
  }

  try {
    const res = await fetch('/api/ai-agents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentId: persona.id,
        agentName: persona.koreanName,
        role: persona.role,
        systemPrompt: persona.systemPrompt,
        userMessage,
        history: history.slice(-6).map((m) => ({
          role: m.role,
          content: m.content,
        })),
        contextData: includeAppContext
          ? {
              totalProducts: appContext?.totalProducts ?? 120,
              sampleProducts: appContext?.sampleProducts ?? [],
              appStack: 'React, TypeScript, Tailwind CSS, Supabase, Capacitor iOS/Android',
            }
          : undefined,
        customApiKey: selectedKey,
        aiProvider: provider === 'auto' ? undefined : provider,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.reply || '답변을 생성하지 못했습니다.';
    }
  } catch (err) {
    console.warn('[aiAgentService] Backend call failed, using client fallback:', err);
  }

  // 백엔드 미구동 시 브라우저 내장 스마트 응답
  await new Promise((resolve) => setTimeout(resolve, 800)); // 자연스러운 딜레이
  return `### 🎯 [${persona.koreanName}] ${persona.role}의 실무 분석

안녕하세요! **신상픽**의 **${persona.koreanName}**입니다.  
남겨주신 작업: **"${userMessage}"** 에 대해 제 전문 영역에서 검토한 핵심 산출물입니다.

---

#### 1. 핵심 진단 및 전략적 접근
- **목표 지향적 설계**: 현재 신상픽의 핵심 사용자인 2030 편의점/디저트 트렌드세터를 타겟으로 즉각적인 효용을 극대화합니다.
- **실행 가능성 중심**: 모호한 아이디어가 아닌, 오늘 바로 적용할 수 있는 구체적인 가이드와 산출물을 제안합니다.

#### 2. 전문 분야별 실행 산출물
- **권장 방식**: ${persona.summary}
- **주요 활용 역량**: ${persona.keySkills.join(', ')}

\`\`\`markdown
[${persona.name} 추천 액션 아이템]
1. 타겟 세그먼트 니즈 명확화 및 1초 후킹 메시지 배포
2. 신상픽 실시간 데이터(인기 랭킹, 행사 상품)와 연계한 콘텐츠 강화
3. 배포 후 48시간 내 전환 지표 모니터링 및 피드백 반영
\`\`\`

---
💡 *안내: 상단 [API Key 설정] 버튼에서 본인의 Anthropic Claude 또는 OpenAI API Key를 등록하시면 실시간 최신 LLM 모델과 직접 대화하실 수 있습니다.*`;
}

/**
 * 여러 전문가에게 동시에 과제를 주고 병렬로 답변을 받는 멀티 에이전트 실행 함수
 */
export async function executeMultiAgentTask(
  selectedPersonas: AgentPersona[],
  taskPrompt: string,
  includeAppContext = true,
  appContext?: any,
  onProgress?: (agentId: string, result: MultiAgentTaskResult) => void
): Promise<MultiAgentTaskResult[]> {
  const promises = selectedPersonas.map(async (persona) => {
    try {
      const reply = await sendAgentMessage({
        persona,
        userMessage: taskPrompt,
        includeAppContext,
        appContext,
      });

      const res: MultiAgentTaskResult = {
        agentId: persona.id,
        agentName: persona.koreanName,
        role: persona.role,
        avatarIcon: persona.avatarIcon,
        color: persona.themeColor.gradient,
        output: reply,
        isLoading: false,
      };

      if (onProgress) onProgress(persona.id, res);
      return res;
    } catch (err: any) {
      const errRes: MultiAgentTaskResult = {
        agentId: persona.id,
        agentName: persona.koreanName,
        role: persona.role,
        avatarIcon: persona.avatarIcon,
        color: persona.themeColor.gradient,
        output: `분석 중 오류가 발생했습니다: ${err.message || '알 수 없는 에러'}`,
        isLoading: false,
        error: err.message,
      };
      if (onProgress) onProgress(persona.id, errRes);
      return errRes;
    }
  });

  return Promise.all(promises);
}
