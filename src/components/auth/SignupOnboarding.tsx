import React, { useMemo, useState } from 'react';
import { Check, ChevronRight, Bell, Moon, ChevronLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { POINT_POLICY } from '../../constants/pointPolicy';

/** 관심 카테고리 (알림 설정 화면 · 서버 api/_lib/devicePush.js ALERT_CATEGORY_IDS 와 같아야 함) */
const CATEGORY_CHOICES = [
  { id: '과자', label: '과자', icon: '🍿' },
  { id: '음료', label: '음료', icon: '🥤' },
  { id: '빵·디저트', label: '빵·디저트', icon: '🥐' },
  { id: '간편식', label: '간편식', icon: '🍲' },
  { id: '패스트푸드', label: '패스트푸드', icon: '🍔' },
  { id: '아이스크림', label: '아이스크림', icon: '🍦' },
  { id: '과일', label: '과일', icon: '🍑' },
  { id: '고기·수산', label: '고기·수산', icon: '🥩' },
  { id: '식재료', label: '식재료', icon: '🥚' },
  { id: '기타', label: '기타', icon: '🍺' },
];

type TermKey = 'terms' | 'privacy' | 'age' | 'marketing' | 'night';

const TERMS: { key: TermKey; label: string; required: boolean; link?: string; desc?: string }[] = [
  { key: 'terms', label: '서비스 이용약관 동의', required: true, link: '/terms' },
  { key: 'privacy', label: '개인정보 수집·이용 동의', required: true, link: '/privacy' },
  { key: 'age', label: '만 14세 이상입니다', required: true },
  { key: 'marketing', label: '광고성 정보 수신 동의', required: false, desc: '신상 출시·할인 행사·이벤트 혜택 알림' },
  { key: 'night', label: '야간 혜택 알림 수신 동의', required: false, desc: '밤 9시~아침 8시에도 혜택 알림 받기' },
];

const STEP_TITLES = ['약관 동의', '닉네임', '알림 설정'];

const Checkbox: React.FC<{ checked: boolean; big?: boolean }> = ({ checked, big }) => (
  <span
    className={`${big ? 'w-6 h-6' : 'w-5 h-5'} shrink-0 rounded-full flex items-center justify-center transition-colors ${
      checked ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-300'
    }`}
  >
    <Check className={`${big ? 'w-4 h-4' : 'w-3.5 h-3.5'} stroke-[3]`} />
  </span>
);

export const SignupOnboarding: React.FC = () => {
  const { isOnboardingOpen, onboardingNeedsNickname, completeOnboarding, currentUser, isNicknameTaken } = useApp();

  const steps = useMemo(
    () => (onboardingNeedsNickname ? [0, 1, 2] : [0, 2]),
    [onboardingNeedsNickname]
  );
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[Math.min(stepIndex, steps.length - 1)];

  const [agreed, setAgreed] = useState<Record<TermKey, boolean>>({
    terms: false, privacy: false, age: false, marketing: false, night: false,
  });
  const [nickname, setNickname] = useState(() =>
    currentUser.displayName && !/^신상러버_/.test(currentUser.displayName) ? currentUser.displayName : ''
  );
  const [nicknameError, setNicknameError] = useState('');
  const [pushOn, setPushOn] = useState(true);
  const [categories, setCategories] = useState<string[]>(['과자', '음료', '빵·디저트', '간편식']);
  const [submitting, setSubmitting] = useState(false);

  if (!isOnboardingOpen) return null;

  const allAgreed = TERMS.every((t) => agreed[t.key]);
  const requiredAgreed = TERMS.filter((t) => t.required).every((t) => agreed[t.key]);

  const toggleAll = () => {
    const next = !allAgreed;
    setAgreed({ terms: next, privacy: next, age: next, marketing: next, night: next });
  };
  const toggleTerm = (key: TermKey) => {
    setAgreed((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      // 야간 혜택은 광고성 정보 수신에 동의해야 받을 수 있습니다
      if (key === 'marketing' && !next.marketing) next.night = false;
      if (key === 'night' && next.night) next.marketing = true;
      return next;
    });
  };

  const validateNickname = (): boolean => {
    const trimmed = nickname.trim();
    if (trimmed.length < 2) return setNicknameError('닉네임은 최소 2글자 이상 입력해 주세요.'), false;
    if (trimmed.length > 12) return setNicknameError('닉네임은 최대 12글자까지 가능합니다.'), false;
    if (!/^[a-zA-Z0-9가-힣_\s]+$/.test(trimmed)) return setNicknameError('한글, 영문, 숫자, 밑줄(_)만 사용 가능합니다.'), false;
    if (/^신상러버_/.test(trimmed)) return setNicknameError('나만의 닉네임을 입력해 주세요.'), false;
    if (isNicknameTaken(trimmed, currentUser.uid)) return setNicknameError('이미 다른 회원이 사용 중인 닉네임입니다.'), false;
    setNicknameError('');
    return true;
  };

  const goNext = async () => {
    if (step === 0 && !requiredAgreed) return;
    if (step === 1 && !validateNickname()) return;
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
      return;
    }
    setSubmitting(true);
    try {
      await completeOnboarding({
        nickname: onboardingNeedsNickname ? nickname.trim() : undefined,
        marketing: agreed.marketing,
        night: agreed.night,
        pushOn,
        categories,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCategory = (id: string) =>
    setCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));

  const nextDisabled =
    submitting || (step === 0 && !requiredAgreed) || (step === 1 && nickname.trim().length < 2);
  const isLast = stepIndex === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[60] bg-[#F2F4F7] flex justify-center">
      <div className="w-full max-w-[430px] h-[100dvh] bg-white flex flex-col">
        {/* 상단: 뒤로 · 단계 표시 */}
        <div className="px-5 pt-[max(env(safe-area-inset-top),16px)] pb-2">
          <div className="h-10 flex items-center">
            {stepIndex > 0 ? (
              <button
                type="button"
                onClick={() => setStepIndex(stepIndex - 1)}
                className="w-10 h-10 -ml-2 flex items-center justify-center text-gray-700 cursor-pointer"
                aria-label="이전"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            ) : <span />}
          </div>
          <div className="flex gap-1.5 mt-1">
            {steps.map((s, i) => (
              <div key={s} className={`h-1 flex-1 rounded-full ${i <= stepIndex ? 'bg-gray-900' : 'bg-gray-200'}`} />
            ))}
          </div>
          <p className="text-[12px] font-bold text-gray-400 mt-3">
            {stepIndex + 1} / {steps.length} · {STEP_TITLES[step]}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-6">
          {step === 0 && (
            <>
              <h1 className="text-[22px] font-black text-gray-900 leading-snug mt-2">
                신상픽 이용을 위해<br />약관에 동의해 주세요
              </h1>

              <button
                type="button"
                onClick={toggleAll}
                className="w-full mt-6 flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-left cursor-pointer"
              >
                <Checkbox checked={allAgreed} big />
                <span>
                  <span className="block text-[15px] font-extrabold text-gray-900">전체 동의</span>
                  <span className="block text-[11px] text-gray-400 mt-0.5">선택 항목(광고성 정보·야간 알림) 포함</span>
                </span>
              </button>

              <ul className="mt-3 divide-y divide-gray-50">
                {TERMS.map((t) => (
                  <li key={t.key} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => toggleTerm(t.key)}
                      className="flex-1 flex items-start gap-3 py-3.5 text-left cursor-pointer"
                    >
                      <Checkbox checked={agreed[t.key]} />
                      <span className="min-w-0">
                        <span className="text-[14px] text-gray-800">
                          <span className={`font-bold ${t.required ? 'text-gray-900' : 'text-gray-400'}`}>
                            [{t.required ? '필수' : '선택'}]
                          </span>{' '}
                          {t.label}
                        </span>
                        {t.desc && <span className="block text-[11px] text-gray-400 mt-0.5">{t.desc}</span>}
                      </span>
                    </button>
                    {t.link && (
                      <a
                        href={t.link}
                        target="_blank"
                        rel="noreferrer"
                        className="pl-2 py-3 text-[12px] text-gray-400 flex items-center"
                      >
                        보기 <ChevronRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-gray-400 leading-relaxed mt-3">
                선택 항목은 동의하지 않아도 서비스를 이용할 수 있고, 마이 &gt; 설정에서 언제든 바꿀 수 있어요.
              </p>
            </>
          )}

          {step === 1 && (
            <>
              <h1 className="text-[22px] font-black text-gray-900 leading-snug mt-2">
                신상픽에서 쓸<br />닉네임을 정해 주세요
              </h1>
              <p className="text-[13px] text-gray-500 mt-2">리뷰와 커뮤니티에 이 이름으로 보여요.</p>
              {POINT_POLICY.nicknameBonus > 0 && (
                <p className="inline-block text-[12px] font-bold bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full mt-3">
                  🎁 닉네임 설정하면 {POINT_POLICY.nicknameBonus}P 지급
                </p>
              )}
              <div className="mt-6">
                <div className="flex justify-between text-[12px] mb-1.5">
                  <span className="font-bold text-gray-700">닉네임</span>
                  <span className="text-gray-400">{nickname.length}/12자</span>
                </div>
                <input
                  type="text"
                  value={nickname}
                  maxLength={12}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    if (nicknameError) setNicknameError('');
                  }}
                  placeholder="예: 과자러버, 신상탐험가"
                  className={`w-full bg-gray-50 border rounded-2xl px-4 py-3.5 text-[15px] text-gray-900 outline-none ${
                    nicknameError ? 'border-rose-400 bg-rose-50/30' : 'border-gray-200 focus:border-gray-900 focus:bg-white'
                  }`}
                />
                {nicknameError && <p className="text-[12px] font-semibold text-rose-500 mt-1.5">{nicknameError}</p>}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-[22px] font-black text-gray-900 leading-snug mt-2">
                신상 소식을<br />알림으로 받아볼까요?
              </h1>

              <button
                type="button"
                onClick={() => setPushOn(!pushOn)}
                className="w-full mt-6 flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-left cursor-pointer"
              >
                <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[15px] font-bold text-gray-900">푸시 알림 받기</span>
                  <span className="block text-[11px] text-gray-400 mt-0.5">댓글·좋아요·포인트·관심 신상 출시</span>
                </span>
                <span className={`w-12 h-7 rounded-full p-0.5 transition-colors ${pushOn ? 'bg-gray-900' : 'bg-gray-200'}`}>
                  <span className={`block w-6 h-6 rounded-full bg-white shadow transition-transform ${pushOn ? 'translate-x-5' : ''}`} />
                </span>
              </button>

              {pushOn && (
                <>
                  <p className="text-[13px] font-bold text-gray-800 mt-6">관심 카테고리 출시 알림</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">고른 카테고리에 신제품이 나오면 알려드려요</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {CATEGORY_CHOICES.map((c) => {
                      const on = categories.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleCategory(c.id)}
                          className={`px-3.5 py-2 rounded-full text-[13px] font-bold border transition-colors cursor-pointer ${
                            on ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'
                          }`}
                        >
                          {c.icon} {c.label}
                        </button>
                      );
                    })}
                  </div>
                  {!agreed.marketing && (
                    <p className="text-[11px] text-gray-400 leading-relaxed mt-4 flex gap-1.5">
                      <Moon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      출시·행사 소식은 광고성 정보라서, 1단계에서 광고성 정보 수신에 동의해야 받을 수 있어요.
                    </p>
                  )}
                </>
              )}
            </>
          )}
        </div>

        <div className="px-5 pt-3 pb-[max(env(safe-area-inset-bottom),16px)] border-t border-gray-50">
          <button
            type="button"
            onClick={goNext}
            disabled={nextDisabled}
            className="w-full h-13 py-3.5 bg-gray-900 hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-2xl font-bold text-[15px] transition-colors cursor-pointer"
          >
            {submitting ? '저장 중...' : isLast ? '신상픽 시작하기' : step === 0 ? '동의하고 계속' : '다음'}
          </button>
        </div>
      </div>
    </div>
  );
};
