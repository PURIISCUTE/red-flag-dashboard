import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  FileText, 
  Scale, 
  Building2, 
  Search, 
  Download, 
  Lock, 
  Activity, 
  TrendingUp, 
  BarChart3, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { IndustryLens } from '../types';
import { getDeterministicCompanyProfile } from '../data/companyData';
import { Logo } from '../components/Logo';

interface LandingPageProps {
  onNavigateToDashboard: (ticker?: string) => void;
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToDashboard,
  onNavigateToLogin,
  onNavigateToSignup
}) => {
  const [heroTicker, setHeroTicker] = useState<'AAPL' | 'NVDA' | 'TSLA' | 'PYPL'>('AAPL');
  const [activeLensTab, setActiveLensTab] = useState<IndustryLens>('SaaS');

  const heroProfile = getDeterministicCompanyProfile(heroTicker);

  const lensExamples: Record<IndustryLens, { flags: string[]; formula: string; secCitation: string }> = {
    'SaaS': {
      flags: ['Unbilled A/R vs Deferred Revenue Divergence', 'Sales Commission Capitalization Stretch', 'Net Revenue Retention Metric Jitter'],
      formula: 'Δ(Unbilled Receivables) / Δ(Deferred Revenue) > 2.0σ',
      secCitation: '10-K Note 3 — Revenue from Contracts with Customers (ASC 606)'
    },
    'Retail': {
      flags: ['Phantom Inventory Buildup vs Shrink Reserve', 'Channel Stuffing via Vendor Rebate Accruals', 'Depreciation Life Extension on Store Fixtures'],
      formula: 'DIO(TTM) - DIO(FY-1) > 18.0 days with Gross Margin contraction',
      secCitation: '10-K Note 5 — Inventories, LIFO Reserves & Lower of Cost or Market'
    },
    'Payments': {
      flags: ['Merchant Chargeback Reserve Inadequacy', 'Gross vs Net Settlement Volume Distortion', 'Restricted Cash Reclassification Gaming'],
      formula: 'Provision for Transaction Losses / Gross Processing Volume < Historical 3-Yr Avg',
      secCitation: '10-K Item 7 — Operating Results & Settlement Assets / Obligations'
    },
    'Banks': {
      flags: ['CECL Expected Credit Loss Model Smoothing', 'Held-to-Maturity Unrealized Bond Losses', 'Volatile Non-Interest Deposit Flight'],
      formula: 'Allowance for Credit Losses / Total Non-Accrual Loans < 1.1x',
      secCitation: '10-K Note 4 — Loans, Commitments & CECL Allowances (ASU 2016-13)'
    },
    'Tech Hardware': {
      flags: ['Foundry Take-or-Pay Purchase Commitment Overhang', 'Warranty Liability Reserve Under-Funding', 'Fab Tooling Impairment Delay'],
      formula: 'Unconditional Purchase Obligations / TTM Cash Flow from Operations > 1.4x',
      secCitation: '10-K Note 11 — Commitments and Contingencies (Foundry Wafers)'
    },
    'Healthcare': {
      flags: ['Clinical Trial R&D Capitalization in Intangibles', 'Contractual Allowance Valuation Understatement', 'Off-Balance Sheet Royalty Monetization'],
      formula: 'DSO > 75 days with Implicit Price Concessions < 2.5% of Gross Charges',
      secCitation: '10-K Note 2 — Patient Service Revenue & Implicit Price Concessions'
    },
    'AI/Deep Tech': {
      flags: ['Circular Cloud Compute Capacity Swaps', 'GPU Cluster Accelerated Depreciation Pacing', 'Related Party Training Data License Fees'],
      formula: 'Capitalized GPU Server Useful Life > 4.5 Years vs Rapid Obsolescence',
      secCitation: '10-K Note 1 — Property, Plant and Equipment Depreciation Schedules'
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-red-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Logo size="md" showSubtitle={true} />

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-slate-400 font-medium">
            <a href="#features" className="hover:text-white transition-colors">Core Engine</a>
            <a href="#lenses" className="hover:text-white transition-colors">210-Flag Matrix</a>
            <a href="#pipeline" className="hover:text-white transition-colors">SEC Ground Truth</a>
            <a href="#pricing" className="hover:text-white transition-colors">Access Tiers</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 text-xs font-medium">
            <button
              onClick={onNavigateToLogin}
              className="px-3.5 py-1.5 text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 rounded-lg transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onNavigateToSignup}
              className="hidden sm:inline-block px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 text-white border border-slate-800 rounded-lg transition-colors"
            >
              Create Account
            </button>
            <button
              onClick={() => onNavigateToDashboard('AAPL')}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg shadow-sm transition-all"
            >
              <span>Launch Terminal</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 border-b border-slate-800/80 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 text-xs rounded-full text-slate-300 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SEC EDGAR XBRL Forensic Engine · Deterministic Heuristics</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Financial Forensics &amp; Accounting Discrepancy Terminal
              </h1>

              <p className="text-base text-slate-400 leading-relaxed max-w-2xl">
                Detect revenue manipulation, aggressive accruals, and hidden balance-sheet liabilities across <span className="text-white font-medium">210 specialized forensic heuristics</span> spanning 7 industry lenses. Verified against primary SEC EDGAR ground truth.
              </p>

              {/* Bullet Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Primary SEC EDGAR XBRL Ground Truth</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>210 Flags across 7 Specialized Lenses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Beneish M-Score &amp; Sloan Accrual Detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Interactive Audit Modules &amp; PDF Reports</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => onNavigateToDashboard('AAPL')}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg text-sm shadow-sm transition-all"
                >
                  <span>Launch Live Workspace</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={onNavigateToSignup}
                  className="px-5 py-3 bg-slate-900 hover:bg-slate-850 text-white border border-slate-800 rounded-lg text-sm font-medium transition-colors"
                >
                  Request Analyst Access
                </button>
              </div>

              {/* Sector Switcher Quick Buttons */}
              <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
                <span>Try preview:</span>
                {(['AAPL', 'NVDA', 'TSLA', 'PYPL'] as const).map((tk) => (
                  <button
                    key={tk}
                    onClick={() => setHeroTicker(tk)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                      heroTicker === tk
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {tk}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Hero Preview Card */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center font-mono font-bold text-red-400 text-xs">
                    {heroProfile.ticker}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{heroProfile.name}</div>
                    <div className="text-[11px] text-slate-400">{heroProfile.sector} · {heroProfile.lens} Lens</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-white">
                    {heroProfile.forensicScore}/100
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium">Grade {heroProfile.scoreGrade}</div>
                </div>
              </div>

              {/* Ratios snippet */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Beneish M</div>
                  <div className="font-mono font-bold text-white text-xs mt-0.5">{heroProfile.beneishMScore}</div>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Altman Z</div>
                  <div className="font-mono font-bold text-white text-xs mt-0.5">{heroProfile.altmanZScore}</div>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Sloan Accrual</div>
                  <div className="font-mono font-bold text-white text-xs mt-0.5">{(heroProfile.sloanAccrualRatio * 100).toFixed(1)}%</div>
                </div>
              </div>

              {/* Key Bullet */}
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <span className="text-red-400 font-medium block text-[11px] mb-1">Key SEC Observation:</span>
                {heroProfile.executiveSummary[0]}
              </div>

              <button
                onClick={() => onNavigateToDashboard(heroProfile.ticker)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Inspect Full Dossier for {heroProfile.ticker}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 210-Flag Sector Matrix Exploration */}
      <section id="lenses" className="py-16 px-4 max-w-7xl mx-auto space-y-6">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl font-bold text-white">
            210 Heuristics Across 7 Industry Lenses
          </h2>
          <p className="text-sm text-slate-400">
            Accounting red flags vary by industry. Retail requires inventory shrink tests, while SaaS demands unbilled AR vs deferred revenue scrutiny.
          </p>
        </div>

        {/* Lens Pill Tabs */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(lensExamples) as IndustryLens[]).map((lens) => (
            <button
              key={lens}
              onClick={() => setActiveLensTab(lens)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeLensTab === lens
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {lens} (30 Flags)
            </button>
          ))}
        </div>

        {/* Lens Detail Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-semibold text-white">
              {activeLensTab} Forensic Inspection Rules
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              30 Sector-Specific Heuristics
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lensExamples[activeLensTab].flags.map((flag, idx) => (
              <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs space-y-1">
                <div className="text-red-400 font-semibold text-[11px]">FLAG #{idx + 1}</div>
                <div className="text-slate-200 font-medium">{flag}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Sample Detection Formula</span>
              <code className="font-mono text-xs text-slate-200 block mt-1">
                {lensExamples[activeLensTab].formula}
              </code>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Governing SEC Citation</span>
              <span className="font-sans text-xs text-slate-200 block mt-1">
                {lensExamples[activeLensTab].secCitation}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="py-10 px-4 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" showSubtitle={true} />
          <div className="text-center md:text-right text-xs text-slate-500">
            SEC EDGAR XBRL Heuristics · 210-Flag Matrix · For Informational Purposes
          </div>
        </div>
      </footer>
    </div>
  );
};
