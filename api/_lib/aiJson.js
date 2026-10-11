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
  if (engine.provider === 'gemini') {
    const model = process.env.GEMINI_MODEL || 'gemini-flash-latest';
    const parts = [];
    if (image) parts.push({ inline_data: { mime_type: image.mediaType, data: image.base64 } });
    parts.push({ text });
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': engine.apiKey },
      signal: AbortSignal.timeout(timeoutMs),
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts }],
        generationConfig: { responseMimeType: 'application/json', maxOutputTokens: maxTokens },
      }),
    });
    if (!response.ok) throw new Error(`Gemini API 오류 (${response.status}): ${(await response.text()).slice(0, 200)}`);
    const data = await response.json();
    const out = (data?.candidates?.[0]?.content?.parts || []).map((part) => part?.text || '').join('');
    if (!out) throw new Error(`Gemini가 응답을 만들지 못했습니다 (${data?.candidates?.[0]?.finishReason || '빈 응답'}).`);
    return extractJsonObject(out);
  }

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
