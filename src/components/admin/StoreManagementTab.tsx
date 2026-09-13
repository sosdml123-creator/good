import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StoreChannelInfo, StoreChannelType } from '../../types';
import { 
  Store, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  X
} from 'lucide-react';

interface StoreManagementTabProps {
  isDark: boolean;
}

export const StoreManagementTab: React.FC<StoreManagementTabProps> = ({ isDark }) => {
  const { 
    storeChannels, 
    products, 
    addStoreChannel, 
    updateStoreChannel, 
    deleteStoreChannel, 
    toggleStoreChannelActive,
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<StoreChannelInfo, 'id' | 'order'> & { id?: string; order?: number }>({
    id: '',
    name: '',
    category: 'convenience',
    logo: '',
    defaultLink: '',
    deliveryBadge: '매장 픽업 🛍️',
    color: '#652D90',
    isActive: true,
    order: 1
  });

  const categoryLabels: Record<StoreChannelType, string> = {
    convenience: '편의점',
    mart: '대형마트',
    online: '온라인/새벽배송',
    official: '공식몰',
    specialty: '전문점/H&B'
  };

  const deliveryBadgePresets = [
    '매장 픽업 🛍️',
    '새벽배송 🚀',
    '로켓프레시 🚀',
    '샛별배송 🚀',
    '당일 배송 ⚡',
    '즉시 배달 ⚡',
    '오늘드림 ⚡',
    '쓱배송 ⚡',
    '택배 배송 📦',
    '브랜드 직영 🏢'
  ];

  // Filtered store channels
  const filteredStores = useMemo(() => {
    return storeChannels.filter(s => {
      const matchSearch = !searchQuery.trim() || 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.deliveryBadge && s.deliveryBadge.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchCategory = selectedCategory === '전체' || s.category === selectedCategory;

      return matchSearch && matchCategory;
    }).sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [storeChannels, searchQuery, selectedCategory]);

  // Statistics
  const stats = useMemo(() => {
    const total = storeChannels.length;
    const active = storeChannels.filter(s => s.isActive).length;
    const convenience = storeChannels.filter(s => s.category === 'convenience').length;
    const online = storeChannels.filter(s => s.category === 'online').length;
    return { total, active, convenience, online };
  }, [storeChannels]);

  // Open modal for new
  const handleOpenNewModal = () => {
    setEditingStoreId(null);
    setFormData({
      id: '',
      name: '',
      category: 'convenience',
      logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=120',
      defaultLink: '',
      deliveryBadge: '매장 픽업 🛍️',
      color: '#4F46E5',
      isActive: true,
      order: storeChannels.length + 1
    });
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEditModal = (store: StoreChannelInfo) => {
    setEditingStoreId(store.id);
    setFormData({
      id: store.id,
      name: store.name,
      category: store.category,
      logo: store.logo || '',
      defaultLink: store.defaultLink || '',
      deliveryBadge: store.deliveryBadge || '매장 픽업 🛍️',
      color: store.color || '#4F46E5',
      isActive: store.isActive,
      order: store.order
    });
    setIsModalOpen(true);
  };

  // Submit save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('판매처명을 입력해주세요.', 'error');
      return;
    }

    if (editingStoreId) {
      updateStoreChannel(editingStoreId, {
        name: formData.name.trim(),
        category: formData.category,
        logo: formData.logo?.trim(),
        defaultLink: formData.defaultLink?.trim(),
        deliveryBadge: formData.deliveryBadge?.trim(),
        color: formData.color,
        isActive: formData.isActive,
        order: Number(formData.order) || 1
      });
    } else {
      addStoreChannel({
        id: formData.id?.trim() || `store_${Date.now()}`,
        name: formData.name.trim(),
        category: formData.category,
        logo: formData.logo?.trim() || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=120',
        defaultLink: formData.defaultLink?.trim(),
        deliveryBadge: formData.deliveryBadge?.trim(),
        color: formData.color || '#4F46E5',
        isActive: formData.isActive,
        order: Number(formData.order) || (storeChannels.length + 1)
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteStoreChannel(id);
    setDeleteConfirmId(null);
  };

  const cardBg = isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900';
  const inputBg = isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              판매처 & 유통채널 마스터 관리
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              편의점(CU/GS25 등), 대형마트, 새벽배송/온라인몰 판매처를 등록·수정·삭제하고 상품별 재고와 바로가기 링크를 연계합니다.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenNewModal}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md shadow-indigo-600/20 active:scale-95 transition-all self-start lg:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>새 판매처 등록</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <div className="text-xs text-slate-500">전체 등록 판매처</div>
          <div className="mt-2 text-2xl font-black font-mono">{stats.total}개</div>
        </div>
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <div className="text-xs text-slate-500">활성 서비스 중</div>
          <div className="mt-2 text-2xl font-black font-mono text-emerald-600">{stats.active}개</div>
        </div>
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <div className="text-xs text-slate-500">편의점 채널</div>
          <div className="mt-2 text-2xl font-black font-mono text-indigo-600">{stats.convenience}개</div>
        </div>
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <div className="text-xs text-slate-500">새벽/온라인몰</div>
          <div className="mt-2 text-2xl font-black font-mono text-purple-600">{stats.online}개</div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-3 ${cardBg}`}>
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="판매처명, 배송 형태 검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs border focus:outline-none focus:border-indigo-500 ${inputBg}`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory('전체')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
              selectedCategory === '전체' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}
          >
            전체
          </button>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                selectedCategory === key ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-2xl border overflow-hidden shadow-xs ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b font-bold ${isDark ? 'bg-slate-800/80 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
              <tr>
                <th className="p-3.5 w-14 text-center">순서</th>
                <th className="p-3.5">판매처명</th>
                <th className="p-3.5">채널 유형</th>
                <th className="p-3.5">배송/이용 뱃지</th>
                <th className="p-3.5">기본 공식 링크</th>
                <th className="p-3.5 text-center">취급 상품수</th>
                <th className="p-3.5 text-center">활성 상태</th>
                <th className="p-3.5 text-right w-24">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredStores.map((store, idx) => {
                const stockCount = products.filter(p => 
                  p.stores?.includes(store.name) || 
                  p.storeStocks?.some(ss => ss.store === store.name)
                ).length;

                return (
                  <tr key={store.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5 text-center font-mono text-slate-400">
                      {store.order || (idx + 1)}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs" 
                          style={{ backgroundColor: store.color || '#4F46E5' }} 
                        />
                        <span className="font-bold text-slate-900 dark:text-white">{store.name}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 font-bold">
                        {categoryLabels[store.category] || store.category}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {store.deliveryBadge ? (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-[11px]">
                          {store.deliveryBadge}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-3.5 max-w-xs">
                      {store.defaultLink ? (
                        <a
                          href={store.defaultLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline flex items-center gap-1 font-mono text-[11px] truncate"
                        >
                          <span className="truncate">{store.defaultLink}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-3.5 text-center font-mono font-bold">
                      {stockCount}개
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => toggleStoreChannelActive(store.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                          store.isActive 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                            : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                        }`}
                      >
                        {store.isActive ? '노출 중' : '숨김'}
                      </button>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(store)}
                          className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                          title="수정"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(store.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================
          MODAL: ADD / EDIT STORE
         ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border ${cardBg}`}>
            {/* Header */}
            <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm">
                  {editingStoreId ? '판매처 정보 수정' : '새 판매처 등록'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">판매처명 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: CU, GS25, 마켓컬리, 올리브영"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">채널 유형</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as StoreChannelType })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  >
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">대표 테마 색상 (HEX)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={e => setFormData({ ...formData, color: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={e => setFormData({ ...formData, color: e.target.value })}
                      className={`flex-1 p-2 rounded-xl text-xs font-mono border ${inputBg}`}
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Badge */}
              <div>
                <label className="block text-xs font-bold mb-1">대표 배송 / 픽업 안내 뱃지</label>
                <input
                  type="text"
                  placeholder="예: 새벽배송 🚀, 매장 픽업 🛍️"
                  value={formData.deliveryBadge}
                  onChange={e => setFormData({ ...formData, deliveryBadge: e.target.value })}
                  className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {deliveryBadgePresets.map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFormData({ ...formData, deliveryBadge: preset })}
                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Default Web/App Link */}
              <div>
                <label className="block text-xs font-bold mb-1">기본 공식 구매 / 앱 URL</label>
                <input
                  type="url"
                  placeholder="예: https://cu.bgfretail.com 또는 앱 스토어 주소"
                  value={formData.defaultLink}
                  onChange={e => setFormData({ ...formData, defaultLink: e.target.value })}
                  className={`w-full p-2.5 rounded-xl text-xs border font-mono ${inputBg}`}
                />
              </div>

              {/* Active & Order */}
              <div className="grid grid-cols-2 gap-4 items-center pt-2">
                <div>
                  <label className="block text-xs font-bold mb-1">노출 정렬 순서</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={e => setFormData({ ...formData, order: Number(e.target.value) })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-slate-300 text-indigo-600 w-4 h-4"
                    />
                    <span>앱 내 판매처로 활성화</span>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black"
                >
                  {editingStoreId ? '수정사항 저장' : '판매처 등록 완료'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-2xl p-5 max-w-sm w-full border shadow-2xl space-y-4 ${cardBg}`}>
            <div className="text-center">
              <h4 className="font-bold text-sm">판매처를 삭제하시겠습니까?</h4>
              <p className="text-xs text-slate-400 mt-1">판매처 마스터 목록에서 제거됩니다.</p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl text-xs font-bold border border-slate-200"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
