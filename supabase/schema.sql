-- =========================================================
-- SinSangPick (신상픽) Database Schema for Supabase (PostgreSQL)
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL DEFAULT '신상러버',
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    level TEXT DEFAULT 'Lv.1',
    points INT DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products Table (상품 카탈로그 및 실시간 집계 평점)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    sub_category TEXT,
    item_type TEXT DEFAULT 'packaged',
    image TEXT NOT NULL,
    release_date TEXT,
    price INT NOT NULL DEFAULT 0,
    discount_rate INT DEFAULT 0,
    overall_rating NUMERIC(3, 1) DEFAULT 0.0,
    rating_count INT DEFAULT 0,
    detailed_rating JSONB DEFAULT '{"taste": 5, "value": 5, "portion": 5, "repurchase": 5}'::jsonb,
    fresh_metrics JSONB,
    brand_rankings JSONB,
    restaurant_info JSONB,
    description TEXT,
    best_quotes TEXT[],
    stores TEXT[],
    store_stocks JSONB,
    repurchase_percent INT DEFAULT 95,
    calories INT,
    volume TEXT,
    is_today BOOLEAN DEFAULT false,
    is_hot BOOLEAN DEFAULT false,
    nutrition JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Reviews Table (상품 솔직 후기)
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    product_image TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    user_level TEXT DEFAULT 'Lv.1',
    rating NUMERIC(2, 1) NOT NULL,
    detailed_rating JSONB,
    fresh_metrics JSONB,
    content TEXT NOT NULL,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Review Likes Table (리뷰 좋아요 - 사용자별 중복 방지)
CREATE TABLE IF NOT EXISTS public.review_likes (
    review_id TEXT NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (review_id, user_id)
);

-- 5. Community Posts Table (신상 수다방 게시글)
CREATE TABLE IF NOT EXISTS public.community_posts (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('인기글', '자유게시판', '질문/답변', '이벤트')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_avatar TEXT,
    author_level TEXT DEFAULT 'Lv.1',
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Post Likes Table (게시글 좋아요 - 사용자별 중복 방지)
CREATE TABLE IF NOT EXISTS public.post_likes (
    post_id TEXT NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id)
);

-- 7. Review Comments Table (리뷰 댓글)
CREATE TABLE IF NOT EXISTS public.review_comments (
    id TEXT PRIMARY KEY,
    review_id TEXT NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    user_level TEXT DEFAULT 'Lv.1',
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Post Comments Table (수다방 게시글 댓글)
CREATE TABLE IF NOT EXISTS public.post_comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    user_level TEXT DEFAULT 'Lv.1',
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- Server-Side Functions & Triggers (동시성 및 데이터 무결성 보장)
-- =========================================================

-- A. Auto-recalculate Product overall_rating & rating_count on Review changes
CREATE OR REPLACE FUNCTION public.fn_recalc_product_rating()
RETURNS TRIGGER AS $$
DECLARE
    target_product_id TEXT;
    avg_r NUMERIC(3, 1);
    cnt INT;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        target_product_id := OLD.product_id;
    ELSE
        target_product_id := NEW.product_id;
    END IF;

    SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0.0), COUNT(*)
    INTO avg_r, cnt
    FROM public.reviews
    WHERE product_id = target_product_id;

    UPDATE public.products
    SET overall_rating = avg_r,
        rating_count = cnt,
        updated_at = NOW()
    WHERE id = target_product_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_recalc_product_rating ON public.reviews;
CREATE TRIGGER tr_recalc_product_rating
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.fn_recalc_product_rating();

-- B. Auto Sync Review likes_count
CREATE OR REPLACE FUNCTION public.fn_sync_review_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.reviews
        SET likes_count = likes_count + 1
        WHERE id = NEW.review_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.reviews
        SET likes_count = GREATEST(0, likes_count - 1)
        WHERE id = OLD.review_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_sync_review_likes ON public.review_likes;
CREATE TRIGGER tr_sync_review_likes
AFTER INSERT OR DELETE ON public.review_likes
FOR EACH ROW EXECUTE FUNCTION public.fn_sync_review_likes_count();

-- C. Auto Sync Community Post likes_count
CREATE OR REPLACE FUNCTION public.fn_sync_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.community_posts
        SET likes_count = likes_count + 1
        WHERE id = NEW.post_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.community_posts
        SET likes_count = GREATEST(0, likes_count - 1)
        WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_sync_post_likes ON public.post_likes;
CREATE TRIGGER tr_sync_post_likes
AFTER INSERT OR DELETE ON public.post_likes
FOR EACH ROW EXECUTE FUNCTION public.fn_sync_post_likes_count();

