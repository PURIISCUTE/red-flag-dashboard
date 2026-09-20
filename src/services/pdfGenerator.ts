import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CompanyForensicProfile } from '../types';

export function generateAuditPdf(company: CompanyForensicProfile): void {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ----------------------------------------------------
    // PAGE 1: EXECUTIVE AUDIT DOSSIER & SUMMARY
    // ----------------------------------------------------
    // Dark terminal background header band
    doc.setFillColor(8, 11, 16); // #080B10
    doc.rect(0, 0, pageWidth, 90, 'F');

    // Red accent line
    doc.setFillColor(255, 77, 77); // #FF4D4D
    doc.rect(0, 88, pageWidth, 3, 'F');

    // Title & Branding
    doc.setTextColor(255, 77, 77);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('REDFLAG TERMINAL', 36, 36);

    doc.setTextColor(180, 190, 205);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('ENTERPRISE FINANCIAL FORENSICS & SEC AUDIT DOSSIER', 36, 52);

    doc.setTextColor(130, 145, 165);
    doc.setFontSize(8);
    doc.text(`CONFIDENTIALITY: LEVEL 3 AUDIT | GENERATED: 2026-09-20 | SEC EDGAR & YAHOO CERTIFIED`, 36, 68);

    // Company Snapshot Block
    doc.setTextColor(20, 25, 35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`${company.name} (${company.ticker})`, 36, 118);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 90, 105);
    doc.text(`CIK: ${company.cik}  |  Sector: ${company.sector}  |  Lens: ${company.lens}`, 36, 134);
    doc.text(`Market Cap: $${company.marketCap}B  |  Stock Price: $${company.stockPrice} (${company.priceChangePercent >= 0 ? '+' : ''}${company.priceChangePercent}%)  |  Beta: ${company.beta}`, 36, 148);

    // Score Badges & Forensics Box
    doc.setFillColor(15, 19, 28); // #0F131C
    doc.roundedRect(36, 162, pageWidth - 72, 80, 3, 3, 'F');
    doc.setDrawColor(255, 77, 77);
    doc.setLineWidth(1);
    doc.roundedRect(36, 162, pageWidth - 72, 80, 3, 3, 'S');

    // Score Circle/Block
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('FORENSIC HEALTH SCORE', 52, 184);

    doc.setTextColor(255, 77, 77);
    doc.setFontSize(28);
    doc.text(`${company.forensicScore}/100`, 52, 218);

    doc.setTextColor(255, 200, 200);
    doc.setFontSize(10);
    doc.text(`GRADE: ${company.scoreGrade}`, 52, 232);

    // Key ratios in the box
    doc.setTextColor(180, 190, 205);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    const colX1 = 220;
    doc.text('Beneish M-Score:', colX1, 184);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(company.beneishMScore < -1.78 ? 56 : 229, company.beneishMScore < -1.78 ? 161 : 62, company.beneishMScore < -1.78 ? 105 : 62);
    doc.text(`${company.beneishMScore} (${company.beneishMScore < -1.78 ? 'Unmanipulated' : 'Risk Elevated'})`, colX1 + 105, 184);

    doc.setTextColor(180, 190, 205);
    doc.setFont('helvetica', 'normal');
    doc.text('Altman Z-Score:', colX1, 204);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(company.altmanZScore > 2.99 ? 56 : 229, company.altmanZScore > 2.99 ? 161 : 62, company.altmanZScore > 2.99 ? 105 : 62);
    doc.text(`${company.altmanZScore} (${company.altmanZScore > 2.99 ? 'Safe Zone' : 'Distress Risk'})`, colX1 + 105, 204);

    doc.setTextColor(180, 190, 205);
    doc.setFont('helvetica', 'normal');
    doc.text('Sloan Accrual Ratio:', colX1, 224);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(company.sloanAccrualRatio < 0.05 ? 56 : 229, company.sloanAccrualRatio < 0.05 ? 161 : 62, company.sloanAccrualRatio < 0.05 ? 105 : 62);
    doc.text(`${(company.sloanAccrualRatio * 100).toFixed(1)}% (${company.sloanAccrualRatio < 0.05 ? 'Healthy Cash Backing' : 'High Accruals'})`, colX1 + 105, 224);

    // AI Executive Summary (Max 4 concise bullets)
    doc.setTextColor(20, 25, 35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('AUTONOMOUS AI FORENSIC THESIS & EXECUTIVE SUMMARY', 36, 268);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(45, 55, 72);

    let summaryY = 286;
    company.executiveSummary.slice(0, 4).forEach((bullet) => {
      doc.setFillColor(255, 77, 77);
      doc.circle(42, summaryY - 3, 2.5, 'F');
      const lines = doc.splitTextToSize(bullet, pageWidth - 90);
      doc.text(lines, 52, summaryY);
      summaryY += lines.length * 13 + 4;
    });

    // 5-Year + TTM Financial Trajectory Table (FY22 - FY26 & TTM)
    doc.setTextColor(20, 25, 35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('MULTI-YEAR AUDITED FINANCIAL ENGINE (FY22 - FY26 + TTM)', 36, summaryY + 16);

    const financialHead = [['Metric (USD M)', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'TTM']];
    const finMap = [
      { name: 'Revenue', key: 'revenue', format: (v: number) => `$${v.toLocaleString()}` },
      { name: 'Gross Profit', key: 'grossProfit', format: (v: number) => `$${v.toLocaleString()}` },
      { name: 'Gross Margin %', key: 'grossMarginPct', format: (v: number) => `${v}%` },
      { name: 'Operating Income', key: 'operatingIncome', format: (v: number) => `$${v.toLocaleString()}` },
      { name: 'Net Income', key: 'netIncome', format: (v: number) => `$${v.toLocaleString()}` },
      { name: 'Operating Cash Flow', key: 'operatingCashFlow', format: (v: number) => `$${v.toLocaleString()}` },
      { name: 'Free Cash Flow', key: 'freeCashFlow', format: (v: number) => `$${v.toLocaleString()}` },
      { name: 'Accrual Ratio', key: 'accrualRatio', format: (v: number) => `${(v * 100).toFixed(1)}%` },
      { name: 'Days Sales Out. (DSO)', key: 'dso', format: (v: number) => `${v} d` }
    ];

    const finRows = finMap.map((m) => {
      const row = [m.name];
      company.financials.forEach((f) => {
        const val = (f as unknown as Record<string, number>)[m.key];
        row.push(m.format(val));
      });
      return row;
    });

    autoTable(doc, {
      startY: summaryY + 24,
      head: financialHead,
      body: finRows,
      theme: 'grid',
      styles: {
        fontSize: 7.5,
        cellPadding: 3.5,
        textColor: [40, 45, 55]
      },
      headStyles: {
        fillColor: [15, 19, 28],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { left: 36, right: 36 }
    });

    // Top Critical Anomalies & Warning Flags on Page 1
    const criticalFlags = company.flags.filter((f) => f.status === 'Critical Anomaly' || f.status === 'Warning');
    const lastTableY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY || 520;

    doc.setTextColor(20, 25, 35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`TOP FORENSIC ANOMALY SIGNALS (${criticalFlags.length} Flagged)`, 36, lastTableY + 20);

    const alertHead = [['Flag Code', 'Category', 'Forensic Audit Observation', 'Status', 'Data Source']];
    const alertRows = criticalFlags.slice(0, 5).map((f) => [
      f.code,
      f.category,
      f.title,
      f.status,
      f.dataSource
    ]);

    autoTable(doc, {
      startY: lastTableY + 26,
      head: alertHead,
      body: alertRows.length > 0 ? alertRows : [['NONE', 'General Audit', 'No critical forensic anomalies detected in primary SEC disclosures', 'Healthy', 'SEC EDGAR (P1)']],
      theme: 'grid',
      styles: {
        fontSize: 7.5,
        cellPadding: 3.5
      },
      headStyles: {
        fillColor: [229, 62, 62],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      columnStyles: {
        3: {
          fontStyle: 'bold',
          textColor: [229, 62, 62]
        }
      },
      margin: { left: 36, right: 36 }
    });

    // Page 1 Footer Disclaimer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 130, 145);
    doc.text('© 2026 RedFlag Terminal. For informational purposes only — not investment advice. Data sourced via SEC EDGAR, Yahoo Finance, and Benchmark Feeds.', 36, pageHeight - 24);
    doc.text('Page 1 of 8 | Confidential Audit Report', pageWidth - 180, pageHeight - 24);

    // ----------------------------------------------------
    // PAGE 2+: COMPREHENSIVE 210-FLAG MATRIX
    // ----------------------------------------------------
    doc.addPage();

    // Page 2 Header
    doc.setFillColor(8, 11, 16);
    doc.rect(0, 0, pageWidth, 50, 'F');
    doc.setFillColor(255, 77, 77);
    doc.rect(0, 48, pageWidth, 2, 'F');

    doc.setTextColor(255, 77, 77);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('REDFLAG TERMINAL — 210-FLAG INDUSTRY FORENSIC MATRIX', 36, 24);

    doc.setTextColor(180, 190, 205);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`${company.name} (${company.ticker}) | All 7 Industry Lenses (30 Flags/Lens) | Strict SEC EDGAR & Yahoo Priority`, 36, 38);

    const fullMatrixHead = [['Code', 'Lens', 'Category', 'Forensic Flag Title', 'Signal Status', 'TTM Value', 'Data Source']];
    const fullMatrixRows = company.flags.map((f) => [
      f.code,
      f.lens,
      f.category,
      f.title,
      f.status,
      f.currentValue,
      f.dataSource
    ]);

    autoTable(doc, {
      startY: 65,
      head: fullMatrixHead,
      body: fullMatrixRows,
      theme: 'striped',
      styles: {
        fontSize: 7,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [15, 19, 28],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 4) {
          const val = data.cell.raw;
          if (val === 'Critical Anomaly') {
            data.cell.styles.textColor = [229, 62, 62];
            data.cell.styles.fontStyle = 'bold';
          } else if (val === 'Warning') {
            data.cell.styles.textColor = [214, 158, 46];
            data.cell.styles.fontStyle = 'bold';
          } else {
            data.cell.styles.textColor = [56, 161, 105];
          }
        }
      },
      margin: { left: 36, right: 36, bottom: 40 },
      didDrawPage: (data) => {
        // Page footer on subsequent pages
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(130, 140, 155);
        doc.text(`© 2026 RedFlag Terminal. Data Ground Truth: SEC EDGAR API | Page ${data.pageNumber} of Audit Matrix`, 36, pageHeight - 18);
      }
    });

    // Save PDF directly to user's downloads
    doc.save(`${company.ticker}_RedFlag_Forensic_Audit_Report.pdf`);
  } catch (err) {
    console.error('Failed to generate audit PDF:', err);
    alert('PDF Generation failed. Please ensure popup blockers are not active and try again.');
  }
}
