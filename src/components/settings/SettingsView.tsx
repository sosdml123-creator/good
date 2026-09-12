import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Shield, 
  FileText, 
  MapPin, 
  HeartHandshake, 
  Code2, 
  Bell, 
  Moon, 
  SlidersHorizontal, 
  Mail, 
  Info, 
  LogOut, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PolicyModal } from './PolicyModal';
import { DeleteAccountModal } from './DeleteAccountModal';

export const SettingsView: React.FC = () => {
  const { 
    currentUser, 
    updateUserNickname, 
    logout, 
    goBack, 
    setActiveTab, 
    showToast,
    openLoginModal
  } = useApp();

  // State for modals & editing
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditNicknameOpen, setIsEditNicknameOpen] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(currentUser.displayName);
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);

  // Notification Toggles (with local persistence)
  const [pushEnabled, setPushEnabled] = useState<boolean>(() => {
    return localStorage.getItem('sinsangpick_push_enabled') !== 'false';
  });
  const [nightPushEnabled, setNightPushEnabled] = useState<boolean>(() => {
    return localStorage.getItem('sinsangpick_night_push') === 'true';
  });

  const handleTogglePush = () => {
    const next = !pushEnabled;
    setPushEnabled(next);
    localStorage.setItem('sinsangpick_push_enabled', String(next));
    showToast(next ? '푸시 알림이 활성화되었습니다.' : '푸시 알림이 해제되었습니다.', 'info');
  };

  const handleToggleNightPush = () => {
    const next = !nightPushEnabled;
    setNightPushEnabled(next);
    localStorage.setItem('sinsangpick_night_push', String(next));
    showToast(next ? '야간(21:00~08:00) 혜택 알림이 수신 동의되었습니다.' : '야간 혜택 알림이 해제되었습니다.', 'info');
  };

  const handleSaveNickname = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicknameInput.trim()) return;
    updateUserNickname(nicknameInput.trim());
    setIsEditNicknameOpen(false);
  };

  const getProviderBadge = () => {
    if (currentUser.provider === 'apple') {
      return (
        <span className="text-[11px] bg-black text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
          🍎 Apple 연동
        </span>
      );
    }
    if (currentUser.provider === 'kakao') {
      return (
        <span className="text-[11px] bg-[#FEE500] text-gray-900 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
          💬 카카오 연동
        </span>
      );
    }
    if (currentUser.provider === 'google') {
      return (
        <span className="text-[11px] bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
          🌐 Google 연동
        </span>
      );
    }
    return (
      <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">
        신상픽 회원
      </span>
    );
  };

  const policyItems = [
    {
      id: 'privacy',
      icon: <Shield className="w-4 h-4 text-blue-600" />,
      title: '개인정보처리방침',
      badge: '필수',
      desc: '데이터 수집, 이용 목적 및 파기 절차'
    },
    {
      id: 'terms',
      icon: <FileText className="w-4 h-4 text-emerald-600" />,
      title: '서비스 이용약관 (EULA)',
      badge: '필수',
      desc: '커뮤니티 UGC 운영 정책 및 이용 조건'
    },
    {
      id: 'location',
      icon: <MapPin className="w-4 h-4 text-amber-600" />,
      title: '위치기반서비스 이용약관',
      badge: '',
      desc: '주변 편의점/마트 재고 탐색 위치정보 정책'
    },
    {
      id: 'youth',
      icon: <HeartHandshake className="w-4 h-4 text-pink-600" />,
      title: '청소년 보호 정책',
      badge: '',
      desc: '유해 정보 차단 및 청소년 보호 조치'
    },
    {
      id: 'opensource',
      icon: <Code2 className="w-4 h-4 text-indigo-600" />,
      title: '오픈소스 소프트웨어 라이선스',
      badge: '',
      desc: '오픈소스 패키지 및 저작권 고지'
    },
    {
      id: 'delete-account',
      icon: <Info className="w-4 h-4 text-gray-600" />,
      title: '계정 및 데이터 삭제 안내',
      badge: '스토어 규정',
      desc: 'Apple & Google 가이드라인 준수 고지'
    }
  ];

  return (
    <div className="bg-[#F6F8FA] min-h-full pb-20">
      {/* 1. Sticky Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3.5 flex items-center justify-between z-20 shadow-2xs">
        <button
          onClick={goBack}
          className="p-1 -ml-1 text-gray-800 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>
        <h1 className="text-base font-black text-gray-900">설정</h1>
        <div className="w-6" /> {/* Placeholder for balance */}
      </div>

      <div className="p-4 space-y-4">
        {/* 2. Account Profile Card */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <img
              src={currentUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt="프로필"
              className="w-12 h-12 rounded-full border border-gray-200 object-cover bg-gray-100 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-gray-900 truncate">
                  {currentUser.displayName}
                </span>
                <button
                  onClick={() => {
                    setNicknameInput(currentUser.displayName);
                    setIsEditNicknameOpen(true);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
                  title="닉네임 변경"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                {getProviderBadge()}
                {currentUser.email && (
                  <span className="text-[11px] text-gray-400 truncate">
                    {currentUser.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Notifications Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
          <div className="px-4 pt-3.5 pb-2 border-b border-gray-50">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              알림 설정
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {/* Push Toggle */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">푸시 알림 허용</div>
                  <div className="text-[11px] text-gray-400">신제품 출시 및 주요 프로모션 알림</div>
                </div>
              </div>
              <button
                onClick={handleTogglePush}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  pushEnabled ? 'bg-[#0066FF]' : 'bg-gray-200'
                }`}
                aria-label="푸시 알림 토글"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    pushEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Night Push Toggle */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">야간 혜택 알림 허용</div>
                  <div className="text-[11px] text-gray-400">밤 9시 ~ 아침 8시 사이 특가/체험단 알림</div>
                </div>
              </div>
              <button
                onClick={handleToggleNightPush}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  nightPushEnabled ? 'bg-[#0066FF]' : 'bg-gray-200'
                }`}
                aria-label="야간 알림 토글"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    nightPushEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Alert Categories Navigation */}
            <div
              onClick={() => setActiveTab('alert_settings')}
              className="px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">관심 카테고리 출시알림 설정</div>
                  <div className="text-[11px] text-gray-400">과자, 음료, 디저트 등 선택 알림</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </div>
        </div>

        {/* 4. Policies & Legal Notice (Core Requirement for App Review) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
          <div className="px-4 pt-3.5 pb-2 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              약관 및 정책 (Legal)
            </h2>
            <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
              스토어 심사 기준 준수
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {policyItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPolicyId(item.id)}
                className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-900 truncate">
                        {item.title}
                      </span>
                      {item.badge && (
                        <span className="text-[9px] font-extrabold bg-blue-50 text-[#0066FF] px-1.5 py-0.2 rounded">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400 truncate mt-0.5">
                      {item.desc}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* 5. Support & App Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
          <div className="px-4 pt-3.5 pb-2 border-b border-gray-50">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              고객지원 및 서비스 정보
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {/* Customer Contact */}
            <a
              href="mailto:contact@sinsangpick.com?subject=[신상픽 문의]"
              className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">고객센터 / 문의하기</div>
                  <div className="text-[11px] text-gray-400">contact@sinsangpick.com</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-300" />
            </a>

            {/* Version Info */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl overflow-hidden shadow-2xs border border-gray-100 shrink-0">
                  <img src="/logo.png" alt="신상픽" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">신상픽 공식 앱 버전</div>
                  <div className="text-[11px] text-gray-400">최신 정식 릴리즈 v1.0.0</div>
                </div>
              </div>
              <span className="text-xs font-bold text-[#0066FF] bg-blue-50 px-2.5 py-1 rounded-full">
                최신 버전
              </span>
            </div>

            {/* Business Info Accordion */}
            <div className="px-4 py-3">
              <button
                onClick={() => setShowBusinessInfo(!showBusinessInfo)}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="text-xs font-bold text-gray-600">사업자 정보 및 개인정보 관리책임자</span>
                {showBusinessInfo ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {showBusinessInfo && (
                <div className="mt-3 p-3 bg-gray-50 rounded-xl text-[11px] text-gray-500 space-y-1 leading-relaxed border border-gray-100">
                  <div><strong>서비스명:</strong> 신상픽 (Sinsangpick)</div>
                  <div><strong>개인정보 보호책임관:</strong> 신상픽 정보보호팀</div>
                  <div><strong>문의 이메일:</strong> contact@sinsangpick.com</div>
                  <div><strong>운영 시간:</strong> 평일 10:00 ~ 18:00 (공휴일 휴무)</div>
                  <div><strong>호스팅 서비스 제공자:</strong> Supabase, Inc. / Vercel Inc.</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 6. Account Actions (Login, Logout & Delete Account) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
          <div className="divide-y divide-gray-100">
            {/* Social Connect or Connected Status */}
            {currentUser.isAnonymous ? (
              <button
                onClick={openLoginModal}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-blue-50/40 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.42-6.74-10.23-11.75-21.9-15.03-35.01-3.28-13.11-4.92-25.16-4.92-36.15 0-14.36 3.69-26.06 11.07-35.1 7.38-9.04 16.74-13.68 28.08-13.91 4.79 0 10.27 1.22 16.44 3.66 6.18 2.44 10.05 3.72 11.62 3.84 2.07-.23 6.06-1.55 11.96-3.96 5.9-2.42 11.07-3.51 15.52-3.28 14.15.82 25.17 6.13 33.06 15.93-12.38 7.5-18.42 17.65-18.12 30.45.31 10.24 4.29 18.79 11.94 25.65 7.65 6.86 16.79 10.74 27.42 11.65-2.22 6.74-4.82 13.54-7.8 20.41zM119.22 32.64c0-7.39 2.67-14.33 8.01-20.82 5.34-6.49 12.01-10.66 20.02-12.51.21 1.09.32 2.12.32 3.09 0 7.39-2.73 14.48-8.19 21.26-5.46 6.78-12.18 10.9-20.16 12.36-.21-1.09-.32-2.12-.32-3.38z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors">
                      소셜 계정 연결 (Apple / 카카오 / Google)
                    </div>
                    <div className="text-[11px] text-gray-400">
                      계정을 연결하여 활동 내역을 영구 보관하세요
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#0066FF] bg-blue-50 px-2.5 py-1 rounded-lg">
                  연결
                </span>
              </button>
            ) : (
              <div className="px-4 py-3.5 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-bold text-gray-700">
                    {currentUser.provider === 'apple' ? '🍎 Apple 계정 연동됨' : (currentUser.provider === 'kakao' ? '💬 카카오 계정 연동됨' : '🌐 Google 계정 연동됨')}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-mono">
                  {currentUser.email || currentUser.displayName}
                </span>
              </div>
            )}

            {/* Logout */}
            <button
              onClick={logout}
              className="w-full px-4 py-3.5 flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-bold">로그아웃</span>
            </button>

            {/* Delete Account (Apple Store Guideline 5.1.1(v) Requirement) */}
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full px-4 py-3.5 flex items-center justify-between text-rose-600 hover:bg-rose-50/50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-4 h-4 text-rose-500" />
                <div>
                  <div className="text-xs font-bold">회원 탈퇴 (계정 삭제)</div>
                  <div className="text-[10px] text-rose-400">모든 데이터 및 보유 포인트 영구 파기</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Nickname Modal */}
      {isEditNicknameOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">닉네임 변경</span>
              <button onClick={() => setIsEditNicknameOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNickname} className="space-y-3">
              <input
                type="text"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                maxLength={15}
                autoFocus
                placeholder="새로운 닉네임을 입력하세요"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-[#0066FF]"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditNicknameOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0066FF] text-white text-xs font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>변경완료</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Policy Reader Modal */}
      <PolicyModal
        isOpen={Boolean(selectedPolicyId)}
        onClose={() => setSelectedPolicyId(null)}
        initialPolicyId={selectedPolicyId || 'privacy'}
      />

      {/* Account Deletion Modal */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
