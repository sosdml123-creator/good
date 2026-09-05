import React, { useState } from 'react';
import { X, MapPin, Navigation, Phone, ShoppingBag, Clock, CheckCircle2 } from 'lucide-react';
import { Product, NearbyStore } from '../../types';
import { useApp } from '../../context/AppContext';

interface NearbyStoreStockModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const NearbyStoreStockModal: React.FC<NearbyStoreStockModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { showToast } = useApp();
  const [selectedBrand, setSelectedBrand] = useState<string>('전체');
  const [currentLocation, setCurrentLocation] = useState<string>('서울 강남구 테헤란로 (역삼역 인근)');
  const [isChangingLoc, setIsChangingLoc] = useState(false);
  const [locInput, setLocInput] = useState('');
  const [reservedStoreId, setReservedStoreId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Simulated nearby stores
  const nearbyStores: NearbyStore[] = [
    {
      id: 'store-cu-01',
      brand: 'CU',
      name: 'CU 역삼타워점',
      distance: '130m',
      address: '서울 강남구 테헤란로 152 1층',
      phone: '02-552-3341',
      stockCount: 6,
      stockStatus: '여유',
      badge: '1+1 행사중',
      isOpen24h: true,
    },
    {
      id: 'store-gs-01',
      brand: 'GS25',
      name: 'GS25 르네상스사거리점',
      distance: '240m',
      address: '서울 강남구 테헤란로 210',
      phone: '02-567-8890',
      stockCount: 2,
      stockStatus: '품절임박',
      badge: '2+1 행사중',
      isOpen24h: true,
    },
    {
      id: 'store-7eleven-01',
      brand: '세븐일레븐',
      name: '세븐일레븐 테헤란로점',
      distance: '380m',
      address: '서울 강남구 역삼로 180',
      phone: '02-508-4432',
      stockCount: 0,
      stockStatus: '일시품절',
      badge: '내일 입고예정',
      isOpen24h: true,
    },
    {
      id: 'store-emart24-01',
      brand: '이마트24',
      name: '이마트24 역삼센트럴점',
      distance: '490m',
      address: '서울 강남구 언주로 312',
      phone: '02-539-1120',
      stockCount: 4,
      stockStatus: '여유',
      badge: '단독할인',
      isOpen24h: false,
    },
    {
      id: 'store-cu-02',
      brand: 'CU',
      name: 'CU 강남파이낸스점',
      distance: '620m',
      address: '서울 강남구 테헤란로 142',
      phone: '02-556-9921',
      stockCount: 5,
      stockStatus: '여유',
      badge: '1+1 행사중',
      isOpen24h: true,
    },
    {
      id: 'store-mart-01',
      brand: '대형마트',
      name: '이마트 역삼점 (지하식품관)',
      distance: '750m',
      address: '서울 강남구 역삼로 310',
      phone: '02-6900-1234',
      stockCount: 28,
      stockStatus: '여유',
      badge: '대용량 묶음할인',
      isOpen24h: false,
    },
  ];

  const filteredStores = selectedBrand === '전체'
    ? nearbyStores
    : nearbyStores.filter(s => s.brand === selectedBrand);

  const handleReserve = (store: NearbyStore) => {
    if (store.stockCount === 0) {
      showToast('현재 품절된 매장입니다. 입고 알림을 설정해주세요.', 'error');
      return;
    }
    setReservedStoreId(store.id);
    showToast(`🛍️ '${store.name}'에 픽업 예약이 완료되었습니다! (1시간 보관)`, 'success');
  };

  const handleOpenMap = (store: NearbyStore) => {
    const url = `https://map.naver.com/v5/search/${encodeURIComponent(store.name + ' ' + store.address)}`;
    window.open(url, '_blank');
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
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">내 주변 실시간 매장 재고</h2>
              <p className="text-[11px] text-gray-500">반경 1km 편의점 & 마트 재고 현황</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Product Summary */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-12 h-12 rounded-xl object-cover border border-gray-200 bg-white shrink-0" 
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-[#0066FF] bg-blue-50 px-1.5 py-0.5 rounded">
              {product.brand}
            </span>
            <div className="text-xs font-bold text-gray-900 truncate mt-0.5">{product.name}</div>
            <div className="text-xs font-black text-gray-900 mt-0.5">{product.price.toLocaleString()}원</div>
          </div>
        </div>

        {/* Location Bar */}
        <div className="px-4 py-2.5 bg-white border-b border-gray-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-gray-700 min-w-0 flex-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate font-semibold">{currentLocation}</span>
          </div>
          <button
            onClick={() => setIsChangingLoc(!isChangingLoc)}
            className="text-[11px] text-[#0066FF] font-bold hover:underline shrink-0 ml-2"
          >
            {isChangingLoc ? '닫기' : '위치변경'}
          </button>
        </div>

        {/* Location Change Accordion */}
        {isChangingLoc && (
          <div className="p-3 bg-blue-50/60 border-b border-blue-100 space-y-2">
            <div className="flex gap-1.5">
              <input
                type="text"
                value={locInput}
                onChange={(e) => setLocInput(e.target.value)}
                placeholder="동/역 이름 입력 (예: 강남역, 홍대입구)"
                className="flex-1 bg-white border border-blue-200 rounded-xl px-3 py-1.5 text-xs text-gray-800 outline-none placeholder-gray-400"
              />
              <button
                onClick={() => {
                  if (locInput.trim()) {
                    setCurrentLocation(locInput.trim() + ' 인근');
                    setIsChangingLoc(false);
                    setLocInput('');
                    showToast('📍 탐색 위치가 변경되었습니다.');
                  }
                }}
                className="px-3 py-1.5 bg-[#0066FF] text-white text-xs font-bold rounded-xl"
              >
                적용
              </button>
            </div>
            <div className="flex gap-1.5 text-[11px] text-gray-600 flex-wrap">
              <span className="text-gray-400">추천:</span>
              {['강남역', '홍대입구역', '여의도', '판교역'].map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setCurrentLocation(`${loc} 인근`);
                    setIsChangingLoc(false);
                    showToast(`📍 '${loc}' 주변 매장으로 갱신되었습니다.`);
                  }}
                  className="bg-white px-2 py-0.5 rounded-md border border-blue-200 hover:bg-blue-100 text-blue-700"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Brand Filter Pills */}
        <div className="px-4 py-2 border-b border-gray-100 flex gap-1.5 overflow-x-auto no-scrollbar bg-white">
          {['전체', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'].map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all ${
                selectedBrand === brand
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Stores List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-gray-100">
          {filteredStores.map((store) => {
            const isReserved = reservedStoreId === store.id;

            return (
              <div key={store.id} className="pt-2.5 first:pt-0 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-gray-100 text-gray-700">
                        {store.brand}
                      </span>
                      <span className="text-xs font-bold text-gray-900">{store.name}</span>
                      {store.badge && (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                          {store.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">{store.address}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-black text-gray-900 flex items-center gap-1 justify-end">
                      <Navigation className="w-3 h-3 text-[#0066FF]" />
                      <span>{store.distance}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md inline-block mt-0.5 ${
                      store.stockCount > 2
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : store.stockCount > 0
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-gray-100 text-gray-400'
                    }`}>
                      {store.stockCount > 0 ? `재고 ${store.stockCount}개 남음` : '품절 (입고대기)'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleReserve(store)}
                    disabled={store.stockCount === 0 || isReserved}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isReserved
                        ? 'bg-emerald-600 text-white'
                        : store.stockCount > 0
                          ? 'bg-[#0066FF] hover:bg-blue-700 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isReserved ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>예약 완료 (방문 수령)</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{store.stockCount > 0 ? '매장 픽업 예약하기' : '재고 없음'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleOpenMap(store)}
                    className="p-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                    title="지도 길찾기"
                  >
                    <Navigation className="w-4 h-4 text-gray-600" />
                  </button>

                  <a
                    href={`tel:${store.phone}`}
                    className="p-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
                    title="전화 문의"
                  >
                    <Phone className="w-4 h-4 text-gray-600" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1">
          <Clock className="w-3 h-3" />
          <span>매장별 재고 데이터는 각사 POS 연동 기준으로 실시간 자동 갱신됩니다.</span>
        </div>

      </div>
    </div>
  );
};
