import { Review } from '../types';

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    productId: 'prod-01',
    productName: '꼬북칩 초코츄러스맛 더블크런치',
    userName: '맛있으면 0칼로리',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    userLevel: 'Lv.5',
    rating: 5.0,
    content: '출시 소식 듣자마자 편의점 3곳 돌아서 구했습니다! 기존 꼬북칩보다 초콜릿이 훨씬 두껍고 바삭함이 오래가요. 우유에 시리얼처럼 말아먹으면 극락입니다 🍫✨',
    images: [
      'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    ],
    likes: 84,
    isLiked: false,
    commentsCount: 3,
    createdAt: '3시간 전',
    tags: ['#존맛탱', '#재구매각', '#우유말먹'],
    comments: [
      {
        id: 'c-01',
        userName: '과자러버',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        userLevel: 'Lv.3',
        content: '우유 말아먹는 꿀팁 감사합니다! 오늘 바로 해볼게요 ㅎㅎ',
        createdAt: '2시간 전',
      },
      {
        id: 'c-02',
        userName: '편의점탐험가',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        userLevel: 'Lv.4',
        content: '저희 동네 CU는 2+1 행사 중이더라고요!',
        createdAt: '1시간 전',
      }
    ],
  },
  {
    id: 'rev-02',
    productId: 'prod-01',
    productName: '꼬북칩 초코츄러스맛 더블크런치',
    userName: '과자필러',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    userLevel: 'Lv.3',
    rating: 4.0,
    content: '맛은 진짜 보장된 맛인데 80g에 1,800원이라 조금 아쉬워요. 대용량 패키지로도 나와줬으면 좋겠습니다!',
    images: [],
    likes: 12,
    isLiked: false,
    commentsCount: 1,
    createdAt: '6시간 전',
    tags: ['#맛있음', '#가성비보통'],
    comments: [
      {
        id: 'c-03',
        userName: '스낵마스터',
        userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
        userLevel: 'Lv.6',
        content: '대형마트 가면 번들팩으로 좀 더 저렴하게 팔더라고요~',
        createdAt: '4시간 전',
      }
    ],
  },
  {
    id: 'rev-03',
    productId: 'prod-02',
    productName: '연세우유 피스타치오 생크림빵',
    userName: '빵지순례자',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    userLevel: 'Lv.4',
    rating: 5.0,
    content: '인공적인 시럽 향이 아니라 원물 피스타치오 분태랑 페이스트가 묵직하게 들어있어 크림이 진짜 꼬소해요. 3,400원 전혀 안 아깝습니다 💚',
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'
    ],
    likes: 128,
    isLiked: true,
    commentsCount: 4,
    createdAt: '4시간 전',
    tags: ['#연세우유', '#피스타치오', '#인생빵'],
  }
];
