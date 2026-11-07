import { it, expect, vi, afterEach } from 'vitest';
import { attachProductImages, upgradeNaverThumbnail } from '../../api/_lib/productImages.js';
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
  askAiForJson.mockResolvedValue({ best: 0 });
  const rows = [{ id: 'discovery-1', name: '딸기 라떼', brand: '스타벅스', image: '' }];
  await attachProductImages(rows, options());
  expect(rows[0].image).toBe('');
});
it('상품 일치 검수를 통과한 사진만 연결한다', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => imageFetch()));
  askAiForJson.mockResolvedValue({ best: 1 });
  const rows = [{ id: 'discovery-1', name: '딸기 라떼', brand: '스타벅스', image: '' }];
  await attachProductImages(rows, options());
  expect(rows[0].image).toBe('https://example.com/product.jpg');
});
it('원본이 안 열리면 네이버 150px 썸네일 대신 같은 사진의 고화질 주소를 쓴다', async () => {
  const thumb = 'https://search.pstatic.net/common/?type=b150&src=http%3A%2F%2Fshop1.phinf.naver.net%2F20261005_78%2Fabc_JPEG%2F1.jpg';
  const hiRes = 'https://shop-phinf.pstatic.net/20261005_78/abc_JPEG/1.jpg?type=m1000_pd';
  searchNaver.mockResolvedValueOnce([{ link: 'https://blocked.example.com/1.jpg', thumbnail: thumb }]);
  vi.stubGlobal('fetch', vi.fn(async (url) => (url.includes('blocked') ? new Response('', { status: 403 }) : imageFetch())));
  askAiForJson.mockResolvedValue({ best: 1 });
  const rows = [{ id: 'seven-1', name: '감자스틱', brand: 'CJ', image: '' }];
  await attachProductImages(rows, options());
  expect(rows[0].image).toBe(hiRes);
  expect(upgradeNaverThumbnail('https://example.com/a.jpg')).toBeNull();
});
