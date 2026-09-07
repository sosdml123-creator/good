/**
 * Official Brand Logo Files - Saved in public/brands/ from official brand sites & media repositories
 */
export const OFFICIAL_BRAND_LOGOS: Record<string, string> = {
  '맥도날드': '/brands/맥도날드.svg',
  '버거킹': '/brands/버거킹.svg',
  '맘스터치': '/brands/맘스터치.svg',
  '롯데리아': '/brands/롯데리아.svg',
  'KFC': '/brands/KFC.svg',
  '스타벅스': '/brands/스타벅스.svg',
  '스타벅스 / 동서식품': '/brands/스타벅스.svg',
  '메가MGC커피': '/brands/메가MGC커피.png',
  '메가커피': '/brands/메가MGC커피.png',
  '빽다방': '/brands/빽다방.png',
  '매머드커피': '/brands/매머드커피.png',
  '매머드': '/brands/매머드커피.png',
  '컴포즈커피': '/brands/컴포즈커피.svg',
  '컴포즈': '/brands/컴포즈커피.svg',
  '이디야커피': '/brands/이디야커피.svg',
  '이디야': '/brands/이디야커피.svg',
  '투썸플레이스': '/brands/투썸플레이스.png',
  '투썸': '/brands/투썸플레이스.png',
  '오리온': '/brands/오리온.svg',
  '농심': '/brands/농심.svg',
  '삼양식품': '/brands/삼양식품.svg',
  '삼양': '/brands/삼양식품.svg',
  '오뚜기': '/brands/오뚜기.png',
  'CJ제일제당': '/brands/CJ제일제당.svg',
  'CJ': '/brands/CJ제일제당.svg',
  '비비고': '/brands/비비고.png',
  'bibigo': '/brands/비비고.png',
  '빙그레': '/brands/빙그레.svg',
  '코카콜라': '/brands/코카콜라.svg',
  '하이트진로': '/brands/하이트진로.png',
  '진로': '/brands/하이트진로.png',
  '매일유업': '/brands/매일유업.png',
  '연세유업': '/brands/연세유업.svg',
  '연세우유': '/brands/연세유업.svg',
  '롯데웰푸드': '/brands/롯데웰푸드.svg',
  '롯데': '/brands/롯데웰푸드.svg',
  '롯데제과': '/brands/롯데웰푸드.svg',
  '해태제과': '/brands/해태제과.svg',
  '해태아이스': '/brands/해태제과.svg',
  '해태': '/brands/해태제과.svg',
  '배스킨라빈스': '/brands/배스킨라빈스.png',
  '배스킨': '/brands/배스킨라빈스.png',
  '베스킨라빈스': '/brands/배스킨라빈스.png',
  'GS25': '/brands/GS25.png',
  'CU': '/brands/CU.png',
  '세븐일레븐': '/brands/세븐일레븐.svg',
  '이마트24': '/brands/이마트24.svg',
  '청도농협': '/brands/청도농협.svg',
  '농협': '/brands/농협.svg',
  '노브랜드': '/brands/노브랜드.svg',
  'No Brand': '/brands/노브랜드.svg',
  '파리바게뜨': '/brands/파리바게뜨.png',
  '파리바게트': '/brands/파리바게뜨.png',
  '뚜레쥬르': '/brands/뚜레쥬르.png',
  'CJ푸드빌': '/brands/뚜레쥬르.png',
  'CJ푸드빌 뚜레쥬르': '/brands/뚜레쥬르.png',
  'Tous Les Jours': '/brands/뚜레쥬르.png',
  '성심당': '/brands/성심당.png',
  '폴바셋': '/brands/폴바셋.png',
  '더벤티': '/brands/더벤티.png',
  '삼송빵집': '/brands/삼송빵집.png',
  '태극당': '/brands/태극당.png',
};

const svgToUri = (svg: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
};

