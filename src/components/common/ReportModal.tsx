import React, { useState } from 'react';
import { ShieldAlert, UserX, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface ReportTarget {
  type: 'post' | 'review' | 'comment';
  id: string;
  authorName: string;
  contentSnippet?: string;
}

interface ReportModalProps {
  target: ReportTarget | null;
  isOpen: boolean;
  onClose: () => void;
  onReportSuccess?: () => void;
}

const REPORT_REASONS = [
  '상업적 광고 및 스팸성 콘텐츠',
  '욕설, 비하, 차별 또는 혐오 발언',
  '음란물 또는 불건전한 내용',
  '허위 사실 유포 및 명예훼손',
  '도배 및 반복적인 무의미한 내용',
  '기타 부적절한 행위'
];

export const ReportModal: React.FC<ReportModalProps> = ({
  target,
  isOpen,
  onClose,
  onReportSuccess
}) => {
  const { showToast, submitReport, currentUser } = useApp();
  const [selectedReason, setSelectedReason] = useState<string>(REPORT_REASONS[0]);
  const [customDetail, setCustomDetail] = useState<string>('');
  const [shouldBlockAuthor, setShouldBlockAuthor] = useState<boolean>(true);

  if (!isOpen || !target) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Submit through AppContext centralized state and persistence
    try {
      const getReasonEnum = (r: string): any => {
        if (r.includes('스팸') || r.includes('광고')) return 'spam';
        if (r.includes('욕설') || r.includes('혐오') || r.includes('비하')) return 'abuse';
        if (r.includes('음란') || r.includes('유해')) return 'inappropriate';
        if (r.includes('허위') || r.includes('명예훼손')) return 'fraud';
        return 'other';
      };

      const mappedTargetType = target.type === 'post' ? 'community_post' : (target.type === 'comment' ? 'comment' : 'review');

      submitReport({
        targetType: mappedTargetType,
        targetId: target.id,
        targetContent: target.contentSnippet || '',
        targetUserId: target.id,
        targetUserName: target.authorName,
        reporterId: currentUser?.uid || 'guest_user',
        reporterName: currentUser?.displayName || '익명 사용자',
        reason: getReasonEnum(selectedReason),
        reasonDetail: customDetail.trim()
      });

      // Mark reported items to hide them immediately for the reporting user
      const hiddenIds = JSON.parse(localStorage.getItem('sinsangpick_hidden_ids') || '[]');
      if (!hiddenIds.includes(target.id)) {
        hiddenIds.push(target.id);
        localStorage.setItem('sinsangpick_hidden_ids', JSON.stringify(hiddenIds));
      }

      // 2. Block author if checked
      if (shouldBlockAuthor && target.authorName) {
        const blockedUsers = JSON.parse(localStorage.getItem('sinsangpick_blocked_users') || '[]');
        if (!blockedUsers.includes(target.authorName)) {
          blockedUsers.push(target.authorName);
          localStorage.setItem('sinsangpick_blocked_users', JSON.stringify(blockedUsers));
        }
      }
    } catch (err) {
      console.warn('Report submission error:', err);
    }

    const blockMsg = shouldBlockAuthor ? ` 및 '${target.authorName}'님 차단` : '';
    showToast(`신고 접수${blockMsg}가 완료되었습니다. 해당 콘텐츠는 즉시 숨김 처리됩니다.`, 'success');

    if (onReportSuccess) {
      onReportSuccess();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-sm text-gray-900">콘텐츠 신고 및 작성자 차단</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs">
          {/* Target Info */}
          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
            <div className="text-[11px] text-gray-500">
              작성자: <strong className="text-gray-800 font-bold">{target.authorName}</strong>
            </div>
            {target.contentSnippet && (
              <p className="text-[11px] text-gray-600 line-clamp-2 italic break-words break-all [overflow-wrap:anywhere]">
                "{target.contentSnippet}"
              </p>
            )}
          </div>

          {/* Reason Selection */}
          <div className="space-y-1.5">
            <label className="font-bold text-gray-700 block">신고 사유 선택 (필수)</label>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {REPORT_REASONS.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer transition-colors ${
                    selectedReason === r
                      ? 'border-gray-900 bg-gray-900/5 text-gray-900 font-bold'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={r}
                    checked={selectedReason === r}
                    onChange={() => setSelectedReason(r)}
                    className="accent-gray-900"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Detail Input */}
          <div>
            <label className="font-bold text-gray-700 block mb-1">상세 내용 (선택)</label>
            <textarea
              rows={2}
              value={customDetail}
              onChange={(e) => setCustomDetail(e.target.value)}
              placeholder="자세한 사유를 적어주시면 검토에 큰 도움이 됩니다."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 outline-none resize-none focus:border-gray-900"
            />
          </div>

          {/* Block author toggle */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-rose-50 border border-rose-100 cursor-pointer">
              <input
                type="checkbox"
                checked={shouldBlockAuthor}
                onChange={(e) => setShouldBlockAuthor(e.target.checked)}
                className="mt-0.5 accent-rose-600"
              />
              <div className="min-w-0">
                <div className="font-bold text-rose-800 flex items-center gap-1">
                  <UserX className="w-3.5 h-3.5 shrink-0" />
                  <span>이 작성자의 글과 댓글 모두 차단하기</span>
                </div>
                <div className="text-[10px] text-rose-600 mt-0.5 leading-snug">
                  차단 시 '{target.authorName}'님이 작성한 모든 리뷰와 커뮤니티 글이 보이지 않게 됩니다.
                </div>
              </div>
            </label>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 shadow-sm transition-all"
            >
              신고 및 차단 제출
            </button>
          </div>

          <p className="text-[10px] text-gray-400 text-center leading-relaxed">
            ※ 신상픽은 24시간 콘텐츠 모니터링 정책을 운영하며, 접수된 신고 건은 관리자 확인 후 최대 24시간 이내에 영구 조치됩니다.
          </p>
        </form>
      </div>
    </div>
  );
};
