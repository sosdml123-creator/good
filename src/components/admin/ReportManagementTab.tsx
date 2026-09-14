import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ReportItem, ReportAction } from '../../types';
import { 
  ShieldAlert, 
  Search, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  X, 
  ChevronRight, 
  ShieldCheck,
  Clock
} from 'lucide-react';

interface ReportManagementTabProps {
  isDark: boolean;
}

export const ReportManagementTab: React.FC<ReportManagementTabProps> = ({ isDark }) => {
  const { 
    reports, 
    resolveReport, 
    dismissReport, 
    deleteReport, 
    allProfiles, 
    showToast 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Resolution Form
  const [selectedAction, setSelectedAction] = useState<ReportAction>('warning');
  const [actionReasonInput, setActionReasonInput] = useState('');
  const [adminMemoInput, setAdminMemoInput] = useState('');

  // Stats KPI
  const stats = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter(r => r.status === 'pending').length;
    const resolved = reports.filter(r => r.status === 'resolved').length;
    const dismissed = reports.filter(r => r.status === 'dismissed').length;
    return { total, pending, resolved, dismissed };
  }, [reports]);

  // Filtered Reports
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch = !q || 
        r.targetUserName.toLowerCase().includes(q) || 
        r.reporterName.toLowerCase().includes(q) || 
        r.targetContent.toLowerCase().includes(q) || 
        (r.reasonDetail && r.reasonDetail.toLowerCase().includes(q)) ||
        (r.targetProductName && r.targetProductName.toLowerCase().includes(q));

      return matchStatus && matchSearch;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [reports, statusFilter, searchQuery]);

  const handleOpenDetail = (report: ReportItem) => {
    setSelectedReport(report);
    setSelectedAction(report.actionTaken || 'warning');
    setActionReasonInput(report.actionReason || '');
    setAdminMemoInput(report.adminMemo || '');
    setIsDetailModalOpen(true);
  };

  const handleApplyResolution = async () => {
    if (!selectedReport) return;
    await resolveReport(selectedReport.id, selectedAction, actionReasonInput.trim(), adminMemoInput.trim());
    setIsDetailModalOpen(false);
  };

  const handleApplyDismiss = async () => {
    if (!selectedReport) return;
    await dismissReport(selectedReport.id, actionReasonInput.trim() || '소비자의 정당한 후기로 제재 사유에 해당하지 않음', adminMemoInput.trim());
    setIsDetailModalOpen(false);
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'spam': return { text: '스팸/홍보성 글', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
      case 'abuse': return { text: '욕설/비하/혐오', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' };
      case 'fraud': return { text: '허위정보/어뷰징', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' };
      case 'copyright': return { text: '도용/저작권 침해', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
      case 'inappropriate': return { text: '부적절한 내용', color: 'bg-red-500/10 text-red-500 border-red-500/20' };
      default: return { text: '기타 사유', color: 'bg-slate-500/10 text-slate-500 border-slate-500/20' };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse">
            <Clock className="w-3 h-3" /> 처리 대기중
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> 제재 조치완료
          </span>
        );
      case 'dismissed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-500/10 text-slate-500 border border-slate-500/20">
            <XCircle className="w-3 h-3" /> 반려 (이상없음)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className={'p-6 rounded-3xl border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 ' + (
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80'
      )}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center border border-rose-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={'text-lg font-black tracking-tight ' + (isDark ? 'text-white' : 'text-slate-900')}>
                신고 접수 및 리뷰 모더레이션 센터
              </h2>
              {stats.pending > 0 && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-bold animate-bounce">
                  {stats.pending}건 대기중
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              사용자가 접수한 불량 리뷰 및 회원 신고 내역을 심사하고, 경고·정지·리뷰 삭제 등 원클릭 제재를 집행합니다.
            </p>
          </div>
        </div>

        <button
          onClick={() => showToast('🔄 신고 목록을 새로고침했습니다.', 'info')}
          className={'px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ' + (
            isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
          )}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>새로고침</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className={'p-4 rounded-2xl border shadow-xs ' + (isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200/80')}>
          <span className="text-[11px] font-bold text-slate-400 uppercase">전체 접수 신고</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={'text-2xl font-black font-mono ' + (isDark ? 'text-white' : 'text-slate-900')}>{stats.total}</span>
            <span className="text-xs text-slate-400">건</span>
          </div>
        </div>

        <div className={'p-4 rounded-2xl border shadow-xs ' + (isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200/80')}>
          <span className="text-[11px] font-bold text-amber-500 uppercase">심사 대기중</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-amber-500">{stats.pending}</span>
            <span className="text-xs text-amber-500/70">건</span>
          </div>
        </div>

        <div className={'p-4 rounded-2xl border shadow-xs ' + (isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200/80')}>
          <span className="text-[11px] font-bold text-emerald-500 uppercase">제재 조치완료</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-emerald-500">{stats.resolved}</span>
            <span className="text-xs text-emerald-500/70">건</span>
          </div>
        </div>

        <div className={'p-4 rounded-2xl border shadow-xs ' + (isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200/80')}>
          <span className="text-[11px] font-bold text-slate-500 uppercase">기각 / 반려</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={'text-2xl font-black font-mono ' + (isDark ? 'text-slate-300' : 'text-slate-700')}>{stats.dismissed}</span>
            <span className="text-xs text-slate-400">건</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className={'p-4 rounded-2xl border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 ' + (
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80'
      )}>
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
          {[
            { id: 'all', label: '전체보기 (' + stats.total + ')' },
            { id: 'pending', label: '대기중 (' + stats.pending + ')' },
            { id: 'resolved', label: '조치완료 (' + stats.resolved + ')' },
            { id: 'dismissed', label: '반려 (' + stats.dismissed + ')' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={'px-3 py-1.5 rounded-lg text-xs font-bold transition-all ' + (
                statusFilter === tab.id
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="피신고자, 신고자, 내용 검색..."
            className={'w-full pl-9 pr-3 py-1.5 rounded-xl text-xs outline-none border ' + (
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            )}
          />
        </div>
      </div>

      {/* Reports Table */}
      <div className={'rounded-2xl border shadow-xs overflow-hidden ' + (
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80'
      )}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={'border-b text-[11px] font-black uppercase tracking-wider ' + (
                isDark ? 'border-slate-800 bg-slate-800/50 text-slate-400' : 'border-slate-200 bg-slate-50/80 text-slate-500'
              )}>
                <th className="p-3.5">신고 일시</th>
                <th className="p-3.5">피신고자 (대상)</th>
                <th className="p-3.5">신고사유</th>
                <th className="p-3.5">신고 내용 및 원문</th>
                <th className="p-3.5">신고자</th>
                <th className="p-3.5">상태</th>
                <th className="p-3.5 text-right">심사 및 제재</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => {
                  const reasonInfo = getReasonLabel(report.reason);
                  const targetUser = allProfiles.find(u => u.uid === report.targetUserId || u.displayName === report.targetUserName);

                  return (
                    <tr 
                      key={report.id}
                      className={'transition-colors ' + (isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50/60')}
                    >
                      <td className="p-3.5 text-slate-400 whitespace-nowrap">
                        <div className="font-mono text-[11px]">
                          {new Date(report.createdAt).toLocaleDateString('ko-KR')}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(report.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{report.targetUserName}</span>
                          {targetUser?.status === 'suspended' && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500 text-white font-bold">정지회원</span>
                          )}
                          {targetUser?.status === 'warned' && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500 text-white font-bold">경고회원</span>
                          )}
                        </div>
                        {report.targetProductName && (
                          <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                            📦 {report.targetProductName}
                          </div>
                        )}
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <span className={'px-2 py-0.5 rounded-full text-[10px] font-bold border ' + reasonInfo.color}>
                          {reasonInfo.text}
                        </span>
                      </td>

                      <td className="p-3.5 max-w-xs">
                        <div className="space-y-1">
                          <p className="text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px]">
                            "{report.targetContent}"
                          </p>
                          {report.reasonDetail && (
                            <p className="text-[10px] text-rose-500 font-semibold truncate">
                              💬 사유: {report.reasonDetail}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <div className="font-semibold">{report.reporterName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{report.reporterId}</div>
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        {getStatusBadge(report.status)}
                      </td>

                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDetail(report)}
                            className={'px-3 py-1.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1 ' + (
                              report.status === 'pending'
                                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
                            )}
                          >
                            <span>{report.status === 'pending' ? '심사 및 제재' : '내역 보기'}</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                          
                          <button
                            onClick={() => deleteReport(report.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                            title="신고 내역 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <ShieldCheck className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
                    <p className="font-bold text-sm">해당 조건의 신고 내역이 없습니다.</p>
                    <p className="text-xs mt-1">모든 커뮤니티 및 리뷰가 건전하게 유지되고 있습니다.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & User Moderation Modal */}
      {isDetailModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={'w-full max-w-lg rounded-3xl p-6 shadow-2xl border flex flex-col space-y-5 ' + (
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          )}>
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-base">신고 심사 및 원클릭 제재</h3>
                  <p className="text-[11px] text-slate-400">신고번호: {selectedReport.id}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Content Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center justify-between">
                <span>신고된 리뷰 원문</span>
                <span className="text-rose-500 font-semibold">{getReasonLabel(selectedReport.reason).text}</span>
              </label>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1.5 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    작성자: {selectedReport.targetUserName}
                  </span>
                  <span>{selectedReport.targetProductName || '상품 리뷰'}</span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  "{selectedReport.targetContent}"
                </p>
                {selectedReport.reasonDetail && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-rose-500 font-semibold text-[11px]">
                    🚨 신고자 접수 사유: {selectedReport.reasonDetail}
                  </div>
                )}
              </div>
            </div>

            {/* Sanction Actions Panel */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">
                피신고자 제재 및 조치 집행
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'warning', label: '경고 1회 + 리뷰 삭제', desc: '누적 경고 부여' },
                  { id: 'suspend_7d', label: '7일 정지 + 리뷰 삭제', desc: '7일간 활동 차단' },
                  { id: 'suspend_30d', label: '30일 정지 + 리뷰 삭제', desc: '30일간 활동 차단' },
                  { id: 'permanent_ban', label: '영구 정지 + 리뷰 삭제', desc: '계정 영구 추방' },
                  { id: 'delete_review', label: '리뷰만 즉시 삭제', desc: '회원 제재 없음' },
                  { id: 'none', label: '신고 반려 (이상없음)', desc: '정상 리뷰 판정' }
                ].map((item) => {
                  const isCur = selectedAction === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedAction(item.id as ReportAction)}
                      className={'p-2.5 rounded-xl border text-left transition-all ' + (
                        isCur
                          ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20 font-bold'
                          : isDark
                            ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-rose-500'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-rose-500'
                      )}
                    >
                      <div className="font-bold">{item.label}</div>
                      <div className={'text-[10px] mt-0.5 ' + (isCur ? 'text-rose-100' : 'text-slate-400')}>
                        {item.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Reason Input */}
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">
                처리 사유 및 관리자 메모
              </label>
              <input
                type="text"
                value={actionReasonInput}
                onChange={(e) => setActionReasonInput(e.target.value)}
                placeholder="예: 욕설 및 비방 리뷰 확인되어 7일 이용 정지 처리"
                className={'w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none ' + (
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                )}
              />
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className={'flex-1 py-3 rounded-2xl text-xs font-bold border transition-colors ' + (
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                )}
              >
                닫기
              </button>
              
              {selectedAction === 'none' ? (
                <button
                  type="button"
                  onClick={handleApplyDismiss}
                  className="flex-2 py-3 rounded-2xl text-xs font-bold bg-slate-700 hover:bg-slate-800 text-white transition-colors"
                >
                  신고 반려 처리
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleApplyResolution}
                  className="flex-2 py-3 rounded-2xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-lg shadow-rose-600/20"
                >
                  제재 및 조치 적용하기
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
