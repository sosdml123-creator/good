import React, { useState, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, 
  Camera, 
  Star, 
  X, 
  Check, 
  Search, 
  Store, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle
} from 'lucide-react';
import { ProductCategory } from '../../types';

// 구매처 목록
const PURCHASE_PLACES = [
  { id: 'GS25', name: 'GS25' },
  { id: 'CU', name: 'CU' },
  { id: '세븐일레븐', name: '세븐일레븐' },
  { id: '이마트24', name: '이마트24' },
  { id: '마켓컬리', name: '마켓컬리' },
  { id: '쿠팡', name: '쿠팡' },
  { id: '대형마트', name: '대형마트' },
  { id: '배민B마트', name: '배민B마트' },
  { id: '동네슈퍼/기타', name: '동네슈퍼/기타' },
];

// 구매 혜택 / 행사 조건
const PURCHASE_EVENTS = [
  '정가 구매',
  '1+1 행사',
  '2+1 행사',
  '깜짝할인/특가',
  '무료체험/선물'
];

// 재구매 의사 5단계
const REPURCHASE_OPTIONS = [
  { value: '무조건 또 사먹어요!', emoji: '🤩', label: '적극추천' },
  { value: '행사/할인하면 살래요', emoji: '😊', label: '만족' },
  { value: '한 번 먹어본 걸로 만족', emoji: '😐', label: '보통' },
  { value: '누가 주면 먹을듯', emoji: '💧', label: '아쉬움' },
  { value: '다시는 안 사먹을래요', emoji: '👎', label: '비추천' },
];

// 맛 프로필 옵션
const FLAVOR_OPTIONS = {
  sweetness: ['안 달아요', '은은한 단맛', '적당한 달콤함', '아주 달아요'],
  spiciness: ['안 매워요', '살짝 매콤', '신라면 수준', '불닭급 매움'],
  texture: ['바삭바삭', '쫀득/꾸덕', '부드러움', '아삭아삭', '촉촉함'],
};

// 추천 대상 태그
const RECOMMEND_TARGET_TAGS = [
  '#단짠러버',
  '#야식혼술족',
  '#다이어터/저당',
  '#아이들간식',
  '#가성비족',
  '#맵부심',
  '#홈카페디저트',
  '#신상얼리어답터',
  '#단백질충전',
  '#칼로리폭탄'
];

const SEARCH_CATEGORIES: (ProductCategory | '전체')[] = [
  '전체', '과자', '음료', '빵·디저트', '간편식', '패스트푸드', '과일', '식재료', '고기·수산'
];

