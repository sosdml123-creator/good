import React, { useMemo, useState } from 'react';
import { Heart, MessageSquare, Flag, ChevronLeft, Send, PenLine, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReportModal, ReportTarget } from '../common/ReportModal';
import { safeLocalStorageGet } from '../../utils/safeStorage';
import { DEFAULT_AVATAR } from '../../utils/avatars';

const TOPICS = ['쇼핑 후기', '질문', '매장 정보', '득템 자랑'] as const;

const timeAgo = (iso: string) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return '방금';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}일 전`;
  return iso.slice(0, 10).replace(/-/g, '.');
};

/** 돈키호테 수다방: 커뮤니티 '돈키호테' 카테고리 글 (모바일·PC 공용, variant 로 배치만 다름) */
export const DonkiTalk: React.FC<{ variant: 'mobile' | 'pc' }> = ({ variant }) => {
  const { communityPosts, addCommunityPost, addPostComment, toggleLikePost, showToast, currentUser, openLoginModal, isGuestBrowse } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [writing, setWriting] = useState(false);
  const [topic, setTopic] = useState<typeof TOPICS[number]>('쇼핑 후기');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [reportTarget, setReportTarget] = useState<ReportTarget | null>(null);
  const [tick, setTick] = useState(0);
  const isPc = variant === 'pc';

  const posts = useMemo(() => {
    const hidden = safeLocalStorageGet<string[]>('sinsangpick_hidden_ids', []);
    const blocked = safeLocalStorageGet<string[]>('sinsangpick_blocked_users', []);
    return communityPosts
      .filter(p => p.category === '돈키호테' && !hidden.includes(p.id) && !blocked.includes(p.author))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [communityPosts, tick]);

  const selected = selectedId ? posts.find(p => p.id === selectedId) : undefined;
  const needLogin = () => {
    if (isGuestBrowse || !currentUser?.uid) { openLoginModal(); return true; }
    return false;
  };

  const submitPost = async () => {
    if (busy || needLogin()) return;
    if (!title.trim() || !content.trim()) return showToast('제목과 내용을 입력해주세요.', 'error');
    setBusy(true);
    try {
      await addCommunityPost('돈키호테', `[${topic}] ${title.trim()}`, content.trim());
      setTitle(''); setContent(''); setWriting(false);
    } finally {
      setBusy(false);
    }
  };

  const submitComment = async () => {
    if (!selected || busy || needLogin()) return;
    if (!comment.trim()) return;
    setBusy(true);
    try {
      await addPostComment(selected.id, comment.trim());
      setComment('');
    } finally {
      setBusy(false);
    }
  };

  const report = (t: ReportTarget) => { if (!needLogin()) setReportTarget(t); };

  const writeForm = (
    <div className={`rounded-2xl bg-white border border-gray-200 ${isPc ? 'p-6' : 'p-4'}`}>
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-black text-gray-900">수다 남기기</p>
        <button onClick={() => setWriting(false)} className="text-gray-400" aria-label="닫기"><X className="w-5 h-5" /></button>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {TOPICS.map(t => (
          <button key={t} onClick={() => setTopic(t)} className={`h-8 px-3 rounded-full text-[12px] font-bold ${topic === t ? 'bg-black text-[#FFE600]' : 'bg-gray-100 text-gray-600'}`}>{t}</button>
        ))}
      </div>
      <input value={title} onChange={e => setTitle(e.target.value)} maxLength={60} placeholder="제목" className="mt-3 w-full h-11 px-3 rounded-xl bg-gray-50 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFE600]" />
      <textarea value={content} onChange={e => setContent(e.target.value)} maxLength={1000} placeholder="돈키호테에서 산 것, 궁금한 것, 매장 꿀팁을 자유롭게 나눠요." className="mt-2 w-full h-28 resize-none px-3 py-2 rounded-xl bg-gray-50 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFE600]" />
      <p className="mt-1 text-[11px] text-gray-400">욕설·광고·개인정보가 담긴 글은 신고되면 숨겨지고 삭제될 수 있어요.</p>
      <button onClick={submitPost} disabled={busy} className="mt-3 w-full h-11 rounded-xl bg-black text-[#FFE600] text-[14px] font-black disabled:opacity-60">{busy ? '올리는 중…' : '올리기'}</button>
    </div>
  );

  const thread = selected && (
    <div className={`rounded-2xl bg-white border border-gray-100 ${isPc ? 'p-7' : 'p-4'}`}>
      <button onClick={() => setSelectedId(null)} className="flex items-center gap-0.5 text-[13px] font-bold text-gray-500 mb-3"><ChevronLeft className="w-4 h-4" /> 목록</button>
      <div className="flex items-center gap-2">
        <img src={selected.authorAvatar || DEFAULT_AVATAR} alt="" className="w-8 h-8 rounded-full object-cover bg-gray-100" />
        <div>
          <p className="text-[13px] font-bold text-gray-900">{selected.author}</p>
          <p className="text-[11px] text-gray-400">{timeAgo(selected.createdAt)}</p>
        </div>
        <button onClick={() => report({ type: 'post', id: selected.id, authorName: selected.author, contentSnippet: selected.title })} className="ml-auto text-[12px] text-gray-400 flex items-center gap-0.5"><Flag className="w-3.5 h-3.5" /> 신고</button>
      </div>
      <h3 className={`mt-3 font-black text-gray-900 ${isPc ? 'text-[22px]' : 'text-[17px]'}`}>{selected.title}</h3>
      <p className="mt-2 text-[14px] text-gray-700 leading-relaxed whitespace-pre-wrap break-words">{selected.content}</p>
      <div className="mt-4 flex gap-2">
        <button onClick={() => !needLogin() && toggleLikePost(selected.id)} className={`h-9 px-3.5 rounded-full border text-[13px] font-bold flex items-center gap-1 ${selected.isLiked ? 'border-rose-300 bg-rose-50 text-rose-500' : 'border-gray-200 text-gray-600'}`}>
          <Heart className={`w-4 h-4 ${selected.isLiked ? 'fill-rose-500' : ''}`} /> {selected.likes || 0}
        </button>
        <span className="h-9 px-3.5 rounded-full border border-gray-200 text-[13px] font-bold text-gray-600 flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {selected.comments?.length || selected.commentsCount || 0}</span>
      </div>
      <div className="mt-4 border-t border-gray-100 pt-3 space-y-3">
        {(selected.comments || []).filter(c => !safeLocalStorageGet<string[]>('sinsangpick_blocked_users', []).includes(c.userName)).map(c => (
          <div key={c.id} className="flex gap-2">
            <img src={c.userAvatar || DEFAULT_AVATAR} alt="" className="w-7 h-7 rounded-full object-cover bg-gray-100 shrink-0" />
            <div className="flex-1 min-w-0 rounded-2xl bg-gray-50 px-3 py-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-bold text-gray-900">{c.userName}</span>
                <span className="text-[10px] text-gray-400">{timeAgo(c.createdAt)}</span>
                <button onClick={() => report({ type: 'comment', id: c.id, authorName: c.userName, contentSnippet: c.content.slice(0, 80) })} className="ml-auto text-gray-300 hover:text-gray-500" aria-label="댓글 신고"><Flag className="w-3 h-3" /></button>
              </div>
              <p className="text-[13px] text-gray-700 whitespace-pre-wrap break-words">{c.content}</p>
            </div>
          </div>
        ))}
        {!(selected.comments && selected.comments.length) && <p className="text-[12px] text-gray-400 text-center py-3">첫 댓글을 남겨보세요.</p>}
      </div>
      <div className="mt-3 flex gap-2">
        <input value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) submitComment(); }} maxLength={300} placeholder="댓글 달기" className="flex-1 h-10 px-4 rounded-full bg-gray-100 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFE600]" />
        <button onClick={submitComment} disabled={busy} className="w-10 h-10 rounded-full bg-black text-[#FFE600] flex items-center justify-center disabled:opacity-60" aria-label="댓글 등록"><Send className="w-4 h-4" /></button>
      </div>
    </div>
  );

  const list = (
    <div className={isPc ? 'grid grid-cols-2 gap-4' : 'space-y-2'}>
      {posts.map(p => (
        <button key={p.id} onClick={() => setSelectedId(p.id)} className={`w-full text-left rounded-2xl bg-white border border-gray-100 hover:border-gray-300 transition-colors ${isPc ? 'p-5' : 'p-4'}`}>
          <p className={`font-bold text-gray-900 line-clamp-1 ${isPc ? 'text-[16px]' : 'text-[14px]'}`}>{p.title}</p>
          <p className="mt-1 text-[13px] text-gray-500 line-clamp-2 leading-snug">{p.content}</p>
          <div className="mt-2.5 flex items-center gap-3 text-[11px] text-gray-400">
            <span className="font-semibold text-gray-600">{p.author}</span>
            <span>{timeAgo(p.createdAt)}</span>
            <span className="ml-auto flex items-center gap-0.5"><Heart className="w-3 h-3" />{p.likes || 0}</span>
            <span className="flex items-center gap-0.5"><MessageSquare className="w-3 h-3" />{p.comments?.length || p.commentsCount || 0}</span>
          </div>
        </button>
      ))}
      {posts.length === 0 && (
        <div className={`py-14 text-center ${isPc ? 'col-span-2' : ''}`}>
          <p className="text-[14px] font-bold text-gray-900">아직 글이 없어요</p>
          <p className="mt-1 text-[12px] text-gray-500">돈키호테 쇼핑 후기나 궁금한 점을 처음으로 남겨보세요.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className={isPc ? 'mt-8' : 'px-4 pt-4'}>
      {!selected && (
        <div className={`flex items-center justify-between ${isPc ? 'mb-5' : 'mb-3'}`}>
          <div>
            <p className={`font-black text-gray-900 ${isPc ? 'text-[22px]' : 'text-[16px]'}`}>돈키 수다방</p>
            <p className="text-[12px] text-gray-500">쇼핑 후기·질문·매장 정보를 함께 나눠요</p>
          </div>
          {!writing && (
            <button onClick={() => !needLogin() && setWriting(true)} className="h-10 px-4 rounded-full bg-[#FFE600] text-black text-[13px] font-black flex items-center gap-1">
              <PenLine className="w-4 h-4" /> 글쓰기
            </button>
          )}
        </div>
      )}
      {writing && !selected && <div className="mb-4">{writeForm}</div>}
      {selected ? thread : list}
      <ReportModal
        target={reportTarget}
        isOpen={Boolean(reportTarget)}
        onClose={() => setReportTarget(null)}
        onReportSuccess={() => { setReportTarget(null); setSelectedId(null); setTick(t => t + 1); }}
      />
    </div>
  );
};
