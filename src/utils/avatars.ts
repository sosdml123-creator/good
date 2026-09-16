// Default Lightning 'N' Avatar and Presets

const createLightningNSVG = (
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

// Default Avatar: 번개 모양 영어 N (Classic Gold / Amber)
export const DEFAULT_AVATAR = createLightningNSVG(
  '#0F172A',
  '#1E293B',
  '#FDE047',
  '#F59E0B',
  '#EF4444',
  '#F59E0B'
);

// Preset Avatar Options
export const AVATAR_PRESETS = [
  {
    id: 'lightning-gold',
    name: '골드 썬더 N (기본)',
    url: DEFAULT_AVATAR,
    themeColor: '#F59E0B',
  },
  {
    id: 'lightning-blue',
    name: '일렉트릭 블루 N',
    url: createLightningNSVG(
      '#082F49',
      '#0F172A',
      '#7DD3FC',
      '#38BDF8',
      '#2563EB',
      '#38BDF8'
    ),
    themeColor: '#38BDF8',
  },
  {
    id: 'lightning-purple',
    name: '네온 사이버 N',
    url: createLightningNSVG(
      '#2E1065',
      '#0F172A',
      '#F472B6',
      '#C084FC',
      '#8B5CF6',
      '#C084FC'
    ),
    themeColor: '#C084FC',
  },
  {
    id: 'lightning-green',
    name: '네온 에메랄드 N',
    url: createLightningNSVG(
      '#064E3B',
      '#0F172A',
      '#A7F3D0',
      '#34D399',
      '#059669',
      '#34D399'
    ),
    themeColor: '#34D399',
  },
];

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
