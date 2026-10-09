import React, { useState, useMemo, useEffect } from 'react';
import { Header } from '../components/Header';
import { ExecutiveSummary } from '../components/ExecutiveSummary';
import { StockMarketChart } from '../components/StockMarketChart';
import { MultiYearFinancials } from '../components/MultiYearFinancials';
import { ForensicFlagMatrix } from '../components/ForensicFlagMatrix';
import { DataSourcePriorityModal } from '../components/DataSourcePriorityModal';
import { LiveSecScanModal } from '../components/LiveSecScanModal';
import { InvestigationQueueDrawer } from '../components/InvestigationQueueDrawer';
import { StressTestSimulator } from '../components/StressTestSimulator';
import { Footer } from '../components/Footer';
import { getDeterministicCompanyProfile, isValidStockTicker, applyIndustryLensToProfile } from '../data/companyData';
import { resolveQueryToTicker } from '../data/nyseNasdaqRegistry';
import { generateAuditPdf } from '../services/pdfGenerator';
import { automaticallyAllocateIndustryLens, VALID_7_LENSES } from '../services/industryClassifier';
import { recalculateCompanyProfileForensics } from '../services/forensicCalculations';
import { CalculationTransparencyModal } from '../components/CalculationTransparencyModal';
import { fetchLiveYahooQuote, LiveYahooQuote } from '../services/yahooFinanceService';
import { TerminalNavbar, TerminalPage } from '../components/TerminalNavbar';
import { 
  UserSession, 
  InvestigationItem, 
  ForensicFlag,
  IndustryLens
} from '../types';
import { 
  CheckCircle2, 
  Zap, 
  Bookmark, 
  ChevronDown, 
  BarChart3, 
  ShieldAlert, 
  Table, 
  Activity, 
  FileCheck2, 
  Layers, 
  Sparkles, 
  FileSpreadsheet, 
  FileCheck,
  Download,
  Trash2,
  Edit3,
  ExternalLink,
  Plus
} from 'lucide-react';
import { AuditGovernanceDossier } from '../components/AuditGovernanceDossier';
import { LensSubPage } from '../components/LensSubPage';
import { InputSheetModal } from '../components/InputSheetModal';
import { ProfileModal } from '../components/ProfileModal';
import { SaaSSettingsModal } from '../components/SaaSSettingsModal';
import { PricingModal } from '../components/PricingModal';

