import { Product } from '../types';

/**
 * 뚜레쥬르(Tous Les Jours) 공식 빵 라인업
 * 공식 웹사이트(https://www.tlj.co.kr:7008/product/list.asp?ref=2) 실시간 데이터
 * - 식빵, 건강빵, 간식빵, 파이/패스트리, 도넛/고로케 전 품목 수록
 */
export const TLJ_PRODUCTS: Product[] = [
  {
    "id": "tlj-bread-5467",
    "name": "뚜레쥬르 데일리 우유식빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-3-31_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4200,
    "overallRating": 4.6,
    "ratingCount": 80,
    "searchInfluxCount": 28000,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 85,
    "calories": 290,
    "volume": "400g",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.7,
      "value": 4.9,
      "portion": 4.6,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 290,
      "sodium": "550mg (28%)",
      "sugar": "9g (9%)",
      "protein": "8g (15%)",
      "satFat": "4.0g (27%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 데일리 우유식빵 고유 배합",
    "allergens": [
      "밀",
      "우유"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 6,
        "price": 4200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5467"
      }
    ],
    "description": "더 부드럽고 더 촉촉해진 신선한 우유맛 가득한 식빵",
    "bestQuotes": [
      "토스트기에 살짝 구우면 겉은 바삭하고 속은 촉촉해서 아침 식사로 최고입니다.",
      "빵결이 정말 부드럽고 잼이나 버터 없이 뜯어먹어도 고소해요."
    ]
  },
  {
    "id": "tlj-bread-5469",
    "name": "뚜레쥬르 그대로 구워먹는 꿀 토스트 식빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-3-31_event(8).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4200,
    "overallRating": 4.9,
    "ratingCount": 342,
    "searchInfluxCount": 27749,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 310,
    "volume": "400g",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.5,
      "portion": 4.6,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 310,
      "sodium": "410mg (21%)",
      "sugar": "9g (9%)",
      "protein": "8g (15%)",
      "satFat": "3.8g (25%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 그대로 구워먹는 꿀 토스트 식빵 고유 배합",
    "allergens": [
      "밀",
      "우유",
      "대두",
      "계란"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 7,
        "price": 4200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5469"
      }
    ],
    "description": "꿀분말과 펄슈가를 넣어 은은한 단맛과 고소한 버터 풍미로 토스트 하였을 때 가장 맛있는 식빵",
    "bestQuotes": [
      "토스트기에 살짝 구우면 겉은 바삭하고 속은 촉촉해서 아침 식사로 최고입니다.",
      "빵결이 정말 부드럽고 잼이나 버터 없이 뜯어먹어도 고소해요."
    ]
  },
  {
    "id": "tlj-bread-5471",
    "name": "뚜레쥬르 고단백 현미식빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-3-31_event(14).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4200,
    "overallRating": 4.9,
    "ratingCount": 476,
    "searchInfluxCount": 27004,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 85,
    "calories": 290,
    "volume": "260g",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.4,
      "portion": 4.5,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 290,
      "sodium": "470mg (24%)",
      "sugar": "6g (6%)",
      "protein": "11g (20%)",
      "satFat": "3.2g (21%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 고단백 현미식빵 고유 배합",
    "allergens": [
      "밀",
      "우유",
      "호두",
      "계란"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 8,
        "price": 4200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5471"
      }
    ],
    "description": "탕종법을 사용해 촉촉하고 쫄깃한 식감을 살리고, 현미와 호두, 아몬드, 호박씨, 해바라기씨 등 다양한 견과류를 더해 고소하게 즐기기 좋은 고단백 식빵",
    "bestQuotes": [
      "토스트기에 살짝 구우면 겉은 바삭하고 속은 촉촉해서 아침 식사로 최고입니다.",
      "빵결이 정말 부드럽고 잼이나 버터 없이 뜯어먹어도 고소해요."
    ]
  },
  {
    "id": "tlj-bread-5470",
    "name": "뚜레쥬르 고식이섬유&저당 곡물식빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-3-31_event(11).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4200,
    "overallRating": 4.6,
    "ratingCount": 414,
    "searchInfluxCount": 25778,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 275,
    "volume": "400g",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.9,
      "portion": 4.7,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 275,
      "sodium": "460mg (23%)",
      "sugar": "2g (2%)",
      "protein": "9g (16%)",
      "satFat": "3g (20%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 고식이섬유&저당 곡물식빵 고유 배합",
    "allergens": [
      "밀",
      "우유"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 9,
        "price": 4200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5470"
      }
    ],
    "description": "식이섬유가 풍부한 고대곡물 호라산밀과 밀기울로 만들어 더 건강하고, 더 고소하게! 샌드위치로도 활용하기 좋은 데일리 건강 식빵",
    "bestQuotes": [
      "토스트기에 살짝 구우면 겉은 바삭하고 속은 촉촉해서 아침 식사로 최고입니다.",
      "빵결이 정말 부드럽고 잼이나 버터 없이 뜯어먹어도 고소해요."
    ]
  },
  {
    "id": "tlj-bread-5098",
    "name": "뚜레쥬르 2배 더 진한 우유 식빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2025-9-24_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4200,
    "overallRating": 4.4,
    "ratingCount": 188,
    "searchInfluxCount": 24096,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 85,
    "calories": 1285,
    "volume": "439g",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.6,
      "portion": 4.5,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 1285,
      "sodium": "1910mg (96%)",
      "sugar": "41g (41%)",
      "protein": "37g (67%)",
      "satFat": "15g (100%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 2배 더 진한 우유 식빵 고유 배합",
    "allergens": [
      "우유",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 10,
        "price": 4200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5098"
      }
    ],
    "description": "2배 더 진해진 우유 함량과 순우유 탕종으로 보들보들한 빵결 속에 진한 우유의 고소한 풍미를 가득 담은 우유 식빵",
    "bestQuotes": [
      "토스트기에 살짝 구우면 겉은 바삭하고 속은 촉촉해서 아침 식사로 최고입니다.",
      "빵결이 정말 부드럽고 잼이나 버터 없이 뜯어먹어도 고소해요."
    ]
  },
  {
    "id": "tlj-bread-5099",
    "name": "뚜레쥬르 2배 더 진한 우유 식빵(Half)",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2024-8-8_event(3).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3500,
    "overallRating": 4.3,
    "ratingCount": 251,
    "searchInfluxCount": 21992,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 640,
    "volume": "219g",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.3,
      "portion": 4.7,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 640,
      "sodium": "950mg (48%)",
      "sugar": "21g (21%)",
      "protein": "19g (35%)",
      "satFat": "8g (53%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 2배 더 진한 우유 식빵(Half) 고유 배합",
    "allergens": [
      "우유",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 11,
        "price": 3500,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5099"
      }
    ],
    "description": "2배 더 진해진 우유 함량과 순우유 탕종으로 보들보들한 빵결 속에 진한 우유의 고소한 풍미를 가득 담은 우유 식빵",
    "bestQuotes": [
      "토스트기에 살짝 구우면 겉은 바삭하고 속은 촉촉해서 아침 식사로 최고입니다.",
      "빵결이 정말 부드럽고 잼이나 버터 없이 뜯어먹어도 고소해요."
    ]
  },
  {
    "id": "tlj-bread-4436",
    "name": "뚜레쥬르 촉촉 쫄깃 탕종식빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2021-4-23_event(14).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4200,
    "overallRating": 4.5,
    "ratingCount": 446,
    "searchInfluxCount": 19507,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 85,
    "calories": 1270,
    "volume": "470g",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.9,
      "portion": 4.4,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 1270,
      "sodium": "2060mg (103%)",
      "sugar": "29g (29%)",
      "protein": "39g (71%)",
      "satFat": "8g (53%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 촉촉 쫄깃 탕종식빵 고유 배합",
    "allergens": [
      "밀",
      "우유"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 12,
        "price": 4200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4436"
      }
    ],
    "description": "탕종을 넣어 더욱 촉촉하고 쫄깃한 식감과 은은한 단맛이 어우러지는 담백 식빵",
    "bestQuotes": [
      "토스트기에 살짝 구우면 겉은 바삭하고 속은 촉촉해서 아침 식사로 최고입니다.",
      "빵결이 정말 부드럽고 잼이나 버터 없이 뜯어먹어도 고소해요."
    ]
  },
  {
    "id": "tlj-bread-3949",
    "name": "뚜레쥬르 生生 생크림 식빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2019-10-31_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4200,
    "overallRating": 4.8,
    "ratingCount": 461,
    "searchInfluxCount": 16693,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 1285,
    "volume": "422g",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.6,
      "portion": 4.8,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 1285,
      "sodium": "1800mg (90%)",
      "sugar": "47g (47%)",
      "protein": "36g (65%)",
      "satFat": "20g (133%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 生生 생크림 식빵 고유 배합",
    "allergens": [
      "밀",
      "우유",
      "대두"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 13,
        "price": 4200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=3949"
      }
    ],
    "description": "마스카포네 생크림을 넣어 극강의 부드러움과 마지막까지 은은한 단맛을 느낄 수 있는 뚜레쥬르 대표 식빵",
    "bestQuotes": [
      "토스트기에 살짝 구우면 겉은 바삭하고 속은 촉촉해서 아침 식사로 최고입니다.",
      "빵결이 정말 부드럽고 잼이나 버터 없이 뜯어먹어도 고소해요."
    ]
  },
  {
    "id": "tlj-bread-2507",
    "name": "뚜레쥬르 TLJ 옥수수식빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2015-8-11_event(15).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4200,
    "overallRating": 4.9,
    "ratingCount": 288,
    "searchInfluxCount": 13604,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 85,
    "calories": 1495,
    "volume": "513g",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.3,
      "portion": 4.4,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 1495,
      "sodium": "1910mg (96%)",
      "sugar": "42g (42%)",
      "protein": "43g (78%)",
      "satFat": "16g (107%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, TLJ 옥수수식빵 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 6,
        "price": 4200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=2507"
      }
    ],
    "description": "한층 더 촉촉해지고 옥수수 맛이 풍부한 빵 속에 고소한 옥수수 알갱이가 톡톡 씹히는 식빵",
    "bestQuotes": [
      "토스트기에 살짝 구우면 겉은 바삭하고 속은 촉촉해서 아침 식사로 최고입니다.",
      "빵결이 정말 부드럽고 잼이나 버터 없이 뜯어먹어도 고소해요."
    ]
  },
  {
    "id": "tlj-bread-3888",
    "name": "뚜레쥬르 TLJ 옥수수 듬뿍 옥수수식빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2019-5-17_event(23).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3600,
    "overallRating": 4.7,
    "ratingCount": 146,
    "searchInfluxCount": 10303,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 995,
    "volume": "342g",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.8,
      "portion": 4.8,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 995,
      "sodium": "1280mg (64%)",
      "sugar": "28g (28%)",
      "protein": "29g (53%)",
      "satFat": "11g (73%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, TLJ 옥수수 듬뿍 옥수수식빵 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 7,
        "price": 3600,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=3888"
      }
    ],
    "description": "한층 더 촉촉해지고 옥수수 맛이 풍부한 빵 속에 고소한 옥수수 알갱이가 톡톡 씹히는 식빵",
    "bestQuotes": [
      "토스트기에 살짝 구우면 겉은 바삭하고 속은 촉촉해서 아침 식사로 최고입니다.",
      "빵결이 정말 부드럽고 잼이나 버터 없이 뜯어먹어도 고소해요."
    ]
  },
  {
    "id": "tlj-bread-5124",
    "name": "뚜레쥬르 기본좋은 소금버터식빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2024-9-9_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3600,
    "overallRating": 4.4,
    "ratingCount": 389,
    "searchInfluxCount": 6856,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 85,
    "calories": 645,
    "volume": "202g",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.7,
      "portion": 4.4,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 645,
      "sodium": "1230mg (62%)",
      "sugar": "8g (8%)",
      "protein": "16g (29%)",
      "satFat": "15g (100%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 기본좋은 소금버터식빵 고유 배합",
    "allergens": [
      "우유",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 8,
        "price": 3600,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5124"
      }
    ],
    "description": "3개의 이즈니버터 홀로 깊어진 풍미와 소금의 짭조름한 맛을 더 바삭하고 더 쫄깃하게 즐길 수 있는 시그니처 식빵 *본 제품에 들어간 가루쌀은 물에 불리지 않고 빻을 수 있는 국산 쌀 품종으로 농가와 상생하는 착한 원료입니다.",
    "bestQuotes": [
      "토스트기에 살짝 구우면 겉은 바삭하고 속은 촉촉해서 아침 식사로 최고입니다.",
      "빵결이 정말 부드럽고 잼이나 버터 없이 뜯어먹어도 고소해요."
    ]
  },
  {
    "id": "tlj-bread-4792",
    "name": "뚜레쥬르 착한빵식 통밀식빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2023-2-20_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4200,
    "overallRating": 4.3,
    "ratingCount": 479,
    "searchInfluxCount": 3331,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 1430,
    "volume": "489g",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.7,
      "value": 4.3,
      "portion": 4.8,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 1430,
      "sodium": "1850mg (93%)",
      "sugar": "59g (59%)",
      "protein": "41g (75%)",
      "satFat": "16g (107%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 착한빵식 통밀식빵 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 9,
        "price": 4200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4792"
      }
    ],
    "description": "통밀을 넣어 고소 담백하고 맥주발효종으로 풍미와 식감을 더한 식사빵. 맛있고 건강한 푸드업사이클링 재료를 더해 내 몸과 지구에 더욱 건강한 제품 * 푸드 업사이클링 재료인 밀기울이 완전히 분쇄되지 않아 씹힐 수 있으나, 이물이 아니오니 안심하시기 바랍니다.",
    "bestQuotes": [
      "토스트기에 살짝 구우면 겉은 바삭하고 속은 촉촉해서 아침 식사로 최고입니다.",
      "빵결이 정말 부드럽고 잼이나 버터 없이 뜯어먹어도 고소해요."
    ]
  },
  {
    "id": "tlj-bread-5320",
    "name": "뚜레쥬르 슬로우 오트 식빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2025-7-16_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3600,
    "overallRating": 4.4,
    "ratingCount": 373,
    "searchInfluxCount": 6199,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 85,
    "calories": 840,
    "volume": "299g",
    "isToday": true,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.7,
      "portion": 4.4,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 840,
      "sodium": "1010mg (51%)",
      "sugar": "14g (14%)",
      "protein": "25g (45%)",
      "satFat": "6g (40%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 슬로우 오트 식빵 고유 배합",
    "allergens": [
      "우유",
      "밀",
      "호두"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 10,
        "price": 3600,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5320"
      }
    ],
    "description": "호라산밀, 듀럼밀, 오트로 식이섬유가 가득하고, 씹을수록 고소하고 깊은 풍미가 살아있는 촉촉한 오트 식빵 ※ 겉면의 곡물은 굽는 과정에서 다소 단단해질 수 있으니 섭취 시 주의 부탁드립니다.",
    "bestQuotes": [
      "토스트기에 살짝 구우면 겉은 바삭하고 속은 촉촉해서 아침 식사로 최고입니다.",
      "빵결이 정말 부드럽고 잼이나 버터 없이 뜯어먹어도 고소해요."
    ]
  },
  {
    "id": "tlj-bread-3603",
    "name": "뚜레쥬르 고메 버터 식빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2018-9-19_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3600,
    "overallRating": 4.7,
    "ratingCount": 122,
    "searchInfluxCount": 9666,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 1060,
    "volume": "291g",
    "isToday": true,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.8,
      "portion": 4.8,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 1060,
      "sodium": "1240mg (62%)",
      "sugar": "26g (26%)",
      "protein": "27g (49%)",
      "satFat": "28g (187%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 고메 버터 식빵 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "밀",
      "아황산류"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 11,
        "price": 3600,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=3603"
      }
    ],
    "description": "브라운버터를 넣어 버터의 풍미를 올린 촉촉하고 부드러운 빵에 바삭하고 고소한 풍미의 패스트리가 만나 껍질까지 맛있게 먹을 수 있는 맛있는 식빵",
    "bestQuotes": [
      "토스트기에 살짝 구우면 겉은 바삭하고 속은 촉촉해서 아침 식사로 최고입니다.",
      "빵결이 정말 부드럽고 잼이나 버터 없이 뜯어먹어도 고소해요."
    ]
  },
  {
    "id": "tlj-bread-2523",
    "name": "뚜레쥬르 호박 패스트리 식빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2024-11-6_event(20).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3600,
    "overallRating": 4.9,
    "ratingCount": 309,
    "searchInfluxCount": 12999,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 85,
    "calories": 1160,
    "volume": "341g",
    "isToday": true,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.3,
      "portion": 4.4,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 1160,
      "sodium": "1710mg (86%)",
      "sugar": "37g (37%)",
      "protein": "28g (51%)",
      "satFat": "31g (207%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 호박 패스트리 식빵 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "아황산류"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 12,
        "price": 3600,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=2523"
      }
    ],
    "description": "호박의 고소한 맛을 살린 바삭한 패스트리 식빵",
    "bestQuotes": [
      "토스트기에 살짝 구우면 겉은 바삭하고 속은 촉촉해서 아침 식사로 최고입니다.",
      "빵결이 정말 부드럽고 잼이나 버터 없이 뜯어먹어도 고소해요."
    ]
  },
  {
    "id": "tlj-bread-4635",
    "name": "뚜레쥬르 마구마구 밤식빵(대)",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2022-5-24_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4200,
    "overallRating": 4.8,
    "ratingCount": 468,
    "searchInfluxCount": 16133,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 1620,
    "volume": "576g",
    "isToday": true,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.6,
      "portion": 4.8,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 1620,
      "sodium": "1630mg (82%)",
      "sugar": "95g (95%)",
      "protein": "36g (65%)",
      "satFat": "17g (113%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 마구마구 밤식빵(대) 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "땅콩",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 13,
        "price": 4200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4635"
      }
    ],
    "description": "부드럽고 촉촉한 반죽에 밤다이스와 밤크림이 듬뿍 들어가 밤 맛의 풍부함을 한 층 업그레이드한 제품",
    "bestQuotes": [
      "토스트기에 살짝 구우면 겉은 바삭하고 속은 촉촉해서 아침 식사로 최고입니다.",
      "빵결이 정말 부드럽고 잼이나 버터 없이 뜯어먹어도 고소해요."
    ]
  },
  {
    "id": "tlj-bread-4636",
    "name": "뚜레쥬르 마구마구 밤식빵(소)",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2022-5-24_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3600,
    "overallRating": 4.5,
    "ratingCount": 435,
    "searchInfluxCount": 19003,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 85,
    "calories": 810,
    "volume": "269g",
    "isToday": true,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.9,
      "portion": 4.4,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 810,
      "sodium": "810mg (41%)",
      "sugar": "48g (48%)",
      "protein": "18g (33%)",
      "satFat": "9g (60%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 마구마구 밤식빵(소) 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "땅콩",
      "대두",
      "밀",
      "아황산류"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 6,
        "price": 3600,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4636"
      }
    ],
    "description": "부드럽고 촉촉한 반죽에 밤다이스와 밤크림이 듬뿍 들어가 밤 맛의 풍부함을 한 층 업그레이드한 제품",
    "bestQuotes": [
      "토스트기에 살짝 구우면 겉은 바삭하고 속은 촉촉해서 아침 식사로 최고입니다.",
      "빵결이 정말 부드럽고 잼이나 버터 없이 뜯어먹어도 고소해요."
    ]
  },
  {
    "id": "tlj-bread-5573",
    "name": "뚜레쥬르 더블 초코 바게트",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "건강빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-8-19_event(3).png",
    "releaseDate": "뚜레쥬르 신제품",
    "price": 3800,
    "overallRating": 4.3,
    "ratingCount": 228,
    "searchInfluxCount": 21553,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 385,
    "volume": "132g",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.3,
      "portion": 4.7,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 385,
      "sodium": "610mg (31%)",
      "sugar": "15g (15%)",
      "protein": "10g (18%)",
      "satFat": "4.4g (29%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 더블 초코 바게트 고유 배합",
    "allergens": [
      "우유",
      "대두",
      "밀",
      "호두"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 7,
        "price": 3800,
        "eventBadge": "신제품",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5573"
      }
    ],
    "description": "다크·밀크 초콜릿을 듬뿍 더해 달콤함도 더블! 진한 카카오 풍미와 호두의 고소함을 담은 부드러운 초코 바게트",
    "bestQuotes": [
      "담백하고 씹을수록 고소한 풍미가 입안 가득 퍼집니다.",
      "겉은 누룽지처럼 구수하고 속은 쫄깃해서 발사믹 오일과 찰떡궁합이에요."
    ]
  },
  {
    "id": "tlj-bread-5556",
    "name": "뚜레쥬르 소시지&불고기 라우겐",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "건강빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-7-21_event(2).jpg",
    "releaseDate": "뚜레쥬르 신제품",
    "price": 4200,
    "overallRating": 4.4,
    "ratingCount": 211,
    "searchInfluxCount": 23732,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 86,
    "calories": 445,
    "volume": "157g",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.6,
      "portion": 4.5,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 445,
      "sodium": "1090mg (55%)",
      "sugar": "6g (6%)",
      "protein": "18g (33%)",
      "satFat": "7g (47%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 소시지&불고기 라우겐 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "돼지고기",
      "쇠고기"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 8,
        "price": 4200,
        "eventBadge": "신제품",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5556"
      }
    ],
    "description": "담백하고 쫄깃한 라우겐에 소시지와 달콤짭조름한 소불고기를 듬뿍 담아 든든하게 즐기는 조리빵",
    "bestQuotes": [
      "담백하고 씹을수록 고소한 풍미가 입안 가득 퍼집니다.",
      "겉은 누룽지처럼 구수하고 속은 쫄깃해서 발사믹 오일과 찰떡궁합이에요."
    ]
  },
  {
    "id": "tlj-bread-5489",
    "name": "뚜레쥬르 후르츠 호밀 사워도우",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "건강빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-3-23_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4500,
    "overallRating": 4.6,
    "ratingCount": 427,
    "searchInfluxCount": 25496,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 620,
    "volume": "234g",
    "isToday": true,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.9,
      "portion": 4.7,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 620,
      "sodium": "1220mg (61%)",
      "sugar": "15g (15%)",
      "protein": "20g (36%)",
      "satFat": "1.2g (8%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 후르츠 호밀 사워도우 고유 배합",
    "allergens": [
      "밀",
      "호두"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 9,
        "price": 4500,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5489"
      }
    ],
    "description": "은은한 산미가 매력적인 발아 호밀이 들어간 사워도우에 대추야자, 건자두, 건포도를 더해 쫀득하고 달콤하게 즐기는 식사빵",
    "bestQuotes": [
      "담백하고 씹을수록 고소한 풍미가 입안 가득 퍼집니다.",
      "겉은 누룽지처럼 구수하고 속은 쫄깃해서 발사믹 오일과 찰떡궁합이에요."
    ]
  },
  {
    "id": "tlj-bread-5490",
    "name": "뚜레쥬르 올리브 치즈 롱파뉴",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "건강빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-3-23_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4200,
    "overallRating": 4.9,
    "ratingCount": 472,
    "searchInfluxCount": 26810,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 86,
    "calories": 450,
    "volume": "152g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.4,
      "portion": 4.5,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 450,
      "sodium": "830mg (42%)",
      "sugar": "7g (7%)",
      "protein": "14g (25%)",
      "satFat": "3.7g (25%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 올리브 치즈 롱파뉴 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "밀",
      "호두"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 10,
        "price": 4200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5490"
      }
    ],
    "description": "짭조름한 올리브와 치즈, 고소한 견과류와 달콤한 크랜베리를 더해 그냥 먹어도 맛있는 롱~한 깜파뉴",
    "bestQuotes": [
      "담백하고 씹을수록 고소한 풍미가 입안 가득 퍼집니다.",
      "겉은 누룽지처럼 구수하고 속은 쫄깃해서 발사믹 오일과 찰떡궁합이에요."
    ]
  },
  {
    "id": "tlj-bread-5123",
    "name": "뚜레쥬르 기본좋은 쌀 베이글",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "건강빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2024-9-9_event(6).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3900,
    "overallRating": 4.9,
    "ratingCount": 323,
    "searchInfluxCount": 27647,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 325,
    "volume": "118g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.5,
      "portion": 4.6,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 325,
      "sodium": "480mg (24%)",
      "sugar": "9g (9%)",
      "protein": "10g (18%)",
      "satFat": "3g (20%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 기본좋은 쌀 베이글 고유 배합",
    "allergens": [
      "우유",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 11,
        "price": 3900,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5123"
      }
    ],
    "description": "국내산 쌀로 만든 쌀 탕종과 쌀 발효당으로 더 쫄깃하고 촉촉하게 구워낸 쌀 베이글 *본 제품에 들어간 가루쌀은 물에 불리지 않고 빻을 수 있는 국산 쌀 품종으로 농가와 상생하는 착한 원료입니다.",
    "bestQuotes": [
      "담백하고 씹을수록 고소한 풍미가 입안 가득 퍼집니다.",
      "겉은 누룽지처럼 구수하고 속은 쫄깃해서 발사믹 오일과 찰떡궁합이에요."
    ]
  },
  {
    "id": "tlj-bread-5237",
    "name": "뚜레쥬르 바삭 마늘빵(5개입)",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "건강빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2025-1-31_event(11).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3900,
    "overallRating": 4.6,
    "ratingCount": 104,
    "searchInfluxCount": 27991,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 86,
    "calories": 195,
    "volume": "40g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 4.9,
      "portion": 4.6,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 195,
      "sodium": "140mg (7%)",
      "sugar": "10g (10%)",
      "protein": "3g (5%)",
      "satFat": "7g (47%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 바삭 마늘빵(5개입) 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 12,
        "price": 3900,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5237"
      }
    ],
    "description": "마늘의 향긋함과 버터의 고소한 맛을 그대로 담은 바삭한 식감의 마늘 바게트",
    "bestQuotes": [
      "담백하고 씹을수록 고소한 풍미가 입안 가득 퍼집니다.",
      "겉은 누룽지처럼 구수하고 속은 쫄깃해서 발사믹 오일과 찰떡궁합이에요."
    ]
  },
  {
    "id": "tlj-bread-5122",
    "name": "뚜레쥬르 기본좋은 올리브 베이글",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "건강빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2024-9-9_event(9).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3900,
    "overallRating": 4.3,
    "ratingCount": 360,
    "searchInfluxCount": 27834,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 325,
    "volume": "118g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.5,
      "portion": 4.6,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 325,
      "sodium": "520mg (26%)",
      "sugar": "9g (9%)",
      "protein": "9g (16%)",
      "satFat": "2.9g (19%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 기본좋은 올리브 베이글 고유 배합",
    "allergens": [
      "우유",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 13,
        "price": 3900,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5122"
      }
    ],
    "description": "국내산 쌀 탕종과 발효당을 더한 반죽에 올리브를 더해 감칠맛은 더 올리고 쫄깃한 식감을 살려 구워낸 쌀 베이글 *본 제품에 들어간 가루쌀은 물에 불리지 않고 빻을 수 있는 국산 쌀 품종으로 농가와 상생하는 착한 원료입니다.",
    "bestQuotes": [
      "담백하고 씹을수록 고소한 풍미가 입안 가득 퍼집니다.",
      "겉은 누룽지처럼 구수하고 속은 쫄깃해서 발사믹 오일과 찰떡궁합이에요."
    ]
  },
  {
    "id": "tlj-bread-4807",
    "name": "뚜레쥬르 데일리 베이글",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "건강빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2023-4-6_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3900,
    "overallRating": 4.3,
    "ratingCount": 478,
    "searchInfluxCount": 27181,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 86,
    "calories": 310,
    "volume": "110g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.4,
      "portion": 4.7,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 310,
      "sodium": "460mg (23%)",
      "sugar": "12g (12%)",
      "protein": "12g (22%)",
      "satFat": "1.5g (10%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 데일리 베이글 고유 배합",
    "allergens": [
      "밀",
      "우유"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 6,
        "price": 3900,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4807"
      }
    ],
    "description": "폭신하고 쫄깃한 기지에 담백한 플레인 베이글",
    "bestQuotes": [
      "담백하고 씹을수록 고소한 풍미가 입안 가득 퍼집니다.",
      "겉은 누룽지처럼 구수하고 속은 쫄깃해서 발사믹 오일과 찰떡궁합이에요."
    ]
  },
  {
    "id": "tlj-bread-4808",
    "name": "뚜레쥬르 데일리 블루베리 베이글",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "건강빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2023-4-6_event(8).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3900,
    "overallRating": 4.6,
    "ratingCount": 400,
    "searchInfluxCount": 26043,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 302,
    "volume": "105g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.9,
      "portion": 4.5,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 302,
      "sodium": "348mg (17%)",
      "sugar": "10g (10%)",
      "protein": "9g (16%)",
      "satFat": "0.3g (2%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 데일리 블루베리 베이글 고유 배합",
    "allergens": [
      "밀",
      "우유"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 7,
        "price": 3900,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4808"
      }
    ],
    "description": "폭신하고 쫄깃한 기지에 새콤달콤한 블루베리가 콕콕 박혀있는 블루베리 베이글",
    "bestQuotes": [
      "담백하고 씹을수록 고소한 풍미가 입안 가득 퍼집니다.",
      "겉은 누룽지처럼 구수하고 속은 쫄깃해서 발사믹 오일과 찰떡궁합이에요."
    ]
  },
  {
    "id": "tlj-bread-4791",
    "name": "뚜레쥬르 착한빵식 통밀빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "건강빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2023-2-20_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4500,
    "overallRating": 4.8,
    "ratingCount": 164,
    "searchInfluxCount": 24445,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 86,
    "calories": 715,
    "volume": "245g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.6,
      "portion": 4.7,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 715,
      "sodium": "930mg (47%)",
      "sugar": "29g (29%)",
      "protein": "21g (38%)",
      "satFat": "8g (53%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 착한빵식 통밀빵 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 8,
        "price": 4500,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4791"
      }
    ],
    "description": "통밀을 넣어 고소 담백하고, 맥주 발효종으로 풍미와 식감을 더한 식사빵 그냥 먹기에도 좋고, 샌드위치 빵으로도 활용 가능한 건강빵 * 푸드 업사이클링 재료인 밀기울이 완전히 분쇄되지 않아 씹힐 수 있으나, 이물이 아니오니 안심하시기 바랍니다.",
    "bestQuotes": [
      "담백하고 씹을수록 고소한 풍미가 입안 가득 퍼집니다.",
      "겉은 누룽지처럼 구수하고 속은 쫄깃해서 발사믹 오일과 찰떡궁합이에요."
    ]
  },
  {
    "id": "tlj-bread-5012",
    "name": "뚜레쥬르 고단백 하루견과 곡물브레드",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "건강빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2025-7-16_event(20).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4800,
    "overallRating": 4.9,
    "ratingCount": 273,
    "searchInfluxCount": 22417,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 955,
    "volume": "265g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.4,
      "portion": 4.5,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 955,
      "sodium": "670mg (34%)",
      "sugar": "21g (21%)",
      "protein": "32g (58%)",
      "satFat": "5g (33%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 고단백 하루견과 곡물브레드 고유 배합",
    "allergens": [
      "대두",
      "밀",
      "호두"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 9,
        "price": 4800,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5012"
      }
    ],
    "description": "고소한 빵에 견과류를 듬뿍 넣어 고소하고 담백한 맛을 느낄 수 있는 식사빵으로 그냥 먹기에도 좋고, 샌드위치 빵으로도 활용 가능한 고단백 건강빵",
    "bestQuotes": [
      "담백하고 씹을수록 고소한 풍미가 입안 가득 퍼집니다.",
      "겉은 누룽지처럼 구수하고 속은 쫄깃해서 발사믹 오일과 찰떡궁합이에요."
    ]
  },
  {
    "id": "tlj-bread-5513",
    "name": "뚜레쥬르 더 진해진 마늘 퐁당 바게트",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "건강빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-4-27_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3800,
    "overallRating": 4.7,
    "ratingCount": 455,
    "searchInfluxCount": 20000,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 86,
    "calories": 730,
    "volume": "180g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.9,
      "portion": 4.7,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 730,
      "sodium": "640mg (32%)",
      "sugar": "22g (22%)",
      "protein": "11g (20%)",
      "satFat": "18g (120%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 더 진해진 마늘 퐁당 바게트 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 10,
        "price": 3800,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5513"
      }
    ],
    "description": "마늘 소스를 듬뿍 더해 마늘 본연의 풍미에 퐁당! 겉은 바삭, 속은 꾸덕하고 촉촉해 더욱 진하고 맛있는 마늘 바게트",
    "bestQuotes": [
      "담백하고 씹을수록 고소한 풍미가 입안 가득 퍼집니다.",
      "겉은 누룽지처럼 구수하고 속은 쫄깃해서 발사믹 오일과 찰떡궁합이에요."
    ]
  },
  {
    "id": "tlj-bread-5235",
    "name": "뚜레쥬르 호두 바게트",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "건강빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2025-1-31_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3800,
    "overallRating": 4.4,
    "ratingCount": 453,
    "searchInfluxCount": 17243,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 445,
    "volume": "140g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.6,
      "portion": 4.4,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 445,
      "sodium": "630mg (32%)",
      "sugar": "2g (2%)",
      "protein": "15g (27%)",
      "satFat": "1.4g (9%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 호두 바게트 고유 배합",
    "allergens": [
      "밀",
      "호두"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 11,
        "price": 3800,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5235"
      }
    ],
    "description": "고소한 호두를 더해 풍미와 씹는 식감이 더해진 호두 바게트",
    "bestQuotes": [
      "담백하고 씹을수록 고소한 풍미가 입안 가득 퍼집니다.",
      "겉은 누룽지처럼 구수하고 속은 쫄깃해서 발사믹 오일과 찰떡궁합이에요."
    ]
  },
  {
    "id": "tlj-bread-5236",
    "name": "뚜레쥬르 호두 연유 바게트",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "건강빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2025-1-31_event(8).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3800,
    "overallRating": 4.3,
    "ratingCount": 267,
    "searchInfluxCount": 14201,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 86,
    "calories": 830,
    "volume": "216g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.3,
      "portion": 4.8,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 830,
      "sodium": "730mg (37%)",
      "sugar": "23g (23%)",
      "protein": "16g (29%)",
      "satFat": "20g (133%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 호두 연유 바게트 고유 배합",
    "allergens": [
      "우유",
      "대두",
      "밀",
      "호두"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 12,
        "price": 3800,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5236"
      }
    ],
    "description": "고소한 풍미 가득 호두 바게트에 연유크림을 더해 달콤하게 즐기는 간식형 바게트",
    "bestQuotes": [
      "담백하고 씹을수록 고소한 풍미가 입안 가득 퍼집니다.",
      "겉은 누룽지처럼 구수하고 속은 쫄깃해서 발사믹 오일과 찰떡궁합이에요."
    ]
  },
  {
    "id": "tlj-bread-5234",
    "name": "뚜레쥬르 프랑스 바게트",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "건강빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2025-1-31_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3800,
    "overallRating": 4.5,
    "ratingCount": 171,
    "searchInfluxCount": 10935,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 685,
    "volume": "250g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.8,
      "portion": 4.4,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 685,
      "sodium": "1400mg (70%)",
      "sugar": "3g (3%)",
      "protein": "27g (49%)",
      "satFat": "0.7g (5%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 프랑스 바게트 고유 배합",
    "allergens": [
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 13,
        "price": 3800,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5234"
      }
    ],
    "description": "프랑스산 밀가루가 들어가 겉은 더 바삭하고 속은 더 촉촉한, 구수한 맛의 정통 바게트",
    "bestQuotes": [
      "담백하고 씹을수록 고소한 풍미가 입안 가득 퍼집니다.",
      "겉은 누룽지처럼 구수하고 속은 쫄깃해서 발사믹 오일과 찰떡궁합이에요."
    ]
  },
  {
    "id": "tlj-bread-3923",
    "name": "뚜레쥬르 연유 버터 라우겐",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "건강빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2019-9-18_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4200,
    "overallRating": 4.8,
    "ratingCount": 404,
    "searchInfluxCount": 7510,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 86,
    "calories": 475,
    "volume": "199g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.7,
      "portion": 4.8,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 475,
      "sodium": "560mg (28%)",
      "sugar": "10g (10%)",
      "protein": "8g (15%)",
      "satFat": "17g (113%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 연유 버터 라우겐 고유 배합",
    "allergens": [
      "우유",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 6,
        "price": 4200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=3923"
      }
    ],
    "description": "담백한 라우겐 빵 속에 달콤한 연유와 AOP 버터가 샌드된 제품",
    "bestQuotes": [
      "담백하고 씹을수록 고소한 풍미가 입안 가득 퍼집니다.",
      "겉은 누룽지처럼 구수하고 속은 쫄깃해서 발사믹 오일과 찰떡궁합이에요."
    ]
  },
  {
    "id": "tlj-bread-4044",
    "name": "뚜레쥬르 앙버터 라우겐",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "건강빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2019-12-10_event(3).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4200,
    "overallRating": 4.9,
    "ratingCount": 478,
    "searchInfluxCount": 3995,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 520,
    "volume": "147g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 4.3,
      "portion": 4.4,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 520,
      "sodium": "600mg (30%)",
      "sugar": "18g (18%)",
      "protein": "9g (16%)",
      "satFat": "16g (107%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 앙버터 라우겐 고유 배합",
    "allergens": [
      "밀",
      "우유"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 7,
        "price": 4200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4044"
      }
    ],
    "description": "담백한 라우겐 속에 달콤한 통팥 앙금과 AOP 버터가 샌드된 제품",
    "bestQuotes": [
      "담백하고 씹을수록 고소한 풍미가 입안 가득 퍼집니다.",
      "겉은 누룽지처럼 구수하고 속은 쫄깃해서 발사믹 오일과 찰떡궁합이에요."
    ]
  },
  {
    "id": "tlj-bread-3911",
    "name": "뚜레쥬르 라우겐(2개입)",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "건강빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2019-8-21_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4200,
    "overallRating": 4.8,
    "ratingCount": 355,
    "searchInfluxCount": 5539,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 86,
    "calories": 430,
    "volume": "156g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.7,
      "portion": 4.8,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 430,
      "sodium": "1070mg (54%)",
      "sugar": "6g (6%)",
      "protein": "13g (24%)",
      "satFat": "0.8g (5%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 라우겐(2개입) 고유 배합",
    "allergens": [
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 8,
        "price": 4200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=3911"
      }
    ],
    "description": "짙은 갈색이 도는 담백한 독일빵으로 앙버터, 샌드위치 등을 만들어 먹을 수 있는 제품",
    "bestQuotes": [
      "담백하고 씹을수록 고소한 풍미가 입안 가득 퍼집니다.",
      "겉은 누룽지처럼 구수하고 속은 쫄깃해서 발사믹 오일과 찰떡궁합이에요."
    ]
  },
  {
    "id": "tlj-bread-5571",
    "name": "뚜레쥬르 오지치즈 포테이토 포카치아",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-8-19_event(8).jpg",
    "releaseDate": "뚜레쥬르 신제품",
    "price": 3900,
    "overallRating": 4.5,
    "ratingCount": 97,
    "searchInfluxCount": 9023,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 450,
    "volume": "170g",
    "isToday": false,
    "isHot": true,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.8,
      "portion": 4.4,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 450,
      "sodium": "880mg (44%)",
      "sugar": "6g (6%)",
      "protein": "12g (22%)",
      "satFat": "6g (40%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 오지치즈 포테이토 포카치아 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "돼지고기",
      "쇠고기"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 9,
        "price": 3900,
        "eventBadge": "신제품",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5571"
      }
    ],
    "description": "부드럽고 쫄깃한 포카치아에 짭조름한 베이컨과 웨지감자, 진한 오지치즈 소스를 더한 풍미 가득 간식빵",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-5572",
    "name": "뚜레쥬르 감바스 포카치아",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-8-19_event(1).png",
    "releaseDate": "뚜레쥬르 신제품",
    "price": 3900,
    "overallRating": 4.3,
    "ratingCount": 329,
    "searchInfluxCount": 12387,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 87,
    "calories": 410,
    "volume": "138g",
    "isToday": false,
    "isHot": true,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.3,
      "portion": 4.8,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 410,
      "sodium": "670mg (34%)",
      "sugar": "4g (4%)",
      "protein": "14g (25%)",
      "satFat": "6g (40%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 감바스 포카치아 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "새우",
      "토마토"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 10,
        "price": 3900,
        "eventBadge": "신제품",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5572"
      }
    ],
    "description": "부드럽고 쫄깃한 포카치아에 은은한 마늘 풍미, 탱글한 새우가 들어간 감바스를 접목한 감칠맛 가득 간식빵",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-5530",
    "name": "뚜레쥬르 쫀득 딸기우유 크림빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-6-1_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3000,
    "overallRating": 4.4,
    "ratingCount": 473,
    "searchInfluxCount": 15563,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 250,
    "volume": "102g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.7,
      "portion": 4.4,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 250,
      "sodium": "310mg (16%)",
      "sugar": "16g (16%)",
      "protein": "5g (9%)",
      "satFat": "6g (40%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 쫀득 딸기우유 크림빵 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 11,
        "price": 3000,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5530"
      }
    ],
    "description": "새콤달콤한 딸기우유 크림과 부드럽고 진한 크림치즈가 더해진 쫀득한 크림빵 *본 제품에 들어간 가루쌀은 물에 불리지 않고 빻을 수 있는 국산 쌀 품종으로 농가와 상생하는 착한 원료입니다.",
    "bestQuotes": [
      "부드러운 크림이 아낌없이 듬뿍 들어가 있어서 달콤하게 당 충전하기 좋아요.",
      "느끼하지 않고 산뜻하게 달콤해서 커피나 우유와 최고의 조합입니다."
    ]
  },
  {
    "id": "tlj-bread-5488",
    "name": "뚜레쥬르 쫀득 쑥 단팥빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-3-23_event(11).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2200,
    "overallRating": 4.7,
    "ratingCount": 424,
    "searchInfluxCount": 18488,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 87,
    "calories": 285,
    "volume": "111g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.8,
      "portion": 4.8,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 285,
      "sodium": "310mg (16%)",
      "sugar": "4g (4%)",
      "protein": "8g (15%)",
      "satFat": "1g (7%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 쫀득 쑥 단팥빵 고유 배합",
    "allergens": [
      "밀",
      "호두"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 12,
        "price": 2200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5488"
      }
    ],
    "description": "향긋한 쑥 풍미를 가득 담은 쫀득한 빵 안에 견과류가 듬뿍 들어간 무설탕 팥앙금으로 부담 없이 즐기는 단팥빵",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-5477",
    "name": "뚜레쥬르 더 촉촉해진 연유 퐁당 밀크브레드",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-2-19_event(11).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4200,
    "overallRating": 4.9,
    "ratingCount": 205,
    "searchInfluxCount": 21102,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 840,
    "volume": "202g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.3,
      "portion": 4.5,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 840,
      "sodium": "820mg (41%)",
      "sugar": "35g (35%)",
      "protein": "13g (24%)",
      "satFat": "22g (147%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 더 촉촉해진 연유 퐁당 밀크브레드 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 13,
        "price": 4200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5477"
      }
    ],
    "description": "달콤한 연유크림을 듬뿍 더해 촉촉함에 퐁당! 버터 한 조각을 올려 풍미를 더하고, 데워 먹으면 더욱 맛있는 간식빵",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-5527",
    "name": "뚜레쥬르 매콤 떡볶이볼",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-6-4_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2800,
    "overallRating": 4.8,
    "ratingCount": 235,
    "searchInfluxCount": 23354,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 87,
    "calories": 385,
    "volume": "99g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.6,
      "portion": 4.7,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 385,
      "sodium": "530mg (27%)",
      "sugar": "7g (7%)",
      "protein": "3g (5%)",
      "satFat": "6g (40%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 매콤 떡볶이볼 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 6,
        "price": 2800,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5527"
      }
    ],
    "description": "겉은 바삭! 속은 쫀득! 맛 없을 수 없는 쫄깃한 식감에 매콤한 떡볶이 소스를 더해 떡볶이 맛 그대로 재현한 간식빵",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-46",
    "name": "뚜레쥬르 깨찰빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2014-2-20_event(15).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2800,
    "overallRating": 4.6,
    "ratingCount": 439,
    "searchInfluxCount": 25199,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 180,
    "volume": "48g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.9,
      "portion": 4.5,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 180,
      "sodium": "210mg (11%)",
      "sugar": "2g (2%)",
      "protein": "2g (4%)",
      "satFat": "3.1g (21%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 깨찰빵 고유 배합",
    "allergens": [
      "계란",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 7,
        "price": 2800,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=46"
      }
    ],
    "description": "타피오카를 넣어 쫄깃쫄깃하게 구워낸 빵",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-60",
    "name": "뚜레쥬르 단팥빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2014-2-20_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2200,
    "overallRating": 4.3,
    "ratingCount": 466,
    "searchInfluxCount": 26599,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 87,
    "calories": 265,
    "volume": "86g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.4,
      "portion": 4.7,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 265,
      "sodium": "260mg (13%)",
      "sugar": "17g (17%)",
      "protein": "8g (15%)",
      "satFat": "2.5g (17%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 단팥빵 고유 배합",
    "allergens": [
      "밀",
      "우유",
      "계란",
      "대두"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 8,
        "price": 2200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=60"
      }
    ],
    "description": "달콤하고 부드러운 단팥 앙금을 듬뿍 넣어 남녀노소 좋아하는 간식빵",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-5165",
    "name": "뚜레쥬르 연유크림 만난 단팥빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2024-11-6_event(26).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2200,
    "overallRating": 4.4,
    "ratingCount": 303,
    "searchInfluxCount": 27527,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 365,
    "volume": "105g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.5,
      "portion": 4.6,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 365,
      "sodium": "250mg (13%)",
      "sugar": "23g (23%)",
      "protein": "8g (15%)",
      "satFat": "7g (47%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 연유크림 만난 단팥빵 고유 배합",
    "allergens": [
      "계란",
      "대두",
      "우유",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 9,
        "price": 2200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5165"
      }
    ],
    "description": "달콤한 연유크림이 들어있는 단팥빵",
    "bestQuotes": [
      "부드러운 크림이 아낌없이 듬뿍 들어가 있어서 달콤하게 당 충전하기 좋아요.",
      "느끼하지 않고 산뜻하게 달콤해서 커피나 우유와 최고의 조합입니다."
    ]
  },
  {
    "id": "tlj-bread-59",
    "name": "뚜레쥬르 소보로빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2024-9-23_event(15).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2200,
    "overallRating": 4.6,
    "ratingCount": 129,
    "searchInfluxCount": 27964,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 87,
    "calories": 320,
    "volume": "76g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 4.9,
      "portion": 4.6,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 320,
      "sodium": "270mg (14%)",
      "sugar": "15g (15%)",
      "protein": "7g (13%)",
      "satFat": "7g (47%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 소보로빵 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "땅콩",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 10,
        "price": 2200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=59"
      }
    ],
    "description": "고소한 땅콩과 소보로가 토핑된 간식빵",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-5020",
    "name": "뚜레쥬르 생크림 소보로",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2024-9-30_event(35).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3000,
    "overallRating": 4.9,
    "ratingCount": 378,
    "searchInfluxCount": 27902,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 385,
    "volume": "93g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.5,
      "portion": 4.6,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 385,
      "sodium": "270mg (14%)",
      "sugar": "16g (16%)",
      "protein": "8g (15%)",
      "satFat": "12g (80%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 생크림 소보로 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "땅콩",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 11,
        "price": 3000,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5020"
      }
    ],
    "description": "뚜레쥬르의 인기 아이템 소보로에 부드러운 생크림이 어우러진제품",
    "bestQuotes": [
      "부드러운 크림이 아낌없이 듬뿍 들어가 있어서 달콤하게 당 충전하기 좋아요.",
      "느끼하지 않고 산뜻하게 달콤해서 커피나 우유와 최고의 조합입니다."
    ]
  },
  {
    "id": "tlj-bread-3802",
    "name": "뚜레쥬르 NEW 단팥 소보로",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2019-4-2_event(17).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2200,
    "overallRating": 4.9,
    "ratingCount": 479,
    "searchInfluxCount": 27341,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 87,
    "calories": 430,
    "volume": "110g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.4,
      "portion": 4.6,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 430,
      "sodium": "300mg (15%)",
      "sugar": "31g (31%)",
      "protein": "11g (20%)",
      "satFat": "4.2g (28%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, NEW 단팥 소보로 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "땅콩",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 12,
        "price": 2200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=3802"
      }
    ],
    "description": "고소한 소보로 빵 속에 달콤한 단팥 앙금이 들어있는 제품",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-1291",
    "name": "뚜레쥬르 땅콩크림소보로",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2024-9-23_event(18).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2200,
    "overallRating": 4.6,
    "ratingCount": 385,
    "searchInfluxCount": 26293,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 455,
    "volume": "102g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 4.9,
      "portion": 4.7,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 455,
      "sodium": "310mg (16%)",
      "sugar": "20g (20%)",
      "protein": "8g (15%)",
      "satFat": "14g (93%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 땅콩크림소보로 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "땅콩",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 13,
        "price": 2200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=1291"
      }
    ],
    "description": "고소한 땅콩크림이 들어있는 소보로",
    "bestQuotes": [
      "부드러운 크림이 아낌없이 듬뿍 들어가 있어서 달콤하게 당 충전하기 좋아요.",
      "느끼하지 않고 산뜻하게 달콤해서 커피나 우유와 최고의 조합입니다."
    ]
  },
  {
    "id": "tlj-bread-534",
    "name": "뚜레쥬르 슈크림빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2014-2-20_event(18).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3000,
    "overallRating": 4.4,
    "ratingCount": 139,
    "searchInfluxCount": 24778,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 87,
    "calories": 265,
    "volume": "85g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.5,
      "portion": 4.5,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 265,
      "sodium": "220mg (11%)",
      "sugar": "13g (13%)",
      "protein": "7g (13%)",
      "satFat": "5g (33%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 슈크림빵 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 6,
        "price": 3000,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=534"
      }
    ],
    "description": "부드럽고 진한 슈크림이 들어간 간식빵",
    "bestQuotes": [
      "부드러운 크림이 아낌없이 듬뿍 들어가 있어서 달콤하게 당 충전하기 좋아요.",
      "느끼하지 않고 산뜻하게 달콤해서 커피나 우유와 최고의 조합입니다."
    ]
  },
  {
    "id": "tlj-bread-44",
    "name": "뚜레쥬르 완두앙금빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2014-6-19_event(12).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2800,
    "overallRating": 4.3,
    "ratingCount": 294,
    "searchInfluxCount": 22828,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 245,
    "volume": "80g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.4,
      "portion": 4.7,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 245,
      "sodium": "250mg (13%)",
      "sugar": "21g (21%)",
      "protein": "6g (11%)",
      "satFat": "2.4g (16%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 완두앙금빵 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 7,
        "price": 2800,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=44"
      }
    ],
    "description": "달콤한 완두앙금이 들어있는 간식빵",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-3080",
    "name": "뚜레쥬르 후레쉬 크림빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2017-2-23_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3000,
    "overallRating": 4.5,
    "ratingCount": 463,
    "searchInfluxCount": 20481,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 87,
    "calories": 315,
    "volume": "78g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.9,
      "portion": 4.5,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 315,
      "sodium": "270mg (14%)",
      "sugar": "14g (14%)",
      "protein": "5g (9%)",
      "satFat": "9g (60%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 후레쉬 크림빵 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 8,
        "price": 3000,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=3080"
      }
    ],
    "description": "부드러운 빵속에 달콤한 연유버터크림을 샌드하여 여성층의 인기가 높은 빵",
    "bestQuotes": [
      "부드러운 크림이 아낌없이 듬뿍 들어가 있어서 달콤하게 당 충전하기 좋아요.",
      "느끼하지 않고 산뜻하게 달콤해서 커피나 우유와 최고의 조합입니다."
    ]
  },
  {
    "id": "tlj-bread-45",
    "name": "뚜레쥬르 까까웨뜨",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2014-6-19_event(15).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2800,
    "overallRating": 4.8,
    "ratingCount": 443,
    "searchInfluxCount": 17784,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 330,
    "volume": "81g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.6,
      "portion": 4.8,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 330,
      "sodium": "270mg (14%)",
      "sugar": "12g (12%)",
      "protein": "6g (11%)",
      "satFat": "10g (67%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 까까웨뜨 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "땅콩",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 9,
        "price": 2800,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=45"
      }
    ],
    "description": "바삭한 패스트리 결을 얹은 부드러운 빵 속에 고소한 땅콩크림이 샌드된 간식빵",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-1240",
    "name": "뚜레쥬르 리얼 초코 소라빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/소라(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2800,
    "overallRating": 4.9,
    "ratingCount": 244,
    "searchInfluxCount": 14791,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 87,
    "calories": 205,
    "volume": "68g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.3,
      "portion": 4.4,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 205,
      "sodium": "230mg (12%)",
      "sugar": "11g (11%)",
      "protein": "4g (7%)",
      "satFat": "4.2g (28%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 리얼 초코 소라빵 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 10,
        "price": 2800,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=1240"
      }
    ],
    "description": "부드러운 소라 모양 빵에 진한 초코 크림이 듬뿍 들어있는 간식빵",
    "bestQuotes": [
      "부드러운 크림이 아낌없이 듬뿍 들어가 있어서 달콤하게 당 충전하기 좋아요.",
      "느끼하지 않고 산뜻하게 달콤해서 커피나 우유와 최고의 조합입니다."
    ]
  },
  {
    "id": "tlj-bread-3834",
    "name": "뚜레쥬르 빵 속에 리얼 초코",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2019-4-10_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2800,
    "overallRating": 4.7,
    "ratingCount": 195,
    "searchInfluxCount": 11562,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 245,
    "volume": "76g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.8,
      "portion": 4.8,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 245,
      "sodium": "270mg (14%)",
      "sugar": "13g (13%)",
      "protein": "6g (11%)",
      "satFat": "6g (40%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 빵 속에 리얼 초코 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 11,
        "price": 2800,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=3834"
      }
    ],
    "description": "달콤하고 진한 초코 가나슈가 부드러운 빵 속에 가득 채워져 간식으로 즐기기 좋은 제품",
    "bestQuotes": [
      "부드러운 크림이 아낌없이 듬뿍 들어가 있어서 달콤하게 당 충전하기 좋아요.",
      "느끼하지 않고 산뜻하게 달콤해서 커피나 우유와 최고의 조합입니다."
    ]
  },
  {
    "id": "tlj-bread-4348",
    "name": "뚜레쥬르 진한 우유 크림빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2020-12-28_event(9).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3000,
    "overallRating": 4.4,
    "ratingCount": 418,
    "searchInfluxCount": 8162,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 88,
    "calories": 190,
    "volume": "70g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.7,
      "portion": 4.4,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 190,
      "sodium": "160mg (8%)",
      "sugar": "10g (10%)",
      "protein": "5g (9%)",
      "satFat": "3.7g (25%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 진한 우유 크림빵 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 12,
        "price": 3000,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4348"
      }
    ],
    "description": "물 대신 우유로만 반죽한 빵에 우유크림을 넣어 더 진한 우유의 맛을 느낄 수 있는 제품",
    "bestQuotes": [
      "부드러운 크림이 아낌없이 듬뿍 들어가 있어서 달콤하게 당 충전하기 좋아요.",
      "느끼하지 않고 산뜻하게 달콤해서 커피나 우유와 최고의 조합입니다."
    ]
  },
  {
    "id": "tlj-bread-4767",
    "name": "뚜레쥬르 진한 크림치즈빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2023-5-31_event(8).JPG",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2800,
    "overallRating": 4.3,
    "ratingCount": 475,
    "searchInfluxCount": 4658,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 280,
    "volume": "81g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 4.3,
      "portion": 4.8,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 280,
      "sodium": "270mg (14%)",
      "sugar": "13g (13%)",
      "protein": "6g (11%)",
      "satFat": "8g (53%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 진한 크림치즈빵 고유 배합",
    "allergens": [
      "우유",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 13,
        "price": 2800,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4767"
      }
    ],
    "description": "우유 초죽을 넣어 촉촉하면서 부드러운 식감을 살리고 크림치즈 본연의 맛을 살린 간식빵",
    "bestQuotes": [
      "부드러운 크림이 아낌없이 듬뿍 들어가 있어서 달콤하게 당 충전하기 좋아요.",
      "느끼하지 않고 산뜻하게 달콤해서 커피나 우유와 최고의 조합입니다."
    ]
  },
  {
    "id": "tlj-bread-3909",
    "name": "뚜레쥬르 사르르 고구마케이크 빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2019-8-13_event(17).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2800,
    "overallRating": 4.4,
    "ratingCount": 337,
    "searchInfluxCount": 4878,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 88,
    "calories": 385,
    "volume": "124g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.7,
      "portion": 4.4,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 385,
      "sodium": "310mg (16%)",
      "sugar": "25g (25%)",
      "protein": "7g (13%)",
      "satFat": "11g (73%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 사르르 고구마케이크 빵 고유 배합",
    "allergens": [
      "밀",
      "우유",
      "대두",
      "계란"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 6,
        "price": 2800,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=3909"
      }
    ],
    "description": "고구마를 닮은 빵에 부드러운 크림과 고구마 필링이 듬뿍 들어있어 입안에서 사르르 녹는 빵",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-5362",
    "name": "뚜레쥬르 메이플피칸 쿠키번",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2025-10-15_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3600,
    "overallRating": 4.7,
    "ratingCount": 87,
    "searchInfluxCount": 8377,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 575,
    "volume": "120g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.8,
      "portion": 4.8,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 575,
      "sodium": "360mg (18%)",
      "sugar": "21g (21%)",
      "protein": "7g (13%)",
      "satFat": "18g (120%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 메이플피칸 쿠키번 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 7,
        "price": 3600,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5362"
      }
    ],
    "description": "달콤한 메이플의 깊은 풍미에, 고소한 피칸과 바삭한 쿠키를 더해 한층 더 맛있는 간식",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-4688",
    "name": "뚜레쥬르 오리지널 커피번",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2022-9-7_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3600,
    "overallRating": 4.9,
    "ratingCount": 348,
    "searchInfluxCount": 11769,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 88,
    "calories": 405,
    "volume": "100g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 4.3,
      "portion": 4.4,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 405,
      "sodium": "330mg (17%)",
      "sugar": "16g (16%)",
      "protein": "7g (13%)",
      "satFat": "15g (100%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 오리지널 커피번 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 8,
        "price": 3600,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4688"
      }
    ],
    "description": "진하고 깊은 커피향과 버터 커스터드 내용물을 더해 한 층 업그레이드한 커피번",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-5074",
    "name": "뚜레쥬르 크림 가득 모카번",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2024-6-5_event.png",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3600,
    "overallRating": 4.8,
    "ratingCount": 477,
    "searchInfluxCount": 14985,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 665,
    "volume": "161g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.7,
      "portion": 4.8,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 665,
      "sodium": "370mg (19%)",
      "sugar": "26g (26%)",
      "protein": "8g (15%)",
      "satFat": "30g (200%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 크림 가득 모카번 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 9,
        "price": 3600,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5074"
      }
    ],
    "description": "진하고 깊은 커피향 가득 모카번에 부드러운 연유 생크림이 가득 들어간 간식형 제품",
    "bestQuotes": [
      "부드러운 크림이 아낌없이 듬뿍 들어가 있어서 달콤하게 당 충전하기 좋아요.",
      "느끼하지 않고 산뜻하게 달콤해서 커피나 우유와 최고의 조합입니다."
    ]
  },
  {
    "id": "tlj-bread-4521",
    "name": "뚜레쥬르 소금버터롤",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2021-12-29_event(5).JPG",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4500,
    "overallRating": 4.5,
    "ratingCount": 410,
    "searchInfluxCount": 17961,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 88,
    "calories": 225,
    "volume": "62g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.8,
      "portion": 4.4,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 225,
      "sodium": "310mg (16%)",
      "sugar": "5g (5%)",
      "protein": "5g (9%)",
      "satFat": "6g (40%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 소금버터롤 고유 배합",
    "allergens": [
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 10,
        "price": 4500,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4521"
      }
    ],
    "description": "버터의 고소함과 소금의 짭짤함이 어우러져 술술 들어가는 식사빵",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-5131",
    "name": "뚜레쥬르 앙버터 소금버터롤",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2024-10-4_event(8).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4500,
    "overallRating": 4.3,
    "ratingCount": 181,
    "searchInfluxCount": 20638,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 425,
    "volume": "112g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.3,
      "portion": 4.7,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 425,
      "sodium": "370mg (19%)",
      "sugar": "19g (19%)",
      "protein": "7g (13%)",
      "satFat": "14g (93%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 앙버터 소금버터롤 고유 배합",
    "allergens": [
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 11,
        "price": 4500,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5131"
      }
    ],
    "description": "부드러운 버터와 달콤한 팥앙금이 만난 소금버터롤 샌드",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-4162",
    "name": "뚜레쥬르 러스크가 달구나",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2024-9-30_event(15).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3600,
    "overallRating": 4.4,
    "ratingCount": 257,
    "searchInfluxCount": 22961,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 88,
    "calories": 735,
    "volume": "111g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.6,
      "portion": 4.5,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 735,
      "sodium": "400mg (20%)",
      "sugar": "31g (31%)",
      "protein": "9g (16%)",
      "satFat": "31g (207%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 러스크가 달구나 고유 배합",
    "allergens": [
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 12,
        "price": 3600,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4162"
      }
    ],
    "description": "생크림과 꿀토핑물을 바르고 구워서 더욱 달콤 바삭해 한 번 먹으면 멈출 수 없는 러스크",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-4241",
    "name": "뚜레쥬르 마담 얼그레이 크림번",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2020-9-24_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2800,
    "overallRating": 4.7,
    "ratingCount": 449,
    "searchInfluxCount": 24886,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 395,
    "volume": "100g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.9,
      "portion": 4.7,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 395,
      "sodium": "250mg (13%)",
      "sugar": "18g (18%)",
      "protein": "9g (16%)",
      "satFat": "14g (93%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 마담 얼그레이 크림번 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 13,
        "price": 2800,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4241"
      }
    ],
    "description": "부드러운 생크림과 얼그레이 토핑을 더한 빵이 은은하게 어우러져 향긋한 홍차향을 느낄 수 있는 크림번",
    "bestQuotes": [
      "부드러운 크림이 아낌없이 듬뿍 들어가 있어서 달콤하게 당 충전하기 좋아요.",
      "느끼하지 않고 산뜻하게 달콤해서 커피나 우유와 최고의 조합입니다."
    ]
  },
  {
    "id": "tlj-bread-4347",
    "name": "뚜레쥬르 폭신폭신 우유브레드",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2020-12-28_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3600,
    "overallRating": 4.9,
    "ratingCount": 459,
    "searchInfluxCount": 26372,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 88,
    "calories": 505,
    "volume": "170g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.4,
      "portion": 4.5,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 505,
      "sodium": "580mg (29%)",
      "sugar": "17g (17%)",
      "protein": "16g (29%)",
      "satFat": "7g (47%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 폭신폭신 우유브레드 고유 배합",
    "allergens": [
      "우유",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 6,
        "price": 3600,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4347"
      }
    ],
    "description": "물 한방울도 넣지 않고 우유로만 반죽하여 구워내 폭신폭신하고 담백한 맛이 좋은 제품",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-5097",
    "name": "뚜레쥬르 카스테라 우유크림볼",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2024-9-9_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4200,
    "overallRating": 4.8,
    "ratingCount": 282,
    "searchInfluxCount": 27390,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 700,
    "volume": "213g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.5,
      "portion": 4.6,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 700,
      "sodium": "520mg (26%)",
      "sugar": "28g (28%)",
      "protein": "12g (22%)",
      "satFat": "24g (160%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 카스테라 우유크림볼 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 7,
        "price": 4200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5097"
      }
    ],
    "description": "우리 쌀이 들어가 더 폭신하고 촉촉한 빵 속에 단짠 우유크림을 더해 한 알씩 나눠먹는 크림빵 *본 제품에 들어간 가루쌀은 물에 불리지 않고 빻을 수 있는 국산 쌀 품종으로 농가와 상생하는 착한 원료입니다.",
    "bestQuotes": [
      "부드러운 크림이 아낌없이 듬뿍 들어가 있어서 달콤하게 당 충전하기 좋아요.",
      "느끼하지 않고 산뜻하게 달콤해서 커피나 우유와 최고의 조합입니다."
    ]
  },
  {
    "id": "tlj-bread-4046",
    "name": "뚜레쥬르 치즈 방앗간(3개입)",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2019-12-17_event.jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3600,
    "overallRating": 4.6,
    "ratingCount": 153,
    "searchInfluxCount": 27920,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 88,
    "calories": 485,
    "volume": "159g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 4.9,
      "portion": 4.6,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 485,
      "sodium": "660mg (33%)",
      "sugar": "13g (13%)",
      "protein": "7g (13%)",
      "satFat": "12g (80%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 치즈 방앗간(3개입) 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 8,
        "price": 3600,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4046"
      }
    ],
    "description": "치즈가 쏙쏙 박힌 쫄깃한 빵에 크림치즈를 넣고 달콤한 꿀을 토핑하여 빵순이라면 지나칠 수 없는 빵",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-1557",
    "name": "뚜레쥬르 미니치즈롤",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2024-11-6_event(41).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4500,
    "overallRating": 4.3,
    "ratingCount": 393,
    "searchInfluxCount": 27952,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 605,
    "volume": "198g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.5,
      "portion": 4.6,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 605,
      "sodium": "1190mg (60%)",
      "sugar": "6g (6%)",
      "protein": "25g (45%)",
      "satFat": "10g (67%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 미니치즈롤 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 9,
        "price": 4500,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=1557"
      }
    ],
    "description": "담백한 빵 속에 고소한 롤치즈가 쏙쏙 박혀있는 미니 치즈롤",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-1780",
    "name": "뚜레쥬르 순수한맛 순우유롤(봉)",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2025-9-24_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4500,
    "overallRating": 4.3,
    "ratingCount": 479,
    "searchInfluxCount": 27484,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 88,
    "calories": 695,
    "volume": "208g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.4,
      "portion": 4.6,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 695,
      "sodium": "930mg (47%)",
      "sugar": "20g (20%)",
      "protein": "17g (31%)",
      "satFat": "11g (73%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 순수한맛 순우유롤(봉) 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 10,
        "price": 4500,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=1780"
      }
    ],
    "description": "보들하고 부드러운 빵 속에 순수하고 진한 우유의 맛을 그대로 담은 제품",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-5321",
    "name": "뚜레쥬르 슬로우 오트 모닝롤",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2025-7-16_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4500,
    "overallRating": 4.6,
    "ratingCount": 368,
    "searchInfluxCount": 26525,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 510,
    "volume": "177g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 4.9,
      "portion": 4.5,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 510,
      "sodium": "770mg (39%)",
      "sugar": "17g (17%)",
      "protein": "13g (24%)",
      "satFat": "3.1g (21%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 슬로우 오트 모닝롤 고유 배합",
    "allergens": [
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 11,
        "price": 4500,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5321"
      }
    ],
    "description": "버터, 우유, 계란 없이 \"오트밀 페스토\"를 더해 만들어 고소함은 기본! 촉촉하고 부드러운 모닝롤",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-5363",
    "name": "뚜레쥬르 고구마 누룽지",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2025-10-21_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3600,
    "overallRating": 4.8,
    "ratingCount": 115,
    "searchInfluxCount": 25096,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 88,
    "calories": 505,
    "volume": "178g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.5,
      "portion": 4.7,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 505,
      "sodium": "450mg (23%)",
      "sugar": "25g (25%)",
      "protein": "14g (25%)",
      "satFat": "3g (20%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 고구마 누룽지 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "아황산류"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 12,
        "price": 3600,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5363"
      }
    ],
    "description": "구수한 누룽지를 더해 겉은 바삭! 속은 고구마의 달콤함과 부드러움으로 가득- 누구나 즐기기 좋은 간식빵 *본 제품에 들어간 가루쌀은 물에 불리지 않고 빻을 수 있는 국산 쌀 품종으로 농가와 상생하는 착한 원료입니다.",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-4049",
    "name": "뚜레쥬르 달콩 찹쌀 브레드",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2019-12-23_event.jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4200,
    "overallRating": 4.9,
    "ratingCount": 315,
    "searchInfluxCount": 23225,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 705,
    "volume": "210g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.4,
      "portion": 4.5,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 705,
      "sodium": "620mg (31%)",
      "sugar": "35g (35%)",
      "protein": "15g (27%)",
      "satFat": "12g (80%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 달콩 찹쌀 브레드 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "호두",
      "땅콩"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 13,
        "price": 4200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4049"
      }
    ],
    "description": "고소한 곡물빵과 달콤한 콩, 쫄깃한 찰떡이 조화롭게 어우러지는 든든한 제품",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-5246",
    "name": "뚜레쥬르 콩팥 담뿍 브레드",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2025-3-26_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4200,
    "overallRating": 4.7,
    "ratingCount": 469,
    "searchInfluxCount": 20949,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 89,
    "calories": 1085,
    "volume": "380g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.9,
      "portion": 4.7,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 1085,
      "sodium": "1270mg (64%)",
      "sugar": "70g (70%)",
      "protein": "31g (56%)",
      "satFat": "6g (40%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 콩팥 담뿍 브레드 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 6,
        "price": 4200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5246"
      }
    ],
    "description": "세 가지 콩과 팥, 고구마를 듬뿍! 맛있는 건강함을 담뿍 담고 깨를 더해 고소하고 달콤하게 즐기는 간식빵 *본 제품에 들어간 가루쌀은 물에 불리지 않고 빻을 수 있는 국산 쌀 품종으로 농가와 상생하는 착한 원료입니다.",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-5247",
    "name": "뚜레쥬르 콩팥 담뿍 브레드(Half)",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2025-3-26_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3600,
    "overallRating": 4.4,
    "ratingCount": 432,
    "searchInfluxCount": 18314,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 545,
    "volume": "190g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.6,
      "portion": 4.4,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 545,
      "sodium": "630mg (32%)",
      "sugar": "35g (35%)",
      "protein": "15g (27%)",
      "satFat": "2.8g (19%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 콩팥 담뿍 브레드(Half) 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 7,
        "price": 3600,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5247"
      }
    ],
    "description": "세 가지 콩과 팥, 고구마를 듬뿍! 맛있는 건강함을 담뿍 담고 깨를 더해 고소하고 달콤하게 즐기는 간식빵 *본 제품에 들어간 가루쌀은 물에 불리지 않고 빻을 수 있는 국산 쌀 품종으로 농가와 상생하는 착한 원료입니다.",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-1315",
    "name": "뚜레쥬르 크림치즈 월넛 브레드",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2024-11-6_event(38).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3600,
    "overallRating": 4.3,
    "ratingCount": 221,
    "searchInfluxCount": 15372,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 89,
    "calories": 630,
    "volume": "167g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.3,
      "portion": 4.8,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 630,
      "sodium": "800mg (40%)",
      "sugar": "18g (18%)",
      "protein": "15g (27%)",
      "satFat": "14g (93%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 크림치즈 월넛 브레드 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "호두"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 8,
        "price": 3600,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=1315"
      }
    ],
    "description": "곡물빵에 부드럽고 달콤한 크림치즈를 넣은 간식빵",
    "bestQuotes": [
      "부드러운 크림이 아낌없이 듬뿍 들어가 있어서 달콤하게 당 충전하기 좋아요.",
      "느끼하지 않고 산뜻하게 달콤해서 커피나 우유와 최고의 조합입니다."
    ]
  },
  {
    "id": "tlj-bread-941",
    "name": "뚜레쥬르 카페모카빵(대)",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2022-2-17_event(5).JPG",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4200,
    "overallRating": 4.5,
    "ratingCount": 218,
    "searchInfluxCount": 12182,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 1010,
    "volume": "265g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.8,
      "portion": 4.4,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 1010,
      "sodium": "810mg (41%)",
      "sugar": "56g (56%)",
      "protein": "23g (42%)",
      "satFat": "20g (133%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 카페모카빵(대) 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 9,
        "price": 4200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=941"
      }
    ],
    "description": "더욱 진해진 모카 풍미 가득! 우유, 커피와 함께 드시면 더욱 맛있는 제품",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-3569",
    "name": "뚜레쥬르 카페모카빵(소)",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2022-2-17_event(2).JPG",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3600,
    "overallRating": 4.8,
    "ratingCount": 431,
    "searchInfluxCount": 8809,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 89,
    "calories": 500,
    "volume": "132g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.7,
      "portion": 4.8,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 500,
      "sodium": "400mg (20%)",
      "sugar": "28g (28%)",
      "protein": "12g (22%)",
      "satFat": "10g (67%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 카페모카빵(소) 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 10,
        "price": 3600,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=3569"
      }
    ],
    "description": "진하고 부드러운 모카향 가득~ 우유나 커피와 함께하면 더욱 맛있는 뚜레쥬르 모카향 가득 모카빵",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-1088",
    "name": "뚜레쥬르 카페 모카 크림빵(대)",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2022-2-17_event(8).JPG",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3000,
    "overallRating": 4.9,
    "ratingCount": 470,
    "searchInfluxCount": 5320,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 1355,
    "volume": "326g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 4.3,
      "portion": 4.4,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 1355,
      "sodium": "860mg (43%)",
      "sugar": "70g (70%)",
      "protein": "23g (42%)",
      "satFat": "41g (273%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 카페 모카 크림빵(대) 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 11,
        "price": 3000,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=1088"
      }
    ],
    "description": "은은한 모카향 가득 모카빵에 달콤한 모카크림이 사이사이 샌드되어 더욱 맛있는 제품",
    "bestQuotes": [
      "부드러운 크림이 아낌없이 듬뿍 들어가 있어서 달콤하게 당 충전하기 좋아요.",
      "느끼하지 않고 산뜻하게 달콤해서 커피나 우유와 최고의 조합입니다."
    ]
  },
  {
    "id": "tlj-bread-54",
    "name": "뚜레쥬르 카페 모카 크림빵(소)",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2022-2-17_event(14).JPG",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3000,
    "overallRating": 4.8,
    "ratingCount": 317,
    "searchInfluxCount": 4215,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 89,
    "calories": 630,
    "volume": "155g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.7,
      "portion": 4.8,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 630,
      "sodium": "420mg (21%)",
      "sugar": "33g (33%)",
      "protein": "12g (22%)",
      "satFat": "18g (120%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 카페 모카 크림빵(소) 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 12,
        "price": 3000,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=54"
      }
    ],
    "description": "진한 모카향 가득한 빵에 달콤한 모카크림을 듬뿍 채워 더욱 부드럽게 즐길 수 있는 빵",
    "bestQuotes": [
      "부드러운 크림이 아낌없이 듬뿍 들어가 있어서 달콤하게 당 충전하기 좋아요.",
      "느끼하지 않고 산뜻하게 달콤해서 커피나 우유와 최고의 조합입니다."
    ]
  },
  {
    "id": "tlj-bread-1733",
    "name": "뚜레쥬르 매직모카크림빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2022-2-17_event(11).JPG",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3000,
    "overallRating": 4.5,
    "ratingCount": 111,
    "searchInfluxCount": 7727,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 1445,
    "volume": "342g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.8,
      "portion": 4.4,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 1445,
      "sodium": "870mg (44%)",
      "sugar": "73g (73%)",
      "protein": "23g (42%)",
      "satFat": "46g (307%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 매직모카크림빵 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 13,
        "price": 3000,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=1733"
      }
    ],
    "description": "은은한 모카향 가득 모카빵에 달콤한 모카크림이 사이사이 샌드되어 더욱 맛있는 제품",
    "bestQuotes": [
      "부드러운 크림이 아낌없이 듬뿍 들어가 있어서 달콤하게 당 충전하기 좋아요.",
      "느끼하지 않고 산뜻하게 달콤해서 커피나 우유와 최고의 조합입니다."
    ]
  },
  {
    "id": "tlj-bread-3570",
    "name": "뚜레쥬르 밤이 듬뿍 맘모스(대)",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2018-8-16_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4500,
    "overallRating": 4.3,
    "ratingCount": 365,
    "searchInfluxCount": 11144,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 89,
    "calories": 1145,
    "volume": "335g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 4.3,
      "portion": 4.8,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 1145,
      "sodium": "760mg (38%)",
      "sugar": "102g (102%)",
      "protein": "17g (31%)",
      "satFat": "24g (160%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 밤이 듬뿍 맘모스(대) 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "땅콩",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 6,
        "price": 4500,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=3570"
      }
    ],
    "description": "단팥 앙금과 크림, 고구마와 밤 다이스를 듬뿍 레이어드하고 땅콩소보로를 토핑한 달콤하고 속이 꽉 찬 제품",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-4799",
    "name": "뚜레쥬르 클래식 딸기잼 맘모스",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2023-6-7_event(8).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4500,
    "overallRating": 4.4,
    "ratingCount": 479,
    "searchInfluxCount": 14398,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 1490,
    "volume": "370g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.7,
      "portion": 4.4,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 1490,
      "sodium": "1250mg (63%)",
      "sugar": "78g (78%)",
      "protein": "24g (44%)",
      "satFat": "44g (293%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 클래식 딸기잼 맘모스 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "땅콩",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 7,
        "price": 4500,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4799"
      }
    ],
    "description": "소보로를 토핑한 부드러운 빵 사이에 버터크림과 딸기잼을 샌드한 대형제품",
    "bestQuotes": [
      "부드러운 크림이 아낌없이 듬뿍 들어가 있어서 달콤하게 당 충전하기 좋아요.",
      "느끼하지 않고 산뜻하게 달콤해서 커피나 우유와 최고의 조합입니다."
    ]
  },
  {
    "id": "tlj-bread-5525",
    "name": "뚜레쥬르 부드러운 후레쉬크림 샌드빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-5-26_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4200,
    "overallRating": 4.7,
    "ratingCount": 396,
    "searchInfluxCount": 17424,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 89,
    "calories": 1350,
    "volume": "323g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.8,
      "portion": 4.8,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 1350,
      "sodium": "1160mg (58%)",
      "sugar": "54g (54%)",
      "protein": "19g (35%)",
      "satFat": "43g (287%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 부드러운 후레쉬크림 샌드빵 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 8,
        "price": 4200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5525"
      }
    ],
    "description": "달콤하고 부드러운 버터크림이 사이 사이에 듬뿍 샌드된 부드러운 간식빵 *크림속 검은 반점은 바닐라씨드임으로 안심하고 드시길 바랍니다.",
    "bestQuotes": [
      "부드러운 크림이 아낌없이 듬뿍 들어가 있어서 달콤하게 당 충전하기 좋아요.",
      "느끼하지 않고 산뜻하게 달콤해서 커피나 우유와 최고의 조합입니다."
    ]
  },
  {
    "id": "tlj-bread-5495",
    "name": "뚜레쥬르 팥이 빵빵 단팥빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-4-2_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2200,
    "overallRating": 4.9,
    "ratingCount": 157,
    "searchInfluxCount": 20161,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 310,
    "volume": "86g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.3,
      "portion": 4.5,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 310,
      "sodium": "280mg (14%)",
      "sugar": "25g (25%)",
      "protein": "8g (15%)",
      "satFat": "2.4g (16%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 팥이 빵빵 단팥빵 고유 배합",
    "allergens": [
      "밀",
      "계란",
      "우유",
      "대두"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 9,
        "price": 2200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5495"
      }
    ],
    "description": "달콤한 단팥 앙금이 들어있는 간식빵",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-5496",
    "name": "뚜레쥬르 맛보로 소보로빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-4-2_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2200,
    "overallRating": 4.8,
    "ratingCount": 279,
    "searchInfluxCount": 22555,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 89,
    "calories": 241,
    "volume": "66g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.6,
      "portion": 4.7,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 241,
      "sodium": "177mg (9%)",
      "sugar": "12g (12%)",
      "protein": "5g (9%)",
      "satFat": "3.3g (22%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 맛보로 소보로빵 고유 배합",
    "allergens": [
      "밀",
      "대두",
      "우유",
      "계란",
      "땅콩"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 10,
        "price": 2200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5496"
      }
    ],
    "description": "고소하고 달콤한 소보로가 폭신한 빵과 어우러지는 간식빵",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-5498",
    "name": "뚜레쥬르 크림듬뿍 슈크림빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-4-2_event(11).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3000,
    "overallRating": 4.5,
    "ratingCount": 458,
    "searchInfluxCount": 24557,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 235,
    "volume": "74g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.9,
      "portion": 4.5,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 235,
      "sodium": "260mg (13%)",
      "sugar": "16g (16%)",
      "protein": "6g (11%)",
      "satFat": "3.4g (23%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 크림듬뿍 슈크림빵 고유 배합",
    "allergens": [
      "밀",
      "계란",
      "우유",
      "대두"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 11,
        "price": 3000,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5498"
      }
    ],
    "description": "부드러운 슈크림이 들어있는 간식빵",
    "bestQuotes": [
      "부드러운 크림이 아낌없이 듬뿍 들어가 있어서 달콤하게 당 충전하기 좋아요.",
      "느끼하지 않고 산뜻하게 달콤해서 커피나 우유와 최고의 조합입니다."
    ]
  },
  {
    "id": "tlj-bread-5535",
    "name": "뚜레쥬르 포키와 캐런의 우유 스틱 브레드",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-6-9_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2800,
    "overallRating": 4.3,
    "ratingCount": 450,
    "searchInfluxCount": 26128,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 89,
    "calories": 360,
    "volume": "90g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.4,
      "portion": 4.7,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 360,
      "sodium": "270mg (14%)",
      "sugar": "16g (16%)",
      "protein": "9g (16%)",
      "satFat": "8g (53%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 포키와 캐런의 우유 스틱 브레드 고유 배합",
    "allergens": [
      "밀",
      "계란",
      "우유",
      "대두"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 12,
        "price": 2800,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5535"
      }
    ],
    "description": "토이스토리 캐릭터 포키와 캐런의 사랑스러운 케미! 오직 우유로만 반죽하여 촉촉하고 부드러운 식감과 계란, 버터로 영양 가득한 스틱 브레드",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-5536",
    "name": "뚜레쥬르 버즈와 함께 출동! 완두앙금빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-6-9_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2800,
    "overallRating": 4.4,
    "ratingCount": 260,
    "searchInfluxCount": 27236,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 235,
    "volume": "75g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.5,
      "portion": 4.6,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 235,
      "sodium": "270mg (14%)",
      "sugar": "14g (14%)",
      "protein": "6g (11%)",
      "satFat": "2.4g (16%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 버즈와 함께 출동! 완두앙금빵 고유 배합",
    "allergens": [
      "밀",
      "계란",
      "우유",
      "대두"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 13,
        "price": 2800,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5536"
      }
    ],
    "description": "토이스토리 캐릭터 버즈 라이트이어와 알린 출동! 부드럽고 촉촉한 빵 속에 달콤한 완두앙금이 들어있는 간식빵",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-5298",
    "name": "뚜레쥬르 신선해 고소해 후레쉬크림빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2025-6-11_event(17).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3000,
    "overallRating": 4.6,
    "ratingCount": 178,
    "searchInfluxCount": 27859,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 89,
    "calories": 275,
    "volume": "62g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 4.9,
      "portion": 4.6,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 275,
      "sodium": "250mg (13%)",
      "sugar": "12g (12%)",
      "protein": "4g (7%)",
      "satFat": "9g (60%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 신선해 고소해 후레쉬크림빵 고유 배합",
    "allergens": [
      "밀",
      "계란",
      "우유",
      "대두"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 6,
        "price": 3000,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5298"
      }
    ],
    "description": "달콤한 버터크림이 들어있는 부드러운 스틱빵",
    "bestQuotes": [
      "부드러운 크림이 아낌없이 듬뿍 들어가 있어서 달콤하게 당 충전하기 좋아요.",
      "느끼하지 않고 산뜻하게 달콤해서 커피나 우유와 최고의 조합입니다."
    ]
  },
  {
    "id": "tlj-bread-1459",
    "name": "뚜레쥬르 진짜 고소한 땅콩크림빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2025-7-22_event(11).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3000,
    "overallRating": 4.9,
    "ratingCount": 408,
    "searchInfluxCount": 27984,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 97,
    "calories": 345,
    "volume": "67g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.5,
      "portion": 4.6,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 345,
      "sodium": "240mg (12%)",
      "sugar": "8g (8%)",
      "protein": "8g (15%)",
      "satFat": "10g (67%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 진짜 고소한 땅콩크림빵 고유 배합",
    "allergens": [
      "밀",
      "땅콩",
      "대두",
      "우유",
      "계란"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 7,
        "price": 3000,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=1459"
      }
    ],
    "description": "고소한 땅콩크림을 듬뿍 넣은 땅콩크림빵",
    "bestQuotes": [
      "부드러운 크림이 아낌없이 듬뿍 들어가 있어서 달콤하게 당 충전하기 좋아요.",
      "느끼하지 않고 산뜻하게 달콤해서 커피나 우유와 최고의 조합입니다."
    ]
  },
  {
    "id": "tlj-bread-1405",
    "name": "뚜레쥬르 겹겹이 밀크롤인",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2025-6-11_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4500,
    "overallRating": 4.9,
    "ratingCount": 477,
    "searchInfluxCount": 27609,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 90,
    "calories": 65,
    "volume": "160g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.4,
      "portion": 4.6,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 65,
      "sodium": "60mg (3%)",
      "sugar": "3g (3%)",
      "protein": "2g (4%)",
      "satFat": "0.6g (4%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 겹겹이 밀크롤인 고유 배합",
    "allergens": [
      "밀",
      "쇠고기",
      "우유",
      "계란",
      "대두"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 8,
        "price": 4500,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=1405"
      }
    ],
    "description": "우유와 버터를 겹겹이 넣어 맛있게 구워낸 부드러운 간식용 빵!",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-2020",
    "name": "뚜레쥬르 겹겹이 치즈스틱(6개입)",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2025-6-11_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2800,
    "overallRating": 4.6,
    "ratingCount": 350,
    "searchInfluxCount": 26742,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 96,
    "calories": 65,
    "volume": "120g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 4.9,
      "portion": 4.7,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 65,
      "sodium": "70mg (4%)",
      "sugar": "3g (3%)",
      "protein": "2g (4%)",
      "satFat": "0.6g (4%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 겹겹이 치즈스틱(6개입) 고유 배합",
    "allergens": [
      "밀",
      "쇠고기",
      "우유",
      "계란",
      "대두"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 9,
        "price": 2800,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=2020"
      }
    ],
    "description": "한 겹 한 겹 촉촉한 빵에 치즈의 풍미가 가득한 스틱형 간식빵! 우유와 함께 드시면 더욱 부드럽습니다.",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-1329",
    "name": "뚜레쥬르 한입 두입 미니 단팥빵",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2025-6-11_event(8).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2200,
    "overallRating": 4.4,
    "ratingCount": 90,
    "searchInfluxCount": 25399,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 90,
    "calories": 492,
    "volume": "160g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.5,
      "portion": 4.5,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 492,
      "sodium": "423mg (21%)",
      "sugar": "42g (42%)",
      "protein": "13g (24%)",
      "satFat": "2.5g (17%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 한입 두입 미니 단팥빵 고유 배합",
    "allergens": [
      "밀",
      "우유",
      "계란",
      "호두",
      "대두"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 10,
        "price": 2200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=1329"
      }
    ],
    "description": "한입 사이즈의 미니 단팥빵",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-2889",
    "name": "뚜레쥬르 폭신폭신 모닝롤",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2025-7-22_event(14).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4500,
    "overallRating": 4.3,
    "ratingCount": 334,
    "searchInfluxCount": 23608,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 96,
    "calories": 680,
    "volume": "180g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.4,
      "portion": 4.7,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 680,
      "sodium": "920mg (46%)",
      "sugar": "28g (28%)",
      "protein": "18g (33%)",
      "satFat": "10g (67%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 폭신폭신 모닝롤 고유 배합",
    "allergens": [
      "밀",
      "계란",
      "우유",
      "대두"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 11,
        "price": 4500,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=2889"
      }
    ],
    "description": "보들보들한 빵 결 속 풍부한 버터 향 가득! 담백하고 부드러운 모닝롤",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-5472",
    "name": "뚜레쥬르 아름핑이 좋아하는 미니샌드 스트로베리",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-2-5_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2800,
    "overallRating": 4.5,
    "ratingCount": 474,
    "searchInfluxCount": 21405,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 90,
    "calories": 205,
    "volume": "65g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.9,
      "portion": 4.5,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 205,
      "sodium": "250mg (13%)",
      "sugar": "11g (11%)",
      "protein": "3g (5%)",
      "satFat": "4.4g (29%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 아름핑이 좋아하는 미니샌드 스트로베리 고유 배합",
    "allergens": [
      "밀",
      "대두",
      "우유"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 12,
        "price": 2800,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5472"
      }
    ],
    "description": "상큼한 딸기 크림이 가득 들어간 간식형 제품",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-5473",
    "name": "뚜레쥬르 사뿐핑이 좋아하는 미니샌드 연유",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-2-5_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2800,
    "overallRating": 4.8,
    "ratingCount": 420,
    "searchInfluxCount": 18833,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 96,
    "calories": 226,
    "volume": "65g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.6,
      "portion": 4.8,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 226,
      "sodium": "290mg (15%)",
      "sugar": "11g (11%)",
      "protein": "4g (7%)",
      "satFat": "5g (33%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 사뿐핑이 좋아하는 미니샌드 연유 고유 배합",
    "allergens": [
      "밀",
      "대두",
      "우유"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 13,
        "price": 2800,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5473"
      }
    ],
    "description": "달콤한 연유 크림이 가득 들어간 간식형 제품",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-5528",
    "name": "뚜레쥬르 낙엽 소시지 브레드",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-5-27_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3900,
    "overallRating": 4.9,
    "ratingCount": 198,
    "searchInfluxCount": 15944,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 90,
    "calories": 380,
    "volume": "136g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.3,
      "portion": 4.4,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 380,
      "sodium": "720mg (36%)",
      "sugar": "11g (11%)",
      "protein": "9g (16%)",
      "satFat": "7g (47%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 낙엽 소시지 브레드 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "돼지고기",
      "토마토",
      "닭고기",
      "쇠고기"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 6,
        "price": 3900,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5528"
      }
    ],
    "description": "부드러운 빵에 짭쪼름한 소시지, 아삭한 야채마요 믹스를 더해 남녀노소 누구나 좋아하는 소시지빵",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-3799",
    "name": "뚜레쥬르 NEW 고소한 후랑크 소시지",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2019-4-2_event(8).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3900,
    "overallRating": 4.7,
    "ratingCount": 241,
    "searchInfluxCount": 12797,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 96,
    "calories": 300,
    "volume": "98g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.8,
      "portion": 4.8,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 300,
      "sodium": "580mg (29%)",
      "sugar": "7g (7%)",
      "protein": "12g (22%)",
      "satFat": "7g (47%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, NEW 고소한 후랑크 소시지 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 7,
        "price": 3900,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=3799"
      }
    ],
    "description": "더욱 커지고 업그레이드된 후랑크 소시지가 통으로 들어간 고소하고 짭조롬한 제품",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-3800",
    "name": "뚜레쥬르 NEW 어니언 소시지 포카치아",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2019-4-2_event(11).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3900,
    "overallRating": 4.4,
    "ratingCount": 442,
    "searchInfluxCount": 9453,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 90,
    "calories": 370,
    "volume": "110g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.7,
      "portion": 4.4,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 370,
      "sodium": "690mg (35%)",
      "sugar": "4g (4%)",
      "protein": "13g (24%)",
      "satFat": "8g (53%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, NEW 어니언 소시지 포카치아 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "돼지고기",
      "쇠고기"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 8,
        "price": 3900,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=3800"
      }
    ],
    "description": "부드럽고 쫄깃한 포카치아 속에 머스터드, 크리스피 어니언이 토핑된 소시지를 함께 즐길 수 있는 든든한 간식빵",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-854",
    "name": "뚜레쥬르 피자토스트",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2024-11-6_event(29).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3900,
    "overallRating": 4.3,
    "ratingCount": 464,
    "searchInfluxCount": 5980,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 96,
    "calories": 300,
    "volume": "116g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 4.3,
      "portion": 4.8,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 300,
      "sodium": "740mg (37%)",
      "sugar": "6g (6%)",
      "protein": "14g (25%)",
      "satFat": "8g (53%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 피자토스트 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "돼지고기",
      "토마토"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 9,
        "price": 3900,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=854"
      }
    ],
    "description": "부드러운 식빵 위에 피자 토핑을 올린 홈메이드 스타일 피자 토스트",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-5021",
    "name": "뚜레쥬르 크로크무슈",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2024-3-7_event(14).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3600,
    "overallRating": 4.4,
    "ratingCount": 297,
    "searchInfluxCount": 3552,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 90,
    "calories": 490,
    "volume": "145g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.7,
      "portion": 4.4,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 490,
      "sodium": "830mg (42%)",
      "sugar": "10g (10%)",
      "protein": "16g (29%)",
      "satFat": "12g (80%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 크로크무슈 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 10,
        "price": 3600,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5021"
      }
    ],
    "description": "부드러운 식빵 위에 슬라이스 치즈와 햄을 놓고 피자 치즈를 듬뿍 뿌려 살짝 구운 간식빵",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-4222",
    "name": "뚜레쥬르 새우오믈렛 토스트",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2020-8-28_event(54).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3600,
    "overallRating": 4.7,
    "ratingCount": 136,
    "searchInfluxCount": 7074,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 96,
    "calories": 435,
    "volume": "173g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.8,
      "portion": 4.8,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 435,
      "sodium": "830mg (42%)",
      "sugar": "9g (9%)",
      "protein": "15g (27%)",
      "satFat": "10g (67%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 새우오믈렛 토스트 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "새우",
      "쇠고기"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 11,
        "price": 3600,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4222"
      }
    ],
    "description": "마늘버터로 구워낸 바삭한 식빵에 부드러운 계란 오믈렛과 새우가 어우러진 미니 토스트",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-5022",
    "name": "뚜레쥬르 그냥 먹어도 맛있는 햄야채롤(6개입)",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2024-3-7_event(17).png",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4500,
    "overallRating": 4.9,
    "ratingCount": 382,
    "searchInfluxCount": 10514,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 90,
    "calories": 590,
    "volume": "186g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 4.3,
      "portion": 4.4,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 590,
      "sodium": "1820mg (91%)",
      "sugar": "9g (9%)",
      "protein": "16g (29%)",
      "satFat": "5g (33%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 그냥 먹어도 맛있는 햄야채롤(6개입) 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "돼지고기",
      "토마토"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 12,
        "price": 4500,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5022"
      }
    ],
    "description": "더욱 촉촉해진 빵에 햄, 야채, 체다치즈가 콕콕 박혀 다른 재료 없이 그냥 먹어도 맛있는 모닝롤",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-1222",
    "name": "뚜레쥬르 미니 햄 치즈롤(10개입)",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2024-9-30_event(32).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4500,
    "overallRating": 4.8,
    "ratingCount": 479,
    "searchInfluxCount": 13803,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 96,
    "calories": 565,
    "volume": "210g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.7,
      "portion": 4.8,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 565,
      "sodium": "1270mg (64%)",
      "sugar": "6g (6%)",
      "protein": "23g (42%)",
      "satFat": "9g (60%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 미니 햄 치즈롤(10개입) 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "돼지고기"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 13,
        "price": 4500,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=1222"
      }
    ],
    "description": "담백한 빵과 체다치즈, 햄이 조화로운 미니사이즈 제품",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-4911",
    "name": "뚜레쥬르 뚜쥬맘 계란 토스트",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "간식빵",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2023-10-10_event(9).JPG",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4200,
    "overallRating": 4.5,
    "ratingCount": 380,
    "searchInfluxCount": 16877,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 90,
    "calories": 625,
    "volume": "256g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.8,
      "portion": 4.4,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 625,
      "sodium": "1420mg (71%)",
      "sugar": "14g (14%)",
      "protein": "27g (49%)",
      "satFat": "14g (93%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 뚜쥬맘 계란 토스트 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "토마토",
      "돼지고기"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 6,
        "price": 4200,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4911"
      }
    ],
    "description": "부드러운 식빵 사이에 계란, 햄, 체다치즈, 몬잭치즈를 더해 맛을 더하고 계란 내용물을 묻혀 구워내 부드럽게 즐길 수 있는 토스트",
    "bestQuotes": [
      "뚜레쥬르 특유의 신선하고 쫄깃한 식감이 살아있어 믿고 먹는 최애 빵입니다.",
      "재료 본연의 맛이 잘 살아있고 호불호 없이 온 가족이 즐기기 좋습니다."
    ]
  },
  {
    "id": "tlj-bread-5538",
    "name": "뚜레쥬르 행복한 에스끼떼 패스트리",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "파이/패스트리",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-6-9_event(11).jpg",
    "releaseDate": "뚜레쥬르 신제품",
    "price": 3500,
    "overallRating": 4.3,
    "ratingCount": 132,
    "searchInfluxCount": 19672,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 96,
    "calories": 695,
    "volume": "147g",
    "isToday": false,
    "isHot": true,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.3,
      "portion": 4.7,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 695,
      "sodium": "870mg (44%)",
      "sugar": "17g (17%)",
      "protein": "13g (24%)",
      "satFat": "17g (113%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 행복한 에스끼떼 패스트리 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "쇠고기"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 7,
        "price": 3500,
        "eventBadge": "신제품",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5538"
      }
    ],
    "description": "톡톡 터지는 옥수수 알갱이의 달콤 고소함과 바삭한 나초칩, 짭조름한 치즈맛 시즈닝이 어우러져 자꾸만 생각나는 맛의 패스트리",
    "bestQuotes": [
      "한 입 베어물면 바사삭 부서지는 결이 예술이고 버터 향이 진합니다.",
      "에어프라이어에 3분 돌려먹으면 갓 구운 빵집 퀄리티 그대로 느껴집니다."
    ]
  },
  {
    "id": "tlj-bread-5542",
    "name": "뚜레쥬르 왁뿌 탱글탱귤 브레드",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "파이/패스트리",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-6-15_event(11).jpg",
    "releaseDate": "뚜레쥬르 신제품",
    "price": 3400,
    "overallRating": 4.4,
    "ratingCount": 300,
    "searchInfluxCount": 22134,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 90,
    "calories": 475,
    "volume": "137g",
    "isToday": false,
    "isHot": true,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.6,
      "portion": 4.5,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 475,
      "sodium": "310mg (16%)",
      "sugar": "27g (27%)",
      "protein": "7g (13%)",
      "satFat": "19g (127%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 왁뿌 탱글탱귤 브레드 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "아황산류"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 8,
        "price": 3400,
        "eventBadge": "신제품",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5542"
      }
    ],
    "description": "상큼한 레몬 커스터드와 향긋한 얼그레이 크림, 달콤한 귤 토핑을 더한 빵에 화이트 초콜릿을 입혀 아그작한 식감을 살린 제품 (*우리밀 함유 제품)",
    "bestQuotes": [
      "한 입 베어물면 바사삭 부서지는 결이 예술이고 버터 향이 진합니다.",
      "에어프라이어에 3분 돌려먹으면 갓 구운 빵집 퀄리티 그대로 느껴집니다."
    ]
  },
  {
    "id": "tlj-bread-5529",
    "name": "뚜레쥬르 한 컵의 얼그레이&레몬",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "파이/패스트리",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-5-28_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3400,
    "overallRating": 4.7,
    "ratingCount": 465,
    "searchInfluxCount": 24213,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 96,
    "calories": 390,
    "volume": "128g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.9,
      "portion": 4.7,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 390,
      "sodium": "310mg (16%)",
      "sugar": "14g (14%)",
      "protein": "7g (13%)",
      "satFat": "16g (107%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 한 컵의 얼그레이&레몬 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "아황산류"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 9,
        "price": 3400,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5529"
      }
    ],
    "description": "바삭한 패스트리 결 속 상큼한 레몬 커스타드와 향긋한 얼그레이 크림을 듬뿍 더한 크림빵 (*우리밀 함유 제품)",
    "bestQuotes": [
      "한 입 베어물면 바사삭 부서지는 결이 예술이고 버터 향이 진합니다.",
      "에어프라이어에 3분 돌려먹으면 갓 구운 빵집 퀄리티 그대로 느껴집니다."
    ]
  },
  {
    "id": "tlj-bread-5474",
    "name": "뚜레쥬르 인절미 패스트리",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "파이/패스트리",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-2-19_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3500,
    "overallRating": 4.9,
    "ratingCount": 440,
    "searchInfluxCount": 25868,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 90,
    "calories": 620,
    "volume": "169g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.4,
      "portion": 4.5,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 620,
      "sodium": "670mg (34%)",
      "sugar": "28g (28%)",
      "protein": "10g (18%)",
      "satFat": "21g (140%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 인절미 패스트리 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 10,
        "price": 3500,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5474"
      }
    ],
    "description": "카라멜라이징된 달콤 바삭한 밑면과 쫄깃한 찰떡, 고소한 콩고물이 더해져 겹겹이 매력적인 K-패스트리",
    "bestQuotes": [
      "한 입 베어물면 바사삭 부서지는 결이 예술이고 버터 향이 진합니다.",
      "에어프라이어에 3분 돌려먹으면 갓 구운 빵집 퀄리티 그대로 느껴집니다."
    ]
  },
  {
    "id": "tlj-bread-5475",
    "name": "뚜레쥬르 시나몬 데니쉬 롤",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "파이/패스트리",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-2-19_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3400,
    "overallRating": 4.8,
    "ratingCount": 238,
    "searchInfluxCount": 27064,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 96,
    "calories": 590,
    "volume": "152g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.5,
      "portion": 4.7,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 590,
      "sodium": "490mg (25%)",
      "sugar": "31g (31%)",
      "protein": "9g (16%)",
      "satFat": "20g (133%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 시나몬 데니쉬 롤 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "아황산류"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 11,
        "price": 3400,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5475"
      }
    ],
    "description": "부드러운 데니쉬와 시나몬 페이스트, 크림치즈 프로스팅이 어우러져 풍미 가득한 간식빵",
    "bestQuotes": [
      "한 입 베어물면 바사삭 부서지는 결이 예술이고 버터 향이 진합니다.",
      "에어프라이어에 3분 돌려먹으면 갓 구운 빵집 퀄리티 그대로 느껴집니다."
    ]
  },
  {
    "id": "tlj-bread-5569",
    "name": "뚜레쥬르 한 입 햄치즈 패스트리(4개입)",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "파이/패스트리",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-8-19_event(2).jpg",
    "releaseDate": "뚜레쥬르 신제품",
    "price": 3500,
    "overallRating": 4.6,
    "ratingCount": 201,
    "searchInfluxCount": 27779,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 91,
    "calories": 385,
    "volume": "89g",
    "isToday": false,
    "isHot": true,
    "detailedRating": {
      "taste": 4.7,
      "value": 4.9,
      "portion": 4.6,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 385,
      "sodium": "650mg (33%)",
      "sugar": "7g (7%)",
      "protein": "11g (20%)",
      "satFat": "14g (93%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 한 입 햄치즈 패스트리(4개입) 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "돼지고기",
      "아황산류"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 12,
        "price": 3500,
        "eventBadge": "신제품",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5569"
      }
    ],
    "description": "짭조름한 햄과 치즈가 돌돌 말린 한 입에 쏙! 먹기 좋은 바삭한 패스트리",
    "bestQuotes": [
      "한 입 베어물면 바사삭 부서지는 결이 예술이고 버터 향이 진합니다.",
      "에어프라이어에 3분 돌려먹으면 갓 구운 빵집 퀄리티 그대로 느껴집니다."
    ]
  },
  {
    "id": "tlj-bread-5570",
    "name": "뚜레쥬르 한 입 햄치즈 패스트리(1개입)",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "파이/패스트리",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-8-19_event(5).jpg",
    "releaseDate": "뚜레쥬르 신제품",
    "price": 3500,
    "overallRating": 4.3,
    "ratingCount": 422,
    "searchInfluxCount": 27999,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 96,
    "calories": 95,
    "volume": "22g",
    "isToday": false,
    "isHot": true,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.5,
      "portion": 4.6,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 95,
      "sodium": "160mg (8%)",
      "sugar": "2g (2%)",
      "protein": "3g (5%)",
      "satFat": "3.4g (23%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 한 입 햄치즈 패스트리(1개입) 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "돼지고기",
      "아황산류"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 13,
        "price": 3500,
        "eventBadge": "신제품",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5570"
      }
    ],
    "description": "짭조름한 햄과 치즈가 돌돌 말린 한 입에 쏙! 먹기 좋은 바삭한 패스트리",
    "bestQuotes": [
      "한 입 베어물면 바사삭 부서지는 결이 예술이고 버터 향이 진합니다.",
      "에어프라이어에 3분 돌려먹으면 갓 구운 빵집 퀄리티 그대로 느껴집니다."
    ]
  },
  {
    "id": "tlj-bread-5476",
    "name": "뚜레쥬르 초코 시나몬 데니쉬 롤",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "파이/패스트리",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-2-19_event(8).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3400,
    "overallRating": 4.3,
    "ratingCount": 474,
    "searchInfluxCount": 27717,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 91,
    "calories": 595,
    "volume": "145g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.4,
      "portion": 4.6,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 595,
      "sodium": "460mg (23%)",
      "sugar": "26g (26%)",
      "protein": "10g (18%)",
      "satFat": "21g (140%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 초코 시나몬 데니쉬 롤 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 6,
        "price": 3400,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5476"
      }
    ],
    "description": "부드러운 데니쉬와 시나몬 페이스트, 다크 초콜릿이 어우러져 달콤하게 즐기기 좋은 간식빵",
    "bestQuotes": [
      "한 입 베어물면 바사삭 부서지는 결이 예술이고 버터 향이 진합니다.",
      "에어프라이어에 3분 돌려먹으면 갓 구운 빵집 퀄리티 그대로 느껴집니다."
    ]
  },
  {
    "id": "tlj-bread-5439",
    "name": "뚜레쥬르 딸기 피스타치오 패스트리",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "파이/패스트리",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2025-12-29_event(8).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3500,
    "overallRating": 4.6,
    "ratingCount": 331,
    "searchInfluxCount": 26941,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 96,
    "calories": 320,
    "volume": "96g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 4.9,
      "portion": 4.5,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 320,
      "sodium": "330mg (17%)",
      "sugar": "17g (17%)",
      "protein": "6g (11%)",
      "satFat": "10g (67%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 딸기 피스타치오 패스트리 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "땅콩",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 7,
        "price": 3500,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5439"
      }
    ],
    "description": "상큼한 딸기잼과 고소한 피스타치오 크림이 어우러진 바삭한 패스트리",
    "bestQuotes": [
      "한 입 베어물면 바사삭 부서지는 결이 예술이고 버터 향이 진합니다.",
      "에어프라이어에 3분 돌려먹으면 갓 구운 빵집 퀄리티 그대로 느껴집니다."
    ]
  },
  {
    "id": "tlj-bread-3557",
    "name": "뚜레쥬르 오리지널 크라상",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "파이/패스트리",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2024-9-30_event(29).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3400,
    "overallRating": 4.8,
    "ratingCount": 94,
    "searchInfluxCount": 25686,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 91,
    "calories": 255,
    "volume": "58g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.5,
      "portion": 4.7,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 255,
      "sodium": "240mg (12%)",
      "sugar": "8g (8%)",
      "protein": "4g (7%)",
      "satFat": "9g (60%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 오리지널 크라상 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "밀",
      "아황산류"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 8,
        "price": 3400,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=3557"
      }
    ],
    "description": "고소한 버터 풍미가 진하고 바삭한 패스트리의 결이 살아있는 크라상",
    "bestQuotes": [
      "한 입 베어물면 바사삭 부서지는 결이 예술이고 버터 향이 진합니다.",
      "에어프라이어에 3분 돌려먹으면 갓 구운 빵집 퀄리티 그대로 느껴집니다."
    ]
  },
  {
    "id": "tlj-bread-3566",
    "name": "뚜레쥬르 오리지널 생크림 크라상",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "파이/패스트리",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2018-7-26_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3400,
    "overallRating": 4.9,
    "ratingCount": 353,
    "searchInfluxCount": 23977,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 96,
    "calories": 335,
    "volume": "78g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.4,
      "portion": 4.5,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 335,
      "sodium": "230mg (12%)",
      "sugar": "9g (9%)",
      "protein": "5g (9%)",
      "satFat": "14g (93%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 오리지널 생크림 크라상 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "아황산류"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 9,
        "price": 3400,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=3566"
      }
    ],
    "description": "고소하고 바삭한 크라상에 달콤한 생크림을 샌드한 제품",
    "bestQuotes": [
      "한 입 베어물면 바사삭 부서지는 결이 예술이고 버터 향이 진합니다.",
      "에어프라이어에 3분 돌려먹으면 갓 구운 빵집 퀄리티 그대로 느껴집니다."
    ]
  },
  {
    "id": "tlj-bread-3559",
    "name": "뚜레쥬르 아몬드 크라상",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "파이/패스트리",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2018-6-12_event(20).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3400,
    "overallRating": 4.7,
    "ratingCount": 477,
    "searchInfluxCount": 21848,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 91,
    "calories": 520,
    "volume": "118g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.9,
      "portion": 4.7,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 520,
      "sodium": "330mg (17%)",
      "sugar": "25g",
      "protein": "9g (16%)",
      "satFat": "14g (93%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 아몬드 크라상 고유 배합",
    "allergens": [
      "밀",
      "우유",
      "계란"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 10,
        "price": 3400,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=3559"
      }
    ],
    "description": "바삭하고 버터의 풍미가 좋은 크라상 속에 고소한 아몬드 크림이 샌드되어 달콤함을 더하는 커피와 잘 어울리는 제품",
    "bestQuotes": [
      "한 입 베어물면 바사삭 부서지는 결이 예술이고 버터 향이 진합니다.",
      "에어프라이어에 3분 돌려먹으면 갓 구운 빵집 퀄리티 그대로 느껴집니다."
    ]
  },
  {
    "id": "tlj-bread-3798",
    "name": "뚜레쥬르 카라멜 러스크",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "파이/패스트리",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2019-4-2_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3400,
    "overallRating": 4.4,
    "ratingCount": 406,
    "searchInfluxCount": 19341,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 96,
    "calories": 300,
    "volume": "78g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.6,
      "portion": 4.4,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 300,
      "sodium": "180mg (9%)",
      "sugar": "13g (13%)",
      "protein": "4g (7%)",
      "satFat": "12g (80%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 카라멜 러스크 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "아황산류"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 11,
        "price": 3400,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=3798"
      }
    ],
    "description": "깊고 진한 버터의 풍미와 카라멜라이징한 생크림 소스와 설탕의 달달함이 어우러지는 제품",
    "bestQuotes": [
      "한 입 베어물면 바사삭 부서지는 결이 예술이고 버터 향이 진합니다.",
      "에어프라이어에 3분 돌려먹으면 갓 구운 빵집 퀄리티 그대로 느껴집니다."
    ]
  },
  {
    "id": "tlj-bread-1478",
    "name": "뚜레쥬르 크림코르네",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "파이/패스트리",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2020-3-20_event.jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3400,
    "overallRating": 4.3,
    "ratingCount": 174,
    "searchInfluxCount": 16508,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 91,
    "calories": 145,
    "volume": "54g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.3,
      "portion": 4.8,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 145,
      "sodium": "130mg (7%)",
      "sugar": "7g (7%)",
      "protein": "2g (4%)",
      "satFat": "6g (40%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 크림코르네 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 12,
        "price": 3400,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=1478"
      }
    ],
    "description": "바삭하고 달콤한 패스트리 속 슈크림을 듬뿍 넣은 제품",
    "bestQuotes": [
      "한 입 베어물면 바사삭 부서지는 결이 예술이고 버터 향이 진합니다.",
      "에어프라이어에 3분 돌려먹으면 갓 구운 빵집 퀄리티 그대로 느껴집니다."
    ]
  },
  {
    "id": "tlj-bread-4189",
    "name": "뚜레쥬르 겹겹이 데니쉬",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "파이/패스트리",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2020-6-24_event(9).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3400,
    "overallRating": 4.5,
    "ratingCount": 263,
    "searchInfluxCount": 13404,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 96,
    "calories": 740,
    "volume": "187g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.8,
      "portion": 4.4,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 740,
      "sodium": "630mg (32%)",
      "sugar": "19g (19%)",
      "protein": "13g (24%)",
      "satFat": "30g (200%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 겹겹이 데니쉬 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "아황산류"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 13,
        "price": 3400,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4189"
      }
    ],
    "description": "겹겹이 결이 살아있는 데니쉬에 설탕을 뿌려 구워내 달콤하게 즐길 수 있는 간식용 빵",
    "bestQuotes": [
      "한 입 베어물면 바사삭 부서지는 결이 예술이고 버터 향이 진합니다.",
      "에어프라이어에 3분 돌려먹으면 갓 구운 빵집 퀄리티 그대로 느껴집니다."
    ]
  },
  {
    "id": "tlj-bread-4188",
    "name": "뚜레쥬르 겹겹이 연유크림 데니쉬",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "파이/패스트리",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2020-6-24_event(6).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3400,
    "overallRating": 4.8,
    "ratingCount": 452,
    "searchInfluxCount": 10092,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 91,
    "calories": 975,
    "volume": "228g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.7,
      "portion": 4.8,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 975,
      "sodium": "690mg (35%)",
      "sugar": "36g (36%)",
      "protein": "13g (24%)",
      "satFat": "41g (273%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 겹겹이 연유크림 데니쉬 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "아황산류"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 6,
        "price": 3400,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4188"
      }
    ],
    "description": "겹겹이 결이 살아있는 데니쉬에 달콤한 연유크림을 듬뿍 샌드한 간식용 빵",
    "bestQuotes": [
      "한 입 베어물면 바사삭 부서지는 결이 예술이고 버터 향이 진합니다.",
      "에어프라이어에 3분 돌려먹으면 갓 구운 빵집 퀄리티 그대로 느껴집니다."
    ]
  },
  {
    "id": "tlj-bread-5096",
    "name": "뚜레쥬르 한 장씩 뜯어먹는 32겹 브레드",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "파이/패스트리",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2024-8-8_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3400,
    "overallRating": 4.9,
    "ratingCount": 456,
    "searchInfluxCount": 6638,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 96,
    "calories": 820,
    "volume": "176g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 4.3,
      "portion": 4.4,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 820,
      "sodium": "700mg (35%)",
      "sugar": "19g (19%)",
      "protein": "15g (27%)",
      "satFat": "30g (200%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 한 장씩 뜯어먹는 32겹 브레드 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "아황산류"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 7,
        "price": 3400,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5096"
      }
    ],
    "description": "프랑스산 버터가 겹겹이 녹아 퍼지는 풍미! 티슈처럼 한 장, 한 장 뜯어지는 재미를 더한 달콤한 패스트리",
    "bestQuotes": [
      "한 입 베어물면 바사삭 부서지는 결이 예술이고 버터 향이 진합니다.",
      "에어프라이어에 3분 돌려먹으면 갓 구운 빵집 퀄리티 그대로 느껴집니다."
    ]
  },
  {
    "id": "tlj-bread-4081",
    "name": "뚜레쥬르 몽블랑의 정석",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "파이/패스트리",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2020-1-31_event(3).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4800,
    "overallRating": 4.7,
    "ratingCount": 276,
    "searchInfluxCount": 3111,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 91,
    "calories": 885,
    "volume": "244g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.8,
      "portion": 4.8,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 885,
      "sodium": "890mg (45%)",
      "sugar": "39g (39%)",
      "protein": "18g (33%)",
      "satFat": "33g (220%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 몽블랑의 정석 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "밀",
      "아황산류"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 8,
        "price": 4800,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4081"
      }
    ],
    "description": "돌돌 말린 패스트리에 달콤한 시럽을 뿌려 촉촉한 식감과 풍미를 살리고 우박설탕을 더하여 마지막까지 맛있게 드실 수 있는 몽블랑",
    "bestQuotes": [
      "한 입 베어물면 바사삭 부서지는 결이 예술이고 버터 향이 진합니다.",
      "에어프라이어에 3분 돌려먹으면 갓 구운 빵집 퀄리티 그대로 느껴집니다."
    ]
  },
  {
    "id": "tlj-bread-3778",
    "name": "뚜레쥬르 바통쉬크레",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "파이/패스트리",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2019-2-18_event(11).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3400,
    "overallRating": 4.5,
    "ratingCount": 160,
    "searchInfluxCount": 6417,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 96,
    "calories": 600,
    "volume": "130g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.8,
      "portion": 4.4,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 600,
      "sodium": "400mg (20%)",
      "sugar": "29g (29%)",
      "protein": "10g (18%)",
      "satFat": "18g (120%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 바통쉬크레 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 9,
        "price": 3400,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=3778"
      }
    ],
    "description": "프랑스산 버터를 사용하여 풍미가 진하고 바삭한 패스트리에 달콤한 설탕을 토핑해 구워낸 스틱형 제품",
    "bestQuotes": [
      "한 입 베어물면 바사삭 부서지는 결이 예술이고 버터 향이 진합니다.",
      "에어프라이어에 3분 돌려먹으면 갓 구운 빵집 퀄리티 그대로 느껴집니다."
    ]
  },
  {
    "id": "tlj-bread-3776",
    "name": "뚜레쥬르 황금 파이만주",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "파이/패스트리",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2019-2-18_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3500,
    "overallRating": 4.3,
    "ratingCount": 398,
    "searchInfluxCount": 9878,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 91,
    "calories": 230,
    "volume": "58g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 4.3,
      "portion": 4.8,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 230,
      "sodium": "150mg (8%)",
      "sugar": "13g (13%)",
      "protein": "4g (7%)",
      "satFat": "8g (53%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 황금 파이만주 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 10,
        "price": 3500,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=3776"
      }
    ],
    "description": "먹는 순간 진한 버터의 풍미가 입안에 퍼지고, 씹을수록 앙금의 달콤함과 버터의 풍미가 전해지는 황금색 파이만주",
    "bestQuotes": [
      "한 입 베어물면 바사삭 부서지는 결이 예술이고 버터 향이 진합니다.",
      "에어프라이어에 3분 돌려먹으면 갓 구운 빵집 퀄리티 그대로 느껴집니다."
    ]
  },
  {
    "id": "tlj-bread-3257",
    "name": "뚜레쥬르 새콤달콤 유자파이",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "파이/패스트리",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2024-9-30_event(18).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3500,
    "overallRating": 4.4,
    "ratingCount": 479,
    "searchInfluxCount": 13201,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 96,
    "calories": 390,
    "volume": "107g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.7,
      "portion": 4.4,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 390,
      "sodium": "350mg (18%)",
      "sugar": "18g (18%)",
      "protein": "6g (11%)",
      "satFat": "17g (113%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 새콤달콤 유자파이 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 11,
        "price": 3500,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=3257"
      }
    ],
    "description": "바삭바삭한 파이 안에 유자크림이 들어가 더욱 상큼한 패스트리",
    "bestQuotes": [
      "한 입 베어물면 바사삭 부서지는 결이 예술이고 버터 향이 진합니다.",
      "에어프라이어에 3분 돌려먹으면 갓 구운 빵집 퀄리티 그대로 느껴집니다."
    ]
  },
  {
    "id": "tlj-bread-4891",
    "name": "뚜레쥬르 카라멜 애플파이",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "파이/패스트리",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2023-8-28_event(5).png",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 4800,
    "overallRating": 4.7,
    "ratingCount": 363,
    "searchInfluxCount": 16320,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 91,
    "calories": 325,
    "volume": "94g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.8,
      "portion": 4.8,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 325,
      "sodium": "230mg (12%)",
      "sugar": "14g (14%)",
      "protein": "4g (7%)",
      "satFat": "10g (67%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 카라멜 애플파이 고유 배합",
    "allergens": [
      "밀",
      "우유",
      "아황산류"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 12,
        "price": 4800,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4891"
      }
    ],
    "description": "바삭한 파이 속 달콤한 카라멜과 시나몬 풍미가 풍부한 사과 필링이 듬뿍 들어있는 제품",
    "bestQuotes": [
      "한 입 베어물면 바사삭 부서지는 결이 예술이고 버터 향이 진합니다.",
      "에어프라이어에 3분 돌려먹으면 갓 구운 빵집 퀄리티 그대로 느껴집니다."
    ]
  },
  {
    "id": "tlj-bread-3573",
    "name": "뚜레쥬르 핫도그 패스트리",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "파이/패스트리",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2018-8-16_event(11).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3500,
    "overallRating": 4.9,
    "ratingCount": 108,
    "searchInfluxCount": 19172,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 96,
    "calories": 405,
    "volume": "121g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.3,
      "portion": 4.4,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 405,
      "sodium": "750mg (38%)",
      "sugar": "9g (9%)",
      "protein": "13g (24%)",
      "satFat": "14g (93%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 핫도그 패스트리 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "토마토"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 13,
        "price": 3500,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=3573"
      }
    ],
    "description": "육즙이 살아있는 짭조름한 그릴후랑크를 바삭한 패스트리에 통째로 올린 제품",
    "bestQuotes": [
      "한 입 베어물면 바사삭 부서지는 결이 예술이고 버터 향이 진합니다.",
      "에어프라이어에 3분 돌려먹으면 갓 구운 빵집 퀄리티 그대로 느껴집니다."
    ]
  },
  {
    "id": "tlj-bread-5430",
    "name": "뚜레쥬르 초코뺑스위스",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "파이/패스트리",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2025-12-8_event(8).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 3400,
    "overallRating": 4.8,
    "ratingCount": 320,
    "searchInfluxCount": 21700,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 91,
    "calories": 500,
    "volume": "126g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.6,
      "portion": 4.7,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 500,
      "sodium": "480mg (24%)",
      "sugar": "16g (16%)",
      "protein": "9g (16%)",
      "satFat": "20g (133%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 초코뺑스위스 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "아황산류"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 6,
        "price": 3400,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5430"
      }
    ],
    "description": "바삭한 결의 패스트리 속 달콤한 커스터드와 초코칩을 더하고 초콜릿 토핑으로 더욱 달콤하게 즐길 수 있는 제품",
    "bestQuotes": [
      "한 입 베어물면 바사삭 부서지는 결이 예술이고 버터 향이 진합니다.",
      "에어프라이어에 3분 돌려먹으면 갓 구운 빵집 퀄리티 그대로 느껴집니다."
    ]
  },
  {
    "id": "tlj-bread-5537",
    "name": "뚜레쥬르 올디스 타코 고로케",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "도넛/고로케",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2026-6-9_event(8).jpg",
    "releaseDate": "뚜레쥬르 신제품",
    "price": 2900,
    "overallRating": 4.5,
    "ratingCount": 471,
    "searchInfluxCount": 23855,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 95,
    "calories": 480,
    "volume": "106g",
    "isToday": false,
    "isHot": true,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.9,
      "portion": 4.5,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 480,
      "sodium": "590mg (30%)",
      "sugar": "7g (7%)",
      "protein": "10g (18%)",
      "satFat": "6g (40%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 올디스 타코 고로케 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "돼지고기",
      "토마토",
      "쇠고기"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 7,
        "price": 2900,
        "eventBadge": "신제품",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5537"
      }
    ],
    "description": "타코 스타일의 고기 내용물에 산뜻한 랜치 소스를 더하고, 겉면에 바삭한 나초칩 토핑으로 맛과 식감을 살린 고로케",
    "bestQuotes": [
      "기름지지 않고 속재료가 꽉 차 있어서 든든한 간식으로 딱이에요.",
      "겉바속쫀 식감에 추억의 맛이 그대로 살아있어 자꾸 생각납니다."
    ]
  },
  {
    "id": "tlj-bread-5239",
    "name": "뚜레쥬르 쫄깃한 찹쌀도넛",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "도넛/고로케",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2025-2-20_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2400,
    "overallRating": 4.3,
    "ratingCount": 429,
    "searchInfluxCount": 25591,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 92,
    "calories": 245,
    "volume": "77g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 4.4,
      "portion": 4.7,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 245,
      "sodium": "300mg (15%)",
      "sugar": "18g (18%)",
      "protein": "4g (7%)",
      "satFat": "1.8g (12%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 쫄깃한 찹쌀도넛 고유 배합",
    "allergens": [
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 8,
        "price": 2400,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5239"
      }
    ],
    "description": "국내산 쌀로 만든 쌀 탕종으로 더 부드럽고 쫄깃해진 도넛 속 씹을수록 고소하고 달콤한 팥 앙금이 가득!",
    "bestQuotes": [
      "기름지지 않고 속재료가 꽉 차 있어서 든든한 간식으로 딱이에요.",
      "겉바속쫀 식감에 추억의 맛이 그대로 살아있어 자꾸 생각납니다."
    ]
  },
  {
    "id": "tlj-bread-5248",
    "name": "뚜레쥬르 조청 왕꽈배기",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "도넛/고로케",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2025-3-26_event(8).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2400,
    "overallRating": 4.4,
    "ratingCount": 215,
    "searchInfluxCount": 26876,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 95,
    "calories": 445,
    "volume": "120g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.5,
      "portion": 4.5,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 445,
      "sodium": "400mg (20%)",
      "sugar": "20g (20%)",
      "protein": "7g (13%)",
      "satFat": "5g (33%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 조청 왕꽈배기 고유 배합",
    "allergens": [
      "계란",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 9,
        "price": 2400,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5248"
      }
    ],
    "description": "우리쌀을 더해 더 쫄깃하고, 조청으로 은은한 단맛과 쌀크런치 토핑으로 씹는 재미까지 더한 추억의 왕꽈배기 *본 제품에 들어간 가루쌀은 물에 불리지 않고 빻을 수 있는 국산 쌀 품종으로 농가와 상생하는 착한 원료입니다.",
    "bestQuotes": [
      "기름지지 않고 속재료가 꽉 차 있어서 든든한 간식으로 딱이에요.",
      "겉바속쫀 식감에 추억의 맛이 그대로 살아있어 자꾸 생각납니다."
    ]
  },
  {
    "id": "tlj-bread-5238",
    "name": "뚜레쥬르 더 쫄깃해진 그때 그 도나쓰(5개입)",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "도넛/고로케",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2025-6-10_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2600,
    "overallRating": 4.6,
    "ratingCount": 225,
    "searchInfluxCount": 27683,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 92,
    "calories": 385,
    "volume": "131g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 4.9,
      "portion": 4.6,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 385,
      "sodium": "710mg (36%)",
      "sugar": "21g (21%)",
      "protein": "6g (11%)",
      "satFat": "3.3g (22%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 더 쫄깃해진 그때 그 도나쓰(5개입) 고유 배합",
    "allergens": [
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 10,
        "price": 2600,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=5238"
      }
    ],
    "description": "국내산 쌀로 만든 쌀 탕종으로 더 부드럽고 쫄깃해진, 어릴 적 먹던 한입 쏙 미니 찹쌀 도나쓰",
    "bestQuotes": [
      "기름지지 않고 속재료가 꽉 차 있어서 든든한 간식으로 딱이에요.",
      "겉바속쫀 식감에 추억의 맛이 그대로 살아있어 자꾸 생각납니다."
    ]
  },
  {
    "id": "tlj-bread-3878",
    "name": "뚜레쥬르 NEW 정통 고로케",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "도넛/고로케",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2023-5-18_event(5).png",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2900,
    "overallRating": 4.9,
    "ratingCount": 434,
    "searchInfluxCount": 27996,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 95,
    "calories": 350,
    "volume": "117g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.4,
      "portion": 4.6,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 350,
      "sodium": "470mg (24%)",
      "sugar": "5g (5%)",
      "protein": "9g (16%)",
      "satFat": "4g (27%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, NEW 정통 고로케 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 11,
        "price": 2900,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=3878"
      }
    ],
    "description": "바삭바삭하게 잘 튀겨진 빵 속에 다진 돼지고기와 표고버섯, 당근, 부추, 당면 등이 듬뿍 들어있는 오리지널 고로케",
    "bestQuotes": [
      "기름지지 않고 속재료가 꽉 차 있어서 든든한 간식으로 딱이에요.",
      "겉바속쫀 식감에 추억의 맛이 그대로 살아있어 자꾸 생각납니다."
    ]
  },
  {
    "id": "tlj-bread-4171",
    "name": "뚜레쥬르 옛날 꽈배기 도넛",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "도넛/고로케",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2024-9-30_event(6).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2400,
    "overallRating": 4.9,
    "ratingCount": 469,
    "searchInfluxCount": 27808,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 92,
    "calories": 240,
    "volume": "59g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.5,
      "value": 4.4,
      "portion": 4.6,
      "repurchase": 4.6
    },
    "nutrition": {
      "calories": 240,
      "sodium": "200mg (10%)",
      "sugar": "7g (7%)",
      "protein": "4g (7%)",
      "satFat": "4g (27%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 옛날 꽈배기 도넛 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 12,
        "price": 2400,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4171"
      }
    ],
    "description": "부드럽고 폭신한 식감의 달콤한 추억의 꽈배기",
    "bestQuotes": [
      "기름지지 않고 속재료가 꽉 차 있어서 든든한 간식으로 딱이에요.",
      "겉바속쫀 식감에 추억의 맛이 그대로 살아있어 자꾸 생각납니다."
    ]
  },
  {
    "id": "tlj-bread-4172",
    "name": "뚜레쥬르 옛날 단팥 도넛",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "도넛/고로케",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2024-9-30_event(9).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2400,
    "overallRating": 4.6,
    "ratingCount": 312,
    "searchInfluxCount": 27124,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 95,
    "calories": 345,
    "volume": "101g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 4.9,
      "portion": 4.7,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 345,
      "sodium": "250mg (13%)",
      "sugar": "22g (22%)",
      "protein": "6g (11%)",
      "satFat": "4g (27%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 옛날 단팥 도넛 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 13,
        "price": 2400,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=4172"
      }
    ],
    "description": "부드럽고 폭신한 도넛 속 단팥 앙금이 듬뿍 들어있는 달콤한 추억의 도넛",
    "bestQuotes": [
      "기름지지 않고 속재료가 꽉 차 있어서 든든한 간식으로 딱이에요.",
      "겉바속쫀 식감에 추억의 맛이 그대로 살아있어 자꾸 생각납니다."
    ]
  },
  {
    "id": "tlj-bread-848",
    "name": "뚜레쥬르 슈거 글레이즈 도넛",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "도넛/고로케",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2014-6-19_event(9).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2400,
    "overallRating": 4.4,
    "ratingCount": 118,
    "searchInfluxCount": 25957,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 92,
    "calories": 185,
    "volume": "50g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.5,
      "portion": 4.5,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 185,
      "sodium": "105mg (5%)",
      "sugar": "10g (10%)",
      "protein": "4g (7%)",
      "satFat": "2.9g (19%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 슈거 글레이즈 도넛 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 6,
        "price": 2400,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=848"
      }
    ],
    "description": "부드러운 도넛에 달콤한 슈거글레이즈를 디핑한 제품",
    "bestQuotes": [
      "기름지지 않고 속재료가 꽉 차 있어서 든든한 간식으로 딱이에요.",
      "겉바속쫀 식감에 추억의 맛이 그대로 살아있어 자꾸 생각납니다."
    ]
  },
  {
    "id": "tlj-bread-2692",
    "name": "뚜레쥬르 딸기 마카롱 도넛",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "도넛/고로케",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2016-1-8_event(5).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2400,
    "overallRating": 4.3,
    "ratingCount": 370,
    "searchInfluxCount": 24330,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 95,
    "calories": 225,
    "volume": "52g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.4,
      "portion": 4.7,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 225,
      "sodium": "160mg (8%)",
      "sugar": "3g (3%)",
      "protein": "4g (7%)",
      "satFat": "7g (47%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 딸기 마카롱 도넛 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 7,
        "price": 2400,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=2692"
      }
    ],
    "description": "화이트초코에 딸기마카롱 후레이크를 듬뿍 얹은 달콤한 도넛",
    "bestQuotes": [
      "기름지지 않고 속재료가 꽉 차 있어서 든든한 간식으로 딱이에요.",
      "겉바속쫀 식감에 추억의 맛이 그대로 살아있어 자꾸 생각납니다."
    ]
  },
  {
    "id": "tlj-bread-2691",
    "name": "뚜레쥬르 초코 마카롱 도넛",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "도넛/고로케",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2016-1-8_event(2).jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2400,
    "overallRating": 4.5,
    "ratingCount": 479,
    "searchInfluxCount": 22277,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 92,
    "calories": 215,
    "volume": "52g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.9,
      "portion": 4.5,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 215,
      "sodium": "170mg (9%)",
      "sugar": "3g (3%)",
      "protein": "4g (7%)",
      "satFat": "6g (40%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 초코 마카롱 도넛 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 8,
        "price": 2400,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=2691"
      }
    ],
    "description": "초콜릿과 초코마카롱 후레이크를 듬뿍 얹은 달콤한 도넛",
    "bestQuotes": [
      "기름지지 않고 속재료가 꽉 차 있어서 든든한 간식으로 딱이에요.",
      "겉바속쫀 식감에 추억의 맛이 그대로 살아있어 자꾸 생각납니다."
    ]
  },
  {
    "id": "tlj-bread-3879",
    "name": "뚜레쥬르 NEW 김치 고로케",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "도넛/고로케",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2023-8-30_event(2).png",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2900,
    "overallRating": 4.8,
    "ratingCount": 391,
    "searchInfluxCount": 19838,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 95,
    "calories": 320,
    "volume": "120g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 4.6,
      "portion": 4.7,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 320,
      "sodium": "510mg (26%)",
      "sugar": "5g (5%)",
      "protein": "7g (13%)",
      "satFat": "4.2g (28%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, NEW 김치 고로케 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "토마토"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 9,
        "price": 2900,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=3879"
      }
    ],
    "description": "바삭바삭하게 잘 튀겨진 빵 속에 매콤 아삭한 김치와 깍두기, 당면이 듬뿍 들어있어 먹으면 먹을수록 끌리는 김치 고로케",
    "bestQuotes": [
      "기름지지 않고 속재료가 꽉 차 있어서 든든한 간식으로 딱이에요.",
      "겉바속쫀 식감에 추억의 맛이 그대로 살아있어 자꾸 생각납니다."
    ]
  },
  {
    "id": "tlj-bread-1807",
    "name": "뚜레쥬르 추억의 사라다 고로케",
    "brand": "뚜레쥬르",
    "category": "빵·디저트",
    "subCategory": "도넛/고로케",
    "itemType": "restaurant",
    "image": "https://www.tlj.co.kr/data/product/2013-4-30_event.jpg",
    "releaseDate": "뚜레쥬르 베이커리",
    "price": 2900,
    "overallRating": 4.9,
    "ratingCount": 150,
    "searchInfluxCount": 17061,
    "stores": [
      "뚜레쥬르"
    ],
    "repurchasePercent": 92,
    "calories": 385,
    "volume": "130g",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 4.3,
      "portion": 4.4,
      "repurchase": 4.5
    },
    "nutrition": {
      "calories": 385,
      "sodium": "420mg (21%)",
      "sugar": "6g (6%)",
      "protein": "6g (11%)",
      "satFat": "6g (40%)"
    },
    "ingredients": "밀가루, 효모, 정제소금, 가공버터, 추억의 사라다 고로케 고유 배합",
    "allergens": [
      "계란",
      "우유",
      "대두",
      "밀",
      "토마토"
    ],
    "origin": "CJ푸드빌 뚜레쥬르 직영 및 가맹점 매일 생산",
    "manufacturer": "CJ푸드빌(주) 뚜레쥬르",
    "storageMethod": "직사광선을 피하고 서늘한 실온 보관 (구매 후 당일 섭취 권장)",
    "shelfLife": "제조일로부터 1~2일",
    "precautions": "개봉 후 가급적 당일 드시기 바라며, 남은 빵은 밀봉하여 냉동 보관하세요.",
    "storeStocks": [
      {
        "store": "뚜레쥬르",
        "status": "입고완료",
        "stockCount": 10,
        "price": 2900,
        "eventBadge": "인기베이커리",
        "deliveryTime": "매장 즉시 픽업",
        "appLink": "https://www.tlj.co.kr:7008/product/detail.asp?ref=2&prod_num=1807"
      }
    ],
    "description": "바삭한 고로케 속에 아삭아삭 맛있는 야채 사라다가 듬뿍 들어간 든든한 식사 대용 제품",
    "bestQuotes": [
      "기름지지 않고 속재료가 꽉 차 있어서 든든한 간식으로 딱이에요.",
      "겉바속쫀 식감에 추억의 맛이 그대로 살아있어 자꾸 생각납니다."
    ]
  }
];
