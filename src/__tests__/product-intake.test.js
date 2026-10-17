import { describe, it, expect, vi, afterEach } from 'vitest';
import { parseStarbucksProducts, parseMegaProducts, parsePaikProducts } from '../../api/_lib/cafeCrawlers.js';
import { normalizeArticle, candidateFromEvidence, searchNaver } from '../../api/_lib/intakeSearch.js';
import handler, { insertNewRows } from '../../api/pending-products.js';

vi.mock('../../api/_lib/productImages.js', () => ({ attachProductImages: vi.fn(async () => ({ aiErrors: 0 })) }));
vi.mock('../../api/_lib/adminAuth.js', () => ({ verifyAdminRequest: vi.fn(async () => ({ ok: true })) }));
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe('공식 신메뉴 수집', () => {
  it('스타벅스 NEW 상품만 가져오며 출시일을 수집일로 만들지 않는다', () => {
    const rows = parseStarbucksProducts({ list: [
      { newicon: 'Y', product_NM: '블랙 라떼', product_CD: '123', file_PATH: '/menu.jpg', kcal: '120.5' },
      { newicon: 'N', product_NM: '아메리카노', file_PATH: '/old.jpg' },
      { newicon: 'Y', product_NM: '텀블러', file_PATH: '/md.jpg' },
    ] }, 'drink_list.do');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ id: 'starbucks-123', release_date: null, calories: 121, category: '음료' });
    expect(rows[0].source_url).toContain('drink_view.do?product_cd=123');
  });
  it('메가커피 신메뉴 카드의 사진만 연결하고 이벤트 배너를 제외한다', () => {
    const rows = parseMegaProducts('신메뉴 <div class="cont_gallery_list_box"><img src="https://img.79plus.co.kr/upload/menu/latte.jpg"><b>하우스밀크 라떼</b></div><div class="cont_gallery_list_box"><img src="https://img.79plus.co.kr/banner.jpg"><b>이벤트</b></div>');
    expect(rows.map(r => r.name)).toEqual(['하우스밀크 라떼']);
  });
  it('빽다방 변경된 슬라이드 구조를 읽는다', () => {
    const rows = parsePaikProducts('new_menu_slider <div class="swiper-slide"><img src="https://paikdabang.com/tea.png"><p class="best_tit">호지차라떼 (HOT)</p></div>');
    expect(rows[0]).toMatchObject({ name: '호지차라떼 (HOT)', brand: '빽다방', image: 'https://paikdabang.com/tea.png' });
  });
  it('사이트 구조 변경을 빈 성공으로 숨기지 않는다', () => {
    expect(() => parseMegaProducts('<html>점검중</html>')).toThrow();
    expect(() => parsePaikProducts('<html>점검중</html>')).toThrow();
    expect(() => parseStarbucksProducts({}, 'drink_list.do')).toThrow();
  });
});

describe('뉴스·블로그 근거 확인', () => {
  const now = Date.parse('2026-10-17T00:00:00Z');
  const article = { title: '스타벅스 블랙 라떼 신메뉴 출시', description: '새로운 블랙 라떼를 선보였다.', link: 'https://example.com/post', postdate: '20261016' };
  it('블로그 날짜를 읽고 오래된 글·날짜 없는 글을 제외한다', () => {
    expect(normalizeArticle(article, 'blog', now)).not.toBeNull();
    expect(normalizeArticle({ ...article, postdate: '20250101' }, 'blog', now)).toBeNull();
    expect(normalizeArticle({ ...article, postdate: '' }, 'blog', now)).toBeNull();
  });
  it('원문에 없는 상품명·브랜드와 비식품을 거부한다', () => {
    const evidence = normalizeArticle(article, 'blog', now);
    expect(candidateFromEvidence(evidence, { name: '블랙 라떼', brand: '스타벅스' }, 'blog')).toMatchObject({ release_date: null, price: 0 });
    expect(candidateFromEvidence(evidence, { name: '딸기 라떼', brand: '스타벅스' }, 'blog')).toBeNull();
    expect(candidateFromEvidence(evidence, { name: '블랙 라떼', brand: '메가MGC커피' }, 'blog')).toBeNull();
  });
  it('API HUB 실패 시 별도로 설정된 OpenAPI 키로 재시도한다', async () => {
    for (const key of ['NAVER_CLIENT_ID', 'NAVER_CLIENT_SECRET', 'NAVER_OPENAPI_CLIENT_ID', 'NAVER_OPENAPI_CLIENT_SECRET']) vi.stubEnv(key, 'test');
    const fetch = vi.fn().mockResolvedValueOnce(new Response('', { status: 403 })).mockResolvedValueOnce(new Response('{"items":[]}'));
    vi.stubGlobal('fetch', fetch);
    expect(await searchNaver('blog', '스타벅스 신메뉴')).toEqual([]);
    expect(fetch.mock.calls[1][0]).toContain('openapi.naver.com/v1/search/blog');
  });
});

