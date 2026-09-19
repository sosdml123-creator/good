import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, AdMobInitializationOptions } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// AdMob App ID & Ad Unit IDs
export const ADMOB_CONFIG = {
  appId: 'ca-app-pub-3878859120989916~2898554632',
  nativeAdUnitId: 'ca-app-pub-3878859120989916/3915377976',
  bannerAdUnitId: 'ca-app-pub-3878859120989916/3915377976', // 사용자 지정 광고 단위 ID
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
    
    // iOS 추적 권한(ATT) 요청 (선택 사항)
    try {
      if (Capacitor.getPlatform() === 'ios') {
        const trackingInfo = await AdMob.trackingAuthorizationStatus();
        if (trackingInfo.status === 'notDetermined') {
          await AdMob.requestTrackingAuthorization();
        }
      }
    } catch (e) {
      console.warn('[AdMob] Tracking authorization check skipped:', e);
    }

    isAdMobInitialized = true;
    console.log('[AdMob] Successfully initialized with App ID:', ADMOB_CONFIG.appId);
    return true;
  } catch (error) {
    console.error('[AdMob] Initialization failed:', error);
    return false;
  }
};

export const showHomeBannerAd = async (adUnitId?: string): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) {
    return false;
  }

  try {
    await initAdMob();

    const options: BannerAdOptions = {
      adId: adUnitId || ADMOB_CONFIG.bannerAdUnitId,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 60, // 탭바 위 마진
      isTesting: false,
    };

    await AdMob.showBanner(options);
    return true;
  } catch (error) {
    console.error('[AdMob] Show banner failed:', error);
    return false;
  }
};

export const hideHomeBannerAd = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await AdMob.hideBanner();
  } catch (error) {
    console.error('[AdMob] Hide banner failed:', error);
  }
};

export const removeHomeBannerAd = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await AdMob.removeBanner();
  } catch (error) {
    console.error('[AdMob] Remove banner failed:', error);
  }
};
