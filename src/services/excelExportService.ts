import * as XLSX from 'xlsx';
import { ALL_FLAG_DEFINITIONS } from '../data/forensicFlags210';
import { SOURCE_DOCUMENTS, MASTER_INPUTS_SHEET } from '../data/sourceDocuments';
import { CompanyForensicProfile, IndustryLens } from '../types';

/**
 * Generates and downloads the comprehensive RedFlag Master Excel Model (.xlsx)
 * with all 7 industry lenses (30 flags each), 27 SEC source documents, and master inputs.
 */
export function exportMasterExcelModel(company?: CompanyForensicProfile): void {
  const wb = XLSX.utils.book_new();

  // 1. If a company is selected, add Company Overview & Active Audit Sheet first
  if (company) {
    const summaryData = [
      ['REDFLAG TERMINAL INSTITUTIONAL AUDIT DOSSIER'],
      ['Generated On', new Date().toISOString()],
      ['Company Name', company.name],
      ['Ticker', company.ticker],
      ['CIK', company.cik],
      ['Industry Lens', company.lens],
      ['Sub-Sector', company.sector],
      ['Stock Price', `$${company.stockPrice.toFixed(2)}`],
      ['Market Cap ($B)', `$${company.marketCap.toFixed(1)}B`],
      ['Forensic Integrity Score', `${company.forensicScore} / 100`],
      ['Integrity Grade', company.scoreGrade],
      ['Beneish M-Score', company.beneishMScore.toFixed(2)],
      ['Altman Z-Score', company.altmanZScore.toFixed(2)],
      ['Sloan Accrual Ratio', `${(company.sloanAccrualRatio * 100).toFixed(2)}%`],
      [],
      ['EXECUTIVE SUMMARY OBSERVATIONS'],
      ...company.executiveSummary.map(bullet => [bullet])
    ];

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Company Audit Summary');

    // Evaluated Company Flags Sheet
    const flagRows = company.flags.map(f => ({
      'Flag ID': f.code,
      'Industry Lens': f.lens,
      'Category': f.category,
      'Flag Title': f.title,
      'Current Value': f.currentValue,
      'Severity Status': f.status,
      'Score Impact': f.scoreImpact,
      'Exact Forensic Formula': f.formula,
      'SEC Disclosure Citation': f.secDisclosureCitation,
      'Benchmark Rule': f.benchmarkRule,
      'Description': f.description,
      'Forensic Risk Explanation': f.riskExplanation
    }));
    const wsCompanyFlags = XLSX.utils.json_to_sheet(flagRows);
    XLSX.utils.book_append_sheet(wb, wsCompanyFlags, `${company.ticker} Flags (${company.flags.length})`);
  }

  // 2. Add each of the 7 Industry Lenses as dedicated sheets
  const lenses: { lens: IndustryLens; sheetName: string }[] = [
    { lens: 'Retail', sheetName: 'Retail (30 Flags)' },
    { lens: 'Payments', sheetName: 'Payments (30 Flags)' },
    { lens: 'SaaS', sheetName: 'SaaS (30 Flags)' },
    { lens: 'Banks', sheetName: 'Banks (30 Flags)' },
    { lens: 'Tech Hardware', sheetName: 'Tech Hardware (30 Flags)' },
    { lens: 'Healthcare', sheetName: 'Healthcare (30 Flags)' },
    { lens: 'AI/Deep Tech', sheetName: 'AI & Deep Tech (30 Flags)' }
  ];

  lenses.forEach(({ lens, sheetName }) => {
    const lensFlags = ALL_FLAG_DEFINITIONS.filter(f => f.lens === lens);
    const rows = lensFlags.map((f, i) => ({
      '#': i + 1,
      'Flag ID': f.code,
      'Industry Lens': f.lens,
      'Category': f.category,
      'Flag Name': f.title,
      'Exact Formula': f.formula,
      'Benchmark / Threshold Rule': f.benchmarkRule,
      'Default Severity': f.defaultSeverity,
      'Score Impact (-Pts)': f.scoreImpact,
      'SEC Filing Citation': f.secDisclosureCitation,
      'Data Source Priority': f.dataSource,
      'Description': f.description,
      'Forensic Risk Explanation': f.riskExplanation
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  // 3. SEC 27 Primary Source Documents Sheet
  const sourceDocRows = SOURCE_DOCUMENTS.map((doc, idx) => ({
    'Doc #': idx + 1,
    'Doc Code': doc.code,
    'Source Document Name': doc.name,
    'What It Contains': doc.contains,
    'Typical SEC Filing Location': doc.typicalLocation,
    'Value Mode': doc.valueMode,
    'TTM vs Direct Extraction Notes': doc.ttmNotes,
    'Relevant Industry Sectors': doc.relevantSectors
  }));
  const wsSourceDocs = XLSX.utils.json_to_sheet(sourceDocRows);
  XLSX.utils.book_append_sheet(wb, wsSourceDocs, '27 SEC Source Documents');

  // 4. Master Inputs Sheet
  const masterInputRows = MASTER_INPUTS_SHEET.map((inp, idx) => ({
    'Item #': idx + 1,
    'Input Code': inp.id,
    'SEC Source Doc': `${inp.docCode} - ${inp.docName}`,
    'Metric / Input Name': inp.name,
    'Description': inp.description,
    'Extraction / Formula': inp.formulaOrExtraction,
    'Value Extraction Mode': inp.valueMode,
    'Instruction Type': inp.isWordInstruction ? 'Word Instruction' : 'Numeric Value',
    'Relevant Sectors': inp.sectors.join(', '),
    'AI Agent Directive': inp.aiAgentDirective || 'N/A'
  }));
  const wsMasterInputs = XLSX.utils.json_to_sheet(masterInputRows);
  XLSX.utils.book_append_sheet(wb, wsMasterInputs, 'Master Inputs Sheet');

  // Write and trigger download
  const fileName = company 
    ? `RedFlag_${company.ticker}_Forensic_Model_${new Date().toISOString().split('T')[0]}.xlsx`
    : `RedFlag_Master_Forensic_Model_210_Flags_${new Date().toISOString().split('T')[0]}.xlsx`;

  XLSX.writeFile(wb, fileName);
}
