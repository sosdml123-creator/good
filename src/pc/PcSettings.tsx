import React, { useRef, useState } from 'react';
import { Camera, ChevronRight, Loader2, LogOut, Mail, Pencil, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PolicyModal } from '../components/settings/PolicyModal';
import { DeleteAccountModal } from '../components/settings/DeleteAccountModal';
import { BlockedUsersModal } from '../components/settings/BlockedUsersModal';
import { EditNicknameModal } from '../components/my/EditNicknameModal';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { DEFAULT_AVATAR, compressImageFile } from '../utils/avatars';
import { PcContainer } from './PcUi';

const POLICIES = [
  { id: 'privacy', title: '개인정보처리방침', desc: '수집 항목, 광고·제휴 링크·e쿠폰 정보 처리 안내', strong: true },
  { id: 'terms', title: '서비스 이용약관', desc: '커뮤니티 운영 정책 및 이용 조건' },
  { id: 'location', title: '위치기반서비스 이용약관', desc: '주변 편의점·마트 매장 탐색 위치정보 정책' },
  { id: 'youth', title: '청소년 보호 정책', desc: '유해 정보 차단 및 청소년 보호 조치' },
  { id: 'opensource', title: '오픈소스 소프트웨어 라이선스', desc: '오픈소스 패키지 및 저작권 고지' },
  { id: 'delete-account', title: '계정 및 데이터 삭제 안내', desc: '계정 삭제 시 처리되는 데이터 안내' },
];

const BUSINESS_INFO: [string, string][] = [
  ['서비스명', '신상픽 (Sinsangpick)'],
  ['상호', '플레이팅'],
  ['대표자', '양승현'],
  ['사업자등록번호', '618-09-34774'],
  ['사업장 소재지', '서울특별시 양천구 목동중앙남로3가길 108, B02호(목동)'],
  ['개인정보 보호책임관', '신상픽 정보보호팀'],
  ['문의 이메일', 'contact@sinsangpick.com'],
  ['운영 시간', '평일 10:00 ~ 18:00 (공휴일 휴무)'],
  ['호스팅', 'Supabase, Inc. / Vercel Inc.'],
  ['e쿠폰 발급 대행', '기프티쇼 비즈 (주식회사 케이티알파)'],
  ['제휴 마케팅', '쿠팡 파트너스 / 링크프라이스'],
];

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section>
    <h2 className="text-[18px] font-bold text-gray-900 mb-4">{title}</h2>
    <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">{children}</div>
  </section>
);

const Row: React.FC<{ title: string; desc?: string; onClick?: () => void; right?: React.ReactNode; strong?: boolean }> = ({
  title, desc, onClick, right, strong,
}) => (
  <button onClick={onClick} disabled={!onClick} className="w-full px-6 py-4 flex items-center gap-4 text-left enabled:hover:bg-gray-50 enabled:cursor-pointer">
    <span className="flex-1 min-w-0">
      <span className={`block text-[15px] text-gray-900 ${strong ? 'font-bold' : 'font-medium'}`}>{title}</span>
      {desc && <span className="block mt-0.5 text-[13px] text-gray-500">{desc}</span>}
    </span>
    {right ?? (onClick && <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />)}
  </button>
);