export const BRAND_SVG_LOGOS: Record<string, string> = {
  // 0. 노브랜드 (No Brand)
  '노브랜드': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#FED100"/>
      <rect x="12" y="16" width="96" height="88" rx="14" fill="none" stroke="#231F20" stroke-width="3.5" stroke-dasharray="8 5"/>
      <text x="60" y="52" font-family="'Arial Black', Impact, sans-serif" font-weight="900" font-size="20" fill="#231F20" text-anchor="middle" letter-spacing="-0.5">No Brand</text>
      <text x="60" y="74" font-family="'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" font-weight="800" font-size="12" fill="#231F20" text-anchor="middle">노브랜드</text>
      <text x="60" y="90" font-family="'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" font-weight="600" font-size="7.5" fill="#333333" text-anchor="middle">소비자가 브랜드다</text>
    </svg>
  `),
  'No Brand': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#FED100"/>
      <rect x="12" y="16" width="96" height="88" rx="14" fill="none" stroke="#231F20" stroke-width="3.5" stroke-dasharray="8 5"/>
      <text x="60" y="52" font-family="'Arial Black', Impact, sans-serif" font-weight="900" font-size="20" fill="#231F20" text-anchor="middle" letter-spacing="-0.5">No Brand</text>
      <text x="60" y="74" font-family="'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" font-weight="800" font-size="12" fill="#231F20" text-anchor="middle">노브랜드</text>
      <text x="60" y="90" font-family="'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" font-weight="600" font-size="7.5" fill="#333333" text-anchor="middle">소비자가 브랜드다</text>
    </svg>
  `),

  // 1. 맥도날드 (McDonald's)
  '맥도날드': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#DA291C"/>
      <path d="M26 94V50c0-14 8-23 20-23 9 0 14 6 14 15 0-9 5-15 14-15 12 0 20 9 20 23v44h-12V52c0-10-5-15-12-15s-11 6-11 16v41H61V52c0-10-5-15-11-15s-11 6-11 16v41H26z" fill="#FFC72C"/>
      <text x="60" y="110" fill="#FFFFFF" font-size="10" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1">MCDONALD'S</text>
    </svg>
  `),

  // 2. 버거킹 (Burger King)
  '버거킹': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#FFF8F0"/>
      <circle cx="60" cy="60" r="50" fill="#D62300" opacity="0.08"/>
      <path d="M25 50c0-18 16-26 35-26s35 8 35 26z" fill="#E88219"/>
      <path d="M25 70c0 18 16 26 35 26s35-8 35-26z" fill="#E88219"/>
      <rect x="22" y="52" width="76" height="16" rx="8" fill="#D62300"/>
      <text x="60" y="47" fill="#D62300" font-size="13" font-family="'Arial Black', Impact, sans-serif" font-weight="900" text-anchor="middle">BURGER</text>
      <text x="60" y="64" fill="#FFFFFF" font-size="12" font-family="'Arial Black', Impact, sans-serif" font-weight="900" text-anchor="middle">KING</text>
      <path d="M18 45c-6 10-6 20 0 30" stroke="#005691" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M102 45c6 10 6 20 0 30" stroke="#005691" stroke-width="4" stroke-linecap="round" fill="none"/>
    </svg>
  `),

  // 3. 맘스터치 (Mom's Touch)
  '맘스터치': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#4E1417"/>
      <circle cx="60" cy="50" r="28" fill="#FBAF18"/>
      <path d="M48 40h24l5 22H43z" fill="#4E1417"/>
      <circle cx="60" cy="38" r="4" fill="#4E1417"/>
      <path d="M52 35c2-4 14-4 16 0" stroke="#4E1417" stroke-width="2.5" fill="none"/>
      <text x="60" y="86" fill="#FBAF18" font-size="12" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="0.5">MOM'S</text>
      <text x="60" y="99" fill="#FFFFFF" font-size="11" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1">TOUCH</text>
    </svg>
  `),

  // 4. 롯데리아 (Lotteria)
  '롯데리아': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#E30613"/>
      <path d="M38 28h18v44h26v16H38z" fill="#FFFFFF"/>
      <circle cx="78" cy="40" r="9" fill="#FFC72C"/>
      <text x="60" y="104" fill="#FFFFFF" font-size="11" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1.5">LOTTERIA</text>
    </svg>
  `),

  // 5. KFC
  'KFC': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#E4002B"/>
      <rect x="25" y="18" width="16" height="54" fill="#FFFFFF"/>
      <rect x="79" y="18" width="16" height="54" fill="#FFFFFF"/>
      <circle cx="53" cy="38" r="5" fill="#FFFFFF"/>
      <circle cx="67" cy="38" r="5" fill="#FFFFFF"/>
      <rect x="52" y="37" width="16" height="2.5" fill="#FFFFFF"/>
      <path d="M50 50q10 7 20 0" stroke="#FFFFFF" stroke-width="3" fill="none" stroke-linecap="round"/>
      <polygon points="56,60 60,63 56,66" fill="#FFFFFF"/>
      <polygon points="64,60 60,63 64,66" fill="#FFFFFF"/>
      <circle cx="60" cy="63" r="2" fill="#FFFFFF"/>
      <text x="60" y="98" fill="#FFFFFF" font-size="22" font-family="'Arial Black', Impact, sans-serif" font-weight="900" text-anchor="middle" letter-spacing="2">KFC</text>
    </svg>
  `),

  // 6. 스타벅스 (Starbucks)
  '스타벅스': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#006241"/>
      <circle cx="60" cy="60" r="44" stroke="#FFFFFF" stroke-width="3" fill="none"/>
      <circle cx="60" cy="60" r="38" fill="#006241"/>
      <circle cx="60" cy="54" r="11" fill="#FFFFFF"/>
      <polygon points="60,34 63,40 67,36 65,43 55,43 53,36 57,40" fill="#FFFFFF"/>
      <polygon points="60,37 61,39 63,39 61.5,40.5 62,42 60,41 58,42 58.5,40.5 57,39 59,39" fill="#006241"/>
      <ellipse cx="60" cy="56" rx="7" ry="8" fill="#006241"/>
      <path d="M38 60q8 18 22 18t22-18c0 14-8 22-22 22S38 74 38 60z" fill="#FFFFFF"/>
      <text x="60" y="110" fill="#FFFFFF" font-size="9" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1">STARBUCKS</text>
    </svg>
  `),

  // 7. 메가MGC커피 (Mega Coffee)
  '메가MGC커피': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#FFCC00"/>
      <path d="M38 32h44l-6 46H44z" fill="#201C1D"/>
      <path d="M80 38h8a6 6 0 0 1 0 12h-7z" fill="none" stroke="#201C1D" stroke-width="4"/>
      <text x="60" y="67" fill="#FFCC00" font-size="28" font-family="'Arial Black', Impact, sans-serif" font-weight="900" text-anchor="middle">M</text>
      <text x="60" y="96" fill="#201C1D" font-size="12" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="0.5">MEGA MGC</text>
      <text x="60" y="108" fill="#201C1D" font-size="9" font-family="'Helvetica Neue', sans-serif" font-weight="800" text-anchor="middle" letter-spacing="1.5">COFFEE</text>
    </svg>
  `),

  // 8. 빽다방 (Paik's Coffee)
  '빽다방': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#1D3A6B"/>
      <circle cx="60" cy="46" r="24" fill="#FFD200"/>
      <path d="M42 42c4-12 28-12 36 0-3-4-10-8-18-8s-15 4-18 8z" fill="#1D3A6B"/>
      <rect x="46" y="42" width="11" height="8" rx="3" fill="none" stroke="#1D3A6B" stroke-width="2.5"/>
      <rect x="63" y="42" width="11" height="8" rx="3" fill="none" stroke="#1D3A6B" stroke-width="2.5"/>
      <line x1="57" y1="46" x2="63" y2="46" stroke="#1D3A6B" stroke-width="2.5"/>
      <path d="M52 56q8 6 16 0" stroke="#1D3A6B" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <text x="60" y="88" fill="#FFFFFF" font-size="14" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1">빽다방</text>
      <text x="60" y="102" fill="#FFD200" font-size="9" font-family="'Arial', sans-serif" font-weight="700" text-anchor="middle" letter-spacing="0.5">PAIK'S COFFEE</text>
    </svg>
  `),

  // 9. 매머드커피 (Mammoth Coffee)
  '매머드커피': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#181818"/>
      <polygon points="32,70 32,32 46,54 60,32 74,54 88,32 88,70 76,70 76,48 68,60 52,60 44,48 44,70" fill="#D4AF37"/>
      <text x="60" y="90" fill="#FFFFFF" font-size="11" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1">MAMMOTH</text>
      <text x="60" y="103" fill="#D4AF37" font-size="9" font-family="'Helvetica Neue', sans-serif" font-weight="700" text-anchor="middle" letter-spacing="2">COFFEE</text>
    </svg>
  `),

  // 10. 컴포즈커피 (Compose Coffee)
  '컴포즈커피': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#FFC700"/>
      <circle cx="60" cy="46" r="22" fill="#212121"/>
      <ellipse cx="60" cy="46" rx="12" ry="16" fill="#FFC700"/>
      <path d="M60 32q-6 14 0 28" stroke="#212121" stroke-width="2.5" fill="none"/>
      <text x="60" y="86" fill="#212121" font-size="12" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1">COMPOSE</text>
      <text x="60" y="100" fill="#212121" font-size="10" font-family="'Arial Black', sans-serif" font-weight="800" text-anchor="middle" letter-spacing="1.5">COFFEE</text>
    </svg>
  `),

  // 11. 이디야커피 (EDIYA Coffee)
  '이디야커피': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#002855"/>
      <circle cx="60" cy="45" r="22" stroke="#FFFFFF" stroke-width="3" fill="none"/>
      <text x="60" y="52" fill="#FFFFFF" font-size="18" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle">E</text>
      <text x="60" y="86" fill="#FFFFFF" font-size="13" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1.5">EDIYA</text>
      <text x="60" y="100" fill="#88B4E7" font-size="10" font-family="'Helvetica Neue', sans-serif" font-weight="700" text-anchor="middle" letter-spacing="2">COFFEE</text>
    </svg>
  `),

  // 12. 투썸플레이스 (A Twosome Place)
  '투썸플레이스': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#1C1C1C"/>
      <rect x="25" y="22" width="70" height="22" rx="6" fill="#A6192E"/>
      <text x="60" y="37" fill="#FFFFFF" font-size="11" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle">A TWOSOME</text>
      <text x="60" y="66" fill="#FFFFFF" font-size="14" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1">PLACE</text>
      <text x="60" y="86" fill="#A6192E" font-size="9" font-family="'Arial', sans-serif" font-weight="700" text-anchor="middle" letter-spacing="1">COFFEE &amp; DESSERT</text>
    </svg>
  `),

  // 12-1. 폴바셋 (Paul Bassett)
  '폴바셋': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#1E1E1E"/>
      <polygon points="60,22 66,34 78,32 71,42 77,52 64,48 60,58 56,48 43,52 49,42 42,32 54,34" fill="#C5A059"/>
      <circle cx="60" cy="40" r="4" fill="#1E1E1E"/>
      <text x="60" y="74" fill="#FFFFFF" font-size="12" font-family="'Georgia', serif" font-weight="bold" text-anchor="middle" letter-spacing="1">Paul Bassett</text>
      <text x="60" y="90" fill="#C5A059" font-size="8" font-family="'Arial', sans-serif" font-weight="700" text-anchor="middle" letter-spacing="1.5">BARISTA CHAMPION</text>
      <text x="60" y="102" fill="#888888" font-size="7" font-family="'Arial', sans-serif" font-weight="600" text-anchor="middle" letter-spacing="1">SPECIALTY COFFEE</text>
    </svg>
  `),

  // 12-2. 더벤티 (The Venti)
  '더벤티': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#4B1E78"/>
      <circle cx="60" cy="44" r="22" fill="#FFD200"/>
      <text x="60" y="54" fill="#4B1E78" font-size="28" font-family="'Arial Black', Impact, sans-serif" font-weight="900" text-anchor="middle">V</text>
      <text x="60" y="86" fill="#FFFFFF" font-size="13" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1">THE VENTI</text>
      <text x="60" y="100" fill="#FFD200" font-size="8.5" font-family="'Helvetica Neue', sans-serif" font-weight="800" text-anchor="middle" letter-spacing="1.5">COFFEE &amp; BEVERAGE</text>
    </svg>
  `),

  // 13. 농심 (Nongshim)
  '농심': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#FFFFFF" stroke="#F0F0F0" stroke-width="2"/>
      <ellipse cx="60" cy="46" rx="28" ry="24" fill="#E60012"/>
      <circle cx="53" cy="46" r="10" fill="#FFFFFF"/>
      <ellipse cx="67" cy="46" rx="8" ry="10" fill="#FFFFFF"/>
      <circle cx="53" cy="46" r="6" fill="#E60012"/>
      <text x="60" y="88" fill="#E60012" font-size="16" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1">농심</text>
      <text x="60" y="103" fill="#555555" font-size="9" font-family="'Arial', sans-serif" font-weight="800" text-anchor="middle" letter-spacing="1.5">NONGSHIM</text>
    </svg>
  `),

  // 14. 오리온 (Orion)
  '오리온': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#FFFFFF" stroke="#F0F0F0" stroke-width="2"/>
      <circle cx="60" cy="46" r="26" fill="#E50012"/>
      <polygon points="60,26 64,42 80,46 64,50 60,66 56,50 40,46 56,42" fill="#FFFFFF"/>
      <circle cx="60" cy="46" r="3.5" fill="#E50012"/>
      <text x="60" y="88" fill="#E50012" font-size="14" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1.5">ORION</text>
      <text x="60" y="102" fill="#333333" font-size="10" font-family="'Arial Black', sans-serif" font-weight="800" text-anchor="middle">오리온</text>
    </svg>
  `),

  // 15. 삼양식품 (Samyang Foods)
  '삼양식품': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#FFFFFF" stroke="#F0F0F0" stroke-width="2"/>
      <circle cx="60" cy="45" r="24" fill="#FF6600"/>
      <circle cx="60" cy="45" r="16" fill="#FFFFFF"/>
      <circle cx="60" cy="45" r="8" fill="#FF6600"/>
      <text x="60" y="88" fill="#FF6600" font-size="14" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1">삼양식품</text>
      <text x="60" y="102" fill="#333333" font-size="9" font-family="'Arial', sans-serif" font-weight="800" text-anchor="middle" letter-spacing="1.5">SAMYANG</text>
    </svg>
  `),

  // 16. 오뚜기 (Ottogi)
  '오뚜기': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#FFD100"/>
      <circle cx="60" cy="45" r="25" fill="#E30613"/>
      <circle cx="60" cy="45" r="21" fill="#FFFFFF"/>
      <circle cx="52" cy="42" r="3.5" fill="#E30613"/>
      <path d="M64 42q5-4 8 0" stroke="#E30613" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M52 51q8 6 16 0" stroke="#E30613" stroke-width="3" stroke-linecap="round" fill="none"/>
      <text x="60" y="88" fill="#E30613" font-size="15" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle">오뚜기</text>
      <text x="60" y="102" fill="#222222" font-size="9" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1">OTTOGI</text>
    </svg>
  `),

  // 17. CJ제일제당 (CJ CheilJedang)
  'CJ제일제당': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#FFFFFF" stroke="#F0F0F0" stroke-width="2"/>
      <circle cx="48" cy="38" r="14" fill="#E30613"/>
      <circle cx="72" cy="38" r="14" fill="#004B97"/>
      <circle cx="60" cy="56" r="14" fill="#FFBA00"/>
      <circle cx="48" cy="38" r="5" fill="#FFFFFF"/>
      <circle cx="72" cy="38" r="5" fill="#FFFFFF"/>
      <circle cx="60" cy="56" r="5" fill="#FFFFFF"/>
      <text x="60" y="87" fill="#004B97" font-size="13" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle">CJ제일제당</text>
      <text x="60" y="101" fill="#E30613" font-size="9" font-family="'Arial', sans-serif" font-weight="800" text-anchor="middle" letter-spacing="1">CHEILJEDANG</text>
    </svg>
  `),

  // 18. 빙그레 (Binggrae)
  '빙그레': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#FFFFFF" stroke="#F0F0F0" stroke-width="2"/>
      <path d="M42 42c0-10 8-16 18-16s18 6 18 16c0 14-18 26-18 26s-18-12-18-26z" fill="#ED1C24"/>
      <path d="M52 46q8 7 16 0" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none"/>
      <text x="60" y="88" fill="#ED1C24" font-size="15" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle">빙그레</text>
      <text x="60" y="102" fill="#555555" font-size="9" font-family="'Arial', sans-serif" font-weight="700" text-anchor="middle" letter-spacing="1">binggrae</text>
    </svg>
  `),

  // 19. 코카콜라 (Coca-Cola)
  '코카콜라': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#F40009"/>
      <path d="M15 75q45-20 90 0" stroke="#FFFFFF" stroke-width="3.5" fill="none" opacity="0.8"/>
      <text x="60" y="52" fill="#FFFFFF" font-size="18" font-family="'Brush Script MT', 'Palatino', cursive, sans-serif" font-weight="900" font-style="italic" text-anchor="middle" letter-spacing="-0.5">Coca-Cola</text>
      <text x="60" y="98" fill="#FFFFFF" font-size="12" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle">코카-콜라</text>
    </svg>
  `),

  // 20. 하이트진로 (HiteJinro)
  '하이트진로': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#005BAA"/>
      <ellipse cx="60" cy="46" rx="22" ry="18" fill="#FFFFFF"/>
      <circle cx="50" cy="35" r="5" fill="#FFFFFF"/>
      <circle cx="70" cy="35" r="5" fill="#FFFFFF"/>
      <circle cx="50" cy="35" r="2.5" fill="#005BAA"/>
      <circle cx="70" cy="35" r="2.5" fill="#005BAA"/>
      <path d="M52 48q8 4 16 0" stroke="#005BAA" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <text x="60" y="86" fill="#FFFFFF" font-size="13" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle">하이트진로</text>
      <text x="60" y="100" fill="#90CAF9" font-size="9" font-family="'Arial', sans-serif" font-weight="800" text-anchor="middle" letter-spacing="1">HITEJINRO</text>
    </svg>
  `),

  // 21. 매일유업 (Maeil)
  '매일유업': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#FFFFFF" stroke="#F0F0F0" stroke-width="2"/>
      <path d="M46 42c0-8 8-16 14-22 6 6 14 14 14 22a14 14 0 0 1-28 0z" fill="#005CA9"/>
      <circle cx="70" cy="48" r="8" fill="#78BE20"/>
      <text x="60" y="86" fill="#005CA9" font-size="15" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle">매일유업</text>
      <text x="60" y="101" fill="#78BE20" font-size="10" font-family="'Helvetica Neue', sans-serif" font-weight="800" text-anchor="middle" letter-spacing="1.5">Maeil</text>
    </svg>
  `),

  // 22. 연세유업 (Yonsei)
  '연세유업': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#00205B"/>
      <path d="M42 28h36v24c0 14-18 22-18 22s-18-8-18-22z" fill="#FFFFFF"/>
      <path d="M46 32h28v20c0 10-14 16-14 16s-14-6-14-16z" fill="#00205B"/>
      <text x="60" y="48" fill="#D4AF37" font-size="14" font-family="'Times New Roman', serif" font-weight="900" text-anchor="middle">Y</text>
      <text x="60" y="90" fill="#FFFFFF" font-size="13" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle">연세유업</text>
      <text x="60" y="103" fill="#D4AF37" font-size="9" font-family="'Arial', sans-serif" font-weight="700" text-anchor="middle" letter-spacing="1">YONSEI MILK</text>
    </svg>
  `),

  // 23. 롯데웰푸드 / 롯데 (Lotte)
  '롯데웰푸드': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#DA291C"/>
      <polygon points="60,24 82,44 60,64 38,44" fill="#FFFFFF"/>
      <text x="60" y="50" fill="#DA291C" font-size="16" font-family="'Georgia', serif" font-weight="bold" text-anchor="middle">L</text>
      <text x="60" y="86" fill="#FFFFFF" font-size="13" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="0.5">LOTTE</text>
      <text x="60" y="101" fill="#FFE5E5" font-size="9" font-family="'Arial', sans-serif" font-weight="700" text-anchor="middle" letter-spacing="1">WELLFOOD</text>
    </svg>
  `),

  // 24. 해태제과 (Haitai)
  '해태제과': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#DC0023"/>
      <ellipse cx="60" cy="46" rx="28" ry="20" fill="none" stroke="#FFFFFF" stroke-width="4"/>
      <text x="60" y="53" fill="#FFFFFF" font-size="16" font-family="'Arial Black', Impact, sans-serif" font-weight="900" text-anchor="middle">HT</text>
      <text x="60" y="88" fill="#FFFFFF" font-size="14" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle">해태제과</text>
      <text x="60" y="102" fill="#FFE0E0" font-size="9" font-family="'Arial', sans-serif" font-weight="800" text-anchor="middle" letter-spacing="2">HAITAI</text>
    </svg>
  `),

  // 25. GS25
  'GS25': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#007BC3"/>
      <rect x="22" y="28" width="76" height="64" rx="16" fill="#FFFFFF"/>
      <text x="43" y="68" fill="#007BC3" font-size="20" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle">GS</text>
      <text x="75" y="68" fill="#00A69C" font-size="22" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle">25</text>
      <rect x="28" y="73" width="64" height="4" rx="2" fill="#00A69C"/>
    </svg>
  `),

  // 26. CU
  'CU': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#632483"/>
      <path d="M25 32h70a8 8 0 0 1 8 8v34a8 8 0 0 1-8 8H45l-12 10v-10h-8a8 8 0 0 1-8-8V40a8 8 0 0 1 8-8z" fill="#FFFFFF"/>
      <text x="60" y="65" fill="#632483" font-size="28" font-family="'Arial Black', Impact, sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1">CU</text>
      <circle cx="83" cy="46" r="4.5" fill="#8FC43C"/>
      <text x="60" y="106" fill="#8FC43C" font-size="9" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="0.5">Nice to CU</text>
    </svg>
  `),

  // 27. 세븐일레븐 (7-Eleven)
  '세븐일레븐': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#FFFFFF" stroke="#008163" stroke-width="4"/>
      <rect x="18" y="16" width="84" height="6" fill="#EE3124"/>
      <rect x="18" y="98" width="84" height="6" fill="#008163"/>
      <path d="M38 32h44l-22 50h-12l16-36H38z" fill="#EE3124"/>
      <path d="M48 32h34l-14 30h-10l8-18H48z" fill="#F58220"/>
      <rect x="30" y="55" width="60" height="15" rx="3" fill="#008163"/>
      <text x="60" y="66" fill="#FFFFFF" font-size="10" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle">ELEVEN</text>
    </svg>
  `),

  // 28. 이마트24 (emart24)
  '이마트24': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#FFB81C"/>
      <text x="60" y="56" fill="#231F20" font-size="18" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle">emart</text>
      <text x="60" y="84" fill="#231F20" font-size="28" font-family="'Arial Black', Impact, sans-serif" font-weight="900" text-anchor="middle">24</text>
      <polygon points="88,34 90,40 96,42 90,44 88,50 86,44 80,42 86,40" fill="#231F20"/>
    </svg>
  `),

  // 29. 청도농협 (농협 NH)
  '청도농협': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#FFFFFF" stroke="#F0F0F0" stroke-width="2"/>
      <path d="M38 32l22 34 22-34h-10l-12 20-12-20z" fill="#00873D"/>
      <circle cx="60" cy="36" r="6" fill="#00873D"/>
      <text x="60" y="86" fill="#00873D" font-size="14" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle">청도농협</text>
      <text x="60" y="100" fill="#222222" font-size="9" font-family="'Arial', sans-serif" font-weight="800" text-anchor="middle" letter-spacing="1">NH NONGHYUP</text>
    </svg>
  `),

  // 30. 횡성축협
  '횡성축협': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#8A151B"/>
      <path d="M36 44c10-14 38-14 48 0-6-6-20-8-24-8s-18 2-24 8z" fill="#D4AF37"/>
      <ellipse cx="60" cy="52" rx="14" ry="10" fill="#D4AF37"/>
      <text x="60" y="86" fill="#FFFFFF" font-size="13" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle">횡성축협</text>
      <text x="60" y="100" fill="#D4AF37" font-size="9" font-family="'Arial', sans-serif" font-weight="800" text-anchor="middle" letter-spacing="1">HWEONGSEONG</text>
    </svg>
  `),

  // 31. 고창황토농원
  '고창황토농원': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#8D4925"/>
      <circle cx="60" cy="46" r="22" fill="#A8582E"/>
      <path d="M60 30c-8 6-6 14 0 18 6-4 8-12 0-18z" fill="#78BE20"/>
      <path d="M52 42q8-4 16 0" stroke="#78BE20" stroke-width="2.5" fill="none"/>
      <text x="60" y="86" fill="#FFFFFF" font-size="12" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle">고창황토농원</text>
      <text x="60" y="100" fill="#FFCC80" font-size="9" font-family="'Arial', sans-serif" font-weight="700" text-anchor="middle">FARM FRESH</text>
    </svg>
  `),

  // 32. 태안수협
  '태안수협': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#00529B"/>
      <path d="M40 45q20-14 40 0t-40 0z" fill="#FFFFFF"/>
      <polygon points="76,45 86,40 86,50" fill="#FFFFFF"/>
      <circle cx="48" cy="45" r="2.5" fill="#00529B"/>
      <path d="M30 62q15-6 30 0t30 0" stroke="#4FC3F7" stroke-width="3" fill="none" stroke-linecap="round"/>
      <text x="60" y="88" fill="#FFFFFF" font-size="13" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle">태안수협</text>
      <text x="60" y="101" fill="#B3E5FC" font-size="9" font-family="'Arial', sans-serif" font-weight="700" text-anchor="middle" letter-spacing="1">FISHERIES</text>
    </svg>
  `),

  // 33. 자연애란
  '자연애란': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#F7A028"/>
      <ellipse cx="60" cy="46" rx="18" ry="24" fill="#FFFFFF"/>
      <circle cx="60" cy="50" r="10" fill="#FFC107"/>
      <text x="60" y="88" fill="#FFFFFF" font-size="14" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle">자연애란</text>
      <text x="60" y="102" fill="#FFF3E0" font-size="9" font-family="'Arial', sans-serif" font-weight="800" text-anchor="middle" letter-spacing="1">FRESH EGGS</text>
    </svg>
  `),

  // 34. 동서식품
  '동서식품': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#FFFFFF" stroke="#F0F0F0" stroke-width="2"/>
      <circle cx="60" cy="46" r="22" fill="#004A99"/>
      <polygon points="60,32 64,44 76,46 66,54 69,66 60,59 51,66 54,54 44,46 56,44" fill="#D4AF37"/>
      <text x="60" y="88" fill="#004A99" font-size="14" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle">동서식품</text>
      <text x="60" y="102" fill="#666666" font-size="9" font-family="'Arial', sans-serif" font-weight="800" text-anchor="middle">DONGSUH</text>
    </svg>
  `),

  // 35. 비비고 (bibigo)
  '비비고': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#1B3A2C"/>
      <circle cx="60" cy="46" r="24" fill="#244E3B" stroke="#D1A763" stroke-width="1.5"/>
      <!-- 돌솥 그릇 & 한식 스푼 젓가락 심볼 -->
      <path d="M43 45c0 10 7.6 18 17 18s17-8 17-18H43z" fill="#D1A763"/>
      <rect x="40" y="42" width="40" height="4" rx="2" fill="#E8C98B"/>
      <!-- 숟가락 / 젓가락 라인 -->
      <line x1="56" y1="28" x2="56" y2="42" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
      <circle cx="56" cy="27" r="3" fill="#FFFFFF"/>
      <line x1="64" y1="26" x2="64" y2="42" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
      <!-- 브랜드명 bibigo 영문 / 비비고 국문 -->
      <text x="60" y="88" fill="#FFFFFF" font-size="16" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1">bibigo</text>
      <text x="60" y="103" fill="#D1A763" font-size="10" font-family="'Noto Sans KR', sans-serif" font-weight="700" text-anchor="middle" letter-spacing="2">비비고</text>
    </svg>
  `),

  // 37. 파리바게뜨 (Paris Baguette)
  '파리바게뜨': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#002B7F"/>
      <!-- 에펠탑 아이콘 -->
      <path d="M60 22l-1 5h2zM58 27l-3 18h10l-3-18zM53 47l-6 26h4l2-8h14l2 8h4l-6-26zM54 62h12l-1-4h-10z" fill="#D4AF37"/>
      <path d="M52 73c0-4 3.5-7 8-7s8 3 8 7" fill="none" stroke="#D4AF37" stroke-width="2"/>
      <rect x="42" y="73" width="36" height="3" rx="1.5" fill="#D4AF37"/>
      <!-- 파리바게뜨 타이포 -->
      <text x="60" y="89" fill="#FFFFFF" font-size="9" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="0.5">PARIS BAGUETTE</text>
      <text x="60" y="102" fill="#D4AF37" font-size="11" font-family="'Noto Sans KR', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1">파리바게뜨</text>
    </svg>
  `),

  // 38. 뚜레쥬르 (Tous Les Jours)
  '뚜레쥬르': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#17402F"/>
      <circle cx="60" cy="46" r="23" fill="#102C20" stroke="#D4AF37" stroke-width="1.5"/>
      <!-- 밀 이삭 & 나뭇잎 심볼 -->
      <path d="M60 28v28M54 36c4-2 6 2 6 2s2-4 6-2M52 44c5-2 8 2 8 2s3-4 8-2M53 51c4-2 7 2 7 2s3-4 7-2" stroke="#D4AF37" stroke-width="2" stroke-linecap="round" fill="none"/>
      <!-- 뚜레쥬르 타이포 -->
      <text x="60" y="87" fill="#FFF8F0" font-size="11" font-family="'Georgia', serif" font-weight="900" text-anchor="middle" letter-spacing="0.5">TOUS les JOURS</text>
      <text x="60" y="102" fill="#D4AF37" font-size="11" font-family="'Noto Sans KR', sans-serif" font-weight="800" text-anchor="middle" letter-spacing="1.5">뚜레쥬르</text>
    </svg>
  `),

  // 39. 성심당 (Sungsimdang)
  '성심당': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#5C3A21"/>
      <circle cx="60" cy="48" r="25" fill="#472A15" stroke="#FFF0DC" stroke-width="2"/>
      <!-- 빵 모티브 심볼 -->
      <path d="M44 50c0-9 7.2-16 16-16s16 7 16 16c0 6-7 11-16 11s-16-5-16-11z" fill="#D4AF37"/>
      <path d="M48 45q12-6 24 0M50 51q10-4 20 0" stroke="#5C3A21" stroke-width="2" stroke-linecap="round" fill="none"/>
      <!-- 성심당 한자 & 한글 -->
      <text x="60" y="44" fill="#FFFFFF" font-size="9" font-family="'Batang', serif" font-weight="900" text-anchor="middle">聖心堂</text>
      <text x="60" y="88" fill="#FFF0DC" font-size="15" font-family="'Batang', serif" font-weight="900" text-anchor="middle" letter-spacing="2">성심당</text>
      <text x="60" y="103" fill="#D4AF37" font-size="9" font-family="'Arial', sans-serif" font-weight="800" text-anchor="middle" letter-spacing="1">SINCE 1956</text>
    </svg>
  `),

  // 40. 삼송빵집 (Samsong Bakery)
  '삼송빵집': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#F2A900"/>
      <!-- 옥수수빵 일러스트 심볼 -->
      <circle cx="60" cy="46" r="22" fill="#FFE58F" stroke="#4A2600" stroke-width="2"/>
      <ellipse cx="60" cy="46" rx="14" ry="17" fill="#F59E0B"/>
      <path d="M53 38q7 3 14 0M50 46q10 4 20 0M52 54q8 3 16 0" stroke="#B45309" stroke-width="2" stroke-linecap="round"/>
      <!-- 타이포 -->
      <text x="60" y="88" fill="#4A2600" font-size="15" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1">삼송빵집</text>
      <text x="60" y="103" fill="#6B3500" font-size="9" font-family="'Arial', sans-serif" font-weight="800" text-anchor="middle" letter-spacing="1">SAMSONG 1957</text>
    </svg>
  `),

  // 41. 태극당 (Taegeukdang)
  '태극당': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#8B1E1E"/>
      <circle cx="60" cy="46" r="23" fill="#6B1313" stroke="#FDFBF7" stroke-width="2"/>
      <!-- 태극 문양 & 국화 심볼 -->
      <circle cx="60" cy="46" r="14" fill="#C53030"/>
      <path d="M60 32a14 14 0 0 1 0 28 7 7 0 0 1 0-14 7 7 0 0 0 0-14z" fill="#1A365D"/>
      <circle cx="60" cy="39" r="2.5" fill="#C53030"/>
      <circle cx="60" cy="53" r="2.5" fill="#1A365D"/>
      <!-- 타이포 -->
      <text x="60" y="87" fill="#FDFBF7" font-size="15" font-family="'Batang', serif" font-weight="900" text-anchor="middle" letter-spacing="2">태극당</text>
      <text x="60" y="102" fill="#E2C17C" font-size="9" font-family="'Arial', sans-serif" font-weight="800" text-anchor="middle" letter-spacing="1.5">SINCE 1946</text>
    </svg>
  `),

  // 42. 런던베이글뮤지엄 (London Bagel Museum)
  '런던베이글뮤지엄': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#2C2A29"/>
      <circle cx="60" cy="46" r="23" fill="#1F1D1C" stroke="#D1A763" stroke-width="1.5"/>
      <!-- 베이글 링 심볼 & 왕관 -->
      <path d="M52 33l2 4 6-2 6 2 2-4 3 6H49z" fill="#D1A763"/>
      <circle cx="60" cy="49" r="12" fill="none" stroke="#D1A763" stroke-width="5"/>
      <circle cx="60" cy="49" r="6" fill="#2C2A29"/>
      <!-- 타이포 -->
      <text x="60" y="85" fill="#FFFFFF" font-size="10" font-family="'Georgia', serif" font-weight="900" text-anchor="middle" letter-spacing="1">LONDON BAGEL</text>
      <text x="60" y="97" fill="#D1A763" font-size="9" font-family="'Georgia', serif" font-weight="800" text-anchor="middle" letter-spacing="2">MUSEUM</text>
      <text x="60" y="108" fill="#A89F91" font-size="8" font-family="'Noto Sans KR', sans-serif" font-weight="700" text-anchor="middle">런던베이글</text>
    </svg>
  `),

  // 43. 노티드 (Knotted)
  '노티드': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#FFF0F3" stroke="#FF8BA7" stroke-width="3"/>
      <!-- 스마일 아이콘 -->
      <circle cx="60" cy="46" r="22" fill="#FFD23F"/>
      <!-- 눈 -->
      <ellipse cx="52" cy="42" rx="2.5" ry="3.5" fill="#2B2D42"/>
      <ellipse cx="68" cy="42" rx="2.5" ry="3.5" fill="#2B2D42"/>
      <!-- 입 & 메롱 혀 -->
      <path d="M50 49q10 12 20 0" stroke="#2B2D42" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M60 55c0 4 3 7 6 7s6-3 6-7z" fill="#FF5964"/>
      <!-- 타이포 -->
      <text x="60" y="89" fill="#2B2D42" font-size="17" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="0.5">Knotted</text>
      <text x="60" y="104" fill="#FF5964" font-size="9" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="2">DONUT</text>
    </svg>
  `),

  // 36. 배스킨라빈스 (Baskin Robbins)
  '배스킨라빈스': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#FFF2F6"/>
      <circle cx="60" cy="55" r="42" fill="#FFFFFF" stroke="#FF007A" stroke-width="2.5"/>
      <g transform="translate(25, 23)">
        <!-- B & R outline with signature 31 -->
        <path d="M8 12h14c5 0 9 3 9 7 0 3-1.5 5-4 6 3.5 1 5.5 3.5 5.5 7.2 0 5-4 8.8-10.5 8.8H8V12z" fill="none" stroke="#0069B4" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M42 25h11c4.5 0 8 2.5 8 6 0 2.5-1.5 4.5-4 5.5l6 11.5h-6l-5-10h-10v10h-5V25z" fill="none" stroke="#0069B4" stroke-width="4.5" stroke-linejoin="round"/>
        <text x="35" y="38" font-family="'Arial Black', Impact, sans-serif" font-weight="900" font-size="22" fill="#FF007A" text-anchor="middle">31</text>
      </g>
      <text x="60" y="104" fill="#0069B4" font-size="11" font-family="'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="-0.5">배스킨라빈스</text>
    </svg>
  `),

  // 37. DEFAULT (공식 브랜드 기본 엠블럼)
  'DEFAULT': svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#0066FF"/>
      <circle cx="60" cy="46" r="22" fill="#FFFFFF" opacity="0.15"/>
      <path d="M42 52l18-18 18 18-5 5-13-13-13 13z" fill="#FFFFFF"/>
      <rect x="45" y="52" width="30" height="18" rx="4" fill="#FFFFFF"/>
      <text x="60" y="65" fill="#0066FF" font-size="9" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle">OFFICIAL</text>
      <text x="60" y="94" fill="#FFFFFF" font-size="12" font-family="'Arial Black', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1">BRAND</text>
    </svg>
  `)
};

