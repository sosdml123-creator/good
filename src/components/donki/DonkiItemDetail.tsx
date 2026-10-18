import React, { useEffect, useMemo, useState } from 'react';
import { X, Star, Check, Plus, Flag, Trash2, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DonkiItem, DonkiReview, addDonkiReview, deleteDonkiReview, fetchDonkiReviews, getMyUserId } from '../../services/donkiService';
import { comparePrice, won } from '../../data/donkiGuide';
import { ReportModal, ReportTarget } from '../common/ReportModal';
import { safeLocalStorageGet } from '../../utils/safeStorage';
import { DEFAULT_AVATAR } from '../../utils/avatars';

interface Props {
  item: DonkiItem;
  rate: { rate: number; date: string } | null;
  picked: boolean;
  busy: boolean;
  onTogglePick: () => void;
  onShow: () => void;
  onClose: () => void;
  onReviewsChanged: (count: number, avg: number | null) => void;
  /** pc: 가운데 2단 창, mobile: 전체 화면 */
  variant: 'mobile' | 'pc';
}

const Stars: React.FC<{ value: number; size?: string }> = ({ value, size = 'w-3.5 h-3.5' }) => (
  <span className="inline-flex">
    {[1, 2, 3, 4, 5].map(n => (
      <Star key={n} className={`${size} ${n <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
    ))}
  </span>
);

const formatDate = (iso: string) => iso.slice(0, 10).replace(/-/g, '.');

/** 돈키호테 상품 상세: 가격 비교 + 회원 리뷰 (모바일·PC 공용, variant 로 배치만 다름) */
export const DonkiItemDetail: React.FC<Props> = ({ item, rate, picked, busy, onTogglePick, onShow, onClose, onReviewsChanged, variant }) => {
  const { currentUser, showToast, openLoginModal } = useApp();
  const [reviews, setReviews] = useState<DonkiReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [reportTarget, setReportTarget] = useState<ReportTarget | null>(null);
  const [hiddenTick, setHiddenTick] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([fetchDonkiReviews(item.id).catch(() => []), getMyUserId()]).then(([list, uid]) => {
      if (!alive) return;
      setReviews(list);
      setMyId(uid);
      setLoading(false);
    });
    return () => { alive = false; };
  }, [item.id]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  // 신고로 숨긴 리뷰·차단한 사용자는 보이지 않게 (App Store UGC 요구사항)
  const visible = useMemo(() => {
    const hidden = safeLocalStorageGet<string[]>('sinsangpick_hidden_ids', []);
    const blocked = safeLocalStorageGet<string[]>('sinsangpick_blocked_users', []);
    return reviews.filter(r => !hidden.includes(r.id) && !blocked.includes(r.userName));
  }, [reviews, hiddenTick]);

  const avg = reviews.length ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10 : null;
  const myReview = myId ? reviews.find(r => r.userId === myId) : undefined;
  const price = comparePrice(item.priceYen, item.priceKrw, rate?.rate ?? null);

  const sync = (list: DonkiReview[]) => {
    setReviews(list);
    const a = list.length ? Math.round((list.reduce((s, r) => s + r.rating, 0) / list.length) * 10) / 10 : null;
    onReviewsChanged(list.length, a);
  };

  const submit = async () => {
    if (saving) return;
    if (!text.trim()) return showToast('리뷰 내용을 입력해주세요.', 'error');
    setSaving(true);
    try {
      const res = await addDonkiReview(item.id, rating, text, { name: currentUser.displayName, avatar: currentUser.photoURL });
      if (res === 'login') return openLoginModal();
      sync([res, ...reviews]);
      setText('');
      setRating(5);
      showToast('리뷰를 등록했어요.', 'success');
    } catch (e) {
      console.warn('[donki] review failed:', e);
      showToast('리뷰를 등록하지 못했어요. 잠시 후 다시 시도해주세요.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (r: DonkiReview) => {
    if (!window.confirm('내 리뷰를 삭제할까요?')) return;
    try {
      await deleteDonkiReview(r.id);
      sync(reviews.filter(x => x.id !== r.id));
      showToast('리뷰를 삭제했어요.', 'success');
    } catch {
      showToast('삭제하지 못했어요.', 'error');
    }
  };

  const isPc = variant === 'pc';

  const priceBox = (
    <div className="rounded-2xl bg-[#FFFBE0] border border-[#FFE97A] p-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-bold text-gray-500">돈키호테 참고가</p>
          <p className="text-[20px] font-black text-gray-900 leading-tight">{item.priceYen ? `¥${item.priceYen.toLocaleString()}` : '-'}</p>
          {price.donkiKrw && <p className="text-[12px] text-gray-500">≈ {won(price.donkiKrw)}</p>}
        </div>
        <div>
          <p className="text-[11px] font-bold text-gray-500">한국 온라인 최저가</p>
          {item.priceKrw
            ? <p className="text-[20px] font-black text-gray-900 leading-tight">{won(item.priceKrw)}</p>
            : <p className="text-[13px] font-bold text-gray-400 leading-tight mt-1">비교 가격 없음</p>}
          {item.krwNote && <p className="text-[11px] text-gray-500 leading-snug">{item.krwNote}</p>}
        </div>
      </div>
      {price.diff != null && (
        <p className={`mt-3 rounded-xl px-3 py-2 text-[13px] font-black ${price.diff > 0 ? 'bg-black text-[#FFE600]' : 'bg-white text-gray-700'}`}>
          {price.diff > 0
            ? `돈키에서 사면 약 ${won(price.diff)} (${price.pct}%) 아껴요`
            : `한국 온라인이 약 ${won(-price.diff)} 더 싸요`}
        </p>
      )}
      <p className="mt-2 text-[10px] text-gray-400 leading-relaxed">
        돈키 가격은 세전 참고가{rate ? `, 환율 1엔=${rate.rate.toFixed(2)}원(${rate.date} 기준)` : ''}.
        {item.krwCheckedOn ? ` 한국 가격은 ${formatDate(item.krwCheckedOn)} 다나와 조사.` : ''} 실제 가격은 매장·판매처마다 달라요.
      </p>
    </div>
  );

  const reviewSection = (
    <section>
      <div className="flex items-end justify-between">
        <h3 className="text-[16px] font-black text-gray-900">회원 리뷰 <span className="text-gray-400">{reviews.length}</span></h3>
        {avg != null && (
          <span className="flex items-center gap-1 text-[13px] font-bold text-gray-800"><Stars value={avg} /> {avg.toFixed(1)}</span>
        )}
      </div>

      {!myReview && (
        <div className="mt-3 rounded-2xl border border-gray-200 p-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => setRating(n)} aria-label={`${n}점`} className="p-0.5">
                <Star className={`w-6 h-6 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
              </button>
            ))}
            <span className="ml-1 text-[12px] text-gray-500">{rating}점</span>
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={500}
            placeholder="써 보니 어땠나요? 효과, 향, 가격, 선물 반응 등을 알려주세요."
            className="mt-2 w-full h-20 resize-none rounded-xl bg-gray-50 px-3 py-2 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
          />
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[11px] text-gray-400">{text.length}/500</span>
            <button onClick={submit} disabled={saving} className="h-9 px-4 rounded-full bg-black text-[#FFE600] text-[13px] font-bold disabled:opacity-60">
              {saving ? '등록 중…' : '리뷰 등록'}
            </button>
          </div>
        </div>
      )}

      <div className="mt-3 divide-y divide-gray-100">
        {loading && <div className="py-8 flex justify-center text-gray-300"><Loader2 className="w-5 h-5 animate-spin" /></div>}
        {!loading && visible.length === 0 && (
          <p className="py-8 text-center text-[13px] text-gray-400">아직 리뷰가 없어요. 첫 리뷰를 남겨주세요!</p>
        )}
        {visible.map(r => (
          <div key={r.id} className="py-3.5">
            <div className="flex items-center gap-2">
              <img src={r.userAvatar || DEFAULT_AVATAR} alt="" className="w-7 h-7 rounded-full object-cover bg-gray-100" />
              <span className="text-[13px] font-bold text-gray-900">{r.userName}</span>
              <Stars value={r.rating} size="w-3 h-3" />
              <span className="ml-auto text-[11px] text-gray-400">{formatDate(r.createdAt)}</span>
            </div>
            <p className="mt-1.5 text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap break-words">{r.content}</p>
            <div className="mt-1 flex justify-end">
              {r.userId === myId ? (
                <button onClick={() => remove(r)} className="text-[11px] text-gray-400 flex items-center gap-0.5 hover:text-rose-500"><Trash2 className="w-3 h-3" /> 삭제</button>
              ) : (
                <button
                  onClick={() => setReportTarget({ type: 'review', id: r.id, authorName: r.userName, contentSnippet: r.content.slice(0, 80) })}
                  className="text-[11px] text-gray-400 flex items-center gap-0.5 hover:text-gray-700"
                >
                  <Flag className="w-3 h-3" /> 신고
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const actions = (
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={onTogglePick}
        disabled={busy}
        className={`h-12 rounded-2xl text-[14px] font-black flex items-center justify-center gap-1 disabled:opacity-60 ${picked ? 'bg-black text-[#FFE600]' : 'bg-[#FFE600] text-black'}`}
      >
        {picked ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[3]" />}
        {picked ? '쇼핑리스트에 담음' : '살게요'}
      </button>
      <button onClick={onShow} className="h-12 rounded-2xl bg-gray-100 text-gray-900 text-[14px] font-bold">점원에게 보여주기</button>
    </div>
  );

  const info = (
    <div>
      <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
        <span>{item.brand}</span><span>·</span><span>{item.category}</span>
        {item.badge && <span className="ml-1 px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-500 text-[10.5px] font-bold">{item.badge}</span>}
      </div>
      <h2 className={`${isPc ? 'text-[26px]' : 'text-[21px]'} font-black text-gray-900 leading-snug mt-1`}>{item.name}</h2>
      {item.nameJa && <p className="text-[13px] text-gray-500">{item.nameJa}</p>}
      <p className="mt-2.5 text-[14px] text-gray-600 leading-relaxed">{item.description}</p>
      {item.pickCount > 0 && <p className="mt-1.5 text-[12px] font-bold text-rose-500">{item.pickCount}명이 쇼핑리스트에 담았어요</p>}
    </div>
  );

  const image = (
    <div className={`bg-white flex items-center justify-center ${isPc ? 'aspect-square rounded-2xl border border-gray-100' : 'aspect-[4/3]'}`}>
      {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-6" />}
    </div>
  );

  return (
    <>
      {isPc ? (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-8" onClick={onClose}>
          <div className="relative w-full max-w-[1000px] max-h-[88vh] overflow-y-auto rounded-3xl bg-white p-8" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer" aria-label="닫기"><X className="w-5 h-5" /></button>
            <div className="grid grid-cols-[400px_1fr] gap-8">
              <div className="space-y-4">{image}{actions}</div>
              <div className="space-y-5">{info}{priceBox}{reviewSection}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 z-50 bg-white flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="flex items-center justify-between px-2 h-12 shrink-0 border-b border-gray-100">
            <span className="w-10" />
            <p className="text-[15px] font-black text-gray-900">상품 정보</p>
            <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center active:bg-gray-100" aria-label="닫기"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {image}
            <div className="px-4 pt-4 pb-6 space-y-5">{info}{priceBox}{reviewSection}</div>
          </div>
          <div className="shrink-0 border-t border-gray-100 px-4 pt-3" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>{actions}</div>
        </div>
      )}
      <ReportModal
        target={reportTarget}
        isOpen={Boolean(reportTarget)}
        onClose={() => setReportTarget(null)}
        onReportSuccess={() => { setReportTarget(null); setHiddenTick(t => t + 1); }}
      />
    </>
  );
};
