/**
 * 농축수산물 (과일, 채소, 고기, 수산, 신선란 등) 전용 토스(Toss) 스타일 프리미엄 3D 일러스트레이션 모듈
 * 군더더기 없는 미니멀하고 화사한 3D 볼륨감과 부드러운 파스텔 톤온톤 배경을 제공합니다.
 */

// Helper to encode SVG string safely for data URI
export const svgToDataUri = (svgString: string): string => {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString.trim())}`;
};

// 1. [과일] 토스 스타일 햇사레 복숭아 일러스트
export const SVG_PEACH = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="tpBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF5F6"/>
      <stop offset="100%" stop-color="#FED7E2"/>
    </linearGradient>
    <radialGradient id="tpBody" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FFE4E6"/>
      <stop offset="25%" stop-color="#FDA4AF"/>
      <stop offset="65%" stop-color="#FB7185"/>
      <stop offset="90%" stop-color="#F43F5E"/>
      <stop offset="100%" stop-color="#E11D48"/>
    </radialGradient>
    <linearGradient id="tpLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="tpLeaf2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6EE7B7"/>
      <stop offset="100%" stop-color="#10B981"/>
    </linearGradient>
    <filter id="tpShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#E11D48" flood-opacity="0.18"/>
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.04"/>
    </filter>
  </defs>

  <rect width="400" height="400" rx="40" fill="url(#tpBg)"/>
  
  <!-- Ground Soft Ambient Shadow -->
  <ellipse cx="200" cy="340" rx="90" ry="14" fill="#FDA4AF" opacity="0.45"/>
  <ellipse cx="200" cy="340" rx="55" ry="8" fill="#F43F5E" opacity="0.15"/>

  <!-- Peach Main 3D Shape -->
  <g filter="url(#tpShadow)">
    <!-- Right Lobe -->
    <path d="M200 135 C265 110 325 160 325 235 C325 295 265 325 200 320 Z" fill="url(#tpBody)"/>
    <!-- Left Lobe -->
    <path d="M200 135 C135 110 75 160 75 235 C75 295 135 325 200 320 Z" fill="url(#tpBody)"/>
    <!-- Smooth Center Cleft Shade -->
    <path d="M200 135 C198 175 197 240 200 320" stroke="#BE123C" stroke-width="4" stroke-linecap="round" opacity="0.25"/>
    
    <!-- Top-Left 3D Glossy Light Reflection -->
    <ellipse cx="145" cy="180" rx="30" ry="45" transform="rotate(-25 145 180)" fill="#FFFFFF" opacity="0.32"/>
    <ellipse cx="138" cy="165" rx="12" ry="20" transform="rotate(-25 138 165)" fill="#FFFFFF" opacity="0.5"/>
    
    <!-- Bottom Ambient Warm Rim Reflection -->
    <path d="M140 300 Q200 322 260 300" stroke="#FFF1F2" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.5"/>
  </g>

  <!-- Stem -->
  <path d="M200 140 C200 115 206 95 214 85" stroke="#78350F" stroke-width="7" stroke-linecap="round" fill="none"/>

  <!-- 3D Leaves -->
  <g>
    <!-- Right Leaf -->
    <path d="M205 115 C245 85 295 95 310 120 C290 142 245 140 205 115 Z" fill="url(#tpLeaf)"/>
    <path d="M205 115 Q255 115 305 120" stroke="#A7F3D0" stroke-width="2" fill="none" opacity="0.7"/>
    <!-- Left Leaf -->
    <path d="M195 122 C160 95 115 105 100 128 C120 148 160 144 195 122 Z" fill="url(#tpLeaf2)"/>
    <path d="M195 122 Q150 125 105 128" stroke="#D1FAE5" stroke-width="2" fill="none" opacity="0.7"/>
  </g>
</svg>`;

// 2. [과일] 토스 스타일 고창 당도보증 수박 일러스트
export const SVG_WATERMELON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="twmBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F0FDF4"/>
      <stop offset="100%" stop-color="#DCFCE7"/>
    </linearGradient>
    <radialGradient id="twmFlesh" cx="45%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#FF6B81"/>
      <stop offset="40%" stop-color="#FF385C"/>
      <stop offset="85%" stop-color="#E11D48"/>
      <stop offset="100%" stop-color="#BE123C"/>
    </radialGradient>
    <linearGradient id="twmRind" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#15803D"/>
      <stop offset="100%" stop-color="#166534"/>
    </linearGradient>
    <linearGradient id="twmRindInner" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#DCFCE7"/>
      <stop offset="100%" stop-color="#BBF7D0"/>
    </linearGradient>
    <filter id="twmShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#15803D" flood-opacity="0.16"/>
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.04"/>
    </filter>
  </defs>

  <rect width="400" height="400" rx="40" fill="url(#twmBg)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="340" rx="105" ry="15" fill="#86EFAC" opacity="0.45"/>
  <ellipse cx="200" cy="340" rx="60" ry="8" fill="#15803D" opacity="0.15"/>

  <!-- Watermelon Wedge Group -->
  <g filter="url(#twmShadow)">
    <!-- Outer Dark Green Rind Arc -->
    <path d="M70 215 C80 320 320 320 330 215 L200 110 Z" fill="url(#twmRind)"/>
    <!-- Light Lime Inner Rind -->
    <path d="M80 215 C90 308 310 308 320 215 L200 120 Z" fill="url(#twmRindInner)"/>
    <!-- Crisp White Margin -->
    <path d="M88 215 C98 298 302 298 312 215 L200 128 Z" fill="#F8FAFC"/>
    <!-- Sweet Juicy Red Flesh -->
    <path d="M94 215 C104 290 296 290 306 215 L200 134 Z" fill="url(#twmFlesh)"/>

    <!-- Subtle Clean Stripes on Rind Bottom -->
    <path d="M135 285 Q145 300 155 306" stroke="#052e16" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.7"/>
    <path d="M195 296 Q200 308 208 307" stroke="#052e16" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.7"/>
    <path d="M245 285 Q255 300 265 298" stroke="#052e16" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.7"/>

    <!-- Clean 3D Top Highlight Arc -->
    <path d="M125 205 L195 145" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity="0.4"/>

    <!-- Minimal Cute Toss-style Seeds -->
    <g fill="#1E293B">
      <path d="M150 205 C146 199 148 193 153 193 C158 193 160 199 156 205 C155 207 151 207 150 205 Z"/>
      <circle cx="152" cy="196" r="1.2" fill="#FFFFFF" opacity="0.8"/>
      
      <path d="M196 185 C192 179 194 173 199 173 C204 173 206 179 202 185 C201 187 197 187 196 185 Z"/>
      <circle cx="198" cy="176" r="1.2" fill="#FFFFFF" opacity="0.8"/>
      
      <path d="M244 200 C240 194 242 188 247 188 C252 188 254 194 250 200 C249 202 245 202 244 200 Z"/>
      <circle cx="246" cy="191" r="1.2" fill="#FFFFFF" opacity="0.8"/>
      
      <path d="M172 238 C168 232 170 226 175 226 C180 226 182 232 178 238 C177 240 173 240 172 238 Z"/>
      <circle cx="174" cy="229" r="1.2" fill="#FFFFFF" opacity="0.8"/>
      
      <path d="M222 235 C218 229 220 223 225 223 C230 223 232 229 228 235 C227 237 223 237 222 235 Z"/>
      <circle cx="224" cy="226" r="1.2" fill="#FFFFFF" opacity="0.8"/>
    </g>
  </g>
