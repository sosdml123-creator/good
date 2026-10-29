import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import handler from '../../api/send-fcm.js';
import { isNightKst, selectMessageDevices } from '../../api/_lib/devicePush.js';
import { sendApnsNotifications } from '../../api/_lib/apns.js';

vi.mock('../../api/_lib/adminAuth.js', () => ({
  verifyAdminRequest: vi.fn(async () => ({ ok: true }))
}));

vi.mock('../../api/_lib/apns.js', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    getApnsConfig: () => ({ keyId: 'key', teamId: 'team', privateKey: 'private' }),
    sendApnsNotifications: vi.fn(async (_config: unknown, tokens: string[]) => ({
      sentCount: tokens.length,
      failedCount: 0,
      invalidTokens: [],
      errors: {}
    }))
  };
});

const A = 'a'.repeat(64);
const B = 'b'.repeat(64);
const C = 'c'.repeat(64);
const D = 'd'.repeat(64);

const DAY = new Date('2026-10-29T05:00:00Z'); // 한국 시간 14:00
const NIGHT = new Date('2026-10-29T13:30:00Z'); // 한국 시간 22:30

type Row = {
  token: string;
  platform: 'ios' | 'android' | 'web';
  alert_categories?: string[] | null;
  marketing_agreed?: boolean;
  night_agreed?: boolean;
};

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

/** PostgREST 의 in.(a,b) 조건을 읽습니다 */
const parseIn = (value: string | null): string[] | null => {
  if (!value) return null;
  const match = /^in\.\((.*)\)$/.exec(value);
  if (!match) return null;
  return match[1].split(',').map((s) => s.replace(/^"|"$/g, ''));
};

const originalFetch = global.fetch;
const savedEnv = {
  url: process.env.VITE_SUPABASE_URL,
  key: process.env.SUPABASE_SERVICE_ROLE_KEY
};

beforeEach(() => {
  process.env.VITE_SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';
  vi.mocked(sendApnsNotifications).mockClear();
});

