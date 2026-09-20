import React, { useState, useMemo } from 'react';
import { KamisPriceInfo } from '../../types';
import { BarChart2, LineChart } from 'lucide-react';

interface KamisPriceTrendChartProps {
  priceInfo: KamisPriceInfo;
  className?: string;
}

export const KamisPriceTrendChart: React.FC<KamisPriceTrendChartProps> = ({ priceInfo, className = '' }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'chart' | 'cards'>('chart');

  // trends를 시간순(과거 -> 최근)으로 정렬
  const chronologicalTrends = useMemo(() => {
    if (!priceInfo.trends || priceInfo.trends.length === 0) return [];
    
    // 만약 trends에 기간별 순서가 섞여있다면 표준 순서로 재정렬
    const orderMap: Record<string, number> = {
      '1년전': 1,
      '1개월전': 2,
      '2주일전': 3,
      '1주일전': 4,
      '1일전': 5,
      '당일': 6
    };

    return [...priceInfo.trends]
      .filter(t => t.price > 0 && t.period !== '평년')
      .sort((a, b) => (orderMap[a.period] || 99) - (orderMap[b.period] || 99));
  }, [priceInfo.trends]);

  // 가격 최댓값, 최솟값
  const prices = useMemo(() => chronologicalTrends.map(t => t.price), [chronologicalTrends]);
  const minPrice = useMemo(() => (prices.length > 0 ? Math.min(...prices) : 0), [prices]);
  const maxPrice = useMemo(() => (prices.length > 0 ? Math.max(...prices) : 0), [prices]);
  
  // 차트 마진 및 좌표 계산
  const width = 340;
  const height = 140;
  const paddingX = 28;
  const paddingTop = 28;
  const paddingBottom = 26;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingTop - paddingBottom;

  const points = useMemo(() => {
    if (chronologicalTrends.length < 2) return [];
    const priceRange = maxPrice - minPrice || 1;

    return chronologicalTrends.map((t, idx) => {
      const x = paddingX + (idx / (chronologicalTrends.length - 1)) * chartW;
      const normalizedY = (t.price - minPrice) / priceRange;
      const y = paddingTop + (1 - normalizedY) * chartH;
      return {
        x,
        y,
        data: t,
        isMin: t.price === minPrice,
        isMax: t.price === maxPrice,
        isCurrent: idx === chronologicalTrends.length - 1
      };
    });
  }, [chronologicalTrends, minPrice, maxPrice, chartW, chartH]);

  // SVG Bezier 곡선 경로 계산
  const { linePath, areaPath } = useMemo(() => {
    if (points.length < 2) return { linePath: '', areaPath: '' };

    let line = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      line += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }

    const last = points[points.length - 1];
    const first = points[0];
    const groundY = height - paddingBottom + 5;
    const area = `${line} L ${last.x} ${groundY} L ${first.x} ${groundY} Z`;

    return { linePath: line, areaPath: area };
  }, [points, height, paddingBottom]);

  // 평년가 기준선 Y 좌표
  const avgYearY = useMemo(() => {
    if (!priceInfo.averageYearPrice || minPrice === maxPrice) return null;
    const priceRange = maxPrice - minPrice || 1;
    const normalizedY = (priceInfo.averageYearPrice - minPrice) / priceRange;
    // Y축 범위 내에 있을 때만 렌더링
    if (normalizedY < -0.1 || normalizedY > 1.1) return null;
    return paddingTop + (1 - Math.max(0, Math.min(1, normalizedY))) * chartH;
  }, [priceInfo.averageYearPrice, minPrice, maxPrice, chartH, paddingTop]);

  if (chronologicalTrends.length === 0) {
    return null;
  }

  const selectedPoint = activeIdx !== null && points[activeIdx] 
    ? points[activeIdx] 
    : points[points.length - 1];

  const isOverallDrop = priceInfo.monthAgoChangeRate !== undefined 
    ? priceInfo.monthAgoChangeRate < 0 
    : priceInfo.priceChange <= 0;

  return (
    <div className={`p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-2xs ${className}`}>
      {/* 1. Header with Controls */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-800 text-xs">
            📈
          </div>
          <div>
            <h4 className="text-xs font-black text-gray-900">공시 기간별 시세 변동 추이</h4>
            <span className="text-[9px] text-gray-400">aT 한국농수산식품유통공사 실시간 공시</span>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-gray-100 p-0.5 rounded-lg text-[10px] font-bold">
          <button
            onClick={() => setViewMode('chart')}
            className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
              viewMode === 'chart' 
                ? 'bg-white text-emerald-800 shadow-2xs font-black' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <LineChart className="w-3 h-3" />
            <span>그래프</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
              viewMode === 'cards' 
                ? 'bg-white text-emerald-800 shadow-2xs font-black' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <BarChart2 className="w-3 h-3" />
            <span>수치표</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Tooltip / Focus Bar */}
      {selectedPoint && (
        <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-emerald-50/50 px-3 py-1.5 rounded-xl border border-emerald-100/70 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-600 bg-white px-1.5 py-0.2 rounded border border-gray-200">
              {selectedPoint.data.period}
            </span>
            <span className="text-xs font-black text-gray-900">
              {selectedPoint.data.price.toLocaleString()}원
            </span>
            <span className="text-[10px] text-gray-400">
              / {priceInfo.unit}
            </span>
          </div>

          <div className="text-[10px] font-semibold text-gray-500">
            {selectedPoint.isCurrent ? (
              <span className="text-emerald-700 font-bold">🌟 현재 공시가</span>
            ) : selectedPoint.isMin ? (
              <span className="text-blue-600 font-bold">🟢 기간 최저가</span>
            ) : selectedPoint.isMax ? (
              <span className="text-rose-600 font-bold">🔴 기간 최고가</span>
            ) : (
              <span>터치하여 시점별 확인</span>
            )}
          </div>
        </div>
      )}

      {/* 3. SVG Graph View */}
      {viewMode === 'chart' ? (
        <div className="relative w-full overflow-hidden select-none">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto"
            style={{ touchAction: 'pan-y' }}
          >
            <defs>
              {/* Line Area Gradient */}
              <linearGradient id="kamisAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isOverallDrop ? '#10B981' : '#F59E0B'} stopOpacity="0.28" />
                <stop offset="100%" stopColor={isOverallDrop ? '#10B981' : '#F59E0B'} stopOpacity="0.01" />
              </linearGradient>

              {/* Line Stroke Gradient */}
              <linearGradient id="kamisLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={isOverallDrop ? '#059669' : '#D97706'} />
                <stop offset="100%" stopColor={isOverallDrop ? '#10B981' : '#F59E0B'} />
              </linearGradient>
            </defs>

            {/* Background horizontal grid lines */}
            <line
              x1={paddingX}
              y1={paddingTop}
              x2={width - paddingX}
              y2={paddingTop}
              stroke="#E2E8F0"
              strokeDasharray="2 3"
              strokeWidth="0.8"
            />
            <line
              x1={paddingX}
              y1={paddingTop + chartH / 2}
              x2={width - paddingX}
              y2={paddingTop + chartH / 2}
              stroke="#F1F5F9"
              strokeWidth="0.8"
            />
            <line
              x1={paddingX}
              y1={paddingTop + chartH}
              x2={width - paddingX}
              y2={paddingTop + chartH}
              stroke="#E2E8F0"
              strokeDasharray="2 3"
              strokeWidth="0.8"
            />

            {/* 평년가 기준선 (Average Historical Price Line) */}
            {avgYearY !== null && (
              <g>
                <line
                  x1={paddingX}
                  y1={avgYearY}
                  x2={width - paddingX}
                  y2={avgYearY}
                  stroke="#94A3B8"
                  strokeDasharray="3 3"
                  strokeWidth="1.2"
                />
                <text
                  x={width - paddingX - 2}
                  y={avgYearY - 3}
                  textAnchor="end"
                  fill="#64748B"
                  fontSize="8"
                  fontWeight="bold"
                >
                  평년 {priceInfo.averageYearPrice?.toLocaleString()}원
                </text>
              </g>
            )}

            {/* Area Fill */}
            <path d={areaPath} fill="url(#kamisAreaGrad)" />

            {/* Main Smooth Curve Line */}
            <path
              d={linePath}
              fill="none"
              stroke="url(#kamisLineGrad)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points and Period Labels */}
            {points.map((pt, idx) => {
              const isSelected = activeIdx === idx;
              const isCurrent = pt.isCurrent;

              return (
                <g key={idx} className="cursor-pointer" onClick={() => setActiveIdx(idx)}>
                  {/* Invisible enlarged hit target for easy finger tapping on mobile */}
                  <circle cx={pt.x} cy={pt.y} r="16" fill="transparent" />

                  {/* Pulsing ring for current point */}
                  {isCurrent && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="7"
                      fill={isOverallDrop ? '#10B981' : '#F59E0B'}
                      opacity="0.25"
                      className="animate-ping"
                    />
                  )}

                  {/* Outer circle border */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? '5.5' : isCurrent ? '4.5' : '3.5'}
                    fill="#FFFFFF"
                    stroke={
                      isCurrent
                        ? isOverallDrop ? '#059669' : '#D97706'
                        : isSelected
                        ? '#0F172A'
                        : isOverallDrop ? '#10B981' : '#F59E0B'
                    }
                    strokeWidth={isSelected ? '2.5' : '2'}
                  />

                  {/* Inner dot */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? '2.5' : isCurrent ? '2' : '1.5'}
                    fill={isCurrent ? '#059669' : isSelected ? '#0F172A' : '#10B981'}
                  />

                  {/* Mini Price Pill on Top of Peak or Selected */}
                  {(isSelected || isCurrent || pt.isMax || pt.isMin) && (
                    <text
                      x={pt.x}
                      y={pt.y - 7}
                      textAnchor="middle"
                      fill={isCurrent ? '#047857' : pt.isMax ? '#E11D48' : pt.isMin ? '#2563EB' : '#1E293B'}
                      fontSize="8"
                      fontWeight="bold"
                    >
                      {pt.data.price >= 10000 
                        ? `${(pt.data.price / 10000).toFixed(1)}만` 
                        : pt.data.price.toLocaleString()}
                    </text>
                  )}

                  {/* X-axis Period Labels */}
                  <text
                    x={pt.x}
                    y={height - 8}
                    textAnchor="middle"
                    fill={isSelected || isCurrent ? '#0F172A' : '#64748B'}
                    fontSize="9"
                    fontWeight={isSelected || isCurrent ? 'bold' : 'normal'}
                  >
                    {pt.data.period}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Quick Guide Indicator */}
          <div className="flex items-center justify-between text-[9px] text-gray-400 mt-1 px-1">
            <span>과거 공시가</span>
            <span className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>실제 시세</span>
              </span>
              {priceInfo.averageYearPrice && (
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2.5 h-0.5 bg-slate-400"></span>
                  <span>평년 기준선</span>
                </span>
              )}
            </span>
            <span className="font-bold text-gray-700">당일 공시</span>
          </div>
        </div>
      ) : (
        /* 4. Table / Cards View */
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mt-1">
          {chronologicalTrends.map((item, idx) => {
            const isToday = idx === chronologicalTrends.length - 1;
            return (
              <div
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`p-2 rounded-xl text-center cursor-pointer transition-all border ${
                  isToday
                    ? 'bg-emerald-50 border-emerald-300 shadow-2xs'
                    : activeIdx === idx
                    ? 'bg-slate-100 border-slate-400'
                    : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                }`}
              >
                <div className={`text-[10px] ${isToday ? 'text-emerald-800 font-bold' : 'text-gray-500'}`}>
                  {item.period}
                </div>
                <div className={`text-xs font-black mt-0.5 ${isToday ? 'text-emerald-900' : 'text-gray-900'}`}>
                  {item.price.toLocaleString()}원
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Summary Key Metrics Footer */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-gray-100 text-center">
        <div className="bg-gray-50/70 p-1.5 rounded-xl border border-gray-100">
          <div className="text-[10px] text-gray-400">기간 최저가</div>
          <div className="text-[11px] font-black text-blue-600 mt-0.5">
            {minPrice.toLocaleString()}원
          </div>
        </div>

        <div className="bg-gray-50/70 p-1.5 rounded-xl border border-gray-100">
          <div className="text-[10px] text-gray-400">평년 기준가</div>
          <div className="text-[11px] font-black text-slate-700 mt-0.5">
            {priceInfo.averageYearPrice ? `${priceInfo.averageYearPrice.toLocaleString()}원` : '-'}
          </div>
        </div>

        <div className="bg-gray-50/70 p-1.5 rounded-xl border border-gray-100">
          <div className="text-[10px] text-gray-400">기간 최고가</div>
          <div className="text-[11px] font-black text-rose-600 mt-0.5">
            {maxPrice.toLocaleString()}원
          </div>
        </div>
      </div>
    </div>
  );
};
