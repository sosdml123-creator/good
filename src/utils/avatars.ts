// Avatar Presets & Helpers for Sinsangpick

export interface AvatarPreset {
  id: string;
  name: string;
  category: 'official' | 'character' | 'food';
  url: string;
  themeColor: string;
  emoji: string;
}

// Helper to create an SVG data URL from SVG markup
const toSvgDataUrl = (svgContent: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
};

// 1. 고양이 미식가 아바타
const catAvatarSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="catBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFECD2"/>
      <stop offset="100%" stop-color="#FCB69F"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="60" fill="url(#catBg)"/>
  <!-- Ears -->
  <polygon points="32,54 24,24 50,38" fill="#FF8C42" />
  <polygon points="32,50 28,30 46,40" fill="#FFB5A7" />
  <polygon points="88,54 96,24 70,38" fill="#FF8C42" />
  <polygon points="88,50 92,30 74,40" fill="#FFB5A7" />
  <!-- Head -->
  <circle cx="60" cy="65" r="38" fill="#FFA559"/>
  <circle cx="60" cy="72" r="28" fill="#FFE5D9"/>
  <!-- Eyes -->
  <circle cx="46" cy="60" r="5" fill="#292524"/>
  <circle cx="48" cy="58" r="1.8" fill="#FFFFFF"/>
  <circle cx="74" cy="60" r="5" fill="#292524"/>
  <circle cx="76" cy="58" r="1.8" fill="#FFFFFF"/>
  <!-- Nose & Mouth -->
  <polygon points="57,68 63,68 60,72" fill="#F43F5E"/>
  <path d="M54,73 Q60,78 60,72 Q60,78 66,73" fill="none" stroke="#292524" stroke-width="2" stroke-linecap="round"/>
  <!-- Blush -->
  <circle cx="38" cy="68" r="5" fill="#FB7185" opacity="0.6"/>
  <circle cx="82" cy="68" r="5" fill="#FB7185" opacity="0.6"/>
  <!-- Whiskers -->
  <line x1="28" y1="64" x2="18" y2="62" stroke="#292524" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="28" y1="70" x2="18" y2="72" stroke="#292524" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="92" y1="64" x2="102" y2="62" stroke="#292524" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="92" y1="70" x2="102" y2="72" stroke="#292524" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

// 2. 댕댕이 신상 헌터
const dogAvatarSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="dogBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E0C3FC"/>
      <stop offset="100%" stop-color="#8EC5FC"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="60" fill="url(#dogBg)"/>
  <!-- Ears -->
  <ellipse cx="28" cy="52" rx="14" ry="24" fill="#C27803" transform="rotate(-15 28 52)"/>
  <ellipse cx="92" cy="52" rx="14" ry="24" fill="#C27803" transform="rotate(15 92 52)"/>
  <!-- Head -->
  <circle cx="60" cy="64" r="38" fill="#FBBF24"/>
  <!-- Muzzle -->
  <ellipse cx="60" cy="74" rx="20" ry="16" fill="#FFFBEB"/>
  <!-- Nose -->
  <ellipse cx="60" cy="69" rx="7" ry="5" fill="#1F2937"/>
  <!-- Eyes -->
  <circle cx="45" cy="57" r="5" fill="#1F2937"/>
  <circle cx="47" cy="55" r="1.8" fill="#FFFFFF"/>
  <circle cx="75" cy="57" r="5" fill="#1F2937"/>
  <circle cx="77" cy="55" r="1.8" fill="#FFFFFF"/>
  <!-- Tongue -->
  <path d="M57,80 C57,87 63,87 63,80 Z" fill="#F43F5E"/>
  <!-- Smile -->
  <path d="M53,74 Q60,78 60,72 Q60,78 67,74" fill="none" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/>
  <!-- Cheeks -->
  <circle cx="36" cy="68" r="5" fill="#F472B6" opacity="0.6"/>
  <circle cx="84" cy="68" r="5" fill="#F472B6" opacity="0.6"/>