interface DashboardPageProps {
  currentTicker: string;
  onSelectTicker: (ticker: string) => void;
  activeTerminalPage?: TerminalPage;
  onNavigateTerminalPage?: (page: TerminalPage) => void;
  initialLens?: IndustryLens;
  userSession: UserSession | null;
  onUpdateUserSession?: (session: UserSession) => void;
  onNavigateToLanding: () => void;
  onLogout: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentTicker,
  onSelectTicker,
  activeTerminalPage = 'terminal',
  onNavigateTerminalPage,
  initialLens,
  userSession,
  onUpdateUserSession,
  onNavigateToLanding,
  onLogout
}) => {
  const [internalPage, setInternalPage] = useState<TerminalPage>(activeTerminalPage);
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isLiveScanOpen, setIsLiveScanOpen] = useState<boolean>(false);
  const [isInvestigationQueueOpen, setIsInvestigationQueueOpen] = useState<boolean>(false);
  const [isInputSheetOpen, setIsInputSheetOpen] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState<boolean>(false);
  const [pollingIntervalMs, setPollingIntervalMs] = useState<number>(5000);
  const [notification, setNotification] = useState<string | null>(null);
  const [investigationItems, setInvestigationItems] = useState<InvestigationItem[]>([]);
  const [lastScanTime, setLastScanTime] = useState<string>('Just now');
  const [liveQuote, setLiveQuote] = useState<LiveYahooQuote | null>(null);
  
  // Note editing in investigation workspace
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState<string>('');

  // Synchronize internal page with prop
  useEffect(() => {
    if (activeTerminalPage) {
      setInternalPage(activeTerminalPage);
    }
  }, [activeTerminalPage]);

  const handlePageNavigation = (page: TerminalPage) => {
    setInternalPage(page);
    if (onNavigateTerminalPage) {
      onNavigateTerminalPage(page);
    }
  };

  // Base deterministic company profile
  const baseCompanyProfile = useMemo(() => {
    const profile = getDeterministicCompanyProfile(currentTicker);
    if (profile) return profile;
    return getDeterministicCompanyProfile('AAPL')!;
  }, [currentTicker]);

  // Active Industry Lens state (automatically allocated based on company sector)
  const [selectedLens, setSelectedLens] = useState<IndustryLens>(() => {
    return initialLens || automaticallyAllocateIndustryLens(
      baseCompanyProfile.ticker,
      baseCompanyProfile.name,
      baseCompanyProfile.sector
    );
  });

  // Automatically allocate industry lens based on sector context if not overridden
  useEffect(() => {
    if (initialLens) {
      setSelectedLens(initialLens);
    } else {
      const auto = automaticallyAllocateIndustryLens(
        baseCompanyProfile.ticker,
        baseCompanyProfile.name,
        baseCompanyProfile.sector
      );
      setSelectedLens(auto);
    }
  }, [baseCompanyProfile.ticker, baseCompanyProfile.name, baseCompanyProfile.sector, initialLens]);

  // Dynamically evaluated profile according to active industry lens and live Yahoo market telemetry
  const companyProfile = useMemo(() => {
    let profile = baseCompanyProfile;
    const activeLens = selectedLens || baseCompanyProfile.lens;
    if (activeLens !== baseCompanyProfile.lens) {
      profile = applyIndustryLensToProfile(baseCompanyProfile, activeLens);
    }
    if (liveQuote && liveQuote.isLiveNetwork) {
      profile = {
        ...profile,
        stockPrice: liveQuote.regularMarketPrice,
        priceChangePercent: liveQuote.regularMarketChangePercent,
        marketCap: liveQuote.marketCap ?? profile.marketCap
      };
      profile = recalculateCompanyProfileForensics(profile, liveQuote.marketCap);
    }
    return profile;
  }, [baseCompanyProfile, selectedLens, liveQuote]);

  const handleSelectIndustryLens = (lens: IndustryLens) => {
    setSelectedLens(lens);
    setNotification(`Switched ${companyProfile.ticker} audit lens to ${lens} (30 specialized flags loaded).`);
    setTimeout(() => setNotification(null), 3500);
  };

  // Synchronize live Yahoo Finance Telemetry continuously (5s polling for real-time fluctuations)
  useEffect(() => {
    let active = true;

    const pullLiveQuote = () => {
      fetchLiveYahooQuote(currentTicker).then((quote) => {
        if (active && quote) {
          setLiveQuote(quote);
        }
      });
    };

    pullLiveQuote();
    const intervalId = setInterval(pullLiveQuote, pollingIntervalMs);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [currentTicker, pollingIntervalMs]);

  const handleForceSyncLiveQuote = () => {
    fetchLiveYahooQuote(currentTicker).then((quote) => {
      if (quote) {
        setLiveQuote(quote);
        setNotification(`Synchronized real-time quote for ${currentTicker}: $${quote.regularMarketPrice.toFixed(2)} (${quote.regularMarketChange >= 0 ? '+' : ''}$${quote.regularMarketChange.toFixed(2)} / ${quote.regularMarketChangePercent >= 0 ? '+' : ''}${quote.regularMarketChangePercent.toFixed(2)}%)`);
        setTimeout(() => setNotification(null), 3000);
      }
    });
  };

  const handleSelectTickerWithToast = (ticker: string) => {
    const resolved = resolveQueryToTicker(ticker);
    if (!resolved || !isValidStockTicker(resolved)) {
      const clean = ticker.toUpperCase().trim();
      setNotification(`⚠️ Please use a valid ticker. "${clean}" was not found among NYSE or NASDAQ listed companies.`);
      setTimeout(() => setNotification(null), 5000);
      return;
    }
    onSelectTicker(resolved);
    setNotification(`Audited profile for ${resolved} loaded. SEC EDGAR facts & Yahoo telemetry synchronized.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleToggleInvestigation = (flag: ForensicFlag, note?: string) => {
    const existingIndex = investigationItems.findIndex(
      (item) => item.flagCode === flag.code && item.ticker === companyProfile.ticker
    );

    if (existingIndex >= 0) {
      setInvestigationItems((prev) => prev.filter((_, idx) => idx !== existingIndex));
      setNotification(`Removed ${flag.code} from investigation queue.`);
    } else {
      const newItem: InvestigationItem = {
        id: `inv_${Date.now()}_${flag.code}`,
        ticker: companyProfile.ticker,
        flagCode: flag.code,
        flagTitle: flag.title,
        lens: flag.lens,
        severity: flag.status,
        addedAt: new Date().toLocaleTimeString(),
        note: note || ''
      };
      setInvestigationItems((prev) => [newItem, ...prev]);
      setNotification(`Added ${flag.code} (${flag.title}) to investigation queue.`);
    }
    setTimeout(() => setNotification(null), 3500);
  };

  const handleRemoveInvestigationItem = (id: string) => {
    setInvestigationItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearInvestigationQueue = () => {
    setInvestigationItems([]);
    setNotification('Active investigation queue cleared.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateInvestigationNote = (id: string, newNote: string) => {
    setInvestigationItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, note: newNote } : item))
    );
  };

  const handleLiveScanComplete = () => {
    setLastScanTime('A moment ago');
    setNotification(`SEC EDGAR deep rescan completed for ${companyProfile.name} (${companyProfile.ticker}).`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleExportPdf = () => {
    setIsExportingPdf(true);
    setTimeout(() => {
      try {
        generateAuditPdf(companyProfile);
        setNotification(`Downloaded ${companyProfile.ticker}_RedFlag_Forensic_Audit_Report.pdf`);
        setTimeout(() => setNotification(null), 4000);
      } catch (err) {
        console.error('PDF error:', err);
      } finally {
        setIsExportingPdf(false);
      }
    }, 250);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-red-500 selection:text-white bg-slate-950 text-slate-200">
      {/* 1. TOP HEADER */}
      <Header
        currentCompany={companyProfile}
        liveQuote={liveQuote}
        onRefreshLiveQuote={handleForceSyncLiveQuote}
        onSelectCompany={handleSelectTickerWithToast}
        onOpenPriorityModal={() => setIsPriorityModalOpen(true)}
        onOpenLiveScan={() => setIsLiveScanOpen(true)}
        onOpenInvestigationQueue={() => handlePageNavigation('queue')}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenPricingModal={() => setIsPricingModalOpen(true)}
        investigationCount={investigationItems.length}
        onExportPdf={handleExportPdf}
        isExportingPdf={isExportingPdf}
        userSession={userSession}
        onNavigateToLanding={onNavigateToLanding}
        onLogout={onLogout}
      />

      {/* 2. DEDICATED MULTI-PAGE TERMINAL NAVIGATION BAR */}
      <TerminalNavbar
        currentPage={internalPage}
        onNavigate={handlePageNavigation}
        currentCompany={companyProfile}
        investigationCount={investigationItems.length}
      />

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Dynamic Notification Toast */}
        {notification && (
          <div className="p-3 bg-slate-900/90 border border-emerald-500/40 text-xs font-sans text-emerald-400 flex items-center justify-between rounded-xl shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{notification}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-500 hover:text-slate-300 text-xs ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 1: EXECUTIVE TERMINAL OVERVIEW                                       */}
        {/* ========================================================================= */}
        {internalPage === 'terminal' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Company Quick Profile Banner */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-5 shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-center text-red-400 font-mono font-bold text-base">
                  {companyProfile.ticker}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold text-white">
                      {companyProfile.name}
                    </h2>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[11px] rounded font-mono">
                      CIK: {companyProfile.cik}
                    </span>
                    <span className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/30 text-[11px] rounded font-mono font-semibold">
                      {companyProfile.lens} Lens
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                    <span>{companyProfile.sector}</span>
                    <span>•</span>
                    <span>Audited FY22–FY26 10-K &amp; TTM XBRL Feeds</span>
                  </div>
                </div>
              </div>

              {/* Quick Metrics Strip */}
              <div className="flex flex-wrap items-center gap-6 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">Live Stock Price</span>
                  <span className="text-white font-bold font-mono text-base">
                    ${(liveQuote?.regularMarketPrice ?? companyProfile.stockPrice).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">24h Change</span>
                  <span
                    className={`font-bold font-mono text-base ${
                      (liveQuote?.regularMarketChangePercent ?? companyProfile.priceChangePercent) >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {(liveQuote?.regularMarketChangePercent ?? companyProfile.priceChangePercent) >= 0 ? '+' : ''}
                    {(liveQuote?.regularMarketChangePercent ?? companyProfile.priceChangePercent).toFixed(2)}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Market Cap</span>
                  <span className="text-slate-200 font-bold font-mono text-base">
                    {liveQuote?.marketCap ? `$${liveQuote.marketCap}B` : `$${companyProfile.marketCap}B`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Forensic Health</span>
                  <span className="text-white font-bold font-mono text-base">
                    {companyProfile.forensicScore}/100 ({companyProfile.scoreGrade})
                  </span>
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <ExecutiveSummary company={companyProfile} />

            {/* Interactive Stock Market Chart with Alternative Solutions */}
            <StockMarketChart company={companyProfile} />

            {/* Quick Action Navigation Strip to other pages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <button
                onClick={() => handlePageNavigation('lenses')}
                className="p-4 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left transition-all cursor-pointer group space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold text-purple-400">
                  <span>Explore {companyProfile.lens} Sub-Page</span>
                  <Layers className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-400">
                  Inspect sector peer benchmarks, formulas &amp; stress simulations.
                </p>
              </button>

              <button
                onClick={() => handlePageNavigation('matrix')}
                className="p-4 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left transition-all cursor-pointer group space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-400">
                  <span>Audit 30 Red Flags Matrix</span>
                  <ShieldAlert className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-400">
                  Review complete line-item disclosures and historical trends.
                </p>
              </button>

              <button
                onClick={() => handlePageNavigation('financials')}
                className="p-4 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left transition-all cursor-pointer group space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
                  <span>Multi-Year Financials</span>
                  <Table className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-400">
                  Analyze audited balance sheets, cash flows &amp; working capital.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 2: DEDICATED 7 INDUSTRY LENS SUB-PAGES                               */}
        {/* ========================================================================= */}
        {internalPage === 'lenses' && (
          <div className="animate-fadeIn">
            <LensSubPage
              currentLens={companyProfile.lens}
              company={companyProfile}
              onSelectLens={(l) => handleSelectIndustryLens(l)}
              onSelectCompany={(tk) => handleSelectTickerWithToast(tk)}
              onToggleInvestigation={handleToggleInvestigation}
              investigationCodes={investigationItems.map((i) => i.flagCode)}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 3: 30 RED FLAGS FORENSIC MATRIX                                      */}
        {/* ========================================================================= */}
        {internalPage === 'matrix' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-amber-400" />
                  <span>30 Red Flags Forensic Audit Matrix — {companyProfile.name} ({companyProfile.ticker})</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Full 30-rule forensic audit calibrated for the {companyProfile.lens} sector. Every flag references SEC EDGAR XBRL citations.
                </p>
              </div>
              <button
                onClick={() => setIsInputSheetOpen(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950/40 text-red-300 border border-red-500/30 flex items-center gap-1.5 cursor-pointer hover:bg-red-900/50"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-red-400" />
                <span>Input Sheet (27 Docs)</span>
              </button>
            </div>

            <ForensicFlagMatrix
              company={companyProfile}
              investigationItems={investigationItems}
              onToggleInvestigation={handleToggleInvestigation}
              auditSensitivity="standard"
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 4: MULTI-YEAR AUDITED FINANCIAL STATEMENTS                           */}
        {/* ========================================================================= */}
        {internalPage === 'financials' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Table className="h-5 w-5 text-emerald-400" />
                  <span>Multi-Year Audited Financial Statements — {companyProfile.name} ({companyProfile.ticker})</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  FY22 through FY26 + TTM audited Income Statement, Balance Sheet, Cash Flows, and Working Capital Ratios.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                Audited Ground Truth
              </span>
            </div>

            <MultiYearFinancials company={companyProfile} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 5: FORENSIC STRESS TEST & SCENARIO SIMULATOR                         */}
        {/* ========================================================================= */}
        {internalPage === 'simulator' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-400" />
                  <span>Interactive Stress Test Simulator — {companyProfile.name} ({companyProfile.ticker})</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Simulate adverse accounting shocks (revenue restatements, inventory markdowns, bad debt spikes) and inspect health score re-evaluations.
                </p>
              </div>
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1 rounded-lg">
                Deterministic Model
              </span>
            </div>

            <StressTestSimulator company={companyProfile} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 6: SEC FILINGS & AUDITOR GROUND TRUTH                                */}
        {/* ========================================================================= */}
        {internalPage === 'filings' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <FileCheck2 className="h-5 w-5 text-sky-400" />
                  <h2 className="text-base font-bold text-white">
                    Audited SEC Filing Verifications &amp; Ground Truth Records
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  SEC EDGAR accession numbers, periodic filing dates, independent auditor opinions, and Form 10-K/10-Q filings for CIK #{companyProfile.cik}.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLiveScanOpen(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 cursor-pointer hover:bg-amber-500/25"
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Rescan SEC EDGAR</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {companyProfile.filingAuditLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
                >
                  <div className="space-y-1.5 font-sans">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="px-2.5 py-0.5 bg-sky-500/10 text-sky-400 font-bold rounded text-xs border border-sky-500/30">
                        Form {log.filingType}
                      </span>
                      <span className="text-white font-semibold">
                        Period Ended: {log.periodEnd}
                      </span>
                      <span className="text-slate-600">|</span>
                      <span className="text-slate-400">Filed: {log.filingDate}</span>
                    </div>
                    <div className="text-slate-400 font-mono text-[11px]">
                      Accession Number: <span className="text-slate-200">{log.secAccessionNumber}</span>
                    </div>
                  </div>

                  <div className="sm:text-right space-y-1 font-sans">
                    <div className="text-slate-200 font-semibold">{log.auditor}</div>
                    <div className="text-emerald-400 text-xs font-medium flex items-center sm:justify-end gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{log.auditorOpinion}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 7: INVESTIGATION QUEUE & REPORT GENERATOR WORKSPACE                  */}
        {/* ========================================================================= */}
        {internalPage === 'queue' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-rose-400" />
                  <h2 className="text-base font-bold text-white">
                    Forensic Investigation Queue Workspace
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Manage flagged accounting anomalies, attach investigator notes, and export professional audit dossiers.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {investigationItems.length > 0 && (
                  <button
                    onClick={handleClearInvestigationQueue}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-slate-400" />
                    <span>Clear Queue</span>
                  </button>
                )}

                <button
                  onClick={handleExportPdf}
                  disabled={isExportingPdf}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{isExportingPdf ? 'Exporting PDF...' : 'Download Full Audit Report (PDF)'}</span>
                </button>
              </div>
            </div>

            {investigationItems.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Bookmark className="h-10 w-10 text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-slate-300">No flags in your investigation queue yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Browse the 30 Red Flags Matrix or any of the 7 Sector Lens sub-pages, then click &quot;Investigate&quot; to queue anomalies here for report generation.
                </p>
                <button
                  onClick={() => handlePageNavigation('matrix')}
                  className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>Explore 30 Red Flags Matrix</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {investigationItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-white">
                          {item.flagCode}
                        </span>
                        <span className="text-xs font-bold text-white">{item.flagTitle}</span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                          {item.ticker} · {item.lens}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          item.severity === 'Critical Anomaly'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : item.severity === 'Warning'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {item.severity}
                        </span>

                        <button
                          onClick={() => handleRemoveInvestigationItem(item.id)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                          title="Remove from queue"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Investigator Note */}
                    <div className="pt-2 border-t border-slate-800/80">
                      {editingItemId === item.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editingNoteText}
                            onChange={(e) => setEditingNoteText(e.target.value)}
                            placeholder="Add forensic notes or audit observations..."
                            rows={2}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-red-500"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingItemId(null)}
                              className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                handleUpdateInvestigationNote(item.id, editingNoteText);
                                setEditingItemId(null);
                              }}
                              className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-semibold"
                            >
                              Save Note
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <p className="italic">
                            {item.note || 'No notes attached. Click to add forensic commentary.'}
                          </p>
                          <button
                            onClick={() => {
                              setEditingItemId(item.id);
                              setEditingNoteText(item.note || '');
                            }}
                            className="text-slate-500 hover:text-slate-300 flex items-center gap-1 text-[11px] cursor-pointer"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Edit Note</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <Footer />

      {/* MODALS */}
      <DataSourcePriorityModal
        isOpen={isPriorityModalOpen}
        onClose={() => setIsPriorityModalOpen(false)}
      />

      <LiveSecScanModal
        isOpen={isLiveScanOpen}
        onClose={() => setIsLiveScanOpen(false)}
        company={companyProfile}
        onScanComplete={handleLiveScanComplete}
      />

      <InvestigationQueueDrawer
        isOpen={isInvestigationQueueOpen}
        onClose={() => setIsInvestigationQueueOpen(false)}
        items={investigationItems}
        onRemoveItem={handleRemoveInvestigationItem}
        onClearAll={handleClearInvestigationQueue}
        onUpdateNote={handleUpdateInvestigationNote}
      />

      <InputSheetModal
        isOpen={isInputSheetOpen}
        onClose={() => setIsInputSheetOpen(false)}
      />

      {userSession && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          userSession={userSession}
          onUpdateUserSession={(updated: UserSession) => {
            if (onUpdateUserSession) onUpdateUserSession(updated);
            setNotification('Analyst profile preferences updated.');
            setTimeout(() => setNotification(null), 3000);
          }}
        />
      )}

      <SaaSSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        userSession={userSession}
        onUpdateUserSession={(updated: UserSession) => {
          if (onUpdateUserSession) onUpdateUserSession(updated);
        }}
        pollingIntervalMs={pollingIntervalMs}
        onUpdatePollingInterval={(ms: number) => setPollingIntervalMs(ms)}
      />

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        onSelectPlan={(planName: string) => {
          setIsPricingModalOpen(false);
          setNotification(`Upgraded to ${planName} Plan.`);
          setTimeout(() => setNotification(null), 3500);
        }}
      />
    </div>
  );
};
