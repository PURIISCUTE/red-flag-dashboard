import React, { useState } from 'react';
import { 
  Terminal, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  FileText, 
  Database, 
  Scale, 
  Layers, 
  Building2, 
  Search, 
  AlertTriangle, 
  Download, 
  Lock, 
  Activity, 
  TrendingUp, 
  BarChart3, 
  ChevronRight,
  ExternalLink,
  Sparkles
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
    <div className="min-h-screen bg-[#080b10] text-[#e1e2ea] font-sans selection:bg-[#FF4D4D] selection:text-white">
      {/* Top Telemetry Header */}
      <header className="border-b border-[#1c2233] bg-[#0c0f17]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Logo size="md" showSubtitle={true} />

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-[#a0aec0]">
            <a href="#features" className="hover:text-white transition-colors">Core Engine</a>
            <a href="#lenses" className="hover:text-white transition-colors">210 Forensic Matrix</a>
            <a href="#pipeline" className="hover:text-white transition-colors">SEC Ground Truth</a>
            <a href="#pricing" className="hover:text-white transition-colors">Institutional Access</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 font-mono text-xs">
            <button
              onClick={onNavigateToLogin}
              className="px-3.5 py-1.5 text-[#cbd5e1] hover:text-white hover:bg-[#161c2b] border border-transparent hover:border-[#2b354d] transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onNavigateToSignup}
              className="hidden sm:inline-block px-3.5 py-1.5 bg-[#141b2b] hover:bg-[#1d273d] text-white border border-[#2b3954] transition-colors font-bold"
            >
              Create Account
            </button>
            <button
              onClick={() => onNavigateToDashboard('AAPL')}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#FF4D4D] hover:bg-[#e53e3e] text-white font-bold shadow-[0_0_15px_rgba(255,77,77,0.35)] transition-all"
            >
              <span>Launch Terminal</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 border-b border-[#1c2233] overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#FF4D4D]/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#121724] border border-[#222c42] text-[11px] font-mono text-[#a5b4fc]">
                <span className="h-2 w-2 rounded-full bg-[#38A169] animate-pulse"></span>
                <span>SEC EDGAR XBRL AUDIT ENGINE • DETERMINISTIC V4.8</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
                Autonomous Financial Forensics &amp; Earnings Discrepancy Terminal
              </h1>

              <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed max-w-2xl font-normal">
                Detect revenue manipulation, aggressive accruals, and hidden balance-sheet liabilities across <span className="text-white font-semibold">210 specialized forensic heuristics</span> spanning 7 industry lenses. Calibrated deterministically with zero score jitter against primary SEC EDGAR ground truth.
              </p>

              {/* Bullet Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-[#cbd5e1] pt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#38A169] shrink-0" />
                  <span>Primary SEC EDGAR XBRL P1 Ground Truth</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#38A169] shrink-0" />
                  <span>210 Flags across 7 Specialized Lenses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#38A169] shrink-0" />
                  <span>Beneish M-Score &amp; Sloan Accrual Detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#38A169] shrink-0" />
                  <span>Court-Admissible Multi-Page PDF Audit Exports</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => onNavigateToDashboard('AAPL')}
                  className="flex items-center gap-2 px-6 py-3 bg-[#FF4D4D] hover:bg-[#e53e3e] text-white font-mono font-bold text-sm shadow-[0_0_20px_rgba(255,77,77,0.35)] transition-all"
                >
                  <Terminal className="h-4 w-4" />
                  <span>Launch Live Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={onNavigateToSignup}
                  className="px-5 py-3 bg-[#111724] hover:bg-[#182133] text-white border border-[#27354f] font-mono font-bold text-sm transition-colors"
                >
                  Create Institutional Account
                </button>
              </div>

              <div className="flex items-center gap-4 text-[11px] font-mono text-[#718096]">
                <span>✓ Instant demo access</span>
                <span>•</span>
                <span>✓ No credit card required</span>
                <span>•</span>
                <span>✓ PCAOB compliant methodology</span>
              </div>
            </div>

            {/* Interactive Live Mini-Scanner Terminal Widget */}
            <div className="lg:col-span-5">
              <div className="bg-[#0c1018] border border-[#222a3d] shadow-2xl p-4 font-mono text-xs relative">
                <div className="flex items-center justify-between pb-3 border-b border-[#1c2233] mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#FF4D4D] animate-ping"></span>
                    <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                      Live Mini Terminal Scanner
                    </span>
                  </div>
                  <span className="text-[10px] text-[#a5b4fc]">CLICK TO SWITCH TICKER</span>
                </div>

                {/* Ticker Selector Tabs */}
                <div className="grid grid-cols-4 gap-1.5 mb-3">
                  {(['AAPL', 'NVDA', 'TSLA', 'PYPL'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setHeroTicker(t)}
                      className={`py-1 text-center font-bold text-xs transition-colors border ${
                        heroTicker === t
                          ? 'bg-[#FF4D4D] text-white border-[#FF4D4D]'
                          : 'bg-[#080b10] text-[#8a94a6] border-[#1e2638] hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Profile Card Preview */}
                <div className="bg-[#07090e] border border-[#1a2133] p-3 mb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white text-sm">{heroProfile.name}</h3>
                      <p className="text-[10px] text-[#718096]">
                        {heroProfile.sector} • CIK: {heroProfile.cik}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">${heroProfile.stockPrice.toFixed(2)}</div>
                      <span className={`text-[10px] ${heroProfile.priceChangePercent >= 0 ? 'text-[#38A169]' : 'text-[#FF4D4D]'}`}>
                        {heroProfile.priceChangePercent >= 0 ? '+' : ''}{heroProfile.priceChangePercent}%
                      </span>
                    </div>
                  </div>

                  {/* Core Scores */}
                  <div className="grid grid-cols-3 gap-2 mt-3 text-center pt-2 border-t border-[#161c2b]">
                    <div className="bg-[#0e131d] p-1.5 border border-[#1b2538]">
                      <span className="text-[9px] text-[#718096] block">FORENSIC SCORE</span>
                      <span className="font-bold text-white text-sm">{heroProfile.forensicScore}/100</span>
                    </div>
                    <div className="bg-[#0e131d] p-1.5 border border-[#1b2538]">
                      <span className="text-[9px] text-[#718096] block">BENEISH M-SCORE</span>
                      <span className={`font-bold text-xs ${heroProfile.beneishMScore > -1.78 ? 'text-[#FF4D4D]' : 'text-[#38A169]'}`}>
                        {heroProfile.beneishMScore.toFixed(2)}
                      </span>
                    </div>
                    <div className="bg-[#0e131d] p-1.5 border border-[#1b2538]">
                      <span className="text-[9px] text-[#718096] block">ALTMAN Z-SCORE</span>
                      <span className={`font-bold text-xs ${heroProfile.altmanZScore < 1.81 ? 'text-[#FF4D4D]' : 'text-[#38A169]'}`}>
                        {heroProfile.altmanZScore.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sample Flags Preview */}
                <div className="space-y-1.5 mb-3">
                  <span className="text-[10px] text-[#718096] uppercase font-bold block">
                    Active Forensic Signals Preview ({heroProfile.flags.length} rules checked):
                  </span>
                  {heroProfile.flags.slice(0, 2).map((flag) => (
                    <div
                      key={flag.code}
                      className="p-2 bg-[#070a10] border border-[#1a2133] flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="px-1 py-0.2 bg-[#FF4D4D]/20 text-[#FF4D4D] text-[9px] font-bold">
                          {flag.code}
                        </span>
                        <span className="text-[#cbd5e1] truncate">{flag.title}</span>
                      </div>
                      <span className={`shrink-0 ml-2 text-[10px] font-bold ${
                        flag.status === 'Critical Anomaly' ? 'text-[#FF4D4D]' : flag.status === 'Warning' ? 'text-[#ECC94B]' : 'text-[#38A169]'
                      }`}>
                        {flag.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Deep Dive Button */}
                <button
                  onClick={() => onNavigateToDashboard(heroTicker)}
                  className="w-full py-2 bg-[#1b2438] hover:bg-[#25324d] text-[#a5b4fc] hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-[#2a3854] transition-colors"
                >
                  <span>Open Complete {heroTicker} Audit in Terminal</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Telemetry Metrics Strip */}
      <section className="border-b border-[#1c2233] bg-[#0b0e16] py-5 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono text-xs">
          <div className="p-3 border-r border-[#1a2133] last:border-0">
            <div className="text-2xl font-bold text-white">210</div>
            <div className="text-[11px] text-[#718096] uppercase">Heuristic Forensic Flags</div>
          </div>
          <div className="p-3 border-r border-[#1a2133] last:border-0">
            <div className="text-2xl font-bold text-[#FF4D4D]">7 Lenses</div>
            <div className="text-[11px] text-[#718096] uppercase">Industry-Specific Taxonomies</div>
          </div>
          <div className="p-3 border-r border-[#1a2133] last:border-0">
            <div className="text-2xl font-bold text-[#38A169]">0% Jitter</div>
            <div className="text-[11px] text-[#718096] uppercase">Deterministic Reproducibility</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-bold text-[#ECC94B]">SEC P1</div>
            <div className="text-[11px] text-[#718096] uppercase">Direct EDGAR Ground Truth</div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section id="features" className="py-16 px-4 border-b border-[#1c2233]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-2.5 py-1 bg-[#161c2b] text-[#a5b4fc] text-xs font-mono border border-[#27324c]">
              INSTITUTIONAL PRECISION
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans">
              Engineered for Quantitative Funds &amp; Forensic Auditors
            </h2>
            <p className="text-sm text-[#8a94a6]">
              Eliminating the hallucination and drift of generic LLMs with rigorous mathematical formulas and statutory SEC disclosure citations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1 */}
            <div className="bg-[#0c1018] border border-[#1f2638] p-5 space-y-3 hover:border-[#2d3852] transition-colors">
              <div className="h-10 w-10 bg-[#161b29] border border-[#27324c] flex items-center justify-center text-[#a5b4fc]">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="font-mono text-base font-bold text-white">
                4-Tier Ground Truth Pipeline
              </h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Prioritizes SEC EDGAR 10-K/Q XBRL facts as primary truth (P1), evaluated via autonomous forensic heuristic rules (P2), adjusted by real-time Yahoo Finance TTM feeds (P3), and cross-referenced with Kaggle historical fraud quartiles (P4).
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0c1018] border border-[#1f2638] p-5 space-y-3 hover:border-[#2d3852] transition-colors">
              <div className="h-10 w-10 bg-[#251419] border border-[#FF4D4D]/40 flex items-center justify-center text-[#FF4D4D]">
                <Scale className="h-5 w-5" />
              </div>
              <h3 className="font-mono text-base font-bold text-white">
                Beneish M-Score &amp; Sloan Accruals
              </h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Calculates DSRI (Days Sales in Receivables), GMI (Gross Margin), AQI (Asset Quality), SGI, DEPI, SGAI, LVGI, and TATA to uncover earnings inflation, aggressive capitalizations, and hidden working-capital distress.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#0c1018] border border-[#1f2638] p-5 space-y-3 hover:border-[#2d3852] transition-colors">
              <div className="h-10 w-10 bg-[#14231b] border border-[#38A169]/40 flex items-center justify-center text-[#38A169]">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="font-mono text-base font-bold text-white">
                Court-Admissible PDF Reports
              </h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Generates multi-page institutional dossiers with SEC EDGAR accession hashes, PCAOB compliance verifications, multi-year financial statements, and itemized citations ready for investment committees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 7-Lens Explorer */}
      <section id="lenses" className="py-16 px-4 border-b border-[#1c2233] bg-[#0b0e16]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="px-2 py-0.5 bg-[#FF4D4D]/15 text-[#FF4D4D] text-xs font-mono border border-[#FF4D4D]/40">
                210 HEURISTICS ACROSS 7 SECTOR LENSES
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans mt-2">
                Industry-Specific Forensic Taxonomies
              </h2>
              <p className="text-xs text-[#8a94a6] max-w-xl mt-1">
                Accounting fraud looks different in SaaS compared to Banking or Retail. RedFlag Terminal evaluates 30 tailored red flags per sector lens.
              </p>
            </div>
            <button
              onClick={() => onNavigateToDashboard('AAPL')}
              className="text-xs font-mono text-[#a5b4fc] hover:text-white flex items-center gap-1.5"
            >
              <span>Explore full 210 matrix in Terminal</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Lens Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {(['Retail', 'Payments', 'SaaS', 'Banks', 'Tech Hardware', 'Healthcare', 'AI/Deep Tech'] as IndustryLens[]).map((lens) => (
              <button
                key={lens}
                onClick={() => setActiveLensTab(lens)}
                className={`px-3.5 py-1.5 text-xs font-mono font-bold transition-all border ${
                  activeLensTab === lens
                    ? 'bg-[#FF4D4D] text-white border-[#FF4D4D] shadow-[0_0_12px_rgba(255,77,77,0.3)]'
                    : 'bg-[#0e131d] text-[#8a94a6] border-[#1d2639] hover:text-white hover:bg-[#161e2e]'
                }`}
              >
                {lens}
              </button>
            ))}
          </div>

          {/* Selected Lens Showcase Box */}
          <div className="bg-[#080b10] border border-[#222a3d] p-6 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c2333] mb-4">
              <span className="text-sm font-bold text-white uppercase tracking-wider">
                {activeLensTab} Lens • Sample Forensic Heuristics
              </span>
              <span className="text-xs text-[#a5b4fc]">30 SPECIALIZED RULES LOADED</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              {lensExamples[activeLensTab].flags.map((flag, idx) => (
                <div key={idx} className="bg-[#0c1018] p-3.5 border border-[#1b2336] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.2 bg-[#FF4D4D]/20 text-[#FF4D4D] text-[10px] font-bold">
                      FLAG #{idx + 1}
                    </span>
                    <span className="text-[10px] text-[#38A169]">AUDITED RULE</span>
                  </div>
                  <div className="text-xs font-bold text-white">{flag}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#0c1018] p-3 border border-[#1b2336]">
                <span className="text-[10px] text-[#718096] block mb-1">REPRESENTATIVE HEURISTIC FORMULA</span>
                <div className="text-[#cbd5e1] font-bold">{lensExamples[activeLensTab].formula}</div>
              </div>
              <div className="bg-[#0c1018] p-3 border border-[#1b2336]">
                <span className="text-[10px] text-[#718096] block mb-1">MANDATORY SEC EDGAR DISCLOSURE CITATION</span>
                <div className="text-[#a5b4fc] truncate" title={lensExamples[activeLensTab].secCitation}>
                  {lensExamples[activeLensTab].secCitation}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Access Section */}
      <section id="pricing" className="py-16 px-4 border-b border-[#1c2233]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-2.5 py-1 bg-[#161c2b] text-[#a5b4fc] text-xs font-mono border border-[#27324c]">
              ENTERPRISE LICENSING
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans">
              Deployment Tiers for Forensic Specialists
            </h2>
            <p className="text-sm text-[#8a94a6]">
              Select the workstation tier suited to your investment fund or regulatory audit practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier 1 */}
            <div className="bg-[#0c1018] border border-[#1f2638] p-6 space-y-5">
              <div>
                <h3 className="font-mono text-sm font-bold text-white uppercase">Analyst Workstation</h3>
                <div className="text-3xl font-bold text-white mt-2 font-mono">
                  $1,450<span className="text-xs text-[#718096] font-normal"> / month</span>
                </div>
                <p className="text-xs text-[#8a94a6] mt-2">
                  For individual forensic accountants and equity research specialists.
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono text-[#cbd5e1] pt-2 border-t border-[#1a2133]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#38A169]" />
                  <span>All 210 Forensic Rules &amp; 7 Lenses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#38A169]" />
                  <span>Unlimited SEC EDGAR 10-K/Q lookups</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#38A169]" />
                  <span>Multi-Year &amp; TTM Financial Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#38A169]" />
                  <span>50 PDF Audit Exports / month</span>
                </div>
              </div>

              <button
                onClick={onNavigateToSignup}
                className="w-full py-2.5 bg-[#172033] hover:bg-[#202d47] text-white font-mono font-bold text-xs border border-[#2b3a59] transition-colors"
              >
                Provision Analyst Seat
              </button>
            </div>

            {/* Tier 2 (Highlighted) */}
            <div className="bg-[#0f1422] border-2 border-[#FF4D4D] p-6 space-y-5 relative shadow-[0_0_25px_rgba(255,77,77,0.15)]">
              <span className="absolute -top-3 right-4 px-2.5 py-0.5 bg-[#FF4D4D] text-white font-mono text-[10px] font-bold">
                MOST POPULAR
              </span>

              <div>
                <h3 className="font-mono text-sm font-bold text-white uppercase">Institutional Fund</h3>
                <div className="text-3xl font-bold text-white mt-2 font-mono">
                  $5,800<span className="text-xs text-[#718096] font-normal"> / month</span>
                </div>
                <p className="text-xs text-[#8a94a6] mt-2">
                  For long/short equity hedge funds, private equity, and audit partners.
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono text-[#cbd5e1] pt-2 border-t border-[#1f2b42]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#38A169]" />
                  <span>5 Multi-User Workstation Seats</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#38A169]" />
                  <span>Real-Time SEC Live Rescan Pipeline</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#38A169]" />
                  <span>Shared Active Investigation Queue</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#38A169]" />
                  <span>Unlimited Certified PDF Dossiers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#38A169]" />
                  <span>PCAOB Strict Sensitivity Engine</span>
                </div>
              </div>

              <button
                onClick={onNavigateToSignup}
                className="w-full py-2.5 bg-[#FF4D4D] hover:bg-[#e53e3e] text-white font-mono font-bold text-xs shadow-[0_0_15px_rgba(255,77,77,0.3)] transition-all"
              >
                Provision Institutional Plan
              </button>
            </div>

            {/* Tier 3 */}
            <div className="bg-[#0c1018] border border-[#1f2638] p-6 space-y-5">
              <div>
                <h3 className="font-mono text-sm font-bold text-white uppercase">Regulatory &amp; PCAOB</h3>
                <div className="text-3xl font-bold text-white mt-2 font-mono">
                  Custom
                </div>
                <p className="text-xs text-[#8a94a6] mt-2">
                  For securities regulators, enforcement agencies, and global accounting firms.
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono text-[#cbd5e1] pt-2 border-t border-[#1a2133]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#38A169]" />
                  <span>Dedicated On-Premise / VPC Deployment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#38A169]" />
                  <span>Custom Rule Authoring &amp; Calibration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#38A169]" />
                  <span>Full SEC EDGAR Historical Archive Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#38A169]" />
                  <span>SLA Guarantee &amp; Dedicated Forensic Lead</span>
                </div>
              </div>

              <button
                onClick={onNavigateToSignup}
                className="w-full py-2.5 bg-[#172033] hover:bg-[#202d47] text-white font-mono font-bold text-xs border border-[#2b3a59] transition-colors"
              >
                Contact Regulatory Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="py-12 px-4 bg-[#05070a] border-t border-[#161c2b] text-xs font-mono text-[#94a3b8]">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#161c2b]">
            <Logo size="sm" showSubtitle={true} />
            <div className="text-left md:text-right text-[11px] text-[#718096]">
              Statutory SEC EDGAR XBRL Heuristics • Deterministic 210-Flag Matrix • Version 4.8
            </div>
          </div>

          {/* High-Readability Statutory Notice Box */}
          <div className="bg-[#0a0d14] border border-[#1e2538] p-4 text-xs font-sans space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#182033] pb-2">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Statutory Regulatory Notice &amp; Compliance Disclaimers
              </span>
              <span className="px-2 py-0.5 bg-[#FF4D4D]/15 border border-[#FF4D4D]/40 text-[#FF4D4D] font-mono text-[10px] font-bold">
                NOT INVESTMENT ADVICE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
              <p className="text-[#cbd5e1]">
                <strong className="text-white font-semibold">© 2026 RedFlag Terminal.</strong> For informational purposes only — not investment advice. Data sourced via <strong className="text-white">SEC EDGAR</strong>, <strong className="text-white">Yahoo Finance</strong>, and <strong className="text-white">Benchmark Feeds</strong>.
              </p>
              <p className="text-[#94a3b8] md:border-l md:border-[#182033] md:pl-4">
                Deterministic heuristic flag calculations are conducted strictly for <strong className="text-white font-medium">forensic discrepancy triage</strong> and <strong className="text-white font-medium">corporate governance auditing</strong> under PCAOB guidelines.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
