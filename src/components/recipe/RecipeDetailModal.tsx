import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Share2, 
  Heart, 
  Clock, 
  Coins, 
  ChevronRight, 
  ChefHat, 
  ShoppingBag,
  Lightbulb
} from 'lucide-react';

export const RecipeDetailModal: React.FC = () => {
  const { 
    selectedRecipe, 
    isRecipeDetailOpen, 
    closeRecipeDetail, 
    toggleRecipeLike, 
    openProductDetail,
    showToast 
  } = useApp();

  if (!isRecipeDetailOpen || !selectedRecipe) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    showToast('🔗 꿀조합 레시피 링크가 복사되었습니다!');
  };

  const handleIngredientClick = (productId?: string, name?: string) => {
    if (productId) {
      closeRecipeDetail();
      openProductDetail(productId);
    } else {
      showToast(`🛒 [${name || '재료'}] 편의점 매장에서 구매하실 수 있어요!`, 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-center items-end sm:items-center animate-in fade-in duration-200">
      <div 
        className="w-full max-w-[430px] bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Modal Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-1.5 font-black text-sm text-gray-900">
            <span>🥪</span>
            <span>신상 꿀조합 레시피</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="p-1.5 text-gray-600 hover:text-[#0066FF] transition-colors rounded-full hover:bg-gray-100"
              aria-label="공유하기"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={closeRecipeDetail}
              className="p-1.5 text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
              aria-label="닫기"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 2. Scrollable Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
          {/* Main Visual Image */}
          <div className="relative aspect-16/10 bg-gray-900 overflow-hidden">
            <img 
              src={selectedRecipe.image} 
              alt={selectedRecipe.title} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <div className="flex flex-wrap gap-1 mb-1.5">
                {selectedRecipe.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-bold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/30">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-lg font-black leading-tight drop-shadow-sm">
                {selectedRecipe.title}
              </h2>
            </div>
          </div>

          {/* Recipe Info & Author Header */}
          <div className="p-4 border-b border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <img 
                  src={selectedRecipe.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80'} 
                  alt={selectedRecipe.author} 
                  className="w-8 h-8 rounded-full object-cover border border-gray-200" 
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-900">{selectedRecipe.author}</span>
                    <span className="text-[10px] font-semibold text-[#0066FF] bg-blue-50 px-1.5 py-0.2 rounded">
                      {selectedRecipe.authorLevel || 'LV.1'}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">{selectedRecipe.createdAt}</span>
                </div>
              </div>

              {/* Like Button */}
              <button
                onClick={() => toggleRecipeLike(selectedRecipe.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 ${
                  selectedRecipe.isLiked
                    ? 'border-rose-200 bg-rose-50 text-rose-600'
                    : 'border-gray-200 text-gray-600 hover:border-rose-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${selectedRecipe.isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
                <span>{selectedRecipe.likes}</span>
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
              {selectedRecipe.description}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100">
                <div className="flex items-center justify-center gap-1 text-[10px] text-blue-800 font-bold">
                  <Clock className="w-3 h-3 text-[#0066FF]" />
                  <span>소요 시간</span>
                </div>
                <div className="text-sm font-black text-gray-900 mt-0.5">{selectedRecipe.prepTime}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100">
                <div className="flex items-center justify-center gap-1 text-[10px] text-amber-800 font-bold">
                  <ChefHat className="w-3 h-3 text-amber-600" />
                  <span>난이도</span>
                </div>
                <div className="text-sm font-black text-gray-900 mt-0.5">{selectedRecipe.difficulty}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-800 font-bold">
                  <Coins className="w-3 h-3 text-emerald-600" />
                  <span>예상 재료비</span>
                </div>
                <div className="text-sm font-black text-gray-900 mt-0.5">
                  약 {selectedRecipe.totalCost.toLocaleString()}원
                </div>
              </div>
            </div>
          </div>

          {/* 3. Ingredients Section */}
          <div className="p-4 border-b border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-[#0066FF]" />
                <h3 className="text-[14px] font-black text-gray-900">필요한 편의점 재료</h3>
              </div>
              <span className="text-[11px] text-[#0066FF] font-bold">
                총 {selectedRecipe.ingredients.length}개 재료
              </span>
            </div>

            <div className="space-y-2">
              {selectedRecipe.ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  onClick={() => handleIngredientClick(ing.productId, ing.name)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-white text-gray-500 font-bold text-xs flex items-center justify-center border border-gray-200 shadow-2xs">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors">
                          {ing.name}
                        </span>
                        {ing.isKeyItem && (
                          <span className="text-[9px] font-black bg-rose-500 text-white px-1.5 py-0.2 rounded">
                            핵심
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {ing.store && <span>{ing.store} · </span>}
                        {ing.amount && <span>{ing.amount}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {ing.price !== undefined && ing.price > 0 && (
                      <span className="text-xs font-bold text-gray-800">
                        {ing.price.toLocaleString()}원
                      </span>
                    )}
                    {ing.productId ? (
                      <span className="text-[10px] font-bold text-[#0066FF] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 flex items-center">
                        신상보기 <ChevronRight className="w-3 h-3 ml-0.5" />
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                        편의점
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Steps Section */}
          <div className="p-4 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-1.5 mb-3">
              <ChefHat className="w-4 h-4 text-[#0066FF]" />
              <h3 className="text-[14px] font-black text-gray-900">만드는 순서 (초간단 레시피)</h3>
            </div>

            <div className="space-y-3">
              {selectedRecipe.steps.map((step, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-[#0066FF] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    {idx + 1}
                  </span>
                  <div className="flex-1 text-xs text-gray-800 font-medium leading-relaxed bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                    {step}
                  </div>
                </div>
              ))}
            </div>

            {/* Chef Tip Box */}
            {selectedRecipe.tips && (
              <div className="mt-3.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-900 leading-relaxed font-medium">
                  <b className="font-black text-amber-950">맛잘알 꿀팁:</b> {selectedRecipe.tips}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 5. Fixed Bottom Action */}
        <div className="p-3 border-t border-gray-100 bg-white flex items-center gap-2">
          <button
            onClick={() => toggleRecipeLike(selectedRecipe.id)}
            className={`flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-98 ${
              selectedRecipe.isLiked
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${selectedRecipe.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{selectedRecipe.isLiked ? '좋아요 취소' : '이 레시피 추천해요!'} ({selectedRecipe.likes})</span>
          </button>

          <button
            onClick={closeRecipeDetail}
            className="px-5 py-3 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-bold transition-colors active:scale-98"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
