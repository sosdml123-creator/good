/**
 * 농수산물 (과일, 채소, 고기, 수산, 신선란 등) 전용 고화질 벡터 일러스트레이션 모듈
 * 실제 사진 대신 친근하고 직관적인 프리미엄 음식 일러스트를 제공합니다.
 */

// Helper to encode SVG string safely for data URI
export const svgToDataUri = (svgString: string): string => {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString.trim())}`;
};

// 1. [과일] 햇사레 복숭아 일러스트
export const SVG_PEACH = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="peachBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF1F2"/>
      <stop offset="100%" stop-color="#FFE4E6"/>
    </linearGradient>
    <radialGradient id="peachGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFCCD5" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#FFE4E6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="peachBody" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#FFF3E0"/>
      <stop offset="25%" stop-color="#FFAB91"/>
      <stop offset="65%" stop-color="#FF6F91"/>
      <stop offset="95%" stop-color="#E91E63"/>
      <stop offset="100%" stop-color="#C2185B"/>
    </radialGradient>
    <radialGradient id="peachLeftLobe" cx="30%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#FFE0B2"/>
      <stop offset="40%" stop-color="#FF8A80"/>
      <stop offset="85%" stop-color="#FF5252"/>
      <stop offset="100%" stop-color="#D81B60"/>
    </radialGradient>
    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#81C784"/>
      <stop offset="50%" stop-color="#4CAF50"/>
      <stop offset="100%" stop-color="#2E7D32"/>
    </linearGradient>
    <linearGradient id="leafGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#66BB6A"/>
      <stop offset="100%" stop-color="#388E3C"/>
    </linearGradient>
    <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8D6E63"/>
      <stop offset="100%" stop-color="#4E342E"/>
    </linearGradient>
    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#FF8A80" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect width="400" height="400" rx="32" fill="url(#peachBg)"/>
  <circle cx="200" cy="210" r="140" fill="url(#peachGlow)"/>

  <!-- Decorative sparkles -->
  <path d="M70 90 Q80 90 80 80 Q80 90 90 90 Q80 90 80 100 Q80 90 70 90 Z" fill="#FFA4B6"/>
  <path d="M330 110 Q338 110 338 102 Q338 110 346 110 Q338 110 338 118 Q338 110 330 110 Z" fill="#FFA4B6"/>
  <circle cx="95" cy="290" r="4" fill="#FFA4B6" opacity="0.6"/>
  <circle cx="320" cy="280" r="5" fill="#FFA4B6" opacity="0.6"/>

  <!-- Peach Shadow -->
  <ellipse cx="200" cy="335" rx="100" ry="18" fill="#F8BBD0" opacity="0.5"/>

  <!-- Main Peach Body Group -->
  <g filter="url(#softShadow)">
    <!-- Right Lobe -->
    <path d="M200 135 C260 110 320 160 320 235 C320 300 255 330 200 320 Z" fill="url(#peachBody)"/>
    <!-- Left Lobe -->
    <path d="M200 135 C140 110 80 160 80 235 C80 300 145 330 200 320 Z" fill="url(#peachLeftLobe)"/>
    <!-- Cleft Crease -->
    <path d="M200 135 C198 175 196 240 200 318" stroke="#AD1457" stroke-width="4" stroke-linecap="round" opacity="0.35"/>
    <!-- Center Highlight -->
    <ellipse cx="145" cy="195" rx="32" ry="45" transform="rotate(-20 145 195)" fill="#FFFFFF" opacity="0.25"/>
    <ellipse cx="138" cy="180" rx="14" ry="22" transform="rotate(-20 138 180)" fill="#FFFFFF" opacity="0.45"/>
    <!-- Subtle Peach Bottom Warmth -->
    <path d="M160 310 Q200 326 240 310" stroke="#FFCDD2" stroke-width="6" stroke-linecap="round" opacity="0.5"/>
  </g>

  <!-- Stem -->
  <path d="M198 140 C198 115 204 95 212 85" stroke="url(#stemGrad)" stroke-width="7" stroke-linecap="round" fill="none"/>

  <!-- Leaves -->
  <g>
    <!-- Right Leaf -->
    <path d="M204 110 C240 85 285 95 300 115 C285 135 240 135 204 110 Z" fill="url(#leafGrad)"/>
    <path d="M204 110 Q255 110 298 115" stroke="#A5D6A7" stroke-width="2" fill="none" opacity="0.8"/>
    <!-- Left Leaf -->
    <path d="M196 118 C165 95 125 105 110 125 C125 142 165 140 196 118 Z" fill="url(#leafGrad2)"/>
    <path d="M196 118 Q150 120 112 125" stroke="#C8E6C9" stroke-width="2" fill="none" opacity="0.8"/>
    <!-- Fresh Dewdrop on Leaf -->
    <circle cx="270" cy="110" r="4.5" fill="#FFFFFF" opacity="0.85"/>
    <circle cx="271.5" cy="109" r="1.5" fill="#FFFFFF"/>
  </g>
</svg>`;

// 2. [과일] 고창 당도보증 수박 일러스트
export const SVG_WATERMELON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="wmBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F0FDF4"/>
      <stop offset="100%" stop-color="#DCFCE7"/>
    </linearGradient>
    <radialGradient id="wmGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#BBF7D0" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#DCFCE7" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="wmFlesh" x1="20%" y1="20%" x2="80%" y2="80%">
      <stop offset="0%" stop-color="#FF5252"/>
      <stop offset="50%" stop-color="#FF1744"/>
      <stop offset="100%" stop-color="#D50000"/>
    </linearGradient>
    <linearGradient id="wmRindOuter" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2E7D32"/>
      <stop offset="100%" stop-color="#1B5E20"/>
    </linearGradient>
    <filter id="wmShadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#15803D" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect width="400" height="400" rx="32" fill="url(#wmBg)"/>
  <circle cx="200" cy="200" r="140" fill="url(#wmGlow)"/>

  <!-- Watermelon Slice Shadow -->
  <ellipse cx="200" cy="335" rx="110" ry="16" fill="#86EFAC" opacity="0.4"/>

  <!-- Watermelon Slice Wedge -->
  <g filter="url(#wmShadow)">
    <!-- Outer Dark Green Rind -->
    <path d="M60 210 C70 320 330 320 340 210 L200 100 Z" fill="url(#wmRindOuter)"/>
    <!-- Light Green Rind Layer -->
    <path d="M72 212 C82 308 318 308 328 212 L200 110 Z" fill="#DCEDC8"/>
    <!-- Crisp White Inner Rind Layer -->
    <path d="M82 214 C92 298 308 298 318 214 L200 120 Z" fill="#F1F8E9"/>
    <!-- Sweet Red Juicy Flesh -->
    <path d="M90 215 C100 290 300 290 310 215 L200 126 Z" fill="url(#wmFlesh)"/>
    
    <!-- Dark Green Rind Stripes -->
    <path d="M125 285 Q135 298 150 305" stroke="#0F4214" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="M190 295 Q200 308 215 307" stroke="#0F4214" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="M255 285 Q265 298 280 295" stroke="#0F4214" stroke-width="8" stroke-linecap="round" fill="none"/>

    <!-- Specular Highlight Arc -->
    <path d="M120 200 L195 140" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity="0.45"/>
    <circle cx="120" cy="205" r="4" fill="#FFFFFF" opacity="0.6"/>

    <!-- Watermelon Seeds (Teardrop shape) -->
    <!-- Seed 1 -->
    <path d="M150 200 C146 194 147 186 153 186 C158 186 159 194 155 200 C154 202 151 202 150 200 Z" fill="#212121"/>
    <circle cx="151" cy="190" r="1.5" fill="#FFFFFF" opacity="0.7"/>
    <!-- Seed 2 -->
    <path d="M195 180 C191 174 192 166 198 166 C203 166 204 174 200 180 C199 182 196 182 195 180 Z" fill="#212121"/>
    <circle cx="196" cy="170" r="1.5" fill="#FFFFFF" opacity="0.7"/>
    <!-- Seed 3 -->
    <path d="M245 195 C241 189 242 181 248 181 C253 181 254 189 250 195 C249 197 246 197 245 195 Z" fill="#212121"/>
    <circle cx="246" cy="185" r="1.5" fill="#FFFFFF" opacity="0.7"/>
    <!-- Seed 4 -->
    <path d="M140 235 C136 229 137 221 143 221 C148 221 149 229 145 235 C144 237 141 237 140 235 Z" fill="#212121"/>
    <circle cx="141" cy="225" r="1.5" fill="#FFFFFF" opacity="0.7"/>
    <!-- Seed 5 -->
    <path d="M200 230 C196 224 197 216 203 216 C208 216 209 224 205 230 C204 232 201 232 200 230 Z" fill="#212121"/>
    <circle cx="201" cy="220" r="1.5" fill="#FFFFFF" opacity="0.7"/>
    <!-- Seed 6 -->
    <path d="M260 230 C256 224 257 216 263 216 C268 216 269 224 265 230 C264 232 261 232 260 230 Z" fill="#212121"/>
    <circle cx="261" cy="220" r="1.5" fill="#FFFFFF" opacity="0.7"/>
  </g>

  <!-- Sweet Juice Droplets -->
  <circle cx="215" cy="330" r="4" fill="#FF1744" opacity="0.7"/>
  <circle cx="185" cy="345" r="3" fill="#FF1744" opacity="0.6"/>