</svg>`;

// 3. [과일] 토스 스타일 청송 꿀사과 부사 일러스트
export const SVG_APPLE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="taBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF2F2"/>
      <stop offset="100%" stop-color="#FEE2E2"/>
    </linearGradient>
    <radialGradient id="taBody" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FF7675"/>
      <stop offset="25%" stop-color="#FF4757"/>
      <stop offset="65%" stop-color="#E11D48"/>
      <stop offset="90%" stop-color="#BE123C"/>
      <stop offset="100%" stop-color="#881337"/>
    </radialGradient>
    <linearGradient id="taLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4ADE80"/>
      <stop offset="100%" stop-color="#16A34A"/>
    </linearGradient>
    <filter id="taShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#E11D48" flood-opacity="0.18"/>
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.04"/>
    </filter>
  </defs>

  <rect width="400" height="400" rx="40" fill="url(#taBg)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="342" rx="90" ry="14" fill="#FECDD3" opacity="0.5"/>
  <ellipse cx="200" cy="342" rx="50" ry="7" fill="#E11D48" opacity="0.15"/>

  <!-- Apple Body Group -->
  <g filter="url(#taShadow)">
    <path d="M200 135 C170 105 95 105 85 190 C75 270 140 330 185 330 C195 330 198 322 200 322 C202 322 205 330 215 330 C260 330 325 270 315 190 C305 105 230 105 200 135 Z" fill="url(#taBody)"/>
    
    <!-- Top Dimple -->
    <ellipse cx="200" cy="138" rx="20" ry="7" fill="#701A75" opacity="0.3"/>
    
    <!-- 3D Soft Glow & Gloss -->
    <ellipse cx="145" cy="180" rx="28" ry="45" transform="rotate(-25 145 180)" fill="#FFFFFF" opacity="0.32"/>
    <ellipse cx="138" cy="165" rx="12" ry="22" transform="rotate(-25 138 165)" fill="#FFFFFF" opacity="0.55"/>
    <circle cx="155" cy="240" r="4" fill="#FFFFFF" opacity="0.3"/>
  </g>

  <!-- Cute Stem -->
  <path d="M200 138 C202 100 218 75 235 65" stroke="#78350F" stroke-width="7" stroke-linecap="round" fill="none"/>

  <!-- 3D Leaf -->
  <g>
    <path d="M208 100 C245 75 290 85 300 108 C280 128 235 128 208 100 Z" fill="url(#taLeaf)"/>
    <path d="M208 100 Q255 102 295 108" stroke="#DCFCE7" stroke-width="2" fill="none" opacity="0.8"/>
  </g>
</svg>`;

