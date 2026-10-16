import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronRight, Minus, Search, TrendingDown, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MARKET_CATEGORIES, MarketCategory, MarketPriceRow, formatWon, useMarketPrices } from './useMarketPrices';
import { PcBreadcrumb, PcContainer, PcEmpty, PcTextTabs } from './PcUi';

/** 홈 위젯에 보여줄 장바구니 대표 품목 (있는 것만 표시) */
const BASKET_ITEMS = ['배추', '무', '양파', '대파', '감자', '사과', '배', '감귤', '쌀', '달걀', '돼지고기', '고등어'];

export const ChangeBadge: React.FC<{ rate: number | null; size?: 'sm' | 'md' }> = ({ rate, size = 'md' }) => {
  const text = size === 'sm' ? 'text-[12px]' : 'text-[13px]';
  if (rate === null) return <span className={`${text} text-gray-400`}>-</span>;
  const r = Math.round(rate * 10) / 10;
  if (Math.abs(r) < 0.05) {
    return <span className={`inline-flex items-center gap-0.5 ${text} text-gray-500`}><Minus className="w-3 h-3" />0%</span>;
  }
  const up = r > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 font-semibold ${text} ${up ? 'text-rose-600' : 'text-blue-600'}`}>
      {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      {Math.abs(r).toFixed(1)}%
    </span>
  );
};

const formatDateLabel = (d: string) => {
  const m = d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${Number(m[2])}월 ${Number(m[3])}일` : d;
};

/** 같은 품목이 여러 품종·등급이면 대표 한 줄(상품 등급 우선)만 고릅니다. */
const pickRepresentative = (rows: MarketPriceRow[], itemName: string) => {
  const matches = rows.filter(r => r.itemName === itemName);
  return matches.find(r => r.rank === '상품') || matches[0];
};

