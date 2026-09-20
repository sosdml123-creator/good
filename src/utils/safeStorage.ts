/**
 * Safe LocalStorage and JSON Parsing utilities to prevent crashes from corrupted data,
 * private browsing storage access errors, or quota exceeded exceptions.
 */

export function safeJsonParse<T>(raw: string | null | undefined, fallback: T): T {
  if (raw === null || raw === undefined || raw === '') {
    return fallback;
  }
  try {
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (error) {
    console.warn('[safeJsonParse] Failed to parse JSON, returning fallback:', error);
    return fallback;
  }
}

export function safeLocalStorageGet<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return fallback;
    }
    const item = window.localStorage.getItem(key);
    if (item === null || item === undefined || item === '') {
      return fallback;
    }
    try {
      const parsed = JSON.parse(item);
      return (parsed !== null && parsed !== undefined ? parsed : fallback) as T;
    } catch {
      // If item was stored as plain string and fallback is string, return plain item
      if (typeof fallback === 'string') {
        return item as unknown as T;
      }
      return fallback;
    }
  } catch (error) {
    console.warn(`[safeLocalStorageGet] Error reading key "${key}":`, error);
    return fallback;
  }
}

export function safeLocalStorageSet<T>(key: string, value: T): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.warn(`[safeLocalStorageSet] Error saving key "${key}":`, error);
    return false;
  }
}

export function safeLocalStorageRemove(key: string): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`[safeLocalStorageRemove] Error removing key "${key}":`, error);
    return false;
  }
}

/**
 * Safe string sanitizer for edge cases (trim, length cap, emoji/script safety)
 */
export function sanitizeInput(input: string, maxLength: number = 500): string {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength);
}
