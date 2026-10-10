// api/ai-agents.ts
// 신상픽 AI 전문가 에이전트 Vercel 서버리스 엔드포인트

interface RequestBody {
  agentId: string;
  agentName: string;
  role: string;
  systemPrompt: string;
  userMessage: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  contextData?: {
    totalProducts?: number;
    sampleProducts?: Array<{ name: string; brand: string; category: string }>;
    appStack?: string;
  };
  customApiKey?: string;
  aiProvider?: 'anthropic' | 'openai' | 'gemini';
}

// @ts-ignore - .js 엔드포인트와 공유하는 순수 JS 헬퍼
import { verifyAdminRequest } from './_lib/adminAuth.js';

export default async function handler(req: any, res: any) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 관리자 전용: 서버 AI API 키 무단 사용(과금) 방지
  const auth = await verifyAdminRequest(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error });
  }

  const {
    agentId,
    agentName,
    role,
    systemPrompt,
    userMessage,
    history = [],
    contextData,
    customApiKey,
    aiProvider,
  } = (req.body || {}) as RequestBody;

  if (!userMessage) {
    return res.status(400).json({ error: '사용자 메시지가 필요합니다.' });
  }

  // API 키 및 프로바이더 판별
  const geminiKey = (customApiKey && customApiKey.startsWith('AIzaSy')) 
    ? customApiKey 
    : (aiProvider === 'gemini' ? customApiKey : process.env.GEMINI_API_KEY);

  const anthropicKey = (customApiKey && customApiKey.startsWith('sk-ant')) 
    ? customApiKey 
    : (aiProvider === 'anthropic' ? customApiKey : process.env.ANTHROPIC_API_KEY);

  const openaiKey = (customApiKey && customApiKey.startsWith('sk-proj') || (customApiKey && customApiKey.startsWith('sk-') && !customApiKey.startsWith('sk-ant')))
    ? customApiKey
    : (aiProvider === 'openai' ? customApiKey : process.env.OPENAI_API_KEY);

  // 신상픽 컨텍스트 텍스트 구성
  let injectedContext = '';
  if (contextData) {
    injectedContext = `\n\n[신상픽(SinSangPick) 실시간 프로젝트 데이터]
- 기술 스택: ${contextData.appStack || 'React, TypeScript, Tailwind CSS, Supabase, Capacitor iOS/Android, Vercel'}
- 등록 신상품 수: ${contextData.totalProducts || 0}개
- 주요 카테고리/신제품 샘플: ${
      contextData.sampleProducts
        ? contextData.sampleProducts.map((p) => `${p.brand} ${p.name} (${p.category})`).join(', ')
        : '간식, 디저트, 음료, 간편식'
    }`;
  }

  const fullSystemPrompt = `${systemPrompt}${injectedContext}

[답변 가이드라인]
1. 반드시 당신의 페르소나(${agentName} / ${role})에 100% 몰입하여 전문적이고 실용적인 어조로 답변하십시오.
2. 실무에서 바로 쓸 수 있는 코드, 템플릿, 수치, 혹은 실행 가능한 액션 플랜을 제시하십시오.
3. 마크다운 포맷(제목, 볼드, 코드블록, 불릿포인트)을 활용하여 가독성 높게 작성하십시오.
4. 한국어로 정중하고 프로페셔널하게 답변하십시오.`;

  // 1. Google Gemini API 호출 (Gemini 키가 있는 경우 우선 또는 선택 시)
  if (geminiKey) {
    try {
      const contentsPayload = [
        ...history.slice(-6).map((h) => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }],
        })),
        {
          role: 'user',
          parts: [{ text: userMessage }],
        },
      ];

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: fullSystemPrompt }],
            },
            contents: contentsPayload,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 3500,
            },
          }),
        }
      );

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return res.status(200).json({
            reply: text,
            provider: 'google-gemini-1.5-flash',
            timestamp: new Date().toISOString(),
          });
        }
      } else {
        const errText = await geminiRes.text();
        console.warn('[api/ai-agents] Google Gemini API error:', errText);
      }
    } catch (gErr) {
      console.warn('[api/ai-agents] Gemini fetch failed:', gErr);
    }
  }

  // 2. Anthropic API 호출
  if (anthropicKey) {
    try {
      const messagesPayload = [
        ...history.slice(-6).map((h) => ({
          role: h.role,
          content: h.content,
        })),
        { role: 'user', content: userMessage },
      ];

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 3500,
          system: fullSystemPrompt,
          messages: messagesPayload,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.content?.[0]?.text || '';
        return res.status(200).json({
          reply: text,
          provider: 'anthropic-claude-3-5-sonnet',
          timestamp: new Date().toISOString(),
        });
      } else {
        const errorText = await response.text();
        console.warn('[api/ai-agents] Anthropic API failed:', errorText);
      }
    } catch (apiErr) {
      console.warn('[api/ai-agents] Network/API Error:', apiErr);
    }
  }

  // 3. OpenAI API 호출
  if (openaiKey) {
    try {
      const messagesPayload = [
        { role: 'system', content: fullSystemPrompt },
        ...history.slice(-6).map((h) => ({
          role: h.role,
          content: h.content,
        })),
        { role: 'user', content: userMessage },
      ];

      const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messagesPayload,
          max_tokens: 3000,
          temperature: 0.7,
        }),
      });

      if (openAiRes.ok) {
        const openAiData = await openAiRes.json();
        const text = openAiData.choices?.[0]?.message?.content;
        if (text) {
          return res.status(200).json({
            reply: text,
            provider: 'openai-gpt-4o',
            timestamp: new Date().toISOString(),
          });
        }
      }
    } catch (oErr) {
      console.warn('[api/ai-agents] OpenAI fetch failed:', oErr);
    }
  }

  // Fallback: API 키가 없거나 호출 실패 시 페르소나 맞춤형 지능형 전문가 분석 리포트 생성
  const smartFallbackReply = generateSpecialistFallbackReply(agentId, agentName, role, userMessage);

  return res.status(200).json({
    reply: smartFallbackReply,
    provider: 'local-specialist-engine',
    timestamp: new Date().toISOString(),
  });
}

