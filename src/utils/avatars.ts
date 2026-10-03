// Avatar Presets & Helpers for Sinsangpick

export interface AvatarPreset {
  id: string;
  name: string;
  category: 'official' | 'character' | 'food';
  url: string;
  themeColor: string;
  emoji: string;
}

// Default Official Avatar: 신상픽 공식 옐로우 로고
export const DEFAULT_AVATAR = '/logo.png';

// Preset avatars deleted per user request (Profile photo changes are uploaded directly from device album)
export const AVATAR_PRESETS: AvatarPreset[] = [];

/**
 * Checks if a given avatar URL originates from Kakao or other social CDNs or dummy Unsplash URLs
 * (Used to prevent real face photos from being leaked automatically upon social login)
 */
export const isKakaoOrSocialRawAvatar = (url?: string | null): boolean => {
  if (!url || typeof url !== 'string') return false;
  return /kakaocdn\.net|kakao\.com|daumcdn\.net|googleusercontent\.com|apple\.com|unsplash\.com/i.test(url);
};

/**
 * Legacy alias for backwards compatibility
 */
export const isDefaultOrSocialAvatar = (url?: string | null): boolean => {
  if (!url || typeof url !== 'string') return true;
  if (url === DEFAULT_AVATAR || url.startsWith('/logo.png')) return true;
  return isKakaoOrSocialRawAvatar(url);
};

/**
 * Checks if a user's avatar is a valid custom photo or preset.
 * Any valid data URL, preset SVG, logo, or public image URL is valid,
 * as long as it does not originate from raw social CDNs or dummy photos.
 */
export const isValidCustomPhoto = (url?: string | null, _uid?: string | null): boolean => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  // Raw social CDN avatars and dummy Unsplash photos are filtered out
  if (isKakaoOrSocialRawAvatar(trimmed)) return false;

  // Data URLs (SVG preset, uploaded JPEG/PNG/WebP)
  if (trimmed.startsWith('data:image/')) return true;

  // Local assets (logo, etc.)
  if (trimmed.startsWith('/') || trimmed.startsWith('./')) return true;

  // Valid external image URLs (Supabase storage or custom hosted images)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    // Specifically block unsplash photos that were placed as database defaults
    if (trimmed.includes('unsplash.com')) return false;
    return true;
  }

  return false;
};

/**
 * Generates official SinSangPick logo URL with embedded provider hint query parameter.
 * e.g., '/logo.png?prov=apple', '/logo.png?prov=kakao'
 * Ensures 100% reliable provider detection even without a 'provider' DB column.
 */
export const getProviderLogoUrl = (provider?: string | null): string => {
  if (!provider || provider === 'anonymous' || provider === 'email') return '/logo.png';
  return `/logo.png?prov=${provider}`;
};

/**
 * Extracts login provider from avatar URL parameter or characteristics.
 */
export const extractProviderFromAvatar = (url?: string | null): 'apple' | 'kakao' | 'google' | null => {
  if (!url || typeof url !== 'string') return null;
  if (url.includes('prov=apple')) return 'apple';
  if (url.includes('prov=kakao')) return 'kakao';
  if (url.includes('prov=google')) return 'google';
  if (/kakaocdn\.net|kakao\.com|daumcdn\.net/i.test(url)) return 'kakao';
  if (/unsplash\.com/i.test(url)) return 'kakao'; // Legacy Kakao accounts that received DB unsplash placeholder
  return null;
};

/**
 * Compresses an uploaded image file on the client side using HTML Canvas.
 * Returns a data URL string suitable for localStorage & Supabase profile storage.
 */
export const compressImageFile = (
  file: File,
  maxSize = 360,
  quality = 0.85
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('이미지를 불러오는데 실패했습니다.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('파일을 읽는데 실패했습니다.'));
    reader.readAsDataURL(file);
  });
};
