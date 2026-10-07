import React, { useState } from 'react';
import { 
  Layers, 
  Download, 
  Bookmark, 
  Zap, 
  ChevronDown, 
  Globe, 
  LogOut,
  User
} from 'lucide-react';
import { CompanyForensicProfile, UserSession } from '../types';
import { Logo } from './Logo';
import { TickerSearch } from './TickerSearch';

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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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
          <span className="text-emerald-400 font-medium hidden sm:inline">NYSE &amp; NASDAQ Verified Registry</span>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden md:inline">Live Yahoo Finance Telemetry</span>
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
      <div className="px-4 py-2.5 flex items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        {/* Modern Brand Logo */}
        <div className="shrink-0">
          <Logo onClick={onNavigateToLanding} size="md" showSubtitle={false} />
        </div>

        {/* Clean, Spacious Institutional Ticker Search */}
        <div className="flex-1 max-w-xl mx-2">
          <TickerSearch
            onSelectCompany={onSelectCompany}
            currentTicker={currentCompany.ticker}
            placeholder="Search NYSE / NASDAQ ticker or company (e.g. AAPL, NVDA, Google)..."
            variant="navbar"
          />
        </div>

        {/* Active Stock Quote Pill */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg font-mono text-xs shrink-0">
          <span className="font-bold text-white">{currentCompany.ticker}</span>
          <span className="text-white font-semibold">${currentCompany.stockPrice.toFixed(2)}</span>
          <span className={currentCompany.priceChangePercent >= 0 ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
            {currentCompany.priceChangePercent >= 0 ? '+' : ''}{Number(currentCompany.priceChangePercent).toFixed(2)}%
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5"></span>
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
