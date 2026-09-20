/**
 * Network Utilities: Timeout Handling, Offline Detection & Error Parsing
 * Prevents Infinite Loading and provides user-friendly network state feedback.
 */

export class TimeoutError extends Error {
  constructor(message = '요청 처리 시간이 초과되었습니다 (타임아웃). 네트워크 연결을 확인해 주세요.') {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Fetch wrapper with configurable AbortController timeout.
 * Prevents hanging fetches on slow 3G or unresponsive backends.
 */
export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs: number = 8000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  const existingSignal = init?.signal;
  if (existingSignal) {
    existingSignal.addEventListener('abort', () => controller.abort());
  }

  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
    });
    return response;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new TimeoutError(`네트워크 응답이 ${Math.round(timeoutMs / 1000)}초 동안 없어 중단되었습니다.`);
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Wraps any Promise (e.g. Supabase DB calls) with a timeout to guarantee it finishes or rejects,
 * preventing UI spinners from spinning forever on slow 3G / dropped packets.
 */
export async function withTimeout<T>(
  promise: PromiseLike<T>,
  timeoutMs: number = 8000,
  fallbackValue?: T,
  errorMessage?: string
): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<T>((resolve, reject) => {
    timer = setTimeout(() => {
      if (fallbackValue !== undefined) {
        resolve(fallbackValue);
      } else {
        reject(new TimeoutError(errorMessage || `데이터 응답이 ${Math.round(timeoutMs / 1000)}초 내에 완료되지 않았습니다.`));
      }
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    return result;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Parses diverse HTTP status codes and error shapes (500, 401, 404, Offline, Timeout)
 * into helpful user messages in Korean.
 */
export function parseNetworkError(error: any): {
  type: 'offline' | 'timeout' | 'auth_401' | 'not_found_404' | 'server_500' | 'unknown';
  message: string;
} {
  if (!navigator.onLine) {
    return {
      type: 'offline',
      message: '인터넷 연결이 끊어져 있습니다. 네트워크 환경을 확인해 주세요.',
    };
  }

  if (error instanceof TimeoutError || error?.name === 'TimeoutError' || error?.message?.includes('초과') || error?.message?.includes('timeout')) {
    return {
      type: 'timeout',
      message: '네트워크 응답 시간이 초과되었습니다. 신호가 약한 환경일 수 있습니다.',
    };
  }

  const status = error?.status || error?.statusCode || error?.code;
  const rawMsg = String(error?.message || error || '').toLowerCase();

  if (status === 401 || rawMsg.includes('unauthorized') || rawMsg.includes('jwt expired') || rawMsg.includes('401')) {
    return {
      type: 'auth_401',
      message: '로그인 인증 세션이 만료되었습니다. 다시 로그인해 주세요.',
    };
  }

  if (status === 404 || rawMsg.includes('not found') || rawMsg.includes('404')) {
    return {
      type: 'not_found_404',
      message: '요청하신 정보나 항목을 찾을 수 없습니다.',
    };
  }

  if (status === 500 || status === 502 || status === 503 || status === 504 || rawMsg.includes('server error') || rawMsg.includes('500') || rawMsg.includes('502') || rawMsg.includes('503')) {
    return {
      type: 'server_500',
      message: '서버 일시적 점검 또는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    };
  }

  if (rawMsg.includes('failed to fetch') || rawMsg.includes('network request failed')) {
    return {
      type: 'offline',
      message: '서버와 통신할 수 없습니다. Wi-Fi 또는 모바일 데이터를 확인해 주세요.',
    };
  }

  return {
    type: 'unknown',
    message: error?.message || '일시적인 네트워크 오류가 발생했습니다.',
  };
}
