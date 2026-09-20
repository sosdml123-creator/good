// Default Lightning 'N' Avatar and Presets

export const createLightningNSVG = (
  bgGradStart: string,
  bgGradEnd: string,
  boltGradStart: string,
  boltGradMid: string,
  boltGradEnd: string,
  glowColor: string
): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgGradStart}"/>
      <stop offset="100%" stop-color="${bgGradEnd}"/>
    </linearGradient>
    <linearGradient id="bolt" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${boltGradStart}"/>
      <stop offset="45%" stop-color="${boltGradMid}"/>
      <stop offset="100%" stop-color="${boltGradEnd}"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3.5" flood-color="${glowColor}" flood-opacity="0.55"/>
    </filter>
  </defs>
  <!-- Background Disc -->
  <rect width="120" height="120" rx="60" fill="url(#bg)"/>
  <circle cx="60" cy="60" r="54" fill="none" stroke="${boltGradStart}" stroke-width="1.2" stroke-opacity="0.2" stroke-dasharray="4 4"/>

  <!-- Stylized Lightning 'N' -->
  <g filter="url(#glow)">
    <!-- Left Vertical Pillar -->
    <polygon points="30,94 30,28 43,22 43,94" fill="url(#bolt)" />
    
    <!-- Right Vertical Pillar -->
    <polygon points="77,98 77,26 90,20 90,92" fill="url(#bolt)" />
    
    <!-- Central Lightning Bolt Slash -->
    <polygon points="40,24 67,52 54,55 83,96 71,96 46,62 58,58 35,26" fill="url(#bolt)" />
    
    <!-- Energy Spark Dot -->
    <polygon points="63,20 66,24 62,28 59,24" fill="${boltGradStart}" opacity="0.9" />
  </g>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Default Avatar: 신상픽 공식 옐로우 NEW 로고
export const DEFAULT_AVATAR = '/logo.png';

// Preset Avatar Options (공식 기본 로고)
export const AVATAR_PRESETS = [
  {
    id: 'official-new-logo',
    name: '신상픽 공식 로고',
    url: '/logo.png',
    themeColor: '#EAB308',
  },
];

/**
 * Checks if a given URL is a default logo, legacy SVG, or social login avatar (Kakao, Google, Apple, etc.)
 */
export const isDefaultOrSocialAvatar = (url?: string | null): boolean => {
  if (!url || typeof url !== 'string') return true;
  if (url === DEFAULT_AVATAR || url === '/logo.png') return true;
  // Legacy lightning SVG avatar
  if (url.startsWith('data:image/svg+xml')) return true;
  // Social provider avatar domains or placeholder images
  if (/kakaocdn\.net|kakao\.com|daumcdn\.net|googleusercontent\.com|apple\.com|unsplash\.com/i.test(url)) return true;
  return false;
};

/**
 * Checks if a user's avatar is a valid custom photo uploaded by the user
 */
export const isValidCustomPhoto = (url?: string | null, uid?: string | null): boolean => {
  if (!url || typeof url !== 'string') return false;
  if (uid) {
    const isMarkedCustom = localStorage.getItem('sinsangpick_custom_photo_' + uid) === 'true';
    if (!isMarkedCustom) return false;
  }
  if (isDefaultOrSocialAvatar(url)) return false;
  // Valid uploaded image data URL (jpeg/png/webp) or Supabase storage URL
  return (
    url.startsWith('data:image/jpeg') ||
    url.startsWith('data:image/png') ||
    url.startsWith('data:image/webp') ||
    url.includes('/storage/v1/object/public/')
  );
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
