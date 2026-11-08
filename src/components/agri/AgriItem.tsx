import React, { useEffect, useMemo, useState } from 'react';
import { Bell, Heart, PenLine } from 'lucide-react';
import { PeriodDetail, fetchPeriodDetail } from '../../pc/useMarketPrices';
import { useAgri } from './AgriContext';
import {
  Item, NORMAL_NOTE, SHORT_CAT, currentMonth, fmtDate, gradeLabel, itemSpec, itemTitle, judgePrice, marketLabel,
  isChainStore, originOf, pctChange, productForRow, reviewMetrics, reviewsForItem, seafoodState, seasonMonths,
  summarizeRegions, tipsFor, won,
} from './agriModel';
import { ReviewLine } from './AgriRows';
import { Band, C, Change, Diff, Empty, PriceChart, SectionHead, Segmented, SourceFooter, Stars, TopBar } from './AgriUi';

type Period = 7 | 30 | 90;
const PERIODS: { id: Period; label: string }[] = [{ id: 7, label: '7일' }, { id: 30, label: '30일' }, { id: 90, label: '3개월' }];

/** 가격 알림 설정 시트 */
export const AlertSheet: React.FC<{ item: Item; onClose: () => void }> = ({ item, onClose }) => {
  const { watches, updateWatch, notify } = useAgri();
  const w = watches.find(x => x.key === item.id);
  const [mode, setMode] = useState<'saved' | 'target'>(w?.alertBelow ? 'target' : 'saved');
  const [target, setTarget] = useState(String(w?.alertBelow || Math.round((item.rep.today || 0) * 0.9 / 10) * 10 || ''));
  const [on, setOn] = useState(w ? w.alertOn : true);
  const save = () => {
    const t = Number(target.replace(/[^\d]/g, ''));
    if (on && mode === 'target' && !t) return;
    updateWatch(item, { alertOn: on, alertBelow: mode === 'target' ? t : null });
    notify(on ? '가격 알림을 설정했어요' : '가격 알림을 껐어요');
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex justify-center" role="dialog" aria-modal="true" aria-label="가격 알림 설정">
      <button className="absolute inset-0 bg-black/40" aria-label="닫기" onClick={onClose} />
      <div className="absolute bottom-0 w-full max-w-[430px] bg-white rounded-t-[12px] px-5 pt-5 pb-[max(env(safe-area-inset-bottom),16px)]">
        <h2 className="text-[17px] font-bold text-[#191C20]">가격 알림</h2>
        <p className="mt-1 text-[13px] text-[#5A626B]">{itemTitle(item.rep)} · {itemSpec(item.rep) || item.rep.rank} · {item.rep.unit} · 지금 {won(item.rep.today)}</p>
        <label className="mt-4 flex items-center justify-between py-2">
          <span className="text-[15px] text-[#191C20]">알림 받기</span>
          <input type="checkbox" checked={on} onChange={e => setOn(e.target.checked)} className="w-5 h-5 accent-[#1F6B62]" />
        </label>
        <fieldset disabled={!on} className="mt-1 space-y-1 disabled:opacity-40">
          <label className="flex items-start gap-3 py-2.5">
            <input type="radio" name="alert" checked={mode === 'saved'} onChange={() => setMode('saved')} className="mt-1 accent-[#1F6B62]" />
            <span>
              <span className="block text-[15px] text-[#191C20]">담았을 때보다 내려가면</span>
              <span className="block text-[12.5px] text-[#8A929A]">기준 {won(w?.savedPrice ?? item.rep.today)}</span>
            </span>
          </label>
          <label className="flex items-start gap-3 py-2.5">
            <input type="radio" name="alert" checked={mode === 'target'} onChange={() => setMode('target')} className="mt-1 accent-[#1F6B62]" />
            <span className="flex-1">
              <span className="block text-[15px] text-[#191C20]">목표 가격 이하로 내려가면</span>
              <span className="mt-2 flex items-center gap-2">
                <input
                  inputMode="numeric"
                  value={target}
                  onFocus={() => setMode('target')}
                  onChange={e => setTarget(e.target.value.replace(/[^\d]/g, ''))}
                  aria-label="목표 가격"
                  className="w-32 h-10 px-3 rounded-[6px] border border-[#DADDE1] text-[15px] tabular-nums outline-none focus:border-[#1F6B62]"
                />
                <span className="text-[14px] text-[#5A626B]">원 / {item.rep.unit}</span>
              </span>
            </span>
          </label>
        </fieldset>
        <p className="mt-2 text-[12px] leading-relaxed text-[#8A929A]">새 공시가가 나오면 앱을 열 때 확인해서 관심 탭과 홈의 알림에 표시해요. 휴대폰 푸시 알림은 아직 지원하지 않아요.</p>
        <button onClick={save} className="mt-4 w-full h-12 rounded-[8px] bg-[#1F6B62] text-white text-[15px] font-semibold">저장</button>
      </div>
    </div>
  );
};

