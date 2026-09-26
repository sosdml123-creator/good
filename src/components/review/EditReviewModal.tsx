import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Camera, 
  Star, 
  Loader2, 
  Sparkles,
  ShoppingBag,
  Store,
  Tag
} from 'lucide-react';
import { Review, DetailedRating } from '../../types';
import { compressAndResizeImage } from '../../utils/imageCompressor';

// 구매처 목록
const PURCHASE_PLACES = [
  { id: 'GS25', name: 'GS25' },
  { id: 'CU', name: 'CU' },
  { id: '세븐일레븐', name: '7-11' },
  { id: '이마트24', name: 'emart24' },
  { id: '마켓컬리', name: '마켓컬리' },
  { id: '쿠팡', name: '쿠팡' },
  { id: '대형마트', name: '대형마트' },
  { id: '배민B마트', name: 'B마트' },
  { id: '동네슈퍼/기타', name: '기타' },
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
  { value: '무조건 또 사먹어요!', emoji: '🤩', label: '적극추천' },
  { value: '행사/할인하면 살래요', emoji: '😊', label: '할인추천' },
  { value: '한 번 먹어본 걸로 만족', emoji: '😐', label: '보통' },
  { value: '누가 주면 먹을듯', emoji: '💧', label: '글쎄요' },
  { value: '다시는 안 사먹을래요', emoji: '👎', label: '비추천' },
];

// 추천 태그
const RECOMMEND_TARGET_TAGS = [
  '#단짠러버', '#야식혼술족', '#다이어터/저당', '#아이들간식',
  '#가성비족', '#맵부심', '#홈카페디저트', '#신상얼리어답터'
];

interface EditReviewModalProps {
  review: Review;
  isOpen: boolean;
  onClose: () => void;
}

