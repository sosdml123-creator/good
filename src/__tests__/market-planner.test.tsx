import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MarketPlanner } from '../components/agri/MarketPlanner';
import type { MarketPriceRow } from '../pc/useMarketPrices';
vi.mock('../pc/useMarketPrices', () => ({ formatWon: (n: number | null) => n === null ? '-' : `${n}원` }));
const rows = ['사과', '배', '무', '굴'].map((itemName, i) => ({ key: String(i), itemCode: String(i), kindCode: '00', itemName, kindName: '', category: '과일류', rank: '상품', unit: '1kg', today: 1000, weekAgo: null, monthAgo: 2000, changeRate: null } as MarketPriceRow));
beforeEach(() => { cleanup(); localStorage.clear(); });
describe('장보기 탐색', () => {
  it('관심 저장을 다시 열었을 때 복원한다', () => {
    const view = render(<MarketPlanner rows={rows} date="2026-11-06" />);
    fireEvent.click(screen.getByRole('button', { name: '전체 탐색' }));
    fireEvent.click(screen.getByRole('button', { name: '사과 관심 품목' }));
    view.unmount();
    render(<MarketPlanner rows={rows} date="2026-11-06" />);
    fireEvent.click(screen.getByRole('button', { name: '관심 1' }));
    expect(screen.getByRole('heading', { name: '사과' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: '배' })).toBeNull();
  });
  it('비교는 세 개로 제한하고 제거하면 다시 담을 수 있다', () => {
    render(<MarketPlanner rows={rows} date="2026-11-06" />);
    fireEvent.click(screen.getByRole('button', { name: '전체 탐색' }));
    for (let i = 0; i < 3; i++) fireEvent.click(screen.getAllByRole('button', { name: '비교 담기' })[0]);
    expect((screen.getByRole('button', { name: '비교 담기' }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByRole('table').textContent).toContain('1kg');
    fireEvent.click(screen.getByRole('button', { name: '사과 비교에서 제거' }));
    expect((screen.getAllByRole('button', { name: '비교 담기' })[0] as HTMLButtonElement).disabled).toBe(false);
  });
});