/** PC 고객센터·설정 (모바일 설정 화면과 별도) */
export const PcSettings: React.FC = () => {
  const { currentUser, logout, openLoginModal, openPermissionModal, openNotificationCenter, updateUserProfile } = useApp();
  const [policyId, setPolicyId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isBlockedOpen, setIsBlockedOpen] = useState(false);
  const [isNicknameOpen, setIsNicknameOpen] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return alert('이미지 파일만 선택할 수 있습니다.');
    try {
      setIsProcessingImage(true);
      await updateUserProfile({ photoURL: await compressImageFile(file, 360, 0.85) });
    } catch (err) {
      console.error('Profile photo upload error:', err);
      alert('이미지를 불러오는데 실패했습니다.');
    } finally {
      setIsProcessingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const providerLabel = currentUser.provider === 'apple' ? 'Apple 계정 연동' : currentUser.provider === 'kakao' ? '카카오 계정 연동' : '신상픽 회원';

  return (
    <div className="bg-[#F5F5F7] py-12">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      <PcContainer>
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">고객센터 · 설정</h1>

        {/* 문의 배너 */}
        <a
          href="mailto:contact@sinsangpick.com?subject=[신상픽 문의]"
          className="mt-8 flex items-center gap-5 bg-white rounded-2xl border border-gray-200 px-8 py-6 hover:border-gray-400 transition-colors"
        >
          <span className="w-12 h-12 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6" />
          </span>
          <span className="flex-1">
            <span className="block text-[17px] font-bold text-gray-900">이메일로 문의하기</span>
            <span className="block mt-0.5 text-[14px] text-gray-500">contact@sinsangpick.com · 평일 10:00 ~ 18:00 (공휴일 휴무)</span>
          </span>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </a>

        <div className="mt-10 grid grid-cols-2 gap-8 items-start">
          <div className="space-y-8">
            <Section title="계정">
              {currentUser.isAnonymous ? (
                <Row title="로그인 · 회원가입" desc="카카오·Apple 계정으로 로그인하고 활동 내역을 보관하세요" onClick={openLoginModal} />
              ) : (
                <>
                  <div className="px-6 py-5 flex items-center gap-4">
                    <button onClick={() => fileInputRef.current?.click()} className="relative shrink-0 cursor-pointer" title="프로필 사진 변경">
                      <img src={currentUser.photoURL || DEFAULT_AVATAR} alt="" className="w-14 h-14 rounded-full object-cover bg-gray-100 border border-gray-200" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-gray-900 text-white border-2 border-white flex items-center justify-center">
                        {isProcessingImage ? <Loader2 className="w-3 h-3 animate-spin" /> : <Camera className="w-3 h-3" />}
                      </span>
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="text-[16px] font-bold text-gray-900 truncate">{currentUser.displayName}</p>
                      <p className="mt-0.5 text-[13px] text-gray-500 truncate">
                        {providerLabel}{currentUser.email ? ` · ${currentUser.email}` : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsNicknameOpen(true)}
                      className="h-9 px-3.5 rounded-lg border border-gray-200 text-[13px] text-gray-700 hover:bg-gray-50 flex items-center gap-1 cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      닉네임 변경
                    </button>
                  </div>
                  <Row title="로그아웃" onClick={logout} right={<LogOut className="w-4 h-4 text-gray-400" />} />
                  <button onClick={() => setIsDeleteOpen(true)} className="w-full px-6 py-4 flex items-center gap-4 text-left hover:bg-rose-50/50 cursor-pointer">
                    <span className="flex-1">
                      <span className="block text-[15px] font-medium text-rose-600">회원 탈퇴 (계정 삭제)</span>
                      <span className="block mt-0.5 text-[13px] text-rose-400">모든 데이터, 보유 포인트 및 쿠폰함 e쿠폰이 영구 삭제됩니다</span>
                    </span>
                    <Trash2 className="w-4 h-4 text-rose-400" />
                  </button>
                </>
              )}
            </Section>

            <Section title="알림 · 권한">
              <Row title="알림함" desc="받은 신제품·이벤트 알림 보기" onClick={() => openNotificationCenter('inbox')} />
              <Row title="마케팅 알림 & 접근 권한 안내" desc="신제품·할인 알림, 카메라, 위치 권한 안내" onClick={openPermissionModal} />
              <Row title="출시 알림 · 푸시 알림" desc="관심 카테고리 출시 알림과 푸시 켜고 끄기는 신상픽 앱에서 할 수 있어요" />
            </Section>

            <Section title="언어">
              <div className="px-6 py-5"><LanguageSwitcher /></div>
            </Section>
          </div>

          <div className="space-y-8">
            <Section title="약관 및 정책">
              {POLICIES.map(p => (
                <Row key={p.id} title={p.title} desc={p.desc} strong={p.strong} onClick={() => setPolicyId(p.id)} />
              ))}
              <Row title="차단한 사용자 관리" desc="내가 차단한 사용자 확인 및 해제" onClick={() => setIsBlockedOpen(true)} />
              <Row
                title="광고 · 제휴 링크 · e쿠폰 안내"
                desc="구매처 링크 일부는 제휴 링크로, 구매 시 신상픽이 수수료를 받을 수 있습니다"
                onClick={() => setPolicyId('privacy')}
              />
            </Section>

            <Section title="사업자 정보">
              <dl className="px-6 py-5 grid grid-cols-[130px_1fr] gap-y-2 text-[13px]">
                {BUSINESS_INFO.map(([k, v]) => (
                  <React.Fragment key={k}>
                    <dt className="text-gray-500">{k}</dt>
                    <dd className="text-gray-800">{v}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </Section>
          </div>
        </div>
      </PcContainer>

      <PolicyModal isOpen={Boolean(policyId)} onClose={() => setPolicyId(null)} initialPolicyId={policyId || 'privacy'} />
      <BlockedUsersModal isOpen={isBlockedOpen} onClose={() => setIsBlockedOpen(false)} />
      <DeleteAccountModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} />
      <EditNicknameModal isOpen={isNicknameOpen} onClose={() => setIsNicknameOpen(false)} />
    </div>
  );
};
