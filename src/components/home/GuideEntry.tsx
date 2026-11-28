import React from 'react';
import { Capacitor } from '@capacitor/core';
import { IS_TOSS } from '../../utils/toss';
import { guideSummaries, serviceIntro } from '../../data/guideSummaries';

export const GuideEntry: React.FC = () => {
  if (IS_TOSS || Capacitor.isNativePlatform()) return null;
  return (
    <section aria-label="가격·열량 데이터 가이드" className="mx-4 my-8 border-t border-gray-200 pt-6 select-text">
      <h2 className="text-lg font-bold text-gray-900">가격·열량 데이터 가이드</h2>
      <div className="mt-3 space-y-2 text-sm leading-relaxed text-gray-600">
        {serviceIntro.map(text => <p key={text}>{text}</p>)}
      </div>
      <ul className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        {guideSummaries.map(guide => (
          <li key={guide.slug} className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="text-sm font-semibold leading-relaxed text-gray-900">
              <a href={'/guide/' + guide.slug} className="underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600">{guide.title}</a>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{guide.summary}</p>
          </li>
        ))}
      </ul>
      <a href="/guide" className="mt-4 inline-block text-sm font-semibold text-violet-800 underline">전체 가이드 보기 →</a>
      <nav aria-label="서비스 안내" className="mt-5 flex flex-wrap gap-x-4 gap-y-3 text-sm text-gray-600">
        <a href="/about">소개</a><a href="/editorial-policy">편집 원칙</a><a href="/contact">문의</a><a href="/terms">이용약관</a><a href="/privacy">개인정보처리방침</a>
      </nav>
    </section>
  );
};
