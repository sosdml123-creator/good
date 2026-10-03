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
export const ADMOB_BANNER_UNIT_ID = 'ca-app-pub-3878859120989916/9433572199';

// 고정 배너 사이즈 (320x50) - 웹뷰 placeholder와 정확히 높이를 맞추기 위함
export const BANNER_HEIGHT = 50;

let initPromise: Promise<boolean> | null = null;
let bannerShownAtMargin: number | null = null;
let isHidden = false;
let listenersAdded = false;

const isNative = () => Capacitor.isNativePlatform();

export const initAdMob = (): Promise<boolean> => {
  if (!isNative()) return Promise.resolve(false);
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      await AdMob.initialize({ initializeForTesting: false });

      if (Capacitor.getPlatform() === 'ios') {
        try {
          const { status } = await AdMob.trackingAuthorizationStatus();
          if (status === 'notDetermined') await AdMob.requestTrackingAuthorization();
        } catch { /* ignore */ }
      }

      if (!listenersAdded) {
        listenersAdded = true;
        AdMob.addListener(BannerAdPluginEvents.Loaded, () => console.log('[AdMob] banner loaded'));
        AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (e) => console.warn('[AdMob] banner failed', e));
      }
      return true;
    } catch (e) {
      console.warn('[AdMob] init failed', e);
      initPromise = null;
      return false;
    }
  })();
  return initPromise;
};

/**
 * 화면 상단으로부터 marginTop(pt) 위치에 320x50 배너 표시.
 * 같은 위치에 이미 떠 있으면 재요청 없이 resume만 한다.
 */
export const showBannerAt = async (marginTop: number): Promise<void> => {
  if (!isNative()) return;
  const ok = await initAdMob();
  if (!ok) return;

  const margin = Math.max(0, Math.round(marginTop));

  try {
    if (bannerShownAtMargin !== null && Math.abs(bannerShownAtMargin - margin) <= 1) {
      if (isHidden) {
        await AdMob.resumeBanner();
        isHidden = false;
      }
      return;
    }

    if (bannerShownAtMargin !== null) {
      await AdMob.removeBanner().catch(() => {});
    }

    const options: BannerAdOptions = {
      adId: ADMOB_BANNER_UNIT_ID,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.TOP_CENTER,
      margin,
      isTesting: false,
    };
    await AdMob.showBanner(options);
    bannerShownAtMargin = margin;
    isHidden = false;
  } catch (e) {
    console.warn('[AdMob] showBannerAt failed', e);
  }
};

export const hideBanner = async (): Promise<void> => {
  if (!isNative() || bannerShownAtMargin === null || isHidden) return;
  isHidden = true;
  try {
    await AdMob.hideBanner();
  } catch { /* ignore */ }
};
