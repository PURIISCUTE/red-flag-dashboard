import { SourceDocumentEntry, ValueMode } from '../types';

// Registry of all 27 primary SEC source documents and external registries from the PDF Input Sheet
export const SOURCE_DOCUMENTS: SourceDocumentEntry[] = [
  {
    code: 'IS',
    name: 'Income Statement',
    contains: 'Revenue, COGS, SG&A, R&D, D&A, tax, net income',
    typicalLocation: '10-K Item 8 / 10-Q Part I Item 1 Consolidated Statements of Operations',
    valueMode: 'TTM Required',
    ttmNotes: 'Flow statement: Quarterly analysis requires rolling 4-quarter TTM accumulation to remove seasonality and match balance-sheet denominator rates.',
    relevantSectors: 'All Sectors (Retail, Payments, SaaS, Banks, Tech Hardware, Healthcare, AI)'
  },
  {
    code: 'BS',
    name: 'Balance Sheet',
    contains: 'Assets, liabilities, equity, inventory, AR, goodwill, cash & equivalents',
    typicalLocation: '10-K Item 8 / 10-Q Part I Item 1 Consolidated Balance Sheets',
    valueMode: 'Direct Source Document',
    ttmNotes: 'Point-in-time stock: Values must be taken DIRECTLY from the period-end balance sheet without TTM summation.',
    relevantSectors: 'All Sectors (Retail, Payments, SaaS, Banks, Tech Hardware, Healthcare, AI)'
  },
  {
    code: 'CF',
    name: 'Cash Flow Statement',
    contains: 'CFO (Operating Cash Flow), CapEx, financing activity, investing activity',
    typicalLocation: '10-K Item 8 / 10-Q Part I Item 1 Consolidated Statements of Cash Flows',
    valueMode: 'TTM Required',
    ttmNotes: 'Flow statement: In 10-Q filings, cash flows are cumulative YTD; must derive isolated quarter or accumulate trailing 4 quarters for annualized TTM comparison.',
    relevantSectors: 'All Sectors'
  },
  {
    code: 'SE',
    name: "Statement of Stockholders' Equity",
    contains: 'Share count changes, SBC issuance, dilution, treasury purchases, retained earnings',
    typicalLocation: '10-K Item 8 Consolidated Statements of Stockholders’ Equity',
    valueMode: 'Direct Source Document',
    ttmNotes: 'Direct period reconciliation of ending share count, stock options granted, and treasury stock changes.',
    relevantSectors: 'SaaS, AI, Tech Hardware'
  },
  {
    code: 'N-Rev',
    name: 'Notes — Revenue Recognition (ASC 606)',
    contains: 'Deferred revenue balances, contract liabilities, unbilled receivables, returns reserves, performance obligations',
    typicalLocation: '10-K Item 8 Note 2: Revenue from Contracts with Customers',
    valueMode: 'Dual (TTM + Direct)',
    ttmNotes: 'Deferred revenue balances are taken DIRECTLY from ending balance sheet notes; revenue growth baseline requires TTM revenue.',
    relevantSectors: 'SaaS, Payments, Retail, Tech Hardware, AI'
  },
  {
    code: 'N-Inv',
    name: 'Notes — Inventory',
    contains: 'Inventory reserves, raw materials vs finished goods, obsolescence write-downs, LCM allowances',
    typicalLocation: '10-K Item 8 Note: Inventories',
    valueMode: 'Direct Source Document',
    ttmNotes: 'Ending reserve balances and 3-year write-down mention counts taken DIRECTLY from footnote tables.',
    relevantSectors: 'Retail, Tech Hardware, Healthcare'
  },
  {
    code: 'N-Lease',
    name: 'Notes — Leases (ASC 842)',
    contains: 'Operating lease liabilities, ROU assets, future lease commitment schedule, weighted-average discount rate',
    typicalLocation: '10-K Item 8 Note: Leases',
    valueMode: 'Direct Source Document',
    ttmNotes: 'Total undiscounted and discounted operating lease liabilities taken DIRECTLY from current footnote maturity tables.',
    relevantSectors: 'Retail, Banks'
  },
  {
    code: 'N-Tax',
    name: 'Notes — Income Tax',
    contains: 'Effective tax rate reconciliation, valuation allowances, foreign earnings reinvestment, tax reserves',
    typicalLocation: '10-K Item 8 Note: Income Taxes',
    valueMode: 'Direct Source Document',
    ttmNotes: 'Statutory-to-effective rate variance percentages and tax valuation allowances taken DIRECTLY from annual disclosure table.',
    relevantSectors: 'Healthcare, Retail, Payments'
  },
  {
    code: 'N-Comm',
    name: 'Notes — Commitments & Contingencies',
    contains: 'Litigation reserves, contingent loss accruals, purchase obligations, cloud compute minimum commitments',
    typicalLocation: '10-K Item 8 Note: Commitments, Contingencies and Guarantees',
    valueMode: 'Direct Source Document',
    ttmNotes: 'Disclosed estimated loss ranges and dollar commitments taken DIRECTLY from footnote qualitative text.',
    relevantSectors: 'Healthcare, AI, Payments'
  },
  {
    code: 'N-RP',
    name: 'Notes — Related Party Transactions',
    contains: 'Related-party deals, officer loans, affiliate supplier purchases, circular investment agreements',
    typicalLocation: '10-K Item 8 Note: Related-Party Disclosures (ASC 850)',
    valueMode: 'Direct Source Document',
    ttmNotes: 'Dollar volume and counterparty relationships extracted DIRECTLY from footnote. Ratio compares to TTM Revenue.',
    relevantSectors: 'All Sectors (AI, Payments, Hardware, Retail, Banks)'
  },
  {
    code: 'N-Seg',
    name: 'Notes — Segment Reporting (ASC 280)',
    contains: 'Segment margins, revenues, inter-segment transfers, customer concentration > 10%',
    typicalLocation: '10-K Item 8 Note: Segment Disclosures',
    valueMode: 'Dual (TTM + Direct)',
    ttmNotes: 'Segment margins computed on annual/TTM basis; customer concentration % taken DIRECTLY from footnote text.',
    relevantSectors: 'Retail, Tech Hardware, SaaS, Healthcare'
  },
  {
    code: 'N-GW',
    name: 'Notes — Goodwill & Intangibles',
    contains: 'Goodwill carrying amount, annual impairment testing dates, key valuation assumptions, intangible amortization',
    typicalLocation: '10-K Item 8 Note: Goodwill and Other Intangibles',
    valueMode: 'Direct Source Document',
    ttmNotes: 'Goodwill balances and recorded impairments taken DIRECTLY from balance sheet and roll-forward table.',
    relevantSectors: 'Tech Hardware, SaaS, Healthcare'
  },
  {
    code: 'N-SBC',
    name: 'Notes — Stock-Based Compensation',
    contains: 'SBC expense detail by P&L line item, unrecognized stock option compensation, grant-date fair values',
    typicalLocation: '10-K Item 8 Note: Share-Based Compensation Plans',
    valueMode: 'TTM Required',
    ttmNotes: 'SBC expense is an ongoing operating add-back; aggregate trailing 4 quarters (TTM) to measure dilution rate vs TTM Revenue.',
    relevantSectors: 'SaaS, AI, Payments, Tech Hardware'
  },
  {
    code: 'N-FV',
    name: 'Notes — Fair Value Measurements',
    contains: 'Level 1, Level 2, and Level 3 asset/liability classifications, model valuation inputs',
    typicalLocation: '10-K Item 8 Note: Fair Value Measurements (ASC 820)',
    valueMode: 'Direct Source Document',
    ttmNotes: 'Level 3 mark-to-model asset balances extracted DIRECTLY from ending period fair value hierarchy table.',
    relevantSectors: 'Banks, Payments'
  },
  {
    code: 'N-Warr',
    name: 'Notes — Warranty',
    contains: 'Warranty accrual roll-forward, provisions charged to expense, actual claims paid/settled',
    typicalLocation: '10-K Item 8 Note: Product Warranty Obligations',
    valueMode: 'Dual (TTM + Direct)',
    ttmNotes: 'Accrual additions and claims paid are flow metrics (TTM); ending warranty liability is DIRECT point-in-time.',
    relevantSectors: 'Tech Hardware, Retail'
  },
  {
    code: 'N-ACL',
    name: 'Notes — Allowance for Credit Losses (CECL)',
    contains: 'Bank loss reserve methodology, portfolio segmentation, Day-1 CECL adjustment, qualitative macroeconomic overlay',
    typicalLocation: '10-K Item 8 Note: Allowance for Credit Losses (ASC 326)',
    valueMode: 'Direct Source Document',
    ttmNotes: 'Allowance balances, NPL coverage %, and economic scenario weightings extracted DIRECTLY from CECL disclosures.',
    relevantSectors: 'Banks, Payments'
  },
  {
    code: 'MD&A',
    name: 'Item 7 — Management Discussion',
    contains: 'Non-GAAP reconciliations, same-store sales metrics, customer ARR, NRR, backlog, liquidity narrative',
    typicalLocation: '10-K Part II Item 7 / 10-Q Part I Item 2 Management’s Discussion and Analysis',
    valueMode: 'Dual (TTM + Direct)',
    ttmNotes: 'Non-GAAP EBITDA add-backs aggregated over TTM; KPIs like NRR or Same-Store Sales taken DIRECTLY as reported.',
    relevantSectors: 'All Sectors'
  },
  {
    code: '7A',
    name: 'Item 7A — Market Risk',
    contains: 'Interest rate sensitivity tables, duration gaps, derivative exposures, FX sensitivity',
    typicalLocation: '10-K Part II Item 7A Quantitative and Qualitative Disclosures About Market Risk',
    valueMode: 'Direct Source Document',
    ttmNotes: 'Asset-liability duration mismatch and rate shock estimates extracted DIRECTLY from sensitivity scenario disclosures.',
    relevantSectors: 'Banks'
  },
  {
    code: '9A',
    name: 'Item 9A — Controls & Procedures',
    contains: 'Management assessment of internal control over financial reporting (ICFR), material weakness disclosures',
    typicalLocation: '10-K Part II Item 9A Controls and Procedures',
    valueMode: 'Direct Source Document',
    ttmNotes: 'Qualitative word-based disclosure. AI Agent Instruction: Scan for material weakness admissions or remediation language. Absence of weakness = Clean Green.',
    relevantSectors: 'All Sectors'
  },
  {
    code: 'Item3',
    name: 'Item 3 — Legal Proceedings',
    contains: 'Descriptions of active material lawsuits, regulatory investigations, DOJ/SEC inquiries, class actions',
    typicalLocation: '10-K Part I Item 3 Legal Proceedings',
    valueMode: 'Direct Source Document',
    ttmNotes: 'Qualitative word-based disclosure. AI Agent Instruction: Scan for new civil/criminal litigation vs existing reserve amounts in Note N-Comm.',
    relevantSectors: 'Healthcare, Payments, Banks'
  },
  {
    code: 'Item1A',
    name: 'Item 1A — Risk Factors',
    contains: 'Qualitative customer concentration, single hyperscaler reliance, supplier sole-sourcing, partner dependency language',
    typicalLocation: '10-K Part I Item 1A Risk Factors',
    valueMode: 'Direct Source Document',
    ttmNotes: 'Qualitative disclosure. AI Agent Instruction: Check for specific mentions of customer loss risk, regulatory consent risk, or sole-supplier single-point-of-failure.',
    relevantSectors: 'All Sectors (AI, Payments, Hardware, Banks)'
  },
  {
    code: 'Audit',
    name: "Auditor's Opinion Letter",
    contains: 'Going-concern qualification, critical audit matters (CAMs), internal control audit opinion',
    typicalLocation: '10-K Item 8 Reports of Independent Registered Public Accounting Firm (PCAOB AS 2415)',
    valueMode: 'Direct Source Document',
    ttmNotes: 'Qualitative word-based disclosure. AI Agent Instruction: Search for substantial doubt regarding entity’s ability to continue as a going concern.',
    relevantSectors: 'All Sectors'
  },
  {
    code: 'Proxy',
    name: 'DEF 14A (Proxy Statement)',
    contains: 'Executive compensation, insider transactions, board independence, related-party agreements, insider loans',
    typicalLocation: 'SEC DEF 14A Definitive Proxy Statement (Item 13 in 10-K incorporation)',
    valueMode: 'Direct Source Document',
    ttmNotes: 'Related-party contract sums and executive loans taken DIRECTLY from proxy disclosure tables.',
    relevantSectors: 'Banks, Retail, Tech Hardware, AI'
  },
  {
    code: 'PR/IR',
    name: 'Earnings Press Release / Investor Deck (8-K Ex. 99.1)',
    contains: 'Non-GAAP KPIs, Total Payment Volume (TPV), Annual Recurring Revenue (ARR), Net Retention Rate (NRR), Same-store sales',
    typicalLocation: 'Form 8-K Item 2.02 Results of Operations and Financial Condition (Exhibit 99.1)',
    valueMode: 'Dual (TTM + Direct)',
    ttmNotes: 'Quarterly TPV and ARR reported directly; convert to trailing 12-month TTM to cross-check against GAAP revenue deceleration.',
    relevantSectors: 'Payments, SaaS, Retail'
  },
  {
    code: '8-K',
    name: 'Current Report',
    contains: 'Item 4.02 non-reliance on previously issued financial statements (Restatements), Item 4.01 auditor resignation, consent orders',
    typicalLocation: 'SEC Form 8-K Current Reports filed throughout fiscal year',
    valueMode: 'Direct Source Document',
    ttmNotes: 'Qualitative event trigger. AI Agent Instruction: Check for Item 4.02 filings. Absence of Item 4.02 = Clean Green; presence of error correction = Red Restatement Flag.',
    relevantSectors: 'All Sectors'
  },
  {
    code: 'CallRpt',
    name: 'Bank Call Report (FFIEC 031/041)',
    contains: 'Granular bank regulatory capital, regulatory asset risk-weighting, non-performing loans, brokered deposits not in 10-K',
    typicalLocation: 'FFIEC Consolidated Reports of Condition and Income (Schedules RC, RC-R, RC-N)',
    valueMode: 'Direct Source Document',
    ttmNotes: 'Regulatory capital ratios (CET1) and Schedule RC-R risk-weights taken DIRECTLY from quarterly regulatory submission.',
    relevantSectors: 'Banks'
  },
  {
    code: 'Ext',
    name: 'External Sources (non-filing)',
    contains: 'Patent databases (USPTO), ClinicalTrials.gov (drug trial status), FDIC/OCC enforcement orders, Yahoo Finance market cap/beta, 13D/G filings',
    typicalLocation: 'Yahoo Finance API, ClinicalTrials.gov, USPTO Patent Registry, Kaggle Audited Fraud Distributions',
    valueMode: 'Direct Source Document',
    ttmNotes: 'Point-in-time external ground truth: Market capitalization, beta, peer DPO/DIO percentiles, and FDA clinical trial phase verification.',
    relevantSectors: 'All Sectors (Healthcare, AI, Banks, Hardware)'
  }
];

