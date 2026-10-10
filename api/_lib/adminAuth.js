/**
 * Shared admin authorization for serverless endpoints.
 *
 * A request is treated as admin when either:
 *  - it carries the server-only secret (ADMIN_API_KEY / service role key), or
 *  - it carries a Supabase user access token whose profile has is_admin = true.
 *
 * The public anon key is never accepted: it ships inside the client bundle.
 */
export async function verifyAdminRequest(req) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const serverSecrets = [process.env.ADMIN_API_KEY, serviceKey].filter(Boolean);

  const authHeader = String(req.headers['authorization'] || '');
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : '';
  const xAdminKey = String(req.headers['x-admin-key'] || '').trim();

  if (serverSecrets.some((secret) => secret === bearer || secret === xAdminKey)) {
    return { ok: true };
  }

  if (!bearer || !supabaseUrl || !(anonKey || serviceKey)) {
    return { ok: false, status: 401, error: 'Unauthorized: Admin authorization required.' };
  }

  try {
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: anonKey || serviceKey, Authorization: `Bearer ${bearer}` },
    });
    if (!userRes.ok) {
      return { ok: false, status: 401, error: 'Unauthorized: Invalid or expired session.' };
    }

    const user = await userRes.json();
    if (!user?.id || user.is_anonymous) {
      return { ok: false, status: 401, error: 'Unauthorized: Sign-in required.' };
    }

    const profileRes = await fetch(
      `${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=is_admin`,
      {
        headers: {
          apikey: serviceKey || anonKey,
          Authorization: `Bearer ${serviceKey || bearer}`,
        },
      }
    );
    const rows = profileRes.ok ? await profileRes.json() : [];
    if (Array.isArray(rows) && rows[0]?.is_admin === true) {
      return { ok: true, userId: user.id };
    }

    return { ok: false, status: 403, error: 'Forbidden: Admin privileges required.' };
  } catch (err) {
    console.error('[adminAuth] verification error', err);
    return { ok: false, status: 401, error: 'Unauthorized: Admin verification failed.' };
  }
}