/**
 * Aliases and normalize lookup
 */
export const BRAND_ALIASES: Record<string, string> = {
  '스타벅스 / 동서식품': '스타벅스',
  '스타벅스코리아': '스타벅스',
  '동서식품 / 스타벅스': '스타벅스',
  '메가커피': '메가MGC커피',
  '메가MGC': '메가MGC커피',
  '매머드': '매머드커피',
  '매머드익스프레스': '매머드커피',
  '롯데': '롯데웰푸드',
  '롯데제과': '롯데웰푸드',
  '해태': '해태제과',
  '삼양': '삼양식품',
  'CJ': 'CJ제일제당',
  '씨제이제일제당': 'CJ제일제당',
  '연세우유': '연세유업',
  '이디야': '이디야커피',
  '투썸': '투썸플레이스',
  '컴포즈': '컴포즈커피',
  '폴 바셋': '폴바셋',
  '바셋': '폴바셋',
  '벤티': '더벤티',
  '더 벤티': '더벤티',
  '진로': '하이트진로',
  '하이트': '하이트진로',
  '농협': '청도농협',
  '비비고': '비비고',
  'CJ 비비고': '비비고',
  'CJ제일제당 비비고': '비비고',
  'bibigo': '비비고',
  '파리바게트': '파리바게뜨',
  '파바': '파리바게뜨',
  '파리크라상': '파리바게뜨',
  'parisbaguette': '파리바게뜨',
  '뚜쥬': '뚜레쥬르',
  '뚜레주르': '뚜레쥬르',
  'touslesjours': '뚜레쥬르',
  '대전성심당': '성심당',
  '성심당몰': '성심당',
  '런던베이글': '런던베이글뮤지엄',
  '런베뮤': '런던베이글뮤지엄',
  'londonbagel': '런던베이글뮤지엄',
  '카페노티드': '노티드',
  '노티드도넛': '노티드',
  'knotted': '노티드',
  '대구삼송빵집': '삼송빵집',
  '마약옥수수빵': '삼송빵집',
  '장충동태극당': '태극당',
  'No Brand': '노브랜드',
  'NoBrand': '노브랜드',
  'nobrand': '노브랜드',
  '이마트 노브랜드': '노브랜드',
  '이마트노브랜드': '노브랜드',
  '배스킨라빈스': '배스킨라빈스',
  '베스킨라빈스': '배스킨라빈스',
  '베스킨': '배스킨라빈스',
  '배스킨': '배스킨라빈스',
  '베라': '배스킨라빈스',
  '배라': '배스킨라빈스',
  'baskinrobbins': '배스킨라빈스',
  'Baskin Robbins': '배스킨라빈스',
  'baskin robbins': '배스킨라빈스',
};

