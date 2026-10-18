import React, { useState } from 'react';
import { Check, Plus, Volume2, Maximize2, MapPin, ExternalLink, Crown, RefreshCw, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DonkiCategory, DonkiItem } from '../services/donkiService';
import { useDonki } from '../hooks/useDonki';
import { DONKI_TIPS, PHRASE_GROUPS, PRICE_TAG_WORDS, googleMapsUrl, openExternal, speakJapanese, comparePrice, won } from '../data/donkiGuide';
import { DonkiShowCard, ShowCardContent } from '../components/donki/DonkiShowCard';
import { DonkiItemDetail } from '../components/donki/DonkiItemDetail';
import { DonkiTalk } from '../components/donki/DonkiTalk';
import { PcBreadcrumb, PcContainer, PcEmpty, PcTextTabs } from './PcUi';

const TABS = ['필수템 순위', '내 쇼핑리스트', '돈키 수다방', '쇼핑 일본어', '매장 찾기', '쇼핑 꿀팁'] as const;
type Tab = typeof TABS[number];
const CATEGORY_FILTERS: ('전체' | DonkiCategory)[] = ['전체', '의약품', '화장품', '과자·식품', '생활용품'];
const WHERE_IS = { sub: 'これはどこにありますか？', subKo: '이거 어디에 있어요?' };

