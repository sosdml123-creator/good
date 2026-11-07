import React from 'react';
import { Calendar, CheckCircle2, Clock, Gift, Share2, Sparkles, Users } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { formatProductPrice } from '../utils/formatters';
import { PcBreadcrumb, PcContainer } from './PcUi';

/** PC 이벤트 상세: 왼쪽 배너·안내, 오른쪽 신청 패널 (모바일 이벤트 화면과 별도) */
export const PcEventDetail: React.FC = () => {
  const { selectedEvent, products, events, openEventDetail, openProductDetail, participateInEvent, showToast, setActiveTab } = useApp();

  if (!selectedEvent || !selectedEvent.id) {
    return (
      <PcContainer className="py-32 text-center">
        <p className="text-[20px] font-bold text-gray-900">이벤트를 찾을 수 없습니다</p>
        <p className="mt-2 text-[14px] text-gray-500">종료되었거나 유효하지 않은 이벤트 주소입니다.</p>
        <button onClick={() => setActiveTab('community')} className="mt-6 h-11 px-6 rounded-full bg-gray-900 text-white text-[14px] font-semibold cursor-pointer">
          수다방으로 가기
        </button>
      </PcContainer>
    );
  }

  const targetProduct = selectedEvent.targetProductId ? products.find(p => p.id === selectedEvent.targetProductId) : null;
  const otherEvents = events.filter(e => e.id !== selectedEvent.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('🔗 이벤트 링크가 클립보드에 복사되었습니다!', 'success');
  };

  const handleParticipate = () => {
    if (selectedEvent.isParticipated) return showToast('이미 신청 완료된 이벤트입니다.', 'info');
    participateInEvent(selectedEvent.id);
    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#7C3AED', '#10B981', '#F59E0B', '#EC4899'] });
    } catch (e) {
      console.warn('confetti trigger error:', e);
    }
  };

  return (
    <div className="bg-white">
      <PcContainer className="py-10">
        <PcBreadcrumb items={[{ label: '수다방', onClick: () => setActiveTab('community') }, { label: '이벤트·체험단' }]} />

        <div className="mt-6 grid grid-cols-[1fr_380px] gap-12 items-start">
          <div className="min-w-0">
            <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-[16/9]">
              <img src={selectedEvent.bannerImage} alt={selectedEvent.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="text-[13px] font-bold text-white bg-gray-900/90 px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-white" />
                  {selectedEvent.badge}
                </span>
                <span className="text-[13px] font-semibold text-white bg-black/60 px-3 py-1 rounded-full">{selectedEvent.category}</span>
              </div>
            </div>

            <h2 className="mt-12 text-[20px] font-bold text-gray-900 pb-4 border-b border-gray-900">이벤트 안내 · 참여 방법</h2>
            <p className="mt-6 text-[15px] text-gray-700 leading-[1.8] whitespace-pre-line">{selectedEvent.description}</p>
          </div>

          {/* 신청 패널 */}
          <aside className="sticky top-6 rounded-2xl border border-gray-200 p-7">
            <span className="inline-flex items-center gap-1 text-[13px] font-bold text-rose-600">
              <Clock className="w-4 h-4" />
              {selectedEvent.dDay}
            </span>
            <h1 className="mt-2 text-[24px] font-bold text-gray-900 leading-snug">{selectedEvent.title}</h1>
            {selectedEvent.subtitle && <p className="mt-2 text-[14px] text-gray-500">{selectedEvent.subtitle}</p>}

            <dl className="mt-6 space-y-3 text-[14px]">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1.5 text-gray-500"><Calendar className="w-4 h-4" />진행 기간</dt>
                <dd className="font-semibold text-gray-900">{selectedEvent.startDate} ~ {selectedEvent.endDate}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1.5 text-gray-500"><Users className="w-4 h-4" />참여 인원</dt>
                <dd className="font-semibold text-gray-900">{selectedEvent.participantsCount.toLocaleString()}명</dd>
              </div>
            </dl>

            <div className="mt-5 rounded-xl bg-amber-50 p-4">
              <p className="flex items-center gap-1.5 text-[13px] font-semibold text-amber-900"><Gift className="w-4 h-4" />혜택</p>
              <p className="mt-1 text-[16px] font-bold text-amber-800">{selectedEvent.reward}</p>
            </div>

            {targetProduct && (
              <button
                onClick={() => openProductDetail(targetProduct.id)}
                className="mt-4 w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-400 text-left cursor-pointer"
              >
                <img src={targetProduct.image} alt="" className="w-14 h-14 rounded-lg object-cover bg-gray-50 shrink-0" />
                <span className="min-w-0">
                  <span className="block text-[12px] text-gray-500">{targetProduct.brand} · 이벤트 대상 상품</span>
                  <span className="block text-[14px] font-semibold text-gray-900 truncate">{targetProduct.name}</span>
                  <span className="block text-[13px] font-bold text-gray-900">{formatProductPrice(targetProduct.price)}</span>
                </span>
              </button>
            )}

            <div className="mt-6 flex gap-2">
              {selectedEvent.isParticipated ? (
                <p className="flex-1 h-13 py-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[14px] font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  신청 완료
                </p>
              ) : (
                <button onClick={handleParticipate} className="flex-1 py-3.5 rounded-xl bg-gray-900 hover:bg-black text-white text-[15px] font-bold cursor-pointer">
                  {selectedEvent.actionButtonText || '무료 체험단 신청하기'}
                </button>
              )}
              <button onClick={handleShare} className="w-[52px] rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 cursor-pointer" aria-label="공유하기">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </aside>
        </div>

        {otherEvents.length > 0 && (
          <section className="mt-20">
            <h2 className="text-[20px] font-bold text-gray-900 mb-5">다른 진행 중인 이벤트</h2>
            <div className="grid grid-cols-4 gap-5">
              {otherEvents.map(ev => (
                <button key={ev.id} onClick={() => openEventDetail(ev.id)} className="text-left rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <img src={ev.bannerImage} alt="" className="w-full aspect-[16/9] object-cover bg-gray-100" />
                  <div className="p-4">
                    <p className="text-[12px] text-rose-500 font-semibold">{ev.dDay}</p>
                    <p className="mt-1 text-[15px] font-semibold text-gray-900 line-clamp-1">{ev.title}</p>
                    <p className="mt-1 text-[13px] text-gray-500 line-clamp-1">{ev.reward}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </PcContainer>
    </div>
  );
};
