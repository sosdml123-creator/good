-- Migration: 보안 점검 후속 조치 (트리거 함수 노출 축소, search_path 고정, SNS 토큰 테이블 권한 제거)
-- Created: 2026-11-04
-- (여러 번 실행해도 안전)
-- 적용: Supabase 대시보드 → SQL Editor 에서 이 파일 전체를 실행합니다.
-- 참고: 운영 DB 기준 Supabase 보안 린트(get_advisors security)에서 나온 항목만 다룹니다.

-- 1) 트리거 전용 함수는 트리거가 실행할 때 EXECUTE 권한을 확인하지 않으므로,
--    anon / authenticated 가 /rest/v1/rpc 로 직접 호출하지 못하도록 막아도 동작에는 영향이 없습니다.
REVOKE ALL ON FUNCTION public.fn_handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_recalc_product_rating() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_sync_review_likes_count() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_sync_post_likes_count() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_sync_review_comments_count() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_sync_post_comments_count() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.guard_profiles_points() FROM PUBLIC, anon, authenticated;

-- 2) search_path 고정: 호출하는 사람이 같은 이름의 객체를 앞선 스키마에 만들어 함수를 바꿔치기하지 못하게 합니다.
ALTER FUNCTION public.fn_recalc_product_rating() SET search_path = public;
ALTER FUNCTION public.fn_sync_review_likes_count() SET search_path = public;
ALTER FUNCTION public.fn_sync_post_likes_count() SET search_path = public;
ALTER FUNCTION public.fn_sync_review_comments_count() SET search_path = public;
ALTER FUNCTION public.fn_sync_post_comments_count() SET search_path = public;
ALTER FUNCTION public.protect_profiles_is_admin() SET search_path = public;

-- 3) SNS 연동 토큰 보관 테이블: RLS 정책이 없는 상태에 더해 클라이언트 역할의 테이블 권한도 제거합니다.
--    서버(service_role)는 계속 접근할 수 있습니다.
REVOKE ALL ON TABLE public.sns_secrets FROM PUBLIC, anon, authenticated;

NOTIFY pgrst, 'reload schema';
