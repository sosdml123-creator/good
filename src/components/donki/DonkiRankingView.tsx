import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Pill, Sparkles, Cookie, Package, ShoppingBag, Check, Plus, Loader2, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DonkiCategory, DonkiItem, fetchDonkiRanking, fetchMyDonkiPicks, setDonkiPick } from '../../services/donkiService';

const FILTERS: ('전체' | DonkiCategory | '내 쇼핑리스트')[] = ['전체', '의약품', '화장품', '과자·식품', '생활용품', '내 쇼핑리스트'];

const CATEGORY_STYLE: Record<DonkiCategory, { icon: React.ReactNode; color: string }> = {
  '의약품': { icon: <Pill className="w-6 h-6" />, color: 'bg-sky-50 text-sky-600' },
  '화장품': { icon: <Sparkles className="w-6 h-6" />, color: 'bg-pink-50 text-pink-500' },
  '과자·식품': { icon: <Cookie className="w-6 h-6" />, color: 'bg-amber-50 text-amber-600' },
  '생활용품': { icon: <Package className="w-6 h-6" />, color: 'bg-emerald-50 text-emerald-600' },
};

const rankColor = (rank: number) =>
  rank === 1 ? 'text-amber-500' : rank === 2 ? 'text-slate-400' : rank === 3 ? 'text-orange-700' : 'text-gray-400';

