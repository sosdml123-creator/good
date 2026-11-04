/**
 * AI 에게 JSON 응답을 받는 공용 헬퍼 (서버 전용)
 *   ANTHROPIC_API_KEY → Claude / GEMINI_API_KEY → Gemini / 둘 다 없으면 null
 */

import Anthropic from '@anthropic-ai/sdk';

const CLAUDE_MODEL = 'claude-opus-5-5';

export function getAiEngine() {
  if (process.env.ANTHROPIC_API_KEY) {
    return { provider: 'anthropic', client: new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) };
  }
  if (process.env.GEMINI_API_KEY) {
    return { provider: 'gemini', apiKey: process.env.GEMINI_API_KEY.trim() };
  }
  return null;
}

// Gemini 무료 등급은 분당·일일 요청 수 한도가 낮아 한 번의 수집에서 동시에 수백 건을 보내면 429/503이 쏟아집니다.
// 한 함수 실행 안의 모든 호출을 줄 세워 동시 개수와 간격을 제한하고, 일시 오류는 잠깐 기다렸다가 다시 시도합니다.
const GEMINI_CONCURRENCY = Math.max(1, Number(process.env.GEMINI_CONCURRENCY) || 2);
const GEMINI_MIN_INTERVAL_MS = Math.max(0, Number(process.env.GEMINI_MIN_INTERVAL_MS) || 4000);
let geminiActive = 0;
let geminiLastStart = 0;
let geminiQuotaBlockedUntil = 0;
const geminiWaiters = [];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function pumpGemini() {
  if (geminiActive >= GEMINI_CONCURRENCY || geminiWaiters.length === 0) return;
  const wait = geminiLastStart + GEMINI_MIN_INTERVAL_MS - Date.now();
  if (wait > 0) {
    setTimeout(pumpGemini, wait);
    return;
  }
  geminiActive += 1;
  geminiLastStart = Date.now();
  geminiWaiters.shift()();
  pumpGemini();
}

async function withGeminiSlot(endAt, task) {
  await new Promise((resolve) => { geminiWaiters.push(resolve); pumpGemini(); });
  try {
    if (endAt - Date.now() < 1500) throw new Error('Gemini 무료 한도 속도 조절로 대기하다 시간이 끝났습니다.');
    return await task();
  } finally {
    geminiActive -= 1;
    pumpGemini();
  }
}

function retryDelayMs(body, attempt) {
  const match = body.match(/"retryDelay":\s*"(\d+(?:\.\d+)?)s"/);
  return match ? Math.ceil(Number(match[1]) * 1000) : 2000 * 2 ** attempt;
}

async function askGemini(engine, { system, text, image, maxTokens, timeoutMs }) {
  if (Date.now() < geminiQuotaBlockedUntil) throw new Error('Gemini 무료 등급의 오늘 사용 한도를 모두 썼습니다. 내일 다시 시도해주세요.');
  const model = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';
  const parts = [];
  if (image) parts.push({ inline_data: { mime_type: image.mediaType, data: image.base64 } });
  parts.push({ text });
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: 'user', parts }],
    generationConfig: { responseMimeType: 'application/json', maxOutputTokens: maxTokens },
  });
  const endAt = Date.now() + timeoutMs;

  for (let attempt = 0; ; attempt += 1) {
    const response = await withGeminiSlot(endAt, () => fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': engine.apiKey },
      signal: AbortSignal.timeout(Math.max(1, endAt - Date.now())),
      body,
    }));
    if (response.ok) {
      const data = await response.json();
      const out = (data?.candidates?.[0]?.content?.parts || []).map((part) => part?.text || '').join('');
      if (!out) throw new Error(`Gemini가 응답을 만들지 못했습니다 (${data?.candidates?.[0]?.finishReason || '빈 응답'}).`);
      return extractJsonObject(out);
    }
    const errorBody = await response.text();
    if (response.status === 429 && /PerDay/i.test(errorBody)) {
      geminiQuotaBlockedUntil = Date.now() + 60 * 60 * 1000;
      throw new Error('Gemini 무료 등급의 오늘 사용 한도를 모두 썼습니다. 내일 다시 시도해주세요.');
    }
    const delay = retryDelayMs(errorBody, attempt);
    const retryable = response.status === 429 || response.status === 503;
    if (!retryable || attempt >= 3 || Date.now() + delay > endAt - 3000) {
      throw new Error(`Gemini API 오류 (${response.status}): ${errorBody.slice(0, 200)}`);
    }
    await sleep(delay);
  }
}

function extractJsonObject(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) throw new Error('AI 응답에서 JSON을 찾지 못했습니다.');
  return JSON.parse(text.slice(start, end + 1));
}

/**
 * @param engine getAiEngine() 결과
 * @param {{ system: string, text: string, image?: { mediaType: string, base64: string }, maxTokens?: number, timeoutMs?: number }} request
 */
export async function askAiForJson(engine, { system, text, image, maxTokens = 16000, timeoutMs = 45000 }) {
  if (engine.provider === 'gemini') return askGemini(engine, { system, text, image, maxTokens, timeoutMs });

  const content = [];
  if (image) content.push({ type: 'image', source: { type: 'base64', media_type: image.mediaType, data: image.base64 } });
  content.push({ type: 'text', text });

  const response = await engine.client.beta.messages.create(
    {
      model: CLAUDE_MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content }],
      // 전단 내용을 옮겨 적는 작업이라 깊은 추론이 필요 없고, 함수 실행 시간(60초) 안에 끝나야 합니다.
      output_config: { effort: 'low' },
      // 안전 분류기가 요청을 거절하면 Anthropic 권장 모델로 서버에서 재시도
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
    },
    { timeout: timeoutMs, maxRetries: 0 }
  );

  if (response.stop_reason === 'refusal') throw new Error('AI가 이 요청을 거절했습니다.');
  if (response.stop_reason === 'max_tokens') throw new Error('AI 응답이 길이 제한에 걸려 중간에 끊겼습니다.');
  return extractJsonObject(response.content.map((block) => (block.type === 'text' ? block.text : '')).join(''));
}
