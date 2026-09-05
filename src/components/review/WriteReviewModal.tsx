import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, Camera, Star, X, Check, Search } from 'lucide-react';

export const WriteReviewModal: React.FC = () => {
  const { products, selectedProductId, submitReview, goBack, showToast } = useApp();

  const [currentProductId, setCurrentProductId] = useState<string>(selectedProductId || products[0]?.id || 'prod-01');
  const [isChangingProduct, setIsChangingProduct] = useState(false);
  const [searchProductQuery, setSearchProductQuery] = useState('');

  const [rating, setRating] = useState(5);
  const [metric1, setMetric1] = useState(5);
  const [metric2, setMetric2] = useState(5);
  const [metric3, setMetric3] = useState(4);
  const [metric4, setMetric4] = useState(5);
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(['#내돈내산', '#신상후기']);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const prod = products.find(p => p.id === currentProductId) || products[0];

  const isFresh = prod.itemType === 'fresh' || ['과일', '고기·수산', '식재료'].includes(prod.category);

  const labels = isFresh
    ? [
        { label: '당도·풍미', left: '부족', right: '최고' },
        { label: '신선도', left: '보통', right: '매우신선' },
        { label: '식감', left: '물러요', right: '아삭/쫀득' },
        { label: '가격만족도', left: '비쌈', right: '가성비최고' },
      ]
    : [
        { label: '맛', left: '별로', right: '최고' },
        { label: '가성비', left: '비쌈', right: '가성비좋음' },
        { label: '양', left: '적음', right: '적당' },
        { label: '재구매', left: '안살듯', right: '무조건' },
      ];

  const availableTags = [
    '#내돈내산',
    '#신상후기',
    '#재구매각',
    '#가성비최고',
    '#진짜맛있음',
    '#강력추천',
    '#달달함',
    '#맥주안주',
    '#간식추천',
    '#선물용추천'
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string].slice(0, 3));
          showToast('📸 사진이 첨부되었습니다!', 'success');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!text.trim()) {
      showToast('솔직한 맛 후기를 입력해주세요.', 'info');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview(
        prod.id,
        rating,
        { taste: metric1, value: metric2, portion: metric3, repurchase: metric4 },
        text.trim(),
        images.length > 0 ? images : [prod.image],
        selectedTags
      );
    } catch (err) {
      showToast('리뷰 등록 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSelectProducts = searchProductQuery.trim()
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchProductQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchProductQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchProductQuery.toLowerCase())
      )
    : products;

  return (
    <div className="bg-white min-h-full pb-16">
      
      {/* 1. Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-2.5 shadow-2xs">
        <button onClick={goBack} className="p-1 -ml-1 text-gray-700 hover:text-gray-900">
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
        </button>
        <span className="text-[15px] font-bold text-gray-900">먹거리 평가 & 리뷰 작성</span>
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="text-[14px] font-bold text-[#0066FF] hover:opacity-80 px-2 py-1"
        >
          {isSubmitting ? '등록중...' : '등록'}
        </button>
      </div>

      {/* 2. Product Card & Change Selector */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img src={prod.image} alt={prod.name} className="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-100" />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-[#0066FF] bg-blue-50 px-1.5 py-0.2 rounded">
                {prod.category} {prod.subCategory ? `· ${prod.subCategory}` : ''}
              </span>
              <div className="text-[13px] font-semibold text-gray-900 mt-0.5 truncate">{prod.name}</div>
              <div className="text-[11px] text-gray-400">{prod.brand}</div>
            </div>
          </div>

          <button
            onClick={() => setIsChangingProduct(!isChangingProduct)}
            className="text-xs font-bold text-[#0066FF] border border-blue-200 px-2.5 py-1.5 rounded-full shrink-0 hover:bg-blue-50 ml-2"
          >
            {isChangingProduct ? '닫기' : '상품 변경'}
          </button>
        </div>

        {/* Change Product Dropdown / Drawer */}
        {isChangingProduct && (
          <div className="mt-3 p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2.5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-1.5 border border-gray-200">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="리뷰할 다른 상품 검색..."
                value={searchProductQuery}
                onChange={(e) => setSearchProductQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-gray-900 outline-none"
              />
              {searchProductQuery && (
                <button onClick={() => setSearchProductQuery('')} className="p-0.5 text-gray-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 no-scrollbar">
              {filteredSelectProducts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setCurrentProductId(item.id);
                    setIsChangingProduct(false);
                  }}
                  className={`p-2 rounded-xl flex items-center gap-2.5 cursor-pointer transition-colors ${
                    item.id === currentProductId ? 'bg-blue-50 border border-[#0066FF]' : 'bg-white hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-gray-900 truncate">{item.name}</div>
                    <div className="text-[10px] text-gray-400">{item.brand}</div>
                  </div>
                  {item.id === currentProductId && (
                    <Check className="w-4 h-4 text-[#0066FF] shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Star rating */}
      <div className="bg-white px-4 py-5 border-b border-gray-100 text-center">
        <div className="text-[14px] font-bold text-gray-900 mb-2">종합 만족도 평점</div>
        <div className="flex items-center gap-2 text-4xl justify-center py-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none hover:scale-110 active:scale-95 transition-transform"
            >
              <Star
                className={`w-9 h-9 ${
                  star <= rating
                    ? 'fill-[#FFC107] text-[#FFC107]'
                    : 'fill-gray-200 text-gray-200'
                }`}
              />
            </button>
          ))}
        </div>
        <div className="text-center text-[13px] font-bold text-[#0066FF] mt-1">
          {rating === 5 ? '정말 최고예요! ⭐⭐⭐⭐⭐' : rating === 4 ? '맛있고 만족스러워요 👍' : rating === 3 ? '무난해요' : '아쉬워요'}
        </div>
      </div>

      {/* 4. Dynamic Detailed Sliders */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 space-y-4">
        <div className="text-[14px] font-bold text-gray-900 mb-1">
          {isFresh ? '🍎 신선식품 세부 평가' : '세부 항목 평가'}
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
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0066FF]"
            />
          </div>
          <span className="w-16 text-right text-[11px] font-bold text-[#0066FF]">{metric1}점 ({labels[0].right})</span>
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
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0066FF]"
            />
          </div>
          <span className="w-16 text-right text-[11px] font-bold text-[#0066FF]">{metric2}점 ({labels[1].right})</span>
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
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0066FF]"
            />
          </div>
          <span className="w-16 text-right text-[11px] font-bold text-[#0066FF]">{metric3}점 ({labels[2].right})</span>
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
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0066FF]"
            />
          </div>
          <span className="w-16 text-right text-[11px] font-bold text-[#0066FF]">{metric4}점 ({labels[3].right})</span>
        </div>
      </div>

      {/* 5. Quick Tag Chips */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="text-[13px] font-bold text-gray-900 mb-2">키워드 태그 선택</div>
        <div className="flex flex-wrap gap-1.5">
          {availableTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                type="button"
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#0066FF] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Textarea */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="text-[14px] font-bold text-gray-900 mb-2">솔직한 맛·품질 후기</div>
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="맛, 식감, 당도, 가성비 등에 대한 솔직한 후기를 남겨주세요 (최소 10자 권장)"
          className="w-full bg-gray-50 rounded-xl p-3 text-[13px] text-gray-800 placeholder-gray-400 border border-gray-200 outline-none resize-none leading-relaxed focus:border-[#0066FF] focus:bg-white transition-colors"
        />
        <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
          <span>작성 시 +50P가 즉시 적립됩니다!</span>
          <span>{text.length}/500</span>
        </div>
      </div>

      {/* 7. Photo Attachment */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="text-[14px] font-bold text-gray-900 mb-2">
          음식 / 영수증 사진 첨부 <span className="text-gray-400 font-normal text-[12px]">(최대 3장)</span>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          multiple 
          onChange={handleImageUpload} 
          className="hidden" 
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#0066FF] flex flex-col items-center justify-center text-gray-500 text-xs gap-0.5 transition-colors"
          >
            <Camera className="w-5 h-5 text-gray-400" />
            <span className="text-[10px] font-bold">{images.length}/3</span>
          </button>

          {images.map((imgSrc, idx) => (
            <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200">
              <img src={imgSrc} alt="preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/70 text-white flex items-center justify-center text-[10px]"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Bottom Big Submit Button */}
      <div className="p-4 bg-white">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-3.5 bg-[#0066FF] hover:bg-blue-600 text-white font-black text-sm rounded-2xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <span>리뷰 등록하고 +50P 받기</span>
        </button>
      </div>

    </div>
  );
};

