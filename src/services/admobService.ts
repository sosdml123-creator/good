import {
  AdMob,
} from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// Google AdMob 공식 앱 ID & 배너 광고 단위 ID
export const ADMOB_APP_ID = 'ca-app-pub-3878859120989916~2898554632';
export const ADMOB_CLIENT_ID = 'ca-pub-3878859120989916';
export const ADMOB_BANNER_UNIT_ID = 'ca-app-pub-3878859120989916/9433572199';
export const ADMOB_SLOT_ID = '9433572199';

// 고정 배너 사이즈 (320x50 표준 규격)
export const BANNER_HEIGHT = 50;
export const BANNER_WIDTH = 320;

let initPromise: Promise<boolean> | null = null;

export const isNative = () => Capacitor.isNativePlatform();

/**
 * AdMob SDK 초기화 (iOS/Android 네이티브)
 */
export const initAdMob = (): Promise<boolean> => {
  if (!isNative()) return Promise.resolve(false);
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      await AdMob.initialize({ initializeForTesting: false });

      if (Capacitor.getPlatform() === 'ios') {
        try {
          const { status } = await AdMob.trackingAuthorizationStatus();
          if (status === 'notDetermined') {
            await AdMob.requestTrackingAuthorization();
          }
        } catch (e) {
          console.warn('[AdMob] tracking auth notice:', e);
        }
      }

      // 화면에 따로 떨어져 떠 있는 네이티브 플로팅 오버레이 완전 제거
      await AdMob.removeBanner().catch(() => {});
      return true;
    } catch (e) {
      console.warn('[AdMob] Init notice:', e);
      initPromise = null;
      return false;
    }
  })();
  return initPromise;
};

/**
 * 네이티브 플로팅 오버레이 배너 완전 제거
 */
export const removeBanner = async (): Promise<void> => {
  if (!isNative()) return;
  try {
    await AdMob.removeBanner().catch(() => {});
    console.log('[AdMob] Native floating overlay removed');
  } catch (e) {
    console.warn('[AdMob] removeBanner notice:', e);
  }
};

export const hideBanner = removeBanner;
export const resumeBanner = () => Promise.resolve();
export const showBannerAtSlot = () => Promise.resolve();
export const showBannerAt = () => Promise.resolve();
export const showBanner = () => Promise.resolve();
export const showHomeBannerAd = () => Promise.resolve();
export const hideBannerAd = hideBanner;
export const resumeBannerAd = resumeBanner;
export const removeBannerAd = removeBanner;
export const isHomeBannerVisible = (): boolean => false;
export const getSafeAreaTop = (): number => 0;



