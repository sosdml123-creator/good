import React, { useState, useMemo } from 'react';
import { X, Coins, Sparkles, TrendingUp, TrendingDown, HelpCircle, ChevronRight, PenTool } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PointTransaction } from '../../types';

interface PointHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PointHistoryModal: React.FC<PointHistoryModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, userPoints, pointTransactions, setActiveTab } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'earn' | 'use'>('all');
  const [showGuide, setShowGuide] = useState(false);

  // Filter transactions for the current user
  const userTransactions = useMemo(() => {
    const list = pointTransactions.filter(
      (tx) => tx.userId === currentUser.uid || tx.userName === currentUser.displayName
    );

    // If no transactions exist yet for this user but user has points, provide a default welcome transaction
    if (list.length === 0 && userPoints > 0) {
      const defaultWelcomeTx: PointTransaction = {
        id: `welcome_${currentUser.uid}`,
        userId: currentUser.uid,
        userName: currentUser.displayName,
        type: 'reward',
        amount: userPoints,
        balanceAfter: userPoints,
        reason: '신상픽 웰컴 가입 축하 포인트',
        createdAt: currentUser.createdAt || '가입일'
      };
      return [defaultWelcomeTx];
    }

    return list;
  }, [pointTransactions, currentUser, userPoints]);

  const filteredTransactions = useMemo(() => {
    if (filterType === 'earn') {
      return userTransactions.filter((tx) => tx.amount > 0 || tx.type === 'grant' || tx.type === 'reward');
    }
    if (filterType === 'use') {
      return userTransactions.filter((tx) => tx.amount < 0 || tx.type === 'revoke' || tx.type === 'use');
    }
    return userTransactions;
  }, [userTransactions, filterType]);

  if (!isOpen) return null;

  // Level progress calculation (200 points per level)
  const currentPoints = currentUser.points || userPoints;
  const currentLevelNum = Math.max(1, Math.min(10, Math.floor(currentPoints / 200) + 1));
  const nextLevelPoints = currentLevelNum * 200;
  const pointsToNextLevel = Math.max(0, nextLevelPoints - currentPoints);
  const progressPercent = Math.min(100, Math.max(0, ((currentPoints % 200) / 200) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#F8F9FA] rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900">포인트 적립 · 사용 내역</h2>
              <p className="text-[11px] text-gray-500">신상픽 활동 리워드 및 내역</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          
          {/* Point Balance Card */}
          <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-500 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute right-4 top-4 opacity-20 pointer-events-none">
              <Coins className="w-16 h-16" />
            </div>

            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-semibold text-amber-100 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                보유 포인트
              </span>
              <span className="text-[11px] font-bold bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-white">
                {currentUser.level || `Lv.${currentLevelNum}`}
              </span>
            </div>

            <div className="mt-2 text-3xl font-black tracking-tight relative z-10 flex items-baseline gap-1">
              <span>{currentPoints.toLocaleString()}</span>
              <span className="text-xl font-bold">P</span>
            </div>

            {/* Level progress bar */}
            <div className="mt-4 pt-3 border-t border-white/20 relative z-10">
              <div className="flex justify-between text-[11px] font-medium text-amber-100 mb-1.5">
                <span>Lv.{currentLevelNum}</span>
                {currentLevelNum < 10 ? (
                  <span>Lv.{currentLevelNum + 1}까지 {pointsToNextLevel}P 남음</span>
                ) : (
                  <span>최고 레벨 도달! 👑</span>
                )}
              </div>
              <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-500 ease-out shadow-xs" 
                  style={{ width: `${currentLevelNum >= 10 ? 100 : progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Point Guide Toggle Card */}
          <div className="bg-white rounded-2xl border border-amber-100 p-3.5 shadow-xs">
            <button 
              onClick={() => setShowGuide(!showGuide)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-gray-800">포인트 모으는 꿀팁 안내</span>
              </div>
              <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-0.5">
                {showGuide ? '접기' : '자세히 보기'}
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showGuide ? 'rotate-90' : ''}`} />
              </span>
            </button>

            {showGuide && (
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-2.5 text-[12px] text-gray-600 animate-in fade-in duration-150">
                <div className="flex items-start gap-2">
                  <span className="text-base leading-none shrink-0">✍️</span>
                  <div>
                    <strong className="text-gray-900 font-bold">신제품 리뷰 작성:</strong> 기본 50P + 사진 첨부시 30P + 30자 이상 20P <span className="text-amber-600 font-bold">(최대 100P)</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-base leading-none shrink-0">🥪</span>
                  <div>
                    <strong className="text-gray-900 font-bold">꿀조합 레시피 등록:</strong> 나만의 먹조합 공유 시 <span className="text-amber-600 font-bold">+50P</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-base leading-none shrink-0">🎉</span>
                  <div>
                    <strong className="text-gray-900 font-bold">신규 회원가입 & 닉네임 설정:</strong> 웰컴 축하 <span className="text-amber-600 font-bold">+100P</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-base leading-none shrink-0">🏆</span>
                  <div>
                    <strong className="text-gray-900 font-bold">베스트 픽 리뷰어 선정:</strong> 매주 우수 리뷰어 특별 리워드 <span className="text-amber-600 font-bold">+300~500P</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Filter tabs */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 bg-gray-200/70 p-1 rounded-xl">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  filterType === 'all'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setFilterType('earn')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                  filterType === 'earn'
                    ? 'bg-white text-emerald-600 shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <TrendingUp className="w-3 h-3" />
                적립
              </button>
              <button
                onClick={() => setFilterType('use')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                  filterType === 'use'
                    ? 'bg-white text-rose-500 shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <TrendingDown className="w-3 h-3" />
                사용·차감
              </button>
            </div>
            <span className="text-[11px] text-gray-400 font-medium">총 {filteredTransactions.length}건</span>
          </div>

          {/* 4. Transactions List */}
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 shadow-xs overflow-hidden">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => {
                const isEarn = tx.amount > 0 || tx.type === 'grant' || tx.type === 'reward';
                const formattedAmount = isEarn
                  ? `+${Math.abs(tx.amount).toLocaleString()}P`
                  : `-${Math.abs(tx.amount).toLocaleString()}P`;

                return (
                  <div key={tx.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-gray-50/70 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isEarn ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-500'
                      }`}>
                        {isEarn ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      </div>

                      {/* Details */}
                      <div className="min-w-0">
                        <div className="text-[13px] font-bold text-gray-900 truncate">
                          {tx.reason || (isEarn ? '포인트 적립' : '포인트 사용')}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400">
                          <span>{tx.createdAt}</span>
                          {tx.adminMemo && (
                            <>
                              <span>•</span>
                              <span className="text-gray-500 truncate max-w-[140px]">{tx.adminMemo}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Amount & Balance */}
                    <div className="text-right shrink-0">
                      <div className={`text-sm font-black ${isEarn ? 'text-amber-600' : 'text-rose-500'}`}>
                        {formattedAmount}
                      </div>
                      {typeof tx.balanceAfter === 'number' && (
                        <div className="text-[10px] font-medium text-gray-400 mt-0.5">
                          잔액 {tx.balanceAfter.toLocaleString()}P
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 px-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700">해당 내역이 없습니다</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">신제품 리뷰 작성 및 활동으로 포인트를 모아보세요!</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Button to Earn Points */}
          <div className="bg-white rounded-2xl border border-gray-100 p-3.5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                <PenTool className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">신제품 리뷰 쓰고 포인트 받기</div>
                <div className="text-[11px] text-gray-500">최대 100P 적립 & 베스트 리뷰 선정 기회</div>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                setActiveTab('home');
              }}
              className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
            >
              신제품 구경
            </button>
          </div>

        </div>

        {/* 3. Footer */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-bold rounded-xl transition-colors"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
