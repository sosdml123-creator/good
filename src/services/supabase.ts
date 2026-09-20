import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { SignInWithApple } from '@capacitor-community/apple-sign-in';
import { withTimeout } from '../utils/networkUtils';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lyyzhldazfyrpprdvmeg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_P8eHIISOPV3KKP_l-Gxx_A_cAjfyR-C';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-id')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

export interface DBProfile {
  id: string;
  display_name: string;
  avatar_url: string;
  level: string;
  points: number;
  created_at: string;
}

export interface DBProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  sub_category?: string;
  item_type?: 'packaged' | 'fresh' | 'restaurant';
  image: string;
  release_date?: string;
  price: number;
  discount_rate?: number;
  overall_rating: number;
  rating_count: number;
  detailed_rating?: any;
  fresh_metrics?: any;
  brand_rankings?: any;
  restaurant_info?: any;
  description?: string;
  best_quotes?: string[];
  stores?: string[];
  repurchase_percent?: number;
  calories?: number;
  volume?: string;
  is_today?: boolean;
  is_hot?: boolean;
  nutrition?: any;
  ingredients?: string;
  allergens?: string[];
  origin?: string;
  manufacturer?: string;
  storage_method?: string;
  shelf_life?: string;
  precautions?: string;
  store_stocks?: any;
  created_at?: string;
  updated_at?: string;
}

export interface DBReview {
  id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  user_level?: string;
  rating: number;
  detailed_rating?: any;
  fresh_metrics?: any;
  content: string;
  images?: string[];
  likes_count: number;
  comments_count: number;
  tags?: string[];
  created_at: string;
}

export interface DBCommunityPost {
  id: string;
  category: '인기글' | '자유게시판' | '질문/답변' | '이벤트';
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  author_level?: string;
  likes_count: number;
  comments_count: number;
  images?: string[];
  created_at: string;
}

export interface DBReviewComment {
  id: string;
  review_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  user_level?: string;
  content: string;
  created_at: string;
}

export interface DBPostComment {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  user_level?: string;
  content: string;
  created_at: string;
}

/**
 * Ensures an authenticated user session exists (Anonymous auth as default).
 */
export const ensureSupabaseAuth = async (): Promise<{ user: User | null; session: Session | null }> => {
  if (!supabase) return { user: null, session: null };

  try {
    const sessionRes = await withTimeout(
      supabase.auth.getSession(),
      5000,
      { data: { session: null }, error: null } as any
    );
    const session = sessionRes?.data?.session;
    if (session?.user) {
      return { user: session.user, session };
    }

    // Try anonymous sign in if supported
    const anonRes = await withTimeout(
      supabase.auth.signInAnonymously(),
      5000,
      { data: { user: null, session: null }, error: new Error('Auth Timeout') } as any
    );
    const { data, error } = anonRes;
    if (error) {
      console.warn('[Supabase Auth] Anonymous sign-in warning:', error.message);
      return { user: null, session: null };
    }
    return { user: data.user, session: data.session };
  } catch (err) {
    console.warn('[Supabase Auth] Session init error:', err);
    return { user: null, session: null };
  }
};

/**
 * Returns appropriate redirect URL for OAuth based on platform.
 * Native iOS/Android apps use custom URL scheme 'sinsangpick://auth-callback',
 * while Web browsers use window.location.origin.
 */
export const getAuthRedirectUri = (): string => {
  if (Capacitor.isNativePlatform()) {
    return 'sinsangpick://auth-callback';
  }
  return window.location.origin;
};

/**
 * Parses and processes OAuth tokens from deep link URL or web redirect
 */
