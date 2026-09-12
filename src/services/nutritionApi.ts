import { NutritionInfo } from '../types';

/**
 * 대한민국 식품의약품안전처 1일 영양성분 기준치 (2,000 kcal 기준)
 */
const DAILY_STANDARDS = {
  sodium: 2000,      // 나트륨 2,000 mg
  carbs: 324,        // 탄수화물 324 g
  sugar: 100,        // 당류 100 g
  fat: 54,           // 지방 54 g
  saturatedFat: 15,  // 포화지방 15 g
  cholesterol: 300,  // 콜레스테롤 300 mg
  protein: 55,       // 단백질 55 g
};

export interface FoodNutritionData {
  num: string;
  foodCode: string;
  foodName: string;
  makerName: string;
  groupName: string;
  categoryName: string;
  servingSize: string;
  totalWeight?: string;
  reportNo?: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  sugar: number;
  sodium: number;
  cholesterol: number;
  saturatedFat: number;
  transFat: number;
  nutrition: NutritionInfo;
  raw: any;
}

const DEFAULT_API_KEY = 'w%2FCsXqTtdtaxy830ZTaXQVsrrqV17MzgYoVVwpbcy6SDFSOCyE5iYsp1bNS%2BjgOsooBEE%2BsZYOa%2BEJ6NDk7hHQ%3D%3D';

/**
 * 숫자 파싱 헬퍼 (쉼표 제거 및 유효 숫자 추출)
 */
function parseNum(val: any): number {
  if (!val) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const cleaned = String(val).replace(/,/g, '').replace(/[^\d.-]/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * 수치 + 단위 및 1일 기준치 비율(%) 포맷팅
 */
function formatNutritionValue(value: number, unit: 'g' | 'mg', standard?: number): string {
  if (value <= 0) return `0${unit}`;
  const roundedVal = Math.round(value * 10) / 10;
  if (!standard) {
    return `${roundedVal}${unit}`;
  }
  const percent = Math.round((value / standard) * 100);
  return `${roundedVal}${unit} (${percent}%)`;
}

/**
 * 식약처 원본 아이템 데이터를 앱 규격의 FoodNutritionData로 매핑
 */
export function mapToFoodNutritionData(item: any): FoodNutritionData {
  const calories = Math.round(parseNum(item.AMT_NUM1)); // 열량 kcal
  const protein = Math.round(parseNum(item.AMT_NUM3) * 10) / 10; // 단백질 g
  const fat = Math.round(parseNum(item.AMT_NUM4) * 10) / 10; // 지방 g
  const carbs = Math.round(parseNum(item.AMT_NUM6) * 10) / 10; // 탄수화물 g
  const sugar = Math.round(parseNum(item.AMT_NUM7) * 10) / 10; // 당류 g
  const sodium = Math.round(parseNum(item.AMT_NUM13)); // 나트륨 mg
  const cholesterol = Math.round(parseNum(item.AMT_NUM23)); // 콜레스테롤 mg
  const saturatedFat = Math.round(parseNum(item.AMT_NUM24) * 10) / 10; // 포화지방산 g
  const transFat = Math.round(parseNum(item.AMT_NUM25) * 10) / 10; // 트랜스지방산 g

  const nutrition: NutritionInfo = {
    calories,
    sodium: formatNutritionValue(sodium, 'mg', DAILY_STANDARDS.sodium),
    carbs: formatNutritionValue(carbs, 'g', DAILY_STANDARDS.carbs),
    sugar: formatNutritionValue(sugar, 'g', DAILY_STANDARDS.sugar),
    fat: formatNutritionValue(fat, 'g', DAILY_STANDARDS.fat),
    protein: formatNutritionValue(protein, 'g', DAILY_STANDARDS.protein),
    transFat: formatNutritionValue(transFat, 'g'),
    satFat: formatNutritionValue(saturatedFat, 'g', DAILY_STANDARDS.saturatedFat),
    saturatedFat: formatNutritionValue(saturatedFat, 'g', DAILY_STANDARDS.saturatedFat),
    cholesterol: formatNutritionValue(cholesterol, 'mg', DAILY_STANDARDS.cholesterol),
  };

  return {
    num: item.NUM || '',
    foodCode: item.FOOD_CD || '',
    foodName: item.FOOD_NM_KR || '',
    makerName: item.MAKER_NM || item.SELLER_MANUFAC_NM || '',
    groupName: item.DB_GRP_NM || '가공식품',
    categoryName: item.FOOD_CAT1_NM || item.FOOD_CAT3_NM || '',
    servingSize: item.SERVING_SIZE || '',
    totalWeight: item.Z10500 || '',
    reportNo: item.ITEM_REPORT_NO || '',
    calories,
    carbs,
    protein,
    fat,
    sugar,
    sodium,
    cholesterol,
    saturatedFat,
    transFat,
    nutrition,
    raw: item,
  };
}

/**
 * 식약처 식품영양성분DB 검색
 * @param query 식품명 검색어 (예: '신라면', '코카콜라')
 * @param pageNo 페이지 번호
 * @param numOfRows 한 번에 가져올 결과 수
 */
export async function searchFoodNutrition(
  query: string,
  pageNo: number = 1,
  numOfRows: number = 20
): Promise<{ totalCount: number; items: FoodNutritionData[] }> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { totalCount: 0, items: [] };
  }

  // 1차 시도: Vercel Serverless Function Proxy (/api/nutrition) (브라우저 환경일 때)
  if (typeof window !== 'undefined') {
    try {
      const proxyUrl = `/api/nutrition?query=${encodeURIComponent(trimmed)}&pageNo=${pageNo}&numOfRows=${numOfRows}`;
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const data = await res.json();
        if (data?.body?.items && Array.isArray(data.body.items)) {
          return {
            totalCount: Number(data.body.totalCount) || data.body.items.length,
            items: data.body.items.map(mapToFoodNutritionData)
          };
        }
      }
    } catch (proxyError) {
      console.warn('[NutritionAPI] Proxy call failed or not running in Vercel, falling back to direct call:', proxyError);
    }
  }

  // 2차 시도: Direct API Call (모바일 앱 또는 프록시 미작동 시)
  try {
    const apiKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_FOOD_NUTRITION_API_KEY) ||
                   (typeof process !== 'undefined' && process.env && (process.env.VITE_FOOD_NUTRITION_API_KEY || process.env.FOOD_NUTRITION_API_KEY)) ||
                   DEFAULT_API_KEY;
    const directUrl = `https://apis.data.go.kr/1471000/FoodNtrCpntDbInfo02/getFoodNtrCpntDbInq02?serviceKey=${apiKey}&type=json&FOOD_NM_KR=${encodeURIComponent(trimmed)}&pageNo=${pageNo}&numOfRows=${numOfRows}`;

    const res = await fetch(directUrl);
    if (!res.ok) {
      throw new Error(`Direct API returned HTTP status ${res.status}`);
    }

    const data = await res.json();
    if (data?.body?.items && Array.isArray(data.body.items)) {
      return {
        totalCount: Number(data.body.totalCount) || data.body.items.length,
        items: data.body.items.map(mapToFoodNutritionData)
      };
    }

    return { totalCount: 0, items: [] };
  } catch (directError) {
    console.error('[NutritionAPI] Direct call failed:', directError);
    throw directError;
  }
}
