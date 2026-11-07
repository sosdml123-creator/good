-- 농수산물 실구매 후기: 구매 가격·구매처 (선택 입력, 기존 후기는 비어 있음)
alter table public.reviews add column if not exists purchase_price integer check (purchase_price is null or (purchase_price > 0 and purchase_price < 100000000));
alter table public.reviews add column if not exists purchase_place text check (purchase_place is null or char_length(purchase_place) <= 30);
