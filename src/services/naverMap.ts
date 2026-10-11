import { Capacitor } from '@capacitor/core';
import { fetchWithTimeout } from '../utils/networkUtils';
import { NearbyStore } from '../types';

// NCP Maps Dynamic Map Client ID — 브라우저에 노출되는 공개 값입니다 (사용 도메인은 NCP 콘솔의 Web 서비스 URL로 제한).
const NAVER_MAP_KEY_ID = 'piri75axi1';

const API_URL = `${Capacitor.isNativePlatform() ? 'https://www.sinsangpick.kr' : ''}/api/naver`;

export interface LatLng {
  lat: number;
  lng: number;
}

let sdkPromise: Promise<any> | null = null;

/** NAVER 지도 JS SDK를 한 번만 로드합니다. 인증 실패(등록되지 않은 도메인 등) 시 reject. */
export const loadNaverMapSdk = (): Promise<any> => {
  const w = window as any;
  if (w.naver?.maps?.Map) return Promise.resolve(w.naver.maps);
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<any>((resolve, reject) => {
    const fail = (message: string) => {
      sdkPromise = null;
      reject(new Error(message));
    };
    w.navermap_authFailure = () => fail('네이버 지도 인증에 실패했습니다.');

    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_KEY_ID}`;
    script.async = true;
    script.onload = () => (w.naver?.maps?.Map ? resolve(w.naver.maps) : fail('네이버 지도를 불러오지 못했습니다.'));
    script.onerror = () => {
      script.remove();
      fail('네이버 지도를 불러오지 못했습니다.');
    };
    document.head.appendChild(script);
  });
  return sdkPromise;
};

export const getCurrentPosition = (): Promise<LatLng> =>
  new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      reject(new Error('이 기기에서는 위치 정보를 사용할 수 없습니다.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) =>
        reject(
          new Error(
            err.code === err.PERMISSION_DENIED
              ? '위치 권한이 꺼져 있습니다. 기기 설정에서 위치 권한을 허용해 주세요.'
              : '현재 위치를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.'
          )
        ),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });

const distanceMeters = (a: LatLng, b: LatLng): number => {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(6371000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)));
};

export const formatDistance = (m: number): string => (m < 1000 ? `${m}m` : `${(m / 1000).toFixed(1)}km`);

/**
 * 현재 위치 주변의 실제 매장을 조회합니다 (서버 프록시 → Reverse Geocoding + 네이버 지역 검색).
 * 서버에는 약 100m 단위로 반올림한 좌표만 보내고, 거리는 기기에서 정확한 좌표로 계산합니다.
 */
export const fetchNearbyStores = async (
  position: LatLng,
  brand: string
): Promise<{ location: string; stores: NearbyStore[] }> => {
  const lat = position.lat.toFixed(3);
  const lng = position.lng.toFixed(3);
  const res = await fetchWithTimeout(
    `${API_URL}?type=nearby_stores&lat=${lat}&lng=${lng}&brand=${encodeURIComponent(brand)}`,
    undefined,
    12000
  );
  if (!res.ok) throw new Error(`nearby_stores failed: ${res.status}`);
  const data = await res.json();

  const stores: NearbyStore[] = (data.stores || [])
    .map((s: Omit<NearbyStore, 'distance'>) => ({ ...s, distance: distanceMeters(position, s) }))
    .sort((a: NearbyStore, b: NearbyStore) => a.distance - b.distance);
  return { location: data.location || '', stores };
};
