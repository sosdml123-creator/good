import { useEffect, useMemo, useState } from 'react';
import { Product } from '../types';
import { fetchFoodTrendSignals } from '../services/naverApi';
import { getSearchTrendingProducts } from '../utils/ranking';
import { safeLocalStorageGet, safeLocalStorageSet } from '../utils/safeStorage';
import {
  FoodTrendKeyword,
  FoodTrendSignal,
  buildFoodTrendBatches,
  rankFoodTrendProducts,
  selectFoodTrendCandidates,
} from '../utils/foodTrend';

const STORAGE_KEY = 'sinsangpick_food_trend_v1';
const REFRESH_INTERVAL_MS = 30 * 60 * 1000;   // 이 주기로 네이버 신호를 다시 받아 순위를 갱신
const MAX_USABLE_AGE_MS = 24 * 60 * 60 * 1000; // 이보다 오래된 신호는 순위에 쓰지 않음
const FETCH_CONCURRENCY = 4;

interface StoredFoodTrend {
  fetchedAt: number;
  signals: Record<string, FoodTrendSignal>;
}

const EMPTY: StoredFoodTrend = { fetchedAt: 0, signals: {} };

const kstDateKey = () => new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 10);

const loadStored = (): StoredFoodTrend => {
  const stored = safeLocalStorageGet<StoredFoodTrend>(STORAGE_KEY, EMPTY);
  const usable = stored && typeof stored.fetchedAt === 'number' && stored.signals && Date.now() - stored.fetchedAt < MAX_USABLE_AGE_MS;
  return usable ? stored : EMPTY;
};

/**
 * "요즘 주목받는 먹거리" 순위: 네이버 검색량·쇼핑 클릭·블로그 언급을 종합한 실시간 순위.
 * 신호를 아직 받지 못했거나 오프라인이면 기존 정렬로 대체합니다.
 */
export const useFoodTrendRanking = (products: Product[], limit: number, enabled: boolean) => {
  const [trend, setTrend] = useState<StoredFoodTrend>(loadStored);
  const [dateKey, setDateKey] = useState(kstDateKey);

  const candidates = useMemo(
    () => (enabled ? selectFoodTrendCandidates(products, dateKey) : new Map<string, FoodTrendKeyword>()),
    [products, dateKey, enabled]
  );
  // 제품 목록이 바뀌어도 후보 키워드가 같으면 다시 요청하지 않도록 문자열로 고정
  const batchSignature = useMemo(() => buildFoodTrendBatches([...candidates.values()]).join('\n'), [candidates]);

  useEffect(() => {
    if (!batchSignature) return;
    let cancelled = false;

    const refresh = async (force: boolean) => {
      const current = loadStored();
      const isFresh = Date.now() - current.fetchedAt < REFRESH_INTERVAL_MS;
      const pending = batchSignature.split('\n').filter((batch) =>
        force || !isFresh || batch.split('|').some((entry) => !current.signals[entry.split('~')[0]])
      );
      if (pending.length === 0) return;

      const collected: Record<string, FoodTrendSignal> = {};
      let cursor = 0;
      const worker = async () => {
        while (cursor < pending.length && !cancelled) {
          const batch = pending[cursor++];
          Object.assign(collected, await fetchFoodTrendSignals(batch));
        }
      };
      await Promise.all(Array.from({ length: FETCH_CONCURRENCY }, worker));
      if (cancelled || Object.keys(collected).length === 0) return;

      // 현재 후보에 없는 지난 키워드는 버려 저장소가 계속 커지지 않게 합니다
      const activeKeys = new Set(batchSignature.split(/[\n|]/).map((entry) => entry.split('~')[0]));
      const merged: Record<string, FoodTrendSignal> = {};
      Object.entries({ ...current.signals, ...collected }).forEach(([key, signal]) => {
        if (activeKeys.has(key)) merged[key] = signal;
      });
      const next = { fetchedAt: Date.now(), signals: merged };
      safeLocalStorageSet(STORAGE_KEY, next);
      setTrend(next);
    };

    refresh(false);
    const timer = setInterval(() => {
      setDateKey(kstDateKey());
      refresh(true);
    }, REFRESH_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [batchSignature]);

  return useMemo(() => {
    const live = enabled ? rankFoodTrendProducts(products, candidates, trend.signals) : [];
    if (live.length === 0) {
      return { products: enabled ? getSearchTrendingProducts(products, limit) : [], isLive: false, updatedAt: 0 };
    }
    // 일부 묶음만 받아 개수가 모자라면 나머지 자리는 기존 정렬로 채웁니다
    const liveIds = new Set(live.map((p) => p.id));
    const filler = live.length < limit ? getSearchTrendingProducts(products).filter((p) => !liveIds.has(p.id)) : [];
    return { products: [...live, ...filler].slice(0, limit), isLive: true, updatedAt: trend.fetchedAt };
  }, [products, candidates, trend, limit, enabled]);
};
