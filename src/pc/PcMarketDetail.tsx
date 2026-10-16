import React, { useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { MarketPriceRow, PricePoint, fetchPeriodPrices, formatWon } from './useMarketPrices';
import { ChangeBadge } from './PcMarket';

const RANGES = [
  { label: '1개월', days: 31 },
  { label: '3개월', days: 92 },
  { label: '1년', days: 365 },
];

const rate = (now: number | null, base: number | null) => (now && base ? ((now - base) / base) * 100 : null);

const shortDate = (d: string) => {
  const m = d.match(/^\d{4}-(\d{2})-(\d{2})$/);
  return m ? `${Number(m[1])}/${Number(m[2])}` : d;
};

/** 기간별 가격 꺾은선 그래프 (SVG, 마우스를 올리면 그날 가격 표시) */
const PriceChart: React.FC<{ points: PricePoint[]; normal: number | null }> = ({ points, normal }) => {
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const W = 720;
  const H = 260;
  const PAD = { l: 64, r: 16, t: 16, b: 32 };

  const { min, max } = useMemo(() => {
    const values = points.map(p => p.price).concat(normal ? [normal] : []);
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    const margin = (hi - lo) * 0.12 || hi * 0.05 || 1;
    return { min: Math.max(0, lo - margin), max: hi + margin };
  }, [points, normal]);

  const x = (i: number) => PAD.l + (points.length <= 1 ? 0 : (i / (points.length - 1)) * (W - PAD.l - PAD.r));
  const y = (v: number) => PAD.t + (1 - (v - min) / (max - min || 1)) * (H - PAD.t - PAD.b);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.price).toFixed(1)}`).join(' ');
  const area = `${path} L${x(points.length - 1).toFixed(1)},${H - PAD.b} L${x(0).toFixed(1)},${H - PAD.b} Z`;
  const ticks = [0, 0.5, 1].map(t => min + (max - min) * t);
  const labelIdx = points.length > 1 ? [0, Math.floor((points.length - 1) / 2), points.length - 1] : [0];

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || points.length === 0) return;
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - PAD.l) / (W - PAD.l - PAD.r)) * (points.length - 1));
    setHover(Math.max(0, Math.min(points.length - 1, i)));
  };

  const hp = hover !== null ? points[hover] : null;

  return (
    <div className="relative">
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        {ticks.map(t => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="#EEF0F3" />
            <text x={PAD.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#9CA3AF">{Math.round(t).toLocaleString('ko-KR')}</text>
          </g>
        ))}
        {normal && (
          <g>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(normal)} y2={y(normal)} stroke="#9CA3AF" strokeDasharray="4 4" />
            <text x={W - PAD.r} y={y(normal) - 6} textAnchor="end" fontSize="11" fill="#6B7280">평년 {normal.toLocaleString('ko-KR')}원</text>
          </g>
        )}
        <path d={area} fill="#7C3AED" opacity="0.07" />
        <path d={path} fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinejoin="round" />
        {labelIdx.map(i => (
          <text key={i} x={x(i)} y={H - 10} textAnchor={i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'} fontSize="11" fill="#9CA3AF">
            {shortDate(points[i].date)}
          </text>
        ))}
        {hp && hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={H - PAD.b} stroke="#D1D5DB" />
            <circle cx={x(hover)} cy={y(hp.price)} r="4" fill="#7C3AED" stroke="#fff" strokeWidth="2" />
          </g>
        )}
      </svg>
      {hp && hover !== null && (
        <div
          className="absolute top-2 px-3 py-2 rounded-lg bg-gray-900 text-white text-[12px] pointer-events-none whitespace-nowrap"
          style={{ left: `${(x(hover) / W) * 100}%`, transform: hover > points.length / 2 ? 'translateX(-105%)' : 'translateX(5%)' }}
        >
          <p className="text-gray-300">{hp.date.replace(/-/g, '.')}</p>
          <p className="font-bold">{hp.price.toLocaleString('ko-KR')}원</p>
        </div>
      )}
    </div>
  );
};

/** 품목 상세: 오늘 가격·기간별 등락·가격 그래프 */
export const PcMarketItemModal: React.FC<{ row: MarketPriceRow; date: string; onClose: () => void }> = ({ row, date, onClose }) => {
  const [days, setDays] = useState(92);
  const [points, setPoints] = useState<PricePoint[] | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    setPoints(null);
    (async () => {
      // KAMIS 응답이 느릴 때가 있어 비어 있으면 한 번 더 요청합니다.
      let p = await fetchPeriodPrices(row, days);
      if (alive && p.length === 0) p = await fetchPeriodPrices(row, days);
      if (alive) setPoints(p);
    })();
    return () => { alive = false; };
  }, [row, days, attempt]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const stats = useMemo(() => {
    if (!points || points.length === 0) return null;
    const prices = points.map(p => p.price);
    const hi = points.reduce((a, b) => (b.price > a.price ? b : a));
    const lo = points.reduce((a, b) => (b.price < a.price ? b : a));
    return { hi, lo, avg: Math.round(prices.reduce((s, v) => s + v, 0) / prices.length) };
  }, [points]);

  const compare = [
    { label: '1일 전', base: row.dayAgo },
    { label: '1주 전', base: row.weekAgo },
    { label: '1개월 전', base: row.monthAgo },
    { label: '1년 전', base: row.yearAgo },
    { label: '평년', base: row.normal },
  ];

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-6" onClick={onClose}>
      <div className="w-full max-w-[860px] max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="px-8 pt-7 pb-5 flex items-start justify-between border-b border-gray-100">
          <div>
            <p className="text-[13px] text-gray-500">{row.category} · {row.kindName} · {row.rank} · {row.unit}</p>
            <h2 className="mt-1 text-[26px] font-bold text-gray-900">{row.itemName}</h2>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-[28px] font-bold text-gray-900">{formatWon(row.today)}</span>
              <ChangeBadge rate={row.changeRate} />
              <span className="text-[12px] text-gray-400">{row.changeLabel}</span>
            </div>
          </div>
          <button onClick={onClose} aria-label="닫기" className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="px-8 py-6">
          <div className="grid grid-cols-5 border border-gray-200 rounded-xl overflow-hidden">
            {compare.map((c, i) => (
              <div key={c.label} className={`px-4 py-3.5 ${i < 4 ? 'border-r border-gray-200' : ''}`}>
                <p className="text-[12px] text-gray-500">{c.label}</p>
                <p className="mt-1 text-[15px] font-semibold text-gray-900 tabular-nums">{formatWon(c.base)}</p>
                <div className="mt-0.5"><ChangeBadge rate={rate(row.today, c.base)} size="sm" /></div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <p className="text-[16px] font-bold text-gray-900">가격 추이</p>
            <div className="flex gap-1">
              {RANGES.map(r => (
                <button
                  key={r.label}
                  onClick={() => setDays(r.days)}
                  className={`px-3.5 h-8 rounded-full text-[13px] cursor-pointer ${days === r.days ? 'bg-gray-900 text-white font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 min-h-[260px]">
            {points === null && <p className="py-24 text-center text-[13px] text-gray-400">가격 추이를 불러오는 중이에요…</p>}
            {points !== null && points.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-[13px] text-gray-400">가격 추이를 불러오지 못했어요.</p>
                <button onClick={() => setAttempt(a => a + 1)} className="mt-3 px-4 h-9 rounded-full border border-gray-300 text-[13px] text-gray-700 hover:border-gray-900 cursor-pointer">다시 불러오기</button>
              </div>
            )}
            {points !== null && points.length === 1 && (
              <p className="py-24 text-center text-[13px] text-gray-400">이 기간에는 공시된 가격이 하루뿐이라 그래프를 그릴 수 없어요.</p>
            )}
            {points !== null && points.length >= 2 && <PriceChart points={points} normal={row.normal} />}
          </div>

          {stats && (
            <div className="mt-4 grid grid-cols-3 gap-3 text-[13px]">
              <div className="rounded-lg bg-[#F7F7F8] px-4 py-3">
                <p className="text-gray-500">기간 최고</p>
                <p className="mt-0.5 font-semibold text-gray-900">{formatWon(stats.hi.price)} <span className="font-normal text-gray-400">({shortDate(stats.hi.date)})</span></p>
              </div>
              <div className="rounded-lg bg-[#F7F7F8] px-4 py-3">
                <p className="text-gray-500">기간 최저</p>
                <p className="mt-0.5 font-semibold text-gray-900">{formatWon(stats.lo.price)} <span className="font-normal text-gray-400">({shortDate(stats.lo.date)})</span></p>
              </div>
              <div className="rounded-lg bg-[#F7F7F8] px-4 py-3">
                <p className="text-gray-500">기간 평균</p>
                <p className="mt-0.5 font-semibold text-gray-900">{formatWon(stats.avg)}</p>
              </div>
            </div>
          )}

          <p className="mt-6 text-[12px] text-gray-400">
            {date ? `${date.replace(/-/g, '.')} 공시 기준. ` : ''}전국 주요 소매점 조사 평균가(KAMIS, aT 한국농수산식품유통공사)이며, 공시가 없는 날(주말·공휴일)은 그래프에서 빠져요.
          </p>
        </div>
      </div>
    </div>
  );
};
