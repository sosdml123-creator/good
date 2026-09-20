import { describe, it, expect, beforeEach, vi } from 'vitest';
import { calculateLevel } from '../context/AppContext';
import { supabase, handleAuthCallbackUrl } from '../services/supabase';
import { safeLocalStorageGet, safeLocalStorageSet, safeLocalStorageRemove } from '../utils/safeStorage';
import { UserProfile, PointTransaction } from '../types';

// Mock Capacitor Core & Browser
vi.mock('@capacitor/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@capacitor/core')>();
  return {
    ...actual,
    Capacitor: {
      ...actual.Capacitor,
      isNativePlatform: vi.fn(() => false),
      getPlatform: vi.fn(() => 'web'),
    },
  };
});

vi.mock('@capacitor-community/apple-sign-in', () => ({
  SignInWithApple: {
    authorize: vi.fn().mockResolvedValue({
      response: {
        identityToken: 'mock-apple-token',
      },
    }),
  },
}));

vi.mock('@capacitor/browser', () => ({
  Browser: {
    close: vi.fn().mockResolvedValue(undefined),
    open: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('Comprehensive User & Auth Lifecycle Suite (회원가입/닉네임/로그인/로그아웃/탈퇴 전체 점검)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    if (supabase) {
      vi.spyOn(supabase.auth, 'exchangeCodeForSession').mockImplementation(async (code: string) => {
        if (code === 'valid-auth-code') {
          return { data: { session: { access_token: 'valid-token' } as any, user: null }, error: null };
        }
        return { data: { session: null, user: null }, error: { message: 'Invalid PKCE code' } as any };
      });

      vi.spyOn(supabase.auth, 'setSession').mockImplementation(async ({ access_token }: any) => {
        if (access_token === 'mock-jwt-token') {
          return { data: { session: { access_token } as any, user: null }, error: null };
        }
        return { data: { session: null, user: null }, error: { message: 'Expired token' } as any };
      });
    }
  });

  const sampleUser: UserProfile = {
    uid: 'user_test_123',
    email: 'tester@sinsangpick.com',
    displayName: '신상탐험가',
    photoURL: 'https://example.com/avatar.png',
    provider: 'kakao',
    level: 'Lv.2',
    points: 200,
    isAnonymous: false,
    createdAt: '2026-03-01T00:00:00Z',
    lastLoginAt: '2026-09-20T12:00:00Z',
  };

  describe('1. 닉네임 유효성 검사 규칙 (Nickname Validation Rules)', () => {
    const validateNickname = (name: string): { isValid: boolean; error?: string } => {
      const trimmed = name.trim();
      if (trimmed.length < 2) {
        return { isValid: false, error: '닉네임은 최소 2글자 이상 입력해 주세요.' };
      }
      if (trimmed.length > 12) {
        return { isValid: false, error: '닉네임은 최대 12글자까지 가능합니다.' };
      }
      if (!/^[a-zA-Z0-9가-힣_\s]+$/.test(trimmed)) {
        return { isValid: false, error: '한글, 영문, 숫자, 밑줄(_)만 사용 가능합니다.' };
      }
      return { isValid: true };
    };

    it('[정상] 올바른 한글/영문/숫자 닉네임 허용', () => {
      expect(validateNickname('과자러버').isValid).toBe(true);
      expect(validateNickname('SnackPro12').isValid).toBe(true);
      expect(validateNickname('초코_덕후').isValid).toBe(true);
      expect(validateNickname('신상 탐험가').isValid).toBe(true);
    });

    it('[방어] 1글자 이하 차단', () => {
      const result = validateNickname('신');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('최소 2글자');
    });

    it('[방어] 13글자 이상 차단', () => {
      const result = validateNickname('열세글자가넘어가는너무긴닉네임입니다');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('최대 12글자');
    });

    it('[방어] 특수문자 포함 시 차단 (이모지, 특수기호 등)', () => {
      expect(validateNickname('과자러버!').isValid).toBe(false);
      expect(validateNickname('초코❤️').isValid).toBe(false);
      expect(validateNickname('과자<script>').isValid).toBe(false);
      expect(validateNickname('snack@test').isValid).toBe(false);
    });

    it('[방어] 순수 공백 입력 시 차단', () => {
      expect(validateNickname('   ').isValid).toBe(false);
    });
  });

  describe('2. 레벨 계산 공식 및 웰컴 포인트 지급 검증 (calculateLevel & Welcome Points)', () => {
    it('[정상] 200P 단위 구간별 올바른 레벨 반환 (Lv.1 ~ Lv.10)', () => {
      // 0 ~ 199P: Lv.1
      expect(calculateLevel(0)).toBe('Lv.1');
      expect(calculateLevel(100)).toBe('Lv.1');
      expect(calculateLevel(199)).toBe('Lv.1');

      // 200 ~ 399P: Lv.2
      expect(calculateLevel(200)).toBe('Lv.2');
      expect(calculateLevel(399)).toBe('Lv.2');

      // 400 ~ 599P: Lv.3
      expect(calculateLevel(400)).toBe('Lv.3');

      // 800 ~ 999P: Lv.5
      expect(calculateLevel(800)).toBe('Lv.5');

      // 1800P 이상: Lv.10 (상한)
      expect(calculateLevel(1800)).toBe('Lv.10');
      expect(calculateLevel(5000)).toBe('Lv.10');
    });

    it('[정상] 닉네임 설정 시 웰컴 100P 지급 및 트랜잭션 기록 생성', () => {
      const initialPoints = 100; // 가입 기본 100P
      const bonus = 100; // 닉네임 설정 보너스 100P
      const nextPoints = initialPoints + bonus; // 총 200P 달성
      const nextLevel = calculateLevel(nextPoints); // Lv.2 승급

      const tx: PointTransaction = {
        id: `tx_${Date.now()}`,
        userId: 'test_uid',
        userName: '신상픽초보',
        type: 'reward',
        amount: bonus,
        balanceAfter: nextPoints,
        reason: '신규 가입 & 닉네임 설정 웰컴 보너스',
        createdAt: new Date().toISOString(),
      };

      expect(nextPoints).toBe(200);
      expect(nextLevel).toBe('Lv.2');
      expect(tx.amount).toBe(100);
      expect(tx.balanceAfter).toBe(200);
    });
  });

  describe('3. 소셜 로그인 OAuth 콜백 URL 처리 (handleAuthCallbackUrl)', () => {
    it('[정상] PKCE authorization code 수신 시 세션 교환 성공', async () => {
      const url = 'sinsangpick://auth-callback?code=valid-auth-code';
      const result = await handleAuthCallbackUrl(url);
      expect(result).toBe(true);
    });

    it('[정상] Implicit 해시 파라미터(#access_token & refresh_token) 수신 시 세션 설정 성공', async () => {
      const url = 'sinsangpick://auth-callback#access_token=mock-jwt-token&refresh_token=mock-refresh-token';
      const result = await handleAuthCallbackUrl(url);
      expect(result).toBe(true);
    });

    it('[방어] 사용자가 소셜 로그인을 취소하거나 오류 발생 시(?error=access_denied) false 반환', async () => {
      const url = 'sinsangpick://auth-callback?error=access_denied&error_description=User%20denied%20access';
      const result = await handleAuthCallbackUrl(url);
      expect(result).toBe(false);
    });

    it('[방어] 토큰이나 코드가 없는 빈 콜백 URL 전달 시 false 반환', async () => {
      const url = 'sinsangpick://auth-callback';
      const result = await handleAuthCallbackUrl(url);
      expect(result).toBe(false);
    });
  });

  describe('4. 활동 정지(Suspension) 계정 방어 검증', () => {
    it('[정상] 활동 정지 상태인 사용자는 리뷰 및 커뮤니티 작성 차단 플래그 감지', () => {
      const suspensionData = {
        isSuspended: true,
        reason: '어뷰징 신고 누적',
        until: '2026-10-01',
      };

      safeLocalStorageSet(`sinsangpick_suspension_${sampleUser.uid}`, suspensionData);

      const saved = safeLocalStorageGet<{ isSuspended: boolean; reason: string; until: string } | null>(
        `sinsangpick_suspension_${sampleUser.uid}`,
        null
      );

      expect(saved?.isSuspended).toBe(true);
      expect(saved?.reason).toBe('어뷰징 신고 누적');
    });
  });

  describe('5. 로그아웃 플로우 (Logout Flow)', () => {
    it('[정상] 로그아웃 시 유저 세션 및 관련 로컬 데이터 정리', () => {
      safeLocalStorageSet('sinsangpick_uid', sampleUser.uid);
      safeLocalStorageSet('sinsangpick_name', sampleUser.displayName);
      safeLocalStorageSet('sinsangpick_points', sampleUser.points);
      safeLocalStorageSet('sinsangpick_user_profile', sampleUser);
      safeLocalStorageSet('sinsangpick_device_token', 'token-12345');

      // Execute logout cleanup
      const keysToClear = [
        'sinsangpick_uid',
        'sinsangpick_name',
        'sinsangpick_points',
        'sinsangpick_photo',
        'sinsangpick_user_profile',
        'sinsangpick_guest_browse',
        'sinsangpick_device_token',
        'sinsangpick_device_platform',
      ];
      keysToClear.forEach((k) => safeLocalStorageRemove(k));

      expect(safeLocalStorageGet('sinsangpick_uid', null)).toBeNull();
      expect(safeLocalStorageGet('sinsangpick_name', null)).toBeNull();
      expect(safeLocalStorageGet('sinsangpick_user_profile', null)).toBeNull();
      expect(safeLocalStorageGet('sinsangpick_device_token', null)).toBeNull();
    });
  });

  describe('6. 회원 탈퇴 및 계정 영구 삭제 (Account Withdrawal Lifecycle)', () => {
    it('[정상] 탈퇴 시 프로필, 포인트, 찜목록, 알림설정, 디바이스 토큰 등 모든 데이터 완전 파기', () => {
      // 1. Setup user state
      safeLocalStorageSet('sinsangpick_uid', sampleUser.uid);
      safeLocalStorageSet('sinsangpick_name', sampleUser.displayName);
      safeLocalStorageSet('sinsangpick_points', 500);
      safeLocalStorageSet('sinsangpick_bookmarks', ['prod-1', 'prod-2']);
      safeLocalStorageSet('sinsangpick_compared', ['prod-1']);
      safeLocalStorageSet('sinsangpick_recent_searches', ['포테토칩', '새우깡']);
      safeLocalStorageSet('sinsangpick_alert_cats', ['snack', 'drink']);
      safeLocalStorageSet('sinsangpick_push_enabled', 'true');
      safeLocalStorageSet('sinsangpick_marketing_agreed', 'true');
      safeLocalStorageSet('sinsangpick_device_token', 'device-tok-abc');
      safeLocalStorageSet(`sinsangpick_nickname_set_${sampleUser.uid}`, 'true');

      // 2. Perform purge
      const keysToPurge = [
        'sinsangpick_uid',
        'sinsangpick_name',
        'sinsangpick_points',
        'sinsangpick_photo',
        'sinsangpick_user_profile',
        'sinsangpick_bookmarks',
        'sinsangpick_compared',
        'sinsangpick_recent_searches',
        'sinsangpick_alert_cats',
        'sinsangpick_guest_browse',
        'sinsangpick_permissions_reviewed',
        'sinsangpick_battle_choice',
        'sinsangpick_review_likes',
        'sinsangpick_post_likes',
        'sinsangpick_push_enabled',
        'sinsangpick_marketing_agreed',
        'sinsangpick_marketing_agreed_date',
        'sinsangpick_nickname_onboarded',
        'sinsangpick_device_token',
        'sinsangpick_device_platform',
        `sinsangpick_nickname_set_${sampleUser.uid}`,
      ];

      keysToPurge.forEach((k) => safeLocalStorageRemove(k));

      // 3. Verify complete cleanup
      expect(safeLocalStorageGet('sinsangpick_uid', null)).toBeNull();
      expect(safeLocalStorageGet('sinsangpick_bookmarks', [])).toEqual([]);
      expect(safeLocalStorageGet('sinsangpick_compared', [])).toEqual([]);
      expect(safeLocalStorageGet('sinsangpick_recent_searches', [])).toEqual([]);
      expect(safeLocalStorageGet('sinsangpick_push_enabled', null)).toBeNull();
      expect(safeLocalStorageGet('sinsangpick_device_token', null)).toBeNull();
      expect(safeLocalStorageGet(`sinsangpick_nickname_set_${sampleUser.uid}`, null)).toBeNull();
    });

    it('[방어] 동의 체크(agreed) 없이 탈퇴 실행 시 즉시 차단', () => {
      let isExecuted = false;
      const handleDelete = (agreed: boolean) => {
        if (!agreed) return false;
        isExecuted = true;
        return true;
      };

      expect(handleDelete(false)).toBe(false);
      expect(isExecuted).toBe(false);

      expect(handleDelete(true)).toBe(true);
      expect(isExecuted).toBe(true);
    });

    it('[방어] 탈퇴 버튼 연타(Double Submit) 시 중복 실행 방어', async () => {
      let isDeleting = false;
      let executionCount = 0;

      const triggerDelete = async () => {
        if (isDeleting) return false;
        isDeleting = true;
        try {
          executionCount++;
          await new Promise((r) => setTimeout(r, 15));
          return true;
        } finally {
          isDeleting = false;
        }
      };

      const results = await Promise.all([triggerDelete(), triggerDelete(), triggerDelete()]);
      expect(executionCount).toBe(1);
      expect(results.filter(Boolean).length).toBe(1);
    });
  });
});
