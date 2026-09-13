import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BrandInfo } from '../../types';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Globe, 
  X, 
  Package, 
  Image as ImageIcon,
  Flame,
  LayoutGrid,
  List,
  Copy
} from 'lucide-react';
import { BRAND_LOGOS_MAP } from '../../utils/brandData';

interface BrandManagementTabProps {
  isDark: boolean;
  onSelectBrandForProductAdd?: (brandName: string) => void;
  onNavigateToProductsWithBrand?: (brandName: string) => void;
}

export const BrandManagementTab: React.FC<BrandManagementTabProps> = ({
  isDark,
  onSelectBrandForProductAdd,
  onNavigateToProductsWithBrand
}) => {
  const { 
    brands, 
    products, 
    addBrand, 
    updateBrand, 
    deleteBrand, 
    toggleBrandPopular,
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<BrandInfo, 'id'> & { id?: string }>({
    id: '',
    name: '',
    engName: '',
    category: '간편식·스낵',
    logo: '',
    bannerImage: '',
    slogan: '',
    description: '',
    officialUrl: '',
    badge: '공식 입점',
    isPopular: false
  });

  // Preset categories
  const categories = ['전체', '패스트푸드', '커피·음료', '과자·스낵', '베이커리·디저트', '간편식·분식', '아이스크림', '기타'];

  // Common official brand logo presets for quick selection
  const commonLogoPresets = [
    { name: '노브랜드', url: BRAND_LOGOS_MAP['노브랜드'] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120' },
    { name: '맥도날드', url: BRAND_LOGOS_MAP['맥도날드'] || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120' },
    { name: '버거킹', url: BRAND_LOGOS_MAP['버거킹'] || 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=120' },
    { name: '스타벅스', url: BRAND_LOGOS_MAP['스타벅스'] || 'https://images.unsplash.com/photo-1545231027-637d2f6210f8?w=120' },
    { name: '오리온', url: BRAND_LOGOS_MAP['오리온'] || 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=120' },
    { name: '농심', url: BRAND_LOGOS_MAP['농심'] || 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=120' },
    { name: '삼양식품', url: BRAND_LOGOS_MAP['삼양'] || 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=120' },
    { name: 'CJ제일제당', url: BRAND_LOGOS_MAP['CJ제일제당'] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120' },
    { name: '배스킨라빈스', url: BRAND_LOGOS_MAP['배스킨라빈스'] || 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=120' },
  ];

  // Filtered brands
  const filteredBrands = useMemo(() => {
    return brands.filter(b => {
      const matchSearch = !searchQuery.trim() || 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (b.engName && b.engName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.slogan && b.slogan.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchCategory = selectedCategory === '전체' || b.category === selectedCategory || b.category.includes(selectedCategory);

      return matchSearch && matchCategory;
    });
  }, [brands, searchQuery, selectedCategory]);

  // Statistics
  const stats = useMemo(() => {
    const total = brands.length;
    const popular = brands.filter(b => b.isPopular).length;
    const withMall = brands.filter(b => !!b.officialUrl?.trim()).length;
    return { total, popular, withMall };
  }, [brands]);

  // Open modal for new
  const handleOpenNewModal = () => {
    setEditingBrandId(null);
    setFormData({
      id: '',
      name: '',
      engName: '',
      category: '간편식·스낵',
      logo: '',
      bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80',
      slogan: '',
      description: '',
      officialUrl: '',
      badge: '공식 입점',
      isPopular: false
    });
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEditModal = (brand: BrandInfo) => {
    setEditingBrandId(brand.id);
    setFormData({
      id: brand.id,
      name: brand.name,
      engName: brand.engName || '',
      category: brand.category || '간편식·스낵',
      logo: brand.logo || '',
      bannerImage: brand.bannerImage || '',
      slogan: brand.slogan || '',
      description: brand.description || '',
      officialUrl: brand.officialUrl || '',
      badge: brand.badge || '공식 입점',
      isPopular: brand.isPopular ?? false
    });
    setIsModalOpen(true);
  };

  // Duplicate brand
  const handleDuplicateBrand = (brand: BrandInfo) => {
    setEditingBrandId(null);
    setFormData({
      id: `${brand.id}_copy_${Date.now()}`,
      name: `${brand.name} (사본)`,
      engName: brand.engName ? `${brand.engName} Copy` : '',
      category: brand.category,
      logo: brand.logo,
      bannerImage: brand.bannerImage,
      slogan: brand.slogan,
      description: brand.description,
      officialUrl: brand.officialUrl,
      badge: brand.badge,
      isPopular: false
    });
    setIsModalOpen(true);
  };

  // Submit save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('브랜드명을 입력해주세요.', 'error');
      return;
    }

    if (editingBrandId) {
      updateBrand(editingBrandId, {
        name: formData.name.trim(),
        engName: formData.engName?.trim(),
        category: formData.category,
        logo: formData.logo?.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120',
        bannerImage: formData.bannerImage?.trim(),
        slogan: formData.slogan?.trim() || '',
        description: formData.description?.trim() || '',
        officialUrl: formData.officialUrl?.trim() || '',
        badge: formData.badge?.trim() || '',
        isPopular: formData.isPopular
      });
    } else {
      addBrand({
        id: formData.id?.trim() || `brand_${Date.now()}`,
        name: formData.name.trim(),
        engName: formData.engName?.trim(),
        category: formData.category,
        logo: formData.logo?.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120',
        bannerImage: formData.bannerImage?.trim(),
        slogan: formData.slogan?.trim() || '',
        description: formData.description?.trim() || '',
        officialUrl: formData.officialUrl?.trim() || '',
        badge: formData.badge?.trim() || '',
        isPopular: formData.isPopular
      });
    }

    setIsModalOpen(false);
  };

  // Confirm delete
  const handleDelete = (id: string) => {
    deleteBrand(id);
    setDeleteConfirmId(null);
  };

  const cardBg = isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900';
  const subCardBg = isDark ? 'bg-slate-850 border-slate-800' : 'bg-slate-50 border-slate-200';
  const inputBg = isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400';

  return (
    <div className="space-y-6">
      {/* Top Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                브랜드 & 브랜드몰 정밀 관리 콘솔
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                브랜드 등록, 공식 브랜드몰 바로가기 URL 연동, 로고 및 슬로건을 정밀하게 등록·수정·삭제합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenNewModal}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>새 브랜드 등록</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>총 등록 브랜드</span>
            <Building2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono">{stats.total}</span>
            <span className="text-xs text-slate-400">개사</span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>인기 대표 브랜드 (추천관 노출)</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-orange-600">{stats.popular}</span>
            <span className="text-xs text-slate-400">개사 지정됨</span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>공식 브랜드몰 URL 연동 완료</span>
            <Globe className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-emerald-600">{stats.withMall}</span>
            <span className="text-xs text-slate-400">개사 연동 ({stats.total > 0 ? Math.round((stats.withMall / stats.total) * 100) : 0}%)</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-3 ${cardBg}`}>
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="브랜드명, 영문명, 슬로건 검색..."
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

        {/* Category Pills & View Mode */}
        <div className="flex items-center justify-between w-full md:w-auto gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : isDark 
                      ? 'bg-slate-800 text-slate-400 hover:text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center border-l pl-2 border-slate-200 dark:border-slate-700 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-600'}`}
              title="그리드 뷰"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-600'}`}
              title="테이블 뷰"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Brand List */}
      {filteredBrands.length === 0 ? (
        <div className={`py-16 text-center rounded-2xl border ${cardBg}`}>
          <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3 stroke-1" />
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300">검색된 브랜드가 없습니다.</p>
          <p className="text-xs text-slate-400 mt-1">검색어를 변경하거나 새 브랜드를 등록해주세요.</p>
          <button
            onClick={handleOpenNewModal}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl"
          >
            새 브랜드 등록하기
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBrands.map(brand => {
            const brandProductCount = products.filter(p => p.brand.trim() === brand.name.trim()).length;
            return (
              <div 
                key={brand.id}
                className={`rounded-2xl border overflow-hidden transition-all hover:shadow-md flex flex-col justify-between ${cardBg}`}
              >
                {/* Header with Banner */}
                <div>
                  <div className="h-24 relative overflow-hidden bg-gradient-to-r from-slate-700 to-slate-900">
                    {brand.bannerImage ? (
                      <img 
                        src={brand.bannerImage} 
                        alt={brand.name} 
                        className="w-full h-full object-cover opacity-80"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <ImageIcon className="w-8 h-8 opacity-30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-black/60 backdrop-blur-md text-white border border-white/20">
                        {brand.category}
                      </span>
                      {brand.badge && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-indigo-600/90 text-white shadow-xs">
                          {brand.badge}
                        </span>
                      )}
                    </div>

                    {/* Popular Switch Pin */}
                    <div className="absolute top-2.5 right-2.5">
                      <button
                        onClick={() => toggleBrandPopular(brand.id)}
                        className={`p-1.5 rounded-lg backdrop-blur-md transition-all ${
                          brand.isPopular 
                            ? 'bg-orange-500 text-white shadow-sm' 
                            : 'bg-black/40 text-slate-300 hover:text-white'
                        }`}
                        title={brand.isPopular ? '인기 브랜드 해제' : '인기 브랜드로 지정'}
                      >
                        <Flame className={`w-3.5 h-3.5 ${brand.isPopular ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Brand Logo Floating */}
                    <div className="absolute -bottom-4 left-4 w-12 h-12 rounded-xl bg-white p-1 shadow-md border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                      {brand.logo ? (
                        <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                      ) : (
                        <Building2 className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="pt-6 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm flex items-center gap-1.5">
                          <span>{brand.name}</span>
                          {brand.engName && (
                            <span className="text-[11px] font-normal text-slate-400">({brand.engName})</span>
                          )}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium">
                          {brand.slogan || `${brand.name} 공식 라인업`}
                        </p>
                      </div>

                      {/* Mall Button */}
                      {brand.officialUrl ? (
                        <a
                          href={brand.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-500/20 transition-all shrink-0"
                          title="공식 브랜드몰 열기"
                        >
                          <span>공식몰</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">
                          몰 미등록
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {brand.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                        {brand.description}
                      </p>
                    )}

                    {/* Product count stats */}
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Package className="w-3.5 h-3.5 text-indigo-500" />
                        <span>등록 상품: <strong>{brandProductCount}</strong>개</span>
                      </span>
                      {brandProductCount > 0 && onNavigateToProductsWithBrand && (
                        <button
                          onClick={() => onNavigateToProductsWithBrand(brand.name)}
                          className="text-[11px] text-indigo-600 hover:underline font-bold"
                        >
                          상품 목록 보기 &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className={`p-3 border-t flex items-center justify-between gap-2 ${subCardBg}`}>
                  <div className="flex items-center gap-1.5">
                    {onSelectBrandForProductAdd && (
                      <button
                        onClick={() => onSelectBrandForProductAdd(brand.name)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-[11px] font-bold flex items-center gap-1 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        <span>상품 등록</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDuplicateBrand(brand)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
                      title="브랜드 정보 복제"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(brand)}
                      className="p-1.5 rounded-lg bg-indigo-600/10 text-indigo-600 hover:bg-indigo-600/20 transition-colors"
                      title="브랜드 정보 수정"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(brand.id)}
                      className="p-1.5 rounded-lg bg-rose-600/10 text-rose-600 hover:bg-rose-600/20 transition-colors"
                      title="브랜드 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className={`rounded-2xl border overflow-hidden shadow-xs ${cardBg}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`border-b font-bold ${isDark ? 'bg-slate-800/80 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                <tr>
                  <th className="p-3.5 w-14 text-center">로고</th>
                  <th className="p-3.5">브랜드명 / 영문명</th>
                  <th className="p-3.5">카테고리</th>
                  <th className="p-3.5">슬로건 & 뱃지</th>
                  <th className="p-3.5">공식 브랜드몰 URL</th>
                  <th className="p-3.5 text-center">인기 지정</th>
                  <th className="p-3.5 text-center">상품수</th>
                  <th className="p-3.5 text-right w-28">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredBrands.map(brand => {
                  const productCount = products.filter(p => p.brand.trim() === brand.name.trim()).length;
                  return (
                    <tr key={brand.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors`}>
                      <td className="p-3 text-center">
                        <div className="w-8 h-8 mx-auto rounded-lg bg-white p-0.5 border border-slate-200 flex items-center justify-center overflow-hidden">
                          {brand.logo ? (
                            <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                          ) : (
                            <Building2 className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{brand.name}</span>
                        </div>
                        {brand.engName && (
                          <div className="text-[10px] text-slate-400">{brand.engName}</div>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 font-bold">
                          {brand.category}
                        </span>
                      </td>
                      <td className="p-3 max-w-xs">
                        <div className="truncate text-slate-700 dark:text-slate-300">{brand.slogan || '-'}</div>
                        {brand.badge && (
                          <span className="text-[10px] text-indigo-600 font-bold">[{brand.badge}]</span>
                        )}
                      </td>
                      <td className="p-3 max-w-xs">
                        {brand.officialUrl ? (
                          <a
                            href={brand.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline flex items-center gap-1 truncate font-mono text-[11px]"
                          >
                            <span className="truncate">{brand.officialUrl}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => toggleBrandPopular(brand.id)}
                          className={`p-1.5 rounded-lg transition-all ${
                            brand.isPopular 
                              ? 'bg-orange-500 text-white' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          <Flame className={`w-3.5 h-3.5 ${brand.isPopular ? 'fill-current' : ''}`} />
                        </button>
                      </td>
                      <td className="p-3 text-center font-mono font-bold">
                        {productCount}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditModal(brand)}
                            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                            title="수정"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(brand.id)}
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
      )}

      {/* =========================================================
          MODAL: ADD / EDIT BRAND
         ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className={`rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border ${cardBg}`}>
            {/* Modal Header */}
            <div className={`p-5 border-b flex items-center justify-between shrink-0 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    {editingBrandId ? '브랜드 및 브랜드몰 정보 수정' : '새 브랜드 등록'}
                  </h3>
                  <p className="text-xs text-slate-400">브랜드명, 공식몰 링크, 로고, 배너를 정밀하게 설정합니다.</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">브랜드명 (국문) *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 농심, 배스킨라빈스, 스타벅스"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">영문 브랜드명</label>
                  <input
                    type="text"
                    placeholder="예: Nongshim, Starbucks"
                    value={formData.engName}
                    onChange={e => setFormData({ ...formData, engName: e.target.value })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">카테고리</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  >
                    {categories.filter(c => c !== '전체').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">대표 뱃지 문구</label>
                  <input
                    type="text"
                    placeholder="예: 국민 1등 PB, 치킨버거 압도적 1위"
                    value={formData.badge}
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                  />
                </div>
              </div>

              {/* ⭐ OFFICIAL BRAND MALL URL (HIGHLIGHTED) */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-indigo-600" />
                    <span>공식 브랜드몰 / 온라인 스토어 바로가기 URL</span>
                  </label>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                    * 앱 내 브랜드 상세관 [공식몰] 버튼에 연결됩니다
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="예: https://brand.naver.com/... 또는 https://www.nongshim.com"
                    value={formData.officialUrl}
                    onChange={e => setFormData({ ...formData, officialUrl: e.target.value })}
                    className={`flex-1 p-2.5 rounded-xl text-xs border font-mono ${inputBg}`}
                  />
                  {formData.officialUrl && (
                    <button
                      type="button"
                      onClick={() => window.open(formData.officialUrl, '_blank')}
                      className="px-3 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                      title="링크 테스트"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>테스트</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Logo URL & Preset Picker */}
              <div className="space-y-2">
                <label className="block text-xs font-bold">브랜드 로고 이미지 URL</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                    {formData.logo ? (
                      <img src={formData.logo} alt="로고 미리보기" className="w-full h-full object-contain" />
                    ) : (
                      <Building2 className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <input
                    type="url"
                    placeholder="https://... 로고 이미지 URL"
                    value={formData.logo}
                    onChange={e => setFormData({ ...formData, logo: e.target.value })}
                    className={`flex-1 p-2.5 rounded-xl text-xs border font-mono ${inputBg}`}
                  />
                </div>

                {/* Quick Presets */}
                <div className="pt-1">
                  <span className="text-[11px] text-slate-400 font-medium">인기 브랜드 로고 원클릭 적용:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {commonLogoPresets.map(preset => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, logo: preset.url })}
                        className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Banner Image URL */}
              <div>
                <label className="block text-xs font-bold mb-1">상단 배너 배경 이미지 URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... (가로형 고화질 이미지 권장)"
                  value={formData.bannerImage}
                  onChange={e => setFormData({ ...formData, bannerImage: e.target.value })}
                  className={`w-full p-2.5 rounded-xl text-xs border font-mono ${inputBg}`}
                />
                {formData.bannerImage && (
                  <div className="mt-2 h-16 rounded-xl overflow-hidden border border-slate-200 relative">
                    <img src={formData.bannerImage} alt="배너 미리보기" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Slogan */}
              <div>
                <label className="block text-xs font-bold mb-1">슬로건 (한 줄 핵심 카피)</label>
                <input
                  type="text"
                  placeholder="예: 최상의 품질과 압도적 가성비, 직화로 구워 불맛 가득한 와퍼"
                  value={formData.slogan}
                  onChange={e => setFormData({ ...formData, slogan: e.target.value })}
                  className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold mb-1">상세 소개글</label>
                <textarea
                  rows={3}
                  placeholder="브랜드의 역사, 대표 시그니처 메뉴, 신제품 라인업 설명"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full p-2.5 rounded-xl text-xs border ${inputBg}`}
                />
              </div>

              {/* Popular Checkbox */}
              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${subCardBg}`}>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>인기 대표 브랜드로 지정</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    홈 화면 및 브랜드관 상단 [🔥 인기 대표 브랜드관] 캐러셀에 우선 노출됩니다.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={e => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              {/* Footer */}
              <div className={`pt-4 border-t flex items-center justify-end gap-2 shrink-0 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-600/20"
                >
                  {editingBrandId ? '수정사항 저장' : '브랜드 등록 완료'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: DELETE CONFIRMATION
         ========================================================= */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-2xl p-5 max-w-sm w-full border shadow-2xl space-y-4 ${cardBg}`}>
            <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-sm">정말 이 브랜드를 삭제하시겠습니까?</h4>
              <p className="text-xs text-slate-400 mt-1">
                브랜드 메타데이터가 삭제됩니다. (기존 등록된 상품은 유지됩니다.)
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white"
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
