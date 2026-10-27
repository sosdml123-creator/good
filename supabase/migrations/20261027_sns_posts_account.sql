-- =========================================================
-- Migration: SNS 게시 계정 구분 (인스타 계정 2개: kr = 신상픽 기본 계정, jp = 일본어 버전 계정)
-- 기존 행은 모두 kr. 계정별 인스타 토큰은 sns_secrets 의 ig_user_id_jp / ig_token_jp 에 둔다.
-- 스레드는 kr 계정만 쓴다 (account = 'jp' 는 instagram 글만 허용).
-- =========================================================

ALTER TABLE public.sns_posts
    ADD COLUMN IF NOT EXISTS account TEXT NOT NULL DEFAULT 'kr' CHECK (account IN ('kr', 'jp'));

ALTER TABLE public.sns_posts DROP CONSTRAINT IF EXISTS sns_posts_account_channel_check;
ALTER TABLE public.sns_posts
    ADD CONSTRAINT sns_posts_account_channel_check CHECK (account = 'kr' OR channel = 'instagram');
