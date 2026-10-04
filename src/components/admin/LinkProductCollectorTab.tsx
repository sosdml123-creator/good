import React, { useState, useEffect } from 'react';
import {
  Link2,
  ExternalLink,
  Edit3,
  Trash2,
  Plus,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Check,
  Globe,
  CheckSquare,
  Square,
  Clock
} from 'lucide-react';
import { ProductCategory, Product, PendingProduct } from '../../types';
import {
  CrawlLinkConfig,
  AnalyzedCrawledProduct,
  getCrawlLinkConfigs,
  updateCrawlLinkConfig,
  addCrawlLinkConfig,
  deleteCrawlLinkConfig,
  resetCrawlLinkConfigs,
  crawlNewProductsFromLink,
  checkProductDuplicates
} from '../../services/linkProductCrawler';

interface LinkProductCollectorTabProps {
  isDark?: boolean;
  products: Product[];
  pendingProducts: PendingProduct[];
  onAddProduct: (productData: Partial<Product> & { name: string; brand: string; category: ProductCategory; price: number }) => void;
  onAddToPending: (item: PendingProduct) => void;
  onAddMultipleToPending?: (items: PendingProduct[]) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  onNavigateToApproval?: () => void;
}

export const LinkProductCollectorTab: React.FC<LinkProductCollectorTabProps> = ({
  isDark = false,
  products,
  pendingProducts,
  onAddProduct,
  onAddToPending,
  onAddMultipleToPending,
  showToast,
  onNavigateToApproval
}) => {
  // 1. Link Configurations State
  const [linkConfigs, setLinkConfigs] = useState<CrawlLinkConfig[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState<string>('cu_official_new');

  // 2. Edit / Create Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<CrawlLinkConfig | null>(null);
  const [modalForm, setModalForm] = useState<{
    channel: string;
    name: string;
    url: string;
    category: ProductCategory;
    description: string;
    isActive: boolean;
  }>({
    channel: 'CU',
    name: 'CU 공식 신제품 (NEW)',
    url: 'https://cu.bgfretail.com/product/product.do?category=product&depth2=4&sf=N#',
    category: '간편식',
    description: '',
    isActive: true
  });

  // 3. Crawler Execution State
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlProgressText, setCrawlProgressText] = useState('');
  const [crawlPageLimit, setCrawlPageLimit] = useState<number>(1); // 1 = 40 items, 2 = 80 items
  const [analyzedResults, setAnalyzedResults] = useState<AnalyzedCrawledProduct[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [resultFilter, setResultFilter] = useState<'all' | 'new_only' | 'existing_only'>('new_only');
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());

  // Load configs on mount
  useEffect(() => {
    const loaded = getCrawlLinkConfigs();
    setLinkConfigs(loaded);
    if (loaded.length > 0 && !loaded.some(c => c.id === selectedConfigId)) {
      setSelectedConfigId(loaded[0].id);
    }
  }, []);

  // Card theme classes
  const cardBg = isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200';
  const subCardBg = isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200/80';
  const inputBg = isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400';

  // Toggle active status of a link
  const handleToggleActive = (id: string, current: boolean) => {
    const updated = updateCrawlLinkConfig(id, { isActive: !current });
    setLinkConfigs(updated);
    showToast(`링크 활성화 상태가 ${!current ? 'ON' : 'OFF'}으로 변경되었습니다.`, 'info');
  };

  // Open modal for editing
  const handleOpenEditModal = (config: CrawlLinkConfig) => {
    setEditingConfig(config);
    setModalForm({
      channel: config.channel,
      name: config.name,
      url: config.url,
      category: config.category || '간편식',
      description: config.description || '',
      isActive: config.isActive
    });
    setIsEditModalOpen(true);
  };

  // Open modal for creating new link
  const handleOpenCreateModal = () => {
    setEditingConfig(null);
    setModalForm({
      channel: 'CU',
      name: '새 신제품 수집 링크',
      url: 'https://',
      category: '간편식',
      description: '',
      isActive: true
    });
    setIsEditModalOpen(true);
  };

  // Save modal form
  const handleSaveModalForm = () => {
    if (!modalForm.name.trim()) {
      showToast('링크 이름을 입력해주세요.', 'error');
      return;
    }
    if (!modalForm.url.trim().startsWith('http')) {
      showToast('올바른 URL(http/https)을 입력해주세요.', 'error');
      return;
    }

    if (editingConfig) {
      // Update existing
      const updated = updateCrawlLinkConfig(editingConfig.id, {
        channel: modalForm.channel.trim(),
        name: modalForm.name.trim(),
        url: modalForm.url.trim(),
        category: modalForm.category,
        description: modalForm.description.trim(),
        isActive: modalForm.isActive
      });
      setLinkConfigs(updated);
      showToast('수집 링크 설정이 성공적으로 수정되었습니다!', 'success');
    } else {
      // Create new
      const updated = addCrawlLinkConfig({
        channel: modalForm.channel.trim(),
        name: modalForm.name.trim(),
        url: modalForm.url.trim(),
        category: modalForm.category,
        description: modalForm.description.trim(),
        isActive: modalForm.isActive,
        badgeBg: modalForm.channel.toUpperCase() === 'CU' ? 'bg-purple-600 text-white' : 'bg-indigo-600 text-white',
        badgeText: `${modalForm.channel} 신상품`,
        icon: '🔗'
      });
      setLinkConfigs(updated);
      showToast('새 수집 링크가 등록되었습니다!', 'success');
    }

    setIsEditModalOpen(false);
  };

  // Delete link config
  const handleDeleteConfig = (id: string, name: string) => {
    if (confirm(`'${name}' 수집 링크를 삭제하시겠습니까?`)) {
      const updated = deleteCrawlLinkConfig(id);
      setLinkConfigs(updated);
      showToast('수집 링크가 삭제되었습니다.', 'info');
    }
  };

  // Reset to default presets
  const handleResetDefaults = () => {
    if (confirm('모든 수집 링크를 기본 설정(CU 공식 신제품 링크 등)으로 초기화하시겠습니까?')) {
      const defs = resetCrawlLinkConfigs();
      setLinkConfigs(defs);
      showToast('기본 링크 설정으로 초기화되었습니다.', 'success');
    }
  };

  // Run Crawler on specific link or active links
  const handleRunCrawl = async (targetConfig?: CrawlLinkConfig) => {
    const configToRun = targetConfig || linkConfigs.find(c => c.id === selectedConfigId && c.isActive) || linkConfigs.find(c => c.isActive);

    if (!configToRun) {
      showToast('활성화된 수집 링크가 없습니다. 링크를 활성화해주세요.', 'error');
      return;
    }

    setIsCrawling(true);
    setCrawlProgressText(`[${configToRun.name}] 대상 페이지 접속 중... (${configToRun.url})`);

    try {
      showToast(`🔍 ${configToRun.name} 링크에서 최신 신제품을 수집합니다...`, 'info');

      const result = await crawlNewProductsFromLink(configToRun, {
        page: 1,
        maxPages: crawlPageLimit
      });

      if (!result.success || result.items.length === 0) {
        showToast(result.error || '수집된 신제품이 없습니다. 링크 주소를 확인해주세요.', 'error');
        setIsCrawling(false);
        return;
      }

      // Check duplicates with existing registered & pending products
      const { analyzedItems, newItemsCount, existingCount } = checkProductDuplicates(
        result.items,
        products,
        pendingProducts
      );

      setAnalyzedResults(analyzedItems);
      // 기본적으로 신규로 발견된 상품들만 선택 상태로 설정
      const newIds = analyzedItems.filter(p => !p.isAlreadyRegistered).map(p => p.id);
      setSelectedProductIds(newIds.length > 0 ? newIds : analyzedItems.map(p => p.id));
      setRegisteredIds(new Set());

      // Update local linkConfig item
      setLinkConfigs(getCrawlLinkConfigs());

      showToast(
        `✨ ${analyzedItems.length}개 상품 수집 완료! (새로 등록된 신제품: ${newItemsCount}건 / 기존 등록: ${existingCount}건)`,
        'success'
      );
    } catch (err: any) {
      console.error('[handleRunCrawl] Error:', err);
      showToast('신제품 수집 중 네트워크 오류가 발생했습니다.', 'error');
    } finally {
      setIsCrawling(false);
      setCrawlProgressText('');
    }
  };

  // Filtered results to display
  const filteredProducts = analyzedResults.filter(p => {
    if (resultFilter === 'new_only') return !p.isAlreadyRegistered;
    if (resultFilter === 'existing_only') return p.isAlreadyRegistered;
    return true;
  });

  // Toggle single product select
  const handleToggleSelectProduct = (id: string) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Select all or deselect in filtered view
  const handleToggleSelectAll = () => {
    const currentFilteredIds = filteredProducts.map(p => p.id);
    const allSelected = currentFilteredIds.every(id => selectedProductIds.includes(id));

    if (allSelected) {
      setSelectedProductIds(prev => prev.filter(id => !currentFilteredIds.includes(id)));
    } else {
      setSelectedProductIds(prev => Array.from(new Set([...prev, ...currentFilteredIds])));
    }
  };

  // Send selected to Pending Approval Queue
  const handleSendSelectedToPending = () => {
    const targetItems = analyzedResults.filter(p => selectedProductIds.includes(p.id));
    if (targetItems.length === 0) {
      showToast('선택된 신제품이 없습니다.', 'error');
      return;
    }

    if (onAddMultipleToPending) {
      onAddMultipleToPending(targetItems);
    } else {
      targetItems.forEach(item => onAddToPending(item));
    }

    const nextSet = new Set(registeredIds);
    targetItems.forEach(item => nextSet.add(item.id));
    setRegisteredIds(nextSet);

    showToast(`✅ ${targetItems.length}개의 신제품이 '수집 신제품 승인함'으로 전송되었습니다!`, 'success');
  };

  // Directly register selected to Main Products
  const handleDirectRegisterSelected = () => {
    const targetItems = analyzedResults.filter(p => selectedProductIds.includes(p.id));
    if (targetItems.length === 0) {
      showToast('선택된 신제품이 없습니다.', 'error');
      return;
    }

    targetItems.forEach(item => {
      onAddProduct({
        name: item.name,
        brand: item.brand,
        category: item.category,
        subCategory: item.subCategory,
        price: item.price,
        image: item.image,
        stores: item.stores,
        description: item.description,
        releaseDate: item.releaseDate
      });
    });

    const nextSet = new Set(registeredIds);
    targetItems.forEach(item => nextSet.add(item.id));
    setRegisteredIds(nextSet);

    showToast(`🚀 ${targetItems.length}개의 신제품이 메인 정식 상품으로 즉시 등록되었습니다!`, 'success');
  };

  // Register single item directly
  const handleRegisterSingle = (item: AnalyzedCrawledProduct) => {
    onAddProduct({
      name: item.name,
      brand: item.brand,
      category: item.category,
      subCategory: item.subCategory,
      price: item.price,
      image: item.image,
      stores: item.stores,
      description: item.description,
      releaseDate: item.releaseDate
    });

    setRegisteredIds(prev => new Set(prev).add(item.id));
    showToast(`'${item.name}' 정식 등록 완료!`, 'success');
  };

  // Counts for tabs
  const totalCount = analyzedResults.length;
  const newCount = analyzedResults.filter(p => !p.isAlreadyRegistered).length;
  const existingCount = analyzedResults.filter(p => p.isAlreadyRegistered).length;

  return (
    <div className="space-y-6">
      {/* Top Main Banner Card */}
      <div className={`p-6 rounded-2xl border shadow-sm ${cardBg}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold">
                <Link2 className="w-5 h-5" />
              </span>
              <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                신제품 링크 수집기 및 URL 설정
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                실시간 웹 수집
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl">
              지정된 공식 웹사이트 링크를 통해 새로 등록된 신제품을 실시간으로 가져옵니다.
              링크 URL을 직접 수정할 수 있으며, <span className="font-bold text-purple-600 dark:text-purple-400">CU 공식 신제품 링크</span>가 기본 탑재되어 있습니다.
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const cuConfig = linkConfigs.find(c => c.channel.toUpperCase() === 'CU') || linkConfigs[0];
                if (cuConfig) handleRunCrawl(cuConfig);
              }}
              disabled={isCrawling}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
            >
              {isCrawling ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-300" />
              )}
              <span>CU 신제품 가져오기</span>
            </button>
            {onNavigateToApproval && (
              <button
                onClick={onNavigateToApproval}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>수집 승인함 이동</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Section 1: Manage Collection Links (URL Configuration) */}
      <div className={`p-6 rounded-2xl border shadow-sm ${cardBg} space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800">
          <div>
            <h3 className={`text-sm font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Globe className="w-4 h-4 text-purple-500" />
              <span>신제품 수집 대상 링크 목록 ({linkConfigs.length}개)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              각 편의점/브랜드별 신제품 페이지 링크를 수정하거나 새 링크를 추가할 수 있습니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="기본 설정으로 되돌리기"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>기본 링크 초기화</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>새 링크 추가</span>
            </button>
          </div>
        </div>

        {/* Link Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {linkConfigs.map(config => {
            const isCu = config.channel.toUpperCase() === 'CU';

            return (
              <div
                key={config.id}
                className={`p-4 rounded-xl border transition-all ${subCardBg} ${
                  config.isActive ? 'ring-1 ring-purple-500/30' : 'opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{config.icon || (isCu ? '💜' : '🏪')}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${config.badgeBg || 'bg-purple-600 text-white'}`}>
                          {config.channel}
                        </span>
                        <h4 className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {config.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {config.description || '공식 신제품 전용 페이지'}
                      </p>
                    </div>
                  </div>

                  {/* Active Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.isActive}
                      onChange={() => handleToggleActive(config.id, config.isActive)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* Target URL Display & Direct Visit */}
                <div className="mt-3 p-2 rounded-lg bg-black/5 dark:bg-black/20 border border-black/5 dark:border-white/5 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-purple-600 dark:text-purple-300 truncate select-all">
                    {config.url}
                  </span>
                  <a
                    href={config.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors shrink-0"
                    title="해당 웹페이지 새 창에서 열기"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Card Footer: Metadata and Actions */}
                <div className="mt-3 pt-2.5 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>
                      {config.lastCrawledAt 
                        ? `최근 수집: ${new Date(config.lastCrawledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (${config.lastCollectedCount || 0}건)`
                        : '수집 이력 없음'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Edit URL / Details Button */}
                    <button
                      onClick={() => handleOpenEditModal(config)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors flex items-center gap-1 ${
                        isDark ? 'border-slate-700 hover:bg-slate-700 text-slate-300' : 'border-slate-200 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>링크 수정</span>
                    </button>

                    {/* Run Crawl for this Link */}
                    <button
                      onClick={() => handleRunCrawl(config)}
                      disabled={isCrawling}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-600 hover:bg-purple-700 text-white transition-colors flex items-center gap-1 shadow-sm disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>수집 실행</span>
                    </button>

                    {/* Delete button (except for default CU if preferred) */}
                    {linkConfigs.length > 1 && (
                      <button
                        onClick={() => handleDeleteConfig(config.id, config.name)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                        title="링크 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Crawl Execution Controls & Realtime Results */}
      <div className={`p-6 rounded-2xl border shadow-sm ${cardBg} space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className={`text-base font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>신제품 수집 결과</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              링크에서 가져온 신제품 중 기존 등록 상품과 대조하여 새로 등록된 상품을 찾아냅니다.
            </p>
          </div>

          {/* Crawl Options & Execution */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>수집 분량:</span>
              <select
                value={crawlPageLimit}
                onChange={e => setCrawlPageLimit(Number(e.target.value))}
                className={`p-1.5 rounded-lg border text-xs font-bold ${inputBg}`}
              >
                <option value={1}>1페이지 (최신 40개)</option>
                <option value={2}>2페이지 (80개)</option>
                <option value={3}>3페이지 (120개)</option>
              </select>
            </div>

            <button
              onClick={() => handleRunCrawl()}
              disabled={isCrawling}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-sm flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isCrawling ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>수집 진행 중...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>신제품 가져오기</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Crawling Loading Indicator */}
        {isCrawling && (
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 flex items-center gap-3 animate-pulse">
            <RefreshCw className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-spin" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-purple-900 dark:text-purple-200">
                공식 신제품 페이지에서 상품 데이터를 스크래핑하는 중입니다...
              </p>
              <p className="text-[11px] text-purple-700 dark:text-purple-400">
                {crawlProgressText || '고화질 실물 이미지와 상품명, 가격, 카테고리를 실시간 파싱하고 있습니다.'}
              </p>
            </div>
          </div>
        )}

        {/* Results Toolbar & Stats */}
        {analyzedResults.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setResultFilter('new_only')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    resultFilter === 'new_only'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>새로 등록된 신제품</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-900 font-extrabold">
                    {newCount}
                  </span>
                </button>

                <button
                  onClick={() => setResultFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    resultFilter === 'all'
                      ? 'bg-purple-600 text-white font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>전체 수집목록 ({totalCount})</span>
                </button>

                <button
                  onClick={() => setResultFilter('existing_only')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    resultFilter === 'existing_only'
                      ? 'bg-purple-600 text-white font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>기존 등록상품 ({existingCount})</span>
                </button>
              </div>

              {/* Action Buttons for Selected Products */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleSelectAll}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
                    isDark ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-700'
                  }`}
                >
                  {filteredProducts.every(p => selectedProductIds.includes(p.id)) ? (
                    <CheckSquare className="w-3.5 h-3.5 text-purple-600" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>전체 선택</span>
                </button>

                <button
                  onClick={handleSendSelectedToPending}
                  disabled={selectedProductIds.length === 0}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm flex items-center gap-1.5 active:scale-95 disabled:opacity-40"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>선택 승인함으로 ({selectedProductIds.length})</span>
                </button>

                <button
                  onClick={handleDirectRegisterSelected}
                  disabled={selectedProductIds.length === 0}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm flex items-center gap-1.5 active:scale-95 disabled:opacity-40"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>즉시 정식등록 ({selectedProductIds.length})</span>
                </button>
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredProducts.map(product => {
                const isSelected = selectedProductIds.includes(product.id);
                const isRegistered = registeredIds.has(product.id);

                return (
                  <div
                    key={product.id}
                    onClick={() => handleToggleSelectProduct(product.id)}
                    className={`relative rounded-xl border p-2.5 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-purple-500 ring-2 ring-purple-500/30 bg-purple-50/20 dark:bg-purple-950/20'
                        : `${subCardBg} hover:border-slate-400`
                    }`}
                  >
                    {/* Top Badges */}
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 mb-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop';
                        }}
                      />

                      {/* Select Checkbox Overlay */}
                      <div className="absolute top-1.5 left-1.5">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                          isSelected ? 'bg-purple-600 text-white shadow' : 'bg-black/40 text-transparent'
                        }`}>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      </div>

                      {/* Store & New Badge */}
                      <div className="absolute top-1.5 right-1.5 flex flex-col items-end gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-purple-600 text-white shadow-sm">
                          {product.brand}
                        </span>
                        {product.isAlreadyRegistered ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-700 text-slate-200">
                            기존등록
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-500 text-white animate-pulse shadow-sm">
                            NEW 신규
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                          {product.category}
                        </span>
                        {product.subCategory && (
                          <span className="text-[10px] text-slate-400">
                            · {product.subCategory}
                          </span>
                        )}
                      </div>

                      <h4 className={`text-xs font-bold line-clamp-2 leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`} title={product.name}>
                        {product.name}
                      </h4>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-black text-rose-600 dark:text-rose-400">
                          {product.price > 0 ? `${product.price.toLocaleString()}원` : '가격 미정'}
                        </span>
                        {product.sourceUrl && (
                          <a
                            href={product.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] text-slate-400 hover:text-purple-600 flex items-center gap-0.5"
                            title="공식 상세페이지 보기"
                          >
                            <span>상세</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Action button inside card */}
                    <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1">
                      {isRegistered ? (
                        <div className="w-full py-1 rounded text-center text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>등록 완료</span>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToPending(product);
                              setRegisteredIds(prev => new Set(prev).add(product.id));
                              showToast(`'${product.name}' 승인함으로 전송!`, 'success');
                            }}
                            className="flex-1 py-1 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900 transition-colors"
                          >
                            승인함
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRegisterSingle(product);
                            }}
                            className="flex-1 py-1 rounded text-[10px] font-bold bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                          >
                            정식등록
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State before running */}
        {!isCrawling && analyzedResults.length === 0 && (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
              <Link2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                신제품을 가져올 준비가 되었습니다
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                위 링크 설정에서 등록된 URL을 확인하거나 수정한 후, <strong>'신제품 가져오기'</strong> 버튼을 클릭하면 최신 신상품을 실시간으로 가져옵니다.
              </p>
            </div>
            <button
              onClick={() => handleRunCrawl()}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-md active:scale-95"
            >
              지금 CU 신제품 가져오기
            </button>
          </div>
        )}
      </div>

      {/* Section 3: Modal for Editing / Creating Link Config */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 space-y-5 ${cardBg}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600">
                  <Edit3 className="w-4 h-4" />
                </span>
                <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {editingConfig ? '수집 링크 URL 및 정보 수정' : '새 수집 링크 등록'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Channel / Store */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  대상 채널 / 편의점 브랜드
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['CU', 'GS25', '세븐일레븐', '이마트24'].map(store => (
                    <button
                      key={store}
                      type="button"
                      onClick={() => setModalForm(prev => ({ ...prev, channel: store }))}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        modalForm.channel === store
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : `${subCardBg} text-slate-700 dark:text-slate-300`
                      }`}
                    >
                      {store}
                    </button>
                  ))}
                </div>
              </div>

              {/* Link Name */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  링크 이름
                </label>
                <input
                  type="text"
                  value={modalForm.name}
                  onChange={e => setModalForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="예: CU 공식 신제품 (NEW)"
                  className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                />
              </div>

              {/* Target URL (THE KEY USER REQUIREMENT) */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  수집 대상 웹사이트 링크 (URL) <span className="text-purple-600">*</span>
                </label>
                <input
                  type="url"
                  value={modalForm.url}
                  onChange={e => setModalForm(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://cu.bgfretail.com/product/product.do?category=product&depth2=4&sf=N#"
                  className={`w-full p-2.5 rounded-xl border font-mono text-[11px] ${inputBg}`}
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  기본 CU 신제품 주소: <code className="text-purple-500">https://cu.bgfretail.com/product/product.do?category=product&depth2=4&sf=N#</code>
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  링크 설명 (메모)
                </label>
                <input
                  type="text"
                  value={modalForm.description}
                  onChange={e => setModalForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="예: BGF리테일 CU 공식 신상품관 크롤링"
                  className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white">링크 활성화 상태</h4>
                  <p className="text-[11px] text-slate-400">신제품 일괄 수집 시 이 링크를 포함할지 설정합니다.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modalForm.isActive}
                    onChange={e => setModalForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className={`px-4 py-2 rounded-xl font-medium border ${
                  isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveModalForm}
                className="px-5 py-2 rounded-xl font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all active:scale-95"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
