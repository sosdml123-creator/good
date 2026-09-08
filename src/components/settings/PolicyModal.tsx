import React, { useState } from 'react';
import { X, ExternalLink, Copy, Check, ChevronLeft } from 'lucide-react';
import { ALL_POLICIES, PolicyDocument } from '../../data/policies';
import { useApp } from '../../context/AppContext';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPolicyId?: string;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  initialPolicyId = 'privacy'
}) => {
  const { showToast } = useApp();
  const [selectedId, setSelectedId] = useState<string>(initialPolicyId);
  const [copied, setCopied] = useState<boolean>(false);

  // Synchronize initialPolicyId when modal opens
  React.useEffect(() => {
    if (initialPolicyId) {
      setSelectedId(initialPolicyId);
    }
  }, [initialPolicyId, isOpen]);

  if (!isOpen) return null;

  const currentPolicy: PolicyDocument =
    ALL_POLICIES.find(p => p.id === selectedId) || ALL_POLICIES[0];

  const handleCopyLink = () => {
    const origin = window.location.origin;
    const url = `${origin}/${currentPolicy.id === 'delete-account' ? 'delete-account.html' : currentPolicy.id + '.html'}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      showToast('정책 웹 링크가 클립보드에 복사되었습니다.', 'success');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      showToast('링크 복사에 실패했습니다.', 'error');
    });
  };

  const handleOpenExternal = () => {
    const url = `/${currentPolicy.id === 'delete-account' ? 'delete-account.html' : currentPolicy.id + '.html'}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
      <div className="bg-white w-full h-[92vh] max-w-[430px] mx-auto rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Top Header */}
        <div className="bg-white px-4 py-3.5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1 -ml-1 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="닫기"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
            </button>
            <h2 className="text-base font-black text-gray-900 truncate">
              {currentPolicy.shortTitle}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyLink}
              className="p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              title="웹 링크 복사"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleOpenExternal}
              className="p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              title="새 창으로 웹에서 열기"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Tab Bar */}
        <div className="bg-gray-50 border-b border-gray-200/80 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {ALL_POLICIES.map((doc) => {
            const active = doc.id === currentPolicy.id;
            return (
              <button
                key={doc.id}
                onClick={() => setSelectedId(doc.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                  active
                    ? 'bg-[#0066FF] text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {doc.shortTitle}
              </button>
            );
          })}
        </div>

        {/* Policy Document Meta */}
        <div className="bg-blue-50/60 px-4 py-2 border-b border-blue-100/70 flex items-center justify-between text-[11px] text-gray-600 shrink-0">
          <span className="font-semibold text-[#0066FF]">
            {currentPolicy.title}
          </span>
          <span className="text-gray-500 font-medium">
            시행일자: {currentPolicy.effectiveDate} (v{currentPolicy.version})
          </span>
        </div>

        {/* Scrollable Policy Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 text-gray-800 text-[13px] leading-relaxed space-y-4 no-scrollbar">
          <div className="whitespace-pre-wrap font-sans text-gray-700 space-y-3">
            {currentPolicy.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-sm font-extrabold text-gray-900 mt-4 mb-1 border-b border-gray-100 pb-1">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('---')) {
                return <hr key={idx} className="my-3 border-gray-200" />;
              }
              return (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Bottom Stamp */}
          <div className="pt-6 pb-4 border-t border-gray-100 text-center text-xs text-gray-400 font-medium">
            © 2025 신상픽(Sinsangpick). All rights reserved.
          </div>
        </div>

        {/* Bottom Done Button */}
        <div className="p-3 bg-white border-t border-gray-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#0066FF] text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors shadow-xs"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
