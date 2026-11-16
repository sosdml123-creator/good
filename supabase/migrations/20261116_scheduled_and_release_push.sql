-- 예약 푸시 + 관심 카테고리 출시 알림 자동 스캔
--  1) scheduled_pushes : 관리자가 미리 써 둔 푸시를 send_at 시각에 보냄
--  2) release_push_log : 출시 알림을 이미 보낸(또는 보낼 필요 없는) 상품 id. 같은 상품에 두 번 보내지 않음
--  products 에 직접 등록된 신제품(크롤러·SQL 등록)도 관심 카테고리가 맞는 기기에 출시 알림이 가도록
--  1분 크론(push_outbox_tick)이 할 일이 있을 때만 /api/send-fcm {action:'dispatch'} 를 깨웁니다.

CREATE TABLE IF NOT EXISTS public.scheduled_pushes (
    id           BIGSERIAL PRIMARY KEY,
    send_at      TIMESTAMPTZ NOT NULL,
    title        TEXT NOT NULL,
    body         TEXT NOT NULL,
    data         JSONB NOT NULL DEFAULT '{}'::jsonb,       -- {type, targetId, badge}
    message_kind TEXT NOT NULL DEFAULT 'marketing' CHECK (message_kind IN ('marketing', 'service')),
    status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sending', 'sent', 'skipped', 'failed', 'cancelled')),
    locked_at    TIMESTAMPTZ,
    sent_at      TIMESTAMPTZ,
    result       JSONB,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS scheduled_pushes_due_idx ON public.scheduled_pushes (send_at) WHERE status IN ('pending', 'sending');
ALTER TABLE public.scheduled_pushes ENABLE ROW LEVEL SECURITY;  -- 정책 없음: service role 만 접근

CREATE TABLE IF NOT EXISTS public.release_push_log (
    product_id TEXT PRIMARY KEY,
    pushed     BOOLEAN NOT NULL DEFAULT TRUE,   -- FALSE = 도입 시점에 이미 있던 상품(보내지 않음)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.release_push_log ENABLE ROW LEVEL SECURITY;

-- 도입 시점 이전 상품에는 출시 알림을 보내지 않습니다
INSERT INTO public.release_push_log (product_id, pushed)
SELECT id, FALSE FROM public.products
ON CONFLICT (product_id) DO NOTHING;

-- 보낼 시각이 된 예약 푸시를 잠그고 돌려줍니다 (5분 넘게 sending 이면 다시 가져감)
CREATE OR REPLACE FUNCTION public.claim_scheduled_pushes(p_limit INT DEFAULT 10)
RETURNS SETOF public.scheduled_pushes
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
    RETURN QUERY
    UPDATE public.scheduled_pushes s
       SET status = 'sending', locked_at = NOW()
     WHERE s.id IN (
        SELECT id FROM public.scheduled_pushes
         WHERE send_at <= NOW()
           AND (status = 'pending' OR (status = 'sending' AND locked_at < NOW() - INTERVAL '5 minutes'))
           AND send_at > NOW() - INTERVAL '3 hours'   -- 너무 늦어진 예약은 보내지 않음
         ORDER BY send_at
         LIMIT p_limit
         FOR UPDATE SKIP LOCKED)
    RETURNING s.*;
END;
$$;

-- 늦어서 못 보낸 예약은 skipped 로 정리
CREATE OR REPLACE FUNCTION public.expire_scheduled_pushes()
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path TO 'public'
AS $$
    UPDATE public.scheduled_pushes SET status = 'skipped', result = '{"reason":"expired"}'::jsonb
     WHERE status IN ('pending', 'sending') AND send_at <= NOW() - INTERVAL '3 hours';
$$;

-- 출시 알림을 보낼 신제품. 한 번에 몰려 등록되는 상품을 한 통으로 묶기 위해 등록 후 10분이 지난 것만 가져갑니다.
CREATE OR REPLACE FUNCTION public.release_scan_due()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
    SELECT
        -- 한국 시간 오전 9시~오후 8시대에만 (광고성 알림, 밤 발송 방지)
        EXTRACT(HOUR FROM NOW() AT TIME ZONE 'Asia/Seoul') BETWEEN 9 AND 20
        -- 출시 알림은 최소 1시간 간격
        AND NOT EXISTS (SELECT 1 FROM public.release_push_log WHERE pushed AND created_at > NOW() - INTERVAL '1 hour')
        AND EXISTS (
            SELECT 1 FROM public.products p
             WHERE p.created_at <= NOW() - INTERVAL '10 minutes'
               AND p.created_at > NOW() - INTERVAL '3 days'
               AND p.category <> '시스템'
               AND NOT EXISTS (SELECT 1 FROM public.release_push_log l WHERE l.product_id = p.id));
$$;

-- 보낼 신제품을 기록하며 가져갑니다 (동시에 불려도 같은 상품은 한 번만 반환)
CREATE OR REPLACE FUNCTION public.claim_release_products(p_limit INT DEFAULT 200)
RETURNS TABLE (id TEXT, name TEXT, brand TEXT, category TEXT)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
    RETURN QUERY
    WITH due AS (
        SELECT p.id, p.name, p.brand, p.category, p.created_at FROM public.products p
         WHERE p.created_at <= NOW() - INTERVAL '10 minutes'
           AND p.created_at > NOW() - INTERVAL '3 days'
           AND p.category <> '시스템'
           AND NOT EXISTS (SELECT 1 FROM public.release_push_log l WHERE l.product_id = p.id)
         ORDER BY p.created_at DESC
         LIMIT p_limit
    ), ins AS (
        INSERT INTO public.release_push_log (product_id, pushed)
        SELECT due.id, TRUE FROM due
        ON CONFLICT (product_id) DO NOTHING
        RETURNING product_id
    )
    SELECT due.id, due.name, due.brand, due.category
      FROM due JOIN ins ON ins.product_id = due.id
     ORDER BY due.created_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_scheduled_pushes(INT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.expire_scheduled_pushes() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.release_scan_due() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.claim_release_products(INT) FROM PUBLIC, anon, authenticated;

-- 1분 크론: 개인 알림 큐 · 예약 푸시 · 출시 알림 중 할 일이 있을 때만 발송 서버를 깨웁니다
CREATE OR REPLACE FUNCTION public.push_outbox_tick()
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
    PERFORM public.expire_scheduled_pushes();
    IF EXISTS (
        SELECT 1 FROM public.push_outbox
        WHERE (status = 'pending' AND next_attempt_at <= NOW())
           OR (status = 'sending' AND locked_at < NOW() - INTERVAL '5 minutes')
    ) OR EXISTS (
        SELECT 1 FROM public.scheduled_pushes
        WHERE send_at <= NOW()
          AND (status = 'pending' OR (status = 'sending' AND locked_at < NOW() - INTERVAL '5 minutes'))
    ) OR public.release_scan_due() THEN
        PERFORM public.kick_push_dispatch();
    END IF;
    DELETE FROM public.push_outbox WHERE created_at < NOW() - INTERVAL '90 days' AND status IN ('sent', 'skipped', 'failed');
END;
$$;
