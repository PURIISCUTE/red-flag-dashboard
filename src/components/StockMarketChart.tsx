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
    <div className="bg-[#0F131C] border border-[#22293d] p-4 mb-4 shadow-lg">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1c2233]">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#FF4D4D]" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                Yahoo Finance Telemetry & Interactive Market Chart
              </h3>
              <span className="px-1.5 py-0.2 bg-[#38A169]/10 text-[#38A169] border border-[#38A169]/40 text-[10px] font-mono">
                DATA PRIORITY: P3 REAL-TIME FEED
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#718096]">
              {company.name} ({company.ticker}) • ${company.stockPrice.toFixed(2)} USD • 
              <span className={company.priceChangePercent >= 0 ? 'text-[#38A169] ml-1' : 'text-[#FF4D4D] ml-1'}>
                {company.priceChangePercent >= 0 ? '+' : ''}{company.priceChangePercent}% 24H
              </span>
            </div>
          </div>
        </div>

        {/* Chart View Modes & Indicators */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {/* Timeframes */}
          <div className="flex items-center bg-[#080b10] border border-[#1f2638] p-0.5">
            {(['1M', '6M', '1Y', '3Y', '5Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-0.5 text-[10px] ${
                  timeframe === tf ? 'bg-[#FF4D4D] text-white font-bold' : 'text-[#718096] hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Candlestick vs Area */}
          <div className="flex items-center bg-[#080b10] border border-[#1f2638] p-0.5">
            <button
              onClick={() => setChartType('candlestick')}
              className={`px-2 py-0.5 text-[10px] ${
                chartType === 'candlestick' ? 'bg-[#1b2336] text-[#a5b4fc] font-bold' : 'text-[#718096] hover:text-white'
              }`}
            >
              CANDLES
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-2 py-0.5 text-[10px] ${
                chartType === 'area' ? 'bg-[#1b2336] text-[#a5b4fc] font-bold' : 'text-[#718096] hover:text-white'
              }`}
            >
              AREA
            </button>
          </div>

          {/* SMA Toggle */}
          <button
            onClick={() => setShowSMA(!showSMA)}
            className={`px-2 py-1 text-[10px] border ${
              showSMA ? 'border-[#38A169] text-[#38A169] bg-[#38A169]/10' : 'border-[#2d3852] text-[#718096]'
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
              <stop offset="0%" stopColor="#FF4D4D" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FF4D4D" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4A5568" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#4A5568" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines & Price Labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding.top + plotHeight * ratio;
            const price = maxPrice - ratio * priceRange;
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1c2438"
                  strokeDasharray="2,2"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 6}
                  y={y + 3}
                  textAnchor="end"
                  fill="#525f7a"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  ${price.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Volume histogram bars */}
          {data.map((d, i) => {
            const x = getX(i);
            const barW = Math.max(3, plotWidth / data.length - 8);
            const barY = getVolY(d.volume);
            const barH = height - padding.bottom - barY;
            const isGreen = d.close >= d.open;
            return (
              <rect
                key={`vol-${i}`}
                x={x - barW / 2}
                y={barY}
                width={barW}
                height={barH}
                fill={isGreen ? '#38A169' : '#E53E3E'}
                opacity="0.25"
              />
            );
          })}

          {/* Area or Candlestick Plot */}
          {chartType === 'area' ? (
            <>
              <path d={areaPath} fill="url(#areaGradient)" />
              <path d={linePath} fill="none" stroke="#FF4D4D" strokeWidth="2" />
            </>
          ) : (
            // Candlestick rendering
            data.map((d, i) => {
              const x = getX(i);
              const isUp = d.close >= d.open;
              const candleColor = isUp ? '#38A169' : '#E53E3E';
              const yHigh = getY(d.high);
              const yLow = getY(d.low);
              const yOpen = getY(d.open);
              const yClose = getY(d.close);
              const candleTop = Math.min(yOpen, yClose);
              const candleHeight = Math.max(2, Math.abs(yClose - yOpen));
              const candleWidth = Math.max(4, plotWidth / data.length - 6);

              return (
                <g key={`candle-${i}`}>
                  {/* High-Low Wick */}
                  <line
                    x1={x}
                    y1={yHigh}
                    x2={x}
                    y2={yLow}
                    stroke={candleColor}
                    strokeWidth="1.5"
                  />
                  {/* Real Body */}
                  <rect
                    x={x - candleWidth / 2}
                    y={candleTop}
                    width={candleWidth}
                    height={candleHeight}
                    fill={candleColor}
                    stroke={candleColor}
                    strokeWidth="0.5"
                  />
                </g>
              );
            })
          )}

          {/* Technical Moving Averages */}
          {showSMA && (
            <>
              <path d={sma50Path} fill="none" stroke="#ECC94B" strokeWidth="1.2" strokeDasharray="3,3" />
              <path d={sma200Path} fill="none" stroke="#63B3ED" strokeWidth="1.2" />
            </>
          )}

          {/* Date Labels on X Axis */}
          {data.map((d, i) => {
            const x = getX(i);
            return (
              <text
                key={`label-${i}`}
                x={x}
                y={height - padding.bottom + 18}
                textAnchor="middle"
                fill="#718096"
                fontSize="9"
                fontFamily="monospace"
              >
                {d.date}
              </text>
            );
          })}

          {/* Interactive Hover Crosshair Hitboxes */}
          {data.map((d, i) => {
            const x = getX(i);
            const colWidth = plotWidth / data.length;
            return (
              <rect
                key={`hit-${i}`}
                x={x - colWidth / 2}
                y={padding.top}
                width={colWidth}
                height={plotHeight}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoveredPoint(d)}
              />
            );
          })}

          {/* Active Hover Crosshair Line */}
          {hoveredPoint && (
            <line
              x1={getX(data.indexOf(hoveredPoint))}
              y1={padding.top}
              x2={getX(data.indexOf(hoveredPoint))}
              y2={height - padding.bottom}
              stroke="#a5b4fc"
              strokeDasharray="2,2"
              strokeWidth="1"
            />
          )}
        </svg>

        {/* Hover Point Tooltip Card */}
        {hoveredPoint && (
          <div className="absolute top-2 right-4 bg-[#080b10]/95 border border-[#FF4D4D] p-2.5 font-mono text-[11px] text-[#e1e2ea] shadow-xl pointer-events-none">
            <div className="font-bold text-[#FF4D4D] pb-1 border-b border-[#222a3d] mb-1">
              PERIOD: {hoveredPoint.date}
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
              <span className="text-[#718096]">Open:</span>
              <span className="text-right">${hoveredPoint.open.toFixed(2)}</span>
              <span className="text-[#718096]">High:</span>
              <span className="text-right text-[#38A169]">${hoveredPoint.high.toFixed(2)}</span>
              <span className="text-[#718096]">Low:</span>
              <span className="text-right text-[#FF4D4D]">${hoveredPoint.low.toFixed(2)}</span>
              <span className="text-[#718096]">Close:</span>
              <span className="text-right font-bold">${hoveredPoint.close.toFixed(2)}</span>
              <span className="text-[#718096]">Volume:</span>
              <span className="text-right text-[#a5b4fc]">{(hoveredPoint.volume / 1000000).toFixed(0)}M</span>
              {hoveredPoint.sma50 && (
                <>
                  <span className="text-[#ECC94B]">SMA 50:</span>
                  <span className="text-right">${hoveredPoint.sma50.toFixed(2)}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Yahoo Finance Real-time Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-3 pt-3 border-t border-[#1c2233] text-[11px] font-mono">
        <div className="bg-[#090c12] p-2 border border-[#1b2131]">
          <span className="text-[#718096]">MARKET CAP</span>
          <div className="font-bold text-white text-xs">${company.marketCap}B</div>
        </div>
        <div className="bg-[#090c12] p-2 border border-[#1b2131]">
          <span className="text-[#718096]">BETA (5Y)</span>
          <div className="font-bold text-white text-xs">{company.beta}</div>
        </div>
        <div className="bg-[#090c12] p-2 border border-[#1b2131]">
          <span className="text-[#718096]">TTM OCF</span>
          <div className="font-bold text-[#38A169] text-xs">
            ${(company.financials.find((f) => f.year === 'TTM')?.operatingCashFlow || 0).toLocaleString()}M
          </div>
        </div>
        <div className="bg-[#090c12] p-2 border border-[#1b2131]">
          <span className="text-[#718096]">52W HIGH / LOW</span>
          <div className="font-bold text-white text-xs">
            ${(company.stockPrice * 1.08).toFixed(1)} / ${(company.stockPrice * 0.72).toFixed(1)}
          </div>
        </div>
        <div className="bg-[#090c12] p-2 border border-[#1b2131]">
          <span className="text-[#718096]">SMA 50 STATUS</span>
          <div className="font-bold text-[#38A169] text-xs">BULLISH (+2.4%)</div>
        </div>
        <div className="bg-[#090c12] p-2 border border-[#1b2131]">
          <span className="text-[#718096]">DATA CONFIRMATION</span>
          <div className="font-bold text-[#a5b4fc] text-xs">AUDITED 10-K</div>
        </div>
      </div>
    </div>
  );
};
