import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Bell, Star, Plus } from 'lucide-react';

export const CommunityView: React.FC = () => {
  const { 
    products, 
    communityPosts, 
    openProductDetail, 
    setActiveTab,
    toggleLikePost,
    showToast 
  } = useApp();

  return (
    <div className="bg-white min-h-screen pb-28 relative">
      
      {/* 1. Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-2xs">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-[17px] font-bold text-gray-900">신상 수다방</span>
          <div className="flex items-center gap-2 text-gray-700">
            <button onClick={() => setActiveTab('search')} className="p-1">
              <Search className="w-5 h-5" />
            </button>
            <button onClick={() => setActiveTab('alert_settings')} className="p-1">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Subtabs */}
        <div className="flex border-b border-gray-100">
          {['인기', '자유게시판', '질문/답변', '이벤트'].map((t, i) => (
            <button
              key={t}
              className={`flex-1 py-2.5 text-[13px] font-semibold ${
                i === 0 ? 'text-[#0066FF] border-b-2 border-[#0066FF]' : 'text-gray-500'
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
          <span className="text-[14px] font-bold text-gray-900">이번 주 신상 랭킹</span>
          <button onClick={() => setActiveTab('category')} className="text-[12px] text-gray-400">
            전체보기
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {products.slice(0, 3).map((p, i) => (
            <div
              key={p.id}
              onClick={() => openProductDetail(p.id)}
              className="shrink-0 w-[100px] cursor-pointer"
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
        {communityPosts.map((c) => (
          <div
            key={c.id}
            onClick={() => toggleLikePost(c.id)}
            className="px-4 py-3.5 flex items-center justify-between cursor-pointer active:bg-gray-50 hover:bg-gray-50/60"
          >
            <div className="flex items-start gap-2.5 flex-1 min-w-0 pr-3">
              <div>
                <span className="inline-block text-[10px] font-semibold text-[#0066FF] mb-1">
                  {c.category === '인기글' ? '인기' : c.category}
                </span>
                <div className="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2">
                  {c.title}
                </div>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                  <span>{c.createdAt}</span>
                  <span>♡ {c.likes}</span>
                  <span>💬 {c.commentsCount || c.comments?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Write FAB */}
      <button
        onClick={() => showToast('글쓰기 모달이 열립니다.')}
        className="fixed bottom-20 right-5 w-12 h-12 rounded-full bg-[#0066FF] text-white shadow-lg flex items-center justify-center z-30 active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

    </div>
  );
};
