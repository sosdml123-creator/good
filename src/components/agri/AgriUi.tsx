import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import type { PricePoint } from '../../pc/useMarketPrices';

/**
 * 장보기 시세 디자인 토큰
 * 화이트·뉴트럴 그레이 바탕, 포인트는 채도 낮은 딥 틸 한 가지. 상승은 빨강, 하락은 파랑(국내 시세 표기 관례).
 */
export const C = {
  ink: '#191C20',
  sub: '#5A626B',
  mute: '#8A929A',
  line: '#ECEEF0',
  band: '#F3F4F6',
  teal: '#1F6B62',
  tealBg: '#EDF4F2',
  up: '#D23F35',
  down: '#2D64CF',
};

/** 등락률 */
export const Change: React.FC<{ rate: number | null; label?: string; size?: 'sm' | 'md'; showZero?: boolean }> = ({ rate, label, size = 'sm', showZero = true }) => {
  if (rate === null || !Number.isFinite(rate)) return <span className="text-[12px] text-[#8A929A]">-</span>;
  const r = Math.round(rate * 10) / 10;
  const cls = size === 'md' ? 'text-[14px]' : 'text-[12.5px]';
  if (Math.abs(r) < 0.05) return showZero ? <span className={`${cls} tabular-nums text-[#8A929A]`}>0.0%</span> : null;
  const up = r > 0;
  return (
    <span className={`${cls} font-semibold tabular-nums`} style={{ color: up ? C.up : C.down }}>
      {up ? '+' : '−'}{Math.abs(r).toFixed(1)}%{label ? <span className="ml-0.5 font-normal text-[#8A929A]">{label}</span> : null}
    </span>
  );
};

/** 차액 (+120원 / −80원) */
export const Diff: React.FC<{ value: number | null }> = ({ value }) => {
  if (!value) return <span className="text-[#8A929A]">-</span>;
  return <span className="tabular-nums" style={{ color: value > 0 ? C.up : C.down }}>{value > 0 ? '+' : '−'}{Math.abs(value).toLocaleString('ko-KR')}원</span>;
};

/** 품목 사진. 사진이 없으면 품목명 첫 글자를 회색 칸에 표시합니다. */
export const Thumb: React.FC<{ src: string | null; name: string; size?: number; rounded?: number }> = ({ src, name, size = 44, rounded = 6 }) => {
  const [failed, setFailed] = useState(false);
  const style = { width: size, height: size, borderRadius: rounded };
  if (!src || failed) {
    return (
      <span style={style} className="shrink-0 bg-[#F1F2F4] flex items-center justify-center text-[#8A929A] font-semibold" aria-hidden>
        <span style={{ fontSize: Math.round(size * 0.36) }}>{name.slice(0, 1)}</span>
      </span>
    );
  }
  return <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} style={style} className="shrink-0 object-cover bg-[#F1F2F4]" />;
};

/** 섹션 사이 회색 띠 */
export const Band: React.FC = () => <div className="h-2 bg-[#F3F4F6]" />;

export const SectionHead: React.FC<{ title: string; note?: string; more?: string; onMore?: () => void }> = ({ title, note, more, onMore }) => (
  <div className="flex items-end justify-between px-4 pt-5 pb-2">
    <div className="min-w-0">
      <h2 className="text-[17px] font-bold text-[#191C20] tracking-[-0.01em]">{title}</h2>
      {note && <p className="mt-0.5 text-[12px] text-[#8A929A]">{note}</p>}
    </div>
    {onMore && (
      <button onClick={onMore} className="shrink-0 flex items-center text-[13px] text-[#5A626B] -mr-1 py-1">
        {more || '전체'}<ChevronRight className="w-4 h-4" />
      </button>
    )}
  </div>
);

export const TopBar: React.FC<{ title?: string; onBack?: () => void; right?: React.ReactNode; border?: boolean }> = ({ title, onBack, right, border = true }) => (
  <header className={`sticky top-0 z-20 bg-white ${border ? 'border-b border-[#ECEEF0]' : ''}`}>
    <div className="flex items-center h-12 px-1.5 gap-1">
      {onBack ? (
        <button onClick={onBack} aria-label="뒤로" className="w-10 h-10 flex items-center justify-center text-[#191C20]">
          <ChevronLeft className="w-6 h-6" />
        </button>
      ) : <span className="w-2.5" />}
      <h1 className="flex-1 min-w-0 truncate text-[17px] font-bold text-[#191C20]">{title}</h1>
      <div className="flex items-center">{right}</div>
    </div>
  </header>
);

/** 밑줄 탭 */
export function UnderlineTabs<T extends string>({ value, options, onChange }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div role="tablist" className="flex border-b border-[#ECEEF0] px-4 gap-5">
      {options.map(o => (
        <button
          key={o.id}
          role="tab"
          aria-selected={value === o.id}
          onClick={() => onChange(o.id)}
          className={`relative h-11 text-[15px] ${value === o.id ? 'font-bold text-[#191C20]' : 'text-[#8A929A]'}`}
        >
          {o.label}
          {value === o.id && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#191C20]" />}
        </button>
      ))}
    </div>
  );
}

/** 작은 칩 (필터) */
export const Chip: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    aria-pressed={active}
    className={`shrink-0 h-8 px-3 rounded-[6px] text-[13px] border ${active ? 'border-[#1F6B62] bg-[#EDF4F2] text-[#1F6B62] font-semibold' : 'border-[#E3E5E8] bg-white text-[#5A626B]'}`}
  >
    {children}
  </button>
);

