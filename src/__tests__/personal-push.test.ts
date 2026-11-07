import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import handler from '../../api/send-fcm.js';
import {
  nextOutboxState,
  deviceAcceptsKind,
  buildPersonalPushData,
  processPushOutbox,
  PUSH_MAX_ATTEMPTS,
} from '../../api/_lib/devicePush.js';
import { resolveNotificationRoute, pushPayloadToAppNotification } from '../services/notificationService';

const makeRes = () => {
  const res: any = { statusCode: 200, body: undefined, headers: {} };
  res.setHeader = (k: string, v: string) => { res.headers[k] = v; };
  res.status = (code: number) => { res.statusCode = code; return res; };
  res.json = (data: unknown) => { res.body = data; return res; };
  res.end = () => res;
  return res;
};

const USER_A = '11111111-1111-4111-8111-111111111111';
const USER_B = '22222222-2222-4222-8222-222222222222';
const TOKEN = 'a'.repeat(64);

describe('개인 알림 발송 큐 상태 결정 (nextOutboxState)', () => {
  const now = Date.parse('2026-11-07T00:00:00Z');

  it('한 기기라도 받으면 sent', () => {
    expect(nextOutboxState({ attempts: 1, targetCount: 2, sentCount: 1, failedCount: 1, errors: { x: 1 } }, now).status).toBe('sent');
  });

  it('보낼 기기가 없으면 skipped (로그아웃·알림 끔·종류 끔)', () => {
    expect(nextOutboxState({ attempts: 1, targetCount: 0, sentCount: 0, failedCount: 0 }, now).status).toBe('skipped');
  });

  it('일시 오류면 1분 뒤 재시도, 오류 내용을 기록', () => {
    const next = nextOutboxState({ attempts: 1, targetCount: 1, sentCount: 0, failedCount: 1, errors: { timeout: 1 } }, now);
    expect(next.status).toBe('pending');
    expect(next.last_error).toBe('timeout:1');
    expect(Date.parse(next.next_attempt_at!) - now).toBe(60_000);
  });

  it('최대 횟수를 넘기면 failed', () => {
    const next = nextOutboxState({ attempts: PUSH_MAX_ATTEMPTS, targetCount: 1, sentCount: 0, failedCount: 1, errors: { timeout: 1 } }, now);
    expect(next.status).toBe('failed');
  });

  it('모두 무효 토큰이면 재시도하지 않음', () => {
    const next = nextOutboxState({ attempts: 1, targetCount: 1, sentCount: 0, failedCount: 1, invalidCount: 1, errors: { Unregistered: 1 } }, now);
    expect(next.status).toBe('failed');
  });
});

describe('알림 종류별 수신 설정 (deviceAcceptsKind)', () => {
  const base = { pushComment: true, pushLike: true, pushContent: true, marketingAgreed: false, nightAgreed: false };
  it('댓글 알림을 끈 기기는 댓글 푸시를 받지 않음', () => {
    expect(deviceAcceptsKind({ ...base, pushComment: false }, 'comment')).toBe(false);
    expect(deviceAcceptsKind({ ...base, pushComment: false }, 'like')).toBe(true);
  });
  it('좋아요 알림을 끈 기기는 좋아요 푸시를 받지 않음', () => {
    expect(deviceAcceptsKind({ ...base, pushLike: false }, 'like')).toBe(false);
  });
  it('이벤트·혜택은 마케팅 동의 기기만', () => {
    expect(deviceAcceptsKind(base, 'event')).toBe(false);
  });
  it('포인트 알림은 푸시를 켠 기기면 받음', () => {
    expect(deviceAcceptsKind({ ...base, pushComment: false, pushLike: false }, 'point')).toBe(true);
  });
});

describe('푸시 data → 화면 이동', () => {
  it('댓글 알림 → 게시글 (댓글 영역)', () => {
    const data = buildPersonalPushData({
      notification_id: 'un-1', kind: 'comment', target_type: 'post', target_id: 'post-9', data: { commentId: 'c1' }, created_at: '',
    });
    expect(resolveNotificationRoute(data)).toMatchObject({ targetType: 'post', targetId: 'post-9', kind: 'comment', notifId: 'un-1' });
  });

  it('리뷰 좋아요 → 리뷰가 있는 상품 상세', () => {
    const data = buildPersonalPushData({
      notification_id: 'un-2', kind: 'like', target_type: 'review', target_id: 'rv-1', data: { productId: 'snack-01' }, created_at: '',
    });
    expect(resolveNotificationRoute(data)).toMatchObject({ targetType: 'review', productId: 'snack-01' });
  });

  it('포인트 알림 → 포인트 내역', () => {
    const data = buildPersonalPushData({ notification_id: 'un-3', kind: 'point', target_type: 'points', target_id: 'tx_1', data: {}, created_at: '' });
    expect(resolveNotificationRoute(data)?.targetType).toBe('points');
  });

  it('예전 형식(관리자 발송): 신제품 → 상품, 이벤트 → 이벤트, 나머지 → 공지 상세', () => {
    expect(resolveNotificationRoute({ type: 'product', targetId: 'p1' })?.targetType).toBe('product');
    expect(resolveNotificationRoute({ type: 'event', targetId: 'e1' })?.targetType).toBe('event');
    expect(resolveNotificationRoute({ type: 'notice', targetId: '', notifId: 'notif-1' })).toMatchObject({ targetType: 'notice', notifId: 'notif-1' });
  });

  it('같은 알림 id 로 알림함에 합쳐짐 (중복 방지)', () => {
    const n = pushPayloadToAppNotification({ notifId: 'un-7', kind: 'like', targetType: 'post', targetId: 'p' }, { title: 't', body: 'b' });
    expect(n.id).toBe('un-7');
    expect(n.badge).toBe('좋아요');
  });
});

