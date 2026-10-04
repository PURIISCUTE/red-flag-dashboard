import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  ArrowRight, 
  CornerDownLeft, 
  TrendingUp, 
  AlertCircle,
  Building2,
  Sparkles,
  Command
} from 'lucide-react';
import { 
  searchNyseNasdaqCompanies, 
  resolveQueryToTicker, 
  getNyseNasdaqCompany,
  NyseNasdaqCompany 
} from '../data/nyseNasdaqRegistry';
import { inferIndustryHeuristic } from '../services/industryClassifier';
import { IndustryLens } from '../types';

interface TickerSearchProps {
  onSelectCompany: (ticker: string) => void;
  currentTicker?: string;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  variant?: 'navbar' | 'hero';
}

interface PopularEquityItem {
  ticker: string;
  name: string;
  exchange: 'NYSE' | 'NASDAQ';
  price: number;
  change: string;
  isUp: boolean;
  lens: IndustryLens;
}

const POPULAR_EQUITIES: PopularEquityItem[] = [
  { ticker: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', price: 333.69, change: '+1.02%', isUp: true, lens: 'Tech Hardware' },
  { ticker: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ', price: 233.95, change: '+1.34%', isUp: true, lens: 'AI/Deep Tech' },
  { ticker: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ', price: 370.59, change: '+4.65%', isUp: true, lens: 'Retail' },
  { ticker: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ', price: 517.53, change: '+0.92%', isUp: true, lens: 'SaaS' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ', price: 251.52, change: '+1.33%', isUp: true, lens: 'Retail' },
  { ticker: 'GOOGL', name: 'Alphabet Inc. (Google)', exchange: 'NASDAQ', price: 343.50, change: '+1.56%', isUp: true, lens: 'AI/Deep Tech' },
  { ticker: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ', price: 585.20, change: '+0.88%', isUp: true, lens: 'AI/Deep Tech' },
  { ticker: 'PLTR', name: 'Palantir Technologies', exchange: 'NASDAQ', price: 82.40, change: '+3.10%', isUp: true, lens: 'AI/Deep Tech' },
  { ticker: 'WMT', name: 'Walmart Inc.', exchange: 'NYSE', price: 104.26, change: '+0.00%', isUp: true, lens: 'Retail' },
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.', exchange: 'NYSE', price: 218.40, change: '+0.45%', isUp: true, lens: 'Banks' }
];

export const TickerSearch: React.FC<TickerSearchProps> = ({
  onSelectCompany,
  currentTicker,
  placeholder = "Search ticker or company (e.g. AAPL, NVDA, Google)...",
  className = "",
  autoFocus = false,
  variant = 'navbar'
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey: Press '/' or 'Cmd+K' / 'Ctrl+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && document.activeElement !== inputRef.current)) {
        // Only prevent default if not already typing inside an input/textarea
        const tag = (document.activeElement?.tagName || '').toLowerCase();
        if (tag !== 'input' && tag !== 'textarea') {
          e.preventDefault();
          inputRef.current?.focus();
          setIsOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Safe outside click listener (avoids race condition with onBlur)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live matching suggestions
  const suggestions: NyseNasdaqCompany[] = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    return searchNyseNasdaqCompanies(trimmed, 8);
  }, [query]);

  // Current active list for keyboard navigation
  const activeList = useMemo(() => {
    if (query.trim()) {
      return suggestions.map(s => s.ticker);
    }
    return POPULAR_EQUITIES.map(p => p.ticker);
  }, [query, suggestions]);

  // Reset highlight on query change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [query]);

  const handleSelect = (ticker: string) => {
    const clean = ticker.trim().toUpperCase();
    onSelectCompany(clean);
    setQuery('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    setErrorMessage(null);
    inputRef.current?.blur();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = query.trim();
    if (!raw) return;

    // If an item is highlighted via keyboard, choose that
    if (highlightedIndex >= 0 && activeList[highlightedIndex]) {
      handleSelect(activeList[highlightedIndex]);
      return;
    }

    // Try resolving query
    const resolved = resolveQueryToTicker(raw);
    if (resolved) {
      handleSelect(resolved);
    } else {
      setErrorMessage(`"${raw.toUpperCase()}" was not found among NYSE or NASDAQ listed companies.`);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % activeList.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev <= 0 ? activeList.length - 1 : prev - 1));
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const getLensColorBadge = (lens: IndustryLens) => {
    switch (lens) {
      case 'Tech Hardware':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'AI/Deep Tech':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'SaaS':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'Retail':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Banks':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Payments':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Healthcare':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="relative w-full">
        <div 
          className={`flex items-center gap-2 bg-slate-900/95 border rounded-lg transition-all shadow-sm ${
            isOpen 
              ? 'border-red-500/80 ring-2 ring-red-500/20 bg-slate-900' 
              : 'border-slate-800 hover:border-slate-700'
          } ${variant === 'hero' ? 'p-2' : 'px-3 py-1.5'}`}
        >
          <Search className={`shrink-0 text-slate-400 ${variant === 'hero' ? 'h-4 w-4 ml-1' : 'h-3.5 w-3.5'}`} />

          <input
            ref={inputRef}
            type="text"
            value={query}
            autoFocus={autoFocus}
            onFocus={() => {
              setIsOpen(true);
              if (errorMessage) setErrorMessage(null);
            }}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              if (errorMessage) setErrorMessage(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full bg-transparent text-white placeholder-slate-500 outline-none font-sans ${
              variant === 'hero' ? 'text-sm' : 'text-xs'
            }`}
          />

          {/* Quick Clear Button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          )}

          {/* Keyboard Shortcut Hint / Submit Button */}
          {query.trim() ? (
            <button
              type="submit"
              className="flex items-center gap-1 px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-medium transition-colors shrink-0 shadow-sm cursor-pointer"
            >
              <span>Scan</span>
              <CornerDownLeft className="h-3 w-3 opacity-80" />
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1 shrink-0 text-[10px] text-slate-500 font-mono select-none">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700/80 text-slate-400">⌘K</span>
            </div>
          )}
        </div>
      </form>

      {/* Dropdown Command Palette */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700/90 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800 min-w-[340px] sm:min-w-[440px] md:min-w-[500px] animate-in fade-in zoom-in-95 duration-100 backdrop-blur-md">
          {/* Header Strip */}
          <div className="px-3.5 py-2 bg-slate-950/90 flex items-center justify-between text-[11px] font-sans">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              {query.trim() ? (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-red-400" />
                  <span>Matching NYSE &amp; NASDAQ Equities ({suggestions.length})</span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Popular Institutional Equities</span>
                </>
              )}
            </span>
            <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
              Use ↑↓ to navigate • ↵ to select
            </span>
          </div>

          {/* Active Results List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {query.trim() ? (
              suggestions.length > 0 ? (
                suggestions.map((item, idx) => {
                  const isHighlighted = highlightedIndex === idx;
                  const lens = inferIndustryHeuristic(item.ticker, item.name);
                  const isCurrent = currentTicker === item.ticker;

                  return (
                    <button
                      key={item.ticker}
                      type="button"
                      onClick={() => handleSelect(item.ticker)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                        isHighlighted 
                          ? 'bg-slate-800 text-white' 
                          : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`font-mono text-xs font-bold px-2 py-1 rounded border shrink-0 ${
                          isHighlighted 
                            ? 'bg-red-600 text-white border-red-500' 
                            : 'bg-slate-950 text-white border-slate-700/80'
                        }`}>
                          {item.ticker}
                        </span>

                        <div className="min-w-0">
                          <div className="text-xs font-medium text-white truncate flex items-center gap-1.5">
                            <span>{item.name}</span>
                            {isCurrent && (
                              <span className="text-[10px] text-emerald-400 font-mono font-normal">
                                (Active)
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>CIK {item.cik}</span>
                            <span>•</span>
                            <span className="text-slate-300">SEC EDGAR Verified</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {lens && (
                          <span className={`text-[10px] font-sans px-2 py-0.5 rounded border hidden sm:inline ${getLensColorBadge(lens)}`}>
                            {lens}
                          </span>
                        )}
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-semibold ${
                          item.exchange === 'NASDAQ'
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                            : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        }`}>
                          {item.exchange}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-6 text-center space-y-2">
                  <div className="h-9 w-9 mx-auto rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400">
                    <Search className="h-4 w-4" />
                  </div>
                  <div className="text-xs font-medium text-slate-200">
                    No NYSE or NASDAQ equities match &quot;{query}&quot;
                  </div>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Try searching by official ticker symbol (e.g. AAPL, NVDA) or parent company title (e.g. Apple, Alphabet, Amazon).
                  </p>
                </div>
              )
            ) : (
              // Empty Query State: Popular Institutional Equities
              POPULAR_EQUITIES.map((item, idx) => {
                const isHighlighted = highlightedIndex === idx;
                const isCurrent = currentTicker === item.ticker;

                return (
                  <button
                    key={item.ticker}
                    type="button"
                    onClick={() => handleSelect(item.ticker)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                      isHighlighted 
                        ? 'bg-slate-800 text-white' 
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`font-mono text-xs font-bold px-2 py-1 rounded border shrink-0 ${
                        isHighlighted 
                          ? 'bg-red-600 text-white border-red-500' 
                          : 'bg-slate-950 text-white border-slate-700/80'
                      }`}>
                        {item.ticker}
                      </span>

                      <div className="min-w-0">
                        <div className="text-xs font-medium text-white truncate flex items-center gap-1.5">
                          <span>{item.name}</span>
                          {isCurrent && (
                            <span className="text-[10px] text-emerald-400 font-mono font-normal">
                              (Active)
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className={`px-1.5 py-0.2 rounded border text-[9px] ${getLensColorBadge(item.lens)}`}>
                            {item.lens}
                          </span>
                          <span>•</span>
                          <span>{item.exchange}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 text-right">
                      <div className="font-mono text-xs">
                        <div className="font-bold text-white">${item.price.toFixed(2)}</div>
                        <div className={`text-[10px] ${item.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                          {item.change}
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-3 py-1.5 bg-slate-950 text-[10px] text-slate-400 flex items-center justify-between font-mono">
            <span>7,600+ Verified US Securities</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              SEC EDGAR Feed
            </span>
          </div>
        </div>
      )}

      {/* Error Message Toast */}
      {errorMessage && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2.5 bg-red-950/95 border border-red-500/60 rounded-xl shadow-xl text-xs text-red-200 z-50 flex items-start gap-2 animate-in fade-in duration-150">
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-red-300">Invalid Stock Ticker</div>
            <div className="text-[11px] text-red-200/90 mt-0.5">{errorMessage}</div>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-white text-xs px-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
