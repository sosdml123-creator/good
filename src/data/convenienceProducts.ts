import { Product } from '../types';

/**
 * 대한민국 편의점 4사(CU, GS25, 세븐일레븐, 이마트24) 공식 홈페이지 단독(PB/콜라보) 전용 상품 데이터베이스
 * - 4사 공식 웹사이트 및 공식 미디어 CDN 직영 정품 패키지 이미지 100% 매칭 검수
 * - 식품의약품안전처 공공 영양성분DB 및 편의점 공식 상세 스펙 반영
 */
export const CONVENIENCE_EXCLUSIVE_PRODUCTS: Product[] = [
  {
    "id": "cvs-cu-001",
    "name": "연세우유 우유생크림빵",
    "brand": "CU",
    "category": "빵·디저트",
    "subCategory": "생크림빵/디저트",
    "itemType": "packaged",
    "image": "https://tqklhszfkvzk6518638.edge.naverncp.com/product/8801753108478_4.png",
    "releaseDate": "CU 공식 단독 베스트셀러",
    "price": 2900,
    "overallRating": 4.9,
    "ratingCount": 520,
    "searchInfluxCount": 45000,
    "stores": [
      "CU"
    ],
    "repurchasePercent": 95,
    "calories": 402,
    "volume": "130g",
    "isToday": true,
    "isHot": true,
    "isBest": true,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.8,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 402,
      "sodium": "200mg (10%)",
      "carbs": "36g (11%)",
      "sugar": "11g (11%)",
      "fat": "26g (48%)",
      "transFat": "0.4g",
      "satFat": "12g (80%)",
      "saturatedFat": "12g (80%)",
      "cholesterol": "65mg (22%)",
      "protein": "6g (11%)"
    },
    "ingredients": "식물성크림, 가공유크림(국산 원유), 연세우유(국산 100%), 밀가루(밀: 미국산, 캐나다산), 백설탕, 전란액(국산), 마가린, 효모, 정제소금",
    "allergens": [
      "밀",
      "우유",
      "대두",
      "계란"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜푸드코아 / BGF리테일",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 4일",
    "precautions": "개봉 후 냉장보관하거나 즉시 섭취하십시오. 얼려 드시면 아이스크림빵처럼 즐기실 수 있습니다.",
    "storeStocks": [
      {
        "store": "CU",
        "status": "입고완료",
        "stockCount": 6,
        "price": 2900,
        "eventBadge": "CU단독 1위",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "출시 이후 누적 5,000만 개 판매 신화! 폭신하고 쫄깃한 빵 속에 연세우유 전용 고소하고 진한 동물성 가공유크림이 꽉 차 흘러넘치는 CU 대표 시그니처 생크림빵.",
    "bestQuotes": [
      "반 갈랐을 때 크림 폭포 터지는 비주얼 대박",
      "냉동실에 살짝 얼려 먹으면 크림 아이스크림 그 자체",
      "편의점 빵 퀄리티를 몇 단계 올려놓은 레전드"
    ]
  },
  {
    "id": "cvs-cu-002",
    "name": "연세우유 초코생크림빵",
    "brand": "CU",
    "category": "빵·디저트",
    "subCategory": "생크림빵/디저트",
    "itemType": "packaged",
    "image": "https://tqklhszfkvzk6518638.edge.naverncp.com/product/8801753108775_3.png",
    "releaseDate": "CU 공식 단독 베스트셀러",
    "price": 3000,
    "overallRating": 4.9,
    "ratingCount": 480,
    "searchInfluxCount": 38000,
    "stores": [
      "CU"
    ],
    "repurchasePercent": 94,
    "calories": 423,
    "volume": "135g",
    "isToday": true,
    "isHot": true,
    "isBest": true,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.7,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 423,
      "sodium": "230mg (12%)",
      "carbs": "44g (14%)",
      "sugar": "18g (18%)",
      "fat": "25g (46%)",
      "transFat": "0.3g",
      "satFat": "14g (93%)",
      "saturatedFat": "14g (93%)",
      "cholesterol": "45mg (15%)",
      "protein": "7g (13%)"
    },
    "ingredients": "식물성크림, 초코커스터드, 가공유크림(국산 원유), 초콜릿칩, 연세우유(국산), 코코아분말, 밀가루, 백설탕, 전란액",
    "allergens": [
      "밀",
      "우유",
      "대두",
      "계란"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜푸드코아 / BGF리테일",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 4일",
    "precautions": "개봉 후 즉시 섭취하시기 바라며 초코칩이 바닥면에 깔려있어 씹는 식감이 일품입니다.",
    "storeStocks": [
      {
        "store": "CU",
        "status": "입고완료",
        "stockCount": 4,
        "price": 3000,
        "eventBadge": "CU단독 디저트",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "달콤 쌉싸름한 초코 생크림과 바닥에 오독오독 씹히는 초코칩의 완벽한 조화. 초코 덕후들의 전폭적인 지지를 받는 연세우유 베스트 생크림빵.",
    "bestQuotes": [
      "진한 초코크림에 초코칩 씹히는 식감이 갓벽",
      "극강의 당충전이 필요할 때 무조건 생각나는 맛"
    ]
  },
  {
    "id": "cvs-cu-003",
    "name": "연세우유 옥수수생크림빵",
    "brand": "CU",
    "category": "빵·디저트",
    "subCategory": "생크림빵/디저트",
    "itemType": "packaged",
    "image": "https://tqklhszfkvzk6518638.edge.naverncp.com/product/8801753117265.jpg",
    "releaseDate": "CU 공식 단독 재출시",
    "price": 3200,
    "overallRating": 4.8,
    "ratingCount": 390,
    "searchInfluxCount": 32000,
    "stores": [
      "CU"
    ],
    "repurchasePercent": 92,
    "calories": 468,
    "volume": "152g",
    "isToday": false,
    "isHot": true,
    "isBest": true,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.7,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 468,
      "sodium": "360mg (18%)",
      "carbs": "55g (17%)",
      "sugar": "19g (19%)",
      "fat": "24g (44%)",
      "transFat": "0.4g",
      "satFat": "15g (100%)",
      "saturatedFat": "15g (100%)",
      "cholesterol": "50mg (17%)",
      "protein": "8g (15%)"
    },
    "ingredients": "옥수수생크림, 스위트콘(옥수수 100%), 가공유크림(국산 원유), 연세우유(국산), 옥수수쿠키분말, 밀가루, 백설탕",
    "allergens": [
      "밀",
      "우유",
      "대두",
      "계란"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜푸드코아 / BGF리테일",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 4일",
    "precautions": "옥수수 알갱이가 그대로 씹히는 리얼 옥수수 크림빵입니다.",
    "storeStocks": [
      {
        "store": "CU",
        "status": "입고완료",
        "stockCount": 3,
        "price": 3200,
        "eventBadge": "CU단독 인기",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "고소하고 달콤한 옥수수 생크림 속에 톡톡 터지는 스위트콘 알갱이가 듬뿍! 겉면의 옥수수 소보로 쿠키 토핑까지 완벽한 단짠 조합.",
    "bestQuotes": [
      "옥수수 알갱이가 톡톡 씹혀서 식감 천재",
      "옥수수 특유의 고소함과 부드러운 생크림 찰떡궁합"
    ]
  },
  {
    "id": "cvs-cu-004",
    "name": "연세우유 생크림우유롤케익",
    "brand": "CU",
    "category": "빵·디저트",
    "subCategory": "롤케익/디저트",
    "itemType": "packaged",
    "image": "https://tqklhszfkvzk6518638.edge.naverncp.com/product/8801753108058_1.png",
    "releaseDate": "CU 공식 단독 프리미엄",
    "price": 3600,
    "overallRating": 4.8,
    "ratingCount": 310,
    "searchInfluxCount": 28000,
    "stores": [
      "CU"
    ],
    "repurchasePercent": 91,
    "calories": 340,
    "volume": "110g",
    "isToday": false,
    "isHot": true,
    "isBest": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.6,
      "portion": 4.7,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 340,
      "sodium": "180mg (9%)",
      "carbs": "38g (12%)",
      "sugar": "24g (24%)",
      "fat": "19g (35%)",
      "transFat": "0.3g",
      "satFat": "11g (73%)",
      "saturatedFat": "11g (73%)",
      "cholesterol": "75mg (25%)",
      "protein": "5g (9%)"
    },
    "ingredients": "가공유크림(국산 원유), 연세우유(국산), 전란액, 박력분, 백설탕, 물엿, 유화제, 정제소금",
    "allergens": [
      "밀",
      "우유",
      "대두",
      "계란"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜푸드코아 / BGF리테일",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 5일",
    "precautions": "부드러운 카스텔라 시트 안에 신선한 생크림이 가득 차 있습니다.",
    "storeStocks": [
      {
        "store": "CU",
        "status": "입고완료",
        "stockCount": 5,
        "price": 3600,
        "eventBadge": "CU단독 디저트",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "촉촉하고 폭신한 고급 수플레 카스텔라 시트 속을 연세우유 전용 생크림으로 빈틈없이 채운 프리미엄 미니 롤케이크.",
    "bestQuotes": [
      "시트가 카스텔라처럼 사르르 녹아내림",
      "아메리카노랑 같이 먹으면 홈카페 끝판왕"
    ]
  },
  {
    "id": "cvs-cu-005",
    "name": "이웃집 통통이 약과쿠키",
    "brand": "CU",
    "category": "과자",
    "subCategory": "스낵/쿠키",
    "itemType": "packaged",
    "image": "https://tqklhszfkvzk6518638.edge.naverncp.com/product/8809411843556.jpg",
    "releaseDate": "CU 공식 단독 메가히트",
    "price": 2500,
    "overallRating": 4.8,
    "ratingCount": 420,
    "searchInfluxCount": 36000,
    "stores": [
      "CU"
    ],
    "repurchasePercent": 91,
    "calories": 479,
    "volume": "115g",
    "isToday": false,
    "isHot": true,
    "isBest": true,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.7,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 479,
      "sodium": "190mg (10%)",
      "carbs": "68g (21%)",
      "sugar": "31g (31%)",
      "fat": "21g (39%)",
      "transFat": "0.2g",
      "satFat": "9g (60%)",
      "saturatedFat": "9g (60%)",
      "cholesterol": "25mg (8%)",
      "protein": "5g (9%)"
    },
    "ingredients": "미니약과(물엿, 밀가루, 옥수수기름), 밀가루(밀: 미국산), 버터(가공버터), 흑당시럽, 계피분말, 베이킹파우더",
    "allergens": [
      "밀",
      "대두",
      "우유"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜프렌즈에프앤비 / BGF리테일",
    "storageMethod": "실온 보관 (직사광선 피함)",
    "shelfLife": "제조일로부터 30일",
    "precautions": "전자레인지에 15초 살짝 데워 바닐라 아이스크림을 얹어 드시면 더욱 맛있습니다.",
    "storeStocks": [
      {
        "store": "CU",
        "status": "입고완료",
        "stockCount": 8,
        "price": 2500,
        "eventBadge": "CU단독 PB",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "K-디저트 할매니얼 열풍의 주역! 두툼하고 꾸덕한 버터 쿠키 베이스 위에 쫀득한 찹쌀 약과가 통째로 올라간 원조 약과쿠키.",
    "bestQuotes": [
      "꾸덕하고 묵직한 식감이라 한 개만 먹어도 든든",
      "약과의 계피향과 버터쿠키의 풍미가 예술"
    ]
  },
  {
    "id": "cvs-cu-006",
    "name": "이웃집 통통이 두바이식 초코쿠키",
    "brand": "CU",
    "category": "과자",
    "subCategory": "스낵/쿠키",
    "itemType": "packaged",
    "image": "https://tqklhszfkvzk6518638.edge.naverncp.com/product/8809411844331.jpg",
    "releaseDate": "CU 공식 단독 품절대란",
    "price": 3600,
    "overallRating": 4.8,
    "ratingCount": 380,
    "searchInfluxCount": 42000,
    "stores": [
      "CU"
    ],
    "repurchasePercent": 90,
    "calories": 425,
    "volume": "100g",
    "isToday": true,
    "isHot": true,
    "isBest": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.5,
      "portion": 4.8,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 425,
      "sodium": "160mg (8%)",
      "carbs": "48g (15%)",
      "sugar": "24g (24%)",
      "fat": "23g (43%)",
      "transFat": "0.2g",
      "satFat": "11g (73%)",
      "saturatedFat": "11g (73%)",
      "cholesterol": "30mg (10%)",
      "protein": "6g (11%)"
    },
    "ingredients": "피스타치오스프레드, 볶음카다이프(터키산), 다크초콜릿, 코코아분말, 밀가루, 버터, 백설탕",
    "allergens": [
      "밀",
      "우유",
      "대두",
      "견과류(피스타치오)"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜프렌즈에프앤비 / BGF리테일",
    "storageMethod": "실온 보관 (15~25℃ 권장)",
    "shelfLife": "제조일로부터 20일",
    "precautions": "카다이프 특유의 바삭한 식감을 위해 직사광선을 피해 서늘한 곳에 보관하세요.",
    "storeStocks": [
      {
        "store": "CU",
        "status": "품절임박",
        "stockCount": 2,
        "price": 3600,
        "eventBadge": "CU단독 화제",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "SNS를 뜨겁게 달군 두바이 초콜릿을 쿠키로 재해석! 볶은 바삭한 카다이프 면과 고소한 피스타치오 스프레드가 초코 쿠키 속에 꽉 찬 디저트.",
    "bestQuotes": [
      "바삭바삭 씹히는 카다이프 식감이 중독적",
      "피스타치오 고소함과 묵직한 초콜릿의 황홀한 조합"
    ]
  },
  {
    "id": "cvs-cu-007",
    "name": "백종원 뉴 스페셜 한판 도시락",
    "brand": "CU",
    "category": "간편식",
    "subCategory": "도시락",
    "itemType": "packaged",
    "image": "https://tqklhszfkvzk6518638.edge.naverncp.com/product/8800279678335.png",
    "releaseDate": "CU 공식 단독 시그니처",
    "price": 4900,
    "overallRating": 4.8,
    "ratingCount": 460,
    "searchInfluxCount": 35000,
    "stores": [
      "CU"
    ],
    "repurchasePercent": 93,
    "calories": 780,
    "volume": "440g",
    "isToday": true,
    "isHot": true,
    "isBest": true,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.9,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 780,
      "sodium": "1280mg (64%)",
      "carbs": "98g (30%)",
      "sugar": "12g (12%)",
      "fat": "32g (59%)",
      "transFat": "0.2g",
      "satFat": "8g (53%)",
      "saturatedFat": "8g (53%)",
      "cholesterol": "85mg (28%)",
      "protein": "25g (45%)"
    },
    "ingredients": "쌀(국산 신동진미), 돼지고기(국산/불고기), 닭고기(너겟), 계란후라이, 볶음김치, 햄소시지, 분홍소시지, 시금치나물, 간장, 고추장양념",
    "allergens": [
      "밀",
      "대두",
      "돼지고기",
      "닭고기",
      "쇠고기",
      "계란",
      "우유"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜비지에프푸드 / BGF리테일",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 2일",
    "precautions": "전자레인지 조리 시 뚜껑을 살짝 덮고 1분 40초~2분(1000W) 조리해 드세요.",
    "storeStocks": [
      {
        "store": "CU",
        "status": "입고완료",
        "stockCount": 5,
        "price": 4900,
        "eventBadge": "CU단독 1위",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "백종원 대표의 레시피 노하우가 듬뿍! 매콤제육과 간장불고기 2가지 고기 메인 반찬과 계란후라이, 10여 종의 푸짐한 반찬으로 가성비 극대화.",
    "bestQuotes": [
      "고기 반찬이 2가지나 들어있어 밥 한 공기 뚝딱",
      "편의점 도시락 중 가성비와 맛 모두 압도적 1티어"
    ]
  },
  {
    "id": "cvs-cu-008",
    "name": "백종원의 고기짬뽕컵",
    "brand": "CU",
    "category": "간편식",
    "subCategory": "라면/용기면",
    "itemType": "packaged",
    "image": "https://tqklhszfkvzk6518638.edge.naverncp.com/product/8809813750346.jpg",
    "releaseDate": "CU 공식 단독 더본코리아",
    "price": 1900,
    "overallRating": 4.8,
    "ratingCount": 350,
    "searchInfluxCount": 29000,
    "stores": [
      "CU"
    ],
    "repurchasePercent": 91,
    "calories": 495,
    "volume": "105g",
    "isToday": false,
    "isHot": true,
    "isBest": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.8,
      "portion": 4.7,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 495,
      "sodium": "1780mg (89%)",
      "carbs": "68g (21%)",
      "sugar": "5g (5%)",
      "fat": "21g (39%)",
      "transFat": "0g",
      "satFat": "10g (67%)",
      "saturatedFat": "10g (67%)",
      "cholesterol": "10mg (3%)",
      "protein": "9g (16%)"
    },
    "ingredients": "면: 소맥분(밀: 호주산/미국산), 팜유, 감자전분. 스프: 고기짬뽕베이스분말, 진한사골농축액, 불맛조미유, 건조돼지고기후레이크, 건양배추, 건파, 오징어분말",
    "allergens": [
      "밀",
      "대두",
      "돼지고기",
      "쇠고기",
      "오징어",
      "조개류(굴)"
    ],
    "origin": "대한민국",
    "manufacturer": "팔도 / BGF리테일",
    "storageMethod": "실온 보관",
    "shelfLife": "제조일로부터 6개월",
    "precautions": "액상스프와 유성스프는 반드시 조리 마지막에 넣고 잘 저어 드세요.",
    "storeStocks": [
      {
        "store": "CU",
        "status": "입고완료",
        "stockCount": 12,
        "price": 1900,
        "eventBadge": "CU단독 인기",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "백종원 대표의 비법 불맛 향미유와 진한 고기 사골 육수가 어우러진 정통 중화풍 프리미엄 고기짬뽕 라면.",
    "bestQuotes": [
      "중국집 짬뽕 못지않은 불향과 깊은 국물맛",
      "해장할 때 밥 말아먹기 딱 좋은 라면"
    ]
  },
  {
    "id": "cvs-cu-009",
    "name": "급식대가 뉴정석 도시락",
    "brand": "CU",
    "category": "간편식",
    "subCategory": "도시락",
    "itemType": "packaged",
    "image": "https://tqklhszfkvzk6518638.edge.naverncp.com/product/8801771034643.png",
    "releaseDate": "CU 공식 단독 흑백요리사",
    "price": 5500,
    "overallRating": 4.9,
    "ratingCount": 410,
    "searchInfluxCount": 48000,
    "stores": [
      "CU"
    ],
    "repurchasePercent": 94,
    "calories": 795,
    "volume": "460g",
    "isToday": true,
    "isHot": true,
    "isBest": true,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.8,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 795,
      "sodium": "1350mg (68%)",
      "carbs": "102g (31%)",
      "sugar": "14g (14%)",
      "fat": "31g (57%)",
      "transFat": "0.2g",
      "satFat": "9g (60%)",
      "saturatedFat": "9g (60%)",
      "cholesterol": "90mg (30%)",
      "protein": "27g (49%)"
    },
    "ingredients": "쌀(국산), 매콤닭볶음, 돼지고기간장불고기, 분홍소시지전, 계란말이, 미역줄기볶음, 볶음김치, 멸치볶음, 고추장양념장",
    "allergens": [
      "밀",
      "대두",
      "돼지고기",
      "닭고기",
      "계란",
      "우유"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜비지에프푸드 / BGF리테일",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 2일",
    "precautions": "전자레인지 1000W 1분 40초, 700W 2분 조리",
    "storeStocks": [
      {
        "store": "CU",
        "status": "입고완료",
        "stockCount": 4,
        "price": 5500,
        "eventBadge": "CU단독 화제",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "넷플릭스 흑백요리사 화제의 인물 이미영 조리사(급식대가)와의 공식 단독 콜라보! 집밥처럼 정갈하고 자극적이지 않으면서 속 편한 정석 한상 차림.",
    "bestQuotes": [
      "학창시절 맛있던 급식의 최고급 업그레이드 버전",
      "간이 짜지 않고 정갈해서 매일 먹어도 안 질릴 맛"
    ]
  },
  {
    "id": "cvs-gs-001",
    "name": "오모리 점보도시락 라면 (8인분 대용량)",
    "brand": "GS25",
    "category": "간편식",
    "subCategory": "라면/용기면",
    "itemType": "packaged",
    "image": "https://hpsimg.gsretail.com/medias/sys_master/images/images/h8a/h61/9086716051486.jpg",
    "releaseDate": "GS25 공식 단독 메가히트",
    "price": 8500,
    "overallRating": 4.8,
    "ratingCount": 390,
    "searchInfluxCount": 52000,
    "stores": [
      "GS25"
    ],
    "repurchasePercent": 88,
    "calories": 3160,
    "volume": "648g",
    "isToday": true,
    "isHot": true,
    "isBest": true,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.9,
      "portion": 5,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 3160,
      "sodium": "11200mg (560%)",
      "carbs": "424g (131%)",
      "sugar": "24g (24%)",
      "fat": "136g (252%)",
      "transFat": "0g",
      "satFat": "64g (427%)",
      "saturatedFat": "64g (427%)",
      "cholesterol": "40mg (13%)",
      "protein": "64g (116%)"
    },
    "ingredients": "면(소맥분, 팜유, 감자전분, 정제염), 분말스프(정제염, 설탕, 복합간장분말, 소고기맛분말, 고춧가루, 포도당), 건더기스프(건파, 건당근, 건미역)",
    "allergens": [
      "밀",
      "대두",
      "쇠고기"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜팔도 / GS리테일",
    "storageMethod": "실온 보관 (직사광선 피함)",
    "shelfLife": "제조일로부터 6개월",
    "precautions": "끓는 물 2.2L 필요. 캠핑, 파티 등 여러 명이 모였을 때 드시기를 권장합니다.",
    "storeStocks": [
      {
        "store": "GS25",
        "status": "품절임박",
        "stockCount": 2,
        "price": 8500,
        "eventBadge": "GS25 단독",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "기존 도시락 라면 대비 용량 8.5배! 점보 시리즈 신화를 쓴 초대형 파티용 컵라면으로 유튜브 및 챌린지 먹방 열풍을 주도한 GS25 대표 명작.",
    "bestQuotes": [
      "친구들이랑 파티할 때 이거 하나 끓이면 분위기 종결",
      "양만 많은 게 아니라 옛날 도시락 라면의 그 감칠맛 그대로"
    ]
  },
  {
    "id": "cvs-gs-002",
    "name": "공간춘 쟁반짬짜면 (8인분 대용량)",
    "brand": "GS25",
    "category": "간편식",
    "subCategory": "라면/용기면",
    "itemType": "packaged",
    "image": "https://hpsimg.gsretail.com/medias/sys_master/images/images/h21/h47/9090978381854.jpg",
    "releaseDate": "GS25 공식 단독 점보시리즈",
    "price": 12300,
    "overallRating": 4.8,
    "ratingCount": 340,
    "searchInfluxCount": 41000,
    "stores": [
      "GS25"
    ],
    "repurchasePercent": 89,
    "calories": 3915,
    "volume": "940g",
    "isToday": false,
    "isHot": true,
    "isBest": true,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.8,
      "portion": 5,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 3915,
      "sodium": "9800mg (490%)",
      "carbs": "540g (167%)",
      "sugar": "48g (48%)",
      "fat": "155g (287%)",
      "transFat": "0g",
      "satFat": "70g (467%)",
      "saturatedFat": "70g (467%)",
      "cholesterol": "55mg (18%)",
      "protein": "88g (160%)"
    },
    "ingredients": "공화춘 자장소스(춘장, 양파, 돼지고기), 틈새라면 매운양념스프, 면 8개입, 건양배추, 건파",
    "allergens": [
      "밀",
      "대두",
      "돼지고기",
      "쇠고기"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜팔도 / GS리테일",
    "storageMethod": "실온 보관",
    "shelfLife": "제조일로부터 6개월",
    "precautions": "물 버리는 구멍을 이용해 물을 따라낸 후 자장소스와 매운짬뽕스프를 취향껏 비벼드세요.",
    "storeStocks": [
      {
        "store": "GS25",
        "status": "입고완료",
        "stockCount": 3,
        "price": 12300,
        "eventBadge": "GS25 단독",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "GS25의 양대 메가히트 PB인 공화춘 자장과 틈새라면을 하나로 섞은 초대형 8인분 쟁반짬짜면. 달콤 짭조름한 짜장에 화끈한 불맛이 어우러진 매콤짜장의 끝판왕.",
    "bestQuotes": [
      "자장과 짬뽕소스 비율이 완벽해서 물리지 않고 계속 들어감",
      "캠핑장 인싸템 인정"
    ]
  },
  {
    "id": "cvs-gs-003",
    "name": "혜자로운 집밥 제육볶음 도시락",
    "brand": "GS25",
    "category": "간편식",
    "subCategory": "도시락",
    "itemType": "packaged",
    "image": "https://hpsimg.gsretail.com/medias/sys_master/images/images/hf4/hd0/9096993243166.jpg",
    "releaseDate": "GS25 공식 단독 베스트셀러",
    "price": 4500,
    "overallRating": 4.9,
    "ratingCount": 510,
    "searchInfluxCount": 46000,
    "stores": [
      "GS25"
    ],
    "repurchasePercent": 96,
    "calories": 723,
    "volume": "410g",
    "isToday": true,
    "isHot": true,
    "isBest": true,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 723,
      "sodium": "1190mg (60%)",
      "carbs": "95g (29%)",
      "sugar": "10g (10%)",
      "fat": "27g (50%)",
      "transFat": "0.2g",
      "satFat": "7g (47%)",
      "saturatedFat": "7g (47%)",
      "cholesterol": "80mg (27%)",
      "protein": "25g (45%)"
    },
    "ingredients": "쌀(국산 농협쌀), 돼지고기제육볶음(국산 돼지고기 65%, 고추장양념), 계란후라이, 떡갈비, 어묵볶음, 볶음김치, 참기름(별첨)",
    "allergens": [
      "밀",
      "대두",
      "돼지고기",
      "쇠고기",
      "계란"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜후레쉬퍼스트 / GS리테일",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 2일",
    "precautions": "전자레인지 조리 전 별첨 참기름을 빼고 조리 후 밥에 뿌려 비벼 드시면 풍미가 배가됩니다.",
    "storeStocks": [
      {
        "store": "GS25",
        "status": "입고완료",
        "stockCount": 6,
        "price": 4500,
        "eventBadge": "GS25 대표도시락",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "대한민국에 ‘혜자롭다’는 신조어를 탄생시킨 전설의 귀환! 푸짐한 고추장 제육볶음과 갓 부쳐낸 완숙 계란후라이, 별첨 고소한 참기름이 들어간 국민 든든 한끼.",
    "bestQuotes": [
      "밥 위에 계란후라이 올라간 것부터 감동",
      "고기 양이 넉넉해서 마지막 한 숟가락까지 밥이 안 모자람"
    ]
  },
  {
    "id": "cvs-gs-004",
    "name": "브레디크(Bredique) 순우유 생크림빵",
    "brand": "GS25",
    "category": "빵·디저트",
    "subCategory": "생크림빵/디저트",
    "itemType": "packaged",
    "image": "https://hpsimg.gsretail.com/medias/sys_master/images/images/hfe/had/9078658007070.jpg",
    "releaseDate": "GS25 공식 단독 베이커리",
    "price": 2600,
    "overallRating": 4.8,
    "ratingCount": 370,
    "searchInfluxCount": 29000,
    "stores": [
      "GS25"
    ],
    "repurchasePercent": 92,
    "calories": 365,
    "volume": "125g",
    "isToday": false,
    "isHot": true,
    "isBest": true,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.8,
      "portion": 4.8,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 365,
      "sodium": "210mg (11%)",
      "carbs": "38g (12%)",
      "sugar": "12g (12%)",
      "fat": "21g (39%)",
      "transFat": "0.3g",
      "satFat": "11g (73%)",
      "saturatedFat": "11g (73%)",
      "cholesterol": "45mg (15%)",
      "protein": "6g (11%)"
    },
    "ingredients": "우유(국산 100%), 식물성유크림, 유크림(국산), 밀가루, 백설탕, 마가린, 효모, 정제염",
    "allergens": [
      "밀",
      "우유",
      "대두",
      "계란"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜SPC삼립 / GS리테일",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 4일",
    "precautions": "신선한 1등급 원유를 사용하여 부드러운 우유 풍미를 느끼실 수 있습니다.",
    "storeStocks": [
      {
        "store": "GS25",
        "status": "입고완료",
        "stockCount": 5,
        "price": 2600,
        "eventBadge": "GS25 단독",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "물 대신 100% 국산 원유로 반죽하여 빵결이 쫄깃하고 부드러우며, 신선하고 깔끔한 순우유 생크림이 가득 찬 GS25 프리미엄 베이커리 대표작.",
    "bestQuotes": [
      "느끼하지 않고 우유의 고소한 맛이 깔끔하게 남음",
      "빵 시트가 퍽퍽하지 않고 엄청 쫄깃함"
    ]
  },
  {
    "id": "cvs-gs-005",
    "name": "넷플릭스 콤보 팝콘 (400g 대용량)",
    "brand": "GS25",
    "category": "과자",
    "subCategory": "스낵/팝콘",
    "itemType": "packaged",
    "image": "https://hpsimg.gsretail.com/medias/sys_master/images/images/hfb/h58/9086647828510.jpg",
    "releaseDate": "GS25 공식 단독 넷플릭스",
    "price": 6900,
    "overallRating": 4.8,
    "ratingCount": 360,
    "searchInfluxCount": 33000,
    "stores": [
      "GS25"
    ],
    "repurchasePercent": 91,
    "calories": 2040,
    "volume": "400g",
    "isToday": false,
    "isHot": true,
    "isBest": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.9,
      "portion": 5,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 2040,
      "sodium": "1600mg (80%)",
      "carbs": "268g (83%)",
      "sugar": "84g (84%)",
      "fat": "96g (178%)",
      "transFat": "0g",
      "satFat": "40g (267%)",
      "saturatedFat": "40g (267%)",
      "cholesterol": "12mg (4%)",
      "protein": "24g (44%)"
    },
    "ingredients": "옥수수(미국산 유전자변형 옥수수포함가능성있음), 팜올레인유, 캐러멜시럽(설탕, 물엿), 버터솔트시즈닝",
    "allergens": [
      "대두",
      "우유"
    ],
    "origin": "대한민국",
    "manufacturer": "제이앤이 / GS리테일",
    "storageMethod": "실온 보관 (지퍼백 밀봉)",
    "shelfLife": "제조일로부터 6개월",
    "precautions": "지퍼백 패키지가 적용되어 영화를 보며 먹다 남아도 바삭함이 오래 유지됩니다.",
    "storeStocks": [
      {
        "store": "GS25",
        "status": "입고완료",
        "stockCount": 7,
        "price": 6900,
        "eventBadge": "넷플릭스 공식",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "넷플릭스 정주행러들의 필수 동반자! 일반 팝콘의 6배에 달하는 초대형 사이즈에 달콤한 캐러멜 팝콘과 짭짤한 버터 솔트 팝콘을 황금 비율로 믹스한 단짠 대명사.",
    "bestQuotes": [
      "주말에 영화 시리즈 볼 때 옆에 두고 먹으면 최고",
      "지퍼백 있어서 보관하기 너무 편함"
    ]
  },
  {
    "id": "cvs-gs-006",
    "name": "GS25 PB 용기면 4대 명작 (오모리·공화춘)",
    "brand": "GS25",
    "category": "간편식",
    "subCategory": "라면/용기면",
    "itemType": "packaged",
    "image": "https://hpsimg.gsretail.com/medias/sys_master/images/images/h20/h03/9092547051550.jpg",
    "releaseDate": "GS25 공식 단독 시그니처 PB",
    "price": 1800,
    "overallRating": 4.9,
    "ratingCount": 550,
    "searchInfluxCount": 47000,
    "stores": [
      "GS25"
    ],
    "repurchasePercent": 95,
    "calories": 485,
    "volume": "160g",
    "isToday": true,
    "isHot": true,
    "isBest": true,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.8,
      "portion": 4.8,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 485,
      "sodium": "1870mg (94%)",
      "carbs": "68g (21%)",
      "sugar": "4g (4%)",
      "fat": "19g (35%)",
      "transFat": "0g",
      "satFat": "9g (60%)",
      "saturatedFat": "9g (60%)",
      "cholesterol": "5mg (2%)",
      "protein": "10g (18%)"
    },
    "ingredients": "면: 소맥분(호주산, 미국산), 팜유, 감자전분. 오모리묵은지김치원물(배추, 무, 고춧가루, 멸치액젓, 정제염), 김치찌개분말양념, 건파",
    "allergens": [
      "밀",
      "대두",
      "쇠고기",
      "돼지고기"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜팔도 / GS리테일",
    "storageMethod": "실온 보관 (직사광선 피함)",
    "shelfLife": "제조일로부터 6개월",
    "precautions": "진짜 3년 숙성 묵은지 파우치가 동봉되어 있어 건더기 식감과 국물의 깊이가 다릅니다.",
    "storeStocks": [
      {
        "store": "GS25",
        "status": "입고완료",
        "stockCount": 15,
        "price": 1800,
        "eventBadge": "GS25 부동의 1위",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "해외 24개국 수출 및 GS25 컵라면 부동의 판매 1위! 3년 숙성 오모리 묵은지 파우치를 통째로 넣어 시원 칼칼한 김치찌개 본연의 국물 맛을 완벽 구현.",
    "bestQuotes": [
      "가루 스프가 아니라 진짜 묵은지 파우치라 국물 깊이가 차원이 다름",
      "편의점 컵라면 원탑"
    ]
  },
  {
    "id": "cvs-gs-007",
    "name": "유어스(YOUUS) 로얄밀크티 250ml",
    "brand": "GS25",
    "category": "음료",
    "subCategory": "커피/차",
    "itemType": "packaged",
    "image": "https://hpsimg.gsretail.com/medias/sys_master/images/images/h36/had/9152603389982.jpg",
    "releaseDate": "GS25 공식 단독 PB",
    "price": 2200,
    "overallRating": 4.8,
    "ratingCount": 290,
    "searchInfluxCount": 23000,
    "stores": [
      "GS25"
    ],
    "repurchasePercent": 91,
    "calories": 165,
    "volume": "250ml",
    "isToday": false,
    "isHot": true,
    "isBest": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.7,
      "portion": 4.7,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 165,
      "sodium": "95mg (5%)",
      "carbs": "26g (8%)",
      "sugar": "24g (24%)",
      "fat": "4.8g (9%)",
      "transFat": "0g",
      "satFat": "3.1g (21%)",
      "saturatedFat": "3.1g (21%)",
      "cholesterol": "15mg (5%)",
      "protein": "4.5g (8%)"
    },
    "ingredients": "원유(국산 45%), 정제수, 홍차추출액(우바홍차 100%), 백설탕, 탈지분유, 탄산수소나트륨, 홍차향 천연향료",
    "allergens": [
      "우유"
    ],
    "origin": "대한민국",
    "manufacturer": "매일유업 / GS리테일",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 21일",
    "precautions": "세계 3대 홍차인 스리랑카 우바 홍차를 사용하여 은은한 꽃향과 부드러운 밀크의 조화가 뛰어납니다.",
    "storeStocks": [
      {
        "store": "GS25",
        "status": "입고완료",
        "stockCount": 8,
        "price": 2200,
        "eventBadge": "GS25 단독 PB",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "데이터로 발굴한 틈새 취향 저격! 세계 3대 홍차 우바(Uva) 홍차 찻잎을 직접 우려 국산 신선한 원유와 블렌딩한 풍부하고 진한 프리미엄 냉장 밀크티.",
    "bestQuotes": [
      "카페 밀크티보다 진하고 떫은맛 없이 부드러움",
      "단맛이 과하지 않고 홍차 향이 예술"
    ]
  },
  {
    "id": "cvs-seven-001",
    "name": "시경픽 비법간장 가을무비빔밥 도시락",
    "brand": "세븐일레븐",
    "category": "간편식",
    "subCategory": "도시락",
    "itemType": "packaged",
    "image": "https://www.7-eleven.co.kr/upload/product/8801118/034367.1.jpg",
    "releaseDate": "세븐일레븐 공식 단독 성시경 콜라보",
    "price": 5200,
    "overallRating": 4.8,
    "ratingCount": 380,
    "searchInfluxCount": 34000,
    "stores": [
      "세븐일레븐"
    ],
    "repurchasePercent": 93,
    "calories": 685,
    "volume": "420g",
    "isToday": true,
    "isHot": true,
    "isBest": true,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.8,
      "portion": 4.8,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 685,
      "sodium": "1180mg (59%)",
      "carbs": "94g (29%)",
      "sugar": "11g (11%)",
      "fat": "23g (43%)",
      "transFat": "0.2g",
      "satFat": "5g (33%)",
      "saturatedFat": "5g (33%)",
      "cholesterol": "65mg (22%)",
      "protein": "22g (40%)"
    },
    "ingredients": "쌀(국산), 양념소고기볶음, 가을무생채, 콩나물, 당근채, 표고버섯, 애호박볶음, 계란지단, 비법간장양념장, 들기름(별첨)",
    "allergens": [
      "밀",
      "대두",
      "쇠고기",
      "계란"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜롯데푸드 / 코리아세븐",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 2일",
    "precautions": "비법 간장 양념장과 고소한 들기름을 취향껏 둘러 비벼 드세요.",
    "storeStocks": [
      {
        "store": "세븐일레븐",
        "status": "입고완료",
        "stockCount": 4,
        "price": 5200,
        "eventBadge": "세븐일레븐 단독",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "연예계 대표 미식가 성시경의 레시피 노하우를 담은 ‘시경픽’ 시리즈! 달큰한 제철 가을무 생채와 불향 입힌 소고기, 감칠맛 넘치는 비법 맛간장의 환상 조합.",
    "bestQuotes": [
      "고추장 비빔밥보다 훨씬 깔끔하고 고급스러운 간장 양념",
      "무생채 아삭함과 들기름 향이 미쳤음"
    ]
  },
  {
    "id": "cvs-seven-002",
    "name": "시경픽 전주식 소고기비빔밥 도시락",
    "brand": "세븐일레븐",
    "category": "간편식",
    "subCategory": "도시락",
    "itemType": "packaged",
    "image": "https://www.7-eleven.co.kr/upload/product/8801118/033827.1.jpg",
    "releaseDate": "세븐일레븐 공식 단독 성시경 콜라보",
    "price": 5000,
    "overallRating": 4.8,
    "ratingCount": 360,
    "searchInfluxCount": 31000,
    "stores": [
      "세븐일레븐"
    ],
    "repurchasePercent": 92,
    "calories": 670,
    "volume": "415g",
    "isToday": false,
    "isHot": true,
    "isBest": true,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.8,
      "portion": 4.8,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 670,
      "sodium": "1240mg (62%)",
      "carbs": "92g (28%)",
      "sugar": "13g (13%)",
      "fat": "22g (41%)",
      "transFat": "0.1g",
      "satFat": "5g (33%)",
      "saturatedFat": "5g (33%)",
      "cholesterol": "70mg (23%)",
      "protein": "24g (44%)"
    },
    "ingredients": "쌀(국산), 소불고기(국산 쇠고기), 고사리, 도라지, 콩나물, 시금치, 청포묵, 계란후라이, 볶음고추장, 참기름",
    "allergens": [
      "밀",
      "대두",
      "쇠고기",
      "계란"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜롯데웰푸드 / 코리아세븐",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 2일",
    "precautions": "전자레인지 1000W 1분 30초, 700W 2분 조리",
    "storeStocks": [
      {
        "store": "세븐일레븐",
        "status": "입고완료",
        "stockCount": 5,
        "price": 5000,
        "eventBadge": "세븐일레븐 인기",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "전주 종가의 손맛을 재현한 8가지 다채로운 나물과 볶은 소고기 고명, 비법 볶음 고추장이 어우러진 정통 프리미엄 비빔밥 도시락.",
    "bestQuotes": [
      "나물이 골고루 풍성하게 들어있어 건강한 한 끼 느낌",
      "볶음 고추장이 매콤달콤해서 밥맛이 확 돔"
    ]
  },
  {
    "id": "cvs-seven-003",
    "name": "시경픽 비법강된장 불고기비빔밥 도시락",
    "brand": "세븐일레븐",
    "category": "간편식",
    "subCategory": "도시락",
    "itemType": "packaged",
    "image": "https://www.7-eleven.co.kr/upload/product/8809827/508223.1.jpg",
    "releaseDate": "세븐일레븐 공식 단독 성시경 콜라보",
    "price": 5200,
    "overallRating": 4.8,
    "ratingCount": 320,
    "searchInfluxCount": 27000,
    "stores": [
      "세븐일레븐"
    ],
    "repurchasePercent": 91,
    "calories": 690,
    "volume": "430g",
    "isToday": false,
    "isHot": true,
    "isBest": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.7,
      "portion": 4.8,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 690,
      "sodium": "1310mg (66%)",
      "carbs": "96g (30%)",
      "sugar": "10g (10%)",
      "fat": "24g (44%)",
      "transFat": "0.2g",
      "satFat": "6g (40%)",
      "saturatedFat": "6g (40%)",
      "cholesterol": "75mg (25%)",
      "protein": "25g (45%)"
    },
    "ingredients": "쌀(국산), 돼지불고기, 우렁강된장소스(재래된장, 우렁살, 두부, 양파, 대파), 열무나물, 콩나물, 호박볶음, 계란지단",
    "allergens": [
      "밀",
      "대두",
      "돼지고기",
      "계란",
      "조개류(우렁이)"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜롯데웰푸드 / 코리아세븐",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 2일",
    "precautions": "강된장 소스를 밥 위에 붓고 골고루 비벼 드세요.",
    "storeStocks": [
      {
        "store": "세븐일레븐",
        "status": "입고완료",
        "stockCount": 3,
        "price": 5200,
        "eventBadge": "세븐일레븐 단독",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "구수하게 끓여낸 뚝배기 우렁 강된장과 짭조름한 돼지불고기를 듬뿍 올려 비벼 먹는 구수하고 진한 토속 비빔밥.",
    "bestQuotes": [
      "우렁이 씹히는 강된장 소스가 진짜 밥도둑",
      "자극적이지 않고 속 편한 토속의 맛"
    ]
  },
  {
    "id": "cvs-seven-004",
    "name": "All New 짜계치에그말이 김밥",
    "brand": "세븐일레븐",
    "category": "간편식",
    "subCategory": "주먹밥/김밥",
    "itemType": "packaged",
    "image": "https://www.7-eleven.co.kr/upload/product/8809827/508209.1.jpg",
    "releaseDate": "세븐일레븐 공식 단독 리뉴얼",
    "price": 3200,
    "overallRating": 4.8,
    "ratingCount": 280,
    "searchInfluxCount": 25000,
    "stores": [
      "세븐일레븐"
    ],
    "repurchasePercent": 90,
    "calories": 385,
    "volume": "235g",
    "isToday": false,
    "isHot": true,
    "isBest": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.8,
      "portion": 4.7,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 385,
      "sodium": "890mg (45%)",
      "carbs": "54g (17%)",
      "sugar": "6g (6%)",
      "fat": "14g (26%)",
      "transFat": "0.1g",
      "satFat": "4.5g (30%)",
      "saturatedFat": "4.5g (30%)",
      "cholesterol": "60mg (20%)",
      "protein": "11g (20%)"
    },
    "ingredients": "쌀(국산), 짜장소스(춘장, 다진돼지고기, 양파), 체다슬라이스치즈, 두툼에그말이지단(계란 100%), 단무지, 조미김",
    "allergens": [
      "밀",
      "대두",
      "돼지고기",
      "우유",
      "계란"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜롯데웰푸드 / 코리아세븐",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 2일",
    "precautions": "전자레인지 30초 데워 치즈를 살짝 녹여 드시면 훨씬 맛있습니다.",
    "storeStocks": [
      {
        "store": "세븐일레븐",
        "status": "입고완료",
        "stockCount": 6,
        "price": 3200,
        "eventBadge": "세븐일레븐 단독",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "PC방 최고의 인기 조합 ‘짜장라면+계란+치즈(짜계치)’를 김밥으로 완벽 구현! 두툼한 통계란말이와 녹아내리는 치즈, 감칠맛 짜장의 꿀조합.",
    "bestQuotes": [
      "짜계치의 그 맛이 한 줄에 꽉 차 있음",
      "전자레인지에 돌려먹으면 치즈 녹아서 극락"
    ]
  },
  {
    "id": "cvs-seven-005",
    "name": "세븐셀렉트 앙리마티스 카페라떼 250ml",
    "brand": "세븐일레븐",
    "category": "음료",
    "subCategory": "커피/차",
    "itemType": "packaged",
    "image": "https://www.7-eleven.co.kr/upload/product/8801155/743161.1.jpg",
    "releaseDate": "세븐일레븐 공식 단독 PB 아트콜라보",
    "price": 2400,
    "overallRating": 4.8,
    "ratingCount": 310,
    "searchInfluxCount": 22000,
    "stores": [
      "세븐일레븐"
    ],
    "repurchasePercent": 91,
    "calories": 170,
    "volume": "250ml",
    "isToday": false,
    "isHot": true,
    "isBest": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.7,
      "portion": 4.7,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 170,
      "sodium": "115mg (6%)",
      "carbs": "22g (7%)",
      "sugar": "20g (20%)",
      "fat": "6.5g (12%)",
      "transFat": "0g",
      "satFat": "4.2g (28%)",
      "saturatedFat": "4.2g (28%)",
      "cholesterol": "20mg (7%)",
      "protein": "5.5g (10%)"
    },
    "ingredients": "원유(국산 50%), 에스프레소커피추출액(콜롬비아산/에티오피아산 아라비카 원두), 정제수, 백설탕, 탄산수소나트륨",
    "allergens": [
      "우유"
    ],
    "origin": "대한민국",
    "manufacturer": "동원F&B / 코리아세븐",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 28일",
    "precautions": "세계적인 화가 앙리 마티스의 명화를 감상하며 마시는 프리미엄 컵커피입니다.",
    "storeStocks": [
      {
        "store": "세븐일레븐",
        "status": "입고완료",
        "stockCount": 8,
        "price": 2400,
        "eventBadge": "세븐셀렉트 PB",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "프랑스 거장 앙리 마티스의 대표 명화 ‘카티아’ 패키지에 고품격 아라비카 원두와 국산 원유 50%의 부드러움을 담아낸 세븐셀렉트 시그니처 아트 라떼.",
    "bestQuotes": [
      "패키지가 예뻐서 들고 다니기만 해도 기분 좋음",
      "원유 함량이 높아서 텁텁하지 않고 부드러운 라떼"
    ]
  },
  {
    "id": "cvs-seven-006",
    "name": "세븐셀렉트 앙리마티스 바닐라라떼 250ml",
    "brand": "세븐일레븐",
    "category": "음료",
    "subCategory": "커피/차",
    "itemType": "packaged",
    "image": "https://www.7-eleven.co.kr/upload/product/8801155/743178.1.jpg",
    "releaseDate": "세븐일레븐 공식 단독 PB 아트콜라보",
    "price": 2400,
    "overallRating": 4.8,
    "ratingCount": 290,
    "searchInfluxCount": 20000,
    "stores": [
      "세븐일레븐"
    ],
    "repurchasePercent": 90,
    "calories": 180,
    "volume": "250ml",
    "isToday": false,
    "isHot": true,
    "isBest": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.7,
      "portion": 4.7,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 180,
      "sodium": "110mg (6%)",
      "carbs": "25g (8%)",
      "sugar": "23g (23%)",
      "fat": "6.5g (12%)",
      "transFat": "0g",
      "satFat": "4.2g (28%)",
      "saturatedFat": "4.2g (28%)",
      "cholesterol": "20mg (7%)",
      "protein": "5.2g (9%)"
    },
    "ingredients": "원유(국산 48%), 에스프레소추출액, 천연바닐라추출물(마다가스카르산), 정제수, 백설탕, 유화제",
    "allergens": [
      "우유"
    ],
    "origin": "대한민국",
    "manufacturer": "동원F&B / 코리아세븐",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 28일",
    "precautions": "마다가스카르산 천연 바닐라빈의 그윽한 향미가 살아있습니다.",
    "storeStocks": [
      {
        "store": "세븐일레븐",
        "status": "입고완료",
        "stockCount": 7,
        "price": 2400,
        "eventBadge": "세븐셀렉트 PB",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "마다가스카르산 고급 바닐라빈 추출물의 감미로운 풍미와 진한 에스프레소, 부드러운 우유가 어우러진 프리미엄 아트 콜라보 바닐라라떼.",
    "bestQuotes": [
      "인공 바닐라 시럽 맛이 아니라 은은하고 고급진 바닐라빈 향",
      "당 떨어지는 오후에 마시기 최고"
    ]
  },
  {
    "id": "cvs-seven-007",
    "name": "복가득 담은 고기산적무스비",
    "brand": "세븐일레븐",
    "category": "간편식",
    "subCategory": "주먹밥/김밥",
    "itemType": "packaged",
    "image": "https://www.7-eleven.co.kr/upload/product/8809827/508247.1.jpg",
    "releaseDate": "세븐일레븐 공식 단독 시즌 한정",
    "price": 2800,
    "overallRating": 4.8,
    "ratingCount": 260,
    "searchInfluxCount": 21000,
    "stores": [
      "세븐일레븐"
    ],
    "repurchasePercent": 89,
    "calories": 340,
    "volume": "185g",
    "isToday": false,
    "isHot": true,
    "isBest": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.8,
      "portion": 4.8,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 340,
      "sodium": "720mg (36%)",
      "carbs": "48g (15%)",
      "sugar": "5g (5%)",
      "fat": "12g (22%)",
      "transFat": "0.1g",
      "satFat": "4g (27%)",
      "saturatedFat": "4g (27%)",
      "cholesterol": "45mg (15%)",
      "protein": "10g (18%)"
    },
    "ingredients": "쌀(국산), 고기산적(돼지고기, 쇠고기, 간장양념, 대파, 버섯), 계란지단, 볶음김치, 조미김, 참기름",
    "allergens": [
      "밀",
      "대두",
      "돼지고기",
      "쇠고기",
      "계란"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜그린푸드 / 코리아세븐",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 2일",
    "precautions": "전자레인지 1000W 30초, 700W 40초 조리",
    "storeStocks": [
      {
        "store": "세븐일레븐",
        "status": "입고완료",
        "stockCount": 6,
        "price": 2800,
        "eventBadge": "세븐일레븐 단독",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "두툼한 정통 고기산적 패티와 노란 계란말이, 매콤새콤 볶음김치를 차곡차곡 쌓아 올린 하와이안 스타일의 든든한 프리미엄 사각 무스비 주먹밥.",
    "bestQuotes": [
      "고기산적이 엄청 두툼해서 씹는 맛이 제대로",
      "삼각김밥보다 훨씬 든든하고 반찬이랑 밥 비율 굿"
    ]
  },
  {
    "id": "cvs-seven-008",
    "name": "복가득 담은 떡갈비김밥",
    "brand": "세븐일레븐",
    "category": "간편식",
    "subCategory": "주먹밥/김밥",
    "itemType": "packaged",
    "image": "https://www.7-eleven.co.kr/upload/product/8809827/508285.1.jpg",
    "releaseDate": "세븐일레븐 공식 단독 시즌 한정",
    "price": 3400,
    "overallRating": 4.8,
    "ratingCount": 270,
    "searchInfluxCount": 22000,
    "stores": [
      "세븐일레븐"
    ],
    "repurchasePercent": 90,
    "calories": 410,
    "volume": "240g",
    "isToday": false,
    "isHot": true,
    "isBest": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.8,
      "portion": 4.8,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 410,
      "sodium": "860mg (43%)",
      "carbs": "60g (19%)",
      "sugar": "7g (7%)",
      "fat": "14g (26%)",
      "transFat": "0.1g",
      "satFat": "4.5g (30%)",
      "saturatedFat": "4.5g (30%)",
      "cholesterol": "50mg (17%)",
      "protein": "12g (22%)"
    },
    "ingredients": "쌀(국산), 숯불떡갈비(국산 돼지고기 70%, 숯불갈비양념), 우엉조림, 단무지, 당근, 시금치, 계란구이, 참기름",
    "allergens": [
      "밀",
      "대두",
      "돼지고기",
      "쇠고기",
      "계란"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜그린푸드 / 코리아세븐",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 2일",
    "precautions": "전자레인지 30초 데워 드시면 떡갈비의 육즙이 부드럽게 살아납니다.",
    "storeStocks": [
      {
        "store": "세븐일레븐",
        "status": "입고완료",
        "stockCount": 5,
        "price": 3400,
        "eventBadge": "세븐일레븐 단독",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "숯불 향이 은은하게 감도는 두툼한 수제 스타일 떡갈비 한 줄을 통째로 넣고 아삭한 우엉과 단무지로 밸런스를 맞춘 세븐일레븐 정통 김밥.",
    "bestQuotes": [
      "떡갈비가 큼직하게 들어가 있어서 달콤짭짤 맛있음",
      "바쁜 아침 간편 식사로 딱"
    ]
  },
  {
    "id": "cvs-emart24-001",
    "name": "박은영 사천식 오리고기 삼각김밥",
    "brand": "이마트24",
    "category": "간편식",
    "subCategory": "삼각김밥",
    "itemType": "packaged",
    "image": "https://msave.emart24.co.kr/cmsbo/upload/nHq/plu_image/500x500/8800323763093.JPG",
    "releaseDate": "이마트24 공식 단독 흑백요리사",
    "price": 1400,
    "overallRating": 4.8,
    "ratingCount": 380,
    "searchInfluxCount": 42000,
    "stores": [
      "이마트24"
    ],
    "repurchasePercent": 92,
    "calories": 215,
    "volume": "115g",
    "isToday": true,
    "isHot": true,
    "isBest": true,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.8,
      "portion": 4.7,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 215,
      "sodium": "490mg (25%)",
      "carbs": "37g (11%)",
      "sugar": "3g (3%)",
      "fat": "5.5g (10%)",
      "transFat": "0g",
      "satFat": "1.8g (12%)",
      "saturatedFat": "1.8g (12%)",
      "cholesterol": "25mg (8%)",
      "protein": "6g (11%)"
    },
    "ingredients": "쌀(국산), 오리고기볶음(국산 훈제오리고기 60%, 사천식두반장양념, 마늘, 고추기름, 굴소스), 조미김, 정제염, 참기름",
    "allergens": [
      "밀",
      "대두",
      "오리고기",
      "조개류(굴)"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜이마트24 / 델리카에프에스",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 2일",
    "precautions": "전자레인지 1000W 20초, 700W 30초 조리",
    "storeStocks": [
      {
        "store": "이마트24",
        "status": "입고완료",
        "stockCount": 7,
        "price": 1400,
        "eventBadge": "흑백요리사 공식",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "넷플릭스 흑백요리사 화제의 중식 셰프 박은영과의 공식 단독 협업! 훈제 오리고기에 매콤 알싸한 특제 사천식 마라 두반장 소스를 버무려 꽉 채운 삼각김밥.",
    "bestQuotes": [
      "오리고기 특유의 고소함과 사천식 매콤함이 환상적",
      "1400원의 행복, 흑백요리사 콜라보 중 제일 가성비 좋음"
    ]
  },
  {
    "id": "cvs-emart24-002",
    "name": "박은영 짬뽕짜장 불고기김밥",
    "brand": "이마트24",
    "category": "간편식",
    "subCategory": "주먹밥/김밥",
    "itemType": "packaged",
    "image": "https://msave.emart24.co.kr/cmsbo/upload/nHq/plu_image/500x500/8800323763154.JPG",
    "releaseDate": "이마트24 공식 단독 흑백요리사",
    "price": 3500,
    "overallRating": 4.8,
    "ratingCount": 340,
    "searchInfluxCount": 36000,
    "stores": [
      "이마트24"
    ],
    "repurchasePercent": 91,
    "calories": 415,
    "volume": "245g",
    "isToday": true,
    "isHot": true,
    "isBest": true,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.8,
      "portion": 4.8,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 415,
      "sodium": "890mg (45%)",
      "carbs": "62g (19%)",
      "sugar": "7g (7%)",
      "fat": "13g (24%)",
      "transFat": "0.1g",
      "satFat": "4g (27%)",
      "saturatedFat": "4g (27%)",
      "cholesterol": "45mg (15%)",
      "protein": "13g (24%)"
    },
    "ingredients": "쌀(국산), 돼지불고기(국산 돼지고기 65%), 중화풍짜장소스, 불맛짬뽕비법양념, 당근채, 단무지, 계란구이, 조미김",
    "allergens": [
      "밀",
      "대두",
      "돼지고기",
      "쇠고기",
      "계란"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜이마트24 / 델리카에프에스",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 2일",
    "precautions": "전자레인지 30초 살짝 데워 드시면 중화 불맛이 극대화됩니다.",
    "storeStocks": [
      {
        "store": "이마트24",
        "status": "입고완료",
        "stockCount": 5,
        "price": 3500,
        "eventBadge": "흑백요리사 공식",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "박은영 셰프의 시그니처 중화 레시피를 담은 프리미엄 줄김밥! 불향 가득한 짬뽕 양념 불고기와 달콤한 짜장의 진수를 한 줄에 담아낸 중식 콜라보.",
    "bestQuotes": [
      "중국집 짬짜면을 김밥으로 압축해 놓은 듯한 풍미",
      "불고기에 불맛이 제대로 배어있어 너무 맛있음"
    ]
  },
  {
    "id": "cvs-emart24-003",
    "name": "아임e(옐로우) 자색고구마칩 110g",
    "brand": "이마트24",
    "category": "과자",
    "subCategory": "스낵/칩",
    "itemType": "packaged",
    "image": "https://msave.emart24.co.kr/cmsbo/upload/nHq/plu_image/500x500/9557062351638.JPG",
    "releaseDate": "이마트24 공식 단독 시그니처 PB",
    "price": 1700,
    "overallRating": 4.9,
    "ratingCount": 540,
    "searchInfluxCount": 39000,
    "stores": [
      "이마트24"
    ],
    "repurchasePercent": 95,
    "calories": 550,
    "volume": "110g",
    "isToday": false,
    "isHot": true,
    "isBest": true,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.9,
      "portion": 4.8,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 550,
      "sodium": "260mg (13%)",
      "carbs": "74g (23%)",
      "sugar": "19g (19%)",
      "fat": "26g (48%)",
      "transFat": "0g",
      "satFat": "12g (80%)",
      "saturatedFat": "12g (80%)",
      "cholesterol": "0mg (0%)",
      "protein": "4g (7%)"
    },
    "ingredients": "건조자색고구마플레이크(말레이시아산 35%), 식물성유지(팜유), 타피오카전분, 설탕, 정제염",
    "allergens": [
      "대두"
    ],
    "origin": "말레이시아 (OEM 수입원: ㈜이마트24)",
    "manufacturer": "MAMEE-DOUBLE DECKER / ㈜이마트24",
    "storageMethod": "실온 보관 (원형 캔 패키지)",
    "shelfLife": "제조일로부터 12개월",
    "precautions": "원통형 캐니스터 패키지로 바삭함이 오래 보존되며 뚜껑을 닫아 보관 가능합니다.",
    "storeStocks": [
      {
        "store": "이마트24",
        "status": "입고완료",
        "stockCount": 16,
        "price": 1700,
        "eventBadge": "이마트24 대표 1위",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "이마트24 부동의 스낵 1위 메가셀러! 천연 자색고구마의 은은한 단맛과 바삭한 식감이 일품인 프링글스 형태의 원통형 프리미엄 고구마칩.",
    "bestQuotes": [
      "뚜껑 열면 순식간에 반 통 이상 비우게 되는 악마의 스낵",
      "일반 감자칩보다 덜 짜고 고구마 단맛이 은은해서 존맛"
    ]
  },
  {
    "id": "cvs-emart24-004",
    "name": "아임e(옐로우) 바삭달콤 팝콘&러스크 220g",
    "brand": "이마트24",
    "category": "과자",
    "subCategory": "스낵/팝콘",
    "itemType": "packaged",
    "image": "https://msave.emart24.co.kr/cmsbo/upload/nHq/plu_image/500x500/6970378824116.JPG",
    "releaseDate": "이마트24 공식 단독 대용량 PB",
    "price": 3200,
    "overallRating": 4.8,
    "ratingCount": 280,
    "searchInfluxCount": 24000,
    "stores": [
      "이마트24"
    ],
    "repurchasePercent": 91,
    "calories": 1120,
    "volume": "220g",
    "isToday": false,
    "isHot": true,
    "isBest": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.9,
      "portion": 5,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 1120,
      "sodium": "820mg (41%)",
      "carbs": "154g (48%)",
      "sugar": "52g (52%)",
      "fat": "52g (96%)",
      "transFat": "0g",
      "satFat": "24g (160%)",
      "saturatedFat": "24g (160%)",
      "cholesterol": "8mg (3%)",
      "protein": "14g (25%)"
    },
    "ingredients": "옥수수(미국산), 식물성유지, 카라멜코팅시럽, 바게트러스크조각, 버터솔트시즈닝",
    "allergens": [
      "밀",
      "대두",
      "우유"
    ],
    "origin": "대한민국",
    "manufacturer": "제이앤이 / ㈜이마트24",
    "storageMethod": "실온 보관 (지퍼백 밀봉)",
    "shelfLife": "제조일로부터 6개월",
    "precautions": "팝콘과 바삭한 바게트 러스크가 함께 들어있어 다채로운 식감을 선사합니다.",
    "storeStocks": [
      {
        "store": "이마트24",
        "status": "입고완료",
        "stockCount": 8,
        "price": 3200,
        "eventBadge": "이마트24 대용량",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "고소한 팝콘과 바삭한 바게트 러스크를 한 봉지에 듬뿍! 카라멜 시럽 코팅으로 달콤 바삭함이 극대화된 이마트24 가성비 대용량 스낵.",
    "bestQuotes": [
      "팝콘 사이에 바삭한 러스크 씹히는 게 신의 한 수",
      "양도 엄청 많은데 3천원대라 가성비 갑"
    ]
  },
  {
    "id": "cvs-emart24-005",
    "name": "대박각 불맛짬뽕라면",
    "brand": "이마트24",
    "category": "간편식",
    "subCategory": "라면/용기면",
    "itemType": "packaged",
    "image": "https://msave.emart24.co.kr/cmsbo/upload/nHq/plu_image/500x500/8800354750239.JPG",
    "releaseDate": "이마트24 공식 단독 맛집 콜라보",
    "price": 1900,
    "overallRating": 4.8,
    "ratingCount": 310,
    "searchInfluxCount": 29000,
    "stores": [
      "이마트24"
    ],
    "repurchasePercent": 91,
    "calories": 510,
    "volume": "115g",
    "isToday": false,
    "isHot": true,
    "isBest": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.8,
      "portion": 4.7,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 510,
      "sodium": "1790mg (90%)",
      "carbs": "72g (22%)",
      "sugar": "6g (6%)",
      "fat": "20g (37%)",
      "transFat": "0g",
      "satFat": "9g (60%)",
      "saturatedFat": "9g (60%)",
      "cholesterol": "15mg (5%)",
      "protein": "11g (20%)"
    },
    "ingredients": "면: 소맥분(밀: 미국산, 호주산), 팜유, 감자전분. 스프: 대박각불맛짬뽕농축액, 오징어조미분말, 고춧가루, 사골엑기스, 건양배추, 건오징어후레이크",
    "allergens": [
      "밀",
      "대두",
      "오징어",
      "쇠고기",
      "돼지고기",
      "조개류"
    ],
    "origin": "대한민국",
    "manufacturer": "오뚜기 / ㈜이마트24",
    "storageMethod": "실온 보관 (건냉한 곳)",
    "shelfLife": "제조일로부터 6개월",
    "precautions": "끓는 물 붓고 4분 후 유성스프를 꼭 넣고 드셔야 불맛이 제대로 살아납니다.",
    "storeStocks": [
      {
        "store": "이마트24",
        "status": "입고완료",
        "stockCount": 10,
        "price": 1900,
        "eventBadge": "이마트24 단독",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "줄 서서 먹는 일산 짬뽕 핫플레이스 ‘대박각’의 비법을 그대로 컵라면에 담았다! 웍에서 갓 볶아낸 듯한 강렬한 직화 불맛과 진한 해물 육수의 조화.",
    "bestQuotes": [
      "편의점 짬뽕라면 중 불향이 제일 강력함",
      "국물이 묵직해서 해장으로 끝장남"
    ]
  },
  {
    "id": "cvs-emart24-006",
    "name": "대박각 고추짜장라면",
    "brand": "이마트24",
    "category": "간편식",
    "subCategory": "라면/용기면",
    "itemType": "packaged",
    "image": "https://msave.emart24.co.kr/cmsbo/upload/nHq/plu_image/500x500/8800354751595.JPG",
    "releaseDate": "이마트24 공식 단독 맛집 콜라보",
    "price": 1900,
    "overallRating": 4.8,
    "ratingCount": 290,
    "searchInfluxCount": 27000,
    "stores": [
      "이마트24"
    ],
    "repurchasePercent": 90,
    "calories": 540,
    "volume": "120g",
    "isToday": false,
    "isHot": true,
    "isBest": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.8,
      "portion": 4.8,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 540,
      "sodium": "1380mg (69%)",
      "carbs": "82g (25%)",
      "sugar": "10g (10%)",
      "fat": "19g (35%)",
      "transFat": "0g",
      "satFat": "8g (53%)",
      "saturatedFat": "8g (53%)",
      "cholesterol": "5mg (2%)",
      "protein": "11g (20%)"
    },
    "ingredients": "면: 소맥분, 팜유, 감자전분. 스프: 직화짜장액상스프(춘장 45%, 양파, 볶음돼지고기), 청양고추후레이크, 건양배추, 고추풍미유",
    "allergens": [
      "밀",
      "대두",
      "돼지고기",
      "쇠고기"
    ],
    "origin": "대한민국",
    "manufacturer": "오뚜기 / ㈜이마트24",
    "storageMethod": "실온 보관",
    "shelfLife": "제조일로부터 6개월",
    "precautions": "물을 버릴 때 2~3스푼 남겨둔 뒤 액상스프와 청양고추 후레이크를 비벼 드세요.",
    "storeStocks": [
      {
        "store": "이마트24",
        "status": "입고완료",
        "stockCount": 9,
        "price": 1900,
        "eventBadge": "이마트24 단독",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "고소하고 달콤한 직화 춘장 소스에 알싸하게 매운 청양고추의 깔끔한 타격감을 더해 느끼함을 완벽히 잡은 대박각 시그니처 짜장라면.",
    "bestQuotes": [
      "자칫 느끼할 수 있는 짜장을 청양고추가 확 잡아줌",
      "밥 비벼먹고 싶어지는 액상 짜장 소스"
    ]
  },
  {
    "id": "cvs-emart24-007",
    "name": "조선호텔 수제 떡갈비 345g",
    "brand": "이마트24",
    "category": "간편식",
    "subCategory": "안주/냉동",
    "itemType": "packaged",
    "image": "https://msave.emart24.co.kr/cmsbo/upload/nHq/plu_image/500x500/8809527651328.JPG",
    "releaseDate": "이마트24 공식 단독 프리미엄",
    "price": 9900,
    "overallRating": 4.9,
    "ratingCount": 260,
    "searchInfluxCount": 26000,
    "stores": [
      "이마트24"
    ],
    "repurchasePercent": 93,
    "calories": 780,
    "volume": "345g",
    "isToday": false,
    "isHot": true,
    "isBest": true,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.7,
      "portion": 4.8,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 780,
      "sodium": "1420mg (71%)",
      "carbs": "42g (13%)",
      "sugar": "18g (18%)",
      "fat": "48g (89%)",
      "transFat": "0.4g",
      "satFat": "16g (107%)",
      "saturatedFat": "16g (107%)",
      "cholesterol": "110mg (37%)",
      "protein": "45g (82%)"
    },
    "ingredients": "국산 돼지고기(갈비살 75%), 특제간장소스, 배퓨레, 양파, 마늘, 대파, 참기름, 정제소금, 후춧가루",
    "allergens": [
      "돼지고기",
      "대두",
      "밀"
    ],
    "origin": "대한민국",
    "manufacturer": "신세계푸드 / ㈜이마트24",
    "storageMethod": "-18℃ 이하 냉동 보관",
    "shelfLife": "제조일로부터 9개월",
    "precautions": "프라이팬에 기름을 살짝 두르고 약불에서 4~5분 노릇하게 굽거나 에어프라이어 180도 8분 조리하세요.",
    "storeStocks": [
      {
        "store": "이마트24",
        "status": "입고완료",
        "stockCount": 4,
        "price": 9900,
        "eventBadge": "조선호텔 프리미엄",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "신세계 조선호텔앤리조트 셰프의 특급 레시피! 굵게 다져 식감이 살아있는 국산 돼지갈비살을 배퓨레와 특제 간장에 재워 육즙이 팡팡 터지는 프리미엄 떡갈비.",
    "bestQuotes": [
      "시판 냉동 떡갈비랑은 고기 결 자체가 다름",
      "호텔 셰프 레시피답게 고급스럽고 육즙 가득"
    ]
  },
  {
    "id": "cvs-emart24-008",
    "name": "성수310 화이트브레드 우롱밀크티 크림빵 120g",
    "brand": "이마트24",
    "category": "빵·디저트",
    "subCategory": "생크림빵/디저트",
    "itemType": "packaged",
    "image": "https://msave.emart24.co.kr/cmsbo/upload/nHq/plu_image/500x500/8800348943630.JPG",
    "releaseDate": "이마트24 공식 단독 프리미엄 베이커리",
    "price": 3300,
    "overallRating": 4.8,
    "ratingCount": 280,
    "searchInfluxCount": 25000,
    "stores": [
      "이마트24"
    ],
    "repurchasePercent": 91,
    "calories": 388,
    "volume": "120g",
    "isToday": false,
    "isHot": true,
    "isBest": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.7,
      "portion": 4.8,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 388,
      "sodium": "240mg (12%)",
      "carbs": "46g (14%)",
      "sugar": "16g (16%)",
      "fat": "20g (37%)",
      "transFat": "0.3g",
      "satFat": "12g (80%)",
      "saturatedFat": "12g (80%)",
      "cholesterol": "40mg (13%)",
      "protein": "6g (11%)"
    },
    "ingredients": "우롱밀크티크림(우롱차추출분말 5%, 가공유크림), 밀가루(밀: 미국산), 백설탕, 마가린, 효모, 정제소금",
    "allergens": [
      "밀",
      "우유",
      "대두",
      "계란"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜푸드코아 / ㈜이마트24",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 4일",
    "precautions": "성수동 감성의 하얀 빵피(화이트브레드)로 쫀득함이 살아있습니다.",
    "storeStocks": [
      {
        "store": "이마트24",
        "status": "입고완료",
        "stockCount": 5,
        "price": 3300,
        "eventBadge": "성수310 단독",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "트렌디한 성수동 베이커리 감성을 담은 ‘성수310’ 브랜드! 하얗고 쫀득한 화이트 빵 속에 깊고 향긋한 우롱밀크티 생크림을 듬뿍 채운 프리미엄 디저트.",
    "bestQuotes": [
      "우롱차 특유의 그윽한 향이 크림에 완벽하게 녹아듦",
      "빵 피가 모찌처럼 쫀득해서 식감이 독보적"
    ]
  },
  {
    "id": "cvs-emart24-009",
    "name": "성수310 피스타치오 초코칩 크루아상 65g",
    "brand": "이마트24",
    "category": "빵·디저트",
    "subCategory": "베이커리/크루아상",
    "itemType": "packaged",
    "image": "https://msave.emart24.co.kr/cmsbo/upload/nHq/plu_image/500x500/8800348943531.JPG",
    "releaseDate": "이마트24 공식 단독 프리미엄 베이커리",
    "price": 3200,
    "overallRating": 4.8,
    "ratingCount": 270,
    "searchInfluxCount": 23000,
    "stores": [
      "이마트24"
    ],
    "repurchasePercent": 90,
    "calories": 295,
    "volume": "65g",
    "isToday": false,
    "isHot": true,
    "isBest": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.6,
      "portion": 4.7,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 295,
      "sodium": "190mg (10%)",
      "carbs": "32g (10%)",
      "sugar": "11g (11%)",
      "fat": "16g (30%)",
      "transFat": "0.2g",
      "satFat": "9g (60%)",
      "saturatedFat": "9g (60%)",
      "cholesterol": "35mg (12%)",
      "protein": "5g (9%)"
    },
    "ingredients": "크루아상생지(밀가루, 버터, 효모), 피스타치오크림, 초코칩, 분당",
    "allergens": [
      "밀",
      "우유",
      "대두",
      "계란",
      "견과류(피스타치오)"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜푸드코아 / ㈜이마트24",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 4일",
    "precautions": "초코칩과 피스타치오 토핑이 크루아상 겹겹의 결 사이에 어우러져 있습니다.",
    "storeStocks": [
      {
        "store": "이마트24",
        "status": "입고완료",
        "stockCount": 4,
        "price": 3200,
        "eventBadge": "성수310 단독",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "프랑스 전통 방식으로 결을 살린 고소한 버터 크루아상 위에 고소한 피스타치오 크림과 달콤한 초코칩을 듬뿍 얹은 성수동 감성 냉장 베이커리.",
    "bestQuotes": [
      "버터 풍미 가득한 크루아상에 피스타치오 조합이라니",
      "편의점 빵 퀄리티를 뛰어넘은 베이커리급"
    ]
  }
];
