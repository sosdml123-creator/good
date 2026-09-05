import React, { useState } from 'react';
import { X, Bell, Check, Smartphone, MessageCircle } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';

interface ProductStockAlertModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductStockAlertModal: React.FC<ProductStockAlertModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { showToast } = useApp();

  const storeOptions = [
    { id: 'CU', label: 'CU 편의점' },
    { id: 'GS25', label: 'GS25 편의점' },
    { id: '세븐일레븐', label: '세븐일레븐' },
    { id: '이마트24', label: '이마트24' },
    { id: '마켓컬리', label: '마켓컬리 (새벽배송)' },
    { id: '쿠팡프레시', label: '쿠팡 로켓프레시' },
    { id: '대형마트', label: '대형마트 (이마트/홈플러스)' },
  ];

  const [selectedStores, setSelectedStores] = useState<string[]>(['CU', 'GS25']);
  const [notifyChannels, setNotifyChannels] = useState<{ push: boolean; kakao: boolean }>({
    push: true,
    kakao: true,
  });
  const [alertOnEvent, setAlertOnEvent] = useState(true);

  if (!isOpen) return null;

  const toggleStore = (storeId: string) => {
    if (selectedStores.includes(storeId)) {
      if (selectedStores.length === 1) {
        showToast('최소 1개 이상의 판매처를 선택해주세요.', 'info');
        return;
      }
      setSelectedStores(prev => prev.filter(s => s !== storeId));
    } else {
      setSelectedStores(prev => [...prev, storeId]);
    }
  };

  const handleSave = () => {
    showToast(`🔔 '${product.name}' 입고 알림이 성공적으로 설정되었습니다!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0066FF] flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">실시간 입고 알림 신청</h2>
              <p className="text-[11px] text-gray-500">원하는 판매처에 입고 즉시 알려드려요</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Card */}
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-14 h-14 rounded-2xl object-cover border border-gray-200 bg-white shrink-0" 
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-[#0066FF] bg-blue-50 px-1.5 py-0.5 rounded">
              {product.brand} · {product.category}
            </span>
            <div className="text-xs font-bold text-gray-900 truncate mt-0.5">{product.name}</div>
            <div className="text-xs font-black text-gray-900 mt-0.5">{product.price.toLocaleString()}원</div>
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
          
          {/* 1. Store Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-900">1. 알림받을 판매처 선택</span>
              <span className="text-[11px] text-[#0066FF] font-semibold">{selectedStores.length}개 선택됨</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {storeOptions.map((st) => {
                const isChecked = selectedStores.includes(st.id);

                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => toggleStore(st.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isChecked
                        ? 'border-[#0066FF] bg-blue-50/50 text-[#0066FF] font-bold shadow-2xs'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xs truncate">{st.label}</span>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      isChecked ? 'bg-[#0066FF] text-white' : 'border border-gray-300'
                    }`}>
                      {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Notification Method */}
          <div>
            <span className="font-bold text-gray-900 block mb-2">2. 알림 발송 채널</span>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white cursor-pointer hover:bg-gray-50">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-gray-600" />
                  <div>
                    <span className="font-bold text-gray-900 block">앱 푸시 알림</span>
                    <span className="text-[11px] text-gray-400">입고 즉시 스마트폰 알림</span>
                  </div>
                </div>
                <input 
                  type="checkbox"
                  checked={notifyChannels.push}
                  onChange={(e) => setNotifyChannels(prev => ({ ...prev, push: e.target.checked }))}
                  className="w-4 h-4 text-[#0066FF] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white cursor-pointer hover:bg-gray-50">
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-amber-500" />
                  <div>
                    <span className="font-bold text-gray-900 block">카카오톡 알림톡</span>
                    <span className="text-[11px] text-gray-400">플러스친구 공식 알림톡 수신</span>
                  </div>
                </div>
                <input 
                  type="checkbox"
                  checked={notifyChannels.kakao}
                  onChange={(e) => setNotifyChannels(prev => ({ ...prev, kakao: e.target.checked }))}
                  className="w-4 h-4 text-[#0066FF] rounded"
                />
              </label>
            </div>
          </div>

          {/* 3. Event options */}
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 flex items-center justify-between">
            <div className="pr-2">
              <span className="font-bold text-gray-900 block">1+1 / 2+1 행사 시작 시 알림</span>
              <span className="text-[11px] text-amber-800">해당 편의점에서 프로모션 행사 시작 시 추가 알림</span>
            </div>
            <input 
              type="checkbox"
              checked={alertOnEvent}
              onChange={(e) => setAlertOnEvent(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded"
            />
          </div>

        </div>

        {/* Footer Submit Button */}
        <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
          <button
            onClick={onClose}
            className="w-1/3 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="w-2/3 py-3 rounded-2xl bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-bold shadow-md active:scale-98 transition-transform flex items-center justify-center gap-1.5"
          >
            <Bell className="w-4 h-4" />
            <span>입고 알림 신청 완료</span>
          </button>
        </div>

      </div>
    </div>
  );
};
