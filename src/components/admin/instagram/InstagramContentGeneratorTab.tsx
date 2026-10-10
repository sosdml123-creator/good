// src/components/admin/instagram/InstagramContentGeneratorTab.tsx
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  Search,
  Edit3,
  Image as ImageIcon,
  FileArchive,
  Grid,
  Zap,
  History,
  Trash2,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { AspectRatioType } from './theme';
import { GeneratedContentPackage, SlideData, TemplateType } from './types';
import { SAMPLE_INSTAGRAM_CONTENT } from './sampleData';
import { TemplateRenderer } from './templates/TemplateRenderer';
import { downloadSlideAsPng, downloadAllSlidesAsZip } from './downloadUtils';
import { getAdminAuthHeaders } from '../../../services/adminAuth';
import {
  saveContentPost,
  fetchContentPosts,
  deleteContentPost,
  ContentHistoryItem
} from './contentHistoryService';

interface InstagramContentGeneratorTabProps {
  onNotify?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const InstagramContentGeneratorTab: React.FC<InstagramContentGeneratorTabProps> = ({ onNotify: _onNotify }) => {
  const { products, pendingProducts, showToast } = useApp();

  // 활성 서브 탭: 'showcase' (9종 미리보기) | 'generator' (생성기) | 'history' (생성 이력)
  const [activeSubTab, setActiveSubTab] = useState<'showcase' | 'generator' | 'history'>('generator');

  // 생성 폼 상태
  const [promptInput, setPromptInput] = useState('');
  const [selectedTemplateMode, setSelectedTemplateMode] = useState<'auto' | TemplateType>('auto');
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioType>('1:1');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [customProducts, setCustomProducts] = useState<Array<{ id: string; name: string; brand: string; category: string; image: string; rating: number }>>([]);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);

  // 직접 상품 추가 폼 모달 상태
  const [isCustomProductModalOpen, setIsCustomProductModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customBrand, setCustomBrand] = useState('');
  const [customCategory, setCustomCategory] = useState('간식');
  const [customImage, setCustomImage] = useState('');

  // 로딩 & 에러 상태
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState<{ current: number; total: number } | null>(null);

  // 현재 작업 중인 카드뉴스 패키지 (기본값으로 첨부 이미지의 9개 샘플 로드)
  const [contentPackage, setContentPackage] = useState<GeneratedContentPackage>(SAMPLE_INSTAGRAM_CONTENT);

