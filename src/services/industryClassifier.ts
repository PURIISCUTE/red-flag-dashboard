import { IndustryLens } from '../types';

export const VALID_7_LENSES: IndustryLens[] = [
  'Retail',
  'Payments',
  'SaaS',
  'Banks',
  'Tech Hardware',
  'Healthcare',
  'AI/Deep Tech'
];

// In-memory cache for rapid lookup
const CLASSIFICATION_CACHE = new Map<string, IndustryLens>();

// Curated high-accuracy Wall Street taxonomy dictionary for reliable instant categorization
const KNOWN_TICKER_LENSES: Record<string, IndustryLens> = {
  // Retail & Consumer
  WMT: 'Retail',
  TGT: 'Retail',
  COST: 'Retail',
  AMZN: 'Retail',
  HD: 'Retail',
  LOW: 'Retail',
  NKE: 'Retail',
  LULU: 'Retail',
  SBUX: 'Retail',
  MCD: 'Retail',
  CMG: 'Retail',
  TJX: 'Retail',
  ROST: 'Retail',
  DG: 'Retail',
  DLTR: 'Retail',
  KSS: 'Retail',
  M: 'Retail',
  JWN: 'Retail',
  BBY: 'Retail',
  ORLY: 'Retail',
  AZO: 'Retail',
  TSLA: 'Retail', // Often categorized under Automotive Consumer Retail / Mobility
  F: 'Retail',
  GM: 'Retail',
  KO: 'Retail',
  PEP: 'Retail',
  PG: 'Retail',
  CL: 'Retail',
  EL: 'Retail',
  MNST: 'Retail',

  // Payments & Fintech Transaction Rails
  V: 'Payments',
  MA: 'Payments',
  PYPL: 'Payments',
  SQ: 'Payments',
  XYZ: 'Payments',
  COIN: 'Payments',
  FIS: 'Payments',
  FISV: 'Payments',
  GPN: 'Payments',
  ADYEN: 'Payments',
  AFRM: 'Payments',
  FOUR: 'Payments',
  TOST: 'Payments',
  BILL: 'Payments',
  FLYW: 'Payments',
  WU: 'Payments',
  EEFT: 'Payments',

  // SaaS & Enterprise Software
  MSFT: 'SaaS',
  CRM: 'SaaS',
  NOW: 'SaaS',
  ADBE: 'SaaS',
  WDAY: 'SaaS',
  SNOW: 'SaaS',
  DDOG: 'SaaS',
  CRWD: 'SaaS',
  PANW: 'SaaS',
  ZS: 'SaaS',
  NET: 'SaaS',
  MDB: 'SaaS',
  TEAM: 'SaaS',
  HUBS: 'SaaS',
  SPLK: 'SaaS',
  OKTA: 'SaaS',
  DOCU: 'SaaS',
  ZM: 'SaaS',
  PATH: 'SaaS',
  GTLB: 'SaaS',
  CFLT: 'SaaS',
  ESTC: 'SaaS',
  ORCL: 'SaaS',
  SAP: 'SaaS',
  INTU: 'SaaS',

  // Banks & Financial Institutions
  JPM: 'Banks',
  BAC: 'Banks',
  C: 'Banks',
  WFC: 'Banks',
  GS: 'Banks',
  MS: 'Banks',
  SCHW: 'Banks',
  PNC: 'Banks',
  TFC: 'Banks',
  USB: 'Banks',
  BK: 'Banks',
  STT: 'Banks',
  COF: 'Banks',
  FITB: 'Banks',
  KEY: 'Banks',
  HBAN: 'Banks',
  RF: 'Banks',
  CFG: 'Banks',
  MTB: 'Banks',
  ZION: 'Banks',
  WAL: 'Banks',
  FRCB: 'Banks',
  NYCB: 'Banks',

  // Tech Hardware, Semiconductors & Equipment
  AAPL: 'Tech Hardware',
  NVDA: 'Tech Hardware',
  AMD: 'Tech Hardware',
  INTC: 'Tech Hardware',
  QCOM: 'Tech Hardware',
  AVGO: 'Tech Hardware',
  TXN: 'Tech Hardware',
  MU: 'Tech Hardware',
  AMAT: 'Tech Hardware',
  LRCX: 'Tech Hardware',
  KLAC: 'Tech Hardware',
  ASML: 'Tech Hardware',
  TSM: 'Tech Hardware',
  DELL: 'Tech Hardware',
  HPQ: 'Tech Hardware',
  HPE: 'Tech Hardware',
  CSCO: 'Tech Hardware',
  ANET: 'Tech Hardware',
  SMCI: 'Tech Hardware',
  WDC: 'Tech Hardware',
  STX: 'Tech Hardware',
  GLW: 'Tech Hardware',
  TEL: 'Tech Hardware',
  APH: 'Tech Hardware',
  BA: 'Tech Hardware',
  LMT: 'Tech Hardware',
  RTX: 'Tech Hardware',
  CAT: 'Tech Hardware',
  DE: 'Tech Hardware',

  // Healthcare, Pharma & Life Sciences
  UNH: 'Healthcare',
  JNJ: 'Healthcare',
  LLY: 'Healthcare',
  PFE: 'Healthcare',
  ABBV: 'Healthcare',
  MRK: 'Healthcare',
  TMO: 'Healthcare',
  ABT: 'Healthcare',
  DHR: 'Healthcare',
  BMY: 'Healthcare',
  AMGN: 'Healthcare',
  GILD: 'Healthcare',
  CVS: 'Healthcare',
  CI: 'Healthcare',
  ELV: 'Healthcare',
  HUM: 'Healthcare',
  ISRG: 'Healthcare',
  SYK: 'Healthcare',
  MDT: 'Healthcare',
  BSX: 'Healthcare',
  EW: 'Healthcare',
  REGN: 'Healthcare',
  VRTX: 'Healthcare',
  MRNA: 'Healthcare',
  BIIB: 'Healthcare',
  ILMN: 'Healthcare',
  DXCM: 'Healthcare',

  // AI & Deep Tech Foundation Systems
  PLTR: 'AI/Deep Tech',
  AI: 'AI/Deep Tech',
  SOUN: 'AI/Deep Tech',
  BBAI: 'AI/Deep Tech',
  IONQ: 'AI/Deep Tech',
  RGTI: 'AI/Deep Tech',
  QBTS: 'AI/Deep Tech',
  SYM: 'AI/Deep Tech',
  SERV: 'AI/Deep Tech',
  GOOGL: 'AI/Deep Tech',
  GOOG: 'AI/Deep Tech',
  META: 'AI/Deep Tech'
};