afterEach(() => {
  global.fetch = originalFetch;
  vi.useRealTimers();
  if (savedEnv.url === undefined) delete process.env.VITE_SUPABASE_URL;
  else process.env.VITE_SUPABASE_URL = savedEnv.url;
  if (savedEnv.key === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  else process.env.SUPABASE_SERVICE_ROLE_KEY = savedEnv.key;
});

/**
 * Supabase REST 를 흉내 냅니다. 기기 조회는 select·platform·token 조건을 지키고,
 * consentColumns 를 false 로 두면 동의 컬럼이 아직 없는 DB(마이그레이션 전)처럼 응답합니다.
 */
const mockSupabase = (rows: Row[], options: { consentColumns?: boolean } = {}) => {
  const calls: Array<{ url: string; init?: any }> = [];
  global.fetch = vi.fn(async (url: string, init?: any) => {
    calls.push({ url, init });
    if (url.includes('/rest/v1/notifications')) {
      return { ok: true, status: 201, json: async () => [] } as any;
    }
    if (url.includes('/rest/v1/device_tokens') && init?.method === 'PATCH') {
      if (options.consentColumns === false) return { ok: false, status: 400, json: async () => ({}) } as any;
      return { ok: true, status: 200, json: async () => [{ token: A }] } as any;
    }
    if (url.includes('/rest/v1/device_tokens')) {
      const u = new URL(url);
      if (options.consentColumns === false && u.searchParams.get('select')?.includes('marketing_agreed')) {
        return { ok: false, status: 400, json: async () => ({}) } as any;
      }
      const columns = (u.searchParams.get('select') || '').split(',').filter(Boolean);
      const platforms = parseIn(u.searchParams.get('platform'));
      const tokens = parseIn(u.searchParams.get('token'));
      const picked = rows
        .filter((r) => !platforms || platforms.includes(r.platform))
        .filter((r) => !tokens || tokens.includes(r.token))
        .map((r) => Object.fromEntries(columns.map((c) => [c, (r as any)[c] ?? null])));
      return { ok: true, status: 200, json: async () => picked } as any;
    }
    return { ok: true, status: 200, json: async () => ({}) } as any;
  }) as any;
  return calls;
};

const sendRequest = async (body: Record<string, unknown>) => {
  const res = makeRes();
  await handler({
    method: 'POST',
    headers: {},
    body: { title: '신상 소식', body: '새 제품이 나왔어요', type: 'product', targetId: 'p1', ...body }
  } as any, res as any);
  return res;
};

const iosSent = () => vi.mocked(sendApnsNotifications).mock.calls.flatMap(([, tokens]) => tokens);

describe('광고·혜택 발송 (messageKind=marketing)', () => {
  it('[정상] 낮에는 마케팅 동의 기기에만 보내고, 알림함에는 promo- 아이디로 저장합니다', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(DAY);
    mockSupabase([
      { token: A, platform: 'ios', marketing_agreed: true, night_agreed: false },
      { token: B, platform: 'ios', marketing_agreed: false, night_agreed: false },
      { token: C, platform: 'android', marketing_agreed: true, night_agreed: false }
    ]);

    const res = await sendRequest({ messageKind: 'marketing', id: 'notif-1793251902934' });

    expect(res.statusCode).toBe(200);
    expect(iosSent()).toEqual([A]);
    expect(res.body.notification.id).toBe('promo-1793251902934');
    expect(res.body.audience).toMatchObject({ messageKind: 'marketing', nightWindow: false, eligible: 2, skippedNoMarketing: 1, skippedNoNight: 0 });
  });

  it('[정상] 밤에는 마케팅 동의와 야간 혜택 동의가 모두 있는 기기에만 보냅니다', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NIGHT);
    mockSupabase([
      { token: A, platform: 'ios', marketing_agreed: true, night_agreed: true },
      { token: B, platform: 'ios', marketing_agreed: true, night_agreed: false },
      { token: C, platform: 'ios', marketing_agreed: false, night_agreed: true }
    ]);

    const res = await sendRequest({ messageKind: 'marketing' });

    expect(iosSent()).toEqual([A]);
    expect(res.body.audience).toMatchObject({ nightWindow: true, eligible: 1, skippedNoMarketing: 1, skippedNoNight: 1 });
  });

  it('[엣지] 동의 컬럼이 아직 없으면 광고·혜택은 보내지 않고 그 사실을 알려 줍니다', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(DAY);
    mockSupabase([{ token: A, platform: 'ios', marketing_agreed: true }], { consentColumns: false });

    const res = await sendRequest({ messageKind: 'marketing' });

    expect(iosSent()).toEqual([]);
    expect(res.body.audience).toMatchObject({ eligible: 0, consentUnavailable: true });
  });

  it('[엣지] 발송 성격을 밝히지 않으면 광고·혜택으로 보고, 동의 없는 기기에는 보내지 않습니다', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(DAY);
    mockSupabase([{ token: A, platform: 'ios', marketing_agreed: false }]);

    const res = await sendRequest({});

    expect(iosSent()).toEqual([]);
    expect(res.body.notification.id.startsWith('promo-')).toBe(true);
  });
});

describe('서비스 안내 (messageKind=service)', () => {
  it('[정상] 동의 여부와 관계없이 푸시 허용 기기 전체에 보내고, 알림함에는 notif- 아이디로 저장합니다', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NIGHT);
    mockSupabase([
      { token: A, platform: 'ios', marketing_agreed: false },
      { token: B, platform: 'ios', marketing_agreed: true, night_agreed: false }
    ]);

    const res = await sendRequest({ messageKind: 'service', id: 'notif-1793251902934' });

    expect(iosSent()).toEqual([A, B]);
    expect(res.body.notification.id).toBe('notif-1793251902934');
    expect(res.body.audience).toMatchObject({ messageKind: 'service', eligible: 2, skippedNoMarketing: 0, skippedNoNight: 0 });
  });
});

