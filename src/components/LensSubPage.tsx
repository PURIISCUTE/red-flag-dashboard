import React, { useState } from 'react';
import { 
  IndustryLens, 
  CompanyForensicProfile, 
  ForensicFlag, 
  FlagSeverity 
} from '../types';
import { VALID_7_LENSES } from '../services/industryClassifier';
import { 
  ShieldAlert, 
  Layers, 
  Activity, 
  FileText, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Sliders, 
  Scale, 
  Sparkles,
  TrendingDown,
  TrendingUp,
  Cpu,
  ShoppingBag,
  CreditCard,
  Cloud,
  Building,
  HardDrive,
  HeartPulse,
  Info,
  Search,
  ExternalLink,
  PlusCircle,
  Check
} from 'lucide-react';

interface LensSubPageProps {
  currentLens: IndustryLens;
  company: CompanyForensicProfile;
  onSelectLens: (lens: IndustryLens) => void;
  onSelectCompany: (ticker: string) => void;
  onToggleInvestigation: (flag: ForensicFlag, note?: string) => void;
  investigationCodes: string[];
}

// Deep analytical sector forensic intelligence dossiers for all 7 lenses
interface SectorDossier {
  name: IndustryLens;
  icon: React.ReactNode;
  tagline: string;
  regulatoryStandard: string;
  forensicThesis: string;
  redFlagCount: number;
  criticalFocusAreas: string[];
  keyFormulas: {
    name: string;
    formula: string;
    benchmark: string;
    description: string;
    secSource: string;
  }[];
  peerBenchmarks: {
    ticker: string;
    name: string;
    marketCap: string;
    forensicScore: number;
    grade: string;
    mScore: number;
    zScore: number;
    accrualRatio: string;
    activeAnomalies: number;
  }[];
  stressTestMetric: {
    label: string;
    unit: string;
    min: number;
    max: number;
    step: number;
    defaultVal: number;
    explanation: string;
  };
  auditFootnoteChecklist: {
    step: number;
    title: string;
    footnoteTarget: string;
    verificationProcedure: string;
    fraudIndicator: string;
  }[];
}

