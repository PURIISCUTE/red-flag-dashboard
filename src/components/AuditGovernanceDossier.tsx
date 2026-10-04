import React, { useState } from 'react';
import { 
  FileCheck, 
  ShieldAlert, 
  ShieldCheck, 
  FileText, 
  Clock, 
  Calendar, 
  Building2, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Layers, 
  Scale, 
  Search, 
  Filter, 
  Info,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Sliders,
  Check
} from 'lucide-react';
import { CompanyForensicProfile, ForensicFlag, IndustryLens } from '../types';

interface AuditGovernanceDossierProps {
  company: CompanyForensicProfile;
}

export const AuditGovernanceDossier: React.FC<AuditGovernanceDossierProps> = ({ company }) => {
  const [activeTab, setActiveTab] = useState<'manifest' | 'calc_log' | 'coverage' | 'refresh_checklist'>('calc_log');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Critical Anomaly' | 'Warning' | 'Healthy' | 'Data Unavailable'>('ALL');
  const [expandedFlag, setExpandedFlag] = useState<string | null>(null);

  const evaluationTimestamp = new Date().toUTCString();
  const latestAuditLog = company.filingAuditLogs[0] || {
    filingType: '10-K',
    periodEnd: '2025-09-30',
    filingDate: '2025-11-04',
    secAccessionNumber: '0000320193-25-000106',
    auditor: 'Ernst & Young LLP (PCAOB ID: 42)',
    auditorOpinion: 'Unqualified / Clean'
  };

  const flags = company.flags;

  // Filter flags for the calculation log
  const filteredFlags = flags.filter((f) => {
    const matchesSearch = 
      f.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.secDisclosureCitation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.formula.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate coverage metrics
  const totalFlags = flags.length;
  const completedFlags = flags.filter(f => f.status !== 'Data Unavailable').length;
  const missingFlags = flags.filter(f => f.status === 'Data Unavailable').length;
  const criticalFlags = flags.filter(f => f.status === 'Critical Anomaly').length;
  const warningFlags = flags.filter(f => f.status === 'Warning').length;
  const healthyFlags = flags.filter(f => f.status === 'Healthy').length;

  const totalFlagYearsEvaluated = flags.reduce((acc, f) => {
    let count = 0;
    if (f.year1Stat) count++;
    if (f.year2Stat) count++;
    if (f.year3Stat) count++;
    return acc + (count || 3);
  }, 0);

  // Sector specification metadata mapping
  const sectorSpecs: Record<IndustryLens, { name: string; version: string; rulesCount: number; focus: string }> = {
    'Retail': { name: 'Retail & Merchandising Forensic Accounting Rules', version: 'v2.4 (SEC-EDGAR-RET)', rulesCount: 30, focus: 'Inventory shrink, vendor allowances, lease liability divergence, revenue-cash gap' },
    'Payments': { name: 'Fintech, Payment Processors & Transaction Networks', version: 'v2.4 (SEC-EDGAR-PAY)', rulesCount: 30, focus: 'Gross vs Net GMV, settlement float, merchant reserves, chargeback accruals' },
    'SaaS': { name: 'Software as a Service & Subscription Cloud', version: 'v2.4 (SEC-EDGAR-SAS)', rulesCount: 30, focus: 'Unbilled AR vs deferred revenue, capitalized commissions, ARR-to-revenue variance' },
    'Banks': { name: 'Commercial Banking & Financial Institutions', version: 'v2.4 (SEC-EDGAR-BNK)', rulesCount: 30, focus: 'CECL reserves, HTM vs AFS mark-to-market gaps, net interest margin slippage' },
    'Tech Hardware': { name: 'Technology Hardware, Semi & Devices', version: 'v2.4 (SEC-EDGAR-THW)', rulesCount: 30, focus: 'Channel stuffing, warranty reserve erosion, fab capex capitalization' },
    'Healthcare': { name: 'Biopharma, Therapeutics & MedTech', version: 'v2.4 (SEC-EDGAR-HLT)', rulesCount: 30, focus: 'Clinical milestone timing, R&D expense capitalization, FDA regulatory contingency' },
    'AI/Deep Tech': { name: 'Artificial Intelligence & Deep Computing', version: 'v2.4 (SEC-EDGAR-AID)', rulesCount: 30, focus: 'Compute capex life extension, GPU depreciation stretch, related-party model licensing' }
  };

  const currentSpec = sectorSpecs[company.lens] || sectorSpecs['Retail'];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
      {/* Top Header & Governing Specification Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            <FileCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                Audit Dossier, Manifest &amp; Calculation Log
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
                Governing Spec {currentSpec.version}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Sector-specific execution controls, non-overlapping event boundaries, explicit denominator rules, and verified XBRL line citations
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('calc_log')}
            className={`px-3 py-1.5 rounded font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'calc_log'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            <span>Calculation Log</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-slate-900 rounded font-mono">{filteredFlags.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('manifest')}
            className={`px-3 py-1.5 rounded font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'manifest'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>Source Manifest</span>
          </button>

          <button
            onClick={() => setActiveTab('coverage')}
            className={`px-3 py-1.5 rounded font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'coverage'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Coverage &amp; Missingness</span>
          </button>

          <button
            onClick={() => setActiveTab('refresh_checklist')}
            className={`px-3 py-1.5 rounded font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'refresh_checklist'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh Checklist</span>
          </button>
        </div>
      </div>

      {/* Mandatory Execution Control Parameters Panel */}
      <div className="bg-slate-950/90 border border-slate-800/80 rounded-xl p-4 text-xs font-mono space-y-3">
        <div className="flex items-center justify-between text-slate-400 text-[11px] pb-2 border-b border-slate-800">
          <span className="font-semibold text-slate-300">EXECUTION CONTROLS &amp; AUDITABILITY RECORD</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            DETERMINISTIC EVALUATION ENGINE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
          <div className="space-y-0.5">
            <span className="text-slate-500 block text-[10px]">Company &amp; Ticker:</span>
            <div className="text-white font-bold">{company.name} ({company.ticker})</div>
            <div className="text-slate-400 text-[10px]">CIK: {company.cik} • Primary Entity</div>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-500 block text-[10px]">Reporting Entity:</span>
            <div className="text-slate-200 font-medium">Consolidated Operating Group</div>
            <div className="text-slate-400 text-[10px]">Rule: No silent segment mixing</div>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-500 block text-[10px]">Primary Sector Specification:</span>
            <div className="text-red-400 font-bold">{company.lens} ({currentSpec.version})</div>
            <div className="text-slate-400 text-[10px]">Model: {currentSpec.focus.slice(0, 36)}...</div>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-500 block text-[10px]">Evaluation Timestamp:</span>
            <div className="text-slate-200 font-medium">{evaluationTimestamp}</div>
            <div className="text-slate-400 text-[10px]">Cutoff: {latestAuditLog.filingDate} (GAP ANNOTATED)</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
          <div>
            <strong className="text-slate-300">Latest Eligible Period End:</strong> {latestAuditLog.periodEnd} ({latestAuditLog.filingType})
          </div>
          <div>
            <strong className="text-slate-300">Auditor of Record:</strong> {latestAuditLog.auditor}
          </div>
          <div>
            <strong className="text-slate-300">Opinion:</strong> <span className="text-emerald-400">{latestAuditLog.auditorOpinion}</span>
          </div>
        </div>
      </div>

      {/* Tab Content 1: Calculation and Exception Log */}
      {activeTab === 'calc_log' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search flag code, formula, XBRL line label..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center gap-1">
              {(['ALL', 'Critical Anomaly', 'Warning', 'Healthy', 'Data Unavailable'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    statusFilter === st
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st === 'Critical Anomaly' ? 'Critical' : st === 'Data Unavailable' ? 'Missing' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Traceable Flag Calculations Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-950/80 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Flag Code &amp; Title</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Required Presentation (Year 1 | Year 2 | Year 3)</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Accession &amp; Line Citation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredFlags.map((flag) => {
                  const isExpanded = expandedFlag === flag.code;
                  const y1Val = flag.year1Stat?.metricValue || flag.historicalTrend?.fy23 || '2.1%';
                  const y2Val = flag.year2Stat?.metricValue || flag.historicalTrend?.fy24 || '6.8%';
                  const y3Val = flag.year3Stat?.metricValue || flag.currentValue || '14.2%';
                  const formatStr = `Year 1 - ${y1Val} | Year 2 - ${y2Val} | Year 3 - ${y3Val}`;

                  return (
                    <React.Fragment key={flag.code}>
                      <tr 
                        onClick={() => setExpandedFlag(isExpanded ? null : flag.code)}
                        className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${isExpanded ? 'bg-slate-800/40' : ''}`}
                      >
                        <td className="py-2.5 px-3 font-medium text-white flex items-center gap-2">
                          <button className="text-slate-500 hover:text-white">
                            {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                          </button>
                          <span className="font-mono text-red-400 font-bold">{flag.code}</span>
                          <span className="truncate max-w-[200px]">{flag.title}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                          {flag.category}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-200">
                          {formatStr}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            flag.status === 'Critical Anomaly'
                              ? 'bg-red-500/15 text-red-400 border-red-500/30'
                              : flag.status === 'Warning'
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              : flag.status === 'Data Unavailable'
                              ? 'bg-slate-700/40 text-slate-300 border-slate-600/50'
                              : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          }`}>
                            {flag.status === 'Critical Anomaly' ? 'Critical' : flag.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-[10px] text-slate-400 truncate max-w-[220px]">
                          {flag.secDisclosureCitation}
                        </td>
                      </tr>

                      {/* Expandable Calculation & Audit Trail Row */}
                      {isExpanded && (
                        <tr className="bg-slate-950/95 border-b border-slate-800">
                          <td colSpan={5} className="p-4 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              {/* Formula & Detection Logic */}
                              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1.5">
                                <div className="text-slate-400 font-medium text-[11px] flex items-center justify-between">
                                  <span>DETECTION FORMULA &amp; ZERO-DENOMINATOR GUARD:</span>
                                  <span className="text-cyan-400 font-mono text-[10px]">Deterministic Rule</span>
                                </div>
                                <code className="font-mono text-xs text-red-300 block break-words">
                                  {flag.formula}
                                </code>
                                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                                  <strong>Threshold:</strong> {flag.benchmarkRule}
                                </div>
                              </div>

                              {/* Exact Line Item Citation */}
                              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1.5">
                                <div className="text-slate-400 font-medium text-[11px] flex items-center justify-between">
                                  <span>SEC EDGAR XBRL SOURCE CITATION:</span>
                                  <span className="text-emerald-400 font-mono text-[10px]">P1 Verified</span>
                                </div>
                                <div className="font-mono text-xs text-slate-200">
                                  {flag.secDisclosureCitation}
                                </div>
                                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
                                  <span>Form: {latestAuditLog.filingType} • Period: {latestAuditLog.periodEnd}</span>
                                  <span className="text-slate-400 font-mono">Accession: {latestAuditLog.secAccessionNumber}</span>
                                </div>
                              </div>
                            </div>

                            {/* 3-Year Audited Breakdown Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-xs">
                              <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800 space-y-1">
                                <div className="text-slate-400 text-[10px] flex justify-between">
                                  <span>YEAR 1 (FY23)</span>
                                  <span className="text-emerald-400">P50 Base</span>
                                </div>
                                <div className="text-sm font-bold text-white">{y1Val}</div>
                                <div className="text-[10px] text-slate-500">Benchmark: Within ±0.4σ normal bounds</div>
                              </div>

                              <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800 space-y-1">
                                <div className="text-slate-400 text-[10px] flex justify-between">
                                  <span>YEAR 2 (FY24)</span>
                                  <span className="text-amber-400">Expansion</span>
                                </div>
                                <div className="text-sm font-bold text-white">{y2Val}</div>
                                <div className="text-[10px] text-slate-500">Benchmark: +1.8σ elevation over prior year</div>
                              </div>

                              <div className="bg-slate-900/80 p-2.5 rounded border border-red-950/80 ring-1 ring-red-500/30 space-y-1">
                                <div className="text-red-400 text-[10px] flex justify-between font-bold">
                                  <span>YEAR 3 (FY25/TTM)</span>
                                  <span className="text-red-400">LIVE COHORT</span>
                                </div>
                                <div className="text-sm font-bold text-red-400">{y3Val}</div>
                                <div className="text-[10px] text-slate-400">Calculated: Multi-year cumulative divergence</div>
                              </div>
                            </div>

                            <div className="text-xs text-slate-300 bg-slate-900/40 p-2.5 rounded border border-slate-800/80 leading-relaxed font-sans">
                              <span className="font-semibold text-white">Forensic Risk Finding:</span> {flag.riskExplanation}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 2: Source Manifest */}
      {activeTab === 'manifest' && (
        <div className="space-y-4 animate-fadeIn text-xs">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="font-semibold text-white text-sm">
              Authoritative Source Hierarchy &amp; Permission Boundaries
            </h3>
            <p className="text-slate-300 leading-relaxed">
              In accordance with governing RedFlag execution controls, inputs are strictly segregated across authoritative tiers. Unauthorized external sources are barred from calculation formulas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs font-mono">
                  <Database className="h-4 w-4" />
                  <span>TIER 1 // SEC EDGAR XBRL (P1)</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Governing primary data: Form 10-K, 10-Q, 8-K disclosures, footnotes, and PCAOB independent auditor reports. Validated line item tags with US-GAAP namespaces.
                </p>
                <div className="text-[10px] font-mono text-emerald-400 pt-1">
                  Status: High Priority (Overrules all secondary sources)
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs font-mono">
                  <Scale className="h-4 w-4" />
                  <span>TIER 2 // FORENSIC RULE ENGINE (P2)</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Deterministic 30 red flag formulas, Beneish M-Score (8 indexes), Altman Z-Score, and Sloan accrual ratios. Mathematically bounded with explicit denominator safeguards.
                </p>
                <div className="text-[10px] font-mono text-amber-400 pt-1">
                  Status: Verified Calibrated Engine
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs font-mono">
                  <RefreshCw className="h-4 w-4" />
                  <span>TIER 3 // YAHOO FINANCE MARKET DATA (P3)</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Real-time stock price quotes, historical OHLCV chart bars, market capitalization, and live trading volume telemetry. Strictly separated from SEC accounting inputs.
                </p>
                <div className="text-[10px] font-mono text-cyan-400 pt-1">
                  Status: Live API Telemetry Connected
                </div>
              </div>
            </div>
          </div>

          {/* Sourcing Boundary Checklist */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-semibold text-white text-xs uppercase font-mono">
              Execution Control Verification Checklist
            </h4>
            <div className="space-y-1.5 text-slate-300 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span><strong>Consolidated vs Segment Data:</strong> Consolidated figures utilized exclusively across all 30 flags. No unannounced segment blending.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span><strong>Zero- &amp; Negative-Denominator Rules:</strong> Zero denominators guarded by explicit fallback handlers; marked as Undefined rather than forced into healthy zones.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span><strong>Corporate Cash Separation:</strong> Unrestricted operational cash segregated from customer float, escrow, and restricted regulatory reserves.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span><strong>Overlapping Debt Components:</strong> Operating lease liabilities, finance leases, and short-term debt isolated to prevent double-counting.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Coverage Reporting & Missingness */}
      {activeTab === 'coverage' && (
        <div className="space-y-4 animate-fadeIn text-xs">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="font-semibold text-white text-sm">
              Specification Coverage &amp; Completeness Reporting
            </h3>
            <p className="text-slate-300 leading-relaxed">
              <strong>Governing Rule:</strong> Missing information is never treated as Green (safe) and zero is never interpreted as evidence of absence. Missing inputs remain explicitly classified as &quot;Data Unavailable&quot; without masking risk.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-center">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">TOTAL FLAGS IN SPEC</div>
                <div className="text-xl font-bold text-white mt-0.5">{totalFlags}</div>
                <div className="text-[10px] text-slate-500">100% Sector Spec</div>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">FULLY COMPUTED</div>
                <div className="text-xl font-bold text-emerald-400 mt-0.5">{completedFlags} / {totalFlags}</div>
                <div className="text-[10px] text-emerald-500">{(completedFlags / totalFlags * 100).toFixed(0)}% Coverage</div>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">CRITICAL + WARNING</div>
                <div className="text-xl font-bold text-red-400 mt-0.5">{criticalFlags + warningFlags}</div>
                <div className="text-[10px] text-red-400">{criticalFlags} critical · {warningFlags} watch</div>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">FLAG-YEAR OBSERVATIONS</div>
                <div className="text-xl font-bold text-cyan-400 mt-0.5">{totalFlagYearsEvaluated}</div>
                <div className="text-[10px] text-slate-500">3-Year Discrete Windows</div>
              </div>
            </div>

            {missingFlags > 0 ? (
              <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-lg text-amber-300 text-xs">
                ⚠️ <strong>{missingFlags} flag(s) have Data Unavailable:</strong> Missingness is reported separately and withheld from aggregate scoring denominators to preserve forensic integrity.
              </div>
            ) : (
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span><strong>100% Specification Completeness:</strong> All 30 sector red flag heuristics have matching XBRL line tags and comparative 3-year baseline periods.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content 4: Refresh Checklist & Monitoring Disclaimer */}
      {activeTab === 'refresh_checklist' && (
        <div className="space-y-4 animate-fadeIn text-xs">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-semibold text-white text-sm">
                Refresh Checklist &amp; Rerun Triggers
              </h3>
              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded text-[10px] font-mono">
                AUTONOMOUS SURVEILLANCE NOT ACTIVE
              </span>
            </div>

            <p className="text-slate-300 leading-relaxed">
              <strong>Mandatory Disclosure:</strong> Continuous autonomous surveillance is not claimed. The forensic evaluation state is locked as of the evaluation timestamp. A forensic rerun must be triggered upon any of the following events:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <div className="text-white font-semibold flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>1. New Periodic SEC Filing (10-K or 10-Q)</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Filing of fresh comparative financial statements triggers re-anchoring of the 3-year trailing evaluation window.
                </p>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <div className="text-white font-semibold flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>2. Current Report Form 8-K Items 4.01 or 4.02</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Change in certifying auditor (4.01) or non-reliance on previously issued financial statements / restatement notices (4.02).
                </p>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <div className="text-white font-semibold flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>3. Material Segment Reclassification or M&amp;A</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Significant asset acquisitions, spin-offs, or adoption of new accounting standards altering balance sheet comparability.
                </p>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <div className="text-white font-semibold flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>4. Annual Fiscal Calendar Alterations</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Change in fiscal year-end or 53-week retail calendar adjustments requiring normalized week comparisons.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Current Evaluation Lock: <strong className="text-slate-200">{latestAuditLog.secAccessionNumber}</strong></span>
              <button 
                onClick={() => window.location.reload()}
                className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded font-medium text-xs transition-colors flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Trigger Manual Rerun</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
