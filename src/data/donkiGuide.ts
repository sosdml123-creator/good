// 돈키호테 가이드 화면의 고정 안내 문구 (상품·매장 목록은 Supabase 에서 가져옵니다)

export interface JaPhrase {
  ja: string;
  sound: string; // 한글 발음
  ko: string;
}

export const PHRASE_GROUPS: { title: string; emoji: string; phrases: JaPhrase[] }[] = [
  {
    title: '매장에서',
    emoji: '🛒',
    phrases: [
      { ja: 'これはどこにありますか？', sound: '코레와 도코니 아리마스카?', ko: '이거 어디에 있어요? (사진을 보여주며)' },
      { ja: 'これの在庫はありますか？', sound: '코레노 자이코와 아리마스카?', ko: '이거 재고 있어요?' },
      { ja: '試してみてもいいですか？', sound: '타메시테 미테모 이이데스카?', ko: '테스터 써 봐도 돼요?' },
      { ja: '一番人気の商品はどれですか？', sound: '이치방 닌키노 쇼-힌와 도레데스카?', ko: '제일 인기 있는 상품이 뭐예요?' },
      { ja: '薬剤師さんはいますか？', sound: '야쿠자이시상와 이마스카?', ko: '약사님 계세요? (제1류 의약품 살 때)' },
      { ja: 'トイレはどこですか？', sound: '토이레와 도코데스카?', ko: '화장실 어디예요?' },
    ],
  },
  {
    title: '계산할 때',
    emoji: '💳',
    phrases: [
      { ja: '免税でお願いします。', sound: '멘제-데 오네가이시마스', ko: '면세로 해 주세요' },
      { ja: 'パスポートです。', sound: '파스포-토데스', ko: '여권이에요' },
      { ja: 'クーポンは使えますか？', sound: '쿠-퐁와 츠카에마스카?', ko: '쿠폰 쓸 수 있어요?' },
      { ja: 'カードで払います。', sound: '카-도데 하라이마스', ko: '카드로 낼게요' },
      { ja: '袋はいりません。', sound: '후쿠로와 이리마셍', ko: '봉투는 필요 없어요' },
      { ja: '袋をひとつください。', sound: '후쿠로오 히토츠 쿠다사이', ko: '봉투 하나 주세요' },
      { ja: '別々の袋に入れてください。', sound: '베츠베츠노 후쿠로니 이레테 쿠다사이', ko: '따로따로 담아 주세요 (선물용)' },
      { ja: 'レシートをください。', sound: '레시-토오 쿠다사이', ko: '영수증 주세요' },
    ],
  },
  {
    title: '말이 안 통할 때',
    emoji: '🙏',
    phrases: [
      { ja: '日本語がわかりません。', sound: '니홍고가 와카리마셍', ko: '일본어를 잘 몰라요' },
      { ja: '韓国語を話せる方はいますか？', sound: '캉코쿠고오 하나세루 카타와 이마스카?', ko: '한국어 하시는 분 계세요?' },
      { ja: 'もう一度お願いします。', sound: '모- 이치도 오네가이시마스', ko: '한 번만 더 말해 주세요' },
      { ja: 'ゆっくり話してください。', sound: '윳쿠리 하나시테 쿠다사이', ko: '천천히 말해 주세요' },
    ],
  },
];

