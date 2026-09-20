import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Filter, 
  ChevronRight, 
  Info, 
  ExternalLink,
  BookOpen,
  Scale,
  Sparkles
} from 'lucide-react';
import { ForensicFlag, IndustryLens, FlagSeverity, CompanyForensicProfile } from '../types';

interface ForensicFlagMatrixProps {
  company: CompanyForensicProfile;
}

export const ForensicFlagMatrix: React.FC<ForensicFlagMatrixProps> = ({ company }) => {
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

  // Filter flags
  const filteredFlags = company.flags.filter((flag) => {
    const matchesLens = selectedLens === 'ALL' || flag.lens === selectedLens;
    const matchesSeverity = severityFilter === 'ALL' || flag.status === severityFilter;
    const matchesSearch = 
      flag.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.secDisclosureCitation.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLens && matchesSeverity && matchesSearch;
  });

  const criticalCount = company.flags.filter((f) => f.status === 'Critical Anomaly').length;
  const warningCount = company.flags.filter((f) => f.status === 'Warning').length;
  const healthyCount = company.flags.filter((f) => f.status === 'Healthy').length;

  return (
    <div className="bg-[#0F131C] border border-[#22293d] p-4 shadow-lg">
      {/* Matrix Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1c2233]">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-[#FF4D4D]" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                210-Flag Forensic Discrepancy & Heuristic Matrix
              </h3>
              <span className="px-1.5 py-0.2 bg-[#FF4D4D]/15 text-[#FF4D4D] border border-[#FF4D4D]/40 text-[10px] font-mono">
                30 FLAGS / LENS (7 LENSES)
              </span>
            </div>
            <p className="text-[11px] font-mono text-[#718096]">
              Autonomous heuristic rules evaluated against SEC EDGAR ground truth and Kaggle fraud baselines
            </p>
          </div>
        </div>

        {/* Severity Quick Filters */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <button
            onClick={() => setSeverityFilter('ALL')}
            className={`px-2.5 py-1 text-[11px] border ${
              severityFilter === 'ALL' ? 'bg-[#1e2538] text-white border-[#3b4766]' : 'border-[#1f2638] text-[#718096]'
            }`}
          >
            ALL (210)
          </button>
          <button
            onClick={() => setSeverityFilter('Critical Anomaly')}
            className={`px-2.5 py-1 text-[11px] border flex items-center gap-1 ${
              severityFilter === 'Critical Anomaly' ? 'bg-[#FF4D4D]/20 text-[#FF4D4D] border-[#FF4D4D]' : 'border-[#1f2638] text-[#718096]'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-[#FF4D4D]"></span>
            CRITICAL ({criticalCount})
          </button>
          <button
            onClick={() => setSeverityFilter('Warning')}
            className={`px-2.5 py-1 text-[11px] border flex items-center gap-1 ${
              severityFilter === 'Warning' ? 'bg-[#ECC94B]/20 text-[#ECC94B] border-[#ECC94B]' : 'border-[#1f2638] text-[#718096]'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-[#ECC94B]"></span>
            WARNING ({warningCount})
          </button>
          <button
            onClick={() => setSeverityFilter('Healthy')}
            className={`px-2.5 py-1 text-[11px] border flex items-center gap-1 ${
              severityFilter === 'Healthy' ? 'bg-[#38A169]/20 text-[#38A169] border-[#38A169]' : 'border-[#1f2638] text-[#718096]'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-[#38A169]"></span>
            HEALTHY ({healthyCount})
          </button>
        </div>
      </div>

      {/* 7 Industry Lens Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1 mt-3 pb-2 border-b border-[#181f2f] font-mono text-xs overflow-x-auto">
        {lenses.map((lens) => (
          <button
            key={lens}
            onClick={() => setSelectedLens(lens)}
            className={`px-3 py-1.5 text-[11px] whitespace-nowrap transition-colors ${
              selectedLens === lens
                ? 'bg-[#FF4D4D] text-white font-bold shadow-sm'
                : 'bg-[#090c12] text-[#8a94a6] hover:text-white border border-[#1b2233]'
            }`}
          >
            {lens.toUpperCase()} {lens !== 'ALL' && '(30)'}
          </button>
        ))}
      </div>

      {/* Search and Table Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-2 text-xs font-mono text-[#718096]">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by flag code, title, formula, or SEC XBRL tag..."
            className="w-full bg-[#080b10] border border-[#222a3d] focus:border-[#FF4D4D] px-8 py-1.5 text-xs text-white placeholder-[#525f7a] outline-none"
          />
          <Search className="h-3.5 w-3.5 text-[#525f7a] absolute left-2.5 top-2.5" />
        </div>
        <div className="text-[11px]">
          SHOWING <span className="text-white font-bold">{filteredFlags.length}</span> OF 210 EVALUATED FLAGS
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto border border-[#1c2233]">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#22293d] bg-[#090c12] text-[#8a94a6] text-[10px]">
              <th className="py-2 px-3">CODE</th>
              <th className="py-2 px-3">LENS</th>
              <th className="py-2 px-3">CATEGORY</th>
              <th className="py-2 px-3">FORENSIC OBSERVATION TITLE</th>
              <th className="py-2 px-3">SIGNAL STATUS</th>
              <th className="py-2 px-3 text-right">TTM READING</th>
              <th className="py-2 px-3">DATA SOURCE</th>
              <th className="py-2 px-3 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#151c2b]">
            {filteredFlags.slice(0, 45).map((flag) => {
              const isCritical = flag.status === 'Critical Anomaly';
              const isWarning = flag.status === 'Warning';
              const isSelected = activeFlag?.id === flag.id;

              return (
                <tr
                  key={flag.id}
                  onClick={() => setActiveFlag(isSelected ? null : flag)}
                  className={`hover:bg-[#151d2e] transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#182338]' : isCritical ? 'bg-[#160c0f]' : 'bg-[#0b0e14]'
                  }`}
                >
                  <td className="py-2 px-3 font-bold text-[#FF4D4D] whitespace-nowrap">
                    {flag.code}
                  </td>
                  <td className="py-2 px-3 text-[#718096] whitespace-nowrap">
                    {flag.lens}
                  </td>
                  <td className="py-2 px-3 text-[#a0aec0] whitespace-nowrap">
                    {flag.category}
                  </td>
                  <td className="py-2 px-3 text-[#e1e2ea] max-w-md truncate">
                    {flag.title}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold border ${
                      isCritical
                        ? 'bg-[#FF4D4D]/20 text-[#FF4D4D] border-[#FF4D4D]/50'
                        : isWarning
                        ? 'bg-[#ECC94B]/20 text-[#ECC94B] border-[#ECC94B]/50'
                        : 'bg-[#38A169]/20 text-[#38A169] border-[#38A169]/50'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        isCritical ? 'bg-[#FF4D4D]' : isWarning ? 'bg-[#ECC94B]' : 'bg-[#38A169]'
                      }`}></span>
                      {flag.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-[#cbd5e1] whitespace-nowrap">
                    {flag.currentValue}
                  </td>
                  <td className="py-2 px-3 text-[#a5b4fc] text-[10px] whitespace-nowrap">
                    {flag.dataSource}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button className="text-[#718096] hover:text-white">
                      <ChevronRight className={`h-4 w-4 transition-transform ${isSelected ? 'rotate-90 text-[#FF4D4D]' : ''}`} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* DYNAMIC AUDIT INFO BOX UNDER THE MATRIX */}
      {activeFlag ? (
        <div className="mt-4 p-4 bg-[#080b10] border border-[#FF4D4D] shadow-2xl relative">
          <div className="flex items-center justify-between pb-2 border-b border-[#222a3d] mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#FF4D4D] text-white font-mono text-xs font-bold">
                {activeFlag.code}
              </span>
              <h4 className="font-mono text-sm font-bold text-white">
                {activeFlag.title}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#a5b4fc]">
                {activeFlag.dataSource}
              </span>
              <button
                onClick={() => setActiveFlag(null)}
                className="text-[#718096] hover:text-white text-xs font-mono px-2 py-0.5 bg-[#1b2233]"
              >
                CLOSE
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono mb-3">
            <div className="bg-[#0f131c] p-3 border border-[#1f2638]">
              <span className="text-[#718096] text-[10px] block mb-1">MATHEMATICAL FORMULA</span>
              <div className="text-[#e1e2ea] font-bold text-xs">{activeFlag.formula}</div>
            </div>

            <div className="bg-[#0f131c] p-3 border border-[#1f2638]">
              <span className="text-[#718096] text-[10px] block mb-1">SEC EDGAR DISCLOSURE CITATION</span>
              <div className="text-[#a5b4fc] text-[11px] truncate" title={activeFlag.secDisclosureCitation}>
                {activeFlag.secDisclosureCitation}
              </div>
            </div>

            <div className="bg-[#0f131c] p-3 border border-[#1f2638]">
              <span className="text-[#718096] text-[10px] block mb-1">KAGGLE BENCHMARK THRESHOLD</span>
              <div className="text-[#ECC94B] text-[11px]">{activeFlag.benchmarkRule}</div>
            </div>

            <div className="bg-[#0f131c] p-3 border border-[#1f2638]">
              <span className="text-[#718096] text-[10px] block mb-1">SIGNAL STATUS & DEDUCTION</span>
              <div className={activeFlag.status === 'Critical Anomaly' ? 'text-[#FF4D4D] font-bold' : activeFlag.status === 'Warning' ? 'text-[#ECC94B] font-bold' : 'text-[#38A169] font-bold'}>
                {activeFlag.status} (-{activeFlag.scoreImpact} pts)
              </div>
            </div>
          </div>

          {/* Historical Trend Trajectory Bar */}
          <div className="bg-[#0f131c] p-3 border border-[#1f2638] mb-3 text-xs font-mono">
            <span className="text-[#718096] text-[10px] block mb-2">5-YEAR & TTM SIGNAL TRAJECTORY</span>
            <div className="grid grid-cols-6 gap-2 text-center text-[11px]">
              <div className="bg-[#080b10] p-1.5 border border-[#181f2f]">
                <div className="text-[#718096] text-[9px]">FY22</div>
                <div className="font-bold text-[#e1e2ea]">{activeFlag.historicalTrend.fy22}</div>
              </div>
              <div className="bg-[#080b10] p-1.5 border border-[#181f2f]">
                <div className="text-[#718096] text-[9px]">FY23</div>
                <div className="font-bold text-[#e1e2ea]">{activeFlag.historicalTrend.fy23}</div>
              </div>
              <div className="bg-[#080b10] p-1.5 border border-[#181f2f]">
                <div className="text-[#718096] text-[9px]">FY24</div>
                <div className="font-bold text-[#e1e2ea]">{activeFlag.historicalTrend.fy24}</div>
              </div>
              <div className="bg-[#080b10] p-1.5 border border-[#181f2f]">
                <div className="text-[#718096] text-[9px]">FY25</div>
                <div className="font-bold text-[#e1e2ea]">{activeFlag.historicalTrend.fy25}</div>
              </div>
              <div className="bg-[#080b10] p-1.5 border border-[#181f2f]">
                <div className="text-[#718096] text-[9px]">FY26</div>
                <div className="font-bold text-[#e1e2ea]">{activeFlag.historicalTrend.fy26}</div>
              </div>
              <div className="bg-[#080b10] p-1.5 border border-[#FF4D4D]/40">
                <div className="text-[#FF4D4D] text-[9px] font-bold">TTM ACTIVE</div>
                <div className="font-bold text-[#FF4D4D]">{activeFlag.historicalTrend.ttm}</div>
              </div>
            </div>
          </div>

          <div className="text-xs font-sans text-[#cbd5e1] leading-relaxed">
            <span className="font-bold text-[#FF4D4D] font-mono mr-2">FORENSIC RISK EXPLANATION:</span>
            {activeFlag.riskExplanation}
          </div>
        </div>
      ) : (
        <div className="mt-3 p-3 bg-[#080b10] border border-[#1b2233] text-[11px] font-mono text-[#718096] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-[#a5b4fc]" />
            <span>Click any flag above to inspect audited formula, SEC XBRL citation, Kaggle benchmark, and historical trend.</span>
          </div>
          <span className="text-[#a5b4fc]">210 FLAGS CACHED DETERMINISTICALLY</span>
        </div>
      )}
    </div>
  );
};
