-- 가입 닉네임을 항상 신상러버_숫자 로만 만듭니다.
-- 원인: DB 순번(profile_nickname_seq)과 앱이 따로 계산한 순번(현재 최대값+1)이 섞여,
--       앱이 먼저 쓴 번호를 DB 순번이 다시 뽑으면 중복 오류 → id 앞 10자리(16진수) 이름으로 대체되고 있었습니다.
-- 수정: 비어 있는 번호가 나올 때까지 순번을 넘기는 함수로 통일하고, 16진수 대체 이름을 없앱니다.

-- 1. 순번을 현재 최대 번호 이상으로 맞춤
SELECT setval(
    'public.profile_nickname_seq',
    GREATEST(
        (SELECT last_value FROM public.profile_nickname_seq),
        (SELECT COALESCE(MAX(SUBSTRING(display_name FROM '^신상러버_(\d{1,8})$')::INT), 0) FROM public.profiles)
    )
);

-- 2. 비어 있는 다음 번호 닉네임
CREATE OR REPLACE FUNCTION public.next_profile_nickname()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_name TEXT;
BEGIN
    LOOP
        v_name := '신상러버_' || LPAD(nextval('public.profile_nickname_seq')::TEXT, 3, '0');
        EXIT WHEN NOT EXISTS (
            SELECT 1 FROM public.profiles WHERE LOWER(BTRIM(display_name)) = LOWER(v_name)
        );
    END LOOP;
    RETURN v_name;
END;
$$;

REVOKE ALL ON FUNCTION public.next_profile_nickname() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.next_profile_nickname() TO authenticated;

-- 3. 가입 트리거: 중복이면 다음 번호로 다시 시도 (16진수 대체 없음)
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
    v_try INT := 0;
BEGIN
    LOOP
        BEGIN
            INSERT INTO public.profiles (id, display_name, avatar_url, level, points)
            VALUES (NEW.id, public.next_profile_nickname(), v_avatar, 'Lv.1', 100)
            ON CONFLICT (id) DO NOTHING;
            EXIT;
        EXCEPTION WHEN unique_violation THEN
            -- 같은 순간 다른 곳에서 같은 번호를 쓴 경우: 다음 번호로 재시도
            v_try := v_try + 1;
            IF v_try >= 20 THEN RAISE; END IF;
        END;
    END LOOP;
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'fn_handle_new_user failed: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- 4. 이미 16진수로 만들어진 닉네임을 숫자 순번으로 교체
UPDATE public.profiles
SET display_name = public.next_profile_nickname()
WHERE display_name ~ '^신상러버_' AND display_name !~ '^신상러버_\d+$';
