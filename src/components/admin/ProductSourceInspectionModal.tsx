import React from 'react';
import {
  X,
  FolderCheck,
  ExternalLink,
  Check,
  Sparkles,
  Camera,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { ProductCategory } from '../../types';

export interface ProductSourceInfo {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subCategory?: string;
  price: number;
  image: string;
  description?: string;
  stores?: string[];
  // 어디서 가져왔는지 (출처 정보)
  sourceName: string;
  sourceType?: 'official' | 'instagram' | 'convenience' | 'news' | 'all';
  sourceBadge?: string;
  sourceUrl?: string;
  isOfficialMall?: boolean;
  instagramInfo?: {
    handle?: string;
    accountName?: string;
    quote?: string;
    buzzScore?: number;
  };
  tags?: string[];
  crawledAt?: string;
}

interface ProductSourceInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductSourceInfo | null;
  onCategoryChange?: (newCategory: ProductCategory) => void;
  onRegister?: () => void;
  onAddToPending?: () => void;
  onOpenImageSelector?: () => void;
  isRegistered?: boolean;
  isDark?: boolean;
}

const AVAILABLE_CATEGORIES: ProductCategory[] = [
  '과자',
  '음료',
  '빵·디저트',
  '간편식',
  '패스트푸드',
  '기타'
];

