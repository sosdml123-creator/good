import { RecipePost } from '../types';

export const INITIAL_RECIPES: RecipePost[] = [
  {
    id: 'recipe-01',
    title: '🔥 불닭 콘치즈마요 황금 레시피',
    description: '매운 불닭볶음면에 달콤고소한 콘치즈를 얹어 극상의 단짠맵을 완성하는 편의점 1위 꿀조합!',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=700&auto=format&fit=crop&q=80',
    author: '편의점미식가',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authorLevel: 'LV.4 맛잘알',
    prepTime: '4분',
    difficulty: '초간단',
    totalCost: 4500,
    ingredients: [
      { name: '까르보 불닭볶음면 (큰컵)', store: 'CU/GS25', price: 1800, productId: 'orion-001', amount: '1개', isKeyItem: true },
      { name: '스위트콘 옥수수 통조림/파우치', store: '편의점 전점', price: 1500, amount: '3스푼' },
      { name: '스트링치즈 또는 모짜렐라 피자치즈', store: '편의점 전점', price: 1200, amount: '1봉', isKeyItem: true },
      { name: '마요네즈', store: '편의점/가정', price: 0, amount: '1스푼' }
    ],
    steps: [
      '불닭볶음면 컵라면에 끓는 물을 붓고 3분간 익힌 뒤 물을 4~5스푼 남기고 따라냅니다.',
      '액상스프와 분말스프를 넣고 잘 비벼준 뒤, 그 위에 스위트콘 3스푼과 마요네즈 1스푼을 얹습니다.',
      '모짜렐라 치즈를 듬뿍 덮고 편의점 전자레인지에 1분 30초 돌려 치즈가 녹아내리면 완성!'
    ],
    tips: '옥수수 물기를 키친타월로 살짝 닦아내고 얹으면 국물이 흥건해지지 않고 꾸덕해져요!',
    likes: 384,
    isLiked: false,
    commentsCount: 29,
    tags: ['#불닭꿀조합', '#콘치즈', '#야식강추', '#편의점요리'],
    createdAt: '2026.09.07'
  },
  {
    id: 'recipe-02',
    title: '🍑 SNS 품절대란 아망추 (아이스티 + 망고)',
    description: '복숭아 아이스티에 달콤한 냉동 애플망고를 얼음 대신 가득 넣어 녹여 먹는 레전드 음료',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=700&auto=format&fit=crop&q=80',
    author: '디저트덕후',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    authorLevel: 'LV.5 카페마스터',
    prepTime: '2분',
    difficulty: '초간단',
    totalCost: 3600,
    ingredients: [
      { name: '립톤/복숭아 아이스티 파우치 & 얼음컵', store: '편의점 전점', price: 1600, amount: '1세트', isKeyItem: true },
      { name: '편의점 냉동 애플망고 스틱/조각', store: 'GS25/CU', price: 2000, amount: '1봉', isKeyItem: true }
    ],
    steps: [
      '빅사이즈 얼음컵에 복숭아 아이스티를 80% 정도만 채워줍니다.',
      '냉동 애플망고 조각들을 얼음컵 위에 빽빽하게 꽂아 넣어줍니다.',
      '빨대로 망고를 아이스티에 푹 적셔 먹으면서 녹아 나오는 진한 망고 과즙을 즐기세요!'
    ],
    tips: '아이스티가 망고에 스며들면서 샤베트처럼 변할 때 숟가락으로 퍼먹으면 천국입니다!',
    likes: 512,
    isLiked: false,
    commentsCount: 43,
    tags: ['#아망추', '#편의점음료', '#카페꿀조합', '#홈카페'],
    createdAt: '2026.09.06'
  },
  {
    id: 'recipe-03',
    title: '🥯 연세우유 흑임자 약과 크림샌드',
    description: '반으로 가른 크림 베이글/빵 사이에 미니 꿀약과를 통째로 끼워 넣는 할매니얼 끝판왕 디저트',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=700&auto=format&fit=crop&q=80',
    author: '할매니얼러버',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    authorLevel: 'LV.3 신상러너',
    prepTime: '1분',
    difficulty: '초간단',
    totalCost: 4600,
    ingredients: [
      { name: '연세우유 생크림빵 또는 크림베이글', store: 'CU 단독', price: 3400, amount: '1개', isKeyItem: true },
      { name: '미니 꿀약과', store: 'CU/GS25', price: 1200, amount: '2~3개', isKeyItem: true }
    ],
    steps: [
      '생크림빵이나 베이글을 칼로 살짝 벌려 풍성한 크림층을 확인합니다.',
      '미니 약과를 전자레인지에 딱 5초만 돌려 쫀득하게 만든 후 크림 사이에 쏙 끼웁니다.',
      '냉장고에 10분 정도 차갑게 넣어두었다가 한입 베어 물면 쫀득크리미한 맛이 폭발합니다!'
    ],
    tips: '약과에 시나몬 파우더를 살짝 톡톡 뿌려주면 고급 베이커리 맛이 납니다.',
    likes: 279,
    isLiked: false,
    commentsCount: 18,
    tags: ['#연세우유', '#약과샌드', '#할매니얼', '#CU디저트'],
    createdAt: '2026.09.05'
  },
  {
    id: 'recipe-04',
    title: '🍲 오모리 김치마라 순두부 짬뽕탕',
    description: '오모리 김치찌개 라면에 순두부 반 모와 다진 마늘, 계란을 풀어 끓이는 얼큰 해장 짬뽕탕',
    image: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=700&auto=format&fit=crop&q=80',
    author: '국물장인',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    authorLevel: 'LV.4 셰프',
    prepTime: '5분',
    difficulty: '쉬움',
    totalCost: 3800,
    ingredients: [
      { name: '오모리 김치찌개 라면 (용기/봉지)', store: 'GS25', price: 1800, amount: '1개', isKeyItem: true },
      { name: '찌개용 부드러운 순두부', store: '편의점/마트', price: 1200, amount: '1/2팩', isKeyItem: true },
      { name: '신선란 (달걀)', store: '편의점', price: 800, amount: '1알' }
    ],
    steps: [
      '물 450ml에 오모리 김치스프와 분말스프를 넣고 팔팔 끓입니다.',
      '면을 넣고 2분 후 순두부를 큼직하게 숟가락으로 숭덩숭덩 떼어 넣습니다.',
      '마지막에 계란 하나를 톡 까넣고 1분간 더 끓여 반숙으로 익혀 내면 속풀이 완성!'
    ],
    tips: '후추를 톡톡 뿌리고 고춧가루 반 스푼을 더하면 유명 순두부열라면 뺨치는 깊은 맛 완성!',
    likes: 418,
    isLiked: false,
    commentsCount: 35,
    tags: ['#오모리김치', '#순두부라면', '#해장추천', '#GS25꿀조합'],
    createdAt: '2026.09.04'
  }
];
