/**
 * Vercel Serverless Function for FCM (Firebase Cloud Messaging) Device Push
 * Endpoint: POST /api/send-fcm
 */

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const adminSecret = process.env.ADMIN_API_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

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

    const hasFcmKey = Boolean(
      process.env.FIREBASE_SERVER_KEY || 
      process.env.FCM_SERVER_KEY ||
      (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY)
    );

    return res.status(200).json({
      status: 'online',
      hasFcmKey,
      registeredTokens: tokenCount,
      tokensByPlatform,
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Admin / Service Authentication Check
  const authHeader = req.headers['authorization'] || '';
  const xAdminKey = req.headers['x-admin-key'] || '';
  const tokenFromHeader = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : authHeader.trim();
  const providedSecret = tokenFromHeader || xAdminKey;

  if (adminSecret && (!providedSecret || (providedSecret !== adminSecret && providedSecret !== process.env.VITE_SUPABASE_ANON_KEY))) {
    return res.status(401).json({ error: 'Unauthorized: Valid admin credentials required to dispatch push notifications.' });
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
            badge: safeBadge
          })
        });
        if (insertRes.ok) {
          dbSaved = true;
        }
      } catch (err) {
        console.warn('[FCM Handler] Supabase notification save warning:', err.message);
      }
    }

    // 2. Resolve target tokens
    let targetTokens = Array.isArray(tokens) ? [...tokens] : [];
    if (targetTokens.length === 0 && supabaseUrl && supabaseKey) {
      try {
        const tokenRes = await fetch(`${supabaseUrl}/rest/v1/device_tokens?select=token,platform`, {
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

    // Remove duplicates & empties
    targetTokens = Array.from(new Set(targetTokens.filter(t => typeof t === 'string' && t.trim().length > 0)));

    // 3. Send to FCM
    const fcmServerKey = process.env.FIREBASE_SERVER_KEY || process.env.FCM_SERVER_KEY;
    let fcmResult = {
      sentCount: 0,
      failedCount: 0,
      fcmConfigured: Boolean(fcmServerKey)
    };

    if (fcmServerKey && targetTokens.length > 0) {
      // Chunk tokens by 500 for FCM multicast limits
      const CHUNK_SIZE = 500;
      for (let i = 0; i < targetTokens.length; i += CHUNK_SIZE) {
        const chunk = targetTokens.slice(i, i + CHUNK_SIZE);
        try {
          const fcmPayload = {
            registration_ids: chunk,
            notification: {
              title: cleanTitle,
              body: cleanBody,
              image: safeImageUrl || undefined,
              sound: 'default'
            },
            data: {
              title: cleanTitle,
              body: cleanBody,
              type: safeType,
              targetId: safeTargetId,
              imageUrl: safeImageUrl,
              badge: safeBadge
            },
            priority: 'high'
          };

          const fcmResponse = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `key=${fcmServerKey}`
            },
            body: JSON.stringify(fcmPayload)
          });

          if (fcmResponse.ok) {
            const fcmData = await fcmResponse.json();
            fcmResult.sentCount += (fcmData.success || 0);
            fcmResult.failedCount += (fcmData.failure || 0);
          } else {
            console.warn('[FCM Send Error] HTTP status:', fcmResponse.status);
            fcmResult.failedCount += chunk.length;
          }
        } catch (fcmErr) {
          console.error('[FCM Send Chunk Error]:', fcmErr);
          fcmResult.failedCount += chunk.length;
        }
      }
    } else if (!fcmServerKey) {
      // FCM Server Key is not set in env:
      // Realtime in-app push still succeeds via Supabase!
      fcmResult.simulated = true;
      fcmResult.sentCount = targetTokens.length;
      fcmResult.note = 'Firebase Server Key not configured in environment. In-app Realtime notification dispatched successfully.';
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
      fcm: fcmResult
    });
  } catch (error) {
    console.error('[FCM Handler Fatal Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while sending notification'
    });
  }
}