</svg>`;

// 3. 곰돌이 리뷰어
const bearAvatarSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="bearBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D4FC79"/>
      <stop offset="100%" stop-color="#96E6A1"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="60" fill="url(#bearBg)"/>
  <!-- Ears -->
  <circle cx="32" cy="36" r="15" fill="#8D5B4C"/>
  <circle cx="32" cy="36" r="9" fill="#DDB892"/>
  <circle cx="88" cy="36" r="15" fill="#8D5B4C"/>
  <circle cx="88" cy="36" r="9" fill="#DDB892"/>
  <!-- Head -->
  <circle cx="60" cy="65" r="38" fill="#A47148"/>
  <!-- Snout -->
  <ellipse cx="60" cy="72" rx="19" ry="15" fill="#DDB892"/>
  <!-- Nose -->
  <ellipse cx="60" cy="67" rx="6" ry="4.5" fill="#2C1810"/>
  <!-- Mouth -->
  <path d="M55,73 Q60,77 60,70 Q60,77 65,73" fill="none" stroke="#2C1810" stroke-width="2" stroke-linecap="round"/>
  <!-- Eyes -->
  <circle cx="45" cy="56" r="4.5" fill="#2C1810"/>
  <circle cx="47" cy="54" r="1.5" fill="#FFFFFF"/>
  <circle cx="75" cy="56" r="4.5" fill="#2C1810"/>
  <circle cx="77" cy="54" r="1.5" fill="#FFFFFF"/>
  <!-- Cheeks -->
  <circle cx="37" cy="67" r="5" fill="#FB7185" opacity="0.6"/>
  <circle cx="83" cy="67" r="5" fill="#FB7185" opacity="0.6"/>
</svg>`;

// 4. 귀여운 토끼 미식단
const rabbitAvatarSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="bunnyBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF9A9E"/>
      <stop offset="100%" stop-color="#FECFEF"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="60" fill="url(#bunnyBg)"/>
  <!-- Ears -->
  <ellipse cx="42" cy="30" rx="9" ry="24" fill="#FFFFFF"/>
  <ellipse cx="42" cy="32" rx="5" ry="18" fill="#FFB5A7"/>
  <ellipse cx="78" cy="30" rx="9" ry="24" fill="#FFFFFF"/>
  <ellipse cx="78" cy="32" rx="5" ry="18" fill="#FFB5A7"/>
  <!-- Head -->
  <circle cx="60" cy="68" r="36" fill="#FFFFFF"/>
  <!-- Eyes -->
  <ellipse cx="47" cy="63" rx="4" ry="5.5" fill="#292524"/>
  <circle cx="48.5" cy="61" r="1.8" fill="#FFFFFF"/>
  <ellipse cx="73" cy="63" rx="4" ry="5.5" fill="#292524"/>
  <circle cx="74.5" cy="61" r="1.8" fill="#FFFFFF"/>
  <!-- Nose & Mouth -->
  <polygon points="58,70 62,70 60,73" fill="#FB7185"/>
  <path d="M55,75 Q60,78 60,73 Q60,78 65,75" fill="none" stroke="#292524" stroke-width="2" stroke-linecap="round"/>
  <!-- Cheeks -->
  <circle cx="39" cy="71" r="6" fill="#FB7185" opacity="0.65"/>
  <circle cx="81" cy="71" r="6" fill="#FB7185" opacity="0.65"/>
