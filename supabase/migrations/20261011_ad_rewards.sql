-- Migration: 보상형 광고(AdMob) 시청 포인트 적립 기록 + 적립 함수
-- Created: 2026-10-11
--
-- /api/admob-reward (AdMob 서버 간 확인 콜백)가 service_role 키로만 호출합니다.
-- Supabase 대시보드 → SQL Editor 에서 이 파일 전체를 실행하세요. (여러 번 실행해도 안전)

CREATE TABLE IF NOT EXISTS public.ad_rewards (
    transaction_id TEXT PRIMARY KEY,       -- AdMob 이 보내는 거래 ID (중복 적립 방지)
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    points INT NOT NULL CHECK (points > 0),
    ad_unit TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ad_rewards_user_created_idx ON public.ad_rewards (user_id, created_at DESC);

ALTER TABLE public.ad_rewards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own ad rewards" ON public.ad_rewards;
CREATE POLICY "Users can view own ad rewards" ON public.ad_rewards
FOR SELECT USING (auth.uid() = user_id);

-- 같은 거래는 한 번만, 1인 하루 횟수 한도 안에서만 적립합니다.
CREATE OR REPLACE FUNCTION public.ad_reward_grant(
    p_user UUID,
    p_transaction_id TEXT,
    p_points INT,
    p_daily_limit INT,
    p_ad_unit TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_points INT;
    v_today INT;
    v_day_start TIMESTAMPTZ := date_trunc('day', NOW() AT TIME ZONE 'Asia/Seoul') AT TIME ZONE 'Asia/Seoul';
BEGIN
    IF p_points IS NULL OR p_points <= 0 THEN
        RETURN jsonb_build_object('ok', false, 'reason', 'invalid');
    END IF;

    -- 같은 회원의 동시 요청을 직렬화
    SELECT COALESCE(points, 0) INTO v_points FROM profiles WHERE id = p_user FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('ok', false, 'reason', 'no_profile');
    END IF;

    IF EXISTS (SELECT 1 FROM ad_rewards WHERE transaction_id = p_transaction_id) THEN
        RETURN jsonb_build_object('ok', true, 'duplicate', true, 'balance', v_points);
    END IF;

    SELECT COUNT(*) INTO v_today FROM ad_rewards WHERE user_id = p_user AND created_at >= v_day_start;
    IF v_today >= p_daily_limit THEN
        RETURN jsonb_build_object('ok', false, 'reason', 'daily_limit', 'balance', v_points);
    END IF;

    INSERT INTO ad_rewards (transaction_id, user_id, points, ad_unit)
    VALUES (p_transaction_id, p_user, p_points, p_ad_unit);

    UPDATE profiles SET points = v_points + p_points, updated_at = NOW() WHERE id = p_user;

    RETURN jsonb_build_object('ok', true, 'balance', v_points + p_points);
END;
$$;

REVOKE ALL ON FUNCTION public.ad_reward_grant(UUID, TEXT, INT, INT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ad_reward_grant(UUID, TEXT, INT, INT, TEXT) TO service_role;
