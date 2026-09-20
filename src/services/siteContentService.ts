import { Capacitor } from '@capacitor/core';
import { supabase, DBProduct } from './supabase';
import { BannerItem, Product, HomeSectionConfig } from '../types';

export const SYSTEM_BANNER_RECORD_ID = '__sinsangpick_system_banners__';

export interface RemoteContentPayload {
  banners?: BannerItem[];
  homeSections?: HomeSectionConfig[];
  products?: Product[];
  deletedProductIds?: string[];
}

export interface RemoteContentResult {
  banners: BannerItem[] | null;
  homeSections: HomeSectionConfig[] | null;
  products: Product[];
  deletedProductIds: string[] | null;
  lastUpdated: string | null;
}

/**
 * Fetch remote banners, home sections, and products directly from Supabase / API
 * Works consistently across both Web browsers and Capacitor Mobile Apps (iOS/Android).
 */
export const fetchRemoteContent = async (): Promise<RemoteContentResult> => {
  let banners: BannerItem[] | null = null;
  let homeSections: HomeSectionConfig[] | null = null;
  let products: Product[] = [];
  let deletedProductIds: string[] | null = null;
  let lastUpdated: string | null = null;

  // 1. Direct Supabase Query (Fastest and works identically on both Web & Native App)
  if (supabase) {
    try {
      // Query system banners record
      const { data: sysData, error: sysErr } = await supabase
        .from('products')
        .select('*')
        .eq('id', SYSTEM_BANNER_RECORD_ID)
        .maybeSingle();

      if (!sysErr && sysData && sysData.nutrition) {
        if (Array.isArray(sysData.nutrition.banners) && sysData.nutrition.banners.length > 0) {
          banners = sysData.nutrition.banners;
        }
        if (Array.isArray(sysData.nutrition.homeSections) && sysData.nutrition.homeSections.length > 0) {
          homeSections = sysData.nutrition.homeSections;
        }
        if (Array.isArray(sysData.nutrition.deletedProductIds)) {
          deletedProductIds = sysData.nutrition.deletedProductIds;
        }
        lastUpdated = sysData.updated_at || null;
      }
    } catch (e) {
      console.warn('[fetchRemoteContent] Supabase system record fetch warning:', e);
    }
  }

  // 2. Fallback to /api/site-content if Supabase didn't return banners
  if (!banners && !Capacitor.isNativePlatform()) {
    try {
      const apiRes = await fetch('/api/site-content', {
        headers: { 'Accept': 'application/json' }
      });
      if (apiRes.ok) {
        const json = await apiRes.json();
        if (json.banners && Array.isArray(json.banners)) {
          banners = json.banners;
        }
        if (json.homeSections && Array.isArray(json.homeSections)) {
          homeSections = json.homeSections;
        }
        if (json.deletedProductIds && Array.isArray(json.deletedProductIds)) {
          deletedProductIds = json.deletedProductIds;
        }
        if (json.lastUpdated) {
          lastUpdated = json.lastUpdated;
        }
      }
    } catch (e) {
      // ignore
    }
  }

  return { banners, homeSections, products, deletedProductIds, lastUpdated };
};

/**
 * Save updated banners, home sections, and deleted product IDs to remote cloud
 * Updates both Supabase system record and Vercel serverless function
 */