// Input item specification mapping all variables required by the 205+ sector flags
export interface MasterInputItem {
  id: string;
  name: string;
  docCode: string;
  docName: string;
  valueMode: ValueMode;
  isWordInstruction: boolean;
  sectors: string[];
  description: string;
  formulaOrExtraction: string;
  aiAgentDirective?: string;
}

export const MASTER_INPUTS_SHEET: MasterInputItem[] = [
  {
    id: 'inp-rev',
    name: 'Revenue (Total GAAP)',
    docCode: 'IS',
    docName: 'Income Statement',
    valueMode: 'TTM Required',
    isWordInstruction: false,
    sectors: ['Retail', 'Payments', 'SaaS', 'Tech Hardware', 'Healthcare', 'AI'],
    description: 'Consolidated net revenue recognized under ASC 606.',
    formulaOrExtraction: 'Sum of last 4 quarters from 10-Q / 10-K Item 8 (us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax).'
  },
  {
    id: 'inp-cfo',
    name: 'Cash Flow from Operations (CFO)',
    docCode: 'CF',
    docName: 'Cash Flow Statement',
    valueMode: 'TTM Required',
    isWordInstruction: false,
    sectors: ['All Sectors'],
    description: 'Net cash provided by operating activities.',
    formulaOrExtraction: 'Trailing 12-month accumulation from 10-Q/10-K (us-gaap:NetCashProvidedByUsedInOperatingActivities).'
  },
  {
    id: 'inp-ar',
    name: 'Accounts Receivable (Gross & Net)',
    docCode: 'BS',
    docName: 'Balance Sheet',
    valueMode: 'Direct Source Document',
    isWordInstruction: false,
    sectors: ['All Sectors'],
    description: 'Trade receivables before and after allowance for doubtful accounts.',
    formulaOrExtraction: 'Direct point-in-time balance from 10-K/10-Q Balance Sheet (us-gaap:AccountsReceivableNetCurrent).'
  },
  {
    id: 'inp-inv',
    name: 'Inventory (Gross & Reserves)',
    docCode: 'BS',
    docName: 'Balance Sheet & Note N-Inv',
    valueMode: 'Direct Source Document',
    isWordInstruction: false,
    sectors: ['Retail', 'Tech Hardware', 'Healthcare'],
    description: 'Finished goods, WIP, raw materials, and obsolescence allowances.',
    formulaOrExtraction: 'Direct point-in-time balance from Balance Sheet & Note N-Inv breakdown.'
  },
  {
    id: 'inp-cogs',
    name: 'Cost of Goods Sold (COGS)',
    docCode: 'IS',
    docName: 'Income Statement',
    valueMode: 'TTM Required',
    isWordInstruction: false,
    sectors: ['Retail', 'Payments', 'Tech Hardware', 'Healthcare'],
    description: 'Cost of products sold and service delivery expenses.',
    formulaOrExtraction: 'Sum of trailing 4 quarters from 10-Q/10-K Statement of Operations.'
  },
  {
    id: 'inp-def-rev',
    name: 'Deferred Revenue / Contract Liabilities',
    docCode: 'N-Rev',
    docName: 'Notes — Revenue Recognition (ASC 606)',
    valueMode: 'Dual (TTM + Direct)',
    isWordInstruction: false,
    sectors: ['SaaS', 'Payments', 'Tech Hardware', 'AI'],
    description: 'Current and non-current contract liabilities for unearned customer prepayments.',
    formulaOrExtraction: 'Ending balance taken directly from Note N-Rev table; YoY growth compares to TTM Revenue growth.'
  },
  {
    id: 'inp-9a-controls',
    name: 'Item 9A Internal Controls Assessment',
    docCode: '9A',
    docName: 'Item 9A — Controls & Procedures',
    valueMode: 'Direct Source Document',
    isWordInstruction: true,
    sectors: ['All Sectors'],
    description: 'Management & auditor evaluation of internal controls over financial reporting (ICFR).',
    formulaOrExtraction: 'Qualitative text inspection of 10-K Item 9A.',
    aiAgentDirective: 'Told to AI Scanner: Treat qualitative word threshold as an audit directive. If no material weakness or control deficiency is disclosed, mark "None disclosed" (Green Flag). If a past deficiency was remediated, mark "Remediated prior weakness" (Yellow). If an active material weakness is admitted, mark "Active weakness disclosed" (Red Flag).'
  },
  {
    id: 'inp-audit-opinion',
    name: "Auditor's Going-Concern Language",
    docCode: 'Audit',
    docName: "Auditor's Opinion Letter (PCAOB AS 2415)",
    valueMode: 'Direct Source Document',
    isWordInstruction: true,
    sectors: ['All Sectors'],
    description: 'Independent auditor assessment of substantial doubt regarding continuing operations.',
    formulaOrExtraction: 'Qualitative text inspection of PCAOB audit opinion in Item 8.',
    aiAgentDirective: 'Told to AI Scanner: Inspect auditor letter. If opinion is standard unqualified, mark "None" (Green Flag). If explanatory emphasis paragraph discusses liquidity pressure, mark "Qualified language" (Yellow). If explicit substantial doubt is stated, mark "Going concern doubt stated" (Red Flag).'
  },
  {
    id: 'inp-restatement',
    name: 'Prior-Period Restatement Disclosures',
    docCode: '8-K',
    docName: 'Form 8-K Item 4.02 & Note 2',
    valueMode: 'Direct Source Document',
    isWordInstruction: true,
    sectors: ['All Sectors'],
    description: 'Admissions of financial statement accounting errors under ASC 250.',
    formulaOrExtraction: 'Inspection of 8-K Item 4.02 and Note 1/2 accounting policies.',
    aiAgentDirective: 'Told to AI Scanner: Scan 8-K filings and Footnotes. If no restatement occurred, mark "None" (Green Flag). If reclassifications had immaterial net income effect, mark "Minor/immaterial" (Yellow). If formal revision of audited past statements, mark "Material restatement" (Red Flag).'
  },
  {
    id: 'inp-gross-net',
    name: 'Gross-to-Net Revenue Policy Change',
    docCode: 'N-Rev',
    docName: 'Notes — Revenue Recognition (ASC 606) & MD&A',
    valueMode: 'Direct Source Document',
    isWordInstruction: true,
    sectors: ['Payments', 'AI'],
    description: 'Policy reclassifications shifting vendor credits, interchange, or agent fees between gross vs net.',
    formulaOrExtraction: 'Qualitative text comparison in Note N-Rev across consecutive 10-K filings.',
    aiAgentDirective: 'Told to AI Scanner: Verify if accounting treatment for gross vs net reporting changed. If no policy change disclosed, mark "No change disclosed" (Green). If immaterial technical update, mark "Change disclosed, immaterial" (Yellow). If change coincides with growth narrative in MD&A, mark "Change coincides with growth narrative" (Red Flag).'
  },
  {
    id: 'inp-fcf-trend',
    name: 'Free Cash Flow Margin Trend',
    docCode: 'CF',
    docName: 'Cash Flow Statement & Income Statement',
    valueMode: 'TTM Required',
    isWordInstruction: true,
    sectors: ['Retail', 'Payments', 'Tech Hardware', 'Healthcare', 'SaaS', 'AI'],
    description: 'Trend in (TTM CFO - TTM CapEx) / TTM Revenue over 3 trailing fiscal cycles.',
    formulaOrExtraction: '((CFO_TTM - CapEx_TTM) / Rev_TTM) trajectory.',
    aiAgentDirective: 'Told to AI Scanner: Calculate multi-year trajectory. If FCF margin is expanding or flat within 1pp, mark "Stable/rising" (Green). If margin declined by 1pp to 4pp, mark "Mild decline" (Yellow). If margin compressed > 5pp or turned negative, mark "Sharp decline" (Red Flag).'
  },
  {
    id: 'inp-goodwill-impair',
    name: 'Goodwill Impairment Absence Flag',
    docCode: 'N-GW',
    docName: 'Notes — Goodwill & Intangibles & Note N-Seg',
    valueMode: 'Direct Source Document',
    isWordInstruction: true,
    sectors: ['Tech Hardware', 'SaaS'],
    description: 'Cross-check of goodwill carrying values against reporting unit margin deterioration.',
    formulaOrExtraction: 'Goodwill / Total Assets > 25% evaluated against Segment operating margin drops.',
    aiAgentDirective: 'Told to AI Scanner: Inspect reporting unit profitability. If goodwill carrying balance is stable and underlying cash generation is strong, mark "No impairment needed" (Green). If reporting unit revenue or margin fell >10% without impairment, mark "Watch-list" (Yellow). If chronic multi-year losses with zero write-down, mark "Impairment overdue" (Red Flag).'
  },
  {
    id: 'inp-partner-conc',
    name: 'Partner / Customer Concentration Risk',
    docCode: 'Item1A',
    docName: 'Item 1A — Risk Factors & Note N-Seg',
    valueMode: 'Direct Source Document',
    isWordInstruction: true,
    sectors: ['Payments', 'AI', 'Tech Hardware'],
    description: 'Single customer or payment partner representing > 10% of revenue or processing rails.',
    formulaOrExtraction: 'Note N-Seg customer concentration disclosure + Item 1A risk language.',
    aiAgentDirective: 'Told to AI Scanner: Scan Note N-Seg and Item 1A. If no single customer exceeds 10% of revenue, mark "None disclosed" (Green). If concentration is disclosed but customer count is diversifying, mark "Disclosed, diversifying" (Yellow). If top partner share is rising > 20%, mark "Disclosed, rising" (Red Flag).'
  },
  {
    id: 'inp-tpv',
    name: 'Total Payment Volume (TPV)',
    docCode: 'PR/IR',
    docName: 'Earnings Release (8-K Ex. 99.1) & MD&A',
    valueMode: 'TTM Required',
    isWordInstruction: false,
    sectors: ['Payments'],
    description: 'Gross dollar value of transactions processed through payment gateways.',
    formulaOrExtraction: 'Sum of 4 quarterly reported TPV volumes from 8-K press releases.'
  },
  {
    id: 'inp-settlement-assets',
    name: 'Settlement Assets & Settlement Obligations',
    docCode: 'BS',
    docName: 'Balance Sheet & Note N-FV',
    valueMode: 'Direct Source Document',
    isWordInstruction: false,
    sectors: ['Payments'],
    description: 'Funds held for merchants vs payables owed to merchants.',
    formulaOrExtraction: 'Ending point-in-time balances from Balance Sheet (Settlement Assets vs Settlement Obligations).'
  },
  {
    id: 'inp-sbc',
    name: 'Stock-Based Compensation Expense',
    docCode: 'CF',
    docName: 'Cash Flow Statement & Note N-SBC',
    valueMode: 'TTM Required',
    isWordInstruction: false,
    sectors: ['SaaS', 'AI', 'Tech Hardware', 'Payments'],
    description: 'Non-cash equity grant expense added back to operating cash flow.',
    formulaOrExtraction: 'Sum of trailing 4 quarters from Cash Flow Statement (us-gaap:ShareBasedCompensation).'
  },
  {
    id: 'inp-leases',
    name: 'Operating Lease Liabilities',
    docCode: 'N-Lease',
    docName: 'Notes — Leases (ASC 842)',
    valueMode: 'Direct Source Document',
    isWordInstruction: false,
    sectors: ['Retail', 'Banks'],
    description: 'Current and non-current operating lease liabilities on physical footprint.',
    formulaOrExtraction: 'Ending balance from Note N-Lease table (us-gaap:OperatingLeaseLiability).'
  },
  {
    id: 'inp-cecl-acl',
    name: 'Allowance for Credit Losses (ACL) & NPLs',
    docCode: 'N-ACL',
    docName: 'Notes — Allowance for Credit Losses & Call Report',
    valueMode: 'Direct Source Document',
    isWordInstruction: false,
    sectors: ['Banks'],
    description: 'CECL allowance reserves vs non-performing and 90-day delinquent loans.',
    formulaOrExtraction: 'Ending reserve balances from Note N-ACL and Schedule RC-N in Call Report.'
  },
  {
    id: 'inp-non-gaap',
    name: 'Non-GAAP vs GAAP Net Income / Operating Income',
    docCode: 'MD&A',
    docName: 'Item 7 — Management Discussion & 8-K PR',
    valueMode: 'TTM Required',
    isWordInstruction: false,
    sectors: ['All Sectors'],
    description: 'Difference between GAAP net income and company-adjusted non-GAAP metric.',
    formulaOrExtraction: 'Sum of trailing 4 quarters of non-GAAP reconciliations in MD&A.'
  },
  {
    id: 'inp-market-data',
    name: 'Stock Price, Market Cap, Beta',
    docCode: 'Ext',
    docName: 'External Sources (Yahoo Finance)',
    valueMode: 'Direct Source Document',
    isWordInstruction: false,
    sectors: ['All Sectors'],
    description: 'Real-time equity market valuation data used for Altman Z-Score and Texas Ratio.',
    formulaOrExtraction: 'Point-in-time closing share price and market capitalization from Yahoo Finance API.'
  }
];
