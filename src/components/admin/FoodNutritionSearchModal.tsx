import React, { useState, useEffect } from 'react';
import { Search, X, Loader2, Sparkles, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { searchFoodNutrition, FoodNutritionData } from '../../services/nutritionApi';

interface FoodNutritionSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery: string;
  brand?: string;
  onSelect: (item: FoodNutritionData) => void;
}

export const FoodNutritionSearchModal: React.FC<FoodNutritionSearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery,
  brand,
  onSelect,
}) => {
  const [query, setQuery] = useState(initialQuery || '');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FoodNutritionData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchTarget: string) => {
    const trimmed = searchTarget.trim();
    if (!trimmed) return;

    setLoading(true);
    setErrorMsg(null);
    setHasSearched(true);

    try {
      const res = await searchFoodNutrition(trimmed, 1, 20);
      setResults(res.items);
      setTotalCount(res.totalCount);
    } catch (err: any) {
      console.error('[Nutrition Search Error]', err);
      setErrorMsg('식약처 영양성분 데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const initial = initialQuery || brand || '';
      setQuery(initial);
      if (initial.trim()) {
        handleSearch(initial);
      } else {
        setResults([]);
        setHasSearched(false);
      }
    }
  }, [isOpen, initialQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  식약처 공식 식품 영양성분 조회
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  공공데이터포털 연동
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                식품의약품안전처 DB에서 상품 영양표시(칼로리, 탄단지, 나트륨 등)를 검색하여 원클릭 적용합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="식품명 검색 (예: 신라면, 포카칩, 코카콜라, 비비고)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>검색 중...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>검색</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Keywords */}
          {brand && (
            <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-400">빠른 키워드:</span>
              <button
                type="button"
                onClick={() => {
                  setQuery(brand);
                  handleSearch(brand);
                }}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
              >
                제조사: {brand}
              </button>
            </div>
          )}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/50">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                식약처 국가 식품영양성분DB에서 검색 중입니다...
              </p>
            </div>
          ) : errorMsg ? (
            <div className="py-12 px-6 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-center">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-rose-700 dark:text-rose-300">{errorMsg}</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold text-slate-500">
                  검색 결과 총 <strong className="text-emerald-600">{totalCount}</strong>건 (상위 {results.length}건 표시)
                </span>
                <span className="text-[10px] text-slate-400">클릭 시 해당 상품의 영양성분이 즉시 적용됩니다</span>
              </div>

              {results.map((item) => (
                <div
                  key={item.num || item.foodCode || item.foodName}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {item.groupName}
                        </span>
                        {item.categoryName && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300">
                            {item.categoryName}
                          </span>
                        )}
                        {item.makerName && (
                          <span className="text-xs font-semibold text-slate-500">
                            {item.makerName}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {item.foodName}
                      </h4>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 group-hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300 group-hover:text-white text-xs font-bold flex items-center gap-1 shrink-0 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>적용하기</span>
                    </button>
                  </div>

                  {/* Nutrition Highlights */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                    <div className="p-1.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30">
                      <span className="text-[10px] text-slate-400 block">열량</span>
                      <strong className="text-emerald-700 dark:text-emerald-300 font-black">
                        {item.calories} kcal
                      </strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-[10px] text-slate-400 block">탄수화물</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {item.carbs}g
                      </span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-[10px] text-slate-400 block">당류</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {item.sugar}g
                      </span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-[10px] text-slate-400 block">단백질</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {item.protein}g
                      </span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-[10px] text-slate-400 block">지방</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {item.fat}g
                      </span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-[10px] text-slate-400 block">나트륨</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {item.sodium}mg
                      </span>
                    </div>
                  </div>

                  {/* Serving Size & Weight info */}
                  {(item.servingSize || item.totalWeight) && (
                    <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-400">
                      {item.servingSize && <span>기준량: {item.servingSize}</span>}
                      {item.totalWeight && <span>총 중량: {item.totalWeight}</span>}
                      {item.reportNo && <span>품목보고번호: {item.reportNo}</span>}
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : hasSearched ? (
            <div className="py-14 text-center text-slate-400 space-y-2">
              <Sparkles className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                일치하는 식약처 영양성분 정보가 없습니다.
              </p>
              <p className="text-[11px] text-slate-400">
                맛이나 수식어를 제외하고 기본 명칭으로 검색해보세요. (예: '새우깡 매운맛' → '새우깡')
              </p>
            </div>
          ) : (
            <div className="py-14 text-center text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                상품명을 입력하고 검색 버튼을 눌러주세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