-- D. Auto Sync Review comments_count
CREATE OR REPLACE FUNCTION public.fn_sync_review_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.reviews
        SET comments_count = comments_count + 1
        WHERE id = NEW.review_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.reviews
        SET comments_count = GREATEST(0, comments_count - 1)
        WHERE id = OLD.review_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_sync_review_comments ON public.review_comments;
CREATE TRIGGER tr_sync_review_comments
AFTER INSERT OR DELETE ON public.review_comments
FOR EACH ROW EXECUTE FUNCTION public.fn_sync_review_comments_count();

-- E. Auto Sync Post comments_count
CREATE OR REPLACE FUNCTION public.fn_sync_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.community_posts
        SET comments_count = comments_count + 1
        WHERE id = NEW.post_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.community_posts
        SET comments_count = GREATEST(0, comments_count - 1)
        WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_sync_post_comments ON public.post_comments;
CREATE TRIGGER tr_sync_post_comments
AFTER INSERT OR DELETE ON public.post_comments
FOR EACH ROW EXECUTE FUNCTION public.fn_sync_post_comments_count();

-- F. Auto create profile when new auth user signs up
CREATE OR REPLACE FUNCTION public.fn_handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, avatar_url, level, points)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '신상러버_' || SUBSTRING(NEW.id::text, 1, 4)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'),
        'Lv.1',
        100
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_on_auth_user_created ON auth.users;
CREATE TRIGGER tr_on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.fn_handle_new_user();

-- =========================================================
-- Popularity Ranking Views (실시간 인기 랭킹 뷰)
-- =========================================================

-- 1. Popular Products View (상품 인기 랭킹)
-- Score = (overall_rating * 20) + (rating_count * 5) + (repurchase_percent * 0.3) + (is_today * 35) + (is_hot * 25)
CREATE OR REPLACE VIEW public.popular_products_view AS
SELECT 
    p.*,
    (
        (COALESCE(p.overall_rating, 0) * 20.0) +
        (COALESCE(p.rating_count, 0) * 5.0) +
        (COALESCE(p.repurchase_percent, 0) * 0.3) +
        (CASE WHEN p.is_today THEN 35.0 ELSE 0.0 END) +
        (CASE WHEN p.is_hot THEN 25.0 ELSE 0.0 END)
    ) AS popularity_score
FROM public.products p
ORDER BY popularity_score DESC;

-- 2. Popular Community Posts View (커뮤니티 인기글 랭킹 - 시간 감쇠 알고리즘)
-- Score = (likes_count * 3.0 + comments_count * 2.0 + 1.0) / POWER((hours_since_created + 2.0), 1.5)
CREATE OR REPLACE VIEW public.popular_community_posts_view AS
SELECT 
    cp.*,
    (
        (COALESCE(cp.likes_count, 0) * 3.0 + COALESCE(cp.comments_count, 0) * 2.0 + 1.0) /
        POWER(GREATEST(0.1, EXTRACT(EPOCH FROM (NOW() - cp.created_at)) / 3600.0) + 2.0, 1.5)
    ) AS popularity_score
FROM public.community_posts cp
ORDER BY popularity_score DESC;

-- =========================================================
-- Row Level Security (RLS) Policies
-- =========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Products
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert products" ON public.products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update products" ON public.products FOR UPDATE USING (auth.role() = 'authenticated');

-- 3. Reviews
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- 4. Review Likes
CREATE POLICY "Review likes are viewable by everyone" ON public.review_likes FOR SELECT USING (true);
CREATE POLICY "Users can toggle own review likes" ON public.review_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own review likes" ON public.review_likes FOR DELETE USING (auth.uid() = user_id);

-- 5. Community Posts
CREATE POLICY "Community posts are viewable by everyone" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert community posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own community posts" ON public.community_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own community posts" ON public.community_posts FOR DELETE USING (auth.uid() = author_id);

-- 6. Post Likes
CREATE POLICY "Post likes are viewable by everyone" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Users can toggle own post likes" ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own post likes" ON public.post_likes FOR DELETE USING (auth.uid() = user_id);

-- 7. Review Comments
CREATE POLICY "Review comments are viewable by everyone" ON public.review_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert review comments" ON public.review_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own review comments" ON public.review_comments FOR DELETE USING (auth.uid() = user_id);

-- 8. Post Comments
CREATE POLICY "Post comments are viewable by everyone" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert post comments" ON public.post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own post comments" ON public.post_comments FOR DELETE USING (auth.uid() = user_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.review_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.review_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_comments;
