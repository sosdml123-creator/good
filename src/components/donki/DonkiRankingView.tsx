import React, { useState } from 'react';
import {
  ChevronLeft, Pill, Sparkles, Cookie, Package, Check, Plus, Loader2, RefreshCw,
  Volume2, Maximize2, MapPin, ExternalLink, Crown, ShoppingBag,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DonkiCategory, DonkiItem } from '../../services/donkiService';
import { useDonki } from '../../hooks/useDonki';
import { DONKI_TIPS, PHRASE_GROUPS, PRICE_TAG_WORDS, googleMapsUrl, openExternal, speakJapanese } from '../../data/donkiGuide';
import { DonkiShowCard, ShowCardContent } from './DonkiShowCard';

type Tab = 'rank' | 'list' | 'phrase' | 'store' | 'tip';
const CATEGORY_FILTERS: ('전체' | DonkiCategory)[] = ['전체', '의약품', '화장품', '과자·식품', '생활용품'];

const CATEGORY_STYLE: Record<DonkiCategory, { icon: React.ReactNode; color: string }> = {
  '의약품': { icon: <Pill className="w-6 h-6" />, color: 'bg-sky-50 text-sky-600' },
  '화장품': { icon: <Sparkles className="w-6 h-6" />, color: 'bg-pink-50 text-pink-500' },
  '과자·식품': { icon: <Cookie className="w-6 h-6" />, color: 'bg-amber-50 text-amber-600' },
  '생활용품': { icon: <Package className="w-6 h-6" />, color: 'bg-emerald-50 text-emerald-600' },
};

const WHERE_IS: Pick<ShowCardContent, 'sub' | 'subKo'> = { sub: 'これはどこにありますか？', subKo: '이거 어디에 있어요?' };

