import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
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
let isBannerCreated = false;
let isHidden = false;
let bannerShownAtMargin: number | null = null;
let currentAdId: string | null = null;
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
 * 카테고리 구좌 및 검색창 슬롯 Y좌표(slotTop)에 320x50 애드몹 배너를 정밀 안착
 */
export const showBannerAt = async (
  slotTop: number,
  safeAreaTop: number = 0,
  adId: string = ADMOB_BANNER_UNIT_ID
): Promise<void> => {
  if (!isNative()) return;
  const ok = await initAdMob();
  if (!ok) return;

  const isIOS = Capacitor.getPlatform() === 'ios';
  const roundedTop = Math.round(Math.max(0, slotTop));
  const roundedSat = Math.round(Math.max(0, safeAreaTop));
  const offsetFromSafeArea = Math.max(0, roundedTop - roundedSat);
  // iOS AutoLayout: constant = -(Margin * -1) 이므로 음수를 전달해야 safeAreaTop 기준 아래로 이동
  const margin = isIOS ? -offsetFromSafeArea : roundedTop;

  try {
    // 이미 배너가 생성되어 있고, 광고 ID 및 슬롯 마진이 동일한 경우 숨김 해제만 수행
    if (
      isBannerCreated &&
      currentAdId === adId &&
      bannerShownAtMargin !== null &&
      Math.abs(bannerShownAtMargin - margin) <= 6
    ) {
      if (isHidden) {
        await AdMob.resumeBanner().catch(() => {});
        isHidden = false;
        console.log('[AdMob] Banner resumed at margin:', margin, 'adId:', adId);
      }
      return;
    }

    // 다른 광고 단위이거나 마진 위치가 변경된 경우 기존 배너 완전 제거 후 재생성
    if (isBannerCreated) {
      await AdMob.removeBanner().catch(() => {});
      isBannerCreated = false;
      currentAdId = null;
    }

    const options: BannerAdOptions = {
      adId,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.TOP_CENTER,
      margin,
      isTesting: false,
    };

    console.log('[AdMob] Requesting native banner at slot:', {
      adId,
      slotTop: roundedTop,
      safeAreaTop: roundedSat,
      margin,
      isIOS,
    });

    await AdMob.showBanner(options);
    bannerShownAtMargin = margin;
    currentAdId = adId;
    isBannerCreated = true;
    isHidden = false;
  } catch (e) {
    console.warn('[AdMob] showBannerAt failed:', e);
  }
};

/**
 * 배너 광고 일시 숨김 (스크롤 시 신제품 본문을 가리지 않도록 숨김)
 */
export const hideBanner = async (): Promise<void> => {
  if (!isNative() || !isBannerCreated || isHidden) return;
  isHidden = true;
  try {
    await AdMob.hideBanner();
    console.log('[AdMob] Banner hidden');
  } catch (e) {
    console.warn('[AdMob] hideBanner notice:', e);
  }
};

/**
 * 숨겨진 배너 다시 표시 (카테고리 영역으로 복귀 시)
 */
export const resumeBanner = async (): Promise<void> => {
  if (!isNative() || !isBannerCreated || !isHidden) return;
  try {
    await AdMob.resumeBanner();
    isHidden = false;
    console.log('[AdMob] Banner resumed');
  } catch (e) {
    console.warn('[AdMob] resumeBanner notice:', e);
  }
};

/**
 * 배너 완전 제거
 */
export const removeBanner = async (): Promise<void> => {
  if (!isNative()) return;
  try {
    await AdMob.removeBanner().catch(() => {});
    bannerShownAtMargin = null;
    currentAdId = null;
    isBannerCreated = false;
    isHidden = false;
    console.log('[AdMob] Banner removed');
  } catch (e) {
    console.warn('[AdMob] removeBanner notice:', e);
  }
};

// 하위 호환 alias
export const showBannerAtSlot = showBannerAt;
export const showBanner = (slotTop: number = 530, safeAreaTop: number = 47) => showBannerAt(slotTop, safeAreaTop);
export const showHomeBannerAd = showBanner;
export const showSearchBannerAd = (slotTop: number = 110, safeAreaTop: number = 47) =>
  showBannerAt(slotTop, safeAreaTop, ADMOB_SEARCH_BANNER_UNIT_ID);
export const hideBannerAd = hideBanner;
export const resumeBannerAd = resumeBanner;
export const removeBannerAd = removeBanner;
export const isHomeBannerVisible = (): boolean => isBannerCreated && !isHidden;




