import { it, expect, vi, afterEach } from 'vitest';
import { attachProductImages } from '../../api/_lib/productImages.js';
import { askAiForJson } from '../../api/_lib/aiJson.js';
import { searchNaver } from '../../api/_lib/intakeSearch.js';
vi.mock('../../api/_lib/aiJson.js', () => ({ askAiForJson: vi.fn() }));
vi.mock('../../api/_lib/intakeSearch.js', () => ({ searchNaver: vi.fn(async () => [{ link: 'https://example.com/product.jpg' }]) }));
afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); });
const options = () => ({ deadline: Date.now() + 30000, engine: { provider: 'test' } });
const imageFetch = () => new Response(new Uint8Array([255, 216, 255]), { headers: { 'content-type': 'image/jpeg' } });

it('공식 이미지의 404를 정상 사진으로 저장하지 않는다', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 404 })));
  const rows = [{ id: 'starbucks-1', image: 'https://example.com/broken.jpg' }];
  await attachProductImages(rows, { ...options(), engine: null });
  expect(rows[0].image).toBe('');
});
it('정상 공식 제품 이미지는 AI 없이도 사용한다', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => imageFetch()));
  const rows = [{ id: 'mega-1', image: 'https://example.com/official.jpg' }];
  await attachProductImages(rows, { ...options(), engine: null });
  expect(rows[0].image).toContain('official.jpg');
  expect(askAiForJson).not.toHaveBeenCalled();
});
it('AI 키가 없으면 검수되지 않은 뉴스·검색 이미지를 승인 요청에 쓰지 않는다', async () => {
  const rows = [{ id: 'discovery-1', image: 'https://example.com/person.jpg' }];
  await attachProductImages(rows, { ...options(), engine: null });
  expect(rows[0].image).toBe('');
  expect(searchNaver).not.toHaveBeenCalled();
});
it('다른 상품·인물 사진을 거부한다', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => imageFetch()));
  askAiForJson.mockResolvedValue({ product: true, person: true });
  const rows = [{ id: 'discovery-1', name: '딸기 라떼', brand: '스타벅스', image: '' }];
  await attachProductImages(rows, options());
  expect(rows[0].image).toBe('');
});
it('상품 일치 검수를 통과한 사진만 연결한다', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => imageFetch()));
  askAiForJson.mockResolvedValue({ product: true, person: false });
  const rows = [{ id: 'discovery-1', name: '딸기 라떼', brand: '스타벅스', image: '' }];
  await attachProductImages(rows, options());
  expect(rows[0].image).toBe('https://example.com/product.jpg');
});
