import React, { useState, useMemo } from 'react';
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
import { getDeterministicCompanyProfile, isValidStockTicker } from '../data/companyData';
import { generateAuditPdf } from '../services/pdfGenerator';
import { 
  UserSession, 
  InvestigationItem, 
  ForensicFlag 
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
  Rotate3d
} from 'lucide-react';
import { ForensicRiskGlobe3D } from '../components/ForensicRiskGlobe3D';
import { Card3D } from '../components/Card3D';

interface DashboardPageProps {
  currentTicker: string;
  onSelectTicker: (ticker: string) => void;
  userSession: UserSession | null;
  onNavigateToLanding: () => void;
  onLogout: () => void;
}

type ActiveViewModule = 'overview' | 'globe3d' | 'flags' | 'financials' | 'simulator' | 'filings' | 'all';

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentTicker,
  onSelectTicker,
  userSession,
  onNavigateToLanding,
  onLogout
}) => {
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState<boolean>(false);
  const [isLiveScanOpen, setIsLiveScanOpen] = useState<boolean>(false);
  const [isInvestigationQueueOpen, setIsInvestigationQueueOpen] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [investigationItems, setInvestigationItems] = useState<InvestigationItem[]>([]);
  const [lastScanTime, setLastScanTime] = useState<string>('Just now');
  
  // Interactive View Selector
  const [activeModule, setActiveModule] = useState<ActiveViewModule>('overview');
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState<boolean>(false);

  // Base deterministic company profile
  const companyProfile = useMemo(() => {
    const profile = getDeterministicCompanyProfile(currentTicker);
    if (profile) return profile;
    return getDeterministicCompanyProfile('AAPL')!;
  }, [currentTicker]);

  // Automated welcome toast for logged-in user
  React.useEffect(() => {
    if (userSession?.email) {
      setNotification(`Logged in as ${userSession.name} (${userSession.email}) • Active session.`);
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [userSession?.email]);

  const handleSelectTickerWithToast = (ticker: string) => {
    const clean = ticker.toUpperCase().trim();
    if (!isValidStockTicker(clean)) {
      setNotification(`⚠️ Ticker "${clean}" not recognized. Please enter a valid listed stock ticker.`);
      setTimeout(() => setNotification(null), 4500);
      return;
    }
    onSelectTicker(clean);
    setNotification(`Audited profile for ${clean} loaded. SEC EDGAR facts synchronized.`);
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

  // Module configuration for the interactive dropdown menu
  const moduleList: { id: ActiveViewModule; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'overview',
      label: 'Executive Overview & Chart',
      icon: <BarChart3 className="h-4 w-4 text-red-400" />,
      desc: 'Health score, Altman Z, Beneish M-Score & stock price chart'
    },
    {
      id: 'globe3d',
      label: '3D Forensic Risk Polyhedron',
      icon: <Rotate3d className="h-4 w-4 text-cyan-400" />,
      desc: 'Interactive 3D WebGL risk vector topography & orbital raycast'
    },
    {
      id: 'flags',
      label: '30 Red Flags Forensic Matrix',
      icon: <ShieldAlert className="h-4 w-4 text-amber-400" />,
      desc: 'Sector-specific accounting red flags, formulas & audited citations'
    },
    {
      id: 'financials',
      label: 'Multi-Year Financials',
      icon: <Table className="h-4 w-4 text-emerald-400" />,
      desc: 'Audited balance sheets, cash flows & historical ratios'
    },
    {
      id: 'simulator',
      label: 'Stress Test Simulator',
      icon: <Activity className="h-4 w-4 text-indigo-400" />,
      desc: 'Interactive revenue shock & working capital stress tests'
    },
    {
      id: 'filings',
      label: 'SEC Filings & Auditor Logs',
      icon: <FileCheck2 className="h-4 w-4 text-sky-400" />,
      desc: 'SEC accession numbers, filing dates & auditor opinions'
    },
    {
      id: 'all',
      label: 'Consolidated View (All Sections)',
      icon: <Layers className="h-4 w-4 text-purple-400" />,
      desc: 'Display all modules together in a single page'
    }
  ];

  const currentModuleItem = moduleList.find((m) => m.id === activeModule) || moduleList[0];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-red-500 selection:text-white bg-slate-950 text-slate-200">
      {/* Top Application Header */}
      <Header
        currentCompany={companyProfile}
        onSelectCompany={handleSelectTickerWithToast}
        onOpenPriorityModal={() => setIsPriorityModalOpen(true)}
        onOpenLiveScan={() => setIsLiveScanOpen(true)}
        onOpenInvestigationQueue={() => setIsInvestigationQueueOpen(true)}
        investigationCount={investigationItems.length}
        onExportPdf={handleExportPdf}
        isExportingPdf={isExportingPdf}
        userSession={userSession}
        onNavigateToLanding={onNavigateToLanding}
        onLogout={onLogout}
      />

      {/* Main Terminal Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 space-y-5">
        {/* Dynamic Notification Toast */}
        {notification && (
          <div className="p-3 bg-slate-900/90 border border-emerald-500/40 text-xs font-sans text-emerald-400 flex items-center justify-between rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{notification}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-500 hover:text-slate-300 text-xs ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Company Quick Profile Bar */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-center text-red-400 font-mono font-bold text-sm">
              {companyProfile.ticker}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-white">
                  {companyProfile.name}
                </span>
                <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[11px] rounded font-mono">
                  CIK: {companyProfile.cik}
                </span>
                <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-[11px] rounded font-medium">
                  {companyProfile.lens} Lens
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {companyProfile.sector} • FY22–FY26 Audited 10-K &amp; TTM Feeds
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 text-xs">
            <div>
              <span className="text-slate-500 text-[11px] block">Stock Price</span>
              <span className="text-white font-semibold font-mono text-sm">
                ${companyProfile.stockPrice.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">24h Change</span>
              <span
                className={`font-semibold font-mono ${
                  companyProfile.priceChangePercent >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {companyProfile.priceChangePercent >= 0 ? '+' : ''}
                {companyProfile.priceChangePercent}%
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Market Cap</span>
              <span className="text-slate-300 font-semibold font-mono">
                ${companyProfile.marketCap}B
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Health Score</span>
              <span className="text-white font-bold font-mono text-sm">
                {companyProfile.forensicScore}/100 ({companyProfile.scoreGrade})
              </span>
            </div>
          </div>
        </div>

        {/* Interactive "Go-Down" / Dropdown View Menu */}
        <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400 ml-1">Active Section:</span>
            
            {/* The Dropdown Menu Button */}
            <div className="relative">
              <button
                onClick={() => setIsModuleDropdownOpen(!isModuleDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-800/90 hover:bg-slate-800 text-slate-100 rounded-lg border border-slate-700/80 font-medium text-xs shadow-sm transition-all"
              >
                {currentModuleItem.icon}
                <span>{currentModuleItem.label}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isModuleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* The Dropdown Content */}
              {isModuleDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                  <div className="px-2 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Select Interactive Module
                  </div>
                  {moduleList.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => {
                        setActiveModule(mod.id);
                        setIsModuleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg flex items-start gap-2.5 transition-colors ${
                        activeModule === mod.id
                          ? 'bg-slate-800 text-white font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="mt-0.5">{mod.icon}</span>
                      <div>
                        <div className="text-xs">{mod.label}</div>
                        <div className="text-[10px] text-slate-400">{mod.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Segment Tab Pills (for 1-click convenience) */}
          <div className="flex flex-wrap items-center gap-1">
            {moduleList.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                  activeModule === mod.id
                    ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {mod.icon}
                <span className="hidden md:inline">{mod.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* DYNAMIC SECTION RENDERING BASED ON ACTIVE SELECTION */}
        <div className="space-y-6">
          {/* 1. Overview & Stock Chart */}
          {(activeModule === 'overview' || activeModule === 'all') && (
            <div className="space-y-5 animate-fadeIn">
              <ExecutiveSummary company={companyProfile} />
              <StockMarketChart company={companyProfile} />
            </div>
          )}

          {/* 1.5. Dedicated 3D Forensic Risk Polyhedron Suite */}
          {activeModule === 'globe3d' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Rotate3d className="h-5 w-5 text-cyan-400" />
                    <div>
                      <h3 className="font-semibold text-white text-sm">
                        3D Forensic Risk Polyhedron Topography &amp; Orbital Raycast
                      </h3>
                      <p className="text-xs text-slate-400">
                        Spherical harmonic projection of {companyProfile.ticker}'s 8 core forensic vectors in 3D WebGL space. Drag to rotate in 3D, hover over vector nodes for live telemetry.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-mono font-medium">
                      Three.js WebGL Engine
                    </span>
                    <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-mono">
                      Health: {companyProfile.forensicScore}/100
                    </span>
                  </div>
                </div>

                <ForensicRiskGlobe3D company={companyProfile} height={420} />
              </div>

              {/* 3D Vector Telemetry Breakdown Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card3D intensity={12} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="text-[11px] font-mono text-cyan-400 font-semibold">VECTOR 01 // ACCRUAL DENSITY</div>
                  <div className="text-lg font-bold font-mono text-white">{(companyProfile.sloanAccrualRatio * 100).toFixed(1)}%</div>
                  <p className="text-xs text-slate-400">
                    Sloan Accrual ratio measuring non-cash earnings component vs total asset base.
                  </p>
                </Card3D>

                <Card3D intensity={12} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="text-[11px] font-mono text-cyan-400 font-semibold">VECTOR 02 // BENEISH MANIPULATION</div>
                  <div className="text-lg font-bold font-mono text-white">{companyProfile.beneishMScore}</div>
                  <p className="text-xs text-slate-400">
                    Probabilistic regression score detecting earnings manipulation through 8 financial indexes.
                  </p>
                </Card3D>

                <Card3D intensity={12} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="text-[11px] font-mono text-cyan-400 font-semibold">VECTOR 03 // DISTRESS ELEVATION</div>
                  <div className="text-lg font-bold font-mono text-white">{companyProfile.altmanZScore}</div>
                  <p className="text-xs text-slate-400">
                    Altman Z-Score assessing liquidity, cumulative profitability, and balance sheet leverage.
                  </p>
                </Card3D>

                <Card3D intensity={12} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="text-[11px] font-mono text-cyan-400 font-semibold">VECTOR 04 // 30-RED-FLAG HEURISTIC</div>
                  <div className="text-lg font-bold font-mono text-red-400">
                    {companyProfile.flags.filter(f => f.status === 'Critical Anomaly').length} Critical
                  </div>
                  <p className="text-xs text-slate-400">
                    Deterministic accounting red flags identified within primary SEC XBRL filings.
                  </p>
                </Card3D>
              </div>
            </div>
          )}

          {/* 2. Complete 30-Red-Flag Matrix */}
          {(activeModule === 'flags' || activeModule === 'all') && (
            <div className="animate-fadeIn">
              <ForensicFlagMatrix 
                company={companyProfile} 
                investigationItems={investigationItems}
                onToggleInvestigation={handleToggleInvestigation}
                auditSensitivity="standard"
              />
            </div>
          )}

          {/* 3. Multi-Year Audited Financial Statements */}
          {(activeModule === 'financials' || activeModule === 'all') && (
            <div className="animate-fadeIn">
              <MultiYearFinancials company={companyProfile} />
            </div>
          )}

          {/* 4. Interactive Stress Test & Scenario Simulator */}
          {(activeModule === 'simulator' || activeModule === 'all') && (
            <div className="animate-fadeIn">
              <StressTestSimulator company={companyProfile} />
            </div>
          )}

          {/* 5. SEC Filing Records & Auditor Log Detail */}
          {(activeModule === 'filings' || activeModule === 'all') && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="h-5 w-5 text-sky-400" />
                  <h3 className="font-semibold text-white text-sm">
                    Audited SEC Filing Verifications &amp; Ground Truth Records
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  CIK #{companyProfile.cik}
                </span>
              </div>

              <div className="space-y-2.5">
                {companyProfile.filingAuditLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 font-semibold rounded">
                          {log.filingType}
                        </span>
                        <span className="text-slate-200 font-semibold">
                          Period Ended: {log.periodEnd}
                        </span>
                        <span className="text-slate-500">|</span>
                        <span className="text-slate-400">Filed: {log.filingDate}</span>
                      </div>
                      <div className="text-slate-400 font-mono text-[11px]">
                        Accession: <span className="text-slate-300">{log.secAccessionNumber}</span>
                      </div>
                    </div>

                    <div className="sm:text-right space-y-1">
                      <div className="text-slate-300 font-medium">{log.auditor}</div>
                      <div className="text-emerald-400 text-[11px] font-medium flex items-center sm:justify-end gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{log.auditorOpinion}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals & Drawers */}
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

      {/* Toned Down, Clean Footer */}
      <Footer />
    </div>
  );
};
