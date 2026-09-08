import React, { useState } from 'react';
import { AlertTriangle, X, Trash2, CheckSquare, Square } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose }) => {
  const { deleteAccount, currentUser, userPoints, bookmarkedIds } = useApp();
  const [agreed, setAgreed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (!agreed) return;
    setIsDeleting(true);
    try {
      await deleteAccount();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
        {/* Header Icon */}
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 stroke-[2.3]" />
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base font-black text-gray-900">
            신상픽 회원 탈퇴 (계정 삭제)
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            <strong className="text-gray-800">{currentUser.displayName}</strong>님의 계정 및 모든 데이터가 영구적으로 삭제됩니다.
          </p>
        </div>

        {/* Warning Box */}
        <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-3.5 space-y-2 text-[11px] text-rose-800">
          <div className="font-extrabold flex items-center gap-1 text-rose-900">
            <span>⚠️ 탈퇴 전 반드시 확인해 주세요</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-rose-700 font-medium">
            <li>
              현재 보유 중인 <strong className="text-rose-900">{userPoints.toLocaleString()}P</strong>의 포인트는 즉시 소멸되며 복구되지 않습니다.
            </li>
            <li>
              찜한 제품 <strong className="text-rose-900">{bookmarkedIds.length}개</strong> 및 알림 설정 내역이 모두 삭제됩니다.
            </li>
            <li>
              소셜 로그인({currentUser.provider || '간편로그인'}) 연동 정보가 완전히 분리 및 파기됩니다.
            </li>
            <li>
              작성하신 리뷰 및 댓글은 서비스 이용약관에 따라 '탈퇴한 회원'으로 익명 전환됩니다.
            </li>
          </ul>
        </div>

        {/* Checkbox Agreement */}
        <div
          onClick={() => !isDeleting && setAgreed(!agreed)}
          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 cursor-pointer select-none transition-colors"
        >
          {agreed ? (
            <CheckSquare className="w-5 h-5 text-rose-600 shrink-0" />
          ) : (
            <Square className="w-5 h-5 text-gray-400 shrink-0" />
          )}
          <span className="text-xs font-bold text-gray-700">
            유의사항을 모두 확인하였으며, 계정 영구 삭제에 동의합니다.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!agreed || isDeleting}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
              agreed && !isDeleting
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? '삭제 처리 중...' : '탈퇴하기'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
