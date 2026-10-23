import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import BeautyApp from '../beauty/BeautyApp';

beforeEach(() => localStorage.clear());
afterEach(cleanup);
describe('Beauty MD workspace', () => {
  it('filters the product collection using the global search', () => {
    render(<BeautyApp />);
    fireEvent.click(screen.getByRole('button', { name: '상품 소싱', exact: true }));
    fireEvent.change(screen.getByRole('textbox', { name: '뉴스 성분 상품 통합 검색' }), { target: { value: 'COSRX' } });
    expect(screen.getByText('더 블루 펩타이드 바쿠치올 플럼프 글로우 세럼')).toBeTruthy();
    expect(screen.queryByText('PDRN 모공 탄력 패드')).toBeNull();
  });
  it('persists a selected product and shows it on the sourcing board', () => {
    render(<BeautyApp />);
    fireEvent.click(screen.getByRole('button', { name: '상품 소싱', exact: true }));
    fireEvent.click(screen.getAllByRole('button', { name: '보드에 저장' })[0]);
    expect(JSON.parse(localStorage.getItem('beauty-edit-board-v1') || '[]')).toEqual(['mediheal']);
    fireEvent.click(screen.getByRole('button', { name: /저장한 보드/ }));
    expect(screen.getByText('PDRN 모공 탄력 패드')).toBeTruthy();
    expect(screen.queryByText('붉은팥 PDRN 모공탄력 세럼')).toBeNull();
    expect(screen.getByRole('button', { name: 'CSV 내보내기' })).toBeTruthy();
  });
  it('handles invalid stored data and closes ingredient insights with Escape', () => {
    localStorage.setItem('beauty-edit-board-v1', '{broken');
    render(<BeautyApp />);
    fireEvent.click(screen.getByRole('button', { name: /01 PDRN/ }));
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