</svg>`;

// 3. [과일] 청송 꿀사과 부사 일러스트
export const SVG_APPLE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="appleBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB"/>
      <stop offset="100%" stop-color="#FEF3C7"/>
    </linearGradient>
    <radialGradient id="appleGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FEE2E2" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#FEF3C7" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="appleBody" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FFEB3B"/>
      <stop offset="15%" stop-color="#FF5252"/>
      <stop offset="55%" stop-color="#D50000"/>
      <stop offset="85%" stop-color="#B71C1C"/>
      <stop offset="100%" stop-color="#880E4F"/>
    </radialGradient>
    <linearGradient id="appleLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#81C784"/>
      <stop offset="100%" stop-color="#2E7D32"/>
    </linearGradient>
    <filter id="appleShadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#DC2626" flood-opacity="0.28"/>
    </filter>
  </defs>
  <rect width="400" height="400" rx="32" fill="url(#appleBg)"/>
  <circle cx="200" cy="210" r="140" fill="url(#appleGlow)"/>

  <!-- Apple Ground Shadow -->
  <ellipse cx="200" cy="340" rx="95" ry="16" fill="#FDE68A" opacity="0.6"/>

  <g filter="url(#appleShadow)">
    <!-- Apple Body -->
    <path d="M200 135 C175 110 100 110 90 190 C80 270 140 330 185 330 C195 330 198 322 200 322 C202 322 205 330 215 330 C260 330 320 270 310 190 C300 110 225 110 200 135 Z" fill="url(#appleBody)"/>

    <!-- Top Dimple Shade -->
    <ellipse cx="200" cy="138" rx="22" ry="8" fill="#4E342E" opacity="0.35"/>

    <!-- Glossy Highlights -->
    <ellipse cx="145" cy="185" rx="30" ry="50" transform="rotate(-25 145 185)" fill="#FFFFFF" opacity="0.3"/>
    <ellipse cx="138" cy="170" rx="12" ry="24" transform="rotate(-25 138 170)" fill="#FFFFFF" opacity="0.5"/>
    <circle cx="160" cy="250" r="4" fill="#FFFFFF" opacity="0.3"/>
  </g>

  <!-- Wooden Stem -->
  <path d="M200 136 C202 100 218 75 235 65" stroke="#5D4037" stroke-width="7" stroke-linecap="round" fill="none"/>

  <!-- Leaf -->
  <g>
    <path d="M210 100 C245 75 285 85 295 105 C275 125 235 125 210 100 Z" fill="url(#appleLeaf)"/>
    <path d="M210 100 Q255 102 292 105" stroke="#C8E6C9" stroke-width="2" fill="none"/>
    <!-- Dewdrop -->
    <circle cx="265" cy="100" r="3.5" fill="#FFFFFF" opacity="0.9"/>
  </g>
</svg>`;

