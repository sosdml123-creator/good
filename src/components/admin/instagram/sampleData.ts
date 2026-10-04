// src/components/admin/instagram/sampleData.ts
import { GeneratedContentPackage } from './types';

export const SAMPLE_INSTAGRAM_CONTENT: GeneratedContentPackage = {
  id: 'sample-preset-9',
  prompt: '오늘의 편의점 핫신상 모음전 & 설빙 신메뉴 추천',
  aspectRatio: '1:1',
  caption: `🔥 이번 주 편의점 & 카페를 뒤흔든 역대급 신상 라인업 총정리!

눈뜨자마자 편의점으로 달려가야 할 이유가 생겼습니다..👀
맵단 크림 조합의 끝판왕 불닭 까르보부터 고소함 폭발하는 메가커피 흑임자라떼, 그리고 비주얼 미쳐버린 설빙 딸기모찌까지!

여러분의 오늘 원픽은 무엇인가요? 지금 댓글로 알려주세요! 👇
더 많은 실시간 신상 정보와 솔직 평점은 프로필 링크 '신상픽' 앱에서 확인하세요!`,
  hashtags: [
    '#신상픽', '#편의점신상', '#신상과자', '#신상라면', '#신상음료',
    '#불닭볶음면까르보', '#흑임자라떼', '#설빙신메뉴', '#딸기모찌', '#포카칩',
    '#디저트스타그램', '#먹스타그램', '#간식추천', '#편의점꿀조합', '#신제품리뷰'
  ],
  slides: [
    {
      id: 'slide-1',
      templateType: 'cover_new',
      props: {
        title1: '지금, 가장 새로운 맛',
        title2: '신상픽',
        handwriting: '새로운\n맛을\n만나다',
      },
    },
    {
      id: 'slide-2',
      templateType: 'hook_photo',
      props: {
        badge: 'NEW',
        hookTitle: '편의점에\n이거 나왔어요!',
        subText: '치즈덕후들 주목!\n이 조합 못 참지..',
        tag: '신상픽',
        pageIndicator: '1/3',
        bgImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop',
      },
    },
    {
      id: 'slide-3',
      templateType: 'review_card',
      props: {
        badge: 'NEW',
        brand: '삼양',
        productName: '불닭볶음면 까르보',
        rating: 4.3,
        reviewCount: '1,245',
        description: '매콤한 불닭에 부드러운\n크림이 더해진 중독성 있는 맛!',
        recommendationTitle: '이런 분께 추천해요',
        recommendations: [
          '매운맛도 좋아하고 크림도 좋아하는 분',
          '불닭 시리즈를 좋아하는 분',
          '색다른 라면을 찾는 분',
        ],
        productImage: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop',
        handwriting: '이 조합\n진짜 맛있다!',
      },
    },
    {
      id: 'slide-4',
      templateType: 'top5',
      props: {
        badge: 'THIS WEEK',
        title: '이번 주 신상 TOP 5',
        subText: '지금 가장 핫한 신상만 모았어요!',
        items: [
          { rank: 1, name: '삼양 불닭볶음면 까르보', category: '라면', image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=200&auto=format&fit=crop' },
          { rank: 2, name: '오리온 초코파이 하프', category: '간식', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&auto=format&fit=crop' },
          { rank: 3, name: '메가커피 흑임자라떼', category: '음료', image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=200&auto=format&fit=crop' },
          { rank: 4, name: '풀무원 두부면', category: '식품', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop' },
          { rank: 5, name: '하리보 골든베어 젤리', category: '간식', image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=200&auto=format&fit=crop' },
        ],
      },
    },
    {
      id: 'slide-5',
      templateType: 'reels_cover',
      props: {
        stickerText: '어거\n오늘 처음 봤어요!',
        bgImage: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&auto=format&fit=crop',
        stickerTag: '신상픽',
        viewsCount: '12.5만',
      },
    },
    {
      id: 'slide-6',
      templateType: 'rating_detail',
      props: {
        badge: 'NEW',
        brand: '메가커피',
        productName: '흑임자라떼',
        ratings: [
          { label: '맛', score: 4.5 },
          { label: '가성비', score: 4.0 },
          { label: '식감', score: 4.0 },
        ],
        quote: '“고소하고 달달해서\n흑임자 좋아하는 사람은 무조건!”',
        productImage: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop',
      },
    },
    {
      id: 'slide-7',
      templateType: 'photo_dessert',
      props: {
        handwriting: '달콤한\n신상 디저트',
        badge: 'NEW',
        title: '설빙 딸기모찌',
        description: '지금 전국 설빙 매장에서 만나보세요!',
        bgImage: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop',
      },
    },
    {
      id: 'slide-8',
      templateType: 'versus',
      props: {
        badge: '신상 비교',
        question: '두 가지 맛,\n어떤 게 더 맛있을까?',
        product1: {
          name: '포카칩 오리지널',
          image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&auto=format&fit=crop',
        },
        product2: {
          name: '포카칩 어니언버터',
          image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&auto=format&fit=crop',
        },
        buttonText: '지금 바로 확인하기 →',
      },
    },
    {
      id: 'slide-9',
      templateType: 'cta_app',
      props: {
        handwriting: '더 많은 신상이\n궁금하다면?',
        buttonText: '앱에서 만나요 →',
        mockImage: '',
      },
    },
  ],
};
