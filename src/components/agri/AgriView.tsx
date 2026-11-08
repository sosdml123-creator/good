import React from 'react';
import { Heart, Home, LineChart, MessageSquareText, ShoppingBasket, User } from 'lucide-react';
import { AgriProvider, AgriTab, useAgri } from './AgriContext';
import { AgriHome } from './AgriHome';
import { AgriPrices } from './AgriPrices';
import { AgriItem } from './AgriItem';
import { AgriReviewDetail, AgriReviews } from './AgriReviews';
import { AgriMy, AgriSaved } from './AgriMine';

const NAV: { id: AgriTab; label: string; Icon: typeof Home }[] = [
  // 신상픽 홈과 헷갈리지 않도록 농수산물 첫 화면은 '장보기'로 부릅니다.
  { id: 'home', label: '장보기', Icon: ShoppingBasket },
  { id: 'prices', label: '시세', Icon: LineChart },
  { id: 'reviews', label: '리뷰', Icon: MessageSquareText },
  { id: 'saved', label: '관심', Icon: Heart },
  { id: 'my', label: '마이', Icon: User },
];

const BottomBar: React.FC = () => {
  const { tab, goTab, alerts } = useAgri();
  return (
    <nav aria-label="장보기 시세 메뉴" className="fixed bottom-0 left-0 right-0 z-30 flex justify-center">
      <div className="w-full max-w-[430px] bg-white border-t border-[#ECEEF0] pb-[max(env(safe-area-inset-bottom),4px)]">
        <div className="flex">
          {NAV.map(({ id, label, Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => goTab(id)}
                aria-current={active ? 'page' : undefined}
                className="relative flex-1 h-[54px] flex flex-col items-center justify-center gap-[3px]"
              >
                <Icon className="w-[22px] h-[22px]" strokeWidth={active ? 2.1 : 1.7} color={active ? '#191C20' : '#A3AAB1'} />
                <span className={`text-[11px] ${active ? 'font-semibold text-[#191C20]' : 'text-[#8A929A]'}`}>{label}</span>
                {id === 'saved' && alerts.length > 0 && <span className="absolute top-2 left-1/2 ml-2 w-1.5 h-1.5 rounded-full bg-[#D23F35]" aria-label="새 가격 알림" />}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

const Screens: React.FC = () => {
  const { tab, stack } = useAgri();
  const top = stack[stack.length - 1];
  if (top?.type === 'item') return <AgriItem key={top.id} id={top.id} />;
  if (top?.type === 'review') return <AgriReviewDetail key={top.id} id={top.id} />;
  return (
    <>
      {tab === 'home' && <AgriHome />}
      {tab === 'prices' && <AgriPrices />}
      {tab === 'reviews' && <AgriReviews />}
      {tab === 'saved' && <AgriSaved />}
      {tab === 'my' && <AgriMy />}
      <BottomBar />
    </>
  );
};

/**
 * 장보기 시세 (농수산물 시세 · 실구매 후기)
 * 신상픽 홈의 '농수산물' 메뉴로 들어오는 독립 화면으로, 전용 하단 탭(홈/시세/리뷰/관심/마이)을 씁니다.
 * 시세는 KAMIS 공시가만, 후기는 신상픽 회원이 직접 쓴 후기만 보여 줍니다.
 */
export const AgriView: React.FC = () => (
  <AgriProvider>
    <div className="bg-white min-h-full font-sans text-[#191C20]">
      <Screens />
    </div>
  </AgriProvider>
);
