/**
 * 앱인토스(토스 미니앱) 번들 전용 헬퍼.
 * `vite build --mode toss` 로 만든 번들에서만 IS_TOSS 가 true 입니다. (일반 웹·iOS·Android 빌드는 false)
 */
export const IS_TOSS = import.meta.env.MODE === 'toss';

const API_ORIGIN = 'https://www.sinsangpick.kr';

/** 토스 번들은 토스 도메인에서 열리므로 상대 경로 API 호출을 운영 서버로 보내고, 정책상 막힌 외부 이동을 차단합니다. */
export const initTossRuntime = (): void => {
  if (!IS_TOSS || typeof window === 'undefined') return;

  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === 'string' && input.startsWith('/api/')) {
      return nativeFetch(API_ORIGIN + input, init);
    }
    return nativeFetch(input, init);
  };

  // 외부 사이트·스토어 이동은 서비스 오픈 정책(2-2)에서 제한됩니다.
  window.open = () => null;
};

export interface TossSessionTicket {
  tokenHash: string;
  email: string;
}

/** 토스 로그인 → 서버에서 인증코드 교환 → Supabase 로그인용 토큰 해시를 받습니다. */
export const requestTossLogin = async (): Promise<TossSessionTicket> => {
  const { appLogin } = await import('@apps-in-toss/web-framework');
  const { authorizationCode, referrer } = await appLogin();

  const res = await fetch(`${API_ORIGIN}/api/site-content?fn=toss&action=login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ authorizationCode, referrer }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.tokenHash) {
    throw new Error(data?.error || '토스 로그인에 실패했어요.');
  }
  return { tokenHash: data.tokenHash, email: data.email };
};

/** 회원 탈퇴 전에 토스 쪽 로그인 연결도 끊습니다. 실패해도 탈퇴는 계속 진행합니다. */
export const disconnectToss = async (accessToken: string): Promise<void> => {
  try {
    await fetch(`${API_ORIGIN}/api/site-content?fn=toss&action=disconnect`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch {
    // 서버가 연결 끊기 콜백으로도 정리하므로 무시
  }
};
