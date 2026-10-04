// src/components/admin/instagram/contentHistoryService.ts
import { supabase } from '../../../services/supabase';
import { GeneratedContentPackage } from './types';

const LOCAL_STORAGE_KEY = 'sinsangpick_insta_content_posts_v1';

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

/** 생성된 인스타그램 콘텐츠를 Supabase 및 로컬에 저장 */
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

  // 1. LocalStorage 백업
  try {
    const localData = getLocalContentPosts();
    const updated = [item, ...localData.filter((x) => x.id !== item.id)].slice(0, 50);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('[saveContentPost] LocalStorage save error:', e);
  }

  // 2. Supabase content_posts 저장 시도
  if (supabase) {
    try {
      const { error } = await supabase.from('content_posts').upsert({
        id: item.id,
        prompt: item.prompt,
        template_mode: item.template_mode,
        aspect_ratio: item.aspect_ratio,
        content_json: item.content_json,
        caption: item.caption,
        hashtags: item.hashtags,
        created_at: item.created_at,
      });
      if (error) {
        console.warn('[saveContentPost] Supabase upsert error (using local fallback):', error.message);
      }
    } catch (err) {
      console.warn('[saveContentPost] Supabase connection error:', err);
    }
  }

  return item;
}

/** 저장된 생성 이력 목록 불러오기 */
export async function fetchContentPosts(): Promise<ContentHistoryItem[]> {
  const localItems = getLocalContentPosts();

  if (!supabase) {
    return localItems;
  }

  try {
    const { data, error } = await supabase
      .from('content_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);

    if (error || !data || data.length === 0) {
      return localItems;
    }

    return data as ContentHistoryItem[];
  } catch (e) {
    console.warn('[fetchContentPosts] Fetch error, returning local:', e);
    return localItems;
  }
}

/** 생성 이력 삭제 */
export async function deleteContentPost(id: string): Promise<void> {
  // 1. LocalStorage 삭제
  try {
    const localData = getLocalContentPosts();
    const filtered = localData.filter((x) => x.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('[deleteContentPost] LocalStorage delete error:', e);
  }

  // 2. Supabase 삭제
  if (supabase) {
    try {
      await supabase.from('content_posts').delete().eq('id', id);
    } catch (e) {
      console.warn('[deleteContentPost] Supabase delete error:', e);
    }
  }
}

function getLocalContentPosts(): ContentHistoryItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
