/**
 * Vercel Serverless Function for FCM (Firebase Cloud Messaging) Device Push
 * Endpoint: POST /api/send-fcm
 */

import { verifyAdminRequest } from './_lib/adminAuth.js';
import { getApnsConfig, isApnsToken, sendApnsNotifications } from './_lib/apns.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  // GET: Health check and token count info
  if (req.method === 'GET') {
    let tokenCount = 0;
    let tokensByPlatform = { ios: 0, android: 0, web: 0 };
    if (supabaseUrl && supabaseKey) {
      try {
        const tokenRes = await fetch(`${supabaseUrl}/rest/v1/device_tokens?select=platform`, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`
          }
        });
        if (tokenRes.ok) {
          const tokenList = await tokenRes.json();
          tokenCount = tokenList.length;
          tokenList.forEach(t => {
            const p = t.platform || 'web';
            tokensByPlatform[p] = (tokensByPlatform[p] || 0) + 1;
          });
        }
      } catch (e) {
        // Ignore Supabase query error
      }
    }

    const hasApnsKey = Boolean(getApnsConfig());

    return res.status(200).json({
      status: 'online',
      hasApnsKey,
      hasFcmKey: hasApnsKey,
      registeredTokens: tokenCount,
      tokensByPlatform,
      timestamp: new Date().toISOString()
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
      saveToDb = true
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

    const notifId = 'notif-' + Date.now();

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

    // 2. Resolve target tokens (iOS APNs 디바이스 토큰)
    let targetTokens = Array.isArray(tokens) ? [...tokens] : [];
    if (targetTokens.length === 0 && supabaseUrl && supabaseKey) {
      try {
        const tokenRes = await fetch(`${supabaseUrl}/rest/v1/device_tokens?select=token,platform&platform=eq.ios`, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`
          }
        });
        if (tokenRes.ok) {
          const list = await tokenRes.json();
          targetTokens = list.map(item => item.token).filter(Boolean);
        }
      } catch (err) {
        console.warn('[FCM Handler] Fetch tokens warning:', err.message);
      }
    }

    // Remove duplicates & anything that is not a real APNs device token
    targetTokens = Array.from(new Set(targetTokens.filter(isApnsToken)));

    // 3. Send device push via APNs
    const apnsConfig = getApnsConfig();
    let pushResult = {
      sentCount: 0,
      failedCount: 0,
      configured: Boolean(apnsConfig)
    };

    if (apnsConfig && targetTokens.length > 0) {
      try {
        const apnsResult = await sendApnsNotifications(apnsConfig, targetTokens, {
          title: cleanTitle,
          body: cleanBody,
          data: {
            type: safeType,
            targetId: safeTargetId,
            imageUrl: safeImageUrl,
            badge: safeBadge
          }
        });
        pushResult.sentCount = apnsResult.sentCount;
        pushResult.failedCount = apnsResult.failedCount;
        if (apnsResult.failedCount > 0) {
          pushResult.errors = apnsResult.errors;
          console.warn('[APNs] delivery failures:', apnsResult.errors);
        }

        // 더 이상 유효하지 않은 기기 토큰 정리
        if (apnsResult.invalidTokens.length > 0 && supabaseUrl && supabaseKey) {
          const inQuery = apnsResult.invalidTokens.map(t => `"${t}"`).join(',');
          await fetch(`${supabaseUrl}/rest/v1/device_tokens?token=in.(${inQuery})`, {
            method: 'DELETE',
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`
            }
          }).catch(() => {});
        }
      } catch (apnsErr) {
        console.error('[APNs Send Error]:', apnsErr);
        pushResult.failedCount = targetTokens.length;
        pushResult.errors = { [apnsErr.message || 'send_error']: targetTokens.length };
      }
    } else if (!apnsConfig) {
      pushResult.note = 'APNs key is not configured. Only the in-app notification was saved; no device push was sent.';
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
      targetTokensCount: targetTokens.length,
      push: pushResult,
      fcm: pushResult
    });
  } catch (error) {
    console.error('[FCM Handler Fatal Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while sending notification'
    });
  }
}
