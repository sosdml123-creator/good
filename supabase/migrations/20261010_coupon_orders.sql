-- Migration: e쿠폰(기프티쇼 비즈) 포인트 교환 주문 테이블 + 포인트 차감/환불 함수
-- Created: 2026-10-10
--
-- /api/giftishow 가 service_role 키로만 호출합니다. 클라이언트는 자신의 주문을 조회만 할 수 있습니다.
-- Supabase 대시보드 → SQL Editor 에서 이 파일 전체를 실행하세요. (여러 번 실행해도 안전)

CREATE TABLE IF NOT EXISTS public.coupon_orders (
    tr_id TEXT PRIMARY KEY,                -- 기프티쇼 거래아이디 (대사값)
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    goods_code TEXT NOT NULL,
    goods_name TEXT NOT NULL,
    brand_name TEXT,
    goods_image TEXT,
    points INT NOT NULL CHECK (points > 0), -- 차감한 포인트
    cost INT,                               -- 비즈머니 차감 예상액 (discountPrice)
    status TEXT NOT NULL DEFAULT 'pending', -- pending | issued | failed | unknown
    order_no TEXT,
    pin_no TEXT,
    coupon_img_url TEXT,
    expires_at DATE,
    is_used BOOLEAN NOT NULL DEFAULT false,
    used_at TIMESTAMPTZ,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS coupon_orders_user_created_idx ON public.coupon_orders (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS coupon_orders_created_idx ON public.coupon_orders (created_at);

ALTER TABLE public.coupon_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own coupon orders" ON public.coupon_orders;
CREATE POLICY "Users can view own coupon orders" ON public.coupon_orders
FOR SELECT USING (auth.uid() = user_id);

-- 포인트 차감 + 주문(pending) 생성을 한 트랜잭션으로 처리합니다.
-- 잔액 부족 / 1인 일일 한도 / 전체 일일 한도 초과 시 아무것도 바꾸지 않고 사유를 돌려줍니다.
CREATE OR REPLACE FUNCTION public.coupon_exchange_begin(
    p_user UUID,
    p_tr_id TEXT,
    p_goods_code TEXT,
    p_goods_name TEXT,
    p_brand_name TEXT,
    p_goods_image TEXT,
    p_points INT,
    p_cost INT,
    p_expires DATE,
    p_user_daily_limit INT,
    p_global_daily_limit INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_points INT;
    v_user_today INT;
    v_all_today INT;
    v_day_start TIMESTAMPTZ := date_trunc('day', NOW() AT TIME ZONE 'Asia/Seoul') AT TIME ZONE 'Asia/Seoul';
BEGIN
    IF p_points IS NULL OR p_points <= 0 THEN
        RETURN jsonb_build_object('ok', false, 'reason', 'invalid');
    END IF;

    SELECT COALESCE(points, 0) INTO v_points FROM profiles WHERE id = p_user FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('ok', false, 'reason', 'no_profile');
    END IF;
    IF v_points < p_points THEN
        RETURN jsonb_build_object('ok', false, 'reason', 'insufficient', 'balance', v_points);
    END IF;

    -- 전체 일일 한도 집계를 직렬화
    PERFORM pg_advisory_xact_lock(hashtext('sinsangpick_coupon_exchange'));

    SELECT
        COALESCE(SUM(points) FILTER (WHERE user_id = p_user), 0),
        COALESCE(SUM(points), 0)
    INTO v_user_today, v_all_today
    FROM coupon_orders
    WHERE created_at >= v_day_start
      AND status IN ('pending', 'issued', 'unknown');

    IF v_user_today + p_points > p_user_daily_limit THEN
        RETURN jsonb_build_object('ok', false, 'reason', 'user_limit', 'balance', v_points);
    END IF;
    IF v_all_today + p_points > p_global_daily_limit THEN
        RETURN jsonb_build_object('ok', false, 'reason', 'global_limit', 'balance', v_points);
    END IF;

    UPDATE profiles SET points = v_points - p_points, updated_at = NOW() WHERE id = p_user;

    INSERT INTO coupon_orders (tr_id, user_id, goods_code, goods_name, brand_name, goods_image, points, cost, expires_at)
    VALUES (p_tr_id, p_user, p_goods_code, p_goods_name, p_brand_name, p_goods_image, p_points, p_cost, p_expires);

    RETURN jsonb_build_object('ok', true, 'balance', v_points - p_points);
END;
$$;

-- 발급 실패 시 포인트 환불. 아직 확정되지 않은(pending / unknown) 주문만 한 번 환불됩니다.
CREATE OR REPLACE FUNCTION public.coupon_exchange_refund(p_tr_id TEXT, p_error TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_order coupon_orders%ROWTYPE;
    v_balance INT;
BEGIN
    SELECT * INTO v_order FROM coupon_orders WHERE tr_id = p_tr_id FOR UPDATE;
    IF NOT FOUND OR v_order.status NOT IN ('pending', 'unknown') THEN
        RETURN jsonb_build_object('ok', false);
    END IF;

    UPDATE coupon_orders SET status = 'failed', error = p_error, updated_at = NOW() WHERE tr_id = p_tr_id;

    UPDATE profiles SET points = COALESCE(points, 0) + v_order.points, updated_at = NOW()
    WHERE id = v_order.user_id
    RETURNING points INTO v_balance;

    RETURN jsonb_build_object('ok', true, 'balance', v_balance);
END;
$$;

REVOKE ALL ON FUNCTION public.coupon_exchange_begin(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, INT, INT, DATE, INT, INT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.coupon_exchange_refund(TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.coupon_exchange_begin(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, INT, INT, DATE, INT, INT) TO service_role;
GRANT EXECUTE ON FUNCTION public.coupon_exchange_refund(TEXT, TEXT) TO service_role;

-- 확인이 필요한 주문(응답을 못 받아 발급 여부가 불명확한 건):
--   SELECT * FROM public.coupon_orders WHERE status = 'unknown' ORDER BY created_at DESC;
