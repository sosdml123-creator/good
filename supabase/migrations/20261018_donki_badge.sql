-- 돈키호테 필수템 카드 오른쪽 위 작은 라벨 (관리자 탭에서 수정)
ALTER TABLE public.donki_items ADD COLUMN IF NOT EXISTS badge TEXT;

DROP FUNCTION IF EXISTS public.get_donki_ranking();
CREATE FUNCTION public.get_donki_ranking()
RETURNS TABLE (
    id TEXT, name TEXT, name_ja TEXT, brand TEXT, category TEXT, price_yen INTEGER,
    description TEXT, image_url TEXT, editor_rank INTEGER, badge TEXT, pick_count BIGINT
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT i.id, i.name, i.name_ja, i.brand, i.category, i.price_yen,
           i.description, i.image_url, i.editor_rank, i.badge, COUNT(p.user_id) AS pick_count
    FROM public.donki_items i
    LEFT JOIN public.donki_picks p ON p.item_id = i.id
    WHERE i.is_active
    GROUP BY i.id
    ORDER BY COUNT(p.user_id) DESC, i.editor_rank ASC;
$$;
GRANT EXECUTE ON FUNCTION public.get_donki_ranking() TO anon, authenticated;

UPDATE public.donki_items AS i SET badge = v.badge FROM (VALUES
  ('roihi-tsuboko', '스테디셀러'), ('eve-quick', '여행 상비약'), ('kyusoku-jikan', '여행 필수'),
  ('megrhythm', '선물 추천'), ('ohta-isan', '부모님 선물'), ('cabbagin', '재구매템'),
  ('biore-uv-aqua', '가성비'), ('melano-cc', '화제템'), ('hadalabo-gokujyun', '스테디셀러'),
  ('senka-perfect-whip', '묶음 구매'), ('kitkat-matcha', '선물용'), ('jagabee', '나눠주기 좋음'),
  ('black-thunder', '가성비'), ('kororo', '화제템'), ('salonpas', '부모님 선물')
) AS v(id, badge)
WHERE i.id = v.id AND i.badge IS NULL;
