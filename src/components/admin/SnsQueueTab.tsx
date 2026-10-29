import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Clock,
  Copy,
  Edit3,
  Image as ImageIcon,
  Instagram,
  MessageCircle,
  RefreshCw,
  RotateCcw,
  Trash2,
  Video,
  X,
} from 'lucide-react';
import { supabase } from '../../services/supabase';

// 인스타·스레드·틱톡 예약 게시 큐 (sns_posts).
// 글과 이미지·영상은 로컬 SNS 플러그인(D:\sinsangpick-sns)이 draft로 올리고,
// 여기서 승인하면 서버(pg_cron → sns-publish)가 1분마다 확인해 예약 시간에 게시한다.
// 틱톡은 계정 연결을 이 탭에서 하고, 영상은 틱톡 받은편지함으로 올라가 틱톡 앱에서 게시를 마무리한다.

type SnsStatus = 'draft' | 'approved' | 'publishing' | 'published' | 'failed';

interface SnsPost {
  id: string;
  channel: 'instagram' | 'threads' | 'tiktok';
  account: 'kr' | 'jp';
  scheduled_at: string;
  text: string;
  image_url: string | null;
  image_urls: string[] | null;
  topic: string | null;
  status: SnsStatus;
  approved_at: string | null;
  published_at: string | null;
  post_id: string | null;
  error: string | null;
}

// sns-tiktok 함수의 status 응답 (토큰은 내려오지 않는다)
interface TikTokStatus {
  app_ready: boolean;
  connected: boolean;
  display_name: string | null;
  open_id: string | null;
  post_mode: 'inbox' | 'direct';
  privacy_level: string;
  refresh_expires_at: string | null;
}

type Filter = 'all' | SnsStatus;

// 사진 목록: 여러 장이면 image_urls, 한 장이면 image_url
const mediaOf = (p: SnsPost): string[] =>
  p.image_urls && p.image_urls.length ? p.image_urls : p.image_url ? [p.image_url] : [];

// 게시 형식 라벨: 인스타는 1장=릴스, 여러 장=캐러셀 / 스레드는 1장=이미지, 여러 장=캐러셀
const formatLabel = (p: SnsPost) => {
  const n = mediaOf(p).length;
  if (p.channel === 'tiktok') return `영상 · 사진 ${n}장`;
  if (!n) return '텍스트';
  if (p.channel === 'instagram') return n === 1 ? '릴스' : `캐러셀 ${n}장`;
  return n === 1 ? '사진 1장' : `캐러셀 ${n}장`;
};

const STATUS_LABEL: Record<SnsStatus, string> = {
  draft: '승인 대기',
  approved: '예약됨',
  publishing: '게시 중',
  published: '게시 완료',
  failed: '실패',
};

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'draft', label: '승인 대기' },
  { id: 'approved', label: '예약됨' },
  { id: 'published', label: '게시 완료' },
  { id: 'failed', label: '실패' },
];

const kstDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul', month: 'long', day: 'numeric', weekday: 'short' });
const kstTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit' });

// datetime-local 입력값(KST) <-> ISO
const toLocalInput = (iso: string) => {
  const d = new Date(new Date(iso).getTime() + 9 * 3600 * 1000);
  return d.toISOString().slice(0, 16);
};
const fromLocalInput = (v: string) => new Date(`${v}:00+09:00`).toISOString();

interface SnsQueueTabProps {
  isDark: boolean;
}

