import crypto from 'node:crypto';
import { normalizePrivateKey } from './pem.js';

/**
 * Android 기기 푸시: Firebase Cloud Messaging HTTP v1 API.
 *
 * 필요한 환경변수:
 *  - FCM_SERVICE_ACCOUNT: Firebase 콘솔 → 프로젝트 설정 → 서비스 계정 → 새 비공개 키(JSON) 내용 전체
 * 앱 쪽에는 android/app/google-services.json 이 있어야 기기가 FCM 토큰을 발급받습니다.
 */
const CONCURRENCY = 50;

export function getFcmConfig() {
  let raw = (process.env.FCM_SERVICE_ACCOUNT || '').trim().replace(/^'|'$/g, '');
  if (!raw) return null;
  // JSON 파일을 base64 로 인코딩해 넣은 경우도 받아줍니다
  if (!raw.startsWith('{')) raw = Buffer.from(raw, 'base64').toString('utf8').trim();
  try {
    const json = JSON.parse(raw);
    if (!json.client_email || !json.private_key || !json.project_id) return null;
    return {
      projectId: json.project_id,
      clientEmail: json.client_email,
      privateKey: normalizePrivateKey(json.private_key),
    };
  } catch {
    return null;
  }
}

async function getAccessToken(config) {
  const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({
    iss: config.clientEmail,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })}`;
  const signature = crypto.sign('RSA-SHA256', Buffer.from(unsigned), config.privateKey).toString('base64url');

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.access_token) {
    throw new Error(`fcm_auth_failed_${res.status}:${json.error_description || json.error || ''}`);
  }
  return json.access_token;
}

/**
 * FCM 서비스 계정 점검 (OAuth 토큰 발급까지만 확인하고 기기로는 아무것도 보내지 않습니다).
 * @returns {Promise<{ ok: boolean, reason: string }>}
 */
export async function checkFcmAuth(config) {
  try {
    await getAccessToken(config);
    return { ok: true, reason: 'ok' };
  } catch (err) {
    return { ok: false, reason: err.message || 'fcm_auth_failed' };
  }
}

/**
 * @returns {Promise<{ sentCount: number, failedCount: number, invalidTokens: string[], errors: Record<string, number> }>}
 */
export async function sendFcmNotifications(config, tokens, { title, body, data = {} }) {
  const result = { sentCount: 0, failedCount: 0, invalidTokens: [], errors: {} };
  if (tokens.length === 0) return result;

  const accessToken = await getAccessToken(config);
  const stringData = Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, String(v ?? '')])
  );
  const url = `https://fcm.googleapis.com/v1/projects/${config.projectId}/messages:send`;

  const sendOne = async (token) => {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: {
            token,
            notification: { title, body },
            data: stringData,
            android: { priority: 'HIGH', notification: { sound: 'default' } },
          },
        }),
      });
      if (res.ok) return { token, ok: true };
      const err = await res.json().catch(() => ({}));
      const status = err?.error?.status || `http_${res.status}`;
      return { token, ok: false, status };
    } catch (e) {
      return { token, ok: false, status: e.message || 'request_error' };
    }
  };

  for (let i = 0; i < tokens.length; i += CONCURRENCY) {
    const responses = await Promise.all(tokens.slice(i, i + CONCURRENCY).map(sendOne));
    for (const r of responses) {
      if (r.ok) {
        result.sentCount += 1;
        continue;
      }
      result.failedCount += 1;
      result.errors[r.status] = (result.errors[r.status] || 0) + 1;
      if (r.status === 'NOT_FOUND' || r.status === 'UNREGISTERED' || r.status === 'INVALID_ARGUMENT') {
        result.invalidTokens.push(r.token);
      }
    }
  }
  return result;
}
