import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import handler from '../../api/send-fcm.js';

vi.mock('../../api/_lib/adminAuth.js', () => ({ verifyAdminRequest: vi.fn(async () => ({ ok: true })) }));

const TOKEN = 'a'.repeat(64);

const makeRes = () => ({
  setHeader: vi.fn(),
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
  end: vi.fn(),
});

describe('/api/send-fcm 핸들러', () => {
  beforeEach(() => {
    // Supabase 와 기기 푸시 키가 없는 환경을 기준으로 검증합니다 (네트워크 호출 없음)
    vi.stubEnv('SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '');
    vi.stubEnv('APNS_KEY_ID', '');
    vi.stubEnv('APNS_TEAM_ID', '');
    vi.stubEnv('APNS_PRIVATE_KEY', '');
    vi.stubEnv('FCM_SERVICE_ACCOUNT', '');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('공개 상태 조회는 키 설정 여부를 iOS·Android 각각 알려준다', async () => {
    const res = makeRes();
    await handler({ method: 'GET', headers: {}, query: {} }, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 'online',
      hasApnsKey: false,
      hasFcmKey: false,
      registeredTokens: 0,
    }));
  });

  it('연결 점검은 키가 없으면 어떤 기기에도 보내지 않고 미설정으로 응답한다', async () => {
    const res = makeRes();
    await handler({ method: 'GET', headers: {}, query: { check: '1' } }, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      apns: expect.objectContaining({ configured: false, ok: false }),
      fcm: expect.objectContaining({ configured: false, ok: false }),
    }));
  });

  it('기기 설정 저장은 토큰 형식이 틀리면 400으로 거절한다', async () => {
    const res = makeRes();
    await handler({ method: 'POST', headers: {}, body: { action: 'prefs', token: 'bad token!', alertCategories: ['과자'] } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('기기 설정 저장은 관심 카테고리가 배열이 아니면 400으로 거절한다', async () => {
    const res = makeRes();
    await handler({ method: 'POST', headers: {}, body: { action: 'prefs', token: TOKEN, alertCategories: '과자' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('기기 설정 저장은 DB 가 없으면 저장되지 않았다고 알린다', async () => {
    const res = makeRes();
    await handler({ method: 'POST', headers: {}, body: { action: 'prefs', token: TOKEN, alertCategories: ['과자'] } }, res);
    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ saved: false }));
  });

  it('수동 발송은 DB 가 없어도 응답 형식을 지키고 보낸 기기 수를 0으로 보고한다', async () => {
    const res = makeRes();
    await handler({
      method: 'POST',
      headers: {},
      body: { title: '공지', body: '내용입니다', type: 'notice', messageKind: 'service', id: 'notif-1793251902934' },
    }, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const body = res.json.mock.calls[0][0];
    expect(body.success).toBe(true);
    expect(body.notification.id).toBe('notif-1793251902934');
    expect(body.push).toMatchObject({ targetCount: 0, sentCount: 0, failedCount: 0 });
  });
});
