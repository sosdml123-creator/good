// api/generate-content.ts
// 신상픽 인스타그램 카드뉴스 생성 Vercel 서버리스 함수
//
// 문구 작성 엔진은 설정된 키에 따라 자동 선택된다:
//   ANTHROPIC_API_KEY → Claude / GEMINI_API_KEY(무료 등급 가능) → Gemini / 둘 다 없으면 → 규칙 기반 자동 조합
// 어떤 엔진이든 상품 이미지·별점은 DB 값으로만 채운다.
//
//  POST   /api/generate-content            관리자: 요청문으로 카드뉴스 1세트 생성 + 이력 저장
//  GET    /api/generate-content            관리자: 저장된 생성 이력 목록
//  GET    /api/generate-content?daily=1    크론/관리자: 오늘의 자동 콘텐츠 5세트 생성 (매일 아침)
//  GET    /api/generate-content?status=1   공개: AI 키 / 저장소 준비 상태
//  DELETE /api/generate-content?id=...     관리자: 이력 삭제

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
// @ts-ignore - .js 엔드포인트와 공유하는 순수 JS 헬퍼
import { verifyAdminRequest } from './_lib/adminAuth.js';

const MODEL = 'claude-opus-5-5';
const DAILY_POST_COUNT = 5;
const TEMPLATE_TYPES = [
  'cover_new',
  'hook_photo',
  'review_card',
  'top5',
  'reels_cover',
  'rating_detail',
  'photo_dessert',
  'versus',
  'cta_app',
];

type AspectRatio = '1:1' | '4:5' | '9:16';

export interface CandidateProduct {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  image?: string;
  price?: number;
  releaseDate?: string;
  stores?: string[];
  description?: string;
  rating?: number | null;
  ratingCount?: number;
  detailedRating?: Record<string, number> | null;
  bestQuotes?: string[];
}

interface RequestBody {
  prompt?: string;
  templateMode?: string;
  aspectRatio?: AspectRatio;
  products?: CandidateProduct[];
}

const SYSTEM_PROMPT = `신상픽(SinSangPick)은 편의점·카페·식품 브랜드의 신제품을 모아 보여주는 한국 앱이고, 당신은 그 공식 인스타그램 계정의 콘텐츠 에디터입니다. 당신이 만든 JSON은 관리자 화면에서 카드 이미지로 렌더링되어 그대로 인스타그램에 올라갑니다.

[톤]
친근하고 트렌디한 구어체로 씁니다. 후크 문구는 짧고 임팩트 있게, 카드 한 장의 글자 수는 한눈에 읽히는 분량으로 유지합니다. 캡션에는 이모지를 자연스럽게 섞습니다.

[사실 규칙]
실제 고객에게 공개되는 계정이라 지어낸 정보는 허위 광고가 됩니다. 그래서:
- 제공된 상품 목록에 있는 상품만 등장시키고, 상품은 반드시 목록의 id로 지정합니다.
- 별점, 리뷰 수, 조회수, 판매량 같은 수치는 문구에 쓰지 않습니다. 별점과 상품 이미지는 서버가 DB 값으로 직접 채웁니다.
- 맛·특징 묘사는 상품의 description과 quotes에 있는 내용 범위에서 씁니다. 정보가 부족한 상품은 "궁금한 신상"처럼 기대감 위주로 씁니다.

[템플릿과 props]
슬라이드마다 templateType 하나와 그에 맞는 props를 씁니다. 줄바꿈은 \\n 으로 넣습니다.
- cover_new (노란 표지): { title1: 상단 작은 카피(15자 이내), title2: 큰 타이틀(8자 이내), handwriting: 손글씨 문구(3줄 이내) }
- hook_photo (상품 사진 풀배경 후크): { productId, badge, hookTitle: 2줄 이내, subText: 2줄 이내 }
- review_card (상품 소개 카드): { productId, displayName, badge, description: 2줄 이내, recommendations: 추천 대상 3개, handwriting: 짧은 한마디 }
- top5 (랭킹 리스트): { badge, title, subText, productIds: 상품 id 5개(순위 순) }
- reels_cover (릴스 커버, 사진 풀배경): { productId, stickerText: 2줄 이내 }
- rating_detail (세부 별점 카드): { productId, displayName, badge, quote: 한줄평 } — "rating"이 있는 상품에만 사용합니다.
- photo_dessert (감성 사진 카드): { productId, badge, handwriting, title, description }
- versus (두 상품 비교): { productIds: 상품 id 2개, badge, question: 2줄 이내, buttonText }
- cta_app (앱 유도 마지막 장): { handwriting: 2줄 이내, buttonText }

displayName은 화면에 보일 상품명입니다. 목록의 name에 "삼)", "[ICE]" 같은 유통 코드나 군더더기가 붙어 있으면 뺀 이름을 쓰고, 그 밖에는 name 그대로 둡니다.

[구성 가이드]
- 신상 소개 캐러셀: cover_new → hook_photo → review_card → (별점 있는 상품이면 rating_detail) → cta_app
- 랭킹: cover_new → top5 → cta_app
- 비교: cover_new → versus → 각 상품 review_card → cta_app
- 릴스 커버: reels_cover 1장
요청에 특정 템플릿이 지정되어 있으면 그 템플릿을 중심으로 구성합니다.

[출력]
아래 형태의 JSON 객체 하나만 출력합니다. 코드블록이나 설명 문장은 붙이지 않습니다.
{
  "title": "관리자 목록에 보일 한 줄 제목",
  "caption": "인스타그램 캡션 (3줄 이상, 줄바꿈 포함, 마지막에 프로필 링크의 신상픽 앱 안내)",
  "hashtags": ["#신상픽", ... 총 15개],
  "slides": [{ "templateType": "...", "props": { ... } }]
}`;

// ---------------------------------------------------------------------------
// 순수 헬퍼 (단위 테스트 대상)
// ---------------------------------------------------------------------------

