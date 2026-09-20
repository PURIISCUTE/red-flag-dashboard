import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Layers, 
  Download, 
  Terminal,
  ShieldCheck,
  Bookmark,
  Zap,
  Sliders,
  User,
  LogOut,
  ChevronDown,
  Globe
} from 'lucide-react';
import { CompanyForensicProfile, UserSession, AuditSensitivity } from '../types';
import { Logo } from './Logo';

interface HeaderProps {
  currentCompany: CompanyForensicProfile;
  onSelectCompany: (ticker: string) => void;
  onOpenPriorityModal: () => void;
  onOpenLiveScan: () => void;
  onOpenInvestigationQueue: () => void;
  investigationCount: number;
  onExportPdf: () => void;
  isExportingPdf: boolean;
  userSession: UserSession | null;
  onNavigateToLanding: () => void;
  onLogout: () => void;
  auditSensitivity: AuditSensitivity;
  onChangeSensitivity: (sensitivity: AuditSensitivity) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCompany,
  onSelectCompany,
  onOpenPriorityModal,
  onOpenLiveScan,
  onOpenInvestigationQueue,
  investigationCount,
  onExportPdf,
  isExportingPdf,
  userSession,
  onNavigateToLanding,
  onLogout,
  auditSensitivity,
  onChangeSensitivity
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSensitivityMenuOpen, setIsSensitivityMenuOpen] = useState(false);
  const popularTickers = ['AAPL', 'NVDA', 'MSFT', 'AMZN', 'PYPL', 'JPM', 'TSLA'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSelectCompany(searchInput.trim().toUpperCase());
      setSearchInput('');
    }
  };

  return (
    <header className="border-b border-[#222736] bg-[#0c0f17]/95 backdrop-blur sticky top-0 z-40">
      {/* Top Telemetry Bar */}
      <div className="border-b border-[#1c2130] px-4 py-1.5 flex flex-wrap items-center justify-between text-[11px] font-mono text-[#8a94a6]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#38A169] animate-pulse"></span>
            <span className="text-[#a5b4fc]">SEC EDGAR: CONNECTED (XBRL API v2.1)</span>
          </div>
          <span className="text-[#333d52]">|</span>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ECC94B]"></span>
            <span>YAHOO TTM REAL-TIME FEED</span>
          </div>
          <span className="text-[#333d52]">|</span>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#38A169]"></span>
            <span>210 BENCHMARK HEURISTICS</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Sensitivity Indicator */}
          <div className="relative">
            <button
              onClick={() => setIsSensitivityMenuOpen(!isSensitivityMenuOpen)}
              className="flex items-center gap-1 text-[#cbd5e1] hover:text-white px-2 py-0.5 bg-[#141b2b] border border-[#26344d] rounded-xs"
            >
              <Sliders className="h-3 w-3 text-[#ECC94B]" />
              <span>SENSITIVITY: {auditSensitivity.toUpperCase()}</span>
              <ChevronDown className="h-2.5 w-2.5" />
            </button>

            {isSensitivityMenuOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-[#0d121c] border border-[#232f48] shadow-2xl z-50 p-1 text-xs">
                <div className="px-2 py-1 text-[10px] text-[#718096] uppercase border-b border-[#1c263a]">
                  Forensic Tolerance Engine
                </div>
                <button
                  onClick={() => {
                    onChangeSensitivity('standard');
                    setIsSensitivityMenuOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 flex items-center justify-between ${
                    auditSensitivity === 'standard' ? 'bg-[#1e293f] text-[#38A169] font-bold' : 'text-[#a0aec0] hover:bg-[#161f30]'
                  }`}
                >
                  <span>Standard (Institutional)</span>
                  {auditSensitivity === 'standard' && <span className="h-1.5 w-1.5 rounded-full bg-[#38A169]"></span>}
                </button>
                <button
                  onClick={() => {
                    onChangeSensitivity('conservative');
                    setIsSensitivityMenuOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 flex items-center justify-between ${
                    auditSensitivity === 'conservative' ? 'bg-[#1e293f] text-[#ECC94B] font-bold' : 'text-[#a0aec0] hover:bg-[#161f30]'
                  }`}
                >
                  <span>Conservative (+15% Strict)</span>
                  {auditSensitivity === 'conservative' && <span className="h-1.5 w-1.5 rounded-full bg-[#ECC94B]"></span>}
                </button>
                <button
                  onClick={() => {
                    onChangeSensitivity('strict');
                    setIsSensitivityMenuOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 flex items-center justify-between ${
                    auditSensitivity === 'strict' ? 'bg-[#1e293f] text-[#FF4D4D] font-bold' : 'text-[#a0aec0] hover:bg-[#161f30]'
                  }`}
                >
                  <span>PCAOB Strict (Deep Audit)</span>
                  {auditSensitivity === 'strict' && <span className="h-1.5 w-1.5 rounded-full bg-[#FF4D4D]"></span>}
                </button>
              </div>
            )}
          </div>

          <span className="text-[#333d52]">|</span>
          <button
            onClick={onNavigateToLanding}
            className="text-[#a5b4fc] hover:text-white flex items-center gap-1 hover:underline"
          >
            <Globe className="h-3 w-3" />
            <span>COVER PAGE</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Mode */}
        <Logo onClick={onNavigateToLanding} size="md" showSubtitle={true} />

        {/* Dynamic Ticker Switcher & Search Bar */}
        <div className="flex items-center gap-2 flex-1 max-w-xl">
          <div className="hidden xl:flex items-center gap-1 bg-[#090c12] p-1 border border-[#1f2638]">
            {popularTickers.map((t) => (
              <button
                key={t}
                onClick={() => onSelectCompany(t)}
                className={`px-2 py-0.5 text-xs font-mono font-semibold transition-colors ${
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
              placeholder="Search ticker (e.g. AAPL, NVDA, TSLA, MSFT)..."
              className="w-full bg-[#080b10] border border-[#222a3d] focus:border-[#FF4D4D] px-8 py-1.5 text-xs text-white placeholder-[#525f7a] font-mono outline-none transition-colors"
            />
            <Search className="h-3.5 w-3.5 text-[#525f7a] absolute left-2.5 top-2.5" />
            <button
              type="submit"
              className="absolute right-1 top-1 px-2 py-0.5 bg-[#1b2233] hover:bg-[#252f47] text-[10px] font-mono text-[#a5b4fc] border border-[#2d3852]"
            >
              RUN AUDIT
            </button>
          </form>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Live SEC Rescan Button */}
          <button
            onClick={onOpenLiveScan}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10141f] hover:bg-[#161c2b] border border-[#242c3e] hover:border-[#3b4766] text-xs font-mono text-[#a5b4fc] transition-colors"
            title="Execute live real-time SEC EDGAR XBRL ingestion"
          >
            <Zap className="h-3.5 w-3.5 text-[#FF4D4D] animate-pulse" />
            <span className="hidden sm:inline">LIVE SEC SCAN</span>
          </button>

          {/* Investigation Queue Drawer Button */}
          <button
            onClick={onOpenInvestigationQueue}
            className="relative flex items-center gap-1.5 px-3 py-1.5 bg-[#10141f] hover:bg-[#161c2b] border border-[#242c3e] hover:border-[#3b4766] text-xs font-mono text-[#cbd5e1] transition-colors"
            title="Open active investigation queue & notes"
          >
            <Bookmark className="h-3.5 w-3.5 text-[#ECC94B]" />
            <span className="hidden sm:inline">QUEUE</span>
            {investigationCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#FF4D4D] text-white text-[10px] font-bold rounded-full">
                {investigationCount}
              </span>
            )}
          </button>

          {/* Data Priority Modal Button */}
          <button
            onClick={onOpenPriorityModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#10141f] hover:bg-[#161c2b] border border-[#242c3e] text-xs font-mono text-[#a0aec0] transition-colors"
            title="Inspect 4-Tier Data Pipeline Priority"
          >
            <Layers className="h-3.5 w-3.5 text-[#a5b4fc]" />
            <span>DATA PRIORITY</span>
          </button>

          {/* Export PDF */}
          <button
            onClick={onExportPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FF4D4D] hover:bg-[#e53e3e] text-white text-xs font-mono font-bold shadow-[0_0_15px_rgba(255,77,77,0.3)] transition-all disabled:opacity-50"
          >
            {isExportingPdf ? (
              <>
                <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>EXPORTING...</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">EXPORT AUDIT PDF</span>
                <span className="sm:hidden">PDF</span>
              </>
            )}
          </button>

          {/* User Profile Menu */}
          <div className="relative ml-1">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-[#141b2a] hover:bg-[#1a2337] border border-[#26334f] text-xs font-mono text-white transition-colors"
            >
              <div className="h-5 w-5 rounded-full bg-[#FF4D4D]/20 border border-[#FF4D4D] flex items-center justify-center text-[10px] font-bold text-[#FF4D4D]">
                {userSession ? userSession.name.charAt(0) : 'U'}
              </div>
              <span className="hidden lg:inline max-w-[110px] truncate">
                {userSession ? userSession.name : 'Analyst Workstation'}
              </span>
              <ChevronDown className="h-3 w-3 text-[#718096]" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-64 bg-[#0d121c] border border-[#222f47] shadow-2xl z-50 p-2 font-mono text-xs">
                <div className="pb-2 border-b border-[#1c273a] mb-2">
                  <div className="font-bold text-white truncate">
                    {userSession?.name || 'Institutional Analyst'}
                  </div>
                  <div className="text-[10px] text-[#718096] truncate">
                    {userSession?.email || 'analyst@redflagterminal.com'}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 bg-[#38A169]/20 text-[#38A169] text-[9px] border border-[#38A169]/40">
                      {userSession?.tier || 'Institutional'} Access
                    </span>
                    <span className="text-[9px] text-[#a5b4fc] truncate">
                      {userSession?.organization || 'Citadel Risk'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      onNavigateToLanding();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-[#cbd5e1] hover:bg-[#172133] hover:text-white flex items-center gap-2"
                  >
                    <Globe className="h-3.5 w-3.5 text-[#a5b4fc]" />
                    <span>View Cover / Landing Page</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenLiveScan();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-[#cbd5e1] hover:bg-[#172133] hover:text-white flex items-center gap-2"
                  >
                    <Zap className="h-3.5 w-3.5 text-[#ECC94B]" />
                    <span>Run Deep SEC Ingestion</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenInvestigationQueue();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-[#cbd5e1] hover:bg-[#172133] hover:text-white flex items-center gap-2"
                  >
                    <Bookmark className="h-3.5 w-3.5 text-[#FF4D4D]" />
                    <span>Investigation Queue ({investigationCount})</span>
                  </button>
                  <div className="pt-1 border-t border-[#1c273a] mt-1">
                    <button
                      onClick={() => {
                        onLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 text-[#FF4D4D] hover:bg-[#251317] flex items-center gap-2"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out to Cover Page</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
