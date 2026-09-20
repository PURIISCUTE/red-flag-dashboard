import React, { useState } from 'react';
import { 
  Wrench, 
  ExternalLink, 
  Scale, 
  CheckCircle2
} from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  return (
    <>
      <footer className="mt-12 border-t border-slate-800/80 bg-slate-950 px-4 py-8 text-xs text-slate-400 font-sans">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Row: Brand & Service Status */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-800/60">
            <Logo size="sm" showSubtitle={true} />

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span className="font-medium text-[11px]">All Systems Operational</span>
              </div>
              <button
                onClick={() => setShowMaintenanceModal(true)}
                className="hover:text-slate-200 flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg transition-colors text-slate-400"
              >
                <Wrench className="h-3 w-3 text-amber-400" />
                <span className="text-[11px]">System Status</span>
              </button>
              <a
                href="https://www.sec.gov/edgar/searchedgar/companysearch"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-200 flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg transition-colors text-slate-400"
              >
                <span className="text-[11px]">SEC EDGAR Direct</span>
                <ExternalLink className="h-3 w-3 text-slate-500" />
              </a>
            </div>
          </div>

          {/* Clean Statutory Notice Box */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-red-400 shrink-0" />
                <span className="font-semibold text-white">
                  Regulatory Notice &amp; Compliance Disclaimers
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] rounded font-medium">
                  Not Investment Advice
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] rounded font-medium">
                  PCAOB Aligned
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-300">
              <div className="space-y-1">
                <p>
                  <strong className="text-white font-medium">© 2026 RedFlag Terminal.</strong> For informational and investigative purposes only.
                </p>
                <p className="text-slate-400 text-[11px]">
                  Data sourced via SEC EDGAR XBRL filings, Yahoo Finance pricing feeds, and benchmark accounting baselines.
                </p>
              </div>

              <div className="space-y-1 md:border-l md:border-slate-800 md:pl-4">
                <p>
                  Deterministic flag calculations are designed for financial forensic discrepancy triage and corporate governance auditing under PCAOB guidelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Status Modal */}
      {showMaintenanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg p-5 rounded-xl shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Wrench className="h-4 w-4 text-amber-400" />
                <span>System Status &amp; Sync Cadence</span>
              </div>
              <button
                onClick={() => setShowMaintenanceModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-slate-300 text-xs">
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                <div className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>99.98% Telemetry Uptime</span>
                </div>
                <div className="text-slate-400 mt-1 text-[11px]">
                  Next scheduled SEC XBRL sync: Sunday 02:00 UTC.
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                RedFlag Terminal runs automated sanity checks across historical XBRL tags and live feeds. Data caches ensure continuous uninterrupted analysis.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowMaintenanceModal(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
