import { Capacitor } from '@capacitor/core';
import { fetchWithTimeout } from '../utils/networkUtils';
import { getAdminAuthHeaders } from './adminAuth';

export type BattleChoice = 'A' | 'B';

export interface BattleProductInfo {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
}

export interface BattleCounts {
  A: number;
  B: number;
}

/** 한 주(월~일) 단위 신상 배틀. 월~금 투표, 토·일 결과 공개, 월요일에 새 대결로 교체 */
export interface BattleRound {
  /** 해당 주 월요일 날짜 (KST, YYYY-MM-DD) */
  weekKey: string;
  phase: 'voting' | 'result';
  /** 결과 공개 시각 (토요일 0시 KST) */
  resultAt: string;
  /** 다음 대결 시작 시각 (다음 주 월요일 0시 KST) */
  nextRoundAt: string;
  productA: BattleProductInfo;
  productB: BattleProductInfo;
  myChoice: BattleChoice | null;
  totalVotes: number;
  /** 투표 기간에는 null (결과는 주말에 공개) */
  counts: BattleCounts | null;
  previous: {
    weekKey: string;
    productA: BattleProductInfo;
    productB: BattleProductInfo;
    counts: BattleCounts;
  } | null;
}

export interface BattleApiResult {
  ok: boolean;
  round?: BattleRound | null;
  code?: string;
  error?: string;
}

const battleApiUrl = () =>
  (Capacitor.isNativePlatform() ? 'https://www.sinsangpick.kr' : '') + '/api/battle';

const callBattleApi = async (init: RequestInit, query = ''): Promise<BattleApiResult> => {
  try {
    const authHeaders = await getAdminAuthHeaders();
    const res = await fetchWithTimeout(battleApiUrl() + query, {
      ...init,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...authHeaders },
    }, 10000);

    let json: any = null;
    try { json = await res.json(); } catch { /* non-JSON error page */ }

    if (res.ok && json?.success) return { ok: true, round: json.round ?? null };
    return { ok: false, code: json?.code, error: json?.error || `서버 오류 (${res.status})` };
  } catch (e) {
    console.warn('[battle] request failed:', e);
    return { ok: false, code: 'NETWORK', error: '서버에 연결하지 못했습니다. 네트워크 상태를 확인해주세요.' };
  }
};

export const fetchBattleRound = (options: { admin?: boolean } = {}): Promise<BattleApiResult> =>
  callBattleApi({ method: 'GET' }, options.admin ? '?admin=1' : '');

export const submitBattleVote = (choice: BattleChoice): Promise<BattleApiResult> =>
  callBattleApi({ method: 'POST', body: JSON.stringify({ choice }) });

/** 관리자: 이번 주 대결 상품 직접 지정 (상품이 바뀌면 이번 주 표는 초기화) */
export const setBattlePair = (productAId: string, productBId: string): Promise<BattleApiResult> =>
  callBattleApi({ method: 'POST', body: JSON.stringify({ action: 'set_pair', productAId, productBId }) });

/** 득표율(%) — 표가 없으면 null */
export const getBattlePercents = (counts: BattleCounts | null | undefined): { A: number; B: number } | null => {
  if (!counts) return null;
  const total = counts.A + counts.B;
  if (total <= 0) return null;
  const a = Math.round((counts.A / total) * 100);
  return { A: a, B: 100 - a };
};