export const WriteReviewModal: React.FC = () => {
  const { products, selectedProductId, submitReview, goBack, showToast } = useApp();

  // 1. 상품 선택 상태
  const [currentProductId, setCurrentProductId] = useState<string | null>(selectedProductId || null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(!selectedProductId);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchCategory, setSelectedSearchCategory] = useState<string>('전체');

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
  const [isReceiptVerified, setIsReceiptVerified] = useState<boolean>(false);

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

  const isFresh = prod ? (prod.itemType === 'fresh' || ['과일', '고기·수산', '식재료'].includes(prod.category)) : false;

  const sliderLabels = isFresh
    ? [
        { label: '당도·풍미', left: '부족', right: '최고' },
        { label: '신선도', left: '보통', right: '매우신선' },
        { label: '식감', left: '물러요', right: '아삭/쫀득' },
        { label: '가격만족도', left: '비쌈', right: '가성비최고' },
      ]
    : [
        { label: '맛', left: '별로', right: '최고' },
        { label: '가성비', left: '비쌈', right: '가성비좋음' },
        { label: '양', left: '적음', right: '푸짐함' },
        { label: '재구매', left: '안살듯', right: '무조건' },
      ];

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

  // 사진 업로드 핸들러 (최대 5장)
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
          showToast('📸 사진이 첨부되었습니다! (+30P 보너스)', 'success');
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

  // 실시간 적립 포인트 계산 (기본 50P + 사진 30P + 30자 이상 20P = 최대 100P)
  const earnedPoints = useMemo(() => {
    let p = 50;
    if (images.length > 0) p += 30;
    if (text.trim().length >= 30) p += 20;
    return p;
  }, [images.length, text]);

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
        text.trim(),
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
          isReceiptVerified,
        }
      );
    } catch (err) {
      showToast('리뷰 등록 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-full pb-24">
      {/* 1. Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-3 shadow-2xs">
        <button onClick={goBack} className="p-1 -ml-1 text-gray-700 hover:text-gray-900 active:scale-95 transition-transform">
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
        </button>
        <div className="text-center">
          <span className="text-[15px] font-black text-gray-900 block leading-tight">신상 솔직 리뷰 작성</span>
          <span className="text-[10px] text-amber-600 font-semibold">최대 +100P 적립 기회!</span>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting || !prod}
          className={`text-[13px] font-black px-3 py-1 rounded-full transition-all ${
            isSubmitting || !prod
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white shadow-xs hover:bg-black active:scale-95'
          }`}
        >
          {isSubmitting ? '등록중' : '등록'}
        </button>
      </div>

      {/* 2. 포인트 적립 게이지 배너 */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 text-white px-4 py-3 shadow-xs">
        <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            작성 혜택 포인트
          </span>
          <span className="text-amber-300 text-sm font-black">+{earnedPoints}P / 100P</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-amber-300 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${earnedPoints}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-white/80 mt-1.5 font-medium">
          <span className={earnedPoints >= 50 ? 'text-amber-200 font-bold' : ''}>기본 +50P</span>
          <span className={images.length > 0 ? 'text-amber-200 font-bold' : ''}>사진 첨부 +30P</span>
          <span className={text.trim().length >= 30 ? 'text-amber-200 font-bold' : ''}>30자 이상 +20P</span>
        </div>
      </div>

      <div className="p-4 space-y-3.5 max-w-lg mx-auto">
        {/* 3. 상품 선택 / 검색 섹션 */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-gray-700" />
              리뷰 대상 상품
            </span>
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="text-[11px] font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors"
            >
              <Search className="w-3 h-3" />
              {prod ? '상품 다시 검색' : '상품 검색하기'}
            </button>
          </div>

          {prod ? (
            <div 
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 cursor-pointer transition-colors group"
            >
              <img 
                src={prod.image} 
                alt={prod.name} 
                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-200 bg-white" 
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-gray-700 bg-white border border-gray-200 px-1.5 py-0.5 rounded">
                    {prod.category}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium truncate">{prod.brand}</span>
                </div>
                <div className="text-[13px] font-bold text-gray-900 mt-1 truncate group-hover:text-gray-900 transition-colors">
                  {prod.name}
                </div>
                <div className="text-[11px] font-semibold text-gray-600 mt-0.5">
                  {prod.price.toLocaleString()}원
                </div>
              </div>
              <span className="text-[11px] text-gray-400 font-bold group-hover:text-gray-900 shrink-0">
                변경 &gt;
              </span>
            </div>
          ) : (
            <div 
              onClick={() => setIsSearchModalOpen(true)}
              className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-5 text-center cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <Search className="w-7 h-7 text-gray-400 mx-auto mb-1.5" />
              <div className="text-xs font-bold text-gray-900">어떤 상품을 드셔보셨나요?</div>
              <p className="text-[11px] text-gray-500 mt-0.5">터치하여 리뷰할 상품을 검색해 선택해주세요</p>
            </div>
          )}
        </div>

        {/* 4. 종합 만족도 별점 */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 text-center">
          <div className="text-xs font-bold text-gray-500 mb-1">종합 만족도 평점</div>
          <div className="flex items-center justify-center gap-2 py-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 transition-transform active:scale-110"
              >
                <Star
                  className={`w-9 h-9 ${
                    star <= rating
                      ? 'fill-[#FFC107] text-[#FFC107] drop-shadow-xs'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="text-center text-[13px] font-black text-gray-900 mt-1">
            {rating === 5 ? '정말 최고예요! 무조건 추천 ⭐⭐⭐⭐⭐' : 
             rating === 4 ? '맛있고 기대 이상이에요 👍' : 
             rating === 3 ? '무난하고 평범해요 😐' : 
             rating === 2 ? '기대에는 조금 못 미쳐요 💦' : '많이 아쉬워요 😢'}
          </div>
        </div>

        {/* 5. 어디서 어떻게 구매하셨나요? (구매처 & 행사 정보) */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              🏪 어디서 구매하셨나요?
            </span>
            <span className="text-[10px] text-gray-400">필수 선택</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {PURCHASE_PLACES.map((place) => {
              const isSelected = purchasePlace === place.id;
              return (
                <button
                  type="button"
                  key={place.id}
                  onClick={() => setPurchasePlace(place.id)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    isSelected
                      ? 'bg-gray-900 text-white border-gray-900 shadow-xs scale-[1.02]'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {place.name}
                </button>
              );
            })}
          </div>

          {/* 구매 행사 & 구매 가격 */}
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <div className="text-[11px] font-bold text-gray-600">구매 조건 / 혜택</div>
            <div className="flex flex-wrap gap-1.5">
              {PURCHASE_EVENTS.map((evt) => (
                <button
                  type="button"
                  key={evt}
                  onClick={() => setPurchaseEvent(evt)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    purchaseEvent === evt
                      ? 'bg-gray-900 text-white border-gray-900 font-bold'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {evt}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-gray-500 font-medium shrink-0">실제 구매가</span>
              <input
                type="text"
                placeholder={prod ? `${prod.price.toLocaleString()} (선택입력)` : '구매금액 (선택입력)'}
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-gray-800 outline-none focus:border-gray-900 focus:bg-white"
              />
              <span className="text-xs text-gray-500 shrink-0">원</span>
            </div>
          </div>
        </div>

        {/* 6. 재구매 의사 (5단계 감정 이모지) */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-2.5">
          <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
            💖 다시 구매하시겠어요?
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {REPURCHASE_OPTIONS.map((opt) => {
              const isSelected = repurchaseIntent === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setRepurchaseIntent(opt.value)}
                  className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
                    isSelected
                      ? 'bg-rose-50 border-rose-400 shadow-xs text-rose-600'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="text-[10px] font-bold text-center leading-tight">{opt.label}</span>
                </button>
              );
            })}
          </div>
          <div className="text-center text-[11px] font-semibold text-gray-500 bg-gray-50 py-1.5 rounded-lg">
            선택: <span className="text-rose-600 font-bold">{repurchaseIntent}</span>
          </div>
        </div>

        {/* 7. 핵심 한 줄 요약평 */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              ✍️ 핵심 한 줄 평
            </span>
            <span className="text-[10px] text-gray-400">피드 강조 문구</span>
          </div>
          <input
            type="text"
            maxLength={40}
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="예: 크림이 진짜 가득 차있어서 인생 빵 등극!"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 font-bold outline-none placeholder-gray-400 focus:border-gray-900 focus:bg-white transition-colors"
          />
        </div>

        {/* 8. 맛 & 식감 디테일 프로필 */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-3">
          <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
            👅 맛 & 식감 상세 프로필
          </div>

          {/* 단맛 */}
          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-gray-500">단맛의 정도</div>
            <div className="flex flex-wrap gap-1.5">
              {FLAVOR_OPTIONS.sweetness.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSelectedSweetness(selectedSweetness === s ? '' : s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    selectedSweetness === s
                      ? 'bg-amber-50 text-amber-800 border-amber-300 font-bold'
                      : 'bg-gray-50 text-gray-600 border-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 매운맛 */}
          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-gray-500">매운맛의 정도</div>
            <div className="flex flex-wrap gap-1.5">
              {FLAVOR_OPTIONS.spiciness.map((sp) => (
                <button
                  type="button"
                  key={sp}
                  onClick={() => setSelectedSpiciness(selectedSpiciness === sp ? '' : sp)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    selectedSpiciness === sp
                      ? 'bg-red-50 text-red-700 border-red-300 font-bold'
                      : 'bg-gray-50 text-gray-600 border-gray-200'
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>

          {/* 식감 */}
          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-gray-500">식감</div>
            <div className="flex flex-wrap gap-1.5">
              {FLAVOR_OPTIONS.texture.map((tx) => (
                <button
                  type="button"
                  key={tx}
                  onClick={() => setSelectedTexture(selectedTexture === tx ? '' : tx)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    selectedTexture === tx
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                      : 'bg-gray-50 text-gray-600 border-gray-200'
                  }`}
                >
                  {tx}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 9. 세부 항목 평가 슬라이더 */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-3.5">
          <div className="text-xs font-bold text-gray-900 flex items-center justify-between">
            <span>{isFresh ? '🍎 신선식품 세부 항목' : '📊 세부 항목 평가'}</span>
            <span className="text-[10px] text-gray-400">각 1~5점</span>
          </div>

          {[
            { val: metric1, set: setMetric1, meta: sliderLabels[0] },
            { val: metric2, set: setMetric2, meta: sliderLabels[1] },
            { val: metric3, set: setMetric3, meta: sliderLabels[2] },
            { val: metric4, set: setMetric4, meta: sliderLabels[3] },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 text-xs">
              <span className="w-18 text-[12px] text-gray-700 font-bold shrink-0">{item.meta.label}</span>
              <div className="flex-1">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={item.val}
                  onChange={(e) => item.set(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                />
              </div>
              <span className="w-16 text-right text-[11px] font-black text-gray-900">
                {item.val}점 ({item.meta.right})
              </span>
            </div>
          ))}
        </div>

        {/* 10. 누구에게 추천하나요? (추천 태그) */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              🎯 누구에게 추천하나요?
            </span>
            <span className="text-[10px] text-gray-400">최대 4개</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {RECOMMEND_TARGET_TAGS.map((tag) => {
              const isSelected = selectedTargets.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTarget(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-gray-900 text-white shadow-2xs font-bold'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* 11. 솔직한 맛 후기 본문 */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              📝 솔직한 상세 맛 후기
            </span>
            <span className={`text-[10px] font-bold ${text.trim().length >= 30 ? 'text-emerald-600' : 'text-gray-400'}`}>
              {text.trim().length >= 30 ? '✓ 30자 달성 (+20P)' : `${text.length}/30자`}
            </span>
          </div>
          <textarea
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="포장 개봉 시 향, 첫 맛과 식감, 양, 가성비, 어떤 음료나 간식과 어울리는지 솔직하게 작성해주세요! (최소 5자 이상)"
            className="w-full bg-gray-50 rounded-xl p-3 text-xs text-gray-800 placeholder-gray-400 border border-gray-200 outline-none resize-none leading-relaxed focus:border-gray-900 focus:bg-white transition-colors"
          />
          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-0.5">
            <span>정성스러운 후기는 다른 유저들에게 큰 도움이 됩니다.</span>
            <span>{text.length}/500자</span>
          </div>
        </div>

        {/* 12. 사진 첨부 (최대 5장) */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              📸 사진 첨부
              <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold">
                +30P 보너스
              </span>
            </span>
            <span className="text-[11px] font-semibold text-gray-400">{images.length}/5장</span>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            multiple 
            onChange={handleImageUpload} 
            className="hidden" 
          />

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-18 h-18 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 flex flex-col items-center justify-center text-gray-500 text-xs gap-1 shrink-0 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <Camera className="w-5 h-5 text-gray-400" />
              <span className="text-[10px] font-bold text-gray-600">사진 추가</span>
            </button>

            {images.map((imgSrc, idx) => (
              <div key={idx} className="relative w-18 h-18 rounded-xl overflow-hidden border border-gray-200 shrink-0 group">
                <img src={imgSrc} alt="preview" className="w-full h-full object-cover" />
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1 rounded">
                    대표
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 w-4.5 h-4.5 rounded-full bg-black/70 text-white flex items-center justify-center text-[10px] hover:bg-rose-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 13. 내돈내산 영수증 인증 토글 */}
        <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-gray-100 flex items-center justify-between cursor-pointer"
             onClick={() => setIsReceiptVerified(!isReceiptVerified)}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isReceiptVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
            }`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 flex items-center gap-1">
                내돈내산 영수증 인증 마크 달기
                <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold border border-emerald-200">
                  신뢰도 UP
                </span>
              </div>
              <p className="text-[10px] text-gray-400">직접 구매하여 체험한 솔직 후기임을 인증합니다.</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isReceiptVerified}
            onChange={(e) => setIsReceiptVerified(e.target.checked)}
            className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
          />
        </div>

        {/* 14. 하단 등록 버튼 */}
        <div className="pt-2">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !prod}
            className={`w-full py-4 font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 ${
              isSubmitting || !prod
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-900 hover:bg-black active:scale-98 text-white shadow-md'
            }`}
          >
            <span>리뷰 등록하고 +{earnedPoints}P 즉시 받기</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 15. 상품 검색 전용 모달 (Product Search Picker Modal)                     */}
      {/* ========================================================================= */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg mx-auto rounded-t-3xl sm:rounded-3xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-black text-gray-900">리뷰할 상품 검색</h3>
                <p className="text-xs text-gray-500 mt-0.5">원하시는 신상품 또는 먹거리를 검색해보세요</p>
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

            {/* Search Input Bar */}
            <div className="p-4 pb-2 shrink-0">
              <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-3.5 py-2.5 border border-transparent focus-within:border-gray-900 focus-within:bg-white transition-all">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="상품명, 브랜드(오리온, 농심 등), 편의점 신상 검색..."
                  className="w-full bg-transparent text-xs text-gray-900 outline-none font-medium placeholder-gray-400"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="w-4 h-4 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-[10px]"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 no-scrollbar">
                {SEARCH_CATEGORIES.map((cat) => {
                  const isSelected = selectedSearchCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedSearchCategory(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                        isSelected
                          ? 'bg-gray-900 text-white shadow-2xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Results List */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 no-scrollbar">
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 px-1">
                <span>
                  {searchQuery ? `검색 결과 (${filteredProducts.length}개)` : `인기 신상품 (${filteredProducts.length}개)`}
                </span>
                <span className="text-gray-500">터치하여 선택</span>
              </div>

              {filteredProducts.length > 0 ? (
                filteredProducts.map((item) => {
                  const isCurrent = item.id === currentProductId;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setCurrentProductId(item.id);
                        setIsSearchModalOpen(false);
                        showToast(`'${item.name}' 상품이 선택되었습니다.`, 'success');
                      }}
                      className={`p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-all border ${
                        isCurrent
                          ? 'bg-slate-50 border-gray-900 shadow-xs'
                          : 'bg-white hover:bg-gray-50 border-gray-100'
                      }`}
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-13 h-13 rounded-xl object-cover shrink-0 border border-gray-100 bg-gray-50" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-1.5 py-0.2 rounded">
                            {item.category}
                          </span>
                          <span className="text-[11px] text-gray-400 truncate">{item.brand}</span>
                        </div>
                        <div className="text-xs font-bold text-gray-900 mt-0.5 truncate">
                          {item.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-black text-gray-800">
                            {item.price.toLocaleString()}원
                          </span>
                          <span className="text-[10px] text-amber-500 font-bold flex items-center">
                            ★ {item.overallRating?.toFixed(1) || '5.0'}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 pl-1">
                        {isCurrent ? (
                          <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
                            선택
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 px-4 space-y-2">
                  <AlertCircle className="w-8 h-8 text-gray-300 mx-auto" />
                  <div className="text-xs font-bold text-gray-700">일치하는 상품이 없습니다</div>
                  <p className="text-[11px] text-gray-400">다른 검색어로 검색해보거나 카테고리를 '전체'로 변경해보세요.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedSearchCategory('전체');
                    }}
                    className="mt-2 text-xs font-bold text-gray-900 underline"
                  >
                    전체 상품 보기
                  </button>
                </div>
              )}
            </div>

            {/* Modal Bottom Close */}
            <div className="p-3 border-t border-gray-100 bg-gray-50 shrink-0 text-center">
              <p className="text-[11px] text-gray-400">
                찾으시는 상품을 탭하면 바로 리뷰 작성이 시작됩니다.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};