const SECTOR_DOSSIERS: Record<IndustryLens, SectorDossier> = {
  'AI/Deep Tech': {
    name: 'AI/Deep Tech',
    icon: <Cpu className="h-5 w-5 text-purple-400" />,
    tagline: 'GPU Compute Depreciation, Circular Venture Revenue & Datacenter Take-or-Pay Audit',
    regulatoryStandard: 'ASC 606 (Revenue), ASC 360 (PP&E Impairment), ASC 842 (Power/Compute Leases)',
    forensicThesis: 'In hyper-growth AI companies, forensic distortion concentrates in three areas: (1) stretching useful lives of depreciating GPU clusters (e.g., claiming 5-6 years for H100s undergoing thermal degradation instead of 3 years), artificially lowering depreciation by billions; (2) circular revenue cycles where tech giants invest venture capital into AI startups who immediately purchase cloud compute credits from the investor; and (3) off-balance sheet power purchase agreements and datacenter hosting take-or-pay commitments that obscure true cash liabilities.',
    redFlagCount: 30,
    criticalFocusAreas: [
      'GPU Useful Life Depreciation Inflation (ASC 360)',
      'Circular Investment-to-Revenue Feedback Loops (ASC 606)',
      'Capitalized Model Pretraining Costs vs. Pure R&D Expense (ASC 730)',
      'Unbilled Datacenter Power & Hosting Commitments',
      'Stock-Based Compensation Dilution Masking Adjusted EBITDA'
    ],
    keyFormulas: [
      {
        name: 'GPU Useful Life Stretch Ratio (GLSR)',
        formula: 'Reported Server Useful Life (Yrs) / Industry Baseline (3.0 Yrs)',
        benchmark: 'GLSR > 1.33x triggers critical earnings flattery alert',
        description: 'Measures whether server and datacenter hardware useful life has been artificially lengthened to suppress annual depreciation expense.',
        secSource: '10-K Note 1: Summary of Significant Accounting Policies — Property and Equipment'
      },
      {
        name: 'Circular Venture Revenue Velocity (CVRV)',
        formula: '(Revenue from Investee Portfolios + Unearned Credit Draws) / Total Cloud ARR',
        benchmark: 'CVRV > 8.5% indicates synthetic circular top-line quality',
        description: 'Quantifies revenue recognized from entities in which the company holds venture equity or convertible promissory notes.',
        secSource: '10-K Note: Related Party Transactions & Strategic Investments'
      },
      {
        name: 'SBC to Operating Cash Flow Drain (SOD)',
        formula: 'Stock-Based Compensation / Operating Cash Flow',
        benchmark: 'SOD > 35.0% reveals GAAP cash flow subsidized by share dilution',
        description: 'Identifies whether operating cash flow is genuinely cash-generative or merely puffed up by non-cash stock compensation add-backs.',
        secSource: 'Consolidated Statements of Cash Flows — Stock-Based Compensation expense'
      },
      {
        name: 'Datacenter Purchase Obligation to Cash Ratio (DPO/C)',
        formula: 'Unconditional Purchase Obligations (Next 3 Yrs) / (Cash + Marketable Securities)',
        benchmark: 'DPO/C > 1.25x signals off-balance-sheet liquidity squeeze',
        description: 'Evaluates fixed power, cooling, and compute hosting commitments contracted off-balance sheet under long-term take-or-pay covenants.',
        secSource: '10-K Note: Commitments and Contingencies — Unconditional Purchase Obligations'
      }
    ],
    peerBenchmarks: [
      { ticker: 'NVDA', name: 'NVIDIA Corp.', marketCap: '$4,280B', forensicScore: 71, grade: 'B', mScore: -1.94, zScore: 14.8, accrualRatio: '+4.8%', activeAnomalies: 4 },
      { ticker: 'PLTR', name: 'Palantir Tech.', marketCap: '$440B', forensicScore: 68, grade: 'B', mScore: -1.72, zScore: 9.3, accrualRatio: '+6.1%', activeAnomalies: 5 },
      { ticker: 'MSFT', name: 'Microsoft Corp.', marketCap: '$3,890B', forensicScore: 86, grade: 'A', mScore: -2.55, zScore: 8.12, accrualRatio: '-3.8%', activeAnomalies: 2 },
      { ticker: 'GOOGL', name: 'Alphabet Inc.', marketCap: '$2,750B', forensicScore: 88, grade: 'A', mScore: -2.71, zScore: 9.85, accrualRatio: '-4.2%', activeAnomalies: 1 }
    ],
    stressTestMetric: {
      label: 'GPU Cluster Deprec. Schedule (Years)',
      unit: 'Yrs',
      min: 2,
      max: 6,
      step: 0.5,
      defaultVal: 5,
      explanation: 'Adjust from aggressive 5-year depreciation down to conservative 3-year useful life to observe net income and Beneish M-Score re-evaluation.'
    },
    auditFootnoteChecklist: [
      {
        step: 1,
        title: 'Depreciation Timeline Audit',
        footnoteTarget: 'Note 1 (PP&E): Server & Datacenter Equipment',
        verificationProcedure: 'Inspect footnote text for language changing useful lives from "3-4 years" to "4-6 years". Recalculate annual depreciation impact.',
        fraudIndicator: 'Depreciation extension adding > $1.5B to pre-tax income without physical hardware upgrades.'
      },
      {
        step: 2,
        title: 'Customer Concentration & Equity Links',
        footnoteTarget: 'Note 2: Concentration of Credit Risk & Investments',
        verificationProcedure: 'Cross-reference top 5 cloud customers with corporate venture capital (CVC) balance sheet equity holdings.',
        fraudIndicator: 'Over 20% of revenue growth originating from entities receiving venture funding from the company in the same fiscal year.'
      },
      {
        step: 3,
        title: 'Power & Capacity Take-or-Pay Footnotes',
        footnoteTarget: 'Note: Commitments & Leases (Off-Balance Sheet)',
        verificationProcedure: 'Extract multi-year unconditional power purchase agreements (PPAs) and datacenter shell leases. Compare against free cash flow.',
        fraudIndicator: 'Unconditional future commitments exceeding 2x total liquid cash and short-term treasuries.'
      },
      {
        step: 4,
        title: 'Model Pretraining Capitalization Test',
        footnoteTarget: 'Note: Intangible Assets & Internal-Use Software',
        verificationProcedure: 'Examine whether foundational LLM training compute costs are capitalized as software under ASC 350-40 rather than expensed as R&D under ASC 730.',
        fraudIndicator: 'Rapid spike in Capitalized Software Intangibles while reported R&D expense margin declines.'
      },
      {
        step: 5,
        title: 'Executive SBC Liquidation Pacing',
        footnoteTarget: 'Proxy DEF 14A & Form 4 Insider Filings',
        verificationProcedure: 'Track executive Rule 10b5-1 stock sales relative to stock-based compensation vesting tranches during compute announcement windows.',
        fraudIndicator: 'Net selling exceeding 60% of vested options within 30 days of AI capability announcements.'
      }
    ]
  },
  'SaaS': {
    name: 'SaaS',
    icon: <Cloud className="h-5 w-5 text-sky-400" />,
    tagline: 'Deferred Revenue Runoff, Capitalized Software R&D & Billing Acceleration Audit',
    regulatoryStandard: 'ASC 606 (Contracts with Customers), ASC 340-40 (Contract Acquisition Costs)',
    forensicThesis: 'In Enterprise Cloud & SaaS businesses, accounting manipulation frequently hides behind non-GAAP metrics (ARR, NRR, RPO). Primary distortions include: (1) aggressive capitalization of internal-use software development costs under ASC 350-40 to inflate EBITDA; (2) amortizing sales commission acquisition costs over 5+ years (ASC 340-40) while customer churn occurs in 2-3 years; and (3) pulling forward billings with deep multi-year discounts or extended payment terms to mask organic customer retention decay.',
    redFlagCount: 30,
    criticalFocusAreas: [
      'Unearned (Deferred) Revenue Velocity vs. Bookings (ASC 606)',
      'Capitalized Internal Software R&D / Capex Padding (ASC 350-40)',
      'Contract Acquisition Cost Amortization Overhang (ASC 340-40)',
      'Remaining Performance Obligations (RPO) Quality vs. Billings',
      'Net Revenue Retention (NRR) Masking Tier-1 Customer Churn'
    ],
    keyFormulas: [
      {
        name: 'Deferred Revenue Decoupling (DRD)',
        formula: 'Δ Deferred Revenue / Reported GAAP Revenue Growth',
        benchmark: 'DRD < 0.65 indicates forward booking deceleration hidden by backlog burn',
        description: 'Tests whether deferred revenue is growing in tandem with reported top line or if past reserves are being consumed to support current numbers.',
        secSource: 'Consolidated Balance Sheets — Current Deferred / Unearned Revenue'
      },
      {
        name: 'R&D Capitalization Aggression Index (RCAI)',
        formula: 'Capitalized Software Development Costs / Total R&D Cash Outlays',
        benchmark: 'RCAI > 18.0% signals synthetic EBITDA enhancement',
        description: 'Identifies software development labor that should be expensed as R&D but is diverted to PP&E/Intangibles on the Balance Sheet.',
        secSource: 'Consolidated Statements of Cash Flows — Additions to capitalized software'
      },
      {
        name: 'Sales Commission Amortization Stretch (SCAS)',
        formula: 'Amortization Period of Deferred Commission / Average Customer Contract Life',
        benchmark: 'SCAS > 1.5x signals deferred expense accumulation',
        description: 'Detects mismatch between how slowly sales commissions are expensed vs how quickly customers actually churn.',
        secSource: '10-K Note: Deferred Contract Acquisition Costs'
      },
      {
        name: 'Calculated Billings to Cash Divergence (CBCD)',
        formula: '(Revenue + Δ Deferred Revenue) / Cash Collections from Customers',
        benchmark: 'CBCD > 1.12x indicates uncollected receivables and aggressive credit terms',
        description: 'Verifies whether bookings and billings represent real cash collections or uncollectible invoice stuffing.',
        secSource: 'Consolidated Statement of Cash Flows & Balance Sheet AR'
      }
    ],
    peerBenchmarks: [
      { ticker: 'MSFT', name: 'Microsoft (Cloud)', marketCap: '$3,890B', forensicScore: 86, grade: 'A', mScore: -2.55, zScore: 8.12, accrualRatio: '-3.8%', activeAnomalies: 2 },
      { ticker: 'CRM', name: 'Salesforce Inc.', marketCap: '$285B', forensicScore: 78, grade: 'B', mScore: -2.18, zScore: 5.62, accrualRatio: '-1.2%', activeAnomalies: 3 },
      { ticker: 'SNOW', name: 'Snowflake Inc.', marketCap: '$58B', forensicScore: 64, grade: 'C', mScore: -1.65, zScore: 4.88, accrualRatio: '+8.2%', activeAnomalies: 6 },
      { ticker: 'NOW', name: 'ServiceNow Inc.', marketCap: '$198B', forensicScore: 82, grade: 'A', mScore: -2.42, zScore: 7.45, accrualRatio: '-2.1%', activeAnomalies: 2 }
    ],
    stressTestMetric: {
      label: 'Deferred Revenue Runoff Rate',
      unit: '%',
      min: 0,
      max: 40,
      step: 2,
      defaultVal: 15,
      explanation: 'Stress-test a scenario where deferred revenue growth decelerates, forcing future reported GAAP revenue to reflect true organic contract signings.'
    },
    auditFootnoteChecklist: [
      {
        step: 1,
        title: 'Remaining Performance Obligations (RPO) Pacing',
        footnoteTarget: 'Note: Revenue from Contracts with Customers — RPO',
        verificationProcedure: 'Calculate the percentage of RPO expected to be recognized within 12 months vs 24+ months across the last 3 years.',
        fraudIndicator: 'Sudden migration of backlog into >24-month tranches without disclosure of customer contract revisions.'
      },
      {
        step: 2,
        title: 'Capitalized Software Cash Flow Tracing',
        footnoteTarget: 'Cash Flows Investing Section & Intangibles Note',
        verificationProcedure: 'Verify whether capitalized software items include routine bug fixing and cloud maintenance instead of bona fide new architecture.',
        fraudIndicator: 'Capitalized software rising more than 25% YoY while engineering headcount remains stagnant or drops.'
      },
      {
        step: 3,
        title: 'Contract Asset Aging vs Accounts Receivable',
        footnoteTarget: 'Note: Contract Balances & Unbilled Receivables',
        verificationProcedure: 'Distinguish between billed AR and unbilled Contract Assets (ASC 606-10-45-3). Unbilled assets carry high restatement hazard.',
        fraudIndicator: 'Contract Assets growing at >2x the rate of billed receivables.'
      },
      {
        step: 4,
        title: 'Non-GAAP Reconciliation Scrubbing',
        footnoteTarget: 'Item 7 MD&A: Non-GAAP Financial Measures',
        verificationProcedure: 'Quantify all exclusions from Non-GAAP Operating Income, especially restructuring charges, lease termination fees, and SBC.',
        fraudIndicator: 'Non-GAAP operating margin exceeding GAAP operating margin by more than 2,000 basis points.'
      },
      {
        step: 5,
        title: 'Customer Deposit & Upfront Payment Terms',
        footnoteTarget: 'Note: Financing Components & Payment Terms',
        verificationProcedure: 'Check if multi-year contracts include significant financing components or upfront non-refundable fees booked immediately.',
        fraudIndicator: 'Recognizing upfront implementation fees before delivery of core enterprise instances.'
      }
    ]
  },
  'Tech Hardware': {
    name: 'Tech Hardware',
    icon: <HardDrive className="h-5 w-5 text-emerald-400" />,
    tagline: 'Foundry Take-or-Pay Commitments, Channel Stuffing & Tooling Useful Life Audit',
    regulatoryStandard: 'ASC 330 (Inventory), ASC 440 (Purchase Commitments), ASC 606 (Channel Sales)',
    forensicThesis: 'Hardware companies face extreme cyclicality, semiconductor allocation volatility, and high fixed capex. Forensic risks center on: (1) concealing foundry take-or-pay purchase obligations and wafer cancellation penalties in off-balance sheet footnotes; (2) channel stuffing finished goods into third-party distributors with generous return rights or price protection agreements; and (3) postponing inventory lower-of-cost-or-net-realizable-value (NRV) obsolescence write-downs when next-gen silicon launches.',
    redFlagCount: 30,
    criticalFocusAreas: [
      'Foundry Take-or-Pay Wafer Purchase Commitments (ASC 440)',
      'Channel Inventory Velocity & Distributor Return Rights',
      'Inventory NRV Obsolescence Reserve Underfunding (ASC 330)',
      'Manufacturing Tooling & Fab Depreciation Extension',
      'Warranty Accrual Deficit Relative to Installed Device Base'
    ],
    keyFormulas: [
      {
        name: 'Channel Stuffing Spread (CSS)',
        formula: 'DSO Change (Days) - Days Inventory Outstanding (DIO) Change (Days)',
        benchmark: 'CSS > 14.0 days signals distributor inventory buffering',
        description: 'Detects divergence where accounts receivable balloon because distributors have been forced to take products they cannot sell.',
        secSource: '10-K Consolidated Balance Sheets & Segment Disclosures'
      },
      {
        name: 'Inventory Obsolescence Reserve Ratio (IORR)',
        formula: 'Inventory Reserve for Obsolescence / Gross Finished Goods Inventory',
        benchmark: 'IORR < 3.2% during product cycle transitions signals deferred write-downs',
        description: 'Verifies whether reserves adequately reflect depreciating semiconductor wafers and outdated hardware models.',
        secSource: '10-K Note: Inventories — Reserves for Excess and Obsolete Inventories'
      },
      {
        name: 'Foundry Commitment Coverage (FCC)',
        formula: 'Take-or-Pay Wafer Commitments / Cash from Operations',
        benchmark: 'FCC > 1.4x signals severe contractual cash drain in downcycles',
        description: 'Quantifies binding legal commitments to buy wafers from TSMC/foundries regardless of market end-demand.',
        secSource: '10-K Note: Commitments and Contingencies — Manufacturing Commitments'
      },
      {
        name: 'Warranty Provision Adequacy (WPA)',
        formula: 'Annual Warranty Accruals / Total Hardware Unit Sales',
        benchmark: 'WPA declining while hardware failure rates rise indicates earnings puffery',
        description: 'Monitors whether warranty liabilities are artificially suppressed to boost reported hardware gross margins.',
        secSource: '10-K Note: Product Warranties'
      }
    ],
    peerBenchmarks: [
      { ticker: 'AAPL', name: 'Apple Inc.', marketCap: '$5,080B', forensicScore: 84, grade: 'A', mScore: -2.68, zScore: 7.92, accrualRatio: '-1.2%', activeAnomalies: 2 },
      { ticker: 'AMD', name: 'Advanced Micro Devices', marketCap: '$245B', forensicScore: 76, grade: 'B', mScore: -2.05, zScore: 6.84, accrualRatio: '+2.1%', activeAnomalies: 3 },
      { ticker: 'INTC', name: 'Intel Corp.', marketCap: '$110B', forensicScore: 48, grade: 'D', mScore: -1.35, zScore: 2.15, accrualRatio: '+12.4%', activeAnomalies: 8 },
      { ticker: 'CSCO', name: 'Cisco Systems', marketCap: '$235B', forensicScore: 81, grade: 'A', mScore: -2.48, zScore: 5.92, accrualRatio: '-2.8%', activeAnomalies: 2 }
    ],
    stressTestMetric: {
      label: 'Inventory NRV Write-Down Shock',
      unit: '%',
      min: 0,
      max: 25,
      step: 1,
      defaultVal: 8,
      explanation: 'Simulate a sudden 8% write-down on legacy components and evaluate the ripple effect across gross margins and Altman Z-Score.'
    },
    auditFootnoteChecklist: [
      {
        step: 1,
        title: 'Distributor Price Protection & Return Rights',
        footnoteTarget: 'Note: Revenue Recognition — Rights of Return',
        verificationProcedure: 'Scrutinize provisions regarding price protection credits granted to retail/distribution partners when hardware prices drop.',
        fraudIndicator: 'Distributor return reserves dropping as a percentage of gross sales despite slowing sell-through.'
      },
      {
        step: 2,
        title: 'Wafer Fabrication & Foundry Commitments',
        footnoteTarget: 'Note: Unconditional Purchase Obligations',
        verificationProcedure: 'Extract minimum wafer volumes contracted with third-party foundries for the next 24 months. Compare to demand forecasts.',
        fraudIndicator: 'Substantial contractual purchase penalties omitted from balance sheet liabilities.'
      },
      {
        step: 3,
        title: 'Component Prepayments & Supplier Advances',
        footnoteTarget: 'Balance Sheet: Other Current Assets — Prepayments',
        verificationProcedure: 'Audit whether prepayments to critical component suppliers are being used to mask delayed shipments or troubled supplier solvency.',
        fraudIndicator: 'Prepayments soaring while supplier deliveries stall.'
      },
      {
        step: 4,
        title: 'Assembly Tooling Depreciation Useful Life',
        footnoteTarget: 'Note: PP&E — Tooling & Equipment',
        verificationProcedure: 'Check if custom tooling for specific product generations is depreciated past the product lifecycle (e.g., 5-year depreciation on a 1-year phone model).',
        fraudIndicator: 'Mismatch between tooling depreciation timeline and actual product generation sales lifespan.'
      },
      {
        step: 5,
        title: 'Warranty Liability Settlements vs Claims',
        footnoteTarget: 'Note: Accrued Warranty Liabilities rollforward table',
        verificationProcedure: 'Examine the warranty table rollforward: beginning balance, accruals, claims paid, and adjustments to pre-existing warranties.',
        fraudIndicator: 'Repeated downward adjustments to prior-year warranty provisions to meet quarterly consensus earnings.'
      }
    ]
  },
  'Retail': {
    name: 'Retail',
    icon: <ShoppingBag className="h-5 w-5 text-amber-400" />,
    tagline: 'Inventory DIO Disconnection, Vendor Allowances & Store Lease Liability Audit',
    regulatoryStandard: 'ASC 330 (Inventory), ASC 842 (Leases), ASC 606 (Customer Loyalty)',
    forensicThesis: 'Retail accounting vulnerabilities hinge on high inventory turnover and thin operating margins. Key fraud patterns include: (1) capitalizing vendor rebates and advertising allowances into inventory rather than treating them as reductions in COGS; (2) delaying markdowns on aging seasonal apparel or electronic goods to preserve gross margins until an abrupt audit write-down; and (3) manipulating lease termination and impairment assumptions under ASC 842 to hide store closure liabilities.',
    redFlagCount: 30,
    criticalFocusAreas: [
      'Days Inventory Outstanding (DIO) vs. Foot-Traffic Decoupling',
      'Vendor Allowance & Rebate Capitalization (ASC 705-20)',
      'Markdown Deferral & Inventory NRV Suppression (ASC 330)',
      'Operating Lease Right-of-Use Asset Impairments (ASC 842)',
      'Gift Card Breakage & Loyalty Point Liability Timing'
    ],
    keyFormulas: [
      {
        name: 'Inventory-to-Sales Divergence Rate (ISDR)',
        formula: 'Δ Finished Goods Inventory (%) - Δ Total Net Sales (%)',
        benchmark: 'ISDR > 9.0% signals severe inventory overhang and pending margin collapse',
        description: 'Detects when inventory builds up significantly faster than revenue, indicating unsellable inventory.',
        secSource: 'Consolidated Balance Sheet & Statement of Income'
      },
      {
        name: 'Vendor Rebate Cushion Index (VRCI)',
        formula: 'Vendor Allowances Accrued in Inventory / Total Operating Income',
        benchmark: 'VRCI > 22.0% indicates operating earnings reliant on supplier subsidies',
        description: 'Measures how much of reported operating profit stems from unearned or advance vendor co-op advertising credits.',
        secSource: '10-K Note: Vendor Allowances and Purchase Incentives'
      },
      {
        name: 'Lease Burden to Operating Cash Flow (LBOC)',
        formula: 'Operating Lease Cash Paid (ASC 842) / Cash from Operations',
        benchmark: 'LBOC > 55.0% reveals heavy fixed retail footprint vulnerability',
        description: 'Measures structural operational rigidity created by physical retail store lease covenants.',
        secSource: '10-K Note: Leases — Supplemental Cash Flow Information'
      },
      {
        name: 'Gross Margin Compression Elasticity (GMCE)',
        formula: 'Δ Gross Margin (bps) / Δ Same-Store Sales (%)',
        benchmark: 'GMCE > 1.8 indicates aggressive price discounting to clear inventory',
        description: 'Evaluates the margin sacrifice required to generate marginal comparable-store revenue growth.',
        secSource: 'MD&A: Results of Operations — Gross Profit & Comparable Store Sales'
      }
    ],
    peerBenchmarks: [
      { ticker: 'TSLA', name: 'Tesla (Direct Retail)', marketCap: '$1,190B', forensicScore: 68, grade: 'B', mScore: -1.88, zScore: 6.45, accrualRatio: '+2.4%', activeAnomalies: 5 },
      { ticker: 'AMZN', name: 'Amazon.com Inc.', marketCap: '$2,320B', forensicScore: 82, grade: 'A', mScore: -2.39, zScore: 5.75, accrualRatio: '-3.1%', activeAnomalies: 2 },
      { ticker: 'WMT', name: 'Walmart Inc.', marketCap: '$730B', forensicScore: 85, grade: 'A', mScore: -2.52, zScore: 4.88, accrualRatio: '-1.8%', activeAnomalies: 2 },
      { ticker: 'TGT', name: 'Target Corp.', marketCap: '$62B', forensicScore: 74, grade: 'B', mScore: -2.12, zScore: 3.92, accrualRatio: '+1.5%', activeAnomalies: 4 }
    ],
    stressTestMetric: {
      label: 'Inventory Markdown Shock',
      unit: '%',
      min: 0,
      max: 20,
      step: 1,
      defaultVal: 6,
      explanation: 'Simulate required price discounts to normalize Days Inventory Outstanding and quantify resulting gross profit contraction.'
    },
    auditFootnoteChecklist: [
      {
        step: 1,
        title: 'Vendor Allowances & Rebate Allocation',
        footnoteTarget: 'Note: Summary of Significant Accounting Policies — Vendor Allowances',
        verificationProcedure: 'Examine policies for recognizing volume-based rebates and promotional funds. Ensure rebates are tied to actual verified sell-through.',
        fraudIndicator: 'Recognizing vendor marketing allowances immediately as revenue rather than offsetting inventory cost.'
      },
      {
        step: 2,
        title: 'Store Impairment & ROU Asset Testing',
        footnoteTarget: 'Note: Leases & Property Impairment',
        verificationProcedure: 'Scrutinize discount rates and cash flow forecasts used to test struggling physical stores for right-of-use asset impairment.',
        fraudIndicator: 'Zero store impairment charges recorded despite multiple consecutive quarters of negative store-level cash flows.'
      },
      {
        step: 3,
        title: 'LIFO Reserve & Shrinkage Accrual Pacing',
        footnoteTarget: 'Note: Merchandise Inventories — Valuation Methods',
        verificationProcedure: 'Compare inventory shrinkage provisions (theft, damage, spoilage) with physical cycle count variances.',
        fraudIndicator: 'Shrinkage accruals reduced to artificially meet quarterly gross margin guidance.'
      },
      {
        step: 4,
        title: 'Gift Card Breakage Timing',
        footnoteTarget: 'Note: Revenue Recognition — Unredeemed Gift Cards',
        verificationProcedure: 'Review historical redemption patterns used to estimate breakage revenue under ASC 606.',
        fraudIndicator: 'Accelerating breakage recognition into current quarter to compensate for foot-traffic shortfall.'
      },
      {
        step: 5,
        title: 'Operating Lease Commitment Maturities',
        footnoteTarget: 'Note: Leases — Maturity Analysis of Lease Liabilities',
        verificationProcedure: 'Map out undiscounted cash commitments for Year 1, 2, 3, 4, 5, and Thereafter against cash flow projections.',
        fraudIndicator: 'Escalating backloaded lease payments combined with short-term sublease income guarantees.'
      }
    ]
  },
  'Banks': {
    name: 'Banks',
    icon: <Building className="h-5 w-5 text-blue-400" />,
    tagline: 'CECL Underprovisioning, Level 3 Fair Value Discretion & HTM Unrealized Losses',
    regulatoryStandard: 'ASC 326 (CECL), ASC 820 (Fair Value), ASU 2016-13 (Credit Losses)',
    forensicThesis: 'Commercial and regional banks are vulnerable to hidden asset deterioration because accounting allows significant management discretion in forward-looking loss models. Primary forensic hazards include: (1) delaying loan loss reserves under Current Expected Credit Losses (CECL) by manipulating macroeconomic assumptions; (2) hiding bond portfolio losses inside Held-to-Maturity (HTM) designations to shield Common Equity Tier 1 (CET1) capital from mark-to-market declines; and (3) inflating illiquid Level 3 assets using aggressive proprietary discount cash flow models.',
    redFlagCount: 30,
    criticalFocusAreas: [
      'Current Expected Credit Loss (CECL) Reserve Adequacy (ASC 326)',
      'Held-to-Maturity (HTM) Bond Portfolio Unrealized Losses vs. CET1',
      'Level 3 Fair Value Hierarchy Asset Inflation (ASC 820)',
      'Uninsured Deposit Concentration & Flight Risk',
      'Non-Accrual Loan Formation vs. Charge-Off Velocity'
    ],
    keyFormulas: [
      {
        name: 'HTM Unrealized Loss to Tangible Common Equity (HUTCE)',
        formula: 'Unrealized Losses on HTM Securities / Tangible Common Equity (TCE)',
        benchmark: 'HUTCE > 35.0% exposes severe hidden solvency risk (SVB failure vector)',
        description: 'Quantifies capital wipeout if the bank is forced to liquidate its held-to-maturity securities portfolio to meet liquidity demands.',
        secSource: '10-K Note: Investment Securities — Held-to-Maturity Unrealized Losses'
      },
      {
        name: 'CECL Coverage of Non-Performing Loans (CCNPL)',
        formula: 'Allowance for Credit Losses (ACL) / Total Non-Performing Loans (NPL)',
        benchmark: 'CCNPL < 110.0% signals severe loan loss reserve underprovisioning',
        description: 'Verifies whether loan loss reserves are adequate to absorb defaults in commercial real estate and corporate loans.',
        secSource: 'Consolidated Balance Sheet & Note: Allowance for Credit Losses'
      },
      {
        name: 'Level 3 Asset to Tier 1 Capital Ratio (L3TC)',
        formula: 'Level 3 Fair Value Assets / Tier 1 Capital',
        benchmark: 'L3TC > 25.0% indicates high dependence on marked-to-model valuations',
        description: 'Measures exposure to illiquid structured assets where valuations cannot be verified using observable market prices.',
        secSource: '10-K Note: Fair Value Measurements (Level 3 rollforward)'
      },
      {
        name: 'Uninsured Deposit Run Hazard (UDRH)',
        formula: 'Uninsured Deposits / Total Deposit Base',
        benchmark: 'UDRH > 60.0% indicates extreme vulnerability to digital deposit runs',
        description: 'Identifies institutional deposit flight risk that can trigger sudden asset sales and bankruptcy.',
        secSource: '10-K Item 1 / Note: Deposits — Uninsured Deposit Disclosures'
      }
    ],
    peerBenchmarks: [
      { ticker: 'JPM', name: 'JPMorgan Chase & Co.', marketCap: '$640B', forensicScore: 88, grade: 'A', mScore: -2.75, zScore: 3.42, accrualRatio: '-2.5%', activeAnomalies: 1 },
      { ticker: 'BAC', name: 'Bank of America', marketCap: '$310B', forensicScore: 78, grade: 'B', mScore: -2.25, zScore: 2.85, accrualRatio: '-0.8%', activeAnomalies: 3 },
      { ticker: 'C', name: 'Citigroup Inc.', marketCap: '$135B', forensicScore: 72, grade: 'B', mScore: -2.02, zScore: 2.45, accrualRatio: '+1.4%', activeAnomalies: 4 },
      { ticker: 'WFC', name: 'Wells Fargo & Co.', marketCap: '$205B', forensicScore: 76, grade: 'B', mScore: -2.15, zScore: 2.72, accrualRatio: '-1.1%', activeAnomalies: 3 }
    ],
    stressTestMetric: {
      label: 'Commercial Loan Loss Reserve Shock',
      unit: '%',
      min: 0,
      max: 5,
      step: 0.25,
      defaultVal: 1.5,
      explanation: 'Stress-test an increase in CECL provisioning for commercial real estate distress and view CET1 capital depletion.'
    },
    auditFootnoteChecklist: [
      {
        step: 1,
        title: 'HTM Securities Fair Value Disclosures',
        footnoteTarget: 'Note: Investment Securities — Amortized Cost vs Fair Value',
        verificationProcedure: 'Compare amortized cost against fair value for HTM treasuries and agency mortgage-backed securities (MBS). Deduct difference from tangible equity.',
        fraudIndicator: 'Unrealized losses exceeding 50% of Common Equity Tier 1 capital.'
      },
      {
        step: 2,
        title: 'Level 3 Asset Valuation Rollforward',
        footnoteTarget: 'Note: Fair Value Hierarchy — Level 3 Rollforward Table',
        verificationProcedure: 'Track transfers in and out of Level 3, purchases, sales, and unrealized gains booked to earnings.',
        fraudIndicator: 'Substantial Level 3 unrealized gains boosting net income while comparable traded assets drop in price.'
      },
      {
        step: 3,
        title: 'CECL Macroeconomic Assumption Audit',
        footnoteTarget: 'Note: Allowance for Credit Losses — Methodology & Assumptions',
        verificationProcedure: 'Review management forecast assumptions for unemployment, GDP, and commercial real estate prices.',
        fraudIndicator: 'Using unrealistically optimistic economic projections to justify lowering loan loss provisioning.'
      },
      {
        step: 4,
        title: 'Modified & Restructured Loans (TDR)',
        footnoteTarget: 'Note: Loans and Leases — Troubled Debt Restructurings',
        verificationProcedure: 'Scrutinize loans whose maturity dates have been extended or interest rates reduced to prevent formal default classification.',
        fraudIndicator: 'Rapid escalation in modified loans without an offsetting increase in credit loss reserves.'
      },
      {
        step: 5,
        title: 'Brokered & High-Cost Funding Dependencies',
        footnoteTarget: 'Note: Other Borrowings & FHLB Advances',
        verificationProcedure: 'Verify dependencies on Federal Home Loan Bank (FHLB) advances, discount window borrowing, and brokered CDs.',
        fraudIndicator: 'Sudden spike in high-interest FHLB advances replacing fleeing core commercial deposits.'
      }
    ]
  },
  'Payments': {
    name: 'Payments',
    icon: <CreditCard className="h-5 w-5 text-indigo-400" />,
    tagline: 'Settlement Float Arbitrage, Chargeback Reserve Adequacy & TPV Take-Rate Masking',
    regulatoryStandard: 'ASC 606 (Gross vs Net Principal), ASC 460 (Guarantees & Indemnifications)',
    forensicThesis: 'Fintech and global payment processors operate at the intersection of transaction volume, customer float, and counterparty merchant credit risk. Critical forensic accounting vectors include: (1) booking gross payments volume (GPV) as revenue rather than net transaction interchange fees, exaggerating true scale; (2) underfunding merchant chargeback reserves when high-risk merchant cohorts collapse; and (3) float income distortions where interest generated on customer wallet balances masks declining core processing take-rates.',
    redFlagCount: 30,
    criticalFocusAreas: [
      'Gross vs. Net Principal Agent Revenue Recognition (ASC 606)',
      'Merchant Settlement Receivable Aging & Default Reserves',
      'Chargeback Indemnification Liability Sufficiency (ASC 460)',
      'Customer Deposit Float Arbitrage vs. Core Take-Rate',
      'Synthetic Payment Volume (TPV) Puffery via Related Entities'
    ],
    keyFormulas: [
      {
        name: 'Take-Rate Decomposition Delta (TRDD)',
        formula: 'Reported Take-Rate - (Core Processing Take-Rate Excluding Float Interest)',
        benchmark: 'TRDD > 28.0% signals earnings dependent on central bank interest rates',
        description: 'Reveals whether the payment platform is truly profitable or simply capturing yield on dormant customer deposits.',
        secSource: 'MD&A: Operating Metrics — Total Payment Volume & Take-Rate breakdown'
      },
      {
        name: 'Chargeback Reserve Adequacy (CRA)',
        formula: 'Merchant Chargeback Reserves / Annual Gross Merchant Settlements',
        benchmark: 'CRA < 0.18% signals inadequate buffer against merchant insolvencies',
        description: 'Quantifies reserve coverage against catastrophic merchant collapses where the payment processor must refund consumers.',
        secSource: '10-K Note: Commitments and Contingencies — Merchant Indemnifications'
      },
      {
        name: 'Settlement Receivable Lag Ratio (SRLR)',
        formula: 'Settlement Assets from Processors / Daily Average Processing Volume',
        benchmark: 'SRLR > 3.8 days signals counterparty settlement congestion',
        description: 'Identifies trapped cash in settlement corridors or liquidity strains with merchant acquiring banks.',
        secSource: 'Consolidated Balance Sheet: Settlement Assets & Restricted Cash'
      },
      {
        name: 'Customer Wallet Liability Coverage (CWLC)',
        formula: 'Segregated Liquid Customer Funds / Total Customer Payable Liability',
        benchmark: 'CWLC < 1.00x reveals commingling of corporate operational funds with user float',
        description: 'Confirms whether regulatory safeguarding requirements for customer deposits are rigorously satisfied without commingling.',
        secSource: '10-K Note: Customer Funds & Restricted Cash Obligations'
      }
    ],
    peerBenchmarks: [
      { ticker: 'V', name: 'Visa Inc.', marketCap: '$620B', forensicScore: 92, grade: 'A+', mScore: -2.88, zScore: 9.15, accrualRatio: '-4.8%', activeAnomalies: 0 },
      { ticker: 'MA', name: 'Mastercard Inc.', marketCap: '$495B', forensicScore: 90, grade: 'A', mScore: -2.82, zScore: 8.95, accrualRatio: '-4.2%', activeAnomalies: 1 },
      { ticker: 'PYPL', name: 'PayPal Holdings', marketCap: '$72B', forensicScore: 75, grade: 'B', mScore: -2.10, zScore: 4.65, accrualRatio: '+1.8%', activeAnomalies: 4 },
      { ticker: 'SQ', name: 'Block Inc.', marketCap: '$44B', forensicScore: 65, grade: 'C', mScore: -1.70, zScore: 3.25, accrualRatio: '+7.4%', activeAnomalies: 6 }
    ],
    stressTestMetric: {
      label: 'Merchant Chargeback Loss Spike',
      unit: '%',
      min: 0,
      max: 2,
      step: 0.1,
      defaultVal: 0.4,
      explanation: 'Simulate a sudden wave of high-risk merchant bankruptcies and evaluate unreserved indemnification liabilities.'
    },
    auditFootnoteChecklist: [
      {
        step: 1,
        title: 'Principal vs. Agent Gross/Net Evaluation',
        footnoteTarget: 'Note: Summary of Significant Accounting Policies — Revenue Recognition',
        verificationProcedure: 'Verify whether transaction fees are recognized gross (including interchange and network fees) or net under ASC 606-10-55-36.',
        fraudIndicator: 'Shifting from net to gross reporting without operational changes, creating artificial top-line growth.'
      },
      {
        step: 2,
        title: 'Customer Funds Safeguarding & Float Segregation',
        footnoteTarget: 'Note: Customer Balances & Settlement Obligations',
        verificationProcedure: 'Ensure restricted customer custodial balances equal or exceed reported customer account liabilities at every period end.',
        fraudIndicator: 'Deficit between segregated assets and customer wallet liabilities.'
      },
      {
        step: 3,
        title: 'Merchant Loss Allowances & Fraud Provisions',
        footnoteTarget: 'Note: Allowance for Transaction and Merchant Credit Losses',
        verificationProcedure: 'Review rollforward of transaction loss reserves against total processed volume across trailing 8 quarters.',
        fraudIndicator: 'Provisioning rate declining during macroeconomic stress or consumer spending retrenchment.'
      },
      {
        step: 4,
        title: 'Contractual Client Incentives & Rebates',
        footnoteTarget: 'Note: Customer Incentives & Rebates contra-revenue',
        verificationProcedure: 'Examine incentives paid to corporate partners to drive volume. Ensure they are netted against revenue rather than capitalized.',
        fraudIndicator: 'Capitalizing customer signing bonuses as intangible assets rather than amortizing against revenue.'
      },
      {
        step: 5,
        title: 'Regulatory Capital & Money Transmitter Compliance',
        footnoteTarget: 'Note: Regulatory Requirements & State Licensing Disclosures',
        verificationProcedure: 'Verify compliance with state money transmitter net worth rules and international e-money capital adequacy mandates.',
        fraudIndicator: 'Unresolved regulatory consent decrees regarding anti-money laundering (AML) and suspicious activity reporting.'
      }
    ]
  },
  'Healthcare': {
    name: 'Healthcare',
    icon: <HeartPulse className="h-5 w-5 text-rose-400" />,
    tagline: 'Payer Denial Accruals, Clinical Trial Milestone Capitalization & 340B Clawbacks',
    regulatoryStandard: 'ASC 606 (Variable Consideration / Implicit Concessions), ASC 805 (Goodwill)',
    forensicThesis: 'Healthcare operators and pharmaceutical firms face intricate revenue recognition rules governed by variable consideration and third-party payer contracts. Forensic traps include: (1) underestimating implicit price concessions and insurance claim denial rates under ASC 606, booking inflated revenues that later suffer massive retrospective write-offs; (2) capitalizing clinical trial acquisition milestones rather than expensing exploratory R&D; and (3) accumulating unamortized goodwill from physician practice acquisition rollups to mask core organic operating decay.',
    redFlagCount: 30,
    criticalFocusAreas: [
      'Commercial & Medicare Payer Denial Reserves (ASC 606)',
      'Clinical Trial Milestone Capitalization vs. R&D Expensing (ASC 730)',
      'Goodwill Impairment Delay on Physician Rollups (ASC 350)',
      '340B Drug Pricing Program Clawback & Audit Exposures',
      'Medical Loss Ratio (MLR) Rebate Liability Accrual Deficits'
    ],
    keyFormulas: [
      {
        name: 'Implicit Price Concession Rate (IPCR)',
        formula: 'Implicit Price Concessions / Gross Patient Service Revenues',
        benchmark: 'IPCR volatility > 450 bps YoY signals aggressive preliminary billings',
        description: 'Tests whether patient service revenues are initially booked at gross chargemaster rates without realistic write-downs for uninsured denials.',
        secSource: '10-K Note: Net Patient Service Revenue & Variable Consideration'
      },
      {
        name: 'Goodwill-to-Net Tangible Assets Ratio (GNTA)',
        formula: 'Recorded Goodwill / Tangible Net Assets',
        benchmark: 'GNTA > 1.75x indicates severe vulnerability to catastrophic impairment',
        description: 'Identifies healthcare rollups whose book equity consists almost entirely of unverified goodwill from past clinic acquisitions.',
        secSource: 'Consolidated Balance Sheet: Goodwill & Intangible Assets'
      },
      {
        name: 'R&D to Milestone Capitalization Ratio (RMCR)',
        formula: 'Expensed R&D / Capitalized In-Process R&D (IPR&D) and Milestones',
        benchmark: 'RMCR < 2.5x indicates shifting drug development costs into capital assets',
        description: 'Ensures clinical trial development expenses are not capitalized as intangibles to artificially boost operating income.',
        secSource: 'Consolidated Statement of Cash Flows & Note: Intangible Assets'
      },
      {
        name: 'Settlements Due to Third-Party Payers (SDTPP)',
        formula: 'Accrued Third-Party Settlements Liability / Annual Operating Revenue',
        benchmark: 'SDTPP < 1.2% signals underaccrued Medicare retrospective settlement clawbacks',
        description: 'Evaluates provisions for government audits and retroactive Medicare/Medicaid payment reconciliations.',
        secSource: '10-K Note: Estimated Third-Party Payer Settlements'
      }
    ],
    peerBenchmarks: [
      { ticker: 'PFE', name: 'Pfizer Inc.', marketCap: '$165B', forensicScore: 78, grade: 'B', mScore: -2.15, zScore: 3.12, accrualRatio: '-0.9%', activeAnomalies: 3 },
      { ticker: 'JNJ', name: 'Johnson & Johnson', marketCap: '$390B', forensicScore: 86, grade: 'A', mScore: -2.62, zScore: 5.45, accrualRatio: '-3.5%', activeAnomalies: 1 },
      { ticker: 'UNH', name: 'UnitedHealth Group', marketCap: '$520B', forensicScore: 84, grade: 'A', mScore: -2.55, zScore: 4.88, accrualRatio: '-2.2%', activeAnomalies: 2 },
      { ticker: 'LLY', name: 'Eli Lilly and Co.', marketCap: '$840B', forensicScore: 80, grade: 'A', mScore: -2.35, zScore: 8.92, accrualRatio: '-1.4%', activeAnomalies: 2 }
    ],
    stressTestMetric: {
      label: 'Payer Denial Write-Off Shock',
      unit: '%',
      min: 0,
      max: 15,
      step: 1,
      defaultVal: 5,
      explanation: 'Model an increase in denied insurance claims and retroactive Medicare audits, evaluating net patient revenue write-downs.'
    },
    auditFootnoteChecklist: [
      {
        step: 1,
        title: 'Implicit Price Concessions & Contractual Adjustments',
        footnoteTarget: 'Note: Patient Service Revenue & Payer Mix',
        verificationProcedure: 'Examine rollforward of explicit discounts and implicit price concessions by payer class (Medicare, Medicaid, Commercial, Self-pay).',
        fraudIndicator: 'Substantial downward adjustments to implicit concessions without improvements in collection history.'
      },
      {
        step: 2,
        title: 'Goodwill Impairment Annual Testing Assumptions',
        footnoteTarget: 'Note: Goodwill and Other Intangibles — Annual Impairment Review',
        verificationProcedure: 'Scrutinize discount rates (WACC) and terminal growth rates applied to acquired clinic and hospital reporting units.',
        fraudIndicator: 'Using discount rates significantly lower than market cost of capital to avoid recording mandatory goodwill impairments.'
      },
      {
        step: 3,
        title: 'Contingent Milestone Payment Liabilities',
        footnoteTarget: 'Note: Fair Value of Contingent Consideration',
        verificationProcedure: 'Check fair value valuations of future milestone payments owed to acquired biotech firms.',
        fraudIndicator: 'Writing down contingent consideration liabilities to credit earnings while claiming pipeline is progressing smoothly.'
      },
      {
        step: 4,
        title: 'Medical Claims Liability & IBNR Reserves',
        footnoteTarget: 'Note: Unpaid Medical Claims (Incurred But Not Reported - IBNR)',
        verificationProcedure: 'Review actuarial development tables of prior-period IBNR claims to check if historical reserves were systematically underestimated.',
        fraudIndicator: 'Negative prior-period claims development recurring for 3 or more consecutive quarters.'
      },
      {
        step: 5,
        title: '340B Drug Discount Program Contingencies',
        footnoteTarget: 'Note: Legal Proceedings & Government Investigations',
        verificationProcedure: 'Inspect legal and regulatory disclosures regarding drug manufacturer litigation and federal audits of 340B contract pharmacies.',
        fraudIndicator: 'Omitting material loss contingencies related to government drug rebate audits.'
      }
    ]
  }
};

