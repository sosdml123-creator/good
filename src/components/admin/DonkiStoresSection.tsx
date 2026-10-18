import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, RefreshCw, X, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { adminApi } from '../../services/siteContentService';

interface StoreRow {
  id: string;
  city: string;
  name: string;
  name_ja: string;
  area: string | null;
  feature: string | null;
  sort_order: number;
  is_active: boolean;
}

const inputCls = 'w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:border-indigo-500 bg-white text-gray-900';

/** 관리자: 돈키호테 추천 매장 추가·수정·숨김·삭제 */
export const DonkiStoresSection: React.FC = () => {
  const { showToast } = useApp();
  const [rows, setRows] = useState<StoreRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<StoreRow | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await adminApi<{ donkiStores: StoreRow[] | null }>('list_donki_stores');
    if (res.ok) setRows(res.data?.donkiStores || []);
    else showToast(res.error || '매장 목록을 불러오지 못했습니다.', 'error');
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (row: StoreRow, message = '저장했습니다.') => {
    setSaving(true);
    const res = await adminApi('upsert_donki_store', { store: row });
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
    if (!id) return showToast('매장 ID를 영문으로 입력해주세요. (예: tokyo-shibuya)', 'error');
    if (isNew && rows.some(r => r.id === id)) return showToast('이미 있는 매장 ID입니다.', 'error');
    if (await save({ ...form, id })) setForm(null);
  };

  const remove = async (row: StoreRow) => {
    if (!window.confirm(`'${row.name}' 매장을 삭제할까요? 되돌릴 수 없습니다.`)) return;
    const res = await adminApi('delete_donki_store', { ids: [row.id] });
    if (!res.ok) return showToast(res.error || '삭제하지 못했습니다.', 'error');
    showToast('삭제했습니다.', 'success');
    load();
  };

  const nextOrder = rows.reduce((m, r) => Math.max(m, r.sort_order || 0), 0) + 10;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-4">
        <div>
          <p className="text-[15px] font-bold text-gray-900">추천 매장 {rows.length}곳</p>
          <p className="text-[12px] text-gray-500 mt-0.5">앱·PC의 '매장' 탭에 순서대로 보여요. 지도 버튼은 일본어 매장명으로 구글 지도를 검색해요.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="px-3 py-2 rounded-lg border border-gray-200 text-[13px] text-gray-700 flex items-center gap-1.5 hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" /> 새로고침
          </button>
          <button
            onClick={() => { setIsNew(true); setForm({ id: '', city: '도쿄', name: '', name_ja: '', area: '', feature: '', sort_order: nextOrder, is_active: true }); }}
            className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-[13px] font-bold flex items-center gap-1.5 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" /> 매장 추가
          </button>
        </div>
      </div>

      {form && (
        <div className="bg-white rounded-2xl border border-indigo-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-bold text-gray-900">{isNew ? '새 매장 추가' : `수정: ${form.name}`}</p>
            <button onClick={() => setForm(null)} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-[12px] text-gray-600">매장 ID (영문, 변경 불가)
              <input className={inputCls} value={form.id} disabled={!isNew} onChange={e => setForm({ ...form, id: e.target.value })} placeholder="tokyo-shibuya" />
            </label>
            <label className="text-[12px] text-gray-600">도시
              <input className={inputCls} value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="도쿄" />
            </label>
            <label className="text-[12px] text-gray-600">매장명 (한국어)
              <input className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </label>
            <label className="text-[12px] text-gray-600">일본어 매장명 (지도 검색·택시용)
              <input className={inputCls} value={form.name_ja} onChange={e => setForm({ ...form, name_ja: e.target.value })} placeholder="ドン・キホーテ〇〇店" />
            </label>
            <label className="text-[12px] text-gray-600">가까운 역·동네
              <input className={inputCls} value={form.area || ''} onChange={e => setForm({ ...form, area: e.target.value })} />
            </label>
            <label className="text-[12px] text-gray-600">순서 (작을수록 위)
              <input className={inputCls} type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} />
            </label>
          </div>
          <label className="block text-[12px] text-gray-600">한 줄 특징
            <textarea className={`${inputCls} h-16 resize-none`} value={form.feature || ''} onChange={e => setForm({ ...form, feature: e.target.value })} />
          </label>
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
          <p className="py-16 text-center text-[13px] text-gray-400">등록된 매장이 없습니다.</p>
        ) : (
          <table className="w-full text-[13px]">
            <thead className="bg-gray-50 text-gray-500 text-[12px]">
              <tr>
                <th className="py-2.5 px-3 text-left">순서</th>
                <th className="py-2.5 px-3 text-left">도시</th>
                <th className="py-2.5 px-3 text-left">매장</th>
                <th className="py-2.5 px-3 text-left">특징</th>
                <th className="py-2.5 px-3 text-right">관리</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className={`border-t border-gray-100 ${r.is_active ? '' : 'opacity-50'}`}>
                  <td className="py-2.5 px-3 text-gray-500">{r.sort_order}</td>
                  <td className="py-2.5 px-3 text-gray-700">{r.city}</td>
                  <td className="py-2.5 px-3">
                    <p className="font-semibold text-gray-900">{r.name}{!r.is_active && ' (숨김)'}</p>
                    <p className="text-[11px] text-gray-400">{r.name_ja}{r.area ? ` · ${r.area}` : ''}</p>
                  </td>
                  <td className="py-2.5 px-3 text-gray-500 max-w-[320px] truncate">{r.feature}</td>
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
