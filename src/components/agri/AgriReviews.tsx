import React, { useMemo, useState } from 'react';
import { Bookmark, ChevronDown, ChevronRight, Flag, Heart, MessageCircle, ReceiptText, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Review } from '../../types';
import { ReportModal, ReportTarget } from '../common/ReportModal';
import { useAgri } from './AgriContext';
import { fmtDot, isFreshProduct, isMarketItemProduct, itemNameForProduct, relTime, reviewMetrics, won } from './agriModel';
import { C, Empty, Stars, Thumb, TopBar } from './AgriUi';

type Sort = 'latest' | 'popular';


const Avatar: React.FC<{ src?: string; name: string; size?: number }> = ({ src, name, size = 32 }) => {
  const [failed, setFailed] = useState(false);
  if (!src || failed || src.startsWith('/logo')) {
    return <span style={{ width: size, height: size }} className="shrink-0 rounded-full bg-[#ECEEF0] flex items-center justify-center text-[12px] font-semibold text-[#5A626B]">{name.slice(0, 1)}</span>;
  }
  return <img src={src} alt="" onError={() => setFailed(true)} style={{ width: size, height: size }} className="shrink-0 rounded-full object-cover bg-[#ECEEF0]" />;
};

const PurchaseLine: React.FC<{ review: Review }> = ({ review }) => {
  const bits = [
    review.purchasePrice ? `${review.purchasePrice.toLocaleString('ko-KR')}원 구매` : null,
    review.purchasePlace || null,
    review.purchaseEvent && review.purchaseEvent !== '정가 구매' ? review.purchaseEvent : null,
  ].filter(Boolean);
  return (
    <p className="text-[12.5px] text-[#5A626B] truncate">
      <span className="font-semibold text-[#191C20]">{review.productName}</span>
      {bits.length > 0 && <span> · {bits.join(' · ')}</span>}
    </p>
  );
};

const MetricInline: React.FC<{ review: Review }> = ({ review }) => {
  const parts = reviewMetrics(review).map(([l, v]) => `${l} ${v}`);
  return parts.length ? <span className="text-[12px] text-[#5A626B]">{parts.join(' · ')}</span> : null;
};

const FeedItem: React.FC<{ review: Review }> = ({ review }) => {
  const { openReview, savedReviews, toggleSaveReview } = useAgri();
  const { toggleLikeReview } = useApp();
  const imgs = review.images || [];
  const saved = savedReviews.includes(review.id);
  return (
    <article className="border-b border-[#ECEEF0] pt-4 pb-2">
      <div className="px-4 flex items-center gap-2.5">
        <Avatar src={review.userAvatar} name={review.userName} />
        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] font-semibold text-[#191C20] truncate">{review.userName}</p>
          <p className="text-[11.5px] text-[#8A929A]">{review.userLevel ? `${review.userLevel} · ` : ''}{relTime(review.createdAt)}</p>
        </div>
        {review.isReceiptVerified && (
          <span className="shrink-0 flex items-center gap-1 text-[11.5px] text-[#1F6B62]"><ReceiptText className="w-3.5 h-3.5" />영수증 인증</span>
        )}
      </div>
      <button onClick={() => openReview(review.id)} className="block w-full text-left mt-2.5">
        {imgs.length > 0 && (
          <div className={`px-4 grid gap-1 ${imgs.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {imgs.slice(0, 2).map((src, i) => (
              <span key={src + i} className="relative block">
                <img src={src} alt="" loading="lazy" className={`w-full ${imgs.length === 1 ? 'aspect-[4/3]' : 'aspect-square'} object-cover rounded-[6px] bg-[#F1F2F4]`} />
                {i === 1 && imgs.length > 2 && <span className="absolute right-1.5 bottom-1.5 px-1.5 rounded-[3px] bg-black/55 text-white text-[11px] leading-5">+{imgs.length - 2}</span>}
              </span>
            ))}
          </div>
        )}
        <div className="px-4 mt-2.5">
          <PurchaseLine review={review} />
          <p className="mt-1.5 flex items-center gap-2"><Stars value={review.rating} /><MetricInline review={review} /></p>
          {review.headline && <p className="mt-1.5 text-[15px] font-semibold text-[#191C20]">{review.headline}</p>}
          <p className="mt-1 text-[14px] leading-[1.6] text-[#3B4249] line-clamp-3 whitespace-pre-line">{review.content}</p>
        </div>
      </button>
      <div className="px-2 mt-1 flex items-center text-[13px] text-[#5A626B]">
        <button onClick={() => toggleLikeReview(review.id)} aria-pressed={!!review.isLiked} className="h-10 px-2 flex items-center gap-1">
          <Heart className="w-[18px] h-[18px]" strokeWidth={1.8} color={review.isLiked ? C.up : '#5A626B'} fill={review.isLiked ? C.up : 'none'} />
          <span className="tabular-nums">{review.likes || '좋아요'}</span>
        </button>
        <button onClick={() => openReview(review.id)} className="h-10 px-2 flex items-center gap-1">
          <MessageCircle className="w-[18px] h-[18px]" strokeWidth={1.8} />
          <span className="tabular-nums">{review.commentsCount || review.comments?.length || '댓글'}</span>
        </button>
        <span className="flex-1" />
        <button onClick={() => toggleSaveReview(review.id)} aria-pressed={saved} aria-label={saved ? '저장 취소' : '후기 저장'} className="h-10 px-2 flex items-center">
          <Bookmark className="w-[18px] h-[18px]" strokeWidth={1.8} color={saved ? C.teal : '#5A626B'} fill={saved ? C.teal : 'none'} />
        </button>
      </div>
    </article>
  );
};