export const DonkiRankingView: React.FC = () => {
  const { setActiveTab, showToast, openLoginModal } = useApp();
  const [items, setItems] = useState<DonkiItem[]>([]);
  const [myPicks, setMyPicks] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [filter, setFilter] = useState<typeof FILTERS[number]>('전체');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setStatus('loading');
    try {
      const [ranking, picks] = await Promise.all([fetchDonkiRanking(), fetchMyDonkiPicks().catch(() => null)]);
      setItems(ranking);
      setMyPicks(new Set(picks || []));
      setStatus('ready');
    } catch (e) {
      console.warn('[donki] load failed:', e);
      setStatus('error');
    }
  };

  useEffect(() => { load(); }, []);

  // 순위는 전체 기준으로 매기고, 필터는 보여줄 항목만 고릅니다.
  const ranked = useMemo(() => items.map((item, i) => ({ item, rank: i + 1 })), [items]);
  const visible = ranked.filter(({ item }) =>
    filter === '전체' ? true : filter === '내 쇼핑리스트' ? myPicks.has(item.id) : item.category === filter
  );
  const myTotalYen = items.filter(i => myPicks.has(i.id)).reduce((sum, i) => sum + (i.priceYen || 0), 0);

  const togglePick = async (item: DonkiItem) => {
    if (busyId) return;
    const next = !myPicks.has(item.id);
    setBusyId(item.id);
    try {
      const result = await setDonkiPick(item.id, next);
      if (result === 'login') {
        openLoginModal();
        return;
      }
      setMyPicks(prev => {
        const s = new Set(prev);
        if (next) s.add(item.id); else s.delete(item.id);
        return s;
      });
      setItems(prev => prev.map(i => (i.id === item.id ? { ...i, pickCount: Math.max(0, i.pickCount + (next ? 1 : -1)) } : i)));
      showToast(next ? '쇼핑리스트에 담았어요.' : '쇼핑리스트에서 뺐어요.', 'success');
    } catch (e) {
      console.warn('[donki] pick failed:', e);
      showToast('저장하지 못했어요. 잠시 후 다시 시도해주세요.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8F9FA] pb-24">
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 px-2 py-2.5">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('home')}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 focus:outline-none"
            aria-label="뒤로"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="min-w-0">
            <h1 className="text-[17px] font-black tracking-tight text-gray-900">돈키호테 필수템 순위</h1>
            <p className="text-[11px] text-gray-400 leading-none mt-0.5">신상픽 회원이 '살 거예요'로 담은 수로 매겨요</p>
          </div>
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-2 mt-2.5">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all focus:outline-none ${
                filter === f ? 'bg-gray-900 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === '내 쇼핑리스트' ? `${f} ${myPicks.size}` : f}
            </button>
          ))}
        </div>
      </header>

      <div className="mx-4 mt-3 rounded-2xl bg-gradient-to-r from-yellow-300 to-amber-400 px-4 py-3 text-gray-900 shadow-2xs">
        <p className="text-[13px] font-black flex items-center gap-1.5"><ShoppingBag className="w-4 h-4" /> 쇼핑 전 꿀팁</p>
        <p className="text-[11px] font-medium mt-1 leading-relaxed">
          같은 날 한 매장에서 세전 5,000엔 이상 사면 면세 대상이에요. 2026년 11월 1일부터는 계산할 때 세금까지 내고, 출국할 때 공항에서 돌려받는 방식으로 바뀌어요. 산 물건은 일본에서 뜯어 쓰면 환급이 안 돼요. 가격은 참고가이며 매장·시기마다 달라요.
        </p>
      </div>

      {filter === '내 쇼핑리스트' && myPicks.size > 0 && (
        <div className="mx-4 mt-3 px-4 py-2.5 rounded-xl bg-white border border-gray-100 flex items-center justify-between text-[12px]">
          <span className="text-gray-500">담은 상품 {myPicks.size}개 · 참고가 합계</span>
          <span className="font-bold text-gray-900">약 ¥{myTotalYen.toLocaleString()}</span>
        </div>
      )}

      <div className="px-4 mt-3 space-y-2">
        {status === 'loading' && (
          <div className="py-20 flex justify-center text-gray-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
        )}
        {status === 'error' && (
          <div className="py-16 text-center text-[12px] text-gray-400">
            순위를 불러오지 못했어요.
            <button onClick={load} className="mt-3 mx-auto flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-900 text-white text-[12px] font-semibold">
              <RefreshCw className="w-3.5 h-3.5" /> 다시 시도
            </button>
          </div>
        )}
        {status === 'ready' && visible.length === 0 && (
          <div className="py-16 text-center text-[12px] text-gray-400">
            {filter === '내 쇼핑리스트' ? "아직 담은 상품이 없어요. '살 거예요'를 눌러 쇼핑리스트를 만들어보세요." : '표시할 상품이 없어요.'}
          </div>
        )}
        {status === 'ready' && visible.map(({ item, rank }) => {
          const picked = myPicks.has(item.id);
          const style = CATEGORY_STYLE[item.category] || CATEGORY_STYLE['생활용품'];
          return (
            <div key={item.id} className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-3 shadow-2xs">
              <span className={`w-6 shrink-0 text-center text-lg font-black italic ${rankColor(rank)}`}>{rank}</span>
              <div className={`w-14 h-14 shrink-0 rounded-xl overflow-hidden flex items-center justify-center ${style.color}`}>
                {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain bg-white" loading="lazy" /> : style.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold">
                  <span className="truncate">{item.brand}</span>
                  <span className="shrink-0 px-1 rounded bg-gray-100 text-gray-500">{item.category}</span>
                </div>
                <h3 className="text-[13px] font-bold text-gray-900 leading-snug truncate mt-0.5">{item.name}</h3>
                {item.nameJa && <p className="text-[10px] text-gray-400 truncate">{item.nameJa}</p>}
                <p className="text-[11px] text-gray-500 leading-snug line-clamp-2 mt-0.5">{item.description}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px]">
                  {item.priceYen ? <span className="font-bold text-gray-900">약 ¥{item.priceYen.toLocaleString()}</span> : null}
                  {item.pickCount > 0 && <span className="text-rose-500 font-semibold">{item.pickCount.toLocaleString()}명이 담았어요</span>}
                </div>
              </div>
              <button
                onClick={() => togglePick(item)}
                disabled={busyId === item.id}
                className={`shrink-0 w-[58px] py-2 rounded-xl text-[11px] font-bold flex flex-col items-center gap-0.5 transition-colors focus:outline-none disabled:opacity-60 ${
                  picked ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {picked ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {picked ? '담았어요' : '살 거예요'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
