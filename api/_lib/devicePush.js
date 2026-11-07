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
const FULL_SELECT = 'token,platform,user_id,alert_categories,marketing_agreed,night_agreed,push_comment,push_like,push_content';
const PREFS_SELECT = 'token,platform,user_id,alert_categories,marketing_agreed,night_agreed';
const BASE_SELECT = 'token,platform,user_id';
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
export async function loadDevices({ url, key, platforms = PUSH_PLATFORMS, tokens = null, userId = null }) {
  const filters = [];
  if (userId) filters.push(`user_id=eq.${encodeURIComponent(userId)}`);
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
  // 알림 종류 컬럼(push_*)은 20261107 마이그레이션 이후에만 있습니다. 없으면 모두 켜진 것으로 봅니다.
  let result = await fetchAll(FULL_SELECT);
  if (!result.ok) result = await fetchAll(PREFS_SELECT);
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
    userId: row.user_id || null,
    pushComment: row.push_comment !== false,
    pushLike: row.push_like !== false,
    pushContent: row.push_content !== false,
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
export function selectMessageDevices(devices, messageKind, now = new Date(), { contentType = '' } = {}) {
  const kind = messageKind === 'service' ? 'service' : 'marketing';
  const nightWindow = isNightKst(now);
  const audience = { messageKind: kind, nightWindow, eligible: 0, skippedNoMarketing: 0, skippedNoNight: 0, skippedNoContent: 0 };
  // 새 콘텐츠(신제품) 알림은 '새로운 콘텐츠 알림'을 끈 기기에 보내지 않습니다
  if (contentType === 'product') {
    const before = devices.length;
    devices = devices.filter((d) => d.pushContent !== false);
    audience.skippedNoContent = before - devices.length;
  }
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
  summary.invalidCount = staleTokens.length;
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
  const { devices: consented, audience } = selectMessageDevices(devices, 'marketing', new Date(), { contentType: 'product' });

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
    consentSkipped: audience.skippedNoMarketing + audience.skippedNoNight + audience.skippedNoContent,
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

// ================= 개인 알림 발송 큐 (댓글 · 좋아요 · 포인트) =================

/** 알림 종류별로 이 기기가 받는지. 포인트·공지는 푸시를 켠 기기면 항상 받습니다. */
export function deviceAcceptsKind(device, kind) {
  if (kind === 'comment') return device.pushComment !== false;
  if (kind === 'like') return device.pushLike !== false;
  if (kind === 'content') return device.pushContent !== false;
  if (kind === 'event') return device.marketingAgreed === true && (!isNightKst() || device.nightAgreed === true);
  return true;
}

/** 실패 후 다시 보낼 때까지 기다리는 시간 (1분 · 5분 · 30분 · 2시간). 다섯 번째 실패면 포기합니다. */
export const PUSH_RETRY_DELAYS_MS = [60_000, 5 * 60_000, 30 * 60_000, 2 * 60 * 60_000];
export const PUSH_MAX_ATTEMPTS = PUSH_RETRY_DELAYS_MS.length + 1;

/**
 * 발송 결과로 큐 항목의 다음 상태를 정합니다.
 *  - 한 기기라도 받았으면 sent
 *  - 보낼 기기가 없으면 skipped (로그아웃·알림 끔·종류 끔)
 *  - 모두 무효 토큰이면 failed (다시 보내도 소용없음)
 *  - 그 밖의 실패(네트워크·APNs/FCM 일시 오류·키 미설정)는 재시도, 횟수를 넘기면 failed
 */
export function nextOutboxState({ attempts, targetCount, sentCount, failedCount, invalidCount = 0, errors = {} }, now = Date.now()) {
  const errorText = Object.entries(errors).map(([k, v]) => `${k}:${v}`).join(', ').slice(0, 500) || null;
  if (targetCount === 0) return { status: 'skipped', last_error: 'no_eligible_device', next_attempt_at: null };
  if (sentCount > 0) return { status: 'sent', last_error: failedCount > 0 ? errorText : null, next_attempt_at: null };
  if (invalidCount >= failedCount) return { status: 'failed', last_error: errorText || 'invalid_tokens', next_attempt_at: null };
  if (attempts >= PUSH_MAX_ATTEMPTS) return { status: 'failed', last_error: errorText, next_attempt_at: null };
  const delay = PUSH_RETRY_DELAYS_MS[Math.max(0, attempts - 1)] ?? PUSH_RETRY_DELAYS_MS.at(-1);
  return { status: 'pending', last_error: errorText, next_attempt_at: new Date(now + delay).toISOString() };
}

/** 푸시 data (앱이 알림을 눌렀을 때 화면 이동에 씁니다. 값은 모두 문자열) */
export function buildPersonalPushData(item) {
  const extra = item.data && typeof item.data === 'object' ? item.data : {};
  return {
    notifId: item.notification_id,
    kind: item.kind,
    type: 'notice',
    targetType: item.target_type || 'none',
    targetId: item.target_id || '',
    productId: extra.productId ? String(extra.productId) : '',
    commentId: extra.commentId ? String(extra.commentId) : '',
    createdAt: item.created_at || '',
    personal: '1',
  };
}

/**
 * 큐(push_outbox)에서 보낼 항목을 가져와 받는 사람의 기기로 보냅니다.
 * 받는 사람의 user_id 로 등록된 기기에만 보내므로, 로그아웃했거나 다른 계정으로 바뀐 기기에는 가지 않습니다.
 * @returns {Promise<{ claimed: number, sent: number, skipped: number, retry: number, failed: number }>}
 */
export async function processPushOutbox({ limit = 50 } = {}) {
  const { url, key } = getSupabaseEnv();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const stats = { claimed: 0, sent: 0, skipped: 0, retry: 0, failed: 0 };
  if (!url || !serviceKey) return { ...stats, error: 'supabase_service_key_missing' };

  const claimRes = await fetch(`${url}/rest/v1/rpc/claim_push_outbox`, {
    method: 'POST',
    headers: { ...restHeaders(serviceKey), 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_limit: limit }),
  });
  if (!claimRes.ok) return { ...stats, error: `claim_failed_${claimRes.status}` };
  const items = await claimRes.json().catch(() => []);
  stats.claimed = Array.isArray(items) ? items.length : 0;
  if (!stats.claimed) return stats;

  // 같은 사람에게 가는 알림은 기기 목록을 한 번만 읽습니다
  const devicesByUser = new Map();
  for (const item of items) {
    let summary;
    try {
      if (!devicesByUser.has(item.user_id)) {
        const { devices } = await loadDevices({ url, key: serviceKey, userId: item.user_id });
        devicesByUser.set(item.user_id, devices);
      }
      const targets = devicesByUser.get(item.user_id).filter((d) => d.userId === item.user_id && deviceAcceptsKind(d, item.kind));
      summary = await dispatchDevicePush({
        url,
        key: serviceKey,
        devices: targets,
        message: { title: item.title, body: item.body, data: buildPersonalPushData(item) },
      });
    } catch (err) {
      summary = { targetCount: 1, sentCount: 0, failedCount: 1, invalidCount: 0, errors: { [err.message || 'dispatch_error']: 1 } };
    }

    const next = nextOutboxState({ attempts: item.attempts, ...summary });
    stats[next.status === 'pending' ? 'retry' : next.status] += 1;
    const patch = {
      status: next.status,
      last_error: next.last_error,
      locked_at: null,
      result: { targetCount: summary.targetCount, sentCount: summary.sentCount, failedCount: summary.failedCount, errors: summary.errors },
      ...(next.next_attempt_at ? { next_attempt_at: next.next_attempt_at } : {}),
      ...(next.status === 'sent' ? { sent_at: new Date().toISOString() } : {}),
    };
    await fetch(`${url}/rest/v1/push_outbox?id=eq.${encodeURIComponent(item.outbox_id)}`, {
      method: 'PATCH',
      headers: { ...restHeaders(serviceKey), 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(patch),
    }).catch((err) => console.warn('[Push outbox] status update failed:', err.message));
    if (next.status !== 'sent' && next.status !== 'skipped') {
      console.warn('[Push outbox]', item.notification_id, next.status, next.last_error);
    }
  }
  return stats;
}
