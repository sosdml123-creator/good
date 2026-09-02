import { CommunityPost } from '../types';

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-01',
    category: '인기글',
    title: 'GS25 신상 아이스크림 3종 내돈내산 솔직 후기 🍦',
    content: '이번 주에 나온 두바이초코바, 하겐다즈 피스타치오, 젤라또바 3가지 직접 사먹어보고 솔직하게 비교해봤습니다. 개인적으로 두바이초코바 바삭함이 1위네요!',
    author: '신상탐험가 민지',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    authorLevel: 'Lv.6',
    likes: 48,
    isLiked: false,
    commentsCount: 8,
    createdAt: '2시간 전',
    images: [
      'https://images.unsplash.com/photo-1548741487-18d363dc4469?w=600&auto=format&fit=crop&q=80'
    ],
    comments: [
      {
        id: 'cm-01',
        userName: '아이스덕후',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        userLevel: 'Lv.3',
        content: '두바이초코바 진짜 동네에 재고가 없어서 못 먹고 있어요 ㅠㅠ 부럽습니다',
        createdAt: '1시간 전',
      }
    ],
  },
  {
    id: 'post-02',
    category: '인기글',
    title: 'CU 신상 마라샹궈 컵라면 드셔보신 분? 🍜',
    content: '얼얼한 마라향이 생각보다 강렬해서 밥 말아먹기 딱 좋습니다. 삼각김밥이랑 조합 최고네요!',
    author: '마라처돌이',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    authorLevel: 'Lv.4',
    likes: 35,
    isLiked: false,
    commentsCount: 5,
    createdAt: '3시간 전',
    images: [],
  },
  {
    id: 'post-03',
    category: '질문/답변',
    title: '꼬북칩 초코츄러스 신상이랑 오리지널 중 뭐가 더 달콤한가요?',
    content: '너무 단 과자는 잘 못 먹는데 더블크런치 버전 많이 달까요?',
    author: '과자입문자',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    authorLevel: 'Lv.2',
    likes: 14,
    isLiked: false,
    commentsCount: 12,
    createdAt: '5시간 전',
    comments: [
      {
        id: 'cm-02',
        userName: '오리온팬',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        userLevel: 'Lv.5',
        content: '초콜릿 코팅이 쌉싸름한 다크초코 느낌이라 텁텁하게 달지 않고 바삭해서 괜찮으실 거예요!',
        createdAt: '4시간 전',
      }
    ],
  },
  {
    id: 'post-04',
    category: '자유게시판',
    title: '요즘 편의점 1+1 행사 신상 꿀조합 정리해드립니다 🔥',
    content: '코카콜라 제로 레몬 + 꼬북칩 조합 강추합니다. 단짠과 청량함의 완벽한 밸런스예요.',
    author: '편의점순찰대',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    authorLevel: 'Lv.5',
    likes: 62,
    isLiked: false,
    commentsCount: 16,
    createdAt: '6시간 전',
  }
];
