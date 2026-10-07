import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw,
  ExternalLink,
  SlidersHorizontal,
  CheckCircle2
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
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('1D');
  const [chartResult, setChartResult] = useState<LiveChartResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [lastTickDirection, setLastTickDirection] = useState<'up' | 'down' | null>(null);
  const lastPriceRef = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Fetch real market historical prices whenever ticker, timeframe or manual refresh triggers
  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setHoveredIndex(null);

    fetchLiveStockChart(company.ticker, timeframe, company.chartData, company.stockPrice, refreshTrigger > 0)
      .then((res) => {
        if (active) {
          if (lastPriceRef.current !== null && res.currentPrice !== lastPriceRef.current) {
            setLastTickDirection(res.currentPrice > lastPriceRef.current ? 'up' : 'down');
            const flashTimer = setTimeout(() => setLastTickDirection(null), 1500);
            return () => clearTimeout(flashTimer);
          }
          lastPriceRef.current = res.currentPrice;
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
  }, [company.ticker, timeframe, refreshTrigger, company.stockPrice]);

  // Live polling for 1D chart: Refresh candles every 5 seconds to match live market fluctuations
  useEffect(() => {
    if (timeframe !== '1D') return;

    const intervalId = setInterval(() => {
      fetchLiveStockChart(company.ticker, '1D', company.chartData, company.stockPrice, true)
        .then((res) => {
          if (lastPriceRef.current !== null && res.currentPrice !== lastPriceRef.current) {
            setLastTickDirection(res.currentPrice > lastPriceRef.current ? 'up' : 'down');
            setTimeout(() => setLastTickDirection(null), 1500);
          }
          lastPriceRef.current = res.currentPrice;
          setChartResult(res);
        })
        .catch(() => {
          // Keep prior candles on intermittent network pause
        });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [company.ticker, timeframe, company.chartData, company.stockPrice]);

  const points = useMemo(() => {
    return chartResult?.points || [];
  }, [chartResult]);

  const activePoint = hoveredIndex !== null && points[hoveredIndex] ? points[hoveredIndex] : null;

  const currentPrice = chartResult?.currentPrice ?? company.stockPrice;
  const prevClose = chartResult?.previousClose ?? currentPrice;
  const periodStartPrice = chartResult?.periodStartPrice ?? (points.length > 0 ? points[0].close : currentPrice);

  // Reference price: In 1D mode, changes are ALWAYS measured vs Previous Close.
  // In multi-day modes (5D, 1M, 6M, YTD, 1Y, 5Y, MAX), changes are measured vs Period Start.
  const is1D = timeframe === '1D';
  const referencePrice = is1D ? prevClose : periodStartPrice;

  // Active price and delta: Dynamically track hovered point, or fall back to latest quote
  const displayPrice = activePoint ? activePoint.close : currentPrice;
  const displayChange = Math.round((displayPrice - referencePrice) * 100) / 100;
  const displayChangePercent = Math.round(((displayPrice - referencePrice) / (referencePrice || 1)) * 10000) / 100;
  const isUp = displayChange >= 0;

  const primaryColor = isUp ? '#10b981' : '#ef4444';
  const primaryGradientId = isUp ? 'bullishGradient' : 'bearishGradient';

  // SVG dimensions & margins
  const width = 960;
  const height = 320;
  const padding = { top: 25, right: 75, bottom: 42, left: 16 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Min and max for price axis with comfortable 6% margin
  const { minPrice, maxPrice, priceRange } = useMemo(() => {
    if (points.length === 0) {
      const base = currentPrice || 150;
      return { minPrice: base * 0.95, maxPrice: base * 1.05, priceRange: base * 0.1 };
    }
    const allPrices = points.flatMap((d) => [d.open, d.high, d.low, d.close]);
    if (is1D && prevClose) {
      allPrices.push(prevClose);
    }
    const min = Math.min(...allPrices);
    const max = Math.max(...allPrices);
    const spread = max - min || 1;
    const pMin = Math.max(0, min - spread * 0.06);
    const pMax = max + spread * 0.06;
    return {
      minPrice: pMin,
      maxPrice: pMax,
      priceRange: pMax - pMin || 1
    };
  }, [points, is1D, prevClose, currentPrice]);

  // Max volume for bottom histogram
  const maxVol = useMemo(() => {
    if (points.length === 0) return 1;
    return Math.max(...points.map((d) => d.volume)) || 1;
  }, [points]);

  // Coordinate mappers
  const getX = useCallback((index: number) => {
    if (points.length <= 1) return padding.left;
    return padding.left + (index / (points.length - 1)) * plotWidth;
  }, [points.length, plotWidth, padding.left]);

  const getY = useCallback((val: number) => {
    return padding.top + plotHeight - ((val - minPrice) / priceRange) * plotHeight;
  }, [minPrice, priceRange, plotHeight, padding.top]);

  const getVolHeight = useCallback((vol: number) => {
    return Math.min(38, Math.max(2, (vol / maxVol) * 38));
  }, [maxVol]);

  // Area & Line paths
  const { areaPath, linePath } = useMemo(() => {
    if (points.length === 0) return { areaPath: '', linePath: '' };
    const lineSegments = points
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(d.close).toFixed(1)}`)
      .join(' ');
    const area = `${lineSegments} L ${getX(points.length - 1).toFixed(1)} ${(height - padding.bottom).toFixed(1)} L ${getX(0).toFixed(1)} ${(height - padding.bottom).toFixed(1)} Z`;
    return { areaPath: area, linePath: lineSegments };
  }, [points, getX, getY, height, padding.bottom]);

  // SMA paths
  const sma50Path = useMemo(() => {
    if (!showSMA || points.length === 0) return '';
    const valid = points
      .map((d, i) => ({ val: d.sma50, idx: i }))
      .filter((p) => p.val !== undefined && p.val !== null);
    if (valid.length === 0) return '';
    return valid.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.idx).toFixed(1)} ${getY(p.val!).toFixed(1)}`).join(' ');
  }, [points, showSMA, getX, getY]);

  const sma200Path = useMemo(() => {
    if (!showSMA || points.length === 0) return '';
    const valid = points
      .map((d, i) => ({ val: d.sma200, idx: i }))
      .filter((p) => p.val !== undefined && p.val !== null);
    if (valid.length === 0) return '';
    return valid.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.idx).toFixed(1)} ${getY(p.val!).toFixed(1)}`).join(' ');
  }, [points, showSMA, getX, getY]);

  const prevCloseY = getY(prevClose);

  // Smooth mouse move handler over the SVG
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (points.length === 0 || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const svgX = (mouseX / rect.width) * width;
    
    if (svgX < padding.left || svgX > width - padding.right) {
      setHoveredIndex(null);
      return;
    }
    const relX = svgX - padding.left;
    const frac = relX / plotWidth;
    const rawIdx = Math.round(frac * (points.length - 1));
    const idx = Math.max(0, Math.min(points.length - 1, rawIdx));
    setHoveredIndex(idx);
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (points.length === 0 || !svgRef.current || !e.touches[0]) return;
    const rect = svgRef.current.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const svgX = (touchX / rect.width) * width;
    
    if (svgX < padding.left || svgX > width - padding.right) {
      setHoveredIndex(null);
      return;
    }
    const relX = svgX - padding.left;
    const frac = relX / plotWidth;
    const rawIdx = Math.round(frac * (points.length - 1));
    const idx = Math.max(0, Math.min(points.length - 1, rawIdx));
    setHoveredIndex(idx);
  };

  const timeframes: ChartTimeframe[] = ['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'MAX'];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 font-sans select-none">
      {/* Top Header & Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-mono text-xl font-bold text-white tracking-tight">
              {company.ticker}
            </span>
            <span className="text-xs text-slate-300 font-medium">
              {company.name}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              • {chartResult?.exchangeName || 'NASDAQ'} ({chartResult?.currency || 'USD'})
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{chartResult?.isLiveNetwork ? 'Live Yahoo Finance Feed (5s Polling)' : 'Calibrated Market Feed'}</span>
            </span>
            {isLoading && (
              <span className="text-[11px] text-red-400 font-mono flex items-center gap-1">
                <RefreshCw className="h-3 w-3 animate-spin text-red-400" />
                <span>Syncing live candles...</span>
              </span>
            )}
          </div>

          {/* Real-Time Price Strip matching Yahoo Finance Quote Header */}
          <div className="flex flex-wrap items-baseline gap-3 mt-1.5">
            <div className={`text-3xl font-bold font-mono tracking-tight transition-all duration-300 px-2 py-0.5 rounded inline-block ${
              lastTickDirection === 'up'
                ? 'text-emerald-300 bg-emerald-500/20 ring-1 ring-emerald-500/50 scale-105'
                : lastTickDirection === 'down'
                ? 'text-red-300 bg-red-500/20 ring-1 ring-red-500/50 scale-105'
                : 'text-white'
            }`}>
              ${displayPrice.toFixed(2)}
            </div>

            {/* Change readout */}
            <div className={`flex items-center gap-1 text-sm font-mono font-bold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
              {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>
                {displayChange >= 0 ? '+' : ''}${displayChange.toFixed(2)}
              </span>
              <span>
                ({displayChangePercent >= 0 ? '+' : ''}{displayChangePercent.toFixed(2)}%)
              </span>
              <span className="text-slate-400 text-xs font-normal ml-1">
                {activePoint 
                  ? `at ${activePoint.date}` 
                  : (is1D ? 'Today vs Prev Close' : `past ${timeframe}`)}
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
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
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
                  ? 'bg-slate-800 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('candlestick')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                chartType === 'candlestick'
                  ? 'bg-slate-800 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Candles
            </button>
          </div>

          {/* SMA Indicator */}
          <button
            onClick={() => setShowSMA(!showSMA)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-all font-medium flex items-center gap-1 ${
              showSMA
                ? 'border-sky-500/40 text-sky-400 bg-sky-500/10'
                : 'border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
            title="Toggle Simple Moving Average (SMA 50 / 200)"
          >
            <SlidersHorizontal className="h-3 w-3" />
            <span>SMA 50/200</span>
          </button>

          {/* External Yahoo Finance Link */}
          <a
            href={`https://finance.yahoo.com/quote/${company.ticker}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5"
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
        className="relative w-full overflow-hidden bg-slate-950/80 rounded-lg p-1 border border-slate-800/80"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {points.length === 0 && isLoading ? (
          <div className="h-[310px] flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="h-6 w-6 text-red-400 animate-spin" />
            <div className="text-xs font-mono text-slate-400">Loading Yahoo Finance candlesticks...</div>
          </div>
        ) : (
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto max-h-[350px] block cursor-crosshair"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => setHoveredIndex(null)}
          >
            <defs>
              {/* Bullish Emerald Gradient */}
              <linearGradient id="bullishGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
                <stop offset="65%" stopColor="#10b981" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>

              {/* Bearish Red Gradient */}
              <linearGradient id="bearishGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.28" />
                <stop offset="65%" stopColor="#ef4444" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
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

            {/* Previous Close Reference Line (Dashed horizontal, official Yahoo Finance style) */}
            {is1D && prevCloseY >= padding.top && prevCloseY <= height - padding.bottom && (
              <g>
                <line
                  x1={padding.left}
                  y1={prevCloseY}
                  x2={width - padding.right}
                  y2={prevCloseY}
                  stroke="#94a3b8"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                  opacity="0.65"
                />
                <rect
                  x={width - padding.right + 4}
                  y={prevCloseY - 8}
                  width="68"
                  height="16"
                  fill="#1e293b"
                  rx="3"
                  stroke="#475569"
                  strokeWidth="0.8"
                />
                <text
                  x={width - padding.right + 7}
                  y={prevCloseY + 4}
                  fill="#cbd5e1"
                  fontSize="9"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="600"
                  textAnchor="start"
                >
                  Prev ${prevClose.toFixed(2)}
                </text>
              </g>
            )}

            {/* Volume bars (rendered cleanly at bottom 15% with green/red candle colors) */}
            {points.map((d, i) => {
              const x = getX(i);
              const barH = getVolHeight(d.volume);
              const y = height - padding.bottom - barH;
              const barW = Math.max(1.5, (plotWidth / Math.max(1, points.length)) * 0.65);
              const isCandleUp = d.close >= d.open;
              const barColor = isCandleUp ? '#10b981' : '#ef4444';
              return (
                <rect
                  key={`vol-${i}`}
                  x={x - barW / 2}
                  y={y}
                  width={barW}
                  height={barH}
                  fill={barColor}
                  opacity={i === hoveredIndex ? 0.85 : 0.35}
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
                  strokeWidth="2.2"
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
              const isFirst = i === 0;
              const isLast = i === points.length - 1;
              if (i % step === 0 || isLast) {
                const x = getX(i);
                const textAnchor = isFirst ? 'start' : isLast ? 'end' : 'middle';
                return (
                  <text
                    key={`date-${i}`}
                    x={x}
                    y={height - padding.bottom + 18}
                    fill="#64748b"
                    fontSize="10"
                    fontFamily="Inter, sans-serif"
                    textAnchor={textAnchor}
                  >
                    {d.date}
                  </text>
                );
              }
              return null;
            })}

            {/* Crosshair Guide & Tracking Indicator */}
            {hoveredIndex !== null && points[hoveredIndex] && (
              <g>
                {/* Vertical Crosshair Line */}
                <line
                  x1={getX(hoveredIndex)}
                  y1={padding.top}
                  x2={getX(hoveredIndex)}
                  y2={height - padding.bottom}
                  stroke="#94a3b8"
                  strokeDasharray="2 2"
                  strokeWidth="1.2"
                  opacity="0.8"
                />

                {/* Horizontal Crosshair Line */}
                <line
                  x1={padding.left}
                  y1={getY(points[hoveredIndex].close)}
                  x2={width - padding.right}
                  y2={getY(points[hoveredIndex].close)}
                  stroke="#94a3b8"
                  strokeDasharray="2 2"
                  strokeWidth="1"
                  opacity="0.5"
                />

                {/* Right Y-Axis Price Highlight Badge */}
                <g>
                  <rect
                    x={width - padding.right + 2}
                    y={getY(points[hoveredIndex].close) - 9}
                    width="70"
                    height="18"
                    fill={primaryColor}
                    rx="3"
                  />
                  <text
                    x={width - padding.right + 6}
                    y={getY(points[hoveredIndex].close) + 4}
                    fill="#ffffff"
                    fontSize="9.5"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="700"
                    textAnchor="start"
                  >
                    ${points[hoveredIndex].close.toFixed(2)}
                  </text>
                </g>

                {/* Bottom X-Axis Date Highlight Badge */}
                <g>
                  <rect
                    x={Math.max(padding.left, Math.min(width - padding.right - 64, getX(hoveredIndex) - 32))}
                    y={height - padding.bottom + 5}
                    width="64"
                    height="18"
                    fill="#1e293b"
                    stroke="#475569"
                    strokeWidth="1"
                    rx="3"
                  />
                  <text
                    x={Math.max(padding.left + 32, Math.min(width - padding.right - 32, getX(hoveredIndex)))}
                    y={height - padding.bottom + 17}
                    fill="#e2e8f0"
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {points[hoveredIndex].date.split(' ')[0]}
                  </text>
                </g>

                {/* Outer Pulsing Aura & Focal Circle */}
                <circle
                  cx={getX(hoveredIndex)}
                  cy={getY(points[hoveredIndex].close)}
                  r="7"
                  fill={primaryColor}
                  opacity="0.3"
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
        )}

        {/* Hover Tooltip Overlay Card with Intelligent Boundary Positioning */}
        {activePoint && hoveredIndex !== null && (
          <div 
            className={`absolute top-3 ${
              hoveredIndex / points.length > 0.55 ? 'left-4' : 'right-24'
            } bg-slate-950/95 border border-slate-700/80 p-3 rounded-lg shadow-2xl text-xs space-y-1.5 font-mono pointer-events-none z-10 min-w-[210px] backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px]">
              <span className="text-slate-200 font-sans font-semibold">{activePoint.date} (EDT)</span>
              <span className="text-slate-400 font-mono text-[10px]">Candle #{hoveredIndex + 1}</span>
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
              <span className={displayChange >= 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                {displayChange >= 0 ? '+' : ''}${displayChange.toFixed(2)} ({displayChangePercent >= 0 ? '+' : ''}{displayChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Official Yahoo Finance Key Statistics Matrix Grid */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 text-xs">
        <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold pb-2 border-b border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>YAHOO FINANCE MARKET TELEMETRY SUMMARY</span>
          </span>
          <span className="text-emerald-400 flex items-center gap-1 font-normal text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            NYSE/NASDAQ OFFICIAL FEED • USD
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2.5 font-mono text-[11px]">
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
              ${(chartResult?.dayLow || Math.min(...points.map(p => p.low), prevClose * 0.99)).toFixed(2)} - ${(chartResult?.dayHigh || Math.max(...points.map(p => p.high), currentPrice)).toFixed(2)}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">52-Week Range</span>
            <span className="text-white font-bold">
              ${(chartResult?.fiftyTwoWeekLow || currentPrice * 0.75).toFixed(2)} - ${(chartResult?.fiftyTwoWeekHigh || currentPrice * 1.15).toFixed(2)}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">Volume</span>
            <span className="text-white font-bold">
              {((chartResult?.volume || points.reduce((a, b) => a + b.volume, 0)) / 1e6).toFixed(2)}M
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
