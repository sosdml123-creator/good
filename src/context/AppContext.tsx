import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  Product, 
  Review, 
  CommunityPost, 
  ActiveTab, 
  ProductCategory, 
  DetailedRating, 
  ToastMessage,
  UserProfile,
  ReviewComment,
  PostComment
} from '../types';
import { INITIAL_PRODUCTS } from '../data/mockProducts';
import { INITIAL_REVIEWS } from '../data/mockReviews';
import { INITIAL_COMMUNITY_POSTS } from '../data/mockCommunity';
import {
  supabase,
  isSupabaseConfigured,
  ensureSupabaseAuth,
  signInWithGoogle as supabaseSignInWithGoogle,
  DBProduct,
  DBReview,
  DBCommunityPost,
  DBReviewComment,
  DBPostComment
} from '../services/supabase';

interface AppContextType {
  products: Product[];
  reviews: Review[];
  communityPosts: CommunityPost[];
  activeTab: ActiveTab;
  previousTab: ActiveTab;
  selectedCategory: ProductCategory;
  selectedProduct: Product;
  selectedProductId: string;
  bookmarkedIds: string[];
  comparedIds: string[];
  alertCategories: string[];
  searchQuery: string;
  recentSearches: string[];
  userPoints: number;
  toasts: ToastMessage[];
  currentUser: UserProfile;
  isSupabaseConnected: boolean;

  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  goBack: () => void;
  setSelectedCategory: (cat: ProductCategory) => void;
  openProductDetail: (productId: string) => void;
  toggleBookmark: (productId: string, e?: React.MouseEvent) => void;
  toggleCompare: (productId: string, e?: React.MouseEvent) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  toggleAlertCategory: (cat: string) => void;
  setSearchQuery: (q: string) => void;
  addRecentSearch: (keyword: string) => void;
  removeRecentSearch: (keyword: string) => void;
  clearRecentSearches: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  updateUserNickname: (newName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;

  // Interactions
  submitReview: (
    productId: string,
    rating: number,
    detailedRating: DetailedRating,
    content: string,
    images?: string[],
    tags?: string[]
  ) => Promise<void>;
  toggleLikeReview: (reviewId: string) => Promise<void>;
  addReviewComment: (reviewId: string, text: string) => Promise<void>;

  addCommunityPost: (
    category: '인기글' | '자유게시판' | '질문/답변' | '이벤트',
    title: string,
    content: string,
    images?: string[]
  ) => Promise<void>;
  toggleLikePost: (postId: string) => Promise<void>;
  addPostComment: (postId: string, text: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper for calculating user level based on points
const calculateLevel = (points: number): string => {
  const levelNum = Math.max(1, Math.min(10, Math.floor(points / 200) + 1));
  return `Lv.${levelNum}`;
};

// Initial User Profile
const createInitialUser = (): UserProfile => {
  const cachedUid = localStorage.getItem('sinsangpick_uid');
  const cachedName = localStorage.getItem('sinsangpick_name');
  const cachedPoints = localStorage.getItem('sinsangpick_points');

  const uid = cachedUid || `anon_${Math.random().toString(36).substring(2, 9)}`;
  if (!cachedUid) localStorage.setItem('sinsangpick_uid', uid);

  const points = cachedPoints ? parseInt(cachedPoints, 10) : 100;
  const displayName = cachedName || `신상러버_${uid.slice(-4)}`;

  return {
    uid,
    displayName,
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    level: calculateLevel(points),
    points,
    isAnonymous: true,
  };
};

// Converters from DB types to App types
const mapDBProductToProduct = (dbP: DBProduct): Product => ({
  id: dbP.id,
  name: dbP.name,
  brand: dbP.brand,
  category: dbP.category as ProductCategory,
  subCategory: dbP.sub_category,
  itemType: dbP.item_type,
  image: dbP.image,
  releaseDate: dbP.release_date || '',
  price: dbP.price,
  discountRate: dbP.discount_rate,
  overallRating: Number(dbP.overall_rating) || 0,
  ratingCount: dbP.rating_count || 0,
  detailedRating: dbP.detailed_rating || { taste: 5, value: 5, portion: 5, repurchase: 5 },
  freshMetrics: dbP.fresh_metrics,
  brandRankings: dbP.brand_rankings,
  restaurantInfo: dbP.restaurant_info,
  description: dbP.description,
  bestQuotes: dbP.best_quotes,
  stores: dbP.stores,
  repurchasePercent: dbP.repurchase_percent,
  calories: dbP.calories,
  volume: dbP.volume,
  isToday: dbP.is_today,
  isHot: dbP.is_hot,
});

const mapDBReviewToReview = (dbR: DBReview, isLiked: boolean, comments: ReviewComment[]): Review => ({
  id: dbR.id,
  productId: dbR.product_id,
  productName: dbR.product_name,
  productImage: dbR.product_image,
  userName: dbR.user_name,
  userAvatar: dbR.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  userLevel: dbR.user_level || 'Lv.1',
  rating: Number(dbR.rating),
  detailedRating: dbR.detailed_rating,
  freshMetrics: dbR.fresh_metrics,
  content: dbR.content,
  images: dbR.images || [],
  likes: dbR.likes_count || 0,
  isLiked,
  commentsCount: dbR.comments_count || comments.length,
  comments,
  createdAt: dbR.created_at,
  tags: dbR.tags || [],
});

const mapDBCommunityPostToPost = (dbP: DBCommunityPost, isLiked: boolean, comments: PostComment[]): CommunityPost => ({
  id: dbP.id,
  category: dbP.category,
  title: dbP.title,
  content: dbP.content,
  author: dbP.author_name,
  authorAvatar: dbP.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  authorLevel: dbP.author_level || 'Lv.1',
  likes: dbP.likes_count || 0,
  isLiked,
  commentsCount: dbP.comments_count || comments.length,
  comments,
  createdAt: dbP.created_at,
  images: dbP.images || [],
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(createInitialUser);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);

  const [likedReviewIds, setLikedReviewIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_review_likes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [likedPostIds, setLikedPostIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_post_likes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTabState] = useState<ActiveTab>('home');
  const [previousTab, setPreviousTab] = useState<ActiveTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('전체');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-01');

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_bookmarks');
      return stored ? JSON.parse(stored) : ['prod-01', 'prod-02', 'fruit-01'];
    } catch {
      return ['prod-01', 'prod-02', 'fruit-01'];
    }
  });

  const [comparedIds, setComparedIds] = useState<string[]>(['prod-01', 'prod-03']);
  const [alertCategories, setAlertCategories] = useState<string[]>(['과자', '음료', '아이스크림', '편의점']);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    '꼬북칩',
    '피스타치오',
    '두바이 초콜릿',
    '신라면 똠얌',
  ]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const isSeedingRef = useRef(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('sinsangpick_review_likes', JSON.stringify(likedReviewIds));
  }, [likedReviewIds]);

  useEffect(() => {
    localStorage.setItem('sinsangpick_post_likes', JSON.stringify(likedPostIds));
  }, [likedPostIds]);

  useEffect(() => {
    localStorage.setItem('sinsangpick_bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  useEffect(() => {
    localStorage.setItem('sinsangpick_points', currentUser.points.toString());
    localStorage.setItem('sinsangpick_name', currentUser.displayName);
  }, [currentUser]);

  // Fetch all initial data from Supabase
  const loadSupabaseData = async (uid: string) => {
    if (!supabase) return;

    try {
      // 1. Fetch Products
      const { data: dbProducts, error: prodErr } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (prodErr) throw prodErr;

      if (!dbProducts || dbProducts.length === 0) {
        if (!isSeedingRef.current) {
          isSeedingRef.current = true;
          console.log('[Supabase] Products table is empty. Auto-seeding initial catalog...');
          const formattedProducts = INITIAL_PRODUCTS.map(p => ({
            id: p.id,
            name: p.name,
            brand: p.brand,
            category: p.category,
            sub_category: p.subCategory,
            item_type: p.itemType || 'packaged',
            image: p.image,
            release_date: p.releaseDate,
            price: p.price,
            discount_rate: p.discountRate || 0,
            overall_rating: p.overallRating,
            rating_count: p.ratingCount,
            detailed_rating: p.detailedRating,
            fresh_metrics: p.freshMetrics,
            brand_rankings: p.brandRankings,
            restaurant_info: p.restaurantInfo,
            description: p.description,
            best_quotes: p.bestQuotes,
            stores: p.stores,
            repurchase_percent: p.repurchasePercent || 95,
            calories: p.calories,
            volume: p.volume,
            is_today: p.isToday || false,
            is_hot: p.isHot || false,
          }));
          await supabase.from('products').upsert(formattedProducts);
          setProducts(INITIAL_PRODUCTS);
        }
      } else {
        setProducts(dbProducts.map(mapDBProductToProduct));
      }

      // 2. Fetch User Likes
      const { data: revLikes } = await supabase
        .from('review_likes')
        .select('review_id')
        .eq('user_id', uid);
      const userRevLikes = revLikes ? revLikes.map(r => r.review_id) : [];
      setLikedReviewIds(userRevLikes);

      const { data: pLikes } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', uid);
      const userPostLikes = pLikes ? pLikes.map(p => p.post_id) : [];
      setLikedPostIds(userPostLikes);

      // 3. Fetch Reviews with Comments
      const { data: dbReviews, error: revErr } = await supabase
        .from('reviews')
        .select('*, review_comments(*)')
        .order('created_at', { ascending: false });

      if (!revErr && dbReviews) {
        const parsedReviews: Review[] = dbReviews.map((r: any) => {
          const isLiked = userRevLikes.includes(r.id);
          const comments: ReviewComment[] = (r.review_comments || []).map((c: DBReviewComment) => ({
            id: c.id,
            userName: c.user_name,
            userAvatar: c.user_avatar || '',
            userLevel: c.user_level || 'Lv.1',
            content: c.content,
            createdAt: c.created_at,
          }));
          return mapDBReviewToReview(r, isLiked, comments);
        });
        setReviews(parsedReviews);
      }

      // 4. Fetch Community Posts with Comments
      const { data: dbPosts, error: postErr } = await supabase
        .from('community_posts')
        .select('*, post_comments(*)')
        .order('created_at', { ascending: false });

      if (!postErr && dbPosts) {
        const parsedPosts: CommunityPost[] = dbPosts.map((p: any) => {
          const isLiked = userPostLikes.includes(p.id);
          const comments: PostComment[] = (p.post_comments || []).map((c: DBPostComment) => ({
            id: c.id,
            userName: c.user_name,
            userAvatar: c.user_avatar || '',
            userLevel: c.user_level || 'Lv.1',
            content: c.content,
            createdAt: c.created_at,
          }));
          return mapDBCommunityPostToPost(p, isLiked, comments);
        });
        setCommunityPosts(parsedPosts);
      }

      // 5. Fetch Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();

      if (profile) {
        setCurrentUser(prev => ({
          ...prev,
          displayName: profile.display_name || prev.displayName,
          photoURL: profile.avatar_url || prev.photoURL,
          points: profile.points ?? prev.points,
          level: calculateLevel(profile.points ?? prev.points),
        }));
      }

    } catch (err) {
      console.warn('[Supabase] Failed to load data:', err);
    }
  };

  // Initialize Supabase & Realtime Subscriptions
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      console.info('[Supabase] Running in local/offline state mode (Supabase not configured in .env).');
      return;
    }

    const client = supabase;
    let isMounted = true;

    const init = async () => {
      const { user } = await ensureSupabaseAuth();
      if (!isMounted || !user) return;

      setIsSupabaseConnected(true);
      const uid = user.id;

      setCurrentUser(prev => ({
        ...prev,
        uid,
        displayName: user.user_metadata?.full_name || prev.displayName,
        photoURL: user.user_metadata?.avatar_url || prev.photoURL,
        isAnonymous: user.is_anonymous || false,
      }));

      await loadSupabaseData(uid);

      // Subscribe to Realtime Postgres Changes
      const channel = client.channel('public:db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
          loadSupabaseData(uid);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => {
          loadSupabaseData(uid);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, () => {
          loadSupabaseData(uid);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'review_likes' }, () => {
          loadSupabaseData(uid);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes' }, () => {
          loadSupabaseData(uid);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'review_comments' }, () => {
          loadSupabaseData(uid);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'post_comments' }, () => {
          loadSupabaseData(uid);
        })
        .subscribe();

      return () => {
        client.removeChannel(channel);
      };
    };

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  // Recalculate isLiked states when local like lists change
  useEffect(() => {
    setReviews(prev => prev.map(r => ({
      ...r,
      isLiked: likedReviewIds.includes(r.id),
    })));
  }, [likedReviewIds]);

  useEffect(() => {
    setCommunityPosts(prev => prev.map(p => ({
      ...p,
      isLiked: likedPostIds.includes(p.id),
    })));
  }, [likedPostIds]);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0] || INITIAL_PRODUCTS[0];

  const setActiveTab = (tab: ActiveTab) => {
    setPreviousTab(activeTab);
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (activeTab === 'detail' || activeTab === 'search' || activeTab === 'alert_settings' || activeTab === 'compare' || activeTab === 'write') {
      setActiveTabState(previousTab === activeTab ? 'home' : previousTab);
    } else {
      setActiveTabState('home');
    }
  };

  const openProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    setPreviousTab(activeTab);
    setActiveTabState('detail');
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = 't-' + Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2800);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleBookmark = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isBookmarked = bookmarkedIds.includes(productId);
    if (isBookmarked) {
      setBookmarkedIds(prev => prev.filter(id => id !== productId));
      showToast('찜 목록에서 제거되었습니다.', 'info');
    } else {
      setBookmarkedIds(prev => [...prev, productId]);
      showToast('💖 찜 목록에 저장되었습니다!', 'success');
    }
  };

  const toggleCompare = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isCompared = comparedIds.includes(productId);
    if (isCompared) {
      setComparedIds(prev => prev.filter(id => id !== productId));
      showToast('비교함에서 제외되었습니다.', 'info');
    } else {
      if (comparedIds.length >= 3) {
        showToast('비교함에는 최대 3개까지 담을 수 있습니다.', 'error');
        return;
      }
      setComparedIds(prev => [...prev, productId]);
      showToast('⚖️ 비교함에 담겼습니다!', 'success');
    }
  };

  const removeFromCompare = (productId: string) => {
    setComparedIds(prev => prev.filter(id => id !== productId));
    showToast('비교함에서 삭제되었습니다.', 'info');
  };

  const clearCompare = () => {
    setComparedIds([]);
    showToast('비교함이 모두 비워졌습니다.', 'info');
  };

  const toggleAlertCategory = (cat: string) => {
    if (alertCategories.includes(cat)) {
      setAlertCategories(prev => prev.filter(c => c !== cat));
      showToast(`'${cat}' 알림이 해제되었습니다.`, 'info');
    } else {
      setAlertCategories(prev => [...prev, cat]);
      showToast(`'${cat}' 신제품 출시 알림이 켜졌습니다! 🔔`, 'success');
    }
  };

  const addRecentSearch = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    setRecentSearches(prev => [trimmed, ...prev.filter(k => k !== trimmed)].slice(0, 8));
  };

  const removeRecentSearch = (keyword: string) => {
    setRecentSearches(prev => prev.filter(k => k !== keyword));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    showToast('최근 검색어가 삭제되었습니다.', 'info');
  };

  const updateUserNickname = async (newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setCurrentUser(prev => ({ ...prev, displayName: trimmed }));

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase
          .from('profiles')
          .update({ display_name: trimmed })
          .eq('id', currentUser.uid);
      } catch (err) {
        console.warn('[Supabase] Failed to update user nickname:', err);
      }
    }
    showToast('닉네임이 성공적으로 변경되었습니다.', 'success');
  };

  const loginWithGoogle = async () => {
    try {
      await supabaseSignInWithGoogle();
    } catch (err) {
      showToast('로그인 처리 중 오류가 발생했습니다.', 'error');
    }
  };

  // Submit Review
  const submitReview = async (
    productId: string,
    rating: number,
    detailedRating: DetailedRating,
    content: string,
    images?: string[],
    tags?: string[]
  ) => {
    const targetProduct = products.find(p => p.id === productId) || selectedProduct;
    const reviewId = 'rev-' + Date.now();
    const createdAt = new Date().toISOString();

    const newReview: Review = {
      id: reviewId,
      productId: targetProduct.id,
      productName: targetProduct.name,
      productImage: targetProduct.image,
      userName: currentUser.displayName,
      userAvatar: currentUser.photoURL,
      userLevel: currentUser.level,
      rating,
      detailedRating,
      content: content || '맛있게 잘 먹었습니다! 적극 추천합니다.',
      images: images && images.length > 0 ? images : [targetProduct.image],
      likes: 0,
      isLiked: false,
      commentsCount: 0,
      comments: [],
      createdAt,
      tags: tags && tags.length > 0 ? tags : ['#신상후기', '#내돈내산'],
    };

    // Optimistic rating & count calculation
    const newCount = (targetProduct.ratingCount || 0) + 1;
    const currentTotal = (targetProduct.overallRating || 0) * (targetProduct.ratingCount || 0);
    const newRating = Number(((currentTotal + rating) / newCount).toFixed(1));

    // 1. Optimistic Updates
    setReviews(prev => [newReview, ...prev]);
    setProducts(prev => prev.map(p => {
      if (p.id === targetProduct.id) {
        return {
          ...p,
          ratingCount: newCount,
          overallRating: newRating,
        };
      }
      return p;
    }));

    const nextPoints = currentUser.points + 50;
    setCurrentUser(prev => ({
      ...prev,
      points: nextPoints,
      level: calculateLevel(nextPoints),
    }));

    showToast('🎉 리뷰가 등록되었습니다! (+50P 적립)', 'success');
    setActiveTabState('detail');

    // 2. Supabase Insert (Server-side Trigger automatically updates products.overall_rating & rating_count!)
    if (supabase && isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('reviews').insert({
          id: reviewId,
          product_id: targetProduct.id,
          product_name: targetProduct.name,
          product_image: targetProduct.image,
          user_id: currentUser.uid,
          user_name: currentUser.displayName,
          user_avatar: currentUser.photoURL,
          user_level: currentUser.level,
          rating,
          detailed_rating: detailedRating,
          content: newReview.content,
          images: newReview.images,
          tags: newReview.tags,
          created_at: createdAt,
        });

        if (error) throw error;

        // Update profile points
        await supabase
          .from('profiles')
          .update({ points: nextPoints, level: calculateLevel(nextPoints) })
          .eq('id', currentUser.uid);

      } catch (err) {
        console.error('[Supabase] Review submission error:', err);
      }
    }
  };

  // Toggle Like Review (Duplicate prevention via review_likes PK)
  const toggleLikeReview = async (reviewId: string) => {
    const isCurrentlyLiked = likedReviewIds.includes(reviewId);

    // Optimistic update
    if (isCurrentlyLiked) {
      setLikedReviewIds(prev => prev.filter(id => id !== reviewId));
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, isLiked: false, likes: Math.max(0, r.likes - 1) } : r));
    } else {
      setLikedReviewIds(prev => [...prev, reviewId]);
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, isLiked: true, likes: r.likes + 1 } : r));
    }

    if (supabase && isSupabaseConfigured) {
      try {
        if (isCurrentlyLiked) {
          await supabase
            .from('review_likes')
            .delete()
            .match({ review_id: reviewId, user_id: currentUser.uid });
        } else {
          await supabase
            .from('review_likes')
            .insert({ review_id: reviewId, user_id: currentUser.uid });
        }
      } catch (err) {
        console.error('[Supabase] Toggle like review error:', err);
      }
    }
  };

  // Add Comment to Review
  const addReviewComment = async (reviewId: string, text: string) => {
    if (!text.trim()) return;
    const commentId = 'rc-' + Date.now();
    const createdAt = new Date().toISOString();

    const newComment: ReviewComment = {
      id: commentId,
      userName: currentUser.displayName,
      userAvatar: currentUser.photoURL,
      userLevel: currentUser.level,
      content: text.trim(),
      createdAt: '방금 전',
    };

    // Optimistic update
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          commentsCount: (r.commentsCount || 0) + 1,
          comments: [...(r.comments || []), newComment],
        };
      }
      return r;
    }));
    showToast('댓글이 등록되었습니다.', 'success');

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('review_comments').insert({
          id: commentId,
          review_id: reviewId,
          user_id: currentUser.uid,
          user_name: currentUser.displayName,
          user_avatar: currentUser.photoURL,
          user_level: currentUser.level,
          content: text.trim(),
          created_at: createdAt,
        });
      } catch (err) {
        console.error('[Supabase] Add review comment error:', err);
      }
    }
  };

  // Add Community Post
  const addCommunityPost = async (
    category: '인기글' | '자유게시판' | '질문/답변' | '이벤트',
    title: string,
    content: string,
    images?: string[]
  ) => {
    const postId = 'post-' + Date.now();
    const createdAt = new Date().toISOString();

    const newPost: CommunityPost = {
      id: postId,
      category,
      title: title.trim(),
      content: content.trim(),
      author: currentUser.displayName,
      authorAvatar: currentUser.photoURL,
      authorLevel: currentUser.level,
      likes: 0,
      isLiked: false,
      commentsCount: 0,
      createdAt,
      comments: [],
      images: images || [],
    };

    // Optimistic update
    setCommunityPosts(prev => [newPost, ...prev]);
    const nextPoints = currentUser.points + 20;
    setCurrentUser(prev => ({
      ...prev,
      points: nextPoints,
      level: calculateLevel(nextPoints),
    }));

    showToast('💬 게시글이 등록되었습니다! (+20P 적립)', 'success');

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('community_posts').insert({
          id: postId,
          category,
          title: title.trim(),
          content: content.trim(),
          author_id: currentUser.uid,
          author_name: currentUser.displayName,
          author_avatar: currentUser.photoURL,
          author_level: currentUser.level,
          images: newPost.images,
          created_at: createdAt,
        });

        await supabase
          .from('profiles')
          .update({ points: nextPoints, level: calculateLevel(nextPoints) })
          .eq('id', currentUser.uid);

      } catch (err) {
        console.error('[Supabase] Add community post error:', err);
      }
    }
  };

  // Toggle Like Post (Duplicate prevention via post_likes PK)
  const toggleLikePost = async (postId: string) => {
    const isCurrentlyLiked = likedPostIds.includes(postId);

    // Optimistic update
    if (isCurrentlyLiked) {
      setLikedPostIds(prev => prev.filter(id => id !== postId));
      setCommunityPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked: false, likes: Math.max(0, p.likes - 1) } : p));
    } else {
      setLikedPostIds(prev => [...prev, postId]);
      setCommunityPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked: true, likes: p.likes + 1 } : p));
    }

    if (supabase && isSupabaseConfigured) {
      try {
        if (isCurrentlyLiked) {
          await supabase
            .from('post_likes')
            .delete()
            .match({ post_id: postId, user_id: currentUser.uid });
        } else {
          await supabase
            .from('post_likes')
            .insert({ post_id: postId, user_id: currentUser.uid });
        }
      } catch (err) {
        console.error('[Supabase] Toggle like post error:', err);
      }
    }
  };

  // Add Comment to Community Post
  const addPostComment = async (postId: string, text: string) => {
    if (!text.trim()) return;
    const commentId = 'pc-' + Date.now();
    const createdAt = new Date().toISOString();

    const newComment: PostComment = {
      id: commentId,
      userName: currentUser.displayName,
      userAvatar: currentUser.photoURL,
      userLevel: currentUser.level,
      content: text.trim(),
      createdAt: '방금 전',
    };

    // Optimistic update
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: (p.commentsCount || 0) + 1,
          comments: [...(p.comments || []), newComment],
        };
      }
      return p;
    }));
    showToast('댓글이 등록되었습니다.', 'success');

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('post_comments').insert({
          id: commentId,
          post_id: postId,
          user_id: currentUser.uid,
          user_name: currentUser.displayName,
          user_avatar: currentUser.photoURL,
          user_level: currentUser.level,
          content: text.trim(),
          created_at: createdAt,
        });
      } catch (err) {
        console.error('[Supabase] Add post comment error:', err);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        reviews,
        communityPosts,
        activeTab,
        previousTab,
        selectedCategory,
        selectedProduct,
        selectedProductId,
        bookmarkedIds,
        comparedIds,
        alertCategories,
        searchQuery,
        recentSearches,
        userPoints: currentUser.points,
        toasts,
        currentUser,
        isSupabaseConnected,

        setActiveTab,
        goBack,
        setSelectedCategory,
        openProductDetail,
        toggleBookmark,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        toggleAlertCategory,
        setSearchQuery,
        addRecentSearch,
        removeRecentSearch,
        clearRecentSearches,
        showToast,
        removeToast,
        updateUserNickname,
        loginWithGoogle,

        submitReview,
        toggleLikeReview,
        addReviewComment,
        addCommunityPost,
        toggleLikePost,
        addPostComment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
