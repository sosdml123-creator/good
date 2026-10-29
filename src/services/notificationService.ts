import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token, ActionPerformed, PushNotificationSchema } from '@capacitor/push-notifications';
import { supabase } from './supabase';
import { getAdminAuthHeaders } from './adminAuth';
import { AppNotification } from '../types';

export interface DeviceTokenRecord {
  token: string;
  platform: 'ios' | 'android' | 'web';
  userId?: string;
  userName?: string;
}

/** 발송 성격: marketing = 광고·혜택(마케팅 동의 기기만), service = 서비스 안내(푸시 허용 기기 전체) */
export type PushMessageKind = 'marketing' | 'service';

/** 서버가 고른 발송 대상 요약 */
export interface PushAudience {
  messageKind: PushMessageKind;
  nightWindow: boolean;
  eligible: number;
  skippedNoMarketing: number;
  skippedNoNight: number;
  consentUnavailable?: boolean;
}

export interface SendPushPayload {
  id?: string;
  title: string;
  body: string;
  type: 'event' | 'product' | 'notice';
  targetId: string;
  imageUrl?: string;
  badge?: string;
  messageKind?: PushMessageKind;
  tokens?: string[];
}

/** 기기 푸시(APNs·FCM) 실제 발송 결과 */
export interface PushDeliveryResult {
  targetCount: number;
  sentCount: number;
  failedCount: number;
  errors?: Record<string, number>;
  prefsSupported?: boolean;
}

export interface SendPushResult {
  success: boolean;
  notification?: AppNotification;
  targetTokensCount?: number;
  dbSaved?: boolean;
  push?: PushDeliveryResult;
  audience?: PushAudience;
  pushError?: string;
  error?: string;
}

export interface PushConnectionCheck {
  configured: boolean;
  ok: boolean;
  reason?: string;
}

export interface FcmStatusInfo {
  status: string;
  hasApnsKey?: boolean;
  hasFcmKey: boolean;
  registeredTokens: number;
  tokensByPlatform: { ios: number; android: number; web: number };
  consent?: { marketing: number; night: number };
}

// Memory cache for current device push token
let currentDeviceToken: string | null = null;
try {
  currentDeviceToken = localStorage.getItem('sinsangpick_device_token');
} catch (e) {
  // ignore
}

export const getStoredDeviceToken = (): string | null => currentDeviceToken;

/** 앱 설정에서 알림을 끈 상태인지 (기본값은 켜짐) */
export const isPushEnabledInApp = (): boolean => {
  try {
    return localStorage.getItem('sinsangpick_push_enabled') !== 'false';
  } catch {
    return true;
  }
};

/** 관심 카테고리 출시 알림 설정 (이 기기에 저장하고 서버 device_tokens 에도 동기화) */
export const ALERT_CATEGORY_STORAGE_KEY = 'sinsangpick_alert_cats';
/** 저장한 적 없을 때 기본 선택 카테고리 (서버 api/_lib/devicePush.js 의 DEFAULT_ALERT_CATEGORIES 와 같아야 함) */
export const DEFAULT_ALERT_CATEGORIES = ['과자', '음료', '빵·디저트', '간편식'];

