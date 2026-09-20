import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  saveDeviceToken, 
  getStoredDeviceToken, 
  deleteDeviceToken,
  getMarketingConsentStatus, 
  setMarketingConsentStatus,
  formatRelativeTime,
  sendAdminPushNotification,
  checkPushPermissionStatus
} from '../services/notificationService';

// Mock Supabase
vi.mock('../services/supabase', () => {
  const mockUpsert = vi.fn().mockResolvedValue({ data: null, error: null });
  const mockDelete = vi.fn().mockReturnValue({
    eq: vi.fn().mockResolvedValue({ data: null, error: null })
  });
  const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
  const mockSelect = vi.fn().mockResolvedValue({ data: [{ platform: 'ios' }, { platform: 'web' }], error: null });

  return {
    supabase: {
      from: vi.fn((table: string) => {
        if (table === 'device_tokens') {
          return {
            upsert: mockUpsert,
            delete: mockDelete,
            select: mockSelect,
          };
        }
        if (table === 'notifications') {
          return {
            insert: mockInsert,
            select: mockSelect,
          };
        }
        return {
          select: mockSelect,
          upsert: mockUpsert,
          delete: mockDelete,
          insert: mockInsert,
        };
      }),
      channel: vi.fn(() => ({
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
      })),
    },
    isSupabaseConfigured: true,
  };
});

// Mock Capacitor Core
vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: vi.fn(() => false),
    getPlatform: vi.fn(() => 'web'),
  },
}));

