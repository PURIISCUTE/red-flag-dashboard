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
  Scale
} from 'lucide-react';
import { 
  ForensicFlag, 
  IndustryLens, 
  FlagSeverity, 
  CompanyForensicProfile, 
  InvestigationItem 
} from '../types';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFlag, setActiveFlag] = useState<ForensicFlag | null>(null);

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
    const matchesSearch = 
      flag.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.secDisclosureCitation.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLens && matchesSeverity && matchesSearch;
  });

  const criticalCount = evaluatedFlags.filter((f) => f.status === 'Critical Anomaly').length;
  const warningCount = evaluatedFlags.filter((f) => f.status === 'Warning').length;
  const healthyCount = evaluatedFlags.filter((f) => f.status === 'Healthy').length;

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm space-y-4">
      {/* Matrix Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <Scale className="h-5 w-5 text-red-400" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">
                210-Flag Forensic Discrepancy Matrix
              </h3>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded font-medium">
                30 Flags / Sector Lens
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Heuristic tests benchmarked against SEC EDGAR disclosures and PCAOB criteria
            </p>
          </div>
        </div>

        {/* Severity Quick Filters */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setSeverityFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
              severityFilter === 'ALL'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All (210)
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
          Showing <span className="text-white font-medium">{filteredFlags.length}</span> of 210 flags
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-medium text-[11px]">
              <th className="py-2.5 px-3">Code</th>
              <th className="py-2.5 px-3">Lens</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Observation</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">TTM Reading</th>
              <th className="py-2.5 px-3">Data Priority</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredFlags.slice(0, 50).map((flag) => {
              const isInvestigated = investigationItems.some(
                (item) => item.flagCode === flag.code && item.ticker === company.ticker
              );

              return (
                <tr
                  key={flag.code}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  onClick={() => setActiveFlag(flag)}
                >
                  <td className="py-2.5 px-3 font-mono font-semibold text-white">
                    {flag.code}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {flag.lens}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {flag.category}
                  </td>
                  <td className="py-2.5 px-3 text-slate-200 font-medium max-w-xs truncate">
                    {flag.title}
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
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                    {flag.dataSource}
                  </td>
                  <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleInvestigation && onToggleInvestigation(flag)}
                      className={`p-1 rounded transition-colors ${
                        isInvestigated
                          ? 'text-red-400 hover:text-red-300'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title={isInvestigated ? 'Remove from investigation queue' : 'Add to investigation queue'}
                    >
                      <Bookmark className={`h-4 w-4 ${isInvestigated ? 'fill-current' : ''}`} />
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
    </div>
  );
};
