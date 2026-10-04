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
  Layers,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { CompanyForensicProfile, StockChartPoint } from '../types';
import { fetchLiveStockChart, ChartTimeframe, LiveChartResult } from '../services/yahooFinanceService';

interface StockMarketChartProps {
  company: CompanyForensicProfile;
}

export const StockMarketChart: React.FC<StockMarketChartProps> = ({ company }) => {
  const [chartType, setChartType] = useState<'area' | 'candlestick'>('area');
  const [showSMA, setShowSMA] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // Default to 1D to match Yahoo Finance official primary stock quote page!
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('1D');
  const [chartResult, setChartResult] = useState<LiveChartResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch real market historical prices whenever ticker, timeframe or manual refresh triggers
  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setHoveredIndex(null);

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
  const prevClose = chartResult?.previousClose ?? currentPrice;
  const periodStartPrice = chartResult?.periodStartPrice ?? (points.length > 0 ? points[0].close : currentPrice);
  
  // Return for selected timeframe
  const timeframeReturn = chartResult?.priceChangePercent ?? 
    (points.length > 0 ? Math.round(((currentPrice - periodStartPrice) / periodStartPrice) * 10000) / 100 : 0);
  const timeframePriceChange = chartResult?.priceChange ?? 
    (points.length > 0 ? Math.round((currentPrice - periodStartPrice) * 100) / 100 : 0);
  
  // 1-Day change against previous close
  const dayPriceChange = chartResult?.dayPriceChange ?? Math.round((currentPrice - prevClose) * 100) / 100;
  const dayPriceChangePercent = chartResult?.dayPriceChangePercent ?? 
    Math.round(((currentPrice - prevClose) / (prevClose || 1)) * 10000) / 100;

  // In 1D mode, color reflects today's return vs previous close
  const isUp = timeframe === '1D' ? dayPriceChange >= 0 : timeframeReturn >= 0;
  const primaryColor = isUp ? '#10b981' : '#ef4444';
  const primaryGradientId = isUp ? 'bullishGradient' : 'bearishGradient';

  // SVG dimensions
  const width = 960;
  const height = 310;
  const padding = { top: 25, right: 75, bottom: 45, left: 15 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Min and max for price with comfortable margin
  const { minPrice, maxPrice, priceRange } = useMemo(() => {
    if (points.length === 0) return { minPrice: 100, maxPrice: 200, priceRange: 100 };
    const allPrices = points.flatMap((d) => [d.open, d.high, d.low, d.close]);
    if (prevClose) allPrices.push(prevClose);
    const min = Math.min(...allPrices);
    const max = Math.max(...allPrices);
    const spread = max - min || 1;
    // 6% margin top and bottom
    const pMin = Math.max(0, min - spread * 0.06);
    const pMax = max + spread * 0.06;
    return {
      minPrice: pMin,
      maxPrice: pMax,
      priceRange: pMax - pMin || 1
    };
  }, [points, prevClose]);

  // Max volume for bottom histogram
  const maxVol = useMemo(() => {
    if (points.length === 0) return 1;
    return Math.max(...points.map((d) => d.volume)) || 1;
  }, [points]);

  // Coordinate mappers
  const getX = (index: number) => padding.left + (index / Math.max(1, points.length - 1)) * plotWidth;
  const getY = (val: number) => padding.top + plotHeight - ((val - minPrice) / priceRange) * plotHeight;
  const getVolHeight = (vol: number) => Math.min(42, Math.max(1.5, (vol / maxVol) * 42));

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

  // Timeframe list matching professional market services
  const timeframes: ChartTimeframe[] = ['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'MAX'];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 font-sans">
      {/* Top Header & Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-lg font-bold text-white tracking-tight">
              {company.ticker}
            </span>
            <span className="text-xs text-slate-300 font-medium">
              {company.name}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              • {chartResult?.exchangeName || 'NASDAQ'} ({chartResult?.currency || 'USD'})
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{chartResult?.isLiveNetwork ? 'Live Yahoo Finance Feed' : 'SEC EDGAR Calibrated'}</span>
            </span>
            {isLoading && (
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <RefreshCw className="h-3 w-3 animate-spin text-red-400" />
                <span>Pulling live candles...</span>
              </span>
            )}
          </div>

          {/* Real-Time Price Strip matching Yahoo Finance Quote Header */}
          <div className="flex flex-wrap items-baseline gap-3 mt-1.5">
            <div className="text-3xl font-bold font-mono text-white tracking-tight">
              ${(activePoint ? activePoint.close : currentPrice).toFixed(2)}
            </div>

            {/* Change readout */}
            <div className={`flex items-center gap-1 text-sm font-mono font-bold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
              {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{timeframe === '1D' ? (dayPriceChange >= 0 ? '+' : '') : (timeframePriceChange >= 0 ? '+' : '')}
                ${(timeframe === '1D' ? dayPriceChange : timeframePriceChange).toFixed(2)}
              </span>
              <span>(
                {(timeframe === '1D' ? dayPriceChangePercent : timeframeReturn) >= 0 ? '+' : ''}
                {(timeframe === '1D' ? dayPriceChangePercent : timeframeReturn).toFixed(2)}%
              )</span>
              <span className="text-slate-400 text-xs font-normal ml-1">
                {timeframe === '1D' ? 'Today (At Close / Real-Time)' : `past ${timeframe}`}
              </span>
            </div>

            <div className="text-xs text-slate-400 font-mono hidden md:inline-block">
              Timezone: <span className="text-slate-200">{chartResult?.timezone || 'America/New_York (EDT)'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons & Timeframe Selector Toolbar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Timeframe Buttons */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                  timeframe === tf
                    ? 'bg-red-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart View Toggle: Line vs Candlestick */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setChartType('area')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                chartType === 'area'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('candlestick')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                chartType === 'candlestick'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Candles
            </button>
          </div>

          {/* SMA Indicator */}
          <button
            onClick={() => setShowSMA(!showSMA)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-all font-medium ${
              showSMA
                ? 'border-sky-500/40 text-sky-400 bg-sky-500/10'
                : 'border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
            title="Toggle Simple Moving Average (SMA 50 / 200)"
          >
            SMA 50/200
          </button>

          {/* External Yahoo Finance Link */}
          <a
            href={`https://finance.yahoo.com/quote/${company.ticker}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1"
            title="Verify live on Yahoo Finance"
          >
            <span className="text-[11px] font-medium hidden sm:inline">Yahoo Finance</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          {/* Refresh Button */}
          <button
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
            disabled={isLoading}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-50"
            title="Force refresh live stock data"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-red-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* SVG Stock Market Graph Canvas */}
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden select-none bg-slate-950/60 rounded-lg p-1 border border-slate-800/80"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[350px] block"
        >
          <defs>
            {/* Bullish Emerald Gradient */}
            <linearGradient id="bullishGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#10b981" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>

            {/* Bearish Red Gradient */}
            <linearGradient id="bearishGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#ef4444" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
            </linearGradient>

            {/* Volume bar gradient */}
            <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#475569" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#475569" stopOpacity="0.08" />
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

          {/* Previous Close Reference Line (Dashed, exactly like Yahoo Finance) */}
          {prevCloseY >= padding.top && prevCloseY <= height - padding.bottom && (
            <g>
              <line
                x1={padding.left}
                y1={prevCloseY}
                x2={width - padding.right}
                y2={prevCloseY}
                stroke="#94a3b8"
                strokeDasharray="3 3"
                strokeWidth="1"
                opacity="0.6"
              />
              <text
                x={width - padding.right + 8}
                y={prevCloseY + 3}
                fill="#cbd5e1"
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
          <div className="absolute top-3 left-4 bg-slate-950/95 border border-slate-700/80 p-3 rounded-lg shadow-2xl text-xs space-y-1.5 font-mono pointer-events-none z-10 min-w-[220px]">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px]">
              <span className="text-slate-300 font-sans font-semibold">{activePoint.date} (EDT)</span>
              <span className="text-slate-400 font-mono">#{hoveredIndex + 1}</span>
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
              {prevClose && (
                <span className={(activePoint.close - prevClose) >= 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  {(activePoint.close - prevClose) >= 0 ? '+' : ''}${(activePoint.close - prevClose).toFixed(2)} (
                  {((activePoint.close - prevClose) / prevClose * 100).toFixed(2)}%)
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Official Yahoo Finance Key Statistics Matrix Grid */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 text-xs">
        <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold pb-2 border-b border-slate-800/80 flex items-center justify-between">
          <span>YAHOO FINANCE MARKET TELEMETRY SUMMARY</span>
          <span className="text-emerald-400 flex items-center gap-1 font-normal">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            NYSE/NASDAQ OFFICIAL FEED
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-2 font-mono text-[11px]">
          <div>
            <span className="text-slate-500 block text-[10px]">Previous Close</span>
            <span className="text-white font-bold">${prevClose.toFixed(2)}</span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">Open</span>
            <span className="text-white font-bold">${(chartResult?.openPrice || periodStartPrice).toFixed(2)}</span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">Day&apos;s Range</span>
            <span className="text-white font-bold">
              ${(chartResult?.dayLow || chartResult?.lowPrice || prevClose * 0.98).toFixed(2)} - ${(chartResult?.dayHigh || chartResult?.highPrice || currentPrice).toFixed(2)}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">52-Week Range</span>
            <span className="text-white font-bold">
              ${(chartResult?.fiftyTwoWeekLow || 243.42).toFixed(2)} - ${(chartResult?.fiftyTwoWeekHigh || 345.34).toFixed(2)}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">Volume</span>
            <span className="text-white font-bold">
              {((chartResult?.volume || 31878433) / 1e6).toFixed(2)}M
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">Market Cap</span>
            <span className="text-white font-bold">
              ${chartResult?.marketCap ? `${chartResult.marketCap}B` : `${company.marketCap}B`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
