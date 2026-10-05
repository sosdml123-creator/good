import {
  AdMob,
  BannerAdOptions,
  BannerAdPosition,
  BannerAdSize,
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
let currentShowingAdId: string | null = null;

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
          console.log('[AdMob] Banner loaded successfully');
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
 * 광고 구좌 위치에 320x50 AdMob 배너를 단 1회 안정적으로 안착
 * - 스크롤할 때마다 위치를 바꾸거나 따라다니지 않고 지정된 구좌 자리에 안정적으로 유지
 */
export const showBannerAt = async (
  slotTop: number,
  safeAreaTop: number = 0,
  adId: string = ADMOB_SEARCH_BANNER_UNIT_ID
): Promise<void> => {
  if (!isNative()) return;
  const ok = await initAdMob();
  if (!ok) return;

  // 이미 해당 광고 ID로 배너가 떠 있다면 중복 호출 방지
  if (currentShowingAdId === adId) {
    return;
  }

  const isIOS = Capacitor.getPlatform() === 'ios';
  const roundedTop = Math.round(Math.max(0, slotTop));
  const roundedSat = Math.round(Math.max(0, safeAreaTop));
  const offsetFromSafeArea = Math.max(0, roundedTop - roundedSat);
  // iOS AutoLayout: constant = -(Margin * -1) 이므로 음수를 전달해야 safeAreaTop 기준 아래로 이동
  const margin = isIOS ? -offsetFromSafeArea : roundedTop;

  try {
    if (currentShowingAdId) {
      await AdMob.removeBanner().catch(() => {});
      currentShowingAdId = null;
    }

    const options: BannerAdOptions = {
      adId,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.TOP_CENTER,
      margin,
      isTesting: false,
    };

    console.log('[AdMob] Showing banner at slot position:', {
      adId,
      margin,
      isIOS,
    });

    await AdMob.showBanner(options);
    currentShowingAdId = adId;
  } catch (e) {
    console.warn('[AdMob] showBannerAt failed:', e);
  }
};

/**
 * 네이티브 배너 완전 제거 (화면 전환 또는 모달 닫힘 시)
 */
export const removeBanner = async (): Promise<void> => {
  if (!isNative()) return;
  try {
    await AdMob.removeBanner().catch(() => {});
    currentShowingAdId = null;
    console.log('[AdMob] Banner removed');
  } catch (e) {
    console.warn('[AdMob] removeBanner notice:', e);
  }
};

export const hideBanner = removeBanner;
export const resumeBanner = () => Promise.resolve();
export const showBannerAtSlot = showBannerAt;
export const showBanner = (slotTop: number = 530, safeAreaTop: number = 47) =>
  showBannerAt(slotTop, safeAreaTop, ADMOB_BANNER_UNIT_ID);
export const showHomeBannerAd = showBanner;
export const showSearchBannerAd = (slotTop: number = 60, safeAreaTop: number = 47) =>
  showBannerAt(slotTop, safeAreaTop, ADMOB_SEARCH_BANNER_UNIT_ID);
export const hideBannerAd = hideBanner;
export const resumeBannerAd = resumeBanner;
export const removeBannerAd = removeBanner;
export const isHomeBannerVisible = (): boolean => Boolean(currentShowingAdId);




