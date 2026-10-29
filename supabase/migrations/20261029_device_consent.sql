-- =========================================================
-- 기기별 광고·혜택 알림 동의 (마케팅 · 야간 혜택)
--  - marketing_agreed : 광고·혜택 알림(마케팅)을 받는 기기인지. 기본값은 동의하지 않음.
--  - night_agreed     : 밤 9시~아침 8시에도 광고·혜택 알림을 받는 기기인지 (야간 혜택 동의).
-- 적용 전에는 광고·혜택 알림을 보내지 않습니다 (서비스 안내는 그대로 보냅니다).
-- 알림을 끈 기기는 앱이 device_tokens 행을 지우므로 이 컬럼과 무관합니다.
-- =========================================================

ALTER TABLE public.device_tokens
    ADD COLUMN IF NOT EXISTS marketing_agreed BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS night_agreed BOOLEAN NOT NULL DEFAULT FALSE;
