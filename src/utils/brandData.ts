import { BrandInfo, Product } from '../types';

export const POPULAR_BRANDS: BrandInfo[] = [
  {
    id: 'mcdonalds',
    name: '맥도날드',
    engName: "McDonald's",
    logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&auto=format&fit=crop&q=80',
    category: '패스트푸드',
    slogan: "I'm lovin' it! 전 세계가 사랑하는 버거와 감자튀김",
    description: '100% 순 쇠고기 패티의 빅맥, 바삭한 맥스파이시 상하이 버거, 바삭한 후렌치 후라이까지!',
    officialUrl: 'https://www.mcdonalds.co.kr',
    badge: '글로벌 No.1 버거',
    isPopular: true
  },
  {
    id: 'burgerking',
    name: '버거킹',
    engName: 'Burger King',
    logo: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1000&auto=format&fit=crop&q=80',
    category: '패스트푸드',
    slogan: 'TASTE IS KING! 직화로 구워 불맛 가득한 와퍼',
    description: '불맛 가득 직화 패티와 신선한 야채의 묵직한 조화, 콰트로치즈와퍼와 몬스터와퍼의 성지.',
    officialUrl: 'https://www.burgerking.co.kr',
    badge: '직화 패티 와퍼의 제왕',
    isPopular: true
  },
  {
    id: 'momstouch',
    name: '맘스터치',
    engName: "Mom's Touch",
    logo: 'https://images.unsplash.com/photo-1619881590738-a111d176d906?w=200&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1619881590738-a111d176d906?w=1000&auto=format&fit=crop&q=80',
    category: '패스트푸드',
    slogan: '빠르게보다 ALL 바르게! 두툼한 통다리살 치킨버거',
    description: '육즙 가득 바삭한 통다리살 싸이버거와 중독성 넘치는 케이준 양념감자.',
    officialUrl: 'https://www.momstouch.co.kr',
    badge: '치킨버거 압도적 1위',
    isPopular: true
  },
  {
    id: 'lotteria',
    name: '롯데리아',
    engName: 'Lotteria',
    logo: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=200&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=1000&auto=format&fit=crop&q=80',
    category: '패스트푸드',
    slogan: '맛있는 즐거움! 대한민국 최초의 K-버거',
    description: '30년 전통의 리아 불고기와 리아 새우, 치즈 폭포 모짜렐라인더버거와 한우불고기버거.',
    officialUrl: 'https://www.lotteeats.com',
    badge: '대한민국 K-버거 원조',
    isPopular: true
  },
  {
    id: 'starbucks',
    name: '스타벅스',
    engName: 'Starbucks',
    logo: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&auto=format&fit=crop&q=80',
    category: '커피·음료',
    slogan: 'Inspiring and nurturing the human spirit',
    description: '에스프레소 기반의 스페셜티 커피와 시즌 한정 프로모션 음료, 프리미엄 베이커리.',
    officialUrl: 'https://www.starbucks.co.kr',
    badge: '글로벌 커피 No.1',
    isPopular: true
  },
  {
    id: 'megacoffee',
    name: '메가MGC커피',
    engName: 'Mega Coffee',
    logo: 'https://img.79plus.co.kr/megahp/manager/upload/menu/20260902203101_1788348661533_weMnhAbV2Q.jpg',
    bannerImage: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=1000&auto=format&fit=crop&q=80',
    category: '커피·음료',
    slogan: '가성비와 트렌디한 메뉴의 만남, 즐거움이 가득한 메가',
    description: '합리적인 가격의 대용량 아메리카노와 시즌별 화려한 신메뉴 음료 라인업.',
    officialUrl: 'https://www.mega-mgccoffee.com',
    badge: '대용량 가성비 카페',
    isPopular: true
  },
  {
    id: 'orion',
    name: '오리온',
    engName: 'Orion',
    logo: 'https://www.orionworld.com/upload/goods/00086d1e89648f5fcf72cdb3a40847cb.png',
    bannerImage: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1000&auto=format&fit=crop&q=80',
    category: '과자·스낵',
    slogan: '정(情)을 나누는 국민 스낵 & 파이 명가',
    description: '초코파이, 꼬북칩, 포카칩, 스윙칩 등 전 세대가 사랑하는 바삭달콤한 스낵.',
    officialUrl: 'https://www.orionworld.com',
    badge: '국민 스낵 명가',
    isPopular: true
  },
  {
    id: 'nongshim',
    name: '농심',
    engName: 'Nongshim',
    logo: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1000&auto=format&fit=crop&q=80',
    category: '라면·간편식',
    slogan: '인생을 맛있게! 농심',
    description: '신라면 툼바, 짜파게티, 안성탕면, 새우깡 등 한국인의 입맛을 사로잡은 라면과 스낵.',
    officialUrl: 'https://www.nongshim.com',
    badge: 'K-라면 대표 브랜드',
    isPopular: true
  },
  {
    id: 'yonsei',
    name: '연세유업',
    engName: 'Yonsei Dairy',
    logo: 'https://cdn.iconsumer.or.kr/news/thumbnail/202510/28274_38223_816_v150.jpg',
    bannerImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop&q=80',
    category: '베이커리·디저트',
    slogan: '생크림 가득 프리미엄 디저트의 기준',
    description: '연세우유 생크림빵, 밤티라미수, 말차 등 편의점 디저트 열풍을 주도하는 크림빵 신화.',
    officialUrl: 'https://www.yonseidairy.com',
    badge: '크림빵 디저트 신화',
    isPopular: true
  },
  {
    id: 'lottewellfood',
    name: '롯데웰푸드',
    engName: 'Lotte Wellfood',
    logo: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=200&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=1000&auto=format&fit=crop&q=80',
    category: '과자·스낵',
    slogan: '달콤한 순간을 선물하는 종합 제과 브랜드',
    description: '빼빼로, 자일리톨, 가나초콜릿, 마가렛트 등 일상 속 달콤함을 전하는 제과.',
    officialUrl: 'https://www.lottenfood.com',
    badge: '종합 제과 리더',
    isPopular: true
  },
  {
    id: 'haitai',
    name: '해태제과',
    engName: 'Haitai',
    logo: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=1000&auto=format&fit=crop&q=80',
    category: '과자·스낵',
    slogan: '맛있는 과자, 행복한 미소',
    description: '홈런볼, 허니버터칩, 맛동산, 에이스 등 오랫동안 사랑받는 스테디셀러 스낵.',
    officialUrl: 'https://www.ht.co.kr',
    badge: '스테디셀러 스낵',
    isPopular: true
  }
];

