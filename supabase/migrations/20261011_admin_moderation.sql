-- Migration: Admin moderation storage (신고 / 제품 수정 요청 / 회원 제재 / 포인트 내역) + 상품 상세 컬럼
-- Created: 2026-10-11
--
-- 지금까지 이 데이터는 각 기기의 localStorage 에만 저장되어 관리자 화면에 모이지 않았습니다.
-- 관리자의 조회·처리는 /api/site-content (service role) 로만 이뤄지므로 관리자용 정책은 두지 않습니다.
-- Supabase 대시보드 → SQL Editor 에서 이 파일 전체를 실행하세요. (여러 번 실행해도 안전)

-- 1. 신고
CREATE TABLE IF NOT EXISTS public.reports (
    id TEXT PRIMARY KEY,
    reporter_id UUID NOT NULL DEFAULT auth.uid(),
    status TEXT NOT NULL DEFAULT 'pending',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can file reports" ON public.reports;
CREATE POLICY "Users can file reports" ON public.reports
    FOR INSERT WITH CHECK (auth.uid() = reporter_id AND status = 'pending');
DROP POLICY IF EXISTS "Users can view own reports" ON public.reports;
CREATE POLICY "Users can view own reports" ON public.reports
    FOR SELECT USING (auth.uid() = reporter_id);

-- 2. 제품 정보 수정 요청
CREATE TABLE IF NOT EXISTS public.product_edit_requests (
    id TEXT PRIMARY KEY,
    requester_id UUID NOT NULL DEFAULT auth.uid(),
    status TEXT NOT NULL DEFAULT 'pending',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.product_edit_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can file edit requests" ON public.product_edit_requests;
CREATE POLICY "Users can file edit requests" ON public.product_edit_requests
    FOR INSERT WITH CHECK (auth.uid() = requester_id AND status = 'pending');
DROP POLICY IF EXISTS "Users can view own edit requests" ON public.product_edit_requests;
CREATE POLICY "Users can view own edit requests" ON public.product_edit_requests
    FOR SELECT USING (auth.uid() = requester_id);

-- 3. 회원 제재 상태 (본인 것만 조회 가능 → 앱에서 이용 제한 적용)
CREATE TABLE IF NOT EXISTS public.user_sanctions (
    user_id UUID PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'active',
    warning_count INT NOT NULL DEFAULT 0,
    suspended_until TEXT,
    reason TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.user_sanctions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own sanction" ON public.user_sanctions;
CREATE POLICY "Users can view own sanction" ON public.user_sanctions
    FOR SELECT USING (auth.uid() = user_id);

-- 4. 관리자 포인트 지급/회수 내역
CREATE TABLE IF NOT EXISTS public.point_transactions (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL,
    type TEXT NOT NULL,
    amount INT NOT NULL,
    balance_after INT NOT NULL,
    reason TEXT,
    admin_memo TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_point_transactions_user ON public.point_transactions (user_id, created_at DESC);
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own point transactions" ON public.point_transactions;
CREATE POLICY "Users can view own point transactions" ON public.point_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- 5. 상품 상세 정보 컬럼 (관리자 상품 수정 화면에서 입력하는 값)
ALTER TABLE public.products
    ADD COLUMN IF NOT EXISTS code TEXT,
    ADD COLUMN IF NOT EXISTS ingredients TEXT,
    ADD COLUMN IF NOT EXISTS allergens TEXT[],
    ADD COLUMN IF NOT EXISTS origin TEXT,
    ADD COLUMN IF NOT EXISTS manufacturer TEXT,
    ADD COLUMN IF NOT EXISTS storage_method TEXT,
    ADD COLUMN IF NOT EXISTS shelf_life TEXT,
    ADD COLUMN IF NOT EXISTS precautions TEXT,
    ADD COLUMN IF NOT EXISTS spiciness TEXT,
    ADD COLUMN IF NOT EXISTS buy_link TEXT,
    ADD COLUMN IF NOT EXISTS source_name TEXT,
    ADD COLUMN IF NOT EXISTS source_url TEXT,
    ADD COLUMN IF NOT EXISTS produce_details JSONB;

NOTIFY pgrst, 'reload schema';
