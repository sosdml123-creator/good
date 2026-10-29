import { checkApnsAuth, getApnsConfig, sendApnsNotifications } from './apns.js';
import { checkFcmAuth, getFcmConfig, sendFcmNotifications } from './fcm.js';

/**
 * 기기 푸시 공통 모듈. 관리자 수동 발송(send-fcm)과 신제품 출시 자동 알림(pending-products 승인)이 함께 씁니다.
 *
 * device_tokens 한 행 = 푸시를 받는 기기 한 대. 알림을 끈 기기는 앱이 행을 지우므로(send-fcm action=unregister)
 * 여기 나타나지 않습니다. 행마다 관심 카테고리(alert_categories, NULL 이면 DEFAULT_ALERT_CATEGORIES)를 가집니다.
 * 마이그레이션(supabase/migrations/20261029_device_push_preferences.sql) 적용 전에는 설정 컬럼이 없으므로
 * 수동 발송만 전체 기기에 보내고, 출시 자동 알림은 보내지 않습니다.
 */

/** 앱 알림 설정 화면의 카테고리 id 와 같아야 합니다 (src/components/notification/NotificationModal.tsx). */
export const ALERT_CATEGORY_IDS = [
  '전체', '신제품', '과자', '음료', '빵·디저트', '간편식', '패스트푸드', '과일', '식재료', '고기·수산', '아이스크림', '기타',
];
/** 설정을 저장한 적 없는 기기에 적용되는 기본 관심 카테고리 (앱 기본 선택과 같아야 합니다). */
export const DEFAULT_ALERT_CATEGORIES = ['과자', '음료', '빵·디저트', '간편식'];

const PUSH_PLATFORMS = ['ios', 'android'];
const PAGE_SIZE = 1000;
const PREFS_SELECT = 'token,platform,alert_categories,marketing_agreed,night_agreed';
const BASE_SELECT = 'token,platform';
const PUSH_TOKEN_REGEX = /^[A-Za-z0-9_:-]{20,512}$/;

export const isPushToken = (token) => typeof token === 'string' && PUSH_TOKEN_REGEX.test(token);

export function getSupabaseEnv() {
  return {
    url: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '',
    key: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '',
  };
}

const restHeaders = (key) => ({ apikey: key, Authorization: `Bearer ${key}` });

/**
 * 기기가 보낸 관심 카테고리를 정리합니다. null 은 기본값 사용, 배열이 아니면 undefined(잘못된 입력).
 */
export function sanitizeAlertCategories(input) {
  if (input === null || input === undefined) return null;
  if (!Array.isArray(input)) return undefined;
  return [...new Set(input.filter((c) => ALERT_CATEGORY_IDS.includes(c)))];
}

/**
 * device_tokens 를 끝까지 읽습니다. 설정 컬럼이 없으면 기본 컬럼만 읽고 prefsSupported=false 를 돌려줍니다.
 * @param {{ url: string, key: string, platforms?: string[] | null, tokens?: string[] | null }} opts
 * @returns {Promise<{ devices: Array<{ token: string, platform: string, alertCategories: string[] | null }>, prefsSupported: boolean }>}
 */
export async function loadDevices({ url, key, platforms = PUSH_PLATFORMS, tokens = null }) {
  const filters = [];
  if (platforms) filters.push(`platform=in.(${platforms.join(',')})`);
  if (tokens) filters.push(`token=in.(${tokens.map((t) => `"${t}"`).join(',')})`);
  const filterQuery = filters.map((f) => `&${f}`).join('');

  const fetchAll = async (select) => {
    const rows = [];
    for (let offset = 0; ; offset += PAGE_SIZE) {
      const res = await fetch(
        `${url}/rest/v1/device_tokens?select=${select}${filterQuery}&order=id.asc&limit=${PAGE_SIZE}&offset=${offset}`,
        { headers: restHeaders(key) }
      );
      if (!res.ok) return { ok: false, status: res.status };
      const page = await res.json();
      rows.push(...page);
      if (page.length < PAGE_SIZE) return { ok: true, rows };
    }
  };

  let prefsSupported = true;
  let result = await fetchAll(PREFS_SELECT);
  if (!result.ok) {
    prefsSupported = false;
    result = await fetchAll(BASE_SELECT);
    if (!result.ok) throw new Error(`device_tokens 조회 실패 (HTTP ${result.status})`);
  }

  const devices = result.rows.map((row) => ({
    token: row.token,
    platform: row.platform || 'web',
    alertCategories: Array.isArray(row.alert_categories) ? row.alert_categories : null,
    // 동의 컬럼이 없으면 false 로 둡니다 (광고성 알림은 보내지 않는 쪽)
    marketingAgreed: row.marketing_agreed === true,
    nightAgreed: row.night_agreed === true,
  }));
  return { devices, prefsSupported };
}

