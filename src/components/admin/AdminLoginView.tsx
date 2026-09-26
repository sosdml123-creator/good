import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Key, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';

interface AdminLoginViewProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const ADMIN_AUTH_KEY = 'sinsangpick_admin_auth';

export const checkIsAdminAuthenticated = (): boolean => {
  return (
    sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true' ||
    localStorage.getItem(ADMIN_AUTH_KEY) === 'true'
  );
};

export const setAdminAuthenticated = (persist: boolean = true) => {
  sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
  if (persist) {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
  }
};

export const clearAdminAuthenticated = () => {
  sessionStorage.removeItem(ADMIN_AUTH_KEY);
  localStorage.removeItem(ADMIN_AUTH_KEY);
};

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onSuccess, onCancel }) => {
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!adminId.trim()) {
      setErrorMessage('관리자 아이디를 입력해주세요.');
      return;
    }
    if (!adminPassword.trim()) {
      setErrorMessage('비밀번호를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    // 아이디: 8648, 비번: 8648 인증
    if (adminId.trim() === '8648' && adminPassword.trim() === '8648') {
      setAdminAuthenticated(true);
      setIsSubmitting(false);
      onSuccess();
    } else {
      setTimeout(() => {
        setIsSubmitting(false);
        setErrorMessage('아이디 또는 비밀번호가 일치하지 않습니다.');
      }, 250);
    }
  };

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
            신상픽 최고관리자 콘솔 접속을 위해 계정 정보를 입력하세요.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 pb-8 pt-2 space-y-4">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-semibold animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Admin ID Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              관리자 아이디
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={adminId}
                onChange={(e) => {
                  setAdminId(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="아이디 입력"
                autoFocus
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-600 transition-all"
              />
            </div>
          </div>

          {/* Admin Password Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              비밀번호
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Key className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={adminPassword}
                onChange={(e) => {
                  setAdminPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="비밀번호 입력"
                className="w-full pl-10 pr-11 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
              <span>{isSubmitting ? '인증 확인 중...' : '관리자 콘솔 접속'}</span>
            </button>
          </div>

          {/* Home Cancel Button */}
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            일반 화면으로 돌아가기
          </button>
        </form>

      </div>
    </div>
  );
};
