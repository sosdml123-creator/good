// api/image-proxy.ts
// 외부 상품 이미지 CORS 우회용 Vercel 서버리스 프록시
//
// 이 주소는 sinsangpick.kr 출처로 응답하므로, 업스트림의 Content-Type 을 그대로 내보내면
// 공격자가 준비한 HTML·SVG 가 우리 도메인에서 스크립트로 실행됩니다(반사형 XSS). 그래서
//  - 공개 인터넷 주소만 가져오고 (localhost·내부망·IP 리터럴·자격증명 차단), 리다이렉트도 매 단계 같은 검사를 합니다.
//  - 본문의 시그니처(매직 바이트)로 래스터 이미지인지 확인하고, 확인된 타입으로만 응답합니다 (SVG·HTML 제외).
//  - 응답 크기(10MB)와 대기 시간(10초)을 제한합니다.

const MAX_BYTES = 10 * 1024 * 1024;
const MAX_REDIRECTS = 3;
const FETCH_TIMEOUT_MS = 10000;
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const isPrivateIPv4 = (host: string) => {
  const [a, b] = host.split('.').map(Number);
  return a === 0 || a === 10 || a === 127
    || (a === 169 && b === 254)
    || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && b === 168)
    || (a === 100 && b >= 64 && b <= 127);
};

// 공개 인터넷 주소(http/https)만 허용합니다.
export const isPublicHttpUrl = (url: URL) => {
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return false;
  const host = url.hostname.toLowerCase();
  if (!host || host === 'localhost' || /\.(localhost|local|internal)$/.test(host)) return false;
  if (host.includes(':')) return false; // IPv6 리터럴
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) && isPrivateIPv4(host)) return false;
  return true;
};

// 래스터 이미지 시그니처만 인정합니다. SVG·HTML 은 여기서 걸러집니다.
export const sniffImageType = (buf: Buffer): string | null => {
  const text = (start: number, end: number) => buf.subarray(start, end).toString('latin1');
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf.length >= 8 && text(0, 8) === '\x89PNG\r\n\x1a\n') return 'image/png';
  if (buf.length >= 6 && (text(0, 6) === 'GIF87a' || text(0, 6) === 'GIF89a')) return 'image/gif';
  if (buf.length >= 12 && text(0, 4) === 'RIFF' && text(8, 12) === 'WEBP') return 'image/webp';
  if (buf.length >= 12 && text(4, 8) === 'ftyp' && (text(8, 12) === 'avif' || text(8, 12) === 'avis')) return 'image/avif';
  return null;
};

// 리다이렉트는 자동으로 따라가지 않고, 매 단계마다 공개 주소인지 다시 확인합니다.
const fetchPublicImage = async (start: URL): Promise<Response> => {
  let current = start;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    if (!isPublicHttpUrl(current)) throw new Error('blocked host');
    const upstream = await fetch(current, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      },
      redirect: 'manual',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    const location = upstream.headers.get('location');
    if (upstream.status >= 300 && upstream.status < 400 && location) {
      current = new URL(location, current);
      continue;
    }
    return upstream;
  }
  throw new Error('too many redirects');
};

// 본문은 한도까지만 읽고, 넘치면 끊습니다.
const readBody = async (upstream: Response): Promise<Buffer | null> => {
  const declared = Number(upstream.headers.get('content-length') || 0);
  if (declared > MAX_BYTES) return null;
  const reader = upstream.body?.getReader();
  if (!reader) return Buffer.alloc(0);
  const chunks: Buffer[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks, total);
};

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url || typeof url !== 'string' || url.length > 2048) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid image URL' });
  }
  if (!isPublicHttpUrl(target)) {
    return res.status(400).json({ error: 'Invalid image URL' });
  }

  try {
    const upstream = await fetchPublicImage(target);
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: 'Failed to fetch image' });
    }

    const body = await readBody(upstream);
    if (!body) {
      return res.status(413).json({ error: 'Image is too large' });
    }

    const type = sniffImageType(body);
    if (!type) {
      return res.status(415).json({ error: 'Not an image' });
    }

    res.setHeader('Content-Type', type);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800');
    return res.send(body);
  } catch (error: any) {
    console.error('Image proxy error:', error?.message || error);
    return res.status(502).json({ error: 'Failed to fetch image' });
  }
}
