/**
 * 앱인토스(토스 미니앱) 토스 로그인 서버 처리 — /api/site-content?fn=toss&action=...
 *
 *  action=login      POST {authorizationCode, referrer}  → Supabase 로그인용 tokenHash 발급
 *  action=disconnect POST (Authorization: Bearer <Supabase access token>) → 토스 쪽 연결 끊기
 *  action=unlink     GET/POST 토스 콘솔에 등록하는 연결 끊기 콜백 → 신상픽 계정·데이터 삭제
 *
 * 필요한 환경변수 (Vercel)
 *  TOSS_MTLS_CERT   콘솔에서 받은 <이름>_public.crt 내용(PEM, 줄바꿈은 \n 으로 써도 됨)
 *  TOSS_MTLS_KEY    콘솔에서 받은 <이름>_private.key 내용(PEM)
 *  TOSS_UNLINK_AUTH 콘솔 콜백의 Basic Auth 에 넣은 값 (예: "user:password")
 *  SUPABASE_SERVICE_ROLE_KEY / VITE_SUPABASE_URL (기존)
 */

import https from 'node:https';

const TOSS_HOST = 'apps-in-toss-api.toss.im';
const OAUTH = '/api-partner/v1/apps-in-toss/user/oauth2';
const EMAIL_DOMAIN = 'toss.sinsangpick.kr';

const pem = (v) => (v || '').replace(/\\n/g, '\n');

function tossRequest(method, path, { body, headers } = {}) {
  const cert = pem(process.env.TOSS_MTLS_CERT);
  const key = pem(process.env.TOSS_MTLS_KEY);
  if (!cert || !key) return Promise.reject(new Error('TOSS_MTLS_CERT / TOSS_MTLS_KEY 환경변수가 없습니다.'));
  const payload = body ? JSON.stringify(body) : null;
  return new Promise((resolve, reject) => {
    const r = https.request(
      {
        host: TOSS_HOST, path, method, cert, key, timeout: 8000,
        headers: {
          ...(payload ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } : {}),
          ...headers,
        },
      },
      (resp) => {
        let text = '';
        resp.on('data', (c) => { text += c; });
        resp.on('end', () => {
          try { resolve({ status: resp.statusCode, json: text ? JSON.parse(text) : {} }); }
          catch { reject(new Error(`토스 응답을 해석하지 못했습니다 (${resp.statusCode})`)); }
        });
      }
    );
    r.on('timeout', () => r.destroy(new Error('토스 서버 응답 시간 초과')));
    r.on('error', reject);
    if (payload) r.write(payload);
    r.end();
  });
}

// 토스 API 는 비즈니스 오류도 HTTP 200 + resultType FAIL 로 응답합니다.
function unwrap(res) {
  if (res.status !== 200 || res.json?.resultType !== 'SUCCESS') {
    const reason = res.json?.error?.reason || res.json?.error?.message || res.json?.reason || `HTTP ${res.status}`;
    const err = new Error(`토스 API 오류: ${reason}`);
    err.status = 502;
    throw err;
  }
  return res.json.success;
}

const emailOf = (userKey) => `toss_${userKey}@${EMAIL_DOMAIN}`;
const userKeyOf = (email) => {
  const m = /^toss_(\d+)@/.exec(email || '');
  return m ? Number(m[1]) : null;
};

function supabaseAdmin() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('서버에 Supabase 서비스 키가 설정되지 않았습니다.');
  const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
  const call = async (path, init = {}) => {
    const r = await fetch(`${url}${path}`, { ...init, headers: { ...headers, ...(init.headers || {}) } });
    const text = await r.text();
    let json = null;
    try { json = text ? JSON.parse(text) : null; } catch { /* 본문이 JSON 이 아님 */ }
    return { ok: r.ok, status: r.status, json };
  };
  return { url, key, call };
}

