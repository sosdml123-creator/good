import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile, UserAccountStatus } from '../../types';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  Ban, 
  RotateCcw, 
  Coins, 
  X, 
  ChevronRight, 
  Clock, 
  UserX
} from 'lucide-react';
import { DEFAULT_AVATAR } from '../../utils/avatars';

interface UserManagementTabProps {
  isDark: boolean;
}

export const UserManagementTab: React.FC<UserManagementTabProps> = ({ isDark }) => {
  const { 
    allProfiles, 
    updateUserStatus, 
    batchUpdateUserStatus, 
    grantUserPoints, 
    revokeUserPoints, 
    fetchAllProfiles, 
    showToast,
    reviews
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'points_desc' | 'warning_desc'>('points_desc');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPointModalOpen, setIsPointModalOpen] = useState(false);
  const [pointMode, setPointMode] = useState<'grant' | 'revoke'>('grant');
  const [pointAmount, setPointAmount] = useState<number>(100);
  const [pointReason, setPointReason] = useState<string>('관리자 특별 지급');

  const [targetStatus, setTargetStatus] = useState<UserAccountStatus>('active');
  const [suspendDays, setSuspendDays] = useState<number>(7);
  const [statusReasonInput, setStatusReasonInput] = useState<string>('');
  const [adminMemoInput, setAdminMemoInput] = useState<string>('');

  const stats = useMemo(() => {
    const total = allProfiles.length;
    const active = allProfiles.filter(u => !u.status || u.status === 'active').length;
    const warned = allProfiles.filter(u => u.status === 'warned').length;
    const suspended = allProfiles.filter(u => u.status === 'suspended').length;
    const banned = allProfiles.filter(u => u.status === 'banned').length;
    const totalPoints = allProfiles.reduce((sum, u) => sum + (u.points || 0), 0);
    return { total, active, warned, suspended, banned, totalPoints };
  }, [allProfiles]);

  const filteredUsers = useMemo(() => {
    return allProfiles.filter(u => {
      const q = searchQuery.trim().toLowerCase();
      const matchSearch = !q || 
        u.displayName.toLowerCase().includes(q) || 
        (u.email && u.email.toLowerCase().includes(q)) || 
        u.uid.toLowerCase().includes(q);

      const userStatus = u.status || 'active';
      const matchStatus = 
        statusFilter === 'all' ? true :
        statusFilter === 'active' ? userStatus === 'active' :
        statusFilter === 'warned' ? userStatus === 'warned' :
        statusFilter === 'suspended' ? userStatus === 'suspended' :
        statusFilter === 'banned' ? userStatus === 'banned' : true;

      const matchProvider = 
        providerFilter === 'all' ? true : 
        u.provider === providerFilter;

      return matchSearch && matchStatus && matchProvider;
    }).sort((a, b) => {
      if (sortBy === 'points_desc') return (b.points || 0) - (a.points || 0);
      if (sortBy === 'warning_desc') return (b.warningCount || 0) - (a.warningCount || 0);
      if (sortBy === 'newest') {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      }
      return 0;
    });
  }, [allProfiles, searchQuery, statusFilter, providerFilter, sortBy]);

  const handleOpenDetail = (user: UserProfile) => {
    setSelectedUser(user);
    setTargetStatus(user.status || 'active');
    setStatusReasonInput(user.statusReason || '');
    setAdminMemoInput('');
    setIsDetailModalOpen(true);
  };

  const handleApplyStatusChange = async () => {
    if (!selectedUser) return;
    await updateUserStatus(selectedUser.uid, targetStatus, {
      suspendDays: targetStatus === 'suspended' ? suspendDays : undefined,
      warningDelta: targetStatus === 'warned' ? 1 : undefined,
      reason: statusReasonInput.trim() || undefined,
      adminMemo: adminMemoInput.trim() || undefined
    });
    setIsDetailModalOpen(false);
  };

  const handlePointSubmit = async () => {
    if (!selectedUser || pointAmount <= 0) return;
    if (pointMode === 'grant') {
      await grantUserPoints(selectedUser.uid, pointAmount, pointReason);
    } else {
      await revokeUserPoints(selectedUser.uid, pointAmount, pointReason);
    }
    setIsPointModalOpen(false);
  };

  const toggleSelectUser = (uid: string) => {
    setSelectedUserIds(prev => 
      prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map(u => u.uid));
    }
  };

  const handleBatchStatus = async (status: UserAccountStatus) => {
    if (selectedUserIds.length === 0) return;
    await batchUpdateUserStatus(selectedUserIds, status, {
      suspendDays: status === 'suspended' ? 7 : undefined,
      reason: '관리자 일괄 조치 (' + status + ')'
    });
    setSelectedUserIds([]);
  };

  const getStatusBadge = (status?: UserAccountStatus) => {
    switch (status) {
      case 'warned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" /> 경고
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <Ban className="w-3 h-3" /> 이용 정지
          </span>
        );
      case 'banned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-600 text-white shadow-xs">
            <UserX className="w-3 h-3" /> 영구 정지
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" /> 정상 활동
          </span>
        );
    }
  };

  const getProviderBadge = (provider?: string) => {
    switch (provider) {
      case 'apple':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black text-white">🍎 Apple</span>;
      case 'kakao':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FEE500] text-slate-900">💬 Kakao</span>;
      case 'google':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">🌐 Google</span>;
      default:
        return <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">게스트</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className={'p-6 rounded-3xl border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 ' + (
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80'
      )}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={'text-lg font-black tracking-tight ' + (isDark ? 'text-white' : 'text-slate-900')}>
                회원 계정 및 제재 관리 콘솔
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 font-bold">
                USER MODERATION
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              전체 가입 회원의 상태를 실시간으로 모니터링하고, 불량 이용자 경고/정지/복원 및 포인트를 안전하게 관리합니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              await fetchAllProfiles();
              showToast('🔄 회원 목록을 최신 상태로 새로고침했습니다.', 'info');
            }}
            className={'px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ' + (
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            )}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>새로고침</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className={'p-4 rounded-2xl border shadow-xs ' + (isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200/80')}>
          <span className="text-[11px] font-bold text-slate-400 uppercase">전체 등록 회원</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={'text-2xl font-black font-mono ' + (isDark ? 'text-white' : 'text-slate-900')}>{stats.total}</span>
            <span className="text-xs text-slate-400">명</span>
          </div>
        </div>

        <div className={'p-4 rounded-2xl border shadow-xs ' + (isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200/80')}>
          <span className="text-[11px] font-bold text-emerald-500 uppercase">정상 활동 회원</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-emerald-500">{stats.active}</span>
            <span className="text-xs text-emerald-500/70">명</span>
          </div>
        </div>

        <div className={'p-4 rounded-2xl border shadow-xs ' + (isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200/80')}>
          <span className="text-[11px] font-bold text-amber-500 uppercase">경고 부여자</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-amber-500">{stats.warned}</span>
            <span className="text-xs text-amber-500/70">명</span>
          </div>
        </div>

        <div className={'p-4 rounded-2xl border shadow-xs ' + (isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200/80')}>
          <span className="text-[11px] font-bold text-rose-500 uppercase">이용 정지 / 영구정지</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-rose-500">{stats.suspended + stats.banned}</span>
            <span className="text-xs text-rose-500/70">명</span>
          </div>
        </div>

        <div className={'p-4 rounded-2xl border shadow-xs col-span-2 lg:col-span-1 ' + (isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200/80')}>
          <span className="text-[11px] font-bold text-amber-500 uppercase">총 잔여 포인트</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={'text-xl font-black font-mono ' + (isDark ? 'text-amber-300' : 'text-amber-600')}>
              {stats.totalPoints.toLocaleString()}
            </span>
            <span className="text-xs text-amber-500 font-bold">P</span>
          </div>
        </div>
      </div>

      <div className={'p-4 rounded-2xl border shadow-xs space-y-3 ' + (
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80'
      )}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="닉네임, 이메일, UID로 회원 검색..."
              className={'w-full pl-10 pr-4 py-2 rounded-xl text-xs outline-none transition-all border ' + (
                isDark 
                  ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
              )}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={'px-3 py-2 rounded-xl text-xs font-semibold border outline-none cursor-pointer ' + (
                isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
              )}
            >
              <option value="all">상태: 전체보기</option>
              <option value="active">🟢 정상 회원</option>
              <option value="warned">🟡 경고 회원</option>
              <option value="suspended">🔴 이용 정지 회원</option>
              <option value="banned">⛔ 영구 정지 회원</option>
            </select>

            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className={'px-3 py-2 rounded-xl text-xs font-semibold border outline-none cursor-pointer ' + (
                isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
              )}
            >
              <option value="all">가입 유형: 전체</option>
              <option value="apple">Apple</option>
              <option value="kakao">Kakao</option>
              <option value="google">Google</option>
              <option value="anonymous">게스트</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={'px-3 py-2 rounded-xl text-xs font-semibold border outline-none cursor-pointer ' + (
                isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
              )}
            >
              <option value="points_desc">포인트 높은순</option>
              <option value="warning_desc">경고 횟수순</option>
              <option value="newest">최근 가입순</option>
            </select>
          </div>
        </div>

        {selectedUserIds.length > 0 && (
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between flex-wrap gap-2 animate-in fade-in duration-150">
            <span className="text-xs font-bold text-blue-600">
              선택한 {selectedUserIds.length}명의 회원에 대해:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleBatchStatus('active')}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              >
                일괄 정상 복원
              </button>
              <button
                onClick={() => handleBatchStatus('warned')}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors"
              >
                일괄 경고 +1
              </button>
              <button
                onClick={() => handleBatchStatus('suspended')}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
              >
                일괄 7일 정지
              </button>
              <button
                onClick={() => setSelectedUserIds([])}
                className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800"
              >
                선택 해제
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={'rounded-2xl border shadow-xs overflow-hidden ' + (
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80'
      )}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={'border-b text-[11px] font-black uppercase tracking-wider ' + (
                isDark ? 'border-slate-800 bg-slate-800/50 text-slate-400' : 'border-slate-200 bg-slate-50/80 text-slate-500'
              )}>
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length}
                    onChange={toggleSelectAll}
                    className="rounded cursor-pointer"
                  />
                </th>
                <th className="p-3.5">회원 정보</th>
                <th className="p-3.5">가입 유형 / 일시</th>
                <th className="p-3.5">보유 포인트 / 등급</th>
                <th className="p-3.5">계정 상태</th>
                <th className="p-3.5">누적 경고 / 제재 사유</th>
                <th className="p-3.5 text-right">제재 및 관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const isSelected = selectedUserIds.includes(user.uid);
                  const userReviewsCount = reviews.filter(r => r.userId === user.uid || r.userName === user.displayName).length;

                  return (
                    <tr 
                      key={user.uid}
                      className={'transition-colors ' + (
                        isSelected 
                          ? isDark ? 'bg-blue-500/10' : 'bg-blue-50/60' 
                          : isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50/60'
                      )}
                    >
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectUser(user.uid)}
                          className="rounded cursor-pointer"
                        />
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.photoURL || DEFAULT_AVATAR}
                            alt={user.displayName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white truncate">
                              <span>{user.displayName}</span>
                              {user.role === 'admin' && (
                                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-indigo-600 text-white">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono truncate">
                              {user.email || user.uid}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="space-y-1">
                          <div>{getProviderBadge(user.provider)}</div>
                          <div className="text-[11px] text-slate-400">
                            {user.createdAt || '2025.01.01'}
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <div className="font-bold font-mono text-amber-500 flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5" />
                            <span>{(user.points || 0).toLocaleString()}P</span>
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                            {user.level || 'Lv.1'} · 작성 리뷰 {userReviewsCount}건
                          </span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        {getStatusBadge(user.status)}
                      </td>

                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className={'font-bold ' + (
                              (user.warningCount || 0) >= 3 ? 'text-red-500' :
                              (user.warningCount || 0) > 0 ? 'text-amber-500' : 'text-slate-400'
                            )}>
                              경고 {user.warningCount || 0}회
                            </span>
                            {user.suspendedUntil && user.status === 'suspended' && (
                              <span className="text-[10px] text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-1 rounded">
                                ~{new Date(user.suspendedUntil).toLocaleDateString('ko-KR')}까지
                              </span>
                            )}
                          </div>
                          {user.statusReason && (
                            <p className="text-[11px] text-slate-500 truncate max-w-xs">
                              {user.statusReason}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setPointMode('grant');
                              setPointAmount(100);
                              setIsPointModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-amber-500/30 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                            title="포인트 지급/회수"
                          >
                            <Coins className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => handleOpenDetail(user)}
                            className="px-3 py-1.5 rounded-xl font-bold bg-slate-900 hover:bg-black text-white dark:bg-blue-600 dark:hover:bg-blue-700 text-xs transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <span>상태 관리</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                    <p className="font-bold text-sm">일치하는 회원 정보가 없습니다.</p>
                    <p className="text-xs mt-1">검색어나 필터 조건을 변경해보세요.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isDetailModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={'w-full max-w-lg rounded-3xl p-6 shadow-2xl border flex flex-col space-y-5 ' + (
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          )}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser.photoURL || DEFAULT_AVATAR}
                  alt={selectedUser.displayName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base">{selectedUser.displayName}</h3>
                    {getStatusBadge(selectedUser.status)}
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {selectedUser.email || selectedUser.uid} · {selectedUser.level} · {(selectedUser.points || 0).toLocaleString()}P
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">
                계정 상태 변경 설정
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'active', label: '정상 복원', icon: ShieldCheck },
                  { id: 'warned', label: '경고 +1회', icon: AlertTriangle },
                  { id: 'suspended', label: '이용 정지', icon: Ban },
                  { id: 'banned', label: '영구 정지', icon: UserX }
                ].map((item) => {
                  const Icon = item.icon;
                  const isCur = targetStatus === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTargetStatus(item.id as UserAccountStatus)}
                      className={'p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ' + (
                        isCur
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                          : isDark
                            ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-blue-500'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-500'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {targetStatus === 'suspended' && (
              <div className="space-y-1.5 animate-in fade-in duration-150">
                <label className="text-xs font-bold text-rose-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 정지 기간 선택
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 7, 15, 30].map(days => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setSuspendDays(days)}
                      className={'py-2 rounded-xl text-xs font-bold border transition-all ' + (
                        suspendDays === days
                          ? 'bg-rose-600 text-white border-rose-600'
                          : isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                      )}
                    >
                      {days}일 정지
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">
                  제재 / 변경 사유 (사용자 안내 메시지)
                </label>
                <input
                  type="text"
                  value={statusReasonInput}
                  onChange={(e) => setStatusReasonInput(e.target.value)}
                  placeholder="예: 허위 리뷰 작성 및 부적절한 홍보 활동 반복"
                  className={'w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none ' + (
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  )}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">
                  관리자 내부 메모 (비공개)
                </label>
                <input
                  type="text"
                  value={adminMemoInput}
                  onChange={(e) => setAdminMemoInput(e.target.value)}
                  placeholder="관리자용 참고사항 입력..."
                  className={'w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none ' + (
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  )}
                />
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className={'flex-1 py-3 rounded-2xl text-xs font-bold border transition-colors ' + (
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                )}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleApplyStatusChange}
                className="flex-2 py-3 rounded-2xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-lg shadow-blue-600/20"
              >
                상태 변경 적용하기
              </button>
            </div>
          </div>
        </div>
      )}

      {isPointModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={'w-full max-w-sm rounded-3xl p-5 shadow-2xl border flex flex-col space-y-4 ' + (
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          )}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-1.5 text-amber-500">
                <Coins className="w-4 h-4" />
                {selectedUser.displayName}님 포인트 관리
              </h3>
              <button onClick={() => setIsPointModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setPointMode('grant')}
                className={'flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ' + (
                  pointMode === 'grant' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-500'
                )}
              >
                + 지급
              </button>
              <button
                type="button"
                onClick={() => setPointMode('revoke')}
                className={'flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ' + (
                  pointMode === 'revoke' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500'
                )}
              >
                - 회수
              </button>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">금액 (P)</label>
                <input
                  type="number"
                  value={pointAmount}
                  onChange={(e) => setPointAmount(Number(e.target.value))}
                  min={1}
                  className={'w-full px-3 py-2 rounded-xl text-xs border font-mono font-bold outline-none ' + (
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  )}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">사유</label>
                <input
                  type="text"
                  value={pointReason}
                  onChange={(e) => setPointReason(e.target.value)}
                  className={'w-full px-3 py-2 rounded-xl text-xs border outline-none ' + (
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  )}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsPointModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handlePointSubmit}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20"
              >
                {pointMode === 'grant' ? '포인트 지급' : '포인트 회수'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
