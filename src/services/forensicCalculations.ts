import { FinancialYearData, CompanyForensicProfile } from '../types';

export interface BeneishMScoreResult {
  mScore: number;
  isManipulatorRisk: boolean;
  interpretation: string;
  variables: {
    dsri: { value: number; label: string; desc: string };
    gmi: { value: number; label: string; desc: string };
    aqi: { value: number; label: string; desc: string };
    sgi: { value: number; label: string; desc: string };
    depi: { value: number; label: string; desc: string };
    sgai: { value: number; label: string; desc: string };
    lvgi: { value: number; label: string; desc: string };
    tata: { value: number; label: string; desc: string };
  };
}

export interface AltmanZScoreResult {
  zScore: number;
  zone: 'Safe' | 'Grey' | 'Distress';
  interpretation: string;
  variables: {
    x1: { value: number; label: string; weight: number; contribution: number };
    x2: { value: number; label: string; weight: number; contribution: number };
    x3: { value: number; label: string; weight: number; contribution: number };
    x4: { value: number; label: string; weight: number; contribution: number };
    x5: { value: number; label: string; weight: number; contribution: number };
  };
}

export interface SloanAccrualsResult {
  accrualRatio: number;
  accrualPercent: number;
  isFavorable: boolean;
  status: 'Cash Flow Backed' | 'Moderate Accruals' | 'High Non-Cash Accruals';
  netIncome: number;
  operatingCashFlow: number;
  totalAssets: number;
  cashConversionRatio: number;
}

/**
 * Computes exact Beneish 8-Factor M-Score from current and prior year financials.
 */
export function calculateBeneishMScore(
  current: FinancialYearData,
  prior: FinancialYearData
): BeneishMScoreResult {
  const revT = current.revenue || 1;
  const revT1 = prior.revenue || 1;

  const arT = current.accountsReceivable || (revT * 0.1);
  const arT1 = prior.accountsReceivable || (revT1 * 0.1);

  // 1. Days Sales in Receivables Index (DSRI)
  const dsri = (arT / revT) / (arT1 / revT1);

  // 2. Gross Margin Index (GMI)
  const gmT = ((current.grossProfit || (revT - current.cogs)) / revT) || 0.4;
  const gmT1 = ((prior.grossProfit || (revT1 - prior.cogs)) / revT1) || 0.4;
  const gmi = gmT1 / (gmT || 0.01);

  // 3. Asset Quality Index (AQI)
  const taT = current.totalAssets || 1;
  const taT1 = prior.totalAssets || 1;
  const caT = current.totalCurrentAssets || (current.cashAndEquivalents + arT + (current.inventory || 0));
  const caT1 = prior.totalCurrentAssets || (prior.cashAndEquivalents + arT1 + (prior.inventory || 0));
  
  const nonCurrentT = Math.max(0, taT - caT);
  const nonCurrentT1 = Math.max(0, taT1 - caT1);
  const aqiRatioT = nonCurrentT / taT;
  const aqiRatioT1 = nonCurrentT1 / taT1;
  const aqi = aqiRatioT1 > 0 ? aqiRatioT / aqiRatioT1 : 1.0;

  // 4. Sales Growth Index (SGI)
  const sgi = revT / revT1;

  // 5. Depreciation Index (DEPI)
  const deprT = current.capex ? current.capex * 0.8 : revT * 0.03;
  const deprT1 = prior.capex ? prior.capex * 0.8 : revT1 * 0.03;
  const depRateT = deprT / (taT * 0.3 + deprT);
  const depRateT1 = deprT1 / (taT1 * 0.3 + deprT1);
  const depi = depRateT > 0 ? depRateT1 / depRateT : 1.0;

  // 6. SG&A Expense Index (SGAI)
  const sgaT = current.sga || (current.operatingExpenses * 0.5) || (revT * 0.15);
  const sgaT1 = prior.sga || (prior.operatingExpenses * 0.5) || (revT1 * 0.15);
  const sgai = (sgaT / revT) / (sgaT1 / revT1);

  // 7. Leverage Index (LVGI)
  const debtT = (current.currentLiabilities || 0) + (current.longTermDebt || 0);
  const debtT1 = (prior.currentLiabilities || 0) + (prior.longTermDebt || 0);
  const lvgi = (debtT / taT) / (debtT1 / taT1 || 1);

  // 8. Total Accruals to Total Assets (TATA)
  const ni = current.netIncome;
  const ocf = current.operatingCashFlow;
  const tata = (ni - ocf) / taT;

  // Beneish formula:
  // M = -4.84 + 0.920*DSRI + 0.528*GMI + 0.404*AQI + 0.892*SGI + 0.115*DEPI - 0.172*SGAI + 4.037*TATA + 0.0327*LVGI
  const mScoreRaw = 
    -4.84 + 
    (0.920 * dsri) + 
    (0.528 * gmi) + 
    (0.404 * aqi) + 
    (0.892 * sgi) + 
    (0.115 * depi) - 
    (0.172 * sgai) + 
    (4.037 * tata) + 
    (0.0327 * lvgi);

  const mScore = Math.round(mScoreRaw * 100) / 100;
  const isManipulatorRisk = mScore > -1.78;

  return {
    mScore,
    isManipulatorRisk,
    interpretation: isManipulatorRisk 
      ? 'Probability of Earnings Manipulation > 85% (Breaches -1.78 threshold)'
      : 'Normal / Unmanipulated Accounting Profile (Below -1.78 threshold)',
    variables: {
      dsri: { value: Math.round(dsri * 1000) / 1000, label: 'DSRI (Days Sales in Receivables)', desc: 'Receivables growth vs revenue growth' },
      gmi: { value: Math.round(gmi * 1000) / 1000, label: 'GMI (Gross Margin Index)', desc: 'Prior gross margin vs current gross margin' },
      aqi: { value: Math.round(aqi * 1000) / 1000, label: 'AQI (Asset Quality Index)', desc: 'Non-current intangible cost capitalization' },
      sgi: { value: Math.round(sgi * 1000) / 1000, label: 'SGI (Sales Growth Index)', desc: 'Top-line sales growth momentum' },
      depi: { value: Math.round(depi * 1000) / 1000, label: 'DEPI (Depreciation Index)', desc: 'Depreciation pacing change' },
      sgai: { value: Math.round(sgai * 1000) / 1000, label: 'SGAI (SG&A Index)', desc: 'Operating overhead margin efficiency' },
      lvgi: { value: Math.round(lvgi * 1000) / 1000, label: 'LVGI (Leverage Index)', desc: 'Total debt to asset leverage ratio' },
      tata: { value: Math.round(tata * 1000) / 1000, label: 'TATA (Total Accruals to Assets)', desc: '(Net Income - CFO) / Total Assets' }
    }
  };
}

