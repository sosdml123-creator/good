import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
// @ts-expect-error — 서버리스 함수(JS)는 타입 선언이 없습니다.
import handler from '../../api/site-content.js';
import { smartMergeProducts, hasAdminEditDiff } from '../context/AppContext';
import { Product } from '../types';

const SYSTEM_ID = '__sinsangpick_system_banners__';
const SUPABASE_URL = 'https://db.test';

type Row = Record<string, any>;

// PostgREST 흉내: 테이블별 행을 메모리에 두고 필요한 쿼리만 처리
const createFakeDb = (tables: Record<string, Row[]>, options: { missingColumns?: string[] } = {}) => {
  const calls: { method: string; path: string; body?: any }[] = [];

  const matches = (row: Row, params: URLSearchParams) => {
    for (const [key, raw] of params) {
      if (['select', 'order', 'limit', 'on_conflict'].includes(key)) continue;
      if (raw.startsWith('eq.')) { if (String(row[key]) !== raw.slice(3)) return false; }
      else if (raw.startsWith('neq.')) { if (String(row[key]) === raw.slice(4)) return false; }
      else if (raw.startsWith('in.(')) {
        const ids = raw.slice(4, -1).split(',').map(v => decodeURIComponent(v.replace(/"/g, '')));
        if (!ids.includes(String(row[key]))) return false;
      } else if (raw === 'is.true') { if (row[key] !== true) return false; }
    }
    return true;
  };

  const respond = (status: number, body: unknown) => ({
    ok: status >= 200 && status < 300,
    status,
    text: async () => (body === null ? '' : JSON.stringify(body)),
    json: async () => body,
  });

  const fetchMock = vi.fn(async (url: string, init: any = {}) => {
    const method = init.method || 'GET';
    const u = new URL(url);

    if (u.pathname === '/auth/v1/user') {
      const token = String(init.headers.Authorization).replace('Bearer ', '');
      return token === 'admin-token' || token === 'user-token'
        ? respond(200, { id: token === 'admin-token' ? 'admin-1' : 'user-1' })
        : respond(401, { message: 'bad token' });
    }
    if (u.pathname.startsWith('/auth/v1/admin/users/')) {
      calls.push({ method, path: u.pathname });
      return respond(200, {});
    }

    const table = u.pathname.replace('/rest/v1/', '');
    const body = init.body ? JSON.parse(init.body) : undefined;
    calls.push({ method, path: table + u.search, body });
    if (!(table in tables)) return respond(404, { code: 'PGRST205', message: `Could not find the table 'public.${table}'` });

    if (method === 'GET') return respond(200, tables[table].filter(row => matches(row, u.searchParams)));
    if (method === 'DELETE') {
      tables[table] = tables[table].filter(row => !matches(row, u.searchParams));
      return respond(204, null);
    }
    if (method === 'PATCH') {
      tables[table].filter(row => matches(row, u.searchParams)).forEach(row => Object.assign(row, body));
      return respond(204, null);
    }
    // POST = upsert
    const key = u.searchParams.get('on_conflict') || 'id';
    for (const incoming of Array.isArray(body) ? body : [body]) {
      const unknown = (options.missingColumns || []).find(column => column in incoming);
      if (unknown) return respond(400, { code: 'PGRST204', message: `Could not find the '${unknown}' column` });
      const existing = tables[table].find(row => row[key] === incoming[key]);
      if (existing) Object.assign(existing, incoming);
      else tables[table].push({ ...incoming });
    }
    return respond(201, null);
  });

  return { fetchMock, calls, tables };
};

const call = async (body: Row | null, token = 'admin-token', method = 'POST') => {
  const res: any = {
    statusCode: 200,
    body: null,
    setHeader: () => {},
    status(code: number) { this.statusCode = code; return this; },
    json(payload: unknown) { this.body = payload; return this; },
    end() { return this; },
  };
  await handler({ method, headers: token ? { authorization: `Bearer ${token}` } : {}, body }, res);
  return res as { statusCode: number; body: any };
};

const systemRow = (nutrition: Row) => ({ id: SYSTEM_ID, name: 'SYSTEM_SETTINGS_CONTAINER', nutrition });

describe('/api/site-content 관리자 저장', () => {
  beforeEach(() => {
    process.env.VITE_SUPABASE_URL = SUPABASE_URL;
    process.env.VITE_SUPABASE_ANON_KEY = 'anon';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service';
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const setup = (tables: Record<string, Row[]>, options?: { missingColumns?: string[] }) => {
    const db = createFakeDb({
      profiles: [{ id: 'admin-1', is_admin: true, points: 0 }, { id: 'user-1', is_admin: false, points: 50 }],
      ...tables,
    }, options);
    vi.stubGlobal('fetch', db.fetchMock);
    return db;
  };
  const nutritionOf = (db: ReturnType<typeof createFakeDb>) => db.tables.products.find(r => r.id === SYSTEM_ID)!.nutrition;

  it('관리자가 아니면 저장을 거부한다', async () => {
    setup({ products: [] });
    expect((await call({ banners: [] }, 'user-token')).statusCode).toBe(403);
    expect((await call({ banners: [] }, '')).statusCode).toBe(401);
  });

  it('넘긴 설정만 바꾸고 나머지 설정은 그대로 둔다', async () => {
    const db = setup({ products: [systemRow({ banners: [{ id: 'b1' }], homeSections: [{ id: 's1' }], deletedProductIds: ['old'] })] });
    const res = await call({ brands: [{ id: 'brand-1', name: '농심' }], deletedProductIds: ['p9'] });

    expect(res.body.success).toBe(true);
    const saved = nutritionOf(db);
    expect(saved.brands).toEqual([{ id: 'brand-1', name: '농심' }]);
    expect(saved.banners).toEqual([{ id: 'b1' }]);
    expect(saved.homeSections).toEqual([{ id: 's1' }]);
    expect(saved.deletedProductIds).toEqual(['old', 'p9']);
  });

  it('DB 저장이 실패하면 성공이라고 응답하지 않는다', async () => {
    const db = setup({ products: [systemRow({})] });
    db.fetchMock.mockImplementationOnce(db.fetchMock.getMockImplementation()!) // auth
      .mockImplementationOnce(db.fetchMock.getMockImplementation()!) // profile
      .mockImplementationOnce(db.fetchMock.getMockImplementation()!) // read system record
      .mockImplementationOnce(async () => ({ ok: false, status: 500, text: async () => '{"message":"boom"}' }) as any);

    const res = await call({ banners: [{ id: 'b1' }] });
    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });

  it('상품 수정은 전체 항목을 저장하고 숫자 컬럼을 정수로 맞춘다', async () => {
    const db = setup({ products: [systemRow({}), { id: 'p1', name: '옛 이름', price: 1000, overall_rating: 4.5 }] });
    const res = await call({
      action: 'upsert_products',
      products: [{ id: 'p1', name: '새 이름', brand: '농심', category: '과자', price: '1500.4', discountRate: 10, isHot: true, ingredients: '밀가루', storageMethod: '실온' }],
    });

    expect(res.body.success).toBe(true);
    const saved = db.tables.products.find(r => r.id === 'p1')!;
    expect(saved).toMatchObject({ name: '새 이름', price: 1500, discount_rate: 10, is_hot: true, ingredients: '밀가루', storage_method: '실온' });
    expect(saved.overall_rating).toBe(4.5); // 평점은 건드리지 않음
  });

  it('상세 컬럼이 아직 없는 DB 에서는 기본 컬럼만 저장하고 partial 로 알린다', async () => {
    const db = setup({ products: [systemRow({})] }, { missingColumns: ['ingredients'] });
    const res = await call({ action: 'upsert_products', products: [{ id: 'p2', name: '신상', brand: 'CU', category: '과자', image: '', price: 2000, ingredients: '설탕' }] });

    expect(res.body).toMatchObject({ success: true, partial: true });
    expect(db.tables.products.find(r => r.id === 'p2')).toMatchObject({ name: '신상', price: 2000 });
  });

  it('상품 삭제는 행을 지우고 삭제 목록에도 남긴다', async () => {
    const db = setup({ products: [systemRow({ deletedProductIds: [] }), { id: 'p1', name: 'a' }, { id: 'p2', name: 'b' }] });
    await call({ action: 'delete_products', ids: ['p1'] });

    expect(db.tables.products.map(r => r.id)).toEqual([SYSTEM_ID, 'p2']);
    expect(nutritionOf(db).deletedProductIds).toEqual(['p1']);
  });

  it('포인트는 서버의 현재 잔액 기준으로 계산하고 0 아래로 내려가지 않는다', async () => {
    const db = setup({ products: [], point_transactions: [] });
    const granted = await call({ action: 'adjust_points', ids: ['user-1'], delta: 100, reason: '이벤트' });
    expect(granted.body.balances).toEqual([{ userId: 'user-1', before: 50, after: 150 }]);

    const revoked = await call({ action: 'adjust_points', ids: ['user-1'], delta: -500, reason: '회수' });
    expect(revoked.body.balances).toEqual([{ userId: 'user-1', before: 150, after: 0 }]);
    expect(db.tables.profiles.find(r => r.id === 'user-1')!.points).toBe(0);
    expect(db.tables.point_transactions.map(t => t.amount)).toEqual([100, -150]);
  });

  it('회원 삭제는 관리자 계정을 막고, 일반 회원은 글·프로필·로그인 계정까지 지운다', async () => {
    const db = setup({ products: [], reviews: [{ id: 'r1', user_id: 'user-1' }], community_posts: [] });

    expect((await call({ action: 'delete_users', ids: ['admin-1'] })).statusCode).toBe(400);
    expect(db.tables.profiles).toHaveLength(2);

    const res = await call({ action: 'delete_users', ids: ['user-1'] });
    expect(res.body.success).toBe(true);
    expect(db.tables.profiles.map(r => r.id)).toEqual(['admin-1']);
    expect(db.tables.reviews).toHaveLength(0);
    expect(db.calls.some(c => c.method === 'DELETE' && c.path === '/auth/v1/admin/users/user-1')).toBe(true);
  });

  it('제재·신고 테이블이 없으면 마이그레이션 안내와 함께 실패한다', async () => {
    setup({ products: [] });
    const res = await call({ action: 'set_user_status', ids: ['user-1'], status: 'warned', warningDelta: 1 });
    expect(res.statusCode).toBe(503);
    expect(res.body.code).toBe('TABLE_MISSING');

    const list = await call({ action: 'list_moderation' });
    expect(list.body).toMatchObject({ success: true, reports: null, sanctions: null });
  });

  it('신고 처리 결과를 저장하고 경고 횟수를 누적한다', async () => {
    const db = setup({
      products: [],
      reports: [{ id: 'rep-1', status: 'pending', data: { id: 'rep-1', reason: 'spam', status: 'pending' } }],
      user_sanctions: [{ user_id: 'user-1', status: 'warned', warning_count: 1 }],
    });

    await call({ action: 'update_report', id: 'rep-1', updates: { status: 'resolved', actionTaken: 'warning' } });
    expect(db.tables.reports[0]).toMatchObject({ status: 'resolved', data: { reason: 'spam', actionTaken: 'warning' } });

    await call({ action: 'set_user_status', ids: ['user-1'], status: 'warned', warningDelta: 1, reason: '도배' });
    expect(db.tables.user_sanctions[0]).toMatchObject({ status: 'warned', warning_count: 2, reason: '도배' });

    await call({ action: 'set_user_status', ids: ['user-1'], status: 'active' });
    expect(db.tables.user_sanctions[0]).toMatchObject({ status: 'active', warning_count: 0, suspended_until: null });
  });
});

describe('상품 병합 — 서버 값 기준', () => {
  const product = (overrides: Partial<Product>): Product => ({
    id: 'p1',
    name: '상품',
    brand: '브랜드',
    category: '과자' as Product['category'],
    image: '',
    releaseDate: '',
    price: 1000,
    overallRating: 0,
    ratingCount: 0,
    detailedRating: { taste: 0, value: 0, portion: 0, repurchase: 0 },
    ...overrides,
  });

  it('서버에 있는 상품은 기기에 남은 예전 값이 아니라 서버 값을 쓴다', () => {
    const stored = [product({ id: 'p1', name: '기기에 남은 예전 이름', price: 900 }), product({ id: 'local-only', name: '저장 안 된 상품' })];
    const server = [product({ id: 'p1', name: '서버에서 수정한 이름', price: 1200 })];

    const merged = smartMergeProducts(stored, server, [], new Set(['p1']));
    expect(merged.map(p => p.id)).toEqual(['p1']);
    expect(merged[0]).toMatchObject({ name: '서버에서 수정한 이름', price: 1200 });
  });

  it('서버 기준 모드가 아니면 기존처럼 기기 값을 유지한다 (관리자 수정분 올리기 전)', () => {
    const stored = [product({ id: 'p1', name: '관리자가 고친 이름' }), product({ id: 'local-only' })];
    const merged = smartMergeProducts(stored, [product({ id: 'p1', name: '서버 이름' })], []);
    expect(merged.map(p => p.id)).toEqual(['local-only', 'p1']);
    expect(merged[1].name).toBe('관리자가 고친 이름');
  });

  it('관리자가 고칠 수 있는 항목이 달라졌을 때만 수정분으로 본다', () => {
    const base = product({ discountRate: 0, stores: [], isHot: false });
    expect(hasAdminEditDiff(product({ discountRate: undefined, stores: undefined, isHot: undefined, overallRating: 4.8 }), base)).toBe(false);
    expect(hasAdminEditDiff(product({ price: 1500 }), base)).toBe(true);
    expect(hasAdminEditDiff(product({ stores: ['CU'] }), base)).toBe(true);
    // DB(JSONB)가 키 순서를 바꿔 돌려줘도 같은 값으로 본다
    const nutritionA = { calories: 100, sodium: 5 } as unknown as Product['nutrition'];
    const nutritionB = { sodium: 5, calories: 100 } as unknown as Product['nutrition'];
    expect(hasAdminEditDiff(product({ nutrition: nutritionA }), product({ ...base, nutrition: nutritionB }))).toBe(false);
  });
});