/** 저장된 관심 카테고리. 한 번도 저장하지 않았으면 null (서버가 기본값을 적용) */
const readStoredAlertCategories = (): string[] | null => {
  try {
    const raw = localStorage.getItem(ALERT_CATEGORY_STORAGE_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((c): c is string => typeof c === 'string') : null;
  } catch {
    return null;
  }
};

export const getSavedAlertCategories = (): string[] => readStoredAlertCategories() ?? [...DEFAULT_ALERT_CATEGORIES];

export const saveAlertCategories = (categories: string[]): void => {
  try {
    localStorage.setItem(ALERT_CATEGORY_STORAGE_KEY, JSON.stringify(categories));
  } catch {
    // ignore
  }
};

/**
 * 이 기기의 관심 카테고리를 서버에 저장합니다. 출시 자동 알림 대상을 고를 때 씁니다.
 * 토큰 행이 없으면(권한 미허용, 알림 끔) 아무것도 하지 않고, 토큰이 생길 때 등록 흐름에서 다시 보냅니다.
 */
export const syncDevicePushPrefs = async (): Promise<boolean> => {
  const token = currentDeviceToken;
  if (!token) return false;
  try {
    const baseUrl = Capacitor.isNativePlatform() ? 'https://www.sinsangpick.kr' : '';
    const res = await fetch(`${baseUrl}/api/send-fcm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'prefs',
        token,
        alertCategories: readStoredAlertCategories(),
      }),
    });
    if (!res.ok) return false;
    const data = await res.json().catch(() => ({}));
    return data.saved === true;
  } catch (e) {
    console.warn('[Notification Service] Device push prefs sync failed:', e);
    return false;
  }
};

/**
 * 화면 위 인앱 배너를 띄울지 정합니다. 알림함 저장은 항상 합니다.
 *  - 알림을 끈 기기는 배너를 띄우지 않습니다.
 *  - iOS 는 앱이 열려 있어도 기기 알림 배너를 띄우므로(presentationOptions), 인앱 배너와 겹치지 않게 생략합니다.
 */
export const shouldShowInAppBanner = (permission: 'granted' | 'denied' | 'prompt'): boolean => {
  if (!isPushEnabledInApp()) return false;
  if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios' && permission === 'granted') return false;
  return true;
};

/** 밤 9시~아침 8시에 받는 야간 혜택 알림에 동의했는지 (기본값은 동의 안 함) */
export const getNightPushConsent = (): boolean => {
  try {
    return localStorage.getItem('sinsangpick_night_push') === 'true';
  } catch {
    return false;
  }
};

/** 지금이 한국 시간 밤 9시~아침 8시인지 */
export const isNightNowKst = (): boolean => {
  const kstHour = new Date(Date.now() + 9 * 60 * 60 * 1000).getUTCHours();
  return kstHour >= 21 || kstHour < 8;
};

/**
 * 광고·혜택 알림은 알림함에 이 접두사로 저장됩니다 (서버와 앱이 같은 규칙을 씁니다).
 * 이 기기에서 알림함과 배너를 가릴 때 씁니다.
 */
export const MARKETING_NOTIFICATION_PREFIX = 'promo-';

export const isMarketingNotification = (notif: { id: string }): boolean =>
  String(notif.id || '').startsWith(MARKETING_NOTIFICATION_PREFIX);

/** 광고·혜택 알림을 이 기기 알림함에 보여도 되는지 (알림을 켜 두고 마케팅 동의) */
export const canSeeMarketingNotification = (): boolean =>
  isPushEnabledInApp() && getMarketingConsentStatus();

/** 광고·혜택 배너·진동을 지금 울려도 되는지 (마케팅 동의, 밤이면 야간 혜택 동의까지) */
export const canShowMarketingBannerNow = (): boolean =>
  canSeeMarketingNotification() && (!isNightNowKst() || getNightPushConsent());

/** 이 기기 알림함에 보여 줄 알림인지 */
export const isNotificationVisible = (notif: { id: string }): boolean =>
  !isMarketingNotification(notif) || canSeeMarketingNotification();

/**
 * 이 기기의 광고·혜택 동의 값을 서버에 올립니다. 서버는 이 값으로 광고·혜택 발송 대상을 고릅니다.
 * 알림을 껐다면 두 값 모두 false 로 올립니다.
 */
export const syncDeviceConsent = async (): Promise<boolean> => {
  const token = currentDeviceToken;
  if (!token) return false;
  const pushOn = isPushEnabledInApp();
  try {
    const baseUrl = Capacitor.isNativePlatform() ? 'https://www.sinsangpick.kr' : '';
    const res = await fetch(`${baseUrl}/api/send-fcm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'consent',
        token,
        marketingAgreed: pushOn && getMarketingConsentStatus(),
        nightAgreed: pushOn && getNightPushConsent(),
      }),
    });
    if (!res.ok) console.warn('[Notification Service] Consent sync failed:', res.status);
    return res.ok;
  } catch (e) {
    console.warn('[Notification Service] Consent sync error:', e);
    return false;
  }
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Save device token to Supabase (and local storage)
 */
