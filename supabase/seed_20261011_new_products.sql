-- =========================================================
-- 2026년 10월 2주차 신제품 등록 (Supabase SQL Editor에서 한 번 실행)
-- 이미 같은 id가 있으면 건너뜁니다. 평점은 실제 리뷰로만 계산되므로 0으로 둡니다.
-- 출처: 농심 보도자료(9/30), 삼립 보도자료(10/2~10/7), CU 공식 신상품 코너(10/11 조회)
-- =========================================================

INSERT INTO public.products
    (id, name, brand, category, sub_category, item_type, image, release_date,
     price, discount_rate, overall_rating, rating_count, description, stores, volume, is_today, is_hot)
VALUES
    ('prod-new-20261011-01', '너구링', '농심', '과자', '스낵', 'packaged',
     'https://cdn.ggilbo.com/news/photo/202609/1184252_1036799_391.jpg', '2026-10-12',
     0, 0, 0, 0,
     '라면 ''너구리''와 스낵 ''양파링''을 결합한 신제품. SNS에서 양파링에 너구리 스프를 넣어 흔들어 먹던 레시피에 착안해, 양파링의 짭짤하고 고소한 맛에 너구리의 얼큰한 해산물 풍미를 더했습니다.',
     ARRAY['농심몰'], '60g', true, false),

    ('prod-new-20261011-02', '정통 밀크티 보름달', '삼립', '빵·디저트', '간식빵', 'packaged',
     'https://tqklhszfkvzk6518638.edge.naverncp.com/product/8801068945027.jpg', '2026-10-07',
     2000, 0, 0, 0,
     '삼립 대표 빵 ''정통 보름달''에 대만 밀크티 브랜드 ''3시 15분(3:15pm)''의 밀크티 풍미를 더한 협업 제품입니다.',
     ARRAY['CU', 'GS25'], NULL, true, false),

    ('prod-new-20261011-03', '밀크티 휘낭시에', '삼립', '빵·디저트', '디저트', 'packaged',
     'https://tqklhszfkvzk6518638.edge.naverncp.com/product/8801068945003.jpg', '2026-10-07',
     1800, 0, 0, 0,
     '대만 밀크티 브랜드 ''3시 15분(3:15pm)''과 협업해 밀크티 풍미를 담아 구워낸 휘낭시에입니다.',
     ARRAY['CU'], NULL, true, false),

    ('prod-new-20261011-04', '밀크티 쿠키', '삼립', '빵·디저트', '디저트', 'packaged',
     'https://tqklhszfkvzk6518638.edge.naverncp.com/product/8801068944990.jpg', '2026-10-07',
     1800, 0, 0, 0,
     '밀크티맛 내피를 우유반죽 외피로 감싼 부드러운 쿠키. 삼립과 대만 ''3시 15분(3:15pm)''의 협업 제품입니다.',
     ARRAY['CU'], NULL, true, false),

    ('prod-new-20261011-05', '밀크티 파르페', '삼립', '빵·디저트', '디저트', 'packaged',
     'https://tqklhszfkvzk6518638.edge.naverncp.com/product/8801068944976.jpg', '2026-10-07',
     4200, 0, 0, 0,
     '삼립과 대만 밀크티 브랜드 ''3시 15분(3:15pm)''이 협업한 냉장 디저트 파르페입니다.',
     ARRAY['CU', 'GS25'], NULL, true, false),

    ('prod-new-20261011-06', '허쉬 퐁당쇼콜라', '파머스', '과자', NULL, 'packaged',
     'https://tqklhszfkvzk6518638.edge.naverncp.com/product/8809441828677.jpg', '2026-10-07',
     1500, 0, 0, 0,
     'CU 공식 홈페이지 신상품 코너에 등록된 상품입니다.',
     ARRAY['CU'], NULL, true, false),

    ('prod-new-20261011-07', '허쉬 퐁당카라멜', '파머스', '과자', NULL, 'packaged',
     'https://tqklhszfkvzk6518638.edge.naverncp.com/product/8809441828684.jpg', '2026-10-07',
     1500, 0, 0, 0,
     'CU 공식 홈페이지 신상품 코너에 등록된 상품입니다.',
     ARRAY['CU'], NULL, true, false)
ON CONFLICT (id) DO NOTHING;
