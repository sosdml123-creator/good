import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductEditRequest, ProductEditType, ProductEditStatus } from '../../types';
import { 
  Edit3, 
  Search, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign, 
  Store, 
  Apple, 
  Tag, 
  Image as ImageIcon, 
  Ban, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Check,
  X,
  PackageCheck
} from 'lucide-react';
import { SafeImage } from '../common/SafeImage';

interface ProductEditManagementTabProps {
  isDark: boolean;
  onEditProductCatalog?: (productId: string) => void;
}

export const ProductEditManagementTab: React.FC<ProductEditManagementTabProps> = ({ 
  isDark,
  onEditProductCatalog 
}) => {
  const { 
    productEditRequests, 
    resolveProductEditRequest, 
    rejectProductEditRequest, 
    deleteProductEditRequest,
    showToast 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | ProductEditStatus>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ProductEditRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [adminMemoInput, setAdminMemoInput] = useState('');

  // Statistics
  const stats = useMemo(() => {
    const total = productEditRequests.length;
    const pending = productEditRequests.filter(r => r.status === 'pending').length;
    const approved = productEditRequests.filter(r => r.status === 'approved').length;
    const rejected = productEditRequests.filter(r => r.status === 'rejected').length;
    return { total, pending, approved, rejected };
  }, [productEditRequests]);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return productEditRequests.filter(req => {
      const matchStatus = statusFilter === 'all' || req.status === statusFilter;
      const matchType = typeFilter === 'all' || req.requestType === typeFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch = !q || 
        req.productName.toLowerCase().includes(q) || 
        req.productBrand.toLowerCase().includes(q) || 
        req.content.toLowerCase().includes(q) || 
        req.requesterName.toLowerCase().includes(q) ||
        (req.suggestedValue && req.suggestedValue.toLowerCase().includes(q));

      return matchStatus && matchType && matchSearch;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [productEditRequests, statusFilter, typeFilter, searchQuery]);

  const getTypeBadge = (type: ProductEditType) => {
    switch (type) {
      case 'price':
        return { label: '가격 오류', icon: DollarSign, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' };
      case 'store_event':
        return { label: '판매처/행사', icon: Store, color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' };
      case 'nutrition':
        return { label: '영양성분/칼로리', icon: Apple, color: 'bg-rose-500/10 text-rose-600 border-rose-500/20' };
      case 'name_brand':
        return { label: '상품명/브랜드', icon: Tag, color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' };
      case 'image':
        return { label: '대표 이미지', icon: ImageIcon, color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' };
      case 'discontinued':
        return { label: '단종 제보', icon: Ban, color: 'bg-red-500/10 text-red-600 border-red-500/20' };
      default:
        return { label: '기타 정보', icon: FileText, color: 'bg-slate-500/10 text-slate-600 border-slate-500/20' };
    }
  };

  const getStatusBadge = (status: ProductEditStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse">
            <Clock className="w-3 h-3" /> 검토 대기중
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> 반영 완료
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-500/10 text-slate-500 border border-slate-500/20">
            <XCircle className="w-3 h-3" /> 반려됨
          </span>
        );
      default:
        return null;
    }
  };

  const handleOpenDetail = (req: ProductEditRequest) => {
    setSelectedRequest(req);
    setAdminMemoInput(req.adminMemo || '');
    setIsDetailModalOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;
    await resolveProductEditRequest(selectedRequest.id, adminMemoInput.trim() || '관리자 확인 및 상품 정보 반영 완료');
    setIsDetailModalOpen(false);
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    await rejectProductEditRequest(selectedRequest.id, adminMemoInput.trim() || '검토 결과 기존 정보가 정확함 (반려)');
    setIsDetailModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Card */}
      <div className={`p-6 rounded-3xl border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center border border-indigo-500/20">
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                사용자 제품 정보 수정 요청 센터
              </h2>
              {stats.pending > 0 && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-bold animate-bounce">
                  {stats.pending}건 대기중
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              사용자가 제보한 가격, 판매처, 1+1 행사, 영양성분, 단종 등의 오류를 검토하고 상품 카탈로그에 즉시 반영합니다.
            </p>
          </div>
        </div>

        <button
          onClick={() => showToast('🔄 제품 수정 요청 목록을 새로고침했습니다.', 'info')}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
            isDark 
              ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' 
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
        >
          새로고침
        </button>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80'}`}>
          <span className="text-[11px] font-bold text-slate-400">전체 요청 건수</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.total}</span>
            <span className="text-xs text-slate-500">건</span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${
          stats.pending > 0 
            ? isDark ? 'bg-amber-950/20 border-amber-800/40' : 'bg-amber-50/70 border-amber-200/80' 
            : isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80'
        }`}>
          <span className={`text-[11px] font-bold ${stats.pending > 0 ? 'text-amber-500' : 'text-slate-400'}`}>처리 대기중</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${stats.pending > 0 ? 'text-amber-500' : isDark ? 'text-white' : 'text-slate-900'}`}>
              {stats.pending}
            </span>
            <span className="text-xs text-amber-500 font-semibold">건 검토필요</span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80'}`}>
          <span className="text-[11px] font-bold text-emerald-500">반영 완료 (승인)</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-emerald-600">{stats.approved}</span>
            <span className="text-xs text-slate-500">건</span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80'}`}>
          <span className="text-[11px] font-bold text-slate-400">반려 처리</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-slate-500">{stats.rejected}</span>
            <span className="text-xs text-slate-500">건</span>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-3 items-center justify-between ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80'
      }`}>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter Tabs */}
          {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' && `전체 (${stats.total})`}
              {st === 'pending' && `대기중 (${stats.pending})`}
              {st === 'approved' && `반영완료 (${stats.approved})`}
              {st === 'rejected' && `반려 (${stats.rejected})`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border outline-none ${
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value="all">모든 항목 유형</option>
            <option value="price">가격 오류</option>
            <option value="store_event">판매처/행사</option>
            <option value="nutrition">영양성분/칼로리</option>
            <option value="name_brand">상품명/브랜드</option>
            <option value="image">대표 이미지</option>
            <option value="discontinued">단종 제보</option>
            <option value="other">기타</option>
          </select>

          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="상품명, 브랜드, 내용 검색..."
              className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border outline-none transition-all ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'
              }`}
            />
          </div>
        </div>
      </div>

      {/* 4. Requests List / Table */}
      {filteredRequests.length === 0 ? (
        <div className={`p-12 rounded-3xl border text-center space-y-3 ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80'
        }`}>
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto opacity-70" />
          <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            표시할 제품 수정 요청 내역이 없습니다.
          </h3>
          <p className="text-xs text-slate-400">
            사용자가 제품 상세 햄버거 메뉴에서 정보 수정 요청을 보내면 여기에 즉시 표시됩니다.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => {
            const typeBadge = getTypeBadge(req.requestType);
            const TypeIcon = typeBadge.icon;
            const isPending = req.status === 'pending';

            return (
              <div
                key={req.id}
                onClick={() => handleOpenDetail(req)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isPending 
                    ? isDark ? 'bg-indigo-950/20 border-indigo-800/40 hover:border-indigo-600' : 'bg-indigo-50/30 border-indigo-200/70 hover:border-indigo-400'
                    : isDark ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Left: Product & Request Info */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <SafeImage
                    src={req.productImage || ''}
                    alt={req.productName}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-indigo-600">{req.productBrand}</span>
                      <h4 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {req.productName}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${typeBadge.color}`}>
                        <TypeIcon className="w-3 h-3" />
                        <span>{typeBadge.label}</span>
                      </span>
                      {getStatusBadge(req.status)}
                    </div>

                    <p className={`text-xs font-medium line-clamp-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      "{req.content}"
                    </p>

                    {req.suggestedValue && (
                      <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                        <span>💡 정정 희망:</span>
                        <span className="font-bold underline">{req.suggestedValue}</span>
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-0.5">
                      <span>제보자: <strong className={isDark ? 'text-slate-300' : 'text-slate-600'}>{req.requesterName}</strong></span>
                      <span>•</span>
                      <span>접수일: {new Date(req.createdAt).toLocaleString('ko-KR')}</span>
                      {req.adminMemo && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-600 font-semibold truncate max-w-[200px]">메모: {req.adminMemo}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action Quick Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center" onClick={(e) => e.stopPropagation()}>
                  {isPending ? (
                    <>
                      <button
                        onClick={() => {
                          setSelectedRequest(req);
                          setAdminMemoInput('관리자 확인 및 상품 정보 반영 완료');
                          setIsDetailModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1 active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>심사 및 처리</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleOpenDetail(req)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1 transition-all ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span>상세보기</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (confirm('이 수정 요청 내역을 삭제하시겠습니까?')) {
                        deleteProductEditRequest(req.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-500 rounded-xl transition-colors"
                    title="요청 내역 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Detail & Resolution Modal */}
      {isDetailModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className={`w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`p-4 border-b flex items-center justify-between ${
              isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-100 bg-slate-50/80'
            }`}>
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-500" />
                <h3 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  제품 수정 요청 심사 및 관리
                </h3>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto text-xs flex-1">
              {/* Product Info Card */}
              <div className={`p-3 rounded-2xl border flex items-center gap-3 ${
                isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
                <SafeImage
                  src={selectedRequest.productImage || ''}
                  alt={selectedRequest.productName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-indigo-600">{selectedRequest.productBrand}</span>
                    <span className="text-[10px] text-slate-400">ID: {selectedRequest.productId}</span>
                  </div>
                  <h4 className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {selectedRequest.productName}
                  </h4>
                </div>

                {onEditProductCatalog && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      onEditProductCatalog(selectedRequest.productId);
                    }}
                    className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-[11px] shadow-xs flex items-center gap-1 shrink-0"
                  >
                    <PackageCheck className="w-3.5 h-3.5" />
                    <span>상품 수정</span>
                  </button>
                )}
              </div>

              {/* Request Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-400">제보 유형</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${getTypeBadge(selectedRequest.requestType).color}`}>
                    {getTypeBadge(selectedRequest.requestType).label}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-400 block">제보 상세 내용</span>
                  <div className={`p-3 rounded-xl border leading-relaxed break-words break-all ${
                    isDark ? 'bg-slate-800/40 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}>
                    {selectedRequest.content}
                  </div>
                </div>

                {selectedRequest.suggestedValue && (
                  <div className="space-y-1">
                    <span className="font-bold text-indigo-500 block">💡 정정 희망 내용</span>
                    <div className={`p-2.5 rounded-xl border font-bold ${
                      isDark ? 'bg-indigo-950/30 border-indigo-800 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-950'
                    }`}>
                      {selectedRequest.suggestedValue}
                    </div>
                  </div>
                )}

                {selectedRequest.sourceUrl && (
                  <div className="space-y-1">
                    <span className="font-bold text-slate-400 block">참고 출처 URL</span>
                    <a
                      href={selectedRequest.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline flex items-center gap-1 truncate text-[11px]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{selectedRequest.sourceUrl}</span>
                    </a>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-500">
                  <div>
                    <span className="text-slate-400">제보자: </span>
                    <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{selectedRequest.requesterName}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400">접수: </span>
                    <span>{new Date(selectedRequest.createdAt).toLocaleString('ko-KR')}</span>
                  </div>
                </div>
              </div>

              {/* Admin Memo Input */}
              <div className="space-y-1 pt-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  관리자 처리 메모 / 사유
                </label>
                <textarea
                  rows={2}
                  value={adminMemoInput}
                  onChange={(e) => setAdminMemoInput(e.target.value)}
                  placeholder="처리 사유나 메모를 입력하세요. (예: 정가 2,000원으로 변경 반영 완료)"
                  className={`w-full p-2.5 rounded-xl border text-xs outline-none resize-none transition-all ${
                    isDark 
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'
                  }`}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className={`p-4 border-t flex items-center justify-between gap-2 ${
              isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-100 bg-slate-50/80'
            }`}>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className={`px-4 py-2.5 rounded-xl font-bold border transition-colors ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                닫기
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReject}
                  className="px-4 py-2.5 rounded-xl bg-slate-600 hover:bg-slate-500 text-white font-bold transition-all flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>반려 처리</span>
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-sm transition-all flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>승인 (반영 완료)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
