import React, { createContext, useContext, useState } from 'react';
import { 
  Product, 
  Review, 
  CommunityPost, 
  ActiveTab, 
  ProductCategory,
  DetailedRating,
  ToastMessage
} from '../types';
import { INITIAL_PRODUCTS } from '../data/mockProducts';
import { INITIAL_REVIEWS } from '../data/mockReviews';
import { INITIAL_COMMUNITY_POSTS } from '../data/mockCommunity';

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

  // Interactions
  submitReview: (
    productId: string,
    rating: number,
    detailedRating: DetailedRating,
    content: string,
    images?: string[],
    tags?: string[]
  ) => void;
  toggleLikeReview: (reviewId: string) => void;
  addReviewComment: (reviewId: string, text: string) => void;

  addCommunityPost: (category: '인기글' | '자유게시판' | '질문/답변' | '이벤트', title: string, content: string) => void;
  toggleLikePost: (postId: string) => void;
  addPostComment: (postId: string, text: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  
  const [activeTab, setActiveTabState] = useState<ActiveTab>('home');
  const [previousTab, setPreviousTab] = useState<ActiveTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('전체');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-01');
  
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['prod-01', 'prod-02', 'prod-06']);
  const [comparedIds, setComparedIds] = useState<string[]>(['prod-01', 'prod-03']);
  const [alertCategories, setAlertCategories] = useState<string[]>(['과자', '음료', '아이스크림', '편의점']);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    '꼬북칩',
    '피스타치오',
    '두바이 초콜릿',
    '신라면 똠얌',
  ]);
  const [userPoints, setUserPoints] = useState(1250);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

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

  const submitReview = (
    productId: string,
    rating: number,
    detailedRating: DetailedRating,
    content: string,
    images?: string[],
    tags?: string[]
  ) => {
    const targetProduct = products.find(p => p.id === productId) || selectedProduct;

    // 1. Create new review
    const newReview: Review = {
      id: 'rev-' + Date.now(),
      productId: targetProduct.id,
      productName: targetProduct.name,
      productImage: targetProduct.image,
      userName: '신상러버',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      userLevel: 'Lv.6',
      rating,
      detailedRating,
      content: content || '맛있게 잘 먹었습니다! 적극 추천합니다.',
      images: images && images.length > 0 ? images : [targetProduct.image],
      likes: 0,
      isLiked: false,
      commentsCount: 0,
      createdAt: '방금 전',
      tags: tags && tags.length > 0 ? tags : ['#신상후기', '#내돈내산'],
    };

    setReviews(prev => [newReview, ...prev]);

    // 2. Recalculate product rating & count
    setProducts(prev => prev.map(p => {
      if (p.id === targetProduct.id) {
        const newCount = p.ratingCount + 1;
        const newRating = Number(((p.overallRating * p.ratingCount + rating) / newCount).toFixed(1));
        return {
          ...p,
          ratingCount: newCount,
          overallRating: newRating,
        };
      }
      return p;
    }));

    // 3. Award points
    setUserPoints(prev => prev + 50);
    showToast('🎉 리뷰가 등록되었습니다! (+50P 적립)', 'success');
    setActiveTabState('detail');
  };

  const toggleLikeReview = (reviewId: string) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        const isLiked = !r.isLiked;
        return {
          ...r,
          isLiked,
          likes: isLiked ? r.likes + 1 : Math.max(0, r.likes - 1),
        };
      }
      return r;
    }));
  };

  const addReviewComment = (reviewId: string, text: string) => {
    if (!text.trim()) return;
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        const newComment = {
          id: 'c-' + Date.now(),
          userName: '신상러버',
          userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          userLevel: 'Lv.6',
          content: text.trim(),
          createdAt: '방금 전',
        };
        return {
          ...r,
          commentsCount: r.commentsCount + 1,
          comments: [...(r.comments || []), newComment],
        };
      }
      return r;
    }));
    showToast('댓글이 등록되었습니다.', 'success');
  };

  const addCommunityPost = (
    category: '인기글' | '자유게시판' | '질문/답변' | '이벤트',
    title: string,
    content: string
  ) => {
    const newPost: CommunityPost = {
      id: 'post-' + Date.now(),
      category,
      title: title.trim(),
      content: content.trim(),
      author: '신상러버',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      authorLevel: 'Lv.6',
      likes: 0,
      isLiked: false,
      commentsCount: 0,
      createdAt: '방금 전',
      comments: [],
    };
    setCommunityPosts(prev => [newPost, ...prev]);
    setUserPoints(prev => prev + 20);
    showToast('💬 게시글이 등록되었습니다! (+20P 적립)', 'success');
  };

  const toggleLikePost = (postId: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
        };
      }
      return p;
    }));
  };

  const addPostComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const newComment = {
          id: 'cm-' + Date.now(),
          userName: '신상러버',
          userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          userLevel: 'Lv.6',
          content: text.trim(),
          createdAt: '방금 전',
        };
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...(p.comments || []), newComment],
        };
      }
      return p;
    }));
    showToast('댓글이 등록되었습니다.', 'success');
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
        userPoints,
        toasts,

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
