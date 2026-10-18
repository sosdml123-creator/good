-- =========================================================
-- Migration: SNS 게시물 사진 여러 장 (캐러셀)
-- image_urls 가 있으면 여러 장(인스타 캐러셀·스레드 캐러셀), 없으면 image_url 한 장(또는 글만).
-- 이미 apply_migration 으로 적용됨 (2026-10-18).
-- =========================================================

ALTER TABLE public.sns_posts ADD COLUMN IF NOT EXISTS image_urls text[];
