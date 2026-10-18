import React, { useState } from 'react';
import { ChevronLeft, ChevronDown, ExternalLink, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { openExternal } from '../../data/donkiGuide';
import {
  TTEOK_CHANNELS, TTEOK_ITEMS, TTEOK_TIPS, TteokItem, tteokSearchUrl,
} from '../../data/tteokGuide';

type Tab = 'hot' | 'season' | 'where' | 'tip';
const TABS: { id: Tab; label: string }[] = [
  { id: 'hot', label: '인기 떡' },
  { id: 'season', label: '시즌 한정' },
  { id: 'where', label: '파는 곳' },
  { id: 'tip', label: '꿀팁' },
];

const ItemCard: React.FC<{ item: TteokItem; open: boolean; onToggle: () => void }> = ({ item, open, onToggle }) => (
  <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
    <button onClick={onToggle} className="w-full flex items-center gap-3 p-3.5 text-left active:bg-gray-50">
      <div className={`w-16 h-16 shrink-0 rounded-xl flex items-center justify-center text-[34px] ${item.tone}`}>{item.emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-500 text-[10px] font-black">{item.tag}</span>
          {item.season !== '사계절' && <span className="text-[10px] font-bold text-gray-400">{item.season}</span>}
        </div>
        <p className="mt-1 text-[15px] font-black text-gray-900 truncate">{item.name}</p>
        <p className="text-[12px] text-gray-500 leading-snug line-clamp-2">{item.summary}</p>
      </div>
      <ChevronDown className={`w-5 h-5 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
    {open && (
      <div className="px-4 pb-4 border-t border-gray-50">
        <p className="mt-3 text-[13px] text-gray-700 leading-relaxed">{item.desc}</p>
        <dl className="mt-3 space-y-1.5 text-[12.5px]">
          <div className="flex gap-2"><dt className="w-14 shrink-0 text-gray-400">맛</dt><dd className="text-gray-800 font-semibold">{item.taste}</dd></div>
          <div className="flex gap-2"><dt className="w-14 shrink-0 text-gray-400">이럴 때</dt><dd className="text-gray-800 font-semibold">{item.goodFor}</dd></div>
          <div className="flex gap-2"><dt className="w-14 shrink-0 text-gray-400">꿀팁</dt><dd className="text-gray-800">{item.tip}</dd></div>
        </dl>
        <p className="mt-4 text-[12px] font-black text-gray-900">어디서 파나요?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {TTEOK_CHANNELS.map(c => (
            <button
              key={c.id}
              onClick={() => openExternal(tteokSearchUrl(c, c.kind === '매장' ? `${item.keyword} 떡집` : item.keyword))}
              className={`h-8 px-3 rounded-full text-[12px] font-bold flex items-center gap-1 active:opacity-70 ${
                c.kind === '매장' ? 'bg-[#FFE9EC] text-rose-600' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <span>{c.emoji}</span>{c.name}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
);

/** 모바일 떡집 기획전 (PC 는 src/pc/PcTteok) */
export const TteokView: React.FC = () => {
  const { setActiveTab } = useApp();
  const [tab, setTab] = useState<Tab>('hot');
  const [openId, setOpenId] = useState<string | null>(TTEOK_ITEMS[0].id);

  const list = tab === 'season' ? TTEOK_ITEMS.filter(i => i.season !== '사계절') : TTEOK_ITEMS;

  return (
    <div className="pb-24 bg-white min-h-full">
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100">
        <div className="relative flex items-center justify-between px-2 h-12">
          <button onClick={() => setActiveTab('home')} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-900 active:bg-gray-100" aria-label="뒤로">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            <h1 className="text-[17px] font-black tracking-tight text-gray-900">떡집 기획전</h1>
            <span className="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-600 text-[10px] font-black">떡</span>
          </div>
          <span className="w-10" />
        </div>
        <div className="flex px-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative flex-1 py-3 text-[13.5px] transition-colors ${tab === t.id ? 'font-black text-gray-900' : 'font-medium text-gray-400'}`}
            >
              {t.label}
              {tab === t.id && <span className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[3px] w-10 rounded-full bg-rose-400" />}
            </button>
          ))}
        </div>
      </header>

      {(tab === 'hot' || tab === 'season') && (
        <>
          <section className="bg-rose-50 rounded-b-[28px] px-5 pt-5 pb-5">
            <p className="text-[11px] font-black tracking-[0.15em] text-rose-400">TTEOK GUIDE</p>
            <h2 className="mt-1.5 text-[22px] leading-tight font-black text-gray-900">
              {tab === 'hot' ? <>요즘 줄 서서 먹는<br />유행 떡 모음</> : <>지금 아니면 못 먹는<br />시즌 한정 떡</>}
            </h2>
            <p className="mt-2 text-[12.5px] text-gray-600">카드를 누르면 설명과 파는 곳을 볼 수 있어요.</p>
            <button
              onClick={() => openExternal(tteokSearchUrl(TTEOK_CHANNELS[0], '떡집'))}
              className="mt-4 h-10 px-4 rounded-full bg-gray-900 text-white text-[13px] font-bold flex items-center gap-1.5 active:opacity-80"
            >
              <MapPin className="w-4 h-4" /> 내 주변 떡집 찾기
            </button>
          </section>
          <div className="px-4 pt-5 space-y-3">
            {list.map(item => (
              <ItemCard key={item.id} item={item} open={openId === item.id} onToggle={() => setOpenId(openId === item.id ? null : item.id)} />
            ))}
          </div>
        </>
      )}

      {tab === 'where' && (
        <div className="px-4 pt-5 space-y-3">
          <p className="text-[13px] text-gray-600 leading-relaxed">가게마다 만드는 메뉴가 달라요. 메뉴 이름으로 검색하면 실제로 파는 곳을 찾기 쉬워요.</p>
          {TTEOK_CHANNELS.map(c => (
            <div key={c.id} className="rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center gap-2">
                <span className="text-[22px]">{c.emoji}</span>
                <p className="text-[15px] font-black text-gray-900">{c.name}</p>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${c.kind === '매장' ? 'bg-rose-50 text-rose-500' : 'bg-gray-100 text-gray-500'}`}>{c.kind === '매장' ? '매장 방문' : '택배'}</span>
              </div>
              <p className="mt-1 text-[12.5px] text-gray-500">{c.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {TTEOK_ITEMS.slice(0, 5).map(i => (
                  <button
                    key={i.id}
                    onClick={() => openExternal(tteokSearchUrl(c, c.kind === '매장' ? `${i.keyword} 떡집` : i.keyword))}
                    className="h-8 px-3 rounded-full bg-gray-100 text-gray-800 text-[12px] font-bold flex items-center gap-1 active:bg-gray-200"
                  >
                    {i.name.split(' ')[0]} <ExternalLink className="w-3 h-3 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'tip' && (
        <div className="px-4 pt-5 space-y-3">
          {TTEOK_TIPS.map(t => (
            <div key={t.title} className="rounded-2xl border border-gray-100 p-4">
              <p className="text-[24px] leading-none">{t.emoji}</p>
              <p className="mt-2 text-[15px] font-black text-gray-900">{t.title}</p>
              <p className="mt-1 text-[13px] text-gray-600 leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      )}

      <p className="px-5 pt-6 text-[11px] text-gray-400 leading-relaxed">
        신상픽이 정리한 떡 가이드예요. 가격·메뉴·재고는 가게마다 달라서 검색 결과에서 직접 확인해 주세요.
      </p>
    </div>
  );
};
