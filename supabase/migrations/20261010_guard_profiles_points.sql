-- Migration: Guard profiles.points against client-side inflation
-- Created: 2026-10-10
--
-- 포인트가 실제 e쿠폰(비즈머니)으로 교환되므로, 로그인한 유저가 자신의 profiles.points 를
-- 임의의 큰 값으로 바꿔 쿠폰을 받아가는 것을 막습니다.
-- 클라이언트(anon / authenticated) 요청으로는 한 번에 +100P, 하루(KST) 합계 +1,000P 까지만
-- 늘어나며, 초과분은 에러 없이 잘려서 저장됩니다. 감소는 제한하지 않습니다.
-- 관리자(is_admin) 계정, service_role 키, Supabase SQL Editor 는 제한 없이 변경할 수 있습니다.
-- Supabase 대시보드 → SQL Editor 에서 이 파일 전체를 실행하세요. (여러 번 실행해도 안전)

CREATE TABLE IF NOT EXISTS public.point_earn_daily (
    user_id UUID NOT NULL,
    day DATE NOT NULL,
    earned INT NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, day)
);

-- 정책 없음: 트리거 함수(SECURITY DEFINER)와 service_role 만 접근
ALTER TABLE public.point_earn_daily ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.guard_profiles_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    c_step CONSTANT INT := 100;    -- 1회 최대 적립
    c_daily CONSTANT INT := 1000;  -- 1일 최대 적립
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

DROP TRIGGER IF EXISTS guard_profiles_points ON public.profiles;
CREATE TRIGGER guard_profiles_points
    BEFORE INSERT OR UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.guard_profiles_points();

-- 이미 비정상적으로 포인트가 많은 계정이 있는지 확인:
--   SELECT id, display_name, points FROM public.profiles ORDER BY points DESC LIMIT 20;
