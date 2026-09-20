import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Cpu, 
  TrendingUp, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { CompanyForensicProfile } from '../types';

interface ExecutiveSummaryProps {
  company: CompanyForensicProfile;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ company }) => {
  const criticalCount = company.flags.filter((f) => f.status === 'Critical Anomaly').length;
  const warningCount = company.flags.filter((f) => f.status === 'Warning').length;
  const healthyCount = company.flags.filter((f) => f.status === 'Healthy').length;

  // Grade color helper
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#38A169] border-[#38A169]';
    if (score >= 65) return 'text-[#ECC94B] border-[#ECC94B]';
    return 'text-[#FF4D4D] border-[#FF4D4D]';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-[#38A169]/10';
    if (score >= 65) return 'bg-[#ECC94B]/10';
    return 'bg-[#FF4D4D]/10';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 mb-4">
      {/* Left Box: Forensic Health Score & Quantitative Ratios */}
      <div className="lg:col-span-4 bg-[#0F131C] border border-[#22293d] p-4 flex flex-col justify-between relative overflow-hidden shadow-lg">
        {/* Subtle accent corner badge */}
        <div className="absolute top-0 right-0 px-2 py-0.5 bg-[#1b2233] text-[10px] font-mono text-[#a5b4fc] border-b border-l border-[#2d3852]">
          AUDIT ID: {company.cik}-2026
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="h-4 w-4 text-[#FF4D4D]" />
            <h2 className="text-xs font-mono font-bold text-[#e1e2ea] tracking-wider uppercase">
              Forensic Health Score
            </h2>
          </div>

          <div className="flex items-center gap-4 my-2">
            <div className={`h-24 w-24 rounded-none border-2 flex flex-col items-center justify-center ${getScoreColor(company.forensicScore)} ${getScoreBg(company.forensicScore)}`}>
              <span className="font-mono text-3xl font-extrabold tracking-tight">
                {company.forensicScore}
              </span>
              <span className="text-[10px] font-mono opacity-80">OUT OF 100</span>
            </div>

            <div className="flex-1 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between items-center pb-1 border-b border-[#1f2638]">
                <span className="text-[#8a94a6]">GRADE:</span>
                <span className={`font-bold px-2 py-0.2 ${getScoreColor(company.forensicScore)} ${getScoreBg(company.forensicScore)}`}>
                  TIER {company.scoreGrade}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#8a94a6]">STATUS:</span>
                <span className={company.forensicScore >= 80 ? 'text-[#38A169] font-bold' : company.forensicScore >= 65 ? 'text-[#ECC94B] font-bold' : 'text-[#FF4D4D] font-bold'}>
                  {company.forensicScore >= 80 ? 'INSTITUTIONAL CLEAN' : company.forensicScore >= 65 ? 'CAUTIONARY WATCH' : 'SEVERE RISK DETECTED'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#8a94a6]">FLAG COUNTS:</span>
                <span className="text-[#e1e2ea] flex items-center gap-1.5">
                  <span className="text-[#FF4D4D] font-bold">{criticalCount} Crit</span> /
                  <span className="text-[#ECC94B] font-bold">{warningCount} Warn</span> /
                  <span className="text-[#38A169] font-bold">{healthyCount} OK</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Forensic Indicator Readouts */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#1c2233] mt-2 font-mono text-[11px]">
          <div className="bg-[#090c12] p-2 border border-[#1b2131]">
            <div className="text-[#718096] text-[10px]">BENEISH M</div>
            <div className={`font-bold text-sm ${company.beneishMScore < -1.78 ? 'text-[#38A169]' : 'text-[#FF4D4D]'}`}>
              {company.beneishMScore}
            </div>
            <div className="text-[9px] text-[#718096] truncate">
              {company.beneishMScore < -1.78 ? 'Normal (< -1.78)' : 'Manipulation Risk'}
            </div>
          </div>

          <div className="bg-[#090c12] p-2 border border-[#1b2131]">
            <div className="text-[#718096] text-[10px]">ALTMAN Z</div>
            <div className={`font-bold text-sm ${company.altmanZScore > 2.99 ? 'text-[#38A169]' : company.altmanZScore > 1.81 ? 'text-[#ECC94B]' : 'text-[#FF4D4D]'}`}>
              {company.altmanZScore}
            </div>
            <div className="text-[9px] text-[#718096] truncate">
              {company.altmanZScore > 2.99 ? 'Safe Zone' : 'Grey / Distress'}
            </div>
          </div>

          <div className="bg-[#090c12] p-2 border border-[#1b2131]">
            <div className="text-[#718096] text-[10px]">SLOAN ACCRUAL</div>
            <div className={`font-bold text-sm ${company.sloanAccrualRatio < 0.05 ? 'text-[#38A169]' : 'text-[#FF4D4D]'}`}>
              {(company.sloanAccrualRatio * 100).toFixed(1)}%
            </div>
            <div className="text-[9px] text-[#718096] truncate">
              {company.sloanAccrualRatio < 0.05 ? 'Cash Backed' : 'High Accruals'}
            </div>
          </div>
        </div>
      </div>

      {/* Right Box: Concise AI Executive Forensics Thesis (Max 4 bullets) */}
      <div className="lg:col-span-8 bg-[#0F131C] border border-[#22293d] p-4 flex flex-col justify-between shadow-lg">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-[#1c2233]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#FF4D4D]"></span>
              <h2 className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                Autonomous AI Forensics Thesis & Executive Summary
              </h2>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="px-2 py-0.5 bg-[#171f30] text-[#a5b4fc] border border-[#263352]">
                LENS: {company.lens.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 bg-[#121c16] text-[#38A169] border border-[#22442c]">
                SEC GROUND TRUTH P1
              </span>
            </div>
          </div>

          {/* 4 Concise Bullet Points */}
          <div className="space-y-2.5 my-2">
            {company.executiveSummary.slice(0, 4).map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-[#d1d5db] font-sans leading-relaxed">
                <span className="mt-1 flex-shrink-0 h-1.5 w-1.5 rounded-none bg-[#FF4D4D]"></span>
                <p>{bullet}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Metadata Strip */}
        <div className="pt-2 border-t border-[#1c2233] mt-2 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#718096]">
          <div className="flex items-center gap-3">
            <span>AUDITOR: {company.filingAuditLogs[0]?.auditor || 'Independent PCAOB Firm'}</span>
            <span>•</span>
            <span className="text-[#38A169]">OPINION: {company.filingAuditLogs[0]?.auditorOpinion || 'Unqualified'}</span>
          </div>
          <div className="flex items-center gap-2 text-[#a5b4fc]">
            <span>LAST SEC 10-K: {company.filingAuditLogs[0]?.secAccessionNumber || '0000320193-25-000106'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
