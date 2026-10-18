-- 돈키호테 쇼핑 순위: 에디터가 고른 필수템 목록 + 회원이 '살 거예요'로 담은 수로 순위를 매깁니다.
-- 목록(donki_items)은 관리자가 Supabase에서 수정하고, 담기(donki_picks)는 회원 본인만 추가·삭제합니다.

CREATE TABLE IF NOT EXISTS public.donki_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,                 -- 한국어 상품명
    name_ja TEXT,                       -- 매장에서 찾을 때 쓰는 일본어 표기
    brand TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('의약품', '화장품', '과자·식품', '생활용품')),
    price_yen INTEGER,                  -- 참고 가격(세전, 매장마다 다름)
    description TEXT NOT NULL,          -- 왜 사야 하는지 한 줄
    image_url TEXT,
    editor_rank INTEGER NOT NULL,       -- 담은 수가 같을 때의 순서
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.donki_picks (
    item_id TEXT NOT NULL REFERENCES public.donki_items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (item_id, user_id)
);

CREATE INDEX IF NOT EXISTS donki_picks_user_idx ON public.donki_picks (user_id);

ALTER TABLE public.donki_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donki_picks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS donki_items_read ON public.donki_items;
CREATE POLICY donki_items_read ON public.donki_items FOR SELECT USING (is_active);

DROP POLICY IF EXISTS donki_picks_read_own ON public.donki_picks;
CREATE POLICY donki_picks_read_own ON public.donki_picks FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS donki_picks_insert_own ON public.donki_picks;
CREATE POLICY donki_picks_insert_own ON public.donki_picks FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS donki_picks_delete_own ON public.donki_picks;
CREATE POLICY donki_picks_delete_own ON public.donki_picks FOR DELETE USING (auth.uid() = user_id);

-- 순위: 담은 회원 수(누가 담았는지는 노출하지 않음) 내림차순, 같으면 에디터 순서
CREATE OR REPLACE FUNCTION public.get_donki_ranking()
RETURNS TABLE (
    id TEXT, name TEXT, name_ja TEXT, brand TEXT, category TEXT, price_yen INTEGER,
    description TEXT, image_url TEXT, editor_rank INTEGER, pick_count BIGINT
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT i.id, i.name, i.name_ja, i.brand, i.category, i.price_yen,
           i.description, i.image_url, i.editor_rank, COUNT(p.user_id) AS pick_count
    FROM public.donki_items i
    LEFT JOIN public.donki_picks p ON p.item_id = i.id
    WHERE i.is_active
    GROUP BY i.id
    ORDER BY COUNT(p.user_id) DESC, i.editor_rank ASC;
$$;

GRANT EXECUTE ON FUNCTION public.get_donki_ranking() TO anon, authenticated;

INSERT INTO public.donki_items (id, name, name_ja, brand, category, price_yen, description, editor_rank) VALUES
  ('roihi-tsuboko', '로이히 츠보코 동전파스', 'ロイヒつぼ膏', '니치반', '의약품', 700, '어깨·허리 뭉친 곳에 붙이는 동전 크기 온열 파스. 돈키호테 쇼핑 1순위 단골템', 1),
  ('eve-quick', '이브 퀵 두통약', 'イブクイック頭痛薬', '에스에스제약', '의약품', 900, '빨리 듣는 두통·생리통 진통제. 여행 상비약으로 많이 사요', 2),
  ('kyusoku-jikan', '휴족시간', '休足時間', '라이온', '생활용품', 700, '많이 걸은 날 종아리에 붙이는 쿨링 시트. 여행 중에도 바로 써요', 3),
  ('megrhythm', '메구리즘 스팀 아이마스크', 'めぐりズム 蒸気でホットアイマスク', '카오', '생활용품', 1100, '따뜻한 증기가 나오는 일회용 안대. 비행기·숙소에서 쓰기 좋아요', 4),
  ('ohta-isan', '오타이산 위장약', '太田胃散', '오타이산', '의약품', 1000, '과식·소화불량에 먹는 가루 위장약. 부모님 선물로도 인기', 5),
  ('cabbagin', '캬베진 코와 알파', 'キャベジンコーワα', '코와', '의약품', 1500, '양배추 성분이 든 알약 위장약. 위가 약한 분들 재구매템', 6),
  ('biore-uv-aqua', '비오레 UV 아쿠아 리치 워터리 에센스', 'ビオレUV アクアリッチ ウォータリーエッセンス', '카오', '화장품', 900, '물처럼 가볍게 발리는 선크림. 한국보다 저렴하게 살 수 있어요', 7),
  ('melano-cc', '멜라노CC 비타민C 에센스', 'メラノCC 薬用しみ集中対策美容液', '로토제약', '화장품', 1000, '기미·잡티 케어용 비타민C 세럼. 작은 용량이라 선물용으로도 좋아요', 8),
  ('hadalabo-gokujyun', '하다라보 고쿠쥰 로션', '肌ラボ 極潤 ヒアルロン液', '로토제약', '화장품', 800, '히알루론산 보습 토너. 대용량 리필도 함께 팔아요', 9),
  ('senka-perfect-whip', '센카 퍼펙트 휩 클렌징폼', 'センカ パーフェクトホイップ', '센카', '화장품', 500, '쫀쫀한 거품의 세안제. 여러 개 묶어 사가는 스테디셀러', 10),
  ('kitkat-matcha', '킷캣 말차', 'キットカット 抹茶', '네슬레', '과자·식품', 450, '일본에서만 파는 말차 맛 킷캣. 회사·친구 선물용 대량 구매템', 11),
  ('jagabee', '자가비', 'じゃがビー', '가루비', '과자·식품', 250, '바삭한 감자 스틱 과자. 소포장이라 나눠주기 좋아요', 12),
  ('black-thunder', '블랙썬더', 'ブラックサンダー', '유라쿠제과', '과자·식품', 40, '쿠키가 든 초코바. 하나에 몇십 엔이라 낱개로 잔뜩 담아요', 13),
  ('kororo', '코로로 젤리', 'コロロ', 'UHA미각당', '과자·식품', 150, '진짜 과일 같은 식감의 젤리. 맛별로 골라 사는 재미', 14),
  ('salonpas', '사론파스', 'サロンパス', '히사미쓰제약', '의약품', 800, '근육통·결림용 붙이는 파스. 부모님 선물 단골', 15)
ON CONFLICT (id) DO NOTHING;

-- 2026-10-18: 상품 사진 (앱 번들 public/donki/*.jpg)
UPDATE public.donki_items SET image_url = '/donki/' || id || '.jpg' WHERE image_url IS NULL;
