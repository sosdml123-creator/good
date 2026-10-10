-- supabase/migrations/20261010_content_posts_daily.sql
-- 인스타그램 카드뉴스 생성 이력 + 매일 아침 자동 생성 콘텐츠 저장 테이블
-- (운영 DB에 content_posts가 없어 이력/자동 콘텐츠가 저장되지 않던 문제 해결)

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

CREATE INDEX IF NOT EXISTS content_posts_created_at_idx ON public.content_posts (created_at DESC);

-- 읽기/쓰기는 서버(/api/generate-content, service role)만 수행한다.
-- RLS를 켜고 정책을 두지 않아 anon/일반 로그인 키로는 접근할 수 없게 한다.
ALTER TABLE public.content_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read and write on content_posts" ON public.content_posts;
