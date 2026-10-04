import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Check, Pencil, AlertCircle, Loader2 } from 'lucide-react';

interface EditNicknameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditNicknameModal: React.FC<EditNicknameModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, isNicknameTaken, updateUserNickname } = useApp();
  const [nickname, setNickname] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNickname(currentUser.displayName || '');
      setErrorMsg('');
      setIsSubmitting(false);
    }
  }, [isOpen, currentUser.displayName]);

  if (!isOpen) return null;

  const currentName = currentUser.displayName || '';
  const trimmed = nickname.trim();
  const isUnchanged = trimmed === currentName;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isUnchanged) {
      setErrorMsg('현재 사용 중인 닉네임과 동일합니다.');
      return;
    }

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

    if (isNicknameTaken(trimmed, currentUser.uid)) {
      setErrorMsg('이미 다른 회원이 사용 중인 닉네임입니다. 다른 닉네임을 입력해 주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await updateUserNickname(trimmed);
      onClose();
    } catch (err: any) {
      console.error('Nickname update error:', err);
      setErrorMsg(err?.message || '닉네임 변경 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 border border-gray-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          title="닫기"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-2 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shadow-xs">
            <Pencil className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-gray-900 tracking-tight">
            닉네임 변경
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed max-w-[260px]">
            신상픽에서 활동할 새로운 닉네임을 입력해 주세요.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
              <span>닉네임</span>
              <span className={`text-[11px] font-normal ${
                trimmed.length > 12 ? 'text-rose-500 font-bold' : 'text-gray-400'
              }`}>
                {trimmed.length}/12자
              </span>
            </label>

            <div className="relative">
              <input
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                maxLength={12}
                autoFocus
                placeholder="새로운 닉네임 입력 (2~12자)"
                className={`w-full bg-gray-50 border rounded-2xl px-4 py-3 text-sm text-gray-900 outline-none transition-all pr-10 ${
                  errorMsg 
                    ? 'border-rose-400 focus:border-rose-500 bg-rose-50/30' 
                    : 'border-gray-200 focus:border-gray-900 focus:bg-white'
                }`}
              />
              {nickname.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setNickname('');
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full"
                  title="내용 지우기"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {errorMsg ? (
              <p className="text-[11px] font-semibold text-rose-500 pt-0.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errorMsg}</span>
              </p>
            ) : (
              <p className="text-[11px] text-gray-400 pt-0.5">
                한글, 영문, 숫자, 밑줄(_) 2~12자
              </p>
            )}
          </div>

          {/* Guide Note */}
          <div className="p-3 bg-gray-50 rounded-2xl text-[11px] text-gray-500 leading-normal border border-gray-100">
            💡 닉네임 변경 시 기존에 작성하신 리뷰와 커뮤니티 게시글의 닉네임도 함께 업데이트됩니다.
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 h-11 bg-gray-100 hover:bg-gray-200 active:scale-[0.99] text-gray-700 rounded-2xl font-bold text-sm transition-all cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting || trimmed.length < 2 || isUnchanged}
              className="flex-1 h-11 bg-gray-900 hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 active:scale-[0.99] text-white rounded-2xl flex items-center justify-center gap-1.5 font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>저장 중...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>변경 완료</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
