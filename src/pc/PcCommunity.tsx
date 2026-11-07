import React, { useMemo, useState } from 'react';
import { Flag, Heart, Loader2, MessageSquare, PenLine, RefreshCw, Send, Sparkles, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ReportModal, ReportTarget } from '../components/common/ReportModal';
import { getPopularCommunityPosts } from '../utils/ranking';
import { CommunityPost } from '../types';
import { safeLocalStorageGet } from '../utils/safeStorage';
import { PcContainer, PcEmpty, PcTextTabs } from './PcUi';

const SUB_TABS = ['인기', '꿀조합', '자유게시판', '질문/답변', '돈키호테', '이벤트'] as const;
type SubTab = typeof SUB_TABS[number];
const WRITE_CATEGORIES = ['자유게시판', '질문/답변', '돈키호테', '이벤트'] as const;
type WriteCategory = typeof WRITE_CATEGORIES[number];
const PARTNERS_NOTICE = '\n\n이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.';

const formatDate = (v: unknown) =>
  typeof v === 'string' && v.includes('T') ? new Date(v).toLocaleDateString() : String(v ?? '');

/** PC 수다방: 게시판형 목록 + 가운데 상세 창 (모바일 수다방과 별도) */
export const PcCommunity: React.FC = () => {
  const {
    communityPosts, events, recipes, openRecipeDetail, openWriteRecipe, toggleRecipeLike, openEventDetail,
    toggleLikePost, addCommunityPost, addPostComment, showToast, retrySync, isDataLoading,
  } = useApp();

  const [subTab, setSubTab] = useState<SubTab>('인기');
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<WriteCategory>('자유게시판');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [reportTarget, setReportTarget] = useState<ReportTarget | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const posts = useMemo(() => {
    const blocked = safeLocalStorageGet<string[]>('sinsangpick_blocked_users', []);
    const hidden = safeLocalStorageGet<string[]>('sinsangpick_hidden_ids', []);
    const clean = communityPosts.filter(p => !hidden.includes(p.id) && !blocked.includes(p.author));
    return subTab === '인기' ? getPopularCommunityPosts(clean) : clean.filter(p => p.category === subTab);
  }, [communityPosts, subTab]);

  // 좋아요·댓글이 바로 반영되도록 선택 글은 id로 최신 목록에서 찾습니다.
  const selectedPost: CommunityPost | null = selectedId ? communityPosts.find(p => p.id === selectedId) ?? null : null;

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!newTitle.trim()) return showToast('제목을 입력해주세요.', 'error');
    if (!newContent.trim()) return showToast('내용을 입력해주세요.', 'error');
    try {
      setIsSubmitting(true);
      let content = newContent.trim();
      if (content.includes('coupang.com') && !content.includes('쿠팡 파트너스 활동의 일환')) content += PARTNERS_NOTICE;
      await addCommunityPost(newCategory, newTitle, content);
      setNewTitle('');
      setNewContent('');
      setIsWriteOpen(false);
      showToast('🎉 수다글이 성공적으로 등록되었습니다!', 'success');
    } catch (err) {
      console.error('[Community Post Error]', err);
      showToast('글 등록 중 오류가 발생했습니다. 네트워크를 확인하고 다시 시도해 주세요.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!commentText.trim() || isSubmitting) return;
    try {
      setIsSubmitting(true);
      await addPostComment(postId, commentText.trim());
      setCommentText('');
    } catch (err) {
      console.error('[Comment Error]', err);
      showToast('댓글 등록에 실패했습니다. 다시 시도해 주세요.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <PcContainer className="py-12">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">신상 수다방</h1>
            <p className="mt-1.5 text-[14px] text-gray-500">신상 후기, 꿀조합, 궁금한 점을 회원들과 나눠 보세요.</p>
          </div>
          <button
            onClick={() => (subTab === '꿀조합' ? openWriteRecipe() : setIsWriteOpen(true))}
            className="h-11 px-5 rounded-full bg-gray-900 hover:bg-black text-white text-[14px] font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <PenLine className="w-4 h-4" />
            {subTab === '꿀조합' ? '꿀조합 등록' : '글쓰기'}
          </button>
        </div>

        <div className="mt-8 pb-5 border-b border-gray-200">
          <PcTextTabs items={[...SUB_TABS]} value={subTab} onChange={v => setSubTab(v as SubTab)} />
        </div>

        {subTab === '이벤트' && events.length > 0 && (
          <section className="mt-8">
            <h2 className="flex items-center gap-1.5 text-[18px] font-bold text-gray-900 mb-4">
              <Sparkles className="w-5 h-5 text-amber-500" />
              모집 중인 체험단 · 프로모션
              <span className="ml-1 text-[14px] font-medium text-gray-400">{events.length}</span>
            </h2>
            <div className="grid grid-cols-3 gap-5">
              {events.map(ev => (
                <button
                  key={ev.id}
                  onClick={() => openEventDetail(ev.id)}
                  className="text-left rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="relative aspect-[16/9] bg-gray-900 overflow-hidden">
                    <img src={ev.bannerImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-3 left-3 text-[12px] font-bold text-white bg-gray-900 px-2.5 py-0.5 rounded-full">{ev.badge}</span>
                    <span className="absolute top-3 right-3 text-[12px] font-bold text-amber-300 bg-black/60 px-2.5 py-0.5 rounded-full">{ev.dDay}</span>
                  </div>
                  <div className="p-5">
                    <p className="text-[16px] font-bold text-gray-900 line-clamp-1">{ev.title}</p>
                    <p className="mt-1.5 text-[13px] text-gray-600 line-clamp-1">🎁 {ev.reward}</p>
                    <p className="mt-1 text-[12px] text-gray-400">기간 {ev.startDate} ~ {ev.endDate}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {subTab === '꿀조합' ? (
          recipes.length === 0 ? <PcEmpty message="아직 등록된 꿀조합이 없어요." /> : (
            <div className="mt-8 grid grid-cols-5 gap-5">
              {recipes.map(recipe => (
                <div
                  key={recipe.id}
                  onClick={() => openRecipeDetail(recipe.id)}
                  className="rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <img src={recipe.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-2 left-2 text-[11px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-md">⏱️ {recipe.prepTime}</span>
                    <button
                      onClick={e => { e.stopPropagation(); toggleRecipeLike(recipe.id); }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center cursor-pointer"
                      aria-label="좋아요"
                    >
                      <Heart className={`w-4 h-4 ${recipe.isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-[12px] text-gray-400 truncate">{recipe.author} · {recipe.difficulty}</p>
                    <p className="mt-1 text-[14px] font-semibold text-gray-900 line-clamp-2 leading-snug">{recipe.title}</p>
                    <div className="mt-3 flex items-center justify-between text-[13px]">
                      <span className="font-bold text-gray-900">약 {recipe.totalCost.toLocaleString()}원</span>
                      <span className="text-gray-400">♡ {recipe.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : posts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-[16px] font-semibold text-gray-800">
              {subTab === '인기' ? '아직 등록된 게시글이 없습니다' : `'${subTab}'에 첫 글을 남겨보세요!`}
            </p>
            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                onClick={() => retrySync()}
                disabled={isDataLoading}
                className="h-10 px-5 rounded-full bg-gray-100 hover:bg-gray-200 text-[13px] font-semibold text-gray-700 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isDataLoading ? 'animate-spin' : ''}`} />
                {isDataLoading ? '불러오는 중...' : '새로고침'}
              </button>
              <button onClick={() => setIsWriteOpen(true)} className="h-10 px-5 rounded-full bg-gray-900 text-white text-[13px] font-semibold cursor-pointer">
                글 작성하기
              </button>
            </div>
          </div>
        ) : (
          <table className="mt-2 w-full text-[14px]">
            <thead>
              <tr className="border-b border-gray-900 text-[13px] text-gray-500">
                <th className="w-28 py-3 font-medium">분류</th>
                <th className="py-3 font-medium text-left">제목</th>
                <th className="w-36 py-3 font-medium">작성자</th>
                <th className="w-28 py-3 font-medium">작성일</th>
                <th className="w-20 py-3 font-medium">좋아요</th>
                <th className="w-20 py-3 font-medium">댓글</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id} onClick={() => setSelectedId(p.id)} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <td className="py-4 text-center">
                    <span className="text-[12px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{p.category}</span>
                  </td>
                  <td className="py-4 pr-6">
                    <p className="font-semibold text-gray-900 line-clamp-1">{p.title}</p>
                    <p className="mt-0.5 text-[13px] text-gray-500 line-clamp-1">{p.content}</p>
                  </td>
                  <td className="py-4 text-center text-gray-600 truncate">{p.author}</td>
                  <td className="py-4 text-center text-[13px] text-gray-400">{formatDate(p.createdAt)}</td>
                  <td className="py-4 text-center">
                    <button
                      onClick={e => { e.stopPropagation(); toggleLikePost(p.id); }}
                      className={`inline-flex items-center gap-1 cursor-pointer ${p.isLiked ? 'text-rose-500 font-semibold' : 'text-gray-400 hover:text-rose-500'}`}
                    >
                      <Heart className={`w-4 h-4 ${p.isLiked ? 'fill-rose-500' : ''}`} />
                      {p.likes || 0}
                    </button>
                  </td>
                  <td className="py-4 text-center text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {p.commentsCount || p.comments?.length || 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </PcContainer>

      {/* 글쓰기 창 */}
      {isWriteOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6" onClick={() => !isSubmitting && setIsWriteOpen(false)}>
          <form
            onSubmit={handleCreatePost}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-[640px] bg-white rounded-2xl p-8 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-bold text-gray-900">새 수다글 작성</h2>
              <button type="button" onClick={() => setIsWriteOpen(false)} className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer" aria-label="닫기">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex gap-2">
              {WRITE_CATEGORIES.map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setNewCategory(cat)}
                  className={`h-9 px-4 rounded-full text-[13px] font-semibold border cursor-pointer ${
                    newCategory === cat ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full h-12 border border-gray-200 rounded-xl px-4 text-[15px] outline-none focus:border-gray-900"
            />
            <div>
              <textarea
                rows={9}
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                placeholder="신상에 대한 궁금증, 꿀조합, 솔직한 느낌을 자유롭게 적어보세요!"
                className="w-full border border-gray-200 rounded-xl p-4 text-[15px] leading-relaxed outline-none resize-none focus:border-gray-900"
              />
              <div className="mt-1.5 flex items-center justify-between text-[12px] text-gray-400">
                <span>※ 쿠팡 링크 첨부 시 필수 고지 문구가 자동으로 추가됩니다.</span>
                <button
                  type="button"
                  onClick={() => !newContent.includes('쿠팡 파트너스 활동의 일환') && setNewContent(prev => prev.trim() + PARTNERS_NOTICE)}
                  className="font-semibold text-gray-600 hover:text-gray-900 hover:underline cursor-pointer"
                >
                  + 쿠팡 파트너스 문구 삽입
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" disabled={isSubmitting} onClick={() => setIsWriteOpen(false)} className="h-11 px-6 rounded-xl border border-gray-200 text-[14px] font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer">
                취소
              </button>
              <button type="submit" disabled={isSubmitting} className="h-11 px-8 rounded-xl bg-gray-900 text-white text-[14px] font-semibold hover:bg-black disabled:opacity-50 flex items-center gap-1.5 cursor-pointer">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                등록
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 글 상세 창 */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6" onClick={() => setSelectedId(null)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-[760px] max-h-[88vh] bg-white rounded-2xl shadow-2xl flex flex-col">
            <div className="px-8 pt-7 pb-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{selectedPost.category}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setReportTarget({ type: 'post', id: selectedPost.id, authorName: selectedPost.author, contentSnippet: selectedPost.title });
                      setIsReportOpen(true);
                    }}
                    className="h-8 px-3 rounded-full text-[12px] text-gray-400 hover:text-rose-600 hover:bg-rose-50 flex items-center gap-1 cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    신고·차단
                  </button>
                  <button onClick={() => setSelectedId(null)} className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer" aria-label="닫기">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <h2 className="mt-3 text-[22px] font-bold text-gray-900 leading-snug">{selectedPost.title}</h2>
              <p className="mt-2 text-[13px] text-gray-400">
                <span className="font-semibold text-gray-700">{selectedPost.author}</span> · {formatDate(selectedPost.createdAt)}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6">
              <p className="text-[15px] text-gray-800 whitespace-pre-wrap leading-relaxed [overflow-wrap:anywhere]">{selectedPost.content}</p>
              <button
                onClick={() => toggleLikePost(selectedPost.id)}
                className={`mt-6 h-10 px-4 rounded-full border text-[13px] font-semibold flex items-center gap-1.5 cursor-pointer ${
                  selectedPost.isLiked ? 'border-rose-300 bg-rose-50 text-rose-500' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${selectedPost.isLiked ? 'fill-rose-500' : ''}`} />
                좋아요 {selectedPost.likes || 0}
              </button>

              <h3 className="mt-8 text-[15px] font-bold text-gray-900">
                댓글 {selectedPost.commentsCount || selectedPost.comments?.length || 0}
              </h3>
              <ul className="mt-3 divide-y divide-gray-100">
                {selectedPost.comments && selectedPost.comments.length > 0 ? (
                  selectedPost.comments.map(cm => (
                    <li key={cm.id} className="py-3.5">
                      <p className="text-[13px]">
                        <span className="font-semibold text-gray-900">{cm.userName}</span>
                        <span className="ml-2 text-gray-400">{cm.createdAt}</span>
                      </p>
                      <p className="mt-1 text-[14px] text-gray-700 whitespace-pre-wrap [overflow-wrap:anywhere]">{cm.content}</p>
                    </li>
                  ))
                ) : (
                  <li className="py-6 text-center text-[13px] text-gray-400">등록된 댓글이 없습니다.</li>
                )}
              </ul>
            </div>

            <div className="px-8 py-5 border-t border-gray-100 flex gap-2">
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleAddComment(selectedPost.id); }}
                placeholder="따뜻한 댓글을 남겨보세요"
                className="flex-1 h-11 border border-gray-200 rounded-xl px-4 text-[14px] outline-none focus:border-gray-900"
              />
              <button
                onClick={() => handleAddComment(selectedPost.id)}
                disabled={isSubmitting || !commentText.trim()}
                className="h-11 px-5 rounded-xl bg-gray-900 text-white text-[14px] font-semibold flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                등록
              </button>
            </div>
          </div>
        </div>
      )}

      <ReportModal
        target={reportTarget}
        isOpen={isReportOpen}
        onClose={() => { setIsReportOpen(false); setReportTarget(null); }}
        onReportSuccess={() => setSelectedId(null)}
      />
    </div>
  );
};