export const handleAuthCallbackUrl = async (url: string): Promise<boolean> => {
  if (!supabase) return false;
  
  try {
    // Close in-app browser sheet if open on native
    if (Capacitor.isNativePlatform()) {
      await Browser.close().catch(() => {});
    }
  } catch (e) {
    // ignore
  }

  try {
    // Check for OAuth errors in URL (e.g., user cancelled login)
    if (url.includes('error=') || url.includes('error_description=')) {
      const parsedUrl = new URL(url.startsWith('http') ? url : `https://dummy.com/${url.replace(/^[a-zA-Z0-9_-]+:\/\//, '')}`);
      const errorDesc = parsedUrl.searchParams.get('error_description') || parsedUrl.searchParams.get('error');
      console.warn('[Supabase Auth] OAuth redirect error:', errorDesc);
      return false;
    }

    // 1. PKCE flow with authorization code: ?code=xxx or #code=xxx
    let code: string | null = null;
    if (url.includes('code=')) {
      try {
        const parsedUrl = new URL(url.startsWith('http') ? url : `https://dummy.com/${url.replace(/^[a-zA-Z0-9_-]+:\/\//, '')}`);
        code = parsedUrl.searchParams.get('code');
        if (!code && parsedUrl.hash) {
          const hashParams = new URLSearchParams(parsedUrl.hash.replace(/^#/, ''));
          code = hashParams.get('code');
        }
      } catch (e) {
        // Fallback manual regex match
        const codeMatch = url.match(/[?&#]code=([^&#]+)/);
        if (codeMatch) {
          code = decodeURIComponent(codeMatch[1]);
        }
      }

      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error && data?.session) {
          console.log('[Supabase Auth] PKCE session exchange successful');
          return true;
        }
        if (error) {
          console.warn('[Supabase Auth] PKCE exchange warning:', error.message);
          // If exchange failed, check if session already exists
          const { data: currentSession } = await supabase.auth.getSession();
          if (currentSession?.session) return true;
        }
      }
    }

    // 2. Implicit flow with access_token and refresh_token in hash: #access_token=xxx&refresh_token=yyy
    if (url.includes('access_token=') && url.includes('refresh_token=')) {
      let accessToken: string | null = null;
      let refreshToken: string | null = null;

      try {
        const parsedUrl = new URL(url.startsWith('http') ? url : `https://dummy.com/${url.replace(/^[a-zA-Z0-9_-]+:\/\//, '')}`);
        const hashStr = parsedUrl.hash ? parsedUrl.hash.replace(/^#/, '') : '';
        const params = new URLSearchParams(hashStr || parsedUrl.search);
        accessToken = params.get('access_token');
        refreshToken = params.get('refresh_token');
      } catch (e) {
        const tokenMatch = url.match(/[?&#]access_token=([^&#]+)/);
        const refreshMatch = url.match(/[?&#]refresh_token=([^&#]+)/);
        if (tokenMatch) accessToken = decodeURIComponent(tokenMatch[1]);
        if (refreshMatch) refreshToken = decodeURIComponent(refreshMatch[1]);
      }

      if (accessToken && refreshToken) {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (!error && data?.session) {
          console.log('[Supabase Auth] SetSession from token successful');
          return true;
        }
        console.warn('[Supabase Auth] SetSession error:', error);
      }
    }
  } catch (err) {
    console.error('[Supabase Auth] Failed to handle callback URL:', err);
  }

  return false;
};

/**
 * Generic OAuth sign-in runner supporting both Capacitor Native & Web
 */
const startOAuth = async (provider: 'apple' | 'google' | 'kakao') => {
  if (!supabase) return;
  const isNative = Capacitor.isNativePlatform();
  const redirectTo = getAuthRedirectUri();

  if (isNative) {
    // Native app flow: request URL without auto-redirecting webview, then open in system browser sheet
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });
    if (error) throw error;
    if (data?.url) {
      await Browser.open({
        url: data.url,
        windowName: '_self',
        presentationStyle: 'popover',
      });
    }
  } else {
    // Web browser flow
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    });
    if (error) throw error;
  }
};

/**
 * Generates a cryptographically random raw nonce string
 */
const generateRawNonce = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  const randomValues = new Uint8Array(32);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < randomValues.length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
};

/**
 * Computes SHA-256 hex string of the given text for Apple authentication
 */
const sha256Hex = async (str: string): Promise<string> => {
  const buffer = new TextEncoder().encode(str);
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Google OAuth sign-in helper
 */
export const signInWithGoogle = async () => {
  await startOAuth('google');
};

/**
 * Decodes and parses payload from a JWT token string
 */
const parseJwtPayload = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.warn('[JWT Parse Error]', e);
    return null;
  }
};

/**
 * Apple Sign-in helper (아이폰 네이티브 모달 / 웹 OAuth 호환)
 * - iOS Native (iPhone 앱): @capacitor-community/apple-sign-in 네이티브 시스템 시트를 띄우고 Supabase signInWithIdToken으로 웹 브라우저 전환 없이 즉시 로그인
 * - Web / 기타 환경: Supabase OAuth 리다이렉트 방식 사용
 */
export const signInWithApple = async () => {
  if (!supabase) return null;
  const isIosNative = Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios';

  if (isIosNative) {
    const rawNonce = generateRawNonce();
    const hashedNonce = await sha256Hex(rawNonce);

    const res = await SignInWithApple.authorize({
      clientId: 'com.sinsangpick.app',
      redirectURI: getAuthRedirectUri(),
      scopes: 'email name',
      nonce: hashedNonce,
    });

    if (!res?.response?.identityToken) {
      throw new Error('Apple 로그인 토큰을 수신하지 못했습니다.');
    }

    const payload = parseJwtPayload(res.response.identityToken);
    const appleSubId = res.response.user || payload?.sub || ('apple_' + Math.random().toString(36).substring(2, 9));
    const appleEmail = res.response.email || payload?.email || '';
    const givenName = res.response.givenName;
    const familyName = res.response.familyName;
    const fullName = [familyName, givenName].filter(Boolean).join(' ').trim() || (appleEmail ? appleEmail.split('@')[0] : 'Apple 사용자');

    let sessionUser: User | null = null;

    try {
      // 1차 시도: rawNonce 포함 Supabase ID 토큰 검증
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: res.response.identityToken,
        nonce: rawNonce,
      });

      if (!error && data?.user) {
        sessionUser = data.user;
      } else {
        console.warn('[Supabase Auth] 1st signInWithIdToken warning:', error?.message);
        // 2차 시도: nonce 생략 검증
        const { data: data2, error: error2 } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: res.response.identityToken,
        });
        if (!error2 && data2?.user) {
          sessionUser = data2.user;
        } else {
          console.warn('[Supabase Auth] 2nd signInWithIdToken warning:', error2?.message);
        }
      }
    } catch (e) {
      console.warn('[Supabase Auth] signInWithIdToken exception:', e);
    }

    if (fullName && sessionUser) {
      await supabase.auth.updateUser({
        data: { full_name: fullName, name: fullName },
      }).catch(() => {});
    }

    return {
      user: sessionUser || {
        id: appleSubId,
        email: appleEmail,
        user_metadata: { full_name: fullName, name: fullName },
        app_metadata: { provider: 'apple' },
        is_anonymous: false,
      },
      displayName: fullName,
      provider: 'apple' as const,
    };
  } else {
    await startOAuth('apple');
    return null;
  }
};