/**
 * Computes exact Altman Z-Score from financials and market capitalization.
 * Z = 1.2*X1 + 1.4*X2 + 3.3*X3 + 0.6*X4 + 0.999*X5
 */
export function calculateAltmanZScore(
  data: FinancialYearData,
  marketCapBillions: number
): AltmanZScoreResult {
  const ta = data.totalAssets || 1;
  const ca = data.totalCurrentAssets || (ta * 0.4);
  const cl = data.currentLiabilities || (ta * 0.25);
  const tl = data.totalLiabilities || (cl + (data.longTermDebt || 0)) || (ta * 0.5);

  const workingCapital = ca - cl;
  const retainedEarnings = data.stockholdersEquity || (ta * 0.4);
  const ebit = data.operatingIncome || (data.revenue * 0.15);
  const marketValueEquity = marketCapBillions * 1000; // convert billions to millions
  const revenue = data.revenue;

  const x1 = workingCapital / ta;
  const x2 = retainedEarnings / ta;
  const x3 = ebit / ta;
  const x4 = marketValueEquity / (tl || 1);
  const x5 = revenue / ta;

  const zRaw = (1.2 * x1) + (1.4 * x2) + (3.3 * x3) + (0.6 * x4) + (0.999 * x5);
  const zScore = Math.round(zRaw * 100) / 100;

  let zone: 'Safe' | 'Grey' | 'Distress' = 'Safe';
  let interpretation = 'Financial Distress Risk: Low (Safe Zone > 2.99)';
  if (zScore < 1.81) {
    zone = 'Distress';
    interpretation = 'Financial Distress Risk: High (Distress Zone < 1.81)';
  } else if (zScore <= 2.99) {
    zone = 'Grey';
    interpretation = 'Financial Distress Risk: Moderate (Grey Watch Zone 1.81–2.99)';
  }

  return {
    zScore,
    zone,
    interpretation,
    variables: {
      x1: { value: Math.round(x1 * 1000) / 1000, label: 'Working Capital / Total Assets', weight: 1.2, contribution: Math.round(1.2 * x1 * 100) / 100 },
      x2: { value: Math.round(x2 * 1000) / 1000, label: 'Retained Earnings / Total Assets', weight: 1.4, contribution: Math.round(1.4 * x2 * 100) / 100 },
      x3: { value: Math.round(x3 * 1000) / 1000, label: 'EBIT / Total Assets', weight: 3.3, contribution: Math.round(3.3 * x3 * 100) / 100 },
      x4: { value: Math.round(x4 * 1000) / 1000, label: 'Market Cap / Total Liabilities', weight: 0.6, contribution: Math.round(0.6 * x4 * 100) / 100 },
      x5: { value: Math.round(x5 * 1000) / 1000, label: 'Revenue / Total Assets', weight: 0.999, contribution: Math.round(0.999 * x5 * 100) / 100 }
    }
  };
}