// 4. [과일] 논산 설향 고당도 생딸기 일러스트
export const SVG_STRAWBERRY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="sbBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF1F2"/>
      <stop offset="100%" stop-color="#FFE4E6"/>
    </linearGradient>
    <radialGradient id="sbGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FECDD3" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#FFE4E6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="sbBody" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FF5252"/>
      <stop offset="40%" stop-color="#E53935"/>
      <stop offset="85%" stop-color="#C62828"/>
      <stop offset="100%" stop-color="#880E4F"/>
    </radialGradient>
    <linearGradient id="sbLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#66BB6A"/>
      <stop offset="100%" stop-color="#2E7D32"/>
    </linearGradient>
    <filter id="sbShadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#E11D48" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect width="400" height="400" rx="32" fill="url(#sbBg)"/>
  <circle cx="200" cy="210" r="140" fill="url(#sbGlow)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="340" rx="75" ry="14" fill="#FDA4AF" opacity="0.4"/>

  <g filter="url(#sbShadow)">
    <!-- Strawberry Heart/Cone Body -->
    <path d="M200 120 C270 120 310 160 300 220 C288 285 225 335 200 340 C175 335 112 285 100 220 C90 160 130 120 200 120 Z" fill="url(#sbBody)"/>

    <!-- Specular Highlight -->
    <ellipse cx="150" cy="180" rx="25" ry="40" transform="rotate(-20 150 180)" fill="#FFFFFF" opacity="0.3"/>
    <ellipse cx="145" cy="165" rx="10" ry="18" transform="rotate(-20 145 165)" fill="#FFFFFF" opacity="0.55"/>

    <!-- Golden Seeds Pattern -->
    <g fill="#FFD54F" opacity="0.95">
      <!-- Row 1 -->
      <ellipse cx="160" cy="160" rx="3.5" ry="5" transform="rotate(10 160 160)"/>
      <ellipse cx="200" cy="155" rx="3.5" ry="5"/>
      <ellipse cx="240" cy="160" rx="3.5" ry="5" transform="rotate(-10 240 160)"/>
      <!-- Row 2 -->
      <ellipse cx="140" cy="195" rx="3.5" ry="5" transform="rotate(15 140 195)"/>
      <ellipse cx="175" cy="190" rx="3.5" ry="5" transform="rotate(5 175 190)"/>
      <ellipse cx="215" cy="190" rx="3.5" ry="5" transform="rotate(-5 215 190)"/>
      <ellipse cx="255" cy="195" rx="3.5" ry="5" transform="rotate(-15 255 195)"/>
      <!-- Row 3 -->
      <ellipse cx="130" cy="235" rx="3.5" ry="5" transform="rotate(20 130 235)"/>
      <ellipse cx="165" cy="230" rx="3.5" ry="5" transform="rotate(8 165 230)"/>
      <ellipse cx="200" cy="225" rx="3.5" ry="5"/>
      <ellipse cx="235" cy="230" rx="3.5" ry="5" transform="rotate(-8 235 230)"/>
      <ellipse cx="270" cy="235" rx="3.5" ry="5" transform="rotate(-20 270 235)"/>
      <!-- Row 4 -->
      <ellipse cx="150" cy="270" rx="3.5" ry="5" transform="rotate(15 150 270)"/>
      <ellipse cx="185" cy="265" rx="3.5" ry="5" transform="rotate(5 185 265)"/>
      <ellipse cx="215" cy="265" rx="3.5" ry="5" transform="rotate(-5 215 265)"/>
      <ellipse cx="250" cy="270" rx="3.5" ry="5" transform="rotate(-15 250 270)"/>
      <!-- Row 5 -->
      <ellipse cx="175" cy="300" rx="3" ry="4.5" transform="rotate(10 175 300)"/>
      <ellipse cx="200" cy="295" rx="3" ry="4.5"/>
      <ellipse cx="225" cy="300" rx="3" ry="4.5" transform="rotate(-10 225 300)"/>
      <!-- Row 6 -->
      <ellipse cx="190" cy="322" rx="2.5" ry="4"/>
      <ellipse cx="210" cy="322" rx="2.5" ry="4"/>
    </g>
  </g>

  <!-- Green Crown / Calyx -->
  <g>
    <!-- Center Stem -->
    <path d="M200 120 C200 95 206 75 215 65" stroke="#388E3C" stroke-width="7" stroke-linecap="round" fill="none"/>
    <!-- Sepals -->
    <path d="M200 120 C180 85 140 85 125 110 C145 115 175 125 200 120 Z" fill="url(#sbLeaf)"/>
    <path d="M200 120 C220 85 260 85 275 110 C255 115 225 125 200 120 Z" fill="url(#sbLeaf)"/>
    <path d="M200 120 C160 110 120 135 115 155 C140 145 175 135 200 120 Z" fill="url(#sbLeaf)"/>
    <path d="M200 120 C240 110 280 135 285 155 C260 145 225 135 200 120 Z" fill="url(#sbLeaf)"/>
    <path d="M200 120 C190 90 210 90 200 120 Z" fill="#2E7D32"/>
  </g>
</svg>`;

// 5. [과일] 제주 서귀포 고당도 타이벡 감귤 일러스트
export const SVG_CITRUS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="citrusBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF7ED"/>
      <stop offset="100%" stop-color="#FFEDD5"/>
    </linearGradient>
    <radialGradient id="citrusGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FED7AA" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#FFEDD5" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="citrusBody" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FFE082"/>
      <stop offset="25%" stop-color="#FFA726"/>
      <stop offset="70%" stop-color="#FB8C00"/>
      <stop offset="95%" stop-color="#E65100"/>
    </radialGradient>
    <linearGradient id="citrusLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#81C784"/>
      <stop offset="100%" stop-color="#2E7D32"/>
    </linearGradient>
    <filter id="citrusShadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#EA580C" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect width="400" height="400" rx="32" fill="url(#citrusBg)"/>
  <circle cx="200" cy="210" r="140" fill="url(#citrusGlow)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="335" rx="100" ry="16" fill="#FDBA74" opacity="0.45"/>

  <g filter="url(#citrusShadow)">
    <!-- Oblate/Flattened Jeju Tangerine Body -->
    <ellipse cx="200" cy="225" rx="125" ry="105" fill="url(#citrusBody)"/>

    <!-- Peel Texture Dapples -->
    <g fill="#EF6C00" opacity="0.25">
      <circle cx="120" cy="200" r="2.5"/>
      <circle cx="140" cy="240" r="2.5"/>
      <circle cx="160" cy="215" r="2"/>
      <circle cx="250" cy="210" r="2.5"/>
      <circle cx="270" cy="235" r="2"/>
      <circle cx="230" cy="250" r="2.5"/>
      <circle cx="190" cy="270" r="2.5"/>
    </g>

    <!-- Top Dimple Area -->
    <ellipse cx="200" cy="130" rx="20" ry="8" fill="#E65100" opacity="0.4"/>

    <!-- Light Reflection -->
    <ellipse cx="145" cy="180" rx="35" ry="25" transform="rotate(-15 145 180)" fill="#FFFFFF" opacity="0.32"/>
    <ellipse cx="140" cy="170" rx="16" ry="10" transform="rotate(-15 140 170)" fill="#FFFFFF" opacity="0.55"/>
  </g>

  <!-- Green Calyx & Stem -->
  <g>
    <!-- Short Woody Stem -->
    <path d="M200 130 C201 108 205 92 208 85" stroke="#4E342E" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Calyx 5-star -->
    <path d="M200 130 L188 122 L194 133 L185 138 L197 137 L200 144 L203 137 L215 138 L206 133 L212 122 Z" fill="#43A047"/>
    <!-- Right Leaf -->
    <path d="M206 115 C240 90 280 100 290 120 C270 138 235 135 206 115 Z" fill="url(#citrusLeaf)"/>
    <path d="M206 115 Q250 115 288 120" stroke="#C8E6C9" stroke-width="2" fill="none"/>
    <!-- Left Small Leaf -->
    <path d="M198 120 C175 100 145 105 135 120 C150 132 178 132 198 120 Z" fill="url(#citrusLeaf)"/>
    <circle cx="265" cy="115" r="3" fill="#FFFFFF" opacity="0.85"/>
  </g>
</svg>`;