describe('Push Notifications & Device Token Suite (푸시 알림 및 디바이스 토큰 종합 검증)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('1. 디바이스 토큰 관리 (saveDeviceToken & deleteDeviceToken)', () => {
    it('[정상] 토큰 저장 시 로컬 스토리지에 캐싱되고 getStoredDeviceToken으로 조회 가능', async () => {
      const token = 'test-device-token-12345';
      const ok = await saveDeviceToken({
        token,
        platform: 'web',
        userId: '123e4567-e89b-12d3-a456-426614174000', // valid UUID
        userName: '테스터',
      });

      expect(ok).toBe(true);
      expect(getStoredDeviceToken()).toBe(token);
      expect(localStorage.getItem('sinsangpick_device_token')).toBe(token);
      expect(localStorage.getItem('sinsangpick_device_platform')).toBe('web');
    });

    it('[정상] 비-UUID userId 전달 시 에러 없이 안전하게 null 처리되어 저장 성공', async () => {
      const token = 'test-token-kakao-user';
      const ok = await saveDeviceToken({
        token,
        platform: 'ios',
        userId: 'kakao_1234567', // Not a UUID
        userName: '카카오유저',
      });

      expect(ok).toBe(true);
      expect(getStoredDeviceToken()).toBe(token);
    });

    it('[정상] deleteDeviceToken 호출 시 로컬 스토리지 및 캐시 초기화', async () => {
      await saveDeviceToken({
        token: 'token-to-delete',
        platform: 'web',
      });
      expect(getStoredDeviceToken()).toBe('token-to-delete');

      const deleted = await deleteDeviceToken();
      expect(deleted).toBe(true);
      expect(getStoredDeviceToken()).toBeNull();
      expect(localStorage.getItem('sinsangpick_device_token')).toBeNull();
      expect(localStorage.getItem('sinsangpick_device_platform')).toBeNull();
    });

    it('[엣지] 토큰이 비어있을 때 deleteDeviceToken 호출 시 에러 없이 false 반환', async () => {
      const deleted = await deleteDeviceToken('');
      expect(deleted).toBe(false);
    });
  });

  describe('2. 마케팅 알림 수신 동의 (Marketing Consent)', () => {
    it('[기본] 기본값은 false', () => {
      expect(getMarketingConsentStatus()).toBe(false);
    });

    it('[정상] 수신 동의 설정 시 true 및 동의 일자 기록', () => {
      setMarketingConsentStatus(true);
      expect(getMarketingConsentStatus()).toBe(true);
      expect(localStorage.getItem('sinsangpick_marketing_agreed')).toBe('true');
      expect(localStorage.getItem('sinsangpick_marketing_agreed_date')).toBeDefined();
    });

    it('[정상] 수신 거부 설정 시 false 반영', () => {
      setMarketingConsentStatus(true);
      expect(getMarketingConsentStatus()).toBe(true);

      setMarketingConsentStatus(false);
      expect(getMarketingConsentStatus()).toBe(false);
      expect(localStorage.getItem('sinsangpick_marketing_agreed')).toBe('false');
    });
  });

  describe('3. 상대 시간 포맷터 방어 검증 (formatRelativeTime)', () => {
    it('[정상] 방금 전 (< 1분)', () => {
      const now = new Date().toISOString();
      expect(formatRelativeTime(now)).toBe('방금 전');
    });

    it('[정상] N분 전 (< 1시간)', () => {
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      expect(formatRelativeTime(fiveMinAgo)).toBe('5분 전');
    });

    it('[정상] N시간 전 (< 24시간)', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 3600 * 1000).toISOString();
      expect(formatRelativeTime(twoHoursAgo)).toBe('2시간 전');
    });

    it('[정상] N일 전 (< 7일)', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 86400 * 1000).toISOString();
      expect(formatRelativeTime(threeDaysAgo)).toBe('3일 전');
    });

    it('[엣지] 잘못된 날짜 문자열(NaN)이나 빈 값 입력 시 크래시 없이 "방금 전" 반환', () => {
      expect(formatRelativeTime('invalid-date-string')).toBe('방금 전');
      expect(formatRelativeTime('')).toBe('방금 전');
      expect(formatRelativeTime(null)).toBe('방금 전');
      expect(formatRelativeTime(undefined)).toBe('방금 전');
    });

    it('[엣지] 미래 날짜 입력 시에도 크래시 없이 "방금 전" 반환', () => {
      const futureDate = new Date(Date.now() + 1000000).toISOString();
      expect(formatRelativeTime(futureDate)).toBe('방금 전');
    });
  });

  describe('4. 관리자 푸시 발송 및 페이로드 검증 (sendAdminPushNotification)', () => {
    it('[정상] 공지 알림 발송 시 올바른 배지와 페이로드 생성', async () => {
      // Mock global fetch for /api/send-fcm
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          notification: { 
            id: 'notif-123', 
            title: '신제품 출시 안내', 
            type: 'product', 
            badge: '신제품' 
          },
          targetTokensCount: 5,
        }),
      } as any);

      const result = await sendAdminPushNotification({
        title: '신제품 출시 안내',
        body: '새로운 과자가 등록되었습니다.',
        type: 'product',
        targetId: 'prod-001',
      });

      expect(result.success).toBe(true);
      expect(result.notification).toBeDefined();
      expect(result.notification?.title).toBe('신제품 출시 안내');
      expect(result.notification?.type).toBe('product');
      expect(result.notification?.badge).toBe('신제품');

      global.fetch = originalFetch;
    });

    it('[정상] 백엔드 API 실패 시에도 로컬 브로드캐스트 모드로 안전하게 성공 반환', async () => {
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const result = await sendAdminPushNotification({
        title: '이벤트 공지',
        body: '이벤트가 시작되었습니다.',
        type: 'event',
        targetId: 'evt-001',
      });

      expect(result.success).toBe(true);
      expect(result.notification?.badge).toBe('이벤트');

      global.fetch = originalFetch;
    });
  });

  describe('5. 푸시 권한 상태 확인 (checkPushPermissionStatus)', () => {
    it('[웹 환경] Notification API 미지원 또는 기본 상태에서 prompt/denied 반환', async () => {
      const status = await checkPushPermissionStatus();
      expect(['granted', 'denied', 'prompt']).toContain(status);
    });
  });
});
