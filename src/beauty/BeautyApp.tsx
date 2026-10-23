import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Bookmark, Check, ChevronRight, Download, FlaskConical, LayoutDashboard, Newspaper, Search, Sparkles, Package, Globe2, X } from 'lucide-react';
import './beauty.css';

const research = 'https://beautypl.com/research/2026cosmetic_awards/';
const news = [
  { id: 'pfas', type: '규제·정책', date: '2026.10.16', title: '글로벌 PFAS 규제, 다음 상품 기획 전에 확인할 변화', text: '10월 21일 PFAS 규제 동향 웨비나 안내. 수출 상품의 원료·규제 검토에 참고할 공지입니다.', source: '대한화장품협회', url: 'https://kcia.or.kr/home/edu/edu_01.php?no=17912&type=view', tag: '글로벌 규제' },
  { id: 'china', type: '해외시장', date: '2026.10.13', title: '중국 NMPA, 화장품안전기술규범 개정 시행 공고', text: '중국향 소싱을 준비한다면 개정 공고와 첨부 원문에서 적용 내용을 확인하세요.', source: '대한화장품협회', url: 'https://kcia.or.kr/home/law/law_09.php?no=17903&type=view', tag: '중국 · 수출' },
  { id: 'business', type: '사업·지원', date: '2026.10.15', title: '우즈베키스탄 바이오 클러스터, 입주기업 수요조사', text: '삼일PwC의 입주 의향·필요시설 수요조사 안내. 해외 사업 거점 검토 시 원문을 참고하세요.', source: '대한화장품협회', url: 'https://kcia.or.kr/home/edu/edu_01.php?no=17908&type=view', tag: '사업 기회' },
  { id: 'pdrn', type: '트렌드', date: '2026 리서치', title: '패드부터 세럼까지, PDRN 제품군을 살펴볼 때', text: '뷰티쁠 2026 어워드 1차 리서치에 등장한 제품을 바탕으로 구성한 소싱 탐색입니다. 판매 순위나 수상 결과는 아닙니다.', source: '뷰티쁠', url: research, tag: 'PDRN · 스킨케어' },
];
const products = [
  { id: 'mediheal', brand: 'MEDIHEAL', name: 'PDRN 모공 탄력 패드', ingredient: 'PDRN', category: '패드', color: 'pink', label: 'PDRN', note: '패드 포맷 · 모공 케어 콘셉트', check: '전성분·패드 매수·공급가 확인', url: research },
  { id: 'beauty', brand: 'BEAUTY OF JOSEON', name: '붉은팥 PDRN 모공탄력 세럼', ingredient: 'PDRN', category: '세럼', color: 'red', label: 'red bean', note: '전통 원료 스토리 · 세럼 포맷', check: '원료 기원·함량·해외 라벨 확인', url: research },
  { id: 'cosrx', brand: 'COSRX', name: '더 블루 펩타이드 바쿠치올 플럼프 글로우 세럼', ingredient: '바쿠치올', category: '세럼', color: 'blue', label: 'PEPTIDE', note: '펩타이드 × 바쿠치올 콘셉트', check: '전성분·시험 자료·MOQ 확인', url: research },
  { id: 'makeprem', brand: 'make p:rem', name: 'PDRN 포어 클레이 클렌징 밀크', ingredient: 'PDRN', category: '클렌저', color: 'green', label: 'make p:rem', note: '클레이 × 밀크 클렌징 포맷', check: '세정 시험·용량·납기 확인', url: research },
];
const ingredients = [
  { name: 'PDRN', en: 'Ingredient focus 01', desc: '패드·세럼·클렌저로 넓어지는 제품 콘셉트', points: '원료 기원, 전성분 표기, 실제 배합량과 완제품 시험 자료를 공급사에 요청하세요.' },
  { name: '바쿠치올', en: 'Ingredient focus 02', desc: '펩타이드와 함께 살펴볼 스킨케어 키워드', points: '원료 규격, 배합 안정성과 완제품 인체적용시험 자료를 확인하세요.' },
  { name: '펩타이드', en: 'Ingredient focus 03', desc: '다양한 조합으로 기획하는 탄력 케어 콘셉트', points: '펩타이드의 정확한 성분명, 배합 목적과 표시·광고 근거를 확인하세요.' },
];
const tabs = ['대시보드', '뉴스 & 이슈', '성분 인사이트', '상품 소싱', '저장한 보드'];
const icons = [LayoutDashboard, Newspaper, FlaskConical, Package, Bookmark];
const key = 'beauty-edit-board-v1';
export default function BeautyApp() {
  const [tab, setTab] = useState(tabs[0]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('전체');
  const [saved, setSaved] = useState<string[]>(() => { try { const value: unknown = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []; } catch { return []; } });
  const [detail, setDetail] = useState<(typeof ingredients)[number] | null>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const [notice, setNotice] = useState('');
  useEffect(() => { document.title = 'BEAUTY EDIT — 뷰티 MD의 다음 발견'; }, []);
  useEffect(() => {
    if (!detail) return;
    const previous = document.activeElement as HTMLElement | null;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDetail(null);
      if (event.key !== 'Tab') return;
      const elements = dialogRef.current?.querySelectorAll<HTMLElement>('button, a[href]');
      if (!elements?.length) return;
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('keydown', handleKey); previous?.focus(); };
  }, [detail]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 3000); return () => clearTimeout(timer); }, [notice]);
  const toggle = (id: string) => { const next = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id]; setSaved(next); try { localStorage.setItem(key, JSON.stringify(next)); } catch { setNotice('저장 공간을 사용할 수 없어 이번 화면에서만 유지됩니다.'); } };
  const matches = (text: string) => text.toLowerCase().includes(query.trim().toLowerCase());
  const visibleNews = news.filter(n => matches(`${n.title} ${n.text} ${n.tag}`) && (filter === '전체' || filter === n.type) && (tab !== '저장한 보드' || saved.includes(n.id)));
  const visibleProducts = products.filter(p => matches(`${p.name} ${p.brand} ${p.ingredient} ${p.category}`) && (tab !== '저장한 보드' || saved.includes(p.id)));
  const exportBoard = () => {
    const rows = [['유형', '브랜드/출처', '이름', '검토 메모', '출처 URL'], ...products.filter(p => saved.includes(p.id)).map(p => ['상품', p.brand, p.name, p.check, p.url]), ...news.filter(n => saved.includes(n.id)).map(n => ['뉴스', n.source, n.title, n.text, n.url])];
    const csv = '\uFEFF' + rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })); const a = document.createElement('a'); a.href = url; a.download = 'beauty-edit-sourcing.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const saveButton = (id: string) => <button className={`be-save ${saved.includes(id) ? 'selected' : ''}`} aria-label={saved.includes(id) ? '보드에서 제거' : '보드에 저장'} aria-pressed={saved.includes(id)} onClick={() => toggle(id)}><Bookmark size={17} fill={saved.includes(id) ? 'currentColor' : 'none'} /></button>;
  return <div className="be-app">
    <aside className="be-sidebar"><a href="/beauty" className="be-logo">beauty<span>edit.</span><i>FOR BEAUTY PROFESSIONALS</i></a><div className="be-workspace"><span>BE</span><div>MD 워크스페이스<small>Discover your next bestseller</small></div></div><p className="be-nav-label">WORKSPACE</p><nav>{tabs.map((name, i) => { const Icon = icons[i]; return <button key={name} className={tab === name ? 'active' : ''} onClick={() => { setTab(name); setFilter('전체'); setQuery(''); }}><Icon size={19} />{name}{i === 4 && <b>{saved.length}</b>}</button>; })}</nav><div className="be-side-note"><Sparkles size={22} /><strong>발견을, 다음 기회로.</strong><p>흩어진 뷰티 정보를 모아<br />더 명확한 소싱 의사결정.</p><button onClick={() => setTab('상품 소싱')}>소싱 후보 살펴보기 <ArrowUpRight size={15} /></button></div><a className="be-source-link" href="https://kcia.or.kr/home/main/" target="_blank" rel="noreferrer"><Globe2 size={16} /> 공식 산업정보 <ArrowUpRight size={14} /></a><div className="be-user"><span>MD</span><div>뷰티 바이어<small>Personal workspace</small></div></div></aside>
    <div className="be-body"><header className="be-top"><div>워크스페이스 <ChevronRight size={14} /><strong>{tab}</strong></div><label className="be-search"><Search size={17} /><input aria-label="뉴스 성분 상품 통합 검색" value={query} onChange={e => setQuery(e.target.value)} placeholder="뉴스, 성분, 브랜드 검색" />{query && <button aria-label="검색 초기화" onClick={() => setQuery('')}><X size={14} /></button>}</label><button className="be-board-button" onClick={() => setTab('저장한 보드')}><Bookmark size={16} /> 내 소싱 보드 <span>{saved.length}</span></button></header>
    <main className="be-main"><div className="be-heading"><div><p className="be-eyebrow">THE BEAUTY INTELLIGENCE DESK</p><h1>{tab === '대시보드' ? '뷰티의 흐름을 읽는, 새로운 시선.' : tab}</h1><p>트렌드를 발견하고, 성분을 이해하고, 다음 히트 상품을 준비하세요.</p></div><span className="be-date"><i /> 큐레이션 기준 2026.10.18</span></div>
    {tab === '대시보드' && !query && <><section className="be-hero"><div className="be-hero-copy"><span className="be-pill">EDITOR’S FOCUS <span>OCTOBER 2026</span></span><h2>성분에서 시작되는<br />다음 뷰티의 기회.</h2><p>PDRN부터 펩타이드까지.<br />제품의 이름 너머, 소싱의 힌트를 발견하세요.</p><button onClick={() => setTab('성분 인사이트')}>이번 큐레이션 살펴보기 <ArrowUpRight size={18} /></button><small>뷰티쁠 2026 어워드 1차 리서치 기반 · 에디터 선정</small></div><div className="be-hero-art" aria-hidden="true"><span className="be-orbit orbit-one" /><span className="be-orbit orbit-two" /><div className="be-art-caption">THE SCIENCE<br />OF WHAT’S NEXT</div><div className="be-bottle hero-bottle"><div className="be-cap" /><div className="be-bottle-label"><small>beauty edit.</small><strong>PDRN</strong><span>INGREDIENT<br />EXPLORATION</span><em>RESEARCH SERIES — 01</em></div></div><span className="be-art-tag">FORMULA MEETS OPPORTUNITY ↗</span></div></section><div className="be-brief"><span><Sparkles size={17} /> MD BRIEF</span><p>이번 주 체크포인트 <b>PFAS 규제 동향</b><i /> 중국 수출 규범 개정 <i /> PDRN 제품 포맷 탐색</p><button onClick={() => setTab('뉴스 & 이슈')} aria-label="이번 주 뉴스 보기"><ArrowUpRight size={20} /></button></div></>}
    <div className="be-content-grid"><div>
    {(tab === '대시보드' || tab === '뉴스 & 이슈' || tab === '저장한 보드') && <section><div className="be-section-heading"><h2>{tab === '저장한 보드' ? '저장한 뉴스 & 이슈' : '놓치지 말아야 할 뉴스 & 이슈'} <span>NEWS DESK</span></h2><button onClick={() => setTab('뉴스 & 이슈')}>전체 보기 <ChevronRight size={14} /></button></div><div className="be-filters">{['전체', '트렌드', '규제·정책', '해외시장', '사업·지원'].map(x => <button key={x} onClick={() => setFilter(x)} className={filter === x ? 'active' : ''}>{x}</button>)}</div><div className="be-news-list">{visibleNews.map((n, i) => <article key={n.id} className="be-news"><div className={`be-news-visual visual-${i % 4}`} aria-hidden="true">{n.type === '트렌드' ? <FlaskConical size={35} /> : n.type === '해외시장' ? <Globe2 size={35} /> : n.type === '사업·지원' ? <Package size={35} /> : <span>PFAS<small>REGULATION WATCH</small></span>}</div><div className="be-news-copy"><span className="be-category">{n.type} <i>· {n.date}</i></span><a href={n.url} target="_blank" rel="noreferrer"><h3>{n.title} <ArrowUpRight size={15} /></h3></a><p>{n.text}</p><small>{n.source} <span>#{n.tag}</span></small></div>{saveButton(n.id)}</article>)}{!visibleNews.length && <p className="be-empty">{tab === '저장한 보드' ? '뉴스의 북마크 버튼으로 관심 이슈를 저장하세요.' : '검색 조건에 맞는 뉴스가 없습니다.'}</p>}</div></section>}
    {(tab === '대시보드' || tab === '상품 소싱' || tab === '저장한 보드') && <section className="be-products-section"><div className="be-section-heading"><h2>{tab === '저장한 보드' ? '저장한 소싱 후보' : '다음 라인업을 위한 소싱 후보'} <span>SOURCING PICKS</span></h2>{tab === '저장한 보드' ? <button onClick={exportBoard} disabled={!saved.length}><Download size={15} /> CSV 내보내기</button> : <button onClick={() => setTab('상품 소싱')}>전체 보기 <ChevronRight size={14} /></button>}</div><p className="be-section-desc">2026 어워드 1차 리서치 노출 제품 · 판매 순위·수상 결과 아님 · 공급 조건 별도 확인</p><div className="be-product-grid">{visibleProducts.map(p => <article className="be-product" key={p.id}><div className={`be-product-art ${p.color}`}>{saveButton(p.id)}<span className="be-product-type">{p.category}</span><div className={`be-pack ${p.category === '패드' ? 'jar' : ''}`} aria-label="제품 실사가 아닌 콘셉트 일러스트"><div /><strong>{p.label}</strong><small>FORMULA<br />EXPLORATION</small></div><span className="be-concept">콘셉트 이미지</span></div><div className="be-product-info"><small>{p.brand}</small><h3>{p.name}</h3><span className="be-ingredient-tag">{p.ingredient}</span><p>{p.note}</p><details><summary>소싱 체크리스트</summary><p>{p.check}</p><textarea aria-label={`${p.name} 소싱 메모`} placeholder="담당자, 샘플 요청 등 메모" defaultValue={(() => { try { return localStorage.getItem(`${key}-${p.id}`) || ''; } catch { return ''; } })()} onChange={e => { try { localStorage.setItem(`${key}-${p.id}`, e.target.value); } catch { setNotice('메모를 저장할 수 없습니다.'); } }} /></details><a href={p.url} target="_blank" rel="noreferrer">제품 출처 확인 <ArrowUpRight size={14} /></a></div></article>)}</div>{!visibleProducts.length && <p className="be-empty">표시할 후보가 없습니다. 상품의 북마크 버튼으로 보드에 추가하세요.</p>}</section>}
    {tab === '성분 인사이트' && <section><div className="be-section-heading"><h2>제품 기획의 출발점, 성분 탐색</h2></div><p className="be-section-desc">키워드별 제품 콘셉트와 공급사에 물어볼 질문을 정리했습니다.</p>{ingredients.filter(x => matches(`${x.name} ${x.desc}`)).map(x => <button className="be-ingredient-detail" key={x.name} onClick={() => setDetail(x)}><FlaskConical /><div><small>{x.en}</small><h2>{x.name}</h2><p>{x.desc}</p></div><ArrowUpRight /></button>)}<a className="be-dictionary" href="https://kcia.or.kr/cid/main/" target="_blank" rel="noreferrer">대한화장품협회 성분사전에서 정확한 표준명 확인 <ArrowUpRight size={16} /></a><p className="be-section-desc">성분사전은 명칭 표준화 자료입니다. 효능·사용 가능 여부와 배합 안전성을 보증하지 않습니다.</p></section>}
    </div><aside className="be-right"><section className="be-ingredient-panel"><div className="be-section-heading"><h2>주목할 성분</h2><FlaskConical size={18} /></div><p>다음 기획을 위한 탐색 키워드</p>{ingredients.map((x, i) => <button key={x.name} onClick={() => setDetail(x)}><span>0{i + 1}</span><div><strong>{x.name}</strong><small>{x.desc}</small></div><ArrowUpRight size={16} /></button>)}<small className="be-editor-note">에디터 선정 · 검색량 순위 아님</small></section><section className="be-business"><span className="be-eyebrow">BUSINESS RADAR</span><h2>정보가 기회가 되는 곳.</h2><p>규제 변화부터 해외 진출까지,<br />다음 사업의 단서를 확인하세요.</p><button onClick={() => { setTab('뉴스 & 이슈'); setFilter('사업·지원'); }}>사업·지원 정보 보기 <ArrowUpRight size={16} /></button><div className="be-radar" aria-hidden="true"><span /><span /><i /></div></section><section className="be-source-note"><Check size={17} /><div><strong>출처가 있는 인사이트</strong><p>2026.10.18 확인한 공개 자료를 직접 큐레이션했습니다. 자동 갱신은 연결되어 있지 않으며, 최신 조건은 원문에서 확인하세요.</p></div></section></aside></div>
    <footer className="be-footer"><strong>beauty edit.</strong><span>더 나은 발견, 더 명확한 선택.</span><small>© 2026 BEAUTY EDIT · MD Intelligence Workspace</small></footer></main></div>
    {notice && <div className="be-toast" role="status">{notice}</div>}
    {detail && <div className="be-modal-backdrop" onClick={() => setDetail(null)}><section ref={dialogRef} className="be-modal" role="dialog" aria-modal="true" aria-label={`${detail.name} 성분 인사이트`}><button className="be-modal-close" autoFocus aria-label="닫기" onClick={() => setDetail(null)}><X /></button><div onClick={e => e.stopPropagation()}><FlaskConical size={34} /><p className="be-eyebrow">INGREDIENT INSIGHT</p><h2>{detail.name}</h2><p>{detail.desc}</p><h3>공급사에 확인할 질문</h3><p>{detail.points}</p><small>제품 콘셉트 검토용 가이드이며, 개별 성분의 효능을 확정하는 자료가 아닙니다.</small><button onClick={() => { setQuery(detail.name); setTab('상품 소싱'); setDetail(null); }}>관련 소싱 후보 보기 <ArrowUpRight size={16} /></button><a href="https://kcia.or.kr/cid/main/" target="_blank" rel="noreferrer">공식 성분사전 열기 ↗</a></div></section></div>}
  </div>;
}
