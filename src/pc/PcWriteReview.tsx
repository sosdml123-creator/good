import React, { useMemo, useRef, useState } from 'react';
import { Camera, Check, Loader2, PlusCircle, Search, Star, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory } from '../types';
import { NewProductRequestModal } from '../components/review/NewProductRequestModal';
import { ImageViewerModal } from '../components/common/ImageViewerModal';
import { compressAndResizeImage } from '../utils/imageCompressor';
import { formatProductPrice } from '../utils/formatters';
import { PcContainer } from './PcUi';

const REPURCHASE_OPTIONS = [
  { value: '다시는 안 사먹을래요', emoji: '👎', label: '안 살래요' },
  { value: '누가 주면 먹을듯', emoji: '💧', label: '글쎄요' },
  { value: '한 번 먹어본 걸로 만족', emoji: '😐', label: '보통' },
  { value: '행사/할인하면 살래요', emoji: '😊', label: '할인하면' },
  { value: '무조건 또 사먹어요!', emoji: '🤩', label: '무조건!' },
];

const SEARCH_CATEGORIES: (ProductCategory | '전체')[] = [
  '전체', '과자', '음료', '빵·디저트', '아이스크림', '간편식', '패스트푸드', '과일', '식재료', '고기·수산',
];

const RATING_TEXT = ['', '많이 아쉬워요', '기대에는 조금 못 미쳐요', '무난하고 평범해요', '맛있고 기대 이상이에요', '정말 최고예요! 강력 추천'];

type MetricDef = [label: string, desc: string];

/** 상품 종류별 세부 평가 항목 4개 (모바일 리뷰 작성과 같은 기준, 순서대로 taste·value·portion·repurchase에 저장) */
const getMetricDefs = (prod: Product | null): MetricDef[] => {
  const cat = prod?.category || '';
  const name = prod?.name || '';
  const sub = prod?.subCategory || '';
  const has = (...kw: string[]) => kw.some(k => name.includes(k) || sub.includes(k));
  const last = (what: string): MetricDef => ['재구매 의사', `다시 사먹고 싶은 ${what}인가요?`];

  if (has('커피', '라떼', '아메리카노', '콜드브루', '에스프레소', '카페')) {
    return [['맛', '커피 맛과 풍미가 뛰어난가요?'], ['산미', '산미가 기분 좋게 느껴지나요?'], ['고소함·향', '고소함과 원두 향이 풍부한가요?'], ['재구매 의사', '다시 사마시고 싶은 커피인가요?']];
  }
  if (has('라면', '국수', '우동', '짬뽕', '파스타', '냉면')) {
    return [['맛', '국물/소스와 전반적인 맛이 훌륭한가요?'], ['면발·식감', '면이 쫄깃하고 조화로운가요?'], ['매운맛·얼큰함', '맵기와 국물 감칠맛이 적당한가요?'], last('라면')];
  }
  if (has('아이스크림', '빙수', '젤라또') && cat !== '과자') {
    return [['맛', '달콤하고 재료 본연의 맛이 진한가요?'], ['부드러움·식감', '입에서 부드럽게 녹나요?'], ['가성비·양', '가격 대비 용량이 만족스러운가요?'], last('아이스크림')];
  }
  if (['과일', '고기·수산', '식재료'].includes(cat) || name.includes('수박') || name.includes('과일')) {
    return [['맛', '당도와 본연의 풍미가 뛰어난가요?'], ['신선도', '싱싱하고 신선한가요?'], ['식감', '아삭함/부드러움 식감이 좋은가요?'], ['재구매 의사', '다시 구매하고 싶을 정도인가요?']];
  }
  if (cat === '음료') {
    return [['맛', '음료 맛과 풍미가 뛰어난가요?'], ['청량감·목넘김', '청량하고 목넘김이 깔끔한가요?'], ['단맛 밸런스', '너무 달지 않고 적당한가요?'], ['재구매 의사', '다시 사마시고 싶은 음료인가요?']];
  }
  if (cat === '과자') {
    return [['맛', '단짠 조화와 스낵 맛이 훌륭한가요?'], ['바삭함·식감', '바삭바삭 식감이 살아있나요?'], ['양·가성비', '질소 없이 알차고 가성비가 좋은가요?'], last('과자')];
  }
  if (cat === '빵·디저트') {
    return [['맛', '디저트 본연의 맛이 뛰어난가요?'], ['촉촉함·식감', '촉촉하고 부드러운가요?'], ['크림·속재료', '속재료가 알차게 들어있나요?'], last('디저트')];
  }
  if (['간편식', '패스트푸드'].includes(cat)) {
    return [['맛', '입맛에 딱 맞고 맛있는가요?'], ['푸짐함·양', '한 끼 식사로 알차고 푸짐한가요?'], ['조리 편의성', '데우거나 먹기 편리한가요?'], last('상품')];
  }
  return [['맛', '전반적인 맛이 훌륭한가요?'], ['식감·특징', '식감이나 특징이 인상적인가요?'], ['가성비·양', '가격과 양이 만족스러운가요?'], ['재구매 의사', '다시 사먹고 싶을 정도인가요?']];
};

