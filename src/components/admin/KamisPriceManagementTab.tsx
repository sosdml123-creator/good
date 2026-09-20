import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2
} from 'lucide-react';
import { SafeImage } from '../common/SafeImage';

export const KamisPriceManagementTab: React.FC = () => {
  const { products, kamisPriceStatus, refreshKamisPrices, showToast } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 농수산물 품목들만 필터링
  const agriProducts = products.filter(p => 
    p.itemType === 'fresh' || 
    ['과일', '식재료', '고기·수산'].includes(p.category) ||
    Boolean(p.produceDetails) ||
    Boolean(p.kamisPriceInfo)
  );

  const syncedCount = agriProducts.filter(p => p.kamisPriceInfo).length;

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await refreshKamisPrices(true);
      if (res.count > 0) {
        showToast(`🌾 KAMIS 최신 공시 시세 ${res.count}개 품목 동기화 완료! (${res.latestDate} 기준)`, 'success');
      } else {
        showToast('시세 동기화가 완료되었습니다.', 'info');
      }
    } catch (e: any) {
      showToast(e.message || '시세 동기화 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Status & Header Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 text-white p-5 rounded-2xl shadow-lg border border-emerald-800/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl">🌾</span>
              <h2 className="text-lg font-black tracking-tight">KAMIS 농수산물 오픈 API 실시간 시세 관리</h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 연동 활성화
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              aT 한국농수산식품유통공사 KAMIS OpenAPI와 연동되어 매일매일 전국 도·소매 공시 가격 및 등락률을 자동 갱신합니다.
            </p>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing || kamisPriceStatus.isUpdating}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing || kamisPriceStatus.isUpdating ? 'animate-spin' : ''}`} />
            <span>{isRefreshing || kamisPriceStatus.isUpdating ? '동기화 진행 중...' : '지금 최신 시세 갱신'}</span>
          </button>
        </div>

        {/* Info badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-white/10 text-xs">
          <div className="bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/5">
            <div className="text-gray-400 text-[11px]">공시 기준일자</div>
            <div className="text-white font-black text-sm mt-0.5">
              {kamisPriceStatus.latestDate || '최신 영업일'}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/5">
            <div className="text-gray-400 text-[11px]">연동 품목 수</div>
            <div className="text-emerald-400 font-black text-sm mt-0.5">
              {syncedCount}개 / {agriProducts.length}개
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/5">
            <div className="text-gray-400 text-[11px]">API 인증키</div>
            <div className="text-white font-mono text-[11px] truncate mt-0.5">
              48af112d-8ebb...
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/5">
            <div className="text-gray-400 text-[11px]">일별 자동 업데이트</div>
            <div className="text-cyan-300 font-black text-sm mt-0.5">
              매일 자동 실행
            </div>
          </div>
        </div>
      </div>

      {/* 2. Agricultural & Marine Products List with KAMIS Info */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-black text-gray-900 flex items-center gap-1.5">
              <span>품목별 실시간 공시 시세 현황</span>
              <span className="text-xs font-bold text-gray-500">({agriProducts.length}개)</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              과일, 식재료, 축산물, 수산물 각 품목에 자동 매핑된 KAMIS 일별 시세 및 변동률 내역입니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {agriProducts.map(prod => {
            const kamis = prod.kamisPriceInfo;
            return (
              <div 
                key={prod.id} 
                className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-emerald-200 transition-all shadow-2xs flex gap-3"
              >
                <SafeImage
                  src={prod.image}
                  alt={prod.name}
                  fallbackCategory={prod.category}
                  fallbackName={prod.name}
                  className="w-16 h-16 rounded-lg object-cover bg-white shrink-0 border border-gray-100"
                />

                <div className="min-w-0 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded">
                        {prod.category} · {prod.subCategory || '원물'}
                      </span>
                      {prod.origin && (
                        <span className="text-[10px] text-gray-500">{prod.origin.split(' ')[0]}</span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 truncate mt-0.5">{prod.name}</h4>
                  </div>

                  {kamis ? (
                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-end justify-between flex-wrap gap-1">
                      <div>
                        <div className="text-[10px] text-gray-400">
                          KAMIS 공시 ({kamis.itemName} / {kamis.kindName || kamis.unit})
                        </div>
                        <div className="text-xs font-black text-gray-900">
                          {kamis.todayPrice.toLocaleString()}원 <span className="text-[10px] text-gray-500 font-normal">/ {kamis.unit}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        {kamis.trend === 'up' && (
                          <span className="text-[11px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3" />
                            <span>▲ +{kamis.priceChange.toLocaleString()}원 (+{kamis.changeRate}%)</span>
                          </span>
                        )}
                        {kamis.trend === 'down' && (
                          <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <TrendingDown className="w-3 h-3" />
                            <span>▼ {Math.abs(kamis.priceChange).toLocaleString()}원 ({kamis.changeRate}%)</span>
                          </span>
                        )}
                        {kamis.trend === 'same' && (
                          <span className="text-[11px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                            - 보합
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                      <span>KAMIS 시세 대기 중</span>
                      <span className="text-[11px] font-bold text-gray-700">판매가 {(prod.price || 0).toLocaleString()}원</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
