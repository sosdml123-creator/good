-- Migration: Protect profiles.is_admin from self-escalation
-- Created: 2026-10-10
--
-- "Users can update own profile" 정책은 컬럼 제한이 없어, 로그인한 유저가 자신의
-- is_admin 값을 직접 true 로 바꿀 수 있습니다. 관리자 콘솔 접속과 관리자 전용 API가
-- is_admin 에 의존하므로, 클라이언트(anon / authenticated) 요청으로는 값이 바뀌지 않게 막습니다.
-- service_role 키와 Supabase SQL Editor 에서는 계속 변경할 수 있습니다.

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

CREATE OR REPLACE FUNCTION public.protect_profiles_is_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF COALESCE(auth.role(), '') IN ('anon', 'authenticated') THEN
        IF TG_OP = 'INSERT' THEN
            NEW.is_admin := false;
        ELSE
            NEW.is_admin := OLD.is_admin;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profiles_is_admin ON public.profiles;
CREATE TRIGGER protect_profiles_is_admin
    BEFORE INSERT OR UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_profiles_is_admin();

-- 이미 스스로 권한을 올린 계정이 있는지 확인:
--   SELECT id, display_name, email, provider FROM public.profiles WHERE is_admin = true;
--
-- 관리자 권한 부여 (관리자 콘솔 접속 화면에 표시되는 "내 계정 ID" 사용):
--   UPDATE public.profiles SET is_admin = true WHERE id = '<계정 ID>';
