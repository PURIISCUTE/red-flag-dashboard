import React from 'react';
import { 
  BarChart3, 
  Layers, 
  ShieldAlert, 
  Table, 
  Activity, 
  FileCheck2, 
  Bookmark, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Search
} from 'lucide-react';
import { IndustryLens, CompanyForensicProfile } from '../types';

export type TerminalPage = 
  | 'terminal' 
  | 'lenses' 
  | 'matrix' 
  | 'financials' 
  | 'simulator' 
  | 'filings' 
  | 'queue';

interface TerminalNavbarProps {
  currentPage: TerminalPage;
  onNavigate: (page: TerminalPage) => void;
  currentCompany: CompanyForensicProfile;
  investigationCount: number;
}

export const TerminalNavbar: React.FC<TerminalNavbarProps> = ({
  currentPage,
  onNavigate,
  currentCompany,
  investigationCount
}) => {
  const navItems: { id: TerminalPage; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: 'terminal',
      label: 'Executive Overview',
      icon: <BarChart3 className="h-4 w-4" />
    },
    {
      id: 'lenses',
      label: '7 Industry Lens Sub-Pages',
      icon: <Layers className="h-4 w-4 text-purple-400" />,
      badge: currentCompany.lens
    },
    {
      id: 'matrix',
      label: '30 Red Flags Matrix',
      icon: <ShieldAlert className="h-4 w-4 text-amber-400" />,
      badge: '30 Rules'
    },
    {
      id: 'financials',
      label: 'Financial Statements',
      icon: <Table className="h-4 w-4 text-emerald-400" />
    },
    {
      id: 'simulator',
      label: 'Stress Simulator',
      icon: <Activity className="h-4 w-4 text-indigo-400" />
    },
    {
      id: 'filings',
      label: 'SEC EDGAR Filings',
      icon: <FileCheck2 className="h-4 w-4 text-sky-400" />
    },
    {
      id: 'queue',
      label: 'Investigation Queue',
      icon: <Bookmark className="h-4 w-4 text-rose-400" />,
      badge: investigationCount > 0 ? investigationCount : undefined
    }
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 sticky top-[57px] z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-2">
          <div className="flex items-center gap-1 shrink-0">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-red-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                      isActive 
                        ? 'bg-red-700 text-white' 
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Current Ticker Indicator */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono shrink-0 pl-3 border-l border-slate-800">
            <span className="text-slate-500">Auditing:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-bold">
              {currentCompany.ticker}
            </span>
            <span className="text-slate-400 truncate max-w-[140px]">
              {currentCompany.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