const Thumb: React.FC<{ item: DonkiItem; className?: string }> = ({ item, className = 'w-14 h-14' }) => {
  const style = CATEGORY_STYLE[item.category] || CATEGORY_STYLE['생활용품'];
  return (
    <div className={`${className} shrink-0 rounded-xl overflow-hidden flex items-center justify-center ${item.imageUrl ? 'bg-white border border-gray-100' : style.color}`}>
      {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" loading="lazy" /> : style.icon}
    </div>
  );
};

/** 모바일 돈키호테 쇼핑 가이드 (PC 는 src/pc/PcDonki) */
export const DonkiRankingView: React.FC = () => {
  const { setActiveTab, showToast } = useApp();
  const d = useDonki();
  const [tab, setTab] = useState<Tab>('rank');
  const [category, setCategory] = useState<typeof CATEGORY_FILTERS[number]>('전체');
  const [city, setCity] = useState('전체');
  const [showCard, setShowCard] = useState<ShowCardContent | null>(null);

  const speak = (text: string) => {
    if (!speakJapanese(text)) showToast('이 기기에서는 일본어 음성을 지원하지 않아요. 크게 보기로 보여주세요.', 'info');
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: 'rank', label: '필수템' },
    { id: 'list', label: `쇼핑리스트${d.myPicks.size ? ` ${d.myPicks.size}` : ''}` },
    { id: 'phrase', label: '일본어' },
    { id: 'store', label: '매장' },
    { id: 'tip', label: '꿀팁' },
  ];

  const pickButton = (item: DonkiItem, dark = false) => {
    const picked = d.myPicks.has(item.id);
    return (
      <button
        onClick={() => d.togglePick(item)}
        disabled={d.busyId === item.id}
        className={`shrink-0 px-3 py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-colors focus:outline-none disabled:opacity-60 ${
          picked ? 'bg-black text-[#FFE600]' : dark ? 'bg-[#FFE600] text-black' : 'bg-gray-100 text-gray-700'
        }`}
      >
        {picked ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        {picked ? '담았어요' : '살 거예요'}
      </button>
    );
  };

  const filtered = d.ranked.filter(r => category === '전체' || r.item.category === category);
  const podium = category === '전체' ? filtered.slice(0, 3) : [];
  const rest = category === '전체' ? filtered.slice(3) : filtered;

  const stores = d.stores.filter(s => city === '전체' || s.city === city);
  const taxFreeLeft = Math.max(0, 5000 - d.myTotalYen);
  const couponLeft = d.myTotalYen < 10000 ? 10000 - d.myTotalYen : d.myTotalYen < 30000 ? 30000 - d.myTotalYen : 0;

  return (
    <div className="flex-1 flex flex-col bg-[#F6F6F4] pb-28">
      {/* 헤더 + 탭 */}
      <header className="sticky top-0 z-20 bg-black text-white">
        <div className="flex items-center gap-1 px-2 h-12">
          <button onClick={() => setActiveTab('home')} className="w-9 h-9 rounded-full flex items-center justify-center text-white/90 active:bg-white/10" aria-label="뒤로">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-[16px] font-black tracking-tight">돈키호테 쇼핑 가이드</h1>
          <span className="ml-1 px-1.5 py-0.5 rounded bg-[#FFE600] text-black text-[10px] font-black">ドンキ</span>
        </div>
        <div className="flex px-2">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 text-[12.5px] font-bold border-b-[3px] transition-colors ${
                tab === t.id ? 'border-[#FFE600] text-[#FFE600]' : 'border-transparent text-white/55'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* 히어로 */}
      {tab === 'rank' && (
        <section className="bg-[#FFE600] px-5 pt-5 pb-6 relative overflow-hidden">
          <p className="text-[11px] font-black tracking-widest text-black/50">DON QUIJOTE MUST-BUY</p>
          <h2 className="mt-1 text-[24px] leading-[1.2] font-black text-black">
            돈키호테에서<br />이건 꼭 사야 해요
          </h2>
          <p className="mt-2 text-[12px] text-black/70 font-medium">신상픽 회원이 '살 거예요'로 담은 수로 순위를 매겨요</p>
          <div className="mt-4 flex gap-2">
            {[
              { n: d.ranked.length, l: '필수템' },
              { n: d.stores.length, l: '추천 매장' },
              { n: PHRASE_GROUPS.reduce((s, g) => s + g.phrases.length, 0), l: '쇼핑 일본어' },
            ].map(s => (
              <div key={s.l} className="flex-1 rounded-2xl bg-black/90 px-3 py-2.5">
                <p className="text-[18px] font-black text-[#FFE600] leading-none">{s.n}</p>
                <p className="text-[10px] text-white/70 mt-1">{s.l}</p>
              </div>
            ))}
          </div>
          <ShoppingBag className="absolute -right-6 -top-4 w-36 h-36 text-black/[0.06] rotate-12" />
        </section>
      )}

      {d.status === 'loading' && tab !== 'phrase' && tab !== 'tip' && (
        <div className="py-24 flex justify-center text-gray-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
      )}
      {d.status === 'error' && tab !== 'phrase' && tab !== 'tip' && (
        <div className="py-20 text-center text-[12px] text-gray-400">
          정보를 불러오지 못했어요.
          <button onClick={d.load} className="mt-3 mx-auto flex items-center gap-1 px-3 py-1.5 rounded-full bg-black text-white text-[12px] font-semibold">
            <RefreshCw className="w-3.5 h-3.5" /> 다시 시도
          </button>
        </div>
      )}

      {/* 1. 필수템 순위 */}
      {d.status === 'ready' && tab === 'rank' && (
        <div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-4 pt-4">
            {CATEGORY_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setCategory(f)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-bold ${category === f ? 'bg-black text-[#FFE600]' : 'bg-white text-gray-600 border border-gray-200'}`}
              >
                {f}
              </button>
            ))}
          </div>

          {podium.length > 0 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pt-4 snap-x">
              {podium.map(({ item, rank }) => (
                <div key={item.id} className="snap-start shrink-0 w-[200px] rounded-3xl bg-white border border-gray-100 shadow-2xs overflow-hidden">
                  <div className="relative bg-white">
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.name} className="w-full aspect-square object-contain p-3" loading="lazy" />
                      : <Thumb item={item} className="w-full aspect-square" />}
                    <span className="absolute top-2.5 left-2.5 h-8 min-w-8 px-2 rounded-full bg-black text-[#FFE600] text-[14px] font-black flex items-center justify-center gap-1">
                      {rank === 1 && <Crown className="w-3.5 h-3.5" />}{rank}
                    </span>
                  </div>
                  <div className="px-3.5 pb-3.5">
                    <p className="text-[10px] text-gray-400 font-semibold truncate">{item.brand} · {item.category}</p>
                    <p className="text-[14px] font-black text-gray-900 truncate">{item.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{item.nameJa}</p>
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="text-[11px]">
                        {item.priceYen ? <p className="font-black text-gray-900">약 ¥{item.priceYen.toLocaleString()}</p> : null}
                        <p className="text-rose-500 font-semibold">{item.pickCount > 0 ? `${item.pickCount}명 담음` : '첫 번째로 담기'}</p>
                      </div>
                      {pickButton(item, true)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="px-4 mt-4 space-y-2">
            {rest.map(({ item, rank }) => (
              <div key={item.id} className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-3">
                <span className="w-6 shrink-0 text-center text-[17px] font-black italic text-gray-300">{rank}</span>
                <Thumb item={item} />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 font-semibold truncate">{item.brand} · {item.category}</p>
                  <h3 className="text-[13px] font-bold text-gray-900 truncate">{item.name}</h3>
                  <p className="text-[11px] text-gray-500 leading-snug line-clamp-2 mt-0.5">{item.description}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px]">
                    {item.priceYen ? <span className="font-bold text-gray-900">약 ¥{item.priceYen.toLocaleString()}</span> : null}
                    {item.pickCount > 0 && <span className="text-rose-500 font-semibold">{item.pickCount}명 담음</span>}
                  </div>
                </div>
                {pickButton(item)}
              </div>
            ))}
            {filtered.length === 0 && <p className="py-16 text-center text-[12px] text-gray-400">표시할 상품이 없어요.</p>}
          </div>
          <p className="px-4 mt-4 text-[10px] text-gray-400 leading-relaxed">
            가격은 세전 참고가로 매장·시기마다 달라요. 신상픽이 만든 여행 가이드이며 돈키호테 공식 서비스가 아니에요.
          </p>
        </div>
      )}

      {/* 2. 쇼핑리스트 */}
      {d.status === 'ready' && tab === 'list' && (
        <div className="px-4 pt-4">
          {d.myList.length === 0 ? (
            <div className="mt-10 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#FFE600] flex items-center justify-center"><ShoppingBag className="w-7 h-7 text-black" /></div>
              <p className="mt-4 text-[14px] font-bold text-gray-900">아직 쇼핑리스트가 비어 있어요</p>
              <p className="mt-1 text-[12px] text-gray-500">필수템에서 '살 거예요'를 누르면 여기에 모여요.<br />매장에서는 '보여주기'로 점원에게 위치를 물어보세요.</p>
              <button onClick={() => setTab('rank')} className="mt-5 px-5 py-2.5 rounded-full bg-black text-[#FFE600] text-[13px] font-bold">필수템 보러 가기</button>
            </div>
          ) : (
            <>
              <div className="rounded-3xl bg-black text-white p-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[11px] text-white/60">쇼핑 진행</p>
                    <p className="text-[22px] font-black"><span className="text-[#FFE600]">{d.boughtCount}</span> / {d.myList.length}개 샀어요</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-white/60">참고가 합계 (세전)</p>
                    <p className="text-[18px] font-black">약 ¥{d.myTotalYen.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/15 overflow-hidden">
                  <div className="h-full bg-[#FFE600] transition-all" style={{ width: `${(d.boughtCount / d.myList.length) * 100}%` }} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="rounded-xl bg-white/10 px-3 py-2">
                    <p className="text-white/60">면세 (세전 5,000엔)</p>
                    <p className="font-bold text-[#FFE600]">{taxFreeLeft === 0 ? '기준 넘었어요 ✓' : `약 ¥${taxFreeLeft.toLocaleString()} 더`}</p>
                  </div>
                  <div className="rounded-xl bg-white/10 px-3 py-2">
                    <p className="text-white/60">관광객 쿠폰</p>
                    <p className="font-bold text-[#FFE600]">
                      {couponLeft === 0 ? '최대 7% 구간 ✓' : d.myTotalYen >= 10000 ? `5% 구간 · 7%까지 ¥${couponLeft.toLocaleString()}` : `5%까지 약 ¥${couponLeft.toLocaleString()}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                {d.myList.map(({ item }) => {
                  const done = d.bought.has(item.id);
                  return (
                    <div key={item.id} className={`flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-3 ${done ? 'opacity-60' : ''}`}>
                      <button
                        onClick={() => d.toggleBought(item.id)}
                        className={`w-7 h-7 shrink-0 rounded-full border-2 flex items-center justify-center ${done ? 'bg-black border-black' : 'border-gray-300'}`}
                        aria-label={done ? '안 샀어요로 바꾸기' : '샀어요'}
                      >
                        {done && <Check className="w-4 h-4 text-[#FFE600]" />}
                      </button>
                      <Thumb item={item} className="w-12 h-12" />
                      <div className="flex-1 min-w-0">
                        <p className={`text-[13px] font-bold text-gray-900 truncate ${done ? 'line-through' : ''}`}>{item.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{item.nameJa}</p>
                        {item.priceYen ? <p className="text-[11px] font-semibold text-gray-700">약 ¥{item.priceYen.toLocaleString()}</p> : null}
                      </div>
                      <button
                        onClick={() => setShowCard({ ja: item.nameJa || item.name, ko: item.name, image: item.imageUrl, ...WHERE_IS })}
                        className="shrink-0 px-3 py-2 rounded-xl bg-[#FFE600] text-black text-[11px] font-black"
                      >
                        보여주기
                      </button>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-[10px] text-gray-400">'샀어요' 체크는 이 기기에만 저장돼요. 할인·면세 안내는 참고가 기준 예상이에요.</p>
            </>
          )}
        </div>
      )}

      {/* 3. 쇼핑 일본어 */}
      {tab === 'phrase' && (
        <div className="px-4 pt-4 space-y-5">
          <p className="text-[12px] text-gray-500">🔊 를 누르면 일본어로 읽어주고, 크게 보기로 점원에게 화면을 보여줄 수 있어요.</p>
          {PHRASE_GROUPS.map(g => (
            <section key={g.title}>
              <h3 className="text-[14px] font-black text-gray-900 mb-2">{g.emoji} {g.title}</h3>
              <div className="space-y-2">
                {g.phrases.map(p => (
                  <div key={p.ja} className="bg-white rounded-2xl border border-gray-100 p-3.5 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[16px] font-bold text-gray-900 leading-snug">{p.ja}</p>
                      <p className="text-[12px] text-amber-700 font-semibold mt-0.5">{p.sound}</p>
                      <p className="text-[12px] text-gray-500">{p.ko}</p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <button onClick={() => speak(p.ja)} className="w-9 h-9 rounded-full bg-black text-[#FFE600] flex items-center justify-center" aria-label="읽어주기"><Volume2 className="w-4 h-4" /></button>
                      <button onClick={() => setShowCard({ ja: p.ja, ko: p.ko })} className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center" aria-label="크게 보기"><Maximize2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section>
            <h3 className="text-[14px] font-black text-gray-900 mb-2">🏷️ 가격표·표지판 읽기</h3>
            <div className="grid grid-cols-2 gap-2">
              {PRICE_TAG_WORDS.map(w => (
                <button key={w.ja} onClick={() => speak(w.ja)} className="text-left bg-white rounded-2xl border border-gray-100 p-3">
                  <p className="text-[15px] font-black text-gray-900">{w.ja}</p>
                  <p className="text-[10px] text-amber-700 font-semibold">{w.sound}</p>
                  <p className="text-[12px] font-semibold text-gray-700 mt-1">{w.ko}</p>
                  {w.tip && <p className="text-[10px] text-gray-400 leading-snug mt-0.5">{w.tip}</p>}
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* 4. 매장 */}
      {d.status === 'ready' && tab === 'store' && (
        <div className="pt-4">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-4">
            {['전체', ...d.cities].map(c => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-bold ${city === c ? 'bg-black text-[#FFE600]' : 'bg-white text-gray-600 border border-gray-200'}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="px-4 mt-3 space-y-2.5">
            {stores.map(s => (
              <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-[#FFE600] flex items-center justify-center"><MapPin className="w-5 h-5 text-black" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-400">{s.city}{s.area ? ` · ${s.area}` : ''}</p>
                    <p className="text-[14px] font-black text-gray-900">{s.name}</p>
                    <p className="text-[11px] text-gray-500">{s.nameJa}</p>
                    {s.feature && <p className="text-[12px] text-gray-600 leading-snug mt-1.5">{s.feature}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button onClick={() => openExternal(googleMapsUrl(s.nameJa))} className="py-2.5 rounded-xl bg-black text-[#FFE600] text-[12px] font-bold flex items-center justify-center gap-1">
                    <ExternalLink className="w-3.5 h-3.5" /> 지도·영업시간
                  </button>
                  <button
                    onClick={() => setShowCard({ ja: s.nameJa, ko: s.name, sub: 'ここに行きたいです。', subKo: '여기 가고 싶어요' })}
                    className="py-2.5 rounded-xl bg-gray-100 text-gray-800 text-[12px] font-bold"
                  >
                    택시에서 보여주기
                  </button>
                </div>
              </div>
            ))}
            {stores.length === 0 && <p className="py-16 text-center text-[12px] text-gray-400">등록된 매장이 없어요.</p>}
          </div>
          <p className="px-4 mt-3 text-[10px] text-gray-400">영업시간·면세 카운터 운영은 매장마다 달라요. 방문 전 지도에서 확인하세요.</p>
        </div>
      )}

      {/* 5. 꿀팁 */}
      {tab === 'tip' && (
        <div className="px-4 pt-4 space-y-2.5">
          {DONKI_TIPS.map(t => (
            <div key={t.title} className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-[14px] font-black text-gray-900">{t.emoji} {t.title}</p>
              <p className="text-[12.5px] text-gray-600 leading-relaxed mt-1.5">{t.body}</p>
              {t.link && (
                <button onClick={() => openExternal(t.link!.url)} className="mt-3 inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#FFE600] text-black text-[12px] font-black">
                  {t.link.label} <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
          <p className="text-[10px] text-gray-400 leading-relaxed">쿠폰·면세 조건은 바뀔 수 있어요. 2026년 10월 기준 공개 안내를 정리했어요.</p>
        </div>
      )}

      {showCard && <DonkiShowCard content={showCard} onClose={() => setShowCard(null)} />}
    </div>
  );
};
