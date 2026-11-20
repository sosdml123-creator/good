-- 가입 온보딩 동의 기록 (이용약관·개인정보·만 14세·마케팅·야간 혜택)
-- profiles 는 누구나 읽을 수 있어서 동의 정보는 본인만 읽고 쓰는 별도 테이블에 둡니다.
CREATE TABLE IF NOT EXISTS public.user_consents (
    user_id                 UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    terms_version           TEXT NOT NULL,
    terms_agreed_at         TIMESTAMPTZ NOT NULL,
    privacy_agreed_at       TIMESTAMPTZ NOT NULL,
    age_confirmed           BOOLEAN NOT NULL DEFAULT FALSE,
    marketing_agreed        BOOLEAN NOT NULL DEFAULT FALSE,
    marketing_updated_at    TIMESTAMPTZ,
    night_agreed            BOOLEAN NOT NULL DEFAULT FALSE,
    onboarding_completed_at TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own consents select" ON public.user_consents;
DROP POLICY IF EXISTS "own consents insert" ON public.user_consents;
DROP POLICY IF EXISTS "own consents update" ON public.user_consents;
CREATE POLICY "own consents select" ON public.user_consents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own consents insert" ON public.user_consents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own consents update" ON public.user_consents FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