/** 이 상품이 기기의 관심 카테고리에 해당하는지. '전체'·'신제품'을 고르면 모든 신제품이 해당합니다. */
export function matchesAlertCategories(productCategory, alertCategories) {
  if (alertCategories.includes('전체') || alertCategories.includes('신제품')) return true;
  return alertCategories.includes(productCategory);
}

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** 한국 시간 기준 밤 9시~아침 8시인지 */
export function isNightKst(date = new Date()) {
  const kstHour = new Date(date.getTime() + KST_OFFSET_MS).getUTCHours();
  return kstHour >= 21 || kstHour < 8;
}

/**
 * 발송 성격에 맞는 기기만 고릅니다.
 *  - service: 서비스 안내. 푸시를 허용한 기기 전체.
 *  - marketing: 광고·혜택. 마케팅 동의 기기만, 밤 9시~아침 8시에는 야간 혜택 동의 기기만.
 * 동의 값을 알 수 없는 기기(동의 컬럼 미적용 포함)는 동의하지 않은 것으로 보고 빼냅니다.
 * @returns {{ devices: object[], audience: { messageKind: string, nightWindow: boolean, eligible: number, skippedNoMarketing: number, skippedNoNight: number } }}
 */
export function selectMessageDevices(devices, messageKind, now = new Date()) {
  const kind = messageKind === 'service' ? 'service' : 'marketing';
  const nightWindow = isNightKst(now);
  const audience = { messageKind: kind, nightWindow, eligible: 0, skippedNoMarketing: 0, skippedNoNight: 0 };
  if (kind === 'service') {
    audience.eligible = devices.length;
    return { devices: [...devices], audience };
  }

  const eligible = [];
  for (const device of devices) {
    if (device.marketingAgreed !== true) {
      audience.skippedNoMarketing += 1;
      continue;
    }
    if (nightWindow && device.nightAgreed !== true) {
      audience.skippedNoNight += 1;
      continue;
    }
    eligible.push(device);
  }
  audience.eligible = eligible.length;
  return { devices: eligible, audience };
}

/**
 * 한 기기가 받을 출시 알림 문구. products 는 그 기기의 관심 카테고리에 맞는 상품만 담겨 있습니다.
 * 상품이 여러 개면 한 통으로 묶어 보냅니다.
 */
export function buildReleaseMessage(products) {
  const [first] = products;
  const productName = [first.brand, first.name].filter(Boolean).join(' ');
  if (products.length === 1) {
    return {
      title: `🆕 [${first.category}] 관심 신상 출시`,
      body: `${productName} 출시! 지금 확인해보세요`,
      data: { type: 'product', targetId: first.id, badge: '신제품' },
    };
  }
  return {
    title: `🆕 관심 카테고리 신상 ${products.length}개 출시`,
    body: `${productName} 외 ${products.length - 1}개 · 지금 확인해보세요`,
    data: { type: 'notice', targetId: '', badge: '신제품' },
  };
}

const emptySummary = () => ({ targetCount: 0, sentCount: 0, failedCount: 0, errors: {} });

function mergeSummary(total, part) {
  total.targetCount += part.targetCount;
  total.sentCount += part.sentCount;
  total.failedCount += part.failedCount;
  for (const [reason, count] of Object.entries(part.errors)) {
    total.errors[reason] = (total.errors[reason] || 0) + count;
  }
  return total;
}

const notConfigured = (count, reason) => ({
  sentCount: 0,
  failedCount: count,
  errors: { [reason]: count },
  invalidTokens: [],
});

/**
 * 기기 목록에 같은 알림을 보냅니다. iOS 는 APNs, Android 는 FCM 으로 보내고,
 * 더 이상 유효하지 않은 토큰은 device_tokens 에서 지웁니다.
 * @returns {Promise<{ targetCount: number, sentCount: number, failedCount: number, errors: Record<string, number> }>}
 */
