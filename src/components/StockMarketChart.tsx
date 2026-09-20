import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart2, 
  Activity, 
  SlidersHorizontal,
  Maximize2
} from 'lucide-react';
import { CompanyForensicProfile, StockChartPoint } from '../types';

interface StockMarketChartProps {
  company: CompanyForensicProfile;
}

export const StockMarketChart: React.FC<StockMarketChartProps> = ({ company }) => {
  const [chartType, setChartType] = useState<'area' | 'candlestick'>('candlestick');
  const [showSMA, setShowSMA] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<StockChartPoint | null>(null);
  const [timeframe, setTimeframe] = useState<'1M' | '6M' | '1Y' | '3Y' | '5Y'>('3Y');

  const data = company.chartData;
  if (!data || data.length === 0) return null;

  // Chart dimensions
  const width = 880;
  const height = 260;
  const padding = { top: 20, right: 30, bottom: 45, left: 45 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Min and max for price
  const allPrices = data.flatMap((d) => [d.open, d.high, d.low, d.close]);
  const minPrice = Math.min(...allPrices) * 0.95;
  const maxPrice = Math.max(...allPrices) * 1.05;
  const priceRange = maxPrice - minPrice || 1;

  // Max volume
  const maxVol = Math.max(...data.map((d) => d.volume)) || 1;

  // Coordinate mappers
  const getX = (index: number) => padding.left + (index / (data.length - 1)) * plotWidth;
  const getY = (val: number) => padding.top + plotHeight - ((val - minPrice) / priceRange) * plotHeight;
  const getVolY = (vol: number) => height - padding.bottom - (vol / maxVol) * 45;

  // Area path generator
  const areaPoints = data.map((d, i) => `${getX(i)},${getY(d.close)}`).join(' ');
  const areaPath = `${areaPoints} L ${getX(data.length - 1)},${height - padding.bottom} L ${getX(0)},${height - padding.bottom} Z`;
  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.close)}`).join(' ');

  // SMA paths
  const sma50Path = data
    .filter((d) => d.sma50 !== undefined)
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.sma50!)}`)
    .join(' ');

  const sma200Path = data
    .filter((d) => d.sma200 !== undefined)
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.sma200!)}`)
    .join(' ');

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <TrendingUp className="h-4 w-4 text-red-400" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold text-white">
                Market Price History &amp; Volume Telemetry
              </h3>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded font-medium">
                Live Feed
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {company.name} ({company.ticker}) • ${company.stockPrice.toFixed(2)} USD · 
              <span className={company.priceChangePercent >= 0 ? 'text-emerald-400 ml-1 font-medium font-mono' : 'text-red-400 ml-1 font-medium font-mono'}>
                {company.priceChangePercent >= 0 ? '+' : ''}{company.priceChangePercent}% 24h
              </span>
            </div>
          </div>
        </div>

        {/* Chart View Modes & Indicators */}
        <div className="flex items-center gap-2 text-xs">
          {/* Timeframes */}
          <div className="flex items-center bg-slate-950/60 border border-slate-800 p-0.5 rounded-lg">
            {(['1M', '6M', '1Y', '3Y', '5Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-xs rounded transition-all font-medium ${
                  timeframe === tf ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Candlestick vs Area */}
          <div className="flex items-center bg-slate-950/60 border border-slate-800 p-0.5 rounded-lg">
            <button
              onClick={() => setChartType('candlestick')}
              className={`px-2.5 py-1 text-xs rounded transition-all font-medium ${
                chartType === 'candlestick' ? 'bg-slate-800 text-slate-200' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Candles
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-2.5 py-1 text-xs rounded transition-all font-medium ${
                chartType === 'area' ? 'bg-slate-800 text-slate-200' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Line
            </button>
          </div>

          {/* SMA Toggle */}
          <button
            onClick={() => setShowSMA(!showSMA)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-all font-medium ${
              showSMA ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' : 'border-slate-800 text-slate-500'
            }`}
          >
            SMA 50/200
          </button>
        </div>
      </div>

      {/* SVG Interactive Chart Canvas */}
      <div className="relative mt-3 w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[300px] select-none"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#64748b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#64748b" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = padding.top + plotHeight * pct;
            const priceVal = maxPrice - pct * priceRange;
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="Inter, sans-serif"
                  textAnchor="end"
                >
                  ${priceVal.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Volume bars */}
          {data.map((d, i) => {
            const x = getX(i);
            const y = getVolY(d.volume);
            const barH = height - padding.bottom - y;
            const barW = Math.max(2, (plotWidth / data.length) * 0.5);
            return (
              <rect
                key={`vol-${i}`}
                x={x - barW / 2}
                y={y}
                width={barW}
                height={barH}
                fill="url(#volGradient)"
              />
            );
          })}

          {/* Area Chart Mode */}
          {chartType === 'area' && (
            <>
              <path d={areaPath} fill="url(#areaGradient)" />
              <path
                d={linePath}
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Candlestick Mode */}
          {chartType === 'candlestick' &&
            data.map((d, i) => {
              const x = getX(i);
              const isUp = d.close >= d.open;
              const candleColor = isUp ? '#10b981' : '#ef4444';
              const highY = getY(d.high);
              const lowY = getY(d.low);
              const openY = getY(d.open);
              const closeY = getY(d.close);
              const bodyTop = Math.min(openY, closeY);
              const bodyH = Math.max(2, Math.abs(closeY - openY));
              const candleW = Math.max(3, (plotWidth / data.length) * 0.65);

              return (
                <g key={`candle-${i}`}>
                  {/* Wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={candleColor}
                    strokeWidth="1.2"
                  />
                  {/* Body */}
                  <rect
                    x={x - candleW / 2}
                    y={bodyTop}
                    width={candleW}
                    height={bodyH}
                    fill={candleColor}
                    rx="1"
                  />
                </g>
              );
            })}

          {/* SMAs */}
          {showSMA && (
            <>
              {sma50Path && (
                <path
                  d={sma50Path}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
              )}
              {sma200Path && (
                <path
                  d={sma200Path}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
              )}
            </>
          )}

          {/* Date labels on X-axis */}
          {data.map((d, i) => {
            if (i % Math.floor(data.length / 6) === 0 || i === data.length - 1) {
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
                  {d.date.slice(5)}
                </text>
              );
            }
            return null;
          })}

          {/* Invisible hover zones */}
          {data.map((d, i) => {
            const x = getX(i);
            const colW = plotWidth / data.length;
            return (
              <rect
                key={`hit-${i}`}
                x={x - colW / 2}
                y={padding.top}
                width={colW}
                height={plotHeight}
                fill="transparent"
                onMouseEnter={() => setHoveredPoint(d)}
                className="cursor-crosshair"
              />
            );
          })}

          {/* Hover highlight line */}
          {hoveredPoint && (
            <line
              x1={getX(data.findIndex((p) => p.date === hoveredPoint.date))}
              y1={padding.top}
              x2={getX(data.findIndex((p) => p.date === hoveredPoint.date))}
              y2={height - padding.bottom}
              stroke="#94a3b8"
              strokeDasharray="2 2"
              strokeWidth="1"
            />
          )}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div className="absolute top-2 right-4 bg-slate-950/95 border border-slate-800 p-2.5 rounded-lg shadow-xl text-xs space-y-1 font-mono pointer-events-none">
            <div className="text-slate-400 font-sans font-medium text-[11px] pb-1 border-b border-slate-800">
              {hoveredPoint.date}
            </div>
            <div className="grid grid-cols-2 gap-x-3 text-[11px]">
              <div>Open: <span className="text-white">${hoveredPoint.open.toFixed(2)}</span></div>
              <div>High: <span className="text-emerald-400">${hoveredPoint.high.toFixed(2)}</span></div>
              <div>Low: <span className="text-red-400">${hoveredPoint.low.toFixed(2)}</span></div>
              <div>Close: <span className="text-white">${hoveredPoint.close.toFixed(2)}</span></div>
            </div>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
              Vol: {(hoveredPoint.volume / 1e6).toFixed(1)}M shares
            </div>
          </div>
        )}
      </div>

      {/* Legend strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 mt-2 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>Bullish Close</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
            <span>Bearish Close</span>
          </div>
          {showSMA && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="h-0.5 w-3 bg-sky-400"></span>
                <span>SMA 50</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-0.5 w-3 bg-amber-400"></span>
                <span>SMA 200</span>
              </div>
            </>
          )}
        </div>
        <div className="text-[11px] text-slate-500">
          Source: Real-time Yahoo Finance Market Data
        </div>
      </div>
    </div>
  );
};
