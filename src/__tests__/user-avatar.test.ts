import { describe, it, expect, beforeEach } from 'vitest';
import { 
  DEFAULT_AVATAR, 
  AVATAR_PRESETS, 
  isValidCustomPhoto, 
  isKakaoOrSocialRawAvatar, 
  isDefaultOrSocialAvatar 
} from '../utils/avatars';

describe('User Profile Avatar Suite (앨범 프로필 사진 선택 및 소셜 방어 검증)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. 아바타 프리셋 삭제 정책 검증', () => {
    it('아바타 프리셋 목록은 비어 있어야 함 (앨범 직접 업로드 모드로 전환)', () => {
      expect(AVATAR_PRESETS.length).toBe(0);
    });

    it('기본 아바타는 공식 로고로 유지되어야 함', () => {
      expect(DEFAULT_AVATAR).toBe('/logo.png');
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

  describe('3. 앨범 커스텀 프로필 사진 유효성 검증', () => {
    it('유저가 앨범에서 선택하여 업로드한 Base64 JPEG/PNG Data URL은 유효한 사진으로 인정되어야 함', () => {
      const uploadedJpeg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...';
      const uploadedPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...';
      expect(isValidCustomPhoto(uploadedJpeg)).toBe(true);
      expect(isValidCustomPhoto(uploadedPng)).toBe(true);
    });

    it('로컬 스토리지 키 유무와 무관하게 유효한 URL이면 인정되어야 함 (기기 변경/캐시 삭제 시에도 DB 보존)', () => {
      const uploadedJpeg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...';
      expect(localStorage.getItem('sinsangpick_custom_photo_user123')).toBeNull();
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
