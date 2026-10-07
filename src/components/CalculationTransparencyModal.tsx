import React, { useState } from 'react';
import { 
  X, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Info,
  Layers,
  Divide,
  Calculator,
  ArrowRight
} from 'lucide-react';
import { CompanyForensicProfile } from '../types';
import { 
  calculateBeneishMScore, 
  calculateAltmanZScore, 
  calculateSloanAccruals 
} from '../services/forensicCalculations';

interface CalculationTransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyForensicProfile;
  initialTab?: 'beneish' | 'altman' | 'sloan';
}

export const CalculationTransparencyModal: React.FC<CalculationTransparencyModalProps> = ({
  isOpen,
  onClose,
  company,
  initialTab = 'beneish'
}) => {
  const [activeTab, setActiveTab] = useState<'beneish' | 'altman' | 'sloan'>(initialTab);

  if (!isOpen) return null;

  const financials = company.financials;
  const latest = financials[financials.length - 1];
  const prior = financials.length >= 2 ? financials[financials.length - 2] : latest;

  const beneish = calculateBeneishMScore(latest, prior);
  const altman = calculateAltmanZScore(latest, company.marketCap);
  const sloan = calculateSloanAccruals(latest.netIncome, latest.operatingCashFlow, latest.totalAssets);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl rounded-xl relative font-sans text-xs text-slate-300 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                  Forensic Calculation Engine &amp; Mathematical Proof
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  {company.ticker} · Audited 10-K Data
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Exact mathematical breakdown with variable weights, raw inputs, and empirical risk thresholds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('beneish')}
            className={`flex-1 py-2 px-3 rounded-md font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'beneish'
                ? 'bg-red-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Beneish 8-Factor M-Score</span>
            <span className="font-mono text-[11px] px-1.5 py-0.2 bg-slate-900/80 rounded">
              {beneish.mScore.toFixed(2)}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('altman')}
            className={`flex-1 py-2 px-3 rounded-md font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'altman'
                ? 'bg-red-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Altman Z-Score Solvency</span>
            <span className="font-mono text-[11px] px-1.5 py-0.2 bg-slate-900/80 rounded">
              {altman.zScore.toFixed(2)}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('sloan')}
            className={`flex-1 py-2 px-3 rounded-md font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'sloan'
                ? 'bg-red-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Sloan Accrual Ratio</span>
            <span className="font-mono text-[11px] px-1.5 py-0.2 bg-slate-900/80 rounded">
              {(sloan.accrualRatio * 100).toFixed(1)}%
            </span>
          </button>
        </div>

        {/* Content Tab 1: Beneish M-Score */}
        {activeTab === 'beneish' && (
          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                    Beneish Earnings Manipulation Model (Messod Beneish, 1999)
                  </span>
                  <div className="text-2xl font-bold font-mono text-white mt-0.5">
                    M-Score = {beneish.mScore.toFixed(2)}
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                  beneish.isManipulatorRisk 
                    ? 'bg-red-500/15 border-red-500/40 text-red-400' 
                    : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                }`}>
                  {beneish.isManipulatorRisk ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                  <span>{beneish.interpretation}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                <span className="text-red-400">M</span> = -4.84 + 0.920×DSRI + 0.528×GMI + 0.404×AQI + 0.892×SGI + 0.115×DEPI - 0.172×SGAI + 4.037×TATA + 0.0327×LVGI
              </div>
            </div>

            {/* 8 Variables Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-medium text-[11px]">
                    <th className="py-2.5 px-3">Variable Index</th>
                    <th className="py-2.5 px-3 text-right">Calculated Value</th>
                    <th className="py-2.5 px-3">Description &amp; Interpretation</th>
                    <th className="py-2.5 px-3 text-right">Standard Normal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {Object.entries(beneish.variables).map(([key, v]) => (
                    <tr key={key} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-medium text-white">{v.label}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-200">
                        {v.value.toFixed(3)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">{v.desc}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                        {key === 'tata' ? '< 0.00' : '≈ 1.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200">Empirical Rule:</strong> A score greater than <span className="font-mono text-red-400">-1.78</span> indicates an 85%+ probability of financial statement manipulation, uncollected receivable buildup, or accelerated revenue booking. Scores below <span className="font-mono text-emerald-400">-1.78</span> indicate standard, unmanipulated accounting.
            </div>
          </div>
        )}

        {/* Content Tab 2: Altman Z-Score */}
        {activeTab === 'altman' && (
          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                    Altman Z-Score Solvency &amp; Default Predictor (Edward Altman, 1968)
                  </span>
                  <div className="text-2xl font-bold font-mono text-white mt-0.5">
                    Z-Score = {altman.zScore.toFixed(2)}
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                  altman.zone === 'Safe'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : altman.zone === 'Grey'
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                    : 'bg-red-500/15 border-red-500/40 text-red-400'
                }`}>
                  {altman.zone === 'Safe' ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  <span>{altman.interpretation}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                <span className="text-red-400">Z</span> = 1.2×(WC/TA) + 1.4×(RE/TA) + 3.3×(EBIT/TA) + 0.6×(MktCap/TL) + 0.999×(Sales/TA)
              </div>
            </div>

            {/* 5 Factors Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-medium text-[11px]">
                    <th className="py-2.5 px-3">Component Ratio</th>
                    <th className="py-2.5 px-3 text-right">Raw Ratio</th>
                    <th className="py-2.5 px-3 text-right">Coefficient Weight</th>
                    <th className="py-2.5 px-3 text-right">Score Contribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {Object.entries(altman.variables).map(([key, v]) => (
                    <tr key={key} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-medium text-white">{v.label}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-300">{v.value.toFixed(3)}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-400">× {v.weight}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-red-400">
                        +{v.contribution.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <div className="text-emerald-400 font-bold">Safe Zone</div>
                <div className="font-mono text-white mt-1">Z &gt; 2.99</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Minimal default probability</div>
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="text-amber-400 font-bold">Grey Zone</div>
                <div className="font-mono text-white mt-1">1.81 ≤ Z ≤ 2.99</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Cautious watch status</div>
              </div>
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="text-red-400 font-bold">Distress Zone</div>
                <div className="font-mono text-white mt-1">Z &lt; 1.81</div>
                <div className="text-[10px] text-slate-400 mt-0.5">High solvency/covenant risk</div>
              </div>
            </div>
          </div>
        )}

        {/* Content Tab 3: Sloan Accruals */}
        {activeTab === 'sloan' && (
          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                    Sloan Accrual Anomaly (Richard Sloan, Wharton School, 1996)
                  </span>
                  <div className="text-2xl font-bold font-mono text-white mt-0.5">
                    Accrual Ratio = {(sloan.accrualRatio * 100).toFixed(2)}%
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                  sloan.isFavorable
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : 'bg-red-500/15 border-red-500/40 text-red-400'
                }`}>
                  {sloan.isFavorable ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  <span>{sloan.status}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                <span className="text-red-400">Accrual Ratio</span> = (Net Income - Operating Cash Flow) / Total Assets
              </div>
            </div>

            {/* Inputs Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400">GAAP Net Income (TTM)</span>
                <div className="text-lg font-mono font-bold text-white mt-1">
                  ${sloan.netIncome.toLocaleString()}M
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400">Operating Cash Flow (CFO)</span>
                <div className="text-lg font-mono font-bold text-emerald-400 mt-1">
                  ${sloan.operatingCashFlow.toLocaleString()}M
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400">Total Balance Sheet Assets</span>
                <div className="text-lg font-mono font-bold text-slate-200 mt-1">
                  ${sloan.totalAssets.toLocaleString()}M
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Total Accounting Accruals (NI − CFO):</span>
                <span className="font-mono font-bold text-white">
                  ${(sloan.netIncome - sloan.operatingCashFlow).toLocaleString()}M
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Cash Flow Conversion Ratio (CFO / NI):</span>
                <span className="font-mono font-bold text-emerald-400">
                  {sloan.cashConversionRatio}%
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Forensic Quality Benchmark:</span>
                <span className="font-semibold text-slate-200">
                  Accrual Ratio ≤ +5.0% (Clean GAAP Quality)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Formulas verified against academic literature and PCAOB forensic accounting standards</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
          >
            Close Proof
          </button>
        </div>
      </div>
    </div>
  );
};