// 4. [과일] 토스 스타일 논산 설향 고당도 생딸기 일러스트
export const SVG_STRAWBERRY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="tsbBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF1F2"/>
      <stop offset="100%" stop-color="#FFE4E6"/>
    </linearGradient>
    <radialGradient id="tsbBody" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FF6584"/>
      <stop offset="30%" stop-color="#FF3366"/>
      <stop offset="75%" stop-color="#E11D48"/>
      <stop offset="100%" stop-color="#9F1239"/>
    </radialGradient>
    <linearGradient id="tsbLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4ADE80"/>
      <stop offset="100%" stop-color="#15803D"/>
    </linearGradient>
    <filter id="tsbShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#E11D48" flood-opacity="0.18"/>
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.04"/>
    </filter>
  </defs>

  <rect width="400" height="400" rx="40" fill="url(#tsbBg)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="342" rx="80" ry="14" fill="#FDA4AF" opacity="0.45"/>
  <ellipse cx="200" cy="342" rx="45" ry="7" fill="#E11D48" opacity="0.15"/>

  <!-- Strawberry Body Group -->
  <g filter="url(#tsbShadow)">
    <path d="M200 130 C270 130 310 180 295 245 C280 305 225 335 200 335 C175 335 120 305 105 245 C90 180 130 130 200 130 Z" fill="url(#tsbBody)"/>

    <!-- 3D Soft Highlights -->
    <ellipse cx="150" cy="180" rx="24" ry="38" transform="rotate(-20 150 180)" fill="#FFFFFF" opacity="0.32"/>
    <ellipse cx="144" cy="168" rx="10" ry="18" transform="rotate(-20 144 168)" fill="#FFFFFF" opacity="0.5"/>

    <!-- Cute Seed Pits -->
    <g fill="#FEF08A">
      <ellipse cx="160" cy="195" rx="3" ry="5" transform="rotate(-15 160 195)"/>
      <ellipse cx="200" cy="185" rx="3" ry="5"/>
      <ellipse cx="240" cy="195" rx="3" ry="5" transform="rotate(15 240 195)"/>
      <ellipse cx="140" cy="235" rx="3" ry="5" transform="rotate(-18 140 235)"/>
      <ellipse cx="175" cy="230" rx="3" ry="5" transform="rotate(-8 175 230)"/>
      <ellipse cx="225" cy="230" rx="3" ry="5" transform="rotate(8 225 230)"/>
      <ellipse cx="260" cy="235" rx="3" ry="5" transform="rotate(18 260 235)"/>
      <ellipse cx="160" cy="275" rx="3" ry="5" transform="rotate(-10 160 275)"/>
      <ellipse cx="200" cy="270" rx="3" ry="5"/>
      <ellipse cx="240" cy="275" rx="3" ry="5" transform="rotate(10 240 275)"/>
      <ellipse cx="185" cy="305" rx="2.5" ry="4" transform="rotate(-5 185 305)"/>
      <ellipse cx="215" cy="305" rx="2.5" ry="4" transform="rotate(5 215 305)"/>
    </g>
  </g>

  <!-- Green Calyx Leaves -->
  <g>
    <path d="M200 130 C200 100 204 80 208 75" stroke="#15803D" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M200 135 L165 95 C175 118 185 128 200 135 Z" fill="url(#tsbLeaf)"/>
    <path d="M200 135 L135 125 C155 135 175 138 200 135 Z" fill="url(#tsbLeaf)"/>
    <path d="M200 135 L235 95 C225 118 215 128 200 135 Z" fill="url(#tsbLeaf)"/>
    <path d="M200 135 L265 125 C245 135 225 138 200 135 Z" fill="url(#tsbLeaf)"/>
    <path d="M200 135 L200 150 C195 142 205 142 200 135 Z" fill="#15803D"/>
  </g>
</svg>`;

// 5. [과일] 토스 스타일 서귀포 타이벡 감귤 일러스트
export const SVG_CITRUS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="tciBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF7ED"/>
      <stop offset="100%" stop-color="#FFEDD5"/>
    </linearGradient>
    <radialGradient id="tciBody" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FED7AA"/>
      <stop offset="25%" stop-color="#FB923C"/>
      <stop offset="70%" stop-color="#F97316"/>
      <stop offset="95%" stop-color="#EA580C"/>
      <stop offset="100%" stop-color="#C2410C"/>
    </radialGradient>
    <linearGradient id="tciLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4ADE80"/>
      <stop offset="100%" stop-color="#15803D"/>
    </linearGradient>
    <filter id="tciShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#EA580C" flood-opacity="0.18"/>
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.04"/>
    </filter>
  </defs>

  <rect width="400" height="400" rx="40" fill="url(#tciBg)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="340" rx="95" ry="14" fill="#FDBA74" opacity="0.45"/>
  <ellipse cx="200" cy="340" rx="55" ry="7" fill="#EA580C" opacity="0.15"/>

  <!-- Tangerine Main Body -->
  <g filter="url(#tciShadow)">
    <ellipse cx="200" cy="225" rx="125" ry="105" fill="url(#tciBody)"/>

    <!-- 3D Soft Highlights -->
    <ellipse cx="150" cy="180" rx="35" ry="22" transform="rotate(-18 150 180)" fill="#FFFFFF" opacity="0.35"/>
    <ellipse cx="142" cy="172" rx="15" ry="9" transform="rotate(-18 142 172)" fill="#FFFFFF" opacity="0.55"/>

    <!-- Gentle Bottom Rim Bounce Light -->
    <path d="M130 290 Q200 325 270 290" stroke="#FFEDD5" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.4"/>
  </g>

  <!-- Green Stem & Leaf -->
  <g>
    <ellipse cx="200" cy="122" rx="8" ry="5" fill="#15803D"/>
    <path d="M200 122 C200 105 204 95 208 90" stroke="#166534" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M204 115 C240 88 285 98 295 120 C275 138 235 138 204 115 Z" fill="url(#tciLeaf)"/>
    <path d="M204 115 Q250 115 290 120" stroke="#DCFCE7" stroke-width="2" fill="none" opacity="0.75"/>
  </g>
</svg>`;

// 6. [고기] 토스 스타일 횡성한우 1++ 꽃등심 스테이크 일러스트
export const SVG_BEEF = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="tbfBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF1F2"/>
      <stop offset="100%" stop-color="#FFE4E6"/>
    </linearGradient>
    <radialGradient id="tbfMeat" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#F43F5E"/>
      <stop offset="40%" stop-color="#E11D48"/>
      <stop offset="80%" stop-color="#BE123C"/>
      <stop offset="100%" stop-color="#881337"/>
    </radialGradient>
    <linearGradient id="tbfFat" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#FFFBEB"/>
    </linearGradient>
    <filter id="tbfShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#BE123C" flood-opacity="0.18"/>
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.04"/>
    </filter>
  </defs>

  <rect width="400" height="400" rx="40" fill="url(#tbfBg)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="340" rx="105" ry="15" fill="#FECDD3" opacity="0.45"/>
  <ellipse cx="200" cy="340" rx="60" ry="8" fill="#BE123C" opacity="0.15"/>

  <!-- Beef Steak Block Group -->
  <g filter="url(#tbfShadow)">
    <path d="M85 180 C85 125 180 110 245 115 C310 120 335 165 330 225 C325 285 240 315 170 310 C105 305 85 245 85 180 Z" fill="url(#tbfFat)"/>
    <path d="M95 183 C95 135 180 122 240 127 C295 132 320 172 315 222 C310 275 235 300 175 295 C115 290 95 240 95 183 Z" fill="url(#tbfMeat)"/>

    <!-- Snowflake Marbling Lines -->
    <g stroke="#FFFBEB" stroke-linecap="round" opacity="0.85" fill="none">
      <path d="M130 170 Q145 180 160 175 M145 180 Q155 195 170 190" stroke-width="3.5"/>
      <path d="M190 155 Q215 175 240 160 M215 175 Q230 200 255 190" stroke-width="4"/>
      <path d="M145 225 Q170 240 200 230 M170 240 Q190 260 215 255" stroke-width="3.5"/>
      <path d="M225 215 Q245 230 270 220" stroke-width="3"/>
      <path d="M255 150 Q275 170 295 165" stroke-width="3"/>
    </g>

    <ellipse cx="150" cy="155" rx="30" ry="12" transform="rotate(-15 150 155)" fill="#FFFFFF" opacity="0.35"/>
  </g>

  <!-- Rosemary Sprig Accent -->
  <g>
    <path d="M85 295 Q140 280 195 305" stroke="#166534" stroke-width="4" stroke-linecap="round" fill="none"/>
    <path d="M115 290 L110 275 M135 285 L130 268 M155 285 L155 268 M175 292 L180 275" stroke="#22C55E" stroke-width="3" stroke-linecap="round"/>
    <path d="M120 292 L118 305 M140 290 L142 305 M160 292 L165 306" stroke="#15803D" stroke-width="3" stroke-linecap="round"/>
  </g>
</svg>`;

// 7. [고기] 토스 스타일 제주 흑돼지 칼집 오겹살·삼겹살 일러스트
export const SVG_PORK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="tpkBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF1F2"/>
      <stop offset="100%" stop-color="#FFE4E6"/>
    </linearGradient>
    <linearGradient id="tpkLean" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB7185"/>
      <stop offset="60%" stop-color="#F43F5E"/>
      <stop offset="100%" stop-color="#E11D48"/>
    </linearGradient>
    <linearGradient id="tpkFat" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#FFF5F5"/>
    </linearGradient>
    <filter id="tpkShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#F43F5E" flood-opacity="0.16"/>
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.04"/>
    </filter>
  </defs>

  <rect width="400" height="400" rx="40" fill="url(#tpkBg)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="340" rx="105" ry="14" fill="#FDA4AF" opacity="0.45"/>
  <ellipse cx="200" cy="340" rx="60" ry="7" fill="#F43F5E" opacity="0.15"/>

  <!-- Pork Slices Group -->
  <g filter="url(#tpkShadow)">
    <g transform="rotate(-6 200 170)">
      <rect x="75" y="135" width="250" height="60" rx="18" fill="url(#tpkLean)"/>
      <path d="M75 150 Q200 144 325 150 L325 135 Q200 130 75 135 Z" fill="url(#tpkFat)"/>
      <path d="M75 174 Q200 168 325 174 L325 162 Q200 158 75 162 Z" fill="url(#tpkFat)"/>
      <g stroke="#BE123C" stroke-width="2" stroke-linecap="round" opacity="0.4">
        <line x1="110" y1="135" x2="125" y2="195"/>
        <line x1="150" y1="135" x2="165" y2="195"/>
        <line x1="190" y1="135" x2="205" y2="195"/>
        <line x1="230" y1="135" x2="245" y2="195"/>
        <line x1="270" y1="135" x2="285" y2="195"/>
      </g>
    </g>

    <g transform="rotate(4 200 235)">
      <rect x="75" y="210" width="250" height="65" rx="18" fill="url(#tpkLean)"/>
      <path d="M75 225 Q200 220 325 225 L325 210 Q200 205 75 210 Z" fill="url(#tpkFat)"/>
      <path d="M75 252 Q200 248 325 252 L325 240 Q200 236 75 240 Z" fill="url(#tpkFat)"/>
      <g stroke="#BE123C" stroke-width="2" stroke-linecap="round" opacity="0.4">
        <line x1="115" y1="210" x2="130" y2="275"/>
        <line x1="155" y1="210" x2="170" y2="275"/>
        <line x1="195" y1="210" x2="210" y2="275"/>
        <line x1="235" y1="210" x2="250" y2="275"/>
        <line x1="275" y1="210" x2="290" y2="275"/>
      </g>
      <ellipse cx="140" cy="220" rx="35" ry="6" fill="#FFFFFF" opacity="0.45"/>
    </g>
  </g>

  <!-- Clean Garlic Garnish -->
  <g>
    <ellipse cx="95" cy="305" rx="12" ry="8" fill="#FFFBEB" stroke="#FDE68A" stroke-width="1.5"/>
    <ellipse cx="120" cy="312" rx="10" ry="7" fill="#FFFBEB" stroke="#FDE68A" stroke-width="1.5"/>
  </g>
</svg>`;

// 8. [고기] 토스 스타일 무항생제 신선 닭볶음탕용 생닭·닭다리 일러스트
export const SVG_CHICKEN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="tckBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB"/>
      <stop offset="100%" stop-color="#FEF3C7"/>
    </linearGradient>
    <radialGradient id="tckMeat" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FED7AA"/>
      <stop offset="35%" stop-color="#FB923C"/>
      <stop offset="75%" stop-color="#F97316"/>
      <stop offset="100%" stop-color="#EA580C"/>
    </radialGradient>
    <linearGradient id="tckBone" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F1F5F9"/>
    </linearGradient>
    <filter id="tckShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#F59E0B" flood-opacity="0.18"/>
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.04"/>
    </filter>
  </defs>

  <rect width="400" height="400" rx="40" fill="url(#tckBg)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="340" rx="95" ry="14" fill="#FDE68A" opacity="0.5"/>
  <ellipse cx="200" cy="340" rx="55" ry="7" fill="#F59E0B" opacity="0.15"/>

  <!-- Drumsticks Group -->
  <g filter="url(#tckShadow)">
    <g transform="rotate(25 240 180)">
      <rect x="245" y="165" width="45" height="18" rx="5" fill="url(#tckBone)"/>
      <circle cx="290" cy="168" r="9" fill="url(#tckBone)"/>
      <circle cx="290" cy="180" r="9" fill="url(#tckBone)"/>
      <ellipse cx="185" cy="174" rx="75" ry="50" fill="url(#tckMeat)"/>
    </g>

    <g transform="rotate(-18 170 230)">
      <rect x="235" y="215" width="50" height="20" rx="5" fill="url(#tckBone)"/>
      <circle cx="285" cy="217" r="10" fill="url(#tckBone)"/>
      <circle cx="285" cy="233" r="10" fill="url(#tckBone)"/>
      <ellipse cx="165" cy="225" rx="85" ry="58" fill="url(#tckMeat)"/>
      <ellipse cx="140" cy="205" rx="35" ry="18" transform="rotate(-10 140 205)" fill="#FFFFFF" opacity="0.45"/>
      <ellipse cx="132" cy="198" rx="15" ry="8" transform="rotate(-10 132 198)" fill="#FFFFFF" opacity="0.6"/>
    </g>
  </g>

  <!-- Clean Herb Leaf Point -->
  <g>
    <path d="M95 295 C85 275 105 260 120 270 C130 280 115 300 95 295 Z" fill="#22C55E"/>
    <path d="M80 308 C70 290 90 275 105 285 C115 295 100 312 80 308 Z" fill="#16A34A"/>
  </g>
</svg>`;

// 9. [수산] 토스 스타일 노르웨이 슈프림 생연어회 일러스트
export const SVG_SALMON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="tsmBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F0F9FF"/>
      <stop offset="100%" stop-color="#E0F2FE"/>
    </linearGradient>
    <linearGradient id="tsmFlesh" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB923C"/>
      <stop offset="50%" stop-color="#F97316"/>
      <stop offset="100%" stop-color="#EA580C"/>
    </linearGradient>
    <linearGradient id="tsmLemon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="100%" stop-color="#EAB308"/>
    </linearGradient>
    <filter id="tsmShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#0284C7" flood-opacity="0.16"/>
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.04"/>
    </filter>
  </defs>

  <rect width="400" height="400" rx="40" fill="url(#tsmBg)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="340" rx="105" ry="14" fill="#BAE6FD" opacity="0.45"/>
  <ellipse cx="200" cy="340" rx="60" ry="7" fill="#0284C7" opacity="0.15"/>

  <!-- Salmon Slabs Group -->
  <g filter="url(#tsmShadow)">
    <g transform="rotate(-6 195 165)">
      <path d="M75 145 C115 130 280 130 320 150 C325 180 300 200 260 205 C180 210 85 195 75 165 Z" fill="url(#tsmFlesh)"/>
      <g stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.85" fill="none">
        <path d="M100 150 Q118 165 115 185"/>
        <path d="M140 142 Q158 165 155 195"/>
        <path d="M180 140 Q198 165 195 200"/>
        <path d="M220 140 Q238 165 235 200"/>
        <path d="M260 142 Q278 165 275 195"/>
      </g>
    </g>

    <g transform="rotate(4 200 230)">
      <path d="M75 210 C120 190 285 190 325 215 C330 250 300 275 260 280 C180 285 85 270 75 235 Z" fill="url(#tsmFlesh)"/>
      <g stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" opacity="0.9" fill="none">
        <path d="M105 215 Q122 235 120 260"/>
        <path d="M145 205 Q165 235 160 270"/>
        <path d="M185 200 Q208 235 200 275"/>
        <path d="M230 200 Q250 235 245 275"/>
        <path d="M270 205 Q290 235 285 270"/>
      </g>
      <ellipse cx="140" cy="225" rx="35" ry="10" fill="#FFFFFF" opacity="0.45"/>
    </g>
  </g>

  <!-- Clean Lemon Wedge Accent -->
  <g transform="translate(65, 265) rotate(-15)">
    <path d="M0 36 A36 36 0 0 1 72 36 Z" fill="url(#tsmLemon)"/>
    <path d="M6 34 A30 30 0 0 1 66 34 Z" fill="#FFFBEB"/>
    <line x1="36" y1="34" x2="36" y2="8" stroke="url(#tsmLemon)" stroke-width="2"/>
    <line x1="36" y1="34" x2="18" y2="15" stroke="url(#tsmLemon)" stroke-width="2"/>
    <line x1="36" y1="34" x2="54" y2="15" stroke="url(#tsmLemon)" stroke-width="2"/>
  </g>
</svg>`;

// 10. [수산] 토스 스타일 서해안 활 흰다리새우 / 왕대하 일러스트
export const SVG_SHRIMP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="tshBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ECFEFF"/>
      <stop offset="100%" stop-color="#CFFAFE"/>
    </linearGradient>
    <radialGradient id="tshShell" cx="40%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FDA4AF"/>
      <stop offset="35%" stop-color="#FB7185"/>
      <stop offset="75%" stop-color="#F43F5E"/>
      <stop offset="100%" stop-color="#E11D48"/>
    </radialGradient>
    <filter id="tshShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#0891B2" flood-opacity="0.16"/>
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.04"/>
    </filter>
  </defs>

  <rect width="400" height="400" rx="40" fill="url(#tshBg)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="340" rx="95" ry="14" fill="#A5F3FC" opacity="0.45"/>
  <ellipse cx="200" cy="340" rx="55" ry="7" fill="#0891B2" opacity="0.15"/>

  <!-- Curled 3D Shrimp Body Group -->
  <g filter="url(#tshShadow)">
    <path d="M125 180 C105 135 155 90 220 95 C255 98 280 125 275 160 C270 190 230 200 190 190 Z" fill="url(#tshShell)"/>
    <path d="M215 115 C265 120 295 155 290 195 C285 220 260 230 235 220 C225 185 220 150 215 115 Z" fill="url(#tshShell)"/>
    <path d="M245 180 C290 200 300 240 280 270 C260 290 230 285 215 260 C225 235 235 205 245 180 Z" fill="url(#tshShell)"/>
    <path d="M245 250 C265 275 250 305 220 315 C195 320 180 305 185 285 C205 275 225 265 245 250 Z" fill="url(#tshShell)"/>
    
    <path d="M195 300 C175 325 140 325 125 305 C145 298 165 300 195 300 Z" fill="#E11D48"/>
    <path d="M185 305 C155 335 120 330 110 312 C130 305 155 305 185 305 Z" fill="#BE123C"/>

    <g stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" opacity="0.65" fill="none">
      <path d="M230 108 Q248 140 240 175"/>
      <path d="M265 145 Q278 180 260 210"/>
      <path d="M272 210 Q280 240 252 265"/>
    </g>

    <ellipse cx="190" cy="125" rx="30" ry="14" transform="rotate(-15 190 125)" fill="#FFFFFF" opacity="0.4"/>

    <circle cx="160" cy="125" r="5" fill="#1E293B"/>
    <circle cx="158" cy="123" r="1.5" fill="#FFFFFF"/>

    <path d="M150 120 C100 80 50 120 40 170" stroke="#F43F5E" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  </g>
</svg>`;

// 11. [식재료] 토스 스타일 동물복지 유정란 자연방사란 일러스트
export const SVG_EGG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="tegBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEFCE8"/>
      <stop offset="100%" stop-color="#FEF08A"/>
    </linearGradient>
    <radialGradient id="tegShell" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FFFBEB"/>
      <stop offset="35%" stop-color="#FDE68A"/>
      <stop offset="75%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#D97706"/>
    </radialGradient>
    <radialGradient id="tegYolk" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#FEF08A"/>
      <stop offset="35%" stop-color="#FBBF24"/>
      <stop offset="80%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#D97706"/>
    </radialGradient>
    <filter id="tegShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#CA8A04" flood-opacity="0.18"/>
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.04"/>
    </filter>
  </defs>

  <rect width="400" height="400" rx="40" fill="url(#tegBg)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="342" rx="100" ry="14" fill="#FDE047" opacity="0.45"/>
  <ellipse cx="200" cy="342" rx="60" ry="7" fill="#CA8A04" opacity="0.15"/>

  <!-- Eggs Group -->
  <g filter="url(#tegShadow)">
    <g transform="rotate(12 250 170)">
      <path d="M250 105 C280 105 305 145 305 195 C305 245 280 270 250 270 C220 270 195 245 195 195 C195 145 220 105 250 105 Z" fill="url(#tegShell)"/>
      <ellipse cx="232" cy="150" rx="14" ry="24" transform="rotate(-15 232 150)" fill="#FFFFFF" opacity="0.45"/>
    </g>

    <path d="M85 280 C75 250 125 225 175 230 C235 235 265 270 255 300 C245 330 165 340 115 330 C85 320 90 295 85 280 Z" fill="#FFFFFF"/>
    <path d="M95 285 C90 265 130 245 170 250 C220 255 245 280 235 305 C225 325 165 330 125 320 C100 315 100 295 95 285 Z" fill="#FEFCE8" opacity="0.7"/>

    <circle cx="165" cy="285" r="42" fill="url(#tegYolk)"/>
    <ellipse cx="150" cy="270" rx="14" ry="9" transform="rotate(-20 150 270)" fill="#FFFFFF" opacity="0.8"/>
    <circle cx="147" cy="268" r="3" fill="#FFFFFF"/>
  </g>
</svg>`;

// 12. [식재료] 토스 스타일 풀무원 국산콩 부침두부 일러스트
export const SVG_TOFU = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="ttfBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#F1F5F9"/>
    </linearGradient>
    <linearGradient id="ttfTop" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F8FAFC"/>
    </linearGradient>
    <linearGradient id="ttfFront" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F1F5F9"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <linearGradient id="ttfSide" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E2E8F0"/>
      <stop offset="100%" stop-color="#CBD5E1"/>
    </linearGradient>
    <linearGradient id="ttfEdamame" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#84CC16"/>
      <stop offset="100%" stop-color="#4D7C0F"/>
    </linearGradient>
    <filter id="ttfShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#475569" flood-opacity="0.12"/>
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.04"/>
    </filter>
  </defs>

  <rect width="400" height="400" rx="40" fill="url(#ttfBg)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="340" rx="100" ry="14" fill="#CBD5E1" opacity="0.45"/>
  <ellipse cx="200" cy="340" rx="60" ry="7" fill="#64748B" opacity="0.15"/>

  <!-- 3D Soft Cube Tofu Group -->
  <g filter="url(#ttfShadow)">
    <path d="M100 215 L240 270 L240 315 L100 260 Z" fill="url(#ttfFront)"/>
    <path d="M240 270 L320 220 L320 265 L240 315 Z" fill="url(#ttfSide)"/>
    <path d="M100 215 L180 165 L320 220 L240 270 Z" fill="url(#ttfTop)"/>

    <g stroke="#E2E8F0" stroke-width="1.5" opacity="0.7">
      <line x1="140" y1="200" x2="280" y2="255"/>
      <line x1="175" y1="190" x2="215" y2="242"/>
      <line x1="245" y1="180" x2="285" y2="232"/>
    </g>
  </g>

  <!-- Fresh Edamame Herb Accent -->
  <g transform="translate(65, 235) rotate(-15)">
    <path d="M20 40 C50 15 100 20 130 45 C100 50 50 55 20 40 Z" fill="url(#ttfEdamame)"/>
    <circle cx="55" cy="34" r="10" fill="#BEF264" opacity="0.6"/>
    <circle cx="85" cy="35" r="10" fill="#BEF264" opacity="0.6"/>
    <circle cx="110" cy="40" r="8" fill="#BEF264" opacity="0.6"/>
  </g>
</svg>`;

// 13. [과일] 토스 스타일 샤인머스캣 / 포도 일러스트
export const SVG_GRAPES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="tgBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F0FDF4"/>
      <stop offset="100%" stop-color="#DCFCE7"/>
    </linearGradient>
    <radialGradient id="tgBerry" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#BBF7D0"/>
      <stop offset="35%" stop-color="#4ADE80"/>
      <stop offset="85%" stop-color="#16A34A"/>
      <stop offset="100%" stop-color="#15803D"/>
    </radialGradient>
    <linearGradient id="tgLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22C55E"/>
      <stop offset="100%" stop-color="#14532D"/>
    </linearGradient>
    <filter id="tgShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#16A34A" flood-opacity="0.18"/>
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.04"/>
    </filter>
  </defs>

  <rect width="400" height="400" rx="40" fill="url(#tgBg)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="340" rx="80" ry="14" fill="#86EFAC" opacity="0.45"/>

  <!-- Grape Cluster Group -->
  <g filter="url(#tgShadow)">
    <circle cx="160" cy="180" r="32" fill="url(#tgBerry)"/>
    <circle cx="215" cy="175" r="32" fill="url(#tgBerry)"/>
    <circle cx="245" cy="195" r="30" fill="url(#tgBerry)"/>
    
    <circle cx="140" cy="225" r="30" fill="url(#tgBerry)"/>
    <circle cx="190" cy="225" r="34" fill="url(#tgBerry)"/>
    <circle cx="240" cy="240" r="30" fill="url(#tgBerry)"/>
    
    <circle cx="165" cy="275" r="28" fill="url(#tgBerry)"/>
    <circle cx="210" cy="280" r="28" fill="url(#tgBerry)"/>
    
    <circle cx="188" cy="315" r="24" fill="url(#tgBerry)"/>

    <ellipse cx="180" cy="215" rx="10" ry="16" transform="rotate(-20 180 215)" fill="#FFFFFF" opacity="0.5"/>
    <ellipse cx="150" cy="170" rx="8" ry="14" transform="rotate(-20 150 170)" fill="#FFFFFF" opacity="0.5"/>
    <ellipse cx="205" cy="165" rx="8" ry="14" transform="rotate(-20 205 165)" fill="#FFFFFF" opacity="0.5"/>
  </g>

  <!-- Stem & Vine Leaf -->
  <g>
    <path d="M195 155 C195 115 210 90 225 75" stroke="#78350F" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M190 145 C155 115 130 135 115 155 C135 170 170 165 190 145 Z" fill="url(#tgLeaf)"/>
  </g>
</svg>`;

// 14. [과일] 토스 스타일 꿀바나나 일러스트
export const SVG_BANANA = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="tbnBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEFCE8"/>
      <stop offset="100%" stop-color="#FEF08A"/>
    </linearGradient>
    <linearGradient id="tbnBody" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A"/>
      <stop offset="35%" stop-color="#FDE047"/>
      <stop offset="80%" stop-color="#EAB308"/>
      <stop offset="100%" stop-color="#CA8A04"/>
    </linearGradient>
    <filter id="tbnShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#CA8A04" flood-opacity="0.18"/>
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.04"/>
    </filter>
  </defs>

  <rect width="400" height="400" rx="40" fill="url(#tbnBg)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="340" rx="90" ry="14" fill="#FDE047" opacity="0.45"/>

  <!-- Curved 3D Banana -->
  <g filter="url(#tbnShadow)">
    <path d="M100 145 C120 255 245 320 310 245 C320 230 315 210 295 215 C240 235 155 210 135 130 Z" fill="url(#tbnBody)"/>
    <path d="M100 145 L85 135 L92 125 L110 135 Z" fill="#65A30D"/>
    <path d="M310 245 L320 250 L318 258 L308 252 Z" fill="#78350F"/>
    <path d="M125 155 C145 235 235 270 290 230" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.5"/>
  </g>
</svg>`;

// 15. [식재료/채소] 토스 스타일 신선 채소 일러스트
export const SVG_VEGETABLE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="tvgBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F0FDF4"/>
      <stop offset="100%" stop-color="#DCFCE7"/>
    </linearGradient>
    <radialGradient id="tvgCarrot" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FDBA74"/>
      <stop offset="35%" stop-color="#FB923C"/>
      <stop offset="80%" stop-color="#EA580C"/>
      <stop offset="100%" stop-color="#C2410C"/>
    </radialGradient>
    <linearGradient id="tvgGreen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4ADE80"/>
      <stop offset="100%" stop-color="#15803D"/>
    </linearGradient>
    <filter id="tvgShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#EA580C" flood-opacity="0.16"/>
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.04"/>
    </filter>
  </defs>

  <rect width="400" height="400" rx="40" fill="url(#tvgBg)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="340" rx="90" ry="14" fill="#86EFAC" opacity="0.45"/>

  <!-- Plump 3D Carrot Group -->
  <g transform="rotate(-25 200 220)" filter="url(#tvgShadow)">
    <path d="M170 120 C230 120 240 145 220 220 C205 285 195 320 185 325 C175 320 165 285 150 220 C130 145 140 120 170 120 Z" fill="url(#tvgCarrot)"/>
    <ellipse cx="170" cy="170" rx="14" ry="40" fill="#FFFFFF" opacity="0.4"/>
    <path d="M155 180 Q175 185 190 180" stroke="#C2410C" stroke-width="2.5" stroke-linecap="round" opacity="0.3"/>
    <path d="M165 230 Q180 235 195 230" stroke="#C2410C" stroke-width="2.5" stroke-linecap="round" opacity="0.3"/>
    
    <!-- Carrot Greens -->
    <path d="M185 120 C185 60 150 40 135 30 C155 60 175 80 180 120 Z" fill="url(#tvgGreen)"/>
    <path d="M185 120 C190 50 215 35 230 25 C215 55 200 80 185 120 Z" fill="url(#tvgGreen)"/>
    <path d="M185 120 C195 70 185 45 185 20 C180 55 180 80 185 120 Z" fill="#22C55E"/>
  </g>
</svg>`;

// 16. [과일 배너] 토스 스타일 산지직송 제철 과일 랭킹 와이드 배너 (800x400)
export const SVG_FRUIT_BANNER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="100%" height="100%">
  <defs>
    <linearGradient id="tbanBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="35%" stop-color="#EFF6FF"/>
      <stop offset="70%" stop-color="#FDF2F8"/>
      <stop offset="100%" stop-color="#F0FDF4"/>
    </linearGradient>

    <radialGradient id="tbanGlow" cx="70%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFE4E6" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#EFF6FF" stop-opacity="0"/>
    </radialGradient>

    <radialGradient id="tbPeach" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FFE4E6"/>
      <stop offset="35%" stop-color="#FDA4AF"/>
      <stop offset="75%" stop-color="#FB7185"/>
      <stop offset="100%" stop-color="#F43F5E"/>
    </radialGradient>

    <radialGradient id="tbWatermelon" cx="45%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#FF6B81"/>
      <stop offset="45%" stop-color="#FF385C"/>
      <stop offset="100%" stop-color="#E11D48"/>
    </radialGradient>

    <radialGradient id="tbCitrus" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FED7AA"/>
      <stop offset="45%" stop-color="#FB923C"/>
      <stop offset="100%" stop-color="#EA580C"/>
    </radialGradient>

    <radialGradient id="tbBerry" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#BBF7D0"/>
      <stop offset="45%" stop-color="#4ADE80"/>
      <stop offset="100%" stop-color="#16A34A"/>
    </radialGradient>

    <filter id="tbShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#0F172A" flood-opacity="0.12"/>
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.04"/>
    </filter>
  </defs>

  <rect width="800" height="400" rx="32" fill="url(#tbanBg)"/>
  <circle cx="600" cy="200" r="230" fill="url(#tbanGlow)"/>

  <!-- Left Side: Clean Pastel Decorative Circles -->
  <circle cx="100" cy="80" r="140" fill="#E0E7FF" opacity="0.3"/>
  <circle cx="280" cy="320" r="90" fill="#DCFCE7" opacity="0.35"/>

  <!-- Right Floating 3D Fruits Composition -->
  <!-- 1. Watermelon Slice (Center-Right) -->
  <g transform="translate(480, 110) rotate(-10)" filter="url(#tbShadow)">
    <path d="M0 160 C10 255 215 255 225 160 L112 60 Z" fill="#15803D"/>
    <path d="M10 160 C18 245 208 245 215 160 L112 70 Z" fill="#DCFCE7"/>
    <path d="M18 160 C26 235 200 235 207 160 L112 80 Z" fill="#F8FAFC"/>
    <path d="M24 160 C32 228 194 228 201 160 L112 86 Z" fill="url(#tbWatermelon)"/>
    <circle cx="75" cy="148" r="3" fill="#1E293B"/>
    <circle cx="112" cy="130" r="3" fill="#1E293B"/>
    <circle cx="150" cy="148" r="3" fill="#1E293B"/>
    <circle cx="112" cy="172" r="3" fill="#1E293B"/>
    <path d="M50 150 L112 95" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.4"/>
  </g>

  <!-- 2. Sweet Toss Peach (Foreground Left) -->
  <g transform="translate(360, 150) rotate(8)" filter="url(#tbShadow)">
    <circle cx="70" cy="100" r="68" fill="url(#tbPeach)"/>
    <path d="M70 34 C35 55 18 95 28 135 C38 168 78 172 70 172 C62 172 102 168 112 135 C122 95 105 55 70 34 Z" fill="url(#tbPeach)"/>
    <path d="M70 38 C90 15 120 22 130 38 C115 52 90 48 70 38 Z" fill="#10B981"/>
    <ellipse cx="45" cy="80" rx="14" ry="24" transform="rotate(-20 45 80)" fill="#FFFFFF" opacity="0.4"/>
  </g>

  <!-- 3. Fresh Tangerine (Front-Right Accent) -->
  <g transform="translate(640, 200) rotate(-6)" filter="url(#tbShadow)">
    <ellipse cx="50" cy="50" rx="46" ry="40" fill="url(#tbCitrus)"/>
    <circle cx="50" cy="14" r="5" fill="#15803D"/>
    <ellipse cx="35" cy="38" rx="14" ry="9" transform="rotate(-15 35 38)" fill="#FFFFFF" opacity="0.45"/>
  </g>

  <!-- 4. Shine Muscat Grape Berries (Floating Top) -->
  <g transform="translate(620, 75)" filter="url(#tbShadow)">
    <circle cx="30" cy="30" r="26" fill="url(#tbBerry)"/>
    <circle cx="65" cy="45" r="24" fill="url(#tbBerry)"/>
    <ellipse cx="25" cy="24" rx="7" ry="12" transform="rotate(-20 25 24)" fill="#FFFFFF" opacity="0.5"/>
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
export const ILLUSTRATION_GRAPES = svgToDataUri(SVG_GRAPES);
export const ILLUSTRATION_BANANA = svgToDataUri(SVG_BANANA);
export const ILLUSTRATION_VEGETABLE = svgToDataUri(SVG_VEGETABLE);
export const ILLUSTRATION_FRUIT_BANNER = svgToDataUri(SVG_FRUIT_BANNER);

// Product ID to Illustration Mapping for instant 1:1 matching
export const PRODUCT_ID_ILLUSTRATIONS: Record<string, string> = {
  'fruit-01': ILLUSTRATION_PEACH,
  'fruit-02': ILLUSTRATION_WATERMELON,
  'fruit-03': ILLUSTRATION_APPLE,
  'fruit-04': ILLUSTRATION_STRAWBERRY,
  'fruit-05': ILLUSTRATION_CITRUS,
  'fruit-06': ILLUSTRATION_GRAPES,
  'fruit-07': ILLUSTRATION_BANANA,
  'meat-01': ILLUSTRATION_BEEF,
  'meat-02': ILLUSTRATION_PORK,
  'meat-03': ILLUSTRATION_CHICKEN,
  'seafood-01': ILLUSTRATION_SALMON,
  'seafood-shrimp-01': ILLUSTRATION_SHRIMP,
  'seafood-shrimp-02': ILLUSTRATION_SHRIMP,
  'ing-01': ILLUSTRATION_EGG,
  'ing-02': ILLUSTRATION_TOFU,
  'veg-01': ILLUSTRATION_VEGETABLE,
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
    '복숭아', '수박', '사과', '딸기', '귤', '감귤', '포도', '샤인머스캣', '바나나', '참외', '배',
    '소고기', '한우', '돼지고기', '삼겹살', '닭고기', '치킨', '연어', '광어', '오징어', '새우', '대하', '전복',
    '계란', '달걀', '두부', '채소', '야채', '당근', '생선', '수산물', '정육'
  ];
  if (product.subCategory && freshSubCats.some(sub => product.subCategory?.includes(sub))) {
    return true;
  }

  // 5. Name keywords check
  const name = (product.name || '').toLowerCase();
  const agriMarineKeywords = [
    '복숭아', '수박', '사과', '딸기', '감귤', '타이벡', '샤인머스캣', '포도', '바나나', '한우', '꽃등심', '오겹살', '삼겹살',
    '생연어', '연어회', '흰다리새우', '대하', '왕새우', '생닭', '닭볶음탕용', '유정란', '자연방사란',
    '부침두부', '국산콩두부', '제철과일', '산지직송', '활어', '생물', '당근', '양파', '대파'
  ];
  return agriMarineKeywords.some(kw => name.includes(kw));
};

