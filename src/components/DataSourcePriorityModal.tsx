import React from 'react';
import { X, Layers, CheckCircle2, ShieldCheck, Database, Globe, Cpu } from 'lucide-react';

interface DataSourcePriorityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataSourcePriorityModal: React.FC<DataSourcePriorityModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0F131C] border border-[#FF4D4D] w-full max-w-3xl max-h-[90vh] overflow-y-auto p-5 shadow-2xl relative font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#222a3d] mb-4">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-[#FF4D4D]" />
            <h2 className="text-sm font-bold text-white tracking-wider uppercase">
              Autonomous AI Data Pipeline Priority Routing
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#718096] hover:text-white p-1 bg-[#1b2233]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-[#a0aec0] mb-4 font-sans text-xs leading-relaxed">
          The RedFlag Terminal Autonomous AI Agent enforces a strict mathematical priority cascade to prevent hallucinatory or jittery scores. All forensic heuristic algorithms query the highest available authoritative tier.
        </p>

        {/* 4 Priority Tiers */}
        <div className="space-y-3">
          {/* Priority 1 */}
          <div className="p-3 bg-[#080b10] border-l-4 border-[#38A169] border-y border-r border-[#1e2538]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-[#38A169] text-xs flex items-center gap-1.5">
                <Database className="h-4 w-4" />
                PRIORITY 1 (PRIMARY GROUND TRUTH): SEC EDGAR API
              </span>
              <span className="px-1.5 py-0.2 bg-[#38A169]/15 text-[#38A169] text-[10px] font-bold">
                AUDITED TRUTH
              </span>
            </div>
            <p className="text-[#cbd5e1] font-sans text-xs leading-relaxed">
              Direct XBRL JSON fact ingestion from official SEC 10-K and 10-Q filing disclosures. Powers audited historical balance sheets, ASC 606 revenue contracts, ASC 842 lease schedules, and cash flow conversion.
            </p>
            <div className="mt-2 text-[10px] text-[#718096]">
              Headers: <code className="text-[#a5b4fc]">User-Agent: RedFlagTerminal forensic@redflagterminal.com</code> • Source: <code className="text-[#a5b4fc]">data.sec.gov/api/xbrl/companyfacts/</code>
            </div>
          </div>

          {/* Priority 2 */}
          <div className="p-3 bg-[#080b10] border-l-4 border-[#FF4D4D] border-y border-r border-[#1e2538]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-[#FF4D4D] text-xs flex items-center gap-1.5">
                <Cpu className="h-4 w-4" />
                PRIORITY 2 (FORENSIC RULE PRIORITY): 210-FLAG HEURISTIC ENGINES
              </span>
              <span className="px-1.5 py-0.2 bg-[#FF4D4D]/15 text-[#FF4D4D] text-[10px] font-bold">
                DETERMINISTIC LOGIC
              </span>
            </div>
            <p className="text-[#cbd5e1] font-sans text-xs leading-relaxed">
              Executes mathematically bound heuristic algorithms directly against Priority 1 SEC XBRL metrics. Computes Beneish M-Score, Altman Z-Score, Sloan Accrual Ratio, and 30 industry-specific flags across all 7 lenses.
            </p>
            <div className="mt-2 text-[10px] text-[#718096]">
              Execution: Zero-jitter calculation • Guaranteed identical score per audited filing period.
            </div>
          </div>

          {/* Priority 3 */}
          <div className="p-3 bg-[#080b10] border-l-4 border-[#ECC94B] border-y border-r border-[#1e2538]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-[#ECC94B] text-xs flex items-center gap-1.5">
                <Globe className="h-4 w-4" />
                PRIORITY 3 (MARKET DATA AUGMENTATION): YAHOO FINANCE API
              </span>
              <span className="px-1.5 py-0.2 bg-[#ECC94B]/15 text-[#ECC94B] text-[10px] font-bold">
                REAL-TIME TELEMETRY
              </span>
            </div>
            <p className="text-[#cbd5e1] font-sans text-xs leading-relaxed">
              Provides real-time equity market capitalization, trailing twelve months (TTM) income adjustments between filing cycles, stock price volatility (Beta), and historical candlestick price history for chart rendering.
            </p>
            <div className="mt-2 text-[10px] text-[#718096]">
              Endpoint: <code className="text-[#a5b4fc]">query1.finance.yahoo.com/v8/finance/chart</code> • Library: <code className="text-[#a5b4fc]">yfinance</code>
            </div>
          </div>

          {/* Priority 4 */}
          <div className="p-3 bg-[#080b10] border-l-4 border-[#63B3ED] border-y border-r border-[#1e2538]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-[#63B3ED] text-xs flex items-center gap-1.5">
                <Database className="h-4 w-4" />
                PRIORITY 4 (FALLBACK & HISTORICAL BENCHMARKING): KAGGLE DATASETS API
              </span>
              <span className="px-1.5 py-0.2 bg-[#63B3ED]/15 text-[#63B3ED] text-[10px] font-bold">
                SECTOR DISTRIBUTIONS
              </span>
            </div>
            <p className="text-[#cbd5e1] font-sans text-xs leading-relaxed">
              Supplies cross-sectional fraud distributions, peer industry quartile cutoffs (P25, P50, P75, P90), and historical accounting fraud benchmarks (Enron, WorldCom, Wirecard, Silicon Valley Bank).
            </p>
            <div className="mt-2 text-[10px] text-[#718096]">
              API Config: <code className="text-[#a5b4fc]">KAGGLE_USERNAME</code> & <code className="text-[#a5b4fc]">KAGGLE_KEY</code> • Dataset: <code className="text-[#a5b4fc]">kaggle/financial-fraud-detection-benchmark</code>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-[#1c2233] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#FF4D4D] text-white font-bold hover:bg-[#e53e3e]"
          >
            CONFIRM & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
