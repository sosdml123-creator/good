import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronDown, Search, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  MARKET_CATEGORIES, MarketCategory, MarketPriceRow, PricePoint,
  fetchPeriodPrices, formatWon, useMarketPrices,
} from '../../pc/useMarketPrices';

type Sort = 'down' | 'up';
type Cat = '전체' | MarketCategory;
const CATS: Cat[] = ['전체', ...MARKET_CATEGORIES.map(c => c.name)];

const EMOJI: Record<MarketCategory, string> = {
  식량작물: '🌾', 채소류: '🥬', 과일류: '🍎', 축산물: '🥩', 수산물: '🐟',
};

/** 월별 제철 품목 (시세가 있는 것만 배너에 노출) */
const SEASONAL: Record<number, string[]> = {
  1: ['귤', '감귤', '딸기', '시금치', '굴', '대구'],
  2: ['딸기', '시금치', '달래', '냉이', '꼬막', '굴'],
  3: ['딸기', '냉이', '달래', '주꾸미', '도다리', '쑥'],
  4: ['딸기', '참외', '미나리', '두릅', '주꾸미', '바지락'],
  5: ['참외', '양파', '마늘', '매실', '완두', '멸치'],
  6: ['수박', '참외', '감자', '매실', '복숭아', '오이'],
  7: ['수박', '복숭아', '옥수수', '토마토', '오이', '전복'],
  8: ['수박', '복숭아', '포도', '옥수수', '고구마', '전복'],
  9: ['사과', '배', '포도', '밤', '꽃게', '전어'],
  10: ['사과', '배', '감', '단감', '고구마', '밤', '꽃게', '전어', '대하'],
  11: ['배추', '무', '감귤', '귤', '사과', '굴', '고등어'],
  12: ['귤', '감귤', '배추', '무', '굴', '명태', '대구'],
};

const pct = (r: number | null) => (r === null ? null : Math.round(r * 10) / 10);

const ChangeText: React.FC<{ rate: number | null }> = ({ rate }) => {
  const r = pct(rate);
  if (r === null) return null;
  if (Math.abs(r) < 0.05) return <span className="text-[12px] text-gray-400">- 0%</span>;
  const up = r > 0;
  return (
    <span className={`text-[12px] font-bold ${up ? 'text-rose-500' : 'text-blue-600'}`}>
      {up ? '▲' : '▼'} {Math.abs(r).toFixed(1)}%
    </span>
  );
};

const Sparkline: React.FC<{ points: PricePoint[] }> = ({ points }) => {
  if (points.length < 2) return null;
  const w = 300, h = 64, pad = 4;
  const prices = points.map(p => p.price);
  const min = Math.min(...prices), max = Math.max(...prices);
  const span = max - min || 1;
  const d = points
    .map((p, i) => `${i ? 'L' : 'M'}${(pad + (i / (points.length - 1)) * (w - pad * 2)).toFixed(1)},${(h - pad - ((p.price - min) / span) * (h - pad * 2)).toFixed(1)}`)
    .join(' ');
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16" preserveAspectRatio="none">
        <path d={d} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div className="flex justify-between text-[10.5px] text-gray-400">
        <span>{points[0].date.slice(5)} · {formatWon(prices[0])}</span>
        <span>{points[points.length - 1].date.slice(5)} · {formatWon(prices[prices.length - 1])}</span>
      </div>
    </div>
  );
};

const itemTitle = (r: MarketPriceRow) => (r.kindName && r.kindName !== r.itemName ? `${r.itemName} ${r.kindName}` : r.itemName);

const RankCard: React.FC<{ rank: number; row: MarketPriceRow; grades: MarketPriceRow[]; open: boolean; onToggle: () => void }> = ({
  rank, row, grades, open, onToggle,
}) => {
  const [points, setPoints] = useState<PricePoint[] | null>(null);
  useEffect(() => {
    if (!open || points) return;
    let alive = true;
    fetchPeriodPrices(row, 30).then(p => { if (alive) setPoints(p); });
    return () => { alive = false; };
  }, [open, points, row]);

  const cells: { label: string; sub: string; price: number | null; tag?: string }[] = [
    ...grades.map(g => ({ label: g.rank, sub: '등급별', price: g.today })),
    { label: '전일', sub: '어제', price: row.dayAgo },
    { label: '1주 전', sub: '지난주', price: row.weekAgo },
    { label: '1개월 전', sub: '지난달', price: row.monthAgo },
    { label: '1년 전', sub: '작년', price: row.yearAgo },
  ].filter(c => c.price !== null).slice(0, 4);

  return (
    <div className={`rounded-2xl bg-white overflow-hidden ${rank === 1 ? 'border border-blue-500' : ''}`}>
      <button onClick={onToggle} className="w-full px-4 py-3.5 text-left">
        <div className="flex items-center gap-2.5">
          <span className="text-[17px] font-black text-gray-900 w-5">{rank}</span>
          <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[17px]">{EMOJI[row.category]}</span>
          <span className="flex-1 min-w-0 text-[17px] font-black text-gray-900 truncate">{itemTitle(row)}</span>
          <ChangeText rate={row.changeRate} />
          <span className="text-[16px] font-black text-gray-900">{formatWon(row.today)}</span>
          <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
        <p className="mt-1 ml-[30px] text-[12px] text-gray-400">{row.rank} · {row.unit}{row.changeLabel ? ` · ${row.changeLabel}` : ''}</p>
      </button>
      {open && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-4 gap-2">
            {cells.map(c => (
              <div key={c.label} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[11px] font-bold text-gray-600">{c.label}</div>
                <p className="mt-1.5 text-[12.5px] font-black text-blue-600">{c.price!.toLocaleString('ko-KR')}원</p>
              </div>
            ))}
          </div>
          <p className="mt-4 mb-1 text-[12px] font-black text-gray-900">최근 30일 가격</p>
          {points === null ? (
            <p className="text-[12px] text-gray-400 py-3 text-center">불러오는 중…</p>
          ) : points.length < 2 ? (
            <p className="text-[12px] text-gray-400 py-3 text-center">추이 데이터가 없어요</p>
          ) : (
            <Sparkline points={points} />
          )}
        </div>
      )}
    </div>
  );
};

