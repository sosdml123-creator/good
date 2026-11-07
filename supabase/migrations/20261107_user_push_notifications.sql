-- =========================================================
-- 개인 알림 + 실제 기기 푸시 (댓글 · 좋아요 · 포인트 적립)
--
-- 흐름: 이벤트(댓글/좋아요/포인트) INSERT
--        → 트리거가 user_notifications(앱 알림함) 한 줄 생성  (dedup_key 로 같은 알림 중복 방지)
--        → push_outbox(발송 큐) 한 줄 생성
--        → pg_net 으로 /api/send-fcm {action:'dispatch'} 즉시 호출 (서버가 APNs·FCM 발송)
--        → 실패하면 push_outbox 에 오류를 남기고 1분·5분·30분·2시간 뒤 다시 시도 (pg_cron 1분 주기)
--
-- 기기 설정(댓글/좋아요/새 콘텐츠 알림)은 device_tokens 의 push_* 컬럼에, 계정 단위 설정은
-- notification_settings 에 저장합니다. 이벤트·혜택 알림은 기존 marketing_agreed 를 그대로 씁니다.
-- =========================================================

-- 1. 기기별 알림 종류 설정 (기본값: 켜짐)
ALTER TABLE public.device_tokens
    ADD COLUMN IF NOT EXISTS push_comment BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS push_like BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS push_content BOOLEAN NOT NULL DEFAULT TRUE;

-- 2. 계정 단위 알림 설정 (다른 기기로 로그인해도 같은 설정을 불러옵니다)
CREATE TABLE IF NOT EXISTS public.notification_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    push_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    comment_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    like_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    content_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    event_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own notification settings select" ON public.notification_settings;
CREATE POLICY "own notification settings select" ON public.notification_settings
    FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "own notification settings insert" ON public.notification_settings;
