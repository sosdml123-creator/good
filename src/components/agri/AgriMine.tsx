import React, { useMemo, useState } from 'react';
import { Bell, BellOff, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAgri } from './AgriContext';
import { Item, NORMAL_NOTE, Watch, fmtDate, fmtDot, itemSpec, itemTitle, pctChange, won } from './agriModel';
import { ItemRow, ReviewLine } from './AgriRows';
import { AlertSheet } from './AgriItem';
import { Band, Change, Empty, ExitHomeButton, SectionHead, SourceFooter } from './AgriUi';

/** 관심: 가격 알림 · 관심 품목(담은 후 변동) · 품목 비교 · 최근 본 품목 */
export const AgriSaved: React.FC = () => {
  const { watches, itemById, alerts, recent, date, openPrices, isWatched } = useAgri();
  const [sheet, setSheet] = useState<Item | null>(null);
  const [compare, setCompare] = useState<string[]>([]);

  const watched = watches.map(w => ({ w, item: itemById.get(w.key) })).filter((x): x is { w: Watch; item: Item } => Boolean(x.item));
  const missing = watches.length - watched.length;
  const recentItems = recent.map(k => itemById.get(k)).filter((x): x is Item => Boolean(x) && !isWatched(x!.id)).slice(0, 6);
  const compared = compare.map(k => itemById.get(k)).filter((x): x is Item => Boolean(x));

  return (
    <div className="bg-white min-h-full pb-24">
      <header className="sticky top-0 z-20 bg-white border-b border-[#ECEEF0]">
        <div className="flex items-center h-12 pl-3 pr-4 gap-2">
          <ExitHomeButton />
          <h1 className="flex-1 min-w-0 truncate text-[17px] font-bold text-[#191C20] tracking-[-0.02em]">관심</h1>
          <span className="shrink-0 text-[12px] text-[#8A929A]">{date ? `${fmtDate(date)} 공시 기준` : ''}</span>
        </div>
      </header>

      {watches.length === 0 ? (
        <Empty
          title="관심 품목이 없어요"
          desc="자주 사는 품목을 담아 두면 가격 변동을 한곳에서 보고, 내려갔을 때 알림을 받을 수 있어요."
          action={<button onClick={() => openPrices({})} className="h-10 px-4 rounded-[8px] bg-[#1F6B62] text-white text-[14px] font-semibold">시세에서 담기</button>}
        />
      ) : (
        <>
          <SectionHead title="가격 알림" note="새 공시가가 나오면 앱을 열 때 확인해요 · 휴대폰 푸시는 아직 지원하지 않아요" />
          {alerts.length === 0 ? (
            <p className="px-4 pb-4 text-[13.5px] text-[#8A929A]">아직 조건에 맞게 내려간 품목이 없어요.</p>
          ) : alerts.map(({ watch, item }) => (
            <ItemRow
              key={item.id}
              item={item}
              showWatch={false}
              right={<span className="text-[12px] font-semibold text-[#2D64CF]">{watch.alertBelow ? `목표 ${won(watch.alertBelow)} 이하` : `담은 후 ${Math.abs(pctChange(item.rep.today, watch.savedPrice) || 0).toFixed(1)}% ↓`}</span>}
            />
          ))}

          <Band />
          <SectionHead title={`관심 품목 ${watched.length}`} note="오른쪽 값은 담았을 때 가격과 비교한 변동이에요" />
          {watched.map(({ w, item }) => {
            const since = pctChange(item.rep.today, w.savedPrice);
            return (
              <div key={w.key} className="relative">
                <ItemRow
                  item={item}
                  right={since !== null ? <Change rate={since} label="담은 후" /> : <Change rate={item.rep.changeRate} />}
                />
                <div className="flex items-center gap-3 pl-[74px] pr-4 -mt-1.5 pb-2.5 border-b border-[#F1F2F4] text-[12px] text-[#8A929A]">
                  <span>{w.savedPrice ? `담은 가격 ${won(w.savedPrice)}${w.savedAt ? ` (${fmtDot(w.savedAt).slice(5)})` : ''}` : '담은 가격 기록 없음'}</span>
                  <button onClick={() => setSheet(item)} className="ml-auto flex items-center gap-1 text-[#5A626B]">
                    {w.alertOn ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                    {w.alertOn ? (w.alertBelow ? `${won(w.alertBelow)} 이하 알림` : '하락 알림') : '알림 꺼짐'}
                  </button>
                </div>
              </div>
            );
          })}
          {missing > 0 && <p className="px-4 py-3 text-[12px] text-[#8A929A]">오늘 공시에 없는 관심 품목 {missing}개는 숨겨 두었어요.</p>}

          {watched.length >= 2 && (
            <>
              <Band />
              <SectionHead title="품목 비교" note="최대 3개까지 골라 나란히 볼 수 있어요" />
              <div className="flex flex-wrap gap-1.5 px-4">
                {watched.map(({ item }) => {
                  const on = compare.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCompare(c => (on ? c.filter(k => k !== item.id) : c.length < 3 ? [...c, item.id] : c))}
                      disabled={!on && compare.length >= 3}
                      aria-pressed={on}
                      className={`h-8 px-3 rounded-[6px] text-[13px] border disabled:opacity-40 ${on ? 'border-[#1F6B62] bg-[#EDF4F2] text-[#1F6B62] font-semibold' : 'border-[#E3E5E8] text-[#5A626B]'}`}
                    >
                      {itemTitle(item.rep)}
                    </button>
                  );
                })}
              </div>
              {compared.length > 0 && (
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[340px] text-[13px]">
                    <caption className="sr-only">관심 품목 가격 비교</caption>
                    <thead>
                      <tr className="bg-[#FAFAFB] border-y border-[#ECEEF0]">
                        <th className="pl-4 py-2 text-left font-normal text-[12px] text-[#8A929A] w-[72px]">항목</th>
                        {compared.map(i => <th key={i.id} className="px-2 py-2 text-right font-semibold text-[#191C20]">{itemTitle(i.rep)}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {([
                        ['규격', (i: Item) => [itemSpec(i.rep), i.rep.unit].filter(Boolean).join(' · ')],
                        ['현재가', (i: Item) => won(i.rep.today)],
                        ['전일 대비', (i: Item) => <Change rate={i.rep.changeRate} />],
                        ['1주 전', (i: Item) => won(i.rep.weekAgo)],
                        ['1개월 전', (i: Item) => won(i.rep.monthAgo)],
                        ['평년', (i: Item) => won(i.rep.normal)],
                      ] as [string, (i: Item) => React.ReactNode][]).map(([label, f]) => (
                        <tr key={label} className="border-b border-[#F1F2F4]">
                          <th scope="row" className="pl-4 py-2.5 text-left font-normal text-[#8A929A]">{label}</th>
                          {compared.map(i => <td key={i.id} className={`px-2 py-2.5 text-right tabular-nums text-[#191C20] ${label === '규격' ? 'text-[11.5px] text-[#5A626B]' : ''}`}>{f(i)}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="px-4 pt-2 text-[11.5px] text-[#8A929A]">단위·품종·등급이 다르면 가격을 직접 비교하기 어려워요.</p>
                </div>
              )}
            </>
          )}
        </>
      )}

      {recentItems.length > 0 && (
        <>
          <Band />
          <SectionHead title="최근 확인한 품목" />
          {recentItems.map(i => <ItemRow key={i.id} item={i} />)}
        </>
      )}

      <SourceFooter date={date ? fmtDate(date) : undefined} />
      {sheet && <AlertSheet item={sheet} onClose={() => setSheet(null)} />}
    </div>
  );
};

/** 마이: 내 후기 · 저장한 후기 · 데이터 안내 */
export const AgriMy: React.FC = () => {
  const { reviews, savedReviews, watches, alerts, goTab, exit } = useAgri();
  const app = useApp();
  const user = app.currentUser;
  const loggedIn = !user.isAnonymous;
  const mine = useMemo(() => reviews.filter(r => r.userId && r.userId === user.uid), [reviews, user.uid]);
  const saved = useMemo(() => savedReviews.map(id => reviews.find(r => r.id === id)).filter((r): r is NonNullable<typeof r> => Boolean(r)), [savedReviews, reviews]);
  const [tab, setTab] = useState<'mine' | 'saved'>('mine');
  const shown = tab === 'mine' ? mine : saved;

  return (
    <div className="bg-white min-h-full pb-24">
      <header className="sticky top-0 z-20 bg-white border-b border-[#ECEEF0]">
        <div className="flex items-center h-12 pl-3 pr-4 gap-2">
          <ExitHomeButton />
          <h1 className="flex-1 min-w-0 truncate text-[17px] font-bold text-[#191C20] tracking-[-0.02em]">마이</h1>
        </div>
      </header>

      <section className="px-4 py-4 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[17px] font-bold text-[#191C20] truncate">{loggedIn ? `${user.displayName}님` : '로그인이 필요해요'}</p>
          <p className="mt-0.5 text-[12.5px] text-[#8A929A]">{loggedIn ? '후기·댓글은 신상픽 계정으로 남겨요' : '후기와 댓글을 남기려면 로그인해 주세요'}</p>
        </div>
        {!loggedIn && <button onClick={app.openLoginModal} className="h-9 px-3.5 rounded-[8px] bg-[#1F6B62] text-white text-[13.5px] font-semibold">로그인</button>}
      </section>

      <div className="mx-4 grid grid-cols-3 border border-[#ECEEF0] rounded-[8px] divide-x divide-[#ECEEF0] text-center">
        {[
          ['관심 품목', watches.length, () => goTab('saved')],
          ['가격 알림', alerts.length, () => goTab('saved')],
          ['저장한 후기', saved.length, () => setTab('saved')],
        ].map(([l, v, f]) => (
          <button key={String(l)} onClick={f as () => void} className="py-3">
            <span className="block text-[12px] text-[#5A626B]">{l as string}</span>
            <span className="block mt-0.5 text-[18px] font-bold tabular-nums text-[#191C20]">{v as number}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 flex border-b border-[#ECEEF0] px-4 gap-5" role="tablist">
        {([['mine', `내 후기 ${mine.length}`], ['saved', `저장한 후기 ${saved.length}`]] as const).map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`relative h-11 text-[15px] ${tab === id ? 'font-bold text-[#191C20]' : 'text-[#8A929A]'}`}>
            {label}{tab === id && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#191C20]" />}
          </button>
        ))}
      </div>
      {shown.length ? shown.map(r => <ReviewLine key={r.id} review={r} />) : (
        <p className="px-4 py-8 text-center text-[13.5px] text-[#8A929A]">
          {tab === 'mine' ? '아직 작성한 농수산물 후기가 없어요.' : '피드에서 책갈피를 눌러 후기를 저장해 보세요.'}
        </p>
      )}

      <Band />
      <section className="px-4 py-5">
        <h2 className="text-[15px] font-bold text-[#191C20]">시세 데이터 안내</h2>
        <ul className="mt-2.5 space-y-2 text-[13px] leading-[1.6] text-[#5A626B]">
          <li>가격은 KAMIS(한국농수산식품유통공사)가 평일 오후에 공시하는 전국 평균 소매가예요. 주말·공휴일에는 공시가 없어요.</li>
          <li>지역·시장별 가격은 KAMIS가 전국 전통시장과 대형유통 매장에서 조사한 가격이에요.</li>
          <li>{NORMAL_NOTE}.</li>
          <li>실제 매장 판매가, 산지 직거래 가격과는 차이가 있을 수 있어요.</li>
          <li>관심 품목과 알림 설정은 이 기기에만 저장돼요.</li>
        </ul>
      </section>

      <Band />
      <button onClick={() => app.setActiveTab('my')} className="w-full flex items-center px-4 h-12 text-[14.5px] text-[#191C20] border-b border-[#F1F2F4]">
        <span className="flex-1 text-left">신상픽 마이페이지</span><ChevronRight className="w-4 h-4 text-[#8A929A]" />
      </button>
      <button onClick={exit} className="w-full flex items-center px-4 h-12 text-[14.5px] text-[#191C20] border-b border-[#F1F2F4]">
        <span className="flex-1 text-left">신상픽 홈으로 나가기</span><ChevronRight className="w-4 h-4 text-[#8A929A]" />
      </button>
    </div>
  );
};
