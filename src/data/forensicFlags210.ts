import { ForensicFlag, IndustryLens, FlagSeverity, DataSourcePriority, ThresholdType, ValueMode } from '../types';

export interface FlagDefinition {
  code: string;
  lens: IndustryLens;
  category: string;
  title: string;
  description: string;
  formula: string;
  secDisclosureCitation: string;
  benchmarkRule: string;
  defaultSeverity: FlagSeverity;
  scoreImpact: number;
  dataSource: DataSourcePriority;
  riskExplanation: string;
  thresholdType?: ThresholdType;
  greenThreshold?: string;
  yellowThreshold?: string;
  redThreshold?: string;
  whatItCatches?: string;
  sourceDocCode?: string;
  sourceDocName?: string;
  valueMode?: ValueMode;
  aiAuditInstruction?: string;
}

// 210 Forensic Flag Definitions across 7 Lenses (30 flags each)
export const ALL_FLAG_DEFINITIONS: FlagDefinition[] = [
  // ----------------------------------------------------
  // 1. RETAIL LENS (RET-01 to RET-30) — Exact SEC PDF Specification
  // ----------------------------------------------------
  // Category 1: Revenue Recognition Integrity (RET-01 to RET-04)
  {
    code: 'RET-01',
    lens: 'Retail',
    category: 'Revenue Recognition Integrity',
    title: 'Revenue-Cash Divergence',
    description: 'Discrepancy between operating cash flow growth and total revenue growth across consecutive reporting periods, signaling aggressive accrual recognition. Inputs: Cash Flow from Operations (current & prior year), Total Revenue (current & prior year).',
    formula: '[(CFO - CFO₋₁) / CFO₋₁] - [(Rev - Rev₋₁) / Rev₋₁]',
    secDisclosureCitation: '10-K: CFO from Consolidated Statement of Cash Flows; Revenue from Consolidated Statement of Operations',
    benchmarkRule: 'SEC Sector Cohort P90: Cash conversion lag > 8.0%',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 8,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Cash conversion breakdown: top-line revenue booked without commensurate cash collection increases restatement risk.',
    sourceDocCode: 'CF',
    sourceDocName: 'Cash Flow Statement & Income Statement',
    valueMode: 'TTM Required'
  },
  {
    code: 'RET-02',
    lens: 'Retail',
    category: 'Revenue Recognition Integrity',
    title: 'DSO Trend',
    description: 'Days Sales Outstanding trend expansion. Calculated as (Accounts Receivable / Total Revenue) × 365, then current DSO minus prior year DSO. Inputs: Accounts Receivable (net, balance sheet date), Total Revenue (full fiscal year, not quarterly).',
    formula: '(AR / Rev) × 365 then DSO - DSO₋₁',
    secDisclosureCitation: '10-K: AR from Consolidated Balance Sheet; Revenue from Income Statement',
    benchmarkRule: 'Yahoo Finance Peer Baseline: DSO deviation > 10.0 days YoY',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 7,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Rising collection days indicate quarter-end channel stuffing, extended payment terms, or rising uncollectible receivables.',
    sourceDocCode: 'BS',
    sourceDocName: 'Balance Sheet & Income Statement',
    valueMode: 'Dual (TTM + Direct)'
  },
  {
    code: 'RET-03',
    lens: 'Retail',
    category: 'Revenue Recognition Integrity',
    title: 'Deferred Revenue vs Revenue Growth Gap',
    description: 'Growth divergence between deferred revenue/contract liabilities and total revenue. Inputs: Deferred Revenue / Contract Liabilities balance (current & prior), Total Revenue. Note: If buried in Other Current Liabilities with no footnote breakout, flags Data Unavailable state.',
    formula: '[(DefRev - DefRev₋₁) / DefRev₋₁] - [(Rev - Rev₋₁) / Rev₋₁]',
    secDisclosureCitation: '10-K: Balance Sheet (if broken out) or Revenue Recognition Note under ASC 606 disclosures',
    benchmarkRule: 'Deferred Revenue contraction > 10.0% while revenue grows (or Data Unavailable in footnote)',
    defaultSeverity: 'Data Unavailable',
    scoreImpact: 5,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Buried contract liabilities or contracting deferred backlog indicates forward demand exhaustion.',
    sourceDocCode: 'N-Rev',
    sourceDocName: 'ASC 606 Contract Liabilities Footnote',
    valueMode: 'Dual (TTM + Direct)'
  },
  {
    code: 'RET-04',
    lens: 'Retail',
    category: 'Revenue Recognition Integrity',
    title: 'Sales Return Reserve Ratio Volatility',
    description: 'Year-over-year variation in sales return and allowance reserves relative to total revenue. Inputs: Sales Returns & Allowances reserve balance, Total Revenue. Note: Often buried in footnotes; unrecorded reserves trigger Data Unavailable fallback.',
    formula: '(ReturnsReserve / Rev) - (ReturnsReserve₋₁ / Rev₋₁)',
    secDisclosureCitation: '10-K Notes: "Revenue Recognition" or "Allowance for Sales Returns" footnote — rarely on the balance sheet face',
    benchmarkRule: 'Reserve ratio drop > 0.8% YoY without return rate reduction (or Buried/Data Unavailable)',
    defaultSeverity: 'Data Unavailable',
    scoreImpact: 5,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Under-reserving customer returns flatters current net revenue at the expense of post-period write-downs.',
    sourceDocCode: 'N-Rev',
    sourceDocName: 'Allowance for Sales Returns Footnote',
    valueMode: 'Direct Source Document'
  },

  // Category 2: Inventory Integrity (RET-05 to RET-08)
  {
    code: 'RET-05',
    lens: 'Retail',
    category: 'Inventory Integrity',
    title: 'DIO Trend',
    description: 'Days Inventory Outstanding calculated as (Inventory / COGS) × 365, then current DIO minus prior year DIO. Inputs: Inventory (balance sheet), Cost of Goods Sold (income statement).',
    formula: '(Inventory / COGS) × 365 then DIO - DIO₋₁',
    secDisclosureCitation: '10-K: Balance Sheet + Income Statement',
    benchmarkRule: 'Retail Sector Baseline: DIO expansion > 12.0 days YoY',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 7,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Accumulation of unsold stock or phantom inventory that will mandate deep clearance markdowns.',
    sourceDocCode: 'BS',
    sourceDocName: 'Balance Sheet & Income Statement',
    valueMode: 'Dual (TTM + Direct)'
  },
  {
    code: 'RET-06',
    lens: 'Retail',
    category: 'Inventory Integrity',
    title: 'Inventory-Revenue Growth Gap',
    description: 'Inventory expansion rate minus total revenue growth rate across identical annual reporting periods. Inputs: Inventory balance, Total Revenue (both years).',
    formula: '[(Inv - Inv₋₁) / Inv₋₁] - [(Rev - Rev₋₁) / Rev₋₁]',
    secDisclosureCitation: '10-K: Balance Sheet + Income Statement',
    benchmarkRule: 'ΔInventory% - ΔRevenue% > 8.0%',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 8,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Inventory build-up outpaces sales volume, signaling impending gross margin compression and working capital strain.',
    sourceDocCode: 'BS',
    sourceDocName: 'Balance Sheet & Income Statement',
    valueMode: 'Dual (TTM + Direct)'
  },
  {
    code: 'RET-07',
    lens: 'Retail',
    category: 'Inventory Integrity',
    title: 'Inventory Write-off Frequency',
    description: 'Part A: (ReserveT / GrossInv) - (ReserveT₋₁ / GrossInv₋₁). Part B: Count discrete write-down disclosures across 3 filed 10-Ks. Inputs: Gross Inventory and Inventory Reserve/Obsolescence Allowance (these are usually reported separately, not net).',
    formula: 'Part A: (ReserveT / GrossInv) - (ReserveT₋₁ / GrossInv₋₁). Part B: count discrete write-down disclosures across 3 filed 10-Ks',
    secDisclosureCitation: '10-K Notes: "Inventories" footnote breaks out gross vs. reserve; write-down mentions in MD&A (Item 7)',
    benchmarkRule: 'Reserve ratio compression > 1.0% or 0 write-downs across 3 years despite gross margin erosion',
    defaultSeverity: 'Warning',
    scoreImpact: 5,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Concealing obsolete or unsellable stock on the balance sheet by delaying lower of cost or net realizable value write-downs.',
    sourceDocCode: 'N-Inv',
    sourceDocName: 'Inventories Footnote (Gross vs Reserve) & MD&A',
    valueMode: 'Direct Source Document'
  },
  {
    code: 'RET-08',
    lens: 'Retail',
    category: 'Inventory Integrity',
    title: 'Gross Margin vs Inventory Divergence',
    description: 'Compare direction: ΔGross Margin % vs Inventory growth % — flag when margin rises while inventory balloons (inverse relationship). Inputs: Gross Profit, Revenue, Inventory (2+ years).',
    formula: 'Compare direction: ΔGross Margin % vs Inventory growth % — flag when margin rises while inventory balloons (inverse relationship)',
    secDisclosureCitation: '10-K: Income Statement (margin) + Balance Sheet (inventory)',
    benchmarkRule: 'Inverse Anomaly: Gross margin expands > 1.5% while inventory growth exceeds 15.0%',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 8,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Overhead absorption manipulation: capitalizing fixed manufacturing/storage costs into inventory to artificially inflate current gross margin.',
    sourceDocCode: 'IS',
    sourceDocName: 'Income Statement & Balance Sheet',
    valueMode: 'Dual (TTM + Direct)'
  },

  // Category 3: Cash Flow vs Earnings Divergence (RET-09 to RET-12)
  {
    code: 'RET-09',
    lens: 'Retail',
    category: 'Cash Flow vs Earnings Divergence',
    title: 'CFO/Net Income Growth Gap',
    description: 'Operating cash flow growth percentage minus net income growth percentage over identical annual periods. Inputs: CFO, Net Income (both years).',
    formula: '[(CFO - CFO₋₁)/CFO₋₁] - [(NI - NI₋₁)/NI₋₁]',
    secDisclosureCitation: '10-K: Cash Flow Statement + Income Statement',
    benchmarkRule: 'CFO growth lags net income growth by > 15.0%',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 7,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Paper earnings growth unsupported by real operating cash generation; prominent hallmark of earnings quality deterioration.',
    sourceDocCode: 'CF',
    sourceDocName: 'Cash Flow Statement & Income Statement',
    valueMode: 'TTM Required'
  },
  {
    code: 'RET-10',
    lens: 'Retail',
    category: 'Cash Flow vs Earnings Divergence',
    title: 'Accruals Ratio (Sloan)',
    description: 'Sloan accrual anomaly ratio: (Net Income - CFO) / Total Assets. Inputs: Net Income, CFO, Total Assets (single year, or average of beginning/ending TA for precision).',
    formula: '(Net Income - CFO) / Total Assets',
    secDisclosureCitation: '10-K: Income Statement, Cash Flow Statement, Balance Sheet',
    benchmarkRule: 'Sloan Accrual Ratio > +0.08 (Upper Decile Accrual Anomaly)',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 7,
    dataSource: 'Forensic Rule (P2)',
    riskExplanation: 'High positive accruals predict severe negative earnings reversals and heightened accounting restatement probability.',
    sourceDocCode: 'CF',
    sourceDocName: 'Consolidated Financial Statements Composite',
    valueMode: 'TTM Required'
  },
  {
    code: 'RET-11',
    lens: 'Retail',
    category: 'Cash Flow vs Earnings Divergence',
    title: 'FCF Margin Trend',
    description: 'Free cash flow margin trajectory: [(CFO - CapEx) / Rev], then compare to prior year same ratio. Inputs: CFO, Capital Expenditures (usually "Purchases of PP&E"), Revenue.',
    formula: `[(CFO - CapEx) / Rev] then compare to prior year's same ratio`,
    secDisclosureCitation: '10-K: Cash Flow Statement (CFO & CapEx both live in Investing/Operating sections), Income Statement',
    benchmarkRule: 'FCF margin decline > 3.0 percentage points YoY',
    defaultSeverity: 'Warning',
    scoreImpact: 5,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'True cash conversion deteriorating despite stable headline GAAP operating profit.',
    sourceDocCode: 'CF',
    sourceDocName: 'Cash Flow Statement & Income Statement',
    valueMode: 'TTM Required'
  },
  {
    code: 'RET-12',
    lens: 'Retail',
    category: 'Cash Flow vs Earnings Divergence',
    title: 'CapEx Classification Consistency',
    description: 'Capital expenditures growth rate compared against depreciation & amortization expense growth rate. Inputs: CapEx, Depreciation & Amortization expense (both years).',
    formula: '[(CapEx - CapEx₋₁)/CapEx₋₁] - [(D&A - D&A₋₁)/D&A₋₁]',
    secDisclosureCitation: '10-K: Cash Flow Statement — CapEx in Investing Activities, D&A as an add-back in Operating Activities',
    benchmarkRule: 'Divergence > 25.0% or CapEx suppressed below maintenance D&A',
    defaultSeverity: 'Warning',
    scoreImpact: 4,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Inconsistent capitalization of routine maintenance expenses into investing activities, or failing to maintain store fleet.',
    sourceDocCode: 'CF',
    sourceDocName: 'Cash Flow Statement (Investing & Operating)',
    valueMode: 'TTM Required'
  },

  // Category 4: Expense & Margin Manipulation (RET-13 to RET-16)
  {
    code: 'RET-13',
    lens: 'Retail',
    category: 'Expense & Margin Manipulation',
    title: 'SG&A-Revenue Growth Gap',
    description: 'Selling, General & Administrative expense growth rate minus total revenue growth rate. Inputs: SG&A expense, Total Revenue.',
    formula: '[(SG&A - SG&A₋₁)/SG&A₋₁] - [(Rev - Rev₋₁)/Rev₋₁]',
    secDisclosureCitation: '10-K: Income Statement',
    benchmarkRule: 'SG&A growth outpaces revenue growth by > 6.0%',
    defaultSeverity: 'Warning',
    scoreImpact: 5,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Operating deleverage: administrative overhead and fixed store expenses expanding faster than sales volume.',
    sourceDocCode: 'IS',
    sourceDocName: 'Income Statement',
    valueMode: 'TTM Required'
  },
  {
    code: 'RET-14',
    lens: 'Retail',
    category: 'Expense & Margin Manipulation',
    title: 'Gross Margin Volatility',
    description: 'Absolute value of gross margin percentage variation over consecutive reporting years: Abs[(GP/Rev) - (GP₋₁/Rev₋₁)]. Inputs: Gross Profit, Revenue (2 consecutive years minimum, 3+ preferred for a real volatility read).',
    formula: 'Abs[(GP/Rev) - (GP₋₁/Rev₋₁)]',
    secDisclosureCitation: '10-K: Income Statement',
    benchmarkRule: 'Gross margin swing > 250 bps YoY without business model transition',
    defaultSeverity: 'Warning',
    scoreImpact: 4,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Volatile gross margin indicates unpredictable pricing, erratic vendor rebate timing, or cost shifting.',
    sourceDocCode: 'IS',
    sourceDocName: 'Income Statement',
    valueMode: 'TTM Required'
  },
  {
    code: 'RET-15',
    lens: 'Retail',
    category: 'Expense & Margin Manipulation',
    title: 'COGS-to-Revenue Ratio Volatility',
    description: 'Absolute shift in the Cost of Goods Sold to Revenue ratio over consecutive years: Abs[(COGS/Rev) - (COGS₋₁/Rev₋₁)]. Inputs: COGS, Revenue.',
    formula: 'Abs[(COGS/Rev) - (COGS₋₁/Rev₋₁)]',
    secDisclosureCitation: '10-K: Income Statement',
    benchmarkRule: 'COGS/Revenue ratio swing > 280 bps YoY',
    defaultSeverity: 'Warning',
    scoreImpact: 4,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Arbitrary classification of supply chain and distribution costs between COGS and operating expenses to smooth margins.',
    sourceDocCode: 'IS',
    sourceDocName: 'Income Statement',
    valueMode: 'TTM Required'
  },
  {
    code: 'RET-16',
    lens: 'Retail',
    category: 'Expense & Margin Manipulation',
    title: 'Depreciation Rate Trend',
    description: 'Depreciation & Amortization divided by Gross PP&E (before accumulated depreciation — this distinction matters a lot) comparing current vs prior year. Inputs: D&A expense, Gross PP&E.',
    formula: '(D&A/GrossPP&E) - (D&A₋₁/GrossPP&E₋₁)',
    secDisclosureCitation: '10-K: D&A from Cash Flow Statement; Gross PP&E from Property, Plant & Equipment footnote (not the balance sheet net figure)',
    benchmarkRule: 'Effective depreciation rate decline > 120 bps YoY without disclosed asset mix shift',
    defaultSeverity: 'Warning',
    scoreImpact: 5,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Extending estimated useful lives of store fixtures and IT systems reduces current depreciation expense, artificially inflating EPS.',
    sourceDocCode: 'N-PPE',
    sourceDocName: 'Property, Plant & Equipment Footnote (Gross Asset Base)',
    valueMode: 'Direct Source Document'
  },

  // Category 5: Lease & Off-Balance-Sheet Risk (RET-17 to RET-19)
  {
    code: 'RET-17',
    lens: 'Retail',
    category: 'Lease & Off-Balance-Sheet Risk',
    title: 'Lease-Adjusted Leverage',
    description: '(Total Debt + Operating Lease Liability) / EBITDAR, where EBITDAR = EBITDA + Rent Expense. Inputs: Total Debt (short + long-term), Operating Lease Liability, EBITDA components (Revenue, Opex, D&A), Rent Expense.',
    formula: '(Total Debt + Operating Lease Liability) / EBITDAR, where EBITDAR = EBITDA + Rent Expense',
    secDisclosureCitation: '10-K: Balance Sheet (Debt, Lease Liability under ASC 842), Income Statement, Leases footnote (rent expense)',
    benchmarkRule: 'Adjusted Debt / EBITDAR > 4.2x (Elevated Lease Burden)',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 6,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Store lease liabilities represent rigid fixed obligations that amplify financial fragility and distress risk.',
    sourceDocCode: 'N-Lease',
    sourceDocName: 'ASC 842 Leases Footnote & Balance Sheet',
    valueMode: 'Dual (TTM + Direct)'
  },
  {
    code: 'RET-18',
    lens: 'Retail',
    category: 'Lease & Off-Balance-Sheet Risk',
    title: 'Op. Lease Liability Growth',
    description: 'Year-over-year percentage expansion in Operating Lease Liabilities: (OpLeaseLiab - OpLeaseLiab₋₁) / OpLeaseLiab₋₁. Inputs: Operating Lease Liability (current & prior year).',
    formula: '(OpLeaseLiab - OpLeaseLiab₋₁) / OpLeaseLiab₋₁',
    secDisclosureCitation: '10-K: Balance Sheet or Leases footnote',
    benchmarkRule: 'Lease liability growth > 18.0% while retail sales growth remains flat or negative',
    defaultSeverity: 'Warning',
    scoreImpact: 5,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Rapid expansion of committed store footprint leases creates inflexible overhead during cyclical retail downturns.',
    sourceDocCode: 'BS',
    sourceDocName: 'Balance Sheet & Note 9: Leases',
    valueMode: 'Direct Source Document'
  },
  {
    code: 'RET-19',
    lens: 'Retail',
    category: 'Lease & Off-Balance-Sheet Risk',
    title: 'Rent Expense-Lease Liability Consistency',
    description: "Compare Rent Expense growth % vs Lease Liability growth % — flag when disclosed expense doesn't move in step with the recorded liability. Inputs: Rent/Lease expense, Operating Lease Liability.",
    formula: "Compare Rent Expense growth % vs Lease Liability growth % — flag when disclosed expense doesn't move in step with the recorded liability",
    secDisclosureCitation: '10-K: Leases footnote (both figures typically sit together here)',
    benchmarkRule: 'Growth divergence > 12.0% between disclosed rent expense and balance sheet lease liability',
    defaultSeverity: 'Warning',
    scoreImpact: 5,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Unrecorded lease commitments, variable rent structuring, or off-balance sheet leaseback maneuvers.',
    sourceDocCode: 'N-Lease',
    sourceDocName: 'Leases Footnote (Rent Expense vs Liability)',
    valueMode: 'Direct Source Document'
  },

  // Category 6: Reserve & Estimate Manipulation (RET-20 to RET-22)
  {
    code: 'RET-20',
    lens: 'Retail',
    category: 'Reserve & Estimate Manipulation',
    title: 'Bad Debt Allowance Ratio Volatility',
    description: 'Year-over-year shift in allowance for doubtful accounts divided by gross accounts receivable: (Allowance/GrossAR) - (Allowance₋₁/GrossAR₋₁). Inputs: Allowance for Doubtful Accounts, Gross Accounts Receivable.',
    formula: '(Allowance/GrossAR) - (Allowance₋₁/GrossAR₋₁)',
    secDisclosureCitation: '10-K: Accounts Receivable footnote (allowance is rarely shown on balance sheet face for retail)',
    benchmarkRule: 'Allowance ratio compression > 60 bps YoY while receivables expand',
    defaultSeverity: 'Warning',
    scoreImpact: 4,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Suppressing doubtful account reserves boosts reported operating income; credit loss shock deferred.',
    sourceDocCode: 'N-AR',
    sourceDocName: 'Accounts Receivable Footnote (Allowance Schedule)',
    valueMode: 'Direct Source Document'
  },
  {
    code: 'RET-21',
    lens: 'Retail',
    category: 'Reserve & Estimate Manipulation',
    title: 'Restructuring Charge Frequency',
    description: 'Count of distinct line items labeled "restructuring," "impairment," or "non-recurring charge" across 3 consecutive annual filings. Inputs: Restructuring/impairment charge line items, trailing 3 fiscal years.',
    formula: 'Count of distinct line items labeled "restructuring," "impairment," or "non-recurring charge" across 3 consecutive annual filings',
    secDisclosureCitation: '10-K: Income Statement + Restructuring footnote + MD&A (Item 7)',
    benchmarkRule: 'Discrete restructuring charges in >= 3 consecutive annual filings (Recurring "Non-Recurring")',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 6,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Rebranding recurring operational overhead as non-recurring restructuring charges to inflate non-GAAP adjusted earnings.',
    sourceDocCode: 'IS',
    sourceDocName: 'Income Statement & Note on Restructuring',
    valueMode: 'TTM Required'
  },
  {
    code: 'RET-22',
    lens: 'Retail',
    category: 'Reserve & Estimate Manipulation',
    title: 'Effective Tax Rate Volatility',
    description: 'Absolute year-over-year swing in effective tax rate: Abs[ETR - ETR₋₁], where ETR = Income Tax Expense / Pre-Tax Income. Inputs: Income Tax Expense, Pre-Tax Income (both years).',
    formula: 'Abs[ETR - ETR₋₁], where ETR = Income Tax Expense / Pre-Tax Income',
    secDisclosureCitation: '10-K: Income Statement + Income Taxes footnote (contains the full rate reconciliation table)',
    benchmarkRule: 'Effective tax rate volatility > 6.0 percentage points YoY without statutory tax code changes',
    defaultSeverity: 'Warning',
    scoreImpact: 4,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Tax valuation allowance adjustments used as a discretionary reserve to cushion EPS in weak quarters.',
    sourceDocCode: 'N-Tax',
    sourceDocName: 'Income Taxes Footnote & Rate Reconciliation Table',
    valueMode: 'Direct Source Document'
  },

  // Category 7: Governance & Disclosure Integrity (RET-23 to RET-26)
  {
    code: 'RET-23',
    lens: 'Retail',
    category: 'Governance & Disclosure Integrity',
    title: 'Related-Party Transaction Ratio',
    description: 'Formula: Related-Party Transaction $ / Revenue. Look for dollar amounts disclosed for transactions with officers, directors, major shareholders, or entities they control. Inputs: Related-Party Transaction $, Total Revenue.',
    formula: 'Related-Party Transaction $ / Revenue. Look for dollar amounts disclosed for transactions with officers, directors, major shareholders, or entities they control',
    secDisclosureCitation: '10-K Notes: "Related Party Transactions" footnote; also cross-check the Proxy Statement (DEF 14A)',
    benchmarkRule: "Related-party transactions > 1.5% of Revenue or non-arm's-length vendor agreements",
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 7,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Insider value extraction, conflicted supplier arrangements, or off-market property leasebacks.',
    sourceDocCode: 'DEF14A',
    sourceDocName: 'Proxy Statement & Note: Related Party Transactions',
    valueMode: 'Direct Source Document'
  },
  {
    code: 'RET-24',
    lens: 'Retail',
    category: 'Governance & Disclosure Integrity',
    title: 'Material Weakness Disclosure',
    description: "Binary check: does management's internal controls assessment say controls are \"not effective\" or explicitly use the phrase \"material weakness\"? Inputs: 10-K Item 9A controls statement.",
    formula: "Binary check: does management's internal controls assessment say controls are \"not effective\" or explicitly use the phrase \"material weakness\"?",
    secDisclosureCitation: '10-K, Item 9A ("Controls and Procedures") — this is a standardized, mandatory section, easy to scan',
    benchmarkRule: 'Explicit admission of "Material Weakness" or "Not Effective" internal controls in Item 9A',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 9,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Formal acknowledgement that internal control over financial reporting is compromised and unreliable.',
    sourceDocCode: '9A',
    sourceDocName: '10-K Item 9A Controls and Procedures',
    valueMode: 'Direct Source Document'
  },
  {
    code: 'RET-25',
    lens: 'Retail',
    category: 'Governance & Disclosure Integrity',
    title: 'Restatement Flag',
    description: 'Binary check: look for phrases like "restatement," "revision of previously issued financial statements," or "correction of an error" in the financial statement notes or Form 8-K Item 4.02.',
    formula: 'Binary check: look for phrases like "restatement," "revision of previously issued financial statements," or "correction of an error" in the financial statement notes',
    secDisclosureCitation: '10-K Notes (usually a dedicated footnote if it happened); also check for an 8-K, Item 4.02 filing ("Non-Reliance on Previously Issued Financials")',
    benchmarkRule: 'Filing of Form 8-K Item 4.02 or formal revision of past financial statements in 10-K',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 10,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Direct confirmation that previously reported financial results were materially erroneous or fraudulent.',
    sourceDocCode: '8-K',
    sourceDocName: 'Form 8-K Item 4.02 & Note 2 Prior Restatements',
    valueMode: 'Direct Source Document'
  },
  {
    code: 'RET-26',
    lens: 'Retail',
    category: 'Governance & Disclosure Integrity',
    title: 'Auditor Going-Concern Language',
    description: "Binary check: does the auditor's opinion letter contain \"substantial doubt about the Company's ability to continue as a going concern\"? Inputs: Report of Independent Registered Public Accounting Firm.",
    formula: "Binary check: does the auditor's opinion letter contain \"substantial doubt about the Company's ability to continue as a going concern\"?",
    secDisclosureCitation: '10-K: Report of Independent Registered Public Accounting Firm (sits right before the financial statements)',
    benchmarkRule: 'PCAOB AS 2415 Substantial Doubt Going-Concern Paragraph Present',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 10,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'External auditor formally warns that the company faces severe near-term bankruptcy or liquidation risk.',
    sourceDocCode: 'Audit',
    sourceDocName: 'Report of Independent Registered Public Accounting Firm',
    valueMode: 'Direct Source Document'
  },

  // Category 8: Composite Models & Operational Consistency (RET-27 to RET-30)
  {
    code: 'RET-27',
    lens: 'Retail',
    category: 'Composite Models & Operational Consistency',
    title: 'Beneish M-Score',
    description: '8-variable weighted probabilistic manipulation sum: M = -4.84 + 0.92(DSRI) + 0.528(GMI) + 0.404(AQI) + 0.892(SGI) + 0.115(DEPI) - 0.172(SGAI) + 4.679(TATA) - 0.327(LVGI). Inputs: DSRI, GMI, AQI, SGI, DEPI, SGAI, LVGI, TATA across 2 consecutive years.',
    formula: '8-variable weighted sum: M = -4.84 + 0.92(DSRI) + 0.528(GMI) + 0.404(AQI) + 0.892(SGI) + 0.115(DEPI) − 0.172(SGAI) + 4.679(TATA) − 0.327(LVGI)',
    secDisclosureCitation: '10-K: All 8 sub-variables are built from Balance Sheet, Income Statement, and Cash Flow Statement line items across 2 consecutive years',
    benchmarkRule: 'Beneish M-Score > -1.78 (Statistically Significant Earnings Manipulation Probability)',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 9,
    dataSource: 'Forensic Rule (P2)',
    riskExplanation: 'Academic composite score predicts elevated probability of deliberate financial statement distortion.',
    sourceDocCode: 'COMP',
    sourceDocName: 'Beneish 8-Factor Matrix (BS, IS, CF)',
    valueMode: 'TTM Required'
  },
  {
    code: 'RET-28',
    lens: 'Retail',
    category: 'Composite Models & Operational Consistency',
    title: 'Altman Z-Score',
    description: 'Z = 1.2(WC/TA) + 1.4(RE/TA) + 3.3(EBIT/TA) + 0.6(MVE/TL) + 1.0(Sales/TA). Inputs: Working Capital, Total Assets, Retained Earnings, EBIT, Market Value of Equity (share price × shares outstanding from Yahoo Finance), Total Liabilities, Sales.',
    formula: 'Z = 1.2(WC/TA) + 1.4(RE/TA) + 3.3(EBIT/TA) + 0.6(MVE/TL) + 1.0(Sales/TA)',
    secDisclosureCitation: '10-K for all balance sheet/income statement figures; Market Value of Equity requires an external stock price feed (Yahoo Finance)',
    benchmarkRule: 'Altman Z < 1.81 (Distress Zone / High Insolvency Probability Within 2 Years)',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 8,
    dataSource: 'Yahoo Finance (P3)',
    riskExplanation: 'Distress zone reading indicates high default likelihood, covenant pressure, or debt restructuring.',
    sourceDocCode: 'COMP',
    sourceDocName: 'Altman Z Multi-Statement + Yahoo Live MVE',
    valueMode: 'Dual (TTM + Direct)'
  },
  {
    code: 'RET-29',
    lens: 'Retail',
    category: 'Composite Models & Operational Consistency',
    title: 'Comp-Sales vs Total Revenue Gap',
    description: 'Total Revenue growth % − Same-Store Sales growth %. Non-GAAP KPI disclosed in MD&A or 8-K. Note: Voluntarily disclosed KPI. If company stops reporting it during rough periods, triggers Data Unavailable (red flag precursor).',
    formula: 'Total Revenue growth % − Same-Store Sales growth %',
    secDisclosureCitation: 'Total Revenue: 10-K Income Statement. Same-Store Sales: non-GAAP metric found in MD&A (Item 7) or 8-K Exhibit 99.1',
    benchmarkRule: 'Gap > 5.0% (Organic store decline masked by footprint) or Data Unavailable (KPI Withdrawn)',
    defaultSeverity: 'Data Unavailable',
    scoreImpact: 6,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Organic unit contraction masked by gross store openings; abrupt withdrawal of non-GAAP metric indicates severe weakness.',
    sourceDocCode: 'MD&A',
    sourceDocName: 'Item 7 MD&A Same-Store Sales KPI Table',
    valueMode: 'Direct Source Document'
  },
  {
    code: 'RET-30',
    lens: 'Retail',
    category: 'Composite Models & Operational Consistency',
    title: 'Segment Margin Volatility',
    description: 'Abs[(SegOpIncome/SegRevenue) − (SegOpIncome/SegRevenue)₋₁], calculated per segment. Inputs: Segment Revenue, Segment Operating Income for each reported operating segment.',
    formula: 'Abs[(SegOpIncome/SegRevenue) − (SegOpIncome/SegRevenue)₋₁], calculated per segment',
    secDisclosureCitation: '10-K Notes: "Segment Reporting" footnote (required under ASC 280) — this is the only place segment-level P&L data is disclosed',
    benchmarkRule: 'Segment operating margin swing > 350 bps YoY across primary operating segment',
    defaultSeverity: 'Warning',
    scoreImpact: 5,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Erratic segment profitability or arbitrary corporate overhead allocations between operating divisions.',
    sourceDocCode: 'N-Seg',
    sourceDocName: 'Segment Reporting Footnote (ASC 280)',
    valueMode: 'Direct Source Document'
  },

  // ----------------------------------------------------
  // 2. PAYMENTS LENS (PAY-01 to PAY-30)
  // ----------------------------------------------------
  {
    code: 'PAY-01',
    lens: 'Payments',
    category: 'Reserve Adequacy',
    title: 'Merchant Credit Loss Reserve Inadequacy vs Total Payment Volume (TPV)',
    description: 'Merchant loss reserves declining as a percentage of processed volume during periods of rising consumer chargebacks.',
    formula: 'Loss Reserves / Total Payment Volume (TPV) < 0.045%',
    secDisclosureCitation: '10-K Note 5: Merchant Reserves & Settlement Obligations',
    benchmarkRule: 'Yahoo Finance Payments Peer Baseline: 0.075% - 0.12%',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 8,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Severe risk of sudden catastrophic write-offs when distressed merchants default on customer refund claims.'
  },
  {
    code: 'PAY-02',
    lens: 'Payments',
    category: 'Revenue Recognition',
    title: 'Gross vs Net Reporting Distortion on Interchange & Assessment Fees',
    description: 'Recording gross payment volume as company revenue rather than net transaction spread, artificially ballooning revenue run-rate.',
    formula: 'Revenues / Gross Volume > Industry Benchmark Spread by 2.2x',
    secDisclosureCitation: '10-K Note 2: Principal vs Agent Assessment (ASC 606-10-55-36)',
    benchmarkRule: 'SEC Staff Accounting Bulletin SAB 101/104 Precedents',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 8,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Gross revenue reporting inflates top-line valuation multiples while concealing low true software margins.'
  },
  {
    code: 'PAY-03',
    lens: 'Payments',
    category: 'Balance Sheet Float',
    title: 'Customer Funds / Settlement Float Asset-Liability Mismatch',
    description: 'Investing customer deposit float in illiquid, long-duration or credit-risky securities to chase yield without capital ring-fencing.',
    formula: 'Customer Funds Held / Long-Term Unhedged Investments > 15%',
    secDisclosureCitation: '10-K Item 8 Note 3: Funds Receivable and Customer Accounts',
    benchmarkRule: 'FDIC & FinCEN Money Transmitter Liquidity Coverage Ratio',
    defaultSeverity: 'Warning',
    scoreImpact: 6,
    dataSource: 'Forensic Rule (P2)',
    riskExplanation: 'Creates Silicon Valley Bank-style duration mismatch and liquidity insolvency risk if run-on-the-bank occurs.'
  },
  {
    code: 'PAY-04',
    lens: 'Payments',
    category: 'Pricing & Unit Economics',
    title: 'Take-Rate Compression Masked by Foreign Exchange Markups',
    description: 'Core merchant acquiring fee take-rate collapsing, hidden by aggressive non-recurring cross-border currency conversion fee gouging.',
    formula: 'Core Domestic Take-Rate Δ YoY < -12 bps concealed by FX spread',
    secDisclosureCitation: '10-K Item 7: MD&A Transaction Take-Rate Disclosures',
    benchmarkRule: 'Yahoo Finance Payments Sector Competitive Baseline',
    defaultSeverity: 'Warning',
    scoreImpact: 5,
    dataSource: 'Yahoo Finance (P3)',
    riskExplanation: 'Structural margin deterioration masked by temporary, vulnerable pricing power in cross-border corridors.'
  },
  ...(() => {
    const payDetails = [
      {
        title: 'Buy-Now-Pay-Later (BNPL) 90+ Day Delinquency Forbearance Extension',
        formula: 'Re-aged BNPL Delinquent Loans / Total Portfolio > 8.0%',
        category: 'Credit & Reserves',
        citation: '10-K Note 4: Financing Receivables and Credit Losses (CECL)',
        benchmark: 'Fintech BNPL Delinquency Baseline: Re-aged tranches < 3.5%',
        severity: 'Critical Anomaly' as FlagSeverity,
        impact: 7,
        risk: 'Hides true consumer credit default waves by continually granting loan term extensions.'
      },
      {
        title: 'Uncollected Chargeback Settlement Receivable Runoff',
        formula: 'Chargeback Receivables Aging > 90 Days / Total Reserves > 45%',
        category: 'Credit & Reserves',
        citation: '10-K Note 5: Merchant Settlement Assets & Chargeback Allowances',
        benchmark: 'Payment Network Chargeback Standard: Uncollectible runoff < 20%',
        severity: 'Warning' as FlagSeverity,
        impact: 5,
        risk: 'Delayed write-off of unrecoverable merchant disputes leaves phantom assets on balance sheet.'
      },
      {
        title: 'Partner Revenue Share Capitalization vs Contra-Revenue',
        formula: 'Distribution Partner Rev-Share Capitalized as Intangible Asset / TPV > 0.15%',
        category: 'Revenue Recognition',
        citation: '10-K Note 2: Revenue Recognition - Consideration Payable to Customers (ASC 606)',
        benchmark: 'ASC 606 Contra-Revenue Treatment: Rev-shares must reduce reported revenue',
        severity: 'Critical Anomaly' as FlagSeverity,
        impact: 6,
        risk: 'Artificially inflates top-line transaction volume and gross margin.'
      },
      {
        title: 'Cross-Border Sanctions & Anti-Money Laundering (AML) Compliance Provision Shortfall',
        formula: 'FinCEN / OFAC Compliance Investigation Disclosed with $0 Legal Reserve',
        category: 'Regulatory & Governance',
        citation: '10-K Note 11: Legal and Regulatory Matters (ASC 450)',
        benchmark: 'Regulatory Enforcement Provision Benchmark: Probable fines must be accrued',
        severity: 'Critical Anomaly' as FlagSeverity,
        impact: 8,
        risk: 'Exposes shareholders to sudden multi-hundred million dollar regulatory penalties.'
      },
      {
        title: 'Synthetic Payment Volume Round-Tripping Anomaly',
        formula: 'Inter-affiliate Processing Volume / Gross TPV > 14%',
        category: 'Revenue Quality',
        citation: '10-K Note 13: Related Party Transactions & Flow Metrics',
        benchmark: 'SEC SAB Topic 5.A: Round-trip volume excluded from commercial metrics',
        severity: 'Critical Anomaly' as FlagSeverity,
        impact: 8,
        risk: 'Fictitious payment volume created between controlled merchant entities to inflate growth.'
      },
      {
        title: 'Processing Network Fee Rebate Smoothing across Quarters',
        formula: 'Card Scheme Incentive Accrual Divergence vs Actual Volume Tranches > 25%',
        category: 'Revenue Recognition',
        citation: '10-K Note 2: Network Assessment & Incentive Accruals',
        benchmark: 'ASC 606 Variable Consideration Constraint: Realized volume baseline only',
        severity: 'Warning' as FlagSeverity,
        impact: 4,
        risk: 'Borrows prospective volume tier discounts to smooth quarterly margin shortfalls.'
      },
      {
        title: 'Cryptocurrency Custody Fair Value Level 3 Classification Risk',
        formula: 'Custodied Crypto Assets Measured with Internal Unobservable Illiquidity Models > 20%',
        category: 'Balance Sheet Float',
        citation: '10-K Note 7: Fair Value Disclosures (ASC 820) & SAB 121 Safeguarding',
        benchmark: 'SEC SAB 121 & Level 3 Scrutiny: Market observable pricing mandatory',
        severity: 'Critical Anomaly' as FlagSeverity,
        impact: 7,
        risk: 'Overvalues illiquid digital tokens held in custodial accounts during crypto downturns.'
      },
      {
        title: 'Merchant Cash Advance Default Loss Recognition Delay',
        formula: 'Non-Accrual Merchant Working Capital Advances / Gross Advances < 2.5% with Merchant Churn > 18%',
        category: 'Credit & Reserves',
        citation: '10-K Note 4: Merchant Working Capital Loans & Factoring Advances',
        benchmark: 'SEC Credit Loss Peer Cohort Baseline: 4.8% - 7.5%',
        severity: 'Warning' as FlagSeverity,
        impact: 6,
        risk: 'Fails to stop interest accrual on bankrupt merchants, artificially maintaining reported earnings.'
      },
      {
        title: 'Card Scheme Fine Contingency Under-Accrual',
        formula: 'Visa/Mastercard Excessive Dispute Program Violations without Formal Accrued Reserve',
        category: 'Regulatory & Governance',
        citation: '10-K Note 11: Scheme Fines & Compliance Reserves',
        benchmark: 'Card Brand Operating Regulations: Monthly non-compliance assessments',
        severity: 'Warning' as FlagSeverity,
        impact: 4,
        risk: 'Cumulative monthly fines from card networks create unexpected cash flow drain.'
      },
      {
        title: 'Terminal POS Hardware Residual Value Depreciation Extension',
        formula: 'Point-of-Sale Hardware Depreciable Life > 7 Years',
        category: 'Asset Valuation',
        citation: '10-K Note 6: POS Equipment & Merchant Terminals (us-gaap:PropertyPlantAndEquipmentUsefulLife)',
        benchmark: 'Fintech Hardware Lifecycle Standard: 3 - 5 Years Max',
        severity: 'Warning' as FlagSeverity,
        impact: 4,
        risk: 'Depresses annual hardware depreciation to inflate adjusted EBITDA.'
      },
      {
        title: 'Peer-to-Peer (P2P) Fraud Loss Reclassification into Marketing Expense',
        formula: 'Authorized Push Payment (APP) Scams Expensed as Customer Goodwill Promotion > $25M',
        category: 'Expense Recognition',
        citation: '10-K Note 1: Operating Expenses - Marketing & Customer Support',
        benchmark: 'CFPB Consumer Financial Protection Guidance on Fraud Accounting',
        severity: 'Warning' as FlagSeverity,
        impact: 5,
        risk: 'Disguises systemic payment platform security vulnerabilities as brand promotion expenses.'
      },
      {
        title: 'Prepaid Card Unclaimed Property (Escheatment) Liability Concealment',
        formula: 'State Unclaimed Property Audit Disclosed with Unremitted Dormant Balances > $15M',
        category: 'Contingent Liabilities',
        citation: '10-K Note 9: Customer Accounts Payable & Abandoned Property Provisions',
        benchmark: 'Uniform Unclaimed Property Act Compliance Baseline',
        severity: 'Critical Anomaly' as FlagSeverity,
        impact: 6,
        risk: 'States can seize dormant stored-value funds along with substantial non-compliance interest penalties.'
      },
      {
        title: 'Acquired Payment Gateway Merchant Attrition Amortization Suppression',
        formula: 'Acquired Merchant Customer Relationship Amortization Life > 15 Years despite 12% Annual Churn',
        category: 'Asset Valuation',
        citation: '10-K Note 8: Intangible Assets and Amortization Schedules',
        benchmark: 'ASC 350-30 Finite-Lived Intangibles: Useful life must reflect merchant attrition rates',
        severity: 'Warning' as FlagSeverity,
        impact: 5,
        risk: 'Delays amortization of acquired merchant portfolios, setting up massive future impairments.'
      },
      {
        title: 'High-Risk Merchant Underwriting Escrow Cushion Deterioration',
        formula: 'High-Risk Merchant Collateral Deposits / High-Risk TPV < 1.0%',
        category: 'Reserve Adequacy',
        citation: '10-K Note 5: Merchant Reserves & Escrow Balances',
        benchmark: 'Payment Processor Underwriting Standard: 5% - 10% collateral cushion',
        severity: 'Critical Anomaly' as FlagSeverity,
        impact: 7,
        risk: 'Exposes payment facilitator to catastrophic liabilities if gambling or high-risk merchants fold.'
      },
      {
        title: 'Foreign Subsidiary Float Repatriation Tax Liability Deficit',
        formula: 'Offshore Customer Settlement Balances with Indefinite Reinvestment Assertion > $500M',
        category: 'Tax Disclosures',
        citation: '10-K Note 10: Income Taxes - Unremitted Foreign Earnings',
        benchmark: 'ASC 740 Indefinite Reinvestment Exception Audit Protocol',
        severity: 'Warning' as FlagSeverity,
        impact: 4,
        risk: 'Hidden deferred tax liabilities if offshore funds must be tapped to meet domestic settlement runs.'
      },
      {
        title: 'Payment API Uptime SLA Penalty Contingent Liability Non-Accrual',
        formula: 'Production Downtime Incidents > 120 Minutes/Quarter with $0 SLA Refund Accrual',
        category: 'Contingent Liabilities',
        citation: '10-K Note 12: Customer Commitments & Performance Obligations',
        benchmark: 'Enterprise Fintech Master Service Agreement SLA Standards',
        severity: 'Warning' as FlagSeverity,
        impact: 4,
        risk: 'Contractual fee credits and damages owed to enterprise merchants for processing blackouts.'
      },
      {
        title: 'Dispute Arbitration Pipeline Backlog Reserve Understatement',
        formula: 'Pending Pre-Arbitration Scheme Cases / Active Processing Reserves > 35%',
        category: 'Credit & Reserves',
        citation: '10-K Note 5: Settlement Reserves & Chargebacks',
        benchmark: 'Yahoo Finance Transaction Network Consensus P80',
        severity: 'Warning' as FlagSeverity,
        impact: 4,
        risk: 'Backlog of disputed transaction arbitrations with high historical loss rates.'
      },
      {
        title: 'Automated Clearing House (ACH) Return Window Reserve Variance',
        formula: 'ACH Return Loss Reserve / ACH Debit Volume < 0.015%',
        category: 'Credit & Reserves',
        citation: '10-K Note 3: Processing Clearing & ACH Settlement Obligations',
        benchmark: 'Nacha Operating Rules & Return Ratio Safeguards',
        severity: 'Healthy' as FlagSeverity,
        impact: 3,
        risk: 'Protects against unaccrued unauthorized ACH return spikes.'
      },
      {
        title: 'Sub-Processor Liability Indemnification Gap',
        formula: 'Third-Party Cloud Settlement Gateway Outages with Unquantified Indemnity Caps',
        category: 'Operational Governance',
        citation: '10-K Item 1A: Risk Factors & Technical Processing Vendor Agreements',
        benchmark: 'ISO 27001 Vendor Risk Assessment Standard',
        severity: 'Warning' as FlagSeverity,
        impact: 4,
        risk: 'Reliance on external switching rails leaves processor liable for counterparties.'
      },
      {
        title: 'Credit Card Interchange Regulation Direct Impact Reserve Omission',
        formula: 'Federal Reserve Reg II Debit Fee Cap Reductions with Zero Disclosed Margin Adjustment',
        category: 'Regulatory & Governance',
        citation: '10-K Item 7: Regulatory Environment & Interchange Legislation',
        benchmark: 'Federal Reserve Regulation II (Durbin Amendment) Impact Benchmark',
        severity: 'Critical Anomaly' as FlagSeverity,
        impact: 6,
        risk: 'Impending regulatory fee compression will wipe out significant gross profits.'
      },
      {
        title: 'Merchant Contract Acquisition Amortization Extension to 10+ Years',
        formula: 'Sales Rep ISO Commissions Amortized over > 10 Years (ASC 340-40)',
        category: 'Expense Recognition',
        citation: '10-K Note 2: Deferred Contract Acquisition Costs (ASC 340-40)',
        benchmark: 'ASC 340-40 Contract Amortization: Max 5 years without documented historical retention',
        severity: 'Warning' as FlagSeverity,
        impact: 5,
        risk: 'Suppresses current sales and marketing expenses by spreading agent signing costs over a decade.'
      },
      {
        title: 'Real-Time Rail Liquidity Overdraft Reliance Spike',
        formula: 'Intraday Central Bank / FedNow Overdraft Borrowing > 25% of Total Liquidity',
        category: 'Balance Sheet Float',
        citation: '10-K Note 3: Cash, Cash Equivalents and Settlement Facilities',
        benchmark: 'Federal Reserve Payment System Risk Policy Guidance',
        severity: 'Critical Anomaly' as FlagSeverity,
        impact: 7,
        risk: 'Signals chronic intraday cash shortages on instantaneous 24/7 clearing rails.'
      },
      {
        title: 'Platform Merchant Cohort LTV/CAC Calculation Distortion',
        formula: 'Non-GAAP LTV/CAC Excludes Terminal Hardware Losses & Acquisition Sales Headcount',
        category: 'Governance & Compensation',
        citation: '10-K Item 7: MD&A Key Performance Indicators (Non-GAAP)',
        benchmark: 'SEC Non-GAAP Disclosure Guidelines (Item 10(e))',
        severity: 'Warning' as FlagSeverity,
        impact: 4,
        risk: 'Misleading unit economics presented to Wall Street to justify cash burn.'
      },
      {
        title: 'Virtual Card Rebate Premature Accrual',
        formula: 'B2B Commercial Virtual Card Volume Rebate Recognized Before Issuer Spend Settlement',
        category: 'Revenue Recognition',
        citation: '10-K Note 2: Commercial Card Rebates & Performance Obligations',
        benchmark: 'ASC 606-10-32-5 Transaction Price Variable Consideration Constraint',
        severity: 'Warning' as FlagSeverity,
        impact: 4,
        risk: 'Premature recognition of card volume kickbacks before final spending reconciliations.'
      },
      {
        title: 'Cross-Border Tax Withholding Compliance Gap',
        formula: 'Foreign Digital Service Tax (DST) Disclosed with Zero Accrued Withholding Reserve',
        category: 'Tax Disclosures',
        citation: '10-K Note 10: International Tax Compliance & DST Obligations',
        benchmark: 'OECD Pillar 1 & Digital Services Tax Regulatory Standards',
        severity: 'Warning' as FlagSeverity,
        impact: 4,
        risk: 'Unrecorded international tax assessments across European and Asian operating territories.'
      },
      {
        title: 'Payments Executive Turnover in Risk & Chief Compliance Office',
        formula: 'Chief Risk Officer or Chief Compliance Officer Departure within 6 Months of SEC Filing',
        category: 'Operational Governance',
        citation: 'Form 8-K Item 5.02: Departure of Directors or Certain Officers',
        benchmark: 'Corporate Governance Risk Indicator: Key compliance departure flags regulatory trouble',
        severity: 'Critical Anomaly' as FlagSeverity,
        impact: 8,
        risk: 'Executive exodus in compliance typically precedes formal regulatory action or fraud revelations.'
      }
    ];

    return payDetails.map((item, i) => {
      const idx = i + 5;
      const code = `PAY-${idx < 10 ? '0' + idx : idx}`;
      return {
        code,
        lens: 'Payments' as IndustryLens,
        category: item.category,
        title: item.title,
        description: `Audits forensic settlement risk: ${item.title.toLowerCase()} against GAAP and scheme rules.`,
        formula: item.formula,
        secDisclosureCitation: item.citation,
        benchmarkRule: item.benchmark,
        defaultSeverity: item.severity,
        scoreImpact: item.impact,
        dataSource: (idx % 2 === 0 ? 'SEC EDGAR (P1)' : 'Forensic Rule (P2)') as DataSourcePriority,
        riskExplanation: item.risk
      };
    });
  })(),

  // ----------------------------------------------------
  // 3. SAAS LENS (SAA-01 to SAA-30)
  // ----------------------------------------------------
  {
    code: 'SAA-01',
    lens: 'SaaS',
    category: 'Revenue Quality',
    title: 'Annual Recurring Revenue (ARR) vs GAAP Revenue Divergence',
    description: 'Reported non-GAAP ARR growth rate exceeds GAAP subscription revenue growth by more than 15 percentage points without backlog reconciliation.',
    formula: 'ΔARR% - ΔGAAP Subscription Revenue% > 15.0%',
    secDisclosureCitation: '10-K Item 7: MD&A Non-GAAP Financial Measures & ASC 606 Subscription Revenue',
    benchmarkRule: 'SEC Non-GAAP Financial Measures Guidance (Regulation G / Item 10(e))',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 8,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Indicates non-binding letters of intent or multi-year contracts being counted as immediate ARR to inflate valuation.'
  },
  {
    code: 'SAA-02',
    lens: 'SaaS',
    category: 'Capitalized Expenses',
    title: 'Internal-Use Software R&D Capitalization Overstatement',
    description: 'Capitalizing routine maintenance and cloud operational engineering as software development assets (ASC 350-40) instead of expensing.',
    formula: 'Capitalized Software / Total R&D Expense > 28.0%',
    secDisclosureCitation: '10-K Note 1: Capitalized Internal-Use Software (us-gaap:CapitalizedComputerSoftwareGross)',
    benchmarkRule: 'SaaS Peer Cohort Net Retention Median: 8.5% - 14.0%',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 7,
    dataSource: 'Forensic Rule (P2)',
    riskExplanation: 'Artificially inflates GAAP operating margins and Adjusted EBITDA by moving payroll expenses into CapEx.'
  },
  {
    code: 'SAA-03',
    lens: 'SaaS',
    category: 'Contract Liabilities',
    title: 'Deferred Revenue Burn vs Contract Asset Inflation (Unbilled A/R)',
    description: 'Current deferred revenue balance decelerates while unbilled contract assets surge, indicating multi-year aggressive billing front-loading.',
    formula: 'ΔUnbilled Contract Assets% / ΔDeferred Revenue% > 2.5',
    secDisclosureCitation: '10-K Note 2: Contract Balances & Remaining Performance Obligations (us-gaap:ContractWithCustomerLiability)',
    benchmarkRule: 'Rule of 40 Enterprise SaaS Baseline: 0.85 - 1.25',
    defaultSeverity: 'Warning',
    scoreImpact: 6,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Borrowing future quarters cash flows; future reported GAAP revenue will hit an abrupt air pocket.'
  },
  {
    code: 'SAA-04',
    lens: 'SaaS',
    category: 'Expense Recognition',
    title: 'Sales Commission Amortization Extension (ASC 340-40 Distortion)',
    description: 'Extending the amortization period for capitalized contract acquisition costs past customer contractual or technological life.',
    formula: 'Amortization Period > 5.5 Years with Average Customer Contract Term < 2.0 Years',
    secDisclosureCitation: '10-K Note 3: Deferred Contract Acquisition Costs (us-gaap:DeferredSalesCommissionsCurrent)',
    benchmarkRule: 'SEC Comment Letter Cohort on ASC 340-40 Amortization Periods',
    defaultSeverity: 'Warning',
    scoreImpact: 5,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Delays sales commission expense recognition, creating phantom current-period margin expansion.'
  },
  ...Array.from({ length: 26 }, (_, i) => {
    const idx = i + 5;
    const codes = `SAA-${idx < 10 ? '0' + idx : idx}`;
    const titles = [
      'Net Retention Rate (NRR) Cohort Definition Smoothing',
      'Stock-Based Compensation (SBC) as % of Revenue Exceeding 25%',
      'Remaining Performance Obligations (RPO) Realization Decay',
      'Professional Services Margin Subsidization (Hidden Discounting)',
      'Customer Churn Concealment via Free Extension Forbearance',
      'Cloud Infrastructure Hosting Cost Reclassification out of COGS',
      'Partner Referral Rebates Reclassified from Contra-Revenue to Sales & Marketing',
      'Multi-Year Enterprise Contract Discounting Clawback Risk',
      'Customer Concentration > 20% in Single Vulnerable Startup Cohort',
      'Software Asset Useful Life Extension from 3 to 7 Years',
      'Goodwill Impairment Delay on Stale M&A Software Acquisitions',
      'Billings vs Free Cash Flow Spread Divergence at Year-End',
      'Sales Rep Quota Attainment Severely Decoupled from GAAP Revenue',
      'Usage-Based Cloud Compute Margin Degradation',
      'Contract Early Termination Penalty Recognition Before Settlement',
      'Sales Commission Clawback Reserve Understatement',
      'Enterprise Software License Audit Revenue Irregularity',
      'Security Breach & SLA Penalty Contingent Liability Concealment',
      'Open Source IP License Infringement Risk Non-Disclosure',
      'Non-GAAP Adjusted Operating Margin Exclusions (Excluding Core OpEx)',
      'Executive Golden Handcuff SBC Acceleration Accrual Omission',
      'Data Privacy GDPR / CCPA Compliance Penalty Under-Accrual',
      'Customer Success Team Cost Reclassification from COGS to Marketing',
      'Unearned Maintenance Revenue Premature Release',
      'API Platform Ecosystem Revenue Share Capitalization',
      'Sudden CTO / Chief Accounting Officer Departure Pre-Audit'
    ];
    return {
      code: codes,
      lens: 'SaaS' as IndustryLens,
      category: idx % 2 === 0 ? 'Revenue & Billings' : 'Operating Quality',
      title: titles[i] || `SaaS Forensic Check ${idx}`,
      description: `Monitors recurring revenue fidelity, R&D capitalization integrity, and contract liability reserves.`,
      formula: `SaaS Forensic Indicator SAA-F${idx} vs Peer Distribution`,
      secDisclosureCitation: `10-K Note ${idx % 5 + 1}: Software Contracts & Intangible Assets`,
      benchmarkRule: `SEC SaaS Peer Baseline P${65 + (i % 30)}`,
      defaultSeverity: (idx === 6 || idx === 11 ? 'Warning' : 'Healthy') as FlagSeverity,
      scoreImpact: 4,
      dataSource: (idx % 3 === 0 ? 'SEC EDGAR (P1)' : 'Forensic Rule (P2)') as DataSourcePriority,
      riskExplanation: 'Protects against recurring revenue fabrications, artificial margin enhancement, and heavy SBC dilution.'
    };
  }),

  // ----------------------------------------------------
  // 4. BANKS LENS (BNK-01 to BNK-30)
  // ----------------------------------------------------
  {
    code: 'BNK-01',
    lens: 'Banks',
    category: 'Credit Quality',
    title: 'Current Expected Credit Losses (CECL) Under-Provisioning',
    description: 'Allowance for Credit Losses (ACL) to Non-Performing Loans ratio declining despite macroeconomic credit deterioration.',
    formula: 'ACL / Non-Performing Loans < 110% (Regional/Commercial Banks)',
    secDisclosureCitation: '10-K Note 4: Allowance for Credit Losses (us-gaap:AllowanceForLoanAndLeaseLosses)',
    benchmarkRule: 'Federal Reserve Comprehensive Capital Analysis and Review (CCAR) Stress Benchmark',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 8,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Conceals deteriorating loan quality; triggers sudden regulatory enforcement and capital raises.'
  },
  {
    code: 'BNK-02',
    lens: 'Banks',
    category: 'Securities Portfolio',
    title: 'Held-to-Maturity (HTM) Unrealized Loss Concealment in OCI',
    description: 'Massive unrealized mark-to-market losses trapped in HTM bond portfolios not reflected in regulatory CET1 capital.',
    formula: 'Unrealized Losses in HTM / Common Equity Tier 1 Capital > 25%',
    secDisclosureCitation: '10-K Note 3: Investment Securities (us-gaap:AvailableForSaleSecuritiesFairValueDisclosure)',
    benchmarkRule: 'Federal Reserve Stress-Test & FDIC Capital Standard',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 9,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Severe insolvency risk if forced to liquidate bonds to meet sudden depositor runoff.'
  },
  {
    code: 'BNK-03',
    lens: 'Banks',
    category: 'Asset Valuation',
    title: 'Level 3 Mark-to-Model Fair Value Asset Inflation',
    description: 'Disproportionately high concentration of Level 3 illiquid assets where valuations rely on internal unobservable management models.',
    formula: 'Level 3 Assets / Total Stockholders Equity > 35%',
    secDisclosureCitation: '10-K Note 18: Fair Value Measurements (us-gaap:FairValueAssetsMeasuredOnRecurringBasis)',
    benchmarkRule: 'SEC Level 3 Valuation Scrutiny Benchmark: > 20%',
    defaultSeverity: 'Warning',
    scoreImpact: 6,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Unobservable internal models mask deep collateral impairments during market stress.'
  },
  ...Array.from({ length: 27 }, (_, i) => {
    const idx = i + 4;
    const codes = `BNK-${idx < 10 ? '0' + idx : idx}`;
    const titles = [
      'Commercial Real Estate (CRE) Office Exposure Over-Concentration',
      'Uninsured Deposit Outflow Acceleration (> 40% of Total Deposits)',
      'Net Interest Margin (NIM) Compression Hidden by Non-Accrual Restructuring',
      'Federal Home Loan Bank (FHLB) Emergency Advance Over-Reliance',
      'Evergreening of Delinquent Loans via Loan Modification Forbearance',
      'Brokered Deposit Cost Inversion vs Core Lending Yield',
      'Mortgage Servicing Rights (MSR) Discount Rate Model Manipulation',
      'Off-Balance Sheet Credit Card Standby Commitment Risks',
      'Loan-to-Deposit Ratio (LDR) Exceeding Prudent Regulatory Guardrails (> 95%)',
      'Credit Default Swap (CDS) Counterparty Exposure Concentration',
      'Subordinated Debt Covenants Approaching Regulatory Breach',
      'Leveraged Buyout (LBO) Syndicated Loan Hanging Debt Inventory',
      'Auto Loan 60-Day Delinquency Surge in Subprime Tranches',
      'Foreign Sovereign Bond Exposure Rating Downgrade Delay',
      'Goodwill Impairment Avoidance on Failed Regional Bank Acquisitions',
      'Repurchase Agreement (Repo) Intraday Liquidity Deficit',
      'Interest Rate Swap Hedge Ineffectiveness Non-Recognition',
      'Litigation Contingency Reserve Deficit for Regulatory Anti-Trust / Compliance',
      'Wealth Management Fiduciary Fee Churning Distortion',
      'Private Equity Capital Call Facility Exposure Concealment',
      'Intercompany Asset Transfers to Shield Troubled Subsidiaries',
      'Capital Conservation Buffer Degradation toward Tier 1 Minimum',
      'Deposit Beta Assumption Distortion in ALM Rate Sensitivity Models',
      'Cryptocurrency Exchange Deposit Concentration Exposure',
      'Sudden Departure of Chief Risk Officer or Audit Committee Chairman',
      'Regulatory Cease-and-Desist Non-Public Inquiry Footnote Omission',
      'Non-Interest Expense Spike in Regulatory Defense & Outside Legal Counsel'
    ];
    return {
      code: codes,
      lens: 'Banks' as IndustryLens,
      category: idx % 2 === 0 ? 'Capital & Solvency' : 'Credit & Liquidity',
      title: titles[i] || `Bank Forensic Check ${idx}`,
      description: `Audits balance sheet liquidity, loan loss allowances, and off-balance sheet exposure.`,
      formula: `Bank Regulatory Stress Indicator BNK-S${idx} vs OCC / Fed Standard`,
      secDisclosureCitation: `10-K Note ${idx % 6 + 1}: Banking Financial Assets & Liabilities`,
      benchmarkRule: `Federal Reserve Bank Call Report Benchmark P${70 + (i % 25)}`,
      defaultSeverity: (idx === 4 || idx === 8 ? 'Warning' : 'Healthy') as FlagSeverity,
      scoreImpact: 4,
      dataSource: (idx % 2 === 0 ? 'SEC EDGAR (P1)' : 'Forensic Rule (P2)') as DataSourcePriority,
      riskExplanation: 'Monitors systemic risk, interest rate vulnerability, and capital adequacy.'
    };
  }),

  // ----------------------------------------------------
  // 5. TECH HARDWARE LENS (HRD-01 to HRD-30)
  // ----------------------------------------------------
  {
    code: 'HRD-01',
    lens: 'Tech Hardware',
    category: 'Inventory & Obsolescence',
    title: 'Semiconductor / Component Obsolescence LCM Reserve Deficit',
    description: 'Inventory holding times surge across legacy node components without proportional Lower-of-Cost-or-Market write-downs.',
    formula: 'Days Inventory Outstanding (DIO) > 130 days with Reserve < 4% of Gross Inventory',
    secDisclosureCitation: '10-K Note 3: Inventories (us-gaap:InventoryWorkInProcessAndFinishedGoods)',
    benchmarkRule: 'SEC Tech Hardware Peer Cohort Baseline P85',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 7,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'High exposure to multi-hundred million dollar inventory write-offs when next-gen architecture launches.'
  },
  {
    code: 'HRD-02',
    lens: 'Tech Hardware',
    category: 'Warranty & Obligations',
    title: 'Product Warranty Reserve Suppression vs Unit Shipments',
    description: 'Warranty liability balance drops even as hardware shipments or field failure return rates rise.',
    formula: 'Warranty Accruals / Hardware Revenue < 1.1% while Shipments Grow > 15%',
    secDisclosureCitation: '10-K Note 8: Warranties and Guarantees (us-gaap:ProductWarrantyAccrual)',
    benchmarkRule: 'Hardware Industry Warranty Median: 1.8% - 2.5%',
    defaultSeverity: 'Warning',
    scoreImpact: 5,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Suppresses current operating expenses to meet earnings targets, deferring inevitable product recall costs.'
  },
  {
    code: 'HRD-03',
    lens: 'Tech Hardware',
    category: 'Supply Chain & Commitments',
    title: 'Off-Balance-Sheet Non-Cancelable Foundry Take-or-Pay Commitments',
    description: 'Onerous wafer fabrication advance commitments unrecorded on balance sheet despite collapsing end-market consumer electronics demand.',
    formula: 'Take-or-Pay Purchase Commitments / Operating Cash Flow > 180%',
    secDisclosureCitation: '10-K Item 8 Note 12: Commitments & Contingencies (us-gaap:UnrecordedUnconditionalPurchaseObligation)',
    benchmarkRule: 'Semiconductor Foundry Yield & Capital Intensity Baseline',
    defaultSeverity: 'Warning',
    scoreImpact: 6,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Creates sudden cash outflows or liquidated damages liabilities when demand falls short of contracted volume.'
  },
  ...Array.from({ length: 27 }, (_, i) => {
    const idx = i + 4;
    const codes = `HRD-${idx < 10 ? '0' + idx : idx}`;
    const titles = [
      'Tooling & Masking Equipment Depreciation Extension (3y to 7y)',
      'Channel Inventory Gray Market Stacking Discrepancy',
      'Contract Manufacturer (EMS) Purchase Advance Impairment Delay',
      'Patent & Technology Intangible Asset Over-Valuation',
      'Billings Ahead of Hardware Acceptance Milestones',
      'Component Supply Prepayment Non-Recovery Risk',
      'Rare Earth & Critical Mineral Price Volatility Hedging Ineffectiveness',
      'Restructuring Charge Recurrence (Treating Routine OpEx as Non-Recurring)',
      'Subcontractor Labor & Environmental Compliance Liability Reserve Deficit',
      'Factory Under-Utilization Cost Capitalization into Ending Inventory',
      'Hardware Maintenance Support Deferred Revenue Siphoning',
      'OEM Rebate Recognition Ahead of Sell-Through Confirmation',
      'Cleanroom Fab Capital Expenditure Overstatement',
      'Firmware Software Capitalization vs Expensed Hardware Driver R&D',
      'End-of-Life (EOL) Spare Parts Liquidation Loss Deferral',
      'Foreign Assembly Facility Political Risk & Tariff Withholding Non-Accrual',
      'Demonstration & Evaluation Unit Hardware Asset Overstatement',
      'Customer Credit Limit Overextension in Emerging Hardware Markets',
      'Government Defense Hardware Contract Cost Audit Liability',
      'Hazardous Material E-Waste Disposal Environmental Contingency',
      'Patent Infringement Injunction Escrow Reserve Under-Provision',
      'Chiplet Packaging Yield Defect Cost Reclassification',
      'Customer Acceptance Contingency Side-Agreement Concealment',
      'Long-Term Supply Agreement Penalty Omission in Footnotes',
      'Hardware Gross Margin Volatility Smoothing via Scrap Reserve Releases',
      'OEM Volume Licensing Minimum Guarantee Audit Discrepancies',
      'Chief Technology Officer / Fab Operations Executive High Churn'
    ];
    return {
      code: codes,
      lens: 'Tech Hardware' as IndustryLens,
      category: idx % 2 === 0 ? 'Manufacturing & Costing' : 'Supply & Assets',
      title: titles[i] || `Hardware Forensic Check ${idx}`,
      description: `Monitors manufacturing yield, supply chain commitments, and depreciation policies.`,
      formula: `Hardware Forensic Metric HRD-M${idx} vs Industry Norm`,
      secDisclosureCitation: `10-K Note ${idx % 5 + 1}: Hardware Operations & Commitments`,
      benchmarkRule: `SEC Hardware Manufacturing Baseline P${60 + (i % 30)}`,
      defaultSeverity: (idx === 5 || idx === 10 ? 'Warning' : 'Healthy') as FlagSeverity,
      scoreImpact: 3,
      dataSource: (idx % 2 === 0 ? 'SEC EDGAR (P1)' : 'Forensic Rule (P2)') as DataSourcePriority,
      riskExplanation: 'Verifies manufacturing cost allocation, asset impairment triggers, and warranty reserves.'
    };
  }),

  // ----------------------------------------------------
  // 6. HEALTHCARE LENS (HLT-01 to HLT-30)
  // ----------------------------------------------------
  {
    code: 'HLT-01',
    lens: 'Healthcare',
    category: 'R&D and Intangibles',
    title: 'Clinical Trial R&D Capitalization vs Compulsory Expense',
    description: 'Improperly capitalizing Phase I/II clinical trial expenditures into intangible assets before FDA regulatory approval is achieved.',
    formula: 'Capitalized Pre-Approval Drug R&D > $0 (ASC 730 Violation)',
    secDisclosureCitation: '10-K Note 1: Research and Development (us-gaap:ResearchAndDevelopmentExpense)',
    benchmarkRule: 'SEC Industry Guide 3 / Life Sciences Accounting Guide',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 8,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Strict violation of ASC 730; creates fictitious intangible assets destined for total write-off upon trial failure.'
  },
  {
    code: 'HLT-02',
    lens: 'Healthcare',
    category: 'Accounts Receivable',
    title: 'Implicit Price Concessions & Hospital Bad Debt Allowance Deficit',
    description: 'Failing to record adequate allowances for uninsured/underinsured patient accounts receivable under ASC 606 implicit concessions.',
    formula: 'Contractual Allowances / Gross Patient Service Revenue < 45% (Health Systems)',
    secDisclosureCitation: '10-K Note 2: Patient Accounts Receivable & Credit Loss Allowance',
    benchmarkRule: 'Healthcare Provider Accounts Receivable Peer Benchmark',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 7,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Grossly overstates patient receivables that will never be collected from payers.'
  },
  {
    code: 'HLT-03',
    lens: 'Healthcare',
    category: 'Regulatory Contingencies',
    title: 'Department of Justice / False Claims Act Settlement Reserve Deficit',
    description: 'Failure to accrue probable and estimable litigation liabilities following receipt of civil investigative demands (CIDs) or subpoena.',
    formula: 'DOJ CID Disclosed in Footnote with $0 Accrued Loss Reserve',
    secDisclosureCitation: '10-K Note 14: Legal Proceedings & Government Inquiries (ASC 450)',
    benchmarkRule: 'SEC Contingent Liability Disclosure Audit Standard',
    defaultSeverity: 'Warning',
    scoreImpact: 6,
    dataSource: 'Forensic Rule (P2)',
    riskExplanation: 'Leaves investors blind to pending nine-figure False Claims Act settlements and corporate integrity agreements.'
  },
  ...Array.from({ length: 27 }, (_, i) => {
    const idx = i + 4;
    const codes = `HLT-${idx < 10 ? '0' + idx : idx}`;
    const titles = [
      'Goodwill Impairment Avoidance on Failed Biotech Pipeline Acquisitions',
      'Medicare & Medicaid Clawback Cost Settlement Reserve Deficit',
      'Specialty Pharmacy Channel Stuffing at Year-End Rebate Deadlines',
      'In-Process R&D (IPR&D) Impairment Delay on Terminated Molecules',
      'Medical Malpractice Actuarial Reserve Discount Rate Aggressiveness',
      'Medical Device 510(k) Recall Liability Under-Accrual',
      'Opioid / Controlled Substance Distribution Settlement Escrow Shortfall',
      'Physician Practice Management (PPM) Unconsolidated Entity Risk',
      'Biotech Milestone Payment Premature Revenue Recognition',
      'Patent Cliff Expiry Margin Disguise via Short-Term Price Hikes',
      'Healthcare Payer Medical Loss Ratio (MLR) Retroactive Rebate Understatement',
      'Laboratory Diagnostic Billing Denial Rate Divergence',
      'Controlled Substance Storage Compliance Fine Reserve Omission',
      'Clinical Trial Patient Enrollment Fraud Anomaly',
      'Co-Pay Assistance Charitable Contribution Kickback Scrutiny',
      'Healthcare IT Software Implementation Cost Capitalization',
      'Off-Label Marketing FDA Warning Letter Footnote Concealment',
      'Health Insurance Prior Authorization Denial Reversal Reserve',
      'Hospital Equipment Lease Capitalization vs Maintenance Reclassification',
      'Blood Product / Biologic Shelf-Life Perishability Write-Down Delay',
      'Nursing Staff Overtime Cost Accrual Omission at Period-End',
      'Out-of-Network Balance Billing Surprise Act Liability Gap',
      'Senior Living Facility Occupancy Rate Calculation Distortion',
      'Medical Device Depreciation Acceleration Avoidance',
      'Biotech Share Dilution & Warrant Derivative Fair Value Distortion',
      'Medical Director Consulting Expense Reclassification',
      'Chief Medical Officer / Head of Regulatory Affairs Sudden Resignation'
    ];
    return {
      code: codes,
      lens: 'Healthcare' as IndustryLens,
      category: idx % 2 === 0 ? 'Clinical & Regulatory' : 'Payer & Valuation',
      title: titles[i] || `Healthcare Forensic Check ${idx}`,
      description: `Monitors drug pipeline accounting, clinical trial expenses, and healthcare billing reserves.`,
      formula: `Healthcare Forensic Metric HLT-P${idx} vs Industry Standard`,
      secDisclosureCitation: `10-K Note ${idx % 5 + 1}: Life Sciences & Healthcare Disclosures`,
      benchmarkRule: `SEC Healthcare & Biotech Peer Baseline P${60 + (i % 30)}`,
      defaultSeverity: (idx === 5 || idx === 11 ? 'Warning' : 'Healthy') as FlagSeverity,
      scoreImpact: 3,
      dataSource: (idx % 2 === 0 ? 'SEC EDGAR (P1)' : 'Forensic Rule (P2)') as DataSourcePriority,
      riskExplanation: 'Protects against unaccrued government fines, clinical failure asset write-downs, and Medicare clawbacks.'
    };
  }),

  // ----------------------------------------------------
  // 7. AI & DEEP TECH LENS (AID-01 to AID-30)
  // ----------------------------------------------------
  {
    code: 'AID-01',
    lens: 'AI/Deep Tech',
    category: 'Depreciation Distortion',
    title: 'GPU Cluster & AI Server Useful Life Extension (3-Year to 6-Year)',
    description: 'Management extends the accounting depreciable life of dense GPU compute clusters past physical thermal and technological obsolescence.',
    formula: 'Server Depreciable Life > 4.5 Years with Compute Utilization > 85%',
    secDisclosureCitation: '10-K Note 1: Property, Plant and Equipment - Useful Lives (us-gaap:PropertyPlantAndEquipmentUsefulLife)',
    benchmarkRule: 'Hyperscaler Cloud Server Useful Life Benchmark: 3.0 - 4.0 Years',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 9,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Lowers annual depreciation by 40-50%, artificially boosting reported net income while holding obsolete silicon at full book value.'
  },
  {
    code: 'AID-02',
    lens: 'AI/Deep Tech',
    category: 'Revenue Quality',
    title: 'Circular Round-Trip GPU Cloud Revenue Swaps',
    description: 'Selling GPU compute capacity or cloud credits to AI startups funded by the vendor’s own balance sheet investment arm without commercial substance.',
    formula: 'Startup Equity Investment Amount ≈ Startup Cloud Contract Value (within ±10%)',
    secDisclosureCitation: '10-K Note 15: Related Party Transactions & Strategic Investments',
    benchmarkRule: 'SEC Staff Accounting Bulletin Topic 5.A: Round-Trip Transactions',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 9,
    dataSource: 'Forensic Rule (P2)',
    riskExplanation: 'Fictitious round-trip revenue laundering; vendor books revenue funded by its own balance sheet equity disbursements.'
  },
  {
    code: 'AID-03',
    lens: 'AI/Deep Tech',
    category: 'Intangibles & Training',
    title: 'Foundation Model Pre-Training Compute & Data Licensing Capitalization',
    description: 'Capitalizing hundreds of millions in raw GPU electricity and scraped synthetic dataset licensing costs as indefinite-lived intangible assets.',
    formula: 'Capitalized AI Model Weights / Total AI CapEx > 30%',
    secDisclosureCitation: '10-K Note 6: Intangible Assets & R&D (us-gaap:IntangibleAssetsNetExcludingGoodwill)',
    benchmarkRule: 'ASC 350-40 & FASB EITF Frontier Model Accounting Guidance',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 8,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Violates core R&D expensing principles; model weights suffer near-instant obsolescence as next-gen foundation architectures emerge.'
  },
  {
    code: 'AID-04',
    lens: 'AI/Deep Tech',
    category: 'Off-Balance Commitments',
    title: 'Off-Balance-Sheet Hyperscale Power Purchase & Data Center Leases',
    description: 'Unrecorded multi-gigawatt energy take-or-pay purchase agreements and specialized data center shell commitments.',
    formula: 'Power PPA Unconditional Commitments / Total Debt > 40%',
    secDisclosureCitation: '10-K Item 8 Note 11: Power Purchase Agreements & Infrastructure Obligations',
    benchmarkRule: 'AI Compute Infrastructure Power & PUE Benchmark',
    defaultSeverity: 'Warning',
    scoreImpact: 6,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Creates unhedged cash draw commitments if model inference unit economics turn negative.'
  },
  ...Array.from({ length: 26 }, (_, i) => {
    const idx = i + 5;
    const codes = `AID-${idx < 10 ? '0' + idx : idx}`;
    const titles = [
      'AI Software Seat Cannibalization Hidden by Token Consumption Bundling',
      'Synthetic AI Customer Churn Disguise via Subsidized Pilot Extensions',
      'GPU Cloud Capacity Utilization Rate Smoothing',
      'Model Weight Fair Value Level 3 Measurement Distortions',
      'Training Data Copyright Lawsuit Contingent Liability Omission (ASC 450)',
      'Autonomous Vehicle / Robotics Fleet Accident Contingency Under-Accrual',
      'Specialized AI ASIC Tape-Out Mask Failure Cost Deferral',
      'Liquid Cooling Data Center Refurbishment CapEx vs OpEx Reclassification',
      'Quantum Computing Grant Revenue Premature Completion Recognition',
      'Enterprise AI POC Revenue Booked as Non-Cancellable Subscriptions',
      'High-Bandwidth Memory (HBM) Supply Squeeze Prepayment Impairment Delay',
      'AI Cloud Token Deflation Margin Erosion Non-Disclosure',
      'Co-Location Facility Power Capacity Sub-Leasing Arbitrage Distortion',
      'AI Agent Hallucination Liability & Enterprise Indemnification Reserve Gap',
      'Foundational LLM Safety Red-Teaming Compliance Provision Understatement',
      'Compute Credit Barter Accounting with Academic Institutions',
      'Edge Hardware Thermal Failure Return Reserve Inadequacy',
      'AI Talent Retention Golden Handcuffs Amortization Extension',
      'Deepfake Fraud Detection SLA Breach Indemnification Gap',
      'Data Annotation & Human-in-the-Loop Cost Reclassification out of COGS',
      'Custom Silicon Development Milestone Fraud Anomaly',
      'AI Ecosystem Venture Fund Unrealized Gain Inflation in Net Income',
      'Cloud Egress Bandwidth Cost Capitalization Violation',
      'AI Platform API Latency Penalty Contingent Liability Non-Accrual',
      'Semiconductor Export Restriction Inventory Stranding Risk',
      'Chief AI Scientist / VP of Compute Infrastructure Sudden Departure'
    ];
    return {
      code: codes,
      lens: 'AI/Deep Tech' as IndustryLens,
      category: idx % 2 === 0 ? 'Silicon & Compute' : 'Model & Revenue',
      title: titles[i] || `AI Forensic Check ${idx}`,
      description: `Monitors GPU cluster depreciation, model weight capitalization, and compute commitments.`,
      formula: `AI Forensic Metric AID-C${idx} vs Hyperscaler Baseline`,
      secDisclosureCitation: `10-K Note ${idx % 5 + 1}: AI Infrastructure & Compute Assets`,
      benchmarkRule: `SEC AI Sector Capitalization Baseline P${60 + (i % 30)}`,
      defaultSeverity: (idx === 6 || idx === 9 ? 'Warning' : 'Healthy') as FlagSeverity,
      scoreImpact: 4,
      dataSource: (idx % 2 === 0 ? 'SEC EDGAR (P1)' : 'Forensic Rule (P2)') as DataSourcePriority,
      riskExplanation: 'Safeguards against artificial compute capitalization, round-tripping, and aggressive server useful-life assumptions.'
    };
  })
];