</svg>`;

// 5. 커피 & 홈카페 러버
const coffeeAvatarSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="coffeeBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3E2723"/>
      <stop offset="100%" stop-color="#5D4037"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="60" fill="url(#coffeeBg)"/>
  <!-- Steam -->
  <path d="M46,30 Q49,23 45,18" fill="none" stroke="#D7CCC8" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M60,28 Q64,20 59,15" fill="none" stroke="#D7CCC8" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M74,30 Q77,23 73,18" fill="none" stroke="#D7CCC8" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Cup Handle -->
  <path d="M78,55 C92,55 92,75 78,75" fill="none" stroke="#FFF8E1" stroke-width="7" stroke-linecap="round"/>
  <!-- Cup Body -->
  <path d="M34,45 L86,45 C86,45 84,85 60,85 C36,85 34,45 34,45 Z" fill="#FFF8E1"/>
  <!-- Coffee Fill -->
  <ellipse cx="60" cy="48" rx="23" ry="7" fill="#6D4C41"/>
  <!-- Latte Art Heart -->
  <path d="M60,52 C60,50 56,47 54,49 C51,51 54,54 60,57 C66,54 69,51 66,49 C64,47 60,50 60,52 Z" fill="#FFF8E1"/>
  <!-- Saucer Plate -->
  <ellipse cx="60" cy="91" rx="36" ry="6" fill="#FFE082"/>
</svg>`;

// 6. 달콤 디저트 케이크
const cakeAvatarSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="cakeBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCE4EC"/>
      <stop offset="100%" stop-color="#F8BBD0"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="60" fill="url(#cakeBg)"/>
  <!-- Cake Base -->
  <path d="M26,86 L94,86 L88,54 L32,54 Z" fill="#FFF"/>
  <!-- Cake Layers -->
  <polygon points="28,76 92,76 90,66 30,66" fill="#F48FB1"/>
  <polygon points="26,86 94,86 92,76 28,76" fill="#FFCC80"/>
  <!-- Whipped Cream Waves -->
  <circle cx="36" cy="54" r="7" fill="#FFFFFF"/>
  <circle cx="52" cy="53" r="7" fill="#FFFFFF"/>
  <circle cx="68" cy="53" r="7" fill="#FFFFFF"/>
  <circle cx="84" cy="54" r="7" fill="#FFFFFF"/>
  <!-- Strawberry on top -->
  <path d="M60,28 C50,33 52,47 60,50 C68,47 70,33 60,28 Z" fill="#E53935"/>
  <circle cx="58" cy="38" r="1.2" fill="#FFEB3B"/>
  <circle cx="63" cy="42" r="1.2" fill="#FFEB3B"/>
  <circle cx="58" cy="44" r="1.2" fill="#FFEB3B"/>
  <!-- Leaf -->
  <polygon points="60,28 55,24 60,22 65,24" fill="#43A047"/>
</svg>`;

// 7. 소프트 아이스크림
const iceCreamSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="iceBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E1F5FE"/>
      <stop offset="100%" stop-color="#B3E5FC"/>
    </linearGradient>
    <linearGradient id="swirl" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF9C4"/>
      <stop offset="100%" stop-color="#FFD54F"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="60" fill="url(#iceBg)"/>
  <!-- Cone -->
  <polygon points="44,66 76,66 60,102" fill="#D7A15C"/>
  <line x1="49" y1="72" x2="69" y2="88" stroke="#B27B38" stroke-width="1.5"/>
  <line x1="71" y1="72" x2="51" y2="88" stroke="#B27B38" stroke-width="1.5"/>
  <!-- Ice cream Swirl -->
  <ellipse cx="60" cy="65" rx="22" ry="10" fill="url(#swirl)"/>
  <ellipse cx="60" cy="53" rx="18" ry="9" fill="url(#swirl)"/>
  <ellipse cx="60" cy="42" rx="14" ry="8" fill="url(#swirl)"/>
  <ellipse cx="60" cy="32" rx="9" ry="7" fill="url(#swirl)"/>
  <path d="M60,26 Q64,19 68,22" fill="none" stroke="#FFD54F" stroke-width="4" stroke-linecap="round"/>
  <!-- Cherry on top -->
  <circle cx="68" cy="22" r="5" fill="#E53935"/>
</svg>`;