// 6. [고기] 횡성한우 1++ 꽃등심 스테이크 일러스트
export const SVG_BEEF = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="beefBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAF5F5"/>
      <stop offset="100%" stop-color="#F5EBEB"/>
    </linearGradient>
    <radialGradient id="beefGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FECDD3" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#F5EBEB" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="beefCut" x1="15%" y1="15%" x2="85%" y2="85%">
      <stop offset="0%" stop-color="#E53935"/>
      <stop offset="40%" stop-color="#C62828"/>
      <stop offset="85%" stop-color="#880E4F"/>
      <stop offset="100%" stop-color="#4A148C"/>
    </linearGradient>
    <linearGradient id="beefFat" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFDE7"/>
      <stop offset="100%" stop-color="#FFF9C4"/>
    </linearGradient>
    <filter id="beefShadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#991B1B" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect width="400" height="400" rx="32" fill="url(#beefBg)"/>
  <circle cx="200" cy="205" r="140" fill="url(#beefGlow)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="335" rx="125" ry="18" fill="#E2E8F0" opacity="0.6"/>

  <g filter="url(#beefShadow)">
    <!-- Outer Fat Layer -->
    <path d="M75 180 C80 120 180 110 240 115 C300 120 335 160 330 220 C325 285 240 315 170 310 C110 305 70 245 75 180 Z" fill="url(#beefFat)"/>
    
    <!-- Thick Prime Meat Flesh -->
    <path d="M85 185 C90 135 180 125 235 130 C285 135 320 170 315 220 C310 275 235 300 175 295 C120 290 80 240 85 185 Z" fill="url(#beefCut)"/>

    <!-- Premium Snowflake Marbling (1++ 꽃마블링) -->
    <g stroke="#FFF9C4" stroke-linecap="round" opacity="0.85" fill="none">
      <!-- Cluster 1 -->
      <path d="M120 170 Q135 180 150 175 M135 180 Q145 195 160 190" stroke-width="3"/>
      <path d="M140 180 Q145 170 155 165" stroke-width="2"/>
      
      <!-- Cluster 2 (Center Eye) -->
      <path d="M175 160 Q205 180 230 165 M205 180 Q220 205 245 195" stroke-width="3.5"/>
      <path d="M190 195 Q205 210 220 205" stroke-width="2.5"/>
      <path d="M210 175 Q225 185 240 180" stroke-width="2"/>

      <!-- Cluster 3 (Right) -->
      <path d="M245 150 Q265 170 290 165 M265 170 Q280 190 295 185" stroke-width="3"/>
      <path d="M260 215 Q275 235 290 225" stroke-width="2.5"/>

      <!-- Cluster 4 (Bottom) -->
      <path d="M130 230 Q155 245 185 235 M155 245 Q175 265 200 260" stroke-width="3"/>
      <path d="M150 215 Q165 225 180 220" stroke-width="2"/>
      <path d="M210 240 Q235 255 255 245" stroke-width="2.5"/>
    </g>

    <!-- Outer Steak Rim Depth Highlight -->
    <path d="M100 155 C135 135 200 130 245 135" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.4"/>
  </g>

  <!-- Fresh Rosemary Sprig -->
  <g>
    <path d="M80 280 Q140 270 200 295" stroke="#2E7D32" stroke-width="4" stroke-linecap="round" fill="none"/>
    <!-- Leaves -->
    <path d="M110 278 L100 260 M125 275 L120 252 M145 273 L145 250 M165 277 L170 255 M185 285 L195 265" stroke="#43A047" stroke-width="3" stroke-linecap="round"/>
    <path d="M110 278 L105 295 M130 276 L130 298 M150 275 L155 298 M170 280 L180 302" stroke="#388E3C" stroke-width="3" stroke-linecap="round"/>
  </g>

  <!-- Coarse Black Peppercorn Garnish -->
  <circle cx="165" cy="150" r="3" fill="#212121"/>
  <circle cx="230" cy="220" r="3.5" fill="#212121"/>
  <circle cx="180" cy="210" r="2.5" fill="#212121"/>
  <circle cx="270" cy="180" r="3" fill="#212121"/>
  <circle cx="140" cy="260" r="2.5" fill="#212121"/>
</svg>`;

// 7. [고기] 제주 흑돼지 칼집 오겹살 일러스트
export const SVG_PORK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="porkBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF5F5"/>
      <stop offset="100%" stop-color="#FEE2E2"/>
    </linearGradient>
    <radialGradient id="porkGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FECDD3" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#FEE2E2" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="porkLean" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EF5350"/>
      <stop offset="100%" stop-color="#C62828"/>
    </linearGradient>
    <linearGradient id="porkFat" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#FFF9C4"/>
    </linearGradient>
    <filter id="porkShadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#DC2626" flood-opacity="0.22"/>
    </filter>
  </defs>
  <rect width="400" height="400" rx="32" fill="url(#porkBg)"/>
  <circle cx="200" cy="205" r="140" fill="url(#porkGlow)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="335" rx="120" ry="16" fill="#FECDD3" opacity="0.6"/>

  <g filter="url(#porkShadow)">
    <!-- Strip 1 (Upper Slice) -->
    <g transform="rotate(-8 200 170)">
      <!-- Base Slab -->
      <rect x="70" y="130" width="260" height="65" rx="16" fill="url(#porkLean)"/>
      <!-- Fat Layer 1 (Top Skin & Fat) -->
      <path d="M70 144 Q200 138 330 144 L330 130 Q200 125 70 130 Z" fill="url(#porkFat)"/>
      <!-- Fat Layer 2 (Middle Strip) -->
      <path d="M70 168 Q200 162 330 168 L330 156 Q200 152 70 156 Z" fill="url(#porkFat)"/>
      <!-- Diamond Knife Score Cuts (칼집) -->
      <g stroke="#B71C1C" stroke-width="2.5" stroke-linecap="round" opacity="0.75">
        <line x1="95" y1="130" x2="115" y2="195"/>
        <line x1="125" y1="130" x2="145" y2="195"/>
        <line x1="155" y1="130" x2="175" y2="195"/>
        <line x1="185" y1="130" x2="205" y2="195"/>
        <line x1="215" y1="130" x2="235" y2="195"/>
        <line x1="245" y1="130" x2="265" y2="195"/>
        <line x1="275" y1="130" x2="295" y2="195"/>
      </g>
    </g>

    <!-- Strip 2 (Lower Main Slice) -->
    <g transform="rotate(5 200 240)">
      <!-- Base Slab -->
      <rect x="70" y="210" width="260" height="70" rx="16" fill="url(#porkLean)"/>
      <!-- Fat Layer 1 (Top Skin & Fat) -->
      <path d="M70 225 Q200 220 330 225 L330 210 Q200 205 70 210 Z" fill="url(#porkFat)"/>
      <!-- Fat Layer 2 (Middle Strip) -->
      <path d="M70 252 Q200 248 330 252 L330 240 Q200 236 70 240 Z" fill="url(#porkFat)"/>
      <!-- Diamond Knife Score Cuts (칼집) -->
      <g stroke="#B71C1C" stroke-width="2.5" stroke-linecap="round" opacity="0.75">
        <line x1="100" y1="210" x2="120" y2="280"/>
        <line x1="130" y1="210" x2="150" y2="280"/>
        <line x1="160" y1="210" x2="180" y2="280"/>
        <line x1="190" y1="210" x2="210" y2="280"/>
        <line x1="220" y1="210" x2="240" y2="280"/>
        <line x1="250" y1="210" x2="270" y2="280"/>
        <line x1="280" y1="210" x2="300" y2="280"/>
      </g>
    </g>
  </g>

  <!-- Garnish: Garlic Cloves & Spring Onion -->
  <g>
    <ellipse cx="95" cy="305" rx="12" ry="8" fill="#FFF9C4" stroke="#FFE082" stroke-width="1.5"/>
    <ellipse cx="120" cy="315" rx="10" ry="7" fill="#FFF9C4" stroke="#FFE082" stroke-width="1.5"/>
    <path d="M290 295 Q310 280 325 295" stroke="#4CAF50" stroke-width="4" stroke-linecap="round" fill="none"/>
    <path d="M300 305 Q318 292 332 305" stroke="#81C784" stroke-width="3" stroke-linecap="round" fill="none"/>
  </g>
</svg>`;

