import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Star } from 'lucide-react';

interface ReviewListProps {
  productId?: string;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  productId = 'prod-01',
}) => {
  const { reviews, toggleLikeReview } = useApp();
  const [sortTab, setSortTab] = useState('최신순');

  const productReviews = reviews.filter(r => r.productId === productId || !productId);

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
                : 'text-gray-500'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {productReviews.map((r) => (
          <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                {r.userName[0]}
              </div>
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
                  <span>· {r.createdAt}</span>
                </div>
              </div>
            </div>

            <p className="text-[13px] text-gray-700 leading-relaxed">
              {r.content}
            </p>

            {r.images && r.images.length > 0 && (
              <img src={r.images[0]} alt="review" className="mt-2 rounded-xl object-cover w-full" style={{ height: '160px' }} />
            )}

            <div className="flex items-center gap-4 mt-2.5 text-[12px] text-gray-400">
              <button onClick={() => toggleLikeReview(r.id)}>
                ♡ 도움돼요 {r.likes}
              </button>
              <button>💬 댓글</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