// 8. 신상 버거 매니아
const burgerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="burgerBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF3E0"/>
      <stop offset="100%" stop-color="#FFE0B2"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="60" fill="url(#burgerBg)"/>
  <!-- Top Bun -->
  <path d="M30,52 C30,30 90,30 90,52 Z" fill="#F59E0B"/>
  <!-- Sesame seeds -->
  <ellipse cx="48" cy="40" rx="2" ry="1.2" fill="#FEF3C7" transform="rotate(-20 48 40)"/>
  <ellipse cx="62" cy="36" rx="2" ry="1.2" fill="#FEF3C7"/>
  <ellipse cx="74" cy="42" rx="2" ry="1.2" fill="#FEF3C7" transform="rotate(20 74 42)"/>
  <!-- Tomato -->
  <rect x="28" y="54" width="64" height="6" rx="3" fill="#EF4444"/>
  <!-- Cheese -->
  <polygon points="26,60 94,60 84,68 60,63 36,68" fill="#FACC15"/>
  <!-- Patty -->
  <rect x="28" y="66" width="64" height="9" rx="4.5" fill="#78350F"/>
  <!-- Lettuce -->
  <path d="M26,76 Q34,71 42,76 Q50,71 58,76 Q66,71 74,76 Q82,71 94,76" fill="none" stroke="#22C55E" stroke-width="4.5" stroke-linecap="round"/>
  <!-- Bottom Bun -->
  <path d="M32,80 L88,80 C88,90 32,90 32,80 Z" fill="#F59E0B"/>
</svg>`;

// 9. 보글보글 라면 박사
const ramenSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="ramenBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEE2E2"/>
      <stop offset="100%" stop-color="#FECACA"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="60" fill="url(#ramenBg)"/>
  <!-- Chopsticks -->
  <line x1="28" y1="20" x2="88" y2="44" stroke="#D97706" stroke-width="3" stroke-linecap="round"/>
  <line x1="26" y1="26" x2="84" y2="48" stroke="#D97706" stroke-width="3" stroke-linecap="round"/>
  <!-- Bowl Body -->
  <path d="M26,56 L94,56 C94,86 78,96 60,96 C42,96 26,86 26,56 Z" fill="#DC2626"/>
  <ellipse cx="60" cy="56" rx="34" ry="9" fill="#B91C1C"/>
  <ellipse cx="60" cy="56" rx="30" ry="7" fill="#F59E0B"/>
  <!-- Noodles -->
  <path d="M38,55 Q44,48 50,55 Q56,62 62,55 Q68,48 74,55" fill="none" stroke="#FDE047" stroke-width="3.5" stroke-linecap="round"/>
  <!-- Egg -->
  <ellipse cx="60" cy="56" rx="9" ry="6" fill="#FFFBEB"/>
  <circle cx="60" cy="56" r="4" fill="#F97316"/>
  <!-- Green onion -->
  <circle cx="44" cy="54" r="2.5" fill="#16A34A"/>
  <circle cx="76" cy="54" r="2.5" fill="#16A34A"/>
</svg>`;

// 10. 치즈 피자 파티원
const pizzaSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="pizzaBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF3C7"/>
      <stop offset="100%" stop-color="#FDE68A"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="60" fill="url(#pizzaBg)"/>
  <!-- Crust -->
  <path d="M30,32 C50,22 70,22 90,32 L60,98 Z" fill="#D97706"/>
  <!-- Cheese Slice -->
  <path d="M34,36 C50,27 70,27 86,36 L60,92 Z" fill="#FBBF24"/>
  <!-- Pepperonis -->
  <circle cx="52" cy="46" r="6" fill="#DC2626"/>
  <circle cx="68" cy="48" r="5" fill="#DC2626"/>
  <circle cx="60" cy="66" r="5.5" fill="#DC2626"/>
  <!-- Basil/Oregano -->
  <rect x="44" y="58" width="3" height="4" rx="1.5" fill="#16A34A" transform="rotate(30 44 58)"/>
  <rect x="68" y="62" width="3" height="4" rx="1.5" fill="#16A34A" transform="rotate(-40 68 62)"/>
  <!-- Cheese drip -->
  <path d="M58,92 Q60,98 62,92" fill="#FBBF24"/>
