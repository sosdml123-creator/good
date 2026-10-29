import {
  AdMob,
  BannerAdOptions,
  BannerAdPosition,
  BannerAdSize,
  BannerAdPluginEvents,
  RewardAdPluginEvents,
} from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// Google AdMob 공식 앱 ID & 배너 광고 단위 ID
export const ADMOB_APP_ID = 'ca-app-pub-3878859120989916~2898554632';
export const ADMOB_CLIENT_ID = 'ca-pub-3878859120989916';
// 홈 피드 메인 배너 (iOS 앱 / 안드로이드 앱은 AdMob에서 앱이 달라 광고 단위도 따로)
export const ADMOB_BANNER_UNIT_ID =
  Capacitor.getPlatform() === 'android'
    ? 'ca-app-pub-3878859120989916/7525100286'
    : 'ca-app-pub-3878859120989916/9433572199';
// 검색창 추천 슬롯 배너 (안드로이드는 안드로이드 앱의 배너 단위를 같이 사용)
export const ADMOB_SEARCH_BANNER_UNIT_ID =
  Capacitor.getPlatform() === 'android'
    ? 'ca-app-pub-3878859120989916/7525100286'
    : 'ca-app-pub-3878859120989916/1040251860';
// 광고 보고 포인트 받기 (보상형, iOS 앱 / 안드로이드 앱은 AdMob에서 앱이 달라 광고 단위도 따로)
export const ADMOB_REWARD_UNIT_ID =
  Capacitor.getPlatform() === 'android'
    ? 'ca-app-pub-3878859120989916/6754261901'
    : 'ca-app-pub-3878859120989916/2388345753';
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
    return val;
  } catch {}
  // 네이티브 앱은 웹뷰가 상태바 아래에서 시작하므로(MainViewController / MainActivity) 보정값이 0
  return 0;
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
 * 보상형 광고를 불러와 전체 화면으로 보여 줍니다.
 * 포인트는 Google 서버가 /api/admob-reward 로 직접 알려 줄 때 적립되므로, userId 를 광고에 실어 보냅니다.
 */
export let lastRewardedAdError = '';

export const showRewardedAd = async (userId: string): Promise<'rewarded' | 'dismissed' | 'unavailable'> => {
  lastRewardedAdError = '';
  if (!(await initAdMob())) return 'unavailable';
  const handles: { remove: () => Promise<void> }[] = [];
  try {
    // 광고 서버 응답이 없을 때 버튼이 계속 멈춰 있지 않도록 제한 시간을 둠
    await Promise.race([
      AdMob.prepareRewardVideoAd({ adId: ADMOB_REWARD_UNIT_ID, ssv: { userId } }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 20000)),
    ]);
    let rewarded = false;
    return await new Promise<'rewarded' | 'dismissed' | 'unavailable'>((resolve) => {
      (async () => {
        handles.push(await AdMob.addListener(RewardAdPluginEvents.Rewarded, () => { rewarded = true; }));
        handles.push(await AdMob.addListener(RewardAdPluginEvents.Dismissed, () => resolve(rewarded ? 'rewarded' : 'dismissed')));
        handles.push(await AdMob.addListener(RewardAdPluginEvents.FailedToShow, () => resolve('unavailable')));
        // 끝까지 보지 않고 닫으면 이 Promise 는 끝나지 않으므로 결과는 위 이벤트로 판단
        AdMob.showRewardVideoAd().catch(() => resolve('unavailable'));
      })();
    });
  } catch (e) {
    console.warn('[AdMob] rewarded ad failed:', e);
    lastRewardedAdError = String((e as any)?.message || (e as any)?.code || e).slice(0, 80);
    return 'unavailable';
  } finally {
    handles.forEach(h => h.remove().catch(() => {}));
  }
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

/**
 * iOS 인라인 배너 (AppDelegate.swift의 InlineAdManager와 통신)
 * - 네이티브 배너를 웹 구좌(DOM) 위치에 붙여서 본문 스크롤과 함께 움직이게 함
 * - 구좌가 스크롤 영역 밖으로 나가거나 헤더/모달/토스트에 가려지면 그만큼 잘라내거나 숨김
 */
type InlineAdMessage =
  | {
      action: 'update';
      slot: string;
      adId: string;
      frame: number[];
      clip: number[];
      scroller: number[] | null;
      scrollTop: number;
      scrollHeight: number;
    }
  | { action: 'hide' | 'remove'; slot: string }
  | { action: 'reset' };

const postInlineAd = (msg: InlineAdMessage): boolean => {
  if (Capacitor.getPlatform() === 'android') {
    // InlineAdManager.java (Capacitor 로컬 플러그인)
    const plugin = (Capacitor as unknown as { Plugins: Record<string, { postMessage?: (m: InlineAdMessage) => Promise<void> }> })
      .Plugins.InlineAd;
    if (!plugin?.postMessage) return false;
    plugin.postMessage(msg).catch(() => {});
    return true;
  }
  const bridge = (
    window as unknown as {
      webkit?: { messageHandlers?: { inlineAd?: { postMessage: (m: InlineAdMessage) => void } } };
    }
  ).webkit?.messageHandlers?.inlineAd;
  if (!bridge) return false;
  bridge.postMessage(msg);
  return true;
};

