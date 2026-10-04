// src/components/admin/instagram/imageUtils.ts

/**
 * 외부 이미지 URL을 안전하게 프록시 URL로 변환하여 CORS 방지
 */
export function getProxiedImageUrl(url?: string): string {
  if (!url) return '';
  if (
    url.startsWith('data:') ||
    url.startsWith('blob:') ||
    url.startsWith('/') ||
    url.includes('supabase.co') ||
    url.includes('localhost')
  ) {
    return url;
  }

  // 외부 URL인 경우 Vercel Serverless Image Proxy 사용
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}
