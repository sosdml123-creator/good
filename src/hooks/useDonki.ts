import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { DonkiItem, DonkiStore, fetchDonkiRanking, fetchDonkiStores, fetchMyDonkiPicks, setDonkiPick } from '../services/donkiService';

const BOUGHT_KEY = 'sinsangpick_donki_bought';

const readBought = (): Set<string> => {
  try { return new Set(JSON.parse(localStorage.getItem(BOUGHT_KEY) || '[]')); } catch { return new Set(); }
};

/** 돈키호테 가이드 공통 상태 (모바일 DonkiRankingView · PC PcDonki 가 함께 씀) */
export const useDonki = () => {
  const { showToast, openLoginModal } = useApp();
  const [items, setItems] = useState<DonkiItem[]>([]);
  const [stores, setStores] = useState<DonkiStore[]>([]);
  const [myPicks, setMyPicks] = useState<Set<string>>(new Set());
  // '샀어요' 체크는 이 기기에만 저장되는 쇼핑 중 메모입니다.
  const [bought, setBought] = useState<Set<string>>(readBought);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setStatus('loading');
    try {
      const [ranking, picks, storeList] = await Promise.all([
        fetchDonkiRanking(),
        fetchMyDonkiPicks().catch(() => null),
        fetchDonkiStores().catch(() => [] as DonkiStore[]),
      ]);
      setItems(ranking);
      setMyPicks(new Set(picks || []));
      setStores(storeList);
      setStatus('ready');
    } catch (e) {
      console.warn('[donki] load failed:', e);
      setStatus('error');
    }
  };

  useEffect(() => { load(); }, []);

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

  const toggleBought = (id: string) => {
    setBought(prev => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id); else s.add(id);
      try { localStorage.setItem(BOUGHT_KEY, JSON.stringify([...s])); } catch { /* 저장 불가 환경 */ }
      return s;
    });
  };

  // 순위는 전체 기준
  const ranked = useMemo(() => items.map((item, i) => ({ item, rank: i + 1 })), [items]);
  const myList = useMemo(() => ranked.filter(r => myPicks.has(r.item.id)), [ranked, myPicks]);
  const myTotalYen = myList.reduce((sum, r) => sum + (r.item.priceYen || 0), 0);
  const boughtCount = myList.filter(r => bought.has(r.item.id)).length;
  const cities = useMemo(() => Array.from(new Set(stores.map(s => s.city))), [stores]);

  return {
    status, load, ranked, stores, cities, myPicks, myList, myTotalYen,
    bought, boughtCount, toggleBought, togglePick, busyId,
  };
};
