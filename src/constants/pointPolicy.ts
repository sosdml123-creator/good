// 포인트 적립 정책 (1P = 1원으로 e쿠폰 교환되므로 적립액이 곧 비용)
// 숫자를 바꿀 때는 supabase/migrations 의 guard_profiles_points 상한도 함께 맞춥니다.
export const POINT_POLICY = {
  nicknameBonus: 0, // 가입 기본 100P 외 추가 지급 없음

  reviewBase: 10,
  reviewPhotoBonus: 15,
  reviewLongTextBonus: 5,
  reviewLongTextMin: 50, // 글자 수
  reviewDailyLimit: 3, // 하루에 적립되는 리뷰 수 (상품당 1회)

  recipe: 20,
  recipeDailyLimit: 1,

  post: 5,
  postDailyLimit: 2,

  dailyCap: 100, // 모든 활동 합산 하루 최대 적립
} as const;

export const REVIEW_MAX_POINTS =
  POINT_POLICY.reviewBase + POINT_POLICY.reviewPhotoBonus + POINT_POLICY.reviewLongTextBonus;

export type PointRewardKind = 'review' | 'recipe' | 'post';

const KIND_DAILY_LIMIT: Record<PointRewardKind, number> = {
  review: POINT_POLICY.reviewDailyLimit,
  recipe: POINT_POLICY.recipeDailyLimit,
  post: POINT_POLICY.postDailyLimit,
};

type DailyEarn = { day: string; total: number; counts: Partial<Record<PointRewardKind, number>> };

const kstToday = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);

/**
 * 오늘 남은 한도 안에서 실제로 적립할 포인트를 계산하고 사용량을 기록합니다.
 * 활동별 횟수 한도나 하루 합산 한도를 넘으면 0 을 돌려줍니다.
 */
export const claimDailyReward = (uid: string, kind: PointRewardKind, amount: number): number => {
  const key = `sinsangpick_point_earn_${uid}`;
  const today = kstToday();
  let state: DailyEarn = { day: today, total: 0, counts: {} };
  try {
    const stored = JSON.parse(localStorage.getItem(key) || 'null');
    if (stored && stored.day === today) state = { ...state, ...stored, counts: stored.counts || {} };
  } catch {
    // ignore
  }

  const used = state.counts[kind] || 0;
  if (used >= KIND_DAILY_LIMIT[kind]) return 0;
  const granted = Math.max(0, Math.min(amount, POINT_POLICY.dailyCap - state.total));
  if (granted <= 0) return 0;

  state.counts[kind] = used + 1;
  state.total += granted;
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    // ignore
  }
  return granted;
};
