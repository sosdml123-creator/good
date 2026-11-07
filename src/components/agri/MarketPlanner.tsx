import React, { useMemo, useState } from 'react';
import { Heart, Check, Search } from 'lucide-react';
import { MarketPriceRow, formatWon } from '../../pc/useMarketPrices';

const SEASONS: Record<number, string[]> = {
  1: ['감귤', '딸기', '시금치', '굴'], 2: ['딸기', '시금치', '굴'],
  3: ['딸기', '미나리', '바지락'], 4: ['참외', '미나리', '바지락'],
  5: ['참외', '마늘', '양파'], 6: ['수박', '감자', '오이'],
  7: ['수박', '복숭아', '토마토', '전복'], 8: ['포도', '복숭아', '전복'],
  9: ['사과', '배', '포도', '꽃게'], 10: ['사과', '단감', '고구마', '꽃게'],
  11: ['배추', '무', '감귤', '굴', '고등어'], 12: ['감귤', '배추', '무', '굴'],
};
const STORAGE = 'sinsangpick-market-favorites-v1';
const title = (r: MarketPriceRow) => r.kindName && r.kindName !== r.itemName ? `${r.itemName} ${r.kindName}` : r.itemName;

export const MarketPlanner: React.FC<{ rows: MarketPriceRow[]; date: string }> = ({ rows, date }) => {
  const [tab, setTab] = useState<'season' | 'all' | 'saved'>('season');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>(() => {
    try { const v: unknown = JSON.parse(localStorage.getItem(STORAGE) || '[]'); return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []; } catch { return []; }
  });
  const [notice, setNotice] = useState('');
  const month = Number(new Intl.DateTimeFormat('en', { month: 'numeric', timeZone: 'Asia/Seoul' }).format(new Date()));
  const items = useMemo(() => {
    const grouped = new Map<string, MarketPriceRow>();
    for (const r of rows) {
      const key = `${r.category}|${r.itemCode}|${r.kindCode}|${r.unit}`;
      if (!grouped.has(key) || r.rank === '상품') grouped.set(key, r);
    }
    return [...grouped.values()];
  }, [rows]);
  const visible = items.filter(r => (tab === 'all' || (tab === 'saved' ? saved.includes(r.key) : SEASONS[month].includes(r.itemName))) && title(r).includes(query.trim()));
  const compared = selected.map(key => rows.find(r => r.key === key)).filter((r): r is MarketPriceRow => Boolean(r));
  const toggleSave = (key: string) => {
    const next = saved.includes(key) ? saved.filter(k => k !== key) : [...saved, key];
    setSaved(next);
    try { localStorage.setItem(STORAGE, JSON.stringify(next)); setNotice('관심 품목을 업데이트했어요.'); } catch { setNotice('이 기기에서 저장할 수 없어 이번 방문 동안만 유지돼요.'); }
  };
  return <section className="my-5 space-y-4" aria-label="농수산물 장보기 도우미">
    <div className="rounded-3xl bg-gradient-to-br from-emerald-950 to-teal-800 p-6 text-white">
      <p className="text-xs font-bold tracking-widest text-emerald-200">FRESH PICK · 제철 장보기</p>
      <h2 className="mt-3 text-2xl font-black leading-snug">오늘 뭐 먹지?<br />시세부터 살펴봐요</h2>
      <p className="mt-3 text-sm text-emerald-100">제철 먹거리를 찾고, 관심 품목의 가격을 나란히 비교해 보세요.</p>
      <p className="mt-4 text-xs text-emerald-100">{date || '공시일 확인 중'} · KAMIS 전국 평균 소매가</p>
    </div>
    <div className="flex gap-2" role="group" aria-label="탐색 유형">
      {([['season', `${month}월 제철`], ['all', '전체 탐색'], ['saved', `관심 ${saved.length}`]] as const).map(([key, label]) => <button key={key} onClick={() => setTab(key)} aria-pressed={tab === key} className={`flex-1 rounded-xl px-2 py-3 text-sm font-bold ${tab === key ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-600'}`}>{label}</button>)}
    </div>
    <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-3"><Search size={18} className="text-gray-400" /><input aria-label="장보기 품목 검색" value={query} onChange={e => setQuery(e.target.value)} placeholder="찾는 품목이 있나요? 예: 고등어" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label>
    <p className="text-xs text-gray-500">{tab === 'season' ? '일반적인 제철 참고 정보로, 산지·재배 방식에 따라 달라요.' : `${visible.length}개 품목 · 관심 품목은 이 기기에 저장돼요.`}</p>
    <div className="flex gap-3 overflow-x-auto pb-3" aria-label="탐색 품목">
      {visible.map(r => <article key={r.key} className="w-52 shrink-0 rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between"><span className="text-xs font-bold text-emerald-700">{r.category}</span><button onClick={() => toggleSave(r.key)} aria-label={`${title(r)} 관심 품목`} aria-pressed={saved.includes(r.key)} className="p-2 text-rose-500"><Heart size={18} fill={saved.includes(r.key) ? 'currentColor' : 'none'} /></button></div>
        <h3 className="mt-1 font-bold text-gray-900">{title(r)}</h3><p className="mt-1 text-xs text-gray-500">{r.rank} · {r.unit}</p>
        <p className="mt-3 text-xl font-black text-gray-900">{formatWon(r.today)}</p>
        <p className="mt-1 text-xs text-gray-500">{r.changeRate === null ? '등락 정보 없음' : `${r.changeLabel} ${r.changeRate > 0 ? '+' : ''}${r.changeRate.toFixed(1)}%`}</p>
        <button aria-pressed={selected.includes(r.key)} disabled={!selected.includes(r.key) && selected.length >= 3} onClick={() => setSelected(prev => prev.includes(r.key) ? prev.filter(k => k !== r.key) : [...prev, r.key])} className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg bg-emerald-50 py-2 text-sm font-bold text-emerald-800 disabled:opacity-40">{selected.includes(r.key) && <Check size={14} />}{selected.includes(r.key) ? '비교 해제' : '비교 담기'}</button>
      </article>)}
      {visible.length === 0 && <p className="w-full rounded-2xl bg-gray-50 p-6 text-center text-sm text-gray-500">{rows.length === 0 ? '시세가 도착하면 품목을 보여드릴게요.' : tab === 'saved' ? '관심 품목이 없어요. 전체 탐색에서 하트를 눌러 보세요.' : '조건에 맞는 품목이 없어요. 전체 탐색이나 다른 검색어를 이용해 주세요.'}</p>}
    </div>
    <p role="status" className="text-xs text-gray-500">{notice || '비교 담기로 최대 3개 품목을 함께 확인할 수 있어요.'}</p>
    {compared.length > 0 && <div className="rounded-2xl border border-emerald-200 bg-white p-4">
      <div className="flex justify-between"><h3 className="font-bold">시세 비교 {compared.length}/3</h3><button className="text-sm text-gray-500" onClick={() => setSelected([])}>비교 비우기</button></div>
      <p className="my-2 text-xs text-gray-500">단위·품종·등급이 다르면 가격을 직접 비교하기 어려워요. 실제 판매가와 차이가 있어요.</p>
      <div className="overflow-x-auto"><table className="w-full min-w-[320px] text-left text-sm"><caption className="sr-only">품목별 공시 가격 비교</caption><thead><tr><th className="py-2">품목</th>{compared.map(r => <th key={r.key} className="p-2 align-top">{title(r)}<button aria-label={`${title(r)} 비교에서 제거`} className="block text-xs font-normal text-gray-500" onClick={() => setSelected(prev => prev.filter(k => k !== r.key))}>제거</button></th>)}</tr></thead><tbody>{(['규격', '공시가', '1주 전', '1개월 전'] as const).map(label => <tr key={label} className="border-t border-gray-100"><th className="py-3 text-xs font-normal text-gray-500">{label}</th>{compared.map(r => <td key={r.key} className="p-2">{label === '규격' ? `${r.rank} · ${r.unit}` : formatWon(label === '공시가' ? r.today : label === '1주 전' ? r.weekAgo : r.monthAgo)}</td>)}</tr>)}</tbody></table></div>
    </div>}
    <details className="rounded-2xl bg-stone-100 p-4 text-sm text-gray-700"><summary className="cursor-pointer font-bold">장보기 전에 꼭 확인하세요</summary><ul className="mt-3 space-y-2 pl-4 list-disc"><li>수산물은 원산지와 활어·선어·냉동 여부를 확인하세요.</li><li>손질 전후 중량과 배송비·손질비를 포함한 총액을 비교하세요.</li><li>농산물은 품종·크기·등급과 실제 배송 중량을 확인하세요.</li><li>시세는 공시일 기준 전국 평균이며, 매장 판매 가격이 아니에요.</li></ul></details>
  </section>;
};
