import {
  AdMob,
  BannerAdPluginEvents,
} from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// Google AdMob 공식 앱 ID & 배너 광고 단위 ID
export const ADMOB_APP_ID = 'ca-app-pub-3878859120989916~2898554632';
export const ADMOB_CLIENT_ID = 'ca-pub-3878859120989916';
export const ADMOB_BANNER_UNIT_ID = 'ca-app-pub-3878859120989916/9433572199'; // 홈 피드 메인 배너
export const ADMOB_SEARCH_BANNER_UNIT_ID = 'ca-app-pub-3878859120989916/1040251860'; // 검색창 추천 슬롯 배너
export const ADMOB_SLOT_ID = '9433572199';
export const ADMOB_HOME_SLOT_ID = '9433572199';
export const ADMOB_SEARCH_SLOT_ID = '1040251860';

// 고정 배너 사이즈 (320x50 표준 모바일 배너)
export const BANNER_HEIGHT = 50;
export const BANNER_WIDTH = 320;

let initPromise: Promise<boolean> | null = null;
let listenersAdded = false;

export const isNative = () => Capacitor.isNativePlatform();

/**
 * iOS 노치 / 다이내믹 아일랜드 Safe Area Inset Top 측정 (pt 단위)
 */
export const getSafeAreaTop = (): number => {
  if (typeof window === 'undefined') return 0;
  try {
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;top:0;left:0;padding-top:env(safe-area-inset-top, 0px);visibility:hidden;pointer-events:none;';
    document.body.appendChild(el);
    const val = parseFloat(window.getComputedStyle(el).paddingTop) || 0;
    document.body.removeChild(el);
    if (val > 0) return val;
  } catch {}
  return Capacitor.getPlatform() === 'ios' ? 47 : 0;
};

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

      if (!listenersAdded) {
        listenersAdded = true;
        AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
          console.log('[AdMob] Banner loaded successfully:', ADMOB_BANNER_UNIT_ID);
        });
        AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (e) => {
          console.warn('[AdMob] Banner failed to load:', e);
        });
        AdMob.addListener(BannerAdPluginEvents.Opened, () => {
          console.log('[AdMob] Banner clicked');
        });
        AdMob.addListener(BannerAdPluginEvents.Closed, () => {
          console.log('[AdMob] Banner closed');
        });
      }

      // 화면에 따로 떠서 따라다니는 네이티브 플로팅 오버레이 완전 제거
      await AdMob.removeBanner().catch(() => {});
      return true;
    } catch (e) {
      console.warn('[AdMob] Init failed:', e);
      initPromise = null;
      return false;
    }
  })();
  return initPromise;
};

/**
 * 네이티브 플로팅 오버레이 배너 완전 제거 (화면 따라다님 방지)
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
export const showBannerAt = () => Promise.resolve();
export const showBannerAtSlot = () => Promise.resolve();
export const showBanner = () => Promise.resolve();
export const showHomeBannerAd = () => Promise.resolve();
export const showSearchBannerAd = () => Promise.resolve();
export const hideBannerAd = hideBanner;
export const resumeBannerAd = resumeBanner;
export const removeBannerAd = removeBanner;
export const isHomeBannerVisible = (): boolean => false;