async function loginAction(req, res) {
  const { authorizationCode, referrer } = req.body || {};
  if (!authorizationCode || typeof authorizationCode !== 'string') {
    return res.status(400).json({ success: false, error: 'authorizationCode 가 필요합니다.' });
  }

  const token = unwrap(await tossRequest('POST', `${OAUTH}/generate-token`, {
    body: { authorizationCode, referrer: referrer || 'DEFAULT' },
  }));
  const me = unwrap(await tossRequest('GET', `${OAUTH}/login-me`, {
    headers: { Authorization: `Bearer ${token.accessToken}` },
  }));
  const userKey = me.userKey;
  if (!userKey) throw new Error('토스 사용자 식별값(userKey)을 받지 못했습니다.');

  const admin = supabaseAdmin();
  const email = emailOf(userKey);

  // 처음이면 만들고, 이미 있으면(422) 그대로 씁니다. 이름·전화번호 등 개인정보는 저장하지 않습니다.
  await admin.call('/auth/v1/admin/users', {
    method: 'POST',
    body: JSON.stringify({
      email, email_confirm: true,
      app_metadata: { provider: 'toss', toss_user_key: userKey },
      user_metadata: { provider: 'toss' },
    }),
  });

  const link = await admin.call('/auth/v1/admin/generate_link', {
    method: 'POST',
    body: JSON.stringify({ type: 'magiclink', email }),
  });
  const tokenHash = link.json?.hashed_token || link.json?.properties?.hashed_token;
  if (!link.ok || !tokenHash) throw new Error('로그인 세션을 만들지 못했습니다.');

  // 연결 끊기 콜백에서 계정을 찾을 수 있게 프로필에 이메일(가짜 주소)을 남깁니다.
  if (link.json?.id) {
    await admin.call(`/rest/v1/profiles?id=eq.${link.json.id}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ email, provider: 'toss' }),
    }).catch(() => {});
  }

  return res.status(200).json({ success: true, tokenHash, email });
}

// 사용자가 앱 안에서 탈퇴할 때: 토스 쪽 로그인 연결도 함께 끊습니다.
async function disconnectAction(req, res) {
  const bearer = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!bearer) return res.status(401).json({ success: false, error: '로그인이 필요합니다.' });
  const admin = supabaseAdmin();
  const me = await admin.call('/auth/v1/user', { headers: { Authorization: `Bearer ${bearer}` } });
  const userKey = userKeyOf(me.json?.email);
  if (!me.ok || !userKey) return res.status(200).json({ success: true, skipped: true });
  unwrap(await tossRequest('POST', `${OAUTH}/access/remove-by-user-key`, { body: { userKey } }));
  return res.status(200).json({ success: true });
}

// 토스 앱에서 연결을 끊거나(UNLINK) 약관 철회·토스 탈퇴가 일어났을 때 토스가 호출합니다.
async function unlinkAction(req, res) {
  const expected = process.env.TOSS_UNLINK_AUTH;
  const header = (req.headers.authorization || '').replace(/^Basic\s+/i, '');
  const received = header ? Buffer.from(header, 'base64').toString('utf8') : '';
  if (!expected || received !== expected) return res.status(401).json({ success: false });

  const src = req.method === 'GET' ? req.query : (req.body || {});
  const userKey = Number(src.userKey);
  if (!Number.isFinite(userKey) || userKey <= 0) return res.status(400).json({ success: false });

  const admin = supabaseAdmin();
  const found = await admin.call(`/rest/v1/profiles?email=eq.${encodeURIComponent(emailOf(userKey))}&select=id`);
  const uid = Array.isArray(found.json) ? found.json[0]?.id : null;
  if (uid) {
    for (const table of ['device_tokens', 'point_earn_daily', 'point_transactions', 'user_sanctions']) {
      await admin.call(`/rest/v1/${table}?user_id=eq.${uid}`, { method: 'DELETE' }).catch(() => {});
    }
    await admin.call(`/auth/v1/admin/users/${uid}`, { method: 'DELETE' });
  }
  return res.status(200).json({ success: true });
}

export default async function handleToss(req, res) {
  try {
    const action = req.query?.action;
    if (action === 'unlink') return await unlinkAction(req, res);
    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'POST only' });
    if (action === 'login') return await loginAction(req, res);
    if (action === 'disconnect') return await disconnectAction(req, res);
    return res.status(400).json({ success: false, error: `Unknown action: ${action}` });
  } catch (err) {
    console.error('[toss]', req.query?.action, err.message);
    return res.status(err.status || 500).json({ success: false, error: err.message });
  }
}
