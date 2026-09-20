import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { StockMarketChart } from './components/StockMarketChart';
import { MultiYearFinancials } from './components/MultiYearFinancials';
import { ForensicFlagMatrix } from './components/ForensicFlagMatrix';
import { DataSourcePriorityModal } from './components/DataSourcePriorityModal';
import { ArchitectureDocsModal } from './components/ArchitectureDocsModal';
import { Footer } from './components/Footer';
import { getDeterministicCompanyProfile } from './data/companyData';
import { generateAuditPdf } from './services/pdfGenerator';
import { 
  Building2, 
  ShieldCheck, 
  Calendar, 
  FileCheck2, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function App() {
  const [currentTicker, setCurrentTicker] = useState<string>('AAPL');
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState<boolean>(false);
  const [isArchModalOpen, setIsArchModalOpen] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Strictly deterministic profile calculation: No score jitter, 100% reproducible
  const companyProfile = useMemo(() => {
    return getDeterministicCompanyProfile(currentTicker);
  }, [currentTicker]);

  const handleSelectTicker = (ticker: string) => {
    setCurrentTicker(ticker);
    setNotification(`Loaded verified audited profile for ${ticker} (Deterministic score: ${getDeterministicCompanyProfile(ticker).forensicScore}/100)`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleExportPdf = () => {
    setIsExportingPdf(true);
    // Slight tick to let UI render loading state
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
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#FF4D4D] selection:text-white">
      {/* Top Application Header */}
      <Header
        currentCompany={companyProfile}
        onSelectCompany={handleSelectTicker}
        onOpenPriorityModal={() => setIsPriorityModalOpen(true)}
        onOpenArchitectureModal={() => setIsArchModalOpen(true)}
        onExportPdf={handleExportPdf}
        isExportingPdf={isExportingPdf}
      />

      {/* Main Terminal Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4">
        {/* Dynamic Notification Toast */}
        {notification && (
          <div className="mb-3 p-2.5 bg-[#0e1626] border border-[#38A169] text-xs font-mono text-[#38A169] flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#38A169]" />
              <span>{notification}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-[#718096] hover:text-white text-[11px]"
            >
              ✕
            </button>
          </div>
        )}

        {/* Company Active Breadcrumb & Metadata Strip */}
        <div className="bg-[#0F131C] border border-[#22293d] p-3 mb-4 flex flex-wrap items-center justify-between gap-3 shadow">
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
              </div>
              <p className="text-[11px] font-mono text-[#718096]">
                {companyProfile.sector} • FY22 to FY26 Audited 10-K & TTM Real-Time
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

        {/* 1. Concise Executive Summary (Max 4 Bullets) & Health Score Gauge */}
        <ExecutiveSummary company={companyProfile} />

        {/* 2. Interactive Stock Market Chart directly below Executive Summary */}
        <StockMarketChart company={companyProfile} />

        {/* 3. Multi-Year Audited Financial Statements (FY22 - FY26 + TTM) */}
        <MultiYearFinancials company={companyProfile} />

        {/* 4. Complete 210-Flag Matrix across 7 Industry Lenses (30 Flags each) with Info Boxes */}
        <ForensicFlagMatrix company={companyProfile} />
      </main>

      {/* Modals */}
      <DataSourcePriorityModal
        isOpen={isPriorityModalOpen}
        onClose={() => setIsPriorityModalOpen(false)}
      />

      <ArchitectureDocsModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />

      {/* Sticky Bottom Legal Disclaimer & Maintenance Footer */}
      <Footer />
    </div>
  );
}
