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
