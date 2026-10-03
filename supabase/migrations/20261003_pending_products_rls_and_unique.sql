-- =========================================================
-- Migration: Pending Products RLS & Unique Index
-- =========================================================

-- 1. Ensure is_admin column in profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 2. Partial Unique Index on pending_products(source_url) ignoring NULLs
CREATE UNIQUE INDEX IF NOT EXISTS pending_products_source_url_key 
ON public.pending_products (source_url) 
WHERE source_url IS NOT NULL;

-- 3. RLS Setup for pending_products
ALTER TABLE public.pending_products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Pending products are viewable by everyone" ON public.pending_products;
DROP POLICY IF EXISTS "Only service role can manage pending products" ON public.pending_products;
DROP POLICY IF EXISTS "Admin select pending products" ON public.pending_products;
DROP POLICY IF EXISTS "Admin update pending products" ON public.pending_products;
DROP POLICY IF EXISTS "Admin delete pending products" ON public.pending_products;
DROP POLICY IF EXISTS "Admin and service role insert pending products" ON public.pending_products;

-- Select: Only admins and service role
CREATE POLICY "Admin select pending products" ON public.pending_products
FOR SELECT USING (
    auth.role() = 'service_role' OR 
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE public.profiles.id = auth.uid() 
        AND public.profiles.is_admin = true
    )
);

-- Update: Only admins and service role
CREATE POLICY "Admin update pending products" ON public.pending_products
FOR UPDATE USING (
    auth.role() = 'service_role' OR 
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE public.profiles.id = auth.uid() 
        AND public.profiles.is_admin = true
    )
);

-- Delete: Only admins and service role
CREATE POLICY "Admin delete pending products" ON public.pending_products
FOR DELETE USING (
    auth.role() = 'service_role' OR 
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE public.profiles.id = auth.uid() 
        AND public.profiles.is_admin = true
    )
);

-- Insert: Service role and admins
CREATE POLICY "Admin and service role insert pending products" ON public.pending_products
FOR INSERT WITH CHECK (
    auth.role() = 'service_role' OR 
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE public.profiles.id = auth.uid() 
        AND public.profiles.is_admin = true
    )
);
