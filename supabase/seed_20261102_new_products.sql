-- =========================================================
-- 2026년 10월 3주~11월 1주 신제품 30종 등록 (Supabase SQL Editor에서 한 번 실행)
-- 이미 같은 id가 있으면 건너뜁니다. 평점은 실제 리뷰로만 계산되므로 0으로 둡니다.
-- 가격·출시일은 출처에 적힌 값만 넣었고, 출처에 가격이 없으면 0입니다.
-- 출처: GS리테일 보도자료(10/7~10/16), 이디야커피 공식 푸드 메뉴(11/2 조회),
--       위키트리·스페셜타임스·세계일보·전자신문·마이데일리·프라임경제 기사(10/20~10/31)
-- =========================================================

INSERT INTO public.products
    (id, name, brand, category, sub_category, item_type, image, release_date,
     price, discount_rate, overall_rating, rating_count, description, stores, volume, is_today, is_hot,
     source_name, source_url)
VALUES
    -- GS25
    ('prod-new-20261102-01', '명란통계란김밥', 'GS25', '간편식', '김밥', 'packaged',
     'https://hpsimg.gsretail.com/medias/sys_master/images/images/h00/hf3/9162642718750.jpg', '2026-10-13',
     3900, 0, 0, 0,
     '김밥 가게 ''식물원김밥''의 대표 메뉴 ''명란계란김밥''을 재해석한 협업 상품. 고소한 흑미밥에 통계란말이와 짭조름한 명란을 담았습니다.',
     ARRAY['GS25'], NULL, false, false,
     'GS리테일 보도자료', 'https://www.gsretail.com/news/press-releases/detail?prrSeqno=4380'),

    ('prod-new-20261102-02', '날치알묵은지김밥', 'GS25', '간편식', '김밥', 'packaged',
     'https://hpsimg.gsretail.com/medias/sys_master/images/images/h00/hf3/9162642718750.jpg', '2026-10-07',
     3700, 0, 0, 0,
     '''식물원김밥'' 협업 김밥. 날치알과 참치에 아삭한 묵은지, 로메인 상추를 더했습니다. 출시 일주일 만에 10만 개가 팔렸습니다.',
     ARRAY['GS25'], NULL, false, false,
     'GS리테일 보도자료', 'https://www.gsretail.com/news/press-releases/detail?prrSeqno=4380'),

    ('prod-new-20261102-03', '여주고구마 닭가슴살에너지볼', 'GS25', '간편식', '샐러드', 'packaged',
     'https://hpsimg.gsretail.com/medias/sys_master/images/images/h04/hd0/9162642325534.jpg', '2026-10-13',
     4900, 0, 0, 0,
     '여주시와 협업한 로코노미 샐러드 첫 상품. 닭가슴살과 계란에 여주산 밤고구마를 메인 토핑으로 올리고 여주산 채소를 담았습니다.',
     ARRAY['GS25'], NULL, false, false,
     'GS리테일 보도자료', 'https://www.gsretail.com/news/press-releases/detail?prrSeqno=4375'),

    ('prod-new-20261102-04', '태극당 버터크림빵', 'GS25', '빵·디저트', '간식빵', 'packaged',
     'https://hpsimg.gsretail.com/medias/sys_master/images/images/he7/h08/9162642391070.jpg', '2026-10-13',
     2800, 0, 0, 0,
     '80년 전통 제과점 태극당과 GS25가 1년간 함께 개발한 빵. 부드러운 식빵 사이에 고소한 버터크림을 넉넉히 발랐습니다.',
     ARRAY['GS25'], NULL, false, false,
     'GS리테일 보도자료', 'https://www.gsretail.com/news/press-releases/detail?prrSeqno=4376'),

    ('prod-new-20261102-05', '태극당 오란다빵', 'GS25', '빵·디저트', '간식빵', 'packaged',
     'https://hpsimg.gsretail.com/medias/sys_master/images/images/he7/h08/9162642391070.jpg', '2026-10-15',
     3200, 0, 0, 0,
     '촉촉한 식빵과 폭신한 카스테라 사이에 사과잼과 소보로를 더해 태극당 대표 빵의 맛을 살린 협업 빵입니다.',
     ARRAY['GS25'], NULL, false, false,
     'GS리테일 보도자료', 'https://www.gsretail.com/news/press-releases/detail?prrSeqno=4376'),

    ('prod-new-20261102-06', '태극당 미니맘모스빵', 'GS25', '빵·디저트', '간식빵', 'packaged',
     'https://hpsimg.gsretail.com/medias/sys_master/images/images/he7/h08/9162642391070.jpg', '2026-10-15',
     3800, 0, 0, 0,
     '소보로빵 사이에 앙금과 딸기잼, 땅콩버터크림을 채운 태극당 협업 미니 맘모스빵입니다.',
     ARRAY['GS25'], NULL, false, false,
     'GS리테일 보도자료', 'https://www.gsretail.com/news/press-releases/detail?prrSeqno=4376'),

    ('prod-new-20261102-07', '설빙 피자설기', 'GS25', '빵·디저트', '떡', 'packaged',
     'https://cdn.specialtimes.co.kr/news/photo/202610/478302_468137_3547.jpg', '2026-10-26',
     3900, 0, 0, 0,
     '백설기 위에 피자소스, 피자치즈, 페퍼로니, 옥수수를 올린 냉동 떡 디저트. 전자레인지에 데워 먹습니다. 10/26~31 앱 사전예약 후 11월 5일부터 전국 GS25에서 판매합니다.',
     ARRAY['GS25'], '130g(65g×2입)', true, false,
     '스페셜타임스', 'https://www.specialtimes.co.kr/news/articleView.html?idxno=478302'),

    -- 이디야커피
    ('prod-new-20261102-08', '이디야커피 피자설기', '이디야커피', '빵·디저트', '떡', 'restaurant',
     'https://www.ediya.com/files/menu/IMG_1793001792160.png', '2026-10-29',
     2900, 0, 0, 0,
     '전통 설기떡에 하인즈 피자소스로 피자 맛을 더한 이디야커피 x 하인즈 협업 떡 디저트입니다.',
     ARRAY['이디야커피'], '80g', true, false,
     '세계일보', 'https://www.segye.com/newsView/20261031502532'),

    ('prod-new-20261102-09', '이디야커피 콘치즈설기', '이디야커피', '빵·디저트', '떡', 'restaurant',
     'https://www.ediya.com/files/menu/IMG_1793001911897.png', '2026-10-29',
     2900, 0, 0, 0,
     '전통 설기떡에 하인즈 마요네즈로 콘치즈 맛을 더한 이디야커피 x 하인즈 협업 떡 디저트입니다.',
     ARRAY['이디야커피'], '80g', true, false,
     '세계일보', 'https://www.segye.com/newsView/20261031502532'),

    ('prod-new-20261102-10', '이디야커피 와그작 생 초코파이', '이디야커피', '빵·디저트', '디저트', 'restaurant',
     'https://www.ediya.com/files/menu/IMG_1792465407166.png', '2026-10-22',
     0, 0, 0, 0,
     '이디야커피 가을 푸드 신메뉴 디저트 4종 중 하나인 생크림 초코파이입니다.',
     ARRAY['이디야커피'], NULL, false, false,
     '한국아이닷컴', 'https://www.hankooki.com/news/articleView.html?idxno=346502'),

    ('prod-new-20261102-11', '이디야커피 말차초코 크림파운드', '이디야커피', '빵·디저트', '파이/케이크', 'restaurant',
     'https://www.ediya.com/files/menu/IMG_1792465705645.png', '2026-10-22',
     0, 0, 0, 0,
     '말차와 초코 크림을 담은 이디야커피 푸드 신메뉴 파운드케이크입니다.',
     ARRAY['이디야커피'], NULL, false, false,
     '한국아이닷컴', 'https://www.hankooki.com/news/articleView.html?idxno=346502'),

    ('prod-new-20261102-12', '이디야커피 촉촉한 치즈 수플레', '이디야커피', '빵·디저트', '디저트', 'restaurant',
     'https://www.ediya.com/files/menu/IMG_1792466041370.png', '2026-10-22',
     0, 0, 0, 0,
     '부드럽고 촉촉한 식감의 치즈 수플레. 이디야커피 디저트 신메뉴입니다.',
     ARRAY['이디야커피'], NULL, false, false,
     '한국아이닷컴', 'https://www.hankooki.com/news/articleView.html?idxno=346502'),

    ('prod-new-20261102-13', '이디야커피 햄 치즈 스크램블 브리오슈', '이디야커피', '빵·디저트', '베이커리', 'restaurant',
     'https://www.ediya.com/files/menu/IMG_1792466490538.png', '2026-10-22',
     0, 0, 0, 0,
     '브리오슈에 햄, 치즈, 스크램블 에그를 넣은 이디야커피 식사 대용 신메뉴입니다.',
     ARRAY['이디야커피'], NULL, false, false,
     '한국아이닷컴', 'https://www.hankooki.com/news/articleView.html?idxno=346502'),

    ('prod-new-20261102-14', '이디야커피 콘치즈 토스트', '이디야커피', '빵·디저트', '베이커리', 'restaurant',
     'https://www.ediya.com/files/menu/IMG_1792466629165.png', '2026-10-22',
     0, 0, 0, 0,
     '옥수수와 치즈를 올린 이디야커피 식사 대용 토스트 신메뉴입니다.',
     ARRAY['이디야커피'], NULL, false, false,
     '한국아이닷컴', 'https://www.hankooki.com/news/articleView.html?idxno=346502'),

    ('prod-new-20261102-15', '이디야커피 저당 콤비네이션 포켓피자', '이디야커피', '빵·디저트', '베이커리', 'restaurant',
     'https://www.ediya.com/files/menu/IMG_1792466815753.png', '2026-10-22',
     0, 0, 0, 0,
     '당을 줄인 콤비네이션 맛 포켓피자. 이디야커피 식사 대용 신메뉴입니다.',
     ARRAY['이디야커피'], NULL, false, false,
     '한국아이닷컴', 'https://www.hankooki.com/news/articleView.html?idxno=346502'),

    -- 맘스터치 후덕죽 셰프 컬렉션 2탄
    ('prod-new-20261102-16', '맘스터치 후덕죽 쿵파오싸이버거', '맘스터치', '패스트푸드', '버거', 'restaurant',
     'https://cdnweb01.wikitree.co.kr/webdata/editor/202610/22/img_20261022091908_01ddc7a5.jpg', '2026-10-22',
     0, 0, 0, 0,
     '닭다리살 싸이패티에 매콤달콤한 쿵파오소스를 더하고, 궁채다이스와 캐슈넛야채패티를 넣은 후덕죽 셰프 협업 버거입니다.',
     ARRAY['맘스터치'], NULL, false, false,
     '위키트리', 'https://www.wikitree.co.kr/articles/1168216'),

    ('prod-new-20261102-17', '맘스터치 후덕죽 XO통모짜새우버거', '맘스터치', '패스트푸드', '버거', 'restaurant',
     'https://cdnweb01.wikitree.co.kr/webdata/editor/202610/22/img_20261022091908_01ddc7a5.jpg', '2026-10-22',
     0, 0, 0, 0,
     '새우패티와 통모짜렐라치즈패티에 두 가지 맛의 XO소스를 조합한 후덕죽 셰프 협업 버거입니다.',
     ARRAY['맘스터치'], NULL, false, false,
     '위키트리', 'https://www.wikitree.co.kr/articles/1168216'),

    ('prod-new-20261102-18', '맘스터치 후덕죽 XO쉬림프싸이플렉스버거', '맘스터치', '패스트푸드', '버거', 'restaurant',
     'https://cdnweb01.wikitree.co.kr/webdata/editor/202610/22/img_20261022091908_01ddc7a5.jpg', '2026-10-22',
     0, 0, 0, 0,
     '싸이패티와 새우패티를 함께 넣고 쿵파오소스·XO마요소스를 더한 버거. 피클 대신 궁채다이스를 넣었습니다.',
     ARRAY['맘스터치'], NULL, false, false,
     '위키트리', 'https://www.wikitree.co.kr/articles/1168216'),

    ('prod-new-20261102-19', '맘스터치 후덕죽 XO사천빅싸이순살', '맘스터치', '패스트푸드', '치킨', 'restaurant',
     'https://cdnweb01.wikitree.co.kr/webdata/editor/202610/22/img_20261022091908_01ddc7a5.jpg', '2026-10-22',
     0, 0, 0, 0,
     '닭다리살로 만든 빅싸이순살에 특제 XO사천크럼블을 곁들인 후덕죽 셰프 협업 치킨입니다.',
     ARRAY['맘스터치'], NULL, false, false,
     '위키트리', 'https://www.wikitree.co.kr/articles/1168216'),

    -- 치킨·버거·피자
    ('prod-new-20261102-20', 'bhc 알싹킹', 'bhc', '패스트푸드', '치킨', 'restaurant',
     'https://cdn.specialtimes.co.kr/news/photo/202610/477078_467317_107.jpg', '2026-10-22',
     0, 0, 0, 0,
     '고추·양파·대파 풍미를 살린 얇은 튀김옷 치킨. 불향 매운맛 ''맵싸소스''와 대파·청양고추의 ''파싹소스''를 곁들입니다.',
     ARRAY['bhc'], NULL, false, false,
     '스페셜타임스', 'https://www.specialtimes.co.kr/news/articleView.html?idxno=477078'),

    ('prod-new-20261102-21', '맥도날드 게살 크림 크로켓 머핀', '맥도날드', '패스트푸드', '버거', 'restaurant',
     'https://img.segye.com/content/image/2026/10/31/20261031502533.jpg', '2026-10-29',
     0, 0, 0, 0,
     '게살 크림 크로켓을 아침 메뉴로 재구성한 맥모닝 머핀. 스위트 칠리 소스와 화이트 마요 소스를 더했습니다. 오전 4시~10시 30분 판매.',
     ARRAY['맥도날드'], NULL, true, false,
     '세계일보', 'https://www.segye.com/newsView/20261031502532'),

    ('prod-new-20261102-22', '피자헛 콰트로 치즈 슈프림', '피자헛', '패스트푸드', '피자', 'restaurant',
     'https://www.newsprime.co.kr/data/photos/cdn/20261043/art_751699_1792480144.jpg', '2026-10-20',
     0, 0, 0, 0,
     '11가지 토핑의 수퍼슈프림에 모짜렐라·고다·프로볼로네·파마산 네 가지 치즈 풍미를 더한 피자입니다.',
     ARRAY['피자헛'], NULL, false, false,
     '프라임경제', 'https://www.newsprime.co.kr/news/article/?no=751699'),

    ('prod-new-20261102-23', '피자헛 안창 스테이크 슈프림', '피자헛', '패스트푸드', '피자', 'restaurant',
     'https://www.newsprime.co.kr/data/photos/cdn/20261043/art_751699_1792480144.jpg', '2026-10-20',
     0, 0, 0, 0,
     '수퍼슈프림에 안창살 스테이크를 더해 육향과 감칠맛을 살린 피자입니다.',
     ARRAY['피자헛'], NULL, false, false,
     '프라임경제', 'https://www.newsprime.co.kr/news/article/?no=751699'),

    -- 설빙 포켓몬 협업 빙수
    ('prod-new-20261102-24', '설빙 찌릿찌릿 피카츄 망고설빙', '설빙', '빵·디저트', '디저트', 'restaurant',
     'https://www.newsprime.co.kr/data/photos/cdn/20261043/art_751699_1792480153.jpg', '2026-10-28',
     14900, 0, 0, 0,
     '설빙 x 포켓몬 협업 망고 빙수. 포켓몬 쉐이커 마그넷(개당 3,900원)과 함께 구매할 수 있습니다.',
     ARRAY['설빙'], NULL, true, false,
     '프라임경제', 'https://www.newsprime.co.kr/news/article/?no=751699'),

    ('prod-new-20261102-25', '설빙 초코밤 이브이 깨먹는설빙', '설빙', '빵·디저트', '디저트', 'restaurant',
     'https://www.newsprime.co.kr/data/photos/cdn/20261043/art_751699_1792480153.jpg', '2026-10-28',
     14900, 0, 0, 0,
     '설빙 x 포켓몬 협업 초코밤 깨먹는 빙수. 포켓몬 쉐이커 마그넷(개당 3,900원)과 함께 구매할 수 있습니다.',
     ARRAY['설빙'], NULL, true, false,
     '프라임경제', 'https://www.newsprime.co.kr/news/article/?no=751699'),

    ('prod-new-20261102-26', '설빙 변신 메타몽 치즈베리설빙', '설빙', '빵·디저트', '디저트', 'restaurant',
     'https://www.newsprime.co.kr/data/photos/cdn/20261043/art_751699_1792480153.jpg', '2026-10-28',
     14900, 0, 0, 0,
     '설빙 x 포켓몬 협업 치즈베리 빙수. 포켓몬 쉐이커 마그넷(개당 3,900원)과 함께 구매할 수 있습니다.',
     ARRAY['설빙'], NULL, true, false,
     '프라임경제', 'https://www.newsprime.co.kr/news/article/?no=751699'),

    -- 가공식품·편의점
    ('prod-new-20261102-27', '굴미역국라면', '오뚜기', '간편식', '라면', 'packaged',
     'https://img.etnews.com/news/article/2026/10/26/news-p.v1.20261026.5ef059af37bf453ba03800cf18fe4712_P1.jpg', '2026-10-29',
     0, 0, 0, 0,
     '롯데마트·슈퍼와 오뚜기가 함께 만든 미역국라면 후속작. 국산 굴·바지락·홍합으로 해산물 감칠맛을 살리고 참기름에 볶은 미역을 넣었습니다.',
     ARRAY['롯데마트', '롯데슈퍼'], NULL, true, false,
     '전자신문', 'https://www.etnews.com/20261026000103'),

    ('prod-new-20261102-28', '호박인절미떡', '세븐일레븐', '빵·디저트', '떡', 'packaged',
     'https://img.mydaily.co.kr/photos/2026/10/26/2026102611025277827_l.jpg', '2026-10-29',
     0, 0, 0, 0,
     '인기 떡 전문점 대표 메뉴에서 착안해 전통 떡의 특성을 살린 세븐일레븐 호박 인절미입니다.',
     ARRAY['세븐일레븐'], NULL, true, false,
     '마이데일리', 'https://www.mydaily.co.kr/page/view/2026102611033131847'),

    ('prod-new-20261102-29', '흑임자떡', '세븐일레븐', '빵·디저트', '떡', 'packaged',
     'https://img.mydaily.co.kr/photos/2026/10/26/2026102611025277827_l.jpg', '2026-10-29',
     0, 0, 0, 0,
     '인기 떡 전문점 대표 메뉴에서 착안해 전통 떡의 특성을 살린 세븐일레븐 흑임자떡입니다.',
     ARRAY['세븐일레븐'], NULL, true, false,
     '마이데일리', 'https://www.mydaily.co.kr/page/view/2026102611033131847'),

    ('prod-new-20261102-30', '쉐푸드 치즈통돈까스', '롯데웰푸드', '간편식', '튀김/냉동요리', 'packaged',
     'https://www.newsprime.co.kr/data/photos/cdn/20261043/art_751699_1792480133.jpg', '2026-10-20',
     0, 0, 0, 0,
     '통모짜렐라 치즈를 47% 넣은 ''쉐푸드 등심통돈까스'' 후속 제품. 생빵가루로 세 번 튀겼고 에어프라이어로 조리할 수 있습니다.',
     ARRAY['대형마트', '온라인몰'], '280g', false, false,
     '프라임경제', 'https://www.newsprime.co.kr/news/article/?no=751699')
ON CONFLICT (id) DO NOTHING;
