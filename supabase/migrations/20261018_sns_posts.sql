-- =========================================================
-- Migration: SNS 게시 큐 (인스타·스레드 예약 게시)
-- 로컬 플러그인(D:\sinsangpick-sns)이 Edge Function sns-queue(service role)로 쓰고,
-- 어드민 'SNS 운영' 탭이 관리자 권한으로 조회·승인·수정한다.
-- =========================================================

CREATE TABLE IF NOT EXISTS public.sns_posts (
    id TEXT PRIMARY KEY,
    channel TEXT NOT NULL CHECK (channel IN ('instagram', 'threads')),
    scheduled_at TIMESTAMPTZ NOT NULL,
    text TEXT NOT NULL,
    image_url TEXT,
    topic TEXT,
    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'approved', 'publishing', 'published', 'failed')),
    approved_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    post_id TEXT,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sns_posts_status_scheduled_idx ON public.sns_posts (status, scheduled_at);

ALTER TABLE public.sns_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin select sns posts" ON public.sns_posts;
DROP POLICY IF EXISTS "Admin update sns posts" ON public.sns_posts;
DROP POLICY IF EXISTS "Admin delete sns posts" ON public.sns_posts;

CREATE POLICY "Admin select sns posts" ON public.sns_posts
FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- 관리자는 draft/approved/failed 사이만 바꿀 수 있다 (published·publishing은 게시 스크립트만)
CREATE POLICY "Admin update sns posts" ON public.sns_posts
FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
    AND status IN ('draft', 'approved', 'failed')
) WITH CHECK (
    status IN ('draft', 'approved')
);

CREATE POLICY "Admin delete sns posts" ON public.sns_posts
FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
    AND status <> 'publishing'
);

CREATE OR REPLACE FUNCTION public.sns_posts_touch() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
    NEW.updated_at := now();
    IF NEW.status = 'approved' AND OLD.status IS DISTINCT FROM 'approved' THEN
        NEW.approved_at := now();
    END IF;
    RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS sns_posts_touch ON public.sns_posts;
CREATE TRIGGER sns_posts_touch BEFORE UPDATE ON public.sns_posts
FOR EACH ROW EXECUTE FUNCTION public.sns_posts_touch();
