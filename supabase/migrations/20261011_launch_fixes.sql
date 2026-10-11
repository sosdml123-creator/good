-- Migration: 출시 전 점검에서 나온 서버 쪽 수정
-- Created: 2026-10-11
-- (여러 번 실행해도 안전)

-- 1. 회원 탈퇴 RPC — 프로덕션에 없어서 탈퇴해도 계정·프로필이 남았습니다. (App Store 5.1.1(v))
--    auth.users 삭제 시 profiles/reviews/댓글/좋아요/게시글/배틀 투표는 FK CASCADE 로 함께 지워지고,
--    coupon_orders/ad_rewards 는 user_id 만 NULL 로 남습니다(정산 기록).
CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    v_uid UUID := auth.uid();
BEGIN
    IF v_uid IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    DELETE FROM public.device_tokens WHERE user_id = v_uid;
    DELETE FROM public.point_earn_daily WHERE user_id = v_uid;
    DELETE FROM public.point_transactions WHERE user_id = v_uid;
    DELETE FROM public.user_sanctions WHERE user_id = v_uid;
    DELETE FROM auth.users WHERE id = v_uid;
END;
$$;
REVOKE ALL ON FUNCTION public.delete_user_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_user_account() TO authenticated;

-- 2. 가입 시 프로필 생성 — 카카오 실명/프로필 사진이 공개 테이블(profiles)에 그대로 들어가던 문제.
--    실명 대신 순번 닉네임(신상러버_NNN)을, 사진 대신 로고를 넣습니다.
CREATE SEQUENCE IF NOT EXISTS public.profile_nickname_seq;
SELECT setval(
    'public.profile_nickname_seq',
    GREATEST(
        (SELECT last_value FROM public.profile_nickname_seq),
        (SELECT COALESCE(MAX(SUBSTRING(display_name FROM '^신상러버_(\d{1,8})$')::INT), 0) FROM public.profiles)
    )
);

CREATE OR REPLACE FUNCTION public.fn_handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_avatar TEXT := CASE COALESCE(NEW.raw_app_meta_data->>'provider', '')
        WHEN 'kakao' THEN '/logo.png?prov=kakao'
        WHEN 'apple' THEN '/logo.png?prov=apple'
        ELSE '/logo.png'
    END;
BEGIN
    BEGIN
        INSERT INTO public.profiles (id, display_name, avatar_url, level, points)
        VALUES (NEW.id, '신상러버_' || LPAD(nextval('public.profile_nickname_seq')::TEXT, 3, '0'), v_avatar, 'Lv.1', 100)
        ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN unique_violation THEN
        -- 누군가 같은 순번 닉네임을 직접 쓰고 있는 경우: 가입이 막히지 않게 id 기반 이름으로 대체
        INSERT INTO public.profiles (id, display_name, avatar_url, level, points)
        VALUES (NEW.id, '신상러버_' || SUBSTRING(REPLACE(NEW.id::TEXT, '-', ''), 1, 10), v_avatar, 'Lv.1', 100)
        ON CONFLICT (id) DO NOTHING;
    END;
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'fn_handle_new_user failed: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- 3. 이미 들어가 있는 실명 닉네임·임시 사진 정리, 중복 닉네임 해소 후 닉네임 유일 제약
UPDATE public.profiles p
SET display_name = '신상러버_' || LPAD(nextval('public.profile_nickname_seq')::TEXT, 3, '0'),
    avatar_url = CASE COALESCE(u.raw_app_meta_data->>'provider', '')
        WHEN 'kakao' THEN '/logo.png?prov=kakao'
        WHEN 'apple' THEN '/logo.png?prov=apple'
        ELSE '/logo.png'
    END
FROM auth.users u
WHERE u.id = p.id
  AND p.display_name IN (
      u.raw_user_meta_data->>'full_name',
      u.raw_user_meta_data->>'name',
      u.raw_user_meta_data->>'nickname',
      u.raw_user_meta_data->>'preferred_username'
  );

UPDATE public.profiles p
SET display_name = '신상러버_' || LPAD(nextval('public.profile_nickname_seq')::TEXT, 3, '0')
WHERE p.id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY LOWER(BTRIM(display_name)) ORDER BY created_at, id) AS rn
        FROM public.profiles
    ) d WHERE d.rn > 1
);

UPDATE public.reviews r SET user_name = p.display_name
FROM public.profiles p WHERE p.id = r.user_id AND r.user_name IS DISTINCT FROM p.display_name;
UPDATE public.community_posts c SET author_name = p.display_name
FROM public.profiles p WHERE p.id = c.author_id AND c.author_name IS DISTINCT FROM p.display_name;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_display_name_unique
    ON public.profiles (LOWER(BTRIM(display_name)));

-- 4. 상품 쓰기 권한 — 로그인한 아무 회원이나 상품을 추가/수정할 수 있었습니다. 관리자만 허용합니다.
--    (관리자 저장은 /api/site-content 의 service role 로 이뤄지고, 평점 집계는 SECURITY DEFINER 트리거가 처리)
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- 5. 뷰가 만든 사람 권한으로 실행되던 것(SECURITY DEFINER)을 조회자 권한으로
ALTER VIEW public.popular_products_view SET (security_invoker = true);
ALTER VIEW public.popular_community_posts_view SET (security_invoker = true);

-- 6. 프로필·리뷰 사진 저장소 — 지금까지 사진을 base64 문자열로 DB 행에 넣어 목록 조회가 무거워졌습니다.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('user-uploads', 'user-uploads', true, 3145728, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users can upload own images" ON storage.objects;
CREATE POLICY "Users can upload own images" ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'user-uploads' AND auth.uid()::TEXT = (storage.foldername(name))[1]);
DROP POLICY IF EXISTS "Users can replace own images" ON storage.objects;
CREATE POLICY "Users can replace own images" ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'user-uploads' AND auth.uid()::TEXT = (storage.foldername(name))[1]);
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
CREATE POLICY "Users can delete own images" ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'user-uploads' AND auth.uid()::TEXT = (storage.foldername(name))[1]);

NOTIFY pgrst, 'reload schema';
