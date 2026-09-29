import { Product } from '../types';

/**
 * 메가MGC커피 공식 웹사이트 전체 음료 메뉴 데이터 (총 159종)
 * 출처: https://www.mega-mgccoffee.com/menu/?menu_category1=1&menu_category2=1
 */
export const MEGA_COFFEE_BEVERAGES: Product[] = [
  {
    "id": "mega-coffee-001",
    "name": "[ICE] 하우스밀크 라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20260902203101_1788348661533_weMnhAbV2Q.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.5,
    "ratingCount": 120,
    "searchInfluxCount": 5000,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 90,
    "calories": 328,
    "volume": "591ml",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 328,
      "sodium": "180mg",
      "sugar": "15g",
      "satFat": "19.8g",
      "saturatedFat": "19.8g",
      "protein": "6g"
    },
    "ingredients": "영문명: House Milk Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "신메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "메가MGC커피만의 하우스밀크로 고소하고 부드러운 맛과 은은한 단맛은 더하고 깊은 풍미의 에스프레소 샷을 블렌딩해 더욱 조화로운 밸런스를 완성한 카페라떼"
  },
  {
    "id": "mega-coffee-002",
    "name": "[ICE] 무카페인 오르조라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20260902203238_1788348758239_bicMYSpckp.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.6,
    "ratingCount": 137,
    "searchInfluxCount": 5311,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 91,
    "calories": 238,
    "volume": "591ml",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 238,
      "sodium": "93mg",
      "sugar": "21g",
      "satFat": "4g",
      "saturatedFat": "4g",
      "protein": "8g"
    },
    "ingredients": "영문명: Caffeine-Free Orzo Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "신메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "이탈리아산 크라스탄 오르조와 고소하고 부드러운 우유가 만나 카페라떼 그대로의 깊은 풍미를 부담없이 무카페인으로 즐길 수 있는 라떼"
  },
  {
    "id": "mega-coffee-003",
    "name": "[ICE] 저당 골든애플 블랙티",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20260916234952_1789570192916_xCpTUY41pJ.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2500,
    "overallRating": 4.7,
    "ratingCount": 154,
    "searchInfluxCount": 5622,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 92,
    "calories": 123.4,
    "volume": "710ml",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 123.4,
      "sodium": "8.6mg",
      "sugar": "13.2g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "0.6g"
    },
    "ingredients": "영문명: Low-Sugar Golden Apple Black Tea",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2500,
        "eventBadge": "신메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "저당으로 부담없는 달콤상큼한 사과와 깊고 깔끔한 블랙티의 조화로 더욱 풍부하고 산뜻하게 즐길 수 있는 티플레져 *대체당(알룰로스)을 과도하게 섭취 시 개인에 따라 복통 및 설사 등을 유발 할 수 있으니 주의하세요."
  },
  {
    "id": "mega-coffee-004",
    "name": "[ICE] 자몽 톡톡 스무디",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "스무디&프라페",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20260429173124_1777451484221_DbGYiTq_EF.png",
    "releaseDate": "2026.09 공식",
    "price": 3900,
    "overallRating": 4.8,
    "ratingCount": 171,
    "searchInfluxCount": 5933,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 93,
    "calories": 342.3,
    "volume": "591ml",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 342.3,
      "sodium": "36.2mg",
      "sugar": "70.6g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "0.7g"
    },
    "ingredients": "영문명: Grapefruit Smoothie",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3900,
        "eventBadge": "신메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "톡톡 터지는 자몽 과육을 듬뿍 담아, 자몽 한 알을 그대로 베어 문 듯 상큼함이 입안 가득 퍼지는 자몽 스무디"
  },
  {
    "id": "mega-coffee-005",
    "name": "[ICE] 제로 레몬말차 아이스티",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20260429173244_1777451564019_W1OpjQHJz4.png",
    "releaseDate": "2026.09 공식",
    "price": 2500,
    "overallRating": 4.9,
    "ratingCount": 188,
    "searchInfluxCount": 6244,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 94,
    "calories": 20.2,
    "volume": "710ml",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 20.2,
      "sodium": "203.9mg",
      "sugar": "0.0g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "0.2g"
    },
    "ingredients": "영문명: Zero Lemon Matcha Iced Tea",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2500,
        "eventBadge": "신메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "말차와 레몬의 상큼한 조화에 식이섬유 '알파CD'를 더해 부담 없이 산뜻하고 가볍게 즐기는 제로 칼로리, 제로 슈가 아이스티 *대체당(알룰로스 등)을 과도하게 섭취 시 개인에 따라 복통 및 설사 등을 유발 할 수 있으니 주의하세요."
  },
  {
    "id": "mega-coffee-006",
    "name": "ARIH 듀얼바이오틱 소다 레드 루비 갈로어",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "에이드&주스",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20260604210115_1780574475408_4CvZdY5F9E.png",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.5,
    "ratingCount": 205,
    "searchInfluxCount": 6555,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 95,
    "calories": 20,
    "volume": "355ml",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 20,
      "sodium": "110mg",
      "sugar": "2g",
      "satFat": "0g",
      "saturatedFat": "0g",
      "protein": "0g"
    },
    "ingredients": "영문명: ARIH DUAL BIOTIC SODA RED RUBY",
    "allergens": [
      "우유",
      "대두",
      "복숭아 함유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "신메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "4가지 식물성 바이오틱스와 5가지 포스트바이오틱스를 더한 저당·저칼로리 듀얼 바이오틱 소다 자몽 맛 *대체당(알룰로스 등)을 과도하게 섭취 시 개인에 따라 복통 및 설사 등을 유발 할 수 있으니 주의하세요."
  },
  {
    "id": "mega-coffee-007",
    "name": "ARIH 듀얼바이오틱 소다 포지티브 오렌지",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "에이드&주스",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20260604210526_1780574726295_ldS4q_W8ek.png",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.6,
    "ratingCount": 222,
    "searchInfluxCount": 6866,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 96,
    "calories": 20,
    "volume": "355ml",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 20,
      "sodium": "110mg",
      "sugar": "2g",
      "satFat": "0g",
      "saturatedFat": "0g",
      "protein": "0g"
    },
    "ingredients": "영문명: ARIH DUAL BIOTIC SODA ORANGE",
    "allergens": [
      "우유",
      "대두 함유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "신메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "4가지 식물성 바이오틱스와 5가지 포스트바이오틱스를 더한 저당·저칼로리 듀얼 바이오틱 소다 오렌지 향 *대체당(알룰로스 등)을 과도하게 섭취 시 개인에 따라 복통 및 설사 등을 유발 할 수 있으니 주의하세요."
  },
  {
    "id": "mega-coffee-008",
    "name": "ARIH 듀얼바이오틱 소다 클리어레몬",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "에이드&주스",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20260605000738_1780585658684_eFPxfdhaWp.png",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.7,
    "ratingCount": 239,
    "searchInfluxCount": 7177,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 97,
    "calories": 20,
    "volume": "355ml",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 20,
      "sodium": "130mg",
      "sugar": "2g",
      "satFat": "0g",
      "saturatedFat": "0g",
      "protein": "0g"
    },
    "ingredients": "영문명: ARIH DUAL BIOTIC SODA CLEAR LEMON",
    "allergens": [
      "우유",
      "대두 함유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "신메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "4가지 식물성 바이오틱스와 5가지 포스트바이오틱스를 더한 저당·저칼로리 듀얼 바이오틱 소다 레몬 향 *대체당(알룰로스 등)을 과도하게 섭취 시 개인에 따라 복통 및 설사 등을 유발 할 수 있으니 주의하세요."
  },
  {
    "id": "mega-coffee-009",
    "name": "ARIH 듀얼바이오틱 소다 피치망고 호라이즌",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "에이드&주스",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20260604210410_1780574650849_ge2Rbb2mCd.png",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.8,
    "ratingCount": 256,
    "searchInfluxCount": 7488,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 98,
    "calories": 20,
    "volume": "355ml",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 20,
      "sodium": "70mg",
      "sugar": "2g",
      "satFat": "0g",
      "saturatedFat": "0g",
      "protein": "0g"
    },
    "ingredients": "영문명: ARIH DUAL BIOTIC SODA PEACH & MANGO",
    "allergens": [
      "우유",
      "대두",
      "복숭아 함유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "신메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "4가지 식물성 바이오틱스와 5가지 포스트바이오틱스를 더한 저당·저칼로리 듀얼 바이오틱 소다 복숭아와 달콤한 망고 맛 *대체당(알룰로스 등)을 과도하게 섭취 시 개인에 따라 복통 및 설사 등을 유발 할 수 있으니 주의하세요."
  },
  {
    "id": "mega-coffee-010",
    "name": "ARIH 포스트바이오틱 에너지 드링크 레몬크레스트",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "에이드&주스",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20260604205718_1780574238227_vre8909Ms_.png",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.9,
    "ratingCount": 273,
    "searchInfluxCount": 7799,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 90,
    "calories": 10,
    "volume": "355ml",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 10,
      "sodium": "280mg",
      "sugar": "0g",
      "satFat": "0g",
      "saturatedFat": "0g",
      "protein": "1g"
    },
    "ingredients": "영문명: ARIH POSTBIOTIC ENERGY DRINK LEMON CREST",
    "allergens": [
      "우유",
      "대두 함유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "신메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "자연에서 온 카페인과 포스트바이오틱스를 더한 당류 ZERO, 칼로리 ZERO 에너지 드링크 시트러스 *대체당을 과도하게 섭취 시 개인에 따라 복통 및 설사 등을 유발 할 수 있으니 주의하세요."
  },
  {
    "id": "mega-coffee-011",
    "name": "ARIH 포스트바이오틱 에너지 드링크 오렌지아워",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "에이드&주스",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20260604205615_1780574175202_LHw12vYQ6H.png",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.5,
    "ratingCount": 290,
    "searchInfluxCount": 8110,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 91,
    "calories": 10,
    "volume": "355ml",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 10,
      "sodium": "280mg",
      "sugar": "0g",
      "satFat": "0g",
      "saturatedFat": "0g",
      "protein": "1g"
    },
    "ingredients": "영문명: ARIH POSTBIOTIC ENERGY DRINK ORANGE HOUR",
    "allergens": [
      "우유",
      "대두 함유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "신메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "자연에서 온 카페인과 포스트바이오틱스를 더한 당류 ZERO, 칼로리 ZERO 에너지 드링크 오렌지 *대체당을 과도하게 섭취 시 개인에 따라 복통 및 설사 등을 유발 할 수 있으니 주의하세요."
  },
  {
    "id": "mega-coffee-012",
    "name": "ARIH 포스트바이오틱 에너지 드링크 트로피칼웨이브",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "에이드&주스",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20260605103322_1780623202696_F8N06YR5cD.png",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.6,
    "ratingCount": 307,
    "searchInfluxCount": 8421,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 92,
    "calories": 10,
    "volume": "355ml",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 10,
      "sodium": "280mg",
      "sugar": "0g",
      "satFat": "0g",
      "saturatedFat": "0g",
      "protein": "1g"
    },
    "ingredients": "영문명: ARIH POSTBIOTIC ENERGY DRINK TROPICAL WAVE",
    "allergens": [
      "우유",
      "대두 함유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "신메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "자연에서 온 카페인과 포스트바이오틱스를 더한 당류 ZERO, 칼로리 ZERO 에너지 드링크 리치 *대체당을 과도하게 섭취 시 개인에 따라 복통 및 설사 등을 유발 할 수 있으니 주의하세요."
  },
  {
    "id": "mega-coffee-013",
    "name": "[ICE] 저당 꿀배 XO야쿠르트",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "음료",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20260401192153_1775038913170_2UFRSEFHv0.png",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.7,
    "ratingCount": 324,
    "searchInfluxCount": 8732,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 93,
    "calories": 25.4,
    "volume": "710ml",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 25.4,
      "sodium": "67.8mg",
      "sugar": "1.1g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "3.6g"
    },
    "ingredients": "영문명: XO",
    "allergens": [
      "우유",
      "대두"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "신메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "저당으로 부담은 덜고, 새콤달콤한 맛은 더 풍부하게! 꿀처럼 달콤한 배의 시원하고 깨끗한 단맛에 설탕·당류·지방 3 ZERO 야쿠르트 XO 2병이 들어간 리프레쉬 한 잔 *대체당(알룰로스, 에리스리톨 등)을 과도하게 섭취 시 개인에 따라 복통 및 설사 등을 유발 할 수 있으니 주의하세요."
  },
  {
    "id": "mega-coffee-014",
    "name": "[ICE] 딸기라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20250116001724_1736954244791_8qDsY0gj14.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.8,
    "ratingCount": 341,
    "searchInfluxCount": 9043,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 94,
    "calories": 366.4,
    "volume": "591ml",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 366.4,
      "sodium": "50.0mg",
      "sugar": "47.3g",
      "satFat": "3.0g",
      "saturatedFat": "3.0g",
      "protein": "5.8g"
    },
    "ingredients": "영문명: Strawberry Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "신메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "딸기과육이 풍부히 느껴지는 스테디 셀러 산뜻하고 달콤한 딸기가 가득해 부드러운 우유와 어우러져 더욱 기분 좋게 즐기는 아이스 라떼"
  },
  {
    "id": "mega-coffee-015",
    "name": "[ICE] 밀크쉐이크",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "스무디&프라페",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20251210220621_1765371981583_lnOltIAEKR.png",
    "releaseDate": "2026.09 공식",
    "price": 3900,
    "overallRating": 4.9,
    "ratingCount": 358,
    "searchInfluxCount": 9354,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 95,
    "calories": 401,
    "volume": "591ml",
    "isToday": true,
    "isHot": true,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 401,
      "sodium": "308.2mg",
      "sugar": "62.4g",
      "satFat": "4.1g",
      "saturatedFat": "4.1g",
      "protein": "8.9g"
    },
    "ingredients": "영문명: Milkshake",
    "allergens": [
      "우유",
      "대두"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3900,
        "eventBadge": "신메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "우유 그대로의 부드러움에 달콤함을 더해 꾸덕하고 진~한 풍미를 느낄 수 있는 겨울시즌 한정 밀크쉐이크"
  },
  {
    "id": "mega-coffee-016",
    "name": "[HOT] 유자생강차",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20251106022624_1762363584516_gmIV9uXczk.png",
    "releaseDate": "2026.09 공식",
    "price": 2500,
    "overallRating": 4.5,
    "ratingCount": 375,
    "searchInfluxCount": 9665,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 96,
    "calories": 389.4,
    "volume": "591ml",
    "isToday": false,
    "isHot": true,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 389.4,
      "sodium": "90.7mg",
      "sugar": "88.7g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.2g"
    },
    "ingredients": "영문명: Citron Ginger Tea",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "상큼달콤한 유자청과 은은하게 매콤한 생강의 풍미를 조화롭게 담아낸 겨울 한정 과일 티"
  },
  {
    "id": "mega-coffee-017",
    "name": "[ICE] 초코젤라또 말차라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20251210155814_1765349894904_ps9wkFJ_kA.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.6,
    "ratingCount": 392,
    "searchInfluxCount": 9976,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 97,
    "calories": 326.8,
    "volume": "591ml",
    "isToday": false,
    "isHot": true,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 326.8,
      "sodium": "82.4mg",
      "sugar": "46.8g",
      "satFat": "5.1g",
      "saturatedFat": "5.1g",
      "protein": "10.1g"
    },
    "ingredients": "영문명: Choco-gelato Matcha Tea Latte",
    "allergens": [
      "우유",
      "대두"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "진하고 꾸덕한 초코 젤라또를 제주산 고품질 말차, 쌉싸름한 블렌딩 커피와 함께 즐기는 말차 에스프레소 라떼"
  },
  {
    "id": "mega-coffee-018",
    "name": "[HOT] (HOT)헛개리카노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "음료",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20250320000737_1742396857693_ngpZI3EbLM.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.7,
    "ratingCount": 409,
    "searchInfluxCount": 10287,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 98,
    "calories": 36.1,
    "volume": "591ml",
    "isToday": false,
    "isHot": true,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 36.1,
      "sodium": "11.7mg",
      "sugar": "0.0g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "1.3g"
    },
    "ingredients": "영문명: Oriental Raisin-Tea Americano",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "국내산 헛개수와 메가MGC커피만의 아메리카노를 더해 고소한 맛이 조화로운 블렌딩 커피"
  },
  {
    "id": "mega-coffee-019",
    "name": "[ICE] (ICE)헛개리카노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "음료",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20250320000925_1742396965069_ekSqAIVc1L.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.8,
    "ratingCount": 426,
    "searchInfluxCount": 10598,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 90,
    "calories": 34.7,
    "volume": "710ml",
    "isToday": false,
    "isHot": true,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 34.7,
      "sodium": "8.4mg",
      "sugar": "0.0g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "1.0g"
    },
    "ingredients": "영문명: Oriental Raisin-Tea Americano",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "국내산 헛개수와 메가MGC커피만의 아메리카노를 더해 고소한 맛이 조화로운 블렌딩 커피"
  },
  {
    "id": "mega-coffee-020",
    "name": "[ICE] 제로 부스트 에이드",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "에이드&주스",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20250320002931_1742398171188_QX5SewCVs4.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.9,
    "ratingCount": 443,
    "searchInfluxCount": 10909,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 91,
    "calories": 11.7,
    "volume": "710ml",
    "isToday": false,
    "isHot": true,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 11.7,
      "sodium": "152mg",
      "sugar": "0.3g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "0.7g"
    },
    "ingredients": "영문명: ZERO SUGAR Energy-Drink Ade",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "지친 현대인들에게 필요한 한 잔의 에너지! 타우린 1,000mg이 들어가 활력이 충전되는 에너지드링크맛 제로 칼로리 에이드 *대체당(알룰로스 등)을 과도하게 섭취 시 개인에 따라 복통 및 설사 등을 유발 할 수 있으니 주의하세요."
  },
  {
    "id": "mega-coffee-021",
    "name": "[ICE] 블루베리요거트스무디",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "스무디&프라페",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20250320003134_1742398294871_z9t_oXfbA6.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3900,
    "overallRating": 4.5,
    "ratingCount": 460,
    "searchInfluxCount": 11220,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 92,
    "calories": 531.8,
    "volume": "591ml",
    "isToday": false,
    "isHot": true,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 531.8,
      "sodium": "133.5mg",
      "sugar": "109.3g",
      "satFat": "2.5",
      "saturatedFat": "2.5",
      "protein": "6.0g"
    },
    "ingredients": "영문명: Blueberry Yogurt Smoothie",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3900,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "새콤달콤한 블루베리와 산뜻한 요거트가 만나 조화로운 스무디"
  },
  {
    "id": "mega-coffee-022",
    "name": "[ICE] 블루베리플럼주스",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "에이드&주스",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20250320003308_1742398388471_NLtoviExwY.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.6,
    "ratingCount": 477,
    "searchInfluxCount": 11531,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 93,
    "calories": 257.2,
    "volume": "591ml",
    "isToday": false,
    "isHot": true,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 257.2,
      "sodium": "62.6mg",
      "sugar": "35.7g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "0.7g"
    },
    "ingredients": "영문명: Blueberry Plum Juice",
    "allergens": [
      "복숭아"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "새콤달콤한 블루베리와 식이섬유가 풍부한 플럼, 프리바이오틱스를 더해 건강한 블렌딩 주스"
  },
  {
    "id": "mega-coffee-023",
    "name": "[ICE] 골드키위주스",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "에이드&주스",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20250320003451_1742398491079_wWQva965Sn.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.7,
    "ratingCount": 494,
    "searchInfluxCount": 11842,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 94,
    "calories": 202.8,
    "volume": "591ml",
    "isToday": false,
    "isHot": true,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 202.8,
      "sodium": "15.0mg",
      "sugar": "43.1g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "1.2g"
    },
    "ingredients": "영문명: Gold Kiwi Juice",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "상큼달콤한 프리미엄 골드키위에 밀크씨슬을 더해 일상의 활력을 선사하는 건강한 블렌딩 주스"
  },
  {
    "id": "mega-coffee-024",
    "name": "[ICE] 귤 톡톡 젤리스무디",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "스무디&프라페",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20250320003615_1742398575781_Dy89tEHQTL.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3900,
    "overallRating": 4.8,
    "ratingCount": 511,
    "searchInfluxCount": 12153,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 95,
    "calories": 364.3,
    "volume": "591ml",
    "isToday": false,
    "isHot": true,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 364.3,
      "sodium": "81.4mg",
      "sugar": "89.2g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.5g"
    },
    "ingredients": "영문명: Tangerine Jelly Smoothie",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3900,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "톡톡 터지는 상큼한 귤의 과육과 몽글한 젤리식감이 매력적인 스무디"
  },
  {
    "id": "mega-coffee-025",
    "name": "[ICE] 왕메가카페라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20250320004326_1742399006488_yI4cvwXy6N.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.9,
    "ratingCount": 528,
    "searchInfluxCount": 12464,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 96,
    "calories": 269.4,
    "volume": "946ml",
    "isToday": false,
    "isHot": true,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 269.4,
      "sodium": "136.2mg",
      "sugar": "28.4g",
      "satFat": "7.1g",
      "saturatedFat": "7.1g",
      "protein": "15g"
    },
    "ingredients": "영문명: BIG MEGA Caffe Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "진한 에스프레소와 부드러운 우유가 어우러져 고소한 풍미를 완성한 메가MGC커피만의 왕메가사이즈 라떼"
  },
  {
    "id": "mega-coffee-026",
    "name": "[ICE] 디카페인 왕메가카페라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20250320004527_1742399127150_aZXw3Wbf4H.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.5,
    "ratingCount": 545,
    "searchInfluxCount": 12775,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 97,
    "calories": 278.7,
    "volume": "946ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 278.7,
      "sodium": "136.4mg",
      "sugar": "26.4g",
      "satFat": "7.2g",
      "saturatedFat": "7.2g",
      "protein": "10.6g"
    },
    "ingredients": "영문명: Decaf BIG MEGA Caffe Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "진한 에스프레소와 부드러운 우유가 어우러져 고소한 풍미를 완성한 메가MGC커피만의 왕메가사이즈 라떼"
  },
  {
    "id": "mega-coffee-027",
    "name": "디카페인 라이트 바닐라 아몬드라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20250402185107_1743587467742_jeeQmgRshX.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.6,
    "ratingCount": 562,
    "searchInfluxCount": 13086,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 98,
    "calories": 65.9,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 65.9,
      "sodium": "120.4mg",
      "sugar": "4.1g",
      "satFat": "0.4g",
      "saturatedFat": "0.4g",
      "protein": "1.8g"
    },
    "ingredients": "영문명: Decaf Light vanilla almond latte",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "비건 음료 아몬드브리즈와 칼로리를 낮춘 라이트 바닐라 시럽이 만나 가볍지만 부드~러워진 디카페인 라떼"
  },
  {
    "id": "mega-coffee-028",
    "name": "[ICE] 왕메가사과유자",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "음료",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20250320004730_1742399250273_UPT0oK5fSb.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.7,
    "ratingCount": 579,
    "searchInfluxCount": 13397,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 90,
    "calories": 313.3,
    "volume": "946ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 313.3,
      "sodium": "120.4mg",
      "sugar": "76.7g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "0.2g"
    },
    "ingredients": "영문명: BIG MEGA Apple Citron Tea",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "애플티의 향긋함과 유자청의 상큼달콤함을 느낄 수 있는 메가MGC커피만의 왕메가사이즈 과일티"
  },
  {
    "id": "mega-coffee-029",
    "name": "[ICE] 왕메가헛개리카노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "음료",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20250320001838_1742397518902_MCGDHqjxXi.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.8,
    "ratingCount": 596,
    "searchInfluxCount": 13708,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 91,
    "calories": 55.7,
    "volume": "946ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 55.7,
      "sodium": "12.2mg",
      "sugar": "0.0g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "0.9g"
    },
    "ingredients": "영문명: BIG MEGA Oriental Raisin-Tea Americano",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "국내산 헛개수와 아메리카노를 블렌딩해 고소한 맛이 더욱 커진 왕메가사이즈 커피"
  },
  {
    "id": "mega-coffee-030",
    "name": "[HOT] (HOT)디카페인 헛개리카노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20250320002019_1742397619030_g5iEBTRsp7.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.9,
    "ratingCount": 613,
    "searchInfluxCount": 14019,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 92,
    "calories": 34.2,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 34.2,
      "sodium": "10.2mg",
      "sugar": "0.0g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "0.6g"
    },
    "ingredients": "영문명: Decaf Oriental Raisin-Tea Americano",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "국내산 헛개수와 메가MGC커피만의 아메리카노를 더해 고소한 맛이 조화로운 디카페인 블렌딩 커피"
  },
  {
    "id": "mega-coffee-031",
    "name": "[ICE] (ICE)디카페인 헛개리카노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20250320002154_1742397714997_gJNgLAlBgB.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.5,
    "ratingCount": 630,
    "searchInfluxCount": 14330,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 93,
    "calories": 33.3,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 33.3,
      "sodium": "8.3mg",
      "sugar": "0.0g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "0.8g"
    },
    "ingredients": "영문명: Decaf Oriental Raisin-Tea Americano",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "국내산 헛개수와 메가MGC커피만의 아메리카노를 더해 고소한 맛이 조화로운 디카페인 블렌딩 커피"
  },
  {
    "id": "mega-coffee-032",
    "name": "[ICE] 디카페인 왕메가헛개리카노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20250320002658_1742398018940_tQcZf5VEmt.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.6,
    "ratingCount": 647,
    "searchInfluxCount": 14641,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 94,
    "calories": 55.5,
    "volume": "946ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 55.5,
      "sodium": "12.1mg",
      "sugar": "0.0g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "0.6g"
    },
    "ingredients": "영문명: Decaf BIG MEGA Oriental Raisin-Tea Americano",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "국내산 헛개수와 아메리카노를 블렌딩해 고소한 맛이 더욱 커진 왕메가사이즈 디카페인 커피"
  },
  {
    "id": "mega-coffee-033",
    "name": "[HOT] (HOT)상큼 리치티",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20241106234009_1730904009276_fu30eMash6.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2500,
    "overallRating": 4.7,
    "ratingCount": 664,
    "searchInfluxCount": 14952,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 95,
    "calories": 274.8,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 274.8,
      "sodium": "10.1mg",
      "sugar": "64.1g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "0.7g"
    },
    "ingredients": "영문명: (HOT) Zesty Lychee Tea",
    "allergens": [
      "복숭아"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "리치, 라임, 망고스틴 베이스에 레드 커런트, 로즈마리를 더한 상큼한 과일티"
  },
  {
    "id": "mega-coffee-034",
    "name": "[ICE] (ICE)상큼 리치티",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20241106234210_1730904130583_8wBT7nkLrL.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2500,
    "overallRating": 4.8,
    "ratingCount": 681,
    "searchInfluxCount": 15263,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 96,
    "calories": 260.1,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 260.1,
      "sodium": "8.0mg",
      "sugar": "61.9g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.7g"
    },
    "ingredients": "영문명: (ICE) Zesty Lychee Tea",
    "allergens": [
      "복숭아"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "리치, 라임, 망고스틴 베이스에 레드 커런트, 로즈마리를 더한 상큼한 과일티"
  },
  {
    "id": "mega-coffee-035",
    "name": "[ICE] 할메가미숫커피",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "음료",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240904234012_1725460812247_PgldrBOdUW.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.9,
    "ratingCount": 698,
    "searchInfluxCount": 15574,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 97,
    "calories": 427.9,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 427.9,
      "sodium": "23.9mg",
      "sugar": "45.2g",
      "satFat": "6.8g",
      "saturatedFat": "6.8g",
      "protein": "6.5g"
    },
    "ingredients": "영문명: MEGA MGC Mix Coffee Blend with Grain Powder",
    "allergens": [
      "밀",
      "우유",
      "대두"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "곡물의 향이 고소한 미숫가루와 달달한 믹스커피의 황금비율 조합"
  },
  {
    "id": "mega-coffee-036",
    "name": "[ICE] 라이트 바닐라 아몬드라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240703154302_1719988982437_ZzHlEUdQwF.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.5,
    "ratingCount": 715,
    "searchInfluxCount": 15885,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 98,
    "calories": 75.3,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 75.3,
      "sodium": "119mg",
      "sugar": "3.1g",
      "satFat": "0.2g",
      "saturatedFat": "0.2g",
      "protein": "2.1g"
    },
    "ingredients": "영문명: Light vanilla almond latte",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "비건 음료 아몬드브리즈와 칼로리를 낮춘 라이트 바닐라 시럽이 만나 가볍지만 부드~러워진 라떼"
  },
  {
    "id": "mega-coffee-037",
    "name": "[ICE] 왕메가초코",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "음료",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610114853_1717987733636_Uq2ZKYINXZ.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.6,
    "ratingCount": 732,
    "searchInfluxCount": 16196,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 90,
    "calories": 574.2,
    "volume": "946ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 574.2,
      "sodium": "267.1mg",
      "sugar": "77.3g",
      "satFat": "6.7g",
      "saturatedFat": "6.7g",
      "protein": "11.9g"
    },
    "ingredients": "영문명: 32oz MEGA Chocolate",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "부드러운 우유에 진한 초코소스가 어우러져 달콤하게 입맛을 깨우는 왕 메가 사이즈 초코음료"
  },
  {
    "id": "mega-coffee-038",
    "name": "[ICE] 왕메가아이스티",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610113625_1717986985834_J_PTjRFq7P.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2500,
    "overallRating": 4.7,
    "ratingCount": 749,
    "searchInfluxCount": 16507,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 91,
    "calories": 474.8,
    "volume": "946ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 474.8,
      "sodium": "119.2mg",
      "sugar": "96.6g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.4g"
    },
    "ingredients": "영문명: 32oz MEGA Peach Iced Tea",
    "allergens": [
      "복숭아",
      "아황산류"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "깊은 맛의 홍차와 달콤한 복숭아의 은은한 향이 어우러진 왕 메가 사이즈 아이스티"
  },
  {
    "id": "mega-coffee-039",
    "name": "[ICE] 제로 복숭아 아이스티",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610113548_1717986948917_wK8B5fR4h5.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2500,
    "overallRating": 4.8,
    "ratingCount": 766,
    "searchInfluxCount": 16818,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 92,
    "calories": 26.1,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 26.1,
      "sodium": "5.3mg",
      "sugar": "0.7g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.1g"
    },
    "ingredients": "영문명: ZERO Sugar Peach Iced Tea",
    "allergens": [
      "복숭아",
      "아황산류"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "깊게 우려진 홍차와 은은한 복숭아향의 아이스티를 제로슈가, 제로칼로리로 즐길 수 있는 음료 *대체당(알룰로스,에리스리톨)을 과도하게 섭취 시 개인에 따라 복통 및 설사 등을 유발 할 수 있으니 주의하세요."
  },
  {
    "id": "mega-coffee-040",
    "name": "[ICE] 연유라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132459_1717993499610_KiXcTR2q5P.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.9,
    "ratingCount": 783,
    "searchInfluxCount": 17129,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 93,
    "calories": 351.5,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 351.5,
      "sodium": "123.6mg",
      "sugar": "31.9g",
      "satFat": "8.5g",
      "saturatedFat": "8.5g",
      "protein": "11.8g"
    },
    "ingredients": "영문명: Condensed Milk Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "향기로운 에스프레소 샷, 부드러운 우유 그리고 달콤한 연유가 조화롭게 어우러진 라떼"
  },
  {
    "id": "mega-coffee-041",
    "name": "[ICE] 골드망고스무디",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "스무디&프라페",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610112826_1717986506337_AauGwyguRG.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3900,
    "overallRating": 4.5,
    "ratingCount": 800,
    "searchInfluxCount": 17440,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 94,
    "calories": 209.5,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 209.5,
      "sodium": "20.7mg",
      "sugar": "38.4g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "0.8g"
    },
    "ingredients": "영문명: Gold Mango Smoothie",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3900,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "황금빛 골드망고가 진하게 느껴지는 부드럽고 상큼 달콤한 스무디"
  },
  {
    "id": "mega-coffee-042",
    "name": "[ICE] 할메가커피",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "음료",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610113252_1717986772176_6c36zo5yuf.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.6,
    "ratingCount": 817,
    "searchInfluxCount": 17751,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 95,
    "calories": 281.9,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 281.9,
      "sodium": "22.5mg",
      "sugar": "30.3g",
      "satFat": "7.7g",
      "saturatedFat": "7.7g",
      "protein": "1.9g"
    },
    "ingredients": "영문명: MEGA Mix Coffee",
    "allergens": [
      "우유",
      "대두"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "우리 할머니께서 즐겨드시던 달달한 믹스 커피 스타일로 만든 메가MGC커피만의 시원한 커피 음료"
  },
  {
    "id": "mega-coffee-043",
    "name": "[ICE] 왕할메가커피",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "음료",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610114915_1717987755314_1rAv8UqZUm.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.7,
    "ratingCount": 834,
    "searchInfluxCount": 18062,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 96,
    "calories": 468.7,
    "volume": "946ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 468.7,
      "sodium": "36.8mg",
      "sugar": "48.5g",
      "satFat": "12.3g",
      "saturatedFat": "12.3g",
      "protein": "3.1g"
    },
    "ingredients": "영문명: BIG MEGA Mix Coffee",
    "allergens": [
      "우유",
      "대두"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "우리 할머니께서 즐겨드시던 달달한 믹스 커피 스타일로 만든 메가MGC커피만의 메가사이즈 커피 음료"
  },
  {
    "id": "mega-coffee-044",
    "name": "[ICE] 코코넛 커피 스무디",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "스무디&프라페",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132830_1717993710301_PxTeTM9Suh.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3900,
    "overallRating": 4.8,
    "ratingCount": 851,
    "searchInfluxCount": 18373,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 97,
    "calories": 746.5,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 746.5,
      "sodium": "347.1mg",
      "sugar": "61.4g",
      "satFat": "29.3g",
      "saturatedFat": "29.3g",
      "protein": "9.4g"
    },
    "ingredients": "영문명: Coconut Coffee Smoothie",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3900,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "바삭하고 고소한 코코넛 칩을 올리고 쌉싸름한 커피와 달콤한 코코넛이 조화로운 스무디"
  },
  {
    "id": "mega-coffee-045",
    "name": "[ICE] 딸기주스",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "에이드&주스",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610114741_1717987661472_LqJw6WITHO.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.9,
    "ratingCount": 868,
    "searchInfluxCount": 18684,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 98,
    "calories": 228,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 228,
      "sodium": "11.0mg",
      "sugar": "54.0g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "1.5g"
    },
    "ingredients": "영문명: Strawberry Juice",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "새콤달콤한 딸기주스에 피쉬 콜라겐을 더해 건강한 블렌딩 주스"
  },
  {
    "id": "mega-coffee-046",
    "name": "[ICE] 딸기바나나주스",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "에이드&주스",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610114817_1717987697259_APSvRawmJi.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.5,
    "ratingCount": 885,
    "searchInfluxCount": 18995,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 90,
    "calories": 268.5,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 268.5,
      "sodium": "41.1mg",
      "sugar": "42.2g",
      "satFat": "1.5g",
      "saturatedFat": "1.5g",
      "protein": "4.1g"
    },
    "ingredients": "영문명: Strawberry-Banana Juice",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "상큼한 딸기와 부드러운 바나나가 만나, 새콤달콤한 매력이 살아 있는 과일 음료."
  },
  {
    "id": "mega-coffee-047",
    "name": "[HOT] 디카페인 에스프레소",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610110159_1717984919074_jg4RYBdr_J.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.6,
    "ratingCount": 902,
    "searchInfluxCount": 19306,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 91,
    "calories": 6.2,
    "volume": "59ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 6.2,
      "sodium": "0.6mg",
      "sugar": "0.0g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.2g"
    },
    "ingredients": "영문명: Decaf Espresso",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "디카페인으로 만나는 메가MGC커피 에스프레소"
  },
  {
    "id": "mega-coffee-048",
    "name": "[HOT] 디카페인 아메리카노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105207_1717984327186_Sgj9kfKYCi.jpg",
    "releaseDate": "2026.09 공식",
    "price": 1500,
    "overallRating": 4.7,
    "ratingCount": 919,
    "searchInfluxCount": 19617,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 92,
    "calories": 8.4,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 8.4,
      "sodium": "8.4mg",
      "sugar": "0.0g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "0.5g"
    },
    "ingredients": "영문명: Decaf Americano",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 1500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "향과 풍미 그대로 카페인만을 낮춰 민감한 분들도 안심하고 매일매일 즐길 수 있는 디카페인 커피"
  },
  {
    "id": "mega-coffee-049",
    "name": "[HOT] 디카페인 꿀아메리카노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610104414_1717983854651_gNaXxjR35W.jpg",
    "releaseDate": "2026.09 공식",
    "price": 1500,
    "overallRating": 4.8,
    "ratingCount": 136,
    "searchInfluxCount": 19928,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 93,
    "calories": 149.3,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 149.3,
      "sodium": "7.5mg",
      "sugar": "26.2g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "0.5g"
    },
    "ingredients": "영문명: Decaf Honey Americano",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 1500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "디카페인 아메리카노의 묵직한 바디감에 달콤한 사양벌꿀이 소프트하게 어우러진 커피."
  },
  {
    "id": "mega-coffee-050",
    "name": "[HOT] 디카페인 헤이즐넛 아메리카노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105046_1717984246492_KeavFH2VTO.jpg",
    "releaseDate": "2026.09 공식",
    "price": 1500,
    "overallRating": 4.9,
    "ratingCount": 153,
    "searchInfluxCount": 20239,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 94,
    "calories": 84.2,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 84.2,
      "sodium": "5.3mg",
      "sugar": "10.3g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.5g"
    },
    "ingredients": "영문명: Decaf Hazelnut Americano",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 1500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "디카페인 아메리카노에 헤이즐넛의 풍성한 향과 달콤함을 담아 향긋하고 부드럽게 즐기는 커피."
  },
  {
    "id": "mega-coffee-051",
    "name": "[HOT] 디카페인 바닐라 아메리카노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610104650_1717984010944__Ck8jyuaDL.jpg",
    "releaseDate": "2026.09 공식",
    "price": 1500,
    "overallRating": 4.5,
    "ratingCount": 170,
    "searchInfluxCount": 20550,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 95,
    "calories": 86.9,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 86.9,
      "sodium": "5.1mg",
      "sugar": "16.9g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "0.5g"
    },
    "ingredients": "영문명: Decaf Vanilla Americano",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 1500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "디카페인 아메리카노에 바닐라의 부드러운 향과 달콤함을 조화롭게 담아낸 커피."
  },
  {
    "id": "mega-coffee-052",
    "name": "[HOT] 디카페인 카페라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105117_1717984277710_7BjonXSBFE.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.6,
    "ratingCount": 187,
    "searchInfluxCount": 20861,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 96,
    "calories": 178.5,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 178.5,
      "sodium": "102.1mg",
      "sugar": "11.4g",
      "satFat": "4.8g",
      "saturatedFat": "4.8g",
      "protein": "10.0g"
    },
    "ingredients": "영문명: Decaf Cafe Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "디카페인 에스프레소와 부드러운 우유가 어우러져 고소한 풍미를 완성한 라떼."
  },
  {
    "id": "mega-coffee-053",
    "name": "[HOT] 디카페인 카푸치노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105545_1717984545629_CaGhOpvAnm.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.7,
    "ratingCount": 204,
    "searchInfluxCount": 21172,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 97,
    "calories": 152.9,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 152.9,
      "sodium": "80.6mg",
      "sugar": "10.4g",
      "satFat": "4.5g",
      "saturatedFat": "4.5g",
      "protein": "8.1g"
    },
    "ingredients": "영문명: Decaf Cappuccino",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "디카페인 에스프레소와 부드러운 우유가 어우러져 고소한 풍미를 완성한 카푸치노."
  },
  {
    "id": "mega-coffee-054",
    "name": "[HOT] 디카페인 바닐라라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610104630_1717983990934_v3HPYN93uK.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.8,
    "ratingCount": 221,
    "searchInfluxCount": 21483,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 98,
    "calories": 219.5,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 219.5,
      "sodium": "85.8mg",
      "sugar": "29.1g",
      "satFat": "4.7g",
      "saturatedFat": "4.7g",
      "protein": "8.1g"
    },
    "ingredients": "영문명: Decaf Vanilla Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "디카페인으로 즐기는 바닐라의 짙은 향과 풍부한 폼 밀크의 조화가 인상적인 달콤한 라떼."
  },
  {
    "id": "mega-coffee-055",
    "name": "[HOT] 디카페인 헤이즐넛 라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105007_1717984207073_HqCto2mw3y.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.9,
    "ratingCount": 238,
    "searchInfluxCount": 21794,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 90,
    "calories": 240,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 240,
      "sodium": "81.4mg",
      "sugar": "18.2g",
      "satFat": "4.3g",
      "saturatedFat": "4.3g",
      "protein": "8.9g"
    },
    "ingredients": "영문명: Decaf Hazelnut Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "부드러��� 카페라떼에 헤이즐넛의 풍부한 향과 달콤함을 담아 향긋하게 즐길 수 있는 디카페인 라떼."
  },
  {
    "id": "mega-coffee-056",
    "name": "[HOT] 디카페인 카라멜마끼아또",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105238_1717984358779_MvgzcNlZdI.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.5,
    "ratingCount": 255,
    "searchInfluxCount": 22105,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 91,
    "calories": 239.5,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 239.5,
      "sodium": "89.3mg",
      "sugar": "26.3g",
      "satFat": "4.2g",
      "saturatedFat": "4.2g",
      "protein": "8.9g"
    },
    "ingredients": "영문명: Decaf Caramel Macchiato",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "폼 밀크 속에 진한 디카페인 에스프레소와 달콤한 카라멜을 가미해 부드럽게 즐기는 커피"
  },
  {
    "id": "mega-coffee-057",
    "name": "[HOT] 디카페인 연유라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105224_1717984344775_9iKsKownRh.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.6,
    "ratingCount": 272,
    "searchInfluxCount": 22416,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 92,
    "calories": 301.5,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 301.5,
      "sodium": "127.1mg",
      "sugar": "27.3g",
      "satFat": "6.4g",
      "saturatedFat": "6.4g",
      "protein": "12.3g"
    },
    "ingredients": "영문명: Decaf Condensed Milk Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "디카페인 에스프레소 샷, 부드러운 우유 그리고 달콤한 연유가 조화롭게 어우러진 라떼."
  },
  {
    "id": "mega-coffee-058",
    "name": "[HOT] 디카페인 카페모카",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105145_1717984305671_2_yE7sXma9.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.7,
    "ratingCount": 289,
    "searchInfluxCount": 22727,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 93,
    "calories": 360.3,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 360.3,
      "sodium": "153.2mg",
      "sugar": "39.2g",
      "satFat": "10.3g",
      "saturatedFat": "10.3g",
      "protein": "10.8g"
    },
    "ingredients": "영문명: Decaf Cafe Mocha",
    "allergens": [
      "우유",
      "대두"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "초코를 만나 풍부해진 디카페인 에스프레소와 고소한 우유, 부드러운 휘핑크림까지 더해 달콤하게 즐기는 커피."
  },
  {
    "id": "mega-coffee-059",
    "name": "[ICE] 디카페인 아메리카노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240612101052_1718154652699_a0ElVTNb16.jpg",
    "releaseDate": "2026.09 공식",
    "price": 1500,
    "overallRating": 4.8,
    "ratingCount": 306,
    "searchInfluxCount": 23038,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 94,
    "calories": 9.5,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 9.5,
      "sodium": "4.4mg",
      "sugar": "0.0g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "0.5g"
    },
    "ingredients": "영문명: Decaf Americano",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 1500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "향과 풍미 그대로 카페인만을 낮춰 민감한 분들도 안심하고 매일매일 즐길 수 있는 디카페인 커피"
  },
  {
    "id": "mega-coffee-060",
    "name": "[ICE] 디카페인 메가리카노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610115001_1717987801368_av938eflM8.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.9,
    "ratingCount": 323,
    "searchInfluxCount": 23349,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 95,
    "calories": 17.1,
    "volume": "946ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 17.1,
      "sodium": "7.9mg",
      "sugar": "0.0g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "0.9g"
    },
    "ingredients": "영문명: Decaf Megaricano",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "메가MGC커피 디카페인 아메리카노를 '960ml' 더 크고 가볍게 즐길 수 있는 대용량 커피"
  },
  {
    "id": "mega-coffee-061",
    "name": "[ICE] 디카페인 꿀아메리카노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610131949_1717993189396_pb_H77_7AM.jpg",
    "releaseDate": "2026.09 공식",
    "price": 1500,
    "overallRating": 4.5,
    "ratingCount": 340,
    "searchInfluxCount": 23660,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 96,
    "calories": 137.4,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 137.4,
      "sodium": "5.0mg",
      "sugar": "21.5g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "0.6g"
    },
    "ingredients": "영문명: Decaf Honey Americano",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 1500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "디카페인 아메리카노의 묵직한 바디감에 달콤한 사양벌꿀이 소프트하게 어우러진 커피."
  },
  {
    "id": "mega-coffee-062",
    "name": "[ICE] 디카페인 헤이즐넛 아메리카노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610131835_1717993115036_XaPndW7UkR.jpg",
    "releaseDate": "2026.09 공식",
    "price": 1500,
    "overallRating": 4.6,
    "ratingCount": 357,
    "searchInfluxCount": 23971,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 97,
    "calories": 108.7,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 108.7,
      "sodium": "5.2mg",
      "sugar": "15.8g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.6g"
    },
    "ingredients": "영문명: Decaf Hazelnut Americano",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 1500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "디카페인 아메리카노에 헤이즐넛의 풍성한 향과 달콤함을 담아 향긋하고 부드럽게 즐기는 커피."
  },
  {
    "id": "mega-coffee-063",
    "name": "[ICE] 디카페인 바닐라 아메리카노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610131932_1717993172929_VUtwLd_LyN.jpg",
    "releaseDate": "2026.09 공식",
    "price": 1500,
    "overallRating": 4.7,
    "ratingCount": 374,
    "searchInfluxCount": 24282,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 98,
    "calories": 112.4,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 112.4,
      "sodium": "3.3mg",
      "sugar": "21.6g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "0.4g"
    },
    "ingredients": "영문명: Decaf Vanilla Americano",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 1500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "디카페인 아메리카노에 바닐라의 부드러운 향과 달콤함을 조화롭게 담아낸 커피."
  },
  {
    "id": "mega-coffee-064",
    "name": "[ICE] 디카페인 카페라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132005_1717993205762_9xKCxaSb9P.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.8,
    "ratingCount": 391,
    "searchInfluxCount": 24593,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 90,
    "calories": 147.7,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 147.7,
      "sodium": "78.0mg",
      "sugar": "9.3g",
      "satFat": "4.5g",
      "saturatedFat": "4.5g",
      "protein": "8.2g"
    },
    "ingredients": "영문명: Decaf Cafe Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "디카페인 에스프레소와 부드러운 우유가 어우러져 고소한 풍미를 완성한 라떼."
  },
  {
    "id": "mega-coffee-065",
    "name": "[ICE] 디카페인 카푸치노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132018_1717993218605_64Ij4AhmCE.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.9,
    "ratingCount": 408,
    "searchInfluxCount": 24904,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 91,
    "calories": 127,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 127,
      "sodium": "68.3mg",
      "sugar": "10.1g",
      "satFat": "3.7g",
      "saturatedFat": "3.7g",
      "protein": "0.9g"
    },
    "ingredients": "영문명: Decaf Cappuccino",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "디카페인 에스프레소 위에 올려진 우유 거품, 그리고 시나몬 파우더로 완성한 조화로운 맛의 커피."
  },
  {
    "id": "mega-coffee-066",
    "name": "[ICE] 디카페인 바닐라라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610113234_1717986754069_tSPQqoiPj6.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.5,
    "ratingCount": 425,
    "searchInfluxCount": 25215,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 92,
    "calories": 225.3,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 225.3,
      "sodium": "71.4mg",
      "sugar": "29.0g",
      "satFat": "3.9g",
      "saturatedFat": "3.9g",
      "protein": "6.8g"
    },
    "ingredients": "영문명: Decaf Vanilla Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "디카페인으로 즐기는 바닐라의 짙은 향과 풍부한 폼 밀크의 조화가 인상적인 달콤한 라떼."
  },
  {
    "id": "mega-coffee-067",
    "name": "[ICE] 디카페인 헤이즐넛 라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132034_1717993234457_aGDHQ0U0Ap.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.6,
    "ratingCount": 442,
    "searchInfluxCount": 25526,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 93,
    "calories": 237,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 237,
      "sodium": "70.7mg",
      "sugar": "23.4g",
      "satFat": "4.0g",
      "saturatedFat": "4.0g",
      "protein": "7.4g"
    },
    "ingredients": "영문명: Decaf Hazelnut Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "부드러운 카페라떼에 헤이즐넛의 풍부한 향과 달콤함을 담아 향긋하게 즐길 수 있는 디카페인 라떼."
  },
  {
    "id": "mega-coffee-068",
    "name": "[ICE] 디카페인 카라멜마끼아또",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610131917_1717993157515_k1yeakRwwv.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.7,
    "ratingCount": 459,
    "searchInfluxCount": 25837,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 94,
    "calories": 210.1,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 210.1,
      "sodium": "62.1mg",
      "sugar": "29.5g",
      "satFat": "2.9g",
      "saturatedFat": "2.9g",
      "protein": "5.7g"
    },
    "ingredients": "영문명: Decaf Caramel Macchiato",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "폼 밀크 속에 진한 디카페인 에스프레소와 달콤한 카라멜을 가미해 부드럽게 즐기는 커피"
  },
  {
    "id": "mega-coffee-069",
    "name": "[ICE] 디카페인 연유라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610131759_1717993079921_A7Gr7qp0g2.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.8,
    "ratingCount": 476,
    "searchInfluxCount": 26148,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 95,
    "calories": 305.4,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 305.4,
      "sodium": "117.7mg",
      "sugar": "35.1g",
      "satFat": "7.0g",
      "saturatedFat": "7.0g",
      "protein": "10.8g"
    },
    "ingredients": "영문명: Decaf Condensed Milk Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "디카페인 에스프레소 샷, 부드러운 우유 그리고 달콤한 연유가 조화롭게 어우러진 라떼."
  },
  {
    "id": "mega-coffee-070",
    "name": "[ICE] 디카페인 카페모카",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240612101114_1718154674451_BGo4AZa57r.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.9,
    "ratingCount": 493,
    "searchInfluxCount": 26459,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 96,
    "calories": 319.7,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 319.7,
      "sodium": "113.1mg",
      "sugar": "33.3g",
      "satFat": "8.7g",
      "saturatedFat": "8.7g",
      "protein": "6.3g"
    },
    "ingredients": "영문명: Decaf Cafe Mocha",
    "allergens": [
      "우유",
      "대두"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "초코를 만나 풍부해진 디카페인 에스프레소와 고소한 우유, 부드러운 휘핑크림까지 더해 달콤하게 즐기는 커피."
  },
  {
    "id": "mega-coffee-071",
    "name": "[ICE] 딸기쿠키프라페",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "스무디&프라페",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132048_1717993248890_NW1QEUmFtQ.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3900,
    "overallRating": 4.5,
    "ratingCount": 510,
    "searchInfluxCount": 26770,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 97,
    "calories": 583.3,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 583.3,
      "sodium": "247.7mg",
      "sugar": "65.4g",
      "satFat": "12.5g",
      "saturatedFat": "12.5g",
      "protein": "7.7g"
    },
    "ingredients": "영문명: Strawberry Cookie Frappe",
    "allergens": [
      "우유",
      "밀",
      "대두"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3900,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "부드러운 바닐라와 달달한 딸기, 바삭한 오레오 쿠키가 달콤한 하모니를 선물하는 프라페."
  },
  {
    "id": "mega-coffee-072",
    "name": "[ICE] 콜드브루디카페인",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132920_1717993760751_69WHioWjnb.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.6,
    "ratingCount": 527,
    "searchInfluxCount": 27081,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 98,
    "calories": 7.7,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 7.7,
      "sodium": "0.1mg",
      "sugar": "0.0g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.5g"
    },
    "ingredients": "영문명: Decaf Coldbrew",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "카페인을 줄였지만, 원두 본연의 향미를 풍부하게 살려 맛을 잡은 디카페인 콜드브루."
  },
  {
    "id": "mega-coffee-073",
    "name": "[HOT] 콜드브루디카페인",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105522_1717984522154_Wf1ds9riaV.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.7,
    "ratingCount": 544,
    "searchInfluxCount": 27392,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 90,
    "calories": 9.4,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 9.4,
      "sodium": "1.9mg",
      "sugar": "0.0g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.6g"
    },
    "ingredients": "영문명: Decaf Coldbrew",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "카페인을 줄였지만, 원두 본연의 향미를 풍부하게 살려 맛을 잡은 디카페인 콜드브루."
  },
  {
    "id": "mega-coffee-074",
    "name": "[ICE] 콜드브루디카페인라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132902_1717993742550_EBciHOxu2w.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.8,
    "ratingCount": 561,
    "searchInfluxCount": 27703,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 91,
    "calories": 140.8,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 140.8,
      "sodium": "45.6mg",
      "sugar": "0.0g",
      "satFat": "4.0g",
      "saturatedFat": "4.0g",
      "protein": "7.9g"
    },
    "ingredients": "영문명: Decaf Coldbrew Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "우유와 만나 부드럽고 고소한 풍미가 더해진 콜드브루 디카페인 라떼."
  },
  {
    "id": "mega-coffee-075",
    "name": "[HOT] 콜드브루디카페인라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "디카페인",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105453_1717984493950_uK1VQNQ6kc.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2700,
    "overallRating": 4.9,
    "ratingCount": 578,
    "searchInfluxCount": 28014,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 92,
    "calories": 153.8,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 153.8,
      "sodium": "55.2mg",
      "sugar": "0.0g",
      "satFat": "3.8g",
      "saturatedFat": "3.8g",
      "protein": "8.6g"
    },
    "ingredients": "영문명: Decaf Coldbrew Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2700,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "우유와 만나 부드럽고 고소한 풍미가 더해진 콜드브루 디카페인 라떼."
  },
  {
    "id": "mega-coffee-076",
    "name": "[HOT] 에스프레소",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105357_1717984437294_AduuhU3VyW.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.5,
    "ratingCount": 595,
    "searchInfluxCount": 28325,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 93,
    "calories": 7.6,
    "volume": "59ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 7.6,
      "sodium": "0.2mg",
      "sugar": "0.0g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.5g"
    },
    "ingredients": "영문명: Espresso",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "메가MGC커피 원두의 향미를 온전히 즐길 수 있는 에스프레소"
  },
  {
    "id": "mega-coffee-077",
    "name": "[HOT] 에스프레소 도피오",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105413_1717984453131_1es5v0RxH2.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.6,
    "ratingCount": 612,
    "searchInfluxCount": 28636,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 94,
    "calories": 15.2,
    "volume": "147ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 15.2,
      "sodium": "0.4mg",
      "sugar": "0.0g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "1.0g"
    },
    "ingredients": "영문명: Espresso doppio",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "더블샷으로 더욱 진하게 즐길 수 있는 에스프레소"
  },
  {
    "id": "mega-coffee-078",
    "name": "[ICE] 쿠키프라페",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "스무디&프라페",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610115315_1717987995816_oiPZ2u5dJr.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3900,
    "overallRating": 4.7,
    "ratingCount": 629,
    "searchInfluxCount": 28947,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 95,
    "calories": 697.8,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 697.8,
      "sodium": "411.7mg",
      "sugar": "59.7g",
      "satFat": "15.6g",
      "saturatedFat": "15.6g",
      "protein": "9.8g"
    },
    "ingredients": "영문명: Cookie Frappe",
    "allergens": [
      "우유",
      "밀",
      "대두"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3900,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "바삭하고 달콤한 오레오와 고소한 우유, 부드러운 바닐라향의 조화를 느낄 수 있는 프라페."
  },
  {
    "id": "mega-coffee-079",
    "name": "[HOT] 고구마라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610104240_1717983760778_agCooQEUb4.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.8,
    "ratingCount": 646,
    "searchInfluxCount": 29258,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 96,
    "calories": 310.5,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 310.5,
      "sodium": "96.5mg",
      "sugar": "18.8g",
      "satFat": "5.0g",
      "saturatedFat": "5.0g",
      "protein": "9.5g"
    },
    "ingredients": "영문명: Sweet Potato Latte",
    "allergens": [
      "우유",
      "아몬드"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "달콤하고 고소한 고구마와 부드러운 우유가 만나 누구나 즐기기 좋은 든든한 라떼."
  },
  {
    "id": "mega-coffee-080",
    "name": "[HOT] 곡물라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610104323_1717983803197_Dpwa_RK4_F.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.9,
    "ratingCount": 663,
    "searchInfluxCount": 29569,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 97,
    "calories": 420,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 420,
      "sodium": "94.0mg",
      "sugar": "38.8g",
      "satFat": "5.2g",
      "saturatedFat": "5.2g",
      "protein": "14.9g"
    },
    "ingredients": "영문명: Grain Latte",
    "allergens": [
      "우유",
      "밀",
      "대두"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "우유에 곡물을 더해 고소하고 든든하게 즐기는 라떼."
  },
  {
    "id": "mega-coffee-081",
    "name": "[HOT] 토피넛라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105954_1717984794244_2JeEMNYiCL.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.5,
    "ratingCount": 680,
    "searchInfluxCount": 29880,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 98,
    "calories": 373.1,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 373.1,
      "sodium": "182.0mg",
      "sugar": "38.3g",
      "satFat": "8.1g",
      "saturatedFat": "8.1g",
      "protein": "9.6g"
    },
    "ingredients": "영문명: Toffeenut Latte",
    "allergens": [
      "우유",
      "대두"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "은은하게 퍼지는 카라멜의 달달한 향기와 견과의 고소함을 한입에 즐길 수 있는 라떼."
  },
  {
    "id": "mega-coffee-082",
    "name": "[ICE] 고구마라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610112707_1717986427949_WKHpsJWXlk.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.6,
    "ratingCount": 697,
    "searchInfluxCount": 30191,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 90,
    "calories": 248.8,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 248.8,
      "sodium": "72.8mg",
      "sugar": "21.6g",
      "satFat": "3.8g",
      "saturatedFat": "3.8g",
      "protein": "6.5g"
    },
    "ingredients": "영문명: Sweet Potato Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "달콤하고 고소한 고구마와 부드러운 우유가 만나 누구나 즐기기 좋은 든든한 라떼."
  },
  {
    "id": "mega-coffee-083",
    "name": "[ICE] 곡물라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610112734_1717986454714_tTXJ2aV1O8.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.7,
    "ratingCount": 714,
    "searchInfluxCount": 30502,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 91,
    "calories": 402,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 402,
      "sodium": "84.8mg",
      "sugar": "34.5g",
      "satFat": "4.6g",
      "saturatedFat": "4.6g",
      "protein": "8.2g"
    },
    "ingredients": "영문명: Grain Latte",
    "allergens": [
      "우유",
      "밀",
      "대두"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "우유에 곡물을 더해 고소하고 든든하게 즐기는 라떼."
  },
  {
    "id": "mega-coffee-084",
    "name": "[ICE] 오레오초코라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132638_1717993598875_AQ4q6GUaJD.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.8,
    "ratingCount": 731,
    "searchInfluxCount": 30813,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 92,
    "calories": 475.1,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 475.1,
      "sodium": "258.2mg",
      "sugar": "30.1g",
      "satFat": "10.4g",
      "saturatedFat": "10.4g",
      "protein": "9.7g"
    },
    "ingredients": "영문명: Oreo Chocolate Latte",
    "allergens": [
      "우유",
      "밀",
      "대두"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "진한 초코와 리얼 오레오를 블렌딩해 씹는 맛을 더한 달콤한 아이스 라떼."
  },
  {
    "id": "mega-coffee-085",
    "name": "[ICE] 토피넛라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132535_1717993535868_Dk0SpiNnAo.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.9,
    "ratingCount": 748,
    "searchInfluxCount": 31124,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 93,
    "calories": 364.5,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 364.5,
      "sodium": "172.7mg",
      "sugar": "22.5g",
      "satFat": "8.3g",
      "saturatedFat": "8.3g",
      "protein": "9.2g"
    },
    "ingredients": "영문명: Toffeenut Latte",
    "allergens": [
      "우유",
      "대두"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "은은하게 퍼지는 카라멜의 달달한 향기와 견과의 고소함을 한입에 즐길 수 있는 라떼."
  },
  {
    "id": "mega-coffee-086",
    "name": "[ICE] 흑당버블밀크티라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610112956_1717986596859_dSAYDVVaV2.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.5,
    "ratingCount": 765,
    "searchInfluxCount": 31435,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 94,
    "calories": 330.2,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 330.2,
      "sodium": "106.7mg",
      "sugar": "24.4g",
      "satFat": "4.3g",
      "saturatedFat": "4.3g",
      "protein": "7.6g"
    },
    "ingredients": "영문명: Brown Sugar Bubble Milktea Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "타바론 얼그레이 홍차의 깊은 맛을 살린 밀크티 라떼에 진한 흑당과 흑당 버블의 달콤함을 채운 음료."
  },
  {
    "id": "mega-coffee-087",
    "name": "[HOT] 핫초코",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "음료",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610110045_1717984845295_sGoEnUlQpO.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.6,
    "ratingCount": 782,
    "searchInfluxCount": 31746,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 95,
    "calories": 383.4,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 383.4,
      "sodium": "177.3mg",
      "sugar": "53.2g",
      "satFat": "5.3g",
      "saturatedFat": "5.3g",
      "protein": "10.9g"
    },
    "ingredients": "영문명: Hot Chocolate",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "부드러운 우유에 진한 초코소스가 어우러져 달콤하게 입맛을 깨우는 초콜릿 음료."
  },
  {
    "id": "mega-coffee-088",
    "name": "[HOT] 녹차라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610104456_1717983896154_TxgXQHRHiM.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.7,
    "ratingCount": 799,
    "searchInfluxCount": 32057,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 96,
    "calories": 264.4,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 264.4,
      "sodium": "85.2mg",
      "sugar": "36.6g",
      "satFat": "4.1g",
      "saturatedFat": "4.1g",
      "protein": "8.3g"
    },
    "ingredients": "영문명: Green Tea Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "향긋한 녹차에 우유를 더해 입 안에 부드러운 푸릇함을 선물하는 라떼."
  },
  {
    "id": "mega-coffee-089",
    "name": "[HOT] 로얄밀크티라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105616_1717984576627_IStTaWZY3_.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.8,
    "ratingCount": 816,
    "searchInfluxCount": 32368,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 97,
    "calories": 232,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 232,
      "sodium": "85.2mg",
      "sugar": "14.7g",
      "satFat": "4.5g",
      "saturatedFat": "4.5g",
      "protein": "8.3g"
    },
    "ingredients": "영문명: Royal Milk Tea Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "우유와 은은한 홍차가 어우러져 부드럽고 향긋한 한 모금을 완성한 라떼."
  },
  {
    "id": "mega-coffee-090",
    "name": "[ICE] 흑당라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610113159_1717986719673_UjpcQYhtmh.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.9,
    "ratingCount": 833,
    "searchInfluxCount": 32679,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 98,
    "calories": 322,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 322,
      "sodium": "107.6mg",
      "sugar": "33.6g",
      "satFat": "5.2g",
      "saturatedFat": "5.2g",
      "protein": "8.3g"
    },
    "ingredients": "영문명: Brown Sugar Latte (No Pearls)",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "모리셔스의 진한 흑당과 부드러운 우유가 달콤하게 조화를 이루는 라떼."
  },
  {
    "id": "mega-coffee-091",
    "name": "[ICE] 흑당밀크티라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610113123_1717986683549_Q8E9tuNYJL.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.5,
    "ratingCount": 850,
    "searchInfluxCount": 32990,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 90,
    "calories": 300.5,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 300.5,
      "sodium": "104.4mg",
      "sugar": "22.6g",
      "satFat": "4.5g",
      "saturatedFat": "4.5g",
      "protein": "8.4g"
    },
    "ingredients": "영문명: Brown Sugar Milk tea Latte (No pearls)",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "타바론 얼그레이 홍차의 깊은 맛을 살린 밀크티 라떼에 진한 흑당의 달콤함을 채운 음료."
  },
  {
    "id": "mega-coffee-092",
    "name": "[ICE] 흑당버블라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610113023_1717986623453_FuG0kt97Jg.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.6,
    "ratingCount": 867,
    "searchInfluxCount": 33301,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 91,
    "calories": 320.3,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 320.3,
      "sodium": "104.9mg",
      "sugar": "27.2g",
      "satFat": "4.1g",
      "saturatedFat": "4.1g",
      "protein": "7.2g"
    },
    "ingredients": "영문명: Brown Sugar Bubble Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "모리셔스의 진한 흑당과 부드러운 우유가 달콤한 조화에 흑당 버블을 함께 즐기는 라떼."
  },
  {
    "id": "mega-coffee-093",
    "name": "[ICE] 아이스초코",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "음료",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132420_1717993460739_Yi5zAd90Og.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.7,
    "ratingCount": 884,
    "searchInfluxCount": 33612,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 92,
    "calories": 369.2,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 369.2,
      "sodium": "163.0mg",
      "sugar": "33.5g",
      "satFat": "4.4g",
      "saturatedFat": "4.4g",
      "protein": "9.0g"
    },
    "ingredients": "영문명: Ice Choco",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "부드러운 우유에 진한 초코소스가 어우러져 달콤하게 입맛을 깨우는 초콜릿 음료."
  },
  {
    "id": "mega-coffee-094",
    "name": "[ICE] 녹차라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610112917_1717986557781__XIcwRbg0h.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.8,
    "ratingCount": 901,
    "searchInfluxCount": 33923,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 93,
    "calories": 271.5,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 271.5,
      "sodium": "81.1mg",
      "sugar": "40.7g",
      "satFat": "4.3g",
      "saturatedFat": "4.3g",
      "protein": "7.9g"
    },
    "ingredients": "영문명: Green Tea Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "향긋한 녹차에 우유를 더해 입 안에 부드러운 푸릇함을 선물하는 라떼."
  },
  {
    "id": "mega-coffee-095",
    "name": "[ICE] 로얄밀크티라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610115251_1717987971895_crJlbiHg7t.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.9,
    "ratingCount": 918,
    "searchInfluxCount": 34234,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 94,
    "calories": 254.6,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 254.6,
      "sodium": "68.4mg",
      "sugar": "20.2g",
      "satFat": "4.2g",
      "saturatedFat": "4.2g",
      "protein": "6.6g"
    },
    "ingredients": "영문명: Royal Milk Tea Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "우유와 은은한 홍차가 어우러져 부드럽고 향긋한 한 모금을 완성한 라떼."
  },
  {
    "id": "mega-coffee-096",
    "name": "[HOT] 아메리카노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105645_1717984605982_8i5CoHU2NV.jpg",
    "releaseDate": "2026.09 공식",
    "price": 1500,
    "overallRating": 4.5,
    "ratingCount": 135,
    "searchInfluxCount": 34545,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 95,
    "calories": 12.2,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 12.2,
      "sodium": "2.4mg",
      "sugar": "0.0g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.9g"
    },
    "ingredients": "영문명: Americano",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 1500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "[기본2샷]메가MGC커피 블렌드 원두로 추출한 에스프레소에 물을 더해, 풍부한 바디감을 느낄 수 있는 스탠다드 커피."
  },
  {
    "id": "mega-coffee-097",
    "name": "[ICE] 메가리카노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "음료",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132223_1717993343456_4KESgpG57t.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.6,
    "ratingCount": 152,
    "searchInfluxCount": 34856,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 96,
    "calories": 16.7,
    "volume": "946ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 16.7,
      "sodium": "0.7mg",
      "sugar": "0.0g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "1.5g"
    },
    "ingredients": "영문명: 32oz Americano",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "깊고 진한 메가MGC커피 아메리카노를 '960ml' 더 큼직하게 즐길 수 있는 대용량 커피."
  },
  {
    "id": "mega-coffee-098",
    "name": "[HOT] 꿀아메리카노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610104349_1717983829122_YzOyiQAOOg.jpg",
    "releaseDate": "2026.09 공식",
    "price": 1500,
    "overallRating": 4.7,
    "ratingCount": 169,
    "searchInfluxCount": 35167,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 97,
    "calories": 172.4,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 172.4,
      "sodium": "12.7mg",
      "sugar": "30.4g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "0.9g"
    },
    "ingredients": "영문명: Honey Americano",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 1500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "아메리카노의 묵직한 바디감에 달콤한 사양벌꿀이 소프트하게 어우러진 커피."
  },
  {
    "id": "mega-coffee-099",
    "name": "[HOT] 바닐라라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610104603_1717983963750_lApih2z1h0.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.8,
    "ratingCount": 186,
    "searchInfluxCount": 35478,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 98,
    "calories": 235.2,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 235.2,
      "sodium": "86.9mg",
      "sugar": "29.6g",
      "satFat": "4.7g",
      "saturatedFat": "4.7g",
      "protein": "8.7g"
    },
    "ingredients": "영문명: Vanilla Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "바닐라의 짙은 향과 풍부한 폼 밀크의 조화가 인상적인 달콤한 라떼."
  },
  {
    "id": "mega-coffee-100",
    "name": "[HOT] 바닐라아메리카노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610104740_1717984060714__tk3s9Kb_s.jpg",
    "releaseDate": "2026.09 공식",
    "price": 1500,
    "overallRating": 4.9,
    "ratingCount": 203,
    "searchInfluxCount": 35789,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 90,
    "calories": 97.8,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 97.8,
      "sodium": "5.3mg",
      "sugar": "15.7g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "1.4g"
    },
    "ingredients": "영문명: Vanilla Americano",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 1500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "아메리카노에 바닐라의 부드러운 향과 달콤함을 조화롭게 담아낸 커피."
  },
  {
    "id": "mega-coffee-101",
    "name": "[HOT] 연유라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105712_1717984632188_Lqh27degWu.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.5,
    "ratingCount": 220,
    "searchInfluxCount": 36100,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 91,
    "calories": 321.6,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 321.6,
      "sodium": "144.6mg",
      "sugar": "32.8g",
      "satFat": "6.4g",
      "saturatedFat": "6.4g",
      "protein": "13.0g"
    },
    "ingredients": "영문명: Condensed milk Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "향기로운 에스프레소 샷, 부드러운 우유 그리고 달콤한 연유가 조화롭게 어우러진 라떼."
  },
  {
    "id": "mega-coffee-102",
    "name": "[HOT] 카라멜마끼아또",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105805_1717984685954_T1qos0ocDV.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.6,
    "ratingCount": 237,
    "searchInfluxCount": 36411,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 92,
    "calories": 243.3,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 243.3,
      "sodium": "90.7mg",
      "sugar": "26.1g",
      "satFat": "4.1g",
      "saturatedFat": "4.1g",
      "protein": "8.9g"
    },
    "ingredients": "영문명: Caramel Macchiato",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "폼 밀크 속에 진한 에스프레소와 달콤한 카라멜을 가미해 부드럽게 즐기는 커피."
  },
  {
    "id": "mega-coffee-103",
    "name": "[HOT] 카페라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105821_1717984701991_RUKCqSZ_HO.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.7,
    "ratingCount": 254,
    "searchInfluxCount": 36722,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 93,
    "calories": 175.4,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 175.4,
      "sodium": "101.5mg",
      "sugar": "10.8g",
      "satFat": "5.2g",
      "saturatedFat": "5.2g",
      "protein": "10.0g"
    },
    "ingredients": "영문명: Caffe Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "진한 에스프레소와 부드러운 우유가 어우러져 고소한 풍미를 완성한 라떼."
  },
  {
    "id": "mega-coffee-104",
    "name": "[HOT] 카페모카",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105838_1717984718108_ZB6aalHqIU.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.8,
    "ratingCount": 271,
    "searchInfluxCount": 37033,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 94,
    "calories": 359.6,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 359.6,
      "sodium": "159.8mg",
      "sugar": "40.8g",
      "satFat": "10.6g",
      "saturatedFat": "10.6g",
      "protein": "11.2g"
    },
    "ingredients": "영문명: Caffe Mocha",
    "allergens": [
      "우유",
      "대두"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "초코를 만나 풍부해진 에스프레소와 고소한 우유, 부드러운 휘핑크림까지 더해 달콤하게 즐기는 커피."
  },
  {
    "id": "mega-coffee-105",
    "name": "[HOT] 카푸치노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105852_1717984732750_WEt0KXVcnQ.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.9,
    "ratingCount": 288,
    "searchInfluxCount": 37344,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 95,
    "calories": 145.5,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 145.5,
      "sodium": "60.7mg",
      "sugar": "3.4g",
      "satFat": "4.1g",
      "saturatedFat": "4.1g",
      "protein": "8.2g"
    },
    "ingredients": "영문명: Cappuccino",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "에스프레소 위에 올려진 우유 거품, 그리고 시나몬 파우더로 완성한 조화로운 맛의 커피."
  },
  {
    "id": "mega-coffee-106",
    "name": "[HOT] 콜드브루라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105923_1717984763591_cKSGllWUzt.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.5,
    "ratingCount": 305,
    "searchInfluxCount": 37655,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 96,
    "calories": 164.2,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 164.2,
      "sodium": "54.4mg",
      "sugar": "2.1g",
      "satFat": "5.2g",
      "saturatedFat": "5.2g",
      "protein": "9.0g"
    },
    "ingredients": "영문명: Coldbrew Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "콜드브루에 고소한 우유를 섞어, 깔끔함과 부드러움을 잡은 라떼."
  },
  {
    "id": "mega-coffee-107",
    "name": "[HOT] 콜드브루오리지널",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105941_1717984781078_rdCUXhwycL.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.6,
    "ratingCount": 322,
    "searchInfluxCount": 37966,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 97,
    "calories": 10.6,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 10.6,
      "sodium": "1.5mg",
      "sugar": "0.0g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "1.0g"
    },
    "ingredients": "영문명: Coldbrew",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "차가운 물에 장시간 우려내 깔끔한 목넘김을 느낄 수 있는 콜드브루."
  },
  {
    "id": "mega-coffee-108",
    "name": "[HOT] 헤이즐넛라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610110117_1717984877061_sLiVRNPq6J.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.7,
    "ratingCount": 339,
    "searchInfluxCount": 38277,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 98,
    "calories": 240.5,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 240.5,
      "sodium": "63.1mg",
      "sugar": "9.7g",
      "satFat": "5.1g",
      "saturatedFat": "5.1g",
      "protein": "9.1g"
    },
    "ingredients": "영문명: Hazelnut Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "부드러운 카페라떼에 헤이즐넛의 풍부한 향과 달콤함을 담아 향긋하게 즐길 수 있는 라떼."
  },
  {
    "id": "mega-coffee-109",
    "name": "[HOT] 헤이즐넛아메리카노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610110133_1717984893137_AqJAuHaq0t.jpg",
    "releaseDate": "2026.09 공식",
    "price": 1500,
    "overallRating": 4.8,
    "ratingCount": 356,
    "searchInfluxCount": 38588,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 90,
    "calories": 82.7,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 82.7,
      "sodium": "2.6mg",
      "sugar": "9.5g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.9g"
    },
    "ingredients": "영문명: Hazelnut Americano",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 1500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "아메리카노에 헤이즐넛의 풍성한 향과 달콤함을 담아 향긋하고 부드럽게 즐기는 커피."
  },
  {
    "id": "mega-coffee-110",
    "name": "[ICE] 꿀아메리카노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610133054_1717993854434_bTty_9u3br.jpg",
    "releaseDate": "2026.09 공식",
    "price": 1500,
    "overallRating": 4.9,
    "ratingCount": 373,
    "searchInfluxCount": 38899,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 91,
    "calories": 162.2,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 162.2,
      "sodium": "7.2mg",
      "sugar": "30.6g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "0.9g"
    },
    "ingredients": "영문명: Honey Americano",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 1500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "아메리카노의 묵직한 바디감에 달콤한 사양벌꿀이 소프트하게 어우러진 커피."
  },
  {
    "id": "mega-coffee-111",
    "name": "[ICE] 바닐라라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132249_1717993369864_VIG6IR2byt.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.5,
    "ratingCount": 390,
    "searchInfluxCount": 39210,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 92,
    "calories": 239.2,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 239.2,
      "sodium": "74.1mg",
      "sugar": "23.7g",
      "satFat": "3.9g",
      "saturatedFat": "3.9g",
      "protein": "7.1g"
    },
    "ingredients": "영문명: Vanilla Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "바닐라의 짙은 향과 풍부한 폼 밀크의 조화가 인상적인 달콤한 라떼."
  },
  {
    "id": "mega-coffee-112",
    "name": "[ICE] 바닐라아메리카노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610133038_1717993838652__Ax_Xwuz6T.jpg",
    "releaseDate": "2026.09 공식",
    "price": 1500,
    "overallRating": 4.6,
    "ratingCount": 407,
    "searchInfluxCount": 39521,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 93,
    "calories": 122.7,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 122.7,
      "sodium": "3.6mg",
      "sugar": "20.2g",
      "satFat": "0.1g",
      "saturatedFat": "0.1g",
      "protein": "1.1g"
    },
    "ingredients": "영문명: Vanilla Americano",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 1500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "아메리카노에 바닐라의 부드러운 향과 달콤함을 조화롭게 담아낸 커피."
  },
  {
    "id": "mega-coffee-113",
    "name": "[ICE] 카라멜마끼아또",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132714_1717993634339_dshEGyCDsC.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.7,
    "ratingCount": 424,
    "searchInfluxCount": 39832,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 94,
    "calories": 205,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 205,
      "sodium": "59.7mg",
      "sugar": "27.5g",
      "satFat": "2.9g",
      "saturatedFat": "2.9g",
      "protein": "5.0g"
    },
    "ingredients": "영문명: Caramel Macchiato",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "폼 밀크 속에 진한 에스프레소와 달콤한 카라멜을 가미해 부드럽게 즐기는 커피."
  },
  {
    "id": "mega-coffee-114",
    "name": "[ICE] 카페라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132819_1717993699956_cEyZRaBZh5.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.8,
    "ratingCount": 441,
    "searchInfluxCount": 40143,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 95,
    "calories": 145.1,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 145.1,
      "sodium": "88.5mg",
      "sugar": "9.2g",
      "satFat": "3.8g",
      "saturatedFat": "3.8g",
      "protein": "8.5g"
    },
    "ingredients": "영문명: Caffe Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "진한 에스프레소와 부드러운 우유가 어우러져 고소한 풍미를 완성한 라떼."
  },
  {
    "id": "mega-coffee-115",
    "name": "[ICE] 카페모카",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132727_1717993647297_GiQ8g7jOCk.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.9,
    "ratingCount": 458,
    "searchInfluxCount": 40454,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 96,
    "calories": 0,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 0,
      "sodium": "113.3mg",
      "sugar": "33.9g",
      "satFat": "8.8g",
      "saturatedFat": "8.8g",
      "protein": "7.1g"
    },
    "ingredients": "영문명: Caffe Mocha",
    "allergens": [
      "우유",
      "대두"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "초코를 만나 풍부해진 에스프레소와 고소한 우유, 부드러운 휘핑크림까지 더해 달콤하게 즐기는 커피."
  },
  {
    "id": "mega-coffee-116",
    "name": "[ICE] 카푸치노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132739_1717993659672_JFeCQ5qV53.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.5,
    "ratingCount": 475,
    "searchInfluxCount": 40765,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 97,
    "calories": 132.4,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 132.4,
      "sodium": "54.8mg",
      "sugar": "1.1g",
      "satFat": "4.2g",
      "saturatedFat": "4.2g",
      "protein": "7.0g"
    },
    "ingredients": "영문명: Cappuccino",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "에스프레소 위에 올려진 우유 거품, 그리고 시나몬 파우더로 완성한 조화로운 맛의 커피."
  },
  {
    "id": "mega-coffee-117",
    "name": "[ICE] 콜드브루라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132935_1717993775051_eflW8NpTDq.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.6,
    "ratingCount": 492,
    "searchInfluxCount": 41076,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 98,
    "calories": 167.6,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 167.6,
      "sodium": "35.4mg",
      "sugar": "2.3g",
      "satFat": "4.1g",
      "saturatedFat": "4.1g",
      "protein": "7.0g"
    },
    "ingredients": "영문명: Coldbrew Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "콜드브루에 고소한 우유를 섞어, 깔끔함과 부드러움을 잡은 라떼."
  },
  {
    "id": "mega-coffee-118",
    "name": "[ICE] 콜드브루오리지널",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132948_1717993788811_j_eYzA1Esd.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.7,
    "ratingCount": 509,
    "searchInfluxCount": 41387,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 90,
    "calories": 7.2,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 7.2,
      "sodium": "0.4mg",
      "sugar": "0.0g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.8g"
    },
    "ingredients": "영문명: Coldbrew",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "차가운 물에 장시간 우려내 깔끔한 목넘김을 느낄 수 있는 콜드브루."
  },
  {
    "id": "mega-coffee-119",
    "name": "[ICE] 헤이즐넛라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240430104100_1714441260123_buRoeWVyce.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.8,
    "ratingCount": 526,
    "searchInfluxCount": 41698,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 91,
    "calories": 237.4,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 237.4,
      "sodium": "57.0mg",
      "sugar": "10.8g",
      "satFat": "4.6g",
      "saturatedFat": "4.6g",
      "protein": "7.3g"
    },
    "ingredients": "영문명: Hazelnut Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "부드러운 카페라떼에 헤이즐넛의 풍부한 향과 달콤함을 담아 향긋하게 즐길 수 있는 라떼."
  },
  {
    "id": "mega-coffee-120",
    "name": "[ICE] 헤이즐넛아메리카노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610133023_1717993823204_vNvExvVODX.jpg",
    "releaseDate": "2026.09 공식",
    "price": 1500,
    "overallRating": 4.9,
    "ratingCount": 543,
    "searchInfluxCount": 42009,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 92,
    "calories": 113.6,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 113.6,
      "sodium": "0.6mg",
      "sugar": "15.8g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "1.0g"
    },
    "ingredients": "영문명: Hazelnut Americano",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 1500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "아메리카노에 헤이즐넛의 풍성한 향과 달콤함을 담아 향긋하고 부드럽게 즐기는 커피."
  },
  {
    "id": "mega-coffee-121",
    "name": "[ICE] 큐브라떼",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132523_1717993523193_4mNdkfnxvz.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3200,
    "overallRating": 4.5,
    "ratingCount": 560,
    "searchInfluxCount": 42320,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 93,
    "calories": 304.4,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 304.4,
      "sodium": "72.1mg",
      "sugar": "15.0g",
      "satFat": "7.8g",
      "saturatedFat": "7.8g",
      "protein": "11.2g"
    },
    "ingredients": "영문명: Cube Latte",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3200,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "연유를 섞은 라떼에 에스프레소를 얼린 커피큐브를 올려, 녹을수록 더 진한 커피가 느껴지는 라떼."
  },
  {
    "id": "mega-coffee-122",
    "name": "[ICE] 아메리카노",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "커피",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610133007_1717993807130_nwB5CATOJJ.jpg",
    "releaseDate": "2026.09 공식",
    "price": 1500,
    "overallRating": 4.6,
    "ratingCount": 577,
    "searchInfluxCount": 42631,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 94,
    "calories": 12.2,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 12.2,
      "sodium": "1.5mg",
      "sugar": "0.0g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "1.0g"
    },
    "ingredients": "영문명: Americano",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 1500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "[기본2샷]메가MGC커피 블렌드 원두로 추출한 에스프레소에 물을 더해, 풍부한 바디감을 느낄 수 있는 스탠다드 커피."
  },
  {
    "id": "mega-coffee-123",
    "name": "[ICE] 녹차프라페",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "스무디&프라페",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20260318150847_1773814127229_oIDmdAQwND.png",
    "releaseDate": "2026.09 공식",
    "price": 3900,
    "overallRating": 4.7,
    "ratingCount": 594,
    "searchInfluxCount": 42942,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 95,
    "calories": 521.7,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 521.7,
      "sodium": "115.1mg",
      "sugar": "76.7g",
      "satFat": "8.9g",
      "saturatedFat": "8.9g",
      "protein": "10.8g"
    },
    "ingredients": "영문명: Green Tea Frappe",
    "allergens": [
      "우유",
      "대두"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3900,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "향긋한 녹차 위에 우유와 휘핑크림을 더해 더 부드럽게 즐길 수 있는 프라페."
  },
  {
    "id": "mega-coffee-124",
    "name": "[ICE] 딸기요거트스무디",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "스무디&프라페",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132117_1717993277823_KRGDVA4aeJ.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3900,
    "overallRating": 4.8,
    "ratingCount": 611,
    "searchInfluxCount": 43253,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 96,
    "calories": 388.8,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 388.8,
      "sodium": "66.7mg",
      "sugar": "62.5g",
      "satFat": "2.0g",
      "saturatedFat": "2.0g",
      "protein": "6g"
    },
    "ingredients": "영문명: Strawberry Yogurt Smoothie",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3900,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "요거트의 상큼함과 딸기의 상큼함을 상냥하게 어우른 상큼 스무디."
  },
  {
    "id": "mega-coffee-125",
    "name": "[ICE] 딸기퐁크러쉬",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "스무디&프라페",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132132_1717993292542_TOXDd7N_72.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3900,
    "overallRating": 4.9,
    "ratingCount": 628,
    "searchInfluxCount": 43564,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 97,
    "calories": 536.9,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 536.9,
      "sodium": "156.1mg",
      "sugar": "45.9g",
      "satFat": "7.1g",
      "saturatedFat": "7.1g",
      "protein": "10.9g"
    },
    "ingredients": "영문명: Strawberry Pongcrush",
    "allergens": [
      "우유",
      "밀",
      "대두"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3900,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "바삭하고 달달한 퐁에 상큼한 딸기와 부드러운 우유, 얼음을 함께 블렌딩해 시원하게 즐기는 프라페."
  },
  {
    "id": "mega-coffee-126",
    "name": "[ICE] 리얼초코프라페",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "스무디&프라페",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132157_1717993317456_RCHCZKkudt.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3900,
    "overallRating": 4.5,
    "ratingCount": 645,
    "searchInfluxCount": 43875,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 98,
    "calories": 580.8,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 580.8,
      "sodium": "223.3mg",
      "sugar": "75.4g",
      "satFat": "14.6g",
      "saturatedFat": "14.6g",
      "protein": "8.0g"
    },
    "ingredients": "영문명: Real Chocolate Frappe",
    "allergens": [
      "우유",
      "대두",
      "밀"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3900,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "진한 초코소스와 부드러운 바닐라향의 만남으로 질리지 않는 달콤함을 완성한 프라페."
  },
  {
    "id": "mega-coffee-127",
    "name": "[ICE] 망고요거트스무디",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "스무디&프라페",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132210_1717993330781_04rKlgIKk6.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3900,
    "overallRating": 4.6,
    "ratingCount": 662,
    "searchInfluxCount": 44186,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 90,
    "calories": 365.2,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 365.2,
      "sodium": "76.1mg",
      "sugar": "56.4g",
      "satFat": "2.3g",
      "saturatedFat": "2.3g",
      "protein": "6g"
    },
    "ingredients": "영문명: Mango Yogurt Smoothie",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3900,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "열대과일 망고의 진한 단 맛과 산뜻한 요거트의 하모니가 인상적인 스무디."
  },
  {
    "id": "mega-coffee-128",
    "name": "[ICE] 민트프라페",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "스무디&프라페",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610115353_1717988033471_n8WL4rST4C.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3900,
    "overallRating": 4.7,
    "ratingCount": 679,
    "searchInfluxCount": 44497,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 91,
    "calories": 622.3,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 622.3,
      "sodium": "192.9mg",
      "sugar": "64.5g",
      "satFat": "16.1g",
      "saturatedFat": "16.1g",
      "protein": "5.0g"
    },
    "ingredients": "영문명: Mint Frappe",
    "allergens": [
      "우유",
      "대두",
      "밀"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3900,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "상쾌한 민트에 달콤하게 씹는 재미를 더한 초콜릿칩의 즐거운 하모니가 매력적인 프라페."
  },
  {
    "id": "mega-coffee-129",
    "name": "[ICE] 바나나퐁크러쉬",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "스무디&프라페",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132238_1717993358631_MGPEpkvNh1.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3900,
    "overallRating": 4.8,
    "ratingCount": 696,
    "searchInfluxCount": 44808,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 92,
    "calories": 593.8,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 593.8,
      "sodium": "167.3mg",
      "sugar": "64.2g",
      "satFat": "4.6g",
      "saturatedFat": "4.6g",
      "protein": "10.8g"
    },
    "ingredients": "영문명: Banana Pongcrush",
    "allergens": [
      "우유",
      "밀",
      "대두"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3900,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "바삭하고 달달한 퐁에 부드러운 바나나와 우유, 얼음을 함께 블렌딩해 부드럽고 시원하게 즐기는 프라페."
  },
  {
    "id": "mega-coffee-130",
    "name": "[ICE] 초코허니퐁크러쉬",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "스무디&프라페",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132651_1717993611266_QFRonrkBzf.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3900,
    "overallRating": 4.9,
    "ratingCount": 713,
    "searchInfluxCount": 5119,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 93,
    "calories": 594.6,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 594.6,
      "sodium": "216.2mg",
      "sugar": "67.6g",
      "satFat": "7.8g",
      "saturatedFat": "7.8g",
      "protein": "11.9g"
    },
    "ingredients": "영문명: Chocolate Honey Pong Crush",
    "allergens": [
      "우유",
      "밀",
      "대두"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3900,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "리얼 벌꿀이 들어가 더 달콤한 퍼프허니 시리얼과 부드럽게 달달한 초코가 함께 만드는 즐거운 맛의 프라페."
  },
  {
    "id": "mega-coffee-131",
    "name": "[ICE] 커피프라페",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "스무디&프라페",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132804_1717993684465__jH6f5a2VM.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3900,
    "overallRating": 4.5,
    "ratingCount": 730,
    "searchInfluxCount": 5430,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 94,
    "calories": 414.3,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 414.3,
      "sodium": "168.0mg",
      "sugar": "35.6g",
      "satFat": "11.9g",
      "saturatedFat": "11.9g",
      "protein": "6.5g"
    },
    "ingredients": "영문명: Coffee Frappe",
    "allergens": [
      "우유",
      "대두"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3900,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "바삭한 쿠키와 부드러운 바닐라에 향긋한 에스프레소를 섞어 만든 힐링 프라페."
  },
  {
    "id": "mega-coffee-132",
    "name": "[ICE] 플레인요거트스무디",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "스무디&프라페",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240612101151_1718154711606_iC5h64zrID.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3900,
    "overallRating": 4.6,
    "ratingCount": 747,
    "searchInfluxCount": 5741,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 95,
    "calories": 514.9,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 514.9,
      "sodium": "103.4mg",
      "sugar": "84.5g",
      "satFat": "2.2g",
      "saturatedFat": "2.2g",
      "protein": "7.5g"
    },
    "ingredients": "영문명: Plain Yogurt Smoothie",
    "allergens": [
      "우유"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3900,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "더 시원하게 요거트의 새콤달콤한 맛을 오롯이 만끽할 수 있는 스무디."
  },
  {
    "id": "mega-coffee-133",
    "name": "[ICE] 플레인퐁크러쉬",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "스무디&프라페",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610113328_1717986808464_JOQsVpbWKq.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3900,
    "overallRating": 4.7,
    "ratingCount": 764,
    "searchInfluxCount": 6052,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 96,
    "calories": 468.6,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 468.6,
      "sodium": "154.8mg",
      "sugar": "46.2g",
      "satFat": "6.0g",
      "saturatedFat": "6.0g",
      "protein": "10.6g"
    },
    "ingredients": "영문명: Plain Pongcrush",
    "allergens": [
      "우유",
      "밀",
      "대두"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3900,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "우유에 죠리퐁 씨리얼이 믹싱 된 얼음을 갈아 만든 시원한 프라페음료"
  },
  {
    "id": "mega-coffee-134",
    "name": "[ICE] 라임모히또",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "음료",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132145_1717993305587_JyUa7vPj3s.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.8,
    "ratingCount": 781,
    "searchInfluxCount": 6363,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 97,
    "calories": 290.5,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 290.5,
      "sodium": "41.7mg",
      "sugar": "70.4g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.4g"
    },
    "ingredients": "영문명: Lime Mojito",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "상큼한 라임과 달콤한 향기의 애플민트가 어우러져 상쾌함을 한잔에 가득 채운 무알콜 모히또 음료."
  },
  {
    "id": "mega-coffee-135",
    "name": "[ICE] 레몬에이드",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "에이드&주스",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610114557_1717987557279_GKXThr0HAc.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.9,
    "ratingCount": 798,
    "searchInfluxCount": 6674,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 98,
    "calories": 196.8,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 196.8,
      "sodium": "71.3mg",
      "sugar": "35.1g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.3g"
    },
    "ingredients": "영문명: Lemonade",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "시트러스향 가득한 레몬의 상큼함과 톡쏘는 탄산의 상쾌함이 만난 청량 에이드."
  },
  {
    "id": "mega-coffee-136",
    "name": "[ICE] 블루레몬에이드",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "에이드&주스",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132302_1717993382502_3JianCydlm.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.5,
    "ratingCount": 815,
    "searchInfluxCount": 6985,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 90,
    "calories": 225,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 225,
      "sodium": "77.2mg",
      "sugar": "36.5g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.2g"
    },
    "ingredients": "영문명: Blue Lemon Ade",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "레몬에이드의 상큼한 청량감에 블루큐라소의 진한 향미를 더한 에이드."
  },
  {
    "id": "mega-coffee-137",
    "name": "[ICE] 자몽에이드",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "에이드&주스",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20260318150836_1773814116733_8c9H4Rw3gH.png",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.6,
    "ratingCount": 832,
    "searchInfluxCount": 7296,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 91,
    "calories": 203.8,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 203.8,
      "sodium": "3.3mg",
      "sugar": "40.7g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.3g"
    },
    "ingredients": "영문명: Grapefruit Ade",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "자몽의 달콤쌉싸름한 맛과 탄산의 톡쏘는 목넘김이 어우러진 트로피컬 에이드."
  },
  {
    "id": "mega-coffee-138",
    "name": "[ICE] 청포도에이드",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "에이드&주스",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610115123_1717987883226_DMMQB84jmS.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.7,
    "ratingCount": 849,
    "searchInfluxCount": 7607,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 92,
    "calories": 317,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 317,
      "sodium": "17.9mg",
      "sugar": "77.7g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.2g"
    },
    "ingredients": "영문명: Green Grape Ade",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "산뜻한 청포도와 상쾌한 탄산의 달달한 조화가 인상적인 에이드."
  },
  {
    "id": "mega-coffee-139",
    "name": "[ICE] 체리콜라",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "음료",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20260112140953_1768194593743_H_mUOKjS42.png",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.8,
    "ratingCount": 866,
    "searchInfluxCount": 7918,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 93,
    "calories": 323.6,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 323.6,
      "sodium": "5.4mg",
      "sugar": "55.6g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.2g"
    },
    "ingredients": "영문명: Cherry Cola",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "체리의 새콤함과 청량감을 동시에 즐길 수 있는 환상적인 에이드."
  },
  {
    "id": "mega-coffee-140",
    "name": "[ICE] 메가에이드",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "에이드&주스",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610115027_1717987827980_oPj14Xi9y1.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.9,
    "ratingCount": 883,
    "searchInfluxCount": 8229,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 94,
    "calories": 296.9,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 296.9,
      "sodium": "34.7mg",
      "sugar": "59.3g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.4g"
    },
    "ingredients": "영문명: MEGA Ade",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "상큼한 레몬, 상쾌한 라임, 달콤쌉싸름한 자몽의 3색 맛을 한데 어우른 메가MGC커피 시그니처 에이드."
  },
  {
    "id": "mega-coffee-141",
    "name": "[HOT] 녹차",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610104441_1717983881331_6kaOJy5ayw.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2500,
    "overallRating": 4.5,
    "ratingCount": 900,
    "searchInfluxCount": 8540,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 95,
    "calories": 0.7,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 0.7,
      "sodium": "4.2mg",
      "sugar": "0.0g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.2g"
    },
    "ingredients": "영문명: Green Tea",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "고소한 감칠맛과 부드러운 목넘김으로 산뜻하게 마음을 위로하는 국내산 녹차."
  },
  {
    "id": "mega-coffee-142",
    "name": "[HOT] 사과유자차",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105629_1717984589552_V9ta2Qw90q.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2500,
    "overallRating": 4.6,
    "ratingCount": 917,
    "searchInfluxCount": 8851,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 96,
    "calories": 227.1,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 227.1,
      "sodium": "89.3mg",
      "sugar": "47.0g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.3g"
    },
    "ingredients": "영문명: Applecitron Tea",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "애플티의 향긋함과 유자청의 상큼달콤함을 한컵에 담아낸 과일티."
  },
  {
    "id": "mega-coffee-143",
    "name": "[HOT] 얼그레이",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105659_1717984619283_Ssc082a5GK.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.7,
    "ratingCount": 134,
    "searchInfluxCount": 9162,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 97,
    "calories": 0.7,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 0.7,
      "sodium": "4.2mg",
      "sugar": "0.0g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.2g"
    },
    "ingredients": "영문명: Earl Grey",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "홍차 특유의 풍부한 플레이버를 만끽할 수 있는 허브티."
  },
  {
    "id": "mega-coffee-144",
    "name": "[HOT] 캐모마일",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105908_1717984748214_qc34s7Vkq5.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.8,
    "ratingCount": 151,
    "searchInfluxCount": 9473,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 98,
    "calories": 0.5,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 0.5,
      "sodium": "5.5mg",
      "sugar": "0.0g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.0g"
    },
    "ingredients": "영문명: Chamomile",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "마음을 진정 시켜주는 산뜻한 풀내음을 느낄 수 있는 허브티."
  },
  {
    "id": "mega-coffee-145",
    "name": "[HOT] 페퍼민트",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610110026_1717984826888_gfP6LsxEV3.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.9,
    "ratingCount": 168,
    "searchInfluxCount": 9784,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 90,
    "calories": 0.2,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 0.2,
      "sodium": "5.3mg",
      "sugar": "0.0g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.0g"
    },
    "ingredients": "영문명: Peppermint Tea",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "멘톨향의 묵직한 청량감, 상쾌한 맛과 향이 인상적인 허브티."
  },
  {
    "id": "mega-coffee-146",
    "name": "[ICE] 녹차",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610112857_1717986537987_H1q4z1rnt2.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2500,
    "overallRating": 4.5,
    "ratingCount": 185,
    "searchInfluxCount": 10095,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 91,
    "calories": 1,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 1,
      "sodium": "2.1mg",
      "sugar": "0.0g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.3g"
    },
    "ingredients": "영문명: Green Tea",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "고소한 감칠맛과 부드러운 목넘김으로 산뜻하게 마음을 위로하는 국내산 녹차."
  },
  {
    "id": "mega-coffee-147",
    "name": "[ICE] 사과유자차",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132332_1717993412234_5kkTR1DkNH.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2500,
    "overallRating": 4.6,
    "ratingCount": 202,
    "searchInfluxCount": 10406,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 92,
    "calories": 242.2,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 242.2,
      "sodium": "74.5mg",
      "sugar": "37.5g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.3g"
    },
    "ingredients": "영문명: Applecitron Tea",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "애플티의 향긋함과 유자청의 상큼달콤함을 한컵에 담아낸 과일티."
  },
  {
    "id": "mega-coffee-148",
    "name": "[ICE] 얼그레이",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132511_1717993511025_ChoqheNJQf.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.7,
    "ratingCount": 219,
    "searchInfluxCount": 10717,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 93,
    "calories": 1.3,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 1.3,
      "sodium": "2.1mg",
      "sugar": "0.0g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.3g"
    },
    "ingredients": "영문명: Earl Grey",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "홍차 특유의 풍부한 플레이버를 만끽할 수 있는 허브티."
  },
  {
    "id": "mega-coffee-149",
    "name": "[ICE] 캐모마일",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132753_1717993673758__j_omi1oWY.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.8,
    "ratingCount": 236,
    "searchInfluxCount": 11028,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 94,
    "calories": 1.3,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 1.3,
      "sodium": "2.5mg",
      "sugar": "0.0g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.1g"
    },
    "ingredients": "영문명: Chamomile",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "마음을 진정 시켜주는 산뜻한 풀내음을 느낄 수 있는 허브티."
  },
  {
    "id": "mega-coffee-150",
    "name": "[ICE] 페퍼민트",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610115138_1717987898720_OdAWvoBqNh.jpg",
    "releaseDate": "2026.09 공식",
    "price": 3500,
    "overallRating": 4.9,
    "ratingCount": 253,
    "searchInfluxCount": 11339,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 95,
    "calories": 2.5,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 2.5,
      "sodium": "3.0mg",
      "sugar": "0.0g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.1g"
    },
    "ingredients": "영문명: Peppermint Tea",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 3500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "멘톨향의 묵직한 청량감, 상쾌한 맛과 향이 인상적인 허브티."
  },
  {
    "id": "mega-coffee-151",
    "name": "[ICE] 복숭아아이스티",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132446_1717993486995_hvfli27vPn.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2500,
    "overallRating": 4.5,
    "ratingCount": 270,
    "searchInfluxCount": 11650,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 96,
    "calories": 297.1,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 297.1,
      "sodium": "67.5mg",
      "sugar": "62.6g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.1g"
    },
    "ingredients": "영문명: Peach Iced Tea",
    "allergens": [
      "복숭아",
      "아황산류"
    ],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "깊은 맛의 홍차와 달콤한 복숭아의 은은한 향이 어우러진 시원한 여름철 인기 음료."
  },
  {
    "id": "mega-coffee-152",
    "name": "[HOT] 유자차",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105725_1717984645282_YfXeYsJzVV.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2500,
    "overallRating": 4.6,
    "ratingCount": 287,
    "searchInfluxCount": 11961,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 97,
    "calories": 286.4,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 286.4,
      "sodium": "104.0mg",
      "sugar": "47.9g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.3g"
    },
    "ingredients": "영문명: Citron Tea",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "비타민이 가득 든 상큼달콤한 유자를 듬뿍 넣어 향긋한 즐거움을 전하는 과일티."
  },
  {
    "id": "mega-coffee-153",
    "name": "[HOT] 레몬차",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105600_1717984560889__UGBqFya7F.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2500,
    "overallRating": 4.7,
    "ratingCount": 304,
    "searchInfluxCount": 12272,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 98,
    "calories": 275.5,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 275.5,
      "sodium": "94.2mg",
      "sugar": "56.1g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.3g"
    },
    "ingredients": "영문명: Lemon Tea",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "상큼한 레몬의 맛과 향을 오롯이 살린 비타민C 가득한 과일티."
  },
  {
    "id": "mega-coffee-154",
    "name": "[HOT] 자몽차",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610105747_1717984667913_eDh3AjWACb.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2500,
    "overallRating": 4.8,
    "ratingCount": 321,
    "searchInfluxCount": 12583,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 90,
    "calories": 294,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 294,
      "sodium": "84.2mg",
      "sugar": "58.1g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.4g"
    },
    "ingredients": "영문명: Grapefruit Tea",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "달콤쌉싸름한 자몽의 조화로운 맛을 한 잔 가득 느낄 수 있는 과일티."
  },
  {
    "id": "mega-coffee-155",
    "name": "[HOT] 허니자몽블랙티",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610110100_1717984860663_v7Af5f77sc.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2500,
    "overallRating": 4.9,
    "ratingCount": 338,
    "searchInfluxCount": 12894,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 91,
    "calories": 302.2,
    "volume": "591ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 302.2,
      "sodium": "97.5mg",
      "sugar": "53.6g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.6g"
    },
    "ingredients": "영문명: Honey Grapefruit Black Tea",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "달콤한 꿀청에 재운 자몽에 홍차의 부드러움을 어우른 상큼한 과일티."
  },
  {
    "id": "mega-coffee-156",
    "name": "[ICE] 유자차",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610115050_1717987850728_2zPgDAyVmu.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2500,
    "overallRating": 4.5,
    "ratingCount": 355,
    "searchInfluxCount": 13205,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 92,
    "calories": 303.1,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.9,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 303.1,
      "sodium": "99.1mg",
      "sugar": "59.4g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.3g"
    },
    "ingredients": "영문명: Citron Tea",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "비타민이 가득 든 상큼달콤한 유자를 듬뿍 넣어 향긋한 즐거움을 전하는 과일티."
  },
  {
    "id": "mega-coffee-157",
    "name": "[ICE] 레몬차",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610114530_1717987530809_R6DsXnSZN_.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2500,
    "overallRating": 4.6,
    "ratingCount": 372,
    "searchInfluxCount": 13516,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 93,
    "calories": 327.5,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.6,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.7
    },
    "nutrition": {
      "calories": 327.5,
      "sodium": "101.3mg",
      "sugar": "68.9g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.3g"
    },
    "ingredients": "영문명: Lemon Tea",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "상큼한 레몬의 맛과 향을 오롯이 살린 비타민C 가득한 과일티."
  },
  {
    "id": "mega-coffee-158",
    "name": "[ICE] 자몽차",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610132550_1717993550755_D158pZtb1K.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2500,
    "overallRating": 4.7,
    "ratingCount": 389,
    "searchInfluxCount": 13827,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 94,
    "calories": 297.6,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.7,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.8
    },
    "nutrition": {
      "calories": 297.6,
      "sodium": "89.1mg",
      "sugar": "58.5g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.4g"
    },
    "ingredients": "영문명: Grapefruit Tea",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "신선한 상태에서 즉시 드세요.",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "달콤쌉싸름한 자몽의 조화로운 맛을 한 잔 가득 느낄 수 있는 과일티."
  },
  {
    "id": "mega-coffee-159",
    "name": "[ICE] 허니자몽블랙티",
    "brand": "메가MGC커피",
    "category": "음료",
    "subCategory": "티",
    "itemType": "restaurant",
    "image": "https://img.79plus.co.kr/megahp/manager/upload/menu/20240610113215_1717986735582_1qL_k3FLJ6.jpg",
    "releaseDate": "2026.09 공식",
    "price": 2500,
    "overallRating": 4.8,
    "ratingCount": 406,
    "searchInfluxCount": 14138,
    "stores": [
      "메가MGC커피"
    ],
    "repurchasePercent": 95,
    "calories": 265.8,
    "volume": "710ml",
    "isToday": false,
    "isHot": false,
    "detailedRating": {
      "taste": 4.8,
      "value": 5,
      "portion": 4.9,
      "repurchase": 4.9
    },
    "nutrition": {
      "calories": 265.8,
      "sodium": "133.0mg",
      "sugar": "42.7g",
      "satFat": "0.0g",
      "saturatedFat": "0.0g",
      "protein": "0.4g"
    },
    "ingredients": "영문명: Honey Grapefruit Black Tea",
    "allergens": [],
    "origin": "원두/원재료: 메가MGC커피 공식 공급원",
    "manufacturer": "메가MGC커피 (주)앤하우스",
    "storageMethod": "구입 후 즉시 음용 권장",
    "shelfLife": "제조 당일 음용",
    "precautions": "고카페인 함유 (어린이, 임산부, 카페인 민감자 섭취 주의)",
    "storeStocks": [
      {
        "store": "메가MGC커피",
        "status": "입고완료",
        "stockCount": 50,
        "price": 2500,
        "eventBadge": "인기메뉴",
        "deliveryTime": "매장 즉시 픽업 / 메가오더"
      }
    ],
    "description": "달콤한 꿀청에 재운 자몽에 홍차의 부드러움을 어우른 상큼한 과일티."
  }
];
