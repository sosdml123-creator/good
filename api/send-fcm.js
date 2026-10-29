/**
 * Vercel Serverless Function: 기기 푸시 발송 (APNs·FCM) · 기기별 푸시 설정 · 연결 점검
 *
 * GET  /api/send-fcm                  공개 상태 (등록 기기 수, 키 설정 여부)
 * GET  /api/send-fcm?check=1          관리자 전용: APNs·FCM 인증 점검 (기기로는 아무것도 보내지 않음)
 * POST /api/send-fcm {action:'prefs', token, alertCategories}
 *                                     기기가 자기 관심 카테고리를 저장 (토큰 기준, 관리자 인증 없음)
 * POST /api/send-fcm {action:'unregister', token}
 *                                     알림을 끈 기기가 자기 토큰 행을 지움 (값이 정확히 일치하는 행만)
 * POST /api/send-fcm {action:'consent', token, marketingAgreed, nightAgreed}
 *                                     기기가 자기 광고·혜택 동의 값을 저장 (토큰 기준, 관리자 인증 없음)
 * POST /api/send-fcm {title, body, type, targetId, imageUrl, badge, id, tokens, saveToDb, messageKind}
 *                                     관리자 수동 발송 (인앱 알림함 저장 + iOS·Android 기기 푸시)
 *                                     messageKind: marketing(광고·혜택, 기본값: 마케팅 동의 기기만, 밤 9시~8시는 야간 혜택 동의 기기만) | service(서비스 안내: 푸시 허용 기기 전체)
 */
import { verifyAdminRequest } from './_lib/adminAuth.js';
import { getApnsConfig } from './_lib/apns.js';
import { getFcmConfig } from './_lib/fcm.js';
import {
  checkPushProviders,
  dispatchDevicePush,
  getSupabaseEnv,
  isPushToken,
  loadDevices,
  sanitizeAlertCategories,
  selectMessageDevices,
} from './_lib/devicePush.js';

