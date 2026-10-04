// src/__tests__/instagram-generator.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { INSTA_THEME } from '../components/admin/instagram/theme';
import { SAMPLE_INSTAGRAM_CONTENT } from '../components/admin/instagram/sampleData';
import { getProxiedImageUrl } from '../components/admin/instagram/imageUtils';
import { saveContentPost, fetchContentPosts } from '../components/admin/instagram/contentHistoryService';

describe('Instagram Content Generator Studio Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. 테마 및 디자인 토큰 검증', () => {
    it('신상픽 시그니처 옐로우(#FFD60A) 및 텍스트 컬러가 정의되어 있어야 함', () => {
      expect(INSTA_THEME.colors.primaryYellow).toBe('#FFD60A');
      expect(INSTA_THEME.colors.textMain).toBe('#111111');
      expect(INSTA_THEME.colors.bgWhite).toBe('#FFFFFF');
    });

    it('1:1, 4:5, 9:16 비율 규격이 정의되어 있어야 함', () => {
      expect(INSTA_THEME.aspectRatios['1:1'].exportWidth).toBe(1080);
      expect(INSTA_THEME.aspectRatios['1:1'].exportHeight).toBe(1080);
      expect(INSTA_THEME.aspectRatios['4:5'].exportWidth).toBe(1080);
      expect(INSTA_THEME.aspectRatios['4:5'].exportHeight).toBe(1350);
      expect(INSTA_THEME.aspectRatios['9:16'].exportWidth).toBe(1080);
      expect(INSTA_THEME.aspectRatios['9:16'].exportHeight).toBe(1920);
    });
  });

  describe('2. 9종 템플릿 샘플 데이터 검증', () => {
    it('첨부 시안과 일치하는 9개의 슬라이드가 모두 포함되어 있어야 함', () => {
      expect(SAMPLE_INSTAGRAM_CONTENT.slides.length).toBe(9);
      const templateTypes = SAMPLE_INSTAGRAM_CONTENT.slides.map((s) => s.templateType);
      expect(templateTypes).toContain('cover_new');
      expect(templateTypes).toContain('hook_photo');
      expect(templateTypes).toContain('review_card');
      expect(templateTypes).toContain('top5');
      expect(templateTypes).toContain('reels_cover');
      expect(templateTypes).toContain('rating_detail');
      expect(templateTypes).toContain('photo_dessert');
      expect(templateTypes).toContain('versus');
      expect(templateTypes).toContain('cta_app');
    });

    it('인스타그램 캡션 및 15개의 해시태그가 정상 구성되어 있어야 함', () => {
      expect(SAMPLE_INSTAGRAM_CONTENT.caption).toContain('신상픽');
      expect(SAMPLE_INSTAGRAM_CONTENT.hashtags.length).toBe(15);
      expect(SAMPLE_INSTAGRAM_CONTENT.hashtags[0]).toBe('#신상픽');
    });
  });

  describe('3. 외부 이미지 CORS 프록시 유틸 검증', () => {
    it('로컬 경로, data URL, Supabase Storage URL은 프록시 없이 유지되어야 함', () => {
      expect(getProxiedImageUrl('/app-icon.png')).toBe('/app-icon.png');
      expect(getProxiedImageUrl('data:image/png;base64,abc')).toBe('data:image/png;base64,abc');
      expect(getProxiedImageUrl('https://xyz.supabase.co/storage/v1/object/public/test.jpg')).toBe(
        'https://xyz.supabase.co/storage/v1/object/public/test.jpg'
      );
    });

    it('외부 도메인 이미지는 /api/image-proxy로 래핑되어야 함', () => {
      const externalUrl = 'https://images.unsplash.com/photo-test';
      const proxied = getProxiedImageUrl(externalUrl);
      expect(proxied).toBe(`/api/image-proxy?url=${encodeURIComponent(externalUrl)}`);
    });
  });

  describe('4. 이력 저장 및 복원 서비스 검증', () => {
    it('saveContentPost 호출 시 저장되고 fetchContentPosts로 복원 가능해야 함', async () => {
      const saved = await saveContentPost(SAMPLE_INSTAGRAM_CONTENT, 'auto');
      expect(saved.id).toBeDefined();
      expect(saved.prompt).toBe(SAMPLE_INSTAGRAM_CONTENT.prompt);

      const history = await fetchContentPosts();
      expect(history.length).toBeGreaterThan(0);
      expect(history[0].prompt).toBe(SAMPLE_INSTAGRAM_CONTENT.prompt);
    });
  });
});
