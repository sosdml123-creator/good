// src/components/admin/instagram/contentHistoryService.ts
import { getAdminAuthHeaders } from '../../../services/adminAuth';
import { GeneratedContentPackage } from './types';

const LOCAL_STORAGE_KEY = 'sinsangpick_insta_content_posts_v1';
const API_URL = '/api/generate-content';

export interface ContentHistoryItem {
  id: string;
  prompt: string;
  template_mode: string;
  aspect_ratio: string;
  content_json: GeneratedContentPackage;
  caption: string;
  hashtags: string[];
  created_at: string;
}

export interface ContentHistoryResult {
  items: ContentHistoryItem[];
  /** 서버에 ANTHROPIC_API_KEY가 설정되어 있는지 (서버에 닿지 못했으면 null) */
  aiConfigured: boolean | null;
  /** Supabase content_posts 테이블을 쓸 수 있는지 (서버에 닿지 못했으면 null) */
  storageReady: boolean | null;
}

/**
 * 생성된 콘텐츠를 이 브라우저(LocalStorage)에 백업한다.
 * 서버 이력(content_posts)은 /api/generate-content가 생성 시점에 직접 저장한다.
 */
export async function saveContentPost(
  pkg: GeneratedContentPackage,
  templateMode: string = 'auto'
): Promise<ContentHistoryItem> {
  const item: ContentHistoryItem = {
    id: pkg.id || `cp-${Date.now()}`,
    prompt: pkg.prompt,
    template_mode: templateMode,
    aspect_ratio: pkg.aspectRatio,
    content_json: pkg,
    caption: pkg.caption,
    hashtags: pkg.hashtags,
    created_at: pkg.created_at || new Date().toISOString(),
  };

  try {
    const localData = getLocalContentPosts();
    const updated = [item, ...localData.filter((x) => x.id !== item.id)].slice(0, 50);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('[saveContentPost] LocalStorage save error:', e);
  }

  return item;
}

/** 저장된 생성 이력 + 서버 준비 상태 불러오기 */
export async function fetchContentHistory(): Promise<ContentHistoryResult> {
  const localItems = getLocalContentPosts();

  try {
    const res = await fetch(API_URL, { headers: await getAdminAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const serverItems: ContentHistoryItem[] = Array.isArray(data.posts) ? data.posts : [];
    const serverIds = new Set(serverItems.map((x) => x.id));
    // 서버에 저장되지 못한 세트(테이블 미생성 시기, 직접 업로드 이미지 포함분)는 로컬 백업으로 보완
    const items = [...serverItems, ...localItems.filter((x) => !serverIds.has(x.id))].sort((a, b) =>
      b.created_at.localeCompare(a.created_at)
    );
    return { items, aiConfigured: !!data.aiConfigured, storageReady: !!data.storageReady };
  } catch (e) {
    console.warn('[fetchContentHistory] Server fetch error, returning local:', e);
    return { items: localItems, aiConfigured: null, storageReady: null };
  }
}

/** 저장된 생성 이력 목록 불러오기 */
export async function fetchContentPosts(): Promise<ContentHistoryItem[]> {
  return (await fetchContentHistory()).items;
}

/** 생성 이력 삭제 */
export async function deleteContentPost(id: string): Promise<void> {
  try {
    const localData = getLocalContentPosts();
    const filtered = localData.filter((x) => x.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('[deleteContentPost] LocalStorage delete error:', e);
  }

  try {
    await fetch(`${API_URL}?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: await getAdminAuthHeaders(),
    });
  } catch (e) {
    console.warn('[deleteContentPost] Server delete error:', e);
  }
}

/** 오늘의 자동 콘텐츠(5세트)를 지금 생성. force=true면 오늘 것이 있어도 다시 만든다 */
export async function runDailyGeneration(
  force: boolean
): Promise<{ generated: number; skipped?: boolean; failed?: string[] }> {
  const res = await fetch(`${API_URL}?daily=1${force ? '&force=1' : ''}`, {
    headers: await getAdminAuthHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok && !data.generated) {
    throw new Error(data.error || data.failed?.[0] || `서버 오류 (${res.status})`);
  }
  return data;
}

function getLocalContentPosts(): ContentHistoryItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