</svg>`;

// 11. 프레시 아보카도
const avocadoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="avoBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#DCFCE7"/>
      <stop offset="100%" stop-color="#BBF7D0"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="60" fill="url(#avoBg)"/>
  <!-- Outer Skin -->
  <path d="M60,20 C42,20 34,42 34,68 C34,88 46,100 60,100 C74,100 86,88 86,68 C86,42 78,20 60,20 Z" fill="#14532D"/>
  <!-- Inner Flesh -->
  <path d="M60,24 C45,24 38,44 38,68 C38,85 48,96 60,96 C72,96 82,85 82,68 C82,44 75,24 60,24 Z" fill="#86EFAC"/>
  <path d="M60,30 C48,30 43,48 43,68 C43,82 51,91 60,91 C69,91 77,82 77,68 C77,48 72,30 60,30 Z" fill="#FEF08A"/>
  <!-- Pit Seed -->
  <circle cx="60" cy="72" r="16" fill="#78350F"/>
  <circle cx="56" cy="68" r="3.5" fill="#A16207" opacity="0.6"/>
</svg>`;

// 12. 상큼 딸기 프루츠
const strawberrySvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="berryBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE4E6"/>
      <stop offset="100%" stop-color="#FECDD3"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="60" fill="url(#berryBg)"/>
  <!-- Strawberry Body -->
  <path d="M60,34 C40,34 32,52 34,74 C36,92 54,100 60,102 C66,100 84,92 86,74 C88,52 80,34 60,34 Z" fill="#E11D48"/>
  <!-- Seeds -->
  <ellipse cx="48" cy="50" rx="1.5" ry="2.2" fill="#FEF08A"/>
  <ellipse cx="62" cy="48" rx="1.5" ry="2.2" fill="#FEF08A"/>
  <ellipse cx="74" cy="52" rx="1.5" ry="2.2" fill="#FEF08A"/>
  <ellipse cx="42" cy="66" rx="1.5" ry="2.2" fill="#FEF08A"/>
  <ellipse cx="54" cy="64" rx="1.5" ry="2.2" fill="#FEF08A"/>
  <ellipse cx="68" cy="66" rx="1.5" ry="2.2" fill="#FEF08A"/>
  <ellipse cx="78" cy="68" rx="1.5" ry="2.2" fill="#FEF08A"/>
  <ellipse cx="50" cy="80" rx="1.5" ry="2.2" fill="#FEF08A"/>
  <ellipse cx="64" cy="80" rx="1.5" ry="2.2" fill="#FEF08A"/>
  <ellipse cx="60" cy="92" rx="1.2" ry="1.8" fill="#FEF08A"/>
  <!-- Leaves & Stem -->
  <polygon points="60,22 58,34 62,34" fill="#15803D" stroke="#15803D" stroke-width="2"/>
  <polygon points="60,34 44,28 50,38" fill="#16A34A"/>
  <polygon points="60,34 76,28 70,38" fill="#16A34A"/>
  <polygon points="60,34 60,25 60,36" fill="#15803D"/>
  <polygon points="60,34 52,38 60,40 68,38" fill="#22C55E"/>