export const AgriItem: React.FC<{ id: string }> = ({ id }) => {
  const { itemById, items, date, photo, back, isWatched, toggleWatch, openItem, reviews, products, writeReview, setReviewItem, goTab } = useAgri();
  const item = itemById.get(id);
  const [period, setPeriod] = useState<Period>(30);
  const [detail, setDetail] = useState<PeriodDetail | null>(null);
  const [showAllRegions, setShowAllRegions] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  // 3개월치를 한 번 받아 7일·30일은 잘라서 씁니다 (평년 가격, 지역·시장별 가격도 함께 옵니다).
  useEffect(() => {
    if (!item) return;
    let alive = true;
    setDetail(null);
    fetchPeriodDetail(item.rep, 90).then(d => { if (alive) setDetail(d); });
    return () => { alive = false; };
  }, [item?.rep.key]);

  const r = item?.rep;
  const siblings = useMemo(
    () => (r ? items.filter(i => i.rep.itemCode === r.itemCode && i.rep.category === r.category && i.id !== item!.id) : []),
    [items, r, item],
  );
  const itemReviews = useMemo(() => (r ? reviewsForItem(r.itemName, reviews, products) : []), [r, reviews, products]);
  const writable = r ? productForRow(r, products) : undefined;

  if (!item || !r) {
    return (
      <div className="bg-white min-h-full">
        <TopBar title="시세" onBack={back} />
        <Empty title="이 품목의 시세를 찾을 수 없어요" desc="오늘 공시에서 빠졌을 수 있어요. 시세 목록에서 다시 찾아 주세요." />
      </div>
    );
  }

  const img = photo(r);
  const watched = isWatched(item.id);
  const verdict = judgePrice(r);
  const cut = (days: number) => {
    if (!detail) return [];
    const from = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
    return detail.points.filter(p => p.date >= from);
  };
  const points = cut(period);
  const range90 = detail && detail.points.length > 1 ? {
    min: Math.min(...detail.points.map(p => p.price)),
    max: Math.max(...detail.points.map(p => p.price)),
    from: detail.points[0].date,
    to: detail.points[detail.points.length - 1].date,
  } : null;
  const avg = points.length ? Math.round(points.reduce((a, p) => a + p.price, 0) / points.length) : null;

  const regions = detail ? summarizeRegions(detail.markets).sort((a, b) => a.min - b.min) : [];
  const chainAvg = detail ? (() => { const xs = detail.markets.filter(m => isChainStore(m.market)).map(m => m.price); return xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null; })() : null;
  const tradAvg = detail ? (() => { const xs = detail.markets.filter(m => !isChainStore(m.market)).map(m => m.price); return xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null; })() : null;
  const cheapest = detail?.markets.length ? detail.markets.reduce((a, b) => (b.price < a.price ? b : a)) : null;

  const months = seasonMonths(r.itemName);
  const month = currentMonth();
  const state = seafoodState(r);
  const origin = originOf(r);
  const spec = itemSpec(r);

  const compareRows: { label: string; price: number | null }[] = [
    { label: '전일', price: r.dayAgo },
    { label: '1주 전', price: r.weekAgo },
    { label: '1개월 전', price: r.monthAgo },
    { label: '1년 전', price: r.yearAgo },
    { label: '평년', price: r.normal },
  ];

  // 항목별 평균 (후기마다 저장 형식이 달라 이름 기준으로 모읍니다)
  const metricAvgs = (() => {
    const sum = new Map<string, number[]>();
    itemReviews.forEach(rv => reviewMetrics(rv).forEach(([l, v]) => sum.set(l, [...(sum.get(l) || []), v])));
    return [...sum.entries()].map(([l, xs]) => [l, xs.reduce((a, b) => a + b, 0) / xs.length] as [string, number]);
  })();
  const ratingAvg = itemReviews.length ? itemReviews.reduce((a, b) => a + b.rating, 0) / itemReviews.length : null;

  return (
    <div className="bg-white min-h-full pb-28">
      <TopBar
        title={itemTitle(r)}
        onBack={back}
        border={false}
        right={
          <button onClick={() => toggleWatch(item)} aria-label={watched ? '관심 품목 해제' : '관심 품목 담기'} aria-pressed={watched} className="w-10 h-10 flex items-center justify-center">
            <Heart className="w-[22px] h-[22px]" strokeWidth={1.8} color={watched ? C.teal : C.ink} fill={watched ? C.teal : 'none'} />
          </button>
        }
      />

      {img && (
        <figure className="relative">
          <img src={img} alt={`${r.itemName} 사진`} className="w-full h-[220px] object-cover bg-[#F1F2F4]" />
          <figcaption className="absolute right-2 bottom-2 px-1.5 py-0.5 rounded-[3px] bg-black/45 text-[10.5px] text-white">AI 생성 품목 참고 이미지 · 실제 판매 상품과 다를 수 있어요</figcaption>
        </figure>
      )}

      {/* 현재 시세 */}
      <section className="px-4 pt-4 pb-5">
        <p className="text-[12.5px] text-[#5A626B]">{[SHORT_CAT[r.category], origin, state].filter(Boolean).join(' · ')}</p>
        <h2 className="mt-1 text-[22px] font-bold text-[#191C20] tracking-[-0.02em]">{itemTitle(r)}</h2>
        <p className="mt-0.5 text-[13.5px] text-[#5A626B]">{[spec, `${r.unit} 기준`].filter(Boolean).join(' · ')}</p>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-[30px] font-bold text-[#191C20] tabular-nums tracking-[-0.02em]">{r.today?.toLocaleString('ko-KR')}</span>
          <span className="text-[16px] text-[#191C20]">원</span>
          <span className="ml-1 text-[14px] text-[#5A626B]">/ {r.unit}</span>
        </div>
        <p className="mt-1 text-[14px] flex items-center gap-1.5">
          <span className="text-[#5A626B]">{r.changeLabel || '전일 대비'}</span>
          {/* 등락률의 비교 기준(전일·1주·2주 전) 가격에서 차액을 되짚어 냅니다 */}
          <Diff value={r.today && r.changeRate !== null ? Math.round(r.today - r.today / (1 + r.changeRate / 100)) : null} />
          <Change rate={r.changeRate} size="md" />
        </p>
        <p className="mt-2 text-[12px] text-[#8A929A]">{date ? `${fmtDate(date)} 공시` : ''} · KAMIS 전국 평균 소매가</p>
      </section>

      <Band />

      {/* 지금 가격 판단 */}
      <section className="px-4 pt-5 pb-5">
        <h3 className="text-[17px] font-bold text-[#191C20]">지금 사도 괜찮을까?</h3>
        {verdict ? (
          <p className="mt-2 text-[20px] font-bold tracking-[-0.02em]" style={{ color: verdict.tone === 'cheap' ? C.down : verdict.tone === 'pricey' ? C.up : C.ink }}>
            {verdict.text}
          </p>
        ) : (
          <p className="mt-2 text-[14px] text-[#5A626B]">비교할 과거 가격이 없어요.</p>
        )}
        {verdict && (
          <p className="mt-1 text-[12.5px] text-[#8A929A]">
            {date ? fmtDate(date) : '오늘'} {won(r.today)} vs {verdict.baseLabel} {won(verdict.basePrice)} 비교 · ±5% 이내는 비슷하다고 봐요
          </p>
        )}
        <table className="mt-4 w-full text-[14px]">
          <caption className="sr-only">과거 가격과 비교</caption>
          <thead>
            <tr className="text-[12px] text-[#8A929A]">
              <th className="text-left font-normal pb-1.5">기준</th>
              <th className="text-right font-normal pb-1.5">가격</th>
              <th className="text-right font-normal pb-1.5 w-[92px]">지금과 차이</th>
            </tr>
          </thead>
          <tbody>
            {compareRows.map(c => (
              <tr key={c.label} className="border-t border-[#F1F2F4]">
                <th scope="row" className="py-2.5 text-left font-normal text-[#5A626B]">{c.label}</th>
                <td className="py-2.5 text-right tabular-nums text-[#191C20]">{won(c.price)}</td>
                <td className="py-2.5 text-right"><Change rate={pctChange(r.today, c.price)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {range90 && r.today && (
          <div className="mt-4">
            <div className="flex justify-between text-[12px] text-[#5A626B]">
              <span>최근 3개월 최저 <b className="font-semibold tabular-nums text-[#191C20]">{won(range90.min)}</b></span>
              <span>최고 <b className="font-semibold tabular-nums text-[#191C20]">{won(range90.max)}</b></span>
            </div>
            <div className="relative mt-2 h-1.5 rounded-full bg-[#ECEEF0]">
              <span
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2"
                style={{ borderColor: C.teal, left: `${range90.max === range90.min ? 50 : Math.min(100, Math.max(0, ((r.today - range90.min) / (range90.max - range90.min)) * 100))}%` }}
                aria-label="현재 가격 위치"
              />
            </div>
            <p className="mt-1.5 text-[11.5px] text-[#8A929A]">{range90.from.replace(/-/g, '.')} ~ {range90.to.replace(/-/g, '.')} 전국 평균 공시가 기준</p>
          </div>
        )}
        <p className="mt-3 text-[11.5px] leading-relaxed text-[#8A929A]">{NORMAL_NOTE}</p>
      </section>

      <Band />

      {/* 가격 추이 */}
      <section className="px-4 pt-5 pb-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[17px] font-bold text-[#191C20]">가격 추이</h3>
          <Segmented value={period} options={PERIODS} onChange={setPeriod} />
        </div>
        <div className="mt-3">
          {detail === null ? (
            <p className="h-[180px] flex items-center justify-center text-[13px] text-[#8A929A]">그래프를 불러오는 중이에요</p>
          ) : points.length < 2 ? (
            <p className="h-[120px] flex items-center justify-center text-[13px] text-[#8A929A]">이 기간에는 공시 데이터가 부족해요</p>
          ) : (
            <>
              <PriceChart points={points} normal={detail.normal} />
              <dl className="mt-3 grid grid-cols-3 border-t border-[#F1F2F4] pt-3 text-center">
                {[['기간 최저', Math.min(...points.map(p => p.price))], ['기간 평균', avg], ['기간 최고', Math.max(...points.map(p => p.price))]].map(([l, v]) => (
                  <div key={String(l)}>
                    <dt className="text-[11.5px] text-[#8A929A]">{l}</dt>
                    <dd className="mt-0.5 text-[14px] font-semibold tabular-nums text-[#191C20]">{won(v as number)}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-[11.5px] text-[#8A929A]">공시일 {points.length}일 · 주말·공휴일은 공시가 없어요</p>
            </>
          )}
        </div>
      </section>

      {(item.grades.length > 1 || siblings.length > 0) && (
        <>
          <Band />
          <SectionHead title="등급·종류별 가격" note="같은 품목도 품종·등급·상태에 따라 가격이 달라요" />
          <ul className="px-4 pb-4">
            {item.grades.length > 1 && item.grades.map(g => (
              <li key={g.key} className="flex items-center py-2.5 border-b border-[#F1F2F4] text-[14px]">
                <span className="flex-1 text-[#191C20]">{gradeLabel(g.rank) || '기본'}{['대', '중', '소'].includes(gradeLabel(g.rank)) ? ' (크기)' : ''}{g.key === r.key && <span className="ml-1.5 text-[11.5px] text-[#1F6B62]">보는 중</span>}</span>
                <span className="w-[92px] text-right tabular-nums font-semibold text-[#191C20]">{won(g.today)}</span>
                <span className="w-[64px] text-right"><Change rate={g.changeRate} /></span>
              </li>
            ))}
            {siblings.map(s => (
              <li key={s.id} className="border-b border-[#F1F2F4] last:border-b-0">
                <button onClick={() => openItem(s.id)} className="w-full flex items-center py-2.5 text-[14px] text-left">
                  <span className="flex-1 min-w-0 truncate text-[#191C20]">{itemSpec(s.rep) || s.rep.kindName}<span className="ml-1 text-[12px] text-[#8A929A]">{s.rep.unit}</span></span>
                  <span className="w-[92px] text-right tabular-nums font-semibold text-[#191C20]">{won(s.rep.today)}</span>
                  <span className="w-[64px] text-right"><Change rate={s.rep.changeRate} /></span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <Band />

      {/* 지역·시장별 */}
      <section className="pt-5 pb-4">
        <div className="px-4">
          <h3 className="text-[17px] font-bold text-[#191C20]">지역·시장별 가격</h3>
          <p className="mt-0.5 text-[12px] text-[#8A929A]">{detail?.marketDate ? `${fmtDate(detail.marketDate)} KAMIS 조사 가격` : 'KAMIS 조사 가격'} · {r.unit} 기준</p>
        </div>
        {detail === null ? (
          <p className="py-8 text-center text-[13px] text-[#8A929A]">불러오는 중이에요</p>
        ) : regions.length === 0 ? (
          <p className="px-4 py-6 text-[13px] text-[#8A929A]">이 품목은 지역별 조사 가격이 없어요.</p>
        ) : (
          <>
            <div className="mx-4 mt-3 grid grid-cols-2 border border-[#ECEEF0] rounded-[8px] divide-x divide-[#ECEEF0]">
              <div className="px-3 py-2.5">
                <p className="text-[12px] text-[#5A626B]">전통시장 평균</p>
                <p className="mt-0.5 text-[16px] font-bold tabular-nums text-[#191C20]">{won(tradAvg)}</p>
              </div>
              <div className="px-3 py-2.5">
                <p className="text-[12px] text-[#5A626B]">대형유통 평균</p>
                <p className="mt-0.5 text-[16px] font-bold tabular-nums text-[#191C20]">{won(chainAvg)}</p>
              </div>
            </div>
            {cheapest && (
              <p className="px-4 mt-2.5 text-[13px] text-[#5A626B]">
                가장 낮은 곳 <b className="font-semibold text-[#191C20]">{cheapest.region} {marketLabel(cheapest.market)}</b> {won(cheapest.price)}
              </p>
            )}
            <table className="mt-3 w-full text-[13.5px]">
              <caption className="sr-only">지역별 평균 가격</caption>
              <thead>
                <tr className="text-[12px] text-[#8A929A] bg-[#FAFAFB] border-y border-[#ECEEF0]">
                  <th className="pl-4 py-2 text-left font-normal">지역</th>
                  <th className="py-2 text-right font-normal">전통시장</th>
                  <th className="py-2 text-right font-normal">대형유통</th>
                  <th className="pr-4 py-2 text-right font-normal">전국 평균과</th>
                </tr>
              </thead>
              <tbody>
                {(showAllRegions ? regions : regions.slice(0, 6)).map(g => {
                  const best = Math.min(...[g.traditional, g.chain].filter((x): x is number => x !== null));
                  return (
                    <tr key={g.region} className="border-b border-[#F1F2F4]">
                      <th scope="row" className="pl-4 py-2.5 text-left font-normal text-[#191C20]">{g.region}<span className="ml-1 text-[11px] text-[#8A929A]">{g.count}곳</span></th>
                      <td className="py-2.5 text-right tabular-nums text-[#191C20]">{won(g.traditional)}</td>
                      <td className="py-2.5 text-right tabular-nums text-[#191C20]">{won(g.chain)}</td>
                      <td className="pr-4 py-2.5 text-right"><Change rate={pctChange(best, r.today)} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {regions.length > 6 && (
              <button onClick={() => setShowAllRegions(v => !v)} className="w-full h-11 text-[13.5px] text-[#5A626B] border-b border-[#F1F2F4]">
                {showAllRegions ? '접기' : `${regions.length}개 지역 모두 보기`}
              </button>
            )}
            <p className="px-4 mt-2.5 text-[11.5px] leading-relaxed text-[#8A929A]">대형유통은 KAMIS가 업체명을 가린 조사처예요. ‘전국 평균과’는 그 지역의 더 낮은 가격 기준이에요.</p>
          </>
        )}
      </section>

      <Band />

      {/* 제철 · 구매 팁 */}
      <section className="px-4 pt-5 pb-5">
        <h3 className="text-[17px] font-bold text-[#191C20]">제철 정보</h3>
        {months.length > 0 ? (
          <>
            <p className="mt-1 text-[13.5px] text-[#5A626B]">{months.includes(month) ? `지금(${month}월)이 제철이에요.` : `${months.join('·')}월이 제철이에요.`}</p>
            <div className="mt-3 grid grid-cols-12 gap-[3px]" aria-label="월별 제철 표시">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <div key={m} className="text-center">
                  <div className="h-2 rounded-[2px]" style={{ background: months.includes(m) ? C.teal : C.line, outline: m === month ? `1.5px solid ${C.ink}` : undefined, outlineOffset: 1 }} />
                  <span className={`block mt-1 text-[10px] tabular-nums ${m === month ? 'text-[#191C20] font-semibold' : 'text-[#8A929A]'}`}>{m}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-1 text-[13.5px] text-[#5A626B]">계절과 상관없이 꾸준히 유통되는 품목이에요.</p>
        )}
        <h3 className="mt-6 text-[15px] font-bold text-[#191C20]">고르는 법·확인할 점</h3>
        <ul className="mt-2 space-y-1.5">
          {tipsFor(r).map(t => (
            <li key={t} className="flex gap-2 text-[13.5px] leading-[1.55] text-[#3B4249]"><span className="mt-[9px] w-1 h-1 rounded-full bg-[#8A929A] shrink-0" />{t}</li>
          ))}
        </ul>
        {(r.itemName.includes('수박') || r.itemName.includes('등심') || r.itemName.includes('한우')) && (
          <figure className="mt-3 overflow-hidden rounded-[8px] border border-[#ECEEF0]">
            <img
              src={r.itemName.includes('수박')
                ? '/produce-img/generated-watermelon.jpg'
                : '/produce-img/generated-ribeye.jpg'}
              alt={r.itemName.includes('수박') ? '수박 껍질과 꼭지를 살펴보는 참고 사진' : '소고기 등심 마블링 참고 사진'}
              loading="lazy" className="w-full h-[150px] object-cover"
            />
            <figcaption className="px-3 py-2 text-[11.5px] text-[#737B84]">
              {r.itemName.includes('수박') ? '수박 외관 참고 · 꼭지·무늬·무게를 함께 확인하세요.' : '소고기 단면 참고 · 등심은 새우살과 근내지방 분포를 살펴보세요.'} 사진은 설명을 위한 참고 이미지예요.
            </figcaption>
          </figure>
        )}
        <p className="mt-2 text-[11.5px] text-[#8A929A]">일반적인 참고 정보예요.</p>
      </section>

      <Band />

      {/* 실구매 후기 */}
      <section className="pb-2">
        <SectionHead
          title="실구매 후기"
          note={itemReviews.length ? `${itemReviews.length}개 · 평균 ${ratingAvg!.toFixed(1)}점` : undefined}
          onMore={itemReviews.length > 3 ? () => { setReviewItem(r.itemName); goTab('reviews'); } : undefined}
          more="전체 보기"
        />
        {itemReviews.length > 0 && (
          <div className="px-4 pb-3 flex items-center gap-4 text-[12.5px] text-[#5A626B]">
            <Stars value={ratingAvg!} size={13} />
            {metricAvgs.map(([l, v]) => <span key={l}>{l} <b className="font-semibold text-[#191C20] tabular-nums">{v.toFixed(1)}</b></span>)}
          </div>
        )}
        {itemReviews.length ? itemReviews.slice(0, 3).map(rv => <ReviewLine key={rv.id} review={rv} />) : (
          <p className="px-4 pb-4 text-[13.5px] text-[#8A929A]">
            {writable ? '아직 이 품목 후기가 없어요. 직접 산 가격과 상태를 처음으로 남겨 주세요.' : '이 품목은 후기를 남길 수 있는 상품이 아직 없어요.'}
          </p>
        )}
      </section>

      <SourceFooter date={date ? fmtDate(date) : undefined} />

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-center">
        <div className="w-full max-w-[430px] bg-white border-t border-[#ECEEF0] px-4 pt-2 pb-[max(env(safe-area-inset-bottom),8px)] flex gap-2">
          <button onClick={() => setAlertOpen(true)} className="h-12 px-4 rounded-[8px] border border-[#DADDE1] flex items-center gap-1.5 text-[14.5px] font-semibold text-[#191C20]">
            <Bell className="w-[18px] h-[18px]" strokeWidth={1.8} />가격 알림
          </button>
          {writable ? (
            <button onClick={() => writeReview(writable.id)} className="flex-1 h-12 rounded-[8px] bg-[#1F6B62] text-white text-[15px] font-semibold flex items-center justify-center gap-1.5">
              <PenLine className="w-[18px] h-[18px]" strokeWidth={1.8} />구매 후기 쓰기
            </button>
          ) : (
            <button onClick={() => toggleWatch(item)} className={`flex-1 h-12 rounded-[8px] text-[15px] font-semibold ${watched ? 'border border-[#1F6B62] text-[#1F6B62]' : 'bg-[#1F6B62] text-white'}`}>
              {watched ? '관심 품목에 담겨 있어요' : '관심 품목 담기'}
            </button>
          )}
        </div>
      </div>

      {alertOpen && <AlertSheet item={item} onClose={() => setAlertOpen(false)} />}
    </div>
  );
};
