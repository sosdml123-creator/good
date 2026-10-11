-- 신상 배틀: 주 단위 대결(월~금 투표, 토·일 결과 공개, 월요일 새 대결)과 회원별 투표
-- 읽기·쓰기는 모두 /api/battle (service role) 로만 처리하므로 RLS 정책은 두지 않습니다.

CREATE TABLE IF NOT EXISTS public.battle_rounds (
    week_key TEXT PRIMARY KEY,              -- 해당 주 월요일 날짜 (KST, YYYY-MM-DD)
    product_a_id TEXT NOT NULL,
    product_b_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.battle_votes (
    week_key TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    choice TEXT NOT NULL CHECK (choice IN ('A', 'B')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (week_key, user_id)
);

CREATE INDEX IF NOT EXISTS battle_votes_week_choice_idx ON public.battle_votes (week_key, choice);

ALTER TABLE public.battle_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_votes ENABLE ROW LEVEL SECURITY;
