import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { POINT_POLICY } from '../../constants/pointPolicy';
import { fetchAdRewardStatus, fetchCouponCatalog, getStoredCouponCatalog } from '../../services/couponApi';
import { Award, Search, X, Plus, Minus, RefreshCw } from 'lucide-react';

interface PointManagementTabProps {
  isDark: boolean;
}

const SIGNUP_POINTS = 100; // supabase guard_profiles_points 의 가입 기본 포인트

export const PointManagementTab: React.FC<PointManagementTabProps> = ({ isDark }) => {
  const {
    allProfiles,
    pointTransactions,
    batchGrantPoints,
    batchRevokePoints,
    fetchAllProfiles,
  } = useApp();

  // 광고·e쿠폰 한도는 서버 환경변수로 정해지므로 실제 적용 중인 값을 불러옵니다.
  const [adPolicy, setAdPolicy] = useState<{ points: number; dailyLimit: number; enabled: boolean } | null>(null);
  const [couponDailyLimit, setCouponDailyLimit] = useState<number | null>(
    () => getStoredCouponCatalog()?.userDailyLimit ?? null
  );

  useEffect(() => {
    fetchAllProfiles().catch(() => {});
    fetchAdRewardStatus()
      .then(s => s && setAdPolicy({ points: s.points, dailyLimit: s.dailyLimit, enabled: s.enabled }))
      .catch(() => {});
    fetchCouponCatalog()
      .then(c => setCouponDailyLimit(c.userDailyLimit))
      .catch(() => {});
  }, []);

  const [mode, setMode] = useState<'grant' | 'revoke'>('grant');
  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [amount, setAmount] = useState<number>(100);
  const [reason, setReason] = useState('');
  const [memo, setMemo] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const profileMap = useMemo(() => new Map(allProfiles.map(u => [u.uid, u])), [allProfiles]);
  const selectedUsers = selectedIds.map(id => profileMap.get(id)).filter(Boolean) as typeof allProfiles;

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allProfiles
      .filter(u =>
        !selectedIds.includes(u.uid) &&
        ((u.displayName || '').toLowerCase().includes(q) ||
          (u.email || '').toLowerCase().includes(q) ||
          u.uid.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [query, allProfiles, selectedIds]);

  const totalPoints = allProfiles.reduce((sum, u) => sum + (u.points || 0), 0);
  const validAmount = Number.isFinite(amount) && amount > 0 ? Math.trunc(amount) : 0;
  const canSubmit = selectedIds.length > 0 && validAmount > 0 && reason.trim().length > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setSubmitting(true);
    try {
      if (mode === 'grant') {
        await batchGrantPoints(selectedIds, validAmount, reason.trim(), memo.trim() || undefined);
      } else {
        await batchRevokePoints(selectedIds, validAmount, reason.trim(), memo.trim() || undefined);
      }
      setSelectedIds([]);
      setMemo('');
    } finally {
      setSubmitting(false);
      setConfirming(false);
    }
  };

  const card = `rounded-2xl border p-5 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`;
  const input = `w-full px-3 py-2 rounded-xl text-sm border outline-none focus:border-indigo-500 ${
    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
  }`;
  const label = `block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`;
  const sub = isDark ? 'text-slate-400' : 'text-slate-500';

  const policyRows: { title: string; value: string; note: string }[] = [
    { title: '회원 가입', value: `${SIGNUP_POINTS}P`, note: '가입 시 1회 지급' },
    {
      title: '리뷰 작성',
      value: `${POINT_POLICY.review}P`,
      note: `상품당 1회, 하루 ${POINT_POLICY.reviewDailyLimit}건까지 (사진·글자 수 무관)`,
    },
    {
      title: '광고 보고 포인트 받기',
      value: adPolicy ? `${adPolicy.points}P` : '확인 중',
      note: adPolicy
        ? `하루 ${adPolicy.dailyLimit}회까지${adPolicy.enabled ? '' : ' · 현재 적립 꺼짐'}`
        : '서버 설정값을 불러오는 중입니다',
    },
    {
      title: '하루 최대 적립',
      value: `${POINT_POLICY.dailyCap}P`,
      note: '리뷰 등 활동 적립 합산 (광고 보상·관리자 지급은 별도)',
    },
    {
      title: 'e쿠폰 교환 (사용)',
      value: '1P = 1원',
      note: couponDailyLimit
        ? `1인 하루 ${couponDailyLimit.toLocaleString()}P까지 교환, 발급 실패 시 자동 환급`
        : '발급 실패 시 자동 환급',
    },
    { title: '회원 탈퇴', value: '즉시 소멸', note: '보유 포인트는 복구되지 않습니다' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={card}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className={`text-lg font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Award className="w-5 h-5 text-amber-500" />
              포인트 관리
            </h2>
            <p className={`text-xs mt-1 ${sub}`}>
              현재 적용 중인 포인트 정책을 확인하고, 회원에게 포인트를 지급하거나 회수합니다.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-[11px] font-bold ${sub}`}>전체 회원 보유 포인트</div>
              <div className="text-lg font-black font-mono text-amber-500">{totalPoints.toLocaleString()}P</div>
            </div>
            <button
              onClick={() => fetchAllProfiles().catch(() => {})}
              className={`p-2 rounded-lg border cursor-pointer ${
                isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="새로고침"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 포인트 정책 */}
      <div className={card}>
        <h3 className={`text-sm font-black mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>현재 포인트 정책</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {policyRows.map(row => (
            <div
              key={row.title}
              className={`rounded-xl border p-3.5 ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50'}`}
            >
              <div className={`text-[11px] font-bold ${sub}`}>{row.title}</div>
              <div className={`text-base font-black font-mono mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{row.value}</div>
              <div className={`text-[11px] mt-1 ${sub}`}>{row.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 지급 / 회수 */}
      <div className={card}>
        <h3 className={`text-sm font-black mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>포인트 지급 · 회수</h3>

        <div className={`flex p-1 rounded-xl mb-4 max-w-xs ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <button
            onClick={() => { setMode('grant'); setConfirming(false); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer ${
              mode === 'grant' ? 'bg-indigo-600 text-white shadow-xs' : sub
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> 지급
          </button>
          <button
            onClick={() => { setMode('revoke'); setConfirming(false); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer ${
              mode === 'revoke' ? 'bg-rose-600 text-white shadow-xs' : sub
            }`}
          >
            <Minus className="w-3.5 h-3.5" /> 회수
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* 대상 회원 */}
          <div>
            <label className={label}>대상 회원 ({selectedIds.length}명 선택)</label>
            <div className="relative">
              <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${sub}`} />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="닉네임, 이메일 또는 회원 ID로 검색"
                className={`${input} pl-9`}
              />
            </div>

            {query.trim() && (
              <div className={`mt-2 rounded-xl border overflow-hidden ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                {searchResults.length === 0 ? (
                  <div className={`p-3 text-xs ${sub}`}>검색된 회원이 없습니다.</div>
                ) : (
                  searchResults.map(u => (
                    <button
                      key={u.uid}
                      onClick={() => { setSelectedIds(prev => [...prev, u.uid]); setConfirming(false); }}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-left text-xs cursor-pointer border-b last:border-b-0 ${
                        isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-200' : 'border-slate-100 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="font-bold">{u.displayName}</span>
                        <span className={`block truncate text-[11px] ${sub}`}>{u.email || u.uid}</span>
                      </span>
                      <span className="font-mono font-bold text-amber-500 shrink-0">{(u.points || 0).toLocaleString()}P</span>
                    </button>
                  ))
                )}
              </div>
            )}

            {selectedUsers.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedUsers.map(u => (
                  <span
                    key={u.uid}
                    className={`inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-bold ${
                      isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {u.displayName}
                    <span className="font-mono text-amber-500">{(u.points || 0).toLocaleString()}P</span>
                    <button
                      onClick={() => { setSelectedIds(prev => prev.filter(id => id !== u.uid)); setConfirming(false); }}
                      className="p-0.5 rounded-full hover:bg-slate-500/20 cursor-pointer"
                      title="선택 해제"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 금액 · 사유 */}
          <div className="space-y-3">
            <div>
              <label className={label}>{mode === 'grant' ? '지급' : '회수'} 포인트 (1인당)</label>
              <input
                type="number"
                min={1}
                value={amount || ''}
                onChange={e => { setAmount(Number(e.target.value)); setConfirming(false); }}
                className={`${input} font-mono`}
              />
              <div className="flex gap-1.5 mt-1.5">
                {[10, 100, 500, 1000].map(v => (
                  <button
                    key={v}
                    onClick={() => { setAmount(v); setConfirming(false); }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${
                      isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {v.toLocaleString()}P
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={label}>사유 (회원 포인트 내역에 표시)</label>
              <input
                type="text"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder={mode === 'grant' ? '예: 이벤트 당첨 보상' : '예: 부정 적립 회수'}
                className={input}
              />
            </div>
            <div>
              <label className={label}>관리자 메모 (선택, 관리자만 확인)</label>
              <input type="text" value={memo} onChange={e => setMemo(e.target.value)} className={input} />
            </div>

            {mode === 'revoke' && (
              <p className={`text-[11px] ${sub}`}>보유 포인트보다 많이 회수하면 0P까지만 차감됩니다.</p>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-40 cursor-pointer ${
                  mode === 'grant' ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {submitting
                  ? '처리 중...'
                  : confirming
                    ? `${selectedIds.length}명에게 ${validAmount.toLocaleString()}P ${mode === 'grant' ? '지급' : '회수'} 확정`
                    : mode === 'grant' ? '포인트 지급' : '포인트 회수'}
              </button>
              {confirming && !submitting && (
                <button
                  onClick={() => setConfirming(false)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-bold cursor-pointer ${sub}`}
                >
                  취소
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 최근 지급·회수 내역 */}
      <div className={card}>
        <h3 className={`text-sm font-black mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          최근 지급 · 회수 내역 ({pointTransactions.length}건)
        </h3>
        {pointTransactions.length === 0 ? (
          <p className={`text-xs ${sub}`}>아직 지급·회수 내역이 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={`text-left ${sub}`}>
                  <th className="py-2 pr-3 font-bold">일시</th>
                  <th className="py-2 pr-3 font-bold">회원</th>
                  <th className="py-2 pr-3 font-bold text-right">변동</th>
                  <th className="py-2 pr-3 font-bold text-right">잔액</th>
                  <th className="py-2 font-bold">사유</th>
                </tr>
              </thead>
              <tbody>
                {pointTransactions.slice(0, 50).map(tx => (
                  <tr key={tx.id} className={`border-t ${isDark ? 'border-slate-800 text-slate-200' : 'border-slate-100 text-slate-800'}`}>
                    <td className={`py-2 pr-3 whitespace-nowrap ${sub}`}>{tx.createdAt}</td>
                    <td className="py-2 pr-3 font-bold whitespace-nowrap">{tx.userName}</td>
                    <td className={`py-2 pr-3 text-right font-mono font-bold whitespace-nowrap ${tx.amount >= 0 ? 'text-indigo-500' : 'text-rose-500'}`}>
                      {tx.amount >= 0 ? '+' : ''}{tx.amount.toLocaleString()}P
                    </td>
                    <td className="py-2 pr-3 text-right font-mono whitespace-nowrap">{(tx.balanceAfter || 0).toLocaleString()}P</td>
                    <td className="py-2">
                      {tx.reason}
                      {tx.adminMemo && <span className={`block text-[11px] ${sub}`}>메모: {tx.adminMemo}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
