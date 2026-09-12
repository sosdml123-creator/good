import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Check, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

export const NicknameSetupModal: React.FC = () => {
  const { isNicknameModalOpen, completeNicknameSetup, currentUser } = useApp();
  const [nickname, setNickname] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-populate with initial suggestion if not default generated
  React.useEffect(() => {
    if (currentUser.displayName && !currentUser.displayName.startsWith('신상러버_') && !currentUser.displayName.includes('사용자')) {
      setNickname(currentUser.displayName);
    }
  }, [currentUser.displayName]);

  if (!isNicknameModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nickname.trim();
    if (trimmed.length < 2) {
      setErrorMsg('닉네임은 최소 2글자 이상 입력해 주세요.');
      return;
    }
    if (trimmed.length > 12) {
      setErrorMsg('닉네임은 최대 12글자까지 가능합니다.');
      return;
    }
    if (!/^[a-zA-Z0-9가-힣_\s]+$/.test(trimmed)) {
      setErrorMsg('한글, 영문, 숫자, 밑줄(_)만 사용 가능합니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }

      await completeNicknameSetup(trimmed);
    } catch (err) {
      console.error('Nickname submit error:', err);
      setErrorMsg('닉네임 설정 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Celebration Header Icon */}
        <div className="flex flex-col items-center text-center space-y-2 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center shadow-sm">
            <Sparkles className="w-7 h-7 fill-blue-500/20" />
          </div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            환영합니다! 🎉
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed max-w-[260px]">
            신상픽에서 리뷰를 작성하고 활동할 나만의 닉네임을 설정해 주세요.
          </p>
        </div>

        {/* Welcome Bonus Benefit Box */}
        <div className="flex items-center gap-2.5 p-3 bg-amber-50/80 border border-amber-200/60 rounded-2xl text-amber-900">
          <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Gift className="w-4 h-4" />
          </div>
          <div className="text-left text-xs leading-tight">
            <span className="font-extrabold text-amber-900">웰컴 100P 즉시 지급!</span>
            <div className="text-[11px] text-amber-700 mt-0.5">닉네임 설정 완료 시 축하 포인트가 적립됩니다</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
              <span>닉네임</span>
              <span className="text-[11px] text-gray-400 font-normal">
                {nickname.length}/12자
              </span>
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              maxLength={12}
              autoFocus
              placeholder="예: 과자러버, 신상탐험가"
              className={`w-full bg-gray-50 border rounded-2xl px-4 py-3 text-sm text-gray-900 outline-none transition-all ${
                errorMsg 
                  ? 'border-rose-400 focus:border-rose-500 bg-rose-50/30' 
                  : 'border-gray-200 focus:border-[#0066FF] focus:bg-white'
              }`}
            />
            {errorMsg && (
              <p className="text-[11px] font-semibold text-rose-500 pt-0.5">
                {errorMsg}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || nickname.trim().length < 2}
            className="w-full h-12 bg-[#0066FF] hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 active:scale-[0.99] text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <span>설정 중...</span>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>신상픽 시작하기</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