const StarRow: React.FC<{ value: number; onChange: (v: number) => void; size: string }> = ({ value, onChange, size }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(star => (
      <button key={star} type="button" onClick={() => onChange(star)} className="p-0.5 cursor-pointer" aria-label={`${star}점`}>
        <Star className={`${size} ${star <= value ? 'fill-amber-400 text-amber-400' : 'fill-gray-100 text-gray-200 hover:text-amber-200'}`} />
      </button>
    ))}
  </div>
);

/** PC 리뷰 쓰기: 왼쪽 상품 검색 · 오른쪽 작성 폼 (모바일 리뷰 작성과 별도) */
export const PcWriteReview: React.FC = () => {
  const { products, selectedProductId, submitReview, showToast } = useApp();

  const [productId, setProductId] = useState<string | null>(selectedProductId || null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ProductCategory | '전체'>('전체');
  const [limit, setLimit] = useState(30);
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);

  const [rating, setRating] = useState(5);
  const [metrics, setMetrics] = useState([0, 0, 0, 0]);
  const [repurchase, setRepurchase] = useState('무조건 또 사먹어요!');
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const prod = useMemo(() => products.find(p => p.id === productId) ?? null, [products, productId]);
  const metricDefs = useMemo(() => getMetricDefs(prod), [prod]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(p =>
      (category === '전체' || p.category === category) &&
      (!q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.subCategory?.toLowerCase().includes(q)));
  }, [products, query, category]);

  const unrated = metricDefs.filter((_, i) => metrics[i] === 0);
  const isTextValid = text.trim().length >= 5;
  const isFormValid = !!prod && unrated.length === 0 && isTextValid;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const slots = 5 - images.length;
    if (slots <= 0) {
      showToast('사진은 최대 5장까지 등록 가능합니다.', 'info');
      e.target.value = '';
      return;
    }
    setIsCompressing(true);
    try {
      const urls = await Promise.all(Array.from(files).slice(0, slots).map(file =>
        compressAndResizeImage(file, { maxWidth: 1024, maxHeight: 1024, quality: 0.8, mimeType: 'image/jpeg' })));
      setImages(prev => [...prev, ...urls].slice(0, 5));
    } catch (err) {
      console.error('Image compression failed:', err);
      showToast('사진을 처리하는 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsCompressing(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!prod) return showToast('먼저 왼쪽에서 리뷰할 상품을 선택해 주세요.', 'error');
    if (unrated.length > 0) return showToast(`세부 별점을 모두 선택해 주세요. (${unrated.map(m => m[0]).join(', ')})`, 'error');
    if (!isTextValid) {
      textRef.current?.focus();
      return showToast('맛 후기를 5자 이상 작성해 주세요.', 'error');
    }
    setIsSubmitting(true);
    try {
      await submitReview(
        prod.id,
        rating,
        { taste: metrics[0], value: metrics[1], portion: metrics[2], repurchase: metrics[3] },
        text.trim().slice(0, 300),
        images,
        [],
        { repurchaseIntent: repurchase },
      );
    } catch {
      showToast('리뷰 등록 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F5F5F7]">
      <PcContainer className="py-12">
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">리뷰 쓰기</h1>
        <p className="mt-1.5 text-[14px] text-gray-500">먹어 본 신상의 솔직한 평가를 남겨 주세요. 정성스러운 후기는 다른 분들께 큰 도움이 됩니다.</p>

        <div className="mt-8 grid grid-cols-[420px_1fr] gap-8 items-start">
          {/* 상품 선택 */}
          <section className="bg-white rounded-2xl border border-gray-200 flex flex-col h-[760px] sticky top-6">
            <div className="p-5 border-b border-gray-100">
              <p className="text-[16px] font-bold text-gray-900">1. 상품 선택</p>
              <div className="mt-3 relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={e => { setQuery(e.target.value); setLimit(30); }}
                  placeholder="상품명, 브랜드 검색"
                  className="w-full h-11 pl-10 pr-9 rounded-xl border border-gray-200 text-[14px] outline-none focus:border-gray-900"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" aria-label="지우기">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {SEARCH_CATEGORIES.map(c => (
                  <button
                    key={c}
                    onClick={() => { setCategory(c); setLimit(30); }}
                    className={`h-7 px-3 rounded-full text-[12px] cursor-pointer ${category === c ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <ul className="flex-1 overflow-y-auto">
              {filtered.slice(0, limit).map(item => {
                const on = item.id === productId;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setProductId(item.id)}
                      className={`w-full px-5 py-3 flex items-center gap-3 text-left cursor-pointer ${on ? 'bg-violet-50' : 'hover:bg-gray-50'}`}
                    >
                      <img src={item.image} alt="" loading="lazy" className="w-12 h-12 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0" />
                      <span className="flex-1 min-w-0">
                        <span className="block text-[12px] text-gray-500 truncate">{item.brand} · {item.category}</span>
                        <span className="block text-[14px] font-medium text-gray-900 truncate">{item.name}</span>
                      </span>
                      {on && <Check className="w-5 h-5 text-violet-600 shrink-0" />}
                    </button>
                  </li>
                );
              })}
              {filtered.length > limit && (
                <li className="p-4 text-center">
                  <button onClick={() => setLimit(v => v + 30)} className="h-9 px-5 rounded-full border border-gray-200 text-[13px] text-gray-700 hover:bg-gray-50 cursor-pointer">
                    더보기 ({limit} / {filtered.length})
                  </button>
                </li>
              )}
              {filtered.length === 0 && <li className="py-16 text-center text-[14px] text-gray-400">일치하는 상품이 없습니다.</li>}
            </ul>
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-[13px]">
              <span className="text-gray-500">찾는 상품이 없나요?</span>
              <button onClick={() => setIsNewProductOpen(true)} className="flex items-center gap-1 font-semibold text-violet-700 hover:underline cursor-pointer">
                <PlusCircle className="w-4 h-4" />
                상품 등록 요청
              </button>
            </div>
          </section>

          {/* 작성 폼 */}
          <section className="bg-white rounded-2xl border border-gray-200 p-8 space-y-9 min-w-0">
            {prod ? (
              <div className="flex items-center gap-4 pb-7 border-b border-gray-100">
                <img src={prod.image} alt="" className="w-20 h-20 rounded-xl object-cover bg-gray-50 border border-gray-100" />
                <div className="min-w-0">
                  <p className="text-[13px] text-gray-500">{prod.brand} · {prod.category}</p>
                  <p className="mt-0.5 text-[19px] font-bold text-gray-900 truncate">{prod.name}</p>
                  <p className="mt-0.5 text-[14px] font-semibold text-gray-700">{formatProductPrice(prod.price)}</p>
                </div>
              </div>
            ) : (
              <p className="py-6 rounded-xl border-2 border-dashed border-gray-200 text-center text-[15px] text-gray-500">
                왼쪽 목록에서 리뷰할 상품을 선택해 주세요.
              </p>
            )}

            <div>
              <p className="text-[16px] font-bold text-gray-900">2. 종합 만족도</p>
              <div className="mt-3 flex items-center gap-4">
                <StarRow value={rating} onChange={setRating} size="w-9 h-9" />
                <span className="text-[15px] font-semibold text-amber-700">{RATING_TEXT[rating]}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-[16px] font-bold text-gray-900">3. 세부 평가</p>
                <span className={`text-[13px] font-semibold ${unrated.length === 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {unrated.length === 0 ? '4개 평가 완료' : `${unrated.length}개 남음`}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {metricDefs.map(([label, desc], i) => (
                  <div key={label} className={`rounded-xl border p-4 ${metrics[i] === 0 ? 'border-gray-200' : 'border-amber-200 bg-amber-50/40'}`}>
                    <p className="text-[15px] font-semibold text-gray-900">{label}</p>
                    <p className="mt-0.5 text-[12px] text-gray-500">{desc}</p>
                    <div className="mt-2">
                      <StarRow value={metrics[i]} onChange={v => setMetrics(prev => prev.map((m, j) => (j === i ? (m === v ? 0 : v) : m)))} size="w-6 h-6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[16px] font-bold text-gray-900">4. 다시 구매하시겠어요?</p>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {REPURCHASE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setRepurchase(opt.value)}
                    className={`h-20 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      repurchase === opt.value ? 'border-gray-900 ring-1 ring-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <span className="text-[24px]">{opt.emoji}</span>
                    <span className="text-[13px] font-semibold text-gray-800">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-[16px] font-bold text-gray-900">5. 맛 후기</p>
                <span className={`text-[13px] ${text.length >= 300 ? 'text-rose-500' : 'text-gray-400'}`}>{text.length} / 300자</span>
              </div>
              <textarea
                ref={textRef}
                rows={6}
                maxLength={300}
                value={text}
                onChange={e => setText(e.target.value.slice(0, 300))}
                placeholder="포장을 뜯었을 때 향, 첫맛과 식감, 양, 가성비, 어울리는 음료나 간식을 솔직하게 적어 주세요. (5자 이상)"
                className="mt-3 w-full rounded-xl border border-gray-200 p-4 text-[15px] leading-relaxed outline-none resize-none focus:border-gray-900"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-[16px] font-bold text-gray-900">6. 사진 <span className="text-[13px] font-normal text-gray-400">(선택)</span></p>
                <span className="text-[13px] text-gray-400">{images.length} / 5장</span>
              </div>
              <input type="file" ref={fileInputRef} accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              <div className="mt-3 flex flex-wrap gap-3">
                {images.map((src, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
                    <button onClick={() => setViewerIndex(i)} className="w-full h-full cursor-zoom-in">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                    <button
                      onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-rose-500 cursor-pointer"
                      aria-label="사진 삭제"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isCompressing}
                    className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-400 flex flex-col items-center justify-center gap-1 text-gray-500 cursor-pointer disabled:opacity-60"
                  >
                    {isCompressing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                    <span className="text-[12px]">{isCompressing ? '처리 중' : '사진 추가'}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="pt-7 border-t border-gray-100 flex items-center justify-between gap-6">
              <p className="text-[13px] text-gray-500">
                {isFormValid
                  ? '필수 항목을 모두 작성했어요.'
                  : [!prod && '상품 선택', unrated.length > 0 && `세부 별점 ${unrated.length}개`, !isTextValid && '맛 후기 5자 이상']
                    .filter(Boolean).join(' · ') + '이(가) 필요해요.'}
              </p>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`h-13 px-10 py-3.5 rounded-xl text-[15px] font-bold text-white flex items-center gap-2 cursor-pointer disabled:bg-gray-300 ${
                  isFormValid ? 'bg-violet-600 hover:bg-violet-700' : 'bg-gray-900 hover:bg-black'
                }`}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? '등록 중...' : '리뷰 등록하기'}
              </button>
            </div>
          </section>
        </div>
      </PcContainer>

      <NewProductRequestModal
        isOpen={isNewProductOpen}
        onClose={() => setIsNewProductOpen(false)}
        initialProductName={query}
        initialCategory={category}
      />
      <ImageViewerModal
        isOpen={viewerIndex !== null}
        images={images}
        initialIndex={viewerIndex ?? 0}
        title={prod?.name || '리뷰 첨부 사진'}
        onClose={() => setViewerIndex(null)}
      />
    </div>
  );
};
