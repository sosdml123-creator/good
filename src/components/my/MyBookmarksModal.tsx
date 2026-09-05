import React from 'react';
import { X, Heart, Star, Trash2, Scale } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MyBookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyBookmarksModal: React.FC<MyBookmarksModalProps> = ({ isOpen, onClose }) => {
  const { products, bookmarkedIds, toggleBookmark, openProductDetail, toggleCompare, comparedIds, setActiveTab } = useApp();

  if (!isOpen) return null;

  const bookmarkedProducts = products.filter(p => bookmarkedIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-bold">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">내가 찜한 먹거리</h2>
              <p className="text-[11px] text-gray-500">총 {bookmarkedProducts.length}개의 상품</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bookmarked list */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100">
          {bookmarkedProducts.length > 0 ? (
            bookmarkedProducts.map((p) => {
              const isCompared = comparedIds.includes(p.id);

              return (
                <div key={p.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    onClick={() => {
                      onClose();
                      openProductDetail(p.id);
                    }}
                    className="w-16 h-16 rounded-xl object-cover bg-gray-50 border border-gray-100 cursor-pointer shrink-0 hover:opacity-90"
                  />
                  <div 
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => {
                      onClose();
                      openProductDetail(p.id);
                    }}
                  >
                    <span className="text-[10px] text-gray-400 font-semibold">{p.brand} · {p.category}</span>
                    <h3 className="text-xs font-bold text-gray-900 truncate mt-0.5">{p.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-black text-gray-900">{p.price.toLocaleString()}원</span>
                      <div className="flex items-center gap-0.5 text-[11px] font-bold text-gray-700">
                        <Star className="w-3 h-3 fill-[#FFC107] text-[#FFC107]" />
                        <span>{p.overallRating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => toggleCompare(p.id, e)}
                      className={`p-2 rounded-xl border transition-colors ${
                        isCompared ? 'bg-blue-50 border-blue-200 text-[#0066FF]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                      title="비교함 담기"
                    >
                      <Scale className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => toggleBookmark(p.id, e)}
                      className="p-2 rounded-xl border border-rose-100 bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                      title="찜 해제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 text-gray-400 space-y-3">
              <span className="text-4xl block">💖</span>
              <div>
                <p className="text-xs font-bold text-gray-800">아직 찜한 먹거리가 없습니다.</p>
                <p className="text-[11px] text-gray-400 mt-0.5">마음에 드는 신상품을 찜하고 모아보세요!</p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  setActiveTab('category');
                }}
                className="px-4 py-2 bg-[#0066FF] text-white text-xs font-bold rounded-full shadow-xs hover:bg-blue-600"
              >
                신제품 둘러보기
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