export const saveDeviceToken = async (record: DeviceTokenRecord): Promise<boolean> => {
  currentDeviceToken = record.token;
  try {
    localStorage.setItem('sinsangpick_device_token', record.token);
    localStorage.setItem('sinsangpick_device_platform', record.platform);
  } catch (e) {
    // ignore
  }

  if (!supabase) return false;

  try {
    const validUserId = record.userId && UUID_REGEX.test(record.userId) ? record.userId : null;
    const { error } = await supabase
      .from('device_tokens')
      .upsert(
        {
          token: record.token,
          platform: record.platform,
          user_id: validUserId,
          user_name: record.userName || null,
          device_info: {
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
            platform: record.platform,
            registeredAt: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        },
        { onConflict: 'token' }
      );

    if (error) {
      console.warn('[Notification Service] Device token upsert warning:', error.message);
      return false;
    }
    console.log('[Notification Service] Device token registered in Supabase:', record.token.slice(0, 10) + '...');
    return true;
  } catch (err) {
    console.warn('[Notification Service] Failed to save device token:', err);
    return false;
  }
};

/**
 * Delete device token from Supabase and local storage
 */
export const deleteDeviceToken = async (token?: string): Promise<boolean> => {
  const tokenToDelete = token || currentDeviceToken;
  // 서버(서비스 키)에서 먼저 지웁니다. 앱의 익명 키로는 RLS 때문에 지워지지 않을 수 있습니다.
  if (tokenToDelete) await unregisterDevicePush(tokenToDelete);
  currentDeviceToken = null;
  try {
    localStorage.removeItem('sinsangpick_device_token');
    localStorage.removeItem('sinsangpick_device_platform');
  } catch (e) {
    // ignore
  }

  if (!tokenToDelete || !supabase) return false;

  try {
    const { error } = await supabase
      .from('device_tokens')
      .delete()
      .eq('token', tokenToDelete);

    if (error) {
      console.warn('[Notification Service] Device token delete warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Notification Service] Failed to delete device token:', err);
    return false;
  }
};

/**
 * 알림을 끈 기기의 토큰을 서버 발송 대상에서 뺍니다.
 * 행 삭제는 서버(서비스 키)에서 합니다. 앱의 익명 키로 지우면 RLS에 막혀도 에러 없이 0건 삭제될 수 있습니다.
 * 서버 요청이 실패하면 로컬 토큰을 남겨 두어, 다음 실행 때 다시 시도합니다.
 */
export const unregisterDevicePush = async (token?: string): Promise<void> => {
  let target = token || currentDeviceToken;
  try {
    target = target || localStorage.getItem('sinsangpick_device_token');
  } catch {
    // ignore
  }
  if (!target) return;

  try {
    const baseUrl = Capacitor.isNativePlatform() ? 'https://www.sinsangpick.kr' : '';
    const res = await fetch(`${baseUrl}/api/send-fcm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'unregister', token: target })
    });
    if (!res.ok) {
      console.warn('[Notification Service] Unregister failed:', res.status);
      return;
    }
  } catch (err) {
    console.warn('[Notification Service] Unregister error:', err);
    return;
  }

  if (currentDeviceToken === target) currentDeviceToken = null;
  try {
    if (localStorage.getItem('sinsangpick_device_token') === target) {
      localStorage.removeItem('sinsangpick_device_token');
      localStorage.removeItem('sinsangpick_device_platform');
    }
  } catch {
    // ignore
  }
};

/**
 * Android FCM은 google-services.json(Firebase 설정)이 있어야 동작합니다.
 * 설정 없이 PushNotifications.register()를 호출하면 네이티브에서
 * "Default FirebaseApp is not initialized" 예외로 앱이 강제종료되므로(JS try/catch로 못 잡음)
 * Firebase를 연결하기 전까지 Android에서는 네이티브 푸시 등록을 건너뜁니다.
 */
const ANDROID_FCM_CONFIGURED = true;

const canRegisterNativePush = (): boolean =>
  Capacitor.getPlatform() !== 'android' || ANDROID_FCM_CONFIGURED;

/**
 * Initialize Push Notifications for Native iOS/Android and Web
 */
export const initPushNotifications = async (callbacks: {
  onNotificationReceived?: (notification: AppNotification) => void;
  onNotificationActionPerformed?: (targetId: string, type: 'event' | 'product' | 'notice') => void;
  userId?: string;
  userName?: string;
}) => {
  const isNative = Capacitor.isNativePlatform();
  const platform = Capacitor.getPlatform() as 'ios' | 'android' | 'web';

  if (isNative) {
    if (!canRegisterNativePush()) return;
    try {
      // 1. Remove old listeners to avoid duplicates (리스너를 먼저 달아야 register() 직후 토큰을 놓치지 않습니다)
      await PushNotifications.removeAllListeners();

      // 2. Token registration success listener
      PushNotifications.addListener('registration', async (token: Token) => {
        console.log('[Push Notification] Registration success token:', token.value);
        if (!isPushEnabledInApp()) {
          // 알림을 끈 기기는 토큰을 저장하지 않고, 저장돼 있던 행이 있으면 지웁니다
          await unregisterDevicePush(token.value);
          return;
        }
        await saveDeviceToken({
          token: token.value,
          platform: platform === 'ios' ? 'ios' : 'android',
          userId: callbacks.userId,
          userName: callbacks.userName
        });
        // 토큰이 생긴 뒤에야 서버에 기기 설정(푸시 허용·관심 카테고리)을 올릴 수 있습니다
        await syncDevicePushPrefs();
        // 광고·혜택 동의 값도 같은 시점에 올립니다
        await syncDeviceConsent();
      });

      // 5. Registration error listener
      PushNotifications.addListener('registrationError', (error: any) => {
        console.error('[Push Notification] Registration error:', error);
      });

      // 6. Foreground notification received listener
      PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
        console.log('[Push Notification] Received in foreground:', notification);
        const data = notification.data || {};
        const nowIso = new Date().toISOString();
        const appNotif: AppNotification = {
          // 서버가 보낸 알림 id 가 있으면 같은 알림의 실시간 전달과 합쳐져 알림함에 두 번 쌓이지 않습니다
          id: data.notifId ? String(data.notifId) : 'notif-' + (notification.id || Date.now()),
          title: notification.title || '신상픽 알림',
          body: notification.body || '',
          type: (data.type as 'event' | 'product' | 'notice') || 'notice',
          targetId: data.targetId || '',
          imageUrl: (notification as any).largeBody || data.imageUrl || undefined,
          timestamp: data.createdAt || data.timestamp || nowIso,
          createdAt: data.createdAt || data.timestamp || nowIso,
          isRead: false,
          badge: data.badge || '알림'
        };

        if (callbacks.onNotificationReceived) {
          callbacks.onNotificationReceived(appNotif);
        }
      });

      // 7. Notification tap/action performed listener
      PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
        console.log('[Push Notification] Action performed:', action);
        const data = action.notification.data || {};
        const targetId = data.targetId;
        const type = (data.type as 'event' | 'product' | 'notice') || 'notice';

        if (targetId && callbacks.onNotificationActionPerformed) {
          callbacks.onNotificationActionPerformed(targetId, type);
        }
      });

      // 3. 이미 허용된 기기만 바로 토큰 등록. 아직 묻지 않은 기기는 동의 안내 화면 뒤에 OS 권한창을 띄웁니다.
      //    알림을 끈 기기는 등록하지 않고, 예전에 저장된 토큰이 있으면 서버에서 지웁니다.
      if (!isPushEnabledInApp()) {
        console.log('[Push Notification] Turned off in app; skip registration');
        await unregisterDevicePush();
        return;
      }
      const permStatus = await PushNotifications.checkPermissions();
      if (permStatus.receive === 'granted') {
        await PushNotifications.register();
      } else {
        console.log('[Push Notification] Permission not granted yet:', permStatus.receive);
      }
    } catch (e) {
      console.warn('[Push Notification] Native init error:', e);
    }
  } else {
    // Web Browser environment
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (!isPushEnabledInApp()) {
        await unregisterDevicePush();
        return;
      }
      // Create or load a unique web device token
      let webToken = localStorage.getItem('sinsangpick_device_token');
      if (!webToken) {
        webToken = 'web-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now();
        localStorage.setItem('sinsangpick_device_token', webToken);
      }
      currentDeviceToken = webToken;

      // Register web token to Supabase
      saveDeviceToken({
        token: webToken,
        platform: 'web',
        userId: callbacks.userId,
        userName: callbacks.userName
      }).catch(() => {});
    }
  }
};

/**
 * Request system notification permission (Web & Native)
 */
export const requestPushPermission = async (): Promise<boolean> => {
  if (Capacitor.isNativePlatform()) {
    try {
      const result = await PushNotifications.requestPermissions();
      if (result.receive === 'granted') {
        if (canRegisterNativePush()) await PushNotifications.register();
        return true;
      }
      return false;
    } catch (e) {
      console.error('[Push Notification] Request native permission error:', e);
      return false;
    }
  } else {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }
};

/**
 * Check notification permission status
 */
export const checkPushPermissionStatus = async (): Promise<'granted' | 'denied' | 'prompt'> => {
  if (Capacitor.isNativePlatform()) {
    try {
      const status = await PushNotifications.checkPermissions();
      if (status.receive === 'granted') return 'granted';
      if (status.receive === 'denied') return 'denied';
      return 'prompt';
    } catch (e) {
      return 'prompt';
    }
  } else {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') return 'granted';
      if (Notification.permission === 'denied') return 'denied';
      return 'prompt';
    }
    return 'denied';
  }
};

/**
 * Open device system settings (iOS / Android)
 */
export const openDeviceSettings = async (): Promise<void> => {
  if (Capacitor.isNativePlatform()) {
    try {
      if (Capacitor.getPlatform() === 'ios') {
        window.location.href = 'app-settings:';
      } else {
        // Android: 앱 정보 화면(알림 권한)으로 이동
        window.location.href = 'intent:#Intent;action=android.settings.APPLICATION_DETAILS_SETTINGS;data=package:com.sinsangpick.app;end';
      }
    } catch (e) {
      console.warn('[Push Notification] Failed to open device settings:', e);
    }
  }
};

const PERMISSION_REVIEWED_KEY = 'sinsangpick_permissions_reviewed';
const PERMISSION_SNOOZE_KEY = 'sinsangpick_permission_snooze';
const SNOOZE_DAYS = 3;
const MAX_ASKS = 4;

/**
 * 알림 동의 안내를 지금 보여줄지 결정합니다.
 * - 한 번도 안 물어봤으면 보여줌
 * - "나중에"를 눌렀다면 3일 뒤 다시 (최대 4회까지) — 이미 허용/거부한 사용자는 다시 묻지 않음
 */
export const shouldShowPushPrompt = (): boolean => {
  try {
    const raw = localStorage.getItem(PERMISSION_SNOOZE_KEY);
    if (raw === 'done') return false;
    if (!raw) return true; // 처음이거나, 예전 버전에서 한 번 넘기고 끝난 사용자도 한 번 더 안내
    const { at, count } = JSON.parse(raw) as { at: number; count: number };
    if (count >= MAX_ASKS) return false;
    return Date.now() - at >= SNOOZE_DAYS * 86400000;
  } catch {
    return false;
  }
};

export const snoozePushPrompt = (): void => {
  try {
    const prev = JSON.parse(localStorage.getItem(PERMISSION_SNOOZE_KEY) || 'null');
    const count = (prev && typeof prev.count === 'number' ? prev.count : 0) + 1;
    localStorage.setItem(PERMISSION_SNOOZE_KEY, JSON.stringify({ at: Date.now(), count }));
    localStorage.setItem(PERMISSION_REVIEWED_KEY, 'true');
  } catch {
    // ignore
  }
};

export const completePushPrompt = (): void => {
  try {
    localStorage.setItem(PERMISSION_SNOOZE_KEY, 'done');
    localStorage.setItem(PERMISSION_REVIEWED_KEY, 'true');
  } catch {
    // ignore
  }
};

/**
 * Get stored marketing notification consent status
 */
export const getMarketingConsentStatus = (): boolean => {
  try {
    return localStorage.getItem('sinsangpick_marketing_agreed') === 'true';
  } catch {
    return false;
  }
};

/**
 * Update marketing notification consent status with timestamp
 */
export const setMarketingConsentStatus = (agreed: boolean): void => {
  try {
    localStorage.setItem('sinsangpick_marketing_agreed', String(agreed));
    if (agreed) {
      localStorage.setItem('sinsangpick_marketing_agreed_date', new Date().toISOString());
    }
  } catch {
    // ignore
  }
};

/**
 * Fetch remote notifications from Supabase
 */
export const fetchNotificationsFromSupabase = async (): Promise<AppNotification[]> => {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.warn('[Notification Service] Fetch notifications error:', error.message);
      return [];
    }

    return (data || []).map(row => ({
      id: row.id,
      title: row.title,
      body: row.body,
      type: row.type || 'notice',
      targetId: row.target_id || '',
      imageUrl: row.image_url || undefined,
      timestamp: row.created_at || new Date().toISOString(),
      createdAt: row.created_at || new Date().toISOString(),
      isRead: false,
      badge: row.badge || '알림'
    }));
  } catch (err) {
    console.warn('[Notification Service] Error fetching notifications:', err);
    return [];
  }
};

/**
 * Realtime subscription to new notifications from Supabase
 */
export const subscribeToNotifications = (onNotification: (notif: AppNotification) => void) => {
  if (!supabase) return null;

  try {
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          const newRow = payload.new;
          if (newRow && newRow.title) {
            const timeIso = newRow.created_at || new Date().toISOString();
            const notif: AppNotification = {
              id: newRow.id,
              title: newRow.title,
              body: newRow.body,
              type: newRow.type || 'notice',
              targetId: newRow.target_id || '',
              imageUrl: newRow.image_url || undefined,
              timestamp: timeIso,
              createdAt: timeIso,
              isRead: false,
              badge: newRow.badge || '알림'
            };
            onNotification(notif);
          }
        }
      )
      .subscribe();

    return channel;
  } catch (e) {
    console.warn('[Notification Service] Realtime subscribe error:', e);
    return null;
  }
};

/**
 * Send Admin Push Notification (Saves to Supabase Realtime & dispatches FCM/APNs push)
 */
export const sendAdminPushNotification = async (payload: SendPushPayload): Promise<SendPushResult> => {
  // 호출한 쪽이 정한 id 가 있으면 그대로 써서, 화면의 임시 항목과 DB 행이 같은 알림으로 합쳐지게 합니다
  // 광고·혜택은 promo-, 서비스 안내는 notif- 로 시작합니다 (서버도 같은 규칙으로 id 를 정합니다)
  const kindPrefix = payload.messageKind === 'service' ? 'notif' : 'promo';
  const notifId = `${kindPrefix}-${/-(\d+)$/.exec(payload.id || '')?.[1] || Date.now()}`;
  const nowIso = new Date().toISOString();
  const createdNotif: AppNotification = {
    id: notifId,
    title: payload.title,
    body: payload.body,
    type: payload.type,
    targetId: payload.targetId,
    imageUrl: payload.imageUrl,
    timestamp: nowIso,
    createdAt: nowIso,
    isRead: false,
    badge: payload.badge || (payload.type === 'event' ? '이벤트' : payload.type === 'product' ? '신제품' : '알림')
  };

  // 1. Save directly to Supabase notifications table (Triggers Supabase Realtime to all connected devices)
  let dbSaved = false;
  if (supabase) {
    try {
      const { error: dbError } = await supabase.from('notifications').insert({
        id: notifId,
        title: payload.title,
        body: payload.body,
        type: payload.type,
        target_id: payload.targetId || null,
        image_url: payload.imageUrl || null,
        badge: createdNotif.badge,
        created_at: nowIso
      });
      if (!dbError) {
        dbSaved = true;
        console.log('[Notification Service] Notification saved to Supabase & Realtime broadcasted:', notifId);
      } else {
        console.warn('[Notification Service] Direct Supabase insert warning:', dbError.message);
      }
    } catch (err: any) {
      console.warn('[Notification Service] Failed to direct insert to Supabase:', err);
    }
  }

  // 알림함 저장(실시간 전달)은 됐지만 기기 푸시 발송 결과를 받지 못한 경우
  const realtimeOnlyResult = (pushError: string): SendPushResult => ({
    success: true,
    notification: createdNotif,
    dbSaved,
    pushError,
  });

  // 2. Dispatch via Serverless FCM / APNs endpoint
  try {
    const baseUrl = Capacitor.isNativePlatform() ? 'https://www.sinsangpick.kr' : '';
    const response = await fetch(`${baseUrl}/api/send-fcm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(await getAdminAuthHeaders())
      },
      body: JSON.stringify({
        ...payload,
        id: notifId,
        badge: createdNotif.badge,
        saveToDb: !dbSaved // If already saved directly, avoid double insertion
      })
    });

    if (response.ok) {
      const data = await response.json();
      return {
        ...data,
        notification: data.notification || createdNotif,
        dbSaved: dbSaved || data.dbSaved === true
      };
    }

    // 앱 알림함에는 저장됐고(실시간 전달) 기기 푸시만 실패한 경우
    if (dbSaved) return realtimeOnlyResult('기기 푸시 서버 응답 오류');

    // 발송 실패를 성공으로 표시하지 않습니다.
    let serverError = '';
    try { serverError = (await response.json())?.error || ''; } catch { /* non-JSON */ }
    return {
      success: false,
      error: serverError || (response.status === 401 || response.status === 403
        ? '관리자 권한을 확인하지 못했습니다. 다시 로그인해주세요.'
        : `알림 발송 서버 오류 (${response.status})`)
    };
  } catch (error: any) {
    console.warn('[Notification Service] /api/send-fcm call warning:', error);
    if (dbSaved) return realtimeOnlyResult('알림 발송 서버에 연결하지 못했습니다.');
    return { success: false, error: '알림 발송 서버에 연결하지 못했습니다.' };
  }
};