describe('대기함 저장 회귀', () => {
  const rows = [
    { id: 'seven-1', name: '딸기 라떼', brand: '세븐일레븐', image: 'https://example.com/1.jpg', source_url: 'https://example.com/list' },
    { id: 'seven-2', name: '초코 라떼', brand: '세븐일레븐', image: 'https://example.com/2.jpg', source_url: 'https://example.com/list' },
  ];
  it('같은 출처의 여러 제품을 저장하면서 원문 링크를 보존한다', async () => {
    let saved;
    const db = vi.fn(async (path, init) => {
      if (init) { saved = JSON.parse(init.body); return saved; }
      return [];
    });
    expect(await insertNewRows(db, rows, {})).toMatchObject({ inserted: 2 });
    expect(new Set(saved.map(r => r.source_url)).size).toBe(2);
    expect(saved.every(r => r.source_url.split('#')[0] === 'https://example.com/list')).toBe(true);
  });
  it('같은 이름의 다른 브랜드는 보존하고 기존 이력은 중복 제외한다', async () => {
    const db = vi.fn(async (path, init) => init ? JSON.parse(init.body) : path.startsWith('products?') ? [{ name: '딸기 라떼', brand: '스타벅스' }] : [{ ...rows[1] }]);
    expect(await insertNewRows(db, rows, {})).toMatchObject({ inserted: 1, duplicates: 1 });
  });
  it('동시 수집에서 DB가 실제 삽입한 건수만 보고한다', async () => {
    const db = vi.fn(async (path, init) => init ? [] : []);
    expect(await insertNewRows(db, rows, {})).toMatchObject({ inserted: 0, duplicates: 2 });
  });
  it('1000개 이후의 이력도 조회하여 중복 수집하지 않는다', async () => {
    const db = vi.fn(async (path, init) => {
      if (init) return JSON.parse(init.body);
      if (path.startsWith('products?')) return [];
      return path.includes('offset=0') ? Array.from({ length: 1000 }, (_, i) => ({ id: `old-${i}`, name: `과자${i}`, brand: 'CU' })) : [rows[0]];
    });
    expect(await insertNewRows(db, [rows[0]], {})).toMatchObject({ inserted: 0, duplicates: 1 });
  });
});

it('승인 재시도 시 동일 상품 ID를 사용하고 기존 제품 평점을 덮어쓰지 않는다', async () => {
  vi.stubEnv('SUPABASE_URL', 'https://database.example');
  vi.stubEnv('VITE_SUPABASE_URL', '');
  vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'test');
  const writes = [];
  const pending = { id: 'cu-123', name: '새 과자', image: 'https://example.com/a.jpg', brand: 'CU', category: '과자' };
  vi.stubGlobal('fetch', vi.fn(async (url, init) => {
    if (!init.method) return new Response(JSON.stringify([pending]));
    writes.push({ url, ...init });
    return new Response('');
  }));
  const response = () => ({ setHeader: vi.fn(), status: vi.fn().mockReturnThis(), json: vi.fn(), end: vi.fn() });
  for (const productId of ['random-1', 'random-2']) {
    const res = response();
    await handler({ method: 'POST', headers: {}, body: { action: 'approve', items: [{ pendingId: pending.id, productId }] } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, approved: [{ pendingId: pending.id, productId: 'prod-intake-cu-123' }] });
  }
  const inserts = writes.filter(w => w.method === 'POST');
  expect(inserts).toHaveLength(2);
  expect(inserts.every(w => w.headers.Prefer.includes('ignore-duplicates'))).toBe(true);
  expect(JSON.parse(inserts[0].body)[0].id).toBe(JSON.parse(inserts[1].body)[0].id);
});
