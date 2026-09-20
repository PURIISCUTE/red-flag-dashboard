import { ForensicFlag, IndustryLens, FlagSeverity, DataSourcePriority } from '../types';

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
  ...Array.from({ length: 20 }, (_, i) => {
    const idx = i + 11;
    const codes = `RET-${idx < 10 ? '0' + idx : idx}`;
    const titles = [
      'Shrinkage / Inventory Theft Reserve Compression',
      'Freight & Inbound Logistics Capitalization in Inventory',
      'Direct-to-Consumer Customer Acquisition Cost (CAC) Capitalization',
      'Loyalty Points Redemption Liability Deficit',
      'Promotional Discount Deferred Loss Shifting',
      'Private Label Trademark Goodwill Non-Impairment',
      'Cross-Dock Distribution Facility Under-Depreciation',
      'Reverse Logistics Warranty Provision Understatement',
      'Third-Party Marketplace Merchant Float Misclassification',
      'Uncollected Credit Card Chargeback Reserve Inadequacy',
      'Omnichannel Fulfillment Allocation Distortions',
      'Seasonal Inventory Aging Threshold Extensions',
      'Store Pre-Opening Cost Capitalization Violation',
      'Sale-Leaseback Gain Premature Flow-Through',
      'Vendor Volume Incentive Target Fabrication Risk',
      'E-Commerce Return Restocking Cost Omission',
      'Retail Working Capital Cash Flow Window Dressing at Fiscal Year-End',
      'Executive Bonus Milestone Tied to Gross Margin Accrual Bias',
      'Supply Chain Disruption Contingent Liability Non-Disclosure',
      'Co-Op Advertising Expense Reclassification to Capital Expenditures'
    ];
    return {
      code: codes,
      lens: 'Retail' as IndustryLens,
      category: idx % 2 === 0 ? 'Operating Reserves' : 'Balance Sheet Integrity',
      title: titles[i] || `Retail Accounting Metric Check ${idx}`,
      description: `Evaluates forensic risk regarding ${titles[i]?.toLowerCase() || 'retail item'} against audited GAAP disclosures.`,
      formula: `Forensic Heuristic Ratio Index R-${idx} vs Benchmark < Threshold`,
      secDisclosureCitation: `10-K Item 8: Notes on Retail Financial Disclosures (Note ${idx})`,
      benchmarkRule: `Kaggle Retail Industry Baseline P${70 + (i % 25)}`,
      defaultSeverity: (idx === 17 || idx === 23 ? 'Warning' : 'Healthy') as FlagSeverity,
      scoreImpact: 3,
      dataSource: (idx % 3 === 0 ? 'SEC EDGAR (P1)' : idx % 3 === 1 ? 'Forensic Rule (P2)' : 'Kaggle Benchmark (P4)') as DataSourcePriority,
      riskExplanation: 'Monitors potential distortion of retail profit margins, working capital cycles, and inventory valuation.'
    };
  }),

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
  ...Array.from({ length: 26 }, (_, i) => {
    const idx = i + 5;
    const codes = `PAY-${idx < 10 ? '0' + idx : idx}`;
    const titles = [
      'Buy-Now-Pay-Later (BNPL) 90+ Day Delinquency Forbearance Extension',
      'Uncollected Chargeback Settlement Receivable Runoff',
      'Partner Revenue Share Capitalization vs Contra-Revenue',
      'Cross-Border Sanctions & Anti-Money Laundering (AML) Compliance Provision Shortfall',
      'Synthetic Payment Volume Round-Tripping Anomaly',
      'Processing Network Fee Rebate Smoothing across Quarters',
      'Cryptocurrency Custody Fair Value Level 3 Classification Risk',
      'Merchant Cash Advance Default Loss Recognition Delay',
      'Card Scheme Fine Contingency Under-Accrual',
      'Terminal POS Hardware Residual Value Depreciation Extension',
      'Peer-to-Peer (P2P) Fraud Loss Reclassification into Marketing Expense',
      'Prepaid Card Unclaimed Property (Escheatment) Liability Concealment',
      'Acquired Payment Gateway Merchant Attrition Amortization Suppression',
      'High-Risk Merchant Underwriting Escrow Cushion Deterioration',
      'Foreign Subsidiary Float Repatriation Tax Liability Deficit',
      'Payment API Uptime SLA Penalty Contingent Liability Non-Accrual',
      'Dispute Arbitration Pipeline Backlog Reserve Understatement',
      'Automated Clearing House (ACH) Return Window Reserve Variance',
      'Sub-Processor Liability Indemnification Gap',
      'Credit Card Interchange Regulation Direct Impact Reserve Omission',
      'Merchant Contract Acquisition Amortization Extension to 10+ Years',
      'Real-Time Rail Liquidity Overdraft Reliance Spike',
      'Platform Merchant Cohort LTV/CAC Calculation Distortion',
      'Virtual Card Rebate Premature Accrual',
      'Cross-Border Tax Withholding Compliance Gap',
      'Payments Executive Turnover in Risk & Chief Compliance Office'
    ];
    return {
      code: codes,
      lens: 'Payments' as IndustryLens,
      category: idx % 2 === 0 ? 'Credit & Reserves' : 'Operational Governance',
      title: titles[i] || `Payments Forensic Flag ${idx}`,
      description: `Monitors transactional settlement risks, regulatory buffers, and merchant reserve integrity.`,
      formula: `Payments Heuristic Ratio PAY-H${idx} vs Industry Baseline`,
      secDisclosureCitation: `10-K Note ${idx % 7 + 1}: Payments Operations & Regulatory Provisions`,
      benchmarkRule: `Kaggle Global Payments Benchmark Standard P${60 + (i % 35)}`,
      defaultSeverity: (idx === 7 || idx === 12 ? 'Warning' : 'Healthy') as FlagSeverity,
      scoreImpact: 3,
      dataSource: (idx % 2 === 0 ? 'SEC EDGAR (P1)' : 'Forensic Rule (P2)') as DataSourcePriority,
      riskExplanation: 'Guards against hidden credit defaults, regulatory enforcement fines, and float asset-liability mismatches.'
    };
  }),

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