/** 실구매 후기 피드: 사진 후기/전체, 최신순/인기순, 품목 필터 */
export const AgriReviews: React.FC = () => {
  const { reviews, reviewItem, setReviewItem, products, openPrices } = useAgri();
  const [photoOnly, setPhotoOnly] = useState(false);
  const [sort, setSort] = useState<Sort>('latest');

  const list = useMemo(() => {
    const byItem = reviewItem
      ? reviews.filter(r => itemNameForProduct(products.find(p => p.id === r.productId)) === reviewItem)
      : reviews;
    const filtered = photoOnly ? byItem.filter(r => (r.images?.length || 0) > 0) : byItem;
    return [...filtered].sort((a, b) =>
      sort === 'popular'
        ? (b.likes + (b.commentsCount || 0)) - (a.likes + (a.commentsCount || 0)) || b.createdAt.localeCompare(a.createdAt)
        : b.createdAt.localeCompare(a.createdAt));
  }, [reviews, reviewItem, photoOnly, sort, products]);

  const photoCount = reviews.filter(r => (r.images?.length || 0) > 0).length;

  return (
    <div className="bg-white min-h-full pb-24">
      <header className="sticky top-0 z-20 bg-white border-b border-[#ECEEF0]">
        <div className="flex items-center h-12 px-4">
          <h1 className="flex-1 text-[18px] font-bold text-[#191C20] tracking-[-0.02em]">실구매 후기</h1>
          <span className="text-[12px] text-[#8A929A]">농수산물 후기 {reviews.length}개</span>
        </div>
        <div className="flex items-center gap-1.5 px-4 pb-2.5">
          {reviewItem && (
            <button onClick={() => setReviewItem(null)} className="shrink-0 h-8 pl-3 pr-2 rounded-[6px] bg-[#191C20] text-white text-[13px] flex items-center gap-1">
              {reviewItem}<X className="w-3.5 h-3.5" />
            </button>
          )}
          {([[false, '전체'], [true, `사진 후기${photoCount ? ` ${photoCount}` : ''}`]] as const).map(([v, label]) => (
            <button
              key={String(v)}
              onClick={() => setPhotoOnly(v)}
              aria-pressed={photoOnly === v}
              className={`shrink-0 h-8 px-3 rounded-[6px] text-[13px] border ${photoOnly === v ? 'border-[#1F6B62] bg-[#EDF4F2] text-[#1F6B62] font-semibold' : 'border-[#E3E5E8] text-[#5A626B]'}`}
            >
              {label}
            </button>
          ))}
          <span className="flex-1" />
          <label className="relative flex items-center text-[13px] text-[#5A626B]">
            <select value={sort} onChange={e => setSort(e.target.value as Sort)} aria-label="정렬" className="appearance-none bg-transparent pr-4 outline-none">
              <option value="latest">최신순</option>
              <option value="popular">인기순</option>
            </select>
            <ChevronDown className="absolute right-0 w-3.5 h-3.5 pointer-events-none" />
          </label>
        </div>
      </header>

      {list.map(r => <FeedItem key={r.id} review={r} />)}
      {list.length === 0 && (
        <Empty
          title={reviews.length === 0 ? '아직 등록된 농수산물 후기가 없어요' : '조건에 맞는 후기가 없어요'}
          desc={reviews.length > 0
            ? '필터를 바꿔 보세요.'
            : products.some(p => isFreshProduct(p) || isMarketItemProduct(p))
              ? '신상픽 회원이 직접 산 농수산물 후기만 보여 드려요. 시세에서 품목을 열고 ‘구매 후기 쓰기’로 첫 후기를 남겨 주세요.'
              : '신상픽 회원이 직접 산 농수산물 후기만 보여 드려요. 후기를 남길 수 있는 농수산물 상품이 등록되면 품목 상세에서 바로 쓸 수 있어요.'}
          action={reviews.length === 0 ? (
            <button onClick={() => openPrices({})} className="h-10 px-4 rounded-[8px] border border-[#DADDE1] text-[14px] font-semibold text-[#191C20]">시세에서 품목 찾기</button>
          ) : undefined}
        />
      )}
      {list.length > 0 && <p className="px-4 py-5 text-[11.5px] leading-relaxed text-[#8A929A]">신상픽 회원이 직접 작성한 후기예요. 광고·협찬 후기는 운영 정책에 따라 숨김 처리돼요. 문제가 있는 후기는 상세 화면에서 신고할 수 있어요.</p>}
    </div>
  );
};

