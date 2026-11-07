import React from 'react';
import { Check, Flame, Share2, Star, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getBattlePercents } from '../services/battleService';
import { formatProductPrice } from '../utils/formatters';
import { Product } from '../types';
import { PcContainer, PcEmpty } from './PcUi';

const RATING_ROWS = [
  { key: 'taste', label: '맛' },
  { key: 'value', label: '가성비' },
  { key: 'portion', label: '푸짐함(양)' },
  { key: 'repurchase', label: '재구매 의사' },
] as const;

/** PC 비교함 · 신상 배틀: 상품을 열로 놓는 비교표 (모바일 비교 화면과 별도) */
export const PcCompare: React.FC = () => {
  const {
    products, comparedIds, clearCompare, toggleCompare, openProductDetail, battleConfig, battleRound, battleChoice,
    battleVoteError, voteBattle, showToast,
  } = useApp();

  const compared = products.filter(p => comparedIds.includes(p.id));
  const isCustomCompare = compared.length >= 2;

  const battleA = products.find(p => p.id === battleRound?.productA.id);
  const battleB = products.find(p => p.id === battleRound?.productB.id);
  const columns: Product[] = isCustomCompare ? compared : [battleA, battleB].filter((p): p is Product => Boolean(p));

  const battlePercents = getBattlePercents(battleRound?.counts);
  const isBattleClosed = battleRound?.phase === 'result';

  const share = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('링크가 클립보드에 복사되었습니다!', 'success');
  };

  const best = (key: typeof RATING_ROWS[number]['key']) => Math.max(...columns.map(p => p.detailedRating?.[key] || 0));

  return (
    <div className="bg-white">
      <PcContainer className="py-12">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-gray-900 tracking-tight flex items-center gap-2">
              {isCustomCompare ? '신상 비교함' : '이번 주 신상 배틀'}
              {!isCustomCompare && battleRound && (
                <span className="text-[13px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <Flame className="w-3.5 h-3.5 fill-rose-500" /> LIVE
                </span>
              )}
            </h1>
            <p className="mt-1.5 text-[14px] text-gray-500">
              {isCustomCompare ? '담아 둔 신상을 실제 구매자 평점으로 나란히 비교해 보세요.' : battleConfig.subtitle || '두 신상 중 더 끌리는 쪽에 투표해 주세요.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={share} className="h-10 px-4 rounded-full border border-gray-200 text-[13px] text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer">
              <Share2 className="w-4 h-4" />
              공유
            </button>
            {isCustomCompare && (
              <button onClick={clearCompare} className="h-10 px-4 rounded-full border border-gray-200 text-[13px] text-gray-700 hover:bg-gray-50 cursor-pointer">
                비교함 비우기
              </button>
            )}
          </div>
        </div>

        {/* 배틀 투표 */}
        {!isCustomCompare && battleRound && battleA && battleB && (
          <section className="mt-8 rounded-2xl border border-gray-200 p-7">
            <div className="flex items-center justify-between">
              <p className="text-[18px] font-bold text-gray-900">{battleConfig.title || '이번 주 신상 배틀 투표'}</p>
              <p className="text-[13px] text-gray-500">
                {isBattleClosed ? '투표 마감' : '월~금 투표 · 토요일 결과 공개'} · 총 {battleRound.totalVotes.toLocaleString()}명 참여
              </p>
            </div>
            {battlePercents ? (
              <div className="mt-5">
                <div className="flex justify-between text-[14px] font-bold">
                  <span className="text-gray-900">A {battleA.brand} {battlePercents.A}%</span>
                  <span className="text-orange-500">{battlePercents.B}% {battleB.brand} B</span>
                </div>
                <div className="mt-2 h-3 rounded-full overflow-hidden flex bg-gray-100">
                  <div className="bg-gray-900" style={{ width: `${battlePercents.A}%` }} />
                  <div className="bg-orange-400" style={{ width: `${battlePercents.B}%` }} />
                </div>
              </div>
            ) : (
              <p className="mt-4 text-[14px] text-gray-500">{isBattleClosed ? '이번 주 투표가 마감됐어요.' : '결과는 토요일에 공개돼요.'}</p>
            )}
            {isBattleClosed ? (
              <p className="mt-4 text-[13px] text-gray-400">월요일에 새 대결이 시작돼요.</p>
            ) : (
              <div className="mt-5 grid grid-cols-2 gap-3">
                {([['A', battleA], ['B', battleB]] as const).map(([side, p]) => {
                  const mine = battleChoice === side;
                  return (
                    <button
                      key={side}
                      onClick={() => voteBattle(side)}
                      className={`h-12 rounded-xl border text-[14px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                        mine
                          ? side === 'A' ? 'bg-gray-900 border-gray-900 text-white' : 'bg-orange-500 border-orange-500 text-white'
                          : 'border-gray-200 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {mine && <Check className="w-4 h-4" />}
                      {side}. {p.name} 투표
                    </button>
                  );
                })}
              </div>
            )}
            {battleVoteError && <p className="mt-3 text-[13px] text-rose-500">{battleVoteError}</p>}
          </section>
        )}

        {columns.length === 0 ? (
          <PcEmpty message="비교할 상품이 없어요. 상품 상세에서 '비교함 담기'를 눌러 보세요." />
        ) : (
          <div className="mt-10 overflow-x-auto">
            <table className="w-full table-fixed text-[14px]">
              <colgroup>
                <col className="w-[160px]" />
                {columns.map(p => <col key={p.id} />)}
              </colgroup>
              <tbody>
                <tr className="border-t border-gray-900">
                  <th />
                  {columns.map((p, i) => (
                    <td key={p.id} className="px-4 pt-6 pb-4 align-top">
                      <div className="relative">
                        {isCustomCompare ? (
                          <button
                            onClick={() => toggleCompare(p.id)}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer z-10"
                            aria-label="비교함에서 빼기"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className={`absolute top-2 left-2 z-10 text-[12px] font-bold text-white px-2 py-0.5 rounded ${i === 0 ? 'bg-gray-900' : 'bg-orange-500'}`}>
                            {i === 0 ? 'A' : 'B'}
                          </span>
                        )}
                        <button onClick={() => openProductDetail(p.id)} className="block w-full cursor-pointer">
                          <img src={p.image} alt={p.name} className="w-full aspect-square object-cover rounded-xl bg-gray-50 border border-gray-100" />
                        </button>
                      </div>
                      <p className="mt-3 text-[13px] text-gray-500">{p.brand}</p>
                      <button onClick={() => openProductDetail(p.id)} className="mt-0.5 text-left text-[16px] font-semibold text-gray-900 line-clamp-2 hover:underline cursor-pointer">
                        {p.name}
                      </button>
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-100">
                  <th className="py-4 text-left font-medium text-gray-500">가격</th>
                  {columns.map(p => <td key={p.id} className="px-4 py-4 font-bold text-gray-900">{formatProductPrice(p.price)}</td>)}
                </tr>
                <tr className="border-t border-gray-100">
                  <th className="py-4 text-left font-medium text-gray-500">카테고리</th>
                  {columns.map(p => <td key={p.id} className="px-4 py-4 text-gray-700">{p.category}</td>)}
                </tr>
                <tr className="border-t border-gray-100">
                  <th className="py-4 text-left font-medium text-gray-500">종합 평점</th>
                  {columns.map(p => (
                    <td key={p.id} className="px-4 py-4">
                      {p.ratingCount > 0 && p.overallRating > 0 ? (
                        <span className="inline-flex items-center gap-1 font-bold text-gray-900">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          {p.overallRating.toFixed(1)}
                          <span className="font-normal text-gray-400">({p.ratingCount})</span>
                        </span>
                      ) : (
                        <span className="text-gray-400">평가 대기</span>
                      )}
                    </td>
                  ))}
                </tr>
                {RATING_ROWS.map(row => {
                  const top = best(row.key);
                  return (
                    <tr key={row.key} className="border-t border-gray-100">
                      <th className="py-4 text-left font-medium text-gray-500">{row.label}</th>
                      {columns.map(p => {
                        const v = p.detailedRating?.[row.key] || 0;
                        return (
                          <td key={p.id} className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                                <div className={`h-full rounded-full ${v > 0 && v === top ? 'bg-violet-600' : 'bg-gray-400'}`} style={{ width: `${(v / 5) * 100}%` }} />
                              </div>
                              <span className={`w-8 text-right ${v > 0 && v === top ? 'font-bold text-violet-700' : 'text-gray-600'}`}>{v.toFixed(1)}</span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                <tr className="border-t border-b border-gray-200">
                  <th />
                  {columns.map(p => (
                    <td key={p.id} className="px-4 py-5">
                      <button onClick={() => openProductDetail(p.id)} className="w-full h-11 rounded-xl border border-gray-300 text-[14px] text-gray-800 hover:bg-gray-50 cursor-pointer">
                        리뷰 보기
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </PcContainer>
    </div>
  );
};