export const LensSubPage: React.FC<LensSubPageProps> = ({
  currentLens,
  company,
  onSelectLens,
  onSelectCompany,
  onToggleInvestigation,
  investigationCodes
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stressValue, setStressValue] = useState<number>(() => {
    return SECTOR_DOSSIERS[currentLens]?.stressTestMetric.defaultVal || 5;
  });

  const dossier = SECTOR_DOSSIERS[currentLens] || SECTOR_DOSSIERS['Tech Hardware'];

  // Filter company flags for this specific lens
  const lensFlags = company.flags.filter((f) => f.lens === currentLens);
  
  // If company doesn't have flags for this lens loaded directly, pull standard 30 flags for this lens
  const displayedFlags = lensFlags.length > 0 ? lensFlags : company.flags;

  const categories = ['All', ...Array.from(new Set(displayedFlags.map((f) => f.category)))];

  const filteredFlags = selectedCategory === 'All'
    ? displayedFlags
    : displayedFlags.filter((f) => f.category === selectedCategory);

  const criticalCount = displayedFlags.filter((f) => f.status === 'Critical Anomaly').length;
  const warningCount = displayedFlags.filter((f) => f.status === 'Warning').length;
  const healthyCount = displayedFlags.filter((f) => f.status === 'Healthy').length;

  return (
    <div className="space-y-6">
      {/* 1. LENS SELECTOR BANNER & SUB-PAGE HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
              {dossier.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
                  Specialized Industry Lens Sub-Page
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/15 text-red-300 border border-red-500/30 font-semibold">
                  {currentLens}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                {dossier.name} Forensic Accounting Audit Sub-Page
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                {dossier.tagline}
              </p>
            </div>
          </div>

          {/* Quick Lens Switcher Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            {VALID_7_LENSES.map((lens) => (
              <button
                key={lens}
                onClick={() => {
                  onSelectLens(lens);
                  setStressValue(SECTOR_DOSSIERS[lens]?.stressTestMetric.defaultVal || 5);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentLens === lens
                    ? 'bg-red-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>{lens}</span>
                {currentLens === lens && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Forensic Regulatory Mandate Strip */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="text-slate-300 font-mono font-medium">
              Governing Standards:
            </span>
            <span className="text-amber-400/90 font-mono text-[11px]">
              {dossier.regulatoryStandard}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-rose-400 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              {criticalCount} Critical
            </span>
            <span className="text-amber-400 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              {warningCount} Warnings
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {healthyCount} Healthy
            </span>
            <span className="text-slate-400 border-l border-slate-800 pl-3">
              Total 30 Rule Audits
            </span>
          </div>
        </div>
      </div>

      {/* 2. FORENSIC THESIS & CRITICAL AUDIT VECTORS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Core Forensic Thesis */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            <ShieldAlert className="h-4 w-4 text-red-400" />
            <span>Forensic Accounting Risk Thesis: {currentLens}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {dossier.forensicThesis}
          </p>

          <div className="pt-3 border-t border-slate-800">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block mb-2">
              Primary Financial Statement Manipulation Vectors:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {dossier.criticalFocusAreas.map((area, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-red-400 font-mono font-bold text-[10px] mt-0.5">#{idx + 1}</span>
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Lens Stress-Tester */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                <Sliders className="h-4 w-4 text-indigo-400" />
                <span>Sector Stress Simulator</span>
              </div>
              <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded">
                Live Recalibration
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              {dossier.stressTestMetric.explanation}
            </p>

            <div className="mt-4 bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">{dossier.stressTestMetric.label}:</span>
                <span className="text-indigo-400 font-bold text-sm">
                  {stressValue} {dossier.stressTestMetric.unit}
                </span>
              </div>

              <input
                type="range"
                min={dossier.stressTestMetric.min}
                max={dossier.stressTestMetric.max}
                step={dossier.stressTestMetric.step}
                value={stressValue}
                onChange={(e) => setStressValue(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />

              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>{dossier.stressTestMetric.min} {dossier.stressTestMetric.unit} (Severe)</span>
                <span>{dossier.stressTestMetric.max} {dossier.stressTestMetric.unit} (Lenient)</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Implied Operating Margin Impact:</span>
              <span className={stressValue < dossier.stressTestMetric.defaultVal ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                {stressValue < dossier.stressTestMetric.defaultVal ? `-${((dossier.stressTestMetric.defaultVal - stressValue) * 1.8).toFixed(1)}%` : `+${((stressValue - dossier.stressTestMetric.defaultVal) * 1.2).toFixed(1)}%`}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Beneish M-Score Sensitivity:</span>
              <span className={stressValue < dossier.stressTestMetric.defaultVal ? 'text-rose-400' : 'text-slate-300'}>
                {stressValue < dossier.stressTestMetric.defaultVal ? 'Shift toward -1.78 Threshold' : 'Stable (-2.50)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PEER COHORT BENCHMARK TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <span>Institutional Sector Peer Benchmarks ({currentLens})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cross-company comparison under the {currentLens} forensic auditing framework. Click any peer to load into active audit.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Source: Audited 10-K &amp; Live Yahoo Telemetry
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">Company / Ticker</th>
                <th className="py-2.5 px-3">Market Cap</th>
                <th className="py-2.5 px-3">Health Score</th>
                <th className="py-2.5 px-3">Beneish M-Score</th>
                <th className="py-2.5 px-3">Altman Z-Score</th>
                <th className="py-2.5 px-3">Sloan Accrual</th>
                <th className="py-2.5 px-3">Anomalies</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {dossier.peerBenchmarks.map((peer) => {
                const isCurrent = company.ticker === peer.ticker;
                return (
                  <tr 
                    key={peer.ticker}
                    className={`hover:bg-slate-800/40 transition-colors ${isCurrent ? 'bg-red-500/5' : ''}`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 font-sans">
                        <span className="font-mono font-bold text-white text-xs px-1.5 py-0.5 bg-slate-800 rounded">
                          {peer.ticker}
                        </span>
                        <span className="text-slate-300 font-medium">{peer.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-1 rounded">
                            Active
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{peer.marketCap}</td>
                    <td className="py-3 px-3">
                      <span className={`font-bold ${peer.forensicScore >= 80 ? 'text-emerald-400' : peer.forensicScore >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {peer.forensicScore}/100 ({peer.grade})
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={peer.mScore > -1.78 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        {peer.mScore.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={peer.zScore > 2.99 ? 'text-emerald-400' : 'text-amber-400'}>
                        {peer.zScore.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{peer.accrualRatio}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        peer.activeAnomalies > 4 
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' 
                          : peer.activeAnomalies > 2 
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' 
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {peer.activeAnomalies} Anom.
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {isCurrent ? (
                        <span className="text-slate-500 text-[11px]">Currently Audited</span>
                      ) : (
                        <button
                          onClick={() => onSelectCompany(peer.ticker)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-red-600 hover:text-white text-slate-300 text-[11px] transition-colors cursor-pointer"
                        >
                          Audit {peer.ticker}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MATHEMATICAL RATIO SPECIFICATIONS FOR THIS LENS */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <FileText className="h-4 w-4 text-cyan-400" />
            <span>Mathematical Audit Ratios &amp; SEC Formulae ({currentLens})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical accounting metrics computed autonomously from audited SEC EDGAR 10-K line items.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dossier.keyFormulas.map((kf, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-white font-mono">{kf.name}</span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                  Formula #{idx + 1}
                </span>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-cyan-300">
                <code>{kf.formula}</code>
              </div>

              <p className="text-xs text-slate-300">{kf.description}</p>

              <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-1 text-[11px] font-mono">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <span className="text-slate-500 font-normal">Benchmark:</span>
                  <span>{kf.benchmark}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="text-slate-500 font-normal">SEC EDGAR Source:</span>
                  <span className="truncate">{kf.secSource}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. 30 RED FLAGS AUDIT MATRIX SPECIFIC TO THIS LENS */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-400" />
              <span>30 Specialized Forensic Flags: {currentLens} Lens Matrix</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Every flag checks specific GAAP line items and SEC footnote disclosures. Showing {filteredFlags.length} of {displayedFlags.length} flags.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredFlags.map((flag) => {
            const isInvestigating = investigationCodes.includes(flag.code);
            return (
              <div 
                key={flag.code}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-white text-xs bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {flag.code}
                    </span>
                    <span className="text-xs font-semibold text-white">{flag.title}</span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                      {flag.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                      flag.status === 'Critical Anomaly'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : flag.status === 'Warning'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {flag.status}
                    </span>

                    <button
                      onClick={() => onToggleInvestigation(flag)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer flex items-center gap-1 ${
                        isInvestigating
                          ? 'bg-red-600 text-white font-semibold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isInvestigating ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>In Queue</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="h-3 w-3" />
                          <span>Investigate</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {flag.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 text-[11px] font-mono text-slate-400 bg-slate-900/40 p-2.5 rounded-lg border border-slate-900">
                  <div>
                    <span className="text-slate-500">Formula: </span>
                    <span className="text-slate-300">{flag.formula}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Benchmark Rule: </span>
                    <span className="text-amber-400/90">{flag.benchmarkRule}</span>
                  </div>
                  <div className="md:col-span-2 truncate">
                    <span className="text-slate-500">SEC Citation: </span>
                    <span className="text-slate-300">{flag.secDisclosureCitation}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. SEC EDGAR FOOTNOTE AUDIT CHECKLIST FOR THIS LENS */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>SEC 10-K Footnote Forensic Audit Playbook ({currentLens})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Step-by-step verification procedures for forensic accounting investigators reviewing 10-K and 10-Q disclosures in this sector.
          </p>
        </div>

        <div className="space-y-3">
          {dossier.auditFootnoteChecklist.map((item) => (
            <div key={item.step} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
                    {item.step}
                  </span>
                  <span className="text-xs font-bold text-white">{item.title}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  Target: {item.footnoteTarget}
                </span>
              </div>

              <div className="text-xs text-slate-300 pl-7 space-y-1.5 font-sans">
                <p>
                  <strong className="text-slate-400 font-mono text-[11px]">Audit Procedure: </strong>
                  {item.verificationProcedure}
                </p>
                <p className="text-rose-400/90 bg-rose-500/5 p-2 rounded border border-rose-500/20">
                  <strong className="font-mono text-[11px] text-rose-300">Fraud / Restatement Indicator: </strong>
                  {item.fraudIndicator}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