/** 후기 상세: 사진, 구매 정보, 항목별 평가, 본문, 좋아요·댓글·저장, 신고 */
export const AgriReviewDetail: React.FC<{ id: string }> = ({ id }) => {
  const { reviews, back, savedReviews, toggleSaveReview, products, items, openItem, photo } = useAgri();
  const { toggleLikeReview, addReviewComment, currentUser, openLoginModal } = useApp();
  const review = reviews.find(r => r.id === id);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [report, setReport] = useState<ReportTarget | null>(null);
  const [imgIdx, setImgIdx] = useState(0);

  if (!review) {
    return (
      <div className="bg-white min-h-full">
        <TopBar title="후기" onBack={back} />
        <Empty title="후기를 찾을 수 없어요" desc="삭제되었거나 숨김 처리된 후기예요." />
      </div>
    );
  }

  const product = products.find(p => p.id === review.productId);
  const itemName = itemNameForProduct(product);
  const marketItem = itemName ? items.find(i => i.rep.itemName === itemName) : undefined;
  const imgs = review.images || [];
  const saved = savedReviews.includes(review.id);
  const comments = review.comments || [];
  const loggedIn = !currentUser.isAnonymous;

  const send = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      await addReviewComment(review.id, text.trim());
      setText('');
    } catch {
      /* 로그인 필요 시 로그인 창이 열립니다 */
    } finally {
      setSending(false);
    }
  };

  const purchase: [string, string | null][] = [
    ['구매 가격', review.purchasePrice ? won(review.purchasePrice) : null],
    ['구매처', review.purchasePlace || null],
    ['구매 방식', review.purchaseEvent || null],
    ['재구매', review.repurchaseIntent || null],
    ['작성일', fmtDot(review.createdAt)],
  ];

  return (
    <div className="bg-white min-h-full pb-24">
      <TopBar
        title="후기"
        onBack={back}
        right={
          <>
            <button onClick={() => toggleSaveReview(review.id)} aria-pressed={saved} aria-label={saved ? '저장 취소' : '후기 저장'} className="w-10 h-10 flex items-center justify-center">
              <Bookmark className="w-[21px] h-[21px]" strokeWidth={1.8} color={saved ? C.teal : C.ink} fill={saved ? C.teal : 'none'} />
            </button>
            <button
              onClick={() => setReport({ type: 'review', id: review.id, authorName: review.userName, contentSnippet: review.content })}
              aria-label="후기 신고 및 작성자 차단"
              className="w-10 h-10 flex items-center justify-center"
            >
              <Flag className="w-[19px] h-[19px]" strokeWidth={1.8} color={C.sub} />
            </button>
          </>
        }
      />

      {imgs.length > 0 && (
        <div className="relative">
          <div
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
            onScroll={e => setImgIdx(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
          >
            {imgs.map((src, i) => <img key={src + i} src={src} alt={`후기 사진 ${i + 1}`} className="w-full shrink-0 snap-center aspect-square object-cover bg-[#F1F2F4]" />)}
          </div>
          {imgs.length > 1 && <span className="absolute right-3 bottom-3 px-2 rounded-full bg-black/55 text-white text-[11.5px] leading-6 tabular-nums">{imgIdx + 1} / {imgs.length}</span>}
        </div>
      )}

      <section className="px-4 pt-4">
        <div className="flex items-center gap-2.5">
          <Avatar src={review.userAvatar} name={review.userName} size={36} />
          <div className="flex-1 min-w-0">
            <p className="text-[14.5px] font-semibold text-[#191C20]">{review.userName}</p>
            <p className="text-[12px] text-[#8A929A]">{review.userLevel ? `${review.userLevel} · ` : ''}{relTime(review.createdAt)}</p>
          </div>
          {review.isReceiptVerified && <span className="flex items-center gap-1 text-[12px] text-[#1F6B62]"><ReceiptText className="w-4 h-4" />영수증 인증</span>}
        </div>
      </section>

      {/* 구매한 품목 → 시세 연결 */}
      <button
        onClick={() => marketItem && openItem(marketItem.id)}
        disabled={!marketItem}
        className="mx-4 mt-4 w-[calc(100%-32px)] flex items-center gap-3 p-2.5 rounded-[8px] border border-[#ECEEF0] text-left disabled:cursor-default"
      >
        <Thumb src={product?.image || (marketItem ? photo(marketItem.rep) : null)} name={review.productName} size={44} />
        <span className="flex-1 min-w-0">
          <span className="block text-[13.5px] text-[#191C20] truncate">{review.productName}</span>
          {marketItem ? (
            <span className="block text-[12px] text-[#5A626B]">오늘 {marketItem.rep.itemName} 시세 {won(marketItem.rep.today)} / {marketItem.rep.unit}</span>
          ) : <span className="block text-[12px] text-[#8A929A]">공시 시세가 없는 품목이에요</span>}
        </span>
        {marketItem && <ChevronRight className="w-4 h-4 text-[#8A929A]" />}
      </button>

      <dl className="mx-4 mt-3 grid grid-cols-[72px_1fr] gap-y-1.5 text-[13.5px]">
        {purchase.filter(([, v]) => v).map(([k, v]) => (
          <React.Fragment key={k}>
            <dt className="text-[#8A929A]">{k}</dt>
            <dd className="text-[#191C20]">{v}</dd>
          </React.Fragment>
        ))}
      </dl>

      <section className="mx-4 mt-4 pt-4 border-t border-[#F1F2F4]">
        <div className="flex items-center gap-2">
          <Stars value={review.rating} size={15} />
          <span className="text-[15px] font-bold tabular-nums text-[#191C20]">{review.rating.toFixed(1)}</span>
        </div>
        {reviewMetrics(review).length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2">
            {reviewMetrics(review).map(([l, v]) => {
              return (
                <div key={l} className="flex items-center gap-2 text-[12.5px]">
                  <span className="w-10 text-[#5A626B]">{l}</span>
                  <span className="flex-1 h-1 rounded-full bg-[#ECEEF0] overflow-hidden"><span className="block h-full bg-[#1F6B62]" style={{ width: `${(v / 5) * 100}%` }} /></span>
                  <span className="w-5 text-right tabular-nums text-[#191C20]">{v || '-'}</span>
                </div>
              );
            })}
          </div>
        )}
        {review.headline && <p className="mt-4 text-[16px] font-semibold text-[#191C20]">{review.headline}</p>}
        <p className="mt-2 text-[15px] leading-[1.7] text-[#2B3137] whitespace-pre-line">{review.content}</p>
        {review.tags && review.tags.length > 0 && (
          <p className="mt-3 flex flex-wrap gap-1.5">{review.tags.map(t => <span key={t} className="px-2 h-6 leading-6 rounded-[4px] bg-[#F3F4F6] text-[12px] text-[#5A626B]">{t}</span>)}</p>
        )}
      </section>

      <div className="mx-4 mt-4 flex items-center border-y border-[#F1F2F4] text-[13.5px] text-[#3B4249]">
        <button onClick={() => toggleLikeReview(review.id)} aria-pressed={!!review.isLiked} className="h-11 pr-4 flex items-center gap-1.5">
          <Heart className="w-[19px] h-[19px]" strokeWidth={1.8} color={review.isLiked ? C.up : C.sub} fill={review.isLiked ? C.up : 'none'} />
          도움돼요 <span className="tabular-nums">{review.likes}</span>
        </button>
        <span className="flex items-center gap-1.5"><MessageCircle className="w-[19px] h-[19px]" strokeWidth={1.8} color={C.sub} />댓글 <span className="tabular-nums">{comments.length}</span></span>
      </div>

      <section className="px-4 pt-3" aria-label="댓글">
        {comments.length === 0 && <p className="py-4 text-[13px] text-[#8A929A]">첫 댓글로 궁금한 점을 물어보세요.</p>}
        {comments.map(c => (
          <div key={c.id} className="flex gap-2.5 py-3 border-b border-[#F7F8F9] last:border-b-0">
            <Avatar src={c.userAvatar} name={c.userName} size={28} />
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px]"><span className="font-semibold text-[#191C20]">{c.userName}</span> <span className="text-[#8A929A]">{relTime(c.createdAt)}</span></p>
              <p className="mt-0.5 text-[14px] leading-[1.55] text-[#2B3137] whitespace-pre-line">{c.content}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-center">
        <div className="w-full max-w-[430px] bg-white border-t border-[#ECEEF0] px-3 pt-2 pb-[max(env(safe-area-inset-bottom),8px)]">
          {loggedIn ? (
            <div className="flex items-center gap-2">
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) send(); }}
                placeholder="댓글을 남겨 주세요"
                aria-label="댓글 입력"
                maxLength={300}
                className="flex-1 h-10 px-3 rounded-[8px] bg-[#F3F4F6] text-[14px] outline-none"
              />
              <button onClick={send} disabled={!text.trim() || sending} className="h-10 px-3.5 rounded-[8px] text-[14px] font-semibold text-[#1F6B62] disabled:text-[#C3C8CD]">등록</button>
            </div>
          ) : (
            <button onClick={openLoginModal} className="w-full h-10 rounded-[8px] bg-[#F3F4F6] text-[14px] text-[#5A626B]">로그인하고 댓글 남기기</button>
          )}
        </div>
      </div>

      <ReportModal target={report} isOpen={report !== null} onClose={() => setReport(null)} />
    </div>
  );
};