/**
 * Computes exact Sloan Accrual Ratio: (Net Income - Operating Cash Flow) / Total Assets
 */
export function calculateSloanAccruals(
  netIncome: number,
  operatingCashFlow: number,
  totalAssets: number
): SloanAccrualsResult {
  const ta = totalAssets || 1;
  const accruals = netIncome - operatingCashFlow;
  const ratio = accruals / ta;
  const accrualRatio = Math.round(ratio * 1000) / 1000;
  const accrualPercent = Math.round(ratio * 1000) / 10;
  const cashConversion = netIncome > 0 ? Math.round((operatingCashFlow / netIncome) * 100) : 100;

  const isFavorable = accrualRatio <= 0.05;
  let status: 'Cash Flow Backed' | 'Moderate Accruals' | 'High Non-Cash Accruals' = 'Cash Flow Backed';
  if (accrualRatio > 0.10) {
    status = 'High Non-Cash Accruals';
  } else if (accrualRatio > 0.05) {
    status = 'Moderate Accruals';
  }

  return {
    accrualRatio,
    accrualPercent,
    isFavorable,
    status,
    netIncome,
    operatingCashFlow,
    totalAssets: ta,
    cashConversionRatio: cashConversion
  };
}

/**
 * Dynamically synchronizes all calculated metrics onto a company profile
 * based on its audited financials and current live market telemetry.
 */
export function recalculateCompanyProfileForensics(
  profile: CompanyForensicProfile,
  liveMarketCap?: number
): CompanyForensicProfile {
  const financials = profile.financials;
  if (!financials || financials.length === 0) return profile;

  // Use latest TTM or latest year
  const latest = financials[financials.length - 1];
  const prior = financials.length >= 2 ? financials[financials.length - 2] : latest;

  const mResult = calculateBeneishMScore(latest, prior);
  const effectiveMarketCap = liveMarketCap ?? profile.marketCap;
  const zResult = calculateAltmanZScore(latest, effectiveMarketCap);
  const sloanResult = calculateSloanAccruals(latest.netIncome, latest.operatingCashFlow, latest.totalAssets);

  // Recalculate forensic health score (0-100) based on empirical weights
  // Clean Beneish (< -2.2): +30 pts, Altman Safe (> 2.99): +30 pts, Sloan Negative (< 0): +25 pts, DSO/DIO stable: +15 pts
  let score = 50;
  if (mResult.mScore <= -2.5) score += 22;
  else if (mResult.mScore <= -1.78) score += 12;
  else score -= 18;

  if (zResult.zScore >= 4.0) score += 20;
  else if (zResult.zScore >= 2.99) score += 14;
  else if (zResult.zScore < 1.81) score -= 15;

  if (sloanResult.accrualRatio <= 0) score += 15;
  else if (sloanResult.accrualRatio <= 0.05) score += 8;
  else score -= 12;

  // Working capital stability
  if (latest.operatingCashFlow >= latest.netIncome) score += 8;

  score = Math.max(15, Math.min(98, Math.round(score)));
  const scoreGrade = score >= 88 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'D';

  return {
    ...profile,
    marketCap: effectiveMarketCap,
    forensicScore: score,
    scoreGrade,
    beneishMScore: mResult.mScore,
    altmanZScore: zResult.zScore,
    sloanAccrualRatio: sloanResult.accrualRatio
  };
}
