import React, { useEffect, useState } from 'react';
import { RefreshCw, Trash2, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { adminApi } from '../../services/siteContentService';

interface ReviewRow {
  id: string;
  item_id: string;
  user_name: string;
  rating: number;
  content: string;
  created_at: string;
}

/** 관리자: 돈키호테 상품 리뷰 확인·삭제 (신고 처리) */
export const DonkiReviewsSection: React.FC = () => {
  const { showToast } = useApp();
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await adminApi<{ donkiReviews: ReviewRow[] | null }>('list_donki_reviews');
    if (res.ok) setRows(res.data?.donkiReviews || []);
    else showToast(res.error || '리뷰를 불러오지 못했습니다.', 'error');
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (row: ReviewRow) => {
    if (!window.confirm(`${row.user_name}님의 리뷰를 삭제할까요? 되돌릴 수 없습니다.`)) return;
    const res = await adminApi('delete_donki_review', { ids: [row.id] });
    if (!res.ok) return showToast(res.error || '삭제하지 못했습니다.', 'error');
    showToast('리뷰를 삭제했습니다.', 'success');
    setRows(prev => prev.filter(r => r.id !== row.id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-4">
        <div>
          <p className="text-[15px] font-bold text-gray-900">상품 리뷰 {rows.length}개</p>
          <p className="text-[12px] text-gray-500 mt-0.5">회원이 쓴 리뷰만 보여요. 신고된 리뷰는 여기서 삭제하세요. (최근 300개)</p>
        </div>
        <button onClick={load} className="px-3 py-2 rounded-lg border border-gray-200 text-[13px] text-gray-700 flex items-center gap-1.5 hover:bg-gray-50">
          <RefreshCw className="w-4 h-4" /> 새로고침
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <p className="py-16 text-center text-[13px] text-gray-400">불러오는 중…</p>
        ) : rows.length === 0 ? (
          <p className="py-16 text-center text-[13px] text-gray-400">아직 리뷰가 없습니다.</p>
        ) : (
          <table className="w-full text-[13px]">
            <thead className="bg-gray-50 text-gray-500 text-[12px]">
              <tr>
                <th className="py-2.5 px-3 text-left">작성일</th>
                <th className="py-2.5 px-3 text-left">상품</th>
                <th className="py-2.5 px-3 text-left">작성자</th>
                <th className="py-2.5 px-3 text-left">별점·내용</th>
                <th className="py-2.5 px-3 text-right">관리</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-t border-gray-100 align-top">
                  <td className="py-2.5 px-3 text-gray-500 whitespace-nowrap">{r.created_at.slice(0, 10)}</td>
                  <td className="py-2.5 px-3 text-gray-700">{r.item_id}</td>
                  <td className="py-2.5 px-3 text-gray-900 font-semibold">{r.user_name}</td>
                  <td className="py-2.5 px-3">
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold"><Star className="w-3.5 h-3.5 fill-amber-400" />{r.rating}</span>
                    <p className="text-gray-700 whitespace-pre-wrap break-words max-w-[520px]">{r.content}</p>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button title="삭제" onClick={() => remove(r)} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"><Trash2 className="w-4 h-4" /></button>
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
