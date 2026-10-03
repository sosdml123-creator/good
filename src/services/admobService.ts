import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
  AdMobInitializationOptions,
  BannerAdPluginEvents,
} from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// ─────────────────────────────────────────────────────────────────
// Google AdMob 공식 앱 ID & 광고 단위 ID
// ─────────────────────────────────────────────────────────────────
export const ADMOB_APP_ID = 'ca-app-pub-3878859120989916~2898554632';
export const ADMOB_BANNER_UNIT_ID = 'ca-app-pub-3878859120989916/9433572199';

export const ADMOB_CONFIG = {
  appId: ADMOB_APP_ID,
  bannerAdUnitId: ADMOB_BANNER_UNIT_ID,
};

let isInitialized = false;
let isNativeBannerActive = false;
let eventListenersAdded = false;

const setupEventListeners = () => {
  if (eventListenersAdded) return;
  try {
    AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
      console.log('[AdMob] Native banner loaded successfully');
    });
    AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (err) => {
      console.warn('[AdMob] Native banner failed to load:', err);
    });
    eventListenersAdded = true;
  } catch (e) {
    console.warn('[AdMob] Event listener setup notice:', e);
  }
};

/**
 * AdMob SDK 초기화 (iOS/Android 네이티브)
 */
export const initAdMob = async (): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) return false;
  if (isInitialized) return true;

  try {
    const options: AdMobInitializationOptions = {
      initializeForTesting: false,
    };
    await AdMob.initialize(options);
    isInitialized = true;
    setupEventListeners();
    console.log('[AdMob] SDK initialized successfully with App ID:', ADMOB_APP_ID);

    // iOS ATT 추적 권한 요청
    if (Capacitor.getPlatform() === 'ios') {
      try {
        const { status } = await AdMob.trackingAuthorizationStatus();
        if (status === 'notDetermined') {
          await AdMob.requestTrackingAuthorization();
        }
      } catch (attErr) {
        console.warn('[AdMob] ATT authorization check notice:', attErr);
      }
    }

    return true;
  } catch (error) {
    console.warn('[AdMob] SDK initialization notice:', error);
    return false;
  }
};

/**
 * 네이티브 배너 표시
 */
export const showBanner = async (): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) return false;

  try {
    await initAdMob();

    if (isNativeBannerActive) {
      await AdMob.resumeBanner().catch(() => {});
      return true;
    }

    const options: BannerAdOptions = {
      adId: ADMOB_BANNER_UNIT_ID,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 56, // 하단 탭바 높이만큼 여백
      isTesting: false,
    };

    await AdMob.showBanner(options);
    isNativeBannerActive = true;
    console.log('[AdMob] Native banner requested with Unit ID:', ADMOB_BANNER_UNIT_ID);
    return true;
  } catch (error) {
    console.warn('[AdMob] showBanner notice:', error);
    return false;
  }
};

/**
 * 네이티브 배너 일시 숨김 (모달 등)
 */
export const hideBanner = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform() || !isNativeBannerActive) return;
  try {
    await AdMob.hideBanner();
  } catch (error) {
    console.warn('[AdMob] hideBanner notice:', error);
  }
};

/**
 * 네이티브 배너 다시 표시
 */
export const resumeBanner = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform() || !isNativeBannerActive) return;
  try {
    await AdMob.resumeBanner();
  } catch (error) {
    console.warn('[AdMob] resumeBanner notice:', error);
  }
};

/**
 * 네이티브 배너 완전 제거
 */
export const removeBanner = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await AdMob.removeBanner();
    isNativeBannerActive = false;
  } catch (error) {
    console.warn('[AdMob] removeBanner notice:', error);
  }
};

// 하위 호환성 유지용 alias
export const showHomeBannerAd = showBanner;
export const hideBannerAd = hideBanner;
export const resumeBannerAd = resumeBanner;
export const removeBannerAd = removeBanner;
export const isHomeBannerVisible = (): boolean => isNativeBannerActive;
