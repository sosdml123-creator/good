import React, { useMemo, useState } from 'react';
import { Clock, Heart, Search, Share2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SalePromotionItem, SaleStoreType } from '../types';
import { SafeImage } from '../components/common/SafeImage';
import { PcContainer, PcTextTabs } from './PcUi';

const DEAL_TABS = [
  { key: 'all', label: '전체' },
  { key: '1+1', label: '1+1' },
  { key: '2+1', label: '2+1' },
  { key: 'discount', label: '할인특가' },
  { key: 'saved', label: '찜한 행사' },
] as const;
type DealTab = typeof DEAL_TABS[number]['key'];
type SortOption = 'popular' | 'discount' | 'urgent';
const STORES = ['전체', 'CU', '세븐일레븐', '이마트24', '이마트', '롯데마트', '홈플러스'];

const DEAL_BADGE: Record<string, string> = {
  '1+1': 'bg-rose-600 text-white',
  '2+1': 'bg-blue-600 text-white',
  '할인특가': 'bg-orange-500 text-white',
  '콤보할인': 'bg-purple-600 text-white',
};

/** PC 행사·할인: 왼쪽 매장 필터 + 4열 카드 (모바일 행사소식과 별도) */
export const PcSale: React.FC = () => {
  const { salePromotions, savedSaleIds, toggleSaveSale, openProductDetail, showToast } = useApp();
  const [dealTab, setDealTab] = useState<DealTab>('all');
  const [store, setStore] = useState('전체');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortOption>('popular');

  const list = useMemo(() => {
    const q = query.toLowerCase().trim();
    const filtered = salePromotions.filter(item => {
      if (dealTab === 'saved' && !savedSaleIds.includes(item.id)) return false;
      if ((dealTab === '1+1' || dealTab === '2+1') && item.dealType !== dealTab) return false;
      if (dealTab === 'discount' && item.dealType !== '할인특가' && item.dealType !== '콤보할인') return false;
      if (store !== '전체' && item.store !== store && !item.stores?.includes(store as SaleStoreType)) return false;
      if (q && !item.title.toLowerCase().includes(q) && !item.brand.toLowerCase().includes(q) && !item.benefitTag?.toLowerCase().includes(q)) return false;
      return true;
    });
    const urgent = (i: SalePromotionItem) => (i.dDay.includes('마감') || i.dDay.includes('D-') ? 1 : 0);
    return filtered.sort((a, b) =>
      sort === 'discount' ? (b.discountRate || 0) - (a.discountRate || 0)
        : sort === 'urgent' ? urgent(b) - urgent(a)
          : (b.likeCount + (b.isHot ? 1000 : 0)) - (a.likeCount + (a.isHot ? 1000 : 0)));
  }, [salePromotions, savedSaleIds, dealTab, store, query, sort]);

  const share = (item: SalePromotionItem) => {
    navigator.clipboard?.writeText(`[신상픽 행사소식] ${item.store} ${item.badgeText} 특가!\n${item.title} - ${item.unitPriceDescription}`);
    showToast('📋 행사 정보가 클립보드에 복사되었습니다!', 'success');
  };

  const resetFilters = () => { setQuery(''); setStore('전체'); setDealTab('all'); };

  return (
    <div className="bg-white">
      <PcContainer className="py-12">
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">편의점·마트 행사</h1>
        <p className="mt-1.5 text-[14px] text-gray-500">
          1+1 · 2+1 · 할인 행사를 한곳에서 모아 보세요. 교차 증정 상품은 같은 가격대의 다른 맛으로 고를 수 있어요.
        </p>

        <div className="mt-10 grid grid-cols-[200px_1fr] gap-10 items-start">
          {/* 매장 필터 */}
          <aside className="sticky top-6">
            <p className="text-[15px] font-bold text-gray-900 pb-3 border-b border-gray-900">매장</p>
            <ul className="mt-2">
              {STORES.map(s => (
                <li key={s}>
                  <button
                    onClick={() => setStore(s)}
                    className={`w-full text-left py-2.5 text-[14px] cursor-pointer ${store === s ? 'font-bold text-violet-700' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="min-w-0">
            <div className="flex items-center justify-between gap-6">
              <PcTextTabs
                items={DEAL_TABS.map(t => (t.key === 'saved' ? `${t.label} ${savedSaleIds.length}` : t.label))}
                value={(() => { const t = DEAL_TABS.find(x => x.key === dealTab)!; return t.key === 'saved' ? `${t.label} ${savedSaleIds.length}` : t.label; })()}
                onChange={v => setDealTab(DEAL_TABS.find(t => v.startsWith(t.label))!.key)}
              />
              <div className="relative w-[280px] shrink-0">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="행사 상품명, 브랜드 검색"
                  className="w-full h-10 pl-10 pr-9 rounded-full border border-gray-200 text-[14px] outline-none focus:border-gray-900"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer" aria-label="지우기">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 pb-4 border-b border-gray-200 flex items-center justify-between text-[14px]">
              <p className="text-gray-500">총 <strong className="text-gray-900">{list.length.toLocaleString()}</strong>개</p>
              <div className="flex items-center gap-4">
                {([['popular', '인기순'], ['discount', '할인율순'], ['urgent', '마감임박순']] as const).map(([k, label]) => (
                  <button key={k} onClick={() => setSort(k)} className={`cursor-pointer ${sort === k ? 'font-bold text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {list.length === 0 ? (
              <div className="py-28 text-center">
                <p className="text-[15px] text-gray-400">해당하는 행사 상품이 없습니다.</p>
                {(query || store !== '전체' || dealTab !== 'all') && (
                  <button onClick={resetFilters} className="mt-4 h-10 px-5 rounded-full border border-gray-200 text-[13px] text-gray-700 hover:bg-gray-50 cursor-pointer">
                    필터 초기화
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-4 gap-x-5 gap-y-9">
                {list.map(item => {
                  const isSaved = savedSaleIds.includes(item.id);
                  return (
                    <div key={item.id} className="group">
                      <div
                        onClick={() => item.productId && openProductDetail(item.productId)}
                        className={`relative aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100 ${item.productId ? 'cursor-pointer' : ''}`}
                      >
                        <SafeImage
                          src={item.image}
                          alt={item.title}
                          fallbackName={item.title}
                          fallbackCategory="과자"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className={`absolute top-2.5 left-2.5 text-[12px] font-bold px-2 py-0.5 rounded ${DEAL_BADGE[item.dealType] ?? 'bg-gray-800 text-white'}`}>
                          {item.badgeText}
                        </span>
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            onClick={e => { e.stopPropagation(); share(item); }}
                            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer"
                            aria-label="공유"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); toggleSaveSale(item.id); }}
                            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center cursor-pointer"
                            aria-label="관심 행사 찜하기"
                          >
                            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-gray-500'}`} />
                          </button>
                        </div>
                      </div>
                      <p className="mt-3 text-[12px] text-gray-500">
                        <span className="font-semibold text-gray-700">{item.store}</span> · {item.brand}
                      </p>
                      <p className="mt-0.5 text-[15px] font-medium text-gray-900 line-clamp-2 leading-snug">{item.title}</p>
                      <p className="mt-1.5 text-[16px] font-bold text-rose-600">{item.unitPriceDescription}</p>
                      {item.originalPrice > 0 && (
                        <p className="text-[12px] text-gray-400 line-through">정가 {item.originalPrice.toLocaleString()}원</p>
                      )}
                      {item.benefitTag && <p className="mt-1 text-[12px] text-indigo-600 line-clamp-1">{item.benefitTag}</p>}
                      <p className="mt-1.5 flex items-center gap-1 text-[12px] text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        {item.dDay} · {item.period}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </PcContainer>
    </div>
  );
};
