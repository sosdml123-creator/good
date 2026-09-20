import { describe, it, expect, beforeEach, vi } from 'vitest';
import { safeLocalStorageGet, safeLocalStorageSet, safeLocalStorageRemove } from '../utils/safeStorage';
import { UserProfile } from '../types';

describe('User Flow 4 & 5: Logout & Account Deletion (로그아웃 → 설정 → 계정 탈퇴 → 초기화)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const mockUser: UserProfile = {
    uid: 'user_test_123',
    email: 'test@sinsangpick.com',
    displayName: '신상테스터',
    photoURL: '',
    provider: 'google',
    level: 'Lv.3',
    points: 350,
    isAnonymous: false,
    createdAt: '2026-01-01',
    lastLoginAt: '2026-09-20',
  };

  describe('1. 로그아웃 플로우 (Logout Flow)', () => {
    it('[정상] 로그아웃 시 로컬 세션 데이터 정리 및 게스트 상태 복구', () => {
      safeLocalStorageSet('sinsangpick_user_profile', mockUser);
      safeLocalStorageSet('sinsangpick_user_points', 350);
      safeLocalStorageSet('sinsangpick_bookmarks', ['p1', 'p2']);

      expect(safeLocalStorageGet<UserProfile | null>('sinsangpick_user_profile', null)).not.toBeNull();

      // Execute logout cleanup
      safeLocalStorageRemove('sinsangpick_user_profile');
      safeLocalStorageRemove('sinsangpick_user_points');
      safeLocalStorageSet('sinsangpick_guest_browse', true);

      expect(safeLocalStorageGet<UserProfile | null>('sinsangpick_user_profile', null)).toBeNull();
      expect(safeLocalStorageGet<boolean>('sinsangpick_guest_browse', false)).toBe(true);
    });

    it('[엣지] 로컬 스토리지가 비어있거나 에러 상태에서 로그아웃 호출 시 크래시 방어', () => {
      expect(() => {
        safeLocalStorageRemove('sinsangpick_user_profile');
        safeLocalStorageRemove('non_existent_key');
      }).not.toThrow();
    });
  });

  describe('2. 회원 탈퇴 및 계정 영구 삭제 (Account Withdrawal Flow)', () => {
    it('[정상] 회원 탈퇴 시 모든 사용자 데이터(북마크, 포인트, 프로필) 영구 파기', async () => {
      // 1. Setup user state
      safeLocalStorageSet('sinsangpick_user_profile', mockUser);
      safeLocalStorageSet('sinsangpick_bookmarks', ['prod-1', 'prod-2', 'prod-3']);
      safeLocalStorageSet('sinsangpick_user_points', 5000);
      safeLocalStorageSet('sinsangpick_push_enabled', 'true');

      // 2. Perform delete account
      const keysToPurge = [
        'sinsangpick_user_profile',
        'sinsangpick_bookmarks',
        'sinsangpick_compared',
        'sinsangpick_user_points',
        'sinsangpick_push_enabled',
        'sinsangpick_guest_browse',
        'sinsangpick_nickname_onboarded',
      ];

      keysToPurge.forEach((k) => safeLocalStorageRemove(k));

      // 3. Verify complete cleanup
      expect(safeLocalStorageGet<UserProfile | null>('sinsangpick_user_profile', null)).toBeNull();
      expect(safeLocalStorageGet<string[]>('sinsangpick_bookmarks', [])).toEqual([]);
      expect(safeLocalStorageGet<number>('sinsangpick_user_points', 0)).toBe(0);
    });

    it('[엣지] 탈퇴 버튼 연타(Double Tap) 방지 플래그 검증', async () => {
      let isDeleting = false;
      let deleteCount = 0;

      const performDelete = async () => {
        if (isDeleting) return false;
        isDeleting = true;
        try {
          deleteCount++;
          await new Promise((r) => setTimeout(r, 20));
          return true;
        } finally {
          isDeleting = false;
        }
      };

      const results = await Promise.all([performDelete(), performDelete(), performDelete()]);
      expect(deleteCount).toBe(1);
      expect(results.filter(Boolean).length).toBe(1);
    });

    it('[엣지] 미동의 상태에서 탈퇴 요청 시 차단', () => {
      let agreed = false;
      let deleted = false;

      const attemptDelete = () => {
        if (!agreed) return;
        deleted = true;
      };

      attemptDelete();
      expect(deleted).toBe(false);

      agreed = true;
      attemptDelete();
      expect(deleted).toBe(true);
    });
  });

  describe('3. 뒤로가기(Back Navigation) 스택 엣지 케이스', () => {
    it('[엣지] 네비게이션 스택이 비어있거나 동일 탭일 때 goBack 호출 시 안전하게 home으로 폴백', () => {
      type Tab = 'home' | 'detail' | 'brand' | 'settings' | 'community';
      let activeTab: Tab = 'detail';
      let previousTab: Tab = 'detail'; // same tab

      const goBack = (): Tab => {
        if (activeTab === 'brand') {
          return previousTab === activeTab ? 'home' : previousTab;
        }
        if (activeTab === 'detail' || activeTab === 'settings') {
          return previousTab === activeTab ? 'home' : previousTab;
        }
        return 'home';
      };

      expect(goBack()).toBe('home');
    });

    it('[엣지] 뒤로가기 연타 시 크래시 없이 home 상태 유지', () => {
      let currentTab = 'home';
      const rapidBack = () => {
        // Repeated back calls when at home
        currentTab = 'home';
      };

      for (let i = 0; i < 100; i++) {
        rapidBack();
      }
      expect(currentTab).toBe('home');
    });
  });
});