/** 기간 선택 (7일 / 30일 / 3개월) */
export function Segmented<T extends string | number>({ value, options, onChange }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex p-0.5 rounded-[7px] bg-[#F1F2F4]" role="group">
      {options.map(o => (
        <button
          key={String(o.id)}
          onClick={() => onChange(o.id)}
          aria-pressed={value === o.id}
          className={`h-7 px-3 rounded-[6px] text-[12.5px] ${value === o.id ? 'bg-white text-[#191C20] font-semibold border border-[#E3E5E8]' : 'text-[#5A626B]'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export const Stars: React.FC<{ value: number; size?: number }> = ({ value, size = 12 }) => (
  <span className="inline-flex items-center gap-[1px]" aria-label={`별점 ${value}점`}>
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} style={{ width: size, height: size }} className={i <= Math.round(value) ? 'fill-[#191C20] text-[#191C20]' : 'fill-[#DADDE1] text-[#DADDE1]'} />
    ))}
  </span>
);

/** 가격 추이 선 그래프. 평년 가격이 있으면 점선으로 함께 그립니다. 터치하면 그 날 가격을 보여 줍니다. */
export const PriceChart: React.FC<{ points: PricePoint[]; normal?: PricePoint[] }> = ({ points, normal = [] }) => {
  const [hover, setHover] = useState<number | null>(null);
  if (points.length < 2) return null;
  const w = 358, h = 150, padX = 4, padTop = 12, padBottom = 18;
  const normalMap = new Map(normal.map(p => [p.date, p.price]));
  const normals = points.map(p => normalMap.get(p.date) ?? null);
  const all = [...points.map(p => p.price), ...normals.filter((x): x is number => x !== null)];
  const min = Math.min(...all), max = Math.max(...all);
  const span = max - min || 1;
  const x = (i: number) => padX + (i / (points.length - 1)) * (w - padX * 2);
  const y = (v: number) => padTop + (1 - (v - min) / span) * (h - padTop - padBottom);
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.price).toFixed(1)}`).join(' ');
  const nPath = normals
    .map((v, i) => (v === null ? null : `${x(i).toFixed(1)},${y(v).toFixed(1)}`))
    .reduce<string[]>((acc, pt, i) => { if (pt) acc.push(`${acc.length === 0 || normals[i - 1] === null ? 'M' : 'L'}${pt}`); return acc; }, [])
    .join(' ');
  const sel = hover ?? points.length - 1;
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rx = ((e.clientX - rect.left) / rect.width) * w;
    setHover(Math.max(0, Math.min(points.length - 1, Math.round(((rx - padX) / (w - padX * 2)) * (points.length - 1)))));
  };
  const selNormal = normals[sel];
  return (
    <div>
      <div className="flex items-baseline gap-2 h-6">
        <span className="text-[13px] text-[#5A626B] tabular-nums">{points[sel].date.slice(5).replace('-', '.')}</span>
        <span className="text-[15px] font-bold text-[#191C20] tabular-nums">{points[sel].price.toLocaleString('ko-KR')}원</span>
        {selNormal && <span className="text-[12px] text-[#8A929A] tabular-nums">평년 {selNormal.toLocaleString('ko-KR')}원</span>}
      </div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-[150px] touch-none select-none"
        onPointerMove={onMove}
        onPointerDown={onMove}
        onPointerLeave={() => setHover(null)}
        role="img"
        aria-label={`가격 추이 그래프, ${points[0].date}부터 ${points[points.length - 1].date}까지`}
      >
        {[0, 0.5, 1].map(t => (
          <line key={t} x1={0} x2={w} y1={padTop + t * (h - padTop - padBottom)} y2={padTop + t * (h - padTop - padBottom)} stroke={C.line} strokeWidth={1} />
        ))}
        {nPath && <path d={nPath} fill="none" stroke="#A9B0B7" strokeWidth={1.3} strokeDasharray="3 3" />}
        <path d={path} fill="none" stroke={C.teal} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        <line x1={x(sel)} x2={x(sel)} y1={padTop - 6} y2={h - padBottom} stroke="#C9CED3" strokeWidth={1} />
        <circle cx={x(sel)} cy={y(points[sel].price)} r={4} fill="#fff" stroke={C.teal} strokeWidth={2} />
        <text x={0} y={h - 3} fontSize={10.5} fill={C.mute}>{points[0].date.slice(5).replace('-', '.')}</text>
        <text x={w} y={h - 3} fontSize={10.5} fill={C.mute} textAnchor="end">{points[points.length - 1].date.slice(5).replace('-', '.')}</text>
      </svg>
      <div className="mt-1 flex items-center gap-3 text-[11.5px] text-[#8A929A]">
        <span className="flex items-center gap-1"><span className="w-3 h-[2px] bg-[#1F6B62]" />전국 평균</span>
        {nPath && <span className="flex items-center gap-1"><span className="w-3 border-t border-dashed border-[#A9B0B7]" />평년</span>}
      </div>
    </div>
  );
};

export const Empty: React.FC<{ title: string; desc?: string; action?: React.ReactNode }> = ({ title, desc, action }) => (
  <div className="px-6 py-14 text-center">
    <p className="text-[15px] font-semibold text-[#191C20]">{title}</p>
    {desc && <p className="mt-1.5 text-[13px] leading-relaxed text-[#8A929A]">{desc}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const SourceFooter: React.FC<{ date?: string; extra?: string }> = ({ date, extra }) => (
  <p className="px-4 py-5 text-[11.5px] leading-relaxed text-[#8A929A]">
    출처: KAMIS(한국농수산식품유통공사) 농산물유통정보 소매가격{date ? ` · ${date} 공시` : ''}.
    전국 평균 가격으로 실제 매장 판매가와 다를 수 있어요.{extra ? ` ${extra}` : ''} 품목 이미지는 AI로 만든 참고 이미지예요.
  </p>
);
