import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  BarChart2, 
  Activity, 
  SlidersHorizontal,
  RefreshCw,
  Globe,
  Maximize2,
  Calendar,
  Layers
} from 'lucide-react';
import { CompanyForensicProfile, StockChartPoint } from '../types';
import { fetchLiveStockChart, ChartTimeframe, LiveChartResult } from '../services/yahooFinanceService';

interface StockMarketChartProps {
  company: CompanyForensicProfile;
}

export const StockMarketChart: React.FC<StockMarketChartProps> = ({ company }) => {
  const [chartType, setChartType] = useState<'area' | 'candlestick'>('area');
  const [showSMA, setShowSMA] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('1Y');
  const [chartResult, setChartResult] = useState<LiveChartResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch real market historical prices whenever ticker, timeframe or manual refresh triggers
  useEffect(() => {
    let active = true;
    setIsLoading(true);

    fetchLiveStockChart(company.ticker, timeframe, company.chartData)
      .then((res) => {
        if (active) {
          setChartResult(res);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [company.ticker, timeframe, refreshTrigger]);

  const points = useMemo(() => {
    if (chartResult && chartResult.points && chartResult.points.length > 0) {
      return chartResult.points;
    }
    return company.chartData || [];
  }, [chartResult, company.chartData]);

  const activePoint = hoveredIndex !== null && points[hoveredIndex] ? points[hoveredIndex] : null;

  const currentPrice = chartResult?.currentPrice ?? company.stockPrice;
  const periodStartPrice = chartResult?.periodStartPrice ?? (points.length > 0 ? points[0].close : currentPrice);
  const prevClose = chartResult?.previousClose ?? currentPrice;
  
  const timeframeReturn = chartResult?.priceChangePercent ?? 
    (points.length > 0 ? Math.round(((currentPrice - periodStartPrice) / periodStartPrice) * 10000) / 100 : 0);
  const timeframePriceChange = chartResult?.priceChange ?? 
    (points.length > 0 ? Math.round((currentPrice - periodStartPrice) * 100) / 100 : 0);
  
  const dayPriceChange = chartResult?.dayPriceChange ?? Math.round((currentPrice - prevClose) * 100) / 100;
  const dayPriceChangePercent = chartResult?.dayPriceChangePercent ?? 
    Math.round(((currentPrice - prevClose) / (prevClose || 1)) * 10000) / 100;

  const isUp = timeframeReturn >= 0;
  const primaryColor = isUp ? '#10b981' : '#ef4444';
  const primaryGradientId = isUp ? 'bullishGradient' : 'bearishGradient';

  // SVG dimensions
  const width = 920;
  const height = 300;
  const padding = { top: 25, right: 65, bottom: 45, left: 15 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Min and max for price with comfortable margin
  const { minPrice, maxPrice, priceRange } = useMemo(() => {
    if (points.length === 0) return { minPrice: 100, maxPrice: 200, priceRange: 100 };
    const allPrices = points.flatMap((d) => [d.open, d.high, d.low, d.close]);
    const min = Math.min(...allPrices);
    const max = Math.max(...allPrices);
    const spread = max - min || 1;
    // Add 8% vertical padding
    const pMin = Math.max(0, min - spread * 0.08);
    const pMax = max + spread * 0.08;
    return {
      minPrice: pMin,
      maxPrice: pMax,
      priceRange: pMax - pMin || 1
    };
  }, [points]);

  // Max volume for bottom histogram
  const maxVol = useMemo(() => {
    if (points.length === 0) return 1;
    return Math.max(...points.map((d) => d.volume)) || 1;
  }, [points]);

  // Coordinate mappers
  const getX = (index: number) => padding.left + (index / Math.max(1, points.length - 1)) * plotWidth;
  const getY = (val: number) => padding.top + plotHeight - ((val - minPrice) / priceRange) * plotHeight;
  const getVolHeight = (vol: number) => Math.min(45, Math.max(2, (vol / maxVol) * 45));

  // Area path generator (starts with proper M command)
  const { areaPath, linePath } = useMemo(() => {
    if (points.length === 0) return { areaPath: '', linePath: '' };
    const lineSegments = points.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(d.close).toFixed(1)}`).join(' ');
    const area = `${lineSegments} L ${getX(points.length - 1).toFixed(1)} ${(height - padding.bottom).toFixed(1)} L ${getX(0).toFixed(1)} ${(height - padding.bottom).toFixed(1)} Z`;
    return { areaPath: area, linePath: lineSegments };
  }, [points, minPrice, priceRange, plotHeight]);

  // SMA paths with true coordinate indexing
  const sma50Path = useMemo(() => {
    if (!showSMA || points.length === 0) return '';
    const valid = points
      .map((d, i) => ({ val: d.sma50, idx: i }))
      .filter((p) => p.val !== undefined && p.val !== null);
    if (valid.length === 0) return '';
    return valid.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.idx).toFixed(1)} ${getY(p.val!).toFixed(1)}`).join(' ');
  }, [points, showSMA, minPrice, priceRange]);

  const sma200Path = useMemo(() => {
    if (!showSMA || points.length === 0) return '';
    const valid = points
      .map((d, i) => ({ val: d.sma200, idx: i }))
      .filter((p) => p.val !== undefined && p.val !== null);
    if (valid.length === 0) return '';
    return valid.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.idx).toFixed(1)} ${getY(p.val!).toFixed(1)}`).join(' ');
  }, [points, showSMA, minPrice, priceRange]);

  const prevCloseY = getY(prevClose);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      {/* Top Header & Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-base font-bold text-white tracking-tight">
              {company.ticker}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {company.name}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{chartResult?.isLiveNetwork ? 'Live Yahoo Finance OHLCV' : 'SEC EDGAR Calibrated'}</span>
            </span>
            {isLoading && (
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <RefreshCw className="h-3 w-3 animate-spin text-red-400" />
                <span>Syncing live quote...</span>
              </span>
            )}
          </div>

          {/* Price & Period Performance Strip */}
          <div className="flex flex-wrap items-baseline gap-3 mt-1">
            <div className="text-2xl font-bold font-mono text-white tracking-tight">
              ${(activePoint ? activePoint.close : currentPrice).toFixed(2)}
            </div>

            {/* Change over timeframe */}
            <div className={`flex items-center gap-1 text-xs font-mono font-semibold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
              {isUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              <span>{timeframePriceChange >= 0 ? '+' : ''}${timeframePriceChange.toFixed(2)}</span>
              <span>({timeframeReturn >= 0 ? '+' : ''}{timeframeReturn.toFixed(2)}%)</span>
              <span className="text-slate-500 font-normal ml-0.5">past {timeframe}</span>
            </div>

            {/* 1-Day change */}
            <div className="text-xs text-slate-400 font-mono hidden sm:inline-block">
              Today: <span className={dayPriceChange >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                {dayPriceChange >= 0 ? '+' : ''}${dayPriceChange.toFixed(2)} ({dayPriceChangePercent >= 0 ? '+' : ''}{dayPriceChangePercent.toFixed(2)}%)
              </span>
            </div>

            {chartResult?.highPrice && chartResult?.lowPrice && (
              <div className="text-[11px] text-slate-500 font-mono hidden md:inline-block">
                Range: ${chartResult.lowPrice.toFixed(2)} - ${chartResult.highPrice.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        {/* Interactive Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Timeframe Buttons */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['1D', '5D', '1M', '6M', '1Y', '5Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                  timeframe === tf
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Type Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setChartType('area')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                chartType === 'area'
                  ? 'bg-slate-800 text-slate-200 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('candlestick')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                chartType === 'candlestick'
                  ? 'bg-slate-800 text-slate-200 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Candles
            </button>
          </div>

          {/* SMA Toggle */}
          <button
            onClick={() => setShowSMA(!showSMA)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-all font-medium ${
              showSMA
                ? 'border-sky-500/40 text-sky-400 bg-sky-500/10'
                : 'border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
            title="Toggle 50-day and 200-day Simple Moving Averages"
          >
            SMA 50/200
          </button>

          {/* Manual Refresh Button */}
          <button
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
            disabled={isLoading}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-50"
            title="Sync latest live Yahoo Finance data"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-red-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* SVG Stock Market Graph Canvas */}
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden select-none bg-slate-950/40 rounded-lg p-1 border border-slate-800/60"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[340px] block"
        >
          <defs>
            {/* Bullish Emerald Gradient */}
            <linearGradient id="bullishGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
              <stop offset="60%" stopColor="#10b981" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>

            {/* Bearish Red Gradient */}
            <linearGradient id="bearishGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.28" />
              <stop offset="60%" stopColor="#ef4444" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
            </linearGradient>

            {/* Volume bar gradient */}
            <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#475569" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#475569" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines & Price Scale */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = padding.top + plotHeight * pct;
            const priceVal = maxPrice - pct * priceRange;
            return (
              <g key={`grid-${i}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={width - padding.right + 8}
                  y={y + 3}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                  textAnchor="start"
                >
                  ${priceVal.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Previous Close Reference Line (if within range) */}
          {prevCloseY >= padding.top && prevCloseY <= height - padding.bottom && (
            <g>
              <line
                x1={padding.left}
                y1={prevCloseY}
                x2={width - padding.right}
                y2={prevCloseY}
                stroke="#64748b"
                strokeDasharray="2 2"
                strokeWidth="1"
                opacity="0.5"
              />
              <text
                x={width - padding.right + 8}
                y={prevCloseY + 3}
                fill="#94a3b8"
                fontSize="9"
                fontFamily="JetBrains Mono, monospace"
                textAnchor="start"
              >
                Prev: ${prevClose.toFixed(2)}
              </text>
            </g>
          )}

          {/* Volume bars (rendered cleanly at bottom 15%) */}
          {points.map((d, i) => {
            const x = getX(i);
            const barH = getVolHeight(d.volume);
            const y = height - padding.bottom - barH;
            const barW = Math.max(1.5, (plotWidth / Math.max(1, points.length)) * 0.6);
            return (
              <rect
                key={`vol-${i}`}
                x={x - barW / 2}
                y={y}
                width={barW}
                height={barH}
                fill="url(#volGradient)"
                rx="0.5"
              />
            );
          })}

          {/* Line & Gradient Area View */}
          {chartType === 'area' && areaPath && (
            <>
              <path d={areaPath} fill={`url(#${primaryGradientId})`} />
              <path
                d={linePath}
                fill="none"
                stroke={primaryColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Candlestick Mode */}
          {chartType === 'candlestick' &&
            points.map((d, i) => {
              const x = getX(i);
              const candleUp = d.close >= d.open;
              const candleColor = candleUp ? '#10b981' : '#ef4444';
              const highY = getY(d.high);
              const lowY = getY(d.low);
              const openY = getY(d.open);
              const closeY = getY(d.close);
              const bodyTop = Math.min(openY, closeY);
              const bodyH = Math.max(1.5, Math.abs(closeY - openY));
              const candleW = Math.max(2, (plotWidth / Math.max(1, points.length)) * 0.7);

              return (
                <g key={`candle-${i}`}>
                  {/* High-Low Wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={candleColor}
                    strokeWidth="1.2"
                  />
                  {/* Open-Close Body */}
                  <rect
                    x={x - candleW / 2}
                    y={bodyTop}
                    width={candleW}
                    height={bodyH}
                    fill={candleColor}
                    rx="0.5"
                  />
                </g>
              );
            })}

          {/* Technical Indicators: SMA 50 (Sky) and SMA 200 (Amber) */}
          {showSMA && (
            <>
              {sma50Path && (
                <path
                  d={sma50Path}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                  opacity="0.9"
                />
              )}
              {sma200Path && (
                <path
                  d={sma200Path}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  opacity="0.85"
                />
              )}
            </>
          )}

          {/* Date Axis Markers */}
          {points.map((d, i) => {
            const step = Math.max(1, Math.floor(points.length / 6));
            if (i % step === 0 || i === points.length - 1) {
              const x = getX(i);
              return (
                <text
                  key={`date-${i}`}
                  x={x}
                  y={height - padding.bottom + 18}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="Inter, sans-serif"
                  textAnchor="middle"
                >
                  {d.date}
                </text>
              );
            }
            return null;
          })}

          {/* Invisible interactive vertical hit-zones for razor-sharp mouse tracking */}
          {points.map((_, i) => {
            const x = getX(i);
            const colW = plotWidth / Math.max(1, points.length);
            return (
              <rect
                key={`hit-${i}`}
                x={x - colW / 2}
                y={padding.top}
                width={colW}
                height={plotHeight}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(i)}
                className="cursor-crosshair"
              />
            );
          })}

          {/* Crosshair Guide & Tracking Indicator */}
          {hoveredIndex !== null && points[hoveredIndex] && (
            <g>
              <line
                x1={getX(hoveredIndex)}
                y1={padding.top}
                x2={getX(hoveredIndex)}
                y2={height - padding.bottom}
                stroke="#94a3b8"
                strokeDasharray="2 2"
                strokeWidth="1"
                opacity="0.75"
              />
              <circle
                cx={getX(hoveredIndex)}
                cy={getY(points[hoveredIndex].close)}
                r="4.5"
                fill={primaryColor}
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Hover Tooltip Overlay Card */}
        {activePoint && hoveredIndex !== null && (
          <div className="absolute top-3 left-4 bg-slate-950/95 border border-slate-700/80 p-3 rounded-lg shadow-2xl text-xs space-y-1.5 font-mono pointer-events-none z-10 min-w-[210px]">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px]">
              <span className="text-slate-300 font-sans font-semibold">{activePoint.date}</span>
              <span className="text-slate-400 font-mono">Index #{hoveredIndex + 1}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
              <div>
                <span className="text-slate-400">Open:</span> <span className="text-white font-medium">${activePoint.open.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-400">Close:</span> <span className="text-white font-bold">${activePoint.close.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-400">High:</span> <span className="text-emerald-400 font-medium">${activePoint.high.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-400">Low:</span> <span className="text-red-400 font-medium">${activePoint.low.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
              <span>Vol: {(activePoint.volume / 1e6).toFixed(2)}M</span>
              {activePoint.sma50 && <span className="text-sky-400 font-mono">SMA50: ${activePoint.sma50.toFixed(2)}</span>}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Technical Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>Bullish Session</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
            <span>Bearish Session</span>
          </div>
          {showSMA && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="h-0.5 w-3.5 bg-sky-400"></span>
                <span>SMA 50</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-0.5 w-3.5 bg-amber-400"></span>
                <span>SMA 200</span>
              </div>
            </>
          )}
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          Exchange: {chartResult?.exchangeName || 'NASDAQ / NYSE'} • Currency: {chartResult?.currency || 'USD'} • Real-Time Yahoo API Telemetry
        </div>
      </div>
    </div>
  );
};
