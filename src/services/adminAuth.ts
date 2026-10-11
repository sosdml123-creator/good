import { supabase } from './supabase';

export type AdminAccess =
  | { status: 'admin'; userId: string }
  | { status: 'signed_out' }
  | { status: 'denied'; userId: string }
  | { status: 'error' };

/**
 * 현재 로그인된 Supabase 계정의 profiles.is_admin 값으로 관리자 여부를 판별
 */
export const checkAdminAccess = async (): Promise<AdminAccess> => {
  if (!supabase) return { status: 'error' };

  try {
    const { data } = await supabase.auth.getSession();
    const user = data?.session?.user;
    if (!user || user.is_anonymous) return { status: 'signed_out' };

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.warn('[Admin Auth] profile lookup warning:', error.message);
      return { status: 'error' };
    }

    return profile?.is_admin === true
      ? { status: 'admin', userId: user.id }
      : { status: 'denied', userId: user.id };
  } catch (err) {
    console.warn('[Admin Auth] access check failed:', err);
    return { status: 'error' };
  }
};

/**
 * 관리자 전용 서버리스 API 호출 시 첨부할 인증 헤더 (로그인 세션 토큰)
 */
export const getAdminAuthHeaders = async (): Promise<Record<string, string>> => {
  if (!supabase) return {};
  try {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
};

let adminSessionCache: { userId: string; isAdmin: boolean } | null = null;

/**
 * 현재 세션이 관리자인지 (계정별로 한 번만 조회)
 */
export const isAdminSession = async (): Promise<boolean> => {
  if (!supabase) return false;
  try {
    const { data } = await supabase.auth.getSession();
    const userId = data?.session?.user?.id;
    if (!userId) return false;
    if (adminSessionCache?.userId === userId) return adminSessionCache.isAdmin;
    const access = await checkAdminAccess();
    if (access.status === 'error') return false;
    adminSessionCache = { userId, isAdmin: access.status === 'admin' };
    return adminSessionCache.isAdmin;
  } catch {
    return false;
  }
};
