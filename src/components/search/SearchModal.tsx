import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, ChevronLeft, X, Star, Flame, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { 
    products, 
    goBack, 
    openProductDetail, 
    recentSearches, 
    addRecentSearch, 
    removeRecentSearch, 
    clearRecentSearches 
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');

  const popularKeywords = [
    '꼬북칩',
    '피스타치오',
    '두바이 초콜릿',
    '코카콜라 제로',
    '먹태청양마요',
    '신라면 똠얌',
    '연세우유 생크림빵',
  ];

  const handleSearch = (keyword: string) => {
    setInputQuery(keyword);
    addRecentSearch(keyword);
  };

  const filteredProducts = inputQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(inputQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(inputQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(inputQuery.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(inputQuery.toLowerCase()))
      )
    : [];

  return (
    <div className="bg-white min-h-screen flex flex-col pb-24">
      {/* 1. Top Search Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-3 py-2.5 flex items-center gap-2 z-30">
        <button
          onClick={goBack}
          className="p-1.5 text-gray-700 hover:text-gray-900 shrink-0"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <div className="flex-1 bg-gray-100 rounded-full px-3.5 py-2 flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(inputQuery);
              }
            }}
            placeholder="제품명, 브랜드, 카테고리 검색"
            className="flex-1 bg-transparent text-xs text-gray-900 outline-none placeholder-gray-400"
          />
          {inputQuery && (
            <button
              onClick={() => setInputQuery('')}
              className="p-0.5 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => handleSearch(inputQuery)}
          className="text-xs font-bold text-[#0066FF] px-2 py-1 shrink-0"
        >
          검색
        </button>
      </div>

      {/* 2. Results or Search Suggestions */}
      {inputQuery.trim() ? (
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3 font-medium">
            <span>
              ‘<b className="text-gray-900 font-bold">{inputQuery}</b>’ 검색 결과 ({filteredProducts.length}개)
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    addRecentSearch(inputQuery);
                    openProductDetail(p.id);
                  }}
                  className="py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-16 h-16 rounded-xl object-cover bg-gray-50 border border-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-gray-400 font-medium block">
                      {p.brand} · {p.category}
                    </span>
                    <h3 className="text-xs font-bold text-gray-900 truncate mt-0.5">
                      {p.name}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-black text-gray-900">
                        {p.price.toLocaleString()}원
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-gray-700">
                        <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                        <span>{p.overallRating.toFixed(1)}</span>
                        <span className="text-gray-400 font-normal">({p.ratingCount})</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400 space-y-2">
              <span className="text-3xl block">🔍</span>
              <p className="text-xs font-medium">검색된 신제품이 없습니다.</p>
              <p className="text-[11px] text-gray-400">다른 검색어로 다시 시도해보세요.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 p-4 space-y-6">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-gray-900 mb-2.5">
                <span>최근 검색어</span>
                <button
                  onClick={clearRecentSearches}
                  className="text-[11px] text-gray-400 hover:text-gray-600 font-normal"
                >
                  모두 지우기
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((k) => (
                  <div
                    key={k}
                    className="bg-gray-100 rounded-full pl-3 pr-2 py-1.5 text-xs font-medium text-gray-700 flex items-center gap-1.5"
                  >
                    <span
                      onClick={() => handleSearch(k)}
                      className="cursor-pointer hover:text-gray-900"
                    >
                      {k}
                    </span>
                    <button
                      onClick={() => removeRecentSearch(k)}
                      className="text-gray-400 hover:text-gray-600 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Real-time Keywords */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 mb-3">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>실시간 인기 검색어</span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
              {popularKeywords.map((k, idx) => (
                <button
                  key={k}
                  onClick={() => handleSearch(k)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 text-left transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-xs font-black ${
                        idx < 3 ? 'text-[#0066FF]' : 'text-gray-400'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-gray-800">{k}</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-gray-300" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
