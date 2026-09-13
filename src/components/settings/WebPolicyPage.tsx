import React, { useState } from 'react';
import { ALL_POLICIES } from '../../data/policies';
import { ArrowLeft } from 'lucide-react';

interface WebPolicyPageProps {
  initialPolicyId: string;
}

export const WebPolicyPage: React.FC<WebPolicyPageProps> = ({ initialPolicyId }) => {
  const [selectedId, setSelectedId] = useState<string>(initialPolicyId);

  const policy = ALL_POLICIES.find(p => p.id === selectedId) || ALL_POLICIES[0];

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] text-gray-900 flex flex-col font-sans">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>신상픽 앱으로 이동</span>
            </a>
            <span className="font-extrabold text-base text-gray-900 tracking-tight">
              신상픽 (Sinsangpick)
            </span>
          </div>

          <div className="text-xs text-gray-400">
            고객문의: <a href="mailto:contact@sinsangpick.com" className="text-gray-800 underline">contact@sinsangpick.com</a>
          </div>
        </div>
      </header>

      {/* Hero Subbar */}
      <div className="bg-white border-b border-gray-200 py-6 px-4">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full">
              공식 정책 문서
            </span>
            <span className="text-xs text-gray-400">
              시행일자: {policy.effectiveDate} (버전: {policy.version})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {policy.title}
          </h1>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 pt-2 overflow-x-auto no-scrollbar pb-1">
            {ALL_POLICIES.map((p) => {
              const active = p.id === policy.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                    active
                      ? 'bg-gray-900 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {p.shortTitle}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Document Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-xs border border-gray-200/80 leading-relaxed text-gray-800 text-[14px] space-y-4">
          <div className="whitespace-pre-wrap font-sans text-gray-700 space-y-4">
            {policy.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-lg font-black text-gray-900 mt-6 mb-2 border-b border-gray-100 pb-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('---')) {
                return <hr key={idx} className="my-5 border-gray-200" />;
              }
              return (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-4 text-center text-xs text-gray-500 space-y-2">
        <div>
          <strong>신상픽 (Sinsangpick)</strong> | 개인정보 보호책임관: 신상픽 정보보호팀 | 이메일: contact@sinsangpick.com
        </div>
        <div>
          © 2025 신상픽. All rights reserved. Google Play 및 App Store 심사 규정을 엄격히 준수합니다.
        </div>
      </footer>
    </div>
  );
};
