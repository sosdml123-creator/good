import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { getProductLaunchTime } from '../utils/ranking';
import { formatProductPrice } from '../utils/formatters';
import { SafeImage } from '../components/common/SafeImage';
import { PcProductCard } from './PcProductCard';
import { PcBreadcrumb, PcContainer, PcEmpty, PcTextTabs } from './PcUi';

const STORES: { name: string; color: string; bg: string }[] = [
  { name: 'CU', color: 'text-gray-900', bg: 'bg-[#F7F7F8]' },
  { name: 'GS25', color: 'text-gray-900', bg: 'bg-[#F7F7F8]' },
  { name: '세븐일레븐', color: 'text-gray-900', bg: 'bg-[#F7F7F8]' },
  { name: '이마트24', color: 'text-gray-900', bg: 'bg-[#F7F7F8]' },
];

const STORE_CATEGORIES = ['전체', '과자', '음료', '간편식', '빵·디저트', '아이스크림'];

const byLaunchDesc = (a: Product, b: Product) => (getProductLaunchTime(b) ?? 0) - (getProductLaunchTime(a) ?? 0);

const PcPageHero: React.FC<{ crumb: string; title: string; subtitle: string; tone: string }> = ({ crumb, title, subtitle, tone }) => {
  const { setActiveTab } = useApp();
  return (
    <section className={`${tone} border-b border-gray-100`}>
      <PcContainer className="pt-6 pb-10">
        <PcBreadcrumb items={[{ label: '홈', onClick: () => setActiveTab('home') }, { label: crumb }]} />
        <span className="mt-6 inline-block px-2 py-0.5 rounded border border-gray-300 text-gray-500 text-[12px] font-medium">PC 전용</span>
        <h1 className="mt-3 text-[32px] font-bold text-gray-900 tracking-tight">{title}</h1>
        <p className="mt-2 text-[15px] text-gray-600">{subtitle}</p>
      </PcContainer>
    </section>
  );
};

