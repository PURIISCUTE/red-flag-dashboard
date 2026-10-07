import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  FileText, 
  BarChart3, 
  Activity, 
  ShieldAlert, 
  ArrowUpRight,
  Calculator,
  HelpCircle
} from 'lucide-react';
import { CompanyForensicProfile } from '../types';
import { CalculationTransparencyModal } from './CalculationTransparencyModal';

interface ExecutiveSummaryProps {
  company: CompanyForensicProfile;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ company }) => {
  const [activeTab, setActiveTab] = useState<'thesis' | 'vectors'>('thesis');
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [proofInitialTab, setProofInitialTab] = useState<'beneish' | 'altman' | 'sloan'>('beneish');

  const openProof = (tab: 'beneish' | 'altman' | 'sloan') => {
    setProofInitialTab(tab);
    setIsProofModalOpen(true);
  };

  const criticalCount = company.flags.filter((f) => f.status === 'Critical Anomaly').length;
  const warningCount = company.flags.filter((f) => f.status === 'Warning').length;
  const healthyCount = company.flags.filter((f) => f.status === 'Healthy').length;

  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/30',
        label: 'Low Forensic Risk'
      };
    }
    if (score >= 65) {
      return {
        text: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/30',
        label: 'Moderate Anomaly Watch'
      };
    }
    return {
      text: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/30',
      label: 'Elevated Forensic Risk'
    };
  };

  const badge = getScoreBadge(company.forensicScore);

  // Group flags by category to compute vector percentages
  const vectorSummary = [
    {
      name: 'Revenue & Accrual Quality',
      flags: company.flags.filter(f => f.category.toLowerCase().includes('revenue') || f.category.toLowerCase().includes('receivable') || f.category.toLowerCase().includes('accrual')),
      benchmark: 'P50 Baseline'
    },
    {
      name: 'Working Capital & Inventory',
      flags: company.flags.filter(f => f.category.toLowerCase().includes('inventory') || f.category.toLowerCase().includes('working capital') || f.category.toLowerCase().includes('vendor')),
      benchmark: 'Sector Median'
    },
    {
      name: 'Balance Sheet & Debt Overhang',
      flags: company.flags.filter(f => f.category.toLowerCase().includes('debt') || f.category.toLowerCase().includes('lease') || f.category.toLowerCase().includes('solvency')),
      benchmark: '< 2.5x Leverage'
    },
    {
      name: 'Governance & Footnote Disclosures',
      flags: company.flags.filter(f => f.category.toLowerCase().includes('governance') || f.category.toLowerCase().includes('related') || f.category.toLowerCase().includes('auditor') || f.category.toLowerCase().includes('restatement')),
      benchmark: 'Clean PCAOB Opinion'
    }
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Box: Forensic Health Score & Ratios */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-300">
                Forensic Health Score
              </span>
              <button
                onClick={() => openProof('beneish')}
                className="text-[11px] font-mono text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer transition-colors"
                title="Inspect mathematical derivation"
              >
                <Calculator className="h-3 w-3" />
                <span>Verify Math Proof</span>
              </button>
            </div>

            <div className="flex items-center gap-4 my-2">
              <div className={`h-20 w-20 rounded-xl border flex flex-col items-center justify-center ${badge.bg}`}>
                <span className="text-3xl font-bold font-mono text-white tracking-tight">
                  {company.forensicScore}
                </span>
                <span className="text-[10px] text-slate-400 font-sans">/ 100</span>
              </div>

              <div className="flex-1 space-y-1 text-xs">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-400">Rating Grade:</span>
                  <span className="font-semibold text-white px-2 py-0.5 bg-slate-800 rounded text-[11px] font-mono">
                    {company.scoreGrade}
                  </span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-400">Status:</span>
                  <span className={`font-medium ${badge.text}`}>
                    {badge.label}
                  </span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-400">Flag Summary:</span>
                  <span className="text-slate-200 text-[11px]">
                    <span className="text-red-400 font-semibold">{criticalCount} critical</span> ·{' '}
                    <span className="text-amber-400 font-semibold">{warningCount} warn</span> ·{' '}
                    <span className="text-emerald-400 font-semibold">{healthyCount} clean</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Core Forensic Indicator Readouts (Interactive Clickable Proof) */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800 mt-3 text-center">
            <button
              type="button"
              onClick={() => openProof('beneish')}
              className="bg-slate-950/80 hover:bg-slate-950 p-2 rounded-lg border border-slate-800 hover:border-slate-700 transition-all text-left cursor-pointer group"
              title="Click to view Beneish M-Score 8-factor calculation breakdown"
            >
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-medium">
                <span>Beneish M</span>
                <ArrowUpRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
              </div>
              <div className={`font-mono font-bold text-sm my-0.5 truncate ${company.beneishMScore < -1.78 ? 'text-emerald-400' : 'text-red-400'}`} title={Number(company.beneishMScore).toFixed(2)}>
                {Number(company.beneishMScore).toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {company.beneishMScore < -1.78 ? 'Normal (-1.78)' : 'Watch (> -1.78)'}
              </div>
            </button>

            <button
              type="button"
              onClick={() => openProof('altman')}
              className="bg-slate-950/80 hover:bg-slate-950 p-2 rounded-lg border border-slate-800 hover:border-slate-700 transition-all text-left cursor-pointer group"
              title="Click to view Altman Z-Score 5-factor calculation breakdown"
            >
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-medium">
                <span>Altman Z</span>
                <ArrowUpRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
              </div>
              <div className={`font-mono font-bold text-sm my-0.5 truncate ${company.altmanZScore > 2.99 ? 'text-emerald-400' : company.altmanZScore > 1.81 ? 'text-amber-400' : 'text-red-400'}`} title={Number(company.altmanZScore).toFixed(2)}>
                {Number(company.altmanZScore).toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {company.altmanZScore > 2.99 ? 'Safe (>2.99)' : 'Distress (<1.81)'}
              </div>
            </button>

            <button
              type="button"
              onClick={() => openProof('sloan')}
              className="bg-slate-950/80 hover:bg-slate-950 p-2 rounded-lg border border-slate-800 hover:border-slate-700 transition-all text-left cursor-pointer group"
              title="Click to view Sloan Accrual Ratio calculation breakdown"
            >
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-medium">
                <span>Sloan Accrual</span>
                <ArrowUpRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
              </div>
              <div className={`font-mono font-bold text-sm my-0.5 truncate ${company.sloanAccrualRatio < 0.05 ? 'text-emerald-400' : 'text-red-400'}`} title={`${(Number(company.sloanAccrualRatio) * 100).toFixed(1)}%`}>
                {(Number(company.sloanAccrualRatio) * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {company.sloanAccrualRatio < 0.05 ? 'Cash Backed' : 'High Accruals'}
              </div>
            </button>
          </div>
        </div>

        {/* Right Box: Key Findings Thesis OR Sector Risk Vector Breakdown */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-400" />
                <h2 className="text-xs font-semibold text-white">
                  Audited Forensics Thesis &amp; Risk Vectors
                </h2>
              </div>
              
              {/* Tab switch between Written Thesis and Risk Vectors */}
              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveTab('thesis')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                    activeTab === 'thesis'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="h-3 w-3" />
                  <span>Executive Thesis</span>
                </button>
                <button
                  onClick={() => setActiveTab('vectors')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                    activeTab === 'vectors'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Activity className="h-3 w-3" />
                  <span>Risk Vectors</span>
                </button>
              </div>
            </div>

            {activeTab === 'thesis' ? (
              <div className="space-y-2.5 my-1">
                {company.executiveSummary.slice(0, 4).map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                    <span className="mt-1.5 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-red-400"></span>
                    <p>{bullet}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-1">
                {vectorSummary.map((vec, idx) => {
                  const total = vec.flags.length || 1;
                  const critical = vec.flags.filter(f => f.status === 'Critical Anomaly').length;
                  const warning = vec.flags.filter(f => f.status === 'Warning').length;
                  const healthy = vec.flags.filter(f => f.status === 'Healthy').length;
                  const score = Math.max(0, 100 - (critical * 25 + warning * 12));

                  return (
                    <div key={idx} className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-lg space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">{vec.name}</span>
                        <span className={`font-mono text-[11px] font-bold ${score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                          {score}/100
                        </span>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
                        <div className="bg-emerald-500 h-full" style={{ width: `${(healthy / total) * 100}%` }}></div>
                        <div className="bg-amber-500 h-full" style={{ width: `${(warning / total) * 100}%` }}></div>
                        <div className="bg-red-500 h-full" style={{ width: `${(critical / total) * 100}%` }}></div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{critical} critical · {warning} warn · {healthy} clean</span>
                        <span className="font-mono text-slate-500">{vec.benchmark}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Metadata Strip */}
          <div className="pt-3 border-t border-slate-800 mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span>Auditor: <strong className="text-slate-300 font-medium">{company.filingAuditLogs[0]?.auditor || 'PCAOB Independent Firm'}</strong></span>
              <span>•</span>
              <span>Opinion: <strong className="text-emerald-400 font-medium">{company.filingAuditLogs[0]?.auditorOpinion || 'Unqualified'}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span>Period End: <strong className="text-slate-300 font-mono">{company.filingAuditLogs[0]?.periodEnd || 'FY25'}</strong></span>
              <span>•</span>
              <span>Filing: <strong className="text-slate-300 font-mono">{company.filingAuditLogs[0]?.secAccessionNumber || 'SEC EDGAR 10-K'}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Calculation Transparency Modal */}
      <CalculationTransparencyModal
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
        company={company}
        initialTab={proofInitialTab}
      />
    </>
  );
};