// 8. [고기] 하림 무항생제 신선 닭볶음탕용 생닭 일러스트
export const SVG_CHICKEN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="chkBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB"/>
      <stop offset="100%" stop-color="#FEF3C7"/>
    </linearGradient>
    <radialGradient id="chkGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FDE68A" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#FEF3C7" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="chkMeat" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FFF0F5"/>
      <stop offset="35%" stop-color="#FFCDD2"/>
      <stop offset="75%" stop-color="#EF9A9A"/>
      <stop offset="100%" stop-color="#E57373"/>
    </radialGradient>
    <linearGradient id="boneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#EEEEEE"/>
    </linearGradient>
    <filter id="chkShadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#F59E0B" flood-opacity="0.2"/>
    </filter>
  </defs>
  <rect width="400" height="400" rx="32" fill="url(#chkBg)"/>
  <circle cx="200" cy="205" r="140" fill="url(#chkGlow)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="335" rx="110" ry="16" fill="#FDE68A" opacity="0.6"/>

  <g filter="url(#chkShadow)">
    <!-- Chicken Drumstick 1 (Background Angle) -->
    <g transform="rotate(25 240 180)">
      <!-- Bone Stem & Knobs -->
      <rect x="250" y="165" width="45" height="18" rx="4" fill="url(#boneGrad)"/>
      <circle cx="295" cy="168" r="9" fill="url(#boneGrad)"/>
      <circle cx="295" cy="180" r="9" fill="url(#boneGrad)"/>
      <!-- Meat Bulb -->
      <ellipse cx="190" cy="174" rx="75" ry="52" fill="url(#chkMeat)"/>
    </g>

    <!-- Chicken Drumstick 2 (Foreground Main) -->
    <g transform="rotate(-20 170 230)">
      <!-- Bone Stem & Knobs -->
      <rect x="240" y="215" width="50" height="20" rx="4" fill="url(#boneGrad)"/>
      <circle cx="290" cy="217" r="10" fill="url(#boneGrad)"/>
      <circle cx="290" cy="233" r="10" fill="url(#boneGrad)"/>
      <!-- Plump Fresh Meat Bulb -->
      <ellipse cx="170" cy="225" rx="85" ry="58" fill="url(#chkMeat)"/>
      <!-- Soft Glossy Sheen -->
      <ellipse cx="145" cy="205" rx="35" ry="20" transform="rotate(-10 145 205)" fill="#FFFFFF" opacity="0.45"/>
    </g>
  </g>

  <!-- Farm Fresh Herb Garnish (Parsley/Bay Leaf) -->
  <g>
    <path d="M100 290 C90 270 110 255 125 265 C135 275 120 295 100 290 Z" fill="#4CAF50"/>
    <path d="M100 290 L125 265" stroke="#81C784" stroke-width="1.5"/>
    <path d="M85 305 C75 285 95 270 110 280 C120 290 105 310 85 305 Z" fill="#388E3C"/>
  </g>
</svg>`;

// 9. [수산] 노르웨이 생연어회 일러스트
export const SVG_SALMON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="salmonBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F0F9FF"/>
      <stop offset="100%" stop-color="#E0F2FE"/>
    </linearGradient>
    <radialGradient id="salmonGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#BAE6FD" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#E0F2FE" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="salmonFlesh" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF8A65"/>
      <stop offset="50%" stop-color="#FF7043"/>
      <stop offset="100%" stop-color="#F4511E"/>
    </linearGradient>
    <linearGradient id="lemonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFEE58"/>
      <stop offset="100%" stop-color="#FDD835"/>
    </linearGradient>
    <filter id="salmonShadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#0284C7" flood-opacity="0.22"/>
    </filter>
  </defs>
  <rect width="400" height="400" rx="32" fill="url(#salmonBg)"/>
  <circle cx="200" cy="205" r="140" fill="url(#salmonGlow)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="335" rx="115" ry="16" fill="#BAE6FD" opacity="0.5"/>

  <g filter="url(#salmonShadow)">
    <!-- Salmon Fillet Slab 1 (Back Slice) -->
    <g transform="rotate(-6 190 160)">
      <path d="M70 145 C110 130 280 130 320 150 C325 180 300 200 260 205 C180 210 80 195 70 165 Z" fill="url(#salmonFlesh)"/>
      <!-- Delicate White Fat Marbling Lines -->
      <g stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.8" fill="none">
        <path d="M95 150 Q115 165 110 185"/>
        <path d="M135 142 Q155 165 150 195"/>
        <path d="M175 140 Q195 165 190 200"/>
        <path d="M215 140 Q235 165 230 200"/>
        <path d="M255 142 Q275 165 270 195"/>
        <path d="M295 148 Q305 165 295 185"/>
      </g>
    </g>

    <!-- Salmon Fillet Slab 2 (Front Fresh Sashimi Slice) -->
    <g transform="rotate(4 200 230)">
      <path d="M75 210 C120 190 280 190 325 215 C330 250 300 275 260 280 C180 285 85 270 75 235 Z" fill="url(#salmonFlesh)"/>
      <!-- Delicate White Fat Marbling Lines -->
      <g stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" opacity="0.85" fill="none">
        <path d="M100 215 Q120 235 115 260"/>
        <path d="M140 205 Q160 235 155 270"/>
        <path d="M180 200 Q205 235 195 275"/>
        <path d="M225 200 Q245 235 240 275"/>
        <path d="M265 205 Q285 235 280 270"/>
        <path d="M305 212 Q315 235 305 258"/>
      </g>
      <!-- Specular Fresh Glaze -->
      <ellipse cx="140" cy="225" rx="35" ry="12" fill="#FFFFFF" opacity="0.35"/>
    </g>
  </g>

  <!-- Fresh Lemon Wedge Garnish -->
  <g transform="translate(60, 260) rotate(-15)">
    <!-- Rind -->
    <path d="M0 40 A40 40 0 0 1 80 40 Z" fill="#FDD835"/>
    <path d="M5 38 A35 35 0 0 1 75 38 Z" fill="#FFFDE7"/>
    <!-- Segments -->
    <path d="M10 36 A30 30 0 0 1 70 36 Z" fill="url(#lemonGrad)"/>
    <line x1="40" y1="36" x2="40" y2="8" stroke="#FFFDE7" stroke-width="2"/>
    <line x1="40" y1="36" x2="20" y2="16" stroke="#FFFDE7" stroke-width="2"/>
    <line x1="40" y1="36" x2="60" y2="16" stroke="#FFFDE7" stroke-width="2"/>
  </g>

  <!-- Green Dill Sprig -->
  <path d="M295 285 Q325 270 340 290" stroke="#388E3C" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M305 282 L310 272 M318 278 L328 270 M330 282 L338 275" stroke="#4CAF50" stroke-width="2" stroke-linecap="round"/>
</svg>`;