/** PC 홈의 '오늘의 장바구니 시세' 위젯 */
export const PcMarketWidget: React.FC = () => {
  const { setActiveTab } = useApp();
  const { rows, date, status } = useMarketPrices();
  const basket = useMemo(
    () => BASKET_ITEMS.map(name => pickRepresentative(rows, name)).filter((r): r is MarketPriceRow => Boolean(r)).slice(0, 8),
    [rows]
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
        <div>
          <p className="text-[18px] font-bold text-gray-900">오늘의 장바구니 시세</p>
          <p className="mt-0.5 text-[12px] text-gray-400">
            {date ? `${formatDateLabel(date)} 기준 · ` : ''}전국 평균 소매가 · 출처 KAMIS(aT)
          </p>
        </div>
        <button onClick={() => setActiveTab('market')} className="text-[13px] text-gray-500 hover:text-gray-900 flex items-center cursor-pointer">
          전체 시세 <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      {status === 'loading' && <p className="py-16 text-center text-[13px] text-gray-400">시세를 불러오는 중이에요…</p>}
      {status === 'error' && <p className="py-16 text-center text-[13px] text-gray-400">지금은 시세를 불러오지 못했어요.</p>}
      {status === 'ready' && (
        <ul className="grid grid-cols-4">
          {basket.map((r, i) => (
            <li key={r.key} className={`px-6 py-4 ${i % 4 !== 3 ? 'border-r' : ''} ${i < 4 ? 'border-b' : ''} border-gray-100`}>
              <p className="text-[14px] font-semibold text-gray-900">{r.itemName} <span className="text-[12px] font-normal text-gray-400">{r.unit}</span></p>
              <p className="mt-1 text-[17px] font-bold text-gray-900">{formatWon(r.today)}</p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <ChangeBadge rate={r.changeRate} size="sm" />
                <span className="text-[11px] text-gray-400">{r.changeLabel}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

type SortKey = 'name' | 'today' | 'change' | 'year';

/** PC 전용: 오늘의 농축수산물 시세 페이지 */
export const PcMarket: React.FC = () => {
  const { setActiveTab } = useApp();
  const { rows, date, status } = useMarketPrices();
  const [category, setCategory] = useState<MarketCategory | '전체'>('전체');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: 'change', desc: true });

  const withChange = useMemo(() => rows.filter(r => r.changeRate !== null), [rows]);
  const risers = useMemo(() => [...withChange].sort((a, b) => (b.changeRate ?? 0) - (a.changeRate ?? 0)).filter(r => (r.changeRate ?? 0) > 0).slice(0, 5), [withChange]);
  const fallers = useMemo(() => [...withChange].sort((a, b) => (a.changeRate ?? 0) - (b.changeRate ?? 0)).filter(r => (r.changeRate ?? 0) < 0).slice(0, 5), [withChange]);
  const vsYear = useMemo(
    () => rows
      .filter(r => r.today && r.yearAgo)
      .map(r => ({ r, rate: ((r.today! - r.yearAgo!) / r.yearAgo!) * 100 }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 5),
    [rows]
  );

  const filtered = useMemo(() => {
    const q = query.trim();
    const list = rows.filter(r =>
      (category === '전체' || r.category === category) &&
      (!q || r.itemName.includes(q) || r.kindName.includes(q))
    );
    const dir = sort.desc ? -1 : 1;
    return [...list].sort((a, b) => {
      if (sort.key === 'name') return a.itemName.localeCompare(b.itemName, 'ko') * dir;
      if (sort.key === 'today') return ((a.today ?? 0) - (b.today ?? 0)) * dir;
      if (sort.key === 'year') {
        const ra = a.today && a.yearAgo ? (a.today - a.yearAgo) / a.yearAgo : -Infinity;
        const rb = b.today && b.yearAgo ? (b.today - b.yearAgo) / b.yearAgo : -Infinity;
        return (ra - rb) * dir;
      }
      return ((a.changeRate ?? -Infinity) - (b.changeRate ?? -Infinity)) * dir;
    });
  }, [rows, category, query, sort]);

  const toggleSort = (key: SortKey) =>
    setSort(s => (s.key === key ? { key, desc: !s.desc } : { key, desc: key !== 'name' }));

  const SortHead: React.FC<{ k: SortKey; children: React.ReactNode; align?: string }> = ({ k, children, align = 'text-right' }) => (
    <th className={`py-3.5 px-4 font-medium ${align}`}>
      <button onClick={() => toggleSort(k)} className={`cursor-pointer hover:text-gray-900 ${sort.key === k ? 'text-gray-900 font-bold' : ''}`}>
        {children}{sort.key === k ? (sort.desc ? ' ↓' : ' ↑') : ''}
      </button>
    </th>
  );

  const RankList: React.FC<{ title: string; icon: React.ReactNode; items: { r: MarketPriceRow; rate: number | null }[]; tone: string }> = ({ title, icon, items, tone }) => (
    <div className="rounded-2xl border border-gray-200 p-6">
      <p className={`flex items-center gap-2 text-[16px] font-bold ${tone}`}>{icon}{title}</p>
      {items.length === 0 ? (
        <p className="mt-6 text-[13px] text-gray-400">해당하는 품목이 없어요.</p>
      ) : (
        <ol className="mt-4 space-y-3">
          {items.map(({ r, rate }, i) => (
            <li key={r.key} className="flex items-center gap-3 text-[14px]">
              <span className="w-4 text-gray-400 font-semibold">{i + 1}</span>
              <span className="flex-1 min-w-0 truncate text-gray-900">{r.itemName} <span className="text-gray-400 text-[12px]">{r.kindName}</span></span>
              <span className="text-gray-600 tabular-nums">{formatWon(r.today)}</span>
              <span className="w-16 text-right"><ChangeBadge rate={rate} size="sm" /></span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );

  return (
    <div className="bg-white pb-24">
      <section className="bg-gradient-to-r from-emerald-50 to-white border-b border-emerald-100">
        <PcContainer className="pt-6 pb-10">
          <PcBreadcrumb items={[{ label: '홈', onClick: () => setActiveTab('home') }, { label: '오늘의 시세' }]} />
          <div className="mt-6 flex items-end justify-between">
            <div>
              <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[12px] font-bold">PC 전용</span>
              <h1 className="mt-3 text-[32px] font-bold text-gray-900 tracking-tight">오늘의 장바구니 시세</h1>
              <p className="mt-2 text-[15px] text-gray-600">채소·과일·축산·수산물의 전국 평균 소매가격을 매일 확인하세요.</p>
            </div>
            <div className="text-right text-[13px] text-gray-500">
              <p className="text-[20px] font-bold text-gray-900">{date ? formatDateLabel(date) : '-'} 기준</p>
              <p className="mt-1">출처: KAMIS 농산물유통정보(aT 한국농수산식품유통공사)</p>
            </div>
          </div>
        </PcContainer>
      </section>

      <PcContainer className="pt-10">
        {status === 'loading' && <PcEmpty message="오늘의 시세를 불러오는 중이에요…" />}
        {status === 'error' && <PcEmpty message="지금은 시세를 불러오지 못했어요. 잠시 후 다시 시도해 주세요." />}
        {status === 'ready' && (
          <>
            <div className="grid grid-cols-3 gap-5">
              <RankList title="많이 오른 품목" icon={<TrendingUp className="w-5 h-5" />} tone="text-rose-600" items={risers.map(r => ({ r, rate: r.changeRate }))} />
              <RankList title="많이 내린 품목" icon={<TrendingDown className="w-5 h-5" />} tone="text-blue-600" items={fallers.map(r => ({ r, rate: r.changeRate }))} />
              <RankList title="1년 전보다 비싸진 품목" icon={<TrendingUp className="w-5 h-5" />} tone="text-amber-600" items={vsYear} />
            </div>

            <div className="mt-14 flex items-center justify-between gap-6">
              <PcTextTabs
                items={['전체', ...MARKET_CATEGORIES.map(c => c.name)]}
                value={category}
                onChange={(v) => setCategory(v as MarketCategory | '전체')}
              />
              <label className="w-[280px] h-11 rounded-full border border-gray-300 flex items-center gap-2 px-4 focus-within:border-gray-900">
                <Search className="w-4 h-4 text-gray-400" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="품목 검색 (예: 사과, 배추)" className="flex-1 min-w-0 text-[14px] outline-none bg-transparent" />
              </label>
            </div>

            <table className="mt-6 w-full text-[14px] border-t-2 border-gray-900">
              <thead className="text-gray-500 bg-[#F8F8FA] border-b border-gray-200">
                <tr>
                  <SortHead k="name" align="text-left">품목</SortHead>
                  <th className="py-3.5 px-4 font-medium text-left">품종 · 등급</th>
                  <th className="py-3.5 px-4 font-medium text-left">단위</th>
                  <SortHead k="today">오늘</SortHead>
                  <SortHead k="change">등락</SortHead>
                  <th className="py-3.5 px-4 font-medium text-right">1개월 전</th>
                  <SortHead k="year">1년 전</SortHead>
                  <th className="py-3.5 px-4 font-medium text-right">평년</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.key} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3.5 px-4 font-semibold text-gray-900">{r.itemName}</td>
                    <td className="py-3.5 px-4 text-gray-600">{r.kindName} <span className="text-gray-400">· {r.rank}</span></td>
                    <td className="py-3.5 px-4 text-gray-500">{r.unit}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-gray-900 tabular-nums">{formatWon(r.today)}</td>
                    <td className="py-3.5 px-4 text-right"><ChangeBadge rate={r.changeRate} /></td>
                    <td className="py-3.5 px-4 text-right text-gray-500 tabular-nums">{formatWon(r.monthAgo)}</td>
                    <td className="py-3.5 px-4 text-right text-gray-500 tabular-nums">{formatWon(r.yearAgo)}</td>
                    <td className="py-3.5 px-4 text-right text-gray-500 tabular-nums">{formatWon(r.normal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <PcEmpty message="조건에 맞는 품목이 없어요." />}
            <p className="mt-6 text-[12px] text-gray-400">
              등락은 전일 가격 기준이며, 전일 공시가 없으면 1주 전 또는 2주 전 가격과 비교해요. 가격은 전국 주요 소매점 조사 평균이라 실제 매장 가격과 다를 수 있어요.
            </p>
          </>
        )}
      </PcContainer>
    </div>
  );
};
