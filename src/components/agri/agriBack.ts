/**
 * Android 하드웨어 뒤로가기용 연결고리.
 * 농수산물 화면이 열려 있으면 품목·후기 상세를 먼저 한 단계씩 닫고(true 반환),
 * 더 닫을 화면이 없으면 false 를 돌려 신상픽 홈으로 나가게 합니다.
 */
export const agriBack: { current: (() => boolean) | null } = { current: null };
