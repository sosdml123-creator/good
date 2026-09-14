-- =========================================================
-- SinSangPick (신상픽) Notifications & FCM Device Tokens Schema
-- =========================================================

-- 1. Notifications Table (인앱 알림 및 푸시 발송 내역)
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'notice', -- 'product', 'event', 'notice'
    target_id TEXT,                      -- product_id or event_id or link
    image_url TEXT,
    badge TEXT DEFAULT '알림',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Device Tokens Table (FCM / APNs 디바이스 푸시 토큰)
CREATE TABLE IF NOT EXISTS public.device_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token TEXT UNIQUE NOT NULL,
    platform TEXT NOT NULL DEFAULT 'web', -- 'ios', 'android', 'web'
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT,
    device_info JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for ultra-fast lookup
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_device_tokens_platform ON public.device_tokens (platform);
CREATE INDEX IF NOT EXISTS idx_device_tokens_user_id ON public.device_tokens (user_id);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_tokens ENABLE ROW LEVEL SECURITY;

-- Notifications RLS Policies
CREATE POLICY "Notifications are viewable by everyone" 
    ON public.notifications FOR SELECT USING (true);

CREATE POLICY "Anyone can insert notifications" 
    ON public.notifications FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete notifications" 
    ON public.notifications FOR DELETE USING (true);

-- Device Tokens RLS Policies
CREATE POLICY "Device tokens are readable by everyone" 
    ON public.device_tokens FOR SELECT USING (true);

CREATE POLICY "Anyone can upsert device tokens" 
    ON public.device_tokens FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update own device tokens" 
    ON public.device_tokens FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete device tokens" 
    ON public.device_tokens FOR DELETE USING (true);

-- Enable Supabase Realtime for Notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
