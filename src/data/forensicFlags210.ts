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
  // 1. RETAIL LENS (RET-01 to RET-30)
  // ----------------------------------------------------
  {
    code: 'RET-01',
    lens: 'Retail',
    category: 'Inventory Quality',
    title: 'Inventory Growth Exceeding Sales Growth (Divergence)',
    description: 'Inventory inventory build-up outpaces revenue growth for 2 consecutive reporting periods, signaling phantom stock or unsellable inventory.',
    formula: 'ΔInventory% - ΔRevenue% > 8.0%',
    secDisclosureCitation: '10-K Item 8 Note 4: Inventories (us-gaap:InventoryGross)',
    benchmarkRule: 'Kaggle Retail Cohort P90 Divergence: > 7.2%',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 8,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'High risk of deferred markdown losses and subsequent gross margin collapse in upcoming quarters.'
  },
  {
    code: 'RET-02',
    lens: 'Retail',
    category: 'Revenue Recognition',
    title: 'Quarter-End Channel Stuffing & Bill-and-Hold Surge',
    description: 'Abnormal spike in Days Sales Outstanding (DSO) during the final two weeks of fiscal quarter without commensurate cash collection.',
    formula: 'Quarter-End DSO - 3-Year Avg DSO > 14 days',
    secDisclosureCitation: '10-K Note 2: Revenue Recognition & Contract Assets (us-gaap:AccountsReceivableNetCurrent)',
    benchmarkRule: 'Kaggle Peer Baseline: DSO deviation > 11.5 days',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 7,
    dataSource: 'Forensic Rule (P2)',
    riskExplanation: 'Indicates management pushing unsold products into retailer channels with generous return side-agreements.'
  },
  {
    code: 'RET-03',
    lens: 'Retail',
    category: 'Expense Recognition',
    title: 'Vendor Rebate Capitalization in Inventory',
    description: 'Improper deferral of vendor allowances and promotional credits into ending inventory to artificially inflate current gross margins.',
    formula: 'Vendor Rebates / COGS > Historical Trend + 2.5σ',
    secDisclosureCitation: '10-K Note 1: Vendor Allowances & Cost of Sales (us-gaap:CostOfGoodsAndServicesSold)',
    benchmarkRule: 'SEC Accounting & Auditing Enforcement Release (AAER) Precedent #3812',
    defaultSeverity: 'Warning',
    scoreImpact: 5,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Violates ASC 606 / ASC 705; premature margin recognition masks true retail cost inflation.'
  },
  {
    code: 'RET-04',
    lens: 'Retail',
    category: 'Balance Sheet Off-Balance',
    title: 'Off-Balance-Sheet Store Lease Liability Concealment',
    description: 'Discrepancies in operating lease liabilities vs right-of-use asset disclosures under ASC 842 store footprint revisions.',
    formula: 'ROU Assets / Operating Lease Liabilities < 0.88',
    secDisclosureCitation: '10-K Item 8 Note 9: Leases (us-gaap:OperatingLeaseLiability)',
    benchmarkRule: 'Kaggle Retail Real Estate Benchmark: Ratio between 0.96 and 1.04',
    defaultSeverity: 'Warning',
    scoreImpact: 4,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Understates committed fixed rent obligations, artificially deflating leverage ratios for debt covenants.'
  },
  {
    code: 'RET-05',
    lens: 'Retail',
    category: 'Operating Metrics',
    title: 'Same-Store Sales (SSS) Footnote Definition Revision',
    description: 'Management secretly altering SSS calculation methodology by excluding underperforming stores or retroactively redefining store maturity.',
    formula: 'Footnote Text Levenshtein Distance > 35% across consecutive 10-Ks',
    secDisclosureCitation: '10-K Item 7: MD&A Selected Operational Metrics',
    benchmarkRule: 'SEC Filing NLP Disclosure Consistency Model',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 6,
    dataSource: 'Forensic Rule (P2)',
    riskExplanation: 'Hides true organic same-store sales decline by cherry-picking store cohorts.'
  },
  {
    code: 'RET-06',
    lens: 'Retail',
    category: 'Working Capital',
    title: 'Lower of Cost or Net Realizable Value (NRV) Reserve Deficit',
    description: 'Inadequate inventory write-down reserves relative to aging inventory and competitive apparel/electronics markdown cycles.',
    formula: 'Inventory Reserve % of Gross Inventory < 1.8% while DIO > 95 days',
    secDisclosureCitation: '10-K Note 4: Inventory Valuation Allowance (us-gaap:InventoryValuationReserves)',
    benchmarkRule: 'Kaggle Retail Liquidation Benchmark Baseline: 3.8% reserve requirement',
    defaultSeverity: 'Warning',
    scoreImpact: 4,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Delayed write-downs leave overvalued inventory assets on balance sheet awaiting emergency liquidation.'
  },
  {
    code: 'RET-07',
    lens: 'Retail',
    category: 'Cash Flow Quality',
    title: 'Customer Return Reserve Under-Accrual',
    description: 'Return liability reserve declining as percentage of gross sales during high-volume e-commerce promotional quarters.',
    formula: 'Returns Reserve / Gross Merchandise Value < 1.2% (E-Commerce)',
    secDisclosureCitation: '10-K Note 2: Contract Liabilities & Customer Refunds (us-gaap:CustomerRefundLiability)',
    benchmarkRule: 'Kaggle Retail E-Commerce Return Rate Baseline: 8.5% - 14.0%',
    defaultSeverity: 'Warning',
    scoreImpact: 4,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Artificially accelerates reported net sales before inevitable post-holiday product returns materialise.'
  },
  {
    code: 'RET-08',
    lens: 'Retail',
    category: 'Working Capital',
    title: 'Supplier Payable Stretch (Unilateral DPO Extension)',
    description: 'Days Payable Outstanding (DPO) artificially extended past 120 days via supply chain financing / reverse factoring without clear disclosure.',
    formula: 'DPO - Peer Median DPO > 35 days',
    secDisclosureCitation: '10-K Note 6: Accounts Payable & Supply Chain Financing Disclosures',
    benchmarkRule: 'Yahoo Finance Supplier Credit Health Metric',
    defaultSeverity: 'Warning',
    scoreImpact: 5,
    dataSource: 'Yahoo Finance (P3)',
    riskExplanation: 'Masks operational cash burn by turning short-term vendor credit into opaque unrated bank debt.'
  },
  {
    code: 'RET-09',
    lens: 'Retail',
    category: 'Asset Valuation',
    title: 'Store Impairment Delay on Chronic Loss-Making Units',
    description: 'Carrying value of leasehold improvements not written down despite continuous negative cash flows at store-level cash generating units (CGUs).',
    formula: 'Impairment Expense / Gross PP&E < 0.2% with negative 4-quarter store EBITDA',
    secDisclosureCitation: '10-K Note 7: Property and Store Equipment (us-gaap:AssetImpairmentCharges)',
    benchmarkRule: 'ASC 360 Long-Lived Asset Impairment Trigger',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 6,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Balance sheet overstatement; inevitable abrupt multi-hundred million dollar non-cash write-downs.'
  },
  {
    code: 'RET-10',
    lens: 'Retail',
    category: 'Revenue Recognition',
    title: 'Gift Card Breakage Revenue Premature Acceleration',
    description: 'Recognizing unredeemed gift certificate breakage income well before historical redemption patterns expire.',
    formula: 'Breakage Revenue / Total Unredeemed Gift Card Balances > 28%',
    secDisclosureCitation: '10-K Note 2: Gift Card Liability & Breakage (us-gaap:ContractWithCustomerLiabilityCurrent)',
    benchmarkRule: 'ASC 606-10-55 Breakage Recognition Norm: 8% - 14%',
    defaultSeverity: 'Healthy',
    scoreImpact: 3,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Boosts earnings during weak sales quarters by exhausting deferred revenue buffer.'
  },
  {
    code: 'RET-11',
    lens: 'Retail',
    category: 'Inventory Quality',
    title: 'Shrinkage / Inventory Theft Reserve Compression',
    description: 'Artificially suppressing estimated inventory shrinkage and store theft accruals to boost reported gross margin.',
    formula: 'Inventory Shrink Reserve / Gross Inventory < 0.4% with Gross Margin > Peer Median',
    secDisclosureCitation: '10-K Note 4: Inventories & Shrinkage Allowances',
    benchmarkRule: 'National Retail Federation (NRF) Shrinkage Benchmark: 1.4% - 1.6%',
    defaultSeverity: 'Warning',
    scoreImpact: 5,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Unrecorded inventory phantom losses will surface abruptly upon physical wall-to-wall cycle counts.'
  },
  {
    code: 'RET-12',
    lens: 'Retail',
    category: 'Expense Recognition',
    title: 'Freight & Inbound Logistics Capitalization in Inventory',
    description: 'Deferring ocean and trucking shipping freight expenses into capitalized inventory rather than expensing in COGS.',
    formula: 'Capitalized Freight in Ending Inventory / Total Inbound Freight > 35%',
    secDisclosureCitation: '10-K Note 1: Cost of Sales & Inventory Capitalization Policies',
    benchmarkRule: 'Retail Logistics Standard: Capitalized portion strictly proportional to inventory turns',
    defaultSeverity: 'Warning',
    scoreImpact: 4,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Artificially inflates reported gross margins while building an invisible future margin headwind.'
  },
  {
    code: 'RET-13',
    lens: 'Retail',
    category: 'Expense Recognition',
    title: 'Direct-to-Consumer Customer Acquisition Cost (CAC) Capitalization',
    description: 'Capitalizing performance digital marketing (Google/Meta ad spend) as intangible customer list assets rather than period SG&A.',
    formula: 'Capitalized Customer Acquisition / Total Marketing Spend > 15%',
    secDisclosureCitation: '10-K Note 5: Intangible Assets & Customer Acquisition Costs',
    benchmarkRule: 'ASC 340-20 Advertising Cost Expensing: 0% capitalization allowable for direct response marketing',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 7,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Direct GAAP violation concealing operating cash burn and true customer unit economics.'
  },
  {
    code: 'RET-14',
    lens: 'Retail',
    category: 'Revenue Recognition',
    title: 'Loyalty Points Redemption Liability Deficit',
    description: 'Under-reserving for outstanding customer loyalty reward points or aggressively inflating breakage expectations.',
    formula: 'Loyalty Breakage Assumption > 40% or Liability / Points Outstanding < Historical Cost',
    secDisclosureCitation: '10-K Note 2: Customer Loyalty Program Liabilities (ASC 606)',
    benchmarkRule: 'ASC 606 Standalone Selling Price Allocation: Historical redemption pattern 70% - 85%',
    defaultSeverity: 'Warning',
    scoreImpact: 4,
    dataSource: 'Forensic Rule (P2)',
    riskExplanation: 'Understates promotional liabilities; inevitable future revenue drag when points are redeemed.'
  },
  {
    code: 'RET-15',
    lens: 'Retail',
    category: 'Expense Recognition',
    title: 'Promotional Discount Deferred Loss Shifting',
    description: 'Shifting clearance markdown losses across fiscal year-end boundaries into subsequent fiscal quarters.',
    formula: 'Markdown Reserves / Promotional Sales Volume < 2.0% in Q4',
    secDisclosureCitation: '10-K Item 7: MD&A Retail Pricing & Promotional Allowances',
    benchmarkRule: 'Retail Holiday Cycle Markdown Norm: 5.5% - 8.0%',
    defaultSeverity: 'Warning',
    scoreImpact: 5,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Pumps fiscal year-end EPS to meet executive bonus targets at the expense of next year profitability.'
  },
  {
    code: 'RET-16',
    lens: 'Retail',
    category: 'Asset Valuation',
    title: 'Private Label Trademark Goodwill Non-Impairment',
    description: 'Failing to write down acquired private label retail brand goodwill despite consistent market share loss to national brands.',
    formula: 'Private Label Brand Carrying Value / Brand Segment EBITDA > 6.0x with Declining Sales',
    secDisclosureCitation: '10-K Note 6: Goodwill and Acquired Intangible Assets (ASC 350)',
    benchmarkRule: 'ASC 350 Annual Qualitative Goodwill Assessment Trigger',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 6,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Imminent sudden multi-hundred million dollar non-cash goodwill impairment charge.'
  },
  {
    code: 'RET-17',
    lens: 'Retail',
    category: 'Asset Valuation',
    title: 'Cross-Dock Distribution Facility Under-Depreciation',
    description: 'Stretching useful depreciation lives of automated fulfillment robotics and conveyor systems far beyond economic obsolescence.',
    formula: 'Automated Fulfillment Center Depreciable Life > 25 Years',
    secDisclosureCitation: '10-K Note 7: Property, Plant and Equipment (us-gaap:PropertyPlantAndEquipmentUsefulLife)',
    benchmarkRule: 'Logistics Automation Standard Useful Life: 7 - 12 Years',
    defaultSeverity: 'Warning',
    scoreImpact: 3,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Depresses annual depreciation expense, artificially inflating EBITDA and net earnings.'
  },
  {
    code: 'RET-18',
    lens: 'Retail',
    category: 'Working Capital',
    title: 'Reverse Logistics Warranty Provision Understatement',
    description: 'Under-accruing for warranty repair and return processing costs on high-ticket consumer electronics.',
    formula: 'Warranty & Return Accrual / Electronics & Appliance Sales < 1.0%',
    secDisclosureCitation: '10-K Note 8: Product Warranties & Extended Service Contracts',
    benchmarkRule: 'Consumer Durable Return & Defect Baseline: 2.5% - 4.2%',
    defaultSeverity: 'Warning',
    scoreImpact: 4,
    dataSource: 'Forensic Rule (P2)',
    riskExplanation: 'Understated cost of sales and hidden cash outflows during warranty claims seasons.'
  },
  {
    code: 'RET-19',
    lens: 'Retail',
    category: 'Cash Flow Quality',
    title: 'Third-Party Marketplace Merchant Float Misclassification',
    description: 'Commingling marketplace 3P seller payout float with unrestricted operating cash balances to report higher OCF.',
    formula: 'Marketplace Escrow Funds / Total Operating Cash Flow > 20%',
    secDisclosureCitation: '10-K Note 3: Restricted Cash and Marketplace Settlement Payables',
    benchmarkRule: 'ASC 230 Operating vs Financing Cash Flow Classification: Restricted cash segregation required',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 7,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Severe liquidity illusion; operating cash flow is inflated by liabilities owed to third-party merchants.'
  },
  {
    code: 'RET-20',
    lens: 'Retail',
    category: 'Working Capital',
    title: 'Uncollected Credit Card Chargeback Reserve Inadequacy',
    description: 'Failing to provision for digital fraud and disputed transactions in online retail channels.',
    formula: 'Chargeback Allowance / Card-Not-Present Sales < 0.25%',
    secDisclosureCitation: '10-K Note 4: Accounts Receivable & Fraud Allowances',
    benchmarkRule: 'Card Dispute Threshold Baseline: 0.65% - 0.90%',
    defaultSeverity: 'Warning',
    scoreImpact: 4,
    dataSource: 'Forensic Rule (P2)',
    riskExplanation: 'Sudden credit card processing network fines and uncollectible receivable write-offs.'
  },
  {
    code: 'RET-21',
    lens: 'Retail',
    category: 'Expense Recognition',
    title: 'Omnichannel Fulfillment Cost Allocation Distortion',
    description: 'Misclassifying last-mile home delivery and fulfillment center picking labor as administrative expenses to inflate gross margin.',
    formula: 'Store-to-Door Delivery Costs Allocated to SG&A instead of COGS',
    secDisclosureCitation: '10-K Note 1: Cost of Sales Classification Policies (ASC 705)',
    benchmarkRule: 'ASC 705 Cost of Sales Presentation: Fulfillment costs must be consistently classified in Gross Profit',
    defaultSeverity: 'Warning',
    scoreImpact: 5,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Artificially elevates reported gross profit margin, confusing peer comparisons and margin analysis.'
  },
  {
    code: 'RET-22',
    lens: 'Retail',
    category: 'Inventory Quality',
    title: 'Seasonal Inventory Aging Threshold Extension',
    description: 'Management altering the internal definition of slow-moving inventory to avoid recording required lower-of-cost-or-market reserves.',
    formula: 'Aging Threshold for Clearance Markdown Extended from 90 Days to 180+ Days',
    secDisclosureCitation: '10-K Note 4: Inventories - Valuation Reserves Methodology',
    benchmarkRule: 'Apparel Retail Seasonal Lifecycle: 60 - 90 Days per collection',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 6,
    dataSource: 'Forensic Rule (P2)',
    riskExplanation: 'Accumulates stale off-season inventory at full cost, setting up catastrophic future liquidations.'
  },
  {
    code: 'RET-23',
    lens: 'Retail',
    category: 'Expense Recognition',
    title: 'Store Pre-Opening Cost Capitalization Violation',
    description: 'Capitalizing store staff training, promotional opening parties, and pre-occupancy lease costs into building PP&E.',
    formula: 'Pre-Opening Labor & Rent Capitalized / New Store CapEx > 12%',
    secDisclosureCitation: '10-K Note 7: Property, Plant & Equipment - Capitalized Project Costs',
    benchmarkRule: 'ASC 720-15 Start-Up Costs: Pre-opening costs must be expensed as incurred',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 6,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Direct violation of ASC 720-15; artificially depresses immediate operating expenses for expanding retailers.'
  },
  {
    code: 'RET-24',
    lens: 'Retail',
    category: 'Revenue Recognition',
    title: 'Sale-Leaseback Gain Premature Flow-Through',
    description: 'Immediately recognizing high gains from selling distribution centers or prime store real estate without proper ASC 842 leaseback deferral.',
    formula: 'Gain on Real Estate Sale-Leaseback Recognized Immediately in Operating Income',
    secDisclosureCitation: '10-K Note 9: Leases - Sale and Leaseback Transactions (ASC 842-40)',
    benchmarkRule: 'ASC 842-40 Substantial Leaseback Gain Amortization Rule',
    defaultSeverity: 'Warning',
    scoreImpact: 5,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'One-time asset sale profit masks deteriorating underlying retail store operational economics.'
  },
  {
    code: 'RET-25',
    lens: 'Retail',
    category: 'Revenue Recognition',
    title: 'Vendor Volume Incentive Target Fabrication Risk',
    description: 'Accruing speculative volume discount rebates from suppliers before minimum purchase quantity thresholds have been legally met.',
    formula: 'Accrued Unbilled Vendor Rebates / Operating Income > 25%',
    secDisclosureCitation: '10-K Note 1: Vendor Allowances & Other Rebates Accruals (ASC 705-20)',
    benchmarkRule: 'ASC 705-20 Vendor Rebates Recognition: Rebates only recognized when probable and estimable',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 7,
    dataSource: 'Forensic Rule (P2)',
    riskExplanation: 'If volume targets are missed, accrued rebates must be reversed, causing severe earnings restatements.'
  },
  {
    code: 'RET-26',
    lens: 'Retail',
    category: 'Operating Reserves',
    title: 'E-Commerce Return Restocking Cost Omission',
    description: 'Failing to accrue reverse logistics shipping costs, inspection wages, and repackaging expenses on anticipated returns.',
    formula: 'Return Processing Fee Accrual = $0 despite 20%+ Online Return Volume',
    secDisclosureCitation: '10-K Note 2: Customer Returns and Allowances Accruals',
    benchmarkRule: 'E-Commerce Reverse Logistics Industry Cost: $12 - $20 per returned apparel item',
    defaultSeverity: 'Warning',
    scoreImpact: 4,
    dataSource: 'Forensic Rule (P2)',
    riskExplanation: 'Post-period margin collapse as waves of returns hit warehouses without matching expense accruals.'
  },
  {
    code: 'RET-27',
    lens: 'Retail',
    category: 'Cash Flow Quality',
    title: 'Retail Working Capital Window Dressing at Fiscal Year-End',
    description: 'Delaying supplier check runs until day 1 of new fiscal year while factoring receivables before year-end to artificially boost cash balance.',
    formula: 'Q4 CFO / Full-Year CFO > 65% with Immediate Q1 Cash Reversal',
    secDisclosureCitation: '10-K Consolidated Statements of Cash Flows & Item 7 MD&A Liquidity',
    benchmarkRule: 'Kaggle Retail Operating Cash Flow Seasonality Norm: Q4 CFO 35% - 48% of annual',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 8,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Temporary balance sheet fabrication concealing structural liquidity distress and vendor credit freezes.'
  },
  {
    code: 'RET-28',
    lens: 'Retail',
    category: 'Governance & Compensation',
    title: 'Executive Bonus Milestone Tied to Gross Margin Accrual Bias',
    description: 'Management discretionary accrual adjustments made specifically to trigger multimillion-dollar executive cash compensation hurdles.',
    formula: 'Gross Margin Exceeds Incentive Target by < 0.2% with Unusually Low Inventory Reserves',
    secDisclosureCitation: 'DEF 14A Proxy Statement: Executive Compensation Discussion and Analysis (CD&A)',
    benchmarkRule: 'SEC Proxy Statement Compensation Audit Heuristic',
    defaultSeverity: 'Warning',
    scoreImpact: 5,
    dataSource: 'Forensic Rule (P2)',
    riskExplanation: 'Agency risk; executives sacrifice balance sheet conservatism to maximize personal short-term payouts.'
  },
  {
    code: 'RET-29',
    lens: 'Retail',
    category: 'Contingent Liabilities',
    title: 'Supply Chain Disruption Contingent Liability Non-Disclosure',
    description: 'Failing to establish loss accruals or disclose quantified range of loss for severe port strikes, container tariffs, or supplier factory closures.',
    formula: 'Port Strike / Supplier Default Disclosed in 8-K but Zero Financial Accrual in 10-Q',
    secDisclosureCitation: '10-K Note 11: Commitments and Contingencies (ASC 450)',
    benchmarkRule: 'ASC 450 Contingencies Disclosure Requirements',
    defaultSeverity: 'Warning',
    scoreImpact: 4,
    dataSource: 'SEC EDGAR (P1)',
    riskExplanation: 'Unanticipated catastrophic stockout costs and expedited air freight charges in subsequent quarters.'
  },
  {
    code: 'RET-30',
    lens: 'Retail',
    category: 'Expense Recognition',
    title: 'Co-Op Advertising Expense Reclassification to Capital Expenditures',
    description: 'Capitalizing vendor cooperative promotional payments as perpetual brand assets rather than expensing against gross revenue.',
    formula: 'Co-Op Marketing Reclassified as Intangible Asset / Total Advertising > 10%',
    secDisclosureCitation: '10-K Note 1: Vendor Consideration and Cooperative Advertising Policies',
    benchmarkRule: 'ASC 705-20-25-1 Vendor Considerations: Netting against revenue or cost of sales required',
    defaultSeverity: 'Critical Anomaly',
    scoreImpact: 6,
    dataSource: 'Forensic Rule (P2)',
    riskExplanation: 'Misleads investors by double-counting vendor co-op dollars while understating marketing run-rate.'
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
    benchmarkRule: 'Kaggle Payments Baseline Tier 1: 0.075% - 0.12%',
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
        benchmark: 'Kaggle Fintech Advance Default Ratio: 4.8% - 7.5%',
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
        benchmark: 'Kaggle Global Payments Benchmark Standard P80',
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
    benchmarkRule: 'Kaggle SaaS Benchmark Median: 8.5% - 14.0%',
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
    benchmarkRule: 'Kaggle Enterprise SaaS Benchmark: 0.85 - 1.25',
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
      benchmarkRule: `Kaggle SaaS Benchmark P${65 + (i % 30)}`,
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
    benchmarkRule: 'Kaggle US Banking Crisis Anomaly Detection Standard',
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
    benchmarkRule: 'Kaggle Hardware Sector Benchmark P85',
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
    benchmarkRule: 'Kaggle Consumer Hardware Benchmark Median: 1.8% - 2.5%',
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
    benchmarkRule: 'Kaggle Semiconductor Foundries Benchmark Baseline',
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
      benchmarkRule: `Kaggle Hardware Manufacturing Benchmark P${60 + (i % 30)}`,
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
    benchmarkRule: 'Kaggle Hospital Healthcare Accounts Receivable Benchmark',
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
      benchmarkRule: `Kaggle Healthcare & Biotech Sector Benchmark P${60 + (i % 30)}`,
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
    benchmarkRule: 'Kaggle Hyperscaler Cloud Benchmark: 3.0 - 4.0 Year Thermal Limit',
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
    benchmarkRule: 'Kaggle AI Infrastructure Power Benchmark',
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
      benchmarkRule: `Kaggle AI Sector Compute & Capitalization Benchmark P${60 + (i % 30)}`,
      defaultSeverity: (idx === 6 || idx === 9 ? 'Warning' : 'Healthy') as FlagSeverity,
      scoreImpact: 4,
      dataSource: (idx % 2 === 0 ? 'SEC EDGAR (P1)' : 'Forensic Rule (P2)') as DataSourcePriority,
      riskExplanation: 'Safeguards against artificial compute capitalization, round-tripping, and aggressive server useful-life assumptions.'
    };
  })
];