/** 한국 시간 기준 날짜 (YYYY-MM-DD) */
export function kstDateString(now: Date = new Date()): string {
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** 모델 응답 텍스트에서 JSON 객체를 추출 */
export function extractJsonObject(text: string): any {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) {
    throw new Error('AI 응답에서 JSON을 찾지 못했습니다.');
  }
  return JSON.parse(text.slice(start, end + 1));
}

const str = (v: unknown, fallback = ''): string => (typeof v === 'string' && v.trim() ? v.trim() : fallback);

/** 편의점 원본 상품명 앞의 분류 코드("삼)", "햄)" 등)를 떼어낸 표시용 이름 */
export const cleanName = (name: string): string => name.replace(/^[가-힣A-Za-z]{1,3}\)\s*/, '').trim() || name;

const hasRating = (p: CandidateProduct): boolean =>
  typeof p.rating === 'number' && p.rating > 0 && (p.ratingCount || 0) > 0;

const DETAILED_RATING_LABELS: Array<[string, string]> = [
  ['taste', '맛'],
  ['value', '가성비'],
  ['portion', '양'],
  ['repurchase', '재구매'],
];

/**
 * 모델이 쓴 슬라이드를 렌더링용 props로 확정한다.
 * 상품 이미지·브랜드·별점은 모델 출력이 아니라 상품 데이터에서만 채우고,
 * 필요한 상품이 없는 슬라이드는 버린다. 값이 없는 수치는 null로 두어 템플릿 기본 예시값이 노출되지 않게 한다.
 */
export function finalizeSlides(rawSlides: any[], products: CandidateProduct[], idPrefix: string) {
  const byId = new Map(products.map((p) => [String(p.id), p]));
  const find = (id: unknown) => (id == null ? undefined : byId.get(String(id)));
  const out: Array<{ templateType: string; props: any }> = [];

  for (const raw of Array.isArray(rawSlides) ? rawSlides : []) {
    const type = raw?.templateType;
    const p = raw?.props || {};
    if (!TEMPLATE_TYPES.includes(type)) continue;

    const product = find(p.productId);
    const displayName = product ? str(p.displayName, cleanName(product.name)) : '';

    switch (type) {
      case 'cover_new':
        out.push({
          templateType: type,
          props: {
            title1: str(p.title1, '지금, 가장 새로운 맛'),
            title2: str(p.title2, '신상픽'),
            handwriting: str(p.handwriting),
          },
        });
        break;

      case 'hook_photo':
        if (!product?.image) break;
        out.push({
          templateType: type,
          props: {
            badge: str(p.badge, 'NEW'),
            hookTitle: str(p.hookTitle, displayName),
            subText: str(p.subText),
            tag: '신상픽',
            pageIndicator: null,
            bgImage: product.image,
          },
        });
        break;

      case 'review_card':
        if (!product) break;
        out.push({
          templateType: type,
          props: {
            badge: str(p.badge, 'NEW'),
            brand: product.brand || '',
            productName: displayName,
            rating: hasRating(product) ? product.rating : null,
            reviewCount: hasRating(product) ? (product.ratingCount as number).toLocaleString('ko-KR') : null,
            description: str(p.description),
            recommendationTitle: '이런 분께 추천해요',
            recommendations: (Array.isArray(p.recommendations) ? p.recommendations : [])
              .map((r: unknown) => str(r))
              .filter(Boolean)
              .slice(0, 3),
            productImage: product.image || null,
            handwriting: str(p.handwriting),
          },
        });
        break;

      case 'top5': {
        const items = (Array.isArray(p.productIds) ? p.productIds : [])
          .map(find)
          .filter((x: CandidateProduct | undefined): x is CandidateProduct => !!x)
          .filter((x: CandidateProduct, i: number, arr: CandidateProduct[]) => arr.indexOf(x) === i)
          .slice(0, 5);
        if (items.length < 3) break;
        out.push({
          templateType: type,
          props: {
            badge: str(p.badge, 'THIS WEEK'),
            title: str(p.title, '이번 주 신상'),
            subText: str(p.subText),
            items: items.map((it: CandidateProduct, i: number) => ({
              rank: i + 1,
              name: cleanName(it.name),
              category: it.category || '',
              image: it.image || '',
            })),
          },
        });
        break;
      }

      case 'reels_cover':
        if (!product?.image) break;
        out.push({
          templateType: type,
          props: {
            stickerText: str(p.stickerText, displayName),
            bgImage: product.image,
            stickerTag: '신상픽',
            viewsCount: null,
          },
        });
        break;

      case 'rating_detail': {
        if (!product || !hasRating(product) || !product.detailedRating) break;
        const ratings = DETAILED_RATING_LABELS.filter(
          ([key]) => typeof product.detailedRating![key] === 'number'
        ).map(([key, label]) => ({ label, score: product.detailedRating![key] }));
        if (ratings.length === 0) break;
        out.push({
          templateType: type,
          props: {
            badge: str(p.badge, 'NEW'),
            brand: product.brand || '',
            productName: displayName,
            ratings,
            quote: str(p.quote),
            productImage: product.image || null,
          },
        });
        break;
      }

      case 'photo_dessert':
        if (!product?.image) break;
        out.push({
          templateType: type,
          props: {
            handwriting: str(p.handwriting),
            badge: str(p.badge, 'NEW'),
            title: str(p.title, displayName),
            description: str(p.description),
            bgImage: product.image,
          },
        });
        break;

      case 'versus': {
        const [a, b] = (Array.isArray(p.productIds) ? p.productIds : []).map(find);
        if (!a || !b || a === b) break;
        out.push({
          templateType: type,
          props: {
            badge: str(p.badge, '신상 비교'),
            question: str(p.question, '어떤 게 더 맛있을까?'),
            product1: { name: cleanName(a.name), image: a.image || '' },
            product2: { name: cleanName(b.name), image: b.image || '' },
            buttonText: str(p.buttonText, '앱에서 투표하기 →'),
          },
        });
        break;
      }

      case 'cta_app':
        out.push({
          templateType: type,
          props: {
            handwriting: str(p.handwriting, '더 많은 신상이\n궁금하다면?'),
            buttonText: str(p.buttonText, '앱에서 만나요 →'),
          },
        });
        break;
    }
  }

  return out.map((s, idx) => ({
    id: `${idPrefix}-s${idx + 1}`,
    templateType: s.templateType,
    props: s.templateType === 'hook_photo' ? { ...s.props, pageIndicator: `${idx + 1}/${out.length}` } : s.props,
  }));
}

