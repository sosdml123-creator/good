import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SalePromotionItem, SaleDealType, SaleStoreType, ProductCategory } from '../../types';
import { CATEGORIES } from '../../data/mockProducts';
import { 
  Tag, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Flame, 
  X
} from 'lucide-react';

interface SalePromotionManagementTabProps {
  isDark: boolean;
}

export const SalePromotionManagementTab: React.FC<SalePromotionManagementTabProps> = ({ isDark }) => {
  const { 
    salePromotions, 
    addSalePromotion, 
    updateSalePromotion, 
    deleteSalePromotion, 
    toggleSaleHot,
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDealType, setSelectedDealType] = useState<string>('전체');
  const [selectedStore, setSelectedStore] = useState<string>('전체');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSaleId, setEditingSaleId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<SalePromotionItem, 'id' | 'likeCount'> & { id?: string; likeCount?: number }>({
    id: '',
    title: '',
    brand: '',
    category: '과자',
    subCategory: '스낵',
    store: 'CU',
    dealType: '1+1',
    badgeText: '1+1',
    originalPrice: 3000,
    salePrice: 1500,
    unitPriceDescription: '개당 1,500원 꼴',
    discountRate: 50,
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80',
    period: '09.01 ~ 09.30',
    dDay: 'D-15',
    benefitTag: '',
    description: '',
    isHot: false
  });

  const dealTypes: SaleDealType[] = ['1+1', '2+1', '할인특가', '콤보할인', '증정행사'];
  const storesList: SaleStoreType[] = ['CU', 'GS25', '세븐일레븐', '이마트24', '이마트', '홈플러스', '전체'];

  // Filtered promotions
  const filteredSales = useMemo(() => {
    return salePromotions.filter(item => {
      const matchSearch = !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDeal = selectedDealType === '전체' || item.dealType === selectedDealType;
      const matchStore = selectedStore === '전체' || item.store === selectedStore;

      return matchSearch && matchDeal && matchStore;
    });
  }, [salePromotions, searchQuery, selectedDealType, selectedStore]);

  // Open modal for new
  const handleOpenNewModal = () => {
    setEditingSaleId(null);
    setFormData({
      id: '',
      title: '',
      brand: '',
      category: '과자',
      subCategory: '',
      store: 'CU',
      dealType: '1+1',
      badgeText: '1+1 특가',
      originalPrice: 3000,
      salePrice: 1500,
      unitPriceDescription: '개당 1,500원 꼴',
      discountRate: 50,
      image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80',
      period: '09.01 ~ 09.30',
      dDay: 'D-15',
      benefitTag: '',
      description: '',
      isHot: false
    });
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEditModal = (item: SalePromotionItem) => {
    setEditingSaleId(item.id);
    setFormData({
      id: item.id,
      title: item.title,
      brand: item.brand,
      category: item.category,
      subCategory: item.subCategory || '',
      store: item.store,
      dealType: item.dealType,
      badgeText: item.badgeText,
      originalPrice: item.originalPrice,
      salePrice: item.salePrice,
      unitPriceDescription: item.unitPriceDescription,
      discountRate: item.discountRate || 0,
      image: item.image,
      period: item.period,
      dDay: item.dDay,
      benefitTag: item.benefitTag || '',
      description: item.description,
      isHot: item.isHot ?? false
    });
    setIsModalOpen(true);
  };

  // Auto calculate discount rate & unit price
  const handlePriceChange = (orig: number, sale: number, type: SaleDealType) => {
    let rate = 0;
    let unitDesc = '';
    if (orig > 0 && sale >= 0) {
      rate = Math.round(((orig - sale) / orig) * 100);
    }
    if (type === '1+1') {
      unitDesc = `개당 ${Math.round(orig / 2).toLocaleString()}원 꼴`;
    } else if (type === '2+1') {
      unitDesc = `개당 ${Math.round((orig * 2) / 3).toLocaleString()}원 꼴`;
    } else {
      unitDesc = `정상가 대비 ${rate}% 할인`;
    }

    setFormData(prev => ({
      ...prev,
      originalPrice: orig,
      salePrice: sale,
      discountRate: rate > 0 ? rate : 0,
      unitPriceDescription: unitDesc
    }));
  };

  // Submit save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('행사 상품명을 입력해주세요.', 'error');
      return;
    }

    if (editingSaleId) {
      updateSalePromotion(editingSaleId, {
        title: formData.title.trim(),
        brand: formData.brand.trim(),
        category: formData.category,
        subCategory: formData.subCategory?.trim(),
        store: formData.store,
        dealType: formData.dealType,
        badgeText: formData.badgeText.trim() || formData.dealType,
        originalPrice: Number(formData.originalPrice) || 0,
        salePrice: Number(formData.salePrice) || 0,
        unitPriceDescription: formData.unitPriceDescription.trim(),
        discountRate: Number(formData.discountRate) || 0,
        image: formData.image.trim(),
        period: formData.period.trim(),
        dDay: formData.dDay.trim(),
        benefitTag: formData.benefitTag?.trim(),
        description: formData.description.trim(),
        isHot: formData.isHot
      });
    } else {
      addSalePromotion({
        id: formData.id?.trim() || `sale_${Date.now()}`,
        title: formData.title.trim(),
        brand: formData.brand.trim(),
        category: formData.category,
        subCategory: formData.subCategory?.trim(),
        store: formData.store,
        dealType: formData.dealType,
        badgeText: formData.badgeText.trim() || formData.dealType,
        originalPrice: Number(formData.originalPrice) || 0,
        salePrice: Number(formData.salePrice) || 0,
        unitPriceDescription: formData.unitPriceDescription.trim(),
        discountRate: Number(formData.discountRate) || 0,
        image: formData.image.trim() || 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600',
        period: formData.period.trim(),
        dDay: formData.dDay.trim() || '상시',
        benefitTag: formData.benefitTag?.trim(),
        description: formData.description.trim(),
        isHot: formData.isHot
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteSalePromotion(id);
    setDeleteConfirmId(null);
  };

  const cardBg = isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900';
  const subCardBg = isDark ? 'bg-slate-850 border-slate-800' : 'bg-slate-50 border-slate-200';
  const inputBg = isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-rose-600/10 text-rose-600 flex items-center justify-center font-bold">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              편의점 & 마트 1+1 / 특가 할인 행사소식 관리
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              전국 편의점 및 마트의 1+1, 2+1, 타임세일 행사 소식을 실시간 등록·수정·삭제합니다.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenNewModal}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md shadow-rose-600/20 active:scale-95 transition-all self-start lg:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>새 행사소식 등록</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <div className="text-xs text-slate-500">진행 중인 행사</div>
          <div className="mt-2 text-2xl font-black font-mono">{salePromotions.length}개</div>
        </div>
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <div className="text-xs text-slate-500">🔥 핫딜(HOT) 행사</div>
          <div className="mt-2 text-2xl font-black font-mono text-orange-600">
            {salePromotions.filter(s => s.isHot).length}개
          </div>
        </div>
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <div className="text-xs text-slate-500">1+1 행사</div>
          <div className="mt-2 text-2xl font-black font-mono text-indigo-600">
            {salePromotions.filter(s => s.dealType === '1+1').length}개
          </div>
        </div>
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <div className="text-xs text-slate-500">2+1 행사</div>
          <div className="mt-2 text-2xl font-black font-mono text-purple-600">
            {salePromotions.filter(s => s.dealType === '2+1').length}개
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-3 ${cardBg}`}>
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="상품명, 브랜드, 설명 검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs border focus:outline-none focus:border-rose-500 ${inputBg}`}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
          {/* Deal Type Pills */}
          <div className="flex items-center gap-1">
            {['전체', '1+1', '2+1', '할인특가', '콤보할인'].map(type => (
              <button
                key={type}
                onClick={() => setSelectedDealType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                  selectedDealType === type ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Store Select */}
          <select
            value={selectedStore}
            onChange={e => setSelectedStore(e.target.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${inputBg}`}
          >
            {['전체', 'CU', 'GS25', '세븐일레븐', '이마트24', '이마트', '홈플러스'].map(st => (
              <option key={st} value={st}>{st === '전체' ? '전체 판매처' : st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sales List Table */}
      <div className={`rounded-2xl border overflow-hidden shadow-xs ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b font-bold ${isDark ? 'bg-slate-800/80 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
              <tr>
                <th className="p-3.5 w-14 text-center">이미지</th>
                <th className="p-3.5">행사 상품명 / 브랜드</th>
                <th className="p-3.5">판매처</th>
                <th className="p-3.5">행사 유형</th>
                <th className="p-3.5">가격 & 단가 혜택</th>
                <th className="p-3.5">기간 & D-Day</th>
                <th className="p-3.5 text-center">HOT</th>
                <th className="p-3.5 text-right w-24">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredSales.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 text-center">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-10 h-10 rounded-lg object-cover mx-auto border border-slate-200 dark:border-slate-700 bg-slate-100" 
                    />
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{item.title}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {item.brand} &middot; {item.category}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                      {item.store}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full font-black text-[10px] text-white ${
                      item.dealType === '1+1' ? 'bg-rose-500' :
                      item.dealType === '2+1' ? 'bg-orange-500' : 'bg-emerald-600'
                    }`}>
                      {item.badgeText || item.dealType}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-mono font-bold text-slate-900 dark:text-white">
                      {item.salePrice.toLocaleString()}원
                      {item.originalPrice > item.salePrice && (
                        <span className="text-slate-400 line-through text-[10px] ml-1.5 font-normal">
                          {item.originalPrice.toLocaleString()}원
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-rose-500 font-bold mt-0.5">
                      {item.unitPriceDescription}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="font-mono text-slate-600 dark:text-slate-300">{item.period}</div>
                    <span className="inline-block px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[9px] font-black mt-0.5">
                      {item.dDay}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleSaleHot(item.id)}
                      className={`p-1.5 rounded-lg transition-all ${
                        item.isHot ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                      }`}
                    >
                      <Flame className={`w-3.5 h-3.5 ${item.isHot ? 'fill-current' : ''}`} />
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                        title="수정"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================
          MODAL: ADD / EDIT SALE PROMOTION
         ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border ${cardBg}`}>
            {/* Header */}
            <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-sm">
                  {editingSaleId ? '행사소식 수정' : '새 1+1/특가 행사 등록'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">행사 상품명 *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 꼬북칩 초코츄러스 80g"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">제조사 / 브랜드 *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 오리온, 롯데, 농심"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">판매처 *</label>
                  <select
                    value={formData.store}
                    onChange={e => setFormData({ ...formData, store: e.target.value as SaleStoreType })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  >
                    {storesList.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">행사 유형 *</label>
                  <select
                    value={formData.dealType}
                    onChange={e => {
                      const newType = e.target.value as SaleDealType;
                      setFormData(prev => ({ ...prev, dealType: newType, badgeText: newType }));
                      handlePriceChange(formData.originalPrice, formData.salePrice, newType);
                    }}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  >
                    {dealTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">카테고리</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  >
                    {CATEGORIES.filter(c => c !== '전체').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">정상가 (원)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={e => handlePriceChange(Number(e.target.value), formData.salePrice, formData.dealType)}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">행사가 (원)</label>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={e => handlePriceChange(formData.originalPrice, Number(e.target.value), formData.dealType)}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">단위 혜택 설명</label>
                  <input
                    type="text"
                    value={formData.unitPriceDescription}
                    onChange={e => setFormData({ ...formData, unitPriceDescription: e.target.value })}
                    placeholder="예: 개당 1,500원 꼴"
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">행사 기간 문구</label>
                  <input
                    type="text"
                    placeholder="예: 09.01 ~ 09.30"
                    value={formData.period}
                    onChange={e => setFormData({ ...formData, period: e.target.value })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">D-Day 표시</label>
                  <input
                    type="text"
                    placeholder="예: D-5, 오늘마감, 상시"
                    value={formData.dDay}
                    onChange={e => setFormData({ ...formData, dDay: e.target.value })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">상품 이미지 URL</label>
                <div className="flex items-center gap-3">
                  {formData.image && (
                    <img src={formData.image} alt="미리보기" className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                  )}
                  <input
                    type="url"
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://... 이미지 URL"
                    className={`flex-1 p-2.5 rounded-xl text-xs border font-mono ${inputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">추가 결제 혜택 (선택)</label>
                <input
                  type="text"
                  placeholder="예: 카카오페이 머니 결제 시 1,000원 즉시 캐시백"
                  value={formData.benefitTag}
                  onChange={e => setFormData({ ...formData, benefitTag: e.target.value })}
                  className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">행사 상세 설명</label>
                <textarea
                  rows={2}
                  placeholder="행사 세부 안내 및 교차증정 가능 여부 등"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                />
              </div>

              {/* Hot Switch */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${subCardBg}`}>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-bold">🔥 핫딜(HOT) 뱃지 부여</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isHot}
                  onChange={e => setFormData({ ...formData, isHot: e.target.checked })}
                  className="rounded border-slate-300 text-orange-600 w-4 h-4"
                />
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
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow-md shadow-rose-600/20"
                >
                  {editingSaleId ? '수정사항 저장' : '행사 등록 완료'}
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
              <h4 className="font-bold text-sm">행사소식을 삭제하시겠습니까?</h4>
              <p className="text-xs text-slate-400 mt-1">앱 내 세일소식 피드에서 제거됩니다.</p>
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
