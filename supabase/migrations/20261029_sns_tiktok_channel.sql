-- =========================================================
-- Migration: SNS 게시 채널에 틱톡 추가
-- 적용 상태: 아직 적용 안 함 (프로덕션 DB 변경 승인 대기, 2026-10-29). 적용하면 이 줄을 '적용됨 (날짜)'로 바꾼다.
-- 틱톡 글은 channel = 'tiktok', 영상은 video_url (PC에서 만든 9:16 슬라이드쇼 mp4), 캡션은 text.
-- 틱톡 앱 키·토큰은 sns_secrets 의 tiktok_* 키에 둔다 (RLS 켜짐, 서비스 롤 전용).
-- 틱톡은 kr 계정만 쓴다 (sns_posts_account_channel_check 그대로 유지).
-- =========================================================

ALTER TABLE public.sns_posts DROP CONSTRAINT IF EXISTS sns_posts_channel_check;
ALTER TABLE public.sns_posts
    ADD CONSTRAINT sns_posts_channel_check CHECK (channel IN ('instagram', 'threads', 'tiktok'));
