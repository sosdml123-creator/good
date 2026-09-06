import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, 
  Star, 
  ThumbsUp, 
  MessageSquare, 
  Send, 
  Trash2, 
  Flame, 
  Check, 
  Share2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export interface BattleCommentReply {
  id: string;
  userId?: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface BattleComment {
  id: string;
  userId?: string;
  userName: string;
  userAvatar?: string;
  userLevel?: number;
  choice: 'A' | 'B' | 'NONE'; // A 지지 | B 지지 | 중립
  content: string;
  likes: number;
  isLiked?: boolean;
  createdAt: string;
  replies: BattleCommentReply[];
}

const INITIAL_BATTLE_COMMENTS: BattleComment[] = [
  {
    id: 'b-cmt-1',
    userName: '편의점탐험가',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    userLevel: 4,
    choice: 'A',
    content: '이번 신상은 국물이 진짜 깊고 진해요 ㅋㅋㅋ 특유의 불향이 살아있어서 밥까지 말아먹었습니다. 완전 강추!',
    likes: 24,
    isLiked: false,
    createdAt: '15분 전',
    replies: [
      {
        id: 'b-rep-1',
        userName: '라면마스터',
        userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
        content: '인정합니다! 어제 GS25에서 사먹어봤는데 면발 탄력도 역대급이더라고요.',
        createdAt: '10분 전'
      }
    ]
  },
  {
    id: 'b-cmt-2',
    userName: '알뜰식탐러',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    userLevel: 3,
    choice: 'B',
    content: '가성비랑 양 생각하면 무조건 B가 승리입니다 ㅋㅋㅋ 편의점에서 2+1 행사도 하고 있어서 쟁여두기 딱 좋아요. 달콤매콤해서 중독성 대박!',
    likes: 19,
    isLiked: false,
    createdAt: '32분 전',
    replies: []
  },
  {
    id: 'b-cmt-3',
    userName: '신상얼리어답터',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    userLevel: 5,
    choice: 'NONE',
    content: '둘 다 개성이 확실해서 취향 차이일 듯해요! 얼큰하고 진한 자극을 원할 땐 A, 가볍고 감칠맛 있는 한 끼엔 B 추천합니다. 둘 다 신상치고 완성도 높아요 👍',
    likes: 14,
    isLiked: false,
    createdAt: '1시간 전',
    replies: []
  },
  {
    id: 'b-cmt-4',
    userName: '매운맛챌린저',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    userLevel: 2,
    choice: 'A',
    content: '매운 거 좋아하시는 분들은 망설이지 말고 A 가세요! 스트레스 확 풀리는 알싸함입니다 🔥',
    likes: 9,
    isLiked: false,
    createdAt: '2시간 전',
    replies: []
  },
  {
    id: 'b-cmt-5',
    userName: '간식요정',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    userLevel: 3,
    choice: 'B',
    content: 'B는 치즈나 반숙란 살짝 얹어서 같이 먹으면 진짜 꿀맛탱이에요.. 무조건 꿀조합으로 드셔보세요!',
    likes: 17,
    isLiked: false,
    createdAt: '3시간 전',
    replies: []
  }
];

export const CompareModal: React.FC = () => {
  const { 
    products, 
    comparedIds, 
    clearCompare, 
    openProductDetail, 
    goBack,
    battleConfig,
    battleChoice,
    voteBattle,
    currentUser,
    showToast
  } = useApp();

  const compared = products.filter(p => comparedIds.includes(p.id));
  const isCustomCompare = compared.length >= 2;

  // 배틀 모드일 경우 관리자 설정 상품 A & B 자동 연결
  const p1 = isCustomCompare 
    ? compared[0] 
    : (products.find(p => p.id === battleConfig.productAId) || products[0]);
    
  const p2 = isCustomCompare 
    ? (compared[1] || compared[0]) 
    : (products.find(p => p.id === battleConfig.productBId) || products[1] || products[0]);

  // 실시간 투표 득표율 계산
  const percentA = battleChoice === 'A' ? 62 : battleChoice === 'B' ? 48 : (battleConfig.percentA || 55);
  const percentB = 100 - percentA;

  // 댓글 목록 상태 (localStorage 연동)
  const [comments, setComments] = useState<BattleComment[]>(() => {
    try {
      const stored = localStorage.getItem('sinsangpick_battle_comments');
      return stored ? JSON.parse(stored) : INITIAL_BATTLE_COMMENTS;
    } catch {
      return INITIAL_BATTLE_COMMENTS;
    }
  });

  // 댓글 작성 관련 상태
  const [selectedChoice, setSelectedChoice] = useState<'A' | 'B' | 'NONE'>('A');
  const [inputText, setInputText] = useState('');
  const [filterChoice, setFilterChoice] = useState<'ALL' | 'A' | 'B'>('ALL');
  const [sortOrder, setSortOrder] = useState<'POPULAR' | 'LATEST'>('POPULAR');
  
  // 대댓글(답글) 입력 토글 상태: commentId -> boolean
  const [replyOpenMap, setReplyOpenMap] = useState<{ [id: string]: boolean }>({});
  const [replyTextMap, setReplyTextMap] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    try {
      localStorage.setItem('sinsangpick_battle_comments', JSON.stringify(comments));
    } catch (e) {
      console.warn('Failed to save battle comments to localStorage:', e);
    }
  }, [comments]);

  // 댓글 등록 핸들러
  const handleAddComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) {
      showToast('의견 내용을 입력해주세요!', 'error');
      return;
    }

    const newComment: BattleComment = {
      id: `b-cmt-${Date.now()}`,
      userId: currentUser.uid || 'user_me',
      userName: currentUser.displayName || '신상러버',
      userAvatar: currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      userLevel: currentUser.level ? parseInt(currentUser.level.replace(/[^0-9]/g, '')) || 3 : 3,
      choice: selectedChoice,
      content: inputText.trim(),
      likes: 0,
      isLiked: false,
      createdAt: '방금 전',
      replies: []
    };

    setComments(prev => [newComment, ...prev]);
    setInputText('');
    showToast('💬 배틀 의견이 등록되었습니다! (+10P)', 'success');
  };

  // 공감(좋아요) 토글
  const handleToggleLike = (commentId: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const nextLiked = !c.isLiked;
        return {
          ...c,
          isLiked: nextLiked,
          likes: nextLiked ? c.likes + 1 : Math.max(0, c.likes - 1)
        };
      }
      return c;
    }));
  };

  // 대댓글(답글) 추가
  const handleAddReply = (commentId: string) => {
    const text = replyTextMap[commentId]?.trim();
    if (!text) {
      showToast('답글 내용을 입력해주세요!', 'error');
      return;
    }

    const newReply: BattleCommentReply = {
      id: `b-rep-${Date.now()}`,
      userId: currentUser.uid || 'user_me',
      userName: currentUser.displayName || '신상러버',
      userAvatar: currentUser.photoURL,
      content: text,
      createdAt: '방금 전'
    };

    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [...(c.replies || []), newReply]
        };
      }
      return c;
    }));

    setReplyTextMap(prev => ({ ...prev, [commentId]: '' }));
    showToast('답글이 등록되었습니다!', 'success');
  };

  // 댓글 삭제
  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
    showToast('댓글이 삭제되었습니다.', 'info');
  };

  // 필터링 및 정렬된 댓글 목록
  const filteredComments = comments.filter(c => {
    if (filterChoice === 'ALL') return true;
    return c.choice === filterChoice;
  });

  const sortedComments = [...filteredComments].sort((a, b) => {
    if (sortOrder === 'POPULAR') {
      return (b.likes || 0) - (a.likes || 0);
    }
    return 0;
  });

  const countA = comments.filter(c => c.choice === 'A').length;
  const countB = comments.filter(c => c.choice === 'B').length;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `신상픽 배틀: ${p1.name} VS ${p2.name}`,
        text: `${p1.name} vs ${p2.name} 실시간 맞대결 투표 및 의견 나누기에 참여해보세요!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('링크가 클립보드에 복사되었습니다!', 'success');
    }
  };

  return (
    <div className="bg-gray-50 min-h-full pb-20 select-none">
      
      {/* 1. Header Bar */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between z-30 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={goBack}
            className="p-1 -ml-1 text-gray-800 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-black text-gray-900">
              {isCustomCompare ? '신상 비교함' : '⚔️ 신상 배틀'}
            </h1>
            {!isCustomCompare && (
              <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Flame className="w-3 h-3 fill-rose-500" /> LIVE
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-1.5 text-gray-500 hover:text-[#0066FF] hover:bg-blue-50 rounded-lg transition-colors"
            title="공유하기"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {isCustomCompare && (
            <button
              onClick={clearCompare}
              className="text-xs font-bold text-[#0066FF] hover:opacity-80 px-2 py-1 bg-blue-50 rounded-lg"
            >
              비교함 비우기
            </button>
          )}
        </div>
      </div>

      {/* 2. 배틀 인포 헤더 카드 */}
      <div className="bg-gradient-to-b from-blue-50/70 to-white px-4 pt-4 pb-2 border-b border-gray-100">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-[#0066FF] bg-blue-100/60 px-2 py-0.5 rounded-full">
              {battleConfig.labelA || '매치업'} VS {battleConfig.labelB || '매치업'}
            </span>
            <span className="text-[11px] text-gray-500 font-medium">실시간 대결</span>
          </div>
          <span className="text-[11px] font-semibold text-gray-400">
            총 {comments.length + 148}명 참여 중
          </span>
        </div>
        <h2 className="text-lg font-black text-gray-900 leading-snug">
          {battleConfig.title || '🥊 이번 주 신상 배틀 투표'}
        </h2>
        {battleConfig.subtitle && (
          <p className="text-xs text-gray-500 mt-0.5">
            {battleConfig.subtitle}
          </p>
        )}

        {/* 실시간 득표율 게이지 바 */}
        <div className="mt-3.5 bg-white p-3 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex justify-between items-center text-xs font-black mb-1.5">
            <span className="text-[#0066FF] flex items-center gap-1">
              🔵 {p1.brand} ({percentA}%)
              {battleChoice === 'A' && <span className="text-[10px] bg-blue-50 text-[#0066FF] px-1 py-0.2 rounded font-bold">내 선택</span>}
            </span>
            <span className="text-orange-500 flex items-center gap-1">
              {battleChoice === 'B' && <span className="text-[10px] bg-orange-50 text-orange-500 px-1 py-0.2 rounded font-bold">내 선택</span>}
              🟠 {p2.brand} ({percentB}%)
            </span>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
            <div 
              className="bg-gradient-to-r from-blue-500 to-[#0066FF] h-full transition-all duration-500 flex items-center justify-end pr-1 text-[9px] font-bold text-white"
              style={{ width: `${percentA}%` }}
            />
            <div 
              className="bg-gradient-to-r from-orange-400 to-amber-500 h-full transition-all duration-500 flex items-center justify-start pl-1 text-[9px] font-bold text-white"
              style={{ width: `${percentB}%` }}
            />
          </div>
          <div className="flex gap-2 mt-2.5">
            <button
              onClick={() => voteBattle('A')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                battleChoice === 'A'
                  ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
              }`}
            >
              {battleChoice === 'A' && <Check className="w-3.5 h-3.5" />}
              <span>{p1.name.slice(0, 10)} 투표</span>
            </button>
            <button
              onClick={() => voteBattle('B')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                battleChoice === 'B'
                  ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
              }`}
            >
              {battleChoice === 'B' && <Check className="w-3.5 h-3.5" />}
              <span>{p2.name.slice(0, 10)} 투표</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. 2 Products Side-by-Side Cards */}
      <div className="p-4 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between gap-3 text-center">
          {/* Product 1 (A) */}
          <div 
            onClick={() => openProductDetail(p1.id)}
            className={`flex-1 min-w-0 p-3 rounded-2xl border transition-all cursor-pointer hover:shadow-xs relative ${
              battleChoice === 'A' ? 'border-[#0066FF] bg-blue-50/20' : 'border-gray-200 bg-white'
            }`}
          >
            <span className="absolute top-2 left-2 text-[10px] font-black text-white bg-[#0066FF] px-2 py-0.5 rounded-md shadow-xs">
              A
            </span>
            <img
              src={p1.image}
              alt={p1.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover mx-auto border border-gray-100 shadow-2xs mb-2 mt-1"
            />
            <h3 className="text-xs font-bold text-gray-900 truncate">{p1.name}</h3>
            <span className="text-[11px] text-gray-400 block mt-0.5">{p1.brand}</span>
            <div className="flex items-center justify-center gap-0.5 text-xs font-bold text-[#0066FF] mt-1">
              <Star className="w-3.5 h-3.5 fill-[#0066FF]" />
              <span>{p1.overallRating.toFixed(1)}</span>
              <span className="text-gray-400 font-normal text-[11px]">({p1.ratingCount})</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openProductDetail(p1.id);
              }}
              className="mt-2.5 w-full py-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center justify-center gap-0.5"
            >
              <span>리뷰 보기</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Center VS Circle */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-800 to-gray-600 text-white text-xs font-black flex items-center justify-center shadow-md">
              VS
            </div>
            <span className="text-[10px] font-bold text-gray-400 mt-1">맞대결</span>
          </div>

          {/* Product 2 (B) */}
          <div 
            onClick={() => openProductDetail(p2.id)}
            className={`flex-1 min-w-0 p-3 rounded-2xl border transition-all cursor-pointer hover:shadow-xs relative ${
              battleChoice === 'B' ? 'border-orange-500 bg-orange-50/20' : 'border-gray-200 bg-white'
            }`}
          >
            <span className="absolute top-2 left-2 text-[10px] font-black text-white bg-orange-500 px-2 py-0.5 rounded-md shadow-xs">
              B
            </span>
            <img
              src={p2.image}
              alt={p2.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover mx-auto border border-gray-100 shadow-2xs mb-2 mt-1"
            />
            <h3 className="text-xs font-bold text-gray-900 truncate">{p2.name}</h3>
            <span className="text-[11px] text-gray-400 block mt-0.5">{p2.brand}</span>
            <div className="flex items-center justify-center gap-0.5 text-xs font-bold text-orange-500 mt-1">
              <Star className="w-3.5 h-3.5 fill-orange-500" />
              <span>{p2.overallRating.toFixed(1)}</span>
              <span className="text-gray-400 font-normal text-[11px]">({p2.ratingCount})</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openProductDetail(p2.id);
              }}
              className="mt-2.5 w-full py-1.5 text-[11px] font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors flex items-center justify-center gap-0.5"
            >
              <span>리뷰 보기</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Comparison Rating Bars */}
      <div className="p-4 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-700">📊 항목별 스펙 비교</span>
          <span className="text-[11px] text-gray-400">실제 구매자 평점 기준</span>
        </div>

        <div className="space-y-3.5 text-xs font-bold">
          {/* 맛 */}
          <div className="flex items-center">
            <span className="w-16 text-gray-600 text-[11px]">맛 평가</span>
            <span className="w-7 text-left font-bold text-[#0066FF] text-[11px]">{p1.detailedRating.taste.toFixed(1)}</span>
            <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden flex justify-end mr-1">
              <div className="bg-[#0066FF] h-full rounded-l-full" style={{ width: `${(p1.detailedRating.taste / 5) * 100}%` }} />
            </div>
            <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden flex justify-start ml-1">
              <div className="bg-orange-400 h-full rounded-r-full" style={{ width: `${(p2.detailedRating.taste / 5) * 100}%` }} />
            </div>
            <span className="w-7 text-right font-bold text-orange-500 text-[11px]">{p2.detailedRating.taste.toFixed(1)}</span>
          </div>

          {/* 가성비 */}
          <div className="flex items-center">
            <span className="w-16 text-gray-600 text-[11px]">가성비</span>
            <span className="w-7 text-left font-bold text-[#0066FF] text-[11px]">{p1.detailedRating.value.toFixed(1)}</span>
            <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden flex justify-end mr-1">
              <div className="bg-[#0066FF] h-full rounded-l-full" style={{ width: `${(p1.detailedRating.value / 5) * 100}%` }} />
            </div>
            <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden flex justify-start ml-1">
              <div className="bg-orange-400 h-full rounded-r-full" style={{ width: `${(p2.detailedRating.value / 5) * 100}%` }} />
            </div>
            <span className="w-7 text-right font-bold text-orange-500 text-[11px]">{p2.detailedRating.value.toFixed(1)}</span>
          </div>

          {/* 양 */}
          <div className="flex items-center">
            <span className="w-16 text-gray-600 text-[11px]">푸짐함(양)</span>
            <span className="w-7 text-left font-bold text-[#0066FF] text-[11px]">{p1.detailedRating.portion.toFixed(1)}</span>
            <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden flex justify-end mr-1">
              <div className="bg-[#0066FF] h-full rounded-l-full" style={{ width: `${(p1.detailedRating.portion / 5) * 100}%` }} />
            </div>
            <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden flex justify-start ml-1">
              <div className="bg-orange-400 h-full rounded-r-full" style={{ width: `${(p2.detailedRating.portion / 5) * 100}%` }} />
            </div>
            <span className="w-7 text-right font-bold text-orange-500 text-[11px]">{p2.detailedRating.portion.toFixed(1)}</span>
          </div>

          {/* 재구매 의사 */}
          <div className="flex items-center">
            <span className="w-16 text-gray-600 text-[11px]">재구매 의사</span>
            <span className="w-7 text-left font-bold text-[#0066FF] text-[11px]">{p1.detailedRating.repurchase.toFixed(1)}</span>
            <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden flex justify-end mr-1">
              <div className="bg-[#0066FF] h-full rounded-l-full" style={{ width: `${(p1.detailedRating.repurchase / 5) * 100}%` }} />
            </div>
            <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden flex justify-start ml-1">
              <div className="bg-orange-400 h-full rounded-r-full" style={{ width: `${(p2.detailedRating.repurchase / 5) * 100}%` }} />
            </div>
            <span className="w-7 text-right font-bold text-orange-500 text-[11px]">{p2.detailedRating.repurchase.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* 5. 🥊 메인 신규 기능: 실시간 배틀 톡톡 (댓글 / 의견 나누기 커뮤니티) */}
      <div className="mt-2.5 bg-white border-t border-b border-gray-100 p-4">
        
        {/* 타이틀 및 헤더 */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-black text-gray-900">💬 실시간 배틀 톡</span>
            <span className="text-xs font-bold text-white bg-gray-900 px-2 py-0.5 rounded-full">
              {comments.length}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-400">
            <button 
              onClick={() => setSortOrder('POPULAR')}
              className={`hover:text-gray-900 transition-colors ${sortOrder === 'POPULAR' ? 'text-gray-900 font-bold' : ''}`}
            >
              공감순
            </button>
            <span>·</span>
            <button 
              onClick={() => setSortOrder('LATEST')}
              className={`hover:text-gray-900 transition-colors ${sortOrder === 'LATEST' ? 'text-gray-900 font-bold' : ''}`}
            >
              최신순
            </button>
          </div>
        </div>

        {/* 진영 필터 탭 */}
        <div className="flex gap-1.5 py-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilterChoice('ALL')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
              filterChoice === 'ALL'
                ? 'bg-gray-900 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            전체 의견 ({comments.length})
          </button>
          <button
            onClick={() => setFilterChoice('A')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
              filterChoice === 'A'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'bg-blue-50 text-[#0066FF] hover:bg-blue-100'
            }`}
          >
            <span>🔵 {p1.name.slice(0, 7)} 파</span>
            <span className="opacity-80 font-normal">({countA})</span>
          </button>
          <button
            onClick={() => setFilterChoice('B')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
              filterChoice === 'B'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
            }`}
          >
            <span>🟠 {p2.name.slice(0, 7)} 파</span>
            <span className="opacity-80 font-normal">({countB})</span>
          </button>
        </div>

        {/* 의견 작성 상자 */}
        <div className="bg-gray-50/90 rounded-2xl p-3.5 border border-gray-200/80 mb-5 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> 내 응원 진영 선택:
            </span>
            <span className="text-[10px] text-gray-400">작성 시 +10P 적립</span>
          </div>

          {/* 진영 선택 라디오 버튼 */}
          <div className="grid grid-cols-3 gap-1.5 mb-2.5">
            <button
              type="button"
              onClick={() => setSelectedChoice('A')}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all truncate ${
                selectedChoice === 'A'
                  ? 'bg-blue-50 text-[#0066FF] border-[#0066FF] shadow-xs'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              🔵 {p1.brand} 지지
            </button>
            <button
              type="button"
              onClick={() => setSelectedChoice('B')}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all truncate ${
                selectedChoice === 'B'
                  ? 'bg-orange-50 text-orange-600 border-orange-500 shadow-xs'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              🟠 {p2.brand} 지지
            </button>
            <button
              type="button"
              onClick={() => setSelectedChoice('NONE')}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all truncate ${
                selectedChoice === 'NONE'
                  ? 'bg-gray-200 text-gray-800 border-gray-400 shadow-xs'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              💬 중립 / 둘 다
            </button>
          </div>

          {/* 입력 인풋창 */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`${
                selectedChoice === 'A' 
                  ? `[${p1.name.slice(0, 8)}] 추천 이유나 솔직한 한마디...` 
                  : selectedChoice === 'B' 
                  ? `[${p2.name.slice(0, 8)}] 추천 이유나 솔직한 한마디...` 
                  : '두 신상품에 대한 의견을 자유롭게 나눠보세요!'
              }`}
              className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066FF] shadow-2xs"
            />
            <button
              type="submit"
              className="px-3.5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 shrink-0 transition-colors shadow-xs"
            >
              <span>등록</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* 댓글 피드 리스트 */}
        <div className="space-y-3.5">
          {sortedComments.length > 0 ? (
            sortedComments.map((comment) => (
              <div 
                key={comment.id}
                className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-2xs hover:border-gray-200 transition-all"
              >
                {/* 댓글 헤더 */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={comment.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                      alt={comment.userName}
                      className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-800">{comment.userName}</span>
                        {comment.userLevel && (
                          <span className="text-[10px] text-amber-600 bg-amber-50 font-bold px-1 rounded">
                            Lv.{comment.userLevel}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400">{comment.createdAt}</span>
                      </div>
                      
                      {/* 지지 진영 뱃지 */}
                      <div className="mt-0.5">
                        {comment.choice === 'A' && (
                          <span className="text-[10px] font-bold text-[#0066FF] bg-blue-50 px-1.5 py-0.2 rounded inline-block">
                            🔵 {p1.name.slice(0, 10)} 지지
                          </span>
                        )}
                        {comment.choice === 'B' && (
                          <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.2 rounded inline-block">
                            🟠 {p2.name.slice(0, 10)} 지지
                          </span>
                        )}
                        {comment.choice === 'NONE' && (
                          <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.2 rounded inline-block">
                            💬 중립 / 비교 의견
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 내 댓글인 경우 삭제 버튼 */}
                  {comment.userId === (currentUser.uid || 'user_me') && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-gray-400 hover:text-rose-500 p-1"
                      title="댓글 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* 댓글 본문 */}
                <p className="text-xs text-gray-800 font-medium mt-2 leading-relaxed whitespace-pre-wrap pl-9">
                  {comment.content}
                </p>

                {/* 액션 버튼 바 (공감 & 답글) */}
                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-50 pl-9">
                  <div className="flex items-center gap-3">
                    {/* 공감(좋아요) */}
                    <button
                      onClick={() => handleToggleLike(comment.id)}
                      className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                        comment.isLiked
                          ? 'bg-blue-50 text-[#0066FF] border-blue-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200/80 hover:bg-gray-100'
                      }`}
                    >
                      <ThumbsUp className={`w-3 h-3 ${comment.isLiked ? 'fill-[#0066FF]' : ''}`} />
                      <span>공감 {comment.likes}</span>
                    </button>

                    {/* 답글 버튼 */}
                    <button
                      onClick={() => setReplyOpenMap(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}
                      className="flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-gray-800 px-2 py-1 rounded-full hover:bg-gray-50 transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>답글 {comment.replies?.length > 0 ? comment.replies.length : ''}</span>
                    </button>
                  </div>
                </div>

                {/* 대댓글(답글) 영역 */}
                {((comment.replies && comment.replies.length > 0) || replyOpenMap[comment.id]) && (
                  <div className="mt-2.5 pt-2.5 border-t border-gray-100 pl-9 space-y-2">
                    {/* 기존 답글 목록 */}
                    {comment.replies?.map(rep => (
                      <div key={rep.id} className="bg-gray-50/80 rounded-xl p-2.5 text-xs">
                        <div className="flex items-center justify-between text-gray-500 text-[10px] mb-1">
                          <span className="font-bold text-gray-700">{rep.userName}</span>
                          <span>{rep.createdAt}</span>
                        </div>
                        <p className="text-gray-700 text-xs">{rep.content}</p>
                      </div>
                    ))}

                    {/* 새 답글 입력창 */}
                    {replyOpenMap[comment.id] && (
                      <div className="flex gap-1.5 pt-1">
                        <input
                          type="text"
                          value={replyTextMap[comment.id] || ''}
                          onChange={(e) => setReplyTextMap(prev => ({ ...prev, [comment.id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddReply(comment.id);
                            }
                          }}
                          placeholder="답글을 남겨보세요..."
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-gray-800 outline-none focus:border-[#0066FF]"
                        />
                        <button
                          onClick={() => handleAddReply(comment.id)}
                          className="px-2.5 py-1.5 bg-[#0066FF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
                        >
                          등록
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-600">아직 등록된 의견이 없습니다.</p>
              <p className="text-[11px] text-gray-400 mt-0.5">가장 먼저 배틀 의견을 남기고 10P를 받아보세요!</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
