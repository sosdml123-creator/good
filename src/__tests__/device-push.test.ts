import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  buildReleaseMessage,
  matchesAlertCategories,
  sanitizeAlertCategories,
  sendReleasePushes,
} from '../../api/_lib/devicePush.js';
import * as apns from '../../api/_lib/apns.js';

vi.mock('../../api/_lib/apns.js', () => ({
  getApnsConfig: () => ({ keyId: 'k', teamId: 't', privateKey: 'p', bundleId: 'com.sinsangpick.app' }),
  checkApnsAuth: vi.fn(),
  sendApnsNotifications: vi.fn(async (_config: unknown, tokens: string[]) => ({
    sentCount: tokens.length,
    failedCount: 0,
    invalidTokens: [],
    errors: {},
  })),
}));

const IOS_A = 'a'.repeat(64); // 과자 관심
const IOS_C = 'c'.repeat(64); // 음료 관심
const IOS_D = 'd'.repeat(64); // 설정 없음 → 기본 카테고리(과자·음료 포함)

// 알림을 끈 기기는 앱이 행을 지우므로 여기에 없습니다
const deviceRows = [
  { token: IOS_A, platform: 'ios', alert_categories: ['과자'] },
  { token: IOS_C, platform: 'ios', alert_categories: ['음료'] },
  { token: IOS_D, platform: 'ios', alert_categories: null },
];

const products = [
  { id: 'p1', name: '새 과자', brand: 'CU', category: '과자' },
  { id: 'p2', name: '새 음료', brand: '세븐일레븐', category: '음료' },
];

describe('관심 카테고리 매칭', () => {
  it('선택한 카테고리에 해당하는 상품만 맞는다', () => {
    expect(matchesAlertCategories('과자', ['과자', '음료'])).toBe(true);
    expect(matchesAlertCategories('과일', ['과자', '음료'])).toBe(false);
  });

  it('전체 또는 신제품을 고르면 모든 상품이 맞는다', () => {
    expect(matchesAlertCategories('아이스크림', ['전체'])).toBe(true);
    expect(matchesAlertCategories('기타', ['신제품'])).toBe(true);
  });

  it('아무것도 고르지 않으면 어떤 출시 알림도 받지 않는다', () => {
    expect(matchesAlertCategories('과자', [])).toBe(false);
  });
});

describe('출시 알림 문구', () => {
  it('상품이 하나면 상품명과 카테고리를 넣고 상품 화면으로 연결한다', () => {
    const message = buildReleaseMessage([products[0]]);
    expect(message.title).toContain('[과자]');
    expect(message.body).toContain('CU 새 과자');
    expect(message.data).toMatchObject({ type: 'product', targetId: 'p1' });
  });

  it('상품이 여러 개면 한 통으로 묶고 개수를 알린다', () => {
    const message = buildReleaseMessage([
      { id: 'x1', name: '새 과자', brand: 'CU', category: '과자' },
      { id: 'x2', name: '새 음료', brand: 'CU', category: '음료' },
      { id: 'x3', name: '새 빵', brand: 'CU', category: '빵·디저트' },
    ]);
    expect(message.title).toContain('3개');
    expect(message.body).toContain('외 2개');
    expect(message.data.targetId).toBe('');
  });
});

describe('기기 설정 값 정리', () => {
  it('알 수 없는 카테고리는 버리고 중복을 없앤다', () => {
    expect(sanitizeAlertCategories(['과자', '없는카테고리', '과자'])).toEqual(['과자']);
  });

  it('null 은 기본값 사용을 뜻하므로 null 로 두고, 배열이 아니면 잘못된 입력으로 본다', () => {
    expect(sanitizeAlertCategories(null)).toBeNull();
    expect(sanitizeAlertCategories('과자')).toBeUndefined();
  });
});

describe('출시 자동 알림 대상 (sendReleasePushes)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('SUPABASE_URL', 'https://db.example');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-key');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('기기마다 관심 카테고리에 맞는 상품만 담아 보낸다', async () => {
    vi.stubGlobal('fetch', vi.fn(async (_url: string, init?: RequestInit) => {
      if (init?.method) return new Response('', { status: 204 });
      return new Response(JSON.stringify(deviceRows), { status: 200 });
    }));

    const summary = await sendReleasePushes(products);

    // 과자 기기(A), 음료 기기(C), 기본 설정 기기(D: 과자+음료 묶음) → 3개 묶음
    expect(summary.groupCount).toBe(3);
    expect(summary.targetCount).toBe(3);
    expect(summary.sentCount).toBe(3);
    expect(summary.failedCount).toBe(0);

    const calls = vi.mocked(apns.sendApnsNotifications).mock.calls;
    const allTokens = calls.flatMap(([, tokens]) => tokens);
    expect(allTokens.sort()).toEqual([IOS_A, IOS_C, IOS_D].sort());

    const toA = calls.find(([, tokens]) => tokens.includes(IOS_A));
    expect(toA?.[2].title).toContain('[과자]');
    expect(toA?.[2].body).toContain('새 과자');

    const toC = calls.find(([, tokens]) => tokens.includes(IOS_C));
    expect(toC?.[2].body).toContain('새 음료');
    expect(toC?.[2].title).not.toContain('개');

    const toD = calls.find(([, tokens]) => tokens.includes(IOS_D));
    expect(toD?.[2].title).toContain('2개');
  });

  it('기기 설정 컬럼이 아직 없으면 아무 출시 알림도 보내지 않는다', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
      if (init?.method) return new Response('', { status: 204 });
      if (url.includes('alert_categories')) return new Response('{"code":"42703"}', { status: 400 });
      return new Response(JSON.stringify(deviceRows.map(({ token, platform }) => ({ token, platform }))), { status: 200 });
    }));

    const summary = await sendReleasePushes(products);

    expect(summary.skipped).toBe('prefs_unavailable');
    expect(apns.sendApnsNotifications).not.toHaveBeenCalled();
  });
});
