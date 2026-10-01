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
// AdMob 앱 ID & 광고 단위 ID
// ─────────────────────────────────────────────────────────────────
export const ADMOB_APP_ID = 'ca-app-pub-3878859120989916~2898554632';
export const ADMOB_BANNER_UNIT_ID = 'ca-app-pub-3878859120989916/9433572199';

// 하위 호환용 config 객체
export const ADMOB_CONFIG = {
  appId: ADMOB_APP_ID,
  bannerAdUnitId: ADMOB_BANNER_UNIT_ID,
};

// ─────────────────────────────────────────────────────────────────
// 내부 상태 (모듈 레벨 싱글톤)
// ─────────────────────────────────────────────────────────────────
let initialized = false;
let bannerShowing = false;

// ─────────────────────────────────────────────────────────────────
// 1. SDK 초기화 (앱 최초 1회)
// ─────────────────────────────────────────────────────────────────
export const initAdMob = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform() || initialized) return;

  try {
    const options: AdMobInitializationOptions = { initializeForTesting: false };
    await AdMob.initialize(options);
    initialized = true;

    // 이벤트 리스너
    AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
      console.log('[AdMob] Banner loaded');
      bannerShowing = true;
    });
    AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (err: any) => {
      console.warn('[AdMob] Banner failed to load:', err);
      bannerShowing = false;
    });
    AdMob.addListener(BannerAdPluginEvents.Opened, () => {
      console.log('[AdMob] Banner clicked');
    });
    AdMob.addListener(BannerAdPluginEvents.Closed, () => {
      console.log('[AdMob] Banner closed');
    });

    // iOS ATT 권한 요청
    if (Capacitor.getPlatform() === 'ios') {
      try {
        const { status } = await AdMob.trackingAuthorizationStatus();
        if (status === 'notDetermined') {
          await AdMob.requestTrackingAuthorization();
        }
      } catch {
        // ATT 관련 오류는 무시
      }
    }

    console.log('[AdMob] Initialized:', ADMOB_APP_ID);
  } catch (err) {
    console.warn('[AdMob] Init error (non-critical):', err);
  }
};

// ─────────────────────────────────────────────────────────────────
// 2. 배너 광고 표시
//    - 위치: BOTTOM_CENTER (하단 탭바 위, margin 56px)
//    - 크기: ADAPTIVE_BANNER
//    - 광고 단위: ca-app-pub-3878859120989916/9433572199
// ─────────────────────────────────────────────────────────────────
export const showBanner = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await initAdMob();

    if (bannerShowing) {
      // 이미 떠 있으면 resume만
      await AdMob.resumeBanner();
      return;
    }

    const options: BannerAdOptions = {
      adId: ADMOB_BANNER_UNIT_ID,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 56, // BottomNav 높이
      isTesting: false,
    };

    await AdMob.showBanner(options);
    bannerShowing = true;
    console.log('[AdMob] Banner shown');
  } catch (err) {
    console.warn('[AdMob] showBanner error:', err);
  }
};

// ─────────────────────────────────────────────────────────────────
// 3. 배너 일시 숨김 (모달·상세 화면 진입 시)
// ─────────────────────────────────────────────────────────────────
export const hideBanner = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform() || !bannerShowing) return;
  try {
    await AdMob.hideBanner();
    bannerShowing = false;
  } catch (err) {
    console.warn('[AdMob] hideBanner error:', err);
  }
};

// ─────────────────────────────────────────────────────────────────
// 4. 배너 재표시 (홈 탭 복귀 시)
// ─────────────────────────────────────────────────────────────────
export const resumeBanner = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await AdMob.resumeBanner();
    bannerShowing = true;
  } catch (err) {
    console.warn('[AdMob] resumeBanner error:', err);
  }
};

// ─────────────────────────────────────────────────────────────────
// 5. 배너 완전 제거
// ─────────────────────────────────────────────────────────────────
export const removeBanner = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await AdMob.removeBanner();
    bannerShowing = false;
  } catch (err) {
    console.warn('[AdMob] removeBanner error:', err);
  }
};

// ─────────────────────────────────────────────────────────────────
// 하위 호환 alias (기존 코드가 import하는 이름 유지)
// ─────────────────────────────────────────────────────────────────
export const showHomeBannerAd = showBanner;
export const hideBannerAd = hideBanner;
export const resumeBannerAd = resumeBanner;
export const removeBannerAd = removeBanner;
export const removeHomeBannerAd = removeBanner;
export const showSearchBannerAd = showBanner;
export const hideHomeBannerAd = hideBanner;
export const isHomeBannerVisible = (): boolean => bannerShowing;
export const requestAdMobTrackingAuthorization = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'ios') return;
  try {
    const { status } = await AdMob.trackingAuthorizationStatus();
    if (status === 'notDetermined') await AdMob.requestTrackingAuthorization();
  } catch { /* 무시 */ }
};