</svg>`;

// Default Official Avatar: 신상픽 공식 옐로우 로고
export const DEFAULT_AVATAR = '/logo.png';

// Rich Avatar Presets List
export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'official-logo',
    name: '신상픽 공식 로고',
    category: 'official',
    url: '/logo.png',
    themeColor: '#F59E0B',
    emoji: '⚡',
  },
  {
    id: 'cat-foodie',
    name: '냥이 미식가',
    category: 'character',
    url: toSvgDataUrl(catAvatarSvg),
    themeColor: '#FF8C42',
    emoji: '🐱',
  },
  {
    id: 'dog-hunter',
    name: '댕댕이 신상헌터',
    category: 'character',
    url: toSvgDataUrl(dogAvatarSvg),
    themeColor: '#FBBF24',
    emoji: '🐶',
  },
  {
    id: 'bear-reviewer',
    name: '곰돌이 리뷰어',
    category: 'character',
    url: toSvgDataUrl(bearAvatarSvg),
    themeColor: '#A47148',
    emoji: '🐻',
  },
  {
    id: 'rabbit-taster',
    name: '토끼 미식단',
    category: 'character',
    url: toSvgDataUrl(rabbitAvatarSvg),
    themeColor: '#FB7185',
    emoji: '🐰',
  },
  {
    id: 'coffee-lover',
    name: '홈카페 러버',
    category: 'food',
    url: toSvgDataUrl(coffeeAvatarSvg),
    themeColor: '#8D5B4C',
    emoji: '☕',
  },
  {
    id: 'dessert-fairy',
    name: '달콤 디저트',
    category: 'food',
    url: toSvgDataUrl(cakeAvatarSvg),
    themeColor: '#F48FB1',
    emoji: '🍰',
  },
  {
    id: 'ice-cream',
    name: '아이스크림 탐험가',
    category: 'food',
    url: toSvgDataUrl(iceCreamSvg),
    themeColor: '#38BDF8',
    emoji: '🍦',
  },
  {
    id: 'burger-snack',
    name: '신상 버거 매니아',
    category: 'food',
    url: toSvgDataUrl(burgerSvg),
    themeColor: '#F59E0B',
    emoji: '🍔',
  },
  {
    id: 'ramen-master',
    name: '보글보글 라면',
    category: 'food',
    url: toSvgDataUrl(ramenSvg),
    themeColor: '#EF4444',
    emoji: '🍜',
  },
  {
    id: 'pizza-slice',
    name: '치즈 피자',
    category: 'food',
    url: toSvgDataUrl(pizzaSvg),
    themeColor: '#EA580C',
    emoji: '🍕',
  },
  {
    id: 'avocado-healthy',
    name: '프레시 아보카도',
    category: 'food',
    url: toSvgDataUrl(avocadoSvg),
    themeColor: '#16A34A',
    emoji: '🥑',
  },
  {
    id: 'strawberry-berry',
    name: '상큼 딸기',
    category: 'food',
    url: toSvgDataUrl(strawberrySvg),
    themeColor: '#E11D48',
    emoji: '🍓',
  },
];

/**
 * Checks if a given avatar URL originates from Kakao or other social CDNs
 * (Used to prevent real face photos from being leaked automatically upon social login)
 */
export const isKakaoOrSocialRawAvatar = (url?: string | null): boolean => {
  if (!url || typeof url !== 'string') return false;
  return /kakaocdn\.net|kakao\.com|daumcdn\.net|googleusercontent\.com|apple\.com/i.test(url);
};

/**
 * Legacy alias for backwards compatibility
 */
export const isDefaultOrSocialAvatar = (url?: string | null): boolean => {
  if (!url || typeof url !== 'string') return true;
  if (url === DEFAULT_AVATAR || url === '/logo.png') return true;
  return isKakaoOrSocialRawAvatar(url);
};

/**
 * Checks if a user's avatar is a valid custom photo or preset.
 * Any valid data URL, preset SVG, logo, or public image URL is valid,
 * as long as it does not originate from raw social CDNs.
 */
export const isValidCustomPhoto = (url?: string | null, _uid?: string | null): boolean => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  // Raw social CDN avatars are filtered out for privacy
  if (isKakaoOrSocialRawAvatar(trimmed)) return false;

  // Data URLs (SVG preset, uploaded JPEG/PNG/WebP)
  if (trimmed.startsWith('data:image/')) return true;

  // Local assets (logo, etc.)
  if (trimmed.startsWith('/') || trimmed.startsWith('./')) return true;

  // Valid external image URLs (Supabase storage or hosted images)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return true;
  }

  return false;
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
