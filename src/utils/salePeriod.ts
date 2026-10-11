import { SalePromotionItem } from '../types';

const kstToday = (): string => new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];
const pad = (n: string | number) => String(n).padStart(2, '0');

/**
 * 행사 종료일(YYYY-MM-DD). endDate 가 없는 수동 등록 행사는 period("10.01 ~ 10.31")의 끝 날짜로 추정하고,
 * 날짜를 알 수 없으면('상시' 등) null 을 돌려 만료시키지 않습니다. (서버 api/_lib/saleCrawlers.js 와 같은 규칙)
 */
export function getSaleEndDate(item: SalePromotionItem, today = kstToday()): string | null {
  if (/^\d{4}-\d{2}-\d{2}$/.test(item.endDate || '')) return item.endDate as string;
  const tail = String(item.period || '').split('~').pop() || '';
  const m = tail.match(/(?:(\d{4})[.\-/]\s*)?(\d{1,2})[.\-/]\s*(\d{1,2})/);
  if (!m) return null;
  if (m[1]) return `${m[1]}-${pad(m[2])}-${pad(m[3])}`;
  // 연도가 없으면 작년·올해·내년 중 오늘과 가장 가까운 날짜로 봅니다 (연말·연초 행사 대응).
  const thisYear = Number(today.slice(0, 4));
  return [thisYear - 1, thisYear, thisYear + 1]
    .map((year) => `${year}-${pad(m[2])}-${pad(m[3])}`)
    .sort((a, b) => Math.abs(Date.parse(a) - Date.parse(today)) - Math.abs(Date.parse(b) - Date.parse(today)))[0];
}

/** 종료일이 지난 행사를 빼고, 남은 기간(D-day)을 오늘 기준으로 다시 계산해 돌려줍니다. */
export function getActiveSalePromotions(items: SalePromotionItem[], today = kstToday()): SalePromotionItem[] {
  const active: SalePromotionItem[] = [];
  for (const item of items) {
    const endDate = getSaleEndDate(item, today);
    if (!endDate) {
      active.push(item);
      continue;
    }
    if (endDate < today) continue;
    const daysLeft = Math.round((Date.parse(endDate) - Date.parse(today)) / 86400000);
    const dDay = daysLeft === 0 ? '오늘 마감' : daysLeft <= 3 ? `D-${daysLeft} 마감임박` : `D-${daysLeft}`;
    active.push({ ...item, dDay });
  }
  return active;
}
