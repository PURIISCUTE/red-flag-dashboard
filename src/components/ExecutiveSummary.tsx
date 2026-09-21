import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Scale,
  Rotate3d,
  FileText
} from 'lucide-react';
import { CompanyForensicProfile } from '../types';
import { ForensicRiskGlobe3D } from './ForensicRiskGlobe3D';
import { Card3D } from './Card3D';

interface ExecutiveSummaryProps {
  company: CompanyForensicProfile;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ company }) => {
  const [activeTab, setActiveTab] = useState<'thesis' | 'globe3d'>('thesis');
  const criticalCount = company.flags.filter((f) => f.status === 'Critical Anomaly').length;
  const warningCount = company.flags.filter((f) => f.status === 'Warning').length;
  const healthyCount = company.flags.filter((f) => f.status === 'Healthy').length;

  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/30',
        label: 'Low Risk'
      };
    }
    if (score >= 65) {
      return {
        text: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/30',
        label: 'Moderate Risk'
      };
    }
    return {
      text: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/30',
      label: 'High Forensic Risk'
    };
  };

  const badge = getScoreBadge(company.forensicScore);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Left Box: Forensic Health Score & Ratios with 3D Perspective Hover */}
      <div className="lg:col-span-4">
        <Card3D className="h-full bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-300">
                Forensic Health Score
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                CIK {company.cik}
              </span>
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

          {/* 3 Core Forensic Indicator Readouts */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800 mt-3 text-center">
            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
              <div className="text-slate-400 text-[10px]">Beneish M</div>
              <div className={`font-mono font-bold text-sm my-0.5 ${company.beneishMScore < -1.78 ? 'text-emerald-400' : 'text-red-400'}`}>
                {company.beneishMScore}
              </div>
              <div className="text-[10px] text-slate-500">
                {company.beneishMScore < -1.78 ? 'Normal' : 'Watch'}
              </div>
            </div>

            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
              <div className="text-slate-400 text-[10px]">Altman Z</div>
              <div className={`font-mono font-bold text-sm my-0.5 ${company.altmanZScore > 2.99 ? 'text-emerald-400' : company.altmanZScore > 1.81 ? 'text-amber-400' : 'text-red-400'}`}>
                {company.altmanZScore}
              </div>
              <div className="text-[10px] text-slate-500">
                {company.altmanZScore > 2.99 ? 'Safe' : 'Distress'}
              </div>
            </div>

            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
              <div className="text-slate-400 text-[10px]">Sloan Accrual</div>
              <div className={`font-mono font-bold text-sm my-0.5 ${company.sloanAccrualRatio < 0.05 ? 'text-emerald-400' : 'text-red-400'}`}>
                {(company.sloanAccrualRatio * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-500">
                {company.sloanAccrualRatio < 0.05 ? 'Cash Backed' : 'High Accrual'}
              </div>
            </div>
          </div>
        </Card3D>
      </div>

      {/* Right Box: Key Findings Thesis OR 3D Risk Polyhedron */}
      <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-red-400" />
              <h2 className="text-xs font-semibold text-white">
                Forensics Thesis &amp; 3D Risk Analysis
              </h2>
            </div>
            
            {/* Tab switch between Written Thesis and 3D Interactive Polyhedron */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('thesis')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                  activeTab === 'thesis'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="h-3 w-3" />
                <span>Thesis Findings</span>
              </button>
              <button
                onClick={() => setActiveTab('globe3d')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                  activeTab === 'globe3d'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Rotate3d className="h-3 w-3 text-red-300" />
                <span>3D Risk Polyhedron</span>
                <span className="text-[9px] px-1 py-0.2 bg-red-800/80 rounded font-bold uppercase tracking-wider">3D</span>
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
            <div className="my-1 animate-fadeIn">
              <ForensicRiskGlobe3D company={company} height={260} />
            </div>
          )}
        </div>

        {/* Bottom Metadata Strip */}
        <div className="pt-3 border-t border-slate-800 mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>Auditor: <strong className="text-slate-300 font-medium">{company.filingAuditLogs[0]?.auditor || 'PCAOB Independent Firm'}</strong></span>
            <span>·</span>
            <span className="text-emerald-400 font-medium">Opinion: {company.filingAuditLogs[0]?.auditorOpinion || 'Unqualified'}</span>
          </div>
          <div className="font-mono text-slate-500 text-[10px]">
            Latest 10-K: {company.filingAuditLogs[0]?.secAccessionNumber || '0000320193-25-000106'}
          </div>
        </div>
      </div>
    </div>
  );
};
