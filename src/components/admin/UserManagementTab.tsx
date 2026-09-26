import React, { useState, useMemo } from 'react';
import { useApp, inferUserProvider } from '../../context/AppContext';
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
  UserX,
  History,
  Download,
  PlusCircle,
  MinusCircle,
  Activity,
  Sparkles,
  ShieldAlert,
  BarChart2,
  Calendar,
  Filter,
  Trash2
} from 'lucide-react';
import { DEFAULT_AVATAR } from '../../utils/avatars';

interface UserManagementTabProps {
  isDark: boolean;
}

// Date helpers
const isSameDay = (d1: Date, d2: Date) => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

const isToday = (dateStr?: string) => {
  if (!dateStr) return false;
  return isSameDay(new Date(dateStr), new Date());
};

const isYesterday = (dateStr?: string) => {
  if (!dateStr) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(new Date(dateStr), yesterday);
};

const formatFullDateTime = (dateStr?: string) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}.${month}.${day} ${hours}:${minutes}`;
};

const getRelativeTime = (dateStr?: string) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const diffMs = Date.now() - d.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
  return `${Math.floor(diffDays / 30)}달 전`;
};

export const UserManagementTab: React.FC<UserManagementTabProps> = ({ isDark }) => {
  const { 
    allProfiles, 
    updateUserStatus, 
    batchUpdateUserStatus, 
    grantUserPoints, 
    revokeUserPoints, 
    batchGrantPoints,
    batchRevokePoints,
    pointTransactions,
    fetchAllProfiles, 
    deleteUserByAdmin,
    batchDeleteUsersByAdmin,
    showToast,
    reviews
  } = useApp();

  // Sub Tab: 'users' (회원 관리) | 'transactions' (포인트 내역 로그)
  const [subTab, setSubTab] = useState<'users' | 'transactions'>('users');

  // --- Users SubTab States ---
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [activityFilter, setActivityFilter] = useState<'all' | 'active_today' | 'active_7d' | 'inactive_30d'>('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'active_desc' | 'points_desc' | 'warning_desc'>('newest');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isTrendExpanded, setIsTrendExpanded] = useState<boolean>(true);

  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Point Modal States
  const [isPointModalOpen, setIsPointModalOpen] = useState(false);
  const [isBatchPointMode, setIsBatchPointMode] = useState(false);
  const [pointMode, setPointMode] = useState<'grant' | 'revoke'>('grant');
  const [pointAmount, setPointAmount] = useState<number>(100);
  const [pointReason, setPointReason] = useState<string>('관리자 특별 지급');
  const [pointAdminMemo, setPointAdminMemo] = useState<string>('');

  // Status Change States
  const [targetStatus, setTargetStatus] = useState<UserAccountStatus>('active');
  const [suspendDays, setSuspendDays] = useState<number>(7);
  const [statusReasonInput, setStatusReasonInput] = useState<string>('');
  const [adminMemoInput, setAdminMemoInput] = useState<string>('');

  // Delete User Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [isBatchDeleteMode, setIsBatchDeleteMode] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  // --- Transactions SubTab States ---
  const [txSearchQuery, setTxSearchQuery] = useState('');
  const [txTypeFilter, setTxTypeFilter] = useState<'all' | 'grant' | 'revoke'>('all');

  // Theme Helpers
  const cardBg = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-xs';
  const subCardBg = isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50/80 border-slate-200/70';
  const inputBg = isDark ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white';
  const tableHeaderBg = isDark ? 'bg-slate-950/80 text-slate-400 border-slate-800' : 'bg-slate-100/70 text-slate-600 border-slate-200';
  const tableRowHover = isDark ? 'hover:bg-slate-800/40 divide-slate-800/60' : 'hover:bg-slate-50/80 divide-slate-100';

  // Check if user was active today
  const checkIsUserActiveToday = (user: UserProfile) => {
    if (user.lastActiveAt && isToday(user.lastActiveAt)) return true;
    if (user.createdAt && isToday(user.createdAt)) return true;
    // Check if posted review today
    const userReviews = reviews.filter(r => r.userId === user.uid || r.userName === user.displayName);
    if (userReviews.some(r => isToday(r.createdAt))) return true;
    return false;
  };

  // Overall Statistics
  const stats = useMemo(() => {
    const total = allProfiles.length;
    const active = allProfiles.filter(u => !u.status || u.status === 'active').length;
    const warned = allProfiles.filter(u => u.status === 'warned').length;
    const suspended = allProfiles.filter(u => u.status === 'suspended').length;
    const banned = allProfiles.filter(u => u.status === 'banned').length;
    const totalPoints = allProfiles.reduce((sum, u) => sum + (u.points || 0), 0);
    const avgPoints = total > 0 ? Math.round(totalPoints / total) : 0;

    // Today signups
    const signedUpToday = allProfiles.filter(u => isToday(u.createdAt)).length;

    // Active Today (DAU)
    const activeToday = allProfiles.filter(checkIsUserActiveToday).length;

    return { 
      total, 
      active, 
      warned, 
      suspended, 
      banned, 
      totalPoints, 
      avgPoints,
      signedUpToday,
      activeToday
    };
  }, [allProfiles, reviews]);

  // Provider Distribution (using smart inferUserProvider)
  const providerStats = useMemo(() => {
    const counts = { apple: 0, kakao: 0, google: 0, email: 0, anonymous: 0 };
    allProfiles.forEach(u => {
      const prov = inferUserProvider(u);
      if (prov === 'apple') counts.apple++;
      else if (prov === 'kakao') counts.kakao++;
      else if (prov === 'google') counts.google++;
      else if (prov === 'email') counts.email++;
      else counts.anonymous++;
    });
    return counts;
  }, [allProfiles]);

  // Daily Signups for the past 14 days
  const dailySignups = useMemo(() => {
    const days: { date: string; dayOfWeek: string; count: number }[] = [];
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const now = new Date();

    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const pad = (n: number) => String(n).padStart(2, '0');
      const dateKey = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      const dayOfWeek = dayNames[d.getDay()];

      const count = allProfiles.filter(u => {
        if (!u.createdAt) return false;
        return isSameDay(new Date(u.createdAt), d);
      }).length;

      days.push({ date: dateKey, dayOfWeek, count });
    }
    return days;
  }, [allProfiles]);

  const maxDailyCount = useMemo(() => {
    return Math.max(...dailySignups.map(d => d.count), 1);
  }, [dailySignups]);

  // Point Transactions Statistics
  const txStats = useMemo(() => {
    const totalLogs = pointTransactions.length;
    const totalGranted = pointTransactions
      .filter(tx => tx.type === 'grant' || tx.amount > 0)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    const totalRevoked = pointTransactions
      .filter(tx => tx.type === 'revoke' || tx.amount < 0)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    return { totalLogs, totalGranted, totalRevoked };
  }, [pointTransactions]);

  // Filtered Users
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

      // Provider filter (smart infer)
      const prov = inferUserProvider(u);
      const matchProvider = 
        providerFilter === 'all' ? true :
        providerFilter === 'apple' ? prov === 'apple' :
        providerFilter === 'kakao' ? prov === 'kakao' :
        providerFilter === 'google' ? prov === 'google' :
        providerFilter === 'email' ? prov === 'email' :
        providerFilter === 'anonymous' ? prov === 'anonymous' : true;

      // Specific Date Filter (Clicked on chart bar)
      const matchDate = !selectedDateFilter || (u.createdAt && u.createdAt.slice(0, 10) === selectedDateFilter);

      // Activity (DAU) filter
      let matchActivity = true;
      if (activityFilter === 'active_today') {
        matchActivity = checkIsUserActiveToday(u);
      } else if (activityFilter === 'active_7d') {
        const lastTime = u.lastActiveAt ? new Date(u.lastActiveAt).getTime() : (u.createdAt ? new Date(u.createdAt).getTime() : 0);
        matchActivity = (Date.now() - lastTime) <= 7 * 24 * 60 * 60 * 1000;
      } else if (activityFilter === 'inactive_30d') {
        const lastTime = u.lastActiveAt ? new Date(u.lastActiveAt).getTime() : (u.createdAt ? new Date(u.createdAt).getTime() : 0);
        matchActivity = (Date.now() - lastTime) > 30 * 24 * 60 * 60 * 1000;
      }

      return matchSearch && matchStatus && matchProvider && matchDate && matchActivity;
    }).sort((a, b) => {
      if (sortBy === 'points_desc') return (b.points || 0) - (a.points || 0);
      if (sortBy === 'warning_desc') return (b.warningCount || 0) - (a.warningCount || 0);
      if (sortBy === 'active_desc') {
        const timeA = a.lastActiveAt ? new Date(a.lastActiveAt).getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const timeB = b.lastActiveAt ? new Date(b.lastActiveAt).getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        return timeB - timeA;
      }
      if (sortBy === 'newest') {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      }
      return 0;
    });
  }, [allProfiles, searchQuery, statusFilter, providerFilter, selectedDateFilter, activityFilter, sortBy, reviews]);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return pointTransactions.filter(tx => {
      if (txTypeFilter !== 'all' && tx.type !== txTypeFilter) return false;
      if (txSearchQuery.trim()) {
        const q = txSearchQuery.toLowerCase();
        return (
          (tx.userName || '').toLowerCase().includes(q) ||
          (tx.reason || '').toLowerCase().includes(q) ||
          (tx.adminMemo || '').toLowerCase().includes(q) ||
          (tx.userId || '').toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [pointTransactions, txTypeFilter, txSearchQuery]);

  // Handlers
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

  const handleOpenSinglePointModal = (user: UserProfile, mode: 'grant' | 'revoke') => {
    setSelectedUser(user);
    setIsBatchPointMode(false);
    setPointMode(mode);
    setPointAmount(mode === 'grant' ? 500 : 100);
    setPointReason(mode === 'grant' ? '우수 리뷰어 베스트 픽 보상' : '어뷰징/부적절 리뷰 작성으로 인한 포인트 회수');
    setPointAdminMemo('');
    setIsPointModalOpen(true);
  };

  const handleOpenBatchPointModal = (mode: 'grant' | 'revoke') => {
    if (selectedUserIds.length === 0) {
      showToast('포인트를 처리할 회원을 1명 이상 선택해주세요.', 'error');
      return;
    }
    setSelectedUser(null);
    setIsBatchPointMode(true);
    setPointMode(mode);
    setPointAmount(mode === 'grant' ? 500 : 100);
    setPointReason(mode === 'grant' ? '이벤트 당첨 특별 포인트 보상' : '어뷰징 활동 정리로 인한 일괄 회수');
    setPointAdminMemo('');
    setIsPointModalOpen(true);
  };

  const handlePointSubmit = async () => {
    if (pointAmount <= 0) {
      showToast('1P 이상의 금액을 입력해주세요.', 'error');
      return;
    }

    if (isBatchPointMode) {
      if (pointMode === 'grant') {
        await batchGrantPoints(selectedUserIds, pointAmount, pointReason, pointAdminMemo.trim() || undefined);
      } else {
        await batchRevokePoints(selectedUserIds, pointAmount, pointReason, pointAdminMemo.trim() || undefined);
      }
      setSelectedUserIds([]);
    } else if (selectedUser) {
      if (pointMode === 'grant') {
        await grantUserPoints(selectedUser.uid, pointAmount, pointReason, pointAdminMemo.trim() || undefined);
      } else {
        await revokeUserPoints(selectedUser.uid, pointAmount, pointReason, pointAdminMemo.trim() || undefined);
      }
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
      reason: `관리자 일괄 조치 (${status})`
    });
    setSelectedUserIds([]);
  };

  const handleExportTransactionsJson = () => {
    const blob = new Blob([JSON.stringify(pointTransactions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sinsangpick_point_transactions_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📜 포인트 거래 내역이 JSON 파일로 다운로드되었습니다.', 'success');
  };

  const getStatusBadge = (status?: UserAccountStatus) => {
    switch (status) {
      case 'warned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" /> 경고
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
            <Ban className="w-3 h-3" /> 이용 정지
          </span>
        );
      case 'banned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-600 text-white shadow-xs">
            <UserX className="w-3 h-3" /> 영구 정지
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" /> 정상 활동
          </span>
        );
    }
  };

  const getProviderBadge = (userOrProvider?: any, email?: string) => {
    let prov: string = 'anonymous';
    if (typeof userOrProvider === 'object' && userOrProvider !== null) {
      prov = inferUserProvider(userOrProvider);
    } else {
      prov = inferUserProvider({ provider: userOrProvider, email });
    }

    if (prov === 'apple') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-black text-white shadow-xs">
          <span></span> Apple
        </span>
      );
    }
    if (prov === 'kakao') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-[#FEE500] text-slate-900 shadow-xs font-sans">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-900" /> Kakao
        </span>
      );
    }
    if (prov === 'google') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 shadow-xs">
          <span className="font-serif font-black">G</span> Google
        </span>
      );
    }
    if (prov === 'email') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span>✉</span> 이메일
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
        <span>👤</span> 게스트
      </span>
    );
  };

  const handleOpenSingleDelete = (user: UserProfile) => {
    setUserToDelete(user);
    setIsBatchDeleteMode(false);
    setIsDeleteModalOpen(true);
  };

  const handleOpenBatchDelete = () => {
    if (selectedUserIds.length === 0) {
      showToast('삭제할 회원을 먼저 선택해 주세요.', 'error');
      return;
    }
    setUserToDelete(null);
    setIsBatchDeleteMode(true);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeletingUser(true);
      if (isBatchDeleteMode) {
        await batchDeleteUsersByAdmin(selectedUserIds);
        setSelectedUserIds([]);
      } else if (userToDelete) {
        await deleteUserByAdmin(userToDelete.uid);
        if (selectedUser?.uid === userToDelete.uid) {
          setIsDetailModalOpen(false);
          setSelectedUser(null);
        }
      }
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (e) {
      console.error('Delete error in modal:', e);
    } finally {
      setIsDeletingUser(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & SubTab Bar */}
      <div className={`p-6 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${cardBg}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center border border-indigo-500/20 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                회원 및 포인트 통합 관리 콘솔
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-bold">
                MEMBER & POINTS
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              전체 가입 회원 상태 모니터링, 제재 및 정지 조치, 포인트 지급·회수 및 실시간 거래 내역을 관리합니다.
            </p>
          </div>
        </div>

        {/* SubTab Switcher & Refresh */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`flex items-center p-1 rounded-xl border text-xs ${subCardBg}`}>
            <button
              onClick={() => setSubTab('users')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                subTab === 'users'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>회원 목록 ({allProfiles.length}명)</span>
            </button>
            <button
              onClick={() => setSubTab('transactions')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                subTab === 'transactions'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>포인트 내역 로그 ({pointTransactions.length}건)</span>
            </button>
          </div>

          <button
            onClick={async () => {
              await fetchAllProfiles();
              showToast('회원 목록과 포인트 정보를 최신 상태로 새로고침했습니다.', 'info');
            }}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>새로고침</span>
          </button>
        </div>
      </div>

      {/* ================= SUBTAB 1: USERS MANAGEMENT ================= */}
      {subTab === 'users' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Stats KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className={`p-4 rounded-2xl border transition-all ${cardBg}`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">전체 가입 회원</span>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.total}</span>
                <span className="text-xs text-slate-400">명</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">서비스 누적 회원수</p>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${cardBg}`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">오늘 활동 인원 (DAU)</span>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono text-emerald-600">{stats.activeToday}</span>
                <span className="text-xs text-emerald-500 font-bold">명</span>
              </div>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                <Activity className="w-3 h-3" />
                <span>오늘 방문/리뷰/상호작용</span>
              </p>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${cardBg}`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-sky-500 uppercase tracking-wider">오늘 신규 가입</span>
                <Sparkles className="w-4 h-4 text-sky-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono text-sky-600 dark:text-sky-400">{stats.signedUpToday}</span>
                <span className="text-xs text-sky-500 font-bold">명</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">
                {stats.signedUpToday > 0 ? '오늘 새로운 회원이 합류했습니다' : '오늘 아직 신규 가입이 없습니다'}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${cardBg}`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">제재/정지 회원</span>
                <ShieldAlert className="w-4 h-4 text-rose-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono text-rose-600">{stats.suspended + stats.banned}</span>
                <span className="text-xs text-rose-500">명</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">경고 보유자 {stats.warned}명</p>
            </div>

            <div className={`p-4 rounded-2xl border col-span-2 lg:col-span-1 transition-all ${cardBg}`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">총 보유 포인트</span>
                <Coins className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl font-black font-mono text-amber-600 dark:text-amber-400">
                  {stats.totalPoints.toLocaleString()}
                </span>
                <span className="text-xs text-amber-500 font-bold">P</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">회원 잔여 총 리워드</p>
            </div>
          </div>

          {/* Daily Signup Trend Chart & Provider Breakdown Section */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${cardBg}`}>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/50">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      최근 14일 일별 신규 가입 추이
                    </h4>
                    {selectedDateFilter && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white animate-in fade-in">
                        <Calendar className="w-2.5 h-2.5" />
                        <span>{selectedDateFilter} 필터 중</span>
                        <button
                          onClick={() => setSelectedDateFilter(null)}
                          className="hover:text-rose-200 ml-0.5"
                          title="필터 해제"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    막대를 클릭하면 해당 날짜에 가입한 회원만 테이블에서 모아볼 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedDateFilter && (
                  <button
                    onClick={() => setSelectedDateFilter(null)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    날짜 필터 초기화
                  </button>
                )}
                <button
                  onClick={() => setIsTrendExpanded(!isTrendExpanded)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {isTrendExpanded ? '차트 접기' : '차트 펼치기'}
                </button>
              </div>
            </div>

            {/* Provider Breakdown Summary Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 pb-3">
              {[
                { label: '카카오', provider: 'kakao', count: providerStats.kakao, color: 'bg-amber-400/15 text-amber-800 dark:text-amber-300 border-amber-300/40' },
                { label: 'Apple', provider: 'apple', count: providerStats.apple, color: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300/60' },
                { label: 'Google', provider: 'google', count: providerStats.google, color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/60' },
                { label: '이메일', provider: 'email', count: providerStats.email, color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60' },
                { label: '게스트', provider: 'anonymous', count: providerStats.anonymous, color: 'bg-slate-50 dark:bg-slate-900 text-slate-500 border-slate-200/50' },
              ].map(p => {
                const isSelected = providerFilter === p.provider;
                const ratio = stats.total > 0 ? Math.round((p.count / stats.total) * 100) : 0;
                return (
                  <button
                    key={p.provider}
                    onClick={() => setProviderFilter(providerFilter === p.provider ? 'all' : p.provider)}
                    className={`p-2 rounded-xl border text-left transition-all ${p.color} ${
                      isSelected ? 'ring-2 ring-indigo-500 shadow-xs' : 'hover:opacity-90'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span>{p.label}</span>
                      <span className="text-[10px] opacity-75">{ratio}%</span>
                    </div>
                    <div className="text-base font-black font-mono mt-0.5">
                      {p.count}<span className="text-[10px] font-normal ml-0.5">명</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Daily Bar Chart */}
            {isTrendExpanded && (
              <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-800">
                <div className="h-32 flex items-end gap-1.5 sm:gap-2 justify-between pt-4 pb-1 overflow-x-auto">
                  {dailySignups.map((day) => {
                    const isSelected = selectedDateFilter === day.date;
                    const heightPercent = maxDailyCount > 0 ? Math.max((day.count / maxDailyCount) * 100, 8) : 8;
                    const isDayToday = isToday(day.date);

                    return (
                      <div
                        key={day.date}
                        onClick={() => setSelectedDateFilter(isSelected ? null : day.date)}
                        className={`group relative flex-1 min-w-[28px] max-w-[48px] h-full flex flex-col justify-end items-center cursor-pointer transition-all rounded-lg p-1 ${
                          isSelected 
                            ? 'bg-indigo-500/15 ring-2 ring-indigo-500' 
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                        title={`${day.date} (${day.dayOfWeek}): ${day.count}명 가입`}
                      >
                        {/* Tooltip on hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-bold font-mono pointer-events-none whitespace-nowrap z-10 shadow-lg">
                          {day.date.slice(5)} · {day.count}명
                        </div>

                        {/* Bar Count label */}
                        <span className={`text-[10px] font-black font-mono mb-1 transition-colors ${
                          day.count > 0 
                            ? isDayToday ? 'text-indigo-600 font-extrabold' : (isDark ? 'text-slate-200' : 'text-slate-800')
                            : 'text-slate-300 dark:text-slate-600'
                        }`}>
                          {day.count > 0 ? day.count : ''}
                        </span>

                        {/* Bar */}
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t-md transition-all duration-300 ${
                            isSelected
                              ? 'bg-indigo-600 shadow-md shadow-indigo-500/40'
                              : isDayToday
                              ? 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                              : day.count > 0
                              ? 'bg-indigo-300 dark:bg-indigo-800 group-hover:bg-indigo-500'
                              : 'bg-slate-200 dark:bg-slate-800'
                          }`}
                        />

                        {/* Date label */}
                        <div className="mt-1.5 text-center leading-none">
                          <span className={`block text-[9px] font-mono ${
                            isDayToday 
                              ? 'text-indigo-600 dark:text-indigo-400 font-bold' 
                              : 'text-slate-400'
                          }`}>
                            {day.date.slice(5)}
                          </span>
                          <span className={`block text-[8px] mt-0.5 ${
                            isDayToday ? 'text-indigo-600 font-bold' : 'text-slate-400'
                          }`}>
                            {isDayToday ? '오늘' : day.dayOfWeek}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Search & Filter Toolbar */}
          <div className={`p-4 rounded-2xl border space-y-3 ${cardBg}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="닉네임, 이메일, UID로 회원 검색..."
                  className={`w-full pl-10 pr-8 py-2 rounded-xl text-xs outline-none transition-all border ${inputBg}`}
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

              <div className="flex items-center gap-2 flex-wrap text-xs">
                {/* Activity (DAU) Filter */}
                <select
                  value={activityFilter}
                  onChange={(e) => setActivityFilter(e.target.value as any)}
                  className={`px-3 py-2 rounded-xl font-semibold border outline-none cursor-pointer ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="all">활동 주기: 전체</option>
                  <option value="active_today">🔥 오늘 활동한 회원 (DAU)</option>
                  <option value="active_7d">최근 7일 이내 활동</option>
                  <option value="inactive_30d">30일 이상 미활동</option>
                </select>

                {/* Account Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`px-3 py-2 rounded-xl font-semibold border outline-none cursor-pointer ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="all">계정 상태: 전체</option>
                  <option value="active">정상 회원</option>
                  <option value="warned">경고 회원</option>
                  <option value="suspended">이용 정지 회원</option>
                  <option value="banned">영구 정지 회원</option>
                </select>

                {/* Login Provider Filter */}
                <select
                  value={providerFilter}
                  onChange={(e) => setProviderFilter(e.target.value)}
                  className={`px-3 py-2 rounded-xl font-semibold border outline-none cursor-pointer ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="all">로그인 수단: 전체</option>
                  <option value="kakao">카카오 (Kakao)</option>
                  <option value="apple">Apple</option>
                  <option value="google">Google</option>
                  <option value="email">이메일 가입</option>
                  <option value="anonymous">게스트</option>
                </select>

                {/* Sort Order */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className={`px-3 py-2 rounded-xl font-semibold border outline-none cursor-pointer ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="newest">가입일 최신순</option>
                  <option value="active_desc">최근 활동순 (DAU)</option>
                  <option value="points_desc">포인트 높은순</option>
                  <option value="warning_desc">경고 횟수순</option>
                </select>
              </div>
            </div>

            {/* Quick Active Filter Chips */}
            {(selectedDateFilter || providerFilter !== 'all' || activityFilter !== 'all' || statusFilter !== 'all' || searchQuery) && (
              <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px]">
                <span className="text-slate-400 flex items-center gap-1 mr-1">
                  <Filter className="w-3 h-3" />
                  <span>적용 필터:</span>
                </span>
                {selectedDateFilter && (
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 flex items-center gap-1 font-semibold">
                    가입일: {selectedDateFilter}
                    <button onClick={() => setSelectedDateFilter(null)} className="hover:text-rose-500"><X className="w-3 h-3" /></button>
                  </span>
                )}
                {activityFilter !== 'all' && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 flex items-center gap-1 font-semibold">
                    활동: {activityFilter === 'active_today' ? '오늘 활동 (DAU)' : activityFilter === 'active_7d' ? '최근 7일' : '30일 이상 미활동'}
                    <button onClick={() => setActivityFilter('all')} className="hover:text-rose-500"><X className="w-3 h-3" /></button>
                  </span>
                )}
                {providerFilter !== 'all' && (
                  <span className="px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200/50 flex items-center gap-1 font-semibold">
                    수단: {providerFilter}
                    <button onClick={() => setProviderFilter('all')} className="hover:text-rose-500"><X className="w-3 h-3" /></button>
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/50 flex items-center gap-1 font-semibold">
                    상태: {statusFilter}
                    <button onClick={() => setStatusFilter('all')} className="hover:text-rose-500"><X className="w-3 h-3" /></button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedDateFilter(null);
                    setActivityFilter('all');
                    setProviderFilter('all');
                    setStatusFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 ml-1 underline cursor-pointer"
                >
                  전체 초기화
                </button>
              </div>
            )}

            {/* Bulk Action Bar for Selected Users */}
            {selectedUserIds.length > 0 && (
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-between flex-wrap gap-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                    {selectedUserIds.length}
                  </span>
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    명의 회원이 선택되었습니다.
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap text-xs">
                  <button
                    onClick={() => handleOpenBatchPointModal('grant')}
                    className="px-2.5 py-1.5 rounded-lg font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1 shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>일괄 포인트 지급</span>
                  </button>
                  <button
                    onClick={() => handleOpenBatchPointModal('revoke')}
                    className="px-2.5 py-1.5 rounded-lg font-bold bg-amber-600 hover:bg-amber-500 text-white transition-all flex items-center gap-1 shadow-xs"
                  >
                    <MinusCircle className="w-3.5 h-3.5" />
                    <span>일괄 포인트 회수</span>
                  </button>
                  <button
                    onClick={() => handleBatchStatus('active')}
                    className="px-2.5 py-1.5 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all"
                  >
                    일괄 정상 복원
                  </button>
                  <button
                    onClick={() => handleBatchStatus('warned')}
                    className="px-2.5 py-1.5 rounded-lg font-bold bg-amber-500 hover:bg-amber-400 text-white transition-all"
                  >
                    일괄 경고 +1
                  </button>
                  <button
                    onClick={() => handleBatchStatus('suspended')}
                    className="px-2.5 py-1.5 rounded-lg font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all"
                  >
                    일괄 7일 정지
                  </button>
                  <button
                    onClick={handleOpenBatchDelete}
                    className="px-2.5 py-1.5 rounded-lg font-bold bg-red-700 hover:bg-red-800 text-white transition-all flex items-center gap-1 shadow-xs"
                    title="선택 회원 일괄 영구 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>선택 삭제</span>
                  </button>
                  <button
                    onClick={() => setSelectedUserIds([])}
                    className="p-1 text-slate-400 hover:text-slate-600 ml-1"
                    title="선택 해제"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Table */}
          <div className={`rounded-2xl border shadow-sm overflow-hidden ${cardBg}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className={`border-b text-[11px] font-bold uppercase ${tableHeaderBg}`}>
                    <th className="p-3.5 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length}
                        onChange={toggleSelectAll}
                        className="rounded border-slate-300 text-indigo-600 cursor-pointer"
                      />
                    </th>
                    <th className="p-3.5">회원 닉네임 / 식별값</th>
                    <th className="p-3.5">로그인 수단</th>
                    <th className="p-3.5">가입 일시</th>
                    <th className="p-3.5">최근 활동 (DAU)</th>
                    <th className="p-3.5">보유 포인트 / 등급</th>
                    <th className="p-3.5">계정 상태</th>
                    <th className="p-3.5">누적 경고 / 제재</th>
                    <th className="p-3.5 text-right">포인트 & 상태 관리</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${tableRowHover}`}>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                      const isSelected = selectedUserIds.includes(user.uid);
                      const userReviewsCount = reviews.filter(r => r.userId === user.uid || r.userName === user.displayName).length;
                      const isUserActiveToday = checkIsUserActiveToday(user);

                      return (
                        <tr 
                          key={user.uid}
                          className={`transition-colors ${
                            isSelected 
                              ? isDark ? 'bg-indigo-950/30' : 'bg-indigo-50/60' 
                              : ''
                          }`}
                        >
                          <td className="p-3.5 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectUser(user.uid)}
                              className="rounded border-slate-300 text-indigo-600 cursor-pointer"
                            />
                          </td>

                          {/* Profile */}
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img
                                  src={user.photoURL || DEFAULT_AVATAR}
                                  alt={user.displayName}
                                  className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                />
                                {isUserActiveToday && (
                                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" title="오늘 활동함" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 font-bold truncate">
                                  <span className={isDark ? 'text-white' : 'text-slate-900'}>{user.displayName}</span>
                                  {user.role === 'admin' && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-600 text-white">
                                      ADMIN
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono truncate max-w-[180px]">
                                  {user.email || user.uid}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Login Provider */}
                          <td className="p-3.5">
                            <div>{getProviderBadge(user)}</div>
                          </td>

                          {/* Sign-up Date/Time */}
                          <td className="p-3.5">
                            <div className="space-y-0.5 font-mono">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                  {user.createdAt ? user.createdAt.slice(0, 10) : '2025.01.01'}
                                </span>
                                {user.createdAt && isToday(user.createdAt) && (
                                  <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-sky-500/20 text-sky-600 dark:text-sky-400">
                                    오늘 가입
                                  </span>
                                )}
                                {user.createdAt && isYesterday(user.createdAt) && (
                                  <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-slate-500/10 text-slate-500">
                                    어제
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {formatFullDateTime(user.createdAt)}
                              </div>
                            </div>
                          </td>

                          {/* Recent Activity (DAU) */}
                          <td className="p-3.5">
                            <div className="space-y-0.5">
                              {isUserActiveToday ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  <span>오늘 활동 (DAU)</span>
                                </span>
                              ) : (
                                <span className="text-[11px] text-slate-400 font-medium">
                                  {getRelativeTime(user.lastActiveAt || user.createdAt)}
                                </span>
                              )}
                              <div className="text-[10px] text-slate-400 font-mono">
                                {formatFullDateTime(user.lastActiveAt || user.createdAt)}
                              </div>
                            </div>
                          </td>

                          {/* Points & Level */}
                          <td className="p-3.5">
                            <div className="space-y-0.5">
                              <div className="font-bold font-mono text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                <Coins className="w-3.5 h-3.5" />
                                <span>{(user.points || 0).toLocaleString()}P</span>
                              </div>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                                isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {user.level || 'Lv.1'} · 리뷰 {userReviewsCount}건
                              </span>
                            </div>
                          </td>

                          {/* Account Status */}
                          <td className="p-3.5">
                            {getStatusBadge(user.status)}
                          </td>

                          {/* Warnings & Penalty */}
                          <td className="p-3.5">
                            <div className="space-y-0.5 max-w-xs">
                              <div className="flex items-center gap-1.5">
                                <span className={`font-bold ${
                                  (user.warningCount || 0) >= 3 ? 'text-red-500' :
                                  (user.warningCount || 0) > 0 ? 'text-amber-500' : 'text-slate-400'
                                }`}>
                                  경고 {user.warningCount || 0}회
                                </span>
                                {user.suspendedUntil && user.status === 'suspended' && (
                                  <span className="text-[10px] text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-1 rounded font-mono">
                                    ~{new Date(user.suspendedUntil).toLocaleDateString('ko-KR')}까지
                                  </span>
                                )}
                              </div>
                              {user.statusReason && (
                                <p className="text-[11px] text-slate-500 truncate">
                                  {user.statusReason}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenSinglePointModal(user, 'grant')}
                                className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-colors flex items-center gap-1 ${
                                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-indigo-300 border-slate-700' : 'bg-slate-50 hover:bg-indigo-50 text-indigo-600 border-slate-200'
                                }`}
                                title="포인트 지급 또는 회수"
                              >
                                <Coins className="w-3 h-3 text-indigo-500" />
                                <span>포인트</span>
                              </button>
                              
                              <button
                                onClick={() => handleOpenDetail(user)}
                                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 border ${
                                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                                }`}
                                title="계정 상태 및 제재 관리"
                              >
                                <span>제재 관리</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>

                              <button
                                onClick={() => handleOpenSingleDelete(user)}
                                className="px-2 py-1 rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 border bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60"
                                title="회원 영구 삭제 (탈퇴 처리)"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>삭제</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={9} className="p-12 text-center text-slate-400">
                        <Users className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                        <p className="font-bold text-sm">일치하는 회원 정보가 없습니다.</p>
                        <p className="text-xs mt-1">검색어나 필터 조건을 변경해보세요.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBTAB 2: POINT TRANSACTIONS LOG ================= */}
      {subTab === 'transactions' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Transaction Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border ${cardBg}`}>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">누적 거래 내역</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {txStats.totalLogs}
                </span>
                <span className="text-xs text-slate-400">건 기록됨</span>
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${cardBg}`}>
              <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">총 지급 보너스</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono text-emerald-600">
                  +{txStats.totalGranted.toLocaleString()}
                </span>
                <span className="text-xs text-emerald-500">P</span>
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${cardBg}`}>
              <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">총 회수 / 차감</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono text-rose-600">
                  -{txStats.totalRevoked.toLocaleString()}
                </span>
                <span className="text-xs text-rose-500">P</span>
              </div>
            </div>
          </div>

          {/* Transaction Filters & Export */}
          <div className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${cardBg}`}>
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={txSearchQuery}
                onChange={(e) => setTxSearchQuery(e.target.value)}
                placeholder="회원 닉네임, 사유, 관리자 메모 검색..."
                className={`w-full pl-10 pr-8 py-2 rounded-xl text-xs outline-none border ${inputBg}`}
              />
              {txSearchQuery && (
                <button 
                  onClick={() => setTxSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <select
                value={txTypeFilter}
                onChange={(e) => setTxTypeFilter(e.target.value as any)}
                className={`px-3 py-2 rounded-xl font-semibold border outline-none cursor-pointer ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <option value="all">거래 유형: 전체</option>
                <option value="grant">지급 내역만</option>
                <option value="revoke">회수 내역만</option>
              </select>

              <button
                onClick={handleExportTransactionsJson}
                className="px-3.5 py-2 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>거래 내역 JSON 백업</span>
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className={`rounded-2xl border shadow-sm overflow-hidden ${cardBg}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className={`border-b text-[11px] font-bold uppercase ${tableHeaderBg}`}>
                    <th className="p-3.5">일시</th>
                    <th className="p-3.5">회원 닉네임</th>
                    <th className="p-3.5">거래 유형</th>
                    <th className="p-3.5">지급/회수 금액</th>
                    <th className="p-3.5">사유</th>
                    <th className="p-3.5">관리자 메모</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${tableRowHover}`}>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => {
                      const isGrant = tx.type === 'grant' || tx.amount > 0;
                      return (
                        <tr key={tx.id} className="transition-colors">
                          <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                            {tx.createdAt ? new Date(tx.createdAt).toLocaleString('ko-KR') : '-'}
                          </td>
                          <td className={`p-3.5 font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {tx.userName || tx.userId}
                          </td>
                          <td className="p-3.5">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isGrant 
                                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                                : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                            }`}>
                              {isGrant ? <PlusCircle className="w-2.5 h-2.5" /> : <MinusCircle className="w-2.5 h-2.5" />}
                              <span>{isGrant ? '포인트 지급' : '포인트 회수'}</span>
                            </span>
                          </td>
                          <td className={`p-3.5 font-mono font-black text-sm ${isGrant ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isGrant ? `+${Math.abs(tx.amount).toLocaleString()}` : `-${Math.abs(tx.amount).toLocaleString()}`} P
                          </td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium">
                            {tx.reason || '관리자 처리'}
                          </td>
                          <td className="p-3.5 text-slate-400 text-[11px]">
                            {tx.adminMemo || '-'}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-slate-400">
                        <History className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                        <p className="font-bold text-sm">포인트 거래 내역이 없습니다.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: User Status & Sanction Detail */}
      {isDetailModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl border flex flex-col space-y-5 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser.photoURL || DEFAULT_AVATAR}
                  alt={selectedUser.displayName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-indigo-500 shrink-0"
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
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">
                계정 상태 변경 선택
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
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                        isCur
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : isDark
                            ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-indigo-500'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-500'
                      }`}
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
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        suspendDays === days
                          ? 'bg-rose-600 text-white border-rose-600'
                          : isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {days}일 정지
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">
                  제재 / 변경 사유
                </label>
                <input
                  type="text"
                  value={statusReasonInput}
                  onChange={(e) => setStatusReasonInput(e.target.value)}
                  placeholder="예: 중복 도배 리뷰 작성 및 어뷰징 행위 반복"
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">
                  관리자 내부 메모 (비공개)
                </label>
                <input
                  type="text"
                  value={adminMemoInput}
                  onChange={(e) => setAdminMemoInput(e.target.value)}
                  placeholder="관리자용 참고사항 입력..."
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleApplyStatusChange}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
              >
                상태 변경 적용하기
              </button>
            </div>

            {/* Force Account Delete Section inside Detail Modal */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="text-[11px] text-slate-400">회원 탈퇴 및 계정 영구 삭제:</span>
              <button
                type="button"
                onClick={() => {
                  if (selectedUser) {
                    handleOpenSingleDelete(selectedUser);
                  }
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 flex items-center gap-1 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>회원 계정 영구 삭제</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Grant / Revoke Points (Single & Batch) */}
      {isPointModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border flex flex-col space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-sm flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <Coins className="w-4 h-4" />
                <span>
                  {isBatchPointMode 
                    ? `선택된 ${selectedUserIds.length}명 일괄 포인트 ${pointMode === 'grant' ? '지급' : '회수'}` 
                    : `${selectedUser?.displayName}님 포인트 ${pointMode === 'grant' ? '지급' : '회수'}`}
                </span>
              </h3>
              <button onClick={() => setIsPointModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setPointMode('grant')}
                className={`flex-1 py-1.5 font-bold rounded-lg transition-all ${
                  pointMode === 'grant' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                + 포인트 지급
              </button>
              <button
                type="button"
                onClick={() => setPointMode('revoke')}
                className={`flex-1 py-1.5 font-bold rounded-lg transition-all ${
                  pointMode === 'revoke' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                - 포인트 회수
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">금액 (P)</label>
                <input
                  type="number"
                  value={pointAmount}
                  onChange={(e) => setPointAmount(Number(e.target.value))}
                  min={1}
                  className={`w-full px-3 py-2 rounded-xl border font-mono font-bold outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">지급 / 회수 사유</label>
                <input
                  type="text"
                  value={pointReason}
                  onChange={(e) => setPointReason(e.target.value)}
                  placeholder="예: 우수 리뷰어 베스트 픽 선정 보상"
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">관리자 메모 (선택)</label>
                <input
                  type="text"
                  value={pointAdminMemo}
                  onChange={(e) => setPointAdminMemo(e.target.value)}
                  placeholder="관리자 내부 메모..."
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPointModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handlePointSubmit}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all ${
                  pointMode === 'grant' ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {pointMode === 'grant' ? '포인트 지급 실행' : '포인트 회수 실행'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Delete User Confirmation (Single & Batch) */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border flex flex-col space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-sm flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                <Trash2 className="w-4 h-4" />
                <span>
                  {isBatchDeleteMode 
                    ? `선택 회원 ${selectedUserIds.length}명 일괄 삭제` 
                    : `${userToDelete?.displayName} 회원 영구 삭제`}
                </span>
              </h3>
              <button 
                onClick={() => {
                  if (!isDeletingUser) {
                    setIsDeleteModalOpen(false);
                    setUserToDelete(null);
                  }
                }} 
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 space-y-2">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>주의: 삭제된 데이터는 절대 복구할 수 없습니다!</span>
              </div>
              <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80 leading-relaxed">
                {isBatchDeleteMode ? (
                  <>
                    선택하신 <strong>{selectedUserIds.length}명</strong>의 계정 프로필, 포인트 이력, 찜 목록, 작성 리뷰 등이 원격 데이터베이스에서 완전히 삭제(탈퇴 처리)됩니다.
                  </>
                ) : (
                  <>
                    <strong>{userToDelete?.displayName}</strong> ({userToDelete?.email || userToDelete?.uid}) 회원의 계정 프로필, 포인트({userToDelete?.points?.toLocaleString() || 0}P), 찜 목록 등이 영구 삭제됩니다.
                  </>
                )}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                disabled={isDeletingUser}
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setUserToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                취소
              </button>
              <button
                type="button"
                disabled={isDeletingUser}
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 transition-all flex items-center justify-center gap-1 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeletingUser ? '삭제 처리 중...' : '영구 삭제 실행'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
