import React from 'react';
import { X, PenSquare, Star, Heart, MessageSquare, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MyReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyReviewsModal: React.FC<MyReviewsModalProps> = ({ isOpen, onClose }) => {
  const { reviews, currentUser, openProductDetail, setActiveTab } = useApp();

  if (!isOpen) return null;

  const myReviews = reviews.filter(r => r.userName === currentUser.displayName);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0066FF] flex items-center justify-center font-bold">
              <PenSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">내가 쓴 솔직 후기</h2>
              <p className="text-[11px] text-gray-500">총 {myReviews.length}개의 작성 리뷰</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reviews List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100">
          {myReviews.length > 0 ? (
            myReviews.map((r) => (
              <div key={r.id} className="py-4 first:pt-0 last:pb-0 space-y-2.5">
                
                {/* Product link header */}
                <div 
                  onClick={() => {
                    onClose();
                    openProductDetail(r.productId);
                  }}
                  className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-blue-50/50 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {r.productImage && (
                      <img src={r.productImage} alt={r.productName} className="w-8 h-8 rounded-lg object-cover bg-white" />
                    )}
                    <span className="text-xs font-bold text-gray-900 truncate">{r.productName}</span>
                  </div>
                  <span className="text-[11px] text-[#0066FF] font-semibold flex items-center gap-0.5 shrink-0">
                    상세보기
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>

                {/* Rating & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      <Star className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
                    </div>
                    <span className="text-xs font-bold text-gray-900">{r.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    {typeof r.createdAt === 'string' && r.createdAt.includes('T') ? new Date(r.createdAt).toLocaleDateString() : r.createdAt}
                  </span>
                </div>

                {/* Review Content */}
                <p className="text-xs text-gray-700 leading-relaxed bg-white">
                  {r.content}
                </p>

                {/* Image preview */}
                {r.images && r.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1">
                    {r.images.map((img, idx) => (
                      <img 
                        key={idx} 
                        src={img} 
                        alt="review" 
                        className="w-20 h-20 rounded-xl object-cover border border-gray-100 shrink-0" 
                      />
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-3 pt-1 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1 text-rose-500">
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    <span>도움돼요 {r.likes || 0}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>댓글 {r.commentsCount || r.comments?.length || 0}</span>
                  </span>
                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-16 text-gray-400 space-y-3">
              <span className="text-4xl block">✍️</span>
              <div>
                <p className="text-xs font-bold text-gray-800">아직 작성한 리뷰가 없습니다.</p>
                <p className="text-[11px] text-gray-400 mt-0.5">신상을 맛보고 첫 솔직 리뷰를 남겨보세요! (+50P 적립)</p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  setActiveTab('write');
                }}
                className="px-4 py-2 bg-[#0066FF] text-white text-xs font-bold rounded-full shadow-xs hover:bg-blue-600"
              >
                리뷰 작성하기
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
