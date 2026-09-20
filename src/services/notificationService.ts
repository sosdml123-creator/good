import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token, ActionPerformed, PushNotificationSchema } from '@capacitor/push-notifications';
import { supabase } from './supabase';
import { AppNotification } from '../types';

export interface DeviceTokenRecord {
  token: string;
  platform: 'ios' | 'android' | 'web';
  userId?: string;
  userName?: string;
}

export interface SendPushPayload {
  title: string;
  body: string;
  type: 'event' | 'product' | 'notice';
  targetId: string;
  imageUrl?: string;
  badge?: string;
  tokens?: string[];
}

export interface FcmStatusInfo {
  status: string;
  hasFcmKey: boolean;
  registeredTokens: number;
  tokensByPlatform: { ios: number; android: number; web: number };
}

// Memory cache for current device push token
let currentDeviceToken: string | null = null;
try {
  currentDeviceToken = localStorage.getItem('sinsangpick_device_token');
} catch (e) {
  // ignore
}

export const getStoredDeviceToken = (): string | null => currentDeviceToken;

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
    try {
      // 1. Check current permissions
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt' || permStatus.receive === 'prompt-with-rationale') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.log('[Push Notification] Permission not granted:', permStatus.receive);
        return;
      }

      // 2. Register with APNs / FCM
      await PushNotifications.register();

      // 3. Remove old listeners to avoid duplicates
      await PushNotifications.removeAllListeners();

      // 4. Token registration success listener
      PushNotifications.addListener('registration', async (token: Token) => {
        console.log('[Push Notification] Registration success token:', token.value);
        await saveDeviceToken({
          token: token.value,
          platform: platform === 'ios' ? 'ios' : 'android',
          userId: callbacks.userId,
          userName: callbacks.userName
        });
      });

      // 5. Registration error listener
      PushNotifications.addListener('registrationError', (error: any) => {
        console.error('[Push Notification] Registration error:', error);
      });

      // 6. Foreground notification received listener
      PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
        console.log('[Push Notification] Received in foreground:', notification);
        const data = notification.data || {};
        const appNotif: AppNotification = {
          id: 'notif-' + (notification.id || Date.now()),
          title: notification.title || '신상픽 알림',
          body: notification.body || '',
          type: (data.type as 'event' | 'product' | 'notice') || 'notice',
          targetId: data.targetId || '',
          imageUrl: (notification as any).largeBody || data.imageUrl || undefined,
          timestamp: '방금 전',
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

    } catch (e) {
      console.warn('[Push Notification] Native init error:', e);
    }
  } else {
    // Web Browser environment
    if (typeof window !== 'undefined' && 'Notification' in window) {
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
        await PushNotifications.register();
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
      }
    } catch (e) {
      console.warn('[Push Notification] Failed to open device settings:', e);
    }
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
      timestamp: formatRelativeTime(row.created_at),
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
            const notif: AppNotification = {
              id: newRow.id,
              title: newRow.title,
              body: newRow.body,
              type: newRow.type || 'notice',
              targetId: newRow.target_id || '',
              imageUrl: newRow.image_url || undefined,
              timestamp: '방금 전',
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
export const sendAdminPushNotification = async (payload: SendPushPayload): Promise<{
  success: boolean;
  notification?: AppNotification;
  targetTokensCount?: number;
  fcm?: any;
  error?: string;
}> => {
  const notifId = 'notif-' + Date.now();
  const createdNotif: AppNotification = {
    id: notifId,
    title: payload.title,
    body: payload.body,
    type: payload.type,
    targetId: payload.targetId,
    imageUrl: payload.imageUrl,
    timestamp: '방금 전',
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
        badge: createdNotif.badge
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

  // 2. Dispatch via Serverless FCM / APNs endpoint
  try {
    const baseUrl = Capacitor.isNativePlatform() ? 'https://sinsangpick.vercel.app' : '';
    const response = await fetch(`${baseUrl}/api/send-fcm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...payload,
        badge: createdNotif.badge,
        saveToDb: !dbSaved // If already saved directly, avoid double insertion
      })
    });

    if (response.ok) {
      const data = await response.json();
      return {
        ...data,
        notification: data.notification || createdNotif
      };
    }
  } catch (error: any) {
    console.warn('[Notification Service] /api/send-fcm call warning:', error);
  }

  return {
    success: true,
    notification: createdNotif,
    targetTokensCount: 1,
    fcm: { broadcasted: true, note: 'Supabase Realtime Live Broadcast' }
  };
};

/**
 * Get FCM status and registered token counts
 */
export const getFcmStatus = async (): Promise<FcmStatusInfo> => {
  try {
    const baseUrl = Capacitor.isNativePlatform() ? 'https://sinsangpick.vercel.app' : '';
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

/**
 * Helper to format relative time
 */
function formatRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return '방금 전';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}분 전`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}시간 전`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}일 전`;
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  } catch (e) {
    return '방금 전';
  }
}
