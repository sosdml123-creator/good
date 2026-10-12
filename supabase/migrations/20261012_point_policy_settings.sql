-- Migration: 포인트 정책을 어드민 저장값에서 읽도록 변경
-- Created: 2026-10-12
--
-- 어드민 '포인트 정책·지급/회수' 메뉴에서 저장한 값은 시스템 레코드
-- (products.id = '__sinsangpick_system_banners__' 의 nutrition.pointPolicy)에 들어갑니다.
-- profiles.points 가드 트리거가 고정 숫자 대신 이 값을 읽습니다.
--   review   → 1회 최대 적립 (기본 10P)
--   dailyCap → 1일 최대 적립 (기본 100P)
--   signup   → 가입 시 기본 포인트 (기본 100P)
-- 저장값이 없거나 잘못된 경우 기본값을 씁니다. 관리자/service_role 예외, 감소 무제한은 그대로입니다.
-- Supabase 대시보드 → SQL Editor 에서 이 파일 전체를 실행하세요. (여러 번 실행해도 안전)

CREATE OR REPLACE FUNCTION public.point_policy_value(p_key TEXT, p_default INT, p_max INT)
RETURNS INT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v INT;
BEGIN
    SELECT (to_jsonb(nutrition) -> 'pointPolicy' ->> p_key)::INT INTO v
    FROM products
    WHERE id = '__sinsangpick_system_banners__';
    RETURN LEAST(GREATEST(COALESCE(v, p_default), 0), p_max);
EXCEPTION WHEN OTHERS THEN
    RETURN p_default;
END;
$$;

REVOKE ALL ON FUNCTION public.point_policy_value(TEXT, INT, INT) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.guard_profiles_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_today DATE := (NOW() AT TIME ZONE 'Asia/Seoul')::DATE;
    v_step INT;
    v_daily INT;
    v_delta INT;
    v_earned INT;
    v_allowed INT;
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- 관리자 API(service_role)가 넣는 행은 그대로 둡니다
        IF COALESCE(auth.role(), '') = 'service_role' THEN
            RETURN NEW;
        END IF;
        -- upsert 는 기존 행이 있어도 INSERT 트리거를 먼저 거치므로, 신규 행일 때만 가입 포인트를 적용
        IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = NEW.id) THEN
            NEW.points := point_policy_value('signup', 100, 10000);
        END IF;
        RETURN NEW;
    END IF;

    IF COALESCE(auth.role(), '') NOT IN ('anon', 'authenticated') THEN
        RETURN NEW;
    END IF;
    IF EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true) THEN
        RETURN NEW;
    END IF;

    v_delta := COALESCE(NEW.points, 0) - COALESCE(OLD.points, 0);
    IF v_delta <= 0 THEN
        RETURN NEW;
    END IF;

    v_step := point_policy_value('review', 10, 1000);
    v_daily := point_policy_value('dailyCap', 100, 10000);

    SELECT earned INTO v_earned FROM point_earn_daily WHERE user_id = OLD.id AND day = v_today;
    v_allowed := GREATEST(0, LEAST(v_delta, v_step, v_daily - COALESCE(v_earned, 0)));
    NEW.points := COALESCE(OLD.points, 0) + v_allowed;

    IF v_allowed > 0 THEN
        INSERT INTO point_earn_daily (user_id, day, earned)
        VALUES (OLD.id, v_today, v_allowed)
        ON CONFLICT (user_id, day) DO UPDATE SET earned = point_earn_daily.earned + EXCLUDED.earned;
    END IF;

    RETURN NEW;
END;
$$;
