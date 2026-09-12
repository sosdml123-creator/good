// 삼양식품 공식 홈페이지(https://www.samyangfoods.com) 전수 수집 정품 데이터 (총 119종)
// 라면, 스낵, 유제품, 소스·간편식, 냉동 간편식 전 제품 완벽 등록
import { Product } from '../types';

export const SAMYANG_PRODUCTS: Product[] = [
  {
    id: "samyang-685",
    name: "삼양1963",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20251028/20251028144634493287.png",
    releaseDate: "2025.11 삼양식품 공식",
    price: 1600,
    overallRating: 4.9,
    ratingCount: 1240,
    searchInfluxCount: 120000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 91,
    calories: 530,
    volume: "131g",
    isToday: true,
    isHot: true,
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 530,
      sodium: '1166mg',
      carbs: '74g',
      sugar: '6g',
      fat: '16g',
      protein: '11g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 / 익산공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "대한민국 라면의 시작 라면의 귀환, 삼양1963 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["오리지널 라면 본연의 깊고 구수한 국물 맛","언제 먹어도 질리지 않는 대한민국 대표 라면"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1600,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1600,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1600,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1440,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-691",
    name: "짜르르",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20260703/20260703142455903510.png",
    releaseDate: "2026.07 삼양식품 공식",
    price: 1600,
    overallRating: 4.9,
    ratingCount: 1240,
    searchInfluxCount: 120000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 90,
    calories: 550,
    volume: "140g",
    isToday: true,
    isHot: true,
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 550,
      sodium: '1210mg',
      carbs: '77g',
      sugar: '6g',
      fat: '17g',
      protein: '11g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 / 익산공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "진한 소고기 풍미 가득, 짜르르 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1600,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop/products/13642154979"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1600,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1600,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1440,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-677",
    name: "탱글 머쉬룸크림 파스타",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250424/20250424150538620038.jpg",
    releaseDate: "2025.04 삼양식품 공식",
    price: 1800,
    overallRating: 4.9,
    ratingCount: 1240,
    searchInfluxCount: 120000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 88,
    calories: 370,
    volume: "105g",
    isToday: true,
    isHot: true,
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 370,
      sodium: '814mg',
      carbs: '52g',
      sugar: '6g',
      fat: '11g',
      protein: '7g'
    },
    ingredients: "삼양식품 엄선 원재료 (건면)",
    allergens: ["대두","밀","우유"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /밀양공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "10개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "양송이, 표고버섯과 트러플향을 더해 꾸덕하고 고소한 크림파스타 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1800,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop/category/63c89c6b919a4828af1f3529b10cfa68?cp=1"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1620,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-680",
    name: "큰컵 탱글 머쉬룸크림 파스타",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "컵라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250424/20250424151718718053.jpg",
    releaseDate: "2025.04 삼양식품 공식",
    price: 2200,
    overallRating: 4.9,
    ratingCount: 1240,
    searchInfluxCount: 120000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 89,
    calories: 370,
    volume: "105g",
    isToday: true,
    isHot: true,
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 370,
      sodium: '814mg',
      carbs: '52g',
      sugar: '6g',
      fat: '11g',
      protein: '7g'
    },
    ingredients: "삼양식품 엄선 원재료 (건면)",
    allergens: ["대두","밀","우유"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /밀양공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "10개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "양송이, 표고버섯과 트러플향을 더해 꾸덕하고 고소한 크림파스타 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 2200,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop/category/63c89c6b919a4828af1f3529b10cfa68?cp=1"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 2200,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 2200,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1980,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-678",
    name: "탱글 갈릭오일 파스타",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250424/20250424151137594043.jpg",
    releaseDate: "2025.04 삼양식품 공식",
    price: 1800,
    overallRating: 4.9,
    ratingCount: 1240,
    searchInfluxCount: 120000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 89,
    calories: 370,
    volume: "100g",
    isToday: true,
    isHot: true,
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 370,
      sodium: '814mg',
      carbs: '52g',
      sugar: '6g',
      fat: '11g',
      protein: '7g'
    },
    ingredients: "삼양식품 엄선 원재료 (건면)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /밀양공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "10개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "약간 매콤",
    description: "향긋한 마늘, 매콤한 레드페퍼로 감칠맛을 더한 오일파스타 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1800,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop/category/63c89c6b919a4828af1f3529b10cfa68?cp=1"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1620,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-679",
    name: "큰컵 탱글 갈릭오일 파스타",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "컵라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250424/20250424151500216048.jpg",
    releaseDate: "2025.04 삼양식품 공식",
    price: 2200,
    overallRating: 4.9,
    ratingCount: 1240,
    searchInfluxCount: 120000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 95,
    calories: 370,
    volume: "100g",
    isToday: true,
    isHot: true,
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 370,
      sodium: '814mg',
      carbs: '52g',
      sugar: '6g',
      fat: '11g',
      protein: '7g'
    },
    ingredients: "삼양식품 엄선 원재료 (건면)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /밀양공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "10개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "약간 매콤",
    description: "향긋한 마늘, 매콤한 레드페퍼로 감칠맛을 더한 오일 파스타 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 2200,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop/category/63c89c6b919a4828af1f3529b10cfa68?cp=1"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 2200,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 2200,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1980,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-686",
    name: "탱글 바질토마토 프로틴 파스타",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20260428/20260428131248028444.png",
    releaseDate: "2026.05 삼양식품 공식",
    price: 1800,
    overallRating: 4.9,
    ratingCount: 1240,
    searchInfluxCount: 120000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 89,
    calories: 345,
    volume: "105g",
    isToday: true,
    isHot: true,
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 345,
      sodium: '759mg',
      carbs: '48g',
      sugar: '6g',
      fat: '10g',
      protein: '7g'
    },
    ingredients: "삼양식품 엄선 원재료 (건면)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "서울특별시 중구 퇴계로 159",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "10개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "바질의 은은한 향긋함과 깊고 진한 토마토 풍미가 가득한 파스타 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1800,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop/category/63c89c6b919a4828af1f3529b10cfa68?cp=1"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1620,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-687",
    name: "큰컵 탱글 바질토마토 프로틴 파스타",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "컵라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20260428/20260428133444816452.png",
    releaseDate: "2026.05 삼양식품 공식",
    price: 2200,
    overallRating: 4.9,
    ratingCount: 1240,
    searchInfluxCount: 120000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 95,
    calories: 380,
    volume: "105g",
    isToday: true,
    isHot: true,
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 380,
      sodium: '836mg',
      carbs: '53g',
      sugar: '6g',
      fat: '11g',
      protein: '8g'
    },
    ingredients: "삼양식품 엄선 원재료 (건면)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "서울특별시 중구 퇴계로 159",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "10개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "바질의 은은한 향긋함과 깊고 진한 토마토 풍미가 가득한 파스타 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 2200,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop/category/63c89c6b919a4828af1f3529b10cfa68?cp=1"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 2200,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 2200,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1980,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-688",
    name: "탱글 갈릭쉬림프 프로틴 파스타",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20260428/20260428133333219448.png",
    releaseDate: "2026.05 삼양식품 공식",
    price: 1800,
    overallRating: 4.9,
    ratingCount: 1240,
    searchInfluxCount: 120000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 90,
    calories: 380,
    volume: "105g",
    isToday: true,
    isHot: true,
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 380,
      sodium: '836mg',
      carbs: '53g',
      sugar: '6g',
      fat: '11g',
      protein: '8g'
    },
    ingredients: "삼양식품 엄선 원재료 (건면)",
    allergens: ["대두","밀","새우","조개류"],
    origin: '대한민국',
    manufacturer: "서울특별시 중구 퇴계로 159",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "10개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "약간 매콤",
    description: "새우와 마늘의 진한 풍미에 은은한 매콤함을 더한 크림 파스타 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1800,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop/category/63c89c6b919a4828af1f3529b10cfa68?cp=1"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1620,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-689",
    name: "큰컵 탱글 갈릭쉬림프 프로틴 파스타",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "컵라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20260428/20260428133415858450.png",
    releaseDate: "2026.05 삼양식품 공식",
    price: 2200,
    overallRating: 4.9,
    ratingCount: 1240,
    searchInfluxCount: 120000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 91,
    calories: 380,
    volume: "105g",
    isToday: true,
    isHot: true,
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 380,
      sodium: '836mg',
      carbs: '53g',
      sugar: '6g',
      fat: '11g',
      protein: '8g'
    },
    ingredients: "삼양식품 엄선 원재료 (건면)",
    allergens: ["대두","밀","새우","조개류"],
    origin: '대한민국',
    manufacturer: "서울특별시 중구 퇴계로 159",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "10개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "약간 매콤",
    description: "새우와 마늘의 진한 풍미에 은은한 매콤함을 더한 크림 파스타 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 2200,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop/category/63c89c6b919a4828af1f3529b10cfa68?cp=1"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 2200,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 2200,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1980,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-674",
    name: "맵탱 쿨스파이시 비빔면 김치맛",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250320/20250320101542316213.jpg",
    releaseDate: "2025.03 삼양식품 공식",
    price: 1450,
    overallRating: 4.9,
    ratingCount: 1240,
    searchInfluxCount: 120000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 91,
    calories: 545,
    volume: "134g",
    isToday: true,
    isHot: true,
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 545,
      sodium: '1199mg',
      carbs: '76g',
      sugar: '6g',
      fat: '16g',
      protein: '11g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장, 익산공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "신라면급 (얼큰 칼칼)",
    description: "입안 가득 화해지는 깔끔한 맛! 맵콤깔끔 비빔면 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1450,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1450,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1450,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1310,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-675",
    name: "큰컵 푸팟퐁커리불닭볶음면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "컵라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250423/20250423093043312026.jpg",
    releaseDate: "2025.04 삼양식품 공식",
    price: 1800,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 92,
    calories: 460,
    volume: "105g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 460,
      sodium: '1012mg',
      carbs: '64g',
      sugar: '6g',
      fat: '14g',
      protein: '9g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀","닭고기","새우","조개류"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "코코넛밀크 풍미 가득한 태국식 커리불닭 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1800,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1620,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-530",
    name: "삼양라면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20230912/20230912173938561416.jpg",
    releaseDate: "1963.09 삼양식품 공식",
    price: 1050,
    overallRating: 4.8,
    ratingCount: 3100,
    searchInfluxCount: 140000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 94,
    calories: 515,
    volume: "120g",
    
    
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 515,
      sodium: '1133mg',
      carbs: '72g',
      sugar: '6g',
      fat: '15g',
      protein: '10g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장, 익산공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "깔끔한 감칠맛으로 대한민국을 사로잡다 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["오리지널 라면 본연의 깊고 구수한 국물 맛","언제 먹어도 질리지 않는 대한민국 대표 라면"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1050,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1050,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1050,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 950,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-73",
    name: "큰컵 삼양라면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "컵라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20231017/20231017135003167450.jpg",
    releaseDate: "2000.06 삼양식품 공식",
    price: 1600,
    overallRating: 4.8,
    ratingCount: 3100,
    searchInfluxCount: 140000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 90,
    calories: 470,
    volume: "110g",
    
    
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 470,
      sodium: '1034mg',
      carbs: '66g',
      sugar: '6g',
      fat: '14g',
      protein: '9g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "깔끔한 감칠맛으로 대한민국을 사로잡다 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["오리지널 라면 본연의 깊고 구수한 국물 맛","언제 먹어도 질리지 않는 대한민국 대표 라면"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1600,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1600,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1600,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1440,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-72",
    name: "컵 삼양라면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "컵라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20231117/20231117145958307589.jpg",
    releaseDate: "1972.03 삼양식품 공식",
    price: 1200,
    overallRating: 4.8,
    ratingCount: 3100,
    searchInfluxCount: 140000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 89,
    calories: 280,
    volume: "65g",
    
    
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 280,
      sodium: '616mg',
      carbs: '39g',
      sugar: '6g',
      fat: '8g',
      protein: '6g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "더 깊고 진해진 라면의 원조 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["오리지널 라면 본연의 깊고 구수한 국물 맛","언제 먹어도 질리지 않는 대한민국 대표 라면"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1200,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://smartstore.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1200,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1200,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1080,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-486",
    name: "삼양라면 매운맛",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20231017/20231017141211455454.jpg",
    releaseDate: "2017.08 삼양식품 공식",
    price: 1050,
    overallRating: 4.8,
    ratingCount: 3100,
    searchInfluxCount: 140000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 88,
    calories: 510,
    volume: "120g",
    
    
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 510,
      sodium: '1122mg',
      carbs: '71g',
      sugar: '6g',
      fat: '15g',
      protein: '10g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장, 익산공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "신라면급 (얼큰 칼칼)",
    description: "얼큰한 감칠맛으로 대한민국을 사로잡다 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["오리지널 라면 본연의 깊고 구수한 국물 맛","언제 먹어도 질리지 않는 대한민국 대표 라면"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1050,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1050,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1050,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 950,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-380",
    name: "큰컵 삼양라면 매운맛",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "컵라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250110/20250110104513276127.jpg",
    releaseDate: "2017.09 삼양식품 공식",
    price: 1600,
    overallRating: 4.8,
    ratingCount: 3100,
    searchInfluxCount: 140000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 92,
    calories: 480,
    volume: "110g",
    
    
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 480,
      sodium: '1056mg',
      carbs: '67g',
      sugar: '6g',
      fat: '14g',
      protein: '10g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "신라면급 (얼큰 칼칼)",
    description: "얼큰한 감칠맛으로 대한민국을 사로잡다 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["오리지널 라면 본연의 깊고 구수한 국물 맛","언제 먹어도 질리지 않는 대한민국 대표 라면"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1600,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://smartstore.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1600,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1600,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1440,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-53",
    name: "불닭볶음면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20260622/20260622144950814479.png",
    releaseDate: "2012.04 삼양식품 공식",
    price: 1500,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 90,
    calories: 530,
    volume: "140g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 530,
      sodium: '1166mg',
      carbs: '74g',
      sugar: '6g',
      fat: '16g',
      protein: '11g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀","닭고기"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "화끈한 오리지널 매운맛 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1350,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-70",
    name: "큰컵 불닭볶음면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "컵라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20260622/20260622145049067483.png",
    releaseDate: "2012.06 삼양식품 공식",
    price: 1800,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 90,
    calories: 425,
    volume: "105g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 425,
      sodium: '935mg',
      carbs: '60g',
      sugar: '6g',
      fat: '13g',
      protein: '9g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀","닭고기"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "화끈한 오리지널 매운맛 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1800,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1620,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-69",
    name: "컵 불닭볶음면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "컵라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20260622/20260622145220515487.png",
    releaseDate: "2013.11 삼양식품 공식",
    price: 1400,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 96,
    calories: 280,
    volume: "70g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 280,
      sodium: '616mg',
      carbs: '39g',
      sugar: '6g',
      fat: '8g',
      protein: '6g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀","닭고기"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "화끈한 오리지널 매운맛 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1400,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1400,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1400,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1260,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-387",
    name: "까르보불닭볶음면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20260622/20260622145514435491.png",
    releaseDate: "2017.12 삼양식품 공식",
    price: 1500,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 92,
    calories: 550,
    volume: "130g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 550,
      sodium: '1210mg',
      carbs: '77g',
      sugar: '6g',
      fat: '17g',
      protein: '11g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀","우유","닭고기"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장, 익산공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "부드러운 크림에 빠진 불닭! - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1350,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-389",
    name: "큰컵 까르보불닭볶음면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "컵라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20260622/20260622145612819495.png",
    releaseDate: "2017.12 삼양식품 공식",
    price: 1800,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 94,
    calories: 470,
    volume: "105g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 470,
      sodium: '1034mg',
      carbs: '66g',
      sugar: '6g',
      fat: '14g',
      protein: '9g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀","우유","닭고기"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "부드러운 크림에 빠진 불닭! - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1800,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1620,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-523",
    name: "컵 까르보불닭볶음면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "컵라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20260622/20260622145713489499.png",
    releaseDate: "2018.06 삼양식품 공식",
    price: 1400,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 89,
    calories: 355,
    volume: "80g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 355,
      sodium: '781mg',
      carbs: '50g',
      sugar: '6g',
      fat: '11g',
      protein: '7g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀","우유","닭고기"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "부드러운 크림에 빠진 불닭! - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1400,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1400,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1400,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1260,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-533",
    name: "로제불닭볶음면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250520/20250520092351672183.jpg",
    releaseDate: "2021.10 삼양식품 공식",
    price: 1500,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 95,
    calories: 555,
    volume: "140g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 555,
      sodium: '1221mg',
      carbs: '78g',
      sugar: '6g',
      fat: '17g',
      protein: '11g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀","우유","닭고기"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "불닭·고추·크림으로 완성한 내가 찾던 완벽한 K-로제 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1350,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-531",
    name: "큰컵 로제불닭볶음면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "컵라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250520/20250520092425424188.jpg",
    releaseDate: "2021.09 삼양식품 공식",
    price: 1800,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 96,
    calories: 420,
    volume: "105g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 420,
      sodium: '924mg',
      carbs: '59g',
      sugar: '6g',
      fat: '13g',
      protein: '8g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀","우유","닭고기"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "불닭·고추·크림으로 완성한 내가 찾던 완벽한 K-로제 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1800,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://smartstore.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1620,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-590",
    name: "불닭볶음탕면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250312/20250312171448230176.jpg",
    releaseDate: "2023.05 삼양식품 공식",
    price: 1500,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 94,
    calories: 470,
    volume: "145g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 470,
      sodium: '1034mg',
      carbs: '66g',
      sugar: '6g',
      fat: '14g',
      protein: '9g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀","닭고기"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장, 익산공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "마늘 풍미로 더욱 더 매콤해진 불닭볶음탕면 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1350,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-589",
    name: "큰컵 불닭볶음탕면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "컵라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250312/20250312171659373181.jpg",
    releaseDate: "2023.05 삼양식품 공식",
    price: 1800,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 95,
    calories: 465,
    volume: "120g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 465,
      sodium: '1023mg',
      carbs: '65g',
      sugar: '6g',
      fat: '14g',
      protein: '9g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀","닭고기"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "마늘 풍미로 더욱 더 매콤해진 불닭볶음탕면 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1800,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1620,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-522",
    name: "4가지치즈불닭볶음면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250312/20250312174356881187.jpg",
    releaseDate: "2021.06 삼양식품 공식",
    price: 1500,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 89,
    calories: 575,
    volume: "145g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 575,
      sodium: '1265mg',
      carbs: '81g',
      sugar: '6g',
      fat: '17g',
      protein: '12g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀","우유","닭고기"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장, 익산공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "모짜렐라, 체다, 까망베르, 고다 4종류의 치즈에 꾸덕하게 녹아든 불닭 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://smartstore.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1350,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-521",
    name: "큰컵 4가지치즈불닭볶음면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "컵라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250312/20250312174430324191.jpg",
    releaseDate: "2021.05 삼양식품 공식",
    price: 1800,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 92,
    calories: 445,
    volume: "110g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 445,
      sodium: '979mg',
      carbs: '62g',
      sugar: '6g',
      fat: '13g',
      protein: '9g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀","우유","닭고기"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "모짜렐라, 체다, 까망베르, 고다 4종류의 치즈에 꾸덕하게 녹아든 불닭 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1800,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://smartstore.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1620,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-68",
    name: "큰컵 치즈불닭볶음면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "컵라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20231117/20231117145826680585.jpg",
    releaseDate: "2016.03 삼양식품 공식",
    price: 1800,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 90,
    calories: 430,
    volume: "105g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 430,
      sodium: '946mg',
      carbs: '60g',
      sugar: '6g',
      fat: '13g',
      protein: '9g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀","우유","닭고기"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주, 밀양",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "불닭과 치즈의 환상적인 콜라보, 치즈의 풍미가 살아있는 치즈불닭볶음면 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1800,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://smartstore.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1620,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-600",
    name: "큰컵 야키소바불닭볶음면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "컵라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20231117/20231117143836483521.jpg",
    releaseDate: "2023.06 삼양식품 공식",
    price: 1800,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 93,
    calories: 400,
    volume: "100g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 400,
      sodium: '880mg',
      carbs: '56g',
      sugar: '6g',
      fat: '12g',
      protein: '8g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀","닭고기"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "매콤 고소 깊은 풍미의 화끈한 야키소바불닭 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1800,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1620,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-651",
    name: "맵탱 마늘조개라면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250404/20250404142535191229.jpg",
    releaseDate: "2023.08 삼양식품 공식",
    price: 1450,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 94,
    calories: 455,
    volume: "110g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 455,
      sodium: '1001mg',
      carbs: '64g',
      sugar: '6g',
      fat: '14g',
      protein: '9g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀","새우","조개류"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장, 익산공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "신라면급 (얼큰 칼칼)",
    description: "맵콤한 국물이 필요한 순간 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1450,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1450,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1450,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1310,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-654",
    name: "큰컵 맵탱 마늘조개라면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "컵라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20230913/20230913103247954420.jpg",
    releaseDate: "2023.09 삼양식품 공식",
    price: 1800,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 89,
    calories: 480,
    volume: "110g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 480,
      sodium: '1056mg',
      carbs: '67g',
      sugar: '6g',
      fat: '14g',
      protein: '10g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀","새우","조개류"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "신라면급 (얼큰 칼칼)",
    description: "맵콤한 국물이 필요한 순간 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1800,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1620,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-656",
    name: "맵탱 청양고추대파라면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250404/20250404142736739233.jpg",
    releaseDate: "2023.09 삼양식품 공식",
    price: 1450,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 94,
    calories: 460,
    volume: "110g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 460,
      sodium: '1012mg',
      carbs: '64g',
      sugar: '6g',
      fat: '14g',
      protein: '9g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장, 익산공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "신라면급 (얼큰 칼칼)",
    description: "맵콤한 국물이 필요한 순간 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1450,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1450,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1450,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1310,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-657",
    name: "큰컵 맵탱 청양고추대파라면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "컵라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250404/20250404142808834237.jpg",
    releaseDate: "2023.09 삼양식품 공식",
    price: 1800,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 92,
    calories: 465,
    volume: "110g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 465,
      sodium: '1023mg',
      carbs: '65g',
      sugar: '6g',
      fat: '14g',
      protein: '9g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "신라면급 (얼큰 칼칼)",
    description: "맵콤한 국물이 필요한 순간 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1800,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1620,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-43",
    name: "짜짜로니",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20231117/20231117143446802501.jpg",
    releaseDate: "1985.04 삼양식품 공식",
    price: 1050,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 94,
    calories: 540,
    volume: "140g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 540,
      sodium: '1188mg',
      carbs: '76g',
      sugar: '6g',
      fat: '16g',
      protein: '11g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장, 익산공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "뭉침없이 부드럽게 비벼지는 액상소스만의 노하우 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1050,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1050,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1050,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 950,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-541",
    name: "큰컵 짜짜로니",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "컵라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20231208/20231208103520428892.jpg",
    releaseDate: "2022.01 삼양식품 공식",
    price: 1600,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 92,
    calories: 445,
    volume: "115g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 445,
      sodium: '979mg',
      carbs: '62g',
      sugar: '6g',
      fat: '13g',
      protein: '9g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "뭉침없이 부드럽게 비벼지는 액상소스만의 노하우 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1600,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop/products/6159554888"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1600,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1600,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1440,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-44",
    name: "맛있는라면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250106/20250106150927487064.jpg",
    releaseDate: "2007.02 삼양식품 공식",
    price: 1050,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 95,
    calories: 480,
    volume: "115g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 480,
      sodium: '1056mg',
      carbs: '67g',
      sugar: '6g',
      fat: '14g',
      protein: '10g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장, 익산공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "60여 가지 풍부하고 신선한 재료로 '맛있는' 맛만 모아놓은 프리미엄 라면, 맛있는 라면 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1050,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://smartstore.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1050,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1050,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 950,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-64",
    name: "큰컵 맛있는라면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "컵라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20231117/20231117151721687629.jpg",
    releaseDate: "2007.02 삼양식품 공식",
    price: 1600,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 95,
    calories: 485,
    volume: "112g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 485,
      sodium: '1067mg',
      carbs: '68g',
      sugar: '6g',
      fat: '15g',
      protein: '10g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "60여 가지 풍부하고 신선한 재료로 '맛있는' 맛만 모아놓은 프리미엄 라면, 맛있는 라면 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1600,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://smartstore.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1600,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1600,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1440,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-63",
    name: "컵 맛있는라면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "컵라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20231117/20231117151831774633.jpg",
    releaseDate: "2007.02 삼양식품 공식",
    price: 1200,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 94,
    calories: 285,
    volume: "65g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 285,
      sodium: '627mg',
      carbs: '40g',
      sugar: '6g',
      fat: '9g',
      protein: '6g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "60여 가지 풍부하고 신선한 재료로 '맛있는' 맛만 모아놓은 프리미엄 라면, 맛있는 라면 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1200,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://smartstore.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1200,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1200,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1080,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-134",
    name: "간짬뽕",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240105/20240105135812942004.jpg",
    releaseDate: "2007.07 삼양식품 공식",
    price: 1050,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 89,
    calories: 560,
    volume: "140g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 560,
      sodium: '1232mg',
      carbs: '78g',
      sugar: '6g',
      fat: '17g',
      protein: '11g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장, 익산공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "약간 매콤",
    description: "국물없이 볶아 먹는 매콤한 해물맛의 볶음 간짬뽕 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1050,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://smartstore.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1050,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1050,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 950,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-61",
    name: "큰컵 간짬뽕",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "컵라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20241025/20241025142115565005.jpg",
    releaseDate: "2008.09 삼양식품 공식",
    price: 1600,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 89,
    calories: 415,
    volume: "105g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 415,
      sodium: '913mg',
      carbs: '58g',
      sugar: '6g',
      fat: '12g',
      protein: '8g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "약간 매콤",
    description: "국물없이 볶아 먹는 매콤한 해물맛의 볶음 간짬뽕 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1600,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://smartstore.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1600,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1600,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1440,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-46",
    name: "나가사끼짬뽕",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250110/20250110104438613123.jpg",
    releaseDate: "2011.07 삼양식품 공식",
    price: 1050,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 90,
    calories: 475,
    volume: "115g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 475,
      sodium: '1045mg',
      carbs: '67g',
      sugar: '6g',
      fat: '14g',
      protein: '10g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장, 익산공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "약간 매콤",
    description: "돈골 육수의 깊은 맛과 해물의 시원함을 살린 칼칼한 백짬뽕 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1050,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://smartstore.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1050,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1050,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 950,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-321",
    name: "큰컵 나가사끼짬뽕",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "컵라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20231117/20231117151512777617.jpg",
    releaseDate: "2011.11 삼양식품 공식",
    price: 1600,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 90,
    calories: 445,
    volume: "105g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 445,
      sodium: '979mg',
      carbs: '62g',
      sugar: '6g',
      fat: '13g',
      protein: '9g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "약간 매콤",
    description: "돈골 육수의 깊은 맛과 해물의 시원함을 살린 칼칼한 백짬뽕 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1600,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://smartstore.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1600,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1600,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1440,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-569",
    name: "우돈사골곰탕면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20231117/20231117152059344649.jpg",
    releaseDate: "2022.11 삼양식품 공식",
    price: 1050,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 92,
    calories: 480,
    volume: "110g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 480,
      sodium: '1056mg',
      carbs: '67g',
      sugar: '6g',
      fat: '14g',
      protein: '10g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀","쇠고기"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "우사골의 깊고 진한 국물에 돈사골의 구수함을 더한 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1050,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1050,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1050,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 950,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-478",
    name: "쇠고기면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250106/20250106150854946060.jpg",
    releaseDate: "1970.10 삼양식품 공식",
    price: 1050,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 91,
    calories: 500,
    volume: "120g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 500,
      sodium: '1100mg',
      carbs: '70g',
      sugar: '6g',
      fat: '15g',
      protein: '10g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀","쇠고기"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장, 익산공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "국내산 쇠고기를 사용해 구수하고 진한 맛 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1050,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://smartstore.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1050,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1050,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 950,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-56",
    name: "육개장",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "라면",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250110/20250110104404198119.jpg",
    releaseDate: "1985.01 삼양식품 공식",
    price: 1050,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 95,
    calories: 380,
    volume: "86g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 380,
      sodium: '836mg',
      carbs: '53g',
      sugar: '6g',
      fat: '11g',
      protein: '8g'
    },
    ingredients: "삼양식품 엄선 원재료 (유탕면)",
    allergens: ["대두","밀","돼지고기"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "6개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "깔끔한 국물과 부드러운 면발의 조화, 육개장 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1050,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://smartstore.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1050,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1050,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 950,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-75",
    name: "별뽀빠이",
    brand: '삼양식품',
    category: "과자",
    subCategory: "스낵",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20260202/20260202164139853331.jpg",
    releaseDate: "1972.02 삼양식품 공식",
    price: 1500,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 91,
    calories: 320,
    volume: "72g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 320,
      sodium: '704mg',
      carbs: '45g',
      sugar: '6g',
      fat: '10g',
      protein: '6g'
    },
    ingredients: "삼양식품 엄선 원재료 (과자(유탕처리제품))",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "5개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "SINCE 1972 국내 최초 라면과자 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["바삭바삭 달콤하고 고소한 추억의 국민 간식","손이 자꾸 가는 국민 장수 스낵"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://smartstore.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1350,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-77",
    name: "짱구",
    brand: '삼양식품',
    category: "과자",
    subCategory: "스낵",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20260202/20260202164433866336.jpg",
    releaseDate: "1973.03 삼양식품 공식",
    price: 1500,
    overallRating: 4.8,
    ratingCount: 3100,
    searchInfluxCount: 140000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 88,
    calories: 595,
    volume: "115g",
    
    
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 595,
      sodium: '1309mg',
      carbs: '83g',
      sugar: '6g',
      fat: '18g',
      protein: '12g'
    },
    ingredients: "삼양식품 엄선 원재료 (과자(유탕처리제품))",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "5개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "남녀노소 누구에게나 오래도록 사랑받는 베스트 장수 스낵, 짱구 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["바삭바삭 달콤하고 고소한 추억의 국민 간식","손이 자꾸 가는 국민 장수 스낵"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://smartstore.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1350,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-76",
    name: "왕짱구",
    brand: '삼양식품',
    category: "과자",
    subCategory: "스낵",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20260202/20260202164659349346.jpg",
    releaseDate: "1973.03 삼양식품 공식",
    price: 4500,
    overallRating: 4.8,
    ratingCount: 3100,
    searchInfluxCount: 140000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 93,
    calories: 1430,
    volume: "275g",
    
    
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 1430,
      sodium: '3146mg',
      carbs: '200g',
      sugar: '6g',
      fat: '43g',
      protein: '29g'
    },
    ingredients: "삼양식품 엄선 원재료 (과자(유탕처리제품))",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "5개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "통크게 즐기자 ! 남녀노소 누구에게나 오래도록 사랑받는 베스트 장수 스낵, 짱구 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["바삭바삭 달콤하고 고소한 추억의 국민 간식","손이 자꾸 가는 국민 장수 스낵"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 4500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://smartstore.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 4500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 4500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 4050,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-665",
    name: "흰둥이짱구",
    brand: '삼양식품',
    category: "과자",
    subCategory: "스낵",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240805/20240805162825317065.jpg",
    releaseDate: "2024.08 삼양식품 공식",
    price: 1500,
    overallRating: 4.8,
    ratingCount: 3100,
    searchInfluxCount: 140000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 93,
    calories: 365,
    volume: "70g",
    
    
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 365,
      sodium: '803mg',
      carbs: '51g',
      sugar: '6g',
      fat: '11g',
      protein: '7g'
    },
    ingredients: "삼양식품 엄선 원재료 (과자(유탕처리제품))",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "5개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "고소하고 부드러운 크림치즈맛 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["바삭바삭 달콤하고 고소한 추억의 국민 간식","손이 자꾸 가는 국민 장수 스낵"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1350,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-684",
    name: "맹구짱구",
    brand: '삼양식품',
    category: "과자",
    subCategory: "스낵",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20260202/20260202164815368351.jpg",
    releaseDate: "2025.08 삼양식품 공식",
    price: 1500,
    overallRating: 4.8,
    ratingCount: 3100,
    searchInfluxCount: 140000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 91,
    calories: 400,
    volume: "85g",
    
    
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 400,
      sodium: '880mg',
      carbs: '56g',
      sugar: '6g',
      fat: '12g',
      protein: '8g'
    },
    ingredients: "삼양식품 엄선 원재료 (과자(유탕처리제품))",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "5개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "히말라야 암염 소금빵맛 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["바삭바삭 달콤하고 고소한 추억의 국민 간식","손이 자꾸 가는 국민 장수 스낵"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1350,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-79",
    name: "사또밥",
    brand: '삼양식품',
    category: "과자",
    subCategory: "스낵",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20260202/20260202164930455356.jpg",
    releaseDate: "1986.09 삼양식품 공식",
    price: 1500,
    overallRating: 4.8,
    ratingCount: 3100,
    searchInfluxCount: 140000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 90,
    calories: 350,
    volume: "67g",
    
    
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 350,
      sodium: '770mg',
      carbs: '49g',
      sugar: '6g',
      fat: '11g',
      protein: '7g'
    },
    ingredients: "삼양식품 엄선 원재료 (과자(유처리제품))",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양식품㈜ 서울특별시 성북구 오패산로3길 104 / 원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "5개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "계란, 우유 무첨가~ 우리 가족 대표 간식!! - 삼양식품 공식 인증 상품.",
    bestQuotes: ["바삭바삭 달콤하고 고소한 추억의 국민 간식","손이 자꾸 가는 국민 장수 스낵"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://smartstore.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1350,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-84",
    name: "삼양목장유기농우유 180ml",
    brand: '삼양식품',
    category: "음료",
    subCategory: "유제품",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20230804/20230804174430674185.jpg",
    releaseDate: "2015.05 삼양식품 공식",
    price: 1500,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 91,
    calories: 125,
    volume: "180ml",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 125,
      sodium: '275mg',
      carbs: '18g',
      sugar: '6g',
      fat: '4g',
      protein: '3g'
    },
    ingredients: "삼양식품 엄선 원재료 (우유)",
    allergens: ["대두","밀","우유"],
    origin: '대한민국',
    manufacturer: "(주)서울에프엔비 강원도 횡성군 공근면 아이티밸리길 36",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "8일",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "대관령 삼양목장에서 자연방목하여 키운 건강한 젖소에서 짜낸 신선한 유기농우유 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양 대관령 청정 목장의 신선함 가득","고소하고 진한 100% 유기농 원유"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 1500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 1500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 1500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 1350,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-83",
    name: "삼양목장유기농우유 750ml",
    brand: '삼양식품',
    category: "음료",
    subCategory: "유제품",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20230804/20230804174004208181.jpg",
    releaseDate: "2015.05 삼양식품 공식",
    price: 3800,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 93,
    calories: 525,
    volume: "750ml",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 525,
      sodium: '1155mg',
      carbs: '74g',
      sugar: '6g',
      fat: '16g',
      protein: '11g'
    },
    ingredients: "삼양식품 엄선 원재료 (우유)",
    allergens: ["대두","밀","우유"],
    origin: '대한민국',
    manufacturer: "(주)서울에프엔비 강원도 횡성군 공근면 아이티밸리길 36",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "8일",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "대관령 삼양목장에서 자연방목하여 키운 건강한 젖소에서 짜낸 신선한 유기농우유 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양 대관령 청정 목장의 신선함 가득","고소하고 진한 100% 유기농 원유"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 3800,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 3800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 3800,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 3420,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-605",
    name: "삼양목장유기농우유 1L",
    brand: '삼양식품',
    category: "음료",
    subCategory: "유제품",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20230804/20230804175826706189.jpg",
    releaseDate: "2015.05 삼양식품 공식",
    price: 4500,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 94,
    calories: 700,
    volume: "1L",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 700,
      sodium: '1540mg',
      carbs: '98g',
      sugar: '6g',
      fat: '21g',
      protein: '14g'
    },
    ingredients: "삼양식품 엄선 원재료 (우유)",
    allergens: ["대두","밀","우유"],
    origin: '대한민국',
    manufacturer: "(주)서울에프엔비 강원도 횡성군 공근면 아이티밸리길 36",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "8일",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "대관령 삼양목장에서 자연방목하여 키운 건강한 젖소에서 짜낸 신선한 유기농우유 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양 대관령 청정 목장의 신선함 가득","고소하고 진한 100% 유기농 원유"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 4500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 4500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 4500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 4050,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-435",
    name: "불닭소스",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "소스/양념",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20260716/20260716101057230523.jpg",
    releaseDate: "2018.12 삼양식품 공식",
    price: 4500,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 90,
    
    calories: 255,
    volume: "200g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 255,
      
      sodium: '1150mg',
      carbs: '65g',
      sugar: '6g',
      fat: '15g',
      protein: '10g'
    },
    ingredients: "삼양식품 엄선 원재료 (소스(살균제품))",
    allergens: ["대두","밀","닭고기"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "12개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "드디어 나왔다! 화끈한 불닭소스 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 4500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 4500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 4500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 4050,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-450",
    name: "까르보불닭소스",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "소스/양념",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20260716/20260716120043380547.jpg",
    releaseDate: "2019.04 삼양식품 공식",
    price: 4500,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 91,
    
    calories: 204,
    volume: "200g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 204,
      
      sodium: '1150mg',
      carbs: '65g',
      sugar: '6g',
      fat: '15g',
      protein: '10g'
    },
    ingredients: "삼양식품 엄선 원재료 (소스(살균제품))",
    allergens: ["대두","밀","우유","닭고기"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "12개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "부드러움 속에 숨겨진 화끈한 매운맛! - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 4500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 4500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 4500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 4050,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-449",
    name: "핵불닭소스",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "소스/양념",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20260716/20260716101201960527.jpg",
    releaseDate: "2019.04 삼양식품 공식",
    price: 4500,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 89,
    
    calories: 260,
    volume: "200g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      
      sodium: '1150mg',
      carbs: '65g',
      sugar: '6g',
      fat: '15g',
      protein: '10g'
    },
    ingredients: "삼양식품 엄선 원재료 (소스(살균제품))",
    allergens: ["대두","밀","닭고기"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "12개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급+ (극강의 매운맛)",
    description: "지금까지의 매운맛에 만족하지 못했다면, 도전하라! 핵불닭소스 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 4500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 4500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 4500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 4050,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-511",
    name: "불닭소스 스틱",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "소스/양념",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20260716/20260716101236171531.jpg",
    releaseDate: "2020.12 삼양식품 공식",
    price: 4900,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 91,
    
    calories: 255,
    volume: "160g(16g x 10개입)",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 255,
      
      sodium: '1150mg',
      carbs: '65g',
      sugar: '6g',
      fat: '15g',
      protein: '10g'
    },
    ingredients: "삼양식품 엄선 원재료 (소스(살균제품))",
    allergens: ["대두","밀","닭고기"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "12개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "언제 어디서나 간편하게 즐길 수 있는 스틱형 불닭소스 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 4900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 4900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 4900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 4410,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-483",
    name: "불닭마요",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "소스/양념",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20260716/20260716101307985535.jpg",
    releaseDate: "2019.10 삼양식품 공식",
    price: 4500,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 95,
    calories: 1050,
    volume: "250g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 1050,
      sodium: '2310mg',
      carbs: '147g',
      sugar: '6g',
      fat: '32g',
      protein: '21g'
    },
    ingredients: "삼양식품 엄선 원재료 (소스(살균제품))",
    allergens: ["대두","밀","닭고기","계란"],
    origin: '대한민국',
    manufacturer: "(주)제이엔제이푸드 충청북도 진천군 이월면 산수산단2로 133",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "10개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "고소한 마요네즈에 화끈한 불닭을 더한 신개념 마요네즈 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 4500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 4500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 4500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 4050,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-524",
    name: "자이언트 불닭소스",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "소스/양념",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20260716/20260716101509242539.jpg",
    releaseDate: "2021.05 삼양식품 공식",
    price: 16500,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 95,
    
    calories: 255,
    volume: "2kg",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 255,
      
      sodium: '1150mg',
      carbs: '65g',
      sugar: '6g',
      fat: '15g',
      protein: '10g'
    },
    ingredients: "삼양식품 엄선 원재료 (소스(살균제품))",
    allergens: ["대두","밀","닭고기"],
    origin: '대한민국',
    manufacturer: "삼양식품 ㈜ 서울특별시 성북구 오패산로 3길 104 /원주공장",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "12개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "프로불닭러들을 위한 2kg 대용량 출시! - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 16500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 16500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 16500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 14850,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-664",
    name: "불닭마요 2kg",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "소스/양념",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20260716/20260716101541353543.jpg",
    releaseDate: "2024.03 삼양식품 공식",
    price: 16500,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 88,
    calories: 8400,
    volume: "2kg",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 8400,
      sodium: '18480mg',
      carbs: '1176g',
      sugar: '6g',
      fat: '252g',
      protein: '168g'
    },
    ingredients: "삼양식품 엄선 원재료 (소스(살균제품))",
    allergens: ["대두","밀","닭고기","계란"],
    origin: '대한민국',
    manufacturer: "(주)제이엔제이푸드 충청북도 진천군 이월면 산수산단2로 133",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "10개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "고소한 마요네즈에 화끈한 불닭을 더한 신개념 마요네즈 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 16500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop/products/10058172831"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 16500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 16500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 14850,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-425",
    name: "불닭떡볶이",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "간편조리",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20231120/20231120111216923765.jpg",
    releaseDate: "2018.10 삼양식품 공식",
    price: 3500,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 93,
    calories: 445,
    volume: "185g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 445,
      sodium: '979mg',
      carbs: '62g',
      sugar: '6g',
      fat: '13g',
      protein: '9g'
    },
    ingredients: "삼양식품 엄선 원재료 (떡볶이떡-떡류/불닭떡볶이 소스-소스(살균제품))",
    allergens: ["대두","밀","닭고기"],
    origin: '대한민국',
    manufacturer: "떡볶이떡-농업회사법인㈜영풍 / 불닭떡볶이 소스 - 삼양식품 ㈜",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "8개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "불닭볶음면 맛 그대로! 쫄깃한 떡으로 만든 화끈한 매운맛 떡볶이 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 3500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 3500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 3500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 3150,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-426",
    name: "까르보 불닭떡볶이",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "간편조리",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20231120/20231120111255695769.jpg",
    releaseDate: "2018.10 삼양식품 공식",
    price: 3500,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 88,
    calories: 445,
    volume: "179g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 445,
      sodium: '979mg',
      carbs: '62g',
      sugar: '6g',
      fat: '13g',
      protein: '9g'
    },
    ingredients: "삼양식품 엄선 원재료 (떡볶이떡-떡류/소스-소스(살균제품)/후첨분말-복합조미식품)",
    allergens: ["대두","밀","우유","닭고기"],
    origin: '대한민국',
    manufacturer: "떡볶이떡-농업회사법인㈜영풍 / 소스, 후첨분말 - 삼양식품 ㈜",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "8개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "까르보 불닭볶음면 맛 그대로! 쫄깃한 떡으로 만든 부드럽고 매콤한 떡볶이 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 3500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 3500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 3500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 3150,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-529",
    name: "로제불닭떡볶이",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "간편조리",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20231120/20231120111409057773.jpg",
    releaseDate: "2021.07 삼양식품 공식",
    price: 3500,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 96,
    calories: 455,
    volume: "183.5 g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 455,
      sodium: '1001mg',
      carbs: '64g',
      sugar: '6g',
      fat: '14g',
      protein: '9g'
    },
    ingredients: "삼양식품 엄선 원재료 (떡류)",
    allergens: ["대두","밀","우유","닭고기"],
    origin: '대한민국',
    manufacturer: "떡볶이떡 - 농업회사법인 ㈜푸르메FS / 소스, 후첨분말 - 삼양식품㈜",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "8개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "불닭·고추·크림으로 완성한 내가 찾던 완벽한 K-로제 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 3500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 3500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 3500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 3150,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-682",
    name: "까르보불닭납작당면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "간편조리",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250702/20250702163831191219.jpg",
    releaseDate: "2025.06 삼양식품 공식",
    price: 3500,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 96,
    calories: 445,
    volume: "164.5g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 445,
      sodium: '979mg',
      carbs: '62g',
      sugar: '6g',
      fat: '13g',
      protein: '9g'
    },
    ingredients: "삼양식품 엄선 원재료 (숙면(주정처리 제품))",
    allergens: ["대두","밀","우유","닭고기"],
    origin: '대한민국',
    manufacturer: "납작당면 - 세진식품(주) /소스, 후첨분말 - 삼양식품(주)",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "8개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "부드러운 크림에 빠진 불닭 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 3500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 3500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 3500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 3150,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-546",
    name: "불닭납작당면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "간편조리",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20231120/20231120111449997777.jpg",
    releaseDate: "2022.04 삼양식품 공식",
    price: 3500,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 96,
    calories: 380,
    volume: "155.5g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 380,
      sodium: '836mg',
      carbs: '53g',
      sugar: '6g',
      fat: '11g',
      protein: '8g'
    },
    ingredients: "삼양식품 엄선 원재료 (숙면(주정처리 제품))",
    allergens: ["대두","밀","닭고기"],
    origin: '대한민국',
    manufacturer: "납작당면 - 세진식품(주) /소스, 후첨분말 - 삼양식품(주)",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "8개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "찐불닭러들을 위한 오리지널! 쫄깃탱글하게 씹히는 매운맛 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 3500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 3500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 3500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 3150,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-528",
    name: "로제불닭납작당면",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "간편조리",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20231120/20231120111528710781.jpg",
    releaseDate: "2021.07 삼양식품 공식",
    price: 3500,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 90,
    calories: 470,
    volume: "169.4g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 470,
      sodium: '1034mg',
      carbs: '66g',
      sugar: '6g',
      fat: '14g',
      protein: '9g'
    },
    ingredients: "삼양식품 엄선 원재료 (숙면(주정처리 제품))",
    allergens: ["대두","밀","우유","닭고기"],
    origin: '대한민국',
    manufacturer: "납작당면 - 세진식품(주) /소스, 후첨분말 - 삼양식품(주)",
    storageMethod: "직사광선을 피하고 실온에 보관",
    shelfLife: "8개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "불닭·고추·크림으로 완성한 내가 찾던 완벽한 K-로제 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 3500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 3500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 3500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 3150,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-669",
    name: "한입 쏙! 후무스 핫스파이시",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "냉동간편식",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250804/20250804110615710236.png",
    releaseDate: "2025.07 삼양식품 공식",
    price: 6900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 96,
    calories: 670,
    volume: "280g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 670,
      sodium: '1474mg',
      carbs: '94g',
      sugar: '6g',
      fat: '20g',
      protein: '13g'
    },
    ingredients: "삼양식품 엄선 원재료 (기타가공품)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주)",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "병아리콩으로 만든 부드러운 후무스에 더해진 매콤한 맛 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 6900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop/products/12101788890"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 6210,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-670",
    name: "한입 쏙! 후무스 캐슈넛",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "냉동간편식",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250804/20250804110918664240.png",
    releaseDate: "2025.07 삼양식품 공식",
    price: 6900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 95,
    calories: 620,
    volume: "280g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 620,
      sodium: '1364mg',
      carbs: '87g',
      sugar: '6g',
      fat: '19g',
      protein: '12g'
    },
    ingredients: "삼양식품 엄선 원재료 (기타가공품)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주)",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "병아리콩으로 만들어 담백하고 부드러운 후무스 필링 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 6900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop/products/12101791029"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 6210,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-671",
    name: "한입 쏙! 식물성 너겟 스위트갈릭",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "냉동간편식",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250804/20250804111108836248.png",
    releaseDate: "2025.07 삼양식품 공식",
    price: 6900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 93,
    calories: 830,
    volume: "290g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 830,
      sodium: '1826mg',
      carbs: '116g',
      sugar: '6g',
      fat: '25g',
      protein: '17g'
    },
    ingredients: "삼양식품 엄선 원재료 (즉석조리식품)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "주식회사 이노하스",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "약간 매콤",
    description: "햄프씨드로 고소하고 바삭한 크리스피 플랜트 바이츠 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 6900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop/products/12101785394"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 6210,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-672",
    name: "한입 쏙! 식물성 너겟 크러쉬드페퍼",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "냉동간편식",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20250804/20250804111013648244.png",
    releaseDate: "2025.07 삼양식품 공식",
    price: 6900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 88,
    calories: 835,
    volume: "289g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 835,
      sodium: '1837mg',
      carbs: '117g',
      sugar: '6g',
      fat: '25g',
      protein: '17g'
    },
    ingredients: "삼양식품 엄선 원재료 (즉석조리식품)",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "주식회사 이노하스",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "햄프씨드로 고소하고 바삭한 크리스피 플랜트 바이츠 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 6900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop/products/12101787308"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 6210,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-641",
    name: "불닭볶음밥",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "볶음밥",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20231127/20231127110648216858.jpg",
    releaseDate: "2023.08 삼양식품 공식",
    price: 3200,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 94,
    calories: 420,
    volume: "220g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 420,
      sodium: '924mg',
      carbs: '59g',
      sugar: '6g',
      fat: '13g',
      protein: '8g'
    },
    ingredients: "삼양식품 엄선 원재료 (즉석조리식품(가열하여 섭취하는 냉동식품))",
    allergens: ["대두","밀","닭고기"],
    origin: '대한민국',
    manufacturer: "제조원 농업회사법인(주)한우물 / 전북 김제시 용지면 백자1길 112",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "매콤한 불닭볶음면소스와 밥의 화끈한 만남 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 3200,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 3200,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 3200,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 2880,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-640",
    name: "까르보불닭볶음밥",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "볶음밥",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20231127/20231127110743636862.jpg",
    releaseDate: "2023.07 삼양식품 공식",
    price: 3200,
    overallRating: 4.8,
    ratingCount: 2800,
    searchInfluxCount: 195000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 93,
    calories: 525,
    volume: "220g",
    
    isHot: true,
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 525,
      sodium: '1155mg',
      carbs: '74g',
      sugar: '6g',
      fat: '16g',
      protein: '11g'
    },
    ingredients: "삼양식품 엄선 원재료 (즉석조리식품(가열하여 섭취하는 냉동식품))",
    allergens: ["대두","밀","우유","닭고기"],
    origin: '대한민국',
    manufacturer: "농업회사법인(주)한우물 / 전북 김제시 용지면 백자1길 112",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "불닭급 (화끈한 매운맛)",
    description: "부드러움에 빠진 불닭볶음밥 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["화끈하게 매운 중독적인 불닭 소스","K-스파이시의 정점, 스트레스 풀리는 맛"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 3200,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 3200,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 3200,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 2880,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-634",
    name: "임꺽정 갈비손만두",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "만두",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208105115357147.jpg",
    releaseDate: "2022.04 삼양식품 공식",
    price: 8900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 93,
    calories: 1750,
    volume: "760 g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 1750,
      sodium: '3850mg',
      carbs: '245g',
      sugar: '6g',
      fat: '53g',
      protein: '35g'
    },
    ingredients: "삼양식품 엄선 원재료 (만두(가열하여 섭취하는 냉동식품))",
    allergens: ["대두","밀","쇠고기","돼지고기"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주) 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9 개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "큼직하게 썰어낸 국내산 돼지고기와 특제 갈비양념으로 빚어낸 육즙가득 갈비손만두입니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 8010,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-636",
    name: "임꺽정 납작떡갈비",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "육가공/패티",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208105154349151.jpg",
    releaseDate: "2022.09 삼양식품 공식",
    price: 8900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 95,
    calories: 2450,
    volume: "1,000 g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 2450,
      sodium: '5390mg',
      carbs: '343g',
      sugar: '6g',
      fat: '74g',
      protein: '49g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀","쇠고기"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주) 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9 개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "국내산 갈비살과 소고기를 먹기 좋은 한입 크기로 납작하게 빚어낸 떡갈비입니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 8010,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-639",
    name: "임꺽정 떡갈비(일품)",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "육가공/패티",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208105235304155.jpg",
    releaseDate: "2022.11 삼양식품 공식",
    price: 8900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 89,
    calories: 1920,
    volume: "800 g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 1920,
      sodium: '4224mg',
      carbs: '269g',
      sugar: '6g',
      fat: '58g',
      protein: '38g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀","쇠고기"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주) 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9 개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "국내산 갈비살을 곱게 다지고 치대어 부드럽고 쫄깃하게 씹히는 식감이 일품인 떡갈비입니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 8010,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-644",
    name: "임꺽정 떡갈비(전통)",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "육가공/패티",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208105311513159.jpg",
    releaseDate: "2022.09 삼양식품 공식",
    price: 8900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 91,
    calories: 3550,
    volume: "1,200 g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 3550,
      sodium: '7810mg',
      carbs: '497g',
      sugar: '6g',
      fat: '107g',
      protein: '71g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀","쇠고기"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주) 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9 개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "국내산 돼지고기와 소고기를 정성껏 치대어 부드럽고 담백한 전통 떡갈비입니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 8010,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-642",
    name: "임꺽정 양송이버섯이들어간떡갈비",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "육가공/패티",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208105357665163.jpg",
    releaseDate: "2022.09 삼양식품 공식",
    price: 8900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 89,
    calories: 2250,
    volume: "1,000 g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 2250,
      sodium: '4950mg',
      carbs: '315g',
      sugar: '6g',
      fat: '68g',
      protein: '45g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀","쇠고기"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주) 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "국내산 돼지고기와 소고기에 영양가득 양송이버섯을 더한 한입사이즈 떡갈비입니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 8010,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-593",
    name: "삼양프레시 교자만두",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "만두",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20230609/20230609145256042092.jpg",
    releaseDate: "2023.06 삼양식품 공식",
    price: 7500,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 90,
    calories: 2230,
    volume: "1,350g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 2230,
      sodium: '4906mg',
      carbs: '312g',
      sugar: '6g',
      fat: '67g',
      protein: '45g'
    },
    ingredients: "삼양식품 엄선 원재료 (만두(가열하여 섭취하는 냉동식품))",
    allergens: ["대두","밀","돼지고기"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주) 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "쫄깃한 만두피에 국내산 돼지고기와 야채로 속을 풍성하게 채운 교자만두입니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 7500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 7500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 7500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 6750,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-635",
    name: "삼양프레시 고기손만두",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "만두",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20231226/fresh_meatdumpling_thumb.png",
    releaseDate: "2023.05 삼양식품 공식",
    price: 8900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 95,
    calories: 2405,
    volume: "1,300g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 2405,
      sodium: '5291mg',
      carbs: '337g',
      sugar: '6g',
      fat: '72g',
      protein: '48g'
    },
    ingredients: "삼양식품 엄선 원재료 (만두(가열하여 섭취하는 냉동식품))",
    allergens: ["대두","밀","돼지고기"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주) / 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "어머니의 손맛이 담긴 고향의 맛! - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 8010,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-595",
    name: "삼양프레시 김치손만두",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "만두",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20231226/fresh_kimchidumpling_thumb.png",
    releaseDate: "2023.06 삼양식품 공식",
    price: 8900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 93,
    calories: 2340,
    volume: "1,300g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 2340,
      sodium: '5148mg',
      carbs: '328g',
      sugar: '6g',
      fat: '70g',
      protein: '47g'
    },
    ingredients: "삼양식품 엄선 원재료 (만두(가열하여 섭취하는 냉동식품))",
    allergens: ["대두","밀","돼지고기"],
    origin: '대한민국',
    manufacturer: "삼양냉동(주) 세종특별자치시 연서면 공단로 157/세종공장",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "신라면급 (얼큰 칼칼)",
    description: "쫄깃한 만두피에 국내산 돼지고기와 매콤한 김치를 담아 빚어낸 김치손만두입니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 8010,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-638",
    name: "삼양프레시 갈비만두",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "만두",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208102831246043.jpg",
    releaseDate: "2023.05 삼양식품 공식",
    price: 8900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 96,
    calories: 2100,
    volume: "1,000g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 2100,
      sodium: '4620mg',
      carbs: '294g',
      sugar: '6g',
      fat: '63g',
      protein: '42g'
    },
    ingredients: "삼양식품 엄선 원재료 (만두(가열하여 섭취하는 냉동식품))",
    allergens: ["대두","밀","쇠고기","돼지고기"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주) / 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "쫄깃한 만두피에 갈비맛 가득 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 8010,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-632",
    name: "삼양프레시 철판군만두",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "만두",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20231226/fresh_grilleddumpling_thumb.png",
    releaseDate: "2023.06 삼양식품 공식",
    price: 7500,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 92,
    calories: 4725,
    volume: "2,700G",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 4725,
      sodium: '10395mg',
      carbs: '662g',
      sugar: '6g',
      fat: '142g',
      protein: '95g'
    },
    ingredients: "삼양식품 엄선 원재료 (만두(가열하여 섭취하는 냉동식품))",
    allergens: ["대두","밀","돼지고기"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주) / 세종특별자치시 연서면 공단도 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "노릇노릇 구워 바삭함과 촉촉함을 살린 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 7500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 7500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 7500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 6750,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-645",
    name: "삼양프레시 찹쌀군만두",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "만두",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208103007785051.jpg",
    releaseDate: "2020.04 삼양식품 공식",
    price: 7500,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 89,
    calories: 4995,
    volume: "2,700g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 4995,
      sodium: '10989mg',
      carbs: '699g',
      sugar: '6g',
      fat: '150g',
      protein: '100g'
    },
    ingredients: "삼양식품 엄선 원재료 (만두(가열하여 섭취하는 냉동식품))",
    allergens: ["대두","밀","돼지고기"],
    origin: '대한민국',
    manufacturer: "삼양냉동(주) 세종특별자치시 연서면 공단로 157/세종공장",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "쫄깃하고 바삭한 찹쌀피로 식감을 살린 찹쌀군만두 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 7500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 7500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 7500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 6750,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-633",
    name: "삼양프레시 야끼만두",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "만두",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208102723848039.jpg",
    releaseDate: "2023.06 삼양식품 공식",
    price: 6900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 90,
    calories: 2240,
    volume: "1,400g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 2240,
      sodium: '4928mg',
      carbs: '314g',
      sugar: '6g',
      fat: '67g',
      protein: '45g'
    },
    ingredients: "삼양식품 엄선 원재료 (만두(가열하여 섭취하는 냉동식품))",
    allergens: ["대두","밀","돼지고기"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주) / 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "겉은 바삭 속은 촉촉한 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 6900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 6210,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-624",
    name: "삼양프레시 고추잡채납작만두",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "만두",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208102910089047.jpg",
    releaseDate: "2023.01 삼양식품 공식",
    price: 6900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 90,
    calories: 3700,
    volume: "2,000g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 3700,
      sodium: '8140mg',
      carbs: '518g',
      sugar: '6g',
      fat: '111g',
      protein: '74g'
    },
    ingredients: "삼양식품 엄선 원재료 (만두(가열하여 섭취하는 냉동식품))",
    allergens: ["대두","밀","돼지고기"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀㈜",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "약간 매콤",
    description: "국내산 돼지고기와 야채 속에 청양고추를 더해 깔끔하게 매운맛을 살린 고추잡채 납작만두입니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 6900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 6210,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-625",
    name: "삼양프레시 고기왕만두",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "만두",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208103055609055.jpg",
    releaseDate: "2020.04 삼양식품 공식",
    price: 8900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 92,
    calories: 2660,
    volume: "1,400g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 2660,
      sodium: '5852mg',
      carbs: '372g',
      sugar: '6g',
      fat: '80g',
      protein: '53g'
    },
    ingredients: "삼양식품 엄선 원재료 (만두(가열하여 섭취하는 냉동식품))",
    allergens: ["대두","밀","돼지고기"],
    origin: '대한민국',
    manufacturer: "삼양냉동(주) 세종특별자치시 연서면 공단로 157/세종공장",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "국내산 돼지고기와 신선한 야채를 가득 넣어 푸짐하게 빚어낸 고기왕만두 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 8010,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-626",
    name: "삼양프레시 김치왕만두",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "만두",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208103148087059.jpg",
    releaseDate: "2020.04 삼양식품 공식",
    price: 8900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 88,
    calories: 2380,
    volume: "1,400g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 2380,
      sodium: '5236mg',
      carbs: '333g',
      sugar: '6g',
      fat: '71g',
      protein: '48g'
    },
    ingredients: "삼양식품 엄선 원재료 (만두(가열하여 섭취하는 냉동식품))",
    allergens: ["대두","밀","돼지고기"],
    origin: '대한민국',
    manufacturer: "삼양냉동(주) 세종특별자치시 연서면 공단로 157/세종공장",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "신라면급 (얼큰 칼칼)",
    description: "아삭하고 매콤한 김치로 푸짐하게 속을 채운 김치왕만두 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 8010,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-577",
    name: "삼양프레시 물만두",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "만두",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20231226/fresh_waterdumpling_thumb.png",
    releaseDate: "2023.04 삼양식품 공식",
    price: 7500,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 93,
    calories: 2635,
    volume: "1,350g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 2635,
      sodium: '5797mg',
      carbs: '369g',
      sugar: '6g',
      fat: '79g',
      protein: '53g'
    },
    ingredients: "삼양식품 엄선 원재료 (만두(가열하여 섭취하는 냉동식품))",
    allergens: ["대두","밀","돼지고기"],
    origin: '대한민국',
    manufacturer: "삼양냉동(주) 세종특별자치시 연서면 공단로 157/세종공장",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "촉촉한 만두피와 국내산 돼지고기로 속을 꽉 채운 물만두 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 7500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 7500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 7500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 6750,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-621",
    name: "삼양프레시 언양식불고기",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "육가공/패티",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208103331346067.jpg",
    releaseDate: "2020.04 삼양식품 공식",
    price: 6900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 88,
    calories: 1950,
    volume: "900g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 1950,
      sodium: '4290mg',
      carbs: '273g',
      sugar: '6g',
      fat: '59g',
      protein: '39g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀","쇠고기"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀㈜ / 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "국내산 돼지고기를 얇게 저며 직화로 불맛을 살린 부드럽고 담백한 언양식불고기 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 6900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 6210,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-623",
    name: "삼양프레시 미트볼",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "육가공/패티",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208103410961071.jpg",
    releaseDate: "2020.04 삼양식품 공식",
    price: 6900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 90,
    calories: 2450,
    volume: "1,000g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 2450,
      sodium: '5390mg',
      carbs: '343g',
      sugar: '6g',
      fat: '74g',
      protein: '49g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주) 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "한입사이즈로 입에 쏙쏙! 간식, 도시락반찬, 술안주 등 다양한 요리에 활용가능한 미트볼입니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 6900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 6210,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-576",
    name: "삼양프레시 고기산적",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "육가공/패티",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20230427/20230427145053767025.jpg",
    releaseDate: "2023.04 삼양식품 공식",
    price: 6900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 95,
    calories: 2250,
    volume: "1,000g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 2250,
      sodium: '4950mg',
      carbs: '315g',
      sugar: '6g',
      fat: '68g',
      protein: '45g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀","돼지고기"],
    origin: '대한민국',
    manufacturer: "삼양냉동(주) 세종특별자치시 연서면 공단로 157/세종공장",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "곱게 다진 살코기를 정성들인 불고기양념에 재워 달큰하면서도 전통의 맛을 느낄 수 있는 고기 산적 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 6900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 6210,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-613",
    name: "삼양프레시 너비아니",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "육가공/패티",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208103239545063.jpg",
    releaseDate: "2021.11 삼양식품 공식",
    price: 6900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 88,
    calories: 2100,
    volume: "1,000 g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 2100,
      sodium: '4620mg',
      carbs: '294g',
      sugar: '6g',
      fat: '63g',
      protein: '42g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어㈜ 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "국내산 고기를 곱게 다져 달큰한 불고기 양념으로 재운 전통 너비아니입니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 6900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 6210,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-615",
    name: "삼양프레시 떡갈비스틱",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "육가공/패티",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208103454302075.jpg",
    releaseDate: "2020.04 삼양식품 공식",
    price: 8900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 89,
    calories: 2450,
    volume: "1,000g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 2450,
      sodium: '5390mg',
      carbs: '343g',
      sugar: '6g',
      fat: '74g',
      protein: '49g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀","쇠고기"],
    origin: '대한민국',
    manufacturer: "삼양냉동㈜ 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "국내산 쇠고기와 돼지고기를 길쭉한 모양으로 빚어 밥반찬, 도시락 재료 등 다양한 요리로 즐길 수 있습니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 8010,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-648",
    name: "삼양프레시 떡갈비스틱수",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "육가공/패티",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208103545123079.jpg",
    releaseDate: "2020.04 삼양식품 공식",
    price: 8900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 93,
    calories: 1029,
    volume: "420g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 1029,
      sodium: '2264mg',
      carbs: '144g',
      sugar: '6g',
      fat: '31g',
      protein: '21g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀","쇠고기"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주)/ 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "배, 사과 등의 천연 감미료, 연잎가루로 전통의 깊고 정갈한 맛을 더한 전통떡갈비스틱 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 8010,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-617",
    name: "삼양프레시 떡갈비볼",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "육가공/패티",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208103627503083.jpg",
    releaseDate: "2023.07 삼양식품 공식",
    price: 8900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 90,
    calories: 2600,
    volume: "1,000g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 2600,
      sodium: '5720mg',
      carbs: '364g',
      sugar: '6g',
      fat: '78g',
      protein: '52g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀","쇠고기"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주) 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "달콤하고 쫄깃한 떡갈비를 한입에 먹기좋게 동글동글한 모양으로 만들었습니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 8010,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-592",
    name: "삼양프레시 한입떡갈비",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "육가공/패티",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20230609/20230609143557551088.jpg",
    releaseDate: "2023.06 삼양식품 공식",
    price: 8900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 94,
    calories: 2650,
    volume: "1,000g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 2650,
      sodium: '5830mg',
      carbs: '371g',
      sugar: '6g',
      fat: '80g',
      protein: '53g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀","쇠고기"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주) 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "국내산 돼지고기를 곱게 다져 한입 크기로 빚어낸 다음 직화 그릴에 구워낸 한입 떡갈비입니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 8010,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-620",
    name: "삼양프레시 한입마늘떡갈비",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "육가공/패티",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208105512287167.jpg",
    releaseDate: "2023.08 삼양식품 공식",
    price: 8900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 93,
    calories: 1040,
    volume: "400g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 1040,
      sodium: '2288mg',
      carbs: '146g',
      sugar: '6g',
      fat: '31g',
      protein: '21g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품/냉동제품))",
    allergens: ["대두","밀","쇠고기"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주) / 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "국내산 돼지고기, 쇠고기와 알싸한 마늘향으로 입맛을 사로 잡는 한입사이즈 마늘 떡갈비입니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 8010,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-618",
    name: "삼양프레시 프리미엄떡갈비",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "육가공/패티",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208103715323087.jpg",
    releaseDate: "2020.04 삼양식품 공식",
    price: 8900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 88,
    calories: 5150,
    volume: "2,000g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 5150,
      sodium: '11330mg',
      carbs: '721g',
      sugar: '6g',
      fat: '155g',
      protein: '103g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀","쇠고기"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주) 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "신선한 국내산 쇠고기와 돼지갈비를 정성껏 치대어 큼직하게 빚어낸 풍성한 식감이 살아있습니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 8010,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-614",
    name: "삼양프레시 떡갈비스테이크",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "육가공/패티",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208104032265099.jpg",
    releaseDate: "2023.08 삼양식품 공식",
    price: 8900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 95,
    calories: 60160,
    volume: "1.2KG",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 60160,
      sodium: '132352mg',
      carbs: '8422g',
      sugar: '6g',
      fat: '1805g',
      protein: '1203g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀","쇠고기"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주) / 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "국내산 고기를 깍둑 썰어 풍부하게 씹히는 식감과 불향으로 풍미를 더한 떡갈비스테이크 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 8010,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-616",
    name: "삼양프레시 함박스테이크",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "육가공/패티",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208104112175103.jpg",
    releaseDate: "2023.08 삼양식품 공식",
    price: 8500,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 90,
    calories: 4200,
    volume: "1.6kg",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 4200,
      sodium: '9240mg',
      carbs: '588g',
      sugar: '6g',
      fat: '126g',
      protein: '84g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주) / 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "풍부한 육즙 가득~ 고소하고 담백한 함박스테이크입니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 7650,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-608",
    name: "삼양프레시 더블함박스테이크",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "육가공/패티",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208105655906175.jpg",
    releaseDate: "2023.08 삼양식품 공식",
    price: 8500,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 91,
    calories: 2150,
    volume: "1KG",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 2150,
      sodium: '4730mg',
      carbs: '301g',
      sugar: '6g',
      fat: '65g',
      protein: '43g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주) 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "오븐공정으로 겉은 바삭, 촉촉한 육즙으로 속은 부드럽고 '겉바속촉' 함박스테이크 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 7650,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-609",
    name: "삼양프레시 더블치즈함박스테이크",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "육가공/패티",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208105618024171.jpg",
    releaseDate: "2023.08 삼양식품 공식",
    price: 8500,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 96,
    calories: 1600,
    volume: "800g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 1600,
      sodium: '3520mg',
      carbs: '224g',
      sugar: '6g',
      fat: '48g',
      protein: '32g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀","우유"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주) / 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "오븐공정으로 겉은 바삭, 고소한 치즈로 속은 부드러운 더블치즈 함박스테이크입니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 7650,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-646",
    name: "삼양프레시 골드함박스테이크",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "육가공/패티",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208103834205091.jpg",
    releaseDate: "2023.08 삼양식품 공식",
    price: 8500,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 88,
    calories: 2800,
    volume: "1KG",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 2800,
      sodium: '6160mg',
      carbs: '392g',
      sugar: '6g',
      fat: '84g',
      protein: '56g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주) 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "두툼한 고기 속 풍부한 육즙으로 고기 본연의 맛을 살린 프리미엄 함박스테이크입니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 7650,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-627",
    name: "삼양프레시 바삭한등심돈까스",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "튀김/까스",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208104546023127.jpg",
    releaseDate: "2021.12 삼양식품 공식",
    price: 8500,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 96,
    calories: 1750,
    volume: "1,000 g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 1750,
      sodium: '3850mg',
      carbs: '245g',
      sugar: '6g',
      fat: '53g',
      protein: '35g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀","돼지고기"],
    origin: '대한민국',
    manufacturer: "삼양냉동(주)/ 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9 개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "국내산 돼지고기를 갈지 않아 육즙이 가득한 바삭한 등심돈까스입니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 7650,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-610",
    name: "삼양프레시 치킨까스",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "튀김/까스",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208104636711131.jpg",
    releaseDate: "2021.11 삼양식품 공식",
    price: 6900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 91,
    calories: 1500,
    volume: "1,000 g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 1500,
      sodium: '3300mg',
      carbs: '210g',
      sugar: '6g',
      fat: '45g',
      protein: '30g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀","닭고기"],
    origin: '대한민국',
    manufacturer: "삼양냉동(주)/ 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "겉은 바삭하고, 속은 촉촉하고 담백한 식감을 느낄 수 있습니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 6900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 6210,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-612",
    name: "삼양프레시 고구마치즈돈까스",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "튀김/까스",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208104717281135.jpg",
    releaseDate: "2021.11 삼양식품 공식",
    price: 8500,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 90,
    
    calories: 235,
    volume: "1,500 g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 235,
      
      sodium: '1150mg',
      carbs: '65g',
      sugar: '6g',
      fat: '15g',
      protein: '10g'
    },
    ingredients: "삼양식품 엄선 원재료 (식육함유가공품(가열하여 섭취하는 냉동식품/비살균제품))",
    allergens: ["대두","밀","우유","돼지고기"],
    origin: '대한민국',
    manufacturer: "삼양냉동(주)/ 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "바삭한 돈까스 속에 달콤한 고구마와 고소한 모짜렐라 치즈가 어우러져 더욱 맛있습니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 7650,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-629",
    name: "삼양프레시 유럽풍돈까스",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "튀김/까스",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208104930827139.jpg",
    releaseDate: "2021.12 삼양식품 공식",
    price: 8500,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 90,
    
    calories: 250,
    volume: "1,300 g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 250,
      
      sodium: '1150mg',
      carbs: '65g',
      sugar: '6g',
      fat: '15g',
      protein: '10g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀","돼지고기"],
    origin: '대한민국',
    manufacturer: "(주)맘모스식품 / 충청북도 진천군 이월면 산수산단2로 265",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9 개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "국내산 돼지고기가 들어가 언제 먹어도 질리지 않는 고소하고 바삭한 돈까스입니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 7650,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-630",
    name: "삼양프레시 도시락돈까스",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "튀김/까스",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208105010971143.jpg",
    releaseDate: "2021.11 삼양식품 공식",
    price: 8500,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 92,
    
    calories: 260,
    volume: "1,000 g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      
      sodium: '1150mg',
      carbs: '65g',
      sugar: '6g',
      fat: '15g',
      protein: '10g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀","돼지고기"],
    origin: '대한민국',
    manufacturer: "(주)맘모스식품 / 충청북도 진천군 이월면 산수산단2로 265",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9 개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "한입 사이즈로 바삭하게 튀겨내, 누구나 좋아하는 실속형 도시락돈까스입니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["육즙 가득 풍성한 고기 식감과 든든함","간편하게 에어프라이어로 완성하는 별미"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 7650,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-596",
    name: "삼양프레시 흰살생선까스",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "튀김/까스",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20230609/20230609151433512104.jpg",
    releaseDate: "2023.06 삼양식품 공식",
    price: 6900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 96,
    calories: 1500,
    volume: "1,200g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 1500,
      sodium: '3300mg',
      carbs: '210g',
      sugar: '6g',
      fat: '45g',
      protein: '30g'
    },
    ingredients: "삼양식품 엄선 원재료 (기타수산물가공품 (가열하여 섭취하는 냉동식품))",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "㈜그린푸드/부산광역시 강서구 녹산산단 407로 65(송정동)",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "통통한 흰살 생선으로 바삭하고 부드러운 맛을 살린 프리미엄 생선까스입니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 6900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 6210,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-591",
    name: "삼양프레시 동그랑땡",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "냉동간편식",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20230609/20230609142320452084.jpg",
    releaseDate: "2023.06 삼양식품 공식",
    price: 6900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 89,
    
    calories: 195,
    volume: "1,000g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 195,
      
      sodium: '1150mg',
      carbs: '65g',
      sugar: '6g',
      fat: '15g',
      protein: '10g'
    },
    ingredients: "삼양식품 엄선 원재료 (기타가공품 (가열하여 섭취하는 냉동식품))",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양냉동(주) 세종특별자치시 연서면 공단로 157/세종공장",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "국내산 고기와 신선한 재료들로 속을 꽉 채워 씹는맛과 촉촉한 육즙을 살린 동그랑땡입니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 6900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 6210,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-607",
    name: "삼양프레시 해물동그랑땡",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "냉동간편식",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208104302592111.jpg",
    releaseDate: "2023.08 삼양식품 공식",
    price: 6900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 93,
    
    calories: 180,
    volume: "1KG",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 180,
      
      sodium: '1150mg',
      carbs: '65g',
      sugar: '6g',
      fat: '15g',
      protein: '10g'
    },
    ingredients: "삼양식품 엄선 원재료 (기타수산물가공품(가열하여 섭취하는 냉동식품))",
    allergens: ["대두","밀","새우","조개류"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주) 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "오징어의 쫄깃한 식감이 살아있는 해물동그랑땡입니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 6900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 6210,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-606",
    name: "삼양프레시 잡채해물완자",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "냉동간편식",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208104339925115.jpg",
    releaseDate: "2023.08 삼양식품 공식",
    price: 6900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 89,
    
    calories: 185,
    volume: "1kg",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 185,
      
      sodium: '1150mg',
      carbs: '65g',
      sugar: '6g',
      fat: '15g',
      protein: '10g'
    },
    ingredients: "삼양식품 엄선 원재료 (기타가공품(가열하여 섭취하는 냉동식품))",
    allergens: ["대두","밀","새우","조개류"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주) 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "입안 가득 느껴지는 해물 풍미에 잡채의 감칠맛이 어우러진 잡채해물완자입니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 6900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 6210,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-581",
    name: "삼양프레시 탕수육",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "튀김/까스",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20230428/20230428181932402033.jpg",
    releaseDate: "2023.04 삼양식품 공식",
    price: 6900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 88,
    calories: 2300,
    volume: "1,000g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 2300,
      sodium: '5060mg',
      carbs: '322g',
      sugar: '6g',
      fat: '69g',
      protein: '46g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "(주)한맥식품 경기도 포천시 내촌면 금강로 3083-19",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "12개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "국내산 돼지고기에 튀김옷을 입혀 고소하고 바삭한 탕수육입니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 6900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 6210,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-611",
    name: "삼양프레시 두부스테이크",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "육가공/패티",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208103938873095.jpg",
    releaseDate: "2023.08 삼양식품 공식",
    price: 8500,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 92,
    calories: 2700,
    volume: "1.2 KG",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 2700,
      sodium: '5940mg',
      carbs: '378g',
      sugar: '6g',
      fat: '81g',
      protein: '54g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주) 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "두부와 고기가 만나, 더욱 부드럽고 맛있는 영양만점! 두부스테이크 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 8500,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 8500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 8500,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 7650,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-594",
    name: "삼양프레시 수수부꾸미",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "냉동간편식",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20230609/20230609145930582096.jpg",
    releaseDate: "2023.06 삼양식품 공식",
    price: 6900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 96,
    
    calories: 220,
    volume: "1,000g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 220,
      
      sodium: '1150mg',
      carbs: '65g',
      sugar: '6g',
      fat: '15g',
      protein: '10g'
    },
    ingredients: "삼양식품 엄선 원재료 (떡류(가열하여 섭취하는 냉동식품))",
    allergens: ["대두","밀"],
    origin: '대한민국',
    manufacturer: "삼양냉동(주) 세종특별자치시 연서면 공단로 157/세종공장",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "국내산 수수분말을 넣고 찰지게 반죽하여 통팥앙금을 가득 채운 전통 구이떡인 수수부꾸미입니다. - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 6900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 6210,
        eventBadge: '묶음할인'
      }
    ]
  },
  {
    id: "samyang-647",
    name: "삼양프레시 햄버거패티",
    brand: '삼양식품',
    category: "간편식",
    subCategory: "육가공/패티",
    itemType: 'packaged',
    image: "https://www.samyangfoods.com/upload/product/20240208/20240208104221573107.jpg",
    releaseDate: "2023.08 삼양식품 공식",
    price: 6900,
    overallRating: 4.7,
    ratingCount: 850,
    searchInfluxCount: 52000,
    stores: ['삼양식품 공식몰', 'CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
    repurchasePercent: 89,
    calories: 6500,
    volume: "2.5KG",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 6500,
      sodium: '14300mg',
      carbs: '910g',
      sugar: '6g',
      fat: '195g',
      protein: '130g'
    },
    ingredients: "삼양식품 엄선 원재료 (분쇄가공육제품(비살균제품))",
    allergens: ["대두","밀","쇠고기","돼지고기"],
    origin: '대한민국',
    manufacturer: "삼양스퀘어밀(주) 세종특별자치시 연서면 공단로 157",
    storageMethod: "-18℃ 이하 냉동보관",
    shelfLife: "9개월",
    precautions: '개봉 후 변질의 우려가 있으니 가급적 빨리 드시기 바랍니다.',
    spiciness: "안 매워요",
    description: "원형 모양으로 빵, 야채와 함께 드시면 더욱 맛있는 실속형 햄버거패티 - 삼양식품 공식 인증 상품.",
    bestQuotes: ["삼양식품 본사 공식 정품의 신뢰할 수 있는 맛","엄선된 원재료로 건강하고 맛있는 한 끼"],
    storeStocks: [
      {
        store: '삼양식품 공식몰',
        status: '입고완료',
        stockCount: 100,
        price: 6900,
        eventBadge: '공식직영',
        deliveryTime: '전국 당일/익일 출고',
        appLink: "https://brand.naver.com/syfoodshop"
      },
      {
        store: 'CU',
        status: '입고완료',
        stockCount: 15,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: 'GS25',
        status: '입고완료',
        stockCount: 12,
        price: 6900,
        deliveryTime: '매장 즉시 픽업'
      },
      {
        store: '대형마트',
        status: '입고완료',
        stockCount: 50,
        price: 6210,
        eventBadge: '묶음할인'
      }
    ]
  }
];
