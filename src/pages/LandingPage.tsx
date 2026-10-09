import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Scale, 
  Building2, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  ShieldAlert, 
  Calculator,
  Search,
  Database,
  Layers,
  Lock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  Cpu,
  Cloud,
  HardDrive,
  ShoppingBag,
  Building,
  CreditCard,
  HeartPulse,
  BarChart3,
  Sliders,
  Check
} from 'lucide-react';
import { IndustryLens } from '../types';
import { fetchLiveYahooQuote, LiveYahooQuote } from '../services/yahooFinanceService';
import { Logo } from '../components/Logo';
import { TickerSearch } from '../components/TickerSearch';
import { PricingModal } from '../components/PricingModal';
import { TerminalPage } from '../components/TerminalNavbar';

interface LandingPageProps {
  onNavigateToTerminal: (ticker?: string, page?: TerminalPage, lens?: IndustryLens) => void;
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToTerminal,
  onNavigateToLogin,
  onNavigateToSignup
}) => {
  const [activeLensTab, setActiveLensTab] = useState<IndustryLens>('AI/Deep Tech');
  const [ribbonQuotes, setRibbonQuotes] = useState<Record<string, LiveYahooQuote>>({});
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  // Poll live market telemetry for marquee stocks every 5 seconds to match Yahoo Finance exactly
  useEffect(() => {
    let active = true;
    const tickers = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'PLTR'];

    const pollAll = () => {
      Promise.all(tickers.map((tk) => fetchLiveYahooQuote(tk))).then((results) => {
        if (!active) return;
        const map: Record<string, LiveYahooQuote> = {};
        results.forEach((q) => {
          if (q) map[q.ticker] = q;
        });
        setRibbonQuotes(map);
      });
    };

    pollAll();
    const interval = setInterval(pollAll, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const FEATURED_DOSSIERS = [
    {
      ticker: 'NVDA',
      name: 'NVIDIA Corporation',
      exchange: 'NASDAQ',
      lens: 'AI/Deep Tech' as IndustryLens,
      score: 71,
      grade: 'B',
      title: 'Hyperscaler Concentration & Unbilled Datacenter Accruals Audit',
      summary: 'Scrutinized top 3 hyperscaler customers accounting for 38% of accounts receivable. Evaluated compute capacity leasebacks and unbilled inventory pipeline under ASC 606.',
      mScore: -1.94,
      zScore: 14.8,
      accrual: '+4.8%'
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
    },
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
    }
  ];

  const LENS_DETAILS: Record<IndustryLens, {
    icon: React.ReactNode;
    tagline: string;
    criticalFlags: string[];
    sampleFormula: string;
    secSource: string;
    marqueeTicker: string;
  }> = {
    'AI/Deep Tech': {
      icon: <Cpu className="h-5 w-5 text-purple-400" />,
      tagline: 'GPU Useful Life Stretching, Circular Venture Capital Loops & Unbilled Power Take-or-Pay Commitments',
      criticalFlags: [
        'AID-01: Circular Cloud Compute Revenue Cycles (ASC 606)',
        'AID-06: GPU Cluster Depreciation Extension (3 vs 6 Yrs)',
        'AID-14: Off-Balance Sheet Power Purchase Agreements'
      ],
      sampleFormula: 'Reported Server Useful Life / Industry 3-Yr Baseline > 1.33x',
      secSource: '10-K Note: Property, Plant and Equipment Depreciation Schedules',
      marqueeTicker: 'NVDA'
    },
    'SaaS': {
      icon: <Cloud className="h-5 w-5 text-sky-400" />,
      tagline: 'Deferred Revenue Decoupling, Capitalized Internal Software R&D & Sales Commission Amortization Stretch',
      criticalFlags: [
        'SAS-01: Deferred Revenue Growth vs GAAP Top-Line Lag',
        'SAS-05: Capitalized Internal Software Development (ASC 350-40)',
        'SAS-12: Deferred Commission Amortization Exceeding Churn Life'
      ],
      sampleFormula: 'Δ(Unbilled Contract Assets) / Δ(Deferred Revenue) > 2.0σ',
      secSource: '10-K Note: Revenue from Contracts with Customers (ASC 606)',
      marqueeTicker: 'MSFT'
    },
    'Tech Hardware': {
      icon: <HardDrive className="h-5 w-5 text-emerald-400" />,
      tagline: 'Foundry Take-or-Pay Wafer Liabilities, Channel Stuffing & Inventory Obsolescence NRV Underfunding',
      criticalFlags: [
        'HDW-02: Foundry Wafer Take-or-Pay Purchase Commitments',
        'HDW-08: Channel Inventory Stuffing vs Distributor Returns',
        'HDW-15: Assembly Tooling Useful Life Mismatch'
      ],
      sampleFormula: 'Unconditional Purchase Obligations / Operating Cash Flow > 1.4x',
      secSource: '10-K Note: Commitments and Contingencies (Foundry Wafers)',
      marqueeTicker: 'AAPL'
    },
    'Retail': {
      icon: <ShoppingBag className="h-5 w-5 text-amber-400" />,
      tagline: 'Days Inventory Outstanding (DIO) vs Sales Decoupling, Vendor Rebate Capitalization & Lease Burden',
      criticalFlags: [
        'RET-01: Revenue-to-Operating Cash Flow Decoupling',
        'RET-04: Vendor Advertising Allowance Capitalization into Inventory',
        'RET-18: Operating Lease Right-of-Use Asset Impairment Delay'
      ],
      sampleFormula: 'DIO(TTM) - DIO(FY-1) > 18.0 days with Gross Margin contraction',
      secSource: '10-K Note: Merchandise Inventories & Valuation Reserves',
      marqueeTicker: 'TSLA'
    },
    'Banks': {
      icon: <Building className="h-5 w-5 text-blue-400" />,
      tagline: 'CECL Credit Loss Reserve Underprovisioning, Level 3 Fair Value Discretion & HTM Unrealized Losses',
      criticalFlags: [
        'BNK-01: Current Expected Credit Loss (CECL) Reserve Adequacy',
        'BNK-07: Held-to-Maturity (HTM) Bond Losses vs Tangible Common Equity',
        'BNK-14: Illiquid Level 3 Fair Value Assets / Tier 1 Capital'
      ],
      sampleFormula: 'HTM Unrealized Losses / Tangible Common Equity > 35.0%',
      secSource: '10-K Note: Investment Securities (Amortized Cost vs Fair Value)',
      marqueeTicker: 'JPM'
    },
    'Payments': {
      icon: <CreditCard className="h-5 w-5 text-indigo-400" />,
      tagline: 'Customer Float Arbitrage Masking Take-Rate Decay, Settlement Float Lag & Chargeback Reserves',
      criticalFlags: [
        'PAY-02: Core Processing Take-Rate vs Float Interest Dependence',
        'PAY-09: Merchant Chargeback Indemnification Reserve Underfunding',
        'PAY-16: Settlement Assets Aging vs Acquiring Bank Congestion'
      ],
      sampleFormula: 'Merchant Loss Reserves / Total Processing Volume < 3-Yr Baseline',
      secSource: '10-K Item 7: Operating Results & Settlement Obligations',
      marqueeTicker: 'V'
    },
    'Healthcare': {
      icon: <HeartPulse className="h-5 w-5 text-rose-400" />,
      tagline: 'Implicit Price Concessions & Payer Denials, Clinical Milestone Capitalization & 340B Clawbacks',
      criticalFlags: [
        'HTH-01: Implicit Price Concessions & Denials Reserve Volatility',
        'HTH-08: Clinical Trial In-Process R&D Milestone Capitalization',
        'HTH-20: Unamortized Goodwill from Acquired Physician Practice Rollups'
      ],
      sampleFormula: 'DSO > 75 days with Implicit Price Concessions < 2.5% of Gross Charges',
      secSource: '10-K Note: Patient Service Revenue & Variable Consideration',
      marqueeTicker: 'PFE'
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-red-500 selection:text-white">
      {/* 1. TOP INSTITUTIONAL HEADER */}
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Logo size="md" showSubtitle={true} />

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs text-slate-400 font-medium">
            <a href="#methodology" className="hover:text-white transition-colors">Forensic Models</a>
            <a href="#lenses" className="hover:text-white transition-colors">7 Sector Lenses</a>
            <a href="#dossiers" className="hover:text-white transition-colors">Audited Case Studies</a>
            <a href="#pipeline" className="hover:text-white transition-colors">SEC EDGAR Pipeline</a>
            <button
              onClick={() => setIsPricingModalOpen(true)}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>Institutional Pricing</span>
            </button>
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
              onClick={() => onNavigateToTerminal('AAPL', 'terminal')}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <span>Enter Forensic Terminal</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. REAL-TIME MARKET TELEMETRY & SEC PIPELINE STATUS RIBBON */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 px-4 py-2 text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-white font-semibold">SEC EDGAR XBRL INGESTION ACTIVE</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-medium">Live Yahoo Finance Telemetry Stream</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400 flex-wrap">
            {(['AAPL', 'NVDA', 'TSLA', 'MSFT', 'PLTR'] as const).map((tk) => {
              const q = ribbonQuotes[tk];
              const price = q ? q.regularMarketPrice.toFixed(2) : '...';
              const chg = q ? q.regularMarketChangePercent : 0;
              const chgDollar = q ? q.regularMarketChange : 0;
              const isUp = chg >= 0;
              return (
                <button
                  key={tk}
                  onClick={() => onNavigateToTerminal(tk, 'terminal')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800"
                  title={`Open ${tk} Forensic Audit Dossier`}
                >
                  <span className="font-bold text-slate-200">{tk}:</span>
                  <strong className="text-white">${price}</strong>
                  <span className={isUp ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>
                    {isUp ? '+' : ''}${Math.abs(chgDollar).toFixed(2)} ({isUp ? '+' : ''}{chg.toFixed(2)}%)
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. HERO COVER SECTION */}
      <section className="relative pt-16 pb-20 px-4 border-b border-slate-800 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 text-xs rounded-full text-red-400 font-medium font-mono">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>INSTITUTIONAL FORENSIC FINANCIAL INTELLIGENCE PLATFORM</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight font-sans">
              Detect Accounting Irregularities, Earnings Manipulation &amp; Hidden Liabilities
            </h1>

            <p className="text-base text-slate-300 leading-relaxed font-sans">
              Autonomous forensic auditing engine calibrated against <strong className="text-white">SEC EDGAR Form 10-K/10-Q XBRL filings</strong> and real-time equity market data. Scrutinizes public companies across <strong className="text-white">30 specialized red flags per sector lens</strong>, Beneish M-Score, Altman Z-Score, and Sloan Accruals.
            </p>
          </div>

          {/* Central Ticker Investigation Search Box */}
          <div className="max-w-2xl bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-2xl space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-white">
              <span className="flex items-center gap-2">
                <Search className="h-4 w-4 text-red-400" />
                <span>Search Any NYSE or NASDAQ Equity to Audit</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">7,600+ Verified US Equities</span>
            </div>

            <TickerSearch
              onSelectCompany={(ticker) => onNavigateToTerminal(ticker, 'terminal')}
              placeholder="Enter ticker symbol or company name (e.g. AAPL, NVDA, TSLA, MSFT)..."
              variant="hero"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-400 font-sans">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>Instant dossiers:</span>
                {(['AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMZN', 'GOOGL', 'PLTR'] as const).map((tk) => (
                  <button
                    key={tk}
                    onClick={() => onNavigateToTerminal(tk, 'terminal')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-xs border border-slate-700 transition-colors cursor-pointer"
                  >
                    {tk}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">✓ Ground truth SEC XBRL proof</span>
            </div>
          </div>

          {/* Interactive Quick Portal Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl pt-2">
            <button
              onClick={() => onNavigateToTerminal('AAPL', 'terminal')}
              className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all cursor-pointer group"
            >
              <BarChart3 className="h-4 w-4 text-red-400 mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Executive Terminal</div>
              <div className="text-[10px] text-slate-400">Live price &amp; ratios</div>
            </button>

            <button
              onClick={() => onNavigateToTerminal('NVDA', 'lenses', 'AI/Deep Tech')}
              className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all cursor-pointer group"
            >
              <Layers className="h-4 w-4 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">7 Sector Lenses</div>
              <div className="text-[10px] text-slate-400">Deep-dive sub-pages</div>
            </button>

            <button
              onClick={() => onNavigateToTerminal('AAPL', 'matrix')}
              className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all cursor-pointer group"
            >
              <ShieldAlert className="h-4 w-4 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">30 Red Flags</div>
              <div className="text-[10px] text-slate-400">SEC audit matrix</div>
            </button>

            <button
              onClick={() => onNavigateToTerminal('AAPL', 'simulator')}
              className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all cursor-pointer group"
            >
              <Activity className="h-4 w-4 text-indigo-400 mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Stress Simulator</div>
              <div className="text-[10px] text-slate-400">Working capital shock</div>
            </button>
          </div>
        </div>
      </section>

      {/* 4. THE 7 SPECIALIZED INDUSTRY LENSES INTERACTIVE SHOWCASE */}
      <section id="lenses" className="py-16 px-4 max-w-7xl mx-auto space-y-8 border-b border-slate-800">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-mono uppercase tracking-wider text-red-400 font-semibold flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-purple-400" />
              <span>Multi-Sector Audit Taxonomy</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              7 Specialized Industry Lenses with Dedicated Sub-Pages
            </h2>
            <p className="text-xs text-slate-400">
              Generic financial models fail because SaaS metrics differ completely from commercial bank reserves or semiconductor fab commitments. Explore our 7 bespoke sector lenses:
            </p>
          </div>

          <button
            onClick={() => onNavigateToTerminal('AAPL', 'lenses')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <span>Open All 7 Lens Sub-Pages</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Lens Tab Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
          {(Object.keys(LENS_DETAILS) as IndustryLens[]).map((lens) => (
            <button
              key={lens}
              onClick={() => setActiveLensTab(lens)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                activeLensTab === lens
                  ? 'bg-red-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {LENS_DETAILS[lens].icon}
              <span>{lens}</span>
            </button>
          ))}
        </div>

        {/* Active Lens Feature Spotlight Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                {LENS_DETAILS[activeLensTab].icon}
              </div>
              <div>
                <span className="text-[11px] font-mono text-red-400 font-bold uppercase tracking-wider">
                  Specialized Sector Sub-Page Portal
                </span>
                <h3 className="text-xl font-bold text-white">
                  {activeLensTab} Forensic Accounting Lens
                </h3>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTerminal(LENS_DETAILS[activeLensTab].marqueeTicker, 'lenses', activeLensTab)}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              <span>Launch {activeLensTab} Dedicated Sub-Page</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            {LENS_DETAILS[activeLensTab].tagline}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LENS_DETAILS[activeLensTab].criticalFlags.map((flag, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1.5">
                <span className="text-red-400 font-mono font-bold text-[10px]">CRITICAL ANOMALY RULE</span>
                <p className="text-slate-200 font-semibold">{flag}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs font-mono">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Mathematical Detection Formula</span>
              <code className="text-cyan-300 font-semibold block mt-1 text-xs">
                {LENS_DETAILS[activeLensTab].sampleFormula}
              </code>
            </div>
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Governing SEC EDGAR Disclosure Target</span>
              <span className="text-slate-200 block mt-1 text-xs font-sans font-medium">
                {LENS_DETAILS[activeLensTab].secSource}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE 4 EMPIRICAL FORENSIC VECTORS */}
      <section id="methodology" className="py-16 px-4 max-w-7xl mx-auto space-y-8 border-b border-slate-800">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-mono uppercase tracking-wider text-red-400 font-semibold flex items-center gap-1.5">
            <Scale className="h-3.5 w-3.5 text-amber-400" />
            <span>Quantitative Accounting Ratios</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            The 4 Empirical Forensic Vectors
          </h2>
          <p className="text-xs text-slate-400">
            Ground-truth mathematical proofs executed autonomously on every ticker from verified SEC 10-K balance sheets and income statements:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                VECTOR 1
              </span>
              <span className="text-[10px] font-mono text-slate-400">Threshold: &gt; -1.78</span>
            </div>
            <h3 className="text-base font-bold text-white">Beneish 8-Factor M-Score</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Detects systematic financial earnings manipulation via 8 standardized variables (DSRI, GMI, AQI, SGI, DEPI, SGAI, LVGI, TATA).
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-300">
              Calculates probability of retrospective earnings restatement.
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                VECTOR 2
              </span>
              <span className="text-[10px] font-mono text-slate-400">Threshold: &lt; 1.81</span>
            </div>
            <h3 className="text-base font-bold text-white">Altman Z-Score</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Evaluates bankruptcy likelihood and structural credit distress across working capital, retained earnings, EBIT, market equity, and sales.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-300">
              Categorizes into Safe (&gt;2.99), Grey, or Distress Zone.
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                VECTOR 3
              </span>
              <span className="text-[10px] font-mono text-slate-400">Threshold: &gt; 10.0%</span>
            </div>
            <h3 className="text-base font-bold text-white">Sloan Accrual Ratio</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Measures divergence where reported net income surges while operating cash flow lags, revealing paper earnings vulnerable to reversal.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-300">
              Formula: (Net Income - OCF) / Total Assets.
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                VECTOR 4
              </span>
              <span className="text-[10px] font-mono text-slate-400">YoY Expansion</span>
            </div>
            <h3 className="text-base font-bold text-white">Working Capital DSO/DIO</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Monitors Days Sales Outstanding (DSO) and Days Inventory Outstanding (DIO) expansion, flagging channel stuffing and unsellable stock buildup.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-300">
              Tracks cash conversion cycle decay across consecutive years.
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURED FORENSIC AUDIT DOSSIERS */}
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
              Click any company to inspect its full 30 Red Flags matrix, live stock chart, and mathematical ratios
            </p>
          </div>
          <button
            onClick={() => onNavigateToTerminal('AAPL', 'terminal')}
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
              onClick={() => onNavigateToTerminal(item.ticker, 'terminal')}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl space-y-4 transition-all hover:shadow-xl cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center font-mono font-bold text-red-400 text-sm">
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

                <div className="text-right font-mono">
                  {ribbonQuotes[item.ticker] && (
                    <div className="text-xs font-bold mb-1">
                      <span className="text-white">${ribbonQuotes[item.ticker].regularMarketPrice.toFixed(2)}</span>{' '}
                      <span className={ribbonQuotes[item.ticker].regularMarketChangePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {ribbonQuotes[item.ticker].regularMarketChangePercent >= 0 ? '+' : ''}{ribbonQuotes[item.ticker].regularMarketChangePercent.toFixed(2)}%
                      </span>
                    </div>
                  )}
                  <div className="text-xs font-bold text-slate-300">
                    Health Score: <span className="text-emerald-400">{item.score}/100 ({item.grade})</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-200">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.summary}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-4 text-[11px]">
                  <span>M-Score: <strong className="text-slate-200">{item.mScore}</strong></span>
                  <span>Z-Score: <strong className="text-slate-200">{item.zScore}</strong></span>
                  <span>Accrual: <strong className="text-slate-200">{item.accrual}</strong></span>
                </div>
                <span className="text-red-400 text-xs font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Audit <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. DATA PIPELINE ARCHITECTURE */}
      <section id="pipeline" className="py-16 px-4 max-w-7xl mx-auto space-y-6 border-b border-slate-800">
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
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2.5">
            <div className="text-emerald-400 font-mono font-bold text-xs">TIER 1 · SEC EDGAR XBRL</div>
            <h3 className="font-semibold text-white text-sm">Primary Accounting Ground Truth</h3>
            <p className="text-slate-400 leading-relaxed">
              Direct connection to SEC EDGAR Company Facts API ingesting audited US-GAAP XBRL line items (Balance Sheet, Income Statement, Cash Flows, Footnotes) keyed by 10-digit CIK.
            </p>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2.5">
            <div className="text-cyan-400 font-mono font-bold text-xs">TIER 2 · YAHOO FINANCE LIVE</div>
            <h3 className="font-semibold text-white text-sm">Live Market Price Telemetry</h3>
            <p className="text-slate-400 leading-relaxed">
              Real-time quotes, official previous close baselines, high-frequency candlestick price feeds (1D, 5D, 1M, 6M, YTD, 1Y, 5Y, MAX), intraday volume, and live equity market capitalization.
            </p>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2.5">
            <div className="text-red-400 font-mono font-bold text-xs">TIER 3 · FORENSIC ENGINE</div>
            <h3 className="font-semibold text-white text-sm">Mathematical Calculation Engine</h3>
            <p className="text-slate-400 leading-relaxed">
              Instant evaluation of Beneish 8-Factor M-Score, Altman Z-Score, Sloan Accruals, Working Capital DSO/DIO, and 30 sector-governed red flags with step-by-step mathematical proof.
            </p>
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION BANNER */}
      <section className="py-20 px-4 max-w-7xl mx-auto text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Ready to Conduct Deep Forensic Audits on Public Equities?
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Gain institutional clarity with 30 sector-governed red flags, audited SEC line-item tracing, and live stock market telemetry.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigateToTerminal('AAPL', 'terminal')}
            className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-red-950/50 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Launch Institutional Terminal</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={onNavigateToSignup}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 rounded-xl text-sm font-semibold transition-all cursor-pointer"
          >
            Create Institutional Account
          </button>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-4 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" showSubtitle={false} />
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigateToTerminal('AAPL', 'terminal')} className="hover:text-slate-300">Terminal</button>
            <button onClick={() => onNavigateToTerminal('AAPL', 'lenses')} className="hover:text-slate-300">7 Lenses</button>
            <button onClick={() => onNavigateToTerminal('AAPL', 'matrix')} className="hover:text-slate-300">30 Flags</button>
            <button onClick={onNavigateToLogin} className="hover:text-slate-300">Sign In</button>
          </div>
          <div>
            © {new Date().getFullYear()} RedFlag Terminal. Autonomous Financial Forensics.
          </div>
        </div>
      </footer>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        onSelectPlan={() => {
          setIsPricingModalOpen(false);
          onNavigateToSignup();
        }}
      />
    </div>
  );
};
