-- 계정 연결이 끊긴(user_id NULL) 기기 토큰을 로그인한 사용자가 다시 연결할 수 있게 합니다.
-- 예전 앱 빌드는 anon 키로 device_tokens 를 직접 upsert 하는데, UPDATE 정책이 auth.uid() = user_id 만 허용해서
-- 한 번 user_id 가 NULL 이 된 행은 영원히 다시 연결되지 않았습니다 (조용히 0건 수정).
-- 바뀐 점: 기존 행이 NULL 이면 로그인 사용자가 자기 것으로만(user_id = auth.uid() 또는 NULL 유지) 고칠 수 있습니다.
DROP POLICY IF EXISTS "Users can update own device tokens" ON public.device_tokens;
CREATE POLICY "Users can update own device tokens" ON public.device_tokens
    FOR UPDATE
    USING ((auth.uid() = user_id) OR (user_id IS NULL) OR (auth.role() = 'service_role'))
    WITH CHECK ((auth.uid() = user_id) OR (user_id IS NULL) OR (auth.role() = 'service_role'));
