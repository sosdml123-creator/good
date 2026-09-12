import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Bell, Star, Plus, Heart, MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { getPopularCommunityPosts, getPopularProducts } from '../../utils/ranking';
import { CommunityPost } from '../../types';

export const CommunityView: React.FC = () => {
  const { 
    products, 
    communityPosts, 
    events,
    recipes,
    openRecipeDetail,
    openWriteRecipe,
    toggleRecipeLike,
    openEventDetail,
    openProductDetail, 
    setActiveTab,
    toggleLikePost,
    addCommunityPost,
    addPostComment,
    showToast 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'인기' | '꿀조합' | '자유게시판' | '질문/답변' | '이벤트'>('인기');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'자유게시판' | '질문/답변' | '이벤트'>('자유게시판');

  // Selected post for comment view
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [commentText, setCommentText] = useState('');

  // 1. Get filtered & sorted posts
  const displayedPosts: CommunityPost[] = activeSubTab === '인기'
    ? getPopularCommunityPosts(communityPosts)
    : communityPosts.filter(p => p.category === activeSubTab);

  const popularTopProducts = getPopularProducts(products, 3);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('제목을 입력해주세요.', 'error');
      return;
    }
    if (!newContent.trim()) {
      showToast('내용을 입력해주세요.', 'error');
      return;
    }

    let finalContent = newContent.trim();
    if (finalContent.includes('coupang.com') && !finalContent.includes('쿠팡 파트너스 활동의 일환')) {
      finalContent += '\n\n이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.';
    }

    await addCommunityPost(newCategory, newTitle, finalContent);
    setNewTitle('');
    setNewContent('');
    setIsWriteModalOpen(false);
  };

  const handleAddComment = async (postId: string) => {
    if (!commentText.trim()) return;
    await addPostComment(postId, commentText);
    setCommentText('');
    // Update active modal selectedPost comments
    const updated = communityPosts.find(p => p.id === postId);
    if (updated) {
      setSelectedPost(updated);
    }
  };

  return (
    <div className="bg-white min-h-full pb-12 relative">
      
      {/* 1. Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-2xs">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-[17px] font-bold text-gray-900">신상 수다방</span>
          <div className="flex items-center gap-2 text-gray-700">
            <button onClick={() => setActiveTab('search')} className="p-1 hover:text-[#0066FF]">
              <Search className="w-5 h-5" />
            </button>
            <button onClick={() => setActiveTab('alert_settings')} className="p-1 hover:text-[#0066FF]">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Subtabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar">
          {(['인기', '꿀조합', '자유게시판', '질문/답변', '이벤트'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveSubTab(t)}
              className={`flex-1 min-w-[65px] py-2.5 text-[13px] font-semibold transition-colors whitespace-nowrap ${
                activeSubTab === t ? 'text-[#0066FF] border-b-2 border-[#0066FF]' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {t === '꿀조합' ? '꿀조합 🥪' : t}
            </button>
          ))}
        </div>
      </div>

      {/* 2. 이번 주 신상 랭킹 */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[14px] font-bold text-gray-900">🔥 이번 주 신상 랭킹</span>
          <button onClick={() => setActiveTab('category')} className="text-[12px] text-gray-400">
            전체보기
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {popularTopProducts.map((p, i) => (
            <div
              key={p.id}
              onClick={() => openProductDetail(p.id)}
              className="shrink-0 w-[100px] cursor-pointer hover:opacity-90 transition-opacity"
            >
              <div className="relative rounded-xl overflow-hidden bg-gray-100" style={{ height: '100px' }}>
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                <span className={`absolute top-1.5 left-1.5 w-5 h-5 rounded-md ${
                  i === 0 ? 'bg-[#0066FF]' : i === 1 ? 'bg-gray-600' : 'bg-gray-400'
                } text-white text-[10px] font-black flex items-center justify-center`}>
                  {i + 1}
                </span>
              </div>
              <div className="mt-1.5">
                <div className="text-[11px] font-semibold text-gray-800 truncate leading-snug">
                  {p.name}
                </div>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <Star className="w-3 h-3 fill-[#FFC107] text-[#FFC107]" />
                  <span className="text-[11px] font-semibold text-gray-700">{p.overallRating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2.5 Active Events & Promotions (When 이벤트 tab is active) */}
      {activeSubTab === '이벤트' && events.length > 0 && (
        <div className="bg-[#F8F9FA] p-4 border-b border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#0066FF]" />
              <span className="text-xs font-black text-gray-900">현재 모집 중인 체험단 & 프로모션</span>
            </div>
            <span className="text-[11px] text-[#0066FF] font-bold">{events.length}개 진행</span>
          </div>

          <div className="space-y-3">
            {events.map((ev) => (
              <div
                key={ev.id}
                onClick={() => openEventDetail(ev.id)}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="relative aspect-16/8 bg-gray-900 overflow-hidden">
                  <img
                    src={ev.bannerImage}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-black text-white bg-[#0066FF] px-2.5 py-0.5 rounded-full shadow-xs">
                    {ev.badge}
                  </span>

                  <span className="absolute top-2.5 right-2.5 text-[10px] font-bold text-amber-300 bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                    {ev.dDay}
                  </span>

                  <div className="absolute bottom-2 left-3 right-3 text-white text-xs font-black truncate">
                    {ev.title}
                  </div>
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-[11px] text-gray-600 line-clamp-1 font-medium">
                      🎁 {ev.reward}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-0.5 block">
                      기간: {ev.startDate} ~ {ev.endDate}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#0066FF] bg-blue-50 px-2.5 py-1.5 rounded-xl shrink-0">
                    신청하기
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2.8 Recipe Feed Section (When 꿀조합 tab is active) */}
      {activeSubTab === '꿀조합' ? (
        <div className="p-4 space-y-4 bg-gray-50/50">
          {/* Banner & Write Button */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full inline-block mb-1">
                🥪 편의점 맛잘알 공간
              </span>
              <h3 className="text-sm font-black">나만의 신상 꿀조합을 공유해보세요!</h3>
              <p className="text-[11px] text-white/80 mt-0.5">등록 시 50P 즉시 지급 ✨</p>
            </div>
            <button
              onClick={openWriteRecipe}
              className="px-3.5 py-2 rounded-xl bg-white text-orange-600 font-bold text-xs shadow-xs hover:bg-orange-50 transition-all active:scale-95 shrink-0"
            >
              레시피 등록 +
            </button>
          </div>

          {/* 2-Column Recipe Cards Grid */}
          <div className="grid grid-cols-2 gap-3">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => openRecipeDetail(recipe.id)}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-1.5 left-1.5 text-[9px] font-black bg-black/60 text-white px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                      ⏱️ {recipe.prepTime}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRecipeLike(recipe.id);
                      }}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/85 backdrop-blur-xs flex items-center justify-center shadow-xs text-xs active:scale-90"
                    >
                      <Heart className={`w-3.5 h-3.5 ${recipe.isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
                    </button>
                  </div>

                  <div className="p-2.5">
                    <div className="text-[10px] text-gray-400 font-medium truncate">
                      {recipe.author} · {recipe.difficulty}
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2 mt-0.5 group-hover:text-[#0066FF] transition-colors">
                      {recipe.title}
                    </h4>
                  </div>
                </div>

                <div className="px-2.5 pb-2.5 pt-1 border-t border-gray-50 flex items-center justify-between text-[10px]">
                  <span className="font-extrabold text-gray-900">
                    약 {recipe.totalCost.toLocaleString()}원
                  </span>
                  <span className="text-gray-400 font-medium">
                    ♡ {recipe.likes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 3. Post list */
        <div className="bg-white divide-y divide-gray-100">
        {displayedPosts.length > 0 ? (
          displayedPosts.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedPost(c)}
              className="px-4 py-3.5 flex items-center justify-between cursor-pointer active:bg-gray-50 hover:bg-gray-50/60 transition-colors"
            >
              <div className="flex items-start gap-2.5 flex-1 min-w-0 pr-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block text-[10px] font-semibold text-[#0066FF] bg-blue-50 px-1.5 py-0.2 rounded">
                      {c.category}
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">
                      {c.author}
                    </span>
                  </div>
                  <div className="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2">
                    {c.title}
                  </div>
                  <p className="text-[12px] text-gray-500 line-clamp-1 mt-0.5">
                    {c.content}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400">
                    <span>{typeof c.createdAt === 'string' && c.createdAt.includes('T') ? new Date(c.createdAt).toLocaleDateString() : c.createdAt}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLikePost(c.id);
                      }}
                      className={`flex items-center gap-1 hover:text-rose-500 transition-colors ${
                        c.isLiked ? 'text-rose-500 font-semibold' : ''
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${c.isLiked ? 'fill-rose-500' : ''}`} />
                      <span>{c.likes || 0}</span>
                    </button>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{c.commentsCount || c.comments?.length || 0}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          /* Empty state */
          <div className="text-center py-16 px-4 space-y-3">
            <div className="text-4xl">💬</div>
            <div className="text-[14px] font-bold text-gray-800">
              {activeSubTab === '인기' ? '아직 등록된 게시글이 없습니다' : `'${activeSubTab}'에 첫 글을 남겨보세요!`}
            </div>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              새로 나온 신상 먹거리 후기나 질문, 자유로운 잡담을 회원들과 함께 나누어보세요. (+20P 적립)
            </p>
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="mt-2 px-5 py-2 bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold rounded-full shadow-sm transition-all"
            >
              글 작성하기
            </button>
          </div>
        )}
      </div>
      )}

      {/* 4. Write FAB */}
      <button
        onClick={() => setIsWriteModalOpen(true)}
        className="fixed bottom-20 right-5 w-12 h-12 rounded-full bg-[#0066FF] text-white shadow-lg flex items-center justify-center z-30 active:scale-95 transition-transform"
        title="글쓰기"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* 5. Write Post Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-[16px] font-bold text-gray-900">새 수다글 작성</span>
              <button onClick={() => setIsWriteModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">카테고리</label>
                <div className="flex gap-2">
                  {(['자유게시판', '질문/답변', '이벤트'] as const).map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setNewCategory(cat)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                        newCategory === cat
                          ? 'border-[#0066FF] bg-blue-50 text-[#0066FF]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">제목</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700 block">내용</label>
                  <button
                    type="button"
                    onClick={() => {
                      const notice = '\n\n이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.';
                      if (!newContent.includes('쿠팡 파트너스 활동의 일환')) {
                        setNewContent(prev => prev.trim() + notice);
                      }
                    }}
                    className="text-[11px] font-bold text-[#0066FF] hover:underline"
                  >
                    + 쿠팡 파트너스 문구 삽입
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="신상에 대한 궁금증, 꿀조합, 솔직한 느낌을 자유롭게 적어보세요! (제휴/파트너스 링크 첨부 시 안내 문구를 삽입해 주세요)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 outline-none resize-none focus:border-[#0066FF]"
                />
                <p className="mt-1 text-[10px] text-gray-400">
                  ※ 쿠팡 링크 첨부 시 필수 고지 문구가 자동으로 추가됩니다.
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0066FF] text-white text-xs font-bold shadow-sm hover:bg-blue-600 transition-colors"
                >
                  등록 (+20P)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Post Detail / Comments Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-bold text-[#0066FF] bg-blue-50 px-2 py-0.5 rounded">
                {selectedPost.category}
              </span>
              <button onClick={() => setSelectedPost(null)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              <h3 className="text-sm font-bold text-gray-900 leading-snug">{selectedPost.title}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-400 border-b border-gray-100 pb-2">
                <span className="font-semibold text-gray-700">{selectedPost.author}</span>
                <span>·</span>
                <span>{typeof selectedPost.createdAt === 'string' && selectedPost.createdAt.includes('T') ? new Date(selectedPost.createdAt).toLocaleDateString() : selectedPost.createdAt}</span>
              </div>
              <p className="text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">
                {selectedPost.content}
              </p>

              {/* Likes button */}
              <div className="pt-2 flex items-center gap-2 border-t border-gray-100">
                <button
                  onClick={() => toggleLikePost(selectedPost.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${
                    selectedPost.isLiked ? 'border-rose-300 bg-rose-50 text-rose-500' : 'border-gray-200 text-gray-600'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${selectedPost.isLiked ? 'fill-rose-500' : ''}`} />
                  <span>좋아요 {selectedPost.likes || 0}</span>
                </button>
              </div>

              {/* Comments Section */}
              <div className="pt-3">
                <div className="text-xs font-bold text-gray-800 mb-2">
                  댓글 ({selectedPost.commentsCount || selectedPost.comments?.length || 0})
                </div>
                <div className="space-y-2">
                  {(selectedPost.comments && selectedPost.comments.length > 0) ? (
                    selectedPost.comments.map((cm) => (
                      <div key={cm.id} className="bg-gray-50 rounded-xl p-2.5 text-xs">
                        <div className="flex items-center justify-between text-gray-500 text-[11px] mb-1">
                          <span className="font-bold text-gray-800">{cm.userName}</span>
                          <span>{cm.createdAt}</span>
                        </div>
                        <p className="text-gray-700">{cm.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-xs text-gray-400">등록된 댓글이 없습니다.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Comment Input */}
            <div className="pt-3 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddComment(selectedPost.id);
                  }
                }}
                placeholder="따뜻한 댓글을 남겨보세요"
                className="flex-1 bg-gray-100 rounded-full px-3.5 py-2 text-xs text-gray-800 outline-none placeholder-gray-400"
              />
              <button
                onClick={() => handleAddComment(selectedPost.id)}
                className="w-8 h-8 rounded-full bg-[#0066FF] text-white flex items-center justify-center shrink-0 hover:bg-blue-600"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
