import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/siteContentService';

interface PcVisitorDay {
  date: string;
  visitors: number;
  pageviews: number;
}

interface PcVisitorsData {
  configured: boolean;
  days?: PcVisitorDay[];
  totalVisitors?: number;
  totalPageviews?: number;
}

/** 최근 14일 PC 사이트(pc.sinsangpick.kr) 방문자 수 (Vercel Web Analytics) */
export const PcVisitorsCard: React.FC = () => {
  const [data, setData] = useState<PcVisitorsData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    adminApi<PcVisitorsData>('pc_visitors').then(res => {
      if (cancelled) return;
      if (res.ok && res.data) setData(res.data);
      else setError(res.error || '방문자 수를 불러오지 못했습니다.');
    });
    return () => { cancelled = true; };
  }, []);

  const days = data?.days || [];
  const today = days[days.length - 1];
  const max = Math.max(...days.map(d => d.visitors), 1);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">최근 14일 PC 방문자</h2>
          <p className="text-xs text-slate-400 mt-0.5">pc.sinsangpick.kr 날짜별 방문자 수입니다. (Vercel 집계, 세계 표준시 날짜 기준)</p>
        </div>
        {data?.configured && (
          <div className="flex items-end gap-6">
            <div className="text-right">
              <div className="text-[11px] font-semibold text-slate-400">오늘</div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none mt-1">{(today?.visitors || 0).toLocaleString()}<span className="text-sm font-bold ml-0.5">명</span></div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-semibold text-slate-400">14일 방문자</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-1">{(data.totalVisitors || 0).toLocaleString()}<span className="text-sm font-bold ml-0.5">명</span></div>
            </div>
          </div>
        )}
      </div>

      {error ? (
        <p className="text-sm text-rose-500">{error}</p>
      ) : !data ? (
        <p className="text-sm text-slate-400">불러오는 중...</p>
      ) : !data.configured ? (
        <p className="text-sm text-slate-500">Vercel 환경변수 <code className="font-mono">VERCEL_ANALYTICS_TOKEN</code>을 등록하면 PC 방문자 수가 표시됩니다.</p>
      ) : (
        <>
          <div className="flex items-stretch gap-1.5 sm:gap-2.5 h-40 border-b border-slate-200 dark:border-slate-700">
            {days.map((d, idx) => (
              <div key={d.date} className="flex-1 min-w-0 flex flex-col justify-end items-center gap-1.5" title={`${d.date} · 방문자 ${d.visitors}명 · 페이지뷰 ${d.pageviews}`}>
                <span className={`text-xs sm:text-sm font-bold tabular-nums ${d.visitors > 0 ? 'text-slate-900 dark:text-white' : 'text-slate-300 dark:text-slate-600'}`}>
                  {d.visitors}
                </span>
                <div
                  className={`w-full max-w-10 rounded-t-md ${d.visitors === 0 ? 'bg-slate-200 dark:bg-slate-700' : idx === days.length - 1 ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-emerald-400 dark:bg-emerald-500/70'}`}
                  style={{ height: d.visitors === 0 ? '2px' : `${Math.max(6, (d.visitors / max) * 82)}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 sm:gap-2.5 text-[11px] font-mono">
            {days.map((d, idx) => (
              <span key={d.date} className={`flex-1 min-w-0 text-center ${idx === days.length - 1 ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                {idx === days.length - 1 ? '오늘' : `${Number(d.date.slice(5, 7))}/${Number(d.date.slice(8, 10))}`}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