export interface ProcessedBrand {
  name: string;
  engName?: string;
  logo: string;
  bannerImage?: string;
  category: string;
  slogan: string;
  description?: string;
  officialUrl?: string;
  badge?: string;
  isPopular?: boolean;
  productCount: number;
  avgRating: number;
  totalReviews: number;
  products: Product[];
}

/**
 * Extract all unique brands from products list and augment with metadata
 */
export const getAggregatedBrands = (products: Product[]): ProcessedBrand[] => {
  const brandMap = new Map<string, Product[]>();

  // Group products by brand
  products.forEach((p) => {
    if (!p.brand) return;
    const brandName = p.brand.trim();
    if (!brandName) return;

    if (!brandMap.has(brandName)) {
      brandMap.set(brandName, []);
    }
    brandMap.get(brandName)!.push(p);
  });

  const result: ProcessedBrand[] = [];

  brandMap.forEach((brandProducts, brandName) => {
    const knownMeta = POPULAR_BRANDS.find(
      (b) => b.name === brandName || brandName.includes(b.name) || b.name.includes(brandName)
    );

    // Calculate rating and review counts
    const totalRating = brandProducts.reduce((acc, curr) => acc + (curr.overallRating || 4.5), 0);
    const avgRating = Number((totalRating / (brandProducts.length || 1)).toFixed(1));
    const totalReviews = brandProducts.reduce((acc, curr) => acc + (curr.ratingCount || 0), 0);

    // Derive category
    const mainCategory = brandProducts[0]?.category || '기타';

    // Default logo/banner
    const defaultLogo = brandProducts[0]?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=80';
    const defaultBanner = brandProducts[0]?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';

    result.push({
      name: brandName,
      engName: knownMeta?.engName,
      logo: knownMeta?.logo || defaultLogo,
      bannerImage: knownMeta?.bannerImage || defaultBanner,
      category: knownMeta?.category || mainCategory,
      slogan: knownMeta?.slogan || `${brandName}의 공식 인기 메뉴 및 신제품 라인업`,
      description: knownMeta?.description || `${brandName}에서 판매 중인 다양한 상품과 실시간 리뷰를 확인해보세요.`,
      officialUrl: knownMeta?.officialUrl,
      badge: knownMeta?.badge || (brandProducts.length >= 4 ? '인기 브랜드' : '공식 입점'),
      isPopular: knownMeta?.isPopular || brandProducts.length >= 3,
      productCount: brandProducts.length,
      avgRating,
      totalReviews,
      products: brandProducts
    });
  });

  // Sort by popular first, then by product count
  return result.sort((a, b) => {
    if (a.isPopular && !b.isPopular) return -1;
    if (!a.isPopular && b.isPopular) return 1;
    return b.productCount - a.productCount;
  });
};