// 10. [수산] 서해안 활 흰다리새우 / 신안 왕대하 일러스트
export const SVG_SHRIMP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="shrimpBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ECFEFF"/>
      <stop offset="100%" stop-color="#CFFAFE"/>
    </linearGradient>
    <radialGradient id="shrimpGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#A5F3FC" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#CFFAFE" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="shrimpShell" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFA4A2"/>
      <stop offset="40%" stop-color="#FF7597"/>
      <stop offset="85%" stop-color="#FF5252"/>
      <stop offset="100%" stop-color="#E53935"/>
    </linearGradient>
    <filter id="shrimpShadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#0891B2" flood-opacity="0.22"/>
    </filter>
  </defs>
  <rect width="400" height="400" rx="32" fill="url(#shrimpBg)"/>
  <circle cx="200" cy="205" r="140" fill="url(#shrimpGlow)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="335" rx="105" ry="16" fill="#A5F3FC" opacity="0.5"/>

  <g filter="url(#shrimpShadow)">
    <!-- Curled Shrimp Body (Segmented Shell) -->
    <!-- Head / Thorax -->
    <path d="M120 180 C100 135 150 90 215 95 C250 98 275 125 270 160 C265 190 225 200 185 190 Z" fill="url(#shrimpShell)"/>
    
    <!-- Segment 1 -->
    <path d="M210 115 C260 120 295 155 290 195 C285 220 260 230 235 220 C225 185 220 150 210 115 Z" fill="url(#shrimpShell)"/>
    
    <!-- Segment 2 -->
    <path d="M245 180 C290 200 300 240 280 270 C260 290 230 285 215 260 C225 235 235 205 245 180 Z" fill="url(#shrimpShell)"/>

    <!-- Segment 3 -->
    <path d="M245 250 C265 275 250 305 220 315 C195 320 180 305 185 285 C205 275 225 265 245 250 Z" fill="url(#shrimpShell)"/>

    <!-- Tail Segment -->
    <path d="M205 295 C190 315 160 320 135 310 C120 300 135 285 155 285 Z" fill="url(#shrimpShell)"/>

    <!-- Tail Fan Flippers -->
    <path d="M140 310 C110 325 90 320 85 300 C105 295 125 300 140 310 Z" fill="#E53935"/>
    <path d="M135 310 C100 335 80 340 75 320 C95 310 120 310 135 310 Z" fill="#D32F2F"/>

    <!-- Shell Segment Ridge Lines -->
    <g stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" opacity="0.6" fill="none">
      <path d="M225 105 Q245 140 235 175"/>
      <path d="M260 145 Q275 180 255 210"/>
      <path d="M270 210 Q280 240 250 265"/>
      <path d="M240 265 Q240 290 210 305"/>
    </g>

    <!-- Black Eye -->
    <circle cx="160" cy="125" r="5" fill="#212121"/>
    <circle cx="158.5" cy="123.5" r="1.8" fill="#FFFFFF"/>

    <!-- Long Graceful Antennae Curves -->
    <path d="M150 120 C100 80 50 120 40 180" stroke="#FF5252" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M152 125 C110 100 70 140 55 210" stroke="#FF8A80" stroke-width="2" stroke-linecap="round" fill="none"/>

    <!-- Swimming Legs (Pleopods) -->
    <g stroke="#FF7597" stroke-width="2.5" stroke-linecap="round" fill="none">
      <path d="M240 210 Q225 225 220 240"/>
      <path d="M255 230 Q240 245 235 260"/>
      <path d="M245 265 Q230 280 220 290"/>
    </g>
  </g>
</svg>`;

// 11. [식재료] 동물복지 유정란 자연방사란 일러스트
export const SVG_EGG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="eggBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEFCE8"/>
      <stop offset="100%" stop-color="#FEF08A"/>
    </linearGradient>
    <radialGradient id="eggGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FDE047" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#FEF08A" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="eggShell" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FFF8E1"/>
      <stop offset="40%" stop-color="#FFE0B2"/>
      <stop offset="85%" stop-color="#D7CCC8"/>
      <stop offset="100%" stop-color="#A1887F"/>
    </radialGradient>
    <radialGradient id="eggYolk" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#FFF176"/>
      <stop offset="35%" stop-color="#FFB300"/>
      <stop offset="85%" stop-color="#FF8F00"/>
      <stop offset="100%" stop-color="#E65100"/>
    </radialGradient>
    <filter id="eggShadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#CA8A04" flood-opacity="0.22"/>
    </filter>
  </defs>
  <rect width="400" height="400" rx="32" fill="url(#eggBg)"/>
  <circle cx="200" cy="205" r="140" fill="url(#eggGlow)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="340" rx="120" ry="16" fill="#FACC15" opacity="0.45"/>

  <g filter="url(#eggShadow)">
    <!-- Whole Brown Egg (Standing Upright in Background) -->
    <g transform="rotate(15 250 170)">
      <path d="M250 100 C280 100 305 145 305 195 C305 245 280 270 250 270 C220 270 195 245 195 195 C195 145 220 100 250 100 Z" fill="url(#eggShell)"/>
      <!-- Soft Shell Speckles -->
      <circle cx="235" cy="180" r="1.5" fill="#8D6E63" opacity="0.4"/>
      <circle cx="265" cy="195" r="1.8" fill="#8D6E63" opacity="0.4"/>
      <circle cx="245" cy="225" r="1.5" fill="#8D6E63" opacity="0.4"/>
      <!-- Specular Highlight -->
      <ellipse cx="230" cy="150" rx="15" ry="25" transform="rotate(-15 230 150)" fill="#FFFFFF" opacity="0.45"/>
    </g>

    <!-- Cracked Egg in Foreground (Albumen & Golden Yolk) -->
    <!-- Clear Albumen (Egg White) Pool -->
    <path d="M90 280 C80 250 130 225 180 230 C240 235 270 270 260 300 C250 330 170 340 120 330 C90 320 95 295 90 280 Z" fill="#FFFFFF" opacity="0.85"/>
    <path d="M100 285 C95 265 135 245 175 250 C225 255 250 280 240 305 C230 325 170 330 130 320 C105 315 105 295 100 285 Z" fill="#FFFDE7" opacity="0.6"/>

    <!-- Plump Spherical Golden-Orange 3D Yolk -->
    <circle cx="170" cy="285" r="42" fill="url(#eggYolk)"/>
    <!-- Specular Highlight Dome on Yolk -->
    <ellipse cx="155" cy="270" rx="14" ry="9" transform="rotate(-20 155 270)" fill="#FFFFFF" opacity="0.75"/>
    <circle cx="152" cy="268" r="3" fill="#FFFFFF"/>
  </g>

  <!-- Cracked Eggshell Cup Resting Nearby -->
  <g transform="translate(60, 210) rotate(-25)">
    <path d="M30 30 C30 50 50 65 75 65 C100 65 120 50 120 30 L105 35 L90 25 L75 35 L60 25 L45 35 Z" fill="url(#eggShell)"/>
  </g>
</svg>`;

