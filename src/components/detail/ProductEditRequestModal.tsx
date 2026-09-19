import React, { useState } from 'react';
import { 
  X, 
  Edit3, 
  Send, 
  AlertCircle, 
  DollarSign, 
  Store, 
  Apple, 
  Tag, 
  Image as ImageIcon, 
  Ban, 
  FileText
} from 'lucide-react';
import { Product, ProductEditType } from '../../types';
import { useApp } from '../../context/AppContext';
import { SafeImage } from '../common/SafeImage';

interface ProductEditRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const EDIT_TYPE_OPTIONS: { type: ProductEditType; label: string; icon: any; placeholder: string; desc: string }[] = [
  {
    type: 'price',
    label: '가격 오류 (정가 / 행사가격)',
    icon: DollarSign,
    placeholder: '정정 가격: 예) 2,500원 -> 2,000원',
    desc: '실제 판매 가격이나 할인 가격이 다른 경우'
  },
  {
    type: 'store_event',
    label: '판매처 및 1+1 / 2+1 행사 추가',
    icon: Store,
    placeholder: '판매처/행사: 예) GS25 1+1 행사 진행중, 세븐일레븐 입고',
    desc: '새로 판매를 시작한 편의점/마트나 행사 정보'
  },
  {
    type: 'nutrition',
    label: '영양성분 · 칼로리 · 알레르기 오류',
    icon: Apple,
    placeholder: '영양성분: 예) 칼로리 280kcal, 나트륨 320mg, 대두 알레르기 포함',
    desc: '패키지 표기 영양성분이나 성분 정보 오류'
  },
  {
    type: 'name_brand',
    label: '상품명 · 브랜드 · 카테고리 오류',
    icon: Tag,
    placeholder: '상품명/브랜드: 예) 오리온 -> 해태, 카테고리 스낵으로 변경',
    desc: '제품명 오타, 제조사 명칭, 카테고리 분류 오류'
  },
  {
    type: 'image',
    label: '대표 사진 / 패키지 이미지 교체',
    icon: ImageIcon,
    placeholder: '이미지 제보: 올바른 패키지 이미지 링크 또는 설명',
    desc: '화질이 낮거나 실제 제품 패키지와 다른 사진'
  },
  {
    type: 'discontinued',
    label: '단종 및 판매 중단 제보',
    icon: Ban,
    placeholder: '단종 사유: 예) 본사 공식 단종 발표, 9월부 판매 종료',
    desc: '더 이상 생산되지 않거나 판매가 중단된 제품'
  },
  {
    type: 'other',
    label: '기타 상세 정보 수정',
    icon: FileText,
    placeholder: '기타 수정 내용 입력',
    desc: '용량, 맛 설명, 원산지 등 기타 정보'
  }
];

export const ProductEditRequestModal: React.FC<ProductEditRequestModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const { submitProductEditRequest, currentUser } = useApp();

  const [selectedType, setSelectedType] = useState<ProductEditType>('price');
  const [content, setContent] = useState('');
  const [suggestedValue, setSuggestedValue] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentOption = EDIT_TYPE_OPTIONS.find(o => o.type === selectedType) || EDIT_TYPE_OPTIONS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !suggestedValue.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await submitProductEditRequest({
        productId: product.id,
        productName: product.name,
        productBrand: product.brand,
        productImage: product.image,
        requestType: selectedType,
        content: content.trim() || `${currentOption.label} 수정 요청`,
        suggestedValue: suggestedValue.trim() || undefined,
        sourceUrl: sourceUrl.trim() || undefined,
        requesterId: currentUser?.uid || 'guest_' + Math.random().toString(36).substring(2, 8),
        requesterName: currentUser?.displayName || '익명 신상러버'
      });

      if (success) {
        setContent('');
        setSuggestedValue('');
        setSourceUrl('');
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-hidden shadow-2xl border border-gray-100 flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 via-white to-indigo-50/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">제품 정보 수정 요청</h3>
              <p className="text-[10px] text-gray-500">정확한 신제품 정보를 위해 직접 제보해주세요</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Compact Header */}
        <div className="px-4 py-3 bg-slate-50 border-b border-gray-100 flex items-center gap-3">
          <SafeImage
            src={product.image}
            alt={product.name}
            fallbackCategory={product.category}
            fallbackName={product.name}
            className="w-11 h-11 rounded-xl object-cover border border-gray-200 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-indigo-600">{product.brand}</span>
            </div>
            <p className="text-xs font-bold text-gray-900 truncate mt-0.5">{product.name}</p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* 1. Edit Type Selection */}
          <div className="space-y-1.5">
            <label className="font-bold text-gray-800 flex items-center gap-1">
              <span>수정 요청 항목 선택</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {EDIT_TYPE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedType === opt.type;
                return (
                  <button
                    type="button"
                    key={opt.type}
                    onClick={() => setSelectedType(opt.type)}
                    className={`text-left p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold shadow-2xs'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold truncate">{opt.label}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Suggested Value / Input */}
          <div className="space-y-1">
            <label className="font-bold text-gray-800 flex items-center justify-between">
              <span>정정할 올바른 정보 (간략 요약)</span>
              <span className="text-[10px] text-indigo-600 font-semibold">선택</span>
            </label>
            <input
              type="text"
              value={suggestedValue}
              onChange={(e) => setSuggestedValue(e.target.value)}
              placeholder={currentOption.placeholder}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none focus:border-indigo-600 focus:bg-white transition-all"
            />
          </div>

          {/* 3. Detailed Description */}
          <div className="space-y-1">
            <label className="font-bold text-gray-800 flex items-center gap-1">
              <span>상세 제보 내용</span>
              <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder={`어떤 정보가 어떻게 다른지 자세히 알려주시면 검토 후 신속히 반영됩니다.\n예시: ${currentOption.desc}`}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 outline-none resize-none focus:border-indigo-600 focus:bg-white transition-all"
            />
          </div>

          {/* 4. Reference URL */}
          <div className="space-y-1">
            <label className="font-bold text-gray-800 flex items-center justify-between">
              <span>참고 출처 / 링크 (공식몰, 행사 공지 등)</span>
              <span className="text-[10px] text-gray-400">선택</span>
            </label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none focus:border-indigo-600 focus:bg-white transition-all"
            />
          </div>

          {/* Info Notice */}
          <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-2 text-[11px] text-indigo-900">
            <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">관리자 검토 후 어드민에서 즉시 상품에 반영됩니다.</p>
              <p className="text-[10px] text-indigo-700">제보해주신 소중한 정보는 다른 신상러버분들에게 큰 도움이 됩니다. 감사합니다! 🙏</p>
            </div>
          </div>

          {/* Submit Action Buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (!content.trim() && !suggestedValue.trim())}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? '접수 중...' : '수정 요청 제출하기'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
