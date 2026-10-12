// 포인트 적립 정책 (1P = 1원으로 e쿠폰 교환되므로 적립액이 곧 비용)
// 아래 숫자는 기본값이고, 어드민 '포인트 정책'에서 저장한 값이 있으면 applyPointPolicy 로 덮어씁니다.
// 서버 상한(guard_profiles_points 트리거)도 같은 저장값을 읽습니다.
export const POINT_POLICY = {
  nicknameBonus: 0, // 가입 기본 포인트 외 추가 지급 없음

  signup: 100, // 가입 시 기본 지급
  review: 10, // 사진·글자 수와 무관하게 동일
  reviewDailyLimit: 10, // 하루에 적립되는 리뷰 수 (상품당 1회)

  dailyCap: 100, // 모든 활동 합산 하루 최대 적립
};

// 어드민에서 수정할 수 있는 항목. 광고·e쿠폰 한도는 서버(api/giftishow.js)에서만 쓰입니다.
export interface PointPolicySettings {
  signup: number;
  review: number;
  reviewDailyLimit: number;
  dailyCap: number;
  adReward: number;
  adDailyLimit: number;
  couponUserDailyLimit: number;
}

const POLICY_STORAGE_KEY = 'sinsangpick_point_policy';
const CLIENT_POLICY_KEYS = ['signup', 'review', 'reviewDailyLimit', 'dailyCap'] as const;

/** 서버에 저장된 정책을 앱에 반영합니다. 다음 실행 때도 바로 쓰도록 기기에 보관합니다. */
export const applyPointPolicy = (remote: Partial<PointPolicySettings> | null | undefined, persist = true) => {
  if (!remote || typeof remote !== 'object') return;
  for (const key of CLIENT_POLICY_KEYS) {
    const value = remote[key];
    if (typeof value === 'number' && Number.isInteger(value) && value >= 0) POINT_POLICY[key] = value;
  }
  if (!persist) return;
  try {
    localStorage.setItem(POLICY_STORAGE_KEY, JSON.stringify(remote));
  } catch {
    // ignore
  }
};

try {
  applyPointPolicy(JSON.parse(localStorage.getItem(POLICY_STORAGE_KEY) || 'null'), false);
} catch {
  // ignore
}

export type PointRewardKind = 'review';

const kindDailyLimit = (kind: PointRewardKind): number =>
  ({ review: POINT_POLICY.reviewDailyLimit })[kind];

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
  if (used >= kindDailyLimit(kind)) return 0;
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