/**
 * Kakao OAuth sign-in helper
 */
export const signInWithKakao = async () => {
  await startOAuth('kakao');
};

/**
 * Sign out helper
 */
export const signOutSupabase = async () => {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Deletes current authenticated user account and their profile data from Supabase.
 * - Calls SECURITY DEFINER RPC delete_user_account() to remove auth.users & related rows.
 * - Falls back to direct row deletion if RPC is not available.
 * - Cleans up current session.
 */
export const deleteCurrentUserAccount = async (): Promise<void> => {
  if (!supabase) return;

  try {
    // 1. Try secure RPC delete_user_account
    const { error: rpcError } = await supabase.rpc('delete_user_account');
    if (rpcError) {
      console.warn('[Supabase Auth] RPC delete_user_account fallback:', rpcError.message);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        // Fallback: cleanup client-accessible tables
        try { await supabase.from('device_tokens').delete().eq('user_id', user.id); } catch {}
        try { await supabase.from('review_likes').delete().eq('user_id', user.id); } catch {}
        try { await supabase.from('post_likes').delete().eq('user_id', user.id); } catch {}
        try { await supabase.from('profiles').delete().eq('id', user.id); } catch {}
      }
    }
  } catch (err) {
    console.warn('[Supabase Auth] deleteCurrentUserAccount exception:', err);
  } finally {
    // Always sign out to clear cached auth tokens
    try { await supabase.auth.signOut(); } catch {}
  }
};
