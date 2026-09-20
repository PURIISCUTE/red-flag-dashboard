import React, { useState } from 'react';
import { 
  Activity, 
  RefreshCw, 
  TrendingDown, 
  ShieldAlert,
  ArrowRight,
  Sliders
} from 'lucide-react';
import { CompanyForensicProfile } from '../types';

interface StressTestSimulatorProps {
  company: CompanyForensicProfile;
}

export const StressTestSimulator: React.FC<StressTestSimulatorProps> = ({ company }) => {
  const [revShockPct, setRevShockPct] = useState<number>(0);
  const [dsoStretchDays, setDsoStretchDays] = useState<number>(0);
  const [cogsInflationPct, setCogsInflationPct] = useState<number>(0);

  const ttm = company.financials.find((f) => f.year === 'TTM') || company.financials[company.financials.length - 1];

  // Recalculated dynamic stressed metrics
  const stressedRevenue = Math.round(ttm.revenue * (1 + revShockPct / 100));
  const stressedCogs = Math.round(ttm.cogs * (1 + cogsInflationPct / 100));
  const stressedGrossProfit = stressedRevenue - stressedCogs;
  const stressedOperatingIncome = Math.round(stressedGrossProfit - ttm.operatingExpenses);
  const stressedNetIncome = Math.round(stressedOperatingIncome * 0.78);
  
  // OCF deduction from DSO stretch (delayed collections)
  const cashLockedInAr = Math.round((stressedRevenue / 365) * dsoStretchDays);
  const stressedOCF = Math.max(-5000, ttm.operatingCashFlow - cashLockedInAr - (stressedRevenue < ttm.revenue ? (ttm.revenue - stressedRevenue) * 0.4 : 0));
  const stressedFCF = stressedOCF - ttm.capex;

  // Stressed Sloan Accruals: (Net Income - OCF) / Total Assets
  const stressedAccrualRatio = Math.round(((stressedNetIncome - stressedOCF) / ttm.totalAssets) * 1000) / 1000;
  
  // Stressed Beneish M-Score estimation delta
  const beneishDelta = (dsoStretchDays > 5 ? 0.35 : 0) + (revShockPct < -5 ? 0.25 : 0) + (stressedAccrualRatio > 0.08 ? 0.45 : 0);
  const stressedBeneish = Math.round((company.beneishMScore + beneishDelta) * 100) / 100;

  // Stressed Altman Z-Score: drops as working capital and EBIT decline
  const altmanDelta = (revShockPct < 0 ? (revShockPct / 100) * 1.8 : 0) - (cashLockedInAr / ttm.totalAssets) * 2.5;
  const stressedAltman = Math.max(0.8, Math.round((company.altmanZScore + altmanDelta) * 100) / 100);

  const handleReset = () => {
    setRevShockPct(0);
    setDsoStretchDays(0);
    setCogsInflationPct(0);
  };

  const isStressed = revShockPct !== 0 || dsoStretchDays !== 0 || cogsInflationPct !== 0;

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <Activity className="h-5 w-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">
              Working Capital &amp; Accrual Stress Test Simulator
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate operational shocks on cash conversion, Altman Z-Score, and Beneish manipulation indicators
            </p>
          </div>
        </div>

        {isStressed && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Inputs</span>
          </button>
        )}
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Revenue Shock */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Top-line Revenue Shock</span>
            <span className={`font-mono font-semibold ${revShockPct < 0 ? 'text-red-400' : revShockPct > 0 ? 'text-emerald-400' : 'text-slate-200'}`}>
              {revShockPct > 0 ? `+${revShockPct}%` : `${revShockPct}%`}
            </span>
          </div>
          <input
            type="range"
            min="-30"
            max="20"
            step="5"
            value={revShockPct}
            onChange={(e) => setRevShockPct(Number(e.target.value))}
            className="w-full accent-red-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>-30%</span>
            <span>Baseline (0%)</span>
            <span>+20%</span>
          </div>
        </div>

        {/* DSO Stretch */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Receivables Delay (DSO)</span>
            <span className={`font-mono font-semibold ${dsoStretchDays > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
              +{dsoStretchDays} days
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="5"
            value={dsoStretchDays}
            onChange={(e) => setDsoStretchDays(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>0 days</span>
            <span>+15 days</span>
            <span>+30 days</span>
          </div>
        </div>

        {/* COGS Inflation */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Cost / Margin Inflation</span>
            <span className={`font-mono font-semibold ${cogsInflationPct > 0 ? 'text-red-400' : 'text-slate-200'}`}>
              +{cogsInflationPct}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="25"
            step="5"
            value={cogsInflationPct}
            onChange={(e) => setCogsInflationPct(Number(e.target.value))}
            className="w-full accent-red-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>0%</span>
            <span>+10%</span>
            <span>+25%</span>
          </div>
        </div>
      </div>

      {/* Real-Time Stressed Impact Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-center">
          <div className="text-[11px] text-slate-400">Stressed Revenue</div>
          <div className="text-sm font-semibold font-mono text-white mt-1">
            ${stressedRevenue.toLocaleString()}M
          </div>
          <div className="text-[10px] text-slate-500">
            Base: ${ttm.revenue.toLocaleString()}M
          </div>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-center">
          <div className="text-[11px] text-slate-400">Operating Cash Flow</div>
          <div className={`text-sm font-semibold font-mono mt-1 ${stressedOCF < ttm.operatingCashFlow ? 'text-red-400' : 'text-white'}`}>
            ${stressedOCF.toLocaleString()}M
          </div>
          <div className="text-[10px] text-slate-500">
            Base: ${ttm.operatingCashFlow.toLocaleString()}M
          </div>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-center">
          <div className="text-[11px] text-slate-400">Altman Z-Score</div>
          <div className={`text-sm font-semibold font-mono mt-1 ${stressedAltman < 1.81 ? 'text-red-400' : stressedAltman < 2.99 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {stressedAltman}
          </div>
          <div className="text-[10px] text-slate-500">
            Base: {company.altmanZScore}
          </div>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-center">
          <div className="text-[11px] text-slate-400">Beneish M-Score</div>
          <div className={`text-sm font-semibold font-mono mt-1 ${stressedBeneish > -1.78 ? 'text-red-400' : 'text-emerald-400'}`}>
            {stressedBeneish}
          </div>
          <div className="text-[10px] text-slate-500">
            Base: {company.beneishMScore}
          </div>
        </div>
      </div>
    </div>
  );
};