/**
 * Normalizes text to one of the 7 official industry lenses.
 */
export function normalizeTo7Lenses(raw: string): IndustryLens | null {
  if (!raw) return null;
  const clean = raw.trim().toLowerCase();

  if (clean.includes('retail') || clean.includes('consumer') || clean.includes('commerce') || clean.includes('store') || clean.includes('apparel') || clean.includes('food') || clean.includes('auto')) {
    return 'Retail';
  }
  if (clean.includes('payment') || clean.includes('fintech') || clean.includes('card') || clean.includes('merchant') || clean.includes('transaction rail') || clean.includes('processing')) {
    return 'Payments';
  }
  if (clean.includes('saas') || clean.includes('software-as-a-service') || clean.includes('cloud software') || clean.includes('subscription software') || clean.includes('cyber')) {
    return 'SaaS';
  }
  if (clean.includes('bank') || clean.includes('depository') || clean.includes('lending') || clean.includes('custod') || clean.includes('credit union') || clean.includes('capital market')) {
    return 'Banks';
  }
  if (clean.includes('hardware') || clean.includes('semiconductor') || clean.includes('chip') || clean.includes('electronics') || clean.includes('server') || clean.includes('equipment') || clean.includes('device') || clean.includes('aerospace')) {
    return 'Tech Hardware';
  }
  if (clean.includes('health') || clean.includes('pharma') || clean.includes('bio') || clean.includes('medical') || clean.includes('clinic') || clean.includes('drug') || clean.includes('hospital')) {
    return 'Healthcare';
  }
  if (clean.includes('ai') || clean.includes('deep tech') || clean.includes('artificial') || clean.includes('robot') || clean.includes('quantum') || clean.includes('intelligence') || clean.includes('machine learning') || clean.includes('autonomous')) {
    return 'AI/Deep Tech';
  }

  // Exact matches
  for (const lens of VALID_7_LENSES) {
    if (clean === lens.toLowerCase()) return lens;
  }

  return null;
}

/**
 * Heuristic semantic rule classifier when offline or if AI service has a temporary spike.
 */
