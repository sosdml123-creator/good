import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
  AdMobInitializationOptions,
  BannerAdPluginEvents,
} from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// AdMob App ID & Ad Unit IDs (Google AdMob 배너 광고 공식 실서버 ID)
export const ADMOB_CONFIG = {
  appId: 'ca-app-pub-3878859120989916~2898554632',
  bannerAdUnitId: 'ca-app-pub-3878859120989916/9433572199',
  // 테스트용 ID (AdMob 공식 테스트 가이드)
  testBannerAdUnitId: 'ca-app-pub-3940256099942544/2934735716',
};

let isAdMobInitialized = false;
let isBannerCreated = false;
let isBannerVisible = false;
let listenersRegistered = false;

/**
 * Google AdMob SDK 초기화 (iOS/Android 네이티브)
 */
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

    // 이벤트 리스너 등록
    if (!listenersRegistered) {
      listenersRegistered = true;
      AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
        console.log('[AdMob] Banner ad loaded successfully!');
        isBannerVisible = true;
      });

      AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (error: any) => {
        console.warn('[AdMob] Banner ad failed to load:', error);
        isBannerVisible = false;
      });

      AdMob.addListener(BannerAdPluginEvents.Opened, () => {
        console.log('[AdMob] Banner ad clicked/opened');
      });

      AdMob.addListener(BannerAdPluginEvents.Closed, () => {
        console.log('[AdMob] Banner ad closed');
      });
    }

    // iOS 플랫폼의 경우 추적 권한(ATT) 상태 점검 및 요청
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

/**
 * Google 모바일 광고 SDK 가이드 및 배너 구현 가이드 준수 배너 노출
 * - 광고 유형: Banner
 * - 크기: ADAPTIVE_BANNER (화면 너비 자동 맞춤)
 * - 게재위치: BOTTOM_CENTER (하단 탭바 56px 위)
 * - 단위 ID: ca-app-pub-3878859120989916/9433572199
 */
export const showHomeBannerAd = async (adUnitId?: string): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) {
    return false;
  }

  try {
    await initAdMob();

    if (isBannerCreated) {
      await resumeBannerAd();
      return true;
    }

    const options: BannerAdOptions = {
      adId: adUnitId || ADMOB_CONFIG.bannerAdUnitId,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 56, // BottomNav 위에 자연스럽게 겹침 없이 표시
      isTesting: false,
    };

    await AdMob.showBanner(options);
    isBannerCreated = true;
    isBannerVisible = true;
    console.log('[AdMob] showBanner requested with unit:', options.adId);
    return true;
  } catch (error) {
    console.warn('[AdMob] showBanner notice:', error);
    return false;
  }
};

/**
 * 배너 광고 일시 숨김 (모달 또는 상세 화면 진입 시)
 */
export const hideBannerAd = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform() || !isBannerCreated) return;
  try {
    await AdMob.hideBanner();
    isBannerVisible = false;
  } catch (error) {
    console.warn('[AdMob] Hide banner notice:', error);
  }
};

/**
 * 배너 광고 다시 보이기 (메인 탭 복귀 시)
 */
export const resumeBannerAd = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform() || !isBannerCreated) return;
  try {
    await AdMob.resumeBanner();
    isBannerVisible = true;
  } catch (error) {
    console.warn('[AdMob] Resume banner notice:', error);
  }
};

/**
 * 배너 광고 완전 제거
 */
export const removeBannerAd = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await AdMob.removeBanner();
    isBannerCreated = false;
    isBannerVisible = false;
  } catch (error) {
    console.warn('[AdMob] Remove banner notice:', error);
  }
};

// 하위 호환성 유지
export const isHomeBannerVisible = (): boolean => isBannerVisible;
export const showSearchBannerAd = showHomeBannerAd;
export const hideHomeBannerAd = hideBannerAd;
export const removeHomeBannerAd = removeBannerAd;
