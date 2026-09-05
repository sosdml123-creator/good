import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, ChevronLeft, X, Star, Flame, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { Product } from '../../types';

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
    '새우',
    '복숭아',
    '수박',
    '두바이 초콜릿',
    '연어',
    '꼬북칩',
    '딸기',
    '신라면 똠얌',
  ];

  const handleSearch = (keyword: string) => {
    setInputQuery(keyword);
    addRecentSearch(keyword);
  };

  const query = inputQuery.trim().toLowerCase();

  // Enhanced search matching across name, brand, category, subcategory, ingredients, and description
  const filteredProducts = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(query)) ||
          (p.ingredients && p.ingredients.toLowerCase().includes(query)) ||
          (p.description && p.description.toLowerCase().includes(query))
      )
    : [];

  // Helper to distinguish fresh / raw biological items from packaged/processed goods
  const isFreshItem = (p: Product): boolean => {
    return (
      p.itemType === 'fresh' ||
      p.category === '과일' ||
      Boolean(p.produceDetails)
    );
  };

  const freshProducts = filteredProducts.filter((p) => isFreshItem(p));
  const packagedProducts = filteredProducts.filter((p) => !isFreshItem(p));

  return (
    <div className="bg-white min-h-full flex flex-col pb-12">
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
      {query ? (
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4 font-medium">
            <span>
              ‘<b className="text-gray-900 font-bold">{inputQuery}</b>’ 검색 결과 ({filteredProducts.length}개)
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="space-y-6">
              {/* 1. 신선 생물 · 산지직송 원물 (우선 배치) */}
              {freshProducts.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🦐</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-xs font-bold text-emerald-950">
                            신선 생물 · 산지직송 원물
                          </h3>
                          <span className="text-[9px] bg-emerald-600 text-white font-black px-1.5 py-0.2 rounded">
                            진짜 원물
                          </span>
                        </div>
                        <p className="text-[10px] text-emerald-700">산지직송 자연산 생물 및 제철 원물 먹거리</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-800 shrink-0">
                      {freshProducts.length}개
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100 bg-white rounded-xl border border-gray-100 shadow-2xs">
                    {freshProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          addRecentSearch(inputQuery);
                          openProductDetail(p.id);
                        }}
                        className="py-3 px-2 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <div className="relative shrink-0">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-16 h-16 rounded-xl object-cover bg-gray-50 border border-gray-100"
                          />
                          <span className="absolute -top-1 -left-1 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-md shadow-xs">
                            생물·산지
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] text-gray-400 font-medium">
                              {p.brand} · {p.category}
                            </span>
                            {p.subCategory && (
                              <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded">
                                {p.subCategory}
                              </span>
                            )}
                            {p.produceDetails?.brixGrade && (
                              <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1 py-0.2 rounded">
                                {p.produceDetails.brixGrade.split(' ')[0]}
                              </span>
                            )}
                          </div>

                          <h3 className="text-xs font-bold text-gray-900 truncate mt-0.5">
                            {p.name}
                          </h3>

                          {p.origin && (
                            <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium mt-0.5">
                              <MapPin className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate">{p.origin}</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-gray-900">
                                {p.price.toLocaleString()}원
                              </span>
                              {p.volume && (
                                <span className="text-[10px] text-gray-400">/ {p.volume}</span>
                              )}
                            </div>
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
                </div>
              )}

              {/* 2. 관련 가공식품 · 제품 (생물 아래 분리 배치) */}
              {packagedProducts.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📦</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-xs font-bold text-gray-900">
                            ‘{inputQuery}’ 관련 가공식품 · 제품
                          </h3>
                          <span className="text-[9px] bg-blue-50 text-[#0066FF] font-bold px-1.5 py-0.2 rounded border border-blue-200">
                            스낵·간편식
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500">원물이 함유된 만두, 스낵, 라면 등 가공식품</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-gray-700 shrink-0">
                      {packagedProducts.length}개
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100 bg-white rounded-xl border border-gray-100 shadow-2xs">
                    {packagedProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          addRecentSearch(inputQuery);
                          openProductDetail(p.id);
                        }}
                        className="py-3 px-2 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-16 h-16 rounded-xl object-cover bg-gray-50 border border-gray-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] text-gray-400 font-medium">
                              {p.brand} · {p.category}
                            </span>
                            {p.subCategory && (
                              <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded">
                                {p.subCategory}
                              </span>
                            )}
                          </div>
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
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400 space-y-2">
              <span className="text-3xl block">🔍</span>
              <p className="text-xs font-medium">검색된 먹거리가 없습니다.</p>
              <p className="text-[11px] text-gray-400">‘새우’, ‘복숭아’, ‘수박’ 등으로 다시 검색해보세요.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 p-4 space-y-6">
          {/* Quick produce search tags */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#0066FF]" />
              <span>원물 vs 관련제품 추천 검색</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { tag: '🦐 생물 새우', query: '새우' },
                { tag: '🍑 산지 복숭아', query: '복숭아' },
                { tag: '🍉 꿀수박', query: '수박' },
                { tag: '🍣 생연어', query: '연어' },
                { tag: '🍎 청송 사과', query: '사과' }
              ].map((item) => (
                <button
                  key={item.tag}
                  onClick={() => handleSearch(item.query)}
                  className="px-2.5 py-1 bg-white text-gray-700 rounded-full text-xs font-semibold border border-blue-200/60 hover:border-[#0066FF] hover:text-[#0066FF] transition-all shadow-2xs"
                >
                  {item.tag}
                </button>
              ))}
            </div>
          </div>

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

