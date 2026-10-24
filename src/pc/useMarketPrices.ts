import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

/** 앱(네이티브)에서는 로컬 번들이라 서버 주소가 필요합니다. 웹은 같은 도메인의 /api 를 씁니다. */
const KAMIS_URL = `${Capacitor.isNativePlatform() ? 'https://www.sinsangpick.kr' : ''}/api/kamis`;

/** KAMIS(aT 농수산물유통정보) 소매가격 한 줄 */
export interface MarketPriceRow {
  key: string;
  category: MarketCategory;
  /** KAMIS 코드 (기간별 시세 조회용) */
  categoryCode: string;
  itemCode: string;
  kindCode: string;
  rankCode: string;
  itemName: string;
  kindName: string;
  rank: string;
  unit: string;
  today: number | null;
  dayAgo: number | null;
  weekAgo: number | null;
  monthAgo: number | null;
  yearAgo: number | null;
  normal: number | null;
  /** 비교 기준(1일전, 없으면 1주·2주 전) 대비 등락률(%) */
  changeRate: number | null;
  changeLabel: string;
}

export type MarketCategory = '식량작물' | '채소류' | '과일류' | '축산물' | '수산물';

export const MARKET_CATEGORIES: { code: string; name: MarketCategory }[] = [
  { code: '200', name: '채소류' },
  { code: '400', name: '과일류' },
  { code: '500', name: '축산물' },
  { code: '600', name: '수산물' },
  { code: '100', name: '식량작물' },
];

const toNumber = (value: unknown): number | null => {
  const n = Number(String(value ?? '').replace(/,/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
};

const toRow = (raw: Record<string, string>, category: MarketCategory, categoryCode: string): MarketPriceRow => {
  const today = toNumber(raw.dpr1);
  const dayAgo = toNumber(raw.dpr2);
  const weekAgo = toNumber(raw.dpr3);
  const twoWeeksAgo = toNumber(raw.dpr4);
  const base = dayAgo ?? weekAgo ?? twoWeeksAgo;
  const changeLabel = dayAgo ? '전일 대비' : weekAgo ? '1주 전 대비' : twoWeeksAgo ? '2주 전 대비' : '';
  return {
    key: `${category}-${raw.item_code}-${raw.kind_code}-${raw.rank_code}`,
    category,
    categoryCode,
    itemCode: String(raw.item_code || ''),
    kindCode: String(raw.kind_code || ''),
    rankCode: String(raw.rank_code || ''),
    itemName: raw.item_name,
    kindName: String(raw.kind_name || '').replace(/\([^)]*\)$/, ''),
    rank: raw.rank,
    unit: raw.unit,
    today,
    dayAgo,
    weekAgo,
    monthAgo: toNumber(raw.dpr5),
    yearAgo: toNumber(raw.dpr6),
    normal: toNumber(raw.dpr7),
    changeRate: today && base ? ((today - base) / base) * 100 : null,
    changeLabel,
  };
};

let cache: { at: number; rows: MarketPriceRow[]; date: string } | null = null;
const CACHE_MS = 10 * 60 * 1000;
/** KAMIS 는 하루 한 번(평일 오후) 공시하므로 화면을 켜 두면 30분마다 새 공시가 있는지 확인합니다. */
const REFRESH_MS = 30 * 60 * 1000;

/** 오늘의 농축수산물 소매 시세 (실제 KAMIS 공시가, 카테고리별 /api/kamis 호출) */
export const useMarketPrices = () => {
  const [rows, setRows] = useState<MarketPriceRow[]>(cache?.rows ?? []);
  const [date, setDate] = useState(cache?.date ?? '');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(cache ? 'ready' : 'loading');
  const [checkedAt, setCheckedAt] = useState<number | null>(cache?.at ?? null);

  useEffect(() => {
    let alive = true;
    const load = async (force: boolean) => {
      if (!force && cache && Date.now() - cache.at < CACHE_MS) return;
      try {
        const results = await Promise.all(
          MARKET_CATEGORIES.map(async ({ code, name }) => {
            const r = await fetch(`${KAMIS_URL}?category=${code}`);
            if (!r.ok) return { rows: [] as MarketPriceRow[], date: '' };
            const json = await r.json();
            const items: Record<string, string>[] = Array.isArray(json?.items) ? json.items : [];
            return { rows: items.map(i => toRow(i, name, code)).filter(x => x.today !== null), date: String(json?.latestDate || '') };
          })
        );
        const all = results.flatMap(r => r.rows);
        const latest = results.map(r => r.date).filter(Boolean).sort().pop() || '';
        if (!alive) return;
        if (all.length === 0) {
          if (!cache) setStatus('error');
          return;
        }
        cache = { at: Date.now(), rows: all, date: latest };
        setRows(all);
        setDate(latest);
        setCheckedAt(cache.at);
        setStatus('ready');
      } catch {
        if (alive && !cache) setStatus('error');
      }
    };
    load(false);
    const timer = setInterval(() => load(true), REFRESH_MS);
    return () => { alive = false; clearInterval(timer); };
  }, []);

  return { rows, date, status, checkedAt };
};

export const formatWon = (n: number | null) => (n === null ? '-' : `${n.toLocaleString('ko-KR')}원`);

export interface PricePoint { date: string; price: number }

/** 품목 하나의 기간별 소매가 (그래프용). 실패하면 points 가 빈 배열입니다. */
export const fetchPeriodPrices = async (row: MarketPriceRow, days: number): Promise<PricePoint[]> => {
  const q = new URLSearchParams({ action: 'period', category: row.categoryCode, item: row.itemCode, kind: row.kindCode, rank: row.rankCode, days: String(days) });
  try {
    const r = await fetch(`${KAMIS_URL}?${q.toString()}`);
    const json = r.ok ? await r.json() : null;
    return Array.isArray(json?.points) ? json.points : [];
  } catch {
    return [];
  }
};
