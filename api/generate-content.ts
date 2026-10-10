// api/generate-content.ts
// 신상픽 인스타그램 카드뉴스 생성 Vercel 서버리스 함수 (Anthropic Claude API)
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

async function askClaudeForJson(
  client: Anthropic,
  userMessage: string,
  opts: { maxTokens: number; timeoutMs: number; system?: string }
): Promise<any> {
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

async function generatePackage(client: Anthropic, args: GenerateArgs) {
  const userMessage = `[요청]
${args.brief}

[템플릿 지정]
${args.templateMode === 'auto' ? '지정 없음 — 요청에 가장 어울리는 구성으로' : args.templateMode}

[비율]
${args.aspectRatio}

[사용할 수 있는 상품 목록] (한 줄에 하나)
${describeProducts(args.products)}`;

  const result = await askClaudeForJson(client, userMessage, { maxTokens: 8000, timeoutMs: args.timeoutMs });
  const slides = finalizeSlides(result?.slides, args.products, args.id);
  if (slides.length === 0) {
    throw new Error('AI가 사용할 수 있는 슬라이드를 만들지 못했습니다. 다시 시도해주세요.');
  }

  return {
    id: args.id,
    title: str(result.title, args.brief.slice(0, 60)),
    prompt: args.brief,
    aspectRatio: args.aspectRatio,
    caption: str(result.caption),
    hashtags: (Array.isArray(result.hashtags) ? result.hashtags : [])
      .map((h: unknown) => str(h))
      .filter(Boolean)
      .slice(0, 15),
    slides,
    productIds: usedProductIds(result?.slides, args.products),
    created_at: new Date().toISOString(),
  };
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

async function runDailyGeneration(client: Anthropic, db: Db, date: string) {
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
  const recent = (recentRows || [])
    .map((r: any) => r.content_json)
    .filter((c: any) => c && c.dailyDate !== date)
    .map((c: any) => `- ${c.title || c.prompt} (상품: ${(c.productIds || []).join(', ') || '없음'})`)
    .join('\n');

  const weekday = WEEKDAYS[new Date(`${date}T00:00:00Z`).getUTCDay()];
  const plan = await askClaudeForJson(
    client,
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
      const pkg = await generatePackage(client, {
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

  return { date, generated: posts.length, failed: failures, posts };
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

  const apiKey = process.env.ANTHROPIC_API_KEY;
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
      aiConfigured: !!apiKey,
      storageReady,
      cronSecretConfigured: !!process.env.CRON_SECRET,
      model: MODEL,
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

    if (!apiKey) {
      return res.status(503).json({ error: 'Vercel 환경변수 ANTHROPIC_API_KEY가 설정되어 있지 않습니다.' });
    }
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
      const result = await runDailyGeneration(new Anthropic({ apiKey }), supabase.db, date);
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
    const base = { aiConfigured: !!apiKey, storageReady: false, posts: [] as any[] };
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
  if (!apiKey) {
    return res.status(503).json({ error: 'Vercel 환경변수 ANTHROPIC_API_KEY가 설정되어 있지 않아 AI 생성을 할 수 없습니다.' });
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

    const pkg = await generatePackage(new Anthropic({ apiKey }), {
      id: `gen-${Date.now()}`,
      brief: prompt.trim() || '선택한 상품을 소개하는 신상 추천 카드뉴스',
      templateMode,
      aspectRatio,
      products: candidates,
      timeoutMs: 50_000,
    });

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
