import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, Heart, MessageSquare, Send } from 'lucide-react';

interface ReviewListProps {
  productId?: string;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  productId = 'snack-01',
}) => {
  const { reviews, toggleLikeReview, addReviewComment, setActiveTab } = useApp();
  const [sortTab, setSortTab] = useState('최신순');
  const [openCommentReviewId, setOpenCommentReviewId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<{ [reviewId: string]: string }>({});

  const productReviews = reviews.filter(r => r.productId === productId || !productId);

  // Apply sorting
  const sortedReviews = [...productReviews].sort((a, b) => {
    if (sortTab === '인기순') {
      return (b.likes || 0) - (a.likes || 0);
    }
    if (sortTab === '평점높은순') {
      return (b.rating || 0) - (a.rating || 0);
    }
    if (sortTab === '평점낮은순') {
      return (a.rating || 0) - (b.rating || 0);
    }
    // '최신순' default
    const timeA = new Date(a.createdAt).getTime() || 0;
    const timeB = new Date(b.createdAt).getTime() || 0;
    return timeB - timeA;
  });

  const handleAddComment = (reviewId: string) => {
    const text = commentInput[reviewId] || '';
    if (!text.trim()) return;
    addReviewComment(reviewId, text);
    setCommentInput(prev => ({ ...prev, [reviewId]: '' }));
  };

  return (
    <div className="space-y-4">
      <div className="flex border-b border-gray-100 mb-2">
        {['최신순', '인기순', '평점높은순', '평점낮은순'].map((s) => (
          <button
            key={s}
            onClick={() => setSortTab(s)}
            className={`py-2 px-2.5 text-[12px] font-semibold transition-colors ${
              sortTab === s
                ? 'text-[#0066FF] border-b-2 border-[#0066FF]'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {sortedReviews.length > 0 ? (
        <div className="space-y-4">
          {sortedReviews.map((r) => (
            <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={r.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt={r.userName}
                  className="w-8 h-8 rounded-full object-cover bg-gray-100"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-semibold text-gray-900">{r.userName}</span>
                    <span className="text-[10px] text-white bg-gray-400 px-1.5 py-0.2 rounded font-semibold">{r.userLevel}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-400">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 fill-[#FFC107] text-[#FFC107]" />
                      <span className="font-semibold text-gray-700 ml-0.5">{r.rating.toFixed(1)}</span>
                    </div>
                    <span>· {typeof r.createdAt === 'string' && r.createdAt.includes('T') ? new Date(r.createdAt).toLocaleDateString() : r.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Badges: Purchase Place, Verified, Repurchase */}
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                {r.purchasePlace && (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                    🏪 {r.purchasePlace} {r.purchaseEvent ? `· ${r.purchaseEvent}` : ''}
                  </span>
                )}
                {r.repurchaseIntent && (
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                    {r.repurchaseIntent}
                  </span>
                )}
                {r.isReceiptVerified && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                    ✓ 내돈내산 인증
                  </span>
                )}
              </div>

              {/* Headline */}
              {r.headline && (
                <div className="text-[13px] font-black text-gray-900 mb-1 leading-snug">
                  "{r.headline}"
                </div>
              )}

              {/* Flavor Profile Tags */}
              {r.flavorProfile && (r.flavorProfile.sweetness || r.flavorProfile.spiciness || r.flavorProfile.texture) && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {r.flavorProfile.sweetness && (
                    <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      단맛: {r.flavorProfile.sweetness}
                    </span>
                  )}
                  {r.flavorProfile.spiciness && (
                    <span className="text-[10px] font-semibold text-red-800 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                      매운맛: {r.flavorProfile.spiciness}
                    </span>
                  )}
                  {r.flavorProfile.texture && (
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      식감: {r.flavorProfile.texture}
                    </span>
                  )}
                </div>
              )}

              <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-line">
                {r.content}
              </p>

              {/* Target & Keywords Tags */}
              {r.tags && r.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {r.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Photos Gallery */}
              {r.images && r.images.length > 0 && (
                <div className="flex gap-2 mt-2.5 overflow-x-auto no-scrollbar">
                  {r.images.map((imgSrc, imgIdx) => (
                    <img 
                      key={imgIdx} 
                      src={imgSrc} 
                      alt="review" 
                      className={`rounded-xl object-cover border border-gray-100 ${
                        r.images && r.images.length > 1 ? 'w-40 h-32 shrink-0' : 'w-full h-44'
                      }`} 
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 mt-2.5 text-[12px] text-gray-400">
                <button
                  onClick={() => toggleLikeReview(r.id)}
                  className={`flex items-center gap-1 hover:text-rose-500 transition-colors ${
                    r.isLiked ? 'text-rose-500 font-semibold' : ''
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${r.isLiked ? 'fill-rose-500' : ''}`} />
                  <span>도움돼요 {r.likes || 0}</span>
                </button>
                <button
                  onClick={() => setOpenCommentReviewId(openCommentReviewId === r.id ? null : r.id)}
                  className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>댓글 {r.commentsCount || r.comments?.length || 0}</span>
                </button>
              </div>

              {/* Collapsible Comments Section */}
              {openCommentReviewId === r.id && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-2 bg-gray-50/60 p-3 rounded-xl">
                  {r.comments && r.comments.length > 0 ? (
                    r.comments.map((cm) => (
                      <div key={cm.id} className="text-xs space-y-0.5">
                        <div className="flex items-center justify-between text-gray-500 text-[11px]">
                          <span className="font-bold text-gray-800">{cm.userName}</span>
                          <span>{cm.createdAt}</span>
                        </div>
                        <p className="text-gray-700">{cm.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-1">등록된 댓글이 없습니다.</p>
                  )}

                  {/* Comment Input */}
                  <div className="pt-1.5 flex gap-1.5">
                    <input
                      type="text"
                      value={commentInput[r.id] || ''}
                      onChange={(e) => setCommentInput(prev => ({ ...prev, [r.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddComment(r.id);
                      }}
                      placeholder="답글을 남겨보세요"
                      className="flex-1 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-800 outline-none placeholder-gray-400"
                    />
                    <button
                      onClick={() => handleAddComment(r.id)}
                      className="w-7 h-7 rounded-full bg-[#0066FF] text-white flex items-center justify-center shrink-0 hover:bg-blue-600"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-10 px-4 bg-gray-50 rounded-2xl space-y-2.5">
          <div className="text-3xl">✨</div>
          <div className="text-xs font-bold text-gray-800">
            아직 등록된 솔직 후기가 없습니다
          </div>
          <p className="text-[11px] text-gray-400">
            이 상품을 가장 먼저 맛보고 첫 번째 후기를 남겨주세요! (+50P 적립)
          </p>
          <button
            onClick={() => setActiveTab('write')}
            className="mt-2 px-4 py-1.5 bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold rounded-full shadow-xs transition-colors"
          >
            리뷰 작성하기
          </button>
        </div>
      )}
    </div>
  );
};
