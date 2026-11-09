import React, { useEffect, useMemo, useRef } from 'react';
import { ExternalLink, Heart, PenLine, Scale, Star, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { SafeImage } from '../components/common/SafeImage';
import { formatProductPrice } from '../utils/formatters';
import { safeLocalStorageGet } from '../utils/safeStorage';
import { isAlcoholProduct } from '../utils/alcohol';
import { getProductShareUrl } from '../utils/productCode';
import { COUPANG_AFFILIATE_URL, COUPANG_PARTNERS_NOTICE } from '../constants/affiliate';
import { PcProductCard } from './PcProductCard';
import { PcAdSlot } from './PcAdSlot';
import { PcBreadcrumb, PcContainer } from './PcUi';

const Stars: React.FC<{ value: number; size?: string }> = ({ value, size = 'w-4 h-4' }) => (
  <span className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(n => (
      <Star key={n} className={`${size} ${n <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
    ))}
  </span>
);

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

/** 상품 정보 표에 실제 값이 있는 항목만 보여줍니다. */
const buildInfoRows = (p: Product): [string, string][] => {
  const rows: [string, string | undefined][] = [
    ['브랜드', p.brand],
    ['카테고리', [p.category, p.subCategory].filter(Boolean).join(' > ')],
    ['판매처', p.stores && p.stores.length > 0 ? p.stores.join(', ') : undefined],
    ['출시일', p.releaseDate],
    ['용량', p.volume],
    ['열량', p.calories ? `${p.calories}kcal` : p.nutrition?.calories ? `${p.nutrition.calories}kcal` : undefined],
    ['맵기', p.spiciness],
    ['제조원', p.manufacturer],
    ['원산지', p.origin],
    ['보관방법', p.storageMethod],
    ['소비기한', p.shelfLife],
    ['알레르기 유발물질', p.allergens && p.allergens.length > 0 ? p.allergens.join(', ') : undefined],
    ['원재료', p.ingredients],
    ['주의사항', p.precautions],
  ];
  return rows.filter((r): r is [string, string] => Boolean(r[1] && String(r[1]).trim()));
};

export const PcProductDetail: React.FC = () => {
  const {
    selectedProduct,
    products,
    reviews,
    setActiveTab,
    setSelectedCategory,
    openBrandDetail,
    toggleBookmark,
    toggleCompare,
    bookmarkedIds,
    comparedIds,
    showToast,
  } = useApp();
  const reviewsRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const p = selectedProduct;

  const productReviews = useMemo(() => {
    if (!p) return [];
    const blocked = safeLocalStorageGet<string[]>('sinsangpick_blocked_users', []);
    const hidden = safeLocalStorageGet<string[]>('sinsangpick_hidden_ids', []);
    return reviews
      .filter(r => r.productId === p.id && !hidden.includes(r.id) && !blocked.includes(r.userName))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [reviews, p]);

  const related = useMemo(
    () => (p ? products.filter(x => x.id !== p.id && x.category === p.category).slice(0, 5) : []),
    [products, p]
  );

  useEffect(() => {
    if (p) document.title = `${p.name} - ${p.brand} 리뷰·가격 | 신상픽`;
  }, [p]);

  if (!p) {
    return (
      <PcContainer className="py-32 text-center">
        <p className="text-[18px] font-bold text-gray-900">상품을 찾을 수 없어요</p>
        <button onClick={() => setActiveTab('home')} className="mt-6 px-6 h-11 rounded-lg bg-gray-900 text-white text-[14px] font-semibold cursor-pointer">
          홈으로
        </button>
      </PcContainer>
    );
  }

  const count = productReviews.length;
  const avg = count > 0 ? productReviews.reduce((s, r) => s + (r.rating || 0), 0) / count : 0;
  const detailed = productReviews.filter(r => r.detailedRating);
  const metrics = detailed.length > 0
    ? ([
        ['맛', 'taste'],
        ['가성비', 'value'],
        ['양', 'portion'],
        ['재구매', 'repurchase'],
      ] as const).map(([label, key]) => ({
        label,
        val: detailed.reduce((s, r) => s + (r.detailedRating?.[key] || 0), 0) / detailed.length,
      }))
    : [];
  const isBookmarked = bookmarkedIds.includes(p.id);
  const isCompared = comparedIds.includes(p.id);
  const isAlcohol = isAlcoholProduct(p);
  const infoRows = buildInfoRows(p);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(getProductShareUrl(p));
      showToast('상품 링크를 복사했어요.', 'success');
    } catch {
      showToast('링크를 복사하지 못했어요.', 'error');
    }
  };

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) =>
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="bg-white pb-24">
      <PcContainer className="pt-6">
        <PcBreadcrumb
          items={[
            { label: '홈', onClick: () => setActiveTab('home') },
            { label: p.category, onClick: () => { setSelectedCategory(p.category); setActiveTab('category'); } },
            { label: p.name },
          ]}
        />

        {/* 상단: 이미지 + 구매 정보 */}
        <div className="mt-6 grid grid-cols-[520px_1fr] gap-14">
          <div className="aspect-square rounded-2xl overflow-hidden bg-[#F7F7F8] border border-gray-100">
            <SafeImage src={p.image} alt={p.name} fallbackCategory={p.category} fallbackName={p.name} className="w-full h-full object-cover" />
          </div>

          <div className="min-w-0 pt-2">
            <div className="flex items-start justify-between gap-4">
              <button onClick={() => openBrandDetail(p.brand)} className="text-[15px] font-semibold text-gray-600 hover:text-gray-900 cursor-pointer">
                {p.brand} 브랜드관 &gt;
              </button>
              <button onClick={share} aria-label="링크 복사" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-900 cursor-pointer">
                <Share2 className="w-4 h-4 text-gray-700" />
              </button>
            </div>
            <h1 className="mt-2 text-[28px] font-bold text-gray-900 leading-snug tracking-tight">{p.name}</h1>
            <button onClick={() => scrollTo(reviewsRef)} className="mt-3 flex items-center gap-2 cursor-pointer">
              <Stars value={avg} />
              <span className="text-[14px] font-semibold text-gray-900">{count > 0 ? avg.toFixed(1) : '-'}</span>
              <span className="text-[14px] text-gray-500 underline underline-offset-2">리뷰 {count.toLocaleString()}개</span>
            </button>
            <p className="mt-6 text-[32px] font-bold text-gray-900">{formatProductPrice(p.price)}</p>

            <dl className="mt-7 border-t border-gray-200">
              {infoRows.slice(0, 6).map(([k, v]) => (
                <div key={k} className="flex py-3.5 border-b border-gray-100 text-[14px]">
                  <dt className="w-28 shrink-0 text-gray-500">{k}</dt>
                  <dd className="text-gray-900 min-w-0 break-words">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex gap-2">
              <button
                onClick={(e) => toggleBookmark(p.id, e)}
                aria-label={isBookmarked ? '찜 해제' : '찜하기'}
                className={`w-14 h-14 shrink-0 rounded-xl border flex items-center justify-center cursor-pointer ${isBookmarked ? 'border-rose-200 bg-rose-50' : 'border-gray-300 hover:border-gray-900'}`}
              >
                <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-rose-500 text-rose-500' : 'text-gray-700'}`} />
              </button>
              <button
                onClick={() => toggleCompare(p.id)}
                className={`h-14 px-5 shrink-0 rounded-xl border flex items-center gap-1.5 text-[15px] font-semibold cursor-pointer ${isCompared ? 'border-gray-300 bg-gray-100 text-gray-900' : 'border-gray-300 text-gray-800 hover:border-gray-900'}`}
              >
                <Scale className="w-4 h-4" />
                {isCompared ? '비교 중' : '비교하기'}
              </button>
              <button
                onClick={() => setActiveTab('write')}
                className="h-14 flex-1 rounded-xl border border-gray-300 text-gray-900 text-[15px] font-bold flex items-center justify-center gap-1.5 hover:border-gray-900 cursor-pointer"
              >
                <PenLine className="w-4 h-4" />
                리뷰 쓰기
              </button>
              {!isAlcohol && (
                <button
                  onClick={() => window.open(COUPANG_AFFILIATE_URL, '_blank', 'noopener,noreferrer')}
                  className="h-14 flex-1 rounded-xl bg-violet-600 text-white text-[15px] font-bold flex items-center justify-center gap-1.5 hover:bg-violet-700 cursor-pointer"
                >
                  쿠팡에서 구매하기
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>
            {!isAlcohol && <p className="mt-3 text-[12px] text-gray-400">{COUPANG_PARTNERS_NOTICE}</p>}
          </div>
        </div>
      </PcContainer>

      {/* 탭 바 */}
      <div className="sticky top-0 z-10 mt-16 bg-white border-b border-gray-200">
        <PcContainer className="flex">
          <button onClick={() => scrollTo(reviewsRef)} className="h-14 px-8 text-[16px] font-semibold text-gray-900 border-b-2 border-gray-900 -mb-px cursor-pointer">
            리뷰 <span className="text-gray-900">{count}</span>
          </button>
          <button onClick={() => scrollTo(infoRef)} className="h-14 px-8 text-[16px] text-gray-500 hover:text-gray-900 cursor-pointer">
            상품정보
          </button>
        </PcContainer>
      </div>

      <PcContainer>
        {/* 리뷰 */}
        <div ref={reviewsRef} className="pt-12 scroll-mt-16">
          <h2 className="text-[22px] font-bold text-gray-900">상품 리뷰</h2>
          <div className="mt-6 rounded-2xl bg-[#F8F8FA] p-8 grid grid-cols-[220px_1fr] gap-10 items-center">
            <div className="text-center">
              <p className="text-[44px] font-bold text-gray-900 leading-none">{count > 0 ? avg.toFixed(1) : '-'}</p>
              <div className="mt-3 flex justify-center"><Stars value={avg} size="w-5 h-5" /></div>
              <p className="mt-2 text-[13px] text-gray-500">리뷰 {count.toLocaleString()}개</p>
            </div>
            {metrics.length > 0 ? (
              <div className="space-y-3">
                {metrics.map(m => (
                  <div key={m.label} className="flex items-center gap-4 text-[14px]">
                    <span className="w-14 text-gray-600">{m.label}</span>
                    <span className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                      <span className="block h-full bg-gray-800 rounded-full" style={{ width: `${Math.min(100, (m.val / 5) * 100)}%` }} />
                    </span>
                    <span className="w-8 text-right font-semibold text-gray-900">{m.val.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[14px] text-gray-500">
                {count > 0 ? '세부 평가가 있는 리뷰가 아직 없어요.' : '아직 리뷰가 없어요. 첫 번째 리뷰를 남겨주세요!'}
              </p>
            )}
          </div>

          {count > 0 ? (
            <ul className="mt-4">
              {productReviews.map(r => (
                <li key={r.id} className="py-7 border-b border-gray-100 grid grid-cols-[180px_1fr] gap-8">
                  <div className="flex items-start gap-3 min-w-0">
                    <img src={r.userAvatar} alt="" className="w-9 h-9 rounded-full object-cover bg-gray-100 shrink-0" />
                    <span className="min-w-0">
                      <span className="block text-[14px] font-semibold text-gray-900 truncate">{r.userName}</span>
                      <span className="block text-[12px] text-gray-400">{r.userLevel}</span>
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <Stars value={r.rating} size="w-3.5 h-3.5" />
                      <span className="text-[12px] text-gray-400">{formatDate(r.createdAt)}</span>
                    </div>
                    <p className="mt-3 text-[15px] text-gray-800 leading-relaxed whitespace-pre-wrap break-words">{r.content}</p>
                    {r.images && r.images.length > 0 && (
                      <div className="mt-4 flex gap-2">
                        {r.images.slice(0, 5).map((src, i) => (
                          <img key={i} src={src} alt="" className="w-24 h-24 rounded-lg object-cover bg-gray-100" loading="lazy" />
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setActiveTab('write')}
                className="px-8 h-12 rounded-lg bg-gray-900 text-white text-[14px] font-semibold flex items-center gap-1.5 hover:bg-black cursor-pointer"
              >
                <PenLine className="w-4 h-4" />
                첫 리뷰 쓰기
              </button>
            </div>
          )}
        </div>

        {/* 광고 */}
        <PcAdSlot key={`ad-${p.id}`} className="pt-12" />

        {/* 상품 정보 */}
        <div ref={infoRef} className="pt-16 scroll-mt-16">
          <h2 className="text-[22px] font-bold text-gray-900">상품정보</h2>
          {p.description && <p className="mt-4 text-[15px] text-gray-700 leading-relaxed whitespace-pre-wrap">{p.description}</p>}
          <table className="mt-6 w-full border-t-2 border-gray-900 text-[14px]">
            <tbody>
              {infoRows.map(([k, v]) => (
                <tr key={k} className="border-b border-gray-200">
                  <th className="w-48 py-4 px-5 bg-[#F8F8FA] text-left font-medium text-gray-600 align-top">{k}</th>
                  <td className="py-4 px-5 text-gray-900 break-words">{v}</td>
                </tr>
              ))}
              {p.nutrition && Object.entries(p.nutrition)
                .filter(([k, v]) => v && k !== 'calories' && k !== 'saturatedFat')
                .map(([k, v]) => (
                  <tr key={k} className="border-b border-gray-200">
                    <th className="w-48 py-4 px-5 bg-[#F8F8FA] text-left font-medium text-gray-600">
                      {{ sodium: '나트륨', carbs: '탄수화물', sugar: '당류', fat: '지방', transFat: '트랜스지방', satFat: '포화지방', cholesterol: '콜레스테롤', protein: '단백질' }[k] || k}
                    </th>
                    <td className="py-4 px-5 text-gray-900">{String(v)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* 같은 카테고리 상품 */}
        {related.length > 0 && (
          <div className="pt-20">
            <h2 className="text-[22px] font-bold text-gray-900 mb-6">함께 보면 좋은 {p.category}</h2>
            <div className="grid grid-cols-5 gap-x-5 gap-y-10">
              {related.map(x => <PcProductCard key={x.id} product={x} />)}
            </div>
          </div>
        )}
      </PcContainer>
    </div>
  );
};
