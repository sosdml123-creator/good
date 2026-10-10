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

describe('5. 서버 슬라이드 확정 로직 (api/generate-content)', () => {
  const products = [
    {
      id: 'p1',
      name: '삼)곱창김참치마요',
      brand: 'CU',
      category: '간편식',
      image: 'https://example.com/p1.jpg',
      rating: 4.6,
      ratingCount: 12,
      detailedRating: { taste: 4.8, value: 4.2, portion: 4.0, repurchase: 4.5 },
    },
    { id: 'p2', name: '리뷰 없는 신상', brand: 'GS25', category: '과자', image: 'https://example.com/p2.jpg', rating: 0, ratingCount: 0 },
    { id: 'p3', name: '세번째 상품', brand: 'CU', category: '음료', image: '' },
  ];

  it('이미지·별점은 모델 출력이 아니라 상품 데이터에서만 채워져야 함', async () => {
    const { finalizeSlides } = await import('../../api/generate-content');
    const slides = finalizeSlides(
      [
        {
          templateType: 'review_card',
          props: { productId: 'p1', rating: 5.0, reviewCount: '9,999', productImage: 'https://fake/img.jpg', description: '설명' },
        },
        { templateType: 'review_card', props: { productId: 'p2', rating: 4.9, reviewCount: '500' } },
      ],
      products,
      'gen-1'
    );
    expect(slides[0].props.rating).toBe(4.6);
    expect(slides[0].props.reviewCount).toBe('12');
    expect(slides[0].props.productImage).toBe('https://example.com/p1.jpg');
    expect(slides[0].props.productName).toBe('곱창김참치마요');
    // 리뷰가 없는 상품은 별점을 지어내지 않고 숨긴다
    expect(slides[1].props.rating).toBeNull();
    expect(slides[1].props.reviewCount).toBeNull();
  });

  it('목록에 없는 상품이나 근거 데이터가 없는 슬라이드는 제외되어야 함', async () => {
    const { finalizeSlides } = await import('../../api/generate-content');
    const slides = finalizeSlides(
      [
        { templateType: 'cover_new', props: { title1: '오늘의', title2: '신상' } },
        { templateType: 'hook_photo', props: { productId: 'unknown', hookTitle: '없는 상품' } },
        { templateType: 'hook_photo', props: { productId: 'p3', hookTitle: '이미지 없는 상품' } },
        { templateType: 'rating_detail', props: { productId: 'p2', quote: '리뷰 없음' } },
        { templateType: 'rating_detail', props: { productId: 'p1', quote: '맛있다' } },
        { templateType: 'top5', props: { productIds: ['p1', 'p2'] } },
        { templateType: 'versus', props: { productIds: ['p1', 'p2'], question: '뭐가 더?' } },
        { templateType: 'reels_cover', props: { productId: 'p1', viewsCount: '99만' } },
        { templateType: 'not_a_template', props: {} },
      ],
      products,
      'gen-2'
    );
    expect(slides.map((s) => s.templateType)).toEqual(['cover_new', 'rating_detail', 'versus', 'reels_cover']);
    expect(slides[1].props.ratings).toEqual([
      { label: '맛', score: 4.8 },
      { label: '가성비', score: 4.2 },
      { label: '양', score: 4.0 },
      { label: '재구매', score: 4.5 },
    ]);
    expect(slides[3].props.viewsCount).toBeNull();
    expect(slides[0].id).toBe('gen-2-s1');
  });

  it('모델 응답 텍스트에서 JSON을 추출하고 KST 날짜를 계산해야 함', async () => {
    const { extractJsonObject, kstDateString } = await import('../../api/generate-content');
    expect(extractJsonObject('```json\n{"a": {"b": 1}}\n```')).toEqual({ a: { b: 1 } });
    expect(() => extractJsonObject('JSON 없음')).toThrow();
    // UTC 22:00 = 한국 시간 다음 날 07:00
    expect(kstDateString(new Date('2026-10-10T22:00:00Z'))).toBe('2026-10-11');
  });
});

describe('6. AI 키 없이 동작하는 규칙 기반 자동 조합 (api/generate-content)', () => {
  const make = (i: number, category: string, brand: string) => ({
    id: `p${i}`,
    name: `${brand} 테스트상품${i}`,
    brand,
    category,
    image: `https://example.com/${i}.jpg`,
    rating: 4 + (i % 10) / 10,
    ratingCount: i + 1,
    detailedRating: { taste: 4.5, value: 4, portion: 4, repurchase: 4.2 },
    description: `테스트상품${i} 설명입니다.`,
  });
  const candidates = [
    ...[1, 2, 3, 4, 5].map((i) => make(i, '과자', '오리온')),
    ...[6, 7, 8, 9].map((i) => make(i, '음료', '메가커피')),
    ...[10, 11, 12, 13, 14, 15, 16].map((i) => make(i, '간편식', 'CU')),
  ];

  it('하루치 5세트를 서로 겹치지 않는 상품으로 만들고, 모든 수치·이미지는 후보 데이터에서 와야 함', async () => {
    const { buildDailyByRules } = await import('../../api/generate-content');
    const posts = buildDailyByRules(candidates, [], '2026-10-11');
    expect(posts.length).toBe(5);
    expect(posts.map((p) => p.id)).toEqual([1, 2, 3, 4, 5].map((n) => `daily-2026-10-11-${n}`));
    expect(posts.every((p) => p.engine === 'rules' && p.caption && p.hashtags.length === 15)).toBe(true);

    const used = posts.flatMap((p) => p.productIds);
    expect(new Set(used).size).toBe(used.length);

    const images = new Set(candidates.map((c) => c.image));
    const json = JSON.stringify(posts);
    const urls = json.match(/https:\/\/[^"\\]+/g) || [];
    expect(urls.length).toBeGreaterThan(0);
    expect(urls.every((u) => images.has(u))).toBe(true);
  });

  it('최근에 다룬 상품은 피하고, 별점 없는 상품으로는 랭킹을 만들지 않아야 함', async () => {
    const { buildDailyByRules, buildRuleDraft } = await import('../../api/generate-content');
    const recent = ['p1', 'p6', 'p10'];
    const pool = [...candidates, ...[17, 18, 19].map((i) => make(i, '과자', '롯데'))];
    const posts = buildDailyByRules(pool, recent, '2026-10-12');
    expect(posts.flatMap((p) => p.productIds).some((id) => recent.includes(id))).toBe(false);

    const unrated = candidates.slice(0, 5).map((c) => ({ ...c, rating: 0, ratingCount: 0 }));
    expect(buildRuleDraft('top5', unrated, 1)).toBeNull();
  });
});
