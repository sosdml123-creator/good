import { ProductCategory, Product, PendingProduct } from '../types';

export interface CrawlLinkConfig {
  id: string;
  channel: string; // 'CU' | 'GS25' | '세븐일레븐' | '이마트24' | '기타'
  name: string;
  url: string;
  isActive: boolean;
  category?: ProductCategory;
  description: string;
  badgeBg?: string;
  badgeText?: string;
  icon?: string;
  lastCrawledAt?: string;
  lastCollectedCount?: number;
}

/**
 * 기본 신제품 수집 링크 프리셋 목록
 * 사용자가 요청한 CU 신제품 공식 URL 기본 지정:
 * https://cu.bgfretail.com/product/product.do?category=product&depth2=4&sf=N#
 */
export const DEFAULT_CRAWL_LINKS: CrawlLinkConfig[] = [
  {
    id: 'cu_official_new',
    channel: 'CU',
    name: 'CU 공식 신제품 (NEW)',
    url: 'https://cu.bgfretail.com/product/product.do?category=product&depth2=4&sf=N#',
    isActive: true,
    category: '간편식',
    description: 'BGF리테일 CU 공식 사이트에 실시간 등록되는 편의점 신제품 전용관 크롤링',
    badgeBg: 'bg-purple-600 text-white',
    badgeText: 'CU 신상품',
    icon: '💜'
  },
  {
    id: 'gs25_official_new',
    channel: 'GS25',
    name: 'GS25 이달의 신상품',
    url: 'https://gs25.gsretail.com/gscvs/ko/products/event-goods',
    isActive: false,
    category: '간편식',
    description: 'GS리테일 우리동네GS 및 GS25 편의점 신상 먹거리 연동',
    badgeBg: 'bg-sky-600 text-white',
    badgeText: 'GS25 신상',
    icon: '💙'
  },
  {
    id: 'seven_official_new',
    channel: '세븐일레븐',
    name: '세븐일레븐 신상품관',
    url: 'https://www.7-eleven.co.kr/product/presentList.asp',
    isActive: false,
    category: '간편식',
    description: '코리아세븐 세븐일레븐 PB 및 단독 출시 신제품 연동',
    badgeBg: 'bg-emerald-600 text-white',
    badgeText: '세븐 신상',
    icon: '💚'
  },
  {
    id: 'emart24_official_new',
    channel: '이마트24',
    name: '이마트24 딜리셔스 신상품',
    url: 'https://emart24.co.kr/goods/event',
    isActive: false,
    category: '간편식',
    description: '이마트24 이달의 신상품 및 딜리셔스 아이템 연동',
    badgeBg: 'bg-amber-500 text-slate-900',
    badgeText: '이마트24 신상',
    icon: '💛'
  }
];

export const CRAWL_LINK_STORAGE_KEY = 'sinsangpick_crawl_link_configs_v1';

/**
 * 저장된 링크 설정 불러오기
 */
export function getCrawlLinkConfigs(): CrawlLinkConfig[] {
  try {
    const raw = localStorage.getItem(CRAWL_LINK_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CRAWL_LINK_STORAGE_KEY, JSON.stringify(DEFAULT_CRAWL_LINKS));
      return DEFAULT_CRAWL_LINKS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn('[linkProductCrawler] Failed to parse stored configs:', err);
  }
  return DEFAULT_CRAWL_LINKS;
}

/**
 * 링크 설정 목록 저장
 */
export function saveCrawlLinkConfigs(configs: CrawlLinkConfig[]): void {
  try {
    localStorage.setItem(CRAWL_LINK_STORAGE_KEY, JSON.stringify(configs));
  } catch (err) {
    console.warn('[linkProductCrawler] Failed to save configs:', err);
  }
}

/**
 * 단일 링크 설정 수정
 */
export function updateCrawlLinkConfig(id: string, updates: Partial<CrawlLinkConfig>): CrawlLinkConfig[] {
  const configs = getCrawlLinkConfigs();
  const next = configs.map(item => item.id === id ? { ...item, ...updates } : item);
  saveCrawlLinkConfigs(next);
  return next;
}

/**
 * 새 링크 설정 추가
 */
