export const ADMOB_APP_ID = '';
export const ADMOB_BANNER_UNIT_ID = '';

export const ADMOB_CONFIG = {
  appId: '',
  bannerAdUnitId: '',
};

export const initAdMob = async (): Promise<boolean> => false;
export const showBanner = async (): Promise<boolean> => false;
export const hideBanner = async (): Promise<void> => {};
export const resumeBanner = async (): Promise<void> => {};
export const removeBanner = async (): Promise<void> => {};

export const showHomeBannerAd = showBanner;
export const hideBannerAd = hideBanner;
export const resumeBannerAd = resumeBanner;
export const removeBannerAd = removeBanner;
export const isHomeBannerVisible = (): boolean => false;
