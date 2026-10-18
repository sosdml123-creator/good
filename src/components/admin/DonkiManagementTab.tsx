import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, RefreshCw, Upload, X, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { adminApi } from '../../services/siteContentService';
import { supabase, uploadImageDataUrl } from '../../services/supabase';
import { DonkiCategory } from '../../services/donkiService';
import { DonkiStoresSection } from './DonkiStoresSection';
import { DonkiReviewsSection } from './DonkiReviewsSection';

interface DonkiRow {
  id: string;
  name: string;
  name_ja: string | null;
  brand: string;
  category: DonkiCategory;
  price_yen: number | null;
  description: string;
  image_url: string | null;
  badge: string | null;
  price_krw: number | null;
  krw_note: string | null;
  krw_checked_on: string | null;
  editor_rank: number;
  is_active: boolean;
  pick_count: number;
}

const CATEGORIES: DonkiCategory[] = ['의약품', '화장품', '과자·식품', '생활용품'];

const emptyForm = (rank: number): DonkiRow => ({
  id: '', name: '', name_ja: '', brand: '', category: '의약품', price_yen: null,
  description: '', image_url: '', badge: '', price_krw: null, krw_note: '', krw_checked_on: new Date().toISOString().slice(0, 10), editor_rank: rank, is_active: true, pick_count: 0,
});

const inputCls = 'w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:border-indigo-500 bg-white text-gray-900';

