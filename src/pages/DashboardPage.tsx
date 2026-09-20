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
import { getDeterministicCompanyProfile } from '../data/companyData';
import { generateAuditPdf } from '../services/pdfGenerator';
import { 
  UserSession, 
  AuditSensitivity, 
  InvestigationItem, 
  ForensicFlag 
} from '../types';
import { 
  CheckCircle2, 
  Zap, 
  Sliders, 
  Bookmark, 
  Download, 
  ArrowLeft,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface DashboardPageProps {
  currentTicker: string;
  onSelectTicker: (ticker: string) => void;
  userSession: UserSession | null;
  onNavigateToLanding: () => void;
  onLogout: () => void;
}

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
  const [auditSensitivity, setAuditSensitivity] = useState<AuditSensitivity>('standard');
  const [investigationItems, setInvestigationItems] = useState<InvestigationItem[]>([]);
  const [lastScanTime, setLastScanTime] = useState<string>('Just now');

  // Base deterministic company profile
  const baseProfile = useMemo(() => {
    return getDeterministicCompanyProfile(currentTicker);
  }, [currentTicker]);

  // Dynamically adjusted profile based on selected audit sensitivity
  const companyProfile = useMemo(() => {
    if (auditSensitivity === 'standard') return baseProfile;

    // Recalculate score dynamically if sensitivity is increased
    const scoreDeduction = auditSensitivity === 'strict' ? 8 : 4;
    const adjustedScore = Math.max(15, baseProfile.forensicScore - scoreDeduction);
    const adjustedGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 
      adjustedScore >= 85 ? 'A+' :
      adjustedScore >= 80 ? 'A' :
      adjustedScore >= 70 ? 'B' :
      adjustedScore >= 60 ? 'C' : 'D';

    return {
      ...baseProfile,
      forensicScore: adjustedScore,
      scoreGrade: adjustedGrade
    };
  }, [baseProfile, auditSensitivity]);

  const handleSelectTickerWithToast = (ticker: string) => {
    onSelectTicker(ticker);
    setNotification(`Audited profile for ${ticker} loaded. SEC EDGAR XBRL facts synchronized.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleToggleInvestigation = (flag: ForensicFlag, note?: string) => {
    const existingIndex = investigationItems.findIndex(
      (item) => item.flagCode === flag.code && item.ticker === companyProfile.ticker
    );

    if (existingIndex >= 0) {
      setInvestigationItems((prev) => prev.filter((_, idx) => idx !== existingIndex));
      setNotification(`Removed ${flag.code} from active investigation queue.`);
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
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#FF4D4D] selection:text-white bg-[#080b10]">
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
        auditSensitivity={auditSensitivity}
        onChangeSensitivity={(newSens) => {
          setAuditSensitivity(newSens);
          setNotification(`Audit Sensitivity adjusted to ${newSens.toUpperCase()} mode.`);
          setTimeout(() => setNotification(null), 3500);
        }}
      />

      {/* Main Terminal Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 space-y-4">
        {/* Dynamic Notification Toast */}
        {notification && (
          <div className="p-2.5 bg-[#0e1626] border border-[#38A169] text-xs font-mono text-[#38A169] flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#38A169] shrink-0" />
              <span>{notification}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-[#718096] hover:text-white text-[11px] ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Company Active Breadcrumb & Metadata Strip */}
        <div className="bg-[#0F131C] border border-[#22293d] p-3 flex flex-wrap items-center justify-between gap-3 shadow">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-[#181f2f] border border-[#28354f] flex items-center justify-center text-[#FF4D4D] font-mono font-bold text-sm">
              {companyProfile.ticker.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-white">
                  {companyProfile.name}
                </span>
                <span className="px-1.5 py-0.2 bg-[#1b2233] text-[#a5b4fc] text-[10px] font-mono border border-[#2d3852]">
                  CIK: {companyProfile.cik}
                </span>
                <span className="px-1.5 py-0.2 bg-[#FF4D4D]/15 text-[#FF4D4D] text-[10px] font-mono border border-[#FF4D4D]/40">
                  {companyProfile.lens.toUpperCase()} LENS
                </span>
                <span className="hidden sm:inline px-1.5 py-0.2 bg-[#38A169]/15 text-[#38A169] text-[10px] font-mono border border-[#38A169]/40">
                  SCAN: {lastScanTime.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#718096]">
                {companyProfile.sector} • FY22 to FY26 Audited 10-K &amp; TTM Real-Time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <span className="text-[#718096] text-[10px] block">REAL-TIME PRICE</span>
              <span className="text-white font-bold text-sm">${companyProfile.stockPrice.toFixed(2)}</span>
            </div>
            <div className="text-right">
              <span className="text-[#718096] text-[10px] block">24H VARIANCE</span>
              <span className={companyProfile.priceChangePercent >= 0 ? 'text-[#38A169] font-bold' : 'text-[#FF4D4D] font-bold'}>
                {companyProfile.priceChangePercent >= 0 ? '+' : ''}{companyProfile.priceChangePercent}%
              </span>
            </div>
            <div className="text-right">
              <span className="text-[#718096] text-[10px] block">MARKET CAP</span>
              <span className="text-[#cbd5e1] font-bold">${companyProfile.marketCap}B</span>
            </div>
          </div>
        </div>

        {/* Dynamic Audit Sensitivity Alert Strip (if non-standard) */}
        {auditSensitivity !== 'standard' && (
          <div className="p-2.5 bg-[#17120a] border border-[#ECC94B] text-xs font-mono text-[#ECC94B] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-[#ECC94B] shrink-0" />
              <span>
                <strong>ACTIVE AUDIT SENSITIVITY: {auditSensitivity.toUpperCase()}</strong> — Borderline flags and accruals are subject to heightened scrutiny (+{auditSensitivity === 'strict' ? '8' : '4'} pt score calibration).
              </span>
            </div>
            <button
              onClick={() => setAuditSensitivity('standard')}
              className="text-[#cbd5e1] hover:text-white text-[11px] underline ml-2"
            >
              Reset to Standard
            </button>
          </div>
        )}

        {/* 1. Concise Executive Summary (Max 4 Bullets) & Health Score Gauge */}
        <ExecutiveSummary company={companyProfile} />

        {/* 2. Interactive Stock Market Chart directly below Executive Summary */}
        <StockMarketChart company={companyProfile} />

        {/* Dynamic Working Capital & Financial Stress Test Simulator */}
        <StressTestSimulator company={companyProfile} />

        {/* 3. Multi-Year Audited Financial Statements (FY22 - FY26 + TTM) */}
        <MultiYearFinancials company={companyProfile} />

        {/* 4. Complete 210-Flag Matrix across 7 Industry Lenses with Interactive Investigation Queue */}
        <ForensicFlagMatrix 
          company={companyProfile} 
          investigationItems={investigationItems}
          onToggleInvestigation={handleToggleInvestigation}
          auditSensitivity={auditSensitivity}
        />
      </main>

      {/* Modals & Slide-over Drawers */}
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

      {/* Sticky Bottom Legal Disclaimer & Maintenance Footer */}
      <Footer />
    </div>
  );
};
