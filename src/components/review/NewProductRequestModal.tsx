import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Store, 
  Tag, 
  Link as LinkIcon, 
  DollarSign, 
  Check, 
  Info,
  PackagePlus
} from 'lucide-react';
import { ProductCategory } from '../../types';
import { useApp } from '../../context/AppContext';

interface NewProductRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductName?: string;
  initialCategory?: ProductCategory | '전체' | string;
}

const CATEGORY_OPTIONS: ProductCategory[] = [
  '과자', 
  '음료', 
  '빵·디저트', 
  '간편식', 
  '패스트푸드', 
  '과일', 
  '식재료', 
  '고기·수산', 
  '아이스크림', 
  '기타'
];

const STORE_OPTIONS = [
  'GS25', 'CU', '세븐일레븐', '이마트24', '대형마트', '마켓컬리', '쿠팡', '배민B마트', '기타'
];

export const NewProductRequestModal: React.FC<NewProductRequestModalProps> = ({
  isOpen,
  onClose,
  initialProductName = '',
  initialCategory = '전체'
}) => {
  const { submitProductEditRequest, currentUser } = useApp();

  const [productName, setProductName] = useState(initialProductName);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<ProductCategory>(() => {
    if (initialCategory && initialCategory !== '전체' && CATEGORY_OPTIONS.includes(initialCategory as ProductCategory)) {
      return initialCategory as ProductCategory;
    }
    return '과자';
  });
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [price, setPrice] = useState('');
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // initialProductName이 바뀔 때 업데이트
  useEffect(() => {
    if (isOpen) {
      setProductName(initialProductName || '');
      if (initialCategory && initialCategory !== '전체' && CATEGORY_OPTIONS.includes(initialCategory as ProductCategory)) {
        setCategory(initialCategory as ProductCategory);
      }
    }
  }, [isOpen, initialProductName, initialCategory]);

  if (!isOpen) return null;

  const toggleStore = (store: string) => {
    if (selectedStores.includes(store)) {
      setSelectedStores(prev => prev.filter(s => s !== store));
    } else {
      setSelectedStores(prev => [...prev, store]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const storeText = selectedStores.length > 0 ? ` [판매처: ${selectedStores.join(', ')}]` : '';
      const priceText = price.trim() ? ` [예상/구매가격: ${price.trim()}]` : '';
      const catText = ` [카테고리: ${category}]`;
      const combinedSuggested = `${brand.trim() ? `[${brand.trim()}] ` : ''}${productName.trim()}${catText}${storeText}${priceText}`;

      const fullContent = content.trim() 
        ? `${content.trim()}\n${storeText}${priceText}`.trim()
        : `신규 상품 등록 요청: ${productName.trim()} (${category})${storeText}${priceText}`;

      const success = await submitProductEditRequest({
        productId: 'new_request_' + Date.now(),
        productName: productName.trim(),
        productBrand: brand.trim() || '미지정 / 제보요청',
        productImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
        requestType: 'new_product',
        content: fullContent,
        suggestedValue: combinedSuggested,
        sourceUrl: sourceUrl.trim() || undefined,
        requesterId: currentUser?.uid || 'guest_' + Math.random().toString(36).substring(2, 8),
        requesterName: currentUser?.displayName || '신상러버'
      });

      if (success) {
        setProductName('');
        setBrand('');
        setSelectedStores([]);
        setPrice('');
        setContent('');
        setSourceUrl('');
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-hidden shadow-2xl border border-gray-100 flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-emerald-500/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center shadow-xs">
              <PackagePlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
                신규 상품 등록 요청
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                  신상 제보
                </span>
              </h3>
              <p className="text-[11px] text-gray-500">원하시는 먹거리를 제보해주시면 빠르게 등록해드려요!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* 1. 상품명 (필수) */}
          <div className="space-y-1">
            <label className="font-extrabold text-gray-800 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-amber-500" />
              <span>상품명</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="예: 먹태깡 청양마요맛, 연세우유 딸기생크림빵"
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 transition-all"
            />
          </div>

          {/* 2. 브랜드 / 제조사 */}
          <div className="space-y-1">
            <label className="font-extrabold text-gray-800 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <span>브랜드 / 제조사</span>
              </span>
              <span className="text-[10px] text-gray-400">선택</span>
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="예: 농심, 오리온, CU, 스타벅스, 연세우유 등"
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-amber-500 focus:bg-white transition-all"
            />
          </div>

          {/* 3. 카테고리 선택 */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-gray-800 flex items-center gap-1">
              <span>카테고리</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_OPTIONS.map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                        : 'bg-slate-50 text-gray-600 border-gray-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. 판매처 / 편의점 선택 */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-gray-800 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-emerald-600" />
                <span>어디서 파나요? (판매처)</span>
              </span>
              <span className="text-[10px] text-gray-400">다중선택 가능</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {STORE_OPTIONS.map((st) => {
                const isSelected = selectedStores.includes(st);
                return (
                  <button
                    type="button"
                    key={st}
                    onClick={() => toggleStore(st)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all active:scale-95 flex items-center gap-1 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-extrabold ring-1 ring-emerald-500/20'
                        : 'bg-slate-50 text-gray-600 border-gray-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />}
                    <span>{st}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. 가격 / 행사 정보 */}
          <div className="space-y-1">
            <label className="font-extrabold text-gray-800 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-gray-500" />
                <span>가격 / 행사 정보</span>
              </span>
              <span className="text-[10px] text-gray-400">선택</span>
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="예: 2,000원, CU 1+1 행사중, 세일특가 1,800원"
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-amber-500 focus:bg-white transition-all"
            />
          </div>

          {/* 6. 상세 제보 내용 / 맛 설명 / 특징 */}
          <div className="space-y-1">
            <label className="font-extrabold text-gray-800 flex items-center justify-between">
              <span>상세 제보 내용 및 맛 특징</span>
              <span className="text-[10px] text-gray-400">선택</span>
            </label>
            <textarea
              rows={2}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="신상 특징이나 어울리는 조합, 꼭 리뷰하고 싶은 이유 등을 자유롭게 적어주세요."
              className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 outline-none resize-none focus:border-amber-500 focus:bg-white transition-all"
            />
          </div>

          {/* 7. 참고 링크 / 출처 */}
          <div className="space-y-1">
            <label className="font-extrabold text-gray-800 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <LinkIcon className="w-3.5 h-3.5 text-gray-400" />
                <span>참고 링크 / SNS / 편의점 공지</span>
              </span>
              <span className="text-[10px] text-gray-400">선택</span>
            </label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-amber-500 focus:bg-white transition-all"
            />
          </div>

          {/* Information banner */}
          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/70 flex items-start gap-2.5 text-[11px] text-amber-900">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5 leading-relaxed">
              <p className="font-bold">신상픽 운영진이 확인 후 카탈로그에 빠르게 등록해 드립니다!</p>
              <p className="text-[10px] text-amber-700">등록 완료되면 바로 리뷰를 작성하실 수 있습니다. 제보해주셔서 감사합니다. ✨</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 active:scale-95 transition-all text-xs"
            >
              닫기
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !productName.trim()}
              className="flex-2 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white font-extrabold shadow-md active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all flex items-center justify-center gap-1.5 text-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? '요청 접수 중...' : '상품 등록 요청하기'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
