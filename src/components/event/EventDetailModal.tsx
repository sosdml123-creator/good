import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, 
  Share2, 
  Calendar, 
  Gift, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  ArrowRight,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const EventDetailModal: React.FC = () => {
  const { 
    selectedEvent, 
    products, 
    goBack, 
    openProductDetail, 
    participateInEvent, 
    showToast,
    currentUser 
  } = useApp();

  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<Array<{ id: string; user: string; text: string; time: string }>>([
    { id: 'c-1', user: '신상얼리어답터', text: '꼬북칩 신상 소식 듣고 바로 달려왔어요! 벨기에 초콜릿이라니 너무 기대됩니다 🍫', time: '1시간 전' },
    { id: 'c-2', user: '편의점마스터', text: '체험단 꼭 뽑혔으면 좋겠어요!! 솔직하고 꼼꼼한 먹방 후기 남길게요 ㅎㅎ', time: '3시간 전' },
    { id: 'c-3', user: '단짠요정', text: '주변 친구들한테도 바로 공유했음! 다들 신상픽 알림 켜두세요 🚀', time: '5시간 전' },
  ]);

  if (!selectedEvent) return null;

  const targetProduct = selectedEvent.targetProductId 
    ? products.find(p => p.id === selectedEvent.targetProductId) 
    : null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    showToast('🔗 이벤트 링크가 클립보드에 복사되었습니다!', 'success');
  };

  const handleParticipate = () => {
    if (selectedEvent.isParticipated) {
      showToast('이미 신청 완료된 이벤트입니다.', 'info');
      return;
    }

    participateInEvent(selectedEvent.id);

    // Confetti effect
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#0066FF', '#10B981', '#F59E0B', '#EC4899'],
      });
    } catch (e) {
      console.warn('confetti trigger error:', e);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment = {
      id: 'c-' + Date.now(),
      user: currentUser.displayName,
      text: commentInput.trim(),
      time: '방금 전',
    };

    setComments(prev => [newComment, ...prev]);
    setCommentInput('');
    showToast('기대평 댓글이 등록되었습니다! (+10P)', 'success');
  };

  return (
    <div className="bg-[#F8F9FA] min-h-full pb-28 relative animate-in fade-in duration-200">
      {/* 1. Header Bar */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between z-30 shadow-2xs">
        <button
          onClick={goBack}
          className="p-1 -ml-1 text-gray-800 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <h1 className="text-sm font-bold text-gray-900 truncate max-w-[220px]">
          이벤트·프로모션
        </h1>

        <button
          onClick={handleShare}
          className="p-1.5 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="공유하기"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Banner Image */}
      <div className="relative w-full aspect-16/10 bg-gray-900 overflow-hidden">
        <img
          src={selectedEvent.bannerImage}
          alt={selectedEvent.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
          <span className="text-xs font-black text-white bg-[#0066FF] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 fill-white" />
            {selectedEvent.badge}
          </span>
          <span className="text-xs font-bold text-white bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
            {selectedEvent.category}
          </span>
        </div>

        {/* D-Day badge */}
        <div className="absolute top-4 right-4">
          <span className="text-xs font-black text-amber-300 bg-amber-950/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-amber-400/40 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {selectedEvent.dDay}
          </span>
        </div>

        {/* Title over Banner Bottom */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h2 className="text-lg font-black leading-snug">
            {selectedEvent.title}
          </h2>
          <p className="text-xs text-white/80 font-medium mt-1 line-clamp-1">
            {selectedEvent.subtitle}
          </p>
        </div>
      </div>

      {/* 3. Event Meta Card */}
      <div className="p-4 space-y-3">
        <div className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-[#0066FF]" />
              <span>진행 기간</span>
            </div>
            <span className="font-bold text-gray-800">
              {selectedEvent.startDate} ~ {selectedEvent.endDate}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-3">
            <div className="flex items-center gap-1.5 font-medium text-gray-500">
              <Users className="w-4 h-4 text-emerald-500" />
              <span>현재 참여 인원</span>
            </div>
            <span className="font-bold text-[#0066FF]">
              {selectedEvent.participantsCount.toLocaleString()}명 신청 중
            </span>
          </div>
        </div>

        {/* 4. Reward Highlight Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-4 border border-blue-100/80 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-xl bg-[#0066FF] text-white flex items-center justify-center shadow-xs">
              <Gift className="w-4 h-4" />
            </div>
            <span className="text-xs font-black text-gray-900">이벤트 혜택 & 선물</span>
          </div>
          <p className="text-sm font-black text-[#0066FF] pl-9">
            {selectedEvent.reward}
          </p>
        </div>

        {/* 5. Linked Product Card (if available) */}
        {targetProduct && (
          <div className="bg-white rounded-2xl p-3.5 shadow-2xs border border-gray-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-black text-gray-900">이벤트 대상 신상품</span>
              <button 
                onClick={() => openProductDetail(targetProduct.id)}
                className="text-[11px] font-bold text-[#0066FF] flex items-center gap-0.5 hover:underline"
              >
                <span>상세스펙 보기</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div 
              onClick={() => openProductDetail(targetProduct.id)}
              className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl hover:bg-gray-100/80 cursor-pointer transition-colors border border-gray-100"
            >
              <img 
                src={targetProduct.image} 
                alt={targetProduct.name} 
                className="w-14 h-14 rounded-xl object-cover border border-gray-200 bg-white shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-[#0066FF] bg-blue-50 px-1.5 py-0.5 rounded">
                  {targetProduct.brand} · {targetProduct.category}
                </span>
                <h4 className="text-xs font-bold text-gray-900 truncate mt-0.5">
                  {targetProduct.name}
                </h4>
                <div className="text-xs font-black text-gray-900 mt-0.5">
                  {targetProduct.price.toLocaleString()}원
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. Event Description & Guide */}
        <div className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100">
          <h3 className="text-xs font-black text-gray-900 mb-3 flex items-center gap-1.5">
            <span>📋 이벤트 상세 안내 & 참여 방법</span>
          </h3>
          <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-3.5 rounded-xl border border-gray-100 font-normal">
            {selectedEvent.description}
          </div>
        </div>

        {/* 7. Comments & Cheering Section */}
        <div className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black text-gray-900">
              💬 기대평 & 응원 댓글 ({comments.length})
            </h3>
            <span className="text-[10px] text-gray-400">댓글 작성 시 +10P</span>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="이벤트 기대평 또는 응원 메시지를 남겨보세요"
              className="flex-1 text-xs bg-gray-100 rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-[#0066FF] border border-transparent focus:bg-white"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-[#0066FF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Comment List */}
          <div className="space-y-2.5">
            {comments.map((c) => (
              <div key={c.id} className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-gray-800">{c.user}</span>
                  <span className="text-[10px] text-gray-400">{c.time}</span>
                </div>
                <p className="text-xs text-gray-600">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 8. Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white/95 backdrop-blur-md border-t border-gray-100 p-3 z-40 shadow-lg">
        {selectedEvent.isParticipated ? (
          <div className="w-full py-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black flex items-center justify-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>신청 완료! 당첨자 발표일을 기다려주세요 🎉</span>
          </div>
        ) : (
          <button
            onClick={handleParticipate}
            className="w-full py-3.5 rounded-2xl bg-[#0066FF] hover:bg-blue-700 active:scale-[0.98] transition-all text-white text-xs font-black flex items-center justify-center gap-2 shadow-md"
          >
            <Sparkles className="w-4 h-4 fill-white" />
            <span>{selectedEvent.actionButtonText || '무료 체험단 신청하기'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
