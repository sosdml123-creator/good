import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, Camera, Star } from 'lucide-react';

export const WriteReviewModal: React.FC = () => {
  const { products, selectedProductId, submitReview, goBack, showToast } = useApp();

  const [rating, setRating] = useState(5);
  const [metric1, setMetric1] = useState(5);
  const [metric2, setMetric2] = useState(5);
  const [metric3, setMetric3] = useState(4);
  const [metric4, setMetric4] = useState(5);
  const [text, setText] = useState('');

  const prod = products.find(p => p.id === selectedProductId) || products[0];

  const isFresh = prod.itemType === 'fresh' || ['과일', '고기·수산', '식재료'].includes(prod.category);
  const isRest = prod.itemType === 'restaurant' || prod.category === '외식';

  const labels = isFresh
    ? [
        { label: '당도·풍미', left: '부족', right: '최고' },
        { label: '신선도', left: '보통', right: '매우신선' },
        { label: '식감', left: '물러요', right: '아삭/쫀득' },
        { label: '가격만족도', left: '비쌈', right: '가성비최고' },
      ]
    : isRest
    ? [
        { label: '맛·음식품질', left: '별로', right: '인생맛집' },
        { label: '양', left: '적음', right: '푸짐함' },
        { label: '서비스·분위기', left: '아쉬움', right: '매우만족' },
        { label: '재방문의사', left: '안갈듯', right: '무조건재방문' },
      ]
    : [
        { label: '맛', left: '별로', right: '최고' },
        { label: '가성비', left: '비쌈', right: '가성비좋음' },
        { label: '양', left: '적음', right: '적당' },
        { label: '재구매', left: '안살듯', right: '무조건' },
      ];

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await submitReview(
        prod.id,
        rating,
        { taste: metric1, value: metric2, portion: metric3, repurchase: metric4 },
        text || '정말 맛있고 품질이 뛰어납니다! 적극 추천해요.'
      );
    } catch (err) {
      showToast('리뷰 등록 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-full pb-12">
      
      {/* 1. Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-2.5 shadow-2xs">
        <button onClick={goBack} className="p-1 -ml-1 text-gray-700">
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
        </button>
        <span className="text-[15px] font-bold text-gray-900">먹거리 평가 & 리뷰 작성</span>
        <button onClick={handleSubmit} className="text-[14px] font-bold text-[#0066FF]">
          등록
        </button>
      </div>

      {/* 2. Product */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center gap-3">
        <img src={prod.image} alt={prod.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
        <div>
          <span className="text-[10px] font-bold text-[#0066FF] bg-blue-50 px-1.5 py-0.2 rounded">
            {prod.category} {prod.subCategory ? `· ${prod.subCategory}` : ''}
          </span>
          <div className="text-[13px] font-semibold text-gray-900 mt-0.5">{prod.name}</div>
          <div className="text-[11px] text-gray-400">{prod.brand}</div>
        </div>
      </div>

      {/* 3. Star rating (Large Yellow Stars) */}
      <div className="bg-white px-4 py-5 border-b border-gray-100 text-center">
        <div className="text-[14px] font-bold text-gray-900 mb-2">종합 만족도 평점</div>
        <div className="flex items-center gap-1.5 text-4xl justify-center py-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none hover:scale-110 transition-transform"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= rating
                    ? 'fill-[#FFC107] text-[#FFC107]'
                    : 'fill-gray-200 text-gray-200'
                }`}
              />
            </button>
          ))}
        </div>
        <div className="text-center text-[13px] text-gray-500 mt-1">
          {rating === 5 ? '정말 최고예요! ⭐' : rating === 4 ? '맛있고 만족스러워요 👍' : '보통이에요'}
        </div>
      </div>

      {/* 4. Dynamic Detailed Sliders */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 space-y-4">
        <div className="text-[14px] font-bold text-gray-900 mb-1">
          {isFresh ? '🍎 신선식품 세부 평가' : isRest ? '🥢 외식 메뉴 세부 평가' : '세부 항목 평가'}
        </div>
        
        {/* Metric 1 */}
        <div className="flex items-center gap-3 text-xs">
          <span className="w-20 text-[12px] text-gray-700 font-semibold shrink-0">{labels[0].label}</span>
          <div className="flex-1">
            <input
              type="range"
              min="1"
              max="5"
              value={metric1}
              onChange={(e) => setMetric1(Number(e.target.value))}
              className="w-full h-1"
            />
          </div>
          <span className="w-16 text-right text-[11px] text-gray-500">{labels[0].right}</span>
        </div>

        {/* Metric 2 */}
        <div className="flex items-center gap-3 text-xs">
          <span className="w-20 text-[12px] text-gray-700 font-semibold shrink-0">{labels[1].label}</span>
          <div className="flex-1">
            <input
              type="range"
              min="1"
              max="5"
              value={metric2}
              onChange={(e) => setMetric2(Number(e.target.value))}
              className="w-full h-1"
            />
          </div>
          <span className="w-16 text-right text-[11px] text-gray-500">{labels[1].right}</span>
        </div>

        {/* Metric 3 */}
        <div className="flex items-center gap-3 text-xs">
          <span className="w-20 text-[12px] text-gray-700 font-semibold shrink-0">{labels[2].label}</span>
          <div className="flex-1">
            <input
              type="range"
              min="1"
              max="5"
              value={metric3}
              onChange={(e) => setMetric3(Number(e.target.value))}
              className="w-full h-1"
            />
          </div>
          <span className="w-16 text-right text-[11px] text-gray-500">{labels[2].right}</span>
        </div>

        {/* Metric 4 */}
        <div className="flex items-center gap-3 text-xs">
          <span className="w-20 text-[12px] text-gray-700 font-semibold shrink-0">{labels[3].label}</span>
          <div className="flex-1">
            <input
              type="range"
              min="1"
              max="5"
              value={metric4}
              onChange={(e) => setMetric4(Number(e.target.value))}
              className="w-full h-1"
            />
          </div>
          <span className="w-16 text-right text-[11px] text-gray-500">{labels[3].right}</span>
        </div>
      </div>

      {/* 5. Textarea */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="text-[14px] font-bold text-gray-900 mb-2">솔직한 맛·품질 후기</div>
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isRest ? "방문하신 식당의 분위기나 음식 맛, 추천 팁을 남겨주세요!" : "당도, 식감, 신선도나 가성비에 대한 솔직한 후기를 남겨주세요 (최소 10자)"}
          className="w-full bg-gray-50 rounded-xl p-3 text-[13px] text-gray-800 placeholder-gray-400 border border-gray-200 outline-none resize-none leading-relaxed"
        />
        <div className="text-right text-[11px] text-gray-400 mt-1">{text.length}/500</div>
      </div>

      {/* 6. Photo */}
      <div className="bg-white px-4 py-4">
        <div className="text-[14px] font-bold text-gray-900 mb-2">
          음식/인증 사진 첨부 <span className="text-gray-400 font-normal text-[12px]">(선택)</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => showToast('사진이 선택되었습니다.')}
            className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 text-xs gap-0.5"
          >
            <Camera className="w-5 h-5" />
            <span>사진</span>
          </button>
          <div className="w-16 h-16 rounded-xl bg-gray-100"></div>
          <div className="w-16 h-16 rounded-xl bg-gray-100"></div>
        </div>
      </div>

    </div>
  );
};
