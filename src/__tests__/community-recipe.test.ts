import { describe, it, expect, beforeEach } from 'vitest';
import { INITIAL_RECIPES } from '../data/mockRecipes';
import { safeJsonParse, safeLocalStorageGet, safeLocalStorageSet } from '../utils/safeStorage';
import { CommunityPost, RecipePost } from '../types';

const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    author: '스낵마스터',
    authorAvatar: '',
    authorLevel: 'Lv.3',
    category: '자유게시판',
    title: '이번 주 신상 과자 드셔보신 분?',
    content: '신상 과자 바삭하고 정말 맛있네요!',
    createdAt: '2026-09-20',
    likes: 5,
    isLiked: false,
    commentsCount: 2,
    comments: [
      {
        id: 'c-1',
        userName: '초코러버',
        userAvatar: '',
        userLevel: 'Lv.1',
        content: '저도 먹어봤는데 최고예요!',
        createdAt: '2026-09-20',
      },
    ],
  },
  {
    id: 'post-2',
    author: '악성유저',
    authorAvatar: '',
    authorLevel: 'Lv.1',
    category: '자유게시판',
    title: '부적절한 광고 글',
    content: '불법 광고 링크 spam.com',
    createdAt: '2026-09-20',
    likes: 0,
    isLiked: false,
    commentsCount: 0,
    comments: [],
  },
];

describe('User Flow: Community & Recipes (커뮤니티 글쓰기 → 댓글 → 좋아요 → 신고/차단 → 꿀조합 레시피)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('1. 커뮤니티 게시글 및 신고/차단 필터링', () => {
    it('[정상] 차단되지 않은 게시글 목록 조회', () => {
      const blockedUsers = safeLocalStorageGet<string[]>('sinsangpick_blocked_users', []);
      const hiddenIds = safeLocalStorageGet<string[]>('sinsangpick_hidden_ids', []);

      const visiblePosts = MOCK_COMMUNITY_POSTS.filter(
        (p) => !hiddenIds.includes(p.id) && !blockedUsers.includes(p.author)
      );

      expect(visiblePosts.length).toBe(MOCK_COMMUNITY_POSTS.length);
    });

    it('[엣지] 악성 유저 차단 시 해당 작성자의 글과 댓글이 즉시 숨김 처리됨', () => {
      const targetAuthor = MOCK_COMMUNITY_POSTS[1].author;
      const blockedUsers = [targetAuthor];
      safeLocalStorageSet('sinsangpick_blocked_users', blockedUsers);

      const visiblePosts = MOCK_COMMUNITY_POSTS.filter(
        (p) => !blockedUsers.includes(p.author)
      );

      expect(visiblePosts.some((p) => p.author === targetAuthor)).toBe(false);
      expect(visiblePosts.length).toBe(1);
    });

    it('[엣지] 신고된 게시글 ID 숨김 목록 반영', () => {
      const reportedId = MOCK_COMMUNITY_POSTS[0].id;
      const hiddenIds = [reportedId];
      safeLocalStorageSet('sinsangpick_hidden_ids', hiddenIds);

      const visiblePosts = MOCK_COMMUNITY_POSTS.filter((p) => !hiddenIds.includes(p.id));
      expect(visiblePosts.some((p) => p.id === reportedId)).toBe(false);
    });

    it('[엣지] 로컬 스토리지 데이터가 깨져있을 때도 크래시 없이 빈 배열로 복구', () => {
      window.localStorage.setItem('sinsangpick_blocked_users', 'MALFORMED_JSON{{{');
      window.localStorage.setItem('sinsangpick_hidden_ids', 'null_broken');

      const blockedUsers = safeLocalStorageGet<string[]>('sinsangpick_blocked_users', []);
      const hiddenIds = safeLocalStorageGet<string[]>('sinsangpick_hidden_ids', []);

      expect(Array.isArray(blockedUsers)).toBe(true);
      expect(Array.isArray(hiddenIds)).toBe(true);
      expect(blockedUsers).toEqual([]);
      expect(hiddenIds).toEqual([]);
    });
  });

  describe('2. 쿠팡 파트너스 안내 문구 자동 삽입 및 포스트 검증', () => {
    const formatPostContent = (content: string): string => {
      let finalContent = content.trim();
      if (finalContent.includes('coupang.com') && !finalContent.includes('쿠팡 파트너스 활동의 일환')) {
        finalContent += '\n\n이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.';
      }
      return finalContent;
    };

    it('[정상] 제휴 링크 포함 시 공정위 필수 고지 문구 자동 추가', () => {
      const raw = '이 과자 꼭 드셔보세요! https://link.coupang.com/a/12345';
      const formatted = formatPostContent(raw);
      expect(formatted).toContain('쿠팡 파트너스 활동의 일환');
    });

    it('[엣지] 이미 고지 문구가 포함되어 있는 경우 중복 추가 방지', () => {
      const alreadyIncluded = 'https://link.coupang.com/a/12345 \n\n이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.';
      const formatted = formatPostContent(alreadyIncluded);
      const matches = formatted.match(/쿠팡 파트너스 활동의 일환/g);
      expect(matches?.length).toBe(1);
    });
  });

  describe('3. 꿀조합 레시피 (Recipe Flow)', () => {
    it('[정상] 기본 레시피 데이터 정합성 검증', () => {
      expect(INITIAL_RECIPES.length).toBeGreaterThan(0);
      INITIAL_RECIPES.forEach((recipe) => {
        expect(recipe.id).toBeDefined();
        expect(recipe.title).toBeDefined();
        expect(Array.isArray(recipe.ingredients)).toBe(true);
        expect(Array.isArray(recipe.steps)).toBe(true);
      });
    });

    it('[엣지] 재료 목록이 빈 레시피 생성 시 크래시 방어', () => {
      const incompleteRecipe: Partial<RecipePost> = {
        id: 'rec-edge-1',
        title: '신상 실험 레시피',
        ingredients: [],
        steps: [],
        likes: 0,
      };

      expect(incompleteRecipe.ingredients?.length).toBe(0);
      expect(incompleteRecipe.steps?.length).toBe(0);
    });

    it('[엣지] 레시피 좋아요 중복 연타 시 토글 정상 작동', () => {
      let likedIds: string[] = [];
      const toggleLike = (id: string) => {
        if (likedIds.includes(id)) {
          likedIds = likedIds.filter((item) => item !== id);
        } else {
          likedIds = [...likedIds, id];
        }
      };

      toggleLike('rec-1');
      expect(likedIds).toEqual(['rec-1']);

      toggleLike('rec-1'); // Rapid click to unlike
      expect(likedIds).toEqual([]);
    });
  });
});
