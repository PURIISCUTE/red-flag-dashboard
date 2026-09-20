import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, Wrench, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  return (
    <>
      <footer className="mt-8 border-t border-[#1c2233] bg-[#0c0f17] px-4 py-6 font-mono text-xs text-[#718096]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#38A169]"></span>
            <span className="text-[#e1e2ea] font-bold">REDFLAG TERMINAL SYSTEMS</span>
            <span className="text-[#3b4766]">|</span>
            <span className="text-[#a5b4fc]">ALL SERVICES OPERATIONAL</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setShowMaintenanceModal(true)}
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <Wrench className="h-3 w-3 text-[#ECC94B]" />
              <span>SCHEDULED MAINTENANCE</span>
            </button>
            <span>•</span>
            <a
              href="https://www.sec.gov/edgar/searchedgar/companysearch"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>SEC EDGAR DIRECT</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Legal Disclaimer Required by Business Spec */}
        <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-[#181f2f] text-[11px] text-[#525f7a] text-center leading-relaxed">
          <p>
            © 2026 RedFlag Terminal. For informational purposes only — not investment advice. Data sourced via SEC EDGAR, Yahoo Finance, and Benchmark Feeds.
          </p>
          <p className="mt-1 text-[10px] text-[#424c61]">
            Deterministic heuristic flag calculations are conducted strictly for forensic discrepancy triage and corporate governance auditing under PCAOB guidelines.
          </p>
        </div>
      </footer>

      {/* Maintenance Info Modal */}
      {showMaintenanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0F131C] border border-[#ECC94B] w-full max-w-lg p-5 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#222a3d] mb-3">
              <div className="flex items-center gap-2 text-[#ECC94B]">
                <Wrench className="h-4 w-4" />
                <h3 className="font-bold text-white uppercase">System Status & Maintenance Schedule</h3>
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
            <div className="mt-4 pt-3 border-t border-[#1c2233] flex justify-end">
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