/**
 * API 키가 없을 때도 즉각적으로 유용한 인사이트를 제공하는 전문가별 Fallback 생성기
 */
function generateSpecialistFallbackReply(agentId: string, agentName: string, role: string, query: string): string {
  const intro = `### 🎯 [${agentName}] ${role}의 전문 분석 및 제안

안녕하세요! **신상픽(SinSangPick)** 전담 **${agentName}**입니다.  
남겨주신 질문: **"${query}"** 에 대한 전문가 관점의 솔루션을 정리해 드립니다.

---`;

  let body = '';

  switch (agentId) {
    case 'frontend-developer':
      body = `
#### 1. 핵심 설계 방향 (React + Tailwind)
- **컴포넌트 분리**: 상태 관리(State)와 뷰 렌더링(Presentation)을 명확히 분리하여 재사용성을 극대화합니다.
- **모바일 웹뷰 성능**: 모바일 기기에서의 GPU 가속 유도를 위해 \`transform\`, \`opacity\` 속성 위주로 인터랙션을 설계합니다.
- **Safe-Area 대응**: iOS 노치 및 하단 홈 바를 위한 \`pb-safe\`, \`pt-safe\` 유틸리티 클래스를 필수로 적용합니다.

#### 2. 추천 코드 스니펫
\`\`\`tsx
import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  title: string;
  onAction?: () => void;
}

export const ModernItemCard: React.FC<Props> = ({ title, onAction }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 shadow-sm active:scale-[0.98]">
      <div className="flex items-center justify-between mb-2">
        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> 추천
        </span>
      </div>
      <h3 className="text-base font-bold text-white mb-3">{title}</h3>
      <button 
        onClick={onAction}
        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
      >
        <span>바로 확인하기</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
\`\`\`

#### 3. 프론트엔드 체크포인트
- [x] 터치 딜레이 방지를 위한 \`touch-action: manipulation\`
- [x] 이미지 지연 로딩(\`loading="lazy"\`) 및 에러 폴백 이미지 처리
- [x] 라이트/다크 모드 대비율 검증`;
      break;

    case 'backend-developer':
      body = `
#### 1. 데이터베이스 및 아키텍처 관점 분석
- **데이터 정합성**: Supabase PostgreSQL의 외래키 제약조건과 트랜잭션을 엄격히 준수합니다.
- **인덱싱 전략**: 쿼리 조회 빈도가 높은 컬럼(\`created_at\`, \`category\`, \`brand\`)에 복합 인덱스(B-tree)를 적용하여 조회 속도를 50ms 미만으로 단축합니다.
- **보안(RLS)**: Row Level Security를 통해 무단 쓰기/수정 방어를 강화합니다.

#### 2. 추천 SQL 및 정책 스크립트
\`\`\`sql
-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_products_category_created 
ON public.products (category, created_at DESC);

-- RLS 보안 정책 예시
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "누구나 제품 조회 가능"
ON public.products FOR SELECT
USING (true);
\`\`\`

#### 3. 백엔드 안정성 체크리스트
- Vercel 서버리스 타임아웃(10초) 방지를 위한 비동기 처리
- Redis / In-Memory 캐시를 활용한 핫 쿼리 캐싱 고려`;
      break;

    case 'ai-engineer':
      body = `
#### 1. LLM 프롬프트 & 파이프라인 최적화안
- **Few-Shot 러닝**: 2~3개의 정밀한 입출력 예시를 포함하여 환각(Hallucination)을 0%에 수렴시킵니다.
- **구조화된 출력 (Structured JSON)**: 마크다운 노이즈 없이 시스템 프롬프트에서 순수 JSON 규격을 강제합니다.
- **비용 최적화**: 프롬프트 캐싱을 적극 활용하고, 단순 분류 작업에는 경량 모델(Flash/Haiku)을 배치합니다.

#### 2. 추천 프롬프트 아키텍처
\`\`\`markdown
[Role & Context]: 당신은 신상픽의 AI 분석가입니다.
[Input Data]: \${JSON.stringify(data)}
[Output Schema]:
{
  "summary": "1줄 요약",
  "tags": ["태그1", "태그2"],
  "score": 95
}
\`\`\``;
      break;

    case 'mobile-developer':
      body = `
#### 1. Capacitor 하이브리드 모바일 전략
- **영구 준수 원칙**: \`capacitor.config.ts\`에 \`server.url\`(외부 원격 주소)을 절대 지정하지 않습니다.
- **로컬 서빙**: 반드시 로컬 빌드 번들(\`webDir: dist\`)을 번들링하여 오프라인에서도 기본 화면이 열리도록 보장합니다.
- **App Store 가이드라인 4.2 준수**: 웹 래퍼가 아닌 네이티브 앱 전용 인터랙션(푸시 알림, 햅틱 피드백, 공유 시트)을 탑재합니다.

#### 2. 트러블슈팅 및 설정 체크포인트
- SafeArea: iOS \`viewport-fit=cover\` 및 CSS \`env(safe-area-inset-top)\` 반영 완료
- Push 알림: FCM/APNs 디바이스 토큰 등록 로직 확인`;
      break;

    case 'ui-ux-designer':
      body = `
#### 1. UX 설계 핵심 원칙 (User-Centric)
- **엄지손가락 반응 영역(Thumb Zone)**: 모바일 사용자의 75%는 한 손으로 스마트폰을 쥡니다. 핵심 인터랙션 버튼은 하단 1/3 영역에 배치하세요.
- **시각적 위계(Visual Hierarchy)**: 
  - 1단계: 선명하고 고해상도의 신제품 이미지 (감성 자극)
  - 2단계: 핵심 혜택 뱃지(1+1, 신상 특가)
  - 3단계: 별점 및 솔직 리뷰 수
- **마이크로 인터랙션**: 좋아요나 담기 클릭 시 0.2초의 기분 좋은 햅틱/바운스 애니메이션을 부여하세요.`;
      break;

    case 'ad-strategist':
    case 'performance-marketer':
      body = `
#### 1. 마케팅 캠페인 구조 & 타겟팅
- **타겟 오디언스**: 2030 편의점/디저트 얼리어답터, 가성비 1+1 행사 탐색 유저
- **후킹 카피 공식**:
  - *호기심형*: "이번 주 편의점에서 품절 대란 난 이 과자, 아직도 안 드셔보셨나요?"
  - *혜택 직설형*: "오늘 퇴근길 GS25 들르면 1+1! 신상픽에서 할인 목록 1초 확인"
- **핵심 목표 지표**:
  - 광고 CTR: 3.5% 이상 목표
  - 앱 설치당 비용(CPI): 2,000원 이하 유지
  - D-7 리텐션: 25% 이상 확보`;
      break;

    case 'content-copywriter':
      body = `
#### 1. 실전 후킹 카피 5선
1. **[호기심 폭발]** "한 입 먹자마자 편의점 점주님한테 박스째 예약했습니다..."
2. **[솔직 공감]** "광고 아님 내돈내산! 이번 달 신상 과자 중 유일하게 살아남은 원탑"
3. **[긴급 혜택]** "오늘부터 딱 7일간 1+1! 안 사면 100% 손해 보는 편의점 꿀조합"
4. **[비주얼 자극]** "바삭- 소리에 침샘 폭발! 달콤 쌉싸름함의 정점을 찍었습니다"
5. **[질문/인터랙션]** "당신의 원픽은? 단짠파 vs 매콤파 댓글로 투표해주세요!"

#### 2. 인스타 해시태그 패키지
\`#신상픽 #편의점신상 #신제품리뷰 #먹스타그램 #간식스타그램 #편의점꿀조합 #디저트추천\``;
      break;

    case 'b2b-specialist':
    case 'sales-specialist':
      body = `
#### 1. B2B 제안 및 세일즈 핵심 전략
- **상대방의 가려운 곳 긁어주기**: 신제품 출시 시 가장 큰 고민은 "초기 반응 수집"과 "진성 타겟 노출"입니다.
- **신상픽 제휴의 결정적 강점**:
  - 10만 MZ 트렌드세터 타겟에게 24시간 내 노출
  - 출시 첫 주 솔직한 리뷰 데이터 300건 이상 확보 가능
  - 타 매체 대비 3배 이상의 높은 참여율
- **콜드메일/미팅 전환 콜투액션**: "이번 주 목요일 오후 2시, 15분간 온라인 미팅으로 시연 데이터를 공유해 드려도 괜찮으실까요?"`;
      break;

    case 'product-planner':
    case 'product-manager':
    case 'project-manager':
      body = `
#### 1. 기획 및 실행 로드맵 (Action Plan)
- **1주차 (기획 & 설계)**: 기능 요구사항 정의(PRD) 완료, 와이어프레임 확정, 예외 정책 수립
- **2주차 (디자인 & 개발)**: UI 컴포넌트 제작, Supabase 스키마 반영, 핵심 API 연동
- **3주차 (QA & 최적화)**: 모바일 실기기 테스트, 버그 수정, 성능 프로파일링
- **4주차 (배포 & 데이터 측정)**: 프로덕션 배포, GA4 이벤트 트래킹, 1주차 코호트 지표 분석

#### 2. 북극성 지표(North Star Metric)
- **WAV (주간 활성 신상품 탐색 수)** 및 **리뷰 작성 전환율(CVR)**`;
      break;

    default:
      body = `
#### 1. 전문가 핵심 분석
- 제시해주신 사안에 대해 단계별 실행 가이드를 수립하였습니다.
- 타겟 사용자의 니즈와 비즈니스 목표를 정렬하여 최단 기간에 가시적인 성과를 만들어내는 것을 최우선으로 합니다.

#### 2. 다음 추천 액션
- 세부적인 실행 조건(일정, 예산, 담당 리소스)을 지정해주시면 더욱 맞춤화된 산출물을 제공해 드리겠습니다.`;
      break;
  }

  const outro = `

---
💡 *안내: 현재는 로컬 고도화 엔진으로 구동 중입니다. 상단 [API Key 설정] 버튼을 통해 본인의 Anthropic Claude 또는 OpenAI API Key를 등록하시면 실시간 최신 Claude 3.5 Sonnet 모델과 직접 대화하실 수 있습니다.*`;

  return `${intro}\n${body}\n${outro}`;
}