/** 슬라이드에 실제로 쓰인 상품 id (다음 날 중복 방지용) */
function usedProductIds(rawSlides: any[], products: CandidateProduct[]): string[] {
  const known = new Set(products.map((p) => String(p.id)));
  const ids = new Set<string>();
  for (const s of Array.isArray(rawSlides) ? rawSlides : []) {
    const p = s?.props || {};
    [p.productId, ...(Array.isArray(p.productIds) ? p.productIds : [])].forEach((id) => {
      if (id != null && known.has(String(id))) ids.add(String(id));
    });
  }
  return [...ids];
}

/** 모델에게 보여줄 상품 목록 (이미지 URL은 넘기지 않는다) */
function describeProducts(products: CandidateProduct[]): string {
  return products
    .map((p) =>
      JSON.stringify({
        id: p.id,
        name: p.name,
        brand: p.brand || undefined,
        category: p.category || undefined,
        price: p.price || undefined,
        releaseDate: p.releaseDate || undefined,
        stores: p.stores?.length ? p.stores : undefined,
        rating: hasRating(p) ? `${p.rating} (${p.ratingCount}명)` : undefined,
        hasImage: !!p.image,
        description: p.description ? p.description.slice(0, 160) : undefined,
        quotes: p.bestQuotes?.length ? p.bestQuotes.slice(0, 2) : undefined,
      })
    )
    .join('\n');
}

// ---------------------------------------------------------------------------
// Claude 호출
// ---------------------------------------------------------------------------

type Engine = { provider: 'anthropic'; client: Anthropic } | { provider: 'gemini'; apiKey: string };

/** 설정된 키에 맞는 문구 작성 엔진. 키가 하나도 없으면 null (규칙 기반 조합 사용) */
function getEngine(): Engine | null {
  if (process.env.ANTHROPIC_API_KEY) {
    return { provider: 'anthropic', client: new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) };
  }
  if (process.env.GEMINI_API_KEY) {
    return { provider: 'gemini', apiKey: process.env.GEMINI_API_KEY.trim() };
  }
  return null;
}

interface AskOptions {
  maxTokens: number;
  timeoutMs: number;
  system?: string;
}

function askModelForJson(engine: Engine, userMessage: string, opts: AskOptions): Promise<any> {
  return engine.provider === 'anthropic'
    ? askClaudeForJson(engine.client, userMessage, opts)
    : askGeminiForJson(engine.apiKey, userMessage, opts);
}

async function askGeminiForJson(apiKey: string, userMessage: string, opts: AskOptions): Promise<any> {
  // 'gemini-flash-latest'는 구글이 최신 Flash 모델로 연결해 주는 별칭이라 모델 종료에 영향받지 않는다
  const model = process.env.GEMINI_MODEL || 'gemini-flash-latest';
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
      signal: AbortSignal.timeout(opts.timeoutMs),
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: opts.system ?? SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: { responseMimeType: 'application/json', maxOutputTokens: opts.maxTokens },
      }),
    }
  );

  if (!response.ok) {
    const body = (await response.text()).slice(0, 300);
    if (response.status === 429) {
      throw new Error('Gemini 무료 사용량 한도에 걸렸습니다. 잠시 후 다시 시도해주세요.');
    }
    if (response.status === 400 || response.status === 403) {
      throw new Error(`GEMINI_API_KEY가 올바르지 않거나 사용할 수 없습니다 (${response.status}): ${body}`);
    }
    throw new Error(`Gemini API 오류 (${response.status}): ${body}`);
  }

  const data = await response.json();
  const candidate = data?.candidates?.[0];
  const text = (candidate?.content?.parts || []).map((part: any) => part?.text || '').join('');
  if (!text) {
    const reason = candidate?.finishReason || data?.promptFeedback?.blockReason || '빈 응답';
    throw new Error(`Gemini가 응답을 만들지 못했습니다 (${reason}). 다시 시도해주세요.`);
  }
  return extractJsonObject(text);
}

async function askClaudeForJson(client: Anthropic, userMessage: string, opts: AskOptions): Promise<any> {
  const response = await client.beta.messages.create(
    {
      model: MODEL,
      max_tokens: opts.maxTokens,
      system: opts.system ?? SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
      // 카피 작성은 깊은 추론이 필요 없고, 함수 실행 시간(60초) 안에 끝나야 한다
      output_config: { effort: 'low' },
      // 안전 분류기가 요청을 거절하면 Anthropic 권장 모델로 서버에서 재시도
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
    },
    { timeout: opts.timeoutMs, maxRetries: 0 }
  );

  if (response.stop_reason === 'refusal') {
    throw new Error('AI가 이 요청의 생성을 거절했습니다. 요청 문구를 바꿔 다시 시도해주세요.');
  }
  if (response.stop_reason === 'max_tokens') {
    throw new Error('AI 응답이 길이 제한에 걸려 중간에 끊겼습니다. 다시 시도해주세요.');
  }

  const text = response.content
    .map((block) => (block.type === 'text' ? block.text : ''))
    .join('');
  return extractJsonObject(text);
}