export const supportsInlineBanner = (): boolean =>
  Capacitor.getPlatform() === 'ios' || Capacitor.getPlatform() === 'android';

let inlineAdReady = false;

const pinnedCache = new WeakMap<Element, boolean>();
const isPinned = (n: Element): boolean => {
  let pinned = pinnedCache.get(n);
  if (pinned === undefined) {
    const position = window.getComputedStyle(n).position;
    pinned = position === 'sticky' || position === 'fixed';
    pinnedCache.set(n, pinned);
  }
  return pinned;
};

/**
 * 배너가 그려져도 되는 영역 [left, top, right, bottom] 계산 (스크롤과 무관하게 고정된 값)
 * - 스크롤 컨테이너 등 클리핑 조상들의 교집합에서, 위/아래 가장자리를 덮는 sticky·fixed 요소만큼 제외
 */
const measureRegion = (el: HTMLElement, clippers: HTMLElement[], x: number): number[] | null => {
  let left = 0;
  let top = 0;
  let right = window.innerWidth;
  let bottom = window.innerHeight;
  for (const c of clippers) {
    const cr = c.getBoundingClientRect();
    left = Math.max(left, cr.left);
    top = Math.max(top, cr.top);
    right = Math.min(right, cr.right);
    bottom = Math.min(bottom, cr.bottom);
  }
  if (right - left < 1 || bottom - top < 1) return null;

  const pinnedAt = (y: number): DOMRect | null => {
    const hit = document.elementFromPoint(x, y);
    for (let n: Element | null = hit; n && !n.contains(el); n = n.parentElement) {
      if (isPinned(n)) return n.getBoundingClientRect();
    }
    return null;
  };
  const topCover = pinnedAt(top + 1);
  if (topCover) top = Math.max(top, topCover.bottom);
  const bottomCover = pinnedAt(bottom - 1);
  if (bottomCover) bottom = Math.min(bottom, bottomCover.top);
  if (bottom - top < 1) return null;

  return [left, top, right, bottom];
};

/**
 * 구좌 엘리먼트에 인라인 배너를 붙이고 위치를 동기화. 반환된 함수를 호출하면 해제.
 * - 스크롤 중의 위치는 네이티브가 스크롤뷰 오프셋을 직접 읽어 계산하므로 지연 없이 본문에 붙어 움직임
 * - JS는 구좌의 "콘텐츠 내 위치"와 허용 영역, 모달 등에 가려졌는지만 알려줌
 */
export const trackInlineBanner = (slot: string, adId: string, el: HTMLElement): (() => void) => {
  let raf = 0;
  let stopped = false;
  let lastSent = '';

  const clippers: HTMLElement[] = [];
  let scroller: HTMLElement | null = null;
  for (let p = el.parentElement; p; p = p.parentElement) {
    const style = window.getComputedStyle(p);
    if (style.overflowX !== 'visible' || style.overflowY !== 'visible') clippers.push(p);
    if (!scroller && (style.overflowY === 'auto' || style.overflowY === 'scroll')) scroller = p;
  }

  const measure = (): InlineAdMessage => {
    const hidden: InlineAdMessage = { action: 'hide', slot };
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return hidden;

    const x = Math.min(Math.max(r.left + r.width / 2, 0), window.innerWidth - 1);
    const region = measureRegion(el, clippers, x);
    if (!region) return hidden;
    const [left, top, right, bottom] = region;

    // 구좌의 보이는 부분 위에 모달·토스트 등이 떠 있으면 숨김
    const visTop = Math.max(r.top, top);
    const visBottom = Math.min(r.bottom, bottom);
    if (visBottom - visTop >= 1) {
      const hit = document.elementFromPoint(x, (visTop + visBottom) / 2);
      if (hit && !el.contains(hit)) return hidden;
    }

    const sx = window.scrollX;
    const sy = window.scrollY;
    const sr = scroller?.getBoundingClientRect();
    return {
      action: 'update',
      slot,
      adId,
      frame: [r.left + sx, r.top + sy, r.width, r.height],
      clip: [left + sx, top + sy, right - left, bottom - top],
      scroller: sr ? [sr.left + sx, sr.top + sy, sr.width, sr.height] : null,
      scrollTop: scroller?.scrollTop ?? 0,
      scrollHeight: scroller?.scrollHeight ?? 0,
    };
  };

  const tick = () => {
    if (stopped) return;
    const msg = measure();
    const key = JSON.stringify(msg);
    if (key !== lastSent && postInlineAd(msg)) lastSent = key;
    raf = requestAnimationFrame(tick);
  };

  // 추적 허용(ATT) 팝업 응답 이후에 첫 광고를 요청
  initAdMob().finally(() => {
    if (stopped) return;
    if (!inlineAdReady) {
      inlineAdReady = true;
      // 페이지가 새로 로드된 경우 이전 페이지가 남긴 네이티브 배너 정리
      postInlineAd({ action: 'reset' });
      window.addEventListener('inlineAdStatus', (e) => {
        console.log('[AdMob] Inline banner status:', (e as CustomEvent).detail);
      });
    }
    raf = requestAnimationFrame(tick);
  });

  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    // 배너는 지우지 않고 숨기기만 해서 다시 들어왔을 때 재요청 없이 바로 표시
    postInlineAd({ action: 'hide', slot });
  };
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




