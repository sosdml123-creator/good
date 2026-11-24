-- 2026-11-24 신제품 2종 (가격 확인된 것만). 제품 사진은 Codex로 누끼를 딴 public/products 이미지.
-- 꼬북칩: 117g 2,400원 (마켓컬리·롯데마트 제타 표기). 자가비: 세븐일레븐 11/18 출시 2,000원.
INSERT INTO public.products
    (id, name, brand, category, sub_category, item_type, image, release_date,
     price, discount_rate, overall_rating, rating_count, description, stores, volume, is_today, is_hot)
VALUES
('prod-new-20261124-01', '찍먹 꼬북칩 바베큐&치미추리소스맛', '오리온', '간편식', '과자', 'packaged',
 'https://www.sinsangpick.kr/products/new-20261124-kkobuk-chimichurri.png', '2026-04-22', 2400, 0, 0, 0,
 '오리온 꼬북칩 브랜드 최초로 짜먹는 치미추리 소스를 함께 넣은 유용욱 바베큐 한정판입니다. 네 겹 꼬북칩에 훈연향과 메이플 시럽을 더한 바베큐 맛입니다.',
 ARRAY[]::text[], '117g', true, false),
('prod-new-20261124-02', '자가비 매운카레맛', '해태제과', '간편식', '과자', 'packaged',
 'https://www.sinsangpick.kr/products/new-20261124-jagabee-spicy-curry.png', '2026-11-18', 2000, 0, 0, 0,
 '해태제과 자가비의 매운 카레맛입니다. 냉동감자 85.7%에 매운커리맛시즈닝을 더한 감자스틱 스낵으로 세븐일레븐에서 판매합니다.',
 ARRAY['세븐일레븐'], '45g', true, false)
ON CONFLICT (id) DO NOTHING;

-- 2026-11-24 추가: 가격 미확인 6종(가격 0). 이미지는 Codex 누끼.
INSERT INTO public.products
    (id, name, brand, category, sub_category, item_type, image, release_date,
     price, discount_rate, overall_rating, rating_count, description, stores, volume, is_today, is_hot)
VALUES
('prod-new-20261124-03','명가 찰떡파이 솔티드 카라멜','롯데웰푸드','간편식','과자','packaged','https://www.sinsangpick.kr/products/new-20261124-chaltteok-salted-caramel.png','2026-11-18',0,0,0,0,'롯데웰푸드 명가 찰떡파이의 솔티드 카라멜 맛입니다. 카라멜 쿠키칩 코팅에 쫀득한 찰떡과 솔티드 카라멜 페이스트를 넣은 6봉입 제품입니다.',ARRAY[]::text[],'150g',true,false),
('prod-new-20261124-04','오예스 베이크하우스 메도빅','해태제과','간편식','과자','packaged','https://www.sinsangpick.kr/products/new-20261124-oyes-bakehouse-medovik.png','2026-11-23',0,0,0,0,'해태제과 오예스 베이크하우스의 겨울 시즌 윈터 체크인 에디션입니다. 동유럽의 꿀케이크 메도빅을 오예스로 옮긴 8개입 제품입니다.',ARRAY[]::text[],'280g',true,false),
('prod-new-20261124-05','설레임 쿨리쉬 휘핑크림','롯데웰푸드','아이스크림','파우치','packaged','https://www.sinsangpick.kr/products/new-20261124-seolleim-coolish-whipcream.png','2026-11-18',0,0,0,0,'롯데웰푸드 설레임 쿨리쉬의 휘핑크림 맛입니다. 휘핑한 크림의 풍부한 맛과 부드러움을 살린 160ml 파우치 빙과입니다.',ARRAY[]::text[],'160ml',true,false),
('prod-new-20261124-06','조청쌀팝','오리온','간편식','과자','packaged','https://www.sinsangpick.kr/products/new-20261124-jocheong-ssalpop.png','2026-11-23',0,0,0,0,'오리온 국산쌀 조청쌀팝입니다. 국산 쌀 팝 스낵에 조청의 구수하고 달콤한 맛을 입힌 120g 제품입니다.',ARRAY[]::text[],'120g',true,false),
('prod-new-20261124-07','롤리폴리 밀크파르페맛','해태제과','간편식','과자','packaged','https://www.sinsangpick.kr/products/new-20261124-rolypoly-milk-parfait.png','2026-11-23',0,0,0,0,'해태제과 롤리폴리의 윈터 체크인 에디션입니다. 일본 파르페의 진한 밀크 풍미를 담은 196g 19봉입 제품입니다.',ARRAY[]::text[],'196g',true,false),
('prod-new-20261124-08','사브레 뱅쇼맛','해태제과','간편식','과자','packaged','https://www.sinsangpick.kr/products/new-20261124-sable-vinchaud.png','2026-11-23',0,0,0,0,'해태제과 사브레의 윈터 체크인 에디션입니다. 프랑스 겨울 음료 뱅쇼의 향긋함을 담은 252g 제품입니다.',ARRAY[]::text[],'252g',true,false)
ON CONFLICT (id) DO NOTHING;

-- 디자인밀 5종·자허블T 사진을 개별 제품 사진으로 교체
UPDATE public.products SET image = 'https://www.sinsangpick.kr/products/new-20261124-designmeal-kimchi-kongbiji.png' WHERE id='prod-new-20261123-01';
UPDATE public.products SET image = 'https://www.sinsangpick.kr/products/new-20261124-designmeal-deulkkae-mushroom.png' WHERE id='prod-new-20261123-02';
UPDATE public.products SET image = 'https://www.sinsangpick.kr/products/new-20261124-designmeal-japanese-curry.png' WHERE id='prod-new-20261123-03';
UPDATE public.products SET image = 'https://www.sinsangpick.kr/products/new-20261124-designmeal-daepa-bulgogi.png' WHERE id='prod-new-20261123-04';
UPDATE public.products SET image = 'https://www.sinsangpick.kr/products/new-20261124-designmeal-spicy-jeyuk.png' WHERE id='prod-new-20261123-05';