function describeAiError(error: unknown): string {
  if (error instanceof Anthropic.AuthenticationError) {
    return 'ANTHROPIC_API_KEY가 올바르지 않습니다. Vercel 환경변수를 확인해주세요.';
  }
  if (error instanceof Anthropic.PermissionDeniedError) {
    return '이 ANTHROPIC_API_KEY로는 해당 모델을 사용할 수 없습니다.';
  }
  if (error instanceof Anthropic.RateLimitError) {
    return 'AI 사용량 한도에 걸렸습니다. 잠시 후 다시 시도해주세요.';
  }
  if (error instanceof Anthropic.APIConnectionTimeoutError) {
    return 'AI 응답이 제한 시간 안에 오지 않았습니다. 다시 시도해주세요.';
  }
  if (error instanceof Anthropic.APIError) {
    return `AI API 오류 (${error.status ?? '연결 실패'}): ${error.message}`;
  }
  if (error instanceof Error && error.name === 'TimeoutError') {
    return 'AI 응답이 제한 시간 안에 오지 않았습니다. 다시 시도해주세요.';
  }
  return error instanceof Error ? error.message : '알 수 없는 오류';
}

interface GenerateArgs {
  id: string;
  brief: string;
  templateMode: string;
  aspectRatio: AspectRatio;
  products: CandidateProduct[];
  timeoutMs: number;
}

/** 모델(또는 규칙)이 만든 초안을 렌더링 가능한 패키지로 확정 */
function assemblePackage(args: Omit<GenerateArgs, 'templateMode' | 'timeoutMs'>, draft: any) {
  const slides = finalizeSlides(draft?.slides, args.products, args.id);
  if (slides.length === 0) {
    throw new Error('사용할 수 있는 슬라이드를 만들지 못했습니다. 상품을 바꾸거나 다시 시도해주세요.');
  }

  return {
    id: args.id,
    title: str(draft.title, args.brief.slice(0, 60)),
    prompt: args.brief,
    aspectRatio: args.aspectRatio,
    caption: str(draft.caption),
    hashtags: (Array.isArray(draft.hashtags) ? draft.hashtags : [])
      .map((h: unknown) => str(h))
      .filter(Boolean)
      .slice(0, 15),
    slides,
    productIds: usedProductIds(draft?.slides, args.products),
    created_at: new Date().toISOString(),
  };
}

async function generatePackage(engine: Engine, args: GenerateArgs) {
  const userMessage = `[요청]
${args.brief}

[템플릿 지정]
${args.templateMode === 'auto' ? '지정 없음 — 요청에 가장 어울리는 구성으로' : args.templateMode}

[비율]
${args.aspectRatio}

[사용할 수 있는 상품 목록] (한 줄에 하나)
${describeProducts(args.products)}`;

  const draft = await askModelForJson(engine, userMessage, { maxTokens: 8000, timeoutMs: args.timeoutMs });
  return { ...assemblePackage(args, draft), engine: engine.provider };
}

// ---------------------------------------------------------------------------
// 규칙 기반 자동 조합 (AI 키가 없을 때) — 문구는 정해진 틀, 내용은 전부 DB의 실제 상품 데이터
// ---------------------------------------------------------------------------

export type RuleKind = 'spotlight' | 'top5' | 'versus' | 'reels' | 'curation';

const pickBy = <T,>(items: T[], seed: number): T => items[Math.abs(seed) % items.length];

/** 수집 과정에서 한 글자로 잘못 들어간 브랜드("삼" 등)는 문구에 쓰지 않는다 */
const brandOf = (p: CandidateProduct): string => ((p.brand || '').trim().length >= 2 ? (p.brand as string).trim() : '');

/** "브랜드 상품명" (상품명에 이미 브랜드가 들어 있으면 상품명만) */
const fullName = (p: CandidateProduct): string => {
  const name = cleanName(p.name);
  const brand = brandOf(p);
  return brand && !name.includes(brand) ? `${brand} ${name}` : name;
};

const firstSentence = (text?: string): string => {
  const t = (text || '').trim();
  // "[CU 공식 신상품] ..." 같은 수집기 자동 문구는 상품 설명이 아니므로 쓰지 않는다
  if (!t || t.startsWith('[')) return '';
  const cut = t.split(/(?<=[.!?])\s/)[0];
  return cut.length > 70 ? `${cut.slice(0, 68)}…` : cut;
};

const BASE_HASHTAGS = [
  '#신상픽', '#신상', '#신제품', '#편의점신상', '#신상리뷰', '#먹스타그램', '#간식추천', '#신상추천',
  '#오늘뭐먹지', '#맛스타그램', '#편의점추천', '#신메뉴', '#내돈내산', '#먹킷리스트', '#푸드스타그램',
];

function buildHashtags(products: CandidateProduct[]): string[] {
  const tag = (v?: string) => (v ? `#${v.replace(/[^가-힣A-Za-z0-9]/g, '')}` : '');
  const own = products.flatMap((p) => {
    const brand = brandOf(p);
    return [tag(brand), brand ? `${tag(brand)}신상` : '', tag(p.category)];
  });
  return [...new Set(['#신상픽', ...own, ...BASE_HASHTAGS].filter((t) => t.length > 1))].slice(0, 15);
}

const CAPTION_OUTRO = "더 많은 신상과 솔직한 리뷰는 프로필 링크 '신상픽' 앱에서 확인하세요!";
const CTA_SLIDE = { templateType: 'cta_app', props: {} };

const reviewSlide = (p: CandidateProduct, seed: number) => ({
  templateType: 'review_card',
  props: {
    productId: p.id,
    description: firstSentence(p.description) || `${p.category || '화제의'} 신상, 어떤 맛일지 궁금하다면?`,
    recommendations: [
      `${p.category || '새로운'} 신상을 기다려온 분`,
      '새로운 맛을 누구보다 먼저 맛보고 싶은 분',
      p.stores?.length ? `${p.stores[0]} 자주 가는 분` : '오늘 뭐 먹을지 고민인 분',
    ],
    handwriting: pickBy(['이건\n먹어봐야 해!', '궁금하면\n바로 픽!', '오늘의\n신상 픽'], seed),
  },
});