/** 가격표·매대 표지판에 자주 나오는 말 */
export const PRICE_TAG_WORDS: { ja: string; sound: string; ko: string; tip?: string }[] = [
  { ja: '税込', sound: '제-코미', ko: '세금 포함 가격', tip: '계산대에서 실제로 내는 금액' },
  { ja: '税抜・本体価格', sound: '제-누키 · 혼타이카카쿠', ko: '세금 뺀 가격', tip: '면세 기준 5,000엔은 이 가격으로 계산' },
  { ja: '免税', sound: '멘제-', ko: '면세' },
  { ja: '驚安', sound: '쿄-야스', ko: '놀랄 만큼 싼 가격', tip: '돈키호테 가격표에 자주 보이는 말' },
  { ja: '激安', sound: '게키야스', ko: '초특가' },
  { ja: '半額', sound: '항가쿠', ko: '반값' },
  { ja: '割引', sound: '와리비키', ko: '할인' },
  { ja: '期間限定', sound: '키칸 겐테-', ko: '기간 한정' },
  { ja: '数量限定', sound: '스-료- 겐테-', ko: '수량 한정' },
  { ja: '新商品', sound: '신쇼-힌', ko: '신상품' },
  { ja: 'お一人様〇点限り', sound: '오히토리사마 ○텐 카기리', ko: '1인당 ○개까지만 구매 가능' },
  { ja: '第1類医薬品', sound: '다이이치루이 이야쿠힌', ko: '약사 설명이 필요한 약', tip: '약사가 있는 시간에만 살 수 있어요' },
  { ja: '第2類・第3類医薬品', sound: '다이니루이 · 다이산루이', ko: '직접 골라 살 수 있는 약' },
  { ja: '医薬部外品', sound: '이야쿠부가이힌', ko: '의약외품 (파스·크림 등)' },
  { ja: 'テスター', sound: '테스타-', ko: '테스터 (써 봐도 되는 제품)' },
  { ja: 'レジ', sound: '레지', ko: '계산대' },
];

export const DONKI_COUPON_URL = 'https://livejapan.com/public/operation/coupon/donki/en.html';

export const DONKI_TIPS: { emoji: string; title: string; body: string; link?: { label: string; url: string } }[] = [
  {
    emoji: '🎟️',
    title: '관광객 할인 쿠폰부터 챙기세요',
    body: '세전 1만 엔 이상 사면 최대 5%, 3만 엔 이상이면 최대 7% 할인돼요. 쿠폰 페이지에서 바코드를 띄워 결제 전에 여권과 함께 보여주면 되고, 캡처한 화면은 받지 않아요. 주류·담배·게임기 등은 할인에서 빠져요.',
    link: { label: '쿠폰 바코드 열기', url: DONKI_COUPON_URL },
  },
  {
    emoji: '🧾',
    title: '면세는 11월 1일부터 공항 환급',
    body: '같은 날 한 매장에서 세전 5,000엔 이상이면 면세 대상이에요. 2026년 11월 1일부터는 계산할 때 세금까지 내고, 출국할 때 공항에서 돌려받아요. 여권은 꼭 챙기고, 산 물건을 일본에서 뜯어 쓰면 환급받을 수 없어요.',
  },
  {
    emoji: '💊',
    title: '약은 표시를 보고 고르세요',
    body: "'第1類医薬品'은 약사 설명이 필요해서 약사가 있는 시간에만 살 수 있어요. 같은 약을 여러 개 사면 1인당 개수 제한이 걸릴 수 있어요.",
  },
  {
    emoji: '⏰',
    title: '저녁 관광 매장은 계산 줄이 길어요',
    body: '도톤보리·신주쿠처럼 관광객이 몰리는 매장은 저녁에 계산·면세 줄이 길어요. 시간이 빠듯하면 숙소 근처 매장을 쓰거나 이른 시간에 가세요. 영업시간은 매장마다 달라서 지도에서 꼭 확인하세요.',
  },
  {
    emoji: '🧳',
    title: '짐 쌀 때 액체류 주의',
    body: '선크림·토너 같은 액체·크림류는 기내 반입 용량 제한이 있어 부치는 짐에 넣는 게 편해요. 파스·과자처럼 부피 큰 건 매장에서 따로 봉투에 담아 달라고 하면 정리하기 쉬워요.',
  },
];

/** 일본어 음성 읽기 (기기에 일본어 음성이 없으면 false) */
export const speakJapanese = (text: string): boolean => {
  try {
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
    if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return false;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[○〇]/g, ''));
    u.lang = 'ja-JP';
    u.rate = 0.85;
    const voice = synth.getVoices().find(v => v.lang?.toLowerCase().startsWith('ja'));
    if (voice) u.voice = voice;
    synth.speak(u);
    return true;
  } catch {
    return false;
  }
};

export const googleMapsUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

/** 지도·쿠폰 같은 외부 페이지 열기 (앱에서는 인앱 브라우저) */
export const openExternal = async (url: string) => {
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (Capacitor.isNativePlatform()) {
      const { Browser } = await import('@capacitor/browser');
      await Browser.open({ url });
      return;
    }
  } catch { /* 웹에서는 새 탭 */ }
  window.open(url, '_blank', 'noopener,noreferrer');
};