/**
 * 상품에 알맞은 최적의 토스 스타일 3D 일러스트레이션을 반환
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
  if (name.includes('포도') || name.includes('샤인머스캣') || subCat.includes('포도')) return ILLUSTRATION_GRAPES;
  if (name.includes('바나나') || subCat.includes('바나나')) return ILLUSTRATION_BANANA;

  // 3. Meat items
  if (name.includes('소고기') || name.includes('한우') || name.includes('꽃등심') || subCat.includes('소고기')) return ILLUSTRATION_BEEF;
  if (name.includes('돼지') || name.includes('오겹살') || name.includes('삼겹살') || subCat.includes('돼지고기')) return ILLUSTRATION_PORK;
  if (name.includes('닭') || name.includes('치킨') || subCat.includes('닭고기')) return ILLUSTRATION_CHICKEN;

  // 4. Seafood items
  if (name.includes('연어') || subCat.includes('연어')) return ILLUSTRATION_SALMON;
  if (name.includes('새우') || name.includes('대하') || subCat.includes('새우')) return ILLUSTRATION_SHRIMP;

  // 5. Fresh ingredients & vegetables
  if (name.includes('란') || name.includes('달걀') || name.includes('계란') || subCat.includes('계란')) return ILLUSTRATION_EGG;
  if (name.includes('두부') || subCat.includes('두부')) return ILLUSTRATION_TOFU;
  if (name.includes('당근') || name.includes('채소') || name.includes('야채') || subCat.includes('채소')) return ILLUSTRATION_VEGETABLE;

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
