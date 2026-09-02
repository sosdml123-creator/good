import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Bell, Star, Plus, Heart, MessageSquare, X, Send } from 'lucide-react';
import { getPopularCommunityPosts, getPopularProducts } from '../../utils/ranking';
import { CommunityPost } from '../../types';

export const CommunityView: React.FC = () => {
  const { 
    products, 
    communityPosts, 
    openProductDetail, 
    setActiveTab,
    toggleLikePost,
    addCommunityPost,
    addPostComment,
    showToast 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'인기' | '자유게시판' | '질문/답변' | '이벤트'>('인기');
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

    await addCommunityPost(newCategory, newTitle, newContent);
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
    <div className="bg-white min-h-screen pb-28 relative">
      
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
        <div className="flex border-b border-gray-100">
          {(['인기', '자유게시판', '질문/답변', '이벤트'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveSubTab(t)}
              className={`flex-1 py-2.5 text-[13px] font-semibold transition-colors ${
                activeSubTab === t ? 'text-[#0066FF] border-b-2 border-[#0066FF]' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {t}
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

      {/* 3. Post list */}
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
                <label className="text-xs font-bold text-gray-700 block mb-1.5">내용</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="신상에 대한 궁금증, 꿀조합, 솔직한 느낌을 자유롭게 적어보세요!"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 outline-none resize-none focus:border-[#0066FF]"
                />
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
