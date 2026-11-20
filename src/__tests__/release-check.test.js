import { it, expect, vi, afterEach } from 'vitest';
import { splitAlreadyReleased, earliestMention } from '../../api/_lib/releaseCheck.js';
import { searchNaver } from '../../api/_lib/intakeSearch.js';

vi.mock('../../api/_lib/intakeSearch.js', () => ({ searchNaver: vi.fn(), searchConfigured: () => true }));
afterEach(() => vi.clearAllMocks());

const now = Date.parse('2026-11-20T00:00:00+09:00');
const news = (title, pubDate) => ({ title, description: '', pubDate });

it('같은 브랜드·상품명이 함께 나온 가장 오래된 글을 찾는다', () => {
  const items = [
    news('성심당 <b>홍시데니쉬</b> 다시 출시', 'Mon, 17 Nov 2026 09:00:00 +0900'),
    news('성심당 홍시 데니쉬 올해도', 'Tue, 05 Nov 2024 09:00:00 +0900'),
    news('다른빵집 홍시데니쉬', 'Mon, 01 Jan 2024 09:00:00 +0900'),
  ];
  expect(new Date(earliestMention(items, 'news', { name: '홍시데니쉬', brand: '성심당' })).getFullYear()).toBe(2024);
  expect(new Date(earliestMention(items, 'news', { name: '홍시데니쉬', brand: '성심당' })).getMonth()).toBe(10);
});

it('예전에 언급된 제품은 이미 나온 제품으로 분류한다', async () => {
  searchNaver.mockImplementation(async (type, query) => (query.includes('홍시')
    ? (type === 'news' ? [news('성심당 홍시데니쉬 출시', 'Tue, 05 Nov 2024 09:00:00 +0900')] : [])
    : [news('빽다방 시그니처 딥크림라떼 출시', 'Wed, 19 Nov 2026 09:00:00 +0900')]));
  const rows = [{ id: 'a', name: '홍시데니쉬', brand: '성심당' }, { id: 'b', name: '시그니처 딥크림라떼', brand: '빽다방' }];
  const result = await splitAlreadyReleased(rows, { now });
  expect(result.old.map(r => r.id)).toEqual(['a']);
  expect(result.old[0].first_mentioned).toBe('2024-11-05');
  expect(result.fresh.map(r => r.id)).toEqual(['b']);
});

it('검색이 실패하면 신제품 후보로 남긴다', async () => {
  searchNaver.mockRejectedValue(new Error('HTTP 500'));
  const result = await splitAlreadyReleased([{ id: 'a', name: '딸기 라떼', brand: '스타벅스' }], { now });
  expect(result.fresh).toHaveLength(1);
  expect(result.old).toHaveLength(0);
});

it('시간이 부족하면 확인하지 않은 후보는 다음 수집으로 미룬다', async () => {
  const result = await splitAlreadyReleased([{ id: 'a', name: '딸기 라떼', brand: '스타벅스' }], { now, deadline: Date.now() - 1 });
  expect(result.deferred).toHaveLength(1);
  expect(searchNaver).not.toHaveBeenCalled();
});
