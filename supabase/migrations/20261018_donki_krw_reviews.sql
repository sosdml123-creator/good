-- 돈키호테 가이드: 한국 판매가 비교 + 상품 리뷰

ALTER TABLE public.donki_items ADD COLUMN IF NOT EXISTS price_krw INTEGER;     -- 국내 온라인 최저가 (원)
ALTER TABLE public.donki_items ADD COLUMN IF NOT EXISTS krw_note TEXT;         -- 기준 용량·구매처 안내
ALTER TABLE public.donki_items ADD COLUMN IF NOT EXISTS krw_checked_on DATE;   -- 가격 조사일

CREATE TABLE IF NOT EXISTS public.donki_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id TEXT NOT NULL REFERENCES public.donki_items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS donki_reviews_item_idx ON public.donki_reviews (item_id, created_at DESC);

ALTER TABLE public.donki_reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS donki_reviews_read ON public.donki_reviews;
CREATE POLICY donki_reviews_read ON public.donki_reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS donki_reviews_insert_own ON public.donki_reviews;
CREATE POLICY donki_reviews_insert_own ON public.donki_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS donki_reviews_delete_own ON public.donki_reviews;
CREATE POLICY donki_reviews_delete_own ON public.donki_reviews FOR DELETE USING (auth.uid() = user_id);

DROP FUNCTION IF EXISTS public.get_donki_ranking();
CREATE FUNCTION public.get_donki_ranking()
RETURNS TABLE (
    id TEXT, name TEXT, name_ja TEXT, brand TEXT, category TEXT, price_yen INTEGER,
    description TEXT, image_url TEXT, editor_rank INTEGER, badge TEXT,
    price_krw INTEGER, krw_note TEXT, krw_checked_on DATE,
    pick_count BIGINT, review_count BIGINT, avg_rating NUMERIC
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT i.id, i.name, i.name_ja, i.brand, i.category, i.price_yen,
           i.description, i.image_url, i.editor_rank, i.badge,
           i.price_krw, i.krw_note, i.krw_checked_on,
           (SELECT COUNT(*) FROM public.donki_picks p WHERE p.item_id = i.id) AS pick_count,
           (SELECT COUNT(*) FROM public.donki_reviews r WHERE r.item_id = i.id) AS review_count,
           (SELECT ROUND(AVG(r.rating)::numeric, 1) FROM public.donki_reviews r WHERE r.item_id = i.id) AS avg_rating
    FROM public.donki_items i
    WHERE i.is_active
    ORDER BY pick_count DESC, i.editor_rank ASC;
$$;
GRANT EXECUTE ON FUNCTION public.get_donki_ranking() TO anon, authenticated;

-- 2026-10-18 다나와 기준 국내 온라인 최저가 (같은 제품·용량만 비교)
UPDATE public.donki_items AS i SET price_krw = v.krw, krw_note = v.note, krw_checked_on = DATE '2026-10-18'
FROM (VALUES
  ('kyusoku-jikan', 10360, '18매 기준'),
  ('megrhythm', 11230, '무향 12매 기준'),
  ('biore-uv-aqua', 9200, '70g 기준'),
  ('melano-cc', 13900, '미용액 20ml 기준'),
  ('hadalabo-gokujyun', 6710, '로션 170ml 기준'),
  ('senka-perfect-whip', 2800, '120g 기준'),
  ('kitkat-matcha', 6670, '미니 10개입 기준'),
  ('kororo', 2160, '48g 1봉 기준'),
  ('roihi-tsuboko', NULL, '국내 정식 판매가 없어 해외직구 상품만 있어요'),
  ('eve-quick', NULL, '국내 정식 판매가 없어 해외직구 상품만 있어요'),
  ('ohta-isan', NULL, '국내 정식 판매가 없어 해외직구 상품만 있어요'),
  ('cabbagin', NULL, '국내 정식 판매가 없어 해외직구 상품만 있어요'),
  ('salonpas', NULL, '일본판 140매는 해외직구 상품만 있어요'),
  ('jagabee', NULL, '국내 자가비는 해태 생산 제품이라 맛·구성이 달라요'),
  ('black-thunder', NULL, '국내에선 대용량 묶음으로만 팔아요')
) AS v(id, krw, note)
WHERE i.id = v.id;
