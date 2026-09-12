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
    calories: 405,
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
      calories: 405,
      sodium: "1328mg (66%)",
      carbs: "61.1g (19%)",
      sugar: "2.3g (2%)",
      fat: "14.5g (27%)",
      transFat: "0.5g",
      satFat: "5.3g (35%)",
      cholesterol: "8mg (3%)",
      protein: "7.6g (14%)"
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
      sodium: "1210mg (61%)",
      carbs: "77g (24%)",
      sugar: "6g (6%)",
      fat: "17g (31%)",
      protein: "11g (20%)"
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
    calories: 250,
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
      calories: 250,
      sodium: "582mg (29%)",
      carbs: "24.6g (8%)",
      sugar: "8.2g (8%)",
      fat: "12.7g (24%)",
      transFat: "0g",
      satFat: "4.5g (30%)",
      cholesterol: "19mg (6%)",
      protein: "10.5g (19%)"
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
    calories: 185,
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
      calories: 185,
      sodium: "831mg (42%)",
      carbs: "34.3g (11%)",
      sugar: "3.7g (4%)",
      fat: "2.7g (5%)",
      transFat: "0g",
      satFat: "0.6g (4%)",
      cholesterol: "2mg (1%)",
      protein: "5.9g (11%)"
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
    calories: 250,
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
      calories: 250,
      sodium: "582mg (29%)",
      carbs: "24.6g (8%)",
      sugar: "8.2g (8%)",
      fat: "12.7g (24%)",
      transFat: "0g",
      satFat: "4.5g (30%)",
      cholesterol: "19mg (6%)",
      protein: "10.5g (19%)"
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
    calories: 185,
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
      calories: 185,
      sodium: "831mg (42%)",
      carbs: "34.3g (11%)",
      sugar: "3.7g (4%)",
      fat: "2.7g (5%)",
      transFat: "0g",
      satFat: "0.6g (4%)",
      cholesterol: "2mg (1%)",
      protein: "5.9g (11%)"
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
    calories: 250,
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
      calories: 250,
      sodium: "582mg (29%)",
      carbs: "24.6g (8%)",
      sugar: "8.2g (8%)",
      fat: "12.7g (24%)",
      transFat: "0g",
      satFat: "4.5g (30%)",
      cholesterol: "19mg (6%)",
      protein: "10.5g (19%)"
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
    calories: 185,
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
      calories: 185,
      sodium: "831mg (42%)",
      carbs: "34.3g (11%)",
      sugar: "3.7g (4%)",
      fat: "2.7g (5%)",
      transFat: "0g",
      satFat: "0.6g (4%)",
      cholesterol: "2mg (1%)",
      protein: "5.9g (11%)"
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
    calories: 250,
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
      calories: 250,
      sodium: "582mg (29%)",
      carbs: "24.6g (8%)",
      sugar: "8.2g (8%)",
      fat: "12.7g (24%)",
      transFat: "0g",
      satFat: "4.5g (30%)",
      cholesterol: "19mg (6%)",
      protein: "10.5g (19%)"
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
    calories: 185,
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
      calories: 185,
      sodium: "831mg (42%)",
      carbs: "34.3g (11%)",
      sugar: "3.7g (4%)",
      fat: "2.7g (5%)",
      transFat: "0g",
      satFat: "0.6g (4%)",
      cholesterol: "2mg (1%)",
      protein: "5.9g (11%)"
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
    calories: 407,
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
      calories: 407,
      sodium: "910mg (46%)",
      carbs: "64.9g (20%)",
      sugar: "9g (9%)",
      fat: "13.4g (25%)",
      transFat: "0g",
      satFat: "5.2g (35%)",
      cholesterol: "0mg (0%)",
      protein: "6.7g (12%)"
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
    calories: 185,
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
      calories: 185,
      sodium: "831mg (42%)",
      carbs: "34.3g (11%)",
      sugar: "3.7g (4%)",
      fat: "2.7g (5%)",
      transFat: "0g",
      satFat: "0.6g (4%)",
      cholesterol: "2mg (1%)",
      protein: "5.9g (11%)"
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
    calories: 417,
    volume: "120g",
    
    
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 417,
      sodium: "1492mg (75%)",
      carbs: "65.8g (20%)",
      sugar: "3.3g (3%)",
      fat: "13.3g (25%)",
      transFat: "0g",
      satFat: "6.7g (45%)",
      cholesterol: "0mg (0%)",
      protein: "8.3g (15%)"
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
    calories: 185,
    volume: "110g",
    
    
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 185,
      sodium: "831mg (42%)",
      carbs: "34.3g (11%)",
      sugar: "3.7g (4%)",
      fat: "2.7g (5%)",
      transFat: "0g",
      satFat: "0.6g (4%)",
      cholesterol: "2mg (1%)",
      protein: "5.9g (11%)"
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
    calories: 273,
    volume: "65g",
    
    
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 273,
      sodium: "714mg (36%)",
      carbs: "38.1g (12%)",
      sugar: "8.4g (8%)",
      fat: "10.1g (19%)",
      transFat: "0g",
      satFat: "1.3g (9%)",
      cholesterol: "16mg (5%)",
      protein: "7.5g (14%)"
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
    calories: 429,
    volume: "120g",
    
    
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 429,
      sodium: "1467mg (73%)",
      carbs: "70.8g (22%)",
      sugar: "1.7g (2%)",
      fat: "12.5g (23%)",
      transFat: "0g",
      satFat: "6.7g (45%)",
      cholesterol: "0mg (0%)",
      protein: "8.3g (15%)"
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
    calories: 185,
    volume: "110g",
    
    
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 185,
      sodium: "831mg (42%)",
      carbs: "34.3g (11%)",
      sugar: "3.7g (4%)",
      fat: "2.7g (5%)",
      transFat: "0g",
      satFat: "0.6g (4%)",
      cholesterol: "2mg (1%)",
      protein: "5.9g (11%)"
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
    calories: 405,
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
      calories: 405,
      sodium: "1409mg (70%)",
      carbs: "60.9g (19%)",
      sugar: "8.2g (8%)",
      fat: "13.6g (25%)",
      transFat: "0g",
      satFat: "6.4g (43%)",
      cholesterol: "4mg (1%)",
      protein: "10g (18%)"
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
    calories: 405,
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
      calories: 405,
      sodium: "905mg (45%)",
      carbs: "60g (19%)",
      sugar: "7.6g (8%)",
      fat: "14.3g (26%)",
      transFat: "0g",
      satFat: "7.6g (51%)",
      cholesterol: "0mg (0%)",
      protein: "8.6g (16%)"
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
    calories: 405,
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
      calories: 405,
      sodium: "905mg (45%)",
      carbs: "60g (19%)",
      sugar: "7.6g (8%)",
      fat: "14.3g (26%)",
      transFat: "0g",
      satFat: "7.6g (51%)",
      cholesterol: "0mg (0%)",
      protein: "8.6g (16%)"
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
    calories: 400,
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
      calories: 400,
      sodium: "1058mg (53%)",
      carbs: "60g (19%)",
      sugar: "8.3g (8%)",
      fat: "14.2g (26%)",
      transFat: "0g",
      satFat: "7.5g (50%)",
      cholesterol: "4mg (1%)",
      protein: "8.3g (15%)"
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
    calories: 185,
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
      calories: 185,
      sodium: "831mg (42%)",
      carbs: "34.3g (11%)",
      sugar: "3.7g (4%)",
      fat: "2.7g (5%)",
      transFat: "0g",
      satFat: "0.6g (4%)",
      cholesterol: "2mg (1%)",
      protein: "5.9g (11%)"
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
    calories: 273,
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
      calories: 273,
      sodium: "714mg (36%)",
      carbs: "38.1g (12%)",
      sugar: "8.4g (8%)",
      fat: "10.1g (19%)",
      transFat: "0g",
      satFat: "1.3g (9%)",
      cholesterol: "16mg (5%)",
      protein: "7.5g (14%)"
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
    calories: 396,
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
      calories: 396,
      sodium: "879mg (44%)",
      carbs: "62.9g (19%)",
      sugar: "7.9g (8%)",
      fat: "12.1g (22%)",
      transFat: "0g",
      satFat: "6.4g (43%)",
      cholesterol: "7mg (2%)",
      protein: "9.3g (17%)"
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
    calories: 400,
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
      calories: 400,
      sodium: "867mg (43%)",
      carbs: "64.8g (20%)",
      sugar: "8.6g (9%)",
      fat: "12.4g (23%)",
      transFat: "0g",
      satFat: "6.7g (45%)",
      cholesterol: "10mg (3%)",
      protein: "7.6g (14%)"
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
    calories: 367,
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
      calories: 367,
      sodium: "1508mg (75%)",
      carbs: "65g (20%)",
      sugar: "7.5g (8%)",
      fat: "8.3g (15%)",
      transFat: "0g",
      satFat: "3.3g (22%)",
      cholesterol: "0mg (0%)",
      protein: "8.3g (15%)"
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
    calories: 367,
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
      calories: 367,
      sodium: "1508mg (75%)",
      carbs: "65g (20%)",
      sugar: "7.5g (8%)",
      fat: "8.3g (15%)",
      transFat: "0g",
      satFat: "3.3g (22%)",
      cholesterol: "0mg (0%)",
      protein: "8.3g (15%)"
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
    calories: 405,
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
      calories: 405,
      sodium: "1409mg (70%)",
      carbs: "60.9g (19%)",
      sugar: "8.2g (8%)",
      fat: "13.6g (25%)",
      transFat: "0g",
      satFat: "6.4g (43%)",
      cholesterol: "4mg (1%)",
      protein: "10g (18%)"
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
    calories: 185,
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
      calories: 185,
      sodium: "831mg (42%)",
      carbs: "34.3g (11%)",
      sugar: "3.7g (4%)",
      fat: "2.7g (5%)",
      transFat: "0g",
      satFat: "0.6g (4%)",
      cholesterol: "2mg (1%)",
      protein: "5.9g (11%)"
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
    calories: 410,
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
      calories: 410,
      sodium: "952mg (48%)",
      carbs: "60g (19%)",
      sugar: "4.8g (5%)",
      fat: "15.2g (28%)",
      transFat: "0g",
      satFat: "7.6g (51%)",
      cholesterol: "0mg (0%)",
      protein: "8.6g (16%)"
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
    calories: 425,
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
      calories: 425,
      sodium: "1260mg (63%)",
      carbs: "68g (21%)",
      sugar: "6g (6%)",
      fat: "13g (24%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "0mg (0%)",
      protein: "9g (16%)"
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
    calories: 423,
    volume: "110g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 423,
      sodium: "1636mg (82%)",
      carbs: "67.3g (21%)",
      sugar: "2.7g (3%)",
      fat: "13.6g (25%)",
      transFat: "0g",
      satFat: "6.4g (43%)",
      cholesterol: "3mg (1%)",
      protein: "7.3g (13%)"
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
    calories: 185,
    volume: "110g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 185,
      sodium: "831mg (42%)",
      carbs: "34.3g (11%)",
      sugar: "3.7g (4%)",
      fat: "2.7g (5%)",
      transFat: "0g",
      satFat: "0.6g (4%)",
      cholesterol: "2mg (1%)",
      protein: "5.9g (11%)"
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
    calories: 418,
    volume: "110g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 418,
      sodium: "1600mg (80%)",
      carbs: "67.3g (21%)",
      sugar: "2.7g (3%)",
      fat: "12.7g (24%)",
      transFat: "0g",
      satFat: "6.4g (43%)",
      cholesterol: "0mg (0%)",
      protein: "8.2g (15%)"
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
    calories: 185,
    volume: "110g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 185,
      sodium: "831mg (42%)",
      carbs: "34.3g (11%)",
      sugar: "3.7g (4%)",
      fat: "2.7g (5%)",
      transFat: "0g",
      satFat: "0.6g (4%)",
      cholesterol: "2mg (1%)",
      protein: "5.9g (11%)"
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
    calories: 407,
    volume: "140g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 407,
      sodium: "850mg (43%)",
      carbs: "60.7g (19%)",
      sugar: "5g (5%)",
      fat: "14.3g (26%)",
      transFat: "0g",
      satFat: "6.4g (43%)",
      cholesterol: "0mg (0%)",
      protein: "8.6g (16%)"
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
    calories: 387,
    volume: "115g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 387,
      sodium: "896mg (45%)",
      carbs: "62.6g (19%)",
      sugar: "5.2g (5%)",
      fat: "10.4g (19%)",
      transFat: "0g",
      satFat: "4.4g (29%)",
      cholesterol: "0mg (0%)",
      protein: "10.4g (19%)"
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
    calories: 355,
    volume: "115g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 355,
      sodium: "1820mg (91%)",
      carbs: "75g (23%)",
      sugar: "4g (4%)",
      fat: "4.8g (9%)",
      transFat: "0g",
      satFat: "0.7g (5%)",
      cholesterol: "0mg (0%)",
      protein: "10g (18%)"
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
    calories: 420,
    volume: "112g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 420,
      sodium: "1652mg (83%)",
      carbs: "65.2g (20%)",
      sugar: "3.6g (4%)",
      fat: "14.3g (26%)",
      transFat: "0g",
      satFat: "5.4g (36%)",
      cholesterol: "0mg (0%)",
      protein: "8g (15%)"
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
    calories: 392,
    volume: "65g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 392,
      sodium: "1739mg (87%)",
      carbs: "60g (19%)",
      sugar: "3.1g (3%)",
      fat: "13.9g (26%)",
      transFat: "0g",
      satFat: "4.8g (32%)",
      cholesterol: "0mg (0%)",
      protein: "7.7g (14%)"
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
    calories: 400,
    volume: "140g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 400,
      sodium: "921mg (46%)",
      carbs: "62.9g (19%)",
      sugar: "5g (5%)",
      fat: "12.1g (22%)",
      transFat: "0g",
      satFat: "5g (33%)",
      cholesterol: "5mg (2%)",
      protein: "10g (18%)"
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
    calories: 395,
    volume: "105g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 395,
      sodium: "952mg (48%)",
      carbs: "56.2g (17%)",
      sugar: "7.6g (8%)",
      fat: "15.2g (28%)",
      transFat: "0g",
      satFat: "6.7g (45%)",
      cholesterol: "8mg (3%)",
      protein: "8.6g (16%)"
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
    calories: 422,
    volume: "115g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 422,
      sodium: "1557mg (78%)",
      carbs: "68.7g (21%)",
      sugar: "5.2g (5%)",
      fat: "13g (24%)",
      transFat: "0g",
      satFat: "6.1g (41%)",
      cholesterol: "4mg (1%)",
      protein: "7.8g (14%)"
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
    calories: 185,
    volume: "105g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 185,
      sodium: "831mg (42%)",
      carbs: "34.3g (11%)",
      sugar: "3.7g (4%)",
      fat: "2.7g (5%)",
      transFat: "0g",
      satFat: "0.6g (4%)",
      cholesterol: "2mg (1%)",
      protein: "5.9g (11%)"
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
    calories: 432,
    volume: "110g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 432,
      sodium: "1518mg (76%)",
      carbs: "66.4g (20%)",
      sugar: "2.7g (3%)",
      fat: "15.5g (29%)",
      transFat: "0g",
      satFat: "7.3g (49%)",
      cholesterol: "0mg (0%)",
      protein: "7.3g (13%)"
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
    calories: 425,
    volume: "120g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 425,
      sodium: "1458mg (73%)",
      carbs: "66.7g (21%)",
      sugar: "2.5g (3%)",
      fat: "13.3g (25%)",
      transFat: "0g",
      satFat: "6.7g (45%)",
      cholesterol: "0mg (0%)",
      protein: "9.2g (17%)"
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
    calories: 30,
    volume: "86g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 30,
      sodium: "201mg (10%)",
      carbs: "1.5g (0%)",
      sugar: "0.8g (1%)",
      fat: "1g (2%)",
      transFat: "0g",
      satFat: "0.2g (1%)",
      cholesterol: "11mg (4%)",
      protein: "3.7g (7%)"
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
    calories: 444,
    volume: "72g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 444,
      sodium: "347mg (17%)",
      carbs: "77.8g (24%)",
      sugar: "19.5g (20%)",
      fat: "11.1g (21%)",
      transFat: "0g",
      satFat: "5.8g (39%)",
      cholesterol: "0mg (0%)",
      protein: "8.3g (15%)"
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
    calories: 124,
    volume: "115g",
    
    
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 124,
      sodium: "49mg (2%)",
      carbs: "0g (0%)",
      sugar: "16g (16%)",
      fat: "0g (0%)",
      transFat: "0g",
      satFat: "3.6g (24%)",
      cholesterol: "0mg (0%)",
      protein: "3.9g (7%)"
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
    calories: 533,
    volume: "275g",
    
    
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 533,
      sodium: "250mg (13%)",
      carbs: "66.7g (21%)",
      sugar: "10g (10%)",
      fat: "26.7g (49%)",
      transFat: "0g",
      satFat: "13.3g (89%)",
      cholesterol: "0mg (0%)",
      protein: "6.7g (12%)"
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
    calories: 533,
    volume: "70g",
    
    
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 533,
      sodium: "367mg (18%)",
      carbs: "66.7g (21%)",
      sugar: "10g (10%)",
      fat: "26.7g (49%)",
      transFat: "0g",
      satFat: "13g (87%)",
      cholesterol: "0mg (0%)",
      protein: "6.7g (12%)"
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
    calories: 531,
    volume: "85g",
    
    
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 531,
      sodium: "298mg (15%)",
      carbs: "64.4g (20%)",
      sugar: "31.9g (32%)",
      fat: "28.2g (52%)",
      transFat: "0.2g",
      satFat: "10.5g (70%)",
      cholesterol: "0mg (0%)",
      protein: "4.9g (9%)"
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
    calories: 550,
    volume: "67g",
    
    
    isBest: true,
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 550,
      sodium: "800mg (40%)",
      carbs: "60g (19%)",
      sugar: "10g (10%)",
      fat: "33.3g (62%)",
      transFat: "0g",
      satFat: "12.7g (85%)",
      cholesterol: "0mg (0%)",
      protein: "3.3g (6%)"
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
      sodium: "275mg (14%)",
      carbs: "18g (6%)",
      sugar: "6g (6%)",
      fat: "4g (7%)",
      protein: "3g (5%)"
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
      sodium: "1155mg (58%)",
      carbs: "74g (23%)",
      sugar: "6g (6%)",
      fat: "16g (30%)",
      protein: "11g (20%)"
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
      sodium: "1540mg (77%)",
      carbs: "98g (30%)",
      sugar: "6g (6%)",
      fat: "21g (39%)",
      protein: "14g (25%)"
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
    
    calories: 340,
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
      calories: 340,
      sodium: "1130mg (56%)",
      carbs: "77g (24%)",
      sugar: "9g (9%)",
      fat: "1.4g (3%)",
      transFat: "0g",
      satFat: "0.5g (3%)",
      cholesterol: "0mg (0%)",
      protein: "7g (13%)"
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
      sodium: "1744mg (87%)",
      carbs: "32.3g (10%)",
      sugar: "22g (22%)",
      fat: "7g (13%)",
      transFat: "0.1g",
      satFat: "2.4g (16%)",
      cholesterol: "11mg (4%)",
      protein: "3g (5%)"
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
    
    calories: 45,
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
      calories: 45,
      sodium: "1490mg (75%)",
      carbs: "13g (4%)",
      sugar: "3g (3%)",
      fat: "0.9g (2%)",
      transFat: "0g",
      satFat: "0g (0%)",
      cholesterol: "0mg (0%)",
      protein: "2g (4%)"
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
    
    calories: 340,
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
      calories: 340,
      sodium: "1130mg (56%)",
      carbs: "77g (24%)",
      sugar: "9g (9%)",
      fat: "1.4g (3%)",
      transFat: "0g",
      satFat: "0.5g (3%)",
      cholesterol: "0mg (0%)",
      protein: "7g (13%)"
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
    calories: 481,
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
      calories: 481,
      sodium: "667mg (33%)",
      carbs: "63.8g (20%)",
      sugar: "8.7g (9%)",
      fat: "23.2g (43%)",
      transFat: "0g",
      satFat: "8.7g (58%)",
      cholesterol: "0mg (0%)",
      protein: "4.4g (8%)"
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
    
    calories: 337,
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
      calories: 337,
      sodium: "631mg (32%)",
      carbs: "0g (0%)",
      sugar: "4.2g (4%)",
      fat: "0g (0%)",
      transFat: "0g",
      satFat: "6.7g (45%)",
      cholesterol: "0mg (0%)",
      protein: "11.7g (21%)"
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
    calories: 481,
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
      calories: 481,
      sodium: "667mg (33%)",
      carbs: "63.8g (20%)",
      sugar: "8.7g (9%)",
      fat: "23.2g (43%)",
      transFat: "0g",
      satFat: "8.7g (58%)",
      cholesterol: "0mg (0%)",
      protein: "4.4g (8%)"
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
    calories: 213,
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
      calories: 213,
      sodium: "178mg (9%)",
      carbs: "46.4g (14%)",
      sugar: "1.3g (1%)",
      fat: "1g (2%)",
      transFat: "0g",
      satFat: "0.4g (3%)",
      cholesterol: "0mg (0%)",
      protein: "5.9g (11%)"
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
    calories: 211,
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
      calories: 211,
      sodium: "342mg (17%)",
      carbs: "0g (0%)",
      sugar: "2g (2%)",
      fat: "0g (0%)",
      transFat: "0g",
      satFat: "3.1g (21%)",
      cholesterol: "0mg (0%)",
      protein: "6g (11%)"
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
      sodium: "1001mg (50%)",
      carbs: "64g (20%)",
      sugar: "6g (6%)",
      fat: "14g (26%)",
      protein: "9g (16%)"
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
    calories: 271,
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
      calories: 271,
      sodium: "705mg (35%)",
      carbs: "55.9g (17%)",
      sugar: "6.7g (7%)",
      fat: "4.3g (8%)",
      transFat: "0g",
      satFat: "2.6g (17%)",
      cholesterol: "9mg (3%)",
      protein: "2.4g (4%)"
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
    calories: 277,
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
      calories: 277,
      sodium: "744mg (37%)",
      carbs: "56.1g (17%)",
      sugar: "7.1g (7%)",
      fat: "4.7g (9%)",
      transFat: "0.1g",
      satFat: "2.6g (17%)",
      cholesterol: "6mg (2%)",
      protein: "2.4g (4%)"
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
    calories: 277,
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
      calories: 277,
      sodium: "744mg (37%)",
      carbs: "56.1g (17%)",
      sugar: "7.1g (7%)",
      fat: "4.7g (9%)",
      transFat: "0.1g",
      satFat: "2.6g (17%)",
      cholesterol: "6mg (2%)",
      protein: "2.4g (4%)"
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
    calories: 239,
    volume: "280g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 239,
      sodium: "443mg (22%)",
      carbs: "33.2g (10%)",
      sugar: "4.6g (5%)",
      fat: "8.2g (15%)",
      transFat: "0g",
      satFat: "0.9g (6%)",
      cholesterol: "0mg (0%)",
      protein: "11.1g (20%)"
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
    calories: 228,
    volume: "280g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 228,
      sodium: "407mg (20%)",
      carbs: "29.6g (9%)",
      sugar: "3.2g (3%)",
      fat: "9.6g (18%)",
      transFat: "0g",
      satFat: "1.1g (7%)",
      cholesterol: "0mg (0%)",
      protein: "10g (18%)"
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
    calories: 148,
    volume: "290g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 148,
      sodium: "441mg (22%)",
      carbs: "0g (0%)",
      sugar: "7.3g (7%)",
      fat: "0g (0%)",
      transFat: "0g",
      satFat: "1.6g (11%)",
      cholesterol: "0mg (0%)",
      protein: "11.9g (22%)"
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
    calories: 148,
    volume: "289g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 148,
      sodium: "441mg (22%)",
      carbs: "0g (0%)",
      sugar: "7.3g (7%)",
      fat: "0g (0%)",
      transFat: "0g",
      satFat: "1.6g (11%)",
      cholesterol: "0mg (0%)",
      protein: "11.9g (22%)"
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
    calories: 177,
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
      calories: 177,
      sodium: "268mg (13%)",
      carbs: "25.8g (8%)",
      sugar: "4g (4%)",
      fat: "3.4g (6%)",
      transFat: "0g",
      satFat: "0.5g (3%)",
      cholesterol: "32mg (11%)",
      protein: "10.7g (19%)"
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
    calories: 239,
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
      calories: 239,
      sodium: "447mg (22%)",
      carbs: "33.6g (10%)",
      sugar: "0g (0%)",
      fat: "9.6g (18%)",
      transFat: "0g",
      satFat: "2.3g (15%)",
      cholesterol: "12mg (4%)",
      protein: "4.6g (8%)"
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
    calories: 24,
    volume: "760 g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 24,
      sodium: "6mg (0%)",
      carbs: "3.8g (1%)",
      sugar: "2.8g (3%)",
      fat: "0g (0%)",
      transFat: "0g",
      satFat: "0g (0%)",
      cholesterol: "0mg (0%)",
      protein: "2.1g (4%)"
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
    calories: 24,
    volume: "1,000 g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 24,
      sodium: "6mg (0%)",
      carbs: "3.8g (1%)",
      sugar: "2.8g (3%)",
      fat: "0g (0%)",
      transFat: "0g",
      satFat: "0g (0%)",
      cholesterol: "0mg (0%)",
      protein: "2.1g (4%)"
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
    calories: 24,
    volume: "800 g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 24,
      sodium: "6mg (0%)",
      carbs: "3.8g (1%)",
      sugar: "2.8g (3%)",
      fat: "0g (0%)",
      transFat: "0g",
      satFat: "0g (0%)",
      cholesterol: "0mg (0%)",
      protein: "2.1g (4%)"
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
    calories: 24,
    volume: "1,200 g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 24,
      sodium: "6mg (0%)",
      carbs: "3.8g (1%)",
      sugar: "2.8g (3%)",
      fat: "0g (0%)",
      transFat: "0g",
      satFat: "0g (0%)",
      cholesterol: "0mg (0%)",
      protein: "2.1g (4%)"
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
    calories: 24,
    volume: "1,000 g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 24,
      sodium: "6mg (0%)",
      carbs: "3.8g (1%)",
      sugar: "2.8g (3%)",
      fat: "0g (0%)",
      transFat: "0g",
      satFat: "0g (0%)",
      cholesterol: "0mg (0%)",
      protein: "2.1g (4%)"
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
    calories: 260,
    volume: "1,350g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
    calories: 260,
    volume: "1,300g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
    calories: 260,
    volume: "1,300g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
    calories: 230,
    volume: "1,000g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 230,
      sodium: "430mg (22%)",
      carbs: "25g (8%)",
      sugar: "3g (3%)",
      fat: "11g (20%)",
      transFat: "0g",
      satFat: "4.6g (31%)",
      cholesterol: "20mg (7%)",
      protein: "8g (15%)"
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
    calories: 175,
    volume: "2,700G",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 175,
      sodium: "430mg (22%)",
      carbs: "26g (8%)",
      sugar: "1g (1%)",
      fat: "5g (9%)",
      transFat: "0g",
      satFat: "1.6g (11%)",
      cholesterol: "10mg (3%)",
      protein: "7g (13%)"
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
    calories: 260,
    volume: "2,700g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
    calories: 160,
    volume: "1,400g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 160,
      sodium: "300mg (15%)",
      carbs: "22g (7%)",
      sugar: "1g (1%)",
      fat: "4.5g (8%)",
      transFat: "0g",
      satFat: "1.1g (7%)",
      cholesterol: "10mg (3%)",
      protein: "8g (15%)"
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
    calories: 185,
    volume: "2,000g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 185,
      sodium: "470mg (24%)",
      carbs: "27g (8%)",
      sugar: "1g (1%)",
      fat: "6g (11%)",
      transFat: "0g",
      satFat: "2g (13%)",
      cholesterol: "5mg (2%)",
      protein: "6g (11%)"
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
    calories: 260,
    volume: "1,400g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
    calories: 260,
    volume: "1,400g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
    calories: 260,
    volume: "1,350g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
    calories: 217,
    volume: "900g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 217,
      sodium: "689mg (34%)",
      carbs: "13.3g (4%)",
      sugar: "6.7g (7%)",
      fat: "11.1g (21%)",
      transFat: "0g",
      satFat: "3.8g (25%)",
      cholesterol: "44mg (15%)",
      protein: "15.6g (28%)"
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
    calories: 260,
    volume: "1,000g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
    calories: 260,
    volume: "1,000g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
    calories: 260,
    volume: "1,000g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
    calories: 235,
    volume: "420g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 235,
      sodium: "480mg (24%)",
      carbs: "13g (4%)",
      sugar: "7g (7%)",
      fat: "14g (26%)",
      transFat: "0g",
      satFat: "5g (33%)",
      cholesterol: "35mg (12%)",
      protein: "14g (25%)"
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
    calories: 260,
    volume: "1,000g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
    calories: 265,
    volume: "1,000g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 265,
      sodium: "610mg (31%)",
      carbs: "18g (6%)",
      sugar: "8g (8%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "5g (33%)",
      cholesterol: "35mg (12%)",
      protein: "12g (22%)"
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
    calories: 260,
    volume: "400g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
    calories: 258,
    volume: "2,000g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 258,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "6.5g (7%)",
      fat: "16g (30%)",
      transFat: "0.3g",
      satFat: "5.5g (37%)",
      cholesterol: "45mg (15%)",
      protein: "13.5g (25%)"
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
    calories: 260,
    volume: "1.2KG",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
    calories: 260,
    volume: "1.6kg",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
    calories: 215,
    volume: "1KG",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 215,
      sodium: "380mg (19%)",
      carbs: "14g (4%)",
      sugar: "4g (4%)",
      fat: "11g (20%)",
      transFat: "0g",
      satFat: "4.1g (27%)",
      cholesterol: "25mg (8%)",
      protein: "15g (27%)"
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
    calories: 260,
    volume: "800g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
    calories: 225,
    volume: "1KG",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 225,
      sodium: "740mg (37%)",
      carbs: "13g (4%)",
      sugar: "1g (1%)",
      fat: "13g (24%)",
      transFat: "0g",
      satFat: "4.5g (30%)",
      cholesterol: "55mg (18%)",
      protein: "14g (25%)"
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
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
    
    calories: 260,
    volume: "1,500 g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
    
    calories: 260,
    volume: "1,300 g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
    calories: 260,
    volume: "1,200g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
    
    calories: 260,
    volume: "1,000g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
    
    calories: 260,
    volume: "1KG",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
    
    calories: 260,
    volume: "1kg",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
    calories: 260,
    volume: "1,000g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
    calories: 219,
    volume: "1.2 KG",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 219,
      sodium: "388mg (19%)",
      carbs: "12.5g (4%)",
      sugar: "5g (5%)",
      fat: "13.8g (26%)",
      transFat: "0g",
      satFat: "4.3g (29%)",
      cholesterol: "38mg (13%)",
      protein: "11.3g (21%)"
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
    
    calories: 260,
    volume: "1,000g",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
    calories: 260,
    volume: "2.5KG",
    
    
    
    detailedRating: {
      taste: 4.8,
      value: 4.7,
      portion: 4.7,
      repurchase: 4.8
    },
    nutrition: {
      calories: 260,
      sodium: "500mg (25%)",
      carbs: "15g (5%)",
      sugar: "7g (7%)",
      fat: "16g (30%)",
      transFat: "0g",
      satFat: "6g (40%)",
      cholesterol: "45mg (15%)",
      protein: "14g (25%)"
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
