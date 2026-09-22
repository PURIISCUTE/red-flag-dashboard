import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Filter, 
  ChevronRight, 
  Info, 
  Bookmark, 
  Check, 
  Plus, 
  FileText,
  Layers,
  Scale,
  Bot,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Database
} from 'lucide-react';
import { 
  ForensicFlag, 
  IndustryLens, 
  FlagSeverity, 
  CompanyForensicProfile, 
  InvestigationItem,
  ThresholdType,
  ValueMode
} from '../types';
import { InputSheetModal } from './InputSheetModal';

interface ForensicFlagMatrixProps {
  company: CompanyForensicProfile;
  investigationItems?: InvestigationItem[];
  onToggleInvestigation?: (flag: ForensicFlag, note?: string) => void;
  auditSensitivity?: string; // Kept as optional for compatibility but unused
}

export const ForensicFlagMatrix: React.FC<ForensicFlagMatrixProps> = ({ 
  company,
  investigationItems = [],
  onToggleInvestigation
}) => {
  const [selectedLens, setSelectedLens] = useState<IndustryLens | 'ALL'>(company.lens);
  const [severityFilter, setSeverityFilter] = useState<FlagSeverity | 'ALL'>('ALL');
  const [thresholdTypeFilter, setThresholdTypeFilter] = useState<'ALL' | 'WORD_INSTRUCTION' | 'NUMERIC'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFlag, setActiveFlag] = useState<ForensicFlag | null>(null);
  const [isInputSheetOpen, setIsInputSheetOpen] = useState(false);

  const lenses: (IndustryLens | 'ALL')[] = [
    'ALL',
    'Retail',
    'Payments',
    'SaaS',
    'Banks',
    'Tech Hardware',
    'Healthcare',
    'AI/Deep Tech'
  ];

  // Direct evaluated flags
  const evaluatedFlags = company.flags;

  // Filter flags
  const filteredFlags = evaluatedFlags.filter((flag) => {
    const matchesLens = selectedLens === 'ALL' || flag.lens === selectedLens;
    const matchesSeverity = severityFilter === 'ALL' || flag.status === severityFilter;
    const matchesThresholdType = 
      thresholdTypeFilter === 'ALL' 
        ? true 
        : thresholdTypeFilter === 'WORD_INSTRUCTION' 
        ? flag.thresholdType === 'word_instruction'
        : flag.thresholdType !== 'word_instruction';

    const matchesSearch = 
      flag.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (flag.sourceDocCode && flag.sourceDocCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      flag.secDisclosureCitation.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLens && matchesSeverity && matchesThresholdType && matchesSearch;
  });

  const criticalCount = evaluatedFlags.filter((f) => f.status === 'Critical Anomaly').length;
  const warningCount = evaluatedFlags.filter((f) => f.status === 'Warning').length;
  const healthyCount = evaluatedFlags.filter((f) => f.status === 'Healthy').length;
  const wordInstructionCount = evaluatedFlags.filter((f) => f.thresholdType === 'word_instruction').length;
  const numericCount = evaluatedFlags.length - wordInstructionCount;

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm space-y-4">
      {/* Matrix Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <Scale className="h-5 w-5 text-red-400" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">
                30 Red Flags Forensic Matrix
              </h3>
              <span className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] rounded font-medium">
                30 Red Flags / Sector Lens
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Sector-calibrated heuristic tests benchmarked against SEC EDGAR disclosures and PCAOB criteria
            </p>
          </div>
        </div>

        {/* Severity Quick Filters & Ground Truth Input Sheet */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setIsInputSheetOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/40 rounded-lg font-semibold transition-all shadow-sm"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-red-400" />
            <span>SEC Input Sheet & TTM Guide</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSeverityFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
                severityFilter === 'ALL'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({evaluatedFlags.length})
            </button>
            <button
              onClick={() => setSeverityFilter('Critical Anomaly')}
              className={`px-2.5 py-1 rounded-lg transition-all font-medium flex items-center gap-1.5 ${
                severityFilter === 'Critical Anomaly'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : 'text-slate-400 hover:text-red-400'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-red-400"></span>
              <span>Critical ({criticalCount})</span>
            </button>
            <button
              onClick={() => setSeverityFilter('Warning')}
              className={`px-2.5 py-1 rounded-lg transition-all font-medium flex items-center gap-1.5 ${
                severityFilter === 'Warning'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-amber-400"></span>
              <span>Warning ({warningCount})</span>
            </button>
            <button
              onClick={() => setSeverityFilter('Healthy')}
              className={`px-2.5 py-1 rounded-lg transition-all font-medium flex items-center gap-1.5 ${
                severityFilter === 'Healthy'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span>Clean ({healthyCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7 Industry Lens Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-800 text-xs overflow-x-auto">
        {lenses.map((lens) => (
          <button
            key={lens}
            onClick={() => setSelectedLens(lens)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-medium text-xs ${
              selectedLens === lens
                ? 'bg-red-500 text-white shadow-sm'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {lens} {lens !== 'ALL' && '(30)'}
          </button>
        ))}
      </div>

      {/* Threshold Type Sub-filter (Word Instruction vs Numeric) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px] font-medium">Evaluation Mode:</span>
          <button
            onClick={() => setThresholdTypeFilter('ALL')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              thresholdTypeFilter === 'ALL'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All 30 Flags
          </button>
          <button
            onClick={() => setThresholdTypeFilter('WORD_INSTRUCTION')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              thresholdTypeFilter === 'WORD_INSTRUCTION'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-purple-300'
            }`}
          >
            <Bot className="h-3 w-3 text-purple-400" />
            <span>Word Instructions ({wordInstructionCount})</span>
          </button>
          <button
            onClick={() => setThresholdTypeFilter('NUMERIC')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              thresholdTypeFilter === 'NUMERIC'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            Numeric Ratios ({numericCount})
          </button>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1">
          <Info className="h-3 w-3 text-amber-400 shrink-0" />
          <span>Word thresholds are qualitative audit directives where <strong className="text-emerald-400">no disclosure = clean Green Flag</strong>.</span>
        </div>
      </div>

      {/* Search and Table Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by code, title, formula, or SEC XBRL tag..."
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 px-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 rounded-lg outline-none"
          />
          <Search className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>
        <div className="text-xs">
          Showing <span className="text-white font-medium">{filteredFlags.length}</span> of {company.flags.length} red flags
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-medium text-[11px]">
              <th className="py-2.5 px-3">Code</th>
              <th className="py-2.5 px-3">Source Doc</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Observation</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">TTM / Value</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredFlags.slice(0, 50).map((flag) => {
              const isInvestigated = investigationItems.some(
                (item) => item.flagCode === flag.code && item.ticker === company.ticker
              );
              const isWord = flag.thresholdType === 'word_instruction';

              return (
                <tr
                  key={flag.code}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  onClick={() => setActiveFlag(flag)}
                >
                  <td className="py-2.5 px-3 font-mono font-semibold text-white">
                    {flag.code}
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    <span 
                      className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-bold"
                      title={flag.sourceDocName || 'SEC Source Document'}
                    >
                      {flag.sourceDocCode || 'IS'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    {isWord ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30 whitespace-nowrap">
                        <Bot className="h-2.5 w-2.5 text-purple-400" />
                        Word Instr.
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap">
                        Numeric
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {flag.category}
                  </td>
                  <td className="py-2.5 px-3 text-slate-200 font-medium max-w-xs truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate">{flag.title}</span>
                      {flag.valueMode && (
                        <span className={`text-[9px] px-1 py-0.2 rounded font-mono shrink-0 border ${
                          flag.valueMode === 'TTM Required' 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : flag.valueMode === 'Direct Source Document'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                        }`}>
                          {flag.valueMode === 'TTM Required' ? 'TTM' : flag.valueMode === 'Direct Source Document' ? 'Direct' : 'Dual'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        flag.status === 'Critical Anomaly'
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                          : flag.status === 'Warning'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          flag.status === 'Critical Anomaly'
                            ? 'bg-red-400'
                            : flag.status === 'Warning'
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                      ></span>
                      {flag.status === 'Critical Anomaly' ? 'Critical' : flag.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-200">
                    {flag.currentValue}
                  </td>
                  <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleInvestigation && onToggleInvestigation(flag)}
                      className={`p-1 rounded transition-colors ${
                        isInvestigated
                          ? 'text-red-400 hover:text-red-300'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title={isInvestigated ? 'In Investigation Queue' : 'Add to Investigation Queue'}
                    >
                      {isInvestigated ? <Bookmark className="h-4 w-4 fill-red-400" /> : <Plus className="h-4 w-4" />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Flag Detail Modal / Card */}
      {activeFlag && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveFlag(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                    {activeFlag.code}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {activeFlag.title}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Sector Lens: <strong className="text-slate-300 font-medium">{activeFlag.lens}</strong> · Category: {activeFlag.category}
                </div>
              </div>
              <button
                onClick={() => setActiveFlag(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Ground Truth Source Document & TTM Mode Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Source Document:</span>
                  <span className="px-2 py-0.5 rounded font-mono font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                    [{activeFlag.sourceDocCode || 'IS'}]
                  </span>
                  <span className="text-slate-200 font-medium">
                    {activeFlag.sourceDocName || 'Income Statement'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Value Mode:</span>
                  <span className={`px-2 py-0.5 rounded-full font-mono font-medium border ${
                    activeFlag.valueMode === 'TTM Required'
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : activeFlag.valueMode === 'Direct Source Document'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                  }`}>
                    {activeFlag.valueMode || 'TTM Required'}
                  </span>
                </div>
              </div>

              {/* AI Agent Directive Box for Word-Based Thresholds */}
              {activeFlag.thresholdType === 'word_instruction' ? (
                <div className="p-3.5 rounded-xl border border-purple-500/40 bg-purple-950/20 space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-purple-300 font-bold text-xs">
                      <Bot className="h-4 w-4 text-purple-400" />
                      <span>AI Agent Directive: Qualitative Word-Based Threshold</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      DISCLOSURE VERIFICATION
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    {activeFlag.aiAuditInstruction || 
                     'Told to AI Scanner: Treat word threshold as a qualitative filing inspection directive. If no adverse item or weakness is disclosed in the SEC filing, evaluate as a clean Green Flag. If adverse conditions are disclosed, trigger Red Flag.'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[10px] font-mono">
                    <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                      <span className="text-emerald-400 font-bold block mb-0.5">GREEN FLAG</span>
                      <span>{activeFlag.greenThreshold || 'None disclosed'}</span>
                    </div>
                    <div className="p-2 rounded bg-amber-950/40 border border-amber-500/30 text-amber-300">
                      <span className="text-amber-400 font-bold block mb-0.5">YELLOW WATCH</span>
                      <span>{activeFlag.yellowThreshold || 'Remediated / minor'}</span>
                    </div>
                    <div className="p-2 rounded bg-red-950/40 border border-red-500/30 text-red-300">
                      <span className="text-red-400 font-bold block mb-0.5">RED CRITICAL</span>
                      <span>{activeFlag.redThreshold || 'Active weakness disclosed'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Quantitative Threshold Standards:</span>
                    <span className="text-[10px] font-mono text-cyan-400">AUDITED COHORT BENCHMARK</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                    <div className="p-1.5 rounded bg-emerald-950/20 border border-emerald-500/20 text-emerald-300">
                      <span className="text-emerald-400 font-bold block">Safe Zone:</span>
                      {activeFlag.greenThreshold || '< P50 Median'}
                    </div>
                    <div className="p-1.5 rounded bg-amber-950/20 border border-amber-500/20 text-amber-300">
                      <span className="text-amber-400 font-bold block">Warning:</span>
                      {activeFlag.yellowThreshold || '+1.5σ Deviation'}
                    </div>
                    <div className="p-1.5 rounded bg-red-950/20 border border-red-500/20 text-red-300">
                      <span className="text-red-400 font-bold block">Anomaly:</span>
                      {activeFlag.redThreshold || '+3.0σ Deviation'}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] block font-medium">Detection Rule &amp; Formula:</span>
                <code className="font-mono text-xs text-slate-200 block break-words">
                  {activeFlag.formula}
                </code>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[11px] block font-medium">Risk Explanation:</span>
                <p className="text-slate-300 leading-relaxed">
                  {activeFlag.riskExplanation}
                </p>
              </div>

              {/* 3-Year Audited Forensic Stats Breakdown */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-xs font-semibold flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse"></span>
                    Year 1 · Year 2 · Year 3 Audited Discrepancy Stats
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    SEC EDGAR XBRL Audited Time-Series
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {/* Year 1 Stat */}
                  <div className="bg-slate-950/90 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                        <span className="font-semibold text-slate-200 text-xs">
                          {activeFlag.year1Stat?.year || 'Year 1 (FY23)'}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          activeFlag.year1Stat?.status === 'Critical Anomaly'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : activeFlag.year1Stat?.status === 'Warning'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {activeFlag.year1Stat?.status || 'Healthy'}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Recorded Metric:</span>
                          <span className="font-mono text-white font-bold">{activeFlag.year1Stat?.metricValue || '1.8%'}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Benchmark:</span>
                          <span className="text-slate-300 truncate max-w-[120px]">{activeFlag.year1Stat?.benchmark || 'Cohort P50'}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Sigma Variance:</span>
                          <span className="font-mono font-semibold text-slate-200">{activeFlag.year1Stat?.deviation || '+0.3σ'}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Score Impact:</span>
                          <span className="text-red-400 font-mono">-{activeFlag.year1Stat?.impactScore ?? 0} pts</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-800/70 text-[10px] text-slate-400 leading-tight">
                      {activeFlag.year1Stat?.narrative || 'Base period verified clean in audited disclosures.'}
                    </div>
                  </div>

                  {/* Year 2 Stat */}
                  <div className="bg-slate-950/90 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                        <span className="font-semibold text-slate-200 text-xs">
                          {activeFlag.year2Stat?.year || 'Year 2 (FY24)'}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          activeFlag.year2Stat?.status === 'Critical Anomaly'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : activeFlag.year2Stat?.status === 'Warning'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {activeFlag.year2Stat?.status || 'Warning'}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Recorded Metric:</span>
                          <span className="font-mono text-white font-bold">{activeFlag.year2Stat?.metricValue || '7.9%'}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Benchmark:</span>
                          <span className="text-slate-300 truncate max-w-[120px]">{activeFlag.year2Stat?.benchmark || 'Cohort P50'}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Sigma Variance:</span>
                          <span className="font-mono font-semibold text-amber-300">{activeFlag.year2Stat?.deviation || '+1.9σ'}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Score Impact:</span>
                          <span className="text-red-400 font-mono">-{activeFlag.year2Stat?.impactScore ?? 2} pts</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-800/70 text-[10px] text-slate-400 leading-tight">
                      {activeFlag.year2Stat?.narrative || 'Interim trajectory showed elevated variance.'}
                    </div>
                  </div>

                  {/* Year 3 Stat */}
                  <div className="bg-slate-950/90 p-3 rounded-lg border border-red-950/60 flex flex-col justify-between ring-1 ring-red-500/30">
                    <div>
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                        <span className="font-semibold text-red-400 text-xs flex items-center gap-1">
                          <span>{activeFlag.year3Stat?.year || 'Year 3 (FY25/TTM)'}</span>
                          <span className="text-[9px] bg-red-500/20 px-1 py-0.2 rounded font-mono">LIVE</span>
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          activeFlag.status === 'Critical Anomaly'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : activeFlag.status === 'Warning'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {activeFlag.status}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Recorded Metric:</span>
                          <span className="font-mono text-white font-bold">{activeFlag.year3Stat?.metricValue || activeFlag.currentValue}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Benchmark:</span>
                          <span className="text-slate-300 truncate max-w-[120px]">{activeFlag.year3Stat?.benchmark || 'Cohort P50'}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Sigma Variance:</span>
                          <span className={`font-mono font-bold ${activeFlag.status === 'Critical Anomaly' ? 'text-red-400' : activeFlag.status === 'Warning' ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {activeFlag.year3Stat?.deviation || '+3.4σ'}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Score Impact:</span>
                          <span className="text-red-400 font-mono">-{activeFlag.year3Stat?.impactScore ?? activeFlag.scoreImpact} pts</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-800/70 text-[10px] text-slate-300 leading-tight">
                      {activeFlag.year3Stat?.narrative || 'Active filing breach detected in current SEC disclosures.'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">SEC Disclosure Citation</span>
                  <span className="font-mono text-xs text-slate-200 block mt-0.5">
                    {activeFlag.secDisclosureCitation}
                  </span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Current TTM Observation</span>
                  <span className="font-mono text-xs text-white font-semibold block mt-0.5">
                    {activeFlag.currentValue}
                  </span>
                </div>
              </div>

              {/* 5-Year Historical Trend */}
              <div className="pt-2">
                <span className="text-slate-400 text-[11px] block mb-1.5 font-medium">Historical Multi-Year Trend:</span>
                <div className="grid grid-cols-6 gap-1 text-center font-mono text-[11px]">
                  {Object.entries(activeFlag.historicalTrend).map(([yr, val]) => (
                    <div key={yr} className="bg-slate-950/80 p-2 rounded border border-slate-800/80">
                      <div className="text-slate-500 uppercase text-[10px]">{yr}</div>
                      <div className="text-slate-200 font-medium mt-0.5">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Data Priority: <strong className="text-slate-300 font-medium">{activeFlag.dataSource}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onToggleInvestigation && onToggleInvestigation(activeFlag);
                    setActiveFlag(null);
                  }}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>Toggle Queue</span>
                </button>
                <button
                  onClick={() => setActiveFlag(null)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEC Ground Truth Input Sheet & TTM Mapping Modal */}
      <InputSheetModal
        isOpen={isInputSheetOpen}
        onClose={() => setIsInputSheetOpen(false)}
      />
    </div>
  );
};
