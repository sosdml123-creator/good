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
export const BANNER_WIDTH = 320;

let initPromise: Promise<boolean> | null = null;
let bannerShownAtMargin: number | null = null;
let isBannerCreated = false;
let isHidden = false;
let listenersAdded = false;

const isNative = () => Capacitor.isNativePlatform();

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
          console.log('[AdMob] Banner opened/clicked');
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
 * 화면 상단 카테고리 아래 슬롯 위치(slotTop)에 320x50 배너 표시.
 *
 * [중요: iOS 플러그인 버그 보정]
 * @capacitor-community/admob iOS 구현:
 * NSLayoutConstraint(..., toItem: safeAreaLayoutGuide, constant: CGFloat(Int(Margin) * -1))
 * 따라서 TOP_CENTER에서 아래로 targetOffset만큼 내리려면:
 * constant = targetOffset = slotTop - safeAreaTop
 * -Margin = targetOffset  =>  margin = -targetOffset (음수 전달 필수!)
 *
 * Android 구현:
 * mAdViewLayoutParams.setMargins(sideMargin, densityMargin, sideMargin, densityMargin)
 * margin = targetOffset (양수 전달)
 */
export const showBannerAt = async (slotTop: number): Promise<void> => {
  if (!isNative()) return;
  const ok = await initAdMob();
  if (!ok) return;

  const isIOS = Capacitor.getPlatform() === 'ios';
  // iOS 플러그인은 constant = Margin * -1을 safeAreaLayoutGuide.top에 적용하므로,
  // safeArea 바로 아래부터 시작하는 웹뷰 slotTop 위치와 1:1로 일치시키려면
  // margin = -slotTop을 전달해야 합니다 (safeAreaTop을 중복 차감하지 않음).
  const roundedTop = Math.round(Math.max(0, slotTop));
  const margin = isIOS ? -roundedTop : roundedTop;

  try {
    if (isBannerCreated && bannerShownAtMargin !== null && Math.abs(bannerShownAtMargin - margin) <= 5) {
      if (isHidden) {
        await AdMob.resumeBanner();
        isHidden = false;
        console.log('[AdMob] Banner resumed at margin:', margin);
      }
      return;
    }

    if (isBannerCreated) {
      await AdMob.removeBanner().catch(() => {});
      isBannerCreated = false;
    }

    const options: BannerAdOptions = {
      adId: ADMOB_BANNER_UNIT_ID,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.TOP_CENTER,
      margin,
      isTesting: false,
    };

    console.log('[AdMob] showBanner requesting with options:', {
      adUnitId: ADMOB_BANNER_UNIT_ID,
      slotTop: roundedTop,
      calculatedMargin: margin,
      isIOS,
    });

    await AdMob.showBanner(options);
    bannerShownAtMargin = margin;
    isBannerCreated = true;
    isHidden = false;
  } catch (e) {
    console.warn('[AdMob] showBannerAt failed:', e);
  }
};

/**
 * 배너 광고 일시 숨김 (스크롤 시 또는 다른 화면 이동 시)
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
 * 숨겨진 배너 다시 표시 (홈 화면 카테고리 영역 복귀 시)
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
    await AdMob.removeBanner();
    bannerShownAtMargin = null;
    isBannerCreated = false;
    isHidden = false;
    console.log('[AdMob] Banner removed');
  } catch (e) {
    console.warn('[AdMob] removeBanner notice:', e);
  }
};

// 하위 호환 alias
export const showBanner = (slotTop: number = 530) => showBannerAt(slotTop);
export const showHomeBannerAd = showBanner;
export const hideBannerAd = hideBanner;
export const resumeBannerAd = resumeBanner;
export const removeBannerAd = removeBanner;
export const isHomeBannerVisible = (): boolean => isBannerCreated && !isHidden;