/** 필수템 목록 추가·수정·숨김·삭제 */
const DonkiItemsSection: React.FC = () => {
  const { showToast } = useApp();
  const [rows, setRows] = useState<DonkiRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<DonkiRow | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await adminApi<{ donkiItems: DonkiRow[] }>('list_donki');
    if (res.ok) setRows(res.data?.donkiItems || []);
    else showToast(res.error || '목록을 불러오지 못했습니다.', 'error');
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (row: DonkiRow, message = '저장했습니다.') => {
    setSaving(true);
    const { pick_count, ...item } = row;
    const res = await adminApi('upsert_donki', { item });
    setSaving(false);
    if (!res.ok) {
      showToast(res.error || '저장하지 못했습니다.', 'error');
      return false;
    }
    showToast(message, 'success');
    await load();
    return true;
  };

  const submitForm = async () => {
    if (!form) return;
    const id = (form.id || '').trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
    if (!id) return showToast('상품 ID를 영문으로 입력해주세요. (예: roihi-tsuboko)', 'error');
    if (isNew && rows.some(r => r.id === id)) return showToast('이미 있는 상품 ID입니다.', 'error');
    if (await save({ ...form, id })) setForm(null);
  };

  const remove = async (row: DonkiRow) => {
    if (!window.confirm(`'${row.name}'을(를) 삭제할까요? 회원들이 담은 기록도 함께 지워지고 되돌릴 수 없습니다.`)) return;
    const res = await adminApi('delete_donki', { ids: [row.id] });
    if (!res.ok) return showToast(res.error || '삭제하지 못했습니다.', 'error');
    showToast('삭제했습니다.', 'success');
    load();
  };

  const uploadPhoto = (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = String(reader.result || '');
      const uid = (await supabase?.auth.getSession())?.data.session?.user?.id;
      const url = uid ? await uploadImageDataUrl(dataUrl, uid, 'post') : dataUrl;
      if (url.startsWith('data:')) return showToast('사진을 올리지 못했습니다. 이미지 주소(URL)를 입력해주세요.', 'error');
      setForm(f => (f ? { ...f, image_url: url } : f));
    };
    reader.readAsDataURL(file);
  };

  const nextRank = rows.reduce((m, r) => Math.max(m, r.editor_rank || 0), 0) + 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-4">
        <div>
          <p className="text-[15px] font-bold text-gray-900">돈키호테 필수템 {rows.length}개</p>
          <p className="text-[12px] text-gray-500 mt-0.5">앱 순위는 회원이 담은 수 순서이고, 같으면 '기본 순서'로 정렬됩니다. 숨긴 상품은 앱에 보이지 않아요.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="px-3 py-2 rounded-lg border border-gray-200 text-[13px] text-gray-700 flex items-center gap-1.5 hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" /> 새로고침
          </button>
          <button
            onClick={() => { setIsNew(true); setForm(emptyForm(nextRank)); }}
            className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-[13px] font-bold flex items-center gap-1.5 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" /> 상품 추가
          </button>
        </div>
      </div>

      {form && (
        <div className="bg-white rounded-2xl border border-indigo-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-bold text-gray-900">{isNew ? '새 상품 추가' : `수정: ${form.name}`}</p>
            <button onClick={() => setForm(null)} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-[12px] text-gray-600">상품 ID (영문, 변경 불가)
              <input className={inputCls} value={form.id} disabled={!isNew} onChange={e => setForm({ ...form, id: e.target.value })} placeholder="roihi-tsuboko" />
            </label>
            <label className="text-[12px] text-gray-600">분류
              <select className={inputCls} value={form.category} onChange={e => setForm({ ...form, category: e.target.value as DonkiCategory })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="text-[12px] text-gray-600">상품명 (한국어)
              <input className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </label>
            <label className="text-[12px] text-gray-600">일본어 표기 (매장에서 찾을 때)
              <input className={inputCls} value={form.name_ja || ''} onChange={e => setForm({ ...form, name_ja: e.target.value })} />
            </label>
            <label className="text-[12px] text-gray-600">브랜드
              <input className={inputCls} value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-[12px] text-gray-600">참고가 (엔)
                <input className={inputCls} type="number" value={form.price_yen ?? ''} onChange={e => setForm({ ...form, price_yen: e.target.value === '' ? null : Number(e.target.value) })} />
              </label>
              <label className="text-[12px] text-gray-600">기본 순서
                <input className={inputCls} type="number" value={form.editor_rank} onChange={e => setForm({ ...form, editor_rank: Number(e.target.value) })} />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <label className="text-[12px] text-gray-600">한국 최저가 (원, 비우면 비교 안 함)
              <input className={inputCls} type="number" value={form.price_krw ?? ''} onChange={e => setForm({ ...form, price_krw: e.target.value === '' ? null : Number(e.target.value) })} />
            </label>
            <label className="text-[12px] text-gray-600">한국 가격 기준 (예: 18매 기준)
              <input className={inputCls} value={form.krw_note || ''} onChange={e => setForm({ ...form, krw_note: e.target.value })} />
            </label>
            <label className="text-[12px] text-gray-600">조사일
              <input className={inputCls} type="date" value={form.krw_checked_on || ''} onChange={e => setForm({ ...form, krw_checked_on: e.target.value })} />
            </label>
          </div>
          <label className="block text-[12px] text-gray-600">카드 라벨 (예: 스테디셀러, 선물용 · 비우면 표시 안 함)
            <input className={inputCls} value={form.badge || ''} maxLength={8} onChange={e => setForm({ ...form, badge: e.target.value })} />
          </label>
          <label className="block text-[12px] text-gray-600">한 줄 설명 (왜 사야 하는지)
            <textarea className={`${inputCls} h-16 resize-none`} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </label>
          <div className="flex items-end gap-3">
            <div className="w-20 h-20 shrink-0 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center text-[11px] text-gray-400">
              {form.image_url ? <img src={form.image_url} alt="" className="w-full h-full object-contain bg-white" /> : '사진 없음'}
            </div>
            <label className="flex-1 text-[12px] text-gray-600">사진 주소 (URL)
              <input className={inputCls} value={form.image_url || ''} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
            </label>
            <label className="px-3 py-2 rounded-lg border border-gray-200 text-[13px] text-gray-700 flex items-center gap-1.5 hover:bg-gray-50 cursor-pointer">
              <Upload className="w-4 h-4" /> 사진 올리기
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadPhoto(f); e.target.value = ''; }} />
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setForm(null)} className="px-4 py-2 rounded-lg border border-gray-200 text-[13px] text-gray-700">취소</button>
            <button onClick={submitForm} disabled={saving} className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-[13px] font-bold flex items-center gap-1.5 disabled:opacity-60">
              <Save className="w-4 h-4" /> {saving ? '저장 중…' : '저장'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <p className="py-16 text-center text-[13px] text-gray-400">불러오는 중…</p>
        ) : rows.length === 0 ? (
          <p className="py-16 text-center text-[13px] text-gray-400">등록된 상품이 없습니다. '상품 추가'를 눌러주세요.</p>
        ) : (
          <table className="w-full text-[13px]">
            <thead className="bg-gray-50 text-gray-500 text-[12px]">
              <tr>
                <th className="py-2.5 px-3 text-left">순서</th>
                <th className="py-2.5 px-3 text-left">상품</th>
                <th className="py-2.5 px-3 text-left">분류</th>
                <th className="py-2.5 px-3 text-right">돈키 / 한국</th>
                <th className="py-2.5 px-3 text-right">담은 회원</th>
                <th className="py-2.5 px-3 text-right">관리</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className={`border-t border-gray-100 ${r.is_active ? '' : 'opacity-50'}`}>
                  <td className="py-2.5 px-3 text-gray-500">{r.editor_rank}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        {r.image_url && <img src={r.image_url} alt="" className="w-full h-full object-contain bg-white" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{r.name}{!r.is_active && ' (숨김)'}</p>
                        <p className="text-[11px] text-gray-400 truncate">{r.brand} · {r.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-gray-600">{r.category}</td>
                  <td className="py-2.5 px-3 text-right text-gray-900">{r.price_yen ? `¥${r.price_yen.toLocaleString()}` : '-'}<span className="block text-[11px] text-gray-400">{r.price_krw ? `${r.price_krw.toLocaleString()}원` : '한국가 없음'}</span></td>
                  <td className="py-2.5 px-3 text-right font-semibold text-gray-900">{r.pick_count.toLocaleString()}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex justify-end gap-1">
                      <button title="수정" onClick={() => { setIsNew(false); setForm({ ...r }); }} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"><Pencil className="w-4 h-4" /></button>
                      <button
                        title={r.is_active ? '앱에서 숨기기' : '앱에 다시 보이기'}
                        onClick={() => save({ ...r, is_active: !r.is_active }, r.is_active ? '앱에서 숨겼습니다.' : '앱에 다시 보입니다.')}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
                      >
                        {r.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button title="삭제" onClick={() => remove(r)} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

/** 관리자: 돈키호테 가이드 (필수템 · 추천 매장) */
export const DonkiManagementTab: React.FC = () => {
  const [section, setSection] = useState<'items' | 'stores' | 'reviews'>('items');
  return (
    <div className="space-y-4">
      <div className="inline-flex p-1 rounded-xl bg-gray-100">
        {([['items', '필수템'], ['stores', '추천 매장'], ['reviews', '상품 리뷰']] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-bold ${section === id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
          >
            {label}
          </button>
        ))}
      </div>
      {section === 'items' ? <DonkiItemsSection /> : section === 'stores' ? <DonkiStoresSection /> : <DonkiReviewsSection />}
    </div>
  );
};
