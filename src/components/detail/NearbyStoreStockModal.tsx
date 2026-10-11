import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X, MapPin, Navigation, Phone, RefreshCw, LocateFixed } from 'lucide-react';
import { Product, NearbyStore } from '../../types';
import {
  LatLng,
  fetchNearbyStores,
  formatDistance,
  getCurrentPosition,
  loadNaverMapSdk,
} from '../../services/naverMap';

interface NearbyStoreStockModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const BRANDS = ['전체', 'CU', 'GS25', '세븐일레븐', '이마트24'];

const BRAND_COLORS: Record<string, string> = {
  CU: '#652d90',
  GS25: '#0077c8',
  세븐일레븐: '#008061',
  이마트24: '#f5a800',
};

const storePin = (store: NearbyStore, active: boolean) =>
  `<div style="transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center;">
    <div style="background:${BRAND_COLORS[store.brand] || '#111827'};color:#fff;font-size:10px;font-weight:800;padding:3px 7px;border-radius:999px;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,.35);border:2px solid ${active ? '#111827' : '#fff'};">${store.brand}</div>
    <div style="width:2px;height:6px;background:#111827;"></div>
  </div>`;

const MY_PIN =
  '<div style="transform:translate(-50%,-50%);width:16px;height:16px;border-radius:50%;background:#2563eb;border:3px solid #fff;box-shadow:0 0 0 4px rgba(37,99,235,.25);"></div>';

