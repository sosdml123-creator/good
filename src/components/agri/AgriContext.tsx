import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MarketPriceRow, useMarketPrices } from '../../pc/useMarketPrices';
import type { Product, Review } from '../../types';
import {
  Group, Item, Watch, alertHit, buildItems, freshReviews, loadRecent, loadSavedReviews, loadWatches,
  photoFor, pushRecent, saveSavedReviews, saveWatches,
} from './agriModel';

export type AgriTab = 'home' | 'prices' | 'reviews' | 'saved' | 'my';
export type Screen = { type: 'item'; id: string } | { type: 'review'; id: string };

export interface PriceListPreset { group?: Group; query?: string; sort?: 'down' | 'up'; focus?: boolean }

/** 탭·화면 쌓임을 기억해 두었다가, 후기 작성 등으로 잠깐 나갔다 와도 같은 화면으로 돌아옵니다. */
const navMemo: { tab: AgriTab; stack: Screen[]; preset: PriceListPreset; reviewItem: string | null } = {
  tab: 'home', stack: [], preset: {}, reviewItem: null,
};

interface AgriCtx {
  rows: MarketPriceRow[];
  date: string;
  status: 'loading' | 'ready' | 'error';
  checkedAt: number | null;
  items: Item[];
  itemById: Map<string, Item>;
  products: Product[];
  reviews: Review[];
  photo: (itemName: string) => string | null;
  watches: Watch[];
  isWatched: (key: string) => boolean;
  toggleWatch: (item: Item) => void;
  updateWatch: (item: Item, patch: Partial<Watch>) => void;
  alerts: { watch: Watch; item: Item }[];
  recent: string[];
  savedReviews: string[];
  toggleSaveReview: (id: string) => void;
  tab: AgriTab;
  stack: Screen[];
  preset: PriceListPreset;
  reviewItem: string | null;
  setReviewItem: (name: string | null) => void;
  goTab: (tab: AgriTab) => void;
  openPrices: (preset: PriceListPreset) => void;
  openItem: (id: string) => void;
  openReview: (id: string) => void;
  back: () => void;
  exit: () => void;
  writeReview: (productId: string) => void;
  notify: (msg: string) => void;
}

const Ctx = createContext<AgriCtx | null>(null);

export const useAgri = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAgri must be used inside AgriProvider');
  return v;
};

const scrollTop = () => {
  const main = document.querySelector('main');
  if (main) main.scrollTo({ top: 0 });
};

export const AgriProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const app = useApp();
  const { rows, date, status, checkedAt } = useMarketPrices();
  const [watches, setWatches] = useState<Watch[]>(loadWatches);
  const [recent, setRecent] = useState<string[]>(loadRecent);
  const [savedReviews, setSavedReviews] = useState<string[]>(loadSavedReviews);
  const [tab, setTabState] = useState<AgriTab>(navMemo.tab);
  const [stack, setStack] = useState<Screen[]>(navMemo.stack);
  const [preset, setPreset] = useState<PriceListPreset>(navMemo.preset);
  const [reviewItem, setReviewItemState] = useState<string | null>(navMemo.reviewItem);

  useEffect(() => { Object.assign(navMemo, { tab, stack, preset, reviewItem }); }, [tab, stack, preset, reviewItem]);

  const items = useMemo(() => buildItems(rows), [rows]);
  const itemById = useMemo(() => {
    const m = new Map<string, Item>();
    items.forEach(i => { m.set(i.id, i); i.grades.forEach(g => m.set(g.key, i)); });
    return m;
  }, [items]);

  const reviews = useMemo(() => freshReviews(app.reviews, app.products), [app.reviews, app.products]);
  const photoCache = useMemo(() => new Map<string, string | null>(), [app.products]);
  const photo = useCallback((name: string) => {
    if (!photoCache.has(name)) photoCache.set(name, photoFor(name, app.products));
    return photoCache.get(name) ?? null;
  }, [photoCache, app.products]);

  const notify = useCallback((msg: string) => app.showToast(msg, 'success'), [app]);

  const persistWatches = (next: Watch[]) => {
    setWatches(next);
    if (!saveWatches(next)) app.showToast('이 기기에 저장할 수 없어 이번 방문 동안만 유지돼요.', 'info');
  };

  const toggleWatch = (item: Item) => {
    const has = watches.some(w => w.key === item.id);
    if (has) {
      persistWatches(watches.filter(w => w.key !== item.id));
      notify('관심 품목에서 뺐어요');
    } else {
      persistWatches([{ key: item.id, savedPrice: item.rep.today, savedAt: new Date().toISOString(), alertBelow: null, alertOn: true }, ...watches]);
      notify('관심 품목에 담았어요. 지금보다 내려가면 알려 드릴게요');
    }
  };

  /** 관심 품목 설정 변경. 아직 담지 않은 품목이면 지금 가격으로 담고 설정합니다. */
  const updateWatch = (item: Item, patch: Partial<Watch>) => {
    const has = watches.some(w => w.key === item.id);
    persistWatches(has
      ? watches.map(w => (w.key === item.id ? { ...w, ...patch } : w))
      : [{ key: item.id, savedPrice: item.rep.today, savedAt: new Date().toISOString(), alertBelow: null, alertOn: true, ...patch }, ...watches]);
  };

  const alerts = useMemo(
    () => watches
      .map(w => ({ watch: w, item: itemById.get(w.key) }))
      .filter((x): x is { watch: Watch; item: Item } => Boolean(x.item) && alertHit(x.watch, x.item!.rep)),
    [watches, itemById],
  );

  const toggleSaveReview = (id: string) => {
    const has = savedReviews.includes(id);
    const next = has ? savedReviews.filter(x => x !== id) : [id, ...savedReviews];
    setSavedReviews(next);
    saveSavedReviews(next);
    notify(has ? '저장을 취소했어요' : '후기를 저장했어요. 마이에서 볼 수 있어요');
  };

  const value: AgriCtx = {
    rows, date, status, checkedAt, items, itemById, products: app.products, reviews, photo,
    watches,
    isWatched: key => watches.some(w => w.key === key),
    toggleWatch, updateWatch, alerts, recent, savedReviews, toggleSaveReview,
    tab, stack, preset, reviewItem,
    setReviewItem: name => setReviewItemState(name),
    goTab: t => { setStack([]); setTabState(t); scrollTop(); },
    openPrices: p => { setPreset({ ...p }); setStack([]); setTabState('prices'); scrollTop(); },
    openItem: id => { setRecent(pushRecent(id)); setStack(s => [...s, { type: 'item', id }]); scrollTop(); },
    openReview: id => { setStack(s => [...s, { type: 'review', id }]); scrollTop(); },
    back: () => { setStack(s => s.slice(0, -1)); scrollTop(); },
    exit: () => { navMemo.tab = 'home'; navMemo.stack = []; app.setActiveTab('home'); },
    writeReview: productId => {
      // 상품을 고른 상태로 후기 작성 화면을 열고, 작성 후 뒤로 가면 이 화면으로 돌아옵니다.
      app.openProductDetail(productId);
      app.setActiveTab('write');
    },
    notify,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