// 12. [식재료] 풀무원 국산콩 부침두부 일러스트
export const SVG_TOFU = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="tofuBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F7FEE7"/>
      <stop offset="100%" stop-color="#ECFCCB"/>
    </linearGradient>
    <radialGradient id="tofuGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#D9F99D" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#ECFCCB" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="tofuTop" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F8FAFC"/>
    </linearGradient>
    <linearGradient id="tofuFront" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F1F5F9"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <linearGradient id="tofuSide" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E2E8F0"/>
      <stop offset="100%" stop-color="#CBD5E1"/>
    </linearGradient>
    <linearGradient id="podGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#84CC16"/>
      <stop offset="100%" stop-color="#4D7C0F"/>
    </linearGradient>
    <filter id="tofuShadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#65A30D" flood-opacity="0.2"/>
    </filter>
  </defs>
  <rect width="400" height="400" rx="32" fill="url(#tofuBg)"/>
  <circle cx="200" cy="205" r="140" fill="url(#tofuGlow)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="335" rx="120" ry="16" fill="#D9F99D" opacity="0.6"/>

  <g filter="url(#tofuShadow)">
    <!-- 3D Isometric Tofu Block -->
    <!-- Front Face -->
    <path d="M100 215 L240 270 L240 315 L100 260 Z" fill="url(#tofuFront)"/>
    <!-- Right Side Face -->
    <path d="M240 270 L320 220 L320 265 L240 315 Z" fill="url(#tofuSide)"/>
    <!-- Top Face -->
    <path d="M100 215 L180 165 L320 220 L240 270 Z" fill="url(#tofuTop)"/>

    <!-- Delicate Cotton Cloth Texture / Cuts on Top -->
    <g stroke="#E2E8F0" stroke-width="1.5" opacity="0.7">
      <line x1="135" y1="202" x2="275" y2="257"/>
      <line x1="170" y1="190" x2="310" y2="245"/>
      <line x1="140" y1="190" x2="180" y2="242"/>
      <line x1="210" y1="180" x2="250" y2="232"/>
      <line x1="260" y1="198" x2="295" y2="238"/>
    </g>
  </g>

  <!-- Fresh Soybean Pod (Edamame) Garnish -->
  <g transform="translate(60, 230) rotate(-15)">
    <!-- Pod Curve -->
    <path d="M30 40 C60 15 110 20 140 45 C110 50 60 55 30 40 Z" fill="url(#podGrad)"/>
    <!-- Bulges of Beans inside Pod -->
    <circle cx="65" cy="34" r="11" fill="#A3E635" opacity="0.5"/>
    <circle cx="95" cy="35" r="11" fill="#A3E635" opacity="0.5"/>
    <circle cx="120" cy="40" r="9" fill="#A3E635" opacity="0.5"/>
  </g>

  <!-- Toasted Sesame Seed Garnish on Tofu Top -->
  <g fill="#D97706" opacity="0.85">
    <ellipse cx="190" cy="210" rx="3.5" ry="2" transform="rotate(30 190 210)"/>
    <ellipse cx="205" cy="218" rx="3.5" ry="2" transform="rotate(-20 205 218)"/>
    <ellipse cx="225" cy="205" rx="3.5" ry="2" transform="rotate(45 225 205)"/>
    <ellipse cx="240" cy="225" rx="3.5" ry="2" transform="rotate(10 240 225)"/>
  </g>
</svg>`;

// 13. [과일 배너] 산지직송 제철 과일 랭킹 와이드 일러스트 배너 (800x400)
export const SVG_FRUIT_BANNER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="100%" height="100%">
  <defs>
    <linearGradient id="banBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF1F2"/>
      <stop offset="45%" stop-color="#FFFBEB"/>
      <stop offset="100%" stop-color="#F0FDF4"/>
    </linearGradient>
    <radialGradient id="banSun" cx="20%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#FDE68A" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#FFFBEB" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="banPeach" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFAB91"/>
      <stop offset="60%" stop-color="#FF6F91"/>
      <stop offset="100%" stop-color="#E91E63"/>
    </linearGradient>
    <linearGradient id="banWm" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF5252"/>
      <stop offset="100%" stop-color="#D50000"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#banBg)"/>
  <circle cx="160" cy="120" r="200" fill="url(#banSun)"/>

  <!-- Subtle Sunbeam & Sparkle Accents -->
  <path d="M400 60 Q410 60 410 50 Q410 60 420 60 Q410 60 410 70 Q410 60 400 60 Z" fill="#F59E0B" opacity="0.6"/>
  <path d="M680 80 Q690 80 690 70 Q690 80 700 80 Q690 80 690 90 Q690 80 680 80 Z" fill="#EC4899" opacity="0.5"/>
  <circle cx="720" cy="160" r="6" fill="#FBBF24" opacity="0.5"/>
  <circle cx="360" cy="140" r="4" fill="#34D399" opacity="0.5"/>

  <!-- Left Side: Farm Fresh Atmosphere / Leaf Vines -->
  <path d="M0 0 C120 40 180 180 160 400 L0 400 Z" fill="#DCFCE7" opacity="0.35"/>
  
  <!-- Right Group of Fresh Illustrated Fruits -->
  <!-- 1. Big Juicy Watermelon Slice (Center-Right) -->
  <g transform="translate(480, 110) rotate(-12)">
    <path d="M0 160 C10 260 220 260 230 160 L115 60 Z" fill="#1B5E20"/>
    <path d="M12 162 C20 248 210 248 218 162 L115 70 Z" fill="#DCEDC8"/>
    <path d="M22 165 C30 235 200 235 208 165 L115 82 Z" fill="url(#banWm)"/>
    <!-- Seeds -->
    <circle cx="85" cy="150" r="3" fill="#212121"/>
    <circle cx="115" cy="130" r="3" fill="#212121"/>
    <circle cx="145" cy="150" r="3" fill="#212121"/>
    <circle cx="115" cy="175" r="3" fill="#212121"/>
  </g>

  <!-- 2. Sweet Peach (Foreground Left of watermelon) -->
  <g transform="translate(370, 160)">
    <circle cx="65" cy="100" r="70" fill="url(#banPeach)"/>
    <path d="M65 30 C30 50 15 90 25 130 C35 165 75 170 65 170 C55 170 95 165 105 130 C115 90 100 50 65 30 Z" fill="url(#banPeach)"/>
    <!-- Leaves -->
    <path d="M65 35 C85 10 115 20 125 35 C110 50 85 45 65 35 Z" fill="#4CAF50"/>
    <!-- Specular -->
    <ellipse cx="40" cy="80" rx="14" ry="24" transform="rotate(-20 40 80)" fill="#FFFFFF" opacity="0.35"/>
  </g>

  <!-- 3. Red Apple (Right side) -->
  <g transform="translate(620, 180) rotate(10)">
    <circle cx="60" cy="70" r="55" fill="#D32F2F"/>
    <path d="M60 15 C62 -5 72 -20 82 -25" stroke="#5D4037" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M68 0 C90 -15 115 -10 120 5 C105 15 85 15 68 0 Z" fill="#66BB6A"/>
    <ellipse cx="40" cy="55" rx="12" ry="20" transform="rotate(-20 40 55)" fill="#FFFFFF" opacity="0.35"/>
  </g>

  <!-- 4. Fresh Strawberry (Front Accent) -->
  <g transform="translate(470, 250) rotate(15)">
    <path d="M35 15 C55 15 70 30 65 55 C60 80 40 95 35 95 C30 95 10 80 5 55 C0 30 15 15 35 15 Z" fill="#E53935"/>
    <!-- Green Cap -->
    <path d="M35 15 L25 5 L35 18 L45 5 L35 15 Z" fill="#43A047" stroke="#43A047" stroke-width="4"/>
    <!-- Seeds -->
    <circle cx="25" cy="40" r="1.5" fill="#FFD54F"/>
    <circle cx="45" cy="40" r="1.5" fill="#FFD54F"/>
    <circle cx="35" cy="60" r="1.5" fill="#FFD54F"/>
  </g>

  <!-- 5. Golden Mandarin (Front Left) -->
  <g transform="translate(320, 230) rotate(-10)">
    <ellipse cx="45" cy="45" rx="42" ry="36" fill="#FB8C00"/>
    <circle cx="45" cy="12" r="4" fill="#388E3C"/>
    <path d="M45 12 C60 0 75 5 80 15 C70 20 55 18 45 12 Z" fill="#4CAF50"/>
    <ellipse cx="30" cy="35" rx="12" ry="8" fill="#FFFFFF" opacity="0.4"/>
  </g>
</svg>`;