/**
 * 규칙 기반 초안 (모델 출력과 같은 형태: title/caption/hashtags/slides).
 * 상품 수가 kind에 필요한 만큼 없으면 null.
 */
export function buildRuleDraft(kind: RuleKind, products: CandidateProduct[], seed: number): any | null {
  const [a, b] = products;
  if (!a) return null;
  const nameA = cleanName(a.name);
  const hashtags = buildHashtags(products);

  switch (kind) {
    case 'spotlight': {
      const brand = brandOf(a);
      const title = `${brand && !nameA.includes(brand) ? `${brand} ` : ''}신상 ${nameA}`;
      return {
        title,
        hashtags,
        caption: [
          `🔥 ${title} 나왔어요!`,
          '',
          firstSentence(a.description) || '따끈따끈한 신상, 어떤 맛일지 궁금하지 않나요?',
          a.stores?.length ? `📍 만날 수 있는 곳: ${a.stores.join(', ')}` : '',
          '',
          '먹어본 분들은 댓글로 솔직 후기 남겨주세요 👇',
          CAPTION_OUTRO,
        ].filter((line, i, arr) => line || arr[i - 1]).join('\n'),
        slides: [
          {
            templateType: 'cover_new',
            props: {
              title1: pickBy(['오늘의 신상', '지금 막 나온 신상', '이번 주 주목 신상'], seed),
              title2: '신상픽',
              handwriting: pickBy(['이거\n나왔대!', '신상\n도착!', '오늘은\n이거다'], seed + 1),
            },
          },
          {
            templateType: 'hook_photo',
            props: {
              productId: a.id,
              hookTitle: brand ? `${brand}에\n이거 나왔어요!` : '따끈따끈한\n신상 도착!',
              subText: `${nameA}\n같이 확인해봐요`,
            },
          },
          reviewSlide(a, seed),
          { templateType: 'rating_detail', props: { productId: a.id, quote: a.bestQuotes?.[0] || '' } },
          CTA_SLIDE,
        ],
      };
    }

    case 'top5': {
      // 순위는 실제 별점이 있는 상품만으로, 별점 순으로 매긴다
      const top = products.filter(hasRating).sort((x, y) => ratingScore(y) - ratingScore(x)).slice(0, 5);
      if (top.length < 3) return null;
      const title = `신상 TOP ${top.length}`;
      return {
        title,
        hashtags,
        caption: [
          `🏆 신상픽 유저 별점으로 뽑은 ${title}`,
          '',
          ...top.map((p, i) => `${i + 1}위 ${fullName(p)}`),
          '',
          '여러분의 원픽은 몇 위인가요? 댓글로 알려주세요 👇',
          CAPTION_OUTRO,
        ].join('\n'),
        slides: [
          { templateType: 'cover_new', props: { title1: '신상픽 유저가 뽑은', title2: `TOP ${top.length}`, handwriting: '별점으로\n줄 세워봄' } },
          {
            templateType: 'top5',
            props: { badge: 'RANKING', title, subText: '신상픽 유저 별점 기준', productIds: top.map((p) => p.id) },
          },
          CTA_SLIDE,
        ],
      };
    }

    case 'versus': {
      if (!b) return null;
      const nameB = cleanName(b.name);
      const title = `${nameA} VS ${nameB}`;
      return {
        title,
        hashtags,
        caption: [
          `⚔️ ${a.category || '신상'} 맞대결! ${title}`,
          '',
          '둘 중 하나만 고른다면, 여러분의 선택은?',
          '댓글로 투표해주세요 👇',
          CAPTION_OUTRO,
        ].join('\n'),
        slides: [
          { templateType: 'cover_new', props: { title1: `${a.category || '신상'} 맞대결`, title2: 'VS', handwriting: '둘 중\n뭐 먹지?' } },
          { templateType: 'versus', props: { productIds: [a.id, b.id], question: '둘 중 하나만 고른다면\n당신의 선택은?', buttonText: '댓글로 투표하기 →' } },
          reviewSlide(a, seed),
          reviewSlide(b, seed + 1),
          CTA_SLIDE,
        ],
      };
    }

    case 'reels':
      return {
        title: `릴스 커버 · ${nameA}`,
        hashtags,
        caption: [
          `👀 ${fullName(a)}, 다들 보셨나요?`,
          '',
          firstSentence(a.description) || '요즘 눈에 띄는 신상, 영상으로 먼저 만나보세요.',
          '',
          CAPTION_OUTRO,
        ].join('\n'),
        slides: [
          {
            templateType: 'reels_cover',
            props: { productId: a.id, stickerText: pickBy(['이거\n오늘 처음 봤어요!', '이 신상\n나만 몰랐어?', '지금 난리난\n신상'], seed) },
          },
        ],
      };

    case 'curation': {
      if (products.length < 3) return null;
      const group = products.slice(0, 4);
      const category = a.category || '신상';
      const title = `요즘 ${category} 신상 모아보기`;
      return {
        title,
        hashtags,
        caption: [
          `🧺 ${title}`,
          '',
          ...group.map((p) => `· ${fullName(p)}`),
          '',
          '이 중에 먹어본 거 있나요? 댓글로 알려주세요 👇',
          CAPTION_OUTRO,
        ].join('\n'),
        slides: [
          { templateType: 'cover_new', props: { title1: `요즘 ${category} 신상`, title2: '모아보기', handwriting: `${group.length}개만\n기억해!` } },
          ...group.map((p, i) => reviewSlide(p, seed + i)),
          CTA_SLIDE,
        ],
      };
    }
  }
}

const ratingScore = (p: CandidateProduct) => (p.rating || 0) * Math.log((p.ratingCount || 0) + 1);

