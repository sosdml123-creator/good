import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronDown, Search, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  MARKET_CATEGORIES, MarketCategory, MarketPriceRow, PricePoint,
  fetchPeriodPrices, formatWon, useMarketPrices,
} from '../../pc/useMarketPrices';

type Tab = '전체' | MarketCategory;
const TABS: Tab[] = ['전체', ...MARKET_CATEGORIES.map(c => c.name)];

const EMOJI: Record<MarketCategory, string> = {
  식량작물: '🌾', 채소류: '🥬', 과일류: '🍎', 축산물: '🥩', 수산물: '🐟',
};

const Change: React.FC<{ rate: number | null }> = ({ rate }) => {
  if (rate === null) return <span className="text-[12px] text-gray-400">-</span>;
  const r = Math.round(rate * 10) / 10;
  if (Math.abs(r) < 0.05) {
    return <span className="inline-flex items-center gap-0.5 text-[12px] text-gray-500"><Minus className="w-3 h-3" />0%</span>;
  }
  const up = r > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[12px] font-bold ${up ? 'text-rose-600' : 'text-blue-600'}`}>
      {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      {Math.abs(r).toFixed(1)}%
    </span>
  );
};

const Sparkline: React.FC<{ points: PricePoint[] }> = ({ points }) => {
  if (points.length < 2) return null;
  const w = 300, h = 70, pad = 4;
  const prices = points.map(p => p.price);
  const min = Math.min(...prices), max = Math.max(...prices);
  const span = max - min || 1;
  const d = points
    .map((p, i) => `${i ? 'L' : 'M'}${(pad + (i / (points.length - 1)) * (w - pad * 2)).toFixed(1)},${(h - pad - ((p.price - min) / span) * (h - pad * 2)).toFixed(1)}`)
    .join(' ');
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[70px]" preserveAspectRatio="none">
        <path d={d} fill="none" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div className="flex justify-between text-[10.5px] text-gray-400">
        <span>{points[0].date.slice(5)} · {formatWon(prices[0])}</span>
        <span>{points[points.length - 1].date.slice(5)} · {formatWon(prices[prices.length - 1])}</span>
      </div>
    </div>
  );
};

const RowCard: React.FC<{ row: MarketPriceRow; open: boolean; onToggle: () => void }> = ({ row, open, onToggle }) => {
  const [points, setPoints] = useState<PricePoint[] | null>(null);
  useEffect(() => {
    if (!open || points) return;
    let alive = true;
    fetchPeriodPrices(row, 30).then(p => { if (alive) setPoints(p); });
    return () => { alive = false; };
  }, [open, points, row]);

  const name = row.kindName && row.kindName !== row.itemName ? `${row.itemName} · ${row.kindName}` : row.itemName;
  const compare: [string, number | null][] = [
    ['전일', row.dayAgo], ['1주 전', row.weekAgo], ['1개월 전', row.monthAgo], ['1년 전', row.yearAgo], ['평년', row.normal],
  ];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center gap-3 p-3.5 text-left active:bg-gray-50">
        <div className="w-11 h-11 shrink-0 rounded-xl bg-emerald-50 flex items-center justify-center text-[24px]">{EMOJI[row.category]}</div>
        <div className="flex-1 min-w-0">
          <p className="text-[14.5px] font-black text-gray-900 truncate">{name}</p>
          <p className="text-[11.5px] text-gray-400">{row.rank} · {row.unit}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[15px] font-black text-gray-900">{formatWon(row.today)}</p>
          <Change rate={row.changeRate} />
        </div>
        <ChevronDown className={`w-4 h-4 shrink-0 text-gray-300 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-gray-50">
          <dl className="mt-3 grid grid-cols-5 gap-1 text-center">
            {compare.map(([label, v]) => (
              <div key={label} className="rounded-lg bg-gray-50 py-2">
                <dt className="text-[10px] text-gray-400">{label}</dt>
                <dd className="text-[11.5px] font-bold text-gray-800">{v === null ? '-' : v.toLocaleString('ko-KR')}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 mb-1 text-[12px] font-black text-gray-900">최근 30일 가격 추이</p>
          {points === null ? (
            <p className="text-[12px] text-gray-400 py-4 text-center">불러오는 중…</p>
          ) : points.length < 2 ? (
            <p className="text-[12px] text-gray-400 py-4 text-center">추이 데이터가 없어요</p>
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
  const [tab, setTab] = useState<Tab>('전체');
  const [query, setQuery] = useState('');
  const [openKey, setOpenKey] = useState<string | null>(null);

  const list = useMemo(() => {
    const q = query.trim();
    return rows
      .filter(r => (tab === '전체' || r.category === tab) && (!q || `${r.itemName}${r.kindName}`.includes(q)))
      .filter(r => r.rank === '상품' || !rows.some(o => o.itemName === r.itemName && o.kindName === r.kindName && o.category === r.category && o.rank === '상품'));
  }, [rows, tab, query]);

  const m = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const dateLabel = m ? `${Number(m[2])}월 ${Number(m[3])}일 기준` : date;

  return (
    <div className="pb-24 bg-white min-h-full">
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100">
        <div className="relative flex items-center justify-between px-2 h-12">
          <button onClick={() => setActiveTab('home')} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-900 active:bg-gray-100" aria-label="뒤로">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            <h1 className="text-[17px] font-black tracking-tight text-gray-900">농수산물 시세</h1>
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-600 text-[10px] font-black">오늘</span>
          </div>
          <span className="w-10" />
        </div>
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 h-10 px-3 rounded-xl bg-gray-100">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="품목 검색 (예: 사과, 고등어)"
              className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
        <div className="flex overflow-x-auto px-2 scrollbar-hide">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative shrink-0 px-3.5 py-2.5 text-[13.5px] ${tab === t ? 'font-black text-gray-900' : 'font-medium text-gray-400'}`}
            >
              {t}
              {tab === t && <span className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[3px] w-8 rounded-full bg-emerald-500" />}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 pt-3 space-y-2">
        <p className="text-[11.5px] text-gray-400">
          {dateLabel && `${dateLabel} · `}전국 평균 소매가 · 출처 KAMIS(aT)
        </p>
        {status === 'loading' && <p className="py-16 text-center text-[13px] text-gray-400">시세를 불러오는 중이에요…</p>}
        {status === 'error' && <p className="py-16 text-center text-[13px] text-gray-400">시세를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</p>}
        {status === 'ready' && list.length === 0 && <p className="py-16 text-center text-[13px] text-gray-400">검색 결과가 없어요</p>}
        {list.map(r => (
          <RowCard key={r.key} row={r} open={openKey === r.key} onToggle={() => setOpenKey(openKey === r.key ? null : r.key)} />
        ))}
      </div>
    </div>
  );
};
