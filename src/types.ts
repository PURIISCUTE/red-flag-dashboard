export type IndustryLens = 
  | 'Retail' 
  | 'Payments' 
  | 'SaaS' 
  | 'Banks' 
  | 'Tech Hardware' 
  | 'Healthcare' 
  | 'AI/Deep Tech';

export type FlagSeverity = 'Critical Anomaly' | 'Warning' | 'Healthy';

export type DataSourcePriority = 'SEC EDGAR (P1)' | 'Forensic Rule (P2)' | 'Yahoo Finance (P3)' | 'Kaggle Benchmark (P4)';

export interface FlagYearStat {
  year: string;
  fiscalPeriod: string;
  metricValue: string;
  benchmark: string;
  deviation: string;
  status: FlagSeverity;
  secLineItem: string;
  impactScore: number;
  narrative?: string;
}

export interface ForensicFlag {
  id: string;
  code: string;
  lens: IndustryLens;
  category: string;
  title: string;
  description: string;
  formula: string;
  secDisclosureCitation: string;
  benchmarkRule: string;
  status: FlagSeverity;
  scoreImpact: number; // deduction if failed
  currentValue: string;
  historicalTrend: {
    fy22: string;
    fy23: string;
    fy24: string;
    fy25: string;
    fy26: string;
    ttm: string;
  };
  year1Stat?: FlagYearStat;
  year2Stat?: FlagYearStat;
  year3Stat?: FlagYearStat;
  dataSource: DataSourcePriority;
  riskExplanation: string;
}

export interface FinancialYearData {
  year: 'FY22' | 'FY23' | 'FY24' | 'FY25' | 'FY26' | 'TTM';
  revenue: number; // in Millions USD
  cogs: number;
  grossProfit: number;
  operatingExpenses: number;
  rAndD: number;
  sga: number;
  operatingIncome: number;
  netIncome: number;
  operatingCashFlow: number;
  capex: number;
  freeCashFlow: number;
  cashAndEquivalents: number;
  accountsReceivable: number;
  inventory: number;
  totalCurrentAssets: number;
  totalAssets: number;
  currentLiabilities: number;
  longTermDebt: number;
  totalLiabilities: number;
  stockholdersEquity: number;
  sharesOutstanding: number; // in Millions
  dso: number; // Days Sales Outstanding
  dio: number; // Days Inventory Outstanding
  grossMarginPct: number;
  operatingMarginPct: number;
  accrualRatio: number; // (Net Income - OCF) / Total Assets
}

export interface StockChartPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma50?: number;
  sma200?: number;
}

export interface CompanyForensicProfile {
  ticker: string;
  name: string;
  cik: string;
  sector: string;
  lens: IndustryLens;
  marketCap: number; // Billions
  stockPrice: number;
  priceChangePercent: number;
  beta: number;
  forensicScore: number; // 0 - 100 (100 = cleanest, 0 = severe fraud risk)
  scoreGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  beneishMScore: number; // > -1.78 suggests manipulation
  altmanZScore: number; // < 1.81 distress, > 2.99 safe
  sloanAccrualRatio: number; // > 10% dangerous accruals
  executiveSummary: string[]; // Strict maximum 4 concise bullets
  financials: FinancialYearData[];
  flags: ForensicFlag[];
  chartData: StockChartPoint[];
  filingAuditLogs: {
    filingType: '10-K' | '10-Q' | '8-K';
    periodEnd: string;
    filingDate: string;
    secAccessionNumber: string;
    auditor: string;
    auditorOpinion: string;
  }[];
}

export type AuditSensitivity = 'standard' | 'conservative' | 'strict';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
  emailVerified?: boolean;
  organization?: string;
  role?: string;
  primaryLens?: IndustryLens;
  avatarUrl?: string;
  tier?: 'Analyst' | 'Institutional' | 'Regulatory' | 'Standard';
}

export interface InvestigationItem {
  id: string;
  ticker: string;
  flagCode: string;
  flagTitle: string;
  lens: IndustryLens;
  severity: FlagSeverity;
  addedAt: string;
  note: string;
}