/** 후보 목록에서 kind에 맞는 상품을 고른다. taken에 든 상품은 건너뛰고, 고른 상품은 taken에 넣는다 */
function selectForKind(kind: RuleKind, pool: CandidateProduct[], taken: Set<string>, seed: number): CandidateProduct[] {
  // 같은 상품이 DB에 두 번 들어 있는 경우가 있어 이름 기준으로 한 번만 쓴다
  const seenNames = new Set<string>();
  const free = pool.filter((p) => !taken.has(p.id) && !seenNames.has(fullName(p)) && !!seenNames.add(fullName(p)));
  const withImage = free.filter((p) => p.image);
  const byCategory = (items: CandidateProduct[], min: number, sameBrand = false) => {
    const groups = new Map<string, CandidateProduct[]>();
    items.forEach((p) => {
      if (!p.category || (sameBrand && !brandOf(p))) return;
      const key = sameBrand ? `${p.category}|${brandOf(p)}` : p.category;
      groups.set(key, [...(groups.get(key) || []), p]);
    });
    const eligible = [...groups.values()].filter((g) => g.length >= min);
    return eligible.length ? pickBy(eligible, seed) : [];
  };

  let chosen: CandidateProduct[] = [];
  if (kind === 'spotlight' || kind === 'reels') chosen = withImage.slice(0, 1);
  if (kind === 'top5') chosen = free.filter(hasRating).sort((x, y) => ratingScore(y) - ratingScore(x)).slice(0, 5);
  // 비교는 같은 브랜드의 같은 카테고리 상품끼리 붙여야 말이 된다
  if (kind === 'versus') chosen = byCategory(withImage, 2, true).slice(0, 2);
  if (kind === 'curation') chosen = byCategory(free, 3).slice(0, 4);

  chosen.forEach((p) => taken.add(p.id));
  return chosen;
}

const DAILY_RULE_KINDS: RuleKind[] = ['spotlight', 'top5', 'versus', 'reels', 'curation'];

/** AI 없이 오늘의 콘텐츠 5세트를 조합 */
export function buildDailyByRules(candidates: CandidateProduct[], recentlyUsed: string[], date: string) {
  const seed = Number(date.replace(/-/g, ''));
  // 최근에 다룬 상품은 피하되, 그러면 후보가 너무 줄어드는 경우에는 전체에서 고른다
  const fresh = candidates.filter((p) => !recentlyUsed.includes(p.id));
  const pool = fresh.length >= 15 ? fresh : candidates;
  const taken = new Set<string>();

  return DAILY_RULE_KINDS.flatMap((kind, idx) => {
    const products = selectForKind(kind, pool, taken, seed + idx);
    const draft = buildRuleDraft(kind, products, seed + idx);
    if (!draft) return [];
    try {
      const pkg = assemblePackage(
        { id: `daily-${date}-${idx + 1}`, brief: draft.title, aspectRatio: kind === 'reels' ? '9:16' : '1:1', products },
        draft
      );
      return [{ ...pkg, engine: 'rules', source: 'daily', dailyDate: date }];
    } catch {
      return [];
    }
  });
}

/** 요청문/템플릿 지정에서 규칙 기반 구성 종류를 정한다 */
function ruleKindFor(prompt: string, templateMode: string, productCount: number): RuleKind {
  if (templateMode === 'top5' || /TOP|탑\s?5|랭킹|순위/i.test(prompt)) return 'top5';
  if (templateMode === 'versus' || /VS|비교|대결/i.test(prompt)) return 'versus';
  if (templateMode === 'reels_cover' || /릴스|숏폼/.test(prompt)) return 'reels';
  return productCount >= 3 ? 'curation' : 'spotlight';
}

// ---------------------------------------------------------------------------
// Supabase (상품 조회 / 이력 저장)
// ---------------------------------------------------------------------------

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const key = serviceKey || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { db: createClient(url, key, { auth: { persistSession: false } }), hasServiceKey: !!serviceKey };
}

type Db = NonNullable<ReturnType<typeof getSupabase>>['db'];

const PRODUCT_COLUMNS =
  'id,name,brand,category,image,release_date,price,overall_rating,rating_count,detailed_rating,description,best_quotes,stores';

function toCandidate(row: any): CandidateProduct {
  return {
    id: String(row.id),
    name: row.name,
    brand: row.brand || '',
    category: row.category || '',
    image: typeof row.image === 'string' && row.image.startsWith('http') ? row.image : '',
    price: row.price || undefined,
    releaseDate: row.release_date || undefined,
    stores: Array.isArray(row.stores) ? row.stores : undefined,
    description: row.description || undefined,
    rating: row.overall_rating,
    ratingCount: row.rating_count || 0,
    detailedRating: row.detailed_rating || null,
    bestQuotes: Array.isArray(row.best_quotes) ? row.best_quotes : undefined,
  };
}

/** DB에서 콘텐츠 후보 상품을 가져온다: 최근 등록 신상 + 리뷰가 많이 쌓인 상품 */
async function fetchCandidateProducts(db: Db): Promise<CandidateProduct[]> {
  const [newest, popular] = await Promise.all([
    db.from('products').select(PRODUCT_COLUMNS).order('created_at', { ascending: false }).limit(45),
    db.from('products').select(PRODUCT_COLUMNS).order('rating_count', { ascending: false }).limit(15),
  ]);
  if (newest.error) throw new Error(`상품 조회 실패: ${newest.error.message}`);

  const seen = new Set<string>();
  return [...(newest.data || []), ...(popular.data || [])]
    .map(toCandidate)
    .filter((p) => p.name && !seen.has(p.id) && !!seen.add(p.id));
}

async function savePost(db: Db, pkg: any, templateMode: string): Promise<string | null> {
  const { error } = await db.from('content_posts').upsert({
    id: pkg.id,
    prompt: pkg.prompt,
    template_mode: templateMode,
    aspect_ratio: pkg.aspectRatio,
    content_json: pkg,
    caption: pkg.caption,
    hashtags: pkg.hashtags,
    created_at: pkg.created_at,
  });
  if (error) console.warn('[api/generate-content] content_posts 저장 실패:', error.message);
  return error ? error.message : null;
}

