import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, AdMobInitializationOptions } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// AdMob App ID & Ad Unit IDs (Google AdMob 배너 광고 실서버 ID)
export const ADMOB_CONFIG = {
  appId: 'ca-app-pub-3878859120989916~2898554632',
  bannerAdUnitId: 'ca-app-pub-3878859120989916/9433572199',
  // 테스트용 ID (AdMob 테스트 가이드)
  testBannerAdUnitId: 'ca-app-pub-3940256099942544/2934735716',
};

let isAdMobInitialized = false;

export const initAdMob = async (): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) {
    return false;
  }

  if (isAdMobInitialized) {
    return true;
  }

  try {
    const initOptions: AdMobInitializationOptions = {
      initializeForTesting: false,
    };
    await AdMob.initialize(initOptions);

    isAdMobInitialized = true;
    console.log('[AdMob] Successfully initialized with App ID:', ADMOB_CONFIG.appId);
    
    // iOS 플랫폼의 경우 추적 권한(ATT) 상태 점검
    if (Capacitor.getPlatform() === 'ios') {
      await requestAdMobTrackingAuthorization();
    }

    return true;
  } catch (error) {
    console.warn('[AdMob] Initialization notice (non-critical):', error);
    return false;
  }
};

/**
 * iOS App Tracking Transparency (ATT) 권한 요청
 */
export const requestAdMobTrackingAuthorization = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'ios') return;
  try {
    const trackingInfo = await AdMob.trackingAuthorizationStatus();
    if (trackingInfo.status === 'notDetermined') {
      await AdMob.requestTrackingAuthorization();
    }
  } catch (e) {
    console.warn('[AdMob] Tracking authorization check notice:', e);
  }
};

export const showSearchBannerAd = async (adUnitId?: string): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) {
    return false;
  }

  try {
    await initAdMob();

    const options: BannerAdOptions = {
      adId: adUnitId || ADMOB_CONFIG.bannerAdUnitId,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: false,
    };

    await AdMob.showBanner(options);
    return true;
  } catch (error) {
    console.warn('[AdMob] Show search banner notice:', error);
    return false;
  }
};

export const hideBannerAd = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await AdMob.hideBanner();
  } catch (error) {
    console.warn('[AdMob] Hide banner notice:', error);
  }
};

export const removeBannerAd = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await AdMob.removeBanner();
  } catch (error) {
    console.warn('[AdMob] Remove banner notice:', error);
  }
};

// 하위 호환성 유지
export const showHomeBannerAd = showSearchBannerAd;
export const hideHomeBannerAd = hideBannerAd;
export const removeHomeBannerAd = removeBannerAd;

