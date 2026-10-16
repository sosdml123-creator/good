import React, { useMemo, useState } from 'react';
import { ChevronRight, ShoppingBasket, Store } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { getProductLaunchTime } from '../utils/ranking';
import { formatProductPrice } from '../utils/formatters';
import { SafeImage } from '../components/common/SafeImage';
import { PcBreadcrumb, PcContainer, PcTextTabs } from './PcUi';

const STORES: { name: string; color: string; bg: string }[] = [
  { name: 'CU', color: 'text-[#652F8D]', bg: 'bg-[#F7F7F8]' },
  { name: 'GS25', color: 'text-[#0072CE]', bg: 'bg-[#F7F7F8]' },
  { name: '세븐일레븐', color: 'text-[#00804A]', bg: 'bg-[#F7F7F8]' },
  { name: '이마트24', color: 'text-[#B8860B]', bg: 'bg-[#F7F7F8]' },
];

const STORE_CATEGORIES = ['전체', '과자', '음료', '간편식', '빵·디저트', '아이스크림'];

const byLaunchDesc = (a: Product, b: Product) => (getProductLaunchTime(b) ?? 0) - (getProductLaunchTime(a) ?? 0);

const PcPageHero: React.FC<{ crumb: string; title: string; subtitle: string; tone: string }> = ({ crumb, title, subtitle, tone }) => {
  const { setActiveTab } = useApp();
  return (
    <section className={`${tone} border-b border-gray-100`}>
      <PcContainer className="pt-6 pb-10">
        <PcBreadcrumb items={[{ label: '홈', onClick: () => setActiveTab('home') }, { label: crumb }]} />
        <h1 className="mt-6 text-[32px] font-bold text-gray-900 tracking-tight">{title}</h1>
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

/** 편의점 4사 신상을 한 화면에 나란히 비교 (DB에 등록된 상품의 판매처 기준, 출시일 최신순) */
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

/** 홈에서 시세·편의점 비교 화면을 소개하는 카드 */
export const PcExclusiveStrip: React.FC = () => {
  const { setActiveTab } = useApp();
  const items = [
    { tab: 'market' as const, title: '오늘의 장바구니 시세', desc: '채소·과일·축산·수산물 소매가 등락을 매일 확인', icon: ShoppingBasket },
    { tab: 'stores' as const, title: '편의점 4사 신상 비교', desc: 'CU·GS25·세븐일레븐·이마트24를 나란히', icon: Store },
  ];
  return (
    <div className="grid grid-cols-2 gap-5">
      {items.map(it => (
        <button key={it.tab} onClick={() => setActiveTab(it.tab)} className="group text-left rounded-2xl border border-gray-200 bg-white p-6 cursor-pointer hover:border-gray-400 transition-all">
          <span className="w-11 h-11 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center"><it.icon className="w-5 h-5" /></span>
          <p className="mt-3 text-[19px] font-bold text-gray-900">{it.title}</p>
          <p className="mt-1 text-[13px] text-gray-500">{it.desc}</p>
          <span className="mt-4 inline-flex items-center text-[13px] font-semibold text-gray-900">바로가기 <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" /></span>
        </button>
      ))}
    </div>
  );
};

