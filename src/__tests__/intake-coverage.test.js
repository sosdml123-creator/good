import { describe, it, expect } from 'vitest';
import { INTAKE_CATALOG, discoveryQueries, canonicalIntakeBrand } from '../../api/_lib/intakeCatalog.js';
import { candidateFromEvidence } from '../../api/_lib/intakeSearch.js';
import { parseEdiyaProducts } from '../../api/_lib/cafeCrawlers.js';
import { parseOfficialPage, officialCandidate, officialHostAllowed } from '../../api/_lib/officialIntake.js';

describe('식품 판매처 수집 범위', () => {
  it('요청한 판매처를 기본 검색과 공식 페이지 수집에 포함한다', () => {
    for (const brand of ['이마트', '롯데마트', '이디야커피', '동서식품', '성심당', '한정선']) {
      const source = INTAKE_CATALOG.find(s => s.brand === brand);
      expect(source?.officialUrls.length).toBeGreaterThan(0);
      expect(discoveryQueries().some(q => q.startsWith(brand))).toBe(true);
    }
    expect(INTAKE_CATALOG.length).toBeGreaterThan(150);
    expect(new Set(INTAKE_CATALOG.map(s => s.brand)).size).toBe(INTAKE_CATALOG.length);
  });
  it('기본 목록에 없는 가게도 원문의 브랜드와 출시 근거로 수집한다', () => {
    const article = { title: '달빛제과가 밤크림 모찌 신메뉴 출시', summary: '지역 디저트 가게 달빛제과의 새 메뉴', link: 'https://example.com/news' };
    const candidate = { name: '밤크림 모찌', brand: '달빛제과', kind: 'restaurant', releaseEvidence: article.title };
    expect(candidateFromEvidence(article, candidate, 'news')).toMatchObject({ brand: '달빛제과', name: '밤크림 모찌', stores: ['달빛제과'] });
    expect(candidateFromEvidence(article, { ...candidate, releaseEvidence: '출시' }, 'news')).toBeNull();
    expect(candidateFromEvidence(article, { ...candidate, brand: '없는가게' }, 'news')).toBeNull();
  });
  it('기존 한정선·성심당·동서식품 후보가 브랜드 제한 때문에 버려지지 않는다', () => {
    for (const brand of ['한정선', '성심당', '동서식품']) {
      expect(candidateFromEvidence({ title: `${brand} 밤크림 모찌 신제품 출시`, summary: '', link: 'https://example.com' },
        { brand, name: '밤크림 모찌' }, 'news')).not.toBeNull();
    }
  });
  it('시간 제한에도 검색 순서가 순환하고 입력한 임의 브랜드는 그대로 검색한다', () => {
    const a = discoveryQueries('', 0), b = discoveryQueries('', 3600000);
    expect(a).not.toEqual(b);
    expect([...a].sort()).toEqual([...b].sort());
    expect(discoveryQueries('새동네카페')).toEqual(['새동네카페']);
    expect(canonicalIntakeBrand('이디아')).toBe('이디야커피');
    expect(canonicalIntakeBrand('메가커피')).toBe('메가MGC커피');
  });
});

it('이디야 NEW 아이콘 대신 상품 사진을 읽고 일반 메뉴는 제외한다', () => {
  const rows = parseEdiyaProducts(`<li><a onclick="show_slide_detail('1317')"><span class="new_icon"><img src="/images/new_icon.png" alt="new"/></span><img src="/files/menu/drink.png" alt="오트 콜드브루"/></a></li>
    <li><a onclick="show_slide_detail('1')"><img src="/files/menu/old.png" alt="아메리카노"/></a></li>`);
  expect(rows).toHaveLength(1);
  expect(rows[0].image).toBe('https://www.ediya.com/files/menu/drink.png');
});

describe('공식 뉴스·상품 페이지 탐색', () => {
  const source = { brand: '한정선', kind: 'restaurant', officialUrls: ['https://hanjungsun.co.kr/product'] };
  it('외부·로그인 링크를 제외하고 출시 상세 링크를 우선한다', () => {
    const page = parseOfficialPage('<title>한정선</title><a href="/news/1">밤크림 모찌 신제품 출시</a><a href="https://evil.example/news">신메뉴</a><a href="/login">신메뉴</a><img><img src="/mochi.jpg" alt="밤크림 모찌">', source.officialUrls[0], source);
    expect(page.links).toEqual(['https://hanjungsun.co.kr/news/1']);
    expect(page.images).toEqual([{ url: 'https://hanjungsun.co.kr/mochi.jpg', alt: '밤크림 모찌' }]);
    expect(officialHostAllowed('https://hanjungsun.co.kr.evil.example/', source)).toBe(false);
  });
  it('이름·출시 근거·최근 날짜가 실제 본문에 있는 후보만 허용한다', () => {
    const page = { url: 'https://hanjungsun.co.kr/news/1', title: '신제품 소식', text: '2026.10.16\n밤크림 모찌 신제품 출시', images: [{ url: 'https://hanjungsun.co.kr/mochi.jpg' }] };
    const candidate = { name: '밤크림 모찌', food: true, releaseEvidence: '밤크림 모찌 신제품 출시', dateEvidence: '2026.10.16', imageIndex: 0 };
    const now = Date.parse('2026-10-17T00:00:00Z');
    expect(officialCandidate(page, candidate, source, now)).toMatchObject({ name: '밤크림 모찌', image: page.images[0].url });
    expect(officialCandidate(page, { ...candidate, name: '가짜 모찌' }, source, now)).toBeNull();
    expect(officialCandidate(page, { ...candidate, dateEvidence: '2026.10.17' }, source, now)).toBeNull();
    expect(officialCandidate(page, candidate, source, now + 90 * 86400000)).toBeNull();
  });
  it('상품 목록의 일반 인기상품은 신제품으로 오인하지 않는다', () => {
    const page = { url: source.officialUrls[0], title: '제품', text: '인기 상품 딸기 모찌', images: [] };
    expect(officialCandidate(page, { name: '딸기 모찌', food: true, releaseEvidence: '인기 상품 딸기 모찌' }, source)).toBeNull();
  });
});
