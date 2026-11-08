import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { useAgri } from './AgriContext';
import { GROUPS, Group, SUB_FILTERS, fmtDate, groupOf, itemSpec } from './agriModel';
import { ItemRow } from './AgriRows';
import { Chip, Empty, ExitHomeButton, SourceFooter, UnderlineTabs } from './AgriUi';

type Sort = 'down' | 'up' | 'low' | 'name';
const SORTS: { id: Sort; label: string }[] = [
  { id: 'down', label: '많이 내린 순' },
  { id: 'up', label: '많이 오른 순' },
  { id: 'low', label: '가격 낮은 순' },
  { id: 'name', label: '이름순' },
];

/** 시세 목록: 농산물/수산물 탭, 분류 칩, 검색, 정렬. 카드 대신 촘촘한 리스트로 여러 품목을 한눈에 비교합니다. */
export const AgriPrices: React.FC = () => {
  const { items, date, status, preset } = useAgri();
  const [group, setGroup] = useState<Group>(preset.group || 'agri');
  const [sub, setSub] = useState('all');
  const [sort, setSort] = useState<Sort>(preset.sort || 'down');
  const [query, setQuery] = useState(preset.query || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setGroup(preset.group || 'agri');
    setSort(preset.sort || 'down');
    setQuery(preset.query || '');
    setSub('all');
    if (preset.focus) setTimeout(() => inputRef.current?.focus(), 50);
  }, [preset]);

  const q = query.trim();
  const filters = SUB_FILTERS[group];
  const list = useMemo(() => {
    const test = filters.find(f => f.id === sub)?.test || (() => true);
    // 검색 중에는 탭과 상관없이 전체 품목에서 찾습니다.
    const base = q
      ? items.filter(i => `${i.rep.itemName} ${itemSpec(i.rep)} ${i.rep.kindName}`.includes(q))
      : items.filter(i => groupOf(i.rep.category) === group && test(i.rep));
    const rate = (v: number | null, dir: 1 | -1) => (v === null ? Infinity : v * dir);
    return [...base].sort((a, b) => {
      if (sort === 'down') return rate(a.rep.changeRate, 1) - rate(b.rep.changeRate, 1);
      if (sort === 'up') return rate(a.rep.changeRate, -1) - rate(b.rep.changeRate, -1);
      if (sort === 'low') return (a.rep.today || 0) - (b.rep.today || 0);
      return a.rep.itemName.localeCompare(b.rep.itemName, 'ko');
    });
  }, [items, group, sub, sort, q, filters]);

  return (
    <div className="bg-white min-h-full pb-24">
      <header className="sticky top-0 z-20 bg-white">
        <div className="flex items-center h-12 px-3 gap-2">
          <ExitHomeButton />
          <h1 className="sr-only">시세</h1>
          <label className="flex-1 h-9 px-3 flex items-center gap-2 rounded-[8px] bg-[#F3F4F6]">
            <Search className="w-4 h-4 text-[#8A929A]" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="품목·품종 검색"
              aria-label="품목 검색"
              enterKeyHint="search"
              className="flex-1 min-w-0 bg-transparent text-[14px] text-[#191C20] outline-none placeholder:text-[#8A929A]"
            />
            {query && (
              <button onClick={() => setQuery('')} aria-label="검색어 지우기" className="text-[#8A929A]"><X className="w-4 h-4" /></button>
            )}
          </label>
        </div>
        {!q && <UnderlineTabs value={group} options={GROUPS} onChange={g => { setGroup(g); setSub('all'); }} />}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#ECEEF0]">
          {!q ? (
            <div className="flex-1 min-w-0 flex gap-1.5 overflow-x-auto no-scrollbar">
              {filters.map(f => <Chip key={f.id} active={sub === f.id} onClick={() => setSub(f.id)}>{f.label}</Chip>)}
            </div>
          ) : (
            <p className="flex-1 text-[13px] text-[#5A626B]">‘{q}’ 검색 결과 {list.length}개</p>
          )}
          <label className="relative shrink-0 flex items-center text-[13px] text-[#5A626B]">
            <select value={sort} onChange={e => setSort(e.target.value as Sort)} aria-label="정렬" className="appearance-none bg-transparent pr-4 outline-none">
              {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            <ChevronDown className="absolute right-0 w-3.5 h-3.5 pointer-events-none" />
          </label>
        </div>
        <div className="flex items-center px-4 h-8 bg-[#FAFAFB] border-b border-[#ECEEF0] text-[11.5px] text-[#8A929A]">
          <span className="flex-1">품목 · 규격 · 단위</span>
          <span className="mr-9">현재가 · 전일 대비</span>
        </div>
      </header>

      {status === 'loading' && items.length === 0 && <p className="py-16 text-center text-[13px] text-[#8A929A]">시세를 불러오는 중이에요</p>}
      {status === 'error' && items.length === 0 && <p className="py-16 text-center text-[13px] text-[#8A929A]">시세를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</p>}
      {items.length > 0 && list.length === 0 && (
        <Empty title={q ? `‘${q}’ 품목이 없어요` : '이 분류에 공시된 품목이 없어요'} desc={q ? 'KAMIS가 조사하는 품목만 볼 수 있어요. 다른 이름으로 검색해 보세요.' : undefined} />
      )}
      {list.map(i => <ItemRow key={i.id} item={i} />)}

      {list.length > 0 && <SourceFooter date={date ? fmtDate(date) : undefined} extra="등락률은 전일 공시가 기준이고, 전일 공시가 없으면 1주·2주 전과 비교해 표시해요." />}
    </div>
  );
};
