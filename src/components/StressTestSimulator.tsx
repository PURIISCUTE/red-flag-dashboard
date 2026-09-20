import React, { useState } from 'react';
import { 
  Sliders, 
  Activity, 
  AlertCircle, 
  RefreshCw, 
  TrendingDown, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { CompanyForensicProfile } from '../types';

interface StressTestSimulatorProps {
  company: CompanyForensicProfile;
}

export const StressTestSimulator: React.FC<StressTestSimulatorProps> = ({ company }) => {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div className="mb-4 bg-[#0c1018] border border-[#222a3d] p-3 text-xs font-mono">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#ECC94B]" />
          <span className="font-bold text-white uppercase tracking-wider">
            Interactive Working Capital & Accrual Stress Simulator
          </span>
          <span className="px-1.5 py-0.2 bg-[#ECC94B]/15 text-[#ECC94B] text-[10px] border border-[#ECC94B]/40">
            DYNAMIC SCENARIO ENGINE
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isOpen && (revShockPct !== 0 || dsoStretchDays !== 0 || cogsInflationPct !== 0) && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-[11px] text-[#718096] hover:text-white px-2 py-0.5 bg-[#161c2b] border border-[#232c40]"
            >
              <RefreshCw className="h-3 w-3" />
              RESET
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-2.5 py-1 bg-[#1a2133] hover:bg-[#252f47] text-white border border-[#2e3a54] text-[11px] font-bold"
          >
            {isOpen ? 'COLLAPSE SIMULATOR' : 'OPEN STRESS SIMULATOR'}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-[#1c2333] space-y-3">
          {/* Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Revenue Shock */}
            <div className="bg-[#080b10] p-2.5 border border-[#1b2233]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#8a94a6] text-[10px]">TOP-LINE REVENUE SHOCK</span>
                <span className={`font-bold ${revShockPct < 0 ? 'text-[#FF4D4D]' : revShockPct > 0 ? 'text-[#38A169]' : 'text-white'}`}>
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
                className="w-full accent-[#FF4D4D] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#525f7a]">
                <span>-30% (Severe contraction)</span>
                <span>0%</span>
                <span>+20%</span>
              </div>
            </div>

            {/* DSO Stretch */}
            <div className="bg-[#080b10] p-2.5 border border-[#1b2233]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#8a94a6] text-[10px]">RECEIVABLES DELAY (DSO STRETCH)</span>
                <span className={`font-bold ${dsoStretchDays > 0 ? 'text-[#ECC94B]' : 'text-white'}`}>
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
                className="w-full accent-[#ECC94B] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#525f7a]">
                <span>0d (Normal)</span>
                <span>+15d (Delayed)</span>
                <span>+30d (Collection Freeze)</span>
              </div>
            </div>

            {/* COGS Inflation */}
            <div className="bg-[#080b10] p-2.5 border border-[#1b2233]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#8a94a6] text-[10px]">SUPPLY CHAIN / COGS INFLATION</span>
                <span className={`font-bold ${cogsInflationPct > 0 ? 'text-[#FF4D4D]' : 'text-white'}`}>
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
                className="w-full accent-[#FF4D4D] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#525f7a]">
                <span>0% (Baseline)</span>
                <span>+10%</span>
                <span>+25% (Margin Squeeze)</span>
              </div>
            </div>
          </div>

          {/* Stressed Output Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
            <div className="bg-[#080b10] p-2 border border-[#1f2638]">
              <span className="text-[10px] text-[#718096] block">STRESSED TTM REVENUE</span>
              <div className="font-bold text-white text-xs">${stressedRevenue.toLocaleString()}M</div>
              <span className={`text-[10px] ${stressedRevenue < ttm.revenue ? 'text-[#FF4D4D]' : 'text-[#38A169]'}`}>
                {stressedRevenue < ttm.revenue ? `-$${(ttm.revenue - stressedRevenue).toLocaleString()}M` : 'Base'}
              </span>
            </div>

            <div className="bg-[#080b10] p-2 border border-[#1f2638]">
              <span className="text-[10px] text-[#718096] block">STRESSED FREE CASH FLOW</span>
              <div className="font-bold text-white text-xs">${stressedFCF.toLocaleString()}M</div>
              <span className={`text-[10px] ${stressedFCF < ttm.freeCashFlow ? 'text-[#FF4D4D]' : 'text-[#38A169]'}`}>
                Baseline: ${ttm.freeCashFlow.toLocaleString()}M
              </span>
            </div>

            <div className="bg-[#080b10] p-2 border border-[#1f2638]">
              <span className="text-[10px] text-[#718096] block">SLOAN ACCRUAL RATIO</span>
              <div className={`font-bold text-xs ${stressedAccrualRatio > 0.08 ? 'text-[#FF4D4D]' : 'text-[#38A169]'}`}>
                {(stressedAccrualRatio * 100).toFixed(1)}%
              </div>
              <span className="text-[9px] text-[#718096]">
                {stressedAccrualRatio > 0.08 ? 'DANGEROUS ACCRUALS' : 'NORMAL CASH CONVERSION'}
              </span>
            </div>

            <div className="bg-[#080b10] p-2 border border-[#1f2638]">
              <span className="text-[10px] text-[#718096] block">STRESSED BENEISH M-SCORE</span>
              <div className={`font-bold text-xs ${stressedBeneish > -1.78 ? 'text-[#FF4D4D]' : 'text-[#38A169]'}`}>
                {stressedBeneish}
              </div>
              <span className="text-[9px] text-[#718096]">
                {stressedBeneish > -1.78 ? 'MANIPULATION RISK' : 'HEALTHY (< -1.78)'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