export const saveRemoteBannersAndSections = async (
  banners: BannerItem[],
  homeSections?: HomeSectionConfig[],
  deletedProductIds?: string[]
): Promise<boolean> => {
  let saved = false;

  // 1. Save to Supabase system record
  if (supabase) {
    try {
      // Read existing system container record to avoid overwriting existing fields
      const { data: existing } = await supabase
        .from('products')
        .select('nutrition')
        .eq('id', SYSTEM_BANNER_RECORD_ID)
        .maybeSingle();

      const existingNutrition = existing?.nutrition || {};

      const payload: any = {
        id: SYSTEM_BANNER_RECORD_ID,
        name: 'SYSTEM_SETTINGS_CONTAINER',
        brand: '신상픽_시스템',
        category: '시스템',
        price: 0,
        image: '',
        description: '신상픽 배너 및 홈 섹션 글로벌 동기화 컨테이너',
        is_today: false,
        is_hot: false,
        nutrition: {
          ...existingNutrition,
          banners: banners || existingNutrition.banners,
          homeSections: homeSections !== undefined ? homeSections : existingNutrition.homeSections,
          deletedProductIds: deletedProductIds !== undefined ? deletedProductIds : (existingNutrition.deletedProductIds || []),
          updatedAt: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from('products').upsert(payload, { onConflict: 'id' });
      if (!error) {
        saved = true;
      } else {
        console.warn('[saveRemoteBanners] Supabase upsert error:', error.message);
      }
    } catch (e) {
      console.warn('[saveRemoteBanners] Supabase upsert failed:', e);
    }
  }

  // 2. Also send to /api/site-content if on Web
  if (!Capacitor.isNativePlatform()) {
    try {
      await fetch('/api/site-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banners, homeSections, deletedProductIds })
      });
      saved = true;
    } catch (e) {
      // ignore
    }
  }

  return saved;
};

/**
 * Save updated deleted product IDs to Supabase system record
 */
export const saveRemoteDeletedProducts = async (deletedProductIds: string[]): Promise<boolean> => {
  if (!supabase) return false;
  try {
    const { data: existing } = await supabase
      .from('products')
      .select('nutrition')
      .eq('id', SYSTEM_BANNER_RECORD_ID)
      .maybeSingle();

    const existingNutrition = existing?.nutrition || {};

    const payload: any = {
      id: SYSTEM_BANNER_RECORD_ID,
      name: 'SYSTEM_SETTINGS_CONTAINER',
      brand: '신상픽_시스템',
      category: '시스템',
      price: 0,
      image: '',
      description: '신상픽 배너 및 홈 섹션 글로벌 동기화 컨테이너',
      is_today: false,
      is_hot: false,
      nutrition: {
        ...existingNutrition,
        deletedProductIds,
        updatedAt: new Date().toISOString()
      },
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('products').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch (e) {
    console.warn('[saveRemoteDeletedProducts] Error:', e);
    return false;
  }
};

/**
 * Save / Update a single product to Supabase
 */
export const saveRemoteProduct = async (product: Partial<Product> & { id: string; name: string }): Promise<boolean> => {
  if (!supabase) return false;

  try {
    const dbPayload: Partial<DBProduct> = {
      id: product.id,
      name: product.name,
      brand: product.brand || '기타',
      category: product.category || '기타',
      sub_category: product.subCategory,
      item_type: product.itemType || 'packaged',
      image: product.image || '',
      release_date: product.releaseDate,
      price: product.price || 0,
      discount_rate: product.discountRate || 0,
      overall_rating: product.overallRating || 5.0,
      rating_count: product.ratingCount || 1,
      description: product.description || '',
      stores: product.stores || [],
      calories: product.calories,
      volume: product.volume,
      is_today: product.isToday ?? false,
      is_hot: product.isHot ?? false,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('products').upsert(dbPayload, { onConflict: 'id' });
    if (error) {
      console.warn('[saveRemoteProduct] Supabase upsert warning:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[saveRemoteProduct] Error:', e);
    return false;
  }
};

/**
 * Delete a product from Supabase
 */
export const deleteRemoteProduct = async (productId: string): Promise<boolean> => {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      console.warn('[deleteRemoteProduct] Supabase error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[deleteRemoteProduct] Catch:', e);
    return false;
  }
};

/**
 * Delete multiple products from Supabase
 */
export const deleteRemoteProducts = async (productIds: string[]): Promise<boolean> => {
  if (!supabase || productIds.length === 0) return false;
  try {
    const { error } = await supabase.from('products').delete().in('id', productIds);
    if (error) {
      console.warn('[deleteRemoteProducts] Supabase error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[deleteRemoteProducts] Catch:', e);
    return false;
  }
};
