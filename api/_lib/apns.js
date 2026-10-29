import http2 from 'node:http2';
import crypto from 'node:crypto';

/**
 * Direct Apple Push Notification service (APNs) sender.
 *
 * iOS 앱은 @capacitor/push-notifications 로 APNs 디바이스 토큰을 직접 발급받으므로
 * (Firebase SDK 미탑재) 서버도 FCM 을 거치지 않고 APNs HTTP/2 API 로 바로 발송합니다.
 *
 * 필요한 환경변수 (Apple Developer → Keys 에서 발급한 APNs Auth Key):
 *  - APNS_KEY_ID, APNS_TEAM_ID, APNS_PRIVATE_KEY (.p8 파일 내용 전체)
 */
const APNS_HOST = 'https://api.push.apple.com';
const APNS_TOKEN_REGEX = /^[0-9a-f]{64,}$/i;
const CONCURRENCY = 100;

export function getApnsConfig() {
  const keyId = (process.env.APNS_KEY_ID || '').trim();
  const teamId = (process.env.APNS_TEAM_ID || '').trim();
  const privateKey = (process.env.APNS_PRIVATE_KEY || '').replace(/\\n/g, '\n').trim();
  if (!keyId || !teamId || !privateKey) return null;

  return {
    keyId,
    teamId,
    privateKey,
    bundleId: (process.env.APNS_BUNDLE_ID || 'com.sinsangpick.app').trim(),
  };
}

export const isApnsToken = (token) => typeof token === 'string' && APNS_TOKEN_REGEX.test(token);

function createProviderToken(config) {
  const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const unsigned = `${encode({ alg: 'ES256', kid: config.keyId })}.${encode({
    iss: config.teamId,
    iat: Math.floor(Date.now() / 1000),
  })}`;
  const signature = crypto
    .sign('sha256', Buffer.from(unsigned), { key: config.privateKey, dsaEncoding: 'ieee-p1363' })
    .toString('base64url');
  return `${unsigned}.${signature}`;
}

/**
 * @returns {Promise<{ sentCount: number, failedCount: number, invalidTokens: string[], errors: Record<string, number> }>}
 */
export async function sendApnsNotifications(config, tokens, { title, body, data = {} }) {
  const result = { sentCount: 0, failedCount: 0, invalidTokens: [], errors: {} };
  if (tokens.length === 0) return result;

  const providerToken = createProviderToken(config);
  const payload = JSON.stringify({
    aps: { alert: { title, body }, sound: 'default' },
    ...data,
  });

  const client = http2.connect(APNS_HOST);
  client.on('error', (err) => console.error('[APNs] connection error:', err.message));

  const sendOne = (token) =>
    new Promise((resolve) => {
      let status = 0;
      let raw = '';
      let settled = false;
      const finish = (reason) => {
        if (settled) return;
        settled = true;
        resolve({ token, status, reason });
      };

      try {
        const req = client.request({
          ':method': 'POST',
          ':path': `/3/device/${token}`,
          authorization: `bearer ${providerToken}`,
          'apns-topic': config.bundleId,
          'apns-push-type': 'alert',
          'apns-priority': '10',
          'content-type': 'application/json',
        });
        req.setEncoding('utf8');
        req.on('response', (headers) => {
          status = Number(headers[':status']) || 0;
        });
        req.on('data', (chunk) => {
          raw += chunk;
        });
        req.on('end', () => {
          let reason = '';
          try {
            reason = raw ? JSON.parse(raw).reason || '' : '';
          } catch {
            // ignore non-JSON body
          }
          finish(reason);
        });
        req.on('error', (err) => finish(err.message || 'request_error'));
        req.setTimeout(10000, () => {
          req.close();
          finish('timeout');
        });
        req.end(payload);
      } catch (err) {
        finish(err.message || 'request_error');
      }
    });

  try {
    for (let i = 0; i < tokens.length; i += CONCURRENCY) {
      const responses = await Promise.all(tokens.slice(i, i + CONCURRENCY).map(sendOne));
      for (const { token, status, reason } of responses) {
        if (status === 200) {
          result.sentCount += 1;
          continue;
        }
        result.failedCount += 1;
        const key = reason || `http_${status}`;
        result.errors[key] = (result.errors[key] || 0) + 1;
        // 앱 삭제 / 토큰 만료 등 더 이상 유효하지 않은 기기
        if (status === 410 || reason === 'BadDeviceToken' || reason === 'Unregistered') {
          result.invalidTokens.push(token);
        }
      }
    }
  } finally {
    client.close();
  }

  return result;
}

/**
 * APNs 인증 키 점검. 실제 기기로는 아무것도 보내지 않고, 존재하지 않는 더미 토큰으로 한 번 요청합니다.
 * 403(InvalidProviderToken 등)이면 키·키ID·팀ID가 틀린 것이고, 그 밖의 응답은 인증이 통과했다는 뜻입니다.
 * @returns {Promise<{ ok: boolean, reason: string }>}
 */
export function checkApnsAuth(config) {
  return new Promise((resolve) => {
    const providerToken = createProviderToken(config);
    const client = http2.connect(APNS_HOST);
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      client.close();
      resolve(result);
    };

    client.on('error', (err) => finish({ ok: false, reason: err.message || 'connection_error' }));
    try {
      const req = client.request({
        ':method': 'POST',
        ':path': `/3/device/${'0'.repeat(64)}`,
        authorization: `bearer ${providerToken}`,
        'apns-topic': config.bundleId,
        'apns-push-type': 'alert',
        'apns-priority': '10',
        'content-type': 'application/json',
      });
      let status = 0;
      let raw = '';
      req.setEncoding('utf8');
      req.on('response', (headers) => {
        status = Number(headers[':status']) || 0;
      });
      req.on('data', (chunk) => {
        raw += chunk;
      });
      req.on('end', () => {
        let reason = '';
        try {
          reason = raw ? JSON.parse(raw).reason || '' : '';
        } catch {
          // ignore non-JSON body
        }
        if (status === 403) finish({ ok: false, reason: reason || 'http_403' });
        else finish({ ok: true, reason: reason || `http_${status}` });
      });
      req.on('error', (err) => finish({ ok: false, reason: err.message || 'request_error' }));
      req.setTimeout(10000, () => {
        req.close();
        finish({ ok: false, reason: 'timeout' });
      });
      req.end('{"aps":{}}');
    } catch (err) {
      finish({ ok: false, reason: err.message || 'request_error' });
    }
  });
}
