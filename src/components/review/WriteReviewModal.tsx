import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, 
  Camera, 
  Star, 
  X, 
  Check, 
  Search, 
  Store, 
  AlertCircle,
  Tag,
  ShoppingBag,
  Heart,
  Award,
  LayoutGrid,
  List,
  Sparkles,
  PlusCircle
} from 'lucide-react';
import { ProductCategory } from '../../types';
import { NewProductRequestModal } from './NewProductRequestModal';

// 구매처 목록 & 브랜드 디테일
const PURCHASE_PLACES = [
  { id: 'GS25', name: 'GS25', badge: 'GS25', bgActive: 'bg-cyan-50 border-cyan-500 text-cyan-800 ring-2 ring-cyan-400/30', badgeBg: 'bg-cyan-500 text-white' },
  { id: 'CU', name: 'CU', badge: 'CU', bgActive: 'bg-purple-50 border-purple-500 text-purple-800 ring-2 ring-purple-400/30', badgeBg: 'bg-purple-600 text-white' },
  { id: '세븐일레븐', name: '7-11', badge: '7-11', bgActive: 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-400/30', badgeBg: 'bg-emerald-600 text-white' },
  { id: '이마트24', name: 'emart24', badge: 'e24', bgActive: 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-400/30', badgeBg: 'bg-amber-500 text-white' },
  { id: '마켓컬리', name: '마켓컬리', badge: '컬리', bgActive: 'bg-fuchsia-50 border-fuchsia-500 text-fuchsia-800 ring-2 ring-fuchsia-400/30', badgeBg: 'bg-fuchsia-600 text-white' },
  { id: '쿠팡', name: '쿠팡', badge: '쿠팡', bgActive: 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-400/30', badgeBg: 'bg-rose-500 text-white' },
  { id: '대형마트', name: '대형마트', badge: '마트', bgActive: 'bg-blue-50 border-blue-500 text-blue-800 ring-2 ring-blue-400/30', badgeBg: 'bg-blue-600 text-white' },
  { id: '배민B마트', name: '배민B마트', badge: 'B마트', bgActive: 'bg-teal-50 border-teal-500 text-teal-800 ring-2 ring-teal-400/30', badgeBg: 'bg-teal-600 text-white' },
  { id: '동네슈퍼/기타', name: '동네/기타', badge: '기타', bgActive: 'bg-slate-100 border-slate-600 text-slate-900 ring-2 ring-slate-400/30', badgeBg: 'bg-slate-700 text-white' },
];

// 구매 혜택 / 행사 조건
const PURCHASE_EVENTS = [
  { id: '정가 구매', label: '정가 구매', icon: '🏷️' },
  { id: '1+1 행사', label: '1+1 득템', icon: '🎁' },
  { id: '2+1 행사', label: '2+1 행사', icon: '✌️' },
  { id: '깜짝할인/특가', label: '특가 타임', icon: '🔥' },
  { id: '무료체험/선물', label: '무료/선물', icon: '✨' }
];

// 재구매 의사 5단계
const REPURCHASE_OPTIONS = [
  { 
    value: '무조건 또 사먹어요!', 
    emoji: '🤩', 
    label: '적극추천',
    desc: '매일 사먹고 싶어요!',
    theme: 'border-emerald-500 bg-emerald-500 text-white shadow-emerald-200'
  },
  { 
    value: '행사/할인하면 살래요', 
    emoji: '😊', 
    label: '할인추천',
    desc: '세일하면 꼭 살래요',
    theme: 'border-teal-500 bg-teal-500 text-white shadow-teal-200'
  },
  { 
    value: '한 번 먹어본 걸로 만족', 
    emoji: '😐', 
    label: '보통',
    desc: '한 번쯤 경험으로!',
    theme: 'border-amber-500 bg-amber-500 text-white shadow-amber-200'
  },
  { 
    value: '누가 주면 먹을듯', 
    emoji: '💧', 
    label: '글쎄요',
    desc: '내 돈 내고는 음...',
    theme: 'border-orange-500 bg-orange-500 text-white shadow-orange-200'
  },
  { 
    value: '다시는 안 사먹을래요', 
    emoji: '👎', 
    label: '비추천',
    desc: '제 입맛엔 안맞아요',
    theme: 'border-rose-500 bg-rose-500 text-white shadow-rose-200'
  },
];

// 맛 프로필 옵션
const FLAVOR_OPTIONS = {
  sweetness: [
    { label: '안 달아요', icon: '🍃' },
    { label: '은은한 단맛', icon: '🍵' },
    { label: '적당한 달콤함', icon: '🍯' },
    { label: '아주 달아요', icon: '🍰' },
  ],
  spiciness: [
    { label: '안 매워요', icon: '🥛' },
    { label: '살짝 매콤', icon: '🌱' },
    { label: '신라면 수준', icon: '🌶️' },
    { label: '불닭급 매움', icon: '🔥' },
  ],
  texture: [
    { label: '바삭바삭', icon: '🥨' },
    { label: '쫀득/꾸덕', icon: '🍮' },
    { label: '부드러움', icon: '🍦' },
    { label: '아삭아삭', icon: '🍎' },
    { label: '촉촉함', icon: '💧' },
  ],
};

// 추천 대상 태그
const RECOMMEND_TARGET_TAGS = [
  { tag: '#단짠러버', emoji: '🍿' },
  { tag: '#야식혼술족', emoji: '🍺' },
  { tag: '#다이어터/저당', emoji: '🥗' },
  { tag: '#아이들간식', emoji: '👧' },
  { tag: '#가성비족', emoji: '💰' },
  { tag: '#맵부심', emoji: '🔥' },
  { tag: '#홈카페디저트', emoji: '☕' },
  { tag: '#신상얼리어답터', emoji: '⚡' },
  { tag: '#단백질충전', emoji: '💪' },
  { tag: '#칼로리폭탄', emoji: '💣' }
];

const SEARCH_CATEGORIES: (ProductCategory | '전체')[] = [
  '전체', '과자', '음료', '빵·디저트', '간편식', '패스트푸드', '과일', '식재료', '고기·수산'
];

export const WriteReviewModal: React.FC = () => {
  const { products, selectedProductId, submitReview, goBack, showToast } = useApp();

  // 1. 상품 선택 상태
  const [currentProductId, setCurrentProductId] = useState<string | null>(selectedProductId || null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(!selectedProductId);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchCategory, setSelectedSearchCategory] = useState<ProductCategory | '전체'>('전체');
  
  // 모달 성능 렉 방지용 페이지네이션 & 뷰 모드
  const [displayLimit, setDisplayLimit] = useState<number>(24);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // 2. 리뷰 평가 데이터
  const [rating, setRating] = useState(5);
  const [metric1, setMetric1] = useState(5);
  const [metric2, setMetric2] = useState(5);
  const [metric3, setMetric3] = useState(4);
  const [metric4, setMetric4] = useState(5);

  // 3. 확장 메타데이터
  const [purchasePlace, setPurchasePlace] = useState<string>('GS25');
  const [purchaseEvent, setPurchaseEvent] = useState<string>('정가 구매');
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [repurchaseIntent, setRepurchaseIntent] = useState<string>('무조건 또 사먹어요!');
  const [headline, setHeadline] = useState<string>('');
  const [selectedSweetness, setSelectedSweetness] = useState<string>('');
  const [selectedSpiciness, setSelectedSpiciness] = useState<string>('');
  const [selectedTexture, setSelectedTexture] = useState<string>('');
  const [selectedTargets, setSelectedTargets] = useState<string[]>(['#신상얼리어답터']);

  // 4. 본문 & 사진
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 현재 선택된 상품 객체
  const prod = useMemo(() => {
    if (!currentProductId) return null;
    return products.find(p => p.id === currentProductId) || null;
  }, [products, currentProductId]);

  // 검색 필터 변경 시 표시 제한 초기화 (성능 최적화)
  useEffect(() => {
    setDisplayLimit(24);
  }, [searchQuery, selectedSearchCategory]);

  // 상품 카테고리별 세부 평가 항목
  const categoryMetrics = useMemo(() => {
    const cat = prod?.category || '';
    const name = prod?.name || '';

    if (['과일', '고기·수산', '식재료'].includes(cat) || name.includes('수박') || name.includes('과일')) {
      return [
        { label: '신선도', val: metric1, set: setMetric1, desc: '싱싱하고 신선한가요?' },
        { label: '당도·풍미', val: metric2, set: setMetric2, desc: '달콤하고 풍미가 풍부한가요?' },
        { label: '식감', val: metric3, set: setMetric3, desc: '아삭아삭 식감이 좋은가요?' },
        { label: '가성비', val: metric4, set: setMetric4, desc: '가격 대비 훌륭한가요?' },
      ];
    }
    if (cat === '음료') {
      return [
        { label: '맛·풍미', val: metric1, set: setMetric1, desc: '음료 맛과 풍미가 뛰어난가요?' },
        { label: '목넘김', val: metric2, set: setMetric2, desc: '청량하고 목넘김이 깔끔한가요?' },
        { label: '양·용량', val: metric3, set: setMetric3, desc: '마시기에 든든한 용량인가요?' },
        { label: '가성비', val: metric4, set: setMetric4, desc: '가격 대비 만점인가요?' },
      ];
    }
    if (['과자', '빵·디저트'].includes(cat)) {
      return [
        { label: '바삭함·식감', val: metric1, set: setMetric1, desc: '바삭하거나 꾸덕함이 인상적인가요?' },
        { label: '단짠·풍미', val: metric2, set: setMetric2, desc: '양념과 단짠 밸런스가 최고인가요?' },
        { label: '양·구성', val: metric3, set: setMetric3, desc: '질소 없이 푸짐하게 들었나요?' },
        { label: '가성비', val: metric4, set: setMetric4, desc: '가격 대비 만족스럽나요?' },
      ];
    }
    if (['간편식', '패스트푸드'].includes(cat)) {
      return [
        { label: '맛·양념', val: metric1, set: setMetric1, desc: '입맛에 딱 맞고 맛있는가요?' },
        { label: '조리 편의성', val: metric2, set: setMetric2, desc: '데우거나 섭취하기 편리한가요?' },
        { label: '양·푸짐함', val: metric3, set: setMetric3, desc: '한 끼 식사로 든든한가요?' },
        { label: '가성비', val: metric4, set: setMetric4, desc: '가격 대비 만족스럽나요?' },
      ];
    }
    return [
      { label: '맛', val: metric1, set: setMetric1, desc: '전반적인 맛이 훌륭한가요?' },
      { label: '가성비', val: metric2, set: setMetric2, desc: '가격 대비 만족스럽나요?' },
      { label: '양', val: metric3, set: setMetric3, desc: '양과 내용물이 푸짐한가요?' },
      { label: '재구매 의사', val: metric4, set: setMetric4, desc: '다시 사먹고 싶을 정도인가요?' },
    ];
  }, [prod, metric1, metric2, metric3, metric4]);

  // 검색 결과 필터링
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedSearchCategory === '전체' || p.category === selectedSearchCategory;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchCat;
      const matchText = 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(q));
      return matchCat && matchText;
    });
  }, [products, searchQuery, selectedSearchCategory]);

  // 성능 최적화된 렌더링 목록 (slice 적용)
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, displayLimit);
  }, [filteredProducts, displayLimit]);

  // 사진 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 5 - images.length;
    if (remainingSlots <= 0) {
      showToast('사진은 최대 5장까지 등록 가능합니다.', 'info');
      return;
    }

    const filesToRead = Array.from(files).slice(0, remainingSlots);

    filesToRead.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string].slice(0, 5));
          showToast('📸 사진이 첨부되었습니다.', 'success');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const toggleTarget = (tag: string) => {
    if (selectedTargets.includes(tag)) {
      setSelectedTargets(prev => prev.filter(t => t !== tag));
    } else {
      if (selectedTargets.length >= 4) {
        showToast('추천 대상은 최대 4개까지 선택 가능합니다.', 'info');
        return;
      }
      setSelectedTargets(prev => [...prev, tag]);
    }
  };

  // 제출 처리
  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!prod) {
      showToast('리뷰를 작성할 상품을 먼저 검색해서 선택해주세요.', 'info');
      setIsSearchModalOpen(true);
      return;
    }

    if (!text.trim() || text.trim().length < 5) {
      showToast('솔직한 맛 후기를 최소 5자 이상 작성해주세요.', 'info');
      return;
    }

    if (text.length > 300) {
      showToast('리뷰는 최대 300자까지 작성 가능합니다.', 'info');
      return;
    }

    setIsSubmitting(true);
    try {
      const extraTags = [
        ...selectedTargets,
        `#${purchasePlace}`,
        purchaseEvent ? `#${purchaseEvent}` : '',
      ].filter(Boolean);

      await submitReview(
        prod.id,
        rating,
        { taste: metric1, value: metric2, portion: metric3, repurchase: metric4 },
        text.trim().slice(0, 300),
        images.length > 0 ? images : [prod.image],
        extraTags,
        {
          purchasePlace,
          purchaseEvent,
          purchasePrice: purchasePrice ? Number(purchasePrice.replace(/[^0-9]/g, '')) : undefined,
          repurchaseIntent,
          headline: headline.trim() || undefined,
          flavorProfile: {
            sweetness: selectedSweetness || undefined,
            spiciness: selectedSpiciness || undefined,
            texture: selectedTexture || undefined,
          },
          recommendTargets: selectedTargets,
        }
      );
    } catch (err) {
      showToast('리뷰 등록 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-full pb-24 font-sans text-gray-900">
      {/* 1. Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 py-3 shadow-2xs">
        <button onClick={goBack} className="p-1.5 -ml-1.5 text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-100 active:scale-95 transition-all">
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
        </button>
        <div className="text-center">
          <span className="text-[15px] font-black text-gray-900 block leading-tight tracking-tight">신상 솔직 리뷰 작성</span>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting || !prod}
          className={`text-xs font-black px-4 py-1.5 rounded-full transition-all duration-200 ${
            isSubmitting || !prod
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white shadow-sm hover:bg-black active:scale-95'
          }`}
        >
          {isSubmitting ? '등록중' : '등록 완료'}
        </button>
      </div>

      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* 3. 상품 선택 / 검색 섹션 */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-gray-700 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-gray-900" />
              리뷰 대상 상품
            </span>
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="text-[11px] font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full flex items-center gap-1 transition-colors active:scale-95"
            >
              <Search className="w-3 h-3 text-gray-500" />
              {prod ? '상품 변경' : '상품 선택'}
            </button>
          </div>

          {prod ? (
            <div 
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100 border border-slate-200/80 cursor-pointer transition-all group active:scale-[0.99]"
            >
              <img 
                src={prod.image} 
                alt={prod.name} 
                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-200 bg-white shadow-2xs" 
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
                    {prod.category}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium truncate">{prod.brand}</span>
                </div>
                <div className="text-xs font-black text-gray-900 mt-1 truncate group-hover:text-amber-600 transition-colors">
                  {prod.name}
                </div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">
                  {prod.price.toLocaleString()}원
                </div>
              </div>
              <span className="text-xs text-slate-400 font-bold group-hover:text-slate-900 shrink-0">
                변경 &gt;
              </span>
            </div>
          ) : (
            <div 
              onClick={() => setIsSearchModalOpen(true)}
              className="border-2 border-dashed border-gray-200 bg-slate-50/50 rounded-xl p-5 text-center cursor-pointer hover:bg-slate-100/80 hover:border-gray-300 transition-all active:scale-[0.99]"
            >
              <Search className="w-8 h-8 text-gray-400 mx-auto mb-2 stroke-[1.5]" />
              <div className="text-xs font-black text-gray-900">어떤 신상품을 드셔보셨나요?</div>
              <p className="text-[11px] text-gray-500 mt-1">터치하여 리뷰할 상품을 검색해 선택해주세요</p>
            </div>
          )}
        </div>

        {/* 4. 사진 첨부 섹션 */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-gray-900 flex items-center gap-1.5">
              📸 생생한 사진 첨부
            </span>
            <span className="text-xs font-bold text-gray-400">{images.length} / 5장</span>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            multiple 
            onChange={handleImageUpload} 
            className="hidden" 
          />

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 hover:border-gray-400 flex flex-col items-center justify-center text-gray-500 gap-1 shrink-0 bg-slate-50/60 hover:bg-slate-100 transition-all active:scale-95"
            >
              <Camera className="w-5 h-5 text-gray-400" />
              <span className="text-[11px] font-black text-gray-600">사진 추가</span>
            </button>

            {images.map((imgSrc, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 shrink-0 shadow-2xs group">
                <img src={imgSrc} alt="preview" className="w-full h-full object-cover" />
                {idx === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 bg-black/75 backdrop-blur-xs text-amber-300 text-[9px] font-black px-1.5 py-0.5 rounded-md">
                    대표
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center text-[10px] hover:bg-rose-500 transition-colors shadow-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 5. 종합 만족도 별점 */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 text-center">
          <div className="text-xs font-black text-gray-500 mb-1">종합 만족도 평점</div>
          <div className="flex items-center justify-center gap-2 py-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 transition-all duration-150 hover:scale-115 active:scale-125 focus:outline-none"
              >
                <Star
                  className={`w-9 h-9 transition-colors ${
                    star <= rating
                      ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                      : 'fill-gray-100 text-gray-200'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="text-center text-xs font-black text-gray-900 mt-1 bg-amber-50/70 text-amber-900 py-1.5 px-3 rounded-full inline-block border border-amber-200/50">
            {rating === 5 ? '정말 최고예요! 무조건 강력 추천 ⭐⭐⭐⭐⭐' : 
             rating === 4 ? '맛있고 기대 이상이에요 👍' : 
             rating === 3 ? '무난하고 평범해요 😐' : 
             rating === 2 ? '기대에는 조금 못 미쳐요 💦' : '많이 아쉬워요 😢'}
          </div>
        </div>

        {/* 6. 어디서 구매하셨나요? */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-gray-900 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              어디서 구매하셨나요?
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              필수 선택
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {PURCHASE_PLACES.map((place) => {
              const isSelected = purchasePlace === place.id;
              return (
                <button
                  type="button"
                  key={place.id}
                  onClick={() => setPurchasePlace(place.id)}
                  className={`relative py-2.5 px-2 rounded-xl text-xs font-black border transition-all duration-200 flex flex-col items-center justify-center gap-1.5 active:scale-95 ${
                    isSelected
                      ? `${place.bgActive} shadow-xs font-black scale-[1.02]`
                      : 'bg-slate-50/70 text-gray-600 border-gray-200/80 hover:bg-slate-100 hover:border-gray-300'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${isSelected ? place.badgeBg : 'bg-gray-200 text-gray-700'}`}>
                    {place.badge}
                  </span>
                  <span className="text-xs">{place.name}</span>
                </button>
              );
            })}
          </div>

          {/* 구매 행사 & 구매 가격 */}
          <div className="pt-3 border-t border-gray-100 space-y-2.5">
            <div className="text-[11px] font-black text-gray-600 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-gray-500" />
              구매 조건 / 혜택
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PURCHASE_EVENTS.map((evt) => {
                const isSelected = purchaseEvent === evt.id;
                return (
                  <button
                    type="button"
                    key={evt.id}
                    onClick={() => setPurchaseEvent(evt.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 flex items-center gap-1 active:scale-95 ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-2 ring-slate-900/20'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>{evt.icon}</span>
                    <span>{evt.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-gray-500 font-bold shrink-0">실제 구매가</span>
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={prod ? `${prod.price.toLocaleString()} (선택입력)` : '구매금액 (선택입력)'}
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-900 outline-none focus:border-slate-900 focus:bg-white transition-colors"
                />
              </div>
              <span className="text-xs text-gray-600 font-bold shrink-0">원</span>
            </div>
          </div>
        </div>

        {/* 7. 재구매 의사 */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-gray-900 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              다시 구매하시겠어요?
            </span>
            <span className="text-[10px] text-gray-400 font-medium">솔직한 평가</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {REPURCHASE_OPTIONS.map((opt) => {
              const isSelected = repurchaseIntent === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setRepurchaseIntent(opt.value)}
                  className={`p-2 rounded-xl flex flex-col items-center justify-between gap-1 border transition-all duration-200 active:scale-95 min-h-[76px] ${
                    isSelected
                      ? `${opt.theme} ring-2 ring-slate-900/10 scale-[1.04] shadow-md`
                      : 'bg-slate-50/60 border-gray-200/80 text-gray-600 hover:bg-slate-100 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl drop-shadow-2xs transition-transform duration-200">{opt.emoji}</span>
                  <span className="text-[10px] font-black text-center leading-tight">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-center text-xs font-bold text-gray-700 bg-slate-50 py-2 px-3 rounded-xl border border-slate-100 flex items-center justify-center gap-1.5">
            <span>선택한 의견:</span>
            <span className="text-slate-900 font-black underline underline-offset-2">{repurchaseIntent}</span>
          </div>
        </div>

        {/* 8. 핵심 한 줄 요약평 */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-gray-900 flex items-center gap-1.5">
              ✍️ 핵심 한 줄 평
            </span>
            <span className="text-[10px] text-gray-400 font-medium">피드 강조 문구</span>
          </div>
          <input
            type="text"
            maxLength={40}
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="예: 크림이 진짜 가득 차있어서 인생 빵 등극!"
            className="w-full bg-slate-50/70 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 font-bold outline-none placeholder-gray-400 focus:border-slate-900 focus:bg-white transition-colors"
          />
        </div>

        {/* 9. 맛 & 식감 디테일 프로필 */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-gray-900 flex items-center gap-1.5">
              👅 맛 & 식감 상세 프로필
            </span>
            <span className="text-[10px] text-gray-400 font-medium">선택사항</span>
          </div>

          {/* 단맛 */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-black text-gray-600 flex items-center gap-1">
              <span>🍯</span> 단맛의 정도
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {FLAVOR_OPTIONS.sweetness.map((s) => {
                const isSelected = selectedSweetness === s.label;
                return (
                  <button
                    type="button"
                    key={s.label}
                    onClick={() => setSelectedSweetness(isSelected ? '' : s.label)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all duration-150 flex items-center justify-center gap-1 active:scale-95 ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs font-black ring-2 ring-amber-400/30'
                        : 'bg-slate-50/70 text-gray-600 border-gray-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs">{s.icon}</span>
                    <span className="text-[11px] truncate">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 매운맛 */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-black text-gray-600 flex items-center gap-1">
              <span>🌶️</span> 매운맛의 정도
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {FLAVOR_OPTIONS.spiciness.map((sp) => {
                const isSelected = selectedSpiciness === sp.label;
                return (
                  <button
                    type="button"
                    key={sp.label}
                    onClick={() => setSelectedSpiciness(isSelected ? '' : sp.label)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all duration-150 flex items-center justify-center gap-1 active:scale-95 ${
                      isSelected
                        ? 'bg-rose-600 text-white border-rose-700 shadow-xs font-black ring-2 ring-rose-400/30'
                        : 'bg-slate-50/70 text-gray-600 border-gray-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs">{sp.icon}</span>
                    <span className="text-[11px] truncate">{sp.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 식감 */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-black text-gray-600 flex items-center gap-1">
              <span>🥨</span> 식감 특징
            </div>
            <div className="flex flex-wrap gap-1.5">
              {FLAVOR_OPTIONS.texture.map((tx) => {
                const isSelected = selectedTexture === tx.label;
                return (
                  <button
                    type="button"
                    key={tx.label}
                    onClick={() => setSelectedTexture(isSelected ? '' : tx.label)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-150 flex items-center gap-1 active:scale-95 ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs font-black ring-2 ring-emerald-400/30'
                        : 'bg-slate-50/70 text-gray-600 border-gray-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{tx.icon}</span>
                    <span>{tx.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 10. 카테고리별 세부 항목 별점 평가 */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-gray-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              {prod ? `'${prod.category}'` : '상품'} 카테고리 세부 별점
            </span>
            <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
              항목별 1~5점
            </span>
          </div>

          <div className="space-y-3 divide-y divide-gray-100 pt-1">
            {categoryMetrics.map((item, idx) => (
              <div key={idx} className={`${idx > 0 ? 'pt-3' : ''} flex flex-col gap-1.5`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-gray-800">{item.label}</span>
                  <span className="text-xs font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                    {item.val}점 / 5점
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-medium">{item.desc}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => item.set(star)}
                        className="p-1 transition-transform hover:scale-125 active:scale-130 focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 transition-colors ${
                            star <= item.val
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-gray-100 text-gray-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 11. 누구에게 추천하나요? */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-gray-900 flex items-center gap-1.5">
              🎯 누구에게 추천하나요?
            </span>
            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {selectedTargets.length} / 4개 선택
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {RECOMMEND_TARGET_TAGS.map((item) => {
              const isSelected = selectedTargets.includes(item.tag);
              return (
                <button
                  type="button"
                  key={item.tag}
                  onClick={() => toggleTarget(item.tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 flex items-center gap-1 active:scale-95 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-2 ring-slate-900/20'
                      : 'bg-slate-50/70 text-gray-600 border-gray-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.emoji}</span>
                  <span>{item.tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 12. 솔직한 맛 후기 본문 */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-gray-900 flex items-center gap-1.5">
              📝 솔직한 상세 맛 후기
            </span>
            <span className={`text-[10px] font-bold ${text.trim().length >= 30 ? 'text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full' : 'text-gray-400'}`}>
              {text.trim().length >= 30 ? '✓ 30자 달성' : `${text.length}/30자`}
            </span>
          </div>
          <textarea
            rows={5}
            maxLength={300}
            value={text}
            onChange={(e) => {
              if (e.target.value.length <= 300) {
                setText(e.target.value);
              }
            }}
            placeholder="포장 개봉 시 향, 첫 맛과 식감, 양, 가성비, 어떤 음료나 간식과 어울리는지 솔직하게 작성해주세요! (최대 300자, 최소 5자 이상)"
            className="w-full bg-slate-50/70 rounded-xl p-3 text-xs font-medium text-gray-900 placeholder-gray-400 border border-gray-200 outline-none resize-none leading-relaxed focus:border-slate-900 focus:bg-white transition-colors break-words break-all"
          />
          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <span className="text-gray-400">정성스러운 후기는 다른 유저들에게 큰 도움이 됩니다.</span>
            <span className={`font-bold ${text.length >= 300 ? 'text-rose-500' : text.length >= 250 ? 'text-amber-600' : 'text-gray-400'}`}>
              {text.length}/300자
            </span>
          </div>
        </div>

        {/* 하단 등록 버튼 */}
        <div className="pt-2">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !prod}
            className={`w-full py-4 font-black text-sm rounded-2xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-98 ${
              isSubmitting || !prod
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-black text-white shadow-slate-900/20 shadow-lg'
            }`}
          >
            <span>리뷰 등록하기</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 15. 상품 검색 전용 모달 (개편된 콤팩트 & 렉 제로 UI)                       */}
      {/* ========================================================================= */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg mx-auto rounded-t-3xl sm:rounded-3xl max-h-[85vh] h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
              <div>
                <h3 className="text-sm font-black text-gray-900 flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-emerald-600" />
                  리뷰할 상품 선택
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">원하는 먹거리나 신상품을 검색해보세요</p>
              </div>
              <button
                onClick={() => {
                  if (!prod && products.length > 0) {
                    setCurrentProductId(products[0].id);
                  }
                  setIsSearchModalOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input Bar & Category Filters */}
            <div className="p-3.5 pb-2 shrink-0 bg-slate-50/50 border-b border-gray-100 space-y-2">
              <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-gray-200 focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900/10 transition-all shadow-2xs">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="상품명, 브랜드(오리온, 농심 등) 검색..."
                  className="w-full bg-transparent text-xs text-gray-900 outline-none font-bold placeholder-gray-400"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="w-4 h-4 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[10px]"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>

              {/* Category Filter Chips & View Mode Toggle */}
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1 py-0.5">
                  {SEARCH_CATEGORIES.map((cat) => {
                    const isSelected = selectedSearchCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedSearchCategory(cat)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                          isSelected
                            ? 'bg-slate-900 text-white shadow-2xs'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center bg-gray-200/80 p-0.5 rounded-lg shrink-0">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-700'}`}
                    title="리스트 뷰"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-700'}`}
                    title="2열 그리드 뷰"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count Header */}
            <div className="px-4 py-2 flex items-center justify-between text-[11px] font-bold text-gray-400 bg-white shrink-0 border-b border-gray-50">
              <span>
                {searchQuery ? `검색 결과 (${filteredProducts.length}개)` : `전체 상품 (${filteredProducts.length}개)`}
              </span>
              <span className="text-emerald-600 font-extrabold">터치하여 선택</span>
            </div>

            {/* Search Results List / Grid */}
            <div className="flex-1 overflow-y-auto p-3 no-scrollbar">
              {visibleProducts.length > 0 ? (
                <>
                  {viewMode === 'list' ? (
                    <div className="space-y-2">
                      {visibleProducts.map((item) => {
                        const isCurrent = item.id === currentProductId;
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              setCurrentProductId(item.id);
                              setIsSearchModalOpen(false);
                            }}
                            className={`p-2.5 rounded-2xl flex items-center gap-3 cursor-pointer transition-all border active:scale-[0.99] ${
                              isCurrent
                                ? 'bg-emerald-50/60 border-emerald-500 shadow-xs ring-1 ring-emerald-400/30'
                                : 'bg-white hover:bg-slate-50 border-gray-100 hover:border-gray-200'
                            }`}
                          >
                            {/* 고정 썸네일 규격: w-12 h-12 (48px x 48px) */}
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100 bg-gray-50" 
                              loading="lazy"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-extrabold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">
                                  {item.category}
                                </span>
                                <span className="text-[10px] text-gray-400 font-medium truncate">{item.brand}</span>
                              </div>
                              <div className="text-xs font-bold text-gray-900 mt-0.5 truncate leading-tight">
                                {item.name}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[11px] font-black text-slate-800">
                                  {item.price.toLocaleString()}원
                                </span>
                                <span className="text-[10px] text-amber-500 font-black flex items-center">
                                  ★ {item.overallRating?.toFixed(1) || '5.0'}
                                </span>
                              </div>
                            </div>
                            <div className="shrink-0 pl-1">
                              {isCurrent ? (
                                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </div>
                              ) : (
                                <span className="text-[11px] font-extrabold text-gray-700 bg-gray-100 hover:bg-slate-900 hover:text-white px-2.5 py-1 rounded-full border border-gray-200 transition-colors">
                                  선택
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* 2열 콤팩트 카드 그리드 뷰 */
                    <div className="grid grid-cols-2 gap-2">
                      {visibleProducts.map((item) => {
                        const isCurrent = item.id === currentProductId;
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              setCurrentProductId(item.id);
                              setIsSearchModalOpen(false);
                            }}
                            className={`p-2.5 rounded-2xl flex flex-col justify-between cursor-pointer transition-all border active:scale-[0.98] ${
                              isCurrent
                                ? 'bg-emerald-50/60 border-emerald-500 shadow-xs ring-1 ring-emerald-400/30'
                                : 'bg-white hover:bg-slate-50 border-gray-100 hover:border-gray-200'
                            }`}
                          >
                            <div className="space-y-2">
                              {/* 그리드 뷰 고정 규격: 높이 h-24 */}
                              <div className="relative w-full h-24 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover" 
                                  loading="lazy"
                                />
                                <span className="absolute top-1 left-1 text-[9px] font-extrabold text-slate-800 bg-white/90 backdrop-blur-xs px-1.5 py-0.2 rounded shadow-2xs">
                                  {item.category}
                                </span>
                                {isCurrent && (
                                  <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="text-[10px] text-gray-400 font-medium truncate">{item.brand}</div>
                                <div className="text-xs font-bold text-gray-900 truncate leading-tight mt-0.5">
                                  {item.name}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50">
                              <span className="text-xs font-black text-slate-900">
                                {item.price.toLocaleString()}원
                              </span>
                              <span className="text-[10px] text-amber-500 font-black">
                                ★ {item.overallRating?.toFixed(1) || '5.0'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 더보기 버튼 (성능 최적화 스크롤) */}
                  {filteredProducts.length > displayLimit && (
                    <div className="pt-3 pb-2 text-center">
                      <button
                        type="button"
                        onClick={() => setDisplayLimit(prev => prev + 24)}
                        className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full border border-gray-200 transition-all active:scale-95"
                      >
                        상품 더보기 ({visibleProducts.length} / {filteredProducts.length})
                      </button>
                    </div>
                  )}

                  {/* 찾는 상품이 없을 때를 위한 안내 카드 */}
                  <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-gray-800 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>원하는 상품이 목록에 없나요?</span>
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">직접 신규 상품 등록을 요청해보세요</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsNewProductModalOpen(true)}
                      className="shrink-0 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-[11px] font-extrabold shadow-2xs active:scale-95 transition-all flex items-center gap-1"
                    >
                      <PlusCircle className="w-3 h-3 text-amber-400" />
                      <span>등록 요청</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-10 px-4 space-y-3.5">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-500 shadow-2xs">
                    <AlertCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-gray-900">
                      {searchQuery ? `'${searchQuery}' 일치하는 상품이 없습니다` : '일치하는 상품이 없습니다'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      찾으시는 신상품이 아직 목록에 등록되지 않았나요?<br />
                      운영진에게 등록을 요청해주시면 빠르게 추가해 드려요!
                    </p>
                  </div>

                  <div className="pt-1 flex flex-col gap-2 max-w-xs mx-auto">
                    <button
                      type="button"
                      onClick={() => setIsNewProductModalOpen(true)}
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>'{searchQuery || '원하는 상품'}' 등록 요청하기</span>
                    </button>

                    {(searchQuery || selectedSearchCategory !== '전체') && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedSearchCategory('전체');
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold text-xs transition-colors"
                      >
                        전체 상품 다시보기
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Close Bar */}
            <div className="p-3 border-t border-gray-100 bg-slate-50 shrink-0 text-center flex items-center justify-between">
              <span className="text-[11px] text-gray-400 font-medium">
                탭하면 바로 리뷰 상품으로 등록됩니다.
              </span>
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="text-xs font-bold text-gray-700 bg-white hover:bg-gray-100 px-3 py-1 rounded-lg border border-gray-200 transition-colors"
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 신규 상품 등록 요청 전용 모달 */}
      <NewProductRequestModal
        isOpen={isNewProductModalOpen}
        onClose={() => setIsNewProductModalOpen(false)}
        initialProductName={searchQuery}
        initialCategory={selectedSearchCategory}
      />

    </div>
  );
};
