import { supabase } from './supabase';

/** 약관을 바꾸면 이 값을 올리면 됩니다 (기존 회원도 다시 동의 화면을 거치게 하려면 별도 처리 필요) */
export const TERMS_VERSION = '2026-11-18';

const doneKey = (uid: string) => `sinsangpick_onboarding_done_${uid}`;

export const isOnboardingDoneLocally = (uid: string): boolean => {
  try {
    return localStorage.getItem(doneKey(uid)) === 'true';
  } catch {
    return false;
  }
};

export const markOnboardingDoneLocally = (uid: string): void => {
  try {
    localStorage.setItem(doneKey(uid), 'true');
  } catch {
    // ignore
  }
};

/**
 * 이 계정이 가입 온보딩(약관 동의)을 마쳤는지.
 *  - done: 마침 · pending: 동의 기록 없음 · unknown: 확인 실패(네트워크·테이블 없음) → 화면을 막지 않습니다
 */
export const fetchOnboardingStatus = async (uid: string): Promise<'done' | 'pending' | 'unknown'> => {
  if (!supabase) return 'unknown';
  try {
    const { data, error } = await supabase
      .from('user_consents')
      .select('onboarding_completed_at')
      .eq('user_id', uid)
      .maybeSingle();
    if (error) return 'unknown';
    return data?.onboarding_completed_at ? 'done' : 'pending';
  } catch {
    return 'unknown';
  }
};

export interface OnboardingConsents {
  ageConfirmed: boolean;
  marketing: boolean;
  night: boolean;
}

/** 동의 기록을 계정에 저장합니다. 실패해도 이 기기에는 완료로 남겨 같은 화면이 반복되지 않게 합니다. */
export const saveOnboardingConsents = async (uid: string, consents: OnboardingConsents): Promise<boolean> => {
  markOnboardingDoneLocally(uid);
  if (!supabase) return false;
  const now = new Date().toISOString();
  try {
    const { error } = await supabase.from('user_consents').upsert(
      {
        user_id: uid,
        terms_version: TERMS_VERSION,
        terms_agreed_at: now,
        privacy_agreed_at: now,
        age_confirmed: consents.ageConfirmed,
        marketing_agreed: consents.marketing,
        marketing_updated_at: now,
        night_agreed: consents.marketing && consents.night,
        onboarding_completed_at: now,
        updated_at: now,
      },
      { onConflict: 'user_id' }
    );
    if (error) console.warn('[Consent] save failed:', error.message);
    return !error;
  } catch (err) {
    console.warn('[Consent] save error:', err);
    return false;
  }
};