/** PC 전용 돈키호테 쇼핑 가이드 (모바일은 components/donki/DonkiRankingView) */
export const PcDonki: React.FC = () => {
  const { setActiveTab, showToast } = useApp();
  const d = useDonki();
  const [tab, setTab] = useState<Tab>('필수템 순위');
  const [category, setCategory] = useState<typeof CATEGORY_FILTERS[number]>('전체');
  const [city, setCity] = useState('전체');
  const [showCard, setShowCard] = useState<ShowCardContent | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const detailItem = detailId ? d.ranked.find(r => r.item.id === detailId)?.item : undefined;

  // 한국 가격 비교 한 줄
  const krwBadge = (item: DonkiItem) => {
    const c = comparePrice(item.priceYen, item.priceKrw, d.rate?.rate ?? null);
    if (c.pct != null && c.pct > 0) return <span className="text-rose-500 font-bold">한국 {won(item.priceKrw!)}보다 {c.pct}% 저렴</span>;
    if (item.priceKrw) return <span className="text-gray-500">한국 {won(item.priceKrw)}</span>;
    if (item.krwNote?.includes('해외직구')) return <span className="text-gray-500">한국 미판매템</span>;
    return null;
  };
  const rating = (item: DonkiItem) => item.reviewCount > 0 && item.avgRating != null
    ? <span className="text-gray-600 font-semibold">★ {item.avgRating.toFixed(1)} <span className="text-gray-400 font-normal">({item.reviewCount})</span></span>
    : null;

  const speak = (text: string) => {
    if (!speakJapanese(text)) showToast('이 브라우저에서는 일본어 음성을 지원하지 않아요.', 'info');
  };

  const pickButton = (item: DonkiItem, size: 'sm' | 'lg' = 'sm') => {
    const picked = d.myPicks.has(item.id);
    return (
      <button
        onClick={(e) => { e.stopPropagation(); d.togglePick(item); }}
        disabled={d.busyId === item.id}
        className={`flex items-center justify-center gap-1 rounded-lg font-bold cursor-pointer transition-colors disabled:opacity-60 ${
          size === 'lg' ? 'h-11 w-full text-[14px]' : 'h-9 px-3.5 text-[13px]'
        } ${picked ? 'bg-black text-[#FFE600]' : 'bg-[#FFE600] text-black hover:bg-[#FFD900]'}`}
      >
        {picked ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        {picked ? '쇼핑리스트에 담음' : '살 거예요'}
      </button>
    );
  };

  const filtered = d.ranked.filter(r => category === '전체' || r.item.category === category);
  const stores = d.stores.filter(s => city === '전체' || s.city === city);
  const taxFreeLeft = Math.max(0, 5000 - d.myTotalYen);
  const couponLeft = d.myTotalYen < 10000 ? 10000 - d.myTotalYen : d.myTotalYen < 30000 ? 30000 - d.myTotalYen : 0;

  return (
    <div className="pb-24 bg-white">
      <PcContainer className="pt-6">
        <PcBreadcrumb items={[{ label: '홈', onClick: () => setActiveTab('home') }, { label: '돈키호테 쇼핑 가이드' }]} />
      </PcContainer>

      {/* 히어로 */}
      <PcContainer className="mt-5">
        <section className="relative overflow-hidden rounded-3xl bg-[#FFE600] px-14 py-12 grid grid-cols-[1fr_auto] items-center gap-10">
          <div className="relative z-10">
            <p className="text-[13px] font-black tracking-[0.2em] text-black/50">DON QUIJOTE SHOPPING GUIDE</p>
            <h1 className="mt-3 text-[44px] leading-[1.15] font-black text-black tracking-tight">돈키호테에서<br />이건 꼭 사야 해요</h1>
            <p className="mt-4 text-[16px] text-black/70 font-medium">필수템 순위부터 쇼핑 일본어, 추천 매장, 면세·쿠폰 꿀팁까지 한 번에.</p>
            <div className="mt-7 flex gap-3">
              <button onClick={() => setTab('필수템 순위')} className="h-12 px-6 rounded-xl bg-black text-[#FFE600] text-[15px] font-bold cursor-pointer">필수템 보기</button>
              <button onClick={() => openExternal(DONKI_TIPS[0].link!.url)} className="h-12 px-6 rounded-xl bg-white/70 text-black text-[15px] font-bold cursor-pointer flex items-center gap-1.5 hover:bg-white">
                관광객 쿠폰 <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-3 gap-3">
            {[
              { n: d.ranked.length, l: '필수템' },
              { n: d.stores.length, l: '추천 매장' },
              { n: PHRASE_GROUPS.reduce((s, g) => s + g.phrases.length, 0), l: '쇼핑 일본어' },
            ].map(s => (
              <div key={s.l} className="w-[130px] rounded-2xl bg-black px-5 py-5">
                <p className="text-[34px] font-black text-[#FFE600] leading-none">{s.n}</p>
                <p className="text-[13px] text-white/70 mt-2">{s.l}</p>
              </div>
            ))}
          </div>
          <ShoppingBag className="absolute -right-10 -bottom-16 w-[320px] h-[320px] text-black/[0.05] -rotate-12" />
        </section>
      </PcContainer>

      <PcContainer className="mt-10">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <PcTextTabs
            items={TABS.map(t => (t === '내 쇼핑리스트' && d.myPicks.size ? `${t} ${d.myPicks.size}` : t))}
            value={tab === '내 쇼핑리스트' && d.myPicks.size ? `${tab} ${d.myPicks.size}` : tab}
            onChange={(v) => setTab((TABS.find(t => v.startsWith(t)) || '필수템 순위') as Tab)}
          />
          <p className="text-[12px] text-gray-400">신상픽이 만든 여행 가이드 · 돈키호테 공식 서비스 아님</p>
        </div>

        {d.status === 'loading' && (tab === '필수템 순위' || tab === '내 쇼핑리스트' || tab === '매장 찾기') && <PcEmpty message="불러오는 중이에요…" />}
        {d.status === 'error' && (tab === '필수템 순위' || tab === '내 쇼핑리스트' || tab === '매장 찾기') && (
          <div className="py-24 text-center text-[15px] text-gray-400">
            정보를 불러오지 못했어요.
            <button onClick={d.load} className="mt-4 mx-auto flex items-center gap-1.5 h-10 px-4 rounded-lg bg-black text-white text-[14px] cursor-pointer">
              <RefreshCw className="w-4 h-4" /> 다시 시도
            </button>
          </div>
        )}

        {/* 필수템 순위 */}
        {d.status === 'ready' && tab === '필수템 순위' && (
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <PcTextTabs items={CATEGORY_FILTERS as unknown as string[]} value={category} onChange={(v) => setCategory(v as typeof category)} />
              <p className="text-[13px] text-gray-500">회원이 '살 거예요'로 담은 수 순위 · 세전 참고가</p>
            </div>

            {category === '전체' && filtered.length >= 3 && (
              <div className="mt-8 grid grid-cols-3 gap-6">
                {filtered.slice(0, 3).map(({ item, rank }) => (
                  <div key={item.id} onClick={() => setDetailId(item.id)} className="rounded-3xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative aspect-[4/3] bg-white">
                      {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="absolute inset-0 w-full h-full object-contain p-6" />}
                      <span className="absolute top-4 left-4 h-11 min-w-11 px-3 rounded-full bg-black text-[#FFE600] text-[20px] font-black flex items-center justify-center gap-1">
                        {rank === 1 && <Crown className="w-5 h-5" />}{rank}
                      </span>
                    </div>
                    <div className="px-6 pb-6 pt-2">
                      <p className="text-[13px] text-gray-400">{item.brand} · {item.category}</p>
                      <p className="mt-1 text-[20px] font-black text-gray-900">{item.name}</p>
                      <p className="text-[13px] text-gray-400">{item.nameJa}</p>
                      <p className="mt-3 text-[14px] text-gray-600 leading-relaxed line-clamp-2 min-h-[44px]">{item.description}</p>
                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          {item.priceYen ? <p className="text-[20px] font-black text-gray-900">약 ¥{item.priceYen.toLocaleString()}</p> : null}
                          <p className="text-[13px]">{krwBadge(item) || <span className="text-gray-400">{item.pickCount > 0 ? `${item.pickCount}명이 담았어요` : item.nameJa}</span>}</p>
                          {rating(item) && <p className="text-[12px] mt-0.5">{rating(item)}</p>}
                        </div>
                        {pickButton(item)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-10 grid grid-cols-5 gap-x-5 gap-y-10">
              {(category === '전체' ? filtered.slice(3) : filtered).map(({ item, rank }) => (
                <div key={item.id} onClick={() => setDetailId(item.id)} className="group min-w-0 cursor-pointer">
                  <div className="relative aspect-square rounded-xl border border-gray-100 bg-white overflow-hidden">
                    {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" loading="lazy" />}
                    <span className="absolute top-2.5 left-2.5 h-8 min-w-8 px-2 rounded-full bg-black text-[#FFE600] text-[14px] font-black flex items-center justify-center">{rank}</span>
                  </div>
                  <p className="mt-3 text-[12px] text-gray-400 truncate">{item.brand}</p>
                  <p className="text-[15px] font-bold text-gray-900 truncate">{item.name}</p>
                  <p className="text-[12px] text-gray-400 truncate">{item.nameJa}</p>
                  <p className="mt-1.5 text-[13px] text-gray-600 leading-snug line-clamp-2 min-h-[36px]">{item.description}</p>
                  <div className="mt-2 flex items-center gap-2 text-[13px]">
                    {item.priceYen ? <span className="font-black text-gray-900">약 ¥{item.priceYen.toLocaleString()}</span> : null}
                    {rating(item)}
                  </div>
                  <p className="mt-0.5 text-[12px] truncate">{krwBadge(item)}</p>
                  <div className="mt-3">{pickButton(item, 'lg')}</div>
                </div>
              ))}
            </div>
            {filtered.length === 0 && <PcEmpty message="표시할 상품이 없어요." />}
          </div>
        )}

        {/* 내 쇼핑리스트 */}
        {d.status === 'ready' && tab === '내 쇼핑리스트' && (
          d.myList.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-[18px] font-bold text-gray-900">아직 쇼핑리스트가 비어 있어요</p>
              <p className="mt-2 text-[14px] text-gray-500">필수템 순위에서 '살 거예요'를 누르면 여기에 모이고, 앱에서도 같은 리스트를 볼 수 있어요.</p>
              <button onClick={() => setTab('필수템 순위')} className="mt-6 h-11 px-6 rounded-xl bg-black text-[#FFE600] text-[14px] font-bold cursor-pointer">필수템 보러 가기</button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-[1fr_340px] gap-8 items-start">
              <div className="border-t-2 border-black">
                {d.myList.map(({ item }) => {
                  const done = d.bought.has(item.id);
                  return (
                    <div key={item.id} className={`flex items-center gap-5 py-4 border-b border-gray-100 ${done ? 'opacity-50' : ''}`}>
                      <button
                        onClick={() => d.toggleBought(item.id)}
                        className={`w-7 h-7 shrink-0 rounded-md border-2 flex items-center justify-center cursor-pointer ${done ? 'bg-black border-black' : 'border-gray-300 hover:border-gray-500'}`}
                        aria-label={done ? '안 샀어요로 바꾸기' : '샀어요'}
                      >
                        {done && <Check className="w-4 h-4 text-[#FFE600]" />}
                      </button>
                      <div className="w-20 h-20 shrink-0 rounded-xl border border-gray-100 bg-white overflow-hidden">
                        {item.imageUrl && <img src={item.imageUrl} alt="" className="w-full h-full object-contain p-1.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-gray-400">{item.brand} · {item.category}</p>
                        <p className={`text-[16px] font-bold text-gray-900 ${done ? 'line-through' : ''}`}>{item.name}</p>
                        <p className="text-[13px] text-gray-500">{item.nameJa}</p>
                      </div>
                      <p className="w-28 text-right text-[16px] font-black text-gray-900">{item.priceYen ? `약 ¥${item.priceYen.toLocaleString()}` : '-'}</p>
                      <button
                        onClick={() => setShowCard({ ja: item.nameJa || item.name, ko: item.name, image: item.imageUrl, ...WHERE_IS })}
                        className="h-9 px-3.5 rounded-lg bg-[#FFE600] text-black text-[13px] font-bold cursor-pointer hover:bg-[#FFD900]"
                      >
                        점원에게 보여주기
                      </button>
                      <button onClick={() => d.togglePick(item)} className="h-9 px-3 rounded-lg text-[13px] text-gray-400 hover:text-gray-800 cursor-pointer">빼기</button>
                    </div>
                  );
                })}
                <p className="mt-3 text-[12px] text-gray-400">'샀어요' 체크는 이 브라우저에만 저장돼요.</p>
              </div>

              <aside className="sticky top-6 rounded-2xl bg-black text-white p-6">
                <p className="text-[13px] text-white/60">쇼핑 진행</p>
                <p className="mt-1 text-[28px] font-black"><span className="text-[#FFE600]">{d.boughtCount}</span> / {d.myList.length}개</p>
                <div className="mt-3 h-2 rounded-full bg-white/15 overflow-hidden">
                  <div className="h-full bg-[#FFE600]" style={{ width: `${(d.boughtCount / d.myList.length) * 100}%` }} />
                </div>
                <div className="mt-6 flex justify-between text-[14px]"><span className="text-white/60">참고가 합계 (세전)</span><b>약 ¥{d.myTotalYen.toLocaleString()}</b></div>
                <div className="mt-3 flex justify-between text-[14px]">
                  <span className="text-white/60">면세 기준 5,000엔</span>
                  <b className="text-[#FFE600]">{taxFreeLeft === 0 ? '넘었어요 ✓' : `¥${taxFreeLeft.toLocaleString()} 남음`}</b>
                </div>
                <div className="mt-3 flex justify-between text-[14px]">
                  <span className="text-white/60">관광객 쿠폰</span>
                  <b className="text-[#FFE600]">{couponLeft === 0 ? '최대 7% 구간 ✓' : d.myTotalYen >= 10000 ? `7%까지 ¥${couponLeft.toLocaleString()}` : `5%까지 ¥${couponLeft.toLocaleString()}`}</b>
                </div>
                <button onClick={() => openExternal(DONKI_TIPS[0].link!.url)} className="mt-6 w-full h-11 rounded-xl bg-[#FFE600] text-black text-[14px] font-bold cursor-pointer flex items-center justify-center gap-1.5">
                  쿠폰 바코드 열기 <ExternalLink className="w-4 h-4" />
                </button>
                <p className="mt-3 text-[11px] text-white/50 leading-relaxed">참고가 기준 예상이에요. 실제 할인·면세는 매장 계산 금액으로 정해져요.</p>
              </aside>
            </div>
          )
        )}

        {/* 돈키 수다방 */}
        {tab === '돈키 수다방' && <DonkiTalk variant="pc" />}

        {/* 쇼핑 일본어 */}
        {tab === '쇼핑 일본어' && (
          <div className="mt-8 space-y-12">
            {PHRASE_GROUPS.map(g => (
              <section key={g.title}>
                <h2 className="text-[22px] font-black text-gray-900">{g.emoji} {g.title}</h2>
                <div className="mt-5 grid grid-cols-3 gap-4">
                  {g.phrases.map(p => (
                    <div key={p.ja} className="rounded-2xl border border-gray-200 p-5 flex flex-col">
                      <p className="text-[20px] font-bold text-gray-900 leading-snug">{p.ja}</p>
                      <p className="mt-1.5 text-[14px] text-amber-700 font-semibold">{p.sound}</p>
                      <p className="text-[14px] text-gray-500">{p.ko}</p>
                      <div className="mt-4 flex gap-2">
                        <button onClick={() => speak(p.ja)} className="h-9 px-3.5 rounded-lg bg-black text-[#FFE600] text-[13px] font-bold flex items-center gap-1.5 cursor-pointer"><Volume2 className="w-4 h-4" /> 듣기</button>
                        <button onClick={() => setShowCard({ ja: p.ja, ko: p.ko })} className="h-9 px-3.5 rounded-lg bg-gray-100 text-gray-800 text-[13px] font-bold flex items-center gap-1.5 cursor-pointer hover:bg-gray-200"><Maximize2 className="w-4 h-4" /> 크게 보기</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
            <section>
              <h2 className="text-[22px] font-black text-gray-900">🏷️ 가격표·표지판 읽기</h2>
              <p className="mt-1.5 text-[14px] text-gray-500">돈키호테 매대와 가격표에서 자주 보는 말이에요. 누르면 읽어줘요.</p>
              <div className="mt-5 grid grid-cols-4 gap-4">
                {PRICE_TAG_WORDS.map(w => (
                  <button key={w.ja} onClick={() => speak(w.ja)} className="text-left rounded-2xl border border-gray-200 p-5 hover:border-gray-900 cursor-pointer transition-colors">
                    <p className="text-[22px] font-black text-gray-900">{w.ja}</p>
                    <p className="text-[12px] text-amber-700 font-semibold">{w.sound}</p>
                    <p className="mt-2 text-[14px] font-semibold text-gray-800">{w.ko}</p>
                    {w.tip && <p className="mt-0.5 text-[12px] text-gray-400 leading-snug">{w.tip}</p>}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* 매장 찾기 */}
        {d.status === 'ready' && tab === '매장 찾기' && (
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <PcTextTabs items={['전체', ...d.cities]} value={city} onChange={setCity} />
              <p className="text-[13px] text-gray-500">영업시간·면세 카운터는 매장마다 달라요. 지도에서 확인하세요.</p>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-5">
              {stores.map(s => (
                <div key={s.id} className="rounded-2xl border border-gray-200 p-6 flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="h-7 px-2.5 rounded-full bg-[#FFE600] text-black text-[12px] font-black flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{s.city}</span>
                    {s.area && <span className="text-[13px] text-gray-400">{s.area}</span>}
                  </div>
                  <p className="mt-3 text-[18px] font-black text-gray-900">{s.name}</p>
                  <p className="text-[13px] text-gray-500">{s.nameJa}</p>
                  {s.feature && <p className="mt-3 text-[14px] text-gray-600 leading-relaxed flex-1">{s.feature}</p>}
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button onClick={() => openExternal(googleMapsUrl(s.nameJa))} className="h-10 rounded-lg bg-black text-[#FFE600] text-[13px] font-bold flex items-center justify-center gap-1 cursor-pointer">
                      <ExternalLink className="w-4 h-4" /> 지도·영업시간
                    </button>
                    <button
                      onClick={() => setShowCard({ ja: s.nameJa, ko: s.name, sub: 'ここに行きたいです。', subKo: '여기 가고 싶어요' })}
                      className="h-10 rounded-lg bg-gray-100 text-gray-800 text-[13px] font-bold cursor-pointer hover:bg-gray-200"
                    >
                      택시에서 보여주기
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {stores.length === 0 && <PcEmpty message="등록된 매장이 없어요." />}
          </div>
        )}

        {/* 쇼핑 꿀팁 */}
        {tab === '쇼핑 꿀팁' && (
          <div className="mt-8 grid grid-cols-2 gap-5">
            {DONKI_TIPS.map(t => (
              <div key={t.title} className="rounded-2xl border border-gray-200 p-7">
                <p className="text-[32px] leading-none">{t.emoji}</p>
                <p className="mt-4 text-[19px] font-black text-gray-900">{t.title}</p>
                <p className="mt-2 text-[15px] text-gray-600 leading-relaxed">{t.body}</p>
                {t.link && (
                  <button onClick={() => openExternal(t.link!.url)} className="mt-5 h-10 px-4 rounded-lg bg-[#FFE600] text-black text-[14px] font-bold inline-flex items-center gap-1.5 cursor-pointer">
                    {t.link.label} <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <p className="col-span-2 text-[12px] text-gray-400">쿠폰·면세 조건은 바뀔 수 있어요. 2026년 10월 기준 공개 안내를 정리했어요.</p>
          </div>
        )}
      </PcContainer>

      {detailItem && (
        <DonkiItemDetail
          variant="pc"
          item={detailItem}
          rate={d.rate}
          picked={d.myPicks.has(detailItem.id)}
          busy={d.busyId === detailItem.id}
          onTogglePick={() => d.togglePick(detailItem)}
          onShow={() => setShowCard({ ja: detailItem.nameJa || detailItem.name, ko: detailItem.name, image: detailItem.imageUrl, ...WHERE_IS })}
          onClose={() => setDetailId(null)}
          onReviewsChanged={(count, avg) => d.updateItem(detailItem.id, { reviewCount: count, avgRating: avg })}
        />
      )}
      {showCard && <DonkiShowCard content={showCard} onClose={() => setShowCard(null)} />}
    </div>
  );
};
