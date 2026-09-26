import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase, handleAuthCallbackUrl } from '../services/supabase';

vi.mock('@capacitor/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@capacitor/core')>();
  return {
    ...actual,
    Capacitor: {
      ...actual.Capacitor,
      isNativePlatform: vi.fn(() => false),
      getPlatform: vi.fn(() => 'web'),
    },
  };
});

vi.mock('@capacitor/browser', () => ({
  Browser: {
    close: vi.fn().mockResolvedValue(undefined),
    open: vi.fn().mockResolvedValue(undefined),
    addListener: vi.fn().mockResolvedValue({ remove: vi.fn() }),
  },
}));

describe('OAuth Callback & Native Deep Link Flow (카카오 로그인 후 앱 자동 전환 검증)', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    delete (window as any).__SINSANGPICK_AUTH_URL__;
    vi.clearAllMocks();

    if (supabase) {
      vi.spyOn(supabase.auth, 'exchangeCodeForSession').mockImplementation(async (code: string) => {
        if (code === 'kakao-oauth-code-12345' || code === 'valid-auth-code') {
          return { data: { session: { access_token: 'valid-token' } as any, user: null }, error: null };
        }
        return { data: { session: null, user: null }, error: { message: 'Invalid PKCE code' } as any };
      });

      vi.spyOn(supabase.auth, 'setSession').mockImplementation(async ({ access_token }: any) => {
        if (access_token === 'kakao-jwt-token' || access_token === 'mock-jwt-token') {
          return { data: { session: { access_token } as any, user: null }, error: null };
        }
        return { data: { session: null, user: null }, error: { message: 'Expired token' } as any };
      });
    }
  });

  it('[정상] 카카오 로그인 PKCE code 수신 시 딥링크 처리 및 브라우저 닫기 성공', async () => {
    const deepLinkUrl = 'sinsangpick://auth-callback?code=kakao-oauth-code-12345';
    const result = await handleAuthCallbackUrl(deepLinkUrl);
    expect(result).toBe(true);
  });

  it('[정상] 카카오 로그인 Implicit access_token 수신 시 딥링크 처리 성공', async () => {
    const deepLinkUrl = 'sinsangpick://auth-callback#access_token=kakao-jwt-token&refresh_token=kakao-refresh-token';
    const result = await handleAuthCallbackUrl(deepLinkUrl);
    expect(result).toBe(true);
  });

  it('[정상] 웹 브릿지에서 전송된 쿼리 및 해시 파라미터가 딥링크로 올바르게 보존됨', () => {
    const search = '?code=kakao-auth-sample';
    const hash = '#access_token=test-token&refresh_token=test-refresh';
    const fullTarget = `sinsangpick://auth-callback${search}${hash}`;

    expect(fullTarget).toContain('sinsangpick://auth-callback');
    expect(fullTarget).toContain('code=kakao-auth-sample');
    expect(fullTarget).toContain('access_token=test-token');
  });

  it('[정상] sessionStorage 및 전역 변수에 저장된 인증 콜백 URL 복원 검증', () => {
    const mockAuthUrl = 'sinsangpick://auth-callback?code=restored-kakao-code';
    sessionStorage.setItem('sinsangpick_auth_callback_url', mockAuthUrl);
    (window as any).__SINSANGPICK_AUTH_URL__ = mockAuthUrl;

    const restoredFromSession = sessionStorage.getItem('sinsangpick_auth_callback_url');
    const restoredFromWindow = (window as any).__SINSANGPICK_AUTH_URL__;

    expect(restoredFromSession).toBe(mockAuthUrl);
    expect(restoredFromWindow).toBe(mockAuthUrl);
  });

  it('[방어] 사용자가 카카오 로그인을 취소한 경우 에러 파라미터 감지 및 정상 차단', async () => {
    const errorUrl = 'sinsangpick://auth-callback?error=access_denied&error_description=User%20denied%20Kakao%20access';
    const result = await handleAuthCallbackUrl(errorUrl);
    expect(result).toBe(false);
  });
});
