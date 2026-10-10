-- =========================================================
-- Migration: pending_products (신제품 수집·승인 대기함)
-- 운영 DB에 테이블이 없어 대기함이 저장되지 않던 문제를 해결합니다.
-- 읽기/쓰기는 서버(/api/pending-products, service role)에서만 수행하므로
-- RLS는 켜고 클라이언트용 정책은 만들지 않습니다.
-- =========================================================

CREATE TABLE IF NOT EXISTS public.pending_products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    sub_category TEXT,
    item_type TEXT DEFAULT 'packaged',
    image TEXT NOT NULL DEFAULT '',
    release_date TEXT,
    price INT NOT NULL DEFAULT 0,
    discount_rate INT DEFAULT 0,
    stores TEXT[] DEFAULT '{}',
    description TEXT,
    source_name TEXT,
    source_url TEXT,
    crawled_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    calories INT,
    volume TEXT,
    nutrition JSONB,
    ingredients TEXT,
    allergens TEXT[],
    best_quotes TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS pending_products_status_idx
ON public.pending_products (status, crawled_at DESC);

ALTER TABLE public.pending_products ENABLE ROW LEVEL SECURITY;
