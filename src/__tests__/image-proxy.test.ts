import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import handler from '../../api/image-proxy';

const makeRes = () => {
  const res: any = { statusCode: 200, body: undefined, sent: undefined, headers: {} };
  res.setHeader = (key: string, value: string) => {
    res.headers[key] = value;
  };
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data: unknown) => {
    res.body = data;
    return res;
  };
  res.send = (data: unknown) => {
    res.sent = data;
    return res;
  };
  res.end = () => res;
  return res;
};

const PNG = Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex');
const JPEG = Buffer.from('ffd8ffe000104a46494600', 'hex');
const reqOf = (url: string) => ({ method: 'GET', query: { url } } as any);

describe('이미지 프록시 (GET /api/image-proxy)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn() as any;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('[보안] 내부망·localhost·IP 리터럴·자격증명·비 HTTP 주소는 가져오지 않고 400을 줍니다', async () => {
    const urls = [
      'http://localhost/a.png',
      'http://127.0.0.1/a.png',
      'http://169.254.169.254/latest/meta-data/',
      'http://10.0.0.5/a.png',
      'http://192.168.0.1/a.png',
      'http://[::1]/a.png',
      'https://user:pass@example.com/a.png',
      'file:///etc/passwd',
    ];
    for (const url of urls) {
      const res = makeRes();
      await handler(reqOf(url), res);
      expect(res.statusCode, url).toBe(400);
    }
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('[보안] 업스트림이 text/html 이라고 해도 HTML 본문은 이미지로 내보내지 않습니다', async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response('<script>alert(document.cookie)</script>', {
        status: 200,
        headers: { 'content-type': 'text/html' },
      })
    ) as any;

    const res = makeRes();
    await handler(reqOf('https://cdn.example.com/page.png'), res);

    expect(res.statusCode).toBe(415);
    expect(res.sent).toBeUndefined();
  });

  it('[보안] SVG 는 스크립트를 담을 수 있으므로 거부합니다', async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response('<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"></svg>', {
        status: 200,
        headers: { 'content-type': 'image/svg+xml' },
      })
    ) as any;

    const res = makeRes();
    await handler(reqOf('https://cdn.example.com/logo.svg'), res);

    expect(res.statusCode).toBe(415);
    expect(res.sent).toBeUndefined();
  });

  it('[정상] 이미지 본문은 시그니처로 확인한 타입과 보안 헤더로 응답합니다', async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(PNG, { status: 200, headers: { 'content-type': 'application/octet-stream' } })
    ) as any;

    const res = makeRes();
    await handler(reqOf('https://cdn.example.com/item.png'), res);

    expect(res.statusCode).toBe(200);
    expect(res.headers['Content-Type']).toBe('image/png');
    expect(res.headers['X-Content-Type-Options']).toBe('nosniff');
    expect(res.headers['Content-Security-Policy']).toContain("default-src 'none'");
    expect(Buffer.from(res.sent).equals(PNG)).toBe(true);
  });

  it('[보안] 공개 주소가 내부망으로 리다이렉트하면 따라가지 않습니다', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce(
      new Response(null, { status: 302, headers: { location: 'http://127.0.0.1:3000/admin' } })
    ) as any;

    const res = makeRes();
    await handler(reqOf('https://cdn.example.com/item.png'), res);

    expect(res.statusCode).toBe(502);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('[정상] 공개 주소 사이의 리다이렉트는 대상마다 검사한 뒤 따라갑니다', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce(
        new Response(null, { status: 301, headers: { location: 'https://img.example.com/final.jpg' } })
      )
      .mockResolvedValueOnce(
        new Response(JPEG, { status: 200, headers: { 'content-type': 'image/jpeg' } })
      ) as any;

    const res = makeRes();
    await handler(reqOf('https://cdn.example.com/item'), res);

    expect(res.statusCode).toBe(200);
    expect(res.headers['Content-Type']).toBe('image/jpeg');
    expect(String((global.fetch as any).mock.calls[1][0])).toBe('https://img.example.com/final.jpg');
  });

  it('[보안] 크기 한도(10MB)를 넘는 응답은 413으로 끊습니다', async () => {
    const big = Buffer.alloc(10 * 1024 * 1024 + 1);
    PNG.copy(big);
    global.fetch = vi.fn().mockResolvedValue(
      new Response(big, { status: 200, headers: { 'content-type': 'image/png' } })
    ) as any;

    const res = makeRes();
    await handler(reqOf('https://cdn.example.com/huge.png'), res);

    expect(res.statusCode).toBe(413);
    expect(res.sent).toBeUndefined();
  });
});
