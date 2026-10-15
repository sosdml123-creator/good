import React from 'react';
import { ChevronRight } from 'lucide-react';

/** PC 페이지 공통 폭 (1200px) */
export const PcContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`w-full max-w-[1200px] mx-auto px-6 ${className}`}>{children}</div>
);

export const PcSectionHeader: React.FC<{
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ title, subtitle, actionLabel, onAction }) => (
  <div className="flex items-end justify-between mb-6">
    <div>
      <h2 className="text-[24px] font-bold text-gray-900 tracking-tight">{title}</h2>
      {subtitle && <p className="mt-1.5 text-[14px] text-gray-500">{subtitle}</p>}
    </div>
    {actionLabel && (
      <button onClick={onAction} className="text-[14px] text-gray-500 hover:text-gray-900 flex items-center cursor-pointer">
        {actionLabel}
        <ChevronRight className="w-4 h-4" />
      </button>
    )}
  </div>
);

/** 밑줄형 탭 (이커머스 정렬·필터 탭) */
export const PcTextTabs: React.FC<{ items: string[]; value: string; onChange: (v: string) => void }> = ({ items, value, onChange }) => (
  <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
    {items.map(item => (
      <button
        key={item}
        onClick={() => onChange(item)}
        className={`px-4 h-9 rounded-full text-[14px] cursor-pointer transition-colors ${
          value === item ? 'bg-gray-900 text-white font-semibold' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        {item}
      </button>
    ))}
  </div>
);

export const PcBreadcrumb: React.FC<{ items: { label: string; onClick?: () => void }[] }> = ({ items }) => (
  <nav className="flex items-center gap-1 text-[13px] text-gray-400">
    {items.map((item, i) => (
      <React.Fragment key={`${item.label}-${i}`}>
        {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
        {item.onClick ? (
          <button onClick={item.onClick} className="hover:text-gray-700 cursor-pointer">{item.label}</button>
        ) : (
          <span className="text-gray-600">{item.label}</span>
        )}
      </React.Fragment>
    ))}
  </nav>
);

export const PcEmpty: React.FC<{ message: string }> = ({ message }) => (
  <p className="py-28 text-center text-[15px] text-gray-400">{message}</p>
);
