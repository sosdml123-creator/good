import { describe, it, expect, beforeEach } from 'vitest';
import { 
  DEFAULT_AVATAR, 
  AVATAR_PRESETS, 
  isValidCustomPhoto, 
  isKakaoOrSocialRawAvatar, 
  isDefaultOrSocialAvatar 
} from '../utils/avatars';

describe('User Profile Avatar Suite (프로필 사진 변경, 프리셋 아바타 및 소셜 방어 검증)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. 아바타 프리셋 목록 검증', () => {
    it('10종 이상의 풍성한 아바타 프리셋이 정의되어 있어야 함', () => {
      expect(AVATAR_PRESETS.length).toBeGreaterThanOrEqual(10);
    });

    it('모든 프리셋에 유효한 id, name, category, url, themeColor가 있어야 함', () => {
      AVATAR_PRESETS.forEach(preset => {
        expect(preset.id).toBeTruthy();
        expect(preset.name).toBeTruthy();
        expect(preset.url).toBeTruthy();
        expect(preset.category).toMatch(/official|character|food/);
        // data:image/svg+xml 또는 /logo.png
        expect(preset.url.startsWith('data:image/svg+xml') || preset.url === DEFAULT_AVATAR).toBe(true);
      });
    });

    it('신상픽 공식 로고가 프리셋에 포함되어 있어야 함', () => {
      const official = AVATAR_PRESETS.find(p => p.id === 'official-logo');
      expect(official).toBeDefined();
      expect(official?.url).toBe(DEFAULT_AVATAR);
    });
  });

  describe('2. 소셜 로그인 원본 프로필 사진 필터링 (개인정보 보호)', () => {
    it('카카오 CDN URL은 소셜 원본 사진으로 정확히 감지되어야 함', () => {
      const kakaoUrls = [
        'http://k.kakaocdn.net/dn/1234/img_640x640.jpg',
        'https://kakaocdn.net/profile.png',
        'https://daumcdn.net/profile_abc.jpg',
      ];
      kakaoUrls.forEach(url => {
        expect(isKakaoOrSocialRawAvatar(url)).toBe(true);
        expect(isValidCustomPhoto(url)).toBe(false);
      });
    });

    it('구글 사용자 계정 원본 프로필 URL도 감지되어야 함', () => {
      const googleUrl = 'https://lh3.googleusercontent.com/a/ACg8ocL...';
      expect(isKakaoOrSocialRawAvatar(googleUrl)).toBe(true);
      expect(isValidCustomPhoto(googleUrl)).toBe(false);
    });
  });

  describe('3. 커스텀 프로필 사진 및 프리셋 유효성 검증', () => {
    it('유저가 선택한 프리셋 SVG Data URL은 유효한 사진으로 인정되어야 함', () => {
      const samplePreset = AVATAR_PRESETS[1]; // 냥이 미식가 등
      expect(isValidCustomPhoto(samplePreset.url)).toBe(true);
    });

    it('유저가 업로드한 Base64 JPEG/PNG Data URL은 유효한 사진으로 인정되어야 함', () => {
      const uploadedJpeg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...';
      const uploadedPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...';
      expect(isValidCustomPhoto(uploadedJpeg)).toBe(true);
      expect(isValidCustomPhoto(uploadedPng)).toBe(true);
    });

    it('로컬 스토리지 키 유무와 무관하게 유효한 URL이면 인정되어야 함 (기기 변경/캐시 삭제 시에도 DB 보존)', () => {
      const uploadedJpeg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...';
      // sinsangpick_custom_photo_ 키가 없는 상태
      expect(localStorage.getItem('sinsangpick_custom_photo_user123')).toBeNull();
      // 유효성 통과 확인
      expect(isValidCustomPhoto(uploadedJpeg, 'user123')).toBe(true);
    });

    it('공식 로고 및 로컬 에셋 URL도 유효한 프로필로 처리됨', () => {
      expect(isValidCustomPhoto('/logo.png')).toBe(true);
    });

    it('빈 문자열이나 null/undefined는 유효하지 않음', () => {
      expect(isValidCustomPhoto('')).toBe(false);
      expect(isValidCustomPhoto(null)).toBe(false);
      expect(isValidCustomPhoto(undefined)).toBe(false);
    });
  });
});