const STORAGE_HELP =
  'Supabase에 content_posts 테이블이 없거나 접근할 수 없습니다. supabase/migrations/20261010_content_posts_daily.sql 을 Supabase SQL Editor에서 실행해주세요.';

// ---------------------------------------------------------------------------
// 오늘의 자동 콘텐츠 (매일 아침 5세트)
// ---------------------------------------------------------------------------

const PLAN_SYSTEM_PROMPT = `신상픽(SinSangPick)은 편의점·카페·식품 브랜드의 신제품을 모아 보여주는 한국 앱이고, 당신은 그 공식 인스타그램 계정의 편집장입니다. 매일 아침 후보 상품 목록을 보고 오늘 올릴 게시물을 직접 판단해 기획합니다.

좋은 기획의 기준:
- 최근에 나온 상품, 화제가 될 만한 조합, 요일·계절에 어울리는 주제를 우선합니다.
- 하루치 게시물끼리 상품과 포맷이 겹치지 않게 합니다. 최근 며칠간 이미 다룬 상품은 되도록 피합니다.
- 사진이 주인공인 포맷(릴스 커버, 사진 후크)은 hasImage가 true인 상품으로 기획합니다.
- 랭킹은 rating이 있는 상품들로 구성합니다. 근거 없이 순위를 매기지 않습니다.

포맷 종류: "carousel"(신상 1~2개 소개 캐러셀), "top5"(상품 5개 랭킹), "versus"(상품 2개 비교), "reels"(상품 1개 릴스 커버), "curation"(한 카테고리·주제로 3~4개 묶음 소개)

아래 형태의 JSON 객체 하나만 출력합니다. 코드블록이나 설명 문장은 붙이지 않습니다.
{ "posts": [ { "title": "게시물 제목", "angle": "어떤 방향으로 쓸지 한두 문장", "format": "carousel", "productIds": ["상품 id", ...] } ] }`;

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

async function runDailyGeneration(engine: Engine | null, db: Db, date: string) {
  const candidates = await fetchCandidateProducts(db);
  if (candidates.length < 5) {
    throw new Error('콘텐츠를 만들 상품이 DB에 충분하지 않습니다 (5개 미만).');
  }

  // 최근 자동 콘텐츠에서 다룬 주제/상품 → 중복 회피용
  const { data: recentRows } = await db
    .from('content_posts')
    .select('content_json')
    .eq('template_mode', 'daily')
    .order('created_at', { ascending: false })
    .limit(15);
  const recentPosts = (recentRows || []).map((r: any) => r.content_json).filter((c: any) => c && c.dailyDate !== date);

  if (!engine) {
    const posts = buildDailyByRules(candidates, recentPosts.flatMap((c: any) => c.productIds || []), date);
    const failed: string[] = [];
    for (const post of posts) {
      const saveError = await savePost(db, post, 'daily');
      if (saveError) failed.push(`저장 실패: ${saveError}`);
    }
    return { date, engine: 'rules', generated: posts.length - failed.length, failed, posts };
  }

  const recent = recentPosts
    .map((c: any) => `- ${c.title || c.prompt} (상품: ${(c.productIds || []).join(', ') || '없음'})`)
    .join('\n');

  const weekday = WEEKDAYS[new Date(`${date}T00:00:00Z`).getUTCDay()];
  const plan = await askModelForJson(
    engine,
    `[오늘] ${date} (${weekday}요일)

[최근 며칠간 이미 올린 자동 콘텐츠]
${recent || '없음'}

[후보 상품 목록] (한 줄에 하나)
${describeProducts(candidates)}

오늘 올릴 게시물 ${DAILY_POST_COUNT}개를 기획해주세요.`,
    { maxTokens: 4000, timeoutMs: 22_000, system: PLAN_SYSTEM_PROMPT }
  );

  const byId = new Map(candidates.map((p) => [p.id, p]));
  const briefs = (Array.isArray(plan?.posts) ? plan.posts : [])
    .map((post: any) => ({
      title: str(post?.title),
      angle: str(post?.angle),
      format: str(post?.format, 'carousel'),
      products: (Array.isArray(post?.productIds) ? post.productIds : [])
        .map((id: unknown) => byId.get(String(id)))
        .filter(Boolean) as CandidateProduct[],
    }))
    .filter((b: any) => b.title && b.products.length > 0)
    .slice(0, DAILY_POST_COUNT);

  if (briefs.length === 0) {
    throw new Error('AI가 오늘의 기획안을 만들지 못했습니다. 다시 시도해주세요.');
  }

  const settled = await Promise.allSettled(
    briefs.map(async (brief: any, idx: number) => {
      const pkg = await generatePackage(engine, {
        id: `daily-${date}-${idx + 1}`,
        brief: `${brief.title}\n방향: ${brief.angle}\n포맷: ${brief.format}`,
        templateMode: 'auto',
        aspectRatio: brief.format === 'reels' ? '9:16' : '1:1',
        products: brief.products,
        timeoutMs: 33_000,
      });
      const post = { ...pkg, title: brief.title, source: 'daily', dailyDate: date };
      const saveError = await savePost(db, post, 'daily');
      if (saveError) throw new Error(`저장 실패: ${saveError}`);
      return post;
    })
  );

  const posts = settled.flatMap((r) => (r.status === 'fulfilled' ? [r.value] : []));
  const failures = settled.flatMap((r) => (r.status === 'rejected' ? [describeAiError(r.reason)] : []));
  if (failures.length) console.warn('[api/generate-content] daily 일부 실패:', failures);

  return { date, engine: engine.provider, generated: posts.length, failed: failures, posts };
}

