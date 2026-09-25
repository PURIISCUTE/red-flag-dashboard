import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Layers, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Database,
  Cpu,
  Bot,
  Filter,
  X
} from 'lucide-react';
import { SOURCE_DOCUMENTS, MASTER_INPUTS_SHEET, MasterInputItem } from '../data/sourceDocuments';
import { ValueMode } from '../types';

interface InputSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'documents' | 'inputs' | 'ai_directive';
}

export const InputSheetModal: React.FC<InputSheetModalProps> = ({ 
  isOpen, 
  onClose,
  initialTab = 'documents'
}) => {
  const [activeTab, setActiveTab] = useState<'documents' | 'inputs' | 'ai_directive'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'ALL' | ValueMode>('ALL');
  const [filterType, setFilterType] = useState<'ALL' | 'WORD_INSTRUCTION' | 'NUMERIC'>('ALL');


  const filteredDocuments = useMemo(() => {
    return SOURCE_DOCUMENTS.filter(doc => {
      const matchSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.contains.toLowerCase().includes(searchQuery.toLowerCase());
      const matchMode = filterMode === 'ALL' || doc.valueMode === filterMode;
      return matchSearch && matchMode;
    });
  }, [searchQuery, filterMode]);

  const filteredInputs = useMemo(() => {
    return MASTER_INPUTS_SHEET.filter(inp => {
      const matchSearch = inp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inp.docCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inp.docName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inp.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchMode = filterMode === 'ALL' || inp.valueMode === filterMode;
      const matchType = filterType === 'ALL' 
        ? true 
        : filterType === 'WORD_INSTRUCTION' ? inp.isWordInstruction : !inp.isWordInstruction;
      return matchSearch && matchMode && matchType;
    });
  }, [searchQuery, filterMode, filterType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl border border-red-500/30 bg-slate-950 text-slate-200 shadow-2xl shadow-red-950/40 overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">SEC Ground Truth Input Sheet &amp; Verification Guide</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                  27 SOURCE DOCS · FLOW VS DIRECT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Institutional verification guide: 27 primary SEC source documents, TTM vs. Direct extraction requirements, and AI agent qualitative directives.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-3 border-b border-slate-800/60 bg-slate-950/70">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                activeTab === 'documents'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Database className="h-3.5 w-3.5" />
              Source Documents (27)
            </button>
            <button
              onClick={() => setActiveTab('inputs')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                activeTab === 'inputs'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Input Mapping &amp; TTM Values
            </button>
            <button
              onClick={() => setActiveTab('ai_directive')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                activeTab === 'ai_directive'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Bot className="h-3.5 w-3.5 text-purple-400" />
              AI Agent Word Directives
            </button>
          </div>

          {/* Search & Mode Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'documents' ? 'Search codes (IS, BS, 9A)...' : 'Search inputs (Revenue, AR, Leases)...'}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-900/90 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-red-500/60 w-44 sm:w-56"
              />
            </div>

            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs bg-slate-900/90 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-red-500/60"
            >
              <option value="ALL">All Modes</option>
              <option value="TTM Required">TTM Required</option>
              <option value="Direct Source Document">Direct Source Doc</option>
              <option value="Dual (TTM + Direct)">Dual (TTM + Direct)</option>
            </select>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: 27 SOURCE DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-950/10 flex items-start gap-3 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  <span className="font-semibold text-white">Document Coverage:</span> Every input required across all 205 red flags is sourced exclusively from these 27 primary SEC filings and external financial registries. Flow items mandate <span className="text-amber-300 font-medium">TTM accumulation</span>, while balance sheet and governance notes use <span className="text-emerald-300 font-medium">Direct point-in-time extraction</span>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredDocuments.map((doc) => (
                  <div 
                    key={doc.code}
                    className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:border-red-500/40 hover:bg-slate-900/70 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                          {doc.code}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          doc.valueMode === 'TTM Required'
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            : doc.valueMode === 'Direct Source Document'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                        }`}>
                          {doc.valueMode}
                        </span>
                      </div>

                      <h3 className="font-semibold text-white text-sm">{doc.name}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        <span className="text-slate-300 font-medium">Typically Contains:</span> {doc.contains}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/60 space-y-1.5 text-[11px]">
                      <div className="text-slate-400">
                        <span className="text-slate-500">Location:</span> {doc.typicalLocation}
                      </div>
                      <div className="text-slate-400 font-mono text-[10px] bg-slate-950/60 p-1.5 rounded border border-slate-800/40">
                        <span className="text-amber-400 font-semibold">TTM / Extraction Note:</span> {doc.ttmNotes}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: INPUT MAPPING & TTM LIST */}
          {activeTab === 'inputs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-amber-500/20 bg-amber-950/10 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>
                    <span className="font-semibold text-white">Input Specification:</span> This table details whether each variable must be aggregated as a <strong className="text-amber-300">TTM Value</strong> (rolling 4 quarters) or pulled <strong className="text-emerald-300">Directly from the Source Document</strong>.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Type:</span>
                  <button
                    onClick={() => setFilterType('ALL')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${filterType === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterType('NUMERIC')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${filterType === 'NUMERIC' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'}`}
                  >
                    Numeric
                  </button>
                  <button
                    onClick={() => setFilterType('WORD_INSTRUCTION')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${filterType === 'WORD_INSTRUCTION' ? 'bg-purple-500/20 text-purple-300' : 'text-slate-400 hover:text-white'}`}
                  >
                    Word Instructions
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/30">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Input Name</th>
                      <th className="p-3">Source Document</th>
                      <th className="p-3">Value Mode</th>
                      <th className="p-3">Threshold Category</th>
                      <th className="p-3">Extraction / TTM Requirement</th>
                      <th className="p-3">Applicable Sectors</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filteredInputs.map((inp) => (
                      <tr key={inp.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3 font-semibold text-white">
                          <div className="flex items-center gap-1.5">
                            {inp.isWordInstruction && (
                              <span title="Word-based qualitative instruction">
                                <Bot className="h-3 w-3 text-purple-400 shrink-0" />
                              </span>
                            )}
                            {inp.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-normal mt-0.5 font-sans">
                            {inp.description}
                          </div>
                        </td>
                        <td className="p-3 font-mono">
                          <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30 font-bold">
                            {inp.docCode}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-1 font-sans">
                            {inp.docName}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border font-medium whitespace-nowrap ${
                            inp.valueMode === 'TTM Required'
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : inp.valueMode === 'Direct Source Document'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                          }`}>
                            {inp.valueMode}
                          </span>
                        </td>
                        <td className="p-3">
                          {inp.isWordInstruction ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30">
                              Word Instruction
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                              Numeric Metric
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-300 max-w-xs">
                          {inp.formulaOrExtraction}
                          {inp.aiAgentDirective && (
                            <div className="mt-1.5 p-1.5 rounded bg-purple-950/30 border border-purple-500/30 text-[10px] text-purple-200">
                              <span className="font-bold text-purple-300">AI Directive:</span> {inp.aiAgentDirective}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-[11px] text-slate-400 font-sans">
                          {inp.sectors.join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: AI AGENT QUALITATIVE INSTRUCTION DIRECTIVE */}
          {activeTab === 'ai_directive' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/20 space-y-3">
                <div className="flex items-center gap-2 text-purple-300 font-semibold text-sm">
                  <Bot className="h-5 w-5 text-purple-400" />
                  Mandatory AI Agent Instruction Protocol: Qualitative Word-Based Thresholds
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Red flags feature two distinct categories of evaluation criteria: <strong className="text-cyan-300">Numeric Thresholds</strong> (evaluated via mathematical formulas) and <strong className="text-purple-300">Word-Based Instructions</strong> (evaluated via qualitative disclosure inspection). The AI scanning agent MUST NOT treat word-based thresholds as literal strings or numerical comparisons; rather, they are <span className="underline text-white font-medium">explicit investigative instructions</span> for reading SEC footnote disclosures.
                </p>
              </div>

              {/* Concrete examples grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Example 1: Item 9A Controls */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded font-mono text-xs bg-red-500/20 text-red-400 font-bold">
                      Flag: Material Weakness Disclosure
                    </span>
                    <span className="text-xs font-mono text-slate-400">Doc Code: [9A]</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">Item 9A Controls & Procedures</h4>
                  
                  <div className="space-y-1.5 text-xs">
                    <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-emerald-300">
                      <span>Threshold: <strong>&quot;None disclosed&quot;</strong></span>
                      <span className="font-mono text-[10px] font-bold">STATUS: GREEN FLAG</span>
                    </div>
                    <div className="p-2 rounded bg-amber-950/30 border border-amber-500/30 flex items-center justify-between text-amber-300">
                      <span>Threshold: <strong>&quot;Remediated prior weakness&quot;</strong></span>
                      <span className="font-mono text-[10px] font-bold">STATUS: YELLOW WATCH</span>
                    </div>
                    <div className="p-2 rounded bg-red-950/30 border border-red-500/30 flex items-center justify-between text-red-300">
                      <span>Threshold: <strong>&quot;Active weakness disclosed&quot;</strong></span>
                      <span className="font-mono text-[10px] font-bold">STATUS: RED CRITICAL</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1 font-mono">
                    <div className="text-purple-300 font-bold flex items-center gap-1">
                      <Cpu className="h-3 w-3" /> Exact AI Agent Instruction:
                    </div>
                    <p className="text-slate-400 leading-relaxed font-sans">
                      &quot;Navigate to 10-K Item 9A. Read the conclusion regarding internal control over financial reporting (ICFR). If management reports controls are effective and NO material weaknesses were found, mark as clean GREEN. If there was a past failure that has since been fixed, mark YELLOW. If any active material weakness is admitted, trigger RED.&quot;
                    </p>
                  </div>
                </div>

                {/* Example 2: Restatement Flag */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded font-mono text-xs bg-red-500/20 text-red-400 font-bold">
                      Flag: Prior Restatement Flag
                    </span>
                    <span className="text-xs font-mono text-slate-400">Doc Code: [8-K] & [N-Rev]</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">ASC 250 Accounting Revisions</h4>
                  
                  <div className="space-y-1.5 text-xs">
                    <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-emerald-300">
                      <span>Threshold: <strong>&quot;None&quot;</strong></span>
                      <span className="font-mono text-[10px] font-bold">STATUS: GREEN FLAG</span>
                    </div>
                    <div className="p-2 rounded bg-amber-950/30 border border-amber-500/30 flex items-center justify-between text-amber-300">
                      <span>Threshold: <strong>&quot;Minor/immaterial revision&quot;</strong></span>
                      <span className="font-mono text-[10px] font-bold">STATUS: YELLOW WATCH</span>
                    </div>
                    <div className="p-2 rounded bg-red-950/30 border border-red-500/30 flex items-center justify-between text-red-300">
                      <span>Threshold: <strong>&quot;Material restatement&quot;</strong></span>
                      <span className="font-mono text-[10px] font-bold">STATUS: RED CRITICAL</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1 font-mono">
                    <div className="text-purple-300 font-bold flex items-center gap-1">
                      <Cpu className="h-3 w-3" /> Exact AI Agent Instruction:
                    </div>
                    <p className="text-slate-400 leading-relaxed font-sans">
                      &quot;Inspect Form 8-K Item 4.02 filings and 10-K Note 2. If no accounting error correction is reported, mark GREEN. If there are immaterial reclassifications that did not alter past net income, mark YELLOW. If past audited periods had to be restated due to GAAP non-compliance, trigger RED.&quot;
                    </p>
                  </div>
                </div>

                {/* Example 3: Auditor Going-Concern Doubt */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded font-mono text-xs bg-red-500/20 text-red-400 font-bold">
                      Flag: Auditor Going-Concern Language
                    </span>
                    <span className="text-xs font-mono text-slate-400">Doc Code: [Audit]</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">PCAOB AS 2415 Audit Report</h4>
                  
                  <div className="space-y-1.5 text-xs">
                    <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-emerald-300">
                      <span>Threshold: <strong>&quot;None&quot; (Clean unqualified)</strong></span>
                      <span className="font-mono text-[10px] font-bold">STATUS: GREEN FLAG</span>
                    </div>
                    <div className="p-2 rounded bg-amber-950/30 border border-amber-500/30 flex items-center justify-between text-amber-300">
                      <span>Threshold: <strong>&quot;Qualified language&quot;</strong></span>
                      <span className="font-mono text-[10px] font-bold">STATUS: YELLOW WATCH</span>
                    </div>
                    <div className="p-2 rounded bg-red-950/30 border border-red-500/30 flex items-center justify-between text-red-300">
                      <span>Threshold: <strong>&quot;Going concern doubt stated&quot;</strong></span>
                      <span className="font-mono text-[10px] font-bold">STATUS: RED CRITICAL</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1 font-mono">
                    <div className="text-purple-300 font-bold flex items-center gap-1">
                      <Cpu className="h-3 w-3" /> Exact AI Agent Instruction:
                    </div>
                    <p className="text-slate-400 leading-relaxed font-sans">
                      &quot;Review the independent auditor’s report. If standard clean unqualified report, mark GREEN. If explanatory paragraph highlights covenant breaches or liquidity concerns without going-concern phrase, mark YELLOW. If explicit substantial doubt is stated regarding the entity continuing as a going concern, trigger RED.&quot;
                    </p>
                  </div>
                </div>

                {/* Example 4: Gross-to-Net Revenue Policy Change */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded font-mono text-xs bg-red-500/20 text-red-400 font-bold">
                      Flag: Gross vs Net Revenue Policy
                    </span>
                    <span className="text-xs font-mono text-slate-400">Doc Code: [N-Rev]</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">ASC 606 Principal vs. Agent Disclosures</h4>
                  
                  <div className="space-y-1.5 text-xs">
                    <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-emerald-300">
                      <span>Threshold: <strong>&quot;No change disclosed&quot;</strong></span>
                      <span className="font-mono text-[10px] font-bold">STATUS: GREEN FLAG</span>
                    </div>
                    <div className="p-2 rounded bg-amber-950/30 border border-amber-500/30 flex items-center justify-between text-amber-300">
                      <span>Threshold: <strong>&quot;Change disclosed, immaterial&quot;</strong></span>
                      <span className="font-mono text-[10px] font-bold">STATUS: YELLOW WATCH</span>
                    </div>
                    <div className="p-2 rounded bg-red-950/30 border border-red-500/30 flex items-center justify-between text-red-300">
                      <span>Threshold: <strong>&quot;Coincides with growth narrative&quot;</strong></span>
                      <span className="font-mono text-[10px] font-bold">STATUS: RED CRITICAL</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1 font-mono">
                    <div className="text-purple-300 font-bold flex items-center gap-1">
                      <Cpu className="h-3 w-3" /> Exact AI Agent Instruction:
                    </div>
                    <p className="text-slate-400 leading-relaxed font-sans">
                      &quot;Inspect Note N-Rev across the current and prior 10-Ks. If revenue recognition policy on partner fees / credits did not change, mark GREEN. If minor change with immaterial effect, mark YELLOW. If an accounting switch reclassified net fees to gross revenue while management boasted of top-line acceleration in MD&A, trigger RED.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Summary Stats */}
        <div className="px-6 py-3 border-t border-slate-800/80 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span>TTM Flow Summations: <strong>9 Core Variables</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Direct Point-in-Time Extracts: <strong>14 Balance/Note Variables</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-400" />
              <span>Qualitative Word Instructions: <strong>8 Strategic Checks</strong></span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg text-xs transition-colors"
          >
            Close Ground Truth Guide
          </button>
        </div>
      </div>
    </div>
  );
};
