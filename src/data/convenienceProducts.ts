import { Product } from '../types';

/**
 * 대한민국 편의점 4사(CU, GS25, 세븐일레븐, 이마트24) 공식 홈페이지 전용 상품 데이터베이스
 * - CU: https://cu.bgfretail.com/product/product.do?category=product&depth2=4&sf=N 공식 직영 상품 100% 매칭
 * - GS25, 세븐일레븐, 이마트24 공식 직영 CDN 정품 패키지 이미지 매칭
 * - 식품의약품안전처 영양성분DB 및 편의점 공식 상세 규격 일치
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
    "id": "cvs-cu-004",
    "name": "뉴 백종원 스페셜 한판 도시락",
    "brand": "CU",
    "category": "간편식",
    "subCategory": "도시락",
    "itemType": "packaged",
    "image": "https://tqklhszfkvzk6518638.edge.naverncp.com/product/8800279678335.png",
    "releaseDate": "CU 공식 홈페이지 등록 상품",
    "price": 5200,
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
    "ingredients": "쌀(국산 신동진미), 간장불고기(돼지고기 국산), 계란말이, 치킨너겟, 볶음김치, 햄소시지, 분홍소시지, 시금치나물, 간장, 고추장양념",
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
        "price": 5200,
        "eventBadge": "CU 공식 베스트",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "간장불고기와 계란말이 등 11가지 반찬으로 푸짐하게 구성한 CU 공식 가성비 대표 한판 도시락.",
    "bestQuotes": [
      "고기 반찬과 다채로운 11찬으로 든든한 한 끼",
      "편의점 도시락 중 가성비와 맛 모두 최고"
    ]
  },
  {
    "id": "cvs-cu-005",
    "name": "백종원 뉴 고기 3배 한판 도시락",
    "brand": "CU",
    "category": "간편식",
    "subCategory": "도시락",
    "itemType": "packaged",
    "image": "https://tqklhszfkvzk6518638.edge.naverncp.com/product/8800279678687.png",
    "releaseDate": "CU 공식 홈페이지 등록 상품",
    "price": 5500,
    "overallRating": 4.8,
    "ratingCount": 380,
    "searchInfluxCount": 31000,
    "stores": [
      "CU"
    ],
    "repurchasePercent": 92,
    "calories": 820,
    "volume": "460g",
    "isToday": false,
    "isHot": true,
    "isBest": true,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.8,
      "portion": 5,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 820,
      "sodium": "1340mg (67%)",
      "carbs": "102g (31%)",
      "sugar": "14g (14%)",
      "fat": "34g (63%)",
      "transFat": "0.3g",
      "satFat": "9g (60%)",
      "saturatedFat": "9g (60%)",
      "cholesterol": "95mg (32%)",
      "protein": "28g (51%)"
    },
    "ingredients": "쌀(국산), 한돈간장제육(국산 돼지고기), 한돈고추장제육, 소불고기(쇠고기), 계란말이, 어묵볶음, 볶음김치",
    "allergens": [
      "밀",
      "대두",
      "돼지고기",
      "쇠고기",
      "계란"
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
        "eventBadge": "고기 3배",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "한돈 냉장육으로 만든 간장/고추장제육과 소불고기까지 고기 3가지가 듬뿍 들어간 푸짐한 CU 공식 도시락.",
    "bestQuotes": [
      "고기가 끝도 없이 나오는 역대급 푸짐함",
      "육식파라면 무조건 만족할 도시락"
    ]
  },
  {
    "id": "cvs-cu-006",
    "name": "급식대가 뉴정석 도시락",
    "brand": "CU",
    "category": "간편식",
    "subCategory": "도시락",
    "itemType": "packaged",
    "image": "https://tqklhszfkvzk6518638.edge.naverncp.com/product/8801771034643.png",
    "releaseDate": "CU 공식 홈페이지 등록 상품",
    "price": 5700,
    "overallRating": 4.9,
    "ratingCount": 430,
    "searchInfluxCount": 48000,
    "stores": [
      "CU"
    ],
    "repurchasePercent": 95,
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
    "ingredients": "쌀(국산), 매콤닭볶음, 돼지고기간장불고기, 깻잎계란말이, 미역줄기볶음, 볶음김치, 멸치볶음, 고추장양념장",
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
        "price": 5700,
        "eventBadge": "CU 공식 단독",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "급식대가 조리사 이미영님의 따뜻한 마음으로 만들어 두 가지 맛의 제육볶음과 깻잎계란말이, 다양한 정갈한 반찬을 담은 정석 도시락.",
    "bestQuotes": [
      "학창시절 맛있던 급식의 최고급 업그레이드 버전",
      "간이 짜지 않고 정갈해서 매일 먹어도 안 질릴 맛"
    ]
  },
  {
    "id": "cvs-cu-007",
    "name": "리얼모짜 치즈돈까스 도시락",
    "brand": "CU",
    "category": "간편식",
    "subCategory": "도시락",
    "itemType": "packaged",
    "image": "https://tqklhszfkvzk6518638.edge.naverncp.com/product/8809655892303_1.png",
    "releaseDate": "CU 공식 홈페이지 등록 상품",
    "price": 7900,
    "overallRating": 4.8,
    "ratingCount": 310,
    "searchInfluxCount": 29000,
    "stores": [
      "CU"
    ],
    "repurchasePercent": 91,
    "calories": 890,
    "volume": "480g",
    "isToday": false,
    "isHot": true,
    "isBest": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.6,
      "portion": 4.8,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 890,
      "sodium": "1420mg (71%)",
      "carbs": "105g (32%)",
      "sugar": "15g (15%)",
      "fat": "38g (70%)",
      "transFat": "0.4g",
      "satFat": "14g (93%)",
      "saturatedFat": "14g (93%)",
      "cholesterol": "90mg (30%)",
      "protein": "32g (58%)"
    },
    "ingredients": "쌀(국산), 통모짜렐라치즈돈까스(돼지등심 국산 50%, 자연모짜렐라치즈 35%), 특제돈까스소스, 양배추샐러드, 피클, 볶음김치",
    "allergens": [
      "밀",
      "대두",
      "돼지고기",
      "우유",
      "계란",
      "토마토"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜비지에프푸드 / BGF리테일",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 2일",
    "precautions": "전자레인지 1000W 2분 조리 시 치즈가 쭈욱 늘어납니다.",
    "storeStocks": [
      {
        "store": "CU",
        "status": "입고완료",
        "stockCount": 3,
        "price": 7900,
        "eventBadge": "CU 프리미엄",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "자연산 모짜렐라 치즈가 듬뿍 들어가 전자레인지 조리 시 쭈욱 늘어나는 치즈 폭탄 리얼모짜치즈돈까스 도시락.",
    "bestQuotes": [
      "치즈가 진짜 전문 돈까스집 수준으로 늘어남",
      "돈까스 두께감과 치즈 퀄리티 대박"
    ]
  },
  {
    "id": "cvs-cu-008",
    "name": "오리지널 닭가슴살 샐러드",
    "brand": "CU",
    "category": "간편식",
    "subCategory": "샐러드",
    "itemType": "packaged",
    "image": "https://tqklhszfkvzk6518638.edge.naverncp.com/product/8809148599009.jpg",
    "releaseDate": "CU 공식 홈페이지 등록 상품",
    "price": 4800,
    "overallRating": 4.8,
    "ratingCount": 340,
    "searchInfluxCount": 28000,
    "stores": [
      "CU"
    ],
    "repurchasePercent": 93,
    "calories": 185,
    "volume": "210g",
    "isToday": false,
    "isHot": true,
    "isBest": true,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.8,
      "portion": 4.8,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 185,
      "sodium": "460mg (23%)",
      "carbs": "12g (4%)",
      "sugar": "5g (5%)",
      "fat": "4.2g (8%)",
      "transFat": "0g",
      "satFat": "0.8g (5%)",
      "saturatedFat": "0.8g (5%)",
      "cholesterol": "45mg (15%)",
      "protein": "22g (40%)"
    },
    "ingredients": "닭가슴살(국산 100%), 양상추, 로메인, 치커리, 방울토마토, 블랙올리브, 오리엔탈드레싱(간장, 발사믹식초, 올리브유)",
    "allergens": [
      "닭고기",
      "대두",
      "밀"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜그린푸드 / BGF리테일",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 3일",
    "precautions": "드레싱 용기를 꺼내어 야채 위에 골고루 뿌려 드세요.",
    "storeStocks": [
      {
        "store": "CU",
        "status": "입고완료",
        "stockCount": 6,
        "price": 4800,
        "eventBadge": "CU 단백질 1위",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "기존의 퍽퍽한 닭가슴살이 아닌 결대로 부드럽게 찢은 국내산 닭가슴살에 신선한 특수채소와 오리엔탈 드레싱을 곁들인 헬시 플레저 대표 샐러드.",
    "bestQuotes": [
      "닭가슴살이 퍽퍽하지 않고 결대로 찢어져서 먹기 편함",
      "다이어트할 때 쟁여두고 먹는 필수템"
    ]
  },
  {
    "id": "cvs-cu-009",
    "name": "주먹왕 뉴 참치마요 주먹밥",
    "brand": "CU",
    "category": "간편식",
    "subCategory": "주먹밥",
    "itemType": "packaged",
    "image": "https://tqklhszfkvzk6518638.edge.naverncp.com/product/8809453268157.png",
    "releaseDate": "CU 공식 홈페이지 등록 상품",
    "price": 2200,
    "overallRating": 4.8,
    "ratingCount": 390,
    "searchInfluxCount": 33000,
    "stores": [
      "CU"
    ],
    "repurchasePercent": 94,
    "calories": 345,
    "volume": "180g",
    "isToday": false,
    "isHot": true,
    "isBest": true,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.9,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 345,
      "sodium": "620mg (31%)",
      "carbs": "54g (17%)",
      "sugar": "3g (3%)",
      "fat": "11g (20%)",
      "transFat": "0g",
      "satFat": "2.5g (17%)",
      "saturatedFat": "2.5g (17%)",
      "cholesterol": "30mg (10%)",
      "protein": "9g (16%)"
    },
    "ingredients": "쌀(국산), 참치마요토핑(다랑어 60%, 마요네즈, 양파, 흑후추), 조미김가루, 참기름, 통깨",
    "allergens": [
      "대두",
      "계란",
      "쇠고기"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜비지에프푸드 / BGF리테일",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 2일",
    "precautions": "전자레인지 1000W 30초, 700W 40초 조리",
    "storeStocks": [
      {
        "store": "CU",
        "status": "입고완료",
        "stockCount": 8,
        "price": 2200,
        "eventBadge": "CU 가성비 1위",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "고소한 참치마요 토핑을 밥 속에 듬뿍 채우고 겉면에는 짭조름한 김가루를 듬뿍 묻힌 CU 대표 대용량 주먹볼.",
    "bestQuotes": [
      "삼각김밥 2개 먹는 것보다 훨씬 푸짐하고 참치도 가득",
      "라면이랑 같이 먹으면 꿀조합"
    ]
  },
  {
    "id": "cvs-cu-010",
    "name": "압도적 불고기김밥",
    "brand": "CU",
    "category": "간편식",
    "subCategory": "김밥",
    "itemType": "packaged",
    "image": "https://tqklhszfkvzk6518638.edge.naverncp.com/product/8801771031567.png",
    "releaseDate": "CU 공식 홈페이지 등록 상품",
    "price": 3400,
    "overallRating": 4.8,
    "ratingCount": 350,
    "searchInfluxCount": 29000,
    "stores": [
      "CU"
    ],
    "repurchasePercent": 92,
    "calories": 420,
    "volume": "255g",
    "isToday": false,
    "isHot": true,
    "isBest": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.8,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 420,
      "sodium": "890mg (45%)",
      "carbs": "64g (20%)",
      "sugar": "7g (7%)",
      "fat": "12g (22%)",
      "transFat": "0.1g",
      "satFat": "3.8g (25%)",
      "saturatedFat": "3.8g (25%)",
      "cholesterol": "45mg (15%)",
      "protein": "14g (25%)"
    },
    "ingredients": "쌀(국산), 불고기토핑(국산 돼지고기 70%, 특제간장소스), 계란지단, 단무지, 당근채, 시금치, 조미김, 참기름",
    "allergens": [
      "밀",
      "대두",
      "돼지고기",
      "쇠고기",
      "계란"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜비지에프푸드 / BGF리테일",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 2일",
    "precautions": "전자레인지 30초 조리 권장",
    "storeStocks": [
      {
        "store": "CU",
        "status": "입고완료",
        "stockCount": 6,
        "price": 3400,
        "eventBadge": "압도적 시리즈",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "기존 대비 불고기 토핑을 무려 20% UP! 밥보다 토핑이 꽉 찬 압도적 중량의 프리미엄 불고기 줄김밥.",
    "bestQuotes": [
      "고기 양이 확실히 많아서 씹는 맛이 제대로",
      "간장 불고기 양념이 밥이랑 찰떡"
    ]
  },
  {
    "id": "cvs-cu-011",
    "name": "3단 맥스 숯불갈릭 버거",
    "brand": "CU",
    "category": "간편식",
    "subCategory": "햄버거",
    "itemType": "packaged",
    "image": "https://tqklhszfkvzk6518638.edge.naverncp.com/product/8801068933697.jpg",
    "releaseDate": "CU 공식 홈페이지 등록 상품",
    "price": 3600,
    "overallRating": 4.8,
    "ratingCount": 310,
    "searchInfluxCount": 26000,
    "stores": [
      "CU"
    ],
    "repurchasePercent": 91,
    "calories": 590,
    "volume": "230g",
    "isToday": false,
    "isHot": true,
    "isBest": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.8,
      "portion": 5,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 590,
      "sodium": "1150mg (58%)",
      "carbs": "62g (19%)",
      "sugar": "11g (11%)",
      "fat": "28g (52%)",
      "transFat": "0.3g",
      "satFat": "9g (60%)",
      "saturatedFat": "9g (60%)",
      "cholesterol": "65mg (22%)",
      "protein": "22g (40%)"
    },
    "ingredients": "참깨번(밀가루), 직화불고기패티 3장(돼지고기, 닭고기), 숯불갈릭소스, 체다슬라이스치즈, 피클, 양파",
    "allergens": [
      "밀",
      "대두",
      "돼지고기",
      "닭고기",
      "쇠고기",
      "우유"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜SPC삼립 / BGF리테일",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 3일",
    "precautions": "전자레인지 1000W 30초, 700W 40초 조리",
    "storeStocks": [
      {
        "store": "CU",
        "status": "입고완료",
        "stockCount": 5,
        "price": 3600,
        "eventBadge": "패티 3장",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "4.5인치 BIG 참깨번에 직화 불고기 패티 3장을 꽉 채우고 숯불향 가득한 특제 갈릭소스를 듬뿍 얹은 든든한 3단 맥스 버거.",
    "bestQuotes": [
      "패티가 3장이라 한 입 베어물면 육즙 폭발",
      "마늘 소스 향이 너무 좋아서 계속 생각남"
    ]
  },
  {
    "id": "cvs-cu-012",
    "name": "파마산 치킨햄 샌드위치",
    "brand": "CU",
    "category": "간편식",
    "subCategory": "샌드위치",
    "itemType": "packaged",
    "image": "https://tqklhszfkvzk6518638.edge.naverncp.com/product/8801068927498.jpg",
    "releaseDate": "CU 공식 홈페이지 등록 상품",
    "price": 3000,
    "overallRating": 4.8,
    "ratingCount": 300,
    "searchInfluxCount": 24000,
    "stores": [
      "CU"
    ],
    "repurchasePercent": 91,
    "calories": 380,
    "volume": "165g",
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
      "calories": 380,
      "sodium": "790mg (40%)",
      "carbs": "42g (13%)",
      "sugar": "7g (7%)",
      "fat": "17g (31%)",
      "transFat": "0.1g",
      "satFat": "5g (33%)",
      "saturatedFat": "5g (33%)",
      "cholesterol": "40mg (13%)",
      "protein": "15g (27%)"
    },
    "ingredients": "식빵, 케이준치킨샐러드(닭가슴살 45%, 케이준마요드레싱), 파마산치즈, 슬라이스햄, 양상추, 토마토",
    "allergens": [
      "밀",
      "대두",
      "닭고기",
      "돼지고기",
      "우유",
      "계란"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜SPC삼립 / BGF리테일",
    "storageMethod": "0~10℃ 냉장 보관",
    "shelfLife": "제조일로부터 3일",
    "precautions": "개봉 후 신선할 때 바로 드세요.",
    "storeStocks": [
      {
        "store": "CU",
        "status": "입고완료",
        "stockCount": 6,
        "price": 3000,
        "eventBadge": "인기 샌드위치",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "촉촉하고 부드러운 화이트 식빵에 매콤 달달한 케이준 치킨 샐러드와 고소한 파마산 치즈, 슬라이스 햄을 듬뿍 넣은 풍성한 샌드위치.",
    "bestQuotes": [
      "치킨 샐러드 소스가 매콤달콤해서 느끼하지 않음",
      "아침 식사 대용으로 부담 없이 딱 좋음"
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
    "ingredients": "면(소맥분, 팜유, 감자전분, 정제염), 분말스프, 건더기스프",
    "allergens": [
      "밀",
      "대두",
      "쇠고기"
    ],
    "origin": "대한민국",
    "manufacturer": "㈜팔도 / GS리테일",
    "storageMethod": "실온 보관 (직사광선 피함)",
    "shelfLife": "제조일로부터 6개월",
    "precautions": "끓는 물 2.2L 필요. 캠핑, 파티용으로 추천합니다.",
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
    "description": "기존 도시락 라면 대비 용량 8.5배! 점보 시리즈 신화를 쓴 초대형 파티용 컵라면.",
    "bestQuotes": [
      "친구들이랑 파티할 때 이거 하나 끓이면 분위기 종결"
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
    "ingredients": "공화춘 자장소스, 틈새라면 매운양념스프, 면 8개입",
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
    "precautions": "자장소스와 짬뽕스프를 취향에 맞춰 섞어 드세요.",
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
    "description": "GS25 대표 PB 공화춘 자장과 틈새라면을 하나로 섞은 초대형 8인분 쟁반짬짜면.",
    "bestQuotes": [
      "자장과 짬뽕소스 비율이 완벽함"
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
    "ingredients": "쌀(국산), 제육볶음(돼지고기 국산), 계란후라이, 떡갈비, 어묵볶음, 볶음김치, 참기름",
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
    "precautions": "별첨 참기름을 밥 위에 뿌려 드세요.",
    "storeStocks": [
      {
        "store": "GS25",
        "status": "입고완료",
        "stockCount": 6,
        "price": 4500,
        "eventBadge": "GS25 대표",
        "deliveryTime": "매장 즉시 픽업"
      }
    ],
    "description": "‘혜자롭다’는 신조어를 탄생시킨 국민 도시락! 푸짐한 제육볶음과 계란후라이, 참기름의 조화.",
    "bestQuotes": [
      "밥 위에 계란후라이 올라간 것부터 감동"
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
    "ingredients": "우유(국산 100%), 식물성유크림, 유크림(국산), 밀가루, 백설탕",
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
    "precautions": "국산 1등급 원유를 사용하여 부드러운 우유 풍미를 자랑합니다.",
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
    "description": "물 대신 국산 100% 원유로 반죽하여 쫄깃하고 부드러운 빵피와 순수 우유 생크림이 가득 찬 빵.",
    "bestQuotes": [
      "우유의 고소한 맛이 깔끔하게 남음"
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
    "ingredients": "옥수수, 팜올레인유, 캐러멜시럽, 버터솔트시즈닝",
    "allergens": [
      "대두",
      "우유"
    ],
    "origin": "대한민국",
    "manufacturer": "제이앤이 / GS리테일",
    "storageMethod": "실온 보관 (지퍼백 밀봉)",
    "shelfLife": "제조일로부터 6개월",
    "precautions": "지퍼백 패키지가 적용되어 바삭함이 오래 유지됩니다.",
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
    "description": "넷플릭스 공식 콜라보 대용량 팝콘! 달콤 캐러멜 팝콘과 짭짤 버터 솔트 팝콘의 완벽한 믹스.",
    "bestQuotes": [
      "영화 정주행할 때 필수품"
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
    "ingredients": "쌀(국산), 양념소고기볶음, 가을무생채, 콩나물, 당근채, 표고버섯, 애호박볶음, 계란지단, 비법간장양념장, 들기름",
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
    "precautions": "비법 간장 양념장과 들기름을 넣어 비벼 드세요.",
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
    "description": "성시경의 레시피를 담은 ‘시경픽’! 달큰한 제철 가을무 생채와 불향 소고기, 감칠맛 맛간장의 조화.",
    "bestQuotes": [
      "간장 양념이 고추장보다 훨씬 깔끔하고 감칠맛 남"
    ]
  },
  {
    "id": "cvs-seven-002",
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
    "ingredients": "쌀(국산), 짜장소스, 체다슬라이스치즈, 두툼에그말이지단, 단무지, 조미김",
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
    "precautions": "전자레인지 30초 데워 드시면 더욱 맛있습니다.",
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
    "description": "‘짜장+계란+치즈’ 꿀조합을 한 줄에 구현한 세븐일레븐 인기 김밥.",
    "bestQuotes": [
      "짜계치 그 맛 그대로 김밥에 꽉 차 있음"
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
    "ingredients": "쌀(국산), 오리고기볶음(훈제오리 60%, 사천식두반장양념), 조미김, 정제염",
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
    "precautions": "전자레인지 1000W 20초 조리",
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
    "description": "흑백요리사 중식 셰프 박은영과의 공식 단독 협업! 훈제 오리고기에 매콤 알싸한 특제 사천식 마라 두반장 소스를 버무린 삼각김밥.",
    "bestQuotes": [
      "오리고기 식감과 사천식 매콤함이 대박"
    ]
  },
  {
    "id": "cvs-emart24-002",
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
    "ingredients": "건조자색고구마플레이크(35%), 식물성유지, 타피오카전분, 설탕",
    "allergens": [
      "대두"
    ],
    "origin": "말레이시아",
    "manufacturer": "MAMEE / ㈜이마트24",
    "storageMethod": "실온 보관",
    "shelfLife": "제조일로부터 12개월",
    "precautions": "개봉 후 뚜껑을 닫아 보관하세요.",
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
    "description": "이마트24 부동의 스낵 1위! 천연 자색고구마의 은은한 단맛과 바삭한 식감이 일품인 원통형 스낵.",
    "bestQuotes": [
      "뚜껑 열면 순식간에 다 먹게 되는 악마의 스낵"
    ]
  },
  {
    "id": "cvs-emart24-003",
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
    "ingredients": "면: 소맥분, 팜유, 감자전분. 스프: 불맛짬뽕농축액, 오징어조미분말, 고춧가루",
    "allergens": [
      "밀",
      "대두",
      "오징어",
      "쇠고기",
      "돼지고기"
    ],
    "origin": "대한민국",
    "manufacturer": "오뚜기 / ㈜이마트24",
    "storageMethod": "실온 보관",
    "shelfLife": "제조일로부터 6개월",
    "precautions": "조리 마지막에 유성스프를 넣고 저어 드세요.",
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
    "description": "줄 서서 먹는 맛집 대박각과의 공식 단독 협업! 강렬한 직화 불맛과 진한 해물 육수 라면.",
    "bestQuotes": [
      "편의점 짬뽕라면 중 불향이 제일 강력함"
    ]
  }
];