// ---------------------------------------------------------------------------
// HTTP 핸들러
// ---------------------------------------------------------------------------

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const engine = getEngine();
  const engineName = engine?.provider ?? 'rules';
  const supabase = getSupabase();
  const query = req.query || {};

  // 공개 상태 확인 (비밀값은 노출하지 않음)
  if (req.method === 'GET' && query.status) {
    let storageReady = false;
    if (supabase?.hasServiceKey) {
      const { error } = await supabase.db.from('content_posts').select('id').limit(1);
      storageReady = !error;
    }
    return res.status(200).json({
      engine: engineName,
      aiConfigured: !!engine,
      storageReady,
      cronSecretConfigured: !!process.env.CRON_SECRET,
    });
  }

  // 매일 아침 자동 생성: Vercel 크론(CRON_SECRET) 또는 관리자의 수동 실행
  if (req.method === 'GET' && query.daily) {
    const cronSecret = process.env.CRON_SECRET;
    const isCron = !!cronSecret && req.headers['authorization'] === `Bearer ${cronSecret}`;
    const isAdmin = isCron ? false : (await verifyAdminRequest(req)).ok;
    // CRON_SECRET이 없는 배포에서는 인증 없는 크론 호출을 받되, 아래 '하루 1회' 확인을 통과해야만 실행된다
    if (!isCron && !isAdmin && cronSecret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const force = isAdmin && !!query.force;

    if (!supabase?.hasServiceKey) {
      return res.status(503).json({ error: 'SUPABASE_SERVICE_ROLE_KEY가 설정되어 있지 않습니다.' });
    }

    const date = kstDateString();
    const existing = await supabase.db.from('content_posts').select('id').like('id', `daily-${date}-%`);
    if (existing.error) {
      // 저장할 곳이 없으면 AI 비용만 쓰고 결과가 사라지므로 실행하지 않는다
      return res.status(503).json({ error: STORAGE_HELP });
    }
    const existingCount = (existing.data || []).length;
    // 인증 없는 호출(CRON_SECRET 미설정 배포의 크론)은 오늘 결과가 하나도 없을 때만 실행 → 하루 1회로 제한
    const alreadyDone = isCron || isAdmin ? existingCount >= DAILY_POST_COUNT : existingCount > 0;
    if (!force && alreadyDone) {
      return res.status(200).json({ date, skipped: true, generated: 0, message: '오늘 콘텐츠는 이미 생성되었습니다.' });
    }

    try {
      const result = await runDailyGeneration(engine, supabase.db, date);
      return res.status(result.generated > 0 ? 200 : 502).json(result);
    } catch (error) {
      console.error('[api/generate-content] daily error:', error);
      return res.status(502).json({ error: describeAiError(error) });
    }
  }

  // 이하 관리자 전용: 서버 AI API 키 무단 사용(과금) 방지
  const auth = await verifyAdminRequest(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error });
  }

  if (req.method === 'GET') {
    const base = { engine: engineName, aiConfigured: !!engine, storageReady: false, posts: [] as any[] };
    if (!supabase?.hasServiceKey) return res.status(200).json(base);
    const { data, error } = await supabase.db
      .from('content_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(80);
    if (error) return res.status(200).json(base);
    return res.status(200).json({ ...base, storageReady: true, posts: data || [] });
  }

  if (req.method === 'DELETE') {
    const id = str(query.id);
    if (!id) return res.status(400).json({ error: 'id가 필요합니다.' });
    if (!supabase?.hasServiceKey) return res.status(503).json({ error: STORAGE_HELP });
    const { error } = await supabase.db.from('content_posts').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt = '', templateMode = 'auto', aspectRatio = '1:1', products = [] } = (req.body || {}) as RequestBody;

  if (!prompt.trim() && products.length === 0) {
    return res.status(400).json({ error: '요청 문구 또는 상품 데이터가 필요합니다.' });
  }
  try {
    // 관리자가 상품을 고르지 않았으면 DB의 실제 신상 중에서 AI가 고른다
    let candidates: CandidateProduct[] = products
      .filter((p) => p && p.id && p.name)
      .map((p) => ({ ...p, id: String(p.id) }));
    if (candidates.length === 0) {
      if (!supabase) throw new Error('Supabase 환경변수가 없어 상품을 조회할 수 없습니다.');
      candidates = await fetchCandidateProducts(supabase.db);
    }
    if (candidates.length === 0) {
      return res.status(400).json({ error: '카드뉴스에 사용할 상품이 없습니다. 상품을 선택해주세요.' });
    }

    const id = `gen-${Date.now()}`;
    let pkg: any;
    if (engine) {
      pkg = await generatePackage(engine, {
        id,
        brief: prompt.trim() || '선택한 상품을 소개하는 신상 추천 카드뉴스',
        templateMode,
        aspectRatio,
        products: candidates,
        timeoutMs: 50_000,
      });
    } else {
      // AI 키가 없으면 실제 상품 데이터로 규칙 기반 조합 (관리자가 고른 상품은 그대로, 아니면 후보에서 선택)
      const kind = ruleKindFor(prompt, templateMode, products.length);
      const chosen = products.length > 0 ? candidates : selectForKind(kind, candidates, new Set(), Date.now());
      const draft = buildRuleDraft(kind, chosen, Date.now());
      if (!draft) {
        return res.status(400).json({ error: '이 구성에 필요한 상품 수가 부족합니다. 상품을 더 선택해주세요. (TOP5·모아보기 3개 이상, VS 2개)' });
      }
      pkg = { ...assemblePackage({ id, brief: prompt.trim() || draft.title, aspectRatio, products: chosen }, draft), engine: 'rules' };
    }

    // 직접 올린 사진(data URL)이 섞이면 행이 지나치게 커지므로 그런 세트는 브라우저에만 보관한다
    const hasInlineImage = JSON.stringify(pkg.slides).includes('"data:');
    const saveError = !supabase?.hasServiceKey
      ? STORAGE_HELP
      : hasInlineImage
      ? '직접 업로드한 이미지가 포함되어 서버 이력에는 저장하지 않았습니다.'
      : await savePost(supabase.db, pkg, templateMode);

    return res.status(200).json({ ...pkg, persisted: !saveError });
  } catch (error) {
    console.error('[api/generate-content] Error:', error);
    return res.status(502).json({ error: describeAiError(error) });
  }
}
