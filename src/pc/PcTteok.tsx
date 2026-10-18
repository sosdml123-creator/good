import React, { useState } from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { openExternal } from '../data/donkiGuide';
import { TTEOK_CHANNELS, TTEOK_ITEMS, TTEOK_TIPS, tteokSearchUrl } from '../data/tteokGuide';
import { PcBreadcrumb, PcContainer, PcTextTabs } from './PcUi';

const TABS = ['인기 떡', '시즌 한정', '파는 곳', '구매 꿀팁'] as const;
type Tab = typeof TABS[number];

/** PC 전용 떡집 기획전 (모바일은 components/tteok/TteokView) */
export const PcTteok: React.FC = () => {
  const { setActiveTab } = useApp();
  const [tab, setTab] = useState<Tab>('인기 떡');

  const list = tab === '시즌 한정' ? TTEOK_ITEMS.filter(i => i.season !== '사계절') : TTEOK_ITEMS;

  return (
    <div className="pb-24 bg-white">
      <PcContainer className="pt-6">
        <PcBreadcrumb items={[{ label: '홈', onClick: () => setActiveTab('home') }, { label: '떡집 기획전' }]} />
      </PcContainer>

      <PcContainer className="mt-5">
        <section className="relative overflow-hidden rounded-3xl bg-rose-50 px-14 py-12 grid grid-cols-[1fr_auto] items-center gap-10">
          <div className="relative z-10">
            <p className="text-[13px] font-black tracking-[0.2em] text-rose-400">TTEOK GUIDE</p>
            <h1 className="mt-3 text-[44px] leading-[1.15] font-black text-gray-900 tracking-tight">요즘 줄 서서 먹는<br />유행 떡 모음</h1>
            <p className="mt-4 text-[16px] text-gray-600 font-medium">피자설기부터 크림치즈 설기, 떡케이크까지. 어떤 떡인지 알아보고 파는 곳까지 바로 찾아보세요.</p>
            <div className="mt-7 flex gap-3">
              <button onClick={() => setTab('인기 떡')} className="h-12 px-6 rounded-xl bg-gray-900 text-white text-[15px] font-bold cursor-pointer">유행 떡 보기</button>
              <button
                onClick={() => openExternal(tteokSearchUrl(TTEOK_CHANNELS[0], '떡집'))}
                className="h-12 px-6 rounded-xl bg-white text-gray-900 text-[15px] font-bold cursor-pointer flex items-center gap-1.5 hover:bg-gray-50"
              >
                <MapPin className="w-4 h-4" /> 내 주변 떡집 찾기
              </button>
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-3 gap-3 text-[56px] leading-none">
            {['🍕', '🧀', '🎂'].map(e => <div key={e} className="w-[110px] h-[110px] rounded-2xl bg-white flex items-center justify-center">{e}</div>)}
          </div>
        </section>
      </PcContainer>

      <PcContainer className="mt-10">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <PcTextTabs items={[...TABS]} value={tab} onChange={(v) => setTab(v as Tab)} />
          <p className="text-[12px] text-gray-400">가격·메뉴·재고는 가게마다 달라요</p>
        </div>

        {(tab === '인기 떡' || tab === '시즌 한정') && (
          <div className="mt-8 grid grid-cols-3 gap-6">
            {list.map(item => (
              <div key={item.id} className="rounded-3xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                <div className={`relative h-40 flex items-center justify-center text-[72px] ${item.tone}`}>
                  {item.emoji}
                  <span className="absolute top-4 left-4 h-7 px-3 rounded-full bg-gray-900 text-white text-[12px] font-black flex items-center">{item.tag}</span>
                  {item.season !== '사계절' && <span className="absolute top-4 right-4 h-7 px-3 rounded-full bg-white text-gray-700 text-[12px] font-bold flex items-center">{item.season}</span>}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-[20px] font-black text-gray-900">{item.name}</p>
                  <p className="mt-1 text-[14px] text-gray-500">{item.summary}</p>
                  <p className="mt-3 text-[14px] text-gray-700 leading-relaxed flex-1">{item.desc}</p>
                  <dl className="mt-4 space-y-1.5 text-[13px]">
                    <div className="flex gap-3"><dt className="w-14 shrink-0 text-gray-400">맛</dt><dd className="font-semibold text-gray-800">{item.taste}</dd></div>
                    <div className="flex gap-3"><dt className="w-14 shrink-0 text-gray-400">이럴 때</dt><dd className="font-semibold text-gray-800">{item.goodFor}</dd></div>
                    <div className="flex gap-3"><dt className="w-14 shrink-0 text-gray-400">꿀팁</dt><dd className="text-gray-700">{item.tip}</dd></div>
                  </dl>
                  <p className="mt-5 text-[13px] font-black text-gray-900">어디서 파나요?</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {TTEOK_CHANNELS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => openExternal(tteokSearchUrl(c, c.kind === '매장' ? `${item.keyword} 떡집` : item.keyword))}
                        className={`h-9 px-3.5 rounded-lg text-[13px] font-bold cursor-pointer flex items-center gap-1 ${
                          c.kind === '매장' ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span>{c.emoji}</span>{c.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === '파는 곳' && (
          <div className="mt-8">
            <p className="text-[14px] text-gray-500">가게마다 만드는 메뉴가 달라요. 메뉴 이름으로 검색하면 실제로 파는 곳을 찾기 쉬워요.</p>
            <div className="mt-6 grid grid-cols-2 gap-5">
              {TTEOK_CHANNELS.map(c => (
                <div key={c.id} className="rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[30px]">{c.emoji}</span>
                    <p className="text-[18px] font-black text-gray-900">{c.name}</p>
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${c.kind === '매장' ? 'bg-rose-50 text-rose-500' : 'bg-gray-100 text-gray-500'}`}>{c.kind === '매장' ? '매장 방문' : '택배'}</span>
                  </div>
                  <p className="mt-2 text-[14px] text-gray-500">{c.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {TTEOK_ITEMS.map(i => (
                      <button
                        key={i.id}
                        onClick={() => openExternal(tteokSearchUrl(c, c.kind === '매장' ? `${i.keyword} 떡집` : i.keyword))}
                        className="h-9 px-3.5 rounded-lg bg-gray-100 text-gray-800 text-[13px] font-bold flex items-center gap-1 cursor-pointer hover:bg-gray-200"
                      >
                        {i.name.split(' ')[0]} <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === '구매 꿀팁' && (
          <div className="mt-8 grid grid-cols-2 gap-5">
            {TTEOK_TIPS.map(t => (
              <div key={t.title} className="rounded-2xl border border-gray-200 p-7">
                <p className="text-[32px] leading-none">{t.emoji}</p>
                <p className="mt-4 text-[19px] font-black text-gray-900">{t.title}</p>
                <p className="mt-2 text-[15px] text-gray-600 leading-relaxed">{t.body}</p>
              </div>
            ))}
          </div>
        )}
      </PcContainer>
    </div>
  );
};