export const ProductSourceInspectionModal: React.FC<ProductSourceInspectionModalProps> = ({
  isOpen,
  onClose,
  product,
  onCategoryChange,
  onRegister,
  onAddToPending,
  onOpenImageSelector,
  isRegistered = false,
  isDark = false
}) => {
  if (!isOpen || !product) return null;

  const cardBg = isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900';
  const subCardBg = isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200';

  // 출처 채널 메타 판별
  const getSourceMeta = () => {
    const sType = product.sourceType;
    const sName = product.sourceName || '';

    if (sType === 'official' || product.isOfficialMall || sName.includes('공식') || sName.includes('몰') || sName.includes('스토어')) {
      return {
        icon: '🏢',
        channelTitle: '제조사 공식 홈페이지 / 직영 브랜드스토어',
        channelBadge: '공식몰 정품 카탈로그',
        channelBadgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        description: '제조사 직영 온라인몰 및 네이버 쇼핑 공식 브랜드스토어 카탈로그에서 직접 수집된 정품 패키지 및 가격 정보입니다.'
      };
    }

    if (sType === 'instagram' || sName.includes('인스타') || sName.includes('@')) {
      return {
        icon: '📸',
        channelTitle: '인스타그램 & SNS 화제 신제품 채널',
        channelBadge: 'SNS 화제 핫이슈',
        channelBadgeColor: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30',
        description: '인스타그램 인기 신상 큐레이션 채널 및 SNS 화제 피드에서 실시간 입소문으로 포착된 트렌드 신제품입니다.'
      };
    }

    if (sType === 'convenience' || ['CU', 'GS25', '세븐일레븐', '이마트24'].some(cvs => sName.includes(cvs))) {
      return {
        icon: '🏪',
        channelTitle: '편의점 4사 공식 앱 / 편의점 단독 출시',
        channelBadge: '편의점 단독·행사 상품',
        channelBadgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
        description: '포켓CU, 우리동네GS, 세븐일레븐, 이마트24 공식 신상품 입고 공지 및 행사 매대에서 수집된 정보입니다.'
      };
    }

    return {
      icon: '📰',
      channelTitle: '식품사 공식 신제품 론칭 보도자료',
      channelBadge: '공식 출시 소식',
      channelBadgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
      description: '제조사 홍보실 보도자료 및 신제품 출시 기사를 통해 공식 확인된 신상 정보입니다.'
    };
  };

  const sourceMeta = getSourceMeta();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${cardBg}`}>
        
        {/* Modal Header */}
        <div className={`p-5 border-b flex items-center justify-between shrink-0 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-slate-50/70'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black flex items-center gap-1.5">
                <span>신제품 수집 정보 및 저장 위치 안내</span>
              </h3>
              <p className="text-xs text-slate-400">
                이 신제품이 어디서 수집되었는지와 저장될 카테고리 위치를 상세히 안내합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">

          {/* Product Quick Profile Card */}
          <div className={`p-4 rounded-2xl border flex gap-4 items-center ${subCardBg}`}>
            <div className="relative w-20 h-20 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 overflow-hidden flex items-center justify-center p-1 group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
              {onOpenImageSelector && (
                <button
                  type="button"
                  onClick={onOpenImageSelector}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity"
                  title="고화질 이미지 교체"
                >
                  <ImageIcon className="w-3.5 h-3.5 mr-1 text-amber-400" />
                  교체
                </button>
              )}
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400">{product.brand}</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-[11px] font-bold text-slate-500 font-mono">{product.price > 0 ? `${product.price.toLocaleString()}원` : '가격 미정'}</span>
              </div>
              <h4 className="text-sm font-black leading-snug truncate" title={product.name}>
                {product.name}
              </h4>
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                {product.stores && product.stores.map(st => (
                  <span key={st} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200/70 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300">
                    {st}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 1. 어디서 가져왔나요? (수집 출처 섹션) */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">{sourceMeta.icon}</span>
                <h4 className="font-black text-xs text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                  어디서 가져왔나요? (수집 출처)
                </h4>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${sourceMeta.channelBadgeColor}`}>
                {sourceMeta.channelBadge}
              </span>
            </div>

            <div className={`p-3.5 rounded-xl border space-y-2 ${cardBg}`}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold">수집 출처 채널</p>
                  <p className="font-black text-xs text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
                    <span>{sourceMeta.channelTitle}</span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold text-right">세부 판매처 / 몰</p>
                  <p className="font-bold text-xs text-amber-600 dark:text-amber-400 text-right mt-0.5">
                    {product.sourceName || '공식 인증 채널'}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800">
                {sourceMeta.description}
              </p>

              {/* Instagram specific detail */}
              {product.instagramInfo && (
                <div className="p-2.5 rounded-lg bg-pink-50 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/40 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-pink-700 dark:text-pink-300">
                    <Camera className="w-3.5 h-3.5" />
                    <span>인스타그램 채널: @{product.instagramInfo.handle} ({product.instagramInfo.accountName})</span>
                  </div>
                  {product.instagramInfo.quote && (
                    <p className="italic text-slate-600 dark:text-slate-300">
                      "{product.instagramInfo.quote}"
                    </p>
                  )}
                </div>
              )}

              {/* Source URL link */}
              {product.sourceUrl && (
                <div className="pt-2 flex items-center justify-end">
                  <a
                    href={product.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-black text-indigo-600 dark:text-indigo-400 hover:underline px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800"
                  >
                    <span>공식 원본 페이지 바로가기</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* 2. 어디 카테고리에 저장되나요? (저장 위치 안내 & 즉시 변경) */}
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-950/20 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h4 className="font-black text-xs text-indigo-800 dark:text-indigo-300 uppercase tracking-wide">
                  어디 카테고리에 저장되나요? (저장 위치)
                </h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-600 text-white shadow-xs">
                현재 저장 위치: [{product.category}]
              </span>
            </div>

            <div className={`p-3.5 rounded-xl border space-y-3 ${cardBg}`}>
              {/* Destination Explanation */}
              <div className="flex items-start gap-2.5 text-[11px] text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    등록 또는 승인 시 신상픽 앱의 <strong className="text-indigo-600 dark:text-indigo-400 underline">[{product.category}]</strong> 카테고리에 저장됩니다.
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    • 앱 메인 홈 화면의 <strong>⚡오늘신상 피드</strong>에 신제품 뱃지와 함께 노출됩니다.<br />
                    • 앱 상단 카테고리 탭에서 <strong>📂 [{product.category}]</strong>를 선택했을 때 사용자에게 조회됩니다.
                  </p>
                </div>
              </div>

              {/* Change Category Selector */}
              {onCategoryChange && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      다른 카테고리로 변경하여 저장하시겠습니까?
                    </span>
                    <span className="text-[10px] text-indigo-500 font-semibold">
                      아래 칩을 누르면 즉시 변경됩니다
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_CATEGORIES.map(cat => {
                      const isCurrent = product.category === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => onCategoryChange(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isCurrent
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 ring-2 ring-indigo-500'
                              : isDark
                                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          {isCurrent && <Check className="w-3 h-3" />}
                          <span>{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className={`p-4 border-t flex items-center justify-between gap-2 shrink-0 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-slate-50'}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-bold ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
          >
            닫기
          </button>

          <div className="flex items-center gap-2">
            {onAddToPending && (
              <button
                onClick={() => {
                  onAddToPending();
                  onClose();
                }}
                disabled={isRegistered}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-all disabled:opacity-40"
              >
                승인 대기함으로 전송
              </button>
            )}

            {onRegister && (
              <button
                onClick={() => {
                  onRegister();
                  onClose();
                }}
                disabled={isRegistered}
                className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 disabled:opacity-40"
              >
                <Check className="w-3.5 h-3.5" />
                <span>[{product.category}]에 즉시 정식 등록</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
