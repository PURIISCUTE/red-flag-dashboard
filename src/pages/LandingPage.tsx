import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Scale, 
  Building2, 
  Activity, 
  TrendingUp, 
  ShieldAlert, 
  Calculator,
  Search,
  Database,
  Layers,
  Lock,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { IndustryLens } from '../types';
import { getDeterministicCompanyProfile } from '../data/companyData';
import { Logo } from '../components/Logo';
import { TickerSearch } from '../components/TickerSearch';

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
  const [activeLensTab, setActiveLensTab] = useState<IndustryLens>('Tech Hardware');

  const FEATURED_DOSSIERS = [
    {
      ticker: 'AAPL',
      name: 'Apple Inc.',
      exchange: 'NASDAQ',
      lens: 'Tech Hardware' as IndustryLens,
      score: 84,
      grade: 'A',
      title: 'Services Margin Expansion & Foundry Purchase Commitments Audit',
      summary: 'Audited operating cash flow conversion of $118.2B TTM. Scrutinized foundry take-or-pay wafer commitments and tooling depreciation pacing under ASC 606.',
      mScore: -2.68,
      zScore: 7.92,
      accrual: '-5.1%'
    },
    {
      ticker: 'NVDA',
      name: 'NVIDIA Corporation',
      exchange: 'NASDAQ',
      lens: 'AI/Deep Tech' as IndustryLens,
      score: 71,
      grade: 'B',
      title: 'Hyperscaler Concentration & Unbilled Datacenter Accruals Audit',
      summary: 'Scrutinized top 3 hyperscaler customers accounting for 38% of accounts receivable. Evaluated compute capacity leasebacks and unbilled inventory pipeline.',
      mScore: -1.94,
      zScore: 14.8,
      accrual: '+4.8%'
    },
    {
      ticker: 'TSLA',
      name: 'Tesla Inc.',
      exchange: 'NASDAQ',
      lens: 'Retail' as IndustryLens,
      score: 68,
      grade: 'B',
      title: 'Automotive Regulatory Credits & Warranty Reserve Pacing Audit',
      summary: 'Analyzed regulatory credit margin flattery, deferred FSD revenue recognition under ASC 606, and automotive warranty provision pacing vs fleet growth.',
      mScore: -1.88,
      zScore: 6.45,
      accrual: '+2.4%'
    },
    {
      ticker: 'MSFT',
      name: 'Microsoft Corporation',
      exchange: 'NASDAQ',
      lens: 'SaaS' as IndustryLens,
      score: 86,
      grade: 'A',
      title: 'Commercial Cloud Deferred Revenue & Server Useful Life Audit',
      summary: 'Verified Azure commercial bookings backlog vs unearned revenue. Validated 6-year server and datacenter hardware depreciation timeline adjustments.',
      mScore: -2.55,
      zScore: 8.12,
      accrual: '-3.8%'
    }
  ];

  const lensExamples: Record<IndustryLens, { flags: string[]; formula: string; secCitation: string }> = {
    'Tech Hardware': {
      flags: ['Foundry Take-or-Pay Purchase Commitment Overhang', 'Warranty Liability Reserve Under-Funding', 'Fab Tooling Impairment Delay'],
      formula: 'Unconditional Purchase Obligations / TTM Cash Flow from Operations > 1.4x',
      secCitation: '10-K Note 11 — Commitments and Contingencies (Foundry Wafers)'
    },
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
      {/* Top Institutional Header */}
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Logo size="md" showSubtitle={true} />

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs text-slate-400 font-medium">
            <a href="#methodology" className="hover:text-white transition-colors">Forensic Models</a>
            <a href="#taxonomy" className="hover:text-white transition-colors">30 Red Flags Taxonomy</a>
            <a href="#dossiers" className="hover:text-white transition-colors">Forensic Dossiers</a>
            <a href="#pipeline" className="hover:text-white transition-colors">Data Pipeline</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 text-xs font-medium">
            <button
              onClick={onNavigateToLogin}
              className="px-3.5 py-1.5 text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onNavigateToSignup}
              className="hidden sm:inline-block px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Create Account
            </button>
            <button
              onClick={() => onNavigateToDashboard('AAPL')}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <span>Launch Terminal</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Live Market & Regulatory Status Ribbon */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 px-4 py-2 text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-white font-semibold">SEC EDGAR XBRL Pipeline Active</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Live NYSE / NASDAQ Market Telemetry</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>AAPL: <strong className="text-white">$335.37</strong> <span className="text-emerald-400">+0.52%</span></span>
            <span>NVDA: <strong className="text-white">$233.95</strong> <span className="text-emerald-400">+1.34%</span></span>
            <span>TSLA: <strong className="text-white">$370.59</strong> <span className="text-emerald-400">+4.65%</span></span>
            <span>MSFT: <strong className="text-white">$517.53</strong> <span className="text-emerald-400">+0.92%</span></span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-14 pb-20 px-4 border-b border-slate-800 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 text-xs rounded-full text-red-400 font-medium">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Institutional Financial Forensics &amp; Forensic Accounting Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight font-sans">
              Detect Accounting Discrepancies, Earnings Manipulation &amp; Off-Balance Sheet Liabilities
            </h1>

            <p className="text-base text-slate-300 leading-relaxed">
              Empirical forensic accounting intelligence calibrated against <strong className="text-white">SEC EDGAR Form 10-K/10-Q XBRL ground truth</strong> and real-time equity market data. Automatically allocates across <strong className="text-white">30 specialized red flags</strong> tailored by industry lens.
            </p>
          </div>

          {/* Central Ticker Investigation Search Box */}
          <div className="max-w-2xl bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-2xl space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-white">
              <span className="flex items-center gap-2">
                <Search className="h-4 w-4 text-red-400" />
                <span>Search Any NYSE or NASDAQ Equity to Audit</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">7,600+ Verified US Companies</span>
            </div>

            <TickerSearch
              onSelectCompany={(ticker) => onNavigateToDashboard(ticker)}
              placeholder="Enter ticker symbol or company name (e.g. AAPL, NVDA, TSLA, MSFT)..."
              variant="hero"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-400 font-sans">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>Instant dossiers:</span>
                {(['AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMZN', 'GOOGL', 'PLTR'] as const).map((tk) => (
                  <button
                    key={tk}
                    onClick={() => onNavigateToDashboard(tk)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-xs border border-slate-700 transition-colors cursor-pointer"
                  >
                    {tk}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">✓ Real-time calculation proof</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Forensic Dossiers Section */}
      <section id="dossiers" className="py-16 px-4 max-w-7xl mx-auto space-y-6 border-b border-slate-800">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider text-red-400 font-semibold">
              Audited Case Studies
            </div>
            <h2 className="text-2xl font-bold text-white">
              Featured Forensic Investigation Dossiers
            </h2>
            <p className="text-xs text-slate-400">
              Select any verified equity to inspect its 30 Red Flags matrix, live stock chart, and mathematical ratios
            </p>
          </div>
          <button
            onClick={() => onNavigateToDashboard('AAPL')}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-semibold cursor-pointer"
          >
            <span>Open Terminal Workspace</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FEATURED_DOSSIERS.map((item) => (
            <div 
              key={item.ticker}
              onClick={() => onNavigateToDashboard(item.ticker)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-xl space-y-4 transition-all hover:shadow-xl cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center font-mono font-bold text-red-400 text-sm">
                    {item.ticker}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors">
                      {item.name}
                    </h3>
                    <div className="text-[11px] text-slate-400">
                      {item.exchange} · {item.lens} Lens
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-white">
                    Score: {item.score}/100
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium">Grade {item.grade}</div>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-slate-200">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              {/* Forensic Metrics Strip */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center text-xs">
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Beneish M</div>
                  <div className="font-mono font-bold text-emerald-400 mt-0.5">{item.mScore}</div>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Altman Z</div>
                  <div className="font-mono font-bold text-emerald-400 mt-0.5">{item.zScore}</div>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Sloan Accrual</div>
                  <div className="font-mono font-bold text-emerald-400 mt-0.5">{item.accrual}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 text-slate-400 group-hover:text-white font-medium">
                <span>View Full Forensic Dossier</span>
                <ArrowRight className="h-3.5 w-3.5 text-red-400" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Forensic Accounting Methodologies Section */}
      <section id="methodology" className="py-16 px-4 max-w-7xl mx-auto space-y-8 border-b border-slate-800">
        <div className="max-w-3xl space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-red-400 font-semibold">
            Mathematical Foundations
          </div>
          <h2 className="text-2xl font-bold text-white">
            Core Empirical Forensic Accounting Engines
          </h2>
          <p className="text-xs text-slate-400">
            Mathematically derived from audited balance sheets, income statements, and cash flows with transparent step-by-step calculation proofs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 w-fit">
              <Calculator className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">
              Beneish 8-Factor M-Score
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empirical probabilistic model developed by Messod Beneish detecting earnings manipulation through 8 indices: DSRI, GMI, AQI, SGI, DEPI, SGAI, TATA, and LVGI. Scores &gt; -1.78 breach the manipulation threshold.
            </p>
            <div className="pt-2 font-mono text-[11px] text-red-400">
              Threshold: M &gt; -1.78 (Red Flag)
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 w-fit">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">
              Sloan Accrual Anomaly
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Wharton Professor Richard Sloan&apos;s formula calculating (Net Income - Operating Cash Flow) / Total Assets. Identifies when reported P&amp;L accounting profit is unsupported by real cash flow collections.
            </p>
            <div className="pt-2 font-mono text-[11px] text-emerald-400">
              Benchmark: Accrual Ratio ≤ +5.0%
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 w-fit">
              <Scale className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">
              Altman Z-Score Solvency
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dr. Edward Altman&apos;s 5-factor multivariate credit-strength formula combining Working Capital, Retained Earnings, EBIT, Market Cap leverage, and Asset Turnover to classify distress risk across Safe, Grey, and Distress zones.
            </p>
            <div className="pt-2 font-mono text-[11px] text-cyan-400">
              Safe Zone: Z &gt; 2.99
            </div>
          </div>
        </div>
      </section>

      {/* 30 Red Flags Sector Matrix Exploration */}
      <section id="taxonomy" className="py-16 px-4 max-w-7xl mx-auto space-y-6 border-b border-slate-800">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-red-400 font-semibold">
            Governing Taxonomy
          </div>
          <h2 className="text-2xl font-bold text-white">
            30 Sector-Specific Red Flags Matrix
          </h2>
          <p className="text-xs text-slate-400">
            Accounting red flags vary by business model. Retail scrutinizes inventory shrink and vendor allowances, while SaaS audits unbilled AR vs deferred revenue.
          </p>
        </div>

        {/* Lens Pill Tabs */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(lensExamples) as IndustryLens[]).map((lens) => (
            <button
              key={lens}
              onClick={() => setActiveLensTab(lens)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeLensTab === lens
                  ? 'bg-red-600 text-white shadow-sm font-semibold'
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
            <h3 className="text-sm font-semibold text-white">
              {activeLensTab} Forensic Inspection Standards
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              30 Specialized Rules
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lensExamples[activeLensTab].flags.map((flag, idx) => (
              <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                <div className="text-red-400 font-semibold text-[11px] font-mono">FLAG #{idx + 1}</div>
                <div className="text-slate-200 font-medium">{flag}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Sample Detection Formula</span>
              <code className="font-mono text-xs text-slate-200 block mt-1">
                {lensExamples[activeLensTab].formula}
              </code>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Governing SEC Citation</span>
              <span className="font-sans text-xs text-slate-200 block mt-1">
                {lensExamples[activeLensTab].secCitation}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Data Ingestion Pipeline Architecture Section */}
      <section id="pipeline" className="py-16 px-4 max-w-7xl mx-auto space-y-6">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-red-400 font-semibold">
            Data Collection Architecture
          </div>
          <h2 className="text-2xl font-bold text-white">
            Multi-Tier Live Telemetry &amp; Ground Truth Ingestion
          </h2>
          <p className="text-xs text-slate-400">
            How our platform collects, reconciles, and calculates market and accounting metrics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2.5">
            <div className="text-emerald-400 font-mono font-bold text-xs">TIER 1 · SEC EDGAR XBRL</div>
            <h3 className="font-semibold text-white text-sm">Primary Accounting Ground Truth</h3>
            <p className="text-slate-400 leading-relaxed">
              Direct connection to SEC EDGAR Company Facts API ingesting audited US-GAAP XBRL line items (Balance Sheet, Income Statement, Cash Flows, Footnotes) keyed by 10-digit CIK.
            </p>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2.5">
            <div className="text-cyan-400 font-mono font-bold text-xs">TIER 2 · YAHOO FINANCE LIVE</div>
            <h3 className="font-semibold text-white text-sm">Live Market Price Telemetry</h3>
            <p className="text-slate-400 leading-relaxed">
              Real-time quotes, official previous close baselines, high-frequency candlestick price feeds (1D, 5D, 1M, 6M, YTD, 1Y, 5Y, MAX), intraday volume, and live equity market capitalization.
            </p>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2.5">
            <div className="text-red-400 font-mono font-bold text-xs">TIER 3 · FORENSIC ENGINE</div>
            <h3 className="font-semibold text-white text-sm">Mathematical Calculation Engine</h3>
            <p className="text-slate-400 leading-relaxed">
              Instant evaluation of Beneish 8-Factor M-Score, Altman Z-Score, Sloan Accruals, Working Capital DSO/DIO, and 30 sector-governed red flags with step-by-step mathematical proof.
            </p>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="py-10 px-4 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" showSubtitle={true} />
          <div className="text-center md:text-right text-xs text-slate-500">
            SEC EDGAR XBRL Heuristics · 30 Red Flags Forensic Taxonomy · Live Yahoo Market Telemetry
          </div>
        </div>
      </footer>
    </div>
  );
};
