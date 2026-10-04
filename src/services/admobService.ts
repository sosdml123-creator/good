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
 * 화면 상단 카테고리 아래 '신상픽 추천 스폰서드' 슬롯 위치(slotTop)에 320x50 배너 표시.
 *
 * [핵심: iOS 플러그인 AutoLayout 위치 정밀 보정]
 * @capacitor-community/admob iOS 구현:
 * NSLayoutConstraint(..., toItem: safeAreaLayoutGuide, constant: CGFloat(Int(Margin) * -1))
 * 즉: bannerView.top = safeAreaLayoutGuide.top + (Margin * -1)
 *
 * 따라서 화면 상단 기준 슬롯 y위치(slotTop)와 1:1로 일치시키려면:
 * safeAreaTop + (Margin * -1) = slotTop
 * Margin * -1 = slotTop - safeAreaTop
 * Margin = -(slotTop - safeAreaTop)  (음수 전달 필수!)
 *
 * Android 구현:
 * mAdViewLayoutParams.gravity = Gravity.TOP
 * margin = slotTop (양수 전달)
 */
export const showBannerAt = async (slotTop: number, safeAreaTop: number = 0): Promise<void> => {
  if (!isNative()) return;
  const ok = await initAdMob();
  if (!ok) return;

  const isIOS = Capacitor.getPlatform() === 'ios';
  const roundedTop = Math.round(Math.max(0, slotTop));
  const roundedSat = Math.round(Math.max(0, safeAreaTop));
  const offsetFromSafeArea = Math.max(0, roundedTop - roundedSat);
  const margin = isIOS ? -offsetFromSafeArea : roundedTop;

  try {
    if (isBannerCreated && bannerShownAtMargin !== null && Math.abs(bannerShownAtMargin - margin) <= 4) {
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
      safeAreaTop: roundedSat,
      offsetFromSafeArea,
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
export const showBanner = (slotTop: number = 530, safeAreaTop: number = 47) => showBannerAt(slotTop, safeAreaTop);
export const showHomeBannerAd = showBanner;
export const hideBannerAd = hideBanner;
export const resumeBannerAd = resumeBanner;
export const removeBannerAd = removeBanner;
export const isHomeBannerVisible = (): boolean => isBannerCreated && !isHidden;
