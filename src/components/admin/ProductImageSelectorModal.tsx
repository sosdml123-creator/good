import React, { useState, useEffect } from 'react';
import { Search, Check, RefreshCw, X, Image as ImageIcon } from 'lucide-react';
import { searchHighResProductImages, ProductImageCandidate } from '../../services/naverApi';

interface ProductImageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: string;
  productName: string;
  currentImage: string;
  onSelectImage: (newImageUrl: string) => void;
  isDark?: boolean;
}

export const ProductImageSelectorModal: React.FC<ProductImageSelectorModalProps> = ({
  isOpen,
  onClose,
  brand,
  productName,
  currentImage,
  onSelectImage,
  isDark = false
}) => {
  const [searchQuery, setSearchQuery] = useState(`${brand} ${productName}`.trim());
  const [candidates, setCandidates] = useState<ProductImageCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [directUrlInput, setDirectUrlInput] = useState('');
  const [selectedUrl, setSelectedUrl] = useState(currentImage);

  // Styling helpers
  const cardBg = isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900';
  const inputBg = isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400';

  const fetchCandidates = async (queryToSearch: string) => {
    setIsLoading(true);
    try {
      const results = await searchHighResProductImages(brand, queryToSearch);
      setCandidates(results);
    } catch (err) {
      console.error('[ProductImageSelectorModal] fetch candidates failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const initialQuery = `${brand} ${productName}`.trim();
      setSearchQuery(initialQuery);
      setSelectedUrl(currentImage);
      setDirectUrlInput('');
      fetchCandidates(productName);
    }
  }, [isOpen, brand, productName, currentImage]);

  if (!isOpen) return null;

  const handleApply = (urlToApply: string) => {
    if (!urlToApply) return;
    onSelectImage(urlToApply);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[88vh] ${cardBg}`}>
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black flex items-center gap-1.5">
                <span>고화질 정품 패키지 이미지 탐색 & 교체</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {brand || '신제품'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 truncate max-w-md">
                '{productName}'의 공식 누끼 패키지컷 및 고화질 실물 사진을 원클릭으로 선택합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className={`p-3.5 border-b space-y-2.5 ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50/60'}`}>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchCandidates(searchQuery)}
                placeholder="검색할 상품명 또는 키워드 (예: 신라면 툼바, 비쵸비 딸기)"
                className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${inputBg}`}
              />
            </div>
            <button
              onClick={() => fetchCandidates(searchQuery)}
              disabled={isLoading}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 shrink-0"
            >
              {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>패키지 재검색</span>
            </button>
          </div>

          {/* Direct URL input accordion */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">직접 URL 입력:</span>
            <input
              type="text"
              value={directUrlInput}
              onChange={e => setDirectUrlInput(e.target.value)}
              placeholder="https://... 직접 이미지 링크 붙여넣기"
              className={`flex-1 px-2.5 py-1 rounded-lg text-[11px] border focus:outline-none focus:ring-1 focus:ring-amber-500 ${inputBg}`}
            />
            {directUrlInput && (
              <button
                onClick={() => handleApply(directUrlInput)}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold shrink-0 transition-all"
              >
                적용
              </button>
            )}
          </div>
        </div>

        {/* Modal Body: Candidate Grid */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3 min-h-[280px]">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-bold">네이버 쇼핑 공식 카탈로그 및 실물 패키지 컷을 검색 중입니다...</p>
            </div>
          ) : candidates.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {candidates.map((cand, idx) => {
                const isChosen = selectedUrl === cand.url;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedUrl(cand.url)}
                    className={`group relative rounded-xl border p-2 flex flex-col justify-between transition-all cursor-pointer hover:shadow-md ${
                      isChosen
                        ? (isDark ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30' : 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/20')
                        : (isDark ? 'border-slate-800 bg-slate-800/40 hover:border-slate-700' : 'border-slate-200 bg-white hover:border-slate-300')
                    }`}
                  >
                    {/* Image Preview Container */}
                    <div className="w-full aspect-square rounded-lg bg-white overflow-hidden relative border border-slate-100 dark:border-slate-800 flex items-center justify-center p-1">
                      <img
                        src={cand.url}
                        alt={cand.title}
                        className="w-full h-full object-contain object-center transition-transform group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://shopping-phinf.pstatic.net/main_4187063/41870638618.20230814143219.jpg';
                        }}
                      />

                      {/* Official badge */}
                      {cand.isOfficial && (
                        <span className="absolute top-1 left-1 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                          정품
                        </span>
                      )}

                      {/* Check icon if chosen */}
                      {isChosen && (
                        <div className="absolute inset-0 bg-amber-500/20 backdrop-blur-[1px] flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="pt-2 space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 truncate" title={cand.title}>
                        {cand.title}
                      </p>
                      <div className="flex items-center justify-between text-[9px] text-slate-400">
                        <span className="truncate max-w-[80px]">{cand.source}</span>
                        {cand.price && (
                          <span className="font-bold text-rose-500">{cand.price.toLocaleString()}원</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center space-y-2 text-slate-400">
              <ImageIcon className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-xs font-bold">검색된 패키지 이미지가 없습니다.</p>
              <p className="text-[11px]">검색어를 단순하게 수정하거나 상단에 이미지 URL을 직접 입력해보세요.</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className={`p-4 border-t flex items-center justify-between gap-3 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-slate-50'}`}>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>선택된 이미지 미리보기:</span>
            {selectedUrl && (
              <div className="w-8 h-8 rounded-md border overflow-hidden bg-white shrink-0">
                <img src={selectedUrl} alt="selected" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border ${
                isDark ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              취소
            </button>
            <button
              onClick={() => handleApply(selectedUrl)}
              disabled={!selectedUrl}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-40"
            >
              <Check className="w-3.5 h-3.5" />
              <span>이 이미지로 최종 변경</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
