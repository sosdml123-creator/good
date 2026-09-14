import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Send, 
  Smartphone, 
  Sparkles, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  Package, 
  Calendar as CalendarIcon, 
  Search, 
  Radio, 
  ShieldCheck, 
  Info,
  Check,
  ChevronRight
} from 'lucide-react';
import { getFcmStatus, getStoredDeviceToken, FcmStatusInfo } from '../../services/notificationService';

export const NotificationManagementTab: React.FC = () => {
  const { 
    products, 
    events, 
    notifications, 
    sendPushNotification, 
    deleteNotification, 
    clearAllNotifications,
    refreshNotifications,
    pushPermissionStatus,
    requestPushPermission,
    openProductDetail,
    openEventDetail,
    showToast 
  } = useApp();

  // Form states
  const [notifType, setNotifType] = useState<'product' | 'event' | 'notice'>('product');
  const [badgeText, setBadgeText] = useState('신제품');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetId, setTargetId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sendScope, setSendScope] = useState<'all' | 'test'>('all');
  const [isSending, setIsSending] = useState(false);

  // Target pickers
  const [searchProductQuery, setSearchProductQuery] = useState('');
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [isEventPickerOpen, setIsEventPickerOpen] = useState(false);

  // FCM and device status
  const [fcmInfo, setFcmInfo] = useState<FcmStatusInfo | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const currentToken = getStoredDeviceToken();

  // Load FCM status
  const loadStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const data = await getFcmStatus();
      setFcmInfo(data);
    } catch (e) {
      console.warn('[NotificationManagementTab] Status load error:', e);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  // Quick preset templates
  const applyPreset = (presetType: 'product' | 'event' | 'notice') => {
    setNotifType(presetType);
    if (presetType === 'product') {
      const randomProduct = products[0] || null;
      setBadgeText('신제품');
      setTitle(randomProduct ? `🔥 [신제품] ${randomProduct.name} 출시!` : '🔥 새로운 신제품이 출시되었습니다!');
      setBody(randomProduct ? `${randomProduct.brand}의 화제 신상! 지금 바로 확인해보세요.` : '지금 신상픽에서 가장 핫한 신메뉴를 확인하세요.');
      if (randomProduct) {
        setTargetId(randomProduct.id);
        setImageUrl(randomProduct.image);
      }
    } else if (presetType === 'event') {
      const randomEvent = events[0] || null;
      setBadgeText('이벤트');
      setTitle(randomEvent ? `🎉 [이벤트] ${randomEvent.title}` : '🎉 신규 프로모션 이벤트가 시작되었습니다!');
      setBody(randomEvent ? `${randomEvent.reward || '특별 혜택'} 증정! 지금 바로 참여해보세요.` : '참여만 해도 포인트와 선물이 쏟아집니다!');
      if (randomEvent) {
        setTargetId(randomEvent.id);
        setImageUrl(randomEvent.bannerImage || '');
      }
    } else {
      setBadgeText('공지');
      setTitle('📢 [공지] 신상픽 앱 최신 업데이트 안내');
      setBody('더 빠르고 쾌적해진 신상픽을 만나보세요. 항상 이용해 주셔서 감사합니다.');
      setTargetId('');
      setImageUrl('');
    }
  };

  // Product selection handler
  const handleSelectProduct = (product: typeof products[0]) => {
    setNotifType('product');
    setBadgeText('신제품');
    setTitle(`⚡ [신제품] ${product.name} 출시!`);
    setBody(`${product.brand} | ${product.category} 신상! 편의점·마트 입고 정보를 확인하세요.`);
    setTargetId(product.id);
    setImageUrl(product.image);
    setIsProductPickerOpen(false);
    showToast(`'${product.name}' 상품이 알림 타겟으로 지정되었습니다.`, 'info');
  };

  // Event selection handler
  const handleSelectEvent = (event: typeof events[0]) => {
    setNotifType('event');
    setBadgeText('이벤트');
    setTitle(`🎁 [이벤트] ${event.title}`);
    setBody(`${event.reward || '특별 선물'} 혜택 놓치지 마세요!`);
    setTargetId(event.id);
    if (event.bannerImage) {
      setImageUrl(event.bannerImage);
    }
    setIsEventPickerOpen(false);
    showToast(`'${event.title}' 이벤트가 알림 타겟으로 지정되었습니다.`, 'info');
  };

  // Handle Send
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      showToast('알림 제목과 내용을 모두 입력해주세요.', 'error');
      return;
    }

    setIsSending(true);
    try {
      const payload = {
        title: title.trim(),
        body: body.trim(),
        type: notifType,
        targetId: targetId.trim(),
        imageUrl: imageUrl.trim() || undefined,
        badge: badgeText.trim() || '알림',
        tokens: sendScope === 'test' && currentToken ? [currentToken] : undefined
      };

      await sendPushNotification(payload);
      await loadStatus();
      await refreshNotifications();

      // Reset form if sent to all
      if (sendScope === 'all') {
        setTitle('');
        setBody('');
        setTargetId('');
        setImageUrl('');
      }
    } catch (err: any) {
      showToast(err.message || '알림 발송에 실패했습니다.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  // Copy current device token
  const handleCopyToken = () => {
    if (!currentToken) return;
    navigator.clipboard.writeText(currentToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
    showToast('디바이스 푸시 토큰이 클립보드에 복사되었습니다.', 'success');
  };

  // Filter products for search
  const filteredProducts = products.filter(p => {
    if (!searchProductQuery.trim()) return true;
    const q = searchProductQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
  }).slice(0, 10);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-gray-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
              <Bell className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black tracking-tight text-white">알림 & FCM 디바이스 푸시 관리</h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              실시간 연동 활성화
            </span>
          </div>
          <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
            신제품 출시 소식, 할인 프로모션, 전체 공지를 스마트폰 디바이스 푸시(FCM/APNs) 및 인앱 알림함으로 즉시 발송합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadStatus}
            disabled={isLoadingStatus}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/15"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStatus ? 'animate-spin' : ''}`} />
            <span>상태 새로고침</span>
          </button>
        </div>
      </div>

      {/* 2. Status & Monitoring Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tokens */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold">등록된 디바이스 수</span>
            <Smartphone className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-gray-900">
              {fcmInfo?.registeredTokens ?? 0}
            </span>
            <span className="text-xs text-gray-400 font-medium">대 기기</span>
          </div>
          <div className="mt-2 text-[11px] text-gray-500 flex gap-2 font-medium">
            <span>iOS: {fcmInfo?.tokensByPlatform.ios ?? 0}</span>
            <span>Android: {fcmInfo?.tokensByPlatform.android ?? 0}</span>
            <span>Web: {fcmInfo?.tokensByPlatform.web ?? 0}</span>
          </div>
        </div>

        {/* Current Device Permission */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold">내 브라우저/기기 알림</span>
            <Radio className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-center gap-2">
            {pushPermissionStatus === 'granted' ? (
              <span className="text-sm font-black text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                푸시 수신 허용됨
              </span>
            ) : (
              <span className="text-sm font-black text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                권한 미허용 ({pushPermissionStatus})
              </span>
            )}
          </div>
          <button
            onClick={requestPushPermission}
            className="mt-2 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline block"
          >
            {pushPermissionStatus === 'granted' ? '권한 상태 다시 확인' : '지금 권한 허용하기'}
          </button>
        </div>

        {/* In-app Notification Count */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold">발송된 알림 내역</span>
            <Bell className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-gray-900">
              {notifications.length}
            </span>
            <span className="text-xs text-gray-400 font-medium">건 보관 중</span>
          </div>
          <p className="mt-2 text-[11px] text-gray-400">
            앱 내 알림함에 실시간 동기화 유지
          </p>
        </div>

        {/* FCM Server Configuration */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold">FCM 서버 연동 모드</span>
            <ShieldCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 inline-block">
              {fcmInfo?.hasFcmKey ? 'FCM Direct Key 활성' : '하이브리드 실시간 브로드캐스트'}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-gray-500">
            Supabase Realtime + FCM Push 동시 가동
          </p>
        </div>
      </div>

      {/* 3. Main Form & Mockup Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Section (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-black text-gray-900 flex items-center gap-1.5">
              <Send className="w-4 h-4 text-indigo-600" />
              <span>새 알림 / 푸시 작성</span>
            </h3>

            {/* Presets */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-gray-400 font-medium mr-1">빠른 서식:</span>
              <button
                type="button"
                onClick={() => applyPreset('product')}
                className="px-2 py-1 text-[11px] font-bold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                ⚡ 신제품
              </button>
              <button
                type="button"
                onClick={() => applyPreset('event')}
                className="px-2 py-1 text-[11px] font-bold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                🎉 이벤트
              </button>
              <button
                type="button"
                onClick={() => applyPreset('notice')}
                className="px-2 py-1 text-[11px] font-bold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                📢 공지
              </button>
            </div>
          </div>

          <form onSubmit={handleSendNotification} className="space-y-4">
            {/* Notification Type & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">알림 분류</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['product', 'event', 'notice'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setNotifType(t);
                        if (t === 'product') setBadgeText('신제품');
                        else if (t === 'event') setBadgeText('이벤트');
                        else setBadgeText('공지');
                      }}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        notifType === t
                          ? 'bg-gray-900 text-white border-gray-900 shadow-2xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {t === 'product' ? '신제품' : t === 'event' ? '이벤트' : '일반공지'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">배지 라벨 (Badge)</label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  placeholder="예: 신제품, 단독특가, 이벤트, 혜택"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                />
              </div>
            </div>

            {/* Target Selector Buttons */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                연결 대상 상품 / 이벤트 선택
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductPickerOpen(true)}
                  className="flex-1 py-2 px-3 rounded-xl border border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50/30 text-gray-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Package className="w-3.5 h-3.5 text-indigo-600" />
                  <span>등록된 상품에서 선택</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEventPickerOpen(true)}
                  className="flex-1 py-2 px-3 rounded-xl border border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50/30 text-gray-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CalendarIcon className="w-3.5 h-3.5 text-amber-600" />
                  <span>등록된 이벤트에서 선택</span>
                </button>
              </div>
            </div>

            {/* Target ID & Image URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  타겟 ID (targetId)
                </label>
                <input
                  type="text"
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  placeholder="예: snack-01 또는 event-01"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  썸네일 이미지 URL (선택)
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-gray-600"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700">알림 제목 (Title) *</label>
                <span className="text-[10px] text-gray-400">{title.length}/60자</span>
              </div>
              <input
                type="text"
                required
                maxLength={60}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 🔥 [신제품] 쫀득 딸기 롤케이크 전국 편의점 출시!"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold"
              />
            </div>

            {/* Body */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700">알림 내용 (Body) *</label>
                <span className="text-[10px] text-gray-400">{body.length}/150자</span>
              </div>
              <textarea
                required
                rows={3}
                maxLength={150}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="스마트폰 화면에 표시될 알림 본문을 입력하세요. 핵심 혜택과 출시 정보를 간결하게 작성하면 클릭률이 높아집니다."
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium resize-none leading-relaxed"
              />
            </div>

            {/* Scope Selection (All vs Test) */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
              <span className="text-xs font-bold text-gray-800 block">발송 대상 범위</span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sendScope"
                    checked={sendScope === 'all'}
                    onChange={() => setSendScope('all')}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="text-xs font-bold text-gray-800">
                    전체 회원 발송 ({fcmInfo?.registeredTokens || 0}개 기기 + 인앱 알림함)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sendScope"
                    checked={sendScope === 'test'}
                    onChange={() => setSendScope('test')}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="text-xs font-bold text-gray-800">
                    내 기기로만 테스트 발송 (1건)
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 active:bg-black text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>푸시 알림 발송 중...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>
                      {sendScope === 'all' 
                        ? '📢 전체 회원에게 푸시 알림 즉시 발송하기' 
                        : '📱 내 기기로 테스트 푸시 발송하기'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Mockup Preview Section (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-gray-700" />
                <span>스마트폰 락스크린 실시간 미리보기</span>
              </h3>
              <span className="text-[10px] text-gray-400 font-medium">iOS / Android 푸시</span>
            </div>

            {/* Smartphone Mockup */}
            <div className="relative mx-auto w-full max-w-[320px] aspect-[9/16] bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 rounded-[38px] p-3.5 shadow-xl border-4 border-gray-800 text-white flex flex-col justify-between overflow-hidden">
              {/* Top Notch / Dynamic Island */}
              <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-gray-900"></div>
              </div>

              {/* Lockscreen Time */}
              <div className="text-center my-auto py-2">
                <p className="text-[11px] font-semibold text-gray-300">
                  {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
                </p>
                <h4 className="text-4xl font-light tracking-tight text-white mt-0.5">
                  {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </h4>

                {/* The Push Notification Banner on Lockscreen */}
                <div className="mt-6 bg-white/90 backdrop-blur-md rounded-2xl p-3 text-left shadow-lg border border-white/20 text-gray-900 transition-all transform hover:scale-[1.02]">
                  {/* Push Header */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded bg-gray-900 flex items-center justify-center text-[9px] font-black text-white">
                        S
                      </div>
                      <span className="text-[11px] font-bold text-gray-900">신상픽</span>
                      <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-1 rounded">
                        {badgeText || '알림'}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400">방금 전</span>
                  </div>

                  {/* Push Content */}
                  <div className="flex gap-2.5 items-start">
                    <div className="flex-1 min-w-0">
                      <h5 className="text-[11px] font-black text-gray-900 leading-snug line-clamp-1">
                        {title || '알림 제목이 여기에 표시됩니다'}
                      </h5>
                      <p className="text-[10px] text-gray-600 line-clamp-2 mt-0.5 leading-relaxed">
                        {body || '알림 본문 내용이 스마트폰 푸시 배너 형태로 실시간 렌더링됩니다.'}
                      </p>
                    </div>

                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-10 h-10 rounded-lg object-cover border border-gray-200 bg-gray-50 shrink-0"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Home Indicator */}
              <div className="w-28 h-1 bg-white/40 rounded-full mx-auto mt-2"></div>
            </div>
          </div>

          {/* Current Device Token Info Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-gray-400" />
                <span>내 기기 디바이스 푸시 토큰</span>
              </span>
              {currentToken && (
                <button
                  type="button"
                  onClick={handleCopyToken}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  {copiedToken ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedToken ? '복사완료' : '토큰 복사'}</span>
                </button>
              )}
            </div>
            <p className="text-[11px] font-mono text-gray-500 break-all bg-gray-50 p-2 rounded-lg border border-gray-100">
              {currentToken ? currentToken : '디바이스 푸시 권한을 허용하면 토큰이 자동 발급됩니다.'}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Sent Notifications History Table */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-sm font-black text-gray-900 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-amber-500" />
              <span>발송 이력 및 활성 알림 관리 ({notifications.length})</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              사용자 앱 내 알림함에 노출되고 있는 알림 목록입니다.
            </p>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={() => {
                if (confirm('모든 알림을 삭제하시겠습니까?')) {
                  clearAllNotifications();
                }
              }}
              className="text-xs text-gray-500 hover:text-red-500 font-bold flex items-center gap-1 transition-colors px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>전체 삭제</span>
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs font-bold">발송된 알림 내역이 없습니다</p>
            <p className="text-[11px] mt-1">상단 폼에서 첫 번째 푸시 알림을 발송해보세요</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="py-3 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors rounded-xl px-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {n.imageUrl ? (
                    <img
                      src={n.imageUrl}
                      alt=""
                      className="w-11 h-11 rounded-xl object-cover border border-gray-200 shrink-0 bg-white"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                        {n.badge || '알림'}
                      </span>
                      <span className="text-[10px] text-gray-400">{n.timestamp}</span>
                      {n.targetId && (
                        <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1 rounded">
                          ID: {n.targetId}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 truncate">
                      {n.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      {n.body}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {n.type === 'product' && n.targetId && (
                    <button
                      onClick={() => openProductDetail(n.targetId!)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 text-xs font-bold flex items-center gap-1"
                      title="연결 상품 확인"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {n.type === 'event' && n.targetId && (
                    <button
                      onClick={() => openEventDetail(n.targetId!)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 text-xs font-bold flex items-center gap-1"
                      title="연결 이벤트 확인"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="알림 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Product Picker Modal */}
      {isProductPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h4 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-600" />
                <span>알림 연결 상품 선택</span>
              </h4>
              <button
                onClick={() => setIsProductPickerOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold"
              >
                닫기
              </button>
            </div>

            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchProductQuery}
                  onChange={(e) => setSearchProductQuery(e.target.value)}
                  placeholder="상품명 또는 브랜드명 검색..."
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="overflow-y-auto p-3 divide-y divide-gray-100 flex-1">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectProduct(p)}
                  className="py-2.5 px-2 flex items-center justify-between hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-gray-500">{p.brand}</span>
                      <p className="text-xs font-bold text-gray-900">{p.name}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Event Picker Modal */}
      {isEventPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h4 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-amber-600" />
                <span>알림 연결 이벤트 선택</span>
              </h4>
              <button
                onClick={() => setIsEventPickerOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold"
              >
                닫기
              </button>
            </div>

            <div className="overflow-y-auto p-3 divide-y divide-gray-100 flex-1">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => handleSelectEvent(ev)}
                  className="py-2.5 px-2 flex items-center justify-between hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {ev.bannerImage ? (
                      <img
                        src={ev.bannerImage}
                        alt={ev.title}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                        이벤트
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-gray-900">{ev.title}</p>
                      <p className="text-[10px] text-gray-500">{ev.reward || '혜택 진행 중'}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
