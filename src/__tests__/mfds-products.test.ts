import { describe, it, expect } from 'vitest';
// @ts-expect-error 서버 전용 JS 모듈
import { toMfdsRow, orderIngredients } from '../../api/_lib/mfdsProducts.js';

const base = {
  PRDLST_REPORT_NO: '19780614001123',
  PRMS_DT: '20261008',
  PRDLST_NM: '칠성사이다제로유자',
  BSSH_NM: '롯데칠성음료(주)',
  PRDLST_DCNM: '탄산음료',
  INDUTY_CD_NM: '식품제조가공업',
};
const row = (patch = {}) => toMfdsRow({ ...base, ...patch }, '20261001', '20261011');

describe('식약처 품목제조보고 → 대기함 행', () => {
  it('주요 식품사의 소비자용 제품을 변환한다', () => {
    expect(row()).toMatchObject({
      id: 'mfds-19780614001123',
      name: '칠성사이다제로유자',
      brand: '롯데칠성음료',
      category: '음료',
      sub_category: '탄산음료',
      release_date: '2026-10-08',
      image: '',
      price: 0,
    });
  });

  it('공장명·법인 표기가 붙은 제조사도 브랜드로 묶는다', () => {
    expect(row({ BSSH_NM: '(주)오리온제4청주공장', PRDLST_DCNM: '과자' })?.brand).toBe('오리온');
    expect(row({ BSSH_NM: '주식회사 삼립 청주공장', PRDLST_DCNM: '빵류' })?.brand).toBe('삼립');
  });

  it('목록에 없는 제조사·업소용 식품유형·첨가물은 제외한다', () => {
    expect(row({ BSSH_NM: '(주)스위트필' })).toBeNull();
    expect(row({ BSSH_NM: '농심태경(주)' })).toBeNull();
    expect(row({ PRDLST_DCNM: '소스' })).toBeNull();
    expect(row({ INDUTY_CD_NM: '식품첨가물제조업' })).toBeNull();
  });

  it('반제품·원료·수출용 이름은 제외한다', () => {
    expect(row({ PRDLST_NM: '반)도치무스(상)' })).toBeNull();
    expect(row({ PRDLST_NM: '순하리 딸기 원액' })).toBeNull();
    expect(row({ PRDLST_NM: 'Chilsung Cider Zero' })).toBeNull();
  });

  it('기간 밖이거나 잘못 입력된 보고일자는 제외한다', () => {
    expect(row({ PRMS_DT: '20260930' })).toBeNull();
    expect(row({ PRMS_DT: '21000712' })).toBeNull();
  });

  it('원재료를 배합 순번대로 정렬한다', () => {
    expect(orderIngredients({ RAWMTRL_NM: '향료, 정제수, 설탕', RAWMTRL_ORDNO: '3,1,2' })).toBe('정제수, 설탕, 향료');
    expect(orderIngredients({ RAWMTRL_NM: '정제수, 설탕', RAWMTRL_ORDNO: '' })).toBe('정제수, 설탕');
  });
});