const StoreRow: React.FC<{ p: Product; rank: number }> = ({ p, rank }) => {
  const { openProductDetail } = useApp();
  return (
    <li>
      <button onClick={() => openProductDetail(p.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 cursor-pointer">
        <span className="w-4 text-[13px] font-bold text-gray-400">{rank}</span>
        <SafeImage src={p.image} alt={p.name} fallbackCategory={p.category} fallbackName={p.name} className="w-14 h-14 rounded-lg object-cover bg-[#F7F7F8] shrink-0" loading="lazy" />
        <span className="min-w-0 flex-1">
          <span className="block text-[12px] text-gray-400 truncate">{p.brand}</span>
          <span className="block text-[14px] text-gray-900 leading-snug line-clamp-2">{p.name}</span>
          <span className="mt-0.5 block text-[13px] font-bold text-gray-900">{formatProductPrice(p.price)}</span>
        </span>
      </button>
    </li>
  );
};

/** PC 전용: 편의점 4사 신상을 한 화면에 나란히 비교 */
export const PcStores: React.FC = () => {
  const { products } = useApp();
  const [category, setCategory] = useState('전체');
  const [limit, setLimit] = useState(10);

  const columns = useMemo(() => STORES.map(store => {
    const list = products
      .filter(p => (p.stores || []).includes(store.name) && (category === '전체' || p.category === category))
      .sort(byLaunchDesc);
    return { store, list };
  }), [products, category]);

  return (
    <div className="bg-white pb-24">
      <PcPageHero crumb="편의점 비교" title="편의점 4사 신상 한눈에 비교" subtitle="CU · GS25 · 세븐일레븐 · 이마트24 신상을 나란히 놓고 최신순으로 비교해 보세요." tone="bg-white" />
      <PcContainer className="pt-10">
        <PcTextTabs items={STORE_CATEGORIES} value={category} onChange={(v) => { setCategory(v); setLimit(10); }} />
        <div className="mt-8 grid grid-cols-4 gap-4">
          {columns.map(({ store, list }) => (
            <div key={store.name} className="rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
              <div className={`${store.bg} px-4 py-4 flex items-baseline justify-between`}>
                <p className={`text-[20px] font-black ${store.color}`}>{store.name}</p>
                <p className="text-[12px] text-gray-500">{list.length}개</p>
              </div>
              {list.length > 0 ? (
                <ol className="divide-y divide-gray-100">
                  {list.slice(0, limit).map((p, i) => <StoreRow key={p.id} p={p} rank={i + 1} />)}
                </ol>
              ) : (
                <p className="py-16 text-center text-[13px] text-gray-400">등록된 신상이 없어요.</p>
              )}
            </div>
          ))}
        </div>
        {columns.some(c => c.list.length > limit) && (
          <div className="mt-10 flex justify-center">
            <button onClick={() => setLimit(l => l + 10)} className="w-[320px] h-12 rounded-lg border border-gray-300 text-[14px] font-semibold text-gray-800 hover:border-gray-900 cursor-pointer">
              10개 더 보기
            </button>
          </div>
        )}
      </PcContainer>
    </div>
  );
};

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const dayKey = (t: number) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

/** PC 전용: 신상 출시 캘린더 (월간) */
export const PcReleases: React.FC = () => {
  const { products } = useApp();
  const now = new Date();
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [selected, setSelected] = useState<string | null>(dayKey(now.getTime()));

  // 출시일이 날짜까지 정확히 적힌 상품만 캘린더에 올립니다 (등록일로 추정한 것은 제외).
  const byDay = useMemo(() => {
    const map = new Map<string, Product[]>();
    for (const p of products) {
      if (!/(20\d{2})\s*[.\-/년]\s*(\d{1,2})\s*[.\-/월]\s*(\d{1,2})/.test(p.releaseDate || '')) continue;
      const t = getProductLaunchTime(p);
      if (t === null) continue;
      const k = dayKey(t);
      const list = map.get(k) || [];
      list.push(p);
      map.set(k, list);
    }
    return map;
  }, [products]);

  const first = new Date(cursor.y, cursor.m, 1);
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: first.getDay() }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthTotal = Array.from({ length: daysInMonth }, (_, i) => byDay.get(`${cursor.y}-${cursor.m}-${i + 1}`)?.length || 0).reduce((a, b) => a + b, 0);
  const todayKey = dayKey(now.getTime());
  const selectedList = selected ? byDay.get(selected) || [] : [];
  const selectedLabel = selected ? (() => { const [, m, d] = selected.split('-').map(Number); return `${m + 1}월 ${d}일`; })() : '';

  const move = (delta: number) => setCursor(c => {
    const d = new Date(c.y, c.m + delta, 1);
    return { y: d.getFullYear(), m: d.getMonth() };
  });

  return (
    <div className="bg-white pb-24">
      <PcPageHero crumb="출시 캘린더" title="신상 출시 캘린더" subtitle="언제 어떤 신상이 나왔는지 달력으로 한눈에 확인하세요." tone="bg-white" />
      <PcContainer className="pt-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => move(-1)} aria-label="이전 달" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 cursor-pointer"><ChevronLeft className="w-5 h-5" /></button>
            <p className="w-40 text-center text-[24px] font-bold text-gray-900">{cursor.y}년 {cursor.m + 1}월</p>
            <button onClick={() => move(1)} aria-label="다음 달" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 cursor-pointer"><ChevronRight className="w-5 h-5" /></button>
          </div>
          <p className="text-[14px] text-gray-600">이번 달 출시 <span className="font-bold text-gray-900">{monthTotal}</span>개</p>
        </div>

        <div className="mt-6 grid grid-cols-7 border-t border-l border-gray-200">
          {WEEKDAYS.map((w, i) => (
            <div key={w} className={`py-2.5 text-center text-[13px] font-semibold border-r border-b border-gray-200 bg-[#F8F8FA] ${i === 0 ? 'text-rose-500' : i === 6 ? 'text-blue-500' : 'text-gray-600'}`}>{w}</div>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <div key={`e${i}`} className="h-[120px] border-r border-b border-gray-200 bg-[#FCFCFD]" />;
            const k = `${cursor.y}-${cursor.m}-${day}`;
            const list = byDay.get(k) || [];
            const isSelected = selected === k;
            return (
              <button
                key={k}
                onClick={() => setSelected(k)}
                className={`h-[120px] p-2 border-r border-b border-gray-200 text-left flex flex-col cursor-pointer transition-colors ${isSelected ? 'bg-gray-100 ring-2 ring-inset ring-gray-900' : 'hover:bg-gray-50'}`}
              >
                <span className={`text-[13px] font-semibold ${k === todayKey ? 'w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center' : 'text-gray-700'}`}>{day}</span>
                {list.length > 0 && (
                  <span className="mt-auto flex items-center">
                    {list.slice(0, 3).map(p => (
                      <SafeImage key={p.id} src={p.image} alt="" fallbackCategory={p.category} fallbackName={p.name} className="w-9 h-9 -mr-2 rounded-full object-cover bg-white border-2 border-white" loading="lazy" />
                    ))}
                    {list.length > 3 && <span className="ml-3 text-[12px] font-semibold text-gray-500">+{list.length - 3}</span>}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-12">
          <h2 className="text-[22px] font-bold text-gray-900 mb-6">
            {selectedLabel} 출시 신상 <span className="text-gray-900">{selectedList.length}</span>
          </h2>
          {selectedList.length > 0 ? (
            <div className="grid grid-cols-5 gap-x-5 gap-y-10">
              {selectedList.map(p => <PcProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <PcEmpty message="이 날짜에 출시된 신상이 없어요. 달력에서 사진이 있는 날짜를 눌러보세요." />
          )}
        </div>
      </PcContainer>
    </div>
  );
};

/** 홈에서 PC 전용 기능을 소개하는 카드 */
export const PcExclusiveStrip: React.FC = () => {
  const { setActiveTab } = useApp();
  const items = [
    { tab: 'market' as const, title: '오늘의 장바구니 시세', desc: '채소·과일·축산·수산물 소매가 등락을 매일 확인', tone: '' },
    { tab: 'stores' as const, title: '편의점 4사 신상 비교', desc: 'CU·GS25·세븐일레븐·이마트24를 나란히', tone: '' },
    { tab: 'releases' as const, title: '신상 출시 캘린더', desc: '날짜별로 어떤 신상이 나왔는지 달력으로', tone: '' },
  ];
  return (
    <div className="grid grid-cols-3 gap-5">
      {items.map(it => (
        <button key={it.tab} onClick={() => setActiveTab(it.tab)} className="group text-left rounded-2xl border border-gray-200 bg-white p-6 cursor-pointer hover:border-gray-900 transition-colors">
          <span className="inline-block px-2 py-0.5 rounded border border-gray-300 text-gray-500 text-[11px] font-medium">PC 전용</span>
          <p className="mt-3 text-[19px] font-bold text-gray-900">{it.title}</p>
          <p className="mt-1 text-[13px] text-gray-500">{it.desc}</p>
          <span className="mt-4 inline-flex items-center text-[13px] font-semibold text-gray-900">바로가기 <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" /></span>
        </button>
      ))}
    </div>
  );
};

