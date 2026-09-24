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
  CheckCircle2,
  AlertCircle,
  User
} from 'lucide-react';
import { CompanyForensicProfile, UserSession } from '../types';
import { isValidStockTicker } from '../data/companyData';
import { Logo } from './Logo';

interface HeaderProps {
  currentCompany: CompanyForensicProfile;
  onSelectCompany: (ticker: string) => void;
  onOpenPriorityModal: () => void;
  onOpenLiveScan: () => void;
  onOpenInvestigationQueue: () => void;
  onOpenProfileModal?: () => void;
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
  onOpenProfileModal,
  investigationCount,
  onExportPdf,
  isExportingPdf,
  userSession,
  onNavigateToLanding,
  onLogout
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const popularTickers = ['AAPL', 'NVDA', 'MSFT', 'PLTR', 'TSLA', 'AMD', 'COIN'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = searchInput.trim().toUpperCase();
    if (!raw) return;

    if (!isValidStockTicker(raw)) {
      setSearchError(`"${raw}" is not a valid US stock ticker format. Enter any US ticker listed on Yahoo Finance, NYSE, or NASDAQ (e.g. AAPL, NVDA, PLTR, TSLA, AMD, COIN).`);
      setTimeout(() => setSearchError(null), 5000);
      return;
    }

    setSearchError(null);
    onSelectCompany(raw);
    setSearchInput('');
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
          <span className="text-slate-400 hidden sm:inline">All US Stock Tickers Supported</span>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden md:inline">Yahoo Finance TTM Telemetry</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPriorityModal}
            className="hover:text-red-400 flex items-center gap-1.5 text-slate-300 transition-colors font-medium cursor-pointer"
          >
            <Layers className="h-3.5 w-3.5 text-red-500" />
            <span>Data Sourcing &amp; Pipeline Architecture</span>
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
            {popularTickers.slice(0, 6).map((t) => (
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

          <div className="relative flex-1">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (searchError) setSearchError(null);
                }}
                placeholder="Search ANY US stock ticker on Yahoo Finance (e.g. AAPL, PLTR, AMD)..."
                className="w-full bg-slate-900/90 border border-slate-800 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 px-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 rounded-lg outline-none transition-all font-sans"
              />
              <Search className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              {searchInput && (
                <button
                  type="submit"
                  className="absolute right-1.5 top-1 px-2 py-0.5 bg-red-600 hover:bg-red-500 text-[10px] font-sans text-white rounded font-medium transition-colors"
                >
                  Scan
                </button>
              )}
            </form>

            {searchError && (
              <div className="absolute top-full left-0 right-0 mt-1.5 p-2.5 bg-red-950/95 border border-red-500/60 rounded-lg shadow-xl text-xs text-red-200 z-50 flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-red-300">Invalid Stock Ticker</div>
                  <div className="text-[11px] text-red-200/90 mt-0.5">{searchError}</div>
                </div>
                <button 
                  type="button"
                  onClick={() => setSearchError(null)}
                  className="text-red-400 hover:text-white text-xs px-1"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
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
              className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-sans text-slate-200 transition-colors cursor-pointer"
            >
              <div className="h-6 w-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-200">
                {userSession?.name ? userSession.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden xl:inline max-w-[120px] truncate text-slate-300 font-medium">
                {userSession ? userSession.name : 'Profile'}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-60 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 p-2 font-sans text-xs">
                {/* Clean Normal Profile Info Header */}
                <div className="pb-2.5 border-b border-slate-800 mb-2 px-1">
                  <div className="font-semibold text-slate-100 truncate text-xs">
                    {userSession?.name || 'User'}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {userSession?.email || 'user@example.com'}
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      if (onOpenProfileModal) onOpenProfileModal();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenInvestigationQueue();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Bookmark className="h-3.5 w-3.5 text-red-400" />
                    <span>Saved Queue ({investigationCount})</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenLiveScan();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Zap className="h-3.5 w-3.5 text-amber-400" />
                    <span>Run SEC Rescan</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigateToLanding();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Globe className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Cover Page</span>
                  </button>

                  <div className="pt-1 border-t border-slate-800 mt-1">
                    <button
                      onClick={() => {
                        onLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded text-red-400 hover:bg-red-950/40 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
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
