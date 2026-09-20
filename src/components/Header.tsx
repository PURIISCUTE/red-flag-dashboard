import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Layers, 
  Download, 
  Terminal,
  ShieldCheck,
  Code2
} from 'lucide-react';
import { CompanyForensicProfile } from '../types';

interface HeaderProps {
  currentCompany: CompanyForensicProfile;
  onSelectCompany: (ticker: string) => void;
  onOpenPriorityModal: () => void;
  onOpenArchitectureModal: () => void;
  onExportPdf: () => void;
  isExportingPdf: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentCompany,
  onSelectCompany,
  onOpenPriorityModal,
  onOpenArchitectureModal,
  onExportPdf,
  isExportingPdf
}) => {
  const [searchInput, setSearchInput] = useState('');
  const popularTickers = ['AAPL', 'NVDA', 'MSFT', 'AMZN', 'PYPL', 'JPM'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSelectCompany(searchInput.trim().toUpperCase());
      setSearchInput('');
    }
  };

  return (
    <header className="border-b border-[#222736] bg-[#0c0f17]/90 backdrop-blur sticky top-0 z-40">
      {/* Top Telemetry Bar */}
      <div className="border-b border-[#1c2130] px-4 py-1.5 flex flex-wrap items-center justify-between text-[11px] font-mono text-[#8a94a6]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#38A169] animate-pulse"></span>
            <span className="text-[#a5b4fc]">SEC EDGAR: CONNECTED (XBRL JSON V2.1)</span>
          </div>
          <span className="text-[#333d52]">|</span>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ECC94B]"></span>
            <span>YAHOO TTM FEED: ACTIVE</span>
          </div>
          <span className="text-[#333d52]">|</span>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#38A169]"></span>
            <span>KAGGLE BENCHMARKS: 210 RULES LOADED</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#718096]">DETERMINISTIC FORENSIC ENGINE: VERIFIED (0% JITTER)</span>
          <span className="text-[#333d52]">|</span>
          <span className="text-[#FF4D4D] font-bold">TERMINAL BUILD v4.8</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-[#1a0e12] border border-[#FF4D4D]/50 flex items-center justify-center text-[#FF4D4D] shadow-[0_0_12px_rgba(255,77,77,0.25)]">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-base font-bold text-white tracking-wider flex items-center gap-1.5">
                REDFLAG<span className="text-[#FF4D4D]">TERMINAL</span>
              </h1>
              <span className="px-1.5 py-0.2 bg-[#FF4D4D]/15 border border-[#FF4D4D]/40 text-[#FF4D4D] text-[10px] font-mono font-semibold">
                ENTERPRISE SAAS
              </span>
            </div>
            <p className="text-[11px] text-[#718096] font-mono">
              210-Flag Forensic Discrepancy & SEC XBRL Audit System
            </p>
          </div>
        </div>

        {/* Quick Ticker Switcher & Search Bar */}
        <div className="flex items-center gap-2 flex-1 max-w-xl">
          <div className="hidden lg:flex items-center gap-1 bg-[#090c12] p-1 border border-[#1f2638]">
            {popularTickers.map((t) => (
              <button
                key={t}
                onClick={() => onSelectCompany(t)}
                className={`px-2.5 py-1 text-xs font-mono font-semibold transition-colors ${
                  currentCompany.ticker === t
                    ? 'bg-[#FF4D4D] text-white shadow-sm'
                    : 'text-[#8a94a6] hover:text-white hover:bg-[#161c2b]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter ticker (e.g. AAPL, NVDA, TSLA)..."
              className="w-full bg-[#080b10] border border-[#222a3d] focus:border-[#FF4D4D] px-8 py-1.5 text-xs text-white placeholder-[#525f7a] font-mono outline-none transition-colors"
            />
            <Search className="h-3.5 w-3.5 text-[#525f7a] absolute left-2.5 top-2.5" />
            <button
              type="submit"
              className="absolute right-1 top-1 px-2 py-0.5 bg-[#1b2233] hover:bg-[#252f47] text-[10px] font-mono text-[#a5b4fc] border border-[#2d3852]"
            >
              LOOKUP
            </button>
          </form>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPriorityModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10141f] hover:bg-[#161c2b] border border-[#242c3e] text-xs font-mono text-[#a0aec0] transition-colors"
            title="Inspect 4-Tier Data Pipeline Priority"
          >
            <Layers className="h-3.5 w-3.5 text-[#a5b4fc]" />
            <span className="hidden sm:inline">DATA PRIORITY</span>
          </button>

          <button
            onClick={onOpenArchitectureModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10141f] hover:bg-[#161c2b] border border-[#242c3e] text-xs font-mono text-[#a0aec0] transition-colors"
            title="View Standalone Vercel & Render Repository Code"
          >
            <Code2 className="h-3.5 w-3.5 text-[#ECC94B]" />
            <span className="hidden sm:inline">STANDALONE REPO</span>
          </button>

          <button
            onClick={onExportPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FF4D4D] hover:bg-[#e53e3e] text-white text-xs font-mono font-bold shadow-[0_0_15px_rgba(255,77,77,0.3)] transition-all disabled:opacity-50"
          >
            {isExportingPdf ? (
              <>
                <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>GENERATING...</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                <span>EXPORT AUDIT PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