export const NearbyStoreStockModal: React.FC<NearbyStoreStockModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>(
    BRANDS.includes(product.brand) ? product.brand : '전체'
  );
  const [position, setPosition] = useState<LatLng | null>(null);
  const [locationLabel, setLocationLabel] = useState('');
  const [locationError, setLocationError] = useState('');
  const [stores, setStores] = useState<NearbyStore[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [storeError, setStoreError] = useState('');
  const [mapError, setMapError] = useState('');
  const [activeStoreId, setActiveStoreId] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const locate = useCallback(() => {
    setLocationError('');
    getCurrentPosition()
      .then(setPosition)
      .catch((e: Error) => setLocationError(e.message));
  }, []);

  // 열릴 때 현재 위치 확인, 닫힐 때 지도 정리
  useEffect(() => {
    if (isOpen) {
      locate();
      return;
    }
    markersRef.current = [];
    mapRef.current?.destroy?.();
    mapRef.current = null;
    setMapReady(false);
  }, [isOpen, locate]);

  // 주변 매장 조회
  const loadStores = useCallback(() => {
    if (!position) return;
    let cancelled = false;
    setIsLoading(true);
    setStoreError('');
    fetchNearbyStores(position, selectedBrand)
      .then((data) => {
        if (cancelled) return;
        setStores(data.stores);
        setLocationLabel(data.location);
      })
      .catch(() => {
        if (cancelled) return;
        setStores([]);
        setStoreError('주변 매장 정보를 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [position, selectedBrand]);

  useEffect(() => {
    if (!isOpen) return;
    return loadStores();
  }, [isOpen, loadStores]);

  // 지도 생성 (현재 위치 확보 후 1회)
  useEffect(() => {
    if (!isOpen || !position || mapRef.current) return;
    let cancelled = false;
    setMapError('');
    loadNaverMapSdk()
      .then((maps) => {
        if (cancelled || !mapElRef.current) return;
        const center = new maps.LatLng(position.lat, position.lng);
        mapRef.current = new maps.Map(mapElRef.current, {
          center,
          zoom: 16,
          scaleControl: false,
          mapDataControl: false,
          logoControlOptions: { position: maps.Position.BOTTOM_LEFT },
        });
        new maps.Marker({ position: center, map: mapRef.current, icon: { content: MY_PIN }, zIndex: 10 });
        setMapReady(true);
      })
      .catch((e: Error) => {
        if (!cancelled) setMapError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, position]);

  // 매장 마커 갱신
  useEffect(() => {
    const maps = (window as any).naver?.maps;
    if (!mapReady || !mapRef.current || !maps || !position) return;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = stores.map((store) => {
      const marker = new maps.Marker({
        position: new maps.LatLng(store.lat, store.lng),
        map: mapRef.current,
        icon: { content: storePin(store, store.id === activeStoreId) },
        zIndex: store.id === activeStoreId ? 5 : 1,
      });
      maps.Event.addListener(marker, 'click', () => setActiveStoreId(store.id));
      return marker;
    });
  }, [mapReady, stores, activeStoreId, position]);

  // 조회 결과가 바뀌면 내 위치와 가까운 매장들이 한 화면에 들어오게 맞춤
  useEffect(() => {
    const maps = (window as any).naver?.maps;
    if (!mapReady || !mapRef.current || !maps || !position || stores.length === 0) return;
    const bounds = new maps.LatLngBounds(
      new maps.LatLng(position.lat, position.lng),
      new maps.LatLng(position.lat, position.lng)
    );
    stores.slice(0, 5).forEach((s) => bounds.extend(new maps.LatLng(s.lat, s.lng)));
    mapRef.current.fitBounds(bounds, { top: 40, right: 30, bottom: 20, left: 30 });
  }, [mapReady, stores, position]);

  if (!isOpen) return null;

  const focusStore = (store: NearbyStore) => {
    setActiveStoreId(store.id);
    const maps = (window as any).naver?.maps;
    if (mapRef.current && maps) mapRef.current.panTo(new maps.LatLng(store.lat, store.lng));
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
              <h2 className="text-sm font-bold text-gray-900">내 주변 편의점</h2>
              <p className="text-[11px] text-gray-500">현재 위치에서 가까운 매장을 지도로 확인하세요</p>
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
            <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
              {product.brand}
            </span>
            <div className="text-xs font-bold text-gray-900 truncate mt-0.5">{product.name}</div>
            <div className="text-xs font-black text-gray-900 mt-0.5">{product.price.toLocaleString()}원</div>
          </div>
        </div>

        {locationError ? (
          /* 위치를 확인하지 못한 경우 */
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center gap-3">
            <LocateFixed className="w-8 h-8 text-gray-300" />
            <p className="text-xs text-gray-600 leading-relaxed">{locationError}</p>
            <button
              onClick={locate}
              className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <>
            {/* Location Bar */}
            <div className="px-4 py-2.5 bg-white border-b border-gray-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-gray-700 min-w-0 flex-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate font-semibold">
                  {locationLabel || (position ? '주변 매장 찾는 중…' : '현재 위치 확인 중…')}
                </span>
              </div>
              <button
                onClick={locate}
                disabled={isLoading}
                className="p-1 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 shrink-0 ml-2"
                title="현재 위치로 다시 찾기"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
              </button>
            </div>

            {/* Map */}
            {mapError ? (
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 text-[11px] text-gray-500 text-center">
                {mapError} 아래 목록에서 매장을 확인할 수 있습니다.
              </div>
            ) : (
              <div ref={mapElRef} className="w-full h-52 shrink-0 bg-gray-100 border-b border-gray-100" />
            )}

            {/* Brand Filter Pills */}
            <div className="px-4 py-2 border-b border-gray-100 flex gap-1.5 overflow-x-auto no-scrollbar bg-white shrink-0">
              {BRANDS.map((brand) => (
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
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-gray-100 min-h-24">
              {storeError ? (
                <div className="py-6 text-center space-y-2">
                  <p className="text-xs text-gray-500">{storeError}</p>
                  <button onClick={loadStores} className="text-xs font-bold text-gray-900 underline">
                    다시 시도
                  </button>
                </div>
              ) : stores.length === 0 ? (
                <p className="py-6 text-center text-xs text-gray-400">
                  {isLoading || !position ? '주변 매장을 찾는 중입니다…' : '가까운 곳에서 매장을 찾지 못했습니다.'}
                </p>
              ) : (
                stores.map((store) => (
                  <div
                    key={store.id}
                    onClick={() => focusStore(store)}
                    className={`pt-2.5 first:pt-0 flex items-center gap-2 cursor-pointer ${
                      activeStoreId === store.id ? 'opacity-100' : 'opacity-90'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white shrink-0"
                          style={{ backgroundColor: BRAND_COLORS[store.brand] || '#111827' }}
                        >
                          {store.brand}
                        </span>
                        <span className={`text-xs truncate ${activeStoreId === store.id ? 'font-black text-gray-900' : 'font-bold text-gray-900'}`}>
                          {store.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5 truncate">{store.address}</p>
                    </div>

                    <div className="text-xs font-black text-gray-900 flex items-center gap-1 shrink-0">
                      <Navigation className="w-3 h-3 text-gray-700" />
                      <span>{formatDistance(store.distance)}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenMap(store);
                      }}
                      className="p-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shrink-0"
                      title="네이버 지도에서 길찾기"
                    >
                      <Navigation className="w-4 h-4 text-gray-600" />
                    </button>

                    {store.phone && (
                      <a
                        href={`tel:${store.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center shrink-0"
                        title="전화 문의"
                      >
                        <Phone className="w-4 h-4 text-gray-600" />
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Footer Note */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center text-[11px] text-gray-400">
          매장 위치는 네이버 지도 기준이며, 재고는 매장에 직접 확인해 주세요.
        </div>

      </div>
    </div>
  );
};
