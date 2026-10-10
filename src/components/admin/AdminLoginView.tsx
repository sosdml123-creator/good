import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ShieldCheck, Lock, ArrowLeft, AlertCircle, RefreshCw, Copy } from 'lucide-react';
import { checkAdminAccess, AdminAccess } from '../../services/adminAuth';
import { signInWithKakao } from '../../services/supabase';

interface AdminLoginViewProps {
  onSuccess: () => void;
  onCancel: () => void;
}

// 과거 비밀번호 방식에서 브라우저에 남겨둔 인증 플래그 (더 이상 신뢰하지 않으며 정리만 수행)
const LEGACY_ADMIN_AUTH_KEY = 'sinsangpick_admin_auth';

export const clearAdminAuthenticated = () => {
  sessionStorage.removeItem(LEGACY_ADMIN_AUTH_KEY);
  localStorage.removeItem(LEGACY_ADMIN_AUTH_KEY);
};

type ViewState = { status: 'checking' } | Exclude<AdminAccess, { status: 'admin' }>;

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onSuccess, onCancel }) => {
  const [state, setState] = useState<ViewState>({ status: 'checking' });
  const [copied, setCopied] = useState(false);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const verify = useCallback(async () => {
    setState({ status: 'checking' });
    const access = await checkAdminAccess();
    if (access.status === 'admin') {
      onSuccessRef.current();
      return;
    }
    setState(access);
  }, []);

  useEffect(() => {
    clearAdminAuthenticated();
    verify();
  }, [verify]);

  const handleKakaoLogin = async () => {
    try {
      await signInWithKakao();
    } catch (e) {
      console.warn('[Admin Auth] Kakao sign-in failed:', e);
      setState({ status: 'error' });
    }
  };

  const handleCopyUserId = async (userId: string) => {
    try {
      await navigator.clipboard.writeText(userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 클립보드 접근 불가 시 화면에 표시된 ID를 직접 복사
    }
  };

  const message =
    state.status === 'checking'
      ? '관리자 권한을 확인하고 있습니다...'
      : state.status === 'signed_out'
      ? '관리자 계정으로 로그인한 뒤 다시 시도해주세요.'
      : state.status === 'denied'
      ? '이 계정에는 관리자 권한이 없습니다.'
      : '권한을 확인하지 못했습니다. 네트워크 상태를 확인한 뒤 다시 시도해주세요.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">

        {/* Top Header */}
        <div className="relative px-6 pt-8 pb-6 bg-gradient-to-b from-indigo-50/80 to-transparent dark:from-indigo-950/40 text-center">
          <button
            onClick={onCancel}
            className="absolute top-5 left-5 p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="홈 화면으로 나가기"
            type="button"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 mb-3.5">
            <Lock className="w-7 h-7 stroke-[2.2]" />
          </div>

          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            관리자 보안 인증
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            관리자 권한이 부여된 로그인 계정만 콘솔에 접속할 수 있습니다.
          </p>
        </div>

        <div className="px-6 pb-8 pt-2 space-y-4">

          {/* Status Banner */}
          {state.status === 'checking' ? (
            <div className="flex items-center justify-center gap-2 p-3 text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <div className="w-4 h-4 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
              <span>{message}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-semibold animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Account ID (권한 부여 요청용) */}
          {state.status === 'denied' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                내 계정 ID
              </label>
              <button
                type="button"
                onClick={() => handleCopyUserId(state.userId)}
                className="w-full flex items-center justify-between gap-2 px-3.5 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-200 text-left"
                title="계정 ID 복사"
              >
                <span className="break-all">{state.userId}</span>
                <Copy className="w-4 h-4 shrink-0 text-slate-400" />
              </button>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                {copied ? '복사되었습니다.' : '운영자에게 이 ID의 관리자 권한 부여를 요청하세요.'}
              </p>
            </div>
          )}

          {state.status === 'signed_out' && (
            <button
              type="button"
              onClick={handleKakaoLogin}
              className="w-full py-3.5 px-4 bg-[#FEE500] hover:brightness-95 active:scale-[0.99] text-slate-900 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>카카오로 로그인</span>
            </button>
          )}

          {state.status !== 'checking' && (
            <button
              type="button"
              onClick={verify}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {state.status === 'signed_out' ? (
                <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
              ) : (
                <RefreshCw className="w-4 h-4 stroke-[2.2]" />
              )}
              <span>권한 다시 확인</span>
            </button>
          )}

          {/* Home Cancel Button */}
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            일반 화면으로 돌아가기
          </button>
        </div>

      </div>
    </div>
  );
};