describe('기기 토큰 등록 (action=register) · 계정 전환', () => {
  const originalFetch = global.fetch;
  const saved = { url: process.env.VITE_SUPABASE_URL, key: process.env.SUPABASE_SERVICE_ROLE_KEY, anon: process.env.VITE_SUPABASE_ANON_KEY };

  beforeEach(() => {
    process.env.VITE_SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';
    process.env.VITE_SUPABASE_ANON_KEY = 'anon-key';
  });
  afterEach(() => {
    global.fetch = originalFetch;
    for (const [k, v] of [['VITE_SUPABASE_URL', saved.url], ['SUPABASE_SERVICE_ROLE_KEY', saved.key], ['VITE_SUPABASE_ANON_KEY', saved.anon]] as const) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  });

  const mockAuth = (userIdByJwt: Record<string, string>) => {
    const upserts: any[] = [];
    global.fetch = vi.fn(async (url: string, init: any = {}) => {
      if (url.endsWith('/auth/v1/user')) {
        const jwt = String(init.headers.Authorization).replace('Bearer ', '');
        const id = userIdByJwt[jwt];
        return id ? { ok: true, status: 200, json: async () => ({ id }) } : { ok: false, status: 401, json: async () => ({}) };
      }
      if (url.includes('/rest/v1/device_tokens?on_conflict=token')) {
        upserts.push(JSON.parse(init.body));
        return { ok: true, status: 201, json: async () => [] };
      }
      return { ok: false, status: 404, json: async () => ({}) };
    }) as any;
    return upserts;
  };

  it('로그인 세션이 확인된 사용자에게만 연결하고, 다른 계정으로 바꾸면 user_id 를 덮어씀', async () => {
    const upserts = mockAuth({ 'jwt-a': USER_A, 'jwt-b': USER_B });
    const call = async (jwt?: string) => {
      const res = makeRes();
      await handler({
        method: 'POST',
        headers: jwt ? { authorization: `Bearer ${jwt}` } : {},
        body: { action: 'register', token: TOKEN, platform: 'ios' },
      } as any, res);
      return res;
    };
    expect((await call('jwt-a')).body).toMatchObject({ success: true, linked: true });
    expect((await call('jwt-b')).body).toMatchObject({ success: true, linked: true });
    expect((await call()).body).toMatchObject({ success: true, linked: false });
    expect(upserts.map(u => u.user_id)).toEqual([USER_A, USER_B, null]);
    expect(upserts.every(u => u.token === TOKEN)).toBe(true);
  });

  it('위조·만료된 세션이면 거부 (다른 사람 계정에 토큰을 붙일 수 없음)', async () => {
    const upserts = mockAuth({});
    const res = makeRes();
    await handler({ method: 'POST', headers: { authorization: 'Bearer forged' }, body: { action: 'register', token: TOKEN, platform: 'android' } } as any, res);
    expect(res.statusCode).toBe(401);
    expect(upserts).toHaveLength(0);
  });
});

describe('발송 큐 처리 (processPushOutbox)', () => {
  const originalFetch = global.fetch;
  const saved = { url: process.env.VITE_SUPABASE_URL, key: process.env.SUPABASE_SERVICE_ROLE_KEY };
  beforeEach(() => {
    process.env.VITE_SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';
  });
  afterEach(() => {
    global.fetch = originalFetch;
    if (saved.url === undefined) delete process.env.VITE_SUPABASE_URL; else process.env.VITE_SUPABASE_URL = saved.url;
    if (saved.key === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = saved.key;
  });

  it('받는 사람 기기가 없으면(로그아웃·계정 전환) 보내지 않고 skipped 로 기록', async () => {
    const patches: any[] = [];
    global.fetch = vi.fn(async (url: string, init: any = {}) => {
      if (url.endsWith('/rpc/claim_push_outbox')) {
        return { ok: true, status: 200, json: async () => [{
          outbox_id: 5, notification_id: 'un-x', user_id: USER_A, attempts: 1, kind: 'comment',
          title: 't', body: 'b', target_type: 'post', target_id: 'p1', data: {}, created_at: '',
        }] };
      }
      if (url.includes('/rest/v1/device_tokens?select=')) {
        // 이 사용자로 등록된 기기 없음
        return { ok: true, status: 200, json: async () => [] };
      }
      if (url.includes('/rest/v1/push_outbox?id=eq.5')) {
        patches.push(JSON.parse(init.body));
        return { ok: true, status: 204, json: async () => ({}) };
      }
      return { ok: false, status: 404, json: async () => ({}) };
    }) as any;

    const stats = await processPushOutbox();
    expect(stats).toMatchObject({ claimed: 1, skipped: 1, sent: 0 });
    expect(patches[0]).toMatchObject({ status: 'skipped', last_error: 'no_eligible_device' });
    const deviceQuery = (global.fetch as any).mock.calls.find(([u]: [string]) => u.includes('device_tokens?select='))[0];
    expect(deviceQuery).toContain(`user_id=eq.${USER_A}`);
  });
});
