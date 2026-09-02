import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-id')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

export interface DBProfile {
  id: string;
  display_name: string;
  avatar_url: string;
  level: string;
  points: number;
  created_at: string;
}

export interface DBProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  sub_category?: string;
  item_type?: 'packaged' | 'fresh' | 'restaurant';
  image: string;
  release_date?: string;
  price: number;
  discount_rate?: number;
  overall_rating: number;
  rating_count: number;
  detailed_rating?: any;
  fresh_metrics?: any;
  brand_rankings?: any;
  restaurant_info?: any;
  description?: string;
  best_quotes?: string[];
  stores?: string[];
  repurchase_percent?: number;
  calories?: number;
  volume?: string;
  is_today?: boolean;
  is_hot?: boolean;
  created_at?: string;
}

export interface DBReview {
  id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  user_level?: string;
  rating: number;
  detailed_rating?: any;
  fresh_metrics?: any;
  content: string;
  images?: string[];
  likes_count: number;
  comments_count: number;
  tags?: string[];
  created_at: string;
}

export interface DBCommunityPost {
  id: string;
  category: '인기글' | '자유게시판' | '질문/답변' | '이벤트';
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  author_level?: string;
  likes_count: number;
  comments_count: number;
  images?: string[];
  created_at: string;
}

export interface DBReviewComment {
  id: string;
  review_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  user_level?: string;
  content: string;
  created_at: string;
}

export interface DBPostComment {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  user_level?: string;
  content: string;
  created_at: string;
}

/**
 * Ensures an authenticated user session exists (Anonymous auth as default).
 */
export const ensureSupabaseAuth = async (): Promise<{ user: User | null; session: Session | null }> => {
  if (!supabase) return { user: null, session: null };

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      return { user: session.user, session };
    }

    // Try anonymous sign in if supported
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.warn('[Supabase Auth] Anonymous sign-in warning:', error.message);
      return { user: null, session: null };
    }
    return { user: data.user, session: data.session };
  } catch (err) {
    console.warn('[Supabase Auth] Session init error:', err);
    return { user: null, session: null };
  }
};

/**
 * Google OAuth sign-in helper
 */
export const signInWithGoogle = async () => {
  if (!supabase) return;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) throw error;
};