export const SnsQueueTab: React.FC<SnsQueueTabProps> = ({ isDark }) => {
  const [posts, setPosts] = useState<SnsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftText, setDraftText] = useState('');
  const [draftTime, setDraftTime] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ urls: string[]; index: number } | null>(null);
  const [tiktok, setTiktok] = useState<TikTokStatus | null>(null);
  const [tiktokError, setTiktokError] = useState<string | null>(null);
  const [tiktokBusy, setTiktokBusy] = useState(false);

  const card = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const muted = isDark ? 'text-slate-400' : 'text-slate-500';
  const strong = isDark ? 'text-white' : 'text-slate-900';
  const input = isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900';

  const load = useCallback(async () => {
    if (!supabase) {
      setError('Supabase 연결이 없습니다.');
      setLoading(false);
      return;
    }
    const { data, error: e } = await supabase.from('sns_posts').select('*').order('scheduled_at');
    if (e) setError(e.message);
    else {
      setError(null);
      setPosts((data ?? []) as SnsPost[]);
    }
    setLoading(false);
  }, []);

  const loadTiktok = useCallback(async () => {
    if (!supabase) return;
    const { data, error: e } = await supabase.functions.invoke('sns-tiktok', { body: { action: 'status' } });
    if (e) setTiktokError(e.message);
    else {
      setTiktokError(null);
      setTiktok(data as TikTokStatus);
    }
  }, []);

  useEffect(() => {
    load();
    loadTiktok();
    const t = setInterval(() => {
      load();
      loadTiktok();
    }, 60_000);
    return () => clearInterval(t);
  }, [load, loadTiktok]);

  const update = async (id: string, patch: Partial<SnsPost>) => {
    if (!supabase) return;
    setBusyId(id);
    const { error: e } = await supabase.from('sns_posts').update(patch).eq('id', id);
    setBusyId(null);
    if (e) setError(`저장 실패: ${e.message}`);
    else await load();
  };

  const remove = async (p: SnsPost) => {
    if (!supabase || !window.confirm('이 글을 큐에서 삭제할까요? (이미 게시된 글은 인스타·스레드에서 지워지지 않아요)')) return;
    setBusyId(p.id);
    const { error: e } = await supabase.from('sns_posts').delete().eq('id', p.id);
    setBusyId(null);
    if (e) setError(`삭제 실패: ${e.message}`);
    else await load();
  };

  const approveAllDrafts = async () => {
    const drafts = posts.filter((p) => p.status === 'draft');
    if (!supabase || !drafts.length) return;
    if (!window.confirm(`승인 대기 ${drafts.length}건을 모두 승인할까요? 예약 시간에 자동으로 게시됩니다.`)) return;
    const { error: e } = await supabase.from('sns_posts').update({ status: 'approved' }).eq('status', 'draft');
    if (e) setError(`승인 실패: ${e.message}`);
    await load();
  };

  const startEdit = (p: SnsPost) => {
    setEditingId(p.id);
    setDraftText(p.text);
    setDraftTime(toLocalInput(p.scheduled_at));
  };

  const saveEdit = async (p: SnsPost) => {
    await update(p.id, { text: draftText, scheduled_at: fromLocalInput(draftTime) });
    setEditingId(null);
  };

  // 틱톡 로그인은 새 창에서 연다. 창을 먼저 열어 두어야 팝업 차단을 피한다
  const connectTiktok = async () => {
    if (!supabase) return;
    const win = window.open('', '_blank');
    setTiktokBusy(true);
    const { data, error: e } = await supabase.functions.invoke('sns-tiktok', { body: { action: 'start' } });
    setTiktokBusy(false);
    if (e || !data?.url) {
      win?.close();
      setError(`틱톡 연결을 시작하지 못했습니다: ${e?.message ?? data?.error ?? '알 수 없는 오류'}`);
      return;
    }
    if (win) win.location.href = data.url;
    else setError('팝업이 차단되었습니다. 브라우저에서 팝업을 허용한 뒤 다시 눌러 주세요.');
  };

  const disconnectTiktok = async () => {
    if (!supabase || !window.confirm('틱톡 계정 연결을 해제할까요? 연결이 끊긴 동안 틱톡 글은 실패로 남습니다.')) return;
    setTiktokBusy(true);
    await supabase.functions.invoke('sns-tiktok', { body: { action: 'disconnect' } });
    setTiktokBusy(false);
    await loadTiktok();
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: posts.length };
    for (const p of posts) c[p.status] = (c[p.status] ?? 0) + 1;
    return c;
  }, [posts]);

  const groups = useMemo(() => {
    const list = filter === 'all' ? posts : posts.filter((p) => p.status === filter);
    const m = new Map<string, SnsPost[]>();
    for (const p of list) {
      const k = kstDate(p.scheduled_at);
      m.set(k, [...(m.get(k) ?? []), p]);
    }
    return [...m.entries()];
  }, [posts, filter]);

  const statusClass = (s: SnsStatus) =>
    ({
      draft: 'bg-amber-100 text-amber-800',
      approved: 'bg-indigo-100 text-indigo-700',
      publishing: 'bg-sky-100 text-sky-700',
      published: 'bg-emerald-100 text-emerald-700',
      failed: 'bg-rose-100 text-rose-700',
    })[s];

  return (
    <div className="space-y-5">
      <div className={`rounded-2xl border p-5 ${card}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className={`text-lg font-bold ${strong}`}>인스타·스레드·틱톡 예약 게시</h2>
            <p className={`text-xs mt-1 ${muted}`}>
              SNS 플러그인이 만든 글이 여기 올라옵니다. 승인한 글은 서버가 1분마다 확인해서 예약 시간에 자동 게시해요 (PC가 꺼져 있어도 됩니다).
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={load}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border ${input}`}
            >
              <RefreshCw className="w-3.5 h-3.5" /> 새로고침
            </button>
            <button
              onClick={approveAllDrafts}
              disabled={!counts.draft}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white disabled:opacity-40"
            >
              <Check className="w-3.5 h-3.5" /> 대기 {counts.draft ?? 0}건 모두 승인
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                filter === f.id ? 'bg-indigo-600 text-white border-indigo-600' : `${input}`
              }`}
            >
              {f.label} {counts[f.id] ?? 0}
            </button>
          ))}
        </div>
      </div>

      <div className={`rounded-2xl border p-5 ${card}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className={`text-sm font-bold ${strong}`}>틱톡 계정</h3>
            <p className={`text-xs mt-1 ${muted}`}>
              {tiktokError
                ? `상태를 불러오지 못했어요: ${tiktokError}`
                : !tiktok
                  ? '불러오는 중…'
                  : !tiktok.app_ready
                    ? 'PC에서 node tiktok-cli.cjs set-app 으로 틱톡 앱 키를 먼저 저장하세요.'
                    : tiktok.connected
                      ? `연결됨 · ${tiktok.display_name ? `@${tiktok.display_name}` : tiktok.open_id ?? ''} · ${tiktok.post_mode === 'direct' ? '바로 게시 모드' : '받은편지함 모드 (틱톡 앱에서 게시 마무리)'}`
                      : '연결 안 됨 · 연결하면 예약 시간에 영상이 틱톡으로 올라갑니다.'}
            </p>
          </div>
          <div className="flex gap-2">
            {tiktok?.connected && (
              <button
                onClick={disconnectTiktok}
                disabled={tiktokBusy}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border ${input}`}
              >
                <X className="w-3.5 h-3.5" /> 연결 해제
              </button>
            )}
            <button
              onClick={connectTiktok}
              disabled={tiktokBusy || !tiktok?.app_ready}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-black text-white disabled:opacity-40"
            >
              <Video className="w-3.5 h-3.5" /> {tiktok?.connected ? '다시 연결' : '틱톡 계정 연결'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          <AlertTriangle className="w-4 h-4" /> {error}
        </div>
      )}

      {loading ? (
        <p className={`text-sm ${muted}`}>불러오는 중…</p>
      ) : groups.length === 0 ? (
        <div className={`rounded-2xl border p-10 text-center text-sm ${card} ${muted}`}>
          표시할 글이 없어요. Claude Code에서 <b>/sinsangpick-sns:make-week</b>로 일주일치 콘텐츠를 만들 수 있어요.
        </div>
      ) : (
        groups.map(([day, list]) => (
          <section key={day} className="space-y-3">
            <h3 className={`text-sm font-bold ${strong}`}>{day}</h3>
            {list.map((p) => {
              const editing = editingId === p.id;
              const locked = p.status === 'publishing' || p.status === 'published';
              return (
                <article key={p.id} className={`rounded-2xl border p-4 flex gap-4 ${card}`}>
                  <button
                    onClick={() => mediaOf(p).length && setPreview({ urls: mediaOf(p), index: 0 })}
                    className={`shrink-0 w-24 h-[170px] rounded-xl overflow-hidden border flex items-center justify-center ${
                      isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    {mediaOf(p).length ? (
                      <img src={mediaOf(p)[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className={`flex flex-col items-center gap-1 text-[10px] ${muted}`}>
                        <ImageIcon className="w-4 h-4" /> 텍스트만
                      </span>
                    )}
                  </button>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-bold ${
                          p.channel === 'instagram'
                            ? p.account === 'jp' ? 'bg-violet-100 text-violet-700' : 'bg-pink-100 text-pink-700'
                            : p.channel === 'tiktok' ? 'bg-black text-white' : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {p.channel === 'instagram' ? <Instagram className="w-3 h-3" /> : p.channel === 'tiktok' ? <Video className="w-3 h-3" /> : <MessageCircle className="w-3 h-3" />}
                        {p.channel === 'instagram' ? (p.account === 'jp' ? '인스타 JP' : '인스타') : p.channel === 'tiktok' ? '틱톡' : '스레드'}
                      </span>
                      <span className={`flex items-center gap-1 font-semibold ${strong}`}>
                        <Clock className="w-3 h-3" /> {kstTime(p.scheduled_at)}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full font-bold ${statusClass(p.status)}`}>{STATUS_LABEL[p.status]}</span>
                      <span className={`px-2 py-0.5 rounded-full font-semibold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{formatLabel(p)}</span>
                      {p.published_at && <span className={muted}>게시 {kstDate(p.published_at)} {kstTime(p.published_at)}</span>}
                    </div>

                    {editing ? (
                      <div className="space-y-2">
                        <input
                          type="datetime-local"
                          value={draftTime}
                          onChange={(e) => setDraftTime(e.target.value)}
                          className={`px-3 py-1.5 rounded-lg border text-xs ${input}`}
                        />
                        <textarea
                          value={draftText}
                          onChange={(e) => setDraftText(e.target.value)}
                          rows={8}
                          className={`w-full px-3 py-2 rounded-lg border text-xs leading-relaxed ${input}`}
                        />
                        <p className={`text-[11px] ${muted}`}>
                          {[...draftText].length}자{p.channel === 'threads' ? ' / 500자' : p.channel === 'tiktok' ? ' / 2200자' : ''}
                        </p>
                      </div>
                    ) : (
                      <p className={`text-xs leading-relaxed whitespace-pre-wrap ${strong}`}>{p.text}</p>
                    )}

                    {p.error && (
                      <p className="text-[11px] text-rose-600 flex items-start gap-1">
                        <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" /> {p.error}
                      </p>
                    )}

                    {p.channel === 'tiktok' && (
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => navigator.clipboard?.writeText(p.text)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border ${input}`}
                        >
                          <Copy className="w-3 h-3" /> 캡션 복사
                        </button>
                        {p.status === 'published' && p.post_id?.startsWith('inbox:') && (
                          <span className={`text-[11px] ${muted}`}>틱톡 앱 알림에서 캡션을 붙여넣고 게시하세요</span>
                        )}
                      </div>
                    )}
                    {!locked && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {editing ? (
                          <>
                            <button
                              onClick={() => saveEdit(p)}
                              disabled={busyId === p.id || (p.channel === 'threads' && [...draftText].length > 500) || (p.channel === 'tiktok' && [...draftText].length > 2200)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white disabled:opacity-40"
                            >
                              저장
                            </button>
                            <button onClick={() => setEditingId(null)} className={`px-3 py-1.5 rounded-lg text-xs border ${input}`}>
                              취소
                            </button>
                          </>
                        ) : (
                          <>
                            {p.status === 'draft' && (
                              <button
                                onClick={() => update(p.id, { status: 'approved' })}
                                disabled={busyId === p.id}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white"
                              >
                                <Check className="w-3 h-3" /> 승인
                              </button>
                            )}
                            {p.status === 'approved' && (
                              <button
                                onClick={() => update(p.id, { status: 'draft' })}
                                disabled={busyId === p.id}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border ${input}`}
                              >
                                <X className="w-3 h-3" /> 승인 취소
                              </button>
                            )}
                            {p.status === 'failed' && (
                              <button
                                onClick={() => update(p.id, { status: 'approved', error: null })}
                                disabled={busyId === p.id}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-black"
                              >
                                <RotateCcw className="w-3 h-3" /> 다시 시도
                              </button>
                            )}
                            <button
                              onClick={() => startEdit(p)}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border ${input}`}
                            >
                              <Edit3 className="w-3 h-3" /> 글·시간 수정
                            </button>
                            <button
                              onClick={() => remove(p)}
                              disabled={busyId === p.id}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 border border-rose-200"
                            >
                              <Trash2 className="w-3 h-3" /> 삭제
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        ))
      )}

      {preview && (
        <div className="fixed inset-0 z-50 bg-black/70 flex flex-col items-center justify-center gap-4 p-6" onClick={() => setPreview(null)}>
          <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreview({ ...preview, index: (preview.index - 1 + preview.urls.length) % preview.urls.length })}
              disabled={preview.urls.length < 2}
              className="px-3 py-2 rounded-full bg-white/90 text-black text-sm font-bold disabled:opacity-30"
            >
              ‹
            </button>
            <img src={preview.urls[preview.index]} alt="" className="max-h-[80vh] max-w-[70vw] rounded-2xl shadow-2xl" />
            <button
              onClick={() => setPreview({ ...preview, index: (preview.index + 1) % preview.urls.length })}
              disabled={preview.urls.length < 2}
              className="px-3 py-2 rounded-full bg-white/90 text-black text-sm font-bold disabled:opacity-30"
            >
              ›
            </button>
          </div>
          <p className="text-white text-xs">{preview.index + 1} / {preview.urls.length}</p>
        </div>
      )}
    </div>
  );
};
