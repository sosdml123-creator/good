import React, { useMemo } from 'react';
import { Bell, ChevronLeft, Heart, Search } from 'lucide-react';
import type { MarketCategory } from '../../pc/useMarketPrices';
import { useAgri } from './AgriContext';
import { Item, SEASONS, SHORT_CAT, currentMonth, fmtDate, itemTitle, pctChange } from './agriModel';
import { ItemRow, ReviewLine } from './AgriRows';
import { Band, C, Change, Empty, SectionHead, SourceFooter, Thumb } from './AgriUi';

const median = (xs: number[]) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

const CAT_ORDER: MarketCategory[] = ['채소류', '과일류', '수산물', '축산물', '식량작물'];

export const AgriHome: React.FC = () => {
  const { items, date, status, checkedAt, watches, itemById, alerts, recent, reviews, photo, openItem, openPrices, goTab, exit, setReviewItem } = useAgri();
  const month = currentMonth();

  const rated = useMemo(() => items.filter(i => i.rep.changeRate !== null), [items]);
  const summary = useMemo(() => {
    const down = rated.filter(i => i.rep.changeRate! <= -0.05).length;
    const up = rated.filter(i => i.rep.changeRate! >= 0.05).length;
    const cats = CAT_ORDER.map(c => ({ c, m: median(rated.filter(i => i.rep.category === c).map(i => i.rep.changeRate!)) }));
    return { down, up, flat: rated.length - down - up, cats };
  }, [rated]);

  const fallers = useMemo(() => [...rated].sort((a, b) => a.rep.changeRate! - b.rep.changeRate!).filter(i => i.rep.changeRate! <= -0.5).slice(0, 5), [rated]);
  const risers = useMemo(() => [...rated].sort((a, b) => b.rep.changeRate! - a.rep.changeRate!).filter(i => i.rep.changeRate! >= 0.5).slice(0, 5), [rated]);

  const seasonal = useMemo(() => {
    const names = SEASONS[month] || [];
    return names.map(n => items.find(i => i.rep.itemName === n)).filter((x): x is Item => Boolean(x));
  }, [items, month]);

  const watched = watches.map(w => ({ w, item: itemById.get(w.key) })).filter(x => x.item).slice(0, 10) as { w: typeof watches[number]; item: Item }[];
  const recentItems = recent.map(k => itemById.get(k)).filter((x): x is Item => Boolean(x)).slice(0, 5);

  const reviewed = reviews.length;
  const latestReviews = useMemo(() => [...reviews].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3), [reviews]);

  const checked = checkedAt ? new Date(checkedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }) : null;

  return (
    <div className="bg-white min-h-full pb-24">
      <header className="sticky top-0 z-20 bg-white">
        <div className="flex items-center h-12 pl-1.5 pr-2">
          <button onClick={exit} aria-label="신상픽 홈으로" className="w-10 h-10 flex items-center justify-center text-[#191C20]">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-[18px] font-bold text-[#191C20] tracking-[-0.02em]">장보기 시세</h1>
          <button onClick={() => goTab('saved')} aria-label={`가격 알림 ${alerts.length}건`} className="relative w-10 h-10 flex items-center justify-center text-[#191C20]">
            <Bell className="w-[22px] h-[22px]" strokeWidth={1.8} />
            {alerts.length > 0 && <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[#D23F35] text-white text-[10px] font-bold leading-4 text-center">{alerts.length}</span>}
          </button>
          <button onClick={() => goTab('saved')} aria-label={`관심 품목 ${watches.length}개`} className="w-10 h-10 flex items-center justify-center text-[#191C20]">
            <Heart className="w-[22px] h-[22px]" strokeWidth={1.8} />
          </button>
        </div>
        <div className="px-4 pb-3">
          <button onClick={() => openPrices({ focus: true })} className="w-full h-10 px-3 flex items-center gap-2 rounded-[8px] bg-[#F3F4F6] text-left">
            <Search className="w-[18px] h-[18px] text-[#8A929A]" />
            <span className="text-[14px] text-[#8A929A]">품목 검색 (배추, 고등어, 사과…)</span>
          </button>
        </div>
      </header>

      {watched.length > 0 && (
        <section aria-label="관심 품목" className="pb-3">
          <div className="flex gap-2 overflow-x-auto px-4 no-scrollbar">
            {watched.map(({ w, item }) => {
              const since = pctChange(item.rep.today, w.savedPrice);
              return (
                <button key={w.key} onClick={() => openItem(item.id)} className="shrink-0 min-w-[112px] px-3 py-2 rounded-[8px] border border-[#ECEEF0] text-left">
                  <span className="block text-[12.5px] text-[#5A626B] truncate max-w-[120px]">{itemTitle(item.rep)} <span className="text-[#8A929A]">{item.rep.unit}</span></span>
                  <span className="block text-[14.5px] font-bold text-[#191C20] tabular-nums">{item.rep.today?.toLocaleString('ko-KR')}원</span>
                  <span className="block text-[11.5px]">{since !== null && Math.abs(since) >= 0.05 ? <Change rate={since} label="담은 후" /> : <Change rate={item.rep.changeRate} />}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <Band />

      {/* 오늘의 시세 요약 */}
      <section className="px-4 pt-5 pb-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[17px] font-bold text-[#191C20]">오늘의 시세</h2>
          <span className="text-[12px] text-[#8A929A]">{date ? `${fmtDate(date)} 공시` : '공시일 확인 중'}{checked ? ` · ${checked} 확인` : ''}</span>
        </div>
        {status === 'loading' && items.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-[#8A929A]">시세를 불러오는 중이에요</p>
        ) : status === 'error' && items.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-[#8A929A]">시세를 불러오지 못했어요. 잠시 후 다시 열어 주세요.</p>
        ) : (
          <>
            <div className="mt-3 grid grid-cols-3 divide-x divide-[#ECEEF0] border-y border-[#ECEEF0]">
              {[
                { label: '내린 품목', v: summary.down, color: C.down, sort: 'down' as const },
                { label: '오른 품목', v: summary.up, color: C.up, sort: 'up' as const },
                { label: '변동 없음', v: summary.flat, color: C.ink, sort: undefined },
              ].map(s => (
                <button key={s.label} onClick={() => openPrices({ sort: s.sort })} className="py-3 text-center">
                  <span className="block text-[12px] text-[#5A626B]">{s.label}</span>
                  <span className="block mt-0.5 text-[20px] font-bold tabular-nums" style={{ color: s.color }}>{s.v}</span>
                </button>
              ))}
            </div>
            <table className="mt-3 w-full text-[13px]">
              <caption className="sr-only">분류별 등락률 중앙값</caption>
              <tbody>
                <tr>
                  {summary.cats.map(({ c }) => <th key={c} scope="col" className="pb-1 font-normal text-[12px] text-[#8A929A]">{SHORT_CAT[c]}</th>)}
                </tr>
                <tr>
                  {summary.cats.map(({ c, m }) => <td key={c} className="text-center"><Change rate={m} /></td>)}
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-[11.5px] text-[#8A929A]">분류별 값은 품목 등락률의 중앙값이에요. 전일 공시가 없으면 1주 전과 비교해요.</p>
          </>
        )}
      </section>

      <Band />
      <SectionHead title="가격이 많이 내린 품목" note="전일 대비" onMore={() => openPrices({ sort: 'down' })} />
      {fallers.length ? fallers.map((i, n) => <ItemRow key={i.id} item={i} rank={n + 1} />) : <p className="px-4 pb-4 text-[13px] text-[#8A929A]">오늘은 크게 내린 품목이 없어요.</p>}

      <Band />
      <SectionHead title="최근 가격이 오른 품목" note="전일 대비" onMore={() => openPrices({ sort: 'up' })} />
      {risers.length ? risers.map((i, n) => <ItemRow key={i.id} item={i} rank={n + 1} />) : <p className="px-4 pb-4 text-[13px] text-[#8A929A]">오늘은 크게 오른 품목이 없어요.</p>}

      {seasonal.length > 0 && (
        <>
          <Band />
          <SectionHead title={`${month}월 제철`} note="일반적인 제철 기준이에요. 산지·재배 방식에 따라 달라요." />
          <div className="flex gap-3 overflow-x-auto px-4 pb-5 no-scrollbar">
            {seasonal.map(i => (
              <button key={i.id} onClick={() => openItem(i.id)} className="shrink-0 w-[92px] text-left">
                <Thumb src={photo(i.rep)} name={i.rep.itemName} size={92} rounded={6} />
                <span className="block mt-1.5 text-[13.5px] font-semibold text-[#191C20] truncate">{i.rep.itemName}</span>
                <span className="block text-[13px] font-bold text-[#191C20] tabular-nums">{i.rep.today?.toLocaleString('ko-KR')}원</span>
                <span className="block text-[11px] text-[#8A929A] truncate">{i.rep.unit} · <Change rate={i.rep.changeRate} /></span>
              </button>
            ))}
          </div>
        </>
      )}

      {recentItems.length > 0 && (
        <>
          <Band />
          <SectionHead title="최근 확인한 품목" note="이 기기에서 본 순서예요" />
          {recentItems.map(i => <ItemRow key={i.id} item={i} />)}
        </>
      )}

      <Band />
      <SectionHead
        title="최근 등록된 실구매 후기"
        note={reviewed ? `농수산물 후기 ${reviewed}개` : undefined}
        onMore={reviewed ? () => { setReviewItem(null); goTab('reviews'); } : undefined}
      />
      {latestReviews.length ? latestReviews.map(r => <ReviewLine key={r.id} review={r} />) : (
        <Empty title="아직 등록된 후기가 없어요" desc="품목 상세에서 직접 산 농수산물의 가격과 상태를 남겨 주세요. 다른 분들의 장보기에 큰 도움이 돼요." />
      )}

      <Band />
      <SourceFooter date={date ? fmtDate(date) : undefined} />
    </div>
  );
};