export function addCrawlLinkConfig(newConfig: Omit<CrawlLinkConfig, 'id'>): CrawlLinkConfig[] {
  const configs = getCrawlLinkConfigs();
  const id = `link_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const fullConfig: CrawlLinkConfig = {
    id,
    ...newConfig
  };
  const next = [...configs, fullConfig];
  saveCrawlLinkConfigs(next);
  return next;
}

/**
 * 링크 설정 삭제
 */
export function deleteCrawlLinkConfig(id: string): CrawlLinkConfig[] {
  const configs = getCrawlLinkConfigs();
  const next = configs.filter(item => item.id !== id);
  saveCrawlLinkConfigs(next);
  return next;
}

/**
 * 기본 설정으로 리셋
 */
export function resetCrawlLinkConfigs(): CrawlLinkConfig[] {
  saveCrawlLinkConfigs(DEFAULT_CRAWL_LINKS);
  return DEFAULT_CRAWL_LINKS;
}

export interface CrawlLinkResult {
  success: boolean;
  linkConfig: CrawlLinkConfig;
  totalParsed: number;
  count: number;
  items: PendingProduct[];
  crawledAt: string;
  error?: string;
}

/**
 * 지정된 링크에서 신제품 크롤링 실행
 */
export async function crawlNewProductsFromLink(
  config: CrawlLinkConfig,
  options?: { page?: number; maxPages?: number }
): Promise<CrawlLinkResult> {
  const page = options?.page || 1;
  const maxPages = options?.maxPages || 1;

  try {
    const res = await fetch('/api/crawl-new-products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        url: config.url,
        channel: config.channel,
        page,
        maxPages
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        // 성공 시 마지막 수집 시간 및 건수 업데이트
        updateCrawlLinkConfig(config.id, {
          lastCrawledAt: new Date().toISOString(),
          lastCollectedCount: data.items.length
        });

        return {
          success: true,
          linkConfig: config,
          totalParsed: data.totalParsed || data.items.length,
          count: data.items.length,
          items: data.items,
          crawledAt: data.crawledAt || new Date().toISOString()
        };
      }
    }
  } catch (err: any) {
    console.warn(`[linkProductCrawler] Direct API error for ${config.name}:`, err);
  }

  // 예외 시 알림용
  return {
    success: false,
    linkConfig: config,
    totalParsed: 0,
    count: 0,
    items: [],
    crawledAt: new Date().toISOString(),
    error: '신제품 웹페이지 응답에 실패했습니다. 링크 주소나 네트워크 상태를 확인해주세요.'
  };
}

/**
 * 상품명 단순화 정규화 헬퍼 (공백 및 괄호 제거 후 비교)
 */
function normalizeForComparison(name: string): string {
  return name.replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '').replace(/^[가-힣a-zA-Z0-9]+\)/, '').replace(/\s+/g, '').toLowerCase();
}

export interface AnalyzedCrawledProduct extends PendingProduct {
  isAlreadyRegistered: boolean;
  matchedExistingName?: string;
}

/**
 * 수집된 상품들이 기존 정식 상품이나 승인 대기 상품에 이미 존재하는지 검사
 */
export function checkProductDuplicates(
  crawledItems: PendingProduct[],
  existingProducts: Product[],
  existingPending: PendingProduct[]
): {
  analyzedItems: AnalyzedCrawledProduct[];
  newItemsCount: number;
  existingCount: number;
} {
  const existingNameSet = new Set<string>();

  existingProducts.forEach(p => {
    existingNameSet.add(normalizeForComparison(p.name));
  });

  existingPending.forEach(p => {
    existingNameSet.add(normalizeForComparison(p.name));
  });

  let newItemsCount = 0;
  let existingCount = 0;

  const analyzedItems: AnalyzedCrawledProduct[] = crawledItems.map(item => {
    const norm = normalizeForComparison(item.name);
    const isAlready = existingNameSet.has(norm);

    if (isAlready) {
      existingCount++;
    } else {
      newItemsCount++;
    }

    return {
      ...item,
      isAlreadyRegistered: isAlready
    };
  });

  return {
    analyzedItems,
    newItemsCount,
    existingCount
  };
}