/**
 * Get FCM status and registered token counts
 */
export const getFcmStatus = async (): Promise<FcmStatusInfo> => {
  try {
    const baseUrl = Capacitor.isNativePlatform() ? 'https://www.sinsangpick.kr' : '';
    const res = await fetch(`${baseUrl}/api/send-fcm`, { method: 'GET' });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // ignore
  }

  // Fallback: query supabase directly
  let count = 0;
  let tokensByPlatform = { ios: 0, android: 0, web: 0 };
  if (supabase) {
    try {
      const { data } = await supabase.from('device_tokens').select('platform');
      if (data) {
        count = data.length;
        data.forEach((row: any) => {
          const p = (row.platform || 'web') as 'ios' | 'android' | 'web';
          tokensByPlatform[p] = (tokensByPlatform[p] || 0) + 1;
        });
      }
    } catch (e) {
      // ignore
    }
  }

  return {
    status: 'online',
    hasFcmKey: false,
    registeredTokens: count,
    tokensByPlatform
  };
};

const PUSH_ERROR_LABELS: Record<string, string> = {
  apns_not_configured: 'APNs 키 미설정',
  fcm_not_configured: 'FCM 키 미설정',
  InvalidProviderToken: 'APNs 키·키ID·팀ID 불일치',
  ExpiredProviderToken: 'APNs 키 만료',
  BadTopic: 'APNs 번들ID 불일치',
  TopicDisallowed: 'APNs 앱 푸시 권한 없음',
  MissingProviderToken: 'APNs 인증 누락',
  SENDER_ID_MISMATCH: 'FCM 프로젝트 불일치',
  THIRD_PARTY_AUTH_ERROR: 'FCM 인증 오류',
};

