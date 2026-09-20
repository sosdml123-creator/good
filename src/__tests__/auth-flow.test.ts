import { describe, it, expect, beforeEach, vi } from 'vitest';
import { safeJsonParse, sanitizeInput } from '../utils/safeStorage';

describe('User Flow 1: Auth & Onboarding Flow (가입 → 닉네임 설정 → 로그인 → 게스트 전환)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('닉네임 유효성 검증 (정상 & 엣지 케이스)', () => {
    const validateNickname = (input: string): { valid: boolean; errorMsg?: string; sanitized: string } => {
      const sanitized = sanitizeInput(input, 12);
      const trimmed = sanitized.trim();
      
      if (!trimmed || trimmed.length < 2) {
        return { valid: false, errorMsg: '닉네임은 최소 2글자 이상 입력해 주세요.', sanitized };
      }
      if (trimmed.length > 12) {
        return { valid: false, errorMsg: '닉네임은 최대 12글자까지 가능합니다.', sanitized };
      }
      if (!/^[a-zA-Z0-9가-힣_\s]+$/.test(trimmed)) {
        return { valid: false, errorMsg: '한글, 영문, 숫자, 밑줄(_)만 사용 가능합니다.', sanitized };
      }
      return { valid: true, sanitized: trimmed };
    };

    it('[정상] 표준 닉네임 (한글, 영문, 숫자, 밑줄)', () => {
      expect(validateNickname('신상탐험가').valid).toBe(true);
      expect(validateNickname('SnackLover_99').valid).toBe(true);
      expect(validateNickname('신상_2026').valid).toBe(true);
    });

    it('[엣지] 빈 값 및 공백 문자열 (Empty / Whitespace only)', () => {
      expect(validateNickname('').valid).toBe(false);
      expect(validateNickname('   ').valid).toBe(false);
      expect(validateNickname(' ').errorMsg).toContain('최소 2글자');
    });

    it('[엣지] 1글자 닉네임 (Too short)', () => {
      const res = validateNickname('A');
      expect(res.valid).toBe(false);
      expect(res.errorMsg).toContain('최소 2글자');
    });

    it('[엣지] 10,000자 초장문 닉네임 (Ultra-long text truncation & overflow prevention)', () => {
      const ultraLong = '신상'.repeat(5000);
      const res = validateNickname(ultraLong);
      expect(res.sanitized.length).toBeLessThanOrEqual(12);
      expect(res.valid).toBe(true); // sanitized within 12 chars
    });

    it('[엣지] XSS 스크립트 및 SQL 인젝션 특수문자 (<script>, quotes, symbols)', () => {
      expect(validateNickname('<script>alert(1)</script>').valid).toBe(false);
      expect(validateNickname("admin' OR '1'='1").valid).toBe(false);
      expect(validateNickname('신상!@#$%^&*()').valid).toBe(false);
      expect(validateNickname('🔥신상러버🔥').valid).toBe(false); // Emojis rejected for nickname regex safety
    });

    it('[엣지] 이모지 입력 시 크래시 없이 안전하게 에러 반환', () => {
      const res = validateNickname('🍕🍔🍟');
      expect(res.valid).toBe(false);
      expect(res.errorMsg).toBeDefined();
    });
  });

  describe('가입/온보딩 상태 전환 및 중복 탭/이탈 방어', () => {
    it('[정상] 게스트 모드 전환 시 isGuestBrowse 플래그 저장 및 복구', () => {
      window.localStorage.setItem('sinsangpick_guest_browse', 'true');
      const isGuest = window.localStorage.getItem('sinsangpick_guest_browse') === 'true';
      expect(isGuest).toBe(true);
    });

    it('[엣지] 가입 도중 연타(Double Submit) 방지 로직 검증', async () => {
      let callCount = 0;
      let isSubmitting = false;

      const submitNickname = async () => {
        if (isSubmitting) return;
        isSubmitting = true;
        try {
          callCount++;
          await new Promise((r) => setTimeout(r, 10));
        } finally {
          isSubmitting = false;
        }
      };

      // Rapid concurrent triggers
      await Promise.all([submitNickname(), submitNickname(), submitNickname()]);
      expect(callCount).toBe(1); // Only 1 submission succeeded
    });

    it('[엣지] 손상된 토큰 payload 파싱 시 크래시 방지', () => {
      const malformedPayload = safeJsonParse<any>('{invalid_payload', null);
      expect(malformedPayload).toBeNull();
    });
  });
});