/**
 * Brand specific primary colors for avatar / badge styling
 */
export const BRAND_THEME_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  '배스킨라빈스': { bg: '#FF3E83', text: '#FFFFFF', border: '#0069B4' },
  '노브랜드': { bg: '#FED100', text: '#231F20', border: '#E5BC00' },
  '비비고': { bg: '#1B3A2C', text: '#FFFFFF', border: '#12261D' },
  '맥도날드': { bg: '#DA291C', text: '#FFC72C', border: '#B81E13' },
  '버거킹': { bg: '#D62300', text: '#FFFFFF', border: '#B51B00' },
  '맘스터치': { bg: '#4E1417', text: '#FBAF18', border: '#3B0F11' },
  '롯데리아': { bg: '#E30613', text: '#FFFFFF', border: '#C0040F' },
  'KFC': { bg: '#E4002B', text: '#FFFFFF', border: '#C00024' },
  '스타벅스': { bg: '#006241', text: '#FFFFFF', border: '#004C32' },
  '메가MGC커피': { bg: '#FFCC00', text: '#201C1D', border: '#E6B800' },
  '빽다방': { bg: '#1D3A6B', text: '#FFD200', border: '#152B50' },
  '매머드커피': { bg: '#181818', text: '#D4AF37', border: '#333333' },
  '컴포즈커피': { bg: '#FFC700', text: '#212121', border: '#E0AF00' },
  '이디야커피': { bg: '#002855', text: '#FFFFFF', border: '#001D3F' },
  '투썸플레이스': { bg: '#1C1C1C', text: '#A6192E', border: '#333333' },
  '폴바셋': { bg: '#1E1E1E', text: '#C5A059', border: '#3A3A3A' },
  '더벤티': { bg: '#4B1E78', text: '#FFD200', border: '#361259' },
  '파리바게뜨': { bg: '#002B7F', text: '#FFFFFF', border: '#001D59' },
  '뚜레쥬르': { bg: '#17402F', text: '#D4AF37', border: '#0E281D' },
  '성심당': { bg: '#5C3A21', text: '#FFF8F0', border: '#3E2614' },
  '삼송빵집': { bg: '#F2A900', text: '#4A2600', border: '#D49200' },
  '태극당': { bg: '#8B1E1E', text: '#FDFBF7', border: '#631414' },
  '런던베이글뮤지엄': { bg: '#2C2A29', text: '#D1A763', border: '#1A1918' },
  '노티드': { bg: '#FFF0F3', text: '#FF5964', border: '#FF8BA7' },
  '농심': { bg: '#E60012', text: '#FFFFFF', border: '#C4000F' },
  '오리온': { bg: '#E50012', text: '#FFFFFF', border: '#C2000F' },
  '삼양식품': { bg: '#FF6600', text: '#FFFFFF', border: '#D95700' },
  '오뚜기': { bg: '#FFD100', text: '#E30613', border: '#E0B800' },
  'CJ제일제당': { bg: '#004B97', text: '#FFFFFF', border: '#003873' },
  '빙그레': { bg: '#ED1C24', text: '#FFFFFF', border: '#C9141B' },
  '코카콜라': { bg: '#F40009', text: '#FFFFFF', border: '#D00007' },
  '하이트진로': { bg: '#005BAA', text: '#FFFFFF', border: '#004582' },
  '매일유업': { bg: '#005CA9', text: '#FFFFFF', border: '#004782' },
  '연세유업': { bg: '#00205B', text: '#D4AF37', border: '#001640' },
  '롯데웰푸드': { bg: '#DA291C', text: '#FFFFFF', border: '#B81E13' },
  '해태제과': { bg: '#DC0023', text: '#FFFFFF', border: '#B8001C' },
  'GS25': { bg: '#007BC3', text: '#FFFFFF', border: '#00629C' },
  'CU': { bg: '#632483', text: '#8FC43C', border: '#4E1B67' },
  '세븐일레븐': { bg: '#008163', text: '#FFFFFF', border: '#00634C' },
  '이마트24': { bg: '#FFB81C', text: '#231F20', border: '#E0A015' },
};
