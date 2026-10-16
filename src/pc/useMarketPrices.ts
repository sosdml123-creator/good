import { useEffect, useState } from 'react';

/** KAMIS(aT 농수산물유통정보) 소매가격 한 줄 */
export interface MarketPriceRow {
  key: string;
  category: MarketCategory;
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

const toRow = (raw: Record<string, string>, category: MarketCategory): MarketPriceRow => {
  const today = toNumber(raw.dpr1);
  const dayAgo = toNumber(raw.dpr2);
  const weekAgo = toNumber(raw.dpr3);
  const twoWeeksAgo = toNumber(raw.dpr4);
  const base = dayAgo ?? weekAgo ?? twoWeeksAgo;
  const changeLabel = dayAgo ? '전일 대비' : weekAgo ? '1주 전 대비' : twoWeeksAgo ? '2주 전 대비' : '';
  return {
    key: `${category}-${raw.item_code}-${raw.kind_code}-${raw.rank_code}`,
    category,
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

/** 오늘의 농축수산물 소매 시세 (실제 KAMIS 공시가, 카테고리별 /api/kamis 호출) */
export const useMarketPrices = () => {
  const [rows, setRows] = useState<MarketPriceRow[]>(cache?.rows ?? []);
  const [date, setDate] = useState(cache?.date ?? '');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(cache ? 'ready' : 'loading');

  useEffect(() => {
    if (cache && Date.now() - cache.at < CACHE_MS) return;
    let alive = true;
    (async () => {
      try {
        const results = await Promise.all(
          MARKET_CATEGORIES.map(async ({ code, name }) => {
            const r = await fetch(`/api/kamis?category=${code}`);
            if (!r.ok) return { rows: [] as MarketPriceRow[], date: '' };
            const json = await r.json();
            const items: Record<string, string>[] = Array.isArray(json?.items) ? json.items : [];
            return { rows: items.map(i => toRow(i, name)).filter(x => x.today !== null), date: String(json?.latestDate || '') };
          })
        );
        const all = results.flatMap(r => r.rows);
        const latest = results.map(r => r.date).filter(Boolean).sort().pop() || '';
        if (!alive) return;
        if (all.length === 0) {
          setStatus('error');
          return;
        }
        cache = { at: Date.now(), rows: all, date: latest };
        setRows(all);
        setDate(latest);
        setStatus('ready');
      } catch {
        if (alive) setStatus('error');
      }
    })();
    return () => { alive = false; };
  }, []);

  return { rows, date, status };
};

export const formatWon = (n: number | null) => (n === null ? '-' : `${n.toLocaleString('ko-KR')}원`);