export async function dispatchDevicePush({ url, key, devices, message }) {
  const summary = { ...emptySummary(), targetCount: devices.length };
  if (devices.length === 0) return summary;

  const iosTokens = devices.filter((d) => d.platform === 'ios').map((d) => d.token);
  const androidTokens = devices.filter((d) => d.platform === 'android').map((d) => d.token);
  const payload = { title: message.title, body: message.body, data: message.data || {} };
  const invalidTokens = [];

  const record = (part) => {
    mergeSummary(summary, { targetCount: 0, sentCount: part.sentCount, failedCount: part.failedCount, errors: part.errors });
    invalidTokens.push(...part.invalidTokens);
  };

  if (iosTokens.length > 0) {
    const config = getApnsConfig();
    try {
      record(config
        ? await sendApnsNotifications(config, iosTokens, payload)
        : notConfigured(iosTokens.length, 'apns_not_configured'));
    } catch (err) {
      console.error('[APNs] send error:', err);
      record(notConfigured(iosTokens.length, err.message || 'apns_send_error'));
    }
  }

  if (androidTokens.length > 0) {
    const config = getFcmConfig();
    try {
      record(config
        ? await sendFcmNotifications(config, androidTokens, payload)
        : notConfigured(androidTokens.length, 'fcm_not_configured'));
    } catch (err) {
      console.error('[FCM] send error:', err);
      record(notConfigured(androidTokens.length, err.message || 'fcm_send_error'));
    }
  }

  const staleTokens = [...new Set(invalidTokens)].filter(isPushToken);
  if (staleTokens.length > 0 && url && key) {
    const inQuery = staleTokens.map((t) => `"${t}"`).join(',');
    await fetch(`${url}/rest/v1/device_tokens?token=in.(${inQuery})`, {
      method: 'DELETE',
      headers: restHeaders(key),
    }).catch(() => {});
  }
  return summary;
}

/**
 * 신제품이 승인되어 출시되면, 관심 카테고리가 맞고 푸시가 켜진 기기에만 개인별 알림을 보냅니다.
 * 같은 기기에는 승인 한 번당 한 통만 보냅니다. 설정 컬럼이 아직 없으면 아무것도 보내지 않습니다.
 * @param {Array<{ id: string, name: string, brand: string, category: string }>} products
 */
export async function sendReleasePushes(products) {
  const { url, key } = getSupabaseEnv();
  if (!url || !key || products.length === 0) {
    return { ...emptySummary(), groupCount: 0, skipped: 'not_configured' };
  }

  const { devices, prefsSupported } = await loadDevices({ url, key });
  if (!prefsSupported) {
    return { ...emptySummary(), groupCount: 0, skipped: 'prefs_unavailable' };
  }

  // 광고성 출시 알림이므로 마케팅 동의 기기(밤에는 야간 혜택 동의 기기)에만 보냅니다
  const { devices: consented, audience } = selectMessageDevices(devices, 'marketing');

  // 같은 상품 묶음을 받는 기기끼리 모아서 한 번에 보냅니다 (기기마다 문구가 달라질 수 있음)
  const groups = new Map();
  for (const device of consented) {
    if (!PUSH_PLATFORMS.includes(device.platform)) continue;
    const alerts = device.alertCategories ?? DEFAULT_ALERT_CATEGORIES;
    const matched = products.filter((p) => matchesAlertCategories(p.category, alerts));
    if (matched.length === 0) continue;

    const groupKey = matched.map((p) => p.id).join('|');
    if (!groups.has(groupKey)) groups.set(groupKey, { matched, devices: [] });
    groups.get(groupKey).devices.push(device);
  }

  const summary = {
    ...emptySummary(),
    groupCount: groups.size,
    consentSkipped: audience.skippedNoMarketing + audience.skippedNoNight,
  };
  for (const { matched, devices: targets } of groups.values()) {
    const part = await dispatchDevicePush({
      url,
      key,
      devices: targets,
      message: buildReleaseMessage(matched),
    });
    mergeSummary(summary, part);
  }
  return summary;
}

/** APNs·FCM 인증 점검 (관리자 전용 화면에서 호출). 기기로는 아무것도 보내지 않습니다. */
export async function checkPushProviders() {
  const apnsConfig = getApnsConfig();
  const fcmConfig = getFcmConfig();

  const apns = apnsConfig
    ? { configured: true, ...(await checkApnsAuth(apnsConfig).catch((err) => ({ ok: false, reason: err.message }))) }
    : { configured: false, ok: false, reason: 'APNS_KEY_ID · APNS_TEAM_ID · APNS_PRIVATE_KEY 가 설정되지 않았습니다' };
  const fcm = fcmConfig
    ? { configured: true, ...(await checkFcmAuth(fcmConfig)) }
    : { configured: false, ok: false, reason: 'FCM_SERVICE_ACCOUNT 가 설정되지 않았습니다' };

  return { apns, fcm };
}