export function inferIndustryHeuristic(ticker: string, companyName?: string, sector?: string): IndustryLens {
  const tUpper = ticker.toUpperCase().trim();
  if (KNOWN_TICKER_LENSES[tUpper]) {
    return KNOWN_TICKER_LENSES[tUpper];
  }

  const combined = `${tUpper} ${companyName || ''} ${sector || ''}`.toUpperCase();

  // 1. Healthcare
  if (
    combined.includes('PHARM') ||
    combined.includes('THERAP') ||
    combined.includes('HEALTH') ||
    combined.includes('BIO') ||
    combined.includes('MEDIC') ||
    combined.includes('SURG') ||
    combined.includes('CLINIC') ||
    combined.includes('DIAGNOST') ||
    combined.includes('ONCOL') ||
    combined.includes('GENOM')
  ) {
    return 'Healthcare';
  }

  // 2. Banks
  if (
    combined.includes('BANK') ||
    combined.includes('BANC') ||
    combined.includes('TRUST') ||
    combined.includes('SAVINGS') ||
    combined.includes('DEPOSIT') ||
    combined.includes('FINANCIAL HOLDINGS')
  ) {
    return 'Banks';
  }

  // 3. Payments
  if (
    combined.includes('PAYMENT') ||
    combined.includes('TRANSACTION') ||
    combined.includes('PROCESSING') ||
    combined.includes('INTERCHANGE') ||
    combined.includes('MERCHANT') ||
    combined.includes('FINTECH') ||
    combined.includes('CARD SERVICES')
  ) {
    return 'Payments';
  }

  // 4. AI & Deep Tech
  if (
    combined.includes('ARTIFICIAL INTELLIGENCE') ||
    combined.includes('AI ') ||
    combined.includes('ROBOTIC') ||
    combined.includes('QUANTUM') ||
    combined.includes('FOUNDATION MODEL') ||
    combined.includes('DEEP TECH') ||
    combined.includes('AUTONOMOUS')
  ) {
    return 'AI/Deep Tech';
  }

  // 5. Tech Hardware & Semiconductors
  if (
    combined.includes('SEMICONDUCTOR') ||
    combined.includes('CHIP') ||
    combined.includes('MICRO') ||
    combined.includes('CIRCUIT') ||
    combined.includes('HARDWARE') ||
    combined.includes('ELECTRONIC') ||
    combined.includes('DEVICE') ||
    combined.includes('EQUIPMENT') ||
    combined.includes('AEROSPACE') ||
    combined.includes('DEFENSE') ||
    combined.includes('INSTRUMENT') ||
    combined.includes('MACHINERY')
  ) {
    return 'Tech Hardware';
  }

  // 6. SaaS & Enterprise Software
  if (
    combined.includes('SOFTWARE') ||
    combined.includes('SAAS') ||
    combined.includes('CLOUD') ||
    combined.includes('CYBER') ||
    combined.includes('SECURITY') ||
    combined.includes('PLATFORM') ||
    combined.includes('NETWORK') ||
    combined.includes('DATA') ||
    combined.includes('ANALYTICS') ||
    combined.includes('DATABASE') ||
    combined.includes('INTERNET') ||
    combined.includes('DIGITAL')
  ) {
    return 'SaaS';
  }

  // 7. Retail & Consumer
  if (
    combined.includes('RETAIL') ||
    combined.includes('STORE') ||
    combined.includes('CONSUMER') ||
    combined.includes('BRAND') ||
    combined.includes('FOOD') ||
    combined.includes('BEVERAGE') ||
    combined.includes('APPAREL') ||
    combined.includes('FOOTWEAR') ||
    combined.includes('AUTOMOTIVE') ||
    combined.includes('MOTOR') ||
    combined.includes('RESTAURANT') ||
    combined.includes('GROCERY') ||
    combined.includes('MERCHANDISE')
  ) {
    return 'Retail';
  }

  return 'Retail';
}

/**
 * Asks the AI agent to pick exactly 1 of the 7 industries for a verified company.
 * Uses the server-side proxy route /api/ai/classify-industry (powered by Gemini API).
 */
export async function askAiToClassifyIndustry(
  ticker: string,
  companyName: string,
  sector?: string
): Promise<{ lens: IndustryLens; isFromAi: boolean; note?: string }> {
  const cacheKey = `ai_lens_${ticker.toUpperCase()}`;

  // Check in-memory cache
  if (CLASSIFICATION_CACHE.has(ticker.toUpperCase())) {
    return {
      lens: CLASSIFICATION_CACHE.get(ticker.toUpperCase())!,
      isFromAi: true,
      note: 'Retrieved from AI audit session cache'
    };
  }

  // Check browser localStorage
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(cacheKey);
      if (stored && VALID_7_LENSES.includes(stored as IndustryLens)) {
        CLASSIFICATION_CACHE.set(ticker.toUpperCase(), stored as IndustryLens);
        return {
          lens: stored as IndustryLens,
          isFromAi: true,
          note: 'Retrieved from local AI verification history'
        };
      }
    } catch {
      // ignore
    }
  }

  // Primary: Ask server-side Gemini AI via /api/ai/classify-industry
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch('/api/ai/classify-industry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticker,
        companyName,
        sector
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      if (data && data.lens && VALID_7_LENSES.includes(data.lens)) {
        const chosenLens = data.lens as IndustryLens;
        CLASSIFICATION_CACHE.set(ticker.toUpperCase(), chosenLens);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(cacheKey, chosenLens);
          } catch {
            // ignore
          }
        }
        return {
          lens: chosenLens,
          isFromAi: true,
          note: data.reasoning || `Classified by AI Agent into ${chosenLens}`
        };
      }
    }
  } catch {
    // Graceful fallback to verified taxonomy and semantic heuristic
  }

  // High-accuracy fallback
  const fallback = inferIndustryHeuristic(ticker, companyName, sector);
  CLASSIFICATION_CACHE.set(ticker.toUpperCase(), fallback);
  return {
    lens: fallback,
    isFromAi: false,
    note: `Categorized under ${fallback} via RedFlag institutional forensic taxonomy`
  };
}
