/**
 * 검색 별칭(줄임말·유사어) 처리.
 * "배라" → "배스킨라빈스", "맘터" → "맘스터치"처럼 사람들이 흔히 쓰는 말로도 검색되게 합니다.
 * 띄어쓰기·대소문자 차이도 무시합니다 ("배스킨 라빈스" = "배스킨라빈스").
 */

// 같은 뜻으로 취급할 단어 묶음. 새 줄임말은 해당 묶음에 추가하면 됩니다.
const ALIAS_GROUPS: string[][] = [
  // 아이스크림·디저트
  ['배스킨라빈스', '배라', '베라', '베스킨라빈스', '배스킨', '베스킨', 'baskinrobbins', 'br31'],
  ['파리바게뜨', '파바', '파리바게트', '파리바게뜨', 'parisbaguette'],
  ['뚜레쥬르', '뚜쥬', '뚜레주르', 'touslesjours'],
  ['던킨도너츠', '던킨', 'dunkin'],
  ['크리스피크림', '크크', '크리스피', 'krispykreme'],
  ['런던베이글뮤지엄', '런베뮤', '런던베이글'],
  ['설빙', '설빙빙수'],
  // 버거·치킨·피자
  ['맥도날드', '맥날', '맥도', '맥드', 'mcdonalds', 'mcdonald'],
  ['맘스터치', '맘터', 'momstouch'],
  ['버거킹', '버킹', '벅킹', 'burgerking'],
  ['롯데리아', '롯리', 'lotteria'],
  ['kfc', '케이에프씨', '켄터키', '켄터키프라이드치킨'],
  ['프랭크버거', '프랭크'],
  ['노브랜드버거', '노브버거', '노버'],
  ['도미노피자', '도미노', 'dominos'],
  ['파파존스', '파파존스피자', 'papajohns'],
  ['피자헛', 'pizzahut'],
  ['피자알볼로', '알볼로'],
  ['반올림피자', '반올림피자샵', '반올림'],
  ['교촌치킨', '교촌'],
  ['bhc', '비에이치씨'],
  ['bbq', '비비큐'],
  ['굽네치킨', '굽네'],
  ['처갓집양념치킨', '처갓집'],
  ['서브웨이', '섭웨', 'subway'],
  // 카페
  ['스타벅스', '스벅', '별다방', 'starbucks'],
  ['메가mgc커피', '메가커피', '메가', '메가mgc'],
  ['컴포즈커피', '컴포즈', 'compose'],
  ['빽다방', '빽', '백다방'],
  ['이디야커피', '이디야', 'ediya'],
  ['투썸플레이스', '투썸', 'twosome'],
  ['폴바셋', '폴바', 'paulbassett'],
  ['더벤티', '벤티', 'theventi'],
  ['매머드커피', '매머드', '매머드익스프레스'],
  ['할리스커피', '할리스', 'hollys'],
  ['커피빈', 'coffeebean'],
  ['공차', 'gongcha'],
  // 편의점·마트
  ['gs25', '지에스25', '지에스', 'gs편의점'],
  ['cu', '씨유'],
  ['세븐일레븐', '세븐', '세븐일레븐편의점', '7eleven', '711'],
  ['이마트24', '이마트이십사', 'emart24'],
  ['노브랜드', '노브', 'nobrand'],
  // 식품 제조사
  ['cj제일제당', '씨제이', 'cj', '제일제당'],
  ['롯데웰푸드', '롯데제과', '롯데'],
  ['해태제과', '해태'],
  ['코카콜라', '코크', 'cocacola'],
  ['펩시', 'pepsi'],
  // 자주 쓰는 음식 줄임말
  ['아이스아메리카노', '아아'],
  ['따뜻한아메리카노', '뜨아'],
  ['아이스크림', '아이스림'],
  ['두바이초콜릿', '두쫀쿠', '두바이초콜렛', '두바이쫀득쿠키', '두바이'],
  ['떡볶이', '떡볶', '떡뽀끼', '떡복이'],
  ['햄버거', '버거'],
  ['신제품', '신상', '신상품'],
];

/** 소문자로 바꾸고 띄어쓰기·구분 기호를 없앱니다. */
export const normalizeSearchText = (text: string): string =>
  text.toLowerCase().replace(/[\s·・.,\-_'"’‘&()[\]/]+/g, '');

const NORMALIZED_GROUPS: string[][] = ALIAS_GROUPS.map(g =>
  Array.from(new Set(g.map(normalizeSearchText).filter(Boolean)))
);

/** 한 단어를 별칭까지 포함한 후보 목록으로 넓힙니다. ("배라" → ["배라", "배스킨라빈스", ...]) */
const expandToken = (token: string): string[] => {
  const variants = new Set<string>([token]);
  for (const group of NORMALIZED_GROUPS) {
    for (const alias of group) {
      // 짧은 별칭(2글자 이하)은 단어 전체가 같을 때만 바꿔 엉뚱한 확장을 막습니다.
      const hit = alias.length <= 2 ? token === alias : token.includes(alias);
      if (!hit) continue;
      for (const other of group) variants.add(token.split(alias).join(other));
    }
  }
  return Array.from(variants);
};

/**
 * 검색어를 단어별 후보 목록으로 변환합니다. 결과가 null이면 검색어가 비어 있는 것입니다.
 * 같은 검색어로 여러 제품을 걸러낼 때 한 번만 만들어 재사용하세요.
 */
export const buildSearchMatcher = (rawQuery: string): ((fields: Array<string | null | undefined>) => boolean) | null => {
  const words = rawQuery.toLowerCase().split(/\s+/).map(normalizeSearchText).filter(Boolean);
  if (words.length === 0) return null;
  const whole = normalizeSearchText(rawQuery);
  const wholeVariants = expandToken(whole);
  const wordVariants = words.map(expandToken);

  return (fields) => {
    const haystack = fields.filter(Boolean).map(f => normalizeSearchText(String(f))).join('|');
    // 1) 검색어 전체(띄어쓰기 무시)가 그대로 들어 있으면 일치
    if (wholeVariants.some(v => haystack.includes(v))) return true;
    // 2) 단어마다 하나라도 들어 있으면 일치 ("배라 신상" → 배스킨라빈스 + 신상)
    if (words.length > 1) return wordVariants.every(vs => vs.some(v => haystack.includes(v)));
    return false;
  };
};

/** 단건 비교용 간편 함수 */
export const matchesSearch = (rawQuery: string, fields: Array<string | null | undefined>): boolean => {
  const matcher = buildSearchMatcher(rawQuery);
  return matcher ? matcher(fields) : true;
};