/** 관리자 화면 토스트 문구: 실제로 기기에 몇 대 갔는지 그대로 보여줍니다 */
export const describePushResult = (res: SendPushResult): string => {
  if (res.pushError) return `알림함에는 저장됐지만 기기 푸시는 보내지 못했습니다 (${res.pushError})`;

  const push = res.push;
  if (!push) return '인앱 알림함에 저장됐습니다.';

  const audience = res.audience;
  const label = audience ? (audience.messageKind === 'marketing' ? '광고·혜택' : '서비스 안내') : '';
  if (audience?.messageKind === 'marketing' && audience.consentUnavailable) {
    return '📢 광고·혜택 알림은 보내지 않았습니다 (기기 동의 설정이 아직 서버에 적용되지 않았습니다).';
  }
  const excluded: string[] = [];
  if (audience && audience.skippedNoMarketing > 0) excluded.push(`마케팅 미동의 ${audience.skippedNoMarketing}대`);
  if (audience && audience.skippedNoNight > 0) excluded.push(`야간 미동의 ${audience.skippedNoNight}대`);

  if (push.targetCount === 0) {
    const why = excluded.length ? ` (${excluded.join(', ')} 제외)` : '';
    return `${label ? `📢 ${label} · ` : ''}푸시를 허용하고 동의한 기기가 없어 기기 알림은 보내지 않았습니다${why}.`;
  }

  const parts = [`${label ? `${label} · ` : ''}푸시 허용 기기 ${push.targetCount}대 중 ${push.sentCount}대 발송`];
  if (push.failedCount > 0) {
    const reasons = Object.keys(push.errors || {}).map((key) => PUSH_ERROR_LABELS[key] || key);
    parts.push(`${push.failedCount}대 실패${reasons.length ? `(${reasons.join(', ')})` : ''}`);
  }
  if (excluded.length) parts.push(`${excluded.join(', ')} 제외`);
  return `📢 ${parts.join(' · ')}`;
};

