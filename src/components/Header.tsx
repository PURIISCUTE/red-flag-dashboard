import React, { useState } from 'react';
import { 
  Search, 
  Layers, 
  Download, 
  Bookmark, 
  Zap, 
  ChevronDown, 
  Globe, 
  LogOut,
  LayoutDashboard,
  CheckCircle2
} from 'lucide-react';
import { CompanyForensicProfile, UserSession } from '../types';
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
  onLogout
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const popularTickers = ['AAPL', 'NVDA', 'MSFT', 'AMZN', 'PYPL', 'JPM', 'TSLA'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSelectCompany(searchInput.trim().toUpperCase());
      setSearchInput('');
    }
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur sticky top-0 z-40">
      {/* Sleek Subheader Status */}
      <div className="border-b border-slate-800/40 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs text-slate-400 font-sans">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-300 font-medium">SEC EDGAR API: Connected</span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400 hidden sm:inline">210 Heuristic Rules Active</span>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden md:inline">Real-time Yahoo TTM Feeds</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPriorityModal}
            className="hover:text-slate-200 flex items-center gap-1 text-slate-400 transition-colors"
          >
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Data Priority</span>
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={onNavigateToLanding}
            className="hover:text-slate-200 flex items-center gap-1 text-slate-400 transition-colors"
          >
            <Globe className="h-3.5 w-3.5 text-slate-400" />
            <span>Cover Page</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 max-w-7xl mx-auto w-full">
        {/* Modern Brand Logo */}
        <Logo onClick={onNavigateToLanding} size="md" showSubtitle={false} />

        {/* Ticker Search & Quick Switcher */}
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 border border-slate-800 rounded-lg">
            {popularTickers.slice(0, 5).map((t) => (
              <button
                key={t}
                onClick={() => onSelectCompany(t)}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-all ${
                  currentCompany.ticker === t
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
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
              placeholder="Search ticker (e.g. AAPL, NVDA, TSLA)..."
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 px-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 rounded-lg outline-none transition-all font-sans"
            />
            <Search className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            {searchInput && (
              <button
                type="submit"
                className="absolute right-1.5 top-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-[10px] font-sans text-slate-200 rounded border border-slate-700"
              >
                Scan
              </button>
            )}
          </form>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Live SEC Rescan Button */}
          <button
            onClick={onOpenLiveScan}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-sans font-medium text-slate-200 rounded-lg transition-colors"
            title="Execute live SEC EDGAR XBRL ingestion"
          >
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Live SEC Scan</span>
          </button>

          {/* Investigation Queue Drawer Button */}
          <button
            onClick={onOpenInvestigationQueue}
            className="relative flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-sans font-medium text-slate-200 rounded-lg transition-colors"
            title="Open investigation queue"
          >
            <Bookmark className="h-3.5 w-3.5 text-red-400" />
            <span className="hidden sm:inline">Queue</span>
            {investigationCount > 0 && (
              <span className="px-1.5 py-0.2 bg-red-500 text-white text-[10px] font-bold rounded-full">
                {investigationCount}
              </span>
            )}
          </button>

          {/* Export PDF */}
          <button
            onClick={onExportPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-sans font-medium rounded-lg shadow-sm transition-all disabled:opacity-50"
          >
            {isExportingPdf ? (
              <>
                <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Export Audit PDF</span>
                <span className="sm:hidden">PDF</span>
              </>
            )}
          </button>

          {/* User Profile Menu */}
          <div className="relative ml-1">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-sans text-slate-200 transition-colors"
            >
              <div className="h-5 w-5 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-[10px] font-bold text-red-400">
                {userSession ? userSession.name.charAt(0) : 'U'}
              </div>
              <span className="hidden xl:inline max-w-[100px] truncate text-slate-300">
                {userSession ? userSession.name : 'Analyst'}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-60 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 p-2 font-sans text-xs">
                <div className="pb-2 border-b border-slate-800 mb-2 px-1">
                  <div className="font-semibold text-slate-100 truncate">
                    {userSession?.name || 'Institutional Analyst'}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {userSession?.email || 'analyst@redflagterminal.com'}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded">
                      {userSession?.tier || 'Institutional'}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate">
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
                    className="w-full text-left px-2 py-1.5 rounded text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Globe className="h-3.5 w-3.5 text-indigo-400" />
                    <span>View Cover Page</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenLiveScan();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Zap className="h-3.5 w-3.5 text-amber-400" />
                    <span>Run SEC Rescan</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenInvestigationQueue();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Bookmark className="h-3.5 w-3.5 text-red-400" />
                    <span>Investigation Queue ({investigationCount})</span>
                  </button>
                  <div className="pt-1 border-t border-slate-800 mt-1">
                    <button
                      onClick={() => {
                        onLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded text-red-400 hover:bg-red-950/40 flex items-center gap-2"
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
