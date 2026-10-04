// src/components/admin/instagram/theme.ts
// 신상픽 인스타그램 카드뉴스 공통 디자인 토큰 (Design Tokens)

export const INSTA_THEME = {
  colors: {
    primaryYellow: '#FFD60A', // 신상픽 시그니처 옐로우
    lightYellow: '#FFFBE6',
    softYellow: '#FFF9D2',
    accentYellow: '#FFE600',
    textMain: '#111111',       // 메인 검정 텍스트
    textSub: '#555555',        // 서브 설명 텍스트
    textMuted: '#888888',      // 부가 설명/회색 텍스트
    textLight: '#AAAAAA',
    bgWhite: '#FFFFFF',        // 기본 카드 배경
    bgCardMuted: '#F8F9FA',    // 체크리스트 등 보조 박스 배경
    borderLight: '#EEEEEE',
    borderMuted: '#E5E7EB',
    starActive: '#FFB800',     // 별점 채움 색상
    starInactive: '#E2E8F0',   // 별점 빈 색상
    blackBadge: '#18181B',
  },
  fonts: {
    body: 'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    handwritingGaegu: '"Gaegu", cursive',
    handwritingNanum: '"Nanum Pen Script", cursive',
  },
  aspectRatios: {
    '1:1': {
      label: '피드 정방형 1:1 (1080 × 1080)',
      ratio: '1/1',
      baseWidth: 540,
      baseHeight: 540,
      exportWidth: 1080,
      exportHeight: 1080,
    },
    '4:5': {
      label: '피드 세로형 4:5 (1080 × 1350)',
      ratio: '4/5',
      baseWidth: 540,
      baseHeight: 675,
      exportWidth: 1080,
      exportHeight: 1350,
    },
    '9:16': {
      label: '릴스 / 스토리 9:16 (1080 × 1920)',
      ratio: '9/16',
      baseWidth: 540,
      baseHeight: 960,
      exportWidth: 1080,
      exportHeight: 1920,
    },
  },
  cardRadius: '28px',
  badgeRadius: '9999px',
} as const;

export type AspectRatioType = '1:1' | '4:5' | '9:16';