/**
 * 관리자 전용: APNs·FCM 인증 키가 실제로 통하는지 점검합니다. 기기로는 아무것도 보내지 않습니다.
 */
export const checkPushConnections = async (): Promise<{ apns: PushConnectionCheck; fcm: PushConnectionCheck }> => {
  const baseUrl = Capacitor.isNativePlatform() ? 'https://www.sinsangpick.kr' : '';
  const res = await fetch(`${baseUrl}/api/send-fcm?check=1`, {
    headers: await getAdminAuthHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `연결 점검 실패 (${res.status})`);
  }
  return { apns: data.apns, fcm: data.fcm };
};

export function formatRelativeTime(dateStr?: string | null, fallbackId?: string): string {
  try {
    if (!dateStr && !fallbackId) return '방금 전';

    let date: Date | null = null;
    if (dateStr) {
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        date = parsed;
      } else {
        const num = Number(dateStr);
        if (!isNaN(num) && num > 1000000000000) {
          date = new Date(num);
        }
      }
    }

    // Fallback: If dateStr is invalid (e.g. legacy static '방금 전'), try parsing epoch timestamp from id (e.g., 'notif-1727330000000')
    if (!date && fallbackId) {
      if (fallbackId.startsWith('notif-')) {
        const idPart = fallbackId.replace('notif-', '');
        const num = Number(idPart);
        if (!isNaN(num) && num > 1000000000000) {
          date = new Date(num);
        }
      }
    }

    if (!date) {
      if (dateStr && (dateStr.includes('전') || dateStr.includes('월') || dateStr.includes('.'))) {
        return dateStr;
      }
      return '방금 전';
    }

    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return '방금 전';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}분 전`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}시간 전`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}일 전`;

    const month = date.getMonth() + 1;
    const day = date.getDate();
    if (date.getFullYear() === now.getFullYear()) {
      return `${month}월 ${day}일`;
    }
    return `${date.getFullYear()}.${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')}`;
  } catch (e) {
    return '방금 전';
  }
}