const NOTIF_ID_REGEX = /^(?:notif|promo)-(\d{10,16})$/;

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url: supabaseUrl, key: supabaseKey } = getSupabaseEnv();

  // GET: 상태 조회 · 관리자 연결 점검
  if (req.method === 'GET') {
    if (req.query?.check) {
      const auth = await verifyAdminRequest(req);
      if (!auth.ok) {
        return res.status(auth.status).json({ error: auth.error });
      }
      return res.status(200).json({
        success: true,
        ...(await checkPushProviders()),
        timestamp: new Date().toISOString(),
      });
    }

    let registeredTokens = 0;
    const tokensByPlatform = { ios: 0, android: 0, web: 0 };
    // 광고·혜택 알림을 받을 수 있는 기기 수 (푸시를 허용한 iOS·Android 기준)
    const consent = { marketing: 0, night: 0 };
    if (supabaseUrl && supabaseKey) {
      try {
        const { devices } = await loadDevices({ url: supabaseUrl, key: supabaseKey, platforms: null });
        registeredTokens = devices.length;
        for (const device of devices) {
          tokensByPlatform[device.platform] = (tokensByPlatform[device.platform] || 0) + 1;
          if (device.platform !== 'web' && device.marketingAgreed) consent.marketing += 1;
          if (device.platform !== 'web' && device.nightAgreed) consent.night += 1;
        }
      } catch (e) {
        // Ignore Supabase query error
      }
    }

    return res.status(200).json({
      status: 'online',
      hasApnsKey: Boolean(getApnsConfig()),
      hasFcmKey: Boolean(getFcmConfig()),
      registeredTokens,
      tokensByPlatform,
      consent,
      timestamp: new Date().toISOString(),
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // 알림을 끈 기기: 앱이 자기 토큰 한 개만 발송 대상에서 뺍니다.
  // 관리자 인증 없이 동작하지만, 토큰 값과 정확히 일치하는 행 하나만 지웁니다 (토큰은 기기 밖에 노출되지 않습니다).
  if (req.body && req.body.action === 'unregister') {
    const token = String(req.body.token || '');
    if (!/^[A-Za-z0-9:_-]{8,300}$/.test(token)) {
      return res.status(400).json({ error: 'invalid token' });
    }
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      return res.status(500).json({ error: 'Supabase service key is not configured' });
    }
    try {
      const delRes = await fetch(`${supabaseUrl}/rest/v1/device_tokens?token=eq.${encodeURIComponent(token)}`, {
        method: 'DELETE',
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          Prefer: 'return=representation'
        }
      });
      if (!delRes.ok) {
        return res.status(502).json({ error: `token delete failed (${delRes.status})` });
      }
      const removed = await delRes.json();
      return res.status(200).json({ success: true, removed: Array.isArray(removed) ? removed.length : 0 });
    } catch (err) {
      console.warn('[FCM Handler] Unregister warning:', err.message);
      return res.status(502).json({ error: 'token delete failed' });
    }
  }

  // 기기 동의 값 저장: 앱이 자기 광고·혜택 동의 값을 올립니다 (토큰 기준, 관리자 인증 없음)
  if (req.body?.action === 'consent') {
    return saveConsent(req, res, supabaseUrl, supabaseKey);
  }

  // 기기 푸시 설정 저장: 토큰 기준이라 관리자 인증 없이 받습니다.
  if (req.body?.action === 'prefs') {
    return savePrefs(req, res, supabaseUrl, supabaseKey);
  }

  // Admin / Service Authentication Check
  const auth = await verifyAdminRequest(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error });
  }

  try {
    const {
      title,
      body,
      type = 'notice',
      targetId = '',
      imageUrl = '',
      badge = '알림',
      tokens = [],
      saveToDb = true,
      id,
      messageKind,
    } = req.body || {};

    const cleanTitle = String(title || '').trim().slice(0, 100);
    const cleanBody = String(body || '').trim().slice(0, 500);

    if (!cleanTitle || !cleanBody) {
      return res.status(400).json({ error: 'title and body are required' });
    }

    const safeType = ['notice', 'product', 'event'].includes(type) ? type : 'notice';
    const safeTargetId = String(targetId || '').slice(0, 100);
    const safeImageUrl = imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('http') ? imageUrl.slice(0, 500) : '';
    const safeBadge = String(badge || '알림').slice(0, 20);
    // 앱은 같은 알림이 실시간(인앱)과 기기 푸시로 두 번 들어와도 한 번만 보이도록 이 id 로 구분합니다.
    // 광고·혜택은 promo-, 서비스 안내는 notif- 로 시작합니다. 앱이 보낸 id 의 숫자를 살려 두면 같은 알림이 한 번만 보입니다.
    const safeKind = messageKind === 'service' ? 'service' : 'marketing';
    const notifId = `${safeKind === 'marketing' ? 'promo' : 'notif'}-${NOTIF_ID_REGEX.exec(String(id || ''))?.[1] || Date.now()}`;

    // 1. Save to Supabase notifications table if requested
    let dbSaved = false;
    if (saveToDb && supabaseUrl && supabaseKey) {
      try {
        const insertRes = await fetch(`${supabaseUrl}/rest/v1/notifications`, {
          method: 'POST',
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            id: notifId,
            title: cleanTitle,
            body: cleanBody,
            type: safeType,
            target_id: safeTargetId || null,
            image_url: safeImageUrl || null,
            badge: safeBadge,
            created_at: new Date().toISOString()
          })
        });
        if (insertRes.ok) {
          dbSaved = true;
        }
      } catch (err) {
        console.warn('[FCM Handler] Supabase notification save warning:', err.message);
      }
    }

    // 2. 발송 대상 기기: 토큰을 지정했으면 그 기기만, 지정하지 않았으면 전체 기기 (알림을 끈 기기는 행이 없어 빠짐).
    //    지정한 토큰이 모두 형식에 맞지 않으면 아무에게도 보내지 않습니다 (전체로 넓히지 않습니다).
    const requestedTokens = Array.isArray(tokens) ? tokens : [];
    const explicitTokens = [...new Set(requestedTokens.filter(isPushToken))];
    const wantsEveryone = requestedTokens.length === 0;
    let devices = [];
    let prefsSupported = true;
    if (supabaseUrl && supabaseKey && (wantsEveryone || explicitTokens.length > 0)) {
      try {
        const loaded = await loadDevices({
          url: supabaseUrl,
          key: supabaseKey,
          tokens: wantsEveryone ? null : explicitTokens,
        });
        devices = loaded.devices;
        prefsSupported = loaded.prefsSupported;
      } catch (err) {
        console.warn('[FCM Handler] Fetch devices warning:', err.message);
      }
    }

    // 발송 성격에 맞는 기기만 남깁니다 (광고·혜택은 동의 기기만)
    const { devices: targets, audience } = selectMessageDevices(devices, safeKind);

    // 3. 기기 푸시 발송 (iOS: APNs, Android: FCM)
    const push = await dispatchDevicePush({
      url: supabaseUrl,
      key: supabaseKey,
      devices: targets,
      message: {
        title: cleanTitle,
        body: cleanBody,
        data: {
          type: safeType,
          targetId: safeTargetId,
          imageUrl: safeImageUrl,
          badge: safeBadge,
          notifId,
        },
      },
    });
    const pushResult = { ...push, prefsSupported };
    if (push.errors && Object.keys(push.errors).length > 0) {
      console.warn('[Push] delivery failures:', push.errors);
    }

    return res.status(200).json({
      success: true,
      notification: {
        id: notifId,
        title: cleanTitle,
        body: cleanBody,
        type: safeType,
        targetId: safeTargetId,
        imageUrl: safeImageUrl,
        badge: safeBadge,
        createdAt: new Date().toISOString()
      },
      dbSaved,
      targetTokensCount: targets.length,
      // 동의 컬럼이 아직 없으면(마이그레이션 전) 광고·혜택은 보내지 않고, 응답에 그 사실을 알려줍니다
      audience: { ...audience, consentUnavailable: !prefsSupported },
      push: pushResult,
      fcm: pushResult,
    });
  } catch (error) {
    console.error('[FCM Handler Fatal Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while sending notification'
    });
  }
}

