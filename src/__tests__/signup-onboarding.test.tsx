import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';

const completeOnboarding = vi.fn(async () => {});
let needsNickname = true;

vi.mock('../context/AppContext', () => ({
  useApp: () => ({
    isOnboardingOpen: true,
    onboardingNeedsNickname: needsNickname,
    completeOnboarding,
    currentUser: { uid: 'u1', displayName: '신상러버_101' },
    isNicknameTaken: (name: string) => name === '이미있음',
  }),
}));

import { SignupOnboarding } from '../components/auth/SignupOnboarding';

const nextButton = () => screen.getByRole('button', { name: /동의하고 계속|다음|신상픽 시작하기/ }) as HTMLButtonElement;

beforeEach(() => {
  cleanup();
  completeOnboarding.mockClear();
  needsNickname = true;
});

describe('가입 온보딩', () => {
  it('필수 약관에 모두 동의해야 다음으로 넘어간다', () => {
    render(<SignupOnboarding />);
    expect(nextButton().disabled).toBe(true);
    fireEvent.click(screen.getByText('서비스 이용약관 동의'));
    fireEvent.click(screen.getByText('개인정보 수집·이용 동의'));
    expect(nextButton().disabled).toBe(true);
    fireEvent.click(screen.getByText('만 14세 이상입니다'));
    expect(nextButton().disabled).toBe(false);
  });

  it('야간 알림에 동의하면 광고성 정보 수신도 함께 동의된다', async () => {
    needsNickname = false;
    render(<SignupOnboarding />);
    fireEvent.click(screen.getByText('서비스 이용약관 동의'));
    fireEvent.click(screen.getByText('개인정보 수집·이용 동의'));
    fireEvent.click(screen.getByText('만 14세 이상입니다'));
    fireEvent.click(screen.getByText('야간 혜택 알림 수신 동의'));
    fireEvent.click(nextButton());
    fireEvent.click(nextButton());
    await waitFor(() => expect(completeOnboarding).toHaveBeenCalled());
    expect(completeOnboarding.mock.calls[0][0]).toMatchObject({ marketing: true, night: true, nickname: undefined });
  });

  it('전체 동의 → 닉네임 → 알림 설정 순서로 저장한다 (기본 이름·중복 닉네임은 거절)', async () => {
    render(<SignupOnboarding />);
    fireEvent.click(screen.getByText('전체 동의'));
    fireEvent.click(nextButton());

    const input = screen.getByPlaceholderText('예: 과자러버, 신상탐험가');
    fireEvent.change(input, { target: { value: '이미있음' } });
    fireEvent.click(nextButton());
    expect(screen.getByText('이미 다른 회원이 사용 중인 닉네임입니다.')).toBeTruthy();

    fireEvent.change(input, { target: { value: '과자탐험가' } });
    fireEvent.click(nextButton());

    fireEvent.click(screen.getByRole('button', { name: /아이스크림/ }));
    fireEvent.click(nextButton());

    await waitFor(() => expect(completeOnboarding).toHaveBeenCalledTimes(1));
    const arg = completeOnboarding.mock.calls[0][0] as any;
    expect(arg).toMatchObject({ nickname: '과자탐험가', marketing: true, night: true, pushOn: true });
    expect(arg.categories).toContain('아이스크림');
  });

  it('기존 회원(닉네임 설정됨)은 닉네임 단계를 건너뛴다', () => {
    needsNickname = false;
    render(<SignupOnboarding />);
    expect(screen.getByText(/1 \/ 2/)).toBeTruthy();
  });
});