describe('지정한 토큰으로 보내기 (테스트 발송)', () => {
  it('[엣지] 지정한 토큰이 형식에 맞지 않으면 기기를 조회하지도, 아무에게도 보내지도 않습니다', async () => {
    const calls = mockSupabase([{ token: A, platform: 'ios', marketing_agreed: true }]);

    const res = await sendRequest({ messageKind: 'service', tokens: ['web-abc'] });

    expect(calls.some((c) => c.url.includes('/rest/v1/device_tokens'))).toBe(false);
    expect(iosSent()).toEqual([]);
    expect(res.body.targetTokensCount).toBe(0);
  });

  it('[정상] 지정한 기기에만 보내고, 광고·혜택이면 그 기기의 동의 값을 확인합니다', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(DAY);
    mockSupabase([
      { token: A, platform: 'ios', marketing_agreed: true },
      { token: B, platform: 'ios', marketing_agreed: true }
    ]);

    await sendRequest({ messageKind: 'marketing', tokens: [A] });

    expect(iosSent()).toEqual([A]);
  });
});

describe('동의 값 저장 (action=consent)', () => {
  it('[정상] 마케팅·야간 동의 값을 기기 행에 저장합니다', async () => {
    const calls = mockSupabase([]);
    const res = makeRes();

    await handler({ method: 'POST', headers: {}, body: { action: 'consent', token: A, marketingAgreed: true, nightAgreed: false } } as any, res as any);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true, saved: true });
    const patch = calls.find((c) => c.init?.method === 'PATCH');
    expect(JSON.parse(patch!.init.body)).toMatchObject({ marketing_agreed: true, night_agreed: false });
  });

  it('[엣지] 동의 컬럼이 없으면 503으로 알려 주고, 토큰 형식이 틀리면 400을 줍니다', async () => {
    mockSupabase([], { consentColumns: false });
    const unavailable = makeRes();
    await handler({ method: 'POST', headers: {}, body: { action: 'consent', token: A, marketingAgreed: true } } as any, unavailable as any);
    expect(unavailable.statusCode).toBe(503);
    expect(unavailable.body.reason).toBe('consent_unavailable');

    const invalid = makeRes();
    await handler({ method: 'POST', headers: {}, body: { action: 'consent', token: 'bad token!', marketingAgreed: true } } as any, invalid as any);
    expect(invalid.statusCode).toBe(400);
  });
});

describe('기기 현황 (GET) 의 동의 기기 수', () => {
  it('[정상] 푸시 허용 기기(iOS·Android) 중 광고·혜택 동의 기기 수를 알려 줍니다', async () => {
    mockSupabase([
      { token: A, platform: 'ios', marketing_agreed: true, night_agreed: true },
      { token: B, platform: 'ios', marketing_agreed: true, night_agreed: false },
      { token: C, platform: 'android', marketing_agreed: true, night_agreed: false },
      { token: D, platform: 'web', marketing_agreed: true, night_agreed: true }
    ]);
    const res = makeRes();

    await handler({ method: 'GET', headers: {}, query: {} } as any, res as any);

    expect(res.body.tokensByPlatform).toEqual({ ios: 2, android: 1, web: 1 });
    expect(res.body.consent).toEqual({ marketing: 3, night: 1 });
  });
});

describe('발송 대상 고르기 (순수 함수)', () => {
  it('[정상] 밤 9시~아침 8시 경계를 정확히 나눕니다', () => {
    expect(isNightKst(new Date('2026-10-29T11:59:00Z'))).toBe(false); // 20:59
    expect(isNightKst(new Date('2026-10-29T12:00:00Z'))).toBe(true); // 21:00
    expect(isNightKst(new Date('2026-10-29T22:59:00Z'))).toBe(true); // 07:59
    expect(isNightKst(new Date('2026-10-29T23:00:00Z'))).toBe(false); // 08:00
  });

  it('[정상] 광고·혜택은 동의 기기만, 서비스 안내는 기기 전체를 고릅니다', () => {
    const devices = [
      { token: A, platform: 'ios', marketingAgreed: true, nightAgreed: false },
      { token: B, platform: 'ios', marketingAgreed: false, nightAgreed: false }
    ];
    expect(selectMessageDevices(devices, 'service', DAY).devices).toHaveLength(2);
    expect(selectMessageDevices(devices, 'marketing', DAY).devices.map((d) => d.token)).toEqual([A]);
    expect(selectMessageDevices(devices, 'marketing', NIGHT).devices).toEqual([]);
  });
});
