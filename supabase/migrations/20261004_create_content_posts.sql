-- supabase/migrations/20261004_create_content_posts.sql
-- 인스타그램 카드뉴스 생성 이력 저장 테이블

CREATE TABLE IF NOT EXISTS public.content_posts (
  id TEXT PRIMARY KEY,
  prompt TEXT NOT NULL,
  template_mode TEXT DEFAULT 'auto',
  aspect_ratio TEXT DEFAULT '1:1',
  content_json JSONB NOT NULL,
  caption TEXT,
  hashtags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 보안 활성화 및 관리자/공용 정책
ALTER TABLE public.content_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read and write on content_posts" 
ON public.content_posts 
FOR ALL 
USING (true) 
WITH CHECK (true);