/** 모바일 농수산물 시세 (KAMIS 소매가, PC 는 오늘의 시세 화면) */
export const AgriView: React.FC = () => {
  const { setActiveTab } = useApp();
  const { rows, date, status } = useMarketPrices();
  const [cat, setCat] = useState<Cat>('전체');
  const [sort, setSort] = useState<Sort>('down');
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  // 같은 품목·품종은 상품 등급을 대표로, 나머지 등급은 비교 칸에 보여 줍니다.
  const groups = useMemo(() => {
    const map = new Map<string, MarketPriceRow[]>();
    rows.forEach(r => {
      const k = `${r.category}|${r.itemName}|${r.kindName}`;
      map.set(k, [...(map.get(k) || []), r]);
    });
    return [...map.values()].map(g => {
      const rep = g.find(r => r.rank === '상품') || g[0];
      return { rep, grades: g.length > 1 ? g : [] };
    });
  }, [rows]);

  const seasonal = useMemo(() => {
    const names = SEASONAL[new Date().getMonth() + 1] || [];
    const seen = new Set<string>();
    return names.filter(n => groups.some(g => g.rep.itemName === n) && !seen.has(n) && seen.add(n)).slice(0, 4);
  }, [groups]);

  const list = useMemo(() => {
    const q = query.trim();
    const filtered = groups.filter(g =>
      (cat === '전체' || g.rep.category === cat) &&
      (!q || `${g.rep.itemName}${g.rep.kindName}`.includes(q)) &&
      (q || g.rep.changeRate !== null)
    );
    if (q) return filtered;
    return filtered.sort((a, b) => sort === 'down' ? a.rep.changeRate! - b.rep.changeRate! : b.rep.changeRate! - a.rep.changeRate!);
  }, [groups, cat, sort, query]);

  const shown = showAll || query ? list : list.slice(0, 10);
  const m = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const dateLabel = m ? `${Number(m[2])}월 ${Number(m[3])}일 기준` : '';
  const month = new Date().getMonth() + 1;

  return (
    <div className="pb-24 bg-white min-h-full">
      <header className="sticky top-0 z-20 bg-white">
        <div className="relative flex items-center justify-between px-2 h-12">
          <button onClick={() => setActiveTab('home')} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-900 active:bg-gray-100" aria-label="뒤로">
            <ChevronLeft className="w-6 h-6" />
          </button>
          {searching ? (
            <div className="flex-1 flex items-center gap-2 h-9 px-3 mx-1 rounded-full bg-gray-100">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="품목 검색 (예: 사과, 고등어)"
                className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-gray-400"
              />
            </div>
          ) : (
            <h1 className="text-[17px] font-black tracking-tight text-gray-900">농수산물 시세</h1>
          )}
          <button
            onClick={() => { if (searching) setQuery(''); setSearching(!searching); }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-900 active:bg-gray-100"
            aria-label={searching ? '검색 닫기' : '검색'}
          >
            {searching ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div className="px-4">
        {/* 이달의 제철 배너 */}
        <div className="mt-1 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-100 px-5 py-5">
          <p className="text-[21px] font-black text-gray-900">{month}월 제철 농수산물</p>
          <p className="mt-2 text-[13px] text-gray-600">
            {seasonal.length > 0 ? seasonal.join('  |  ') : '지금 가장 맛있는 먹거리'}
          </p>
          <p className="mt-3 text-[11px] text-gray-400">{dateLabel && `${dateLabel} · `}전국 평균 소매가 · 출처 KAMIS(aT)</p>
        </div>

        <p className="mt-7 text-[19px] font-black text-gray-900">오늘 시세, 뭐가 좋을까?</p>

        <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {([['down', '가격 내린 순'], ['up', '가격 오른 순']] as [Sort, string][]).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setSort(id)}
              className={`shrink-0 h-9 px-4 rounded-full text-[13.5px] ${sort === id ? 'bg-blue-50 text-blue-600 font-bold' : 'border border-gray-200 text-gray-700'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {CATS.map(c => (
            <button
              key={c}
              onClick={() => { setCat(c); setShowAll(false); }}
              className={`shrink-0 h-8 px-3.5 rounded-full text-[12.5px] ${cat === c ? 'bg-gray-900 text-white font-bold' : 'bg-gray-100 text-gray-600'}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          {status === 'loading' && <p className="py-16 text-center text-[13px] text-gray-400">시세를 불러오는 중이에요…</p>}
          {status === 'error' && <p className="py-16 text-center text-[13px] text-gray-400">시세를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</p>}
          {status === 'ready' && list.length === 0 && <p className="py-16 text-center text-[13px] text-gray-400">검색 결과가 없어요</p>}
          {shown.map((g, i) => (
            <RankCard
              key={g.rep.key}
              rank={i + 1}
              row={g.rep}
              grades={g.grades}
              open={openKey === g.rep.key || (openKey === null && i === 0 && !query)}
              onToggle={() => setOpenKey(openKey === g.rep.key ? '' : g.rep.key)}
            />
          ))}
        </div>

        {!showAll && !query && list.length > 10 && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setShowAll(true)}
              className="h-10 px-5 rounded-full bg-white shadow-md border border-gray-100 text-[13px] font-bold text-gray-900 flex items-center gap-1"
            >
              전체 품목 보기 <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