CREATE POLICY "own notification settings insert" ON public.notification_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "own notification settings update" ON public.notification_settings;
CREATE POLICY "own notification settings update" ON public.notification_settings
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3. 개인 알림함 (본인만 조회 · 읽음 처리 · 삭제)
CREATE TABLE IF NOT EXISTS public.user_notifications (
    id TEXT PRIMARY KEY DEFAULT ('un-' || replace(gen_random_uuid()::text, '-', '')),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    kind TEXT NOT NULL CHECK (kind IN ('comment', 'like', 'point', 'content', 'event', 'notice')),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    target_type TEXT NOT NULL DEFAULT 'none',   -- post | review | product | points | notice | event | none
    target_id TEXT,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,     -- 예: { "productId": "...", "commentId": "..." }
    dedup_key TEXT UNIQUE,                       -- 같은 사건으로 알림이 두 번 생기지 않게 합니다
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_user_notifications_user ON public.user_notifications (user_id, created_at DESC);
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own user notifications select" ON public.user_notifications;
CREATE POLICY "own user notifications select" ON public.user_notifications
    FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "own user notifications update" ON public.user_notifications;
CREATE POLICY "own user notifications update" ON public.user_notifications
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "own user notifications delete" ON public.user_notifications;
CREATE POLICY "own user notifications delete" ON public.user_notifications
    FOR DELETE USING (auth.uid() = user_id);
-- 앱(로그인 사용자)은 읽음 상태만 바꿀 수 있습니다. 알림 생성은 트리거(서버)만 합니다.
REVOKE INSERT, UPDATE ON public.user_notifications FROM anon, authenticated;
GRANT SELECT, DELETE ON public.user_notifications TO authenticated;
GRANT UPDATE (is_read, read_at) ON public.user_notifications TO authenticated;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_notifications;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 4. 푸시 발송 큐 (서비스 키 전용: 앱에서는 보이지 않음)
CREATE TABLE IF NOT EXISTS public.push_outbox (
    id BIGSERIAL PRIMARY KEY,
    notification_id TEXT NOT NULL UNIQUE REFERENCES public.user_notifications(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sending', 'sent', 'failed', 'skipped')),
    attempts INT NOT NULL DEFAULT 0,
    next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    locked_at TIMESTAMPTZ,
    last_error TEXT,
    result JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sent_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_push_outbox_due ON public.push_outbox (status, next_attempt_at);
ALTER TABLE public.push_outbox ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.push_outbox FROM anon, authenticated;

-- 5. 발송 서버를 깨우는 함수 (pg_net 비동기 호출, 응답을 기다리지 않음)
CREATE OR REPLACE FUNCTION public.kick_push_dispatch()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
    PERFORM net.http_post(
        url := 'https://www.sinsangpick.kr/api/send-fcm',
        body := '{"action":"dispatch"}'::jsonb,
        headers := '{"Content-Type":"application/json"}'::jsonb,
        timeout_milliseconds := 30000
    );
EXCEPTION WHEN OTHERS THEN
    -- 호출 실패해도 알림 저장은 막지 않습니다 (크론이 다시 시도)
    NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.kick_push_dispatch() FROM PUBLIC, anon, authenticated;

-- 6. 알림이 생기면 큐에 넣고 발송 서버를 깨웁니다
CREATE OR REPLACE FUNCTION public.fn_enqueue_user_push()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.push_outbox (notification_id, user_id)
    VALUES (NEW.id, NEW.user_id)
    ON CONFLICT (notification_id) DO NOTHING;
    PERFORM public.kick_push_dispatch();
    RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS tr_enqueue_user_push ON public.user_notifications;
CREATE TRIGGER tr_enqueue_user_push
    AFTER INSERT ON public.user_notifications
    FOR EACH ROW EXECUTE FUNCTION public.fn_enqueue_user_push();

-- 7. 발송 서버가 큐에서 처리할 항목을 가져갑니다 (동시에 두 번 보내지 않도록 잠금)
CREATE OR REPLACE FUNCTION public.claim_push_outbox(p_limit INT DEFAULT 50)
RETURNS TABLE (
    outbox_id BIGINT,
    notification_id TEXT,
    user_id UUID,
    attempts INT,
    kind TEXT,
    title TEXT,
    body TEXT,
    target_type TEXT,
    target_id TEXT,
    data JSONB,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    WITH due AS (
        SELECT o.id
        FROM public.push_outbox o
        WHERE (o.status = 'pending' AND o.next_attempt_at <= NOW())
           OR (o.status = 'sending' AND o.locked_at < NOW() - INTERVAL '5 minutes')
        ORDER BY o.id
        LIMIT GREATEST(1, LEAST(p_limit, 200))
        FOR UPDATE SKIP LOCKED
    ), claimed AS (
        UPDATE public.push_outbox o
        SET status = 'sending', attempts = o.attempts + 1, locked_at = NOW()
        FROM due
        WHERE o.id = due.id
        RETURNING o.id, o.notification_id, o.user_id, o.attempts
    )
    SELECT c.id, c.notification_id, c.user_id, c.attempts,
           n.kind, n.title, n.body, n.target_type, n.target_id, n.data, n.created_at
    FROM claimed c
    JOIN public.user_notifications n ON n.id = c.notification_id;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_push_outbox(INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_push_outbox(INT) TO service_role;

-- 8. 알림 생성 도우미
CREATE OR REPLACE FUNCTION public.create_user_notification(
    p_user_id UUID, p_kind TEXT, p_title TEXT, p_body TEXT,
    p_target_type TEXT, p_target_id TEXT, p_data JSONB, p_dedup_key TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF p_user_id IS NULL THEN RETURN; END IF;
    INSERT INTO public.user_notifications (user_id, kind, title, body, target_type, target_id, data, dedup_key)
    VALUES (p_user_id, p_kind, left(p_title, 100), left(p_body, 300), p_target_type, p_target_id,
            COALESCE(p_data, '{}'::jsonb), p_dedup_key)
    ON CONFLICT (dedup_key) DO NOTHING;
EXCEPTION WHEN foreign_key_violation THEN
    NULL; -- 탈퇴한 사용자
END;
$$;
REVOKE ALL ON FUNCTION public.create_user_notification(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.notif_actor_name(p_user_id UUID, p_fallback TEXT)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COALESCE(NULLIF(trim(p_fallback), ''),
                    (SELECT NULLIF(trim(display_name), '') FROM public.profiles WHERE id = p_user_id),
                    '누군가');
$$;
REVOKE ALL ON FUNCTION public.notif_actor_name(UUID, TEXT) FROM PUBLIC, anon, authenticated;

-- 9. 이벤트 트리거 (본인 행동은 알리지 않습니다)
-- 9-1. 게시글 댓글 → 글쓴이
CREATE OR REPLACE FUNCTION public.fn_notify_post_comment()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_post RECORD;
BEGIN
    SELECT author_id, title INTO v_post FROM public.community_posts WHERE id = NEW.post_id;
    IF v_post.author_id IS NULL OR v_post.author_id = NEW.user_id THEN RETURN NEW; END IF;
    PERFORM public.create_user_notification(
        v_post.author_id, 'comment',
        '💬 내 글에 새 댓글',
        public.notif_actor_name(NEW.user_id, NEW.user_name) || '님: ' || left(regexp_replace(NEW.content, '\s+', ' ', 'g'), 80),
        'post', NEW.post_id,
        jsonb_build_object('commentId', NEW.id, 'postTitle', left(v_post.title, 60)),
        'comment:post:' || NEW.id);
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN RETURN NEW; -- 알림 실패가 댓글 저장을 막지 않게
END; $$;
DROP TRIGGER IF EXISTS tr_notify_post_comment ON public.post_comments;
CREATE TRIGGER tr_notify_post_comment AFTER INSERT ON public.post_comments
    FOR EACH ROW EXECUTE FUNCTION public.fn_notify_post_comment();

-- 9-2. 게시글 좋아요 → 글쓴이 (좋아요 취소 후 다시 눌러도 한 번만)
CREATE OR REPLACE FUNCTION public.fn_notify_post_like()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_post RECORD;
BEGIN
    SELECT author_id, title INTO v_post FROM public.community_posts WHERE id = NEW.post_id;
    IF v_post.author_id IS NULL OR v_post.author_id = NEW.user_id THEN RETURN NEW; END IF;
    PERFORM public.create_user_notification(
        v_post.author_id, 'like',
        '❤️ 내 글에 좋아요',
        public.notif_actor_name(NEW.user_id, NULL) || '님이 "' || left(v_post.title, 40) || '" 글을 좋아해요',
        'post', NEW.post_id, '{}'::jsonb,
        'like:post:' || NEW.post_id || ':' || NEW.user_id);
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS tr_notify_post_like ON public.post_likes;
CREATE TRIGGER tr_notify_post_like AFTER INSERT ON public.post_likes
    FOR EACH ROW EXECUTE FUNCTION public.fn_notify_post_like();

-- 9-3. 리뷰 댓글 → 리뷰 작성자
CREATE OR REPLACE FUNCTION public.fn_notify_review_comment()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_review RECORD;
BEGIN
    SELECT user_id, product_id, product_name INTO v_review FROM public.reviews WHERE id = NEW.review_id;
    IF v_review.user_id IS NULL OR v_review.user_id = NEW.user_id THEN RETURN NEW; END IF;
    PERFORM public.create_user_notification(
        v_review.user_id, 'comment',
        '💬 내 리뷰에 새 댓글',
        public.notif_actor_name(NEW.user_id, NEW.user_name) || '님: ' || left(regexp_replace(NEW.content, '\s+', ' ', 'g'), 80),
        'review', NEW.review_id,
        jsonb_build_object('productId', v_review.product_id, 'commentId', NEW.id),
        'comment:review:' || NEW.id);
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS tr_notify_review_comment ON public.review_comments;
CREATE TRIGGER tr_notify_review_comment AFTER INSERT ON public.review_comments
    FOR EACH ROW EXECUTE FUNCTION public.fn_notify_review_comment();

-- 9-4. 리뷰 좋아요 → 리뷰 작성자
CREATE OR REPLACE FUNCTION public.fn_notify_review_like()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_review RECORD;
BEGIN
    SELECT user_id, product_id, product_name INTO v_review FROM public.reviews WHERE id = NEW.review_id;
    IF v_review.user_id IS NULL OR v_review.user_id = NEW.user_id THEN RETURN NEW; END IF;
    PERFORM public.create_user_notification(
        v_review.user_id, 'like',
        '❤️ 내 리뷰에 좋아요',
        public.notif_actor_name(NEW.user_id, NULL) || '님이 ' || COALESCE(left(v_review.product_name, 30) || ' ', '') || '리뷰를 좋아해요',
        'review', NEW.review_id,
        jsonb_build_object('productId', v_review.product_id),
        'like:review:' || NEW.review_id || ':' || NEW.user_id);
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS tr_notify_review_like ON public.review_likes;
CREATE TRIGGER tr_notify_review_like AFTER INSERT ON public.review_likes
    FOR EACH ROW EXECUTE FUNCTION public.fn_notify_review_like();

-- 9-5. 포인트 적립 → 본인
CREATE OR REPLACE FUNCTION public.fn_notify_point_earned()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    IF NEW.amount IS NULL OR NEW.amount <= 0 THEN RETURN NEW; END IF;
    PERFORM public.create_user_notification(
        NEW.user_id, 'point',
        '🎁 ' || to_char(NEW.amount, 'FM999,999,999') || 'P 적립',
        COALESCE(NULLIF(trim(NEW.reason), ''), '포인트가 적립되었어요') || ' · 잔액 ' || to_char(NEW.balance_after, 'FM999,999,999') || 'P',
        'points', NEW.id, '{}'::jsonb,
        'point:' || NEW.id);
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS tr_notify_point_earned ON public.point_transactions;
CREATE TRIGGER tr_notify_point_earned AFTER INSERT ON public.point_transactions
    FOR EACH ROW EXECUTE FUNCTION public.fn_notify_point_earned();

-- 10. 재시도 크론: 1분마다 처리할 항목이 있을 때만 발송 서버를 깨웁니다
CREATE OR REPLACE FUNCTION public.push_outbox_tick()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.push_outbox
        WHERE (status = 'pending' AND next_attempt_at <= NOW())
           OR (status = 'sending' AND locked_at < NOW() - INTERVAL '5 minutes')
    ) THEN
        PERFORM public.kick_push_dispatch();
    END IF;
    -- 오래된 발송 기록 정리 (90일)
    DELETE FROM public.push_outbox WHERE created_at < NOW() - INTERVAL '90 days' AND status IN ('sent', 'skipped', 'failed');
END;
$$;
REVOKE ALL ON FUNCTION public.push_outbox_tick() FROM PUBLIC, anon, authenticated;

DO $$
BEGIN
    PERFORM cron.unschedule('push-outbox-retry');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
SELECT cron.schedule('push-outbox-retry', '* * * * *', 'SELECT public.push_outbox_tick();');
