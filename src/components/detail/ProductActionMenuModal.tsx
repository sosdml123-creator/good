import React from 'react';
import { 
  X, 
  Edit3, 
  Store, 
  Scale, 
  Bell, 
  Building2, 
  Share2, 
  Copy, 
  ShieldAlert, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Product } from '../../types';
import { SafeImage } from '../common/SafeImage';
import { getProductCode, getProductShareUrl } from '../../utils/productCode';

interface ProductActionMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onOpenEditRequest: () => void;
  onOpenNearbyStock: () => void;
  onOpenStockAlert: () => void;
  onToggleCompare: () => void;
  isCompared: boolean;
  onOpenBrandDetail: (brand: string) => void;
  onOpenReport: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ProductActionMenuModal: React.FC<ProductActionMenuModalProps> = ({
  isOpen,
  onClose,
  product,
  onOpenEditRequest,
  onOpenNearbyStock,
  onOpenStockAlert,
  onToggleCompare,
  isCompared,
  onOpenBrandDetail,
  onOpenReport,
  showToast,
}) => {
  if (!isOpen) return null;

  const productCode = getProductCode(product);

  const handleShare = async () => {
    const shareUrl = getProductShareUrl(product);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `신상픽 | ${product.name}`,
          text: `[신상픽] ${product.brand} - ${product.name} (상품코드: ${productCode})`,
          url: shareUrl,
        });
        onClose();
        return;
      } catch (e) {
        // user cancelled or fallback
      }
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
    }
    showToast(`🔗 상품 링크가 복사되었습니다!\n(${shareUrl})`, 'success');
    onClose();
  };

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(productCode);
    }
    showToast(`📋 상품코드 [${productCode}]가 복사되었습니다!`, 'success');
    onClose();
  };

  const menuItems = [
    {
      id: 'edit_request',
      icon: Edit3,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      title: '제품 정보 수정 요청',
      description: '가격, 판매처, 행사, 영양성분, 단종 등 오류 제보',
      badge: '제보하기',
      badgeColor: 'bg-indigo-600 text-white',
      highlight: true,
      onClick: () => {
        onClose();
        onOpenEditRequest();
      }
    },
    {
      id: 'nearby_stock',
      icon: Store,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      title: '실시간 편의점 재고 찾기',
      description: '내 주변 CU · GS25 · 세븐일레븐 실시간 재고 & 행사',
      badge: '재고확인',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 border',
      onClick: () => {
        onClose();
        onOpenNearbyStock();
      }
    },
    {
      id: 'compare',
      icon: Scale,
      iconBg: isCompared ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-blue-50 text-blue-600 border-blue-100',
      title: isCompared ? '1:1 비교함에서 제거' : '1:1 비교함에 담기',
      description: '다른 신제품과 영양성분 · 당도 · 가성비 맞비교',
      badge: isCompared ? '담김' : '비교',
      badgeColor: isCompared ? 'bg-indigo-600 text-white' : 'bg-blue-50 text-blue-700 border-blue-200 border',
      onClick: () => {
        onToggleCompare();
        onClose();
      }
    },
    {
      id: 'stock_alert',
      icon: Bell,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      title: '재입고 & 1+1 행사 알림 신청',
      description: '편의점 입고 및 1+1 / 2+1 할인 시작 시 즉시 알림',
      badge: '알림받기',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 border',
      onClick: () => {
        onClose();
        onOpenStockAlert();
      }
    },
    {
      id: 'brand_view',
      icon: Building2,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
      title: `${product.brand} 브랜드관 바로가기`,
      description: `${product.brand}의 모든 출시 신제품과 랭킹 모아보기`,
      badge: '브랜드관',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 border',
      onClick: () => {
        onClose();
        onOpenBrandDetail(product.brand);
      }
    },
    {
      id: 'share',
      icon: Share2,
      iconBg: 'bg-sky-50 text-sky-600 border-sky-100',
      title: '상품 링크 공유하기',
      description: '친구와 메신저에 상품 바로가기 링크 공유',
      badge: '공유',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200 border',
      onClick: handleShare
    },
    {
      id: 'copy_code',
      icon: Copy,
      iconBg: 'bg-slate-100 text-slate-700 border-slate-200',
      title: '고유 상품코드 복사',
      description: `코드: ${productCode} (고객센터 및 리뷰 문의용)`,
      badge: '코드복사',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200 border',
      onClick: handleCopyCode
    },
    {
      id: 'report',
      icon: ShieldAlert,
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
      title: '부적절한 정보 및 불량 리뷰 신고',
      description: '허위 사실 유포 및 불건전 콘텐츠 신고 모더레이션',
      badge: '신고',
      badgeColor: 'bg-rose-50 text-rose-600 border-rose-200 border',
      onClick: () => {
        onClose();
        onOpenReport();
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[88vh] overflow-hidden shadow-2xl border border-gray-100 flex flex-col animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-gray-900 tracking-tight">더보기 옵션</span>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              신상 메뉴
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Compact Preview Card */}
        <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center gap-3">
          <SafeImage
            src={product.image}
            alt={product.name}
            fallbackCategory={product.category}
            fallbackName={product.name}
            className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-indigo-600">{product.brand}</span>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                {productCode}
              </span>
            </div>
            <p className="text-xs font-bold text-gray-900 truncate mt-0.5">{product.name}</p>
            <p className="text-[11px] font-semibold text-rose-600">
              {product.price ? `${product.price.toLocaleString()}원` : '가격 정보 없음'}
              {product.volume ? ` (${product.volume})` : ''}
            </p>
          </div>
        </div>

        {/* Menu Items List */}
        <div className="p-3 overflow-y-auto space-y-1.5 divide-y divide-gray-50 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`w-full text-left p-2.5 rounded-2xl flex items-center justify-between gap-3 transition-all active:scale-98 ${
                  item.highlight
                    ? 'bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/30 hover:from-indigo-100/80 border border-indigo-200/80 shadow-2xs'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${item.iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold ${item.highlight ? 'text-indigo-950 font-black' : 'text-gray-900'}`}>
                        {item.title}
                      </span>
                      {item.highlight && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-black bg-indigo-600 text-white px-1.5 py-0.2 rounded-full">
                          <Sparkles className="w-2.5 h-2.5" /> 추천
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 truncate mt-0.5">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Close Button */}
        <div className="p-3 border-t border-gray-100 bg-slate-50/50">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
