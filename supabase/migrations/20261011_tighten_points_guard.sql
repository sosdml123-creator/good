-- Migration: Tighten profiles.points guard to the new earning policy
-- Created: 2026-10-11
--
-- 적립 정책 축소(src/constants/pointPolicy.ts)에 맞춰 서버 상한도 낮춥니다.
--   1회 최대 적립: 100P → 50P   (리뷰 1건 최대 30P)
--   1일 최대 적립: 1,000P → 100P
-- 가입 시 기본 100P, 관리자/service_role 예외, 감소 무제한은 그대로입니다.
-- Supabase 대시보드 → SQL Editor 에서 이 파일 전체를 실행하세요. (여러 번 실행해도 안전)

CREATE OR REPLACE FUNCTION public.guard_profiles_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    c_step CONSTANT INT := 50;    -- 1회 최대 적립
    c_daily CONSTANT INT := 100;  -- 1일 최대 적립
    v_today DATE := (NOW() AT TIME ZONE 'Asia/Seoul')::DATE;
    v_delta INT;
    v_earned INT;
    v_allowed INT;
BEGIN
    IF COALESCE(auth.role(), '') NOT IN ('anon', 'authenticated') THEN
        RETURN NEW;
    END IF;
    IF EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true) THEN
        RETURN NEW;
    END IF;

    IF TG_OP = 'INSERT' THEN
        -- upsert 는 기존 행이 있어도 INSERT 트리거를 먼저 거치므로, 신규 행일 때만 가입 포인트로 제한
        IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = NEW.id) THEN
            NEW.points := LEAST(COALESCE(NEW.points, 100), 100);
        END IF;
        RETURN NEW;
    END IF;

    v_delta := COALESCE(NEW.points, 0) - COALESCE(OLD.points, 0);
    IF v_delta <= 0 THEN
        RETURN NEW;
    END IF;

    SELECT earned INTO v_earned FROM point_earn_daily WHERE user_id = OLD.id AND day = v_today;
    v_allowed := GREATEST(0, LEAST(v_delta, c_step, c_daily - COALESCE(v_earned, 0)));
    NEW.points := COALESCE(OLD.points, 0) + v_allowed;

    IF v_allowed > 0 THEN
        INSERT INTO point_earn_daily (user_id, day, earned)
        VALUES (OLD.id, v_today, v_allowed)
        ON CONFLICT (user_id, day) DO UPDATE SET earned = point_earn_daily.earned + EXCLUDED.earned;
    END IF;

    RETURN NEW;
END;
$$;