export const EditReviewModal: React.FC<EditReviewModalProps> = ({
  review,
  isOpen,
  onClose,
}) => {
  const { updateReview, showToast } = useApp();

  const [rating, setRating] = useState<number>(review.rating || 5);
  const [headline, setHeadline] = useState<string>(review.headline || '');
  const [content, setContent] = useState<string>(review.content || '');
  const [purchasePlace, setPurchasePlace] = useState<string>(review.purchasePlace || 'GS25');
  const [purchaseEvent, setPurchaseEvent] = useState<string>(review.purchaseEvent || '정가 구매');
  const [repurchaseIntent, setRepurchaseIntent] = useState<string>(review.repurchaseIntent || '무조건 또 사먹어요!');
  const [images, setImages] = useState<string[]>(review.images || []);
  const [tags, setTags] = useState<string[]>(review.tags || []);
  
  // Detailed rating
  const [tasteRating, setTasteRating] = useState<number>(review.detailedRating?.taste || 5);
  const [costRating, setCostRating] = useState<number>(review.detailedRating?.value || 5);
  const [amountRating, setAmountRating] = useState<number>(review.detailedRating?.portion || 5);
  const [repurchaseScore, setRepurchaseScore] = useState<number>(review.detailedRating?.repurchase || 5);

  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      showToast('사진은 최대 5장까지 등록할 수 있습니다.', 'info');
      return;
    }

    try {
      setIsCompressing(true);
      const filesToRead = Array.from(files).slice(0, 5 - images.length);
      const compressedUrls = await Promise.all(
        filesToRead.map(file =>
          compressAndResizeImage(file, {
            maxWidth: 1024,
            maxHeight: 1024,
            quality: 0.8,
            mimeType: 'image/jpeg'
          })
        )
      );

      setImages(prev => [...prev, ...compressedUrls].slice(0, 5));
      showToast(`📸 사진 ${compressedUrls.length}장이 추가되었습니다.`, 'success');
    } catch (err) {
      console.error('Image compression failed:', err);
      showToast('사진 처리 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsCompressing(false);
      e.target.value = '';
    }
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(prev => prev.filter(t => t !== tag));
    } else {
      if (tags.length >= 5) {
        showToast('태그는 최대 5개까지 선택 가능합니다.', 'info');
        return;
      }
      setTags(prev => [...prev, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    if (!content.trim() || content.trim().length < 5) {
      showToast('솔직 후기는 최소 5자 이상 작성해 주세요.', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const detailedRating: DetailedRating = {
        taste: tasteRating,
        value: costRating,
        portion: amountRating,
        repurchase: repurchaseScore,
      };

      const updatedData: Partial<Review> = {
        rating,
        detailedRating,
        headline: headline.trim(),
        content: content.trim(),
        purchasePlace,
        purchaseEvent,
        repurchaseIntent,
        images,
        tags,
      };

      await updateReview(review.id, updatedData);
      onClose();
    } catch (err) {
      console.error('Failed to update review:', err);
      showToast('리뷰 수정 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-gray-900">리뷰 수정하기</span>
            <span className="text-xs text-gray-500 font-medium">✏️</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Target Product Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
            {review.productImage && (
              <img 
                src={review.productImage} 
                alt={review.productName} 
                className="w-12 h-12 rounded-xl object-cover bg-white shrink-0 border border-gray-100" 
              />
            )}
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-semibold text-gray-400">작성 상품</span>
              <div className="text-xs font-bold text-gray-900 truncate">
                {review.productName}
              </div>
            </div>
          </div>

          {/* 1. Overall Rating */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
              <span>총점 별점</span>
              <span className="text-amber-500 font-black text-sm ml-1">{rating}점</span>
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 active:scale-95 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 2. Detailed Rating */}
          <div className="space-y-2.5 p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100">
            <span className="text-xs font-bold text-gray-800 block">세부 지표 평가</span>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              {[
                { label: '맛', val: tasteRating, set: setTasteRating },
                { label: '가성비', val: costRating, set: setCostRating },
                { label: '양', val: amountRating, set: setAmountRating },
                { label: '재구매 의사', val: repurchaseScore, set: setRepurchaseScore },
              ].map((m) => (
                <div key={m.label} className="bg-white p-2 rounded-xl border border-gray-100 flex items-center justify-between">
                  <span className="font-semibold text-gray-700">{m.label}</span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => m.set(s)}
                        className="p-0.5"
                      >
                        <Star className={`w-3.5 h-3.5 ${s <= m.val ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Purchase Place & Event */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1 mb-1.5">
                <Store className="w-3.5 h-3.5 text-gray-500" />
                <span>구매처</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PURCHASE_PLACES.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setPurchasePlace(p.name)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      purchasePlace === p.name
                        ? 'bg-gray-900 text-white font-bold shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1 mb-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-gray-500" />
                <span>구매 혜택 / 행사</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PURCHASE_EVENTS.map((pe) => (
                  <button
                    type="button"
                    key={pe.id}
                    onClick={() => setPurchaseEvent(pe.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                      purchaseEvent === pe.id
                        ? 'bg-gray-900 text-white font-bold shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{pe.icon}</span>
                    <span>{pe.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>재구매 의사</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {REPURCHASE_OPTIONS.map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setRepurchaseIntent(opt.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                      repurchaseIntent === opt.value
                        ? 'bg-rose-500 text-white font-bold shadow-xs'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-100'
                    }`}
                  >
                    <span>{opt.emoji}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Headline */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-800 block">한 줄 요약평</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="예: 기대 이상으로 바삭하고 단짠 밸런스 최고!"
              maxLength={60}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-colors"
            />
          </div>

          {/* 5. Detailed Review Content */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800">상세 솔직 후기</label>
              <span className="text-[10px] text-gray-400">{content.length}/300자</span>
            </div>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, 300))}
              placeholder="맛, 식감, 양, 패키지 등 솔직한 느낌을 자유롭게 적어주세요. (최소 5자 이상)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs text-gray-900 outline-none resize-none focus:border-gray-900 focus:bg-white transition-colors"
            />
          </div>

          {/* 6. Photos Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-gray-500" />
                <span>사진 첨부 ({images.length}/5)</span>
              </label>
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isCompressing}
                  className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                >
                  + 사진 추가
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />

            {images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                    <img src={img} alt="review upload" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 7. Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-gray-500" />
              <span>추천 태그</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {RECOMMEND_TARGET_TAGS.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    tags.includes(t)
                      ? 'bg-gray-900 text-white font-bold'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-2 flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSaving || isCompressing}
              className="flex-1 py-3 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>저장 중...</span>
                </>
              ) : (
                <span>수정 완료</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