/** 기기가 자기 푸시 설정(켜짐/꺼짐, 관심 카테고리)을 저장합니다. 기기 토큰 행이 없으면 저장하지 않습니다. */
async function savePrefs(req, res, supabaseUrl, supabaseKey) {
  const { token, alertCategories } = req.body || {};
  if (!isPushToken(token)) {
    return res.status(400).json({ error: 'token is required' });
  }
  const categories = sanitizeAlertCategories(alertCategories);
  if (categories === undefined) {
    return res.status(400).json({ error: 'alertCategories must be an array or null' });
  }
  if (!supabaseUrl || !supabaseKey) {
    return res.status(503).json({ success: false, saved: false, reason: 'supabase_not_configured' });
  }

  const patchRes = await fetch(`${supabaseUrl}/rest/v1/device_tokens?token=eq.${encodeURIComponent(token)}`, {
    method: 'PATCH',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      alert_categories: categories,
      updated_at: new Date().toISOString(),
    }),
  }).catch(() => null);

  // 마이그레이션 전에는 설정 컬럼이 없어 여기서 실패합니다.
  if (!patchRes || !patchRes.ok) {
    return res.status(503).json({ success: false, saved: false, reason: 'prefs_unavailable' });
  }
  const rows = await patchRes.json().catch(() => []);
  const saved = Array.isArray(rows) && rows.length > 0;
  return res.status(200).json({
    success: true,
    saved,
    reason: saved ? undefined : 'not_registered',
  });
}

/** 기기가 자기 광고·혜택 동의 값을 저장합니다. 토큰 행이 없으면 저장하지 않습니다. */
async function saveConsent(req, res, supabaseUrl, supabaseKey) {
  const { token, marketingAgreed, nightAgreed } = req.body || {};
  if (!isPushToken(token)) {
    return res.status(400).json({ error: 'token is required' });
  }
  if (!supabaseUrl || !supabaseKey) {
    return res.status(503).json({ success: false, saved: false, reason: 'supabase_not_configured' });
  }

  const patchRes = await fetch(`${supabaseUrl}/rest/v1/device_tokens?token=eq.${encodeURIComponent(token)}`, {
    method: 'PATCH',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      marketing_agreed: marketingAgreed === true,
      night_agreed: nightAgreed === true,
      updated_at: new Date().toISOString(),
    }),
  }).catch(() => null);

  // 마이그레이션 전에는 동의 컬럼이 없어 여기서 실패합니다 (그동안 광고·혜택은 보내지 않습니다)
  if (!patchRes || !patchRes.ok) {
    return res.status(503).json({ success: false, saved: false, reason: 'consent_unavailable' });
  }
  const rows = await patchRes.json().catch(() => []);
  const saved = Array.isArray(rows) && rows.length > 0;
  return res.status(200).json({
    success: true,
    saved,
    reason: saved ? undefined : 'not_registered',
  });
}