  // 이력 목록 상태
  const [historyList, setHistoryList] = useState<ContentHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // 개별 슬라이드 DOM 참조 맵 (PNG 렌더링용)
  const slideRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // 텍스트 수정 모달/인라인 편집 상태
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);

  // 캡션 복사 완료 여부
  const [hasCopiedCaption, setHasCopiedCaption] = useState(false);

  // 이력 데이터 불러오기
  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const items = await fetchContentPosts();
      setHistoryList(items);
    } catch (e) {
      console.warn('History load error:', e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // 검색 대상 상품 목록 (승인된 products + pending_products + 사용자가 직접 추가한 커스텀 상품)
  const searchableProducts = useMemo(() => {
    const list: Array<{ id: string; name: string; brand: string; category: string; image: string; rating: number }> = [];
    customProducts.forEach((cp) => list.push(cp));

    products.forEach((p) => {
      list.push({
        id: `prod-${p.id}`,
        name: p.name,
        brand: p.brand || '',
        category: p.category || '',
        image: p.image || '',
        rating: p.overallRating || 4.5,
      });
    });

    pendingProducts.forEach((p) => {
      list.push({
        id: `pending-${p.id}`,
        name: p.name,
        brand: p.brand || '',
        category: p.category || '',
        image: p.image || '',
        rating: 4.5,
      });
    });
    return list;
  }, [products, pendingProducts, customProducts]);

  // 선택된 상품들의 전체 상세 정보
  const selectedProductDetails = useMemo(() => {
    return searchableProducts.filter((p) => selectedProductIds.includes(p.id));
  }, [searchableProducts, selectedProductIds]);

  // 필터링된 상품 목록
  const filteredProducts = useMemo(() => {
    if (!productSearchQuery.trim()) return searchableProducts.slice(0, 30);
    const q = productSearchQuery.toLowerCase();
    return searchableProducts.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }, [searchableProducts, productSearchQuery]);

  // "오늘의 추천 요청" 자동 입력 기능 (클릭 1번)
  const handleRecommendPrompt = () => {
    const recentApproved = products.slice(0, 3);
    if (recentApproved.length > 0) {
      const names = recentApproved.map((p) => p.name).join(', ');
      setPromptInput(`오늘 편의점 화제의 신상 3종 (${names}) 추천 카드뉴스`);
      setSelectedProductIds(recentApproved.map((p) => `prod-${p.id}`));
    } else {
      setPromptInput('이번 주 편의점 & 카페 신상 인기 TOP 5 추천 카드뉴스');
    }
    showToast('💡 오늘의 추천 신상과 프롬프트가 세팅되었습니다.', 'info');
  };

  // AI 카드뉴스 생성 실행 핸들러 (클릭 2번)
  const handleGenerateContent = async () => {
    const targetPrompt = promptInput.trim();
    if (!targetPrompt && selectedProductIds.length === 0) {
      showToast('요청 문구를 입력하거나 상품을 1개 이상 선택해주세요.', 'error');
      return;
    }

    setIsGenerating(true);
    showToast('✨ AI가 신상 데이터를 분석하여 인스타 카피와 카드를 생성 중입니다...', 'info');

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(await getAdminAuthHeaders()) },
        body: JSON.stringify({
          prompt: targetPrompt || '화제의 신상 추천 카드뉴스',
          templateMode: selectedTemplateMode,
          aspectRatio: selectedRatio,
          products: selectedProductDetails,
        }),
      });

      if (!response.ok) {
        throw new Error(`생성 서버 오류 (${response.status})`);
      }

      const generatedData: GeneratedContentPackage = await response.json();

      // 생성된 카드 세트 반영
      setContentPackage(generatedData);

      // Supabase / LocalStorage에 생성 이력 자동 저장
      await saveContentPost(generatedData, selectedTemplateMode);
      loadHistory();

      showToast(`🎉 총 ${generatedData.slides.length}장의 인스타 카드뉴스가 완성되었습니다!`, 'success');
      setActiveSubTab('generator');
    } catch (e: any) {
      console.error('Content generation error:', e);
      showToast(`생성 중 오류 발생: ${e.message}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // 직접 이미지 업로드 핸들러
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setCustomImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // 직접 상품 추가 완료
  const handleAddCustomProduct = () => {
    if (!customName.trim()) {
      showToast('상품명을 입력해주세요.', 'error');
      return;
    }
    const newId = `custom-${Date.now()}`;
    const newProduct = {
      id: newId,
      name: customName.trim(),
      brand: customBrand.trim() || '직접입력',
      category: customCategory,
      image: customImage || 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop',
      rating: 4.8,
    };
    setCustomProducts((prev) => [newProduct, ...prev]);
    setSelectedProductIds((prev) => [...prev, newId]);
    setCustomName('');
    setCustomBrand('');
    setCustomImage('');
    setIsCustomProductModalOpen(false);
    showToast(`✅ '${newProduct.name}' 상품이 추가 및 선택되었습니다.`, 'success');
  };

  // 단일 슬라이드 PNG 다운로드
  const handleDownloadSingle = async (slide: SlideData, index: number) => {
    const el = slideRefs.current[slide.id];
    if (!el) {
      showToast('이미지 요소를 찾을 수 없습니다.', 'error');
      return;
    }
    try {
      showToast(`📸 ${index + 1}번 슬라이드를 고화질 PNG로 변환 중...`, 'info');
      const filename = `sinsangpick_${String(index + 1).padStart(2, '0')}_${slide.templateType}.png`;
      await downloadSlideAsPng(el, filename);
      showToast('✅ 다운로드가 완료되었습니다.', 'success');
    } catch (e) {
      console.error('Download error:', e);
      showToast('다운로드 중 오류가 발생했습니다.', 'error');
    }
  };

  // 전체 슬라이드 ZIP 다운로드 (클릭 3번)
  const handleDownloadAllZip = async () => {
    if (!contentPackage.slides.length) return;
    setIsDownloadingZip(true);
    setZipProgress({ current: 0, total: contentPackage.slides.length });
    showToast('📦 전체 카드 이미지를 고해상도 ZIP으로 압축 중입니다...', 'info');

    try {
      const targets = contentPackage.slides
        .map((slide, idx) => ({
          id: slide.id,
          index: idx,
          templateType: slide.templateType,
          element: slideRefs.current[slide.id] as HTMLElement,
        }))
        .filter((t) => !!t.element);

      if (targets.length === 0) {
        throw new Error('내보낼 슬라이드가 없습니다.');
      }

      await downloadAllSlidesAsZip(
        targets,
        `sinsangpick_insta_${new Date().toISOString().slice(0, 10)}.zip`,
        (curr, total) => {
          setZipProgress({ current: curr, total });
        }
      );
      showToast('🎉 전체 이미지 ZIP 다운로드가 완료되었습니다!', 'success');
    } catch (e) {
      console.error('ZIP error:', e);
      showToast('압축 파일 생성 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsDownloadingZip(false);
      setZipProgress(null);
    }
  };

  // 캡션 & 해시태그 복사
  const handleCopyCaption = async () => {
    const fullText = `${contentPackage.caption}\n\n${contentPackage.hashtags.join(' ')}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setHasCopiedCaption(true);
      showToast('📋 인스타그램 캡션과 해시태그가 복사되었습니다!', 'success');
      setTimeout(() => setHasCopiedCaption(false), 2500);
    } catch (e) {
      showToast('클립보드 복사 실패', 'error');
    }
  };

  // 카드 텍스트 실시간 수정 핸들러
  const handleUpdateSlideProp = (slideId: string, key: string, value: any) => {
    setContentPackage((prev) => ({
      ...prev,
      slides: prev.slides.map((s) => {
        if (s.id !== slideId) return s;
        return {
          ...s,
          props: {
            ...s.props,
            [key]: value,
          },
        };
      }),
    }));
  };

  // 이력에서 카드뉴스 다시 불러오기
  const handleRestoreFromHistory = (item: ContentHistoryItem) => {
    setContentPackage(item.content_json);
    setPromptInput(item.prompt);
    setActiveSubTab('generator');
    showToast('📜 저장된 카드뉴스를 화면에 다시 불러왔습니다.', 'success');
  };

  // 이력 삭제
  const handleDeleteHistory = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('이 생성 이력을 삭제하시겠습니까?')) return;
    await deleteContentPost(id);
    loadHistory();
    showToast('🗑️ 이력이 삭제되었습니다.', 'info');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* 최상단 헤더 */}
      <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 rounded-3xl p-6 sm:p-8 text-black shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-xs font-black mb-3">
            <Sparkles size={13} className="text-amber-300" />
            <span>AI INSTAGRAM STUDIO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            신상픽 인스타그램 카드뉴스 생성기
          </h1>
          <p className="mt-2 text-sm sm:text-base font-semibold text-gray-900/90 leading-relaxed">
            요청 문구 한 줄로 AI가 카피를 쓰고, 9종 템플릿으로 인스타 피드용 고화질 카드뉴스를 즉시 완성합니다.
          </p>

          {/* 서브 탭 전환 버튼 */}
          <div className="flex flex-wrap items-center gap-2 mt-5">
            <button
              onClick={() => setActiveSubTab('generator')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 shadow-sm ${
                activeSubTab === 'generator'
                  ? 'bg-black text-white scale-105'
                  : 'bg-white/80 text-black hover:bg-white'
              }`}
            >
              <Zap size={15} />
              <span>⚡ AI 생성기 & 편집</span>
            </button>
            <button
              onClick={() => setActiveSubTab('showcase')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 shadow-sm ${
                activeSubTab === 'showcase'
                  ? 'bg-black text-white scale-105'
                  : 'bg-white/80 text-black hover:bg-white'
              }`}
            >
              <Grid size={15} />
              <span>🎨 9종 템플릿 원본 쇼케이스</span>
            </button>
            <button
              onClick={() => setActiveSubTab('history')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 shadow-sm ${
                activeSubTab === 'history'
                  ? 'bg-black text-white scale-105'
                  : 'bg-white/80 text-black hover:bg-white'
              }`}
            >
              <History size={15} />
              <span>📜 생성 이력 ({historyList.length})</span>
            </button>
          </div>
        </div>

        {/* 배경 데코레이션 */}
        <div className="absolute right-6 -bottom-6 opacity-20 pointer-events-none hidden md:block">
          <span className="text-[140px] font-black italic tracking-tighter">new</span>
        </div>
      </div>

      {/* 1. AI 생성기 탭 */}
      {activeSubTab === 'generator' && (
        <div className="space-y-6">
          {/* 입력 UI 카드 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-500" />
                  <span>스마트 카드뉴스 제작 설정</span>
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  클릭 3번 완성: [오늘의 추천] → [생성하기] → [전체 다운로드]
                </p>
              </div>

              {/* 오늘의 추천 요청 버튼 (클릭 1번) */}
              <button
                type="button"
                onClick={handleRecommendPrompt}
                className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-black border border-amber-200 transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
              >
                <Sparkles size={14} className="text-amber-600 animate-pulse" />
                <span>🔥 오늘의 추천 요청 자동 채우기</span>
              </button>
            </div>

            {/* 요청 문구 입력창 */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                요청 입력창 (주제, 타겟, 컨셉을 자유롭게 적어주세요)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleGenerateContent();
                  }}
                  placeholder='예: "오늘 편의점 신상 3개로 카드뉴스", "이번 주 신상 TOP5", "포카칩 두 맛 VS"'
                  className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 text-sm font-semibold text-gray-900 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* 옵션 설정 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 템플릿 선택 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  템플릿 구성
                </label>
                <select
                  value={selectedTemplateMode}
                  onChange={(e) => setSelectedTemplateMode(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 focus:border-amber-400 focus:bg-white"
                >
                  <option value="auto">✨ 자동 (AI가 요청문에 맞춰 조합)</option>
                  <option value="cover_new">1. cover_new (노란 커버)</option>
                  <option value="hook_photo">2. hook_photo (사진 풀배경 후크)</option>
                  <option value="review_card">3. review_card (체크리스트 리뷰)</option>
                  <option value="top5">4. top5 (이번주 신상 TOP5)</option>
                  <option value="reels_cover">5. reels_cover (릴스 스티커 커버)</option>
                  <option value="rating_detail">6. rating_detail (맛/가성비/식감 별점)</option>
                  <option value="photo_dessert">7. photo_dessert (감성 디저트 사진)</option>
                  <option value="versus">8. versus (신상 두 맛 비교 VS)</option>
                  <option value="cta_app">9. cta_app (앱 다운로드 유도 CTA)</option>
                </select>
              </div>

              {/* 비율 선택 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  비율 규격
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['1:1', '4:5', '9:16'] as AspectRatioType[]).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => {
                        setSelectedRatio(ratio);
                        setContentPackage((prev) => ({ ...prev, aspectRatio: ratio }));
                      }}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
                        selectedRatio === ratio
                          ? 'bg-amber-400 text-black shadow-sm font-black'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {ratio === '1:1' ? '1:1 피드' : ratio === '4:5' ? '4:5 세로' : '9:16 릴스'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 상품 선택 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex justify-between">
                  <span>연동 상품 ({selectedProductIds.length}개)</span>
                  <button
                    type="button"
                    onClick={() => setIsCustomProductModalOpen(true)}
                    className="text-amber-600 hover:underline text-[11px] font-bold"
                  >
                    + 직접 추가
                  </button>
                </label>
                <button
                  type="button"
                  onClick={() => setIsProductSelectorOpen(true)}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-gray-50 border border-gray-200 hover:border-amber-400 text-xs font-bold text-gray-700 flex items-center justify-between transition-colors"
                >
                  <span className="truncate">
                    {selectedProductIds.length > 0
                      ? `${selectedProductDetails.map((p) => p.name).slice(0, 2).join(', ')}${selectedProductIds.length > 2 ? ` 외 ${selectedProductIds.length - 2}개` : ''}`
                      : 'DB 상품 검색 및 선택'}
                  </span>
                  <Search size={14} className="text-gray-400 shrink-0 ml-1" />
                </button>
              </div>
            </div>

            {/* 생성 실행 버튼 (클릭 2번) */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerateContent}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-black text-amber-300 hover:bg-gray-900 hover:text-amber-200 disabled:opacity-50 text-sm font-black flex items-center justify-center gap-2 shadow-xl transition-all"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={18} className="animate-spin text-amber-400" />
                    <span>AI가 카피 및 카드뉴스를 제작 중입니다...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="text-amber-400" />
                    <span>[생성] 인스타그램 카드뉴스 생성하기</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 결과 컨트롤 툴바 */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="px-3.5 py-1.5 rounded-xl bg-amber-100 text-amber-900 font-black text-xs">
                총 {contentPackage.slides.length}장 생성됨
              </div>
              <span className="text-xs font-bold text-gray-500">
                규격: <span className="text-black font-extrabold">{contentPackage.aspectRatio}</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
              {/* 캡션 & 해시태그 복사 버튼 */}
              <button
                type="button"
                onClick={handleCopyCaption}
                className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-black text-gray-800 transition-colors flex items-center gap-1.5"
              >
                {hasCopiedCaption ? (
                  <>
                    <Check size={14} className="text-green-600 stroke-[3]" />
                    <span className="text-green-700">복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>캡션 + 해시태그 15개 복사</span>
                  </>
                )}
              </button>

              {/* 전체 PNG 다운로드 (ZIP) 버튼 (클릭 3번) */}
              <button
                type="button"
                disabled={isDownloadingZip}
                onClick={handleDownloadAllZip}
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-xs font-black text-black transition-all flex items-center gap-1.5 shadow-md"
              >
                {isDownloadingZip ? (
                  <>
                    <RefreshCw size={14} className="animate-spin text-black" />
                    <span>
                      압축 중 {zipProgress ? `(${zipProgress.current}/${zipProgress.total})` : ''}
                    </span>
                  </>
                ) : (
                  <>
                    <FileArchive size={14} />
                    <span>PNG 전체 다운로드 (ZIP)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 슬라이드 카드 그리드 (실시간 렌더링 + 개별 수정 + 개별 다운로드) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentPackage.slides.map((slide, index) => {
              const isEditing = editingSlideId === slide.id;

              return (
                <div
                  key={slide.id}
                  className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
                >
                  {/* 상단 슬라이드 툴바 */}
                  <div className="flex items-center justify-between text-xs font-bold text-gray-500 px-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-black">
                        {index + 1}
                      </span>
                      <span className="text-gray-800 font-extrabold">{slide.templateType}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingSlideId(isEditing ? null : slide.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 ${
                          isEditing
                            ? 'bg-amber-400 text-black'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Edit3 size={12} />
                        <span>{isEditing ? '완료' : '텍스트 수정'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadSingle(slide, index)}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold transition-colors flex items-center gap-1"
                        title="단일 PNG 다운로드"
                      >
                        <Download size={12} />
                        <span>PNG</span>
                      </button>
                    </div>
                  </div>

                  {/* 실제 슬라이드 렌더러 (pixelRatio 2로 캡처되는 DOM 타겟) */}
                  <div className="w-full flex items-center justify-center bg-gray-50 rounded-2xl p-1">
                    <TemplateRenderer
                      ref={(el) => {
                        slideRefs.current[slide.id] = el;
                      }}
                      slide={slide}
                      aspectRatio={contentPackage.aspectRatio}
                    />
                  </div>

                  {/* 인라인 텍스트 수정 패널 */}
                  {isEditing && (
                    <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-2 text-xs">
                      <span className="font-black text-amber-900 block mb-1">
                        ✏️ 카드별 텍스트 즉시 수정
                      </span>

                      {slide.templateType === 'cover_new' && (
                        <>
                          <input
                            type="text"
                            placeholder="상단 카피"
                            value={slide.props.title1 || ''}
                            onChange={(e) => handleUpdateSlideProp(slide.id, 'title1', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 font-semibold"
                          />
                          <input
                            type="text"
                            placeholder="메인 타이틀"
                            value={slide.props.title2 || ''}
                            onChange={(e) => handleUpdateSlideProp(slide.id, 'title2', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 font-semibold"
                          />
                          <textarea
                            rows={2}
                            placeholder="손글씨 문구"
                            value={slide.props.handwriting || ''}
                            onChange={(e) => handleUpdateSlideProp(slide.id, 'handwriting', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 font-semibold"
                          />
                        </>
                      )}

                      {slide.templateType === 'hook_photo' && (
                        <>
                          <textarea
                            rows={2}
                            placeholder="후크 타이틀"
                            value={slide.props.hookTitle || ''}
                            onChange={(e) => handleUpdateSlideProp(slide.id, 'hookTitle', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 font-semibold"
                          />
                          <textarea
                            rows={2}
                            placeholder="서브 카피"
                            value={slide.props.subText || ''}
                            onChange={(e) => handleUpdateSlideProp(slide.id, 'subText', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 font-semibold"
                          />
                        </>
                      )}

                      {slide.templateType === 'review_card' && (
                        <>
                          <input
                            type="text"
                            placeholder="상품명"
                            value={slide.props.productName || ''}
                            onChange={(e) => handleUpdateSlideProp(slide.id, 'productName', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 font-semibold"
                          />
                          <textarea
                            rows={2}
                            placeholder="설명 문구"
                            value={slide.props.description || ''}
                            onChange={(e) => handleUpdateSlideProp(slide.id, 'description', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 font-semibold"
                          />
                          <input
                            type="text"
                            placeholder="손글씨 포인트"
                            value={slide.props.handwriting || ''}
                            onChange={(e) => handleUpdateSlideProp(slide.id, 'handwriting', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 font-semibold"
                          />
                        </>
                      )}

                      {slide.templateType === 'top5' && (
                        <>
                          <input
                            type="text"
                            placeholder="제목"
                            value={slide.props.title || ''}
                            onChange={(e) => handleUpdateSlideProp(slide.id, 'title', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 font-semibold"
                          />
                          <input
                            type="text"
                            placeholder="서브 카피"
                            value={slide.props.subText || ''}
                            onChange={(e) => handleUpdateSlideProp(slide.id, 'subText', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 font-semibold"
                          />
                        </>
                      )}

                      {slide.templateType === 'reels_cover' && (
                        <>
                          <input
                            type="text"
                            placeholder="스티커 문구"
                            value={slide.props.stickerText || ''}
                            onChange={(e) => handleUpdateSlideProp(slide.id, 'stickerText', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 font-semibold"
                          />
                          <input
                            type="text"
                            placeholder="조회수 표시"
                            value={slide.props.viewsCount || ''}
                            onChange={(e) => handleUpdateSlideProp(slide.id, 'viewsCount', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 font-semibold"
                          />
                        </>
                      )}

                      {slide.templateType === 'rating_detail' && (
                        <>
                          <input
                            type="text"
                            placeholder="상품명"
                            value={slide.props.productName || ''}
                            onChange={(e) => handleUpdateSlideProp(slide.id, 'productName', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 font-semibold"
                          />
                          <textarea
                            rows={2}
                            placeholder="한줄평"
                            value={slide.props.quote || ''}
                            onChange={(e) => handleUpdateSlideProp(slide.id, 'quote', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 font-semibold"
                          />
                        </>
                      )}

                      {slide.templateType === 'photo_dessert' && (
                        <>
                          <input
                            type="text"
                            placeholder="손글씨 문구"
                            value={slide.props.handwriting || ''}
                            onChange={(e) => handleUpdateSlideProp(slide.id, 'handwriting', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 font-semibold"
                          />
                          <input
                            type="text"
                            placeholder="상품 타이틀"
                            value={slide.props.title || ''}
                            onChange={(e) => handleUpdateSlideProp(slide.id, 'title', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 font-semibold"
                          />
                        </>
                      )}

                      {slide.templateType === 'versus' && (
                        <>
                          <textarea
                            rows={2}
                            placeholder="대결 질문"
                            value={slide.props.question || ''}
                            onChange={(e) => handleUpdateSlideProp(slide.id, 'question', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 font-semibold"
                          />
                        </>
                      )}

                      {slide.templateType === 'cta_app' && (
                        <>
                          <textarea
                            rows={2}
                            placeholder="손글씨 질문"
                            value={slide.props.handwriting || ''}
                            onChange={(e) => handleUpdateSlideProp(slide.id, 'handwriting', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 font-semibold"
                          />
                          <input
                            type="text"
                            placeholder="버튼 문구"
                            value={slide.props.buttonText || ''}
                            onChange={(e) => handleUpdateSlideProp(slide.id, 'buttonText', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 font-semibold"
                          />
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 캡션 & 해시태그 카드 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <span>📝 생성된 인스타그램 피드 캡션 및 해시태그</span>
              </h3>
              <button
                type="button"
                onClick={handleCopyCaption}
                className="px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-800 text-xs font-black flex items-center gap-1.5 transition-colors shadow-sm"
              >
                {hasCopiedCaption ? <Check size={14} className="text-green-400 stroke-[3]" /> : <Copy size={14} />}
                <span>{hasCopiedCaption ? '복사 완료!' : '캡션 복사하기'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-line font-medium">
              {contentPackage.caption}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {contentPackage.hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold border border-amber-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. 9종 템플릿 쇼케이스 탭 (첨부 이미지와 동일한 3x3 원본 프리뷰) */}
      {activeSubTab === 'showcase' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-5 border border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-gray-900">
                🎨 인스타그램 9종 피드 그리드 (3×3 정방형 쇼케이스)
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                업로드해주신 시안 이미지와 100% 동일한 비주얼 토큰으로 제작된 9개 템플릿입니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setContentPackage(SAMPLE_INSTAGRAM_CONTENT);
                showToast('초기 9개 템플릿 샘플이 복구되었습니다.', 'info');
              }}
              className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800"
            >
              기본 샘플 복구
            </button>
          </div>

          {/* 3x3 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_INSTAGRAM_CONTENT.slides.map((slide, index) => (
              <div
                key={slide.id}
                className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-bold px-1">
                  <span className="text-gray-800 font-black">
                    #{index + 1} {slide.templateType}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDownloadSingle(slide, index)}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                    title="PNG 다운로드"
                  >
                    <Download size={13} />
                  </button>
                </div>

                <div className="w-full bg-gray-50 rounded-2xl p-0.5">
                  <TemplateRenderer
                    ref={(el) => {
                      slideRefs.current[slide.id] = el;
                    }}
                    slide={slide}
                    aspectRatio="1:1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. 생성 이력 탭 */}
      {activeSubTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                <History size={18} className="text-amber-500" />
                <span>카드뉴스 생성 이력 (Supabase content_posts)</span>
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                과거에 생성된 요청문과 카드뉴스를 클릭 한 번으로 다시 불러옵니다.
              </p>
            </div>
            <button
              type="button"
              onClick={loadHistory}
              disabled={isLoadingHistory}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1"
            >
              <RefreshCw size={14} className={isLoadingHistory ? 'animate-spin' : ''} />
              <span>새로고침</span>
            </button>
          </div>

          {historyList.length === 0 ? (
            <div className="py-16 text-center text-gray-400 font-medium text-xs">
              아직 저장된 생성 이력이 없습니다. [AI 생성기]에서 카드를 생성해보세요!
            </div>
          ) : (
            <div className="space-y-3">
              {historyList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleRestoreFromHistory(item)}
                  className="p-4 rounded-2xl border border-gray-100 hover:border-amber-300 hover:bg-amber-50/40 cursor-pointer transition-all flex items-center justify-between group shadow-sm"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-400 text-black">
                        {item.aspect_ratio || '1:1'}
                      </span>
                      <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(item.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm font-black text-gray-900 truncate">
                      "{item.prompt}"
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5 font-medium">
                      {item.caption.slice(0, 70)}...
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>불러오기</span>
                      <ArrowRight size={14} />
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteHistory(item.id, e)}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="삭제"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 상품 선택 모달 */}
      {isProductSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-gray-900">상품 선택</h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  카드뉴스에 반영할 신상 상품을 검색하여 선택하세요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsProductSelectorOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  placeholder="상품명 또는 브랜드 검색..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold focus:border-amber-400"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsProductSelectorOpen(false);
                  setIsCustomProductModalOpen(true);
                }}
                className="px-3 py-2 rounded-xl bg-amber-400 text-black text-xs font-bold hover:bg-amber-300 shrink-0"
              >
                + 직접 입력
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredProducts.map((p) => {
                const isSelected = selectedProductIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedProductIds((prev) =>
                        isSelected ? prev.filter((id) => id !== p.id) : [...prev, p.id]
                      );
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-amber-50 border-amber-300 shadow-sm'
                        : 'bg-white border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center border border-gray-100">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={18} className="text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded">
                        {p.brand || '신제품'}
                      </span>
                      <p className="text-xs font-black text-gray-900 truncate mt-0.5">{p.name}</p>
                      <p className="text-[11px] font-medium text-gray-400">{p.category}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
                        isSelected ? 'bg-amber-400 text-black' : 'border border-gray-300'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-600">
                선택됨: <span className="text-amber-600 font-black">{selectedProductIds.length}개</span>
              </span>
              <button
                type="button"
                onClick={() => setIsProductSelectorOpen(false)}
                className="px-5 py-2 rounded-xl bg-black text-white text-xs font-black hover:bg-gray-800"
              >
                선택 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 직접 상품 정보 및 이미지 추가 모달 */}
      {isCustomProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-black text-gray-900">상품 직접 추가</h3>
              <button
                type="button"
                onClick={() => setIsCustomProductModalOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">상품명 *</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="예: 포카칩 어니언버터"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">브랜드 / 제조사</label>
              <input
                type="text"
                value={customBrand}
                onChange={(e) => setCustomBrand(e.target.value)}
                placeholder="예: 오리온"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">카테고리</label>
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold"
              >
                <option value="간식">간식/과자</option>
                <option value="라면">라면</option>
                <option value="음료">음료/커피</option>
                <option value="디저트">디저트/베이커리</option>
                <option value="식품">간편식/식품</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                상품 이미지 (URL 입력 또는 로컬 파일 업로드)
              </label>
              <input
                type="text"
                value={customImage}
                onChange={(e) => setCustomImage(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold mb-2"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileUpload}
                className="text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCustomProductModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleAddCustomProduct}
                className="px-5 py-2 rounded-xl bg-black text-white text-xs font-black hover:bg-gray-800"
              >
                추가 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