// Precomputed Data URIs
export const ILLUSTRATION_PEACH = svgToDataUri(SVG_PEACH);
export const ILLUSTRATION_WATERMELON = svgToDataUri(SVG_WATERMELON);
export const ILLUSTRATION_APPLE = svgToDataUri(SVG_APPLE);
export const ILLUSTRATION_STRAWBERRY = svgToDataUri(SVG_STRAWBERRY);
export const ILLUSTRATION_CITRUS = svgToDataUri(SVG_CITRUS);
export const ILLUSTRATION_BEEF = svgToDataUri(SVG_BEEF);
export const ILLUSTRATION_PORK = svgToDataUri(SVG_PORK);
export const ILLUSTRATION_CHICKEN = svgToDataUri(SVG_CHICKEN);
export const ILLUSTRATION_SALMON = svgToDataUri(SVG_SALMON);
export const ILLUSTRATION_SHRIMP = svgToDataUri(SVG_SHRIMP);
export const ILLUSTRATION_EGG = svgToDataUri(SVG_EGG);
export const ILLUSTRATION_TOFU = svgToDataUri(SVG_TOFU);
export const ILLUSTRATION_FRUIT_BANNER = svgToDataUri(SVG_FRUIT_BANNER);

// Product ID to Illustration Mapping for instant 1:1 matching
export const PRODUCT_ID_ILLUSTRATIONS: Record<string, string> = {
  'fruit-01': ILLUSTRATION_PEACH,
  'fruit-02': ILLUSTRATION_WATERMELON,
  'fruit-03': ILLUSTRATION_APPLE,
  'fruit-04': ILLUSTRATION_STRAWBERRY,
  'fruit-05': ILLUSTRATION_CITRUS,
  'meat-01': ILLUSTRATION_BEEF,
  'meat-02': ILLUSTRATION_PORK,
  'meat-03': ILLUSTRATION_CHICKEN,
  'seafood-01': ILLUSTRATION_SALMON,
  'seafood-shrimp-01': ILLUSTRATION_SHRIMP,
  'seafood-shrimp-02': ILLUSTRATION_SHRIMP,
  'ing-01': ILLUSTRATION_EGG,
  'ing-02': ILLUSTRATION_TOFU,
};

/**
 * 주어진 상품 정보가 농수산물(과일, 채소, 수산물, 축산/정육, 신선 식재료)에 해당하는지 판별
 */
export const isAgriMarineProduct = (product?: {
  id?: string;
  category?: string;
  subCategory?: string;
  itemType?: string;
  name?: string;
}): boolean => {
  if (!product) return false;

  // 1. Direct ID match
  if (product.id && PRODUCT_ID_ILLUSTRATIONS[product.id]) return true;

  // 2. Category match
  if (product.category === '과일' || product.category === '고기·수산') return true;

  // 3. Item type 'fresh' with raw ingredients
  if (product.itemType === 'fresh') return true;

  // 4. SubCategory check
  const freshSubCats = [
    '복숭아', '수박', '사과', '딸기', '귤', '감귤', '포도', '바나나', '참외', '배',
    '소고기', '돼지고기', '닭고기', '연어', '광어', '오징어', '새우', '대하', '전복',
    '계란', '두부', '채소', '야채', '생선', '수산물', '정육'
  ];
  if (product.subCategory && freshSubCats.some(sub => product.subCategory?.includes(sub))) {
    return true;
  }

  // 5. Name keywords check
  const name = (product.name || '').toLowerCase();
  const agriMarineKeywords = [
    '복숭아', '수박', '사과', '딸기', '감귤', '타이벡', '한우', '꽃등심', '오겹살', '삼겹살',
    '생연어', '연어회', '흰다리새우', '대하', '왕새우', '생닭', '닭볶음탕용', '유정란', '자연방사란',
    '부침두부', '국산콩두부', '제철과일', '산지직송', '활어', '생물'
  ];
  return agriMarineKeywords.some(kw => name.includes(kw));
};

/**
 * 상품에 알맞은 최적의 일러스트레이션을 반환
 */
export const getProductIllustration = (product?: {
  id?: string;
  name?: string;
  category?: string;
  subCategory?: string;
  itemType?: string;
}): string => {
  if (!product) return ILLUSTRATION_PEACH;

  // 1. Exact ID match
  if (product.id && PRODUCT_ID_ILLUSTRATIONS[product.id]) {
    return PRODUCT_ID_ILLUSTRATIONS[product.id];
  }

  const name = (product.name || '').toLowerCase();
  const subCat = (product.subCategory || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();

  // 2. Fruit items
  if (name.includes('복숭아') || subCat.includes('복숭아')) return ILLUSTRATION_PEACH;
  if (name.includes('수박') || subCat.includes('수박')) return ILLUSTRATION_WATERMELON;
  if (name.includes('사과') || subCat.includes('사과')) return ILLUSTRATION_APPLE;
  if (name.includes('딸기') || subCat.includes('딸기')) return ILLUSTRATION_STRAWBERRY;
  if (name.includes('귤') || name.includes('감귤') || subCat.includes('귤')) return ILLUSTRATION_CITRUS;

  // 3. Meat items
  if (name.includes('소고기') || name.includes('한우') || name.includes('꽃등심') || subCat.includes('소고기')) return ILLUSTRATION_BEEF;
  if (name.includes('돼지') || name.includes('오겹살') || name.includes('삼겹살') || subCat.includes('돼지고기')) return ILLUSTRATION_PORK;
  if (name.includes('닭') || name.includes('치킨') || subCat.includes('닭고기')) return ILLUSTRATION_CHICKEN;

  // 4. Seafood items
  if (name.includes('연어') || subCat.includes('연어')) return ILLUSTRATION_SALMON;
  if (name.includes('새우') || name.includes('대하') || subCat.includes('새우')) return ILLUSTRATION_SHRIMP;

  // 5. Fresh ingredients
  if (name.includes('란') || name.includes('달걀') || name.includes('계란') || subCat.includes('계란')) return ILLUSTRATION_EGG;
  if (name.includes('두부') || subCat.includes('두부')) return ILLUSTRATION_TOFU;

  // Fallbacks by category
  if (cat === '과일') return ILLUSTRATION_PEACH;
  if (cat === '고기·수산') return ILLUSTRATION_BEEF;
  if (cat === '식재료') return ILLUSTRATION_EGG;

  return ILLUSTRATION_PEACH;
};

/**
 * 농수산물인 경우 일러스트를 우선 적용하고, 일반 공산품은 기존 이미지를 사용하는 도우미 함수
 */
export const getEffectiveProductImage = (product?: {
  id?: string;
  name?: string;
  category?: string;
  subCategory?: string;
  itemType?: string;
  image?: string;
}): string => {
  if (!product) return '';

  if (isAgriMarineProduct(product)) {
    // 이미 일러스트 SVG Data URI인 경우 그대로 사용
    if (product.image && product.image.startsWith('data:image/svg+xml')) {
      return product.image;
    }
    // 실제 사진(Unsplash 등)이거나 이미지가 비어있는 경우 일러스트로 교체
    return getProductIllustration(product);
  }

  return product.image || '';
};
