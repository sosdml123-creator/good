import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import handler from '../../api/send-fcm.js';

const makeRes = () => {
  const res: any = { statusCode: 200, body: undefined, headers: {} };
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
  res.end = () => res;
  return res;
};

describe('알림 끈 기기 토큰 삭제 (POST /api/send-fcm, action=unregister)', () => {
  const originalFetch = global.fetch;
  const saved = {
    url: process.env.VITE_SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY
  };

  beforeEach(() => {
    process.env.VITE_SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';
  });

  afterEach(() => {
    global.fetch = originalFetch;
    if (saved.url === undefined) delete process.env.VITE_SUPABASE_URL;
    else process.env.VITE_SUPABASE_URL = saved.url;
    if (saved.key === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = saved.key;
  });

  it('[정상] 토큰과 정확히 일치하는 행만 서비스 키로 삭제합니다', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ token: 'abc123def456' }]
    }) as any;

    const res = makeRes();
    await handler({ method: 'POST', body: { action: 'unregister', token: 'abc123def456' } } as any, res as any);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true, removed: 1 });
    const [url, init] = (global.fetch as any).mock.calls[0];
    expect(url).toBe('https://example.supabase.co/rest/v1/device_tokens?token=eq.abc123def456');
    expect(init.method).toBe('DELETE');
    expect(init.headers.Authorization).toBe('Bearer service-key');
  });

  it('[엣지] 토큰 형식이 잘못되면 400을 주고 DB를 건드리지 않습니다', async () => {
    global.fetch = vi.fn() as any;

    const res = makeRes();
    await handler({ method: 'POST', body: { action: 'unregister', token: "x' or 1=1" } } as any, res as any);

    expect(res.statusCode).toBe(400);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('[엣지] 서비스 키가 없으면 500을 주고 DB를 건드리지 않습니다', async () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    global.fetch = vi.fn() as any;

    const res = makeRes();
    await handler({ method: 'POST', body: { action: 'unregister', token: 'abc123def456' } } as any, res as any);

    expect(res.statusCode).toBe(500);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
