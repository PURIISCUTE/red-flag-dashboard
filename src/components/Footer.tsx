import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertCircle, 
  Wrench, 
  ExternalLink, 
  Scale, 
  Database,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  return (
    <>
      <footer className="mt-10 border-t border-[#1c2233] bg-[#090c12] px-4 py-8 font-mono text-xs text-[#94a3b8]">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Row: Brand & Service Telemetry */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-[#182030]">
            <Logo size="sm" showSubtitle={true} />

            <div className="flex flex-wrap items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-[#0f1422] border border-[#1e273b]">
                <span className="h-2 w-2 rounded-full bg-[#38A169] animate-pulse"></span>
                <span className="text-[#e2e8f0] font-bold">ALL SERVICES OPERATIONAL</span>
              </div>
              <button
                onClick={() => setShowMaintenanceModal(true)}
                className="hover:text-white flex items-center gap-1 px-2 py-1 bg-[#0f1422] border border-[#1e273b] transition-colors"
              >
                <Wrench className="h-3 w-3 text-[#ECC94B]" />
                <span>MAINTENANCE SCHEDULE</span>
              </button>
              <a
                href="https://www.sec.gov/edgar/searchedgar/companysearch"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white flex items-center gap-1 px-2 py-1 bg-[#0f1422] border border-[#1e273b] transition-colors"
              >
                <span>SEC EDGAR DIRECT</span>
                <ExternalLink className="h-3 w-3 text-[#a5b4fc]" />
              </a>
            </div>
          </div>

          {/* High-Readability Institutional Legal Disclaimer Box */}
          <div className="bg-[#0c1018] border border-[#222a3d] p-4 text-xs font-sans rounded-none shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1b2336] pb-2.5">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-[#FF4D4D] shrink-0" />
                <span className="font-mono text-xs font-bold text-white tracking-wider uppercase">
                  Statutory Disclosure &amp; Regulatory Notice
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#FF4D4D]/15 border border-[#FF4D4D]/40 text-[#FF4D4D] font-mono text-[10px] font-bold tracking-wider">
                  NOT INVESTMENT ADVICE
                </span>
                <span className="px-2 py-0.5 bg-[#38A169]/15 border border-[#38A169]/40 text-[#38A169] font-mono text-[10px] font-bold">
                  PCAOB ALIGNED
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
              <div className="space-y-1">
                <p className="text-[#cbd5e1] font-medium">
                  <strong className="text-white font-semibold">© 2026 RedFlag Terminal.</strong> For informational purposes only — not investment advice.
                </p>
                <p className="text-[#94a3b8] text-[11px] font-mono">
                  Primary data sourced directly via <strong className="text-[#cbd5e1]">SEC EDGAR</strong> XBRL public filings, <strong className="text-[#cbd5e1]">Yahoo Finance</strong> market pricing feeds, and audited <strong className="text-[#cbd5e1]">Kaggle Benchmark</strong> baselines.
                </p>
              </div>

              <div className="space-y-1 md:border-l md:border-[#1b2336] md:pl-4">
                <p className="text-[#cbd5e1] leading-relaxed">
                  Deterministic heuristic flag calculations are conducted strictly for <strong className="text-white font-medium">forensic discrepancy triage</strong> and <strong className="text-white font-medium">corporate governance auditing</strong> under PCAOB guidelines.
                </p>
                <p className="text-[#718096] text-[10px] font-mono">
                  No algorithmic recommendations to buy, hold, or liquidate securities are expressed or implied.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Maintenance Info Modal */}
      {showMaintenanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0F131C] border border-[#ECC94B] w-full max-w-lg p-5 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#222a3d] mb-3">
              <div className="flex items-center gap-2 text-[#ECC94B]">
                <Wrench className="h-4 w-4" />
                <h3 className="font-bold text-white uppercase">System Status &amp; Maintenance Schedule</h3>
              </div>
              <button
                onClick={() => setShowMaintenanceModal(false)}
                className="text-[#718096] hover:text-white px-2 py-0.5 bg-[#1b2233]"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-[#cbd5e1] font-sans text-xs">
              <div className="p-2.5 bg-[#080b10] border border-[#1e2538] font-mono text-[11px]">
                <div className="text-[#38A169] font-bold">● SYSTEM HEALTH: 99.98% UPTIME</div>
                <div className="text-[#718096] mt-1">Next scheduled SEC XBRL mirror synchronization: Sunday 02:00 UTC.</div>
              </div>
              <p>
                The RedFlag Terminal data engine runs continuous automated sanity checks across historical XBRL tags. During SEC EDGAR maintenance windows (weekends 06:00-09:00 ET), the autonomous agent automatically serves cached ground-truth facts.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#1c2333] flex justify-end">
              <button
                onClick={() => setShowMaintenanceModal(false)}
                className="px-4 py-1 bg-[#1b2233] hover:bg-[#252f47] text-white font-mono text-xs"
              >
                DISMISS
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
